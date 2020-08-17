/**
 * There is one of these elements in the app. This is here just to abstract its behaviour into a class of its own
 * @type {{hide: specificStoneDisplayHandler.hide}}
 */
let specificStoneDisplayHandler = {
    show: function (stoneClassName, stoneName) {
        document.getElementById("talismanHolder").innerHTML =
            '<img class="ctrImg" src="img/' + stoneClassName + '/' + stoneName + '.jpg" alt="The Stone">';
    },
    hide: function () {
        document.getElementById("talismanHolder").innerHTML = ""
    }
}
