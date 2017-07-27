/**
 * Created by zied on 23/07/2017.
 */
var socket = io();
$('#allTasks').addClass('active');
//Inserting the list into the database
$('#SaveChangesButton').click(function () {
    var title = $('#titleInput').val();
    var date = $('#dateInput').val();
    var description = $('#descriptionInput').val();

    socket.emit('save',title,date,description);

    $('#titleInput').val('');
    $('#dateInput').val('');
    $('#descriptionInput').val('');

    $('#myModalHorizontal').modal('hide');

})

//Pencil Button
$('#PencilButton').click(function () {
    var text = $('#DocumentsItem').text();
    var Title = text.substring(text.indexOf(":")+2,text.indexOf(","));
    //var date =
    var description = text.substring(text.lastIndexOf(":")+2,text.lastIndexOf(","));
    $('#titleInput').val(Title);
    $('#descriptionInput').val(description);
})

//delete Button
$('#TrashButton').click(function () {
    var text = $('#DocumentsItem').text();
    alert(text);
})

