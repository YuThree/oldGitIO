/*========================================================================================*
* 功能说明：C1信息
* 注意事项：
* 作    者： 邓杰
* 版本日期：2013年10月21日
* 变更说明：
* 版 本 号： V1.0
*=======================================================================================*/
<%@ WebHandler Language="C#" Class="C1EventInfo" %>

using System;
using System.Web;
using System.Text;
using Newtonsoft.Json;
using System.Data;
using System.Collections.Generic;
using Api.Fault.entity.sms;
using Api.Foundation.entity.Cond;

public class C1EventInfo : ReferenceClass, IHttpHandler
{
    /// <summary>
    /// 轨迹
    /// </summary>
    /// <param name="context"></param>
    public void ProcessRequest(HttpContext context)
    {

        String ID = context.Request.QueryString["ID"].ToString();
        string json = Api.ServiceAccessor.GetEventService().GetC1EventTrack(ID);
        object myObj = JsonConvert.DeserializeObject(json.ToString());
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