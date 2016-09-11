app.controller('DashboardCtrl', function ($scope, $firebaseApp, $document, $ionicPopup, $timeout, $state, $user, $merchants) {
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
    $scope.hasSeen = [];

    $merchants.getTransactionsForMerchantId($user.merchant_id, function (transactions) {
       
        if (firstTime) {
            for (var i = 0; i < transactions.length; i++) {
                $scope.hasSeen[transactions[i].id] = true;
            }
            firstTime = false;
        }
        

        $scope.balance = 0;

        shownTransactions.splice(0, shownTransactions.length);

        for (var i = 0; i < transactions.length; i++) {
            var transaction = transactions[i];
            shownTransactions.push(transaction);

            if (!transaction.refunded) {
                $scope.balance += transaction.amount;
                if (!$scope.hasSeen[transaction.id]) {
                    $document.getElementById("transaction" + transaction.id).classList.add("new");
                    $timeout(function () {
                        $document.getElementById("transaction" + transaction.id).classList.remove("new");
                    }, 10);
                }
            }
        }

        $scope.$digest();
    });

    $scope.getId = function(id) {
        return 'transaction' + id;
    };

    $scope.getDateTime = function (timestamp) {
        return new Date(timestamp);
    };
});