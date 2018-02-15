//resets the entire page so that validation is required again.
$("#reset-button").click(function() {
    window.location.reload(true);
    console.log("reset?")
});

$(document).ready(function() {
    // register our function as the "callback" to be triggered by the form's submission event
    $("#form-gif-request").submit(fetchAndDisplayGif); // in other words, when the form is submitted, fetchAndDisplayGif() will be executed
});

/**
 * sends an asynchronous request to Giphy.com aksing for a random GIF using the
 * user's search term (along with "jackson 5")
 *
 * upon receiving a response from Giphy, updates the DOM to display the new GIF
 */

function fetchAndDisplayGif(event) {

    // This prevents the form submission from doing what it normally does: send a request (which would cause our page to refresh).
    // Because we will be making our own AJAX request, we dont need to send a normal request and we definitely don't want the page to refresh.
    event.preventDefault();

    // get the user's input text from the DOM
        var searchQuery = $("#tag").val(); // TODO/DONE should be e.g. "dance"
        var captcha = $("#captcha").val();

//Validates the captch, if it isn't met, then will not return a gif.
    if (captcha != 5) {
        $("#feedback").text("Wrong.");
        $("#captcha-input").addClass("form-group has-error has-feedback")
        console.log(captcha);
        console.log(searchQuery);
        setGifLoadedStatus(false);
        $("#captcha").css({
            "background-color": "#960000",
            "border": "4px solid black",
            "color": "#fcff5e"
        });
        $("#captcha-label").css("color", "#730000")
        return;
    }
    else {
        console.log(captcha);
        console.log(searchQuery);
    }

    // configure a few parameters to attach to our request
    var params = {
        api_key: "dc6zaTOxFJmzC",
        tag : "Jackson 5 " + searchQuery // TODO/DONE should be e.g. "jackson 5 dance"
    };

    // make an ajax request for a random GIF
    $.ajax({
        url: "https://api.giphy.com/v1/gifs/random", // TODO/DONE where should this request be sent?
        data: params, // attach those extra parameters onto the request
        success: function(response) {
            // if the response comes back successfully, the code in here will execute.

            // jQuery passes us the `response` variable, a regular javascript object created from the JSON the server gave us
            console.log("We received a response!");
            console.log(response);

            // TODO
            // 1. set the source attribute of our image to the image_url of the GIF
            var image = $("#gif");
            var downloadImage = response.data.image_url;
            $("#gif").attr("src", downloadImage)

            // 2. hide the feedback message and display the image
            $("#gif").show();  //shows the gif
            $("#feedback").hide();  //hides the error messages
            $("#gif").attr("hidden", false);  //makes sure that the hidden property is false
            $("hr").attr("hidden", false);  //shows the <hr> element
            $("#form-gif-request input").prop("readonly", "readonly");  //sets the form to ReadOnly so captcha and tagcannot be changed, if change is wanted, must reset page
            $("#tag").css({
                "background-color": "#0000FF",
                "border": "5px double #002b1c"
            });
            $("#captcha").css({
                "background-color": "#008000",
                "border": "5px double #002b1c"
            });
        },
        error: function() {
            // if something went wrong, the code in here will execute instead of the success function

            // give the user an error message
            $("#feedback").text("Sorry, could not load your GIF. Please try again!");
            setGifLoadedStatus(false);
        }
    });

    // TODO
    // give the user a "Loading..." message while they wait
    $("#submit").click(function() {
        $(".loader").css("display", "block");
        $(".loader").text("Patience! Your GIF is on its way!");
    });

    $("#gif").load(function() {
    $(".loader").fadeOut("slow");
    })

}

/**
 * toggles the visibility of UI elements based on whether a GIF is currently loaded.
 * if the GIF is loaded: displays the image and hides the feedback label
 * otherwise: hides the image and displays the feedback label
 */
function setGifLoadedStatus(isCurrentlyLoaded) {
    $("#gif").attr("hidden", !isCurrentlyLoaded);
    $("#feedback").attr("hidden", isCurrentlyLoaded);
}