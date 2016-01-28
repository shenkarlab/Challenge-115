angular.module('app').controller('marketController',['$scope','$state','productsFactory', function($scope, $state, productsFactory) {
    $scope.greeting = 'Hola!';
    $scope.user.age = 25;
    $scope.user.children = 0;
    $scope.category = "פירות וירקות";
    $scope.isles = [];
    $scope.pages = [];
    $scope.pages.push(  {"id":"veg_page", "name": "פירות וירקות"}    );
    $scope.counter = 0;

    /* Globals */
    var counter_element = null;

    // init only when DOM is ready
    angular.element(document).ready(function () {
        console.log('controller: document is ready');

        var svg = document.getElementById('veg_page');
        svg.addEventListener('load', function()
        {
            // Operate upon the SVG DOM here
            console.log('svg is ready');
            init();
            //e.getSVGDocument().querySelector('#some-node').textContent = "New text!";
        });


    });




    var init =  function() {
        productsFactory.initialize().then(function (results) {
            console.log('after factory promise');
            productsFactory.ready = true;
            $scope.isles = results.data;
            console.log('isles are ready');
            // now that were ready, activate Events Function

            var a = document.getElementById("veg_page");
            // Get the SVG document inside the Object tag
            var svgDoc = a.contentDocument;
            // we got all <g> tags
            var g_groups =  svgDoc.children[0].children;
            var panel = g_groups['panel'];
            counter_element = g_groups['panel'].children['shoppingcart'].children['itemscounter'];
            //counter_element.innerHTML = $scope.counter;

            assignProductsEvents();
        });

    }


    function addItem(product, product_element) {
        console.log('hello item');
        //console.log('product: ' + product.parentElement.id);
        $scope.cart.items.push(product);
        $scope.cart.total += parseFloat(product.price);
        $scope.counter += 1;
        counter_element.innerHTML = $scope.counter;
        $(product_element).hide(350);

    }

    /*
    * 1. Assign Cursor: Pointer to every product
    * 2. Assign event click --> addItem()
    */
    var assignProductsEvents =  function() {
        var current_product = {};
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
            var isle_num = null, product_num = null;

            // Match Between page.name & isles[i]['_id']
            for(var j=0; j< $scope.isles.length; j++) {
                if($scope.isles[j]['_id'] == $scope.pages[i].name) {
                    isle_num = j;
                    //console.log('matched: ' + $scope.isles[j]['_id']);
                    var items = $scope.isles[j].items;    // we need every --> items.e_id
                    // iterate over that isle items
                    for(var k=0;k<items.length;k++) {
                        current_product.num = k;                     // product number in isle
                        current_product.name = items[k]['e_id']; // product name
                        // relate between (server product.e_id == DOM group of product <g>'s)
                        try {
                            g_items = g_groups[current_product.name].children; // specific g products from DOM
                            //console.log('k: ' + k + ' current_product: ' + current_product);
                        }
                        catch(err) {
                            console.log('k: ' + k + ' current_product: ' + current_product.name);
                            console.log('dom error');
                            console.log(err);
                            // retry here
                            try {
                                g_items = g_groups[current_product.name].children; // specific g products from DOM
                            }
                            catch(e) {
                                console.log('second time fell | current_product: ' + current_product.name);
                            }
                        }


                        // now we can assign for sure
                        $.each( g_items, function(key, child) {

                            // enter in if contains product name
                            if( (child['id'].indexOf(current_product.name)) >= 0 ) {
                                var temp_item = $scope.isles[isle_num].items[current_product.num];

                                //console.log('child: ' + child.id );
                                //$(this).attr( "ng-click", "addItem()" );
                                $(this).css('cursor','pointer');
                                $(this).bind("click", function() {
                                    /* Assign addItem() Function with isle_number & the item number in isle */
                                    addItem(temp_item, this);
                                });
                            }
                        });
                        // empty g_items
                        g_items = [];
                    }
                }
            }

        }
    }


}]);
