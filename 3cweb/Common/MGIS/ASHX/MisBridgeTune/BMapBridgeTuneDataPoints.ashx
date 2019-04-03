/*========================================================================================*
* 功能说明：桥梁隧道信息
* 注意事项：
* 作    者： 邓杰
* 版本日期：2013年10月21日
* 变更说明：
* 版 本 号： V1.0
*=======================================================================================*/
<%@ WebHandler Language="C#" Class="BMapBridgeTuneDataPoints" %>

using System;
using System.Web;
using System.Text;
using Newtonsoft.Json;
using System.Data;
using Api.Foundation.entity.Foundation;

public class BMapBridgeTuneDataPoints : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        String type = context.Request.QueryString["type"].ToString(); switch (type)
        {
            case "1":
                //桥梁隧道
                getMapBridgeTuneDataPoint(context);
                break;
            case "2":
                
                String deviceid = context.Request.QueryString["deviceid"].ToString();
                BridgeTune bridgeTune = new BridgeTune();

                String josn = "";
                context.Response.Write(josn);
                break;
        }
    }
    /// <summary>
    /// 桥梁隧道
    /// </summary>
    /// <param name="context"></param>
    private void getMapBridgeTuneDataPoint(HttpContext context)
    {
        StringBuilder Json = new StringBuilder();
        Json.Append("[");

        Json.Append("{");
        Json.Append("BRG_TUN_CODE:\"" + "QLBH123" + "\",");
        Json.Append("BRG_TUN_NAME:\"" + "隧道#11" + "\",");
        Json.Append("MIS_POSITION_ID:\"" + "16" + "\",");
        Json.Append("PROC_BRG_TYPE:\"" + "1" + "\",");
        Json.Append("TUN_ORDER:\"" + "1" + "\",");
        Json.Append("TUN_LICHENGBIAO:\"" + "126555" + "\",");
        Json.Append("GIS_X:\"" + "114.347015" + "\",");
        Json.Append("GIS_Y:\"" + "30.893139" + "\"");


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