/*
 * tasks.js (ПР2). Общий набор данных demoTasks и операции над задачами.
 *
 * Дополнительно к getPendingTasks и setTaskCompleted содержит собственные
 * вспомогательные функции проверки аргументов, которые использует setTaskCompleted.
 * Модуль работает и в Node.js (module.exports), и в браузере (глобальная область).
 */

'use strict';

/**
 * Общий демонстрационный набор задач (одинаковый для ПР2, ПР3 и браузерного приложения).
 * Выполнены задачи с id = 1 и id = 10.
 * @type {Array<{id: number, title: string, completed: boolean, priority: string}>}
 */
var demoTasks = [
  { id: 1, title: 'Установить Node.js и Qt Creator', completed: true, priority: 'high' },
  { id: 4, title: 'Реализовать сводку выполнения задач', completed: false, priority: 'high' },
  { id: 7, title: 'Сверстать список задач в браузере', completed: false, priority: 'medium' },
  { id: 10, title: 'Оформить отчёт по контрольной работе', completed: true, priority: 'low' }
];

/**
 * Проверка, что элемент является корректным объектом задачи.
 * @param {*} task
 * @returns {boolean}
 */
function isValidTask(task) {
  return task !== null &&
    typeof task === 'object' &&
    !Array.isArray(task) &&
    Number.isInteger(task.id) &&
    typeof task.title === 'string' &&
    typeof task.completed === 'boolean';
}

/**
 * Проверка, что значение является массивом корректных задач.
 * @param {*} tasks
 * @returns {boolean}
 */
function isValidTaskArray(tasks) {
  return Array.isArray(tasks) && tasks.every(isValidTask);
}

/**
 * Проверка идентификатора задачи: положительное безопасное целое число.
 * Строки ("4"), дробные числа (4.5), 0 и отрицательные значения не принимаются.
 * @param {*} id
 * @returns {boolean}
 */
function isValidTaskId(id) {
  return Number.isSafeInteger(id) && id > 0;
}

/**
 * Проверка флага статуса: строго true или строго false.
 * @param {*} completed
 * @returns {boolean}
 */
function isValidCompletedFlag(completed) {
  return completed === true || completed === false;
}

/**
 * Отбор невыполненных задач.
 *
 * Возвращает НОВЫЙ массив задач с completed === false, сохраняя порядок элементов
 * и не изменяя исходный массив и его объекты (filter создаёт новый массив,
 * а ссылки на объекты задач остаются прежними).
 *
 * @param {Array} tasks исходный массив задач
 * @returns {Array} новый массив невыполненных задач
 * @throws {TypeError} если tasks не является массивом
 */
function getPendingTasks(tasks) {
  if (!Array.isArray(tasks)) {
    throw new TypeError('getPendingTasks: tasks должен быть массивом');
  }
  return tasks.filter(function (task) {
    return isValidTask(task) && task.completed === false;
  });
}

/**
 * Изменение статуса задачи без изменения исходных данных.
 *
 * @param {Array}  tasks     исходный массив задач
 * @param {number} id        положительное безопасное целое число, идентификатор задачи
 * @param {boolean} completed строго true или false, новый статус
 * @returns {object}
 *   при успехе: { ok: true,  tasks: <новый массив>, task: <новый объект задачи> }
 *   при ошибке: { ok: false, error: 'Ошибка: ...' }
 *
 * Исходный массив и исходный объект задачи не изменяются (глубокое копирование
 * на уровне массива и изменяемой записи); изменяется только поле completed.
 */
function setTaskCompleted(tasks, id, completed) {
  if (!isValidTaskArray(tasks)) {
    return { ok: false, error: 'Ошибка: tasks должен быть массивом корректных задач' };
  }
  if (!isValidTaskId(id)) {
    return { ok: false, error: 'Ошибка: id должен быть положительным безопасным целым числом' };
  }
  if (!isValidCompletedFlag(completed)) {
    return { ok: false, error: 'Ошибка: completed должен быть строго true или false' };
  }

  var index = -1;
  for (var i = 0; i < tasks.length; i += 1) {
    if (tasks[i].id === id) {
      index = i;
      break;
    }
  }
  if (index === -1) {
    return { ok: false, error: 'Ошибка: задача с id = ' + id + ' не найдена' };
  }

  // Новый массив (исходный не меняется) и новая запись задачи (исходная не меняется).
  var nextTasks = tasks.slice();
  var nextTask = Object.assign({}, tasks[index], { completed: completed });
  nextTasks[index] = nextTask;

  return { ok: true, tasks: nextTasks, task: nextTask };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    demoTasks: demoTasks,
    getPendingTasks: getPendingTasks,
    setTaskCompleted: setTaskCompleted,
    isValidTask: isValidTask,
    isValidTaskArray: isValidTaskArray,
    isValidTaskId: isValidTaskId,
    isValidCompletedFlag: isValidCompletedFlag
  };
}