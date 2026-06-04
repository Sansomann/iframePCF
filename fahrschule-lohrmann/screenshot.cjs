const { chromium } = require('/opt/node22/lib/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  const base = 'http://localhost:3456';
  const out = '/home/user/iframePCF/fahrschule-lohrmann/screenshots';

  // 1. Homepage hero (above fold)
  await page.goto(base + '/index.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: out + '/01-homepage-hero.png' });

  // 2. Homepage full
  await page.screenshot({ path: out + '/02-homepage-full.png', fullPage: true });

  // 3. Courses calendar
  await page.goto(base + '/kurse.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: out + '/03-kurse.png', fullPage: true });

  // 4. Select a day with events
  await page.evaluate(() => window.selectDate('2026-6-18'));
  await page.waitForTimeout(500);
  await page.screenshot({ path: out + '/04-kurse-day-selected.png' });

  // 5. Booking modal
  await page.evaluate(() => {
    const ev = { id: 'e6', title: 'Theorieunterricht', time: '18:00 – 20:00 Uhr', type: 'theory', spots: 5, price: 'inklusive', duration: '2 Std.' };
    window.openModal(ev, '18. Juni 2026');
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: out + '/05-booking-modal.png' });
  await page.evaluate(() => window.closeModal());

  // 6. Simulator page
  await page.goto(base + '/simulator.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: out + '/06-simulator.png', fullPage: true });

  // 7. Select day in simulator
  await page.evaluate(() => window.selectDay('2026-6-9'));
  await page.waitForTimeout(400);
  await page.screenshot({ path: out + '/07-simulator-day.png' });

  // 8. Select time slot
  await page.evaluate(() => {
    window.selSlot = '13:00';
    window.renderSlots('2026-6-9');
    window.updateSummary();
    window.checkStep1();
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: out + '/08-simulator-slot.png' });

  // 9. Fill form, go to payment
  await page.fill('#f-name', 'Max Mustermann');
  await page.fill('#f-email', 'max@beispiel.de');
  await page.evaluate(() => window.goToPayment());
  await page.waitForTimeout(300);
  await page.screenshot({ path: out + '/09-payment-step.png' });

  // 10. Fill card details
  await page.fill('#c-holder', 'Max Mustermann');
  await page.fill('#c-number', '4532 1234 5678 9012');
  await page.fill('#c-expiry', '09/28');
  await page.fill('#c-cvc', '123');
  await page.evaluate(() => window.updateCard());
  await page.waitForTimeout(400);
  await page.screenshot({ path: out + '/10-payment-filled.png' });

  // 11. Success screen
  await page.evaluate(() => window.doPayment());
  await page.waitForTimeout(500);
  await page.screenshot({ path: out + '/11-success.png' });

  await browser.close();
  console.log('Done! Screenshots saved to', out);
})();
