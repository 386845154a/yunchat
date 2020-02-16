package com.casic.flatform.quartz;

import static org.quartz.JobBuilder.newJob;

import java.util.List;
import java.util.TimeZone;

import org.quartz.CronScheduleBuilder;
import org.quartz.CronTrigger;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.TriggerBuilder;
import org.quartz.impl.StdSchedulerFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class QuertzService {

	private Logger logger = LoggerFactory.getLogger(QuertzService.class);

	public void init() throws SchedulerException {
		// 启动将消息从当前表中移动到历史表中的定时任务
		//20190109
//		removeRuToHiJob();
	}
	
	public void removeRuToHiJob() throws SchedulerException {
		logger.info("quertzService startup success");


		// 从调度程序工厂获取一个调度程序的实例
		Scheduler scheduler = StdSchedulerFactory.getDefaultScheduler();
		List<String> groupList = scheduler.getJobGroupNames();
		if (groupList.contains("group1")){
			return;//定时器中已经包含了定时任务
		}

		//定义定时任务
		JobDetail job = newJob(RemoveRuToHiJob.class).withIdentity("job1", "group1").build();

		// 声明一个触发器，现在就执行(schedule.start()方法开始调用的时候执行)；并且每间隔2秒就执行一次
//		Trigger trigger = newTrigger().withIdentity("trigger1", "group1").startNow()
//				.withSchedule(simpleSchedule().withIntervalInHours(24).repeatForever())
//				.startAt(new Date()).build();
		
		CronScheduleBuilder cromScheduleBuidler = CronScheduleBuilder.cronSchedule("0 0 1 * * ?")
				.inTimeZone(TimeZone.getTimeZone("GMT+08:00"));
		
		CronTrigger trigger = TriggerBuilder.newTrigger().withSchedule(cromScheduleBuidler).build();
		
		// 告诉quartz使用定义的触发器trigger安排执行任务job
		scheduler.scheduleJob(job, trigger);

		// 启动任务调度程序,内部机制是线程的启动
		scheduler.start();

	}
}
