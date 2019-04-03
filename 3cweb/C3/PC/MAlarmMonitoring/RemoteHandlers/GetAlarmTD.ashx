<%@ WebHandler Language="C#" Class="GetAlarmTD" %>

using System;
using System.Web;
using System.Xml;
using Api.Fault.entity.alarm;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.Configuration;
using System.Text;

/// <summary>
/// 3C详细页 同点对比列表
/// </summary>
public class GetAlarmTD : ReferenceClass, IHttpHandler
{


    public void ProcessRequest(HttpContext context)
    {
        //获取缺陷ID
        string alarmid = HttpContext.Current.Request["alarmid"];
        C3_Alarm alarm = Api.ServiceAccessor.GetAlarmService().getC3Alarm(alarmid);
        //当车辆编码为空时直接返回不做判断
        if (alarm.DETECT_DEVICE_CODE == null)
        {
            HttpContext.Current.Response.Write(myfiter.json_RemoveSpecialStr("{\"ID\":\"{0}\"}"));
            HttpContext.Current.Response.End();
        }
        if (alarm.DETECT_DEVICE_CODE.IndexOf("CRH") > -1)//动车版 编码都包含CRH，用于分辨机车和动车
        {
            GetJsonForGTVersion(alarm);
        }
        else
        {
            GetJsonForNotGTVersion(alarm);
        }
    }
    /// <summary>
    /// 当前为动车版本时的处理流程
    /// </summary>
    /// <param name="alarmId"></param>
    void GetJsonForGTVersion(C3_Alarm alarm)
    {
        System.Text.StringBuilder jsonStr = new System.Text.StringBuilder();
        try
        {

            try
            {//默认分析条件：时间范围是最近一天，距离范围100米，重复次数阀值2次 --- 现在默认值均在config文件中配置 2015-12-14
                DateTime startTime = alarm.RAISED_TIME.Date.AddDays(Convert.ToInt32(PublicMethod.RepeatDays));
                DateTime endTime = alarm.RAISED_TIME.Date.AddDays(1).AddSeconds(-1);
                float range = float.Parse(PublicMethod.RepeatRange);//默认值设置为50米
                int repeatCount = Convert.ToInt32(PublicMethod.RepeatCount);
                //string status = PublicMethod.RepeatStatus;//"AFSTATUS01,AFSTATUS04,AFSTATUS03";//状态默认为 新上报，已确认，已计划
                string status = "";
                string code = PublicMethod.RepeatCode;//默认为非干扰
                string TypeGps = "";  //分析类型
                string severity = "";  //报警等级
                                       /////
                if (!string.IsNullOrEmpty(HttpContext.Current.Request["range"]))
                {
                    range = float.Parse(HttpContext.Current.Request["range"]);
                }
                if (!string.IsNullOrEmpty(HttpContext.Current.Request["repeatCount"]))
                {
                    repeatCount = Convert.ToInt32(HttpContext.Current.Request["repeatCount"]);
                }
                if (!string.IsNullOrEmpty(HttpContext.Current.Request["startTime"]))
                {
                    startTime = Convert.ToDateTime(HttpContext.Current.Request["startTime"]);
                }
                if (!string.IsNullOrEmpty(HttpContext.Current.Request["endTime"]))
                {
                    endTime = Convert.ToDateTime(HttpContext.Current.Request["endTime"]);
                }
                if (!string.IsNullOrEmpty(HttpContext.Current.Request["status"]))
                {
                    status = HttpContext.Current.Request["status"];
                }
                if (!string.IsNullOrEmpty(HttpContext.Current.Request["code"]))
                {
                    code = HttpContext.Current.Request["code"];
                }
                if (!string.IsNullOrEmpty(HttpContext.Current.Request["jb"]))
                {
                    severity = HttpContext.Current.Request["jb"];
                }





                IList<C3_Alarm> list = null;

                if (!string.IsNullOrEmpty(alarm.LINE_NAME) && !string.IsNullOrEmpty(alarm.DIRECTION) && !string.IsNullOrEmpty(PublicMethod.KmtoString(alarm.KM_MARK)))
                {
                    TypeGps = "line";
                    list = Api.Util.PositionConverter.getRangeAlarmsByKMMark_New(alarm.LINE_CODE, alarm.POSITION_CODE, alarm.DIRECTION, alarm.KM_MARK, Convert.ToInt32(range), startTime, endTime, status, code,severity);
                }
                else
                {
                    TypeGps = "gps";
                    list = Api.Util.PositionConverter.getRangeAlarmsByGPS_New(alarm.GIS_X, alarm.GIS_Y, range / 1000, startTime, endTime, status, code,severity);
                }
                if (list.Count >= repeatCount)
                {
                    foreach (C3_Alarm a in list)
                    {
                        jsonStr.AppendFormat("{{\"GT\":\"true\",\"ID\":\"{0}\",\"GIS_X\":\"{1}\",\"GIS_Y\":\"{2}\",\"ImgHW\":\"{3}\",\"ImgKJG\":\"{4}\",\"LINE_NAME\":\"{5}\",\"POSITION_NAME\":\"{6}\",\"DIRECTION\":\"{7}\",\"DETAIL\":\"{8}\",\"DETECT_DEVICE_CODE\":\"{9}\",\"RAISED_TIME\":\"{10}\",\"ROUTING_NO\":\"{11}\",\"POLE_NUMBER\":\"{12}\",\"STATION_NAME\":\"{13}\",\"STATION_NO\":\"{14}\",\"KM_MARK\":\"{15}\",\"STATUS_NAME\":\"{16}\",\"CODE_NAME\":\"{17}\",\"BRG_TUN_NAME\":\"{18}\",\"BOW_TYPE\":\"{19}\",\"CODE\":\"{20}\",\"SEVERITY\":\"{21}\",\"GIS_X_O\":\"{22}\",\"GIS_Y_O\":\"{23}\",\"TYPE\":\"{24}\",\"CUST_ALARM_CODE\":\"{25}\",\"SVALUE15\":\"{26}\"}},",
                                           a.ID, a.GIS_X, a.GIS_Y, a.RAISE_FILE_IR, a.RAISE_FILE_VI, a.LINE_NAME, a.POSITION_NAME, a.DIRECTION, a.DETAIL, a.DETECT_DEVICE_CODE, a.RAISED_TIME.ToString("yyyy-MM-dd HH:mm:ss"), a.ROUTING_NO, a.POLE_NUMBER, a.STATION_NAME, a.STATION_NO, PublicMethod.KmtoString(a.KM_MARK), a.STATUS_NAME, a.CODE_NAME, a.BRG_TUN_NAME, a.BOW_TYPE, a.CODE, PublicMethod.getCode_Name(a.SEVERITY), a.GIS_X_O, a.GIS_Y_O, TypeGps,a.CUST_ALARM_CODE,a.SVALUE15);
                    }
                }
                else
                {
                    jsonStr.Append("false");
                }





                //IList<C3_Alarm> list = Api.Util.PositionConverter.getRangeAlarmsByGPS(alarm.GIS_X, alarm.GIS_Y, range / 1000, startTime, endTime, status, code);

                //if (list.Count >= repeatCount)
                //{
                //    foreach (C3_Alarm a in list)
                //    {
                //        if (!string.IsNullOrEmpty(a.LINE_NAME) && !string.IsNullOrEmpty(a.DIRECTION) && !string.IsNullOrEmpty(PublicMethod.KmtoString(a.KM_MARK)))
                //        {
                //            TypeGps = "line";
                //        }
                //        else
                //        {
                //            TypeGps = "gps";
                //        }
                //        jsonStr.AppendFormat("{{\"GT\":\"true\",\"ID\":\"{0}\",\"GIS_X\":\"{1}\",\"GIS_Y\":\"{2}\",\"ImgHW\":\"{3}\",\"ImgKJG\":\"{4}\",\"LINE_NAME\":\"{5}\",\"POSITION_NAME\":\"{6}\",\"DIRECTION\":\"{7}\",\"DETAIL\":\"{8}\",\"DETECT_DEVICE_CODE\":\"{9}\",\"RAISED_TIME\":\"{10}\",\"ROUTING_NO\":\"{11}\",\"POLE_NUMBER\":\"{12}\",\"STATION_NAME\":\"{13}\",\"STATION_NO\":\"{14}\",\"KM_MARK\":\"{15}\",\"STATUS_NAME\":\"{16}\",\"CODE_NAME\":\"{17}\",\"BRG_TUN_NAME\":\"{18}\",\"BOW_TYPE\":\"{19}\",\"CODE\":\"{20}\",\"SEVERITY\":\"{21}\",\"GIS_X_O\":\"{22}\",\"GIS_Y_O\":\"{23}\",\"TYPE\":\"{24}\"}},",
                //            a.ID, a.GIS_X, a.GIS_Y, a.RAISE_FILE_IR, a.RAISE_FILE_VI, a.LINE_NAME, a.POSITION_NAME, a.DIRECTION, a.DETAIL, a.DETECT_DEVICE_CODE, a.RAISED_TIME.ToString("yyyy-MM-dd HH:mm:ss"), a.ROUTING_NO, a.POLE_NUMBER, a.STATION_NAME, a.STATION_NO, PublicMethod.KmtoString(a.KM_MARK), a.STATUS_NAME, a.CODE_NAME, a.BRG_TUN_NAME, a.BOW_TYPE, a.CODE, a.SEVERITY, a.GIS_X_O, a.GIS_Y_O, TypeGps);
                //    }
                //}
                //else
                //{
                //    jsonStr.Append("false");
                //}
            }
            catch (Exception ex)
            {
                log4net.ILog log2 = log4net.LogManager.GetLogger("读取C3详细页同点对比");
                log2.Error("Error", ex);
            }
        }
        catch (Exception ex)
        {
            log4net.ILog log2 = log4net.LogManager.GetLogger("读取C3详细页同点对比");
            log2.Error("Error", ex);
        }
        finally
        {
            HttpContext.Current.Response.Write(myfiter.json_RemoveSpecialStr(jsonStr.ToString()));
            HttpContext.Current.Response.End();
        }
    }
    /// <summary>
    /// 当前为非动车版本时的处理流程
    /// </summary>
    /// <param name="alarmId"></param>
    void GetJsonForNotGTVersion(C3_Alarm alarm)
    {
        StringBuilder jsonStr = new StringBuilder();
        try
        {
            if (alarm.LINE_CODE == null)
            {
                jsonStr.Append("false");
                return;
            }
            //默认分析条件：同线路、通区站、同行别、时间范围是最近一天，距离范围100米，重复次数阀值大于2次
            string lineCode = alarm.LINE_CODE;
            string positionCode = alarm.POSITION_CODE;
            string direction = alarm.DIRECTION;
            try
            {
                DateTime startTime = alarm.RAISED_TIME.Date.AddDays(Convert.ToInt32(PublicMethod.RepeatDays));
                DateTime endTime = alarm.RAISED_TIME.AddDays(1).AddSeconds(-1);
                int range = Convert.ToInt32(PublicMethod.RepeatRange);//默认值设置为50米
                int repeatCount = Convert.ToInt32(PublicMethod.RepeatCount);
                //string status = PublicMethod.RepeatStatus;//"AFSTATUS01,AFSTATUS04,AFSTATUS03";//状态默认为 新上报，已确认，已计划
                string status = "";
                string code = PublicMethod.RepeatCode;//默认为非干扰
                string TypeGps = "";  //分析类型
                string severity = "";  //报警等级
                                       /////////
                if (!string.IsNullOrEmpty(HttpContext.Current.Request["direction"]))
                {
                    direction = HttpContext.Current.Request["direction"];
                }
                if (!string.IsNullOrEmpty(HttpContext.Current.Request["range"]))
                {
                    range = Convert.ToInt32(HttpContext.Current.Request["range"]);
                }
                if (!string.IsNullOrEmpty(HttpContext.Current.Request["repeatCount"]))
                {
                    repeatCount = Convert.ToInt32(HttpContext.Current.Request["repeatCount"]);
                }
                if (!string.IsNullOrEmpty(HttpContext.Current.Request["startTime"]))
                {
                    startTime = Convert.ToDateTime(HttpContext.Current.Request["startTime"]);
                }
                if (!string.IsNullOrEmpty(HttpContext.Current.Request["endTime"]))
                {
                    endTime = Convert.ToDateTime(HttpContext.Current.Request["endTime"]).AddDays(1).AddSeconds(-1);
                }
                if (!string.IsNullOrEmpty(HttpContext.Current.Request["status"]))
                {
                    status = HttpContext.Current.Request["status"];
                }
                if (!string.IsNullOrEmpty(HttpContext.Current.Request["code"]))
                {
                    code = HttpContext.Current.Request["code"];
                }
                if (!string.IsNullOrEmpty(HttpContext.Current.Request["jb"]))
                {
                    severity = HttpContext.Current.Request["jb"];
                }

                IList<C3_Alarm> list = Api.Util.PositionConverter.getRangeAlarmsByKMMark_New(lineCode, positionCode, direction, alarm.KM_MARK, range, startTime, endTime, status, code,severity);

                if (list.Count >= repeatCount)
                {
                    foreach (C3_Alarm a in list)
                    {
                        if(!string.IsNullOrEmpty(a.LINE_NAME) && !string.IsNullOrEmpty(a.DIRECTION) && !string.IsNullOrEmpty(PublicMethod.KmtoString(a.KM_MARK)))
                        {
                            TypeGps = "line";
                        }else
                        {
                            TypeGps = "gps";
                        }
                        jsonStr.AppendFormat("{{\"GT\":\"false\",\"ID\":\"{0}\",\"GIS_X\":\"{1}\",\"GIS_Y\":\"{2}\",\"ImgHW\":\"{3}\",\"ImgKJG\":\"{4}\",\"LINE_NAME\":\"{5}\",\"POSITION_NAME\":\"{6}\",\"DIRECTION\":\"{7}\",\"DETAIL\":\"{8}\",\"DETECT_DEVICE_CODE\":\"{9}\",\"RAISED_TIME\":\"{10}\",\"ROUTING_NO\":\"{11}\",\"POLE_NUMBER\":\"{12}\",\"STATION_NAME\":\"{13}\",\"STATION_NO\":\"{14}\",\"KM_MARK\":\"{15}\",\"STATUS_NAME\":\"{16}\",\"CODE_NAME\":\"{17}\",\"BRG_TUN_NAME\":\"{18}\",\"BOW_TYPE\":\"{19}\",\"CODE\":\"{20}\",\"SEVERITY\":\"{21}\",\"GIS_X_O\":\"{22}\",\"GIS_Y_O\":\"{23}\",\"TYPE\":\"{24}\",\"CUST_ALARM_CODE\":\"{25}\",\"SVALUE15\":\"{26}\"}},",
                            a.ID, a.GIS_X, a.GIS_Y, a.RAISE_FILE_IR, a.RAISE_FILE_VI, a.LINE_NAME, a.POSITION_NAME, a.DIRECTION, a.DETAIL, a.DETECT_DEVICE_CODE, a.RAISED_TIME.ToString("yyyy-MM-dd HH:mm:ss"), a.ROUTING_NO, a.POLE_NUMBER, a.STATION_NAME, a.STATION_NO, PublicMethod.KmtoString(a.KM_MARK), a.STATUS_NAME, a.CODE_NAME, a.BRG_TUN_NAME, a.BOW_TYPE, a.CODE, PublicMethod.getCode_Name(a.SEVERITY), a.GIS_X_O, a.GIS_Y_O,TypeGps,a.CUST_ALARM_CODE,a.SVALUE15);
                    }
                }
                else
                {
                    jsonStr.Append("false");
                }
            }
            catch (Exception ex)
            {
                log4net.ILog log2 = log4net.LogManager.GetLogger("读取C3详细页同点对比");
                log2.Error("Error", ex);
            }
        }
        catch (Exception ex)
        {
            log4net.ILog log2 = log4net.LogManager.GetLogger("读取C3详细页同点对比");
            log2.Error("Error", ex);
        }
        finally
        {
            HttpContext.Current.Response.Write(myfiter.json_RemoveSpecialStr(jsonStr.ToString()));

        }
    }
    /// <summary>
    /// 当前为非动车版本时的处理流程
    /// </summary>
    /// <param name="alarmId"></param>
    void ProcessForNotGTVersion(C3_Alarm alarm)
    {
        System.Text.StringBuilder jsonStr = new System.Text.StringBuilder();
        try
        {

            //默认分析条件：同线路、通区站、同行别、时间范围是最近一天，距离范围100米，重复次数阀值大于2次
            string lineCode = alarm.LINE_CODE;
            string positionCode = alarm.POSITION_CODE;
            string direction = alarm.DIRECTION;
            DateTime startTime = alarm.RAISED_TIME.AddDays(-1);
            DateTime endTime = alarm.RAISED_TIME;
            int range = 100;
            int repeatCount = 2;
            IList<C3_Alarm> list = Api.Util.PositionConverter.getRangeAlarmsByKMMark(lineCode, positionCode, direction, alarm.KM_MARK, range, startTime, endTime, "", "");

            jsonStr.Append("{'rows':[");
            if (list.Count >= repeatCount)
            {
                string detail = string.Format("{0},{1}周围{2}M范围内，在{3}到{4}之间，检测出{5}次疑似缺陷告警", alarm.LINE_NAME, alarm.POSITION_NAME, range, startTime, endTime, list.Count);
                jsonStr.Append("{'CATEGORY_CODE':'" + "综合分析" + "',");//数据类型
                jsonStr.Append("'DETAIL':'" + detail + "',");////摘要
                jsonStr.Append("'ALAEM_ID':'" + list[0].ID + "',");//
                jsonStr.Append("'SelectInfo':'<a  href=javascript:selectInfoGT(C" + alarm.ID + ")>查看明细</a> ',");//查看明细         
                jsonStr.Append("'ID':'C" + alarm.ID + "'");
                jsonStr.Append(" }");
            }

            jsonStr.Append("],'page':'" + "1" + "','rp':'" + "1" + "','total':'" + "1" + "'}");

        }
        catch (Exception ex)
        {
            log4net.ILog log2 = log4net.LogManager.GetLogger("读取C3详细页同点对比");
            log2.Error("Error", ex);
        }
        finally
        {
            HttpContext.Current.Response.Write(myfiter.json_RemoveSpecialStr(jsonStr.ToString()));
            HttpContext.Current.Response.End();
        }
    }

    /// <summary>
    /// 当前为动车版本时的处理流程
    /// </summary>
    /// <param name="alarmId"></param>
    void ProcessForGTVersion(C3_Alarm alarm)
    {
        System.Text.StringBuilder jsonStr = new System.Text.StringBuilder();
        try
        {
            //根据报警ID查询报警,取得线路，时间等信息
            //C3_Alarm alarm = Api.ServiceAccessor.GetAlarmService().getC3Alarm(alarmId);
            //动车没有线路公里标
            //string lineCode = alarm.LINE_CODE;
            //string xb = alarm.DIRECTION;
            //默认分析条件：时间范围是最近一天，距离范围100米，重复次数阀值2次
            DateTime startTime = alarm.RAISED_TIME.AddDays(-1);
            DateTime endTime = alarm.RAISED_TIME;
            int range = 100;
            int repeatCount = 2;
            //IList<IList<C3_Alarm>> list = Api.Util.Common.getSamePositionAlarmsByGPS(alarmId, lineCode, xb, startTime, endTime, range, repeatCount);

            IList<C3_Alarm> list = Api.Util.PositionConverter.getRangeAlarmsByGPS(alarm.GIS_X, alarm.GIS_Y, range / 1000, startTime, endTime, "", "");
            jsonStr.Append("{'rows':[");

            if (list.Count >= repeatCount)
            {
                string detail = string.Format("东经{0}北纬{1}周围{2}M范围内，在{3}到{4}之间，检测出{5}次疑似缺陷告警", alarm.GIS_X, alarm.GIS_Y, range, startTime, endTime, list.Count);
                jsonStr.Append("{'CATEGORY_CODE':'" + "综合分析" + "',");//数据类型
                jsonStr.Append("'DETAIL':'" + detail + "',");////摘要
                jsonStr.Append("'ALAEM_ID':'" + list[0].ID + "',");//
                jsonStr.Append("'SelectInfo':'<a  href=javascript:selectInfoGT(C" + alarm.ID + ")>查看明细</a> ',");//查看明细         
                jsonStr.Append("'ID':'C" + alarm.ID + "'");
                jsonStr.Append(" }");
            }

            jsonStr.Append("],'page':'" + "1" + "','rp':'" + "1" + "','total':'" + "1" + "'}");
        }
        catch (Exception ex)
        {
            log4net.ILog log2 = log4net.LogManager.GetLogger("读取C3详细页同点对比");
            log2.Error("Error", ex);
        }
        finally
        {
            HttpContext.Current.Response.Write(myfiter.json_RemoveSpecialStr(jsonStr.ToString()));
            HttpContext.Current.Response.End();
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