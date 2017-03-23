var AppScope = "AppScope" in window ? window.AppScope : {};

AppScope.TaskService = (function () {

    var storage;

    function initialize() {
        if (AppScope.config.storage == "serverApi") {
            storage = AppScope.ServerApi;
        } else {
            storage = AppScope.TaskLocalStorage;
        }
    }



    return {
        initialize: initialize
    }
})();