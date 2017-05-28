"use strict";
var AppScope = window.AppScope ? window.AppScope : {};

AppScope.LocationService = (function(){
    function setHash(value){
        location.hash = value;
    }

    function getHash(){
        return location.hash;
    }

    function getFilterValue(){
        return getHash().substring(8);
    }

    return {
        setHash: setHash,
        getHash: getHash,
        getFilterValue: getFilterValue
    }
})();