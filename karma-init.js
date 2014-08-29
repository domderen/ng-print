/*global ngPrint, angular*/

ngPrint.factory('resourceMock', ['$q', function ($q) {
    'use strict';
    
    return function (data) {
        data = data || {};
        var dfd = $q.defer(),
            promise = dfd.promise.then(function (resource) { return angular.extend(data, resource); });
        
        return dfd;
    };
}]);