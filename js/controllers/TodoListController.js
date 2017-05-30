"use strict";
var AppScope = window.AppScope ? window.AppScope : {};

AppScope.TodoListController = (function(){

    var TaskStatusEnum = AppScope.TaskStatusEnum;
    var TaskService = AppScope.TaskService;

    var isInitialized;
    var selectMode = false;

    function initialize(){
        if (!isInitialized) {
            isInitialized = true;
            renderStaticContent();
            initStaticContentListeners();
            loadUserTaskList();
        } else {
            loadUserTaskList();
        }
    }

    function renderStaticContent(){
    }

    function initStaticContentListeners(){
        // add new task and close modal window
        $("#modal-add-task").on("click", ".close", function(){
            var taskDescription = $("#task-description").val();
            if (taskDescription) {
                TaskService.addTaskToList(taskDescription);
                $("#modal-add-task").modal("hide");
            } else {
                // show notice message
            }
        });

        // select one or multiple elements
        $("#list").on("click", function(e){
            // prevent select tasks when user click between them
            if ($(e.target).hasClass("list-unstyled")) {
                return;
            }
            var taskContainer = $(e.target.closest("li"));
            TaskService.selectTask(taskContainer);
        });

        // complete tasks
        $("#btn-complete").click(function(e){
            e.preventDefault();
            TaskService.completeTasks();
        });

        // uncomplete tasks
        $("#btn-uncomplete").click(function(e){
            e.preventDefault();
            TaskService.uncompleteTasks();
        });

        // complete task
        $("#list").on("change", function(e){
            var taskContainer = $(e.target).closest("li");
            TaskService.completeTask(taskContainer);
        });

        // show panel with group actions
        $('[data-toggle="popover"]').on("click", function(event){
            event.preventDefault();
            $(this).popover({
                content: function(){
                    return TaskService.getPopoverContent()
                },
                html: true,
                animation: true,
                placement: "auto left",
                trigger: "focus"
            });
            $(this).popover("show");
        });
    }


    function loadUserTaskList(){
        var content = $(TaskService.getTaskListContent());
        $("#main-content").find(".list-unstyled").append(content);
        TaskService.useFilter();
    }

    return {
        initialize: initialize
    }
})();