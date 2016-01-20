angular.module('app').controller('vegetablesController',['$scope','$state','productsFactory', function($scope, $state, productsFactory) {
    $scope.greeting = 'Hola!';
    $scope.user.age = 25;
    $scope.user.children = 0;
    $scope.user.city = "תל אביב";
    $scope.products = [];
    var marital= productsFactory;


    /*$http.get('https://ws115.herokuapp.com/group_by_category').then(function (res) {
        $scope.products = res.data;
        $("#super").mousewheel(function (event, delta) {

            this.scrollLeft -= (delta * 5);
            event.preventDefault();
        });
    }); */


    /*
    * Init Function
    */
    var init = function() {
          // 1. make a call for server side to bring relative data for vegetables page
         // 2. assign values to each group of products
        // 3. relate onclick and mouse cursor for each one of them
    }


}]);
