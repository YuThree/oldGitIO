<%@ WebHandler Language="C#" Class="DataPermissonControl" %>

using System;
using System.Web;
using Api;
using System.Collections.Generic;
using Api.SysManagement.Security.entity;
using System.Text;
using Api.Foundation.entity.Cond;
using Api.Foundation.entity.Foundation;
using System.Linq;

public class DataPermissonControl : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        string type = context.Request["type"];
        switch (type)
        {
            //获取登录用户名称
            case "curuser":
                GetCurUser();
                break;
            case "logout":
                ServiceAccessor.GetLogService().securityLog(Api.Util.Public.GetLoginID, Api.Util.Public.GetLoginIP, "用户退出", true);
                ClearCache();
                break;
            default:
                break;
        }
    }

    ////获取当前用户
    //private void GetCurUser()
    //{
    //    string user = Api.Util.Public.GetPersonName;
    //    HttpContext.Current.Response.Write(user);
    //    
    //    
    //}
    //获取当前用户
    private void GetCurUser()
    {
        string user = Api.Util.Public.GetPersonName;
        string userCode = Api.Util.Public.GetUserCode;
        Organization org = Api.Util.Common.getOrgInfo(Api.Util.Public.GetDeptCode);  // Api.ServiceAccessor.GetFoundationService().queryOrganizationFuzzyCode.queryOrganizationByCode(Api.Util.Public.GetDeptCode);
        
        string userorg = Api.Util.Public.GetDeptCode;
        string loginId = Api.Util.Public.GetLoginID;
        string PersonName = Api.Util.Public.GetPER_NAME;
        if (org.ORG_TYPE == "科")
        {
            userorg = org.SUP_ORG_CODE;
        }
        string json = "{\"name\":\"" + user + "\", \"userCode\":\"" + userCode + "\", \"code\":\"" + Api.Util.Public.GetUserCode + "\", \"orgcode\":\"" + userorg + "\",\"orgName\":\"" + Api.Util.Public.GetDeptName + "\",\"loginId\":\"" + loginId + "\",\"PersonName\":\"" + PersonName + "\"}";
        HttpContext.Current.Response.Write(json);
    }
    //清除cookie缓存
    private void ClearCache()
    {
        HttpCookie aCookie = new HttpCookie("Bsfmis.UserVariableCookie");
        aCookie.Expires = DateTime.Now.AddDays(-1);
        HttpContext.Current.Response.Cookies.Add(aCookie);
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}