package com.casic.flatform.util;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;

public class PdfToSwfUtil {

	Logger logger = LoggerFactory.getLogger(OfficeConverUtil.class);

	private int environment = 1;
	private static PdfToSwfUtil pdfToSwf;

	/**
	 * 获取Doc2HtmlUtil实例
	 */
	public static synchronized PdfToSwfUtil getPdfToSwfUtilInstance() {
		if (pdfToSwf == null) {
			pdfToSwf = new PdfToSwfUtil();
		}
		return pdfToSwf;
	}

	/**
	 * pdf转化为swf文件
	 * 
	 * @param fileInputPath
	 *            :pdf文件路径
	 * @param fileOutPath
	 *            ：swf文件输出路径
	 * @return :swf文件输出路径
	 * @throws IOException
	 */
	public String pdfToswf(String fileInputPath) throws IOException {
		String filePath = fileInputPath.substring(0, fileInputPath.lastIndexOf("/"));
		String fileName = fileInputPath.substring(fileInputPath.lastIndexOf("/") + 1);
		String nameNotExt = fileName.substring(0, fileName.lastIndexOf("."));

		if (StringUtils.isEmpty(filePath) || StringUtils.isEmpty(fileName) || StringUtils.isEmpty(nameNotExt)) {
			throw new IOException("传入路径不正确！");
		}

		String fileOutPath = filePath + "/" + nameNotExt + ".swf";
		File outFile = new File(fileOutPath);

		if (outFile.exists() && outFile.length() > 10) {
			logger.info("返回已存在的swf文件：" + fileOutPath);
			return fileOutPath;
		}

		Runtime r = Runtime.getRuntime();
		if (environment == 1) {
			Process p = r.exec(
					"D:/synergy-platform V2.0/SWFTools/pdf2swf.exe " + fileInputPath + " -o " + fileOutPath + " -T 9");
			logger.info(loadStream(p.getInputStream()));
			logger.info(loadStream(p.getErrorStream()));
			logger.info(loadStream(p.getInputStream()));
			logger.info("swf转换成功，文件输出：" + fileOutPath);
		} else if (environment == 2) {
			Process p = r.exec("pdf2swf " + fileInputPath + " -o " + fileOutPath + " -T 9");
			System.out.print(loadStream(p.getInputStream()));
			logger.info(loadStream(p.getErrorStream()));
			logger.info("swf转换成功，文件输出：" + fileOutPath);
		}
		logger.info("转换swf文件成功;fileOutPath=" + fileOutPath);
		return fileOutPath;
	}

	/**
	 * 将输入流转换为字符串
	 * 
	 * @param in
	 * @return
	 * @throws IOException
	 */
	private String loadStream(InputStream in) throws IOException {
		int ptr = 0;
		in = new BufferedInputStream(in);
		StringBuffer buffer = new StringBuffer();

		while ((ptr = in.read()) != -1) {
			buffer.append((char) ptr);
		}
		return buffer.toString();
	}

}
