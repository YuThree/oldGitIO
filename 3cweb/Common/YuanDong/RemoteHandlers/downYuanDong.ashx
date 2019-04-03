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
using System.Text;
using Api.Foundation.entity.Foundation;


public class downExcelAlarm : ReferenceClass, IHttpHandler
{
    public void ProcessRequest(HttpContext context)
    {
        string str = "";//传给前端的下载地址
        str = downloadExcel(context);
        string url = "{\"url\":" + "\"" + str.Replace("\\", "\\\\") + "\"" + "}";

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(url);
    }

    public string downloadExcel(HttpContext context)
    {
        string name = GetExcelName(context);
        //指定虚拟路径对应的物理文件路径不存在时，创建该目录（目录中创建"TempFile"）
        if (!Directory.Exists(System.Web.HttpContext.Current.Server.MapPath(@"~\TempFile\")))
        {
            DirectoryInfo directoryInfo = new DirectoryInfo(System.Web.HttpContext.Current.Server.MapPath(@"~\TempFile\"));
            directoryInfo.Create();
        }

        string excel = System.Web.HttpContext.Current.Server.MapPath(@"~/TempFile/") + name + ".xls";
        string dir = System.Web.HttpContext.Current.Server.MapPath(@"~/TempFile/") + name;
        //若文件夹不存在，创建该文件夹
        if (!Directory.Exists(dir + "\\"))
        {
            DirectoryInfo directoryInfo1 = new DirectoryInfo(dir + "\\");
            directoryInfo1.Create();
        }
        List<string> lis = new List<string>();
        lis.Add(System.Web.HttpContext.Current.Server.MapPath(@"~/TempFile/") + name.Split('\\')[0]);

        System.Data.DataTable dt = GetTable(context);
        dt = ConverToExceldata(dt, dir, name);
        System.Data.DataSet ds = new System.Data.DataSet();
        ds.Tables.Add(dt);

        //Excel每列宽度
        int[] width = new int[] { 14, 20, 14, 14, 14, 30, 14, 14, 20, 14, 30, 14 };
        //生成Excel
        Api.Util.PubExcel.SendXls(ds, System.Web.HttpContext.Current.Server.MapPath(@"~/TempFile/"), width, name);
        //压缩目录
        ZipUtil.CompressMulti(lis, System.Web.HttpContext.Current.Server.MapPath(@"~/TempFile/") + name + ".zip", true);

        PublicMethod.DeleteFolder(excel);//压缩后删除文件
        PublicMethod.DeleteDir(dir);//压缩后删除目录（文件夹）

        return "/TempFile/" + name + ".zip";
    }

    private DataTable GetTable(HttpContext context)
    {
        System.Data.DataSet ds = new DataSet();
        StringBuilder strWhere = new StringBuilder("");//查询条件
        if (!String.IsNullOrEmpty(HttpContext.Current.Request["question_classify"]))//问题分类
        {
            string question_classify = HttpContext.Current.Request["question_classify"];
            strWhere.AppendFormat(" AND QUESTION_CLASSIFY = '{0}'", question_classify);
        }
        if (!String.IsNullOrEmpty(HttpContext.Current.Request["lv"]))//问题等级
        {
            string lv = HttpContext.Current.Request["lv"];
            strWhere.AppendFormat(" AND LV = '{0}'", lv);
        }
        if (!String.IsNullOrEmpty(HttpContext.Current.Request["major_classify"]))//专业分类
        {
            string major_classify = HttpContext.Current.Request["major_classify"];
            strWhere.AppendFormat(" AND MAJOR_CLASSIFY = '{0}'", major_classify);
        }
        if (!String.IsNullOrEmpty(HttpContext.Current.Request["location"]))//处所
        {
            string location = HttpContext.Current.Request["location"];
            strWhere.AppendFormat(" AND LOCATION LIKE '%{0}%'", location);
        }
        if (!String.IsNullOrEmpty(HttpContext.Current.Request["duty_units"]))//负责单位
        {
            string duty_units = HttpContext.Current.Request["duty_units"];
            strWhere.AppendFormat(" AND DUTY_UNITS LIKE '%{0}%'", duty_units);
        }
        if (!String.IsNullOrEmpty(HttpContext.Current.Request["process_status"]))//销号状态
        {
            string process_status = HttpContext.Current.Request["process_status"];
            strWhere.AppendFormat(" AND PROCESS_STATUS = '{0}'", process_status);
        }
        if (!string.IsNullOrEmpty(HttpContext.Current.Request["start_date"]) && HttpContext.Current.Request["start_date"] != "0001/1/1 0:00:00")//起始日期
        {
            DateTime start_date = DateTime.Parse(HttpContext.Current.Request["start_date"]);
            strWhere.AppendFormat(" AND HAPPEN_DATE >= TO_DATE('{0}','yyyy/mm/dd hh24:mi:ss')", start_date.ToString("yyyy/MM/dd HH:mm:ss"));
        }
        if (!string.IsNullOrEmpty(HttpContext.Current.Request["end_date"]) && HttpContext.Current.Request["end_date"] != "0001/1/1 0:00:00")//终止日期
        {
            DateTime end_date = DateTime.Parse(HttpContext.Current.Request["end_date"]);
            strWhere.AppendFormat(" AND HAPPEN_DATE <= TO_DATE('{0}','yyyy/mm/dd hh24:mi:ss')", end_date.ToString("yyyy/MM/dd HH:mm:ss"));
        }
        strWhere.Append(" AND PROCESS_STATUS IS NOT NULL ");

          string orgCode = Public.GetDataPermission_workshop();
        if (!string.IsNullOrEmpty(orgCode))
        {
            strWhere.AppendFormat(" AND INSTR(DUTY_UNITS_CODE,'{0}')>0", orgCode);//数据权限过滤
        }

        string selectsql = string.Format("SELECT * FROM ALARM_TELEMECHANIC T WHERE 1=1 {0} ORDER BY happen_date DESC", strWhere);
        //获取总条数
        ds = DbHelperOra_ADO.Query(selectsql);
        return ds.Tables[0];
    }

    private void getStruct(DataTable dt)
    {
        DataColumn dc2 = new DataColumn("序号", Type.GetType("System.String"));
        DataColumn dc3 = new DataColumn("日期", Type.GetType("System.String"));
        DataColumn dc4 = new DataColumn("处所", Type.GetType("System.String"));
        DataColumn dc5 = new DataColumn("问题分类", Type.GetType("System.String"));
        DataColumn dc6 = new DataColumn("专业分类", Type.GetType("System.String"));
        DataColumn dc7 = new DataColumn("问题内容", Type.GetType("System.String"));
        DataColumn dc8 = new DataColumn("问题等级", Type.GetType("System.String"));
        DataColumn dc9 = new DataColumn("责任单位", Type.GetType("System.String"));
        DataColumn dc10 = new DataColumn("整改日期", Type.GetType("System.String"));
        DataColumn dc11 = new DataColumn("处理人", Type.GetType("System.String"));
        DataColumn dc12 = new DataColumn("问题原因", Type.GetType("System.String"));
        DataColumn dc13 = new DataColumn("问题处理详情", Type.GetType("System.String"));
        DataColumn dc14 = new DataColumn("销号状态", Type.GetType("System.String"));
        DataColumn dc15 = new DataColumn("整改前图片", Type.GetType("System.String"));
        DataColumn dc16 = new DataColumn("整改后图片", Type.GetType("System.String"));


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
                dr["日期"] = dt.Rows[i]["HAPPEN_DATE"].ToString().Substring(0,10);
                dr["处所"] = dt.Rows[i]["LOCATION"];
                dr["问题分类"] = dt.Rows[i]["QUESTION_CLASSIFY"];
                dr["专业分类"] = dt.Rows[i]["MAJOR_CLASSIFY"];
                dr["问题内容"] = dt.Rows[i]["CONTENT"];
                dr["问题等级"] = dt.Rows[i]["LV"];
                dr["责任单位"] = dt.Rows[i]["DUTY_UNITS"];
                dr["整改日期"] = dt.Rows[i]["RECTIFY_DATE"].ToString().Substring(0,10);
                dr["处理人"] = dt.Rows[i]["HANDLER"];
                dr["问题原因"] = dt.Rows[i]["CAUSE"];
                dr["问题处理详情"] = dt.Rows[i]["ACCESSORY"];
                dr["销号状态"] = dt.Rows[i]["PROCESS_STATUS"];
                dr["整改前图片"] = MoveFile(dt.Rows[i], dir, name,"整改前");
                dr["整改后图片"] = MoveFile(dt.Rows[i], dir, name, "整改后");
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
        return DateTime.Now.ToString("yyyyMMdd_HHmmss") + "\\" + "远动问题库";
    }
    /// <summary>
    /// 复制附件到新文件夹
    /// </summary>
    /// <param name="row">数据库中的附件名</param>
    /// <param name="dir">附件下载的路径（虚拟和物理）</param>
    /// <param name="name"></param>
    /// <returns>附件在新文件夹中的地址</returns>
    public string MoveFile(DataRow row, string dir, string name,string type)
    {
        string str = "";
        string filename = "";
        if (type == "整改前")
        {
            filename = row["BEFORE_REPAIR_PIC"].ToString();
        }
        else
        {
            filename = row["AFTER_REPAIR_PIC"].ToString();
        }
        try
        {
            if (!string.IsNullOrEmpty(filename))
            {
                FileInfo file = new FileInfo(System.Web.HttpContext.Current.Server.MapPath("~/" + filename));
                if (file.Exists)
                {
                    file.CopyTo(dir+"\\"+filename.Substring(filename.LastIndexOf("/")+1,filename.Length-filename.LastIndexOf("/")-1));
                    str =name+ filename.Substring(filename.LastIndexOf("/"),filename.Length-filename.LastIndexOf("/")).Replace("/","\\");
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
                    str = Convert.ToDateTime(date).ToString("yyyy/MM/dd HH:mm:ss");
        }
        catch (Exception ex)
        {
            log4net.ILog log2 = log4net.LogManager.GetLogger("时间格式处理");
            log2.Error("Error", ex);
        }
        return str;
    }
    /// <summary>
    /// 根据组织机构名获取编码
    /// </summary>
    /// <param name="orgname"></param>
    /// <returns></returns>
    public static Organization GetOrgByCodeName(string orgname)
    {
        Organization re = new Organization();
        if (!string.IsNullOrEmpty(orgname))
        {
            Organization[] sd = Api.Util.Common.organizationDic.Values.ToArray();
            IList<Organization> dicList = (from l in sd where l.ORG_NAME == orgname select l).ToArray();
            if (dicList.Count > 0)
            {
                re = dicList[0];
            }
        }
        return re;
    }
    /// <summary>
    /// 获取多个组织机构编码
    /// </summary>
    /// <param name="orgname"></param>
    /// <returns></returns>
    public static string getOrgCode(string orgname)
    {
        string orgcode = "";
        if (!string.IsNullOrEmpty(orgname))
        {
            if (orgname.IndexOf(',') > -1)
            {
                string[] name = orgname.Split(',');
                for (int i = 0; i < name.Count(); i++)
                {
                    if (!string.IsNullOrEmpty(name[i]))
                        orgcode += GetOrgByCodeName(name[i]).ORG_CODE + ",";
                }
                if (orgcode.LastIndexOf(',') > -1)
                {
                    orgcode = orgcode.Substring(0, orgcode.LastIndexOf(','));
                }
            }
            else
            {
                orgcode = GetOrgByCodeName(orgname).ORG_CODE;
            }
        }
        return orgcode;
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}