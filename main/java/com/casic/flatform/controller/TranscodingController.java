package com.casic.flatform.controller;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.casic.flatform.util.OfficeConverUtil;
import com.casic.flatform.util.PdfToSwfUtil;

@RestController()
public class TranscodingController {
	
	private Logger logger = LoggerFactory.getLogger(TranscodingController.class);

	private static final List<String> officeExtList = new ArrayList<String> ();
	
	static {
		officeExtList.add("doc");
		officeExtList.add("docx");
		officeExtList.add("xls");
		officeExtList.add("xlsx");
		officeExtList.add("ppt");
		officeExtList.add("pptx");
	}
	
	@RequestMapping("/fileToSwf")
	public String fileToSwf(String path) {
		logger.info("接收请求：fileConver，path=" + path);
		try {
			if (StringUtils.isEmpty(path)){
				return null;
			}
			
			String ext = path.substring(path.lastIndexOf(".") + 1).toLowerCase();
			if ("pdf".equals(ext)){
				return PdfToSwfUtil.getPdfToSwfUtilInstance().pdfToswf(path);
			}else if (officeExtList.contains(ext)){
				String pdfPath = OfficeConverUtil.getOfficeConverUtil().file2Pdf(path);
				return PdfToSwfUtil.getPdfToSwfUtilInstance().pdfToswf(pdfPath);
			}
			
		}catch (Exception ex){
			ex.printStackTrace();
		}
		return null;
		
	}

	@RequestMapping("/fileToPdf")
	public String fileToPdf(String path) {
		logger.info("接收请求：fileConver，path=" + path);
		try {
			if (StringUtils.isEmpty(path)){
				return null;
			}
			
			String ext = path.substring(path.lastIndexOf(".") + 1).toLowerCase();
			if ("pdf".equals(ext)){
				return path;
			}else if (officeExtList.contains(ext)){
				return OfficeConverUtil.getOfficeConverUtil().file2Pdf(path);
			}
			
		}catch (Exception ex){
			ex.printStackTrace();
		}
		return null;
		
	}
}
