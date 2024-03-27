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
    });
  });
}

function showBatchPopup() {
  $("#batch-table").on("click", ".view-batch-model", function () {
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
    });
  });
}

function deleteBatchPopup() {
  $("#batch-table").on("click", ".send-delete-batch", function () {
    let id = $(this).data("batch-id");
    let searchParams = new URLSearchParams(window.location.search);
    let page = parseInt(searchParams.get("page")) || 1;
    let search = searchParams.get("search") || "";
    let per_page = parseInt(searchParams.get("per_page")) || 10;

    let delUrl = `batches/${id}`;

    if (search !== 1) {
      delUrl += `?page=${page}`;
    }

    if (search !== "") {
      delUrl += (page === 1 ? "?" : "&") + `search=${search}`;
    }

    if (per_page !== 10) {
      delUrl += page === 1 && search === "" ? "?" : "&";
      delUrl += `per_page=${per_page}`;
    }

    $("#delete-batch-model").attr("data-batch-id", id);
    $("#delete-batch-model").attr("href", delUrl);
  });
}

function addBatchTime() {
  $("#batch-form #add_timing").on("click", function () {
    cloneBatchTimeForm();
  });  
}

function removeBatchTime() {
  $("#batch_timings_container .batch_timing_container").on("click", ".remove_timing", function () {

    removeBatchTimeForm(this)
    
  });  
}

function removeBatchTimeForm(elem) {
  console.log("hello");
  let timeIndex = $("#timeIndex").data("timeIndex");
 let removeTiming = $(elem).closest(".batch_timing_container")
 removeTiming.remove();
 timeIndex--;
 $("#batch-form #timeIndex").data("timeIndex", timeIndex);
console.log(timeIndex);
}

function editAddBatchTime() {
  $("#edit-batch-popup #batch-admin-edit-form #edit_add_timing").on(
    "click",
    function () {
      console.log("hello");
      cloneEditBatchTimeForm();
    }
  );
}

function cloneBatchTimeForm() {
  let timeIndex = $("#timeIndex").data("timeIndex");
  let newtiming = $(
    "#batch-form #batch_timings_container .batch_timing_container:first"
  ).clone();
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
  removeBatchTime();
}

function cloneEditBatchTimeForm() {
  let timeIndex = $("#editTimeIndex").data("timeIndex");
  console.log(timeIndex);
  let newtiming = $(
    "#edit-batch-popup #batch-admin-edit-form #edit_batch_timings_container .edit_batch_timing_container:first"
  ).clone();
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

  $(
    "#edit-batch-popup #batch-admin-edit-form #edit_batch_timings_container"
  ).append(newtiming);
  timeIndex++;
  $("#edit-batch-popup #editTimeIndex").data("time-index", timeIndex);
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

function batchEditCourse() {
  $("#edit-batch-popup .new-course-custom-select").each(function () {
    var classes = $(this).attr("class"),
      id = $(this).attr("id"),
      name = $(this).attr("name");

    var placeholderText = $(this).find("option:selected").text();

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
  });

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
function batchEditPrimaryTrainer() {
  $("#edit-batch-popup .new-status-custom-select").each(function () {
    var classes = $(this).attr("class"),
      id = $(this).attr("id"),
      status = $(this).attr("status");

    var placeholderText = $(this).find("option:selected").text();

    var template = '<div class="' + classes + '">';
    template +=
      '<span class="new-status-custom-select-trigger">' +
      placeholderText +
      "</span>";
    template += '<div class="new-status-custom-options">';
    $(this)
      .find("option")
      .each(function () {
        template +=
          '<span class="new-status-custom-option ' +
          $(this).attr("class") +
          '" data-value="' +
          $(this).attr("value") +
          '">' +
          $(this).html() +
          "</span>";
      });
    template += "</div></div>";

    $(this).wrap('<div class="new-status-custom-select-wrapper"></div>');
    $(this).hide();
    $(this).after(template);
  });

  $(".new-status-custom-option:first-of-type").hover(
    function () {
      $(this).parents(".new-status-custom-options").addClass("option-hover");
    },
    function () {
      $(this).parents(".new-status-custom-options").removeClass("option-hover");
    }
  );

  $(".new-status-custom-select-trigger").on("click", function (event) {
    $("html").one("click", function () {
      $(".new-status-custom-select").removeClass("opened");
    });
    $(this).parents(".new-status-custom-select").toggleClass("opened");
    event.stopPropagation();
  });

  $(".new-status-custom-option").on("click", function () {
    $(this)
      .parents(".new-status-custom-select-wrapper")
      .find("select")
      .val($(this).data("value"));
    $(this)
      .parents(".new-status-custom-options")
      .find(".new-status-custom-option")
      .removeClass("selection");
    $(this).addClass("selection");
    $(this).parents(".new-status-custom-select").removeClass("opened");
    $(this)
      .parents(".new-status-custom-select")
      .find(".new-status-custom-select-trigger")
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

function editTimeSlot() {
  $(function () {
    $("#edit-datepicker").datepicker({
      dateFormat: "dd-mm-yy",
      duration: "fast",
      changeYear: true, // Enable changing the year
    });

    // Adding click functionality to the effective-from datepicker icon
    $("#edit-datepicker-icon").on("click", function (event) {
      event.preventDefault(); // Prevent default behavior (opening the default date picker calendar)
      var $datepicker = $("#edit-datepicker");
      if ($datepicker.datepicker("widget").is(":hidden")) {
        $datepicker.datepicker("show"); // Show the datepicker if it's hidden
      } else {
        $datepicker.datepicker("hide"); // Hide the datepicker if it's visible
      }
    });
  });

  $(function () {
    $("#edit-datepicker-to").datepicker({
      dateFormat: "dd-mm-yy",
      duration: "fast",
      changeYear: true, // Enable changing the year
    });

    // Adding click functionality to the effective-from datepicker icon
    $("#edit-datepicker-icon-to").on("click", function (event) {
      event.preventDefault(); // Prevent default behavior (opening the default date picker calendar)
      var $datepicker = $("#edit-datepicker-to");
      if ($datepicker.datepicker("widget").is(":hidden")) {
        $datepicker.datepicker("show"); // Show the datepicker if it's hidden
      } else {
        $datepicker.datepicker("hide"); // Hide the datepicker if it's visible
      }
    });
  });
}

function batchEditSecondaryTrainer() {
  $("#edit-batch-popup .new-lesson-custom-select").each(function () {
    var classes = $(this).attr("class"),
      id = $(this).attr("id"),
      name = $(this).attr("name");

    var placeholderText = $(this).find("option:selected").text();

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

function batchFormValidation() {
  function batchName() {
    let name = $("#batch_batch_name").val();
    let namecheck = /^[a-zA-Z ]+$/.test(name);
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
    let name = $("#batch_course_id").val();

    if (!name) {
      $("#batch_course_error").text("Course can't be blank");
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
    let to_date = $("#datepicker-to").val();

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
    let second_user_id = $("#secondary_trainer_id").val();

    if (!second_user_id) {
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
    if ($('input[type="checkbox"]:checked').length === 0) {
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
  $("#batch_course_id").on("blur", batchCourse);
  $("#datepicker").on("blur", batchFromDate);
  $("#datepicker_to").on("blur", batchToDate);
  $("user_id").on("blur", batchPrimaryTrainer);
  $("secondary_trainer_id").on("blur", batchSecondaryTrainer);
  $(".checkbox-custom").on("click", studentCheckboxValidation);
  $("#batch_batch_timings_attributes_0_day").on("blur", daySelectValidation);
  $("#batch_batch_timings_attributes_0_from_time").on(
    "blur",
    fromTimeValidation
  );
  $("#batch_batch_timings_attributes_0_to_time").on("blur", toTimeValidation);
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
function batchEditFormValidation() {
  function editBatchName() {
    let name = $("#edit_batch_name").val();
    let namecheck = /^[a-zA-Z ]+$/.test(name);
    if (!name) {
      $("#edit_batch_name_error").text("Name can't be blank");
      return false;
    } else if (!namecheck) {
      $("#edit_batch_name_error").text(
        "Please enter a valid name (only alphabets allowed)"
      );
      return false;
    } else {
      $("#edit_batch_name_error").text("");
      return true;
    }
  }

  function editBatchCourse() {
    let name = $("#edit_batch_course").val();

    if (!name) {
      $("#edit_batch_course_error").text("Course can't be blank");
      return false;
    } else {
      $("#edit_batch_course_error").text("");
      return true;
    }
  }

  function editBatchFromDate() {
    let from_date = $("#edit-datepicker").val();

    if (!from_date) {
      $("#edit_batch_effective_from_error").text("From Date can't be empty");
      return false;
    } else {
      $("#edit_batch_effective_from_error").text("");
      return true;
    }
  }

  function editBatchToDate() {
    let to_date = $("#edit-datepicker-to").val();

    if (!to_date) {
      $("#edit_batch_effective_to_error").text("To Date can't be blank");
      return false;
    } else {
      $("#edit_batch_effective_to_error").text("");
      return true;
    }
  }

  function editBatchPrimaryTrainer() {
    let user_id = $("#edit_user_id").val();

    if (!user_id) {
      $("#edit_batch__primary_trainer_error").text(
        "Primary Trainer can't be blank"
      );
      return false;
    } else {
      $("#edit_batch__primary_trainer_error").text("");
      return true;
    }
  }

  function editBatchSecondaryTrainer() {
    let second_user_id = $("#edit_secondary_trainer_id").val();

    if (!second_user_id) {
      $("#edit_batch__secondary_trainer_error").text(
        "Secondary Trainer can't be blank"
      );
      return false;
    } else {
      $("#edit_batch__secondary_trainer_error").text("");
      return true;
    }
  }

  function editStudentCheckboxValidation() {
    if ($('input[type="checkbox"]:checked').length === 0) {
      $("#edit_batch_student_error").text("Please select atleast one student");
      return false;
    } else {
      $("#edit_batch_student_error").text("");
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
  $("#edit_batch_name").on("blur", editBatchName);
  $("#edit-datepicker").on("blur", editBatchFromDate);
  $("#edit-datepicker-to").on("blur", editBatchToDate);
  $("edit_user_id").on("blur", editBatchPrimaryTrainer);
  $("edit_secondary_trainer_id").on("blur", editBatchSecondaryTrainer);
  $(".checkbox-custom").on("click", editStudentCheckboxValidation);

  // Event binding for form submission
  $("#edit-batch-popup #batch-admin-edit-form").on("submit", function (event) {
    // Validate all fields on form submission
    let isNameValid = editBatchName();
    let isCourseValid = editBatchCourse();
    let isFromDateValid = editBatchFromDate();
    let isToDateValid = editBatchToDate();
    let parimaryTrainerValid = editBatchPrimaryTrainer();
    let secondaryTrainerValid = editBatchSecondaryTrainer();
    let isCheckboxValid = editStudentCheckboxValidation();

    // Check if any field is invalid
    if (
      !isNameValid ||
      !isCourseValid ||
      !isFromDateValid ||
      !isToDateValid ||
      !parimaryTrainerValid ||
      !secondaryTrainerValid ||
      !isCheckboxValid
    ) {
      // Prevent form submission
      event.preventDefault();

      // Show all error messages
      editBatchName();
      editBatchCourse();
      editBatchFromDate();
      editBatchPrimaryTrainer();
      editBatchSecondaryTrainer();
      editStudentCheckboxValidation();
    }
  });
}
function searchBatch() {
  let delayTimer;

  $("#batch_search_form").keyup(function (e) {
    clearTimeout(delayTimer);
    delayTimer = setTimeout(function () {
      let searchValue = $("#enquire_search").val();
      $("#overlay").show();
      $.ajax({
        url: "/admin/batches",
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
          let newURL =
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

function searchByCourse() {
  $("#batch-filter .new-filter-custom-select").on(
    "click",
    ".new-filter-custom-option",
    function () {
      var courseName = $(this).data("value");
      $("#overlay").show();
      $.ajax({
        url: "/admin/batches",
        type: "GET",
        data: {
          course: courseName,
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
            encodeURIComponent(courseName);
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
          console.error("Error:", error);
          $("#overlay").hide();
        },
      });
    }
  );
}

function selectBatchFilter() {
  $("#batch-filter .new-filter-custom-select").each(function () {
    var classes = $(this).attr("class"),
      id = $(this).attr("id"),
      filter = $(this).attr("filter");

    var placeholderText = $(this).find("option:first-of-type").text();

    var template = '<div class="' + classes + '">';
    template +=
      '<span class="new-filter-custom-select-trigger">' +
      placeholderText +
      "</span>";
    template += '<div class="new-filter-custom-options">';
    $(this)
      .find("option")
      .each(function () {
        template +=
          '<span class="new-filter-custom-option ' +
          $(this).attr("class") +
          '" data-value="' +
          $(this).attr("value") +
          '">' +
          $(this).html() +
          "</span>";
      });
    template += "</div></div>";

    $(this).wrap('<div class="new-filter-custom-select-wrapper"></div>');
    $(this).hide();
    $(this).after(template);
  });

  $(".new-filter-custom-option:first-of-type").hover(
    function () {
      $(this).parents(".new-filter-custom-options").addClass("option-hover");
    },
    function () {
      $(this).parents(".new-filter-custom-options").removeClass("option-hover");
    }
  );

  $(".new-filter-custom-select-trigger").on("click", function (event) {
    $("html").one("click", function () {
      $(".new-filter-custom-select").removeClass("opened");
    });
    $(this).parents(".new-filter-custom-select").toggleClass("opened");
    event.stopPropagation();
  });

  $(".new-filter-custom-option").on("click", function () {
    $(this)
      .parents(".new-filter-custom-select-wrapper")
      .find("select")
      .val($(this).data("value"));
    $(this)
      .parents(".new-filter-custom-options")
      .find(".new-filter-custom-option")
      .removeClass("selection");
    $(this).addClass("selection");
    $(this).parents(".new-filter-custom-select").removeClass("opened");
    $(this)
      .parents(".new-filter-custom-select")
      .find(".new-filter-custom-select-trigger")
      .text($(this).text());
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
  showBatchPopup();
  editTimeSlot();
  batchEditCourse();
  batchEditPrimaryTrainer();
  batchEditSecondaryTrainer();
  batchEditFormValidation();
  deleteBatchPopup();
  searchBatch();
  selectBatchFilter();
  searchByCourse();
  editAddBatchTime();
  removeBatchTime();

  $(document).on("turbo:render", function () {
    courseSelect();
    timeSlot();
    selectCreateUser();
    selectBatchName();
    addBatchTime();
    dropdownCheckBoxes();
    batchFormValidation();
    editBatchPopup();
    showBatchPopup();
    editTimeSlot();
    batchEditCourse();
    batchEditPrimaryTrainer();
    batchEditSecondaryTrainer();
    batchEditFormValidation();
    deleteBatchPopup();
    searchBatch();
    selectBatchFilter();
    searchByCourse();
    editAddBatchTime();
    removeBatchTime();
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
    dropdownCheckBoxes();
    editTimeSlot();
    batchEditCourse();
    batchEditPrimaryTrainer();
    batchEditSecondaryTrainer();
    batchEditFormValidation();
    editAddBatchTime();
    removeBatchTime();
  };
});
