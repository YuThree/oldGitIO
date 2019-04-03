<%@ WebHandler Language="C#" Class="locPs3orPs4" %>

using System;
using System.Web;
using System.IO;
using System.Data;
using System.Collections.Generic;
using Api.Foundation.entity.Foundation;
using Api.Foundation.entity.Cond;
using Api.Fault.entity.alarm;

public class locPs3orPs4 : ReferenceClass, IHttpHandler
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
            Locomotive loc = Api.ServiceAccessor.GetFoundationService().getLocomotiveByCode(c3Alarm.DETECT_DEVICE_CODE);
            result = loc.DEVICE_VERSION;

        }
        catch
        {
        }
        context.Response.ContentType = "text/XML";
        context.Response.Write(result);
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}