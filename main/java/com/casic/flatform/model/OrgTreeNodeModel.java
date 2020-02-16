package com.casic.flatform.model;

import java.util.ArrayList;
import java.util.List;

/**
 * @author:zhuqz
 * description: 树节点
 * date:2019/12/12 20:30
 **/
public class OrgTreeNodeModel {
    private String label;
    private String id;
    private String pid;
    private String leaf;
    private List<OrgTreeNodeModel> children = new ArrayList<>();
    private boolean isLeaf;

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public List<OrgTreeNodeModel> getChildren() {
        return children;
    }

    public void setChildren(List<OrgTreeNodeModel> children) {
        this.children = children;
    }

    public String getPid() {
        return pid;
    }

    public void setPid(String pid) {
        this.pid = pid;
    }

    public String getLeaf() {
        return leaf;
    }

    public void setLeaf(String leaf) {
        this.leaf = leaf;
    }

    public boolean getIsLeaf() {
        return isLeaf;
    }

    public void setIsLeaf(boolean leaf) {
        isLeaf = leaf;
    }
}
