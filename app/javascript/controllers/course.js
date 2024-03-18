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
  $("#course-table").on("click", ".edit-course-model", function () {
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
  $("#course-table").on("click", ".send-delete-course", function () {
    let id = $(this).data("course-id");
    $("#delete-course-model").attr("data-course-id", id);
    $("#delete-course-model").attr("href", `courses/${id}`);
  });
}

// New Course form validation

function courseValidation() {
  function validateCourseName() {
    let name = $("#course-name").val();

    if (!name) {
      $("#course-name-error").text("Course Name can't be blank");
      return false;
    } else if (name.replace(/ /g, "").length < 3) {
      $("#course-name-error").text("Please enter a valid Course Name");
      return false;
    } else {
      $("#course-name-error").text("");
      return true;
    }
  }

  function validateCourseAmount() {
    let fee = $("#course-fee").val();

    if (!fee) {
        $("#course_fee_error").text("Course Fee can't be blank");
        return false;
    } else if (isNaN(fee) || parseFloat(fee) < 0) {
        $("#course_fee_error").text("Please enter a valid non-negative Course Fee");
        return false;
    } else {
        $("#course_fee_error").text("");
        return true;
    }
}

  // Event bindings for registration form fields
  $("#course-name").on("blur", validateCourseName);
  $("#course-fee").on("blur", validateCourseAmount);

  // Event binding for form submission
  $("#admin-course-form").on("submit", function (event) {
    // Validate all fields on form submission
    let isNameValid = validateCourseName();
    let isAmountValid = validateCourseAmount();

    // Check if any field is invalid
    if (!isNameValid || !isAmountValid) {
      // Prevent form submission
      event.preventDefault();

      // Show all error messages
      validateCourseName();
      validateCourseAmount();
    }
  });
}

// Edit Course form validation

function editCourseValidation() {
  function validateEditCourseName() {
    let name = $("#edit-course-name").val();

    if (!name) {
      $("#edit-course-name-error").text("Course Name can't be blank");
    } else if (name.replace(/ /g, "").length < 3) {
      $("#edit-course-name-error").text("Course name is not valid");
    } else {
      $("#edit-course-name-error").text("");
    }
  }

  $("#edit-course-name").on("input", validateEditCourseName);
  $("#admin-course-edit-form").on("submit", function (event) {
    validateEditCourseName();

    if ($("#edit-course-name-error").text()) {
      event.preventDefault();
    }
  });
}

function editCourseStepValidation() {
  function validateCourseName() {
    let name = $("#edit-course-name").val();
  
    if (!name) {
      $("#edit-course-name-error").text("Title can't be blank");
      return false;
    } else if (name.replace(/ /g, "").length < 3) {
      $("#edit-course-name-error").text("Please enter a valid title");
      return false;
    } else {
      $("#edit-course-name-error").text("");
      return true;
    }
  }
  
  function validateCourseAmount() {
    let fee = $("#edit-step-course-fee").val();
  
    if (!fee) {
        $("#edit_course_fee_error").text("Course Fee can't be blank");
        return false;
    } else if (isNaN(fee) || parseFloat(fee) < 0) {
        $("#edit_course_fee_error").text("Please enter a valid non-negative Course Fee");
        return false;
    } else {
        $("#edit_course_fee_error").text("");
        return true;
    }
  }
  
  $("#stepper_course_forms").on("focusout", "#edit-course-name", validateCourseName);
  $("#stepper_course_forms").on("focusout", "#edit-step-course-fee", validateCourseAmount);
  
  $("#stepper_course_forms").on("submit", "#admin-course-edit-edit-form",  function (event) {
      let isFeeValid = validateCourseAmount();
      let isNameValid = validateCourseName();
  
      if (!isFeeValid || !isNameValid) {
        event.validateCourseName();
        event.validateCourseAmount();
      }
    }
  );
}

// Form reset errors
function resetNewErrorMessages() {
  $("#course-name-error").text("");
}

function resetErrorMessages() {
  $("#edit-course-name-error").text("");
}

// // Form reset Funtion
function resetCourseNewForm() {
  $(".reset-form").on("click", function () {
    $("#admin-course-form")[0].reset();
    resetNewErrorMessages();
  });
}

function resetCourseEditForm() {
  $("#course-modal-close-btn").on("click", function () {
    $("#admin-course-edit-form")[0].reset();
    resetErrorMessages();
  });
}

function resetCourseStepEditForm() {
  $("#course-modal-close-btn").on("click", function () {
    $("#admin-course-step-edit-form")[0].reset();
    resetErrorMessages();
  });
}

// Form submit on onChange Event

function courseFormSubmit() {
  let delayTimer;
  delayTimer = setTimeout(function () {
    $("#admin-course-form").on("change", function (event) {
      event.preventDefault();
      $("#submit-course").click();
    });
  }, 500);
}

function courseEditFormSubmit() {
  let delayTimer;
  delayTimer = setTimeout(function () {
    $("#admin-course-edit-edit-form").on("change", function (event) {
      event.preventDefault();
      $("#submit-edit-course").click();
      resetErrorMessages();
    });
  }, 500);
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
          var newUrl =
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname +
            "?search=" +
            encodeURIComponent(searchValue);
          window.history.pushState(
            {
              path: newUrl,
            },
            "",
            newUrl
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
      if (stepperElement) {
        stepperElement.disableButtons();
        $("#course-name").on("keyup", function () {
          if ($(this).val().length > 2) {
            stepperElement.enableButtons();
          } else {
            stepperElement.disableButtons();
          }
        });
      }

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

function createType() {
  $("#course-form .custom-select").each(function () {
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

function editType() {
  $("#edit-course-popup .new-custom-select").each(function () {
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

function stepperEditType() {
  $("#course-form #admin-course-edit-edit-form .new-lesson-custom-select").each(
    function () {
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
    }
  );

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

function stepperSectionCreate() {
  function sectionTitle() {
    let name = $("#section_title").val();

    if (!name) {
      $("#section_title_error").text("Title can't be blank");
      return false;
    } else if (name.replace(/ /g, "").length < 3) {
      $("#section_title_error").text("Please enter a valid title");
      return false;
    } else {
      $("#section_title_error").text("");
      return true;
    }
  }

  // Event bindings for registration form fields
  $("#section_title").on("blur", sectionTitle);

  // Event binding for form submission
  $("#stepper_section-form").on("submit", function (event) {
    // Validate all fields on form submission
    let isNameValid = sectionTitle();

    // Check if any field is invalid
    if (!isNameValid) {
      // Prevent form submission
      event.preventDefault();

      // Show all error messages
      sectionTitle();
    }
  });
}

function stepperSectionEdit() {
  function sectionTitle() {
    let name = $("#edit_title").val();

    if (!name) {
      $("#edit_title_error").text("Title can't be blank");
      return false;
    } else if (name.replace(/ /g, "").length < 3) {
      $("#edit_title_error").text("Please enter a valid title");
      return false;
    } else {
      $("#edit_title_error").text("");
      return true;
    }
  }

  // Event bindings for registration form fields
  $("#steeper-edit-section-popup").on(
    "focusout",
    "#edit_enquire_name",
    sectionTitle
  );

  $("#steeper-edit-section-popup").on(
    "submit",
    "#edit_stepper_section_form",
    function (event) {
      let isTitleValid = sectionTitle();

      if (!isTitleValid) {
        event.sectionTitle();
      }
    }
  );
}

function stepperLessonCreate() {
  function lessonTitle() {
    let name = $("#lesson_title").val();

    if (!name) {
      $("#lesson_title_error").text("Title can't be blank");
      return false;
    } else if (name.replace(/ /g, "").length < 3) {
      $("#lesson_title_error").text("Please enter a valid title");
      return false;
    } else {
      $("#lesson_title_error").text("");
      return true;
    }
  }

  // Event bindings for registration form fields
  $("#lesson_title").on("blur", lessonTitle);

  // Event binding for form submission
  $("#lesson-admin-form").on("submit", function (event) {
    // Validate all fields on form submission
    let isNameValid = lessonTitle();

    // Check if any field is invalid
    if (!isNameValid) {
      // Prevent form submission
      event.preventDefault();

      // Show all error messages
      lessonTitle();
    }
  });
}

$(document).ready(function () {
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
  courseValidation();
  editCourseValidation();
  resetCourseNewForm();
  resetCourseEditForm();
  courseFormSubmit();
  courseEditFormSubmit();
  editCourseStepValidation();
  createType();
  editType();
  stepperSectionCreate();
  stepperSectionEdit();
  stepperLessonCreate();
  if ($("#stepper-loader").length > 0) {
    new HSStepper($("#stepper-loader")[0]);
  }

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
    courseValidation();
    editCourseValidation();
    courseFormSubmit();
    courseEditFormSubmit();
    createType();
    editType();
    stepperEditType();
    stepperSectionCreate();
    stepperSectionEdit();
    stepperLessonCreate();
    editCourseStepValidation();
    if ($("#stepper-loader").length > 0) {
      new HSStepper($("#stepper-loader")[0]);
    }
  });
});

addEventListener("turbo:before-stream-render", (event) => {
  const fallbackToDefaultActions = event.detail.render;

  event.detail.render = function (streamElement) {
    fallbackToDefaultActions(streamElement);
    initModals();
    steeperLessonEditPopup();
    steeperLessonDeletePopup();
    courseValidation();
    editCourseValidation();
    resetCourseNewForm();
    resetCourseEditForm();
    courseFormSubmit();
    courseEditFormSubmit();
    editCourseStepValidation();
    steeperSectionDeletePopup();
    editType();
    stepperSectionCreate();
    stepperSectionEdit();
    stepperLessonCreate();
  };
});

$(document).on("turbo:submit-end", function (event) {
  editCourseStepValidation();
  if (event.detail.success) {
    $("#lesson-admin-form")[0].reset();
    $("#lesson-admin-form file").val("");
  }
});

$(document).on("turbo:submit-end", function (event) {
  editCourseStepValidation();
  if (event.detail.success) {
    $("#stepper_section-form")[0].reset();
  }
});
