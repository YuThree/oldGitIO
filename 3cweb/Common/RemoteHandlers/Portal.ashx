<%@ WebHandler Language="C#" Class="Portal" %>

using System;
using System.Web;
using System.IO;
using System.Data;
using System.Collections.Generic;
using Api.Fault.entity.alarm;
using Api.Foundation.entity.Foundation;
using Api.Foundation.entity.Cond;
using System.Web.SessionState;
using Api.Task.entity;


public class Portal : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        string type = context.Request["type"];
        switch (type)
        {
            //查询所有设备
            case "alarmcount": GetAlarmCount();
                break;
            case "devicecount": GetDeviceCount();
                break;
            case "loccount": GetLocCount();
                break;
            case "taskcount": GetTaskCount();
                break;

        }
    }


    /// <summary>
    /// 获取报警总条数
    /// </summary>
    public void GetAlarmCount()
    {
        AlarmCond alarmCond = new AlarmCond();
        alarmCond.DATA_TYPE = "ALARM";//只查报警
        //alarmCond.startTime = DateTime.Parse(DateTime.Now.ToString("yyyy-MM-dd") + " 00:00:00");
        //alarmCond.endTime = DateTime.Now;
        alarmCond.STATUS = "AFSTATUS01";
        int recordCount = Api.ServiceAccessor.GetAlarmService().getAlarmCount(alarmCond);
        HttpContext.Current.Response.Write(recordCount.ToString());
        
        
    }
    /// <summary>
    /// 获取所有设备
    /// </summary>
    public void GetDeviceCount()
    {
        DeviceCond dc = new DeviceCond();
        dc.status = 2;//缺陷
        //dc. = DateTime.Parse(DateTime.Now.ToString("yyyy-MM-dd") + " 00:00:00");
        //dc.endTime = DateTime.Now;
        //获取总条数
        int recordCount = Api.ServiceAccessor.GetFoundationService().getDeviceCount(dc);
        HttpContext.Current.Response.Write(recordCount.ToString());
        
        
    }

    /// <summary>
    /// 获取所有设备
    /// </summary>
    public void GetLocCount()
    {
        int recordCount = Api.ServiceAccessor.GetFoundationService().queryLocomotiveList(null).Count;
        HttpContext.Current.Response.Write(recordCount.ToString());
        
        
    }


    /// <summary>
    /// 获取待办任务
    /// </summary>
    public void GetTaskCount()
    {
        MisTaskCond mst = new MisTaskCond();
        if (!String.IsNullOrEmpty(Api.Util.Public.GetDeptCode))
        {
            mst.RECV_DEPT = Api.Util.Public.GetDeptCode;
        }
        mst.businssAnd = " STATUS !='完成'";
        mst.orderBy = " DISPOSE_TIME DESC";
        int recordCount = Api.ServiceAccessor.GetTaskService().getMisTaskCount(mst); 
        HttpContext.Current.Response.Write(recordCount.ToString());
        
        
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}