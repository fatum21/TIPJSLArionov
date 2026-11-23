/*
 * app.js (ПР3). Браузерное приложение "Список задач".
 *
 * Использует общий набор demoTasks (tasks.js) и сводку выполнения задач (progress.js).
 * Состояние хранится в переменной tasks и обновляется функцией setTaskCompleted,
 * которая возвращает новый массив и не изменяет исходные данные.
 */

'use strict';

/** Текущее состояние: новый массив задач (начинаем с demoTasks из ПР2 и ПР3). */
var tasks = demoTasks.slice();

/** Активный фильтр по статусу. */
var activeFilter = 'all';

var listEl = document.getElementById('tasklist');
var messageEl = document.getElementById('message');

/**
 * Отбор задач по активному фильтру статуса.
 * 'all': все задачи;
 * 'notStarted': невыполненные задачи, если в сводке ещё ничего не сделано;
 * 'inProgress': невыполненные задачи (getPendingTasks из ПР2);
 * 'done': выполненные задачи (completed === true).
 */
function getVisibleTasks() {
  if (activeFilter === 'all') {
    return tasks;
  }
  if (activeFilter === 'inProgress') {
    return getPendingTasks(tasks);
  }
  if (activeFilter === 'done') {
    return tasks.filter(function (task) { return task.completed === true; });
  }
  return getPendingTasks(tasks);
}

/** Отрисовка сводки выполнения задач. */
function renderSummary() {
  var completedTasks = tasks.filter(function (task) { return task.completed === true; }).length;
  var summary = summarizeProgress(tasks.length, completedTasks);

  document.getElementById('stat-total').textContent = summary.totalTasks;
  document.getElementById('stat-completed').textContent = summary.completedTasks;
  document.getElementById('stat-remaining').textContent = summary.remaining;
  document.getElementById('stat-percent').textContent = summary.percent + '%';
  document.getElementById('stat-status').textContent = summary.status;
  document.getElementById('progress-bar').style.width = summary.percent + '%';
}

/** Отрисовка списка задач с учётом активного фильтра. */
function renderList() {
  var visible = getVisibleTasks();
  listEl.innerHTML = '';

  if (visible.length === 0) {
    var li = document.createElement('li');
    li.className = 'empty';
    li.textContent = 'Нет задач для выбранного фильтра';
    listEl.appendChild(li);
    return;
  }

  visible.forEach(function (task) {
    var li = document.createElement('li');
    li.className = 'task' + (task.completed ? ' task--done' : '');

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'task__toggle';
    button.dataset.taskId = String(task.id);
    button.textContent = task.completed ? 'Снять отметку' : 'Выполнено';
    button.setAttribute('aria-label', 'Переключить статус задачи ' + task.id);

    var id = document.createElement('span');
    id.className = 'task__id';
    id.textContent = '#' + task.id;

    var title = document.createElement('span');
    title.className = 'task__title' + (task.completed ? ' task__title--done' : '');
    title.textContent = task.title;

    var priority = document.createElement('span');
    priority.className = 'task__priority';
    priority.textContent = task.priority;

    li.appendChild(button);
    li.appendChild(id);
    li.appendChild(title);
    li.appendChild(priority);
    listEl.appendChild(li);
  });
}

function showMessage(text) {
  messageEl.textContent = text;
  messageEl.hidden = false;
}

/** Полная перерисовка интерфейса после любого изменения состояния. */
function render() {
  renderSummary();
  renderList();
}

/*
 * ============ ПЕРЕКЛЮЧЕНИЕ СТАТУСА ЗАДАЧИ (Листинг 4) ============
 */

// Обработчик клика по кнопке переключения в списке задач.
function onTaskListClick(event) {
  var button = event.target.closest('button[data-task-id]');
  if (!button) {
    return;
  }

  var id = Number(button.dataset.taskId);
  var current = tasks.find(function (task) { return task.id === id; });
  if (!current) {
    showMessage('Ошибка: задача с id = ' + id + ' не найдена');
    return;
  }

  var result = setTaskCompleted(tasks, id, !current.completed);
  if (!result.ok) {
    showMessage(result.error);
    return;
  }

  tasks = result.tasks;
  messageEl.hidden = true;
  render();
}

// Подключение события: клик делегируется на контейнер списка.
listEl.addEventListener('click', onTaskListClick);
// ============ КОНЕЦ ФРАГМЕНТА ПЕРЕКЛЮЧЕНИЯ ============

/** Обработчик выбора фильтра по статусу. */
function onFiltersClick(event) {
  var button = event.target.closest('button[data-filter]');
  if (!button) {
    return;
  }
  activeFilter = button.dataset.filter;
  document.querySelectorAll('.filters__btn').forEach(function (item) {
    item.classList.toggle('is-active', item === button);
  });
  renderList();
}

document.getElementById('filters').addEventListener('click', onFiltersClick);

render();