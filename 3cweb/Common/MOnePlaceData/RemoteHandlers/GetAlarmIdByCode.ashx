<%@ WebHandler Language="C#" Class="GetMonitorAlarmC6Form" %>

using System;
using System.Web;
using System.Xml;
using Api.Fault.entity.alarm;
using System.Collections.Generic;

public class GetMonitorAlarmC6Form : ReferenceClass, IHttpHandler
{

    public bool IsReusable { get; set; }
    
    public void ProcessRequest(HttpContext context)
    {
        //获取alarmID
        string code = HttpContext.Current.Request["code"];

        //返回值
        string result = null;
        try
        {
            //获取查询结果
            AlarmCond alarmCond = new AlarmCond();
            alarmCond.DEVICE_ID = code;
            alarmCond.page=1;
            alarmCond.pageSize = 1;
            alarmCond.STATUS = "fault";
            alarmCond.CATEGORY_CODE = "6C";
            alarmCond.orderBy = " RAISED_TIME desc";
            List<Alarm> alarm = Api.ServiceAccessor.GetAlarmService().getAlarm(alarmCond);
            string alarmId=null;
            if(alarm[0].ID!=""&&alarm[0].ID!=null)
            {
                alarmId=alarm[0].ID;
            }

            result = alarmId;
            context.Response.Write(Newtonsoft.Json.JsonConvert.DeserializeObject(result));
            context.Response.End();
            context.Response.Clear();

        }
        catch (Exception ex)
        {
            result = null;
        }
    }
}