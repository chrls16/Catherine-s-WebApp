"use strict";

/* =========================================================
   CATHERINE'S ACCOUNT REGISTRATION SCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       DOM ELEMENTS
    ===================================================== */

    const registerForm = document.getElementById("registerForm");
    const fullNameInput = document.getElementById("fullName");
    const phoneInput = document.getElementById("phoneNumber");
    const emailInput = document.getElementById("registerEmail");
    const passwordInput = document.getElementById("registerPassword");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const agreeTermsInput = document.getElementById("agreeTerms");
    const subscribeNewsletterInput = document.getElementById("subscribeNewsletter");

    // Errors
    const fullNameError = document.getElementById("fullNameError");
    const phoneError = document.getElementById("phoneError");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const confirmPasswordError = document.getElementById("confirmPasswordError");
    const formStatus = document.getElementById("formStatus");

    // Toggles
    const toggleRegisterPassword = document.getElementById("toggleRegisterPassword");
    const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

    // Password Strength & Requirements Elements
    const strengthContainer = document.getElementById("strengthContainer");
    const strengthFill = document.getElementById("strengthFill");
    const strengthLabel = document.getElementById("strengthLabel");

    const reqMinLen = document.getElementById("reqMinLen");
    const reqUpper = document.getElementById("reqUpper");
    const reqNumber = document.getElementById("reqNumber");
    const reqMatch = document.getElementById("reqMatch");

    // Links & Buttons
    const backToResort = document.getElementById("backToResort");
    const termsLink = document.getElementById("termsLink");
    const privacyLink = document.getElementById("privacyLink");

    // Booking Code Modal Elements
    const bookingModal = document.getElementById("bookingModal");
    const bookingCodeBtn = document.getElementById("bookingCodeBtn");
    const closeBookingModal = document.getElementById("closeBookingModal");
    const bookingForm = document.getElementById("bookingForm");
    const bookingCode = document.getElementById("bookingCode");
    const bookingError = document.getElementById("bookingError");


    /* =====================================================
       VALIDATION HELPERS
    ===================================================== */

    function clearErrors() {
        if (fullNameError) fullNameError.textContent = "";
        if (phoneError) phoneError.textContent = "";
        if (emailError) emailError.textContent = "";
        if (passwordError) passwordError.textContent = "";
        if (confirmPasswordError) confirmPasswordError.textContent = "";
        if (formStatus) {
            formStatus.textContent = "";
            formStatus.className = "form-status";
        }
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function isValidPhone(phone) {
        // Simple international / Philippine phone validation (e.g. +63 9XX XXX XXXX or 09XXXXXXXXX)
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");
        return /^(\+?\d{10,14})$/.test(cleanPhone);
    }

    function showStatus(message, type = "normal") {
        if (!formStatus) return;
        formStatus.textContent = message;
        if (type === "success") {
            formStatus.className = "form-status success-status";
        } else if (type === "error") {
            formStatus.className = "form-status error-status";
        } else {
            formStatus.className = "form-status";
        }
    }


    /* =====================================================
       PASSWORD VISIBILITY TOGGLES
    ===================================================== */

    function setupPasswordToggle(toggleBtn, inputEl) {
        if (!toggleBtn || !inputEl) return;

        toggleBtn.addEventListener("click", () => {
            const isPassword = inputEl.type === "password";
            if (isPassword) {
                inputEl.type = "text";
                toggleBtn.textContent = "◉";
                toggleBtn.setAttribute("aria-label", "Hide password");
            } else {
                inputEl.type = "password";
                toggleBtn.textContent = "◌";
                toggleBtn.setAttribute("aria-label", "Show password");
            }
        });
    }

    setupPasswordToggle(toggleRegisterPassword, passwordInput);
    setupPasswordToggle(toggleConfirmPassword, confirmPasswordInput);


    /* =====================================================
       REAL-TIME PASSWORD STRENGTH & REQUIREMENTS CHECKER
    ===================================================== */

    function evaluatePassword() {
        const val = passwordInput ? passwordInput.value : "";
        const confirmVal = confirmPasswordInput ? confirmPasswordInput.value : "";

        if (val.length > 0 && strengthContainer) {
            strengthContainer.style.display = "block";
        } else if (strengthContainer) {
            strengthContainer.style.display = "none";
        }

        // Checks
        const hasMinLen = val.length >= 8;
        const hasUpper = /[A-Z]/.test(val) && /[a-z]/.test(val);
        const hasNumber = /[0-9]/.test(val) || /[^A-Za-z0-9]/.test(val);
        const matches = val.length > 0 && val === confirmVal;

        // Update UI checklist
        if (reqMinLen) reqMinLen.classList.toggle("met", hasMinLen);
        if (reqUpper) reqUpper.classList.toggle("met", hasUpper);
        if (reqNumber) reqNumber.classList.toggle("met", hasNumber);
        if (reqMatch) reqMatch.classList.toggle("met", matches);

        // Strength Calculation
        let score = 0;
        if (val.length >= 8) score++;
        if (val.length >= 12) score++;
        if (/[A-Z]/.test(val)) score++;
        if (/[0-9]/.test(val)) score++;
        if (/[^A-Za-z0-9]/.test(val)) score++;

        if (strengthFill && strengthLabel) {
            strengthFill.className = "strength-bar-fill";
            if (score <= 2) {
                strengthFill.classList.add("weak");
                strengthLabel.textContent = "Weak";
            } else if (score <= 4) {
                strengthFill.classList.add("medium");
                strengthLabel.textContent = "Medium";
            } else {
                strengthFill.classList.add("strong");
                strengthLabel.textContent = "Strong";
            }
        }
    }

    if (passwordInput) {
        passwordInput.addEventListener("input", evaluatePassword);
    }
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener("input", evaluatePassword);
    }


    /* =====================================================
       USER DATABASE INTEGRATION (ResortDB / LocalStorage)
    ===================================================== */

    function getRegisteredUsers() {
        if (window.ResortDB) {
            return window.ResortDB.getAllUsers();
        }
        try {
            const usersJson = localStorage.getItem("resortUsers");
            return usersJson ? JSON.parse(usersJson) : [];
        } catch (e) {
            console.error("Error reading resortUsers from localStorage", e);
            return [];
        }
    }

    function saveUser(newUser) {
        if (window.ResortDB) {
            return window.ResortDB.registerUser(newUser);
        }
        const users = getRegisteredUsers();
        users.push(newUser);
        localStorage.setItem("resortUsers", JSON.stringify(users));
        return { success: true, user: newUser };
    }

    function isEmailRegistered(email) {
        if (window.ResortDB) {
            return window.ResortDB.isEmailRegistered(email);
        }
        const users = getRegisteredUsers();
        return users.some(u => u && u.email && u.email.toLowerCase() === email.toLowerCase());
    }


    /* =====================================================
       REGISTER FORM SUBMISSION
    ===================================================== */

    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            clearErrors();

            const fullName = fullNameInput ? fullNameInput.value.trim() : "";
            const phone = phoneInput ? phoneInput.value.trim() : "";
            const email = emailInput ? emailInput.value.trim() : "";
            const password = passwordInput ? passwordInput.value : "";
            const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : "";
            const agreeTerms = agreeTermsInput ? agreeTermsInput.checked : false;
            const subscribeOffers = subscribeNewsletterInput ? subscribeNewsletterInput.checked : false;

            let isValid = true;

            // 1. Full Name Validation
            if (!fullName) {
                if (fullNameError) fullNameError.textContent = "Please enter your full name.";
                isValid = false;
            } else if (fullName.length < 2) {
                if (fullNameError) fullNameError.textContent = "Please enter a valid full name.";
                isValid = false;
            }

            // 2. Phone Validation
            if (!phone) {
                if (phoneError) phoneError.textContent = "Please enter your mobile number.";
                isValid = false;
            } else if (!isValidPhone(phone)) {
                if (phoneError) phoneError.textContent = "Please enter a valid mobile number (e.g. +63 917 123 4567).";
                isValid = false;
            }

            // 3. Email Validation
            if (!email) {
                if (emailError) emailError.textContent = "Please enter your email address.";
                isValid = false;
            } else if (!isValidEmail(email)) {
                if (emailError) emailError.textContent = "Please enter a valid email address.";
                isValid = false;
            } else if (isEmailRegistered(email)) {
                if (emailError) emailError.textContent = "An account with this email address already exists. Sign in instead?";
                showStatus("This email is already registered. Please click 'Sign in' below.", "error");
                isValid = false;
            }

            // 4. Password Validation
            if (!password) {
                if (passwordError) passwordError.textContent = "Please create a password.";
                isValid = false;
            } else if (password.length < 8) {
                if (passwordError) passwordError.textContent = "Password must be at least 8 characters long.";
                isValid = false;
            }

            // 5. Confirm Password Validation
            if (!confirmPassword) {
                if (confirmPasswordError) confirmPasswordError.textContent = "Please confirm your password.";
                isValid = false;
            } else if (password !== confirmPassword) {
                if (confirmPasswordError) confirmPasswordError.textContent = "Passwords do not match.";
                isValid = false;
            }

            // 6. Terms Agreement
            if (!agreeTerms) {
                showStatus("You must agree to the Terms of Service and Privacy Policy to create an account.", "error");
                isValid = false;
            }

            if (!isValid) return;

            // Save new user account in built-in database
            const newUser = {
                fullName: fullName,
                email: email,
                phone: phone,
                password: password,
                membershipTier: "Sanctuary Member",
                subscribeOffers: subscribeOffers
            };

            if (window.ResortDB) {
                const regRes = window.ResortDB.registerUser(newUser);
                if (!regRes.success) {
                    showStatus(regRes.message || "Registration failed.", "error");
                    return;
                }
                window.ResortDB.saveSession(regRes.user, false);
            } else {
                saveUser(newUser);
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("userRole", "guest");
                localStorage.setItem("guestEmail", email);
                localStorage.setItem("guestName", fullName);
                localStorage.setItem("guestPhone", phone);
                localStorage.removeItem("adminEmail");
                localStorage.removeItem("adminName");
            }

            showStatus("✓ Sanctuary Account Created Successfully! Logging you in...", "success");

            // Disable button during transition
            const submitBtn = document.getElementById("submitRegisterBtn");
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.style.opacity = "0.7";
            }

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1200);
        });
    }


    /* =====================================================
       BACK TO RESORT & TERMS/PRIVACY HANDLERS
    ===================================================== */

    if (backToResort) {
        backToResort.addEventListener("click", () => {
            window.location.href = "index.html";
        });
    }

    if (termsLink) {
        termsLink.addEventListener("click", (e) => {
            e.preventDefault();
            alert("Catherine's Bagasbas Lighthouse Resort - Terms of Service\n\n1. Membership is non-transferable.\n2. Member rates apply to direct bookings.\n3. Cancellation policies apply as outlined in reservation terms.");
        });
    }

    if (privacyLink) {
        privacyLink.addEventListener("click", (e) => {
            e.preventDefault();
            alert("Catherine's Bagasbas Lighthouse Resort - Privacy Policy\n\nYour personal information is securely stored and used solely for managing your resort stay, reservation preferences, and requested communications.");
        });
    }


    /* =====================================================
       BOOKING CODE MODAL HANDLERS
    ===================================================== */

    function openBookingModal() {
        if (!bookingModal) return;
        bookingModal.classList.add("is-open");
        bookingModal.setAttribute("aria-hidden", "false");
        if (bookingCode) bookingCode.focus();
    }

    function closeBookingModalHandler() {
        if (!bookingModal) return;
        bookingModal.classList.remove("is-open");
        bookingModal.setAttribute("aria-hidden", "true");
        if (bookingError) bookingError.textContent = "";
        if (bookingForm) bookingForm.reset();
    }

    if (bookingCodeBtn) {
        bookingCodeBtn.addEventListener("click", openBookingModal);
    }

    if (closeBookingModal) {
        closeBookingModal.addEventListener("click", closeBookingModalHandler);
    }

    const bookingBackdrop = document.querySelector("[data-close-modal]");
    if (bookingBackdrop) {
        bookingBackdrop.addEventListener("click", closeBookingModalHandler);
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && bookingModal && bookingModal.classList.contains("is-open")) {
            closeBookingModalHandler();
        }
    });

    if (bookingForm) {
        bookingForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const code = bookingCode ? bookingCode.value.trim().toUpperCase() : "";
            if (bookingError) bookingError.textContent = "";

            if (!code) {
                if (bookingError) bookingError.textContent = "Please enter your booking code.";
                return;
            }

            if (bookingError) {
                bookingError.textContent = "Booking-code verification will be connected to the reservation database next.";
            }
        });
    }

});
