/*global ngPrint, Pixastic, jsPDF, html2canvas */

ngPrint.factory('pdfPrinter', ['$q', '$timeout', function ($q, $timeout) {
    'use strict';
    
	var PdfPrinter = function () {
		var self = this,
            canvasShiftImage = function (oldCanvas, shiftAmt) {
                shiftAmt = parseInt(shiftAmt, 10) || 0;
                if (!shiftAmt) { return oldCanvas; }

                var newCanvas = document.createElement('canvas'),
                    ctx = newCanvas.getContext('2d');

                newCanvas.height = oldCanvas.height - shiftAmt;
                newCanvas.width = oldCanvas.width;

                Pixastic.process(oldCanvas, "crop", {rect: {left: 0, top: shiftAmt, width: oldCanvas.width, height: (oldCanvas.height - shiftAmt)}}, function (newCanvas) {
                    ctx.drawImage(newCanvas, 0, 0, newCanvas.width, newCanvas.height, 0, 0, newCanvas.width, newCanvas.height);
                });

                return newCanvas;
            },
	    
            /**
             * Creates new jsPDF document object instance.
             *
             * @param orientation One of "portrait" or "landscape" (or shortcuts "p" (Default), "l")
             * @param unit        Measurement unit to be used when coordinates are specified.
             *                    One of "pt" (points), "mm" (Default), "cm", "in"
             * @param format      One of 'pageFormats' as visible in jsPDF docs, default: a4
             * @returns {jsPDF}
             */
            generatePdfFromCanvas = function (canvas, orientation, unit, format) {
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

                while (totalPdfHeight < htmlPageHeight && safetyNet < 15) {
                    var newCanvas = canvasShiftImage(canvas, totalPdfHeight),
                        alias = Math.random().toString(35);
                    
                    pdf.addImage(newCanvas, 0, 0, pdfPageWidth, 0, 'png', alias, 'SLOW');

                    totalPdfHeight += (pdfPageHeight * pdfScaleFactor * htmlScaleFactor);

                    if (totalPdfHeight < htmlPageHeight) {
                        pdf.addPage();
                    }
                    safetyNet += 1;
                }

                return pdf;
            };

	    self.generatePdfFromElement = function (element, orientation, unit, format) {
            var deferred = $q.defer();
            
            html2canvas(element, {
                onrendered: function (canvas) {
                    var pdf = generatePdfFromCanvas(canvas, orientation, unit, format);
                    deferred.resolve(pdf);
                }
            });
            
            return deferred.promise;
	    };
	},

        inst = new PdfPrinter();
    
	return inst;
}]);