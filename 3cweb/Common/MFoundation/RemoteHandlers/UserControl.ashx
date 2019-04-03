<%@ WebHandler Language="C#" Class="UserControl" %>

using System;
using System.Web;
using Api.Foundation.entity.Foundation;
using System.Collections.Generic;
using Api.Foundation.service;
using Api;
using Api.Foundation.entity.Cond;
using System.Text;

public class UserControl : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        string type = context.Request["type"];
        switch (type)
        {
            //查询所有
            case "all":
                GetAll();
                break;
            //添加用户
            case "add":
                Add();
                break;
            //修改用户
            case "update":
                Update();
                break;
            //删除用户
            case "delete":
                Delete();
                break;
            //当前用户修改密码
            case "modifyPassword":
                ModifyPassword();
                break;
            case "sms":
                GetSMSAll();
                break;
            default:
                break;
        }
    }
    public void Delete()
    {
        string id = HttpContext.Current.Request["id"].TrimStart('u');
        bool str = false;
        try
        {
            str = ServiceAccessor.GetFoundationService().deleteUser(id);
        }
        catch
        {
            str = false;
        }
        finally
        {
            HttpContext.Current.Response.Write(str ? "1" : "-1");

        }
    }
    public void Update()
    {
        bool str = false;
        try
        {
            string id = HttpContext.Current.Request["USERID"].TrimStart('u');
            User user = ServiceAccessor.GetFoundationService().queryUser(id);
            user.USER_CODE = HttpContext.Current.Request["USER_CODE"];
            user.LOGINID = HttpContext.Current.Request.Form["LOGINID"];//用户名
            user.PASSWORD = HttpContext.Current.Request.Form["PASSWORD"];//用户密码
            user.PER_NAME = HttpContext.Current.Request.Form["PER_NAME"];//用户姓名
            user.SEX = HttpContext.Current.Request.Form["SEX"];//性别
            user.BIRTHDATE = Convert.ToDateTime(HttpContext.Current.Request.Form["BIRTHDATE"]);//出生日期
            user.TEL = HttpContext.Current.Request.Form["TEL"];//电话号码
            user.EMAIL = HttpContext.Current.Request.Form["EMAIL"];//电子邮件
            user.ADDR = HttpContext.Current.Request.Form["ADDR"];//地址
            user.ORG_CODE = HttpContext.Current.Request.Form["ORG_CODE"];//所属部门
            Organization org = Api.Util.Common.getOrgInfo(user.ORG_CODE);
            if (Api.Util.Public.IsPowerSectionOrg(org.ORG_TYPE))
            {
                user.USER_TYPE = "供电";
            }
            else {
                user.USER_TYPE = "";
            }
            user.DEPT_NAME = HttpContext.Current.Request.Form["DEPT_NAME"];
            user.DUTY = HttpContext.Current.Request.Form["DUTY"];//职务
            user.POSTTITLE = HttpContext.Current.Request.Form["POSTTITLE"];//职称
            user.SUPERVISOR = HttpContext.Current.Request.Form["SUPERVISOR"];//主管人
            user.EMPLOYEE_TYPE = HttpContext.Current.Request.Form["EMPLOYEE_TYPE"];//职员类别
            user.END_HIRE_DATE = Convert.ToDateTime(HttpContext.Current.Request.Form["END_HIRE_DATE"]);//终聘日期
            user.HIRE_DATE = Convert.ToDateTime(HttpContext.Current.Request.Form["HIRE_DATE"]);//聘用日期
            user.SECURITY_CLASS = HttpContext.Current.Request.Form["SECURITY_CLASS"];//安全等级
            user.PER_STATUS = HttpContext.Current.Request.Form["PER_STATUS"];//人员状态

            str = ServiceAccessor.GetFoundationService().updateUser(user);
        }
        catch
        {
            str = false;
        }
        finally
        {
            HttpContext.Current.Response.Write(str ? "1" : "-1");

        }
    }
    public void Add()
    {
        string re = "";
        try
        {
            UserCond u_query = new UserCond();
            u_query.LOGINID = HttpContext.Current.Request.Form["LOGINID"];

            int n = ServiceAccessor.GetFoundationService().getUserCount(u_query);

            if (n > 0)
            {
                //已经存在此用户
                re = "0,已经存在此用户";
            }
            else
            {

                User user = new User();
                user.USER_CODE = Guid.NewGuid().ToString().Replace("-", "").Substring(0, 5);
                user.LOGINID = HttpContext.Current.Request.Form["LOGINID"];//用户名
                user.PASSWORD = HttpContext.Current.Request.Form["PASSWORD"];//用户密码
                user.PER_NAME = HttpContext.Current.Request.Form["PER_NAME"];//用户姓名
                user.SEX = HttpContext.Current.Request.Form["SEX"];//性别
                user.BIRTHDATE = Convert.ToDateTime(HttpContext.Current.Request.Form["BIRTHDATE"]);//出生日期
                user.TEL = HttpContext.Current.Request.Form["TEL"];//电话号码
                user.EMAIL = HttpContext.Current.Request.Form["EMAIL"];//电子邮件
                user.ADDR = HttpContext.Current.Request.Form["ADDR"];//地址
                user.ORG_CODE = HttpContext.Current.Request.Form["ORG_CODE"];//所属部门
                Organization org = Api.Util.Common.getOrgInfo(user.ORG_CODE);
                if (Api.Util.Public.IsPowerSectionOrg(org.ORG_TYPE))
                {
                    user.USER_TYPE = "供电";
                }
                else
                {
                    user.USER_TYPE = "";
                }
                user.DEPT_NAME = HttpContext.Current.Request.Form["DEPT_NAME"];
                user.DUTY = HttpContext.Current.Request.Form["DUTY"];//职务
                user.POSTTITLE = HttpContext.Current.Request.Form["POSTTITLE"];//职称
                user.SUPERVISOR = HttpContext.Current.Request.Form["SUPERVISOR"];//主管人
                user.EMPLOYEE_TYPE = HttpContext.Current.Request.Form["EMPLOYEE_TYPE"];//职员类别
                user.END_HIRE_DATE = Convert.ToDateTime(HttpContext.Current.Request.Form["END_HIRE_DATE"]);//终聘日期
                user.HIRE_DATE = Convert.ToDateTime(HttpContext.Current.Request.Form["HIRE_DATE"]);//聘用日期
                user.SECURITY_CLASS = HttpContext.Current.Request.Form["SECURITY_CLASS"];//安全等级
                user.PER_STATUS = HttpContext.Current.Request.Form["PER_STATUS"];//人员状态
                bool str = ServiceAccessor.GetFoundationService().addUser(user);

                re = str ? "1,创建用户成功" : "0,创建用户失败";
            }
        }
        catch
        {
            re = "0,创建用户出错";
        }
        finally
        {
            HttpContext.Current.Response.Write(re);

        }
    }
    public void GetAll()
    {
        //获取前台页码
        int pageIndex = Convert.ToInt32(HttpContext.Current.Request["page"]);
        //获取前台条数
        int pageSize = Convert.ToInt32(HttpContext.Current.Request["rp"]);
        UserCond cond = new UserCond();
        if (HttpContext.Current.Request["ORG_CODE"] != null && HttpContext.Current.Request["ORG_CODE"] != "" && HttpContext.Current.Request["ORG_CODE"] != "undefined")
        {
            cond.businssAnd = "ORG_CODE like '" + HttpContext.Current.Request["ORG_CODE"] + "%'";
            //cond.ORG_CODE = HttpContext.Current.Request["ORG_CODE"];
        }
        if (HttpContext.Current.Request["PER_NAME"] != null && HttpContext.Current.Request["PER_NAME"] != "" && HttpContext.Current.Request["PER_NAME"] != "undefined")
        {
            cond.PER_NAME = HttpContext.Current.Request["PER_NAME"];
        }
        cond.pageNum = pageIndex;
        cond.pageSize = pageSize;
        IList<User> list = ServiceAccessor.GetFoundationService().queryUser(cond);

        //获取总条数
        int recordCount = ServiceAccessor.GetFoundationService().getUserCount(cond);

        string SMS = HttpContext.Current.Request["SMS"];

        StringBuilder sb = new StringBuilder();
        sb.Append("{\"rows\":[");

        foreach (User u in list)
        {
            string url = "";
            if (PublicMethod.buttonControl("UserList.htm", "UPDATE"))
            {
                url += "<a  href=javascript:updateUserModal(u" + u.ID + ")>修改</a>&nbsp;";
            }
            if (PublicMethod.buttonControl("UserList.htm", "DELETE"))
            {
                url += "<a href=javascript:deleteUser(u" + u.ID + ")>删除</a>&nbsp;";
            }
            sb.AppendFormat("{{\"USER_CODE\":\"{0}\",\"LOGINID\":\"{1}\",\"PASSWORD\":\"{2}\",\"PER_NAME\":\"{3}\",\"ROLE_CODE\":\"{4}\",\"SEX\":\"{5}\",\"BIRTHDATE\":\"{6}\",\"TEL\":\"{7}\",\"EMAIL\":\"{8}\",\"ADDR\":\"{9}\",\"ORG_CODE\":\"{10}\",\"ORG_NAME\":\"{11}\",\"DUTY\":\"{12}\",\"POSTTITLE\":\"{13}\",\"SUPERVISOR\":\"{14}\",\"EMPLOYEE_TYPE\":\"{15}\",\"END_HIRE_DATE\":\"{16}\",\"HIRE_DATE\":\"{17}\",\"SECURITY_CLASS\":\"{18}\",\"PER_STATUS\":\"{19}\",\"id\":\"u{20}\",\"cz\":\"{21}\"}},",
        u.USER_CODE, u.LOGINID, u.PASSWORD, u.PER_NAME, u.ROLE_CODE, (u.SEX == "0" ? "男" : "女"), u.BIRTHDATE.ToString("yyyy-MM-dd"), u.TEL, u.EMAIL, u.ADDR, u.ORG_CODE, u.DEPT_NAME, u.DUTY, u.POSTTITLE, u.SUPERVISOR, u.EMPLOYEE_TYPE, u.END_HIRE_DATE.ToString("yyyy-MM-dd"), u.HIRE_DATE.ToString("yyyy-MM-dd"), u.SECURITY_CLASS, (u.PER_STATUS == "0" ? "启用" : "停用"), u.ID, url);
        }

        string js = sb.ToString();
        if (js.LastIndexOf(',') > -1)
        {
            js = js.Substring(0, js.LastIndexOf(','));

        }
        js += String.Format("],\"page\":{0},\"rp\":{1},\"total\":{2}}}", pageIndex, pageSize, recordCount);
        js =  myfiter.json_RemoveSpecialStr(js);
        HttpContext.Current.Response.Write(js);

    }

    public void ModifyPassword()
    {
        string password = HttpContext.Current.Request["password"];//原始密码
        string newpassword = HttpContext.Current.Request["newpassword"];//新密码
        StringBuilder json = new StringBuilder();
        bool sign = false;
        string content = "";
        try
        {
            string userid = Api.Util.Public.GetLoginID;
            UserCond cond = new UserCond();
            cond.LOGINID = userid;
            IList<User> userlist = ServiceAccessor.GetFoundationService().queryUser(cond,true);
            if (userlist.Count > 1)
            {
                content = "异常";
            }
            else
            {
                if (password != userlist[0].PASSWORD)
                {
                    content = "原始密码不正确!";
                }
                else
                {
                    if (!string.IsNullOrEmpty(newpassword))
                    {
                        if (newpassword.Length < 6)
                        {
                            content = "密码长度太短!";
                        }
                        else
                        {
                            userlist[0].PASSWORD = newpassword;
                            if (ServiceAccessor.GetFoundationService().updateUser(userlist[0]))
                            {
                                content = "修改成功!";
                                sign = true;
                            }
                        }
                    }
                    else
                    {
                        content = "密码不能为空!";
                    }
                }
            }
        }
        catch (Exception ex)
        {
            log4net.ILog log = log4net.LogManager.GetLogger("修改密码");
            log.Error("执行出错", ex);
        }
        json.Append("{\"sign\":\"" + sign +"\",\"content\":\"" + content +"\"}");

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json.ToString());
    }
    public void GetSMSAll()
    {
        //获取前台页码
        int pageIndex = Convert.ToInt32(HttpContext.Current.Request["page"]);
        //获取前台条数
        int pageSize = Convert.ToInt32(HttpContext.Current.Request["rp"]);
        UserCond cond = new UserCond();
        if (HttpContext.Current.Request["ORG_CODE"] != null && HttpContext.Current.Request["ORG_CODE"] != "" && HttpContext.Current.Request["ORG_CODE"] != "undefined")
        {
            cond.businssAnd = "ORG_CODE like '" + HttpContext.Current.Request["ORG_CODE"] + "%'";
            //cond.ORG_CODE = HttpContext.Current.Request["ORG_CODE"];
        }
        if (HttpContext.Current.Request["PER_NAME"] != null && HttpContext.Current.Request["PER_NAME"] != "" && HttpContext.Current.Request["PER_NAME"] != "undefined")
        {
            cond.PER_NAME = HttpContext.Current.Request["PER_NAME"];
        }
        cond.pageNum = pageIndex;
        cond.pageSize = pageSize;
        IList<User> list = ServiceAccessor.GetFoundationService().queryUser(cond);

        //获取总条数
        int recordCount = ServiceAccessor.GetFoundationService().getUserCount(cond);


        StringBuilder sb = new StringBuilder();
        sb.Append("{\"rows\":[");

        foreach (User u in list)
        {
            string url = "";
            if (PublicMethod.buttonControl("UserList.htm", "UPDATE"))
            {
                url += "<a  href=javascript:updateUserModal(u" + u.ID + ")>修改</a>&nbsp;";
            }
            if (PublicMethod.buttonControl("UserList.htm", "DELETE"))
            {
                url += "<a href=javascript:deleteUser(u" + u.ID + ")>删除</a>&nbsp;";
            }
            sb.AppendFormat("{{\"USER_CODE\":\"{0}\",\"LOGINID\":\"{1}\",\"PER_NAME\":\"{2}\",\"ROLE_CODE\":\"{3}\",\"SEX\":\"{4}\",\"BIRTHDATE\":\"{5}\",\"TEL\":\"{6}\",\"EMAIL\":\"{7}\",\"ADDR\":\"{8}\",\"ORG_CODE\":\"{9}\",\"ORG_NAME\":\"{10}\",\"DUTY\":\"{11}\",\"POSTTITLE\":\"{12}\",\"SUPERVISOR\":\"{13}\",\"EMPLOYEE_TYPE\":\"{14}\",\"END_HIRE_DATE\":\"{15}\",\"HIRE_DATE\":\"{16}\",\"SECURITY_CLASS\":\"{17}\",\"PER_STATUS\":\"{18}\",\"id\":\"u{19}\",\"cz\":\"{20}\"}},",
       u.USER_CODE, u.LOGINID, u.PER_NAME, u.ROLE_CODE, (u.SEX == "0" ? "男" : "女"), u.BIRTHDATE.ToString("yyyy-MM-dd"), u.TEL, u.EMAIL, u.ADDR, u.ORG_CODE, u.DEPT_NAME, u.DUTY, u.POSTTITLE, u.SUPERVISOR, u.EMPLOYEE_TYPE, u.END_HIRE_DATE.ToString("yyyy-MM-dd"), u.HIRE_DATE.ToString("yyyy-MM-dd"), u.SECURITY_CLASS, (u.PER_STATUS == "0" ? "启用" : "停用"), u.ID, url);
        }

        string js = sb.ToString();
        if (js.LastIndexOf(',') > -1)
        {
            js = js.Substring(0, js.LastIndexOf(','));

        }
        js += String.Format("],\"page\":{0},\"rp\":{1},\"total\":{2}}}", pageIndex, pageSize, recordCount);
        js = myfiter.json_RemoveSpecialStr(js);
        HttpContext.Current.Response.Write(js);

    }



    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}