// function initValidation() {
//   var form = document.querySelector("form");
//   form.addEventListener("submit", function (e) {
//     var email = document.getElementById("user_email").value;
//     var password = document.getElementById("user_password").value;
//     var passwordConfirmation = document.getElementById(
//       "user_password_confirmation"
//     ).value;

//     var errorElements = document.querySelectorAll(".error");
//     for (var i = 0; i < errorElements.length; i++) {
//       errorElements[i].textContent = "";
//       errorElements[i].style.color = "red";
//     }

//     var errors = false;

//     if (!email || !email.trim()) {
//       document.getElementById("email-error").textContent =
//         "Please enter a valid email address.";
//       errors = true;
//     }

//     if (!password || !password.trim()) {
//       document.getElementById("password-error").textContent =
//         "Please enter a password.";
//       errors = true;
//     }

//     if (!passwordConfirmation || !passwordConfirmation.trim()) {
//       document.getElementById("password-confirmation-error").textContent =
//         "Please confirm your password.";
//       errors = true;
//     }

//     if (password !== passwordConfirmation) {
//       document.getElementById("password-confirmation-error").textContent =
//         "Password and password confirmation do not match.";
//       document.getElementById("password-confirmation-error").style.color =
//         "red";
//       errors = true;
//     }

//     if (errors) {
//       e.preventDefault();
//       return false;
//     }
//   });
// }
// initValidation();

// document.addEventListener("DOMContentLoaded", function () {
//   console.log("DOM validation Loaded");
//   initValidation();
// });

// document.addEventListener("turbo:render", function () {
//   console.log("Turbo validation Loaded");
//   initValidation();
// });
