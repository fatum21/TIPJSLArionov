/*
 * selftest.js. Полная самопроверка требований КР1.
 * Запуск:  node checks/selftest.js
 */

'use strict';

var path = require('path');
var progress = require(path.join(__dirname, '..', 'src', 'progress.js'));
var tm = require(path.join(__dirname, '..', 'src', 'tasks.js'));

var passed = 0;
var failed = 0;

function check(name, condition) {
  if (condition) {
    passed += 1;
    console.log('  [OK]   ' + name);
  } else {
    failed += 1;
    console.log('  [FAIL] ' + name);
  }
}

console.log('=== Задание 1. summarizeProgress ===');

var r1 = progress.summarizeProgress(12, 5);
check('(12,5): remaining = 7', r1.remaining === 7);
check('(12,5): percent = "41.7"', r1.percent === '41.7');
check('(12,5): status = "В работе"', r1.status === 'В работе');

var r0 = progress.summarizeProgress(0, 0);
check('(0,0): "Задач пока нет"', r0.ok === true && r0.empty === true && r0.status === 'Задач пока нет');
check('(0,0): обычной сводки нет (нет remaining/percent)', r0.remaining === undefined && r0.percent === undefined);

var r2 = progress.summarizeProgress(5, 6);
check('(5,6): ошибка', r2.ok === false && typeof r2.error === 'string' && r2.error.indexOf('Ошибка:') === 0);
check('(5,6): обычной сводки нет', r2.remaining === undefined && r2.percent === undefined && r2.status === undefined);
check('(5,6): formatProgressSummary возвращает только ошибку', progress.formatProgressSummary(r2) === r2.error);

check('(0,5): ошибка (completed > total)', progress.summarizeProgress(0, 5).ok === false);
check('(10,0): "Не начато"', progress.summarizeProgress(10, 0).status === 'Не начато');
check('(10,10): "Завершено"', progress.summarizeProgress(10, 10).status === 'Завершено');
check('(1000,1000): "Завершено"', progress.summarizeProgress(1000, 1000).status === 'Завершено');
check('(1,1): percent = "100.0"', progress.summarizeProgress(1, 1).percent === '100.0');
check('(3,1): percent = "33.3"', progress.summarizeProgress(3, 1).percent === '33.3');
check('(7,1): percent = "14.3"', progress.summarizeProgress(7, 1).percent === '14.3');
check('(1001,1): ошибка (total > 1000)', progress.summarizeProgress(1001, 1).ok === false);
check('(-1,0): ошибка (отрицательное total)', progress.summarizeProgress(-1, 0).ok === false);
check('(10,-1): ошибка (отрицательное completed)', progress.summarizeProgress(10, -1).ok === false);
check('("12",5): ошибка, строка НЕ преобразуется', progress.summarizeProgress('12', 5).ok === false);
check('(12,"5"): ошибка, строка НЕ преобразуется', progress.summarizeProgress(12, '5').ok === false);
check('(12.5,5): ошибка (дробное)', progress.summarizeProgress(12.5, 5).ok === false);
check('(NaN,0): ошибка', Number.isNaN(NaN) && progress.summarizeProgress(NaN, 0).ok === false);
check('(Infinity,0): ошибка', progress.summarizeProgress(Infinity, 0).ok === false);
check('(null,null): ошибка', progress.summarizeProgress(null, null).ok === false);
check('(undefined,undefined): ошибка', progress.summarizeProgress(undefined, undefined).ok === false);
check('(true,false): ошибка', progress.summarizeProgress(true, false).ok === false);
check('(12,5,10): лишний аргумент игнорируется', progress.summarizeProgress(12, 5, 10).percent === '41.7');
check('progress всегда с одним знаком', /\.\d$/.test(progress.summarizeProgress(7, 1).percent));

console.log('');
console.log('=== Задание 2. getPendingTasks ===');

var demoTasks = tm.demoTasks;
check('demoTasks: 4 задачи', demoTasks.length === 4);
check('demoTasks: id [1,4,7,10]', JSON.stringify(demoTasks.map(function (t) { return t.id; })) === '[1,4,7,10]');
check('demoTasks: выполнены только 1 и 10',
  demoTasks[0].completed === true && demoTasks[1].completed === false &&
  demoTasks[2].completed === false && demoTasks[3].completed === true);

var pending = tm.getPendingTasks(demoTasks);
check('getPendingTasks(demoTasks) -> id [4,7]', JSON.stringify(pending.map(function (t) { return t.id; })) === '[4,7]');
check('getPendingTasks([]) -> []', tm.getPendingTasks([]).length === 0);
check('возвращается НОВЫЙ массив', pending !== demoTasks);
check('исходный массив не изменён', demoTasks.length === 4 && demoTasks[1].completed === false);
check('объекты задач те же (данные и порядок сохранены)',
  pending[0] === demoTasks[1] && pending[1] === demoTasks[2]);
check('порядок сохранён', pending[0].id === 4 && pending[1].id === 7);
check('остальные поля сохранены (title/priority)',
  pending[0].title === demoTasks[1].title && pending[0].priority === demoTasks[1].priority);
check('все элементы имеют completed === false', pending.every(function (t) { return t.completed === false; }));
check('задачи в исходном массиве true-выполнены НЕ выбраны', pending.indexOf(demoTasks[0]) === -1);
var threw = false;
try { tm.getPendingTasks('не массив'); } catch (e) { threw = e instanceof TypeError; }
check('не-массив вызывает TypeError', threw);

console.log('');
console.log('=== Задание 3. setTaskCompleted ===');

var ok = tm.setTaskCompleted(demoTasks, 4, true);
check('успех: ok === true', ok.ok === true);
check('успех: есть новый массив tasks', Array.isArray(ok.tasks) && ok.tasks.length === 4);
check('успех: tasks !== исходный массив', ok.tasks !== demoTasks);
check('успех: новый объект задачи id=4 с completed = true',
  ok.task && ok.task.id === 4 && ok.task.completed === true);
check('успех: в новом массиве id=4 выполнена', ok.tasks[1].completed === true);
check('успех: ИСХОДНЫЙ массив не изменён, id=4 осталась false', demoTasks[1].completed === false);
check('успех: ИСХОДНЫЙ объект задачи не изменён',
  demoTasks[1].completed === false && demoTasks[1].id === 4);
check('успех: изменён только completed (id/title/priority сохранены)',
  ok.task.id === demoTasks[1].id && ok.task.title === demoTasks[1].title &&
  ok.task.priority === demoTasks[1].priority);
check('успех: остальные задачи не тронуты',
  ok.tasks[0] === demoTasks[0] && ok.tasks[2] === demoTasks[2] && ok.tasks[3] === demoTasks[3]);
check('успех: порядок задач сохранён',
  JSON.stringify(ok.tasks.map(function (t) { return t.id; })) === '[1,4,7,10]');
check('обратное переключение id=4 -> false работает',
  tm.setTaskCompleted(ok.tasks, 4, false).task.completed === false);

var fail = tm.setTaskCompleted(demoTasks, 777, true);
check('id=777: ok === false', fail.ok === false);
check('id=777: есть error с префиксом "Ошибка: "',
  typeof fail.error === 'string' && fail.error.indexOf('Ошибка: ') === 0);
check('id=777: tasks не возвращается', fail.tasks === undefined);
check('id=777: исходные данные не изменились',
  demoTasks[1].completed === false && demoTasks[2].completed === false &&
  demoTasks[0].completed === true && demoTasks[3].completed === true);

var badIds = [777, 0, -1, 4.5, '4', null, undefined, NaN, Infinity, true, 1e21];
badIds.forEach(function (badId) {
  check('неверный id ' + JSON.stringify(String(badId)) + ' -> отказ',
    tm.setTaskCompleted(demoTasks, badId, true).ok === false);
});
var badFlags = [1, 0, 'true', 'false', null, undefined, 'да'];
badFlags.forEach(function (flag) {
  check('неверный completed ' + JSON.stringify(String(flag)) + ' -> отказ',
    tm.setTaskCompleted(demoTasks, 4, flag).ok === false);
});
check('tasks не массив -> отказ', tm.setTaskCompleted('нет', 4, true).ok === false);
check('tasks = null -> отказ', tm.setTaskCompleted(null, 4, true).ok === false);
check('tasks = [] -> отказ (задачи нет)', tm.setTaskCompleted([], 4, true).ok === false);

console.log('');
console.log('=== Согласованность задания 4 со сводкой ===');
var finalTasks = tm.setTaskCompleted(demoTasks, 4, true).tasks;
var completedCount = finalTasks.filter(function (t) { return t.completed === true; }).length;
var sum4 = progress.summarizeProgress(finalTasks.length, completedCount);
check('после переключения: всего 4', sum4.totalTasks === 4);
check('после переключения: выполнено 3', sum4.completedTasks === 3);
check('после переключения: осталось 1', sum4.remaining === 1);
check('после переключения: прогресс 75.0%', sum4.percent === '75.0');
check('после переключения: в работе осталась только id=7',
  JSON.stringify(tm.getPendingTasks(finalTasks).map(function (t) { return t.id; })) === '[7]');

console.log('');
console.log('=========================================');
console.log('ИТОГО: успешно ' + passed + ', ошибок ' + failed);
console.log(failed === 0 ? 'ВСЕ ПРОВЕРКИ ПРОЙДЕНЫ' : 'ЕСТЬ ОШИБКИ');
process.exit(failed === 0 ? 0 : 1);