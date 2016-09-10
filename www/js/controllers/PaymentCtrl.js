app.controller('PaymentCtrl', function ($scope, $firebaseApp, $ionicPopup, $state, $user, $merchants) {
    if (!$user.isLoggedIn()) {
        $state.go('login');
    }

    var merchant = $merchants.latestMerchant;

    if (merchant == null) {
        $state.go('app.home')
    }

    $scope.merchant = merchant;

    $scope.pay = function (amount) {
        $user.createTransaction(merchant.id, amount)
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