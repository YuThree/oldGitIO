<%@ WebHandler Language="C#" Class="DeviceInRectangular" %>

using System;
using System.Web;
using System.Collections.Generic;
using System.Linq;
using System.Data;
using System.Text;

public class DeviceInRectangular : ReferenceClass,IHttpHandler {
    private int pageIndex;
    private int pageSize;
    private int recordCount;
    public void ProcessRequest (HttpContext context) {
        try
        {
            pageIndex = Convert.ToInt32(HttpContext.Current.Request["page"]);
            pageSize = Convert.ToInt32(HttpContext.Current.Request["pagesize"]);
            DateTime httpStartTime = Convert.ToDateTime(HttpContext.Current.Request["startdate"]);
            DateTime httpEndTime = Convert.ToDateTime(HttpContext.Current.Request["enddate"]);
            string txtgis_x1 = HttpContext.Current.Request["txtgis_x1"];//经度1
            string txtgis_y1 = HttpContext.Current.Request["txtgis_y1"];//纬度1
            string txtgis_x2 = HttpContext.Current.Request["txtgis_x2"];//经度2
            string txtgis_y2 = HttpContext.Current.Request["txtgis_y2"];//纬度2
            Point gis1Point = new Point(Convert.ToDouble(txtgis_x1), Convert.ToDouble(txtgis_y1));
            Point gis2Point = new Point(Convert.ToDouble(txtgis_x2), Convert.ToDouble(txtgis_y2));
            Point[] gisPoint = new Point[2] { gis1Point, gis2Point };
            List<RecordInRect> jsonRecordInRect = new List<RecordInRect>();
            QueryInRegion queryInRegion = new QueryInRegion(httpStartTime, httpEndTime);
            jsonRecordInRect = queryInRegion.ShowCompartmentTrain(gisPoint);
            recordCount = jsonRecordInRect.Count;
            StringBuilder json = new StringBuilder();
            String jsonStr = AssemblyOfJson(json, jsonRecordInRect);
            HttpContext.Current.Response.ContentType = "application/json";
            HttpContext.Current.Response.Write(jsonStr);
        }
        catch (Exception ex)
        {
           log4net.ILog log2 = log4net.LogManager.GetLogger("缺陷GIS分析途径车辆模块");
            log2.Error("Error", ex);
        }
    }
    /// <summary>
    /// 组装JSON
    /// </summary>
    /// <param name="json"></param>
    /// <param name="data"></param>
    /// <returns></returns>
    public String AssemblyOfJson(StringBuilder json,List<RecordInRect> data)
    {

        //json.Append("{'rows':[");
        json.Append("{\"rows\":[");
        for (int i = 0; i < data.Count; i++)
        {
            json.Append("{");
            json.Append("\"TRAINNUM\":\"" + data[i].DeviceNum + "\",");
            //   json.Append(",");
            json.Append("\"STARTTIME\":\"" + data[i].StartTime + "\",");
            //   json.Append(",");
            json.Append("\"ENDTIME\":\"" + data[i].EndTime + "\",");
            //  json.Append(",");
            json.Append("\"GIS_LON\":\"" + data[i].GIS_LON + "\",");
            //  json.Append(",");
            json.Append("\"GIS_LAT\":\"" + data[i].GIS_LAT + "\",");
            //  json.Append(",");
            json.Append("\"DIRECTION\":\"" + data[i].Direction + "\",");
            //  json.Append(",");
            json.Append("\"LINECODE\":\"" + data[i].LineCode + "\"");
            json.Append("}");
            if (data.Count - i  > 1)
            {
                json.Append(",");
            }
        }
        //json.Append("],'page':'" + pageIndex + "','rp':'" + pageSize + "','total':'" + recordCount + "'}");
        json.Append("],\"page\":\"" + pageIndex + "\",\"rp\":\"" + pageSize + "\",\"total\":\"" + recordCount + "\"}");
        return myfiter.json_RemoveSpecialStr(json.ToString());
        // return json;

    }
    public bool IsReusable {
        get {
            return false;
        }
    }

}

public class Point {
    private double _x;
    private double _y;

    public  Point(double x,double y)
    {
        _x = x;
        _y = y;
    }
    public  Point()
    {
    }
    public double X
    {
        get {
            return _x;
        }
        set {
            _x = value;
        }
    }
    public double Y
    {
        get {
            return _y;
        }
        set {
            _y = value;
        }
    }
}
/// <summary>
/// QueryInRegion类，基于百度坐标的画框
/// </summary>
public class QueryInRegion{
    private Point[] pointList;
    private DateTime startTime;
    private DateTime endTime;
    //public QueryInRegion(Point[] Rect,DateTime startTime, DateTime endTime)
    public QueryInRegion(DateTime startTime, DateTime endTime)
    {
        //pointList = new Point[4];
        //pointList[0] = new Point(Rect[0].X,Rect[0].Y);
        //pointList[1] = new Point(Rect[0].X,Rect[1].Y);
        //pointList[2] = new Point(Rect[1].X,Rect[0].Y);
        //pointList[3] = new Point(Rect[1].X,Rect[1].Y);
        this.startTime = startTime;
        this.endTime = endTime;
    }


    /// <summary>
    /// 判断是否在矩形区域里
    /// </summary>
    /// <param name="objPoint"></param>
    /// <returns></returns>
    //public bool IsInside(Point objPoint)
    //{
    //    int nCross = 0;
    //    for (int i = 0; i < 4; i++)
    //    {
    //        Point p1;
    //        Point p2;

    //        p1 = pointList[i];
    //        //p2 = pointList[(i+1)%pointList.size()];
    //        p2 = pointList[(i + 1) % pointList.Length];
    //        if (p1.Y == p2.Y)
    //            continue;

    //        //if ( objPoint.Y < min(p1.Y, p2.Y))
    //        if (objPoint.Y < (p1.Y < p2.Y ? p1.Y : p2.Y))
    //            continue;

    //        //if ( objPoint.Y >= max(p1.Y, p2.Y))
    //        if (objPoint.Y >= (p1.Y > p2.Y ? p1.Y : p2.Y))
    //            continue;
    //        double x = (double)(objPoint.Y - p1.Y) * (double)(p2.X - p1.X) / (double)(p2.Y - p1.Y) + p1.X;
    //        if (x > objPoint.X)
    //            nCross++;
    //    }

    //    if (nCross % 2 == 1)
    //    {

    //        return true; //如果是奇数，说明在多边形里
    //    }
    //    else
    //    {

    //        return false; //否则在多边形外 或 边上
    //    }
    //}
    //public bool IsInside(Point objPoint,Point[] listPoint)
    //{
    //    double xMin = 0;
    //    double xMax = 0;
    //    double yMin = 0;
    //    double yMax = 0;
    //    double[] Temp = new double[4];
    //    for (int i = 0; i < 4; i++)
    //        Temp[i] = listPoint[i].X;
    //    xMin = Temp.Min();
    //    xMax = Temp.Max();
    //    if (xMin < objPoint.X && objPoint.X< xMax)
    //    {
    //        for (int i = 0; i < 4; i++)
    //            Temp[i] = listPoint[i].Y;
    //        yMin = Temp.Min();
    //        yMax = Temp.Max();
    //        if (yMin < objPoint.Y && objPoint.Y < yMax)
    //        {
    //            return true;
    //        }
    //        else
    //            return false;
    //    }
    //    else
    //        return false;
    //}
    /// <summary>
    /// 将符合时间、框区域内的数据提取出来
    /// </summary>
    /// <returns></returns>
    public List<RecordInRect> ShowCompartmentTrain(Point[] pointOfRect)
    {
        DataSet ds = new DataSet();
        Point tempPoint = new Point();
        List<RecordInRect> record = new List<RecordInRect>();
        double xMin = 0;
        double xMax = 0;
        double yMin = 0;
        double yMax = 0;
        xMin = Math.Min(pointOfRect[0].X,pointOfRect[1].X);
        xMax = Math.Max(pointOfRect[0].X,pointOfRect[1].X);
        yMin = Math.Min(pointOfRect[0].Y,pointOfRect[1].Y);
        yMax = Math.Max(pointOfRect[0].Y,pointOfRect[1].Y);
        //String sql = SELECT T.机车编号,T.开始时间,T.结束时间 FROM 表名T where T.DETECT_TIME betwee  TO_DATE('起始时间','yyyy-mm-dd hh24:mi:ss') and TO_DATE('结束时间','yyyy-mm-dd hh24:mi:ss');
        String sql = String.Format(@"SELECT T.LOCOMOTIVE_CODE,T.DETECT_TIME,T.GIS_LON,T.GIS_LAT,T.DIRECTION,T.LINE_CODE FROM C3_SMS T where (T.DETECT_TIME between  TO_DATE('{0}','yyyy-mm-dd hh24:mi:ss') 
and TO_DATE('{1}','yyyy-mm-dd hh24:mi:ss')) and (T.GIS_LON between {2} and {3}) and (T.GIS_LAT between {4} and {5}) order by T.DETECT_TIME",startTime,endTime,xMin,xMax,yMin,yMax);//查询规定时间内的列车记录
        ds = DbHelperOra.Query(sql);
        foreach(DataRow dr in ds.Tables[0].Rows)
        {
            //   tempPoint.X = Convert.ToDouble(dr["GIS_LON"]);
            //   tempPoint.Y = Convert.ToDouble(dr["GIS_LAT"]);
            //   if(IsInside(tempPoint))//筛选区域内的记录
            //    {
            RecordInRect temp = new RecordInRect();
            temp.DeviceNum = Convert.ToString(dr["LOCOMOTIVE_CODE"]);
            temp.RunningTime = Convert.ToDateTime(dr["DETECT_TIME"]);
            temp.GIS_LON = Convert.ToDouble(dr["GIS_LON"]);
            temp.GIS_LAT = Convert.ToDouble(dr["GIS_LAT"]);
            temp.Direction = Convert.ToString(dr["DIRECTION"]);
            temp.LineCode = Convert.ToString(dr["LINE_CODE"]);
            record.Add(temp);
            //    }
        }
        return RecordInRect.Merge(record);

    }

}
/// <summary>
/// 返回给前端页面的类
/// </summary>
public class RecordInRect
{
    private String deviceNum;
    private DateTime runningTime;
    private DateTime startTime;
    private DateTime endTime;
    private double gis_lon;
    private double gis_lat;
    private String direction;
    private String lineCode;
    //  public DateTime test;
    public String DeviceNum {
        get {
            return deviceNum;
        }
        set {
            deviceNum = value;
        }
    }
    public DateTime RunningTime {
        get {
            return runningTime;
        }
        set {
            runningTime = value;
        }
    }
    public DateTime StartTime {
        get {
            return startTime;
        }
        set {
            startTime = value;
        }
    }
    public DateTime EndTime {
        get {
            return endTime;
        }
        set {
            endTime = value;
        }
    }
    public double GIS_LON {
        get {
            return gis_lon;
        }
        set {
            gis_lon = value;
        }
    }
    public double GIS_LAT {
        get {
            return gis_lat;
        }
        set {
            gis_lat = value;
        }
    }
    public String Direction {
        get {
            return direction;
        }
        set {
            direction = value;
        }
    }
    public String LineCode {
        get {
            return lineCode;
        }
        set {
            lineCode = value;
        }
    }
    public static List<RecordInRect> Merge(List<RecordInRect> data){
        List<RecordInRect> tempdata = new List<RecordInRect>();

        List<List<RecordInRect>> sss = data.GroupBy(x => new { x.deviceNum,x.runningTime.Year,x.runningTime.Month,x.runningTime.Date}).Select(g => g.ToList()).ToList();
        foreach(List<RecordInRect> ss in sss)
        {
            RecordInRect oneRecord = new RecordInRect();
            oneRecord.deviceNum = ss[0].deviceNum;
            oneRecord.startTime = ss[0].runningTime;
            oneRecord.endTime = ss[ss.Count-1].runningTime;
            oneRecord.direction = ss[0].direction;
            oneRecord.gis_lon = ss[0].gis_lon;
            oneRecord.gis_lat = ss[0].gis_lat;
            oneRecord.lineCode = ss[0].lineCode;
            tempdata.Add(oneRecord);
            //dispose(oneRecord);

        }
        return tempdata;

    }

    //public void dispose(RecordInRect record)
    //{
    //    record.deviceNum = null;
    //    record.runningTime = new DateTime();// DateTime.MinValue的值为0001/1/1 0:00:00
    //    record.startTime = new DateTime();
    //    record.endTime = new DateTime();
    //}
}