<%@ WebHandler Language="C#" Class="downloadreport" %>

using System;
using System.Web;
using Api.Fault.entity.alarm;
using System.Collections.Generic;
using System.Text;

public class downloadreport : ReferenceClass, IHttpHandler {

    public void ProcessRequest(HttpContext context)
    {
        try
        {
            string action = HttpContext.Current.Request["action"];
            switch (action)
            {
                case "download":
                    download();
                    break;
                case "downloadSingle":
                    downloadSingle();
                    break;
                default:
                    break;
            }
        }
        catch (Exception ex)
        {

            log4net.ILog log = log4net.LogManager.GetLogger("报表下载");
            log.Error("执行出错", ex);
        }
    }
    /// <summary>
    /// 报表批量下载
    /// </summary>
    public void download()
    {
        //C3_AlarmCond alarmCond = my_alarm.GetC3_AlermCond_byListWhere(); //生成告警条件实体
        C3_AlarmCond alarmCond= my_alarm.GetC3_AlermCond_AlarmList();
        alarmCond.orderBy = null;
        string user = Api.Util.UserPermissionc.GetUser_PermissionWhereStr_orgCode_p_orgCode();
        if (!string.IsNullOrEmpty(user))
        {
            if (!string.IsNullOrEmpty(alarmCond.businssAnd))
            {
                alarmCond.businssAnd += " and ";
            }
            alarmCond.businssAnd += user;
        }
        List<string> urllist = Api.ServiceAccessor.GetAlarmService().getURL(alarmCond);
        StringBuilder str = new StringBuilder();
        StringBuilder content = new StringBuilder();
        str.Append("{\"url\":[");
        if (urllist.Count > 0)
        {
            for (int i = 0; i < urllist.Count; i++)
            {
                content.Append("\"" + urllist[i].Replace("\\","\\\\") + "\",");
            }
            str.Append((content.ToString().Substring(0, content.Length - 1)).ToString());
        }
        str.Append("]}");

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(str.ToString());
    }
    /// <summary>
    /// 报表单条下载
    /// </summary>
    public void downloadSingle()
    {
        string alarmid = HttpContext.Current.Request["alarmid"];
        string url = Api.ServiceAccessor.GetAlarmService().getURL(alarmid);
        string str = null;
        if (!string.IsNullOrEmpty(url))
        {
            str = "{\"url\":[\"" + url.Replace("\\", "\\\\") + "\"]}";
        }
        else
        {
            str = "{\"url\":[\"" + "" + "\"]}";
        }

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(str);
    }

    public bool IsReusable {
        get {
            return false;
        }
    }

}