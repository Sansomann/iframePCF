import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });

// Homepage
await page.goto('http://localhost:3456/index.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await page.screenshot({ path: 'screenshots/01-homepage-hero.png', fullPage: false });
await page.screenshot({ path: 'screenshots/01-homepage-full.png', fullPage: true });

// Kurse page
await page.goto('http://localhost:3456/kurse.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await page.screenshot({ path: 'screenshots/02-kurse.png', fullPage: true });

// Click a day with events to show sidebar
await page.evaluate(() => { selectDate('2026-6-18'); });
await page.waitForTimeout(500);
await page.screenshot({ path: 'screenshots/03-kurse-day-selected.png', fullPage: false });

// Open booking modal
await page.evaluate(() => {
  const ev = {id:'e6',title:'Theorieunterricht',time:'18:00 – 20:00 Uhr',type:'theory',spots:5,price:'inklusive',duration:'2 Std.'};
  openModal(ev, '18. Juni 2026');
});
await page.waitForTimeout(500);
await page.screenshot({ path: 'screenshots/04-booking-modal.png', fullPage: false });
await page.evaluate(() => closeModal());

// Simulator page
await page.goto('http://localhost:3456/simulator.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await page.screenshot({ path: 'screenshots/05-simulator.png', fullPage: true });

// Select a day and time slot
await page.evaluate(() => { selectDay('2026-6-9'); });
await page.waitForTimeout(300);
await page.screenshot({ path: 'screenshots/06-simulator-day.png', fullPage: false });

// Select a slot
await page.evaluate(() => { selSlot='13:00'; renderSlots('2026-6-9'); updateSummary(); checkStep1(); });
await page.waitForTimeout(300);
await page.screenshot({ path: 'screenshots/07-simulator-slot-selected.png', fullPage: false });

// Fill form and go to payment
await page.fill('#f-name', 'Max Mustermann');
await page.fill('#f-email', 'max@beispiel.de');
await page.evaluate(() => goToPayment());
await page.waitForTimeout(300);
await page.screenshot({ path: 'screenshots/08-payment-step.png', fullPage: false });

// Fill card details
await page.fill('#c-holder', 'Max Mustermann');
await page.fill('#c-number', '4532 1234 5678 9012');
await page.fill('#c-expiry', '09/28');
await page.fill('#c-cvc', '123');
await page.evaluate(() => updateCard());
await page.waitForTimeout(300);
await page.screenshot({ path: 'screenshots/09-payment-filled.png', fullPage: false });

// Success
await page.evaluate(() => doPayment());
await page.waitForTimeout(400);
await page.screenshot({ path: 'screenshots/10-success.png', fullPage: false });

await browser.close();
console.log('Done! All screenshots saved.');
