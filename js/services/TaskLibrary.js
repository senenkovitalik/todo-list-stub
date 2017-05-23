var AppScope = window.AppScope ? window.AppScope : {};

AppScope.TaskLibrary = (function(){

    var selectedTasks = [];
    var completedTasks = [];

    function addSelected(task){
        selectedTasks.push(task);
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

    return {
        addSelected: addSelected,
        removeSelected: removeSelected,
        getSelected: getSelected,
        getSelectedCount: getSelectedCount
    }
})();