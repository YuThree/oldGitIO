/*========================================================================================*
* 功能说明：组织信息
* 注意事项：
* 作    者： 邓杰
* 版本日期：2013年10月21日
* 变更说明：
* 版 本 号： V1.0
*=======================================================================================*/
<%@ WebHandler Language="C#" Class="BMapOrgDataPoints" %>

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using Newtonsoft.Json;
using System.Data;
using Api.Foundation.entity.Foundation;
using Api.Foundation.entity.Cond;

public class BMapOrgDataPoints : ReferenceClass, IHttpHandler
{

    /// <summary>
    /// 获取机务段
    /// </summary>
    /// <param name="context"></param>
    public void ProcessRequest(HttpContext context)
    {
        //组织层级编号
        String ID = context.Request.QueryString["ID"].ToString();
        OrganizationCond orgcond = new OrganizationCond();
        orgcond.SUP_ORG_CODE = ID;
        IList<Organization> orglist = new List<Organization>();
        //根据组织编号获取组织信息
        orglist = Api.ServiceAccessor.GetFoundationService().queryOrganization(orgcond);
        StringBuilder Json = new StringBuilder();
        Json.Append("[");
        if (orglist != null)
        {
            for (int i = 0; i < orglist.Count; i++)
            {
                Json.Append("{");
                Json.Append("startLongitude:\"" + orglist[i].GIS_LON + "\"");
                Json.Append(",");
                Json.Append("startLatitude:\"" + orglist[i].GIS_LAT + "\"");
                Json.Append(",");
                Json.Append("ORG_NAME:\"" + orglist[i].ORG_NAME + "\"");
                Json.Append(",");
                Json.Append("ORG_ID:\"" + orglist[i].ID + "\"");
                if (i < orglist.Count - 1)
                {
                    Json.Append("},");
                }
                else
                {
                    Json.Append("}");
                }

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