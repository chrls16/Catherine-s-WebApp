"use strict";

/* =========================================================
   CATHERINE'S BAGASBAS LIGHTHOUSE RESORT
   ADMIN MASTER RESERVATIONS CONTROLLER
   Real-Time Sync with Physical Diorama Mesh & Guest Bookings
========================================================= */

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
        console.error("[Master Reservations] EmailJS init error:", err);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const reservationsContainer = document.getElementById("reservationsSection");
    const searchInput = document.getElementById("searchInput");
    const statusFilter = document.getElementById("statusFilter");
    const facilityChips = document.querySelectorAll(".filter-chip");
    const dateFilters = document.querySelectorAll(".date-filter");
    const exportButton = document.getElementById("exportButton");
    const walkinButton = document.getElementById("walkinButton");
    const showingBadge = document.getElementById("showingEntriesBadge") || document.querySelector(".showing-badge");
    const toastContainer = document.getElementById("resortToastContainer");
    const reviewPendingLink = document.getElementById("reviewPendingLink");

    // Track previous reservations state for live change detection
    let previousCount = 0;
    let lastKnownSyncTime = "";
    let reservationRows = [];
    let knownReferences = new Set();

    /* =========================================================
       AUDIO CHIME FOR LIVE RESERVATION ALERTS
    ========================================================= */
    function playAlertChime() {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "sine";
            osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5

            gain.gain.setValueAtTime(0.06, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.45);
        } catch (e) {
            // Audio context not allowed until user gesture or not supported
        }
    }

    /* =========================================================
       TOAST NOTIFICATION FOR NEW INCOMING RESERVATIONS
    ========================================================= */
    function showReservationToast(reservation) {
        if (!toastContainer) return;

        const toast = document.createElement("div");
        toast.className = "resort-live-alert";

        const facilityName = (reservation.facilities && reservation.facilities[0])
            ? reservation.facilities[0].name
            : "Seaside Sanctuary Pass";
        const priceFormatted = reservation.prices ? `₱${(reservation.prices.total || 0).toLocaleString()}` : "";

        toast.innerHTML = `
            <div class="alert-icon">
                <i class="fa-solid fa-bell"></i>
            </div>
            <div class="alert-body">
                <strong>New Reservation Received!</strong>
                <span>Ref #${escapeHtml(reservation.reference)} • ${escapeHtml(reservation.guestName || "Guest")}</span>
                <small>${escapeHtml(facilityName)} ${priceFormatted ? "• " + priceFormatted : ""}</small>
            </div>
            <button type="button" class="alert-close" aria-label="Close notification">&times;</button>
        `;

        toast.querySelector(".alert-close").addEventListener("click", () => {
            toast.classList.add("hiding");
            setTimeout(() => toast.remove(), 300);
        });

        toastContainer.appendChild(toast);
        playAlertChime();

        // Auto-dismiss after 6 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.classList.add("hiding");
                setTimeout(() => toast.remove(), 300);
            }
        }, 6000);
    }

    /* =========================================================
       ESCAPE HTML HELPER
    ========================================================= */
    function escapeHtml(str) {
        if (!str) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    /* =========================================================
       DATA RETRIEVAL VIA RESORTDB OR LOCALSTORAGE
    ========================================================= */
    function getMasterReservationsList() {
        if (typeof window.ResortDB !== "undefined" && typeof window.ResortDB.getReservations === "function") {
            return window.ResortDB.getReservations();
        }

        try {
            const data = localStorage.getItem("reservationHistory");
            if (data) {
                const parsed = JSON.parse(data);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch (e) {
            console.error("[Master Reservations] Error reading storage:", e);
        }

        return [];
    }

    /* =========================================================
       UPDATE KPI OVERVIEW STATS
    ========================================================= */
    function updateMetrics(reservations) {
        let stats = null;
        if (typeof window.ResortDB !== "undefined" && typeof window.ResortDB.getReservationStats === "function") {
            stats = window.ResortDB.getReservationStats();
        } else {
            // Manual metric fallback
            let gross = 0;
            let pending = 0;
            let active = 0;
            let guests = 0;
            const cottages = new Set();

            reservations.forEach(r => {
                const st = (r.status || "").toLowerCase();
                const isCancelled = st.includes("cancel");
                if (!isCancelled) {
                    gross += (r.prices && Number(r.prices.total)) ? Number(r.prices.total) : 0;
                    if (st.includes("pending") || st.includes("hold")) pending++;
                    else {
                        active++;
                        guests += Number(r.totalGuests || 1);
                    }
                    (r.facilities || []).forEach(f => {
                        const name = (f.name || "").toLowerCase();
                        if (name.includes("cottage")) cottages.add(name);
                    });
                }
            });

            const occ = Math.min(100, Math.max(25, Math.round((cottages.size / 4) * 100)));
            stats = {
                total: reservations.length,
                pending,
                active,
                grossRevenue: gross,
                activeGuests: guests || 12,
                cottageCount: cottages.size || 3,
                totalCottages: 4,
                occupancyPct: occ
            };
        }

        // 1. Total Bookings
        const statTotalBookings = document.getElementById("statTotalBookings");
        if (statTotalBookings) {
            statTotalBookings.textContent = stats.total;
        }

        const statGrossRevenue = document.getElementById("statGrossRevenue");
        if (statGrossRevenue) {
            statGrossRevenue.textContent = `₱${stats.grossRevenue.toLocaleString()} Gross revenue generated`;
        }

        // 2. Cottage Occupancy
        const statOccupancy = document.getElementById("statOccupancy");
        if (statOccupancy) {
            statOccupancy.textContent = `${stats.occupancyPct}%`;
        }

        const statOccupancyBar = document.getElementById("statOccupancyBar");
        if (statOccupancyBar) {
            statOccupancyBar.style.width = `${stats.occupancyPct}%`;
        }

        const statOccupancySub = document.getElementById("statOccupancySub");
        if (statOccupancySub) {
            statOccupancySub.textContent = `${stats.cottageCount} of ${stats.totalCottages} Cottages booked`;
        }

        // 3. Checked-In Diorama Nodes / Guests Active
        const statActiveGuests = document.getElementById("statActiveGuests");
        if (statActiveGuests) {
            statActiveGuests.textContent = stats.activeGuests;
        }

        // 4. Pending Verification
        const statPendingCount = document.getElementById("statPendingCount");
        if (statPendingCount) {
            statPendingCount.textContent = stats.pending;
        }

        if (reviewPendingLink) {
            reviewPendingLink.innerHTML = `Review ${stats.pending}<br>pending →`;
        }
    }

    /* =========================================================
       DETERMINE COLOR & STYLING CLASSES FOR RESERVATION ROW
    ========================================================= */
    function mapStatusToClass(status) {
        const s = (status || "").toLowerCase();
        if (s.includes("cancel")) return "cancelled";
        if (s.includes("pending") || s.includes("hold")) return "pending";
        if (s.includes("confirm")) return "confirmed";
        if (s.includes("in facility")) return "facility";
        if (s.includes("arriving")) return "arriving";
        if (s.includes("expect")) return "expected";
        return "active";
    }

    function mapMeshStatus(res) {
        const s = (res.status || "").toLowerCase();
        if (s.includes("cancel")) {
            return {
                meshClass: "offline",
                statusText: "OFFLINE",
                color: "Offline",
                glowText: "Diorama Standby"
            };
        }
        if (s.includes("pending")) {
            return {
                meshClass: "standby",
                statusText: "AWAITING PAIR",
                color: "Warm White Pulse",
                glowText: "Keycard Queued"
            };
        }
        if ((res.facilities || []).some(f => (f.name || "").toLowerCase().includes("pavilion") || (f.name || "").toLowerCase().includes("buyout"))) {
            return {
                meshClass: "event",
                statusText: "EVENT SYNCED",
                color: "DMX Armed",
                glowText: "Perimeter Beam ON"
            };
        }
        if ((res.facilities || []).some(f => (f.name || "").toLowerCase().includes("pool"))) {
            return {
                meshClass: "pool",
                statusText: "POOL DECK",
                color: "Azure Blue",
                glowText: "Bridge Waterfall Glow"
            };
        }
        return {
            meshClass: "active",
            statusText: "SYNCED",
            color: "Amber 2200K",
            glowText: "Miniature Glow ON"
        };
    }

    const AVATAR_COLORS = ["", "teal", "blue", "beige", "cyan"];

    /* =========================================================
       RENDER MASTER RESERVATIONS TABLE
    ========================================================= */
    function renderMasterReservations(highlightNew = false) {
        if (!reservationsContainer) return;

        const reservations = getMasterReservationsList();
        updateMetrics(reservations);

        // Check if new reservations arrived
        const currentReferences = new Set(reservations.map(r => r.reference));
        if (knownReferences.size > 0 && reservations.length > previousCount) {
            const newlyAdded = reservations.find(r => !knownReferences.has(r.reference));
            if (newlyAdded && highlightNew) {
                showReservationToast(newlyAdded);
            }
        }
        previousCount = reservations.length;
        knownReferences = currentReferences;

        // Clean up previous rows
        const oldRows = reservationsContainer.querySelectorAll(".reservation-row");
        oldRows.forEach(row => row.remove());

        const tableHeader = reservationsContainer.querySelector(".table-header");

        reservations.forEach((res, index) => {
            const row = document.createElement("article");
            row.className = "reservation-row";

            // If newly added at index 0, briefly flash gold glow
            if (highlightNew && index === 0) {
                row.classList.add("just-added");
            }

            // Facility data tags for filtering
            const facilityNames = (res.facilities || []).map(f => (f.name || "").toLowerCase());
            let facilityCategory = "other";
            if (facilityNames.some(n => n.includes("cottage") || n.includes("buyout"))) facilityCategory = "cottage";
            else if (facilityNames.some(n => n.includes("pool"))) facilityCategory = "pool";
            else if (facilityNames.some(n => n.includes("ktv"))) facilityCategory = "ktv";
            else if (facilityNames.some(n => n.includes("pavilion") || n.includes("grand"))) facilityCategory = "pavilion";

            row.dataset.facility = `${facilityCategory} ${facilityNames.join(" ")}`;

            // Status mapping for filtering
            const statusKey = mapStatusToClass(res.status);
            row.dataset.status = statusKey;

            // Guest avatar initials
            const rawName = res.guestName || "Sanctuary Guest";
            const nameParts = rawName.trim().split(/\s+/);
            const initials = nameParts.length >= 2
                ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
                : rawName.substring(0, 2).toUpperCase();
            const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];

            // Facilities breakdown
            const primaryFacility = (res.facilities && res.facilities[0])
                ? res.facilities[0].name
                : "Private Seaside Cottage";
            const secondaryFacility = (res.facilities && res.facilities[1])
                ? res.facilities[1].name
                : "Pool Bridge Unlimited Pass";
            const thirdFacility = (res.facilities && res.facilities[2])
                ? res.facilities[2].name
                : (res.specialRequests ? `Req: ${res.specialRequests}` : "");

            // Diorama Mesh specs
            const mesh = mapMeshStatus(res);
            const nodeNum = res.nodeNumber || ((index % 9) + 1);
            const rfidTag = res.rfidLinked || (res.reference || "8801").slice(-4);

            // Folio specs
            const formattedTotal = res.prices ? `₱${(res.prices.total || 0).toLocaleString()}` : "₱4,500";
            const paymentMethodText = res.paymentMethod || (statusKey === "pending" ? "Awaiting Settlement" : "PAID VIA MAYA QR");
            const paymentMethodClass = paymentMethodText.toLowerCase().includes("gcash")
                ? "gcash"
                : paymentMethodText.toLowerCase().includes("transfer")
                ? "transfer"
                : "maya";

            // Status label formatting
            let stateLabelHtml = "";
            if (statusKey === "pending") {
                stateLabelHtml = "<span></span> PENDING<br>VERIFICATION";
            } else if (statusKey === "confirmed") {
                stateLabelHtml = "<span></span> CONFIRMED<br>&amp; GUARANTEED";
            } else if (statusKey === "cancelled") {
                stateLabelHtml = "<span></span> CANCELLED<br>RESERVATION";
            } else if (statusKey === "facility") {
                stateLabelHtml = "<span></span> IN FACILITY<br>&amp; ACTIVE";
            } else if (statusKey === "arriving") {
                stateLabelHtml = "<span></span> ARRIVING<br>EXPECTED";
            } else {
                stateLabelHtml = "<span></span> CHECKED IN<br>&amp; ACTIVE";
            }

            // Actions buttons per state
            let actionsHtml = "";
            if (statusKey === "pending") {
                actionsHtml = `
                    <button type="button" class="approve-btn" data-ref="${escapeHtml(res.reference)}" title="Approve Reservation">
                        <i class="fa-solid fa-check"></i> APPROVE
                    </button>
                    <button type="button" class="cancel-btn" data-ref="${escapeHtml(res.reference)}" title="Cancel Reservation">
                        <i class="fa-solid fa-xmark"></i> CANCEL
                    </button>
                    <button type="button" class="icon-action view-btn" data-ref="${escapeHtml(res.reference)}" title="View Folio Details">
                        <i class="fa-regular fa-eye"></i>
                    </button>
                `;
            } else if (statusKey === "confirmed" || statusKey === "arriving" || statusKey === "expected") {
                actionsHtml = `
                    <button type="button" class="quick-checkin" data-ref="${escapeHtml(res.reference)}">
                        CHECK-IN
                    </button>
                    <button type="button" class="cancel-btn" data-ref="${escapeHtml(res.reference)}" title="Cancel Reservation">
                        <i class="fa-solid fa-xmark"></i> CANCEL
                    </button>
                    <button type="button" class="icon-action view-btn" data-ref="${escapeHtml(res.reference)}" title="View Folio Details">
                        <i class="fa-regular fa-eye"></i>
                    </button>
                `;
            } else if (statusKey === "cancelled") {
                actionsHtml = `
                    <button type="button" class="restore-btn" data-ref="${escapeHtml(res.reference)}" title="Restore Reservation">
                        <i class="fa-solid fa-rotate-left"></i> RESTORE
                    </button>
                    <button type="button" class="icon-action view-btn" data-ref="${escapeHtml(res.reference)}" title="View Folio Details">
                        <i class="fa-regular fa-eye"></i>
                    </button>
                `;
            } else {
                // Active / In Facility
                actionsHtml = `
                    <button type="button" class="checkout-action" data-ref="${escapeHtml(res.reference)}">
                        CHECKOUT
                    </button>
                    <button type="button" class="icon-action view-btn" data-ref="${escapeHtml(res.reference)}" title="View Folio Details">
                        <i class="fa-regular fa-eye"></i>
                    </button>
                `;
            }

            row.innerHTML = `
                <div class="booking-ref">
                    <strong>#${escapeHtml(res.reference)}</strong>
                    <span>${escapeHtml(res.checkinDate || "Today, 2:00 PM")}</span>
                    <small>Stay: ${escapeHtml(res.duration || "1 Night")} • ${res.totalGuests || 1} Pax</small>
                </div>

                <div class="guest-details">
                    <div class="guest-avatar ${avatarColor}">
                        ${escapeHtml(initials)}
                    </div>
                    <div>
                        <strong>${escapeHtml(rawName)}</strong>
                        <span>${escapeHtml(res.mobile || res.email || "Contact on arrival")}</span>
                        <small>${res.totalGuests || 1} Pax • ${escapeHtml(res.honorific || "Guest")}</small>
                    </div>
                </div>

                <div class="assignment">
                    <strong>
                        <i class="fa-solid fa-house"></i>
                        ${escapeHtml(primaryFacility)}
                    </strong>
                    <span>
                        <i class="fa-solid fa-water"></i>
                        ${escapeHtml(secondaryFacility)}
                    </span>
                    ${thirdFacility ? `<span><i class="fa-solid fa-microphone"></i> ${escapeHtml(thirdFacility)}</span>` : ""}
                </div>

                <div class="mesh-status ${mesh.meshClass}">
                    <strong>
                        NODE #${nodeNum}<br>${mesh.statusText}
                    </strong>
                    <span>${mesh.color}</span>
                    <span>${mesh.glowText}</span>
                    <small>RFID KEYCARD #${escapeHtml(rfidTag)} LINKED</small>
                </div>

                <div class="folio">
                    <strong>${formattedTotal}</strong>
                    <span class="${paymentMethodClass}">
                        ${escapeHtml(paymentMethodText.toUpperCase())}
                    </span>
                    <small>Folio #${escapeHtml(res.reference)}</small>
                </div>

                <div class="checkin-state ${statusKey}">
                    ${stateLabelHtml}
                </div>

                <div class="row-actions">
                    ${actionsHtml}
                </div>
            `;

            reservationsContainer.appendChild(row);
        });

        // Update rows cache and wire handlers
        updateRowsList();
        bindRowActionButtons();
        applyFilters();
    }

    /* =========================================================
       UPDATE ROWS LIST CACHE
    ========================================================= */
    function updateRowsList() {
        if (!reservationsContainer) return;
        reservationRows = Array.from(reservationsContainer.querySelectorAll(".reservation-row"));
    }

    /* =========================================================
       BIND INTERACTIVE ACTIONS ON ROWS
    ========================================================= */
    function bindRowActionButtons() {
        if (!reservationsContainer) return;

        // APPROVE BUTTON
        reservationsContainer.querySelectorAll(".approve-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const ref = btn.dataset.ref;
                if (!ref) return;
                updateReservationStatus(ref, "Confirmed");
            });
        });

        // CANCEL BUTTON
        reservationsContainer.querySelectorAll(".cancel-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const ref = btn.dataset.ref;
                if (!ref) return;
                const confirmed = window.confirm(`Are you sure you want to cancel reservation #${ref}?`);
                if (confirmed) {
                    updateReservationStatus(ref, "Cancelled");
                }
            });
        });

        // QUICK CHECK-IN BUTTON
        reservationsContainer.querySelectorAll(".quick-checkin").forEach(btn => {
            btn.addEventListener("click", () => {
                const ref = btn.dataset.ref;
                if (!ref) return;
                updateReservationStatus(ref, "In Facility");
            });
        });

        // CHECKOUT BUTTON
        reservationsContainer.querySelectorAll(".checkout-action").forEach(btn => {
            btn.addEventListener("click", () => {
                const ref = btn.dataset.ref;
                if (!ref) return;
                const confirmed = window.confirm(`Check out guest for folio #${ref}?`);
                if (confirmed) {
                    updateReservationStatus(ref, "Checked Out");
                }
            });
        });

        // RESTORE BUTTON
        reservationsContainer.querySelectorAll(".restore-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const ref = btn.dataset.ref;
                if (!ref) return;
                updateReservationStatus(ref, "Pending Verification");
            });
        });

        // VIEW FOLIO DETAILS
        reservationsContainer.querySelectorAll(".view-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const ref = btn.dataset.ref;
                showFolioDetailsModal(ref);
            });
        });
    }

    /* =========================================================
       SHOW FOLIO DETAILS POPUP
    ========================================================= */
    function showFolioDetailsModal(reference) {
        let res = null;
        if (typeof window.ResortDB !== "undefined" && typeof window.ResortDB.findReservationByCode === "function") {
            res = window.ResortDB.findReservationByCode(reference);
        } else {
            const list = getMasterReservationsList();
            res = list.find(r => r && r.reference && r.reference.toUpperCase() === reference.toUpperCase());
        }

        if (!res) {
            alert(`Reservation #${reference} not found.`);
            return;
        }

        const facilitiesList = (res.facilities || []).map(f => `• ${f.name} (₱${(f.price || 0).toLocaleString()})`).join("\n");
        const total = res.prices ? `₱${(res.prices.total || 0).toLocaleString()}` : "N/A";

        alert(
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `CATHERINE'S LIGHTHOUSE RESORT\n` +
            `MASTER FOLIO: #${res.reference}\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `Guest: ${res.guestName || "Valued Guest"}\n` +
            `Email: ${res.email || "N/A"}\n` +
            `Mobile: ${res.mobile || "N/A"}\n` +
            `Check-in: ${res.checkinDate || "Today"}\n` +
            `Duration: ${res.duration || "Standard Stay"}\n` +
            `Total Guests: ${res.totalGuests || 1} Pax\n` +
            `Status: ${res.status || "Pending Verification"}\n` +
            `ESP32 Node: Node #${res.nodeNumber || 4}\n` +
            `Keycard RFID: #${res.rfidLinked || "8801"}\n` +
            `Special Requests: ${res.specialRequests || "None"}\n\n` +
            `Facilities Booked:\n${facilitiesList || "Standard Access"}\n\n` +
            `Total Settlement Due: ${total}\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
        );
    }

    /* =========================================================
       UPDATE RESERVATION STATUS & DISPATCH NOTIFICATION
    ========================================================= */
    function updateReservationStatus(reference, newStatus) {
        if (typeof window.ResortDB !== "undefined" && typeof window.ResortDB.updateReservationStatus === "function") {
            window.ResortDB.updateReservationStatus(reference, newStatus);
        } else {
            let history = getMasterReservationsList();
            const targetIndex = history.findIndex(r => r.reference === reference);
            if (targetIndex !== -1) {
                history[targetIndex].status = newStatus;
                localStorage.setItem("reservationHistory", JSON.stringify(history));

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

                localStorage.setItem("resort_reservation_sync", Date.now().toString());
            }
        }

        renderMasterReservations(false);

        // Send EmailJS update if guest has email
        const list = getMasterReservationsList();
        const updatedRes = list.find(r => r && r.reference === reference);
        if (updatedRes) {
            sendStatusUpdateEmail(updatedRes, newStatus);
        }
    }

    /* =========================================================
       SEND STATUS UPDATE EMAIL
    ========================================================= */
    function sendStatusUpdateEmail(reservation, newStatus) {
        if (!reservation || !reservation.email) {
            console.log(`Reservation #${reservation.reference} updated to ${newStatus}. No guest email on record.`);
            return;
        }

        if (typeof emailjs === "undefined" || !EMAILJS_CONFIG.SERVICE_ID || EMAILJS_CONFIG.SERVICE_ID === "YOUR_SERVICE_ID") {
            console.log(`EmailJS not configured. Status #${reservation.reference} set to ${newStatus}.`);
            return;
        }

        const templateParams = {
            to_email: reservation.email,
            email: reservation.email,
            user_email: reservation.email,
            guest_name: reservation.guestName || "Valued Guest",
            email_subject: `Reservation #${reservation.reference} Update: ${newStatus.toUpperCase()} - Catherine's Sanctuary`,
            email_title: `Reservation Status Update: ${newStatus.toUpperCase()}`,
            message_body: `Your reservation #${reservation.reference} at Catherine's Bagasbas Lighthouse Resort status has been updated to: ${newStatus.toUpperCase()}`,
            reservation_ref: reservation.reference,
            booking_ref: reservation.reference,
            checkin_date: reservation.checkinDate || "Today",
            status: newStatus.toUpperCase(),
            code: `Status: ${newStatus.toUpperCase()}`,
            verification_code: `Status: ${newStatus.toUpperCase()} (Ref: ${reservation.reference})`
        };

        emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE_ID,
            templateParams,
            { publicKey: EMAILJS_CONFIG.PUBLIC_KEY }
        ).then(() => {
            console.log(`Status update email sent to ${reservation.email}`);
        }).catch(err => {
            console.error("EmailJS dispatch failed:", err);
        });
    }

    /* =========================================================
       FILTER & SEARCH LOGIC
    ========================================================= */
    function applyFilters() {
        const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : "";
        const activeChip = document.querySelector(".filter-chip.active");
        const selectedFacility = activeChip ? (activeChip.dataset.facility || "all") : "all";
        const selectedStatus = statusFilter ? statusFilter.value : "all";

        let visibleCount = 0;

        reservationRows.forEach(row => {
            const rowText = row.textContent.toLowerCase();
            const rowFacility = (row.dataset.facility || "").toLowerCase();
            const rowStatus = (row.dataset.status || "").toLowerCase();

            const matchesSearch = !searchTerm || rowText.includes(searchTerm);
            const matchesFacility = (selectedFacility === "all") || rowFacility.includes(selectedFacility);
            const matchesStatus = (selectedStatus === "all") || (rowStatus === selectedStatus);

            if (matchesSearch && matchesFacility && matchesStatus) {
                row.style.display = "grid";
                visibleCount++;
            } else {
                row.style.display = "none";
            }
        });

        if (showingBadge) {
            showingBadge.textContent = `SHOWING ${visibleCount} OF ${reservationRows.length} ACTIVE ENTRIES`;
        }
    }

    /* =========================================================
       BIND SEARCH & FILTER CONTROLS
    ========================================================= */
    if (searchInput) {
        searchInput.addEventListener("input", applyFilters);
    }

    facilityChips.forEach(chip => {
        chip.addEventListener("click", () => {
            facilityChips.forEach(c => c.classList.remove("active"));
            chip.classList.add("active");
            applyFilters();
        });
    });

    if (statusFilter) {
        statusFilter.addEventListener("change", applyFilters);
    }

    dateFilters.forEach(button => {
        button.addEventListener("click", () => {
            dateFilters.forEach(b => b.classList.remove("active"));
            button.classList.add("active");
            applyFilters();
        });
    });

    // Quick review pending link
    if (reviewPendingLink) {
        reviewPendingLink.addEventListener("click", (e) => {
            e.preventDefault();
            if (statusFilter) {
                statusFilter.value = "pending";
                applyFilters();
            }
        });
    }

    /* =========================================================
       EXPORT CSV
    ========================================================= */
    if (exportButton) {
        exportButton.addEventListener("click", () => {
            const visibleRows = reservationRows.filter(row => row.style.display !== "none");
            const csvRows = [
                ["Booking Reference", "Check-in Date", "Guest Name", "Contact", "Assigned Quarters", "Diorama Node", "Folio Amount", "Status"].join(",")
            ];

            visibleRows.forEach(row => {
                const booking = row.querySelector(".booking-ref strong")?.textContent.trim() || "";
                const checkin = row.querySelector(".booking-ref span")?.textContent.replace(/\s+/g, " ").trim() || "";
                const guest = row.querySelector(".guest-details strong")?.textContent.replace(/\s+/g, " ").trim() || "";
                const contact = row.querySelector(".guest-details span")?.textContent.trim() || "";
                const assignment = row.querySelector(".assignment strong")?.textContent.replace(/\s+/g, " ").trim() || "";
                const node = row.querySelector(".mesh-status strong")?.textContent.replace(/\s+/g, " ").trim() || "";
                const amount = row.querySelector(".folio strong")?.textContent.trim() || "";
                const status = row.querySelector(".checkin-state")?.textContent.replace(/\s+/g, " ").trim() || "";

                csvRows.push([
                    `"${booking}"`,
                    `"${checkin}"`,
                    `"${guest}"`,
                    `"${contact}"`,
                    `"${assignment}"`,
                    `"${node}"`,
                    `"${amount}"`,
                    `"${status}"`
                ].join(","));
            });

            const csv = csvRows.join("\n");
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `catherines-master-reservations-${new Date().toISOString().slice(0, 10)}.csv`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
        });
    }

    /* =========================================================
       NEW WALKIN RESERVATION SHORTCUT
    ========================================================= */
    if (walkinButton) {
        walkinButton.addEventListener("click", () => {
            window.location.href = "reservation.html";
        });
    }

    /* =========================================================
       INTERNAL TABS NAVIGATION
    ========================================================= */
    const tabs = document.querySelectorAll(".reservation-tab");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const targetId = tab.dataset.target;
            tabs.forEach(item => item.classList.remove("active"));
            tab.classList.add("active");

            if (!targetId) return;
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });

    /* =========================================================
       ADMIN LOGOUT
    ========================================================= */
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            const confirmed = window.confirm("Are you sure you want to log out of Resort Command?");
            if (!confirmed) return;

            if (typeof window.ResortDB !== "undefined" && typeof window.ResortDB.clearSession === "function") {
                window.ResortDB.clearSession();
            } else {
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("userRole");
            }
            window.location.href = "login.html";
        });
    }

    /* =========================================================
       REAL-TIME CROSS-TAB SYNCHRONIZATION ENGINE
    ========================================================= */

    // 1. Storage event: fires when another tab modifies localStorage
    window.addEventListener("storage", (e) => {
        if (e.key === "reservationHistory" || e.key === "resort_reservation_sync") {
            console.log("[Master Reservations] Live synchronization detected via storage event!");
            renderMasterReservations(true);
        }
    });

    // 2. Custom DOM events: fired when added or updated in the current tab/session
    window.addEventListener("resort:reservation-added", (e) => {
        console.log("[Master Reservations] Live reservation added event:", e.detail);
        renderMasterReservations(true);
    });

    window.addEventListener("resort:reservation-updated", () => {
        renderMasterReservations(false);
    });

    // 3. Heartbeat Polling: checks every 2 seconds for storage changes
    // Guarantees sync even if storage events are restricted or throttled
    setInterval(() => {
        try {
            const currentSync = localStorage.getItem("resort_reservation_sync") || "";
            const currentData = localStorage.getItem("reservationHistory") || "";
            let currentList = [];
            try { currentList = JSON.parse(currentData); } catch (e) {}

            if (currentSync !== lastKnownSyncTime || (Array.isArray(currentList) && currentList.length !== previousCount)) {
                lastKnownSyncTime = currentSync;
                const isNew = Array.isArray(currentList) && currentList.length > previousCount;
                renderMasterReservations(isNew);
            }
        } catch (e) {
            // Storage access check failed
        }
    }, 2000);

    /* =========================================================
       INITIALIZE MASTER RESERVATIONS ON PAGE LOAD
    ========================================================= */
    renderMasterReservations(false);
    console.log("[Master Reservations] Fully initialized with real-time Diorama Mesh synchronization.");
});