// app.js
var app = angular.module('app', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');
<<<<<<< HEAD

=======
        
>>>>>>> 894f1bbe4c7f7a541689dbb12e81cc6f96f0320a
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
<<<<<<< HEAD
            templateUrl: 'partials/partial-statistics.html'
        })


        .controller('mainController',function($scope){
            $scope.hello = "hello";
        })

        .controller('home',['$scope',function($scope){

        }]);
=======
            templateUrl: 'partials/partial-statistics.html'      
        });
>>>>>>> 894f1bbe4c7f7a541689dbb12e81cc6f96f0320a
});
        
app.controller('mainController',function($scope){
    $scope.hello = "hello";
})

.controller('home',['$scope',function($scope){

}]);
