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
 * Show a particular index stone / the type-index
 * @param place - the ID of the HTML element that needs to me made visible
 */
function showIndex(place) {
    // ToDo: either automatically hide all the indexes, or have a specific hider
    document.getElementById(place).removeAttribute("display");
    document.getElementById("talismanHolder").innerHTML = ""; // whtever the index being shown the holder must be MT
}

/**
 * Called by the shops
 * @param p - ToDo: understand this
 */
function finishPurchase(p) {
    boughtList = boughtList.concat(purchasable);

    // these are the things to do with the IAP
    // localStorage.goldCoins = (localStorage.goldCoins | 0) + 10;
    // p.finish();
}


function onDeviceReady() {
    connectButtons("sentinelIndex"); // ToDo: make non-specific
    // store.when('cc.fovea.purchase.consumable1')
    //     .updated(refreshUI)
    //     .approved(finishPurchase);
    // store.register({type: store.CONSUMABLE, id: 'cc.fovea.purchase.consumable1'});
    // store.refresh();
}


function refreshUI() {

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

/**
 * Connect the visually available buttons to some sort of action
 * This should work no matter which index-of-stones is the currently displayed set
 * ToDo: remove the visual distinction between bought and unbought items
 */
function connectButtons(parentID) {
    const parent = document.getElementById(parentID);
    const theListOfButtons = parent.getElementsByTagName("rect");
    const listLen = theListOfButtons.length;

    for (let i = 0; i < listLen; i++) {
        const item = theListOfButtons[i];
        item.setAttribute("fill", "transparent");

        if (boughtList.indexOf(item.getAttribute('id')) < 0) {
            item.setAttribute("stroke", "grey");
            item.onclick = function (e) {
                alert("Invoke the purchase process for " + e.currentTarget.id);
                finishPurchase();
                connectButtons(parentID);
            }
        } else {
            item.setAttribute("stroke", "transparent");
            item.onclick = function (e) {
                const frag = '<img src="img/sentinel/' + e.currentTarget.id + '.jpg">';
                document.getElementById("sentinelIndex").setAttribute("display", "none");
                document.getElementById("talismanHolder").innerHTML = frag;
            }
        }
    }
}

/*
 * Actions to invoke directly once all has been defined
 */
// ToDo: currently, these 3 actions give the list of sentinels, this will need to be going, first, to the list of stone-types
showIndex("sentinelIndex");
connectButtons("sentinelIndex");
document.getElementById("logo").addEventListener(
    "click", function () {
        showIndex('sentinelIndex')
    });
// this will become relevant when actually on a device
document.addEventListener('deviceready', onDeviceReady);
