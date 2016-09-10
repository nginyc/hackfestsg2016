app.controller('PaymentCtrl', function ($scope, $firebaseApp, $ionicPopup, $state, $user, $merchants) {

    if (!$user.isLoggedIn()) {
        $state.go('signin');
    }

    var merchant = $merchants.latestMerchant;

    if (merchant == null) {
        $state.go('app.home');
    }

    $scope.balance = 0;
    $scope.merchant = merchant;

    $scope.$on("$ionicView.beforeEnter", function () {
        $scope.balance = 0;
    });

    $scope.numbers = 0;

    $scope.getAmount = function () {
        return ($scope.numbers / 100).toFixed(2);
    }

    $scope.pay = function () {
        $user.createTransaction(merchant.id, $scope.numbers / 100)
        .then(function (data) {
            $ionicPopup.alert({
                title: "Transaction successful",
                subTitle: "Sent $" + data.transaction.amount + " to " + data.merchant.name
            }).then(function () {
                $state.go('app.home');
            });
        }).catch(function (error) {
            $ionicPopup.alert({
                title: "Transaction failed",
                subTitle: error
            });
        });
    }

    $scope.keyboardSettings = {
        theme: 'light',

        action: function (number) {
            var n = $scope.numbers;
            if (n > 999999) {
                return;
            } else {
                $scope.numbers = n * 10 + number;
            }
        },

        leftButton: {
            html: '<i class="icon ion-backspace-outline"></i>',
            action: function () {
                var n = $scope.numbers;
                $scope.numbers = (n - n % 10) / 10;
            }
        },

        rightButton: {
            html: '<img src=\'img/go.png\'>',
            action: function () {
                $scope.pay();
            }
        }
    }
});