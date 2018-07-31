// jshint esversion:6
// (Squelch jshint problems about es6 syntax)

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCSt2wy3t6fYNKzArDrQX_PYuFgh2tgTOI",
    authDomain: "a-night-in.firebaseapp.com",
    databaseURL: "https://a-night-in.firebaseio.com",
    projectId: "a-night-in",
    messagingSenderId: "115173215878"
};
firebase.initializeApp(config);
var db = firebase.database();

// Use firebase popup login
var provider = new firebase.auth.GoogleAuthProvider();
function logIn() {
    firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
        localStorage.setItem("access_token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("UID", JSON.stringify(user.providerData[0].uid));
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });
}

// Make only signed in users save stuff
firebase.auth().onAuthStateChanged(function (user) {
    window.user = user; // user is undefined if no user signed in
    if (window.user) {
        console.log("I'm logged in!!");
        console.log({window:user});
        removeSignInLink();
        addLogoutLink();
        addProfilePic(window.user.providerData[0].photoURL);
    }
    else {
        console.log("Not logged in");
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
    logIn();
});

$(document).on("click", "#logout", function () {
    firebase.auth().signOut().then(function () {
        $("#profile-img").remove();
        $("#logout").remove();
        var $login = $("<p>").attr('id', "login").html("Log In / Sign Up");
        $("#authbar").append($login);
        $("#title").css("margin-top", "25px");
    }).catch(function (err) {
        // Handle errors
        console.log("Error signing out");
    });
});