/// <reference path="typings/jquery/jquery.d.ts" />
$(document).ready(InitializeMenus);
function InitializeMenus() {
    $(".js-dropdown").on("click", ToggleDropdownMenu);
    window.onclick = ClearMenuPopups;
}
function ToggleDropdownMenu(event) {
    var target = $(event.target.parentElement);
    // Some browsers send the child, so find the parent
    if (!target.hasClass("dropdown"))
        target = target.parents("div.dropdown").first();
    var content = target.children(".dropdown-content").first();
    // Is menu already open?
    var opened = content.hasClass("show");
    // Close all menus
    $(".dropdown-content").removeClass("show");
    // If menu wasn't open, open it now
    if (!opened)
        content.toggleClass("show");
}
;
function ClearMenuPopups(event) {
    var target = $(event.target.parentElement);
    // Some browsers send the child, so find the parent
    if (!target.hasClass("dropdown"))
        target = target.parents("div.dropdown").first();
    if (target.length == 0)
        $(".dropdown-content").removeClass("show");
}
