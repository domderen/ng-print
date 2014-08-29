'use strict';

describe('ngPrintable-directive', function () {

	beforeEach(module(ngPrint));

	describe('ngPrintable link', function () {
		var $rootScope, $compile, $scope, element;

		beforeEach(inject(function (_$rootScope_, _$compile_) {
			$rootScope = _$rootScope_;
			$compile  = _$compile_;

			$scope = $rootScope.$new();

			element ='<div id="printableElement" ng-printable></div>';

			element = $compile(element)($scope);
			$rootScope.$digest();
		}));

		it('should assign element to scope during link', function () {
			var elementId = $scope.element.attr('id');
			expect(elementId).toBe('printableElement');
		});
	});
});