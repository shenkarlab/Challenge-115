// app.js
var app = angular.module('app', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider,$locationProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');
        
    $stateProvider
        
        .state('home', {
            url: '/',
            templateUrl: 'partials/partial-home.html'
        })
        
        .state('info', {
            url: '/info',
            templateUrl: 'partials/partial-info.html',
            controller : 'infoController'
        })
        
        .state('supermarket', {
            url: '/supermarket',
            templateUrl: 'partials/partial-supermarket.html',
            controller : 'superController'
        })
        
        .state('statistics', {
            url: '/statistics',
            templateUrl: 'partials/partial-statistics.html'      
        });
});
        
app.controller('mainController',function($scope){
    $scope.hello = "hello";
    $scope.cart = {};
})

.controller('home',['$scope',function($scope){
    
}]);
