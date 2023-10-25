const line = document.querySelector(".lesson_video");
console.log(line);
const courseId = line.getAttribute("data-course_id");
console.log(courseId);
const line_data = line.getAttribute("data-lesson_id");
let videoId = "video-"+line_data;
console.log("video-"+line_data);
// var media = videojs("video-"+line_data, {
//     autoPlay: 'muted',
//     controls: true,
//     fluid: true,
//     playbackRates: [0.5, 1, 1.5, 2],
//     resumePlayback: true,
//     nextButton: true,
//     prevButton: true,
//     previous: true,
//     userActions: {
//       forward: true,
//       back: true,
//       hotkeys: {
//         enable: true,
//         seekStep: 5
//       }
//     }
//   });
  var player = null;
  document.addEventListener("DOMContentLoaded", function() {
    console.log("Hai");
    var videos = document.querySelectorAll('video');
      var totalDuration = 0;
    // videos.forEach(function(video) {
  
    // });

    videojs(videoId, {
      autoPlay: 'muted',
      controls: true,
      fluid: true,
      playbackRates: [0.5, 1, 1.5, 2],
      resumePlayback: true,
      nextButton: true,
      prevButton: true,
      previous: true,
      userActions: {
        forward: true,
        back: true,
        hotkeys: {
          enable: true,
          seekStep: 5
        }
      }
    }, function() {
      var player = this;
      player.on('loadedmetadata', function () {
        console.log(player.duration());
        console.log(player.currentTime());
        let videoDuration = player.duration();
        console.log(videoDuration);
        totalDuration += player.duration();

        var allVideosLoaded = Array.from(videos).every(function (v) {
          return v.readyState >= 1;
        });

        if (allVideosLoaded) {
          var totalDurationInHours = totalDuration / 3600;
          var totalDurationInMinutes = (totalDuration % 3600) / 60;
          console.log('Overall duration: ' + totalDurationInHours + ' hours ' + totalDurationInMinutes + ' minutes');
        }
        let previousPercentage = 0;

        player.on('timeupdate', function () {
        // videoDuration = video.duration
          // if (isNaN(videoDuration)) videoDuration = 0;
          console.log("Video Duration: ", videoDuration);
          player.on('timeupdate', function () {
          var currentTime = player.currentTime();
          var videoPercentage = Math.round((currentTime / videoDuration) * 100);
          console.log(videoPercentage);

        if ((videoPercentage % 10) == 0 && videoPercentage > previousPercentage) {
          previousPercentage = videoPercentage;
          console.log("Current Time of the Video Player: ", currentTime);
          console.log("Video Percentage: ", videoPercentage);

          var updateProgressUrl = "/entollment_details/update_progress?course_id=" + courseId + "&lesson_id=" + line_data + "&progress=" + videoPercentage;

          var request = new XMLHttpRequest();
          request.open("GET", updateProgressUrl, true);

          request.onload = function() {
            if (request.status === 200) {
              console.log("Successfully updated");
            } else {
              console.log("Not updated");
            }
          };

          request.onerror = function() {
            console.log("Request failed");
          };

          request.send();

         };
        });
        }); 
      });

      document.addEventListener("keydown", function (event) {
      if (document.activeElement === videos) {
        if (event.key === "ArrowRight") {
          player.currentTime(player.currentTime() + 5);
        } else if (event.key === "ArrowLeft") {
          player.currentTime(player.currentTime() - 5);
        }
      }
    });

      // player.on('play', function() {
      //   videos.forEach(function(otherVideo) {
      //     if (otherVideo !== video) {
      //       videojs(otherVideo.id).pause();
      //     }
      //   });
      // });

      console.log(player);


      const key = `videojs-resume-playback:${videoId}`;

      player.on('timeupdate', () => {
        localStorage.setItem(key, player.currentTime());
      });

      player.on('ended', () => {
        localStorage.removeItem(key);
      });

      const lastTime = parseFloat(localStorage.getItem(key));
      if (lastTime) {
        player.currentTime(lastTime);
        player.play();
      }

      player.ready(function() {
        console.log("hii")
      });

      
    });

    function goToLesson(lesson_info) {
      const activeLesson = document.querySelector(".lesson_data.active");
      const lessonLink = activeLesson && activeLesson.querySelector(".lesson_link");
      const lessonIndex = lessonLink && lessonLink.getAttribute("data-lesson-index");
      const targetLessonId = lessonIndex && "lesson-" + (parseInt(lessonIndex) + lesson_info);
      const targetLesson = targetLessonId && document.getElementById(targetLessonId);
      
      if (targetLesson) {
        const href = targetLesson.getAttribute("href");
        if (href) {
          window.location.href = href;
        }
      }
    }
    
    document.getElementById("previous-video").addEventListener("click", function() {
      goToLesson(-1);
    });
    
    document.getElementById("next-video").addEventListener("click", function() {
      goToLesson(1);
    });
    
  });