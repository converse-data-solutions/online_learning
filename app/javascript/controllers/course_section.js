function editPopup() {
  $("#section-table").on('click', '.edit-section-model',function () {
    let id = $(this).data("section-id");
    let url = $(this).data("url");
    let searchParams = new URLSearchParams(window.location.search);
    let page = parseInt(searchParams.get("page")) || 1;
    let search = searchParams.get("search") || "";
    $("#overlay").show();
    $.ajax({
      method: "GET",
      url: url,
      data: {
        user_id: id,
        page: page,
        search: search,
      },
      headers: {
        Accept: "text/vnd.turbo-stream.html, text/html, application/xhtml+xml",
      },

      success: function (res) {
        Turbo.renderStreamMessage(res);
        $("#overlay").hide();
        editFormValidation();

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
  $("#section-table").on('click', '.send-delete-section',function () {
    let id = $(this).data("section-id");
    let searchParams = new URLSearchParams(window.location.search);
    let page = parseInt(searchParams.get("page")) || 1;
    let search = searchParams.get("search") || "";
    let per_page = parseInt(searchParams.get("per_page")) || 10;

    // Construct the base URL
    let baseUrl = `course_sections/${id}`;

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
    $("#delete-section-model").attr("data-section-id", id);
    $("#delete-section-model").attr("href", baseUrl);
  });
}

function tableSearch() {
  let delayTimer;

  $("#section_search").on("input", function (e) {
    clearTimeout(delayTimer);
    delayTimer = setTimeout(function () {
      let searchValue = $("#section_search").val();
      $("#overlay").show();

      $.ajax({
        url: "/admin/course_sections",
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
          window.history.pushState({ path: newURL }, "", newURL);
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



function formValidation() {

  function validateTitle() {
    let name = $("#section_title").val();

    if (!name) {
        $("#title-error").text("Title can't be blank");
    } 
    else if (name.replace(/ /g, "").length < 3) {
        $("#title-error").text("Title is not valid");
    } 
    else {
        $("#title-error").text("");
    }
  }

  function validateCourse() {
    let courseId = $("#section_course_id").val();

    if (!courseId) {
        $("#course-error").text("Please select a course");
    } 
    else {
        $("#course-error").text("");
    }
  }

  $("#section_title").on("input", validateTitle);
  $("#section_course_id").on("input", validateCourse);  

  $("#section-index-form").on("submit", function (event) {
    validateTitle();
    validateCourse();
    if (
      $("#title-error").text() ||
      $("#course-error").text()
    ) {
      event.preventDefault();
    }
  });
}

// Form reset errors

function resetNewErrorMessages(){
  $("#name-error").text("");
  $("#email-error").text("");
  $("#password-error").text("");
  $("#password-confirmation-error").text("");
}

function resetErrorMessages() {
  $("#edit-name-error").text("");
  $("#edit-email-error").text("");
  $("#edit-password-error").text("");
  $("#edit-password-confirmation-error").text("");
}

function editFormValidation() {

  function validateTitle() {
    let name = $("#edit-section-title").val();

    if (!name) {
        $("#edit-title-error").text("Title can't be blank");
    } 
    else if (name.replace(/ /g, "").length < 3) {
        $("#edit-title-error").text("Title is not valid");
    } 
    else {
        $("#edit-title-error").text("");
    }
  }

  $("#edit-section-popup").on("input", "#edit-section-title", validateTitle);
  
  $("#edit-section-popup").on("submit", "#section-admin-edit-form", function (event) {
    validateTitle();

    if (
      $("#edit-title-error").text()
    ) {
      event.preventDefault();
    }
  });

}

// Form reset Funtion

function resetNewForm(){
  $(".reset-form").on("click", function () {
    $("#section-admin-form")[0].reset()
    resetNewErrorMessages();
  });
  
}

function resetEditForm(){
  $("#modal-close-btn").on("click", function () {
    $("#section-admin-edit-form")[0].reset()
    resetErrorMessages();
  });
}



//click btn hover color

function onclickHover() {
  $(".onclick-hover").on("click", function (event) {
    event.stopPropagation();
    $(this).addClass("click-btn-color");
  });

  $("#create-close-modal").on("click", function () {
    $(".onclick-hover").removeClass("click-btn-color");
  });

  $(document).on("click", function (event) {
    if (!$(event.target).closest('.onclick-hover').length) {
      $(".onclick-hover").removeClass("click-btn-color");
    }
  });
}

function collectionSelect() {
  $(".custom-select").each(function () {
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

$(document).ready(function () {
  editPopup();
  deletePopup();
  tableSearch();
  formValidation();
  onclickHover();
  resetNewForm();
  collectionSelect();

  $(document).on("turbo:render", function () {
    editPopup();
    deletePopup();
    tableSearch();
    formValidation();
    onclickHover();
    resetNewForm();
    collectionSelect();
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

  };
});
