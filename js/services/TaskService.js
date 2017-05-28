"use strict";
var AppScope = window.AppScope ? window.AppScope : {};

AppScope.TaskService = (function(){

    var storage;
    var selectMode = false;

    var Task = AppScope.Task;
    var TaskStatusEnum = AppScope.TaskStatusEnum;
    var TaskLocalStorage = AppScope.TaskLocalStorage;
    var TaskLibrary = AppScope.TaskLibrary;
    var LocationService = AppScope.LocationService;

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
            content += "<li data-task-id='" + data[i].id + "' data-task-status='" + data[i].status.label + "'><div class='well well-sm'>" +
                "<div class='checkbox no-top-bottom-margin'>" +
                "<label><input type='checkbox'>" + data[i].value + "</label>" +
                "</div></div></li>";
        }
        // useFilter();
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

        var content = $("<li data-task-id='" + taskId + "' data-task-status='" + TaskStatusEnum.ACTIVE_TASK.label + "'><div class='well well-sm'>" +
            "<div class='checkbox no-top-bottom-margin'>" +
            "<label><input type='checkbox'>" + task.value + "</label>" +
            "</div></div></li>");

        $("#main-content").find(".list-unstyled").append(content);
        useFilter();
    }

    // select/deselect
    function selectTask(taskContainer){
        var taskDiv = taskContainer.find(".well");
        if (!taskDiv.hasClass("selected-item")) {
            TaskLibrary.addSelected(taskContainer);
            TaskLocalStorage.changeTaskAttr(taskContainer.attr("data-task-id"), "isChecked", true);
            selectMode = true;
        } else {
            TaskLibrary.removeSelected(taskContainer);
            TaskLocalStorage.changeTaskAttr(taskContainer.attr("data-task-id"), "isChecked", false);
            if (!TaskLibrary.getSelectedCount()) {
                selectMode = false;
            }
        }
        taskDiv.toggleClass("selected-item");
        showCompleteButton(selectMode);
    }

    // select all tasks
    function selectAllTasks(){
        var taskList = $("#list").find("li");
        $.each(taskList, function(index, task){
            TaskLibrary.addSelected(task);
            var taskDiv = $(task).find(".well");
            taskDiv.addClass("selected-item");
        });
        selectMode = true;
        showCompleteButton(selectMode);
    }

    // deselect all tasks
    function deselectAllTasks(){
        var taskList = $("#list").find("li");
        $.each(taskList, function(index, task){
            TaskLibrary.removeSelected(task);
            var taskDiv = $(task).find(".well");
            taskDiv.removeClass("selected-item");
        });
        selectMode = false;
        showCompleteButton(selectMode);
    }

    function completeTask(taskContainer){
        var taskId = taskContainer.attr("data-task-id");
        TaskLocalStorage.changeTaskAttr(
            taskId,
            "status",
            TaskStatusEnum.COMPLETED_TASK
        );
        taskContainer.attr("data-task-status", TaskStatusEnum.COMPLETED_TASK.label);
        taskContainer.fadeOut();
    }

    function completeTasks(){
        jQuery.each(TaskLibrary.getSelected(), function(index, task){
            // there we need to change task status to COMPLETED
            TaskLocalStorage.changeTaskAttr(
                task.attr("data-task-id"),
                "status",
                TaskStatusEnum.COMPLETED_TASK
            );
            task.fadeOut();
        });
        selectMode = false;
        showCompleteButton(selectMode);
    }

    function showCompleteButton(selectMode){
        var btn = $("#btn-complete");
        if (selectMode) {
            btn.removeClass("hide");
        } else {
            btn.addClass("hide");
        }
    }

    function groupActions(action){
        switch (action) {
            case "show-all":
                LocationService.setHash("filter=all");
                useFilter("all");
                TaskLocalStorage.saveFilter("all");
                break;
            case "show-active":
                LocationService.setHash("filter=active");
                useFilter("active");
                TaskLocalStorage.saveFilter("active");
                break;
            case "show-completed":
                LocationService.setHash("filter=completed");
                useFilter("completed");
                TaskLocalStorage.saveFilter("completed");
                break;
            case "select-all":
                selectAllTasks();
                break;
            case "deselect-all":
                deselectAllTasks();
                break;
            case "remove-selected":
                break;
        }
    }

    function useFilter(filter){
        filter = LocationService.getFilterValue();
        var taskList = $("#list").find("li");
        switch (filter) {
            case "all":
                $.each(taskList, function(i, v){
                    $(v).show();
                });
                break;
            case "active":
            case "completed":
                $.each(taskList, function(i, v){
                    if ($(v).attr("data-task-status").toLowerCase() === filter){
                        $(v).show();
                    } else {
                        $(v).hide();
                    }
                });
                break;
        }
    }

    function getUniqueNumber(){
        var date = new Date();
        return date.getSeconds() * Math.pow(10, 5)
            + date.getMilliseconds() * Math.pow(10, 3)
            + Math.floor(Math.random() * (999 - 100)) + 100;
    }

    function getPopoverContent(){
        var showObj = {
            showAll: "",
            showActive: "",
            showCompleted: "",
            selectAll: "",
            deselectAll: "",
            removeSelected: ""
        };

        var hide = "class='hide'";

        showObj.showAll = "";
        showObj.showActive = "";
        showObj.showCompleted = "";

        showObj.selectAll = TaskLibrary.isAllSelected() ? hide : "";

        if (!selectMode) {
            showObj.deselectAll = hide;
            showObj.removeSelected = hide;
        }

        var content = $("<ul class='list-unstyled' id='group-action-panel'>" +
            "<li " + showObj.showAll + "><a href='#' data-action='show-all'>Show all</a></li>" +
            "<li " + showObj.showActive + "><a href='#' data-action='show-active'>Show active</a></li>" +
            "<li " + showObj.showCompleted + "><a href='#' data-action='show-completed'>Show completed</a></li>" +
            "<li " + showObj.selectAll + "><a href='#' data-action='select-all'>Select all</a></li>" +
            "<li " + showObj.deselectAll + "><a href='#' data-action='deselect-all'>Deselect all</a></li>" +
            "<li " + showObj.removeSelected + "><a href='#' data-action='remove-selected'>Remove task(s)</a></li>" +
            "</ul>");

        content.on("click", "li", function(e){
            e.preventDefault();
            var action = $(e.target).attr("data-action");
            groupActions(action);
        });

        return content;
    }

    return {
        initialize: initialize,
        addTaskToList: addTaskToList,
        getUniqueNumber: getUniqueNumber,
        getPopoverContent: getPopoverContent,
        getTaskListContent: getTaskListContent,
        selectTask: selectTask,
        selectAllTasks: selectAllTasks,
        completeTask: completeTask,
        completeTasks: completeTasks,
        groupActions: groupActions,
        useFilter: useFilter
    }
})();