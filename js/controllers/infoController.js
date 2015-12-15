angular.module('app').controller('infoController',['$scope', function($scope) {
    $scope.greeting = 'Hola!';


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
    * On Registration Form
     */
    $scope.registerForm = function() {
        angular.forEach($scope.user, function(value, key) {
            console.log('value: ' + value);
        });
    }
}]);
