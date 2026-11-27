const fs = require('fs');
const file = process.argv[2] || 'Phan_tich_thiet_ke_MovieTicket2.docx';
const buf = fs.readFileSync(file);
const files = {};
let offset = 0;
while (offset + 4 <= buf.length) {
  const sig = buf.readUInt32LE(offset);
  if (sig !== 0x04034b50) break;
  const comp = buf.readUInt32LE(offset + 18);
  const nl = buf.readUInt16LE(offset + 26);
  const el = buf.readUInt16LE(offset + 28);
  const name = buf.toString('utf8', offset + 30, offset + 30 + nl);
  const ds = offset + 30 + nl + el;
  files[name] = buf.slice(ds, ds + comp).toString('utf8');
  offset = ds + comp;
}
const doc = files['word/document.xml'];
const paras = doc.split('</w:p>').map((c) => {
  const t = [];
  const re = /<w:t[^>]*>([\s\S]*?)<\/w:t>/g;
  let m;
  while ((m = re.exec(c))) t.push(m[1]);
  return t.join('')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").trim();
}).filter(Boolean);

console.log('paragraphs:', paras.length, '| tables:', (doc.match(/<w:tbl>/g) || []).length);
console.log('--- PHAN / section headings ---');
paras.filter((t) => /^(PHẦN|KẾT LUẬN|MỤC LỤC)/.test(t)).forEach((t) => console.log('  ' + t));
console.log('--- numbered sections (x.y) ---');
paras.filter((t) => /^\d+\.\d+\.\s/.test(t)).forEach((t) => console.log('  ' + t));
console.log('--- captions ---');
paras.filter((t) => /^(Bảng|Hình|Mã nguồn) \d+\.\d+/.test(t)).forEach((t) => console.log('  ' + t));
console.log('--- DDL ---');
console.log('  CREATE TABLE:', (doc.match(/CREATE TABLE IF NOT EXISTS/g) || []).length);
console.log('  CREATE INDEX:', (doc.match(/CREATE INDEX IF NOT EXISTS/g) || []).length);
console.log('--- Mermaid tokens ---');
console.log('  useCaseDiagram/actor/usecase lines:', (doc.match(/useCaseDiagram|actor |usecase /g) || []).length);
