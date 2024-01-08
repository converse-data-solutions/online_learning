function editPopup() {
  $(".edit-user-model").click(function() {
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

      success: function(res) {
        Turbo.renderStreamMessage(res);
        editFormValidation();
        loader();
      },
      error: function() {
        console.log("Error fetching data");
      },
    });
  });
}

function deletePopup() {
  $(".send-delete-user").click(function() {
    let id = $(this).data("user-id");
    $("#delete-user-model").attr("data-user-id", id);
    $("#delete-user-model").attr("href", `users/${id}`);
  });
}


function tableSearch() {
  let delayTimer;

  $("#user_search").keyup(function(e) {
    clearTimeout(delayTimer);
    console.log(e.keyCode);
    delayTimer = setTimeout(function() {
      let searchValue = $("#user_search").val();

      $.ajax({
        url: "/admin/users",
        type: "GET",
        data: {
          search: searchValue
        },
        headers: {
          Accept: "text/vnd.turbo-stream.html, text/html, application/xhtml+xml",
        },
        success: function(res) {
          Turbo.renderStreamMessage(res);
          var newURL = window.location.protocol + "//" + window.location.host + window.location.pathname + '?search=' + encodeURIComponent(searchValue);
          window.history.pushState({ path: newURL }, '', newURL);
          


        },
        error: function() {
          console.log("Error fetching data");
        },
      });
    }, 500);
  });
}

function loader() {
  console.log("loader");
    $("#overlay").fadeIn(300);
    $("#overlay").delay(300).fadeOut(300);
}

function formValidation() {

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

  $("#user_name").on("input", validateName);
  $("#user_email").on("input", validateEmail);
  $("#user_password").on("input", validatePassword);
  $("#user_password_confirmation").on("input", validatePasswordConfirmation);

  $("#user-admin-form").on("submit", function(event) {
    validateName();
    validateEmail();
    validatePassword();
    validatePasswordConfirmation();

    if (
      $("#name-error").text() ||
      $("#email-error").text() ||
      $("#password-error").text() ||
      $("#password-confirmation-error").text()
    ) {
      event.preventDefault();
    }
  });
}

function editFormValidation() {
  function validateName() {
    let name = $("#edit_user_name").val().trim();
    if (!name) {
      $("#edit-name-error").text("Name can't be blank");
    } else {
      $("#edit-name-error").text("");
    }
  }

  function validateEmail() {
    let email = $("#edit_user_email").val().trim();
    if (!validator.isEmail(email)) {
      $("#edit-email-error").text("Email can't be blank");
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
      $("#edit-password-confirmation-error").text("Password Confirmation dosen't match Password");
    } else {
      $("#edit-password-confirmation-error").text("");
    }
  }

  $("#edit-user-popup").on("input", "#edit_user_name", validateName);
  $("#edit-user-popup").on("input", "#edit_user_email", validateEmail);
  $("#edit-user-popup").on("input", "#edit_user_password", validatePassword);
  $("#edit-user-popup").on("input", "#edit_user_password_confirmation", validatePasswordConfirmation);

  $("#edit-user-popup").on("submit", "#user-admin-edit-form", function(event) {
    console.log("form submitted");
    validateName();
    validateEmail();
    validatePassword();
    validatePasswordConfirmation();

    if (
      $("#edit-name-error").text() ||
      $("#edit-email-error").text() ||
      $("#edit-password-error").text() ||
      $("#edit-password-confirmation-error").text()
    ) {
      event.preventDefault();
    }
  });
}


$(document).ready(function() {
  editPopup();
  deletePopup();
  tableSearch();
  formValidation();

  $(document).on("turbo:render", function() {
    editPopup();
    deletePopup();
    tableSearch();
    formValidation();
  });
});

addEventListener("turbo:before-stream-render", (event) => {
  const fallbackToDefaultActions = event.detail.render;

  event.detail.render = function(streamElement) {
    fallbackToDefaultActions(streamElement);
    initModals();
    editPopup();

  };
});