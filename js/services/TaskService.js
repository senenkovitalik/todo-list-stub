var AppScope = window.AppScope ? window.AppScope : {};

AppScope.TaskService = (function(){

    var storage;
    var selectMode = false;

    var TaskStatusEnum = AppScope.TaskStatusEnum;
    var TaskLocalStorage = AppScope.TaskLocalStorage;
    var TaskLibrary = AppScope.TaskLibrary;
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
        var taskId = getUniqueNumber();
        var task = new Task(
            taskId,
            taskDescription,
            TaskStatusEnum.ACTIVE_TASK,
            false
        );

        TaskLocalStorage.saveTask(task);

        return $("<li data-task-id='" + taskId + "'><div class='well well-sm'>" +
            "<div class='checkbox no-top-bottom-margin'>" +
            "<label><input type='checkbox'>" + task.value + "</label>" +
            "</div></div></li>");
    }

    function provideMultiselection(div, li){
        if (!div.hasClass("selected-item")) {
            TaskLibrary.addSelected(li);
            // there we need to change task property isChecked to true
            TaskLocalStorage.changeTaskAttr(li.attr("data-task-id"), "isChecked", true);
            selectMode = true;
        } else {
            TaskLibrary.removeSelected(li);
            // there we need to change task property isChecked to false
            TaskLocalStorage.changeTaskAttr(li.attr("data-task-id"), "isChecked", false);
            if (!TaskLibrary.getSelectedCount()) {
                selectMode = false;
            }
        }
        div.toggleClass("selected-item");
        return selectMode;
    }

    function completeTasks(){
        jQuery.each(AppScope.TaskLibrary.getSelected(), function(index, task){
            // there we need to change task status to COMPLETED
            TaskLocalStorage.changeTaskAttr(
                task.attr("data-task-id"),
                "status",
                TaskStatusEnum.COMPLETED_TASK
            );
            task.fadeOut();
        });
        selectMode = false;
        return selectMode;
    }

    function getUniqueNumber(){
        var date = new Date();
        return date.getSeconds() * Math.pow(10, 5)
            + date.getMilliseconds() * Math.pow(10, 3)
            + Math.floor(Math.random() * (999 - 100)) + 100;
    }

    return {
        initialize: initialize,
        addTaskToList: addTaskToList,
        getUniqueNumber: getUniqueNumber,
        getTaskListContent: getTaskListContent,
        provideMultiselection: provideMultiselection,
        completeTasks: completeTasks
    }
})();