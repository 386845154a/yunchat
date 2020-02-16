package com.casic.flatform.service;

import java.util.List;
import java.util.Map;

import com.casic.flatform.model.RoleModel;
import com.casic.flatform.model.RolePermissionModel;

public interface PermissionService {

	/**
	 * 获得全部权限列表
	 * 
	 * @return
	 */
	public List<RolePermissionModel> findAllPermission();

	/**
	 * 获得角色权限
	 * 
	 * @param roleId
	 * @return
	 */
	public List<RolePermissionModel> rolePermission(String roleId);

	/**
	 * 获得用户角色
	 * 
	 * @param userId
	 *            :用户id
	 * @return
	 */
	public List<RoleModel> userRole(String userId);

	/**
	 * 修改用户角色
	 * 
	 * @param userId
	 *            :用户id
	 * @param roleIdArray
	 *            :新的角色列表
	 * @return
	 */
	public void updateUserRole(String userId, String[] roleIdArray) throws Exception;

	/**
	 * 修改角色权限
	 * 
	 * @param roleId
	 *            :角色id
	 * @param permissionIdArray
	 *            :权限id数组
	 * @return
	 * @throws Exception
	 */
	public void updateRolePermission(String roleId, String[] permissionIdArray) throws Exception;

	/**
	 * 获得用户所有权限
	 * 
	 * @param userId
	 *            :用户id
	 * @return Map<权限code， 是否拥有权限，true or false>
	 */
	public Map<String, Boolean> queryUserPermission(String userId);
	/**
	 * 获得用户角色
	 * @param userId
	 * @return
	 */
	String userRoleStr(String userId);

}
