<%@ WebHandler Language="C#" Class="GetLineInspectionList" %>

using System;
using System.Web;
using System.Data;
using System.Text;

public class GetLineInspectionList : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        try
        {
            string action = HttpContext.Current.Request["action"];
            switch (action)
            {
                case "query":
                    getQueryList();
                    break;
                case "video":
                    getVideoInfo();
                    break;
                case "location":
                    getPoleLocation();
                    break;
                default:
                    break;
            }
        }
        catch (Exception ex)
        {

            log4net.ILog log2 = log4net.LogManager.GetLogger("线路巡检");
            log2.Error("Error", ex);
        }
    }
    /// <summary>
    /// 获取线路巡检首页数据
    /// </summary>
    public void getQueryList()
    {
        string LINE_CODE = HttpContext.Current.Request["LINE_CODE"];//线路
        string DIRECTION = HttpContext.Current.Request["DIRECTION"];//行别
        string MONTH_NO = HttpContext.Current.Request["MONTH_NO"];//月度巡检批次

        DateTime starttime = string.IsNullOrEmpty(HttpContext.Current.Request["starttime"]) ? DateTime.Parse("0001-01-01") : (Convert.ToDateTime(HttpContext.Current.Request["starttime"]));//起始时间
        DateTime endtime = string.IsNullOrEmpty(HttpContext.Current.Request["endtime"]) ? DateTime.Parse("2999-01-01") : (Convert.ToDateTime(HttpContext.Current.Request["endtime"]));//终止时间

        int PageSize = string.IsNullOrEmpty(HttpContext.Current.Request["pageSize"]) ? 0 : Convert.ToInt32(HttpContext.Current.Request["pageSize"]);//页大小
        int PageIndex = string.IsNullOrEmpty(HttpContext.Current.Request["pageIndex"]) ? 0 : Convert.ToInt32(HttpContext.Current.Request["pageIndex"]);//当前页

        System.Data.DataSet ds = ADO.LineInspectImpl.LI_HomePage(LINE_CODE, DIRECTION, starttime, endtime, PageSize, PageIndex,MONTH_NO);//获取数据
        string json = PublicMethod.getJson(ds, PageSize, PageIndex);//转换为json

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }
    /// <summary>
    /// 获取线路巡检视频播放数据数据
    /// </summary>
    public void getVideoInfo()
    {
        string id = HttpContext.Current.Request["id"];
        string starttime = HttpContext.Current.Request["starttime"];
        string endtime = HttpContext.Current.Request["endtime"];
        string positioncode = HttpContext.Current.Request["positioncode"];//区站

        int PageSize = string.IsNullOrEmpty(HttpContext.Current.Request["pageSize"]) ? 0 : Convert.ToInt32(HttpContext.Current.Request["pageSize"]);//页大小
        int PageIndex = string.IsNullOrEmpty(HttpContext.Current.Request["pageIndex"]) ? 0 : Convert.ToInt32(HttpContext.Current.Request["pageIndex"]);//当前页
        string AB_SURFACE = string.IsNullOrEmpty(HttpContext.Current.Request["AB_SURFACE"]) ? "A" : HttpContext.Current.Request["AB_SURFACE"];//A,B面
        string DIRECTION = HttpContext.Current.Request["DIRECTION"];//行别
        int startKM = string.IsNullOrEmpty(HttpContext.Current.Request["startKM"]) ? -1 : Convert.ToInt32(HttpContext.Current.Request["startKM"]);//起始公里标
        int endKM = string.IsNullOrEmpty(HttpContext.Current.Request["endKM"]) ? -1 : Convert.ToInt32(HttpContext.Current.Request["endKM"]);//结束公里标

        System.Data.DataSet ds = ADO.LineInspectImpl.LI_Play(id,DIRECTION,starttime,endtime,PageSize,PageIndex,AB_SURFACE,positioncode,startKM,endKM);
        string json = getJson(ds.Tables[0],PageIndex,PageSize);

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }
    /// <summary>
    /// 拼接json
    /// </summary>
    /// <param name="dt">数据源</param>
    /// <param name="pageindex">当前页</param>
    /// <param name="pagesize">页大小</param>
    /// <returns>json</returns>
    public string getJson(DataTable dt,int pageindex,int pagesize)
    {
        StringBuilder json = new StringBuilder();

        json.Append("{\"data\":[");
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            try
            {
                json.Append("{\"LINE_INSPECT_ID\":\"" + dt.Rows[i]["LINE_INSPECT_ID"] + "\",");//线路巡检ID
                json.Append("\"ID\":\"" + dt.Rows[i]["ID"] + "\",");//唯一标识
                json.Append("\"LOCOMOTIVE_CODE\":\"" + dt.Rows[i]["LOCOMOTIVE_CODE"] + "\",");//检测设备编码
                json.Append("\"INSPECT_TIME\":\"" + (string.IsNullOrEmpty(dt.Rows[i]["INSPECT_TIME"].ToString())?"": Convert.ToDateTime(dt.Rows[i]["INSPECT_TIME"]).ToString("yyyy-MM-dd HH:mm:ss")) + "\",");//巡检时间
                json.Append("\"DIRECTION\":\"" + dt.Rows[i]["DIRECTION"] + "\",");//行别
                json.Append("\"KM_MARK\":\"" + PublicMethod.KmtoString(dt.Rows[i]["KM_MARK"].ToString()) + "\",");//公里标
                json.Append("\"KM_MARK_O\":\"" + dt.Rows[i]["KM_MARK"] + "\",");//原始公里标
                json.Append("\"LINE_NAME\":\"" + dt.Rows[i]["LINE_NAME"] + "\",");//线路名称
                json.Append("\"LINE_CODE\":\"" + dt.Rows[i]["LINE_CODE"] + "\",");//线路
                json.Append("\"POLE_NUMBER\":\"" + dt.Rows[i]["POLE_NUMBER"] + "\",");//杆号
                json.Append("\"POLE_CODE\":\"" + dt.Rows[i]["POLE_CODE"] + "\",");//杆编码
                json.Append("\"BRG_TUN_NAME\":\"" + dt.Rows[i]["BRG_TUN_NAME"] + "\",");//桥隧名称
                json.Append("\"BRG_TUN_CODE\":\"" + dt.Rows[i]["BRG_TUN_CODE"] + "\",");//桥隧
                json.Append("\"POSITION_NAME\":\"" + dt.Rows[i]["POSITION_NAME"] + "\",");//区站名称
                json.Append("\"POSITION_CODE\":\"" + dt.Rows[i]["POSITION_CODE"] + "\",");//区站
                json.Append("\"LOCATION\":\"" + getLocation(dt.Rows[i]) + "\",");//综合位置信息
                json.Append("\"GIS_LON\":\"" + dt.Rows[i]["GIS_LON"] + "\",");//经度（百度坐标）
                json.Append("\"GIS_LAT\":\"" + dt.Rows[i]["GIS_LAT"] + "\",");//纬度（百度坐标）
                json.Append("\"GIS_LON_O\":\"" + dt.Rows[i]["GIS_LON_O"] + "\",");//原始经度
                json.Append("\"GIS_LAT_O\":\"" + dt.Rows[i]["GIS_LAT_O"] + "\",");//原始纬度
                json.Append("\"STATION_NAME\":\"" + dt.Rows[i]["STATION_NAME"] + "\",");//站点名称
                json.Append("\"STATION_NO\":\"" + dt.Rows[i]["STATION_NO"] + "\",");//站点
                json.Append("\"CREATED_TIME\":\"" + (string.IsNullOrEmpty(dt.Rows[i]["CREATED_TIME"].ToString())?"": Convert.ToDateTime(dt.Rows[i]["CREATED_TIME"]).ToString("yyyy-MM-dd HH:mm:ss")) + "\",");//记录创建时间
                json.Append("\"BOWLOC\":\"" + dt.Rows[i]["BOWLOC"] + "\",");//弓位置
                json.Append("\"SPEED\":\"" + dt.Rows[i]["SPEED"] + "\",");//机车速度
                json.Append("\"HVALUE\":\"" + dt.Rows[i]["HVALUE"] + "\",");//导高值
                json.Append("\"PVALUE\":\"" + dt.Rows[i]["PVALUE"] + "\",");//拉出值
                json.Append("\"MXIRTEMP\":\"" + dt.Rows[i]["MXIRTEMP"] + "\",");//红外最高温度
                json.Append("\"ENVTEMP\":\"" + dt.Rows[i]["ENVTEMP"] + "\",");//环境温度呢
                json.Append("\"SATELLITES\":\"" + dt.Rows[i]["SATELLITES"] + "\",");//卫星数量
                json.Append("\"GPS_SPEED\":\"" + dt.Rows[i]["GPS_SPEED"] + "\",");//GPS速度
                json.Append("\"HSPACE\":\"" + dt.Rows[i]["HSPACE"] + "\",");//水平间距
                json.Append("\"BOWSTAT\":\"" + dt.Rows[i]["BOWSTAT"] + "\",");//弓状态
                json.Append("\"AB_SURFACE\":\"" + dt.Rows[i]["AB_SURFACE"] + "\",");//(A面,B面)
                json.Append("\"IMG_DIR\":\"" + (string.IsNullOrEmpty(dt.Rows[i]["IMG_DIR"].ToString())?"":dt.Rows[i]["IMG_DIR"].ToString().Replace("\\","\\\\").Replace("#","%23")) + "\",");//图片目录
                json.Append("\"FRAME_NO\":\"" + dt.Rows[i]["FRAME_NO"] + "\",");//帧号
                json.Append("\"BOW_IMG_DIR\":\"" + (string.IsNullOrEmpty(dt.Rows[i]["IMG_DIR"].ToString())?"":dt.Rows[i]["IMG_DIR"].ToString().Replace("\\", "/").Replace("#","%23")) + "/BOW_" + dt.Rows[i]["FRAME_NO"] + ".jpg\",");//辅助图片路径
                json.Append("\"DLV_IMG_DIR\":\"" + (string.IsNullOrEmpty(dt.Rows[i]["IMG_DIR"].ToString())?"":dt.Rows[i]["IMG_DIR"].ToString().Replace("\\", "/").Replace("#","%23")) + "/DLV_" + dt.Rows[i]["FRAME_NO"] + ".jpg\",");//红外图片路径
                json.Append("\"HD_IMG_DIR\":\"" + (string.IsNullOrEmpty(dt.Rows[i]["IMG_DIR"].ToString())?"":dt.Rows[i]["IMG_DIR"].ToString().Replace("\\", "/").Replace("#","%23")) + "/HD_" + dt.Rows[i]["FRAME_NO"] + ".jpg\",");//高清局部图片路径
                json.Append("\"OVER_IMG_DIR\":\"" + (string.IsNullOrEmpty(dt.Rows[i]["IMG_DIR"].ToString())?"":dt.Rows[i]["IMG_DIR"].ToString().Replace("\\", "/").Replace("#","%23")) + "/OVER_" + dt.Rows[i]["FRAME_NO"] + ".jpg\"");//全景图片路径
                if (i == dt.Rows.Count - 1)
                {
                    json.Append("}");
                }
                else
                {
                    json.Append("},");
                }
            }
            catch (Exception)
            {
                log4net.ILog log2 = log4net.LogManager.GetLogger("线路巡检播放页");
                log2.DebugFormat("json生成出错，ID:{0}", dt.Rows[i]["ID"]);
            }
        }
        json.Append("]");

        PageHelper ph = new PageHelper();
        int total = 0;
        if (dt.Rows.Count > 0)
        {
            total = Convert.ToInt32(dt.Rows[0]["total"]);
        }
        json.Append("," + ph.getPageJson(total,pageindex,pagesize) + "}");

        return json.ToString();
    }
    /// <summary>
    /// 获取综合位置信息
    /// </summary>
    /// <param name="dt">数据源</param>
    /// <returns>综合位置信息</returns>
    public string getLocation(DataRow dtr)
    {
        StringBuilder str = new StringBuilder();
        str.Append("&nbsp;" + dtr["LINE_NAME"] + "&nbsp;" + dtr["POSITION_NAME"] + "&nbsp;" + dtr["BRG_TUN_NAME"] + "&nbsp;" + dtr["DIRECTION"] +  "&nbsp;" + PublicMethod.KmtoString(dtr["KM_MARK"].ToString()) + "&nbsp;" + dtr["POLE_NUMBER"]);
        if (!string.IsNullOrEmpty(dtr["POLE_NUMBER"].ToString()))
        {
            str.Append("支柱");
        }
        return str.ToString();
    }
    /// <summary>
    /// 获取杆在播放页的位置
    /// </summary>
    public void getPoleLocation()
    {
        string id = HttpContext.Current.Request["id"];
        string DIRECTION = HttpContext.Current.Request["DIRECTION"];//行别
        string starttime = HttpContext.Current.Request["starttime"];
        string endtime = HttpContext.Current.Request["endtime"];
        string positioncode = HttpContext.Current.Request["positioncode"];//区站
        string pole_no = HttpContext.Current.Request["pole_no"];//杆号

        string AB_SURFACE = string.IsNullOrEmpty(HttpContext.Current.Request["AB_SURFACE"]) ? "A" : HttpContext.Current.Request["AB_SURFACE"];//A,B面
        int startKM = string.IsNullOrEmpty(HttpContext.Current.Request["startKM"]) ? -1 : Convert.ToInt32(HttpContext.Current.Request["startKM"]);//起始公里标
        int endKM = string.IsNullOrEmpty(HttpContext.Current.Request["endKM"]) ? -1 : Convert.ToInt32(HttpContext.Current.Request["endKM"]);//结束公里标

        int i = ADO.LineInspectImpl.LI_PlayLocation(id, DIRECTION, starttime, endtime, AB_SURFACE, positioncode, startKM, endKM, pole_no);

        HttpContext.Current.Response.Write(i);
    }


    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}