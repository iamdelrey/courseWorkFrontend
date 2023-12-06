document.addEventListener("DOMContentLoaded", function () {
  var button = document.querySelector(".btn-light");

  button.addEventListener("click", function (event) {
    event.preventDefault();

    var target = button.getAttribute("href");
    var targetElement = document.querySelector(target);

    if (targetElement) {
      smoothScrollTo(targetElement.offsetTop, 1000);
    }
  });

  function smoothScrollTo(targetPosition, duration) {
    var startPosition = window.scrollY || window.pageYOffset;
    var startTime = null;

    function scrollAnimation(currentTime) {
      if (!startTime) startTime = currentTime;

      var elapsedTime = currentTime - startTime;
      var progress = Math.min(elapsedTime / duration, 1);
      var easeInOutQuad =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      var newPosition =
        startPosition + (targetPosition - startPosition) * easeInOutQuad;

      window.scrollTo(0, newPosition);

      if (progress < 1) {
        requestAnimationFrame(scrollAnimation);
      }
    }

    requestAnimationFrame(scrollAnimation);
  }
});
