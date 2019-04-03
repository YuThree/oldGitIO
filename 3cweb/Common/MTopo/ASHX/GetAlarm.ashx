<%@ WebHandler Language="C#" Class="GetAlarm" %>

using System;
using System.Web;
using System.Text;
using Newtonsoft.Json;
using System.Data;
using Api.Fault.entity.alarm;
using System.Collections.Generic;
using Api.Fault.entity.sms;
using Api.Foundation.entity.Cond;
using System.Configuration;

public class GetAlarm : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        String ID = context.Request.QueryString["ID"];//ID
        AlarmCond alarmcond = new AlarmCond();
        alarmcond.ID = ID;
        List<Alarm> alarmlist = Api.ServiceAccessor.GetAlarmService().getAlarm(alarmcond);
        StringBuilder Json = new StringBuilder();
        Json.Append("[");
        if (alarmlist != null)
        {
            for (int i = 0; i < alarmlist.Count; i++)
            {
                Json.Append("{");
                Json.Append("GIS_X:\"" + alarmlist[i].GIS_X + "\",");
                Json.Append("GIS_Y:\"" + alarmlist[i].GIS_Y + "\",");
                Json.Append("RAISED_TIME:\"" + alarmlist[i].RAISED_TIME + "\",");
                Json.Append("ALARM_ID:\"" + alarmlist[i].ID + "\",");
                Json.Append("BUREAU_CODE:\"" + alarmlist[i].BUREAU_CODE + "\",");
                Json.Append("CATEGORY_CODE:\"" + alarmlist[i].CATEGORY_CODE + "\"");


                if (i < alarmlist.Count - 1)
                {
                    Json.Append("},");
                }
                else
                {
                    Json.Append("}");
                }
            }
        }
        Json.Append("]");
        context.Response.Write(Json.ToString());
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}