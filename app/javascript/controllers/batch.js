function editBatchPopup() {
  $("#batch-table").on("click", ".edit-batch-model", function () {
    let id = $(this).data("batch-id");
    let url = $(this).data("url");
    let searchParams = new URLSearchParams(window.location.search);
    let page = parseInt(searchParams.get("page")) || 1;
    let search = searchParams.get("search") || "";
    $("#overlay").show();
    $.ajax({
      method: "GET",
      url: url,
      data: {
        batch_id: id,
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
      // done: function () {},
      error: function () {
        console.log("Error fetching data");
        $("#overlay").hide();
      },
    })
  })
}

function addBatchTime() {
  $("#batch-form #add_timing").on("click", function () {
    cloneBatchTimeForm();
    let timeIndex = $("#timeIndex").data("timeIndex");
  });
}

function cloneBatchTimeForm() {
  let timeIndex = $("#timeIndex").data("timeIndex");
  console.log("timeIndex =", timeIndex);
  let newtiming = $(
    "#batch-form #batch_timings_container .batch_timing_container:first"
  ).clone();
  console.log("newtiming =", newtiming);
  newtiming.find("select").val("");
  newtiming.find("select").each(function () {
    let oldName = $(this).attr("name");
    let newName = oldName.replace(/\[\d\]/, "[" + timeIndex + "]");
    $(this).attr("name", newName);
  });
  newtiming.find("input").val("");
  newtiming.find("input").each(function () {
    let oldName = $(this).attr("name");
    let newName = oldName.replace(/\[\d\]/, "[" + timeIndex + "]");
    $(this).attr("name", newName);
  });

  $("#batch-form #batch_timings_container").append(newtiming);
  timeIndex++;
  $("#batch-form #timeIndex").data("timeIndex", timeIndex);
}

function dropdownCheckBoxes() {
  function checkboxDropdown(el) {
    let $el = $(el);

    $el.each(function () {
      let $list = $(this).find(".dropdown-list"),
        $label = $(this).find(".dropdown-label"),
        $checkAll = $(this).find(".check-all"),
        $inputs = $(this).find(".checkbox input[type='checkbox']"),
        result = [];

      function updateStatus() {
        if (!result.length) {
          $label.html("Select Options");
        }
      }

      function updateLabel() {
        $label.html(result.join(", "));

        updateStatus();
      }

      $inputs.on("change", function () {
        let checkedText = $(this).next().text();

        if ($(this).is(":checked")) {
          result.push(checkedText);
        } else {
          result = result.filter((item) => item !== checkedText);
        }

        updateLabel();
      });

      $checkAll.on("change", function () {
        result = [];

        if ($(this).is(":checked")) {
          $inputs.prop("checked", true);

          result.push($(this).next().text());
        } else {
          $inputs.prop("checked", false);
        }

        updateLabel();
      });

      // Initial setup

      $inputs.each(function () {
        if ($(this).is(":checked")) {
          result.push($(this).next().text());
        }
      });

      updateLabel();

      $label.on("click", function () {
        $el.toggleClass("open-dropdown");
      });

      $(document).on("click touchstart", function (e) {
        if (!$(e.target).closest($el).length) {
          $el.removeClass("open-dropdown");
        }
      });
    });
  }

  checkboxDropdown(".dropdown");
}

function courseSelect() {
  $("#batch-form .new-custom-select").each(function () {
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
function selectCreateUser() {
  $("#batch-form .custom-select").each(function () {
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
function selectBatchName() {
  $("#batch-form .new-name-custom-select").each(function () {
    var classes = $(this).attr("class"),
      id = $(this).attr("id"),
      name = $(this).attr("name");

    var placeholderText = $(this).find("option:first-of-type").text();

    var template = '<div class="' + classes + '">';
    template +=
      '<span class="new-name-custom-select-trigger">' +
      placeholderText +
      "</span>";
    template += '<div class="new-name-custom-options">';
    $(this)
      .find("option")
      .each(function () {
        template +=
          '<span class="new-name-custom-option ' +
          $(this).attr("class") +
          '" data-value="' +
          $(this).attr("value") +
          '">' +
          $(this).html() +
          "</span>";
      });
    template += "</div></div>";

    $(this).wrap('<div class="new-name-custom-select-wrapper"></div>');
    $(this).hide();
    $(this).after(template);
  });

  $(".new-name-custom-option:first-of-type").hover(
    function () {
      $(this).parents(".new-name-custom-options").addClass("option-hover");
    },
    function () {
      $(this).parents(".new-name-custom-options").removeClass("option-hover");
    }
  );

  $(".new-name-custom-select-trigger").on("click", function (event) {
    $("html").one("click", function () {
      $(".new-name-custom-select").removeClass("opened");
    });
    $(this).parents(".new-name-custom-select").toggleClass("opened");
    event.stopPropagation();
  });

  $(".new-name-custom-option").on("click", function () {
    $(this)
      .parents(".new-name-custom-select-wrapper")
      .find("select")
      .val($(this).data("value"));
    $(this)
      .parents(".new-name-custom-options")
      .find(".new-name-custom-option")
      .removeClass("selection");
    $(this).addClass("selection");
    $(this).parents(".new-name-custom-select").removeClass("opened");
    $(this)
      .parents(".new-name-custom-select")
      .find(".new-name-custom-select-trigger")
      .text($(this).text());
  });
}
function timeSlot() {
  $(function () {
    $("#datepicker").datepicker({
      dateFormat: "dd-mm-yy",
      duration: "fast",
      changeYear: true, // Enable changing the year
    });

    // Adding click functionality to the effective-from datepicker icon
    $("#datepicker-icon").on("click", function (event) {
      event.preventDefault(); // Prevent default behavior (opening the default date picker calendar)
      var $datepicker = $("#datepicker");
      if ($datepicker.datepicker("widget").is(":hidden")) {
        $datepicker.datepicker("show"); // Show the datepicker if it's hidden
      } else {
        $datepicker.datepicker("hide"); // Hide the datepicker if it's visible
      }
    });
  });

  $(function () {
    $("#datepicker-to").datepicker({
      dateFormat: "dd-mm-yy",
      duration: "fast",
      changeYear: true, // Enable changing the year
    });

    // Adding click functionality to the effective-from datepicker icon
    $("#datepicker-icon-to").on("click", function (event) {
      event.preventDefault(); // Prevent default behavior (opening the default date picker calendar)
      var $datepicker = $("#datepicker-to");
      if ($datepicker.datepicker("widget").is(":hidden")) {
        $datepicker.datepicker("show"); // Show the datepicker if it's hidden
      } else {
        $datepicker.datepicker("hide"); // Hide the datepicker if it's visible
      }
    });
  });
}
function batchFormValidation() {
  function batchName() {
    let name = $("#batch_batch_name").val();
    let namecheck = /^[a-zA-Z ]+$/.test(name);
    console.log(namecheck);
    if (!name) {
      $("#batch_name_error").text("Name can't be blank");
      return false;
    } else if (!namecheck) {
      $("#batch_name_error").text(
        "Please enter a valid name (only alphabets allowed)"
      );
      return false;
    } else {
      $("#batch_name_error").text("");
      return true;
    }
  }

  function batchCourse() {
    let name = $("#batch_course_name").val();
    let namecheck = /^[a-zA-Z ]+$/.test(name);

    if (!name) {
      $("#batch_course_error").text("Course can't be blank");
      return false;
    } else if (!namecheck) {
      $("#batch_course_error").text(
        "Please enter a valid Course (only alphabets allowed)"
      );
      return false;
    } else {
      $("#batch_course_error").text("");
      return true;
    }
  }

  function batchFromDate() {
    let from_date = $("#datepicker").val();

    if (!from_date) {
      $("#batch_effective_from_error").text("From Date can't be empty");
      return false;
    } else {
      $("#batch_effective_from_error").text("");
      return true;
    }
  }

  function batchToDate() {
    let to_date = $("#datepicker_to").val();

    if (!to_date) {
      $("#batch_effective_to_error").text("To Date can't be blank");
      return false;
    } else {
      $("#batch_effective_to_error").text("");
      return true;
    }
  }

  function batchPrimaryTrainer() {
    let user_id = $("#user_id").val();

    if (!user_id) {
      $("#batch__primary_trainer_error").text("Primary Trainer can't be blank");
      return false;
    } else {
      $("#batch__primary_trainer_error").text("");
      return true;
    }
  }

  function batchSecondaryTrainer() {
    let second_user__id = $("secondary_trainer_id").val();

    if (!second_user__id) {
      $("#batch__secondary_trainer_error").text(
        "Secondary Trainer can't be blank"
      );
      return false;
    } else {
      $("#batch__secondary_trainer_error").text("");
      return true;
    }
  }

  function studentCheckboxValidation() {
    console.log("studentCheckboxValidation");
    if ($('input[type="checkbox"]:checked').length === 0) {
      console.log("no checkbox is checked");
      $("#batch_student_error").text("Please select atleast one student");
      return false;
    } else {
      $("#batch_student_error").text("");
      return true;
    }
  }

  function daySelectValidation() {
    let day = $("#batch_batch_timings_attributes_0_day").val();
    if (!day) {
      $("#batch_day_error").text("Day can't be empty");
      return false;
    } else {
      $("#batch_day_error").text("");
      return true;
    }
  }
  function fromTimeValidation() {
    let from_time = $("#batch_batch_timings_attributes_0_from_time").val();
    if (!from_time) {
      $("#batch_from_time_error").text("From time can't be empty");
      return false;
    } else {
      $("#batch_from_time_error").text("");
      return true;
    }
  }
  function toTimeValidation() {
    let to_time = $("#batch_batch_timings_attributes_0_to_time").val();
    if (!to_time) {
      $("#batch_to_time_error").text("To time can't be empty");
      return false;
    } else {
      $("#batch_to_time_error").text("");
      return true;
    }
  }

  // Event bindings for registration form fields
  $("#batch_batch_name").on("blur", batchName);
  $("#datepicker").on("blur", batchFromDate);
  $("#datepicker_to").on("blur", batchToDate);
  $("user_id").on("blur", batchPrimaryTrainer);
  $("secondary_trainer_id").on("blur", batchSecondaryTrainer);
  $(".checkbox-custom").on("click", studentCheckboxValidation);
  $("#batch_batch_timings_attributes_0_day").on("blur", daySelectValidation);
  $("#batch_batch_timings_attributes_0_from_time").on("blir", fromTimeValidation)
  $("#batch_batch_timings_attributes_0_to_time").on("blir", toTimeValidation)
  // Event binding for form submission
  $("#batch-admin-form").on("submit", function (event) {
    // Validate all fields on form submission
    let isNameValid = batchName();
    let isCourseValid = batchCourse();
    let isFromDateValid = batchFromDate();
    let isToDateValid = batchToDate();
    let parimaryTrainerValid = batchPrimaryTrainer();
    let secondaryTrainerValid = batchSecondaryTrainer();
    let isCheckboxValid = studentCheckboxValidation();
    let isDayValid = daySelectValidation();
    let isFromTimeValid = fromTimeValidation();
    let isToTimeValid = toTimeValidation();

    // Check if any field is invalid
    if (
      !isNameValid ||
      !isCourseValid ||
      !isFromDateValid ||
      !isToDateValid ||
      !parimaryTrainerValid ||
      !secondaryTrainerValid ||
      !isCheckboxValid ||
      !isDayValid ||
      !isFromTimeValid ||
      !isToTimeValid
    ) {
      // Prevent form submission
      event.preventDefault();

      // Show all error messages
      batchName();
      batchCourse();
      batchFromDate();
      batchToDate();
      batchPrimaryTrainer();
      batchSecondaryTrainer();
      studentCheckboxValidation();
      daySelectValidation();
      fromTimeValidation();
      toTimeValidation();
    }
  });
}

$(document).ready(function () {
  courseSelect();
  timeSlot();
  selectCreateUser();
  selectBatchName();
  addBatchTime();
  dropdownCheckBoxes();
  batchFormValidation();
  editBatchPopup();

  $(document).on("turbo:render", function () {
    courseSelect();
    timeSlot();
    selectCreateUser();
    selectBatchName();
    addBatchTime();
    dropdownCheckBoxes();
    batchFormValidation();
    editBatchPopup();
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
    courseSelect();
    selectCreateUser();
    selectBatchName();
    addBatchTime();
    dropdownCheckBoxes();
  };
});
