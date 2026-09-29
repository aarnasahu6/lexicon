const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../dist');
// GitHub Pages has no SPA rewrites. Give each known route an entry document.
const html = fs.readFileSync(path.join(root, 'index.html'));
for (const route of ['home', 'bridge', 'understand', 'scan', 'learn', 'onboarding', 'settings']) {
  const dir = path.join(root, route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}
fs.writeFileSync(path.join(root, '.nojekyll'), '');
