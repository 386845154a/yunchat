package com.casic.flatform.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.casic.flatform.mapper.NodeSnapshotMapper;
import com.casic.flatform.model.NodeSnapshotModel;
import com.casic.flatform.service.NodeSnapshotService;

/**
 * 节点信息
 * 
 * @author hanxu
 */
@Service
@Transactional
public class NodeSnapshotServiceImpl implements NodeSnapshotService {

	@Autowired
	private NodeSnapshotMapper nodeSnapshotMapper;

	/**
	 * 获得节点图标的信息
	 * @return
	 */
	@Override
	public Map<Long, List<NodeSnapshotModel>> queryCharData() {

		List<NodeSnapshotModel> nodeList = nodeSnapshotMapper.queryAllNode();
		// 节点列表转换为map,key为父节点id，父节点id相同的在一个list中
		Map<Long, List<NodeSnapshotModel>> nodeMap = new HashMap<>();
		for (NodeSnapshotModel node : nodeList) {
			Long id = node.getSource();
			if (nodeMap.containsKey(id)) {
				nodeMap.get(id).add(node);
			} else {
				List<NodeSnapshotModel> list = new ArrayList<>();
				list.add(node);
				nodeMap.put(id, list);
			}
		}

		return nodeMap;
	}

}
