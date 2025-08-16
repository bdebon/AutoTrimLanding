const fs = require('fs');
const path = require('path');

function restructureMessages(locale) {
  const filePath = path.join(__dirname, '..', 'messages', `${locale}.json`);
  
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Restructure testimonials quotes
    if (data.testimonials && data.testimonials.quotes && Array.isArray(data.testimonials.quotes)) {
      const quotes = {};
      data.testimonials.quotes.forEach((quote, index) => {
        quotes[index] = quote;
      });
      data.testimonials.quotes = quotes;
    }
    
    // Restructure FAQ questions
    if (data.faq && data.faq.questions && Array.isArray(data.faq.questions)) {
      const questions = {};
      data.faq.questions.forEach((question, index) => {
        questions[index] = question;
      });
      data.faq.questions = questions;
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`✅ Restructured ${locale}.json`);
  } catch (error) {
    console.log(`⚠️ Skipping ${locale}.json - ${error.message}`);
  }
}

// Restructure all language files
['en', 'fr', 'es', 'zh'].forEach(restructureMessages);