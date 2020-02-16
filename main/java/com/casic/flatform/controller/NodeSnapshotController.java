package com.casic.flatform.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.casic.flatform.service.NodeSnapshotService;

/**
 * 节点
 * @author hanxu
 */
@RestController
@RequestMapping("/nodeSnapshot")
public class NodeSnapshotController {
	
	@Autowired
	private NodeSnapshotService nodeSnapshotService;

	/**
	 * 获得图表上的节点信息
	 * @return
	 */
	@RequestMapping("/queryAllNode")
	public Object queryAllNode() {
		
		return nodeSnapshotService.queryCharData();
	}
	
	
}



