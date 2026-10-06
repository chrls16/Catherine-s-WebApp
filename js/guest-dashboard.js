"use strict";

/* =========================================================
   CATHERINE'S GUEST DASHBOARD
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       AUTHENTICATION
    ===================================================== */

    const isLoggedIn =
        localStorage.getItem("isLoggedIn");

    const sessionExpiry =
        localStorage.getItem("sessionExpiry");

    if (isLoggedIn !== "true") {
        window.location.href = "login.html";
        return;
    }

    if (sessionExpiry && Date.now() > parseInt(sessionExpiry, 10)) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("guestName");
        localStorage.removeItem("guestEmail");
        localStorage.removeItem("sessionExpiry");
        localStorage.removeItem("rememberMe");
        alert("Your 30-day sanctuary session has expired. Please sign in again.");
        window.location.href = "login.html";
        return;
    }

    // Verify that guest account is actually registered in database
    const role = localStorage.getItem("userRole");
    const storedEmail = localStorage.getItem("guestEmail");
    if (role === "guest" && storedEmail) {
        try {
            const rawUsers = localStorage.getItem("resortUsers");
            if (rawUsers) {
                const users = JSON.parse(rawUsers);
                const exists = Array.isArray(users) && users.some(
                    u => u && u.email && u.email.toLowerCase() === storedEmail.toLowerCase()
                );
                if (!exists) {
                    localStorage.removeItem("isLoggedIn");
                    localStorage.removeItem("userRole");
                    localStorage.removeItem("guestEmail");
                    localStorage.removeItem("guestName");
                    window.location.href = "login.html";
                    return;
                }
            }
        } catch (e) {}
    }


    /* =====================================================
       GUEST INFORMATION
    ===================================================== */

    const guestName =
        localStorage.getItem("guestName") || "Guest";

    const guestEmail =
        localStorage.getItem("guestEmail") || "";


    const guestNameElements =
        document.querySelectorAll(
            "#guestName, #topGuestName, #welcomeGuestName, #headerGuestName"
        );


    guestNameElements.forEach(element => {
        if (element) {
            element.textContent = guestName;
        }
    });


    const emailElements =
        document.querySelectorAll(
            "#guestEmail"
        );


    emailElements.forEach(element => {
        if (element) {
            element.textContent = guestEmail;
        }
    });


    /* Update Profile Avatar Initial */
    const avatarElements =
        document.querySelectorAll(
            ".profile-avatar, #profileAvatar, #headerProfileAvatar"
        );

    avatarElements.forEach(avatar => {
        if (avatar && guestName) {
            avatar.textContent =
                guestName.trim().charAt(0).toUpperCase();
        }
    });


    /* =====================================================
       SIDEBAR NAVIGATION
       IMPORTANT:
       Only one declaration of the navigation collection.
    ===================================================== */

    const dashboardButton =
        document.getElementById("dashboardButton");

    const reservationButton =
        document.getElementById("reservationButton");


    /* Dashboard */

    if (dashboardButton) {

        dashboardButton.addEventListener(
            "click",
            () => {

                window.location.href =
                    "guest-dashboard.html";

            }
        );

    }


    /* My Reservation */

    if (reservationButton) {

        reservationButton.addEventListener(
            "click",
            () => {

                window.location.href =
                    "my-reservation.html";

            }
        );

    }


    /* =====================================================
       LOGOUT FUNCTIONALITY
    ===================================================== */

    function performLogout() {

        const confirmed =
            window.confirm(
                "Are you sure you want to log out of your sanctuary session?"
            );


        if (!confirmed) {
            return;
        }


        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("guestName");
        localStorage.removeItem("guestEmail");
        localStorage.removeItem("guestPhone");
        localStorage.removeItem("guestMobile");
        localStorage.removeItem("userRole");
        localStorage.removeItem("currentReservation");


        window.location.href = "index.html";

    }

    /* Attach logout listener to all logout buttons and header guest profile */
    const logoutTriggers =
        document.querySelectorAll(
            "#logoutBtn, #logoutButton, #sharedLogoutButton, .guest-profile"
        );


    logoutTriggers.forEach(trigger => {
        if (trigger) {
            trigger.style.cursor = "pointer";
            trigger.title = "Click to log out";
            trigger.addEventListener("click", (e) => {
                // If trigger is a child button inside profile, prevent double prompt
                e.stopPropagation();
                performLogout();
            });
        }
    });


    /* =====================================================
       NFC / RFID CHECK-IN
    ===================================================== */

    const simulateNfcButton =
        document.getElementById(
            "simulateNfc"
        );


    const resetNfcButton =
        document.getElementById(
            "resetNfc"
        );


    const checkInStatus =
        document.getElementById(
            "checkInStatus"
        );


    const checkInPanel =
        document.getElementById(
            "checkInPanel"
        );


    let isCheckedIn = false;


    function updateCheckInState() {

        if (checkInStatus) {

            if (isCheckedIn) {

                checkInStatus.textContent =
                    "CHECK-IN SUCCESSFUL";

                checkInStatus.classList.add(
                    "success"
                );

            } else {

                checkInStatus.textContent =
                    "NOT CHECKED-IN";

                checkInStatus.classList.remove(
                    "success"
                );

            }

        }


        /*
         * Enable/disable controls based
         * on check-in state.
         */

        const protectedControls =
            document.querySelectorAll(
                "[data-requires-checkin]"
            );


        protectedControls.forEach(
            control => {

                control.disabled =
                    !isCheckedIn;

            }
        );

    }


    if (simulateNfcButton) {

        simulateNfcButton.addEventListener(
            "click",
            () => {

                isCheckedIn = true;

                updateCheckInState();


                if (checkInPanel) {

                    checkInPanel.classList.add(
                        "checked-in"
                    );

                }

            }
        );

    }


    if (resetNfcButton) {

        resetNfcButton.addEventListener(
            "click",
            () => {

                isCheckedIn = false;

                updateCheckInState();


                if (checkInPanel) {

                    checkInPanel.classList.remove(
                        "checked-in"
                    );

                }

            }
        );

    }


    updateCheckInState();


    /* =====================================================
       COTTAGE LIGHT
    ===================================================== */

    const cottageLightButton =
        document.getElementById(
            "cottageLightButton"
        );


    const cottageLightLabel =
        document.getElementById(
            "cottageLightLabel"
        );


    let cottageLightOn = false;


    if (cottageLightButton) {

        cottageLightButton.addEventListener(
            "click",
            () => {

                cottageLightOn =
                    !cottageLightOn;


                cottageLightButton.classList.toggle(
                    "active",
                    cottageLightOn
                );


                if (cottageLightLabel) {

                    cottageLightLabel.textContent =
                        cottageLightOn
                            ? "Lights ON"
                            : "Lights OFF";

                }

            }
        );

    }


    /* =====================================================
       BRIGHTNESS
    ===================================================== */

    const brightnessSlider =
        document.getElementById(
            "brightnessSlider"
        );


    const brightnessValue =
        document.getElementById(
            "brightnessValue"
        );


    if (brightnessSlider) {

        brightnessSlider.addEventListener(
            "input",
            () => {

                const value =
                    brightnessSlider.value;


                if (brightnessValue) {

                    brightnessValue.textContent =
                        `${value}%`;

                }

            }
        );

    }


    /* =====================================================
       POOL COLOR
    ===================================================== */

    const poolColorButtons =
        document.querySelectorAll(
            "[data-pool-color]"
        );


    const poolColorValue =
        document.getElementById(
            "poolColorValue"
        );


    poolColorButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    poolColorButtons.forEach(
                        item => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    const color =
                        button.dataset.poolColor;


                    if (poolColorValue) {

                        poolColorValue.textContent =
                            color;

                    }

                }
            );

        }
    );


    /* =====================================================
       POOL INTENSITY
    ===================================================== */

    const poolIntensitySlider =
        document.getElementById(
            "poolIntensity"
        );


    const poolIntensityValue =
        document.getElementById(
            "poolIntensityValue"
        );


    if (poolIntensitySlider) {

        poolIntensitySlider.addEventListener(
            "input",
            () => {

                const value =
                    poolIntensitySlider.value;


                if (poolIntensityValue) {

                    poolIntensityValue.textContent =
                        `${value}%`;

                }

            }
        );

    }


    /* =====================================================
       BRIDGE LIGHT
    ===================================================== */

    const bridgeButton =
        document.getElementById(
            "bridgeButton"
        );


    const bridgeLabel =
        document.getElementById(
            "bridgeLabel"
        );


    let bridgeOn = false;


    if (bridgeButton) {

        bridgeButton.addEventListener(
            "click",
            () => {

                bridgeOn =
                    !bridgeOn;


                bridgeButton.classList.toggle(
                    "active",
                    bridgeOn
                );


                if (bridgeLabel) {

                    bridgeLabel.textContent =
                        bridgeOn
                            ? "Bridge Lights ON"
                            : "Bridge Lights OFF";

                }

            }
        );

    }


    /* =====================================================
       KTV
    ===================================================== */

    const ktvButton =
        document.getElementById(
            "ktvButton"
        );


    const ktvStatus =
        document.getElementById(
            "ktvStatus"
        );


    let ktvOn = false;


    if (ktvButton) {

        ktvButton.addEventListener(
            "click",
            () => {

                ktvOn =
                    !ktvOn;


                ktvButton.classList.toggle(
                    "active",
                    ktvOn
                );


                if (ktvStatus) {

                    ktvStatus.textContent =
                        ktvOn
                            ? "KTV READY"
                            : "KTV OFF";

                }

            }
        );

    }


    /* =====================================================
       LIGHTING MODES
    ===================================================== */

    const lightingModeButtons =
        document.querySelectorAll(
            "[data-lighting-mode]"
        );


    const currentLightingMode =
        document.getElementById(
            "currentLightingMode"
        );


    lightingModeButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    lightingModeButtons.forEach(
                        item => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    const mode =
                        button.dataset.lightingMode;


                    if (currentLightingMode) {

                        currentLightingMode.textContent =
                            mode;

                    }

                }
            );

        }
    );


    /* =====================================================
       CHECKOUT
    ===================================================== */

    const checkoutButton =
        document.getElementById(
            "checkoutButton"
        );


    const checkoutModal =
        document.getElementById(
            "checkoutModal"
        );


    const confirmCheckout =
        document.getElementById(
            "confirmCheckout"
        );


    const cancelCheckout =
        document.getElementById(
            "cancelCheckout"
        );


    if (checkoutButton) {

        checkoutButton.addEventListener(
            "click",
            () => {

                if (checkoutModal) {

                    checkoutModal.classList.add(
                        "show"
                    );

                } else {

                    const confirmed =
                        window.confirm(
                            "Are you sure you want to check out?"
                        );


                    if (confirmed) {

                        performCheckout();

                    }

                }

            }
        );

    }


    if (confirmCheckout) {

        confirmCheckout.addEventListener(
            "click",
            () => {

                performCheckout();

            }
        );

    }


    if (cancelCheckout) {

        cancelCheckout.addEventListener(
            "click",
            () => {

                if (checkoutModal) {

                    checkoutModal.classList.remove(
                        "show"
                    );

                }

            }
        );

    }


    function performCheckout() {

        isCheckedIn = false;

        updateCheckInState();


        if (checkoutModal) {

            checkoutModal.classList.remove(
                "show"
            );

        }


        alert(
            "Check-out completed successfully."
        );

    }


    /* =====================================================
       CLOSE MODAL WHEN CLICKING OUTSIDE
    ===================================================== */

    if (checkoutModal) {

        checkoutModal.addEventListener(
            "click",
            event => {

                if (
                    event.target === checkoutModal
                ) {

                    checkoutModal.classList.remove(
                        "show"
                    );

                }

            }
        );

    }


    /* =====================================================
       ESC KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                checkoutModal
            ) {

                checkoutModal.classList.remove(
                    "show"
                );

            }

        }
    );


    /* =====================================================
       VISITOR WEBSITE
    ===================================================== */

    const visitorWebsiteButton =
        document.getElementById(
            "visitorWebsiteButton"
        );


    if (visitorWebsiteButton) {

        visitorWebsiteButton.addEventListener(
            "click",
            () => {

                window.location.href =
                    "index.html";

            }
        );

    }


    /* =====================================================
       INITIAL UI STATE
    ===================================================== */

    console.log(
        "Catherine's Guest Dashboard initialized."
    );

});