function isNotBlank(val) {
    if (val != null && val != "null" && val != undefined && val != "") {
        return true;
    } else {
        return false;
    }
}

/**
 * 列表分页(divId中包含_则为多分页自定义模式)
 *
 * @param divId
 * @param currentPage
 *            当前页
 * @param pageSize
 *            每页数量
 * @param totalNumber
 *            总页数
 * @param func
 *            方法
 * @param view
 *            显示页数
 */
function htmlPage(divId, currentPage, totalNumber, func, pageSize) {
    var v = "";
    if(divId.indexOf("_") != -1){
        v = "_"+divId;
    }else{
        v = "";
    }
    currentPage = parseInt(currentPage);
    totalNumber = parseInt(totalNumber);
    if(pageSize == undefined) pageSize = parseInt($('#pageSelect'+v).val());
    // 如果没有数据，显示共一页
    if (totalNumber == 0) {
        totalNumber = 0;
    }
    var totalPage = Math.floor((totalNumber - (-pageSize) -1)/pageSize);
    // 分页数
    var showPage = '<select id="pageSelect'+v+'" class="form-control input-sm" onchange="'+ func +'(1);" style="width: 55px; float: left; margin: 3px 0px; height: 25px; ">' +
        '<option value="5">5</option><option value="10">10</option><option value="15" selected>15</option><option value="25">25</option><option value="50">50</option><option value="100">100</option>' +
        '</select>';
    // 总条数显示

    var stotal = (currentPage-1)*pageSize;
    var etotal = currentPage*pageSize;
    if(totalNumber < etotal){
        etotal = totalNumber;
    }
    if(totalNumber < pageSize) etotal = totalNumber;
    stotal++;
    showPage += '<div style="float: left; margin: 5px 15px;">显示'+ stotal +'-'+ etotal +'条，共<span> '
        + Math.floor(totalNumber) + ' </span>条<input id="currentPage'+v+'" value="'+ currentPage +'" type="hidden"/></div>';
    if(totalNumber <= pageSize) {
        // 如果总条数小于分页数
        $("#" + divId).html(showPage);
        $('#pageSelect'+v).val(pageSize);
        if(pageSize != undefined) $('#pageSelect'+v).val(pageSize);
        return;
    }
    /**
     * 分页详细
     */
    var view = 5;// 显示多少个页码
    if (!isNotBlank(view)) {
        view = 5;
    }
    showPage += '<ul class="pagination pull-right no-margin">';
    // 首页
    if (totalPage > view && currentPage > Math.floor(view/2)+1) {
        showPage += "<li class=\"paginate_button\"><a href=\"javascript:void(0)\" ";
        showPage += "onclick=\"" + func + "(1)\">首页</a></li>";
    }
    var s = 0; // 从第几个页码开始
    var e = 0; // 到第几个页码结束
    if (Math.floor(currentPage) <= DivMathPage(view, 2) + 1) {
        s = 1;
    } else {
        s = Math.floor(currentPage) - DivMathPage(view, 2);
    }
    if (s + view - 1 >= Math.floor(totalNumber)) {
        e = Math.floor(totalNumber);
    } else {
        e = s + view - 1;
    }
    if (e >= totalPage) {
        s = s-(e-totalPage);
        e = totalNumber;
    }
    if (s <= 0) {
        s = 1;
    }
    // 中间页数
    for ( var i = s; i <= e; i++) {
        if (Math.floor(currentPage) == i) {
            showPage += ' <li class="paginate_button active"><a href="javascript:void(0);" onclick="'
                + func + '(' + i + ')">' + (i) + '</a></li>';
        } else {
            if(i <= totalPage){
                showPage += ' <li class="paginate_button"><a href="javascript:void(0);" onclick="' + func + '('
                    + i + ')">' + (i) + '</a></li>';
            }
        }
    }
    if (totalPage > view && e < totalPage) {
        showPage += "<li class=\"paginate_button\"><a href=\"javascript:void(0)\" ";
        showPage += 'onclick=\"' + func + '(' + totalPage + ')\">尾页</a></li>';
    }
    showPage += '</ul>';
    $("#" + divId).html(showPage);
    $('#pageSelect'+v).val(pageSize);
    $('#currentPage'+v).val(currentPage);
}

/**
 * 整除
 *
 * @param exp1
 * @param exp2
 * @returns {Number}
 */
function DivMathPage(exp1, exp2) {
    var n1 = Math.round(exp1); // 四舍五入
    var n2 = Math.round(exp2); // 四舍五入
    var rslt = n1 / n2; // 除
    if (rslt >= 0) {
        rslt = Math.floor(rslt); // 返回小于等于原rslt的最大整数。
    } else {
        rslt = Math.ceil(rslt); // 返回大于等于原rslt的最小整数。
    }
    return rslt;
}