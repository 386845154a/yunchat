package com.casic.flatform.config;

import java.nio.charset.Charset;
import java.util.List;

import javax.servlet.MultipartConfigElement;

import org.springframework.boot.context.embedded.ConfigurableEmbeddedServletContainer;
import org.springframework.boot.context.embedded.EmbeddedServletContainerCustomizer;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 * web配置
 * @author hanxu
 */
@Configuration
public class WebMvcConfigurer extends WebMvcConfigurerAdapter {

	/**
	 * 拦截器
	 */
	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		// 多个拦截器组成一个拦截器链
		// addPathPatterns 用于添加拦截规则
		registry.addInterceptor(new Interceptor()).addPathPatterns("/**");
		super.addInterceptors(registry);
	}

	/**
	 * 配置上传文件大小
	 * @return
	 */
	@Bean
	public MultipartConfigElement multipartConfigElement() {
		MultipartConfigFactory factory = new MultipartConfigFactory();
		factory.setMaxFileSize(Long.valueOf(1 * 1024) * 1024 * 1024);//1GB
		factory.setMaxRequestSize(Long.valueOf(1 * 1024) * 1024 * 1024);//1GB
		
		return factory.createMultipartConfig();
	}
	
	/**
	 * 设置编码格式
	 * @return
	 */
	@Bean
    public HttpMessageConverter<String> responseBodyConverter() {
        StringHttpMessageConverter converter = new StringHttpMessageConverter(
                Charset.forName("UTF-8"));
        return converter;
    }

    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        super.configureMessageConverters(converters);
        converters.add(responseBodyConverter());
    }

    @Override
    public void configureContentNegotiation( ContentNegotiationConfigurer configurer) {
        configurer.favorPathExtension(false);
    }

	/**
	 * 设置session过期时间 8小时
	 */
//	@Bean
//    public EmbeddedServletContainerCustomizer containerCustomizer() {
//		return new EmbeddedServletContainerCustomizer() {
//			@Override
//			public void customize(ConfigurableEmbeddedServletContainer container) {
////				container.setSessionTimeout(28800);
//				container.setSessionTimeout(1);// 单位/s
//			}
//		};
//	}

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/help/**").addResourceLocations("file:D://toolsupload/help/");
		super.addResourceHandlers(registry);
	}
}
