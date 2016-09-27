app.controller('DashboardCtrl', function ($scope, $ionicBackdrop, $firebaseApp, $ionicPopup, $timeout, $state, $user, $merchants) {
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
        $ionicBackdrop.retain();
        $merchants.refundForTransactionId(transaction_id)
        .then(function () {
            $ionicBackdrop.release();
            $ionicPopup.alert({
                title: "Refund succeeded"
            });
        }).catch(function (error) {
            $ionicBackdrop.release();
            $ionicPopup.alert({
                title: "Refund failed",
                subTitle: error
            });
        });
    }

    var shownTransactions = [];
    $scope.transactions = shownTransactions;
    var firstTime = true;
    var hasSeen = [];

    $scope.hasSeen = function (transaction_id) {
        return hasSeen.indexOf(transaction_id) != -1;
    };

    $merchants.getTransactionsForMerchantId($user.merchant_id, function (transactions) {

        if (firstTime) {
            for (var i = 0; i < transactions.length; i++) {
                hasSeen.push(transactions[i].id);
            }
            firstTime = false;
        }

        $scope.balance = 0;

        shownTransactions.splice(0, shownTransactions.length);

        for (var i = 0; i < transactions.length; i++) {
            shownTransactions.push(transactions[i]);

            if (!transactions[i].refunded) {
                $scope.balance += transactions[i].amount;
            }
        }

        $scope.$digest();
    });

    $scope.getDateTime = function (timestamp) {
        return new Date(timestamp);
    };
});
