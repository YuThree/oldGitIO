<%@ WebHandler Language="C#" Class="StatisAlarmTele" %>

using System;
using System.Web;
using System.Text;
using System.Linq;
using Api.Foundation.entity.Foundation;
using System.Collections.Generic;


/// <summary>
/// 远动库统计后台
/// </summary>
public class StatisAlarmTele : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        string type = context.Request["type"];//操作类型选择

        switch (type)
        {
            case "SynthesizedStatistic":
                SynthesizedStatistic(context);//总体统计饼图
                break;
            case "SynthesizedStatisticByCondition":
                GetSynthesizedStatisticByCondition(context);//根据负责单位统计柱状图
                break;
        }

    }

    /// <summary>
    /// 总体统计饼图
    /// </summary>
    /// <param name="context"></param>
    public static void SynthesizedStatistic(HttpContext context)
    {
        string endTime = context.Request["enddate"];//结束时间
        string startTime = context.Request["startdate"];//开始时间
        string duty_units = context.Request["duty_units"];//负责单位
        if (!string.IsNullOrEmpty(duty_units))
        {
            duty_units = PublicMethod.SelectORGNameByCode(duty_units);
        }string question_classify = context.Request["question_classify"];//问题分类
        string question_level = context.Request["question_level"];//问题等级
        string major_classify = context.Request["major_classify"];//专业分类
        string process_statas = context.Request["process_statas"];//销号状态

        //数据访问
        System.Data.DataSet ds = ADO.StatisAlarmTele.GetSynthesizedStatistic(duty_units, question_classify, question_level, major_classify, process_statas, startTime, endTime);

        //json拼接
        StringBuilder result = new StringBuilder();
        if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
        {
            result.Append("{\"data\":[],\"total_alarm\":\"0\"}");
        }
        else
        {
            result.Append("{\"data\":[");
            int question1 = 0, question2 = 0, question3 = 0, question4 = 0, question5 = 0,question6 = 0, UnFault = 0, Fault = 0, first = 0, second = 0, third = 0, gaotie = 0, pusu = 0,dianli = 0;//将无数据字段的统计数定义为O，写入JSON串
            for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
            {
                System.Data.DataRow dr = ds.Tables[0].Rows[i];

                switch (dr["STATISTICBYNAME"].ToString())
                {
                    case "通道":
                        question1 += Convert.ToInt32(dr["ALARM_NUMBER"]);
                        break;
                    case "调度主站(硬件)":
                        question2 += Convert.ToInt32(dr["ALARM_NUMBER"]);
                        break;
                    case "调度主站(软件)":
                        question3 += Convert.ToInt32(dr["ALARM_NUMBER"]);
                        break;
                    case "被控站(通讯)":
                        question4  += Convert.ToInt32(dr["ALARM_NUMBER"]);
                        break;
                    case "被控站(一次设备)":
                        question5 += Convert.ToInt32(dr["ALARM_NUMBER"]);
                        break;
                    case "被控站(二次设备)":
                        question6  += Convert.ToInt32(dr["ALARM_NUMBER"]);
                        break;
                    case "已销号":
                        Fault += Convert.ToInt32(dr["ALARM_NUMBER"]);
                        break;
                    case "未销号":
                        UnFault += Convert.ToInt32(dr["ALARM_NUMBER"]);
                        break;
                    case "Ⅰ":
                        first += Convert.ToInt32(dr["ALARM_NUMBER"]);
                        break;
                    case "Ⅱ":
                        second += Convert.ToInt32(dr["ALARM_NUMBER"]);
                        break;
                    case "Ⅲ":
                        third += Convert.ToInt32(dr["ALARM_NUMBER"]);
                        break;
                    case "高铁":
                        gaotie += Convert.ToInt32(dr["ALARM_NUMBER"]);
                        break;
                    case "普速":
                        pusu += Convert.ToInt32(dr["ALARM_NUMBER"]);
                        break;
                    case "电力":
                        dianli += Convert.ToInt32(dr["ALARM_NUMBER"]);
                        break;
                    default:
                        break;
                }
            }
            //固定JSON顺序（前端要统一同一类型数据的饼图颜色）
            result.Append("[\"通道|通道|" + question1 + "\",");
            result.Append("\"调度主站(硬件)|调度主站(硬件)|" + question2 + "\",");
            result.Append("\"调度主站(软件)|调度主站(软件)|" + question3 + "\",");
            result.Append("\"被控站(通讯)|被控站(通讯)|" + question4 + "\",");
            result.Append("\"被控站(一次设备)|被控站(一次设备)|" + question5 + "\",");
            result.Append("\"被控站(二次设备)|被控站(二次设备)|" + question6 + "\"],");
            result.Append("[\"Ⅰ|Ⅰ|" + first + "\",");
            result.Append("\"Ⅱ|Ⅱ|" + second + "\",");
            result.Append("\"Ⅲ|Ⅲ|" + third + "\"],");
            result.Append("[\"高铁|高铁|" + gaotie + "\",");
            result.Append("\"普速|普速|" + pusu + "\",");
            result.Append("\"电力|电力|" + dianli + "\"],");
            result.Append("[\"已销号|已销号|" + Fault + "\",");
            result.Append("\"未销号|未销号|" + UnFault + "\"]");
            result.Append("],\"total_alarm\":\"" + ds.Tables[0].Rows[0]["TOTAL_ALARM"] + "\"}");
        }

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(result);
    }

    /// <summary>
    /// 根据负责单位统计柱状图
    /// </summary>
    /// <param name="context"></param>
    public static void GetSynthesizedStatisticByCondition(HttpContext context)
    {
        string endTime = context.Request["enddate"];//结束时间
        string startTime = context.Request["startdate"];//开始时间
        string duty_units = context.Request["duty_units"];//负责单位
        if (!string.IsNullOrEmpty(duty_units))
        {
            duty_units = PublicMethod.SelectORGNameByCode(duty_units);
        }
        string question_classify = context.Request["question_classify"];//问题分类
        string question_level = context.Request["question_level"];//问题等级
        string major_classify = context.Request["major_classify"];//专业分类
        string process_statas = context.Request["process_statas"];//销号状态
        string statisticsType = context.Request["statisticsType"];//统计单位

        //数据访问
        System.Data.DataSet ds = ADO.StatisAlarmTele.GetSynthesizedStatisticByCondition(duty_units, question_classify, question_level, major_classify, process_statas, startTime, endTime, statisticsType);

        //json拼接
        StringBuilder result = new StringBuilder();
        if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
        {
            result.Append("{\"data\":[]}");
        }
        else
        {
            result.Append("{\"data\":" + JsonUtil.ToJson(ds.Tables[0]) + "}");
        }

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(result);
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}