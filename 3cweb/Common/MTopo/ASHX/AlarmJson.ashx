<%@ WebHandler Language="C#" Class="AlarmJson" %>

using System;
using System.Web;
using System.Xml;
using Api.Fault.entity.alarm;
using Api.Event.entity;
using Api.Foundation.entity.Foundation;
using Api.Foundation.entity.Cond;
using System.Collections.Generic;
using System.Text;

public class AlarmJson : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {

        string deviceid = HttpContext.Current.Request["deviceid"];//"WHJJJXD105$00000$001760"; 
        string type = HttpContext.Current.Request["type"];
        string subCode = HttpContext.Current.Request["subCode"];
        string datatype = HttpContext.Current.Request["datatype"];
        string Json = "";
        if (type == "Name")
        {
           // Json = GetC6NameJson(deviceid, subCode);
        }
        else if (type == "Value2")
        {
            Json = GetC6Value2Json(deviceid, subCode);
        }
        else
        {
            Json = GetC6ValueJson(deviceid, subCode);
        }
        context.Response.Cache.SetCacheability(HttpCacheability.NoCache);
        context.Response.ContentType = "text/plain";
        object myObj = Newtonsoft.Json.JsonConvert.DeserializeObject(Json.ToString());
        context.Response.Write(myObj);
    }
    /// <summary>
    /// 获取趋势图JSON串
    /// </summary>
    /// <param name="device">设备名称</param>
    /// <param name="datatype">数据类型</param>
    /// <returns></returns>
    public string GetC6ValueJson(string device, string subCode)
    {
        string Json = "";
        //条件 
        AlarmCond alarmcond = new AlarmCond();
        alarmcond.POWER_DEVICE_CODE = device;
        alarmcond.SUBSTATION_CODE = subCode;
        alarmcond.page = 1;
        alarmcond.pageSize = 48;
        alarmcond.CATEGORY_CODE = "3C";
        alarmcond.orderBy = " RAISED_TIME desc";
        List<Alarm> alarmlist = Api.ServiceAccessor.GetAlarmService().getAlarm(alarmcond);

        Json += "[";
        for (int i = 0; i < alarmlist.Count; i++)
        {

            Json += alarmlist[i].NVALUE2 + ",";//环境温度


        }
        Json += "]";

        return Json;
    }
    /// <summary>
    /// 获取趋势图JSON串
    /// </summary>
    /// <param name="device">设备名称</param>
    /// <param name="datatype">数据类型</param>
    /// <returns></returns>
    public string GetC6Value2Json(string device, string subCode)
    {
        string Json = "";
        //条件 
        AlarmCond alarmcond = new AlarmCond();
        alarmcond.POWER_DEVICE_CODE = device;
        alarmcond.SUBSTATION_CODE = subCode;
        alarmcond.page = 1;
        alarmcond.pageSize = 48;
        alarmcond.CATEGORY_CODE = "6C";
        alarmcond.orderBy = " RAISED_TIME desc";
        List<Alarm> alarmlist = Api.ServiceAccessor.GetAlarmService().getAlarm(alarmcond);

        Json += "[";
        for (int i = 0; i < alarmlist.Count; i++)
        {

            Json += alarmlist[i].NVALUE3 + ",";//环境温度


        }
        Json += "]";

        return Json;
    }
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}