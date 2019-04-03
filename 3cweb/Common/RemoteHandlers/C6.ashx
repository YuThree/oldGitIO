<%@ WebHandler Language="C#" Class="C6" %>

using System;
using System.Web;
using System.Collections.Generic;
using Api.Fault.entity.alarm;
using Api.Event.entity;
using Api.Foundation.entity.Foundation;
using Api.Foundation.entity.Cond;

public class C6 :ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        bool b = false;
        string message = "";
        try
        {
            string OrgNo = context.Request["OrgNo"]; //
            string substation_no = context.Request["substation_no"]; //变电所编号
            string holder_id = context.Request["holder_id"]; //预制位
            string Description = context.Request["Description"]; //文件名称
            string time = context.Request["time"]; //时间
            AlarmCond alarmcond = new AlarmCond();
            SubstationCond sub = new SubstationCond();
            sub.SUBSTATION_NO = substation_no;
            IList<Substation> listSub = Api.ServiceAccessor.GetFoundationService().querySubstation(sub);
            if (listSub.Count > 0)
            {
                alarmcond.SUBSTATION_CODE = listSub[0].SUBSTATION_CODE;
            }

            alarmcond.businssAnd = " svalue7 like '%" + Description + "%'";
            if (!string.IsNullOrEmpty(time))
            {
                alarmcond.startTime = Convert.ToDateTime(time);
                alarmcond.endTime = Convert.ToDateTime(time);
            }
            alarmcond.CATEGORY_CODE = "6C";
            IList<Alarm> listAlarm = Api.ServiceAccessor.GetAlarmService().getAlarm(alarmcond);
            foreach (Alarm alarm in listAlarm)
            {
                alarm.STATUS = "AFSTATUS05";
                alarm.STATUS_NAME = "已关闭";
                b = Api.ServiceAccessor.GetAlarmService().updateAlarm(alarm);
            }
        }
        catch (Exception ex)
        {

            message += ex.Message;
        }


        context.Response.Write(b + message);
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}