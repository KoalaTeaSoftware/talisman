const noticeBlock = document.getElementById("debugBlock");

let app = {
    ownedSentinelList: [],
    freeSentinelList: [
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
        "physical-tasks"],
    premiumSentinelList: [
        "envy",
        "grief",
        "worry",
        "unwanted-presence",
        "revenge",
        "age",
        "being-undesirable"
    ],
    initialize: function () {
        this.showDebugMsg("Initializing");

        this.ownedSentinelList = this.freeSentinelList.slice(); // slice() give us a shallow copy

        window.addEventListener('load', this.deviceReadyAction, false); // for debugging in browser
        document.addEventListener('deviceready', this.deviceReadyAction, false);

        // toDo: at this point, the click on the logo should take you to the 'which set of talismans' choice
        document.getElementById("logo").addEventListener("click", this.showTalismanList, false);
        // todo: this should be showing the 'which set of talismans', not 'which specific talisman' choice
        app.showTalismanList("sentinel");
    },
    deviceReadyAction: function () {
        app.showDebugMsg("Received the device ready event");

        app.refreshUI();
        if (typeof store === 'undefined') {
            app.showDebugMsg("Store is undefined")
        } else {
            app.showDebugMsg("Store is defined")
            // toDo: add a load of stuff to do with the store (see the deleteme.js file)
        }
    },
    showTalismanList: function (place) {
        // If this is responding to a click, then the param could be a MouseEvent object
        if ((typeof (place) === "undefined") || (typeof (place) === "object")) place = 'sentinel';
        // ToDo: either automatically hide all the indexes, or have a specific hider
        document.getElementById(place).style.display = 'block';
        document.getElementById("talismanHolder").innerHTML = ""; // whatever the index being shown the holder must be MT
    },
    refreshUI: function () {
        // go through all of the listed index stones (list of a class of talisman)
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

                // todo handle other sets of talismans
                if (this.ownedSentinelList.indexOf(buttonIDString) < 0) {
                    buttonElement.setAttribute("stroke", "grey");
                    buttonElement.onclick = function (e) {
                        alert("Invoke the purchase process for " + e.currentTarget.id);
                        app.initiatePurchaseOfSentinels();
                        app.refreshUI();
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
    },
    initiatePurchaseOfSentinels: function () {
        if (typeof store === 'undefined') {
            app.showDebugMsg("Store is undefined, so pretending purchase is successful");
            this.ownedSentinelList = this.ownedSentinelList.concat(this.premiumSentinelList);
            this.refreshUI();
        } else {
            app.showDebugMsg("Asking the store to make the purchase");
            store.order(sentinelsProductID)
                .then(console.log("Purchasing Sentinels"))
                .error((error) => {
                    app.showDebugMsg('store_error', {});
                    alert('An Error Occurred while ordering' + JSON.stringify(error));
                })
        }
    },
    showDebugMsg: function (msg) {
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
