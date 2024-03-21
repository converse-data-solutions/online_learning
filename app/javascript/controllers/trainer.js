function editModelPopup() {
  $(".edit-trainer-model").click(function() {
    let id = $(this).data("trainer-id");
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

      success: function(res) {
        Turbo.renderStreamMessage(res);
        $("#overlay").hide();
        editFormValidation();
      },
      error: function() {
        console.log("Error fetching data");
        $("#overlay").hide();
      },
    });
  });
}

function deletePopup() {
  $(".send-delete-trainer").click(function() {
    let id = $(this).data("trainer-id");
    let searchParams = new URLSearchParams(window.location.search);
    let page = parseInt(searchParams.get("page")) || 1;
    let search = searchParams.get("search") || "";
    let per_page = parseInt(searchParams.get("per_page")) || 10;

    let delUrl = `trainers/${id}`;

    if (search !== 1) {
      delUrl += `?page=${page}`;
    }

    if (search !== "") {
      delUrl += (page === 1 ? "?" : "&") + `search=${search}`;
    }

    if (per_page !== 10) {
      delUrl += page === 1 && search === "" ? "?" : "&";
      delUrl += `per_page=${per_page}`;
    }

    $("#delete-trainer-model").attr("data-trainer-id", id);
    $("#delete-trainer-model").attr("href", delUrl);
  });
}

function viewStudents() {
  $(".view-trainer-model").click(function() {
    let id = $(this).data("trainer-id");
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
      success: function(res) {
        Turbo.renderStreamMessage(res);
        $("#overlay").hide();
      },
      error: function() {
        console.log("Error fetching data");
        $("#overlay").hide();
      },
    });
  });
}

function trainerSearch() {
  let delayTimer;

  $("#trainer_search").keyup(function(e) {
    clearTimeout(delayTimer);
    delayTimer = setTimeout(function() {
      let searchValue = $("#trainer_search").val();
      $("#overlay").show();
      $.ajax({
        url: "/admin/trainers",
        type: "GET",
        data: {
          search: searchValue,
        },
        headers: {
          Accept: "text/vnd.turbo-stream.html, text/html, application/xhtml+xml",
        },
        success: function(res) {
          Turbo.renderStreamMessage(res);
          let newURL =
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname +
            "?search=" +
            encodeURIComponent(searchValue);
          window.history.pushState({
              path: newURL,
            },
            "",
            newURL
          );
          $("#overlay").hide();
        },
        error: function() {
          console.log("Error fetching data");
          $("#overlay").hide();
        },
      });
    }, 500);
  });
}

$(document).ready(function() {
  editModelPopup();
  deletePopup();
  viewStudents();
  trainerSearch();

  $(document).on("turbo:render", function() {
    editModelPopup();
    deletePopup();
    trainerSearch();
    
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
    editModelPopup();
    deletePopup();
    viewStudents();
  };
});