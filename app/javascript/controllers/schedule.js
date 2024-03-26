function editPopup() {
  $("#schedule-table").on('click', '.edit-schedule-model', function() {
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

      success: function(res) {
        Turbo.renderStreamMessage(res);
        $("#overlay").hide();
        editFormValidation();

      },
      done: function() {},
      error: function() {
        console.log("Error fetching data");
        $("#overlay").hide();
      },
    });
  });
}

function deletePopup() {
  $("#schedule-table").on('click', '.send-delete-schedule', function() {
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
      baseUrl += (page === 1 && search === "") ? "?" : "&";
      baseUrl += `per_page=${per_page}`;
    }

    // Update the href attribute
    $("#delete-schedule-model").attr("data-schedule-id", id);
    $("#delete-schedule-model").attr("href", baseUrl);
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
  $("#schedule-form .new-custom-select").each(function() {
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
      .each(function() {
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
    function() {
      $(this).parents(".new-custom-options").addClass("option-hover");
    },
    function() {
      $(this).parents(".new-custom-options").removeClass("option-hover");
    }
  );

  $(".new-custom-select-trigger").on("click", function(event) {
    $("html").one("click", function() {
      $(".new-custom-select").removeClass("opened");
    });
    $(this).parents(".new-custom-select").toggleClass("opened");
    event.stopPropagation();
  });

  $(".new-custom-option").on("click", function() {
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

function scheduleCreateCourse() {
  $("#schedule-form .new-lesson-custom-select").each(function() {
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
      .each(function() {
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
    function() {
      $(this).parents(".new-lesson-custom-options").addClass("option-hover");
    },
    function() {
      $(this).parents(".new-lesson-custom-options").removeClass("option-hover");
    }
  );

  $(".new-lesson-custom-select-trigger").on("click", function(event) {
    $("html").one("click", function() {
      $(".new-lesson-custom-select").removeClass("opened");
    });
    $(this).parents(".new-lesson-custom-select").toggleClass("opened");
    event.stopPropagation();
  });

  $(".new-lesson-custom-option").on("click", function() {
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
function scheduleEditUser() {
  $("#edit-schedule-popup .new-name-custom-select").each(function() {
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
      .each(function() {
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
    function() {
      $(this).parents(".new-name-custom-options").addClass("option-hover");
    },
    function() {
      $(this).parents(".new-name-custom-options").removeClass("option-hover");
    }
  );

  $(".new-name-custom-select-trigger").on("click", function(event) {
    $("html").one("click", function() {
      $(".new-name-custom-select").removeClass("opened");
    });
    $(this).parents(".new-name-custom-select").toggleClass("opened");
    event.stopPropagation();
  });

  $(".new-name-custom-option").on("click", function() {
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
  $("#edit-schedule-popup .new-status-custom-select").each(function() {
    var classes = $(this).attr("class"),
      id = $(this).attr("id"),
      status = $(this).attr("status");

    var placeholderText = $(this).find("option:first-of-type").text();

    var template = '<div class="' + classes + '">';
    template +=
      '<span class="new-status-custom-select-trigger">' +
      placeholderText +
      "</span>";
    template += '<div class="new-status-custom-options">';
    $(this)
      .find("option")
      .each(function() {
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
    function() {
      $(this).parents(".new-status-custom-options").addClass("option-hover");
    },
    function() {
      $(this).parents(".new-status-custom-options").removeClass("option-hover");
    }
  );

  $(".new-status-custom-select-trigger").on("click", function(event) {
    $("html").one("click", function() {
      $(".new-status-custom-select").removeClass("opened");
    });
    $(this).parents(".new-status-custom-select").toggleClass("opened");
    event.stopPropagation();
  });

  $(".new-status-custom-option").on("click", function() {
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

function scheduleEditCourse() {
  $("#edit-schedule-popup .new-course-custom-select").each(function() {
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
      .each(function() {
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
    function() {
      $(this).parents(".new-course-custom-options").addClass("option-hover");
    },
    function() {
      $(this).parents(".new-course-custom-options").removeClass("option-hover");
    }
  );

  $(".new-course-custom-select-trigger").on("click", function(event) {
    $("html").one("click", function() {
      $(".new-course-custom-select").removeClass("opened");
    });
    $(this).parents(".new-course-custom-select").toggleClass("opened");
    event.stopPropagation();
  });

  $(".new-course-custom-option").on("click", function() {
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

$(document).ready(function() {
  editPopup();
  deletePopup();
  scheduleCreateBatch();
  scheduleCreateUser();
  scheduleCreateCourse();
  scheduleEditCourse();
  scheduleEditBatch();
  scheduleEditUser();

  $(document).on("turbo:render", function() {
    editPopup();
    deletePopup();
    scheduleCreateBatch();
    scheduleCreateUser();
    scheduleCreateCourse();
    scheduleEditCourse();
    scheduleEditBatch();
    scheduleEditUser();
  });

  $(document).on("turbo:before-render", function() {
    $("#overlay").show();
  });
  $(document).on("turbo:after-render", function() {
    $("#overlay").hide();
  });
});

addEventListener("turbo:before-stream-render", (event) => {
  const fallbackToDefaultActions = event.detail.render;

  event.detail.render = function(streamElement) {
    fallbackToDefaultActions(streamElement);
    initModals();
    if (streamElement.target == 'schedule-admin-form') {
      scheduleCreateBatch();
      scheduleCreateUser();
      scheduleCreateCourse();
    }
    if (streamElement.target == 'edit-schedule-popup') {
      scheduleEditCourse();
      scheduleEditBatch();
      scheduleEditUser();
    }
  };
});