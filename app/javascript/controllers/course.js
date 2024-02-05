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

// Stepper Table New Form
function tableSectionForm() {
  $(".display-section-button").click(function () {
    $(".display-section").toggle();
  });
  $(".display-lesson-button").click(function () {
    $(".display-lesson").show();
  });
}

function tableLessonForm() {
  $(".display-lesson-button").click(function () {
    $(".display-lesson").toggle();
  });
  $(".display-section-button").click(function () {
    $(".display-section").hide();
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
        course_id: id,
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
  let delayTimer;

  $("#course_search").on("input", function () {
    clearTimeout(delayTimer);
    delayTimer = setTimeout(function () {
      let searchValue = $("#course_search").val();
      $("#overlay").show();
      $.ajax({
        url: "/admin/courses",
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
          var newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?search=" + encodeURIComponent(searchValue);
          window.history.pushState({ path: newUrl }, "", newUrl);
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

// Course Top stepper functionality

function topStepper() {
  $(".custom-stepper-btn").on("click", function () {
    const stepper = HSStepper.getInstance("[data-hs-stepper]");
    let targetIndex = parseInt($(this).attr("data-index")); // Parse the string to an integer
    let currentIndex = stepper.currentIndex;
    let different = targetIndex - currentIndex;
    if (different == 0) return;
    if (currentIndex === 1) {
      if (isCreateMode()) {
        // Check if it's in "create" mode, and the course is not created
        if (!isCourseCreated()) {
          $("#error-state").css("display", "block").fadeOut(5000);
          return;
        }
      }
    }
    if (targetIndex == 3) {
      $.ajax({
        url: "/admin/courses/sections/all",
        type: "GET",
        dataType: "script",
        success: function (response) {},
        error: function (xhr, status, error) {},
      });
      $(".stepper-formatter").addClass("stepper-formatter2");
      $(".reduce-course").addClass("reduce-course2");
      $(".vertical-stepper").css("display", "block");
    }
    if (currentIndex == 3) {
      stepper.setCompleteItem();
      // stepper.unsetCompletedItem()
      $(".reduce-course").removeClass("reduce-course2");
      $(".vertical-stepper").css("display", "none");
    }
    if (currentIndex == 3 && targetIndex == 2) {
      $(".stepper-formatter").removeClass("stepper-formatter2");
      $(".reduce-course").removeClass("reduce-course2");
      $(".vertical-stepper").css("display", "none");
    }
    if (different > 0) {
      for (let i = 0; i < different; i++) {
        stepper.nextBtn.click();
      }
    } else {
      different = Math.abs(different);
      for (let i = 0; i < different; i++) {
        stepper.backBtn.click();
      }
    }
  });
}

// Course create stepper Validation

function isCourseCreated() {
  // Add your logic here to check if the course is created
  let course_id = $("#admin-course-form").attr("data-course-id");
  return course_id && course_id !== "undefined";
}
// Function to check if the form is in "create" mode
function isCreateMode() {
  return $("#admin-course-form").length > 0;
}

// Ajax call for right side stepper section load

function callAllSections() {
  $.ajax({
    url: "/admin/courses/sections/all",
    type: "GET",
    dataType: "script",
    success: function (response) {},
    error: function (xhr, status, error) {},
  });
  $(".stepper-formatter").addClass("stepper-formatter2");
  $(".reduce-course").addClass("reduce-course2");
  $(".vertical-stepper").css("display", "block");
}

// Bottom stepper button click events

function bottomStepper() {
  if (typeof HSStepper !== "undefined") {
    setTimeout(function () {
      const stepperElement = HSStepper.getInstance("[data-hs-stepper]");
      let errorState = 1;
      stepperElement.disableButtons();
      $("#course-name").on("keyup", function () {
        if ($(this).val().length > 2) {
          stepperElement.enableButtons();
        } else {
          stepperElement.disableButtons();
        }
      });
      if (stepperElement) {
        try {
          const stepperInstance = HSStepper.getInstance("[data-hs-stepper]");
          $("[data-hs-stepper-next-btn]").on("click", function () {
            stepperInstance.on("next");
            const currentIndex = stepperInstance.currentIndex;
            if (currentIndex === 2) {
            }
            if (currentIndex === 3) {
              $("button").removeClass("header1");
            }
            if (currentIndex === 3) {
              $.ajax({
                url: "/admin/courses/sections/all",
                type: "GET",
                dataType: "script",
                success: function (response) {},
                error: function (xhr, status, error) {},
              });
              $(".stepper-formatter").addClass("stepper-formatter2");
              $(".reduce-course").addClass("reduce-course2");
              $(".vertical-stepper").css("display", "block");
            } else if (currentIndex < 3) {
              $(".reduce-course").removeClass("reduce-course2");
              $(".vertical-stepper").css("display", "none");
            }
          });
          $("[data-hs-stepper-back-btn]").on("click", function () {
            stepperInstance.on("back");
            const backButtonIndex = stepperInstance.currentIndex;
            if (backButtonIndex < 3) {
              $(".stepper-formatter").removeClass("stepper-formatter2");
              $(".reduce-course").removeClass("reduce-course2");
              $(".vertical-stepper").css("display", "none");
            }
          });
        } catch (error) {
          console.error("Error initializing HSStepper:", error);
        }
      } else {
        console.error("Element with data-hs-stepper not found");
      }
    }, 1000);
  } else {
    console.error("HSStepper not defined. Make sure preline.js is loaded.");
  }
}

$(document).ready(function () {
  tableSectionForm();
  collectionSelect();
  courseEditPopup();
  courseDeletePopup();
  courseTableSearch();
  steeperSectionEditPopup();
  steeperSectionDeletePopup();
  steeperLessonEditPopup();
  steeperLessonDeletePopup();
  topStepper();
  bottomStepper();

  $(document).on("turbo:render", function () {
    tableSectionForm();
    courseEditPopup();
    courseDeletePopup();
    courseTableSearch();
    steeperSectionEditPopup();
    steeperSectionDeletePopup();
    steeperLessonEditPopup();
    steeperLessonDeletePopup();
    topStepper();
    bottomStepper();

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

$(document).on("turbo:submit-end", function (event) {
  if (event.detail.success) {
    $("#lesson-admin-form")[0].reset();
    $("#lesson-admin-form file").val("");
  }
});

$(document).on("turbo:submit-end", function (event) {
  if (event.detail.success) {
    $("#stepper_section-form")[0].reset();
  }
});
