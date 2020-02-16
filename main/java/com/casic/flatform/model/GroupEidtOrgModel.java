package com.casic.flatform.model;

public class GroupEidtOrgModel {
    private String name;
    private String id;
    private String Pid;
    private String checked;

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
        return Pid;
    }

    public void setPid(String Pid) {
        this.Pid = Pid;
        this.Pid = Pid;
    }

    public String getChecked() {
        return checked;
    }

    public void setChecked(String checked) {
        this.checked = checked;
    }

    @Override
    public String toString() {
        return "{" +
                "name:\"" + name + '\"' +
                ", id:\"" + id + '\"' +
                ", pId:\"" + Pid + '\"' +
                ", checked:" + checked +
                '}';
    }
}
