/**
 * This relies on the html having elements that have IDs that correspond to the items in the lists used to create the instance
 */
class StoneSetClass {
    /**
     * @param domElementId - ID attribute of the enclosing parent HTML element
     * @param freeList
     * @param premiumList
     */
    constructor(domElementId, freeList, premiumList) {
        // this.elementId = domElementId
        this.freeItemList = freeList.slice();
        this.premiumItemList = premiumList.slice();
        this.availableItemList = freeList.slice();
    }

    static show(targetId) {
        document.getElementById(targetId).style.display = 'block';
    }

    static hide(targetId) {
        document.getElementById(targetId).style.display = 'none';
    }

    static initiatePurchase(triggeringEvent) {
        // this will actually try to talk to the shop
        const wrapperId = triggeringEvent.currentTarget.parentElement.parentElement.id;

        if (typeof store === 'undefined') {
            app.showDebugMsg("Store is undefined, so pretending that the purchase is successful");
            StoneSetClass.completePurchase(wrapperId);
            StoneSetClass.refresh(wrapperId);
            StoneSetClass.hide(wrapperId);
            specificStoneDisplayHandler.show(wrapperId, triggeringEvent.currentTarget.id);
        } else {
            app.showDebugMsg("Asking the store to make the purchase");
            // when the store decides that there is something to do, the setup in index.js takes control
            // todo: this is only buying sentinels
            store.order(sentinelsProductID)
                .then(console.log("Purchasing Sentinels"))
                .error((error) => {
                    app.showDebugMsg('store_error', {});
                    alert('An Error Occurred while ordering' + JSON.stringify(error));
                })
        }
    }

    /**
     * Add the bought items on to the list of available items (if they are not already there
     */
    static completePurchase(nameOfList) {
        switch (nameOfList) {
            case "sentinel" :
                sentinelStones.completePurchase();
                break;
            default:
                alert("Unknown class of purchase (" + nameOfList + ")")
                break;
        }
    }

    /**
     * Refresh the attributes of the elements that allow the user to navigate to specific stones,
     * or to purchase the premium stones for this set
     */
    static refresh(nameOfList) {
        let listOfAvailableItems = [];
        switch (nameOfList) {
            case "sentinel" :
                listOfAvailableItems = sentinelStones.availableItemList
                break;
        }
        const theListOfButtons = document.getElementById(nameOfList).getElementsByTagName("rect");
        const listLen = theListOfButtons.length;

        for (let buttonIndex = 0; buttonIndex < listLen; buttonIndex++) {
            const buttonElement = theListOfButtons[buttonIndex];
            const buttonIDString = buttonElement.getAttribute('id');
            buttonElement.setAttribute("fill", "transparent");

            if (listOfAvailableItems.indexOf(buttonIDString) < 0) {
                buttonElement.setAttribute("stroke", "grey");
                buttonElement.onclick = function (e) {
                    alert("Invoke the purchase process for " + e.currentTarget.id);
                    StoneSetClass.initiatePurchase(e);
                }
                // app.initiatePurchaseOfSentinels();
                // app.refreshUI();
            } else {
                buttonElement.setAttribute("stroke", "transparent");
                buttonElement.onclick = function (e) {
                    const wrapper = e.currentTarget.parentElement.parentElement;
                    // use this route to finding what to hide so that the correct index specificStoneDisplayHandler is found
                    wrapper.style.display = "none";
                    specificStoneDisplayHandler.show(wrapper.id, e.currentTarget.id);
                }
            }
        }
    }

    completePurchase() {
        if (this.availableItemList.length <= this.freeItemList.length)
            this.availableItemList += this.premiumItemList.slice();

    }
}
