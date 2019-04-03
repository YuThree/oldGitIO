<%@ WebHandler Language="C#" Class="GetIRVUrlByAlarmID" %>

using System;
using System.Web;
using System.Xml;
using Api.Fault.entity.alarm;
using System.Collections.Generic;
using PASS;
using Api.Util;
using Api.Foundation.entity.Foundation;
using System.Web.SessionState;
using Newtonsoft.Json;

public class GetIRVUrlByAlarmID : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        //获取C3ID
        string alarmid = HttpContext.Current.Request["alarmid"];
        string result = null;
        try
        {
            //查询C3
            C3_Alarm c3Alarm = Api.ServiceAccessor.GetAlarmService().getC3Alarm(alarmid);

            string dirPath = c3Alarm.DIR_PATH.Contains("FtpRoot") ? "/" + c3Alarm.DIR_PATH : "/FtpRoot/" + c3Alarm.DIR_PATH;

            result = dirPath + c3Alarm.RAISE_FILE_IR;//IRV


        

        }
        catch
        {
        }
        context.Response.ContentType = "text/XML";
        context.Response.Write(result);
        context.Response.End();
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}