package com.casic.flatform.controller;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 读取文档下载文件
 * @author liutian
 *
 */
@RestController
@RequestMapping("/fileBaseController")
public class FileBaseController {
	
	/**
	 * 读取text
	 */
	@RequestMapping("/uploadFile")
	public String readFileByLines(HttpServletRequest request, HttpServletResponse response){
		File file = new File("D://toolsupload//readme.txt");
		if(file.isFile()&&file.exists()){
			InputStreamReader isr;
			try {
				isr = new InputStreamReader(new FileInputStream(file),"GBK");
				BufferedReader br = new BufferedReader(isr);
				String lineTxt = null;
				while((lineTxt = br.readLine()) != null){
					return lineTxt;
				}
				br.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
			
		} else{
			System.out.println("文件不存在");
			return null;
		}
		return null;
	}
	
}
