package com.casic.flatform.util;

import java.text.ParseException;
import java.text.ParsePosition;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class DateUtil {

    public static String dateFormat(Date date, String format) {
        try {
            if (date != null) {
                return new SimpleDateFormat(format).format(date);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public static Date dateValidation(String dateStr) {

        if (dateStr == null || dateStr == "") {
            return null;
        } else {
            try {
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                Date date = sdf.parse(dateStr, new ParsePosition(0));
                return date;
            } catch (Exception e) {
                return null;
            }
        }

    }

    public static Date dateValidation(String dateStr, String format) {

        try {
            if (dateStr == null || dateStr == "") {
                return null;
            } else {
                SimpleDateFormat sdf = new SimpleDateFormat(format);
                Date date = sdf.parse(dateStr, new ParsePosition(0));
                return date;
            }
        } catch (Exception e) {
            return null;
        }

    }

    /**
     * 计算两个日期之间相差的天数
     *
     * @param smdate 较小的时间
     * @param bdate  较大的时间
     * @return 相差天数
     * @throws ParseException
     */
    public static int daysBetween(Date smdate, Date bdate) {
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            smdate = sdf.parse(sdf.format(smdate));
            bdate = sdf.parse(sdf.format(bdate));
            Calendar cal = Calendar.getInstance();
            cal.setTime(smdate);
            long time1 = cal.getTimeInMillis();
            cal.setTime(bdate);
            long time2 = cal.getTimeInMillis();
            long between_days = (time2 - time1) / (1000 * 3600 * 24);
            return Integer.parseInt(String.valueOf(between_days));
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return -1;
    }

    /**
     * 字符串的日期格式的计算
     */
    public static int daysBetween(String smdate, String bdate) {
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            Calendar cal = Calendar.getInstance();
            cal.setTime(sdf.parse(smdate));
            long time1 = cal.getTimeInMillis();
            cal.setTime(sdf.parse(bdate));
            long time2 = cal.getTimeInMillis();
            long between_days = (time2 - time1) / (1000 * 3600 * 24);

            return Integer.parseInt(String.valueOf(between_days));
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return -1;
    }

    /**
     * 获取指定日期所在月的天数
     *
     * @param sDate
     * @return
     */
    public static int getLastDayOfMonth(Date sDate) {
        Calendar cDay = Calendar.getInstance();
        cDay.setTime(sDate);
        final int lastDay = cDay.getActualMaximum(Calendar.DAY_OF_MONTH);
        return lastDay;
    }

    /**
     * 获取本周的第一天日期
     *
     * @return
     */
    public static Date getWeekFirstDay() {
        Calendar calendar = Calendar.getInstance();
        while (calendar.get(Calendar.DAY_OF_WEEK) != Calendar.MONDAY) {
            calendar.add(Calendar.DATE, -1);
        }
        return calendar.getTime();
    }

    /**
     * 获取本月的第一天日期
     *
     * @return
     */
    public static Date getMonthFirstDay() {
        Calendar calendar = Calendar.getInstance();// 获取当前日期
        calendar.set(Calendar.DAY_OF_MONTH, 1); // 设置为1号,当前日期既为本月第一天
        return calendar.getTime();
    }

    /**
     * 获取前12个月的第一天，比如：今天2014-12-12日，那么返回2014-01-01
     *
     * @return
     */
    public static Date getLastYearMonthFirstDay() {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.YEAR, -1);
        calendar.add(Calendar.MONTH, 1);
        calendar.set(Calendar.DAY_OF_MONTH, 1);
        return calendar.getTime();
    }

    public static String getMonthName(int i) {
        if (i == 1) {
            return "一月";
        } else if (i == 2) {
            return "二月";
        } else if (i == 3) {
            return "三月";
        } else if (i == 4) {
            return "四月";
        } else if (i == 5) {
            return "五月";
        } else if (i == 6) {
            return "六月";
        } else if (i == 7) {
            return "七月";
        } else if (i == 8) {
            return "八月";
        } else if (i == 9) {
            return "九月";
        } else if (i == 10) {
            return "十月";
        } else if (i == 11) {
            return "十一月";
        } else if (i == 12) {
            return "十二月";
        } else {
            return "未知";
        }
    }

    /**
     * 上个季度的开始时间
     *
     * @return
     */
    public static Date getLastQuarterStartTime() {

        Calendar c = Calendar.getInstance();
        int currentMonth = c.get(Calendar.MONTH) + 1;

        SimpleDateFormat shortSdf = new SimpleDateFormat("yyyy-MM-dd");
        SimpleDateFormat longSdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        Date date = null;
        try {
            if (currentMonth >= 1 && currentMonth <= 3) {
                c.add(Calendar.YEAR, -1);
                c.set(Calendar.MONTH, 10 - 1);
                c.set(Calendar.DATE, 1);
            } else if (currentMonth >= 4 && currentMonth <= 6) {
                c.set(Calendar.MONTH, 1 - 1);
                c.set(Calendar.DATE, 1);
            } else if (currentMonth >= 7 && currentMonth <= 9) {
                c.set(Calendar.MONTH, 4 - 1);
                c.set(Calendar.DATE, 1);
            } else if (currentMonth >= 10 && currentMonth <= 12) {
                c.set(Calendar.MONTH, 7 - 1);
                c.set(Calendar.DATE, 1);
            }
            date = longSdf.parse(shortSdf.format(c.getTime()) + " 00:00:00");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return date;
    }

    /**
     * 上个季度的结束时间
     *
     * @return
     */
    public static Date getLastQuarterEndTime() {
        Calendar c = Calendar.getInstance();
        int currentMonth = c.get(Calendar.MONTH) + 1;

        SimpleDateFormat shortSdf = new SimpleDateFormat("yyyy-MM-dd");
        SimpleDateFormat longSdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        Date date = null;
        try {
            if (currentMonth >= 1 && currentMonth <= 3) {
                c.add(Calendar.YEAR, -1);
                c.set(Calendar.MONTH, 12 - 1);
                c.set(Calendar.DATE, 31);
            } else if (currentMonth >= 4 && currentMonth <= 6) {
                c.set(Calendar.MONTH, 3 - 1);
                c.set(Calendar.DATE, 31);
            } else if (currentMonth >= 7 && currentMonth <= 9) {
                c.set(Calendar.MONTH, 6 - 1);
                c.set(Calendar.DATE, 30);
            } else if (currentMonth >= 10 && currentMonth <= 12) {
                c.set(Calendar.MONTH, 9 - 1);
                c.set(Calendar.DATE, 30);
            }
            date = longSdf.parse(shortSdf.format(c.getTime()) + " 23:59:59");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return date;
    }

    /**
     * 根據生日獲取年齡
     */
    public static int getAge(String birth) {
        Date date = new Date();
        String dateStr = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss").format(date);
        String date1 = dateStr.substring(0, 4);
        String agestr = birth.substring(0, 4);
        int age = Integer.parseInt(date1) - Integer.parseInt(agestr) + 1;
        return age;

    }

    /**
     * @param args
     * @throws ParseException
     */

    // public static void main(String[] args) throws ParseException { // TODO
    // // SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    // // Date d1 = sdf.parse("2012-09-08 10:10:10");
    // // Date d2 = sdf.parse("2012-09-09 23:59:59");
    // // System.out.println(daysBetween(d1, d2));
    // //
    //// System.out.println(daysBetween("2012-09-08 23:59:59",
    //// "2012-09-09 00:00:00"));
    // // String hour = dateFormat(new Date(), "yyyyMMddHHmmss");
    // // System.out.println(hour);
    // System.out.println(getLastQuarterStartTime().toString());
    // System.out.println(getLastQuarterEndTime().toString());
    // }

    /**
     * 一年前
     * @return
     */
    public static Date lastYearDate() {
        Calendar c = Calendar.getInstance();
        c.setTime(new Date());
        c.add(Calendar.YEAR, -1);
        Date date = c.getTime();
	    return date;
    }
}