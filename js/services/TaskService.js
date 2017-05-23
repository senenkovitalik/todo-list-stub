var AppScope = window.AppScope ? window.AppScope : {};

AppScope.TaskService = (function(){

    var storage;
    var selectedTasks = [];
    var TaskStatusEnum = AppScope.TaskStatusEnum;
    var TaskLocalStorage = AppScope.TaskLocalStorage;
    var Task = AppScope.Task;

    // set storage object
    function initialize(){
        if (AppScope.config.storage === "serverApi") {
            storage = AppScope.ServerApi;
        } else {
            storage = TaskLocalStorage;
        }
    }

    function getTaskListContent(){
        var content = "";
        var data = TaskLocalStorage.getAll();
        for (var i = 0; i < data.length; i++) {
            content += "<li data-task-id='" + data[i].id + "'><div class='well well-sm'>" +
                "<div class='checkbox no-top-bottom-margin'>" +
                "<label><input type='checkbox'>" + data[i].value + "</label>" +
                "</div></div></li>";
        }
        return content;
    }

    function addTaskToList(taskDescription){
        var task = new Task(
            getUniqueNumber(),
            taskDescription,
            TaskStatusEnum.ACTIVE_TASK,
            false
        );

        TaskLocalStorage.saveTask(task);

        return $("<li><div class='well well-sm'>" +
            "<div class='checkbox no-top-bottom-margin'>" +
            "<label><input type='checkbox'>" + task.value + "</label>" +
            "</div></div></li>");
    }

    function getUniqueNumber(){
        var date = new Date();
        return date.getSeconds() * Math.pow(10, 5)
            + date.getMilliseconds() * Math.pow(10, 3)
            + Math.floor(Math.random() * (999 - 100)) + 100;
    }

    function addSelected(task){
        selectedTasks.push(task);
    }

    function removeSelected(task){
        var index = jQuery.inArray(task, selectedTasks);
        if (index) {
            selectedTasks.splice(index, 1);
        }
    }

    function getSelected(){
        return selectedTasks;
    }

    function getSelectedCount(){
        return selectedTasks.length;
    }

    return {
        initialize: initialize,
        addTaskToList: addTaskToList,
        getUniqueNumber: getUniqueNumber,
        getTaskListContent: getTaskListContent,
        addSelected: addSelected,
        removeSelected: removeSelected,
        getSelected: getSelected,
        getSelectedCount: getSelectedCount
    }
})();