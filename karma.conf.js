'use strict';

module.exports = function(config){
  config.set({
    files : [
        'bower_components/angular/angular.js',
        'bower_components/angular-mocks/angular-mocks.js',
        'src/ngPrint-module.js',
        'karma-init.js',
        'src/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['PhantomJS'],

    plugins : [
                'karma-chrome-launcher',
                'karma-phantomjs-launcher',
                'karma-jasmine'
    ]
  });
};