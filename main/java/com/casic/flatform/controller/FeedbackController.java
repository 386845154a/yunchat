package com.casic.flatform.controller;

import java.io.IOException;
import java.io.OutputStream;
import java.net.URLEncoder;
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
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.casic.flatform.model.FeedBackModel;
import com.casic.flatform.model.UserModel;
import com.casic.flatform.service.FeedbackService;
import com.casic.flatform.service.LoginService;
import com.casic.flatform.util.CatalogExcelUtil;
import com.casic.flatform.util.MyUUID;

@RestController
@RequestMapping("/feedbackController")
public class FeedbackController {
	@Autowired
	private FeedbackService fbackService;
	@Autowired
	private LoginService loginService;
	
	/**
	 * 保存反馈意见
	 * @param request
	 * @param response
	 * @param session
	 * @return
	 */
	@RequestMapping("/savefeedback")
	public Object saveFeedback(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		Map<String, Object> map = new HashMap<>();
		UserModel user = (UserModel) session.getAttribute("userSessionItems");
		String content = request.getParameter("content");
		FeedBackModel fback = new FeedBackModel();
		fback.setFbackId(MyUUID.getUUID());
		fback.setFbackPerson(user.getUserId());
		fback.setFbackContent(content);
		fback.setFbackSolve("0");
		fbackService.saveFeedback(fback);
		map.put("success", true);
		return map;
	}
	
	
	/**
	 * 查询反馈意见
	 * @param request
	 * @param response
	 * @param session
	 * @return
	 */
	@RequestMapping("/queryFeedBackInfo")
	public Object queryFeedBackInfo(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		UserModel login_user = (UserModel) session.getAttribute("userSessionItems");
		String user = "";
		String pageStr = request.getParameter("page");
		String context = request.getParameter("feedBack_context");
		if (!login_user.getAccount().equals("secadm")) {
			user = login_user.getUserId();
		}
		String state = request.getParameter("feedBack_state");
		String startTime = request.getParameter("startTime");
		String endTime = request.getParameter("endTime");
		int page = StringUtils.isEmpty(pageStr) ? 1 : Integer.valueOf(pageStr);
		return fbackService.queryFeedBackInfo(page, context, user, state, startTime, endTime);
	}
	
	/**
	 * 修改反馈意见状态
	 * @param request
	 * @param response
	 * @param session
	 * @return
	 */
	@RequestMapping("/updatefeedback")
	public Object updatefeedback(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		Map<String, Object> map = new HashMap<>();
		String fbackId = request.getParameter("fbackId");
		fbackService.updatefeedback(fbackId);
		map.put("success", true);
		return map;
	}
	
	/**
	 * 为反馈添加回复
	 * @param request
	 * @param response
	 * @param session
	 * @return
	 */
	@RequestMapping("/updateReply")
	public Object updateReply(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		Map<String, Object> map = new HashMap<>();
		String fbackId = request.getParameter("fbackId");
		String replyContext = request.getParameter("replyContext");
		fbackService.updateReply(fbackId, replyContext);
		map.put("success", true);
		return map;
	}
	
	/**
	 * 删除反馈意见状态
	 * @param request
	 * @param response
	 * @param session
	 * @return
	 */
	@RequestMapping("/delfeedback")
	public Object delfeedback(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		Map<String, Object> map = new HashMap<>();
		String fbackId = request.getParameter("fbackId");
		fbackService.delfeedback(fbackId);
		map.put("success", true);
		return map;
	}
	
	/**
	 * 反馈数据导出
	 * @param request
	 * @param response
	 * @param ajaxParams
	 * @return
	 */
	@RequestMapping("/feedBackExcelData")
	@ResponseBody
	public Object groupExcelData(HttpServletRequest request, HttpServletResponse response, String ajaxParams) {
		List<FeedBackModel> feedBackList = new ArrayList<FeedBackModel>();
		feedBackList = fbackService.queryfeedBackInfo();
		// 导出excle表格
		Workbook wb = new HSSFWorkbook();
		//2、在workbook中添加一个sheet，对应Excel文件中的sheet
		String sheetName = "反馈信息";
		Sheet sheet = wb.createSheet(sheetName);
		//3、在sheet中添加表头第0行，注意老版本poi对Excel的行数列数yo
		Row row = sheet.createRow(0);
		CellStyle style = CatalogExcelUtil.getHeadStyle(wb);
		//Excel标题
		String[] title = {"反馈id","反馈内容","反馈人","是否解决","反馈时间","回复信息"};
		// 循环追加表头
		for (int i = 0; i < title.length; i++) {
			CatalogExcelUtil.initCell(row.createCell(i), style, title[i]);
		}
		// 判断字段ID是否在查出的对应数据中
		for (int j = 0; j < feedBackList.size(); j++) {
			row = sheet.createRow(j + 1);
			FeedBackModel stock = feedBackList.get(j);
			UserModel userModel = loginService.querySender(stock.getFbackPerson());
			CatalogExcelUtil.initCell(row.createCell(0), style, stock.getFbackId());
			CatalogExcelUtil.initCell(row.createCell(1), style, stock.getFbackContent());
			CatalogExcelUtil.initCell(row.createCell(2), style, userModel.getFullname());
			if (stock.getFbackSolve().equals("1")) {
				CatalogExcelUtil.initCell(row.createCell(3), style, "解决");
			} else {
				CatalogExcelUtil.initCell(row.createCell(3), style, "未解决");
			}
			if (stock.getFbackTime() != null) {
				SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
				CatalogExcelUtil.initCell(row.createCell(4), style, df.format(stock.getFbackTime()));
			} else {
				CatalogExcelUtil.initCell(row.createCell(4), style, "");
			}
			CatalogExcelUtil.initCell(row.createCell(5), style, stock.getReplyMsg());
		}

		try {
			String filedisplay = "反馈信息.xls";
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
}
