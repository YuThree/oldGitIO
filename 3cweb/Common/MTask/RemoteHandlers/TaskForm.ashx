<%@ WebHandler Language="C#" Class="TaskForm" %>

using System;
using System.Web;
using System.Web.SessionState;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;
using Api.Fault.entity.alarm;
using Api.Task.entity;
using Api.Util;
using Fault.Dao;
using System.Linq;
using Api.Foundation.entity.Foundation;
using System.Data;
using System.Text.RegularExpressions;

public class TaskForm : ReferenceClass, IHttpHandler, IRequiresSessionState
{
    private Api.Fault.entity.alarm.Alarm alarm1;


    public void ProcessRequest(HttpContext context)
    {
        //没有缓存
        context.Response.Cache.SetCacheability(HttpCacheability.NoCache);
        context.Response.ContentType = "text/plain";
        String type = context.Request["type"];
        String Task = context.Request["Task"];
        string action = context.Request["action"];

        if (!String.IsNullOrEmpty(type))
        {
            switch (type)
            {
                ///获取任务详情
                case "openMisTask":
                    loadMisTask(context, type, Task);
                    break;
                ///根据报警新建任务详情
                case "openFaultTask":
                    loadMisTask(context, type, Task);
                    break;
                ///根据报警任务过程详情
                case "openMisTaskTrac":
                    loadMisTaskTrac(context, type, Task);
                    break;
                ///新建任务
                case "toTask":
                    toTask(context);
                    break;
                ///完成任务（整改反馈）
                case "toTaskComplete":
                    toTaskComplete(context,action);
                    break;
                ///取消任务
                case "toTaskCancel":
                    toTaskCancel(context,action);
                    break;
                ///派发任务
                case "toTaskBute":
                    toTaskBute(context);
                    break;
                ///复测任务
                case "toTaskCheck":
                    toTaskCheck(context,action);
                    break;
                ///抄送任务
                case "toSendTask":
                    toSendTask(context);
                    break;

            }
        }
    }

    /// <summary>
    /// 加载任务详情的JSON
    /// </summary>
    /// <param name="context"></param>
    /// <param name="type"></param>
    /// <param name="Task"></param>
    private void loadMisTask(HttpContext context, String type, string Task)
    {
        String obj = "";
        String btn = "";
        string DEAL_TICKET_1 = ""; //处理工作票号前部
        string DEAL_TICKET_2 = "";//处理工作票号后部
        string CHECK_TICKET_1 = "";//复核工作票前部
        string CHECK_TICKET_2 = "";//复核工作票后部
        switch (type)
        {
            case "openFaultTask":
                Api.Fault.entity.alarm.Alarm alarm = Api.ServiceAccessor.GetAlarmService().getAlarm(context.Request["id"]);
                alarm1 = alarm;

                Api.Task.entity.MisTask alarmTask = Api.ServiceAccessor.GetTaskService().getMisTask(alarm.TASK_ID);

                //获取工作票
                GetTicket(alarmTask.DEAL_TICKET, ref DEAL_TICKET_1, ref DEAL_TICKET_2);
                GetTicket(alarmTask.CHECK_TICKET, ref CHECK_TICKET_1, ref CHECK_TICKET_2);

                //获取界面展示模块
                btn = GetBtn(alarmTask, alarm);

                //获取修前修后图片
                System.Data.DataTable dt = ADO.AlarmQuery.QueryRepairPicture(alarm.ID);

                if (btn != "create")
                {

                    string ALARM_ANALYSIS1 = myfiter.json_RemoveSpecialStr_item_double( alarm.ALARM_ANALYSIS);
                    string FAULT_DESCRIPT1 = myfiter.json_RemoveSpecialStr_item_double((alarm.SVALUE15 == null || alarm.SVALUE15 == "0") ? alarmTask.FAULT_DESCRIPT : alarm.ALARM_ANALYSIS);


                    obj = "{\"FAULTID\":\"" + alarmTask.FAULTID + "\","//缺陷主键
                            + "\"TID\":\"" + alarmTask.ID + "\","//任务ID
                           + "\"ORG_CODE\":\"" + alarm.ORG_CODE + "\","//组织机构
                             + "\"CATEGORY_CODE\":\"" + getSeverityName(alarmTask.CATEGORY_CODE) + "\","//检测监测分类
                             + "\"SEVERITY\":\"" + getSeverity(alarmTask.SEVERITY) + "\","//等级
                             + "\"CODE\":\"" + alarmTask.CODE + "\","//缺陷类型编码
                             + "\"SUMMARY\":\"" + getCode_Name(alarmTask.CODE) + "\","//缺陷类型名称
                             + "\"ALARM_ANALYSIS\":\"" +  ALARM_ANALYSIS1 + "\","//缺陷分析
                             + "\"PROPOSAL\":\"" + alarmTask.PROPOSAL + "\","//处理建议
                             + "\"REMARK\":\"" + JudgeDouHao(alarmTask.REMARK) + "\","//备注
                             + "\"FAULT_DESCRIPT\":\"" + FAULT_DESCRIPT1+ "\","//缺陷描述,普通任务显示缺陷描述，重复报警显示重复报警描述
                             + "\"ORG_NAME\":\"" + alarm.ORG_NAME + "\","//工区名
                             + "\"WZ\":\""+myfiter.RemoveHTML(PublicMethod.GetPosition_Alarm(alarm.LINE_NAME,alarm.POSITION_NAME,alarm.BRG_TUN_NAME,alarm.DIRECTION,alarm.KM_MARK,alarm.POLE_NUMBER,alarm.DEVICE_ID,alarm.ROUTING_NO,alarm.AREA_NO,alarm.STATION_NO,alarm.STATION_NAME,alarm.TAX_MONITOR_STATUS),0)+"\","//位置信息
                             + "\"WZWEB\":\""+PublicMethod.GetPosition_Alarm(alarm.LINE_NAME,alarm.POSITION_NAME,alarm.BRG_TUN_NAME,alarm.DIRECTION,alarm.KM_MARK,alarm.POLE_NUMBER,alarm.DEVICE_ID,alarm.ROUTING_NO,alarm.AREA_NO,alarm.STATION_NO,alarm.STATION_NAME,alarm.TAX_MONITOR_STATUS)+"\","//位置信息
                             + "\"RAISED_TIME\":\"" + alarm.RAISED_TIME.ToString("yyyy-MM-dd HH:mm:ss") + "\","//报警检测时间
                             + "\"LOCOMOTIVE_CODE\":\"" + alarm.DETECT_DEVICE_CODE + "\","//3C设备车号
                             + "\"LCZ\":\"" + myfiter.GetPULLING_VALUE(alarm) + "\","//3C拉出值
                             + "\"DGZ\":\"" + myfiter.GetLINE_HEIGHT(alarm) + "\","//3C导高值
                             + "\"HJWD\":\"" + myfiter.GetTEMP_ENV(alarm) + "\","//3C环境温度
                             + "\"ZGWD\":\"" + myfiter.GetTEMP_MAX(alarm) + "\","//3C报警温度
                             + "\"ALARM_STATUS\":\""+ alarm.STATUS_NAME + "\","//报警状态

                             + "\"TASK_CODE\":\"" + alarmTask.TASK_CODE + "\","//任务编号
                             + "\"DATATYPE\":\"" + alarmTask.DATATYPE + "\","//数据来源
                             + "\"STATUS\":\"" + alarmTask.STATUS + "\","//状态
                             + "\"STATUS_TIME\":\"" + alarmTask.STATUS_TIME.ToString("yyyy-MM-dd") + "\","//状态更新时间
                             + "\"TASK_DESCRIPT\":\"" + JudgeDouHao(alarmTask.TASK_DESCRIPT) + "\","//任务描述
                             + "\"IS_TEL\":\"否\","//是否发短信
                             + "\"IS_MAIL\":\"否\","//是否发邮件
                             + "\"DEAL_RESULT\":\"" + JudgeDouHao(alarmTask.DEAL_RESULT) + "\","//处理结果
                             + "\"DEAL_DESCRIPT\":\"" + JudgeDouHao(alarmTask.DEAL_DESCRIPT) + "\","//处理描述

                             + "\"SPONSOR_DEPTNAME\":\"" + alarmTask.SPONSOR_DEPTNAME + "\","//发起机构
                             + "\"SPONSOR_DEPT\":\"" + alarmTask.SPONSOR_DEPT + "\","
                             + "\"SPONSORNAME\":\"" + alarmTask.SPONSORNAME + "\","//发起人
                             + "\"SPONSOR\":\"" + alarmTask.SPONSOR + "\","
                             + "\"SPONSOR_TIME\":\"" + alarmTask.SPONSOR_TIME.ToString("yyyy-MM-dd") + "\","//发起时间
                             + "\"DEADLINE\":\"" + alarmTask.DEADLINE.ToString("yyyy-MM-dd") + "\","//截止时间

                             + "\"RECV_DEPTNAME\":\"" + alarmTask.RECV_DEPTNAME + "\","//接收机构
                             + "\"RECV_DEPT\":\"" + alarmTask.RECV_DEPT + "\","
                             + "\"RECEIVERNAME\":\"" + alarmTask.RECEIVERNAME + "\","//接收者
                             + "\"RECEIVER\":\"" + alarmTask.RECEIVER + "\","

                             + "\"SENDDEPTNAME\":\"\","//抄送部门
                             + "\"SENDDEPT\":\"\","
                             + "\"BTN\":\"" + btn + "\","//按钮信息
                             + "\"DISPOSERNAME\":\"" + alarmTask.DISPOSERNAME + "\","//派发者【名称】
                             + "\"DISPOSER\":\"" + alarmTask.DISPOSER + "\","//派发者
                             + "\"DISPOSE_DEPTNAME\":\"" + alarmTask.DISPOSE_DEPTNAME + "\","//派发机构【名称】
                             + "\"DISPOSE_DEPT\":\"" + alarmTask.DISPOSE_DEPT + "\","//派发机构
                             + "\"DISPOSE_TIME\":\"" + alarmTask.DISPOSE_TIME.ToString("yyyy-MM-dd").Replace("/", "-") + "\","//派发时间

                            + "\"DEALER\":\"" + alarmTask.DEALER + "\","
                            + "\"DEALERNAME\":\"" + alarmTask.DEALERNAME + "\","
                            + "\"DEAL_DEPT\":\"" + alarmTask.DEAL_DEPT + "\","
                            + "\"DEAL_DEPTNAME\":\"" + alarmTask.DEAL_DEPTNAME + "\","
                            + "\"DEAL_TIME\":\"" + alarmTask.DEAL_TIME.ToString("yyyy-MM-dd HH:mm:ss") + "\","
                            + "\"DEAL_TICKET_1\":\"" + DEAL_TICKET_1 + "\","
                            + "\"DEAL_TICKET_2\":\"" + DEAL_TICKET_2 + "\","
                            + "\"DEAL_VALUE\":\"" + alarmTask.DEAL_VALUE + "\","
                            + "\"ACCEPTER\":\"" + alarmTask.ACCEPTER + "\","//验收人
                            + "\"AUDITOR\":\"" +alarmTask.AUDITOR + "\","//审核人
                            + "\"DECLARER\":\"" + alarmTask.DECLARER + "\","//填报人
                            + "\"DECLARE_TIME\":\"" + alarmTask.DECLARE_TIME.ToString("yyyy-MM-dd").Replace("/", "-") + "\","//填报时间
                            + "\"WAIT_REPAIR_PICTURE\":[" + (dt.Rows.Count>0? getUrl(dt.Rows[0], "WAIT_REPAIR_PICTURE"):"") + "],"//修前图片路径
                            + "\"DONE_REPAIR_PICTURE\":[" + (dt.Rows.Count>0? getUrl(dt.Rows[0], "DONE_REPAIR_PICTURE"):"") + "],"//修后图片路径
                            + "\"CHECKER\":\"" + alarmTask.CHECKER + "\","
                            + "\"CHECEKRNAME\":\"" + alarmTask.CHECEKRNAME + "\","
                            + "\"CHECK_DEPT\":\"" + alarmTask.CHECK_DEPT + "\","
                            + "\"CHECK_DEPTNAME\":\"" + alarmTask.CHECK_DEPTNAME + "\","
                            + "\"CHECK_DESCRIPT\":\"" + alarmTask.CHECK_DESCRIPT + "\","
                            + "\"CHECK_TICKET_1\":\"" + CHECK_TICKET_1 + "\","
                            + "\"CHECK_TICKET_2\":\"" + CHECK_TICKET_2 + "\","
                            + "\"CHECK_VALUE\":\"" + alarmTask.CHECK_VALUE + "\","
                            + "\"CHECK_TIME\":\"" + alarmTask.CHECK_TIME.ToString("yyyy-MM-dd HH:mm:ss") + "\","
                            + "\"CHECK_PICTURE\":[" + getUrl(alarmTask.CHECK_PICTURE) + "],"//复测图片地址
                            + "\"SEVERITY_NAME\":\"" + getSeverityName(alarmTask.SEVERITY) + "\","//等级名
                            + "\"DUE_TIME\":\"" + alarmTask.DUE_TIME.ToString("yyyy-MM-dd") + "\"} ";//计划完成时间
                }
                else
                {
                    obj = "{\"FAULTID\":\"" + alarm.ID + "\","//缺陷主键
                            + "\"TID\":\"" + alarmTask.ID + "\","//任务ID
                            + "\"ORG_CODE\":\"" + alarm.ORG_CODE + "\","//组织机构
                           + "\"CATEGORY_CODE\":\"" + getSeverityName(alarm.CATEGORY_CODE) + "\","//检测监测分类
                           + "\"SEVERITY\":\"" + getSeverity(alarm.SEVERITY) + "\","//等级
                           + "\"CODE\":\"" + alarm.CODE + "\","//缺陷类型编码
                           + "\"SUMMARY\":\"" + alarm.CODE_NAME + "\","//缺陷类型名称
                           + "\"ALARM_ANALYSIS\":\"" + (!string.IsNullOrEmpty(alarm.ALARM_ANALYSIS)?alarm.ALARM_ANALYSIS.Replace("\"","\\\""):"") + "\","//缺陷分析
                           + "\"PROPOSAL\":\"" + alarm.PROPOSAL + "\","//意见
                                                                       //+ "\"REMARK\":\"" + alarm.REMARK + "\","//备注
                           + "\"FAULT_DESCRIPT\":\"" + (!string.IsNullOrEmpty(getFaultDescrit(alarm))?getFaultDescrit(alarm).Replace("\"","\\\""):"") + "\","//缺陷描述
                           + "\"ORG_NAME\":\"" + alarm.ORG_NAME + "\","//工区名
                           + "\"WZ\":\""+myfiter.RemoveHTML(PublicMethod.GetPosition_Alarm(alarm.LINE_NAME,alarm.POSITION_NAME,alarm.BRG_TUN_NAME,alarm.DIRECTION,alarm.KM_MARK,alarm.POLE_NUMBER,alarm.DEVICE_ID,alarm.ROUTING_NO,alarm.AREA_NO,alarm.STATION_NO,alarm.STATION_NAME,alarm.TAX_MONITOR_STATUS),0)+"\","//位置信息
                            + "\"WZWEB\":\""+PublicMethod.GetPosition_Alarm(alarm.LINE_NAME,alarm.POSITION_NAME,alarm.BRG_TUN_NAME,alarm.DIRECTION,alarm.KM_MARK,alarm.POLE_NUMBER,alarm.DEVICE_ID,alarm.ROUTING_NO,alarm.AREA_NO,alarm.STATION_NO,alarm.STATION_NAME,alarm.TAX_MONITOR_STATUS)+"\","//位置信息
                           + "\"RAISED_TIME\":\"" + alarm.RAISED_TIME.ToString("yyyy-MM-dd HH:mm:ss") + "\","//报警检测时间
                           + "\"LOCOMOTIVE_CODE\":\"" + alarm.DETECT_DEVICE_CODE + "\","//3C设备车号
                           + "\"LCZ\":\"" + myfiter.GetPULLING_VALUE(alarm) + "\","//3C拉出值
                           + "\"DGZ\":\"" + myfiter.GetLINE_HEIGHT(alarm) + "\","//3C导高值
                           + "\"HJWD\":\"" + myfiter.GetTEMP_ENV(alarm) + "\","//3C环境温度
                           + "\"ZGWD\":\"" + myfiter.GetTEMP_MAX(alarm) + "\","//3C报警温度
                           + "\"ALARM_STATUS\":\""+ alarm.STATUS_NAME + "\","//报警状态

                           + "\"TASK_CODE\":\"\","//整改通知书号
                           + "\"DATATYPE\":\"缺陷\","//数据来源
                           + "\"STATUS\":\"\","//状态
                           + "\"STATUS_TIME\":\"" + DateTime.Now.ToString("yyyy-MM-dd") + "\","//状态更新时间
                           + "\"TASK_DESCRIPT\":\"\","//任务描述
                           + "\"IS_TEL\":\"否\","//是否发短信
                           + "\"IS_MAIL\":\"否\","//是否发邮件
                           + "\"DEAL_RESULT\":\"\","//处理结果
                           + "\"DEAL_DESCRIPT\":\"\","//处理描述

                           + "\"SPONSOR_DEPTNAME\":\"" + Api.Util.Public.GetDeptName + "\","//发起机构
                           + "\"SPONSOR_DEPT\":\"" + Api.Util.Public.GetDeptCode + "\","
                           + "\"SPONSORNAME\":\"" + Api.Util.Public.GetPersonName + "\","//发起人
                           + "\"SPONSOR\":\"" + Api.Util.Public.GetUserCode + "\","
                           + "\"SPONSOR_TIME\":\"" + DateTime.Now.ToString("yyyy-MM-dd") + "\","//发起时间
                           + "\"DEADLINE\":\"" + DateTime.Now.ToString("yyyy-MM-dd") + "\","//截止时间

                           + "\"RECV_DEPTNAME\":\"\","//接收机构
                           + "\"RECV_DEPT\":\"\","
                           + "\"RECEIVERNAME\":\"\","//接收者
                           + "\"RECEIVER\":\"\","

                           + "\"SENDDEPTNAME\":\"\","//抄送部门
                           + "\"SENDDEPT\":\"\","
                           + "\"BTN\":\"" + btn + "\","//按钮信息

                           + "\"DISPOSERNAME\":\"" + Api.Util.Public.GetPersonName + "\","//派发者【名称】
                           + "\"DISPOSER\":\"" + Api.Util.Public.GetUserCode + "\","//派发者
                           + "\"DISPOSE_DEPTNAME\":\"" + Api.Util.Public.GetDeptName + "\","//派发机构【名称】
                           + "\"DISPOSE_DEPT\":\"" + Api.Util.Public.GetDeptCode + "\","//派发机构
                           + "\"DISPOSE_TIME\":\"" + DateTime.Now.ToString("yyyy-MM-dd") + "\","//派发时间

                          + "\"DEALER\":\"\","
                          + "\"DEALERNAME\":\"\","
                          + "\"DEAL_DEPT\":\"\","
                          + "\"DEAL_DEPTNAME\":\"\","
                          + "\"DEAL_TIME\":\"\","
                          + "\"DEAL_TICKET_1\":\"\","
                          + "\"DEAL_TICKET_2\":\"\","
                          + "\"DEAL_VALUE\":\"\","
                          + "\"ACCEPTER\":\"\","//验收人
                          + "\"AUDITOR\":\"\","//审核人
                          + "\"DECLARER\":\"\","//填报人
                          + "\"DECLARE_TIME\":\"\","//填报时间
                          + "\"WAIT_REPAIR_PICTURE\":[],"
                          + "\"DONE_REPAIR_PICTURE\":[],"
                          + "\"CHECKER\":\"\","
                          + "\"CHECEKRNAME\":\"\","
                          + "\"CHECK_DEPT\":\"\","
                          + "\"CHECK_DEPTNAME\":\"\","
                          + "\"CHECK_DESCRIPT\":\"\","
                          + "\"CHECK_TICKET_1\":\"\","
                          + "\"CHECK_TICKET_2\":\"\","
                          + "\"CHECK_VALUE\":\"\","
                          + "\"CHECK_TIME\":\"\","
                          + "\"CHECK_PICTURE\":[],"//复测图片地址
                          + "\"SEVERITY_NAME\":\"" + Api.Util.Common.getSysDictionaryInfo(alarm.SEVERITY).CODE_NAME + "\","//等级名
                          + "\"DUE_TIME\":\"\"} ";//计划完成时间
                }
                break;

            case "openMisTask":
                Api.Task.entity.MisTask misTask = Api.ServiceAccessor.GetTaskService().getMisTask(context.Request["id"]);
                Api.Fault.entity.alarm.Alarm alarmT = Api.ServiceAccessor.GetAlarmService().getAlarm(misTask.FAULTID);
                alarm1 = alarmT;

                //获取工作票
                GetTicket(misTask.DEAL_TICKET, ref DEAL_TICKET_1, ref DEAL_TICKET_2);
                GetTicket(misTask.CHECK_TICKET, ref CHECK_TICKET_1, ref CHECK_TICKET_2);

                //获取界面展示模块
                btn = GetBtn(misTask, alarmT);

                //获取修前修后图片
                System.Data.DataTable dt1 = ADO.AlarmQuery.QueryRepairPicture(alarmT.ID);


                string ALARM_ANALYSIS =  myfiter.json_RemoveSpecialStr_item_double(alarmT.ALARM_ANALYSIS);
                string FAULT_DESCRIPT =  myfiter.json_RemoveSpecialStr_item_double((alarmT.SVALUE15 == null || alarmT.SVALUE15 == "0") ? misTask.FAULT_DESCRIPT : alarmT.ALARM_ANALYSIS);


                obj = "{\"FAULTID\":\"" + misTask.FAULTID + "\","//缺陷主键
                        + "\"TID\":\"" + misTask.ID + "\","//任务ID
                        + "\"ORG_CODE\":\"" + alarmT.ORG_CODE + "\","//组织机构
                           + "\"CATEGORY_CODE\":\"" +getSeverityName(misTask.CATEGORY_CODE) + "\","//检测监测分类
                           + "\"SEVERITY\":\"" + getSeverity(misTask.SEVERITY) + "\","//等级
                           + "\"CODE\":\"" + misTask.CODE + "\","//缺陷类型编码
                           + "\"SUMMARY\":\"" + getCode_Name(misTask.CODE) + "\","//缺陷类型名称
                           + "\"ALARM_ANALYSIS\":\"" +ALARM_ANALYSIS + "\","//缺陷分析
                           + "\"PROPOSAL\":\"" + misTask.PROPOSAL + "\","//处理建议
                           + "\"REMARK\":\"" + JudgeDouHao(misTask.REMARK) + "\","//备注
                           + "\"FAULT_DESCRIPT\":\"" + FAULT_DESCRIPT  + "\","//缺陷描述,普通任务显示缺陷描述，重复报警显示重复报警描述
                           + "\"ORG_NAME\":\"" + alarmT.ORG_NAME + "\","//工区名
                           + "\"WZ\":\""+myfiter.RemoveHTML(PublicMethod.GetPosition_Alarm(alarmT.LINE_NAME,alarmT.POSITION_NAME,alarmT.BRG_TUN_NAME,alarmT.DIRECTION,alarmT.KM_MARK,alarmT.POLE_NUMBER,alarmT.DEVICE_ID,alarmT.ROUTING_NO,alarmT.AREA_NO,alarmT.STATION_NO,alarmT.STATION_NAME,alarmT.TAX_MONITOR_STATUS),0)+"\","//位置信息
                           + "\"WZWEB\":\""+PublicMethod.GetPosition_Alarm(alarmT.LINE_NAME,alarmT.POSITION_NAME,alarmT.BRG_TUN_NAME,alarmT.DIRECTION,alarmT.KM_MARK,alarmT.POLE_NUMBER,alarmT.DEVICE_ID,alarmT.ROUTING_NO,alarmT.AREA_NO,alarmT.STATION_NO,alarmT.STATION_NAME,alarmT.TAX_MONITOR_STATUS)+"\","//位置信息
                           + "\"RAISED_TIME\":\"" + alarmT.RAISED_TIME.ToString("yyyy-MM-dd HH:mm:ss") + "\","//报警检测时间
                           + "\"LOCOMOTIVE_CODE\":\"" + alarmT.DETECT_DEVICE_CODE + "\","//3C设备车号
                           + "\"LCZ\":\"" + myfiter.GetPULLING_VALUE(alarmT) + "\","//3C拉出值
                           + "\"DGZ\":\"" + myfiter.GetLINE_HEIGHT(alarmT) + "\","//3C导高值
                           + "\"HJWD\":\"" + myfiter.GetTEMP_ENV(alarmT) + "\","//3C环境温度
                           + "\"ZGWD\":\"" + myfiter.GetTEMP_MAX(alarmT) + "\","//3C报警温度
                           + "\"ALARM_STATUS\":\""+ alarmT.STATUS_NAME + "\","//报警状态

                           + "\"TASK_CODE\":\"" + misTask.TASK_CODE + "\","//任务编号
                           + "\"DATATYPE\":\"" + misTask.DATATYPE + "\","//数据来源
                           + "\"STATUS\":\"" + misTask.STATUS + "\","//状态
                           + "\"STATUS_TIME\":\"" + misTask.STATUS_TIME.ToString("yyyy-MM-dd") + "\","//状态更新时间
                           + "\"TASK_DESCRIPT\":\"" + misTask.TASK_DESCRIPT + "\","//任务描述
                           + "\"IS_TEL\":\"否\","//是否发短信
                           + "\"IS_MAIL\":\"否\","//是否发邮件
                           + "\"DEAL_RESULT\":\"" + JudgeDouHao(misTask.DEAL_RESULT) + "\","//处理结果
                           + "\"DEAL_DESCRIPT\":\"" + JudgeDouHao(misTask.DEAL_DESCRIPT) + "\","//处理描述


                           + "\"SPONSOR_DEPTNAME\":\"" + misTask.SPONSOR_DEPTNAME + "\","//发起机构
                           + "\"SPONSOR_DEPT\":\"" + misTask.SPONSOR_DEPT + "\","
                           + "\"SPONSORNAME\":\"" + misTask.SPONSORNAME + "\","//发起人
                           + "\"SPONSOR\":\"" + misTask.SPONSOR + "\","
                           + "\"SPONSOR_TIME\":\"" + misTask.SPONSOR_TIME.ToString("yyyy-MM-dd") + "\","//发起时间
                           + "\"DEADLINE\":\"" + misTask.DEADLINE.ToString("yyyy-MM-dd") + "\","//截止时间

                           + "\"RECV_DEPTNAME\":\"" + misTask.RECV_DEPTNAME + "\","//接收机构
                           + "\"RECV_DEPT\":\"" + misTask.RECV_DEPT + "\","
                           + "\"RECEIVERNAME\":\"" + misTask.RECEIVERNAME + "\","//接收者
                           + "\"RECEIVER\":\"" + misTask.RECEIVER + "\","

                           + "\"SENDDEPTNAME\":\"\","//抄送部门
                           + "\"SENDDEPT\":\"\","
                           + "\"BTN\":\"" + btn + "\","//按钮信息
                           + "\"DISPOSERNAME\":\"" + misTask.DISPOSERNAME + "\","//派发者【名称】
                           + "\"DISPOSER\":\"" + misTask.DISPOSER + "\","//派发者
                           + "\"DISPOSE_DEPTNAME\":\"" + misTask.DISPOSE_DEPTNAME + "\","//派发机构【名称】
                           + "\"DISPOSE_DEPT\":\"" + misTask.DISPOSE_DEPT + "\","//派发机构
                           + "\"DISPOSE_TIME\":\"" + misTask.DISPOSE_TIME.ToString("yyyy-MM-dd").Replace("/", "-") + "\","//派发时间

                                  + "\"DEALER\":\"" + misTask.DEALER + "\","
                                  + "\"DEALERNAME\":\"" + misTask.DEALERNAME + "\","
                                  + "\"DEAL_DEPT\":\"" + misTask.DEAL_DEPT + "\","
                                  + "\"DEAL_DEPTNAME\":\"" + misTask.DEAL_DEPTNAME + "\","
                                  + "\"DEAL_TIME\":\"" + misTask.DEAL_TIME.ToString("yyyy-MM-dd HH:mm:ss") + "\","
                                  + "\"DEAL_TICKET_1\":\"" + DEAL_TICKET_1 + "\","
                                  + "\"DEAL_TICKET_2\":\"" + DEAL_TICKET_2 + "\","
                                  + "\"DEAL_VALUE\":\"" + misTask.DEAL_VALUE + "\","
                          + "\"ACCEPTER\":\"" + misTask.ACCEPTER + "\","//验收人
                          + "\"AUDITOR\":\"" +misTask.AUDITOR + "\","//审核人
                          + "\"DECLARER\":\"" + misTask.DECLARER + "\","//填报人
                          + "\"DECLARE_TIME\":\"" + misTask.DECLARE_TIME.ToString("yyyy-MM-dd").Replace("/", "-") + "\","//填报时间
                          + "\"WAIT_REPAIR_PICTURE\":[" + (dt1.Rows.Count>0? getUrl(dt1.Rows[0], "WAIT_REPAIR_PICTURE"):"") + "],"
                          + "\"DONE_REPAIR_PICTURE\":[" + (dt1.Rows.Count>0? getUrl(dt1.Rows[0], "DONE_REPAIR_PICTURE"):"") + "],"
                                  + "\"CHECKER\":\"" + misTask.CHECKER + "\","
                                  + "\"CHECEKRNAME\":\"" + misTask.CHECEKRNAME + "\","
                                  + "\"CHECK_DEPT\":\"" + misTask.CHECK_DEPT + "\","
                                  + "\"CHECK_DEPTNAME\":\"" + misTask.CHECK_DEPTNAME + "\","
                                  + "\"CHECK_DESCRIPT\":\"" + misTask.CHECK_DESCRIPT + "\","
                                  + "\"CHECK_TICKET_1\":\"" + CHECK_TICKET_1 + "\","
                                  + "\"CHECK_TICKET_2\":\"" + CHECK_TICKET_2 + "\","
                                  + "\"CHECK_VALUE\":\"" + misTask.CHECK_VALUE + "\","
                                  + "\"CHECK_TIME\":\"" + misTask.CHECK_TIME.ToString("yyyy-MM-dd HH:mm:ss") + "\","
                                  + "\"CHECK_PICTURE\":[" + getUrl(misTask.CHECK_PICTURE) + "],"//复测图片地址
                                  + "\"SEVERITY_NAME\":\"" + getSeverityName(misTask.SEVERITY) + "\","//等级名
                                  + "\"DUE_TIME\":\"" + misTask.DUE_TIME.ToString("yyyy-MM-dd") + "\"} ";//计划完成时间
                break;
        }

        context.Response.Write(JsonConvert.DeserializeObject(obj.Replace("\t"," ").Replace("\n"," ")));
        context.Response.End();
    }

    /// <summary>
    /// 加载任务过程详情的JSN
    /// </summary>
    /// <param name="context"></param>
    /// <param name="type">【openMisTask】，缺陷打开【openFaultTask】,查阅【lookTask】</param>
    /// <param name="openType"></param>
    /// <param name="Task"></param>
    private void loadMisTaskTrac(HttpContext context, String type, string Task)
    {
        string obj = "";
        MisTaskTracCond misTaskTracCond = new MisTaskTracCond();
        misTaskTracCond.TID = context.Request["id"];
        obj = Api.ServiceAccessor.GetTaskService().getMisTaskTracJson(misTaskTracCond);
        context.Response.Write(JsonConvert.DeserializeObject(obj));
        context.Response.End();
    }

    /// <summary>
    /// 转任务
    /// </summary>
    /// <param name="context"></param>
    private void toTask(HttpContext context)
    {
        Api.Task.entity.MisTask misTask = new Api.Task.entity.MisTask();
        misTask.CATEGORY_CODE = context.Request["CATEGORY_CODE"];//缺陷类型
        misTask.SEVERITY = context.Request["SEVERITY_NAME"];//等级
        misTask.CODE = context.Request["CODE"];//缺陷类型编码
        misTask.SUMMARY = context.Request["SUMMARY"];//缺陷类型编码
        misTask.ALARM_ANALYSIS = context.Request["ALARM_ANALYSIS"];//缺陷分析
        misTask.PROPOSAL = JudgeDouHao(context.Request["PROPOSAL"]);//处理建议
        misTask.REMARK = context.Request["REMARK"];//备注
        misTask.FAULT_DESCRIPT = context.Request["FAULT_DESCRIPT"];//缺陷描述
        misTask.STATUS = "新建";//状态

        misTask.DATATYPE = context.Request["DATATYPE"];//数据来源
        misTask.FAULTID = context.Request["id"];//缺陷主键
        misTask.STATUS_TIME = string.IsNullOrEmpty(context.Request["STATUS_TIME"]) ? DateTime.Now : Convert.ToDateTime(context.Request["STATUS_TIME"]);//状态时间
        misTask.TASK_DESCRIPT = context.Request["TASK_DESCRIPT"];//任务描述
        misTask.IS_TEL = context.Request["IS_TEL"];//是否发短信
        misTask.IS_MAIL = context.Request["IS_MAIL"];//是否发邮件
        misTask.DISPOSERNAME = context.Request["DISPOSERNAME"];//派发者名称
        misTask.DISPOSER = context.Request["DISPOSER"];//派发者
        misTask.DISPOSE_DEPTNAME = context.Request["DISPOSE_DEPTNAME"];//派发机构
        misTask.DISPOSE_DEPT = context.Request["DISPOSE_DEPT"];//派发机构
        misTask.DISPOSE_TIME = DateTime.Now;//派发时间
        misTask.DUE_TIME = Convert.ToDateTime(string.IsNullOrEmpty(context.Request["DUE_TIME"]) ? DateTime.Now.AddDays(7).ToString() : context.Request["DUE_TIME"]);//计划完成时间
        misTask.RECEIVER = context.Request["RECEIVER"];//接收者
        misTask.RECEIVERNAME = context.Request["RECEIVERNAME"];//接收者
        misTask.RECV_DEPT = context.Request["RECV_DEPT"];//接收机构
        misTask.RECV_DEPTNAME = context.Request["RECV_DEPTNAME"];//接收机构

        misTask.SPONSOR = context.Request["SPONSOR"];//发起人
        misTask.SPONSORNAME = context.Request["SPONSORNAME"];//发起人
        misTask.SPONSOR_DEPT = context.Request["SPONSOR_DEPT"];//发起机构
        misTask.SPONSOR_DEPTNAME = context.Request["SPONSOR_DEPTNAME"];//发起机构
        misTask.SPONSOR_TIME = string.IsNullOrEmpty(context.Request["SPONSOR_TIME"]) ? DateTime.Now : Convert.ToDateTime(context.Request["SPONSOR_TIME"]);//发起时间
        misTask.DEADLINE = misTask.DUE_TIME;//截止时间(与计划完成时间统一)


        misTask.DEAL_DESCRIPT = context.Request["DEAL_DESCRIPT"];//处理描述
        misTask.DEAL_RESULT = context.Request["DEAL_RESULT"];//处理结果

        misTask.RESOURCE = context.Request["RESOURCE"];//资源

        string AUTOMATCH = context.Request["AUTOMATICCHOOSE"];//是否自动匹配

        string re = "";


        string[] alarmids = (context.Request["id"] + ",").Split(',');

        int err = 0;
        int success = 0;
        int order = 1;
        foreach (string _alarmID in alarmids)
        {
            if (string.IsNullOrEmpty(_alarmID)) continue;


            misTask.ID = "C" + Guid.NewGuid().ToString().Replace("-", "");//主键ID
            misTask.FAULTID = _alarmID;//缺陷主键


            Alarm m_alarm = Api.ServiceAccessor.GetAlarmService().getAlarm(_alarmID);
            if (!string.IsNullOrEmpty(m_alarm.ID))
            {
                misTask.CATEGORY_CODE = m_alarm.CATEGORY_CODE;
                misTask.SEVERITY = m_alarm.SEVERITY;
            }
            if (AUTOMATCH == "on")
            {
                misTask.RECV_DEPT = m_alarm.ORG_CODE;
                misTask.RECV_DEPTNAME = m_alarm.ORG_NAME;
            }
            misTask.TASK_CODE = PublicMethod.getTaskCode(order);//任务编号



            Api.Task.entity.MisTaskCond cond = new Api.Task.entity.MisTaskCond();
            cond.FAULTID = _alarmID;
            List<Api.Task.entity.MisTask> lis = Api.ServiceAccessor.GetTaskService().getMisTask(cond);
            string re_temp = "";
            if (lis.Count == 0)
                re_temp = Api.ServiceAccessor.GetTaskService().toTask(misTask, "WEB");

            Api.Task.entity.MisTaskCond misTaskCond = new Api.Task.entity.MisTaskCond();
            Api.Task.entity.MisTask misTask1 = new Api.Task.entity.MisTask();
            misTaskCond.FAULTID = context.Request["id"];
            List<Api.Task.entity.MisTask> misTask_lis = Api.ServiceAccessor.GetTaskService().getMisTask(misTaskCond);
            if (misTask_lis.Count > 0)
                misTask1 = misTask_lis[0];
            string TOSEND = context.Request["TOSEND"];
            if (TOSEND == "on")
                toSendTask(context, misTask1);


            if (re_temp == "操作成功")
            {
                success++;
            }
            else
            {
                err++;
            }
        }

        if (success > 0)
        {
            re += "操作成功" + success + "条";
        }

        if (err > 0)
        {
            re += ",操作失败" + err + "条";
        }



        context.Response.ContentType = "application/json";
        context.Response.Write("{\"result\":\"" + re + "\"}");
        context.Response.End();
    }

    /// <summary>
    /// 完成任务
    /// </summary>
    /// <param name="context"></param>
    public void toTaskComplete(HttpContext context, string action)
    {

        Api.Task.entity.MisTask misTask = Api.ServiceAccessor.GetTaskService().getMisTask(context.Request["id"]);

        misTask.DEALER = context.Request["DEALER"];//处理者编码
        misTask.DEALERNAME = context.Request["DEALERNAME"];//处理者
        misTask.DEAL_DEPT = Api.Util.Public.GetDeptCode;//处理机构编码
        misTask.DEAL_DEPTNAME = Api.Util.Public.GetDeptName;//处理机构
        misTask.ACCEPTER = context.Request["ACCEPTER"];//验收人
        misTask.AUDITOR = context.Request["AUDITOR"];//审核人
        misTask.DECLARER = context.Request["DECLARER"];//填报人
        misTask.DECLARE_TIME = getDatetime(context.Request["DECLARE_TIME"]);//填报时间
        if (!string.IsNullOrEmpty(context.Request["DEAL_TICKET_1"]) || !string.IsNullOrEmpty(context.Request["DEAL_TICKET_2"]))
        {
            misTask.DEAL_TICKET = (context.Request["DEAL_TICKET_1"] + "&" + context.Request["DEAL_TICKET_2"]);//处理工作票号
        }
        misTask.DEAL_RESULT = JudgeDouHao(context.Request["DEAL_RESULT"]);//处理结果
        misTask.DEAL_DESCRIPT = JudgeDouHao(context.Request["DEAL_DESCRIPT"]);//处理情况
        misTask.DEAL_TIME = getDatetime(context.Request["DEAL_TIME"]);//处理时间
        misTask.DEAL_VALUE = context.Request["DEAL_VALUE"];//调整值
        misTask.DEAL_RESULT = context.Request["DEAL_RESULT"];
        misTask.DEAL_DESCRIPT = context.Request["DEAL_DESCRIPT"];
        misTask.REMARK = context.Request["REMARK"];//备注
        misTask.RESOURCE = context.Request["RESOURCE"];//资源
        misTask.SEVERITY = PublicMethod.getSeverityCodeByCodeName(misTask.SEVERITY);//级别的转换
        misTask.MY_STR_1 = action;
        String obj = Api.ServiceAccessor.GetTaskService().toTaskComplete(misTask);

        string TOSEND = context.Request["TOSEND"];
        if (TOSEND == "on")
            toSendTask(context, misTask);

        context.Response.ContentType = "application/json";
        context.Response.Write("{\"result\":\"" + obj + "\"}");
        context.Response.End();
    }
    /// <summary>
    /// 取消任务
    /// </summary>
    /// <param name="context"></param>
    public void toTaskCancel(HttpContext context, string action)
    {
        Api.Task.entity.MisTask misTask = Api.ServiceAccessor.GetTaskService().getMisTask(context.Request["id"]);

        misTask.DEALER = context.Request["DEALER"];//处理者编码
        misTask.DEALERNAME = context.Request["DEALERNAME"];//处理者
        misTask.DEAL_DEPT = Api.Util.Public.GetDeptCode;//处理机构编码
        misTask.DEAL_DEPTNAME = Api.Util.Public.GetDeptName;//处理机构
        misTask.ACCEPTER = context.Request["ACCEPTER"];//验收人
        misTask.AUDITOR = context.Request["AUDITOR"];//审核人
        misTask.DECLARER = context.Request["DECLARER"];//填报人
        misTask.DECLARE_TIME = getDatetime(context.Request["DECLARE_TIME"]);//填报时间
        if (!string.IsNullOrEmpty(context.Request["DEAL_TICKET_1"]) || !string.IsNullOrEmpty(context.Request["DEAL_TICKET_2"]))
        {
            misTask.DEAL_TICKET = (context.Request["DEAL_TICKET_1"] + "&" + context.Request["DEAL_TICKET_2"]);//处理工作票号
        }
        misTask.DEAL_RESULT = JudgeDouHao(context.Request["DEAL_RESULT"]);//处理结果
        misTask.DEAL_DESCRIPT = JudgeDouHao(context.Request["DEAL_DESCRIPT"]);//处理情况
        misTask.DEAL_TIME = getDatetime(context.Request["DEAL_TIME"]);//处理时间
        misTask.DEAL_VALUE = context.Request["DEAL_VALUE"];//调整值
        misTask.DEAL_RESULT = context.Request["DEAL_RESULT"];
        misTask.DEAL_DESCRIPT = context.Request["DEAL_DESCRIPT"];
        misTask.REMARK = context.Request["REMARK"];//备注
        misTask.RESOURCE = context.Request["RESOURCE"];//资源
        misTask.MY_STR_1 = action;
        misTask.SEVERITY = PublicMethod.getSeverityCodeByCodeName(misTask.SEVERITY);//级别的转换
        String obj = Api.ServiceAccessor.GetTaskService().toTaskCancel(misTask);

        string TOSEND = context.Request["TOSEND"];
        if (TOSEND == "on")
            toSendTask(context, misTask);

        context.Response.ContentType = "application/json";
        context.Response.Write("{\"result\":\"" + obj + "\"}");
        context.Response.End();
    }
    /// <summary>
    /// 派发任务
    /// </summary>
    /// <param name="context"></param>
    public void toTaskBute(HttpContext context)
    {
        string AUTOMATCH = context.Request["AUTOMATICCHOOSE"];//是否自动匹配
        Api.Task.entity.MisTask misTask = Api.ServiceAccessor.GetTaskService().getMisTask(context.Request["id"]);

        misTask.PROPOSAL = JudgeDouHao(context.Request["PROPOSAL"]);//意见
        misTask.REMARK= JudgeDouHao(context.Request["REMARK"]);//处理意见
        misTask.IS_TEL = context.Request["IS_TEL"];//是否发短信
        misTask.IS_MAIL = context.Request["IS_MAIL"];//是否发邮件

        misTask.DISPOSERNAME = Api.Util.Public.GetCurrentUser().PersonName;//派发者名称
        misTask.DISPOSER = Api.Util.Public.GetCurrentUser().USER_CODE;
        misTask.DISPOSE_DEPTNAME = Api.Util.Public.GetDeptName;//派发机构
        misTask.DISPOSE_DEPT = Api.Util.Public.GetDeptCode;//派发机构
        misTask.DISPOSE_TIME = DateTime.Now;//派发时间
        misTask.RESOURCE = context.Request["RESOURCE"];//资源
        misTask.RECEIVER = context.Request["RECEIVER"];//接收者
        misTask.RECEIVERNAME = context.Request["RECEIVERNAME"];//接收者
        misTask.RECV_DEPT = context.Request["RECV_DEPT"];//接收机构
        misTask.RECV_DEPTNAME = context.Request["RECV_DEPTNAME"];//接收机构
        if (AUTOMATCH == "on")
        {
            Alarm m_alarm = Api.ServiceAccessor.GetAlarmService().getAlarm(misTask.FAULTID);
            misTask.RECV_DEPT = m_alarm.ORG_CODE;
            misTask.RECV_DEPTNAME = m_alarm.ORG_NAME;
        }
        misTask.SEVERITY = PublicMethod.getSeverityCodeByCodeName(misTask.SEVERITY);//级别的转换
        String obj = Api.ServiceAccessor.GetTaskService().toTaskBute(misTask);

        string TOSEND = context.Request["TOSEND"];
        if (TOSEND == "on")
            toSendTask(context, misTask);

        context.Response.ContentType = "application/json";
        context.Response.Write("{\"result\":\"" + obj + "\"}");
        context.Response.End();
    }

    /// <summary>
    /// 复核任务
    /// </summary>
    /// <param name="context"></param>
    public void toTaskCheck(HttpContext context, string action)
    {
        Api.Task.entity.MisTask misTask = Api.ServiceAccessor.GetTaskService().getMisTask(context.Request["id"]);

        misTask.CHECKER = context.Request["CHECKER"];//复核者编码
        misTask.CHECEKRNAME = context.Request["CHECEKRNAME"];//复核者
        misTask.CHECK_DEPT = Api.Util.Public.GetDeptCode;//复核机构编码
        misTask.CHECK_DEPTNAME = Api.Util.Public.GetDeptName;//复核机构
        misTask.CHECK_DESCRIPT = JudgeDouHao(context.Request["CHECK_DESCRIPT"]);//复核情况
        if (!string.IsNullOrEmpty(context.Request["CHECK_TICKET_1"]) || !string.IsNullOrEmpty(context.Request["CHECK_TICKET_2"]))
        {
            misTask.CHECK_TICKET = (context.Request["CHECK_TICKET_1"] + "&" + context.Request["CHECK_TICKET_2"]);//复核工作票
        }
        misTask.CHECK_VALUE = context.Request["CHECK_VALUE"];//复核值

        if (Api.Util.Common.FunEnable("Fun_Feedback")) //复测完后需要重新派发
        {
            misTask.MY_STR_2 = "feedback";
            misTask.RECV_DEPT = context.Request["RECV_DEPT"];//反馈机构编码（相当于接收机构）
            misTask.RECV_DEPTNAME = context.Request["RECV_DEPTNAME"];//反馈机构（相当于接收机构）
        }

        if (!string.IsNullOrEmpty(context.Request["CHECK_TIME"]))
        {
            misTask.CHECK_TIME = Convert.ToDateTime(context.Request["CHECK_TIME"]);
        }
        else
        {
            misTask.CHECK_TIME = DateTime.Now;//复测时间
        }
        misTask.MY_STR_1 = action;
        misTask.RESOURCE = context.Request["RESOURCE"];//资源
        misTask.CHECK_PICTURE = context.Request["CHECK_PICTURE"];//复测图片
        string TOSEND = context.Request["TOSEND"];
        if (TOSEND == "on")
            toSendTask(context, misTask);
        misTask.SEVERITY = PublicMethod.getSeverityCodeByCodeName(misTask.SEVERITY);//级别的转换
        String obj = Api.ServiceAccessor.GetTaskService().toTaskCheck(misTask);
        context.Response.ContentType = "application/json";
        context.Response.Write("{\"result\":\"" + obj + "\"}");
        context.Response.End();
    }


    /// <summary>
    /// 抄送任务
    /// </summary>
    /// <param name="context"></param>
    public void toSendTask(HttpContext context)
    {
        Api.Task.entity.MisTask misTask = Api.ServiceAccessor.GetTaskService().getSendMisTask(context.Request["id"]);
        toSendTask(context, misTask);
    }
    /// <summary>
    /// 抄送任务
    /// </summary>
    /// <param name="context"></param>
    public void toSendTask(HttpContext context, Api.Task.entity.MisTask misTask)
    {
        String obj = "";
        if (misTask == null)
        {
            obj = "请先转任务！";
        }
        else
        {
            if (String.IsNullOrEmpty(context.Request["SENDDEPT"]))
            {
                obj = "请选择抄送部门！";
            }
            else
            {
                obj = Api.ServiceAccessor.GetTaskService().sendMisTask(misTask, context.Request["SENDDEPTNAMES"], context.Request["SENDDEPT"]);
            }
        }
    }

    #region 数据处理
    /// <summary>
    /// 处理日期数据
    /// </summary>
    /// <param name="date"></param>
    /// <returns></returns>
    public DateTime getDatetime(string date)
    {
        DateTime time = new DateTime();
        if (!String.IsNullOrEmpty(date))
        {
            String[] dd = (date + ",").Split(',');
            time = Convert.ToDateTime(dd[0]);
        }
        return time;
    }

    /// <summary>
    /// 获取缺陷描述
    /// </summary>
    /// <param name="alarm"></param>
    /// <returns></returns>
    public String getFaultDescrit(Alarm alarm)
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
                string gps = "";
                if (Api.Util.Common.FunEnable("Fun_GIS") == true)
                {
                    gps = "   东经：" + alarm.GIS_X + " 北纬: " + alarm.GIS_Y;
                }
                retStr = "【" + alarm.RAISED_TIME + "】【" + alarm.DETECT_DEVICE_CODE + "】在【" + myfiter.RemoveHTML(PublicMethod.GetPositionByAlarmid(alarm.ID),0)+ gps + "】缺陷温度【" + myfiter.GetTEMP(alarm.NVALUE4, "℃") + "】环境温度【" + myfiter.GetTEMP(alarm.NVALUE5, "℃") + "】 ";
                if (!String.IsNullOrEmpty(myfiter.GetLINE_HEIGHT(alarm.NVALUE2)))
                {
                    retStr += "导高【" + alarm.NVALUE2 + "mm】";
                }
                if (!String.IsNullOrEmpty(myfiter.GetPULLING_VALUE(alarm.NVALUE3)))
                {
                    retStr += "拉出值【" + alarm.NVALUE3 + "mm】";
                }
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

    /// <summary>
    /// 获取工作票数据
    /// </summary>
    /// <param name="ticket"></param>
    /// <param name="ticket1"></param>
    /// <param name="ticket2"></param>
    public void GetTicket(string ticket, ref string ticket1, ref string ticket2)
    {
        if (!string.IsNullOrEmpty(ticket) && ticket != "&")
        {
            if (ticket.Contains("&"))
            {
                string[] group = ticket.Split('&');
                ticket1 = group[0];
                for (int i = 0; i < group.Length - 1; i++)
                {
                    ticket2 = ticket2 + group[i + 1] + "-";
                }
                if (!string.IsNullOrEmpty(ticket2))
                {
                    ticket2 = ticket2.TrimEnd('-');
                }
            }
        }
    }

    public string GetBtn(MisTask task, Alarm alarm)
    {
        string btn = "create";//任务处理页面 操作界面只有“转任务”
        if (!string.IsNullOrEmpty(alarm.TASK_ID) && !string.IsNullOrEmpty(task.ID))
        {
            if (task.STATUS == "新建" || task.STATUS == "复测" || task.STATUS == "派发")
                btn = "handle";//任务处理页面的 操作界面是“派发”“完成”“取消”“复核”
            else
                btn = "review";//任务处理页面的  无操作界面
        }

        if (!string.IsNullOrEmpty(task.ID) && !string.IsNullOrEmpty(task.RECV_DEPT))
            if (Api.Util.Public.GetDeptCode != "TOPBOSS" && Api.Util.Public.GetDeptCode != "$")
                if (!Regex.IsMatch(task.RECV_DEPT, (Api.Util.Public.GetDeptCode.Replace("$","\\$") + "$|" + Api.Util.Public.GetDeptCode.Replace("$","\\$") + ",")) && !Public.GetUser_PermissionOrg.Contains(task.RECV_DEPT))
                    btn = "review";


        return btn;
    }


    public string getSeverityName(string severity)
    {
        string re = "";
        if (!string.IsNullOrEmpty(severity))
        {
            string severity_name = Api.Util.Common.getSysDictionaryInfo(severity).CODE_NAME;
            if (!string.IsNullOrEmpty(severity_name))
            {
                re = severity_name;
            }
            else
            {
                re = severity;
            }
        }
        return re;
    }

    public string getSeverity(string severity)
    {
        string re = "";
        if (!string.IsNullOrEmpty(severity))
        {
            SysDictionary[] sd = Api.Util.Common.sysDictionaryDic.Values.ToArray();
            IList<SysDictionary> dicList = (from l in sd where l.CODE_NAME == severity select l).ToArray();
            if (dicList.Count > 0)
            {
                re = dicList[0].DIC_CODE;
            }
            else
            {
                re = severity;
            }
        }
        return re;
    }

    /// <summary>
    /// 获取组织机构名
    /// </summary>
    /// <param name="code"></param>
    /// <returns></returns>
    public string getCode_Name(string code)
    {
        string re = "";
        if (!string.IsNullOrEmpty(code))
        {
            if (Api.Util.Common.sysDictionaryDic.ContainsKey(code))
            {
                re = Api.Util.Common.sysDictionaryDic[code].CODE_NAME;
            }
            else
            {
                re = code;
            }
        }
        return re;
    }

    /// <summary>
    /// 分割URL
    /// </summary>
    public string getUrl(DataRow dr, string name)
    {
        StringBuilder json = new StringBuilder();

        if (dr[name] != DBNull.Value)
        {
            string[] Array = dr[name].ToString().Split(';');
            for (int i = 0; i < Array.Length; i++)
            {
                json.Append("\"" + Array[i].Replace("\\", "\\\\") + "\"");

                if (i < Array.Length - 1)
                {
                    json.Append(",");
                }
            }
        }
        if (json != null)
        {
            return json.ToString();
        }
        return null;
    }

    /// <summary>
    /// 分割URL
    /// </summary>
    public string getUrl(string name)
    {
        StringBuilder json = new StringBuilder();
        string str = "";
        if (!string.IsNullOrEmpty(name))
        {
            String[] SS = name.Split(';');
            if (SS.Count() > 0)
            {
                for (int i = 0; i < SS.Count(); i++)
                {
                    if (!string.IsNullOrEmpty(SS[i]))
                        json.Append("\"" + SS[i].Replace("\\", "\\\\").Replace(",","") + "\",");
                }
                str = json.ToString();
                str = str.Substring(0, str.Length - 1);
            }
        }
        return str;
    }


    public string JudgeDouHao(string str)
    {
        if (string.IsNullOrEmpty(str) || str == ",")
        {
            return "";
        }
        return str;
    }


    #endregion

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}