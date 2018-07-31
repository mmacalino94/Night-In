
// Initialize Firebase
var config = {
    apiKey: "AIzaSyCSt2wy3t6fYNKzArDrQX_PYuFgh2tgTOI",
    authDomain: "a-night-in.firebaseapp.com",
    databaseURL: "https://a-night-in.firebaseio.com",
    projectId: "a-night-in",
    storageBucket: "",
    messagingSenderId: "115173215878"
};
firebase.initializeApp(config);
var db = firebase.database();
console.log(db);


var ui = new firebaseui.auth.AuthUI(firebase.auth());

var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            console.log(authResult);
            $("#authentication-container").toggle();
            removeSignInLink();
            addLogoutLink();
            addProfilePic(authResult.additionalUserInfo.profile.picture);
            // db.ref().push("Gloop");

            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            return false;
        },
        uiShown: function () {
            // The widget is rendered.
            // Hide the loader.
            document.getElementById('loader').style.display = 'none';
        }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: 'localhost:8000',
    signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        // firebase.auth.PhoneAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    tosUrl: 'https://krab7191.github.io/Night-In/',
    // Privacy policy url.
    privacyPolicyUrl: 'https://krab7191.github.io/Night-In/'
};

ui.start('#firebaseui-auth-container', uiConfig);

// Make only signed in users save stuff
firebase.auth().onAuthStateChanged(function (user) {
    window.user = user; // user is undefined if no user signed in
    if (window.user) {
        console.log("I'm logged in!!");
        console.log(window.user);
        removeSignInLink();
        addLogoutLink();
        addProfilePic(window.user.providerData[0].photoURL);
    }
    else {
        console.log("log in please...");
    }
});

function removeSignInLink() {
    $("#login").remove();
}
function addLogoutLink() {
    var $logout = $("<p>").attr("id", "logout").html("Log Out");
    $("#authbar").append($logout);
}
function addProfilePic(url) {
    var $img = $("<img>").attr("id", "profile-img");
    $img.attr("src", url);
    $("#authbar").append($img);
    $("#title").css("margin-top", "50px");
}

$("#login").on("click", function () {
    $("#authentication-container").modal("show");
});
$(document).on("click", "#logout", function () {
    firebase.auth().signOut().then(function() {
        console.log("signed out successfully");
        $("#profile-img").remove();
        $("#logout").remove();
        var $login = $("<p>").attr('id', "login").html("Log In / Sign Up");
        $("#authbar").append($login);
        $("#title").css("margin-top", "20px");
    }).catch(function (err) {
            // Handle errors
            console.log("Error signing out");
        });
});