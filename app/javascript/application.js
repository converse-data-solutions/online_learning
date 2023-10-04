// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"

  // var player = videojs('video-<%= @lesson.id %>');

  // function skipForward(seconds) {
  //   var currentTime = player.currentTime();
  //   player.currentTime(currentTime + seconds);
  // }

  // function skipBackward(seconds) {
  //   var currentTime = player.currentTime();
  //   player.currentTime(currentTime - seconds);
  // }

  // var forwardButton = document.createElement('button');
  // forwardButton.innerHTML = 'Skip Forward 10s';
  // forwardButton.addEventListener('click', function() {
  //   skipForward(10); 
  // });

  // var backwardButton = document.createElement('button');
  // backwardButton.innerHTML = 'Skip Backward 10s';
  // backwardButton.addEventListener('click', function() {
  //   skipBackward(10); 
  // });

  // player.controlBar.addChild(forwardButton);
  // player.controlBar.addChild(backwardButton);

  // Ratings.

document.addEventListener("DOMContentLoaded", () => {
  const stars = document.querySelectorAll(".rating-star");

  stars.forEach((star) => {
    star.addEventListener("click", () => {
      const starValue = star.getAttribute("data-star-value");
      document.getElementById("rating_star").value = starValue;

      // Toggle 'rated' class for clicked and previous stars
      stars.forEach((s) => {
        const sValue = s.getAttribute("data-star-value");
        s.classList.toggle("rated", sValue <= starValue);
      });
    });
  });
});
