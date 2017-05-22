<<<<<<< HEAD
var AppScope = window.AppScope ? window.AppScope : {};
=======
var AppScope = window.AppScope || {};
>>>>>>> 8c7f10b5a6978438ff8cbceac5e8e992ea2db752

AppScope.config = {
    storage: "localStorage"
};

// Initialize Service / Caches
AppScope.TaskService.initialize();

// Initialize Page controller
AppScope.TodoListController.initialize();

// task1 = new AppScope.Task(1, "task1", AppScope.TaskStatusEnum.ACTIVE_TASK, true);
// task2 = new AppScope.Task(2, "task2", AppScope.TaskStatusEnum.ACTIVE_TASK, true);
// task3 = new AppScope.Task(3, "task3", AppScope.TaskStatusEnum.ACTIVE_TASK, true);
// AppScope.TaskLocalStorage.saveAll([task1, task2, task3]);
// var tasks = AppScope.TaskLocalStorage.getAll();
// console.log(tasks);