<%@ WebHandler Language="C#" Class="GisQuery" %>

using System;
using System.Data;
using System.Web;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using Api.Fault.entity.sms;

public class GisQuery : ReferenceClass, IHttpHandler
{
    
    public void ProcessRequest (HttpContext context) {
        try
        {
            // 获取操作类型
            string opType = Convert.ToString(HttpContext.Current.Request["type"]).TrimEnd(' ');
            // 查询操作
            if ("query" == opType)
            {
                queryGis();
            }
            // 导出到Excel操作
            if ("export" == opType)
            {
                export2Excel();
            }
        }
        catch
        {
            
        }
    }
    /// <summary>
    /// 根据操作类型获取查询数据的条件
    /// </summary>
    /// <param name="opType">操作类型</param>
    /// <returns>查询条件</returns>
    private C3_SmsCond getQueyCond(string opType)
    {
        int pageIndex = 0;
        int pageSize = 0;
        
        try
        {
            // 获取设备号
            string locoCode = Convert.ToString(HttpContext.Current.Request["LOCOMOTIVE_CODE"]);
            // 获取跑车日期
            string runningDate = Convert.ToString(HttpContext.Current.Request["RUNNING_DATE"]);
            if ("query" == opType)
            {
                // 获取前台表格页码
                pageIndex = Convert.ToInt32(HttpContext.Current.Request["page"]);
                // 获取前台表格条数
                pageSize = Convert.ToInt32(HttpContext.Current.Request["rp"]);
            }
            // 查询条件
            C3_SmsCond cond = new C3_SmsCond();
            cond.page = pageIndex;
            cond.pageSize = pageSize;
            cond.LOCOMOTIVE_CODE = locoCode;
            cond.startTime = DateTime.ParseExact(runningDate, "yyyy-MM-dd", null).AddMilliseconds(1d);
            cond.endTime = cond.startTime.Date.AddDays(1).AddMilliseconds(-1d);
            return cond;
        }
        catch
        {
            return new C3_SmsCond();
        }
    }
    /// <summary>
    /// 执行GIS查询
    /// </summary>
    private void queryGis()
    {
        C3_SmsCond cond = getQueyCond("query");
        int sequeceStart = (cond.page - 1) * cond.pageSize;
        int pageIndex = cond.page;
        int pageSize = cond.pageSize;
        // 获取SMS数据的总条数
        int totalCnt = Api.ServiceAccessor.GetSmsService().getC3SmsCount(cond);
        // 查询SMS数据
        IList<C3_Sms> list = Api.ServiceAccessor.GetSmsService().getC3SmsbyCondition(cond);
        
        int idx = 0;
        // 组合返回的JSON串
        string retJsonStr = "{'rows':[";
        // 获取表格内容
        foreach (C3_Sms sms in list)
        {
            ++idx;
            retJsonStr += "{'SEQUENCE_NO':'" + (sequeceStart + idx) + "','LOCOMOTIVE_CODE':'" + sms.LOCOMOTIVE_CODE
                + "','RUNNING_DATE':'" + sms.DETECT_TIME.ToString("yyyy-MM-dd HH:mm:ss") + "','GIS_LON':'E:"
                + sms.GIS_LON.ToString() + "','GIS_LAT':'N:" + sms.GIS_LAT.ToString() + "'}";
            if (idx < list.Count)
            {
                retJsonStr += ",";
            }
        }
        retJsonStr += "],'page':" + pageIndex + ",'rp':" + pageSize + ",'total':" + totalCnt + "}";
        retJsonStr = retJsonStr.Replace("'", "\"");

        HttpContext.Current.Response.Write(retJsonStr);
        
        
    }
    /// <summary>
    /// 将GIS查询结果转存到DataTable中
    /// </summary>
    /// <param name="list">GIS查询结果</param>
    /// <returns>转存后的DataTable</returns>
    private DataTable convertList2DataTable(IList<C3_Sms> list)
    {
        DataTable dt = new DataTable();
        dt.Columns.Add("序号");
        dt.Columns.Add("设备编号");
        dt.Columns.Add("运行时间");
        dt.Columns.Add("经度");
        dt.Columns.Add("纬度");

        int idx = 0;
        foreach (C3_Sms sms in list)
        {
            DataRow dr = dt.NewRow();
            ++idx;
            dr["序号"] = idx.ToString();
            dr["设备编号"] = sms.LOCOMOTIVE_CODE; ;
            dr["运行时间"] = sms.DETECT_TIME.ToString("yyyy-MM-dd HH:mm:ss");
            dr["经度"] = "E:" + sms.GIS_LON.ToString();
            dr["纬度"] = "N:" + sms.GIS_LAT.ToString();
            dt.Rows.Add(dr);
        }

        return dt;
    }
    /// <summary>
    /// 将GIS查询结果导出到Excel
    /// </summary>
    private void export2Excel()
    {
        C3_SmsCond cond = getQueyCond("export");
        // 查询SMS数据
        IList<C3_Sms> list = Api.ServiceAccessor.GetSmsService().getC3SmsbyCondition(cond);
        // 转存数据
        DataTable dt = convertList2DataTable(list);
        // 指定Excel存储位置
        string destFolder = ConfigurationManager.AppSettings["GisQryResult2ExelFolder"].ToString();
        if (!Directory.Exists(destFolder))
        {
            Directory.CreateDirectory(destFolder);
        }
        string fileName = cond.LOCOMOTIVE_CODE + "_" + cond.startTime.Date.ToString("yyyyMMdd") + ".xls";
        string fileFullPath = destFolder + Path.DirectorySeparatorChar + fileName;
        // 转存
        bool result = Api.Util.ExcelUtil.saveDataTableToExcel(dt, fileFullPath);

        if (result)
        {
            string responseStr = (ConfigurationManager.AppSettings["GisQryResult2ExcelVFolder"].ToString()
                + Path.DirectorySeparatorChar + fileName).Replace('\\', '/');
            HttpContext.Current.Response.Write(responseStr);
        }
        else
        {
            HttpContext.Current.Response.Write("");
        }
        
        
    }
    
    public bool IsReusable {
        get {
            return false;
        }
    }

}