<%@ WebHandler Language="C#" Class="GetLocGJList_New_APP" %>

using System;
using System.Web;
using Api.Fault.entity.sms;
using System.Collections.Generic;
using Api.Foundation.entity.Foundation;
using Api.Foundation.entity.Cond;
using System.Text;
using System.Data;
/// <summary>
/// 检测运行轨迹（手机端）
/// </summary>
public class GetLocGJList_New_APP : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {

        try
        {

            int pageIndex = 1;// Convert.ToInt32(HttpContext.Current.Request["page"]);  //获取前台页码
            int pageSize = 18;//Convert.ToInt32(HttpContext.Current.Request["rp"]);       //获取前台条数
            if (null != HttpContext.Current.Request["PageSize"] && !string.IsNullOrEmpty(HttpContext.Current.Request["PageSize"]))
            {
                pageSize = int.Parse(HttpContext.Current.Request["PageSize"].ToString().Trim());
            }

            if (null != HttpContext.Current.Request["page"] && !string.IsNullOrEmpty(HttpContext.Current.Request["page"]))
            {
                pageIndex = int.Parse(HttpContext.Current.Request["page"].ToString().Trim());
            }
            string ju = HttpContext.Current.Request["ju"];//局
            string jwd = HttpContext.Current.Request["jwd"]; //机务段
            string loccode = HttpContext.Current.Request["loccode"];//设备编号      
            string jlh = HttpContext.Current.Request["jlh"];//交路号
            string Type = HttpContext.Current.Request["Type"];//类型
            string line = HttpContext.Current.Request["line"];//线路

            C3_SmsCond condition = new C3_SmsCond();
            if ((!string.IsNullOrEmpty(ju)) && (ju != "0"))
            {
                condition.BUREAU_CODE = ju;
            }
            if ((!string.IsNullOrEmpty(jwd)) && (jwd != "0"))
            {
                condition.P_ORG_CODE = jwd;
            }
            if (!string.IsNullOrEmpty(loccode)&& loccode != "")
            {

                condition.LOCOMOTIVE_CODE = loccode;
            }
            if ((!string.IsNullOrEmpty(line)) && (line != "0"))
            {
                condition.LINE_CODE = line;
            }
            //获取日期
            if (HttpContext.Current.Request["startdate"] != null && HttpContext.Current.Request["startdate"] != "")
            {
                DateTime startdate = Convert.ToDateTime(HttpContext.Current.Request["startdate"]);
                condition.startTime = startdate;
            }
            if (HttpContext.Current.Request["enddate"] != null && HttpContext.Current.Request["enddate"] != "")
            {
                DateTime enddate = Convert.ToDateTime(HttpContext.Current.Request["enddate"]);
                condition.endTime = enddate;
            }
            if (jlh != null && jlh != "")
            {
                condition.ROUTING_NO = jlh;
            }
            condition.page = pageIndex;
            condition.pageSize = pageSize;

            int recs, totalpages;
            switch (Type)
            {
                case "CLD"://车辆用户视图 
                    GetCLDSms(context, pageIndex, pageSize, condition, out recs, out totalpages, "pkg_report_ex.P_C3_SMS_TRACE_STAT");
                    break;
                case "GDD"://供电用户 管辖3c设备视图 
                    GetCLDSms(context, pageIndex, pageSize, condition, out recs, out totalpages, "pkg_report_ex.P_C3_SMS_TRACE_STAT_PW");
                    break;
                case "GDD_Line"://供电用户 线路视图
                    GetGDDSms(context, pageIndex, pageSize, condition, out recs, out totalpages);
                    break;
                case "CLD_S"://车辆用户视图 (聚合)
                    GetCLDSms_S(context, 1, 100000, condition, out recs, out totalpages, "pkg_report_ex.P_C3_SMS_TRACE_STAT");
                    break;
                case "GDD_S"://供电用户 管辖3c设备视图 (聚合)
                    GetCLDSms_S(context, 1, 100000, condition, out recs, out totalpages, "pkg_report_ex.P_C3_SMS_TRACE_STAT_PW");
                    break;
                case "GDD_Line_S"://供电用户 线路视图 (聚合)
                    GetGDDSms_S(context, 1, 100000, condition, out recs, out totalpages);
                    break;

            }


        }

        catch (Exception ex)
        {
            log4net.ILog log2 = log4net.LogManager.GetLogger("检测运行轨迹列表");
            log2.Error("Error", ex);
        }
    }
    private void GetGDDSms_S(HttpContext context, int pageIndex, int pageSize, C3_SmsCond condition, out int recs, out int totalpages)
    {
        System.Data.DataSet ds = my_sms.GetGJGroup3(condition.LINE_CODE, condition.LOCOMOTIVE_CODE, condition.startTime.ToString(), condition.endTime.ToString(), pageSize, pageIndex, out recs, out totalpages);

        DataTable dt = ds.Tables[0];
        DataTable dt2 = ds.Tables[1];

        dt.Columns.Add("TRAIN_DATE", typeof(string));
        dt.Columns.Add("YLnum", typeof(string));
        dt.Columns.Add("ELnum", typeof(string));
        dt.Columns.Add("SLnum", typeof(string));
        dt.Columns.Add("GJMXurl", typeof(string));
        dt.Columns.Add("CZ", typeof(string));
        dt.Columns.Add("json1", typeof(string));
        dt.Columns.Add("json2", typeof(string));

        StringBuilder Json = new StringBuilder();

        int TotalOne = 0;
        int TotalTwo = 0;
        int TotalThree = 0;
        List<string> LocoList = new List<string>();
        List<string> LineList = new List<string>();

        if (Api.Util.Common.FunEnable("Fun_NullDirection") == false)
        {
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                if (dt.Rows[i]["LINE_CODE"] != DBNull.Value && dt.Rows[i]["DIRECTION"].ToString() == "-1")
                {
                    continue;
                }
                else
                {
                    for (int j = 0; j < dt2.Rows.Count; j++)
                    {
                        if (dt2.Rows[j]["rown"].ToString() == dt.Rows[i]["rown"].ToString())
                        {
                            if (dt2.Rows[j]["LOCOMOTIVE_CODE"] != DBNull.Value)
                            {
                                bool sign = true;
                                for (int t = 0; t < LocoList.Count; t++)
                                {
                                    if (dt2.Rows[j]["LOCOMOTIVE_CODE"].ToString() == LocoList[t])
                                    {
                                        sign = false;
                                        break;
                                    }
                                }
                                if (sign)
                                {
                                    LocoList.Add(dt2.Rows[j]["LOCOMOTIVE_CODE"].ToString());
                                }
                            }
                        }
                    }
                    if (dt.Rows[i]["LINE_CODE"] != DBNull.Value)
                    {
                        bool sign = true;
                        for (int n = 0; n < LineList.Count; n++)
                        {
                            if (dt.Rows[i]["LINE_CODE"].ToString() == LineList[n])
                            {
                                sign = false;
                                break;
                            }
                        }
                        if (sign)
                        {
                            LineList.Add(dt.Rows[i]["LINE_CODE"].ToString());
                        }
                    }
                    if (dt.Rows[i]["faultAlarmCntOfLv1"] != DBNull.Value)
                    {
                        TotalOne = TotalOne + Convert.ToInt32(dt.Rows[i]["faultAlarmCntOfLv1"]);
                    }
                    if (dt.Rows[i]["faultAlarmCntOfLv2"] != DBNull.Value)
                    {
                        TotalTwo = TotalTwo + Convert.ToInt32(dt.Rows[i]["faultAlarmCntOfLv2"]);
                    }
                    if (dt.Rows[i]["faultAlarmCntOfLv3"] != DBNull.Value)
                    {
                        TotalThree = TotalThree + Convert.ToInt32(dt.Rows[i]["faultAlarmCntOfLv3"]);
                    }
                }
            }
        }
        else
        {
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                for (int j = 0; j < dt2.Rows.Count; j++)
                {
                    if (dt2.Rows[j]["rown"].ToString() == dt.Rows[i]["rown"].ToString())
                    {
                        if (dt2.Rows[j]["LOCOMOTIVE_CODE"] != DBNull.Value)
                        {
                            bool sign = true;
                            for (int t = 0; t < LocoList.Count; t++)
                            {
                                if (dt2.Rows[j]["LOCOMOTIVE_CODE"].ToString() == LocoList[t])
                                {
                                    sign = false;
                                    break;
                                }
                            }
                            if (sign)
                            {
                                LocoList.Add(dt2.Rows[j]["LOCOMOTIVE_CODE"].ToString());
                            }
                        }
                    }
                }
                if (dt.Rows[i]["LINE_CODE"] != DBNull.Value)
                {
                    bool sign = true;
                    for (int n = 0; n < LineList.Count; n++)
                    {
                        if (dt.Rows[i]["LINE_CODE"].ToString() == LineList[n])
                        {
                            sign = false;
                            break;
                        }
                    }
                    if (sign)
                    {
                        LineList.Add(dt.Rows[i]["LINE_CODE"].ToString());
                    }
                }
                if (dt.Rows[i]["faultAlarmCntOfLv1"] != DBNull.Value)
                {
                    TotalOne = TotalOne + Convert.ToInt32(dt.Rows[i]["faultAlarmCntOfLv1"]);
                }
                if (dt.Rows[i]["faultAlarmCntOfLv2"] != DBNull.Value)
                {
                    TotalTwo = TotalTwo + Convert.ToInt32(dt.Rows[i]["faultAlarmCntOfLv2"]);
                }
                if (dt.Rows[i]["faultAlarmCntOfLv3"] != DBNull.Value)
                {
                    TotalThree = TotalThree + Convert.ToInt32(dt.Rows[i]["faultAlarmCntOfLv3"]);
                }
            }
        }
        Json.Append("{\"TotalLoco\":\"" + LocoList.Count + "\",");
        Json.Append("\"TotalLine\":\"" + LineList.Count + "\",");
        Json.Append("\"TotalOne\":\"" + TotalOne + "\",");
        Json.Append("\"TotalTwo\":\"" + TotalTwo + "\",");
        Json.Append("\"TotalThree\":\"" + TotalThree + "\",");
        Json.Append("\"TotalAlarm\":\"" + (TotalOne + TotalTwo + TotalThree) + "\"}");

        context.Response.Write(Json.ToString());
    }
    private void GetGDDSms(HttpContext context, int pageIndex, int pageSize, C3_SmsCond condition, out int recs, out int totalpages)
    {
        System.Data.DataSet ds = my_sms.GetGJGroup3(condition.LINE_CODE, condition.LOCOMOTIVE_CODE, condition.startTime.ToString(), condition.endTime.ToString(), pageSize, pageIndex, out recs, out totalpages);


        //   IList<C3_Orbit> c3orbitlist = Api.ServiceAccessor.GetSmsService().getC3OrbitByPeriod(condition);
        //    int recordCount = Api.ServiceAccessor.GetSmsService().getC3OrbitByPeriodCount(condition);


        DataTable dt = ds.Tables[0];
        dt.Columns.Add("TRAIN_DATE", typeof(string));
        dt.Columns.Add("YLnum", typeof(string));
        dt.Columns.Add("ELnum", typeof(string));
        dt.Columns.Add("SLnum", typeof(string));
        dt.Columns.Add("GJMXurl", typeof(string));
        dt.Columns.Add("CZ", typeof(string));
        dt.Columns.Add("json1", typeof(string));
        dt.Columns.Add("json2", typeof(string));

        StringBuilder Json = new StringBuilder();
        Json.Append("");
        if (Api.Util.Common.FunEnable("Fun_NullDirection") == false)
        {
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                if (dt.Rows[i]["LINE_CODE"] != DBNull.Value && dt.Rows[i]["DIRECTION"].ToString() == "-1")
                {
                    if (i == dt.Rows.Count - 1)
                    {
                        if (Json.Length > 1)
                        {
                            string myjson = Json.ToString().Substring(0, Json.ToString().Length - 1);
                            Json.Clear();
                            Json.Append(myjson);
                        }
                    }
                    continue;
                }
                else
                {
                    Json.Append("{");
                    Json.Append("\"LOCOMOTIVE_CODE\":\"" + "" + "\"");
                    Json.Append(",");
                    Json.Append("\"RUNNING_DATE\":\"" + Convert.ToDateTime(dt.Rows[i]["RUNNING_DATE"]).ToString("yyyy-MM-dd") + "\"");
                    Json.Append(",");
                    Json.Append("\"LINE_CODE\":\"" + dt.Rows[i]["LINE_CODE"] + "\"");
                    Json.Append(",");
                    Json.Append("\"LINE_CODE_QUERY\":\"" + dt.Rows[i]["LINE_CODE"] + "\"");
                    Json.Append(",");
                    Json.Append("\"LINE_NAME\":\"" + Api.Util.Common.getLineInfo(dt.Rows[i]["LINE_CODE"].ToString()).LINE_NAME + "\"");
                    Json.Append(",");
                    string DIRECTION = dt.Rows[i]["DIRECTION"].ToString();
                    if (DIRECTION == "-1")
                    {
                        DIRECTION = "";
                    }
                    Json.Append("\"DIRECTION\":\"" + DIRECTION + "\"");
                    Json.Append(",");
                    Json.Append("\"DIRECTION_QUERY\":\"" + ((dt.Rows[i]["DIRECTION"] == DBNull.Value || dt.Rows[i]["DIRECTION"].ToString() == "-1") ? "无行别" : dt.Rows[i]["DIRECTION"]) + "\"");
                    Json.Append(",");
                    Json.Append("\"loco_count\":\"" + dt.Rows[i]["loco_count"].ToString() + "\"");
                    Json.Append(",");
                    Json.Append("\"BEGIN_TIME\":\"" + GetDateTime(Convert.ToDateTime(dt.Rows[i]["BEGIN_TIME"])) + "\"");
                    Json.Append(",");
                    Json.Append("\"END_TIME\":\"" + GetDateTime(Convert.ToDateTime(dt.Rows[i]["END_TIME"])) + "\"");
                    Json.Append(",");

                    Json.Append("\"BEGIN\":\"" + Convert.ToDateTime(dt.Rows[i]["BEGIN_TIME"]).ToString("HH:mm:ss") + "\"");
                    Json.Append(",");
                    Json.Append("\"END\":\"" + Convert.ToDateTime(dt.Rows[i]["END_TIME"]).ToString("HH:mm:ss") + "\"");
                    Json.Append(",");
                    //string url = "&quot;" + context.Request["loccode"] + "&quot;,&quot;" + GetDateTime(Convert.ToDateTime(dt.Rows[i]["BEGIN_TIME"])) + "&quot;,&quot;" + GetDateTime(Convert.ToDateTime(dt.Rows[i]["END_TIME"])) + "&quot;,&quot;" + dt.Rows[i]["LINE_CODE"] + "&quot;,&quot;" + ((dt.Rows[i]["DIRECTION"] == DBNull.Value || dt.Rows[i]["DIRECTION"].ToString() == "-1") ? "无行别" : dt.Rows[i]["DIRECTION"]) + "&quot;";
                    Json.Append("\"YLnum\":\"" + dt.Rows[i]["faultAlarmCntOfLv1"] + "\"");
                    Json.Append(",");
                    Json.Append("\"ELnum\":\"" + dt.Rows[i]["faultAlarmCntOfLv2"] + "\"");
                    Json.Append(",");
                    Json.Append("\"SLnum\":\"" + dt.Rows[i]["faultAlarmCntOfLv3"] + "\"");
                    Json.Append(",");



                    Json.Append("\"json1\":" + DataTableToLocJson(dt, ds.Tables[1], i) + ""); // DataTableToRoutingNoJson(dt, ds.Tables[1], i)


                    if (i < dt.Rows.Count - 1)
                    {
                        Json.Append("},");
                    }
                    else
                    {
                        Json.Append("}");
                    }

                }
            }
        }

        else
        {
            for (int i = 0; i < dt.Rows.Count; i++)
            {

                Json.Append("{");
                Json.Append("\"LOCOMOTIVE_CODE\":\"" + "" + "\"");
                Json.Append(",");
                Json.Append("\"RUNNING_DATE\":\"" + Convert.ToDateTime(dt.Rows[i]["RUNNING_DATE"]).ToString("yyyy-MM-dd") + "\"");
                Json.Append(",");
                Json.Append("\"LINE_CODE\":\"" + dt.Rows[i]["LINE_CODE"] + "\"");
                Json.Append(",");
                Json.Append("\"LINE_CODE_QUERY\":\"" + dt.Rows[i]["LINE_CODE"] + "\"");
                Json.Append(",");
                Json.Append("\"LINE_NAME\":\"" + Api.Util.Common.getLineInfo(dt.Rows[i]["LINE_CODE"].ToString()).LINE_NAME + "\"");
                Json.Append(",");
                string DIRECTION = dt.Rows[i]["DIRECTION"].ToString();
                if (DIRECTION == "-1")
                {
                    DIRECTION = "";
                }
                Json.Append("\"DIRECTION\":\"" + DIRECTION + "\"");
                Json.Append(",");
                Json.Append("\"DIRECTION_QUERY\":\"" + ((dt.Rows[i]["DIRECTION"] == DBNull.Value || dt.Rows[i]["DIRECTION"].ToString() == "-1") ? "无行别" : dt.Rows[i]["DIRECTION"]) + "\"");
                Json.Append(",");
                Json.Append("\"loco_count\":\"" + dt.Rows[i]["loco_count"].ToString() + "\"");
                Json.Append(",");
                Json.Append("\"BEGIN_TIME\":\"" + GetDateTime(Convert.ToDateTime(dt.Rows[i]["BEGIN_TIME"])) + "\"");
                Json.Append(",");
                Json.Append("\"END_TIME\":\"" + GetDateTime(Convert.ToDateTime(dt.Rows[i]["END_TIME"])) + "\"");
                Json.Append(",");

                Json.Append("\"BEGIN\":\"" + Convert.ToDateTime(dt.Rows[i]["BEGIN_TIME"]).ToString("HH:mm:ss") + "\"");
                Json.Append(",");
                Json.Append("\"END\":\"" + Convert.ToDateTime(dt.Rows[i]["END_TIME"]).ToString("HH:mm:ss") + "\"");
                Json.Append(",");
                //string url = "&quot;" + context.Request["loccode"] + "&quot;,&quot;" + GetDateTime(Convert.ToDateTime(dt.Rows[i]["BEGIN_TIME"])) + "&quot;,&quot;" + GetDateTime(Convert.ToDateTime(dt.Rows[i]["END_TIME"])) + "&quot;,&quot;" + dt.Rows[i]["LINE_CODE"] + "&quot;,&quot;" + ((dt.Rows[i]["DIRECTION"] == DBNull.Value || dt.Rows[i]["DIRECTION"].ToString() == "-1") ? "无行别" : dt.Rows[i]["DIRECTION"]) + "&quot;";
                Json.Append("\"YLnum\":\"" + dt.Rows[i]["faultAlarmCntOfLv1"] + "\"");
                Json.Append(",");
                Json.Append("\"ELnum\":\"" + dt.Rows[i]["faultAlarmCntOfLv2"] + "\"");
                Json.Append(",");
                Json.Append("\"SLnum\":\"" + dt.Rows[i]["faultAlarmCntOfLv3"] + "\"");
                Json.Append(",");



                Json.Append("\"json1\":" + DataTableToLocJson(dt, ds.Tables[1], i) + ""); // DataTableToRoutingNoJson(dt, ds.Tables[1], i)


                if (i < dt.Rows.Count - 1)
                {
                    Json.Append("},");
                }
                else
                {
                    Json.Append("}");
                }

            }
        }
        Json.Append("");

        StringBuilder json = new StringBuilder();

        json.Append("{\"total\":");
        if (recs == -1)
        {
            json.Append(dt.Rows.Count);
        }
        else
        {
            json.Append(recs);
        }

        json.Append(",\"rows\":[");

        json.Append(Json.Replace("\\", "\\\\"));


        json.Append("]}");

        context.Response.Write(json.ToString());
    }
    private void GetCLDSms_S(HttpContext context, int pageIndex, int pageSize, C3_SmsCond condition, out int recs, out int totalpages, string pk_Name)
    {
        System.Data.DataSet ds = my_sms.GetGJGroup2(condition.BUREAU_CODE, condition.P_ORG_CODE, condition.LOCOMOTIVE_CODE, condition.startTime.ToString(), condition.endTime.ToString(), pageSize, pageIndex, out recs, out totalpages, pk_Name);

        DataTable dt = ds.Tables[0];
        DataTable dt2 = ds.Tables[2];
        dt.Columns.Add("TRAIN_DATE", typeof(string));
        dt.Columns.Add("YLnum", typeof(string));
        dt.Columns.Add("ELnum", typeof(string));
        dt.Columns.Add("SLnum", typeof(string));
        dt.Columns.Add("GJMXurl", typeof(string));
        dt.Columns.Add("CZ", typeof(string));
        dt.Columns.Add("json1", typeof(string));
        dt.Columns.Add("json2", typeof(string));

        StringBuilder StatisticJson = new StringBuilder();
        int TotalOne = 0;
        int TotalTwo = 0;
        int TotalThree = 0;
        List<string> LocoList = new List<string>();
        List<string> LineList = new List<string>();
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            if (Api.Util.Common.FunEnable("Fun_NullDirection") == false)
            {
                for (int t = 0; t < dt2.Rows.Count; t++)
                {
                    if (dt2.Rows[t]["LINE_CODE"] != DBNull.Value && dt2.Rows[t]["DIRECTION"] == DBNull.Value)
                    {
                        continue;
                    }
                    else
                    {
                        if (dt2.Rows[t]["LOCOMOTIVE_CODE"].ToString() == dt.Rows[i]["LOCOMOTIVE_CODE"].ToString() && dt2.Rows[t]["RUNNING_DATE"].ToString() == dt.Rows[i]["RUNNING_DATE"].ToString())
                        {
                            if (dt2.Rows[t]["LINE_CODE"] != DBNull.Value)
                            {
                                bool sign = true;
                                for (int j = 0; j < LineList.Count; j++)
                                {
                                    if (dt2.Rows[t]["LINE_CODE"].ToString() == LineList[j])
                                    {
                                        sign = false;
                                        break;
                                    }
                                }
                                if (sign)
                                {
                                    LineList.Add(dt2.Rows[t]["LINE_CODE"].ToString());
                                }
                            }
                        }
                    }
                }
            }
            else
            {
                for (int t = 0; t < dt2.Rows.Count; t++)
                {
                    if (dt2.Rows[t]["LOCOMOTIVE_CODE"].ToString() == dt.Rows[i]["LOCOMOTIVE_CODE"].ToString() && dt2.Rows[t]["RUNNING_DATE"].ToString() == dt.Rows[i]["RUNNING_DATE"].ToString())
                    {
                        if (dt2.Rows[t]["LINE_CODE"] != DBNull.Value)
                        {
                            bool sign = true;
                            for (int j = 0; j < LineList.Count; j++)
                            {
                                if (dt2.Rows[t]["LINE_CODE"].ToString() == LineList[j])
                                {
                                    sign = false;
                                    break;
                                }
                            }
                            if (sign)
                            {
                                LineList.Add(dt2.Rows[t]["LINE_CODE"].ToString());
                            }
                        }
                    }
                }
            }


            if (dt.Rows[i]["LOCOMOTIVE_CODE"] != DBNull.Value)
            {
                bool sign = true;
                for (int j = 0; j < LocoList.Count; j++)
                {
                    if (dt.Rows[i]["LOCOMOTIVE_CODE"].ToString() == LocoList[j])
                    {
                        sign = false;
                        break;
                    }
                }
                if (sign)
                {
                    LocoList.Add(dt.Rows[i]["LOCOMOTIVE_CODE"].ToString());
                }
            }
            if (dt.Rows[i]["faultAlarmCntOfLv1"] != DBNull.Value)
            {
                TotalOne = TotalOne + Convert.ToInt32(dt.Rows[i]["faultAlarmCntOfLv1"]);
            }
            if (dt.Rows[i]["faultAlarmCntOfLv2"] != DBNull.Value)
            {
                TotalTwo = TotalTwo + Convert.ToInt32(dt.Rows[i]["faultAlarmCntOfLv2"]);
            }
            if (dt.Rows[i]["faultAlarmCntOfLv3"] != DBNull.Value)
            {
                TotalThree = TotalThree + Convert.ToInt32(dt.Rows[i]["faultAlarmCntOfLv3"]);
            }
        }
        StatisticJson.Append("{\"TotalLoco\":\"" + LocoList.Count + "\",");
        StatisticJson.Append("\"TotalLine\":\"" + LineList.Count + "\",");
        StatisticJson.Append("\"TotalOne\":\"" + TotalOne + "\",");
        StatisticJson.Append("\"TotalTwo\":\"" + TotalTwo + "\",");
        StatisticJson.Append("\"TotalThree\":\"" + TotalThree + "\",");
        StatisticJson.Append("\"TotalAlarm\":\"" + (TotalOne + TotalTwo + TotalThree) + "\"}");

        context.Response.Write(StatisticJson.ToString());

    }



    private void GetCLDSms(HttpContext context, int pageIndex, int pageSize, C3_SmsCond condition, out int recs, out int totalpages, string pk_Name)
    {
        System.Data.DataSet ds = my_sms.GetGJGroup2(condition.BUREAU_CODE, condition.P_ORG_CODE, condition.LOCOMOTIVE_CODE, condition.startTime.ToString(), condition.endTime.ToString(), pageSize, pageIndex, out recs, out totalpages, pk_Name);

        DataTable dt = ds.Tables[0];
        dt.Columns.Add("TRAIN_DATE", typeof(string));
        dt.Columns.Add("YLnum", typeof(string));
        dt.Columns.Add("ELnum", typeof(string));
        dt.Columns.Add("SLnum", typeof(string));
        dt.Columns.Add("GJMXurl", typeof(string));
        dt.Columns.Add("CZ", typeof(string));
        dt.Columns.Add("json1", typeof(string));
        dt.Columns.Add("json2", typeof(string));

        StringBuilder Json = new StringBuilder();
        Json.Append("");
        for (int i = 0; i < dt.Rows.Count; i++)
        {

            Json.Append("{");
            Json.Append("\"LOCOMOTIVE_CODE\":\"" + dt.Rows[i]["LOCOMOTIVE_CODE"] + "\"");
            Json.Append(",");
            Json.Append("\"RUNNING_DATE\":\"" + Convert.ToDateTime(dt.Rows[i]["RUNNING_DATE"]).ToString("yyyy-MM-dd") + "\"");
            Json.Append(",");
            Json.Append("\"BEGIN_TIME\":\"" + GetDateTime(Convert.ToDateTime(dt.Rows[i]["BEGIN_TIME"])) + "\"");
            Json.Append(",");
            Json.Append("\"END_TIME\":\"" + GetDateTime(Convert.ToDateTime(dt.Rows[i]["END_TIME"])) + "\"");
            Json.Append(",");

            Json.Append("\"BEGIN\":\"" + Convert.ToDateTime(dt.Rows[i]["BEGIN_TIME"]).ToString("HH:mm:ss") + "\"");
            Json.Append(",");
            Json.Append("\"END\":\"" + Convert.ToDateTime(dt.Rows[i]["END_TIME"]).ToString("HH:mm:ss") + "\"");
            Json.Append(",");
            //string url = "&quot;" + dt.Rows[i]["LOCOMOTIVE_CODE"] + "&quot;,&quot;" + GetDateTime(Convert.ToDateTime(dt.Rows[i]["BEGIN_TIME"])) + "&quot;,&quot;" + GetDateTime(Convert.ToDateTime(dt.Rows[i]["END_TIME"])) + "&quot;,&quot;" + "" + "&quot;,&quot;" + "" + "&quot;";
            //Json.Append("\"GJMXurl\":\"" + "<a   href='javascript:void(0)'  onclick='selectDetailInfo(" + url + ")'>查看</a> " + "\"");
            //Json.Append(",");
            Json.Append("\"TRAIN_DATE\":\"" + dt.Rows[i]["LOCOMOTIVE_CODE"] + "_" + Convert.ToDateTime(dt.Rows[i]["RUNNING_DATE"]).ToShortDateString() + "\"");
            Json.Append(",");
            Json.Append("\"YLnum\":\"" + dt.Rows[i]["faultAlarmCntOfLv1"] + "\"");
            Json.Append(",");
            Json.Append("\"ELnum\":\"" + dt.Rows[i]["faultAlarmCntOfLv2"] + "\"");
            Json.Append(",");
            Json.Append("\"SLnum\":\"" + dt.Rows[i]["faultAlarmCntOfLv3"] + "\"");
            Json.Append(",");

            Json.Append("\"json1\":" + DataTableToRoutingNoJson(dt, ds.Tables[1], i) + ""); // 每个车的交路统计列表
            Json.Append(",");
            Json.Append("\"json2\":" + DataTableToMisLineJson(dt, ds.Tables[2], i) + "");// 每个车的线路统计列表

            if (i < dt.Rows.Count - 1)
            {
                Json.Append("},");
            }
            else
            {
                Json.Append("}");
            }

        }
        Json.Append("");

        StringBuilder json = new StringBuilder();

        json.Append("{\"total\":");
        if (recs == -1)
        {
            json.Append(dt.Rows.Count);
        }
        else
        {
            json.Append(recs);
        }

        json.Append(",\"rows\":[");

        json.Append(Json.Replace("\\", "\\\\"));


        json.Append("]}");

        context.Response.Write(json.ToString());
    }

    public string DataTableToRoutingNoJson(DataTable dt1, DataTable dt2, int number)
    {
        StringBuilder Json = new StringBuilder();
        Json.Append("[");
        for (int i = 0; i < dt2.Rows.Count; i++)
        {
            if (dt2.Rows[i]["LOCOMOTIVE_CODE"].ToString() == dt1.Rows[number]["LOCOMOTIVE_CODE"].ToString() && dt2.Rows[i]["RUNNING_DATE"].ToString() == dt1.Rows[number]["RUNNING_DATE"].ToString())
            {
                Json.Append("{");
                Json.Append("\"LOCOMOTIVE_CODE\":\"" + dt2.Rows[i]["LOCOMOTIVE_CODE"] + "\"");
                Json.Append(",");
                Json.Append("\"RUNNING_DATE\":\"" + Convert.ToDateTime(dt2.Rows[i]["RUNNING_DATE"]).ToString("yyyy-MM-dd") + "\"");
                Json.Append(",");
                Json.Append("\"ROUTING_NO\":\"" + dt2.Rows[i]["ROUTING_NO"] + "\"");
                Json.Append(",");
                Json.Append("\"DIRECTION\":\"" + dt2.Rows[i]["DIRECTION"] + "\"");
                Json.Append(",");
                Json.Append("\"DIRECTION_QUERY\":\"" + (dt2.Rows[i]["DIRECTION"] == DBNull.Value ? "交路无行别" : dt2.Rows[i]["DIRECTION"]) + "\"");//查询时使用的行别参数
                Json.Append(",");
                Json.Append("\"BEGIN_TIME\":\"" + GetDateTime(Convert.ToDateTime(dt2.Rows[i]["BEGIN_TIME"])) + "\"");
                Json.Append(",");
                Json.Append("\"END_TIME\":\"" + GetDateTime(Convert.ToDateTime(dt2.Rows[i]["END_TIME"])) + "\"");
                Json.Append(",");

                Json.Append("\"BEGIN\":\"" + Convert.ToDateTime(dt2.Rows[i]["BEGIN_TIME"]).ToString("HH:mm:ss") + "\"");
                Json.Append(",");
                Json.Append("\"END\":\"" + Convert.ToDateTime(dt2.Rows[i]["END_TIME"]).ToString("HH:mm:ss") + "\"");
                Json.Append(",");
                //string ulr = "&quot;" + dt2.Rows[i]["LOCOMOTIVE_CODE"] + "&quot;,&quot;" + GetDateTime(Convert.ToDateTime(dt2.Rows[i]["BEGIN_TIME"])) + "&quot;,&quot;" + GetDateTime(Convert.ToDateTime(dt2.Rows[i]["END_TIME"])) + "&quot;,&quot;" + dt2.Rows[i]["ROUTING_NO"] + "&quot;,&quot;" + (dt2.Rows[i]["DIRECTION"] == DBNull.Value ? "交路无行别" : dt2.Rows[i]["DIRECTION"]) + "&quot;";
                Json.Append("\"YLnum\":\"" + dt2.Rows[i]["faultAlarmCntOfLv1"] + "\"");
                Json.Append(",");
                Json.Append("\"ELnum\":\"" + dt2.Rows[i]["faultAlarmCntOfLv2"] + "\"");
                Json.Append(",");
                Json.Append("\"SLnum\":\"" + dt2.Rows[i]["faultAlarmCntOfLv3"] + "\"");

                Json.Append("},");

            }
            else
            {
                continue;
            }

        }
        string json = "";
        if (Json.Length > 1)
        {
            json = Json.ToString().Substring(0, Json.Length - 1);
        }
        else
        {
            json = Json.ToString();
        }
        json += "]";
        Json.Clear();
        Json.Append(json);

        return Json.ToString();
    }
    public string DataTableToLocJson(DataTable dt1, DataTable dt2, int number)
    {
        StringBuilder Json = new StringBuilder();
        Json.Append("[");
        for (int i = 0; i < dt2.Rows.Count; i++)
        {
            if (dt2.Rows[i]["rown"].ToString() == dt1.Rows[number]["rown"].ToString())
            {
                Json.Append("{");
                Json.Append("\"LOCOMOTIVE_CODE\":\"" + dt2.Rows[i]["LOCOMOTIVE_CODE"] + "\"");
                Json.Append(",");
                Json.Append("\"RUNNING_DATE\":\"" + Convert.ToDateTime(dt2.Rows[i]["RUNNING_DATE"]).ToString("yyyy-MM-dd") + "\"");
                Json.Append(",");
                Json.Append("\"BEGIN_TIME\":\"" + GetDateTime(Convert.ToDateTime(dt2.Rows[i]["BEGIN_TIME"])) + "\"");
                Json.Append(",");
                Json.Append("\"END_TIME\":\"" + GetDateTime(Convert.ToDateTime(dt2.Rows[i]["END_TIME"])) + "\"");
                Json.Append(",");
                Json.Append("\"LINE_CODE\":\"" + dt1.Rows[number]["LINE_CODE"] + "\"");
                Json.Append(",");
                Json.Append("\"LINE_CODE_QUERY\":\"" + (dt1.Rows[number]["LINE_CODE"] == DBNull.Value ? "wu" : dt1.Rows[number]["LINE_CODE"]) + "\"");
                Json.Append(",");
                string DIRECTION = dt1.Rows[number]["DIRECTION"].ToString();
                if (DIRECTION == "-1")
                {
                    DIRECTION = "";
                }
                Json.Append("\"DIRECTION\":\"" + DIRECTION + "\"");
                Json.Append(",");
                Json.Append("\"DIRECTION_QUERY\":\"" + ((dt1.Rows[number]["DIRECTION"] == DBNull.Value || dt1.Rows[number]["DIRECTION"].ToString() == "-1") ? "无行别" : dt1.Rows[number]["DIRECTION"]) + "\"");
                Json.Append(",");

                Json.Append("\"BEGIN\":\"" + Convert.ToDateTime(dt2.Rows[i]["BEGIN_TIME"]).ToString("HH:mm:ss") + "\"");
                Json.Append(",");
                Json.Append("\"END\":\"" + Convert.ToDateTime(dt2.Rows[i]["END_TIME"]).ToString("HH:mm:ss") + "\"");
                Json.Append(",");
                //string url = "&quot;" + dt2.Rows[i]["LOCOMOTIVE_CODE"] + "&quot;,&quot;" + GetDateTime(Convert.ToDateTime(dt2.Rows[i]["BEGIN_TIME"])) + "&quot;,&quot;" + GetDateTime(Convert.ToDateTime(dt2.Rows[i]["END_TIME"])) + "&quot;,&quot;" + (dt1.Rows[number]["LINE_CODE"] == DBNull.Value ? "wu" : dt1.Rows[number]["LINE_CODE"]) + "&quot;,&quot;" + ((dt1.Rows[number]["DIRECTION"] == DBNull.Value || dt1.Rows[number]["DIRECTION"].ToString() == "-1") ? "无行别" : dt1.Rows[number]["DIRECTION"]) + "&quot;";
                Json.Append("\"YLnum\":\"" + dt2.Rows[i]["faultAlarmCntOfLv1"] + "\"");
                Json.Append(",");
                Json.Append("\"ELnum\":\"" + dt2.Rows[i]["faultAlarmCntOfLv2"] + "\"");
                Json.Append(",");
                Json.Append("\"SLnum\":\"" + dt2.Rows[i]["faultAlarmCntOfLv3"] + "\"");

                Json.Append("},");

            }
            else
            {
                continue;
            }

        }
        string json = "";
        if (Json.Length > 1)
        {
            json = Json.ToString().Substring(0, Json.Length - 1);
        }
        else
        {
            json = Json.ToString();
        }
        json += "]";
        Json.Clear();
        Json.Append(json);

        return Json.ToString();
    }


    public string DataTableToMisLineJson(DataTable dt1, DataTable dt2, int number)
    {
        StringBuilder Json = new StringBuilder();
        Json.Append("[");
        if (Api.Util.Common.FunEnable("Fun_NullDirection") == false)
        {
            for (int i = 0; i < dt2.Rows.Count; i++)
            {
                if (dt2.Rows[i]["LINE_CODE"] != DBNull.Value && dt2.Rows[i]["DIRECTION"] == DBNull.Value)
                {
                    continue;
                }
                else
                {
                    if (dt2.Rows[i]["LOCOMOTIVE_CODE"].ToString() == dt1.Rows[number]["LOCOMOTIVE_CODE"].ToString() && dt2.Rows[i]["RUNNING_DATE"].ToString() == dt1.Rows[number]["RUNNING_DATE"].ToString())
                    {
                        Json.Append("{");
                        Json.Append("\"LOCOMOTIVE_CODE\":\"" + dt2.Rows[i]["LOCOMOTIVE_CODE"] + "\"");
                        Json.Append(",");
                        Json.Append("\"RUNNING_DATE\":\"" + Convert.ToDateTime(dt2.Rows[i]["RUNNING_DATE"]).ToString("yyyy-MM-dd") + "\"");
                        Json.Append(",");
                        Json.Append("\"LINE_CODE\":\"" + dt2.Rows[i]["LINE_CODE"] + "\"");
                        Json.Append(",");
                        Json.Append("\"LINE_CODE_QUERY\":\"" + (dt2.Rows[i]["LINE_CODE"] == DBNull.Value ? "wu" : dt2.Rows[i]["LINE_CODE"]) + "\"");
                        Json.Append(",");
                        Json.Append("\"LINE_NAME\":\"" + dt2.Rows[i]["LINE_NAME"] + "\"");
                        Json.Append(",");
                        Json.Append("\"DIRECTION\":\"" + dt2.Rows[i]["DIRECTION"] + "\"");
                        Json.Append(",");
                        Json.Append("\"DIRECTION_QUERY\":\"" + (dt2.Rows[i]["DIRECTION"] == DBNull.Value ? "无行别" : dt2.Rows[i]["DIRECTION"]) + "\"");
                        Json.Append(",");

                        Json.Append("\"BEGIN_TIME\":\"" + GetDateTime(Convert.ToDateTime(dt2.Rows[i]["BEGIN_TIME"])) + "\"");
                        Json.Append(",");
                        Json.Append("\"END_TIME\":\"" + GetDateTime(Convert.ToDateTime(dt2.Rows[i]["END_TIME"])) + "\"");
                        Json.Append(",");

                        Json.Append("\"BEGIN\":\"" + Convert.ToDateTime(dt2.Rows[i]["BEGIN_TIME"]).ToString("HH:mm:ss") + "\"");
                        Json.Append(",");
                        Json.Append("\"END\":\"" + Convert.ToDateTime(dt2.Rows[i]["END_TIME"]).ToString("HH:mm:ss") + "\"");
                        Json.Append(",");
                        //string url = "&quot;" + dt2.Rows[i]["LOCOMOTIVE_CODE"] + "&quot;,&quot;" + GetDateTime(Convert.ToDateTime(dt2.Rows[i]["BEGIN_TIME"])) + "&quot;,&quot;" + GetDateTime(Convert.ToDateTime(dt2.Rows[i]["END_TIME"])) + "&quot;,&quot;" + (dt2.Rows[i]["LINE_CODE"] == DBNull.Value ? "wu" : dt2.Rows[i]["LINE_CODE"]) + "&quot;,&quot;" + (dt2.Rows[i]["DIRECTION"] == DBNull.Value ? "无行别" : dt2.Rows[i]["DIRECTION"]) + "&quot;";
                        Json.Append("\"YLnum\":\"" + dt2.Rows[i]["faultAlarmCntOfLv1"] + "\"");
                        Json.Append(",");
                        Json.Append("\"ELnum\":\"" + dt2.Rows[i]["faultAlarmCntOfLv2"] + "\"");
                        Json.Append(",");
                        Json.Append("\"SLnum\":\"" + dt2.Rows[i]["faultAlarmCntOfLv3"] + "\"");

                        Json.Append("},");

                    }
                    else
                    {
                        continue;
                    }
                }
            }
        }
        else
        {
            for (int i = 0; i < dt2.Rows.Count; i++)
            {
                if (dt2.Rows[i]["LOCOMOTIVE_CODE"].ToString() == dt1.Rows[number]["LOCOMOTIVE_CODE"].ToString() && dt2.Rows[i]["RUNNING_DATE"].ToString() == dt1.Rows[number]["RUNNING_DATE"].ToString())
                {
                    Json.Append("{");
                    Json.Append("\"LOCOMOTIVE_CODE\":\"" + dt2.Rows[i]["LOCOMOTIVE_CODE"] + "\"");
                    Json.Append(",");
                    Json.Append("\"RUNNING_DATE\":\"" + Convert.ToDateTime(dt2.Rows[i]["RUNNING_DATE"]).ToString("yyyy-MM-dd") + "\"");
                    Json.Append(",");
                    Json.Append("\"LINE_CODE\":\"" + dt2.Rows[i]["LINE_CODE"] + "\"");
                    Json.Append(",");
                    Json.Append("\"LINE_CODE_QUERY\":\"" + (dt2.Rows[i]["LINE_CODE"] == DBNull.Value ? "wu" : dt2.Rows[i]["LINE_CODE"]) + "\"");
                    Json.Append(",");
                    Json.Append("\"LINE_NAME\":\"" + dt2.Rows[i]["LINE_NAME"] + "\"");
                    Json.Append(",");
                    Json.Append("\"DIRECTION\":\"" + dt2.Rows[i]["DIRECTION"] + "\"");
                    Json.Append(",");
                    Json.Append("\"DIRECTION_QUERY\":\"" + (dt2.Rows[i]["DIRECTION"] == DBNull.Value ? "无行别" : dt2.Rows[i]["DIRECTION"]) + "\"");
                    Json.Append(",");

                    Json.Append("\"BEGIN_TIME\":\"" + GetDateTime(Convert.ToDateTime(dt2.Rows[i]["BEGIN_TIME"])) + "\"");
                    Json.Append(",");
                    Json.Append("\"END_TIME\":\"" + GetDateTime(Convert.ToDateTime(dt2.Rows[i]["END_TIME"])) + "\"");
                    Json.Append(",");

                    Json.Append("\"BEGIN\":\"" + Convert.ToDateTime(dt2.Rows[i]["BEGIN_TIME"]).ToString("HH:mm:ss") + "\"");
                    Json.Append(",");
                    Json.Append("\"END\":\"" + Convert.ToDateTime(dt2.Rows[i]["END_TIME"]).ToString("HH:mm:ss") + "\"");
                    Json.Append(",");
                    //string url = "&quot;" + dt2.Rows[i]["LOCOMOTIVE_CODE"] + "&quot;,&quot;" + GetDateTime(Convert.ToDateTime(dt2.Rows[i]["BEGIN_TIME"])) + "&quot;,&quot;" + GetDateTime(Convert.ToDateTime(dt2.Rows[i]["END_TIME"])) + "&quot;,&quot;" + (dt2.Rows[i]["LINE_CODE"] == DBNull.Value ? "wu" : dt2.Rows[i]["LINE_CODE"]) + "&quot;,&quot;" + (dt2.Rows[i]["DIRECTION"] == DBNull.Value ? "无行别" : dt2.Rows[i]["DIRECTION"]) + "&quot;";
                    Json.Append("\"YLnum\":\"" + dt2.Rows[i]["faultAlarmCntOfLv1"] + "\"");
                    Json.Append(",");
                    Json.Append("\"ELnum\":\"" + dt2.Rows[i]["faultAlarmCntOfLv2"] + "\"");
                    Json.Append(",");
                    Json.Append("\"SLnum\":\"" + dt2.Rows[i]["faultAlarmCntOfLv3"] + "\"");

                    Json.Append("},");

                }
                else
                {
                    continue;
                }
            }
        }
        string json = "";
        if (Json.Length > 1)
        {
            json = Json.ToString().Substring(0, Json.Length - 1);
        }
        else
        {
            json = Json.ToString();
        }
        json += "]";
        Json.Clear();
        Json.Append(json);
        return Json.ToString();
    }
    public string DataTableToJson(System.Data.DataTable dt, int total = -1)
    {
        StringBuilder json = new StringBuilder();


        //{"total":5,"rows":[  
        json.Append("{\"total\":");
        if (total == -1)
        {
            json.Append(dt.Rows.Count);
        }
        else
        {
            json.Append(total);
        }

        json.Append(",\"rows\":[");

        json.Append(DataTableToJson(dt).Replace("\\", "\\\\"));


        json.Append("]}");


        return json.ToString();
    }
    public static string DataTableToJson(System.Data.DataTable dt)
    {
        StringBuilder jsonBuilder = new StringBuilder();

        for (int i = 0; i < dt.Rows.Count; i++)
        {
            jsonBuilder.Append("{");
            for (int j = 0; j < dt.Columns.Count; j++)
            {
                jsonBuilder.Append("\"");
                jsonBuilder.Append(dt.Columns[j].ColumnName);
                jsonBuilder.Append("\":\"");
                jsonBuilder.Append(dt.Rows[i][j].ToString());
                jsonBuilder.Append("\",");
            }
            if (dt.Columns.Count > 0)
            {
                jsonBuilder.Remove(jsonBuilder.Length - 1, 1);
            }
            jsonBuilder.Append("},");
        }
        if (dt.Rows.Count > 0)
        {
            jsonBuilder.Remove(jsonBuilder.Length - 1, 1);
        }

        return jsonBuilder.ToString();
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }
    public string GetDateTime(DateTime TIME)
    {
        string dt = string.Format("{0:yyyy/MM/dd HH:mm:ss}", TIME);
        return dt;
    }
}