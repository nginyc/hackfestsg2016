
app.controller('HomeCtrl', function ($scope, $firebaseApp, $state, $user, $ionicModal, $ionicPopover, $location, $merchants, $QRScanner) {

    if (!$user.isLoggedIn()) {
        $state.go('signin');
    }

    $scope.user = $user;

    $scope.numbers;

    $ionicModal.fromTemplateUrl('templates/receipt.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.receipt = modal;
    });
    $scope.openReceipt = function () {
        $scope.receipt.show();
    };
    $scope.closeReceipt = function () {
        $scope.receipt.hide();
    };

    // Cleanup the modal when we're done with it
    $scope.$on('$destroy', function () {
        $scope.receipt.remove();
    });


    $scope.keyboardSettings = {
        roundButtons: true,

        action: function (number) {
            var n = $scope.numbers;
            if (n > 9999) {
                return;
            } else {
                $scope.numbers = n * 10 + number;
            }
        },

        leftButton: {
            html: '<i class="icon ion-backspace"></i>',
            action: function () {
                console.log('back button pressed');
                console.log($scope.numbers);
                var n = $scope.numbers;
                $scope.numbers = (n - n % 10) / 10;
                console.log($scope.numbers);
            }
        },

        rightButton: {
            html: '<i class="icon ion-checkmark-circled"></i>',
            action: function () {
                pay();
            }
        }
    }

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
        $scope.showKeypad();
    };

    $scope.hideKeypad = function () {
        $scope.keypadVisible = false;
    };

    $scope.showKeypad = function () {
        $scope.keypadVisible = true;
    };

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
        $QRScanner.makeQRCode("1234567", "testing123", 200);
    };
});