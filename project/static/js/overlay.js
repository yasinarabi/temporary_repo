function hideOverlay(overlay) {
    $(".overlay").css("display", "none");
    $(".overlay form :input").prop("disabled", true);
    $(".overlay form :submit").prop("disabled", true);
    $(".overlay form :input:not(.fixed)").not('input[type="radio"], input[type="checkbox"]').val('');
};

function PublicShowOverlay(event, create_func, edit_func, overlay) {
    $("form :input:not(.fixed)").prop("disabled", false);
    $("form :submit").prop("disabled", false);
    if(!event){
        if (create_func) {
            create_func();
        } else {
            createMode();
        }
    }else{
        if (edit_func) {
            edit_func(event)
        } else {
            if (event.data){
                editMode(event.data);
            } else {
                editMode(event);
            }
            
        }
    }
    overlay = overlay == null ? $("#overlay") : overlay;
    overlay.css("display", "flex");
};

function createError(xhr, status, error){
    alert("خطایی رخ داد: " + error)
    $("form :submit").prop("disabled", false);
    $(".loading").addClass("hidden");
}

function edit_button(item_id, edit_action){
    var edit = $('<button type="button" class="btn bg-primary text-white">').append($(EDIT_ICON)).append("ویرایش");
    edit.click( item_id, edit_action);
    return edit
}
