<%@ WebHandler Language="C#" Class="GetLocGJList" %>

using System;
using System.Web;
using Api.Fault.entity.sms;
using System.Collections.Generic;
using Api.Foundation.entity.Foundation;
using Api.Foundation.entity.Cond;

/// <summary>
/// 检测运行轨迹
/// </summary>
public class GetLocGJList : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        try
        {
            int pageIndex = Convert.ToInt32(HttpContext.Current.Request["page"]);  //获取前台页码
            int pageSize = Convert.ToInt32(HttpContext.Current.Request["rp"]);       //获取前台条数
            string ju = HttpContext.Current.Request.QueryString["ju"];//局
            string jwd = HttpContext.Current.Request.QueryString["jwd"]; //机务段
            string loccode = HttpContext.Current.Request.QueryString["loccode"];//设备编号      
            string jlh = HttpContext.Current.Request.QueryString["jlh"];//交路号

            C3_SmsCond condition = new C3_SmsCond();
            if ((ju != null) && (ju != "0"))
            {
                condition.BUREAU_CODE = ju;
            }
            if ((jwd != null) && (jwd != "0"))
            {
                condition.P_ORG_CODE = jwd;
            }
            if (loccode != null && loccode != "")
            {

                condition.LOCOMOTIVE_CODE = loccode;
            }

            //获取日期
            if (HttpContext.Current.Request["startdate"] != null && HttpContext.Current.Request["startdate"] != "")
            {
                DateTime startdate = DateTime.Parse(HttpContext.Current.Request["startdate"]);
                condition.startTime = startdate;
            }
            if (HttpContext.Current.Request["enddate"] != null && HttpContext.Current.Request["enddate"] != "")
            {
                DateTime enddate = DateTime.Parse(HttpContext.Current.Request["enddate"] + " 23:59:59");
                condition.endTime = enddate;
            }
            if (jlh != null && jlh != "")
            {
                condition.ROUTING_NO = jlh;
            }
            condition.page = pageIndex;
            condition.pageSize = pageSize;

            int recs, totalpages;
            System.Data.DataSet ds = my_sms.GetGJGroup2(condition.BUREAU_CODE, condition.P_ORG_CODE, condition.LOCOMOTIVE_CODE, condition.startTime.ToString(), condition.endTime.ToString(), pageSize, pageIndex, out recs, out totalpages, "pkg_report_ex.P_C3_SMS_TRACE_STAT");


            //   IList<C3_Orbit> c3orbitlist = Api.ServiceAccessor.GetSmsService().getC3OrbitByPeriod(condition);
            //    int recordCount = Api.ServiceAccessor.GetSmsService().getC3OrbitByPeriodCount(condition);

            System.Text.StringBuilder jsonStr = new System.Text.StringBuilder();
            jsonStr.Append("{'rows':[");

            for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
            {
                if (i > 0)
                    jsonStr.Append(",");

                System.Data.DataRow dr = ds.Tables[0].Rows[i];

                string ID = dr["LOCOMOTIVE_CODE"].ToString() + dr["ROUTING_NO"] + i;
                ID = ID.Replace("-", "");

                jsonStr.Append("{'TRAIN_NO':'" + dr["LOCOMOTIVE_CODE"] + "',");//设备编号
                jsonStr.Append("'RUNNING_DATE':'" + Convert.ToDateTime(dr["RUNNING_DATE"]).ToShortDateString() + "',");//时间
                jsonStr.Append("'CROSSING_NO':'" + myfiter.GetRouingNo(dr["ROUTING_NO"].ToString()) + "',");//交路号
                jsonStr.Append("'BEGIN_TIME':'" + dr["BEGIN_TIME"] + "',");//开始时间   
                jsonStr.Append("'END_TIME':'" + dr["END_TIME"] + "',");//结束时间  
                // jsonStr.Append("'BEGIN_KM':'" + PublicMethod.KmtoString(dr["BEGIN_KM)"]) + "',");//开始公里标  
                // jsonStr.Append("'END_KM':'" + PublicMethod.KmtoString(dr["END_KM)"]) + "',");//结束公里标  
                jsonStr.Append("'YLnum':'" + "<a  href=javascript:selectYLnumInfo(C" + ID + ")>" + dr["faultAlarmCntOfLv1"] + "</a> " + "',");//1
                jsonStr.Append("'ELnum':'" + "<a  href=javascript:selectELnumInfo(C" + ID + ")>" + dr["faultAlarmCntOfLv2"] + "</a> " + "',");//2
                jsonStr.Append("'SLnum':'" + "<a  href=javascript:selectSLnumInfo(C" + ID + ")>" + dr["faultAlarmCntOfLv3"] + "</a> " + "',");//3
                jsonStr.Append("'GJMXurl':'" + "<a  href=javascript:selectDetailInfo(C" + ID + ")>查看</a> " + "',");//轨迹明细
                jsonStr.Append("'CZ':'<a  href=javascript:selectInfo(C" + ID + ")>图形化轨迹</a>',");//查看
                jsonStr.Append("'ID':'C" + ID + "'");//ID                 
                jsonStr.Append(" }");
            }

            jsonStr.Append("],'page':'" + pageIndex + "','rp':'" + pageSize + "','total':'" + recs + "'}");


            HttpContext.Current.Response.Write(myfiter.json_RemoveSpecialStr(jsonStr.ToString()));

        }
        catch (Exception ex)
        {
            log4net.ILog log2 = log4net.LogManager.GetLogger("检测运行轨迹列表");
            log2.Error("Error", ex);
        }
    }

    //public 
    //{
    //}
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}