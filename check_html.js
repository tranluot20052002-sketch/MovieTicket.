const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');
const app = fs.readFileSync('public/app.js', 'utf8');

const htmlIds = new Set([...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]));
const appIds = new Set([...app.matchAll(/\$\('#([A-Za-z0-9_-]+)'\)/g)].map((m) => m[1]));
const dynamicIds = new Set([...app.matchAll(/getElementById\('([^']+)'\)/g)].map((m) => m[1]));

const missing = [...appIds, ...dynamicIds].filter((id) => !htmlIds.has(id));
console.log('IDs in HTML:', htmlIds.size);
console.log('IDs referenced in app.js:', new Set([...appIds, ...dynamicIds]).size);
console.log('MISSING IDs:', missing.length ? missing : 'none');

const views = [...html.matchAll(/<section class="view[^"]*" id="(\w+)"/g)].map((m) => m[1]);
console.log('Views:', views.join(', '));
console.log('main opened:', (html.match(/<main/g) || []).length, '| main closed:', (html.match(/<\/main>/g) || []).length);
console.log('nav sections:', [...html.matchAll(/data-section="(\w+)"/g)].map((m) => m[1]).join(', '));
