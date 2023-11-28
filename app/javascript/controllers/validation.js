function userValidation() {
  function validateEmail(email) {
    return email.includes("@");
  }

  function toggleError(element, isValid, errorMessage) {
    var errorContainer = element.next(".error");
    if (!isValid) {
      errorContainer.text(errorMessage);
      errorContainer.show();
    } else {
      errorContainer.hide();
    }
  }

  function validateForm() {
    var form = $("form");
    var emailField = form.find("#user_email");
    var passwordField = form.find("#user_password");
    var confirmPasswordField = form.find("#user_password_confirmation");

    var email = emailField.val();
    var isValidEmail = validateEmail(email);
    toggleError(emailField, isValidEmail, "Invalid email format");

    var password = passwordField.val();
    var isValidPassword = password.length >= 8;
    toggleError(
      passwordField,
      isValidPassword,
      "Password must be at least 8 characters"
    );

    var confirmPassword = confirmPasswordField.val();
    var isValidConfirmPassword = confirmPassword === password;
    toggleError(
      confirmPasswordField,
      isValidConfirmPassword,
      "Passwords do not match"
    );

    return isValidEmail && isValidPassword && isValidConfirmPassword;
  }

  $("form").submit(function (event) {
    if (!validateForm()) {
      event.preventDefault();
    }
  });

  $("#user_email").blur(function () {
    validateEmail($(this).val());
  });

  $("#user_password").blur(function () {});

  $("#user_password_confirmation").blur(function () {});
}

$(document).ready(function () {
  userValidation();

  $(document).on("turbo:render", function () {
    userValidation();
  });
});
