function editPopup() {
  $("#user-course-table").on("click", ".edit-user-course-model", function () {
    let id = $(this).data("user-course-id");
    let url = $(this).data("url");
    let searchParams = new URLSearchParams(window.location.search);
    let page = parseInt(searchParams.get("page")) || 1;
    let search = searchParams.get("search") || "";
    $("#overlay").show();
    $.ajax({
      method: "GET",
      url: url,
      data: {
        user_course_id: id,
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
      done: function () {},
      error: function () {
        console.log("Error fetching data");
        $("#overlay").hide();
      },
    });
  });
}

function deletePopup() {
  $(".send-delete-user-course").click(function () {
    let id = $(this).data("user-course-id");

    let searchParams = new URLSearchParams(window.location.search);
    let page = parseInt(searchParams.get("page")) || 1;
    let search = searchParams.get("search") || "";
    let per_page = parseInt(searchParams.get("per_page")) || 10;

    // Construct the base URL
    let baseUrl = `user_courses/${id}`;

    // Add params only if they are not empty
    if (page !== 1) {
      baseUrl += `?page=${page}`;
    }

    if (search !== "") {
      baseUrl += (page === 1 ? "?" : "&") + `search=${search}`;
    }

    if (per_page !== 10) {
      baseUrl += page === 1 && search === "" ? "?" : "&";
      baseUrl += `per_page=${per_page}`;
    }

    // Update the href attribute
    $("#delete-user-course-model").attr("data-user-course-id", id);
    $("#delete-user-course-model").attr("href", baseUrl);
  });
}

function tableSearch() {
  let delayTimer;

  $("#user_course_search").on("input", function (e) {
    clearTimeout(delayTimer);
    delayTimer = setTimeout(function () {
      let searchValue = $("#user_course_search").val();
      $("#overlay").show();

      $.ajax({
        url: "/admin/user_courses",
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

// function formValidation() {
//   function validateName() {
//     let name = $("#user_name").val();
//     let namecheck = /^[a-zA-Z ]+$/.test(name);

//     if (!name) {
//       $("#name-error").text("Name can't be blank");
//       return false;
//     } else if (!namecheck) {
//       $("#name-error").text("Please enter a valid name (only alphabets allowed)");
//       return false;
//     } else {
//       $("#name-error").text("");
//       return true;
//     }
//   }

//   // Function to validate email field
//   function validateEmail() {
//     let email = $("#user_email").val().trim();
//     let emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
//     if (!email) {
//       $("#email-error").text("Email can't be blank");
//       return false; // Return false to indicate validation failure
//     } else if (!emailRegex.test(email)) {
//       $("#email-error").text("Please enter a valid email address");
//       return false; // Return false to indicate validation failure
//     } else {
//       $("#email-error").text("");
//       return true; // Return true to indicate validation success
//     }
//   }

//   // Function to validate password field
//   function validatePassword() {
//     let password = $("#user_password").val();
//     let hasUppercase = /[A-Z]/.test(password);
//     let hasNumber = /\d/.test(password);
//     let hasSpecialChar = /[!@#$%^&*()_+]/.test(password);
//     if (!password) {
//       $("#password-error").text("Password can't be blank");
//       return false;
//     } else if (password.length < 8) {
//       $("#password-error").text("Password must be at least 8 characters long");
//       return false;
//     } else if (!hasUppercase) {
//       $("#password-error").text("Password must contain at least one uppercase letter");
//       return false;
//     } else if (!hasNumber) {
//       $("#password-error").text("Password must contain at least one numeric digit");
//       return false;
//     } else if (!hasSpecialChar) {
//       $("#password-error").text("Password must contain at least one special character");
//       return false;
//     } else {
//       $("#password-error").text("");
//       return true;
//     }
//   }

//   // Function to validate password confirmation field
//   function validatePasswordConfirmation() {
//     let password = $("#user_password").val();
//     let passwordConfirmation = $("#user_password_confirmation").val();
//     if (password !== passwordConfirmation) {
//       $("#password-confirmation-error").text("Password confirmation doesn't match");
//       return false; // Return false to indicate validation failure
//     } else {
//       $("#password-confirmation-error").text("");
//       return true; // Return true to indicate validation success
//     }
//   }

//   // Event bindings for registration form fields
//   $("#user_name").on("blur", validateName); // Validate name on blur
//   $("#user_email").on("blur", validateEmail); // Validate email on blur
//   $("#user_password").on("blur", validatePassword); // Validate password on blur
//   $("#user_password_confirmation").on("blur", validatePasswordConfirmation); // Validate password confirmation on blur

//   // Event binding for form submission
//   $("#user-admin-form").on("submit", function(event) {
//     // Validate all fields on form submission
//     let isNameValid = validateName();
//     let isEmailValid = validateEmail();
//     let isPasswordValid = validatePassword();
//     let isPasswordConfirmationValid = validatePasswordConfirmation();

//     // Check if any field is invalid
//     if (!isNameValid || !isEmailValid || !isPasswordValid || !isPasswordConfirmationValid) {
//       // Prevent form submission
//       event.preventDefault();

//       // Show all error messages
//       validateName();
//       validateEmail();
//       validatePassword();
//       validatePasswordConfirmation();
//     }
//   });
// }

// // Form reset errors

// function resetNewErrorMessages() {
//   $("#name-error").text("");
//   $("#email-error").text("");
//   $("#password-error").text("");
//   $("#password-confirmation-error").text("");
// }

// function resetErrorMessages() {
//   $("#edit-name-error").text("");
//   $("#edit-email-error").text("");
//   $("#edit-password-error").text("");
//   $("#edit-password-confirmation-error").text("");
// }

// function editFormValidation() {
//   function validateName() {
//     let name = $("#edit_user_name").val();
//     let namecheck = /^[a-zA-Z ]+$/.test(name);

//     if (!name) {
//       $("#edit-name-error").text("Name can't be blank");
//       return false;
//     } else if (!namecheck) {
//       $("#edit-name-error").text("Please enter a valid name (only alphabets allowed)");
//       return false;
//     } else {
//       $("#edit-name-error").text("");
//       return true;
//     }
//   }

//   function validateEmail() {
//     let email = $("#edit_user_email").val().trim();
//     let emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

//     if (!email) {
//       $("#edit-email-error").text("Email can't be blank");
//       return false;
//     } else if (!emailRegex.test(email)) {
//       $("#edit-email-error").text("Please enter a valid email address");
//       return false;
//     } else {
//       $("#edit-email-error").text("");
//       return true;
//     }
//   }

//   function validatePassword() {
//     let password = $("#edit_user_password").val();
//     let hasUppercase = /[A-Z]/.test(password);
//     let hasNumber = /\d/.test(password);
//     let hasSpecialChar = /[!@#$%^&*()_+]/.test(password);

//     if (!password) {
//       $("#edit-password-error").text("Password can't be blank");
//       return false;
//     } else if (password.length < 8) {
//       $("#edit-password-error").text("Password must be at least 8 characters long");
//       return false;
//     } else if (!hasUppercase) {
//       $("#edit-password-error").text("Password must contain at least one uppercase letter");
//       return false;
//     } else if (!hasNumber) {
//       $("#edit-password-error").text("Password must contain at least one numeric digit");
//       return false;
//     } else if (!hasSpecialChar) {
//       $("#edit-password-error").text("Password must contain at least one special character");
//       return false;
//     } else {
//       $("#edit-password-error").text("");
//       return true;
//     }
//   }

//   function validatePasswordConfirmation() {
//     let password = $("#edit_user_password").val();
//     let passwordConfirmation = $("#edit_user_password_confirmation").val();

//     if (password !== passwordConfirmation) {
//       $("#edit-password-confirmation-error").text("Password confirmation doesn't match");
//       return false;
//     } else {
//       $("#edit-password-confirmation-error").text("");
//       return true;
//     }
//   }

//   $("#edit-user-popup").on("focusout", "#edit_user_name", validateName);
//   $("#edit-user-popup").on("focusout", "#edit_user_email", validateEmail);
//   $("#edit-user-popup").on("focusout", "#edit_user_password", validatePassword);
//   $("#edit-user-popup").on("focusout", "#edit_user_password_confirmation", validatePasswordConfirmation);

//   $("#edit-user-popup").on("submit", "#user-admin-edit-form", function(event) {
//     let isNameValid = validateName();
//     let isEmailValid = validateEmail();
//     let isPasswordValid = validatePassword();
//     let isPasswordConfirmationValid = validatePasswordConfirmation();

//     if (!isNameValid || !isEmailValid || !isPasswordValid || !isPasswordConfirmationValid) {
//       event.preventDefault();
//     }
//   });
// }

// // Form reset Funtion

// function resetNewForm() {
//   $(".reset-form").on("click", function() {
//     $("#user-admin-form")[0].reset()
//     resetNewErrorMessages();
//   });

// }

// function resetEditForm() {
//   $("#modal-close-btn").on("click", function() {
//       var formElement = $("#user-admin-edit-form");
//       if (formElement.length > 0) {
//           formElement[0].reset();
//           resetErrorMessages();
//       } else {
//           console.error("Form element not found.");
//       }
//   });
// }

// //click btn hover color

// function onclickHover() {
//   $(".onclick-hover").on("click", function(event) {
//     event.stopPropagation();
//     $(this).addClass("click-btn-color");
//   });

//   $("#create-close-modal").on("click", function() {
//     $(".onclick-hover").removeClass("click-btn-color");
//   });

//   $(document).on("click", function(event) {
//     if (!$(event.target).closest('.onclick-hover').length) {
//       $(".onclick-hover").removeClass("click-btn-color");
//     }
//   });
// }

function getCourseAmount() {
  $("#user-course-filter-container").on(
    "click",
    ".new-lesson-custom-option",
    function () {
      $("#overlay").show();
      var selectedUserId = $(this).data("value");
      console.log(selectedUserId);
      $.ajax({
        type: "GET",
        url: "/admin/users",
        data: {
          user: selectedUserId,
        },
        headers: {
          Accept:
            "text/vnd.turbo-stream.html, text/html, application/xhtml+xml",
        },
        success: function (data) {
          Turbo.renderStreamMessage(data);
          var newUrl =
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname +
            "?course=" +
            encodeURIComponent(selectedUserId);
          window.history.pushState(
            {
              path: newUrl,
            },
            "",
            newUrl
          );
          $("#overlay").hide();
        },
        error: function (error) {
          console.error("AJAX Error:", error);
          $("#overlay").hide();
        },
      });
    }
  );
}

function selectCreateUser() {
  $("#user-course-filter-container .custom-select").each(function () {
    var classes = $(this).attr("class"),
      id = $(this).attr("id"),
      name = $(this).attr("name");

    var placeholderText = $(this).find("option:first-of-type").text();

    var template = '<div class="' + classes + '">';
    template +=
      '<span class="custom-select-trigger">' + placeholderText + "</span>";
    template += '<div class="custom-options">';
    $(this)
      .find("option")
      .each(function () {
        template +=
          '<span class="custom-option ' +
          $(this).attr("class") +
          '" data-value="' +
          $(this).attr("value") +
          '">' +
          $(this).html() +
          "</span>";
      });
    template += "</div></div>";

    $(this).wrap('<div class="custom-select-wrapper"></div>');
    $(this).hide();
    $(this).after(template);
  });

  $(".custom-option:first-of-type").hover(
    function () {
      $(this).parents(".custom-options").addClass("option-hover");
    },
    function () {
      $(this).parents(".custom-options").removeClass("option-hover");
    }
  );

  $(".custom-select-trigger").on("click", function (event) {
    $("html").one("click", function () {
      $(".custom-select").removeClass("opened");
    });
    $(this).parents(".custom-select").toggleClass("opened");
    event.stopPropagation();
  });

  $(".custom-option").on("click", function () {
    $(this)
      .parents(".custom-select-wrapper")
      .find("select")
      .val($(this).data("value"));
    $(this)
      .parents(".custom-options")
      .find(".custom-option")
      .removeClass("selection");
    $(this).addClass("selection");
    $(this).parents(".custom-select").removeClass("opened");
    $(this)
      .parents(".custom-select")
      .find(".custom-select-trigger")
      .text($(this).text());
  });
}

function selectCreateCourse() {
  $("#user-course-filter-container .new-custom-select").each(function () {
    var classes = $(this).attr("class"),
      id = $(this).attr("id"),
      name = $(this).attr("name");

    var placeholderText = $(this).find("option:first-of-type").text();

    var template = '<div class="' + classes + '">';
    template +=
      '<span class="new-custom-select-trigger">' + placeholderText + "</span>";
    template += '<div class="new-custom-options">';
    $(this)
      .find("option")
      .each(function () {
        template +=
          '<span class="new-custom-option ' +
          $(this).attr("class") +
          '" data-value="' +
          $(this).attr("value") +
          '">' +
          $(this).html() +
          "</span>";
      });
    template += "</div></div>";

    $(this).wrap('<div class="new-custom-select-wrapper"></div>');
    $(this).hide();
    $(this).after(template);
  });

  $(".new-custom-option:first-of-type").hover(
    function () {
      $(this).parents(".new-custom-options").addClass("option-hover");
    },
    function () {
      $(this).parents(".new-custom-options").removeClass("option-hover");
    }
  );

  $(".new-custom-select-trigger").on("click", function (event) {
    $("html").one("click", function () {
      $(".new-custom-select").removeClass("opened");
    });
    $(this).parents(".new-custom-select").toggleClass("opened");
    event.stopPropagation();
  });

  $(".new-custom-option").on("click", function () {
    $(this)
      .parents(".new-custom-select-wrapper")
      .find("select")
      .val($(this).data("value"));
    $(this)
      .parents(".new-custom-options")
      .find(".new-custom-option")
      .removeClass("selection");
    $(this).addClass("selection");
    $(this).parents(".new-custom-select").removeClass("opened");
    $(this)
      .parents(".new-custom-select")
      .find(".new-custom-select-trigger")
      .text($(this).text());
  });
}

function selectEditUser(){
  $("#edit-user_course-popup .new-lesson-custom-select").each(function() {
    var classes = $(this).attr("class"),
      id = $(this).attr("id"),
      name = $(this).attr("name");

    var placeholderText = $(this).find("option:first-of-type").text();

    var template = '<div class="' + classes + '">';
    template +=
      '<span class="new-lesson-custom-select-trigger">' + placeholderText + "</span>";
    template += '<div class="new-lesson-custom-options">';
    $(this)
      .find("option")
      .each(function() {
        template +=
          '<span class="new-lesson-custom-option ' +
          $(this).attr("class") +
          '" data-value="' +
          $(this).attr("value") +
          '">' +
          $(this).html() +
          "</span>";
      });
    template += "</div></div>";

    $(this).wrap('<div class="new-lesson-custom-select-wrapper"></div>');
    $(this).hide();
    $(this).after(template);
  });

  $(".new-lesson-custom-option:first-of-type").hover(
    function() {
      $(this).parents(".new-lesson-custom-options").addClass("option-hover");
    },
    function() {
      $(this).parents(".new-lesson-custom-options").removeClass("option-hover");
    }
  );

  $(".new-lesson-custom-select-trigger").on("click", function(event) {
    $("html").one("click", function() {
      $(".new-lesson-custom-select").removeClass("opened");
    });
    $(this).parents(".new-lesson-custom-select").toggleClass("opened");
    event.stopPropagation();
  });

  $(".new-lesson-custom-option").on("click", function() {
    $(this)
      .parents(".new-lesson-custom-select-wrapper")
      .find("select")
      .val($(this).data("value"));
    $(this)
      .parents(".new-lesson-custom-options")
      .find(".new-lesson-custom-option")
      .removeClass("selection");
    $(this).addClass("selection");
    $(this).parents(".new-lesson-custom-select").removeClass("opened");
    $(this)
      .parents(".new-lesson-custom-select")
      .find(".new-lesson-custom-select-trigger")
      .text($(this).text());
  });
}

function selectEditCourse() {
  $("#edit-user_course-popup .new-custom-select").each(function () {
    var classes = $(this).attr("class"),
      id = $(this).attr("id"),
      name = $(this).attr("name");

    var placeholderText = $(this).find("option:first-of-type").text();

    var template = '<div class="' + classes + '">';
    template +=
      '<span class="new-custom-select-trigger">' + placeholderText + "</span>";
    template += '<div class="new-custom-options">';
    $(this)
      .find("option")
      .each(function () {
        template +=
          '<span class="new-custom-option ' +
          $(this).attr("class") +
          '" data-value="' +
          $(this).attr("value") +
          '">' +
          $(this).html() +
          "</span>";
      });
    template += "</div></div>";

    $(this).wrap('<div class="new-custom-select-wrapper"></div>');
    $(this).hide();
    $(this).after(template);
  });

  $(".new-custom-option:first-of-type").hover(
    function () {
      $(this).parents(".new-custom-options").addClass("option-hover");
    },
    function () {
      $(this).parents(".new-custom-options").removeClass("option-hover");
    }
  );

  $(".new-custom-select-trigger").on("click", function (event) {
    $("html").one("click", function () {
      $(".new-custom-select").removeClass("opened");
    });
    $(this).parents(".new-custom-select").toggleClass("opened");
    event.stopPropagation();
  });

  $(".new-custom-option").on("click", function () {
    $(this)
      .parents(".new-custom-select-wrapper")
      .find("select")
      .val($(this).data("value"));
    $(this)
      .parents(".new-custom-options")
      .find(".new-custom-option")
      .removeClass("selection");
    $(this).addClass("selection");
    $(this).parents(".new-custom-select").removeClass("opened");
    $(this)
      .parents(".new-custom-select")
      .find(".new-custom-select-trigger")
      .text($(this).text());
  });
}


$(document).ready(function () {
  editPopup();
  deletePopup();
  tableSearch();
  selectCreateCourse();
  selectCreateUser();
  selectEditUser();
  selectEditCourse();

  $(document).on("turbo:render", function () {
    editPopup();
    deletePopup();
    tableSearch();
    selectCreateCourse();
    selectCreateUser();
    selectEditUser();
    selectEditCourse();
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
    selectEditUser();
    selectEditCourse();
  };
});
