import { getCollection, getEntry } from 'astro:content';
import { marked } from 'marked';

export async function getSettings() {
  const entry = await getEntry('settings', 'site');
  if (!entry) throw new Error('Missing src/content/settings/site.yml');
  return entry.data;
}

/** Render a short Markdown string from a front-matter field. */
export function md(text?: string | null) {
  return text ? (marked.parse(text, { async: false }) as string) : '';
}

export function mdInline(text?: string | null) {
  return text ? (marked.parseInline(text, { async: false }) as string) : '';
}

export const GROUPS = [
  { key: 'pi', label: 'Principal Investigator' },
  { key: 'manager', label: 'Lab Manager' },
  { key: 'postdoc', label: 'Postdoctoral Fellows' },
  { key: 'ra', label: 'Research Assistants' },
  { key: 'grad', label: 'Graduate Students' },
  { key: 'intern', label: 'Interns' },
  { key: 'undergrad', label: 'Undergraduate Students' },
  { key: 'alumni', label: 'Alumni' },
] as const;

export async function getPeople() {
  const people = await getCollection('people', ({ data }) => data.visible !== false);
  return people.sort((a, b) => a.data.order - b.data.order || a.data.name.localeCompare(b.data.name));
}

export async function getResearch() {
  const items = await getCollection('research', ({ data }) => data.active !== false);
  return items.sort((a, b) => a.data.order - b.data.order);
}

let newsCache: ReturnType<typeof loadNews> | undefined;
async function loadNews() {
  const items = await getCollection('news', ({ data }) => !data.draft);
  return items.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
export function getNews() {
  newsCache ??= loadNews();
  return newsCache;
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function formatDate(d: Date) {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}
