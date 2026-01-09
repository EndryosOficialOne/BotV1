const { chromium } = require('playwright');

// --- CONFIGURAÇÕES ---
const CONCURRENCY = 2; // Quantos navegadores ao mesmo tempo (Tente 5 ou 10 se seu PC aguentar)
var COUNTs = 0
const PASSWORD = "PalLabs2026.";
const URL = "https://www.gamersberg.com/giveaways";
const WORDS = ["sky","sun","moon","star","dawn","dusk","light","shadow","flame","ember","river","stone","forest","field","meadow","brook","lake","ocean","wave","reef","cliff","peak","ridge","vale","glen","grove","wood","branch","leaf","root","flower","rose","lily","ivy","fern","thorn","petal","bloom","sprout","seed","bird","raven","hawk","eagle","finch","wren","dove","swan","wolf","fox","bear","deer","lynx","lion","tiger","hart","stag","hound","falcon","phoenix"];

function randomName() {
  return Array.from({ length: 6 }, () => WORDS[Math.floor(Math.random() * WORDS.length)]).join('') + Math.floor(Math.random() * 999);
}

// Função auxiliar para logs coloridos/organizados
function log(id, user, msg) {
  // Formato: [Worker 1] (NomeDaConta) -> Mensagem
  console.log(`[Worker ${id}] (${user}) ${msg}`);
}

async function runWorker(browser, workerId) {
  // Pequeno delay aleatório INICIAL para desincronizar os workers (para não baterem no site todos juntos no 1º segundo)
  await new Promise(r => setTimeout(r, Math.random() * 3000));

  let count = 0;

  // LOOP INFINITO INDEPENDENTE:
  // Assim que este bloco 'try' termina, ele volta pro 'while' imediatamente
  // sem saber o que os outros workers estão fazendo.
  while (true) {
    count++;
    const user = randomName().substring(0, 15) + "ytv";
    let context = null;

    try {
      COUNTs = COUNTs + 1
      console.log("Conta Nº: " + COUNTs)

      context = await browser.newContext();
      const page = await context.newPage();

      // Otimização: Bloqueia imagens/fontes
      await page.route('**/*', (route) => {
        const type = route.request().resourceType();
        if (['image', 'media', 'font'].includes(type)) return route.abort();
        route.continue();
      });

      log(workerId, user, `🔵 Iniciando ciclo #${count}`);

      // 1. Acesso
      await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 20000 });

      // 2. Botão Login
      await page.locator('button.text-white.text-xs.sm\\:text-sm.font-light.flex.items-center.gap-1.group.transition-colors').first().click();

      log(workerId, user, `✍️ Otimizando site...`);

      await page.route('**/*', (route) => {
  const url = route.request().url();
  const adDomains = [
    'googleads',
    'doubleclick',
    'adsystem',
    'facebook.com/tr', // Pixel do FB
    'analytics'
  ];

  if (adDomains.some(domain => url.includes(domain))) {
    route.abort();
  } else {
    route.continue();
  }
});


// Remove blur e também pode desativar animações para ganhar mais velocidade
await page.addStyleTag({
  content: `
    *, *::before, *::after {
      filter: none !important;
      backdrop-filter: none !important;
      transition: none !important;
      animation: none !important;
    }
  `
});


      // 3. Preencher formulário
      log(workerId, user, `✍️ Preenchendo dados...`);
      await page.locator('input[placeholder="yourname"]').fill(user);
      await page.locator('input[type="password"]').first().fill(PASSWORD);
      await page.locator('input[name="confirmPassword"]').fill(PASSWORD);

      // 4. Checkbox e Data
      await page.evaluate(() => {
        const chk = document.querySelector('button[role="checkbox"]') || document.querySelector('input[type="checkbox"]');
        if (chk) chk.click();
      });

      const dateBtn = page.locator('button span', { hasText: 'Select' }).locator('..');
      if (await dateBtn.isVisible()) {
          await dateBtn.click();
          await page.locator('input[placeholder="DD"]').fill("22");
          await page.locator('input[placeholder="MM"]').fill("04");
          await page.locator('input[placeholder="YYYY"]').fill("2002");
          await page.locator('button').filter({ hasText: 'Set Date' }).click();
      }

      // 5. Criar Conta (O Ponto Crítico)
      log(workerId, user, `🚀 Enviando registro...`);
            await page.locator('button', { hasText: 'Create Account' }).nth(1).click();



      log(workerId, user, `🚀 Enviando registro3...`);

      await page.waitForTimeout(1000);

      // 6. Reload seguro
      await page.reload({ waitUntil: 'load' });


// Seleciona o botão que contém o span com o texto 'Claim Free Ticket'
var claimButton = page.locator('button span', { hasText: 'Claim Free Ticket' }).locator('..').nth(2)

await claimButton.waitFor({ state: 'visible', timeout: 15000 });


      log(workerId, user, `✍️ Otimizando site...`);

      await page.route('**/*', (route) => {
  const url = route.request().url();
  const adDomains = [
    'googleads',
    'doubleclick',
    'adsystem',
    'facebook.com/tr', // Pixel do FB
    'analytics'
  ];

  if (adDomains.some(domain => url.includes(domain))) {
    route.abort();
  } else {
    route.continue();
  }
});


// Remove blur e também pode desativar animações para ganhar mais velocidade
await page.addStyleTag({
  content: `
    *, *::before, *::after {
      filter: none !important;
      backdrop-filter: none !important;
      transition: none !important;
      animation: none !important;
    }
  `
});


      log(workerId, user, `🚀 Enviando registro4...`);

      // 7. Pegar Ticket
      const claimBtn = page.locator('button span', { hasText: 'Claim Free Ticket' }).locator('..').nth(2);
      
      if (await claimBtn.isVisible({ timeout: 9000 })) {
        log(workerId, user, `🎟️ Clicando no Ticket...`);
        await page.locator('button span', { hasText: 'Enter Giveaway' }).locator('..').nth(2).click();
        
        // Aumentar chances
        const increaseBtn = page.locator('button[aria-label="Increase tickets"]');
        if (await increaseBtn.isVisible()) {
            await increaseBtn.click({ clickCount: 2 });
        }

        const submitBtn = page.locator('button[type="submit"]').nth(0);
        if (await submitBtn.isVisible()) {
           await submitBtn.click();
        }

      await page.waitForTimeout(1000);

        
        log(workerId, user, `✅ SUCESSO! Conta Pronta.`);
      } else {
        log(workerId, user, `⚠️ Botão de ticket não apareceu.`);
      }

    } catch (err) {
      log(workerId, user, `❌ ERRO: ${err.message.substring(0, 40)}...`);
    } finally {
      // Fecha APENAS o contexto desse worker, liberando memória
      if (context) await context.close();
      // O loop 'while(true)' fará ele reiniciar instantaneamente aqui
    }
  }
}

(async () => {
  console.log(`🚀 INICIANDO ${CONCURRENCY} WORKERS INDEPENDENTES...`);
  
  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage']
  });

  const workers = [];
  for (let i = 1; i <= CONCURRENCY; i++) {
    // Iniciamos todos de uma vez, mas eles rodam seus próprios loops
    workers.push(runWorker(browser, i));
  }

  
  // Mantém o script rodando
  await Promise.all(workers);
})();
