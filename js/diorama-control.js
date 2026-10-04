"use strict";


document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* =================================================
           REAL-TIME SYNC
        ================================================== */

        const syncToggle =
            document.getElementById(
                "syncToggle"
            );


        const latencyText =
            document.querySelector(
                ".latency"
            );


        if (syncToggle) {

            syncToggle.addEventListener(
                "click",
                () => {

                    syncToggle.classList.toggle(
                        "active"
                    );


                    const isActive =
                        syncToggle.classList.contains(
                            "active"
                        );


                    const trayStatus =
                        document.querySelector(
                            ".tray-status strong"
                        );


                    if (trayStatus) {

                        trayStatus.textContent =
                            isActive
                                ? "ARMED"
                                : "STANDBY";

                    }


                    if (latencyText) {

                        latencyText.textContent =
                            isActive
                                ? "14ms"
                                : "—";

                    }

                }
            );

        }


        /* =================================================
           VILLA BRIGHTNESS
        ================================================== */

        const villaBrightness =
            document.getElementById(
                "villaBrightness"
            );


        const brightnessValue =
            document.getElementById(
                "brightnessValue"
            );


        if (
            villaBrightness &&
            brightnessValue
        ) {

            villaBrightness.addEventListener(
                "input",
                () => {

                    brightnessValue.textContent =
                        `${villaBrightness.value}%`;

                }
            );

        }


        /* =================================================
           BALCONY BRIGHTNESS
        ================================================== */

        const balconyBrightness =
            document.getElementById(
                "balconyBrightness"
            );


        const balconyValue =
            document.getElementById(
                "balconyValue"
            );


        if (
            balconyBrightness &&
            balconyValue
        ) {

            balconyBrightness.addEventListener(
                "input",
                () => {

                    balconyValue.textContent =
                        `${balconyBrightness.value}%`;

                }
            );

        }


        /* =================================================
           COLOR TEMPERATURE
        ================================================== */

        const temperatureButtons =
            document.querySelectorAll(
                ".temperature-button"
            );


        temperatureButtons.forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {


                        temperatureButtons.forEach(
                            item => {

                                item.classList.remove(
                                    "active"
                                );

                            }
                        );


                        button.classList.add(
                            "active"
                        );


                        const temp =
                            button.dataset.temp;


                        showToast(
                            `Cottage lighting set to ${temp}.`
                        );

                    }
                );

            }
        );


        /* =================================================
           GENERIC TOGGLES
        ================================================== */

        const toggleButtons =
            document.querySelectorAll(
                "[data-toggle]"
            );


        toggleButtons.forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        button.classList.toggle(
                            "active"
                        );


                        const target =
                            button.dataset.toggle;


                        const enabled =
                            button.classList.contains(
                                "active"
                            );


                        const labels = {

                            roofline:
                                "Roofline Accent Glow",

                            pump:
                                "Underwater Micro-Pump",

                            bridge:
                                "Arched Bridge LEDs",

                            strobe:
                                "Skydeck Twilight Strobes"

                        };


                        showToast(
                            `${labels[target] || "Control"} ${
                                enabled
                                    ? "enabled"
                                    : "disabled"
                            }.`
                        );

                    }
                );

            }
        );


        /* =================================================
           WELCOME CHIME
        ================================================== */

        const testChime =
            document.getElementById(
                "testChime"
            );


        if (testChime) {

            testChime.addEventListener(
                "click",
                () => {


                    const original =
                        testChime.innerHTML;


                    testChime.innerHTML =
                        `
                        <i class="fa-solid fa-volume-high"></i>
                        Playing...
                        `;


                    testChime.disabled =
                        true;


                    showToast(
                        "Welcome chime sequence triggered."
                    );


                    window.setTimeout(
                        () => {

                            testChime.innerHTML =
                                original;

                            testChime.disabled =
                                false;

                        },
                        1600
                    );

                }
            );

        }


        /* =================================================
           POOL COLORS
        ================================================== */

        const poolColors =
            document.querySelectorAll(
                ".pool-color"
            );


        poolColors.forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {


                        poolColors.forEach(
                            item => {

                                item.classList.remove(
                                    "active"
                                );

                            }
                        );


                        button.classList.add(
                            "active"
                        );


                        showToast(
                            `Pool lighting changed to ${button.dataset.color}.`
                        );

                    }
                );

            }
        );


        /* =================================================
           WAVE CADENCE
        ================================================== */

        const radioOptions =
            document.querySelectorAll(
                ".radio-option"
            );


        radioOptions.forEach(
            option => {

                const input =
                    option.querySelector(
                        "input"
                    );


                if (!input) {
                    return;
                }


                input.addEventListener(
                    "change",
                    () => {

                        radioOptions.forEach(
                            item => {

                                item.classList.remove(
                                    "active"
                                );

                            }
                        );


                        option.classList.add(
                            "active"
                        );


                        showToast(
                            `Pool cadence updated.`
                        );

                    }
                );

            }
        );


        /* =================================================
           BEACON RPM
        ================================================== */

        const beaconButtons =
            document.querySelectorAll(
                ".beacon-options button"
            );


        beaconButtons.forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {


                        beaconButtons.forEach(
                            item => {

                                item.classList.remove(
                                    "active"
                                );

                            }
                        );


                        button.classList.add(
                            "active"
                        );


                        const rpm =
                            button.dataset.rpm;


                        const sidebarBeacon =
                            document.querySelector(
                                ".admin-beacon strong"
                            );


                        if (sidebarBeacon) {

                            sidebarBeacon.textContent =
                                `Sweeping ${rpm} RPM`;

                        }


                        const overviewRPM =
                            document.querySelector(
                                ".status-pill.teal"
                            );


                        if (overviewRPM) {

                            overviewRPM.innerHTML =
                                `
                                <i></i>
                                Lighthouse ${rpm} RPM
                                `;

                        }


                        showToast(
                            `Lighthouse beacon set to ${rpm} RPM.`
                        );

                    }
                );

            }
        );


        /* =================================================
           RFID KEYCARD
        ================================================== */

        const simulateKeycard =
            document.getElementById(
                "simulateKeycard"
            );


        if (simulateKeycard) {

            simulateKeycard.addEventListener(
                "click",
                () => {


                    const original =
                        simulateKeycard.innerHTML;


                    simulateKeycard.innerHTML =
                        `
                        <i class="fa-solid fa-circle-check"></i>
                        Keycard Tap Verified
                        `;


                    simulateKeycard.disabled =
                        true;


                    showToast(
                        "RFID keycard handshake verified for Cottage 2."
                    );


                    window.setTimeout(
                        () => {

                            simulateKeycard.innerHTML =
                                original;

                            simulateKeycard.disabled =
                                false;

                        },
                        2200
                    );

                }
            );

        }


        /* =================================================
           RELEASE CONTROL
        ================================================== */

        const releaseControl =
            document.getElementById(
                "releaseControl"
            );


        if (releaseControl) {

            releaseControl.addEventListener(
                "click",
                () => {


                    const confirmed =
                        window.confirm(
                            "Release Diorama Control and return all active controls to standby?"
                        );


                    if (!confirmed) {
                        return;
                    }


                    document
                        .querySelectorAll(
                            ".small-toggle.active"
                        )
                        .forEach(
                            button => {

                                button.classList.remove(
                                    "active"
                                );

                            }
                        );


                    if (syncToggle) {

                        syncToggle.classList.remove(
                            "active"
                        );

                    }


                    showToast(
                        "Diorama control released. System returned to standby."
                    );

                }
            );

        }


        /* =================================================
           LOGOUT
        ================================================== */

        const logoutButton =
            document.getElementById(
                "logoutButton"
            );


        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                () => {


                    const confirmed =
                        window.confirm(
                            "Are you sure you want to log out?"
                        );


                    if (!confirmed) {
                        return;
                    }


                    localStorage.removeItem(
                        "isLoggedIn"
                    );

                    localStorage.removeItem(
                        "guestEmail"
                    );

                    localStorage.removeItem(
                        "guestName"
                    );


                    window.location.href =
                        "index.html";

                }
            );

        }


        /* =================================================
           TOAST
        ================================================== */

        function showToast(message) {

            let toast =
                document.querySelector(
                    ".control-toast"
                );


            if (!toast) {

                toast =
                    document.createElement(
                        "div"
                    );

                toast.className =
                    "control-toast";


                document.body.appendChild(
                    toast
                );

            }


            toast.textContent =
                message;


            toast.classList.add(
                "show"
            );


            window.clearTimeout(
                toast.hideTimer
            );


            toast.hideTimer =
                window.setTimeout(
                    () => {

                        toast.classList.remove(
                            "show"
                        );

                    },
                    2200
                );

        }


        console.log(
            "Diorama Overrides initialized."
        );

    }
);