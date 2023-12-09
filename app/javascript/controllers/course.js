//Filter for Collection-Select

$(".filter-handle").on("change", function (e) {
  var location = e.target.value;
  var table = $(".filter-table-data");
  if (location.length) {
    table.find("tr[data-type!=" + location + "]").hide();
    table.find("tr[data-type=" + location + "]").show();
  } else {
    table.find("tr").show();
  }
});

// Table Search Bar
function tableSearch() {
  $("#table-search").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#myTable tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });
}

// Stepper Table New Form
function tableForm() {
  $(".display-section-button").click(function () {
    $(".display-section").toggle();
  });
  $(".display-lesson-button").click(function () {
    $(".display-lesson").show();
  });
}

// Stepper Course Submit
function courseSubmit() {
  $(".next-btn").click(function () {
    $("#new_course").submit();
    event.preventDefault();
  });
}

// Collection-Select Style
function collectionSelect() {
  $(".custom-select").each(function () {
    var classes = $(this).attr("class"),
      id = $(this).attr("id"),
      name = $(this).attr("name");

    var placeholderText = $(this).find("option:first-of-type").text(); // Get text of the first option

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

// Lesson File Upload

$(document).on("change", ".clipUpload input[type='file']", function () {
  if ($(this).val()) {
    var filename = $(this).val().split("\\");

    filename = filename[filename.length - 1];

    $(".clip").text(filename);
  }
});
$(document).on("change", ".fileUploadWrap input[type='file']", function () {
  if ($(this).val()) {
    var filename = $(this).val().split("\\");

    filename = filename[filename.length - 1];

    $(".attachments").text(filename);
  }
});

function clearFormOnSubmit() {
  $("#stepper_section-form").on("submit", function(event) {
    event.preventDefault();

    this.reset();
  });
}

  // function stepperStep(){
  //   console.log("stepper step");
  //   $("#stepper-loader").currentIndex = 3;{
  //    console.log("stepper step"); 
  //   }
    
  // }
      // function checkStepperIndex() {
      //   HSStepper.getInstance("[data-hs-stepper]")
      //   a= HSStepper.getInstance("[data-hs-stepper]").currentIndex
      //   alert(a)
      //   if (a == 3){
      //       alert("sdfsfdsfs")
      //   }
      // }

      // function stepperLoop() {
      //   const active = {
      //     stepper: 1,
      //   };
      
      //   const slideStepper = function (element) {
      //     $(".outer-div, .line, .circle, h2").removeClass(
      //       "active-outerdiv fineshed-outerdiv active-circle fineshed-circle text-active text-fineshed fineshed-line"
      //     );
      
      //     const currentStep = element.replace("step-", "");
      
      //     for (let i = 1; i <= currentStep; i++) {
      //       const stepId = `#step-${i}`;
      //       const textId = `#text${i}`;
      
      //       if (i == currentStep) {
      //         $(`${stepId} .outer-div`).addClass("active-outerdiv");
      //         $(`${stepId} .circle`).addClass("active-circle");
      //         $(`${textId}`).addClass("text-active");
      //       } else {
      //         $(`${stepId} .outer-div`).addClass("fineshed-outerdiv");
      //         $(`${stepId} .circle`).addClass("fineshed-circle");
      //         $(`${textId}`).addClass("text-fineshed");
      //       }
      
      //       if (i < currentStep) {
      //         const lineId = `#line-${i}`;
      //         $(`${lineId} .line`).addClass("fineshed-line");
      //       }
      //     }
      //   };
      
      //   const buttonSlideStepper = function () {
      //     if (active.stepper < sectionsSize) {
      //       slideStepper(`step-${active.stepper + 1}`);
      //       active.stepper += 1;
      //     }
      //   };
      //   $(".containers").on("click", function () {
      //     const elementId = $(this).attr("id");
      //     slideStepper(elementId);
      //   });
      
      //   $(".circle").on("click", function (event) {
      //     const containerId = $(this).closest(".containers").attr("id");
      //     const currentStep = containerId.replace("step-", "");
      //     if (currentStep > 1) {
      //       slideStepper(`step-${currentStep}`);
      //       active.stepper = parseInt(currentStep);
      //     }
      //   });
      
      //   $("#next-button").on("click", function () {
      //     buttonSlideStepper();
      //   });
      
      //   slideStepper(`step-${active.stepper}`);
      // }


$(document).ready(function () {
  courseSubmit();
  tableForm();
  tableSearch();
  collectionSelect();
  // stepperLoop();

  $(document).on("turbo:render", function () {
    courseSubmit();
    tableForm();
    tableSearch();
    // stepperLoop();

    if ($("#stepper-loader").length > 0) {
      new HSStepper($("#stepper-loader")[0]);
    }
  });
});
