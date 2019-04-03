<%@ WebHandler Language="C#" Class="GetAlarmLJ" %>

using System;
using System.Web;
using System.Xml;
using Api.Fault.entity.alarm;
using System.Collections.Generic;

/// <summary>
/// 告警临近点列表
/// </summary>
public class GetAlarmLJ : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
       
        string alarmid = HttpContext.Current.Request["alarmid"]; //缺陷ID

        try
        {
            List<Alarm> alarmlj = Api.ServiceAccessor.GetAlarmService().getNearByAlarms(alarmid);
            int pageIndex = 1; //获取页码
            int pageSize = 100; //获取条数
            int recordCount = alarmlj.Count;
            System.Text.StringBuilder jsonStr2 = new System.Text.StringBuilder();
         
            jsonStr2.Append("{'rows':[");
            for (int i = 0; i < alarmlj.Count; i++)
            {
                if(i>0)
                {
                   jsonStr2.Append(" ,");
                }

                jsonStr2.Append("{'POLE_NUMBER':'" + alarmlj[i].POLE_NUMBER + "',");//杆号
                jsonStr2.Append("'RAISED_TIME':'" + alarmlj[i].RAISED_TIME.ToString("yyyy-MM-dd HH:mm:ss") + "',");//发生时间
                jsonStr2.Append("'CATEGORY_CODE':'" + alarmlj[i].CATEGORY_CODE + "',");//数据类型
                jsonStr2.Append("'SEVERITY':'" + alarmlj[i].SEVERITY + "',");//级别
                jsonStr2.Append("'SUMMARY':'" + PublicMethod.GetSummaryByAlarm(alarmlj[i]) + "',"); //alarmlj[i].SUMMARYDIC.CODE_NAME + "',";//摘要
                jsonStr2.Append("'STATUS':'" + alarmlj[i].STATUS_NAME + "',");//状态   
                jsonStr2.Append("'SelectInfo':'<a  href=javascript:selectInfo(C" + alarmlj[i].ID + ")>查看明细</a>',");//查看明细         
                jsonStr2.Append("'ID':'C" + alarmlj[i].ID + "'");
                jsonStr2.Append(" }");
            }
                                  
            jsonStr2.Append("],'page':'" + pageIndex + "','rp':'" + pageSize + "','total':'" + recordCount + "'}");

            
            HttpContext.Current.Response.Write( myfiter.json_RemoveSpecialStr( jsonStr2.ToString()));
            
        }
        catch
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