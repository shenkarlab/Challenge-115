angular.module('app').controller('vegetablesController',['$scope','$state', function($scope,$state) {
    $scope.greeting = 'Hola!';
    $scope.user.age = 25;
    $scope.user.children = 0;
    $scope.user.city = "תל אביב";
    var marital;

    /*
    * Init Function
    */
    var init = function() {
          // 1. make a call for server side to bring relative data for vegetables page
         // 2. assign values to each group of products
        // 3. relate onclick and mouse cursor for each one of them
    }


}]);
