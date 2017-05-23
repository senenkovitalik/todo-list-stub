var AppScope = window.AppScope ? window.AppScope : {};

AppScope.TaskLocalStorage = (function(){

    var TASKS_KEY = AppScope.localStorageConstants.TASK_LIST;
    var Task = AppScope.Task;

    // get all tasks
    function getAll(){
        try {
            var taskListStringified = localStorage.getItem(TASKS_KEY).trim(),
                taskList = JSON.parse(taskListStringified);

            var list = [];

            taskList = Array.isArray(taskList) ? taskList : [taskList];

            for (var i = 0; i < taskList.length; i++) {
                var task = new Task();
                var taskObj = task.fromJSON(taskList[i]);
                list.push(taskObj);
            }

            return list;
        } catch (e) {
            return [];
        }
    }

    // save all tasks
    function saveAll(taskList){
        var arr = [];
        for (var i = 0; i < taskList.length; i++) {
            arr.push(taskList[i].toJSON());
        }
        localStorage.setItem(TASKS_KEY, JSON.stringify(arr));
    }

    // save one task
    function saveTask(task){
        var taskList = getAll();
        taskList.push(task);
        saveAll(taskList);
    }

    // remove one task
    function removeTask(task){
        var taskList = getAll();
        for (var i = 0; i < taskList.length; i++) {
            if (task.id === taskList[i].id) {
                taskList.slice(i, 1);
            }
        }
        saveAll(taskList);
    }

    // remove all tasks
    function removeAll(){
        localStorage.setItem(TASKS_KEY, []);
    }

    return {
        getAll: getAll,
        saveAll: saveAll,
        saveTask: saveTask,
        removeTask: removeTask,
        removeAll: removeAll
    }
})();