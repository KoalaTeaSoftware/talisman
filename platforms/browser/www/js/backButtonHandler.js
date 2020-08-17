// todo: a the moment, it only goes back the sentinels list. It has to handle different stone lists, and even the stone classes
/**
 * This wil lbe of use (at the moment) in taking you back from viewing a specific stone, to a list of stones
 */
document.getElementById("logo").onclick = function () {
        specificStoneDisplayHandler.hide();
        StoneSetClass.show("sentinel");
    }
