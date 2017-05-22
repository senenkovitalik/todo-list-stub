<<<<<<< HEAD
var AppScope = window.AppScope ? window.AppScope : {};
=======
var AppScope = window.AppScope || {};
>>>>>>> 8c7f10b5a6978438ff8cbceac5e8e992ea2db752

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

<<<<<<< HEAD
    function renderElement(){
        return "<li>"
    }

    function renderList(){
=======
    function renderElement(taskObj) {
        var li = document.createElement("LI");
        li.setAttribute("class", "list-row");
        li.setAttribute("data-id", taskObj.id);
        li.setAttribute("data-state", taskObj.status.code);
        li.innerHTML =
            "<input type='checkbox'>" +
            "<span class='item-value'>"+taskObj.value+"</span>" +
            "<div class='float-right'>" +
            "<span class='item-state'>"+taskObj.status.label+"</span>" +
            "<input type='button' value='Delete'>" +
            "</div>";
>>>>>>> 8c7f10b5a6978438ff8cbceac5e8e992ea2db752

        return li;
    }

    function replaceElement(taskObj, li) {
        li.parentNode.replaceChild(renderElement(taskObj), li);
    }

<<<<<<< HEAD
    function renderStaticContent(){
=======
    function renderList(taskList) {
        var listStuff = document.getElementById("list-stuff");

        if (taskList.length === 1) {
            // add one element
            listStuff.prepend(renderElement(taskList[0]));
        } else if (taskList.length >= 2) {
            // add elements from localStorage
            for (var i = 0; i < taskList.length; i++) {
                taskList[i].isChecked = false;
                listStuff.prepend(renderElement(taskList[i]));
            }
            // use filter from URL hash
            switch (window.location.hash.substr(1)) {
                case "filter=active":
                    filterTasks("ACTIVE_TASK");
                    break;
                case "filter=completed":
                    filterTasks("COMPLETED_TASK");
                    break;
            }
        }
    }
>>>>>>> 8c7f10b5a6978438ff8cbceac5e8e992ea2db752

    function renderStaticContent() {
        $container = document.getElementById("app-content");
        $container.innerHTML = "<input id='add-new-task' type='text' name='task-description' placeholder='Add new task here'>" +
            "<ul id='list-stuff'></ul>" +
            "<div>" +
            "<div class='label'>Filter by</div>" +
            "<select id='filter'>" +
            "<option value='active'>Active</option>" +
            "<option value='completed'>Completed</option>" +
            "<option value='all'>All</option>" +
            "</select></div>" +
            "<div>" +
            "<div class='label'>Group actions</div>" +
            "<select id='change-state'>" +
            "<option value='active'>Check as Active</option>" +
            "<option value='completed'>Check as Completed</option>" +
            "<option value='delete'>Delete checked</option>" +
            "</select></div>";
    }

<<<<<<< HEAD
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
=======
    function initStaticContentListeners() {
        // add new task when enter pressed
        document.getElementById("add-new-task").addEventListener("keypress", function(event) {
            if (event.keyCode === 13) {
                if (event.target.value === "") return;
                var taskValue = event.target.value;
                var task = new AppScope.Task(AppScope.UID(), taskValue, AppScope.TaskStatusEnum.ACTIVE_TASK, false);
                taskList.push(task);

                renderList([task]);

                // clear input field
                event.target.value = "";

                saveUserTaskList();
            }
        });

        // delete elements from list
        document.getElementById("list-stuff").addEventListener("click", function(event) {
            if (event.target.tagName === "INPUT" && event.target.type === "button") {
                var li = event.target.parentNode.parentNode;
                var taskId = li.getAttribute("data-id");
                var ul = li.parentNode;
                ul.removeChild(li);

                removeTaskFromList(taskId);
            }
        });

        // change task state
        document.getElementById("list-stuff").addEventListener("click", function(event) {
            var target = event.target;
            if (target.tagName === "SPAN" && target.className === "item-state") {
                var li = target.parentNode.parentNode;
                var taskId = li.getAttribute("data-id");

                // run through array, find task and change status
                for (var i = 0; i < taskList.length; i++) {
                    if (taskList[i].id === taskId) {
                        if (taskList[i].status.code === AppScope.TaskStatusEnum.ACTIVE_TASK.code) {
                            taskList[i].status = AppScope.TaskStatusEnum.COMPLETED_TASK;
                            break;
                        } else {
                            taskList[i].status = AppScope.TaskStatusEnum.ACTIVE_TASK;
                            break;
                        }
                    }
                }
                saveUserTaskList();

                // render new element
                replaceElement(taskList[i], li);
            }
        });

        // show filtered tasks
        document.getElementById("filter").addEventListener("change", function(event) {
            var filterValue = this.value;
            switch (filterValue) {
                case "active":
                    filterTasks("ACTIVE_TASK");
                    break;
                case "completed":
                    filterTasks("COMPLETED_TASK");
                    break;
                case "all":
                    filterTasks();
                    break;
            }
        });

        // change value isChecked of Task object
        document.getElementById("list-stuff").addEventListener("click", function (event) {
            if (event.target.tagName === "INPUT" && event.target.type === "checkbox") {
                var taskId = event.target.parentNode.getAttribute("data-id");

                if (event.target.checked) {
                    for (var i = 0; i < taskList.length; i++) {
                        if (taskList[i].id === taskId) {
                            taskList[i].isChecked = true;
                            break;
                        }
                    }
                } else {
                    for (var j = 0; j < taskList.length; j++) {
                        if (taskList[j].id === taskId) {
                            taskList[j].isChecked = false;
                            break;
                        }
                    }
                }
            }
        });

        // change state of checked tasks to active
        document.getElementById("change-state").addEventListener("change", function () {
            var changeValue = this.value;
            switch (changeValue) {
                case "active":
                    changeTaskState("ACTIVE_TASK");
                    break;
                case "completed":
                    changeTaskState("COMPLETED_TASK");
                    break;
                case "delete":
                    deleteCheckedElements();
                    break;
            }

            saveUserTaskList();
        });


>>>>>>> 8c7f10b5a6978438ff8cbceac5e8e992ea2db752
    }

    function loadUserTaskList(){
        // fire load
        taskList = AppScope.TaskLocalStorage.getAll();

        if (taskList.length != 0) {
            renderList(taskList);
        }
    }

    function saveUserTaskList() {
        AppScope.TaskLocalStorage.saveAll(taskList);
    }

    function removeTaskFromList(taskId) {
        for (var i = 0; i < taskList.length; i++) {
            if (taskList[i].id === taskId) {
                taskList.splice(i, 1);
                break;
            }
        }
        saveUserTaskList();
    }

<<<<<<< HEAD
    function onLoadTaskListSuccess(data){
        if (!isInitialized) return;
        var renderedTaskList = renderList(data);
=======
    function filterTasks(state) {
        var ul = document.getElementById("list-stuff");
        var useHash = false;
        var filter;

        for (var i = 0; i < ul.childElementCount; i++) {
            var childNode = ul.childNodes[i];
            var isHidden = childNode.classList.contains("row-hide");

            switch (state) {
                case "ACTIVE_TASK":
                case "COMPLETED_TASK":
                    if (childNode.getAttribute("data-state") !== state && !isHidden) {
                        childNode.classList.add("row-hide");
                    } else {
                        childNode.classList.remove("row-hide");
                    }
                    break;
                default:
                    // show all
                    if (isHidden) childNode.classList.remove("row-hide");
            }
        }

        switch (state) {
            case "ACTIVE_TASK":
                filter = "filter=active";
                useHash = true;
                break;
            case "COMPLETED_TASK":
                filter = "filter=completed";
                useHash = true;
                break;
            default:
                history.pushState("", document.title, window.location.pathname);
                useHash = false;
        }
>>>>>>> 8c7f10b5a6978438ff8cbceac5e8e992ea2db752

        if (useHash) window.location.hash = filter;
    }

    // change state of checked tasks
    function changeTaskState(state) {

        var currentState, newState, filter;
        var rowList = document.getElementById("list-stuff").childNodes;

        switch (state) {
            case "ACTIVE_TASK":
                currentState = TaskStatusEnum.COMPLETED_TASK;
                newState = TaskStatusEnum.ACTIVE_TASK;
                break;
            case "COMPLETED_TASK":
                currentState = TaskStatusEnum.ACTIVE_TASK;
                newState = TaskStatusEnum.COMPLETED_TASK;
                break;
        }

        for (var i = 0; i < taskList.length; i++) {
            var taskObj = taskList[i];
            if (taskObj.isChecked === true && taskObj.status === currentState) {
                taskObj.status = newState;
                taskObj.isChecked = false;

                for (var j = 0; j < rowList.length; j++) {
                    if (taskObj.id === rowList[j].getAttribute("data-id")) {
                        replaceElement(taskObj, rowList[j]);
                    }
                }
            }
        }
    }

    function deleteCheckedElements () {
        var ul = document.getElementById("list-stuff");
        var rowList = ul.childNodes;

        for (var i = taskList.length-1; i >= 0; i--) {
            var taskObj = taskList[i];
            if (taskObj.isChecked === true) {
                for (var j = rowList.length-1; j >= 0; j--) {
                    if (taskObj.id === rowList[j].getAttribute("data-id")) {
                        removeTaskFromList(taskObj.id);
                        ul.removeChild(rowList[j]);
                    }
                }
            }
        }
    }

<<<<<<< HEAD
    function closeStaticContentListeners(){
=======
    // remove all listeners
    function closeStaticContentListeners() {
>>>>>>> 8c7f10b5a6978438ff8cbceac5e8e992ea2db752

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