"use strict";


/* =========================================================
   CATHERINE'S MY RESERVATION
========================================================= */


/* =========================================================
   DEMO RESERVATION DATA
========================================================= */

const reservationData = {

    guestName: "Charles",

    email: "c@gmail.com",

    mobile: "91234567890",

    guests: "2 Guests",

    bookingCode: "#CBLR-343860",

    facilities: [

        {
            name: "Private Seaside Cottage",
            price: 4500
        },

        {
            name: "Swimming Pool & Arched Bridge",
            price: 1200
        },

        {
            name: "Lighthouse KTV Lounge",
            price: 2200
        },

        {
            name: "Celebration Grand Event Place",
            price: 15000
        }

    ]

};


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
            reservationData.guestName
        );


    const guestEmail =
        getStoredValue(
            "guestEmail",
            reservationData.email
        );


    const guestMobile =
        getStoredValue(
            "guestMobile",
            reservationData.mobile
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


    const profileAvatar =
        document.getElementById(
            "profileAvatar"
        );


    if (profileAvatar) {

        profileAvatar.textContent =
            guestName
                .trim()
                .charAt(0)
                .toUpperCase();

    }


    const emailElement =
        document.getElementById(
            "contactEmail"
        );


    if (emailElement) {

        emailElement.textContent =
            guestEmail;

    }


    const mobileElement =
        document.getElementById(
            "contactMobile"
        );


    if (mobileElement) {

        mobileElement.textContent =
            guestMobile;

    }

}


/* =========================================================
   NAVIGATION
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


    const logoutButton =
        document.getElementById(
            "logoutButton"
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


                localStorage.removeItem(
                    "guestMobile"
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