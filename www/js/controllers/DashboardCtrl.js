app.controller('DashboardCtrl', function ($scope, $firebaseApp, $ionicPopup, $timeout, $state, $user, $merchants) {
    if (!$user.isLoggedIn()) {
        $state.go('signin');
    }

    if ($user && $user.type != 'merchant') {
        $state.go('app.home');
    }

    $scope.date = new Date();

    $scope.balance = 0;

    $scope.getAmount = function (amount) {
        return parseFloat(amount).toFixed(2);
    };

    $scope.refund = function (transaction_id) {
        $merchants.refundForTransactionId(transaction_id)
        .then(function () {
            $ionicPopup.alert({
                title: "Refund succeeded"
            });
        }).catch(function (error) {
            $ionicPopup.alert({
                title: "Refund failed",
                subTitle: error
            });
        });
    }

    var shownTransactions = [];
    $scope.transactions = shownTransactions;
    var firstTime = true;

    $merchants.getTransactionsForMerchantId($user.merchant_id, function (transactions) {

        for (var i = 0; i < transactions.length; i++) {
            if (i == 0 && !firstTime) {
                transactions[i].new = true;
            } else {
                transactions[i].new = false;
            }

            if (!transactions[i].refund)
        }

        firstTime = false;

        shownTransactions.splice(0, shownTransactions.length);

        for (var i = 0; i < transactions.length; i++) {
            shownTransactions.push(transactions[i]);
        }
    });

    $scope.getDateTime = function (timestamp) {
        return new Date(timestamp);
    };
});