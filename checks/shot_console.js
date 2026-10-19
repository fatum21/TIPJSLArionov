/*
 * shot_console.js. Создаёт скриншоты фактического вывода консоли для заданий 1-3.
 * Запускает node-проверки, перехватывает их реальный stdout и отрисовывает его
 * в виде окна консоли, после чего снимает изображение.
 */

const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'screenshots');

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function html(title, command, lines) {
  const body = lines
    .map((l) => '<div class="line">' + (esc(l) === '' ? '&nbsp;' : esc(l)) + '</div>')
    .join('\n');

  return `<!DOCTYPE html><html lang="ru"><head><meta charset="utf-8">
<style>
  body { margin:0; background:#ffffff; font-family:"Consolas","Cascadia Mono",monospace; }
  .win { width:1040px; padding:0 0 18px; background:#0c0c0c; }
  .bar { background:#1f1f1f; padding:10px 14px; display:flex; align-items:center; gap:8px;
         font:12px "Segoe UI",Arial,sans-serif; color:#cccccc; }
  .dot { width:12px; height:12px; border-radius:50%; }
  .t { margin-left:8px; }
  pre { margin:0; padding:14px 18px; color:#d4d4d4; font-size:14px; line-height:1.45;
        white-space:pre-wrap; word-break:break-word; }
  .prompt { color:#6a9955; }
</style></head><body>
  <div class="win">
    <div class="bar"><span class="dot" style="background:#ff5f57"></span>
      <span class="dot" style="background:#febc2e"></span>
      <span class="dot" style="background:#28c840"></span>
      <span class="t">${esc(title)}</span></div>
    <pre><span class="prompt">${esc(command)}</span>
${body}</pre>
  </div></body></html>`;
}

(async () => {
  const browser = await chromium.launch();

  const jobs = [
    { script: 'check1.js', out: 'screenshot1.png', title: 'Командная строка: задание 1' },
    { script: 'check2.js', out: 'screenshot2.png', title: 'Командная строка: задание 2' },
    { script: 'check3.js', out: 'screenshot3.png', title: 'Командная строка: задание 3' }
  ];

  for (const job of jobs) {
    let output = '';
    try {
      output = execFileSync('node', [path.join(__dirname, job.script)], {
        encoding: 'utf8',
        cwd: ROOT
      });
    } catch (e) {
      output = (e.stdout || '') + (e.stderr || '');
    }
    const trimmed = output.replace(/\s+$/, '');
    console.log('=== ' + job.script + ' ===');
    console.log(trimmed);

    const command = 'C:\\KR1_TIP> node checks\\' + job.script;
    const page = await browser.newPage({ viewport: { width: 1040, height: 600 }, deviceScaleFactor: 2 });
    await page.setContent(html(job.title, command, trimmed.split('\n')), { waitUntil: 'load' });
    await page.locator('.win').screenshot({ path: path.join(OUT, job.out) });
    await page.close();
    console.log('Сохранено: screenshots\\' + job.out + '\n');
  }

  await browser.close();
})();