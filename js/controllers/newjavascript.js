var data = {
  "name" : "מין",
  "groups" : [
      {
          "name" : "נשים",
          "color" : ["#EC008C","#F8C1D9"],
          "data" : [10,8]
      },
      {
          "name" : "גברים",
          "color" : ["#00AEEF","#ABE1FA"],
          "data" : [4,-5]
      }
  ],
  "labels" : ["הצליחו","לא הצליחו"]
};


$('#container').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: 'מין'
            },
            xAxis: {
                labels: {
                    enabled: false
                },
                lineWidth: 0,
                tickLength: 0
            },
            yAxis: {
                min: -10,
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
            series: [{
                    name: 'נשים',
                    data: [null, null, null, null,
                        {
                            y: 10,
                            color: '#EC008C'
                        },
                        {
                            y: 4,
                            color: '#00AEEF'
                        }, null, null, null, null, null
                    ],
                    color: "#EC008C"
                }, {
                    name: 'גברים',
                    data: [null, null, null, null,
                        {
                            y: -8,
                            color: '#F8C1D9'
                        },
                        {
                            y: -5,
                            color: '#ABE1FA'
                        }, null, null, null, null, null
                    ],
                    color: "#00AEEF"
                }]
        }, function (chart) {
            var yZero = chart.yAxis[0].toPixels(0);
            chart.renderer.text('הצליחו', chart.plotLeft + chart.plotWidth - 50, yZero - 50).add();
            chart.renderer.text('לא הצליחו', chart.plotLeft + chart.plotWidth - 67, yZero + 50).add();
        });