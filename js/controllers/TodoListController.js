var AppScope = window.AppScope || {};

AppScope.TodoListController = (function () {
    "use strict";
    var TaskService = AppScope.TaskService;
    var LocationService = AppScope.LocationService;
    var TaskLocalStorage = AppScope.TaskLocalStorage;

    var isInitialized;
    var oNodes;

    function initialize() {
        if (!isInitialized) {
            isInitialized = true;
            renderStaticContent();
            getAllNodes();
            initStaticContentListeners();
            loadUserTaskList();
        } else {
            loadUserTaskList();
        }
    }

    function getAllNodes() {
        var modalWindow = $("#modal-add-task");
        var modalWindowInput = $("#task-description");
        var modalWindowInputContainer = modalWindowInput.parent();
        var listContainer = $("#list");
        var list = $(".list-unstyled");
        var completeButton = $("#btn-complete");
        var uncompleteButton = $("#btn-uncomplete");
        var popover = $("[data-toggle='popover']");
        oNodes = {
            modalWindow: modalWindow,
            modalWindowInput: modalWindowInput,
            modalWindowInputContainer: modalWindowInputContainer,
            listContainer: listContainer,
            list: list,
            completeButton: completeButton,
            uncompleteButton: uncompleteButton,
            popover: popover
        };
    }

    function renderStaticContent() {
        var content = $("<!-- Navigation bar --><div class=\"navbar navbar-fixed-top\"><div class=\"container-fluid\"><div class=\"navbar-header\"><span class=\"navbar-brand\">ToDo List</span></div><ul class=\"nav navbar-nav navbar-right\"><li><a href=\"#\" class=\"navbar-action-btn hide\" id=\"btn-uncomplete\"><span class=\"glyphicon glyphicon-unchecked\"></span></a></li><li><a href=\"#\" class=\"navbar-action-btn hide\" id=\"btn-complete\"><span class=\"glyphicon glyphicon-check\"></span></a></li><li><a href=\"#\" class=\"navbar-action-btn\" id=\"btn-action\" data-toggle=\"popover\"><span class=\"glyphicon glyphicon-option-vertical\"></span></a></li></ul></div></div><div id=\"main-content\" class=\"container-fluid\"><!-- List --><div class=\"row\" id=\"list\"><div class=\"col-xs-12 col-md-8 col-md-offset-2\"><ul class=\"list-unstyled\"></ul></div></div><!-- Trigger the modal with a button --><button id=\"btn-add-task\" type=\"button\" class=\"btn btn-primary btn-lg\" data-toggle=\"modal\" data-target=\"#modal-add-task\">+</button><!-- Modal --><div id=\"modal-add-task\" class=\"modal fade\" role=\"dialog\"><div class=\"modal-dialog\"><!-- Modal content --><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" class=\"close\"><span class=\"glyphicon glyphicon-ok\"></span></button><h4 class=\"modal-title\">New Task</h4></div><div class=\"modal-body\"><div class=\"form-group\"><label for=\"task-description\">What need to do?</label><input type=\"text\" class=\"form-control\" id=\"task-description\" placeholder=\"Add task description\"></div></div><div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Cancel</button></div></div></div></div></div>");
        $("body").prepend(content);
    }

    function initStaticContentListeners() {
        // add autofocus to modal window input field
        oNodes.modalWindow.on("shown.bs.modal", function () {
            oNodes.modalWindowInput.focus();
        });

        // clear modal window
        oNodes.modalWindow.on("show.bs.modal", function () {
            oNodes.modalWindowInput.val("");
        });

        // make normal input field after error
        oNodes.modalWindowInput.on("focus input", function () {
            var formGroup = oNodes.modalWindowInputContainer;
            if (formGroup.hasClass("has-error")) {
                formGroup.removeClass("has-error has-feedback");
                formGroup.find("span").remove();
            }
        });

        // add new task and close modal window
        oNodes.modalWindow.on("click", ".close", function () {
            addNewTask();
        });

        // add new task by pressing Enter
        oNodes.modalWindowInput.on("keypress", function (e) {
            if (e.which === 13) {
                addNewTask();
            }
        });

        function addNewTask() {
            var taskDescription = oNodes.modalWindowInput.val();
            if (taskDescription) {
                var content = TaskService.addTaskToList(taskDescription);
                oNodes.list.append($(content));
                oNodes.modalWindow.modal("hide");
                TaskService.useFilter();
            } else {
                // make input field red to show error input
                var formGroup = oNodes.modalWindow.find(".form-group");
                formGroup.addClass("has-error has-feedback");
                formGroup.append($("<span class=\"glyphicon glyphicon-remove form-control-feedback\"></span>"));
            }
        }

        // select one or multiple elements
        oNodes.listContainer.on("click", "li", function (e) {
            // prevent select tasks when user click between them
            if ($(e.target).hasClass("list-unstyled")) {
                return;
            }
            var taskContainer = $(e.target.closest("li"));
            TaskService.selectTask(taskContainer);
        });

        // complete tasks
        oNodes.completeButton.click(function (e) {
            e.preventDefault();
            TaskService.completeTasks();
            TaskService.useFilter();
        });

        // uncomplete tasks
        oNodes.uncompleteButton.click(function (e) {
            e.preventDefault();
            TaskService.uncompleteTasks();
            TaskService.useFilter();
        });

        // change task status
        oNodes.listContainer.on("change", function (e) {
            var taskContainer = $(e.target).closest("li");
            TaskService.changeTaskStatus(taskContainer);
            TaskService.useFilter();
        });

        // show panel with group actions
        oNodes.popover.on("click", function (event) {
            event.preventDefault();
            oNodes.popover.popover({
                content: function () {
                    return TaskService.getPopoverContent();
                },
                html: true,
                animation: true,
                placement: "auto left",
                trigger: "focus"
            });
            oNodes.popover.popover("show");
        });
    }

    // load and render tasks
    function loadUserTaskList() {
        oNodes.list.append($(TaskService.getTaskListContent()));
        LocationService.setHash("filter=" + TaskLocalStorage.getFilter());
        TaskService.useFilter();
    }

    return {
        initialize: initialize
    };
}());