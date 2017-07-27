/**
 * Created by zied on 27/07/2017.
 */
var socket = io();
$('#currentTasks').addClass('active');

//Funtion that returns current date yyyy-mm-dd
function currentDate() {
    var date = new Date();
    var month = date.getUTCMonth() + 1;
    var day = date.getUTCDate();
    var year = date.getUTCFullYear();
    if(month.length!=2)
        month="0"+month;
    var newdate = year+"-"+month+"-"+day;
    return newdate;
}

// set the model date to the current date
$('#buttonNewTask').click(function () {
    var current = currentDate()
    $('#dateInput').val(current);
})

//set le list group item header date
$('#HeaderDate').val("okoko");
