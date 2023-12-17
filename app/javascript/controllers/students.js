console.log('Loaded students.js');
function editModelPopup(){
  $(".edit-student-model").click(function(){
    let id = $(this).data('user-id');
    console.log(id);
    let url = $(this).data('url');
    console.log(url);
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
        console.log(res);
      },
      error: function(){
        console.log('Error fetching data');
      }
    });
  });
};

function deletePopup(){
  console.log("processed.....");
  $(".send-delete-student").click(function(){
    console.log("processed Loading.....");
    let id = $(this).data('user-id');
    $("#delete-student-model").attr("data-user-id", id);
    $("#delete-student-model").attr("href", `students/${id}`);
  });
}

function studentTableSearch() {
  $('#student_search').on('input', function() {
    let searchValue = $(this).val();
    $.ajax({
      url: '/admin/students',
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
  editModelPopup();
  deletePopup();
  studentTableSearch();
  
  $(document).on("turbo:render", function () {
    editModelPopup();
    deletePopup();
    studentTableSearch()
  })
})



addEventListener("turbo:before-stream-render", ((event) => {

  const fallbackToDefaultActions = event.detail.render

  event.detail.render = function (streamElement) {
    fallbackToDefaultActions(streamElement)
    initModals();
    editModelPopup();
  }
}));