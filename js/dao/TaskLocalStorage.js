var AppScope = "AppScope" in window ? window.AppScope : {};

AppScope.TaskLocalStorage = (function () {

    var TASKS_KEY = AppScope.localStorageConstants.TASK_LIST;
    var Task = AppScope.Task;

    function getAll() {
        try {
            var taskListStringified = localStorage[TASKS_KEY].trim(),
                taskList = JSON.parse(taskListStringified);

            taskList = Array.isArray(taskList) ? taskList : [taskList];

            for (var i = 0; i < taskList.length; i++) {
                var taskJson = taskList[i];
                taskList[i] = new Task().fromJSON(taskJson);
            }

            return taskList;
        } catch (e) {
            return [];
        }
    }

    return {
        getAll: getAll
    }
})();