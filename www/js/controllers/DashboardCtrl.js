app.controller('DashboardCtrl', function ($scope, $firebaseApp, $ionicPopup, $state, $user, $merchants) {
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

    $scope.transactions = [];
    $merchants.getTransactionsForMerchantId($user.merchant_id, function (transactions) {
        // Find new transactions
        var lastSeconds = $scope.transactions.length > 0 ? $scope.transactions[0].timestamp : 0;

        var i = 0;
        while (transactions.length > i && transactions[i].timestamp > lastSeconds) {
            $scope.transactions.push(transactions[i]);
            console.log("NEW:  " + transactions[i]);
            i++;
        }
    });

    $scope.getDateTime = function (timestamp) {
        return new Date(timestamp);
    };
});