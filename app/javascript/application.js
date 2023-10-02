// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"
videojs('my-player', {
    controlBar: {
      skipButtons: {
        forward: 5,
        backward: 10

      }
    }
  });
//   <script>
  // Initialize the Video.js player
  var player = videojs('video-<%= @lesson.id %>');

  // Add a function to skip forward by a specified number of seconds
  function skipForward(seconds) {
    var currentTime = player.currentTime();
    player.currentTime(currentTime + seconds);
  }

  // Add a function to skip backward by a specified number of seconds
  function skipBackward(seconds) {
    var currentTime = player.currentTime();
    player.currentTime(currentTime - seconds);
  }

  // Create forward and backward skip buttons
  var forwardButton = document.createElement('button');
  forwardButton.innerHTML = 'Skip Forward 10s';
  forwardButton.addEventListener('click', function() {
    skipForward(10); // Adjust the number of seconds as needed
  });

  var backwardButton = document.createElement('button');
  backwardButton.innerHTML = 'Skip Backward 10s';
  backwardButton.addEventListener('click', function() {
    skipBackward(10); // Adjust the number of seconds as needed
  });

  // Add the buttons to the player's control bar
  player.controlBar.addChild(forwardButton);
  player.controlBar.addChild(backwardButton);
// </script>
