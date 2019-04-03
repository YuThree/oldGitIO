<%@ WebHandler Language="C#" Class="IndexHandler" %>

using System;
using System.Web;

public class IndexHandler : ReferenceClass, IHttpHandler
{
    
    public void ProcessRequest (HttpContext context) {

        string type = context.Request["type"];
        String obj = Api.ServiceAccessor.getFunMenuService().getIndexFunMenuStr(type);
        context.Response.Write(obj);
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}