<%@ WebHandler Language="C#" Class="HardDiskData" %>

using System;
using System.Web;

public class HardDiskData : ReferenceClass, IHttpHandler {

    public void ProcessRequest (HttpContext context)
    {
        String type = context.Request["active"];
        switch (type)
        {
            case "PowerStatistics":
                GetPowerStatistics(context);
                break;
            case "P_ORG_Statistics":
                GetP_orgStatistics(context);
                break;
            case "StatisticsProgress":
                GetStatisticsProgress(context);
                break;
            case "ModifyPosition":
                ModifyPosition(context);
                break;
        }
        //context.Response.ContentType = "text/plain";
        //context.Response.Write("Hello World");
    }

    /// <summary>
    /// 硬盘数据统计页，供电视图
    /// </summary>
    /// <param name="context"></param>
    public static void GetPowerStatistics(HttpContext context)
    {
        string positionType = context.Request["positiontype"];//区站类型
        string positionCode = context.Request["positioncode"];//区站编码
        DateTime endDate = string.IsNullOrEmpty(context.Request["endtime"]) ? DateTime.Now : Convert.ToDateTime(context.Request["endtime"]);//结束时间，若为空，则默认当前时间
        DateTime startDate = string.IsNullOrEmpty(context.Request["starttime"]) ? endDate.AddDays(-2) : Convert.ToDateTime(context.Request["starttime"]);//开始时间，若为空，则默认结束时间减去两天
        int pageSize = string.IsNullOrEmpty(context.Request["pagesize"]) ? 20 : Convert.ToInt32(context.Request["pagesize"]);
        int pageIndex= string.IsNullOrEmpty(context.Request["pageindex"]) ? 1 : Convert.ToInt32(context.Request["pageindex"]);

        int startRownum = (pageIndex - 1) * pageSize + 1;//开始行号
        int endRownum = pageSize * pageIndex;//结束行号

        //计算开始时间和结束时间的时间戳
        TimeSpan ts_start = startDate.ToUniversalTime() - new DateTime(1970, 1, 1, 0, 0, 0, 0);
        string startTimestamp = Convert.ToInt64(ts_start.TotalMilliseconds).ToString();

        TimeSpan ts_end = endDate.ToUniversalTime() - new DateTime(1970, 1, 1, 0, 0, 0, 0);
        string endTimestamp = Convert.ToInt64(ts_end.TotalMilliseconds).ToString();

        //数据访问
        System.Data.DataSet ds = ADO.HardDiskData.GetStatisticPage_Power(positionType, positionCode, startTimestamp, endTimestamp, startRownum, endRownum);

        //Json拼接
        System.Text.StringBuilder json = new System.Text.StringBuilder();
        if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
        {
            json.Append("{\"data\":[],\"total_Rows\":\"0\",\"pageIndex\":\"0\",\"pageSize\":\"0\",\"pageOfTotal\":\"1/1\",\"pageRange\":\"0~0\",\"Current_pagesize\":\"0\",\"totalPages\":\"1\"}");
        }
        else
        {
            //时间戳计算的开始时间
            DateTime dtStart = TimeZone.CurrentTimeZone.ToLocalTime(new DateTime(1970, 1, 1, 0, 0, 0));

            json.Append("{\"data\":[");
            for(int i = 0; i < ds.Tables[0].Rows.Count; i++)
            {
                System.Data.DataRow dr = ds.Tables[0].Rows[i];
                if (i == 0 || dr["LINE_CODE"].ToString() != ds.Tables[0].Rows[i - 1]["LINE_CODE"].ToString()||dr["DIRECTION"].ToString() != ds.Tables[0].Rows[i - 1]["DIRECTION"].ToString())
                {
                    if (json[json.Length - 1].ToString() == ",")
                    {
                        json.Remove(json.Length - 1, 1);
                        json.Append("]}]},");
                    }
                    json.Append("{\"line_code\":\"");
                    json.Append((dr["LINE_CODE"] == DBNull.Value ? "-" : dr["LINE_CODE"].ToString()) + "\",");
                    json.Append("\"line_name\":\"");
                    json.Append(((dr["LINE_CODE"] == DBNull.Value || dr["LINE_CODE"].ToString() == "无线路") ? "无线路" : Api.Util.Common.getLineInfo(dr["LINE_CODE"].ToString()).LINE_NAME) + "\",");
                    json.Append("\"direction\":\"");
                    json.Append((dr["DIRECTION"] == DBNull.Value ? "-" : dr["DIRECTION"].ToString()) + "\",");
                    json.Append("\"loco_count\":\"");
                    json.Append((dr["LOCOCOUNT"] == DBNull.Value ? "-" : dr["LOCOCOUNT"].ToString()) + "\",");
                    json.Append("\"loco_list\":[");
                    json.Append("{\"locomotive_code\":\"");
                    json.Append((dr["LOCOMOTIVE_CODE"] == DBNull.Value ? "-" : dr["LOCOMOTIVE_CODE"].ToString()) + "\",");
                    json.Append("\"line_code\":\"");
                    json.Append((dr["LINE_CODE"] == DBNull.Value ? "-" : dr["LINE_CODE"].ToString()) + "\",");
                    json.Append("\"line_name\":\"");
                    json.Append((dr["LINE_CODE"] == DBNull.Value ? "-" : Api.Util.Common.getLineInfo(dr["LINE_CODE"].ToString()).LINE_NAME) + "\",");
                    json.Append("\"direction\":\"");
                    json.Append((dr["DIRECTION"] == DBNull.Value ? "-" : dr["DIRECTION"].ToString()) + "\",");

                    json.Append("\"loco_start_timestamp\":\"");
                    json.Append((dr["STARTTIME"] == DBNull.Value ? "-" : dr["STARTTIME"].ToString()) + "\",");

                    json.Append("\"loco_start_date\":\"");
                    if(dr["STARTTIME"] == DBNull.Value)
                    {
                        json.Append("-" + "\",");
                    }
                    else
                    {
                        long lTime = long.Parse(dr["STARTTIME"].ToString() + "0000");
                        TimeSpan toNow = new TimeSpan(lTime);
                        DateTime dt_ = dtStart.Add(toNow);
                        json.Append(dt_.ToString("yyyy-MM-dd HH:mm:ss") + "\",");
                    }

                    json.Append("\"loco_end_timestamp\":\"");
                    json.Append((dr["ENDTIME"] == DBNull.Value ? "-" : dr["ENDTIME"].ToString()) + "\",");

                    json.Append("\"loco_end_date\":\"");
                    if(dr["ENDTIME"] == DBNull.Value)
                    {
                        json.Append("-" + "\",");
                    }
                    else
                    {
                        long lTime = long.Parse(dr["ENDTIME"].ToString() + "0000");
                        TimeSpan toNow = new TimeSpan(lTime);
                        DateTime dt_ = dtStart.Add(toNow);
                        json.Append(dt_.ToString("yyyy-MM-dd HH:mm:ss") + "\",");
                    }

                    json.Append("\"position_list\":[");
                    json.Append("{\"position_code\":\"");
                    json.Append((dr["POSITION_CODE"] == DBNull.Value ? "-" : dr["POSITION_CODE"].ToString()) + "\",");
                    json.Append("\"position_name\":\"");
                    //json.Append((dr["POSITION_CODE"] == DBNull.Value ? "-" : Api.Util.Common.getStationSectionInfo(dr["POSITION_CODE"].ToString()).POSITION_NAME) + "\",");
                    if (dr["POSITION_CODE"] == DBNull.Value)
                    {
                        json.Append("-");
                        json.Append("\",");
                    }
                    else
                    {
                        string positionName = Api.Util.Common.getStationSectionInfo(dr["POSITION_CODE"].ToString()).POSITION_NAME;
                        string positionT = Api.Util.Common.getStationSectionInfo(dr["POSITION_CODE"].ToString()).POSITION_TYPE;
                        if ((positionT == "Q") && (dr["DIRECTION"].ToString() == "下行"))
                        {
                            string[] p = positionName.Split('－');
                            json.Append(p[1] + "-" + p[0]);
                            json.Append("\",");
                        }
                        else
                        {
                            json.Append(positionName);
                            json.Append("\",");
                        }
                    }
                    json.Append("\"locomotive_code\":\"");
                    json.Append((dr["LOCOMOTIVE_CODE"] == DBNull.Value ? "-" : dr["LOCOMOTIVE_CODE"].ToString()) + "\",");
                    json.Append("\"line_code\":\"");
                    json.Append((dr["LINE_CODE"] == DBNull.Value ? "-" : dr["LINE_CODE"].ToString()) + "\",");
                    json.Append("\"line_name\":\"");
                    json.Append((dr["LINE_CODE"] == DBNull.Value ? "-" : Api.Util.Common.getLineInfo(dr["LINE_CODE"].ToString()).LINE_NAME) + "\",");
                    json.Append("\"direction\":\"");
                    json.Append((dr["DIRECTION"] == DBNull.Value ? "-" : dr["DIRECTION"].ToString()) + "\",");

                    json.Append("\"position_start_timestamp\":\"");
                    json.Append((dr["START_TIMESTAMP_IRV"] == DBNull.Value ? "-" : dr["START_TIMESTAMP_IRV"].ToString()) + "\",");

                    json.Append("\"position_start_date\":\"");
                    if(dr["START_TIMESTAMP_IRV"] == DBNull.Value)
                    {
                        json.Append("-" + "\",");
                    }
                    else
                    {
                        long lTime = long.Parse(dr["START_TIMESTAMP_IRV"].ToString() + "0000");
                        TimeSpan toNow = new TimeSpan(lTime);
                        DateTime dt_ = dtStart.Add(toNow);
                        json.Append(dt_.ToString("yyyy-MM-dd HH:mm:ss") + "\",");
                    }

                    json.Append("\"position_end_timestamp\":\"");
                    json.Append((dr["END_TIMESTAMP_IRV"] == DBNull.Value ? "-" : dr["END_TIMESTAMP_IRV"].ToString()) + "\",");

                    json.Append("\"position_end_date\":\"");
                    if(dr["END_TIMESTAMP_IRV"] == DBNull.Value)
                    {
                        json.Append("-" + "\"},");
                    }
                    else
                    {
                        long lTime = long.Parse(dr["END_TIMESTAMP_IRV"].ToString() + "0000");
                        TimeSpan toNow = new TimeSpan(lTime);
                        DateTime dt_ = dtStart.Add(toNow);
                        json.Append(dt_.ToString("yyyy-MM-dd HH:mm:ss") + "\"},");
                    }
                    //json.Append(dr["END_TIMESTAMP_IRV"] == DBNull.Value ? "-" : dr["END_TIMESTAMP_IRV"].ToString() + "\",");
                }
                else
                {
                    if (dr["LOCOMOTIVE_CODE"].ToString() != ds.Tables[0].Rows[i - 1]["LOCOMOTIVE_CODE"].ToString() || dr["DATA_DATE"].ToString() != ds.Tables[0].Rows[i - 1]["DATA_DATE"].ToString())
                    {
                        if (json[json.Length - 1].ToString() == ",")
                        {
                            json.Remove(json.Length - 1, 1);
                            json.Append("]},");
                        }


                        json.Append("{\"locomotive_code\":\"");
                        json.Append((dr["LOCOMOTIVE_CODE"] == DBNull.Value ? "-" : dr["LOCOMOTIVE_CODE"].ToString()) + "\",");
                        json.Append("\"line_code\":\"");
                        json.Append((dr["LINE_CODE"] == DBNull.Value ? "-" : dr["LINE_CODE"].ToString()) + "\",");
                        json.Append("\"line_name\":\"");
                        json.Append((dr["LINE_CODE"] == DBNull.Value ? "-" : Api.Util.Common.getLineInfo(dr["LINE_CODE"].ToString()).LINE_NAME) + "\",");
                        json.Append("\"direction\":\"");
                        json.Append((dr["DIRECTION"] == DBNull.Value ? "-" : dr["DIRECTION"].ToString()) + "\",");

                        json.Append("\"loco_start_timestamp\":\"");
                        json.Append((dr["STARTTIME"] == DBNull.Value ? "-" : dr["STARTTIME"].ToString()) + "\",");

                        json.Append("\"loco_start_date\":\"");
                        if (dr["STARTTIME"] == DBNull.Value)
                        {
                            json.Append("-" + "\",");
                        }
                        else
                        {
                            long lTime = long.Parse(dr["STARTTIME"].ToString() + "0000");
                            TimeSpan toNow = new TimeSpan(lTime);
                            DateTime dt_ = dtStart.Add(toNow);
                            json.Append(dt_.ToString("yyyy-MM-dd HH:mm:ss") + "\",");
                        }

                        json.Append("\"loco_end_timestamp\":\"");
                        json.Append((dr["ENDTIME"] == DBNull.Value ? "-" : dr["ENDTIME"].ToString()) + "\",");

                        json.Append("\"loco_end_date\":\"");
                        if (dr["ENDTIME"] == DBNull.Value)
                        {
                            json.Append("-" + "\",");
                        }
                        else
                        {
                            long lTime = long.Parse(dr["ENDTIME"].ToString() + "0000");
                            TimeSpan toNow = new TimeSpan(lTime);
                            DateTime dt_ = dtStart.Add(toNow);
                            json.Append(dt_.ToString("yyyy-MM-dd HH:mm:ss") + "\",");
                        }

                        json.Append("\"position_list\":[");
                        json.Append("{\"position_code\":\"");
                        json.Append((dr["POSITION_CODE"] == DBNull.Value ? "-" : dr["POSITION_CODE"].ToString()) + "\",");
                        json.Append("\"position_name\":\"");
                        //json.Append((dr["POSITION_CODE"] == DBNull.Value ? "-" : Api.Util.Common.getStationSectionInfo(dr["POSITION_CODE"].ToString()).POSITION_NAME) + "\",");
                        if (dr["POSITION_CODE"] == DBNull.Value)
                        {
                            json.Append("-");
                            json.Append("\",");
                        }
                        else
                        {
                            string positionName = Api.Util.Common.getStationSectionInfo(dr["POSITION_CODE"].ToString()).POSITION_NAME;
                            string positionT = Api.Util.Common.getStationSectionInfo(dr["POSITION_CODE"].ToString()).POSITION_TYPE;
                            if ((positionT == "Q") && (dr["DIRECTION"].ToString() == "下行"))
                            {
                                string[] p = positionName.Split('－');
                                json.Append(p[1] + "-" + p[0]);
                                json.Append("\",");
                            }
                            else
                            {
                                json.Append(positionName);
                                json.Append("\",");
                            }
                        }
                        json.Append("\"locomotive_code\":\"");
                        json.Append((dr["LOCOMOTIVE_CODE"] == DBNull.Value ? "-" : dr["LOCOMOTIVE_CODE"].ToString()) + "\",");
                        json.Append("\"line_code\":\"");
                        json.Append((dr["LINE_CODE"] == DBNull.Value ? "-" : dr["LINE_CODE"].ToString()) + "\",");
                        json.Append("\"line_name\":\"");
                        json.Append((dr["LINE_CODE"] == DBNull.Value ? "-" : Api.Util.Common.getLineInfo(dr["LINE_CODE"].ToString()).LINE_NAME) + "\",");
                        json.Append("\"direction\":\"");
                        json.Append((dr["DIRECTION"] == DBNull.Value ? "-" : dr["DIRECTION"].ToString()) + "\",");

                        json.Append("\"position_start_timestamp\":\"");
                        json.Append((dr["START_TIMESTAMP_IRV"] == DBNull.Value ? "-" : dr["START_TIMESTAMP_IRV"].ToString()) + "\",");

                        json.Append("\"position_start_date\":\"");
                        if (dr["START_TIMESTAMP_IRV"] == DBNull.Value)
                        {
                            json.Append("-" + "\"},");
                        }
                        else
                        {
                            long lTime = long.Parse(dr["START_TIMESTAMP_IRV"].ToString() + "0000");
                            TimeSpan toNow = new TimeSpan(lTime);
                            DateTime dt_ = dtStart.Add(toNow);
                            json.Append(dt_.ToString("yyyy-MM-dd HH:mm:ss") + "\",");
                        }

                        json.Append("\"position_end_timestamp\":\"");
                        json.Append((dr["END_TIMESTAMP_IRV"] == DBNull.Value ? "-" : dr["END_TIMESTAMP_IRV"].ToString()) + "\",");

                        json.Append("\"position_end_date\":\"");
                        if (dr["END_TIMESTAMP_IRV"] == DBNull.Value)
                        {
                            json.Append("-" + "\"},");
                        }
                        else
                        {
                            long lTime = long.Parse(dr["END_TIMESTAMP_IRV"].ToString() + "0000");
                            TimeSpan toNow = new TimeSpan(lTime);
                            DateTime dt_ = dtStart.Add(toNow);
                            json.Append(dt_.ToString("yyyy-MM-dd HH:mm:ss") + "\"},");
                        }
                    }
                    else
                    {
                        json.Append("{\"position_code\":\"");
                        json.Append((dr["POSITION_CODE"] == DBNull.Value ? "-" : dr["POSITION_CODE"].ToString()) + "\",");
                        json.Append("\"position_name\":\"");
                        //json.Append((dr["POSITION_CODE"] == DBNull.Value ? "-" : Api.Util.Common.getStationSectionInfo(dr["POSITION_CODE"].ToString()).POSITION_NAME) + "\",");
                        if (dr["POSITION_CODE"] == DBNull.Value)
                        {
                            json.Append("-");
                            json.Append("\",");
                        }
                        else
                        {
                            string positionName = Api.Util.Common.getStationSectionInfo(dr["POSITION_CODE"].ToString()).POSITION_NAME;
                            string positionT = Api.Util.Common.getStationSectionInfo(dr["POSITION_CODE"].ToString()).POSITION_TYPE;
                            if ((positionT == "Q") && (dr["DIRECTION"].ToString() == "下行"))
                            {
                                string[] p = positionName.Split('－');
                                json.Append(p[1] + "-" + p[0]);
                                json.Append("\",");
                            }
                            else
                            {
                                json.Append(positionName);
                                json.Append("\",");
                            }
                        }
                        json.Append("\"locomotive_code\":\"");
                        json.Append((dr["LOCOMOTIVE_CODE"] == DBNull.Value ? "-" : dr["LOCOMOTIVE_CODE"].ToString()) + "\",");
                        json.Append("\"line_code\":\"");
                        json.Append((dr["LINE_CODE"] == DBNull.Value ? "-" : dr["LINE_CODE"].ToString()) + "\",");
                        json.Append("\"line_name\":\"");
                        json.Append((dr["LINE_CODE"] == DBNull.Value ? "-" : Api.Util.Common.getLineInfo(dr["LINE_CODE"].ToString()).LINE_NAME) + "\",");
                        json.Append("\"direction\":\"");
                        json.Append((dr["DIRECTION"] == DBNull.Value ? "-" : dr["DIRECTION"].ToString()) + "\",");

                        json.Append("\"position_start_timestamp\":\"");
                        json.Append((dr["START_TIMESTAMP_IRV"] == DBNull.Value ? "-" : dr["START_TIMESTAMP_IRV"].ToString()) + "\",");


                        json.Append("\"position_start_date\":\"");
                        if (dr["START_TIMESTAMP_IRV"] == DBNull.Value)
                        {
                            json.Append("-" + "\",");
                        }
                        else
                        {
                            long lTime = long.Parse(dr["START_TIMESTAMP_IRV"].ToString() + "0000");
                            TimeSpan toNow = new TimeSpan(lTime);
                            DateTime dt_ = dtStart.Add(toNow);
                            json.Append(dt_.ToString("yyyy-MM-dd HH:mm:ss") + "\",");
                        }

                        json.Append("\"position_end_timestamp\":\"");
                        json.Append((dr["END_TIMESTAMP_IRV"] == DBNull.Value ? "-" : dr["END_TIMESTAMP_IRV"].ToString()) + "\",");


                        json.Append("\"position_end_date\":\"");
                        if (dr["END_TIMESTAMP_IRV"] == DBNull.Value)
                        {
                            json.Append("-" + "\"},");
                        }
                        else
                        {
                            long lTime = long.Parse(dr["END_TIMESTAMP_IRV"].ToString() + "0000");
                            TimeSpan toNow = new TimeSpan(lTime);
                            DateTime dt_ = dtStart.Add(toNow);
                            json.Append(dt_.ToString("yyyy-MM-dd HH:mm:ss") + "\"},");
                        }
                    }
                }
            }
            if (json[json.Length - 1].ToString() == ",")
            {
                json.Remove(json.Length - 1, 1);
                json.Append("]}]}");
            }
            json.Append("]");
            PageHelper page = new PageHelper();
            string pagejson = page.getPageJson(Convert.ToInt32(ds.Tables[0].Rows[0]["TOTAL"]), Convert.ToInt32(pageIndex), Convert.ToInt32(pageSize));//拼接分页数据
            json.Append("," + pagejson + ",\"positiontype\":\"" + positionType + "\"}");
        }
        context.Response.ContentType = "text/plain";
        context.Response.Write(json);
    }

    /// <summary>
    /// 硬盘数据统计页，车辆视图
    /// </summary>
    /// <param name="context"></param>
    public static void GetP_orgStatistics(HttpContext context)
    {
        string locomotiveCode = context.Request["locomotivecode"];//设备编号

        DateTime endDate = string.IsNullOrEmpty(context.Request["endtime"]) ? DateTime.Now : Convert.ToDateTime(context.Request["endtime"]);//结束时间，若为空，则默认当前时间
        DateTime startDate = string.IsNullOrEmpty(context.Request["starttime"]) ? endDate.AddDays(-2) : Convert.ToDateTime(context.Request["starttime"]);//开始时间，若为空，则默认结束时间减去两天
        int pageSize = string.IsNullOrEmpty(context.Request["pagesize"]) ? 20 : Convert.ToInt32(context.Request["pagesize"]);
        int pageIndex= string.IsNullOrEmpty(context.Request["pageindex"]) ? 1 : Convert.ToInt32(context.Request["pageindex"]);

        int startRownum = (pageIndex - 1) * pageSize + 1;//开始行号
        int endRownum = pageSize * pageIndex;//结束行号

        //计算开始时间和结束时间的时间戳
        TimeSpan ts_start = startDate.ToUniversalTime() - new DateTime(1970, 1, 1, 0, 0, 0, 0);
        string startTimestamp = Convert.ToInt64(ts_start.TotalMilliseconds).ToString();

        TimeSpan ts_end = endDate.ToUniversalTime() - new DateTime(1970, 1, 1, 0, 0, 0, 0);
        string endTimestamp = Convert.ToInt64(ts_end.TotalMilliseconds).ToString();

        //数据访问
        System.Data.DataSet ds = ADO.HardDiskData.GetStatisticPage_P_ORG(locomotiveCode, startTimestamp, endTimestamp, startRownum, endRownum);

        //Json拼接
        System.Text.StringBuilder json = new System.Text.StringBuilder();
        if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
        {
            json.Append("{\"data\":[],\"total_Rows\":\"0\",\"pageIndex\":\"0\",\"pageSize\":\"0\",\"pageOfTotal\":\"1/1\",\"pageRange\":\"0~0\",\"Current_pagesize\":\"0\",\"totalPages\":\"1\"}");
        }
        else
        {
            //时间戳计算的开始时间
            DateTime dtStart = TimeZone.CurrentTimeZone.ToLocalTime(new DateTime(1970, 1, 1, 0, 0, 0));
            int lineStartTimestamp = -1;//线路单程开始时间
            long lineENdTimestamp = -1;//线路单程结束时间

            json.Append("{\"data\":[");
            for(int i = 0; i < ds.Tables[0].Rows.Count; i++)
            {
                System.Data.DataRow dr = ds.Tables[0].Rows[i];
                if (i == 0 || dr["LOCOMOTIVE_CODE"].ToString() != ds.Tables[0].Rows[i - 1]["LOCOMOTIVE_CODE"].ToString())
                {
                    if (json[json.Length - 1].ToString() == ",")
                    {
                        json.Remove(json.Length - 1, 1);
                        json.Append("]}]}]},");
                    }
                    json.Append("{\"locomotive_code\":\"");
                    json.Append(dr["LOCOMOTIVE_CODE"] == DBNull.Value ? "-" : dr["LOCOMOTIVE_CODE"].ToString() + "\",");
                    json.Append("\"run_date\":\"");
                    json.Append(dr["RUN_DATE"] == DBNull.Value ? "-" : dr["RUN_DATE"].ToString() + "\",");
                    json.Append("\"run_date\":\"");
                    json.Append(dr["RUN_DATE"] == DBNull.Value ? "-" : dr["RUN_DATE"].ToString() + "\",");
                    json.Append("\"date_list\":[");

                    json.Append("{\"date\":\"");
                    json.Append((dr["DATA_DATE"] == DBNull.Value ? "-" : (Convert.ToDateTime(dr["DATA_DATE"]).ToString("yyyy-MM-dd"))) + "\",");
                    json.Append("\"date_start_time\":\"");
                    //json.Append((dr["DAY_START_TIME"] == DBNull.Value ? "-" : (Convert.ToDateTime(dr["DAY_START_TIME"]).ToString("HH:mm:ss"))) + "\",");
                    if (dr["DAY_START_TIMESTAMP"] == DBNull.Value)
                    {
                        json.Append("-" + "\",");
                    }
                    else
                    {
                        long lTime = long.Parse(dr["DAY_START_TIMESTAMP"].ToString() + "0000");
                        TimeSpan toNow = new TimeSpan(lTime);
                        DateTime dt_ = dtStart.Add(toNow);
                        json.Append(dt_.ToString("HH:mm:ss") + "\",");
                    }
                    json.Append("\"date_end_time\":\"");
                    //json.Append((dr["DAY_END_TIME"] == DBNull.Value ? "-" : (Convert.ToDateTime(dr["DAY_END_TIME"]).ToString("HH:mm:ss"))) + "\",");
                    if (dr["DAY_END_TIMESTAMP"] == DBNull.Value)
                    {
                        json.Append("-" + "\",");
                    }
                    else
                    {
                        long lTime = long.Parse(dr["DAY_END_TIMESTAMP"].ToString() + "0000");
                        TimeSpan toNow = new TimeSpan(lTime);
                        DateTime dt_ = dtStart.Add(toNow);
                        json.Append(dt_.ToString("HH:mm:ss") + "\",");
                    }


                    json.Append("\"date_start_timestamp\":\"");
                    json.Append((dr["DAY_START_TIMESTAMP"] == DBNull.Value ? "-" : dr["DAY_START_TIMESTAMP"].ToString()) + "\",");
                    json.Append("\"date_end_timestamp\":\"");
                    json.Append((dr["DAY_END_TIMESTAMP"] == DBNull.Value ? "-" : dr["DAY_END_TIMESTAMP"].ToString()) + "\",");

                    json.Append("\"locomotive_code\":\"");
                    json.Append((dr["LOCOMOTIVE_CODE"] == DBNull.Value ? "-" : dr["LOCOMOTIVE_CODE"].ToString()) + "\",");
                    json.Append("\"line_list\":[");

                    json.Append("{\"line_code\":\"");
                    json.Append((dr["LINE_CODE"] == DBNull.Value ? "-" : dr["LINE_CODE"].ToString()) + "\",");
                    json.Append("\"line_name\":\"");
                    json.Append((dr["LINE_CODE"] == DBNull.Value ? "-" : Api.Util.Common.getLineInfo(dr["LINE_CODE"].ToString()).LINE_NAME) + "\",");
                    json.Append("\"direction\":\"");
                    json.Append((dr["DIRECTION"] == DBNull.Value ? "-" : dr["DIRECTION"].ToString()) + "\",");
                    json.Append("\"locomotive_code\":\"");
                    json.Append((dr["LOCOMOTIVE_CODE"] == DBNull.Value ? "-" : dr["LOCOMOTIVE_CODE"].ToString()) + "\",");
                    json.Append("\"date\":\"");
                    json.Append((dr["DATA_DATE"] == DBNull.Value ? "-" : (Convert.ToDateTime(dr["DATA_DATE"]).ToString("yyyy-MM-dd"))) + "\",");
                    json.Append("\"line_start_time\":\"");
                    //json.Append((dr["LINE_START_TIME"] == DBNull.Value ? "-" : (Convert.ToDateTime(dr["LINE_START_TIME"]).ToString("HH:mm:ss"))) + "\",");
                    if (dr["START_TIMESTAMP_IRV"] == DBNull.Value)
                    {
                        json.Append("-" + "\",");
                    }
                    else
                    {
                        long lTime = long.Parse(dr["START_TIMESTAMP_IRV"].ToString() + "0000");
                        TimeSpan toNow = new TimeSpan(lTime);
                        DateTime dt_ = dtStart.Add(toNow);
                        json.Append(dt_.ToString("HH:mm:ss") + "\",");
                    }

                    json.Append("\"line_end_time\":\"");
                    //json.Append((dr["LINE_END_TIME"] == DBNull.Value ? "-" : (Convert.ToDateTime(dr["LINE_END_TIME"]).ToString("HH:mm:ss"))) + "\",");

                    for (int j = i; j < ds.Tables[0].Rows.Count && (ds.Tables[0].Rows[j]["DATA_DATE"].Equals(dr["DATA_DATE"])) && (ds.Tables[0].Rows[j]["LINE_CODE"].Equals(dr["LINE_CODE"])) && (ds.Tables[0].Rows[j]["DIRECTION"].Equals(dr["DIRECTION"])) ; j++)
                    {
                        if(/*ds.Tables[0].Rows[j]["END_TIMESTAMP_IRV"] != DBNull.Value && */(j == ds.Tables[0].Rows.Count-1|| (!ds.Tables[0].Rows[j + 1]["DATA_DATE"].Equals(dr["DATA_DATE"]) || !ds.Tables[0].Rows[j + 1]["LINE_CODE"].Equals(dr["LINE_CODE"]) || !ds.Tables[0].Rows[j + 1]["DIRECTION"].Equals(dr["DIRECTION"]))))
                        {
                            if(ds.Tables[0].Rows[j]["END_TIMESTAMP_IRV"] == DBNull.Value)
                            {
                                lineENdTimestamp = -1;
                            }
                            else
                            {
                                lineENdTimestamp = Convert.ToInt64(ds.Tables[0].Rows[j]["END_TIMESTAMP_IRV"].ToString());
                            }

                        }
                    }
                    if (lineENdTimestamp == -1)
                    {
                        json.Append("-" + "\",");
                    }
                    else
                    {
                        long lTime = long.Parse(lineENdTimestamp.ToString() + "0000");
                        TimeSpan toNow = new TimeSpan(lTime);
                        DateTime dt_ = dtStart.Add(toNow);
                        json.Append(dt_.ToString("HH:mm:ss") + "\",");
                    }

                    json.Append("\"line_start_timestamp\":\"");
                    json.Append((dr["START_TIMESTAMP_IRV"] == DBNull.Value ? "-" : dr["START_TIMESTAMP_IRV"].ToString()) + "\",");
                    json.Append("\"line_end_timestamp\":\"");
                    json.Append((lineENdTimestamp == -1 ? "-" : lineENdTimestamp.ToString()) + "\",");

                    json.Append("\"position_list\":[");

                    json.Append("{\"position_code\":\"");
                    json.Append((dr["POSITION_CODE"] == DBNull.Value ? "-" : dr["POSITION_CODE"].ToString()) + "\",");
                    json.Append("\"position_name\":\"");
                    //json.Append((dr["POSITION_CODE"] == DBNull.Value ? "-" : Api.Util.Common.getStationSectionInfo(dr["POSITION_CODE"].ToString()).POSITION_NAME) + "\",");
                    if (dr["POSITION_CODE"] == DBNull.Value)
                    {
                        json.Append("-");
                        json.Append("\",");
                    }
                    else
                    {
                        string positionName = Api.Util.Common.getStationSectionInfo(dr["POSITION_CODE"].ToString()).POSITION_NAME;
                        string positionType = Api.Util.Common.getStationSectionInfo(dr["POSITION_CODE"].ToString()).POSITION_TYPE;
                        if (positionType == "Q" && dr["DIRECTION"].ToString() == "下行")
                        {
                            string[] p = positionName.Split('－');
                            json.Append(p[1] + "-" + p[0]);
                            json.Append("\",");
                        }
                        else
                        {
                            json.Append(positionName);
                            json.Append("\",");
                        }
                    }
                    json.Append("\"date\":\"");
                    json.Append((dr["DATA_DATE"] == DBNull.Value ? "-" : (Convert.ToDateTime(dr["DATA_DATE"]).ToString("yyyy-MM-dd"))) + "\",");
                    json.Append("\"line_code\":\"");
                    json.Append((dr["LINE_CODE"] == DBNull.Value ? "-" : dr["LINE_CODE"].ToString()) + "\",");
                    json.Append("\"line_name\":\"");
                    json.Append((dr["LINE_CODE"] == DBNull.Value ? "-" : Api.Util.Common.getLineInfo(dr["LINE_CODE"].ToString()).LINE_NAME) + "\",");
                    json.Append("\"direction\":\"");
                    json.Append((dr["DIRECTION"] == DBNull.Value ? "-" : dr["DIRECTION"].ToString()) + "\",");
                    json.Append("\"locomotive_code\":\"");
                    json.Append((dr["LOCOMOTIVE_CODE"] == DBNull.Value ? "-" : dr["LOCOMOTIVE_CODE"].ToString()) + "\",");
                    json.Append("\"position_start_time\":\"");
                    //json.Append((dr["POSITION_START_TIME"] == DBNull.Value ? "-" : (Convert.ToDateTime(dr["POSITION_START_TIME"]).ToString("HH:mm:ss"))) + "\",");
                    if (dr["START_TIMESTAMP_IRV"] == DBNull.Value)
                    {
                        json.Append("-" + "\",");
                    }
                    else
                    {
                        long lTime = long.Parse(dr["START_TIMESTAMP_IRV"].ToString() + "0000");
                        TimeSpan toNow = new TimeSpan(lTime);
                        DateTime dt_ = dtStart.Add(toNow);
                        json.Append(dt_.ToString("HH:mm:ss") + "\",");
                    }

                    json.Append("\"position_end_time\":\"");
                    //json.Append((dr["POSITION_END_TIME"] == DBNull.Value ? "-" : (Convert.ToDateTime(dr["POSITION_END_TIME"]).ToString("HH:mm:ss"))) + "\",");
                    if (dr["END_TIMESTAMP_IRV"] == DBNull.Value)
                    {
                        json.Append("-" + "\",");
                    }
                    else
                    {
                        long lTime = long.Parse(dr["END_TIMESTAMP_IRV"].ToString() + "0000");
                        TimeSpan toNow = new TimeSpan(lTime);
                        DateTime dt_ = dtStart.Add(toNow);
                        json.Append(dt_.ToString("HH:mm:ss") + "\",");
                    }

                    json.Append("\"position_start_timestamp\":\"");
                    json.Append((dr["START_TIMESTAMP_IRV"] == DBNull.Value ? "-" : dr["START_TIMESTAMP_IRV"].ToString()) + "\",");
                    json.Append("\"position_end_timestamp\":\"");
                    json.Append((dr["END_TIMESTAMP_IRV"] == DBNull.Value ? "-" : dr["END_TIMESTAMP_IRV"].ToString()) + "\"},");
                }
                else if(dr["DATA_DATE"].ToString() != ds.Tables[0].Rows[i - 1]["DATA_DATE"].ToString())
                {
                    if (json[json.Length - 1].ToString() == ",")
                    {
                        json.Remove(json.Length - 1, 1);
                        json.Append("]}]},");
                    }

                    json.Append("{\"date\":\"");
                    json.Append((dr["DATA_DATE"] == DBNull.Value ? "-" : (Convert.ToDateTime(dr["DATA_DATE"]).ToString("yyyy-MM-dd"))) + "\",");
                    json.Append("\"date_start_time\":\"");
                    //json.Append((dr["DAY_START_TIME"] == DBNull.Value ? "-" : (Convert.ToDateTime(dr["DAY_START_TIME"]).ToString("HH:mm:ss"))) + "\",");
                    if (dr["DAY_START_TIMESTAMP"] == DBNull.Value)
                    {
                        json.Append("-" + "\",");
                    }
                    else
                    {
                        long lTime = long.Parse(dr["DAY_START_TIMESTAMP"].ToString() + "0000");
                        TimeSpan toNow = new TimeSpan(lTime);
                        DateTime dt_ = dtStart.Add(toNow);
                        json.Append(dt_.ToString("HH:mm:ss") + "\",");
                    }
                    json.Append("\"date_end_time\":\"");
                    //json.Append((dr["DAY_END_TIME"] == DBNull.Value ? "-" : (Convert.ToDateTime(dr["DAY_END_TIME"]).ToString("HH:mm:ss"))) + "\",");
                    if (dr["DAY_END_TIMESTAMP"] == DBNull.Value)
                    {
                        json.Append("-" + "\",");
                    }
                    else
                    {
                        long lTime = long.Parse(dr["DAY_END_TIMESTAMP"].ToString() + "0000");
                        TimeSpan toNow = new TimeSpan(lTime);
                        DateTime dt_ = dtStart.Add(toNow);
                        json.Append(dt_.ToString("HH:mm:ss") + "\",");
                    }
                    json.Append("\"date_start_timestamp\":\"");
                    json.Append((dr["DAY_START_TIMESTAMP"] == DBNull.Value ? "-" : dr["DAY_START_TIMESTAMP"].ToString()) + "\",");
                    json.Append("\"date_end_timestamp\":\"");
                    json.Append((dr["DAY_END_TIMESTAMP"] == DBNull.Value ? "-" : dr["DAY_END_TIMESTAMP"].ToString()) + "\",");


                    json.Append("\"locomotive_code\":\"");
                    json.Append((dr["LOCOMOTIVE_CODE"] == DBNull.Value ? "-" : dr["LOCOMOTIVE_CODE"].ToString()) + "\",");
                    json.Append("\"line_list\":[");

                    json.Append("{\"line_code\":\"");
                    json.Append((dr["LINE_CODE"] == DBNull.Value ? "-" : dr["LINE_CODE"].ToString()) + "\",");
                    json.Append("\"line_name\":\"");
                    json.Append((dr["LINE_CODE"] == DBNull.Value ? "-" : Api.Util.Common.getLineInfo(dr["LINE_CODE"].ToString()).LINE_NAME) + "\",");
                    json.Append("\"direction\":\"");
                    json.Append((dr["DIRECTION"] == DBNull.Value ? "-" : dr["DIRECTION"].ToString()) + "\",");
                    json.Append("\"date\":\"");
                    json.Append((dr["DATA_DATE"] == DBNull.Value ? "-" : (Convert.ToDateTime(dr["DATA_DATE"]).ToString("yyyy-MM-dd"))) + "\",");
                    json.Append("\"locomotive_code\":\"");
                    json.Append((dr["LOCOMOTIVE_CODE"] == DBNull.Value ? "-" : dr["LOCOMOTIVE_CODE"].ToString()) + "\",");
                    json.Append("\"line_start_time\":\"");
                    //json.Append((dr["LINE_START_TIME"] == DBNull.Value ? "-" : (Convert.ToDateTime(dr["LINE_START_TIME"]).ToString("HH:mm:ss"))) + "\",");
                    if (dr["START_TIMESTAMP_IRV"] == DBNull.Value)
                    {
                        json.Append("-" + "\",");
                    }
                    else
                    {
                        long lTime = long.Parse(dr["START_TIMESTAMP_IRV"].ToString() + "0000");
                        TimeSpan toNow = new TimeSpan(lTime);
                        DateTime dt_ = dtStart.Add(toNow);
                        json.Append(dt_.ToString("HH:mm:ss") + "\",");
                    }

                    json.Append("\"line_end_time\":\"");
                    //json.Append((dr["LINE_END_TIME"] == DBNull.Value ? "-" : (Convert.ToDateTime(dr["LINE_END_TIME"]).ToString("HH:mm:ss"))) + "\",");
                    //if (dr["LINE_END_TIMESTAMP"] == DBNull.Value)
                    //{
                    //    json.Append("-" + "\",");
                    //}
                    //else
                    //{
                    //    long lTime = long.Parse(dr["LINE_END_TIMESTAMP"].ToString() + "0000");
                    //    TimeSpan toNow = new TimeSpan(lTime);
                    //    DateTime dt_ = dtStart.Add(toNow);
                    //    json.Append(dt_.ToString("HH:mm:ss") + "\",");
                    //}
                    //json.Append("\"line_start_timestamp\":\"");
                    //json.Append((dr["LINE_START_TIMESTAMP"] == DBNull.Value ? "-" : dr["LINE_START_TIMESTAMP"].ToString()) + "\",");
                    //json.Append("\"line_end_timestamp\":\"");
                    //json.Append((dr["LINE_END_TIMESTAMP"] == DBNull.Value ? "-" : dr["LINE_END_TIMESTAMP"].ToString()) + "\",");
                    for (int j = i; j < ds.Tables[0].Rows.Count && (ds.Tables[0].Rows[j]["DATA_DATE"].Equals(dr["DATA_DATE"])) && (ds.Tables[0].Rows[j]["LINE_CODE"].Equals(dr["LINE_CODE"])) && (ds.Tables[0].Rows[j]["DIRECTION"].Equals(dr["DIRECTION"])) ; j++)
                    {
                        if(/*ds.Tables[0].Rows[j]["END_TIMESTAMP_IRV"] != DBNull.Value && */(j == ds.Tables[0].Rows.Count-1|| (!ds.Tables[0].Rows[j + 1]["DATA_DATE"].Equals(dr["DATA_DATE"]) || !ds.Tables[0].Rows[j + 1]["LINE_CODE"].Equals(dr["LINE_CODE"]) || !ds.Tables[0].Rows[j + 1]["DIRECTION"].Equals(dr["DIRECTION"]))))
                        {
                            if(ds.Tables[0].Rows[j]["END_TIMESTAMP_IRV"] == DBNull.Value)
                            {
                                lineENdTimestamp = -1;
                            }
                            else
                            {
                                lineENdTimestamp = Convert.ToInt64(ds.Tables[0].Rows[j]["END_TIMESTAMP_IRV"].ToString());
                            }

                        }
                    }
                    if (lineENdTimestamp == -1)
                    {
                        json.Append("-" + "\",");
                    }
                    else
                    {
                        long lTime = long.Parse(lineENdTimestamp.ToString() + "0000");
                        TimeSpan toNow = new TimeSpan(lTime);
                        DateTime dt_ = dtStart.Add(toNow);
                        json.Append(dt_.ToString("HH:mm:ss") + "\",");
                    }

                    json.Append("\"line_start_timestamp\":\"");
                    json.Append((dr["START_TIMESTAMP_IRV"] == DBNull.Value ? "-" : dr["START_TIMESTAMP_IRV"].ToString()) + "\",");
                    json.Append("\"line_end_timestamp\":\"");
                    json.Append((lineENdTimestamp == -1 ? "-" : lineENdTimestamp.ToString()) + "\",");


                    json.Append("\"position_list\":[");

                    json.Append("{\"position_code\":\"");
                    json.Append((dr["POSITION_CODE"] == DBNull.Value ? "-" : dr["POSITION_CODE"].ToString()) + "\",");
                    json.Append("\"position_name\":\"");
                    //json.Append((dr["POSITION_CODE"] == DBNull.Value ? "-" : Api.Util.Common.getStationSectionInfo(dr["POSITION_CODE"].ToString()).POSITION_NAME) + "\",");
                    if (dr["POSITION_CODE"] == DBNull.Value)
                    {
                        json.Append("-");
                        json.Append("\",");
                    }
                    else
                    {
                        string positionName = Api.Util.Common.getStationSectionInfo(dr["POSITION_CODE"].ToString()).POSITION_NAME;
                        string positionType = Api.Util.Common.getStationSectionInfo(dr["POSITION_CODE"].ToString()).POSITION_TYPE;
                        if (positionType == "Q" && dr["DIRECTION"].ToString() == "下行")
                        {
                            string[] p = positionName.Split('－');
                            json.Append(p[1] + "-" + p[0]);
                            json.Append("\",");
                        }
                        else
                        {
                            json.Append(positionName);
                            json.Append("\",");
                        }
                    }
                    json.Append("\"line_code\":\"");
                    json.Append((dr["LINE_CODE"] == DBNull.Value ? "-" : dr["LINE_CODE"].ToString()) + "\",");
                    json.Append("\"line_name\":\"");
                    json.Append((dr["LINE_CODE"] == DBNull.Value ? "-" : Api.Util.Common.getLineInfo(dr["LINE_CODE"].ToString()).LINE_NAME) + "\",");
                    json.Append("\"direction\":\"");
                    json.Append((dr["DIRECTION"] == DBNull.Value ? "-" : dr["DIRECTION"].ToString()) + "\",");
                    json.Append("\"date\":\"");
                    json.Append((dr["DATA_DATE"] == DBNull.Value ? "-" : (Convert.ToDateTime(dr["DATA_DATE"]).ToString("yyyy-MM-dd"))) + "\",");
                    json.Append("\"locomotive_code\":\"");
                    json.Append((dr["LOCOMOTIVE_CODE"] == DBNull.Value ? "-" : dr["LOCOMOTIVE_CODE"].ToString()) + "\",");
                    json.Append("\"position_start_time\":\"");
                    //json.Append((dr["POSITION_START_TIME"] == DBNull.Value ? "-" : (Convert.ToDateTime(dr["POSITION_START_TIME"]).ToString("HH:mm:ss"))) + "\",");
                    if (dr["START_TIMESTAMP_IRV"] == DBNull.Value)
                    {
                        json.Append("-" + "\",");
                    }
                    else
                    {
                        long lTime = long.Parse(dr["START_TIMESTAMP_IRV"].ToString() + "0000");
                        TimeSpan toNow = new TimeSpan(lTime);
                        DateTime dt_ = dtStart.Add(toNow);
                        json.Append(dt_.ToString("HH:mm:ss") + "\",");
                    }

                    json.Append("\"position_end_time\":\"");
                    //json.Append((dr["POSITION_END_TIME"] == DBNull.Value ? "-" : (Convert.ToDateTime(dr["POSITION_END_TIME"]).ToString("HH:mm:ss"))) + "\",");
                    if (dr["END_TIMESTAMP_IRV"] == DBNull.Value)
                    {
                        json.Append("-" + "\",");
                    }
                    else
                    {
                        long lTime = long.Parse(dr["END_TIMESTAMP_IRV"].ToString() + "0000");
                        TimeSpan toNow = new TimeSpan(lTime);
                        DateTime dt_ = dtStart.Add(toNow);
                        json.Append(dt_.ToString("HH:mm:ss") + "\",");
                    }
                    json.Append("\"position_start_timestamp\":\"");
                    json.Append((dr["START_TIMESTAMP_IRV"] == DBNull.Value ? "-" : dr["START_TIMESTAMP_IRV"].ToString()) + "\",");
                    json.Append("\"position_end_timestamp\":\"");
                    json.Append((dr["END_TIMESTAMP_IRV"] == DBNull.Value ? "-" : dr["END_TIMESTAMP_IRV"].ToString()) + "\"},");

                }
                else if(dr["LINE_CODE"].ToString() != ds.Tables[0].Rows[i - 1]["LINE_CODE"].ToString() || dr["DIRECTION"].ToString() != ds.Tables[0].Rows[i - 1]["DIRECTION"].ToString())
                {
                    if (json[json.Length - 1].ToString() == ",")
                    {
                        json.Remove(json.Length - 1, 1);
                        json.Append("]},");
                    }

                    json.Append("{\"line_code\":\"");
                    json.Append((dr["LINE_CODE"] == DBNull.Value ? "-" : dr["LINE_CODE"].ToString()) + "\",");
                    json.Append("\"line_name\":\"");
                    json.Append((dr["LINE_CODE"] == DBNull.Value ? "-" : Api.Util.Common.getLineInfo(dr["LINE_CODE"].ToString()).LINE_NAME) + "\",");
                    json.Append("\"direction\":\"");
                    json.Append((dr["DIRECTION"] == DBNull.Value ? "-" : dr["DIRECTION"].ToString()) + "\",");
                    json.Append("\"date\":\"");
                    json.Append((dr["DATA_DATE"] == DBNull.Value ? "-" : (Convert.ToDateTime(dr["DATA_DATE"]).ToString("yyyy-MM-dd"))) + "\",");
                    json.Append("\"locomotive_code\":\"");
                    json.Append((dr["LOCOMOTIVE_CODE"] == DBNull.Value ? "-" : dr["LOCOMOTIVE_CODE"].ToString()) + "\",");
                    json.Append("\"line_start_time\":\"");
                    //json.Append((dr["LINE_START_TIME"] == DBNull.Value ? "-" : (Convert.ToDateTime(dr["LINE_START_TIME"]).ToString("HH:mm:ss"))) + "\",");
                    if (dr["START_TIMESTAMP_IRV"] == DBNull.Value)
                    {
                        json.Append("-" + "\",");
                    }
                    else
                    {
                        long lTime = long.Parse(dr["START_TIMESTAMP_IRV"].ToString() + "0000");
                        TimeSpan toNow = new TimeSpan(lTime);
                        DateTime dt_ = dtStart.Add(toNow);
                        json.Append(dt_.ToString("HH:mm:ss") + "\",");
                    }

                    json.Append("\"line_end_time\":\"");
                    //json.Append((dr["LINE_END_TIME"] == DBNull.Value ? "-" : (Convert.ToDateTime(dr["LINE_END_TIME"]).ToString("HH:mm:ss"))) + "\",");
                    //if (dr["LINE_END_TIMESTAMP"] == DBNull.Value)
                    //{
                    //    json.Append("-" + "\",");
                    //}
                    //else
                    //{
                    //    long lTime = long.Parse(dr["LINE_END_TIMESTAMP"].ToString() + "0000");
                    //    TimeSpan toNow = new TimeSpan(lTime);
                    //    DateTime dt_ = dtStart.Add(toNow);
                    //    json.Append(dt_.ToString("HH:mm:ss") + "\",");
                    //}
                    //json.Append("\"line_start_timestamp\":\"");
                    //json.Append((dr["LINE_START_TIMESTAMP"] == DBNull.Value ? "-" : dr["LINE_START_TIMESTAMP"].ToString()) + "\",");
                    //json.Append("\"line_end_timestamp\":\"");
                    //json.Append((dr["LINE_END_TIMESTAMP"] == DBNull.Value ? "-" : dr["LINE_END_TIMESTAMP"].ToString()) + "\",");
                    for (int j = i; j < ds.Tables[0].Rows.Count && (ds.Tables[0].Rows[j]["DATA_DATE"].Equals(dr["DATA_DATE"])) && (ds.Tables[0].Rows[j]["LINE_CODE"].Equals(dr["LINE_CODE"])) && (ds.Tables[0].Rows[j]["DIRECTION"].Equals(dr["DIRECTION"])) ; j++)
                    {
                        if(/*ds.Tables[0].Rows[j]["END_TIMESTAMP_IRV"] != DBNull.Value && */(j == ds.Tables[0].Rows.Count-1|| (!ds.Tables[0].Rows[j + 1]["DATA_DATE"].Equals(dr["DATA_DATE"]) || !ds.Tables[0].Rows[j + 1]["LINE_CODE"].Equals(dr["LINE_CODE"]) || !ds.Tables[0].Rows[j + 1]["DIRECTION"].Equals(dr["DIRECTION"]))))
                        {
                            if(ds.Tables[0].Rows[j]["END_TIMESTAMP_IRV"] == DBNull.Value)
                            {
                                lineENdTimestamp = -1;
                            }
                            else
                            {
                                lineENdTimestamp = Convert.ToInt64(ds.Tables[0].Rows[j]["END_TIMESTAMP_IRV"].ToString());
                            }

                        }
                    }
                    if (lineENdTimestamp == -1)
                    {
                        json.Append("-" + "\",");
                    }
                    else
                    {
                        long lTime = long.Parse(lineENdTimestamp.ToString() + "0000");
                        TimeSpan toNow = new TimeSpan(lTime);
                        DateTime dt_ = dtStart.Add(toNow);
                        json.Append(dt_.ToString("HH:mm:ss") + "\",");
                    }

                    json.Append("\"line_start_timestamp\":\"");
                    json.Append((dr["START_TIMESTAMP_IRV"] == DBNull.Value ? "-" : dr["START_TIMESTAMP_IRV"].ToString()) + "\",");
                    json.Append("\"line_end_timestamp\":\"");
                    json.Append((lineENdTimestamp == -1 ? "-" : lineENdTimestamp.ToString()) + "\",");


                    json.Append("\"position_list\":[");

                    json.Append("{\"position_code\":\"");
                    json.Append((dr["POSITION_CODE"] == DBNull.Value ? "-" : dr["POSITION_CODE"].ToString()) + "\",");
                    json.Append("\"position_name\":\"");
                    //json.Append((dr["POSITION_CODE"] == DBNull.Value ? "-" : Api.Util.Common.getStationSectionInfo(dr["POSITION_CODE"].ToString()).POSITION_NAME) + "\",");
                    if (dr["POSITION_CODE"] == DBNull.Value)
                    {
                        json.Append("-");
                        json.Append("\",");
                    }
                    else
                    {
                        string positionName = Api.Util.Common.getStationSectionInfo(dr["POSITION_CODE"].ToString()).POSITION_NAME;
                        string positionType = Api.Util.Common.getStationSectionInfo(dr["POSITION_CODE"].ToString()).POSITION_TYPE;
                        if (positionType == "Q" && dr["DIRECTION"].ToString() == "下行")
                        {
                            string[] p = positionName.Split('－');
                            json.Append(p[1] + "-" + p[0]);
                            json.Append("\",");
                        }
                        else
                        {
                            json.Append(positionName);
                            json.Append("\",");
                        }
                    }
                    json.Append("\"line_code\":\"");
                    json.Append((dr["LINE_CODE"] == DBNull.Value ? "-" : dr["LINE_CODE"].ToString()) + "\",");
                    json.Append("\"line_name\":\"");
                    json.Append((dr["LINE_CODE"] == DBNull.Value ? "-" : Api.Util.Common.getLineInfo(dr["LINE_CODE"].ToString()).LINE_NAME) + "\",");
                    json.Append("\"direction\":\"");
                    json.Append((dr["DIRECTION"] == DBNull.Value ? "-" : dr["DIRECTION"].ToString()) + "\",");
                    json.Append("\"date\":\"");
                    json.Append((dr["DATA_DATE"] == DBNull.Value ? "-" : (Convert.ToDateTime(dr["DATA_DATE"]).ToString("yyyy-MM-dd"))) + "\",");
                    json.Append("\"locomotive_code\":\"");
                    json.Append((dr["LOCOMOTIVE_CODE"] == DBNull.Value ? "-" : dr["LOCOMOTIVE_CODE"].ToString()) + "\",");
                    json.Append("\"position_start_time\":\"");
                    //json.Append((dr["POSITION_START_TIME"] == DBNull.Value ? "-" : (Convert.ToDateTime(dr["POSITION_START_TIME"]).ToString("HH:mm:ss"))) + "\",");
                    if (dr["START_TIMESTAMP_IRV"] == DBNull.Value)
                    {
                        json.Append("-" + "\",");
                    }
                    else
                    {
                        long lTime = long.Parse(dr["START_TIMESTAMP_IRV"].ToString() + "0000");
                        TimeSpan toNow = new TimeSpan(lTime);
                        DateTime dt_ = dtStart.Add(toNow);
                        json.Append(dt_.ToString("HH:mm:ss") + "\",");
                    }

                    json.Append("\"position_end_time\":\"");
                    //json.Append((dr["POSITION_END_TIME"] == DBNull.Value ? "-" : (Convert.ToDateTime(dr["POSITION_END_TIME"]).ToString("HH:mm:ss"))) + "\",");
                    if (dr["END_TIMESTAMP_IRV"] == DBNull.Value)
                    {
                        json.Append("-" + "\",");
                    }
                    else
                    {
                        long lTime = long.Parse(dr["END_TIMESTAMP_IRV"].ToString() + "0000");
                        TimeSpan toNow = new TimeSpan(lTime);
                        DateTime dt_ = dtStart.Add(toNow);
                        json.Append(dt_.ToString("HH:mm:ss") + "\",");
                    }

                    json.Append("\"position_start_timestamp\":\"");
                    json.Append((dr["START_TIMESTAMP_IRV"] == DBNull.Value ? "-" : dr["START_TIMESTAMP_IRV"].ToString()) + "\",");
                    json.Append("\"position_end_timestamp\":\"");
                    json.Append((dr["END_TIMESTAMP_IRV"] == DBNull.Value ? "-" : dr["END_TIMESTAMP_IRV"].ToString()) + "\"},");

                }
                else //if(dr["POSITION_CODE"].ToString() != ds.Tables[0].Rows[i - 1]["POSITION_CODE"].ToString())
                {
                    //if (json[json.Length - 1].ToString() == ",")
                    //{
                    //    json.Remove(json.Length - 1, 1);
                    //    json.Append("]}");
                    //}

                    json.Append("{\"position_code\":\"");
                    json.Append((dr["POSITION_CODE"] == DBNull.Value ? "-" : dr["POSITION_CODE"].ToString()) + "\",");
                    json.Append("\"position_name\":\"");
                    //json.Append((dr["POSITION_CODE"] == DBNull.Value ? "-" : Api.Util.Common.getStationSectionInfo(dr["POSITION_CODE"].ToString()).POSITION_NAME) + "\",");
                    if (dr["POSITION_CODE"] == DBNull.Value)
                    {
                        json.Append("-");
                        json.Append("\",");
                    }
                    else
                    {
                        string positionName = Api.Util.Common.getStationSectionInfo(dr["POSITION_CODE"].ToString()).POSITION_NAME;
                        string positionType = Api.Util.Common.getStationSectionInfo(dr["POSITION_CODE"].ToString()).POSITION_TYPE;
                        if ((positionType == "Q") && (dr["DIRECTION"].ToString() == "下行"))
                        {
                            string[] p = positionName.Split('－');
                            json.Append(p[1] + "-" + p[0]);
                            json.Append("\",");
                        }
                        else
                        {
                            json.Append(positionName);
                            json.Append("\",");
                        }
                    }
                    json.Append("\"line_code\":\"");
                    json.Append((dr["LINE_CODE"] == DBNull.Value ? "-" : dr["LINE_CODE"].ToString()) + "\",");
                    json.Append("\"line_name\":\"");
                    json.Append((dr["LINE_CODE"] == DBNull.Value ? "-" : Api.Util.Common.getLineInfo(dr["LINE_CODE"].ToString()).LINE_NAME) + "\",");
                    json.Append("\"direction\":\"");
                    json.Append((dr["DIRECTION"] == DBNull.Value ? "-" : dr["DIRECTION"].ToString()) + "\",");
                    json.Append("\"date\":\"");
                    json.Append(dr["DATA_DATE"] == DBNull.Value ? "-" : (Convert.ToDateTime(dr["DATA_DATE"]).ToString("yyyy-MM-dd")) + "\",");
                    json.Append("\"locomotive_code\":\"");
                    json.Append(dr["LOCOMOTIVE_CODE"] == DBNull.Value ? "-" : dr["LOCOMOTIVE_CODE"].ToString() + "\",");
                    json.Append("\"position_start_time\":\"");
                    //json.Append((dr["POSITION_START_TIME"] == DBNull.Value ? "-" : (Convert.ToDateTime(dr["POSITION_START_TIME"]).ToString("HH:mm:ss"))) + "\",");
                    if (dr["START_TIMESTAMP_IRV"] == DBNull.Value)
                    {
                        json.Append("-" + "\",");
                    }
                    else
                    {
                        long lTime = long.Parse(dr["START_TIMESTAMP_IRV"].ToString() + "0000");
                        TimeSpan toNow = new TimeSpan(lTime);
                        DateTime dt_ = dtStart.Add(toNow);
                        json.Append(dt_.ToString("HH:mm:ss") + "\",");
                    }

                    json.Append("\"position_end_time\":\"");
                    //json.Append((dr["POSITION_END_TIME"] == DBNull.Value ? "-" : (Convert.ToDateTime(dr["POSITION_END_TIME"]).ToString("HH:mm:ss"))) + "\",");
                    if (dr["END_TIMESTAMP_IRV"] == DBNull.Value)
                    {
                        json.Append("-" + "\",");
                    }
                    else
                    {
                        long lTime = long.Parse(dr["END_TIMESTAMP_IRV"].ToString() + "0000");
                        TimeSpan toNow = new TimeSpan(lTime);
                        DateTime dt_ = dtStart.Add(toNow);
                        json.Append(dt_.ToString("HH:mm:ss") + "\",");
                    }

                    json.Append("\"position_start_timestamp\":\"");
                    json.Append((dr["START_TIMESTAMP_IRV"] == DBNull.Value ? "-" : dr["START_TIMESTAMP_IRV"].ToString()) + "\",");
                    json.Append("\"position_end_timestamp\":\"");
                    json.Append((dr["END_TIMESTAMP_IRV"] == DBNull.Value ? "-" : dr["END_TIMESTAMP_IRV"].ToString()) + "\"},");

                }
            }
            if (json[json.Length - 1].ToString() == ",")
            {
                json.Remove(json.Length - 1, 1);
                json.Append("]}]}]}");
            }
            json.Append("]");
            PageHelper page = new PageHelper();
            string pagejson = page.getPageJson(Convert.ToInt32(ds.Tables[0].Rows[0]["TOTAL"]), Convert.ToInt32(pageIndex), Convert.ToInt32(pageSize));//拼接分页数据
            json.Append("," + pagejson + "}");
        }

        context.Response.ContentType = "text/plain";
        context.Response.Write(json);
    }

    /// <summary>
    /// 硬盘数据管理 查看统计信息进度
    /// </summary>
    /// <param name="context"></param>
    public static void GetStatisticsProgress(HttpContext context)
    {
        string locomotiveCode = context.Request["locomotivecode"];//设备编号
        string taskType = context.Request["tasktype"];//任务类型
        string taskStatus = context.Request["taskstatus"];//任务状态
                                                          //DateTime endDate = string.IsNullOrEmpty(context.Request["endtime"]) ? DateTime.Now : Convert.ToDateTime(context.Request["endtime"]);//结束时间，若为空，则默认当前时间
                                                          //DateTime startDate = string.IsNullOrEmpty(context.Request["starttime"]) ? endDate.AddDays(-2) : Convert.ToDateTime(context.Request["starttime"]);//开始时间，若为空，则默认结束时间减去两天

        string endDate = string.IsNullOrEmpty(context.Request["endtime"]) ? DateTime.Now.ToString() : context.Request["endtime"];
        string startDate = string.IsNullOrEmpty(context.Request["starttime"]) ? DateTime.Now.AddDays(-2).ToString() : context.Request["starttime"];
        int pageSize = string.IsNullOrEmpty(context.Request["pagesize"]) ? 20 : Convert.ToInt32(context.Request["pagesize"]);
        int pageIndex = string.IsNullOrEmpty(context.Request["pageindex"]) ? 1 : Convert.ToInt32(context.Request["pageindex"]);

        int startRownum = (pageIndex - 1) * pageSize + 1;//开始行号
        int endRownum = pageSize * pageIndex;//结束行号

        //计算开始时间和结束时间的时间戳
        //TimeSpan ts_start = startDate.ToUniversalTime() - new DateTime(1970, 1, 1, 0, 0, 0, 0);
        //string startTimestamp = Convert.ToInt64(ts_start.TotalMilliseconds).ToString();

        //TimeSpan ts_end = endDate.ToUniversalTime() - new DateTime(1970, 1, 1, 0, 0, 0, 0);
        //string endTimestamp = Convert.ToInt64(ts_end.TotalMilliseconds).ToString();

        //数据访问
        System.Data.DataSet ds = ADO.HardDiskData.GetStatisticsProgress(locomotiveCode, startDate, endDate, taskType, taskStatus, startRownum, endRownum);

        //json拼接
        System.Text.StringBuilder json = new System.Text.StringBuilder();
        if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
        {
            json.Append("{\"data\":[],\"total_Rows\":\"0\",\"pageIndex\":\"0\",\"pageSize\":\"0\",\"pageOfTotal\":\"1/1\",\"pageRange\":\"0~0\",\"Current_pagesize\":\"0\",\"totalPages\":\"1\"}");
        }
        else
        {
            DateTime dtStart = TimeZone.CurrentTimeZone.ToLocalTime(new DateTime(1970, 1, 1, 0, 0, 0));

            json.Append("{\"data\":[");
            foreach(System.Data.DataRow dr in ds.Tables[0].Rows)
            {
                json.Append("{\"locomotive_code\":\"");
                json.Append((dr["LOCOMOTIVE_CODE"] == DBNull.Value ? "-" : dr["LOCOMOTIVE_CODE"].ToString()) + "\",");
                json.Append("\"task_date\":\"");
                json.Append((dr["TASK_DATE"] == DBNull.Value ? "-" : (Convert.ToDateTime(dr["TASK_DATE"]).ToString("yyyy-MM-dd"))) + "\",");
                json.Append("\"start_time\":\"");
                if (dr["START_TIMESTAMP_IRV"] == DBNull.Value)
                {
                    json.Append("-" + "\",");
                }
                else
                {
                    long lTime = long.Parse(dr["START_TIMESTAMP_IRV"].ToString() + "0000");
                    TimeSpan toNow = new TimeSpan(lTime);
                    DateTime dt_ = dtStart.Add(toNow);
                    json.Append(dt_.ToString("HH:mm:ss") + "\",");
                }

                json.Append("\"end_time\":\"");
                if (dr["END_TIMESTAMP_IRV"] == DBNull.Value)
                {
                    json.Append("-" + "\",");
                }
                else
                {
                    long lTime = long.Parse(dr["END_TIMESTAMP_IRV"].ToString() + "0000");
                    TimeSpan toNow = new TimeSpan(lTime);
                    DateTime dt_ = dtStart.Add(toNow);
                    json.Append(dt_.ToString("HH:mm:ss") + "\",");
                }

                json.Append("\"task_type\":\"");
                json.Append((dr["TYPE"] == DBNull.Value ? "-" : dr["TYPE"].ToString()) + "\",");
                json.Append("\"task_status\":\"");
                json.Append((dr["STATUS"] == DBNull.Value ? "-" : dr["STATUS"].ToString()) + "\",");
                json.Append("\"create_time\":\"");
                json.Append((dr["CREATE_TIME"] == DBNull.Value ? "-" : Convert.ToDateTime(dr["CREATE_TIME"]).ToString("yyyy-MM-dd HH:mm:ss")) + "\",");
                json.Append("\"task_progress\":\"");
                json.Append((dr["PROGRESS"] == DBNull.Value ? "-" : dr["PROGRESS"].ToString()) + "\"},");
            }
            json.Remove(json.Length - 1, 1);
            json.Append("]");
            PageHelper page = new PageHelper();
            string pagejson = page.getPageJson(Convert.ToInt32(ds.Tables[0].Rows[0]["TOTAL"]), Convert.ToInt32(pageIndex), Convert.ToInt32(pageSize));//拼接分页数据
            json.Append("," + pagejson + "}");

        }

        context.Response.ContentType = "text/plain";
        context.Response.Write(json);
    }

    /// <summary>
    /// 修改位置信息
    /// </summary>
    /// <param name="context"></param>
    public static void ModifyPosition(HttpContext context)
    {
        string locomotiveCode = context.Request["locomotivecode"];//车号
        string lineCode = context.Request["linecode"];//线路编码（修改后的）
        string direction = context.Request["direction"];//行别（修改后的）
        string P_DATE = context.Request["p_date"];//日期
                                                  //DateTime endDate = string.IsNullOrEmpty(context.Request["endtime"]) ? DateTime.Now : Convert.ToDateTime(context.Request["endtime"]);//结束时间，若为空，则默认当前时间
                                                  //DateTime startDate = string.IsNullOrEmpty(context.Request["starttime"]) ? endDate.AddDays(-2) : Convert.ToDateTime(context.Request["starttime"]);//开始时间，若为空，则默认结束时间减去两天
                                                  //string id = context.Request["id"];//区站列表对应ID

        long endTimestamp = long.Parse(context.Request["endtime"]);//开始时间戳
        long startTimestamp = long.Parse(context.Request["starttime"]);//结束时间戳

        Api.Foundation.entity.Foundation.LoginUser m_login = Api.Util.Public.GetCurrentUser();
        string userCode = m_login.USER_CODE;//用户编码

        //计算开始时间和结束时间的时间戳
        //TimeSpan ts_start = startDate.ToUniversalTime() - new DateTime(1970, 1, 1, 0, 0, 0, 0);
        //string startTimestamp1 = Convert.ToInt64(ts_start.TotalMilliseconds).ToString();
        //long startTimestamp = long.Parse(startTimestamp1);

        //TimeSpan ts_end = endDate.ToUniversalTime() - new DateTime(1970, 1, 1, 0, 0, 0, 0);
        //string endTimestamp1 = Convert.ToInt64(ts_end.TotalMilliseconds).ToString();
        //long endTimestamp = long.Parse(endTimestamp1);

        //执行存储过程，完成位置修改操作
        int result = ADO.HardDiskData.ModifyPositionMessage(locomotiveCode, lineCode, direction, startTimestamp, endTimestamp, P_DATE, userCode);

        context.Response.ContentType = "text/plain";
        context.Response.Write(result);
    }

    public bool IsReusable {
        get {
            return false;
        }
    }

}