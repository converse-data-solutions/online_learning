function paymentSelectUser() {
  $("#payment-filter-container .custom-select").each(function() {
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

function paymentSelectCourse() {
  $("#course-select .new-custom-select").each(function() {
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

function paymentUserCourseSelect() {
  $("#payment-filter-container .custom-select").on("click", ".custom-option", function() {
    var userId = $(this).data('value');
    let getUser = $("#get-user-id").attr("data-user-id", userId).val(userId);

    // Make an AJAX request to fetch sections for the selected course
    $.ajax({
      url: '/admin/payments/user_course',
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

function paymentUserIdSelect() {
  $("#course-select").on("click", ".new-custom-option", function() {
    $("#overlay").show();
    var selectedCourseId = $(this).data("value");
    console.log("selectedCourseId", selectedCourseId);
    var user_id = $("#get-user-id").val();
    console.log("user_id", user_id);
    $.ajax({
      type: "GET",
      url: "/admin/payments/balance_amount",
      data: {
        course_id: selectedCourseId,
        user_id: user_id
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
          encodeURIComponent(selectedCourseId) +
          "&user_id=" +
          encodeURIComponent(user_id);

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
      dateFormat: "yy-mm-dd",
      duration: "fast",
      changeYear: true, // Enable changing the year
      defaultDate: new Date() // Set default date to current date
    });
  });
}

function toDate() {
  $(function() {
    $("#todatepicker").datepicker({
      dateFormat: "yy-mm-dd",
      duration: "fast",
      changeYear: true, // Enable changing the year
      defaultDate: new Date() // Set default date to current date
    });
  });
}

function createPayment() {

  function paidDate() {
    let name = $("#datepicker").val();

    if (!name) {
      $("#datepicker_error").text("Payment date can't be blank");
      return false;
    } else {
      $("#datepicker_error").text("");
      return true;
    }
  }

  function nextPayment(){
    let name = $("#todatepicker").val();

    if (!name) {
      $("#todatepicker_error").text("Course name can't be blank");
      return false;
    } else {
      $("#todatepicker_error").text("");
      return true;
    }
  }

  function couseAmount() {
    let name = $("#paid_amount").val();

    if (!name) {
      $("#payment_error").text("Payment can't be blank");
      return false;
    } else {
      $("#payment_error").text("");
      return true;
    }
  }

  
  // Event bindings for registration form fields
  
  $("#datepicker").on("blur", paidDate);
  $("#todatepicker").on("blur", nextPayment);
  $("#paid_amount").on("blur", couseAmount);

  // Event binding for form submission
  $("#admin-payment-form").on("submit", function(event) {
    // Validate all fields on form submission
    let isNameValid = paidDate();
    let isCourseValid = nextPayment();
    let isAmountValid = couseAmount();

   
    // Check if any field is invalid
    if (
      !isNameValid ||
      !isCourseValid ||
      !isAmountValid
     
    ) {
      // Prevent form submission
      event.preventDefault();

      // Show all error messages
      paidDate();
      nextPayment();
      couseAmount();
    }
  });
}

$(document).ready(function() {
  paymentSelectUser();
  paymentSelectCourse();
  paymentUserCourseSelect();
  paymentUserIdSelect();
  fromDate();
  toDate();
  createPayment();

  $(document).on("turbo:render", function() {
    paymentSelectUser();
    paymentSelectCourse();
    paymentUserCourseSelect();
    paymentUserIdSelect();
    fromDate();
    toDate();
    createPayment();
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
    if (streamElement.target == 'course-select') {
      paymentSelectCourse();
    }
    fromDate();
    toDate();
    createPayment();
  };
});