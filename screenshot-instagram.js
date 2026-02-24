const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });

  const page = await context.newPage();

  console.log('Acessando perfil @brenonobrec...');
  await page.goto('https://www.instagram.com/brenonobrec/', {
    waitUntil: 'networkidle',
    timeout: 30000,
  });

  // Fechar modal de login se aparecer
  try {
    const closeButton = page.locator('svg[aria-label="Close"]');
    await closeButton.click({ timeout: 5000 });
    console.log('Modal de login fechado.');
  } catch {
    console.log('Sem modal de login.');
  }

  // Aguardar conteúdo carregar
  await page.waitForTimeout(2000);

  await page.screenshot({
    path: 'instagram-brenonobrec.png',
    fullPage: false,
  });

  console.log('Screenshot salvo em: instagram-brenonobrec.png');

  await browser.close();
})();
