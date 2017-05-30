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
        var data = storage.getAll();
        for (var i = 0; i < data.length; i++) {
            content += "<li data-task-id='" + data[i].id + "' data-task-status='" + data[i].status.label + "'><div class='well well-sm'>" +
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

        storage.saveTask(task);

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
            storage.changeTaskAttr(taskContainer.attr("data-task-id"), "isChecked", true);
            selectMode = true;
        } else {
            TaskLibrary.removeSelected(taskContainer);
            storage.changeTaskAttr(taskContainer.attr("data-task-id"), "isChecked", false);
            if (!TaskLibrary.getSelectedCount()) {
                selectMode = false;
            }
        }
        taskDiv.toggleClass("selected-item");
        showCompleteButton();
        showUncompleteButton();
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
        showCompleteButton();
        showUncompleteButton();
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
        showCompleteButton();
        showUncompleteButton();
    }

    function completeTask(taskContainer){
        var taskId = taskContainer.attr("data-task-id");
        storage.changeTaskAttr(
            taskId,
            "status",
            TaskStatusEnum.COMPLETED_TASK
        );
        taskContainer.attr("data-task-status", TaskStatusEnum.COMPLETED_TASK.label);
        useFilter();
    }

    function completeTasks(){
        $.each(TaskLibrary.getSelected(), function(index, taskContainer){
            storage.changeTaskAttr(
                taskContainer.attr("data-task-id"),
                "status",
                TaskStatusEnum.COMPLETED_TASK
            );
            taskContainer.attr("data-task-status", TaskStatusEnum.COMPLETED_TASK.label);
        });
        useFilter();
    }

    function uncompleteTasks(){
        $.each(TaskLibrary.getSelected(), function(index, taskContainer){
            storage.changeTaskAttr(
                taskContainer.attr("data-task-id"),
                "status",
                TaskStatusEnum.ACTIVE_TASK
            );
            taskContainer.attr("data-task-status", TaskStatusEnum.ACTIVE_TASK.label);
        });
        useFilter();
    }

    // Remove selected tasks
    function removeTasks(){
        $.each(TaskLibrary.getSelected(), function(index, taskContainer){
            storage.removeTask(taskContainer.attr("data-task-id"));
            taskContainer.fadeOut();
        });
        TaskLibrary.clearSelected();
        selectMode = false;
        showCompleteButton();
        showUncompleteButton();
    }

    function showCompleteButton(){
        var btn = $("#btn-complete");
        if (LocationService.getFilterValue() !== "completed" && selectMode) {
            btn.removeClass("hide");
        } else {
            btn.addClass("hide");
        }
    }

    function showUncompleteButton(){
        var btn = $('#btn-uncomplete');
        if (LocationService.getFilterValue() === "completed" && selectMode){
            btn.removeClass("hide");
        } else {
            btn.addClass("hide");
        }
    }

    // Execute appropriate functions for filtering and selecting
    function groupActions(action){
        switch (action) {
            // case "show-all":
            //     LocationService.setHash("filter=all");
            //     useFilter("all");
            //     storage.saveFilter("all");
            //     break;
            case "show-active":
                LocationService.setHash("filter=active");
                useFilter("active");
                storage.saveFilter("active");
                break;
            case "show-completed":
                LocationService.setHash("filter=completed");
                useFilter("completed");
                storage.saveFilter("completed");
                break;
            case "select-all":
                selectAllTasks();
                break;
            case "deselect-all":
                deselectAllTasks();
                break;
            case "remove-selected":
                removeTasks();
                break;
        }
    }

    function useFilter(filter){
        filter = LocationService.getFilterValue();
        var taskList = $("#list").find("li");
        switch (filter) {
            // case "all":
            //     $.each(taskList, function(i, v){
            //         $(v).show();
            //     });
            //     break;
            case "active":
            case "completed":
                $.each(taskList, function(i, v){
                    if ($(v).attr("data-task-status").toLowerCase() === filter) {
                        $(v).show();
                    } else {
                        $(v).hide();
                    }
                });
                break;
        }
        deselectAllTasks();
    }

    function getUniqueNumber(){
        var date = new Date();
        return date.getSeconds() * Math.pow(10, 5)
            + date.getMilliseconds() * Math.pow(10, 3)
            + Math.floor(Math.random() * (999 - 100)) + 100;
    }

    /*
     produce content for popover window ('More'/'Actions' menu)
     decide what items will be shown
     */
    function getPopoverContent(){
        var showObj = {
            // showAll: "",
            showActive: "",
            showCompleted: "",
            selectAll: "",
            deselectAll: "",
            removeSelected: ""
        };

        var hide = "class='hide'";

        switch (LocationService.getFilterValue()) {
            // case "all":
            //     showObj.showAll = hide;
            //     break;
            case "active":
                showObj.showActive = hide;
                break;
            case "completed":
                showObj.showCompleted = hide;
                break;
        }

        showObj.selectAll = TaskLibrary.isAllSelected() ? hide : "";

        if (!selectMode) {
            showObj.deselectAll = hide;
            showObj.removeSelected = hide;
        }

        var content = $("<ul class='list-unstyled' id='group-action-panel'>" +
            // "<li " + showObj.showAll + "><a href='#' data-action='show-all'>Show all</a></li>" +
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
        uncompleteTasks: uncompleteTasks,
        groupActions: groupActions,
        useFilter: useFilter
    }
})();