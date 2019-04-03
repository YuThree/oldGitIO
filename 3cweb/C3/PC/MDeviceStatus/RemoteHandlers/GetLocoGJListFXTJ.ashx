<%@ WebHandler Language="C#" Class="GetLocoGJListFXTJ" %>

using System;
using System.Web;
using System.Xml;
using Api.Fault.entity.sms;
using System.Collections.Generic;
using Api.Foundation.entity.Foundation;
using Api.Foundation.entity.Cond;

/// <summary>
/// 状态分析统计
/// </summary>
public class GetLocoGJListFXTJ :ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        string locid = HttpContext.Current.Request["locid"]; //获取设备编号
        DateTime startdate = DateTime.Parse(HttpContext.Current.Request["startdate"]); //获取日期
        string enddatastr = HttpContext.Current.Request["enddate"];
        if (enddatastr.Length < 12)
        {
            enddatastr += " 23:59:59";
        }
        DateTime enddate = DateTime.Parse(enddatastr);
        string jl = HttpContext.Current.Request["jl"];//交路
        string ju = HttpContext.Current.Request["ju"];//局
        string jwd = HttpContext.Current.Request["jwd"]; //机务段

        try
        {
            int pageIndex = Convert.ToInt32(HttpContext.Current.Request["page"]);//获取前台页码
            int pageSize = Convert.ToInt32(HttpContext.Current.Request["rp"]);  //获取前台条数

            C3_SmsCond c3 = new C3_SmsCond();
            if (ju != null && ju != "0")
            {
                c3.BUREAU_CODE = ju;
            }
            if (jwd != null && jwd != "0")
            {
                c3.P_ORG_CODE = jwd;
            }
            if ( !string.IsNullOrEmpty( locid))
            {
                c3.LOCOMOTIVE_CODE = locid;
            }

            c3.startTime = startdate;
            c3.endTime = enddate;
            c3.page = pageIndex;
            c3.pageSize = pageSize;
            c3.orderBy = " DETECT_TIME DESC ";
            //设备轨迹
            string avg = Api.ServiceAccessor.GetSmsService().queryC3SmsAvg(c3);
            string[] arrayAvg = avg.Split(',');
            for (int i = 0; i < arrayAvg.Length; i++)
            {
                if (string.IsNullOrEmpty(arrayAvg[i]))
                {
                    arrayAvg[i] = "0";
                }
            }
            System.Text.StringBuilder Json = new System.Text.StringBuilder();
            Json.Append("[");
            Json.Append("{");
            Json.Append("fx:\"" + String.Format("{0:F}", Convert.ToDouble(arrayAvg[0])) + "\"");
            Json.Append(",");
            Json.Append("max:\"" + String.Format("{0:F}", Convert.ToDouble(arrayAvg[1])) + "\"");
            Json.Append("}");
            Json.Append("]");
            object myObj = Newtonsoft.Json.JsonConvert.DeserializeObject(Json.ToString());
            context.Response.Write(myObj.ToString());
        }
        catch (Exception ex)
        {
            log4net.ILog log2 = log4net.LogManager.GetLogger("状态分析统计");
            log2.Error("Error", ex);
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