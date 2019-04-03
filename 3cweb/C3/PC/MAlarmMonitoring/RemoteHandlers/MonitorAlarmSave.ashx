<%@ WebHandler Language="C#" Class="MonitorAlarmSave" %>

using System;
using System.Web;
using System.IO;
using System.Data;
using System.Collections.Generic;
using Api.Fault.entity.alarm;
using Api.Foundation.entity.Foundation;
using Api.Util;

public class MonitorAlarmSave : ReferenceClass, IHttpHandler
{
    public void ProcessRequest(HttpContext context)
    {
        string responsestr = null;
        string alarmid = HttpContext.Current.Request["alarmid"];//缺陷ID
        string btntype = HttpContext.Current.Request["btntype"];//操作类型btnOk/确认 btnCan/取消 btnSave/保存
        string txtDefect = HttpContext.Current.Request["txtDefect"];//缺陷分析
        string txtAdvice = HttpContext.Current.Request["txtAdvice"];//处理建议
        string txtNote = HttpContext.Current.Request["txtNote"];//备注
        string txtReporter = HttpContext.Current.Request["txtReporter"];//报告人
        string afcode = HttpContext.Current.Request["afcode"];//缺陷类型
        string severity = HttpContext.Current.Request["severity"];//缺陷级别
        string Alarmcode = HttpContext.Current.Request["Alarmcode"];//告警编码
        DateTime reportdate = DateTime.Parse(HttpContext.Current.Request["reportdate"]);//日期

        //缺陷实体
        Api.Foundation.entity.Cond.SysDictionaryCond syscond = new Api.Foundation.entity.Cond.SysDictionaryCond();
        syscond.CODE_NAME = afcode;
        IList<SysDictionary> sys = Api.ServiceAccessor.GetFoundationService().querySysDictionary(syscond);
        try { afcode = sys[0].DIC_CODE; }
        catch { }
        Alarm alarm = Api.ServiceAccessor.GetAlarmService().getAlarm(alarmid);
        if (alarm.ID != null && alarmid != "null")
        {
            alarm.ALARM_ANALYSIS = txtDefect;
            alarm.PROPOSAL = txtAdvice;
            alarm.REMARK = txtNote;
            alarm.REPORT_PERSON = txtReporter;
            alarm.REPORT_DATE = reportdate;
            alarm.STATUS_TIME = DateTime.Now;
            alarm.CODE = afcode;
            alarm.SEVERITY = severity;
            alarm.CUST_ALARM_CODE = Alarmcode;
            if (btntype == "btnOk")
            {
                alarm.STATUS = "AFSTATUS03";
                alarm.DATA_TYPE = "FAULT";
                alarm.STATUS_TIME = DateTime.Now;
                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "报警确认", Api.Util.Public.FunNames.报警监控.ToString(), Public.GetLoginIP, "对报警<a  href=javascript:ShowWinOpen(\\\"../../C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?id=" + alarm.ID + "\\\")>" + alarm.ID + "</a>进行了确认操作", "", true);

            }
            else if (btntype == "btnCan")
            {
                alarm.STATUS = "AFSTATUS02";
                alarm.STATUS_TIME = DateTime.Now;
                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "缺陷取消", Api.Util.Public.FunNames.报警监控.ToString(), Public.GetLoginIP, "对缺陷<a  href=javascript:ShowWinOpen(\\\"../../C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?id=" + alarm.ID + "\\\")>" + alarm.ID + "</a>进行了取消操作", "", true);
            }
            if (Api.ServiceAccessor.GetAlarmService().updateAlarm(alarm))
            {
                responsestr = "1";
            }
        }
        HttpContext.Current.Response.Write(responsestr);
        
        
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}