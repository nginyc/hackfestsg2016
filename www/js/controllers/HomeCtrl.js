app.controller('HomeCtrl', function ($scope, $firebaseApp, $state, $user, $ionicModal, $location) {
    if (!$user.isLoggedIn()) {
        $state.go('login');
    }

    $scope.user = $user;

    $ionicModal.fromTemplateUrl('templates/receipt.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.receipt = modal;
    });
    $scope.openReceipt = function () {
        $scope.receipt.show();
    };
    $scope.closeReceipt = function () {
        $scope.receipt.hide();
    };
    // Cleanup the modal when we're done with it
    $scope.$on('$destroy', function () {
        $scope.receipt.remove();
    });

    $scope.getIdByQr = function () {

        //TODO: invoke QR code
        $state.go('payment');
        //TODO: if correct, route to payment state

        //TODO: invoke code confirmation method
    };

    $scope.getIdByText = function () {
        $state.go('payment');
        //TODO: invoke state/modal for input
        //TODO: invoke code confirmation method
    };

    verifyCode = function () {
        //TODO: if correct then go to payment page

        //TODO: if wrong then show popover saying its wrong
    };

});