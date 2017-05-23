var AppScope = window.AppScope ? window.AppScope : {};

AppScope.TodoListController = (function(){

    var TaskStatusEnum = AppScope.TaskStatusEnum;
    var TaskService = AppScope.TaskService;
    var TaskLibrary = AppScope.TaskLibrary;

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

    function renderStaticContent() {
    }

    function initStaticContentListeners(){
        // add new task and close modal window
        $("#modal-add-task").on("click", ".close", function(){
            var taskDescription = $("#task-description").val();
            if (taskDescription) {
                var content = TaskService.addTaskToList(taskDescription);
                $("#main-content").find(".list-unstyled").append(content);
                $("#modal-add-task").modal("hide");
            } else {
                // show notice message
            }
        });

        // select one or multiple elements
        $("#list").on("click", function(e){
            // prevent select tasks when user click beatween them
            if($(e.target).hasClass("list-unstyled")){
                return;
            }
            var div = $(e.target.closest(".well"));
            var li = div.closest("li");
            console.log(li.attr("data-task-id"));

            if (!div.hasClass("selected-item")) {
                TaskLibrary.addSelected(li);
                // there we need to change task property isChecked to true
                AppScope.TaskLocalStorage.toggleTaskCheck(li.attr("data-task-id"));

                selectMode = true;
            } else {
                TaskLibrary.removeSelected(li);
                // there we need to change task property isChecked to false
                AppScope.TaskLocalStorage.toggleTaskCheck(li.attr("data-task-id"));

                if (!TaskLibrary.getSelectedCount()) {
                    selectMode = false;
                }
            }
            div.toggleClass("selected-item");
            showCompleteButton(selectMode);
        });

        // complete/uncomplete tasks
        $("#btn-complete").click(function(e){
            e.preventDefault();
            jQuery.each(TaskLibrary.getSelected(), function(index, task){
                // there we need to change task status to COMPLETED

                task.fadeOut();
            });
            selectMode = false;
            showCompleteButton(selectMode);
        });

        // complete task
        $("#list").on("change", function(e){
            // there we need to change task status to COMPLETED

            var task = $(e.target).closest("li");
            task.fadeOut();
        });
    }

    function showCompleteButton(selectMode) {
        var btn = $("#btn-complete");
        if (selectMode) {
            btn.removeClass("hide");
        } else {
            btn.addClass("hide");
        }
    }

    function loadUserTaskList(){
        var content = $(TaskService.getTaskListContent());
        $("#main-content").find(".list-unstyled").append(content);
    }

    return {
        initialize: initialize
    }
})();