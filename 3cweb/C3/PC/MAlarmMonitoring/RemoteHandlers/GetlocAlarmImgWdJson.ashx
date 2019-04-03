<%@ WebHandler Language="C#" Class="GetlocAlarmImgWdJson" %>

using System;
using System.Web;
using System.Xml;
using Api.Fault.entity.alarm;
using System.Collections.Generic;
public class GetlocAlarmImgWdJson : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        ////获取alarmID
        string alarmid = HttpContext.Current.Request["alarmid"];
        Get10JsonByAlarmid(alarmid, context);
    }

    public void Get10JsonByAlarmid(string alarmid, HttpContext context)
    {
        C3_Alarm c3Alarm = Api.ServiceAccessor.GetAlarmService().getC3Alarm(alarmid);
        if (c3Alarm.IR_ANASTRING != null && c3Alarm.IR_ANASTRING != "")
        {
            string Json = c3Alarm.IR_ANASTRING;
            context.Response.Cache.SetCacheability(HttpCacheability.NoCache);
            context.Response.ContentType = "text/plain";
            object myObj = Newtonsoft.Json.JsonConvert.DeserializeObject(Json.ToString());
            context.Response.Write(myObj);
        }

    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }



}