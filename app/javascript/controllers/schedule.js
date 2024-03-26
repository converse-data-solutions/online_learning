function editPopup() {
  $("#schedule-table").on("click", ".edit-schedule-model", function () {
    let id = $(this).data("schedule-id");
    let url = $(this).data("url");
    let searchParams = new URLSearchParams(window.location.search);
    let page = parseInt(searchParams.get("page")) || 1;
    let search = searchParams.get("search") || "";
    $("#overlay").show();
    $.ajax({
      method: "GET",
      url: url,
      data: {
        schedule_id: id,
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
  $("#schedule-table").on("click", ".send-delete-schedule", function () {
    let id = $(this).data("schedule-id");
    let searchParams = new URLSearchParams(window.location.search);
    let page = parseInt(searchParams.get("page")) || 1;
    let search = searchParams.get("search") || "";
    let per_page = parseInt(searchParams.get("per_page")) || 10;

    // Construct the base URL
    let baseUrl = `schedules/${id}`;

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
    $("#delete-schedule-model").attr("data-schedule-id", id);
    $("#delete-schedule-model").attr("href", baseUrl);
  });
}

function scheduleSearch() {
  let delayTimer;

  $("#schedule_search").on("input", function (e) {
    clearTimeout(delayTimer);
    delayTimer = setTimeout(function () {
      let searchValue = $("#schedule_search").val();
      $("#overlay").show();

      $.ajax({
        url: "/admin/schedules",
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

function dateFilter() {
  $(".show-dates").change(function () {
    var selectedOptions = [];
    $(".show-dates:checked").each(function () {
      selectedOptions.push($(this).val());
    });

    // Send AJAX request with selected options and date range
    sendAjaxRequest(selectedOptions);
  });

  // Event handler for Dates Between checkbox
  $("#datepicker, #todatepicker").change(function () {
    // Only trigger the AJAX request if Dates Between option is selected
    if ($("#hide-dates").is(":checked")) {
      var fromDate = $("#datepicker").val();
      var toDate = $("#todatepicker").val();

      // Send AJAX request with selected options and date range
      sendAjaxRequest(["dates_between"], fromDate, toDate);
    }
  });

  // Function to send AJAX request
  function sendAjaxRequest(selectedOptions, fromDate, toDate) {
    $.ajax({
      type: "GET",
      url: "/admin/schedules",
      data: {
        dates: selectedOptions,
        from_date: fromDate,
        to_date: toDate,
      },
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
          "?next_payment_date=" +
          encodeURIComponent(selectedOptions) +
          "&from_date=" +
          encodeURIComponent(fromDate) +
          "&to_date=" +
          encodeURIComponent(toDate);
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
}

function differentDateFilter() {
  // Toggle dropdown active state
  $(".checkbox-dropdown").click(function () {
    $(this).toggleClass("is-active");
  });
  // Prevent dropdown from closing when clicking inside it
  $(".checkbox-dropdown ul").click(function (e) {
    e.stopPropagation();
  });
  // Close dropdown when clicking outside it
  $(document).click(function (e) {
    if (!$(e.target).closest(".checkbox-dropdown").length) {
      $(".checkbox-dropdown").removeClass("is-active");
    }
  });
  // Ensure only one checkbox is checked at a time
  $(".checkbox-dropdown input[type='checkbox']").change(function () {
    var checkboxes = $(".checkbox-dropdown input[type='checkbox']");
    checkboxes.each(function () {
      if (this !== event.target) {
        $(this).prop("checked", false);
      }
    });
  });
  // hide date between field
  $("#hide-dates").on("click", function () {
    $("#display-dates").removeClass("toggle-dates");
  });
  $(".show-dates").on("click", function () {
    $("#display-dates").addClass("toggle-dates");
  });
}

function scheduleCreateBatch() {
  $("#schedule-form .custom-select").each(function () {
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

function scheduleCreateUser() {
  $("#schedule-form .new-custom-select").each(function () {
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

function scheduleEditUser() {
  $("#edit-schedule-popup .new-name-custom-select").each(function () {
    var classes = $(this).attr("class"),
      id = $(this).attr("id"),
      name = $(this).attr("name");

    var placeholderText = $(this).find("option:selected").text();

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

function scheduleEditBatch() {
  $("#edit-schedule-popup .new-status-custom-select").each(function () {
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

function scheduleBatchData() {
  $("#schedule-form .custom-select").on("click", ".custom-option", function () {
    var batchId = $(this).data("value");

    // Make an AJAX request to fetch sections for the selected course
    $.ajax({
      url: "/admin/schedules/load_batch_data",
      type: "GET",
      data: {
        batch_id: batchId,
      },
      headers: {
        Accept: "text/vnd.turbo-stream.html, text/html, application/xhtml+xml",
      },
      success: function (data) {
        Turbo.renderStreamMessage(data);
      },
      error: function (error) {
        console.error("Error:", error);
      },
    });
  });
}

function initializeTimeDropdowns() {
  $(document).ready(function () {
    const $startDropdown = $("#start-time").closest(".dropdown");
    const $startDropdownMenu = $startDropdown.find(".dropdown-menu");
    const $endDropdown = $("#end-time").closest(".dropdown");
    const $endDropdownMenu = $endDropdown.find(".dropdown-menu");
    const $timeRangeInput = $("#time-range");

    // Function to toggle dropdown menu
    function toggleDropdown($dropdownMenu) {
      $dropdownMenu.toggleClass("show");
    }

    // Function to generate time options
    function generateTimeOptions($dropdownMenu) {
      const hours = Array.from(
        {
          length: 12,
        },
        (_, i) => (i === 0 ? 12 : i)
      );
      const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
      const amPm = ["AM", "PM"];
      amPm.forEach((period) => {
        hours.forEach((hour) => {
          const hourStr = hour < 10 ? "0" + hour : "" + hour;
          minutes.forEach((minute) => {
            const minuteStr = minute < 10 ? "0" + minute : "" + minute;
            const time = hourStr + ":" + minuteStr + " " + period;
            const $optionElement = $("<div>")
              .addClass("dropdown-menu-item")
              .text(time);
            $dropdownMenu.append($optionElement);
          });
        });
      });
    }

    // Generate time options for start time dropdown
    generateTimeOptions($startDropdownMenu);

    // Generate time options for end time dropdown
    generateTimeOptions($endDropdownMenu);

    // Function to update the time range input
    function updateSelectedTimeRange() {
      const startTime = $("#start-time").val();
      const endTime = $("#end-time").val();
      const timeRange = startTime + " - " + endTime;
      $timeRangeInput.val(timeRange);
    }

    // Add event listener to toggle dropdown menu for start time
    $startDropdown.on("click", function (event) {
      toggleDropdown($startDropdownMenu);
    });

    // Add event listener to toggle dropdown menu for end time
    $endDropdown.on("click", function (event) {
      toggleDropdown($endDropdownMenu);
    });

    // Add event listener to close the dropdown menu when clicking outside for start time
    $(document).on("click", function (event) {
      if (
        !$startDropdown.is(event.target) &&
        $startDropdown.has(event.target).length === 0
      ) {
        $startDropdownMenu.removeClass("show");
      }
    });

    // Add event listener to close the dropdown menu when clicking outside for end time
    $(document).on("click", function (event) {
      if (
        !$endDropdown.is(event.target) &&
        $endDropdown.has(event.target).length === 0
      ) {
        $endDropdownMenu.removeClass("show");
      }
    });

    // Add event listener to select start time from dropdown
    $startDropdownMenu.on("click", ".dropdown-menu-item", function (event) {
      const selectedTime = $(this).text();
      $("#start-time").val(selectedTime);
      $startDropdownMenu.removeClass("show");
      updateSelectedTimeRange();
    });

    // Add event listener to select end time from dropdown
    $endDropdownMenu.on("click", ".dropdown-menu-item", function (event) {
      const selectedTime = $(this).text();
      $("#end-time").val(selectedTime);
      $endDropdownMenu.removeClass("show");
      updateSelectedTimeRange();
    });
  });
}

function editTimeDropdowns() {
  $(document).ready(function () {
    const $startDropdown = $("#edit-start-time").closest(".dropdown");
    const $startDropdownMenu = $startDropdown.find(".dropdown-menu");
    const $endDropdown = $("#edit-end-time").closest(".dropdown");
    const $endDropdownMenu = $endDropdown.find(".dropdown-menu");
    const $timeRangeInput = $("#edit-time-range");

    // Function to toggle dropdown menu
    function toggleDropdown($dropdownMenu) {
      $dropdownMenu.toggleClass("show");
    }

    // Function to generate time options
    function generateTimeOptions($dropdownMenu) {
      const hours = Array.from(
        {
          length: 12,
        },
        (_, i) => (i === 0 ? 12 : i)
      );
      const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
      const amPm = ["AM", "PM"];
      amPm.forEach((period) => {
        hours.forEach((hour) => {
          const hourStr = hour < 10 ? "0" + hour : "" + hour;
          minutes.forEach((minute) => {
            const minuteStr = minute < 10 ? "0" + minute : "" + minute;
            const time = hourStr + ":" + minuteStr + " " + period;
            const $optionElement = $("<div>")
              .addClass("dropdown-menu-item")
              .text(time);
            $dropdownMenu.append($optionElement);
          });
        });
      });
    }

    // Generate time options for start time dropdown
    generateTimeOptions($startDropdownMenu);

    // Generate time options for end time dropdown
    generateTimeOptions($endDropdownMenu);

    // Function to update the time range input
    function updateSelectedTimeRange() {
      const startTime = $("#edit-start-time").val();
      const endTime = $("#edit-end-time").val();
      const timeRange = startTime + " - " + endTime;
      $timeRangeInput.val(timeRange);
    }

    // Add event listener to toggle dropdown menu for start time
    $startDropdown.on("click", function (event) {
      toggleDropdown($startDropdownMenu);
    });

    // Add event listener to toggle dropdown menu for end time
    $endDropdown.on("click", function (event) {
      toggleDropdown($endDropdownMenu);
    });

    // Add event listener to close the dropdown menu when clicking outside for start time
    $(document).on("click", function (event) {
      if (
        !$startDropdown.is(event.target) &&
        $startDropdown.has(event.target).length === 0
      ) {
        $startDropdownMenu.removeClass("show");
      }
    });

    // Add event listener to close the dropdown menu when clicking outside for end time
    $(document).on("click", function (event) {
      if (
        !$endDropdown.is(event.target) &&
        $endDropdown.has(event.target).length === 0
      ) {
        $endDropdownMenu.removeClass("show");
      }
    });

    // Add event listener to select start time from dropdown
    $startDropdownMenu.on("click", ".dropdown-menu-item", function (event) {
      const selectedTime = $(this).text();
      $("#edit-start-time").val(selectedTime);
      $startDropdownMenu.removeClass("show");
      updateSelectedTimeRange();
    });

    // Add event listener to select end time from dropdown
    $endDropdownMenu.on("click", ".dropdown-menu-item", function (event) {
      const selectedTime = $(this).text();
      $("#edit-end-time").val(selectedTime);
      $endDropdownMenu.removeClass("show");
      updateSelectedTimeRange();
    });
  });
}

function scheduleDate() {
  $(function () {
    $("#datepicker").datepicker({
      dateFormat: "dd-mm-yy",
      duration: "fast",
      changeYear: true, // Enable changing the year
    });

    // Adding click functionality to the datepicker icon
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
}

function editScheduleDate() {
  $(function () {
    let initialDate = $("#editdatepicker").val(); // Assuming the date is stored in the input field

    $("#editdatepicker").datepicker({
      dateFormat: "dd-mm-yy", // Update this if needed
      duration: "fast",
      defaultDate: initialDate,
      changeYear: true, // Enable changing the year
    });

    $("#editdatepicker-icon").on("click", function (event) {
      event.preventDefault(); // Prevent default behavior (opening the default date picker calendar)
      var $datepicker = $("#editdatepicker");
      if ($datepicker.datepicker("widget").is(":hidden")) {
        $datepicker.datepicker("show"); // Show the datepicker if it's hidden
      } else {
        $datepicker.datepicker("hide"); // Hide the datepicker if it's visible
      }
    });
  });
}

function createValidation() {
  function validateBatchName() {
    let name = $("#schedule_batch_id").val();

    if (!name) {
      $("#batch_error").text("Batch name can't be blank");
      return false;
    } else {
      $("#batch_error").text("");
      return true;
    }
  }

  function validateUserName() {
    let name = $("#schedule_user_id").val();

    if (!name) {
      $("#user_error").text("Trainer name can't be blank");
      return false;
    } else {
      $("#user_error").text("");
      return true;
    }
  }

  function validateCourseName() {
    let name = $("#schedule_course_id").val();

    if (!name) {
      $("#course_error").text("Course can't be blank");
      return false;
    } else {
      $("#course_error").text("");
      return true;
    }
  }

  function validateScheduleDate() {
    let name = $("#datepicker").val();

    if (!name) {
      $("#schedule_date_error").text("Schedule date can't be blank");
      return false;
    } else {
      $("#schedule_date_error").text("");
      return true;
    }
  }

  function validateScheduleTime() {
    let name = $("#time-range").val();

    if (!name) {
      $("#enquire_timeslot_error").text("Schedule timings can't be blank");
      return false;
    } else {
      $("#enquire_timeslot_error").text("");
      return true;
    }
  }
  // Event bindings for registration form fields

  $("#schedule_batch_id").on("blur", validateBatchName);
  $("#schedule_user_id").on("blur", validateUserName);
  $("#schedule_course_id").on("blur", validateCourseName);
  $("#datepicker").on("blur", validateScheduleDate);
  $("#time-range").on("blur", validateScheduleTime);

  // Event binding for form submission
  $("#schedule-admin-form").on("submit", function (event) {
    // Validate all fields on form submission
    let isBatchValid = validateBatchName();
    let isUserValid = validateUserName();
    let isCourseValid = validateCourseName();
    let isDateValid = validateScheduleDate();
    let isTimeValid = validateScheduleTime();

    // Check if any field is invalid
    if (
      !isBatchValid ||
      !isUserValid ||
      !isCourseValid ||
      !isDateValid ||
      !isTimeValid
    ) {
      // Prevent form submission
      event.preventDefault();

      // Show all error messages
      validateBatchName();
      validateUserName();
      validateCourseName();
      validateScheduleDate();
      validateScheduleTime();
    }
  });
}

function editFormValidation() {
  function validateBatchName() {
    let name = $("#edit_schedule_batch_id").val();

    if (!name) {
      $("#edit_batch_error").text("Batch name can't be blank");
      return false;
    } else {
      $("#edit_batch_error").text("");
      return true;
    }
  }

  function validateUserName() {
    let name = $("#edit_schedule_user_id").val();

    if (!name) {
      $("#edit_user_error").text("Trainer name can't be blank");
      return false;
    } else {
      $("#edit_user_error").text("");
      return true;
    }
  }

  function validateCourseName() {
    let name = $("#edit_schedule_course_id").val();

    if (!name) {
      $("#edit_course_error").text("Course can't be blank");
      return false;
    } else {
      $("#edit_course_error").text("");
      return true;
    }
  }

  function validateScheduleDate() {
    let name = $("#editdatepicker").val();

    if (!name) {
      $("#edit_schedule_date_error").text("Schedule date can't be blank");
      return false;
    } else {
      $("#edit_schedule_date_error").text("");
      return true;
    }
  }

  function validateScheduleTime() {
    let name = $("#edit-time-range").val();

    if (!name) {
      $("#edit_enquire_timeslot_error").text("Schedule timings can't be blank");
      return false;
    } else {
      $("#edit_enquire_timeslot_error").text("");
      return true;
    }
  }

  $("#edit-schedule-popup").on(
    "focusout",
    "#edit_schedule_batch_id",
    validateBatchName
  );
  $("#edit-schedule-popup").on(
    "focusout",
    "#edit_schedule_user_id",
    validateUserName
  );
  $("#edit-schedule-popup").on(
    "focusout",
    "#edit_schedule_course_id",
    validateCourseName
  );
  $("#edit-schedule-popup").on("focusout", "#editdatepicker", validateScheduleDate);
  $("#edit-schedule-popup").on("focusout", "#edit-time-range", validateScheduleTime);

  $("#edit-schedule-popup").on(
    "submit",
    "#schedule-admin-edit-form",
    function (event) {
      let isBatchValid = validateBatchName();
      let isUserValid = validateUserName();
      let isCourseValid = validateCourseName();
      let isDateValid = validateScheduleDate();
      let isTimeValid = validateScheduleTime();

      if (
        !isBatchValid ||
        !isUserValid ||
        !isCourseValid ||
        !isDateValid ||
        !isTimeValid
      ) {
        event.preventDefault();
      }
    }
  );
}

$(document).ready(function () {
  editPopup();
  deletePopup();
  scheduleSearch();
  scheduleCreateBatch();
  scheduleCreateUser();
  scheduleEditBatch();
  scheduleEditUser();
  scheduleBatchData();
  createValidation();
  initializeTimeDropdowns();
  scheduleDate();
  editTimeDropdowns();
  editScheduleDate();
  editFormValidation();
  dateFilter();
  differentDateFilter();

  $(document).on("turbo:render", function () {
    editPopup();
    deletePopup();
    scheduleSearch();
    scheduleCreateBatch();
    scheduleCreateUser();
    scheduleEditBatch();
    scheduleEditUser();
    scheduleBatchData();
    createValidation();
    initializeTimeDropdowns();
    scheduleDate();
    editTimeDropdowns();
    editScheduleDate();
    editFormValidation();
    dateFilter();
    differentDateFilter();
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
    editTimeDropdowns();
    editScheduleDate();
    editFormValidation();
    scheduleSearch();
    differentDateFilter();
    if (streamElement.target == "schedule-admin-form") {
      scheduleCreateBatch();
      scheduleCreateUser();
      scheduleBatchData();
    }
    if (streamElement.target == "edit-schedule-popup") {
      scheduleEditBatch();
      scheduleEditUser();
    }
  };
});
