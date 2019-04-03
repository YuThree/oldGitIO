<%@ WebHandler Language="C#" Class="GetAFCodeTree" %>

using System;
using System.Web;
using System.Xml;
using Api.Fault.entity.alarm;
using Api.Foundation.entity.Foundation;

using System.Collections.Generic;
using Newtonsoft.Json;
using System.Text;

public class GetAFCodeTree : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        StringBuilder Json = new StringBuilder();
        Api.Foundation.entity.Cond.SysDictionaryCond syscond = new Api.Foundation.entity.Cond.SysDictionaryCond();
        syscond.CATEGORY = "AFCODE";     
        syscond.businssAnd = "code_type like '3C'";
        IList<SysDictionary> syslist = Api.ServiceAccessor.GetFoundationService().querySysDictionary(syscond);
        Json.Append("[");
        for (int i = 0; i < syslist.Count; i++)
        {
            string pcode;//父编码
            string type;//等级1未父，2为子级
            if (syslist[i].P_CODE != null) { pcode = syslist[i].P_CODE.ToString(); type = "2"; } else { pcode = "0"; type = "1"; }

            Json.Append("{");
            Json.Append("id:\"" + syslist[i].DIC_CODE.ToString() + "\",");
            Json.Append("pId:\"" + pcode + "\",");
            Json.Append("name:\"" + syslist[i].CODE_NAME.ToString() + "\",");
            Json.Append("open:\"" + "true" + "\"");
            Json.Append("},");
        }
        string p_code;
        string p_type;//等级1未父，2为子级
        if (syslist[syslist.Count - 1].P_CODE != null) { p_code = syslist[syslist.Count - 1].P_CODE.ToString(); p_type = "2"; } else { p_code = "0"; p_type = "1"; }
        Json.Append("{");
        Json.Append("id:\"" + syslist[syslist.Count - 1].DIC_CODE.ToString() + "\",");
        Json.Append("pId:\"" + p_code + "\",");
        Json.Append("name:\"" + syslist[syslist.Count - 1].CODE_NAME.ToString() + "\",");
        Json.Append("open:\"" + "true" + "\"");
        Json.Append("}");
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