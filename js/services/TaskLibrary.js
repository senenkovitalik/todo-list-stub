var AppScope = window.AppScope ? window.AppScope : {};

AppScope.TaskLibrary = (function(){

    var selectedTasks = [];
    var completedTasks = [];
    var taskCount = 0;  // task amount in LS

    function addSelected(task){
        if ($.inArray(task, selectedTasks)) {
            selectedTasks.push(task);
        }
    }

    function removeSelected(task){
        var index = jQuery.inArray(task, selectedTasks);
        if (index) {
            selectedTasks.splice(index, 1);
        }
    }

    function getSelected(){
        return selectedTasks;
    }

    function getSelectedCount(){
        return selectedTasks.length;
    }

    function setTasksCount(count){
        taskCount = count;
    }

    function isAllSelected(){
        return (getSelectedCount() === taskCount);
    }

    return {
        addSelected: addSelected,
        removeSelected: removeSelected,
        getSelected: getSelected,
        getSelectedCount: getSelectedCount,
        setTasksCount: setTasksCount,
        isAllSelected: isAllSelected
    }
})();