/*========================================================================================*
* 功能说明：线路信息
* 注意事项：
* 作    者： 邓杰
* 版本日期：2013年10月21日
* 变更说明：
* 版 本 号： V1.0
*=======================================================================================*/
<%@ WebHandler Language="C#" Class="BMapLinesDataPoints" %>

using System;
using System.Web;
using System.Text;
using System.Data;
using Newtonsoft.Json;
using Api.Foundation.entity.Foundation;
using System.Collections.Generic;

public class BMapLinesDataPoints : ReferenceClass, IHttpHandler
{



    public void ProcessRequest(HttpContext context)
    {
        String misLineids = getMisLine();
        getMapMisLinesPoint(misLineids, context);
        Event.Impl.EventServiceImpl.index = 0;
        Event.Impl.EventServiceImpl.jump = 0;
    }
    /// <summary>
    /// 获取所有线路主键
    /// </summary>
    /// <returns></returns>
    public string getMisLine()
    {
        string LineCode = HttpContext.Current.Request["LineCode"];
        string OrgCode = HttpContext.Current.Request["OrgCode"];
        string OrgType = HttpContext.Current.Request["OrgType"];
        IList<Line> linelist = new List<Line>();
        Api.Foundation.entity.Cond.LineCond line = new Api.Foundation.entity.Cond.LineCond();
        line.IS_SHOW = "1";
        if (LineCode.ToString().Trim() != "")
        {
            line.LINE_CODE = LineCode;
        }
        switch (OrgType)
        {
            case "局":
                line.BUREAU_CODE = OrgCode;
                break;
            //case "供电段":
            //    line.POWER_SECTION_CODE = OrgCode;
            //    break;
            //case "机务段":
            //    line.P_ORG_CODE = OrgCode;
            //    break;
            default:
                break;
        }
        linelist = Api.ServiceAccessor.GetFoundationService().queryLine(line);
        string lineids = "";
        if (linelist != null)
        {
            for (int i = 0; i < linelist.Count; i++)
            {
                if (i == 0)
                {
                    lineids = linelist[i].LINE_CODE;
                }
                else
                {
                    lineids += ",";
                    lineids += linelist[i].LINE_CODE;
                }
            }
        }
        return lineids;
    }
    /// <summary>
    /// 根据线路CODE获取线路对象
    /// </summary>
    /// <param name="misLineCode">线路CODE</param>
    /// <returns></returns>
    public Line getMisLineName(string misLineCode)
    {
        Line line = Api.Util.Common.getLineInfo(misLineCode);
        return line;
    }


    /// <summary>
    /// 获取线路下的线
    /// </summary>
    /// <param name="objId">线路主键</param>
    /// <param name="level">重点点类别 1：取中心点坐标 2：取描点坐标</param>
    public void getMapMisLinesPoint(String objId, HttpContext context)
    {
        String[] obj = objId.Split(',');
        StringBuilder Json = new StringBuilder();
        Line line = new Line();
        line.GIS_CENTER_LON = 114.431167;
        line.GIS_CENTER_LAT = 30.613159;
        Json.Append("[");
        Json.Append("{\"X\":\"" + line.GIS_CENTER_LON + "\",\"Y\":\"" + line.GIS_CENTER_LAT + "\"},");
        for (int i = 0; i < obj.Length; i++)
        {
            Json.Append("{");
            Json.Append("\"" + (i + 1) + "\":[{ID:\"" + getMisLineName(obj[i]).LINE_CODE + "\",LINE_NAME:\"" + getMisLineName(obj[i]).LINE_NAME + "\"}]");
            if (i < obj.Length - 1)
            {
                Json.Append("},");
            }
            else
            {
                Json.Append("}");
            }

        }
        Json.Append("]");
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
