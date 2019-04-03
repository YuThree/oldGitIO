<%@ WebHandler Language="C#" Class="testGPS" %>

using System;
using System.Web;
using System.Text;
using Newtonsoft.Json;
using System.Data;
using System.Collections.Generic;


public class testGPS : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        string sql = "select * from (select rownum as r,a.* from (select rownum as id , gps_longtitude ,gps_latitude,keii_longtitude,keii_latitude,type,line_name,date_time,value,train_no,sd,wx,isys,GIS_X,GIS_Y,BAIDU_X,BAIDU_Y from test_gps where 1=1 ";
        int startTime = System.Environment.TickCount;
        String time = context.Request.QueryString["time"].ToString();
        String endtime = context.Request.QueryString["endTime"].ToString();
        if (time != "" && time != null)
        {
            sql += " and  date_time>=to_date('" + time + "','yyyy-mm-dd hh24:mi:ss')";
        }
        if (endtime != "" && endtime != null)
        {
            sql += " and  date_time<=to_date('" + endtime + "','yyyy-mm-dd hh24:mi:ss')";
        }
        String linename = context.Request.QueryString["linename"].ToString();
        String jj = context.Request.QueryString["jj"].ToString();
        if (linename != "" && linename != null)
        {
            sql += " and line_name ='" + linename + "'";
        }
        String type = context.Request.QueryString["type"].ToString();
        if (type == "1")
        {
            sql += " and type ='1'";
        }
        else if (type == "0")
        {
            sql += " and type !='1' ";
        }
        String num1 = context.Request.QueryString["num1"].ToString();
        String num2 = context.Request.QueryString["num2"].ToString();
        sql += " order by  to_number(value)) a) where 1=1 ";
        if (num1 != "" && num1 != "0")
        {
            sql += "and r>= " + num1 + " and r<=" + num2;
        }
        if (jj != "1")
        {
            sql += " and mod(r," + jj + ")=1 ";
        }
        DataSet ds = DbHelperOra.Query(sql);
        StringBuilder Json = new StringBuilder();
        Json.Append("[");


        for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
        {

            Json.Append("{");
            string GISX = "";
            string GISY = "";
            string KEIIX = "";
            string KEIIY = "";
            string GISXS = "";
            string GISYS = "";
            string KEIIXS = "";
            string KEIIYS = "";
            //if (ds.Tables[0].Rows[i]["isys"].ToString() == "1")
            //{
            //    if (!string.IsNullOrEmpty(ds.Tables[0].Rows[i]["gps_longtitude"].ToString()))
            //    {
            //        GISX = Api.Util.Common.JingduTurnToDegree(Convert.ToDouble(ds.Tables[0].Rows[i]["gps_longtitude"])).ToString();
            //        GISY = Api.Util.Common.JingduTurnToDegree(Convert.ToDouble(ds.Tables[0].Rows[i]["gps_latitude"])).ToString();
            //    }
            //    else
            //    {
            //        KEIIX = Api.Util.Common.JingduTurnToDegree(Convert.ToDouble(ds.Tables[0].Rows[i]["keii_longtitude"])).ToString();
            //        KEIIY = Api.Util.Common.JingduTurnToDegree(Convert.ToDouble(ds.Tables[0].Rows[i]["keii_latitude"])).ToString();
            //    }

            //}
            //else
            //{

            //    GISX = ds.Tables[0].Rows[i]["gps_longtitude"].ToString();
            //    GISY = ds.Tables[0].Rows[i]["gps_latitude"].ToString();
            //    KEIIX = ds.Tables[0].Rows[i]["keii_longtitude"].ToString();
            //    KEIIY = ds.Tables[0].Rows[i]["keii_latitude"].ToString();
            //}
            if (ds.Tables[0].Rows[i]["type"].ToString() == "1")
            {
                GISX = ds.Tables[0].Rows[i]["GIS_X"].ToString();
                GISY = ds.Tables[0].Rows[i]["GIS_Y"].ToString();
            }
            else
            {
                KEIIX = ds.Tables[0].Rows[i]["GIS_X"].ToString();
                KEIIY = ds.Tables[0].Rows[i]["GIS_Y"].ToString();
            }
            Json.Append("GIS_X:\"" + GISX + "\"");
            Json.Append(",");
            Json.Append("GIS_Y:\"" + GISY + "\"");
            Json.Append(",");
            Json.Append("keii_longtitude:\"" + KEIIX + "\"");
            Json.Append(",");
            Json.Append("keii_latitude:\"" + KEIIY + "\"");
            Json.Append(",");
            Json.Append("TYPE:\"" + ds.Tables[0].Rows[i]["type"] + "\"");
            Json.Append(",");
            Json.Append("id:\"" + ds.Tables[0].Rows[i]["id"] + "\"");
            Json.Append(",");
            Json.Append("value:\"" + ds.Tables[0].Rows[i]["value"] + "\"");
            Json.Append(",");
            Json.Append("date_time:\"" + ds.Tables[0].Rows[i]["date_time"] + "\"");
            Json.Append(",");
            Json.Append("line_name:\"" + ds.Tables[0].Rows[i]["line_name"] + "\"");
            Json.Append(",");
            Json.Append("train_no:\"" + ds.Tables[0].Rows[i]["train_no"] + "\"");
            Json.Append(",");
            Json.Append("sd:\"" + ds.Tables[0].Rows[i]["sd"] + "\"");
            Json.Append(",");
            Json.Append("BAIDU_X:\"" + ds.Tables[0].Rows[i]["BAIDU_X"] + "\"");
            Json.Append(",");
            Json.Append("BAIDU_Y:\"" + ds.Tables[0].Rows[i]["BAIDU_Y"] + "\"");
            Json.Append(",");
            Json.Append("wx:\"" + ds.Tables[0].Rows[i]["wx"] + "\"");
            if (i < ds.Tables[0].Rows.Count - 1)
            {
                Json.Append("},");
            }
            else
            {
                Json.Append("}");
            }
        }
        int endTime = System.Environment.TickCount;
        int runTime = endTime - startTime;
        object myObj = JsonConvert.DeserializeObject(Json.ToString());
        context.Response.Write(myObj.ToString());
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}