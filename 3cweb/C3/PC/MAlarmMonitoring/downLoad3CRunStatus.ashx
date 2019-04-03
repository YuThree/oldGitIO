C <%@ WebHandler Language="C#" Class="downLoad3CRunStatus" %>

using System;
using System.Web;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using Api.ADO.entity;
using System.Data.OracleClient;
using System.IO;


public class downLoad3CRunStatus : ReferenceClass, IHttpHandler
{


    public void ProcessRequest(HttpContext context)
    {
        string type = HttpContext.Current.Request["type"];
        string str = "";
        switch (type)
        {
            case "Excel":
                str = downloadExcel(context);
                break;
            case "Word":
                str = downloadWord(context);
                break;
        }

        string url = "{\"url\":" + "\"" + str.Replace("\\", "\\\\") + "\"" + "}";

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(url);
    }

    public string downloadExcel(HttpContext context)
    {

        System.Data.DataTable dt = GetTable(context);
        System.Data.DataSet ds_execl = ConverToDs(dt);

        string name = GetExcelName(context);
        if (!Directory.Exists(System.Web.HttpContext.Current.Server.MapPath(@"~\TempReport\")))
        {
            DirectoryInfo directoryInfo = new DirectoryInfo(System.Web.HttpContext.Current.Server.MapPath(@"~\TempReport\"));
            directoryInfo.Create();
        }

        int[] width = new int[] { 12, 25, 14, 14, 14, 14, 14, 14, 14, 14, 14 };
        Api.Util.PubExcel.SendXls(ds_execl, System.Web.HttpContext.Current.Server.MapPath(@"~/TempReport/"), width, name);


        return "/TempReport/" + name + ".xls";
    }

    public string downloadWord(HttpContext context)
    {

        System.Data.DataTable dt = GetTable(context);
        System.Data.DataSet ds_word = ConverToDs(dt);
        int[] width = new int[] { 2, 5, 4, 3, 3, 3, 3, 3, 3, 3, 3 };
        //获取模板文档  网站根目录/Report/Model.doc
        string file = System.Web.HttpContext.Current.Server.MapPath(@"~/Report/") + "Model3.doc";

        Api.Util.WordAspose word = new Api.Util.WordAspose();
        word.OpenWord(file);
        foreach (DataTable dt_word in ds_word.Tables)
        {
            word.InsertText(1, dt_word.TableName, 22);
            word.InsertCells(dt_word, width);
        }

        string name = GetExcelName(context) + ".doc";
        string filename = System.Web.HttpContext.Current.Server.MapPath(@"~/TempReport/") + name;
        word.SaveAs(file, filename);


        return "/TempReport/" + name;
    }

    private DataTable GetTable(HttpContext context)
    {
        System.Data.DataSet ds = new System.Data.DataSet();
        try
        {
            System.Data.OracleClient.OracleParameter[] listParam = new System.Data.OracleClient.OracleParameter[7];
            listParam[0] = new System.Data.OracleClient.OracleParameter("P_BUREAU_CODE", OracleType.VarChar, 100);
            listParam[1] = new System.Data.OracleClient.OracleParameter("P_ORG_CODE", OracleType.VarChar, 100);
            listParam[2] = new System.Data.OracleClient.OracleParameter("P_START_DATE", OracleType.DateTime, 0);
            listParam[3] = new System.Data.OracleClient.OracleParameter("P_END_DATE", OracleType.DateTime, 0);
            listParam[4] = new System.Data.OracleClient.OracleParameter("P_STAT_CODES", OracleType.VarChar, 100);
            listParam[5] = new System.Data.OracleClient.OracleParameter("P_USER_CODE", OracleType.VarChar, 20);
            listParam[5].Value = Api.Util.Public.GetUserCode == "admin" ? "" : Api.Util.Public.GetUserCode;
            listParam[6] = new System.Data.OracleClient.OracleParameter("P_OUT1", OracleType.Cursor, 0);
            listParam[6].Direction = ParameterDirection.Output;

            string startDate = HttpContext.Current.Request["startDate"];
            string endDate = Convert.ToDateTime(HttpContext.Current.Request["endDate"]).AddDays(1).ToString();
            string ju = HttpContext.Current.Request["ju"];
            string duan = HttpContext.Current.Request["duan"];
            string status = HttpContext.Current.Request["status"];
            if (ju != "0" && ju != null)
                listParam[0].Value = ju;
            if (duan != "0" && duan != null)
                listParam[1].Value = duan;
            if (startDate != "" && startDate != "undefined")
                listParam[2].Value = Convert.ToDateTime(startDate);
            if (endDate != "" && endDate != "undefined")
                listParam[3].Value = Convert.ToDateTime(endDate);
            if (status != "0" && status != null)
                listParam[4].Value = status;

            string SS = listParam[0].Value + ";" + listParam[1].Value + ";" + listParam[2].Value + ";" + listParam[3].Value + ";" + listParam[4].Value;

            ds = DbHelperOra.RunProcedure("pkg_report_ex.P_DTKM_STAT", listParam, "tb1");
        }
        catch (Exception ex)
        {

        }
        return ds.Tables[0];
    }

    private System.Data.DataSet ConverToDs(DataTable dt)
    {
        dt.Columns.Remove("BUREAU_NAME");
        dt.Columns.Remove("SECTION_NAME");
        //dt.Columns["LINE_NAME"].ColumnName = "线路";
        //dt.Columns["KM_NUM"].ColumnName = "检测里程（km）";
        //dt.Columns["ALARM_COUNT"].ColumnName = "缺陷合计(处)";
        System.Data.DataSet ds = new System.Data.DataSet();
        ds.Clear();
        try
        {
            DataRow[] dr = dt.Select();
            List<string> strs = new List<string>();
            foreach (DataRow dd in dr)
            {
                strs.Add(Convert.ToString(dd["LOCOMOTIVE_CODE"]));
            }
            var locos = strs.Distinct<string>().ToList();
            foreach (string loco in locos)
            {
                DataRow[] dr_loco = dt.Select("LOCOMOTIVE_CODE='" + loco + "'", "LINE_NAME");
                if (dr_loco == null || dr_loco.Length == 0)
                    break;

                DataTable dt_loco = new DataTable();
                DataColumn dc1 = new DataColumn("序号", Type.GetType("System.String"));
                DataColumn dc2 = new DataColumn("线路", Type.GetType("System.String"));
                DataColumn dc3 = new DataColumn("检测里程（Km）", Type.GetType("System.String"));
                DataColumn dc4 = new DataColumn("受电弓拉弧超标（处）", Type.GetType("System.String"));
                DataColumn dc5 = new DataColumn("接触网温度超标（处）", Type.GetType("System.String"));
                DataColumn dc6 = new DataColumn("几何参数超限（处）", Type.GetType("System.String"));
                DataColumn dc7 = new DataColumn("受电弓隐患（处）", Type.GetType("System.String"));
                DataColumn dc8 = new DataColumn("其他（处）", Type.GetType("System.String"));
                DataColumn dc9 = new DataColumn("缺陷合计(处)", Type.GetType("System.String"));
                DataColumn dc10 = new DataColumn("复核整改（处）", Type.GetType("System.String"));
                DataColumn dc11 = new DataColumn("整改率（%）", Type.GetType("System.String"));

                dt_loco.Columns.Add(dc1);
                dt_loco.Columns.Add(dc2);
                dt_loco.Columns.Add(dc3);
                dt_loco.Columns.Add(dc4);
                dt_loco.Columns.Add(dc5);
                dt_loco.Columns.Add(dc6);
                dt_loco.Columns.Add(dc7);
                dt_loco.Columns.Add(dc8);
                dt_loco.Columns.Add(dc9);
                dt_loco.Columns.Add(dc10);
                dt_loco.Columns.Add(dc11);

                dt_loco = ConverLocoTable(dr_loco, dt_loco);//整理成各个车的数据表
                dt_loco.TableName = loco;
                ds.Tables.Add(dt_loco);
            }
        }
        catch (Exception ex)
        {

        }
        return ds;
    }

    private DataTable ConverLocoTable(DataRow[] rows, DataTable dt)
    {
        int num = 1;

        double km_cout = 0;
        double alarm_cout = 0;
        double bownet_cout = 0;
        double jcw_cout = 0;
        double jhcs_cout = 0;
        double bow_cout = 0;
        double qt_cout = 0;
        double km_cout_t = 0;
        double alarm_cout_t = 0;
        double bownet_cout_t = 0;
        double jcw_cout_t = 0;
        double jhcs_cout_t = 0;
        double bow_cout_t = 0;
        double qt_cout_t = 0;

        if (rows.Length > 1)
        {
            for (int i = 0; i < rows.Length; i++)
            {
                if (i != rows.Length - 1)
                {
                    if (Convert.ToString(rows[i]["LINE_NAME"]) != Convert.ToString(rows[i + 1]["LINE_NAME"]))
                    {
                        km_cout += Convert.ToDouble(rows[i]["KM_NUM"]);
                        alarm_cout += Convert.ToDouble(rows[i]["ALARM_COUNT"]);
                        bownet_cout += rows[i]["AFBOWNET_CNT"] != DBNull.Value ? Convert.ToDouble(rows[i]["AFBOWNET_CNT"]) : 0;
                        jcw_cout += rows[i]["AFOCL_CNT"] != DBNull.Value ? Convert.ToDouble(rows[i]["AFOCL_CNT"]) : 0;
                        jhcs_cout += rows[i]["AFJHCS_CNT"] != DBNull.Value ? Convert.ToDouble(rows[i]["AFJHCS_CNT"]) : 0;
                        bow_cout += rows[i]["AFBOW_CNT"] != DBNull.Value ? Convert.ToDouble(rows[i]["AFBOW_CNT"]) : 0;
                        qt_cout += rows[i]["AFOTHOPS_CNT"] != DBNull.Value ? Convert.ToDouble(rows[i]["AFOTHOPS_CNT"]) : 0;


                        DataRow dc_row = dt.NewRow();
                        dc_row["序号"] = Convert.ToString(num);
                        dc_row["线路"] = rows[i]["LINE_NAME"];
                        dc_row["检测里程（Km）"] = Convert.ToString(km_cout);
                        dc_row["受电弓拉弧超标（处）"] = Convert.ToString(bownet_cout);
                        dc_row["接触网温度超标（处）"] = Convert.ToString(jcw_cout);
                        dc_row["几何参数超限（处）"] = Convert.ToString(jhcs_cout);
                        dc_row["受电弓隐患（处）"] = Convert.ToString(bow_cout);
                        dc_row["其他（处）"] = Convert.ToString(qt_cout);
                        dc_row["缺陷合计(处)"] = Convert.ToString(alarm_cout);
                        dt.Rows.Add(dc_row);

                        num++;
                        km_cout_t += km_cout;
                        alarm_cout_t += alarm_cout;
                        bownet_cout_t += bownet_cout;
                        jcw_cout_t += jcw_cout;
                        jhcs_cout_t += jhcs_cout;
                        bow_cout_t += bow_cout;
                        qt_cout_t += qt_cout;

                        km_cout = 0;
                        alarm_cout = 0;
                        bownet_cout = 0;
                        jcw_cout = 0;
                        jhcs_cout = 0;
                        bow_cout = 0;
                        qt_cout = 0;
                    }
                    else
                    {
                        km_cout += rows[i]["KM_NUM"] != DBNull.Value ? Convert.ToDouble(rows[i]["KM_NUM"]) : 0;
                        alarm_cout += rows[i]["ALARM_COUNT"] != DBNull.Value ? Convert.ToDouble(rows[i]["ALARM_COUNT"]) : 0;
                        bownet_cout += rows[i]["AFBOWNET_CNT"] != DBNull.Value ? Convert.ToDouble(rows[i]["AFBOWNET_CNT"]) : 0;
                        jcw_cout += rows[i]["AFOCL_CNT"] != DBNull.Value ? Convert.ToDouble(rows[i]["AFOCL_CNT"]) : 0;
                        jhcs_cout += rows[i]["AFJHCS_CNT"] != DBNull.Value ? Convert.ToDouble(rows[i]["AFJHCS_CNT"]) : 0;
                        bow_cout += rows[i]["AFBOW_CNT"] != DBNull.Value ? Convert.ToDouble(rows[i]["AFBOW_CNT"]) : 0;
                        qt_cout += rows[i]["AFOTHOPS_CNT"] != DBNull.Value ? Convert.ToDouble(rows[i]["AFOTHOPS_CNT"]) : 0;
                    }
                }
                else
                {
                    km_cout += rows[i]["KM_NUM"] != DBNull.Value ? Convert.ToDouble(rows[i]["KM_NUM"]) : 0;
                    alarm_cout += rows[i]["ALARM_COUNT"] != DBNull.Value ? Convert.ToDouble(rows[i]["ALARM_COUNT"]) : 0;
                    bownet_cout += rows[i]["AFBOWNET_CNT"] != DBNull.Value ? Convert.ToDouble(rows[i]["AFBOWNET_CNT"]) : 0;
                    jcw_cout += rows[i]["AFOCL_CNT"] != DBNull.Value ? Convert.ToDouble(rows[i]["AFOCL_CNT"]) : 0;
                    jhcs_cout += rows[i]["AFJHCS_CNT"] != DBNull.Value ? Convert.ToDouble(rows[i]["AFJHCS_CNT"]) : 0;
                    bow_cout += rows[i]["AFBOW_CNT"] != DBNull.Value ? Convert.ToDouble(rows[i]["AFBOW_CNT"]) : 0;
                    qt_cout += rows[i]["AFOTHOPS_CNT"] != DBNull.Value ? Convert.ToDouble(rows[i]["AFOTHOPS_CNT"]) : 0;


                    DataRow dc_row = dt.NewRow();
                    dc_row["序号"] = Convert.ToString(num);
                    dc_row["线路"] = rows[i]["LINE_NAME"];
                    dc_row["检测里程（Km）"] = Convert.ToString(km_cout);
                    dc_row["受电弓拉弧超标（处）"] = Convert.ToString(bownet_cout);
                    dc_row["接触网温度超标（处）"] = Convert.ToString(jcw_cout);
                    dc_row["几何参数超限（处）"] = Convert.ToString(jhcs_cout);
                    dc_row["受电弓隐患（处）"] = Convert.ToString(bow_cout);
                    dc_row["其他（处）"] = Convert.ToString(qt_cout);
                    dc_row["缺陷合计(处)"] = Convert.ToString(alarm_cout);
                    dt.Rows.Add(dc_row);

                    km_cout_t += km_cout;
                    alarm_cout_t += alarm_cout;
                    bownet_cout_t += bownet_cout;
                    jcw_cout_t += jcw_cout;
                    jhcs_cout_t += jhcs_cout;
                    bow_cout_t += bow_cout;
                    qt_cout_t += qt_cout;
                }
            }
        }
        else
        {
            DataRow dc_row = dt.NewRow();
            dc_row["序号"] = "1";
            dc_row["线路"] = rows[0]["LINE_NAME"];
            dc_row["检测里程（Km）"] = rows[0]["KM_NUM"];
            dc_row["受电弓拉弧超标（处）"] = rows[0]["AFBOWNET_CNT"];
            dc_row["接触网温度超标（处）"] = rows[0]["AFOCL_CNT"];
            dc_row["几何参数超限（处）"] = rows[0]["AFJHCS_CNT"];
            dc_row["受电弓隐患（处）"] = rows[0]["AFBOW_CNT"];
            dc_row["其他（处）"] = rows[0]["AFOTHOPS_CNT"];
            dc_row["缺陷合计(处)"] = rows[0]["ALARM_COUNT"];
            dt.Rows.Add(dc_row);

            km_cout_t += rows[0]["KM_NUM"] != DBNull.Value ? Convert.ToDouble(rows[0]["KM_NUM"]) : 0;
            alarm_cout_t += rows[0]["ALARM_COUNT"] != DBNull.Value ? Convert.ToDouble(rows[0]["ALARM_COUNT"]) : 0;
            bownet_cout += rows[0]["AFBOWNET_CNT"] != DBNull.Value ? Convert.ToDouble(rows[0]["AFBOWNET_CNT"]) : 0;
            jcw_cout += rows[0]["AFOCL_CNT"] != DBNull.Value ? Convert.ToDouble(rows[0]["AFOCL_CNT"]) : 0;
            jhcs_cout += rows[0]["AFJHCS_CNT"] != DBNull.Value ? Convert.ToDouble(rows[0]["AFJHCS_CNT"]) : 0;
            bow_cout += rows[0]["AFBOW_CNT"] != DBNull.Value ? Convert.ToDouble(rows[0]["AFBOW_CNT"]) : 0;
            qt_cout += rows[0]["AFOTHOPS_CNT"] != DBNull.Value ? Convert.ToDouble(rows[0]["AFOTHOPS_CNT"]) : 0;
        }

        //最后合计总数
        DataRow total = dt.NewRow();
        total["序号"] = 0;
        total["线路"] = "合计:";
        total["检测里程（Km）"] = Convert.ToString(km_cout_t);
        total["受电弓拉弧超标（处）"] = Convert.ToString(bownet_cout);
        total["接触网温度超标（处）"] = Convert.ToString(jcw_cout);
        total["几何参数超限（处）"] = Convert.ToString(jhcs_cout);
        total["受电弓隐患（处）"] = Convert.ToString(bow_cout);
        total["其他（处）"] = Convert.ToString(qt_cout);
        total["缺陷合计(处)"] = Convert.ToString(alarm_cout_t);
        dt.Rows.Add(total);

        dt.DefaultView.Sort = "序号 ASC";
        dt = dt.DefaultView.ToTable();
        return dt;
    }

    private string GetExcelName(HttpContext context)
    {
        string startDate = HttpContext.Current.Request["startDate"];
        string endDate = HttpContext.Current.Request["endDate"];
        string ju = HttpContext.Current.Request["ju"];
        string juname = HttpContext.Current.Request["juname"];
        string duan = HttpContext.Current.Request["duan"];
        string duanname = HttpContext.Current.Request["duanname"];
        string status = HttpContext.Current.Request["status"];

        DateTime start = Convert.ToDateTime(startDate);
        DateTime end = Convert.ToDateTime(endDate);
        string name = start.Month.ToString() + "月" + start.Day.ToString() + "-" + end.Month.ToString() + "月" + end.Day.ToString() + juname.Replace("全部", "") + duanname.Replace("全部", "") + "动车3C装置检测情况统计表";
        return name;
    }


    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}