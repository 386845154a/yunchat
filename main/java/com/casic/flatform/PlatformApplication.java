package com.casic.flatform;

import com.casic.flatform.server.IworkServerConfig;
import com.casic.flatform.server.IworkWebsocketStarter;
import com.casic.flatform.server.IworkWsMsgHandler;
import org.mybatis.spring.annotation.MapperScan;
import org.quartz.SchedulerException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import com.casic.flatform.quartz.QuertzService;

import java.io.IOException;

@SpringBootApplication
@EnableTransactionManagement
@MapperScan("com.casic.flatform.mapper")
public class PlatformApplication{

	private static Logger logger = LoggerFactory.getLogger(PlatformApplication.class);

	public static void start() {
		IworkWebsocketStarter appStarter = null;
		try {
			appStarter = new IworkWebsocketStarter(IworkServerConfig.SERVER_PORT, IworkWsMsgHandler.me);
			appStarter.getWsServerStarter().start();
		} catch (IOException e) {
			e.printStackTrace();
		}

	}

	public static void main(String[] args) {
		//执行初始化
//		try {
			SpringApplication.run(PlatformApplication.class, args);
			start();
			//初始化定时任务
//			(new QuertzService()).init();
			//初始化配置参数
//			ConfigParameterUtil.init();
			//发布接口
//			Endpoint.publish("http://192.168.8.88:9090/DataInterfaces",
//					new DataInterfacesImpl());
//		} catch (SchedulerException e) {
//			logger.error("service startup error！");
//			e.printStackTrace();
//		}
		logger.info("service startup success");
	}
}
