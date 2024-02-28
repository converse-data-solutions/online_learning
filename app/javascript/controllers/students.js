function editModelPopup() {
  $(".edit-student-model").click(function() {
    let id = $(this).data("user-id");
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
  $(".send-delete-student").click(function() {
    let id = $(this).data("user-id");
    let searchParams = new URLSearchParams(window.location.search);
    let page = parseInt(searchParams.get("page")) || 1;
    let search = searchParams.get("search") || "";
    let per_page = parseInt(searchParams.get("per_page")) || 10;

    let delUrl = `students/${id}`;

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

    $("#delete-student-model").attr("data-user-id", id);
    $("#delete-student-model").attr("href", delUrl);
  });
}

function viewStudents() {
  $(".view-student-model").click(function() {
    let id = $(this).data("user-id");
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

function studentTableSearch() {
  let delayTimer;

  $("#student_search").keyup(function(e) {
    clearTimeout(delayTimer);
    delayTimer = setTimeout(function() {
      let searchValue = $("#student_search").val();
      $("#overlay").show();
      $.ajax({
        url: "/admin/students",
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

// Dropdown with checkboxes
function dropdownCheckBoxes() {
  function checkboxDropdown(el) {
    let $el = $(el);

    $el.each(function() {
      let $list = $(this).find(".dropdown-list"),
        $label = $(this).find(".dropdown-label"),
        $checkAll = $(this).find(".check-all"),
        $inputs = $(this).find(".checkbox input[type='checkbox']"),
        result = [];

      function updateStatus() {
        if (!result.length) {
          $label.html("Select Courses");
        }
      }

      function updateLabel() {
        $label.html(result.join(", "));
        updateStatus();
      }

      $inputs.on("change", function() {
        let checkedText = $(this).next().text();

        if ($(this).is(":checked")) {
          result.push(checkedText);
        } else {
          result = result.filter((item) => item !== checkedText);
        }

        updateLabel();
      });

      // Add event listener to labels
      $(this).find(".checkbox label").on("click", function() {
        let checkedText = $(this).text();
        let checkbox = $(this).prev();
        
        checkbox.prop("checked", !checkbox.prop("checked"));
        
        if (checkbox.is(":checked")) {
          result.push(checkedText);
        } else {
          result = result.filter((item) => item !== checkedText);
        }

        updateLabel();
      });

      $checkAll.on("change", function() {
        result = [];

        if ($(this).is(":checked")) {
          $inputs.prop("checked", true);
          $inputs.each(function() {
            result.push($(this).next().text());
          });
        } else {
          $inputs.prop("checked", false);
        }

        updateLabel();
      });

      // Initial setup
      $inputs.each(function() {
        if ($(this).is(":checked")) {
          result.push($(this).next().text());
        }
      });

      updateLabel();

      $label.on("click", function() {
        $el.toggleClass("open-dropdown");
      });

      $(document).on("click touchstart", function(e) {
        if (!$(e.target).closest($el).length) {
          $el.removeClass("open-dropdown");
        }
      });
    });
  }

  checkboxDropdown(".dropdown");
}
// datepicker
function customDatePicker() {
  $(function() {
    $("#datepicker").datepicker({
      dateFormat: "dd-mm-yy",
      duration: "fast",
      changeYear: true, // Enable changing the year
    });

    // Adding click functionality to the datepicker icon
    $("#datepicker-icon").on('click', function(event) {
      event.preventDefault(); // Prevent default behavior (opening the default date picker calendar)
      var $datepicker = $("#datepicker");
      if ($datepicker.datepicker("widget").is(":hidden")) {
        $datepicker.datepicker("show"); // Show the datepicker if it's hidden
      } else {
        $datepicker.datepicker("hide"); // Hide the datepicker if it's visible
      }
    });
  });
}


function customEditDatePicker() {
  $(function() {
    let initialDate = $("#editdatepicker").val(); // Assuming the date is stored in the input field

    $("#editdatepicker").datepicker({
      dateFormat: "dd-mm-yy", // Update this if needed
      duration: "fast",
      defaultDate: initialDate,
      changeYear: true, // Enable changing the year
    });

    $("#editdatepicker-icon").on('click', function(event) {
      event.preventDefault(); // Prevent default behavior (opening the default date picker calendar)
      var $datepicker = $("#editdatepicker");
      if ($datepicker.datepicker("widget").is(":hidden")) {
        $datepicker.datepicker("show"); // Show the datepicker if it's hidden
      } else {
        $datepicker.datepicker("hide"); // Hide the datepicker if it's visible
      }
    });
  });
}

// Create form validation
function formValidation() {
  function validateName() {
    let name = $("#user_name").val();
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

  // Function to validate password field
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

  // Function to validate password confirmation field
  function validatePasswordConfirmation() {
    let password = $("#user_password").val();
    let passwordConfirmation = $("#user_password_confirmation").val();
    if (password !== passwordConfirmation) {
      $("#password-confirmation-error").text("Password confirmation doesn't match");
      return false; // Return false to indicate validation failure
    } else {
      $("#password-confirmation-error").text("");
      return true; // Return true to indicate validation success
    }
  }

  function validateOccupation() {
    let name = $("#user_occupation").val();
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
    let contactNumber = $("#user_contact_number").val();

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
    let emergencycontactNumber = $("#user_emergency_contact_number").val();

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
  // Event bindings for registration form fields
  $("#user_name").on("blur", validateName); // Validate name on blur
  $("#user_email").on("blur", validateEmail); // Validate email on blur
  $("#user_password").on("blur", validatePassword); // Validate password on blur
  $("#user_password_confirmation").on("blur", validatePasswordConfirmation); // Validate password confirmation on blur
  $("#user_occupation").on("blur", validateOccupation); // Validate occupation on blur
  $("#user_contact_number").on("blur", validateContactNumber); // Validate contact number on blur
  $("#user_emergency_contact_number").on("blur", validateEmergencyContactNumber);


  // Event binding for form submission
  $("#user-admin-form").on("submit", function(event) {
    // Validate all fields on form submission
    let isNameValid = validateName();
    let isEmailValid = validateEmail();
    let isPasswordValid = validatePassword();
    let isPasswordConfirmationValid = validatePasswordConfirmation();
    let isOccupationValid = validateOccupation();
    let isContactNumberValid = validateContactNumber();
    let isEmergencyContactNumberValid = validateEmergencyContactNumber();

    // Check if any field is invalid
    if (!isNameValid || !isEmailValid || !isPasswordValid || !isPasswordConfirmationValid || !isOccupationValid || !isContactNumberValid || !isEmergencyContactNumberValid) {
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
    }
  });
}

// Form reset errors

function resetNewErrorMessages() {
  $("#name-error").text("");
  $("#email-error").text("");
  $("#password-error").text("");
  $("#password-confirmation-error").text("");
  $("#occupation-error").text("");
}

function resetErrorMessages() {
  $("#edit-name-error").text("");
  $("#edit-email-error").text("");
  $("#edit-password-error").text("");
  $("#edit-password-confirmation-error").text("");
  $("#edit-occupation-error").text("");
}


// Edit form validation
function editFormValidation() {
  function validateName() {
    let name = $("#edit_user_name").val();
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
    let email = $("#edit_user_email").val().trim();
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
    let password = $("#edit_user_password").val();
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
    let password = $("#edit_user_password").val();
    let passwordConfirmation = $("#edit_user_password_confirmation").val();

    if (password !== passwordConfirmation) {
      $("#edit-password-confirmation-error").text("Password confirmation doesn't match");
      return false;
    } else {
      $("#edit-password-confirmation-error").text("");
      return true;
    }
  }

  function validateOccupation() {
    let name = $("#edit_user_occupation").val();
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
    let contactNumber = $("#edit_user_contact_number").val();

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
    let emergencycontactNumber = $("#edit_user_emergency_contact_number").val();

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

  

  $("#edit-student-popup").on("focusout", "#edit_user_name", validateName);
  $("#edit-student-popup").on("focusout", "#edit_user_email", validateEmail);
  $("#edit-student-popup").on("focusout", "#edit_user_password", validatePassword);
  $("#edit-student-popup").on("focusout", "#edit_user_password_confirmation", validatePasswordConfirmation);
  $("#edit-student-popup").on("focusout", "#edit_user_occupation", validateOccupation);
  $("#edit-student-popup").on("focusout", "#edit_user_contact_number", validateContactNumber);
  $("#edit-student-popup").on("focusout", "#edit_user_emergency_contact_number", validateEmergencyContactNumber);


  $("#edit-student-popup").on("submit", "#user-admin-edit-form", function(event) {
    let isNameValid = validateName();
    let isEmailValid = validateEmail();
    let isPasswordValid = validatePassword();
    let isPasswordConfirmationValid = validatePasswordConfirmation();
    let isOccupationValid = validateOccupation();
    let isContactNumberValid = validateContactNumber();
    let isEmergencyContactNumberValid = validateEmergencyContactNumber();

    if (!isNameValid || !isEmailValid || !isPasswordValid || !isPasswordConfirmationValid || !isOccupationValid || !isContactNumberValid || !isEmergencyContactNumberValid) {
      event.preventDefault();
    }
  });
}


// Onclick hover color change
function onclickHover() {
  $(".onclick-hover").on("click", function(event) {
    event.stopPropagation();
    $(this).addClass("click-btn-color");
  });

  $("#student-create-close-btn").on("click", function() {
    $(".onclick-hover").removeClass("click-btn-color");
  });

  $(document).on("click", function(event) {
    if (!$(event.target).closest('.onclick-hover').length) {
      $(".onclick-hover").removeClass("click-btn-color");
    }
  });
}

// Form reset Funtion

function resetNewForm() {
  $(".reset-form").on("click", function() {
    $("#user-admin-form")[0].reset()
    resetNewErrorMessages();
  });
}

function resetEditForm() {
  $("#modal-close-btn").on("click", function() {
      var formElement = $("#user-admin-edit-form");
      if (formElement.length > 0) {
          formElement[0].reset();
          resetErrorMessages();
      } else {
          console.error("Form element not found.");
      }
  });
}

//initialize script

$(document).ready(function() {
  editModelPopup();
  deletePopup();
  studentTableSearch();
  dropdownCheckBoxes();
  customDatePicker();
  customEditDatePicker();
  formValidation();
  editFormValidation();
  viewStudents();
  onclickHover();
  resetEditForm();
  resetNewForm();

  $(document).on("turbo:render", function() {
    editModelPopup();
    deletePopup();
    studentTableSearch();
    dropdownCheckBoxes();
    customDatePicker();
    customEditDatePicker();
    formValidation();
    editFormValidation();
    viewStudents();
    onclickHover();
    resetEditForm();
    resetNewForm();
  });

  $(document).on("turbo:before-render", function() {
    $("#overlay").show();
    dropdownCheckBoxes();
  });
  $(document).on("turbo:after-render", function() {
    $("#overlay").hide();
    dropdownCheckBoxes();
  });
});

addEventListener("turbo:before-stream-render", (event) => {
  const fallbackToDefaultActions = event.detail.render;

  event.detail.render = function(streamElement) {
    fallbackToDefaultActions(streamElement);
    initModals();
    editModelPopup();
    deletePopup();
    dropdownCheckBoxes();
    customDatePicker();
    customEditDatePicker();
    viewStudents();

  };
});