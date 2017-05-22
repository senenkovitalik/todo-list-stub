var AppScope = window.AppScope || {};

AppScope.UID = 	function UID() {
	var date = new Date();
	var arr = [date.getSeconds(),
    		date.getMilliseconds(),
    		Math.floor(Math.random() * (999 - 100)) + 100];

    var id = arr.join("");

	return id;	
}