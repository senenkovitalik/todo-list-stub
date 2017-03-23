var AppScope = "AppScope" in window ? window.AppScope : {};

AppScope.config = {
    storage: "localStorage"
};

// Initialize Service / Caches
AppScope.TaskService.initialize();

// Initialize Page controller
AppScope.TodoListController.initialize();