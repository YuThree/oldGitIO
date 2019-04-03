<%@ WebHandler Language="C#" Class="SMS" %>

using System;
using System.Web;
using Api.Util;

public class SMS :ReferenceClass, IHttpHandler {

    public void ProcessRequest (HttpContext context) {
        string type = context.Request["type"].ToLower();
        switch (type)
        {

            case "send":
                send();
                break;
        }
    }

    /// <summary>
    /// 发送短信
    /// </summary>
    public void send()
    {
        string mobiles= HttpContext.Current.Request["mobiles"];
        string content= HttpContext.Current.Request["content"];
        int count =JYData.SMS_wj.Send(mobiles, content);

        if (count <=0)
        {
            log4net.ILog log2 = log4net.LogManager.GetLogger("发送短信");
            log2.Error("发送失败,错误码"+count+"。手机:" + mobiles + ",内容:" + content);

            string re = JYData.SMS_wj.GetReturnString(count);

             HttpContext.Current.Response.Write("发送失败。错误代码："+count+",请联系管理员");

             Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "发送短信", Api.Util.Public.FunNames.报警监控.ToString(), Public.GetLoginIP, "对电话" + mobiles + "发送了报警信息", "", false);
        }
        else
        {
            HttpContext.Current.Response.Write("发送成功");

            Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "发送短信", Api.Util.Public.FunNames.报警监控.ToString(), Public.GetLoginIP, "对电话" + mobiles + "发送了报警信息", "", true);
        }


    }



    public bool IsReusable {
        get {
            return false;
        }
    }

}