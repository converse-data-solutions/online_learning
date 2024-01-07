function editModelPopup() {
  $(".edit-student-model").click(function () {
    let id = $(this).data("user-id");
    let url = $(this).data("url");
    $.ajax({
      method: "GET",
      url: url,
      data: {
        user_id: id,
      },
      headers: {
        Accept: "text/vnd.turbo-stream.html, text/html, application/xhtml+xml",
      },

      success: function (res) {
        Turbo.renderStreamMessage(res);
      },
      error: function () {
        console.log("Error fetching data");
      },
    });
  });
}

function deletePopup() {
  console.log("processed.....");
  $(".send-delete-student").click(function () {
    console.log("processed Loading.....");
    let id = $(this).data("user-id");
    $("#delete-student-model").attr("data-user-id", id);
    $("#delete-student-model").attr("href", `students/${id}`);
  });
}

function studentTableSearch() {
  $("#student_search").on("input", function () {
    let searchValue = $(this).val();
    $.ajax({
      url: "/admin/students",
      type: "GET",
      data: {
        search: searchValue,
      },
      headers: {
        Accept: "text/vnd.turbo-stream.html, text/html, application/xhtml+xml",
      },
      success: function (res) {
        Turbo.renderStreamMessage(res);
      },
      error: function () {
        console.log("Error fetching data");
      },
    });
  });
}

// Dropdown with checkboxes
function dropdownCheckBoxes() {
  function checkboxDropdown(el) {
    var $el = $(el);

    $el.each(function () {
      var $list = $(this).find(".dropdown-list"),
        $label = $(this).find(".dropdown-label"),
        $checkAll = $(this).find(".check-all"),
        $inputs = $(this).find(".checkbox input[type='checkbox']"),
        result = [];

      function updateStatus() {
        if (!result.length) {
          $label.html("Select Options");
        }
      }

      function updateLabel() {
        $label.html(result.join(", "));
        updateStatus();
      }

      $inputs.on("change", function () {
        var checkedText = $(this).next().text();

        if ($(this).is(":checked")) {
          result.push(checkedText);
        } else {
          result = result.filter((item) => item !== checkedText);
        }

        updateLabel();
      });

      $checkAll.on("change", function () {
        result = [];

        if ($(this).is(":checked")) {
          $inputs.prop("checked", true);
          result.push($(this).next().text());
        } else {
          $inputs.prop("checked", false);
        }

        updateLabel();
      });

      // Initial setup
      $inputs.each(function () {
        if ($(this).is(":checked")) {
          result.push($(this).next().text());
        }
      });

      updateLabel();

      $label.on("click", function () {
        $el.toggleClass("open-dropdown");
      });

      $(document).on("click touchstart", function (e) {
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
  $(function () {
    $("#datepicker").datepicker({
      dateFormat: "dd-mm-yy",
      duration: "fast",
    });
  });
}

function customEditDatePicker() {
  $(function () {
    var initialDate = $("#editdatepicker").val(); // Assuming the date is stored in the input field

    $("#editdatepicker").datepicker({
      dateFormat: "dd-mm-yy", // Update this if needed
      duration: "fast",
      defaultDate: initialDate,
    });
  });
}

// Create form validation
function formValidation() {
  console.log("loaded.....******");

  function validateName() {
    let name = $("#user_name").val();
    let namecheck = validator.isAlpha(name);

    if (!namecheck) {
      $("#name-error").text("Name can't be blank");
    } else {
      $("#name-error").text("");
    }
  }

  function validateEmail() {
    let email = $("#user_email").val();

    if (!validator.isEmail(email)) {
      $("#email-error").text("Email can't be blank");
    } else {
      $("#email-error").text("");
    }
  }

  function validatePassword() {
    let password = $("#user_password").val();

    if (!password) {
      $("#password-error").text("Password can't be blank");
    } else {
      $("#password-error").text("");
    }
  }

  function validatePasswordConfirmation() {
    let password = $("#user_password").val();
    let password_confirmation = $("#user_password_confirmation").val();

    if (!validator.equals(password, password_confirmation)) {
      $("#password-confirmation-error").text(
        "Password Confirmation dosen't match Password"
      );
    } else {
      $("#password-confirmation-error").text("");
    }
  }

  function validateContactNumber() {
    let contactNumber = $("#user_contact_number").val();

    if (contactNumber) {
      if (!validator.isNumeric(contactNumber) || contactNumber.length !== 10) {
        $("#contact-number-error").text(
          "Contact Number must be a 10-digit number"
        );
      } else {
        $("#contact-number-error").text("");
      }
    } else {
      // If contact number is blank, no validation error
      $("#contact-number-error").text("");
    }
  }

  function validateEmergencyContactNumber() {
    let emergencycontactNumber = $("#user_emergency_contact_number").val();

    if (emergencycontactNumber) {
      if (!validator.isNumeric(emergencycontactNumber) || emergencycontactNumber.length !== 10) {
        $("#emergency-contact-number-error").text(
          "Emergency Contact Number must be a 10-digit number"
        );
      } else {
        $("#emergency-contact-number-error").text("");
      }
    } else {
      // If contact number is blank, no validation error
      $("#emergency-contact-number-error").text("");
    }
  }

  $("#user_name").on("input", validateName);
  $("#user_email").on("input", validateEmail);
  $("#user_password").on("input", validatePassword);
  $("#user_password_confirmation").on("input", validatePasswordConfirmation);
  $("#user_contact_number").on("input", validateContactNumber);
  $("#user_emergency_contact_number").on("input", validateEmergencyContactNumber);

  $("#user-admin-form").on("submit", function (event) {
    validateName();
    validateEmail();
    validatePassword();
    validatePasswordConfirmation();
    validateContactNumber();
    validateEmergencyContactNumber();

    if (
      $("#name-error").text() ||
      $("#email-error").text() ||
      $("#password-error").text() ||
      $("#password-confirmation-error").text() ||
      $("#contact-number-error").text() ||
      $("#emergency-contact-number-error").text()
    ) {
      event.preventDefault();
    }
  });
}

//initialize script

$(document).ready(function () {
  editModelPopup();
  deletePopup();
  studentTableSearch();
  dropdownCheckBoxes();
  customDatePicker();
  customEditDatePicker();
  formValidation();

  $(document).on("turbo:render", function () {
    editModelPopup();
    deletePopup();
    studentTableSearch();
    dropdownCheckBoxes();
    customDatePicker();
    customEditDatePicker();
    formValidation();
  });
});

addEventListener("turbo:before-stream-render", (event) => {
  const fallbackToDefaultActions = event.detail.render;

  event.detail.render = function (streamElement) {
    fallbackToDefaultActions(streamElement);
    initModals();
    editModelPopup();
    deletePopup();
    dropdownCheckBoxes();
    customDatePicker();
    customEditDatePicker();
  };
});
