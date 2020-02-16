package com.casic.flatform.util;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;

public class UploadUtil {

	public static void saveFile (InputStream is, String path, String fileName) throws IOException{
		
		File file = new File(path);
		if (!file.exists()){
			file.mkdirs();
		}

		FileUtils.copyInputStreamToFile(is, new File(path, fileName));
		
		IOUtils.closeQuietly(is);
	}
	
}
