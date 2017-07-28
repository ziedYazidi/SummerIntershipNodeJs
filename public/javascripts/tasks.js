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
    $('#titleInput2').val(Title);
    $('#descriptionInput2').val(description);
    $('#SaveChangesButton2').click(function () {
        var titre=$('#titleInput2').val(Title);
        var desc=$('#descriptionInput2').val(description);
        socket.emit('update',title,description,titre,desc);
    })

})

//delete Button
$('#TrashButton').click(function () {
    var text = $('#DocumentsItem').text();
    alert(text);
})

