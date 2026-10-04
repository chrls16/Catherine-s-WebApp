"use strict";


/* =========================================================
   CATHERINE'S ADMIN DASHBOARD
========================================================= */


document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* =================================================
           NAVIGATION
        ================================================== */

        const adminNavItems =
            document.querySelectorAll(
                ".admin-nav-item"
            );


        adminNavItems.forEach(
            item => {

                item.addEventListener(
                    "click",
                    () => {


                        const link =
                            item.dataset.link;


                        /*
                         * Pages that already exist
                         */

                        if (link) {

                            window.location.href =
                                link;

                            return;

                        }


                        /*
                         * Local admin sections
                         */

                        const section =
                            item.dataset.section;


                        if (!section) {
                            return;
                        }


                        adminNavItems.forEach(
                            nav => {

                                nav.classList.remove(
                                    "active"
                                );

                            }
                        );


                        item.classList.add(
                            "active"
                        );


                        if (
                            section === "overrides"
                        ) {

                            scrollToSection(
                                "overrideSection"
                            );

                        }


                        if (
                            section === "sensors"
                        ) {

                            scrollToSection(
                                "sensorSection"
                            );

                        }


                        if (
                            section === "demo"
                        ) {

                            scrollToSection(
                                "demoSection"
                            );

                        }


                        if (
                            section === "overview"
                        ) {

                            scrollToSection(
                                "overviewSection"
                            );

                        }

                    }
                );

            }
        );


        /* =================================================
           SECTION TABS
        ================================================== */

        const sectionTabs =
            document.querySelectorAll(
                ".section-tab"
            );


        sectionTabs.forEach(
            tab => {

                tab.addEventListener(
                    "click",
                    () => {

                        sectionTabs.forEach(
                            item => {

                                item.classList.remove(
                                    "active"
                                );

                            }
                        );


                        tab.classList.add(
                            "active"
                        );


                        const target =
                            document.getElementById(
                                tab.dataset.target
                            );


                        if (target) {

                            target.scrollIntoView(
                                {
                                    behavior:
                                        "smooth",

                                    block:
                                        "start"
                                }
                            );

                        }

                    }
                );

            }
        );


        /* =================================================
           ATMOSPHERE PRESETS
        ================================================== */

        const atmosphereButtons =
            document.querySelectorAll(
                ".atmosphere-button"
            );


        const activePreset =
            document.getElementById(
                "activePreset"
            );


        atmosphereButtons.forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        atmosphereButtons.forEach(
                            item => {

                                item.classList.remove(
                                    "active"
                                );

                            }
                        );


                        button.classList.add(
                            "active"
                        );


                        const atmosphere =
                            button.dataset.atmosphere;


                        if (activePreset) {

                            activePreset.textContent =
                                `Active: ${atmosphere}`;

                        }

                    }
                );

            }
        );


        /* =================================================
           DAY / NIGHT MODE
        ================================================== */

        const dayMode =
            document.getElementById(
                "dayMode"
            );


        const nightMode =
            document.getElementById(
                "nightMode"
            );


        if (dayMode && nightMode) {

            dayMode.addEventListener(
                "click",
                () => {

                    dayMode.classList.add(
                        "active"
                    );

                    nightMode.classList.remove(
                        "active"
                    );

                    document.body.classList.remove(
                        "night-mode"
                    );

                }
            );


            nightMode.addEventListener(
                "click",
                () => {

                    nightMode.classList.add(
                        "active"
                    );

                    dayMode.classList.remove(
                        "active"
                    );

                    document.body.classList.add(
                        "night-mode"
                    );

                }
            );

        }


        /* =================================================
           DARK RESORT KILL
        ================================================== */

        const killButton =
            document.getElementById(
                "killButton"
            );


        if (killButton) {

            killButton.addEventListener(
                "click",
                () => {

                    const confirmed =
                        window.confirm(
                            "WARNING: This will simulate a full resort hardware shutdown. Continue?"
                        );


                    if (!confirmed) {
                        return;
                    }


                    document.body.classList.add(
                        "resort-killed"
                    );


                    killButton.textContent =
                        "RESORT OFFLINE";


                    alert(
                        "Demo mode: resort hardware state set to OFFLINE."
                    );

                }
            );

        }


        /* =================================================
           EMERGENCY RESET
        ================================================== */

        const emergencyButton =
            document.getElementById(
                "emergencyButton"
            );


        if (emergencyButton) {

            emergencyButton.addEventListener(
                "click",
                () => {

                    const confirmed =
                        window.confirm(
                            "Perform simulated emergency hardware reset?"
                        );


                    if (!confirmed) {
                        return;
                    }


                    alert(
                        "Demo mode: ESP32 hardware reset command issued."
                    );

                }
            );

        }


        /* =================================================
           ENTRANCE GATE
        ================================================== */

        const openGate =
            document.getElementById(
                "openGate"
            );


        const closeGate =
            document.getElementById(
                "closeGate"
            );


        if (openGate) {

            openGate.addEventListener(
                "click",
                () => {

                    alert(
                        "Demo: Entrance gate OPEN command sent."
                    );

                }
            );

        }


        if (closeGate) {

            closeGate.addEventListener(
                "click",
                () => {

                    alert(
                        "Demo: Entrance gate CLOSE command sent."
                    );

                }
            );

        }


        /* =================================================
           WELCOME AUDIO
        ================================================== */

        const welcomeAudio =
            document.getElementById(
                "welcomeAudio"
            );


        if (welcomeAudio) {

            welcomeAudio.addEventListener(
                "click",
                () => {

                    alert(
                        "Demo: Resort welcome audio activated."
                    );

                }
            );

        }


        /* =================================================
           TOGGLE SWITCHES
        ================================================== */

        const switches =
            document.querySelectorAll(
                ".switch"
            );


        switches.forEach(
            toggle => {

                toggle.addEventListener(
                    "click",
                    () => {

                        toggle.classList.toggle(
                            "active"
                        );

                    }
                );

            }
        );


        /* =================================================
           SHUTTLE
        ================================================== */

        const carForward =
            document.getElementById(
                "carForward"
            );


        const carStop =
            document.getElementById(
                "carStop"
            );


        const carBackward =
            document.getElementById(
                "carBackward"
            );


        const autoDock =
            document.getElementById(
                "autoDock"
            );


        if (carForward) {

            carForward.addEventListener(
                "click",
                () => {

                    alert(
                        "Demo: Shuttle command FORWARD."
                    );

                }
            );

        }


        if (carStop) {

            carStop.addEventListener(
                "click",
                () => {

                    alert(
                        "Demo: Shuttle command STOP."
                    );

                }
            );

        }


        if (carBackward) {

            carBackward.addEventListener(
                "click",
                () => {

                    alert(
                        "Demo: Shuttle command BACKWARD."
                    );

                }
            );

        }


        if (autoDock) {

            autoDock.addEventListener(
                "click",
                () => {

                    alert(
                        "Demo: Shuttle automatic return-to-dock enabled."
                    );

                }
            );

        }


        /* =================================================
           THROTTLE
        ================================================== */

        const throttleSlider =
            document.getElementById(
                "throttleSlider"
            );


        const throttleValue =
            document.getElementById(
                "throttleValue"
            );


        if (throttleSlider) {

            throttleSlider.addEventListener(
                "input",
                () => {

                    if (throttleValue) {

                        throttleValue.textContent =
                            `${throttleSlider.value}%`;

                    }

                }
            );

        }


        /* =================================================
           COTTAGE RESET / ACTIVATE ALL
        ================================================== */

        const activateAllCottages =
            document.getElementById(
                "activateAllCottages"
            );


        const resetCottages =
            document.getElementById(
                "resetCottages"
            );


        const cottageButtons =
            document.querySelectorAll(
                ".cottage-controls button"
            );


        cottageButtons.forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        cottageButtons.forEach(
                            item => {

                                item.classList.remove(
                                    "active"
                                );

                            }
                        );


                        button.classList.add(
                            "active"
                        );

                    }
                );

            }
        );


        if (activateAllCottages) {

            activateAllCottages.addEventListener(
                "click",
                () => {

                    cottageButtons.forEach(
                        button => {

                            button.classList.add(
                                "active"
                            );

                        }
                    );

                }
            );

        }


        if (resetCottages) {

            resetCottages.addEventListener(
                "click",
                () => {

                    cottageButtons.forEach(
                        button => {

                            button.classList.remove(
                                "active"
                            );

                        }
                    );

                }
            );

        }


        /* =================================================
           RGB POOL COLORS
        ================================================== */

        const rgbButtons =
            document.querySelectorAll(
                ".rgb-color"
            );


        rgbButtons.forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        rgbButtons.forEach(
                            item => {

                                item.classList.remove(
                                    "active"
                                );

                            }
                        );


                        button.classList.add(
                            "active"
                        );

                    }
                );

            }
        );


        /* =================================================
           POOL BRIGHTNESS
        ================================================== */

        const poolBrightnessSlider =
            document.querySelector(
                ".brightness-box input[type='range']"
            );


        const poolBrightness =
            document.getElementById(
                "poolBrightness"
            );


        if (poolBrightnessSlider) {

            poolBrightnessSlider.addEventListener(
                "input",
                () => {

                    if (poolBrightness) {

                        poolBrightness.textContent =
                            `${poolBrightnessSlider.value}%`;

                    }

                }
            );

        }


        /* =================================================
           EVENT MODE
        ================================================== */

        const eventModeButton =
            document.getElementById(
                "eventModeButton"
            );


        if (eventModeButton) {

            eventModeButton.addEventListener(
                "click",
                () => {

                    const isActive =
                        eventModeButton.classList.toggle(
                            "active"
                        );


                    eventModeButton.textContent =
                        isActive
                            ? "EVENT MODE ACTIVE"
                            : "ACTIVATE EVENT MODE";

                }
            );

        }


        /* =================================================
           BEACON
        ================================================== */

        const beaconRotateButton =
            document.getElementById(
                "beaconRotateButton"
            );


        if (beaconRotateButton) {

            beaconRotateButton.addEventListener(
                "click",
                () => {

                    beaconRotateButton.classList.toggle(
                        "active"
                    );

                }
            );

        }


        /* =================================================
           KTV MUTE
        ================================================== */

        const ktvMuteButton =
            document.getElementById(
                "ktvMuteButton"
            );


        if (ktvMuteButton) {

            ktvMuteButton.addEventListener(
                "click",
                () => {

                    ktvMuteButton.classList.toggle(
                        "active"
                    );

                    ktvMuteButton.innerHTML =
                        ktvMuteButton.classList.contains(
                            "active"
                        )
                            ? '<i class="fa-solid fa-volume-xmark"></i> KTV UNMUTE'
                            : '<i class="fa-solid fa-volume-xmark"></i> KTV MUTE';

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
           PLACEHOLDER BUTTONS
        ================================================== */

        const linkButtons =
            document.querySelectorAll(
                "[data-link]"
            );


        linkButtons.forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const link =
                            button.dataset.link;


                        if (link) {

                            window.location.href =
                                link;

                        }

                    }
                );

            }
        );


        /* =================================================
           HELPER
        ================================================== */

        function scrollToSection(
            id
        ) {

            const element =
                document.getElementById(id);


            if (!element) {
                return;
            }


            element.scrollIntoView(
                {
                    behavior:
                        "smooth",

                    block:
                        "start"
                }
            );

        }


        console.log(
            "Catherine's Admin Command Center initialized."
        );

    }
);