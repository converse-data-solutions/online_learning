function editPopup() {
  $(".edit-user-model").click(function () {
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
      done: function () {},
      error: function () {
        console.log("Error fetching data");
        $("#overlay").hide();
      },
    });
  });
}

function deletePopup() {
  $(".send-delete-user").click(function () {
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

  $("#user_search").on("input", function (e) {
    clearTimeout(delayTimer);
    delayTimer = setTimeout(function () {
      let searchValue = $("#user_search").val();
      $("#overlay").show();

      $.ajax({
        url: "/admin/users",
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
          var newURL =
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname +
            "?search=" +
            encodeURIComponent(searchValue);
          window.history.pushState({ path: newURL }, "", newURL);
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



function formValidation() {
  function validateName() {
    let name = $("#user_name").val();
    let namecheck = /^[a-zA-Z ]+$/.test(name);
  
    if (!name) {
      $("#name-error").text("Name can't be blank");
    } else if (!namecheck) {
      $("#name-error").text("Please enter a valid name (only alphabets allowed)");
    } else {
      $("#name-error").text("");
    }
  }
  
  function validateEmail() {
    let email = $("#user_email").val().trim();
    let emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  
    if (!email) {
      $("#email-error").text("Email can't be blank");
    } else if (!emailRegex.test(email)) {
      $("#email-error").text("Please enter a valid email address");
    } else {
      $("#email-error").text("");
    }
  }
  
  function validatePassword() {
    let password = $("#user_password").val();
  
    // Password must contain at least one uppercase letter, one numeric digit, and one special character
    let passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
  
    if (!password) {
      $("#password-error").text("Password can't be blank");
    } else if (!passwordRegex.test(password)) {
      $("#password-error").text("Password must contain at least one uppercase letter, one numeric digit, and one special character");
    } else {
      $("#password-error").text("");
    }
  }
  
  
  function validatePasswordConfirmation() {
    let password = $("#user_password").val();
    let password_confirmation = $("#user_password_confirmation").val();
  
    if (!password_confirmation) {
      $("#password-confirmation-error").text("Password Confirmation can't be blank");
    } else if (!validator.equals(password, password_confirmation)) {
      $("#password-confirmation-error").text("Password Confirmation doesn't match Password");
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

// Form reset errors

function resetNewErrorMessages(){
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
    } else if (!namecheck) {
      $("#edit-name-error").text("Please enter a valid name (only alphabets allowed)");
    } else {
      $("#name-error").text("");
    }
  }
  
  function validateEmail() {
    let email = $("#edit_user_email").val().trim();
    let emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  
    if (!email) {
      $("#edit-email-error").text("Email can't be blank");
    } else if (!emailRegex.test(email)) {
      $("#edit-email-error").text("Please enter a valid email address");
    } else {
      $("#edit-email-error").text("");
    }
  }
  
  function validatePassword() {
    let password = $("#edit_user_password").val();
  
    // Password must contain at least one uppercase letter, one numeric digit, and one special character
    let passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
  
    if (!password) {
      $("#edit-password-error").text("Password can't be blank");
    } else if (!passwordRegex.test(password)) {
      $("#edit-password-error").text("Password must contain at least one uppercase letter, one numeric digit, and one special character");
    } else {
      $("#edit-password-error").text("");
    }
  }
  
  
  function validatePasswordConfirmation() {
    let password = $("#edit_user_password").val();
    let password_confirmation = $("#edit_user_password_confirmation").val();
  
    if (!password_confirmation) {
      $("#edit-password-confirmation-error").text("Password Confirmation can't be blank");
    } else if (!validator.equals(password, password_confirmation)) {
      $("#edit-password-confirmation-error").text("Password Confirmation doesn't match Password");
    } else {
      $("#edit-password-confirmation-error").text("");
    }
  }
  

  $("#edit-user-popup").on("input", "#edit_user_name", validateName);
  $("#edit-user-popup").on("input", "#edit_user_email", validateEmail);
  $("#edit-user-popup").on("input", "#edit_user_password", validatePassword);
  $("#edit-user-popup").on(
    "input",
    "#edit_user_password_confirmation",
    validatePasswordConfirmation
  );

  $("#edit-user-popup").on("submit", "#user-admin-edit-form", function (event) {
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

// Form reset Funtion

function resetNewForm(){
  $(".reset-form").on("click", function () {
    $("#user-admin-form")[0].reset()
    console.log("values new reseted");
    resetNewErrorMessages();
  });
  
}

function resetEditForm(){
  $("#modal-close-btn").on("click", function () {
    $("#user-admin-edit-form")[0].reset()
    console.log("values reseted");
    resetErrorMessages();
  });
}



//click btn hover color

function onclickHover() {
  $(".onclick-hover").on("click", function (event) {
    event.stopPropagation();
    $(this).addClass("click-btn-color");
  });

  $("#create-close-modal").on("click", function () {
    $(".onclick-hover").removeClass("click-btn-color");
  });

  $(document).on("click", function (event) {
    if (!$(event.target).closest('.onclick-hover').length) {
      $(".onclick-hover").removeClass("click-btn-color");
    }
  });
}

$(document).ready(function () {
  deletePopup();
  tableSearch();
  formValidation();
  onclickHover();
  resetEditForm();
  resetNewForm();

  $(document).on("turbo:render", function () {
    deletePopup();
    tableSearch();
    formValidation();
    onclickHover();
    resetEditForm();
    resetNewForm();
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
    deletePopup();

  };
});
