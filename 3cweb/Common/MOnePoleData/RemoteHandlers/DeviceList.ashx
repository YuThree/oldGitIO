<%@ WebHandler Language="C#" Class="DeviceList" %>

using System;
using System.Web;
using System.Xml;
using Api.Fault.entity.alarm;
using Api.Foundation.entity.Foundation;
using Api.Foundation.entity.Cond;
using System.Collections.Generic;
using System.Text;
public class DeviceList : ReferenceClass, IHttpHandler
{
    public void ProcessRequest(HttpContext context)
    {
        //获取前台页码
        int pageIndex = Convert.ToInt32(HttpContext.Current.Request["page"]);
        //获取前台条数
        int pageSize = Convert.ToInt32(HttpContext.Current.Request["rp"]);
        //设备编码
        string deviceCode = HttpContext.Current.Request["deviceCode"];
        //类型
        //string deviceType = HttpContext.Current.Request["deviceType"];
        //开始公里标
        string startKM = HttpContext.Current.Request["startKM"];
        //结束
        string endKM = HttpContext.Current.Request["endKM"];
        //线路
        string lineCode = HttpContext.Current.Request["lineCode"];
        //区站
        string positionName = HttpContext.Current.Request["positionName"];
        //桥隧
        string brgTunName = HttpContext.Current.Request["brgTunName"];

        //行别
        string direction = HttpContext.Current.Request["direction"];

        string category = HttpContext.Current.Request["category"] != null ? HttpContext.Current.Request["category"].ToString().ToUpper() : "1C";

        string sortname = HttpContext.Current.Request["sortname"] == "undefined" ? "" : HttpContext.Current.Request["sortname"];
        string sortorder = HttpContext.Current.Request["sortorder"] == "undefined" ? "" : HttpContext.Current.Request["sortorder"];
        switch (sortname)
        {
            case "EVENT_COUNT":
                sortname = "ALARM_COUNT";
                break;
            case "ALARM_COUNT":
                sortname = "FAULT_COUNT";
                break;
            case "":
                sortname = "POLE_ORDER";
                sortorder = "ASC";
                break;
        }

        if (sortorder == "")
        {
            sortorder = "desc";
        }

        PoleCond cond = new PoleCond();
        cond.businssAnd = " 1=1 ";
        //设备名称
        if (!String.IsNullOrEmpty(deviceCode))
        {
            cond.POLE_NO = deviceCode;
        }
        //线路
        if (lineCode != null && lineCode != "0")
        {
            cond.LINE_CODE = lineCode;
        }
        //区站 
        if (!String.IsNullOrEmpty(positionName))
        {
            cond.POSITION_NAME = positionName;
        }
        //桥遂
        if (!String.IsNullOrEmpty(brgTunName))
        {
            cond.BRG_TUN_NAME = brgTunName;
        }
        //行别
        if (!String.IsNullOrEmpty(direction))
        {
            cond.POLE_DIRECTION = direction == "0" ? "上行" : "下行";
        }
        //开始公里标
        if (!String.IsNullOrEmpty(startKM))
        {
            cond.startKm = int.Parse(System.Text.RegularExpressions.Regex.Replace(startKM, @"\D", ""));
        }
        if (!String.IsNullOrEmpty(endKM))
        {
            cond.endKm = int.Parse(System.Text.RegularExpressions.Regex.Replace(endKM, @"\D", ""));
        }
        cond.pageNum = pageIndex;
        cond.pageSize = pageSize;
        cond.myPara1 = category;
        if ("3C" == category)
        {
            cond.myPara2 = "ALARM WHERE CATEGORY_CODE = '3C' AND  STATUS != 'AFSTATUS02'";
        }
        else
        {
            cond.myPara2 = "C" + category.Substring(0, 1) + "_Event";
        }
    
        cond.myPara3 = sortname + " " + sortorder;

        cond.RightFilter = Api.Util.UserPermissionc.GetDataPermission("");

        IList<Pole> list = Api.ServiceAccessor.GetFoundationService().queryPole_Event(cond);

        //获取总条数
        int recordCount = Api.ServiceAccessor.GetFoundationService().getPoleCount(cond);
        StringBuilder jsonStr = new StringBuilder();
        jsonStr.Append("{'rows':[");
        for (int i = 0; i < list.Count; i++)
        {

            int alarmCount = list[i].FAULT_COUNT; //缺陷数
            int eventCount = list[i].ALARM_COUNT;//巡检数
            jsonStr.Append("{'POLE_CODE':'" + list[i].POLE_CODE + "',");//杆号
            jsonStr.Append("'POLE_NO':'" + list[i].POLE_NO + "',");//设备编码
            jsonStr.Append("'LINE_NAME':'" + list[i].LINE_NAME + "',");//设备编码
            jsonStr.Append("'POSITION_NAME':'" + list[i].POSITION_NAME + "',");//设备编码
            jsonStr.Append("'BRG_TUN_NAME':'" + list[i].BRG_TUN_NAME + "',");//设备编码
            jsonStr.Append("'ORG_NAME':'" + list[i].ORG_NAME + "',");//设备编码
            jsonStr.Append("'POLE_DIRECTION':'" + list[i].POLE_DIRECTION + "',");//设备编码
            jsonStr.Append("'KMSTANDARD':'" + PublicMethod.KmtoString(list[i].KMSTANDARD.ToString()) + "',");//设备编码            
            jsonStr.Append("'POLE_NO':'" + list[i].POLE_NO + "',");//设备编码
            jsonStr.Append("'EVENT_COUNT':'" + eventCount + "',");//事件统计
            jsonStr.Append("'ALARM_COUNT':'" + alarmCount + "',");//报警统计
            jsonStr.Append("'ID':'C" + list[i].ID + "'");//主键
            jsonStr.Append(i == list.Count - 1 ? "}" : "},");
        }
        jsonStr.Append("],'page':'" + pageIndex + "','rp':'" + pageSize + "','sortname':'" + sortname + "','sortorder':'" + sortorder + "','total':'" + recordCount + "'}");
        jsonStr = jsonStr.Replace("\n", "").Replace("\r", "").Replace("'", "\""); 
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