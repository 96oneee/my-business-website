import { getCollection } from 'astro:content';
import snapshot from '../data/publications-snapshot.json';
import { getSettings } from './site';

export interface Publication {
  title: string;
  authors: string[];
  journal: string;
  year: number;
  date: string;
  pmid?: string;
  doi?: string;
  url?: string;
  note?: string;
  featured: boolean;
}

const EUTILS = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';
const TOOL = 'tool=nokitlab-website';

async function fetchJson(url: string) {
  const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`PubMed responded ${res.status}`);
  return res.json();
}

const clean = (s = '') =>
  s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/<[^>]+>/g, '')
    .replace(/\.$/, '');

async function fetchFromPubMed(query: string): Promise<Publication[]> {
  const search = await fetchJson(
    `${EUTILS}/esearch.fcgi?db=pubmed&retmode=json&retmax=500&sort=pub_date&${TOOL}&term=${encodeURIComponent(query)}`,
  );
  const ids: string[] = search?.esearchresult?.idlist ?? [];
  const pubs: Publication[] = [];
  for (let i = 0; i < ids.length; i += 200) {
    const chunk = ids.slice(i, i + 200);
    const summary = await fetchJson(`${EUTILS}/esummary.fcgi?db=pubmed&retmode=json&${TOOL}&id=${chunk.join(',')}`);
    for (const uid of summary?.result?.uids ?? []) {
      const r = summary.result[uid];
      const doi = (r.articleids ?? []).find((a: any) => a.idtype === 'doi')?.value;
      const date = r.sortpubdate || r.pubdate || '';
      pubs.push({
        title: clean(r.title),
        authors: (r.authors ?? []).filter((a: any) => a.authtype === 'Author').map((a: any) => a.name),
        journal: r.fulljournalname || r.source || '',
        year: parseInt(String(date).slice(0, 4), 10) || 0,
        date,
        pmid: uid,
        doi,
        url: `https://pubmed.ncbi.nlm.nih.gov/${uid}/`,
        featured: false,
      });
    }
  }
  return pubs;
}

let cache: Promise<{ items: Publication[]; live: boolean }> | undefined;

/** All publications: PubMed (fetched once per build) + admin overrides. */
export function getPublications() {
  cache ??= load();
  return cache;
}

async function load() {
  const settings = await getSettings();
  const overrides = (await getCollection('publicationOverrides'))[0]?.data;
  let items: Publication[] = [];
  let live = true;
  try {
    items = await fetchFromPubMed(settings.pubmed_query);
  } catch (err) {
    live = false;
    console.warn(`[publications] PubMed fetch failed, using snapshot: ${(err as Error).message}`);
    items = snapshot as Publication[];
  }

  const hidden = new Set((overrides?.hidden_pmids ?? []).map(String));
  const featured = new Set((overrides?.featured_pmids ?? []).map(String));
  items = items
    .filter((p) => !p.pmid || !hidden.has(p.pmid))
    .map((p) => ({ ...p, featured: !!p.pmid && featured.has(p.pmid) }));

  for (const e of overrides?.extra ?? []) {
    const pmid = e.pmid ? String(e.pmid) : undefined;
    if (pmid && items.some((p) => p.pmid === pmid)) continue;
    items.push({
      title: e.title,
      authors: e.authors.split(/,\s*/).filter(Boolean),
      journal: e.journal,
      year: Number(e.year) || 0,
      date: String(e.year),
      pmid,
      doi: e.doi ?? undefined,
      url: e.url ?? (e.doi ? `https://doi.org/${e.doi}` : pmid ? `https://pubmed.ncbi.nlm.nih.gov/${pmid}/` : undefined),
      note: e.note ?? undefined,
      featured: e.featured,
    });
  }

  items.sort((a, b) => b.date.localeCompare(a.date) || b.year - a.year);
  return { items, live };
}

/** Bold the PI's name in an author list. */
export function isLabAuthor(name: string) {
  return /^Khalil A(\b|$)/.test(name);
}
