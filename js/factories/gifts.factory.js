app.factory('giftsFactory', function($http, $q) {
    var url = '//ws115.herokuapp.com';

    function getGifts() {
        return ($http.get(url + '/gifts')
            .then(handleSuccess, handleError));
    }

    function getGift(id) {
        return ($http.get(url + '/gift?id=' + id)
            .then(handleSuccess, handleError));
    }

    function handleSuccess(response) {
        return response;
    }

    function handleError(response) {
        if (!angular.isObject(response.data) || !response.data.message) {
            return($q.reject("An unknown error occurred."));
        }
        return($q.reject(response.data.message));
    }

    return({
        getGift: getGift,
        getGifts: getGifts
    });
});