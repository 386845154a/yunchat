package com.casic.flatform.quartz;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.casic.flatform.service.MessageService;
import com.casic.flatform.util.SpringUtil;

public class RemoveRuToHiJob implements Job {

	private Logger logger = LoggerFactory.getLogger(RemoveRuToHiJob.class);
	
	private MessageService messageService = SpringUtil.getBean(MessageService.class);
	
	@Override
	public void execute(JobExecutionContext arg0) throws JobExecutionException {
		logger.info("执行了定时任务:移动消息到历史表。");
		messageService.moveRuToHi();
	}

}
