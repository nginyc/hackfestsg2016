app.controller('DashboardCtrl', function ($scope, $firebaseApp, $ionicPopup, $state, $user, $merchants) {

    if (!$user.isLoggedIn() || $user.type != 'merchant') {
        $state.go('app.home');
    }

    $scope.date = new Date();

    $scope.balance = 0;

    $scope.getAmount = function (amount) {
        return parseFloat(amount).toFixed(2);
    };

    $scope.transactions = {};
    console.log($user.merchant_id);
    $merchants.getTransactionsForMerchantId($user.merchant_id, function (transactions) {
        $scope.transactions = transactions;
    });
});