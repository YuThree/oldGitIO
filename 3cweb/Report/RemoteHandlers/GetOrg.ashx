<%@ WebHandler Language="C#" Class="GetOrg" %>

using System;
using System.Web;
using System.Text;
using System.Collections.Generic;
using Api.Foundation.entity.Foundation;


public class GetOrg :ReferenceClass, IHttpHandler
{
    public void ProcessRequest(HttpContext context)
    {
        StringBuilder Json = new StringBuilder();
        Api.Foundation.entity.Cond.OrganizationCond syscond = new Api.Foundation.entity.Cond.OrganizationCond();



        if (HttpContext.Current.Request.QueryString["OrgCode"] != null && HttpContext.Current.Request.QueryString["OrgCode"].ToString() != "")
        {
            //C1
            syscond.businssAnd = " ORG_CODE like '%" + HttpContext.Current.Request.QueryString["OrgCode"].ToString() + "%'";
        }


        IList<Organization> syslist = Api.ServiceAccessor.GetFoundationService().queryOrganization(syscond);
        Json.Append("[");
        for (int i = 0; i < syslist.Count - 1; i++)
        {
            string pcode;//父编码
            string type;//等级1未父，2为子级
            if (syslist[i].SUP_ORG_CODE != null) { pcode = syslist[i].SUP_ORG_CODE.ToString(); type = "2"; } else { pcode = "0"; type = "1"; }

            Json.Append("{");
            Json.Append("id:\"" + syslist[i].ORG_CODE.ToString() + "\",");
            Json.Append("pId:\"" + pcode + "\",");
            Json.Append("name:\"" + syslist[i].ORG_NAME.ToString() + "\",");
            Json.Append("type:\"" + syslist[i].ORG_TYPE.ToString() + "\",");
            Json.Append("open:\"" + "true" + "\"");
            Json.Append("},");
        }
        string p_code;
        string p_type;//等级1未父，2为子级
        if (syslist[syslist.Count - 1].SUP_ORG_CODE != null) { p_code = syslist[syslist.Count - 1].SUP_ORG_CODE.ToString(); p_type = "2"; } else { p_code = "0"; p_type = "1"; }
        Json.Append("{");
        Json.Append("id:\"" + syslist[syslist.Count - 1].ORG_CODE.ToString() + "\",");
        Json.Append("pId:\"" + p_code + "\",");
        Json.Append("name:\"" + syslist[syslist.Count - 1].ORG_NAME.ToString() + "\",");
        Json.Append("type:\"" + syslist[syslist.Count - 1].ORG_TYPE.ToString() + "\",");
        Json.Append("open:\"" + "true" + "\"");
        Json.Append("}");
        Json.Append("]");

        context.Response.Cache.SetCacheability(HttpCacheability.NoCache);
        context.Response.ContentType = "text/plain";
        object myObj = Newtonsoft.Json.JsonConvert.DeserializeObject(Json.ToString());
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