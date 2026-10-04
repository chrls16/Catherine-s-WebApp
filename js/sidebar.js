"use strict";


/* =========================================================
   CATHERINE'S SHARED SIDEBAR

   This version does NOT use fetch().
   It works even when opening the project locally.
========================================================= */

function loadSidebar(activePage = "dashboard") {

    const container =
        document.getElementById("sharedSidebar");


    if (!container) {

        console.error(
            "Sidebar container #sharedSidebar was not found."
        );

        return;
    }


    /* =====================================================
       SIDEBAR HTML
    ===================================================== */

    container.innerHTML = `

        <aside class="shared-sidebar">


            <!-- BRAND -->

            <a
                href="index.html"
                class="shared-sidebar-brand"
            >

                <img
                    src="assets/Catherine's Logo.png"
                    alt="Catherine's Logo"
                >

                <div class="shared-brand-text">

                    <strong>
                        Catherine’s
                    </strong>

                    <span>
                        LIGHTHOUSE COMMAND
                    </span>

                </div>

            </a>


            <!-- SYSTEM STATUS -->

            <div class="shared-system-status">

                <span class="shared-status-dot"></span>

                <div>

                    <strong>
                        Diorama System Online
                    </strong>

                    <span>
                        9 Node Mesh
                    </span>

                </div>

            </div>


            <!-- NAVIGATION LABEL -->

            <div class="shared-sidebar-label">
                GUEST PORTAL
            </div>


            <!-- NAVIGATION -->

            <nav class="shared-sidebar-nav">


                <button
                    type="button"
                    class="shared-sidebar-item ${
                        activePage === "dashboard"
                            ? "active"
                            : ""
                    }"
                    data-page="dashboard"
                >

                    <i class="fa-solid fa-gauge-high"></i>

                    <span>
                        Dashboard
                    </span>

                </button>


                <button
                    type="button"
                    class="shared-sidebar-item ${
                        activePage === "reservation"
                            ? "active"
                            : ""
                    }"
                    data-page="reservation"
                >

                    <i class="fa-regular fa-calendar-check"></i>

                    <span>
                        My Reservation
                    </span>

                </button>


            </nav>


            <!-- FOOTER -->

            <div class="shared-sidebar-footer">


                <a
                    href="index.html"
                    class="shared-website-button"
                >

                    <i class="fa-solid fa-globe"></i>

                    <span>
                        Visitor Website
                    </span>

                </a>


                <button
                    type="button"
                    class="shared-logout-button"
                    id="sharedLogoutButton"
                    aria-label="Log out"
                >

                    <i class="fa-solid fa-right-from-bracket"></i>

                </button>


            </div>


        </aside>

    `;


    /* =====================================================
       NAVIGATION
    ===================================================== */

    const navigationItems =
        container.querySelectorAll(
            ".shared-sidebar-item"
        );


    navigationItems.forEach(
        item => {

            item.addEventListener(
                "click",
                () => {

                    const page =
                        item.dataset.page;


                    if (
                        page === "dashboard"
                    ) {

                        window.location.href =
                            "guest-dashboard.html";

                    }


                    if (
                        page === "reservation"
                    ) {

                        window.location.href =
                            "my-reservation.html";

                    }

                }
            );

        }
    );


    /* =====================================================
       LOGOUT
    ===================================================== */

    const logoutButton =
        container.querySelector(
            "#sharedLogoutButton"
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
                    "currentReservation"
                );


                window.location.href =
                    "index.html";

            }
        );

    }

}