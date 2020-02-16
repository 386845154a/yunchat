$(function (){
    getGlobal();//获取全局积分排名
    getDevotion();//获取奉献积分排名
    getInnovate();//获取创新积分排名
    getBereal();//获取求实积分排名
    getLoginId();//获取当前登录人ID
});

//获取当前登录人ID
function getLoginId() {
	AjaxMethod.ajax('homeController/getNewPersonName', {}).then(function (result){
		gerMyScore(result.Id);//获取个人积分
	});
}


// var Date =[{
//     "id": 1,
//     "name": "姬航",
//     "lab": "十一室",
//     "score": 321
// },{
//     "id": 2,
//     "name": "几行",
//     "lab": "十一室",
//     "score": 321
// },{
//     "id": 3,
//     "name": "几行",
//     "lab": "十一室",
//     "score": 321
// },{
//     "id": 4,
//     "name": "几行",
//     "lab": "十一室",
//     "score": 321
// },{
//     "id": 5,
//     "name": "姬航",
//     "lab": "十一室",
//     "score": 321
// },{
//     "id": 6,
//     "name": "几行",
//     "lab": "十一室",
//     "score": 321
// },{
//     "id": 7,
//     "name": "几行",
//     "lab": "十一室",
//     "score": 321
// },{
//     "id": 8,
//     "name": "几行",
//     "lab": "十一室",
//     "score": 321
// },{
//     "id": 9,
//     "name": "姬航",
//     "lab": "十一室",
//     "score": 321
// },{
//     "id": 10,
//     "name": "几行",
//     "lab": "十一室",
//     "score": 321
// },{
//     "id": 11,
//     "name": "几行",
//     "lab": "十一室",
//     "score": 321
// },{
//     "id": 12,
//     "name": "几行",
//     "lab": "十一室",
//     "score": 321
// },{
//     "id": 13,
//     "name": "姬航",
//     "lab": "十一室",
//     "score": 321
// },{
//     "id": 14,
//     "name": "几行",
//     "lab": "十一室",
//     "score": 321
// },{
//     "id": 15,
//     "name": "几行",
//     "lab": "十一室",
//     "score": 321
// },{
//     "id": 16,
//     "name": "几行",
//     "lab": "十一室",
//     "score": 321
// },{
//     "id": 17,
//     "name": "姬航",
//     "lab": "十一室",
//     "score": 321
// },{
//     "id": 18,
//     "name": "几行",
//     "lab": "十一室",
//     "score": 321
// },{
//     "id": 19,
//     "name": "几行",
//     "lab": "十一室",
//     "score": 321
// },{
//     "id": 20,
//     "name": "几行",
//     "lab": "十一室",
//     "score": 321
// }] ;

//获取全局积分排名
function getGlobal() {
    var Date ='';
    $.ajax({
        url: "http://10.12.97.30:8080/newnewcosim-master_war/coin/rank.ht?sourceType=quanju",
        type: "GET",
        dataType: "jsonp", //????????????
        success: function (data) {
            if(data == ''){}
            else {
                // debugger;
                // var result = JSON.parse(data);
                $("#Global tbody").prepend(addRankde(data));
            }

        }
    });


}

//获取奉献积分排名
function getDevotion() {
    var Date ='';
    $.ajax({
        url: "http://10.12.97.30:8080/newnewcosim-master_war/coin/rank.ht?sourceType=fengxian",
        type: "GET",
        dataType: "jsonp", //????????????
        success: function (data) {
            if(data == ''){}
            else {

                $("#Devotion tbody").prepend(addRankde(data));
            }
        }
    });

}

//获取创新积分排名
function getInnovate() {
    var Date ='';
    $.ajax({
        url: "http://10.12.97.30:8080/newnewcosim-master_war/coin/rank.ht?sourceType=chuangxin",
        type: "GET",
        dataType: "jsonp", //????????????
        success: function (data) {
            if(data == ''){}
            else {
                $("#Innovate tbody").prepend(addRankde(data));
            }
        }
    });

}

//获取求实积分排名
function getBereal() {
    var Date ='';
    $.ajax({
        url: "http://10.12.97.30:8080/newnewcosim-master_war/coin/rank.ht?sourceType=qiushi",
        type: "GET",
        dataType: "jsonp", //????????????
        success: function (data) {
            if(data == ''){}
            else {
                $("#Bereal tbody").prepend(addRankde(data));
            }
        }
    });
}


//获取个人积分
function gerMyScore(userid){
    var pGlobal="";
    var pDevotion="";
    var pInnovate="";
    var pBereal="";
    $.ajax({
        url: "http://10.12.97.30:8080/newnewcosim-master_war/coin/personalScore.ht?account="+userid,
        type: "GET",
        dataType: "jsonp", //????????????
        success: function (data) {
//            console.log(JSON.stringify(data));
//            debugger;
            pGlobal += "月|"+data[0].quanjuMonthScore+"积分/"+data[0].quanjuMonthCoin+"币" +"|年|"+data[0].quanjuTotalScore+"积分/"+data[0].quanjuTotalCoin+"币";
            pDevotion += "月|"+data[0].fengxianMonthScore+"积分/"+data[0].fengxianMonthCoin+"币" +"|年|"+data[0].fengxianTotalScore+"积分/"+data[0].fengxianTotalCoin+"币";
            pInnovate += "月|"+data[0].chuangxinMonthScore+"积分/"+data[0].chuangxinMonthCoin+"币" +"|年|"+data[0].chuangxinTotalScore+"积分/"+data[0].chuangxinTotalCoin+"币";
            pBereal += "月|"+data[0].qiushiMonthScore+"积分/"+data[0].qiushiMonthCoin+"币" +"|年|"+data[0].qiushiTotalScore+"积分/"+data[0].qiushiTotalCoin+"币";
//            console.log(pGlobal);
            document.getElementById("pGlobal").innerHTML="<b>"+pGlobal+"</b>";
            document.getElementById("pDevotion").innerHTML="<b>"+pDevotion+"</b>";
            document.getElementById("pInnovate").innerHTML="<b>"+pInnovate+"</b>";
            document.getElementById("pBereal").innerHTML="<b>"+pBereal+"</b>";
        },
        error: function(err){
		}
    });

}

// 插入积分排行
function addRankde(Date) {
    var pagedata = '';
//    console.log(Date);
    if (Date == '')
    {
        return pagedata;
    }
    else {
            $.each(Date, function (n, resut) {

                switch (resut.rank)  {
                    case 1:
                        pagedata += ("<tr><td class=\"rk1\"></td>");
                        break;
                    case 2:
                        pagedata += ("<tr><td class=\"rk2\"></td>");
                        break;
                    case 3:
                        pagedata += ("<tr><td class=\"rk3\"></td>");
                        break;
                    default:
                        pagedata += ("<tr><td>"+ resut.rank+ "</td>");
                        break;
                }
                pagedata += ("<td>" + resut.userName+ "</td>");
                pagedata += ("<td>" + resut.orgName+ "</td>");
                pagedata += ("<td>" + resut.scoreTotal+ "</td>");
                pagedata += ("</tr>");
            });
            return pagedata;
        }
}
