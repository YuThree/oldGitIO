<%@ WebHandler Language="C#" Class="AlarmStatisticalTrend" %>

using System;
using System.Web;

public class AlarmStatisticalTrend :ReferenceClass, IHttpHandler {

    public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "text/plain";
        string active = HttpContext.Current.Request["active"];
        switch(active){
            case "query":
                QueryAlarmStatistics();
                break;
        }
        //context.Response.Write("Hello World");
    }

    /// <summary>
    /// 按天统计报警数量及处理情况
    /// </summary>
    public void QueryAlarmStatistics()
    {
        string StartTime = HttpContext.Current.Request["starttime"];
        string EndTime = HttpContext.Current.Request["endtime"];
        string ORGcode = HttpContext.Current.Request["orgcode"];
        string ORGtype = HttpContext.Current.Request["orgtype"]=="J"?"BUREAU_CODE":"ORG_CODE";
        //如果结束时间为空，设为当前系统时间，
        if (String.IsNullOrEmpty(EndTime))
        {
            EndTime = DateTime.Now.ToString();
        }
        //如果开始时间为空，设为结束时间之前7天
        if (String.IsNullOrEmpty(StartTime))
        {
            StartTime = Convert.ToDateTime(EndTime).AddDays(-7).ToString();
        }

        //数据查询
        System.Data.DataSet ds = ADO.Alarm_ConfirmImpl.AlarmStatisticsByDay(StartTime,EndTime,ORGtype,ORGcode);

        //转JSON
        string json = null;
        try
        {

            if (ds.Tables.Count != 0)
            {
                json = JsonUtil.ToJson(ds.Tables[0]);
            }
        }
        catch(Exception ex)
        {
            log4net.ILog log = log4net.LogManager.GetLogger("按天统计报警处理情况转JSON");
            log.Error("执行出错", ex);
        }


        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }

    public bool IsReusable {
        get {
            return false;
        }
    }

}