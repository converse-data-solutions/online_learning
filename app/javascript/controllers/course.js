//Filter for Collection-Select

$(".filter-handle").on("change", function (e) {
  var location = e.target.value;
  var table = $(".filter-table-data");
  if (location.length) {
    table.find("tr[data-type!=" + location + "]").hide();
    table.find("tr[data-type=" + location + "]").show();
  } else {
    table.find("tr").show();
  }
});

// Table Search Bar
function tableSearch() {
  $("#table-search").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#myTable tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });
}

// Stepper Table New Form
function tableForm() {
  $(".display-section-button").click(function () {
    $(".display-section").toggle();
  });
  $(".display-lesson-button").click(function () {
    $(".display-lesson").show();
  });
}

// Collection-Select Style
function collectionSelect() {
  $(".custom-select").each(function () {
    var classes = $(this).attr("class"),
      id = $(this).attr("id"),
      name = $(this).attr("name");

    var placeholderText = $(this).find("option:first-of-type").text(); // Get text of the first option

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

// Lesson File Upload

$(document).on("change", ".clipUpload input[type='file']", function () {
  if ($(this).val()) {
    var filename = $(this).val().split("\\");

    filename = filename[filename.length - 1];

    $(".clip").text(filename);
  }
});
$(document).on("change", ".fileUploadWrap input[type='file']", function () {
  if ($(this).val()) {
    var filename = $(this).val().split("\\");

    filename = filename[filename.length - 1];

    $(".attachments").text(filename);
  }
});

// Course Edit Popup
function courseEditPopup() {
  $(".edit-course-model").click(function () {
    let id = $(this).data("course-id");
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

// Course Delete Popup
function courseDeletePopup() {
  $(".send-delete-course").click(function () {
    let id = $(this).data("course-id");
    $("#delete-course-model").attr("data-course-id", id);
    $("#delete-course-model").attr("href", `courses/${id}`);
  });
}

// Course Steeper Section Edit Popup
function steeperSectionEditPopup() {
  $(".edit-stepper-section-modal").click(function () {
    let id = $(this).data("section-id");
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

// Course Stepper Section Delete Popup
function steeperSectionDeletePopup() {
  $(".send-stepper-delete-section").click(function () {
    let id = $(this).data("section-id");
    $("#steeper-delete-section-modal").attr("data-section-id", id);
    $("#steeper-delete-section-modal").attr("href", `sections/${id}`);
  });
}

// Course Steeper Lesson Edit Popup
function steeperLessonEditPopup() {
  $(".edit-stepper-lesson-modal").click(function () {
    let id = $(this).data("lesson-id");
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

// Course Stepper Lesson Delete Popup
function steeperLessonDeletePopup() {
  $(".send-stepper-delete-lesson").click(function () {
    let id = $(this).data("lesson-id");
    $("#steeper-delete-lesson-modal").attr("data-lesson-id", id);
    $("#steeper-delete-lesson-modal").attr("href", `lessons/${id}`);
  });
}

// Course index table search
function courseTableSearch() {
  $("#course_search").on("input", function () {
    let searchValue = $(this).val();
    $.ajax({
      url: "/admin/courses",
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

$(document).ready(function () {
  tableForm();
  tableSearch();
  collectionSelect();
  courseEditPopup();
  courseDeletePopup();
  courseTableSearch();
  steeperSectionEditPopup();
  steeperSectionDeletePopup();
  steeperLessonEditPopup();
  steeperLessonDeletePopup();

  $(document).on("turbo:render", function () {
    tableForm();
    tableSearch();
    courseEditPopup();
    courseDeletePopup();
    courseTableSearch();
    steeperSectionEditPopup();
    steeperSectionDeletePopup();
    steeperLessonEditPopup();
    steeperLessonDeletePopup();

    if ($("#stepper-loader").length > 0) {
      new HSStepper($("#stepper-loader")[0]);
    }
  });
});

addEventListener("turbo:before-stream-render", (event) => {
  const fallbackToDefaultActions = event.detail.render;
  console.log("fallbackToDefaultActions");

  event.detail.render = function (streamElement) {
    fallbackToDefaultActions(streamElement);
    initModals();
    courseEditPopup();
    courseDeletePopup();
    steeperLessonEditPopup();
    steeperLessonDeletePopup();
  };
});
