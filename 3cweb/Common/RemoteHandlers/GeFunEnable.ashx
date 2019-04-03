<%@ WebHandler Language="C#" Class="GeFunEnable" %>

using System;
using System.Web;
using Api.Event.entity;
using System.Collections.Generic;
using System.Text;
using Api.SysManagement.Security.entity.Cond;
using Api.SysManagement.Security.entity;


public class GeFunEnable : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        string type = context.Request["type"];

        GetModel(context);

    }


    private void GetModel(HttpContext context)
    {
        string key = context.Request["param"];
        FunCustomCond condFuncustom = new FunCustomCond();
        if (!string.IsNullOrEmpty(key))
        {
            //  condParamter.KEY = key;
        }

        Dictionary<String, FunCustom> FunCustomDic = Api.Util.Common.FunCustomDic;
        StringBuilder json = new StringBuilder();
        json.Append("[");
        foreach (var item in FunCustomDic)
        {
            json.Append("{");
            json.Append("\"FunCode\":\"" + item.Value.FunCode + "\"");
            json.Append(",");
            json.Append("\"Enable\":\"" + item.Value.Enable + "\"");
            json.Append(",");
            json.Append("\"FunMemo\":\"" + item.Value.FunMemo + "\"");
            json.Append(",");
            json.Append("\"FunName\":\"" + item.Value.FunName + "\"");


            json.Append("},");


        }
        json = json.Remove(json.ToString().LastIndexOf(','), 1);
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