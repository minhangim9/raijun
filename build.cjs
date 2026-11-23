const {cpSync, mkdirSync, rmSync} = require('node:fs');
const path = require('node:path');

const root = __dirname;
const out = path.join(root, 'dist');

rmSync(out, {recursive: true, force: true});
mkdirSync(out, {recursive: true});

const hubEntries = [
  'index.html',
  'home.css',
  'home.js',
  'shared.js',
  'hangul-cards.js',
  'game-nav.css',
  'lobby-art',
];

for (const entry of hubEntries) {
  cpSync(path.join(root, 'hub', entry), path.join(out, entry), {recursive: true});
}

cpSync(path.join(root, 'raijun-hangul-demo'), path.join(out, 'hangul'), {recursive: true});
cpSync(path.join(root, 'raijun-game-numbers-shapes-ep1'), path.join(out, 'numbers'), {recursive: true});
cpSync(path.join(root, 'raijun-ep1-giyeok'), path.join(out, 'ep1'), {recursive: true});

console.log('Built static output to', out);
