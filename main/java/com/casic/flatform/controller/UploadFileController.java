package com.casic.flatform.controller;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.alibaba.fastjson.JSONObject;
import com.casic.flatform.util.ImageUtilCrop;

/**
 * 上传文件控制类
 */
@Controller
@RequestMapping("/upload")
public class UploadFileController extends BaseController {

    @Value("${uploadFilePath:D:/toolsupload}")
    private String uploadPath;
    @Value("${imgSize}")
    private String imgSize;
    private String fileName = "";


    @ResponseBody
    @RequestMapping("/commonuploadfile")
    public void commonuploadfile(HttpServletRequest request, HttpServletResponse response) {
        JSONObject json = new JSONObject();
        JSONObject jsonData = new JSONObject();
        Boolean isImg = false;
        String flag = request.getParameter("flag");
        try {
            Iterator<String> fileNames = ((MultipartHttpServletRequest) request).getFileNames();
            while (fileNames.hasNext()) {
                String tempFileName_form = (String) fileNames.next();
                MultipartFile file = ((MultipartHttpServletRequest) request).getFile(tempFileName_form);
                if (!file.isEmpty()) {
                    fileName = file.getOriginalFilename().toLowerCase();
                    String fileType = file.getContentType();
                    String dirType = "other";

                    if (fileType.contains("image")) {
                        isImg = true;
                    }

                    // 先判断文件类型
                    String ftype[] = {"image", "pdf", "word", "ppt", "excel", "xml", "html", "flash", "visio", "js", "css"};
                    for (String ft : ftype) {
                        if (fileType.contains(ft)) {
                            dirType = ft;
                            break;
                        }
                    }
                    // 根据后缀名，确定文件类型
                    String pex[] = {"zip", "zp", "rar", "exe", "iso", "txt"};
                    for (String pex_ : pex) {
                        if (fileName.endsWith(pex_)) {
                            dirType = pex_;
                            break;
                        }
                    }
                    // 相对目录
                    String relativePath = "upload/" + dirType;

                    // 创建文件目录
                    String date_ = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
                    String tempA[] = date_.split("-");
                    String fieDir = "/" + tempA[0] + "/" + tempA[1] + "/" + tempA[2];

                    relativePath += fieDir;

                    // 上传目录
                    String filePath = uploadPath + "/" + relativePath;

                    // 文件目录不存在，创建
                    File dirFile = new File(filePath);
                    if (!dirFile.exists()) {
                        dirFile.mkdirs();
                    }
                    // 创建 GUID 对象
                    String uuid = UUID.randomUUID().toString();
                    int code = uuid.hashCode();
                    code = code < 0 ? -code : code;

                    String oldFileName = fileName;
                    // 重命名
                    fileName = date_.replaceAll("-", "") + String.format("%012d", code) + "." + fileName.substring(fileName.lastIndexOf(".") + 1);
                    try {
                        // 上传
                        File uploadedFile = new File(filePath, fileName);
                        FileUtils.copyInputStreamToFile(file.getInputStream(), uploadedFile);
                        boolean handle = false;
                        try {
                            if (fileName.endsWith(".png") || fileName.endsWith(".gif") || fileName.endsWith(".jpg") || fileName.endsWith(".bmp")) {
                                handle = ImageUtilCrop.handle(filePath, fileName, imgSize, false);
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                        if (isImg) {
                            json.put("code",0);
                            json.put("msg","上传成功");
                            // TODO: 2020/2/16 改为配置文件
                            jsonData.put("src","http://127.0.0.1:8888/userHeadController/showHead?path=/" + relativePath + "/" + fileName);
                            jsonData.put("name",oldFileName);
                            json.put("data",jsonData);
                        }
                        else {
                            json.put("code",0);
                            json.put("msg","上传成功");
                            // TODO: 2020/2/16 改为配置文件
                            jsonData.put("src","http://127.0.0.1:8888/indexController/fileHave?path=/" + relativePath + "/" + fileName);
                            jsonData.put("name",oldFileName);
                            json.put("data",jsonData);
                        }
//                        if (!StringUtils.isEmpty(flag)) {
//                            // kindeditor编辑器上传图片
//                            if (flag.equals("ke")) {
//                                String pre = "";
//                                if (handle) {
//                                    pre = "_150";
//                                }
//                                fileName = fileName.substring(0, fileName.lastIndexOf(".")) + pre + fileName.substring(fileName.lastIndexOf("."), fileName.length());
//                                json.put("error", "0");
//                                json.put("message", "/userHeadController/showHead?path=/" + relativePath + "/" + fileName);
////                                json.put("message", "/userHeadController/showHead?path=/" + relativePath + "/" + fileName + "\"  onclick=\"show_img('/" + relativePath + "/" + fileName + "')");
//                            } else {
//                                json.put("success", true);
//                                json.put("msg", "上传成功");
//                                json.put("message", "/" + relativePath + "/" + fileName + "@@@" + oldFileName);
//                            }
//                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                        json.put("code",1);
                        json.put("msg","上传失败");
                        jsonData.put("src","");
                        jsonData.put("name",oldFileName);
                        json.put("data",jsonData);
                    }
                }
            }
//            }
        } catch (Exception ex) {
            ex.printStackTrace();
            if (!StringUtils.isEmpty(flag)) {
                // kindeditor编辑器上传图片
                if (flag.equals("ke")) {
                    json.put("error", "1");
                    json.put("message", "文件上传失败");
                } else {
                    json.put("success", false);
                    json.put("msg", "上传失败");
                }
            }
        }
        try {
            response.setContentType("text/html;charset=utf-8");
            PrintWriter out = response.getWriter();
            out.write(json.toJSONString());
            out.flush();
            out.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // 将MultipartFile 转换为File
    private void SaveFileFromInputStream(InputStream stream, String path, String savefile) throws IOException {
        FileOutputStream fs = new FileOutputStream(path + "/" + savefile);
        // System.out.println("------------" + path + "/" + savefile);
        byte[] buffer = new byte[1024 * 1024];
        int bytesum = 0;
        int byteread = 0;
        while ((byteread = stream.read(buffer)) != -1) {
            bytesum += byteread;
            fs.write(buffer, 0, byteread);
            fs.flush();
        }
        fs.close();
        stream.close();
    }
}
