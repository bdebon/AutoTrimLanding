const fs = require('fs');
const path = require('path');

const componentsToFix = [
  'Hero.jsx',
  'Pricing.jsx',
  'WhyFaster.jsx',
  'Testimonials.jsx',
  'CompareTimebolt.jsx',
  'CompareDescript.jsx',
  'CompareAutocut.jsx'
];

componentsToFix.forEach(fileName => {
  const filePath = path.join(__dirname, '..', 'components', fileName);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if already imports usePathname
    const hasUsePathname = content.includes("import { usePathname }") || content.includes("usePathname");
    
    if (!hasUsePathname) {
      // Add usePathname import
      if (content.includes("import { useTranslations } from \"next-intl\";")) {
        content = content.replace(
          'import { useTranslations } from "next-intl";',
          'import { useTranslations } from "next-intl";\nimport { usePathname } from "next/navigation";'
        );
      }
      
      // Add pathname and currentLocale
      const componentMatch = content.match(/const \w+ = \(\) => \{[\s\S]*?const t = useTranslations\(\);/);
      if (componentMatch) {
        content = content.replace(
          componentMatch[0],
          componentMatch[0] + '\n  const pathname = usePathname();\n  const currentLocale = pathname.split(\'/\')[1] || \'en\';'
        );
      }
    }
    
    // Replace href="/download" with href={`/${currentLocale}/download`}
    content = content.replace(
      /href="\/download"/g,
      'href={`/${currentLocale}/download`}'
    );
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed ${fileName}`);
  } catch (error) {
    console.error(`❌ Error fixing ${fileName}:`, error.message);
  }
});

console.log('\n🎉 Done!');