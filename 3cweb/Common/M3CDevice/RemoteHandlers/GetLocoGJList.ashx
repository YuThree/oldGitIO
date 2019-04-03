<%@ WebHandler Language="C#" Class="GetLocoGJList" %>

using System;
using System.Web;
using System.Xml;
using Api.Fault.entity.sms;
using System.Collections.Generic;
using Api.Foundation.entity.Foundation;
using Api.Foundation.entity.Cond;

public class GetLocoGJList : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {

        //获取设备编号
        string locid = HttpContext.Current.Request["locid"];
        //获取日期
        DateTime startdate = DateTime.Parse(HttpContext.Current.Request["startdate"]);
        string enddatastr = HttpContext.Current.Request["enddate"];
        if (enddatastr.Length < 12)
        {
            enddatastr += " 23:59:59";
        }
        DateTime enddate = DateTime.Parse(enddatastr);
        string jl = HttpContext.Current.Request["jl"];
        //局
        string ju = HttpContext.Current.Request["ju"];
        //机务段
        string jwd = HttpContext.Current.Request["jwd"];


        //返回值
        string result = null;
        try
        {
            //获取前台页码
            int pageIndex = Convert.ToInt32(HttpContext.Current.Request["page"]);
            //获取前台条数
            int pageSize = Convert.ToInt32(HttpContext.Current.Request["rp"]);

            C3_SmsCond c3 = new C3_SmsCond();
            if (ju != null && ju != "0")
            {
                c3.BUREAU_CODE = ju;
            }
            if (jwd != null && jwd != "0")
            {
                c3.P_ORG_CODE = jwd;
            }
            if (locid != null && locid != "")
            {
                c3.LOCOMOTIVE_CODE = locid;
            }

            c3.startTime = startdate;
            c3.endTime = enddate;
            if (jl != null && jl != "")
            {
                c3.ROUTING_NO = jl;
            }
            c3.page = pageIndex;
            c3.pageSize = pageSize;
            c3.orderBy = " DETECT_TIME DESC ";
            //设备轨迹
            List<C3_Sms> locgj = Api.ServiceAccessor.GetSmsService().getC3SmsbyCondition(c3);

            //总条数
            int recordCount = Api.ServiceAccessor.GetSmsService().getC3SmsCount(c3);
            string jsonStr = "{'rows':[";
            Locomotive loc = new Locomotive();
            for (int i = 0; i < locgj.Count; i++)
            {
                loc = Api.Util.Common.getLocomotiveInfo(locgj[i].LOCOMOTIVE_CODE);//.ServiceAccessor.GetFoundationService().getLocomotiveByCode(locgj[i].TRAIN_NO);
                jsonStr += "{'TRAIN_NO':'" + locgj[i].LOCOMOTIVE_CODE + "',";//设备编号
                jsonStr += "'DETECT_TIME':'" + locgj[i].DETECT_TIME + "',";//时间
                jsonStr += "'CROSSING_NO':'" + locgj[i].ROUTING_NO + "',";//交路号
                jsonStr += "'SECTION_AREA_NUM':'" + locgj[i].AREA_NO + "',";//运用区段   Api.Util.Common.getRoutingInfo(locgj[i].BUREAU_CODE + locgj[i].ROUTING_NO).AREA_SECTION
                jsonStr += "'KM_MARK':'" + PublicMethod.KmtoString(locgj[i].KM_MARK) + "',";//公里标   
                jsonStr += "'SPEED':'" + locgj[i].SPEED + "',";//速度  
               
                jsonStr += "'IRV_TEMP':'" + myfiter.GetTEMP_MAX_Full(locgj[i],loc.DEVICE_VERSION,loc.DEVICE_BOW_RELATIONS) + "',";//4红外温度
                jsonStr+= "'SENSOR_TEMP':'" + myfiter.GetTEMP_ENV_Full(locgj[i],loc.DEVICE_VERSION,loc.DEVICE_BOW_RELATIONS) + "',";//环境温度     


                jsonStr += "'SATELLITE_NUM':'" + locgj[i].SATELLITE_NUM + "',";//卫星数量
                jsonStr += "'IS_CONNECTED_OV':'" + PublicMethod.TOzt(locgj[i].IS_CON_OV, loc.DEVICE_VERSION,locgj[i].DEVICE_GROUP_NO,loc.DEVICE_BOW_RELATIONS) + "',";//全景设备连接状态
                jsonStr += "'IS_RECORD_OV':'" + PublicMethod.TOzt(locgj[i].IS_REC_OV, loc.DEVICE_VERSION,locgj[i].DEVICE_GROUP_NO,loc.DEVICE_BOW_RELATIONS) + "',";//全景设备录像状态

                jsonStr += "'LINE_HEIGHT':'" + locgj[i].LINE_HEIGHT_1 + "',";//导高
                jsonStr += "'PULLING_VALUE':'" + locgj[i].PULLING_VALUE_1 + "',";//拉出
                jsonStr += "'GIS_X':'" + locgj[i].GIS_LON + "',";//经度
                jsonStr += "'GIS_Y':'" + locgj[i].GIS_LAT + "',";//纬度
                //jsonStr += "'wz':'" + locgj[i].POSITION_ID + "',";//弓状态
                jsonStr += "'wz':'" + PublicMethod.GetPositionBySMSID(locgj[i]) + "',";//弓状态
                jsonStr += "'SENSOR':'" + PublicMethod.TOzt(locgj[i].TEMP_SENSOR_STATUS, loc.DEVICE_VERSION,locgj[i].DEVICE_GROUP_NO,loc.DEVICE_BOW_RELATIONS) + "',";//弓状态
                jsonStr += "'CIR':'" + PublicMethod.TOzt(locgj[i].IS_CON_IR, loc.DEVICE_VERSION,locgj[i].DEVICE_GROUP_NO,loc.DEVICE_BOW_RELATIONS) + "',";//弓状态
                jsonStr += "'CVI':'" + PublicMethod.TOzt(locgj[i].IS_CON_VI, loc.DEVICE_VERSION,locgj[i].DEVICE_GROUP_NO,loc.DEVICE_BOW_RELATIONS) + "',";//弓状态
                jsonStr += "'RIR':'" + PublicMethod.TOzt(locgj[i].IS_REC_IR, loc.DEVICE_VERSION,locgj[i].DEVICE_GROUP_NO,loc.DEVICE_BOW_RELATIONS) + "',";//弓状态
                jsonStr += "'RVI':'" + PublicMethod.TOzt(locgj[i].IS_REC_VI, loc.DEVICE_VERSION,locgj[i].DEVICE_GROUP_NO,loc.DEVICE_BOW_RELATIONS) + "',";//弓状态

                jsonStr += "'BOW_STATUS':'" + PublicMethod.TOzt(locgj[i].BOW_STATUS, loc.DEVICE_VERSION,locgj[i].DEVICE_GROUP_NO,loc.DEVICE_BOW_RELATIONS) + "',";//弓状态
               // jsonStr += "'TRAIN_STATUS':'" + PublicMethod.TolocStatus(locgj[i].TRAIN_STATUS, loc.DEVICE_VERSION) + "'";//运行状态                      
                jsonStr += " },";
            }
            if (jsonStr.LastIndexOf(',') > 0)
            {
                jsonStr = jsonStr.Substring(0, jsonStr.LastIndexOf(',')) + "],'page':" + pageIndex + ",'rp':" + pageSize + ",'total':" + recordCount + "}";
            }
            else
            {
                jsonStr += "],'page':'" + pageIndex + "','rp':'" + pageSize + "','total':'" + recordCount + "'}";

            }

            jsonStr = jsonStr.Replace("'", "\"");
            HttpContext.Current.Response.Write(jsonStr);
        }
        catch
        {

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