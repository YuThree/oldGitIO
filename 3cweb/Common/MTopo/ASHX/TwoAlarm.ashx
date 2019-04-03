<%@ WebHandler Language="C#" Class="TwoAlarm" %>

using System;
using System.Web;
using System.Text;
using Newtonsoft.Json;
using System.Data;
using Api.Fault.entity.alarm;
using System.Collections.Generic;
using Api.Fault.entity.sms;
using Api.Foundation.entity.Cond;
using System.Configuration;

public class TwoAlarm : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        String TYPE = context.Request.QueryString["TYPE"];
        String Line_Code = context.Request.QueryString["Line_Code"];
        String GIS_X = context.Request.QueryString["GIS_X"];
        String GIS_Y = context.Request.QueryString["GIS_Y"];

        String startTime = context.Request.QueryString["startTime"];
        String Time = context.Request.QueryString["Time"];
        IList<RunningInfo>[] listruning = Api.ServiceAccessor.GetSmsService().getRunningInfo(Line_Code, Convert.ToDouble(GIS_X), Convert.ToDouble(GIS_Y), Convert.ToDateTime(startTime), Convert.ToDateTime(Time));

        StringBuilder json = new StringBuilder();
        json.Append("[");
        if (TYPE == "上行")
        {
            for (int i = 0; i < listruning[0].Count; i++)
            {
                json.Append("{");
                json.Append("TRAIN_NO:\"" + listruning[0][i].TrainNo + "\"");//交路号
                json.Append(",");
                json.Append("KM_MARK:\"" + listruning[0][i].KmMark + "\"");//公里标
                json.Append(",");
                json.Append("GIS_X:\"" + listruning[0][i].GIS_X + "\"");//经度
                json.Append(",");
                json.Append("GIS_Y:\"" + listruning[0][i].GIS_Y + "\"");//纬度
                json.Append(",");
                json.Append("RaisedTime:\"" + listruning[0][i].RaisedTime + "\"");//纬度
                json.Append(",");
                json.Append("XB:\"" + listruning[0][i].XB + "\"");//纬度
                json.Append(",");
                json.Append("LineCode:\"" + listruning[0][i].LineCode + "\"");//纬度
                json.Append(",");
                json.Append("LineName:\"" + listruning[0][i].LineName + "\"");//纬度
                json.Append(",");
                json.Append("Alarm_ID:\"" + listruning[0][i].AlarmID + "\"");//速度
                if (i < listruning[0].Count - 1)
                {
                    json.Append("},");
                }
                else
                {
                    json.Append("}");
                }
            }
        }
        else
        {
            for (int i = 0; i < listruning[1].Count; i++)
            {
                json.Append("{");
                json.Append("TRAIN_NO:\"" + listruning[1][i].TrainNo + "\"");//交路号
                json.Append(",");
                json.Append("KM_MARK:\"" + listruning[1][i].KmMark + "\"");//公里标
                json.Append(",");
                json.Append("GIS_X:\"" + listruning[1][i].GIS_X + "\"");//经度
                json.Append(",");
                json.Append("GIS_Y:\"" + listruning[1][i].GIS_Y + "\"");//纬度
                json.Append(",");
                json.Append("RaisedTime:\"" + listruning[1][i].RaisedTime + "\"");//纬度
                json.Append(",");
                json.Append("XB:\"" + listruning[1][i].XB + "\"");//纬度
                json.Append(",");
                json.Append("LineCode:\"" + listruning[1][i].LineCode + "\"");//纬度
                json.Append(",");
                json.Append("LineName:\"" + listruning[1][i].LineName + "\"");//纬度
                json.Append(",");
                json.Append("Alarm_ID:\"" + listruning[1][i].AlarmID + "\"");//速度
                if (i < listruning[1].Count - 1)
                {
                    json.Append("},");
                }
                else
                {
                    json.Append("}");
                }
            }
        }
        json.Append("]");
        object myObj = JsonConvert.DeserializeObject(json.ToString());
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