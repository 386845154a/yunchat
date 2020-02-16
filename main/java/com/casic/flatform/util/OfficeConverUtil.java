package com.casic.flatform.util;

import java.io.File;
import java.io.IOException;
import java.net.ConnectException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;

import com.artofsolving.jodconverter.DocumentConverter;
import com.artofsolving.jodconverter.openoffice.connection.OpenOfficeConnection;
import com.artofsolving.jodconverter.openoffice.connection.SocketOpenOfficeConnection;
import com.artofsolving.jodconverter.openoffice.converter.OpenOfficeDocumentConverter;

/**
 * office格式转换
 * 
 * @author hanxu
 */
public class OfficeConverUtil {

	Logger logger = LoggerFactory.getLogger(OfficeConverUtil.class);

	private static OfficeConverUtil officeConver;

	/**
	 * 获取Doc2HtmlUtil实例
	 */
	public static synchronized OfficeConverUtil getOfficeConverUtil() {
		if (officeConver == null) {
			officeConver = new OfficeConverUtil();
		}
		return officeConver;
	}

	/**
	 * office转换
	 * 
	 * @param fileInputPath
	 *            :office文件输入路径
	 * @param fileOutPath
	 *            ：文件输出路径(包含文件名)
	 * @return ：文件路径
	 * @throws IOException
	 */
	public String fileConver(String fileInputPath, String fileOutPath) throws IOException {
		File fileInput = new File(fileInputPath);
		if (!fileInput.exists()) {
			throw new IOException("传入文件路径为空!");
		}

		File fileOut = new File(fileOutPath);

		if (fileOut.exists() && fileOut.length() > 1) {
			return fileOutPath;
		} else {
			fileOut.createNewFile();
		}
		OpenOfficeConnection connection = null;
		try {
			logger.error("1");
			connection = new SocketOpenOfficeConnection("127.0.0.1", 8100);
			connection.connect();
		} catch (ConnectException ex) {
			logger.error("OpenOffice服务未启动,重新启动。");
			try {
				ProcessBuilder pb = new ProcessBuilder(
						ConfigParameterUtil.getConfigByName("OpenOfficeStart", 
								"D:\\synergy-platform V2.0\\OpenOffice 4\\program\\soffice.exe&split;-headless&split;"
								+ "-accept=\"socket,host=127.0.0.1,port=8100;urp;\"&split;-nofirststartwizard")
						.split("&split;"));
//				ConfigParameterUtil.getConfigByName("OpenOfficeStart", 
//						"E:\\spring boot\\demo\\openOffice\\program\\soffice.exe&split;-headless&split;"
//								+ "-accept=\"socket,host=127.0.0.1,port=8100;urp;\"&split;-nofirststartwizard")
//				.split("&split;"));
				pb.redirectErrorStream(true);
				pb.start();
			} catch (Exception e) {
				logger.error("OpenOffice重新启动失败！");
				throw e;
			}
			logger.error("2");
			// 启动OpenOffice服务后重新调用
			connection = new SocketOpenOfficeConnection("127.0.0.1", 8100);
			connection.connect();
		}

		DocumentConverter converter = new OpenOfficeDocumentConverter(connection);
		converter.convert(fileInput, fileOut);
		connection.disconnect();

		return fileOutPath;
	}

	/**
	 * 在相同路径下生成一个同名的PDF文件
	 * 
	 * @param fileInputPath
	 * @return
	 * @throws IOException
	 */
	public String file2Pdf(String fileInputPath) throws IOException {
		int localtion = fileInputPath.lastIndexOf("/") == -1 ? fileInputPath.lastIndexOf("\\")
				: fileInputPath.lastIndexOf("/");
		String filePath = fileInputPath.substring(0, localtion);
		String fileName = fileInputPath.substring(localtion + 1);
		String nameNotExt = fileName.substring(0, fileName.lastIndexOf("."));

		if (StringUtils.isEmpty(filePath) || StringUtils.isEmpty(fileName) || StringUtils.isEmpty(nameNotExt)) {
			throw new IOException("传入路径不正确！");
		}

		return this.fileConver(fileInputPath, filePath + "/" + nameNotExt + ".pdf");

	}

	/**
	 * 在相同路径下生成一个同名的html文件
	 * 
	 * @param fileInputPath
	 *            ：office文件路径
	 * @return
	 * @throws IOException
	 */
	public String file2Html(String fileInputPath) throws IOException {
		int localtion = fileInputPath.lastIndexOf("/") == -1 ? fileInputPath.lastIndexOf("\\")
				: fileInputPath.lastIndexOf("/");
		String filePath = fileInputPath.substring(0, localtion);
		String fileName = fileInputPath.substring(localtion + 1);
		String nameNotExt = fileName.substring(0, fileName.lastIndexOf("."));

		if (StringUtils.isEmpty(filePath) || StringUtils.isEmpty(fileName) || StringUtils.isEmpty(nameNotExt)) {
			throw new IOException("传入路径不正确！");
		}

		return this.fileConver(fileInputPath, filePath + "/" + nameNotExt + ".html");

	}
}