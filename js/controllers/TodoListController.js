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

            var toShow = TaskService.provideMultiselection(div, li);

            showCompleteButton(toShow);
        });

        // complete/uncomplete tasks
        $("#btn-complete").click(function(e){
            e.preventDefault();
            var toShow = TaskService.completeTasks();
            showCompleteButton(toShow);
        });

        // complete task
        $("#list").on("change", function(e){
            var task = $(e.target).closest("li");
            // there we need to change task status to COMPLETED
            AppScope.TaskLocalStorage.changeTaskAttr(
                task.attr("data-task-id"),
                "status",
                AppScope.TaskStatusEnum.COMPLETED_TASK
            );

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