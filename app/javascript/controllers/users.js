function editPopup() {
  $(".edit-user-model").click(function() {
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
      done: function() {},
      error: function() {
        console.log("Error fetching data");
        $("#overlay").hide();
      },
    });
  });
}

function deletePopup() {
  $(".send-delete-user").click(function() {
    let id = $(this).data("user-id");
    let searchParams = new URLSearchParams(window.location.search);
    let page = parseInt(searchParams.get("page")) || 1;
    let search = searchParams.get("search") || "";
    let per_page = parseInt(searchParams.get("per_page")) || 10;

    // Construct the base URL
    let baseUrl = `users/${id}`;

    // Add params only if they are not empty
    if (page !== 1) {
      baseUrl += `?page=${page}`;
    }

    if (search !== "") {
      baseUrl += (page === 1 ? "?" : "&") + `search=${search}`;
    }

    if (per_page !== 10) {
      baseUrl += (page === 1 && search === "") ? "?" : "&";
      baseUrl += `per_page=${per_page}`;
    }

    // Update the href attribute
    $("#delete-user-model").attr("data-user-id", id);
    $("#delete-user-model").attr("href", baseUrl);
  });
}

function tableSearch() {
  let delayTimer;

  $("#user_search").on("input", function(e) {
    clearTimeout(delayTimer);
    delayTimer = setTimeout(function() {
      let searchValue = $("#user_search").val();
      $("#overlay").show();

      $.ajax({
        url: "/admin/users",
        type: "GET",
        data: {
          search: searchValue,
        },
        headers: {
          Accept: "text/vnd.turbo-stream.html, text/html, application/xhtml+xml",
        },
        success: function(res) {
          Turbo.renderStreamMessage(res);
          var newURL =
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname +
            "?search=" +
            encodeURIComponent(searchValue);
          window.history.pushState({
            path: newURL
          }, "", newURL);
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

  // Event bindings for registration form fields
  $("#user_name").on("blur", validateName); // Validate name on blur
  $("#user_email").on("blur", validateEmail); // Validate email on blur
  $("#user_password").on("blur", validatePassword); // Validate password on blur
  $("#user_password_confirmation").on("blur", validatePasswordConfirmation); // Validate password confirmation on blur

  // Event binding for form submission
  $("form").on("submit", function(event) {
    // Validate all fields on form submission
    let isNameValid = validateName();
    let isEmailValid = validateEmail();
    let isPasswordValid = validatePassword();
    let isPasswordConfirmationValid = validatePasswordConfirmation();

    // Check if any field is invalid
    if (!isNameValid || !isEmailValid || !isPasswordValid || !isPasswordConfirmationValid) {
      // Prevent form submission
      event.preventDefault();

      // Show all error messages
      validateName();
      validateEmail();
      validatePassword();
      validatePasswordConfirmation();
    }
  });
}

// Form reset errors

function resetNewErrorMessages() {
  $("#name-error").text("");
  $("#email-error").text("");
  $("#password-error").text("");
  $("#password-confirmation-error").text("");
}

function resetErrorMessages() {
  $("#edit-name-error").text("");
  $("#edit-email-error").text("");
  $("#edit-password-error").text("");
  $("#edit-password-confirmation-error").text("");
}

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

  $("#edit-user-popup").on("focusout", "#edit_user_name", validateName);
  $("#edit-user-popup").on("focusout", "#edit_user_email", validateEmail);
  $("#edit-user-popup").on("focusout", "#edit_user_password", validatePassword);
  $("#edit-user-popup").on("focusout", "#edit_user_password_confirmation", validatePasswordConfirmation);

  $("#edit-user-popup").on("submit", "#user-admin-edit-form", function(event) {
    let isNameValid = validateName();
    let isEmailValid = validateEmail();
    let isPasswordValid = validatePassword();
    let isPasswordConfirmationValid = validatePasswordConfirmation();

    if (!isNameValid || !isEmailValid || !isPasswordValid || !isPasswordConfirmationValid) {
      event.preventDefault();
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




//click btn hover color

function onclickHover() {
  $(".onclick-hover").on("click", function(event) {
    event.stopPropagation();
    $(this).addClass("click-btn-color");
  });

  $("#create-close-modal").on("click", function() {
    $(".onclick-hover").removeClass("click-btn-color");
  });

  $(document).on("click", function(event) {
    if (!$(event.target).closest('.onclick-hover').length) {
      $(".onclick-hover").removeClass("click-btn-color");
    }
  });
}

$(document).ready(function() {
  editPopup();
  deletePopup();
  tableSearch();
  formValidation();
  onclickHover();
  resetEditForm();
  resetNewForm();

  $(document).on("turbo:render", function() {
    editPopup();
    deletePopup();
    tableSearch();
    formValidation();
    onclickHover();
    resetEditForm();
    resetNewForm();
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
    editPopup();
    deletePopup();

  };
});