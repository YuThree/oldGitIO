/*========================================================================================*
* 功能说明：站点信息
* 注意事项：
* 作    者： 邓杰
* 版本日期：2013年10月21日
* 变更说明：
* 版 本 号： V1.0
*=======================================================================================*/
<%@ WebHandler Language="C#" Class="BMapLineDataPoints" %>

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using Newtonsoft.Json;
using System.Data;
using Api.Foundation.entity.Foundation;
using Api.Foundation.entity.Cond;

public class BMapLineDataPoints : ReferenceClass, IHttpHandler
{
    /// <summary>
    /// 区站操作
    /// </summary>
    /// <param name="context"></param>
    public void ProcessRequest(HttpContext context)
    {
        //类型1：取中心点坐标 2：取描点坐标  4.工区信息(现在未用)
        String level = context.Request.QueryString["level"].ToString();
        //线路code
        String objId = context.Request.QueryString["mislineid"].ToString();
        if (level != "4")
        {
            getMapMisPoint(objId, level, context);
        }
        else
        {
            getMapMisOrgPoint(objId, context);
        }
    }
    /// <summary>
    /// 获取线路下的线
    /// </summary>
    /// <param name="objId">线路code</param>
    /// <param name="level">重点点类别 1：取中心点坐标 2：取描点坐标</param>
    public void getMapMisPoint(String objId, String level, HttpContext context)
    {
        Line line = new Line();
        IList<StationSection> stationsectionlist = new List<StationSection>();
        IList<StationSection> linestationsectionlist = new List<StationSection>();
        DataSet ds = new DataSet(); ;
        StationSectionCond stationsection = new StationSectionCond();
        stationsection.POSITION_TYPE = "S";
        StationSection stationsections = new StationSection();
        IList<Line> linelist = new List<Line>();
        switch (level)
        {
            //获取线路下标注所有站场中中心点坐标
            case "1":
                IList<StationSection> list = Api.ServiceAccessor.GetFoundationService().getStationSectionByLineCode(objId);
                foreach (StationSection station in list)
                {
                    if (station.GIS_LAT != 0)
                    {
                        linestationsectionlist.Add(station);
                    }
                }
                break;
            //获取线路下标注所有站场坐标
            case "2":
                stationsectionlist = Api.ServiceAccessor.GetFoundationService().queryStationSection(stationsection);
                break;
            case "3":

                break;
            case "getAllPosion":
                //objID 就是 lineCode
                string OrgCode = HttpContext.Current.Request["OrgCode"] != null ? HttpContext.Current.Request["OrgCode"].ToString() : "";
                string OrgType = HttpContext.Current.Request["OrgType"] != null ? HttpContext.Current.Request["OrgType"].ToString() : "";

                var posintions =
                    from n in Api.Util.Common.stationSectionDic
                    where
                             (string.IsNullOrEmpty(OrgCode) || (  n.Value.ORG_CODE!=null && n.Value.ORG_CODE.IndexOf(OrgCode) > -1   ))
                          && (string.IsNullOrEmpty(objId) || n.Value.LINE_CODE == objId) && n.Value.POSITION_TYPE=="S"
                    orderby n.Value.POSITION_ORDER
                    select n.Value;


                stationsectionlist = posintions.ToList<StationSection>();


                break;
        }
        context.Response.Cache.SetCacheability(HttpCacheability.NoCache);
        context.Response.ContentType = "text/plain";
        StringBuilder Json = new StringBuilder();
        Json.Append("[");
        //站点JSON串
        if (stationsectionlist != null)
        {
            for (int i = 0; i < stationsectionlist.Count; i++)
            {
                if (stationsectionlist[i].GIS_LON == 0 || stationsectionlist[i].POSITION_TYPE != "S")
                {
                    //跳过没有经纬度的区站
                    continue;
                }
                Json.Append("{");
                Json.Append("startLongitude:\"" + stationsectionlist[i].GIS_LON + "\"");
                Json.Append(",");
                Json.Append("startLatitude:\"" + stationsectionlist[i].GIS_LAT + "\"");
                Json.Append(",");
                Json.Append("startKM:\"" + stationsectionlist[i].START_KM + "\"");
                Json.Append(",");
                Json.Append("endKM:\"" + stationsectionlist[i].END_KM + "\"");
                Json.Append(",");
                Json.Append("StationSectionName:\"" + stationsectionlist[i].POSITION_NAME + "\"");
                Json.Append(",");
                Json.Append("MIS_LINE_ID:\"" + stationsectionlist[i].LINE_CODE + "\"");
                Json.Append(",");
                Json.Append("LINE_NAME:\"" + stationsectionlist[i].LINE_NAME + "\"");
                Json.Append(",");
                Json.Append("POSITION_CODE:\"" + stationsectionlist[i].POSITION_CODE + "\"");
                Json.Append(",");
                Json.Append("POSITION_CODE_PLUS:\"" + stationsectionlist[i].POSITION_CODE_PLUS + "\"");
                Json.Append(",");
                Json.Append("POSITION_TYPE:\"" + stationsectionlist[i].POSITION_TYPE + "\"");
                Json.Append(",");
                Json.Append("GIS_SHOW:\"" + stationsectionlist[i].GIS_SHOW + "\"");
                if (i < stationsectionlist.Count - 1)
                {
                    Json.Append("},");
                }
                else
                {
                    Json.Append("}");
                }

            }
        }
        //线路中心JSON传
        if (linestationsectionlist.Count > 0)
        {
            int num = linestationsectionlist.Count / 2;
            Json.Append("{");
            Json.Append("longitudeCenter:\"" + linestationsectionlist[num].GIS_LON + "\"");
            Json.Append(",");
            Json.Append("latitudeCenter:\"" + linestationsectionlist[num].GIS_LAT + "\"");
            Json.Append(",");
            Json.Append("lineName:\"" + linestationsectionlist[num].LINE_NAME + "\"");
            Json.Append("}");

        }
        Json.Append("]");
        object myObj = JsonConvert.DeserializeObject(Json.ToString());
        context.Response.Write(myObj);

    }
    /// <summary>
    /// 工区信息
    /// </summary>
    /// <param name="objId"></param>
    /// <param name="context"></param>
    public void getMapMisOrgPoint(String objId, HttpContext context)
    {
        IList<Organization> organizationlist = new List<Organization>();
        Organization organization = new Organization();
        StringBuilder Json = new StringBuilder();
        organization.GIS_LON = 114.481167;
        organization.GIS_LAT = 30.713159;
        organization.ORG_NAME = "****工区";
        organizationlist.Add(organization);
        Json.Append("[");
        for (int i = 0; i < organizationlist.Count; i++)
        {
            Json.Append("{");
            Json.Append("GIS_X:\"" + organizationlist[i].GIS_LON + "\"");
            Json.Append(",");
            Json.Append("GIS_Y:\"" + organizationlist[i].GIS_LAT + "\"");
            Json.Append(",");
            Json.Append("ORG_NAME:\"" + organizationlist[i].ORG_NAME + "\"");
            if (i < organizationlist.Count - 1)
            {
                Json.Append("},");
            }
            else
            {
                Json.Append("}");
            }
        }
        Json.Append("]");
        object myObj = JsonConvert.DeserializeObject(Json.ToString());
        context.Response.Write(myObj);
    }
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}