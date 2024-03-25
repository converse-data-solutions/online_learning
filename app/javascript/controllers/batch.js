function addBatchTime() {
  $("#batch-form #add_timing").on("click", function() {
    cloneBatchTimeForm();
    let timeIndex = $("#timeIndex").data("timeIndex");

  })
}

function cloneBatchTimeForm() {
  let timeIndex = $("#timeIndex").data("timeIndex");
  console.log("timeIndex =", timeIndex);
  let newtiming = $("#batch-form #batch_timings_container .batch_timing_container:first").clone();
  console.log("newtiming =", newtiming);
  newtiming.find("input").val("");
  newtiming.find("input").each(function() {
    let oldName = $(this).attr("name");
    let newName = oldName.replace(/\[\d\]/, "[" + timeIndex + "]");
    $(this).attr("name", newName);
  })
  
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
  $("#batch-form .new-custom-select").each(function() {
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
function enquireName() {
  $("#batch-form .new-name-custom-select").each(function() {
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
function timeSlot() {
  $(function() {
    $("#datepicker").datepicker({
      dateFormat: "dd-mm-yy",
      duration: "fast",
      changeYear: true, // Enable changing the year
    });

    // Adding click functionality to the effective-from datepicker icon
    $("#datepicker-icon").on("click", function(event) {
      event.preventDefault(); // Prevent default behavior (opening the default date picker calendar)
      var $datepicker = $("#datepicker");
      if ($datepicker.datepicker("widget").is(":hidden")) {
        $datepicker.datepicker("show"); // Show the datepicker if it's hidden
      } else {
        $datepicker.datepicker("hide"); // Hide the datepicker if it's visible
      }
    });
  });

  $(function() {
    $("#datepicker-to").datepicker({
      dateFormat: "dd-mm-yy",
      duration: "fast",
      changeYear: true, // Enable changing the year
    });

    // Adding click functionality to the effective-from datepicker icon
    $("#datepicker-icon-to").on("click", function(event) {
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

$(document).ready(function() {
  courseSelect();
  timeSlot();
  selectCreateUser();
  enquireName();
  addBatchTime();
  dropdownCheckBoxes();

  $(document).on("turbo:render", function() {
    courseSelect();
    timeSlot(); 
    selectCreateUser();
    enquireName();
    cloneBatchTimeForm();
    addBatchTime();
    dropdownCheckBoxes();
    
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
    
  };
});

