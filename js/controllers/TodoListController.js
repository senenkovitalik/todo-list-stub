var AppScope = "AppScope" in window ? window.AppScope : {};

AppScope.TodoListController = (function () {

    var isInitialized;
    var $taskListWrapper;

    function initialize() {
        if (!isInitialized) {
            isInitialized = true;
            renderStaticContent();
            initStaticContentListeners();

            loadUserTaskList();
        } else {
            loadUserTaskList();
        }
    }

    function renderElement() {
        return "<li>"
    }

    function renderList() {

    }


    function renderStaticContent() {
        var content = "" +
                "";


        $taskListWrapper = document.getElementById("listStuff");
    }

    function initStaticContentListeners() {

    }

    function loadUserTaskList() {
        // fire load
    }

    function onLoadTaskListSuccess(data) {
        if (!isInitialized) return;
        var renderedTaskList = renderList(data);

        $taskListWrapper.innerHTML = renderedTaskList;
    }


    function closeStaticContentListeners() {

    }


    function close() {
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