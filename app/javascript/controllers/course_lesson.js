function editPopup() {
  $("#lesson-table").on("click", ".edit-lesson-model", function () {
    let id = $(this).data("lesson-id");
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
  $("#lesson-table").on("click", ".send-delete-lesson", function () {
    let id = $(this).data("lesson-id");
    let searchParams = new URLSearchParams(window.location.search);
    let page = parseInt(searchParams.get("page")) || 1;
    let search = searchParams.get("search") || "";
    let per_page = parseInt(searchParams.get("per_page")) || 10;

    // Construct the base URL
    let baseUrl = `course_lessons/${id}`;

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
    $("#delete-lesson-model").attr("data-lesson-id", id);
    $("#delete-lesson-model").attr("href", baseUrl);
  });
}

function tableSearch() {
  let delayTimer;

  $("#lesson_search").on("input", function (e) {
    clearTimeout(delayTimer);
    delayTimer = setTimeout(function () {
      let searchValue = $("#lesson_search").val();
      $("#overlay").show();

      $.ajax({
        url: "/admin/course_lessons",
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
  function validateTitle() {
    let name = $("#lesson_title").val();

    if (!name) {
      $("#title-error").text("Title can't be blank");
    } else if (name.replace(/ /g, "").length < 3) {
      $("#title-error").text("Title is not valid");
    } else {
      $("#title-error").text("");
    }
  }

  function validateCourse() {
    let sectionId = $("#lesson_section_id").val();

    if (!sectionId) {
      $("#section-error").text("Please select a course");
    } else {
      $("#section-error").text("");
    }
  }

  $("#lesson_title").on("input", validateTitle);
  $("#lesson_section_id").on("input", validateCourse);

  $("#lesson-index-form").on("submit", function (event) {
    validateTitle();
    validateCourse();
    if ($("#title-error").text() || $("#section-error").text()) {
      event.preventDefault();
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
  function validateTitle() {
    let name = $("#edit-lesson-title").val();

    if (!name) {
      $("#edit-title-error").text("Title can't be blank");
    } else if (name.replace(/ /g, "").length < 3) {
      $("#edit-title-error").text("Title is not valid");
    } else {
      $("#edit-title-error").text("");
    }
  }

  $("#edit-lesson-popup").on("input", "#edit-lesson-title", validateTitle);

  $("#edit-lesson-popup").on("submit", "#lesson-admin-edit-form", function (
    event
  ) {
    validateTitle();

    if ($("#edit-title-error").text()) {
      event.preventDefault();
    }
  });
}

// Form reset Funtion

function resetNewForm() {
  $(".reset-form").on("click", function () {
    $("#section-admin-form")[0].reset();
    resetNewErrorMessages();
  });
}

function resetEditForm() {
  $("#modal-close-btn").on("click", function () {
    $("#section-admin-edit-form")[0].reset();
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
    if (!$(event.target).closest(".onclick-hover").length) {
      $(".onclick-hover").removeClass("click-btn-color");
    }
  });
}

function collectionSelect() {
  $("#filter-container .custom-select").each(function () {
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

function sectionSelect() {
  console.log("function called.............");
  $("#section-dropdown .new-custom-select").each(function () {
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

function lessonSelect() {
  $("#lesson-index-form .new-lesson-custom-select").each(function () {
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

function optionSelect() {
  $("#filter-container").on("click", ".new-custom-option", function () {
    $("#overlay").show();
    var selectedLessonId = $(this).data("value");
    $.ajax({
      type: "GET",
      url: "/admin/course_lessons",
      data: { lesson: selectedLessonId },
      headers: {
        Accept: "text/vnd.turbo-stream.html, text/html, application/xhtml+xml",
      },
      success: function (data) {
        Turbo.renderStreamMessage(data);
        var newUrl =
          window.location.protocol +
          "//" +
          window.location.host +
          window.location.pathname +
          "?lesson=" +
          encodeURIComponent(selectedLessonId);
        window.history.pushState({ path: newUrl }, "", newUrl);
        $("#overlay").hide();
      },
      error: function (error) {
        console.error("AJAX Error:", error);
      },
    });
  });
}


function selectSection() {
  console.log("loaded...........");
  $("#filter-container .custom-select").on("click", ".custom-option", function () {
    var courseId = $(this).data('value');
    console.log("course ifffff: ", courseId);

    // Make an AJAX request to fetch sections for the selected course
    $.ajax({
      url: '/admin/course_lessons/sections_for_course',
      type: 'GET',
      data: { course_id: courseId },
      headers: {
        Accept: "text/vnd.turbo-stream.html, text/html, application/xhtml+xml",
      },
      success: function (data) {
        Turbo.renderStreamMessage(data);
        // sectionSelect();
      },
      error: function (error) {
        console.error('Error:', error);
      }
    });
  });
}

$(document).ready(function () {
  editPopup();
  deletePopup();
  tableSearch();
  formValidation();
  onclickHover();
  resetNewForm();
  collectionSelect();
  optionSelect();
  selectSection();
  sectionSelect();
  lessonSelect();

  $(document).on("turbo:render", function () {
    console.log("rgreiute");
    editPopup();
    deletePopup();
    tableSearch();
    formValidation();
    onclickHover();
    resetNewForm();
    optionSelect();
    selectSection();
    lessonSelect();
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
    if (streamElement.target == 'section-dropdown') {
      sectionSelect();
    }
  };
});
