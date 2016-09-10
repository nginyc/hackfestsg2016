angular.module('starter.services', ['ngCordova'])

.factory('$firebaseApp', function () {

    var config = {
        apiKey: "AIzaSyCb_5n7K-f1eq_Q5vJYfNJpxjlnJyJIlzs",
        authDomain: "hackfestsg.firebaseapp.com",
        databaseURL: "https://hackfestsg.firebaseio.com",
        storageBucket: "hackfestsg.appspot.com"
    };

    return firebase.initializeApp(config);
})

.factory('$user', function ($firebaseApp) {

    var data = {};
    var user = {
        uid: 0,
        setType: setType,
        initialize: initialize,
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

    function initialize() {
        refresh();

        return $firebaseApp.database().ref('users/' + user.uid).set({
            id: user.uid,
            name: '',
            balance: 0,
            type: 'user',
            transactions: [],
            loggedInDeviceId: ''
        });
    }

    function refresh() {
        var currentUser = $firebaseApp.auth().currentUser;
        if (currentUser == null) {
            user.uid = 0;
        } else {
            user.uid = currentUser.uid;
            Object.assign(user, currentUser);

            $firebaseApp.database().ref('users/' + user.uid).on('value', function (data) {
                Object.assign(user, data.val());
            });
        }
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
            return $window.localStorage[key] === null ?
              null : JSON.parse($window.localStorage[key]);
        },

        has: function (key) {
            return $window.localStorage[key] != null;
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
                        alert("We got a barcode\n" +
                            "Result: " + barcodeData.text + "\n" +
                            "Format: " + barcodeData.format + "\n" +
                            "Cancelled: " + barcodeData.cancelled
                        );
                    }
                }, function(error) {
                    // An error occurred
                    alert("Scanning failed: " + error);
                });

            }, false);
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

