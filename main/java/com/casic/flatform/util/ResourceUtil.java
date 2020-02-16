package com.casic.flatform.util;

import java.io.UnsupportedEncodingException;
import java.util.ResourceBundle;

import org.springframework.util.StringUtils;


/**
 * 项目参数工具类
 * 
 * @author userstrator
 * 
 */
public class ResourceUtil {

	private static final ResourceBundle bundle = java.util.ResourceBundle.getBundle("application");

	/**
	 * 获得sessionInfo名字
	 * 
	 * @return
	 */
	public static final String getSessionInfoName() {
		return bundle.getString("sessionInfoName");
	}
	
	/**
	 * 获得sessionUser名字
	 * 
	 * @return
	 */
	public static final String getSessionUserName() {
		return bundle.getString("sessionUserName");
	}

	/**
	 * 获得sessionInfo名字
	 * 
	 * @return
	 */
	public static final String getUkeySessionInfoName() {
		return bundle.getString("sessioUkeyInfoName");
	}

	/**
	 * 获取配置文件对应的键值
	 * 
	 * @return
	 */
	public static final String getMessageByConfig(String param) {
		return bundle.getString(param);
	}
	
	/**
	 * 获取配置文件对应的键值，返回int
	 * @param param
	 * @return
	 */
	public static final Integer getIntMessageByConfig (String param){
		return Integer.valueOf(bundle.getString(param));
	}
	
	/**
	 * 获取配置文件对应的键值
	 * @param param
	 * @param defaultValue
	 * @return
	 */
	public static final String getMessageByConfig (String param, String defaultValue){
		String value = bundle.getString(param);
		if (!StringUtils.isEmpty(value)){
			return value;
		}
		return defaultValue;
	}
	
	/**
	 * 获取配置文件对应的键值，返回int
	 * @param param
	 * @return
	 */
	public static final Integer getIntMessageByConfig (String param, Integer defaultValue) {
		String value = bundle.getString(param);
		if (!StringUtils.isEmpty(value)){
			return Integer.valueOf(value);
		}
		return defaultValue;
	}

	/**
	 * 获取图片路径
	 * @param str
	 * @return
	 */
	public static String getImagePath(String str) {
        return getMessageByConfig(str);
    }
	
	public static String getImagePath() {
        return getImagePath("imagePath");
    }

	/**
	 * 获得文件服务器相对路径
	 * @return
	public static String fileServicePath (){
		return getMessageByConfig("file_service_path");
	}
	*/
	/**
	 * 获得文件服务器本地路径
	 * @return
	 */
	public static String filePath (){
		return getMessageByConfig("file_path");
		
	}
	
	/**
	 * 获得上传表单域的名称
	 * 
	 * @return
	 */
	public static final String getUploadFieldName() {
		return bundle.getString("uploadFieldName");
	}

	/**
	 * 获得上传文件的最大大小限制
	 * 
	 * @return
	 */
	public static final long getUploadFileMaxSize() {
		return Long.valueOf(bundle.getString("uploadFileMaxSize"));
	}

	/**
	 * 获得允许上传文件的扩展名
	 * 
	 * @return
	 */
	public static final String getUploadFileExts() {
		return bundle.getString("uploadFileExts");
	}

	/**
	 * 获得上传文件要放到那个目录
	 * 
	 * @return
	 */
	public static final String getUploadDirectory() {
		return bundle.getString("uploadDirectory");
	}

	/**
	 * 转换字符串编码,默认UTF-8
	 * 
	 * @param str
	 * @return
	 */
	public static String getCharSetEncodeStr(String str) {
		return getCharSetEncodeStr(str, "UTF-8");
	}

	/**
	 * 转换字符串编码
	 * 
	 * @param str
	 * @param code
	 * @return
	 */
	public static String getCharSetEncodeStr(String str, String code) {
		try {
			return new String(str.getBytes("ISO-8859-1"), code);
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		return str;
	}

	/**
	 * 获得配置文件信息根据key值
	 * 
	 * @param key
	 * @return
	 */
	public static final String getConfigValueByKey(String key) {
		return bundle.getString(key);
	}
	
	/**
	 * 获取配置文件对应的键值
	 * 
	 * @return
	 */
	public static String getValueByKey(String key) {
		return bundle.getString(key);
	}
	
	public static int getIntValueByKey(String key) {
		return new Integer(getValueByKey(key));  
	}
	
	
}
