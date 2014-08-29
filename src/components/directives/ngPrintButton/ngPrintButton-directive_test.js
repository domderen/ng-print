describe('ngPrintButton-directive', function () {
    'use strict';
    
	beforeEach(module('ngPrint'));

	describe('ngPrintButton link', function () {
		var $rootScope, $compile, $scope, pdfPrinter;

		beforeEach(inject(function (_$rootScope_, _$compile_, _pdfPrinter_) {
			$rootScope = _$rootScope_;
			$compile  = _$compile_;
			$scope = $rootScope.$new();
            pdfPrinter = _pdfPrinter_;
            
            spyOn(pdfPrinter, 'generatePdfFromElement');
		}));

		it('should assign click handler on link', function () {
            var el = $compile('<div ng-printable><button ng-print-button></button></div>')($scope);
			$scope.$digest();
            
            var button = el.find('button');
            var scope = button.isolateScope();
            spyOn(scope, 'print');
			button[0].click();
            expect(scope.print).toHaveBeenCalled();
		});
        
        describe('print()', function () {
            it('should invoke pdf generation service', function () {
                var el = $compile('<div ng-printable><button ng-print-button></button></div>')($scope);
                $scope.$digest();

                var button = el.find('button');
                var scope = button.isolateScope();

                scope.print();

                expect(pdfPrinter.generatePdfFromElement).toHaveBeenCalledWith(jasmine.any(Object), 'p', 'pt', 'a4');
            });
            
            it('should invoke pdf generation service on body element', function () {
                var el = $compile('<div ng-printable><button ng-print-button printWholePage="true"></button></div>')($scope);
                $scope.$digest();

                var button = el.find('button');
                var scope = button.isolateScope();

                scope.print();

                expect(pdfPrinter.generatePdfFromElement).toHaveBeenCalledWith(jasmine.any(Object), 'p', 'pt', 'a4');
            });
            
            it('should invoke pdf generation service with parameters', function () {
                var el = $compile('<div ng-printable orientation="someOrientation" unit="someUnit" format="someFormat"><button ng-print-button></button></div>')($scope);
                $scope.$digest();

                var button = el.find('button');
                var scope = button.isolateScope();

                scope.print();

                expect(pdfPrinter.generatePdfFromElement).toHaveBeenCalledWith(jasmine.any(Object), 'someOrientation', 'someUnit', 'someFormat');
            });
        });
	});
});