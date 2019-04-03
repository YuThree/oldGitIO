<%@ WebHandler Language="C#" Class="PreviousAlarm" %>

using System;
using System.Web;
using Api.Fault.entity.alarm;

public class PreviousAlarm :  ReferenceClass, IHttpHandler {

    public void ProcessRequest (HttpContext context) {

        // C3_AlarmCond m_cond= my_alarm.GetC3_AlermCond_byListWhere();
        C3_AlarmCond m_cond= my_alarm.GetC3_AlermCond_AlarmList();
        //m_cond.ID = null;
        //m_cond.myPara1 = context.Request.QueryString["alarmID"].ToString();
        m_cond.RAISED_TIME = context.Request["raised_time"]==null?DateTime.Now.AddDays(-1):Convert.ToDateTime(context.Request["raised_time"]);
        m_cond.CATEGORY_CODE = "3C";

        string ID_next = Api.ServiceAccessor.GetAlarmService().getAlarmPriorID(m_cond);
        context.Response.Write(ID_next);
    }

    public bool IsReusable {
        get {
            return false;
        }
    }

}