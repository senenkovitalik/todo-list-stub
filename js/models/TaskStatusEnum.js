<<<<<<< HEAD
var AppScope = window.AppScope ? window.AppScope : {};
=======
var AppScope = window.AppScope || {};
>>>>>>> 8c7f10b5a6978438ff8cbceac5e8e992ea2db752

AppScope.TaskStatusEnum = (function () {
    var TaskStatus = function (code, label) {
        this.code = code;
        this.label = label;
    };

    var ACTIVE_TASK = new TaskStatus("ACTIVE_TASK", "Active");
    var COMPLETED_TASK = new TaskStatus("COMPLETED_TASK", "Completed");

    function getByCode(code) {
        if (code in this) {
            return this[code];
        } else {
            throw new Error("Task Code is not found");
        }
    }

    return {
        ACTIVE_TASK: ACTIVE_TASK,
        COMPLETED_TASK: COMPLETED_TASK,
        getByCode: getByCode
    }
})();