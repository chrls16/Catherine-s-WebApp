/* =====================================================
   EMAILJS CONFIGURATION FOR ADMIN NOTIFICATIONS
===================================================== */
const EMAILJS_CONFIG = {
    PUBLIC_KEY: "qiKerR2jT2TV2n4eO",
    SERVICE_ID: "service_cse4f86",
    TEMPLATE_ID: "template_97nryvr"
};

// Initialize EmailJS
if (typeof emailjs !== "undefined" && EMAILJS_CONFIG.PUBLIC_KEY) {
    try {
        emailjs.init({ publicKey: EMAILJS_CONFIG.PUBLIC_KEY });
    } catch (err) {
        console.error("EmailJS init error in admin-reservations.js:", err);
    }
}

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* =================================================
           DYNAMIC RESERVATION RENDERER FROM LOCALSTORAGE
        ================================================== */
        function loadDynamicReservations() {
            const container = document.getElementById("reservationsSection");
            if (!container) return;

            let history = [];
            try {
                const stored = localStorage.getItem("reservationHistory");
                if (stored) history = JSON.parse(stored);
            } catch (e) {
                console.error("Error reading reservationHistory", e);
            }

            if (!Array.isArray(history) || history.length === 0) return;

            // Remove existing dynamic rows if any
            const oldDynamic = container.querySelectorAll(".dynamic-reservation-row");
            oldDynamic.forEach(el => el.remove());

            const tableHeader = container.querySelector(".table-header");

            history.slice().reverse().forEach(res => {
                const row = document.createElement("article");
                row.className = "reservation-row dynamic-reservation-row";
                row.dataset.facility = (res.facilities || []).map(f => f.name.toLowerCase()).join(" ");
                row.dataset.status = (res.status || "Pending").toLowerCase();

                const formattedPrice = res.prices ? `₱${(res.prices.total || 0).toLocaleString()}` : "₱0";
                const initials = (res.guestName || "Guest").split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
                const facilitySummary = (res.facilities || []).map(f => f.name).join(", ") || "Seaside Cottage";

                const isConfirmed = (res.status || "").toLowerCase() === "confirmed";
                const isCancelled = (res.status || "").toLowerCase() === "cancelled";

                row.innerHTML = `
                    <div class="booking-ref">
                        <strong style="color: #bfa15f;">#${res.reference}</strong>
                        <span>Check-in:<br>${res.checkinDate || "Flexible"}</span>
                        <small>Guests: ${res.totalGuests || 1}</small>
                    </div>

                    <div class="guest-details">
                        <div class="guest-avatar" style="background: #1e3a34; color: #d4af37;">${initials}</div>
                        <div>
                            <strong>${res.guestName || "Guest"}</strong>
                            <span>✉ ${res.email || "No email"}</span>
                            <small>📱 ${res.mobile || "N/A"}</small>
                        </div>
                    </div>

                    <div class="assignment">
                        <strong>${facilitySummary}</strong>
                        <span>Stay: ${res.duration || "Standard"}</span>
                    </div>

                    <div class="mesh-hardware">
                        <span class="mesh-tag" style="background:#112a23; border:1px solid #285448; color:#7ce8c9; padding:2px 6px; border-radius:4px; font-size:11px;">
                            ESP32 Node #${Math.floor(1 + Math.random() * 9)} Paired
                        </span>
                    </div>

                    <div class="folio">
                        <strong>${formattedPrice}</strong>
                        <span class="status-badge" style="font-weight:600; color:${isConfirmed ? '#2e7d32' : isCancelled ? '#c62828' : '#e65100'};">
                            ● ${res.status || "Pending"}
                        </span>
                    </div>

                    <div class="checkin-state">
                        <span style="font-size: 12px; font-weight: bold; padding: 4px 8px; border-radius: 4px; background: ${isConfirmed ? '#e8f5e9' : isCancelled ? '#ffebee' : '#fff3e0'}; color: ${isConfirmed ? '#2e7d32' : isCancelled ? '#c62828' : '#e65100'};">
                            ${res.status || "Pending"}
                        </span>
                    </div>

                    <div class="actions" style="display: flex; gap: 6px; flex-wrap: wrap;">
                        <button type="button" class="approve-btn" data-ref="${res.reference}" style="background: #1b5e20; color: white; border: none; padding: 5px 9px; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: bold;">
                            ✓ APPROVE & EMAIL
                        </button>
                        <button type="button" class="cancel-btn" data-ref="${res.reference}" style="background: #b71c1c; color: white; border: none; padding: 5px 9px; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: bold;">
                            ✕ CANCEL
                        </button>
                    </div>
                `;

                if (tableHeader && tableHeader.nextSibling) {
                    container.insertBefore(row, tableHeader.nextSibling);
                } else {
                    container.appendChild(row);
                }
            });

            // Bind Approve / Cancel handlers
            container.querySelectorAll(".approve-btn").forEach(btn => {
                btn.addEventListener("click", () => updateReservationStatus(btn.dataset.ref, "Confirmed"));
            });

            container.querySelectorAll(".cancel-btn").forEach(btn => {
                btn.addEventListener("click", () => updateReservationStatus(btn.dataset.ref, "Cancelled"));
            });
        }

        function updateReservationStatus(reference, newStatus) {
            let history = [];
            try {
                const stored = localStorage.getItem("reservationHistory");
                if (stored) history = JSON.parse(stored);
            } catch (e) {
                console.error(e);
            }

            const targetIndex = history.findIndex(r => r.reference === reference);
            if (targetIndex !== -1) {
                history[targetIndex].status = newStatus;
                localStorage.setItem("reservationHistory", JSON.stringify(history));

                // Also update currentReservation if reference matches
                try {
                    const curr = localStorage.getItem("currentReservation");
                    if (curr) {
                        const parsedCurr = JSON.parse(curr);
                        if (parsedCurr.reference === reference) {
                            parsedCurr.status = newStatus;
                            localStorage.setItem("currentReservation", JSON.stringify(parsedCurr));
                        }
                    }
                } catch (e) {}

                loadDynamicReservations();
                applyFilters();

                // Send email notification via EmailJS
                sendStatusUpdateEmail(history[targetIndex], newStatus);
            }
        }

        function sendStatusUpdateEmail(reservation, newStatus) {
            if (!reservation || !reservation.email) {
                alert(`✓ Reservation ${reservation.reference} updated to ${newStatus}.`);
                return;
            }

            if (typeof emailjs === "undefined" || !EMAILJS_CONFIG.SERVICE_ID || EMAILJS_CONFIG.SERVICE_ID === "YOUR_SERVICE_ID") {
                alert(`✓ Reservation ${reservation.reference} updated to ${newStatus}. (EmailJS not configured)`);
                return;
            }

            const templateParams = {
                to_email: reservation.email,
                email: reservation.email,
                user_email: reservation.email,
                guest_name: reservation.guestName || "Valued Guest",
                email_subject: `Reservation Status Update: ${newStatus.toUpperCase()} - Catherine's Sanctuary`,
                email_title: `Reservation Status Update: ${newStatus.toUpperCase()}`,
                message_body: `Your reservation #${reservation.reference} at Catherine's Bagasbas Lighthouse Resort status has been updated to: ${newStatus.toUpperCase()}`,
                reservation_ref: reservation.reference,
                booking_ref: reservation.reference,
                checkin_date: reservation.checkinDate || "TBD",
                status: newStatus.toUpperCase(),
                code: `Status: ${newStatus.toUpperCase()}`,
                verification_code: `Status: ${newStatus.toUpperCase()} (Ref: ${reservation.reference})`
            };

            emailjs.send(
                EMAILJS_CONFIG.SERVICE_ID,
                EMAILJS_CONFIG.TEMPLATE_ID,
                templateParams,
                { publicKey: EMAILJS_CONFIG.PUBLIC_KEY }
            ).then((res) => {
                console.log("Status update email sent:", res);
                alert(`✓ Reservation ${reservation.reference} marked as ${newStatus}! Notification email sent to ${reservation.email}.`);
            }).catch((err) => {
                console.error("Status update email error:", err);
                alert(`✓ Reservation ${reservation.reference} marked as ${newStatus}! (Email error: ${err.text || err.message})`);
            });
        }

        loadDynamicReservations();

        /* =================================================
           SEARCH
        ================================================== */

        const searchInput =
            document.getElementById(
                "searchInput"
            );


        let reservationRows = Array.from(
            document.querySelectorAll(
                ".reservation-row"
            )
        );

        function updateRowsList() {
            reservationRows = Array.from(
                document.querySelectorAll(
                    ".reservation-row"
                )
            );
        }


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