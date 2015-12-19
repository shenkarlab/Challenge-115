var app = angular.module('app');

app.controller('statisticsController', ['$scope', '$http', '$state', function ($scope, $http, $state) {
        $state.transitionTo('statistics.sex');
        $scope.chartsData = {};
    }]);

app.controller('chartController', function ($scope, $state, $http) {
    var currentState = $state.current.name;
    $scope.$parent.currentState = currentState;
    if (!(currentState in $scope.chartsData)) {
        $http.get('https://ws115.herokuapp.com/' + currentState ).then(function (res) {
            runChart(res.data);
            $scope.chartsData[currentState] = res.data;
        });
    }
    else {
        runChart($scope.chartsData[currentState]);
    }
    
    function runChart(data) {
        var series = extractSeries(data);
        $('#container').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: data.name
            },
            xAxis: {
                labels: {
                    enabled: false
                },
                lineWidth: 0,
                tickLength: 0
            },
            yAxis: {
                title: {
                    text: ''
                },
                gridLineWidth: 0,
                lineWidth: 0,
                plotLines: [{
                        color: '#000',
                        width: 2,
                        value: 0,
                        zIndex: 5
                    }],
                labels: {
                    formatter: function () {
                        var val = this.value;
                        val = (val < 0) ? val * -1 : val;
                        return val;
                    }
                }
            },
            legend: {
                align: 'left',
                verticalAlign: 'top',
                layout: 'vertical',
                x: 0,
                y: 100
            },
            tooltip: {
                enabled: false
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    events: {
                        legendItemClick: function () {
                            return false;
                        }
                    }
                },
                series: {
                    pointWidth: 30
                }
            },
            series: series
        }, function (chart) {
            var yZero = chart.yAxis[0].toPixels(0);
            chart.renderer.text(data.series[0].name, chart.plotLeft + chart.plotWidth - 50, yZero - 50).add();
            chart.renderer.text(data.series[1].name, chart.plotLeft + chart.plotWidth - 50, yZero + 50).add();
        });
    }
    
    function extractSeries(data) {
        var series = [];
        $.each(data.series,function(i,value){
            var element = {};
            element.name = data.series[0].values[i].name;
            element.color = data.series[0].values[i].color;
            element.data = [];
            $.each(value.values,function (j,innerVal){
                element.data.push({
                    y: innerVal.value,
                    color: innerVal.color
                });
            });
            series.push(element);
        });
        return series;
    }

});