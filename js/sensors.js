"use strict";


document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* =================================================
           NODE SELECTION
        ================================================== */

        const nodeItems =
            document.querySelectorAll(
                ".node-item"
            );


        nodeItems.forEach(
            node => {

                node.addEventListener(
                    "click",
                    () => {

                        nodeItems.forEach(
                            item => {

                                item.classList.remove(
                                    "active"
                                );

                            }
                        );


                        node.classList.add(
                            "active"
                        );


                        addLog(
                            `[SENSOR] ${
                                node.dataset.node
                            } selected for diagnostics.`
                        );

                    }
                );

            }
        );


        /* =================================================
           TELEMETRY TABS
        ================================================== */

        const telemetryTabs =
            document.querySelectorAll(
                ".telemetry-tab"
            );


        telemetryTabs.forEach(
            tab => {

                tab.addEventListener(
                    "click",
                    () => {

                        telemetryTabs.forEach(
                            item => {

                                item.classList.remove(
                                    "active"
                                );

                            }
                        );


                        tab.classList.add(
                            "active"
                        );


                        addLog(
                            "[SYSTEM] Telemetry diagnostic sub-deck changed."
                        );

                    }
                );

            }
        );


        /* =================================================
           PING SIMULATION
        ================================================== */

        const pingValue =
            document.getElementById(
                "pingValue"
            );


        const updatesValue =
            document.querySelector(
                ".updates"
            );


        function updateTelemetry() {

            if (pingValue) {

                const ping =
                    Math.floor(
                        10 +
                        Math.random() * 6
                    );


                pingValue.textContent =
                    ping;

            }


            if (updatesValue) {

                const updates =
                    Math.floor(
                        58 +
                        Math.random() * 5
                    );


                updatesValue.textContent =
                    updates;

            }

        }


        window.setInterval(
            updateTelemetry,
            2500
        );


        /* =================================================
           CONSOLE
        ================================================== */

        const consoleBody =
            document.getElementById(
                "consoleBody"
            );


        const pauseStream =
            document.getElementById(
                "pauseStream"
            );


        const clearLog =
            document.getElementById(
                "clearLog"
            );


        const dumpJson =
            document.getElementById(
                "dumpJson"
            );


        let streamPaused =
            false;


        if (pauseStream) {

            pauseStream.addEventListener(
                "click",
                () => {

                    streamPaused =
                        !streamPaused;


                    pauseStream.innerHTML =
                        streamPaused

                            ? `
                                <i class="fa-solid fa-play"></i>
                                RESUME STREAM
                              `

                            : `
                                <i class="fa-solid fa-pause"></i>
                                PAUSE STREAM
                              `;


                    addLog(
                        streamPaused

                            ? "[SYSTEM] Serial telemetry stream paused."

                            : "[SYSTEM] Serial telemetry stream resumed."
                    );

                }
            );

        }


        if (clearLog) {

            clearLog.addEventListener(
                "click",
                () => {

                    if (!consoleBody) {
                        return;
                    }


                    consoleBody.innerHTML =
                        `
                        <div class="console-line highlight">
                            [SYSTEM]
                            Console cleared.
                            Awaiting new telemetry events...
                        </div>
                        `;

                }
            );

        }


        if (dumpJson) {

            dumpJson.addEventListener(
                "click",
                () => {

                    const telemetryData = {

                        timestamp:
                            new Date().toISOString(),

                        gateway: {

                            status:
                                "ACTIVE",

                            uptime:
                                "48h 12m",

                            mac:
                                "24:6F:28:AE:11:02",

                            address:
                                "ws://192.168.1.120:81"

                        },

                        environment: {

                            temperature:
                                28.4,

                            humidity:
                                76,

                            pressure:
                                1012.8,

                            lux:
                                412

                        },

                        power: {

                            twelveVolt:
                                12.18,

                            fiveVolt:
                                5.04,

                            threePointThreeVolt:
                                3.31

                        },

                        mesh: {

                            nodes:
                                9,

                            synced:
                                9,

                            packetLoss:
                                0

                        }

                    };


                    const blob =
                        new Blob(
                            [
                                JSON.stringify(
                                    telemetryData,
                                    null,
                                    4
                                )
                            ],
                            {
                                type:
                                    "application/json"
                            }
                        );


                    const url =
                        URL.createObjectURL(
                            blob
                        );


                    const link =
                        document.createElement(
                            "a"
                        );


                    link.href =
                        url;


                    link.download =
                        "bagasbas-telemetry.json";


                    document.body.appendChild(
                        link
                    );


                    link.click();

                    link.remove();

                    URL.revokeObjectURL(
                        url
                    );


                    addLog(
                        "[SYSTEM] Telemetry JSON dump generated."
                    );

                }
            );

        }


        /* =================================================
           CONSOLE FILTERS
        ================================================== */

        const consoleFilters =
            document.querySelectorAll(
                ".console-filter"
            );


        consoleFilters.forEach(
            filter => {

                filter.addEventListener(
                    "click",
                    () => {

                        consoleFilters.forEach(
                            item => {

                                item.classList.remove(
                                    "active"
                                );

                            }
                        );


                        filter.classList.add(
                            "active"
                        );


                        addLog(
                            `[FILTER] ${
                                filter.textContent.trim()
                            } selected.`
                        );

                    }
                );

            }
        );


        /* =================================================
           SIMULATED TELEMETRY
        ================================================== */

        const simulatedLogs = [

            "[ESP-NOW] Packet ACK received from Node_Pool: 0x06",

            "[INA219] Bus voltage=12.18V, Current=3412mA",

            "[NFC_RC522] Carrier stable on 13.56MHz RF field",

            "[STEPPER_A4988] Beacon Sweep Microstep sync verified",

            "[DHT22] Temperature=28.4°C, Humidity=76.2%",

            "[BMP280] Pressure=1012.8hPa, Stable Tide",

            "[ESP-NOW] Mesh heartbeat confirmed: 9/9 nodes online"

        ];


        let simulationIndex =
            0;


        function runTelemetrySimulation() {

            if (
                streamPaused ||
                !consoleBody
            ) {

                return;

            }


            const message =
                simulatedLogs[
                    simulationIndex %
                    simulatedLogs.length
                ];


            const now =
                new Date();


            const time =
                now.toLocaleTimeString(
                    "en-GB",
                    {
                        hour12:
                            false
                    }
                );


            addLog(
                `[${time}.000] ${message}`
            );


            simulationIndex++;

        }


        window.setInterval(
            runTelemetrySimulation,
            5000
        );


        /* =================================================
           ADD LOG
        ================================================== */

        function addLog(message) {

            if (!consoleBody) {
                return;
            }


            const line =
                document.createElement(
                    "div"
                );


            line.className =
                "console-line";


            line.textContent =
                message;


            consoleBody.appendChild(
                line
            );


            consoleBody.scrollTop =
                consoleBody.scrollHeight;


            /* Prevent unlimited demo-log growth */

            while (
                consoleBody.children.length >
                18
            ) {

                consoleBody.removeChild(
                    consoleBody.firstElementChild
                );

            }

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
           INITIALIZE
        ================================================== */

        updateTelemetry();


        console.log(
            "Sensors Telemetry initialized."
        );

    }
);