// Refreshes src/data/publications-snapshot.json from PubMed.
// Run weekly by .github/workflows/weekly-publications.yml: when the list changes,
// the commit triggers a new build so new papers appear on the site.
// (Every build also loads PubMed live; the snapshot is the fallback if PubMed is down.)
import { readFileSync, writeFileSync } from 'node:fs';

const EUTILS = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';
const TOOL = 'tool=nokitlab-website';
const SNAPSHOT = 'src/data/publications-snapshot.json';

const settings = readFileSync('src/content/settings/site.yml', 'utf8');
const query = settings.match(/^pubmed_query:\s*(.+)$/m)?.[1].trim().replace(/^['"]|['"]$/g, '');
if (!query) throw new Error('pubmed_query not found in site settings');

async function fetchJson(url) {
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

const search = await fetchJson(
  `${EUTILS}/esearch.fcgi?db=pubmed&retmode=json&retmax=500&sort=pub_date&${TOOL}&term=${encodeURIComponent(query)}`,
);
const ids = search?.esearchresult?.idlist ?? [];
const pubs = [];
for (let i = 0; i < ids.length; i += 200) {
  const chunk = ids.slice(i, i + 200);
  const summary = await fetchJson(`${EUTILS}/esummary.fcgi?db=pubmed&retmode=json&${TOOL}&id=${chunk.join(',')}`);
  for (const uid of summary?.result?.uids ?? []) {
    const r = summary.result[uid];
    const doi = (r.articleids ?? []).find((a) => a.idtype === 'doi')?.value;
    const date = r.sortpubdate || r.pubdate || '';
    pubs.push({
      title: clean(r.title),
      authors: (r.authors ?? []).filter((a) => a.authtype === 'Author').map((a) => a.name),
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
if (pubs.length === 0) throw new Error(`PubMed returned no papers for "${query}"; keeping the old snapshot`);
writeFileSync(SNAPSHOT, JSON.stringify(pubs, null, 2) + '\n');
console.log(`Saved ${pubs.length} papers for "${query}"`);
