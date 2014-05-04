var logo, closeButton, globalError, switcher, username, password, loginButton, regButton, forgotPassword, background = Browser.extension.getBackgroundPage().extension, baseUrl = background.getOption("secureProto") + background.getBootstrapInfo("serviceHost"), locale = background.getBootstrapInfo("name"), GLOBAL_ERRORS = {UNKNOWN: ["EDAMError_1"], DATA_REQUIRED: ["loginForm_usernameError_8"], INVALID_AUTH: ["loginForm_usernameError_8"], "HTTP/503": ["Error_HTTP_Transport", ["503"]], NETWORK: ["Error_Network_Unavailable"], TOO_MANY_FAILURES: ["EDAMError_3_User_tooManyFailuresTryAgainLater"],
    TIMEOUT: ["popup_loginCheckTimeout"]};
function clearError(a) {
    a.className = a.className.replace(/\s*error/g, "");
    a.nextElementSibling.removeAttribute("data-error")
}
function clearGlobalError() {
    globalError.innerHTML = ""
}
function handleInputKeypress(a) {
    13 == a.keyCode && login()
}
function login() {
    Persistent.set("popup_savedUsername", username.value);
    clearError(username);
    clearError(password);
    clearGlobalError();
    validateUsername() && validatePassword() && background.msgHandlerLogin({username: username.value, password: password.value}, null, msgHandlerLoginResponse)
}
function msgHandlerLoginResponse(a, b, c) {
    a.error ? "INVALID_PASSWORD" == a.error ? setError(password, Browser.i18n.getMessage("loginForm_passwordInvalidError")) : "PASSWORD_REQUIRED" == a.error ? setError(password, Browser.i18n.getMessage("loginForm_passwordError_5")) : "USERNAME_REQUIRED" == a.error ? setError(username, Browser.i18n.getMessage("loginForm_usernameError_5")) : "INVALID_USERNAME" == a.error ? setError(username, Browser.i18n.getMessage("loginForm_usernameInvalidError")) : "ACCOUNT_DEACTIVATED" == a.error ? setError(username,
        Browser.i18n.getMessage("EDAMError_3_User_active")) : "EXPIRED_PASSWORD" == a.error ? (a = "Your password has expired. Please reset it now.", /en/.test(navigator.language) || (a = Browser.i18n.getMessage("expiredV1Password")), setGlobalError(a), a = document.createElement("button"), a.innerText = Browser.i18n.getMessage("ok"), a.addEventListener("click", function () {
        background.msgHandlerOpenWindow({height: 600, width: 800, url: baseUrl + "/Login.action?username=" + encodeURIComponent(username.value) + "&targetUrl=" + encodeURIComponent("/ChangePassword.action?v1=true")})
    }),
        globalError.insertBefore(a, globalError.firstChild)) : GLOBAL_ERRORS[a.error] && setGlobalError(Browser.i18n.getMessage(GLOBAL_ERRORS[a.error][0], GLOBAL_ERRORS[a.error][1])) : a.secondFactorDeliveryHint ? window.location.href = "content/auth_tools/two_factor.html?auth=" + encodeURIComponent(a.authenticationToken) + "&expiration=" + encodeURIComponent(a.expiration) + "&sms=" + encodeURIComponent(a.secondFactorDeliveryHint) : a.sso ? window.location.href = "content/auth_tools/sso.html?bizName=" + encodeURIComponent(a.bizName) :
        a.username ? (background.toggleClipper(null, {tab: a.currentTab}), closePopup()) : window.location.href = "content/auth_tools/two_factor.html?auth=" + encodeURIComponent(a.authenticationToken) + "&expiration=" + encodeURIComponent(a.expiration)
}
function register() {
    background.msgHandlerGetRegistrationLinks(null, null, function (a) {
        a.error ? GLOBAL_ERRORS[a.error] && setGlobalError(GLOBAL_ERRORS[a.error]) : window.location.href = "content/auth_tools/registration.html?captcha=" + encodeURIComponent(a.captcha) + "&submit=" + encodeURIComponent(a.submit)
    })
}
function setError(a, b) {
    a.className += " error";
    a.nextElementSibling.setAttribute("data-error", b)
}
function setGlobalError(a) {
    globalError.innerHTML = a
}
function setupLogin() {
    username.value = Persistent.get("popup_savedUsername");
    /china/i.test(locale) ? (logo.className += " china", regButton.innerHTML = Browser.i18n.getMessage("header_register")) : (logo.className = logo.className.replace(/\s*china/g, ""), /zh-cn/i.test(navigator.language) && (regButton.innerHTML = "\u5efa\u7acb Evernote \u5e33\u6236"));
    1 < background.getBootstrapInfoLength() ? (switcher.className = "visible", /china/i.test(locale) ? switcher.innerHTML = "\u5207\u6362\u5230Evernote International" : switcher.innerHTML =
        "\u5207\u6362\u5230\u5370\u8c61\u7b14\u8bb0") : switcher.className = switcher.className.replace(/\s*visible/g, "");
    forgotPassword.addEventListener("click", function () {
        background.msgHandlerOpenTab({url: baseUrl + "/ForgotPassword.action"});
        closePopup()
    });
    /globalError=([^&]+)/.test(window.location.search) && setGlobalError(decodeURIComponent(/globalError=([^&]+)/.exec(window.location.search)[1]))
}
function validatePassword() {
    return"" == password.value.length ? (setError(password, Browser.i18n.getMessage("loginForm_passwordError_5")), !1) : /^[A-Za-z0-9!#$%&'()*+,./:;<=>?@^_`{|}~\[\]\\-]{6,64}$/.test(password.value) ? !0 : (setError(password, Browser.i18n.getMessage("loginForm_passwordInvalidError")), !1)
}
function validateUsername() {
    return 0 == username.value.length ? (setError(username, Browser.i18n.getMessage("loginForm_usernameError_5")), !1) : !0
}
window.addEventListener("DOMContentLoaded", function () {
    logo = document.querySelector("#logo");
    closeButton = document.querySelector("#close");
    globalError = document.querySelector("#globalError");
    switcher = document.querySelector("#switcher");
    username = document.querySelector("#username");
    password = document.querySelector("#password");
    loginButton = document.querySelector("#login");
    regButton = document.querySelector("#reg");
    forgotPassword = document.querySelector("#forgotPw");
    GlobalUtils.localize(document.body);
    username.placeholder =
        Browser.i18n.getMessage("loginForm_username");
    password.placeholder = Browser.i18n.getMessage("loginForm_password");
    closeButton.addEventListener("click", closePopup);
    closeButton.addEventListener("keypress", function (a) {
        13 == a.keyCode && closePopup()
    });
    logo.addEventListener("click", function () {
        background.msgHandlerOpenTab({url: baseUrl + "/Home.action"})
    });
    switcher.addEventListener("click", function () {
        background.switchService(null, null, function () {
            window.location.reload()
        })
    });
    switcher.addEventListener("keypress",
        function (a) {
            13 == a.keyCode && background.switchService(null, null, function () {
                window.location.reload()
            })
        });
    username.addEventListener("keypress", handleInputKeypress);
    username.addEventListener("input", function () {
        clearError(username);
        clearGlobalError()
    });
    password.addEventListener("keypress", handleInputKeypress);
    password.addEventListener("input", function () {
        clearError(password);
        clearGlobalError()
    });
    loginButton.addEventListener("click", login);
    loginButton.addEventListener("keypress", function (a) {
        13 == a.keyCode &&
        login()
    });
    regButton.addEventListener("click", register);
    regButton.addEventListener("keypress", function (a) {
        13 == a.keyCode && register()
    });
    setupLogin()
});