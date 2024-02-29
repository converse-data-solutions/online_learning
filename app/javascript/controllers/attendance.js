function yearSelector() {
  $(function() {
    $("#datepicker").datepicker({
      dateFormat: "dd-mm-yy",
      duration: "fast",
      changeYear:  true, // Enable changing the year

    });

    // Adding change functionality to the year select
    $(document).on('change', '.yearselect', function() {
      var year = $(this).val();
      $("#datepicker").datepicker('setDate', new Date(year, 0, 1));
    });

    // Adding click functionality to the datepicker icon
    $("#datepicker-icon").on('click', function(event) {
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


function monthSelector() {
  $(function() {
    let initialDate = $("#todatepicker").val(); // Assuming the date is stored in the input field

    $("#todatepicker").datepicker({
      dateFormat: "dd-mm-yy", // Update this if needed
      duration: "fast",
      defaultDate: initialDate,
      changeYear: true, // Enable changing the year
    });

    $("#todatepicker-icon").on('click', function(event) {
      event.preventDefault(); // Prevent default behavior (opening the default date picker calendar)
      var $datepicker = $("#todatepicker");
      if ($datepicker.datepicker("widget").is(":hidden")) {
        $datepicker.datepicker("show"); // Show the datepicker if it's hidden
      } else {
        $datepicker.datepicker("hide"); // Hide the datepicker if it's visible
      }
    });
  });
}
$(document).ready(function() {
  yearSelector();
  monthSelector();

  $(document).on("turbo:render", function() {
    yearSelector();
    monthSelector();
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

    }
    
  };
});