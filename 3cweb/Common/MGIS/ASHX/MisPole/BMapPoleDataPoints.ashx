/*========================================================================================*
* 功能说明：支柱信息
* 注意事项：
* 作    者： 邓杰
* 版本日期：2013年10月21日
* 变更说明：
* 版 本 号： V1.0
*=======================================================================================*/
<%@ WebHandler Language="C#" Class="BMapPoleDataPoints" %>

using System;
using System.Web;
using System.Text;
using System.Data;
using Newtonsoft.Json;
using Api.Foundation.entity.Foundation;
using System.Collections.Generic;
using Api.Foundation.entity.Cond;
using Api.Fault.entity.alarm;

public class BMapPoleDataPoints : ReferenceClass, IHttpHandler
{
    /// <summary>
    /// 支柱操作
    /// </summary>
    /// <param name="context"></param>
    public void ProcessRequest(HttpContext context)
    {
        //区站名称
        String PositionCode = context.Request.QueryString["PositionCode"].ToString();
        //线路CODE
        String mislineCode = context.Request.QueryString["mislineid"].ToString();
        // 类型1：取中心点坐标 2：取描点坐标
        String level = context.Request.QueryString["level"].ToString();
        getMapMisPolePoint(PositionCode, mislineCode, level, context);
    }
    /// <summary>
    /// 获取线路下的线
    /// </summary>
    /// <param name="mispositionid">区间或者站场名称</param>
    /// <param name="level">重点点类别 1：取中心点坐标 2：取描点坐标</param>
    public void getMapMisPolePoint(String PositionCode, string mislineCode, String level, HttpContext context)
    {
        StringBuilder sbObj = new StringBuilder();
        StringBuilder Json = new StringBuilder();
        StationSectionCond stationsection = new StationSectionCond();
        IList<Pole> polelist = new List<Pole>();
        IList<StationSection> liststationsection = new List<StationSection>();
        switch (level)
        {
            //获取区间或者站场下标注所有支柱中心点坐标
            case "1":
                stationsection.LINE_CODE = mislineCode;
                if (PositionCode.Split('*').Length > 1)
                {
                    stationsection.POSITION_CODE_PLUS = PositionCode;
                }
                else {
                    stationsection.POSITION_CODE = PositionCode;
                }
                //根据区站名称获取区站对象(因为区间名称是拼成的)
                IList<Double> Poledouble = new List<Double>();
                liststationsection = Api.ServiceAccessor.GetFoundationService().queryStationSection(stationsection);
                if (liststationsection.Count > 0)
                {
                    Poledouble = Api.ServiceAccessor.GetFoundationService().getPoleCenter(liststationsection[0].POSITION_CODE);
                }
                Json.Append("[");
                Json.Append("{");
                if (Poledouble.Count > 0)
                {
                    Json.Append("longitude:\"" + Poledouble[0] + "\"");
                    Json.Append(",");
                    Json.Append("latitude:\"" + Poledouble[1] + "\"");
                }
                else
                {
                    Json.Append("longitude:\"" + "" + "\"");
                    Json.Append(",");
                    Json.Append("latitude:\"" + "" + "\"");
                }
                Json.Append("}");
                Json.Append("]");
                break;
            //获取区间或者站场下标注所有支柱坐标
            case "2":
                stationsection.LINE_CODE = mislineCode;

                if (PositionCode.Split('*').Length > 1)
                {
                    stationsection.POSITION_CODE_PLUS = PositionCode;
                }
                else
                {
                    stationsection.POSITION_CODE = PositionCode;
                }
                //根据区站名称获取区站对象(因为区间名称是拼成的)
                liststationsection = Api.ServiceAccessor.GetFoundationService().queryStationSection(stationsection);
                if (liststationsection.Count > 0)
                {
                    //根据区站CODE获取支柱对象
                    polelist = Api.ServiceAccessor.GetFoundationService().getPoleByStationSectionCode(liststationsection[0].POSITION_CODE);
                }
                Json.Append("[");
                for (int i = 0; i < polelist.Count; i++)
                {
                    //if (polelist[i].GIS_LON_O == 0)
                    //{
                    //    continue;
                    //}

                    int faultnum = 0;
                    if (polelist[i].FAULT_COUNT > 0 || polelist[i].ALARM_COUNT > 0)
                    {
                        faultnum = 1;
                    }
                    Json.Append("{");
                    Json.Append("longitude:\"" + polelist[i].GIS_LON_O + "\"");
                    Json.Append(",");
                    Json.Append("latitude:\"" + polelist[i].GIS_LAT_O + "\"");
                    Json.Append(",");
                    Json.Append("poleCode:\"" + polelist[i].POLE_NO + "\"");
                    Json.Append(",");
                    Json.Append("kmmark:\"" + polelist[i].KMSTANDARD + "\"");
                    Json.Append(",");
                    Json.Append("direction:\"" + polelist[i].POLE_DIRECTION + "\"");
                    Json.Append(",");
                    Json.Append("line:\"" + polelist[i].LINE_NAME + "\"");
                    Json.Append(",");
                    Json.Append("lineCode:\"" + polelist[i].LINE_CODE + "\"");
                    Json.Append(",");
                    Json.Append("powerSection:\"" + polelist[i].ORG_NAME + "\"");
                    Json.Append(",");
                    Json.Append("workshop:\"" + polelist[i].ORG_NAME + "\"");
                    Json.Append(",");
                    Json.Append("workArea:\"" + polelist[i].ORG_NAME + "\"");
                    Json.Append(",");
                    Json.Append("stationSection:\"" + polelist[i].POSITION_NAME + "\"");
                    Json.Append(",");
                    Json.Append("KMSTANDARD:\"" + "K" + polelist[i].KMSTANDARD / 1000 + "+" + polelist[i].KMSTANDARD % 1000 + "\"");
                    Json.Append(",");
                    Json.Append("POLE_CODE:\"" + polelist[i].POLE_CODE + "\"");
                    Json.Append(",");
                    Json.Append("BRG_TUN_NAME:\"" + polelist[i].BRG_TUN_NAME + "\"");
                    Json.Append(",");
                    Json.Append("id:\"" + polelist[i].ID + "\"");
                    Json.Append(",");
                    Json.Append("faultnum:\"" + faultnum + "\"");
                    if (i < polelist.Count - 1)
                    {
                        Json.Append("},");
                    }
                    else
                    {
                        Json.Append("}");
                    }

                }
                Json.Append("]");
                break;
        }
        context.Response.Cache.SetCacheability(HttpCacheability.NoCache);
        context.Response.ContentType = "text/plain";
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