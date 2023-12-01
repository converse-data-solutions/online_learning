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

function selectFilter() {
  $(".filter-handle").on("change", function () {
    console.log("filtered");
    var location = $(this).val();
    var table = $(".filter-table-data");

    if (location.length) {
      table.find("tr[data-type!=" + location + "]").hide();
      table.find("tr[data-type=" + location + "]").show();
    } else {
      table.find("tr").show();
    }
  });
}

// Form submission
function sectionNewForm(){
$("#section-form").submit(function(event) {
  event.preventDefault();

  $.ajax({
    url: $("#section-form").attr("action"),
    type: $("#section-form").attr("method"),
    data: new FormData($("#section-form")[0]),
    processData: false,
    contentType: false,
    success: function(response) {
     
      location.reload();
    },
    error: function(error) {
    }
  });
});
}

function sectionEditForm(){
$("#section-edit-form").submit(function(event) {
  event.preventDefault();

  $.ajax({
    url: $("#section-edit-form").attr("action"),
    type: $("#section-edit-form").attr("method"),
    data: new FormData($("#section-edit-form")[0]),
    processData: false,
    contentType: false,
    success: function(response) {

      location.reload();
    },
    error: function(error) {
    }
  });
});
}

$(document).ready(function () {
  collectionSelect();
  selectFilter();
  sectionNewForm();
  sectionEditForm();

  $(document).on("turbo:render", function () {
    selectFilter();
    sectionNewForm();
    sectionEditForm();
  });
});

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
