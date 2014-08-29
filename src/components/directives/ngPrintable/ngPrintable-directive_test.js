describe('ngPrintable-directive', function () {
    'use strict';
    
	beforeEach(module('ngPrint'));

	describe('ngPrintable link', function () {
		var $rootScope, $compile, $scope;

		beforeEach(inject(function (_$rootScope_, _$compile_) {
			$rootScope = _$rootScope_;
			$compile  = _$compile_;
			$scope = $rootScope.$new();
		}));

		it('should assign element to scope during link', function () {
            var el = $compile('<div id="printableElement" ng-printable></div>')($scope);
			$scope.$digest();
            
            var element = el.isolateScope().element;
			var elementId = element[0].attributes['id'].value;
			expect(elementId).toBe('printableElement');
		});
        
        it('should have additional paramters assigned to scope', function () {
            var el = $compile('<div id="printableElement" ng-printable orientation="p" unit="pt" format="a4"></div>')($scope);
			$scope.$digest();
            
            var scope = el.isolateScope();
			expect(scope.orientation).toBe('p');
			expect(scope.unit).toBe('pt');
			expect(scope.format).toBe('a4');
		});
	});
});