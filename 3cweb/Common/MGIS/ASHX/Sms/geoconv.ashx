<%@ WebHandler Language="C#" Class="geoconv" %>

using System;
using System.Web;
using Newtonsoft.Json;

public class geoconv : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {

        String x = context.Request.QueryString["X"].ToString();
        String y = context.Request.QueryString["Y"].ToString();
        string url = "http://api.map.baidu.com/geoconv/v1/?coords=" + x + "," + y + "&from=1&to=5&ak=F75484f6486f962ed1c28985b9ca68c0";
        System.Net.HttpWebRequest request = (System.Net.HttpWebRequest)System.Net.HttpWebRequest.Create(url);
        System.Net.HttpWebResponse response = (System.Net.HttpWebResponse)request.GetResponse();
        System.IO.Stream responseStream = response.GetResponseStream();
        System.IO.StreamReader sr = new System.IO.StreamReader(responseStream, System.Text.Encoding.GetEncoding("utf-8"));
        string responseText = sr.ReadToEnd();
        sr.Close();
        sr.Dispose();
        responseStream.Close();

        string jsonData = responseText;

        object myObj = JsonConvert.DeserializeObject(jsonData.ToString());
        context.Response.Write(myObj.ToString());
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}