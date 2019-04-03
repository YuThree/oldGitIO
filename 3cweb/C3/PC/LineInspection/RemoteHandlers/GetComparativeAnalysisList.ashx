<%@ WebHandler Language="C#" Class="GetComparativeAnalysisList" %>

using System;
using System.Web;
using System.Text;

public class GetComparativeAnalysisList : ReferenceClass, IHttpHandler {

    public void ProcessRequest (HttpContext context) {
        try
        {
            string action = HttpContext.Current.Request["action"];
            switch (action)
            {
                case "repeatlist":
                    getRepeatList();
                    break;
                case "info":
                    getRepeatInfo();
                    break;
                case "getlinepole":
                    getLinePole();
                    break;
                default:
                    break;
            }
        }
        catch (Exception ex)
        {

            log4net.ILog log2 = log4net.LogManager.GetLogger("线路巡检对比分析");
            log2.Error("Error", ex);
        }
    }
    /// <summary>
    /// 获取巡检对比分析摘要列表 
    /// </summary>
    public void getRepeatList()
    {
        string POLE_CODE = HttpContext.Current.Request["POLE_CODE"];//杆编码

        System.Data.DataSet ds = ADO.LineInspectImpl.RepeatInspect(POLE_CODE);

        StringBuilder json = new StringBuilder();
        json.Append("{\"data\":[");

        for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
        {
            try
            {
                json.Append("{\"ID\":\"" + ds.Tables[0].Rows[i]["ID"] + "\",");//ID
                json.Append("\"MONTH_NO\":\"" + ds.Tables[0].Rows[i]["MONTH_NO"] + "\",");//月度巡检批次
                json.Append("\"LINE_CODE\":\"" + ds.Tables[0].Rows[i]["LINE_CODE"] + "\",");//线路编码
                json.Append("\"LINE_NAME\":\"" + ds.Tables[0].Rows[i]["LINE_NAME"] + "\",");//线路名称
                                                                                            //json.Append("\"BEGIN_TIME\":\"" + Convert.ToDateTime(ds.Tables[0].Rows[i]["BEGIN_TIME"]).ToString("yyyy-MM-dd HH:mm:ss") + "\",");//开始巡检时间
                json.Append("\"BEGIN_TIME\":\"" + (string.IsNullOrEmpty(ds.Tables[0].Rows[i]["BEGIN_TIME"].ToString()) ? "" : Convert.ToDateTime(ds.Tables[0].Rows[i]["BEGIN_TIME"]).ToString("yyyy-MM-dd HH:mm:ss")) + "\",");//开始巡检时间
                                                                                                                                                                                                                               //json.Append("\"END_TIME\":\"" + Convert.ToDateTime(ds.Tables[0].Rows[i]["END_TIME"]).ToString("yyyy-MM-dd HH:mm:ss") + "\"");//结束巡检时间
                json.Append("\"END_TIME\":\"" + (string.IsNullOrEmpty(ds.Tables[0].Rows[i]["END_TIME"].ToString()) ? "" : Convert.ToDateTime(ds.Tables[0].Rows[i]["END_TIME"]).ToString("yyyy-MM-dd HH:mm:ss")) + "\"");//结束巡检时间

                if (i == ds.Tables[0].Rows.Count - 1)
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

                log4net.ILog log2 = log4net.LogManager.GetLogger("线路巡检对比分析摘要");
                log2.DebugFormat("json生成出错，ID:{0}", ds.Tables[0].Rows[i]["ID"]);
            }
        }

        json.Append("]}");

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }
    /// <summary>
    ///获取线路巡检对比分析详细信息
    /// </summary>
    public void getRepeatInfo()
    {
        string LINE_INSPECT_ID = HttpContext.Current.Request["LINE_INSPECT_ID"];//线路巡检主键ID
        string AB_SURFACE = string.IsNullOrEmpty(HttpContext.Current.Request["AB_SURFACE"]) ? "A" : HttpContext.Current.Request["AB_SURFACE"];//A,B面
        string POLE_CODE = HttpContext.Current.Request["POLE_CODE"];//杆编码

        System.Data.DataSet ds = ADO.LineInspectImpl.RepeatInspectDetail(LINE_INSPECT_ID,POLE_CODE,AB_SURFACE);

        string json = getJson(ds);

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }
    /// <summary>
    /// 获取线路巡检下一杆编码
    /// </summary>
    public void getLinePole()
    {
        string sign = HttpContext.Current.Request["sign"];//NEXT,PRIOR
        string POLE_CODE = HttpContext.Current.Request["POLE_CODE"];//当前杆编码
        string LINE_INSPECT_ID = HttpContext.Current.Request["LINE_INSPECT_ID"];//线路巡检主键ID
        string repolecode = null;

        if (!string.IsNullOrEmpty(sign))
        {
            repolecode = ADO.LineInspectImpl.NextPole(POLE_CODE, sign, LINE_INSPECT_ID);
        }

        HttpContext.Current.Response.Write(repolecode);
    }
    /// <summary>
    /// 获取线路巡检对比分析详细信息json
    /// </summary>
    /// <param name="ds">数据源</param>
    /// <returns>线路巡检对比分析详细信息json</returns>
    public string getJson(System.Data.DataSet ds)
    {
        StringBuilder json = new StringBuilder();

        if (ds.Tables[0].Rows.Count > 0)
        {
            json.Append("{\"BOW_IMG_DIR\":[" + getImagePath("BOW_", ds) + "],");//辅助图片路径
            json.Append("\"DLV_IMG_DIR\":[" + getImagePath("DLV_", ds) + "],");//红外图片路径
            json.Append("\"HD_IMG_DIR\":[" + getImagePath("HD_", ds) + "],");//高清局部图片路径
            json.Append("\"OVER_IMG_DIR\":[" + getImagePath("OVER_", ds) + "],");//全景图片路径
            json.Append("\"FRAME_INFO\":[" + getFrameInfo(ds) + "],");//随播放变化的最高温度、环境温度、导高值、拉出值、速度
            json.Append("\"PLAY_IDX\":[" + getPlayIdx(ds) + "],");//播放索引
            json.Append("\"FRAME_INFO_LIST\":[" + getFrameInfoList(ds) + "],");//曲线用数据
            json.Append("\"POLE_CODE\":\"" + ds.Tables[0].Rows[0]["POLE_CODE"] + "\",");//杆编码
            json.Append("\"LOCOMOTIVE_CODE\":\"" + ds.Tables[0].Rows[0]["LOCOMOTIVE_CODE"] + "\",");//检测设备编码
            json.Append("\"INSPECT_TIME\":\"" + Convert.ToDateTime(ds.Tables[0].Rows[0]["INSPECT_TIME"]).ToString("yyyy-MM-dd HH:mm:ss") + "\",");//巡检时间
            json.Append("\"POLE_NUMBER\":\"" + ds.Tables[0].Rows[0]["POLE_NUMBER"] + "\",");//支柱号
            json.Append("\"LINE_NAME\":\"" + ds.Tables[0].Rows[0]["LINE_NAME"] + "\",");//线路
            json.Append("\"POSITION_NAME\":\"" + ds.Tables[0].Rows[0]["POSITION_NAME"] + "\",");//区站
            json.Append("\"DIRECTION\":\"" + ds.Tables[0].Rows[0]["DIRECTION"] + "\",");//行别
            json.Append("\"KM_MARK\":\"" + PublicMethod.KmtoString(ds.Tables[0].Rows[0]["KM_MARK"].ToString()) + "\",");//公里标
            json.Append("\"GIS_LON\":\"" + ds.Tables[0].Rows[0]["GIS_LON"] + "\",");//经度（百度坐标）
            json.Append("\"GIS_LAT\":\"" + ds.Tables[0].Rows[0]["GIS_LAT"] + "\",");//纬度（百度坐标）
            json.Append("\"GIS_LON_O\":\"" + ds.Tables[0].Rows[0]["GIS_LON_O"] + "\",");//原始经度
            json.Append("\"GIS_LAT_O\":\"" + ds.Tables[0].Rows[0]["GIS_LAT_O"] + "\",");//原始纬度
            json.Append("\"BOWLOC\":\"" + ds.Tables[0].Rows[0]["BOWLOC"] + "\",");//弓位置
            json.Append("\"AB_SURFACE\":\"" + ds.Tables[0].Rows[0]["AB_SURFACE"] + "\"}");//A,B面
        }

        return json.ToString();
    }
    /// <summary>
    /// 获取播放索引
    /// </summary>
    /// <param name="ds">数据源</param>
    /// <returns>播放索引</returns>
    public string getPlayIdx(System.Data.DataSet ds)
    {
        StringBuilder str = new StringBuilder();

        for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
        {
            str.Append("{\"FRAME_NO\":\"" + ds.Tables[0].Rows[i]["FRAME_NO"] + "\"}");//帧号
            if (i < ds.Tables[0].Rows.Count - 1)
            {
                str.Append(",");
            }
        }

        return str.ToString();
    }
    /// <summary>
    /// 获取曲线相关数据
    /// </summary>
    /// <param name="ds">数据源</param>
    /// <returns>曲线相关数据</returns>
    public string getFrameInfoList(System.Data.DataSet ds)
    {
        StringBuilder str = new StringBuilder();

        for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
        {
            str.Append("{\"FRAME_NO\":\"" + ds.Tables[0].Rows[i]["FRAME_NO"] + "\",");//帧号
            str.Append("\"MXIRTEMP\":\"" + ds.Tables[0].Rows[i]["MXIRTEMP"] + "℃\",");//最高红外温度
            str.Append("\"HVALUE\":\"" + ds.Tables[0].Rows[i]["HVALUE"] + "mm\",");//导高值
            str.Append("\"PVALUE\":\"" + ds.Tables[0].Rows[i]["PVALUE"] + "mm\"}");//拉出值
            if (i < ds.Tables[0].Rows.Count - 1)
            {
                str.Append(",");
            }
        }

        return str.ToString();
    }
    /// <summary>
    /// 获取随播放变化的最高温度、环境温度、导高值、拉出值、速度
    /// </summary>
    /// <param name="ds">数据源</param>
    /// <returns>随播放变化的最高温度、环境温度、导高值、拉出值、速度</returns>
    public string getFrameInfo(System.Data.DataSet ds)
    {
        StringBuilder str = new StringBuilder();

        for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
        {
            str.Append("\"最高温度：" + ds.Tables[0].Rows[i]["MXIRTEMP"] + "℃，");
            str.Append("环境温度：" + ds.Tables[0].Rows[i]["ENVTEMP"] + "℃，");
            str.Append("导高值：" + ds.Tables[0].Rows[i]["HVALUE"] + "mm，");
            str.Append("拉出值：" + ds.Tables[0].Rows[i]["PVALUE"] + "mm，");
            str.Append("速度：" + ds.Tables[0].Rows[i]["SPEED"] + "km/h\"");
            if (i < ds.Tables[0].Rows.Count - 1)
            {
                str.Append(",");
            }
        }

        return str.ToString();
    }
    /// <summary>
    /// 获取指定图片路径
    /// </summary>
    /// <param name="imageType">图片类型</param>
    /// <param name="ds">数据源</param>
    /// <returns>图片路径</returns>
    public string getImagePath(string imageType,System.Data.DataSet ds)
    {
        StringBuilder str = new StringBuilder();

        for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
        {
            try
            {
                //str.Append("\"" + ds.Tables[0].Rows[i]["IMG_DIR"].ToString().Replace("\\", "\\\\") + "\\\\" + imageType + ds.Tables[0].Rows[i]["FRAME_NO"] + ".jpg\"");
                str.Append("\"" + (string.IsNullOrEmpty(ds.Tables[0].Rows[i]["IMG_DIR"].ToString()) ? "" : ds.Tables[0].Rows[i]["IMG_DIR"].ToString().Replace("\\", "\\\\").Replace("#","%23")) + "\\\\" + imageType + ds.Tables[0].Rows[i]["FRAME_NO"] + ".jpg\"");
                if (i < ds.Tables[0].Rows.Count - 1)
                {
                    str.Append(",");
                }
            }
            catch (Exception)
            {

                log4net.ILog log2 = log4net.LogManager.GetLogger("线路巡检对比分析,图片路径");
                log2.DebugFormat("json生成出错，ID:{0},类型:{1}", ds.Tables[0].Rows[i]["ID"],imageType);
            }
        }

        return str.ToString();
    }

    public bool IsReusable {
        get {
            return false;
        }
    }

}