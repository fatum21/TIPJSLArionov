/*
 * check1.js. Проверка задания 1 (сводка выполнения задач).
 * Запуск:  node checks/check1.js
 */

'use strict';

var path = require('path');
var progress = require(path.join(__dirname, '..', 'src', 'progress.js'));

function run(title, totalTasks, completedTasks) {
  var result = progress.summarizeProgress(totalTasks, completedTasks);
  console.log('Вход:  summarizeProgress(' + JSON.stringify(totalTasks) + ', ' +
    JSON.stringify(completedTasks) + ')');
  if (!result.ok) {
    console.log('Вывод: ' + result.error);
  } else if (result.empty) {
    console.log('Вывод: Задач пока нет');
  } else {
    console.log('Вывод: осталось ' + result.remaining +
      ', прогресс ' + result.percent + '%, статус: ' + result.status);
  }
  console.log(progress.formatProgressSummary(result));
  console.log('');
}

console.log('=== Задание 1. Сводка выполнения задач ===');
console.log('');
run('Проверка 1', 12, 5);
run('Проверка 2', 0, 0);
run('Проверка 3', 5, 6);