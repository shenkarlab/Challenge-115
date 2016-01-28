app.factory('smsFactory', function($http, $q) {

    var url = '//localhost:3000';

    function getSms(status,sex,children) {
        return ($http.get(url + '/sms?status=' + status + '&sex=' + sex + '&children=' + children)
            .then(handleSuccess,handleError));
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
        getSms : getSms
    });

});