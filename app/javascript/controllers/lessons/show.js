var player = null;

function initVideo() {
  const line = document.querySelector(".lesson_video");
  const courseId = line.getAttribute("data-course_id");
  const line_data = line.getAttribute("data-lesson_id");
  let videoId = "video-" + line_data;

  var videos = document.querySelectorAll("video");
  var totalDuration = 0;

  videojs(
    videoId,
    {
      autoPlay: "muted",
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
          seekStep: 5,
        },
      },
    },
    function () {
      var player = this;
      player.on("loadedmetadata", function () {
        let videoDuration = player.duration();
        totalDuration += player.duration();

        var allVideosLoaded = Array.from(videos).every(function (v) {
          return v.readyState >= 1;
        });

        if (allVideosLoaded) {
          var totalDurationInHours = totalDuration / 3600;
          var totalDurationInMinutes = (totalDuration % 3600) / 60;
        }
        let previousPercentage = 0;

        player.on("timeupdate", function () {
          player.on("timeupdate", function () {
            var currentTime = player.currentTime();
            var videoPercentage = Math.round(
              (currentTime / videoDuration) * 100
            );

            if (
              videoPercentage % 10 == 0 &&
              videoPercentage > previousPercentage
            ) {
              previousPercentage = videoPercentage;

              var updateProgressUrl =
                "/entollment_details/update_progress?course_id=" +
                courseId +
                "&lesson_id=" +
                line_data +
                "&progress=" +
                videoPercentage;

              var request = new XMLHttpRequest();
              request.open("GET", updateProgressUrl, true);

              request.onload = function () {
                if (request.status === 200) {
                  console.log("Successfully updated");
                } else {
                  console.log("Not updated");
                }
              };

              request.onerror = function () {
                console.log("Request failed");
              };

              request.send();
            }
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

      const key = `videojs-resume-playback:${videoId}`;

      player.on("timeupdate", () => {
        localStorage.setItem(key, player.currentTime());
      });

      player.on("ended", () => {
        localStorage.removeItem(key);
      });

      const lastTime = parseFloat(localStorage.getItem(key));
      if (lastTime) {
        player.currentTime(lastTime);
        player.play();
      }

      player.ready(function () {});
    }
  );

  function goToLesson(lesson_info) {
    const activeLesson = document.querySelector(".lesson_data.active");
    const lessonLink =
      activeLesson && activeLesson.querySelector(".lesson_link");
    const lessonIndex =
      lessonLink && lessonLink.getAttribute("data-lesson-index");
    const targetLessonId =
      lessonIndex && "lesson-" + (parseInt(lessonIndex) + lesson_info);
    const targetLesson =
      targetLessonId && document.getElementById(targetLessonId);

    if (targetLesson) {
      targetLesson.click();
    }
  }

  document
    .getElementById("previous-video")
    .addEventListener("click", function () {
      goToLesson(-1);
    });

  document.getElementById("next-video").addEventListener("click", function () {
    goToLesson(1);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initVideo();
});

document.addEventListener("turbo:render", function () {
  initVideo();
});

document.addEventListener("turbo:before-fetch-response", function () {
  let oldPlayer = document.querySelectorAll("video")[0];
  videojs(oldPlayer).dispose();
});
