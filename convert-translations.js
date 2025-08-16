const fs = require('fs');
const path = require('path');

// Import translations
const { en } = require('./translations/en.js');
const { fr } = require('./translations/fr.js');
const { es } = require('./translations/es.js');
const { zh } = require('./translations/zh.js');

// Write JSON files
fs.writeFileSync(path.join(__dirname, 'messages', 'en.json'), JSON.stringify(en, null, 2));
fs.writeFileSync(path.join(__dirname, 'messages', 'fr.json'), JSON.stringify(fr, null, 2));
fs.writeFileSync(path.join(__dirname, 'messages', 'es.json'), JSON.stringify(es, null, 2));
fs.writeFileSync(path.join(__dirname, 'messages', 'zh.json'), JSON.stringify(zh, null, 2));

console.log('Translations converted to JSON successfully!');