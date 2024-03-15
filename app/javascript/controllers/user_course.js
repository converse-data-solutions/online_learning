function editPopup() {
  $("#user-course-table").on("click", ".edit-user-course-model", function () {
    let id = $(this).data("user-course-id");
    let url = $(this).data("url");
    let searchParams = new URLSearchParams(window.location.search);
    let page = parseInt(searchParams.get("page")) || 1;
    let search = searchParams.get("search") || "";
    $("#overlay").show();
    $.ajax({
      method: "GET",
      url: url,
      data: {
        user_course_id: id,
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
  $(".send-delete-user-course").click(function () {
    let id = $(this).data("user-course-id");

    let searchParams = new URLSearchParams(window.location.search);
    let page = parseInt(searchParams.get("page")) || 1;
    let search = searchParams.get("search") || "";
    let per_page = parseInt(searchParams.get("per_page")) || 10;

    // Construct the base URL
    let baseUrl = `user_courses/${id}`;

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
    $("#delete-user-course-model").attr("data-user-course-id", id);
    $("#delete-user-course-model").attr("href", baseUrl);
  });
}

function tableSearch() {
  let delayTimer;

  $("#user_course_search").on("input", function (e) {
    clearTimeout(delayTimer);
    delayTimer = setTimeout(function () {
      let searchValue = $("#user_course_search").val();
      $("#overlay").show();

      $.ajax({
        url: "/admin/user_courses",
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

function getCourseAmount() {
  $("#user-course-filter-container").on(
    "click",
    ".new-lesson-custom-option",
    function () {
      $("#overlay").show();
      var selectedUserId = $(this).data("value");
      console.log(selectedUserId);
      $.ajax({
        type: "GET",
        url: "/admin/users",
        data: {
          user: selectedUserId,
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
            encodeURIComponent(selectedUserId);
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
  );
}

function selectCreateUser() {
  $("#user-course-filter-container .custom-select").each(function () {
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
  $("#user-course-filter-container .new-course-custom-select").each(
    function () {
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
    }
  );

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

function selectEditUser() {
  $("#edit-user_course-popup .new-lesson-custom-select").each(function () {
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

function selectEditCourse() {
  $("#edit-user_course-popup .new-custom-select").each(function () {
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

$(document).ready(function () {
  editPopup();
  deletePopup();
  tableSearch();
  selectCreateCourse();
  selectCreateUser();

  $(document).on("turbo:render", function () {
    editPopup();
    deletePopup();
    tableSearch();
    selectCreateCourse();
    selectCreateUser();
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
    deletePopup();
    if (streamElement.target == "user-course-admin-form") {
      selectCreateCourse();
      selectCreateUser();
    }
    if (streamElement.target == "edit-user_course-popup") {
      selectEditUser();
      selectEditCourse();
    }
  };
});
