function editEnquirePopup() {
  $("#enquire-table").on("click", ".edit-enquire-model", function () {
    let id = $(this).data("enquire-id");
    let url = $(this).data("url");
    let searchParams = new URLSearchParams(window.location.search);
    let page = parseInt(searchParams.get("page")) || 1;
    let search = searchParams.get("search") || "";
    $("#overlay").show();
    $.ajax({
      method: "GET",
      url: url,
      data: {
        enquire_id: id,
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

function viewEnquirePopup() {
  $("#enquire-table").on("click", ".view-enquire-model", function () {
    let id = $(this).data("enquire-id");
    let url = $(this).data("url");
    let searchParams = new URLSearchParams(window.location.search);
    let page = parseInt(searchParams.get("page")) || 1;
    let search = searchParams.get("search") || "";
    $("#overlay").show();
    $.ajax({
      method: "GET",
      url: url,
      data: {
        enquire_id: id,
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

function deleteEnquirePopup() {
  $("#enquire-table").on("click", ".send-delete-enquire", function () {
    let id = $(this).data("enquire-id");
    let searchParams = new URLSearchParams(window.location.search);
    let page = parseInt(searchParams.get("page")) || 1;
    let search = searchParams.get("search") || "";
    let per_page = parseInt(searchParams.get("per_page")) || 10;

    let delUrl = `enquires/${id}`;

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

    $("#delete-enquire-model").attr("data-enquire-id", id);
    $("#delete-enquire-model").attr("href", delUrl);
  });
}

$(document).ready(function() {
  editEnquirePopup();
  viewEnquirePopup();
  deleteEnquirePopup();

  $(document).on("turbo:render", function() {
    editEnquirePopup();
    viewEnquirePopup();
    deleteEnquirePopup();
    
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
    

  };
});