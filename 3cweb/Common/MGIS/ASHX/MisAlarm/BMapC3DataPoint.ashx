/*========================================================================================*
* 功能说明：缺陷和报警、及设备信息
* 注意事项：
* 作    者： 邓杰
* 版本日期：2013年10月21日
* 变更说明：
* 版 本 号： V1.0
*=======================================================================================*/
<%@ WebHandler Language="C#" Class="BMapC3DataPoint" %>

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
using System.Collections;
using Api.Foundation.entity.Foundation;

public class BMapC3DataPoint : ReferenceClass, IHttpHandler
{
    /// <summary>
    /// 设备和缺陷
    /// </summary>
    /// <param name="context"></param>
    public void ProcessRequest(HttpContext context)
    {
        String type = context.Request.QueryString["type"].ToString();
        switch (type)
        {
            case "1":
                //获取设备
                String mislineid = context.Request.QueryString["mislineid"].ToString();
                getMapC3DataPoint(mislineid, context);
                break;
            case "2":
                //获取缺陷
                String misLineCode = context.Request.QueryString["LineCode"];//线路编码
                String deviceId = context.Request.QueryString["deviceid"];//车号
                String leNum = context.Request.QueryString["LeNum"];//类型 1.第一个GIS的缺陷、2.设备轨迹中的缺陷、3.缺陷GIS查询
                String startTime = context.Request.QueryString["startTime"];//开始时间
                String endTime = context.Request.QueryString["endTime"];//结束时间
                getMapC3AlarmDataPoint(context, misLineCode, deviceId, leNum, startTime, endTime);
                break;
            case "3":
                //获取报警最近的区站和与区站的距离  -----逻辑拓扑用
                double distance;
                double lon = double.Parse(context.Request.QueryString["lon"].ToString());
                double lat = double.Parse(context.Request.QueryString["lat"].ToString());
                string bureauCode = context.Request.QueryString["bureauCode"].ToString();
                if (bureauCode == "null")
                {
                    bureauCode = null;
                }
                string posCode = Api.Util.PositionConverter.getStationInfoByGPS(lon, lat, out distance, bureauCode);
                Api.Util.Common.getStationSectionInfo(posCode);
                StringBuilder Json = new StringBuilder();
                Json.Append("{");
                Json.Append("posCode:\"" + posCode + "\",");
                Json.Append("distance:\"" + distance + "\",");
                Json.Append("}");
                context.Response.Write(Json.ToString());
                break;
            case "QueryAlarm":
                QueryAlarm(context);
                break;
            case "QueryAlarm6C":
                QueryAlarm6C(context);
                break;
        }
    }

    private void QueryAlarm(HttpContext context)
    {
        C3_AlarmCond alarmCond = my_alarm.GetC3_AlermCond_byListWhere(); //生成告警条件实体
        int pageIndex = Convert.ToInt32(HttpContext.Current.Request["page"]);  //获取前台页码
        int pageSize = Convert.ToInt32(HttpContext.Current.Request["pagesize"]); //获取前台条数
        int rp = Convert.ToInt32(HttpContext.Current.Request["rp"]); //获取前台条数

        if (rp > 0)
        {
            pageSize = rp;
        }

        alarmCond.CATEGORY_CODE = "3C";
        alarmCond.page = pageIndex;
        alarmCond.pageSize = pageSize;
        //List<Alarm> alarmList = Api.ServiceAccessor.GetAlarmService().getAlarm(alarmCond); //取告警实体对象列表
        List<C3_Alarm> alarmList = Api.ServiceAccessor.GetAlarmService().getC3Alarm_Aux(alarmCond); //取告警实体对象列表
        int recordCount = Api.ServiceAccessor.GetAlarmService().getAlarmCount(alarmCond);        //告警列表总数量    

        string re = GetJSON(alarmList, recordCount); //得到json

        HttpContext.Current.Response.Write(re);
    }
    private void QueryAlarm6C(HttpContext context)
    {
        AlarmCond alarmCond = my_alarm.GetAlarmCond_byDPC(); //生成告警条件实体
        if (!string.IsNullOrEmpty(alarmCond.businssAnd))
        {
            alarmCond.businssAnd += " and";
        }
        alarmCond.businssAnd += " gis_x ！= 0 and gis_y ！= 0";//GPS为空的报警过滤掉
        List<Alarm> alarmList = Api.ServiceAccessor.GetAlarmService().getAlarm_Aux(alarmCond); //取告警实体对象列表
        int recordCount = Api.ServiceAccessor.GetAlarmService().getAlarmCount(alarmCond);        //告警列表总数量    

        string re = Get6CJSON(alarmList, recordCount); //得到json

        HttpContext.Current.Response.Write(re);

    }
    /// <summary>
    /// 得到6C综合报警json
    /// </summary>
    /// <param name="alarmlist"></param>
    /// <param name="recordCount"></param>
    /// <returns></returns>
    public string Get6CJSON(List<Alarm> alarmlist, int recordCount)
    {
        int pageIndex = Convert.ToInt32(HttpContext.Current.Request["page"]);  //获取前台页码
        int pageSize = Convert.ToInt32(HttpContext.Current.Request["rp"]); //获取前台条数

        string wz = "";

        System.Text.StringBuilder jsonStr = new System.Text.StringBuilder();
        jsonStr.Append("{'rows':[");

        for (int i = 0; i < alarmlist.Count; i++)
        {
            string REP_COUNT = "";
            if (alarmlist[i].Alarm_Aux != null)
            {
                if (alarmlist[i].SVALUE15 == "重复报警")  //最新重复
                {
                    REP_COUNT = alarmlist[i].Alarm_Aux.ALARM_REP_COUNT == 0 ? "" : alarmlist[i].Alarm_Aux.ALARM_REP_COUNT.ToString();
                }
                else //历史重复
                {
                    REP_COUNT = alarmlist[i].Alarm_Aux.ALARM_REP_COUNT == 0 ? "" : alarmlist[i].Alarm_Aux.ALARM_REP_COUNT.ToString();
                }

            }

            if (i > 0)
            {
                jsonStr.Append(",");
            }
            wz = PublicMethod.GetPosition_Alarm(alarmlist[i].LINE_NAME, alarmlist[i].POSITION_NAME, alarmlist[i].BRG_TUN_NAME, alarmlist[i].DIRECTION, alarmlist[i].KM_MARK, alarmlist[i].POLE_NUMBER, alarmlist[i].DEVICE_ID, alarmlist[i].ROUTING_NO, alarmlist[i].AREA_NO, alarmlist[i].STATION_NO, alarmlist[i].STATION_NAME, alarmlist[i].TAX_MONITOR_STATUS);

            jsonStr.Append("{'GIS_X':'" + alarmlist[i].GIS_X + "',");
            jsonStr.Append("'GIS_Y':'" + alarmlist[i].GIS_Y + "',");
            jsonStr.Append("'GIS_X_O':'" + alarmlist[i].GIS_X_O + "',");
            jsonStr.Append("'GIS_Y_O':'" + alarmlist[i].GIS_Y_O + "',");
            jsonStr.Append("'RAISED_TIME':'" + alarmlist[i].RAISED_TIME + "',");
            jsonStr.Append("'LINE_NAME':'" + alarmlist[i].LINE_NAME + "',");
            jsonStr.Append("'LINE_CODE':'" + alarmlist[i].LINE_CODE + "',");
            jsonStr.Append("'LINE_NAME':'" + alarmlist[i].LINE_NAME + "',");
            jsonStr.Append("'SUBSTATION_CODE':'" + alarmlist[i].SUBSTATION_CODE + "',");
            jsonStr.Append("'SUBSTATION_NAME':'" + alarmlist[i].SUBSTATION_NAME + "',");
            jsonStr.Append("'DEVICE_ID':'" + alarmlist[i].DEVICE_ID + "',");
            jsonStr.Append("'POWER_DEVICE_CODE':'" + alarmlist[i].POWER_DEVICE_CODE + "',");
            jsonStr.Append("'AREATEM':'" + alarmlist[i].NVALUE2 + "',");//区域温度
            jsonStr.Append("'AREATEM_DROP':'" + alarmlist[i].NVALUE3 + "',");//区域温度
            jsonStr.Append("'ENV_TEM':'" + (alarmlist[i].NVALUE2 - alarmlist[i].NVALUE3) + "',");//环境温度


            if (!string.IsNullOrEmpty(alarmlist[i].SEVERITY) && Api.Util.Common.sysDictionaryDic.Count > 0 && Api.Util.Common.sysDictionaryDic.ContainsKey(alarmlist[i].SEVERITY))
            {
                jsonStr.Append("'SEVERITY':'" + Api.Util.Common.sysDictionaryDic[alarmlist[i].SEVERITY].CODE_NAME + "',");
            }
            else
            {
                jsonStr.Append("'SEVERITY':'" + alarmlist[i].SEVERITY + "',");
            }
            jsonStr.Append("'SEVERITY_CODE':'" + alarmlist[i].SEVERITY + "',");
            jsonStr.Append("'ALARM_ID':'" + alarmlist[i].ID + "',");
            jsonStr.Append("'BUREAU_CODE':'" + alarmlist[i].BUREAU_CODE + "',");
            jsonStr.Append("'POLE_NUMBER':'" + alarmlist[i].POLE_NUMBER + "',");
            jsonStr.Append("'POSITION_NAME':'" + alarmlist[i].POSITION_NAME + "',");
            jsonStr.Append("'BRG_TUN_NAME':'" + alarmlist[i].BRG_TUN_NAME + "',");
            jsonStr.Append("'STATUS_NAME':'" + alarmlist[i].STATUS_NAME + "',");
            jsonStr.Append("'CODE_NAME':'" + alarmlist[i].CODE_NAME + "',");//报警类型
            jsonStr.Append("'STATUS':'" + alarmlist[i].STATUS + "',");
            jsonStr.Append("'GWZ':'" + alarmlist[i].SVALUE8 + "',");//弓位置
            jsonStr.Append("'SD':'" + myfiter.GetSpeed(alarmlist[i].NVALUE1) + "',");//速度
            jsonStr.Append("'WD':'" + myfiter.GetTEMP_MAX(alarmlist[i]) + "',");//红外温度
            jsonStr.Append("'HJWD':'" + myfiter.GetTEMP(alarmlist[i].NVALUE5) + "',");//环境温度
            jsonStr.Append("'DGZ':'" + myfiter.GetLINE_HEIGHT(alarmlist[i]) + "',");//导高
            jsonStr.Append("'LCZ':'" + myfiter.GetPULLING_VALUE(alarmlist[i]) + "',");//拉出值
            jsonStr.Append("'DETECT_DEVICE_CODE':'" + alarmlist[i].DETECT_DEVICE_CODE + "',");
            jsonStr.Append("'REP_COUNT':'" + REP_COUNT + "',");
            jsonStr.Append("'Lenum':'" + "3" + "',");
            jsonStr.Append("'wz':'" + wz + "',");
            jsonStr.Append("'CUST_ALARM_CODE':'" + alarmlist[i].CUST_ALARM_CODE + "',"); //标签

            jsonStr.Append("'CATEGORY_CODE':'" + alarmlist[i].CATEGORY_CODE + "'");

            jsonStr.Append("}");
        }

        jsonStr.Append("],'page':'" + pageIndex + "','rp':'" + pageSize + "','total':'" + recordCount + "'}");


        return myfiter.json_RemoveSpecialStr(jsonStr.ToString());
    }
    /// <summary>
    /// 得到json字串
    /// </summary>
    /// <param name="alarmList">告警实体对象列表</param>
    /// <returns></returns>
    public string GetJSON(List<C3_Alarm> alarmlist, int recordCount)
    {
        string sore = HttpContext.Current.Request["sore"];
        int pageIndex = Convert.ToInt32(HttpContext.Current.Request["page"]);  //获取前台页码
        int pageSize = Convert.ToInt32(HttpContext.Current.Request["pagesize"]); //获取前台条数

        string wz = "";
        string status;
        string font1 = "";//行字体颜色开头
        string font2 = "";//行字体颜色结尾
        string url;
        string IRV;
        string GIS;

        System.Text.StringBuilder jsonStr = new System.Text.StringBuilder();
        jsonStr.Append("{'rows':[");

        for (int i = 0; i < alarmlist.Count; i++)
        {
            string REP_COUNT = "";
            if (alarmlist[i].Alarm_Aux != null)
            {
                if (alarmlist[i].SVALUE15 == "重复报警")  //最新重复
                {
                    REP_COUNT = alarmlist[i].Alarm_Aux.ALARM_REP_COUNT == 0 ? "" : alarmlist[i].Alarm_Aux.ALARM_REP_COUNT.ToString();
                }
                else //历史重复
                {
                    REP_COUNT = alarmlist[i].Alarm_Aux.ALARM_REP_COUNT == 0 ? "" : alarmlist[i].Alarm_Aux.ALARM_REP_COUNT.ToString();
                }

            }

            if (i > 0)
            {
                jsonStr.Append(",");
            }
            string c3IMA = "";
            C3_Alarm c3Alarm = new C3_Alarm();

            if (alarmlist[i].CATEGORY_CODE == "3C")
            {
                c3Alarm = Api.ServiceAccessor.GetAlarmService().ConvertToC3_Alarm(alarmlist[i]);
                if (c3Alarm.SNAPPED_JPG != "" && c3Alarm.SNAPPED_JPG != null)
                {
                    c3IMA = c3Alarm.SNAPPED_IMA.Replace(".IMA", "_IRV.jpg");
                }
                //wz = PublicMethod.GetPositionByC3_Alarm(c3Alarm);
                wz = PublicMethod.GetPosition_Alarm(c3Alarm.LINE_NAME, c3Alarm.POSITION_NAME, c3Alarm.BRG_TUN_NAME, c3Alarm.DIRECTION, c3Alarm.KM_MARK, c3Alarm.POLE_NUMBER, c3Alarm.DEVICE_ID, c3Alarm.ROUTING_NO, c3Alarm.AREA_NO, c3Alarm.STATION_NO, c3Alarm.STATION_NAME, c3Alarm.TAX_MONITOR_STATUS);

                jsonStr.Append("{'GIS_X':'" + alarmlist[i].GIS_X + "',");
                jsonStr.Append("'GIS_Y':'" + alarmlist[i].GIS_Y + "',");
                jsonStr.Append("'GIS_X_O':'" + alarmlist[i].GIS_X_O + "',");
                jsonStr.Append("'GIS_Y_O':'" + alarmlist[i].GIS_Y_O + "',");
                jsonStr.Append("'RAISED_TIME':'" + alarmlist[i].RAISED_TIME + "',");
                jsonStr.Append("'SEVERITY':'" + alarmlist[i].SEVERITY + "',");
                jsonStr.Append("'SEVERITY_CODE':'" + alarmlist[i].MY_STR_8 + "',");
                jsonStr.Append("'ALARM_ID':'" + alarmlist[i].ID + "',");
                jsonStr.Append("'BUREAU_CODE':'" + alarmlist[i].BUREAU_CODE + "',");
                jsonStr.Append("'POLE_NUMBER':'" + alarmlist[i].POLE_NUMBER + "',");
                jsonStr.Append("'POSITION_NAME':'" + alarmlist[i].POSITION_NAME + "',");
                jsonStr.Append("'BRG_TUN_NAME':'" + alarmlist[i].BRG_TUN_NAME + "',");
                jsonStr.Append("'STATUS_NAME':'" + alarmlist[i].STATUS_NAME + "',");
                jsonStr.Append("'CODE_NAME':'" + alarmlist[i].CODE_NAME + "',");
                jsonStr.Append("'STATUS':'" + alarmlist[i].STATUS + "',");
                jsonStr.Append("'GWZ':'" + c3Alarm.BOW_TYPE + "',");//弓位置
                jsonStr.Append("'SD':'" + myfiter.GetSpeed(c3Alarm.SPEED) + "',");//速度
                jsonStr.Append("'WD':'" + myfiter.GetTEMP_MAX(c3Alarm) + "',");//红外温度
                jsonStr.Append("'HJWD':'" + myfiter.GetTEMP(c3Alarm.ENV_TEMP) + "',");//环境温度
                jsonStr.Append("'DGZ':'" + myfiter.GetLINE_HEIGHT(c3Alarm) + "',");//导高
                jsonStr.Append("'LCZ':'" + myfiter.GetPULLING_VALUE(c3Alarm) + "',");//拉出值
                jsonStr.Append("'DETECT_DEVICE_CODE':'" + alarmlist[i].DETECT_DEVICE_CODE + "',");
                jsonStr.Append("'REP_COUNT':'" + REP_COUNT + "',");
                jsonStr.Append("'Lenum':'" + "3" + "',");
                jsonStr.Append("'wz':'" + wz + "',");
                jsonStr.Append("'CUST_ALARM_CODE':'" + alarmlist[i].CUST_ALARM_CODE + "',"); //标签

                jsonStr.Append("'CATEGORY_CODE':'" + alarmlist[i].CATEGORY_CODE + "'");

                jsonStr.Append("}");
            }
        }

        jsonStr.Append("],'page':'" + pageIndex + "','rp':'" + pageSize + "','total':'" + recordCount + "'}");


        return myfiter.json_RemoveSpecialStr(jsonStr.ToString());

    }
    /// <summary>
    /// 获取C3设备最新坐标点数据
    /// </summary>
    /// <param name="mislineid">线路CODE</param>
    /// <param name="context"></param>
    private void getMapC3DataPoint(string misLineCode, HttpContext context)
    {
        C3_SmsCond c3Smscond = new C3_SmsCond();
        if (misLineCode != "")
        {
            c3Smscond.LINE_CODE = misLineCode;
        }
        c3Smscond.endTime = DateTime.Now;
        c3Smscond.startTime = DateTime.Now.AddDays(-7);
        c3Smscond.businssAnd = " GIS_LON_O !=0 ";
        List<C3_Sms> c3SmsList = Api.ServiceAccessor.GetSmsService().getC3SmsbyCondition_OnelocaOneData(c3Smscond);
        StringBuilder Json = new StringBuilder();
        Json.Append("[");
        for (int i = 0; i < c3SmsList.Count; i++)
        {

            Api.Foundation.entity.Foundation.Locomotive m_loco = Api.Util.Common.getLocomotiveInfo(c3SmsList[i].LOCOMOTIVE_CODE);

            string wz = PublicMethod.GetPositionBySMSID(c3SmsList[i]);
            if (c3SmsList[i].GIS_LON == 0)
            {
                string bPoint = CoordinateConvert.convert2B(c3SmsList[i].GIS_LON_O.ToString(), c3SmsList[i].GIS_LAT_O.ToString());
                if (bPoint != null && bPoint.Split(',')[0] != "0")
                {
                    c3SmsList[i].GIS_LON = Convert.ToDouble(bPoint.Split(',')[0]);
                    c3SmsList[i].GIS_LAT = Convert.ToDouble(bPoint.Split(',')[1]);
                    Api.ServiceAccessor.GetSmsService().updateC3Sms(c3SmsList[i]);//得到的结果保存起来。


                }
            }
            Json.Append("{");
            Json.Append("WZ:\"" + wz + "\"");//位置信息
            Json.Append(",");
            Json.Append("CROSSING_NO:\"" + myfiter.GetRouingNo(c3SmsList[i].ROUTING_NO) + "\"");//交路号
            Json.Append(",");
            Json.Append("KM_MARK:\"" + c3SmsList[i].KM_MARK + "\"");//公里标
            Json.Append(",");
            if (c3SmsList[i].GIS_LON != 0)
            {
                Json.Append("GIS_X:\"" + c3SmsList[i].GIS_LON + "\"");//经度
                Json.Append(",");
                Json.Append("GIS_Y:\"" + c3SmsList[i].GIS_LAT + "\"");//纬度
                Json.Append(",");
            }
            else
            {
                Json.Append("GIS_X:\"" + c3SmsList[i].GIS_LON_O + "\"");//经度
                Json.Append(",");
                Json.Append("GIS_Y:\"" + c3SmsList[i].GIS_LAT_O + "\"");//纬度
                Json.Append(",");
            }
            Json.Append("GIS_X_O:\"" + c3SmsList[i].GIS_LON_O + "\"");//经度
            Json.Append(",");
            Json.Append("GIS_Y_O:\"" + c3SmsList[i].GIS_LAT_O + "\"");//纬度
            Json.Append(",");
            Json.Append("SPEED:\"" + c3SmsList[i].SPEED + "\"");//速度
            Json.Append(",");
            Json.Append("TRAIN_NO:\"" + c3SmsList[i].LOCOMOTIVE_CODE + "\"");//设备号
            Json.Append(",");

            Json.Append("BOW_UPDOWN_STATUS:\"" + myfiter.GetBowStatus(c3SmsList[i], m_loco.DEVICE_BOW_RELATIONS) + "\"");//运行状态  GIS_LON_O
            Json.Append(",");
            //Json.Append("TRAIN_STATUS:\"" + list[i].TRAIN_STATUS + "\"");//运行状态
            //Json.Append(",");
            Json.Append("STATION_NO:\"" + c3SmsList[i].STATION_NO + "\"");//车站号
            Json.Append(",");
            Json.Append("DETECT_TIME:\"" + c3SmsList[i].DETECT_TIME + "\"");//时间
            Json.Append(",");
            Json.Append("SENSOR_TEMP:\"" + myfiter.GetTEMP_ENV(c3SmsList[i]) + "\"");//温度
            Json.Append(",");
            Json.Append("IRV_TEMP:\"" + myfiter.GetTEMP_MAX(c3SmsList[i]) + "\"");//红外温度
            Json.Append(",");
            Json.Append("LINE_HEIGHT:\"" + myfiter.GetLINE_HEIGHT(c3SmsList[i].LINE_HEIGHT_1) + "\"");//导高
            Json.Append(",");
            Json.Append("PULLING_VALUE:\"" + myfiter.GetPULLING_VALUE(c3SmsList[i].PULLING_VALUE_1) + "\"");//导高
            Json.Append(",");
            Json.Append("ID:\"" + c3SmsList[i].ID + "\"");//ID
            Json.Append(",");
            Json.Append("BUREAU_CODE:\"" + c3SmsList[i].BUREAU_CODE + "\"");//局
            if (c3SmsList[i].BUREAU_CODE != "" && c3SmsList[i].BUREAU_CODE != null && c3SmsList[i].ROUTING_NO != "" && c3SmsList[i].ROUTING_NO != null)
            {
                RoutingCond routing = new RoutingCond();
                routing.ROUTING_CODE = c3SmsList[i].BUREAU_CODE + c3SmsList[i].ROUTING_NO;
                IList<Api.Foundation.entity.Foundation.Routing> listroutiong = Api.ServiceAccessor.GetFoundationService().queryRouting(routing);
                if (listroutiong.Count > 0)
                {

                    Json.Append(",");
                    Json.Append("ROUTING_CODE:\"" + listroutiong[0].AREA_SECTION + "\"");//区站
                }
                else
                {
                    Json.Append(",");
                    Json.Append("ROUTING_CODE:\"" + "" + "\"");//区站
                }
            }
            else
            {
                Json.Append(",");
                Json.Append("ROUTING_CODE:\"" + "" + "\"");//区站
            }
            Json.Append(",");
            Json.Append("LINE_NAME:\"" + c3SmsList[i].LINE_NAME + "\"");//线路
            if (c3SmsList[i].BUREAU_CODE != "" && c3SmsList[i].BUREAU_CODE != null && c3SmsList[i].ROUTING_NO != "" && c3SmsList[i].ROUTING_NO != null && c3SmsList[i].STATION_NO != "" && c3SmsList[i].STATION_NO != null)
            {
                RoutingStationRelCond routingstatin = new RoutingStationRelCond();
                routingstatin.ROUTING_CODE = c3SmsList[i].BUREAU_CODE + c3SmsList[i].ROUTING_NO;
                if (c3SmsList[i].STATION_NO != "" && c3SmsList[i].STATION_NO != null)
                {
                    routingstatin.STATION_NO = Convert.ToInt32(c3SmsList[i].STATION_NO);
                }
                IList<Api.Foundation.entity.Foundation.RoutingStationRel> routingstatinlist = Api.ServiceAccessor.GetFoundationService().queryRoutingStationRel(routingstatin);
                if (routingstatinlist.Count > 0)
                {

                    Json.Append(",");
                    Json.Append("STATION_NAME:\"" + routingstatinlist[0].STATION_NAME + "\"");//站名
                }
                else
                {
                    Json.Append(",");
                    Json.Append("STATION_NAME:\"" + "" + "\"");//站名
                }
            }
            else
            {
                Json.Append(",");
                Json.Append("STATION_NAME:\"" + "" + "\"");//站名
            }
            if (i < c3SmsList.Count - 1)
            {
                Json.Append("},");
            }
            else
            {
                Json.Append("}");
            }
        }

        Json.Append("]");
        context.Response.Cache.SetCacheability(HttpCacheability.NoCache);
        context.Response.ContentType = "text/plain";
        object myObj = JsonConvert.DeserializeObject(Json.ToString());
        context.Response.Write(myObj);
    }
    /// <summary>
    /// 获取缺陷信息（包含实时GIS和轨迹和缺陷查询GIS中的缺陷）
    /// </summary>
    /// <param name="context"></param>
    /// <param name="LineCode">线路Code</param>
    /// <param name="deviceid">车号</param>
    /// <param name="Lenum">//类型 1.第一个GIS的缺陷、2.设备轨迹中的缺陷、3.缺陷GIS查询</param>
    /// <param name="startTime">开始时间</param>
    /// <param name="endTime">结束数据</param>
    private void getMapC3AlarmDataPoint(HttpContext context, String lineCode, String deviceId, string leNum, string startTime, string endTime)
    {
        AlarmCond alarmcond = my_alarm.Get_AlermCond_byListWhere(context);
        switch (leNum)
        {
            case "1":
                alarmcond = getActualFault(lineCode, startTime, alarmcond);
                break;
            case "2":
                alarmcond = getLocoAlarm(context, deviceId, startTime, endTime, alarmcond);
                break;
            case "3":
                alarmcond = getConditionsAlarm(startTime, endTime, alarmcond);
                break;
            default:
                break;
        }
        if (context.Request["Category_Code"] != "DPC")
            alarmcond.CATEGORY_CODE = context.Request["Category_Code"];
        alarmcond.orderBy = " Raised_Time desc";




        if (!string.IsNullOrEmpty(lineCode) && lineCode != "0")
        {
            //alarmcond.LINE_CODE = lineCode;

            if (lineCode == "-1" || lineCode == "wu")
            {
                alarmcond.businssAnd += " and line_code is null  ";
            }
            else
            {
                alarmcond.LINE_CODE = lineCode;
            }
        }



        string value = System.Configuration.ConfigurationManager.AppSettings["For6C"];
        alarmcond.page = 1;
        alarmcond.pageSize = Convert.ToInt32(System.Configuration.ConfigurationManager.AppSettings["AlarmCount"]);
        if (!string.IsNullOrEmpty(deviceId))
            alarmcond.DETECT_DEVICE_CODE = deviceId;

        if (!string.IsNullOrEmpty(alarmcond.businssAnd))
        {
            alarmcond.businssAnd += " and ";
        }
        alarmcond.businssAnd += " GIS_X_O !=0 ";




        string direction = context.Request.QueryString["direction"];
        if (direction == "-1" || direction == "无行别" || direction == "交路无行别")
        {
            if (Api.Util.Common.FunEnable("Fun_NullDirection") == false)
            {
                if (direction == "交路无行别")
                {
                    alarmcond.businssAnd += " and DIRECTION is null";
                }
                else
                {
                    alarmcond.businssAnd += " and (DIRECTION is null and line_code is null)";
                }
            }
            else
            {
                alarmcond.businssAnd += " and DIRECTION is null";
            }
        }
        else if (!string.IsNullOrEmpty(direction) && direction != "0")
        {
            alarmcond.DIRECTION = direction;
        }
        else
        {
            //if (Api.Util.Common.FunEnable("Fun_NullDirection") == false)
            //{
            //    if (string.IsNullOrEmpty(direction))
            //    {
            //        if (!string.IsNullOrEmpty(alarmcond.businssAnd))
            //        {
            //            alarmcond.businssAnd += " and ";
            //        }
            //        alarmcond.businssAnd += "(line_code is null or (line_code is not null  and DIRECTION is not null))";
            //    }
            //}
            alarmcond.DIRECTION = null;
        }




        List<Alarm> alarmlist = new List<Alarm>();
        if (leNum == "1" && value == "DPC")
        {
            List<Alarm> C1alarmlist = new List<Alarm>();
            List<Alarm> C2alarmlist = new List<Alarm>();
            List<Alarm> C3alarmlist = new List<Alarm>();
            List<Alarm> C4alarmlist = new List<Alarm>();
            List<Alarm> C5alarmlist = new List<Alarm>();
            List<Alarm> C6alarmlist = new List<Alarm>();
            alarmcond.page = 1;
            alarmcond.CATEGORY_CODE = "3C";
            alarmcond.pageSize = Int32.Parse(ConfigurationManager.AppSettings["AlarmCount"]);
            C3alarmlist = Api.ServiceAccessor.GetAlarmService().getAlarm(alarmcond);
            alarmcond.pageSize = 10;
            alarmcond.startTime = DateTime.Now.AddYears(-1);
            alarmcond.endTime = DateTime.Now;
            alarmcond.CATEGORY_CODE = "1C";
            C1alarmlist = Api.ServiceAccessor.GetAlarmService().getAlarm(alarmcond);
            alarmcond.CATEGORY_CODE = "2C";
            C2alarmlist = Api.ServiceAccessor.GetAlarmService().getAlarm(alarmcond);
            alarmcond.CATEGORY_CODE = "4C";
            C4alarmlist = Api.ServiceAccessor.GetAlarmService().getAlarm(alarmcond);
            alarmcond.CATEGORY_CODE = "5C";
            C5alarmlist = Api.ServiceAccessor.GetAlarmService().getAlarm(alarmcond);
            alarmcond.CATEGORY_CODE = "6C";
            C6alarmlist = Api.ServiceAccessor.GetAlarmService().getAlarm(alarmcond);
            alarmlist.AddRange(C3alarmlist);
            alarmlist.AddRange(C2alarmlist);
            alarmlist.AddRange(C6alarmlist);
            alarmlist.AddRange(C4alarmlist);
            alarmlist.AddRange(C5alarmlist);
            alarmlist.AddRange(C1alarmlist);
        }
        else
        {
            alarmcond.page = 0;
            alarmcond.pageSize = 0;
            alarmlist = Api.ServiceAccessor.GetAlarmService().getAlarm(alarmcond);
        }
        StringBuilder Json = new StringBuilder();
        Json.Append("[");
        if (alarmlist != null)
        {

            List<CoordinateConvert.Point2> newlist = new List<CoordinateConvert.Point2>();
            newlist = GPSTranAndUpdate_list(alarmlist, "GIS_X", "GIS_Y", "ID", "ALARM");
            int t = 0;
            for (int i = 0; i < alarmlist.Count; i++)
            {
                string c3IMA = "";
                C3_Alarm c3Alarm = new C3_Alarm();

                if (alarmlist[i].CATEGORY_CODE == "3C")
                {
                    c3Alarm = Api.ServiceAccessor.GetAlarmService().ConvertToC3_Alarm(alarmlist[i]);
                    if (c3Alarm.SNAPPED_JPG != "" && c3Alarm.SNAPPED_JPG != null)
                    {
                        c3IMA = c3Alarm.SNAPPED_IMA.Replace(".IMA", "_IRV.jpg");
                    }
                }
                if (alarmlist[i].GIS_X == 0)
                {
                    if (newlist.Count > 0 && t < newlist.Count)
                    {
                        if (newlist[t].x != "0" && newlist[t].x != "")
                        {
                            alarmlist[i].GIS_X = Convert.ToDouble(newlist[t].x);
                            alarmlist[i].GIS_Y = Convert.ToDouble(newlist[t].y);
                        }
                        t = t + 1;
                    }
                    //string bPoint = CoordinateConvert.convert2B(alarmlist[i].GIS_X_O.ToString(), alarmlist[i].GIS_Y_O.ToString());
                    //if (bPoint != null)
                    //{
                    //    if (bPoint.Split(',')[0] != "0")
                    //    {
                    //        // Json.Append("{\"GIS_X\":\"" + bPoint.Split(',')[0] + "\",\"GIS_Y\":\"" + bPoint.Split(',')[1] + "\"},");
                    //        alarmlist[i].GIS_X = Convert.ToDouble(bPoint.Split(',')[0]);
                    //        alarmlist[i].GIS_Y = Convert.ToDouble(bPoint.Split(',')[1]);
                    //        Api.ServiceAccessor.GetAlarmService().updateAlarm(alarmlist[i]);//得到的结果保存起来。
                    //    }
                    //}
                }
                Json.Append("{");
                Json.Append("\"GIS_X\":\"" + alarmlist[i].GIS_X + "\",");
                Json.Append("\"GIS_Y\":\"" + alarmlist[i].GIS_Y + "\",");
                Json.Append("\"GIS_X_O\":\"" + alarmlist[i].GIS_X_O + "\",");
                Json.Append("\"GIS_Y_O\":\"" + alarmlist[i].GIS_Y_O + "\",");
                Json.Append("\"RAISED_TIME\":\"" + alarmlist[i].RAISED_TIME + "\",");
                Json.Append("\"SEVERITY_CODE\":\"" + alarmlist[i].SEVERITY + "\",");
                Json.Append("\"SEVERITY\":\"" + "" + "\",");
                Json.Append("\"ALARM_ID\":\"" + alarmlist[i].ID + "\",");
                Json.Append("\"BUREAU_CODE\":\"" + alarmlist[i].BUREAU_CODE + "\",");
                Json.Append("\"POLE_NUMBER\":\"" + alarmlist[i].POLE_NUMBER + "\",");
                Json.Append("\"POSITION_NAME\":\"" + alarmlist[i].POSITION_NAME + "\",");
                Json.Append("\"BRG_TUN_NAME\":\"" + alarmlist[i].BRG_TUN_NAME + "\",");
                Json.Append("\"STATUS_NAME\":\"" + alarmlist[i].STATUS_NAME + "\",");
                Json.Append("\"CODE_NAME\":\"" + alarmlist[i].CODE_NAME + "\",");
                Json.Append("\"STATUS\":\"" + alarmlist[i].STATUS + "\",");
                Json.Append("\"Lenum\":\"" + leNum + "\",");
                Json.Append("\"CUST_ALARM_CODE\":\"" + alarmlist[i].CUST_ALARM_CODE + "\","); //标签
                if (alarmlist[i].CATEGORY_CODE == "3C")
                {
                    Json = GetC3AlarmJson(Json, c3IMA, c3Alarm);
                }
                //  Json.Append("CODE_NAME:\"" + alarmlist[i].STATUS_NAME + "\",");
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
        string re = Json.ToString();
        string remove = HttpContext.Current.Request["remove"];
        if (!string.IsNullOrEmpty(remove))
        {
            re = myfiter.RemoveHTML(re, 0);
        }
        context.Response.Write(re);

    }
    /// <summary>
    /// 3C要拼接告警的详细信息
    /// </summary>
    /// <param name="Json">json串</param>
    /// <param name="c3IMA">IMA文件路径</param>
    /// <param name="c3Alarm">C3Alarm对象</param>
    /// <returns></returns>
    private StringBuilder GetC3AlarmJson(StringBuilder Json, string c3IMA, C3_Alarm c3Alarm)
    {
        Json.Append("\"SNAPPED_IMA\":\"" + PublicMethod.C3FtpRoot + "/" + c3Alarm.DIR_PATH + c3IMA + "\",");
        Json.Append("\"SNAPPED_JPG\":\"" + PublicMethod.C3FtpRoot + "/" + c3Alarm.DIR_PATH + c3Alarm.SNAPPED_JPG + "\",");
        Json.Append("\"xj\":\"" + c3Alarm.SATELLITE_NUM + "\",");
        Json.Append("\"DEVICE_ID\":\"" + c3Alarm.DEVICE_ID + "\",");
        Json.Append("\"CROSSING_NO\":\"" + c3Alarm.ROUTING_NO + "\",");
        string SPEED = "";
        if (c3Alarm.SPEED != null)
        {
            SPEED = c3Alarm.SPEED.ToString();
        }
        else
        {
            SPEED = "0";
        }
        Json.Append("\"SPEED\":\"" + SPEED + "\",");
        Json.Append("\"WENDU\":\"" + c3Alarm.MAX_TEMP / 100 + "\",");
        Json.Append("\"HJWENDU\":\"" + c3Alarm.ENV_TEMP / 100 + "\",");
        Json.Append("\"LINE_HEIGHT\":\"" + GetValue(c3Alarm.LINE_HEIGHT) + "\",");
        Json.Append("\"PULLING_VALUE\":\"" + GetValue(c3Alarm.PULLING_VALUE) + "\",");
        Json.Append("\"AREA_SECTION\":\"" + c3Alarm.AREA_NO + "\",");
        string LINE_NAME = "";
        //string wz = PublicMethod.GetPositionByC3_Alarm(c3Alarm);
        string wz = PublicMethod.GetPosition_Alarm(c3Alarm.LINE_NAME, c3Alarm.POSITION_NAME, c3Alarm.BRG_TUN_NAME, c3Alarm.DIRECTION, c3Alarm.KM_MARK, c3Alarm.POLE_NUMBER, c3Alarm.DEVICE_ID, c3Alarm.ROUTING_NO, c3Alarm.AREA_NO, c3Alarm.STATION_NO, c3Alarm.STATION_NAME, c3Alarm.TAX_MONITOR_STATUS);
        string StationD = "";
        Json.Append("\"STATION_NO\":\"" + StationD + "\",");
        Json.Append("\"LINE_NAME\":\"" + LINE_NAME + "\",");
        Json.Append("\"wz\":\"" + wz + "\",");
        Json.Append("\"GWZ\":\"" + c3Alarm.BOW_TYPE + "\",");
        Json.Append("\"SD\":\"" + myfiter.GetSpeed(c3Alarm.SPEED) + "\",");
        Json.Append("\"WD\":\"" + myfiter.GetTEMP_MAX(c3Alarm) + "\",");
        Json.Append("\"HJWD\":\"" + myfiter.GetTEMP(c3Alarm.ENV_TEMP) + "\",");
        Json.Append("\"DGZ\":\"" + myfiter.GetLINE_HEIGHT(c3Alarm) + "\",");
        Json.Append("\"LCZ\":\"" + myfiter.GetPULLING_VALUE(c3Alarm) + "\",");
        Json.Append("\"DETECT_DEVICE_CODE\":\"" + c3Alarm.DETECT_DEVICE_CODE + "\",");
        Json.Append("\"JU\":\"" + c3Alarm.BUREAU_NAME + "\",");
        Json.Append("\"GDD\":\"" + c3Alarm.POWER_SECTION_NAME + "\",");
        Json.Append("\"JWD\":\"" + c3Alarm.P_ORG_NAME + "\",");
        Json.Append("\"LINE\":\"" + c3Alarm.LINE_NAME + "\",");
        Json.Append("\"JUCODE\":\"" + c3Alarm.BUREAU_CODE + "\",");
        Json.Append("\"CJ\":\"" + c3Alarm.WORKSHOP_NAME + "\",");
        Json.Append("\"BZ\":\"" + c3Alarm.ORG_NAME + "\",");
        Json.Append("\"QZ\":\"" + c3Alarm.POSITION_NAME + "\",");
        Json.Append("\"BRIDGE_TUNNEL_NO\":\"" + c3Alarm.BRG_TUN_CODE + "\",");
        Json.Append("\"POLE_NUMBER\":\"" + c3Alarm.POLE_NUMBER + "\",");
        string KM;
        if (PublicMethod.KmtoString(c3Alarm.KM_MARK) != "0") { KM = PublicMethod.KmtoString(c3Alarm.KM_MARK); } else { KM = ""; }
        Json.Append("\"KM\":\"" + KM + "\",");
        Json.Append("\"SUMMARYDIC\":\"" + c3Alarm.CODE_NAME + "\",");
        Json.Append("\"CODE\":\"" + c3Alarm.CODE + "\",");
        Json.Append("\"BOW_TYPE\":\"" + c3Alarm.BOW_TYPE + "\",");
        Json.Append("\"DRIVER_NUMBER\":\"" + c3Alarm.DRIVER_NO + "\",");
        Json.Append("\"DETAIL\":\"" + c3Alarm.DETAIL + "\",");
        Json.Append("\"STATUSDIC\":\"" + c3Alarm.STATUS_NAME + "\",");
        Json.Append("\"REPORT_DATE\":\"" + c3Alarm.REPORT_DATE + "\",");
        Json.Append("\"STATUS_TIME\":\"" + c3Alarm.STATUS_TIME + "\",");
        Json.Append("\"LOCNO\":\"" + c3Alarm.DETECT_DEVICE_CODE + "\",");
        Json.Append("\"VENDOR\":\"" + c3Alarm.VENDOR + "\",");

        if (!string.IsNullOrEmpty(c3Alarm.ALARM_ANALYSIS))
        {
            Json.Append("\"ALARM_ANALYSIS\":\"" + c3Alarm.ALARM_ANALYSIS.Replace("\n", "") + "\",");
        }
        else
        {
            Json.Append("\"ALARM_ANALYSIS\":\"" + c3Alarm.ALARM_ANALYSIS + "\",");
        }
        if (!string.IsNullOrEmpty(c3Alarm.PROPOSAL))
        {
            Json.Append("\"PROPOSAL\":\"" + c3Alarm.PROPOSAL.Replace("\n", "") + "\",");
        }
        else
        {
            Json.Append("\"PROPOSAL\":\"" + c3Alarm.PROPOSAL + "\",");
        }
        if (!string.IsNullOrEmpty(c3Alarm.REMARK))
        {
            Json.Append("\"REMARK\":\"" + c3Alarm.REMARK.Replace("\n", "") + "\",");
        }
        else
        {
            Json.Append("\"REMARK\":\"" + c3Alarm.REMARK + "\",");
        }
        Json.Append("\"REPORT_PERSON\":\"" + c3Alarm.REPORT_PERSON + "\",");
        Json.Append("\"SEVERITY\":\"" + c3Alarm.SEVERITY + "\",");
        if (!string.IsNullOrEmpty(c3Alarm.TASK_ID))
        {
            Json.Append("\"MisShow\":\"" + "true" + "\",");
        }
        else
        {
            Json.Append("\"MisShow\":\"" + "false" + "\",");
        }
        return Json;
    }
    /// <summary>
    /// 拼接缺陷GIS的查询条件
    /// </summary>
    /// <param name="startTime">开始时间</param>
    /// <param name="endTime">结束时间</param>
    private static AlarmCond getConditionsAlarm(string startTime, string endTime, AlarmCond alarmcond)
    {
        ///缺陷GIS条件查询
        if (startTime != "" && endTime != "")
        {
            string id = HttpContext.Current.Request["id"];//id
            string ju = HttpContext.Current.Request["ju"];//局
            string duan = HttpContext.Current.Request["duan"];//段
            string chejian = HttpContext.Current.Request["chejian"];//车间
            string gongqu = HttpContext.Current.Request["gongqu"];//工区
            string line = HttpContext.Current.Request["line"];//线路
            string position = HttpContext.Current.Request["position"];//线路
            string bridgetune = HttpContext.Current.Request["bridgetune"];//线路
            string xb = HttpContext.Current.Request["xb"];//行别
            string txtqz = HttpContext.Current.Request["txtqz"];//区站
            string startKm = HttpContext.Current.Request["txtstartkm"];//起始公里标
            string endKm = HttpContext.Current.Request["txtendkm"];//结束公里标
            string ddllx = HttpContext.Current.Request["ddllx"];//数据类型
            string dllzt = HttpContext.Current.Request["dllzt"];//数据状态
            string txtpole = HttpContext.Current.Request["txtpole"];//支柱
            string jibie = HttpContext.Current.Request["jibie"];//级别
            string codeName = HttpContext.Current.Request["zhuangtai"]; //报警类型
            string data_type = "ALARM";
            if (alarmcond.businssAnd == null)
                alarmcond.businssAnd = "1=1";
            if (codeName != null && codeName != "")
            {
                alarmcond.CODE_NAME = codeName;
            }
            if (jibie != null && jibie != "全部" && jibie != "")
            {
                string jbcode = "";
                for (int i = 0; i < jibie.Split(',').Length; i++)
                {
                    if (jbcode == "")
                    {
                        jbcode = "'" + jibie.Split(',')[i] + "'";
                    }
                    else
                    {
                        jbcode = jbcode + ",'" + jibie.Split(',')[i] + "'";
                    }
                }
                alarmcond.businssAnd += " and SEVERITY in (" + jbcode + ") ";
            }
            if (!string.IsNullOrEmpty(startKm))
            {
                alarmcond.startKm = Convert.ToInt32(startKm);
            }
            if (!string.IsNullOrEmpty(endKm))
            {
                alarmcond.endKm = Convert.ToInt32(endKm);
            }
            if (id != null && id != "")
            {
                alarmcond.ID = id;
            }
            if (ju != null && ju != "0")
            {
                alarmcond.BUREAU_CODE = ju;
            }
            if (duan != null && duan != "0")
            {
                if (duan.Contains("GDD"))
                    alarmcond.POWER_SECTION_CODE = duan;
                else
                    alarmcond.P_ORG_CODE = duan;
            }
            if (chejian != null && chejian != "0")
            {
                alarmcond.WORKSHOP_CODE = chejian;
            }
            if (gongqu != null && gongqu != "0")
            {
                alarmcond.ORG_CODE = gongqu;
            }
            //if (line != null && line != "0")
            //{
            //    alarmcond.LINE_CODE = line;
            //}

            if (line != null && line != "0")
            {
                if (line.IndexOf(",") > 0)
                {
                    if (alarmcond.businssAnd != null)
                    {
                        alarmcond.businssAnd += " and ";
                    }
                    string[] code_array = line.Split(',');
                    string codestring = "";
                    for (var i = 0; i < code_array.Length; i++)
                    {
                        codestring += "'" + code_array[i] + "',";
                    }
                    codestring = codestring.Substring(0, codestring.Length - 1);
                    alarmcond.businssAnd += " LINE_CODE in (" + codestring + ") ";
                }
                else
                {
                    alarmcond.LINE_CODE = line;
                }
            }

            if (position != null && position != "0")
            {
                alarmcond.POSITION_CODE = position;
            }
            if (bridgetune != null && bridgetune != "0")
            {
                alarmcond.BRG_TUN_CODE = bridgetune;
            }
            if (!string.IsNullOrEmpty(txtqz))
            {
                alarmcond.ORG_NAME = txtqz;
            }
            if (xb != null && xb != "0")
            {
                alarmcond.DIRECTION = xb;
            }
            alarmcond.CATEGORY_CODE = PublicMethod.GetCurrentC(ddllx);
            DateTime startdate = DateTime.Parse(HttpContext.Current.Request["startTime"]);
            alarmcond.startTime = startdate;
            DateTime enddate = DateTime.Parse(HttpContext.Current.Request["endTime"]);
            alarmcond.endTime = enddate;
            if (!string.IsNullOrEmpty(txtpole))
            {
                alarmcond.businssAnd += " and POLE_NUMBER ='" + txtpole + "'";
            }
            if (dllzt != null && dllzt != "0" && dllzt != "null")
            {
                alarmcond.STATUS = dllzt;
            }
            if (data_type == "ALARM")
            {
                alarmcond.businssAnd += " and DATA_TYPE !='EVENT'"; //C6有原始数据
            }
            else
            {
                alarmcond.businssAnd += " and DATA_TYPE ='FAULT'";
            }
        }
        else
        {
            alarmcond.startTime = DateTime.Now.AddDays(Int32.Parse(ConfigurationManager.AppSettings["FaultTimePeriod"]));
            alarmcond.endTime = DateTime.Now;
            if (alarmcond.businssAnd != "" && alarmcond.businssAnd != null)
            {
                alarmcond.businssAnd += " and ";
            }
            alarmcond.businssAnd += " status <> 'AFSTATUS05'  and status <> 'AFSTATUS02' ";//状态
        }
        return alarmcond;
    }
    /// <summary>
    /// 拼接实时GIS的缺陷查询条件
    /// </summary>
    /// <param name="lineCode">线路</param>
    /// <param name="startTime">开始时间</param>
    /// <param name="alarmcond">alarm对象</param>
    private static AlarmCond getActualFault(String lineCode, string startTime, AlarmCond alarmcond)
    {
        if (!string.IsNullOrEmpty(lineCode))
        {
            alarmcond.LINE_CODE = lineCode;
        }
        string Org = HttpContext.Current.Request["Org"];
        string OrgType = HttpContext.Current.Request["OrgType"];
        string LocaTpye = HttpContext.Current.Request["LocaTpye"];
        if (!string.IsNullOrEmpty(HttpContext.Current.Request["severity"]))
        {
            alarmcond.SEVERITY = HttpContext.Current.Request["severity"].ToString();
        }
        if (!string.IsNullOrEmpty(HttpContext.Current.Request["status"]))
        {
            alarmcond.STATUS = HttpContext.Current.Request["status"].ToString();
        }
        switch (OrgType)
        {
            case "局":
                alarmcond.BUREAU_CODE = Org;
                break;
            case "供电段":
                alarmcond.POWER_SECTION_CODE = Org;
                break;
            case "机务段":
                alarmcond.P_ORG_CODE = Org;
                break;
            case "车辆段":
                alarmcond.P_ORG_CODE = Org;
                break;
            default:
                break;
        }
        alarmcond.businssAnd = " 1=1 and  status ='AFSTATUS01' ";
        alarmcond.orderBy = " raised_time desc";
        if (!string.IsNullOrEmpty(LocaTpye))
        {
            alarmcond.businssAnd += " and  GetLocaType(detect_device_code)=" + LocaTpye;
        }
        if (!string.IsNullOrEmpty(startTime))
        {
            alarmcond.startTime = Convert.ToDateTime(startTime);
            alarmcond.endTime = DateTime.Now;
        }
        else
        {
            alarmcond.businssAnd += " and raised_time >=(select max(t4.raised_time)-2 from alarm t4   where category_code='3C' and status ='AFSTATUS01' and raised_time<= (select sysdate from dual) )";//最大日期(小于当天)，减2天以内。
        }
        return alarmcond;
    }
    /// <summary>
    /// 拼接轨迹GIS的缺陷查询条件
    /// </summary>
    /// <param name="context"></param>
    /// <param name="deviceId">车号</param>
    /// <param name="startTime">开始时间</param>
    /// <param name="endTime">结束时间</param>
    /// <param name="alarmcond">告警查询对象</param>
    private static AlarmCond getLocoAlarm(HttpContext context, String deviceId, string startTime, string endTime, AlarmCond alarmcond)
    {

        alarmcond.businssAnd = "  status <> 'AFSTATUS02'";

        string alarmType = context.Request["alarmType"];//报警类型
        string alarmType_type = context.Request["alarmType_type"];//报警类型定义  父级还是子级
        if (!string.IsNullOrEmpty(alarmType))
        {
            if (!string.IsNullOrEmpty(alarmType_type))
            {
                if (alarmType_type == "parent")
                {
                    if (!string.IsNullOrEmpty(alarmcond.businssAnd))
                    {
                        alarmcond.businssAnd += " and ";
                    }
                    alarmcond.businssAnd += " CODE IN ( SELECT DIC_CODE FROM SYS_DIC WHERE P_CODE = '" + alarmType + "')";
                }
            }
            else
            {
                alarmcond.CODE = alarmType;
            }
        }

        string txtqz = HttpContext.Current.Request["txtqz"];//区站
        if (!string.IsNullOrEmpty(txtqz) && txtqz != "undefined")
        {
            //c3Smscond.POSITION_NAME = txtqz;
            if (!string.IsNullOrEmpty(alarmcond.businssAnd))
            {
                alarmcond.businssAnd += " and ";
            }
            if (txtqz.IndexOf("－") > -1)
            {
                string[] charList = txtqz.Split('－');
                alarmcond.businssAnd += string.Format(" (POSITION_NAME='{0}' or POSITION_NAME='{1}' or POSITION_NAME='{2}' or POSITION_NAME='{3}')", charList[0] + "－" + charList[1], charList[1] + "－" + charList[0], charList[0] + "-" + charList[1], charList[1] + "-" + charList[0]);
            }
            else
            {
                alarmcond.businssAnd += string.Format(" POSITION_NAME='{0}'", txtqz);
            }
        }


        if (!string.IsNullOrEmpty(startTime))
        {
            alarmcond.startTime = Convert.ToDateTime(startTime);
            if (!string.IsNullOrEmpty(endTime))
            {
                alarmcond.endTime = Convert.ToDateTime(endTime);
            }
        }
        else
        {
            C3_SmsCond c3Smscond = new C3_SmsCond();
            c3Smscond.LOCOMOTIVE_CODE = deviceId;
            c3Smscond.orderBy = " detect_time desc";
            c3Smscond.page = 1;
            c3Smscond.pageSize = 1;

            List<C3_Sms> listc3sms = Api.ServiceAccessor.GetSmsService().getC3SmsbyCondition(c3Smscond);// 精细化查询 返回时间
            if (listc3sms.Count > 0)
            {
                //设备轨迹缺陷查询
                alarmcond.startTime = Convert.ToDateTime(listc3sms[0].DETECT_TIME.ToString("yyyy-MM-dd 00:00:00"));
                alarmcond.endTime = listc3sms[0].DETECT_TIME;
            }
        }
        //if (string.IsNullOrEmpty(context.Request.QueryString["_YS"])) //演示中在轨迹页面中不查看已取消状态的缺陷
        //{

        //}
        return alarmcond;
    }
    /// <summary>
    /// 判断导高拉出值是否为-1000或者-10000
    /// </summary>
    /// <param name="value"></param>
    /// <returns></returns>
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
    /// <summary>
    /// GPS转换并更新数据库
    /// </summary>
    /// <param name="list">数据源</param>
    /// <param name="GPS_X_NAME">百度经度列名</param>
    /// <param name="GPS_Y_NAME">百度纬度列名</param>
    /// <param name="ID_NAME">主键名</param>
    /// <param name="TABLE_NAME">表名</param>
    /// <returns></returns>
    public List<CoordinateConvert.Point2> GPSTranAndUpdate_list(List<Alarm> list, string GPS_X_NAME, string GPS_Y_NAME, string ID_NAME, string TABLE_NAME)
    {
        List<CoordinateConvert.Point2> oldlist = new List<CoordinateConvert.Point2>();
        List<CoordinateConvert.Point2> relist = new List<CoordinateConvert.Point2>();
        foreach (Alarm alarm in list)
        {
            if (alarm.GIS_X == 0 || alarm.GIS_Y == 0)
            {
                CoordinateConvert.Point2 point2 = new CoordinateConvert.Point2();
                point2.x_o = alarm.GIS_X_O.ToString();
                point2.y_o = alarm.GIS_Y_O.ToString();
                point2.ID = alarm.ID;
                oldlist.Add(point2);
            }
        }
        TransAndUpdate_p m_p = new TransAndUpdate_p();
        m_p.gps_x_name = GPS_X_NAME;
        m_p.gps_y_name = GPS_Y_NAME;
        m_p.ID_name = ID_NAME;
        m_p.tableName = TABLE_NAME;
        m_p.oldlist = oldlist;
        GPSTransform t = new GPSTransform();
        relist = t.TransAndUpdate(m_p);
        return relist;
    }
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }
}