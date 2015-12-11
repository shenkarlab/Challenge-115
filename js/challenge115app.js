// app.js
var app = angular.module('app', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/home');
    
    $stateProvider
        
        .state('home', {
            url: '/home',
            templateUrl: 'partial-home.html'
        })
        
        .state('about', {
            // we'll get to this in a bit       
        });
        
});
