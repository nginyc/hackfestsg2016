app.controller('PaymentCtrl', function ($scope, $firebaseApp, $ionicPopup, $state, $user) {
    //TODO: get the store info
    $scope.store = {};

    //TODO: get user balance from server
    $scope.balance = 0;

    $scope.$on("$ionicView.beforeEnter", function () {
        $scope.balance = 0;
    });

    $scope.numbers = 0;

    $scope.getAmount = function () {
        return ($scope.numbers / 100).toFixed(2);
    }

    pay = function () {
        //TODO: invoke method to send payment information

        //TODO: if no error go back home
        $state.go('app.home');

        //TODO: else, show error message as popover
    }

    $scope.keyboardSettings = {
        roundButtons: true,

        action: function (number) {
            var n = $scope.numbers;
            if (n > 9999999) {
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

    //TODO: have a scope variable storing store info
});