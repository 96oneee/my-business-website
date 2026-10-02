import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const link = z.object({ label: z.string(), url: z.string() });

const settings = defineCollection({
  loader: glob({ pattern: '*.yml', base: './src/content/settings' }),
  schema: z.object({
    lab_name: z.string(),
    tagline: z.string(),
    eyebrow: z.string().default(''),
    hero_headline: z.string(),
    hero_description: z.string(),
    primary_button: z.object({ label: z.string(), link: z.string() }),
    secondary_button: z.object({ label: z.string(), link: z.string() }),
    affiliations: z.array(z.object({ name: z.string(), url: z.string().optional() })).default([]),
    emails: z.array(z.string()).default([]),
    phone: z.string().default(''),
    address: z.string().default(''),
    instagram: z.string().default(''),
    map_embed_url: z.string().default(''),
    map_link: z.string().default(''),
    pubmed_query: z.string(),
    pubmed_link: z.string(),
    footer_text: z.string().default(''),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    intro: z.string().default(''),
    image: z.string().nullish(),
    sections: z.array(z.object({ heading: z.string(), text: z.string() })).default([]),
  }),
});

const research = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/research' }),
  schema: z.object({
    title: z.string(),
    order: z.number().default(99),
    question: z.string().default(''),
    summary: z.string().default(''),
    icon: z.enum(['dna', 'lungs', 'microscope', 'cell', 'scissors']).default('dna'),
    image: z.string().nullish(),
    active: z.boolean().default(true),
  }),
});

const people = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/people' }),
  schema: z.object({
    name: z.string(),
    title: z.string().nullish(),
    group: z.enum(['pi', 'manager', 'ra', 'postdoc', 'grad', 'intern', 'undergrad', 'alumni']),
    position: z.string().default(''),
    order: z.number().default(99),
    photo: z.string().nullish(),
    summary: z.string().default(''),
    description: z.string().nullish(),
    fun_fact: z.string().nullish(),
    hobbies: z.string().nullish(),
    emails: z.array(z.string()).default([]),
    links: z.array(link).default([]),
    affiliations: z.array(z.object({ title: z.string(), lines: z.array(z.string()).default([]) })).default([]),
    start_year: z.union([z.number(), z.string()]).nullish(),
    end_year: z.union([z.number(), z.string()]).nullish(),
    now_at: z.string().nullish(),
    visible: z.boolean().default(true),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    image: z.string().nullish(),
    summary: z.string().default(''),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const publicationOverrides = defineCollection({
  loader: glob({ pattern: '*.yml', base: './src/content/publications' }),
  schema: z.object({
    hidden_pmids: z.array(z.union([z.string(), z.number()])).nullish(),
    featured_pmids: z.array(z.union([z.string(), z.number()])).nullish(),
    extra: z
      .array(
        z.object({
          title: z.string(),
          authors: z.string().default(''),
          journal: z.string().default(''),
          year: z.union([z.number(), z.string()]),
          doi: z.string().nullish(),
          pmid: z.union([z.string(), z.number()]).nullish(),
          url: z.string().nullish(),
          note: z.string().nullish(),
          featured: z.boolean().default(false),
        }),
      )
      .nullish(),
  }),
});

export const collections = { settings, pages, research, people, news, publicationOverrides };
