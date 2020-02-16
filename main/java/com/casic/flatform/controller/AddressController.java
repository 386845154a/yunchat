package com.casic.flatform.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.casic.flatform.model.OrgModel;
import com.casic.flatform.model.TreeModel;
import com.casic.flatform.service.AddressService;

/**
 * 组织架构
 * @author hanxu
 */
@RestController
@RequestMapping("/addressController")
public class AddressController extends BaseController{

	@Autowired
	private AddressService addressService;
	
	/**
	 * 获得单位列表
	 * @return
	 */
	@RequestMapping("/queryOrg")
	public List<TreeModel> queryOrg(HttpServletRequest request, HttpServletResponse response) {
		
		return addressService.queryTreeList();
	}
	
	/**
	 * 通过科室ID获取科室信息
	 * @return
	 */
	@RequestMapping("/getOrgById")
	public OrgModel getOrgById(HttpServletRequest request, HttpServletResponse response) {
		String orgId = request.getParameter("orgId");
		return addressService.getOrgById(orgId);
	}
	
	/**
	 * 分页获得单位的用户
	 * @return
	 */
	@RequestMapping("/queryUser")
	public Object queryUser(HttpServletRequest request, HttpServletResponse response) {
		Map<String, Object> resultMap = new HashMap<> (); 
		String pageStr = request.getParameter("page");
		String orgId = request.getParameter("orgId");
		int page = StringUtils.isEmpty(pageStr) ? 1 : Integer.valueOf(pageStr);
		return addressService.queryOrgUser(page, orgId);
	}
	
}
