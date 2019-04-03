<%@ WebHandler Language="C#" Class="GetEvent" %>

using System;
using System.Web;
using Api.Event.entity;
using System.Collections.Generic;
using System.Text;
using Api.Fault.entity.alarm;

public class GetEvent : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        string type = context.Request["type"];

        switch (type)
        {
            case "GetModel":
                GetModel(context);
                break;

        }
    }


    private void GetModel(HttpContext context)
    {
        string deviceid = context.Request["deviceId"];
        string category = context.Request["category"];

        string eventid = "";
        string harddiskID = "";
        switch (category)
        {
            case "1C":
                C1EventCond c1EventCond = new C1EventCond();
                c1EventCond.DEVICE_ID = deviceid;
                c1EventCond.orderBy = " RAISED_TIME DESC ";
                IList<C1Event> c1list = Api.ServiceAccessor.GetEventService().queryC1Event(c1EventCond);
                if (c1list.Count > 0)
                {
                    eventid = c1list[0].ID;
                    harddiskID = c1list[0].HARDDISK_MANAGE_ID;
                }
                break;
            case "2C":
                C2EventCond c2EventCond = new C2EventCond();
                c2EventCond.DEVICE_ID = deviceid;
                c2EventCond.orderBy = " SAMPLLED_TIME DESC ";
                IList<C2Event> c2list = Api.ServiceAccessor.GetEventService().getC2EventDetail(c2EventCond);
                if (c2list.Count > 0)
                {
                    eventid = c2list[0].ID;
                    harddiskID = c2list[0].HARDDISK_MANAGE_ID;
                }
                break;
            case "3C":
                C3_AlarmCond c3AlarmCond = new C3_AlarmCond();
                c3AlarmCond.DEVICE_ID = deviceid;
                IList<C3_Alarm> c3list = Api.ServiceAccessor.GetAlarmService().getC3Alarm(c3AlarmCond);
                if (c3list.Count > 0)
                {
                    eventid = c3list[0].ID;
                    harddiskID = c3list[0].HARDDISK_MANAGE_ID;
                }
                break;
            case "4C":
                C4EventCond c4EventCond = new C4EventCond();
                c4EventCond.DEVICE_ID = deviceid;
                c4EventCond.orderBy = " SAMPLLED_TIME DESC ";
                IList<C4Event> c4list = Api.ServiceAccessor.GetEventService().getC4EventDetail(c4EventCond);
                if (c4list.Count > 0)
                {
                    eventid = c4list[0].ID;
                    harddiskID = c4list[0].HARDDISK_MANAGE_ID;
                }
                break;
        }




        StringBuilder Json = new StringBuilder();
        Json.Append("{");
        Json.Append("\"eventID\":\"" + eventid + "\", ");
        Json.Append("\"harddiskID\":\"" + harddiskID + "\", ");
        Json.Append("}");

        HttpContext.Current.Response.Write(Json.ToString());



    }


    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}