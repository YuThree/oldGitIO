<%@ WebHandler Language="C#" Class="GetDataMessage" %>

using System;
using System.Web;
using System.Data;
using Api.Fault.entity.alarm;
using System.Text;
using SharedDefinition.Definitions;
using System.Web.Script.Serialization;
using System.Collections.Generic;
using ADO;
using Api;

public class GetDataMessage : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        string type = context.Request["type"];
        switch (type)
        {
            case "count":
                getCount(context);
                break;
            case "loco":
                getLoco(context);
                break;
            case "alarm":
                getAlarm(context);
                break;
            default:
                break;
        }
    }

    public void getCount(HttpContext context)
    {
        string strwhere1 = " 1=1";
        string strwhere2 = " 1=1";
        int num1 = 0;
        int num2 = 0;
        GetStrwhere(context, ref strwhere1, ref strwhere2);

        DataMessage.getDataMessageCount(strwhere1, strwhere2, ref num1, ref num2);

        StringBuilder json = new StringBuilder();
        json.Append("{\"data\":\"" + (num1 + num2) + "\"}");
        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }

    public void getLoco(HttpContext context)
    {
        string strwhere1 = " 1=1";
        string strwhere2 = " 1=1";

        int total = 0;
        int tota2 = 0;
        string pageindex = HttpContext.Current.Request["pageindex"];
        string pagesize = HttpContext.Current.Request["pagesize"];
        GetStrwhere(context, ref strwhere1, ref strwhere2);

        DataMessage.getDataMessageCount(strwhere1, strwhere2, ref total, ref tota2);


        DataTable dt = DataMessage.getLocoMessage(strwhere1, pageindex, pagesize);
        StringBuilder json = new StringBuilder();
        if (dt.Rows.Count == 0)
        {
            json.Append("{\"data\":[],\"total_Rows\":\"0\",\"pageIndex\":\"0\",\"pageSize\":\"0\",\"pageOfTotal\":\"1/1\",\"pageRange\":\"0~0\",\"Current_pagesize\":\"0\",\"totalPages\":\"1\"}");
        }
        else
        {
            json.Append("{\"data\":[");
            if (dt.Rows.Count > 0)
            {
                foreach (DataRow row in dt.Rows)
                {
                    json.Append("{");
                    json.Append("\"ID\":\"" + row["ID"] + "\",");//唯一标识
                    json.Append("\"LOCOMOTIVE\":\"" + row["LOCOMOTIVE"] + "\",");//车号
                    json.Append("\"BOW_TYPE\":\"" + GetFirstBowType(row["LOCOMOTIVE"].ToString()) + "\",");//车号
                    json.Append("\"TYPE\":\"" + row["TYPE"] + "\",");//类型
                    json.Append("\"START_TIME\":\"" + row["START_TIME"] + "\",");//开始时间
                    json.Append("\"END_TIME\":\"" + row["END_TIME"] + "\",");//结束时间
                    json.Append("\"CREATE_TIME\":\"" + row["CREATE_TIME"] + "\",");//提示数据创建时间
                    json.Append("\"STATUS\":\"" + row["STATUS"] + "\",");//状态
                    json.Append("\"REPORT_PERSON\":\"" + row["REPORT_PERSON"] + "\",");//处理人
                    json.Append("\"REPORT_TIME\":\"" + row["REPORT_TIME"] + "\",");//处理时间
                    json.Append("\"REMARK\":\"" + row["REMARK"] + "\"");//备注
                    json.Append("},");
                }
                // json.Remove(json.Length - 1, 1);
            }
            json.Remove(json.Length - 1, 1);
            json.Append("]");
            //json.Append("]");
            PageHelper page = new PageHelper();
            string pagejson = page.getPageJson(total, int.Parse(pageindex), int.Parse(pagesize));//拼接分页数据
            json.Append("," + pagejson + "}");
        }

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }


    public void getAlarm(HttpContext context)
    {
        string strwhere1 = " 1=1";
        string strwhere2 = " 1=1";
        string pageindex = HttpContext.Current.Request["pageindex"];
        string pagesize = HttpContext.Current.Request["pagesize"];
        GetStrwhere(context, ref strwhere1, ref strwhere2);

        DataTable dt = DataMessage.getAlarmMessage(strwhere1, pageindex, pagesize);
        StringBuilder json = new StringBuilder();
        json.Append("{\"data\":[");
        if (dt.Rows.Count > 0)
        {
            foreach (DataRow row in dt.Rows)
            {
                json.Append("{");
                json.Append("\"ID\":\"" + row["ID"] + "\",");//唯一标识
                json.Append("\"ALARM_ID\":\"" + row["ALARM_ID"] + "\",");//对应的报警ID
                json.Append("\"CODE\":\"" + row["CODE"] + "\",");//报警类型
                json.Append("\"COUNT\":\"" + row["COUNT"] + "\",");//统计总数
                json.Append("\"START_TIME\":\"" + row["START_TIME"] + "\",");//追踪开始时间
                json.Append("\"END_TIME\":\"" + row["END_TIME"] + "\",");//追踪截止时间
                json.Append("\"CREATE_TIME\":\"" + row["CREATE_TIME"] + "\",");//创建时间
                json.Append("\"REPORT_PERSON\":\"" + row["REPORT_PERSON"] + "\",");//处理人
                json.Append("\"REPORT_TIME\":\"" + row["REPORT_TIME"] + "\",");//处理时间
                json.Append("\"REMARK\":\"" + row["REMARK"] + "\"");//备注
                json.Append("},");
            }
            json.Remove(json.Length - 1, 1);
        }
        json.Append("],");
        json.Append("\"index\":\"" + pageindex + "\",\"size\":\"" + pagesize + "\",\"total\":\"" + dt.Rows.Count + "\"}");
        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }


    public void GetStrwhere(HttpContext context, ref string str1, ref string str2)
    {
        string start_date = HttpContext.Current.Request["start_date"];
        string end_date = HttpContext.Current.Request["end_date"];
        string loco = HttpContext.Current.Request["loco"];
        string bureau = HttpContext.Current.Request["bureau"];
        string message_code = HttpContext.Current.Request["message_code"];

        if (!string.IsNullOrEmpty(start_date))
        {
            try
            {
                DateTime start = Convert.ToDateTime(start_date);
                str1 += " AND CREATE_TIME >= TO_DATE('" + start.ToString("yyyy/MM/dd HH:mm:ss") + "','yyyy/MM/dd HH24:mi:ss')";
                str2 += " AND CREATE_TIME >= TO_DATE('" + start.ToString("yyyy/MM/dd HH:mm:ss") + "','yyyy/MM/dd HH24:mi:ss')";
            }
            catch (Exception ex)
            {

            }
        }
        if (!string.IsNullOrEmpty(end_date))
        {
            try
            {
                DateTime end = Convert.ToDateTime(end_date);
                str1 += " AND CREATE_TIME <= TO_DATE('" + end.ToString("yyyy/MM/dd HH:mm:ss") + "','yyyy/MM/dd HH24:mi:ss')";
                str2 += " AND CREATE_TIME <= TO_DATE('" + end.ToString("yyyy/MM/dd HH:mm:ss") + "','yyyy/MM/dd HH24:mi:ss')";
            }
            catch (Exception ex)
            {

            }
        }

        if (!string.IsNullOrEmpty(loco))
        {
            string str_loco = "";
            string[] locos = loco.Split(',');
            foreach (string lo in locos)
            {
                if (!string.IsNullOrEmpty(lo))
                {
                    str_loco += "'" + lo + "',";
                }
            }
            if (!string.IsNullOrEmpty(str_loco))
            {
                str_loco = str_loco.Remove(str_loco.Length - 1);
                str1 += " AND LOCOMOTIVE IN (" + str_loco + ")";
            }
        }

        if (!string.IsNullOrEmpty(bureau))
        {
            string str_bureau = "";
            string[] bureaus = bureau.Split(',');
            foreach (string bur in bureaus)
            {
                if (!string.IsNullOrEmpty(bur))
                {
                    str_bureau += "'" + bur + "',";
                }
            }
            if (!string.IsNullOrEmpty(str_bureau))
            {
                str_bureau = str_bureau.Remove(str_bureau.Length - 1);
                str1 += " AND BUREAU_CODE IN (" + str_bureau + ")";
                str2 += " AND BUREAU_CODE IN (" + str_bureau + ")";
            }
        }

        if (!string.IsNullOrEmpty(message_code))
        {
            str1 += " AND TYPE LIKE '%" + message_code + "%'";
            str2 += " AND TYPE LIKE '%" + message_code + "%'";
        }

    }


    public string GetFirstBowType(string locomotive_code)
    {
        string bow = "2车";
        Api.Foundation.entity.Foundation.Locomotive loco = Api.ServiceAccessor.GetFoundationService().queryLocomotive(locomotive_code);

        string relation = loco.DEVICE_BOW_RELATIONS;
        if (!string.IsNullOrEmpty(relation))
        {
            string[] res = relation.Split('#');
            if (res.Length > 0)
            {
                string[] str1 = res[0].Split(':');
                if (str1.Length > 0)
                {
                    string[] str2 = str1[1].Split(',');
                    if (str2.Length > 0)
                        bow = str2[0] + "车";
                }
            }
        }
        return bow;
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}