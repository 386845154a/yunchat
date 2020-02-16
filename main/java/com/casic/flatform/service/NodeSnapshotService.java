package com.casic.flatform.service;

import java.util.List;
import java.util.Map;

import com.casic.flatform.model.NodeSnapshotModel;

public interface NodeSnapshotService {
	/**
	 * 获得节点图标的信息
	 * 
	 * @return
	 */
	Map<Long, List<NodeSnapshotModel>> queryCharData();

}
