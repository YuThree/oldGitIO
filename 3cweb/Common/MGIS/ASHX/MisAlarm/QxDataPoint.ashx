<%@ WebHandler Language="C#" Class="QxDataPoint" %>

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

public class QxDataPoint : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        AlarmCond alarmcond = new AlarmCond();
        if (context.Request["Category_Code"].ToString() != "DPC" && !string.IsNullOrEmpty(context.Request["Category_Code"].ToString()))
        {
            alarmcond.CATEGORY_CODE = context.Request["Category_Code"];
        }
        alarmcond.DATA_TYPE = "FAULT";
        alarmcond.page = 1;
        alarmcond.orderBy = "  RAISED_TIME desc ";
        //if (!String.IsNullOrEmpty(context.Request["LINE_CODE"]))
        //{
        //    alarmcond.LINE_CODE = context.Request["LINE_CODE"];
        //}
        //if (!String.IsNullOrEmpty(context.Request["XB"]))
        //{
        //   // alarmcond.DIRECTION = context.Request["XB"];
        //}
        if (!String.IsNullOrEmpty(context.Request["ID"]))
        {
            alarmcond.HARDDISK_MANAGE_ID = context.Request["ID"];
        }

        //alarmcond.businssAnd += " gis_x !=0 and status <> 'AFSTATUS05'  and status <> 'AFSTATUS02' and device_id is not null";
        alarmcond.page = 1;
        alarmcond.pageSize = Int32.Parse(ConfigurationManager.AppSettings["FaultCount"]);
        List<Alarm> alarmlist = Api.ServiceAccessor.GetAlarmService().getAlarm(alarmcond);
        StringBuilder Json = new StringBuilder();
        Json.Append("[");
        if (alarmlist != null)
        {
            for (int i = 0; i < alarmlist.Count; i++)
            {
                Json.Append("{");
                Json.Append("\"GIS_X\":\"" + alarmlist[i].GIS_X + "\",");
                Json.Append("\"GIS_Y\":\"" + alarmlist[i].GIS_Y + "\",");
                Json.Append("\"RAISED_TIME\":\"" + alarmlist[i].RAISED_TIME.ToString("yyyy-MM-dd HH:mm:ss") + "\",");
                Json.Append("\"ALARM_ID\":\"" + alarmlist[i].ID + "\",");
                Json.Append("\"POLE_NUMBER\":\"" + alarmlist[i].POLE_NUMBER + "\",");
                Json.Append("\"BRG_TUN_NAME\":\"" + alarmlist[i].BRG_TUN_NAME + "\",");
                Json.Append("\"POSITION_NAME\":\"" + alarmlist[i].POSITION_NAME + "\",");
                Json.Append("\"BUREAU_CODE\":\"" + alarmlist[i].BUREAU_CODE + "\",");
                Json.Append("\"SEVERITY\":\"" + PublicMethod.getCode_Name(alarmlist[i].SEVERITY) + "\",");
                Json.Append("\"CODE_NAME\":\"" + alarmlist[i].CODE_NAME + "\",");
                Json.Append("\"CATEGORY_CODE\":\"" + alarmlist[i].CATEGORY_CODE + "\"");


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