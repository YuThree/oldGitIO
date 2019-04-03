<%@ WebHandler Language="C#" Class="kmMarkCount" %>

using System;
using System.Web;
using Api.Foundation.entity.Foundation;

public class kmMarkCount : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        try
        {
            string type = context.Request["action"];
            switch (type)
            {
                case "query":
                    QueryPosiInfo();
                    break;
                case "add":
                    AddPosiInfo();
                    break;
                case "addDistance":
                    AddPosiDistance();
                    break;
                case "update":
                    UpdatePosiInfo();
                    break;
                case "delete":
                    DeletePosiInfo();
                    break;
                case "queryAddedDistance":
                    queryAddedDistance();
                    break;
                case "updateAddedDistance":
                    updateAddedDistance();
                    break;
            }
        }
        catch (Exception ex)
        {
            log4net.ILog log2 = log4net.LogManager.GetLogger("行驶里程统计");
            log2.Error("Error", ex);
        }
    }
    /// <summary>
    /// 查询
    /// </summary>
    private void QueryPosiInfo()
    {
        string bueauName = HttpContext.Current.Request["bureauName"];
        string locomotiveCode = HttpContext.Current.Request["locomotive"];
        string startTime = HttpContext.Current.Request["startTime"];
        string endTime = HttpContext.Current.Request["endTime"];
        string reKmMark = my_sms.GetKmCount(bueauName, locomotiveCode, startTime, endTime); //得到公里标计算相应的json
        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(Newtonsoft.Json.JsonConvert.DeserializeObject(reKmMark));
    }
    /// <summary>
    /// 新增
    /// </summary>
    private void AddPosiInfo()
    {
        string locoCode = HttpContext.Current.Request["locomotive"];
        string runDate = HttpContext.Current.Request["runDate"];
        string posiCode = HttpContext.Current.Request["posiCode"];
        StationSection staSec = Api.Util.Common.getStationSectionInfo(posiCode);
        string lineCode = staSec.LINE_CODE;
        my_sms.AddPosiInfo(locoCode, runDate, lineCode, posiCode, staSec.START_KM);
    }
    /// <summary>
    /// 修改
    /// </summary>
    private void UpdatePosiInfo()
    {
        string rowID = HttpContext.Current.Request["rowID"];
        string locoCode = HttpContext.Current.Request["locomotive"];
        string runDate = HttpContext.Current.Request["runDate"];
        string posiCode = HttpContext.Current.Request["posiCode"];
        StationSection staSec = Api.Util.Common.getStationSectionInfo(posiCode);
        string lineCode = staSec.LINE_CODE;
        int kmMark;
        int.TryParse(HttpContext.Current.Request["kmMark"], out kmMark);
        my_sms.UpdatePosi(rowID, locoCode, runDate, lineCode, posiCode, staSec.START_KM);
    }
    /// <summary>
    /// 删除
    /// </summary>
    private void DeletePosiInfo()
    {
        string rowID = HttpContext.Current.Request["rowID"];
        my_sms.DelePosi(rowID);
    }

    /// <summary>
    /// 手动增加换线站点之间的距离
    /// </summary>
    public static void AddPosiDistance()
    {
        string StartStationCode = HttpContext.Current.Request["StartStation"];//开始站点编码
        string EndStationCode = HttpContext.Current.Request["EndStation"];//结束站点编码
        double distance = HttpContext.Current.Request["distance"] == null ? 0 : Convert.ToDouble(HttpContext.Current.Request["distance"])*1000;//站点间距离

        //数据插入
        bool result = ADO.Road_Haul.InsertStation(StartStationCode, EndStationCode, distance);

        HttpContext.Current.Response.Write(result.ToString());
    }

    /// <summary>
    /// 查询手动添加站点距离列表
    /// </summary>
    public static void queryAddedDistance()
    {
        string StationName = HttpContext.Current.Request["stationname"];//站点名称
        int pageSize = HttpContext.Current.Request["pagesize"]==null?0:Convert.ToInt32(HttpContext.Current.Request["pagesize"]);//页面大小
        int pageIndex = HttpContext.Current.Request["pageindex"]==null?0:Convert.ToInt32(HttpContext.Current.Request["pageindex"]);//当前页

        //数据查询
        System.Data.DataSet ds = ADO.Road_Haul.QueryChangeLineStation(StationName, pageSize, pageIndex);
        string json = null;
        try
        {

            if (ds.Tables.Count != 0)
            {
                json = PublicMethod.getJson(ds, pageSize, pageIndex);
            }
        }
        catch(Exception ex)
        {
            log4net.ILog log4 = log4net.LogManager.GetLogger("查询手动添加站点转json出错");
            log4.Error("执行出错", ex);
        }
        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);

    }

    /// <summary>
    /// 更新手动增加站点距离
    /// </summary>
    public static void updateAddedDistance()
    {
        string StartStationCode = HttpContext.Current.Request["StartStation"];//开始站点编码
        string EndStationCode = HttpContext.Current.Request["EndStation"];//结束站点编码
        double distance = HttpContext.Current.Request["distance"] == null ? 0 : Convert.ToDouble(HttpContext.Current.Request["distance"])*1000;//站点间距离

        //更新数据过程
        bool result = ADO.Road_Haul.UpdateStationDistance(StartStationCode, EndStationCode, distance);

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(result.ToString());
    }
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}