angular.module('app').controller('infoController',['$scope','$state','$http', function($scope,$state,$http) {

    $scope.cities = [{id: 0,name:"bbb"}];
    $scope.dirty = {};
    $scope.sex = "zahar";
    $scope.marital = "single";
    $scope.children = 0;
    $scope.city_valid = false;

    function suggest_city(term) {
        var q = term.toLowerCase().trim();
        var results = [];

        // Find first 10 states that start with `term`.
        for (var i = 0; i < $scope.cities.length && results.length < 10; i++) {
            var city = $scope.cities[i];
            if (city.name.toLowerCase().indexOf(q) === 0)
                results.push({ label: city.name, value: city.name });
        }

        return results;
    }

    $scope.check_city = function () {
        var city_selected = $scope.dirty.value;
        for (var i = 0 ; i < $scope.cities.length ; i++) {
            if (city_selected === $scope.cities[i].name ) {
                $scope.city_valid = true;
                break;
            }
            else {
                $scope.city_valid = false;
            }
        }
        if (!$scope.city_valid) {
            $scope.dirty.value = "";
        }
        else {
            $("input.city").removeClass("error");
        }
    };
    $scope.autocomplete_options = {
        suggest: suggest_city
    };

    $http.get('./misc/israel-cities.json').then(function(res){
        $scope.cities = res.data;
    });
    /*
    * Increment The Age Parameter
     */
    $scope.increment = function() {
        if ($scope.children == 8) {
            return;
        }
        $scope.children ++;
    };

    /*
     * Decrement The Age Parameter
     */
    $scope.decrement = function() {
        if ($scope.children == 0) {
            return;
        }
        $scope.children --;
    };

    /*
    * On Registration Form
     */
    $scope.register = function() {
        if (!$scope.city_valid) {
            $("input.city").addClass("error");
            return;
        }
        $scope.$parent.user = {
            city: $scope.dirty.value,
            children: $scope.children,
            sex: $scope.sex,
            marital: $scope.marital
        };

        $state.transitionTo('supermarket');
    }


}]);
