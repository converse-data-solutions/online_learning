function yearPicker() {
  $("#yearpicker").yearpicker({
    onChange: function (value) {},
  });
}

function selectCreateUser() {
  $("#admin-form .custom-select").each(function () {
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
  $("#filtered_course .new-custom-select").each(function () {
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

function passUserId() {
  $("#admin-form .custom-select").on("click", ".custom-option", function () {
    var userId = $(this).data("value");

    // Make an AJAX request to fetch sections for the selected course
    $.ajax({
      url: "/admin/attendance_details/find_users_course",
      type: "GET",
      data: {
        user_id: userId,
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
          "?user_id=" +
          encodeURIComponent(userId);
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
      },
    });
  });
}

function findUserCourse() {
  $(".new-custom-option").click(function () {
    let id = $(this).data("value");
    let searchParams = new URLSearchParams(window.location.search);
    let page = parseInt(searchParams.get("page")) || 1;
    let search = searchParams.get("search") || "";
    let per_page = parseInt(searchParams.get("per_page")) || 10;

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
    $("#attendance_user_course_id").attr("value", id);
  });
}

function attendanceEditPopup() {
  $("#attendance-table").on("click", ".edit-attendance-model", function () {
    let id = $(this).data("attendance-id");
    let url = $(this).data("url");
    let searchParams = new URLSearchParams(window.location.search);
    let page = parseInt(searchParams.get("page")) || 1;
    let search = searchParams.get("search") || "";
    $("#overlay").show();
    $.ajax({
      method: "GET",
      url: url,
      data: {
        attendance_id: id,
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

function attendanceDeletePopup() {
  $(".send-delete-attendance").click(function () {
    let id = $(this).data("attendance-id");
    let searchParams = new URLSearchParams(window.location.search);
    let page = parseInt(searchParams.get("page")) || 1;
    let search = searchParams.get("search") || "";
    let per_page = parseInt(searchParams.get("per_page")) || 10;

    // Construct the base URL
    let baseUrl = `attendance_details/${id}`;

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
    $("#delete-attendance-model").attr("data-attendance-id", id);
    $("#delete-attendance-model").attr("href", baseUrl);
  });
}

function classDate() {
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

function editClassDate() {
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

function searchAttendance() {
  let delayTimer;

  $("#attendance_search").on("input", function (e) {
    clearTimeout(delayTimer);
    delayTimer = setTimeout(function () {
      let searchValue = $("#attendance_search").val();
      $("#overlay").show();

      $.ajax({
        url: "/admin/attendance_details",
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

function updateStatus() {
  $(".attendance-status").click(function () {
    var attendanceDetailId = $(this).data("attendanceDetailId");
    var currentStatus = $(this).hasClass("true") ? "false" : "true";

    // Send AJAX request to toggle status
    $.ajax({
      url: "/admin/attendance_details/toggle_status/" + attendanceDetailId + "",
      method: "PATCH",
      headers: {
        Accept: "text/vnd.turbo-stream.html, text/html, application/xhtml+xml",
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
      },
      data: { status: currentStatus },
      success: function (data) {
        Turbo.renderStreamMessage(data);
        var newUrl =
          window.location.protocol +
          "//" +
          window.location.host +
          window.location.pathname +
          "?status=" +
          encodeURIComponent(currentStatus);
        window.history.pushState(
          {
            path: newUrl,
          },
          "",
          newUrl
        );
      },
      error: function (error) {
        console.error("Error:", error);
      },
    });
  });
}

function rangeCalendar() {
  $("#rangestart").calendar({
    type: "date",
    endCalendar: $("#rangeend"),
  });
  $("#rangeend").calendar({
    type: "date",
    startCalendar: $("#rangestart"),
  });
}

function rangeDateFilter() {
  var fromDate;
  var toDate;

  var initializeDatepickers = function () {
    $("#rangestart").calendar({
      type: "date",
      endCalendar: $("#rangeend"),
      formatter: {
        date: function (date, settings) {
          if (!date) return '';
          var day = date.getDate();
          var month = date.getMonth() + 1;
          var year = date.getFullYear();
          return year + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;
        }
      },
      onChange: function (date, text, mode) {
        fromDate = text;
        makeAjaxCall(); // Call the function to make AJAX call

      },
    });

    $("#rangeend").calendar({
      type: "date",
      startCalendar: $("#rangestart"),
      formatter: {
        date: function (date, settings) {
          if (!date) return '';
          var day = date.getDate();
          var month = date.getMonth() + 1;
          var year = date.getFullYear();
          return year + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;
        }
      },
      onChange: function (date, text, mode) {
        toDate = text;
        makeAjaxCall(); // Call the function to make AJAX call

      },
    });
  };

  function makeAjaxCall() {
    if (fromDate && toDate) {
      var requestData = {
        from_date: fromDate,
        to_date: toDate,
      };

      $.ajax({
        url: "/admin/attendance_details",
        type: "GET",
        data: requestData,
        headers: {
          Accept: "text/vnd.turbo-stream.html, text/html, application/xhtml+xml",
        },
        success: function (response) {
          Turbo.renderStreamMessage(response);
          var newUrl =
          window.location.protocol +
          "//" +
          window.location.host +
          window.location.pathname +
          "?dates=" +
          encodeURIComponent(requestData);
        window.history.pushState({
          path: newUrl
        }, "", newUrl);
        },
        error: function (xhr, status, error) {
          console.error("AJAX call error:", error);
        },
      });
    }
  }

  initializeDatepickers();

}

$(document).ready(function () {
  selectCreateCourse();
  selectCreateUser();
  passUserId();
  attendanceEditPopup();
  attendanceDeletePopup();
  findUserCourse();
  classDate();
  editClassDate();
  searchAttendance();
  updateStatus();
  rangeCalendar();
  rangeDateFilter();

  $(document).on("turbo:render", function () {
    selectCreateCourse();
    selectCreateUser();
    passUserId();
    attendanceEditPopup();
    attendanceDeletePopup();
    findUserCourse();
    classDate();
    editClassDate();
    searchAttendance();
    updateStatus();
    rangeCalendar();
    rangeDateFilter();
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
    if (streamElement.target == "course-select") {
    }
    selectCreateCourse();
    findUserCourse();
    editClassDate();
    classDate();
  };
});
