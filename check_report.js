/* Verify generated docx: extract word/document.xml from stored ZIP and dump text */
const fs = require('fs');
const path = require('path');

const file = process.argv[2] || 'Bao_cao_do_an_MovieTicket2_CHITIET.docx';
const buf = fs.readFileSync(path.join(__dirname, file));

const files = {};
let offset = 0;
while (offset + 4 <= buf.length) {
  const sig = buf.readUInt32LE(offset);
  if (sig !== 0x04034b50) break;
  const compSize = buf.readUInt32LE(offset + 18);
  const nameLen = buf.readUInt16LE(offset + 26);
  const extraLen = buf.readUInt16LE(offset + 28);
  const name = buf.toString('utf8', offset + 30, offset + 30 + nameLen);
  const dataStart = offset + 30 + nameLen + extraLen;
  files[name] = buf.slice(dataStart, dataStart + compSize).toString('utf8');
  offset = dataStart + compSize;
}

console.log('ZIP ENTRIES:', Object.keys(files).join(', '));
const doc = files['word/document.xml'] || '';
console.log('document.xml length:', doc.length);

const paraTexts = doc.split('</w:p>').map((chunk) => {
  const texts = [];
  const re = /<w:t[^>]*>([\s\S]*?)<\/w:t>/g;
  let m;
  while ((m = re.exec(chunk))) texts.push(m[1]);
  const unescaped = texts.join('').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'");
  return unescaped.trim();
}).filter(Boolean);

console.log('paragraphs with content:', paraTexts.length);
console.log('tables:', (doc.match(/<w:tbl>/g) || []).length);
console.log('page breaks:', (doc.match(/<w:br w:type="page"\/>/g) || []).length);

console.log('----- sample: FOR UPDATE code block -----');
const i38 = paraTexts.findIndex((t) => t.includes('FOR UPDATE và phát hiện ghế trùng'));
if (i38 >= 0) console.log(paraTexts.slice(i38, i38 + 4).join('\n'));

console.log('----- sample: API table -----');
const iApi = paraTexts.findIndex((t) => t.includes('Toàn bộ API endpoints'));
if (iApi >= 0) console.log(paraTexts.slice(iApi, iApi + 12).join(' | '));

console.log('----- mojibake check -----');
const bad = paraTexts.filter((t) => t.includes('Ã') || t.includes('áº'));
console.log(bad.length ? 'HAS MOJIBAKE: ' + bad.slice(0, 3).join(' // ') : 'NO MOJIBAKE - OK');

console.log('----- headings -----');
paraTexts.filter((t) => /^(CHƯƠNG|MỞ ĐẦU|KẾT LUẬN|MỤC LỤC|LỜI CẢM ƠN|DANH MỤC|TÀI LIỆU)/.test(t)).forEach((t) => console.log('  ' + t));
