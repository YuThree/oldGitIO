<%@ WebHandler Language="C#" Class="GetPoleInfoByGPS" %>

using System;
using System.Web;
using Api.Util;
using Api.Foundation.entity.Cond;
using Api.Foundation.entity.Foundation;
using System.Collections.Generic;
using System.Text;

public class GetPoleInfoByGPS : ReferenceClass,IHttpHandler {

    public void ProcessRequest (HttpContext context) {


        //计算坐标值均为百度坐标值
        double centerLon = string.IsNullOrEmpty(context.Request["centerLon"])?0:Convert.ToDouble(context.Request["centerLon"]);//定位点经度值
        double centerLat = string.IsNullOrEmpty(context.Request["centerLat"])?0:Convert.ToDouble(context.Request["centerLat"]);//定位点纬度值
        string isOriginal = string.IsNullOrEmpty(context.Request["isOriginal"]) ? "true" : context.Request["isOriginal"];//是否为原始坐标标志

        //如果为原始坐标，则转换为百度坐标进行计算
        if (isOriginal == "true")
        {
            string[] gpsArray = CoordinateConvert.convert2B(centerLon.ToString(), centerLat.ToString()).Split(',');
            centerLon = Convert.ToDouble(gpsArray[0]);
            centerLat = Convert.ToDouble(gpsArray[1]);
        }

        double range = string.IsNullOrEmpty(context.Request["range"]) ? 0 : Convert.ToDouble(context.Request["range"]);//范围 单位为米

        GetPoleInfo(centerLon, centerLat, range);
    }

    /// <summary>
    /// 根据输入的GPS坐标 查询临近一定范围的支柱
    /// </summary>
    /// <param name="centerLon"></param>
    /// <param name="centerLat"></param>
    /// <param name="range"></param>
    public static void GetPoleInfo(double centerLon,double centerLat,double range)
    {
        PositionConverter.GPS minPos = new PositionConverter.GPS();
        PositionConverter.GPS maxPos = new PositionConverter.GPS();

        PositionConverter.getGPSRange(centerLon, centerLat, range / 1000 * 2, ref minPos, ref maxPos);
        //获取一定范围内的支柱
        PoleCond pc = new PoleCond();
        pc.businssAnd = String.Format(@" GIS_LON <= {0} AND GIS_LON >= {1} AND GIS_LAT <= {2} AND GIS_LAT >= {3}", maxPos.gisLon, minPos.gisLon, maxPos.gisLat, minPos.gisLat);

        IList<Pole> pl = Api.ServiceAccessor.GetFoundationService().queryPole(pc);

        //根据每根支柱的距离筛选支柱
        List<Pole> pl_new = new List<Pole>();
        Pole nearestPole = new Pole();
        double nearestPoleDistance = range;
        foreach(Pole p in pl)
        {
            //计算中心点和支柱的距离
            double distance = PositionConverter.GpsDistance(centerLon, centerLat, p.GIS_LON, p.GIS_LAT);

            //如果支柱距离小于范围值 则添加进结果集
            if (distance <= range)
            {
                pl_new.Add(p);
            }

            //获取最近支柱和最近支柱的距离
            if (distance <= nearestPoleDistance)
            {
                nearestPole = p;
                nearestPoleDistance = distance;
            }
        }

        //结果拼接
        StringBuilder result = new StringBuilder();
        if (pl.Count == 0 || pl_new.Count == 0)
        {
            result.Append("{\"data\":[],\"nearestPoleDistance\":0,\"nearestPoleCode\":\"" + nearestPole.POLE_CODE + "\",\"centerLon\":\"" + centerLon + "\",\"centerLat\":\"" + centerLat + "\"}");
        }
        else
        {
            result.Append("{\"data\":[");
            for (int i= 0; i < pl_new.Count; i++)
            {
                result.Append("{");
                //result.Append("\"PoleID\":\"" + pl_new[i].ID + "\",");//支柱ID
                result.Append("\"PoleCode\":\"" + pl_new[i].POLE_CODE + "\",");//支柱编码
                result.Append("\"LineCode\":\"" + pl_new[i].LINE_CODE + "\",");//线路编码
                result.Append("\"LineName\":\"" + pl_new[i].LINE_NAME + "\",");//线路名
                result.Append("\"Direction\":\"" + pl_new[i].POLE_DIRECTION + "\",");//行别
                result.Append("\"PositionCode\":\"" + pl_new[i].POSITION_CODE + "\",");//区站编码
                result.Append("\"PositionName\":\"" + pl_new[i].POSITION_NAME + "\",");//区站名
                result.Append("\"Brg_tun_Code\":\"" + pl_new[i].BRG_TUN_CODE + "\",");//桥隧编码
                result.Append("\"Brg_tun_Name\":\"" + pl_new[i].BRG_TUN_NAME + "\",");//桥隧名
                result.Append("\"KMMark\":\"" + PublicMethod.KmtoString(Convert.ToInt32(pl_new[i].KMSTANDARD)) + "\",");//公里标
                result.Append("\"PoleNo\":\"" + pl_new[i].POLE_NO + "\",");//杆号
                result.Append("\"GIS_LON\":\"" + pl_new[i].GIS_LON + "\",");//百度经度
                result.Append("\"GIS_LAT\":\"" + pl_new[i].GIS_LAT + "\",");//百度纬度
                result.Append("\"GIS_LON_O\":\"" + pl_new[i].GIS_LON_O + "\",");//原始经度
                result.Append("\"GIS_LAT_O\":\"" + pl_new[i].GIS_LAT_O + "\"");//原始纬度
                result.Append("},");
            }
            result.Remove(result.Length - 1, 1);
            result.Append("],\"nearestPoleDistance\":" + nearestPoleDistance + ",\"nearestPoleCode\":\"" + nearestPole.POLE_CODE + "\",\"centerLon\":\"" + centerLon + "\",\"centerLat\":\"" + centerLat + "\"}");
        }

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(result);
    }

    public bool IsReusable {
        get {
            return false;
        }
    }

}