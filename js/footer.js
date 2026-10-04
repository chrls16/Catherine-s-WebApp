document.addEventListener("DOMContentLoaded", () => {

  const footerContainer =
    document.getElementById("footer-container");

  if (!footerContainer) {
    return;
  }

  fetch("components/footer.html")
    .then(response => {

      if (!response.ok) {
        throw new Error(
          `Failed to load footer: ${response.status}`
        );
      }

      return response.text();

    })

    .then(html => {

      footerContainer.innerHTML = html;

    })

    .catch(error => {

      console.error(
        "Footer loading error:",
        error
      );

    });

});