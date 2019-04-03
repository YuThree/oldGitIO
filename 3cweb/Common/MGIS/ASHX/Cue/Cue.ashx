/*========================================================================================*
* 功能说明：消息提示框
* 注意事项：
* 作    者： 邓杰
* 版本日期：2013年10月21日
* 变更说明：
* 版 本 号： V1.0
*=======================================================================================*/
<%@ WebHandler Language="C#" Class="Cue" %>

using System;
using System.Web;
using System.Text;
using Newtonsoft.Json;
using System.Data;
using Api.Fault.entity.alarm;
using System.Collections.Generic;
using Api.Fault.entity.sms;
using Api.Foundation.entity.Cond;

public class Cue : ReferenceClass, IHttpHandler
{

    /// <summary>
    /// 刷新GIS判断
    /// </summary>
    /// <param name="context"></param>
    public void ProcessRequest(HttpContext context)
    {
        context.Response.Cache.SetNoStore();
        string type = HttpContext.Current.Request["type"];
        if (type == "Alarm")
            GetAlarm();
        else
            GetLoco();
    }
    /// <summary>
    /// 判断是否有新告警
    /// </summary>
    private static void GetAlarm()
    {
        try
        {
            string time = HttpContext.Current.Request["Time"];
            AlarmCond alarmcond = new AlarmCond();
            alarmcond.businssAnd = " 1=1 ";
            string Category_Code = HttpContext.Current.Request["Category_Code"];
            alarmcond.CATEGORY_CODE = Category_Code;
            if (time.Trim() != "" && time.Trim() != null  && time!="undefined")
            {
                alarmcond.businssAnd += string.Format(" and (raised_time > to_date('{0}','yyyy-MM-dd hh24:mi:ss') or status_time> to_date('{0}','yyyy-MM-dd hh24:mi:ss'))", time);
                //alarmcond.startTime = Convert.ToDateTime(time).AddSeconds(1);
                //alarmcond.endTime = DateTime.Now;
            }
            else
            {
                alarmcond.startTime = DateTime.Now.AddDays(-1);
                alarmcond.endTime = DateTime.Now;
            }

            string _org = HttpContext.Current.Request["_org"];
            string _line = HttpContext.Current.Request["_line"];
            string _locatype = HttpContext.Current.Request["_locatype"];
            string _OrgType = HttpContext.Current.Request["_OrgType"];
            string _deviceID = HttpContext.Current.Request["_deviceID"];

            if (!string.IsNullOrEmpty(_locatype))
            {
                alarmcond.businssAnd += " and GetLocaType(detect_device_code)=" + _locatype;

            }
            if (!string.IsNullOrEmpty(_org))
            {
                string whereadd = Api.Util.UserPermissionc.GetUser_PermissionWhereStr_orgCode_p_orgCode(_org,null);

                if (!string.IsNullOrEmpty(whereadd))
                {
                    alarmcond.businssAnd += " and (" + whereadd + ")";
                }
            }
            
         
            if (!string.IsNullOrEmpty(_line))
                alarmcond.LINE_CODE = _line;
            if (!string.IsNullOrEmpty(_deviceID))
                alarmcond.DETECT_DEVICE_CODE = _deviceID;
            //alarmcond.businssAnd += " and data_type ='ALARM' and status ='AFSTATUS01' and GIS_X_O !=0";
            alarmcond.businssAnd += " and GIS_X_O !=0";
            alarmcond.orderBy = " raised_time desc";
            alarmcond.page = 1;
            alarmcond.pageSize = 5;
            List<Alarm> alarmlist = Api.ServiceAccessor.GetAlarmService().getAlarm(alarmcond);
            string HTML = alarmlist.Count + "!@#";
            HTML += "<table>";
            StringBuilder Json = new StringBuilder();            

            Json.Append("[");
            if (alarmlist != null)
            {
                for (int i = 0; i < alarmlist.Count; i++)
                {
                    Json.Append("{");
                    Json.Append("GIS_X:\"" + alarmlist[i].GIS_X + "\",");
                    Json.Append("GIS_Y:\"" + alarmlist[i].GIS_Y + "\",");
                    Json.Append("RAISED_TIME:\"" + alarmlist[i].RAISED_TIME + "\",");
                    Json.Append("ALARM_ID:\"" + alarmlist[i].ID + "\",");
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
            for (int i = 0; i < alarmlist.Count; i++)
            {
                HTML += "<tr><td><a href='#' ondblclick=\"dblpopAlarm_id('" + alarmlist[i].ID + "'," + i + ")\" onclick=\"clickpopAlarm_id('" + alarmlist[i].ID + "'," + i + ")\">" + alarmlist[i].RAISED_TIME + "<td></tr>";
            }
            HTML += "</table>";
            HttpContext.Current.Response.Write(HTML);


        }
        catch (Exception ex)
        {
            log4net.ILog log2 = log4net.LogManager.GetLogger("查询新报警");
            log2.Error("查询新报警出错", ex);
        }
    }
    /// <summary>
    /// 判断是否有新状态数据
    /// </summary>
    private static void GetLoco()
    {
        try
        {
            string time = HttpContext.Current.Request["Time"];
            C3_SmsCond smscode = new C3_SmsCond();

            if (time.Trim() != "" && time.Trim() != null && time!="undefined")
            {
                smscode.startTime = Convert.ToDateTime(time).AddSeconds(1);
                smscode.endTime = DateTime.Now;
            }
            else
            {
                smscode.startTime = DateTime.Now.AddDays(-1);
                smscode.endTime = DateTime.Now;
            }
            smscode.orderBy = " detect_time desc";
            smscode.page = 1;
            smscode.pageSize = 5;
            List<C3_Sms> smslist = Api.ServiceAccessor.GetSmsService().getC3SmsbyCondition(smscode);
            string HTML = smslist.Count.ToString();

            HttpContext.Current.Response.Write(HTML);


        }
        catch (Exception)
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