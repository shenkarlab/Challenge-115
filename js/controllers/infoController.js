angular.module('app').controller('infoController',['$scope', function($scope) {
    $scope.greeting = 'Hola!';
    $scope.user.age = 25;


    /*
    * On Checkbox Changed
     */
    $(':checkbox').change(function() {
        console.log('value: ' + this.value);
        var gen = this.value;
        $scope.user.gender = gen;
        // do stuff here. It will fire on any checkbox change

    });

    /*
    * On Marital Picture Click
     */
    $scope.setMarital = function(income_marital) {
        $scope.user.marital = income_marital;
        console.log(income_marital);
    }

    /*
    * Increment The Aage Parameter
     */
    $scope.increment = function() {
        $scope.user.age ++;
        console.log('age: ' + $scope.user.age);
    }

    /*
     * Decrement The Aage Parameter
     */
    $scope.decrement = function() {
        $scope.user.age --;
        console.log('age: ' + $scope.user.age);
    }

    /*
    * On Registration Form
     */
    $scope.registerForm = function() {
        angular.forEach($scope.user, function(value, key) {
            console.log('value: ' + value);
        });
    }
}]);
