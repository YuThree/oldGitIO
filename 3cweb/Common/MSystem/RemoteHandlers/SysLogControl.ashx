<%@ WebHandler Language="C#" Class="SysLogControl" %>

using System;
using System.Web;
using Api.Foundation.entity.Foundation;
using System.Collections.Generic;
using Api.Foundation.service;
using Api.SysManagement.Log.entity;
using Api.SysManagement.Log.entity.Cond;
using System.Text;

public class SysLogControl : ReferenceClass, IHttpHandler
{
    public void ProcessRequest(HttpContext context)
    {
        GetAll();
    }

    /// <summary>
    /// 获取所有用户
    /// </summary>
    private void GetAll()
    {
        int pageIndex = Convert.ToInt32(HttpContext.Current.Request["page"]);
        int pageSize = Convert.ToInt32(HttpContext.Current.Request["rp"]);
        SysLogCond cond = new SysLogCond();
        cond.pageNum = pageIndex;
        cond.pageSize = pageSize;
        if (HttpContext.Current.Request["USER_NAME"] != null && HttpContext.Current.Request["USER_NAME"] != "")
        {
            cond.USER_NAME = HttpContext.Current.Request["USER_NAME"];
        }
        if (HttpContext.Current.Request["OPERATION_NAME"] != null && HttpContext.Current.Request["OPERATION_NAME"] != "")
        {
            if (HttpContext.Current.Request["OPERATION_NAME"] != "全部日志")
            {
                cond.OPERATION_NAME = HttpContext.Current.Request["OPERATION_NAME"];
            }

        }
        if (HttpContext.Current.Request["CLIENT_IP"] != null && HttpContext.Current.Request["CLIENT_IP"] != "")
        {
            cond.CLIENT_IP = HttpContext.Current.Request["CLIENT_IP"];
        }
        //if (HttpContext.Current.Request["DETAIL"] != null && HttpContext.Current.Request["DETAIL"] != "")
        //{
        //    cond.DETAIL = HttpContext.Current.Request["DETAIL"];
        //}
        if (HttpContext.Current.Request["CZinfo"] != null && HttpContext.Current.Request["CZinfo"] != "")
        {
            cond.DETAIL = HttpContext.Current.Request["CZinfo"];
        }
        if (HttpContext.Current.Request["ModuleFunction"] != null && HttpContext.Current.Request["ModuleFunction"] != "" && HttpContext.Current.Request["ModuleFunction"] != "0")
        {
            cond.MODULE_NAME = HttpContext.Current.Request["ModuleFunction"];
        }
        if (HttpContext.Current.Request["START_TIME"] != null && HttpContext.Current.Request["START_TIME"] != "")
        {
            try
            {
                cond.startTime = DateTime.Parse(HttpContext.Current.Request["START_TIME"]);
            }
            catch { }

        }
        if (HttpContext.Current.Request["END_TIME"] != null && HttpContext.Current.Request["END_TIME"] != "")
        {
            try
            {
                cond.endTime = DateTime.Parse(HttpContext.Current.Request["END_TIME"]);
            }
            catch { }

        }
        if (HttpContext.Current.Request["IS_SUCCEED"] != null && HttpContext.Current.Request["IS_SUCCEED"] != "")
        {
            if (HttpContext.Current.Request["IS_SUCCEED"] == "0")
            {
            }
            else
            {
                cond.IS_SUCCEED = HttpContext.Current.Request["IS_SUCCEED"];
            }
        }
        cond.pageNum = pageIndex;
        cond.pageSize = pageSize;
        cond.orderBy = "order by LOG_TIME DESC";
        List<SysLog> list = Api.ServiceAccessor.GetLogService().queryLog(cond);
        int recordCount = Api.ServiceAccessor.GetLogService().getLogCount(cond);
        StringBuilder sb = new StringBuilder();
        sb.Append("{\"rows\":[");
        foreach (SysLog sl in list)
        {
            string detail = sl.DETAIL;
            if (!string.IsNullOrEmpty(detail)&&detail.Contains("登录失败"))
            {
                detail = detail.Replace(":", "  ").Replace("\"", "'").Replace("{", "(").Replace("}", ")");
            }
            sb.AppendFormat("{{\"USER_NAME\":\"{0}\",\"MODULE_NAME\":\"{1}\",\"CLIENT_IP\":\"{2}\",\"DETAIL\":\"{3}\",\"LOG_TIME\":\"{4}\",\"OPERATION_NAME\":\"{5}\",\"IS_SUCCEED\":\"{6}\",\"id\":\"log{7}\"}},",
               sl.USER_NAME, sl.MODULE_NAME, sl.CLIENT_IP, detail, sl.LOG_TIME.ToString("yyyy-MM-dd HH:mm:ss"), sl.OPERATION_NAME, sl.IS_SUCCEED, sl.ID);
        }
        string js = sb.ToString();
        if (js.LastIndexOf(',') > -1)
        {
            js = js.Substring(0, js.LastIndexOf(','));

        }
        js += String.Format("],\"page\":{0},\"rp\":{1},\"total\":{2}}}", pageIndex, pageSize, recordCount);
        HttpContext.Current.Response.Write(js);

    }


    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}