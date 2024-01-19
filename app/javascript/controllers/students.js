function editModelPopup() {
  $(".edit-student-model").click(function () {
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

      success: function (res) {
        Turbo.renderStreamMessage(res);
        $("#overlay").hide();
        editFormValidation();
      },
      error: function () {
        console.log("Error fetching data");
        $("#overlay").hide();
      },
    });
  });
}

function deletePopup() {
  $(".send-delete-student").click(function () {
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
  $(".view-student-model").click(function () {
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
      success: function (res) {
        Turbo.renderStreamMessage(res);
        $("#overlay").hide();
      },
      error: function () {
        console.log("Error fetching data");
        $("#overlay").hide();
      },
    });
  });
}

function studentTableSearch() {
  let delayTimer;

  $("#student_search").keyup(function (e) {
    clearTimeout(delayTimer);
    delayTimer = setTimeout(function () {
      let searchValue = $("#student_search").val();
      $("#overlay").show();
      $.ajax({
        url: "/admin/students",
        type: "GET",
        data: {
          search: searchValue,
        },
        headers: {
          Accept:
            "text/vnd.turbo-stream.html, text/html, application/xhtml+xml",
        },
        success: function (res) {
          Turbo.renderStreamMessage(res);
          let newURL =
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname +
            "?search=" +
            encodeURIComponent(searchValue);
          window.history.pushState(
            {
              path: newURL,
            },
            "",
            newURL
          );
          $("#overlay").hide();
        },
        error: function () {
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

    $el.each(function () {
      let $list = $(this).find(".dropdown-list"),
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
        let checkedText = $(this).next().text();

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
    let initialDate = $("#editdatepicker").val(); // Assuming the date is stored in the input field

    $("#editdatepicker").datepicker({
      dateFormat: "dd-mm-yy", // Update this if needed
      duration: "fast",
      defaultDate: initialDate,
    });
  });
}

// Create form validation
function formValidation() {
  function validateName() {
    let name = $("#user_name").val();
    let namecheck = /^[a-zA-Z ]+$/.test(name);

    if (!namecheck) {
      $("#name-error").text("Name can't be blank");
    } else {
      $("#name-error").text("");
    }
  }

  function validateEmail() {
    let email = $("#user_email").val().trim();
    let emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  
    if (!emailRegex.test(email)) {
      $("#email-error").text("Invalid email format");
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
      $("#contact-number-error").text("");
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
      } else {
        $("#emergency-contact-number-error").text("");
      }
    } else {
      $("#emergency-contact-number-error").text("");
    }
  }

  $("#user_name").on("input", validateName);
  $("#user_email").on("input", validateEmail);
  $("#user_password").on("input", validatePassword);
  $("#user_password_confirmation").on("input", validatePasswordConfirmation);
  $("#user_contact_number").on("input", validateContactNumber);
  $("#user_emergency_contact_number").on(
    "input",
    validateEmergencyContactNumber
  );

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

// Edit form validation
function editFormValidation() {
  function validateName() {
    let name = $("#edit_user_name").val();
    let namecheck = /^[a-zA-Z ]+$/.test(name);

    if (!namecheck) {
      $("#edit-name-error").text("Name can't be blank");
    } else {
      $("#edit-name-error").text("");
    }
  }

  function validateEmail() {
    let email = $("#edit_user_email").val().trim();
    let emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  
    if (!emailRegex.test(email)) {
      $("#edit-email-error").text("Invalid email format");
    } else {
      $("#edit-email-error").text("");
    }
  }

  function validatePassword() {
    let password = $("#edit_user_password").val();
    if (!password) {
      $("#edit-password-error").text("Password can't be blank");
    } else {
      $("#edit-password-error").text("");
    }
  }

  function validatePasswordConfirmation() {
    let password = $("#edit_user_password").val();
    let password_confirmation = $("#edit_user_password_confirmation").val();
    if (!validator.equals(password, password_confirmation)) {
      $("#edit-password-confirmation-error").text(
        "Password Confirmation dosen't match Password"
      );
    } else {
      $("#edit-password-confirmation-error").text("");
    }
  }

  function validateContactNumber() {
    let contactNumber = $("#edit_user_contact_number").val();

    if (contactNumber) {
      if (!validator.isNumeric(contactNumber) || contactNumber.length !== 10) {
        $("#edit-contact-number-error").text(
          "Contact Number must be a 10-digit number"
        );
      } else {
        $("#edit-contact-number-error").text("");
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
      } else {
        $("#edit-emergency-contact-number-error").text("");
      }
    } else {
      $("#edit-emergency-contact-number-error").text("");
    }
  }

  $("#edit-student-popup").on("input", "#edit_user_name", validateName);
  $("#edit-student-popup").on("input", "#edit_user_email", validateEmail);
  $("#edit-student-popup").on("input", "#edit_user_password", validatePassword);
  $("#edit-student-popup").on(
    "input",
    "#edit_user_password_confirmation",
    validatePasswordConfirmation
  );
  $("#edit-student-popup").on(
    "input",
    "#edit_user_contact_number",
    validateContactNumber
  );
  $("#edit-student-popup").on(
    "input",
    "#edit_user_emergency_contact_number",
    validateEmergencyContactNumber
  );

  $("#edit-student-popup").on("submit", "#user-admin-edit-form", function (
    event
  ) {
    validateName();
    validateEmail();
    validatePassword();
    validatePasswordConfirmation();
    validateContactNumber();
    validateEmergencyContactNumber();

    if (
      $("#edit-name-error").text() ||
      $("#edit-email-error").text() ||
      $("#edit-password-error").text() ||
      $("#edit-password-confirmation-error").text() ||
      $("#edit-contact-number-error").text() ||
      $("#edit-emergency-contact-number-error").text()
    ) {
      event.preventDefault();
    }
  });
}

// Onclick hover color change
function onclickHover() {
  $(".onclick-hover").on("click", function (event) {
    event.stopPropagation();
    $(this).addClass("click-btn-color");
  });

  $("#student-create-close-btn").on("click", function () {
    $(".onclick-hover").removeClass("click-btn-color");
  });

  $(document).on("click", function (event) {
    if (!$(event.target).closest('.onclick-hover').length) {
      $(".onclick-hover").removeClass("click-btn-color");
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
  editFormValidation();
  viewStudents();
  onclickHover();

  $(document).on("turbo:render", function () {
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
  });

  $(document).on("turbo:before-render", function () {
    $("#overlay").show();
  });
  $(document).on("turbo:after-render", function () {
    $("#overlay").hide();
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
    viewStudents();
  };
});
