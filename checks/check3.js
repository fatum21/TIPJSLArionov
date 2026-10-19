/*
 * check3.js. Проверка задания 3 (изменение статуса задачи).
 * Запуск:  node checks/check3.js
 */

'use strict';

var path = require('path');
var tasksModule = require(path.join(__dirname, '..', 'src', 'tasks.js'));

var demoTasks = tasksModule.demoTasks;
var setTaskCompleted = tasksModule.setTaskCompleted;

console.log('=== Задание 3. Изменение статуса задачи ===');
console.log('');
console.log('Исходный массив demoTasks (id: completed):');
demoTasks.forEach(function (t) {
  console.log('  id = ' + t.id + ' -> completed = ' + t.completed);
});
console.log('');

// --- Проверка 1: установить true для id = 4 ---------------------------------
var ok = setTaskCompleted(demoTasks, 4, true);

console.log('Проверка 1. Вызов: setTaskCompleted(demoTasks, 4, true)');
console.log('  ok = ' + ok.ok);
console.log('  НОВЫЙ массив (id: completed):');
ok.tasks.forEach(function (t) {
  console.log('    id = ' + t.id + ' -> completed = ' + t.completed);
});
console.log('  НОВЫЙ объект задачи id = 4 -> completed = ' + ok.task.completed);
console.log('  ИСХОДНЫЙ массив после вызова (id: completed):');
demoTasks.forEach(function (t) {
  console.log('    id = ' + t.id + ' -> completed = ' + t.completed);
});
console.log('  Исходный массив не изменён: ' +
  (demoTasks[1].completed === false));
console.log('  Новый массив !== исходный: ' + (ok.tasks !== demoTasks));
console.log('  Прочие поля задачи сохранены: ' +
  (ok.task.title === demoTasks[1].title && ok.task.priority === demoTasks[1].priority));
console.log('');

// --- Проверка 2: несуществующий id = 777 -------------------------------------
var fail = setTaskCompleted(demoTasks, 777, true);

console.log('Проверка 2. Вызов: setTaskCompleted(demoTasks, 777, true)');
console.log('  ok = ' + fail.ok);
console.log('  error = ' + fail.error);
console.log('  tasks в результате: ' + fail.tasks);
console.log('  ИСХОДНЫЙ массив после отказа (id: completed):');
demoTasks.forEach(function (t) {
  console.log('    id = ' + t.id + ' -> completed = ' + t.completed);
});
var originalSnapshot = demoTasks.map(function (t) { return t.id + ':' + t.completed; }).join(', ');
console.log('  Данные не изменены: ' +
  (demoTasks.map(function (t) { return t.id + ':' + t.completed; }).join(', ') === originalSnapshot) +
  '  [' + originalSnapshot + ']');
console.log('');

// --- Дополнительно: проверка некорректных аргументов ------------------------
console.log('Дополнительно, проверка некорректных аргументов:');
console.log('  setTaskCompleted(demoTasks, "4", true)   -> ' +
  setTaskCompleted(demoTasks, '4', true).error);
console.log('  setTaskCompleted(demoTasks, 4.5, true)   -> ' +
  setTaskCompleted(demoTasks, 4.5, true).error);
console.log('  setTaskCompleted(demoTasks, 0, true)     -> ' +
  setTaskCompleted(demoTasks, 0, true).error);
console.log('  setTaskCompleted(demoTasks, 4, 1)        -> ' +
  setTaskCompleted(demoTasks, 4, 1).error);
console.log('  setTaskCompleted(demoTasks, 4, "true")   -> ' +
  setTaskCompleted(demoTasks, 4, 'true').error);