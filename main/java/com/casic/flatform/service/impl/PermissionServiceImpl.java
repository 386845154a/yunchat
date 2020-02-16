package com.casic.flatform.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.casic.flatform.mapper.PermissionMapper;
import com.casic.flatform.model.RoleModel;
import com.casic.flatform.model.RolePermissionModel;
import com.casic.flatform.service.PermissionService;

/**
 * 权限服务
 * @author hanxu
 */
@Service
@Transactional
public class PermissionServiceImpl implements PermissionService {

	@Autowired
	private PermissionMapper permissionMapper;

	/**
	 * 获得全部权限列表
	 * 
	 * @return
	 */
	@Override
	public List<RolePermissionModel> findAllPermission() {
		return permissionMapper.findAllPermission();
	}

	/**
	 * 获得角色权限
	 * @param roleId	:角色id
	 * @return
	 */
	@Override
	public List<RolePermissionModel> rolePermission(String roleId) {
		return permissionMapper.rolePermission(roleId);
	}

	/**
	 * 获得用户角色
	 * @param userId	:用户id
	 * @return
	 */
	@Override
	public List<RoleModel> userRole(String userId) {
		return permissionMapper.userRole(userId);
	} 
	
	/**
	 * 获得用户角色
	 * @param userId
	 * @return
	 */
	@Override
	public String userRoleStr(String userId) {
		List<RoleModel> list = permissionMapper.userRole(userId);
		StringBuffer sb = new StringBuffer();
		for (RoleModel model : list) {
			sb.append(model.getRoleName() + ",");
		}
		return sb.toString();
	}
	
	/**
	 * 修改用户角色
	 * @param userId	:用户id
	 * @param roleIdArray	:新的角色列表
	 * @return
	 * @throws Exception 
	 */
	@Override
	public void updateUserRole(String userId, String[] roleIdArray) throws Exception {
		if (StringUtils.isEmpty(userId) || roleIdArray == null || roleIdArray.length == 0){
			throw new NullPointerException("传入数据为空！");
		}
		//删除用户旧角色
		permissionMapper.deleteUserRole(userId);
		//新增用户新角色
		int count = permissionMapper.insertUserRole(userId, roleIdArray);
		if (count < 1){
			throw new Exception("没有数据被修改!");
		}
	}
	
	/**
	 * 修改角色权限
	 * @param roleId	:角色id
	 * @param permissionIdArray	:权限id数组
	 * @return
	 * @throws Exception 
	 */
	@Override
	public void updateRolePermission(String roleId, String[] permissionIdArray) throws Exception {
		if (StringUtils.isEmpty(roleId) || permissionIdArray == null || permissionIdArray.length == 0){
			throw new NullPointerException("传入数据为空！");
		}
		//删除旧的权限
		permissionMapper.deleteRolePermission(roleId);
		//新增角色权限
		int count = permissionMapper.InsertRolePermission(roleId, permissionIdArray);
		if (count == 0){
			throw new Exception("没有数据被修改!");
		}
	}
	
	/**
	 * 获得用户所有权限
	 * @param userId	:用户id
	 * @return	Map<权限code， 是否拥有权限，true or false>
	 */
	@Override
	public Map<String, Boolean> queryUserPermission(String userId) {
		Map<String, Boolean> permissionMap = new HashMap<> ();
		List<Map<String, Object>> list = permissionMapper.queryUserPermission(userId);
		
		for (Map<String, Object> permission : list){
			if (permission.containsKey("CODE")){
				permissionMap.put(String.valueOf(permission.get("CODE")), true);
//				permissionMap.put(String.valueOf(permission.get("code")), !StringUtils.isEmpty(permission.get("isPermission")));
			}
		}
		
		return permissionMap;
	}
	
}
