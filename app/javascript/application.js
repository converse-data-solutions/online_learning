// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails";
import "controllers";
import videojs from "video.js";
import "flowbite";

function navDropdown() {
  $(".main").click(function () {
    const el = $(this).parent().find(".sub");
    el.slideToggle("slow");
    $(".change-position").css({
      transform: "rotate(180deg)",
    });
  });
}

function activeClass() {
  $(".selected").on("click", function (e) {
    $(".selected").removeClass("actived");
    $(this).addClass("actived");
  });
}

// $(document).ready(function () {
//   $(".change-position").click(function () {
//     $(".fa img").toggleClass("rotate-180");
//   });
// });

// Navbar Function

var isClicked = false;

function handleNavbar() {
  if (isClicked) {
    $(".title").mouseenter(function () {
      $(".main-page").css({
        width: "85%",
        "margin-left": "auto",
        transition: "all 0.2s linear",
      });
      $(".main-nav").css({
        width: "85%",
        transition: "all 0.2s linear",
      });
    });

    $("#sidebar").mouseleave(function () {
      $(".main-page").css({
        width: "97%",
        "margin-left": "auto",
        transition: "all 0.2s linear",
      });
      $(".main-nav").css({
        width: "97%",
        transition: "all 0.2s linear",
      });
    });
  } else {
    $(".title").off("mouseenter");
    $("#sidebar").off("mouseleave");
  }
}

function applyNavbarState() {
  var navbarState = localStorage.getItem("navbarState");

  if (navbarState === "titleClicked") {
    $(".title1").addClass("title11");
    $(".open").addClass("open1");
    $(".openmenu").css({ position: "absolute", right: "18px", top: "15px" });
    $(".main-menu").addClass("main-menu2");
    $(".main-page").addClass("main-page2");
    $(".main-nav").addClass("main-nav2");
  }
}

function initNavbarTitle() {
  $(".title").click(function () {
    console.log("clicked on .title");
    $(".title1").addClass("title11");
    $(".open").addClass("open1");
    $(".openmenu").css({ position: "absolute", right: "18px", top: "15px" });
    $(".main-menu").addClass("main-menu2");
    $(".main-page").addClass("main-page2");
    $(".main-nav").addClass("main-nav2");
    localStorage.setItem("navbarState", "titleClicked");
  });
}

function initNavbarHamburger() {
  $(".hamburger").click(function (event) {
    console.log("clicked on .hamburger");
    event.stopPropagation();

    $(".title1").removeClass("title11");
    $(".open").removeClass("open1");
    $(".openmenu").css({ position: "", right: "", top: "" });
    $(".main-menu").removeClass("main-menu2");
    $(".main-page").removeClass("main-page2");
    $(".main-nav").removeClass("main-nav2");
  });
}

$(document).ready(function () {
  applyNavbarState();
  initNavbarTitle();
  initNavbarHamburger();
  navDropdown();
  activeClass();

  $(document).on("turbo:render", function () {
    applyNavbarState();
    initNavbarTitle();
    initNavbarHamburger();
    navDropdown();
    activeClass();
  });
});
