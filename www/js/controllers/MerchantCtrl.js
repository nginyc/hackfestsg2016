app.controller('MerchantCtrl', function ($scope, $firebaseApp, $ionicPopup, $state, $user) {
    $scope.goToDashboard = function () {
        //TODO: check if user already inside
        //TODO: return confirmation popup if user already inside
        //TODO: else state go to dashboard
    };

    $scope.forceGoToDashboard = function () {
        //TODO: kick the old user out and force entry into dashboard
    };
});