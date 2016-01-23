// app.js
var app = angular.module('app', ['ui.router','ngSanitize','MassAutoComplete']);

app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');

    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'partials/partial-home.html'
    })

            .state('info', {
                url: '/info',
                templateUrl: 'partials/partial-info.html',
                controller: 'infoController'
            })

            /*.state('supermarket', {
                url: '/supermarket',
                templateUrl: 'partials/partial-supermarket.html',
                controller: 'superController'
            }) */

            .state('supermarket', {
                url: '/supermarket',
                templateUrl: 'partials/supermarket.html',
                controller: 'marketController'
            })

            .state('statistics', {
                url: '/statistics',
                templateUrl: 'partials/partial-statistics.html',
                controller: 'statisticsController'

            })

            .state('statistics.sex', {
                templateUrl: 'partials/partial-statistics.chart.html',
                controller: 'chartController'
            })

            .state('statistics.age', {
                templateUrl: 'partials/partial-statistics.chart.html',
                controller: 'chartController'
            });
});

app.controller('mainController', function ($scope) {
    $scope.ready  = false;
    $scope.hello = "hello";
    $scope.cart = {
        "user": $scope.user,
        "items": [],
        "total": 0,
        "failed": false
    };
    $scope.user = {};
    //$scope.user;
});

// This is where your initialization code goes, which
// may depend on services declared on the module.
// Initalize the productsFactory with its data, on application run()
/*app.run(['$window', 'productsFactory', function($window, productsFactory) {
    /*productsFactory.initialize().then(function(results){
        console.log('after factory promise');
        //$scope.ready = true;
        // deal with results.
    }); */


    /*console.log('factory finished');
    //$window.alert('Started!');
    console.log('App Started!');
}]); */

