<<<<<<< HEAD
var AppScope = window.AppScope ? window.AppScope : {};
=======
var AppScope = window.AppScope || {};
>>>>>>> 8c7f10b5a6978438ff8cbceac5e8e992ea2db752

AppScope.TaskService = (function(){

    var storage;

<<<<<<< HEAD
    function initialize(){
=======
    // set storage object
    function initialize() {
>>>>>>> 8c7f10b5a6978438ff8cbceac5e8e992ea2db752
        if (AppScope.config.storage == "serverApi") {
            storage = AppScope.ServerApi;
        } else {
            storage = AppScope.TaskLocalStorage;
        }
    }

    function addTaskToList(task){
        $("#main-content").find(".list-unstyled").append(
            $("<li><div class='well well-sm'>" +
                "<div class='checkbox no-top-bottom-margin'>" +
                "<label><input type='checkbox'>"+task.value+"</label>" +
                "</div></div></li>")
        );
    }

    return {
        initialize: initialize,
        addTaskToList: addTaskToList
    }
})();