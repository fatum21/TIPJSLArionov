/*
 * check2.js. Проверка задания 2 (отбор невыполненных задач).
 * Запуск:  node checks/check2.js
 */

'use strict';

var path = require('path');
var tasksModule = require(path.join(__dirname, '..', 'src', 'tasks.js'));

var demoTasks = tasksModule.demoTasks;
var getPendingTasks = tasksModule.getPendingTasks;

console.log('=== Задание 2. Отбор невыполненных задач ===');
console.log('');
console.log('Исходный массив demoTasks (id): [' +
  demoTasks.map(function (t) { return t.id; }).join(', ') + ']');
console.log('');

var pending = getPendingTasks(demoTasks);
console.log('Вызов 1: getPendingTasks(demoTasks)');
console.log('Результат (id): [' + pending.map(function (t) { return t.id; }).join(', ') + ']');
console.log('Это новый массив: ' + (pending !== demoTasks));
console.log('Порядок и данные сохранены: ' +
  (pending.length === 2 && pending[0].id === 4 && pending[1].id === 7 &&
   pending[0].title === demoTasks[1].title));
console.log('');

var empty = getPendingTasks([]);
console.log('Вызов 2: getPendingTasks([])');
console.log('Результат (id): [' + empty.map(function (t) { return t.id; }).join(', ') + ']');
console.log('Длина: ' + empty.length);
console.log('');

console.log('Проверка: ожидалось [4, 7] и [] -> результат: ' +
  ((pending.map(function (t) { return t.id; }).join(', ') === '4, 7' && empty.length === 0)
    ? 'СОВПАДАЕТ'
    : 'НЕ СОВПАДАЕТ'));