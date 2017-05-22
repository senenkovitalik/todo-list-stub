<<<<<<< HEAD
var AppScope = window.AppScope ? window.AppScope : {};
=======
var AppScope = window.AppScope || {};
>>>>>>> 8c7f10b5a6978438ff8cbceac5e8e992ea2db752

AppScope.TaskLocalStorage = (function(){

    var TASKS_KEY = AppScope.localStorageConstants.TASK_LIST;
    var Task = AppScope.Task;

<<<<<<< HEAD
    // get all tasks from LS
    function getAll(){
        try {
            var taskListStringified = localStorage.getItem(TASKS_KEY).trim(),
=======
    // get all Task objects from storage and return it as array
    function getAll() {
        try {
            var taskListStringified = localStorage.TASKS_KEY.trim(),
>>>>>>> 8c7f10b5a6978438ff8cbceac5e8e992ea2db752
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

<<<<<<< HEAD
    // save all tasks to LS
    function saveAll(taskList){
        var arr = [];
        for (var i = 0; i < taskList.length; i++) {
            arr.push(taskList[i].toJSON());
        }
        localStorage.setItem(TASKS_KEY, JSON.stringify(arr));
    }

    // save one task to LS
    function saveTask(task) {
        var taskList = getAll();
        taskList.push(task);
        console.log(taskList);
        saveAll(taskList);
=======
    // get array of Task objects, convert it to JSON and save to localStorage
    function saveAll(taskList) {
        var listToSave = [];

        for (var i = 0; i < taskList.length; i++) {
            var taskJSON = taskList[i].toJSON();
            listToSave.push(taskJSON);
        }

        var listStringified = JSON.stringify(listToSave);
        localStorage.TASKS_KEY = listStringified;
>>>>>>> 8c7f10b5a6978438ff8cbceac5e8e992ea2db752
    }

    return {
        getAll: getAll,
<<<<<<< HEAD
        saveAll: saveAll,
        saveTask: saveTask
=======
        saveAll: saveAll
>>>>>>> 8c7f10b5a6978438ff8cbceac5e8e992ea2db752
    }
})();