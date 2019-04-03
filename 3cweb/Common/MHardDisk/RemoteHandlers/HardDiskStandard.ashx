<%@ WebHandler Language="C#" Class="HardDiskStandard" %>

using System;
using System.Web;
using System.Linq;
using System.Collections.Generic;
using System.Data;

public class HardDiskStandard : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        string type = HttpContext.Current.Request["active"];
        switch (type)
        {
            case "GetList":
                GetList(context);
                break;
            case "GetStatus":
                GetStatus(context);
                break;
        }

    }


    private void GetList(HttpContext context)
    {
        string starttime = context.Request["starttime"];//开始时间
        DateTime startDate = new DateTime();
        DateTime endDate = new DateTime();
        if (!string.IsNullOrEmpty(starttime))
        {
            DateTime time = Convert.ToDateTime(starttime);//开始时间
            startDate = time.AddDays(1 - time.Day);  //本月月初  
            endDate = startDate.AddMonths(1).AddSeconds(-1);  //本月月末  
        }
        int pageSize = string.IsNullOrEmpty(context.Request["pagesize"]) ? 20 : Convert.ToInt32(context.Request["pagesize"]);
        int pageIndex = string.IsNullOrEmpty(context.Request["pageindex"]) ? 1 : Convert.ToInt32(context.Request["pageindex"]);
        string line_code = context.Request["line_Code"];//线路
        string direction = context.Request["direction_Code"];//行别
        string org_code = context.Request["ddlorg_Code"];//组织机构   
        string org_type = context.Request["ddlorg_Type"];//组织级别

        string strwhere = GetStrwhere(startDate, endDate, line_code, direction, org_code, org_type, "", "");

        //数据访问
        DataTable dt = ADO.HardDiskData.GetHardLineStandard(strwhere);
        //  List<PosiStandard> posi = HardDiskLineStandard.ModelConvertHelper<PosiStandard>.ConvertToModel(dt);
        //  List<LineStandard> lines = GetLineStandard(posi);
        List<LineStandard> lines = HardDiskLineStandard.ModelConvertHelper<LineStandard>.ConvertToModel(dt);

        //json拼接
        System.Text.StringBuilder json = GetJson(lines, pageSize, pageIndex);

        context.Response.ContentType = "application/json";
        context.Response.Write(json);
    }


    public void GetStatus(HttpContext context)
    {
        string line_code = context.Request["line_Code"];//线路
        string direction = context.Request["direction_Code"];//行别
        string bureauc_code = context.Request["bureauc_code"];//组织机构   
        string org_code = context.Request["org_code"];//组织级别
        DateTime time = Convert.ToDateTime(context.Request["month"]);//月份
        DateTime startDate = time.AddDays(1 - time.Day);  //本月月初  
        DateTime endDate = startDate.AddMonths(1).AddSeconds(-1);  //本月月末  

        string strwhere = GetStrwhere(startDate, endDate, line_code, direction, "", "", bureauc_code, org_code);
        //数据访问
        DataTable dt = ADO.HardDiskData.GetHardLineStandard(strwhere);
        List<LineStandard> lines = HardDiskLineStandard.ModelConvertHelper<LineStandard>.ConvertToModel(dt);
        bool result = true;
        foreach (LineStandard line in lines)
        {
            if (line.STATUS == "WAIT")
            {
                result = false;
                break;
            }
        }


        System.Text.StringBuilder json = new System.Text.StringBuilder();
        json.Append( "{\"data\":\""+result.ToString()+"\"}");

        context.Response.ContentType = "application/json";
        context.Response.Write(json);

    }

    //private List<LineStandard> GetLineStandard(List<PosiStandard> posilis)
    //{
    //    List<LineStandard> lines = new List<LineStandard>();
    //    for (int i = 0; i < posilis.Count; i++)
    //    {
    //        if (i == 0)
    //        {
    //            LineStandard line = new global::LineStandard();
    //            line.LINE_CODE = posilis[i].LINE_CODE;
    //            line.LINE_NAME = posilis[i].LINE_NAME;
    //            line.ORDER = posilis[i].POSITION_ORDER;
    //            line.ORG_CODE = posilis[i].ORG_CODE;
    //            line.ORG_NAME = posilis[i].ORG_NAME;
    //            line.START_TIMESTAMP_IRV = posilis[i].START_TIMESTAMP_IRV;
    //            line.END_TIMESTAMP_IRV = posilis[i].END_TIMESTAMP_IRV;
    //            line.BUREAU_CODE = posilis[i].BUREAU_CODE;
    //            line.BUREAU_NAME = posilis[i].BUREAU_NAME;
    //            line.DIRECTION = posilis[i].DIRECTION;
    //            lines.Add(line);
    //        }
    //        else if (i == posilis.Count - 1)
    //        {

    //        }
    //        else
    //        {
    //            if (posilis[i].ORG_CODE != posilis[i + 1].ORG_CODE || posilis[i].DIRECTION != posilis[i + 1].DIRECTION || posilis[i].LINE_CODE != posilis[i + 1].LINE_CODE)
    //            {
    //                LineStandard line = new global::LineStandard();
    //                line.LINE_CODE = posilis[i + 1].LINE_CODE;
    //                line.LINE_NAME = posilis[i + 1].LINE_NAME;
    //                line.ORDER = posilis[i + 1].POSITION_ORDER;
    //                line.ORG_CODE = posilis[i + 1].ORG_CODE;
    //                line.ORG_NAME = posilis[i + 1].ORG_NAME;
    //                line.START_TIMESTAMP_IRV = posilis[i + 1].START_TIMESTAMP_IRV;
    //                line.END_TIMESTAMP_IRV = posilis[i + 1].END_TIMESTAMP_IRV;
    //                line.BUREAU_CODE = posilis[i + 1].BUREAU_CODE;
    //                line.BUREAU_NAME = posilis[i + 1].BUREAU_NAME;
    //                line.DIRECTION = posilis[i + 1].DIRECTION;
    //                lines.Add(line);
    //            }
    //        }
    //    }
    //    return lines;
    //}



    private System.Text.StringBuilder GetJson(List<LineStandard> lines, int pageSize, int pageIndex)
    {
        int startRownum = (pageIndex - 1) * pageSize + 1;//开始行号
        int endRownum = pageSize * pageIndex;//结束行号

        var lines_total = lines.GroupBy(x => new {x.MON, x.LINE_CODE, x.DIRECTION }).Select(g => g.ToList()).ToList();
        List<List<LineStandard>> lines_total_bak = new List<List<LineStandard>>();

        foreach (List<LineStandard> lines_ in lines_total)
        {
            if (lines_total.IndexOf(lines_) + 1 >= startRownum && lines_total.IndexOf(lines_) + 1 <= endRownum)
            {
                lines_total_bak.Add(lines_);
            }
        }



        System.Text.StringBuilder json = new System.Text.StringBuilder();
        if (lines.Count == 0)
        {
            json.Append("{\"data\":[],\"total_Rows\":\"0\",\"pageIndex\":\"0\",\"pageSize\":\"0\",\"pageOfTotal\":\"1/1\",\"pageRange\":\"0~0\",\"Current_pagesize\":\"0\",\"totalPages\":\"1\"}");
        }
        else
        {
            DateTime dtStart = TimeZone.CurrentTimeZone.ToLocalTime(new DateTime(1970, 1, 1, 0, 0, 0));

            json.Append("{\"data\":[");
            foreach (List<LineStandard> lines_bak in lines_total_bak)
            {
                int a = 0;
                json.Append("{\"line_code\":\"");
                json.Append((lines_bak[0].LINE_CODE == "" ? "-" : lines_bak[0].LINE_CODE) + "\",");
                json.Append("\"line_name\":\"");
                json.Append((lines_bak[0].LINE_NAME == "" ? "-" : lines_bak[0].LINE_NAME) + "\",");
                json.Append("\"direction\":\"");
                json.Append((lines_bak[0].DIRECTION == "" ? "-" : lines_bak[0].DIRECTION) + "\",");
                json.Append("\"date\":\"");
                json.Append((lines_bak[0].MON.ToString("yyyy-MM")) + "\",");

                var bureaus = lines_bak.GroupBy(x => new { x.BUREAU_CODE, }).Select(g => g.ToList()).ToList();

                json.Append("\"bureau_count\":\"");
                json.Append(bureaus.Count.ToString() + "\",");
                json.Append("\"bureau_list\":[");

                foreach (List<LineStandard> bureau in bureaus)
                {
                    int b = 0;
                    json.Append("{\"line_code\":\"");
                    json.Append((bureau[0].LINE_CODE == "" ? "-" : bureau[0].LINE_CODE) + "\",");
                    json.Append("\"line_name\":\"");
                    json.Append((bureau[0].LINE_NAME == "" ? "-" : bureau[0].LINE_NAME) + "\",");
                    json.Append("\"direction\":\"");
                    json.Append((bureau[0].DIRECTION == "" ? "-" : bureau[0].DIRECTION) + "\",");
                    json.Append("\"bureau_code\":\"");
                    json.Append((bureau[0].BUREAU_CODE == "" ? "-" : bureau[0].BUREAU_CODE) + "\",");
                    json.Append("\"bureau_name\":\"");
                    json.Append((bureau[0].BUREAU_NAME == "" ? "-" : bureau[0].BUREAU_NAME) + "\",");

                    var orgs = bureau.GroupBy(x => new { x.POWER_SECTION_CODE, }).Select(g => g.ToList()).ToList();

                    json.Append("\"org_count\":\"");
                    json.Append(orgs.Count.ToString() + "\",");
                    json.Append("\"org_list\":[");

                    foreach (List<LineStandard> org in orgs)
                    {
                        json.Append("{\"line_code\":\"");
                        json.Append((org[0].LINE_CODE == "" ? "-" : org[0].LINE_CODE) + "\",");
                        json.Append("\"line_name\":\"");
                        json.Append((org[0].LINE_NAME == "" ? "-" : org[0].LINE_NAME) + "\",");
                        json.Append("\"direction\":\"");
                        json.Append((org[0].DIRECTION == "" ? "-" : org[0].DIRECTION) + "\",");
                        json.Append("\"bureau_code\":\"");
                        json.Append((org[0].BUREAU_CODE == "" ? "-" : org[0].BUREAU_CODE) + "\",");
                        json.Append("\"bureau_name\":\"");
                        json.Append((org[0].BUREAU_NAME == "" ? "-" : org[0].BUREAU_NAME) + "\",");
                        json.Append("\"org_code\":\"");
                        json.Append((org[0].POWER_SECTION_CODE == "" ? "-" : org[0].POWER_SECTION_CODE) + "\",");
                        json.Append("\"org_name\":\"");
                        json.Append((org[0].ORG_NAME == "" ? "-" : org[0].ORG_NAME) + "\"},");

                        b++;
                        if (b == orgs.Count)
                        {
                            json.Remove(json.Length - 1, 1);
                            json.Append("]},");
                        }
                    }

                    a++;
                    if (a == bureaus.Count)
                    {
                        json.Remove(json.Length - 1, 1);
                        json.Append("]},");
                    }
                }
            }
            json.Remove(json.Length - 1, 1);
            json.Append("]");
            PageHelper page = new PageHelper();
            string pagejson = page.getPageJson(lines_total.Count, Convert.ToInt32(pageIndex), Convert.ToInt32(pageSize));//拼接分页数据
            json.Append("," + pagejson + "}");

        }
        return json;
    }



    private string GetStrwhere(DateTime startTimestamp, DateTime endTimestamp, string line_code, string direction, string org_code, string org_type, string bureau_code, string power_code)
    {
        DateTime time = new DateTime();
        string strwhere = " ";
        if (startTimestamp != time)
        {
            strwhere += " AND A.MON>=TO_DATE('" + startTimestamp.ToString("yyyy/MM/dd HH:mm:ss") + "','yyyy/MM/dd HH24:mi:ss')";
        }
        if (endTimestamp != time)
        {
            strwhere += " AND A.MON<=TO_DATE('" + endTimestamp.ToString("yyyy/MM/dd HH:mm:ss") + "','yyyy/MM/dd HH24:mi:ss')";
        }
        if (!string.IsNullOrEmpty(line_code))
        {
            strwhere += " AND A.LINE_CODE ='" + line_code + "'";
        }
        if (!string.IsNullOrEmpty(direction))
        {
            strwhere += " AND A.DIRECTION ='" + direction + "'";
        }
        if (!string.IsNullOrEmpty(org_type))
        {
            if (org_type == "J")
                strwhere += " AND A.BUREAU_CODE ='" + org_code + "'";
            else if (org_type == "GDD")
                strwhere += " AND A.POWER_SECTION_CODE ='" + org_code + "'";
        }
        if (!string.IsNullOrEmpty(bureau_code))
        {
            strwhere += " AND A.BUREAU_CODE ='" + bureau_code + "'";
        }
        if (!string.IsNullOrEmpty(power_code))
        {
            strwhere += " AND A.POWER_SECTION_CODE ='" + power_code + "'";
        }


        return strwhere;
    }


    public bool IsReusable
    {
        get
        {
            return false;
        }
    }


}



public class LineStandard
{
    /// <summary>
    /// 开始时间戳
    /// </summary>
    public long START_TIMESTAMP_IRV;
    /// <summary>
    /// 结束时间戳
    /// </summary>
    public long END_TIMESTAMP_IRV;
    /// <summary>
    /// 线路编码
    /// </summary>
    public string LINE_CODE;
    /// <summary>
    /// 线路名
    /// </summary>
    public string LINE_NAME;
    /// <summary>
    /// 行别
    /// </summary>
    public string DIRECTION;
    /// <summary>
    /// 序号
    /// </summary>
    public string ORDER;
    /// <summary>
    /// 局编码
    /// </summary>
    public string BUREAU_CODE;
    /// <summary>
    /// 局名
    /// </summary>
    public string BUREAU_NAME;
    /// <summary>
    /// 段编码
    /// </summary>
    public string POWER_SECTION_CODE;
    /// <summary>
    /// 段名
    /// </summary>
    public string ORG_NAME;
    /// <summary>
    /// 状态
    /// </summary>
    public string STATUS;
    /// <summary>
    /// 日期
    /// </summary>
    public DateTime MON;
}

public class PosiStandard
{
    /// <summary>
    /// 车号编码
    /// </summary>
    public string LOCOMOTIVE_CODE;
    /// <summary>
    /// 车号
    /// </summary>
    public string LOCOMOTIVE_NAME;
    /// <summary>
    /// 开始时间戳
    /// </summary>
    public long START_TIMESTAMP_IRV;
    /// <summary>
    /// 结束时间戳
    /// </summary>
    public long END_TIMESTAMP_IRV;
    /// <summary>
    /// 线路编码
    /// </summary>
    public string LINE_CODE;
    /// <summary>
    /// 线路名
    /// </summary>
    public string LINE_NAME;
    /// <summary>
    /// 行别
    /// </summary>
    public string DIRECTION;
    /// <summary>
    /// 区间编码
    /// </summary>
    public string POSITION_CODE;
    /// <summary>
    /// 区间名
    /// </summary>
    public string POSITION_NAME;
    /// <summary>
    /// 区间序号
    /// </summary>
    public string POSITION_ORDER;
    /// <summary>
    /// 局编码
    /// </summary>
    public string BUREAU_CODE;
    /// <summary>
    /// 局名
    /// </summary>
    public string BUREAU_NAME;
    /// <summary>
    /// 段编码
    /// </summary>
    public string ORG_CODE;
    /// <summary>
    /// 段名
    /// </summary>
    public string ORG_NAME;
}
