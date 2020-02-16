package com.casic.flatform.service;

import com.alibaba.fastjson.JSONObject;
import com.casic.flatform.model.StarfriendsModel;

import java.util.List;

/**
 * @author 忠
 * @Description
 * @date 2018-12-14 11:26
 */
public interface ReportaService {

    /**
     * 获得星好友
     * @param userid
     * @return
     */
    Object getStarfriends(String userid);

    /**
     * 获得最佳团队
     * @param userid
     * @return
     */
    Object getBestTeams(String userid);
    /**
     * 获得年报数据
     * @param userid
     * @return
     */
    JSONObject getReport(String userid);

    Object getReportOthers(String userid);

}
