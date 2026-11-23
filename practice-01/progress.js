/*
 * progress.js (ПР1). Сводка выполнения задач.
 *
 * Модуль не зависит от окружения: в Node.js экспортируется через module.exports,
 * а в браузере объявляет функции в глобальной области (подключение <script src>).
 */

'use strict';

/** Верхняя граница допустимого общего количества задач. */
var MAX_TOTAL_TASKS = 1000;

/**
 * Проверка общего количества задач.
 * Принимаются ТОЛЬКО целые числа в диапазоне 0..1000.
 * Строки, дробные числа, NaN, Infinity не преобразуются и считаются ошибкой.
 * @param {*} value
 * @returns {boolean}
 */
function isValidTotalTasks(value) {
  return Number.isInteger(value) && value >= 0 && value <= MAX_TOTAL_TASKS;
}

/**
 * Проверка количества выполненных задач: целое число 0..totalTasks.
 * @param {*} value
 * @param {number} totalTasks
 * @returns {boolean}
 */
function isValidCompletedTasks(value, totalTasks) {
  return Number.isInteger(value) && value >= 0 && value <= totalTasks;
}

/**
 * Текстовый статус по сводке.
 * @param {number} completedTasks
 * @param {number} totalTasks
 * @returns {string}
 */
function getProgressStatus(completedTasks, totalTasks) {
  if (totalTasks === 0) {
    return 'Задач пока нет';
  }
  if (completedTasks === 0) {
    return 'Не начато';
  }
  if (completedTasks === totalTasks) {
    return 'Завершено';
  }
  return 'В работе';
}

/**
 * Процент выполнения с одним знаком после точки.
 * @param {number} completedTasks
 * @param {number} totalTasks
 * @returns {string}
 */
function formatPercent(completedTasks, totalTasks) {
  return ((completedTasks / totalTasks) * 100).toFixed(1);
}

/**
 * Формирование сводки выполнения задач.
 *
 * @param {number} totalTasks      общее количество задач (целое 0..1000)
 * @param {number} completedTasks  выполнено (целое 0..totalTasks)
 * @returns {object}
 *   { ok: true,  empty: true,  status: 'Задач пока нет' }  (обе величины равны 0)
 *   { ok: true,  empty: false, totalTasks, completedTasks, remaining, percent, status }
 *   { ok: false, error: 'Ошибка: ...' }  (данные некорректны)
 */
function summarizeProgress(totalTasks, completedTasks) {
  if (!isValidTotalTasks(totalTasks)) {
    return {
      ok: false,
      error: 'Ошибка: totalTasks должен быть целым числом от 0 до ' + MAX_TOTAL_TASKS
    };
  }
  if (!isValidCompletedTasks(completedTasks, totalTasks)) {
    return {
      ok: false,
      error: 'Ошибка: completedTasks должен быть целым числом от 0 до totalTasks'
    };
  }

  if (totalTasks === 0) {
    return { ok: true, empty: true, status: 'Задач пока нет' };
  }

  return {
    ok: true,
    empty: false,
    totalTasks: totalTasks,
    completedTasks: completedTasks,
    remaining: totalTasks - completedTasks,
    percent: formatPercent(completedTasks, totalTasks),
    status: getProgressStatus(completedTasks, totalTasks)
  };
}

/**
 * Приведение результата summarizeProgress к строке для вывода.
 * @param {object} result
 * @returns {string}
 */
function formatProgressSummary(result) {
  if (!result.ok) {
    return result.error;
  }
  if (result.empty) {
    return 'Задач пока нет';
  }
  return 'Всего: ' + result.totalTasks +
    ', выполнено: ' + result.completedTasks +
    ', осталось: ' + result.remaining +
    ', прогресс: ' + result.percent + '%' +
    ', статус: ' + result.status;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    summarizeProgress: summarizeProgress,
    formatProgressSummary: formatProgressSummary,
    getProgressStatus: getProgressStatus,
    formatPercent: formatPercent
  };
}