function yearPicker() {
  $("#datepicker").yearpicker({
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
  $("#admin-form .new-custom-select").each(function () {
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
  $("#admin-form .custom-select").on("click", ".custom-option", function() {
    var userId = $(this).data('value');

    // Make an AJAX request to fetch sections for the selected course
    $.ajax({
      url: '/admin/attendance_details/find_users_course',
      type: 'GET',
      data: {
        user_id: userId
      },
      headers: {
        Accept: "text/vnd.turbo-stream.html, text/html, application/xhtml+xml",
      },
      success: function(data) {
        Turbo.renderStreamMessage(data);
        var newUrl =
          window.location.protocol +
          "//" +
          window.location.host +
          window.location.pathname +
          "?user_id=" +
          encodeURIComponent(selectedLessonId);
        window.history.pushState({
          path: newUrl
        }, "", newUrl);
        $("#overlay").hide();
      },
      error: function(error) {
        console.error('Error:', error);
      }
    });
  });
}

function findUserCourse(){
  
}

function attendanceEditPopup() {
  $("#attendance-table").on('click', '.edit-attendance-model', function() {
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

      success: function(res) {
        Turbo.renderStreamMessage(res);
        $("#overlay").hide();

      },
      done: function() {},
      error: function() {
        console.log("Error fetching data");
        $("#overlay").hide();
      },
    });
  });
}

function attendanceDeletePopup() {
  $(".send-delete-attendance").click(function() {
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
      baseUrl += (page === 1 && search === "") ? "?" : "&";
      baseUrl += `per_page=${per_page}`;
    }

    // Update the href attribute
    $("#delete-attendance-model").attr("data-attendance-id", id);
    $("#delete-attendance-model").attr("href", baseUrl);
  });
}


$(document).ready(function () {
  yearPicker();
  selectCreateCourse();
  selectCreateUser();
  passUserId();
  attendanceEditPopup();
  attendanceDeletePopup();

  $(document).on("turbo:render", function () {
    yearPicker();
    selectCreateCourse();
    selectCreateUser();
    passUserId();
    attendanceEditPopup();
    attendanceDeletePopup();
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
    if (streamElement.target == "course-select") {
    }
  };
});
