function editPopup() {
  $("#schedule-table").on('click', '.edit-schedule-model', function() {
    let id = $(this).data("schedule-id");
    let url = $(this).data("url");
    let searchParams = new URLSearchParams(window.location.search);
    let page = parseInt(searchParams.get("page")) || 1;
    let search = searchParams.get("search") || "";
    $("#overlay").show();
    $.ajax({
      method: "GET",
      url: url,
      data: {
        schedule_id: id,
        page: page,
        search: search,
      },
      headers: {
        Accept: "text/vnd.turbo-stream.html, text/html, application/xhtml+xml",
      },

      success: function(res) {
        Turbo.renderStreamMessage(res);
        $("#overlay").hide();
        editFormValidation();

      },
      done: function() {},
      error: function() {
        console.log("Error fetching data");
        $("#overlay").hide();
      },
    });
  });
}

function deletePopup() {
  $("#schedule-table").on('click', '.send-delete-schedule', function() {
    let id = $(this).data("schedule-id");
    let searchParams = new URLSearchParams(window.location.search);
    let page = parseInt(searchParams.get("page")) || 1;
    let search = searchParams.get("search") || "";
    let per_page = parseInt(searchParams.get("per_page")) || 10;

    // Construct the base URL
    let baseUrl = `schedules/${id}`;

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
    $("#delete-schedule-model").attr("data-schedule-id", id);
    $("#delete-schedule-model").attr("href", baseUrl);
  });
}


$(document).ready(function() {
  editPopup();
  deletePopup();

  $(document).on("turbo:render", function() {
    editPopup();
    deletePopup();
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