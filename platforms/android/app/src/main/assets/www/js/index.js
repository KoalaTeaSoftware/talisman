const sentinelsProductID = "com.earthoracles.celtmistic.premium_sentinels";

let app = {
    initialize: function () {
        this.showDebugMsg("Initializing");

        window.addEventListener('load', this.loadDeviceReady, false); // for debugging in browser
        document.addEventListener('deviceready', this.actualDeviceReady, false); // for when on a phone
    },
    loadDeviceReady: function () {
        app.showDebugMsg("Load-triggered");
        app.deviceReadyAction();
    },
    actualDeviceReady: function () {
        app.showDebugMsg("deviceReady-triggered");
        app.deviceReadyAction();
    },
    deviceReadyAction: function () {
        app.showDebugMsg("Received the device ready event");

        if (typeof store === 'undefined') {
            app.showDebugMsg("Store is undefined")
        } else {
            // ToDo: receipt validation https://billing-dashboard.fovea.cc/setup/cordova/
            app.showDebugMsg("Store is defined")

            // set store up to change things when various actions occur
            store.verbosity = store.DEBUG;

            // noinspection SpellCheckingInspection
            store.when(sentinelsProductID)
                // "Called when an order failed."
                .error((error) => {
                    app.showDebugMsg('store_error', {});
                    alert('Store Complained:' + JSON.stringify(error));
                })
                // .loaded(updateSentinelList) // "Called when product data is loaded from the store."
                .owned( // "Called when a non-consumable product or subscription is owned." - so not expected to act for Talismans
                    function (product) {
                        app.showDebugMsg("Product " + product.id + " is owned already");
                        StoneSetClass.completePurchase(product.id);
                    })
                // .updated(refreshUI)        // "Called when any change occured to a product." - hope that the owned is triggered before the update
                .approved(function (product) { //"Called when a product order is approved."
                    // product ID eg: "com.earthoracles.celtmistic.premium_sentinels"
                    app.showDebugMsg("Order for product " + product.id + " has been approved");
                    StoneSetClass.completePurchase(product.id);
                    app.refreshUI();
                    /*
                    "Call product.finish() to confirm to the store that an approved order has been delivered."
                    This will change the product state from APPROVED to FINISHED
                     */
                    product.finish();
                });

            // The store needs to know the type and identifiers of your products before you can use them in your code
            store.register({
                type: store.NON_CONSUMABLE,
                alias: '',
                id: sentinelsProductID
            });

            // Here, the store's server will be contacted to load human readable title and description, price, etc
            // when it responds the relevant handler will be triggered
            store.refresh();

            // gather some debugging information
            let premiumSentinelsProduct = store.get(sentinelsProductID);

            if (!premiumSentinelsProduct) {
                app.showDebugMsg("Store yielded nothing in response to the get for " + sentinelsProductID);
            } else if (premiumSentinelsProduct.state === store.REGISTERED) {
                app.showDebugMsg("The product is registered")
            }
            // store.when('cc.fovea.purchase.consumable1')
            //     .updated(refreshUI)
            //     .approved(finishPurchase);
            // store.register({type: store.CONSUMABLE, id: 'cc.fovea.purchase.consumable1'});
            // store.refresh();
        }
        app.refreshUI();
    },
    refreshUI() {
        specificStoneDisplayHandler.hide();

        // ToDo: this is just to see it getting started
        StoneSetClass.refresh("sentinel");
        StoneSetClass.show("sentinel");
    },
    // initiatePurchaseOfSentinels: function () {
    //     if (typeof store === 'undefined') {
    //         app.showDebugMsg("Store is undefined, so pretending purchase is successful");
    //         this.ownedSentinelList = this.ownedSentinelList.concat(this.premiumSentinelList);
    //         this.refreshUI();
    //     } else {
    //         app.showDebugMsg("Asking the store to make the purchase");
    //         store.order(sentinelsProductID)
    //             .then(console.log("Purchasing Sentinels"))
    //             .error((error) => {
    //                 app.showDebugMsg('store_error', {});
    //                 alert('An Error Occurred while ordering' + JSON.stringify(error));
    //             })
    //     }
    // },
    showDebugMsg: function (msg) {
        const noticeBlock = document.getElementById("debugBlock");

        console.log(msg);
        if ((typeof noticeBlock === 'undefined') || (noticeBlock === null)) {
            console.log("The notice block is undefined");
            let c = document.body.innerHTML;
            document.document.body.innerHTML = msg + "<br>" + c;
        } else {
            noticeBlock.innerHTML += "<br>" + msg;
        }
    }
}


