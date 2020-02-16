package com.casic.flatform.util;

import javax.imageio.ImageIO;
import javax.imageio.ImageReadParam;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.Arrays;

/**
 */
public class ImageUtilCrop {
    
    private static String DEFAULT_CUT_PREVFIX = "cut_";
    
    /**
     * <p>Title: cutImage</p>
     * <p>Description:  根据原图与裁切size截取局部图片</p>
     * @param srcImg    源图片
     * @param output    图片输出流
     * @param rect        需要截取部分的坐标和大小
     */
    public void cutImage(File srcImg, OutputStream output, Rectangle rect){
        if(srcImg.exists()){
            FileInputStream fis = null;
            ImageInputStream iis = null;
            try {
            	Image img = ImageIO.read(srcImg);
    			int width = img.getWidth(null);    // 得到源图宽  
    			int height = img.getHeight(null);  // 得到源图长  
            	
    			
            	
                fis = new FileInputStream(srcImg);
                // ImageIO 支持的图片类型 : [BMP, bmp, jpg, JPG, wbmp, jpeg, png, PNG, JPEG, WBMP, GIF, gif]
                String types = Arrays.toString(ImageIO.getReaderFormatNames()).replace("]", ",");
                String suffix = null;
                // 获取图片后缀
                if(srcImg.getName().indexOf(".") > -1) {
                    suffix = srcImg.getName().substring(srcImg.getName().lastIndexOf(".") + 1);
                }// 类型和图片后缀全部小写，然后判断后缀是否合法
                if(suffix == null || types.toLowerCase().indexOf(suffix.toLowerCase()+",") < 0){
                    //log.error("Sorry, the image suffix is illegal. the standard image suffix is {}." + types);
                    return ;
                }
                // 将FileInputStream 转换为ImageInputStream
                iis = ImageIO.createImageInputStream(fis);
                // 根据图片类型获取该种类型的ImageReader
                ImageReader reader = ImageIO.getImageReadersBySuffix(suffix).next();
                reader.setInput(iis,true);
                ImageReadParam param = reader.getDefaultReadParam();
                param.setSourceRegion(rect);
                BufferedImage bi = reader.read(0, param);
                ImageIO.write(bi, suffix, output);
                System.out.println("剪切成功");
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            } finally {
                try {
                    if(fis != null) fis.close();
                    if(iis != null) iis.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }else {
            //log.warn("the src image is not exist.");
        }
    }
    
    public void cutImage(File srcImg, OutputStream output, int x, int y, int width, int height){
        cutImage(srcImg, output, new Rectangle(x, y, width, height));
    }
    
    public void cutImage(File srcImg, String destImgPath, Rectangle rect){
        try {
            cutImage(srcImg, new FileOutputStream(destImgPath), rect);
        } catch (FileNotFoundException e) {
            //log.warn("the dest image is not exist.");
        }
    }
    
    public void cutImage(File srcImg, String destImg, int x, int y, int width, int height){
        cutImage(srcImg, destImg, new Rectangle(x, y, width, height));
    }
    
    public void cutImage(String srcImg, String destImg, int x, int y, int width, int height){
        cutImage(new File(srcImg), destImg, new Rectangle(x, y, width, height));
    }
    
    // 纵坐标：50, 横坐标：50, 长：192, 宽：192
    public static void main(String[] args) {
        new ImageUtilCrop().cutImage("C:/Users/liup/Desktop/picture/q.jpg", "C:/Users/liup/Desktop/picture/q_150_150.jpg", 0,39, 150, 150);
    }

    public static boolean handle(String filePath, String fileName, String imgSize) throws IOException {
       return  handle(filePath,  fileName,  imgSize, true);
    }

    // 图片综合处理
    public static boolean handle(String filePath, String fileName, String imgSize, boolean isDelete) throws IOException{
        boolean isCut = false;
	    String reduceImgName = "";
	    String[] imgSizeA = imgSize.split(",");
		String filePath_ = (filePath +"\\" + fileName).replaceAll("\\\\", "/");
		File file = new File(filePath_);// 读入文件    
		Image img = ImageIO.read(file);      // 构造Image对象  
		int width = img.getWidth(null);    // 得到源图宽  
		int height = img.getHeight(null);  // 得到源图长  
		reduceImgName = fileName.substring(0, fileName.lastIndexOf(".")) + "_" + imgSizeA[2] + ".jpg";
		// 图片缩略图
		if(width > Integer.parseInt(imgSizeA[2]) && height > Integer.parseInt(imgSizeA[2])){
			ImgCompress.reduceImg(filePath_, filePath +"\\" + reduceImgName, Integer.parseInt(imgSizeA[2]), Integer.parseInt(imgSizeA[2]), false);
		}else{
			ImgCompress.reduceImg(filePath_, filePath +"\\" + reduceImgName);
		}
		reduceImgName = fileName.substring(0, fileName.lastIndexOf(".")) + "_" + imgSizeA[1] + ".jpg";
		// 图文压缩图
		if(width > Integer.parseInt(imgSizeA[1]) && height > Integer.parseInt(imgSizeA[1])){
			ImgCompress.reduceImg(filePath_, filePath +"\\" + reduceImgName, Integer.parseInt(imgSizeA[1]), Integer.parseInt(imgSizeA[1]), true);
		}
		// 正方形裁剪
		reduceImgName = fileName.substring(0, fileName.lastIndexOf(".")) +"_" + imgSizeA[0] + ".jpg";
		if(width > Integer.parseInt(imgSizeA[0]) && height > Integer.parseInt(imgSizeA[0])){
			// 先压缩再裁剪
			ImgCompress.reduceImg(filePath_, filePath +"\\" +reduceImgName, Integer.parseInt(imgSizeA[0]), Integer.parseInt(imgSizeA[0]), true);
			int top = 0;
			int left = 0;
			if (width > height) {
				width = (int) (width * Integer.parseInt(imgSizeA[0]) / height);
				height = Integer.parseInt(imgSizeA[0]);
				left = width/2 - Integer.parseInt(imgSizeA[0])/2;
				top = 0;
			} else {
				height = (int) (height * Integer.parseInt(imgSizeA[0]) / width);
				width = Integer.parseInt(imgSizeA[0]);
				top = height/2 - Integer.parseInt(imgSizeA[0])/2;
				left = 0;
			}
			String cutImgName = fileName.substring(0, fileName.lastIndexOf(".")) +"_" + imgSizeA[0] + "_" +imgSizeA[0] + ".jpg";
			new ImageUtilCrop().cutImage(new File(filePath +"\\" +reduceImgName), filePath +"\\" +cutImgName, new Rectangle(top, left, Integer.parseInt(imgSizeA[0]), Integer.parseInt(imgSizeA[0])));
            isCut = true;
		}
		if (isDelete) {
            // 删除用户上传的图片
            File originImg = new File(filePath+"/"+fileName);
            // originImg.delete();
        }
        return isCut;
    }
}