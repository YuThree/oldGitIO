/*========================================================================================*
* 功能说明：变电所信息
* 注意事项：
* 作    者： 邓杰
* 版本日期：2013年10月21日
* 变更说明：
* 版 本 号： V1.0
*=======================================================================================*/
<%@ WebHandler Language="C#" Class="BMapSubstationDataPoints" %>

using System;
using System.Web;
using System.Text;
using System.Data;
using Newtonsoft.Json;
using Api.Foundation.entity.Foundation;
using Api.Foundation.entity.Cond;
using System.Collections.Generic;
using Api.Fault.entity.alarm;

public class BMapSubstationDataPoints : ReferenceClass, IHttpHandler
{
    /// <summary>
    /// 变电所操作
    /// </summary>
    /// <param name="context"></param>
    public void ProcessRequest(HttpContext context)
    {
        //线路CODe
        String objId = context.Request.QueryString["mislineid"].ToString();
        getMapMisOrgPoint(objId, context);

    }
    /// <summary>
    /// 根据线路ID查询变电所信息
    /// </summary>
    /// <param name="objId">线路CODE</param>
    /// <param name="context"></param>
    public void getMapMisOrgPoint(String objId, HttpContext context)
    {
        IList<Substation> Substationlist = new List<Substation>();
        Substation substation = new Substation();
        StringBuilder Json = new StringBuilder();
        SubstationCond subcond = new SubstationCond();
        if (objId != "")
        {
            subcond.LINE_CODE = objId;
        }
        //根据线路CODE获取变电所信息
        Substationlist = Api.ServiceAccessor.GetFoundationService().querySubstation(subcond);
        Json.Append("[");
        for (int i = 0; i < Substationlist.Count; i++)
        {
            Json.Append("{");
            Json.Append("GIS_X:\"" + Substationlist[i].GIS_LON + "\"");
            Json.Append(",");
            Json.Append("GIS_Y:\"" + Substationlist[i].GIS_LAT + "\"");
            Json.Append(",");
            Json.Append("KM_MARK_SX:\"" + Substationlist[i].KM_MARK_SX + "\"");
            Json.Append(",");
            Json.Append("KM_MARK_XX:\"" + Substationlist[i].KM_MARK_XX + "\"");
            Json.Append(",");
            //Json.Append("POSITION:\"" + Substationlist[i].POSITION + "\"");
            //Json.Append(",");
            Json.Append("SUBSTATION_NAME:\"" + Substationlist[i].SUBSTATION_NAME + "\"");
            Json.Append(",");
            Json.Append("id:\"" + Substationlist[i].ID + "\"");
            Json.Append(",");
            Json.Append("SUBSTATION_CODE:\"" + Substationlist[i].SUBSTATION_CODE + "\"");
            Json.Append(",");
            if (!string.IsNullOrEmpty(Substationlist[i].MY_STR_1))
            {
                Json.Append("C6AlarmId:\"" + Substationlist[i].MY_STR_1 + "\"");
            }
            else
            {
                Json.Append("C6AlarmId:\"" + "1" + "\"");
            }
            Json.Append(",");
            Json.Append("ICONPATH:\"" + Substationlist[i].ICON_PATH + "\"");
            Json.Append(",");
            Json.Append("ORG_CODE:\"" + Substationlist[i].ORG_NAME + "\"");
            Json.Append(",");
            Json.Append("POWER_SECTION_CODE:\"" + Substationlist[i].POWER_SECTION_NAME+ "\"");
            Json.Append(",");
            Json.Append("WORKSHOP_CODE:\"" + Substationlist[i].WORKSHOP_NAME + "\"");
            Json.Append(",");
            Json.Append("POSITION_CODE:\"" + Substationlist[i].POSITION_NAME + "\"");
            Json.Append(",");
            Json.Append("LINE_CODE:\"" + Substationlist[i].LINE_NAME + "\"");
            if (i < Substationlist.Count - 1)
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