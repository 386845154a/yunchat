package com.casic.flatform.service.impl;

import com.casic.flatform.mapper.ChatListMapper;
import com.casic.flatform.mapper.GroupMapper;
import com.casic.flatform.mapper.OrgMapper;
import com.casic.flatform.mapper.UserMapper;
import com.casic.flatform.model.GroupInfo;
import com.casic.flatform.model.GroupModel;
import com.casic.flatform.model.OrgTreeNodeModel;
import com.casic.flatform.model.UserModel;
import com.casic.flatform.pageModel.OrgUserPageModel;
import com.casic.flatform.service.HomeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class HomeServiceImpl implements HomeService {

	private UserMapper userMapper;
	
	@Autowired
	public HomeServiceImpl(UserMapper userMapper) {
		this.userMapper = userMapper;
	}
	
    @Autowired
    private ChatListMapper chatListMapper;
    @Autowired
	private GroupMapper groupMapper;
    @Autowired
    private OrgMapper orgMapper;
    /**
     * 获得用户信息
     *
     * @param userId :用户id
     * @return
     */
    @Override
    public UserModel queryUserInfo(String userId) {
        return userMapper.queryUserInfo(userId);
    }


    /**
     * 获得最近联系人
     *
     * @param userId :用户id
     * @return
     */
    @Override
    public List<Map<String, Object>> latelyUser(String userId, String r, String s) {
        int page = Integer.parseInt(r);
        int size = Integer.parseInt(s);

        HashMap parm = new HashMap();
        parm.put("userId", userId);
        parm.put("start", (size * (page - 1)+1));
        parm.put("end", page*size);
        return chatListMapper.latelyUser(parm);
    }

    /**
     * 获得单位用户(不包含当前用户)
     *
     * @param userId :用户id
     * @return
     */
    @Override
    public List<OrgUserPageModel> orgUser(String userId, String level, String inputValue) {
        return chatListMapper.allOrgUserNoLogUser(userId, level, inputValue);
    }

    /**
     * 获得单位用户
     *
     * @param userId :用户id
     * @return
     */
    @Override
    public List<OrgUserPageModel> orgUser() {
        return chatListMapper.allOrgUser();
    }

    /**
     * 获得用户所在的所有讨论组
     *
     * @param userId ：用户id
     * @return
     */
    @Override
    public List<Map<String, Object>> groupByUserId(String userId, String level) {
        Map parm = new HashMap();
        parm.put("userId", userId);
        parm.put("level", level);
        return chatListMapper.groupByUserId(parm);
    }

    @Override
    public List<GroupInfo> groupByUserIdNew(String userId) {
        return chatListMapper.groupByUserIdNew(userId);
    }


    /**
     * 加载科员
     *
     * @param orgId :部门id
     * @return
     */
    @Override
    public List<UserModel> queryClassUser(String orgId) {
        return userMapper.queryClassUser(orgId);
    }

    /**
     * 删除最近联系人\讨论组
     *
     * @param userId
     * @param id
     * @param type
     * @return
     */
    @Override
    public void delLink(String userId, String id, String type) {
        userMapper.delLink(userId, id, type);
    }

    /**
     * 模糊查询联系人
     *
     * @param name :姓名
     * @return
     */
    @Override
    public List<UserModel> getUserByName(String name) {
        return userMapper.getUserByName(name);
    }
    
    /**
     * 修改用户信息
     *
     * @param userId
     * @param phone
     * @param roomid
     * @return
     */
    @Override
    public void updataUserInfo(String userId, String phone, String roomid) {
        userMapper.updataUserInfo(userId, phone, roomid);
    }
    /**
     * 根据密级获取用户
     * @param userId
     * @param levels
     * @return
     */
    @Override
    public List<OrgUserPageModel> queryOrgUserBylevels(String userId, String levels) {
       return chatListMapper.queryOrgUserBylevels(userId, levels);
    }

    /**
     * 根据密级组织获取用户
     * @param userId
     * @param levels
     * @return
     */
    @Override
    public List<OrgUserPageModel> queryOrgUserBylevelsOrgID(String userId, String levels,String orgid) {
        return chatListMapper.queryOrgUserBylevelsOrgID(userId, levels,orgid);
    }

    /**
     * 根据密级和部门获取用户
     */
	@Override
	public List<UserModel> getALLUserByOrg(String userId, String orgId, String levels) {
		return userMapper.getALLUserByOrg(userId, orgId, levels);
	}

	/**
	 * queryGandP
	 * @param name
	 * @return
	 */
	@Override
	public List<GroupModel> queryGandP(String pname) {
        return chatListMapper.queryGandP(pname);
	}

	/**
	 * 根据名称模糊获取研讨组-20190129
	 * @param userId
	 * @param name
	 * @return
	 */
	@Override
	public List<GroupModel> getGroupByName(String userId, String name) {
		return groupMapper.getGroupByName(userId, name);
	}

    /**
     * 查询树结构
     * @return
     */
	@Override
    public  List<OrgTreeNodeModel> getOrgData(String excludeUserId){
        List<OrgTreeNodeModel> res = this.orgMapper.getOrgData(excludeUserId);
        this.dealOrgData(res);
         return  res;
    }
    /**
     * 查询树结构
     * @return
     */
    @Override
    public  List<OrgTreeNodeModel> getOrgDataByUserName(String excludeUserId,String userName){
        List<OrgTreeNodeModel> res = this.orgMapper.getOrgDataByUserName(excludeUserId,userName);
        this.dealOrgData(res);
        return  res;
    }

    //处理树结构数据
    public void dealOrgData(List<OrgTreeNodeModel> res){
        for(int i=res.size()-1;i>=0;i--){
            OrgTreeNodeModel node = res.get(i);
            //把没有人员的节点删除
            //如果不是人员
            if(!"2".equals(node.getLeaf())){
                //如果没有子节点删除
                if(node.getChildren()==null || node.getChildren().size()==0){
                    res.remove(i);
                    continue;
                }
            }
            /*//如果是第一层节点，不用再去寻找父节点
            if(node.getPid().equals("0000")){
                //因为按照层级排序，不必再去遍历
                break;
            }*/
            for(int j=i-1;j>=0;j--){
                OrgTreeNodeModel node2 = res.get(j);
                if(node.getPid().equals(node2.getId())){
                    node2.getChildren().add(0,node);
                    res.remove(i);
                    break;
                }
            }
        }
    }
    @Override
    public List<OrgTreeNodeModel> getOrgDataByPid(String pid){
        return this.orgMapper.getOrgDataByPid(pid);
    }
    @Override
    public List<OrgTreeNodeModel> getUserDataByPid(String pid,String excludeUserId){
        return this.orgMapper.getUserDataByPid(pid,excludeUserId);
    }
}
