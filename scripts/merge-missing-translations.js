const fs = require('fs');
const path = require('path');

function deepMerge(target, source, prefix = '') {
  for (const key in source) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (!(key in target)) {
      // Key is missing in target, copy from source
      console.log(`  Adding missing key: ${fullKey}`);
      target[key] = source[key];
    } else if (typeof source[key] === 'object' && !Array.isArray(source[key]) && source[key] !== null) {
      // Both are objects, recurse
      if (typeof target[key] !== 'object' || Array.isArray(target[key]) || target[key] === null) {
        // Target has wrong type, replace with source
        console.log(`  Replacing wrong type for: ${fullKey}`);
        target[key] = source[key];
      } else {
        // Recurse into nested objects
        deepMerge(target[key], source[key], fullKey);
      }
    }
    // If key exists and is not an object, keep existing translation
  }
}

function mergeTranslations(locale) {
  const enPath = path.join(__dirname, '..', 'messages', 'en.json');
  const localePath = path.join(__dirname, '..', 'messages', `${locale}.json`);
  
  try {
    const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
    const localeData = JSON.parse(fs.readFileSync(localePath, 'utf8'));
    
    console.log(`\nMerging missing keys for ${locale}.json...`);
    
    // Deep merge English keys into locale
    deepMerge(localeData, enData);
    
    // Write back the merged data
    fs.writeFileSync(localePath, JSON.stringify(localeData, null, 2));
    console.log(`✅ Successfully merged ${locale}.json`);
  } catch (error) {
    console.error(`❌ Error merging ${locale}.json:`, error.message);
  }
}

// Merge for all non-English locales
['fr', 'es', 'zh'].forEach(mergeTranslations);

console.log('\n🎉 Merge complete!');