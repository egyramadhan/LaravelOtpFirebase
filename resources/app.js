// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBf-hMW0e_YAnaf-nGsQk6CmUWJedwOCqc",
    authDomain: "otptest-6933f.firebaseapp.com",
    databaseURL: "https://otptest-6933f.firebaseio.com",
    projectId: "otptest-6933f",
    storageBucket: "otptest-6933f.appspot.com",
    messagingSenderId: "366258989460",
    appId: "1:366258989460:web:595cf6e4978688ded8c781",
    measurementId: "G-KMJVB5Q9PG"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

/**
 * Set up UI event listeners and registering Firebase auth listeners.
 */
window.onload = function() {
    // Listening for auth state changes.
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            var uid = user.uid;
            var email = user.email;
            var photoURL = user.photoURL;
            var phoneNumber = user.phoneNumber;
            var isAnonymous = user.isAnonymous;
            var displayName = user.displayName;
            var providerData = user.providerData;
            var emailVerified = user.emailVerified;
        }
        updateSignInButtonUI();
        updateSignInFormUI();
        updateSignOutButtonUI();
        updateSignedInUserStatusUI();
        updateVerificationCodeFormUI();
    });

    // Event bindings.
    document
        .getElementById("sign-in-form")
        .addEventListener("submit", onSignInSubmit);
    document
        .getElementById("sign-out-button")
        .addEventListener("click", onSignOutClick);
    document
        .getElementById("name")
        .addEventListener("keyup", updateSignInButtonUI);
    document
        .getElementById("name")
        .addEventListener("change", updateSignInButtonUI);
    document
        .getElementById("email")
        .addEventListener("keyup", updateSignInButtonUI);
    document
        .getElementById("email")
        .addEventListener("change", updateSignInButtonUI);
    document
        .getElementById("phone-number")
        .addEventListener("keyup", updateSignInButtonUI);
    document
        .getElementById("phone-number")
        .addEventListener("change", updateSignInButtonUI);
    document
        .getElementById("verification-code")
        .addEventListener("keyup", updateVerifyCodeButtonUI);
    document
        .getElementById("verification-code")
        .addEventListener("change", updateVerifyCodeButtonUI);
    document
        .getElementById("verification-code-form")
        .addEventListener("submit", onVerifyCodeSubmit);
    document
        .getElementById("cancel-verify-code-button")
        .addEventListener("click", cancelVerification);

    // [START appVerifier]
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
        "recaptcha-container",
        {
            size: "normal",
            callback: function(response) {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
                // [START_EXCLUDE]
                updateSignInButtonUI();
                // [END_EXCLUDE]
            },
            "expired-callback": function() {
                // Response expired. Ask user to solve reCAPTCHA again.
                // [START_EXCLUDE]
                updateSignInButtonUI();
                // [END_EXCLUDE]
            }
        }
    );
    // [END appVerifier]

    // [START renderCaptcha]
    recaptchaVerifier.render().then(function(widgetId) {
        window.recaptchaWidgetId = widgetId;
    });
    // [END renderCaptcha]
};

/**
 * Function called when clicking the Login/Logout button.
 */
function onSignInSubmit(e) {
    e.preventDefault();
    if (isCaptchaOK() && isPhoneNumberValid()) {
        window.signingIn = true;
        updateSignInButtonUI();
        // [START signin]
        var name = getNameUserInput();
        var email = getEmailUserInput();
        var phoneNumber = getPhoneNumberFromUserInput();
        var appVerifier = window.recaptchaVerifier;
        firebase
            .auth()
            .signInWithPhoneNumber(phoneNumber, appVerifier)
            .then(function(confirmationResult) {
                // SMS sent. Prompt user to type the code from the message, then sign the
                // user in with confirmationResult.confirm(code).
                window.confirmationResult = confirmationResult;
                // [START_EXCLUDE silent]
                window.signingIn = false;
                updateSignInButtonUI();
                updateVerificationCodeFormUI();
                updateVerifyCodeButtonUI();
                updateSignInFormUI();
                // [END_EXCLUDE]
            })
            .catch(function(error) {
                // Error; SMS not sent
                // [START_EXCLUDE]
                console.error("Error during signInWithPhoneNumber", error);
                window.alert(
                    "Error during signInWithPhoneNumber:\n\n" +
                        error.code +
                        "\n\n" +
                        error.message
                );
                window.signingIn = false;
                updateSignInFormUI();
                updateSignInButtonUI();
                // [END_EXCLUDE]
            });
        // [END signin]
    }
}

/**
 * Function called when clicking the "Verify Code" button.
 */
function onVerifyCodeSubmit(e) {
    e.preventDefault();
    if (!!getCodeFromUserInput()) {
        window.verifyingCode = true;
        updateVerifyCodeButtonUI();
        // [START verifyCode]
        var code = getCodeFromUserInput();
        confirmationResult
            .confirm(code)
            .then(function(result) {
                // User signed in successfully.
                var user = result.user;
                // [START_EXCLUDE]
                window.verifyingCode = false;
                window.confirmationResult = null;
                updateVerificationCodeFormUI();
                // [END_EXCLUDE]
            })
            .catch(function(error) {
                // User couldn't sign in (bad verification code?)
                // [START_EXCLUDE]
                console.error(
                    "Error while checking the verification code",
                    error
                );
                window.alert(
                    "Error while checking the verification code:\n\n" +
                        error.code +
                        "\n\n" +
                        error.message
                );
                window.verifyingCode = false;
                updateSignInButtonUI();
                updateVerifyCodeButtonUI();
                // [END_EXCLUDE]
            });
        // [END verifyCode]
    }
}

/**
 * Cancels the verification code input.
 */
function cancelVerification(e) {
    e.preventDefault();
    window.confirmationResult = null;
    updateVerificationCodeFormUI();
    updateSignInFormUI();
}

/**
 * Signs out the user when the sign-out button is clicked.
 */
function onSignOutClick() {
    firebase.auth().signOut();
}

/**
 * Reads the verification code from the user input.
 */
function getCodeFromUserInput() {
    return document.getElementById("verification-code").value;
}

/**
 * Reads the phone number from the user input.
 */
function getPhoneNumberFromUserInput() {
    return document.getElementById("phone-number").value;
}

// get name input
function getNameUserInput() {
    return document.getElementById("name").value;
}

// get name input
function getEmailUserInput() {
    return document.getElementById("email").value;
}

/**
 * Returns true if the phone number is valid.
 */
function isPhoneNumberValid() {
    var pattern = /^\+[0-9\s\-\(\)]+$/;
    var phoneNumber = getPhoneNumberFromUserInput();
    return phoneNumber.search(pattern) !== -1;
}

/**
 * Returns true if the ReCaptcha is in an OK state.
 */
function isCaptchaOK() {
    if (
        typeof grecaptcha !== "undefined" &&
        typeof window.recaptchaWidgetId !== "undefined"
    ) {
        // [START getRecaptchaResponse]
        var recaptchaResponse = grecaptcha.getResponse(
            window.recaptchaWidgetId
        );
        // [END getRecaptchaResponse]
        return recaptchaResponse !== "";
    }
    return false;
}

/**
 * Re-initializes the ReCaptacha widget.
 */
function resetReCaptcha() {
    if (
        typeof grecaptcha !== "undefined" &&
        typeof window.recaptchaWidgetId !== "undefined"
    ) {
        grecaptcha.reset(window.recaptchaWidgetId);
    }
}

/**
 * Updates the Sign-in button state depending on ReCAptcha and form values state.
 */
function updateSignInButtonUI() {
    document.getElementById("sign-in-button").disabled =
        !isCaptchaOK() || !isPhoneNumberValid() || !!window.signingIn;
}

/**
 * Updates the Verify-code button state depending on form values state.
 */
function updateVerifyCodeButtonUI() {
    document.getElementById("verify-code-button").disabled =
        !!window.verifyingCode || !getCodeFromUserInput();
}

/**
 * Updates the state of the Sign-in form.
 */
function updateSignInFormUI() {
    if (firebase.auth().currentUser || window.confirmationResult) {
        document.getElementById("sign-in-form").style.display = "none";
    } else {
        resetReCaptcha();
        document.getElementById("sign-in-form").style.display = "block";
    }
}

/**
 * Updates the state of the Verify code form.
 */
function updateVerificationCodeFormUI() {
    if (!firebase.auth().currentUser && window.confirmationResult) {
        document.getElementById("verification-code-form").style.display =
            "block";
    } else {
        document.getElementById("verification-code-form").style.display =
            "none";
    }
}

/**
 * Updates the state of the Sign out button.
 */
function updateSignOutButtonUI() {
    if (firebase.auth().currentUser) {
        document.getElementById("sign-out-button").style.display = "block";
    } else {
        document.getElementById("sign-out-button").style.display = "none";
    }
}

/**
 * Updates the Signed in user status panel.
 */
function updateSignedInUserStatusUI() {
    var user = firebase.auth().currentUser;
    if (user) {
        user.updateProfile({
            displayName: getNameUserInput()
        })
            .then(function() {
                console.log("update name");
            })
            .catch(function(error) {
                console.log("failed update name");
            });
        user.updateEmail(getEmailUserInput())
            .then(function() {
                console.log("update email");
            })
            .catch(function(error) {
                console.log("failed update email");
            });
        if (user != null) {
            user.providerData.forEach(function(profile) {
                console.log(" Sign-in provider: " + profile.providerId);
                console.log("  Provider-specific UID: " + profile.uid);
                console.log("  Name: " + profile.displayName);
                console.log("  Email: " + profile.email);
                console.log("  Photo URL: " + profile.photoURL);
            });
        }
        document.getElementById("sign-in-status").textContent = "Signed in";
        document.getElementById("account-details").textContent = JSON.stringify(
            user,
            null,
            "  "
        );
    } else {
        document.getElementById("sign-in-status").textContent = "Signed out";
        document.getElementById("account-details").textContent = "null";
    }
}
{
}

// insert data to table user
$(document).ready(function() {
    $("#sign-in-button").on("click", function() {
        var name = $("#name").val();
        var email = $("#email").val();
        var phone = $("#phone-number").val();
        if (name != "" && email != "" && phone != "") {
            //   $("#butsave").attr("disabled", "disabled");
            $.ajax({
                url: "/users",
                type: "POST",
                data: {
                    _token: $("#csrf").val(),
                    name: name,
                    email: email,
                    "phone-number": phone
                },
                cache: false,
                success: function(dataResult) {
                    console.log(dataResult);
                    var dataResult = JSON.parse(dataResult);
                    if (dataResult.statusCode == 200) {
                        window.location = "/index";
                    } else if (dataResult.statusCode == 201) {
                        alert("Error occured !");
                    }
                }
            });
        } else {
            alert("Please fill all the field !");
        }
    });
});
