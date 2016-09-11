app.controller('PaymentCtrl', function ($scope, $firebaseApp, $ionicPopup, $state, $user, $merchants, $localStorage) {

    if (!$user.isLoggedIn()) {
        $state.go('signin');
    }

    var merchant = $merchants.latestMerchant;

    if (merchant == null) {
        $state.go('app.home');
    }

    $scope.balance = 0;
    $scope.merchant = merchant;
    $scope.user = $user;

    $scope.$on("$ionicView.beforeEnter", function () {
        $scope.numbers = 0;
    });

    $scope.numbers = 0;

    $scope.getAmount = function (amount) {
        return parseFloat(amount).toFixed(2);
    }

    $scope.pay = function () {
        $user.createTransaction(merchant.id, $scope.numbers / 100)
        .then(function (data) {
            $localStorage.set('receipt', data);
            $scope.data = data;
            $state.go('app.home');


            $localStorage.set('merchant_name', data.merchant.name);
            $localStorage.set('amount', data.transaction.amount);
            $ionicPopup.show({
                title: data.merchant.name,
                cssClass: "paymentPopup",
                template: "<div class='text'>You have sent:</div><div class='price'>$" + parseFloat(data.transaction.amount).toFixed(2)  + "</div>",
                buttons: [
                  { text: 'Ok' }
                ]
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
            html: 'Pay',
            action: function () {
               if ($scope.numbers > 0) {
                    $scope.pay();
               }
            }
        }
    }
});