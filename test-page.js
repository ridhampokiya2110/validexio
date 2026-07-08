const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER ERROR:', msg.text());
    }
  });

  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error.message);
  });

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000');
  
  // Wait a bit to let client-side JS execute
  await page.waitForTimeout(2000);
  
  await browser.close();
  console.log('Done.');
})();
