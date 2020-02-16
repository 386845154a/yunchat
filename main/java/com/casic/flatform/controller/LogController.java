package com.casic.flatform.controller;

import java.io.*;
import java.net.*;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.casic.flatform.model.LogModel;
import com.casic.flatform.model.UserModel;
import com.casic.flatform.service.LogService;
import com.casic.flatform.util.CatalogExcelUtil;
import com.casic.flatform.util.MyUUID;

/**
 * @author zouct
 */
@RestController
@RequestMapping("/logController")
public class LogController {
	
	@Autowired
	private LogService logService;
	@Value("${cosimlog}")
	private String cosimlog;

	/**
	 * 查询日志信息
	 * @param request
	 * @param response
	 * @param session
	 * @return
	 */
	@RequestMapping("/queryLog")
	public Object queryLog(HttpServletRequest request, HttpServletResponse response,
			HttpSession session) {
		String pageStr = request.getParameter("page");
		String content = request.getParameter("logContent");
		String startTime = request.getParameter("startTime");
		String endTime = request.getParameter("endTime");
		String fullName = request.getParameter("fullName");
		int page = StringUtils.isEmpty(pageStr) ? 1 : Integer.valueOf(pageStr);
		return logService.queryLog(page, content, startTime, endTime, fullName);
	}
	
	/**
	 * 查询安全日志信息
	 * @param request
	 * @param response
	 * @param session
	 * @return
	 */
	@RequestMapping("/querySecadm")
	public Object querySecadm(HttpServletRequest request, HttpServletResponse response,
			HttpSession session) {
		String pageStr = request.getParameter("page");
		String content = request.getParameter("logContent");
		String startTime = request.getParameter("startTime");
		String endTime = request.getParameter("endTime");
		String fullName = request.getParameter("fullName");
		int page = StringUtils.isEmpty(pageStr) ? 1 : Integer.valueOf(pageStr);
		return logService.querySecadm(page, content, startTime, endTime, fullName);
	}
	
	/**
	 * 查询日志创建人
	 * @param request
	 * @param response
	 * @param session
	 * @return
	 */
	@RequestMapping("/queryUserInfo")
	public Object queryUserInfo(HttpServletRequest request, HttpServletResponse response,
			HttpSession session) {
		String userId = request.getParameter("userId");
		UserModel user = logService.queryUserInfo(userId);
		return user.getFullname();
	}
		
	/**
	 * 库存数据导出
	 * @param request
	 * @param response
	 * @param ajaxParams
	 * @return
	 */
	@RequestMapping("/logExcelData")
	@ResponseBody
	public Object groupExcelData(HttpServletRequest request, HttpServletResponse response, String ajaxParams) {
		List<LogModel> logList = new ArrayList<LogModel>();
		logList = logService.query_LogInfo();
		// 导出excle表格
		Workbook wb = new HSSFWorkbook();
		//2、在workbook中添加一个sheet，对应Excel文件中的sheet
		String sheetName = "日志信息";
		Sheet sheet = wb.createSheet(sheetName);
		//3、在sheet中添加表头第0行，注意老版本poi对Excel的行数列数yo
		Row row = sheet.createRow(0);
		CellStyle style = CatalogExcelUtil.getHeadStyle(wb);
		//Excel标题
		String[] title = {"日志Id","日志类型","日志内容","创建时间","创建人"};
		// 循环追加表头
		for (int i = 0; i < title.length; i++) {
			CatalogExcelUtil.initCell(row.createCell(i), style, title[i]);
		}
		// 判断字段ID是否在查出的对应数据中
		for (int j = 0; j < logList.size(); j++) {
			row = sheet.createRow(j + 1);
			LogModel stock = logList.get(j);
			CatalogExcelUtil.initCell(row.createCell(0), style, stock.getLogId());
			CatalogExcelUtil.initCell(row.createCell(1), style, stock.getType());
			CatalogExcelUtil.initCell(row.createCell(2), style, stock.getContent());
			if (stock.getCreateTime() != null) {
				SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
				CatalogExcelUtil.initCell(row.createCell(3), style, df.format(stock.getCreateTime()));
			} else {
				CatalogExcelUtil.initCell(row.createCell(3), style, "");
			}
			CatalogExcelUtil.initCell(row.createCell(4), style, stock.getCreater());
		}

		try {
			String filedisplay = "日志信息.xls";
			// 输出Excel文件
			OutputStream output = response.getOutputStream();
			response.reset();
			String agent = request.getHeader("USER-AGENT");
			if (agent != null && agent.toLowerCase().indexOf("firefox") > 0) {
				filedisplay = new String(filedisplay.getBytes("UTF-8"), "ISO-8859-1");
			} else {
				filedisplay = URLEncoder.encode(filedisplay, "UTF-8");
			}
			response.setContentType("application/msexcel;");
			response.setHeader("Content-disposition", "attachment; filename=" + filedisplay);
			
			wb.write(output);

			output.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return true;
	}
	
	/**
	 * 保存日志
	 * @param request
	 * @param response
	 * @param session
	 * @return
	 * @throws UnknownHostException 
	 */
	@RequestMapping("/saveLog")
	public Object saveLog(HttpServletRequest request, HttpServletResponse response, HttpSession session) throws IOException {
		Map<String, Object> map = new HashMap<>();
		UserModel user = (UserModel) session.getAttribute("userSessionItems");
		String fileId = request.getParameter("fileId");
		String ip = request.getHeader("clientip");
		String local_ip = InetAddress.getLocalHost().getHostAddress();
		String type = request.getParameter("msgType");
		String content = request.getParameter("msgContent");
		LogModel log = new LogModel();
		log.setLogId(MyUUID.getUUID());
		log.setType(type);
		log.setContent(content);
		log.setAddress(local_ip);
		log.setCreater(user.getUserId());
		log.setFullName(user.getFullname());
//		interfaceUtil(cosimlog,"logType="+type+"&logContent="+content+"&logUser="+user.getAccount()+"&logIP="+ip+"&logFrom=iwork");
		if (type.equals("toolsFileDown")) {
			log.setToolid(fileId);
			logService.saveToolLog(log);
		} else {
			logService.saveLog(log);
		}
		map.put("success", true);
		return map;
	}

	/**
	 * 调用对方接口方法
	 * @param path 对方或第三方提供的路径
	 * @param data 向对方或第三方发送的数据，大多数情况下给对方发送JSON数据让对方解析
	 */
	public static String  interfaceUtil(String path,String data) throws IOException {
		String str = "";
		URL url = new URL(path);
		//打开和url之间的连接
		HttpURLConnection conn = (HttpURLConnection) url.openConnection();
		PrintWriter out = null;
		//请求方式
		conn.setRequestMethod("POST");
//           //设置通用的请求属性
		conn.setRequestProperty("accept", "*/*");
		conn.setRequestProperty("connection", "Keep-Alive");
		conn.setRequestProperty("user-agent", "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1)");
		conn.addRequestProperty("Charset","UTF-8");//设置字符编码类型
//		conn.setRequestProperty("Content-type","application/x-javascript->json");//json格式数据
		conn.addRequestProperty("Content-Type","application/x-www-form-urlencoded");//默认浏览器编码类型，
		//设置是否向httpUrlConnection输出，设置是否从httpUrlConnection读入，此外发送post请求必须设置这两个
		//最常用的Http请求无非是get和post，get请求可以获取静态页面，也可以把参数放在URL字串后面，传递给servlet，
		//post与get的 不同之处在于post的参数不是放在URL字串里面，而是放在http请求的正文内。
		conn.setDoOutput(true);
		conn.setDoInput(true);
		//获取URLConnection对象对应的输出流
		out = new PrintWriter(conn.getOutputStream());
		//发送请求参数即数据
		out.print(data);
		//缓冲数据
		out.flush();
		//获取URLConnection对象对应的输入流
		InputStream is = conn.getInputStream();
		//构造一个字符流缓存
		BufferedReader br = new BufferedReader(new InputStreamReader(is));

		while ((str = br.readLine()) != null) {
//			System.out.println(str);
			return str;
		}
		//关闭流
		is.close();
		//断开连接，最好写上，disconnect是在底层tcp socket链接空闲时才切断。如果正在被其他线程使用就不切断。
		//固定多线程的话，如果不disconnect，链接会增多，直到收发不出信息。写上disconnect后正常一些。
		conn.disconnect();
		return null;
	}

	/**
	 * 调用对方接口方法
	 * @param path 对方或第三方提供的路径
	 * @param data 向对方或第三方发送的数据，大多数情况下给对方发送JSON数据让对方解析
	 */
	public static String  interfaceUtil1(String path,String data) throws IOException {
		String str = "";
		URL url = new URL(path);
		//打开和url之间的连接
		HttpURLConnection conn = (HttpURLConnection) url.openConnection();
		PrintWriter out = null;
		//请求方式
		conn.setRequestMethod("POST");
//           //设置通用的请求属性
		conn.setRequestProperty("accept", "*/*");
		conn.setRequestProperty("connection", "Keep-Alive");
		conn.setRequestProperty("user-agent", "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1)");
		conn.addRequestProperty("Charset","UTF-8");//设置字符编码类型
		conn.setRequestProperty("Content-type","application/x-javascript->json");//json格式数据
//		conn.addRequestProperty("Content-Type","application/x-www-form-urlencoded");//默认浏览器编码类型，
		//设置是否向httpUrlConnection输出，设置是否从httpUrlConnection读入，此外发送post请求必须设置这两个
		//最常用的Http请求无非是get和post，get请求可以获取静态页面，也可以把参数放在URL字串后面，传递给servlet，
		//post与get的 不同之处在于post的参数不是放在URL字串里面，而是放在http请求的正文内。
		conn.setDoOutput(true);
		conn.setDoInput(true);
		//获取URLConnection对象对应的输出流
		out = new PrintWriter(conn.getOutputStream());
		//发送请求参数即数据
		out.print(data);
		//缓冲数据
		out.flush();
		//获取URLConnection对象对应的输入流
		InputStream is = conn.getInputStream();
		//构造一个字符流缓存
		BufferedReader br = new BufferedReader(new InputStreamReader(is));

		while ((str = br.readLine()) != null) {
//			System.out.println(str);
			return str;
		}
		//关闭流
		is.close();
		//断开连接，最好写上，disconnect是在底层tcp socket链接空闲时才切断。如果正在被其他线程使用就不切断。
		//固定多线程的话，如果不disconnect，链接会增多，直到收发不出信息。写上disconnect后正常一些。
		conn.disconnect();
		return null;
	}
}
