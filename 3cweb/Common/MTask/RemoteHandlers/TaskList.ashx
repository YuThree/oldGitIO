<%@ WebHandler Language="C#" Class="TaskList" %>

using System;
using System.Web;
using System.Web.SessionState;
using Api.Foundation.entity.Cond;
using Api.Foundation.entity.Foundation;
using System.Collections.Generic;
using Api.Task.entity;
public class TaskList : ReferenceClass, IHttpHandler, IRequiresSessionState
{

    public void ProcessRequest(HttpContext context)
    {
        context.Response.Cache.SetCacheability(HttpCacheability.NoCache);
        context.Response.ContentType = "text/plain";
        String type = context.Request["type"];
        String dataType = context.Request["dataType"];
        switch (type)
        {
            case "toDoTask":
                GetMisTaskList(context, type, dataType);
                break;
            case "toDoTjTask":
                GetMisTjTaskList(context, type, dataType);
                break;
            case "mySelfTask":
                GetMisTaskList(context, type, dataType);
                break;
            case "mySelfTjTask":
                GetMisTjTaskList(context, type, dataType);
                break;
            case "hisTask":
                GetMisTaskList(context, type, dataType);
                break;
            case "hisTjTask":
                GetMisTjTaskList(context, type, dataType);
                break;
            case "sendTask":
                GetMisTaskList(context, type, dataType);
                break;
            case "sendTjTask":
                GetMisTjTaskList(context, type, dataType);
                break;
            case "taskTracgrid":
                GetMisTaskList(context, type, dataType);
                break;
            case "deleteMisTask":
                DeleteMisTask(context);
                break;
            case "batchDistribution":
                BatchDistribution(context);
                break;
            case "lowerTask":
                GetMisTaskList(context, type, dataType);
                break;
        }
    }
    /// <summary>
    /// 获取任务列表
    /// </summary>
    /// <param name="context"></param>
    public void GetMisTaskList(HttpContext context, String type, String dataType)
    {
        //获取前台页码
        String obj = "";

        int pageIndex = Convert.ToInt32(context.Request["page"]);
        //获取前台条数
        int pageSize = Convert.ToInt32(context.Request["rp"]);
        MisTaskCond misTaskCond = new MisTaskCond();
        if (!String.IsNullOrEmpty(dataType))
            misTaskCond.CATEGORY_CODE = dataType;
        misTaskCond.page = pageIndex;
        misTaskCond.pageSize = pageSize;
        misTaskCond.orderBy = " DISPOSE_TIME DESC";

        string Review_ticket = Convert.ToString(context.Request["Review_ticket_1"]) + "－" + Convert.ToString(context.Request["Review_ticket_2"]);
        string Handle_ticket = Convert.ToString(context.Request["Handle_ticket_1"]) + "－" + Convert.ToString(context.Request["Handle_ticket_2"]);
        string Review_startime = Convert.ToString(context.Request["Review_startime"]);
        string Review_endtime=Convert.ToString(context.Request["Review_endtime"]);
        string Handle_startime=Convert.ToString(context.Request["Handle_startime"]);
        string Handle_endtime=Convert.ToString(context.Request["Handle_endtime"]);
        string Reviewr=Convert.ToString(context.Request["Reviewer"]);
        string HandlePerson=Convert.ToString(context.Request["HandlePerson"]);
        string jb=Convert.ToString(context.Request["jb"]);
        string ddllx=Convert.ToString(context.Request["ddllx"]);
        if (!string.IsNullOrEmpty(Review_ticket) && Review_ticket != "－")
            misTaskCond.CHECK_TICKET = Review_ticket;
        if (!string.IsNullOrEmpty(Handle_ticket) && Handle_ticket != "－")
            misTaskCond.DEAL_TICKET = Handle_ticket;
        if (!string.IsNullOrEmpty(Reviewr))
            misTaskCond.CHECEKRNAME = Reviewr;
        if (!string.IsNullOrEmpty(HandlePerson))
            misTaskCond.DEALERNAME = HandlePerson;
        //if (!string.IsNullOrEmpty(jb))
        //    misTaskCond.SEVERITY = jb;
        if (jb != null && jb != "0" && jb != "")
        {
            jb = jb.Replace("类", "类','");
            if (misTaskCond.businssAnd != null)
            {
                misTaskCond.businssAnd += " and  ";
            }
            misTaskCond.businssAnd += " SEVERITY in ('" + jb + "')";
        }
        else
        {
            if (misTaskCond.businssAnd != null)
            {
                misTaskCond.businssAnd += " and  ";
            }
            misTaskCond.businssAnd += " SEVERITY IN (SELECT DIC_CODE FROM SYS_DIC WHERE P_CODE = 'SEVERITY')";
        }
        if (!string.IsNullOrEmpty(ddllx) && ddllx != "0")
            misTaskCond.CATEGORY_CODE = ddllx;
        if (!string.IsNullOrEmpty(Review_startime))
        {
            if (misTaskCond.businssAnd != null)
            {
                misTaskCond.businssAnd += " and  ";
            }
            misTaskCond.businssAnd += " CHECK_TIME >= TO_DATE('" + Convert.ToDateTime(Review_startime).ToString("yyyy/MM/dd HH:mm:ss") + "','yyyy/MM/dd HH24:mi:ss')";
        }
         if (!string.IsNullOrEmpty(Review_endtime))
        {
            if (misTaskCond.businssAnd != null)
            {
                misTaskCond.businssAnd += " and  ";
            }
            misTaskCond.businssAnd += " CHECK_TIME <= TO_DATE('" + Convert.ToDateTime(Review_endtime).ToString("yyyy/MM/dd HH:mm:ss") + "','yyyy/MM/dd HH24:mi:ss')";
        }
        if (!string.IsNullOrEmpty(Handle_startime))
        {
            if (misTaskCond.businssAnd != null)
            {
                misTaskCond.businssAnd += " and  ";
            }
            misTaskCond.businssAnd += " DEAL_TIME >= TO_DATE('" + Convert.ToDateTime(Handle_startime).ToString("yyyy/MM/dd HH:mm:ss") + "','yyyy/MM/dd HH24:mi:ss')";
        }
        if (!string.IsNullOrEmpty(Handle_endtime))
        {
            if (misTaskCond.businssAnd != null)
            {
                misTaskCond.businssAnd += " and  ";
            }
            misTaskCond.businssAnd += " DEAL_TIME <= TO_DATE('" + Convert.ToDateTime(Handle_endtime).ToString("yyyy/MM/dd HH:mm:ss") + "','yyyy/MM/dd HH24:mi:ss')";
        }


        MisTaskTracCond misTaskTracCond = new MisTaskTracCond();
        misTaskTracCond.page = pageIndex;
        misTaskTracCond.pageSize = pageSize;
        misTaskTracCond.orderBy = " DISPOSE_TIME ASC, DEAL_TIME ASC";
        switch (type)
        {
            case "toDoTask":
                obj = Api.ServiceAccessor.GetTaskService().getToDoMisTaskJson(misTaskCond);
                break;
            case "mySelfTask":
                obj = Api.ServiceAccessor.GetTaskService().getMySelfMisTaskJson(misTaskCond);
                break;
            case "hisTask":
                obj = Api.ServiceAccessor.GetTaskService().getHisMisTaskJson(misTaskCond);
                break;
            case "sendTask":
                obj = Api.ServiceAccessor.GetTaskService().getSendMisTaskJson(misTaskCond);
                break;
            case "taskTracgrid":
                misTaskTracCond.TID = context.Request["id"];
                obj = Api.ServiceAccessor.GetTaskService().getMisTaskTracJson(misTaskTracCond);
                break;
            case "lowerTask":
                obj = Api.ServiceAccessor.GetTaskService().getLowerTaskJson(misTaskCond);
                break;
        }
        obj = myfiter.json_RemoveSpecialStr_N(obj);//去除换行符
        context.Response.Write(obj);
        context.Response.End();
    }
    /// <summary>
    /// 获取统计任务列表
    /// </summary>
    /// <param name="context"></param>
    public void GetMisTjTaskList(HttpContext context, String type, String orgCode)
    {
        //获取前台页码
        String obj = "";

        int pageIndex = Convert.ToInt32(context.Request["page"]);
        //获取前台条数
        int pageSize = Convert.ToInt32(context.Request["rp"]);
        MisTaskCond misTaskCond = new MisTaskCond();
        misTaskCond.page = pageIndex;
        misTaskCond.pageSize = pageSize;
        misTaskCond.orderBy = " DISPOSE_TIME DESC";

        switch (type)
        {
            case "toDoTjTask":
                obj = Api.ServiceAccessor.GetTaskService().getToDoMisTjTaskJson(misTaskCond, orgCode);
                break;
            case "mySelfTjTask":
                obj = Api.ServiceAccessor.GetTaskService().getMySelfMisTjTaskJson(misTaskCond, orgCode);
                break;
            case "hisTjTask":
                obj = Api.ServiceAccessor.GetTaskService().getHisMisTjTaskJson(misTaskCond, orgCode);
                break;
            case "sendTjTask":
                obj = Api.ServiceAccessor.GetTaskService().getSendMisTjTaskJson(misTaskCond, orgCode);
                break;
        }
        context.Response.Write(obj);
        context.Response.End();
    }
    /// <summary>
    /// 删除任务
    /// </summary>
    /// <param name="context"></param>
    public void DeleteMisTask(HttpContext context)
    {
        String reStr = "";
        if (!String.IsNullOrEmpty(context.Request["id"]))
        {
            reStr = Api.ServiceAccessor.GetTaskService().deleteMisTask(context.Request["id"]);
        }
        else
        {
            reStr = "删除失败，无对应主键信息！";
        }
        context.Response.Write(reStr);
        context.Response.End();
    }
    /// <summary>
    /// 批量派发任务
    /// </summary>
    /// <param name="context"></param>
    public void BatchDistribution(HttpContext context)
    {
        String reStr = "操作成功，请到任务中去查看相关信息!";
        String[] alarms = context.Request["id"].Split(',');
        foreach (var obj in alarms)
        {
            String alarmId = obj.Substring(1);
            MisTaskCond misTaskCond = new MisTaskCond();
            misTaskCond.FAULTID = alarmId;
            int taskCount = Api.ServiceAccessor.GetTaskService().getMisTaskCount(misTaskCond);
            if (0 == taskCount)
            {
                Api.Fault.entity.alarm.Alarm alarm = Api.ServiceAccessor.GetAlarmService().getAlarm(alarmId);
                Api.Task.entity.MisTask misTask = new Api.Task.entity.MisTask();
                misTask.ID = "C" + Guid.NewGuid().ToString().Replace("-", "");
                misTask.CATEGORY_CODE = alarm.CATEGORY_CODE;//缺陷类型
                misTask.SEVERITY = alarm.SEVERITY;//等级
                misTask.CODE = alarm.CODE;//缺陷类型编码
                misTask.SUMMARY = alarm.CODE_NAME;//缺陷类型编码
                misTask.ALARM_ANALYSIS = alarm.ALARM_ANALYSIS;//缺陷分析

                misTask.FAULT_DESCRIPT = getFaultDescrit(alarm);//缺陷描述

                misTask.TASK_CODE = DateTime.Now.ToString().Replace("/", "").Replace(":", "").Replace(" ", "").Trim();//任务编号
                misTask.DATATYPE = "缺陷";//数据来源
                misTask.FAULTID = alarmId;//缺陷主键
                misTask.STATUS = alarm.STATUS;//状态
                misTask.STATUS_TIME = DateTime.Now;//状态时间
                misTask.DUE_TIME = DateTime.Now;//计划完成时间
                misTask.DISPOSE_TIME = DateTime.Now;//派发时间
                misTask.SPONSOR_TIME = DateTime.Now;//发起时间
                misTask.DEADLINE = DateTime.Now;//截止时间

                misTask.SPONSOR = Api.Util.Public.GetUserCode;//发起人
                misTask.SPONSORNAME = Api.Util.Public.GetPersonName;//发起人
                misTask.SPONSOR_DEPT = Api.Util.Public.GetDeptCode;//发起机构
                misTask.SPONSOR_DEPTNAME = Api.Util.Public.GetDeptName;//发起机构

                misTask.DISPOSERNAME = Api.Util.Public.GetPersonName;//派发者名称
                misTask.DISPOSER = Api.Util.Public.GetUserCode;//派发者
                misTask.DISPOSE_DEPTNAME = Api.Util.Public.GetDeptName;//派发机构
                misTask.DISPOSE_DEPT = Api.Util.Public.GetDeptCode;//派发机构

                switch (Api.Util.Public.GetDeptType)
                {
                    case "GDD":

                        UserCond userCond = new UserCond();
                        userCond.ORG_CODE = alarm.WORKSHOP_CODE;
                        IList<User> listUser = Api.ServiceAccessor.GetFoundationService().queryUser(userCond);
                        if (listUser != null && listUser.Count > 0)
                        {
                            misTask.RECEIVER = listUser[0].USER_CODE;
                            misTask.RECEIVERNAME = listUser[0].PER_NAME;
                            misTask.RECV_DEPT = alarm.WORKSHOP_CODE;//接收机构
                            misTask.RECV_DEPTNAME = alarm.WORKSHOP_NAME;//接收机构
                            Api.ServiceAccessor.GetTaskService().toTaskAndBute(misTask);

                            misTask.DISPOSERNAME = listUser[0].PER_NAME;//派发者名称
                            misTask.DISPOSER = listUser[0].USER_CODE;//派发者
                            misTask.DISPOSE_DEPTNAME = alarm.WORKSHOP_NAME;//派发机构
                            misTask.DISPOSE_DEPT = alarm.WORKSHOP_CODE;//派发机构

                            userCond = new UserCond();
                            userCond.ORG_CODE = alarm.ORG_CODE;
                            IList<User> listOrgUser = Api.ServiceAccessor.GetFoundationService().queryUser(userCond);
                            if (listOrgUser != null && listOrgUser.Count > 0)
                            {
                                misTask.RECEIVER = listOrgUser[0].USER_CODE;
                                misTask.RECEIVERNAME = listOrgUser[0].PER_NAME;
                                misTask.RECV_DEPT = alarm.ORG_CODE;//接收机构
                                misTask.RECV_DEPTNAME = alarm.ORG_NAME;//接收机构
                                Api.ServiceAccessor.GetTaskService().toTaskBute(misTask);
                            }
                        }
                        break;
                    case "CJ":
                        UserCond userCjCond = new UserCond();
                        userCjCond.ORG_CODE = alarm.ORG_CODE;
                        IList<User> listCjUser = Api.ServiceAccessor.GetFoundationService().queryUser(userCjCond);
                        if (listCjUser != null && listCjUser.Count > 0)
                        {
                            misTask.RECEIVER = listCjUser[0].USER_CODE;
                            misTask.RECEIVERNAME = listCjUser[0].PER_NAME;
                            misTask.RECV_DEPT = alarm.ORG_CODE;//接收机构
                            misTask.RECV_DEPTNAME = alarm.ORG_NAME;//接收机构
                            Api.ServiceAccessor.GetTaskService().toTaskAndBute(misTask);
                        }
                        break;
                    case "GQ":
                        reStr = "您没有派发的权限，请与管理员联系！";
                        break;
                    default:
                        UserCond userDCond = new UserCond();
                        userDCond.ORG_CODE = alarm.WORKSHOP_CODE;
                        IList<User> listDUser = Api.ServiceAccessor.GetFoundationService().queryUser(userDCond);
                        if (listDUser != null && listDUser.Count > 0)
                        {
                            misTask.RECEIVER = listDUser[0].USER_CODE;
                            misTask.RECEIVERNAME = listDUser[0].PER_NAME;
                            misTask.RECV_DEPT = alarm.WORKSHOP_CODE;//接收机构
                            misTask.RECV_DEPTNAME = alarm.WORKSHOP_NAME;//接收机构
                            Api.ServiceAccessor.GetTaskService().toTaskAndBute(misTask);

                            misTask.DISPOSERNAME = listDUser[0].PER_NAME;//派发者名称
                            misTask.DISPOSER = listDUser[0].USER_CODE;//派发者
                            misTask.DISPOSE_DEPTNAME = alarm.WORKSHOP_NAME;//派发机构
                            misTask.DISPOSE_DEPT = alarm.WORKSHOP_CODE;//派发机构

                            userDCond = new UserCond();
                            userDCond.ORG_CODE = alarm.ORG_CODE;
                            IList<User> listOrgUser = Api.ServiceAccessor.GetFoundationService().queryUser(userDCond);
                            if (listOrgUser != null && listOrgUser.Count > 0)
                            {
                                misTask.RECEIVER = listOrgUser[0].USER_CODE;
                                misTask.RECEIVERNAME = listOrgUser[0].PER_NAME;
                                misTask.RECV_DEPT = alarm.ORG_CODE;//接收机构
                                misTask.RECV_DEPTNAME = alarm.ORG_NAME;//接收机构
                                Api.ServiceAccessor.GetTaskService().toTaskBute(misTask);
                            }
                        }
                        break;
                }
            }
        }

        context.Response.Write(reStr);
        context.Response.End();
    }
    /// <summary>
    /// 获取缺陷描述
    /// </summary>
    /// <param name="alarm"></param>
    /// <returns></returns>
    public String getFaultDescrit(Api.Fault.entity.alarm.Alarm alarm)
    {
        String retStr = "";
        switch (alarm.CATEGORY_CODE)
        {
            case "1C":
                retStr = "【" + alarm.RAISED_TIME + "】【" + alarm.LINE_NAME + "】【" + alarm.POSITION_NAME + "】【" + alarm.POLE_NUMBER + "】【" + PublicMethod.KmtoString(alarm.KM_MARK) + "】【" + alarm.CODE_NAME + "】";
                break;
            case "2C":
                retStr = "【" + alarm.RAISED_TIME + "】【" + alarm.LINE_NAME + "】【" + alarm.POSITION_NAME + "】【" + alarm.POLE_NUMBER + "】【" + PublicMethod.KmtoString(alarm.KM_MARK) + "】【" + alarm.ALARM_ANALYSIS + "】";
                break;
            case "3C":
                retStr = "【" + alarm.RAISED_TIME + "】【" + alarm.DETECT_DEVICE_CODE + "】在【" + PublicMethod.GetPositionByAlarmid(alarm.ID).Replace("&nbsp;", "") + "   东经：" + alarm.GIS_X + " 北纬: " + alarm.GIS_Y + "】【" + PublicMethod.KmtoString(alarm.KM_MARK) + "】：缺陷温度【" + myfiter.GetTEMP(alarm.NVALUE4, "℃") + "】环境温度【" + myfiter.GetTEMP(alarm.NVALUE5, "℃") + "】 导高【" + myfiter.GetLINE_HEIGHT(alarm.NVALUE2) + "mm】拉出值【" + myfiter.GetPULLING_VALUE(alarm.NVALUE3) + "mm】";
                break;
            case "4C":
                retStr = "【" + alarm.RAISED_TIME + "】【" + alarm.LINE_NAME + "】【" + alarm.POSITION_NAME + "】【" + alarm.POLE_NUMBER + "】【" + PublicMethod.KmtoString(alarm.KM_MARK) + "】【" + alarm.DETAIL + "】";
                break;
            case "5C":
                break;
            case "6C":
                break;
        }
        return retStr;
    }
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}