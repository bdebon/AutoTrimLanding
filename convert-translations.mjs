import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import translations
import { en } from './translations/en.js';
import { fr } from './translations/fr.js';
import { es } from './translations/es.js';
import { zh } from './translations/zh.js';

// Write JSON files
fs.writeFileSync(path.join(__dirname, 'messages', 'en.json'), JSON.stringify(en, null, 2));
fs.writeFileSync(path.join(__dirname, 'messages', 'fr.json'), JSON.stringify(fr, null, 2));
fs.writeFileSync(path.join(__dirname, 'messages', 'es.json'), JSON.stringify(es, null, 2));
fs.writeFileSync(path.join(__dirname, 'messages', 'zh.json'), JSON.stringify(zh, null, 2));

console.log('Translations converted to JSON successfully!');