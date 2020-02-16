package com.casic.flatform.mapper;

import java.util.List;

import com.casic.flatform.model.NodeSnapshotModel;

public interface NodeSnapshotMapper {

	/**
	 * 获得所有节点信息
	 * @return
	 */
	public List<NodeSnapshotModel> queryAllNode();
	
}
