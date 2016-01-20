app.factory('productsFactory', function($http, $q) {
    var prodFactory = {};
    prodFactory.isles = []; // represent the products array


    /*
    * Initially Get All Products Resolved By Category
     */
    $http.get('https://ws115.herokuapp.com/group_by_category').then(function (res) {
        prodFactory.isles = res.data;
        console.log('hey ' + res.data);
    });

    console.log('factory isles: ' + prodFactory.isles);

    prodFactory.getProducts = function() {
        $http.get(urlBase).then( function(response) {
            return response.data;
        });
    };

    /*
     * Refresh Our Songs List
     */
    prodFactory.refreshProducts = function() {
        return $http.get(urlBase);
    }

    /*
     * Function to remove a song from the list
     */
    prodFactory.removeSong = function() {
        var deferred = $q.defer();

        console.log('inside dataFactory remove song: ' + prodFactory.choice);
        deferred.resolve($http.delete("https://band-songs.herokuapp.com/api/v1/song/" + prodFactory.choice._id).then(function(response) {
            console.log(response.data.item_deleted);
            if(response.data.item_deleted =="success") {
                console.log('harray');
                prodFactory.choice = null; // reset song to null value
                /*var index = $scope.products.indexOf(selected);
                 $scope.products.splice(index, 1);   */
            }
        }));

        return deferred.promise;


    }

    //console.log(_prodFactory.getProducts());
    return prodFactory;
});