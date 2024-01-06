// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails";
import "controllers";
import videojs from "video.js";
import "flowbite";

function activeClass() {
  $(".selected").on("click", function (e) {
    $(".selected").removeClass("actived");
    $(this).addClass("actived");
  });
}

// Navbar Function

function navDropdown() {
  $(".main").click(function () {
    const el = $(this).parent().find(".sub");
    el.slideToggle("slow");

    el.toggleClass("dropdown-open");

    $(this)
      .find(".change-position")
      .css({
        transform: el.hasClass("dropdown-open")
          ? "rotate(180deg)"
          : "rotate(0deg)",
      });

    updateDropdownStates();
  });
}

function updateDropdownStates() {
  var dropdownStates = {};

  $(".main").each(function (index) {
    var isOpen = $(this).parent().find(".sub").hasClass("dropdown-open");
    dropdownStates[index] = isOpen ? "open" : "closed";
  });

  localStorage.setItem("dropdownStates", JSON.stringify(dropdownStates));
}

function handleNavbar() {
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
    event.stopPropagation();

    $(".title1").removeClass("title11");
    $(".open").removeClass("open1");
    $(".openmenu").css({ position: "", right: "", top: "" });
    $(".main-menu").removeClass("main-menu2");
    $(".main-page").removeClass("main-page2");
    $(".main-nav").removeClass("main-nav2");
    $(".actived").removeClass("actived");
    localStorage.removeItem("dropdownStates");
    localStorage.removeItem("navbarState");
    handleNavbar();
  });
}

function loader() {
  $(".loader-btn").click(function () {
    $("#overlay").fadeIn(300);
    $("#overlay").delay(300).fadeOut(300);
  });
}

$(document).ready(function () {
  applyNavbarState();
  initNavbarTitle();
  initNavbarHamburger();
  activeClass();
  loader();

  $(".dropdownProfile").click(function () {
    $("#menuShow").toggle();
  });
  var storedStates = localStorage.getItem("dropdownStates");
  if (storedStates) {
    var dropdownStates = JSON.parse(storedStates);

    $(".main").each(function (index) {
      var isOpen = dropdownStates[index] === "open";
      var el = $(this).parent().find(".sub");

      if (isOpen) {
        el.show();
        $(this).find(".change-position").css({ transform: "rotate(180deg)" });
        el.addClass("dropdown-open");
      } else {
        el.hide();
        $(this).find(".change-position").css({ transform: "rotate(0deg)" });
        el.removeClass("dropdown-open");
      }
    });
  }

  navDropdown();

  $(document).on("turbo:render", function () {
    applyNavbarState();
    initNavbarTitle();
    initNavbarHamburger();
    activeClass();
    loader();
    var storedStates = localStorage.getItem("dropdownStates");
    if (storedStates) {
      var dropdownStates = JSON.parse(storedStates);

      $(".main").each(function (index) {
        var isOpen = dropdownStates[index] === "open";
        var el = $(this).parent().find(".sub");

        if (isOpen) {
          el.show();
          $(this).find(".change-position").css({ transform: "rotate(180deg)" });
          el.addClass("dropdown-open");
        } else {
          el.hide();
          $(this).find(".change-position").css({ transform: "rotate(0deg)" });
          el.removeClass("dropdown-open");
        }
      });
    }
    navDropdown();
  });
});
