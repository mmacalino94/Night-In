
// Prevent default on form submition
$("#food-input").keydown(function (event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        var food = $("#food-input").val();
        // Handle food mapping function here...
        console.log(food);
        return false;
    }
});
