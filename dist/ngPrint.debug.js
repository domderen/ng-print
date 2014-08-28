'use strict';

var ngPrint = angular.module('ngPrint', []);
/* global ngPrint*/
'use strict';

ngPrint.factory('pdfPrinter', ['$q', '$timeout', function ($q, $timeout) {
	var PdfPrinter = function () {
		var self = this;

	    var canvasShiftImage = function (oldCanvas,shiftAmt) {
	        shiftAmt = parseInt(shiftAmt) || 0;
	        if(!shiftAmt){ return oldCanvas; }

	        var newCanvas = document.createElement('canvas');
	        newCanvas.height = oldCanvas.height - shiftAmt;
	        newCanvas.width = oldCanvas.width;
	        var ctx = newCanvas.getContext('2d');

	        Pixastic.process(oldCanvas, "crop", {rect: {left: 0, top: shiftAmt, width: oldCanvas.width, height: (oldCanvas.height - shiftAmt)}}, function (newCanvas) {
	                ctx.drawImage(newCanvas, 0, 0, newCanvas.width, newCanvas.height, 0, 0, newCanvas.width, newCanvas.height);
	         });

	        return newCanvas;
    	};
	    
	    /**
		 * Creates new jsPDF document object instance.
		 *
		 * @param orientation One of "portrait" or "landscape" (or shortcuts "p" (Default), "l")
		 * @param unit        Measurement unit to be used when coordinates are specified.
		 *                    One of "pt" (points), "mm" (Default), "cm", "in"
		 * @param format      One of 'pageFormats' as visible in jsPDF docs, default: a4
		 * @returns {jsPDF}
		 */
	    var generatePdfFromCanvas = function (canvas, orientation, unit, format) {
	        var pdf = new jsPDF(orientation, unit, format),
	            pdfInternals = pdf.internal,
	            pdfPageSize = pdfInternals.pageSize,
	            pdfScaleFactor = pdfInternals.scaleFactor,
	            pdfPageWidth = pdfPageSize.width,
	            pdfPageHeight = pdfPageSize.height,
	            totalPdfHeight = 0,
	            htmlPageHeight = canvas.height,
	            htmlScaleFactor = canvas.width / (pdfPageWidth * pdfScaleFactor),
	            safetyNet = 0;
	        
	        while(totalPdfHeight < htmlPageHeight && safetyNet < 15){
	            var newCanvas = canvasShiftImage(canvas, totalPdfHeight);
	            var alias = Math.random().toString(35);
	            pdf.addImage(newCanvas, 0, 0, pdfPageWidth, 0, 'png', alias, 'SLOW');
	            
	            totalPdfHeight += (pdfPageHeight * pdfScaleFactor * htmlScaleFactor);
	            
	            if(totalPdfHeight < htmlPageHeight){
	                pdf.addPage();
	            }
	            safetyNet++;
	        }
	        
	        return pdf;
	    };

	    self.generatePdfFromElement = function (element, orientation, unit, format) {
	    	var deferred = $q.defer();

	    	$timeout(function () {
	    		html2canvas(element, {
	        		onrendered: function(canvas){
	            		var pdf = generatePdfFromCanvas(canvas, orientation, unit, format);
	            		pdf.output("dataurlnewwindow");
	            		pdf = null;
	        		}
	    		});
	    	});

	    	return deferred.promise;
	    };
	};

	var inst = new PdfPrinter();
	return inst;
}]);
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