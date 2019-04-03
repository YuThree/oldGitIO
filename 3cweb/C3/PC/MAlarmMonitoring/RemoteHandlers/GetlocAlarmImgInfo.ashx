<%@ WebHandler Language="C#" Class="GetlocAlarmImgInfo" %>

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
using System.Configuration;

public class GetlocAlarmImgInfo : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        //获取C3ID
        string alarmid = HttpContext.Current.Request["alarmid"];
        //返回值
        string result = null;
        C3_Alarm c3Alarm = Api.ServiceAccessor.GetAlarmService().getC3Alarm(alarmid);
        string c3IMA;//IMA地址
        string c3JPG;
        string c3ALL;
        string locname;//标题描述
        string localarminfo;//报警描述
        try { c3IMA = c3Alarm.SNAPPED_IMA.Replace(".IMA", "_IRV"); }
        catch { c3IMA = ""; }
        try { c3JPG = c3Alarm.SNAPPED_JPG.Replace(".JPG", ""); }
        catch { c3JPG = ""; }
        try
        {
            if (c3Alarm.OV_INFO.OV_FLAG != 0)
            {
                if (c3Alarm.OV_INFO.OV_FLAG == 2)
                {
                    c3ALL = c3Alarm.OV_INFO.ALARM_OVERVIEW2.Substring(0, c3Alarm.OV_INFO.ALARM_OVERVIEW2.LastIndexOf('.'));
                }
                else
                {
                    c3ALL = c3Alarm.OV_INFO.ALARM_OVERVIEW1.Substring(0, c3Alarm.OV_INFO.ALARM_OVERVIEW1.LastIndexOf('.'));
                }
            }
            else
            {
                c3ALL = "";
            }
        }
        catch { c3ALL = ""; }
        locname = PublicMethod.GetPositionByAlarmid(c3Alarm.ID);
        localarminfo = "最高温度:" + myfiter.GetTEMP_MAX(c3Alarm) + "℃&nbsp;" + "环境温度:" + myfiter.GetTEMP_ENV(c3Alarm) + "℃&nbsp;" + "导高值:" + c3Alarm.LINE_HEIGHT + "mm&nbsp;" + "拉出值:" + c3Alarm.PULLING_VALUE + "mm&nbsp;" + "速度:" + c3Alarm.SPEED + "km/h&nbsp;";
        //localarminfo = "最高温度:" + double.Parse(c3Alarm.MAX_TEMP.ToString()) / 100 + "℃&nbsp;" + "环境温度:" + double.Parse(c3Alarm.ENV_TEMP.ToString()) / 100 + "℃&nbsp;" + "导高值:" + c3Alarm.LINE_HEIGHT + "mm&nbsp;" + "拉出值:" + c3Alarm.PULLING_VALUE + "mm&nbsp;" + "速度:" + c3Alarm.SPEED + "km/h&nbsp;";

        //localarminfo += "<a>下载</a>";
        result = "{\"SNAPPED_IMA\":\"" + c3IMA + "\"," //红外图片
                   + "\"SNAPPED_JPG\":\"" + "/Images_" + "\","//可见光
                   + "\"ALLIMG\":\"" + c3ALL + "/Images_" + "\","//可见光
                   + "\"DIR_PATH\":\"" + PublicMethod.C3FtpRoot + "/" + c3Alarm.DIR_PATH + "\","//可见光
                   + "\"IRV\":\"" + PublicMethod.C3FtpRoot + "/" + c3Alarm.DIR_PATH + c3Alarm.RAISE_FILE_IR + "\","//IRV  
                   + "\"ch\":\"" + c3Alarm.DETECT_DEVICE_CODE + "\","//车号  
                   + "\"fssj\":\"" + c3Alarm.RAISED_TIME + "\","//发生时间  
                   + "\"line\":\"" + c3Alarm.LINE_NAME + "\","//线路  
                   + "\"position\":\"" + c3Alarm.POSITION_NAME + "\","//站  
                   + "\"km\":\"" + PublicMethod.KmtoString(c3Alarm.KM_MARK) + "\","//公里标  
                   + "\"xb\":\"" + c3Alarm.DIRECTION + "\","//行别  
                   + "\"gis_x\":\"" + c3Alarm.GIS_X.ToString("N2") + "\","//IRV  
                   + "\"gis_y\":\"" + c3Alarm.GIS_Y.ToString("N2") + "\","//IRV  
                   + "\"locname\":\"" + locname + "\","//标题描述  
                   + "\"localarminfo\":\"" + localarminfo + "\"";//报警描述
        result += "}";
        context.Response.Write(Newtonsoft.Json.JsonConvert.DeserializeObject(result));
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