<%@ WebHandler Language="C#" Class="NextAlarm" %>

using System;
using System.Web;
using System.Xml;
using Api.Fault.entity.alarm;
using System.Collections.Generic;
using PASS;
using Api.Util;
using Api.Foundation.entity.Foundation;
using System.Web.SessionState;
using Newtonsoft.Json;
using System.Configuration;
using System.Data;

public class NextAlarm : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        //返回值
        //string alarmid = HttpContext.Current.Request["Alarmid"];
        //string locid = HttpContext.Current.Request["locid"];
        //string value = alarmid;



        ////查询C3
        //C3_Alarm c3Alarm = Api.ServiceAccessor.GetAlarmService().getC3Alarm(alarmid);
        //if (c3Alarm.RAISED_TIME != null)
        //{
        //    string sql = "select id from alarm t where t.raised_time<to_date('" + c3Alarm.RAISED_TIME + "','yyyy-mm-dd hh24:mi:ss') ";

        //    if (locid != null && locid != "undefined" && locid != "") {
        //        sql += " and t.detect_device_code='" + locid + "'";
        //    }

        //    sql += " order by t.raised_time desc ";

        //    //////modified by lc 2015/7/27
        //    //DataSet ds = DbHelperOra.Query(sql);
        //    //if (ds.Tables[0].Rows.Count > 0)
        //    //{
        //    //    value = ds.Tables[0].Rows[0][0].ToString();
        //    //}
        //    object id = DbHelperOra.GetSingle(sql);
        //    if (id != null)
        //        value = Convert.ToString(id);
        //    else
        //        value = "";
        //}
        //context.Response.Write(value);
        //


       // C3_AlarmCond m_cond= my_alarm.GetC3_AlermCond_byListWhere();
       C3_AlarmCond m_cond= my_alarm.GetC3_AlermCond_AlarmList();
        //m_cond.ID = null;
        //m_cond.myPara1 = context.Request.QueryString["alarmID"].ToString();
        m_cond.RAISED_TIME = context.Request["raised_time"]==null?DateTime.Now.AddDays(-1):Convert.ToDateTime(context.Request["raised_time"]);
        m_cond.CATEGORY_CODE = "3C";


        string ID_next = Api.ServiceAccessor.GetAlarmService().getAlarmNextID(m_cond);
        context.Response.Write(ID_next);

    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}