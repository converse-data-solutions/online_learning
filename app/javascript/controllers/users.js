function editPopup(){
  $(".edit-user-model").click(function(){
    let id = $(this).data('user-id');
    let url = $(this).data('url');
    $.ajax({
      method: 'GET',
      url: url,
      data: {
        user_id: id,
      },
      headers: {
        "Accept": "text/vnd.turbo-stream.html, text/html, application/xhtml+xml",
      },

      success: function(res){
        console.log(res);
        Turbo.renderStreamMessage(res)
      },
      error: function(){
        console.log('Error fetching data');
      }
    });
  });
};

function deletePopup(){
  $(".send-delete-user").click(function(){
    let id = $(this).data('user-id');
    $("#delete-user-model").attr("data-user-id", id);
    $("#delete-user-model").attr("href", `users/${id}`);
  });
}

function tableSearch() {
  $('#user_search').on('input', function() {
    let searchValue = $(this).val();
    $.ajax({
      url: '/admin/users',
      type: 'GET',
      data: { search: searchValue },
      headers: {
        "Accept": "text/vnd.turbo-stream.html, text/html, application/xhtml+xml",
      },
      success: function(res) {
        Turbo.renderStreamMessage(res)
      },
      error: function() {
        console.log('Error fetching data');
      }
    });
  });
};

$(document).ready(function() {
  editPopup();
  deletePopup();
  tableSearch();
  
  $(document).on("turbo:render", function () {
    editPopup();
    deletePopup();
    tableSearch();    
  })
})

// $(document).on("turbo:after-stream-render", function () {
//   console.log("rendered......")
//   initModals()
// })

addEventListener("turbo:before-stream-render", ((event) => {
  console.log("rendered......")

  const fallbackToDefaultActions = event.detail.render

  event.detail.render = function (streamElement) {
    fallbackToDefaultActions(streamElement)
    initModals();
    editPopup();
  }
}));