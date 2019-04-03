<%@ WebHandler Language="C#" Class="ReportControl" %>

using System;
using System.Web;
using System.Data;
using Api.Fault.entity.alarm;
using Api.Foundation.entity.Foundation;
using System.Collections.Generic;


public class ReportControl : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        string type = context.Request["type"];
        string reportType = context.Request["reportType"];
        string category = context.Request["category"];
        string orgCode = context.Request["orgCode"];
        string orgType = context.Request["orgType"];
        string lineCode = context.Request["lineCode"];
        string startDate = context.Request["startdate"];
        string endDate = context.Request["endDate"];
        switch (type)


        {
            case "table":
                GetTable(reportType, category, startDate, endDate, orgCode, orgType, lineCode);
                break;
            case "severity":
                GetPieChart(reportType, "缺陷级别", category, startDate, endDate, orgCode, orgType, lineCode);
                break;
            case "status":
                GetPieChart(reportType, "缺陷状态", category, startDate, endDate, orgCode, orgType, lineCode);
                break;
            case "summary":
                GetPieChart(reportType, "缺陷类型", category, startDate, endDate, orgCode, orgType, lineCode);
                break;
            case "line":
                GetLineSelect();
                break;
        }
    }
    public void GetTable(string reportType, string category, string startDate, string endDate, string orgCode, string orgType, string lineCode)
    {
        //获取前台页码
        int pageIndex = Convert.ToInt32(HttpContext.Current.Request["page"]);
        //获取前台条数
        int pageSize = Convert.ToInt32(HttpContext.Current.Request["rp"]);

        if (category == "3C")
        {
            System.Text.StringBuilder jsonStr = new System.Text.StringBuilder();
            jsonStr.Append("{'rows':[");

            int recordCount = 0;

            string strWhere = GetStrWhere(reportType, category, startDate, endDate, orgCode, orgType, lineCode);

            string sql = @"select ID,line_name as LINE_NAME,position_name as POSITION_NAME,
            case when t.KM_MARK!=-1 then ('K'||FLOOR(t.KM_MARK/1000)||'+'||MOD(t.KM_MARK,1000)) end as KM_MARK,POLE_NUMBER,REPORT_DATE,(select code_name from sys_dic where dic_code=severity) SEVERITY,code_name as SUMMARY,
            status_name as STATUS,DETECT_DEVICE_CODE,ROUTING_NO,BRG_TUN_NAME,GIS_X,GIS_Y,
            NVALUE1,to_char(nvalue4) as nvalue4,to_char(nvalue5) as nvalue5,to_char(nvalue2) nvalue2,to_char(nvalue3) nvalue3,bureau_name as BUREAU,
            power_section_name as GDDUAN,p_org_name as DUAN,workshop_name as CJ,org_name as BZ
             from ALARM t where 1=1 " + strWhere + myfiter.GetPublicFilter()+ @" order by REPORT_DATE desc";
            PubPage pb = new PubPage();
            pb.PageIndex = pageIndex;
            pb.PageSize = pageSize;
            pb.sql_base = sql;
            DataTable dt = pb.GetPageDattaCount(out recordCount);

            if (dt.Rows.Count > 0)
            {
                int n = 0;
                foreach (DataRow dr in dt.Rows)
                {

                    if (n == 0)
                    {
                        jsonStr.Append("{");
                    }
                    else
                    {
                        jsonStr.Append(",{");
                    }

                    jsonStr.AppendFormat("'DETECT_DEVICE_CODE':'{0}',", dr["DETECT_DEVICE_CODE"]);//设备编号
                    jsonStr.AppendFormat("'REPORT_DATE':'{0}',", dr["REPORT_DATE"]);//处理时间
                    jsonStr.AppendFormat("'LINE_NAME':'{0}',", dr["LINE_NAME"]);//线路
                    jsonStr.AppendFormat("'POSITION_NAME':'{0}',", dr["POSITION_NAME"]);//区站
                    jsonStr.AppendFormat("'KM_MARK':'{0}',", dr["KM_MARK"]);//公里标
                    jsonStr.AppendFormat("'GIS_Y':'{0}',", dr["GIS_Y"]);//纬度
                    jsonStr.AppendFormat("'GIS_X':'{0}',", dr["GIS_X"]);//经度
                    jsonStr.AppendFormat("'NVALUE1':'{0}',", dr["NVALUE1"]);//机车速度
                    jsonStr.AppendFormat("'NVALUE2':'{0}',", myfiter.GetLINE_HEIGHT(Convert.ToInt32(dr["NVALUE2"])));//导高值
                    jsonStr.AppendFormat("'NVALUE3':'{0}',", myfiter.GetPULLING_VALUE(Convert.ToInt32(dr["NVALUE3"])));//拉出值
                    jsonStr.AppendFormat("'NVALUE4':'{0}',", myfiter.GetTEMP(Convert.ToInt32(dr["NVALUE4"])));//红外最高温度
                    jsonStr.AppendFormat("'NVALUE5':'{0}',", myfiter.GetTEMP(Convert.ToInt32(dr["NVALUE5"])));//环境温度
                    jsonStr.AppendFormat("'SEVERITY':'{0}',", dr["SEVERITY"]);//缺陷级别
                    jsonStr.AppendFormat("'SUMMARY':'{0}',", dr["SUMMARY"]);//缺陷类型
                    jsonStr.AppendFormat("'STATUS':'{0}',", dr["STATUS"]);//缺陷状态
                    jsonStr.AppendFormat("'ID':'{0}'", dr["ID"]);//主键
                    jsonStr.Append(" }");

                    n++;

                }
            }


            jsonStr.Append("],'page':'" + pageIndex + "','rp':'" + pageSize + "','total':'" + recordCount + "'}");

            jsonStr = jsonStr.Replace("'", "\"");

            HttpContext.Current.Response.Write(jsonStr);

        }
        else
        {
            AlarmCond alarmCond = new AlarmCond();
            alarmCond.page = pageIndex;
            alarmCond.pageSize = pageSize;

            if (orgCode != "0" && orgCode != null)
            {
                switch (orgType)
                {
                    case "TOPBOSS":
                        break;
                    case "J":
                        alarmCond.BUREAU_CODE = orgCode;
                        break;
                    case "GDD":
                        alarmCond.POWER_SECTION_CODE = orgCode;
                        break;
                    case "JWD":
                        alarmCond.P_ORG_CODE = orgCode;
                        break;
                    case "CJ":
                        alarmCond.WORKSHOP_CODE = orgCode;
                        break;
                    case "GQ":
                        alarmCond.ORG_CODE = orgCode;
                        break;
                }
            }
            switch (reportType)
            {
                case "day":
                    alarmCond.businssAnd = " REPORT_DATE >=to_date('" + startDate + " 00:00:00','yyyy-MM-dd hh24:mi:ss') and REPORT_DATE <=to_date('" + startDate + " 23:59:59','yyyy-MM-dd hh24:mi:ss')";
                    break;
                case "week":
                    startDate = startDate + " 00:00:00";
                    endDate = endDate + " 23:59:59";
                    alarmCond.businssAnd = " RAISED_TIME >=to_date('" + startDate + "','yyyy-MM-dd hh24:mi:ss') and RAISED_TIME <=to_date('" + endDate + "','yyyy-MM-dd hh24:mi:ss') ";
                    break;
                case "month":
                    alarmCond.businssAnd = " to_char(RAISED_TIME,'yyyy-MM') ='" + startDate + "' ";
                    break;
            }
            if (lineCode != null && lineCode != "0")
            {
                alarmCond.LINE_CODE = lineCode;
            }
            if (category != null && category != "" && category != "DPC")
            {
                alarmCond.CATEGORY_CODE = category;
            }
            alarmCond.orderBy = " REPORT_DATE DESC";

            alarmCond.businssAnd += " and category_code !='综合分析'";//改过and status != 'AFSTATUS01'

            //获取C3list
            List<Alarm> c3List = Api.ServiceAccessor.GetAlarmService().getAlarm(alarmCond);
            //获取总条数
            int recordCount = Api.ServiceAccessor.GetAlarmService().getAlarmCount(alarmCond);
            string jsonstr = "{'rows':[";
            for (int i = 0; i < c3List.Count; i++)
            {
                string status = c3List[i].STATUS_NAME;//状态
                string Summary = "";
                Summary = GetSummaryByAlarmid(c3List[i].ID);
                jsonstr += "{'G_DUAN_ORG':'" + c3List[i].POWER_SECTION_NAME + "',";//段
                jsonstr += "'G_CJ_ORG':'" + c3List[i].WORKSHOP_NAME + "',";//车间
                jsonstr += "'G_TSYS_ORG':'" + c3List[i].ORG_NAME + "',";//工区
                jsonstr += "'LINE_CODE':'" + c3List[i].LINE_NAME + "',";//线路
                jsonstr += "'G_JU':'" + c3List[i].BUREAU_NAME + "',";//局
                jsonstr += "'POSITION_CODE':'" + c3List[i].POSITION_NAME + "',";//区站
                jsonstr += "'CATEGORY_CODE':'" + c3List[i].CATEGORY_CODE + "',";//数据类型
                jsonstr += "'KM_MARK':'" + KmtoString(c3List[i].KM_MARK) + "',";//公里标
                jsonstr += "'POLE_NUMBER':'" + c3List[i].POLE_NUMBER + "',";//杆号
                jsonstr += "'SUMMARY':'" + Summary + "',";//c3List[i].SUMMARYDIC.CODE_NAME缺陷类型
                jsonstr += "'SEVERITY':'" + c3List[i].SEVERITY + "',";//级别
                jsonstr += "'WZ':'" + GetWZbyAlarmid(c3List[i].ID) + "',";//位置信息 
                jsonstr += "'QXTYPE':'" + c3List[i].CODE_NAME + "',";//级别
                jsonstr += "'CREATED_TIME':'" + c3List[i].RAISED_TIME.ToString("yyyy-MM-dd HH:mm:ss") + "',";//发生时间
                jsonstr += "'JXTIME':'" + c3List[i].REPAIR_DATE.ToString("yyyy-MM-dd HH:mm:ss") + "',";//检修日期
                jsonstr += "'JXR':'" + c3List[i].REPAIR_PERSON + "',";//检修人

                jsonstr += "'STATUS':'" + status + "',";//状态
                jsonstr += "'ID':'C" + c3List[i].ID + "'";
                jsonstr += " },";
            }
            if (jsonstr.LastIndexOf(',') > 0)
            {
                jsonstr = jsonstr.Substring(0, jsonstr.LastIndexOf(',')) + "],'page':" + pageIndex + ",'rp':" + pageSize + ",'total':" + recordCount + "}";
            }
            else
            {
                jsonstr += "],'page':'" + pageIndex + "','rp':'" + pageSize + "','total':'" + recordCount + "'}";

            }

            jsonstr = jsonstr.Replace("'", "\"");
            HttpContext.Current.Response.Write(jsonstr);
        }

    }

    public void GetSeverityJson(string reportType, string category, string startDate, string endDate, string orgCode, string orgType, string lineCode, ref string titleJson, ref string valueJson)
    {
        titleJson = ""; valueJson = "";
        string strWhere = GetStrWhere(reportType, category, startDate, endDate, orgCode, orgType, lineCode);
        string sql = "select (select code_name from sys_dic where dic_code=severity) SEVERITY,count(ID) from ALARM where 1=1 " + strWhere + myfiter.GetPublicFilter() + " group by SEVERITY ";
        DataSet ds = DbHelperOra.Query(sql);
        if (ds.Tables.Count > 0)
        {
            foreach (DataRow row in ds.Tables[0].Rows)
            {
                titleJson += "'" + row["SEVERITY"] + "',";
                valueJson += "{ value: " + row["COUNT(ID)"] + ", name: '" + row["SEVERITY"] + "' },";
            }
        }

    }

    public void GetStatusJson(string reportType, string category, string startDate, string endDate, string orgCode, string orgType, string lineCode, ref string titleJson, ref string valueJson)
    {
        titleJson = ""; valueJson = "";
        string strWhere = GetStrWhere(reportType, category, startDate, endDate, orgCode, orgType, lineCode);
        string sql = "select (select CODE_NAME from SYS_DIC where DIC_CODE=t1.STATUS) as STATUS,count(ID) from ALARM t1 where 1=1 " + strWhere + myfiter.GetPublicFilter() + " group by STATUS";
        DataSet ds = DbHelperOra.Query(sql);
        if (ds.Tables.Count > 0)
        {
            foreach (DataRow row in ds.Tables[0].Rows)
            {
                titleJson += "'" + row["STATUS"] + "',";
                valueJson += "{ value: " + row["COUNT(ID)"] + ", name: '" + row["STATUS"] + "' },";
            }
        }


    }

    public void GetSummaryJson(string reportType, string category, string startDate, string endDate, string orgCode, string orgType, string lineCode, ref string titleJson, ref string valueJson)
    {
        titleJson = ""; valueJson = "";
        string strWhere = GetStrWhere(reportType, category, startDate, endDate, orgCode, orgType, lineCode);

        //string sql = "select case when SUMMARY is null then '新上报' else SUMMARY end as SUMMARY,count(ID) from ALARM t1 where category_code='" + category + "' " + strWhere + " group by t1.SUMMARY";
        string sql = "select (select code_name from sys_dic where dic_code = t.code) SUMMARY, count(ID)  from alarm t where 1=1 " + strWhere + myfiter.GetPublicFilter() + "group by code";
        DataSet ds = DbHelperOra.Query(sql);
        if (ds.Tables.Count > 0)
        {
            foreach (DataRow row in ds.Tables[0].Rows)
            {
                if (!string.IsNullOrEmpty(row["SUMMARY"].ToString()))
                {
                    titleJson += "'" + row["SUMMARY"] + "',";
                    valueJson += "{ value: " + row["COUNT(ID)"] + ", name: '" + row["SUMMARY"] + "' },";
                }
            }
        }
    }

    /// <summary>
    /// 得到图option
    /// </summary>
    private void GetPieChart(string reportType, string pieType, string category, string startDate, string endDate, string orgCode, string orgType, string lineCode)
    {
        string valueJson = "", titleJson = "";

        string Itemstyle = "";

        switch (pieType)
        {
            case "缺陷级别":
                GetSeverityJson(reportType, category, startDate, endDate, orgCode, orgType, lineCode, ref titleJson, ref valueJson);
                break;
            case "缺陷类型":
                GetSummaryJson(reportType, category, startDate, endDate, orgCode, orgType, lineCode, ref titleJson, ref valueJson);
                Itemstyle = @",
                            itemStyle:{ 
                                      normal:{ 
                                            label:{ 
                                              show: true, 
                                              formatter: '{c}' 
                                            }, 
                                            labelLine :{show:true} 
                                          } 
                                      } ";
                break;
            case "缺陷状态":
                GetStatusJson(reportType, category, startDate, endDate, orgCode, orgType, lineCode, ref titleJson, ref valueJson);
                Itemstyle = @",
                            itemStyle:{ 
                                      normal:{ 
                                            label:{ 
                                              show: true, 
                                            
                                              formatter: '{b} {c} ' 
                                            }, 
                                            labelLine :{show:true} 
                                          } 
                                      } ";
                break;
        }
        string re = @"{
        title:
        {
            text: '" + pieType + @"',
                    x: 'center'
                },
                tooltip:
        {
            trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend:
        {
            orient: 'vertical',
                    x: 'left',
                    data: [" + titleJson + @"]
                },
                toolbox:
        {
            show: true,
                    feature:
            {
                saveAsImage: { show: false }
            }
        },
                calculable: false,
                series: [
                {
            name: '数量',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: [" + valueJson + @"]
                    " + Itemstyle + @"
                }
            ]
            }
        ";

        HttpContext.Current.Response.Write(re);
    }

    private void GetLineSelect()
    {
        string selectList;
        string sql = "select * from mis_line where workshop_code='1'";
        DataSet dsLine = DbHelperOra.Query(sql);
        selectList = "<select id='ddlLine' style='width: 80px;' data-rel='chosen' >";
        selectList += "<option value='0'>全部</option>";
        if (dsLine.Tables.Count > 0)
        {
            foreach (DataRow row in dsLine.Tables[0].Rows)
            {
                selectList += "<option value='" + row["LINE_CODE"] + "'>" + row["LINE_NAME"] + "</option>";
            }
        }
        selectList += "</select>";
        HttpContext.Current.Response.Write(selectList);


    }

    private string GetStrWhere(string reportType, string category, string startDate, string endDate, string orgCode, string orgType, string lineCode)
    {
        string strWhere = " and " + Api.Util.UserPermissionc.GetDataPermission();
        //strWhere += myfiter.GetdayCount();//默认排除新上报报警
        switch (reportType)
        {
            case "day":
                strWhere += " and REPORT_DATE >=to_date('" + startDate + " 00:00:00','yyyy-MM-dd hh24:mi:ss') and REPORT_DATE <=to_date('" + startDate + " 23:59:59','yyyy-MM-dd hh24:mi:ss')";
                break;
            case "week":
                startDate = startDate + " 00:00:00";
                endDate = endDate + " 23:59:59";
                strWhere += " and RAISED_TIME >=to_date('" + startDate + "','yyyy-MM-dd hh24:mi:ss') and RAISED_TIME <=to_date('" + endDate + "','yyyy-MM-dd hh24:mi:ss') ";
                break;
            case "month":
                strWhere += " and RAISED_TIME >=to_date('" + startDate + "','yyyy-MM') and RAISED_TIME <=to_date('" + Convert.ToDateTime(startDate).AddMonths(1).ToString("yyyy-MM") + "','yyyy-MM')";
                break;
        }
        if (orgCode != "0" && orgCode != null)
        {
            //如果是供电用户根据组织机构筛选通过ORG_CODE，反之则根据P_ORG_CODE
            if (Api.Util.Public.IsPowerSectionUser())
            {
                strWhere += string.Format(" and ORG_CODE like '%{0}%'", orgCode);
            }
            else
            {
                strWhere += string.Format(" and P_ORG_CODE like '%{0}%'", orgCode);
            }
            //switch (orgType)
            //{
            //    case "TOPBOSS":
            //        break;
            //    case "J":
            //        strWhere += " and  bureau_code = '" + orgCode + "' ";
            //        break;
            //    case "GDD":
            //        strWhere += " and  power_section_code = '" + orgCode + "' ";
            //        break;
            //    case "JWD":
            //        strWhere += " and  p_org_code = '" + orgCode + "' ";
            //        break;
            //    case "CJ":
            //        strWhere += " and  workshop_code = '" + orgCode + "' ";
            //        break;
            //    case "GQ":
            //        strWhere += " and  org_code = '" + orgCode + "' ";
            //        break;
            //}
        }
        if (category != "DPC")
        {
            strWhere += " and category_code ='" + category + "' ";
        }
        if (lineCode != "0" && lineCode != null)
        {
            strWhere += " and line_code='" + lineCode + "' ";
        }
        strWhere += " and category_code !='综合分析'";
        return strWhere;
    }

    /// <summary>
    /// 6C获取位置信息
    /// </summary>
    /// <param name="alarmid"></param>
    /// <returns></returns>
    private string GetWZByAlarmid(string alarmid)
    {
        string wz = "";
        try
        {
            List<C3_Alarm> alarmList = new List<C3_Alarm>();
            C3_AlarmCond alarmCond = new C3_AlarmCond();
            RoutingStationRel rel = new RoutingStationRel();
            alarmCond.ID = alarmid;
            alarmList = Api.ServiceAccessor.GetAlarmService().getC3Alarm(alarmCond);
            if (alarmList.Count > 0)
            {
                try { wz += alarmList[0].LINE_NAME + "&nbsp;"; }
                catch { }
                try { wz += alarmList[0].POSITION_NAME + "&nbsp;"; }
                catch { }
                try { wz += alarmList[0].BRG_TUN_NAME + "&nbsp;"; }
                catch { }
                wz += alarmList[0].DIRECTION + "&nbsp;";
                wz += KmtoString(alarmList[0].KM_MARK) + "&nbsp;";
                if (alarmList[0].POLE_NUMBER != null && alarmList[0].POLE_NUMBER != "") { wz += alarmList[0].POLE_NUMBER + "支柱"; }
                wz += "；";
                if (!String.IsNullOrEmpty(alarmList[0].ROUTING_NO))
                {
                    wz += alarmList[0].ROUTING_NO + "号交路(" + alarmList[0].AREA_NO + ")" + "&nbsp;";
                    if (alarmList[0].STATION_NO != null && alarmList[0].STATION_NO != "")
                    {
                        rel = Api.Util.Common.getRoutingStationRel(alarmList[0].BUREAU_CODE, alarmList[0].ROUTING_NO, alarmList[0].STATION_NO);
                        wz += "&nbsp;" + alarmList[0].STATION_NO;
                        if (rel.STATION_NAME != null && rel.STATION_NAME.Trim() != "")
                        {
                            wz += "(" + rel.STATION_NAME + ") ";
                        }
                        wz += "站点";
                    }
                }
            }
        }
        catch { }
        return wz;

    }

    /// <summary>
    /// 公里标格式转换
    /// </summary>
    /// <param name="km"></param>
    /// <returns></returns>
    private string KmtoString(int km)
    {
        string kmStr = km.ToString();
        if (km <= 0)
        {
            return "";
        }
        else if (kmStr.Length <= 3)
        {
            return "K0+" + kmStr;
        }
        else
        {
            return "K" + kmStr.Substring(0, kmStr.Length - 3) + "+" + kmStr.Substring(kmStr.Length - 3, 3);
        }
    }


    /// <summary>
    /// 根据ID返回缺陷摘要
    /// </summary>
    /// <param name="alarmid"></param>
    /// <returns></returns>
    private string GetSummaryByAlarmid(string alarmid)
    {
        string Summary = "";
        try
        {
            if (alarmid != null && alarmid != "")
            {
                List<Alarm> alarmList = new List<Alarm>();
                AlarmCond alarmCond = new AlarmCond();
                alarmCond.ID = alarmid;
                alarmList = Api.ServiceAccessor.GetAlarmService().getAlarm(alarmCond);
                if (alarmList.Count > 0)
                {
                    Summary = GetSummaryByAlarm(alarmList[0]);
                }
            }
        }
        catch { }
        return Summary;
    }


    private string GetSummaryByAlarm(Alarm m)
    {
        string Summary = "";

        if (m.CATEGORY_CODE == "6C")
        {
            Summary += "温度报警,";
            if (m.NVALUE4.ToString() != "" && m.NVALUE4 != null)
            {
                Summary += "区域最高温度" + m.NVALUE2 + "℃&nbsp;";
            }
            if (m.NVALUE2.ToString() != "" && m.NVALUE2 != null)
            {
                Summary += "区域报警温度" + m.NVALUE4 + "℃&nbsp;";
            }
            if (m.NVALUE3.ToString() != "" && m.NVALUE3 != null)
            {
                //Summary += "环境温差" + alarmList[0].NVALUE3 + "℃";
            }
        }
        else if (m.CATEGORY_CODE == "1C")
        {
            if (m.SVALUE2.ToString() != "" && m.SVALUE2 != null)
            {
                Summary += "超限类型:" + m.SVALUE2 + "&nbsp;";//超限类型
            }
            if (m.SVALUE3.ToString() != "" && m.SVALUE3 != null)
            {
                Summary += "超限等级:" + m.SVALUE3 + "&nbsp;";//超限等级
            }
            if (m.SVALUE4.ToString() != "" && m.SVALUE4 != null)
            {
                Summary += "超限值:" + m.SVALUE4 + "&nbsp;";//超限值
            }
            if (m.NVALUE2.ToString() != "" && m.NVALUE2 != null)
            {
                Summary += "超限长度:" + m.NVALUE2 + "&nbsp;";//超限长度
            }
        }
        else if (m.CATEGORY_CODE == "3C")
        {

            Summary += "车号" + m.DETECT_DEVICE_CODE + "&nbsp;";
            if (m.NVALUE2.ToString() != "" && m.NVALUE2 != null)
            {
                Summary += "报警温度" + m.NVALUE2 / 100 + "℃&nbsp;";
            }
            if (m.NVALUE5.ToString() != "" && m.NVALUE5 != null)
            {
                Summary += "环境温度" + m.NVALUE5 / 100 + "℃&nbsp;";
            }
            if (m.NVALUE3.ToString() != "" && m.NVALUE3 != null)
            {
                Summary += "导高值" + m.NVALUE3 + "mm&nbsp;";
            }
            if (m.NVALUE4.ToString() != "" && m.NVALUE4 != null)
            {
                Summary += "拉出值" + m.NVALUE4 + "mm";
            }
            if (m.NVALUE1.ToString() != "" && m.NVALUE1 != null)
            {
                Summary += "速度" + m.NVALUE1 + "km/h&nbsp;";
            }
        }
        else
        {
            Summary = m.DETAIL;
        }

        return Summary;
    }
    /// <summary>
    /// 根据ID算缺陷列表的位置信息
    /// </summary>
    /// <param name="alarmid"></param>
    /// <returns></returns>
    private string GetWZbyAlarmid(string alarmid)
    {

        if (string.IsNullOrEmpty(alarmid))
            return "";

        string wz = "";
        try
        {
            List<Alarm> alarmList = new List<Alarm>();
            AlarmCond alarmCond = new AlarmCond();


            alarmCond.ID = alarmid;
            alarmList = Api.ServiceAccessor.GetAlarmService().getAlarm(alarmCond);
            if (alarmList.Count > 0)
            {
                wz = GetWZbyAlarm(alarmList[0]);
            }
        }
        catch { }
        return wz;
    }



    private string GetWZbyAlarm(Alarm m)
    {
        string wz = "";

        if (m.CATEGORY_CODE == "6C")
        {
            wz += m.SUBSTATION_NAME + "&nbsp;";//变电名称
            wz += m.POWER_DEVICE_CODE;//设备编码
        }
        else
        {
            wz += m.POSITION_NAME + "&nbsp;";//区站
            wz += m.BRG_TUN_NAME + "&nbsp;";//桥遂
            wz += "&nbsp;" + m.DIRECTION + "&nbsp;";//行别
            wz += KmtoString(m.KM_MARK) + "&nbsp;";//公里标
            if (m.POLE_NUMBER != null && m.POLE_NUMBER != "")
            {
                wz += m.POLE_NUMBER + "支柱";//支柱
            }
        }

        return wz;
    }


    public bool IsReusable
    {
        get
        {
            return false;
        }
    }
}