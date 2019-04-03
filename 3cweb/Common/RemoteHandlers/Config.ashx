<%@ WebHandler Language="C#" Class="Config" %>

using System;
using System.Web;
using System.Xml;
using Api.Fault.entity.alarm;
using System.Collections.Generic;
using Api.Util;
using Api.Foundation.entity.Foundation;
using System.Collections;
using System.Web.SessionState;
using Newtonsoft.Json;
using System.Configuration;
public class Config : ReferenceClass, IHttpHandler
{
    public void ProcessRequest(HttpContext context)
    {
        //返回值
        string paramName = HttpContext.Current.Request["param"];
        string value = "";
        try
        {
            value = Api.ServiceAccessor.GetParamterService().getParamterByKey(paramName);
        }
        catch (Exception ex)
        {
            log4net.ILog log2 = log4net.LogManager.GetLogger("查询参数值出错");
            log2.Error("getParamterInfo", ex);
        }
        context.Response.Write(value);


    }
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }
}