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

function finishPurchase(p) {
    boughtList = boughtList.concat(purchasable);

    // these are the things to do with the IAP
    // localStorage.goldCoins = (localStorage.goldCoins | 0) + 10;
    // p.finish();
}


function onDeviceReady() {
    connectButtons();
    store.when('cc.fovea.purchase.consumable1')
        .updated(refreshUI)
        .approved(finishPurchase);
    store.register({type: store.CONSUMABLE, id: 'cc.fovea.purchase.consumable1'});
    store.refresh();
}


function refreshUI() {

    const product = store.get('cc.fovea.purchase.consumable1');
    const button = `<button onclick="store.order('cc.fovea.purchase.consumable1')">Purchase</button>`;

    document.getElementsByTagName('body')[0].innerHTML = `
  <div>
  <pre>
  Gold: ${localStorage.goldCoins | 0}

  Product.state: ${product.state}
  .title: ${product.title}
  .descr: ${product.description}
  .price: ${product.price}

  </pre>
  ${product.canPurchase ? button : ''}
  </div>`;
}

/**
 * Connect the visually available buttons to some sort of action
 * ToDo: remove the visual distinction between bought and unbought items
 */
function connectButtons() {
    const theListOfButtons = document.getElementsByTagName("rect");
    const listLen = theListOfButtons.length;

    for (let i = 0; i < listLen; i++) {
        const item = theListOfButtons[i];
        item.setAttribute("fill", "transparent");

        if (boughtList.indexOf(item.getAttribute('id')) < 0) {
            item.setAttribute("stroke", "grey");
            item.onclick = function (e) {
                alert("Invoke the purchase process for " + e.currentTarget.id);
                finishPurchase();
                connectButtons();
            }
        } else {
            item.setAttribute("stroke", "transparent");
            item.onclick = function (e) {
                const frag = '<img src="img/sentinel/' + e.currentTarget.id + '.jpg">';
                document.getElementById("talismanHolder").innerHTML = frag;
            }
        }
    }
}

/**
 * Actions to invoke directly once all has been defined
 */
connectButtons();
document.addEventListener('deviceready', onDeviceReady);
