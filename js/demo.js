"use strict";


document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* =================================================
           DEMO DATA
        ================================================== */

        const steps = [

            {
                number: 1,
                title:
                    "Resort Awakening & Dawn Pathway Glow",
                description:
                    "Ground bollards warm ramp 0–100% via PWM Node Alpha (Diorama Perimeters).",
                duration:
                    "15s"
            },

            {
                number: 2,
                title:
                    "Entrance Gate Motor Actuation",
                description:
                    "MG996R Servo opens gate 90°, Welcome Chime sound via DFPlayer Audio Unit.",
                duration:
                    "20s"
            },

            {
                number: 3,
                title:
                    "Miniature Shuttle Dispatch to Station 1",
                description:
                    "L298N DC motor accelerates, Hall magnetic sensor docking at Welcome Pavilion.",
                duration:
                    "30s"
            },

            {
                number: 4,
                title:
                    "Cottage 1 & 2 Guest Welcome Sequence",
                description:
                    "Warm 2700K lighting pulse inside VIP beachfront villas.",
                duration:
                    "25s"
            },

            {
                number: 5,
                title:
                    "Cottage 3 & 4 Balcony Ambiance",
                description:
                    "Balcony micro-string LEDs fade-in with soft oceanic sea breeze accent.",
                duration:
                    "20s"
            },

            {
                number: 6,
                title:
                    "Shoreline Promenade Sunrise Illumination",
                description:
                    "Amber pathway wave cascading down Bagasbas coastline board-walk.",
                duration:
                    "25s"
            },

            {
                number: 7,
                title:
                    "Lagoon Chromatic Wave & Underwater Aeration",
                description:
                    "WS2812B Pacific Blue wave sequence +12V DC mini pump dual-manifold micro-bubble aeration.",
                duration:
                    "30s",

                active: true,

                hardware: {

                    target:
                        "Lagoon Node #03",

                    relay:
                        "12.4V @ 1.8A",

                    chroma:
                        "#0099FF Cyan Wave",

                    pulse:
                        "85% PWM (Sine)"

                }

            },

            {
                number: 8,
                title:
                    "Arched Wooden Bridge Footlight Accent",
                description:
                    "Cyan bridge deck recessed micro-LEDs illuminate over diorama lagoon stream.",
                duration:
                    "20s"
            },

            {
                number: 9,
                title:
                    "Grand Celebration Pavilion Crystal Chandelier",
                description:
                    "Dual SSR Relay trigger warm crystal chandelier cascade inside the event ballroom.",
                duration:
                    "25s"
            },

            {
                number: 10,
                title:
                    "Grand Pavilion DMX Stage Wash",
                description:
                    "Dynamic RGB concert-grade stage sweeps across the outdoor amphitheater.",
                duration:
                    "30s"
            },

            {
                number: 11,
                title:
                    "Lighthouse KTV Sound & Visual Preview",
                description:
                    "Party audio track + ceiling rotating optical prism disco ring activation.",
                duration:
                    "25s"
            },

            {
                number: 12,
                title:
                    "Lighthouse Tower Motor Acceleration",
                description:
                    "NEMA17 stepper motor ramps to continuous smooth 4.2 RPM beacon rotation.",
                duration:
                    "30s"
            },

            {
                number: 13,
                title:
                    "Bagasbas Lighthouse High-Lux Night Beacon Sweep",
                description:
                    "10W Cree High-Power LED fires full beam across diorama ocean horizon.",
                duration:
                    "35s"
            },

            {
                number: 14,
                title:
                    "Twilight Sunset Synchronized Symphony",
                description:
                    "All 14 addressable light channels transition together into 2200K Candle Amber glow.",
                duration:
                    "30s"
            },

            {
                number: 15,
                title:
                    "Grand Finale Showcase & Sanctuary Standby",
                description:
                    "Full diorama architectural crescendo with pulsing resort signature gold accent & peaceful idle.",
                duration:
                    "40s"
            }

        ];


        let activeStep =
            7;


        let loopEnabled =
            true;


        let isRunning =
            false;


        let isPaused =
            false;


        let speed =
            1;


        let timer =
            0;


        let interval =
            null;



        /* =================================================
           ELEMENTS
        ================================================== */

        const stepsList =
            document.getElementById(
                "stepsList"
            );


        const currentStepNumber =
            document.getElementById(
                "currentStepNumber"
            );


        const currentStepName =
            document.getElementById(
                "currentStepName"
            );


        const sequenceProgress =
            document.getElementById(
                "sequenceProgress"
            );


        const elapsedTime =
            document.getElementById(
                "elapsedTime"
            );


        const startDemo =
            document.getElementById(
                "startDemo"
            );


        const pauseDemo =
            document.getElementById(
                "pauseDemo"
            );


        const resetDemo =
            document.getElementById(
                "resetDemo"
            );


        const loopToggle =
            document.getElementById(
                "loopToggle"
            );


        const emergencyButton =
            document.getElementById(
                "emergencyButton"
            );


        const testStep =
            document.getElementById(
                "testStep"
            );


        /* =================================================
           RENDER STEPS
        ================================================== */

        function renderSteps() {

            if (!stepsList) {
                return;
            }


            stepsList.innerHTML =
                "";


            steps.forEach(
                step => {

                    const card =
                        document.createElement(
                            "article"
                        );


                    const state =
                        step.number < activeStep
                            ? "completed"
                            : step.number === activeStep
                                ? "active"
                                : "queued";


                    card.className =
                        `step-card ${state} clickable`;


                    card.dataset.step =
                        step.number;


                    if (state === "active") {

                        card.innerHTML =
                            createActiveStepMarkup(
                                step
                            );

                    } else {

                        card.innerHTML =
                            createCompactStepMarkup(
                                step,
                                state
                            );

                    }


                    stepsList.appendChild(
                        card
                    );

                }
            );


            attachStepEvents();

        }


        /* =================================================
           COMPACT STEP
        ================================================== */

        function createCompactStepMarkup(
            step,
            state
        ) {

            const isCompleted =
                state === "completed";


            const numberMarkup =
                isCompleted

                    ? `
                        <div class="step-number-circle">
                            <i class="fa-solid fa-check"></i>
                        </div>
                      `

                    : `
                        <div class="step-number-circle">
                            ${String(
                                step.number
                            ).padStart(
                                2,
                                "0"
                            )}
                        </div>
                      `;


            const stateText =
                isCompleted
                    ? "COMPLETED"
                    : step.number === activeStep + 1
                        ? "QUEUED (NEXT)"
                        : "QUEUED";


            return `

                <div class="step-summary">

                    ${numberMarkup}

                    <div class="step-summary-content">

                        <div class="step-meta">
                            STEP
                            ${String(
                                step.number
                            ).padStart(
                                2,
                                "0"
                            )}

                            <span>
                                •
                            </span>

                            Duration:
                            ${step.duration}
                        </div>


                        <div class="step-title">
                            ${step.title}
                        </div>


                        <div class="step-description">
                            ${step.description}
                        </div>

                    </div>


                    <span class="step-state">
                        ${stateText}
                    </span>


                    ${
                        !isCompleted
                            ? `
                                <i class="fa-solid fa-forward step-arrow"></i>
                              `
                            : `
                                <i class="fa-solid fa-rotate-right step-arrow"></i>
                              `
                    }

                </div>

            `;

        }


        /* =================================================
           ACTIVE STEP
        ================================================== */

        function createActiveStepMarkup(
            step
        ) {

            return `

                <div class="step-active-grid">


                    <div>


                        <div class="active-title-row">

                            <span class="active-step-badge">

                                STEP
                                ${String(
                                    step.number
                                ).padStart(
                                    2,
                                    "0"
                                )}

                            </span>


                            <span class="active-executing">

                                ACTIVE EXECUTING
                                •
                                ${step.duration}

                                <i class="active-dot"></i>

                            </span>

                        </div>


                        <h3 class="active-step-title">

                            ${step.title
                                .replace(
                                    " & ",
                                    " &amp; "
                                )}

                        </h3>


                        <p class="active-step-description">

                            ${step.description}

                        </p>

                    </div>



                    <div class="active-actions">


                        <button
                            type="button"
                            class="skip-button"
                            data-action="skip"
                        >

                            <i class="fa-solid fa-forward-step"></i>

                            SKIP
                            <br>
                            STEP

                        </button>


                        <button
                            type="button"
                            class="calibrate-button"
                            data-action="calibrate"
                        >

                            <i class="fa-solid fa-sliders"></i>

                            LIVE
                            <br>
                            CALIBRATE

                        </button>


                    </div>

                </div>



                <div class="hardware-details">


                    <div>

                        <span>
                            HARDWARE TARGET
                        </span>

                        <strong>
                            ${step.hardware?.target || "Resort Node #01"}
                        </strong>

                    </div>


                    <div>

                        <span>
                            SUBSEA RELAY
                        </span>

                        <strong>
                            <span
                                class="gold"
                            >
                                •
                            </span>

                            ${step.hardware?.relay || "12.0V @ 1.5A"}
                        </strong>

                    </div>


                    <div>

                        <span>
                            DMX CHROMA
                            <br>
                            TARGET
                        </span>

                        <strong>
                            ${step.hardware?.chroma || "#C99A45 Gold Wash"}
                        </strong>

                    </div>


                    <div>

                        <span>
                            PUMPING PULSE
                        </span>

                        <strong>
                            ${step.hardware?.pulse || "72% PWM (Sine)"}
                        </strong>

                    </div>


                </div>

            `;

        }


        /* =================================================
           STEP CLICK
        ================================================== */

        function attachStepEvents() {

            const cards =
                document.querySelectorAll(
                    ".step-card.clickable"
                );


            cards.forEach(
                card => {

                    card.addEventListener(
                        "click",
                        event => {


                            const actionButton =
                                event.target.closest(
                                    "[data-action]"
                                );


                            if (
                                actionButton
                            ) {

                                handleActiveAction(
                                    actionButton.dataset.action
                                );

                                return;

                            }


                            const selectedStep =
                                Number(
                                    card.dataset.step
                                );


                            activateStep(
                                selectedStep
                            );

                        }
                    );

                }
            );

        }


        /* =================================================
           ACTIVATE STEP
        ================================================== */

        function activateStep(
            stepNumber
        ) {

            if (
                stepNumber < 1 ||
                stepNumber > 15
            ) {

                return;

            }


            activeStep =
                stepNumber;


            timer =
                0;


            renderSteps();


            updateSequenceStatus();


            const activeCard =
                document.querySelector(
                    `.step-card[data-step="${stepNumber}"]`
                );


            if (activeCard) {

                activeCard.classList.add(
                    "flash"
                );


                activeCard.scrollIntoView(
                    {
                        behavior:
                            "smooth",
                        block:
                            "center"
                    }
                );

            }

        }


        /* =================================================
           STATUS
        ================================================== */

        function updateSequenceStatus() {

            const step =
                steps.find(
                    item =>
                        item.number === activeStep
                );


            if (!step) {
                return;
            }


            if (currentStepNumber) {

                currentStepNumber.textContent =
                    activeStep;

            }


            if (currentStepName) {

                currentStepName.textContent =
                    step.title;

            }


            const progress =
                Math.round(
                    (
                        (activeStep - 1) /
                        15
                    ) * 100
                );


            if (sequenceProgress) {

                sequenceProgress.style.width =
                    `${progress}%`;

            }

        }


        /* =================================================
           ACTIVE BUTTONS
        ================================================== */

        function handleActiveAction(
            action
        ) {


            if (
                action ===
                "skip"
            ) {

                if (
                    activeStep <
                    steps.length
                ) {

                    activateStep(
                        activeStep + 1
                    );

                }

                return;

            }


            if (
                action ===
                "calibrate"
            ) {

                showToast(
                    `Live calibration opened for Step ${activeStep}.`
                );

            }

        }


        /* =================================================
           START
        ================================================== */

        if (startDemo) {

            startDemo.addEventListener(
                "click",
                () => {

                    isRunning =
                        true;

                    isPaused =
                        false;


                    startTimer();


                    showToast(
                        "15-step demo sequence started."
                    );

                }
            );

        }


        /* =================================================
           TIMER
        ================================================== */

        function startTimer() {

            if (interval) {

                clearInterval(
                    interval
                );

            }


            interval =
                setInterval(
                    () => {


                        if (
                            !isRunning ||
                            isPaused
                        ) {

                            return;

                        }


                        timer +=
                            speed;


                        updateTimer();


                        if (
                            timer >=
                            30
                        ) {

                            timer =
                                0;


                            if (
                                activeStep <
                                steps.length
                            ) {

                                activateStep(
                                    activeStep + 1
                                );

                            } else if (
                                loopEnabled
                            ) {

                                activateStep(
                                    1
                                );

                            } else {

                                isRunning =
                                    false;

                            }

                        }

                    },
                    1000
                );

        }


        function updateTimer() {

            const minutes =
                Math.floor(
                    timer / 60
                );


            const seconds =
                Math.floor(
                    timer % 60
                );


            if (elapsedTime) {

                elapsedTime.textContent =
                    `${String(
                        minutes
                    ).padStart(
                        2,
                        "0"
                    )}:${String(
                        seconds
                    ).padStart(
                        2,
                        "0"
                    )}`;

            }

        }


        /* =================================================
           PAUSE
        ================================================== */

        if (pauseDemo) {

            pauseDemo.addEventListener(
                "click",
                () => {

                    isPaused =
                        !isPaused;


                    pauseDemo.innerHTML =
                        isPaused

                            ? `
                                <i class="fa-solid fa-play"></i>
                                RESUME
                              `

                            : `
                                <i class="fa-solid fa-pause"></i>
                                PAUSE
                              `;

                }
            );

        }


        /* =================================================
           RESET
        ================================================== */

        if (resetDemo) {

            resetDemo.addEventListener(
                "click",
                () => {

                    isRunning =
                        false;

                    isPaused =
                        false;

                    timer =
                        0;

                    activeStep =
                        1;


                    pauseDemo.innerHTML =
                        `
                        <i class="fa-solid fa-pause"></i>
                        PAUSE
                        `;


                    if (elapsedTime) {

                        elapsedTime.textContent =
                            "00:00";

                    }


                    renderSteps();

                    updateSequenceStatus();


                    showToast(
                        "Demo sequence reset to idle."
                    );

                }
            );

        }


        /* =================================================
           LOOP
        ================================================== */

        if (loopToggle) {

            loopToggle.addEventListener(
                "click",
                () => {

                    loopEnabled =
                        !loopEnabled;


                    loopToggle.classList.toggle(
                        "active",
                        loopEnabled
                    );


                    loopToggle.innerHTML =
                        `
                        <i class="fa-solid fa-repeat"></i>

                        LOOP PLAYBACK:
                        ${loopEnabled
                            ? "ON"
                            : "OFF"
                        }
                        `;

                }
            );

        }


        /* =================================================
           SPEED
        ================================================== */

        const speedButtons =
            document.querySelectorAll(
                ".speed-button"
            );


        speedButtons.forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        speedButtons.forEach(
                            item => {

                                item.classList.remove(
                                    "active"
                                );

                            }
                        );


                        button.classList.add(
                            "active"
                        );


                        const selected =
                            button.dataset.speed;


                        speed =
                            selected === "1.5x"
                                ? 1.5
                                : selected === "2x"
                                    ? 2
                                    : 1;


                        showToast(
                            `Sequence speed set to ${selected}.`
                        );

                    }
                );

            }
        );


        /* =================================================
           TEST STEP
        ================================================== */

        if (testStep) {

            testStep.addEventListener(
                "click",
                () => {

                    showToast(
                        `Testing isolated actuator node for Step ${activeStep}.`
                    );

                }
            );

        }


        /* =================================================
           EMERGENCY STOP
        ================================================== */

        if (emergencyButton) {

            emergencyButton.addEventListener(
                "click",
                () => {

                    const confirmed =
                        window.confirm(
                            "EMERGENCY STOP: halt the automated diorama sequence?"
                        );


                    if (!confirmed) {

                        return;

                    }


                    isRunning =
                        false;

                    isPaused =
                        true;


                    if (interval) {

                        clearInterval(
                            interval
                        );

                    }


                    showToast(
                        "EMERGENCY STOP ACTIVE. Sequence halted."
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

        function showToast(
            message
        ) {

            let toast =
                document.querySelector(
                    ".demo-toast"
                );


            if (!toast) {

                toast =
                    document.createElement(
                        "div"
                    );

                toast.className =
                    "demo-toast";


                document.body.appendChild(
                    toast
                );

            }


            toast.textContent =
                message;


            toast.classList.add(
                "show"
            );


            clearTimeout(
                toast.timer
            );


            toast.timer =
                setTimeout(
                    () => {

                        toast.classList.remove(
                            "show"
                        );

                    },
                    2200
                );

        }


        /* =================================================
           INITIAL RENDER
        ================================================== */

        renderSteps();

        updateSequenceStatus();


    }
);