function yearPicker() {
  $("#datepicker").yearpicker({
    onChange: function (value) {
    },
  });
}

$(document).ready(function () {
  yearPicker();

  $(document).on("turbo:render", function () {
    yearPicker();
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
