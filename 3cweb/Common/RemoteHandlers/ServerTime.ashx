<%@ WebHandler Language="C#" Class="ServerTime" %>

using System;
using System.Web;

public class ServerTime : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        string type = HttpContext.Current.Request["type"];
        string number = HttpContext.Current.Request["number"];
        var html = "";
        switch (type)
        {
            case "Years":
                html = DateTime.Now.AddYears(Convert.ToInt32(number)).ToString("yyyy-MM-dd HH:mm:ss");
                break;
            case "Months":
                html = DateTime.Now.AddMonths(Convert.ToInt32(number)).ToString("yyyy-MM-dd HH:mm:ss");
                break;
            case "Days":
                html = DateTime.Now.AddDays(Convert.ToInt32(number)).ToString("yyyy-MM-dd HH:mm:ss");
                break;
            case "Hours":
                html = DateTime.Now.AddHours(Convert.ToInt32(number)).ToString("yyyy-MM-dd HH:mm:ss");
                break;
            case "Minutes":
                html = DateTime.Now.AddMinutes(Convert.ToInt32(number)).ToString("yyyy-MM-dd HH:mm:ss");
                break;
            case "Seconds":
                html = DateTime.Now.AddSeconds(Convert.ToInt32(number)).ToString("yyyy-MM-dd HH:mm:ss");
                break;
            default:
                html = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                break;
        }
        HttpContext.Current.Response.Write(html);
        
        
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}