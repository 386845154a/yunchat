//时间格式转换
function changeEventDate (date_str){
    var date = new Date(date_str);
    var month  = date.getMonth() + 1;
    var day   = date.getDate();
    var hour  = date.getHours();
    var minute = date.getMinutes();
    return month + '-' + day + '  ' + hour + ':' + minute;
}

//比较日程事件、标记日历
function _event(){
    var dayArr = ',';
    $.ajax({
        type: "post",
        url: '/calendarController/queryDayEvent',
        data: {},
        dataType: 'JSON',
        cache: false,
        async: false,
        success: function(result) {
            var list = result.objectList;
            for(var i in list){
                dayArr += changeEventDate(list[i].savetime).split(" ") + ',';
            }
        }
    });
    return dayArr;
}
var eventDays = _event();

/**
 *
 * @param this_
 * @param href
 * @param start 日期
 */
function addEvent(this_, href, start) {
    $.ajax({
        type: "GET",
        url: 'loadPath',
        data: {'href':href},
        dataType: 'html',
        cache: false,
        async: false,
        success: function(result) {
            DevBox.dialogNoCancel({
                title: '日程事件',
                width:'90%',
                message: result,
                init: function () {
                    $("#notification_div").find("#start").val(start);
                    $('.modal-dialog').attr('width', '80%');
                    // 加载日历
                    queryClickDate();
                    saveLog("clickDate", "查看日程事件");
                },
                confirm : function() {
                    return true;
                },
                cancel_btn: "取消",
                confirm_btn: "关闭"
            });
        }
    });
};

/**
 * 日历
 */
function initDateEvent() {
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    $('#external-events div.external-event').each(function() {
        var eventObject = {
            title: $.trim($(this).text())
        };
        $(this).data('eventObject', eventObject);
        $(this).draggable({
            zIndex: 999,
            revert: true,
            revertDuration: 0
        });
    });
    var calendar =  $('#calendar').fullCalendar({
        header: {
            left: 'title',
            center: 'agendaDay,agendaWeek,month',
            right: 'prev,next today'
        },
        editable: true,
        firstDay: 1,
        selectable: true,
        defaultView: 'month',

        axisFormat: 'h:mm',
        columnFormat: {
            month: 'ddd',
            week: 'ddd d',
            day: 'dddd M/d',
            agendaDay: 'dddd d'
        },
        titleFormat: {
            month: 'MMMM yyyy',
            week: "MMMM yyyy",
            day: 'MMMM yyyy'
        },
        allDaySlot: false,
        selectHelper: true,
        select: function(start, end, allDay) {
            addEvent('schedule', 'modules/calendar/schedule',start);
        },
        droppable: true,
        drop: function(date, allDay) {
            var originalEventObject = $(this).data('eventObject');
            var copiedEventObject = $.extend({}, originalEventObject);
            copiedEventObject.start = date;
            copiedEventObject.allDay = allDay;
            $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);
            if ($('#drop-remove').is(':checked')) {
                $(this).remove();
            }
        },
        events: [
        ],
    });
}

$(document).ready(function() {
    initDateEvent();
});
