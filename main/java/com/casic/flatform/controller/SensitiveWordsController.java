package com.casic.flatform.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.casic.flatform.model.SensitiveWordModel;
import com.casic.flatform.model.UserModel;
import com.casic.flatform.service.SensitiveWordsService;

/**
 * 组织架构
 * @author hanxu
 */
@RestController
@RequestMapping("/sensitiveWordsController")
public class SensitiveWordsController extends BaseController{

	@Autowired
	private SensitiveWordsService sensitiveService;
	
	/**
	 * 分页获得敏感词列表
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("/querySensitiveWords")
	public Object querySensitiveWords(HttpServletRequest request, HttpServletResponse response) {
		Map<String, Object> resultMap = new HashMap<> ();
		
		String word = super.getStringParameter(request, "word");
		Integer page = super.getIntegerParameter(request, "page", 1);
		Integer rows = super.getIntegerParameter(request, "rows", 1);
		
		resultMap.put("dataList", sensitiveService.querySensitiveWordList(word, page, rows));
		resultMap.put("count", sensitiveService.querySensitiveWordCount(word));
		return resultMap;
	}

	/**
	 * 更新敏感词
	 * @return
	 */
	@RequestMapping("/editSensitiveWord")
	public Object editSensitiveWord(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		UserModel user = (UserModel) session.getAttribute("userSessionItems");
		
		String id = super.getStringParameter(request, "id");
		String sensitiveWord = super.getStringParameter(request, "sensitiveWord");
		String replaceWord = super.getStringParameter(request, "replaceWord");
		String isAvailable = super.getStringParameter(request, "isAvailable");
		
		SensitiveWordModel model = new SensitiveWordModel();
		model.setId(id);
		model.setSensitiveWord(sensitiveWord);
		model.setReplaceWord(replaceWord);
		model.setIsAvailable(isAvailable);
		model.setUpdator(user.getUserId());
		
		sensitiveService.updateSensitiveWord(model);

		//更新缓存中敏感词
		sensitiveService.updateSensitiveWordMap();
		return true;
	}
	
	/**
	 * 新增敏感词
	 * @return
	 */
	@RequestMapping("/saveSensitiveWord")
	public Object saveSensitiveWord(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		UserModel user = (UserModel) session.getAttribute("userSessionItems");
		
		String sensitiveWord = super.getStringParameter(request, "sensitiveWord");
		String replaceWord = super.getStringParameter(request, "replaceWord");
		String isAvailable = super.getStringParameter(request, "isAvailable");
		
		SensitiveWordModel model = new SensitiveWordModel();
		long id = (long)(Math.random() * 1000000);
		model.setId(String.valueOf(id));
		model.setSensitiveWord(sensitiveWord);
		model.setReplaceWord(replaceWord);
		model.setIsAvailable(isAvailable);
		model.setCreator(user.getUserId());
		
		sensitiveService.saveSensitiveWord(model);
		//更新缓存中敏感词
		sensitiveService.updateSensitiveWordMap();
		return true;
	}
	
	/**
	 * 删除敏感词
	 * @return
	 */
	@RequestMapping("/deleteSensitiveWord")
	public Object deleteSensitiveWord(HttpServletRequest request, HttpServletResponse response) {
		String idArray = super.getStringParameter(request, "id");
		List<Long> idList = new ArrayList<> ();
		for (String idStr : idArray.split(",")) {
			if (!StringUtils.isEmpty(idStr)) {
				idList.add(Long.valueOf(idStr));
			}
		}
		sensitiveService.deleteSensitiveWord(idList);

		//更新缓存中敏感词
		sensitiveService.updateSensitiveWordMap();
		return true;
	}
	
	/**
	 * 获得敏感词信息
	 * @return
	 */
	@RequestMapping("/querySensitiveWord")
	public Object querySensitiveWord(HttpServletRequest request, HttpServletResponse response) {
		String id = super.getStringParameter(request, "id");
		
		return sensitiveService.querySensitiveWord(id);
	}
	
	/**
	 * 验证敏感词是否已存在
	 * @return
	 */
	@RequestMapping("/checkSensitiveWord")
	public Object checkSensitiveWord(HttpServletRequest request, HttpServletResponse response) {
		
		String sensitiveWord = super.getStringParameter(request, "sensitiveWord");
		
		Long id = super.getLongParameter(request, "id");
		return sensitiveService.checkSensitiveWord(id, sensitiveWord);
		
	}
	
}




