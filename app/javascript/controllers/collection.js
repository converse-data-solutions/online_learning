function selectUser() {
  $("#filter-container .custom-select").each(function() {
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
      .each(function() {
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
    function() {
      $(this).parents(".custom-options").addClass("option-hover");
    },
    function() {
      $(this).parents(".custom-options").removeClass("option-hover");
    }
  );

  $(".custom-select-trigger").on("click", function(event) {
    $("html").one("click", function() {
      $(".custom-select").removeClass("opened");
    });
    $(this).parents(".custom-select").toggleClass("opened");
    event.stopPropagation();
  });

  $(".custom-option").on("click", function() {
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

function selectCourse() {
  $("#course-dropdown .new-custom-select").each(function() {
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

function userCourseSelect() {
  $("#filter-container .custom-select").on("click", ".custom-option", function() {
    var userId = $(this).data('value');
    let getUser = $("#get-user-id").attr("data-user-id", userId).val(userId);

    // Make an AJAX request to fetch sections for the selected course
    $.ajax({
      url: '/admin/payments/user_collection',
      type: 'GET',
      data: {
        user_id: userId
      },
      headers: {
        Accept: "text/vnd.turbo-stream.html, text/html, application/xhtml+xml",
      },
      success: function(data) {
        Turbo.renderStreamMessage(data);
        $("#course-select .new-custom-option").attr('data-user-id', userId);
      },
      error: function(error) {
        console.error('Error:', error);
      }
    });
  });
}

function tableSearch() {
  let delayTimer;

  $("#collection_search").on("input", function(e) {
    clearTimeout(delayTimer);
    delayTimer = setTimeout(function() {
      let searchValue = $("#collection_search").val();
      $("#overlay").show();

      $.ajax({
        url: "/admin/payments/collections",
        type: "GET",
        data: {
          search: searchValue,
        },
        headers: {
          Accept: "text/vnd.turbo-stream.html, text/html, application/xhtml+xml",
        },
        success: function(res) {
          Turbo.renderStreamMessage(res);
          var newURL =
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname +
            "?search=" +
            encodeURIComponent(searchValue);
          window.history.pushState({
            path: newURL
          }, "", newURL);
          $("#overlay").hide();
        },
        error: function() {
          console.log("Error fetching data");
          $("#overlay").hide();
        },
      });
    }, 500);
  });
}

function optionSelect() {
  console.log("function Loaded......");
  $("#course-dropdown").on("click", ".new-custom-option", function() {
    console.log("option selected");
    $("#overlay").show();
    var selectedCourseId = $(this).data("value");
    $.ajax({
      type: "GET",
      url: "/admin/payments/collections",
      data: {
        course: selectedCourseId
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
          "?course_id=" +
          encodeURIComponent(selectedCourseId);
        window.history.pushState({
          path: newUrl
        }, "", newUrl);
        $("#overlay").hide();
      },
      error: function(error) {
        console.error("AJAX Error:", error);
        $("#overlay").hide();
      },
    });
  });
}

function fromDate() {
  $(function() {
    $("#datepicker").datepicker({
      dateFormat: "dd-mm-yy",
      duration: "fast",
    });
  });
}

function toDate() {
  $(function() {
    $("#todatepicker").datepicker({
      dateFormat: "dd-mm-yy",
      duration: "fast",
    });
  });
}

function dateFilter(){
  $('.show-dates').change(function() {
    // Collect selected checkbox values
    var selectedOptions = [];
    $('.show-dates:checked').each(function() {
      selectedOptions.push($(this).val());
    });

    // Send AJAX request with selected options
    $.ajax({
      type: "GET",
      url: "/admin/payments/collections",
      data: {
        dates: selectedOptions
      },
      headers: {
        Accept: "text/vnd.turbo-stream.html, text/html, application/xhtml+xml",
      },
      success: function(data) {
        Turbo.renderStreamMessage(data);
        console.log("Data:", data);
        var newUrl =
          window.location.protocol +
          "//" +
          window.location.host +
          window.location.pathname +
          "?next_payment_date=" +
          encodeURIComponent(selectedOptions);
        window.history.pushState({
          path: newUrl
        }, "", newUrl);
        $("#overlay").hide();
      },
      error: function(error) {
        console.error("AJAX Error:", error);
        $("#overlay").hide();
      },
    });
  });
}

$(document).ready(function() {
  selectUser();
  selectCourse();
  userCourseSelect();
  fromDate();
  toDate();
  tableSearch();
  optionSelect();
  dateFilter();

  $(document).on("turbo:render", function() {
    selectUser();
    selectCourse();
    userCourseSelect();
    fromDate();
    toDate();
    tableSearch();
    optionSelect();
    dateFilter();
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
    if (streamElement.target == 'course-dropdown') {
      selectCourse();
    }
    optionSelect();
  };
});