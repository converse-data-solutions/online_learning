function editModelPopup() {
  $(".edit-trainer-model").click(function() {
    let id = $(this).data("trainer-id");
    let url = $(this).data("url");
    let searchParams = new URLSearchParams(window.location.search);
    let page = parseInt(searchParams.get("page")) || 1;
    let search = searchParams.get("search") || "";
    $("#overlay").show();
    $.ajax({
      method: "GET",
      url: url,
      data: {
        user_id: id,
        page: page,
        search: search,
      },
      headers: {
        Accept: "text/vnd.turbo-stream.html, text/html, application/xhtml+xml",
      },

      success: function(res) {
        Turbo.renderStreamMessage(res);
        $("#overlay").hide();
        editFormValidation();
      },
      error: function() {
        console.log("Error fetching data");
        $("#overlay").hide();
      },
    });
  });
}

function deletePopup() {
  $(".send-delete-trainer").click(function() {
    let id = $(this).data("trainer-id");
    let searchParams = new URLSearchParams(window.location.search);
    let page = parseInt(searchParams.get("page")) || 1;
    let search = searchParams.get("search") || "";
    let per_page = parseInt(searchParams.get("per_page")) || 10;

    let delUrl = `trainers/${id}`;

    if (search !== 1) {
      delUrl += `?page=${page}`;
    }

    if (search !== "") {
      delUrl += (page === 1 ? "?" : "&") + `search=${search}`;
    }

    if (per_page !== 10) {
      delUrl += page === 1 && search === "" ? "?" : "&";
      delUrl += `per_page=${per_page}`;
    }

    $("#delete-trainer-model").attr("data-trainer-id", id);
    $("#delete-trainer-model").attr("href", delUrl);
  });
}

function viewStudents() {
  $(".view-trainer-model").click(function() {
    let id = $(this).data("trainer-id");
    let url = $(this).data("url");
    let searchParams = new URLSearchParams(window.location.search);
    let page = parseInt(searchParams.get("page")) || 1;
    let search = searchParams.get("search") || "";
    $("#overlay").show();
    $.ajax({
      method: "GET",
      url: url,
      data: {
        user_id: id,
        page: page,
        search: search,
      },
      headers: {
        Accept: "text/vnd.turbo-stream.html, text/html, application/xhtml+xml",
      },
      success: function(res) {
        Turbo.renderStreamMessage(res);
        $("#overlay").hide();
      },
      error: function() {
        console.log("Error fetching data");
        $("#overlay").hide();
      },
    });
  });
}

function trainerSearch() {
  let delayTimer;

  $("#trainer_search").keyup(function(e) {
    clearTimeout(delayTimer);
    delayTimer = setTimeout(function() {
      let searchValue = $("#trainer_search").val();
      $("#overlay").show();
      $.ajax({
        url: "/admin/trainers",
        type: "GET",
        data: {
          search: searchValue,
        },
        headers: {
          Accept: "text/vnd.turbo-stream.html, text/html, application/xhtml+xml",
        },
        success: function(res) {
          Turbo.renderStreamMessage(res);
          let newURL =
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname +
            "?search=" +
            encodeURIComponent(searchValue);
          window.history.pushState({
              path: newURL,
            },
            "",
            newURL
          );
          $("#overlay").hide();
        },
        error: function() {
          console.log("Error fetching data");
          $("#overlay").hide();
        },
      });
    }, 500);
  });
}


// Create form validation
function formValidation() {
  function validateName() {
    let name = $("#trainer_name").val();
    let namecheck = /^[a-zA-Z ]+$/.test(name);

    if (!name) {
      $("#name-error").text("Name can't be blank");
      return false;
    } else if (!namecheck) {
      $("#name-error").text("Please enter a valid name (only alphabets allowed)");
      return false;
    } else {
      $("#name-error").text("");
      return true;
    }
  }

  // Function to validate email field
  function validateEmail() {
    let email = $("#trainer_email").val().trim();
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

  // Function to validate password field
  function validatePassword() {
    let password = $("#trainer_password").val();
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

  // Function to validate password confirmation field
  function validatePasswordConfirmation() {
    let password = $("#trainer_password").val();
    let passwordConfirmation = $("#trainer_password_confirmation").val();
    if (password !== passwordConfirmation) {
      $("#password-confirmation-error").text("Password confirmation doesn't match");
      return false; // Return false to indicate validation failure
    } else {
      $("#password-confirmation-error").text("");
      return true; // Return true to indicate validation success
    }
  }

  function validateOccupation() {
    let name = $("#trainer_occupation").val();
    let namecheck = /^[a-zA-Z ]+$/.test(name);

    if (!name) {
      $("#occupation-error").text("Occupation can't be blank");
      return false;
    } else if (!namecheck) {
      $("#occupation-error").text("Please enter a valid Occupation (only alphabets allowed)");
      return false;
    } else {
      $("#occupation-error").text("");
      return true;
    }
  }

  function validateContactNumber() {
    let contactNumber = $("#trainer_contact_number").val();

    if (contactNumber) {
      if (!validator.isNumeric(contactNumber) || contactNumber.length !== 10) {
        $("#contact-number-error").text(
          "Contact Number must be a 10-digit number"
        );
        return false;
      } else {
        $("#contact-number-error").text("");
        return true;
      }
    } 
  }

  function validateEmergencyContactNumber() {
    let emergencycontactNumber = $("#trainer_emergency_contact_number").val();

    if (emergencycontactNumber) {
      if (
        !validator.isNumeric(emergencycontactNumber) ||
        emergencycontactNumber.length !== 10
      ) {
        $("#emergency-contact-number-error").text(
          "Emergency Contact Number must be a 10-digit number"
        );
        return false;
      } else {
        $("#emergency-contact-number-error").text("");
        return true;
      }
    }
  }

  function validateCardNo() {
    let name = $("#trainer_profile_attributes_idcard_no").val();

    if (!name) {
      $("#idcard_no_error").text("Card Number can't be blank");
      return false;
    } else if (name.replace(/ /g, "").length < 10) {
      $("#idcard_no_error").text("Please enter a valid Card Number");
      return false;
    } else {
      $("#idcard_no_error").text("");
      return true;
    }
  }

  function validateCardType() {
    let name = $("#trainer_profile_attributes_idcard_type").val();

    if (!name) {
      $("#idcard_type_error").text("Card Type can't be blank");
      return false;
    } else {
      $("#idcard_type_error").text("");
      return true;
    }
  }

  function validateHigherEducation() {
    let name = $("#trainer_profile_attributes_higher_education").val();
    let namecheck = /^[a-zA-Z ]+$/.test(name);

    if (!name) {
      $("#higher_education_error").text("Higher Education can't be blank");
      return false;
    } else if (!namecheck) {
      $("#higher_education_error").text("Please enter a valid Higher Education  (only alphabets allowed)");
      return false;
    } else {
      $("#higher_education_error").text("");
      return true;
    }
  }

  // Event bindings for registration form fields
  $("#trainer_name").on("blur", validateName); // Validate name on blur
  $("#trainer_email").on("blur", validateEmail); // Validate email on blur
  $("#trainer_password").on("blur", validatePassword); // Validate password on blur
  $("#trainer_password_confirmation").on("blur", validatePasswordConfirmation); // Validate password confirmation on blur
  $("#trainer_occupation").on("blur", validateOccupation); // Validate occupation on blur
  $("#trainer_contact_number").on("blur", validateContactNumber); // Validate contact number on blur
  $("#trainer_emergency_contact_number").on("blur", validateEmergencyContactNumber);
  $("#trainer_profile_attributes_idcard_no").on("blur", validateCardNo);
  $("#trainer_profile_attributes_idcard_type").on("blur", validateCardType);
  $("#trainer_profile_attributes_higher_education").on("blur", validateHigherEducation);


  // Event binding for form submission
  $("#trainer-admin-form").on("submit", function(event) {
    // Validate all fields on form submission
    let isNameValid = validateName();
    let isEmailValid = validateEmail();
    let isPasswordValid = validatePassword();
    let isPasswordConfirmationValid = validatePasswordConfirmation();
    let isOccupationValid = validateOccupation();
    let isContactNumberValid = validateContactNumber();
    let isEmergencyContactNumberValid = validateEmergencyContactNumber();
    let isCardNoValid = validateCardNo();
    let isCardTypeValid = validateCardType();
    let isHigherEducationValid = validateHigherEducation();

    // Check if any field is invalid
    if (!isNameValid || !isEmailValid || !isPasswordValid || !isPasswordConfirmationValid || !isOccupationValid || !isContactNumberValid || !isEmergencyContactNumberValid || !isCardNoValid || !isCardTypeValid || !isHigherEducationValid) {
      // Prevent form submission
      event.preventDefault();

      // Show all error messages
      validateName();
      validateEmail();
      validatePassword();
      validatePasswordConfirmation();
      validateOccupation();
      validateContactNumber();
      validateEmergencyContactNumber();
      validateCardNo();
      validateCardType();
      validateHigherEducation();
    }
  });
}

function editFormValidation() {
  function validateName() {
    let name = $("#edit_trainer_name").val();
    let namecheck = /^[a-zA-Z ]+$/.test(name);

    if (!name) {
      $("#edit-name-error").text("Name can't be blank");
      return false;
    } else if (!namecheck) {
      $("#edit-name-error").text("Please enter a valid name (only alphabets allowed)");
      return false;
    } else {
      $("#edit-name-error").text("");
      return true;
    }
  }

  function validateEmail() {
    let email = $("#edit_trainer_email").val().trim();
    let emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

    if (!email) {
      $("#edit-email-error").text("Email can't be blank");
      return false;
    } else if (!emailRegex.test(email)) {
      $("#edit-email-error").text("Please enter a valid email address");
      return false;
    } else {
      $("#edit-email-error").text("");
      return true;
    }
  }

  function validatePassword() {
    let password = $("#edit_trainer_password").val();
    let hasUppercase = /[A-Z]/.test(password);
    let hasNumber = /\d/.test(password);
    let hasSpecialChar = /[!@#$%^&*()_+]/.test(password);

    if (!password) {
      $("#edit-password-error").text("Password can't be blank");
      return false;
    } else if (password.length < 8) {
      $("#edit-password-error").text("Password must be at least 8 characters long");
      return false;
    } else if (!hasUppercase) {
      $("#edit-password-error").text("Password must contain at least one uppercase letter");
      return false;
    } else if (!hasNumber) {
      $("#edit-password-error").text("Password must contain at least one numeric digit");
      return false;
    } else if (!hasSpecialChar) {
      $("#edit-password-error").text("Password must contain at least one special character");
      return false;
    } else {
      $("#edit-password-error").text("");
      return true;
    }
  }

  function validatePasswordConfirmation() {
    let password = $("#edit_trainer_password").val();
    let passwordConfirmation = $("#edit_trainer_password_confirmation").val();

    if (password !== passwordConfirmation) {
      $("#edit-password-confirmation-error").text("Password confirmation doesn't match");
      return false;
    } else {
      $("#edit-password-confirmation-error").text("");
      return true;
    }
  }

  function validateOccupation() {
    let name = $("#edit_trainer_occupation").val();
    let namecheck = /^[a-zA-Z ]+$/.test(name);

    if (!name) {
      $("#edit-occupation-error").text("Occupation can't be blank");
      return false;
    } else if (!namecheck) {
      $("#edit-occupation-error").text("Please enter a valid Occupation (only alphabets allowed)");
      return false;
    } else {
      $("#edit-occupation-error").text("");
      return true;
    }
  }

  function validateContactNumber() {
    let contactNumber = $("#edit_trainer_contact_number").val();

    if (contactNumber) {
      if (!validator.isNumeric(contactNumber) || contactNumber.length !== 10) {
        $("#edit-contact-number-error").text(
          "Contact Number must be a 10-digit number");
          return false;
      } else {
        $("#edit-contact-number-error").text("");
        return true;
      }
    } else {
      $("#edit-contact-number-error").text("");
    }
  }

  function validateEmergencyContactNumber() {
    let emergencycontactNumber = $("#edit_trainer_emergency_contact_number").val();

    if (emergencycontactNumber) {
      if (
        !validator.isNumeric(emergencycontactNumber) ||
        emergencycontactNumber.length !== 10
      ) {
        $("#edit-emergency-contact-number-error").text(
          "Emergency Contact Number must be a 10-digit number"
        );
        return false;
      } else {
        $("#edit-emergency-contact-number-error").text("");
        return true;
      }
    } else {
      $("#edit-emergency-contact-number-error").text("");
    }
  }


  function validateCardNo() {
    let name = $("#edit_trainer_profile_attributes_idcard_no").val();

    if (!name) {
      $("#edit_idcard_no_error").text("Card Number can't be blank");
      return false;
    } else if (name.replace(/ /g, "").length < 10) {
      $("#edit_idcard_no_error").text("Please enter a valid Card Number");
      return false;
    } else {
      $("#edit_idcard_no_error").text("");
      return true;
    }
  }

  function validateCardType() {
    let name = $("#edit_trainer_profile_attributes_idcard_type").val();

    if (!name) {
      $("#edit_idcard_type_error").text("Card Type can't be blank");
      return false;
    } else {
      $("#edit_idcard_type_error").text("");
      return true;
    }
  }

  function validateHigherEducation() {
    let name = $("#edit_trainer_profile_attributes_higher_education").val();
    let namecheck = /^[a-zA-Z ]+$/.test(name);

    if (!name) {
      $("#edit_higher_education_error").text("Higher Education can't be blank");
      return false;
    } else if (!namecheck) {
      $("#edit_higher_education_error").text("Please enter a valid Higher Education  (only alphabets allowed)");
      return false;
    } else {
      $("#edit_higher_education_error").text("");
      return true;
    }
  }

  

  $("#edit-trainer-popup").on("focusout", "#edit_trainer_name", validateName);
  $("#edit-trainer-popup").on("focusout", "#edit_trainer_email", validateEmail);
  $("#edit-trainer-popup").on("focusout", "#edit_trainer_password", validatePassword);
  $("#edit-trainer-popup").on("focusout", "#edit_trainer_password_confirmation", validatePasswordConfirmation);
  $("#edit-trainer-popup").on("focusout", "#edit_trainer_occupation", validateOccupation);
  $("#edit-trainer-popup").on("focusout", "#edit_trainer_contact_number", validateContactNumber);
  $("#edit-trainer-popup").on("focusout", "#edit_trainer_emergency_contact_number", validateEmergencyContactNumber);
  $("#edit-trainer-popup").on("focusout", "#edit_trainer_profile_attributes_idcard_no", validateCardNo);
  $("#edit-trainer-popup").on("focusout", "#edit_trainer_profile_attributes_idcard_type", validateCardType);
  $("#edit-trainer-popup").on("focusout", "#edit_trainer_profile_attributes_higher_education", validateHigherEducation);


  $("#edit-trainer-popup").on("submit", "#trainer-admin-edit-form", function(event) {
    let isNameValid = validateName();
    let isEmailValid = validateEmail();
    let isPasswordValid = validatePassword();
    let isPasswordConfirmationValid = validatePasswordConfirmation();
    let isOccupationValid = validateOccupation();
    let isContactNumberValid = validateContactNumber();
    let isEmergencyContactNumberValid = validateEmergencyContactNumber();
    let isCardNoValid = validateCardNo();
    let isCardTypeValid = validateCardType();
    let isHigherEducationValid = validateHigherEducation();

    if (!isNameValid || !isEmailValid || !isPasswordValid || !isPasswordConfirmationValid || !isOccupationValid || !isContactNumberValid || !isEmergencyContactNumberValid || !isCardNoValid || !isCardTypeValid || !isHigherEducationValid) {
      event.preventDefault();
    }
  });
}

$(document).ready(function() {
  editModelPopup();
  deletePopup();
  viewStudents();
  trainerSearch();
  formValidation();
  editFormValidation();

  $(document).on("turbo:render", function() {
    editModelPopup();
    deletePopup();
    trainerSearch();
    formValidation();
    editFormValidation();
  });

  $(document).on("turbo:before-render", function() {
    $("#overlay").show();
  });
  $(document).on("turbo:after-render", function() {
    $("#overlay").hide();
  });
});

addEventListener("turbo:before-stream-render", (event) => {
  const fallbackToDefaultActions = event.detail.render;

  event.detail.render = function(streamElement) {
    fallbackToDefaultActions(streamElement);
    initModals();
    editModelPopup();
    deletePopup();
    viewStudents();
    formValidation();
    editFormValidation();
  };
});