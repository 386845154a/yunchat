package com.casic.flatform.server;

import org.tio.server.ServerTioConfig;
import org.tio.websocket.server.WsServerStarter;

import java.io.IOException;

public class IworkWebsocketStarter {
    private static WsServerStarter wsServerStarter;
    private static ServerTioConfig serverTioConfig;

    /**
     *
     * @author tanyaowu
     */
    public IworkWebsocketStarter(int port, IworkWsMsgHandler wsMsgHandler) throws IOException {
        wsServerStarter = new WsServerStarter(port, wsMsgHandler);

        serverTioConfig = wsServerStarter.getServerTioConfig();
        serverTioConfig.setName(IworkServerConfig.PROTOCOL_NAME);
        serverTioConfig.setServerAioListener(IworkServerAioListener.me);
        //设置ip监控
        serverTioConfig.setIpStatListener(IworkIpStatListener.me);
        //设置ip统计时间段
        serverTioConfig.ipStats.addDurations(IworkServerConfig.IpStatDuration.IPSTAT_DURATIONS);
        //设置心跳超时时间
        serverTioConfig.setHeartbeatTimeout(IworkServerConfig.HEARTBEAT_TIMEOUT);
    }

    /**
     * @return the serverTioConfig
     */
    public static ServerTioConfig getServerTioConfig() {
        return serverTioConfig;
    }

    public static WsServerStarter getWsServerStarter() {
        return wsServerStarter;
    }
}
