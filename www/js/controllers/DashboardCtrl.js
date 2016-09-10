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

    var shownTransactions = [];
    $scope.transactions = shownTransactions;
    var firstTime = true;

    $merchants.getTransactionsForMerchantId($user.merchant_id, function (transactions) {

        // Find new transactions
        var lastSeconds = shownTransactions.length > 0 ? shownTransactions[0].timestamp : 0;

        var i = 0;
        var newTransactions = [];
        while (transactions.length > i && transactions[i].timestamp > lastSeconds) {
            newTransactions.push(transactions[i]);
            i++;
        }

        for (var i = newTransactions.length - 1; i >= 0; i--) {
            var transaction = newTransactions[i];
            transaction.new = true;

            shownTransactions.unshift(newTransactions[i]);
        }

        for (var i = 0; i < shownTransactions.length; i++) {
            if (i == 0 && !firstTime) {
                shownTransaction[i].new = true;
            } else {
                shownTransactions[i].new = false;
            }
        }

        firstTime = false;

        $scope.$apply(function () {
            $scope.transactions = shownTransactions;
        });
    });

    $scope.getDateTime = function (timestamp) {
        return new Date(timestamp);
    };
});