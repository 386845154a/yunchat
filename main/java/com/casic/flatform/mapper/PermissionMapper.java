package com.casic.flatform.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.casic.flatform.model.RoleModel;
import com.casic.flatform.model.RolePermissionModel;

/**
 * 权限
 * @author hanxu
 */
public interface PermissionMapper {

	/**
	 * 获得全部权限列表
	 * @return
	 */
	public List<RolePermissionModel> findAllPermission();
	
	/**
	 * 获得角色的权限
	 * @param roleId	:角色id
	 * @return
	 */
	public List<RolePermissionModel> rolePermission(String roleId);
	
	/**
	 * 获得用户角色
	 * @param userId	:用户id
	 * @return
	 */
	public List<RoleModel> userRole(String userId);
	
	/**
	 * 删除用户角色
	 * @param userId	:用户id
	 * @return
	 */
	public Integer deleteUserRole(String userId);
	
	/**
	 * 新增用户角色
	 * @param userId	:用户id
	 * @param roleIdArray	:角色id数组
	 * @return
	 */
	public Integer insertUserRole(@Param("userId") String userId, @Param("roleIdArray") String[] roleIdArray);

	/**
	 * 删除角色权限
	 * @param roleId	:角色id
	 * @return
	 */
	public Integer deleteRolePermission(String roleId);

	/**
	 * 新增角色权限
	 * @param roleId	:角色id
	 * @param permissionIdArray	:权限id数组
	 * @return
	 */
	public Integer InsertRolePermission(@Param("roleId") String roleId, @Param("permissionIdArray") String[] permissionIdArray);
	
	/**
	 * 保存token
	 * @param token	:token
	 * @param userId	:userId
	 */
	public Long saveToken(@Param("token") String token, @Param("userId") String userId);

	/**
	 * 删除用户token
	 * @param userId	:用户id
	 * @return
	 */
	public int deleteToken(String userId);
	
	/**
	 * 获得全部权限以及用户拥有的权限
	 * @param userId	:用户id
	 * @return	isPerssion字段包含用户时候含有该权限
	 */
	public List<Map<String, Object>> queryUserPermission(String userId);
}




