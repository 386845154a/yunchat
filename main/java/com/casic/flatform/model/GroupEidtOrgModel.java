package com.casic.flatform.model;

public class GroupEidtOrgModel {
    private String name;
    private String id;
    private String pid;
    private Boolean checked;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPid() {
        return pid;
    }

    public void setPid(String pid) {
        this.pid = pid;
    }

    public Boolean getChecked() {
        return checked;
    }

    public void setChecked(Boolean checked) {
        this.checked = checked;
    }

    @Override
    public String toString() {
        return "{" +
                "name:\"" + name + '\"' +
                ", id:\"" + id + '\"' +
                ", pId:\"" + pid + '\"' +
                ", checked:" + checked +
                '}';
    }
}
