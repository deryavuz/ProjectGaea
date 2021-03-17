
// This is a simple model-view-controller setup to deal with
// the fact that the onPurchaseResponse can get called at any
// time.
//
// The fact that responses can come at any time is important to
// understand when using the API. Your web app could have been
// shut down prior to a receipt being delivered for instance. The
// next time your application runs the receipt will be delivered
// upon initializing the API in this case.

// Model Data
var state = {
    clicksLeft: 10,
    activeButton: "",
    hasRedButton: false,
    hasGreenButton: false,
    hasBlueButton: false,
    lastPurchaseCheckTime: null
}

// Make the view (HTML) look like the model

function refreshPageState() {
    $("#clicksLeft").text(state.clicksLeft);

    var button = $("#theButton");
    var redButton = $("#redButton");
    var greenButton = $("#greenButton");
    var blueButton = $("#blueButton");

    setClass(redButton, "locked", !state.hasRedButton);
    setClass(greenButton, "locked", !state.hasGreenButton);
    setClass(blueButton, "locked", !state.hasBlueButton);

    setClass(redButton, "active", state.activeButton == "red");
    setClass(greenButton, "active", state.activeButton == "green");
    setClass(blueButton, "active", state.activeButton == "blue");

    if (state.activeButton != "") {
        button.css("background-color", state.activeButton);
    } else {
        button.css("background-color", "gray");
    }
    persistPageState();
}

// Saves the state to localStorage so the next time the app
// runs it's the same as it was last run. Most important
// is remembering it IAP status including the lastPurchaseCheckTime
// which is passed to getPurchaseUpdates.
function persistPageState() {
    localStorage.setItem("state", JSON.stringify(state));
}

// Restore the state from localStorage
function loadPageState() {
    if ("state" in localStorage) {
        // If this is the first run then the defaults we
        // set earlier are what we're going to run with.
        state = JSON.parse(localStorage.getItem("state"));
    }
}

function setClass(element, className, condition) {
    if (condition) {
        element.addClass(className);
    } else {
        element.removeClass(className);
    }
}

// Controller

// Excercises consumables
function buttonPressed() {
    if (state.clicksLeft > 0) {
        state.clicksLeft--;
    } else {
        buyClicks();
    }
    refreshPageState();
}

// Excercises entitlements
function redButtonPressed() {
    if (state.hasRedButton) {
        state.activeButton = "red";
    } else {
        buyButton("sample.redbutton");
    }
    refreshPageState();
}

// Excercises entitlements
function greenButtonPressed() {
    if (state.hasGreenButton) {
        state.activeButton = "green";
    } else {
        buyButton("sample.greenbutton");
    }
    refreshPageState();
}

// Excercises subscriptions
function blueButtonPressed() {
    if (state.hasBlueButton) {
        state.activeButton = "blue";
    } else {
        // You need to buy the specific subscription (complete with term)
        buyButton("sample.bluebutton.subscription.1mo");
    }
    refreshPageState();
}

function buyClicks() {
    if (window.AmazonIapV2 == null) {
        alert("You are out of clicks, however Amazon In-App-Purchasing works only with Apps from the Appstore.");
    } else if (confirm("Buy more clicks?")) {
        //window.AmazonIapV2.purchase('sample.clicks');
        var requestOptions = {
            sku: 'sample.clicks'
        };
        window.AmazonIapV2.purchase(
            function(operationResponse) {
                console.debug(operationResponse.requestId);
            },
            function(errorResponse) {
                console.debug(errorResponse);
            },
            [requestOptions]
        );
    }
}

function buyButton(buttonName) {
    if (window.AmazonIapV2 == null) {
        alert("You cannot buy this button, Amazon In-App-Purchasing works only with Apps from the Appstore.");
    } else {
        //window.AmazonIapV2.purchase(buttonName);
        var requestOptions = {
            sku: buttonName
        };
        window.AmazonIapV2.purchase(
            function(operationResponse) {
                console.debug(operationResponse.requestId);
            },
            function(errorResponse) {
                console.debug(errorResponse);
            },
            [requestOptions]
        );
    }
}

// Handler functions that are called from the callbacks

// purchaseItem will cause a purchase response with one receipt
function onPurchaseResponse(e) {
    var response = e.response;
    if (response.status === 'SUCCESSFUL') {
        handleReceipt(response.purchaseReceipt);
    } else if (response.status === 'ALREADY_PURCHASED') {
        // Somehow we are out of sync with the server, let's refresh from the
        // beginning of time.
        var requestOptions = {
            reset: true
        };
        window.AmazonIapV2.getPurchaseUpdates(
            function(operationResponse) {
                // Handle operation response
                var requestId = operationResponse.requestId;
                console.debug(requestId);
            },
            function(errorResponse) {
                // Handle error response
                console.debug(errorResponse);
            },
            [requestOptions]
        );
    } else if (response.status === 'FAILED') {
        alert('Purchase request is interrupted. Please try again later');
    } else if (response.status === 'INVALID_SKU') {
        alert('Invalid SKU. Please make sure of SKUS configuration.');
    }

    refreshPageState();
}

// getPurchaseUpdates will return an array of receipts
function onPurchaseUpdatesResponse(e) {
    var response = e.response;
    for (var i = 0; i < response.receipts.length; i++) {
        handleReceipt(response.receipts[i]);
    }
    state.lastPurchaseCheckTime = response.offset;
    refreshPageState();
    if (response.hasMore) {
        // In case there is more updates that did not
        // get sent with this response, make sure that
        // we get the rest of them.
        var requestOptions = {
            reset: false
        };
        window.AmazonIapV2.getPurchaseUpdates(
            function(operationResponse) {
                // Handle operation response
                var requestId = operationResponse.requestId;
                console.debug(requestId);
            },
            function(errorResponse) {
                // Handle error response
                console.debug(errorResponse);
            },
            [requestOptions]
        );
    }
}

// In either case, the contents of the receipt are handled in the same way
function handleReceipt(receipt) {
    if (receipt.sku == "sample.redbutton") {
        // Entitlement
        state.hasRedButton = true;
    } else if (receipt.sku == "sample.greenbutton") {
        // Entitlement
        state.hasGreenButton = true;
    } else if (receipt.sku.substring(0, 30) == "sample.bluebutton.subscription") {
        // Subscriptions sometimes return the parent's ID so we compare to the
        // parent's ID
        if (receipt.cancelDate == null) {
            // cancelDate is null if we are in the current period
            state.hasBlueButton = true;
        }

    } else if (receipt.sku == "sample.clicks") {
        // Consumable
        state.clicksLeft += 10;
    }
    //If the fulfillment has yet to occur, then fulfill the receipt.
    //Store the receiptId to keep track of the already fulfilled items,
    //then call notifyFulfillment() for the receiptId with the FULFILLED status.
    //If the fulfillment can not occur because the item was for a previous
    //game state or the game does not support that item, then
    //
    notifyFulfillment(receipt.receiptId);
}

/**
* @function notifyFulfillment
* @description NotifyFulfillment notifies Amazon about the purchase fulfillment.
* @param {String} receiptId receipt id
*/
function notifyFulfillment(receiptId) {
    //fulfillmentResult can be FULFILLED or UNAVAILABLE
    var requestOptions = {
        'receiptId': receiptId,
        'fulfillmentResult': 'FULFILLED'
    };
    window.AmazonIapV2.notifyFulfillment(
        function(operationResponse) {
            // Handle operation response
            console.debug(operationResponse);
        },
        function(errorResponse) {
            // Handle error response
            console.debug(errorResponse);
        },
        [requestOptions]
    );

}

// Setup

function initialize() {
    loadPageState();
    amzn_wa.enableApiTester(amzn_wa_tester);
    refreshPageState();

    // Setup button press handlers
    $("#theButton").click(function() { buttonPressed(); });
    $("#redButton").click(function() { redButtonPressed(); });
    $("#greenButton").click(function() { greenButtonPressed(); });
    $("#blueButton").click(function() { blueButtonPressed(); });

    document.addEventListener('amazonPlatformReady', function() {
        // Ensure we can call the IAP API
        if (window.AmazonIapV2 === null) {
            console.debug('Amazon In-App-Purchasing only works with Apps from the Appstore');
        } else {
            window.AmazonIapV2.addListener('getUserDataResponse', function(resp) {});
            window.AmazonIapV2.addListener('getProductDataResponse', function(data) {});
            window.AmazonIapV2.addListener('purchaseResponse', this.onPurchaseResponse);
            window.AmazonIapV2.addListener('getPurchaseUpdatesResponse', this.onPurchaseUpdatesResponse);
        }
    }.bind(this));
}

$(function() {
    initialize();
});
