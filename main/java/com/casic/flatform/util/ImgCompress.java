package com.casic.flatform.util;

import com.sun.image.codec.jpeg.JPEGCodec;
import com.sun.image.codec.jpeg.JPEGImageEncoder;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

/**
 * 图片压缩处理 
 */  
public class ImgCompress { 
	
	public static void main(String[] args) throws Exception {
		// 不失真 等比压缩
		reduceImg("E:/Hydrangeas.png", "E:/Hydrangeas.png_800_600.png", 40, 40, false);
	}
	
	public static void reduceImg(String fileName, String outFileName, int w, int h) {
		reduceImg(fileName, outFileName, 120, 120, false);
	}
    
    /** 
     * 按照宽度还是高度进行等比压缩 
     * @param w int 最大宽度 
     * @param h int 最大高度 
     */
	public static void reduceImg(String fileName, String outFileName, int w, int h, boolean isCut) {
        try {        
        	File file = new File(fileName);// 读入文件    
            if (!file.exists()) {        
                return;        
            }        
            Image img = ImageIO.read(file);      // 构造Image对象  
        	int width = img.getWidth(null);    // 得到源图宽  
        	int height = img.getHeight(null);  // 得到源图长  
        	if (isCut) {
        		// 以短的为主做裁剪，以确保要裁剪的规格小于图片的长宽
				if (width > height) {
					w = (int) (width * h / height);
				} else {
					h = (int) (height * w / width);
				}
			} else {
				// 默认展示以长的为主，使长宽都小于展示框
				if (width > height) {
					if (width > w) {
						h = (int) (w * height / width);
					}
				} else {
					if (height > h) {
						w = (int) (h * width / height);
					}
				}
			}
            // SCALE_SMOOTH 的缩略算法 生成缩略图片的平滑度的 优先级比速度高 生成的图片质量比较好 但速度慢  
            BufferedImage image = new BufferedImage(w, h,BufferedImage.TYPE_INT_RGB );   
            image.getGraphics().drawImage(img.getScaledInstance(w, h,  Image.SCALE_SMOOTH), 0, 0, null); // 绘制缩小后的图         
//            tag.getGraphics().drawImage(src.getScaledInstance(widthdist, heightdist,  Image.SCALE_AREA_AVERAGING), 0, 0,  null);        
            File destFile = new File(outFileName);  
            FileOutputStream out = new FileOutputStream(destFile); // 输出到文件流  
            // 可以正常实现bmp、png、gif转jpg  
            JPEGImageEncoder encoder = JPEGCodec.createJPEGEncoder(out);  
            encoder.encode(image); // JPEG编码  
            out.close();          
        } catch (IOException ex) {        
            ex.printStackTrace();        
        }        
    }    
   
    /** 
     * 按照原图自身进行压缩
     * @param w int 最大宽度 
     * @param h int 最大高度 
     */
    public static void reduceImg(String fileName, String outFileName) {        
    	try {     
//    		System.out.println(fileName);
    		File file = new File(fileName);// 读入文件    
    		if (!file.exists()) {        
    			return;        
    		}        
    		Image img = ImageIO.read(file);      // 构造Image对象  
    		int width = img.getWidth(null);    // 得到源图宽  
    		int height = img.getHeight(null);  // 得到源图长  
		    int h = height;
            int w = width;
    		// SCALE_SMOOTH 的缩略算法 生成缩略图片的平滑度的 优先级比速度高 生成的图片质量比较好 但速度慢  
    		BufferedImage image = new BufferedImage(w, h,BufferedImage.TYPE_INT_RGB );   
    		image.getGraphics().drawImage(img.getScaledInstance(w, h,  Image.SCALE_SMOOTH), 0, 0, null); // 绘制缩小后的图         
//            tag.getGraphics().drawImage(src.getScaledInstance(widthdist, heightdist,  Image.SCALE_AREA_AVERAGING), 0, 0,  null);        
    		File destFile = new File(outFileName);  
    		FileOutputStream out = new FileOutputStream(destFile); // 输出到文件流  
    		// 可以正常实现bmp、png、gif转jpg  
    		JPEGImageEncoder encoder = JPEGCodec.createJPEGEncoder(out);  
    		encoder.encode(image); // JPEG编码  
    		out.close();          
    	} catch (IOException ex) {        
    		ex.printStackTrace();        
    	}        
    }    
}  