<%@ WebHandler Language="C#" Class="Handler" %>

using System;
using System.Collections;
using System.Web;
using Api.Event.entity;
using System.Collections.Generic;
using System.Text;
using Api.Fault.entity.alarm;
using Api.Foundation.entity.Cond;

public class Handler : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        string eventid = context.Request["alarmId"];//报警主键
        string deviceid = context.Request["deviceId"];//支柱编码
        string type = context.Request["type"];
        switch (type)
        {
            case "ConvertToAlarm":
                break;
            case "getPoleDetail":
                GetPoleDetail(context);
                break;
            case "alarm":
                GetAlarm(deviceid, "ALARM", eventid);
                break;
            case "fault":
                GetAlarm(deviceid, "FAULT", eventid);
                break;
        }
    }

    /// <summary>
    /// 巡检转缺陷
    /// </summary>
    /// <param name="context"></param>
    public void GetPoleDetail(HttpContext context)
    {
        string deviceid = context.Request["deviceId"];

        Alarm alarm = Api.ServiceAccessor.GetAlarmService().getAlarm(context.Request["alarmid"]);
        PoleCond poleCond = new PoleCond();
        poleCond.POLE_CODE = deviceid;

        StringBuilder Json = new StringBuilder();

        IList<Api.Foundation.entity.Foundation.Pole> poleList = Api.ServiceAccessor.GetFoundationService().queryPole(poleCond);
        if (poleList.Count == 1)
        {
            Json.Append("{");
            Json.Append("\"showCovert\":\"0\", ");//显示转换按钮
            Json.Append("\"JU\":\"" + poleList[0].BUREAU_NAME + "\", ");//局
            Json.Append("\"GDD\":\"" + poleList[0].POWER_SECTION_NAME + "\", ");//供电段
            Json.Append("\"CJ\":\"" + poleList[0].WORKSHOP_NAME + "\", ");//车间
            Json.Append("\"BZ\":\"" + poleList[0].ORG_NAME + "\", ");//工区
            Json.Append("\"LINE_NAME\":\"" + poleList[0].LINE_NAME + "\", ");//线路
            Json.Append("\"QZ\":\"" + poleList[0].POSITION_NAME + "\", ");//区/站
            Json.Append("\"BRG_TUN_NAME\":\"" + poleList[0].BRG_TUN_NAME + "\", ");//桥隧
            Json.Append("\"POLE_NUMBER\":\"" + poleList[0].POLE_NO + "\", ");//杆号
            Json.Append("\"BCDAOGAO_T\":\"" + myfiter.GetLINE_HEIGHT(alarm.NVALUE2) + "\", ");//导高
            Json.Append("\"STAGGER_T\":\"" + myfiter.GetPULLING_VALUE(alarm.NVALUE3) + "\", ");//拉出
            Json.Append("\"wendu\":\"" + myfiter.GetTEMP(alarm.NVALUE4, "℃") + "\", ");//报警温度
            Json.Append("\"hjwendu\":\"" + myfiter.GetTEMP(alarm.NVALUE5, "℃") + "\", ");//环境温度
            Json.Append("\"sd\":\"" + myfiter.GetSpeed(alarm.NVALUE1) + "\", ");//速度
            Json.Append("\"KM\":\"" + PublicMethod.KmtoString(Convert.ToInt32(alarm.KM_MARK)) + "\", ");//公里标
            Json.Append("\"GIS_X\":\"" + poleList[0].GIS_LON + "\", ");//纬度
            Json.Append("\"GIS_Y\":\"" + poleList[0].GIS_LAT + "\", ");//经度
            Json.Append("\"POLE_IMG\":\"" + PublicMethod.FtpRoot + "/" + poleList[0].POLE_IMG + "\", ");//
            Json.Append("\"DIRECTION\":\"" + poleList[0].POLE_DIRECTION + "\", ");//行别
            Json.Append("\"SAMPLLED_TIME\":\"" + alarm.RAISED_TIME + "\", ");//采集时间
            Json.Append("\"HARDDISK_MANAGE_ID\":\"" + alarm.HARDDISK_MANAGE_ID + "\", ");
            Json.Append("\"DEVICE_ID\":\"" + alarm.DEVICE_ID + "\", ");
            Json.Append("}");
        }

        HttpContext.Current.Response.Write(Json);
    }

    /// <summary>
    /// 得到报警和缺陷信息
    /// </summary>
    /// <param name="eventid">巡检ID</param>
    /// <param name="deviceid">支柱编码</param>
    public void GetAlarm(string deviceid, string type, string eventid)
    {
        int pageIndex = 0;  //获取前台页码
        int pageSize = 0; //获取前台条数
        C3_AlarmCond alarmCond = new C3_AlarmCond();
        alarmCond.DEVICE_ID = deviceid;
        alarmCond.businssAnd = "id != '" + eventid + "' AND (STATUS != 'AFSTATUS02')";
        alarmCond.DATA_TYPE = type;
        alarmCond.orderBy = "RAISED_TIME DESC";
        if (!String.IsNullOrEmpty(HttpContext.Current.Request["page"]))
        {
            pageIndex = Convert.ToInt32(HttpContext.Current.Request["page"]);
            alarmCond.page = pageIndex;
        }

        if (!String.IsNullOrEmpty(HttpContext.Current.Request["rp"]))
        {
            pageSize = Convert.ToInt32(HttpContext.Current.Request["rp"]);
            alarmCond.pageSize = pageSize;
        }
        List<C3_Alarm> alarmList = Api.ServiceAccessor.GetAlarmService().getC3Alarm(alarmCond);
        int recordCount = Api.ServiceAccessor.GetAlarmService().getAlarmCount(alarmCond);
        StringBuilder jsonStr = new StringBuilder();
        jsonStr.Append("{'rows':[");
        for (int i = 0; i < alarmList.Count; i++)
        {
            jsonStr.Append("{");
            jsonStr.Append("'LOCOMOTIVE_CODE':'" + alarmList[i].DETECT_DEVICE_CODE + "',");
            jsonStr.Append("'RAISED_TIME':'" + alarmList[i].RAISED_TIME + "',");
            jsonStr.Append("'WZ':'" + PublicMethod.GetPositionByC3_Alarm(alarmList[i]) + "',");
            jsonStr.Append("'STATUS_NAME':'" + alarmList[i].STATUS_NAME + "',");
            jsonStr.Append("'SEVERITY':'" + alarmList[i].SEVERITY + "',");
            jsonStr.Append("'ID':'C" + alarmList[i].ID + "',");
            jsonStr.Append("'CZ':' <a  href=javascript:selectInfo(C" + alarmList[i].ID + ")>查看</a>'");
            jsonStr.Append(i == alarmList.Count - 1 ? "}" : "},");
        }

        jsonStr.Append("],'page':'" + pageIndex + "','rp':'" + pageSize + "','total':'" + recordCount + "'}");
        jsonStr = jsonStr.Replace("'", "\"");
        HttpContext.Current.Response.Write(jsonStr);
    }
    /// <summary>
    /// JSON格式调整，去掉换行。
    /// </summary>
    /// <param name="oldjson"></param>
    /// <returns></returns>
    public static string json_RemoveSpecialStr(string oldjson)
    {
        return oldjson.Replace("\n", "").Replace("\r", "").Replace("'", "\""); ;
    }
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}