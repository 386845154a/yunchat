package com.casic.flatform.config;

import java.nio.charset.Charset;

import org.apache.catalina.connector.Connector;
import org.apache.coyote.http11.Http11NioProtocol;
import org.springframework.boot.context.embedded.EmbeddedServletContainer;
import org.springframework.boot.context.embedded.tomcat.TomcatEmbeddedServletContainerFactory;
import org.springframework.boot.web.servlet.ServletContextInitializer;
import org.springframework.stereotype.Component;  

@Component()
public class TomcatEmbeddedServlet extends TomcatEmbeddedServletContainerFactory {

	public EmbeddedServletContainer getEmbeddedServletContainer(ServletContextInitializer... initializers) {
		this.setUriEncoding(Charset.forName("UTF-8"));
		//this.setBaseDirectory(new File("D:/webapps/upload"));
		//this.setPort(8880);// 设置端口
		//this.addErrorPages(new ErrorPage(HttpStatus.NOT_FOUND, "/404.html"));
		//this.addErrorPages(new ErrorPage(HttpStatus.INTERNAL_SERVER_ERROR, "/500.html"));
		return super.getEmbeddedServletContainer(initializers);
	}

	protected void customizeConnector(Connector connector) {
		super.customizeConnector(connector);
		Http11NioProtocol protocol = (Http11NioProtocol) connector.getProtocolHandler();
		// 设置最大连接数
		protocol.setMaxConnections(2000);
		// 设置最大线程数
		protocol.setMaxThreads(2000);
		protocol.setConnectionTimeout(30000);
	}

}
