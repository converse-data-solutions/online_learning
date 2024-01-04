function editPopup() {
  $(".edit-user-model").click(function () {
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
  $(".send-delete-user").click(function () {
    let id = $(this).data("user-id");
    $("#delete-user-model").attr("data-user-id", id);
    $("#delete-user-model").attr("href", `users/${id}`);
  });
}

function tableSearch() {
  $("#user_search").on("input", function () {
    let searchValue = $(this).val();
    $.ajax({
      url: "/admin/users",
      type: "GET",
      data: { search: searchValue },
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

  $("#user-admin-form").on("submit", function (event) {
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

$(document).ready(function () {
  editPopup();
  deletePopup();
  tableSearch();
  formValidation();

  $(document).on("turbo:render", function () {
    editPopup();
    deletePopup();
    tableSearch();
    formValidation();
  });
});

addEventListener("turbo:before-stream-render", (event) => {
  const fallbackToDefaultActions = event.detail.render;

  event.detail.render = function (streamElement) {
    fallbackToDefaultActions(streamElement);
    initModals();
    editPopup();
    deletePopup();
  };
});
