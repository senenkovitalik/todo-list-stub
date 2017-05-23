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

        // select multiple elements
        $("#list").on("click", function(e){
            // prevent select tasks when user click beatween them
            if($(e.target).hasClass("list-unstyled")){
                return;
            }
            var div = $(e.target.closest(".well"));
            var li = div.closest("li");

            if (!div.hasClass("selected-item")) {
                TaskService.addSelected(li);
                selectMode = true;
            } else {
                TaskService.removeSelected(li);
                if (!TaskService.getSelectedCount()) {
                    selectMode = false;
                }
            }
            div.toggleClass("selected-item");
            showCompleteButton(selectMode);
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