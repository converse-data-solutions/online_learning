function editModelPopup() {
  $(".edit-student-model").click(function () {
    let id = $(this).data("user-id");
    let url = $(this).data("url");
    $.ajax({
      method: "GET",
      url: url,
      data: {
        user_id: id,
      },
      headers: {
        Accept: "text/vnd.turbo-stream.html, text/html, application/xhtml+xml",
      },

      success: function (res) {
        Turbo.renderStreamMessage(res);
      },
      error: function () {
        console.log("Error fetching data");
      },
    });
  });
}

function deletePopup() {
  console.log("processed.....");
  $(".send-delete-student").click(function () {
    console.log("processed Loading.....");
    let id = $(this).data("user-id");
    $("#delete-student-model").attr("data-user-id", id);
    $("#delete-student-model").attr("href", `students/${id}`);
  });
}

function studentTableSearch() {
  $("#student_search").on("input", function () {
    let searchValue = $(this).val();
    $.ajax({
      url: "/admin/students",
      type: "GET",
      data: { search: searchValue },
      headers: {
        Accept: "text/vnd.turbo-stream.html, text/html, application/xhtml+xml",
      },
      success: function (res) {
        Turbo.renderStreamMessage(res);
      },
      error: function () {
        console.log("Error fetching data");
      },
    });
  });
}

// Dropdown with checkboxes
function dropdownCheckBoxes() {
  function checkboxDropdown(el) {
    var $el = $(el);

    $el.each(function () {
      var $list = $(this).find(".dropdown-list"),
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
        var checkedText = $(this).next().text();

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
// datepicker
function customDatePicker() {
  $(function () {
    $("#datepicker").datepicker({
      dateFormat: "dd-mm-yy",
      duration: "fast",
    });
  });
}

function customEditDatePicker() {
  $(function () {
    var initialDate = $("#editdatepicker").val(); // Assuming the date is stored in the input field

    $("#editdatepicker").datepicker({
      dateFormat: "dd-mm-yy", // Update this if needed
      duration: "fast",
      defaultDate: initialDate,
    });
  });
}

//initialize script

$(document).ready(function () {
  editModelPopup();
  deletePopup();
  studentTableSearch();
  dropdownCheckBoxes();
  customDatePicker();
  customEditDatePicker();

  $(document).on("turbo:render", function () {
    editModelPopup();
    deletePopup();
    studentTableSearch();
    dropdownCheckBoxes();
    customDatePicker();
    customEditDatePicker();
  });
});

addEventListener("turbo:before-stream-render", (event) => {
  const fallbackToDefaultActions = event.detail.render;

  event.detail.render = function (streamElement) {
    fallbackToDefaultActions(streamElement);
    initModals();
    editModelPopup();
    deletePopup();
    dropdownCheckBoxes();
    customDatePicker();
    customEditDatePicker();
  };
});
