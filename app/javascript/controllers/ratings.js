function initRating() {
  var ratingForms = document.getElementById("rating-form");

  if (ratingForms) {
    const stars = ratingForms.querySelectorAll(".star");
    const ratingInput = ratingForms.querySelector(".rating-input");
    const courseId = ratingForms.dataset.courseId;

    stars.forEach((star) => {
      star.addEventListener("click", () => {
        const value = parseInt(star.getAttribute("data-value"));
        ratingInput.value = value;
        ratingForms.submit();
      });
    });
  }
}
initRating();

document.addEventListener("turbo:render", function () {
  initRating();
});
