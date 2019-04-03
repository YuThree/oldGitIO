/*========================================================================================*
* 功能说明：组织机构页面操作的数据交互
* 注意事项：
* 作    者： 邓杰
* 版本日期：2013年10月23日
* 变更说明：
* 版 本 号： V1.0
*=======================================================================================*/
<%@ WebHandler Language="C#" Class="OrganizationControl" %>

using System;
using System.Web;
using Api.Foundation.entity.Foundation;
using System.Collections.Generic;
using Api.Foundation.service;
using Api;
using System.Text;
using Api.Foundation.entity.Cond;
using System.Data;

public class OrganizationControl : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        string type = context.Request["type"];
        switch (type)
        {
            //获取树
            case "tree":
                getTree();
                break;
            default:
                break;
        }
    }


    /// <summary>
    /// 组织机构树
    /// </summary>
    public void getTree()
    {

        OrganizationCond org = new OrganizationCond();
        org.businssAnd = "  org_type != '供电车间' and org_type!='班组'";
        IList<Organization> orglist = Api.ServiceAccessor.GetFoundationService().queryOrganization(org);

        StringBuilder Json = new StringBuilder();
        Json.Append("[");
        foreach (Organization organization in orglist)
        {
            Json.Append("{");
            Json.Append("id:\"" + organization.ORG_CODE + "\",");
            Json.Append("pId:\"" + organization.SUP_ORG_CODE + "\",");
            Json.Append("name:\"" + organization.ORG_NAME + "\",");
            if (organization.ORG_TYPE == "TOPBOSS")
            {
                Json.Append("open:\"" + true + "\",");
            }
            Json.Append("click:\"TreeClick('" + organization.ORG_CODE + "','" + organization.ORG_NAME + "','" + organization.ORG_TYPE + "')\"");
            Json.Append("},");
        }
        string json = Json.ToString().Substring(0, Json.Length - 1);
        json += "]";


        HttpContext.Current.Response.Write(json);
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}