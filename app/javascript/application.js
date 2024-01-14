// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails";
import "controllers";
import videojs from "video.js";
import "flowbite";

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

  });
}

function openDropdown(dropdown) {
  const dropdownContent = dropdown.parent().find(".sub");
  console.log("sdgdfgdgfdg");
  dropdownContent.slideDown("fast");
}



function activeClass(){
  $(".selected").on("click", function(){
    $(".selected").removeClass("actived");
    $(this).addClass("actived");
  })
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

var expanded = false;
function initNavbarTitle() {
  $(".title").click(function () {
    expanded = true;
    console.log(expanded);
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
    expanded = false;
    console.log("ladswsssssssss", expanded);
    $(".title1").removeClass("title11");
    $(".open").removeClass("open1");
    $(".openmenu").css({ position: "", right: "", top: "" });
    $(".main-menu").removeClass("main-menu2");
    $(".main-page").removeClass("main-page2");
    $(".main-nav").removeClass("main-nav2");
    // $(".sub").slideUp();
    // $(".actived").removeClass("actived");

    localStorage.removeItem("dropdownStates");
    localStorage.removeItem("navbarState");
  });
}




function handleNavbar() {
  initNavbarTitle();
  initNavbarHamburger();
  console.log("dsfdsfsfsf", expanded);
  let currentUrl = window.location.pathname;
  console.log("current url", currentUrl);
  $(".title").mouseenter(function () {
    if (expanded === false) {
      
      $(".main-page").css({
        width: "85%",
        "margin-left": "auto",
        transition: "all 0.2s linear",
      });
      $(".main-nav").css({
        width: "85%",
        transition: "all 0.2s linear",
      });
    }
    if (currentUrl === "/admin/students"){
      $("#student-management").addClass("actived");
      $("#student-management").parent().find(".sub").slideDown();

    }
    if (currentUrl === "/admin/courses"){
      $("#course-management").addClass("actived");
      $("#course-management").parent().find(".sub").slideDown();

    }
    if (currentUrl === "/admin/sections"){
      $("#course-management").addClass("actived");
      $("#course-management").parent().find(".sub").slideDown();

    }
    if (currentUrl === "/admin/lessons"){
      $("#course-management").addClass("actived");
      $("#course-management").parent().find(".sub").slideDown();

    }
    if (currentUrl === "/admin/users"){
      $("#user-management").addClass("actived");
      $("#user-management").parent().find(".sub").slideDown();

    }
  });

  $("#sidebar").mouseleave(function () {
    if (expanded === false) {
      $(".main-page").css({
        width: "97%",
        "margin-left": "auto",
        transition: "all 0.2s linear",
      });
      $(".main-nav").css({
        width: "97%",
        transition: "all 0.2s linear",
      });
      $(".actived").removeClass("actived");
      $(".sub").slideUp();
    }
    
  });
}

function loader() {
  console.log("loader");
    $("#overlay").fadeIn(300);
    $("#overlay").delay(300).fadeOut(300);
}

$(document).ready(function () {
  applyNavbarState();
  activeClass();
  handleNavbar();
  

  if ($("#student-management").hasClass("openDropDown")) {
    const studentManagement = $("#student-management");
    openDropdown(studentManagement);
  }

  if ($("#course-management").hasClass("openDropDown")) {
    const courseManagement = $("#course-management");
    openDropdown(courseManagement);
  }



  $(".dropdownProfile").click(function () {
    $("#menuShow").toggle();
  });

  navDropdown();

  $(document).on("turbo:render", function () {
    applyNavbarState();
    activeClass();
    navDropdown();
    handleNavbar();

    if ($("#student-management").hasClass("openDropDown")) {
      const dropdownFee = $("#student-management");
      openDropdown(dropdownFee);
    }

    if ($("#course-management").hasClass("openDropDown")) {
      const courseManagement = $("#course-management");
      openDropdown(courseManagement);
    } 

  });
});
