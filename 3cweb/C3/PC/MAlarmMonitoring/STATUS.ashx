<%@ WebHandler Language="C#" Class="STATUS" %>

using System;
using System.Web;
using System.Data;
using Microsoft.Reporting.WebForms;
using System.IO;

public class STATUS :ReferenceClass, IHttpHandler {

    private string locid = "";

    public void ProcessRequest (HttpContext context)
    {
        try
        {
            download(context);
        }
        catch (Exception ex)
        {
            HttpContext.Current.Response.Write("false");
            log4net.ILog log = log4net.LogManager.GetLogger("报表下载");
            log.Error("执行出错", ex);
        }
    }

    public void download(HttpContext context)
    {
        string str = Export(context);
        string url ="{\"url\":["+ "\"" + str.Replace("\\", "\\\\")+ "\"" +"]}";

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(url);
    }

    public string Export(HttpContext context)
    {
        string OrgType = HttpContext.Current.Request["OrgType"];//显示部门类型
        string pk_name = "pkg_loco.loco_stats";
        switch (OrgType)
        {
            case "Line_GDD":
                pk_name = "pkg_loco.loco_stats_ln";
                break;
            case "GDD":
                pk_name = "pkg_loco.loco_stats_pw";
                break;
            default:
                pk_name = "pkg_loco.loco_stats";
                break;
        }
        string sql = string.Format("select * from table({0}({1}))", pk_name, getWhere());
        log4net.ILog log3 = log4net.LogManager.GetLogger("状态");
        log3.Info("状态查询导出excel sql:" + sql);
        DataSet ds = DbHelperOra.Query(sql, "RunStatus");

        DataTable dt = getDataTable(ds);
        int[] str = new int[] {22,25,50,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12};
        string name = DateTime.Now.ToString("yyyyMMdd_HHmmss");
        if (!Directory.Exists(System.Web.HttpContext.Current.Server.MapPath(@"~\TempReport\")+name+@"\"))
        {
            DirectoryInfo directoryInfo = new DirectoryInfo(System.Web.HttpContext.Current.Server.MapPath(@"~\TempReport\")+name+@"\");
            directoryInfo.Create();
        }
        Api.Util.PubExcel.SendXls(dt,System.Web.HttpContext.Current.Server.MapPath(@"~/TempReport/")+name,str);
        return "/TempReport/"+name+"/Book1.xls";
    }

    public string getWhere()
    {
        string strWher = "";
        locid = HttpContext.Current.Request["locid"];//获取设备编号
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
        if (!string.IsNullOrEmpty(txtqz) && !txtqz.Equals("undefined"))
        {
            strWher += string.Format(",p_position_name =>'{0}'", txtqz);
        }
        if (!string.IsNullOrEmpty(txtqz_code) && !txtqz_code.Equals("undefined"))
        {
            strWher += string.Format(",p_position_code =>'{0}'", txtqz_code);
        }
        if (!string.IsNullOrEmpty(linecode) && linecode != "-1" && !linecode.Equals("undefined"))
        {
            strWher += string.Format(",p_line_code =>'{0}'", linecode);
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
        if (Api.Util.Public.GetCurrentUser().USER_TYPE != "供电")
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

        //string page = HttpContext.Current.Request["page"];//获取前台页码
        //string size = HttpContext.Current.Request["size"]; //获取前台条数
        //if (!string.IsNullOrEmpty(page))
        //{
        strWher += string.Format(",p_currpage =>{0}", 1);
        //}
        //if (!string.IsNullOrEmpty(size))
        //{
        strWher += string.Format(",p_pagesize =>{0}", int.MaxValue);
        //}
        if (strWher.Length > 0)
        {
            strWher = strWher.Substring(1);
        }
        return strWher;
    }

    private void getStruct(DataTable dt)
    {
        DataColumn dc = new DataColumn("设备号", Type.GetType("System.String"));
        DataColumn dc1 = new DataColumn("时间", Type.GetType("System.String"));
        DataColumn dc2 = new DataColumn("位置", Type.GetType("System.String"));
        DataColumn dc3 = new DataColumn("速度", Type.GetType("System.String"));
        DataColumn dc4 = new DataColumn("卫星数", Type.GetType("System.String"));
        DataColumn dc5 = new DataColumn("拉出值", Type.GetType("System.String"));
        DataColumn dc6 = new DataColumn("导高值", Type.GetType("System.String"));
        DataColumn dc7 = new DataColumn("弓位置", Type.GetType("System.String"));
        DataColumn dc8 = new DataColumn("弓状态", Type.GetType("System.String"));
        DataColumn dc9 = new DataColumn("红外温度", Type.GetType("System.String"));
        DataColumn dc10 = new DataColumn("环境温度", Type.GetType("System.String"));
        DataColumn dc11 = new DataColumn("温度连接", Type.GetType("System.String"));
        DataColumn dc12 = new DataColumn("红外连接", Type.GetType("System.String"));
        DataColumn dc13 = new DataColumn("红外录像", Type.GetType("System.String"));
        DataColumn dc14 = new DataColumn("细节连接", Type.GetType("System.String"));
        DataColumn dc15 = new DataColumn("细节录像", Type.GetType("System.String"));
        DataColumn dc16 = new DataColumn("全景连接", Type.GetType("System.String"));
        DataColumn dc17 = new DataColumn("全景录像", Type.GetType("System.String"));
        DataColumn dc18 = new DataColumn();
        DataColumn dc19 = new DataColumn();
        DataColumn dc20 = new DataColumn();
        DataColumn dc21 = new DataColumn();
        DataColumn dc22 = new DataColumn();
        DataColumn dc23 = new DataColumn();
        if (Api.Util.Common.FunEnable("Fun_isCRH"))
        {
            dc18 = new DataColumn("辅助连接", Type.GetType("System.String"));
            dc19 = new DataColumn("辅助录像", Type.GetType("System.String"));
            dc20 = new DataColumn("SOCKET主板1连接", Type.GetType("System.String"));
            dc21 = new DataColumn("SOCKET主板2连接", Type.GetType("System.String"));
            dc22 = new DataColumn("CPU1使用率", Type.GetType("System.String"));
            dc23 = new DataColumn("CPU2使用率", Type.GetType("System.String"));
        }
        DataColumn dc24 = new DataColumn("经度", Type.GetType("System.String"));
        DataColumn dc25 = new DataColumn("纬度", Type.GetType("System.String"));

        dt.Columns.Add(dc);
        dt.Columns.Add(dc1);
        dt.Columns.Add(dc2);
        dt.Columns.Add(dc3);
        dt.Columns.Add(dc4);
        dt.Columns.Add(dc5);
        dt.Columns.Add(dc6);
        dt.Columns.Add(dc7);
        dt.Columns.Add(dc8);
        dt.Columns.Add(dc9);
        dt.Columns.Add(dc10);
        dt.Columns.Add(dc11);
        dt.Columns.Add(dc12);
        dt.Columns.Add(dc13);
        dt.Columns.Add(dc14);
        dt.Columns.Add(dc15);
        dt.Columns.Add(dc16);
        dt.Columns.Add(dc17);
        if (Api.Util.Common.FunEnable("Fun_isCRH"))
        {
            dt.Columns.Add(dc18);
            dt.Columns.Add(dc19);
            dt.Columns.Add(dc20);
            dt.Columns.Add(dc21);
            dt.Columns.Add(dc22);
            dt.Columns.Add(dc23);
        }
        dt.Columns.Add(dc24);
        dt.Columns.Add(dc25);
    }

    private DataTable getDataTable(DataSet ds)
    {
        DataTable dd = new DataTable();
        dd = ds.Tables["RunStatus"];

        DataTable dt = new DataTable();
        getStruct(dt);
        if (ds.Tables.Count > 0)
        {
            for (int i = 0; i < dd.Rows.Count; i++)
            {
                DataRow dr = dt.NewRow();
                dr["设备号"] = Convert.ToString(dd.Rows[i]["LOCOMOTIVE_CODE"]);
                dr["时间"] = Convert.ToString(dd.Rows[i]["DETECT_TIME"]);
                dr["位置"] = PublicMethod.GetPositionBySMSID(Convert.ToString(dd.Rows[i]["ID"])).Replace("&nbsp;", " ").Replace(" <font color=#9A8178>", "").Replace("</font>", "");
                dr["速度"] = myfiter.GetSpeed(Convert.ToInt32(dd.Rows[i]["SPEED"]));
                dr["卫星数"] = Convert.ToString(dd.Rows[i]["SATELLITE_NUM"]);
                dr["拉出值"] = Convert.ToString(dd.Rows[i]["PULLING_VALUE_X"]);
                dr["导高值"] = Convert.ToString(dd.Rows[i]["LINE_HEIGHT_X"]);
                dr["弓位置"] = Convert.ToString(dd.Rows[i]["PORT_NUMBER"]);
                dr["弓状态"] = Convert.ToString(dd.Rows[i]["BOW_UPDOWN_STATUS"])=="升"?"升弓":" ";
                dr["红外温度"] = myfiter.GetTEMP(Convert.ToDouble(dd.Rows[i]["IRV_TEMP"]));
                dr["环境温度"] = myfiter.GetTEMP(Convert.ToDouble(dd.Rows[i]["ENV_TEMP"]));
                dr["温度连接"] = Geticon(Convert.ToString(dd.Rows[i]["TEMP_SENSOR_STATUS"]));
                dr["红外连接"] = Geticon(Convert.ToString(dd.Rows[i]["IS_CON_IR"]));
                dr["红外录像"] = Geticon(Convert.ToString(dd.Rows[i]["IS_REC_IR"]));
                dr["细节连接"] = Geticon(Convert.ToString(dd.Rows[i]["IS_CON_VI"]));
                dr["细节录像"] = Geticon(Convert.ToString(dd.Rows[i]["IS_REC_VI"]));
                dr["全景连接"] = Geticon(Convert.ToString(dd.Rows[i]["IS_CON_OV"]));
                dr["全景录像"] = Geticon(Convert.ToString(dd.Rows[i]["IS_REC_OV"]));
                if (Api.Util.Common.FunEnable("Fun_isCRH"))
                {
                    dr["辅助连接"] = Geticon(Convert.ToString(dd.Rows[i]["IS_CON_FZ"]));
                    dr["辅助录像"] = Geticon(Convert.ToString(dd.Rows[i]["IS_REC_FZ"]));
                    dr["SOCKET主板1连接"] = Geticon(Convert.ToString(dd.Rows[i]["SOCKET1"]));
                    dr["SOCKET主板2连接"] = Geticon(Convert.ToString(dd.Rows[i]["SOCKET2"]));
                    dr["CPU1使用率"] = Convert.ToString(dd.Rows[i]["CPU1"]) + "%";
                    dr["CPU2使用率"] = Convert.ToString(dd.Rows[i]["CPU2"]) + "%";
                }
                dr["经度"] = Convert.ToString(dd.Rows[i]["GIS_LON_O"]);
                dr["纬度"] = Convert.ToString(dd.Rows[i]["GIS_LAT_O"]);
                dt.Rows.Add(dr);
            }
        }
        return dt;
    }

    private string Geticon(string s)
    {
        string str = "";
        if (Api.Util.Common.FunEnable("Fun_LOCSTATE_NEW"))
        {
            if (s == "正常" || s=="1")
            {
                str = "√";
            }
            else if (s == "异常" || s=="0")
            {
                str = "×";
            }
            else
            {
                str = "×";
            }
        }
        else
        {
            str = "√";
        }
        return str;
    }
    public bool IsReusable {
        get {
            return false;
        }
    }

}