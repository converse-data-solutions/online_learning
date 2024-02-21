// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails";
import "controllers";
import videojs from "video.js";
import "flowbite";

// Navbar Function

function navDropdown() {
  $(".main").click(function() {
    const el = $(this).parent().find(".sub");
    el.slideToggle("slow");

    el.toggleClass("dropdown-open");

    $(this)
      .find(".change-position")
      .css({
        transform: el.hasClass("dropdown-open") ?
          "rotate(180deg)" :
          "rotate(0deg)",
      })
      .css({
        transition: "transform 0.5s ease",
      });

  });
}

function openDropdown(dropdown) {
  const dropdownContent = dropdown.parent().find(".sub");
  dropdownContent.slideDown("fast");
}

function activeClass() {
  $(".selected").on("click", function() {
    $(".selected").removeClass("actived");
    $(this).addClass("actived");
  })
}

function applyNavbarState() {
  var navbarState = localStorage.getItem("navbarState");

  if (navbarState === "titleClicked") {
    $(".title1").addClass("title11");
    $(".open").addClass("open1");
    $(".openmenu").css({
      position: "absolute",
      right: "18px",
      top: "15px"
    });
    $(".main-menu").addClass("main-menu2");
    $(".main-page").addClass("main-page2");
    $(".main-nav").addClass("main-nav2");
  }
}

var expanded = false;
var expanded = localStorage.getItem("navbarState") === "titleClicked";

function initNavbarTitle() {
  $(".title").click(function () {
    expanded = true;
    updateNavbarState();
    updateNavbar();
  });
}

function initNavbarHamburger() {
  $(".hamburger").click(function (event) {
    event.stopPropagation();
    expanded = !expanded;
    updateNavbarState();
    updateNavbar();
  });
}

function updateNavbarState() {
  if (expanded) {
    localStorage.setItem("navbarState", "titleClicked");
  } else {
    localStorage.removeItem("navbarState");
  }
}

function updateNavbar() {
  if (expanded) {
    $(".title1").addClass("title11");
    $(".open").addClass("open1");
    $(".openmenu").css({
      position: "absolute",
      right: "18px",
      top: "15px",
    });
    $(".main-menu").addClass("main-menu2");
    $(".main-page").addClass("main-page2");
    $(".main-nav").addClass("main-nav2");
  } else {
    $(".title1").removeClass("title11");
    $(".open").removeClass("open1");
    $(".openmenu").css({
      position: "",
      right: "",
      top: "",
    });
    $(".main-menu").removeClass("main-menu2");
    $(".main-page").removeClass("main-page2");
    $(".main-nav").removeClass("main-nav2");
  }
}

function handleNavbar() {
  initNavbarTitle();
  initNavbarHamburger();
  let currentUrl = window.location.pathname;

  $(".title").mouseenter(function () {
    if (!expanded) {
      $(".main-page, .main-nav").css({
        width: "87%",
        "margin-left": "auto",
        transition: "all 0.2s linear",
      });
    }
    if (currentUrl === "/admin/students") {
      $("#student-management").addClass("actived");
      $("#student-management").parent().find(".sub").slideDown();

    }
    if (currentUrl === "/admin/courses") {
      $("#course-management").addClass("actived");
      $("#course-management").parent().find(".sub").slideDown();

    }
    if (currentUrl === "/admin/sections") {
      $("#course-management").addClass("actived");
      $("#course-management").parent().find(".sub").slideDown();

    }
    if (currentUrl === "/admin/lessons") {
      $("#course-management").addClass("actived");
      $("#course-management").parent().find(".sub").slideDown();

    }
    if (currentUrl === "/admin/users") {
      $("#user-management").addClass("actived");
      $("#user-management").parent().find(".sub").slideDown();

    }
  });

  $("#sidebar").mouseleave(function () {
    if (!expanded) {
      $(".main-page, .main-nav").css({
        width: "97%",
        "margin-left": "auto",
        transition: "all 0.2s linear",
      });
      $(".actived").removeClass("actived");
      $(".sub").slideUp();
    }
  });

  updateNavbar();
}

function loginValidation(){
  console.log("dsfsdfsdff................");
  function validateEmail() {
   let email = $("#user_email").val().trim();
   let emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

   if (!email) {
     $("#email-error").text("Email can't be blank");
     return false; // Return false to indicate validation failure
   } else if (!emailRegex.test(email)) {
     $("#email-error").text("Please enter a valid email address");
     return false; // Return false to indicate validation failure
   } else {
     $("#email-error").text("");
     return true; // Return true to indicate validation success
   }
 }

 function validatePassword() {
 let password = $("#user_password").val();
 let hasUppercase = /[A-Z]/.test(password);
 let hasNumber = /\d/.test(password);
 let hasSpecialChar = /[!@#$%^&*()_+]/.test(password);

 if (!password) {
   $("#password-error").text("Password can't be blank");
   return false;
 } else if (password.length < 8) {
   $("#password-error").text("Password must be at least 8 characters long");
   return false;
 } else if (!hasUppercase) {
   $("#password-error").text("Password must contain at least one uppercase letter");
   return false;
 } else if (!hasNumber) {
   $("#password-error").text("Password must contain at least one numeric digit");
   return false;
 } else if (!hasSpecialChar) {
   $("#password-error").text("Password must contain at least one special character");
   return false;
 } else {
   $("#password-error").text("");
   return true;
 }
}


 $("#user_email").on("blur", validateEmail); // Validate email on blur (when focus moves out)
 $("#user_password").on("blur", validatePassword); // Validate password on blur

 $("#login_button").on("click", function(event) {
   // Validate both email and password on button click
   let isEmailValid = validateEmail();
   let isPasswordValid = validatePassword();

   // Prevent form submission if either email or password is invalid
   if (!isEmailValid || !isPasswordValid) {
     event.preventDefault();
   }
 });

 // Blur event for showing error messages when clicking outside of input fields
 $("#user_email, #user_password").on("blur", function() {
   if ($(this).attr("id") === "user_email") {
     validateEmail();
   } else if ($(this).attr("id") === "user_password") {
     validatePassword();
   }
 });
}



$(document).ready(function() {
  applyNavbarState();
  activeClass();
  handleNavbar();
  loginValidation();


  if ($("#student-management").hasClass("openDropDown")) {
    const studentManagement = $("#student-management");
    openDropdown(studentManagement);
  }

  if ($("#course-management").hasClass("openDropDown")) {
    const courseManagement = $("#course-management");
    openDropdown(courseManagement);
  }

  if ($("#payment-management").hasClass("openDropDown")) {
    const paymentManagement = $("#payment-management");
    openDropdown(paymentManagement);
  }

  if ($("#schedule-management").hasClass("openDropDown")) {
    const scheduleManagement = $("#schedule-management");
    openDropdown(scheduleManagement);
  }

  if ($("#sales-management").hasClass("openDropDown")) {
    const salesManagement = $("#sales-management");
    openDropdown(salesManagement);
  }



  $(".dropdownProfile").click(function() {
    $("#menuShow").toggle();
  });

  navDropdown();

  $(document).on("turbo:render", function() {
    applyNavbarState();
    activeClass();
    navDropdown();
    handleNavbar();
    loginValidation();

    if ($("#student-management").hasClass("openDropDown")) {
      const dropdownFee = $("#student-management");
      openDropdown(dropdownFee);
    }

    if ($("#course-management").hasClass("openDropDown")) {
      const courseManagement = $("#course-management");
      openDropdown(courseManagement);
    }

    if ($("#payment-management").hasClass("openDropDown")) {
      const paymentManagement = $("#payment-management");
      openDropdown(paymentManagement);
    }

    if ($("#schedule-management").hasClass("openDropDown")) {
      const scheduleManagement = $("#schedule-management");
      openDropdown(scheduleManagement);
    }

    if ($("#sales-management").hasClass("openDropDown")) {
      const salesManagement = $("#sales-management");
      openDropdown(salesManagement);
    }

  });
});