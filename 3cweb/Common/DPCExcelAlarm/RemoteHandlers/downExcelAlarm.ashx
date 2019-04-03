<%@ WebHandler Language="C#" Class="downExcelAlarm" %>


using System;
using System.Web;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using Api.ADO.entity;
using System.Data.OracleClient;
using System.IO;
using Api.Util;


public class downExcelAlarm : ReferenceClass, IHttpHandler
{


    public void ProcessRequest(HttpContext context)
    {

        string str = "";
        str = downloadExcel(context);
        string url = "{\"url\":" + "\"" + str.Replace("\\", "\\\\") + "\"" + "}";

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(url);
    }

    public string downloadExcel(HttpContext context)
    {

        string name = GetExcelName(context);
        if (!Directory.Exists(System.Web.HttpContext.Current.Server.MapPath(@"~\TempReport\")))
        {
            DirectoryInfo directoryInfo = new DirectoryInfo(System.Web.HttpContext.Current.Server.MapPath(@"~\TempReport\"));
            directoryInfo.Create();
        }

        string excel = System.Web.HttpContext.Current.Server.MapPath(@"~/TempReport/") + name + ".xls";
        string dir = System.Web.HttpContext.Current.Server.MapPath(@"~/TempReport/") + name;
        if (!Directory.Exists(dir + "\\"))
        {
            DirectoryInfo directoryInfo1 = new DirectoryInfo(dir + "\\");
            directoryInfo1.Create();
        }
        List<string> lis = new List<string>();
        lis.Add(System.Web.HttpContext.Current.Server.MapPath(@"~/TempReport/") + name.Split('\\')[0]);


        System.Data.DataTable dt = GetTable(context);
        dt = ConverToExceldata(dt, dir, name);
        System.Data.DataSet ds = new System.Data.DataSet();
        ds.Tables.Add(dt);

        int[] width = new int[] { 14, 14, 20, 14, 14, 14, 14, 14, 20, 14, 14, 14, 14, 14, 14, 14, 20, 14, 14, 14, 14, 14, 14, 14 };
        Api.Util.PubExcel.SendXls(ds, System.Web.HttpContext.Current.Server.MapPath(@"~/TempReport/"), width, name);
        ZipUtil.CompressMulti(lis, System.Web.HttpContext.Current.Server.MapPath(@"~/TempReport/") + name + ".zip", true);

        PublicMethod.DeleteFolder(excel);
        PublicMethod.DeleteDir(dir);

        return "/TempReport/" + name + ".zip";
    }





    private DataTable GetTable(HttpContext context)
    {
        string CATEGORY_CODE = HttpContext.Current.Request["CATEGORY_CODE"];//1获取检测类型
        string POWER_SECTION_NAME = HttpContext.Current.Request["POWER_SECTION_NAME"];//2供电段名称
        string POWER_SECTION_CODE = HttpContext.Current.Request["POWER_SECTION_CODE"];//3供电段编码
        string LINE_NAME = HttpContext.Current.Request["LINE_NAME"];//4线路名称
        string LINE_CODE = HttpContext.Current.Request["LINE_CODE"];//5线路编码
        string DIRECTION = HttpContext.Current.Request["DIRECTION"];//6行别
        string PROCESS_STATUS = HttpContext.Current.Request["PROCESS_STATUS"];//7处理状态
        double START_KM = -1, END_KM = -1;
        if (!string.IsNullOrEmpty(HttpContext.Current.Request["START_KM"]))
        {
            try
            {
                if (PublicMethod.IsNumeric(HttpContext.Current.Request["START_KM"]))
                    START_KM = Convert.ToDouble(HttpContext.Current.Request["START_KM"]);//8起止公里标 
            }
            catch (Exception ex)
            {
                log4net.ILog log2 = log4net.LogManager.GetLogger("公里标获取出错");
                log2.Error("Error", ex);
            }
        }
        if (!string.IsNullOrEmpty(HttpContext.Current.Request["END_KM"]))
        {
            try
            {
                if (PublicMethod.IsNumeric(HttpContext.Current.Request["END_KM"]))
                    END_KM = Convert.ToDouble(HttpContext.Current.Request["END_KM"]);//9终止公里标
            }
            catch (Exception ex)
            {
                log4net.ILog log3 = log4net.LogManager.GetLogger("公里标获取出错");
                log3.Error("Error", ex);
            }
        }
        string REPORT_PROCESS = HttpContext.Current.Request["REPORT_PROCESS"];//10分析/处理过程
                                                                              //  获取前台页码
        int pageIndex = Convert.ToInt32(HttpContext.Current.Request["page"]);//11
                                                                             // 获取前台条数
        int pageSize = Convert.ToInt32(HttpContext.Current.Request["rp"]);//12
        string strwhere = null;
        if (!string.IsNullOrEmpty(CATEGORY_CODE))//页面传过的参数有org_type且不为空
        {
            strwhere += " AND T.CATEGORY_CODE = '" + CATEGORY_CODE + "'";
        }
        if (!string.IsNullOrEmpty(POWER_SECTION_NAME) && POWER_SECTION_NAME != "全部")
        {
            strwhere += "AND T.POWER_SECTION_NAME = '" + POWER_SECTION_NAME + "'";
        }
        if (!string.IsNullOrEmpty(POWER_SECTION_CODE))
        {
            strwhere += "AND T.POWER_SECTION_CODE = '" + POWER_SECTION_CODE + "'";
        }
        if (!string.IsNullOrEmpty(LINE_NAME) && LINE_NAME != "全部")
        {
            strwhere += " AND T.LINE_NAME = '" + LINE_NAME + "'";
        }
        if (!string.IsNullOrEmpty(LINE_CODE))
        {
            strwhere += " AND T.LINE_CODE = '" + LINE_CODE + "'";
        }
        if (!string.IsNullOrEmpty(DIRECTION))
        {
            strwhere += " AND T.DIRECTION = '" + DIRECTION + "'";
        }
        if (string.IsNullOrEmpty(PROCESS_STATUS))
        {
            strwhere += " AND PROCESS_STATUS in('已销号','未销号')";
        }
        else
        {
            if (PROCESS_STATUS == "已销号")
                strwhere += " AND T.PROCESS_STATUS  ='已销号'";
            else if (PROCESS_STATUS == "未销号")
                strwhere += " AND T.PROCESS_STATUS  ='未销号'";
        }
        DateTime data = new DateTime();//创建dataset对象  data=0；
        if (!string.IsNullOrEmpty(HttpContext.Current.Request["START_DATE"]))// 13起始检测日期
        {
            DateTime START_DATE = DateTime.Parse(HttpContext.Current.Request["START_DATE"]);

            if (START_DATE != data)
            {
                strwhere += " AND T.RAISED_TIME >= to_date ('" + START_DATE.ToString("yyyy/MM/dd HH:mm:ss") + "','yyyy/mm/dd hh24:mi:ss')";
            }
        }
        //14终止检测日期
        if (!string.IsNullOrEmpty(HttpContext.Current.Request["END_DATE"]))
        {
            DateTime END_DATE = DateTime.Parse(HttpContext.Current.Request["END_DATE"]);//enddata

            if (END_DATE != data)
            {
                strwhere += " AND T.RAISED_TIME <= to_date('" + END_DATE.ToString("yyyy/MM/dd HH:mm:ss") + "','yyyy/mm/dd hh24:mi:ss')";
            }
        }
        if (!string.IsNullOrEmpty(START_KM.ToString()) && START_KM != -1)
        {
            strwhere += " AND T.KM_MARK >=" + START_KM;
        }
        if (!string.IsNullOrEmpty(END_KM.ToString()) && END_KM != -1)
        {
            strwhere += " AND T.KM_MARK <=" + END_KM;
        }

        string SEVERITY = HttpContext.Current.Request["SEVERITY"];//缺陷状态
        if (string.IsNullOrEmpty(SEVERITY))
        {
            strwhere += " AND T.SEVERITY in('一类','二类')";
        }
        else
        {
            string s = "";
            if (SEVERITY.Contains(","))
            {
                string[] sev = SEVERITY.Split(',');
                for (int i = 0; i < sev.Count(); i++)
                {
                    s += "'" + Common.sysDictionaryDic[sev[i]].DIC_CODE + "',";
                }
                if (s.LastIndexOf(',') > -1)
                {
                    s = s.Substring(0, s.LastIndexOf(','));
                }
            }
            else
            {
                s += "'" + Common.sysDictionaryDic[SEVERITY].DIC_CODE + "'";
            }
            strwhere += " AND T.SEVERITY IN (" + s + ")";
        }

        if (!string.IsNullOrEmpty(REPORT_PROCESS))
        {
            if (REPORT_PROCESS == "分析过期")
                strwhere += " AND T.REPORT_OVERDUE  ='分析过期'";
            if (REPORT_PROCESS == "处理过期")
                strwhere += " AND T.PROCESS_OVERDUE  ='处理过期'";
        }

        string orgCode = Public.GetDataPermission_workshop();
        if (!string.IsNullOrEmpty(orgCode))
        {
            strwhere += " AND POWER_SECTION_CODE IN (" + Public.Parsing(orgCode) + ")";//数据权限过滤
        }

        System.Data.DataSet ds = new DataSet();
        //int startRowNum = 0, endRowNum = 0;
        //if ((pageIndex != 0) && (pageSize != 0))// 计算翻页的起始与结束行号
        //{
        //    startRowNum = (pageIndex - 1) * pageSize + 1;
        //    endRowNum = startRowNum + pageSize - 1;
        //}
        string sql = "SELECT * FROM(SELECT ROW_NUMBER() OVER (order by T.RAISED_TIME desc )AS RowNO, T.*  from ALARM T ";//先把RAISED_TIME列降序，再为降序以后的每条RAISED_TIME记录返回一个序号
        if (!string.IsNullOrEmpty(strwhere))
        {
            if (!string.IsNullOrEmpty(strwhere.Trim()))
            {
                sql += string.Format(" WHERE 1=1 {0}", strwhere);
            }
        }
        sql += string.Format(" ) TT WHERE 1=1 ");
        string sqlCount = string.Format("SELECT COUNT(1) FROM ALARM T  WHERE 1=1 {0}", strwhere);
        string count;
        object obj = Convert.ToInt32(DbHelperOra_ADO.GetSingle(sqlCount));
        if (obj == null)
            count = "0";
        else
            count = Convert.ToString(obj);
        ds = DbHelperOra_ADO.Query(sql);///数据库连接字符串(web.config来配置)
        return ds.Tables[0];
    }

    private void getStruct(DataTable dt)
    {
        DataColumn dc2 = new DataColumn("序号", Type.GetType("System.String"));
        DataColumn dc3 = new DataColumn("问题来源", Type.GetType("System.String"));
        DataColumn dc4 = new DataColumn("检测监测日期", Type.GetType("System.String"));
        DataColumn dc5 = new DataColumn("线别", Type.GetType("System.String"));
        DataColumn dc6 = new DataColumn("站，区间", Type.GetType("System.String"));
        DataColumn dc7 = new DataColumn("行别", Type.GetType("System.String"));
        DataColumn dc8 = new DataColumn("公里标", Type.GetType("System.String"));
        DataColumn dc9 = new DataColumn("支柱号", Type.GetType("System.String"));
        DataColumn dc10 = new DataColumn("分析日期", Type.GetType("System.String"));
        DataColumn dc11 = new DataColumn("分析人员", Type.GetType("System.String"));
        DataColumn dc12 = new DataColumn("分析部门", Type.GetType("System.String"));
        DataColumn dc13 = new DataColumn("缺陷部位", Type.GetType("System.String"));
        DataColumn dc14 = new DataColumn("缺陷等级", Type.GetType("System.String"));
        DataColumn dc15 = new DataColumn("缺陷描述", Type.GetType("System.String"));
        DataColumn dc16 = new DataColumn("缺陷类型", Type.GetType("System.String"));
        DataColumn dc17 = new DataColumn("责任单位", Type.GetType("System.String"));
        DataColumn dc18 = new DataColumn("复测结果", Type.GetType("System.String"));
        DataColumn dc19 = new DataColumn("整改日期", Type.GetType("System.String"));
        DataColumn dc20 = new DataColumn("处理人", Type.GetType("System.String"));
        DataColumn dc21 = new DataColumn("处理状态", Type.GetType("System.String"));
        DataColumn dc22 = new DataColumn("处理情况/整改情况", Type.GetType("System.String"));
        DataColumn dc23 = new DataColumn("反馈情况/复测情况/现场查看情况", Type.GetType("System.String"));
        DataColumn dc24 = new DataColumn("原因分析", Type.GetType("System.String"));
        DataColumn dc25 = new DataColumn("图片", Type.GetType("System.String"));
        DataColumn dc26 = new DataColumn("表单", Type.GetType("System.String"));


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
        dt.Columns.Add(dc18);
        dt.Columns.Add(dc19);
        dt.Columns.Add(dc20);
        dt.Columns.Add(dc21);
        dt.Columns.Add(dc22);
        dt.Columns.Add(dc23);
        dt.Columns.Add(dc24);
        dt.Columns.Add(dc25);
        dt.Columns.Add(dc26);
    }

    public DataTable ConverToExceldata(DataTable dt, string dir, string name)
    {
        DataTable excel = new DataTable();
        getStruct(excel);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            try
            {
                DataRow dr = excel.NewRow();
                dr["序号"] = i + 1;
                dr["问题来源"] = dt.Rows[i]["CATEGORY_CODE"];
                dr["检测监测日期"] = converDateTime(dt.Rows[i]["RAISED_TIME"].ToString());
                dr["线别"] = dt.Rows[i]["LINE_NAME"];
                dr["站，区间"] = dt.Rows[i]["POSITION_NAME"];
                dr["行别"] = dt.Rows[i]["DIRECTION"];
                dr["公里标"] = PublicMethod.IsNumeric(dt.Rows[i]["KM_MARK"].ToString()) ? Double.Parse(dt.Rows[i]["KM_MARK"].ToString()) / 1000 : 0;
                dr["支柱号"] = dt.Rows[i]["POLE_NUMBER"];
                dr["分析日期"] = converDateTime(dt.Rows[i]["REPORT_DATE"].ToString());
                dr["分析人员"] = dt.Rows[i]["REPORT_PERSON"];
                dr["分析部门"] = dt.Rows[i]["REPORT_DEPTNAME"];
                dr["缺陷部位"] = dt.Rows[i]["DEV_NAME"];
                dr["缺陷等级"] = dt.Rows[i]["SEVERITY"];
                dr["缺陷描述"] = dt.Rows[i]["ALARM_ANALYSIS"];
                dr["缺陷类型"] = dt.Rows[i]["CODE_NAME"];
                dr["责任单位"] = dt.Rows[i]["PROCESS_DEPTNAME"];
                dr["复测结果"] = dt.Rows[i]["CHECK_RESULT"];
                dr["整改日期"] = converDateTime(dt.Rows[i]["PROCESS_DATE"].ToString());
                dr["处理人"] = dt.Rows[i]["PROCESS_PERSON"];
                dr["处理状态"] = dt.Rows[i]["PROCESS_STATUS"];
                dr["处理情况/整改情况"] = dt.Rows[i]["PROCESS_DETAILS"];
                dr["反馈情况/复测情况/现场查看情况"] = dt.Rows[i]["CHECK_DETAILS"];
                dr["原因分析"] = dt.Rows[i]["ALARM_REASON"];
                dr["图片"] = MoveFile(dt.Rows[i], dir, name, "ATTACHMENT");
                dr["表单"] = MoveFile(dt.Rows[i], dir, name, "SVALUE14");
                excel.Rows.Add(dr);
            }
            catch (Exception ex)
            {
                log4net.ILog log2 = log4net.LogManager.GetLogger("获取问题库数据报错");
                log2.Error("Error", ex);
            }
        }
        return excel;
    }


    private string GetExcelName(HttpContext context)
    {
        return DateTime.Now.ToString("yyyyMMdd_HHmmss") + "\\" + "缺陷问题库";
    }

    public string MoveFile(DataRow row, string dir, string name, string rowname)
    {
        string str = "";
        string filename = row[rowname].ToString();
        string path = row["DIR_PATH"].ToString();
        try
        {
            if (row["CATEGORY_CODE"].ToString() != "3C")
            {
                if (!string.IsNullOrEmpty(filename))
                {
                    string[] file_lis = filename.Replace("\\", "/").Split(';');
                    for (int i = 0; i < file_lis.Count(); i++)
                    {
                        FileInfo file = new FileInfo(System.Web.HttpContext.Current.Server.MapPath("~/" + file_lis[i]));
                        if (file.Exists)
                        {
                            file.CopyTo(dir + (file_lis[i].Substring(0, 1) == "\\" ? "" : "\\") + file_lis[i].Substring(file_lis[i].LastIndexOf("/") + 1, (file_lis[i].Length - file_lis[i].LastIndexOf("/") - 1)));
                            str += name + (file_lis[i].Substring(0, 1) == "\\" ? "" : "\\") + file_lis[i].Substring(file_lis[i].LastIndexOf("/") + 1, (file_lis[i].Length - file_lis[i].LastIndexOf("/") - 1)) + ";";
                        }
                    }
                }
            }
            else//如果是3C不取附件，只取可见光
            {
                string file_path = Convert_Url(row["SVALUE5"].ToString());
                FileInfo file = new FileInfo(System.Web.HttpContext.Current.Server.MapPath("~/" + path.Replace("\\", "/") + "/" + file_path));
                if (file.Exists)
                {
                    file.CopyTo(dir + (file_path.Substring(0, 1) == "\\" ? "" : "\\") + file_path.Replace("/", "_"));
                    str += name + (file_path.Substring(0, 1) == "\\" ? "" : "\\") + file_path.Replace("/", "_") + ";";
                }
            }
        }
        catch (Exception EX)
        {
            log4net.ILog log2 = log4net.LogManager.GetLogger("附件复制到压缩包报错");
            log2.Error("Error", EX);
        }
        return str;
    }

    public string converDateTime(string date)
    {
        string str = "";
        try
        {
            DateTime time = new DateTime();
            if (!string.IsNullOrEmpty(date))
                if (Convert.ToDateTime(date) != time)
                    str = Convert.ToDateTime(date).ToString("yyyy/MM/dd");
        }
        catch (Exception ex)
        {
            log4net.ILog log2 = log4net.LogManager.GetLogger("时间格式处理");
            log2.Error("Error", ex);
        }
        return str;
    }

    public string Convert_Url(string re)
    {
        if (re == null)
        {
            return null;
        }
        else
        {
            return re.Replace("#", "%23");
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