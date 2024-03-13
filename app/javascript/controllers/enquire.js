function editEnquirePopup() {
  $("#enquire-table").on("click", ".edit-enquire-model", function () {
    let id = $(this).data("enquire-id");
    let url = $(this).data("url");
    let searchParams = new URLSearchParams(window.location.search);
    let page = parseInt(searchParams.get("page")) || 1;
    let search = searchParams.get("search") || "";
    $("#overlay").show();
    $.ajax({
      method: "GET",
      url: url,
      data: {
        enquire_id: id,
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
      error: function () {
        console.log("Error fetching data");
        $("#overlay").hide();
      },
    });
  });
}

function viewEnquirePopup() {
  $("#enquire-table").on("click", ".view-enquire-model", function () {
    let id = $(this).data("enquire-id");
    let url = $(this).data("url");
    let searchParams = new URLSearchParams(window.location.search);
    let page = parseInt(searchParams.get("page")) || 1;
    let search = searchParams.get("search") || "";
    $("#overlay").show();
    $.ajax({
      method: "GET",
      url: url,
      data: {
        enquire_id: id,
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
      error: function () {
        console.log("Error fetching data");
        $("#overlay").hide();
      },
    });
  });
}

function deleteEnquirePopup() {
  $("#enquire-table").on("click", ".send-delete-enquire", function () {
    let id = $(this).data("enquire-id");
    let searchParams = new URLSearchParams(window.location.search);
    let page = parseInt(searchParams.get("page")) || 1;
    let search = searchParams.get("search") || "";
    let per_page = parseInt(searchParams.get("per_page")) || 10;

    let delUrl = `enquires/${id}`;

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

    $("#delete-enquire-model").attr("data-enquire-id", id);
    $("#delete-enquire-model").attr("href", delUrl);
  });
}

function searchEnquire() {
  let delayTimer;

  $("#enquire_search").keyup(function (e) {
    clearTimeout(delayTimer);
    delayTimer = setTimeout(function () {
      let searchValue = $("#enquire_search").val();
      $("#overlay").show();
      $.ajax({
        url: "/admin/enquires",
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

function enquireName() {
  $("#enquire-filter-container .custom-select").each(function () {
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

function enquireCourse() {
  $("#enquire-filter-container .new-course-custom-select").each(function () {
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

function enquireStatus() {
  $("#enquire-filter-container .new-custom-select").each(function () {
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

function enquireTimeslot() {
  $("#enquire-filter-container .new-lesson-custom-select").each(function () {
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

function nameFilter() {
  $("#enquire-filter-container .custom-select").on(
    "click",
    ".custom-option",
    function () {
      var studentName = $(this).data("value");
      console.log("Name: " + studentName);
      $("#overlay").show();
      $.ajax({
        url: "/admin/enquires",
        type: "GET",
        data: {
          name: studentName,
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
            "?name=" +
            encodeURIComponent(studentName);
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

function courseFilter() {
  $("#enquire-filter-container .new-course-custom-select").on(
    "click",
    ".new-course-custom-option",
    function () {
      var studentCourse = $(this).data("value");
      console.log("Course: " + studentCourse);
      $("#overlay").show();
      $.ajax({
        url: "/admin/enquires",
        type: "GET",
        data: {
          course: studentCourse,
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
            encodeURIComponent(studentCourse);
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

function statusFilter() {
  $("#enquire-filter-container .new-custom-select").on(
    "click",
    ".new-custom-option",
    function () {
      var studentStatus = $(this).data("value");
      console.log("Status: " + studentStatus);
      $("#overlay").show();
      $.ajax({
        url: "/admin/enquires",
        type: "GET",
        data: {
          status: studentStatus,
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
            "?status=" +
            encodeURIComponent(studentStatus);
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

function timeSlot() {
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

function editTimeSlot() {
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

function enquireAdmin() {
  $("#enquire-admin-form .custom-select").each(function () {
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
      const hours = Array.from({ length: 12 }, (_, i) => (i === 0 ? 12 : i));
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
      const hours = Array.from({ length: 12 }, (_, i) => (i === 0 ? 12 : i));
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

function editEnquireAdmin() {
  $("#edit-enquire-popup .new-custom-select").each(function () {
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

function enquireFormValidation() {
  function enquireName() {
    let name = $("#enquire_name").val();
    let namecheck = /^[a-zA-Z ]+$/.test(name);

    if (!name) {
      $("#enquire_name_error").text("Name can't be blank");
      return false;
    } else if (!namecheck) {
      $("#enquire_name_error").text(
        "Please enter a valid name (only alphabets allowed)"
      );
      return false;
    } else {
      $("#enquire_name_error").text("");
      return true;
    }
  }

  function enquireStatus() {
    let name = $(".status_validation").val();

    if (!name) {
      $("#enquire_status_error").text("Status can't be blank");
      return false;
    } else {
      $("#enquire_status_error").text("");
      return true;
    }
  }

  function enquireCourse() {
    let name = $("#enquire_course").val();
    let namecheck = /^[a-zA-Z ]+$/.test(name);

    if (!name) {
      $("#enquire_course_error").text("Course can't be blank");
      return false;
    } else if (!namecheck) {
      $("#enquire_course_error").text(
        "Please enter a valid Course (only alphabets allowed)"
      );
      return false;
    } else {
      $("#enquire_course_error").text("");
      return true;
    }
  }

  function enquireContact() {
    let contactNumber = $("#enquire_contact").val();

    if (!contactNumber) {
      $("#enquire_contact_error").text("Contact Number cannot be empty");
      return false;
    }

    if (!validator.isNumeric(contactNumber) || contactNumber.length !== 10) {
      $("#enquire_contact_error").text(
        "Contact Number must be a 10-digit number"
      );
      return false;
    } else {
      $("#enquire_contact_error").text("");
      return true;
    }
  }

  function enquireLocation() {
    let name = $("#enquire_course").val();
    let namecheck = /^[a-zA-Z ]+$/.test(name);

    if (!name) {
      $("#enquire_location_error").text("Occupation can't be blank");
      return false;
    } else if (!namecheck) {
      $("#enquire_location_error").text(
        "Please enter a valid Occupation (only alphabets allowed)"
      );
      return false;
    } else {
      $("#enquire_location_error").text("");
      return true;
    }
  }
  function enquireSalesPerson() {
    let name = $("#enquire_sales_person").val();
    let namecheck = /^[a-zA-Z ]+$/.test(name);

    if (!name) {
      $("#enquire_sales_person_error").text("Occupation can't be blank");
      return false;
    } else if (!namecheck) {
      $("#enquire_sales_person_error").text(
        "Please enter a valid Occupation (only alphabets allowed)"
      );
      return false;
    } else {
      $("#enquire_sales_person_error").text("");
      return true;
    }
  }
  // Event bindings for registration form fields
  $("#enquire_name").on("blur", enquireName);
  $(".status_validation").on("blur", enquireStatus);
  $("#enquire_sales_person").on("blur", enquireSalesPerson);
  $("#enquire_course").on("blur", enquireCourse);
  $("#enquire_contact").on("blur", enquireContact);
  $("#enquire_location").on("blur", enquireLocation);

  // Event binding for form submission
  $("#enquire-admin-form").on("submit", function (event) {
    // Validate all fields on form submission
    let isNameValid = enquireName();
    let isStatusValid = enquireStatus();
    let isCourseValid = enquireCourse();
    let isContactValid = enquireContact();
    let isLocationValid = enquireLocation();
    let isSalesPersonValid = enquireSalesPerson();

    // Check if any field is invalid
    if (
      !isNameValid ||
      !isCourseValid ||
      !isStatusValid ||
      !isContactValid ||
      !isLocationValid ||
      !isSalesPersonValid
    ) {
      // Prevent form submission
      event.preventDefault();

      // Show all error messages
      enquireName();
      enquireStatus();
      enquireCourse();
      enquireContact();
      enquireLocation();
      enquireSalesPerson();
    }
  });
}

function enquireEditFormValidation() {
  function enquireName() {
    let name = $("#edit_enquire_name").val();
    let namecheck = /^[a-zA-Z ]+$/.test(name);

    if (!name) {
      $("#edit_enquire_name_error").text("Name can't be blank");
      return false;
    } else if (!namecheck) {
      $("#edit_enquire_name_error").text(
        "Please enter a valid name (only alphabets allowed)"
      );
      return false;
    } else {
      $("#edit_enquire_name_error").text("");
      return true;
    }
  }

  function enquireStatus() {
    let name = $(".edit_status_validation").val();

    if (!name) {
      $("#edit_enquire_status_error").text("Status can't be blank");
      return false;
    } else {
      $("#edit_enquire_status_error").text("");
      return true;
    }
  }

  function enquireCourse() {
    let name = $("#edit_enquire_course").val();
    let namecheck = /^[a-zA-Z ]+$/.test(name);

    if (!name) {
      $("#edit_enquire_course_error").text("Course can't be blank");
      return false;
    } else if (!namecheck) {
      $("#edit_enquire_course_error").text(
        "Please enter a valid Course (only alphabets allowed)"
      );
      return false;
    } else {
      $("#edit_enquire_course_error").text("");
      return true;
    }
  }

  function enquireContact() {
    let contactNumber = $("#edit_enquire_contact").val();

    if (!contactNumber) {
      $("#edit_enquire_contact_error").text("Contact Number cannot be empty");
      return false;
    }

    if (!validator.isNumeric(contactNumber) || contactNumber.length !== 10) {
      $("#edit_enquire_contact_error").text(
        "Contact Number must be a 10-digit number"
      );
      return false;
    } else {
      $("#edit_enquire_contact_error").text("");
      return true;
    }
  }

  function enquireLocation() {
    let name = $("#edit_enquire_course").val();
    let namecheck = /^[a-zA-Z ]+$/.test(name);

    if (!name) {
      $("#edit_enquire_location_error").text("Occupation can't be blank");
      return false;
    } else if (!namecheck) {
      $("#edit_enquire_location_error").text(
        "Please enter a valid Occupation (only alphabets allowed)"
      );
      return false;
    } else {
      $("#edit_enquire_location_error").text("");
      return true;
    }
  }
  function enquireSalesPerson() {
    let name = $("#edit_enquire_sales_person").val();
    let namecheck = /^[a-zA-Z ]+$/.test(name);

    if (!name) {
      $("#edit_enquire_sales_person_error").text("Occupation can't be blank");
      return false;
    } else if (!namecheck) {
      $("#edit_enquire_sales_person_error").text(
        "Please enter a valid Occupation (only alphabets allowed)"
      );
      return false;
    } else {
      $("#edit_enquire_sales_person_error").text("");
      return true;
    }
  }
  // Event bindings for registration form fields
  $("#edit-enquire-popup").on("focusout", "#edit_enquire_name", enquireName);
  $("#edit-enquire-popup").on("focusout", "#enquireStatus", enquireStatus);
  $("#edit-enquire-popup").on("focusout", "#edit_enquire_course", enquireCourse);
  $("#edit-enquire-popup").on("focusout", "#edit_enquire_contact", enquireContact);
  $("#edit-enquire-popup").on("focusout", "#edit_enquire_location", enquireLocation);
  $("#edit-enquire-popup").on("focusout", "#edit_enquire_sales_person", enquireSalesPerson);


  $("#edit-enquire-popup").on("submit", "#enquire-admin-edit-form", function(event) {

    let isNameValid = enquireName();
    let isStatusValid = enquireStatus();
    let isCourseValid = enquireCourse();
    let isContactValid = enquireContact();
    let isLocationValid = enquireLocation();
    let isSalesPersonValid = enquireSalesPerson();

    if (!isNameValid || !isStatusValid || !isCourseValid || !isContactValid || !isLocationValid || !isSalesPersonValid) {
      event.preventDefault();
    }
  });
}

$(document).ready(function () {
  editEnquirePopup();
  viewEnquirePopup();
  deleteEnquirePopup();
  searchEnquire();
  enquireName();
  enquireCourse();
  enquireStatus();
  enquireTimeslot();
  nameFilter();
  courseFilter();
  statusFilter();
  timeSlot();
  enquireAdmin();
  initializeTimeDropdowns();
  editTimeDropdowns();
  editTimeSlot();
  editEnquireAdmin();
  enquireFormValidation();
  enquireEditFormValidation();

  $(document).on("turbo:render", function () {
    editEnquirePopup();
    viewEnquirePopup();
    deleteEnquirePopup();
    searchEnquire();
    enquireName();
    enquireCourse();
    enquireStatus();
    enquireTimeslot();
    nameFilter();
    courseFilter();
    statusFilter();
    timeSlot();
    enquireAdmin();
    initializeTimeDropdowns();
    editTimeDropdowns();
    editTimeSlot();
    editEnquireAdmin();
    enquireFormValidation();
    enquireEditFormValidation();
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
    initializeTimeDropdowns();
    editTimeDropdowns();
    editTimeSlot();
    editEnquireAdmin();
  };
});
