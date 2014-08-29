/*global ngPrint*/


ngPrint.directive('ngPrintButton', ['$window', 'pdfPrinter', function ($window, pdfPrinter) {
    'use strict';
    
	return {
		restrict: 'AC',
		require: '^ngPrintable',
		scope: {
			printWholePage: '&?',
            saveAs: '@?'
		},
		link: function ($scope, element, attr, ngPrintableController) {
			var getConfigAttributes = function (element) {
				return {
					orientation: element[0].attributes['orientation'] ? element[0].attributes['orientation'].value : 'p',
					unit: element[0].attributes['unit'] ? element[0].attributes['unit'].value : 'pt',
					format: element[0].attributes['format'] ? element[0].attributes['format'].value : 'a4'
				};
			};

			$scope.print = function () {
				var element;

				if ($scope.printWholePage()) {
					element = $window.document.body;
				} else if (ngPrintableController) {
					element = ngPrintableController.getElement();
				}

				if (element) {
					var config = getConfigAttributes(element);
					var promise = pdfPrinter.generatePdfFromElement(element, config.orientation, config.unit, config.format);
                    
                    promise.then(function (pdf) {
                        if($scope.saveAs) {
                            pdf.save($scope.saveAs);
                        } else {
                            pdf.output('dataurlnewwindow');
                        }

                        pdf = null;
                    });
				} else {
					throw new SyntaxError('No template element provided. Try using ngPrintable directive.');
				}
			};

			element.on('click', function () {
                $scope.print();
            });
		}
	};
}]);