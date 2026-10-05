import type { Config } from '@netlify/functions';

// Rebuilds the site every Monday so new PubMed papers appear automatically.
// The build hook URL is stored in Netlify as the environment variable NETLIFY_BUILD_HOOK.
export default async () => {
  const hook = Netlify.env.get('NETLIFY_BUILD_HOOK');
  if (!hook) {
    console.log('NETLIFY_BUILD_HOOK is not set; skipping.');
    return;
  }
  const res = await fetch(hook, { method: 'POST', body: '{}' });
  console.log(`Build hook answered ${res.status}`);
};

export const config: Config = {
  schedule: '0 5 * * 1',
};
