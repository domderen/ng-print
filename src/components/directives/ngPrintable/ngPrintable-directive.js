/*global ngPrint*/

ngPrint.directive('ngPrintable', [function () {
    'use strict';
    
	return {
		restrict: 'A',
        scope: {
            orientation: '@?',
            unit: '@?',
            format: '@?'
        },
		link: function ($scope, element) {
			$scope.element = element;
		},
        controller: function ($scope) {
            this.getElement = function () {
                return $scope.element;
            };
        }
    };
}]);
