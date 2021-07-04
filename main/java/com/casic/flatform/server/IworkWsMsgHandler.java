package com.casic.flatform.server;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.casic.flatform.model.GroupInfo;
import com.casic.flatform.service.GroupService;
import com.casic.flatform.service.HomeService;
import com.casic.flatform.service.PrivateMsgService;
import com.casic.flatform.vo.message.MsgInfoModel;
import com.casic.flatform.vo.message.ToMsgInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.tio.core.ChannelContext;
import org.tio.core.Tio;
import org.tio.http.common.HttpRequest;
import org.tio.http.common.HttpResponse;
import org.tio.websocket.common.WsRequest;
import org.tio.websocket.common.WsResponse;
import org.tio.websocket.common.WsSessionContext;
import org.tio.websocket.server.handler.IWsMsgHandler;

import javax.annotation.PostConstruct;
import java.util.List;
import java.util.Objects;

@Component
public class IworkWsMsgHandler implements IWsMsgHandler {
    private static Logger log = LoggerFactory.getLogger(IworkWsMsgHandler.class);

    @Autowired
    protected PrivateMsgService privateMsgService;
    @Autowired
    protected GroupService groupService;
    @Autowired
    protected HomeService homeService;

    private static IworkWsMsgHandler  serverHandler ;

    @PostConstruct //通过@PostConstruct实现初始化bean之前进行的操作
    public void init() {
        serverHandler = this;
        serverHandler.privateMsgService = this.privateMsgService;
        serverHandler.groupService = this.groupService;
        serverHandler.homeService = this.homeService;
        // 初使化时将已静态化的Service实例化
    }

    public static final IworkWsMsgHandler me = new IworkWsMsgHandler();

    private IworkWsMsgHandler() {

    }

    /**
     * 握手时走这个方法，业务可以在这里获取cookie，request参数等
     */
    @Override
    public HttpResponse handshake(HttpRequest request, HttpResponse httpResponse, ChannelContext channelContext) throws Exception {
        String clientip = request.getClientIp();
        //todo 前端握手加上userInf信息 包含user全部信息
        //todo 改成从userInf获取
        String userid=request.getParam("userId");
        //推送前端上线消息
//        AnswerToFrontReponse answerToFrontReponse = new AnswerToFrontReponse();
//        answerToFrontReponse.setCode(MessageType.LINESTATUS);
//        UserOnOffLineVo userOnOffLineVo = new UserOnOffLineVo();
//        userOnOffLineVo.setLineCode(MessageType.ONLINE+"");
//        userOnOffLineVo.setUserId(userid);
//        answerToFrontReponse.setData(userOnOffLineVo);
//        Tio.sendToAll(channelContext.getTioConfig(),
//                WsResponse.fromText(JSON.toJSONString(answerToFrontReponse,
//                        SerializerFeature.DisableCircularReferenceDetect), IworkServerConfig.CHARSET));
//      获取用户在线信息，如在线，踢掉他
//      checkUserOnline(channelContext,userid);
        //todo 改成从userInf获取orgCode
        // TODO: 2020/2/16 获取用户群组信息，绑定他
        String orgCode=request.getParam("orgCode");
//      加入组织
        Tio.bindGroup(channelContext,orgCode);
//      前端 参数 绑定信息
        Tio.bindBsId(channelContext,userid);
        Tio.bindUser(channelContext,userid);
        //把用户的socke通道放入全局变量
        Tio.bindGroup(channelContext, Const.GROUP_SYS);
//        IworkSocketChannel.setUserChannelContext(userid,channelContext);
//       根据握手信息，将用户绑定到群组
        if(userid!=null && !"".equals(userid)){

        }
       List<GroupInfo> groupInfos =  serverHandler.homeService.groupByUserIdNew(userid);
        //List<String> grouplist =  serverHandler.userGroupService.getGroupByUserId(userid);
        groupInfos.stream().forEach((GroupInfo i) ->{
            Tio.bindGroup(channelContext,i.getId());
        });
//        加入会议
//        //List<String> meetlist =  serverHandler.meetingUserService.getMeetingByUserId(userid);
//        List<String> meetlist = new ArrayList<>();
//        meetlist.stream().forEach((String i) ->{
//            Tio.bindGroup(channelContext,i);
//        });*/
//        ProcessLogin.setOnLineSatus(channelContext.getBsId(), MessageType.ONLINE);
//        log.info("收到来自{}的ws握手包\r\n{}", clientip, request.toString());
        return httpResponse;
    }

    @Override
    public void onAfterHandshaked(HttpRequest httpRequest, HttpResponse httpResponse, ChannelContext channelContext) throws Exception {
        //绑定到群组，后面会有群发
//        Tio.bindGroup(channelContext, Const.GROUP_ID);
//        int count = Tio.getAllChannelContexts(channelContext.tioConfig).getObj().size();
//        String msg = "{name:'admin',message:'" + channelContext.userid + " 进来了，共【" + count + "】人在线" + "'}";
        //用tio-websocket，服务器发送到客户端的Packet都是WsResponse
//        WsResponse wsResponse = WsResponse.fromText(msg, IworkServerConfig.CHARSET);
        //群发
//        Tio.sendToGroup(channelContext.tioConfig, Const.GROUP_ID, wsResponse);
    }

    /**
     * 字节消息（binaryType = arraybuffer）过来后会走这个方法
     */
    @Override
    public Object onBytes(WsRequest wsRequest, byte[] bytes, ChannelContext channelContext) throws Exception {
        return null;
    }

    /**
     * 当客户端发close flag时，会走这个方法
     */
    @Override
    public Object onClose(WsRequest wsRequest, byte[] bytes, ChannelContext channelContext) throws Exception {
        String userId = channelContext.getBsId();
        //删除全局map里对应用户的值
//        IworkSocketChannel.removeUserChannelContext(channelContext.getBsId());
        Tio.remove(channelContext, "receive close flag");
        //设置用户离线
        return null;
    }

    /*
     * 字符消息（binaryType = blob）过来后会走这个方法
     */
    @Override
    public Object onText(WsRequest wsRequest, String text, ChannelContext channelContext) throws Exception {
        WsSessionContext wsSessionContext = (WsSessionContext) channelContext.getAttribute();
        HttpRequest httpRequest = wsSessionContext.getHandshakeRequest();//获取websocket握手包

        //获取前端消息 展示
        if (log.isDebugEnabled()) {
            log.debug("握手包:{}", httpRequest);
        }

        log.info("收到ws消息:{}", text);

        if (Objects.equals("心跳内容", text)) {
            return null;
        }
        // TODO: 2020/2/7 测试代码，在这里写服务端返回数据
//        Tio.sendToIp(channelContext.getTioConfig(),"127.0.0.1",
//                WsResponse.fromText("2123324","utf-8"));

        /**消息收到确认应答end*/

        // TODO: 2020/2/16 处理system消息 群组变更信息


        /**消息解析begin*/
        MsgInfoModel msgInfoModel = (MsgInfoModel) JSON.parseObject(text,MsgInfoModel.class);
        switch (msgInfoModel.getType()){
            case "friend":
                ToMsgInfo toMsgInfo = serverHandler.privateMsgService.savePrivateMsg(msgInfoModel);
                WsResponse wsResponse = WsResponse.fromText(JSON.toJSONString(toMsgInfo), IworkServerConfig.CHARSET);
                Tio.sendToUser(channelContext.getTioConfig(),msgInfoModel.getData().getTo().getId(),wsResponse);
                break;
            case "group":
//                ToMsgInfo toMsgInfo = serverHandler.groupService.(msgInfoModel);
//                WsResponse wsResponse = WsResponse.fromText(JSON.toJSONString(toMsgInfo), IworkServerConfig.CHARSET);
//                Tio.sendToUser(channelContext.getTioConfig(),msgInfoModel.getData().getTo().getId(),wsResponse);
                break;
            case "system":
                Tio.bindGroup(channelContext,msgInfoModel.getData().getMine().getContent());
                break;
//            case MessageType.MEET_MSG:
//                serverHandler.sendMessageService.sendTeamMsg(socketMsgVo);
//                break;
//            case MessageType.PRIVATE_MSG:
//                serverHandler.sendMessageService.sendPrivateMsg(socketMsgVo);
//                break;
            default:
                System.out.println("你说的什么鬼");
                break;
        }
        /**消息解析end*/

        //todo 前端改完接口调用这里需要删除
        /**模拟短连接接口调用begin*/
       /* String userid=httpRequest.getParam("userId");
        CloseableHttpClient httpClient = HttpClientBuilder.create().build();
        HttpPost httpPost = new HttpPost("http://127.0.0.1:8089/zzMessageInfo/sendMessage");
        StringEntity entity = new StringEntity(text, "UTF-8");

        // post请求是将参数放在请求体里面传过去的;这里将entity放入post请求体中
        httpPost.setEntity(entity);
        httpPost.setHeader("Content-Type", "application/json;charset=utf8");
        httpPost.setHeader("userId",userid);
        // 响应模型
        CloseableHttpResponse response = null;
        try {
            // 配置信息
            RequestConfig requestConfig = RequestConfig.custom()
                    // 设置连接超时时间(单位毫秒)
                    .setConnectTimeout(5*1000)
                    // 设置请求超时时间(单位毫秒)
                    .setConnectionRequestTimeout(5*1000)
                    // socket读写超时时间(单位毫秒)
                    .setSocketTimeout(5*1000)
                    // 设置是否允许重定向(默认为true)
                    .setRedirectsEnabled(true).build();

            // 将上面的配置信息 运用到这个Get请求里
            httpPost.setConfig(requestConfig);

            // 由客户端执行(发送)Get请求
            response = httpClient.execute(httpPost);

            // 从响应模型中获取响应实体
            HttpEntity responseEntity = response.getEntity();
            if (responseEntity != null) {
                String infStr = EntityUtils.toString(responseEntity);
                System.out.println("==================="+infStr);
            }
        } catch (ClientProtocolException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                // 释放资源
                if (httpClient != null) {
                    httpClient.close();
                }
                if (response != null) {
                    response.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }*/
        /**模拟短连接接口调用end*/

         /* System.out.println(text);
//        String msg = channelContext.getClientNode().toString() + " 说：" + text;
        String msg = text;
        //用tio-websocket，服务器发送到客户端的Packet都是WsResponse
        WsResponse wsResponse = WsResponse.fromText(msg, IworkServerConfig.CHARSET);
        //群发
       // Tio.bSendToGroup(channelContext.tioConfig, Const.GROUP_SYS, wsResponse);
        //系统消息
//        Aio.sendToAll(channelContext.getGroupContext(),wsResponse);

//        Aio.sendToUser(channelContext.getGroupContext(),"123",wsResponse);
        //返回值是要发送给客户端的内容，一般都是返回null*/
        return null;
    }

}