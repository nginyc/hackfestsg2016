app.controller('PaymentCtrl', function ($scope, $firebaseApp, $ionicPopup, $state, $user) {
    $scope.pay = function () {
        //TODO: invoke method to send payment information

        //TODO: if no error go back home
        $state.go('app.home');

        //TODO: else, show error message as popover
    }

    //TODO: have a scope variable storing store info
});