<%@ WebHandler Language="C#" Class="AlarmDelayDetails" %>

using System;
using System.Web;

public class AlarmDelayDetails : ReferenceClass , IHttpHandler {

    public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "text/plain";
        switch (context.Request["active"])
        {
            case "query":
                QueryDelayList();
                break;
        }
        //context.Response.Write("Hello World");
    }

    public void QueryDelayList()
    {
        string LocomotiveCode = HttpContext.Current.Request["LocomotiveCode"];//车号
        string orgCode = HttpContext.Current.Request["orgCode"];//组织机构代码
        string orgType = HttpContext.Current.Request["orgType"];//组织机构类型
        string positionCode = HttpContext.Current.Request["positionCode"];//区站代码
        string positionType = HttpContext.Current.Request["positionType"];//区站类型
        string startTime = HttpContext.Current.Request["startTime"];//开始时间
        string endTime = HttpContext.Current.Request["endTime"];//结束时间
        string delayType = HttpContext.Current.Request["delayType"];//延迟时间类型
        double minDelayTime = HttpContext.Current.Request["minDelayTime"]=="-1"?-1:Convert.ToDouble(HttpContext.Current.Request["minDelayTime"]);//最小延迟时间
        double maxDelayTime = HttpContext.Current.Request["maxDelayTime"]=="-1"?-1:Convert.ToDouble(HttpContext.Current.Request["maxDelayTime"]);//最大延迟时间
        int pageSize = Convert.ToInt32(HttpContext.Current.Request["pageSize"]);//页大小
        int pageIndex = Convert.ToInt32(HttpContext.Current.Request["pageIndex"]);//当前页
        string order= HttpContext.Current.Request["order"];//排序属性
        string by = HttpContext.Current.Request["by"];//排序方式


        if (String.IsNullOrEmpty(order))
        {
            order = "MAXFILEDELAY";//默认排序方式为最长延时时间
        }
        if (String.IsNullOrEmpty(by))
        {
            by = "DESC";
        }
        string orderby = order + " " + by;//排序语句

        //数据查询
        System.Data.DataSet ds = ADO.FileTimeDelay.QueryAlarmListTimeDelay(LocomotiveCode, orgCode, orgType, positionCode, positionType, startTime, endTime, delayType, minDelayTime, maxDelayTime, pageSize, pageIndex ,orderby);
        int total = ADO.FileTimeDelay.QueryTotalCount(LocomotiveCode, orgCode, orgType, positionCode, positionType, startTime, endTime, delayType, minDelayTime, maxDelayTime);
        string json = null;
        if (total != -1 && ds.Tables.Count != 0)
        {
            try
            {
                json = getJson(ds, pageSize, pageIndex,total);//转换为json
            }
            catch(Exception ex)
            {
                log4net.ILog log = log4net.LogManager.GetLogger("获取报警延迟详情页数据，转json出错");
                log.Error("执行出错", ex);
            }
        }
        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }

    //将Dataset转为json
    public static string getJson(System.Data.DataSet ds, int pagesize, int pageindex,int total)
    {
        System.Text.StringBuilder json = new System.Text.StringBuilder("{\"data\":");
        string dtjson = ToJsonChangeTime(ds.Tables[0]);//拼接data数据
        json.Append(dtjson);
        int total_rows = ds.Tables[0].Rows.Count > 0 ? Convert.ToInt32(total) : 0;
        PageHelper page = new PageHelper();
        string pagejson = page.getPageJson(total_rows, pageindex, pagesize);//拼接分页数据
        json.Append("," + pagejson + "}");

        return json.ToString();
    }


    //将时间转为要求的json格式
    public static string ToJsonChangeTime(System.Data.DataTable dt)
    {
        System.Text.StringBuilder jsonString = new System.Text.StringBuilder();
        jsonString.Append("[");
        System.Data.DataRowCollection drc = dt.Rows;
        if (drc.Count > 0)
        {
            for (int i = 0; i < drc.Count; i++)
            {
                jsonString.Append("{");

                Api.Fault.entity.alarm.C3_Alarm c3_alarm = new Api.Fault.entity.alarm.C3_Alarm();
                c3_alarm.LINE_NAME= dt.Rows[i]["LINE_NAME"]==System.DBNull.Value?null:dt.Rows[i]["LINE_NAME"].ToString();
                c3_alarm.DIRECTION= dt.Rows[i]["DIRECTION"]==System.DBNull.Value?null:dt.Rows[i]["DIRECTION"].ToString();
                c3_alarm.KM_MARK= Convert.ToInt32(dt.Rows[i]["KM_MARK"]==System.DBNull.Value?0:dt.Rows[i]["KM_MARK"]);
                c3_alarm.POLE_NUMBER= dt.Rows[i]["POLE_NUMBER"]==System.DBNull.Value?null:dt.Rows[i]["POLE_NUMBER"].ToString();
                c3_alarm.BRG_TUN_NAME= dt.Rows[i]["BRG_TUN_NAME"]==System.DBNull.Value?null:dt.Rows[i]["BRG_TUN_NAME"].ToString();
                c3_alarm.POSITION_NAME= dt.Rows[i]["POSITION_NAME"]==System.DBNull.Value?null:dt.Rows[i]["POSITION_NAME"].ToString();
                c3_alarm.DEVICE_ID = dt.Rows[i]["DEVICE_ID"]==System.DBNull.Value?null:dt.Rows[i]["DEVICE_ID"].ToString();
                c3_alarm.ROUTING_NO = dt.Rows[i]["ROUTING_NO"]==System.DBNull.Value?null:dt.Rows[i]["ROUTING_NO"].ToString();
                c3_alarm.AREA_NO = dt.Rows[i]["AREA_NO"]==System.DBNull.Value?null:dt.Rows[i]["AREA_NO"].ToString();
                c3_alarm.STATION_NO = dt.Rows[i]["STATION_NO"]==System.DBNull.Value?null:dt.Rows[i]["STATION_NO"].ToString();
                c3_alarm.STATION_NAME = dt.Rows[i]["STATION_NAME"] == System.DBNull.Value ? null : dt.Rows[i]["STATION_NAME"].ToString();
                c3_alarm.TAX_MONITOR_STATUS = dt.Rows[i]["TAX_MONITOR_STATUS"] == System.DBNull.Value ? null : dt.Rows[i]["TAX_MONITOR_STATUS"].ToString();
                string wz = PublicMethod.GetPosition_Alarm(c3_alarm.LINE_NAME,c3_alarm.POSITION_NAME,c3_alarm.BRG_TUN_NAME,c3_alarm.DIRECTION,c3_alarm.KM_MARK,c3_alarm.POLE_NUMBER,c3_alarm.DEVICE_ID,c3_alarm.ROUTING_NO,c3_alarm.AREA_NO,c3_alarm.STATION_NO,c3_alarm.STATION_NAME,c3_alarm.TAX_MONITOR_STATUS);//获取位置信息
                jsonString.Append("\"wz\":");
                jsonString.Append("\"" + wz + "\",");

                for (int j = 0; j < dt.Columns.Count; j++)
                {
                    string strKey = dt.Columns[j].ColumnName;
                    string strValue = /*drc[i][j]== System.DBNull.Value ? null :*/drc[i][j].ToString();
                    if ((strKey.Contains("RAISED_TIME") || strKey.Contains("_TM")) && (!string.IsNullOrEmpty(strValue)))
                    {
                        strValue = Convert.ToDateTime(strValue).ToString("yyyy-MM-dd HH:mm:ss");
                    }
                    Type type = dt.Columns[j].DataType;
                    jsonString.Append("\"" + strKey + "\":");
                    strValue = String.Format(strValue, type);
                    if (j < dt.Columns.Count - 1)
                    {
                        jsonString.Append("\"" + strValue + "\",");
                    }
                    else
                    {
                        jsonString.Append("\"" + strValue + "\"");
                    }
                }
                jsonString.Append("},");
            }
            jsonString.Remove(jsonString.Length - 1, 1);
        }
        jsonString.Append("]");
        return jsonString.ToString();
    }

    public bool IsReusable {
        get {
            return false;
        }
    }

}