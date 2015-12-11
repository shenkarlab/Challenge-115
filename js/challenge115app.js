// app.js
var app = angular.module('app', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {

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
            templateUrl: 'partials/partial-supermarket.html'      
        })
        
        .state('statistics', {
            url: '/statistics',
            templateUrl: 'partials/partial-statistics.html'      
        });
});
        
app.controller('mainController',function($scope){
    $scope.hello = "hello";
})

.controller('home',['$scope',function($scope){

}]);
