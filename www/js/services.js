angular.module('starter.services', ['ngCordova'])

.factory('$firebaseApp', function () {

    var config = {
        apiKey: "AIzaSyAUu0Vvjewlt7oROK1kFg-3n8kXnD4l4Zc",
        authDomain: "hackfestsg2016.firebaseapp.com",
        databaseURL: "https://hackfestsg2016.firebaseio.com",
        storageBucket: ""
    };

    return firebase.initializeApp(config);
})

.factory('$merchants', function ($firebaseApp) {

    var merchants = {
        searchWithCode: searchWithCode,
        getTransactionsForMerchantId: getTransactionsForMerchantId,
        latestMerchant: null
    };

    return merchants;

    function getTransactionsForMerchantId(merchant_id, resolve) {

        $firebaseApp.database().ref('transactions').on('value', function (data) {
            var transactionList = data.val();

            var filtered = {};
            for (var i in transactionList) {
                var transaction = transactionList[i];
                if (transaction.merchant_id == merchant_id) {
                    filtered[i] = transaction;
                }
            }

            resolve(filtered);
        });
    }
    
    function searchWithCode(code) {
        return new Promise(function (resolve, reject) {
            $firebaseApp.database().ref('merchants').once('value')
            .then(function (data) {
                var merchantList = data.val();

                for (var id in merchantList) {
                    var merchant = merchantList[id];
                    if (merchant.code == code) {
                        merchants.latestMerchant = merchant;
                        resolve(merchant);
                        return;
                    }
                }

                reject("No merchant found.");
            }).catch(function (error) {
                reject(error);
            });
        });
    }
})

.factory('$user', function ($firebaseApp, $merchants) {

    var data = {};
    var user = {
        uid: 0,
        setType: setType,
        setMerchantData: setMerchantData,
        initialize: initialize,
        createTransaction: createTransaction,
        refresh: refresh,
        isLoggedIn: function () {
            return this.uid != 0;
        }
    };

    return user;

    function setType(type) {
        var updates = {};
        updates['users/' + user.uid + '/type'] = type;

        return $firebaseApp.database().ref().update(updates);
    }

    function setMerchantData(name, business_no) {
        
        return $firebaseApp.database().ref('merchant_max_code').once('value')
              .then(function (data) {
                  var max_code = data.val();
                  
                  var uid = $firebaseApp.database().ref().child('merchants').push().key;

                  var merchant = {
                      id: uid,
                      name: name,
                      business_no: business_no,
                      code: max_code,
                      balance: 0,
                      device_id: ''
                  };

                  var updates = {};

                  updates['users/' + user.uid + '/merchant_id'] = merchant.id;
                  updates['merchant_max_code'] = max_code + 1;
                  updates['merchants/' + merchant.id] = merchant;

                  return $firebaseApp.database().ref().update(updates);
              });
    }

    function initialize() {
        return refresh()
        .then(function () {
            return $firebaseApp.database().ref('users/' + user.uid).set({
                id: user.uid,
                name: '',
                balance: 0,
                type: 'user'
            });
        });
    }

    function refresh() {
        return new Promise(function(resolve, reject) {
            var currentUser = $firebaseApp.auth().currentUser;
            if (currentUser == null) {
                user.uid = 0;

                resolve(user);

            } else {
                user.uid = currentUser.uid;

                objectAssign(user, currentUser);

                $firebaseApp.database().ref('users/' + user.uid).once('value')
                .then(function (data) {
                    objectAssign(user, data.val());

                    $firebaseApp.database().ref('users/' + user.uid).on('value', function (data) {
                        objectAssign(user, data.val());
                    });

                    resolve(data);
                }).catch(function (error) {
                    reject(error);
                });
            }
        });
    }

    function createTransaction(merchant_id, amount) {
        var uid = $firebaseApp.database().ref().child('transactions').push().key;

        var transaction = {
            id: uid,
            merchant_id: merchant_id,
            user_id: user.uid,
            amount: parseFloat(amount),
            timestamp: new Date().toDateString(),
            user_name: user.name,
            refunded: false
        };
       
        refresh();
        var merchant = {};

        return new Promise(function (resolve, reject) {
            user.balance = parseFloat(user.balance);

            if (user.balance < transaction.amount) {
                reject("User does not have enough balance!");
                return;
            }

            $firebaseApp.database().ref('merchants/' + merchant_id).once('value')
            .then(function (data) {

                objectAssign(merchant, data.val());

                merchant.balance = parseFloat(merchant.balance);

                var updates = {};

                updates['users/' + user.uid + '/transactions/' + transaction.id];
                updates['users/' + user.uid + '/balance'] = user.balance - transaction.amount;
                updates['merchants/' + merchant_id + '/balance'] = merchant.balance + transaction.amount;
                updates['transactions/' + transaction.id] = transaction;

                return $firebaseApp.database().ref().update(updates);
            }).then(function () {
                resolve({
                    transaction: transaction,
                    merchant: merchant
                });
            }).catch(function (error) {
                reject(error);
            });
        });
    }
})

.factory('$localStorage', function ($window) {

    return {
        /**
         * @name set
         * @description
         * Set a key value pair into the local storage for persistence.
         * 
         * @param {string} key - the index at which the value will be set
         * @param {mixed} value - the value to set at the given index
         */
        set: function (key, value) {
            // If we are trying to set an object in here then we need
            //  to make sure it is a string, so we json encode it.
            if (angular.isArray(value) || angular.isObject(value)) {
                value = JSON.stringify(value);
            }

            $window.localStorage[key] = value;
        },

        /**
         * @name get
         * @description
         * Return a value in local storage at a specific key.
         *
         * @param {string} key - the index at which to return the stored value in
         *                       in local storage
         * 
         * @return {mixed} - the value stored at the given key in local storage
         */
        get: function (key) {
            // If we have a null at the index then we want to return
            //  the null value, otherwise we JSON.parse the return value
            //  to handle all other types (strings, numbers, objects, arrays)
            return (!$window.localStorage[key]) ?
              null : JSON.parse($window.localStorage[key]);
        }
    };
})


.factory('$QRScanner', function ($cordovaBarcodeScanner) {
    return {
        /** 
         * @name scanBarcode
         * @description
         * Calls cordova to open camera and scan for QRcode
         */
        scanBarcode: function() {
            return new Promise(function(resolve, reject) {
                document.addEventListener("deviceready", function () {
                    $cordovaBarcodeScanner.scan({
                        "preferFrontCamera" : false, // iOS and Android
                        "showFlipCameraButton" : true, // iOS and Android
                        "prompt" : "Scan for QR code!", // supported on Android only
                        "formats" : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
                        "orientation" : "" // Android only (portrait|landscape), default unset so it rotates with the device
                    })
                        .then(function(barcodeData) {
                            // Success! Barcode data is here
                            if (barcodeData.text != "") {
                                resolve(barcodeData);
                            } else {
                                reject("Scanning failed.")
                            }
                        }, function(error) {
                            reject("Scanning failed: " + error);
                        });

                }, false);
            });
        },

        /**
         * @name makeQRCode
         * @description
         * Creates a QR code
         * @param {string} code - string to be converted into QR code form
         * @param {string} container - tag id of the container to display the generated QR code
         * @param {int} size - height/width of QR code in pixels (Recommended 200)
         */
        makeQRCode: function(code, container, size) {
            var qrcode = new QRCode(container, {
                text: "http://jindo.dev.naver.com/collie",
                width: size,
                height: size,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            });
            qrcode.makeCode(code);
        }
    };
});

function objectAssign(target, source) {
    for (var i in source) {
        target[i] = source[i];
    }

    return target;
}
