/*
 * shot_app.js. Делает реальный скриншот браузерного приложения (задание 4).
 * Открывает src/index.html, выбирает фильтр "В работе", отмечает задачу id = 4
 * выполненной и сохраняет скриншот результата.
 */

const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 900, height: 1000 }, deviceScaleFactor: 2 });

  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

  const file = 'file:///' + path.join(__dirname, '..', 'src', 'index.html').replace(/\\/g, '/');
  await page.goto(file);
  await page.waitForSelector('.task');

  // 1. Выбираем фильтр "В работе"
  await page.click('button[data-filter="inProgress"]');
  await page.waitForTimeout(150);
  const before = await page.$$eval('.task__id', (els) => els.map((e) => e.textContent));
  console.log('Фильтр "В работе" ДО переключения, id в списке: [' + before.join(', ') + ']');

  // 2. Отмечаем задачу id = 4 выполненной
  await page.click('button[data-task-id="4"]');
  await page.waitForTimeout(250);

  const after = await page.$$eval('.task__id', (els) => els.map((e) => e.textContent));
  const summary = await page.evaluate(() => ({
    total: document.getElementById('stat-total').textContent,
    completed: document.getElementById('stat-completed').textContent,
    remaining: document.getElementById('stat-remaining').textContent,
    percent: document.getElementById('stat-percent').textContent,
    status: document.getElementById('stat-status').textContent,
    activeFilter: document.querySelector('.filters__btn.is-active').dataset.filter
  }));

  console.log('Фильтр "В работе" ПОСЛЕ переключения, id в списке: [' + after.join(', ') + ']');
  console.log('Сводка: всего ' + summary.total + ', выполнено ' + summary.completed +
    ', осталось ' + summary.remaining + ', прогресс ' + summary.percent + ', статус ' + summary.status);
  console.log('Активный фильтр: ' + summary.activeFilter);

  const okAfter = JSON.stringify(after) === '["#7"]';
  const okSummary = summary.total === '4' && summary.completed === '3' &&
    summary.remaining === '1' && summary.percent === '75.0%' && summary.status === 'В работе';
  console.log('Проверка задания 4: список -> ' + (okAfter ? 'СОВПАДАЕТ' : 'НЕ СОВПАДАЕТ') +
    ', сводка -> ' + (okSummary ? 'СОВПАДАЕТ' : 'НЕ СОВПАДАЕТ'));
  console.log('Ошибки в консоли страницы: ' + (errors.length === 0 ? 'нет' : errors.join('; ')));

  await page.locator('.app').screenshot({ path: path.join(__dirname, '..', 'screenshots', 'screenshot4.png') });

  await browser.close();
  process.exit(okAfter && okSummary && errors.length === 0 ? 0 : 1);
})();