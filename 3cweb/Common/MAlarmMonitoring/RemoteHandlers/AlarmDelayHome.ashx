<%@ WebHandler Language="C#" Class="AlarmDelayHome" %>

using System;
using System.Web;
using Api.Util;
using System.IO;

public class AlarmDelayHome : ReferenceClass, IHttpHandler {

    public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "text/plain";
        switch (context.Request["active"])
        {
            case "total":
                QueryTotalNumber();
                break;
            case "jiche":
                QueryTotalNumber_jiche();
                break;
            case "download_jiche":
                Download_jiche();
                break;

        }
        //context.Response.Write("Hello World");
    }

    public static void QueryTotalNumber()
    {
        string LocomotiveCode = HttpContext.Current.Request["LocomotiveCode"];//车号
        string orgCode = HttpContext.Current.Request["orgCode"];//组织机构代码
        string orgType = HttpContext.Current.Request["orgType"];//组织机构类型
        string positionCode = HttpContext.Current.Request["positionCode"];//区站代码
        string positionType = HttpContext.Current.Request["positionType"];//区站类型
        string startTime = HttpContext.Current.Request["startTime"];//开始时间
        string endTime = HttpContext.Current.Request["endTime"];//结束时间
        double DelayTime = HttpContext.Current.Request["DelayTime"]=="-1"?-1:Convert.ToDouble(HttpContext.Current.Request["DelayTime"]);//最小延迟时间

        //数据查询,饼图数据
        System.Data.DataSet ds1 = ADO.FileTimeDelay.QueryHomeCount(LocomotiveCode, orgCode, orgType, positionCode, positionType, startTime, endTime, DelayTime);

        //数据查询，按车辆排序报警
        System.Data.DataSet ds2 = ADO.FileTimeDelay.QueryDealyCountBycar(LocomotiveCode, orgCode, orgType, positionCode, positionType, startTime, endTime, DelayTime);

        System.Text.StringBuilder json = new System.Text.StringBuilder();
        if (ds1.Tables.Count != 0  && ds2.Tables.Count != 0  )
        {
            try
            {
                //转换为json
                json.Append("{\"total\":");
                json.Append("{");
                json.Append("\"ZERO\":\"" + ds1.Tables[0].Rows[0]["ZERO"].ToString() + "\",");
                json.Append("\"ZEROTOFIVE\":\"" + ds1.Tables[0].Rows[0]["ZEROTOFIVE"].ToString() + "\",");
                json.Append("\"FIVETOTEN\":\"" + ds1.Tables[0].Rows[0]["FIVETOTEN"].ToString() + "\",");
                json.Append("\"TENTOTWENTY\":\"" + ds1.Tables[0].Rows[0]["TENTOTWENTY"].ToString() + "\",");
                json.Append("\"OVERTWENTY\":\"" + ds1.Tables[0].Rows[0]["OVERTWENTY"].ToString() + "\",");
                json.Append("\"TOTAL\":\"" + ds1.Tables[0].Rows[0]["TOTALCOUNT"].ToString() + "\"");
                json.Append("},");
                json.Append("\"data\":[");
                for(int i = 0; i < ds2.Tables[0].Rows.Count; i++)
                {
                    json.Append("{");
                    for (int j = 0; j < ds2.Tables[0].Columns.Count; j++)
                    {
                        string strKey = ds2.Tables[0].Columns[j].ColumnName;
                        string strValue = ds2.Tables[0].Rows[i][j].ToString();
                        Type type = ds2.Tables[0].Columns[j].DataType;
                        json.Append("\"" + strKey + "\":");
                        strValue = String.Format(strValue, type);
                        if (j < ds2.Tables[0].Columns.Count - 1)
                        {
                            json.Append("\"" + strValue + "\",");
                        }
                        else
                        {
                            json.Append("\"" + strValue + "\"");
                        }
                    }
                    json.Append("},");
                }
                if (ds2.Tables[0].Rows.Count > 0)
                {
                    json.Remove(json.Length - 1, 1);
                }
                json.Append("]}");
            }
            catch (Exception ex)
            {
                log4net.ILog log = log4net.LogManager.GetLogger("获取报警延迟详情页数据，转json出错");
                log.Error("执行出错", ex);
            }
        }
        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json.ToString());


    }
    /// <summary>
    /// 延时分析统计机车查询后台
    /// </summary>
    public static void QueryTotalNumber_jiche()
    {
        string LocomotiveCode = HttpContext.Current.Request["LocomotiveCode"];//车号
        string orgCode = HttpContext.Current.Request["orgCode"];//组织机构代码
        string orgType = HttpContext.Current.Request["orgType"];//组织机构类型
        string positionCode = HttpContext.Current.Request["positionCode"];//区站代码
        string positionType = HttpContext.Current.Request["positionType"];//区站类型
        string startTime = HttpContext.Current.Request["startTime"];//开始时间
        string endTime = HttpContext.Current.Request["endTime"];//结束时间
        double DelayTime = HttpContext.Current.Request["DelayTime"] == "-1" ? -1 : Convert.ToDouble(HttpContext.Current.Request["DelayTime"]);//最小延迟时间
                                                                                                                                              //string carNum = HttpContext.Current.Request["carnum"]==null?"52":HttpContext.Current.Request["carnum"];//车辆数
                                                                                                                                              //数据查询,饼图数据
        System.Data.DataSet ds1 = ADO.FileTimeDelay.QueryHomeCount_jiche(LocomotiveCode, orgCode, orgType, positionCode, positionType, startTime, endTime, DelayTime);

        //数据查询，按车辆排序报警
        System.Data.DataSet ds2 = ADO.FileTimeDelay.QueryDealyCountBycar_jiche(LocomotiveCode, orgCode, orgType, positionCode, positionType, startTime, endTime, DelayTime);

        System.Text.StringBuilder json = new System.Text.StringBuilder();
        if (ds1.Tables.Count != 0 && ds2.Tables.Count != 0)
        {
            try
            {
                //转换为json
                json.Append("{\"total\":");
                json.Append("{");
                json.Append("\"ZERO\":\"" + ds1.Tables[0].Rows[0]["ZERO"].ToString() + "\",");
                json.Append("\"HALF\":\"" + ds1.Tables[0].Rows[0]["HALF"].ToString() + "\",");
                json.Append("\"ONE\":\"" + ds1.Tables[0].Rows[0]["ONE"].ToString() + "\",");
                json.Append("\"TWELVE\":\"" + ds1.Tables[0].Rows[0]["TWELVE"].ToString() + "\",");
                json.Append("\"TWENTY_FOUR\":\"" + ds1.Tables[0].Rows[0]["TWENTY_FOUR"].ToString() + "\",");
                json.Append("\"FOURTY_EIGHT\":\"" + ds1.Tables[0].Rows[0]["FOURTY_EIGHT"].ToString() + "\",");
                json.Append("\"SEVENTY_TWO\":\"" + ds1.Tables[0].Rows[0]["SEVENTY_TWO"].ToString() + "\",");
                json.Append("\"HUNDRED_SIXTY_EIGHT\":\"" + ds1.Tables[0].Rows[0]["HUNDRED_SIXTY_EIGHT"].ToString() + "\",");
                json.Append("\"HUNDRED_SIXTY_EIGHT_OVER\":\"" + ds1.Tables[0].Rows[0]["HUNDRED_SIXTY_EIGHT_OVER"].ToString() + "\",");
                json.Append("\"TOTAL\":\"" + ds1.Tables[0].Rows[0]["TOTALCOUNT"].ToString() + "\"");
                json.Append("},");
                json.Append("\"data\":[");
                for (int i = 0; i < ds2.Tables[0].Rows.Count; i++)
                {
                    json.Append("{");
                    for (int j = 0; j < ds2.Tables[0].Columns.Count; j++)
                    {
                        string strKey = ds2.Tables[0].Columns[j].ColumnName;
                        string strValue = ds2.Tables[0].Rows[i][j].ToString();
                        Type type = ds2.Tables[0].Columns[j].DataType;
                        json.Append("\"" + strKey + "\":");
                        strValue = String.Format(strValue, type);
                        if (j < ds2.Tables[0].Columns.Count - 1)
                        {
                            json.Append("\"" + strValue + "\",");
                        }
                        else
                        {
                            json.Append("\"" + strValue + "\"");
                        }
                    }
                    json.Append("},");
                }
                if (ds2.Tables[0].Rows.Count > 0)
                {
                    json.Remove(json.Length - 1, 1);
                }
                json.Append("]}");
            }
            catch (Exception ex)
            {
                log4net.ILog log = log4net.LogManager.GetLogger("获取报警延迟详情页数据，转json出错");
                log.Error("执行出错", ex);
            }
        }
        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json.ToString());
    }
    /// <summary>
    /// 延时分析统计机车查询后台
    /// </summary>
    public static void Download_jiche()
    {
        string LocomotiveCode = HttpContext.Current.Request["LocomotiveCode"];//车号
        string orgCode = HttpContext.Current.Request["orgCode"];//组织机构代码
        string orgType = HttpContext.Current.Request["orgType"];//组织机构类型
        string positionCode = HttpContext.Current.Request["positionCode"];//区站代码
        string positionType = HttpContext.Current.Request["positionType"];//区站类型
        string startTime = HttpContext.Current.Request["startTime"];//开始时间
        string endTime = HttpContext.Current.Request["endTime"];//结束时间
        double DelayTime = HttpContext.Current.Request["DelayTime"] == "-1" ? -1 : Convert.ToDouble(HttpContext.Current.Request["DelayTime"]);//最小延迟时间
                                                                                                                                              //string carNum = HttpContext.Current.Request["carnum"]==null?"52":HttpContext.Current.Request["carnum"];//车辆数
                                                                                                                                              //数据查询,饼图数据
                                                                                                                                              //System.Data.DataSet ds1 = ADO.FileTimeDelay.QueryHomeCount_jiche(LocomotiveCode, orgCode, orgType, positionCode, positionType, startTime, endTime, DelayTime);
                                                                                                                                              //数据查询，按车辆排序报警
        System.Data.DataSet ds2 = ADO.FileTimeDelay.QueryDealyCountBycar_jiche(LocomotiveCode, orgCode, orgType, positionCode, positionType, startTime, endTime, DelayTime);

        System.Data.DataTable dt = ds2.Tables[0];
        dt.Columns.Remove("ROWNUM");
        dt.Columns["DETECT_DEVICE_CODE"].ColumnName = "车号";
        dt.Columns["ZERO"].ColumnName = "延时时间不确定";
        dt.Columns["HALF"].ColumnName = "半小时以内";
        dt.Columns["ONE"].ColumnName = "半小时至1小时";
        dt.Columns["TWELVE"].ColumnName = "1-12小时";
        dt.Columns["TWENTY_FOUR"].ColumnName = "12-24小时";
        dt.Columns["FOURTY_EIGHT"].ColumnName = "24-48小时";
        dt.Columns["SEVENTY_TWO"].ColumnName = "48-72小时";
        dt.Columns["HUNDRED_SIXTY_EIGHT"].ColumnName = "72-168小时";
        dt.Columns["HUNDRED_SIXTY_EIGHT_OVER"].ColumnName = "168小时以上";
        dt.Columns["TOTALCOUNT"].ColumnName = "总计";

        string name = "机车延时分析统计" + Convert.ToDateTime(startTime).ToString("yyyyMMdd") + "到" + Convert.ToDateTime(endTime).ToString("yyyyMMdd") + "_" + DateTime.Now.ToString("mmss");
        if (!Directory.Exists(System.Web.HttpContext.Current.Server.MapPath(@"~\TempReport\")))
        {
            DirectoryInfo directoryInfo = new DirectoryInfo(System.Web.HttpContext.Current.Server.MapPath(@"~\TempReport\"));
            directoryInfo.Create();
        }

        int[] width = new int[] { 12, 25, 14, 14, 14, 14, 14, 14, 14 };
        Api.Util.PubExcel.SendXls(ds2, System.Web.HttpContext.Current.Server.MapPath(@"~/TempReport/"), width, name);

        string url = "{\"url\":" + "\"" + ("/TempReport/" + name + ".xls").Replace("\\", "\\\\") + "\"" + "}";
        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(url);
    }

    public bool IsReusable {
        get {
            return false;
        }
    }

}