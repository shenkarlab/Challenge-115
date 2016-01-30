angular.module('app').controller('infoController',['$scope','$state','$http','$compile', function($scope,$state,$http,$compile) {

    $scope.cities = [{id: 0,name:"bbb"}];
    $scope.dirty = {};
    $scope.sex = "zahar";
    $scope.marital = "single";
    $scope.children = 0;
    $scope.city_valid = false;


    $scope.openFancyBox = function (url) {
        $http.get(url).then(function (response) {
            if (response.status == 200) {

                var template = angular.element(response.data);
                var compiledTemplate = $compile(template);
                compiledTemplate($scope);
                $.fancybox.open(
                    {
                        content: template,
                        type: 'html',
                        maxWidth: '40%',
                        helpers: {
                            overlay: {closeClick: false} // prevents closing when clicking OUTSIDE fancybox
                        },
                        beforeShow: function () {
                            $(".fancybox-wrap").addClass("info-popup super");
                        }
                    }
                );
            }
        });
    };

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

        var souls = $scope.marital == "married" ? 2 : 1;
        souls += $scope.children;

        switch (souls) {
            case 1:
                $scope.souls = "נפש אחת";
                break;
            case 2:
                $scope.souls = "שתי נפשות";
                break;
            case 3:
                $scope.souls = "שלושה נפשות";
                break;
            case 4:
                $scope.souls = "ארבעה נפשות";
                break;
            case 5:
                $scope.souls = "חמישה נפשות";
                break;
            case 6:
                $scope.souls = "שישה נפשות";
                break;
            case 7:
                $scope.souls = "שבעה נפשות";
                break;
            case 8:
                $scope.souls = "שמונה נפשות";
                break;
            case 9:
                $scope.souls = "תשעה נפשות";
                break;
            case 10:
                $scope.souls = "עשרה נפשות";
                break;
        }

        $scope.budget = souls * 115;

        $scope.$parent.user = {
            city: $scope.dirty.value,
            children: $scope.children,
            sex: $scope.sex,
            marital: $scope.marital,
            budget: $scope.budget
        };
        $scope.openFancyBox('partials/template-budget.html');
    };

    $scope.gotoSuper = function() {
        $.fancybox.close();
        $state.transitionTo('supermarket');
    }

}]);
