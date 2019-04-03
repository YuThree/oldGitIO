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
using SharedDefinition;
using System.Web.Script.Serialization;
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

        locname = PublicMethod.GetPositionByAlarmid(c3Alarm.ID);
        localarminfo = "最高温度:" + myfiter.GetTEMP_MAX(c3Alarm)  + "℃&nbsp;" + "环境温度:" + myfiter.GetTEMP_ENV(c3Alarm) + "℃&nbsp;" + "导高值:" + myfiter.GetLINE_HEIGHT( c3Alarm) + "mm&nbsp;" + "拉出值:" + myfiter.GetPULLING_VALUE( c3Alarm )+ "mm&nbsp;" + "速度:" + c3Alarm.SPEED + "km/h&nbsp;";


        string OA = string.IsNullOrEmpty(c3Alarm.OA_PICS) ? "[]" : c3Alarm.OA_PICS;
        string OB = string.IsNullOrEmpty(c3Alarm.OB_PICS) ? "[]" : c3Alarm.OB_PICS;

        //JavaScriptSerializer jss = new JavaScriptSerializer();
        //ShortFaultBasicInfo sbi = jss.Deserialize<ShortFaultBasicInfo>(c3Alarm.SVALUE3);
        //FaultBasicInfo fbi = sbi.ConvertToFaultBasicInfo();

        //foreach (FrameInfo m_info in fbi.FRAME_INFO)
        //{
        //    m_info.LINE_HEIGHT = myfiter.GetLINE_HEIGHT(m_info.LINE_HEIGHT);

        //}



        result = "{\"IR_PICS\":" + c3Alarm.IR_PICS + "," //红外图片
                    + "\"VI_PICS\":" + c3Alarm.VI_PICS + ","//可见光
                    + "\"OA_PICS\":" + OA + ","//全景A
                   + "\"OB_PICS\":" + OB + ","//全景B
                   + "\"FRAME_INFO\":" + c3Alarm.FRAME_INFO + ","//字幕
                   + "\"PLAY_IDX\":" + c3Alarm.PLAY_IDX + ","//播放索引             
                   + "\"FRAME_INFO_LIST\":" + (c3Alarm.FRAME_INFO_LIST==null?"\"\"":c3Alarm.FRAME_INFO_LIST) + ","//红光温度，环境温度等。。           
                   + "\"ch\":\"" + c3Alarm.DETECT_DEVICE_CODE + "\","//车号  
                   + "\"fssj\":\"" + c3Alarm.RAISED_TIME + "\","//发生时间  
                   + "\"line\":\"" + c3Alarm.LINE_NAME + "\","//线路  
                   + "\"position\":\"" + c3Alarm.POSITION_NAME + "\","//站  
                   + "\"SUMMARYDIC\":\"" + c3Alarm.CODE_NAME + "\","//缺陷类型  
                   + "\"km\":\"" + PublicMethod.KmtoString(c3Alarm.KM_MARK) + "\","//公里标  
                   + "\"xb\":\"" + c3Alarm.DIRECTION + "\","//行别  
                   + "\"gis_x\":\"" + c3Alarm.GIS_X.ToString("N2") + "\","//IRV  
                   + "\"gis_y\":\"" + c3Alarm.GIS_Y.ToString("N2") + "\","//IRV  
                   + "\"locname\":\"" + locname + "\","//标题描述  
                   + "\"localarminfo\":\"" + localarminfo + "\"";//报警描述

        result += "}";
        context.Response.Write(Newtonsoft.Json.JsonConvert.DeserializeObject(result));
    }
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}