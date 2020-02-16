package com.casic.flatform.model;

/**
 * pf_role_permission
 * 
 * @author hanxu
 */
public class RolePermissionModel {

	private Long permissionId;
	private String permissionName;
	private String code;

	public Long getPermissionId() {
		return permissionId;
	}

	public void setPermissionId(Long permissionId) {
		this.permissionId = permissionId;
	}

	public String getPermissionName() {
		return permissionName;
	}

	public void setPermissionName(String permissionName) {
		this.permissionName = permissionName;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

}
