"use strict";


/* =========================================================
   CATHERINE'S MY RESERVATION
========================================================= */


/* =========================================================
   DEMO RESERVATION DATA
========================================================= */

let reservationData = {
    guestName: "Guest",
    email: "",
    mobile: "",
    guests: "2 Guests",
    bookingCode: "#CBLR-343860",
    status: "Pending",
    facilities: [
        { name: "Private Seaside Cottage", price: 4500 },
        { name: "Swimming Pool & Arched Bridge", price: 1200 }
    ]
};

try {
    const savedReservation = localStorage.getItem("currentReservation");
    if (savedReservation) {
        const parsed = JSON.parse(savedReservation);
        reservationData = {
            guestName: parsed.guestName || "Guest",
            email: parsed.email || "",
            mobile: parsed.mobile || "",
            guests: `${parsed.totalGuests || 2} Guests`,
            bookingCode: parsed.reference ? `#${parsed.reference}` : "#CBLR-343860",
            status: parsed.status || "Pending",
            facilities: (parsed.facilities && parsed.facilities.length) ? parsed.facilities : reservationData.facilities,
            checkinDate: parsed.checkinDate
        };
    }
} catch (e) {
    console.error("Error loading currentReservation in my-reservation.js", e);
}


/* =========================================================
   OPTIONAL LOCAL STORAGE DATA
========================================================= */

function getStoredValue(
    key,
    fallback
) {

    const value =
        localStorage.getItem(key);

    return value || fallback;

}


/* =========================================================
   GUEST INFORMATION
========================================================= */

function updateGuestInformation() {

    const guestName =
        getStoredValue(
            "guestName",
            "Guest"
        );


    const guestEmail =
        getStoredValue(
            "guestEmail",
            ""
        );


    const guestMobile =
        getStoredValue(
            "guestMobile",
            getStoredValue("guestPhone", "")
        );


    const guestNameTargets = [

        document.getElementById(
            "headerGuestName"
        ),

        document.getElementById(
            "heroGuestName"
        ),

        document.getElementById(
            "contactName"
        ),

        document.getElementById(
            "rfidGuest"
        )

    ];


    guestNameTargets.forEach(
        element => {

            if (element) {

                element.textContent =
                    guestName;

            }

        }
    );


    const profileAvatars = document.querySelectorAll("#profileAvatar, .profile-avatar");


    profileAvatars.forEach(profileAvatar => {

        if (profileAvatar && guestName) {

            profileAvatar.textContent =
                guestName
                    .trim()
                    .charAt(0)
                    .toUpperCase();

        }

    });


    const emailElement =
        document.getElementById(
            "contactEmail"
        );


    if (emailElement) {

        emailElement.textContent =
            guestEmail || "No email stored";

    }


    const mobileElement =
        document.getElementById(
            "contactMobile"
        );


    if (mobileElement) {

        mobileElement.textContent =
            guestMobile || "No mobile stored";

    }

}


/* =========================================================
   NAVIGATION & LOGOUT
========================================================= */

function setupNavigation() {


    const dashboardButton =
        document.getElementById(
            "dashboardButton"
        );


    const reservationButton =
        document.getElementById(
            "reservationButton"
        );


    if (dashboardButton) {

        dashboardButton.addEventListener(
            "click",
            () => {

                window.location.href =
                    "guest-dashboard.html";

            }
        );

    }


    if (reservationButton) {

        reservationButton.addEventListener(
            "click",
            () => {

                window.location.href =
                    "my-reservation.html";

            }
        );

    }


    function performLogout() {
        const confirmed = window.confirm("Are you sure you want to log out of your sanctuary session?");
        if (!confirmed) return;

        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("guestEmail");
        localStorage.removeItem("guestName");
        localStorage.removeItem("guestMobile");
        localStorage.removeItem("guestPhone");
        localStorage.removeItem("userRole");
        localStorage.removeItem("currentReservation");

        window.location.href = "index.html";
    }

    const logoutTriggers = document.querySelectorAll(
        "#logoutButton, #logoutBtn, #sharedLogoutButton, .guest-profile"
    );

    logoutTriggers.forEach(trigger => {
        if (trigger) {
            trigger.style.cursor = "pointer";
            trigger.title = "Click to log out";
            trigger.addEventListener("click", (e) => {
                e.stopPropagation();
                performLogout();
            });
        }
    });

}


/* =========================================================
   VOUCHER
========================================================= */

function setupVoucherButton() {

    const button =
        document.getElementById(
            "downloadVoucher"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            window.print();

        }
    );

}


/* =========================================================
   WALLET
========================================================= */

function setupWalletButton() {

    const button =
        document.getElementById(
            "walletButton"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            alert(
                "Your digital reservation voucher is ready to be added to your wallet."
            );

        }
    );

}


/* =========================================================
   MODIFY RESERVATION
========================================================= */

function setupModifyButton() {

    const button =
        document.getElementById(
            "modifyButton"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            window.location.href =
                "reservation.html";

        }
    );

}


/* =========================================================
   EDIT CONTACT
========================================================= */

function setupContactEditor() {

    const button =
        document.getElementById(
            "editContact"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            const currentName =
                getStoredValue(
                    "guestName",
                    reservationData.guestName
                );


            const currentEmail =
                getStoredValue(
                    "guestEmail",
                    reservationData.email
                );


            const currentMobile =
                getStoredValue(
                    "guestMobile",
                    reservationData.mobile
                );


            const newName =
                window.prompt(
                    "Full Name:",
                    currentName
                );


            if (
                newName === null ||
                newName.trim() === ""
            ) {

                return;

            }


            const newEmail =
                window.prompt(
                    "Email Address:",
                    currentEmail
                );


            if (
                newEmail === null ||
                newEmail.trim() === ""
            ) {

                return;

            }


            const newMobile =
                window.prompt(
                    "Mobile Number:",
                    currentMobile
                );


            if (
                newMobile === null ||
                newMobile.trim() === ""
            ) {

                return;

            }


            localStorage.setItem(
                "guestName",
                newName.trim()
            );


            localStorage.setItem(
                "guestEmail",
                newEmail.trim()
            );


            localStorage.setItem(
                "guestMobile",
                newMobile.trim()
            );


            updateGuestInformation();


            alert(
                "Contact details updated."
            );

        }
    );

}


/* =========================================================
   MAP
========================================================= */

function setupMapButton() {

    const button =
        document.getElementById(
            "mapButton"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            const destination =
                encodeURIComponent(
                    "Bagasbas Beach Road, Daet, Camarines Norte, Philippines"
                );


            window.open(
                `https://www.google.com/maps/search/?api=1&query=${destination}`,
                "_blank"
            );

        }
    );

}


/* =========================================================
   CONCIERGE CALL
========================================================= */

function setupConciergeButton() {

    const button =
        document.getElementById(
            "callConcierge"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            window.location.href =
                "tel:+630548812345";

        }
    );

}


/* =========================================================
   TAX INVOICE
========================================================= */

function setupInvoiceButton() {

    const button =
        document.getElementById(
            "invoiceButton"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            window.print();

        }
    );

}


/* =========================================================
   PAYMENT
========================================================= */

function calculateSubtotal() {

    return reservationData.facilities.reduce(
        (
            total,
            facility
        ) => {

            return total +
                facility.price;

        },
        0
    );

}


function updatePaymentSummary() {

    const subtotal =
        calculateSubtotal();


    const tourismFee =
        250;


    const serviceCharge =
        subtotal * 0.08;


    const total =
        subtotal +
        tourismFee +
        serviceCharge;


    const subtotalElement =
        document.getElementById(
            "subtotalAmount"
        );


    const serviceElement =
        document.getElementById(
            "serviceCharge"
        );


    const totalElement =
        document.getElementById(
            "totalPaid"
        );


    if (subtotalElement) {

        subtotalElement.textContent =
            formatPeso(subtotal);

    }


    if (serviceElement) {

        serviceElement.textContent =
            formatPeso(serviceCharge);

    }


    if (totalElement) {

        totalElement.textContent =
            formatPeso(total);

    }

}


function formatPeso(
    amount
) {

    return "₱" +
        amount.toLocaleString(
            "en-PH",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

}


/* =========================================================
   ADD-ON BUTTONS
========================================================= */

function setupAddonButtons() {

    const buttons =
        document.querySelectorAll(
            ".addon-button"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const name =
                        button.dataset.name;


                    const price =
                        Number(
                            button.dataset.price
                        );


                    if (
                        !name ||
                        Number.isNaN(price)
                    ) {

                        return;

                    }


                    reservationData.facilities.push(
                        {
                            name,
                            price
                        }
                    );


                    button.textContent =
                        "Added";


                    button.disabled =
                        true;


                    updatePaymentSummary();


                    updateExperienceCount();


                    alert(
                        `${name} has been added to your stay.`
                    );

                }
            );

        }
    );

}


/* =========================================================
   EXPERIENCE COUNT
========================================================= */

function updateExperienceCount() {

    const count =
        reservationData.facilities.length;


    const element =
        document.getElementById(
            "experienceCount"
        );


    if (!element) {
        return;
    }


    element.textContent =
        `${count} CONFIRMED EXPERIENCES`;

}


/* =========================================================
   RESERVATION STATUS
========================================================= */

function checkLoginState() {

    const isLoggedIn =
        localStorage.getItem(
            "isLoggedIn"
        );


    /*
        This is only a front-end demo check.
        Do not use localStorage as production authentication.
    */

    if (
        isLoggedIn !== "true"
    ) {

        /*
            Keep the reservation page visible
            for the current demo.

            Production authentication should
            perform server-side verification.
        */

        console.log(
            "Reservation page opened without active demo login."
        );

    }

}


/* =========================================================
   PRINT
========================================================= */

window.addEventListener(
    "beforeprint",
    () => {

        document
            .querySelectorAll(
                ".sidebar, .top-header"
            )
            .forEach(
                element => {

                    element.dataset.printHidden =
                        "true";

                }
            );

    }
);


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        checkLoginState();

        updateGuestInformation();

        setupNavigation();

        setupVoucherButton();

        setupWalletButton();

        setupModifyButton();

        setupContactEditor();

        setupMapButton();

        setupConciergeButton();

        setupInvoiceButton();

        setupAddonButtons();

        updatePaymentSummary();

        updateExperienceCount();

    }
);