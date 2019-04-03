<%@ WebHandler Language="C#" Class="GetLocoGJList" %>

using System;
using System.Web;
using System.Xml;
using Api.Fault.entity.sms;
using System.Collections.Generic;
using Api.Foundation.entity.Foundation;
using Api.Foundation.entity.Cond;

/// <summary>
/// 检测运行轨迹列表-查看详细列表
/// </summary>
public class GetLocoGJList : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        string sensor;
        //获取设备编号
        string locid = HttpContext.Current.Request["locid"];
        //获取日期
        DateTime startdate = DateTime.Parse(HttpContext.Current.Request["startdate"]);
        string enddatastr = HttpContext.Current.Request["enddate"];
        string LINE_CODE = HttpContext.Current.Request["LINE_CODE"];
        string DIRECTION = HttpContext.Current.Request["DIRECTION"];
        if (enddatastr.Length < 12)
        {
            enddatastr += " 23:59:59";
        }
        DateTime enddate = DateTime.Parse(enddatastr);
        string jl = HttpContext.Current.Request["jl"];
        string ju = HttpContext.Current.Request["ju"];//局
        string jwd = HttpContext.Current.Request["jwd"];//机务段

        try
        {
            int pageIndex = Convert.ToInt32(HttpContext.Current.Request["page"]);//获取前台页码
            int pageSize = Convert.ToInt32(HttpContext.Current.Request["rp"]); //获取前台条数

            C3_SmsCond c3 = new C3_SmsCond();
            c3.businssAnd = " 1=1 ";
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
            if (!string.IsNullOrEmpty(LINE_CODE))
            {
                if (LINE_CODE == "-1")
                {
                    c3.businssAnd += " and line_code is null  ";
                }
                else
                {

                    c3.LINE_CODE = LINE_CODE;
                }
            }
            if (DIRECTION == "-1")
            {
                c3.businssAnd += " and DIRECTION is null";
            }
            else if (!string.IsNullOrEmpty(DIRECTION))
            {
                c3.DIRECTION = DIRECTION;
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
            //    string jsonStr = "{'rows':[";

            System.Text.StringBuilder jsonStr = new System.Text.StringBuilder();
            jsonStr.Append("{'rows':[");

            Locomotive loc = new Locomotive();
            for (int i = 0; i < locgj.Count; i++)
            {
                if (i > 0)
                    jsonStr.Append(",");

                loc = Api.Util.Common.getLocomotiveInfo(locgj[i].LOCOMOTIVE_CODE);

                jsonStr.Append("{'TRAIN_NO':'" + locgj[i].LOCOMOTIVE_CODE + "',");//设备编号
                jsonStr.Append("'DETECT_TIME':'" + locgj[i].DETECT_TIME + "',");//时间
                jsonStr.Append("'CROSSING_NO':'" + locgj[i].ROUTING_NO + "',");//交路号
                jsonStr.Append("'SECTION_AREA_NUM':'" + Api.Util.Common.getRoutingInfo(locgj[i].BUREAU_CODE + locgj[i].ROUTING_NO).AREA_SECTION + "',");//运用区段
                jsonStr.Append("'KM_MARK':'" + PublicMethod.KmtoString(locgj[i].KM_MARK) + "',");//公里标   
                jsonStr.Append("'SPEED':'" + myfiter.GetSpeed(locgj[i].SPEED) + "',");//速度  
                               
                jsonStr.Append("'IRV_TEMP':'" + myfiter.GetTEMP_MAX_Full(locgj[i],loc.DEVICE_VERSION,loc.DEVICE_BOW_RELATIONS) + "',");//4红外温度

                jsonStr.Append("'SENSOR_TEMP':'" + myfiter.GetTEMP_ENV_Full(locgj[i],loc.DEVICE_VERSION,loc.DEVICE_BOW_RELATIONS) + "',");//环境温度              

                jsonStr.Append("'SATELLITE_NUM':'" + locgj[i].SATELLITE_NUM + "',");//卫星数量
                string is_connected_ov = locgj[i].IS_CON_OV, is_record_ov = locgj[i].IS_REC_OV, is_connected_fz = "", is_record_fz = "";

                try
                {
                    if (locgj[i].IS_CON_OV.Contains(","))
                    {
                        is_connected_ov = locgj[i].IS_CON_OV.Split(',')[0];
                        is_connected_fz = locgj[i].IS_CON_OV.Split(',')[1];
                    }
                    if (locgj[i].IS_REC_OV.Contains(","))
                    {
                        is_record_ov = locgj[i].IS_REC_OV.Split(',')[0];
                        is_record_fz = locgj[i].IS_REC_OV.Split(',')[1];
                    }
                }
                catch (Exception ex)
                {
                    is_connected_ov = ""; is_connected_fz = ""; is_record_ov = ""; is_record_fz = "";
                }
                jsonStr.Append("'IS_CONNECTED_OV':'" + PublicMethod.TOzt(is_connected_ov, loc.DEVICE_VERSION,locgj[i].DEVICE_GROUP_NO,loc.DEVICE_BOW_RELATIONS) + "',");//全景设备连接状态
                jsonStr.Append("'IS_RECORD_OV':'" + PublicMethod.TOzt(is_record_ov, loc.DEVICE_VERSION,locgj[i].DEVICE_GROUP_NO,loc.DEVICE_BOW_RELATIONS) + "',");//全景设备录像状态
                jsonStr.Append("'IS_CONNECTED_FZ':'" + PublicMethod.TOzt(is_connected_fz, loc.DEVICE_VERSION,locgj[i].DEVICE_GROUP_NO,loc.DEVICE_BOW_RELATIONS) + "',");//辅助相机连接状态
                jsonStr.Append("'IS_RECORD_FZ':'" + PublicMethod.TOzt(is_record_fz, loc.DEVICE_VERSION,locgj[i].DEVICE_GROUP_NO,loc.DEVICE_BOW_RELATIONS) + "',");//辅助相机录像状态
                jsonStr.Append("'LINE_HEIGHT':'" + myfiter.GetLINE_HEIGHT(locgj[i].LINE_HEIGHT_1) + "',");//导高
                jsonStr.Append("'PULLING_VALUE':'" + myfiter.GetPULLING_VALUE(locgj[i].PULLING_VALUE_1) + "',");//拉出
                jsonStr.Append("'GIS_X':'" + locgj[i].GIS_LON_O + "',");//经度
                jsonStr.Append("'GIS_Y':'" + locgj[i].GIS_LAT_O + "',");//纬度
                jsonStr.Append("'wz':'" + PublicMethod.GetPositionBySMSID(locgj[i]) + "',");//弓状态
                sensor = "";
                if (loc.DEVICE_VERSION == "PS5")
                {
                    sensor = locgj[i].TEMP_SENSOR_STATUS.Trim().Substring(0, 1) == "1" ? "正常" : "异常";
                }
                else
                {
                    sensor = PublicMethod.TOzt(locgj[i].TEMP_SENSOR_STATUS, loc.DEVICE_VERSION,locgj[i].DEVICE_GROUP_NO,loc.DEVICE_BOW_RELATIONS);
                }
                jsonStr.Append("'SENSOR':'" + sensor + "',");
                jsonStr.Append("'CIR':'" + PublicMethod.TOzt(locgj[i].IS_CON_IR, loc.DEVICE_VERSION,locgj[i].DEVICE_GROUP_NO,loc.DEVICE_BOW_RELATIONS) + "',");//弓状态
                jsonStr.Append("'CVI':'" + PublicMethod.TOzt(locgj[i].IS_CON_VI, loc.DEVICE_VERSION,locgj[i].DEVICE_GROUP_NO,loc.DEVICE_BOW_RELATIONS) + "',");//弓状态
                jsonStr.Append("'RIR':'" + PublicMethod.TOzt(locgj[i].IS_REC_IR, loc.DEVICE_VERSION,locgj[i].DEVICE_GROUP_NO,loc.DEVICE_BOW_RELATIONS) + "',");//弓状态
                jsonStr.Append("'RVI':'" + PublicMethod.TOzt(locgj[i].IS_REC_VI, loc.DEVICE_VERSION,locgj[i].DEVICE_GROUP_NO,loc.DEVICE_BOW_RELATIONS) + "',");//弓状态
                jsonStr.Append("'BOW_STATUS':'" + PublicMethod.TOzt(locgj[i].BOW_STATUS, loc.DEVICE_VERSION,locgj[i].DEVICE_GROUP_NO,loc.DEVICE_BOW_RELATIONS) + "',");//弓状态
                jsonStr.Append("'TRAIN_STATUS':'" + "" + "'");//运行状态  不使用      PublicMethod.TolocStatus(locgj[i].TRAIN_STATUS, loc.DEVICE_VERSION)              
                jsonStr.Append(" }");
            }

            jsonStr.Append("],'page':'" + pageIndex + "','rp':'" + pageSize + "','total':'" + recordCount + "'}");

            HttpContext.Current.Response.Write(myfiter.json_RemoveSpecialStr(jsonStr.ToString()));

        }
        catch (Exception ex)
        {
            log4net.ILog log2 = log4net.LogManager.GetLogger("检测运行轨迹列表-查看详细列表");
            log2.Error("Error", ex);
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