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
                   REMEMBER ME & SESSION EXPIRY CALCULATION
                ============================================= */

                const rememberMeInput = document.getElementById("rememberMe");
                const isRemembered = rememberMeInput ? rememberMeInput.checked : false;

                // 30 days vs 1 day session duration
                const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
                const ONE_DAY_MS = 24 * 60 * 60 * 1000;
                const expiryDuration = isRemembered ? THIRTY_DAYS_MS : ONE_DAY_MS;
                const sessionExpiry = Date.now() + expiryDuration;

                localStorage.setItem("rememberMe", isRemembered ? "true" : "false");
                localStorage.setItem("sessionExpiry", sessionExpiry.toString());
                localStorage.setItem("loginTime", Date.now().toString());


                /* =============================================
                   CHECK REGISTERED ACCOUNTS IN LOCALSTORAGE
                ============================================= */

                let registeredUsers = [];
                try {
                    const storedUsers = localStorage.getItem("resortUsers");
                    if (storedUsers) {
                        registeredUsers = JSON.parse(storedUsers);
                    }
                } catch (e) {
                    console.error("Error loading registered users", e);
                }

                const existingAccount = registeredUsers.find(
                    u => u.email.toLowerCase() === email.toLowerCase()
                );

                if (existingAccount) {
                    if (existingAccount.password !== password) {
                        if (passwordError) {
                            passwordError.textContent = "Incorrect password for this registered account.";
                        }
                        showStatus("Incorrect password for this registered account.");
                        return;
                    }

                    showStatus("Signing you in as " + existingAccount.fullName + "...");

                    localStorage.setItem("isLoggedIn", "true");
                    localStorage.setItem("userRole", "guest");
                    localStorage.setItem("guestEmail", existingAccount.email);
                    localStorage.setItem("guestName", existingAccount.fullName);
                    if (existingAccount.phone) {
                        localStorage.setItem("guestPhone", existingAccount.phone);
                    }

                    localStorage.removeItem("adminEmail");
                    localStorage.removeItem("adminName");

                    setTimeout(() => {
                        window.location.href = "index.html";
                    }, 500);

                    return;
                }


                /* =============================================
                   GUEST LOGIN (PROTOTYPE FALLBACK)
                ============================================= */

                if (
                    email !== "" &&
                    password !== ""
                ) {

                    showStatus(
                        "Signing you in..."
                    );

                    localStorage.setItem(
                        "isLoggedIn",
                        "true"
                    );

                    localStorage.setItem(
                        "userRole",
                        "guest"
                    );

                    localStorage.setItem(
                        "guestEmail",
                        email
                    );

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
                    } else {
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

                    localStorage.removeItem(
                        "adminEmail"
                    );

                    localStorage.removeItem(
                        "adminName"
                    );

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
       RESTORE REMEMBER ME & CHECK SESSION EXPIRY ON LOAD
    ===================================================== */

    const rememberMeCheckbox = document.getElementById("rememberMe");
    if (rememberMeCheckbox) {
        const savedRemember = localStorage.getItem("rememberMe");
        if (savedRemember === "true") {
            rememberMeCheckbox.checked = true;
        }
    }

    const currentLoggedIn = localStorage.getItem("isLoggedIn");
    const currentSessionExpiry = localStorage.getItem("sessionExpiry");
    if (currentLoggedIn === "true" && currentSessionExpiry) {
        if (Date.now() > parseInt(currentSessionExpiry, 10)) {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("userRole");
            localStorage.removeItem("guestEmail");
            localStorage.removeItem("guestName");
            localStorage.removeItem("sessionExpiry");
            localStorage.removeItem("rememberMe");
            showStatus("Your 30-day sanctuary session has expired. Please sign in again.");
        }
    }


    /* =====================================================
       EMAILJS CONFIGURATION FOR PASSWORD RESET
       Replace placeholders with your actual EmailJS credentials:
       - PUBLIC_KEY: Found in Account > API Keys
       - SERVICE_ID: Found in Email Services (e.g. service_gmail / service_xxxx)
       - TEMPLATE_ID: Found in Email Templates (e.g. template_xxxx)
    ===================================================== */
    const EMAILJS_CONFIG = {
        PUBLIC_KEY: "qiKerR2jT2TV2n4eO",
        SERVICE_ID: "service_cse4f86",
        TEMPLATE_ID: "template_qmmtb1a"
    };

    // Initialize EmailJS if browser SDK is present & public key is set
    if (typeof emailjs !== "undefined" && EMAILJS_CONFIG.PUBLIC_KEY && EMAILJS_CONFIG.PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
        try {
            emailjs.init({
                publicKey: EMAILJS_CONFIG.PUBLIC_KEY
            });
        } catch (err) {
            console.error("EmailJS init failed:", err);
        }
    }

    /* =====================================================
       FORGOT PASSWORD MODAL & RESET FLOW
    ===================================================== */

    const forgotPasswordModal = document.getElementById("forgotPasswordModal");
    const closeForgotModal = document.getElementById("closeForgotModal");
    const forgotStep1Form = document.getElementById("forgotStep1Form");
    const forgotStep2Form = document.getElementById("forgotStep2Form");

    const resetEmailInput = document.getElementById("resetEmailInput");
    const resetEmailError = document.getElementById("resetEmailError");
    const resetCodeInput = document.getElementById("resetCodeInput");
    const newPasswordInput = document.getElementById("newPasswordInput");
    const confirmNewPasswordInput = document.getElementById("confirmNewPasswordInput");
    const resetPasswordError = document.getElementById("resetPasswordError");
    const simulatedCodeBanner = document.getElementById("simulatedCodeBanner");

    let targetResetEmail = "";
    let activeResetCode = "CAT-8942";

    function openForgotModal() {
        if (!forgotPasswordModal) return;

        // Reset step forms
        if (forgotStep1Form) forgotStep1Form.style.display = "block";
        if (forgotStep2Form) forgotStep2Form.style.display = "none";
        if (resetEmailError) resetEmailError.textContent = "";
        if (resetPasswordError) resetPasswordError.textContent = "";

        // Pre-fill email if entered on login form
        if (emailInput && emailInput.value.trim() && resetEmailInput) {
            resetEmailInput.value = emailInput.value.trim();
        }

        forgotPasswordModal.classList.add("is-open");
        forgotPasswordModal.setAttribute("aria-hidden", "false");

        if (resetEmailInput) resetEmailInput.focus();
    }

    function closeForgotModalHandler() {
        if (!forgotPasswordModal) return;
        forgotPasswordModal.classList.remove("is-open");
        forgotPasswordModal.setAttribute("aria-hidden", "true");
        if (forgotStep1Form) forgotStep1Form.reset();
        if (forgotStep2Form) forgotStep2Form.reset();
    }

    if (forgotPassword) {
        forgotPassword.addEventListener("click", (e) => {
            e.preventDefault();
            openForgotModal();
        });
    }

    if (closeForgotModal) {
        closeForgotModal.addEventListener("click", closeForgotModalHandler);
    }

    const forgotBackdrop = document.querySelector("[data-close-forgot-modal]");
    if (forgotBackdrop) {
        forgotBackdrop.addEventListener("click", closeForgotModalHandler);
    }

    // Step 1: Submit email to request code
    if (forgotStep1Form) {
        forgotStep1Form.addEventListener("submit", (e) => {
            e.preventDefault();
            if (resetEmailError) resetEmailError.textContent = "";

            const emailVal = resetEmailInput ? resetEmailInput.value.trim() : "";
            if (!emailVal || !isValidEmail(emailVal)) {
                if (resetEmailError) resetEmailError.textContent = "Please enter a valid registered email address.";
                return;
            }

            targetResetEmail = emailVal;
            activeResetCode = "CAT-" + Math.floor(1000 + Math.random() * 9000);

            const sendBtn = document.getElementById("sendResetCodeBtn");
            const btnSpan = sendBtn ? sendBtn.querySelector("span") : null;
            if (sendBtn && btnSpan) {
                sendBtn.disabled = true;
                btnSpan.textContent = "Sending Email...";
            }

            const proceedToStep2 = (messageHtml, isSuccess = true) => {
                if (simulatedCodeBanner) {
                    simulatedCodeBanner.style.background = isSuccess ? "#eafaf1" : "#fff2f2";
                    simulatedCodeBanner.style.borderColor = isSuccess ? "#a2e8c2" : "#f8b4b4";
                    simulatedCodeBanner.style.color = isSuccess ? "#17673b" : "#9b1c1c";
                    simulatedCodeBanner.innerHTML = messageHtml;
                }
                if (sendBtn && btnSpan) {
                    sendBtn.disabled = false;
                    btnSpan.textContent = "Send Verification Code";
                }
                forgotStep1Form.style.display = "none";
                forgotStep2Form.style.display = "block";
                if (resetCodeInput) resetCodeInput.focus();
            };

            // Check if EmailJS is configured
            const isEmailJSReady = typeof emailjs !== "undefined" &&
                EMAILJS_CONFIG.SERVICE_ID &&
                EMAILJS_CONFIG.SERVICE_ID !== "YOUR_SERVICE_ID" &&
                EMAILJS_CONFIG.TEMPLATE_ID &&
                EMAILJS_CONFIG.TEMPLATE_ID !== "YOUR_TEMPLATE_ID";

            if (isEmailJSReady) {
                const templateParams = {
                    to_email: targetResetEmail,
                    email: targetResetEmail,
                    user_email: targetResetEmail,
                    recipient_email: targetResetEmail,
                    verification_code: activeResetCode,
                    code: activeResetCode,
                    pass_code: activeResetCode
                };

                const sendOptions = {
                    publicKey: EMAILJS_CONFIG.PUBLIC_KEY
                };

                emailjs.send(
                    EMAILJS_CONFIG.SERVICE_ID,
                    EMAILJS_CONFIG.TEMPLATE_ID,
                    templateParams,
                    sendOptions
                ).then((res) => {
                    console.log("EmailJS Success Response:", res);
                    proceedToStep2(`📧 Verification Code sent to <strong>${targetResetEmail}</strong>! Please check your email inbox (and spam folder).`, true);
                }).catch((err) => {
                    console.error("EmailJS Error Response:", err);
                    const errMsg = (err && (err.text || err.message)) ? (err.text || err.message) : "Failed to connect to EmailJS server";
                    proceedToStep2(`⚠️ EmailJS Error (${errMsg}). Demo Code for testing: <strong>${activeResetCode}</strong>`, false);
                });
            } else {
                // Fallback demo mode when EmailJS credentials are not set
                proceedToStep2(`🔑 Verification Code Sent to <strong>${targetResetEmail}</strong>! Code: <strong>${activeResetCode}</strong>`, false);
            }
        });
    }

    // Step 2: Submit code & new password
    if (forgotStep2Form) {
        forgotStep2Form.addEventListener("submit", (e) => {
            e.preventDefault();
            if (resetPasswordError) resetPasswordError.textContent = "";

            const codeVal = resetCodeInput ? resetCodeInput.value.trim().toUpperCase() : "";
            const newPass = newPasswordInput ? newPasswordInput.value : "";
            const confirmPass = confirmNewPasswordInput ? confirmNewPasswordInput.value : "";

            if (!codeVal) {
                if (resetPasswordError) resetPasswordError.textContent = "Please enter the verification code.";
                return;
            }

            if (codeVal !== activeResetCode.toUpperCase()) {
                if (resetPasswordError) resetPasswordError.textContent = `Invalid verification code. (Hint: Use ${activeResetCode})`;
                return;
            }

            if (!newPass || newPass.length < 8) {
                if (resetPasswordError) resetPasswordError.textContent = "New password must be at least 8 characters long.";
                return;
            }

            if (newPass !== confirmPass) {
                if (resetPasswordError) resetPasswordError.textContent = "Passwords do not match.";
                return;
            }

            // Update user password in resortUsers in localStorage
            try {
                const storedUsers = localStorage.getItem("resortUsers");
                let users = storedUsers ? JSON.parse(storedUsers) : [];

                const userIndex = users.findIndex(u => u.email.toLowerCase() === targetResetEmail.toLowerCase());
                if (userIndex !== -1) {
                    users[userIndex].password = newPass;
                    localStorage.setItem("resortUsers", JSON.stringify(users));
                } else {
                    // Create account if not present yet
                    users.push({
                        fullName: targetResetEmail.split("@")[0].replace(/[._-]/g, " "),
                        email: targetResetEmail,
                        password: newPass,
                        createdAt: new Date().toISOString()
                    });
                    localStorage.setItem("resortUsers", JSON.stringify(users));
                }
            } catch (err) {
                console.error("Error updating reset password in localStorage", err);
            }

            closeForgotModalHandler();

            if (emailInput) emailInput.value = targetResetEmail;
            if (passwordInput) passwordInput.value = newPass;

            showStatus("✓ Password reset successfully! You can now sign in with your new password.");
        });
    }


    /* =====================================================
       CREATE ACCOUNT
    ===================================================== */

    if (createAccount) {

        createAccount.addEventListener(
            "click",
            (e) => {

                e.preventDefault();
                window.location.href = "register.html";

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
                   QUICK GUEST ACCESS VERIFICATION
                ============================================= */

                const cleanCode = code.replace(/^#/, "").trim();

                // 1. Check reservationHistory in localStorage
                let history = [];
                try {
                    const stored = localStorage.getItem("reservationHistory");
                    if (stored) history = JSON.parse(stored);
                } catch (e) {
                    console.error("Error loading reservationHistory for quick access", e);
                }

                // 2. Check currentReservation in localStorage
                let currRes = null;
                try {
                    const savedCurr = localStorage.getItem("currentReservation");
                    if (savedCurr) currRes = JSON.parse(savedCurr);
                } catch (e) {}

                let match = history.find(r => 
                    r.reference && 
                    (r.reference.toUpperCase() === cleanCode || 
                     r.reference.replace(/[^A-Z0-9]/gi, "").toUpperCase() === cleanCode.replace(/[^A-Z0-9]/gi, "").toUpperCase())
                );

                if (!match && currRes && currRes.reference) {
                    if (currRes.reference.toUpperCase() === cleanCode || 
                        currRes.reference.replace(/[^A-Z0-9]/gi, "").toUpperCase() === cleanCode.replace(/[^A-Z0-9]/gi, "").toUpperCase()) {
                        match = currRes;
                    }
                }

                if (match) {
                    // Authenticate Guest Session from matching reservation
                    localStorage.setItem("isLoggedIn", "true");
                    localStorage.setItem("userRole", "guest");
                    localStorage.setItem("guestEmail", match.email || "guest@catherineslighthouse.ph");
                    localStorage.setItem("guestName", match.guestName || "Guest");
                    if (match.mobile) localStorage.setItem("guestMobile", match.mobile);
                    localStorage.setItem("currentReservation", JSON.stringify(match));

                    if (bookingError) {
                        bookingError.style.color = "#2e7d32";
                        bookingError.textContent = `✓ Reservation #${match.reference} verified! Signing you in as ${match.guestName}...`;
                    }

                    setTimeout(() => {
                        closeBookingModalHandler();
                        window.location.href = "my-reservation.html";
                    }, 600);
                    return;
                }

                // 3. Fallback for demo booking codes (e.g. CAT-2026-001, CBLR-xxxxxx)
                if (cleanCode.startsWith("CAT") || cleanCode.startsWith("CBLR") || cleanCode.length >= 6) {
                    const demoReservation = {
                        reference: cleanCode,
                        guestName: "Guest Member",
                        email: "guest@catherineslighthouse.ph",
                        checkinDate: new Date().toISOString().split("T")[0],
                        duration: "2 Nights",
                        totalGuests: 2,
                        status: "Confirmed",
                        facilities: [
                            { name: "Private Seaside Cottage", price: 4500 },
                            { name: "Swimming Pool & Arched Bridge", price: 1200 }
                        ],
                        prices: { total: 6156 }
                    };

                    localStorage.setItem("isLoggedIn", "true");
                    localStorage.setItem("userRole", "guest");
                    localStorage.setItem("guestEmail", demoReservation.email);
                    localStorage.setItem("guestName", demoReservation.guestName);
                    localStorage.setItem("currentReservation", JSON.stringify(demoReservation));

                    if (bookingError) {
                        bookingError.style.color = "#2e7d32";
                        bookingError.textContent = `✓ Quick Access Granted for #${cleanCode}! Redirecting...`;
                    }

                    setTimeout(() => {
                        closeBookingModalHandler();
                        window.location.href = "guest-dashboard.html";
                    }, 600);
                    return;
                }

                if (bookingError) {
                    bookingError.style.color = "#d32f2f";
                    bookingError.textContent = "No active reservation found matching this booking code. Please verify your reference code.";
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