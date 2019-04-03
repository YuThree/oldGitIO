<%@ WebHandler Language="C#" Class="GetParamter" %>

using System;
using System.Web;
using Api.Event.entity;
using System.Collections.Generic;
using System.Text;
using Api.SysManagement.Security.entity.Cond;
using Api.SysManagement.Security.entity;


public class GetParamter : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        string type = context.Request["type"];

        GetModel(context);

    }


    private void GetModel(HttpContext context)
    {
        string key = context.Request["param"];
        ParamterCond condParamter = new ParamterCond();
        if (!string.IsNullOrEmpty(key))
        {
          //  condParamter.KEY = key;
        }
        IList<Paramter> listParamter = Api.Util.Common.getParamterInfo(condParamter);
        StringBuilder json = new StringBuilder();
        json.Append("[");
        for (int i = 0; i < listParamter.Count; i++)
        {
            json.Append("{");
            json.Append("\"KEY\":\"" + listParamter[i].KEY + "\"");
            json.Append(",");
            json.Append("\"VALUE\":\"" + listParamter[i].VALUE + "\"");
            json.Append(",");
            json.Append("\"CONTEXT\":\"" + listParamter[i].CONTEXT + "\"");
            json.Append(",");
            json.Append("\"TITILE\":\"" + listParamter[i].TITILE + "\"");

            if (i < listParamter.Count - 1)
            {
                json.Append("},");
            }
            else
            {
                json.Append("}");
            }
        }
        json.Append("]");
        object Json = Newtonsoft.Json.JsonConvert.DeserializeObject(json.ToString());
        HttpContext.Current.Response.Write(Json.ToString());
    }


    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}