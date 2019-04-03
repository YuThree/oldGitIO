<%@ WebHandler Language="C#" Class="Query" %>

using System;
using System.Web;
using System.IO;
using System.Data;
using System.Collections.Generic;
using Api.Fault.entity.sms;
using Api.Foundation.entity.Foundation;
using System.Collections;

public class Query : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        double X = Convert.ToDouble(HttpContext.Current.Request["X"]);//经度
        double Y = Convert.ToDouble(HttpContext.Current.Request["Y"]);//纬度
        string XB = HttpContext.Current.Request["XB"];//行别
        string LINE_CODE = HttpContext.Current.Request["LINE_CODE"];//线路
        if (LINE_CODE == "0")
        {

            LINE_CODE = "";
        }
        else {
        }
        int page = 1;
        int pagesize = 10;
        IList<C3_LocationInfo> list = Api.Util.PositionConverter.getNearKmMarkByGPS(X, Y, page, pagesize, LINE_CODE, XB, 1);
        int recordCount = list.Count;
        string jsonStr = "{'rows':[";
        for (int i = 0; i < list.Count; i++)
        {
      //      jsonStr += "{'train_no':'" + list[i].TRAIN_NO + "','crossing_no':'" + list[i].CROSSING_NO + "','station_no':'" + list[i].STATION_NO + "','gis_x':'" + list[i].GIS_X + "','gis_y':'" + list[i].GIS_Y + "','km_mark':'" + list[i].KM_MARK + "','CJ':'" + list[i].distance + "','JW':'" + list[i].LOCO_DEPOT + "','detect_time':'" + list[i].DETECT_TIME + "','DIRECTION':'" + list[i].DIRECTION + "'},";
            jsonStr += "{'train_no':'" +""+ "','crossing_no':'" + list[i].CROSSING_NO + "','station_no':'" + list[i].STATION_NO + "','gis_x':'" + list[i].GIS_X + "','gis_y':'" + list[i].GIS_Y + "','km_mark':'" + list[i].KM_MARK + "','CJ':'" + list[i].distance + "','JW':'" + "" + "','detect_time':'" + "" + "','DIRECTION':'" + list[i].DIRECTION + "'},";

        }
        if (jsonStr.LastIndexOf(',') > 0)
        {
            jsonStr = jsonStr.Substring(0, jsonStr.LastIndexOf(',')) + "],'page':" + page + ",'rp':" + pagesize + ",'total':" + recordCount + "}";
        }
        else
        {
            jsonStr += "],'page':'" + page + "','rp':'" + pagesize + "','total':'" + recordCount + "'}";

        }
        jsonStr = jsonStr.Replace("'", "\"");
        HttpContext.Current.Response.Write(jsonStr);
        
        

    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}