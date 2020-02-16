package com.casic.flatform.service.impl;

import java.util.HashMap;
import java.util.Map;

import javax.jws.WebService;
import javax.xml.ws.Endpoint;

import org.nutz.dao.entity.annotation.Comment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSONObject;
import com.casic.flatform.model.OrgModel;
import com.casic.flatform.model.UserModel;
import com.casic.flatform.service.AddressService;
import com.casic.flatform.service.DataInterfaces;
import com.casic.flatform.service.HomeService;
import com.casic.flatform.util.Xml2Json;

@WebService(endpointInterface = "com.casic.flatform.service.impl.DataInterfacesImpl")
@Component
public class DataInterfacesImpl implements DataInterfaces {

	@Value("${datainterfaces}")
	private String datainterfaces;
	@Autowired
	private HomeService homeService;
	@Autowired
	private AddressService addressService;

	public DataInterfacesImpl() {
//		Endpoint.publish("http://10.12.97.99:7777/DataInterfaces", this);
	}

	/**
	 * 根据XML文件自动创建用户和科室
	 * 
	 * @return
	 * @throws Exception
	 */
	@Override
	public Object addUser(String xmlFile) throws Exception {
		// TD:增加用户更新判断
		// 判断系统内是否存在该用户，如果存在跟新字段，不存在则新建
		// 增加用户序号字段
		Map<String, Object> map = new HashMap<>();
		String trueOrFalse = "";
		// 解析xml获取文件内容，并转换为json格式
		JSONObject json = new JSONObject();
		json = Xml2Json.xml2Json(xmlFile);
		String saveType = (String) json.get("mdtype");
		System.out.println(saveType);
		if (saveType.equals("User")) {
			System.err.println("用户表");
			JSONObject userJson = new JSONObject();
			userJson = (JSONObject) json.get("data");
			System.out.println(userJson.get("User"));
			JSONObject infoJson = new JSONObject();
			infoJson = (JSONObject) userJson.get("User");
			String userId = (String) infoJson.get("identityNo");// 用户ID
			String name = (String) infoJson.get("name");// 用户姓名
			String deptCode = (String) infoJson.get("deptCode");// 部门ID
			String endFlag = (String) infoJson.get("endFlag");// 是否离职
			String level = (String) infoJson.get("psnSecretLevelCode");// 用户等级
			String pictures = (String) infoJson.get("xh");// 用户排序
			Integer picture = Integer.valueOf(pictures);
			String levels = "1";
			switch (level) {
			case "60":
				levels = "1";
				break;
			case "65":
				levels = "2";
				break;
			case "70":
				levels = "3";
				break;
			case "80":
				levels = "4";
				break;
			case "90":
				levels = "4";
				break;
			default:
				levels = "1";
				break;
			}
			try {
				UserModel user = homeService.queryUserInfo(userId);
				if (user == null) {
					if (endFlag.equals("0")) {
						addressService.createUser(userId, name, deptCode, endFlag, "0", levels, picture);
						System.out.println("增加人员" + name);
					} else {
						trueOrFalse = "true";
					}
				} else {
					// if (endFlag.equals("0")) {
					addressService.updateUser(userId, name, deptCode, endFlag, "0", levels, picture);
					System.out.println("更新人员" + name);
					// } else {
					// addressService.delUser(userId);
					// System.out.println("删除人员"+user.getFullname());
					// trueOrFalse = "true";
					// }
				}
				trueOrFalse = "true";
				map.put("ok", true);
			} catch (Exception ex) {
				ex.printStackTrace();
				trueOrFalse = "false";
				map.put("ok", false);
			}

		} else if (saveType.equals("Organization")) {
			System.err.println("群组表");
			JSONObject orgJson = new JSONObject();
			orgJson = (JSONObject) json.get("data");
			System.out.println(orgJson.get("Organization"));
			JSONObject infoJson = new JSONObject();
			infoJson = (JSONObject) orgJson.get("Organization");
			System.err.println(infoJson.get("orgName"));
			String orgId = (String) infoJson.get("mdCode");
			String orgName = (String) infoJson.get("orgName");
			Long orgSupId = (long) 1000;
			try {
				OrgModel orgInfo = addressService.getOrgById(orgId);
				if (orgInfo == null) {
					addressService.createOrg(orgId, orgName, orgSupId);
				} else {
					addressService.updateOrg(orgId, orgName, orgSupId);
				}
				trueOrFalse = "true";
				map.put("ok", true);
			} catch (Exception ex) {
				ex.printStackTrace();
				trueOrFalse = "false";
				map.put("ok", false);
			}
		} else if(saveType.equals("Person")){
			JSONObject userJson = new JSONObject();
			userJson = (JSONObject) json.get("data");
			JSONObject infoJson = new JSONObject();
			infoJson = (JSONObject) userJson.get("User");
			String userId = (String) infoJson.get("identityNo");// 用户ID
			String endFlag = (String) infoJson.get("endFlag");// 是否离职
			String hrPsnCode = (String) infoJson.get("hrPsnCode");// 是否离职
			UserModel user = homeService.queryUserInfo(userId);

			if (user == null) {

			} else {
				 if (endFlag.equals("0")) {
					addressService.updateUserHrcode(userId,hrPsnCode);
				 }
			}

			System.err.println("用户详细信息表");
		}
		return trueOrFalse;
	}
}