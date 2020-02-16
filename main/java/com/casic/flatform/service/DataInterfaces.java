package com.casic.flatform.service;

import javax.jws.WebMethod;
import javax.jws.WebService;

@WebService
public interface DataInterfaces {

		/**
		 * 根据XML文件自动创建用户和科室
		 * @param xmlFiles
		 * @return
		 * @throws Exception
		 */
        @WebMethod
        public Object addUser(String xmlFiles) throws Exception;
        
}