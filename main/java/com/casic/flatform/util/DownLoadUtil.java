package com.casic.flatform.util;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;

/**
 * DownLoadUtil
 * @author zouct
 */
public class DownLoadUtil {
	public static void download(String urlString, String fileName, String savePath) throws IOException {
		URL url = new URL(urlString);
		/* URLConnection conn = url.openConnection();
		   InputStream is = conn.getInputStream();	*/
		//使用一条指令代替上面的两条指令
		InputStream is = url.openStream();
		byte[] buff = new byte[1024];
		int len = 0;
		//读操作
		File file = new File(savePath);
		if (!file.exists()) {
			file.mkdirs();
		}
		//path是指欲下载的文件的路径。
		File files = new File(urlString);
		//取得文件名。
		String filename = files.getName();
		//去的文件的后缀名。
		String ext = filename.substring(filename.lastIndexOf(".") + 1);
		//写操作
		OutputStream os = new FileOutputStream(file.getAbsolutePath()+"\\"+fileName + "." + ext);
		//一边读一边写
		while ((len=is.read(buff))!=-1) {
			os.write(buff, 0, len);//把读到写到指定的数组里面
			//释放资源
		}
		os.close();
		is.close();
	}
}