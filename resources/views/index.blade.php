<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Phone Authentication </title>

    <!-- Material Design Theming -->
    <link
      rel="stylesheet"
      href="https://code.getmdl.io/1.1.3/material.orange-indigo.min.css"
    />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/icon?family=Material+Icons"
    />
    <script defer src="https://code.getmdl.io/1.1.3/material.min.js"></script>

  </head>
  <body>
    <div class="demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-header">
      <!-- Header section containing title -->
      <header
        class="mdl-layout__header mdl-color-text--white mdl-color--light-blue-700"
      >
        <div class="mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-grid">
          <div
            class="mdl-layout__header-row mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--8-col-desktop"
          >
          </div>
        </div>
      </header>

      <main class="mdl-layout__content mdl-color--grey-100">
        <div class="mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-grid">
          <!-- Container for the demo -->
          <div
            class="mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--12-col-desktop"
          >
            <div
              class="mdl-card__title mdl-color--light-blue-600 mdl-color-text--white"
            >
              <h2 class="mdl-card__title-text">
                Phone number authentication with ReCaptcha
              </h2>
            </div>
            <div class="mdl-card__supporting-text mdl-color-text--grey-600">
              <p>Sign in with your phone number below.</p>

              <form id="sign-in-form" method="POST" action="">
                <input type="hidden" name="_token" id="csrf" value="{{Session::token()}}">
                <div
                  class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label"
                >
                  <input
                    class="mdl-textfield__input"
                    type="text"
                    id="name"
                    name="name"
                  />
                  <label class="mdl-textfield__label" for="phone-number"
                    >Enter your name...</label
                  >
                </div>
                <!-- Email -->
                <div
                  class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label"
                >
                  <input
                    class="mdl-textfield__input"
                    type="email"
                    id="email"
                    name="email"
                  />
                  <label class="mdl-textfield__label" for="phone-number"
                    >Enter your email...</label
                  >
                  <span class="mdl-textfield__error"
                    >Input is not an email</span
                  >
                </div>
                <!-- Input to enter the phone number -->
                <div
                  class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label"
                >
                  <input
                    class="mdl-textfield__input"
                    type="text"
                    pattern="\+[0-9\s\-\(\)]+"
                    id="phone-number"
                    name="phone-number"
                  />
                  <label class="mdl-textfield__label" for="phone-number"
                    >Enter your phone number...</label
                  >
                  <span class="mdl-textfield__error">Input is not an international phone number!</span
                  >
                </div>

                <!-- Container to display the re-captcha check -->
                <div id="recaptcha-container"></div>

                <!-- Button that handles sign-in -->
                <input
                  type="submit"
                  disabled
                  class="mdl-button mdl-js-button mdl-button--raised"
                  id="sign-in-button"
                  value="Sign-in"
                />
              </form>
              <!-- Button that handles sign-out -->
              <button
                class="mdl-button mdl-js-button mdl-button--raised"
                id="sign-out-button"
              >
                Sign-out
              </button>

              <form id="verification-code-form" action="#">
                <!-- Input to enter the verification code -->
                <div
                  class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label"
                >
                  <input
                    class="mdl-textfield__input"
                    type="text"
                    id="verification-code"
                  />
                  <label class="mdl-textfield__label" for="verification-code"
                    >Enter the verification code...</label
                  >
                </div>

                <!-- Button that triggers code verification -->
                <input
                  type="submit"
                  class="mdl-button mdl-js-button mdl-button--raised"
                  id="verify-code-button"
                  value="Verify Code"
                />
                <!-- Button to cancel code verification -->
                <button
                  class="mdl-button mdl-js-button mdl-button--raised"
                  id="cancel-verify-code-button"
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>

          <!-- Container for the sign in status and user info -->
          <div
            class="mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--12-col-desktop"
          >
            <div
              class="mdl-card__title mdl-color--light-blue-600 mdl-color-text--white"
            >
              <h2 class="mdl-card__title-text">User sign-in status</h2>
            </div>
            <div class="mdl-card__supporting-text mdl-color-text--grey-600">
              <!-- Container where we'll display the user details -->
              <div class="user-details-container">
                Firebase sign-in status:
                <span id="sign-in-status">Unknown</span>
                <div>Firebase auth <code>currentUser</code> object value:</div>
                <pre><code id="account-details">null</code></pre>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    <script
    src="https://code.jquery.com/jquery-3.4.1.min.js"
    integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo="
    crossorigin="anonymous"></script>
    <script src="https://www.gstatic.com/firebasejs/7.14.0/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/7.14.0/firebase-auth.js"></script>

    <!-- TODO: Add SDKs for Firebase products that you want to use
     https://firebase.google.com/docs/web/setup#available-libraries -->
    <script src="https://www.gstatic.com/firebasejs/7.14.0/firebase-analytics.js"></script>
    <script type="text/javascript" src="{{asset('js/app.js')}}"></script>
</body>
</html>