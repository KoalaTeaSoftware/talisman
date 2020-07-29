let boughtList = [
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
    "physical-tasks"
];

const purchasable = [
    "envy",
    "grief",
    "worry",
    "unwanted-presence",
    "revenge",
    "age",
    "being-undesirable"
];

/**
 * Talk to the store, or, if the store is offline, use some sort of local information to decide if the
 * user owns the purchasable items
 * Then draw the UI
 */
function onDeviceReady() {
    const consumableList = []
    // ToDo: get info from the store about what is and what is not owned by the current device owner, handle case when store is offline
    // store.when('cc.fovea.purchase.consumable1')
    //     .updated(refreshUI)
    //     .approved(finishPurchase);
    // store.register({type: store.CONSUMABLE, id: 'cc.fovea.purchase.consumable1'});
    // store.refresh();

    refreshUI();
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
        console.log("Working on index stone " + pathPart);

        const theListOfButtons = parentElement.getElementsByTagName("rect");
        const listLen = theListOfButtons.length;

        for (let buttonIndex = 0; buttonIndex < listLen; buttonIndex++) {
            const buttonElement = theListOfButtons[buttonIndex];
            buttonElement.setAttribute("fill", "transparent");
            const buttonIDString = buttonElement.getAttribute('id');
            console.log("Working on button " + buttonIDString);

            if (boughtList.indexOf(buttonIDString) < 0) {
                buttonElement.setAttribute("stroke", "grey");
                buttonElement.onclick = function (e) {
                    alert("Invoke the purchase process for " + e.currentTarget.id);
                    finishPurchase();
                    refreshUI();
                }
            } else {
                buttonElement.setAttribute("stroke", "transparent");
                buttonElement.onclick = function (e) {
                    document.getElementById(pathPart).style.display = "none";
                    const frag = '<img src="img/' + pathPart + '/' + e.currentTarget.id + '.jpg">';
                    document.getElementById("talismanHolder").innerHTML = frag;
                }
            }
        }
    }

    /**
     * Called by the shops
     * @param p - ToDo: understand this
     */
    function finishPurchase(p) {
        // these are the things to do with the IAP
        // localStorage.goldCoins = (localStorage.goldCoins | 0) + 10;
        boughtList = boughtList.concat(purchasable);
        // p.finish();
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
