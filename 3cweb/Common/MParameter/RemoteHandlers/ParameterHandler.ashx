<%@ WebHandler Language="C#" Class="ParamterHandler" %>

using System;
using System.Web;
using System.Collections.Generic;
using Api.SysManagement.Security.entity;
using Api.SysManagement.Security.entity.Cond;

public class ParamterHandler :ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        String type = context.Request.QueryString["type"].ToString();
        switch (type)
        {
            case "loadList":
                loadParamterList(context);
                break;
            case "addParamter":
                addParamter(context);
                break;
            case "seeParamter":
                loadParamterForm(context);
                break;
            case "updateParamter":
                loadParamterForm(context);
                break;
            case "deleteParamter":
                deleteParamter(context);
                break;
        }
    }
    /// <summary>
    /// 
    /// </summary>
    /// <param name="context"></param>
    private void loadParamterList(HttpContext context)
    {
        ParamterCond paramterCond = new ParamterCond();
        //获取前台页码
        int pageIndex = Convert.ToInt32(HttpContext.Current.Request["page"]);
        //获取前台条数
        int pageSize = Convert.ToInt32(HttpContext.Current.Request["rp"]);
        paramterCond.page = pageIndex;
        paramterCond.pageSize = pageSize;
        paramterCond.businssAnd = "CONTEXT!='3C_SVR'";
        if (!String.IsNullOrEmpty(context.Request["TITLE"]))
        {
            paramterCond.TITILE = context.Request["TITLE"];
        }
        if (!String.IsNullOrEmpty(context.Request["KEY"]))
        {
            paramterCond.KEY = context.Request["KEY"];
        }
        String obj = Api.ServiceAccessor.GetParamterService().getParamterListJson(paramterCond);
        context.Response.Write(obj);
    }
    /// <summary>
    /// 
    /// </summary>
    /// <param name="context"></param>
    private void addParamter(HttpContext context)
    {
        Paramter paramter = new Paramter();
        String obj = "";
        if (!String.IsNullOrEmpty(context.Request["id"]))
        {
            paramter = Api.ServiceAccessor.GetParamterService().getParamter(context.Request["id"]);
            paramter.TITILE = context.Request.Form["TITILE"];
            paramter.KEY = context.Request.Form["KEY"];
            paramter.VALUE = context.Request.Form["VALUE"];
            paramter.CONTEXT = context.Request.Form["CONTEXT"];
            obj = Api.ServiceAccessor.GetParamterService().updateParamter(paramter);

        }
        else
        {
            paramter.TITILE = context.Request.Form["TITILE"];
            paramter.KEY = context.Request.Form["KEY"];
            paramter.VALUE = context.Request.Form["VALUE"];
            paramter.CONTEXT = context.Request.Form["CONTEXT"];
            paramter.TIME = DateTime.Now;
            obj = Api.ServiceAccessor.GetParamterService().addParamter(paramter);
        }
        context.Response.Write(obj);
    }
    /// <summary>
    /// 
    /// </summary>
    /// <param name="context"></param>
    private void loadParamterForm(HttpContext context)
    {
        ParamterCond paramterCond = new ParamterCond();
        paramterCond.ID = context.Request["id"];
        String obj = Api.ServiceAccessor.GetParamterService().getParamterListJson(paramterCond);
        context.Response.Write(obj);
    }
    /// <summary>
    /// 
    /// </summary>
    /// <param name="context"></param>
    private void deleteParamter(HttpContext context)
    {
        String obj = Api.ServiceAccessor.GetParamterService().deleteParamter(context.Request["id"]);
        context.Response.Write(obj);
    }
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}