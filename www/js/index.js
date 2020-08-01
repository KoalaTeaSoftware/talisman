// https://github.com/j3k0/cordova-plugin-purchase/blob/master/doc/api.md#product

const sentinelsProductID = "com.earthoracles.celtmistic.premium_sentinels";
// const talismansProductID = "com.earthoracles.celtmistic.premium_talismans";

const freeSentinelList = [
    "lightning",
    "financial-loss",
    "danger",
    "anger-of-others",
    "forgetfulness",
    "jealousy",
    "losing-a-lover",
    "evil-eye",
    "haunting",
    "mental-tasks",
    "physical-tasks"]

const premiumSentinelList = [
    "envy",
    "grief",
    "worry",
    "unwanted-presence",
    "revenge",
    "age",
    "being-undesirable"
];

// we know that the user will have the free ones. slice give a shallow copy of the values
let ownedSentinelList = freeSentinelList.slice();


/**
 * @param p - store.Product object https://github.com/j3k0/cordova-plugin-purchase/blob/master/doc/api.md#product
 *          - this will be sent in by the store
 */
function updateSentinelList(p) {
    console.log("updating the sentinel list")
    if (typeof p === 'undefined') {
        console.log("Product is undefined - not on a Device? - going to pretend that the purchase has been completed")
        ownedSentinelList = ownedSentinelList.concat(premiumSentinelList);
    } else if (p.owned) {
        ownedSentinelList = ownedSentinelList.concat(premiumSentinelList);
    }
}

function initiatePurchaseOfSentinels() {
    if (typeof store === 'undefined') {
        console.log("Unable to initiate proper purchase - Store is undefined - not on a Device?")
        updateSentinelList();
        refreshUI()
    } else {
        store.order(sentinelsProductID)
            .then(console.log("Purchasing Sentinels"))
            .error((error) => {
                console.log('store_error', {});
                alert('An Error Occurred' + JSON.stringify(error));
            })
    }

}

function onDeviceReady() {
    if (typeof store === 'undefined') {
        console.log("Store is undefined - not on a Device?")
        refreshUI();
    } else {
        // set store up to change things when various actions occur
        store.verbosity = store.DEBUG;

        // ToDo: receipt validation https://billing-dashboard.fovea.cc/setup/cordova/

        // noinspection SpellCheckingInspection
        store.when(sentinelsProductID)

            // "Called when an order failed."
            .error((error) => {
                console.log('store_error', {});
                alert('An Error Occurred' + JSON.stringify(error));
            })

            // "Called when product data is loaded from the store."
            .loaded(updateSentinelList)

            // "Called when a non-consumable product or subscription is owned.",
            // .owned() - later will have consumable products, so don't use this action

            // "Called when any change occured to a product."
            // hope that the owned is triggered before the update
            .updated(refreshUI)

            //"Called when a product order is approved."
            .approved(function (product) {
                console.log("Order for product " + product.id + " has been approved")
                updateSentinelList(product);
                /*
                "Call product.finish() to confirm to the store that an approved order has been delivered."
                This will change the product state from APPROVED to FINISHED
                 */
                product.finish();
                refreshUI();
            })

        // The store needs to know the type and identifiers of your products before you can use them in your code
        store.register({
            type: store.NON_CONSUMABLE,
            alias: '',
            id: sentinelsProductID
        });

        // Here, the store's server will be contacted to load human readable title and description, price, etc
        store.refresh();

        // gather some debugging information
        let premiumSentinelsProduct = store.get(sentinelsProductID);

        if (!premiumSentinelsProduct) {
            console.log("Store yielded nothing in response to the get for " + sentinelsProductID);
        } else if (premiumSentinelsProduct.state === store.REGISTERED) {
            console.log("The product is registered")
        }
        // store.when('cc.fovea.purchase.consumable1')
        //     .updated(refreshUI)
        //     .approved(finishPurchase);
        // store.register({type: store.CONSUMABLE, id: 'cc.fovea.purchase.consumable1'});
        // store.refresh();

        refreshUI();
    }
}

/**
 * Show a particular index stone / the type-index
 * @param place - the ID of the HTML element that needs to me made visible
 */
function showIndex(place) {
    // ToDo: either automatically hide all the indexes, or have a specific hider
    document.getElementById(place).style.display = 'block';
    document.getElementById("talismanHolder").innerHTML = ""; // whatever the index being shown the holder must be MT
}

/**
 * Make sure that all of buttons on all of the index are give the correct result (and look right)
 */
function refreshUI() {
    // go through all of the listed index stones
    const listOfIndexStones = document.getElementsByClassName("indexStone");
    const numIndexStones = listOfIndexStones.length;

    for (let stoneIndex = 0; stoneIndex < numIndexStones; stoneIndex++) {
        // within each of these index stones, go through the list of rectangles
        const parentElement = listOfIndexStones[stoneIndex];
        const pathPart = parentElement.getAttribute("id");

        const theListOfButtons = parentElement.getElementsByTagName("rect");
        const listLen = theListOfButtons.length;

        for (let buttonIndex = 0; buttonIndex < listLen; buttonIndex++) {
            const buttonElement = theListOfButtons[buttonIndex];
            buttonElement.setAttribute("fill", "transparent");
            const buttonIDString = buttonElement.getAttribute('id');

            if (ownedSentinelList.indexOf(buttonIDString) < 0) {
                buttonElement.setAttribute("stroke", "grey");
                buttonElement.onclick = function (e) {
                    alert("Invoke the purchase process for " + e.currentTarget.id);
                    initiatePurchaseOfSentinels();
                    refreshUI();
                }
            } else {
                buttonElement.setAttribute("stroke", "transparent");
                buttonElement.onclick = function (e) {
                    document.getElementById(pathPart).style.display = "none";
                    document.getElementById("talismanHolder").innerHTML =
                        '<img src="img/' + pathPart + '/' + e.currentTarget.id + '.jpg" alt="The Stone">';
                }
            }
        }
    }


    // ToDo: handle more than one indexStone, and handle the index of stone types - maybe using local storage?
    const defaultIndexID = "sentinel";
    showIndex(defaultIndexID);
    document.getElementById("logo").addEventListener(
        "click", function () {
            showIndex(defaultIndexID)
        });

    /* this is the code that came with the sample. It is more likely that this functionality will be moved into the complete purchase */
    //   const product = store.get('cc.fovea.purchase.consumable1');
    //   const button = `<button onclick="store.order('cc.fovea.purchase.consumable1')">Purchase</button>`;
    //
    //   document.getElementsByTagName('body')[0].innerHTML = `
    // <div>
    // <pre>
    // Gold: ${localStorage.goldCoins | 0}
    //
    // Product.state: ${product.state}
    // .title: ${product.title}
    // .descr: ${product.description}
    // .price: ${product.price}
    //
    // </pre>
    // ${product.canPurchase ? button : ''}
    // </div>`;
}

/*
 * Actions to invoke directly once all the above has been defined
 */
if (/Mobi|Android/i.test(navigator.userAgent)) {
    // on a mobile we wait until 'Cordova's device APIs have loaded and are ready to access'
    document.addEventListener('deviceready', onDeviceReady, false);
} else {
    // if debugging on a PC browser, then we'll never get deviceready, but we can see if stuff has been loaded
    // note that this is a 'window' event
    window.addEventListener('load', onDeviceReady, false);
}
