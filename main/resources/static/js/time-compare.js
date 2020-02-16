//比较日前大小  
function compareDate(checkStartDate, checkEndDate) {      
    var arys1= new Array();      
    var arys2= new Array();      
    if(checkStartDate != null && checkEndDate != null) {      
	    arys1=checkStartDate.split('-');      
	    var sdate=new Date(arys1[0],parseInt(arys1[1]-1),arys1[2]);      
	    arys2=checkEndDate.split('-');      
	    var edate=new Date(arys2[0],parseInt(arys2[1]-1),arys2[2]);      
	    if(sdate > edate) {      
	    	//alert("日期开始时间大于结束时间");         
	    	return false;         
	    } else {   
		    //alert("通过");   
		    return true;      
	    }   
    }      
}     

//判断日期，时间大小  
function compareTime(startDate, endDate) {   
 if (startDate.length > 0 && endDate.length > 0) {   
    var startDateTemp = startDate.split(" ");   
    var endDateTemp = endDate.split(" ");   

    var arrStartDate = startDateTemp[0].split("-");   
    var arrEndDate = endDateTemp[0].split("-");   

    var arrStartTime = startDateTemp[1].split(":");   
    var arrEndTime = endDateTemp[1].split(":");   

	var allStartDate = new Date(arrStartDate[0], arrStartDate[1], arrStartDate[2], arrStartTime[0], arrStartTime[1], arrStartTime[2]);   
	var allEndDate = new Date(arrEndDate[0], arrEndDate[1], arrEndDate[2], arrEndTime[0], arrEndTime[1], arrEndTime[2]);   

	if (allStartDate.getTime() >= allEndDate.getTime()) {   
        //alert("startTime不能大于endTime，不能通过");   
        return false;   
	} else {   
	    //alert("startTime小于endTime，所以通过了");   
	    return true;   
	       }   
	} else {   
	    alert("时间不能为空");   
	    return false;   
	}   
}   

//比较日期，时间大小  
function compareCalendar(startDate, endDate) { 
	var is_pass = "";
	var page_html = "";
	var indexOf = 0;
	var sys_time_one = "";
	var sys_time_two = "";

    var now = new Date();  
      
    var year = now.getFullYear();       //年  
    var month = now.getMonth() + 1;     //月  
    var day = now.getDate() - 2;        //日  
      
    var hh = now.getHours();            //时  
    var mm = now.getMinutes();          //分  
    var ss = now.getSeconds();          //秒  
      
    var clock = year + "-";  
      
    if(month < 10)  
        clock += "0";  
      
    clock += month + "-";  
      
    if(day < 10)  
        clock += "0";  
          
    clock += day + " ";  
      
    sys_time_two = clock;
    
    if(hh < 10)  
        clock += "0";  
          
    clock += hh + ":";  
    if (mm < 10) clock += '0';   
    clock += mm + ":";   
       
    if (ss < 10) clock += '0';   
    clock += ss;   

    sys_time_one = clock;
    
	if (startDate.indexOf(" ") != -1 && endDate.indexOf(" ") != -1 ) {   
	    //包含时间，日期  
		is_pass = compareTime(startDate, endDate);               
	} else {   
	    //不包含时间，只包含日期  
		is_pass = compareDate(startDate, endDate);   
    }   
	
	return is_pass;
}   
