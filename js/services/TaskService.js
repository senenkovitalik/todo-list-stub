var AppScope = window.AppScope ? window.AppScope : {};

AppScope.TaskService = (function(){

    var storage;

    // set storage object
    function initialize(){
        if (AppScope.config.storage === "serverApi") {
            storage = AppScope.ServerApi;
        } else {
            storage = AppScope.TaskLocalStorage;
        }
    }

    function addTaskToList(task){
        $("#main-content").find(".list-unstyled").append(
            $("<li><div class='well well-sm'>" +
                "<div class='checkbox no-top-bottom-margin'>" +
                "<label><input type='checkbox'>" + task.value + "</label>" +
                "</div></div></li>")
        );
    }

    function getUniqueNumber(){
        var date = new Date();
        return date.getSeconds() * Math.pow(10, 5)
            + date.getMilliseconds() * Math.pow(10, 3)
            + Math.floor(Math.random() * (999 - 100)) + 100;
    }

    return {
        initialize: initialize,
        addTaskToList: addTaskToList
    }
})();