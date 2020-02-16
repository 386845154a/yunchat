package com.casic.flatform.server;

import org.tio.core.ChannelContext;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * author:zhuqz
 * description:
 * date:2019/12/24 17:25
 **/
public class IworkSocketChannel {
    //保存所有用户的channel通道集合,使用ConcurrentHashMap 保证线程是安全的
    private static Map<String, ChannelContext> usersSocketChannelContextMap = new ConcurrentHashMap();

    //获取用户socket通道
    public static ChannelContext getUserChannelContext(String userId){
        return usersSocketChannelContextMap.get(userId);
    }
    //设置用户socket通道
    public static void setUserChannelContext(String userId,ChannelContext channelContext){
        usersSocketChannelContextMap.put(userId,channelContext);
    }
    //移除用户socket通道
    public static void removeUserChannelContext(String userId){
        usersSocketChannelContextMap.remove(userId);
    }
}
