<%@ WebHandler Language="C#" Class="HardDiskForm" %>

using System;
using System.Configuration;
using System.Diagnostics;
using System.IO;
using System.Web;
using System.Text;
using Api.Event.entity;
using Api.HardDisk.entity;
using System.Collections.Generic;
using System.Web.Script.Serialization;
using System.Runtime.Serialization.Json;
using Api.SysManagement.Log.entity.Cond;

public class HardDiskForm : ReferenceClass, IHttpHandler
{
    public void ProcessRequest(HttpContext context)
    {
        String type = context.Request["type"];
        if (!String.IsNullOrEmpty(type))
        {
            switch (type)
            {
                case "loadHardDiskList":
                    LoadHardDiskList(context, 1);
                    break;
                case "loadHardDiskLogList":
                    LoadHardDiskLogList(context);
                    break;
                case "loadHardDiskListSerch":
                    LoadHardDiskList(context, 2);
                    break;
                case "loadHardDisk":
                    loadHardDisk(context);
                    break;
                case "add":
                    AddHardDisk(context);
                    break;
            }
        }
    }
    /// <summary>
    /// 得到硬盘详情
    /// </summary>
    /// <param name="context"></param>
    private void loadHardDisk(HttpContext context)
    {
        HardDiskManage hardDiskManage = Api.ServiceAccessor.GetHardDiskManageServer().GetHardDiskManage(context.Request["id"]);
        DataContractJsonSerializer serializer = new DataContractJsonSerializer(hardDiskManage.GetType());
        JavaScriptSerializer jss = new JavaScriptSerializer();
        using (MemoryStream ms = new MemoryStream())
        {


            hardDiskManage.STATUS_TIME = Convert.ToDateTime(hardDiskManage.STATUS_TIME.ToString("yyyy-mm-dd"));
            hardDiskManage.START_TIME = Convert.ToDateTime(hardDiskManage.STATUS_TIME.ToString("yyyy-mm-dd"));
            hardDiskManage.END_TIME = Convert.ToDateTime(hardDiskManage.STATUS_TIME.ToString("yyyy-mm-dd"));

            serializer.WriteObject(ms, hardDiskManage);

            context.Response.Write(Encoding.UTF8.GetString(ms.ToArray()));
        }
    }
    private void AddHardDisk(HttpContext context)
    {
        bool str = false;
        try
        {
            string DEPT_CODE = HttpContext.Current.Request["DEPT_CODE"];
            string DEPT_NAME = HttpContext.Current.Request["DEPT_NAME"];
            string linecode = HttpContext.Current.Request["linecode"];
            string linename = HttpContext.Current.Request["linename"];
            string START_STATIONNAME = HttpContext.Current.Request["START_STATIONNAME"];
            string END_STATIONNAME = HttpContext.Current.Request["END_STATIONNAME"];
            string DIRECTION = HttpContext.Current.Request["DIRECTION"];
            string START_TIME = HttpContext.Current.Request["START_TIME"];
            string END_TIME = HttpContext.Current.Request["END_TIME"];
            string CONTEXT = HttpContext.Current.Request["CONTEXT"];
            HardDiskManage hardDiskManage = new HardDiskManage();
            hardDiskManage.DEPT_NAME = DEPT_NAME;
            hardDiskManage.MIS_ORG_ID = DEPT_CODE;
            hardDiskManage.MIS_LINE_ID = linecode;
            hardDiskManage.LINE_NAME = linename;
            hardDiskManage.DIRECTION = DIRECTION;
            hardDiskManage.START_STATION = START_STATIONNAME;
            hardDiskManage.END_STATION = END_STATIONNAME;
            hardDiskManage.START_TIME = Convert.ToDateTime(START_TIME);
            hardDiskManage.END_TIME = Convert.ToDateTime(END_TIME);
            hardDiskManage.CONTEXT = CONTEXT;
            hardDiskManage.DATA_TYPE = "1C";
            //  str = Api.ServiceAccessor.GetHardDiskManageServer().AddHardDiskManage(hardDiskManage);
        }
        catch (Exception)
        {

            str = false;
        }
        finally
        {
            HttpContext.Current.Response.Write(true);
            
            
        }
    }
    /// <summary>
    /// 得到硬盘列表信息
    /// </summary>
    /// <param name="context"></param>
    private void LoadHardDiskList(HttpContext context, int sType)
    {
        HardDiskManageCond hardDiskManageCond = new HardDiskManageCond();
        hardDiskManageCond.DATA_TYPE = "3C";
        hardDiskManageCond.orderBy = "STATUS_TIME DESC";
        if (sType == 2)
        {
            if (!String.IsNullOrEmpty(context.Request["line"]))
            {
                hardDiskManageCond.LINE_NAME = context.Request["line"];
            }
            if (!String.IsNullOrEmpty(context.Request["loco"]))
            {
                hardDiskManageCond.LOCOMOTIVE_CODE = context.Request["loco"];
            }
            if (!String.IsNullOrEmpty(context.Request["startTime"]))
            {
                hardDiskManageCond.startTime = Convert.ToDateTime(context.Request["startTime"]);
            }
            if (!String.IsNullOrEmpty(context.Request["endTime"]))
            {
                hardDiskManageCond.endTime = Convert.ToDateTime(context.Request["endTime"]);
            }
        }
        List<HardDiskManage> hardDiskManagelist = Api.ServiceAccessor.GetHardDiskManageServer().GetHardDiskManage(hardDiskManageCond);
        if (hardDiskManagelist.Count > 0)
        {
            DataContractJsonSerializer serializer = new DataContractJsonSerializer(hardDiskManagelist.GetType());
            using (MemoryStream ms = new MemoryStream())
            {
                serializer.WriteObject(ms, hardDiskManagelist);
                context.Response.Write(Encoding.UTF8.GetString(ms.ToArray()));
            }
        }
    }
    /// <summary>
    /// 
    /// </summary>
    /// <param name="context"></param>
    private void LoadHardDiskLogList(HttpContext context)
    {
        SysLogCond sysLogCond = new SysLogCond();
        sysLogCond.MODULE_NAME = "硬盘数据管理";
        //为演示效果只显示9条
        sysLogCond.pageNum = 1;
        sysLogCond.pageSize = 9;
        sysLogCond.orderBy = "order by LOG_TIME DESC";

        IList<Api.SysManagement.Log.entity.SysLog> sysLogList = Api.ServiceAccessor.GetLogService().queryLog(sysLogCond);
        if (sysLogList.Count > 0)
        {
            DataContractJsonSerializer serializer = new DataContractJsonSerializer(sysLogList.GetType());
            using (MemoryStream ms = new MemoryStream())
            {
                serializer.WriteObject(ms, sysLogList);
                context.Response.Write(Encoding.UTF8.GetString(ms.ToArray()));
            }
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