"use strict";


/* =========================================================
   CATHERINE'S BAGASBAS LIGHTHOUSE RESORT
   RESERVATION PAGE JAVASCRIPT
========================================================= */


/* =========================================================
   AUTHENTICATION
========================================================= */

const isLoggedIn =
    localStorage.getItem("isLoggedIn") === "true";


/*
    The reservation page can still be viewed directly.

    Login enforcement can be enabled later when the
    authentication system is fully connected.
*/


/* =========================================================
   NAVIGATION BUTTONS
========================================================= */

const bookButton =
    document.getElementById("bookButton");


const profileButton =
    document.getElementById("profileButton");


/*
    BOOK NOW
*/

if (bookButton) {

    bookButton.addEventListener(
        "click",
        () => {

            if (isLoggedIn) {

                window.location.href =
                    "reservation.html";

            } else {

                window.location.href =
                    "login.html";

            }

        }
    );

}


/*
    PROFILE
*/

if (profileButton) {

    profileButton.addEventListener(
        "click",
        () => {

            if (isLoggedIn) {

                window.location.href =
                    "guest-dashboard.html";

            } else {

                window.location.href =
                    "login.html";

            }

        }
    );

}


/* =========================================================
   RESERVATION STATE
========================================================= */

const reservationData = {

    adults: 2,

    children: 0,

    senior: 0,

    facilities: []

};


/* =========================================================
   DOM ELEMENTS
========================================================= */

const checkinDate =
    document.getElementById(
        "checkinDate"
    );


const stayDuration =
    document.getElementById(
        "stayDuration"
    );


const fullName =
    document.getElementById(
        "fullName"
    );


const mobileNumber =
    document.getElementById(
        "mobileNumber"
    );


const emailAddress =
    document.getElementById(
        "emailAddress"
    );


const specialRequests =
    document.getElementById(
        "specialRequests"
    );


/* =========================================================
   SET MINIMUM CHECK-IN DATE
========================================================= */

function setMinimumDate() {

    if (!checkinDate) {
        return;
    }


    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            today.getDate()
        ).padStart(
            2,
            "0"
        );


    const formattedDate =
        `${year}-${month}-${day}`;


    checkinDate.min =
        formattedDate;


    /*
        Only set today's date when the
        field doesn't already contain one.
    */

    if (!checkinDate.value) {

        checkinDate.value =
            formattedDate;

    }

}


setMinimumDate();


/* =========================================================
   LOAD PENDING RESERVATION FROM INDEX
========================================================= */

function loadPendingReservation() {

    const saved =
        sessionStorage.getItem(
            "pendingReservation"
        );


    if (!saved) {
        return;
    }


    try {

        const pending =
            JSON.parse(
                saved
            );


        /*
            Date
        */

        if (
            pending.date &&
            checkinDate
        ) {

            checkinDate.value =
                pending.date;

        }


        /*
            Duration
        */

        if (
            pending.duration &&
            stayDuration
        ) {

            const options =
                Array.from(
                    stayDuration.options
                );


            const matchingOption =
                options.find(
                    option =>
                        option.value ===
                        pending.duration ||
                        option.textContent.trim() ===
                        pending.duration
                );


            if (
                matchingOption
            ) {

                stayDuration.value =
                    matchingOption.value;

            }

        }


        /*
            Guest count
        */

        if (pending.guests) {

            const match =
                pending.guests.match(
                    /(\d+)/
                );


            if (match) {

                const guestCount =
                    Number(
                        match[1]
                    );


                if (
                    Number.isFinite(
                        guestCount
                    ) &&
                    guestCount > 0
                ) {

                    reservationData.adults =
                        Math.min(
                            guestCount,
                            4
                        );

                }

            }

        }


        /*
            Facility / quarters
        */

        if (
            pending.quarters
        ) {

            selectMatchingFacility(
                pending.quarters
            );

        }


        /*
            Remove the pending
            data after loading.
        */

        sessionStorage.removeItem(
            "pendingReservation"
        );

    }
    catch (error) {

        console.error(
            "Could not load pending reservation:",
            error
        );

    }

}


/* =========================================================
   SELECT FACILITY FROM INDEX DATA
========================================================= */

function selectMatchingFacility(
    quarters
) {

    const normalized =
        String(
            quarters
        )
        .toLowerCase();


    let targetValue =
        null;


    if (
        normalized.includes(
            "cottage"
        )
    ) {

        targetValue =
            "cottage";

    }
    else if (
        normalized.includes(
            "pool"
        ) ||
        normalized.includes(
            "bridge"
        )
    ) {

        targetValue =
            "pool";

    }
    else if (
        normalized.includes(
            "ktv"
        )
    ) {

        targetValue =
            "ktv";

    }
    else if (
        normalized.includes(
            "celebration"
        ) ||
        normalized.includes(
            "event"
        )
    ) {

        targetValue =
            "event";

    }
    else if (
        normalized.includes(
            "buyout"
        )
    ) {

        targetValue =
            "buyout";

    }


    if (!targetValue) {
        return;
    }


    const checkbox =
        document.querySelector(
            `input[name="facility"][value="${targetValue}"]`
        );


    if (!checkbox) {
        return;
    }


    checkbox.checked =
        true;


    checkbox
        .closest(
            ".facility-option"
        )
        ?.classList.add(
            "selected"
        );

}


/* =========================================================
   GUEST COUNTERS
========================================================= */

const counterButtons =
    document.querySelectorAll(
        ".counter-button"
    );


counterButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const counter =
                    button.dataset.counter;


                const action =
                    button.dataset.action;


                if (
                    !Object.prototype.hasOwnProperty.call(
                        reservationData,
                        counter
                    )
                ) {

                    return;

                }


                if (
                    action === "plus"
                ) {

                    reservationData[counter]++;

                }


                if (
                    action === "minus"
                ) {

                    reservationData[counter]--;

                }


                /*
                    Minimum of one adult.
                */

                if (
                    counter === "adults" &&
                    reservationData.adults < 1
                ) {

                    reservationData.adults =
                        1;

                }


                /*
                    Children cannot go below 0.
                */

                if (
                    counter === "children" &&
                    reservationData.children < 0
                ) {

                    reservationData.children =
                        0;

                }


                /*
                    Senior/PWD cannot go below 0.
                */

                if (
                    counter === "senior" &&
                    reservationData.senior < 0
                ) {

                    reservationData.senior =
                        0;

                }


                updateGuestCounters();

                updateSummary();

            }
        );

    }
);


/* =========================================================
   UPDATE GUEST COUNTER DISPLAY
========================================================= */

function updateGuestCounters() {

    const adultCount =
        document.getElementById(
            "adultCount"
        );


    const childrenCount =
        document.getElementById(
            "childrenCount"
        );


    const seniorCount =
        document.getElementById(
            "seniorCount"
        );


    if (adultCount) {

        adultCount.textContent =
            reservationData.adults;

    }


    if (childrenCount) {

        childrenCount.textContent =
            reservationData.children;

    }


    if (seniorCount) {

        seniorCount.textContent =
            reservationData.senior;

    }

}


/* =========================================================
   FACILITY SELECTION
========================================================= */

const facilityOptions =
    document.querySelectorAll(
        ".facility-option"
    );


facilityOptions.forEach(
    option => {

        const checkbox =
            option.querySelector(
                'input[name="facility"]'
            );


        if (!checkbox) {
            return;
        }


        checkbox.addEventListener(
            "change",
            () => {

                /*
                    FULL BUYOUT
                    is mutually exclusive.
                */

                if (
                    checkbox.value ===
                    "buyout" &&
                    checkbox.checked
                ) {

                    document
                        .querySelectorAll(
                            'input[name="facility"]'
                        )
                        .forEach(
                            other => {

                                if (
                                    other !==
                                    checkbox
                                ) {

                                    other.checked =
                                        false;


                                    other
                                        .closest(
                                            ".facility-option"
                                        )
                                        ?.classList
                                        .remove(
                                            "selected"
                                        );

                                }

                            }
                        );

                }


                /*
                    Selecting any regular facility
                    removes buyout.
                */

                if (
                    checkbox.value !==
                    "buyout" &&
                    checkbox.checked
                ) {

                    const buyout =
                        document.querySelector(
                            'input[name="facility"][value="buyout"]'
                        );


                    if (
                        buyout &&
                        buyout.checked
                    ) {

                        buyout.checked =
                            false;


                        buyout
                            .closest(
                                ".facility-option"
                            )
                            ?.classList.remove(
                                "selected"
                            );

                    }

                }


                option.classList.toggle(
                    "selected",
                    checkbox.checked
                );


                updateFacilities();

                updateSummary();

            }
        );

    }
);


/* =========================================================
   GET FACILITY NAME
========================================================= */

function getFacilityName(
    value
) {

    const names = {

        cottage:
            "Private Seaside Cottage",

        pool:
            "Swimming Pool & Arched Bridge",

        ktv:
            "Lighthouse KTV Lounge",

        event:
            "Celebration Grand Event Place",

        buyout:
            "Full Catherine's Resort Buyout"

    };


    return (
        names[value] ||
        value
    );

}


/* =========================================================
   UPDATE SELECTED FACILITIES
========================================================= */

function updateFacilities() {

    reservationData.facilities =
        [];


    const selected =
        document.querySelectorAll(
            'input[name="facility"]:checked'
        );


    selected.forEach(
        checkbox => {

            const price =
                Number(
                    checkbox.dataset.price
                );


            reservationData.facilities.push({

                name:
                    getFacilityName(
                        checkbox.value
                    ),

                price:
                    Number.isFinite(
                        price
                    )
                        ? price
                        : 0,

                value:
                    checkbox.value

            });

        }
    );

}


/* =========================================================
   CALCULATE PRICE
========================================================= */

function calculatePrices() {

    const subtotal =
        reservationData.facilities.reduce(
            (
                total,
                facility
            ) => {

                return (
                    total +
                    facility.price
                );

            },
            0
        );


    /*
        Demo tax value based on the
        current reservation design.
    */

    const tourismTax =
        subtotal > 0
            ? 250
            : 0;


    /*
        8% resort service charge.
    */

    const serviceCharge =
        subtotal *
        0.08;


    const total =
        subtotal +
        tourismTax +
        serviceCharge;


    return {

        subtotal,

        tourismTax,

        serviceCharge,

        total

    };

}


/* =========================================================
   CURRENCY FORMAT
========================================================= */

function formatCurrency(
    amount
) {

    const safeAmount =
        Number.isFinite(
            amount
        )
            ? amount
            : 0;


    return (
        "₱" +
        safeAmount.toLocaleString(
            "en-PH",
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }
        )
    );

}


/* =========================================================
   GET TOTAL GUESTS
========================================================= */

function getTotalGuests() {

    return (
        reservationData.adults +
        reservationData.children +
        reservationData.senior
    );

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatReservationDate(
    value
) {

    if (!value) {

        return "Select date";

    }


    const date =
        new Date(
            `${value}T00:00:00`
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Select date";

    }


    return date.toLocaleDateString(
        "en-PH",
        {
            month:
                "long",

            day:
                "numeric",

            year:
                "numeric"
        }
    );

}


/* =========================================================
   UPDATE SUMMARY SIDEBAR
========================================================= */

function updateSummary() {

    updateFacilities();


    const prices =
        calculatePrices();


    /*
        Guest count
    */

    const totalGuests =
        getTotalGuests();


    const summaryGuestCount =
        document.getElementById(
            "summaryGuestCount"
        );


    if (
        summaryGuestCount
    ) {

        summaryGuestCount.textContent =
            `${totalGuests} Guest${totalGuests !== 1 ? "s" : ""}`;

    }


    /*
        Guest name
    */

    const summaryGuestName =
        document.getElementById(
            "summaryGuestName"
        );


    if (
        summaryGuestName
    ) {

        summaryGuestName.textContent =
            fullName &&
            fullName.value.trim()
                ? fullName.value.trim()
                : "Guest";

    }


    /*
        Date
    */

    const summaryDate =
        document.getElementById(
            "summaryDate"
        );


    if (
        summaryDate
    ) {

        summaryDate.textContent =
            formatReservationDate(
                checkinDate
                    ? checkinDate.value
                    : ""
            );

    }


    /*
        Subtotal
    */

    const subtotal =
        document.getElementById(
            "subtotal"
        );


    if (subtotal) {

        subtotal.textContent =
            formatCurrency(
                prices.subtotal
            );

    }


    /*
        Tax
    */

    const tax =
        document.getElementById(
            "tax"
        );


    if (tax) {

        tax.textContent =
            formatCurrency(
                prices.tourismTax
            );

    }


    /*
        Service charge
    */

    const serviceCharge =
        document.getElementById(
            "serviceCharge"
        );


    if (serviceCharge) {

        serviceCharge.textContent =
            formatCurrency(
                prices.serviceCharge
            );

    }


    /*
        Total
    */

    const totalPrice =
        document.getElementById(
            "totalPrice"
        );


    if (totalPrice) {

        totalPrice.textContent =
            formatCurrency(
                prices.total
            );

    }


    /*
        Summary facilities
    */

    const summaryFacilities =
        document.getElementById(
            "summaryFacilities"
        );


    if (
        summaryFacilities
    ) {

        if (
            reservationData.facilities.length === 0
        ) {

            summaryFacilities.innerHTML = `
                <div>
                    <span>
                        No facilities selected
                    </span>

                    <strong>
                        ₱0
                    </strong>
                </div>
            `;

        }
        else {

            summaryFacilities.innerHTML =
                reservationData.facilities
                    .map(
                        facility => `
                            <div>

                                <span>
                                    ${escapeHtml(
                                        facility.name
                                    )}
                                </span>

                                <strong>
                                    ${formatCurrency(
                                        facility.price
                                    )}
                                </strong>

                            </div>
                        `
                    )
                    .join("");

        }

    }

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(
    value
) {

    return String(
        value
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   INPUT EVENTS
========================================================= */

[
    checkinDate,

    stayDuration,

    fullName,

    mobileNumber,

    emailAddress,

    specialRequests
]
.forEach(
    element => {

        if (!element) {
            return;
        }


        element.addEventListener(
            "input",
            () => {

                updateSummary();

            }
        );


        element.addEventListener(
            "change",
            () => {

                updateSummary();

            }
        );

    }
);


/* =========================================================
   PAGE SECTION NAVIGATION
========================================================= */

const nextButtons =
    document.querySelectorAll(
        ".next-step"
    );


const previousButtons =
    document.querySelectorAll(
        ".previous-step"
    );


const progressSteps =
    document.querySelectorAll(
        ".progress-step"
    );


/* =========================================================
   UPDATE PROGRESS BAR
========================================================= */

function updateProgress(
    currentStep
) {

    progressSteps.forEach(
        step => {

            const stepNumber =
                Number(
                    step.dataset.step
                );


            step.classList.remove(
                "completed",
                "active"
            );


            if (
                stepNumber <
                currentStep
            ) {

                step.classList.add(
                    "completed"
                );

            }


            if (
                stepNumber ===
                currentStep
            ) {

                step.classList.add(
                    "active"
                );

            }

        }
    );

}


/* =========================================================
   SCROLL TO RESERVATION SECTION
========================================================= */

function scrollToStep(
    stepNumber
) {

    const sectionMap = {

        1:
            "schedule-section",

        2:
            "guest-information-section",

        3:
            "facility-selection-section",

        4:
            "review-section"

    };


    const targetId =
        sectionMap[stepNumber];


    if (!targetId) {
        return;
    }


    const target =
        document.getElementById(
            targetId
        );


    if (!target) {
        return;
    }


    /*
        Approximate sticky header
        offset.
    */

    const offset =
        125;


    const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        offset;


    window.scrollTo({

        top:
            Math.max(
                targetPosition,
                0
            ),

        behavior:
            "smooth"

    });


    updateProgress(
        stepNumber
    );

}


/* =========================================================
   VALIDATE STEP
========================================================= */

function validateStep(
    step
) {

    /*
        STEP 1
    */

    if (
        step === 1
    ) {

        if (
            !checkinDate ||
            !checkinDate.value
        ) {

            alert(
                "Please select your check-in date."
            );


            if (checkinDate) {

                checkinDate.focus();

            }


            return false;

        }


        if (
            reservationData.adults < 1
        ) {

            alert(
                "At least one adult guest is required."
            );


            return false;

        }


        return true;

    }


    /*
        STEP 2
    */

    if (
        step === 2
    ) {

        if (
            !fullName ||
            !fullName.value.trim()
        ) {

            alert(
                "Please enter the primary guest's full legal name."
            );


            if (fullName) {

                fullName.focus();

            }


            return false;

        }


        if (
            !mobileNumber ||
            !mobileNumber.value.trim()
        ) {

            alert(
                "Please enter a mobile number."
            );


            if (mobileNumber) {

                mobileNumber.focus();

            }


            return false;

        }


        if (
            !emailAddress ||
            !emailAddress.value.trim()
        ) {

            alert(
                "Please enter an email address."
            );


            if (emailAddress) {

                emailAddress.focus();

            }


            return false;

        }


        if (
            emailAddress &&
            !emailAddress.checkValidity()
        ) {

            alert(
                "Please enter a valid email address."
            );


            emailAddress.focus();


            return false;

        }


        return true;

    }


    /*
        STEP 3
    */

    if (
        step === 3
    ) {

        updateFacilities();


        if (
            reservationData.facilities.length === 0
        ) {

            alert(
                "Please select at least one facility or experience."
            );


            return false;

        }


        return true;

    }


    return true;

}


/* =========================================================
   NEXT BUTTON EVENTS
========================================================= */

nextButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const currentSection =
                    button.closest(
                        ".reservation-step"
                    );


                if (!currentSection) {
                    return;
                }


                const currentStep =
                    Number(
                        currentSection.dataset
                            .stepContent
                    );


                const nextStep =
                    Number(
                        button.dataset.next
                    );


                /*
                    Stop when validation fails.
                */

                if (
                    !validateStep(
                        currentStep
                    )
                ) {

                    return;

                }


                /*
                    Prepare review
                    before entering Step 4.
                */

                if (
                    nextStep === 4
                ) {

                    prepareReview();

                }


                scrollToStep(
                    nextStep
                );

            }
        );

    }
);


/* =========================================================
   PREVIOUS BUTTON EVENTS
========================================================= */

previousButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const previousStep =
                    Number(
                        button.dataset.previous
                    );


                scrollToStep(
                    previousStep
                );

            }
        );

    }
);


/* =========================================================
   PROGRESS STEP CLICK
========================================================= */

progressSteps.forEach(
    step => {

        step.style.cursor =
            "pointer";


        step.addEventListener(
            "click",
            () => {

                const stepNumber =
                    Number(
                        step.dataset.step
                    );


                scrollToStep(
                    stepNumber
                );

            }
        );

    }
);


/* =========================================================
   DETECT CURRENT SECTION WHILE SCROLLING
========================================================= */

let scrollTimeout =
    null;


function detectCurrentSection() {

    const sections =
        document.querySelectorAll(
            ".reservation-step"
        );


    if (
        !sections.length
    ) {

        return;

    }


    const marker =
        window.scrollY + 180;


    let currentStep =
        1;


    sections.forEach(
        section => {

            const top =
                section.offsetTop;


            if (
                marker >= top
            ) {

                currentStep =
                    Number(
                        section.dataset
                            .stepContent
                    );

            }

        }
    );


    updateProgress(
        currentStep
    );

}


window.addEventListener(
    "scroll",
    () => {

        if (
            scrollTimeout
        ) {

            clearTimeout(
                scrollTimeout
            );

        }


        scrollTimeout =
            setTimeout(
                detectCurrentSection,
                50
            );

    },
    {
        passive: true
    }
);


/* =========================================================
   PREPARE REVIEW
========================================================= */

function prepareReview() {

    updateFacilities();


    /*
        DATE
    */

    const reviewDate =
        document.getElementById(
            "reviewDate"
        );


    if (reviewDate) {

        reviewDate.textContent =
            formatReservationDate(
                checkinDate
                    ? checkinDate.value
                    : ""
            );

    }


    /*
        DURATION
    */

    const reviewDuration =
        document.getElementById(
            "reviewDuration"
        );


    if (
        reviewDuration &&
        stayDuration
    ) {

        const selected =
            stayDuration
                .selectedOptions[0];


        reviewDuration.textContent =
            selected
                ? selected.textContent.trim()
                : "—";

    }


    /*
        GUESTS
    */

    const reviewGuests =
        document.getElementById(
            "reviewGuests"
        );


    if (reviewGuests) {

        const totalGuests =
            getTotalGuests();


        reviewGuests.textContent =
            `${totalGuests} total — ` +
            `${reservationData.adults} adults, ` +
            `${reservationData.children} children, ` +
            `${reservationData.senior} senior/PWD`;

    }


    /*
        PRIMARY GUEST
    */

    const reviewGuestName =
        document.getElementById(
            "reviewGuestName"
        );


    if (reviewGuestName) {

        reviewGuestName.textContent =
            fullName &&
            fullName.value.trim()
                ? fullName.value.trim()
                : "—";

    }


    /*
        EMAIL
    */

    const reviewEmail =
        document.getElementById(
            "reviewEmail"
        );


    if (reviewEmail) {

        reviewEmail.textContent =
            emailAddress &&
            emailAddress.value.trim()
                ? emailAddress.value.trim()
                : "—";

    }


    /*
        FACILITIES
    */

    const reviewFacilities =
        document.getElementById(
            "reviewFacilities"
        );


    if (!reviewFacilities) {
        return;
    }


    if (
        reservationData.facilities.length === 0
    ) {

        reviewFacilities.innerHTML = `
            <p>
                No facilities selected.
            </p>
        `;

        return;

    }


    reviewFacilities.innerHTML =
        reservationData.facilities
            .map(
                facility => `

                    <div
                        class="review-facility-item"
                    >

                        <span>
                            ${escapeHtml(
                                facility.name
                            )}
                        </span>

                        <strong>
                            ${formatCurrency(
                                facility.price
                            )}
                        </strong>

                    </div>

                `
            )
            .join("");

}


/* =========================================================
   SAVE RESERVATION DATA
========================================================= */

function buildReservationObject(
    reference
) {

    const prices =
        calculatePrices();


    return {

        reference,

        checkinDate:
            checkinDate
                ? checkinDate.value
                : "",

        duration:
            stayDuration
                ? stayDuration.value
                : "",

        adults:
            reservationData.adults,

        children:
            reservationData.children,

        senior:
            reservationData.senior,

        totalGuests:
            getTotalGuests(),

        honorific:
            document.getElementById(
                "honorific"
            )?.value || "",

        guestName:
            fullName
                ? fullName.value.trim()
                : "",

        mobile:
            mobileNumber
                ? mobileNumber.value.trim()
                : "",

        email:
            emailAddress
                ? emailAddress.value.trim()
                : "",

        specialRequests:
            specialRequests
                ? specialRequests.value.trim()
                : "",

        facilities:
            reservationData.facilities,

        prices,

        status:
            "Pending Verification",

        createdAt:
            new Date().toISOString()

    };

}


/* =========================================================
   CONFIRM RESERVATION
========================================================= */

const confirmButton =
    document.getElementById(
        "confirmReservation"
    );


const successModal =
    document.getElementById(
        "successModal"
    );


const confirmationNumber =
    document.getElementById(
        "confirmationNumber"
    );


if (confirmButton) {

    confirmButton.addEventListener(
        "click",
        () => {

            /*
                Validate every required
                section before confirming.
            */

            if (
                !validateStep(1)
            ) {

                scrollToStep(1);

                return;

            }


            if (
                !validateStep(2)
            ) {

                scrollToStep(2);

                return;

            }


            if (
                !validateStep(3)
            ) {

                scrollToStep(3);

                return;

            }


            /*
                Terms
            */

            const terms =
                document.getElementById(
                    "agreeTerms"
                );


            if (
                !terms ||
                !terms.checked
            ) {

                alert(
                    "Please confirm that you agree to the reservation terms before continuing."
                );


                if (terms) {

                    terms.focus();

                }


                scrollToStep(4);

                return;

            }


            /*
                Generate temporary reference.
            */

            const randomNumber =
                Math.floor(
                    100000 +
                    Math.random() *
                    900000
                );


            const reference =
                `CBLR-${randomNumber}`;


            if (
                confirmationNumber
            ) {

                confirmationNumber.textContent =
                    reference;

            }


            /*
                Create reservation object.
            */

            const reservation =
                buildReservationObject(
                    reference
                );


            /*
                Save current reservation.
            */

            localStorage.setItem(
                "currentReservation",
                JSON.stringify(
                    reservation
                )
            );


            /*
                Also save reservation history.
            */

            saveReservationHistory(
                reservation
            );


            /*
                Send Confirmation Email via EmailJS
            */

            sendReservationConfirmationEmail(reservation);


            /*
                Show confirmation modal.
            */

            if (
                successModal
            ) {

                successModal.classList.add(
                    "show"
                );

                document.body.style.overflow =
                    "hidden";

            }

        }
    );

}


/* =========================================================
   EMAILJS RESERVATION CONFIRMATION EMAIL
========================================================= */

const EMAILJS_CONFIG = {
    PUBLIC_KEY: "qiKerR2jT2TV2n4eO",
    SERVICE_ID: "service_cse4f86",
    TEMPLATE_ID: "template_97nryvr"
};

// Initialize EmailJS
if (typeof emailjs !== "undefined" && EMAILJS_CONFIG.PUBLIC_KEY) {
    try {
        emailjs.init({
            publicKey: EMAILJS_CONFIG.PUBLIC_KEY
        });
    } catch (err) {
        console.error("EmailJS init error in reservation.js:", err);
    }
}

function sendReservationConfirmationEmail(reservation) {
    if (!reservation || !reservation.email) return;

    if (typeof emailjs === "undefined" || !EMAILJS_CONFIG.SERVICE_ID || EMAILJS_CONFIG.SERVICE_ID === "YOUR_SERVICE_ID") {
        console.log("EmailJS not configured for reservation emails.");
        return;
    }

    const facilityNames = (reservation.facilities || []).map(f => f.name).join(", ") || "Seaside Resort Package";
    const totalPriceFormatted = reservation.prices ? `₱${(reservation.prices.total || 0).toLocaleString()}` : "₱0";

    const templateParams = {
        to_email: reservation.email,
        email: reservation.email,
        user_email: reservation.email,
        guest_name: reservation.guestName || "Valued Guest",
        email_subject: `Reservation Confirmation #${reservation.reference} - Catherine's Sanctuary`,
        email_title: `Reservation Confirmation #${reservation.reference}`,
        message_body: `Thank you for booking with Catherine's Bagasbas Lighthouse Resort! Your reservation #${reservation.reference} for ${reservation.checkinDate || "your stay"} has been recorded successfully.`,
        reservation_ref: reservation.reference,
        booking_ref: reservation.reference,
        checkin_date: reservation.checkinDate || "TBD",
        stay_duration: reservation.duration || "Standard Stay",
        total_guests: reservation.totalGuests || 1,
        facilities_summary: facilityNames,
        total_price: totalPriceFormatted,
        code: `Reservation Ref: ${reservation.reference}`,
        verification_code: `Reservation Ref: ${reservation.reference}`
    };

    emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams,
        { publicKey: EMAILJS_CONFIG.PUBLIC_KEY }
    ).then((res) => {
        console.log("Reservation confirmation email sent successfully:", res);
        const modalP = document.querySelector("#successModal p");
        if (modalP) {
            modalP.innerHTML = `Thank you, <strong>${escapeHtml(reservation.guestName)}</strong>! Your reservation (<strong>${reservation.reference}</strong>) has been recorded, and a confirmation email has been dispatched to <strong>${escapeHtml(reservation.email)}</strong>.`;
        }
    }).catch((err) => {
        console.error("Failed to send reservation confirmation email:", err);
    });
}


/* =========================================================
/* =========================================================
   RESERVATION HISTORY & MASTER SYNC
========================================================= */

function saveReservationHistory(
    reservation
) {

    // 1. If ResortDB engine is available, use its synchronized registration
    if (
        typeof window !== "undefined" &&
        window.ResortDB &&
        typeof window.ResortDB.addReservation === "function"
    ) {
        window.ResortDB.addReservation(reservation);
        return;
    }

    // 2. Direct fallback
    let history = [];
    const saved = localStorage.getItem("reservationHistory");

    if (saved) {
        try {
            history = JSON.parse(saved);
            if (!Array.isArray(history)) {
                history = [];
            }
        } catch {
            history = [];
        }
    }

    // Prepend new reservation to appear at top of list
    history.unshift(reservation);

    localStorage.setItem(
        "reservationHistory",
        JSON.stringify(history)
    );

    // Broadcast sync trigger to update open admin tabs
    localStorage.setItem(
        "resort_reservation_sync",
        Date.now().toString()
    );

    try {
        if (typeof window !== "undefined") {
            window.dispatchEvent(
                new CustomEvent("resort:reservation-added", {
                    detail: reservation
                })
            );
        }
    } catch (e) {}

}


/* =========================================================
   CLOSE SUCCESS MODAL
========================================================= */

const closeModal =
    document.getElementById(
        "closeModal"
    );


if (closeModal) {

    closeModal.addEventListener(
        "click",
        () => {

            document.body.style.overflow =
                "";


            window.location.href =
                "guest-dashboard.html";

        }
    );

}


/* =========================================================
   CLOSE MODAL WHEN CLICKING BACKDROP
========================================================= */

if (
    successModal
) {

    successModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                successModal
            ) {

                successModal.classList.remove(
                    "show"
                );


                document.body.style.overflow =
                    "";

            }

        }
    );

}


/* =========================================================
   ESC KEY CLOSES MODAL
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            successModal &&
            successModal.classList.contains(
                "show"
            )
        ) {

            successModal.classList.remove(
                "show"
            );


            document.body.style.overflow =
                "";

        }

    }
);


/* =========================================================
   INITIALIZE PAGE
========================================================= */

loadPendingReservation();

updateGuestCounters();

updateFacilities();

updateSummary();

updateProgress(1);

detectCurrentSection();