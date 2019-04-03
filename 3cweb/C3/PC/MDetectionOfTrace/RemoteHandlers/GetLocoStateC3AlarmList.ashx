<%@ WebHandler Language="C#" Class="GetLocoStateC3AlarmList" %>

using System;
using System.Web;
using System.Xml;
using Api.Fault.entity.alarm;
using System.Collections.Generic;

/// <summary>
/// 检测运行轨迹列表-一类、二类、三类链接。
/// </summary>
public class GetLocoStateC3AlarmList : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {

        int pageIndex = Convert.ToInt32(HttpContext.Current.Request["page"]);//获取前台页码
        int pageSize = Convert.ToInt32(HttpContext.Current.Request["rp"]);  //获取前台条数
        string locid = HttpContext.Current.Request["locid"];//获取设备编号
        string jl = HttpContext.Current.Request["jl"];//交路号
        string alarmtype = HttpContext.Current.Request["alarmtype"];//缺陷级别
        string LINE_CODE = HttpContext.Current.Request["LINE_CODE"];//线路
        string DIRECTION = HttpContext.Current.Request["DIRECTION"];
        DateTime startdate = DateTime.Now; //获取开始日期
        DateTime enddate = DateTime.Now;

        string remove = HttpContext.Current.Request["remove"];//手机端标识

        if (HttpContext.Current.Request["startdate"] != null && HttpContext.Current.Request["startdate"].ToString() != "")
        {
            startdate = DateTime.Parse(HttpContext.Current.Request["startdate"]);
        }

        if (HttpContext.Current.Request["enddate"] != null && HttpContext.Current.Request["enddate"].ToString() != "")
        {
            enddate = DateTime.Parse(HttpContext.Current.Request["enddate"]);
        }

        if (alarmtype == "1") { alarmtype = "一类"; } else if (alarmtype == "2") { alarmtype = "二类"; } else if (alarmtype == "3") { alarmtype = "三类"; }


        C3_AlarmCond alarmCond = new C3_AlarmCond();
        alarmCond.businssAnd = " 1=1 and  status <> 'AFSTATUS02'";
        alarmCond.page = pageIndex;
        alarmCond.pageSize = pageSize;
        if (!string.IsNullOrEmpty(jl))
        {
            alarmCond.ROUTING_NO = jl;
        }
        if (!string.IsNullOrEmpty(LINE_CODE))
        {
            if (LINE_CODE == "-1"|| LINE_CODE == "wu")
            {
                alarmCond.businssAnd += " and line_code is null  ";
            }
            else
            {

                alarmCond.LINE_CODE = LINE_CODE;
            }
        }
        if (DIRECTION == "-1" || DIRECTION =="无行别" || DIRECTION =="交路无行别")
        {
            if (Api.Util.Common.FunEnable("Fun_NullDirection") == false)
            {
                if (DIRECTION == "交路无行别")
                {
                    alarmCond.businssAnd += " and DIRECTION is null";
                }
                else
                {
                    alarmCond.businssAnd += " and (DIRECTION is null and line_code is null)";
                }
            }
            else
            {
                alarmCond.businssAnd += " and DIRECTION is null";
            }
        }
        else if (!string.IsNullOrEmpty(DIRECTION))
        {
            alarmCond.DIRECTION = DIRECTION;
        }
        //if (Api.Util.Common.FunEnable("Fun_NullDirection") == false)
        //{
        //    if (string.IsNullOrEmpty(DIRECTION))
        //    {
        //        if (!string.IsNullOrEmpty(alarmCond.businssAnd))
        //        {
        //            alarmCond.businssAnd += " and ";
        //        }
        //        alarmCond.businssAnd += "(line_code is null or (line_code is not null  and DIRECTION is not null))";
        //    }
        //}
        alarmCond.CATEGORY_CODE = "3C";
        alarmCond.SEVERITY = alarmtype;
        alarmCond.startTime = startdate;
        alarmCond.endTime = Convert.ToDateTime(enddate.ToString("yyyy-MM-dd") + " 23:59:59");
        alarmCond.orderBy = " raised_time desc";
        if (locid != "")
            alarmCond.DETECT_DEVICE_CODE = locid;

        List<C3_Alarm> LocList = Api.ServiceAccessor.GetAlarmService().getC3Alarm(alarmCond); //获取报警list
        int recordCount = Api.ServiceAccessor.GetAlarmService().getAlarmCount(alarmCond); //获取总条数

        //  string jsonStr = "{'rows':[";
        System.Text.StringBuilder jsonStr = new System.Text.StringBuilder();
        jsonStr.Append("{'rows':[");
        for (int i = 0; i < LocList.Count; i++)
        {
            if (i > 0)
                jsonStr.Append(",");

            jsonStr.Append("{'LOCOMOTIVE_CODE':'" + LocList[i].DETECT_DEVICE_CODE + "',");//车号
            jsonStr.Append("'JL':'" + LocList[i].ROUTING_NO + "',");//交路
            jsonStr.Append("'QD':'" + LocList[i].AREA_NO + "',");//运用区段
            jsonStr.Append("'KM':'" + PublicMethod.KmtoString(LocList[i].KM_MARK) + "',");//KM
            jsonStr.Append("'wz':'" + PublicMethod.GetPositionByC3_Alarm(LocList[i]) + "',");//KM
            jsonStr.Append("'SD':'" + LocList[i].SPEED + "km/h',");//速度
            jsonStr.Append("'WD':'" + myfiter.GetTEMP_MAX(LocList[i]) + "',");//温度
            jsonStr.Append("'HJWD':'" + myfiter.GetTEMP_ENV(LocList[i]) + "',");//温度
            jsonStr.Append("'JB':'" +LocList[i].SEVERITY+ "',");//级别
            jsonStr.Append("'ZT':'" + LocList[i].STATUS_NAME + "',");//状态
            jsonStr.Append("'NOWDATE':'" + LocList[i].RAISED_TIME.ToString("yyyy-MM-dd HH:mm:ss") + "',");//发生时间
            jsonStr.Append("'CZ':'<a  href=javascript:selectInfo(C" + LocList[i].ID + ")>处理</a>',");//操作
            jsonStr.Append("'XZ':'<a href=javascript:IRVXZ(C" + LocList[i].ID + ")>视频下载</a>',");//XZ
            if (!string.IsNullOrEmpty(remove) && remove == "1")
            {
                jsonStr.Append("'ID':'" + LocList[i].ID + "'");
            }
            else
            {
                jsonStr.Append("'ID':'C" + LocList[i].ID + "'");
            }
            jsonStr.Append(" }");
        }

        jsonStr.Append("],'page':'" + pageIndex + "','rp':'" + pageSize + "','total':'" + recordCount + "'}");


        string rejson = myfiter.json_RemoveSpecialStr(jsonStr.ToString());


        if (!string.IsNullOrEmpty(remove) && remove == "1")
        {
            rejson = myfiter.RemoveHTML(rejson, 0);
        }

        HttpContext.Current.Response.Write(rejson);

    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}