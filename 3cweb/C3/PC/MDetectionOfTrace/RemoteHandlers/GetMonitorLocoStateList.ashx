<%@ WebHandler Language="C#" Class="GetMonitorLocoStateList" %>

using System;
using System.Web;
using System.IO;
using System.Data;
using System.Collections.Generic;
using Api.Foundation.entity.Foundation;
using Api.Foundation.entity.Cond;
using Api.Fault.entity.alarm;

/// <summary>
/// 未使用。
/// </summary>
public class GetMonitorLocoStateList : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {

        int pageIndex = Convert.ToInt32(HttpContext.Current.Request["page"]); //获取前台页码
        int pageSize = Convert.ToInt32(HttpContext.Current.Request["rp"]);//获取前台条数
        string ju = HttpContext.Current.Request["ju"]; //局
        string jwd = HttpContext.Current.Request["jwd"]; //机务段
        string loccode = HttpContext.Current.Request["loccode"];//设备编号

        LocomotiveCond locc = new LocomotiveCond();
        
        //获取日期
        if (HttpContext.Current.Request["startdate"] != null && HttpContext.Current.Request["startdate"] != "")
        {
            DateTime startdate = DateTime.Parse(HttpContext.Current.Request["startdate"]);
            locc.startTime = startdate;
        }
        if (HttpContext.Current.Request["enddate"] != null && HttpContext.Current.Request["enddate"] != "")
        {
            DateTime enddate = DateTime.Parse(HttpContext.Current.Request["enddate"] + " 23:59:59");
            locc.endTime = enddate;
        }
        if (ju != null && ju != "0")
        {
            locc.BUREAU_CODE = ju;
        }
        if (jwd != null && jwd != "0")
        {
            locc.P_ORG_CODE = jwd;
        }
        if ( !string.IsNullOrEmpty( loccode))
        {
            locc.LOCOMOTIVE_CODE = loccode;
        }


        IList<LocomotiveListItem> loclist = Api.ServiceAccessor.GetFoundationService().queryLocomotiveList(locc);

        //获取总条数
        int recordCount = loclist.Count; ;
        string bowstatus = "";   
        string gjurl;
        string gjmxurl;
        string YLnum;
        string ELnum;
        string SLnum;
        string jsonStr = "{'rows':[";
        for (int i = 0; i < loclist.Count; i++)
        {
            gjurl = "<a  href=javascript:selectInfo(" + loclist[i].LOCOMOTIVE_CODE + ")>图形化轨迹</a> ";
            gjmxurl = "<a  href=javascript:selectDetailInfo(" + loclist[i].LOCOMOTIVE_CODE + ")>查看</a> ";

            YLnum = "<a  href=javascript:selectYLnumInfo(" + loclist[i].LOCOMOTIVE_CODE + ")>" + loclist[i].fault1Count + "</a> ";//报警个数
            ELnum = "<a  href=javascript:selectELnumInfo(" + loclist[i].LOCOMOTIVE_CODE + ")>" + loclist[i].fault2Count + "</a> ";//缺陷个数
            SLnum = "<a  href=javascript:selectSLnumInfo(" + loclist[i].LOCOMOTIVE_CODE + ")>" + loclist[i].fault3Count + "</a> ";//缺陷个数
            if (PublicMethod.marcar != "1")
            {
                if (loclist[i].bowStatus == "1")
                {
                    bowstatus = "正常";
                }
                else
                {
                    bowstatus = "异常";
                }
            }
            else
            {
                if (loclist[i].bowStatus == "00")
                {
                    bowstatus = "4车5车正常";
                }
                else if (loclist[i].bowStatus == "01")
                {
                    bowstatus = "4车正常5车异常";
                }
                else if (loclist[i].bowStatus == "10")
                {
                    bowstatus = "4车异常5车正常";
                }
                else if (loclist[i].bowStatus == "11")
                {
                    bowstatus = "4车异常5车异常";
                }
                else
                {
                    bowstatus = "4车异常5车异常";
                }
            }
            jsonStr += "{'LOCOMOTIVE_CODE':'" + loclist[i].LOCOMOTIVE_CODE + "',";//设备编号
            //jsonStr += "'ju':'" + loclist[i].belongingBureau.ORG_NAME + "',";//局
            //jsonStr += "'duan':'" + loclist[i].belongingDepot.ORG_NAME + "',";//段
            jsonStr += "'runningStatus':'" + loclist[i].runningStatus + "',";//运行状态
            jsonStr += "'Statustime':'" + loclist[i].CREATE_DATE + "',";//最近状态时间
            jsonStr += "'taxStatus':'" + loclist[i].taxStatus + "',";//tax
            jsonStr += "'renderStatus':'" + loclist[i].renderStatus + "',";//雷达
            jsonStr += "'gpsStatus':'" + loclist[i].gpsStatus + "',";//gps
            jsonStr += "'bowStatus':'" + bowstatus + "',";//弓
            jsonStr += "'kmFlag':'" + PublicMethod.KmtoString(loclist[i].kmFlag) + "',";//公里标
            jsonStr += "'YLnum':'" + YLnum + "',";//1
            jsonStr += "'ELnum':'" + ELnum + "',";//2
            jsonStr += "'SLnum':'" + SLnum + "',";//3
            jsonStr += "'GJurl':'" + gjurl + "',";//轨迹
            jsonStr += "'GJMXurl':'" + gjmxurl + "',";//轨迹明细
            jsonStr += "'ID':'" + loclist[i].LOCOMOTIVE_CODE + "'";//主键
            jsonStr += " },";
        }
        if (jsonStr.LastIndexOf(',') > 0)
        {
            jsonStr = jsonStr.Substring(0, jsonStr.LastIndexOf(',')) + "],'page':" + pageIndex + ",'rp':" + pageSize + ",'total':" + recordCount + "}";
        }
        else
        {
            jsonStr += "],'page':'" + pageIndex + "','rp':'" + pageSize + "','total':'" + recordCount + "'}";

        }
        jsonStr = jsonStr.Replace("'", "\"");
        HttpContext.Current.Response.Write(jsonStr);
        
        
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}