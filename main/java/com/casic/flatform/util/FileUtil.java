package com.casic.flatform.util;

import java.io.File;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

/**
 * 文件工具类 
 * 
 * @author hanxu
 */
public class FileUtil {

	private static Logger logger = LoggerFactory.getLogger(FileUtil.class);

	/**
	 * 删除硬盘上的文件
	 * 
	 * @param path
	 *            ：文件路径
	 * @throws NullPointerException
	 */
	public static Boolean deleteFile(String path) {
		if (StringUtils.isEmpty(path)) {
			return false;
		}
		String configPath = ConfigParameterUtil.getConfigByName("uploadPath", "D:/upload");
		File file = new File(configPath + "/" + path);
		if (file.exists()) {
			logger.info("删除文件：" + path);
			return file.delete();
		} else {
			return true;
		}
	}
	
	/**
	 * 文件加密解密
	 * @param inStr
	 * @return
	 */
	public static String convert(String inStr) {

	    char[] a = inStr.toCharArray();
	    for (int i = 0; i < a.length; i++) {
	        a[i] = (char) (a[i] ^ 't');
	    }
	    return new String(a);
	}
	
	/**
	 * 
	 * @param file
	 * @param path
	 * @return
	 * @throws Exception
	 */
	public static boolean uploadFile(MultipartFile file, String path) throws Exception {
	    if (file == null){
	        throw new NullPointerException();
	    }
	    file.transferTo(new File(path));
	    return true;
	}
}
