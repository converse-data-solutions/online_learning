function editPopup() {
  $("#trainer-course-table").on("click", ".edit-trainer-course-model", function () {
    console.log("clicked");
    let id = $(this).data("trainer-course-id");
    let url = $(this).data("url");
    let searchParams = new URLSearchParams(window.location.search);
    let page = parseInt(searchParams.get("page")) || 1;
    let search = searchParams.get("search") || "";
    $("#overlay").show();
    $.ajax({
      method: "GET",
      url: url,
      data: {
        trainer_course_id: id,
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
  $("#trainer-course-table").on("click", ".send-delete-trainer-course", function () {
    let id = $(this).data("trainer-course-id");

    let searchParams = new URLSearchParams(window.location.search);
    let page = parseInt(searchParams.get("page")) || 1;
    let search = searchParams.get("search") || "";
    let per_page = parseInt(searchParams.get("per_page")) || 10;

    // Construct the base URL
    let baseUrl = `trainer_courses/${id}`;

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
    $("#delete-trainer-course-model").attr("data-trainer-course-id", id);
    $("#delete-trainer-course-model").attr("href", baseUrl);
  });
}

function tableSearch() {
  let delayTimer;

  $("#trainer_course_search").on("input", function (e) {
    clearTimeout(delayTimer);
    delayTimer = setTimeout(function () {
      let searchValue = $("#trainer_course_search").val();
      $("#overlay").show();

      $.ajax({
        url: "/admin/trainer_courses",
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
  $("#trainer-course-filter-container .custom-select").each(function () {
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
  $("#trainer-course-filter-container .new-course-custom-select").each(
    function () {
      var classes = $(this).attr("class"),
        id = $(this).attr("id"),
        name = $(this).attr("name");

      var placeholderText = $(this).find("option:first-of-type").text();

      var template = '<div class="' + classes + '">';
      template +=
        '<span class="new-course-custom-select-trigger">' +
        placeholderText +
        "</span>";
      template += '<div class="new-course-custom-options">';
      $(this)
        .find("option")
        .each(function () {
          template +=
            '<span class="new-course-custom-option ' +
            $(this).attr("class") +
            '" data-value="' +
            $(this).attr("value") +
            '">' +
            $(this).html() +
            "</span>";
        });
      template += "</div></div>";

      $(this).wrap('<div class="new-course-custom-select-wrapper"></div>');
      $(this).hide();
      $(this).after(template);
    }
  );

  $(".new-course-custom-option:first-of-type").hover(
    function () {
      $(this).parents(".new-course-custom-options").addClass("option-hover");
    },
    function () {
      $(this).parents(".new-course-custom-options").removeClass("option-hover");
    }
  );

  $(".new-course-custom-select-trigger").on("click", function (event) {
    $("html").one("click", function () {
      $(".new-course-custom-select").removeClass("opened");
    });
    $(this).parents(".new-course-custom-select").toggleClass("opened");
    event.stopPropagation();
  });

  $(".new-course-custom-option").on("click", function () {
    $(this)
      .parents(".new-course-custom-select-wrapper")
      .find("select")
      .val($(this).data("value"));
    $(this)
      .parents(".new-course-custom-options")
      .find(".new-course-custom-option")
      .removeClass("selection");
    $(this).addClass("selection");
    $(this).parents(".new-course-custom-select").removeClass("opened");
    $(this)
      .parents(".new-course-custom-select")
      .find(".new-course-custom-select-trigger")
      .text($(this).text());
  });
}

function selectEditUser() {
  $("#edit-trainer_course-popup .new-lesson-custom-select").each(function () {
    var classes = $(this).attr("class"),
      id = $(this).attr("id"),
      name = $(this).attr("name");

    var placeholderText = $(this).find("option:first-of-type").text();

    var template = '<div class="' + classes + '">';
    template +=
      '<span class="new-lesson-custom-select-trigger">' +
      placeholderText +
      "</span>";
    template += '<div class="new-lesson-custom-options">';
    $(this)
      .find("option")
      .each(function () {
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
    function () {
      $(this).parents(".new-lesson-custom-options").addClass("option-hover");
    },
    function () {
      $(this).parents(".new-lesson-custom-options").removeClass("option-hover");
    }
  );

  $(".new-lesson-custom-select-trigger").on("click", function (event) {
    $("html").one("click", function () {
      $(".new-lesson-custom-select").removeClass("opened");
    });
    $(this).parents(".new-lesson-custom-select").toggleClass("opened");
    event.stopPropagation();
  });

  $(".new-lesson-custom-option").on("click", function () {
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
  $("#edit-trainer_course-popup .new-custom-select").each(function () {
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

function resetNewErrorMessages() {
  $("#student_name_error").text("");
  $("#course_name_error").text("");
  $("#course_amount_error").text("");
  
}

function resetNewForm() {
  $(".reset-form").on("click", function() {
    $("#user-course-admin-form")[0].reset()
    resetNewErrorMessages();
  });

}

function createValidation() {

  function enquireStudentName() {
    let name = $(".student_name").val();

    if (!name) {
      $("#student_name_error").text("Student name can't be blank");
      return false;
    } else {
      $("#student_name_error").text("");
      return true;
    }
  }

  function enquireCourseName(){
    let name = $(".student_course").val();

    if (!name) {
      $("#course_name_error").text("Course name can't be blank");
      return false;
    } else {
      $("#course_name_error").text("");
      return true;
    }
  }
  
  // Event bindings for registration form fields
  
  $(".student_name").on("blur", enquireStudentName);
  $(".student_course").on("blur", enquireCourseName);

  // Event binding for form submission
  $("#trainer-course-admin-form").on("submit", function(event) {
    // Validate all fields on form submission
    let isNameValid = enquireStudentName();
    let isCourseValid = enquireCourseName();

   
    // Check if any field is invalid
    if (
      !isNameValid ||
      !isCourseValid
     
    ) {
      // Prevent form submission
      event.preventDefault();

      // Show all error messages
      enquireStudentName();
      enquireCourseName();
    }
  });
}

function editValidation() {
  function enquireStudentName() {
    let name = $(".edit_student_name").val();

    if (!name) {
      $("#edit_student_name_error").text("Student name can't be blank");
      return false;
    } else {
      $("#edit_student_name_error").text("");
      return true;
    }
  }

  function enquireCourseName(){
    let name = $(".edit_student_course").val();

    if (!name) {
      $("#edit_course_name_error").text("Course name can't be blank");
      return false;
    } else {
      $("#edit_course_name_error").text("");
      return true;
    }
  }

  // Event bindings for registration form fields
  $("#edit-trainer_course-popup").on("focusout", ".edit_student_name", enquireStudentName);
  $("#edit-trainer_course-popup").on("focusout", ".edit_student_course", enquireCourseName);

  $("#edit-trainer_course-popup").on("submit", "#trainer-admin-edit-form", function(event) {

    let isNameValid = enquireStudentName();
    let isCourseValid = enquireCourseName();

    if (!isNameValid || !isCourseValid) {
      event.preventDefault();
    }
  });
}

$(document).ready(function () {
  editPopup();
  deletePopup();
  tableSearch();
  selectCreateCourse();
  selectCreateUser();
  resetNewForm();
  createValidation();
  editValidation();

  $(document).on("turbo:render", function () {
    editPopup();
    deletePopup();
    tableSearch();
    selectCreateCourse();
    selectCreateUser();
    resetNewForm();
    createValidation();
    editValidation();
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
    resetNewForm();
    createValidation();
    editValidation();
    if (streamElement.target == "trainer-course-admin-form") {
      selectCreateCourse();
      selectCreateUser();
    }
    if (streamElement.target == "edit-trainer_course-popup") {
      selectEditUser();
      selectEditCourse();
    }
  };
});
