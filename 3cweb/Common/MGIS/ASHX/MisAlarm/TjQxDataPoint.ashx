/*========================================================================================*
* 功能说明：缺陷和报警、及设备信息
* 注意事项：
* 作    者： 邓杰
* 版本日期：2013年10月21日
* 变更说明：
* 版 本 号： V1.0
*=======================================================================================*/
<%@ WebHandler Language="C#" Class="TjQxDataPoint" %>

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

public class TjQxDataPoint : ReferenceClass, IHttpHandler
{
    /// <summary>
    /// 设备和缺陷
    /// </summary>
    /// <param name="context"></param>
    public void ProcessRequest(HttpContext context)
    {
        String mislineid = context.Request.QueryString["LINE_CODE"].ToString();
        String startTime = context.Request.QueryString["startTime"].ToString();
        String endTime = context.Request.QueryString["endTime"].ToString();
        String SEVERITY = context.Request.QueryString["SEVERITY"].ToString();
        AlarmCond alarmcond = new AlarmCond();
        alarmcond.LINE_CODE = mislineid;
        alarmcond.DATA_TYPE = "FAULT";
        if (startTime != "")
        {
            alarmcond.startTime = Convert.ToDateTime(startTime);
        }
        else
        {

            alarmcond.startTime = DateTime.Now.AddDays(Int32.Parse(ConfigurationManager.AppSettings["FaultTimePeriod"]));
        }
        if (endTime != "")
        {
            alarmcond.endTime = Convert.ToDateTime(endTime);
        }
        else
        {

            alarmcond.endTime = DateTime.Now;
        }
        if (SEVERITY != "" && SEVERITY != null && SEVERITY != "null")
        {

            alarmcond.SEVERITY = SEVERITY;
        }
        else
        {

           // alarmcond.SEVERITY = "一类";
        }
        string value = System.Configuration.ConfigurationManager.AppSettings["For6C"];
        if (value == "DPC")
        {
            
        }
        else
        {
            alarmcond.CATEGORY_CODE = value;
        }
        alarmcond.businssAnd += " status <> 'AFSTATUS05'  and status <> 'AFSTATUS02' and SEVERITY in ('一类') ";

        List<Alarm> alarmlist = Api.ServiceAccessor.GetAlarmService().getAlarm(alarmcond);
        StringBuilder Json = new StringBuilder();
        Json.Append("[");
        if (alarmlist != null)
        {
            for (int i = 0; i < alarmlist.Count; i++)
            {
                string c3IMA = "";
                string c3Show = "";
                C3_Alarm c3Alarm = new C3_Alarm();
                if (alarmlist[i].CATEGORY_CODE == "3C")
                {
                    //     c3Alarm = Api.ServiceAccessor.GetAlarmService().getC3Alarm(alarmlist[i].ID);
                    c3Alarm = Api.ServiceAccessor.GetAlarmService().ConvertToC3_Alarm(alarmlist[i]);
                    if (c3Alarm.SNAPPED_JPG != "" && c3Alarm.SNAPPED_JPG != null)
                    {
                        c3Show = "c3true";
                        c3IMA = c3Alarm.SNAPPED_IMA.Replace(".IMA", "_IRV.jpg");
                    }
                }
                if (alarmlist[i].GIS_X == 0)
                {
                    string bPoint = CoordinateConvert.convert2B(alarmlist[i].GIS_X_O.ToString(), alarmlist[i].GIS_Y_O.ToString());
                    if (bPoint != null)
                    {
                        if (bPoint.Split(',')[0] != "0")
                        {
                            Json.Append("{\"GIS_X\":\"" + bPoint.Split(',')[0] + "\",\"GIS_Y\":\"" + bPoint.Split(',')[1] + "\"},");
                            alarmlist[i].GIS_X = Convert.ToDouble(bPoint.Split(',')[0]);
                            alarmlist[i].GIS_Y = Convert.ToDouble(bPoint.Split(',')[1]);

                            Api.ServiceAccessor.GetAlarmService().updateAlarm(alarmlist[i]);//得到的结果保存起来。

                        }
                    }
                }
                Json.Append("{");
                Json.Append("GIS_X:\"" + alarmlist[i].GIS_X + "\",");
                Json.Append("GIS_Y:\"" + alarmlist[i].GIS_Y + "\",");
                Json.Append("GIS_X_O:\"" + alarmlist[i].GIS_X_O + "\",");
                Json.Append("GIS_Y_O:\"" + alarmlist[i].GIS_Y_O + "\",");
                Json.Append("RAISED_TIME:\"" + alarmlist[i].RAISED_TIME + "\",");
                Json.Append("SEVERITY:\"" + alarmlist[i].SEVERITY + "\",");
                Json.Append("ALARM_ID:\"" + alarmlist[i].ID + "\",");
                Json.Append("BUREAU_CODE:\"" + alarmlist[i].BUREAU_CODE + "\",");
                Json.Append("POLE_NUMBER:\"" + alarmlist[i].POLE_NUMBER + "\",");
                Json.Append("POSITION_NAME:\"" + alarmlist[i].POSITION_NAME + "\",");
                Json.Append("BRG_TUN_NAME:\"" + alarmlist[i].BRG_TUN_NAME + "\",");
                Json.Append("CODE_NAME:\"" + alarmlist[i].STATUS_NAME + "\",");
                Json.Append("Lenum:\"" + "1" + "\",");

                if (alarmlist[i].CATEGORY_CODE == "3C")
                {
                    Json.Append("SNAPPED_IMA:\"" + PublicMethod.C3FtpRoot + "/" + alarmlist[i].DIR_PATH + c3IMA + "\",");
                    Json.Append("SNAPPED_JPG:\"" + PublicMethod.C3FtpRoot + "/" + c3Alarm.DIR_PATH + c3Alarm.SNAPPED_JPG + "\",");
                    Json.Append("xj:\"" + c3Alarm.SATELLITE_NUM + "\",");
                    Json.Append("DEVICE_ID:\"" + c3Alarm.DEVICE_ID + "\",");
                    Json.Append("CROSSING_NO:\"" + c3Alarm.ROUTING_NO + "\",");
                    string SPEED = "";
                    if (c3Alarm.SPEED != null)
                    {
                        SPEED = c3Alarm.SPEED.ToString();
                    }
                    else
                    {
                        SPEED = "0";
                    }
                    Json.Append("SPEED:\"" + SPEED + "\",");
                    Json.Append("WENDU:\"" + c3Alarm.MAX_TEMP / 100 + "\",");
                    Json.Append("HJWENDU:\"" + c3Alarm.ENV_TEMP / 100 + "\",");
                    Json.Append("LINE_HEIGHT:\"" + GetValue(c3Alarm.LINE_HEIGHT) + "\",");
                    Json.Append("PULLING_VALUE:\"" + GetValue(c3Alarm.PULLING_VALUE) + "\",");
                    Json.Append("AREA_SECTION:\"" + c3Alarm.AREA_NO + "\",");
                    string LINE_NAME = "";
                    //   string wz = PublicMethod.GetPositionByAlarmid(c3Alarm.ID);
                    string wz = PublicMethod.GetPositionByC3_Alarm(c3Alarm);
                    string StationD = "";
                    Json.Append("STATION_NO:\"" + StationD + "\",");
                    Json.Append("LINE_NAME:\"" + LINE_NAME + "\",");
                    Json.Append("wz:\"" + wz + "\",");
                    Json.Append("JU:\"" + c3Alarm.BUREAU_NAME + "\",");
                    Json.Append("GDD:\"" + c3Alarm.POWER_SECTION_NAME + "\",");
                    Json.Append("JWD:\"" + c3Alarm.P_ORG_NAME + "\",");
                    Json.Append("LINE:\"" + c3Alarm.LINE_NAME + "\",");
                    Json.Append("JUCODE:\"" + c3Alarm.BUREAU_CODE + "\",");
                    Json.Append("CJ:\"" + c3Alarm.WORKSHOP_NAME + "\",");
                    Json.Append("BZ:\"" + c3Alarm.ORG_NAME + "\",");
                    Json.Append("QZ:\"" + c3Alarm.POSITION_NAME + "\",");
                    Json.Append("BRIDGE_TUNNEL_NO:\"" + c3Alarm.BRG_TUN_CODE + "\",");
                    Json.Append("POLE_NUMBER:\"" + c3Alarm.POLE_NUMBER + "\",");
                    string KM;
                    if (PublicMethod.KmtoString(c3Alarm.KM_MARK) != "0") { KM = PublicMethod.KmtoString(c3Alarm.KM_MARK); } else { KM = ""; }

                    Json.Append("KM:\"" + c3Alarm.PULLING_VALUE + "\",");
                    Json.Append("SUMMARYDIC:\"" + c3Alarm.CODE_NAME + "\",");
                    Json.Append("BOW_TYPE:\"" + c3Alarm.BOW_TYPE + "\",");
                    Json.Append("DRIVER_NUMBER:\"" + c3Alarm.DRIVER_NO + "\",");
                    Json.Append("DETAIL:\"" + c3Alarm.DETAIL + "\",");
                    Json.Append("STATUSDIC:\"" + c3Alarm.STATUS_NAME + "\",");
                    Json.Append("REPORT_DATE:\"" + c3Alarm.REPORT_DATE + "\",");
                    Json.Append("STATUS_TIME:\"" + c3Alarm.STATUS_TIME + "\",");
                    Json.Append("LOCNO:\"" + c3Alarm.DETECT_DEVICE_CODE + "\",");
                    Json.Append("VENDOR:\"" + c3Alarm.VENDOR + "\",");

                    if (!string.IsNullOrEmpty(c3Alarm.ALARM_ANALYSIS))
                    {
                        Json.Append("ALARM_ANALYSIS:\"" + c3Alarm.ALARM_ANALYSIS.Replace("\n", "") + "\",");
                    }
                    else
                    {
                        Json.Append("ALARM_ANALYSIS:\"" + c3Alarm.ALARM_ANALYSIS + "\",");
                    }
                    if (!string.IsNullOrEmpty(c3Alarm.PROPOSAL))
                    {
                        Json.Append("PROPOSAL:\"" + c3Alarm.PROPOSAL.Replace("\n", "") + "\",");
                    }
                    else
                    {
                        Json.Append("PROPOSAL:\"" + c3Alarm.PROPOSAL + "\",");
                    }
                    if (!string.IsNullOrEmpty(c3Alarm.REMARK))
                    {
                        Json.Append("REMARK:\"" + c3Alarm.REMARK.Replace("\n", "") + "\",");
                    }
                    else
                    {
                        Json.Append("REMARK:\"" + c3Alarm.REMARK + "\",");
                    }
                    Json.Append("REPORT_PERSON:\"" + c3Alarm.REPORT_PERSON + "\",");
                    Json.Append("SEVERITY:\"" + c3Alarm.SEVERITY + "\",");
                    if (!string.IsNullOrEmpty(c3Alarm.TASK_ID))
                    {
                        Json.Append("MisShow:\"" + "true" + "\",");
                    }
                    else
                    {
                        Json.Append("MisShow:\"" + "false" + "\",");
                    }
                }


                Json.Append("CODE_NAME:\"" + alarmlist[i].STATUS_NAME + "\",");

               


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
    public string GetValue(int value)
    {
        if (value == -1000 || value == -10000)
        {
            return "";
        }
        else
        {
            return value.ToString();
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