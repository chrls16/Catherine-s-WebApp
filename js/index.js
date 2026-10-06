'use strict';


/* =========================================================
   LOGIN STATE
========================================================= */

const isLoggedIn = () => {
  const logged = localStorage.getItem('isLoggedIn') === 'true';
  const sessionExpiry = localStorage.getItem('sessionExpiry');

  if (logged && sessionExpiry) {
    if (Date.now() > parseInt(sessionExpiry, 10)) {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userRole');
      localStorage.removeItem('guestEmail');
      localStorage.removeItem('guestName');
      localStorage.removeItem('sessionExpiry');
      localStorage.removeItem('rememberMe');
      return false;
    }
  }

  // Verify that logged-in guest email is registered
  if (logged) {
    const role = localStorage.getItem('userRole');
    if (role === 'guest') {
      const email = localStorage.getItem('guestEmail');
      if (email) {
        try {
          const rawUsers = localStorage.getItem('resortUsers');
          if (rawUsers) {
            const users = JSON.parse(rawUsers);
            const exists = Array.isArray(users) && users.some(
              u => u && u.email && u.email.toLowerCase() === email.toLowerCase()
            );
            if (!exists) {
              localStorage.removeItem('isLoggedIn');
              localStorage.removeItem('userRole');
              localStorage.removeItem('guestEmail');
              localStorage.removeItem('guestName');
              localStorage.removeItem('sessionExpiry');
              localStorage.removeItem('rememberMe');
              return false;
            }
          }
        } catch (e) {}
      }
    }
  }

  return logged;
};


/* =========================================================
   BOOKING DESTINATION
========================================================= */

const destination = () => {

  return isLoggedIn()
    ? 'reservation.html'
    : 'login.html';

};


/* =========================================================
   PROFILE ICON
========================================================= */

const profile =
  document.getElementById('profileLink');


profile.hidden =
  !isLoggedIn();


/* =========================================================
   BOOK NOW LINKS
========================================================= */

document
  .querySelectorAll('[data-book]')
  .forEach(link => {

    link.href =
      destination();

  });


/* =========================================================
   LOGIN-AWARE LINKS
========================================================= */

[
  'dioramaPortal',
  'trackBooking',
  'footerDashboard'
]
.forEach(id => {

  const link =
    document.getElementById(id);


  if (
    link &&
    !isLoggedIn()
  ) {

    link.href =
      'login.html';

  }

});


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

const menuToggle =
  document.getElementById('menuToggle');


const nav =
  document.getElementById('mainNav');


menuToggle.addEventListener(
  'click',
  () => {

    const open =
      nav.classList.toggle('open');


    menuToggle.setAttribute(
      'aria-expanded',
      String(open)
    );


    menuToggle.textContent =
      open
        ? '✕'
        : '☰';

  }
);


/* =========================================================
   CLOSE MOBILE MENU AFTER CLICK
========================================================= */

nav
  .querySelectorAll('a')
  .forEach(link => {

    link.addEventListener(
      'click',
      () => {

        nav.classList.remove(
          'open'
        );


        menuToggle.setAttribute(
          'aria-expanded',
          'false'
        );


        menuToggle.textContent =
          '☰';

      }
    );

  });


/* =========================================================
   RESERVATION DATE
========================================================= */

const dateInput =
  document.getElementById(
    'stayDate'
  );


const today =
  new Date();


const localToday =
  new Date(
    today.getTime() -
    today.getTimezoneOffset() *
    60000
  )
  .toISOString()
  .slice(
    0,
    10
  );


dateInput.min =
  localToday;


dateInput.value =
  localToday;


/* =========================================================
   AVAILABILITY FORM
========================================================= */

document
  .getElementById(
    'availabilityForm'
  )
  .addEventListener(
    'submit',
    event => {

      event.preventDefault();


      if (!dateInput.value) {

        return dateInput.reportValidity();

      }


      sessionStorage.setItem(
        'pendingReservation',

        JSON.stringify({

          date:
            dateInput.value,

          duration:
            document.getElementById(
              'duration'
            ).value,

          guests:
            document.getElementById(
              'guests'
            ).value,

          quarters:
            document.getElementById(
              'quarters'
            ).value

        })

      );


      window.location.href =
        destination();

    }
  );


/* =========================================================
   GALLERY FILTER
========================================================= */

const filters =
  document.querySelectorAll(
    '[data-filter]'
  );


const galleryImages =
  document.querySelectorAll(
    '[data-category]'
  );


filters.forEach(
  button => {

    button.addEventListener(
      'click',
      () => {

        filters.forEach(
          item =>
            item.classList.remove(
              'selected'
            )
        );


        button.classList.add(
          'selected'
        );


        galleryImages.forEach(
          img => {

            img.hidden =
              button.dataset.filter !== 'all' &&
              img.dataset.category !==
                button.dataset.filter;

          }
        );

      }
    );

  }
);

/* =========================================================
   CURRENT YEAR
========================================================= */

document.getElementById(
  'year'
).textContent =
  new Date().getFullYear();