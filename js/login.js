"use strict";

/* =========================================================
   CATHERINE'S LOGIN PAGE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       LOGIN ELEMENTS
    ===================================================== */

    const loginForm =
        document.getElementById("loginForm");

    const emailInput =
        document.getElementById("email");

    const passwordInput =
        document.getElementById("password");

    const emailError =
        document.getElementById("emailError");

    const passwordError =
        document.getElementById("passwordError");

    const formStatus =
        document.getElementById("formStatus");


    /* =====================================================
       OTHER ELEMENTS
    ===================================================== */

    const togglePassword =
        document.getElementById("togglePassword");

    const forgotPassword =
        document.getElementById("forgotPassword");

    const createAccount =
        document.getElementById("createAccount");

    const backToResort =
        document.getElementById("backToResort");


    /* =====================================================
       BOOKING MODAL ELEMENTS
    ===================================================== */

    const bookingModal =
        document.getElementById("bookingModal");

    const bookingCodeBtn =
        document.getElementById("bookingCodeBtn");

    const closeBookingModal =
        document.getElementById("closeBookingModal");

    const bookingForm =
        document.getElementById("bookingForm");

    const bookingCode =
        document.getElementById("bookingCode");

    const bookingError =
        document.getElementById("bookingError");


    /* =====================================================
       HARD-CODED ADMIN CREDENTIALS
    ===================================================== */

    const ADMIN_EMAIL =
        "admin@catherines.com";

    const ADMIN_PASSWORD =
        "Admin123!";


    /* =====================================================
       HELPER FUNCTIONS
    ===================================================== */

    function clearLoginMessages() {

        if (emailError) {
            emailError.textContent = "";
        }

        if (passwordError) {
            passwordError.textContent = "";
        }

        if (formStatus) {
            formStatus.textContent = "";
        }

    }


    function isValidEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    }


    function showStatus(message) {

        if (formStatus) {

            formStatus.textContent =
                message;

        }

    }


    /* =====================================================
       PASSWORD SHOW / HIDE
    ===================================================== */

    if (togglePassword && passwordInput) {

        togglePassword.addEventListener(
            "click",
            () => {

                const isPassword =
                    passwordInput.type === "password";


                if (isPassword) {

                    passwordInput.type =
                        "text";

                    togglePassword.textContent =
                        "◉";

                    togglePassword.setAttribute(
                        "aria-label",
                        "Hide password"
                    );

                }

                else {

                    passwordInput.type =
                        "password";

                    togglePassword.textContent =
                        "◌";

                    togglePassword.setAttribute(
                        "aria-label",
                        "Show password"
                    );

                }

            }
        );

    }


    /* =====================================================
       LOGIN FORM
    ===================================================== */

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();

                clearLoginMessages();


                /* =============================================
                   GET VALUES
                ============================================= */

                const email =
                    emailInput
                        ? emailInput.value.trim()
                        : "";

                const password =
                    passwordInput
                        ? passwordInput.value
                        : "";


                let valid = true;


                /* =============================================
                   EMAIL VALIDATION
                ============================================= */

                if (!email) {

                    if (emailError) {

                        emailError.textContent =
                            "Please enter your email address.";

                    }

                    valid = false;

                }

                else if (!isValidEmail(email)) {

                    if (emailError) {

                        emailError.textContent =
                            "Please enter a valid email address.";

                    }

                    valid = false;

                }


                /* =============================================
                   PASSWORD VALIDATION
                ============================================= */

                if (!password) {

                    if (passwordError) {

                        passwordError.textContent =
                            "Please enter your password.";

                    }

                    valid = false;

                }


                /* =============================================
                   STOP IF INVALID
                ============================================= */

                if (!valid) {
                    return;
                }


                /* =============================================
                   ADMIN LOGIN
                ============================================= */

                if (
                    email.toLowerCase() ===
                        ADMIN_EMAIL.toLowerCase() &&
                    password ===
                        ADMIN_PASSWORD
                ) {

                    showStatus(
                        "Signing you in as administrator..."
                    );


                    /*
                     * Save authentication state
                     */

                    localStorage.setItem(
                        "isLoggedIn",
                        "true"
                    );


                    /*
                     * Save role
                     */

                    localStorage.setItem(
                        "userRole",
                        "admin"
                    );


                    /*
                     * Save admin information
                     */

                    localStorage.setItem(
                        "adminEmail",
                        ADMIN_EMAIL
                    );

                    localStorage.setItem(
                        "adminName",
                        "Catherine"
                    );


                    /*
                     * Remove guest session data
                     */

                    localStorage.removeItem(
                        "guestEmail"
                    );

                    localStorage.removeItem(
                        "guestName"
                    );


                    /*
                     * Redirect to Admin Dashboard
                     */

                    setTimeout(
                        () => {

                            window.location.href =
                                "admin-dashboard.html";

                        },
                        500
                    );


                    return;

                }


                /* =============================================
                   GUEST LOGIN
                ============================================= */

                /*
                 * Current prototype behavior:
                 *
                 * Any non-empty valid email + password
                 * is treated as a guest account.
                 *
                 * Later, this can be replaced with
                 * Firebase Authentication.
                 */

                if (
                    email !== "" &&
                    password !== ""
                ) {

                    showStatus(
                        "Signing you in..."
                    );


                    /*
                     * Save authentication state
                     */

                    localStorage.setItem(
                        "isLoggedIn",
                        "true"
                    );


                    /*
                     * Save role
                     */

                    localStorage.setItem(
                        "userRole",
                        "guest"
                    );


                    /*
                     * Save guest email
                     */

                    localStorage.setItem(
                        "guestEmail",
                        email
                    );


                    /*
                     * Get guest name if an optional
                     * guestName field exists.
                     */

                    const guestNameInput =
                        document.getElementById(
                            "guestName"
                        );


                    if (
                        guestNameInput &&
                        guestNameInput.value.trim() !== ""
                    ) {

                        localStorage.setItem(
                            "guestName",
                            guestNameInput.value.trim()
                        );

                    }

                    else {

                        /*
                         * Create a temporary display name
                         * from the email.
                         *
                         * Example:
                         * charles.kendrick@gmail.com
                         *
                         * becomes:
                         * Charles Kendrick
                         */

                        const temporaryName =
                            email
                                .split("@")[0]
                                .replace(
                                    /[._-]/g,
                                    " "
                                )
                                .replace(
                                    /\b\w/g,
                                    character =>
                                        character.toUpperCase()
                                );


                        localStorage.setItem(
                            "guestName",
                            temporaryName
                        );

                    }


                    /*
                     * Remove admin session data
                     */

                    localStorage.removeItem(
                        "adminEmail"
                    );

                    localStorage.removeItem(
                        "adminName"
                    );


                    /*
                     * Redirect guest to homepage.
                     *
                     * Your index.js can then detect:
                     *
                     * isLoggedIn = true
                     * userRole = guest
                     *
                     * and display the profile icon.
                     */

                    setTimeout(
                        () => {

                            window.location.href =
                                "index.html";

                        },
                        500
                    );


                    return;

                }


                /* =============================================
                   INVALID LOGIN
                ============================================= */

                showStatus(
                    "Invalid email or password."
                );

            }
        );

    }


    /* =====================================================
       FORGOT PASSWORD
    ===================================================== */

    if (forgotPassword) {

        forgotPassword.addEventListener(
            "click",
            () => {

                const email =
                    emailInput
                        ? emailInput.value.trim()
                        : "";


                if (
                    email &&
                    isValidEmail(email)
                ) {

                    showStatus(
                        `Password reset instructions can be sent to ${email}.`
                    );

                }

                else {

                    showStatus(
                        "Enter your email address first to continue with password recovery."
                    );


                    if (emailInput) {
                        emailInput.focus();
                    }

                }

            }
        );

    }


    /* =====================================================
       CREATE ACCOUNT
    ===================================================== */

    if (createAccount) {

        createAccount.addEventListener(
            "click",
            () => {

                showStatus(
                    "Account registration page will be connected next."
                );

            }
        );

    }


    /* =====================================================
       BACK TO RESORT
    ===================================================== */

    if (backToResort) {

        backToResort.addEventListener(
            "click",
            () => {

                window.location.href =
                    "index.html";

            }
        );

    }


    /* =====================================================
       BOOKING CODE MODAL
    ===================================================== */

    function openBookingModal() {

        if (!bookingModal) {
            return;
        }


        bookingModal.classList.add(
            "is-open"
        );


        bookingModal.setAttribute(
            "aria-hidden",
            "false"
        );


        if (bookingCode) {
            bookingCode.focus();
        }

    }


    function closeBookingModalHandler() {

        if (!bookingModal) {
            return;
        }


        bookingModal.classList.remove(
            "is-open"
        );


        bookingModal.setAttribute(
            "aria-hidden",
            "true"
        );


        if (bookingError) {

            bookingError.textContent =
                "";

        }


        if (bookingForm) {
            bookingForm.reset();
        }

    }


    /* =====================================================
       OPEN BOOKING MODAL
    ===================================================== */

    if (bookingCodeBtn) {

        bookingCodeBtn.addEventListener(
            "click",
            openBookingModal
        );

    }


    /* =====================================================
       CLOSE BOOKING MODAL
    ===================================================== */

    if (closeBookingModal) {

        closeBookingModal.addEventListener(
            "click",
            closeBookingModalHandler
        );

    }


    /* =====================================================
       CLOSE BY CLICKING BACKDROP
    ===================================================== */

    const bookingBackdrop =
        document.querySelector(
            "[data-close-modal]"
        );


    if (bookingBackdrop) {

        bookingBackdrop.addEventListener(
            "click",
            closeBookingModalHandler
        );

    }


    /* =====================================================
       CLOSE WITH ESC KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                bookingModal &&
                bookingModal.classList.contains(
                    "is-open"
                )
            ) {

                closeBookingModalHandler();

            }

        }
    );


    /* =====================================================
       BOOKING CODE FORM
    ===================================================== */

    if (bookingForm) {

        bookingForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                const code =
                    bookingCode
                        ? bookingCode.value
                            .trim()
                            .toUpperCase()
                        : "";


                if (bookingError) {

                    bookingError.textContent =
                        "";

                }


                /* =============================================
                   EMPTY BOOKING CODE
                ============================================= */

                if (!code) {

                    if (bookingError) {

                        bookingError.textContent =
                            "Please enter your booking code.";

                    }

                    return;

                }


                /* =============================================
                   TEMPORARY FRONTEND BEHAVIOR
                ============================================= */

                if (bookingError) {

                    bookingError.textContent =
                        "Booking-code verification will be connected to the reservation database next.";

                }

            }
        );

    }


    /* =====================================================
       INITIALIZATION
    ===================================================== */

    console.log(
        "Catherine's Login System initialized."
    );

});