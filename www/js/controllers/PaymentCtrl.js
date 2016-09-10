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

    $scope.amount = 0; // amount to send

    $scope.pay = function () {
        $user.createTransaction(merchant.id, $scope.amount)
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
});