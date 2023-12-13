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
      dataType: 'script',
      success: function() {
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