<%@ WebHandler Language="C#" Class="HardDiskRecord" %>

using System;
using System.Web;

public class HardDiskRecord : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        string type = HttpContext.Current.Request["active"];
        switch (type)
        {
            case "GetList":
                GetList(context);
                break;
            case "SetRecord":
                SetRecord(context);
                break;
        }

    }


    private void GetList(HttpContext context)
    {
        String endDate = context.Request["end_time"];//结束时间
        String startDate = context.Request["start_time"];//开始时间
        int pageSize = string.IsNullOrEmpty(context.Request["pagesize"]) ? 20 : Convert.ToInt32(context.Request["pagesize"]);
        int pageIndex = string.IsNullOrEmpty(context.Request["pageindex"]) ? 1 : Convert.ToInt32(context.Request["pageindex"]);
        string locomotive_code = context.Request["locomotive_code"];//车号
        string instruction = context.Request["instruction"];//描述
        int startRownum = (pageIndex - 1) * pageSize + 1;//开始行号
        int endRownum = pageSize * pageIndex;//结束行号

        //计算开始时间和结束时间的时间戳
        string startTimestamp = "";
        string endTimestamp = "";
        if (!string.IsNullOrEmpty(startDate))
        {
            TimeSpan ts_start = Convert.ToDateTime(startDate).ToUniversalTime() - new DateTime(1970, 1, 1, 0, 0, 0, 0);
            startTimestamp = Convert.ToInt64(ts_start.TotalMilliseconds).ToString();
        }
        if (!string.IsNullOrEmpty(endDate))
        {
            TimeSpan ts_end = Convert.ToDateTime(endDate).ToUniversalTime() - new DateTime(1970, 1, 1, 0, 0, 0, 0);
            endTimestamp = Convert.ToInt64(ts_end.TotalMilliseconds).ToString();
        }

        //数据访问
        System.Data.DataSet ds = ADO.HardDiskData.GetHardRecord(locomotive_code, instruction, startTimestamp, endTimestamp, startRownum, endRownum);

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
                json.Append("\"start_time\":\"");
                if (dr["START_TIME"] == DBNull.Value)
                {
                    json.Append("-" + "\",");
                }
                else
                {
                    long lTime = long.Parse(dr["START_TIME"].ToString() + "0000");
                    TimeSpan toNow = new TimeSpan(lTime);
                    DateTime dt_ = dtStart.Add(toNow);
                    json.Append(dt_.ToString("yyyy/MM/dd HH:mm:ss") + "\",");
                }

                json.Append("\"end_time\":\"");
                if (dr["END_TIME"] == DBNull.Value)
                {
                    json.Append("-" + "\",");
                }
                else
                {
                    long lTime = long.Parse(dr["END_TIME"].ToString() + "0000");
                    TimeSpan toNow = new TimeSpan(lTime);
                    DateTime dt_ = dtStart.Add(toNow);
                    json.Append(dt_.ToString("yyyy/MM/dd HH:mm:ss") + "\",");
                }
                json.Append("\"instruction\":\"");
                json.Append((dr["INSTRUCTION"] == DBNull.Value ? "-" : dr["INSTRUCTION"].ToString()) + "\",");
                json.Append("\"priority\":\"");
                json.Append((dr["PRIORITY"] == DBNull.Value ? "-" : dr["PRIORITY"].ToString()) + "\",");
                json.Append("\"status\":\"");
                json.Append((dr["STATUS"] == DBNull.Value ? "-" : dr["STATUS"].ToString()) + "\",");
                json.Append("\"create_time\":\"");
                json.Append((dr["CREAT_TIME"] == DBNull.Value ? "-" : Convert.ToDateTime(dr["CREAT_TIME"]).ToString("yyyy-MM-dd HH:mm:ss")) + "\",");
                json.Append("\"creat_person_name\":\"");
                json.Append((dr["CREAT_PERSON_NAME"] == DBNull.Value ? "-" : dr["CREAT_PERSON_NAME"].ToString()) + "\"},");
            }
            json.Remove(json.Length - 1, 1);
            json.Append("]");
            PageHelper page = new PageHelper();
            string pagejson = page.getPageJson(Convert.ToInt32(ds.Tables[0].Rows[0]["TOTAL"]), Convert.ToInt32(pageIndex), Convert.ToInt32(pageSize));//拼接分页数据
            json.Append("," + pagejson + "}");

        }
        context.Response.ContentType = "application/json";
        context.Response.Write(json);
    }


    private void SetRecord(HttpContext context)
    {
        DateTime endDate = Convert.ToDateTime(context.Request["end_time"]);//结束时间
        DateTime startDate = Convert.ToDateTime(context.Request["start_time"]);//开始时间
        string locomotive_code = context.Request["locomotive_code"];//车号
        string instruction = context.Request["instruction"];//描述
        string priority = context.Request["priority"];//优先级

        //计算开始时间和结束时间的时间戳
        TimeSpan ts_start = startDate.ToUniversalTime() - new DateTime(1970, 1, 1, 0, 0, 0, 0);
        string startTimestamp = Convert.ToInt64(ts_start.TotalMilliseconds).ToString();

        TimeSpan ts_end = endDate.ToUniversalTime() - new DateTime(1970, 1, 1, 0, 0, 0, 0);
        string endTimestamp = Convert.ToInt64(ts_end.TotalMilliseconds).ToString();

        Api.Foundation.entity.Foundation.LoginUser m_login = Api.Util.Public.GetCurrentUser();
        string userCode = m_login.USER_CODE;//用户编码
        string userName = m_login.PersonName;//用户名


        //数据访问
        bool result = ADO.HardDiskData.InsertRecord(locomotive_code, instruction, startTimestamp, endTimestamp, priority ,userName,userCode);

        string re = "失败";
        if (result)
            re = "成功";

        context.Response.ContentType = "application/json";
        context.Response.Write(re);
    }



    public bool IsReusable
    {
        get
        {
            return false;
        }
    }


}