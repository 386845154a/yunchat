var dataX = new Array();
var dataY = new Array();
var loginChart = echarts.init(document.getElementById('login'));
var createGroup = echarts.init(document.getElementById('createGroup'));
var orglogin= echarts.init(document.getElementById('orgLogin'));

$(function(){


});


window.addEventListener("resize", () => {
    this.loginChart.resize();
    this.createGroup.resize();
    this.orglogin.resize();
});

function searchInfo() {
    var logdate = document.getElementById('search').value;
    // 异步加载数据
    queryLogin(logdate,'');
    orgLogin(logdate,'');
    createGroupChart(logdate,'');
    // alert(a);
}
// 天登陆人次统计
function queryLogin(logdate,logtype) {
    AjaxMethod.ajax("StatisticsController/queryLogin", {
        'logdate' : logdate,
        'logtype' : 'createGroup',
    }).then(function (result){
        data = result;
        for (var i=0;i<result.length;i++)
        {
            dataX.push(result[i].logdate);
            dataY.push(result[i].num);
        }

        var option = {
            title: {
                text: '创建组',
                left:'center'
            },
            tooltip: {},
            // legend: {
            //     data:['人数']
            // },
            xAxis: {
                data: dataX
            },
            yAxis: {},
            series: [{
                name: '人数',
                type: 'bar',
                data: dataY
            }]
        };
        createGroup.setOption(option);
        dataX=[];
        dataY=[];
    });
}
//部门月登录人次统计
function orgLogin(logdate,logtype) {
    AjaxMethod.ajax("StatisticsController/orgLogin", {
        'logdate' : logdate,
        'logtype' : 'login',
    }).then(function (result){
        data = result;
        for (var i=0;i<result.length;i++)
        {
            dataX.push(result[i].logdate);
            dataY.push(result[i].num);
        }

        var option = {
            title: {
                text: '部门登录人次',
                left:'center'
            },
            tooltip: {},
            // legend: {
            //     data:['人数']
            // },
            xAxis: {
                data: dataX
            },
            yAxis: {},
            series: [{
                name: '人',
                type: 'bar',
                data: dataY
            }]
        };
        orglogin.setOption(option);
        dataX=[];
        dataY=[];
    });
}
//研讨组创建统计
function createGroupChart(logdate,logtype) {
    AjaxMethod.ajax("StatisticsController/queryLogin", {
        'logdate' : logdate,
        'logtype' : 'login',
    }).then(function (result){
        data = result;
        for (var i=0;i<result.length;i++)
        {
            dataX.push(result[i].logdate);
            dataY.push(result[i].num);
        }

        var option = {
            title: {
                text: '登录人次',
                left:'center'
            },
            tooltip: {},
            // legend: {
            //     data:['人数']
            // },
            xAxis: {
                data: dataX
            },
            yAxis: {},
            series: [{
                name: '人数',
                type: 'bar',
                data: dataY
            }]
        };
        loginChart.setOption(option);
        dataX=[];
        dataY=[];
    });
}

