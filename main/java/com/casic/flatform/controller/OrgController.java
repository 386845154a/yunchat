package com.casic.flatform.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.casic.flatform.model.UserModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.casic.flatform.service.OrgService;
/**
 * 科室控制类
 * 
 * @author zouct
 */
@RestController
@RequestMapping("/orgController")
public class OrgController {

	@Autowired
	private OrgService orgService;

	/**
	 * 获得科室信息
	 * @param request
	 * @param response
	 * @param session
	 * @return
	 */
	@RequestMapping("/queryOrg")
	public Object queryLevel(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		Map<String, Object> map = new HashMap<>();
		map.put("orgList", orgService.queryOrg());
		return map;
	}

	/**
	 * 获得科室信息
	 * @param request
	 * @param response
	 * @param session
	 * @return
	 */
	@RequestMapping("/queryOrgNew")
	public Object queryOrgNew(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		Map<String, Object> map = new HashMap<>();
		String orgsupid = request.getParameter("orgsupid");
        /*UserModel userModel = (UserModel)session.getAttribute("userSessionItems");
		if(orgsupid.equals("all") && userModel!=null){
            orgsupid = this.orgService.queryUserSuperOrgCode(userModel.getUserId());
        }*/
		map.put("orgList", orgService.queryOrgNew(orgsupid));
		return map;
	}
	
	/**
	 * 根据科室ID获取科室名称
	 * @param request
	 * @param response
	 * @param session
	 * @return
	 */
	@RequestMapping("/queryOrgNameById")
	public Object queryOrgNameById(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		String orgId = request.getParameter("orgId");
		return orgService.queryOrgNameById(orgId);
	}
	
	
}
