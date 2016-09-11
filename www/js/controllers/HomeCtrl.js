app.controller('HomeCtrl', function ($scope, $firebaseApp, $state, $user, $localStorage, $ionicPopup, $location, $merchants, $QRScanner, $ionicHistory) {

   

    if (!$user.isLoggedIn()) {
        $state.go('signin');
    }

    $scope.$on("$ionicView.afterEnter", function () {
        //$ionicHistory.cl\earHistory();
    });

    $scope.user = $user;

    $scope.data = $localStorage.get('receipt');

    
    $scope.openReceipt = function () {
        if ($localStorage.get('merchant_name') != null) {
            $ionicPopup.show({
                title: $localStorage.get('merchant_name'),
                cssClass: "paymentPopup",
                template: "<div class='text'>You have sent:</div><div class='price'>$" + parseFloat($localStorage.get('amount')).toFixed(2) + "</div>",
                buttons: [
                  { text: 'Ok' }
                ]
            });
        }
    };

    $scope.getIdByQr = function () {
        $merchants.latestMerchant = null;

        $QRScanner.scanBarcode()
         .then(function (barcodeData) {
             $scope.verifyCode(barcodeData.text);
         }).catch(function (error) {
             $ionicPopup.alert({
                 title: "Scanning failed",
                 subTitle: error
             });
         });
    };

    $scope.getIdByText = function () {
        $state.go('input');
    }

    $scope.scan = function () {
        $QRScanner.scanBarcode();
        $merchants.latestMerchant = null;
        $scope.verifyCode(1);
        $scope.openKeypad();
    };

    $scope.verifyCode = function (code) {
        $merchants.searchWithCode(code)
        .then(function (merchant) {
            $state.go('payment');
        }).catch(function (error) {
            $ionicPopup.alert({
                title: "Merchant search failed",
                subTitle: error
            });
        });
    };

    $scope.makeQR = function () {
        // Code, container, size
        $QRScanner.makeQRCode("123456", "testing123", 200);
    };
});