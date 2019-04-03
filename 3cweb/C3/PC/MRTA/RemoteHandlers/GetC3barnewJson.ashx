<%@ WebHandler Language="C#" Class="GetC6TempJson" %>
using System;
using System.Web;
using System.Text;
using Newtonsoft.Json;
using System.Data;
using System.Text;
using Api.Fault.entity.alarm;
using System.Collections.Generic;
using System.Configuration;
using Api.Fault.entity.sms;

public class GetC6TempJson : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        //类型 1/2/3/NAME
        string type = HttpContext.Current.Request["type"];
        string linecode = HttpContext.Current.Request["linecode"];
        switch (type)
        {
            case "Name":
                GetNamechart(context, linecode);
                break;
            case "IR":
                GetIRchart(context, linecode);
                break;
            case "ENV":
                GetENVchart(context, linecode);
                break;
            case "LH":
                GetLHchart(context, linecode);
                break;
            case "PV":
                GetPVchart(context, linecode);
                break;
        }
    }


    /// <summary>
    /// 获取时间刻度
    /// </summary>
    /// <param name="context"></param>
    public void GetNamechart(HttpContext context, string linecode)
    {

        StringBuilder Json = new StringBuilder();
        Json.Append("[");
        string sql = "select raised_time from c3_event t where LINE_CODE='" + linecode + "'  and rownum <= 10000 order by raised_time desc ";
        DataSet ds = DbHelperOra.Query(sql);
        int dscount = ds.Tables[0].Rows.Count;
        if (dscount > 0)
        {
            for (int i = 0; i < dscount; i++)
            {
                Json.Append("'" + ds.Tables[0].Rows[i][0] + "',");
            }
        }
        context.Response.Cache.SetCacheability(HttpCacheability.NoCache);
        context.Response.ContentType = "text/plain";
        object myObj = Newtonsoft.Json.JsonConvert.DeserializeObject(Json.ToString());
        context.Response.Write(myObj);
    }

    /// <summary>
    /// 获取最高温度
    /// </summary>
    /// <param name="context"></param>
    public void GetIRchart(HttpContext context, string linecode)
    {

        StringBuilder Json = new StringBuilder();
        Json.Append("[");
        string sql = "select TOUCH_POINT_TEMP,IR_FRAME from c3_event t where LINE_CODE='" + linecode + "' and rownum <= 10000  order by raised_time desc ";
        DataSet ds = DbHelperOra.Query(sql);
        int dscount = ds.Tables[0].Rows.Count;
        if (dscount > 0)
        {
            for (int i = 0; i < dscount; i++)
            {
                Json.Append("{value:" + ds.Tables[0].Rows[i][0] + ",IR_FRAME:'" + ds.Tables[0].Rows[i][1] + "'},");
            }
        }
        context.Response.Cache.SetCacheability(HttpCacheability.NoCache);
        context.Response.ContentType = "text/plain";
        object myObj = Newtonsoft.Json.JsonConvert.DeserializeObject(Json.ToString());
        context.Response.Write(myObj);
    }

    /// <summary>
    /// 获取环境温度
    /// </summary>
    /// <param name="context"></param>
    public void GetENVchart(HttpContext context, string linecode)
    {

        StringBuilder Json = new StringBuilder();
        Json.Append("[");
        string sql = "select ENV_TEMP,IR_FRAME from c3_event t where LINE_CODE='" + linecode + "'  and rownum <= 10000 order by raised_time desc ";
        DataSet ds = DbHelperOra.Query(sql);
        int dscount = ds.Tables[0].Rows.Count;
        if (dscount > 0)
        {
            for (int i = 0; i < dscount; i++)
            {
                Json.Append("{value:" + ds.Tables[0].Rows[i][0] + ",IR_FRAME:'" + ds.Tables[0].Rows[i][1] + "'},");
            }
        }
        context.Response.Cache.SetCacheability(HttpCacheability.NoCache);
        context.Response.ContentType = "text/plain";
        object myObj = Newtonsoft.Json.JsonConvert.DeserializeObject(Json.ToString());
        context.Response.Write(myObj);
    }

    /// <summary>
    /// 获取导高
    /// </summary>
    /// <param name="context"></param>
    public void GetLHchart(HttpContext context, string linecode)
    {

        StringBuilder Json = new StringBuilder();
        Json.Append("[");
        string sql = "select LINE_HIGHT,IR_FRAME from c3_event t where LINE_CODE='" + linecode + "'  and rownum <= 10000 order by raised_time desc ";
        DataSet ds = DbHelperOra.Query(sql);
        int dscount = ds.Tables[0].Rows.Count;
        if (dscount > 0)
        {
            for (int i = 0; i < dscount; i++)
            {
                Json.Append("{value:" + ds.Tables[0].Rows[i][0] + ",IR_FRAME:'" + ds.Tables[0].Rows[i][1] + "'},");
            }
        }
        context.Response.Cache.SetCacheability(HttpCacheability.NoCache);
        context.Response.ContentType = "text/plain";
        object myObj = Newtonsoft.Json.JsonConvert.DeserializeObject(Json.ToString());
        context.Response.Write(myObj);
    }
    /// <summary>
    /// 获取导高
    /// </summary>
    /// <param name="context"></param>
    public void GetPVchart(HttpContext context, string linecode)
    {

        StringBuilder Json = new StringBuilder();
        Json.Append("[");
        string sql = "select PULLING_VALUE,IR_FRAME from c3_event t where LINE_CODE='" + linecode + "'  and rownum <= 10000 order by raised_time desc ";
        DataSet ds = DbHelperOra.Query(sql);
        int dscount = ds.Tables[0].Rows.Count;
        if (dscount > 0)
        {
            for (int i = 0; i < dscount; i++)
            {
                Json.Append("{value:" + ds.Tables[0].Rows[i][0] + ",IR_FRAME:'" + ds.Tables[0].Rows[i][1] + "'},");
            }
        }
        context.Response.Cache.SetCacheability(HttpCacheability.NoCache);
        context.Response.ContentType = "text/plain";
        object myObj = Newtonsoft.Json.JsonConvert.DeserializeObject(Json.ToString());
        context.Response.Write(myObj);
    }


    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}