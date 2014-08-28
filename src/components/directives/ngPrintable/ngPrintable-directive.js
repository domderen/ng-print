/* global ngPrint*/
'use strict';

ngPrint.directive('ngPrintable', [function () {
	return {
		restrict: 'A',
		scope: {
			orientation: '@?',
			unit: '@?',
			format: '@?'
		},
		link: function ($scope, element, attrs) {
			$scope.element = element;
		},
		controller: function ($scope) {
			this.element = $scope.element;
		}
	};
}]);