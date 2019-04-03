<%@ WebHandler Language="C#" Class="LoginForm" %>

using System;
using System.Web;
using System.Xml;
using Api.Fault.entity.alarm;
using System.Collections.Generic;

using Api;
using Api.SysManagement.Security.service;
using Api.SysManagement.Log.service;
using Api.Util;
using Api.Foundation.entity.Cond;
using Api.Foundation.entity.Foundation;
using System.Text;

public class LoginForm : System.Web.SessionState.IRequiresSessionState, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        try
        {
            //获取C1ID
            string type = HttpContext.Current.Request["type"];


            switch (type)
            {
                case "login":
                    Login(context);
                    break;
                case "logout":
                    logout(context);
                    break;
                case "identify":
                    GetIdentifyCode(context);
                    break;
                case "mobileidentify":
                    GetMobileIdentifyCode(context);
                    break;
            }
        }
        catch (Exception ex)
        {
            log4net.ILog log = log4net.LogManager.GetLogger("登陆出错");
            log.Error("Error", ex);
        }

    }


    private void Login(HttpContext context)
    {

        string loginName = HttpContext.Current.Request["login_name"];
        string password = HttpContext.Current.Request["password"];
        string identify= HttpContext.Current.Request["identify"];
        string tel = HttpContext.Current.Request["tel"];
        string remove = HttpContext.Current.Request["remove"];
        //失败次数
        int totalN = 8;

        int errN = GetErrN(loginName);
        if (errN >= totalN)
        {
            context.Response.Write("失败超过" + totalN + "次，请1小时后再试。");
            return;
        }

        string result = "";
        try
        {
            if (!string.IsNullOrEmpty(remove))
            {
                result = ServiceAccessor.GetSecurityService().initLoginUserInfo_M(tel, identify);
            }
            else
            {
                result = ServiceAccessor.GetSecurityService().initLoginUserInfo(loginName, password, identify);
            }


            if (result == "登录成功")
            {
                SetErrN(0, loginName);
                ServiceAccessor.GetLogService().securityLog(loginName, Api.Util.Public.GetLoginIP, "登录成功", true);
                result = "{\"MSG\":\"登录成功\",\"IS_POWER_SECTION_USER\":\"" + Api.Util.Public.IsPowerSectionUser() + "\"}";
            }
            else
            {
                int thisN = AddErrN(loginName);
                int lastN = totalN - thisN;

                result = "{\"MSG\":\"" + result + "，还有" + lastN + "次机会\"}";

                try
                {
                    ServiceAccessor.GetLogService().securityLog(loginName, Api.Util.Public.GetLoginIP, "登录失败，原因：" + result, false);
                }
                catch (Exception ex2) { }
            }

            context.Response.ContentType = "text/html";
            context.Response.Write(result);
            context.ApplicationInstance.CompleteRequest();

        }
        catch (Exception ex)
        {
            result = "出错了，请联系管理员";

            log4net.ILog log = log4net.LogManager.GetLogger("登陆出错");
            log.Error("Error", ex);


        }


    }

    public int GetErrN(string loginName)
    {
        if (HttpContext.Current.Session["LoginF" + loginName] != null)
        {
            return Convert.ToInt32(HttpContext.Current.Session["LoginF" + loginName]);
        }

        return 0;
    }

    public int AddErrN(string loginName)
    {
        int re = GetErrN(loginName) + 1;
        HttpContext.Current.Session["LoginF" + loginName] = re;

        return re;
    }


    public void SetErrN(int n, string loginName)
    {
        HttpContext.Current.Session["LoginF" + loginName] = n;
    }


    public void logout(HttpContext context)
    {



        ////  Public.GetLoginIP = Common.ClientIPAddress;
        ////当前登录ID
        //Public.GetLoginID = null;
        //Public.GetUserCode = null;
        ////当前用户对应人员简拼
        //Public.GetPersonAbbr = null;
        ////当前用户对应人员姓名
        //Public.GetPersonName = null;


        ////当前用户对应的人员所在部门ID
        //Public.GetDeptID = null;
        ////当前用户对应的人员所在部门编号
        //Public.GetDeptCode = null;
        ////当前用户对应的人员所在部门名称
        //Public.GetDeptName = null;


        ////当前用户对应的人员所在单位ID
        //Public.GetUnitID = null;
        ////当前用户对应的人员所在单位名称
        //Public.GetUnitName = null;
        //Public.GetUserRoleName = null;

        ////职务
        //Public.Cache("head", null);
        //Public.Cache("headname", null);

        string tel = HttpContext.Current.Request["tel"];

        if (!string.IsNullOrEmpty(HttpContext.Current.Request["remove"]))
        {
            string sign = "0";
            string result = "异常";
            try
            {
                UserCond userCond = new UserCond();
                IList<User> userList = null;
                if (!string.IsNullOrEmpty(tel))
                {
                    userCond.TEL = tel;
                    userList = Api.ServiceAccessor.GetFoundationService().queryUser(userCond,true);
                }
                if (userList.Count == 0)
                {
                    result = "当前手机用户不存在";
                }
                else
                {
                    Api.SysManagement.Security.entity.DataPermisson dp = new Api.SysManagement.Security.entity.DataPermisson();
                    dp.MASTERID = userList[0].LOGINID;
                    dp.IDENTIFY_CODE = "";

                    bool r = false;
                    r = Api.ServiceAccessor.GetSecurityService().updateUserIndentify(dp);
                    if (r == true)
                    {
                        sign = "1";
                        result = "成功退出";
                    }
                }
            }
            catch (Exception ex)
            {
                log4net.ILog log = log4net.LogManager.GetLogger("手机端退出并清除验证码");
                log.Error("执行出错", ex);
            }
            StringBuilder json = new StringBuilder();
            json.Append("{\"sign\":\"" + sign +"\",\"result\":\"" + result + "\"}");

            context.Response.Write(json);
        }

        HttpContext.Current.Session["loginUser"] = null;
        Api.Util.Public.CacheClear();
        Api.Util.UserPermissionc.ClearCurrentFunPermisson();
        Api.Util.UserPermissionc.ClearCurrentDataPermisson();


    }

    /// <summary>
    /// 生成6位数字验证码，存入数据库并附带截止时间
    /// </summary>
    /// <param name="context"></param>
    /// <returns></returns>
    public string GetIdentifyCode(HttpContext context)
    {
        string result = "验证码验证出错";
        string loginName=HttpContext.Current.Request["login_name"];
        string identify = "";
        System.Random random = new System.Random();
        for (int i = 0; i < 6; i++)
        {
            identify += random.Next(10).ToString();
        }

        //查询有效时间
        int time = Api.ServiceAccessor.GetSecurityService().queryIndate("IDENTIFY_INDATE");
        DateTime dt = DateTime.Now.AddMinutes(time);

        //更新数据库
        Api.SysManagement.Security.entity.DataPermisson dp = new Api.SysManagement.Security.entity.DataPermisson();
        dp.MASTERID = loginName;
        dp.IDENTIFY_CODE = identify;
        dp.INDATE = dt.ToString();


        //查询用户手机号
        string TEL = Api.ServiceAccessor.GetSecurityService().queryTEL(loginName);

        //短信发送条数
        int MesssgeCount = 0;
        //数据库更新标志
        bool r = false;

        //短信内容
        string message = String.Format(@"登陆验证码为{0},仅用于登录验证，请勿告知他人。工作人员不会向您索取。",identify);
        if (!String.IsNullOrEmpty(TEL))
        {

            //发送验证码
            MesssgeCount = JYData.SMS_wj.Send(TEL, message);
            r = Api.ServiceAccessor.GetSecurityService().updateUserIndentify(dp);
            if (MesssgeCount <= 0)
            {
                log4net.ILog log = log4net.LogManager.GetLogger("短信发送异常，接口返回值为" + MesssgeCount);
                log.Error("调用完成");
            }
        }
        else
        {
            result = "用户手机号不存在，请联系管理员";
        }

        if (MesssgeCount > 0 && r == true)
        {
            result = "生成并发送成功";
        }

        context.Response.Write(result);
        return result;
    }
    /// <summary>
    /// 生成6位数字验证码，存入数据库并附带截止时间(移动端验证)
    /// </summary>
    /// <param name="context"></param>
    /// <returns></returns>
    public void GetMobileIdentifyCode(HttpContext context)
    {
        string sign = "0";
        string result = "异常";
        string tel = HttpContext.Current.Request["tel"];
        string identify = "";
        IList<User> userList = null;

        try
        {
            UserCond userCond = new UserCond();
            if (!string.IsNullOrEmpty(tel))
            {
                userCond.TEL = tel;
                userList = Api.ServiceAccessor.GetFoundationService().queryUser(userCond,true);
            }
            if (userList.Count == 0)
            {
                result = "当前手机用户不存在";
            }
            else
            {
                if (userList[0].ALLOWMOBILELOGIN != "1")
                {
                    result = "用户非法";
                }
                else if (userList[0].ALLOWMOBILELOGIN == "1")
                {
                    System.Random random = new System.Random();
                    for (int i = 0; i < 6; i++)
                    {
                        identify += random.Next(10).ToString();
                    }

                    ////查询有效时间
                    //int time = 1;
                    //DateTime dt = DateTime.Now.AddMinutes(time);

                    Api.SysManagement.Security.entity.DataPermisson dp = new Api.SysManagement.Security.entity.DataPermisson();
                    dp.MASTERID = userList[0].LOGINID;
                    dp.IDENTIFY_CODE = identify;
                    //dp.INDATE = dt.ToString();

                    int MesssgeCount = 0;
                    bool r = false;

                    //短信内容
                    string message = String.Format(@"登陆验证码为{0},仅用于登录验证，请勿告知他人。工作人员不会向您索取。", identify);
                    if (!String.IsNullOrEmpty(tel))
                    {

                        //发送验证码
                        MesssgeCount = JYData.SMS_wj.Send(tel, message);
                        r = Api.ServiceAccessor.GetSecurityService().updateUserIndentify(dp);
                        if (MesssgeCount <= 0)
                        {
                            log4net.ILog log = log4net.LogManager.GetLogger("短信发送异常，接口返回值为" + MesssgeCount);
                            log.Error("调用完成");
                        }
                    }
                    if (MesssgeCount > 0 && r == true)
                    {
                        sign = "1";
                        result = "生成并发送成功";
                    }
                }
            }
        }
        catch (Exception ex)
        {
            log4net.ILog log = log4net.LogManager.GetLogger("手机端获取短信验证码");
            log.Error("执行出错", ex);
        }

        StringBuilder json = new StringBuilder();
        json.Append("{\"sign\":\"" + sign +"\",\"result\":\"" + result + "\"}");

        context.Response.Write(json);
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}