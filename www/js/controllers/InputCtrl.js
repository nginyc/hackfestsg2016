﻿app.controller('InputCtrl', function ($scope, $firebaseApp, $ionicPopup, $state, $user, $merchants) {

    if (!$user.isLoggedIn()) {
        $state.go('signin');
    }

    $scope.user = $user;

    $scope.numbers = 0;

    $scope.$on("$ionicView.beforeEnter", function () {
        $scope.numbers = 0;
    });

    $scope.verifyCode = function (code) {
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
        theme: 'light',
       
        action: function (number) {
            var n = $scope.numbers;
            if (n > 99999) {
                return;
            } else {
                $scope.numbers = n * 10 + number;
            }
        },

        leftButton: {
            html: '<i class="icon ion-backspace-outline"></i>',
            action: function () {
                console.log('back button pressed');
                console.log($scope.numbers);
                var n = $scope.numbers;
                $scope.numbers = (n - n % 10) / 10;
                console.log($scope.numbers);
            }
        },

        rightButton: {
            html: 'Go',
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