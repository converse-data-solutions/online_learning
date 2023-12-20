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
function checkboxDropdown(el) {
  var $el = $(el);

  function updateStatus(label, result) {
    if (!result.length) {
      label.html("Select Options");
    }
  }

  $el.each(function (i, element) {
    var $list = $(this).find(".dropdown-list"),
      $label = $(this).find(".dropdown-label"),
      $checkAll = $(this).find(".check-all"),
      $inputs = $(this).find(".check"),
      defaultChecked = $(this).find("input[type=checkbox]:checked"),
      result = [];

    updateStatus($label, result);
    if (defaultChecked.length) {
      defaultChecked.each(function () {
        result.push($(this).next().text());
        $label.html(result.join(", "));
      });
    }

    $label.on("click", () => {
      $(this).toggleClass("open-dropdown");
    });

    $checkAll.on("change", function () {
      var checked = $(this).is(":checked");
      var checkedText = $(this).next().text();
      result = [];
      if (checked) {
        result.push(checkedText);
        $label.html(result);
        $inputs.prop("checked", false);
      } else {
        $label.html(result);
      }
      updateStatus($label, result);
    });

    $inputs.on("change", function () {
      var checked = $(this).is(":checked");
      var checkedText = $(this).next().text();
      if ($checkAll.is(":checked")) {
        result = [];
      }
      if (checked) {
        result.push(checkedText);
        $label.html(result.join(", "));
        $checkAll.prop("checked", false);
      } else {
        let index = result.indexOf(checkedText);
        if (index >= 0) {
          result.splice(index, 1);
        }
        $label.html(result.join(", "));
      }
      updateStatus($label, result);
    });

    $(document).on("click touchstart", (e) => {
      if (!$(e.target).closest($(this)).length) {
        $(this).removeClass("open-dropdown");
      }
    });
  });
}

checkboxDropdown(".dropdown");
// datepicker
$(function () {
  $("#datepicker").datepicker({
    dateFormat: "dd-mm-yy",
    duration: "fast",
  });
});

//initialize script

$(document).ready(function () {
  editModelPopup();
  deletePopup();
  studentTableSearch();

  $(document).on("turbo:render", function () {
    editModelPopup();
    deletePopup();
    studentTableSearch();
  });
});

addEventListener("turbo:before-stream-render", (event) => {
  const fallbackToDefaultActions = event.detail.render;

  event.detail.render = function (streamElement) {
    fallbackToDefaultActions(streamElement);
    initModals();
    editModelPopup();
    deletePopup();
  };
});
