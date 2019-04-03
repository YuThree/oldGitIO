<%@ WebHandler Language="C#" Class="AlarmArcingAnalysis" %>

using System;
using System.Web;

public class AlarmArcingAnalysis : ReferenceClass,IHttpHandler {
    /// <summary>
    /// 燃弧分析页面，业务逻辑层代码  by TJY 2017.2.16
    /// </summary>
    /// <param name="context"></param>
    public void ProcessRequest (HttpContext context) {
        string type = context.Request["active"];
        switch (type)
        {
            case "analyse"://查询燃弧信息
                QueryArcingMessage();
                break;
        }
    }

    /// <summary>
    /// 查询燃弧分析信息
    /// </summary>
    public static void QueryArcingMessage()
    {
        string positionType = HttpContext.Current.Request["positionType"];//位置类型（线路or区站）
        string positionCode = HttpContext.Current.Request["positionCode"];//位置编码
        string lineCode = null;
        string direction = HttpContext.Current.Request["direction"];//行别（无行别为undefined）
        string startTime = HttpContext.Current.Request["startTime"];//开始时间（不能为空）
        string endTime = HttpContext.Current.Request["endTime"];//结束时间（不能为空）
        int pageSize = HttpContext.Current.Request["pageSize"] == null ? 0:Convert.ToInt32(HttpContext.Current.Request["pageSize"]) ;//分页大小
        int pageIndex = HttpContext.Current.Request["pageIndex"]==null?0:Convert.ToInt32(HttpContext.Current.Request["pageIndex"]);//当前页码

        //计算分页起止行号
        //int startRownum = 0;
        //int endRownum = 0;
        //if(pageIndex ==null || pageSize == null)
        //{
        //    startRownum = 1;
        //    endRownum = 200;
        //}
        //else
        //{
        //    startRownum = Convert.ToInt32(pageSize) * (Convert.ToInt32(pageIndex) - 1)+1;
        //    endRownum = Convert.ToInt32(pageSize) * Convert.ToInt32(pageIndex);
        //}

        //数据查询  原来的方法 弃用
        //System.Data.DataSet ds = new System.Data.DataSet();
        //if (positionType == "LINE")//第一级查询，线路列表
        //{
        //    ds = ADO.ArcingAnalyse.LineAnalyse(positionCode,direction,startTime,endTime,startRownum,endRownum);
        //}
        //else if (positionType == "POSITION")//第二级查询，区站列表
        //{
        //    ds = ADO.ArcingAnalyse.PositionAnalyse(positionCode, direction, startTime, endTime);
        //}else if (positionType == "TRAIN")//第三级查询，车辆列表
        //{
        //    ds = ADO.ArcingAnalyse.TrainAnalyse(positionCode, direction, startTime, endTime);
        //}

        if(positionType == "LINE")
        {
            lineCode = positionCode;
            positionCode = null;
        }
        if (positionType == "POSITION")
        {
            //positionCode = positionCode;
            lineCode = null;
        }

        //数据查询
        System.Data.DataSet ds_ = ADO.ArcingAnalyse.GetArcingList(lineCode,positionCode,direction,startTime,endTime, pageSize, pageIndex);



        //Json拼接
        System.Text.StringBuilder json = new System.Text.StringBuilder();
        if (ds_.Tables.Count == 0 || ds_.Tables[0].Rows.Count == 0)
        {
            json.Append("{\"data\":[],\"total_Rows\":\"0\",\"pageIndex\":\"0\",\"pageSize\":\"0\",\"pageOfTotal\":\"1/1\",\"pageRange\":\"0~0\",\"Current_pagesize\":\"0\",\"totalPages\":\"1\"}");
        }else
        {
            try
            {
                json.Append("{\"data\":[");
                for (int i = 0; i < ds_.Tables[0].Rows.Count; i++)
                {
                    System.Data.DataRow dr = ds_.Tables[0].Rows[i];

                    if (dr["DLEVEL"].ToString() == "3")
                    {
                        if (i != 0)
                        {
                            if (ds_.Tables[0].Rows[i - 1]["DLEVEL"].ToString() == "0")
                            {
                                json.Remove(json.Length - 1, 1);
                                json.Append("]}]},");
                            }
                            if (ds_.Tables[0].Rows[i - 1]["DLEVEL"].ToString() == "1")
                            {
                                json.Remove(json.Length - 1, 1);
                                json.Append("]}]},");
                            }

                        }


                        json.Append("{\"line\":\"");
                        json.Append(dr["LINE_CODE"] == DBNull.Value ? "-" : Api.Util.Common.getLineInfo(dr["LINE_CODE"].ToString()).LINE_NAME);
                        json.Append("\",\"line_code\":\"");
                        json.Append(dr["LINE_CODE"] == DBNull.Value ? "-" : dr["LINE_CODE"].ToString());
                        json.Append("\",\"alarmid\":\"");
                        json.Append(dr["ALARM_ID"] == DBNull.Value ? "-" : dr["ALARM_ID"].ToString());
                        json.Append("\",\"direction\":\"");
                        json.Append(dr["DIRECTION"] == DBNull.Value ? "-" : dr["DIRECTION"].ToString());
                        json.Append("\",\"date\":\"");
                        json.Append(dr["RAISED_TIME"] == DBNull.Value ? "-" : Convert.ToDateTime(dr["RAISED_TIME"]).ToString("yyyy-MM-dd"));
                        json.Append("\",\"loco_cnt\":\"");
                        json.Append(dr["LOCO_CNT"] == DBNull.Value ? "-" : dr["LOCO_CNT"].ToString());
                        json.Append("\",\"spark_cnt\":\"");
                        json.Append(dr["SPARK_CNT"] == DBNull.Value ? "-" : dr["SPARK_CNT"].ToString());
                        json.Append("\",\"spark_tm\":\"");
                        json.Append(dr["SPARK_TM"] == DBNull.Value ? "-" : dr["SPARK_TM"].ToString());
                        json.Append("\",\"msc\":\"");
                        json.Append(dr["MSC"] == DBNull.Value ? 0 : (Convert.ToInt64(dr["MSC"]) / 60000));
                        json.Append("\",\"spark_rate\":\"");
                        json.Append(dr["SPARK_RATE"] == DBNull.Value ? "-" : dr["SPARK_RATE"]);
                        json.Append("\",");
                        json.Append("\"spark_mx\":\"");
                        json.Append(dr["SPARK_MX"] == DBNull.Value ? "-" : dr["SPARK_MX"]);
                        json.Append("\",\"data\":[");
                    }

                    if (dr["DLEVEL"].ToString() == "1")
                    {
                        if (i != 0)
                        {
                            if (ds_.Tables[0].Rows[i - 1]["DLEVEL"].ToString() == "0")
                            {
                                json.Remove(json.Length - 1, 1);
                                json.Append("]},");
                            }
                            if (ds_.Tables[0].Rows[i - 1]["DLEVEL"].ToString() == "1")
                            {
                                json.Remove(json.Length - 1, 1);
                                json.Append("]},");
                            }

                        }

                        json.Append("{\"position_name\":\"");
                        json.Append(dr["POSITION_CODE"] == DBNull.Value ? "-" :Api.Util.Common.getStationSectionInfo(dr["POSITION_CODE"].ToString()).POSITION_NAME);
                        json.Append("\",\"position_code\":\"");
                        json.Append(dr["POSITION_CODE"] == DBNull.Value ? "-" :dr["POSITION_CODE"].ToString());
                        json.Append("\",\"direction\":\"");
                        json.Append(dr["DIRECTION"] == DBNull.Value ? "-" :dr["DIRECTION"].ToString());
                        json.Append("\",\"alarmid\":\"");
                        json.Append(dr["ALARM_ID"] == DBNull.Value ? "-" : dr["ALARM_ID"].ToString());
                        json.Append("\",\"date\":\"");
                        json.Append(dr["RAISED_TIME"] == DBNull.Value ? "-" :Convert.ToDateTime(dr["RAISED_TIME"]).ToString("yyyy-MM-dd"));
                        json.Append("\",\"loco_cnt\":\"");
                        json.Append(dr["LOCO_CNT"] == DBNull.Value ? "-" :dr["LOCO_CNT"].ToString());
                        json.Append("\",\"spark_cnt\":\"");
                        json.Append(dr["SPARK_CNT"] == DBNull.Value ? "-" :dr["SPARK_CNT"].ToString());
                        json.Append("\",\"spark_tm\":\"");
                        json.Append(dr["SPARK_TM"] == DBNull.Value ? "-" :dr["SPARK_TM"].ToString());
                        json.Append("\",\"msc\":\"");
                        json.Append(dr["MSC"] == DBNull.Value ? 0 : (Convert.ToInt64(dr["MSC"]) / 60000));
                        json.Append("\",\"spark_rate\":\"");
                        json.Append(dr["SPARK_RATE"] == DBNull.Value ? "-" :dr["SPARK_RATE"]);
                        json.Append("\",");
                        json.Append("\"spark_mx\":\"");
                        json.Append(dr["SPARK_MX"] == DBNull.Value ? "-" :dr["SPARK_MX"]);
                        json.Append("\",\"data\":[");
                    }

                    if (dr["DLEVEL"].ToString() == "0")
                    {
                        json.Append("{\"LOCOMOTIVE_CODE\":\"");
                        json.Append(dr["LOCOMOTIVE_CODE"] == DBNull.Value ? "-" :dr["LOCOMOTIVE_CODE"].ToString());
                        json.Append("\",\"speed\":\"");
                        json.Append(dr["AVG_SPEED"] == DBNull.Value ? "-" :dr["AVG_SPEED"].ToString()); //平均速度
                        json.Append("\",\"date\":\"");
                        json.Append(dr["RAISED_TIME"] == DBNull.Value ? "-" :Convert.ToDateTime(dr["RAISED_TIME"]).ToString("yyyy-MM-dd"));
                        json.Append("\",\"loco_cnt\":\"");
                        json.Append(dr["LOCO_CNT"] == DBNull.Value ? "-" :dr["LOCO_CNT"].ToString());
                        json.Append("\",\"spark_cnt\":\"");
                        json.Append(dr["SPARK_CNT"] == DBNull.Value ? "-" :dr["SPARK_CNT"].ToString());
                        json.Append("\",\"spark_tm\":\"");
                        json.Append(dr["SPARK_TM"] == DBNull.Value ? "-" :dr["SPARK_TM"].ToString());
                        json.Append("\",\"msc\":\"");
                        json.Append(dr["MSC"] == DBNull.Value ? 0 :(Convert.ToInt64(dr["MSC"]) / 60000));
                        json.Append("\",\"spark_rate\":\"");
                        json.Append(dr["SPARK_RATE"] == DBNull.Value ? "-" :dr["SPARK_RATE"]);
                        json.Append("\",");
                        json.Append("\"spark_mx\":\"");
                        json.Append(dr["SPARK_MX"] == DBNull.Value ? "-" :dr["SPARK_MX"]);
                        json.Append("\",\"alarmid\":\"");
                        json.Append(dr["ALARM_ID"] == DBNull.Value ? "-" : dr["ALARM_ID"].ToString());
                        json.Append("\"},");
                    }



                }
                if (json[json.Length - 1].ToString() == ",")
                {
                    json.Remove(json.Length - 1, 1);
                    json.Append("]}]}");
                }

                json.Append("]");
                PageHelper page = new PageHelper();
                string pagejson = page.getPageJson(Convert.ToInt32(ds_.Tables[0].Rows[0]["TOTAL_ROWS"]), Convert.ToInt32(pageIndex), Convert.ToInt32(pageSize));//拼接分页数据
                json.Append("," + pagejson + ",\"positiontype\":\""+positionType+"\"}");

            }
            catch(Exception ex)
            {
                log4net.ILog log = log4net.LogManager.GetLogger("燃弧分析页面json拼接出错");
                log.Error(ex);
            }
        }


        HttpContext.Current.Response.ContentType = "text/plain";
        HttpContext.Current.Response.Write(json);
    }

    public bool IsReusable {
        get {
            return false;
        }
    }

}