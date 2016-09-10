app.controller('HomeCtrl', function ($scope, $firebaseApp, $state, $user, $ionicModal, $ionicPopover) {
    if (!$user.isLoggedIn()) {
        $state.go('signin');
    }

    $scope.user = $user;

    $scope.numbers;

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
        $scope.keypad.remove();
    });

    $ionicPopover.fromTemplateUrl('templates/keypad.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (popover) {
        $scope.keypad = popover;
    });

    $scope.openKeypad = function () {
        $scope.keypad.show();
    };

    $scope.closeKeypad = function () {
        $scope.keypad.hide();
    };

    $scope.keyboardSettings = {
        roundButtons: true,

        action: function (number) {
            var n = $scope.numbers;
            if (n > 9999) {
                return;
            } else {
                $scope.numbers = n * 10 + number;
            }
        },

        leftButton: {
            html: '<i class="icon ion-backspace"></i>',
            action: function () {
                console.log('back button pressed');
                console.log($scope.numbers);
                var n = $scope.numbers;
                $scope.numbers = (n - n % 10) / 10;
                console.log($scope.numbers);
            }
        },

        rightButton: {
            html: '<i class="icon ion-checkmark-circled"></i>',
            action: function () {
                pay();
            }
        }
    }

    $scope.getIdByQr = function () {

        //TODO: invoke QR code
        $state.go('payment');
        //TODO: if correct, route to payment state

        //TODO: invoke code confirmation method
    };

    $scope.getIdByText = function () {
        $scope.openKeypad();
    };

    verifyCode = function () {
        //TODO: if correct then go to payment page

        //TODO: if wrong then show popover saying its wrong
    };

});