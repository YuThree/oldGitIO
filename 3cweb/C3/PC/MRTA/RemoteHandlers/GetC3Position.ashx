<%@ WebHandler Language="C#" Class="GetC3Position" %>

using System;
using System.Web;
using System.Xml;
using Api.Foundation.entity.Cond;
using Api.Foundation.entity.Foundation;
using Api.Fault.entity.alarm;
using System.Collections.Generic;

public class GetC3Position : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        string type = context.Request.QueryString["type"].ToString();
        switch (type)
        {
            //站点信息站点名称+坐标
            case "Position":
                GetLine(context);
                break;
            //一条线的所有站点的连线信息
            case "line":
                GetYLine(context);
                break;
            //所有连续信息
            case "":
                GetSYLine(context);
                break;
            //局的连线信息
            case "bureau":
                GetJLine(context);
                break;
            //菜单信息
            case "Org":
                GetOrg(context);
                break;
            default:
                break;
        }
    }
    /// <summary>
    /// 所有的站点连线信息
    /// </summary>
    /// <param name="context"></param>
    private static void GetSYLine(HttpContext context)
    {
        LineCond linecond = new LineCond();
        linecond.IS_SHOW = "1";
        linecond.myParaTime1 = DateTime.Now.AddDays(-1);
        linecond.myParaTime2 = DateTime.Now;
        linecond.myPara1 = "FAULT";
        linecond.myPara2 = "3C";
        IList<Line> lineList = Api.ServiceAccessor.GetFoundationService().queryLine(linecond);
        StationSectionCond stationSectioncond = new StationSectionCond();
        stationSectioncond.POSITION_TYPE = "S";
        stationSectioncond.startGisLat = 1;
        stationSectioncond.GIS_SHOW = 1;
        System.Text.StringBuilder json = new System.Text.StringBuilder();
        json.Append("[");
        for (int i = 0; i < lineList.Count; i++)
        {
            stationSectioncond.LINE_CODE = lineList[i].LINE_CODE;
            int alarmCount = Convert.ToInt32(lineList[i].MY_STR_1);//循环线路缺陷个数
            IList<StationSection> stationsectionList = Api.Util.Common.getStationSectionInfoFromCache(stationSectioncond);//.ServiceAccessor.GetFoundationService().queryStationSection(stationSectioncond);
            string point = "";
            if (stationsectionList.Count > 1)
            {
                point = (stationsectionList[0].GIS_LAT + stationsectionList[stationsectionList.Count - 1].GIS_LAT) / 2 + "," + (stationsectionList[0].GIS_LON + stationsectionList[stationsectionList.Count - 1].GIS_LON) / 2;
            }


            for (int j = 1; j < stationsectionList.Count; j++)
            {


                json.Append("[{name:'" + stationsectionList[j - 1].POSITION_NAME + "',type:1,smoothness:0.2,title:'" + stationsectionList[j - 1].LINE_NAME + "',code:'" + stationsectionList[j - 1].LINE_CODE + "',point:'" + point + "'},{name:'" + stationsectionList[j].POSITION_NAME + "',value: " + alarmCount + "}]");//交路号
                json.Append(",");
            }
        }
        json.Append("]");
        context.Response.Cache.SetCacheability(HttpCacheability.NoCache);
        context.Response.ContentType = "text/plain";
        object myObj = Newtonsoft.Json.JsonConvert.DeserializeObject(json.ToString());
        context.Response.Write(myObj);
    }
    /// <summary>
    /// 局的连线信息
    /// </summary>
    /// <param name="context"></param>
    private static void GetJLine(HttpContext context)
    {
        string code = context.Request.QueryString["Code"].ToString();
        LineCond linecond = new LineCond();
        linecond.IS_SHOW = "1";
        linecond.BUREAU_CODE = code;
        linecond.myParaTime1 = DateTime.Now.AddDays(-1);
        linecond.myParaTime2 = DateTime.Now;
        linecond.myPara1 = "FAULT";
        linecond.myPara2 = "3C";
        IList<Line> lineList = Api.ServiceAccessor.GetFoundationService().queryLineCount(linecond);
        StationSectionCond stationSectioncond = new StationSectionCond();
        stationSectioncond.POSITION_TYPE = "S";
        stationSectioncond.startGisLat = 1;
        stationSectioncond.GIS_SHOW = 1;
        stationSectioncond.BUREAU_CODE = code;
        System.Text.StringBuilder json = new System.Text.StringBuilder();
        json.Append("[");
        for (int i = 0; i < lineList.Count; i++)
        {
            stationSectioncond.LINE_CODE = lineList[i].LINE_CODE;
            int alarmCount = Convert.ToInt32(lineList[i].MY_STR_1);//循环线路缺陷个数
            IList<StationSection> stationsectionList = Api.Util.Common.getStationSectionInfoFromCache(stationSectioncond);//.ServiceAccessor.GetFoundationService().queryStationSection(stationSectioncond);
            string point = "";
            if (stationsectionList.Count > 1)
            {
                point = (stationsectionList[0].GIS_LAT + stationsectionList[stationsectionList.Count - 1].GIS_LAT) / 2 + "," + (stationsectionList[0].GIS_LON + stationsectionList[stationsectionList.Count - 1].GIS_LON) / 2;
            }
            for (int j = 1; j < stationsectionList.Count; j++)
            {
                json.Append("[{name:'" + stationsectionList[j - 1].POSITION_NAME + "',type:1,smoothness:0.2,title:'" + stationsectionList[j - 1].LINE_NAME + "',code:'" + stationsectionList[j - 1].LINE_CODE + "',point:'" + point + "'},{name:'" + stationsectionList[j].POSITION_NAME + "',value: " + alarmCount + "}]");//交路号
                json.Append(",");
            }
        }
        json.Append("]");
        context.Response.Cache.SetCacheability(HttpCacheability.NoCache);
        context.Response.ContentType = "text/plain";
        object myObj = Newtonsoft.Json.JsonConvert.DeserializeObject(json.ToString());
        context.Response.Write(myObj);
    }
    /// <summary>
    /// 线的连线信息
    /// </summary>
    /// <param name="context"></param>
    private static void GetYLine(HttpContext context)
    {
        string LineCode = context.Request.QueryString["Code"].ToString();

        StationSectionCond stationSectioncond = new StationSectionCond();
        stationSectioncond.POSITION_TYPE = "S";
        stationSectioncond.businssAnd = " gis_lat !=0";
        stationSectioncond.LINE_CODE = LineCode;
        AlarmCond alarmCond = new AlarmCond();
        alarmCond.startTime = DateTime.Now.AddDays(-1);
        alarmCond.endTime = DateTime.Now;
        alarmCond.DATA_TYPE = "FAULT";
        alarmCond.CATEGORY_CODE = "3C";
        System.Text.StringBuilder json = new System.Text.StringBuilder();
        json.Append("[");
        IList<StationSection> stationsectionList = Api.Util.Common.getStationSectionInfoFromCache(stationSectioncond);//.ServiceAccessor.GetFoundationService().queryStationSection(stationSectioncond);

        for (int i = 1; i < stationsectionList.Count; i++)
        {
            StationSectionCond stationsection = new StationSectionCond();
            string positionName = stationsectionList[i - 1].POSITION_NAME + "-" + stationsectionList[i].POSITION_NAME;
            string positionCode = stationsectionList[i - 1].POSITION_CODE + "*" + stationsectionList[i].POSITION_CODE;
            stationsection.POSITION_CODE_PLUS = positionCode;
            int alarmCount = 0;
            stationsection.myParaTime1 = DateTime.Now.AddDays(-1);
            stationsection.myParaTime2 = DateTime.Now;
            stationsection.myPara1 = "FAULT";
            stationsection.myPara2 = "3C";
            IList<StationSection> liststationsection = Api.ServiceAccessor.GetFoundationService().queryStationSection(stationsection);
            if (liststationsection.Count > 0)
            {
                positionName = liststationsection[0].POSITION_NAME;
                alarmCount = Convert.ToInt32(liststationsection[0].MY_STR_1);
            }
            json.Append("[{name:'" + stationsectionList[i - 1].POSITION_NAME + "',smoothness:0.2,title:'" + positionName + "'},{name:'" + stationsectionList[i].POSITION_NAME + "',value: " + alarmCount + "}]");//交路号
            json.Append(",");
        }
        json.Append("]");
        context.Response.Cache.SetCacheability(HttpCacheability.NoCache);
        context.Response.ContentType = "text/plain";
        object myObj = Newtonsoft.Json.JsonConvert.DeserializeObject(json.ToString());
        context.Response.Write(myObj);
    }
    /// <summary>
    /// 所有站点信息
    /// </summary>
    /// <param name="context"></param>
    private static void GetLine(HttpContext context)
    {
        string code = context.Request.QueryString["Code"];
        string _type = context.Request.QueryString["_type"];
        LineCond linecond = new LineCond();
        linecond.IS_SHOW = "1";
        StationSectionCond stationSectioncond = new StationSectionCond();

        stationSectioncond.businssAnd = " gis_lat !=0";
        if (!string.IsNullOrEmpty(_type))
        {
            if (_type == "line")
            {
                linecond.LINE_CODE = code;
            }
            if (_type == "bureau")
            {
                linecond.BUREAU_CODE = code;
                stationSectioncond.BUREAU_CODE = code;
                stationSectioncond.businssAnd = " gis_lat !=0 and GIS_SHOW = 1";
            }
        }
        else
        {
            stationSectioncond.businssAnd = " gis_lat !=0 and GIS_SHOW = 1";
        }
        stationSectioncond.POSITION_TYPE = "S";
        IList<Line> lineList = Api.ServiceAccessor.GetFoundationService().queryLine(linecond);
        System.Text.StringBuilder json = new System.Text.StringBuilder();
        json.Append("{");

        for (int i = 0; i < lineList.Count; i++)
        {
            stationSectioncond.LINE_CODE = lineList[i].LINE_CODE;
            IList<StationSection> stationsectionList = Api.ServiceAccessor.GetFoundationService().queryStationSection(stationSectioncond);
            for (int j = 0; j < stationsectionList.Count; j++)
            {
                if (_type == "line")
                {
                    if (json.ToString().IndexOf("\"" + stationsectionList[j].POSITION_NAME + "\"") < 0)
                    {
                        json.Append("'" + stationsectionList[j].POSITION_NAME + "':[" + stationsectionList[j].GIS_LON + "," + stationsectionList[j].GIS_LAT + "]");//交路号
                        json.Append(",");
                    }
                }
                else
                {
                    if (stationsectionList[j].GIS_SHOW == 1)
                    {
                        if (json.ToString().IndexOf(stationsectionList[j].POSITION_NAME) < 0)
                        {
                            json.Append("'" + stationsectionList[j].POSITION_NAME + "':[" + stationsectionList[j].GIS_LON + "," + stationsectionList[j].GIS_LAT + "]");//交路号
                            json.Append(",");
                        }
                    }
                }
            }
        }
        json.Append("}");
        context.Response.Cache.SetCacheability(HttpCacheability.NoCache);
        context.Response.ContentType = "text/plain";
        object myObj = Newtonsoft.Json.JsonConvert.DeserializeObject(json.ToString());
        context.Response.Write(myObj);
    }

    /// <summary>
    /// 菜单信息
    /// </summary>
    /// <param name="context"></param>
    private static void GetOrg(HttpContext context)
    {
        OrganizationCond orgCond = new OrganizationCond();
        orgCond.businssAnd = " org_type='总公司' or org_type='局' ";
        IList<Organization> listOrg = Api.ServiceAccessor.GetFoundationService().queryOrganization(orgCond);
        string html = "";
        LineCond linecond = new LineCond();

        foreach (Organization org in listOrg)
        {
            if (org.ORG_TYPE != "局")
            {
                html += "<li><a herf='#' onclick='ssa(\"\",\"\",\"6\",\"" + org.ORG_NAME + "\")'>" + org.ORG_NAME + "</button></a></li>";
            }
            else
            {
                linecond.BUREAU_CODE = org.ORG_CODE;
                IList<Line> lineList = Api.ServiceAccessor.GetFoundationService().queryLine(linecond);

                html += "<li><a herf='#' onclick='ssa(\"bureau\",\"" + org.ORG_CODE + "\",\"6\",\"" + org.ORG_NAME + "\")'>" + org.ORG_NAME + "</button></a></li>";
                //foreach (Line line in lineList)
                //{
                //    html += "<button onclick='ssa(\"line\",\"" + line.LINE_CODE + "\",\"10\",\"武汉\")'>" + line.LINE_NAME + "</button><br/>";
                //}
            }
        }
        html += "";
        context.Response.Write(html);
    }
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}