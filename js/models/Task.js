<<<<<<< HEAD
var AppScope = window.AppScope ? window.AppScope : {};
=======
var AppScope = window.AppScope || {};
>>>>>>> 8c7f10b5a6978438ff8cbceac5e8e992ea2db752

AppScope.Task = function (id, value, status, isChecked) {
    this.id = id;
    this.value = value;
    this.status = status; // Enum <TaskStatus.js>
    this.isChecked = isChecked;
};

AppScope.Task.prototype = {
    fromJSON: function (json) {
        this.id = json.id;
        this.value = json.value;
        this.status = AppScope.TaskStatusEnum.getByCode(json.status);
        this.isChecked = Boolean(json.isChecked);

        return this;
    },

    toJSON: function () {
        return {
            id: this.id,
            value: this.value,
            status: this.status.code,
            isChecked: this.isChecked
        }
    },

    toString: function () {
        return JSON.stringify(this.toJSON());
    }
};