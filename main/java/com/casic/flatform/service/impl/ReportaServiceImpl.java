package com.casic.flatform.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.casic.flatform.controller.LogController;
import com.casic.flatform.mapper.GroupMapper;
import com.casic.flatform.mapper.MessageMapper;
import com.casic.flatform.mapper.UserMapper;
import com.casic.flatform.model.*;
import com.casic.flatform.service.FlagService;
import com.casic.flatform.service.ReportaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Pattern;

/**
 * @author 忠
 * @Description
 * @date 2018-12-14 11:27
 */
@Service
@Transactional
public class ReportaServiceImpl implements ReportaService {

    @Autowired
    private MessageMapper messageMapper;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private GroupMapper groupMapper;
    @Autowired
    private FlagService flagService;

    @Value("${report.cosim}")
    private String cosim;
    @Value("${report.search}")
    private String search;
    @Value("${report.knowledge}")
    private String knowledge;

    @Override
    public Object getReportOthers(String userid) {
        ReportDataModel reportData =  messageMapper.getReportData(userid);
        DecimalFormat df = new DecimalFormat("0.0000");
        double radarTalk = (double)reportData.getPersonalDiscuss()/(double)reportData.getPersonalDiscussSum() *0.2
                +(double)reportData.getGroupDiscuss()/(double)reportData.getGroupDiscussSum()*0.3
                + (double)reportData.getCreatDiscuss()/(double)reportData.getCreatDiscussSum() * 0.5;
        double radarTool =(double)reportData.getUploadfile()/(double)reportData.getUploadfileSum()*0.5
                +(double)reportData.getDownloadfile()/(double)reportData.getDownloadfileSum()*0.5;
        double talkSum = reportData.getCreatDiscuss() + reportData.getGroupDiscuss();
        if (Double.isNaN(radarTalk)) {
            radarTalk = 0;
        }
        if (Double.isNaN(radarTool)) {
            radarTool = 0;
        }
        SimpleDateFormat fdate = new SimpleDateFormat("yyyy年MM月dd日");
        Map <String, Object> ReportData = new HashMap<String, Object>();
        ReportData.put("radarTool", Double.parseDouble(df.format(radarTool)));//雷达图工具
        ReportData.put("radarTalk", Double.parseDouble(df.format(radarTalk)));//雷达图研讨
        ReportData.put("head", reportData.getHead());//头像
        ReportData.put("userId", userid);//头像
        if (reportData.getFirstBlood() == null) {
            ReportData.put("firstblood", "null");//一血
        }else{
            ReportData.put("firstblood", fdate.format(reportData.getFirstBlood()));//一血
        }
        ReportData.put("talkSum", talkSum);//总聊天
        return ReportData;
    }

    @Override
    public Object getStarfriends(String userid) {
        List<StatisticsModel> msglist =  messageMapper.queryMsgCount(userid);
        if (msglist.size()>0) {
            int maxnum = 0;//最大次数
            String friendsId = "";//好友ID
            Date date = new Date();
            SimpleDateFormat fdate = new SimpleDateFormat("yyyy-MM-dd");
            for (int i = 0; i < msglist.size(); i++) {
                if (msglist.get(i).getNum() > maxnum) {
                    maxnum = msglist.get(i).getNum();
                    friendsId = msglist.get(i).getLogdate();
                }
            }
            List<String> content  = new ArrayList<>();
            List<Content> msgcontent = messageMapper.queryMsgContent(userid,friendsId);
            for (int i = 0; i < msgcontent.size(); i++) {
                if (!date.before(msgcontent.get(i).getDate())) {
                    date = msgcontent.get(i).getDate();
                }
                content.add(msgcontent.get(i).getContent().replaceAll("[^\\u4E00-\\u9FA5]",""));
            }

            int filenum = messageMapper.queryMsgFileCount(userid,friendsId);
            UserModel user = userMapper.queryUserInfo(friendsId);
            JSONObject jsonObj = new JSONObject();
            Map <String, Object> Starfriends = new HashMap<String, Object>();
            Starfriends.put("userid", user.getUserId());//星好友名称
            Starfriends.put("name", user.getFullname());//星好友名称
            Starfriends.put("date", fdate.format(date));//初次邂逅时间
            Starfriends.put("time", maxnum);//沟通次数
            Starfriends.put("file", filenum);//文件交流次数
            Starfriends.put("content", content);//聊天内容
            jsonObj.put("Starfriends", Starfriends);
            return Starfriends;
        }else {
            List<String> content = new ArrayList();
            Map <String, Object> Starfriends = new HashMap<String, Object>();
            Starfriends.put("userid", "无");//星好友名称
            Starfriends.put("name", "无");//星好友名称
            Starfriends.put("date", "无");//初次邂逅时间
            Starfriends.put("time", "无");//沟通次数
            Starfriends.put("file", "无");//文件交流次数
            Starfriends.put("content",content);//聊天内容
            return Starfriends;
        }

    }

    @Override
    public Object getBestTeams(String userid) {
        List<StatisticsModel> grolist = groupMapper.queryGroupMsgByUserId(userid);
        if (grolist.size()>0) {
            String groupId = ""; // 最佳群组id
            int msgNum = 0;//最佳群组交流消息数
            for (int i = 0; i < grolist.size(); i++) {
                if (grolist.get(i).getNum() > msgNum) {
                    msgNum = grolist.get(i).getNum();
                    groupId = grolist.get(i).getLogdate();
                }
            }
            GroupInfoModel groupInfoModel = groupMapper.queryGroupInfo(groupId);
            int fileNum = groupMapper.queryGroupFilenum(groupId);
            List<String> content = new ArrayList();
            List<GroupMsgModel> groupMsgModelList = groupMapper.queryGInfo(groupId);
            for (int i = 0; i < groupMsgModelList.size(); i++) {
//                if (!groupMsgModelList.get(i).getMsg().contains("table")||!groupMsgModelList.get(i).getMsg().contains("class=")||!groupMsgModelList.get(i).getMsg().contains("div")||!groupMsgModelList.get(i).getMsg().contains("onclick")||!groupMsgModelList.get(i).getMsg().contains("img")) {
                content.add(groupMsgModelList.get(i).getMsg().replaceAll("[^\\u4E00-\\u9FA5]",""));
//                }
            }

            String data = new SimpleDateFormat("yyyy-MM-dd").format(groupInfoModel.getCreateTime());
            JSONObject jsonObj = new JSONObject();
            Map <String, Object> BestTeams = new HashMap<String, Object>();
            BestTeams.put("userid", groupInfoModel.getGroupId());//最佳群id
            BestTeams.put("name",groupInfoModel.getGroupName() );//群名称
            BestTeams.put("date", data);//创建时间
            BestTeams.put("time",msgNum );//沟通次数
            BestTeams.put("file",fileNum );//文件交流次数
            BestTeams.put("content", content);//聊天内容
            jsonObj.put("BestTeams",BestTeams);
            return BestTeams;
        }else {
            List<String> content = new ArrayList();
            Map <String, Object> BestTeams = new HashMap<String, Object>();
            BestTeams.put("userid","无");//最佳群id
            BestTeams.put("name","无");//群名称
            BestTeams.put("date","无");//创建时间
            BestTeams.put("time","无" );//沟通次数
            BestTeams.put("file","无" );//文件交流次数
            BestTeams.put("content",content);//聊天内容
            return BestTeams;
        }
    }

    @Override
    public JSONObject getReport(String userid) {
        FlagModel flagModel =  flagService.getFlagByUserId(userid);
        if (flagModel.getReport().equals("2")) {
            JSONObject jsonObj = new JSONObject();
            jsonObj.put("success","success");
            return jsonObj;
        }
        try {
            JSONObject jsonObj = new JSONObject();
            System.out.println("BestTeams");
            jsonObj.put("BestTeams",getBestTeams(userid));
            System.out.println("Starfriends");
            jsonObj.put("Starfriends", getStarfriends(userid));
            System.out.println("ReportOthers");
            jsonObj.put("ReportOthers", getReportOthers(userid));
            System.out.println("Cosim");
            jsonObj.put("Cosim", JSON.parseObject(LogController.interfaceUtil(cosim, "uid=" + userid)));
            System.out.println("Search");
            JSONObject Search = JSON.parseObject(LogController.interfaceUtil(search, "IDNumber=" + userid));
            jsonObj.put("Search", Search);
            System.out.println("KnowledgeBehavior");
            JSONObject knowledgeBehavior = JSON.parseObject(LogController.interfaceUtil(knowledge, "formvalue="+ userid));
            jsonObj.put("KnowledgeBehavior",knowledgeBehavior);
            System.out.println(jsonObj);
            jsonObj.put("success","success");
            return jsonObj;
        }catch (Exception e) {
            JSONObject jsonObj = new JSONObject();
            e.printStackTrace();
            jsonObj.put("success","error");
            return jsonObj;
        }
    }
}
