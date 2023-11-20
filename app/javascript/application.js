// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails";
import "controllers";
import videojs from "video.js";
import "flowbite";

$(document).ready(function () {
  $(".main").click(function () {
    const el = $(this).parent().find(".sub");
    el.slideToggle("slow");
    $(".change-position").css({
      transform: "rotate(180deg)",
    });
  });
});

$(document).ready(function () {
  $(".selected").on("click", function (e) {
    $(".selected").removeClass("actived");
    $(this).addClass("actived");
  });
});

var isClicked = false;

function handleNavbar() {
  if (!isClicked) {
    $(".title").mouseenter(function () {
      $(".main-page").css({
        width: "84%",
        "margin-left": "auto",
        transition: "all 0.2s linear",
      });
    });

    $("#sidebar").mouseleave(function () {
      $(".main-page").css({
        width: "97%",
        "margin-left": "auto",
        transition: "all 0.2s linear",
      });
    });
  } else {
    $(".title").off("mouseenter");
    $("#sidebar").off("mouseleave");
  }
}

function initNavbar() {
  $(".title, .hamburger").click(function () {
    isClicked = !isClicked;
    $(".title1").toggle();
    $(".open").toggle();
    $(".openmenu").css({ position: "absolute", right: "10px", top: "15px" });
    $(".main-menu").toggleClass("main-menu2");
    $(".main-page").toggleClass("main-page2");
    $(".main-nav").toggleClass("main-nav2");
    console.log("isClicked inside initNavbar", isClicked);

    handleNavbar(); // Call the function to handle mouseenter and mouseleave events
  });
}

$(document).ready(function () {
  initNavbar();

  $(document).on("turbo:render", function () {
    initNavbar();
  });
});


$(document).ready(function () {
  $(".change-position").click(function () {
    $(".fa img").toggleClass("rotate-180");
  });
});


