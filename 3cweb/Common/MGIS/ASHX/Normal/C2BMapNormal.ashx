<%@ WebHandler Language="C#" Class="C2BMapNormal" %>

using System;
using System.Web;
using System.Text;
using Newtonsoft.Json;
using System.Data;
using System.Collections.Generic;
using Api.Fault.entity.alarm;
using System.Collections.Generic;
using Api.Event.service;
using Api.Event.entity;
using Api.Foundation.entity.Foundation;

public class C2BMapNormal : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        string type = context.Request["type"];
        if (type == "0")
        {
            Event.Impl.EventServiceImpl.index = 0;
            Event.Impl.EventServiceImpl.jump = 0;
            HttpContext.Current.Response.Write("");
            
            
        }
        if (type == "1")
        {
            string lat = context.Request["lat"];
            string log = context.Request["log"];
            GetPicPath(lat, log);
        }
        else
        {
            string direction = context.Request["direction"];
            string harddisk_id = context.Request["harddisk_id"];
            GetC2EventJson(harddisk_id, Convert.ToInt32(direction));
        }
    }
    private static void GetC2EventJson(string harddisk_id, int direction)
    {
        string strConn = System.Configuration.ConfigurationManager.AppSettings["FtpRoot"].ToString();
        C2EventCond cond = new C2EventCond();
        cond.HARDDISK_MANAGE_ID = harddisk_id;
        cond.orderBy = " SAMPLLED_TIME ASC ";
        //cond.ORG_CODE = "TOPBOSS-TYJ-DTX-LC-LC";
        C2Event c2event = Api.ServiceAccessor.GetEventService().getC2EventDetailForQJ(cond, direction);
        if (c2event == null)
        {
            return;
        }
        if (!String.IsNullOrEmpty(c2event.BRG_TUN_CODE) && c2event.BRG_TUN_NAME.Contains("隧道"))//如果是隧道就跳过
        {
            GetC2EventJson(harddisk_id, direction);
            return;
        }
        //C2巡检支柱关联的缺陷
        C2_AlarmCond c2alarmCond = new C2_AlarmCond();
        c2alarmCond.HARDDISK_MANAGE_ID = harddisk_id;
        c2alarmCond.DEVICE_ID = c2event.DEVICE_ID;
        IList<C2_Alarm> c2alarmList = Api.ServiceAccessor.GetAlarmService().getC2Alarm(c2alarmCond);

        StringBuilder Json = new StringBuilder();
        Json.Append("[");
        Json.Append("{");
        if (c2alarmList.Count > 0)
        {
            Json.Append("ALARM_ID:\"" + c2alarmList[0].ID + "\",");
            Json.Append("ALARM_GIS_X:\"" + c2alarmList[0].GIS_X + "\",");
            Json.Append("ALARM_GIS_Y:\"" + c2alarmList[0].GIS_Y + "\",");
        }
        else
        {
            Json.Append("ALARM_ID:\"" + "" + "\",");
            Json.Append("ALARM_GIS_LON:\"" + "" + "\",");
            Json.Append("ALARM_GIS_LAT:\"" + "" + "\",");
        }
        Json.Append("EVENT_ID:\"" + c2event.ID + "\",");
        Json.Append("DEVICE_ID:\"" + c2event.DEVICE_ID + "\",");
        Json.Append("PIC_PATH_100W:\"" + strConn + "/" + c2event.PIC_PATH_100W + "\",");
        Json.Append("PIC_PATH_500W:\"" + strConn + "/" + c2event.PIC_PATH_500W + "\",");
        if (c2event.GIS_X == 0)
        {
            Pole pole = Api.ServiceAccessor.GetFoundationService().queryPoleByPoleCode(c2event.DEVICE_ID);
            Json.Append("GIS_LON:\"" + pole.GIS_LON + "\",");
            Json.Append("GIS_LAT:\"" + pole.GIS_LAT + "\",");
        }
        else
        {
            Json.Append("GIS_LON:\"" + c2event.GIS_X + "\",");
            Json.Append("GIS_LAT:\"" + c2event.GIS_Y + "\",");
        }


        Json.Append("LINE_NAME:\"" + c2event.LINE_NAME + "\",");
        Json.Append("POSITION_NAME:\"" + c2event.POSITION_NAME + "\",");
        Json.Append("POLE:\"" + c2event.POLE_NO + "\",");

        Json.Append("KMSTANDARD:\"" + "K" + Convert.ToInt32(c2event.KM_MARK) / 1000 + "+" + Convert.ToInt32(c2event.KM_MARK) % 1000 + "\",");
        Json.Append("LineCode:\"" + c2event.LINE_CODE + "\"");
        Json.Append("},");
        Json.Append("]");
        HttpContext.Current.Response.Write(Json);
        
        
    }

    private static void GetC2EventJson(string harddisk_id)
    {
        string strConn = System.Configuration.ConfigurationManager.AppSettings["FtpRoot"].ToString();
        C2EventCond cond = new C2EventCond();
        cond.HARDDISK_MANAGE_ID = harddisk_id;
        //cond.ORG_CODE = "TOPBOSS-TYJ-DTX-LC-LC";
        IList<C2Event> list = Api.ServiceAccessor.GetEventService().getC2EventDetailForQJ(cond);
        if (list.Count == 0)
        {
            return;
        }
        StringBuilder Json = new StringBuilder();
        Json.Append("[");
        foreach (C2Event c2event in list)
        {
            Json.Append("{");
            Json.Append("EVENT_ID:\"" + c2event.ID + "\",");
            Json.Append("DEVICE_ID:\"" + c2event.DEVICE_ID + "\",");
            Json.Append("PIC_PATH_100W:\"" + strConn + "/" + c2event.PIC_PATH_100W + "\",");
            Json.Append("PIC_PATH_500W:\"" + strConn + "/" + c2event.PIC_PATH_500W + "\",");
            if (!String.IsNullOrEmpty(c2event.DEVICE_ID))
            {
                Pole pole = Api.ServiceAccessor.GetFoundationService().queryPoleByPoleCode(c2event.DEVICE_ID);
                Json.Append("GIS_LON:\"" + pole.GIS_LON + "\",");
                Json.Append("GIS_LAT:\"" + pole.GIS_LAT + "\"");
            }
            else
            {
                Json.Append("GIS_LON:\"\",");
                Json.Append("GIS_LAT:\"\"");

            }

            Json.Append("LINE_NAME:\"" + c2event.LINE_NAME + "\",");
            Json.Append("POSITION_NAME:\"" + c2event.POSITION_NAME + "\",");
            Json.Append("POLE:\"" + c2event.POLE_NO + "\",");
            Json.Append("KMSTANDARD:\"" + "K" + Convert.ToInt32(c2event.KM_MARK) / 1000 + "+" + Convert.ToInt32(c2event.KM_MARK) % 1000 + "\"");

            Json.Append("},");
        }
        Json.Append("]");
        HttpContext.Current.Response.Write(Json);
        
        
    }

    private static void GetPicPath(string lat, string log)
    {
        C2EventCond c2Cond = new C2EventCond();
        Pole pole = new Pole();
        pole.GIS_LAT = Convert.ToDouble(lat);
        pole.GIS_LON = Convert.ToDouble(log);

        //  c2Cond.pole = pole; By wcg 20150819

        string strConn = System.Configuration.ConfigurationManager.AppSettings["FtpRoot"].ToString();
        IList<C2Event> list = Api.ServiceAccessor.GetEventService().getC2EventDetailForQJ(c2Cond);
        StringBuilder Json = new StringBuilder();
        if (list.Count > 0)
        {
            Json.Append("[");
            Json.Append("{");
            Json.Append("PIC_PATH_100W:\"" + strConn + "/" + list[0].PIC_PATH_100W + "\",");
            Json.Append("POSITION_NAME:\"" + list[0].POSITION_NAME + "\",");
            Json.Append("KMSTANDARD:\"" + "K" + Convert.ToInt32(list[0].KM_MARK) / 1000 + "+" + Convert.ToInt32(list[0].KM_MARK) % 1000 + "\",");
            Json.Append("PIC_PATH_500W:\"" + strConn + "/" + list[0].PIC_PATH_500W + "\"");
            Json.Append("}");
            Json.Append("]");
        }
        else
        {
            Json.Append("[");
            Json.Append("{");
            Json.Append("PIC_PATH_100W:\"" + "" + "\",");
            Json.Append("POSITION_NAME:\"" + "" + "\",");
            Json.Append("KMSTANDARD:\"" + "" + "\",");
            Json.Append("PIC_PATH_500W:\"" + "" + "\"");
            Json.Append("}");
            Json.Append("]");
        }
        HttpContext.Current.Response.Write(Json);
        
        
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}