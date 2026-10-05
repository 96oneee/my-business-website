# NO.KIT.LAB website

Website of NO.KIT.LAB, the functional and translational genomics lab of Prof. Athar Khalil at the American University of Beirut.

- **Site**: [Astro](https://astro.build) static site, no database.
- **Admin**: [Decap CMS](https://decapcms.org) at `/admin`. Every save is a commit to this repository, and Netlify rebuilds the site in about a minute.
- **Publications**: loaded from PubMed at every build (search set in *Site settings*). A weekly Netlify scheduled function (`netlify/functions/weekly-rebuild.mts`) triggers a rebuild so new papers appear on their own. Wrong matches can be hidden and extra papers added from the admin.

## Editing content (lab owner)

Go to `https://<your-site>/admin`, log in, and edit:

| In the admin | What it changes |
|---|---|
| Site settings | Home headline, description, buttons, emails, phone, address, Instagram, map |
| Pages | About page sections, Research page introduction |
| Research themes | The three research themes (add, reorder, add images) |
| People | Lab members. Change **Group** to *Alumni* when someone leaves. Upload photos here. |
| News | News posts. The News menu item appears once there is at least one post. |
| Publications | Hide a wrong PubMed match, feature a paper, add a preprint |

## Where things live

```
src/content/settings/site.yml      site-wide settings
src/content/pages/                 About + Research intro
src/content/research/              research themes (Markdown)
src/content/people/                one Markdown file per person
src/content/news/                  news posts
src/content/publications/overrides.yml
public/uploads/                    images uploaded from the admin
public/admin/config.yml            admin (Decap CMS) configuration
```

## Develop locally

```sh
npm install
npm run dev          # http://localhost:4321
npx decap-server     # in a second terminal, then open http://localhost:4321/admin (no login needed locally)
npm run build        # production build into dist/
```

## Deploy on Netlify (one time)

1. Netlify → *Add new site* → *Import from Git* → pick this repository. Build settings come from `netlify.toml`.
2. *Site configuration → Identity* → enable Identity, set registration to **Invite only**, and under *Services* enable **Git Gateway**.
3. *Identity → Invite users* → invite the lab owner's email. They accept the invite and land on `/admin` to set a password.
4. *Build & deploy → Build hooks* → add a hook, then save its URL in Netlify as the environment variable `NETLIFY_BUILD_HOOK` (used by `netlify/functions/weekly-rebuild.mts`).
5. Optional: set the environment variable `SITE_URL` to the final domain (used for the sitemap and link previews).

If Netlify Identity is not available on the account, switch `backend` in `public/admin/config.yml` to `name: github` with `repo: <owner>/<repo>`; editors then log in with a GitHub account that has access to this repository.
