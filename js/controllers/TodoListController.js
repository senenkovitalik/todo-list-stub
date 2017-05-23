var AppScope = window.AppScope ? window.AppScope : {};

AppScope.TodoListController = (function(){

    var TaskStatusEnum = AppScope.TaskStatusEnum;

    var isInitialized;
    var taskList;
    var $container;

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

    function renderElement(){
        return "<li>"
    }

    function renderList(){
        return li;
    }

    function renderStaticContent() {
    }

    function initStaticContentListeners(){
        // add new task and close modal window
        $("#modal-add-task").on("click", ".close", function(){
            // add new task
            var taskDescription = $("#task-description").val();
            if (taskDescription) {
                var task = new AppScope.Task(1, taskDescription, AppScope.TaskStatusEnum.ACTIVE_TASK, false);
                // save task to LS
                AppScope.TaskLocalStorage.saveTask(task);   // !!!!!!!!!!! need to do it from service
                // add task to list
                AppScope.TaskService.addTaskToList(task);
                $("#modal-add-task").modal("hide");
            } else {
                // show notice message
            }
        });
    }

    function loadUserTaskList(){

    }

    function onLoadTaskListSuccess(data){
        if (!isInitialized) return;
    }

    // remove all listeners
    function closeStaticContentListeners() {

    }


    function close(){
        if (isInitialized) {
            isInitialized = false;
            closeStaticContentListeners();
        }
    }

    return {
        initialize: initialize,
        close: close
    }
})();