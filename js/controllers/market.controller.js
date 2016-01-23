angular.module('app').controller('marketController',['$scope','$state','productsFactory', function($scope, $state, productsFactory) {
    $scope.greeting = 'Hola!';
    $scope.user.age = 25;
    $scope.user.children = 0;
    $scope.category = "פירות וירקות";
    $scope.isles = [];
    $scope.pages = [];
    $scope.pages.push(  {"id":"veg_page", "name": "פירות וירקות"}    );

    // init only when DOM is ready
    angular.element(document).ready(function () {
        console.log('controller: document is ready');
        init();
    });




    function init() {
        productsFactory.initialize().then(function (results) {
            console.log('after factory promise');
            productsFactory.ready = true;
            $scope.isles = results.data;
            console.log('isles are ready');
            // now that were ready, activate Events Function
            assignProductsEvents();
        });

    }

    /*
    * 1. Assign Cursor: Pointer to every product
    * 2. Assign event click --> addItem()
    */
    var assignProductsEvents =  function() {
        var current_product;
        var g_items = [];

        /*
        * for every svg page
         */
        for(var i =0; i<$scope.pages.length; i++) {
            // 1. iterate over every svg page
            var a = document.getElementById("veg_page");
            // Get the SVG document inside the Object tag
            var svgDoc = a.contentDocument;
            // we got all <g> tags
            var g_groups =  svgDoc.children[0].children;

            // Match Between page.name & isles[i]['_id']
            for(var j=0; j< $scope.isles.length; j++) {
                if($scope.isles[j]['_id'] == $scope.pages[i].name) {
                    //console.log('matched: ' + $scope.isles[j]['_id']);
                    var items = $scope.isles[j].items;    // we need every --> items.e_id
                    // iterate over that isle items
                    for(var k=0;k<items.length;k++) {
                        current_product = items[k]['e_id'];
                        // relate between (server product.e_id == DOM group of product <g>'s)
                        try {
                            g_items = g_groups[current_product].children; // specific g products from DOM
                            //console.log('k: ' + k + ' current_product: ' + current_product);
                        }
                        catch(err) {
                            console.log('k: ' + k + ' current_product: ' + current_product);
                            console.log('dom error');
                            console.log(err);
                            // retry here
                            try {
                                g_items = g_groups[current_product].children; // specific g products from DOM
                            }
                            catch(e) {
                                console.log('second time fell | current_product: ' + current_product);
                            }
                        }


                        // now we can assign for sure
                        $.each( g_items, function(key, child) {


                            // enter in if contains product name
                            if( (child['id'].indexOf(current_product)) >= 0 ) {
                                //console.log('child: ' + child.id );
                                $(this).css('cursor','pointer');
                                $(this).click(function() {
                                    //eggplants_array.push($(this));
                                    //console.log('last element: ' + eggplants_array[0]);
                                    $(this).hide(350);
                                });
                            }
                        });
                        // empty g_items
                        g_items = [];
                    }



                }
            }



            var eggplants = g_groups['eggplant'].children;
        }



    }

    /*
    * Init Function
    */
    var init = function() {
          // 1. make a call for server side to bring relative data for vegetables page
         // 2. assign values to each group of products
        // 3. relate onclick and mouse cursor for each one of them
    }


}]);
