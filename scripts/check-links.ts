/**
 * Checks every resource URL in the content with a HEAD/GET request.
 * Run with `npx tsx scripts/check-links.ts`. Network required; not part of CI.
 */
import { allConcepts } from '../src/content/concepts';

const urls = new Map<string, string[]>();
for (const c of allConcepts) for (const r of c.resources) urls.set(r.url, [...(urls.get(r.url) ?? []), c.id]);

let bad = 0;
const entries = [...urls.entries()];
const limit = 8;
let i = 0;
async function worker() {
  while (i < entries.length) {
    const [url, ids] = entries[i++];
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 15000);
      let res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: ctrl.signal });
      if (res.status === 405 || res.status === 403) res = await fetch(url, { method: 'GET', redirect: 'follow', signal: ctrl.signal });
      clearTimeout(t);
      if (res.status >= 400) {
        bad++;
        console.log(`${res.status}  ${url}  <- ${ids.join(', ')}`);
      }
    } catch (e) {
      bad++;
      console.log(`ERR  ${url}  <- ${ids.join(', ')}  (${(e as Error).message})`);
    }
  }
}
await Promise.all(Array.from({ length: limit }, worker));
console.log(`\nChecked ${entries.length} URLs, ${bad} problem(s).`);
process.exit(bad ? 1 : 0);
