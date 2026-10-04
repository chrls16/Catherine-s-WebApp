"use strict";


document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* =================================================
           SEARCH
        ================================================== */

        const searchInput =
            document.getElementById(
                "searchInput"
            );


        const reservationRows =
            Array.from(
                document.querySelectorAll(
                    ".reservation-row"
                )
            );


        function applyFilters() {

            const searchTerm =
                searchInput
                    ? searchInput.value
                        .trim()
                        .toLowerCase()
                    : "";


            const selectedFacility =
                document
                    .querySelector(
                        ".filter-chip.active"
                    )
                    ?.dataset.facility ||
                "all";


            const selectedStatus =
                document.getElementById(
                    "statusFilter"
                )?.value ||
                "all";


            reservationRows.forEach(
                row => {


                    const rowText =
                        row.textContent
                            .toLowerCase();


                    const rowFacilities =
                        (
                            row.dataset.facility ||
                            ""
                        )
                            .toLowerCase()
                            .split(" ");


                    const rowStatus =
                        row.dataset.status ||
                        "";


                    const matchesSearch =
                        !searchTerm ||
                        rowText.includes(
                            searchTerm
                        );


                    const matchesFacility =
                        selectedFacility === "all" ||
                        rowFacilities.includes(
                            selectedFacility
                        );


                    const matchesStatus =
                        selectedStatus === "all" ||
                        rowStatus === selectedStatus;


                    row.style.display =
                        matchesSearch &&
                        matchesFacility &&
                        matchesStatus
                            ? "grid"
                            : "none";

                }
            );

        }


        if (searchInput) {

            searchInput.addEventListener(
                "input",
                applyFilters
            );

        }


        /* =================================================
           DATE FILTERS
        ================================================== */

        const dateFilters =
            document.querySelectorAll(
                ".date-filter"
            );


        dateFilters.forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        dateFilters.forEach(
                            item => {

                                item.classList.remove(
                                    "active"
                                );

                            }
                        );


                        button.classList.add(
                            "active"
                        );

                        applyFilters();

                    }
                );

            }
        );


        /* =================================================
           FACILITY FILTERS
        ================================================== */

        const facilityFilters =
            document.querySelectorAll(
                ".filter-chip"
            );


        facilityFilters.forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        facilityFilters.forEach(
                            item => {

                                item.classList.remove(
                                    "active"
                                );

                            }
                        );


                        button.classList.add(
                            "active"
                        );


                        applyFilters();

                    }
                );

            }
        );


        /* =================================================
           STATUS FILTER
        ================================================== */

        const statusFilter =
            document.getElementById(
                "statusFilter"
            );


        if (statusFilter) {

            statusFilter.addEventListener(
                "change",
                applyFilters
            );

        }


        /* =================================================
           EXPORT CSV
        ================================================== */

        const exportButton =
            document.getElementById(
                "exportButton"
            );


        if (exportButton) {

            exportButton.addEventListener(
                "click",
                () => {


                    const visibleRows =
                        reservationRows.filter(
                            row =>
                                row.style.display !==
                                "none"
                        );


                    const csvRows = [];


                    csvRows.push(
                        [
                            "Booking Reference",
                            "Guest",
                            "Assignment",
                            "Status",
                            "Amount"
                        ].join(",")
                    );


                    visibleRows.forEach(
                        row => {


                            const booking =
                                row.querySelector(
                                    ".booking-ref strong"
                                )
                                    ?.textContent
                                    .trim() ||
                                "";


                            const guest =
                                row.querySelector(
                                    ".guest-details strong"
                                )
                                    ?.textContent
                                    .replace(
                                        /\s+/g,
                                        " "
                                    )
                                    .trim() ||
                                "";


                            const assignment =
                                row.querySelector(
                                    ".assignment strong"
                                )
                                    ?.textContent
                                    .replace(
                                        /\s+/g,
                                        " "
                                    )
                                    .trim() ||
                                "";


                            const status =
                                row.querySelector(
                                    ".checkin-state"
                                )
                                    ?.textContent
                                    .replace(
                                        /\s+/g,
                                        " "
                                    )
                                    .trim() ||
                                "";


                            const amount =
                                row.querySelector(
                                    ".folio strong"
                                )
                                    ?.textContent
                                    .trim() ||
                                "";


                            csvRows.push(
                                [
                                    `"${booking}"`,
                                    `"${guest}"`,
                                    `"${assignment}"`,
                                    `"${status}"`,
                                    `"${amount}"`
                                ].join(",")
                            );

                        }
                    );


                    const csv =
                        csvRows.join("\n");


                    const blob =
                        new Blob(
                            [csv],
                            {
                                type:
                                    "text/csv;charset=utf-8;"
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
                        "catherines-master-reservations.csv";


                    document.body.appendChild(
                        link
                    );


                    link.click();


                    link.remove();


                    URL.revokeObjectURL(
                        url
                    );

                }
            );

        }


        /* =================================================
           NEW WALK-IN
        ================================================== */

        const walkinButton =
            document.getElementById(
                "walkinButton"
            );


        if (walkinButton) {

            walkinButton.addEventListener(
                "click",
                () => {

                    const confirmed =
                        window.confirm(
                            "Create a new walk-in reservation?"
                        );


                    if (!confirmed) {
                        return;
                    }


                    window.location.href =
                        "reservation.html";

                }
            );

        }


        /* =================================================
           RESERVATION ROW ACTIONS
        ================================================== */

        const quickCheckinButtons =
            document.querySelectorAll(
                ".quick-checkin"
            );


        quickCheckinButtons.forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const row =
                            button.closest(
                                ".reservation-row"
                            );


                        if (!row) {
                            return;
                        }


                        const booking =
                            row.querySelector(
                                ".booking-ref strong"
                            )
                                ?.textContent
                                .trim();


                        window.alert(
                            `Quick check-in opened for ${booking}.`
                        );

                    }
                );

            }
        );


        /* =================================================
           VIEW / ACTION BUTTONS
        ================================================== */

        const iconActions =
            document.querySelectorAll(
                ".icon-action"
            );


        iconActions.forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const row =
                            button.closest(
                                ".reservation-row"
                            );


                        const booking =
                            row?.querySelector(
                                ".booking-ref strong"
                            )
                                ?.textContent
                                .trim() ||
                            "reservation";


                        window.alert(
                            `Reservation actions opened for ${booking}.`
                        );

                    }
                );

            }
        );


        /* =================================================
           CHECKOUT
        ================================================== */

        const checkoutButtons =
            document.querySelectorAll(
                ".checkout-action"
            );


        checkoutButtons.forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const row =
                            button.closest(
                                ".reservation-row"
                            );


                        const guest =
                            row?.querySelector(
                                ".guest-details strong"
                            )
                                ?.textContent
                                .replace(
                                    /\s+/g,
                                    " "
                                )
                                .trim() ||
                            "guest";


                        const confirmed =
                            window.confirm(
                                `Check out ${guest}?`
                            );


                        if (!confirmed) {
                            return;
                        }


                        row.style.opacity =
                            "0.45";


                        button.textContent =
                            "CHECKED OUT";


                        button.disabled =
                            true;

                    }
                );

            }
        );


        /* =================================================
           INTERNAL TABS
        ================================================== */

        const tabs =
            document.querySelectorAll(
                ".reservation-tab"
            );


        tabs.forEach(
            tab => {

                tab.addEventListener(
                    "click",
                    () => {


                        const targetId =
                            tab.dataset.target;


                        tabs.forEach(
                            item => {

                                item.classList.remove(
                                    "active"
                                );

                            }
                        );


                        tab.classList.add(
                            "active"
                        );


                        if (!targetId) {
                            return;
                        }


                        const target =
                            document.getElementById(
                                targetId
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
           INITIAL FILTER
        ================================================== */

        applyFilters();


        console.log(
            "Master Reservations initialized."
        );

    }
);