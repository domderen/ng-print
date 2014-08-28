/*global ngPrint*/
'use strict';

ngPrint.directive('ngPrintButton', ['$window', 'pdfPrinter', function ($window, pdfPrinter) {
	return {
		restrict: 'AC',
		require: '^ngPrintable',
		scope: {
			printWholePage: '&?'
		},
		link: function ($scope, element, attr, ngPrintableController) {
			var getConfigAttributes = function (element) {
				return {
					orientation: element.attributes['orientation'] ? element.attributes['orientation'].value : 'p',
					unit: element.attributes['unit'] ? element.attributes['unit'].value : 'pt',
					format: element.attributes['format'] ? element.attributes['format'].value : 'a4'
				};
			};


			$scope.print = function () {
				var element;

				if($scope.printWholePage) {
					element = $window.document.body;
				} else if(ngPrintableController) {
					element = ngPrintableController.element;
				}

				if(element) {
					var config = getConfigAttributes(element);
					pdfPrinter.generatePdfFromElement(element, config.orientation, config.unit, config.format);
				} else {
					throw new SyntaxError('No template element provided. Try using ngPrintable directive.');
				}
			};

			element.on('click', $scope.print);
		}
	};
}]);