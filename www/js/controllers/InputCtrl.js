app.controller('InputCtrl', function ($scope, $firebaseApp, $ionicPopup, $state, $user, $merchants) {

    if (!$user.isLoggedIn()) {
        $state.go('signin');
    }

    $scope.user = $user;

    $scope.numbers = 0;

    $scope.verifyCode = function (code) {
        console.log('entered here');
        console.log(code);
        $merchants.searchWithCode(code)
        .then(function (merchant) {
            $state.go('payment');
        }).catch(function (error) {
            $ionicPopup.alert({
                title: "Merchant search failed",
                subTitle: error
            });
        });
    };

    $scope.keyboardSettings = {
        roundButtons: true,

        action: function (number) {
            var n = $scope.numbers;
            if (n > 99999) {
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
                if ($scope.numbers > 99999) {
                    $scope.verifyCode($scope.numbers);
                } else {
                    $ionicPopup.alert({
                        title: "",
                        subTitle: "Code must be 6 digits"
                    });
                }
            }
        }
    }
});