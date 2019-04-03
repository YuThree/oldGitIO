<%@ WebHandler Language="C#" Class="MailHandler" %>

using System;
using System.Web;
using Api.SysManagement.Security.entity;
using Api.SysManagement.Security.entity.Cond;

public class MailHandler :ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        String type = context.Request.QueryString["type"];
        switch (type)
        {
            case "toDoMailList":
                loadMailList(context, type);
                break;
            case "doMailList":
                loadMailList(context, type);
                break;
            case "loadMail":
                loadMail(context);
                break;
            case "saveMail":
                saveMail(context);
                break;
            case "deleteMail":
                deleteMail(context);
                break;
            case "toDoMail":
                toDoMail(context);
                break;

        }
        ;
    }
    /// <summary>
    /// 发送短信
    /// </summary>
    private void toDoMail(HttpContext context)
    {
        String obj = "暂时还没有开发完成！";
        context.Response.Write(obj);
        context.Response.End();
        context.Response.Clear();
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="context"></param>
    /// <param name="type"></param>
    private void loadMailList(HttpContext context, String type)
    {
        MailCond mailCond = new MailCond();
        //获取前台页码
        int pageIndex = Convert.ToInt32(HttpContext.Current.Request["page"]);
        //获取前台条数
        int pageSize = Convert.ToInt32(HttpContext.Current.Request["rp"]);
        mailCond.page = pageIndex;
        mailCond.pageSize = pageSize;
        if (type == "toDoMailList")
        {
            mailCond.MAIL_STATUS = "0";
        }
        else
        {
            mailCond.MAIL_STATUS = "1";
        }
        if (!String.IsNullOrEmpty(context.Request["userName"]))
        {
            mailCond.USER_NAME = context.Request["userName"];
        }
        if (!String.IsNullOrEmpty(context.Request["mailTel"]))
        {
            mailCond.MAIL_TEL = context.Request["mailTel"];
        }
        if (!String.IsNullOrEmpty(context.Request["mailTitle"]))
        {
            mailCond.MAIL_TITLE = context.Request["mailTitle"];
        }
        if (!String.IsNullOrEmpty(context.Request["startTime"]))
        {
            mailCond.startTime = Convert.ToDateTime(context.Request["startTime"]);
        }
        if (!String.IsNullOrEmpty(context.Request["endTime"]))
        {
            mailCond.endTime = Convert.ToDateTime(context.Request["endTime"]);
        }
        mailCond.orderBy = " CREATE_TIME DESC";
        String obj = Api.ServiceAccessor.GetMailService().getMailJson(mailCond);
        context.Response.Write(obj);
        context.Response.End();
        context.Response.Clear();

    }
    /// <summary>
    /// 
    /// </summary>
    /// <param name="context"></param>
    private void loadMail(HttpContext context)
    {
        if (!String.IsNullOrEmpty(context.Request["id"]))
        {
            MailCond mailCond = new MailCond();
            mailCond.ID = context.Request["id"];
            String obj = Api.ServiceAccessor.GetMailService().getMailJson(mailCond);
            context.Response.Write(obj);
            context.Response.End();
            context.Response.Clear();
        }
    }
    /// <summary>
    /// 
    /// </summary>
    /// <param name="context"></param>
    private void saveMail(HttpContext context)
    {
    
        String obj = "";
        if (!String.IsNullOrEmpty(context.Request["id"]))
        {
            Mail mail = Api.ServiceAccessor.GetMailService().getMail(context.Request["id"]);
            mail.MAIL_TITLE = context.Request.Form["MAIL_TITLE"];
            mail.MAIL_CONTEXT = context.Request.Form["MAIL_CONTEXT"];
            mail.MAIL_REMARKS = context.Request.Form["MAIL_REMARKS"];
            obj = Api.ServiceAccessor.GetMailService().updateMail(mail);
        }
        else
        {
            
            if (!String.IsNullOrEmpty(context.Request.Form["MAIL_USERCODE"]))
            {
                String[] users = context.Request.Form["MAIL_USERCODE"].Trim().Split(';');
                if (users.Length > 0)
                {
                    for (int i = 0; i < users.Length; i++)
                    {
                        Api.Foundation.entity.Foundation.User user =
                            Api.ServiceAccessor.GetFoundationService().queryUserByCode(users[i]);
                        if (user != null && !String.IsNullOrEmpty(user.TEL))
                        {
                            Mail mail = new Mail();
                            mail.MAIL_TITLE = context.Request.Form["MAIL_TITLE"];
                            mail.MAIL_CONTEXT = context.Request.Form["MAIL_CONTEXT"];
                            mail.MAIL_REMARKS = context.Request.Form["MAIL_REMARKS"];
                            mail.MAIL_STATUS = context.Request.Form["MAIL_STATUS"];
                            //是否根据缺陷信息的组织机构来，还是根据人员的组织机构来
                            mail.ALARM_ID = context.Request["ALARM_ID"];
                            mail.USER_NAME = user.PER_NAME;
                            mail.USER_ID = user.USER_CODE;
                            mail.MAIL_TEL = user.TEL;
                            mail.CREATE_TIME = DateTime.Now;
                            Api.ServiceAccessor.GetMailService().addMail(mail);
                        }

                    }
                    obj = "添加成功！";
                }


            }
            else
            {
                obj = "请选择人员！";
            }
        }
        context.Response.Write(obj);
        context.Response.End();
        context.Response.Clear();
    }
    /// <summary>
    /// 
    /// </summary>
    /// <param name="context"></param>
    private void deleteMail(HttpContext context)
    {
        String obj = Api.ServiceAccessor.GetMailService().deleteMail(context.Request["id"]);
        context.Response.Write(obj);
        context.Response.End();
        context.Response.Clear();
    }


    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}