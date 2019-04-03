<%@ WebHandler Language="C#" Class="MonitorLocoStateListCombine" %>

using System;
using System.Web;
using System.Data;
using System.Text;

public class MonitorLocoStateListCombine : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        string OrgType = HttpContext.Current.Request["OrgType"];//供电段类型
        string PK_Name = "";
        if (OrgType == "Line_GDD"&&Api.Util.Public.GetCurrentUser().USER_TYPE=="供电")
        {
            PK_Name = "pkg_loco.loco_stats_ln";
        }
        else if (OrgType == "GDD"&&Api.Util.Public.GetCurrentUser().USER_TYPE=="供电")
        {
            PK_Name = "pkg_loco.loco_stats_pw";
        }
        else if(Api.Util.Public.GetCurrentUser().USER_TYPE!="供电")
        {
            PK_Name = "pkg_loco.loco_stats";
        }
        int totalCount = 0;
        string pageOfTotal = "0";
        string pageRange = "0";
        int PageIndex = 0;
        int PageSize = 0;
        int totalPages = 0;
        StringBuilder Json = new StringBuilder("{\"list\":[");
        try
        {
            string sql = string.Format("select * from table({0}({1}))", PK_Name, getWhere());
            log4net.ILog log3 = log4net.LogManager.GetLogger("状态");
            log3.Info("状态查询sql:" + sql);
            DataSet ds = DbHelperOra.Query(sql);
            if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                totalCount = Convert.ToInt32(ds.Tables[0].Rows[0]["TOTAL_ROWS"]);
                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    DataRow row = ds.Tables[0].Rows[i];
                    if (i + 1 == ds.Tables[0].Rows.Count)
                    {
                        Json.AppendFormat("{{\"item\":[");
                        Json.Append(getJson(row));
                        Json.AppendFormat("]}}");
                        break;
                    }
                    DataRow nxt = ds.Tables[0].Rows[i + 1];
                    if (Convert.ToString(row["DETECT_TIME"]) == Convert.ToString(nxt["DETECT_TIME"]) && Convert.ToString(row["LOCOMOTIVE_CODE"]) == Convert.ToString(nxt["LOCOMOTIVE_CODE"]))
                    {
                        Json.AppendFormat("{{\"item\":[");
                        Json.Append(getJson(row));
                        for (int j = i + 1; j <= ds.Tables[0].Rows.Count; j++)
                        {
                            if (j == ds.Tables[0].Rows.Count)
                            {
                                Json.AppendFormat("]}}");
                                break;
                            }
                            if (Convert.ToString(row["DETECT_TIME"]) == Convert.ToString(ds.Tables[0].Rows[j]["DETECT_TIME"]) && Convert.ToString(row["LOCOMOTIVE_CODE"]) == Convert.ToString(ds.Tables[0].Rows[j]["LOCOMOTIVE_CODE"]))
                            {
                                i++;
                                Json.Append(",");

                                nxt = ds.Tables[0].Rows[j];
                                //next第二条
                                Json.Append(getJson(nxt));
                            }
                            else
                            {
                                Json.AppendFormat("]}},");
                                break;
                            }
                        }

                    }
                    else
                    {
                        Json.AppendFormat("{{\"item\":[");
                        Json.Append(getJson(row));
                        Json.AppendFormat("]}},");
                    }
                }
                PageHelper ph = new PageHelper();
                PageSize = string.IsNullOrEmpty(HttpContext.Current.Request["size"]) ? 0 : Convert.ToInt32(HttpContext.Current.Request["size"]);//页大小
                PageIndex = string.IsNullOrEmpty(HttpContext.Current.Request["page"]) ? 0 : Convert.ToInt32(HttpContext.Current.Request["page"]);//当前页
                ph.getPageHelper(totalCount, PageIndex, PageSize);
                pageOfTotal = ph.PageOfTotal;
                pageRange = ph.PageRange;
                totalPages = ph.Total_pages;
            }
        }
        catch (Exception ex)
        {
            log4net.ILog log = log4net.LogManager.GetLogger("轨迹数据");
            log.Error("执行出错", ex);
        }
        Json.AppendFormat("],\"pageOfTotal\":\"{0}\",\"pageRange\":\"{1}\",\"total_Rows\":\"{2}\",\"pageSize\":\"{3}\",\"pageIndex\":\"{4}\",\"totalPages\":\"{5}\"}}", pageOfTotal, pageRange, totalCount, PageSize, PageIndex, totalPages);
        string remove = HttpContext.Current.Request["remove"];//是否移除html代码
        string rejson = Json.ToString();
        if (remove == "1")
        {
            rejson = myfiter.RemoveHTML(rejson,0);
        }
        context.Response.Write(myfiter.json_RemoveSpecialStr(rejson));
    }
    public StringBuilder getJson(DataRow row)
    {
        StringBuilder Json = new StringBuilder("");

        Json.AppendFormat("{{\"ID\":\"{0}\",\"DETECT_TIME\":\"{1}\",\"LOCOMOTIVE_CODE\":\"{2}\",\"LINE_NAME\":\"{3}\",\"DIRECTION\":\"{4}\",\"KM_MARK\":\"{5}\",\"POLE_NO\":\"{6}\",\"ROUTING_NO\":\"{7}\",\"AREA_NO\":\"{8}\",\"STATION_NO\":\"{9}\",\"TAX_MONITOR_STATUS\":\"{10}\""
            , row["ID"], Convert.ToDateTime(row["DETECT_TIME"]).ToString("yyyy-MM-dd HH:mm"), row["LOCOMOTIVE_CODE"], row["LINE_NAME"], row["DIRECTION"], row["KM_MARK"], row["POLE_NO"], row["ROUTING_NO"], row["AREA_NO"], row["STATION_NO"], row["TAX_MONITOR_STATUS"]);
        Json.AppendFormat(",\"IRV_TEMP\":\"{0}\",\"ENV_TEMP\":\"{1}\",\"PORT_NUMBER\":\"{2}\",\"TEMP_SENSOR_STATUS\":\"{3}\",\"IS_CON_IR\":\"{4}\",\"IS_REC_IR\":\"{5}\",\"IS_CON_VI\":\"{6}\",\"IS_REC_VI\":\"{7}\",\"IS_CON_OV\":\"{8}\",\"IS_REC_OV\":\"{9}\",\"IS_CON_FZ\":\"{10}\",\"IS_REC_FZ\":\"{11}\""
            , myfiter.GetTEMP(Convert.ToDouble(row["IRV_TEMP"])), myfiter.GetTEMP(Convert.ToDouble(row["ENV_TEMP"])), row["PORT_NUMBER"], row["TEMP_SENSOR_STATUS"], row["IS_CON_IR"], row["IS_REC_IR"], row["IS_CON_VI"], row["IS_REC_VI"], row["IS_CON_OV"], row["IS_REC_OV"], row["IS_CON_FZ"], row["IS_REC_FZ"]);
        Json.AppendFormat(",\"LINE_HEIGHT\":\"{0}\",\"PULLING_VALUE\":\"{1}\",\"SPEED\":\"{2}\",\"GIS_LON_O\":\"{3}\",\"GIS_LAT_O\":\"{4}\",\"BOW_UPDOWN_STATUS\":\"{5}\",\"TOTAL_ROWS\":\"{6}\",\"SATELLITE_NUM\":\"{7}\",\"WZ\":\"{8}\",\"LINE_HEIGHT_X\":\"{9}\",\"PULLING_VALUE_X\":\"{10}\""
            , myfiter.GetLINE_HEIGHT(Convert.ToInt32(row["LINE_HEIGHT"])), myfiter.GetPULLING_VALUE(Convert.ToInt32(row["PULLING_VALUE"])), myfiter.GetSpeed(row["SPEED"]), row["GIS_LON_O"], row["GIS_LAT_O"], row["BOW_UPDOWN_STATUS"], row["TOTAL_ROWS"], row["SATELLITE_NUM"], PublicMethod.GetPositionBySMSID(row["ID"].ToString()), myfiter.GetLINE_HEIGHT(Convert.ToInt32(row["LINE_HEIGHT_X"])), myfiter.GetPULLING_VALUE(Convert.ToInt32(row["PULLING_VALUE_X"])));
            Json.AppendFormat(",\"SOCKET1\":\"{0}\",\"SOCKET2\":\"{1}\",\"CPU1\":\"{2}\",\"CPU2\":\"{3}\"}}"
            , row["SOCKET1"], row["SOCKET2"], row["CPU1"], row["CPU2"]);
        return Json;
    }
    public string getWhere()
    {
        string strWher = "";
        string locid = HttpContext.Current.Request["locid"];//获取设备编号
        string ju = HttpContext.Current.Request["ju"];//局
        string jwd = HttpContext.Current.Request["jwd"]; //机务段
        string txtqz = HttpContext.Current.Request["txtqz"];//区站
        string txtqz_code = HttpContext.Current.Request["txtqz_code"];//区站
        string linecode = HttpContext.Current.Request["LINE_CODE"];//线路
        string routingno = HttpContext.Current.Request["jl"];//交路
        string direction = HttpContext.Current.Request["direction"];//行别
        string startSpeed = HttpContext.Current.Request["startSpeed"];//最小速度
        string endSpeed = HttpContext.Current.Request["endSpeed"]; //最大速度
        string startKM = HttpContext.Current.Request["startKM"];//起始公里标
        string endKM = HttpContext.Current.Request["endKM"];//结束公里标
        if (!string.IsNullOrEmpty(HttpContext.Current.Request["startdate"]))
        {
            DateTime startdate = DateTime.Parse(HttpContext.Current.Request["startdate"]); //获取日期
            strWher += string.Format(",p_stime =>to_date('{0}','yyyy-MM-dd hh24:mi:ss')", startdate.ToString("yyyy-MM-dd HH:mm:ss"));
        }
        if (!string.IsNullOrEmpty(HttpContext.Current.Request["enddate"]))
        {
            string enddatastr = HttpContext.Current.Request["enddate"];
            //if (enddatastr.Length < 12)
            //{
            //    enddatastr += " 23:59:59";
            //}
            DateTime enddate = DateTime.Parse(enddatastr);
            strWher += string.Format(",p_etime =>to_date('{0}','yyyy-MM-dd hh24:mi:ss')", enddate.ToString("yyyy-MM-dd HH:mm:ss"));
        }
        if (!string.IsNullOrEmpty(ju) && ju != "0" && !ju.Equals("undefined"))
        {
            strWher += string.Format(",p_bureau_code =>'{0}'", ju);
        }
        if (!string.IsNullOrEmpty(jwd) && jwd != "0"&& !jwd.Equals("undefined"))
        {
            if ((jwd.Contains("GDB") || jwd.Contains("GDC") || jwd.Contains("GDD") || jwd.Contains("CJ") || jwd.Contains("GQ")) && Api.Util.Public.GetCurrentUser().USER_TYPE != "供电")
            {
                strWher += string.Format(",pv_org_code =>'{0}'", jwd);
            }
            else if ((jwd.Contains("GDB") || jwd.Contains("GDC") || jwd.Contains("GDD") || jwd.Contains("CJ") || jwd.Contains("GQ")) && Api.Util.Public.GetCurrentUser().USER_TYPE == "供电")
            {
                strWher += string.Format(",p_org_code =>'{0}'", jwd);
            }
            else
            {
                strWher += string.Format(",p_p_org_code =>'{0}'", jwd);
            }
        }
        if (!string.IsNullOrEmpty(locid))
        {
            strWher += string.Format(",p_locomotive_code =>'{0}'", locid);
        }
        if (!string.IsNullOrEmpty(txtqz)&& !txtqz.Equals("undefined"))
        {
            strWher += string.Format(",p_position_name =>'{0}'", txtqz);
        }
        if (!string.IsNullOrEmpty(txtqz_code)&& !txtqz_code.Equals("undefined"))
        {
            strWher += string.Format(",p_position_code =>'{0}'", txtqz_code);
        }
        if (!string.IsNullOrEmpty(linecode) && linecode != "-1"&& !linecode.Equals("undefined"))
        {
            //strWher += string.Format(",p_line_code =>'{0}'", linecode);
            strWher += string.Format(",p_line_code =>'{0}'", ("wu,-1".IndexOf(linecode) > -1 ? "NONE" : linecode));
        }
        if (!string.IsNullOrEmpty(direction) && direction != "-1" && direction != "0")
        {
            strWher += string.Format(",p_direction =>'{0}'", ("交路无行别,-1".IndexOf(direction) > -1 ? "null" : direction));
        }
        if (!string.IsNullOrEmpty(startSpeed))
        {
            strWher += string.Format(",p_speed1 =>{0}", startSpeed);
        }
        if (!string.IsNullOrEmpty(endSpeed))
        {
            strWher += string.Format(",p_speed2 =>{0}", endSpeed);
        }
        if (Api.Util.Public.GetUserCode != "admin")
        {
            strWher += string.Format(",p_usercode =>'{0}'", Api.Util.Public.GetUserCode);
        }
        if (Api.Util.Public.GetCurrentUser().USER_TYPE!="供电")
        {
            if (!string.IsNullOrEmpty(routingno) && routingno != "-1")
            {
                strWher += string.Format(",p_routing_no =>'{0}'", routingno);
            }
        }
        if (!string.IsNullOrEmpty(startKM))
        {
            strWher += string.Format(",P_SKM =>{0}", startKM);
        }
        if (!string.IsNullOrEmpty(endKM))
        {
            strWher += string.Format(",P_EKM =>{0}", endKM);
        }

        string page = HttpContext.Current.Request["page"];//获取前台页码
        string size = HttpContext.Current.Request["size"]; //获取前台条数
        if (!string.IsNullOrEmpty(page))
        {
            strWher += string.Format(",p_currpage =>{0}", page);
        }
        if (!string.IsNullOrEmpty(size))
        {
            strWher += string.Format(",p_pagesize =>{0}", size);
        }
        if (strWher.Length > 0)
        {
            strWher = strWher.Substring(1);
        }
        return strWher;
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }
}
