<%@ WebHandler Language="C#" Class="AlarmStatistical_PowerSupply" %>

using System;
using System.Web;

public class AlarmStatistical_PowerSupply : ReferenceClass, IHttpHandler {

    public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "text/plain";

        string action = HttpContext.Current.Request["active"];

        switch (action)
        {
            case "query":
                QueryAlarmDistinctByBureau();
                break;
        }
        //context.Response.Write("Hello World");
    }

    /// <summary>
    /// 按供电段统计过去24小时的报警
    /// </summary>
    public void QueryAlarmDistinctByBureau()
    {
        string StartTime = HttpContext.Current.Request["starttime"];
        string EndTime = HttpContext.Current.Request["endtime"];

        //如果结束时间为空，设为当前系统时间，
        if (String.IsNullOrEmpty(EndTime))
        {
            EndTime = DateTime.Now.ToString();
        }
        //如果开始时间为空，设为结束时间之前24小时
        if (String.IsNullOrEmpty(StartTime))
        {
            StartTime = Convert.ToDateTime(EndTime).AddHours(-24).ToString();
        }

        //数据查询
        System.Data.DataSet ds = ADO.Alarm_ConfirmImpl.AlarmStatisticsByBureau(StartTime, EndTime, null, null);

        //转JSON
        string json = null;
        try
        {

            if (ds.Tables.Count != 0)
            {
                json = getjson(ds.Tables[0]);
            }
        }
        catch(Exception ex)
        {
            log4net.ILog log = log4net.LogManager.GetLogger("按铁路局和供电段统计报警处理情况转JSON");
            log.Error("执行出错", ex);
        }


        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }

    /// <summary>
    /// 获取json
    /// </summary>
    /// <param name="dt"></param>
    /// <returns></returns>
    public string getjson(System.Data.DataTable dt)
    {
        System.Text.StringBuilder json = new System.Text.StringBuilder();
        json.Append("{\"data\":[");

        for(int i = 0; i < dt.Rows.Count; i++)
        {
            if (i == 0 || (i !=0 && (dt.Rows[i]["BUREAU_CODE"]==DBNull.Value?null:dt.Rows[i]["BUREAU_CODE"].ToString())!=(dt.Rows[i-1]["BUREAU_CODE"]==DBNull.Value?null:dt.Rows[i-1]["BUREAU_CODE"].ToString())))
            {
                json.Append("{\"bureau\":");
                json.Append("\""+dt.Rows[i]["BUREAU_NAME"]+"|"+dt.Rows[i]["BUREAU_ALARM_COUNT"]+"|"+dt.Rows[i]["BUREAU_CODE"]+"\",\"org\":[");

            }
            //else if(dt.Rows[i]["BUREAU_CODE"].ToString()!= dt.Rows[i-1]["BUREAU_CODE"].ToString())
            //{
            //    json.Append("{\"bureau\":");
            //    json.Append("\""+dt.Rows[i]["BUREAU_NAME"]+"|"+dt.Rows[i]["BUREAU_ALARM_COUNT"]+"\",");
            //}

            //铁路局下辖供电段
            json.Append("\"" + (dt.Rows[i]["ORG_NAME"]==DBNull.Value?"无":dt.Rows[i]["ORG_NAME"].ToString())+"|"+dt.Rows[i]["ORG_ALARM_COUNT"]+"|"+dt.Rows[i]["ORG_CODE"] +"\",");


            if (i==dt.Rows.Count-1 || (dt.Rows[i]["BUREAU_CODE"]==DBNull.Value?null:dt.Rows[i]["BUREAU_CODE"].ToString())!=(dt.Rows[i+1]["BUREAU_CODE"]==DBNull.Value?null:dt.Rows[i+1]["BUREAU_CODE"].ToString()))
            {
                json.Remove(json.Length - 1, 1);
                json.Append("]},");;

            }

        }
        if (dt.Rows.Count != 0)
        {
            json.Remove(json.Length - 1, 1);
        }

        json.Append("]}");
        return json.ToString();
    }

    public bool IsReusable {
        get {
            return false;
        }
    }

}