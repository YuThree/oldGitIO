<%@ WebHandler Language="C#" Class="FunMenuControl" %>

using System;
using System.Web;
using Newtonsoft.Json;
using System.IO;
using System.Data;
using System.Collections.Generic;
using System.Web.SessionState;
using System.Text;
using Api.SysManagement.Security.entity.Cond;

public class FunMenuControl : ReferenceClass, IHttpHandler, IRequiresSessionState
{

    public void ProcessRequest(HttpContext context)
    {
        String type = context.Request.QueryString["type"].ToString();
        switch (type)
        {
            case "grid":
                bindFunMenu(context);
                break;
            case "addFunMenu":
                addFunMenu(context);
                break;
            case "updateFunMenu":
                updateFunMenu(context);
                break;
            case "deleteFunMenu":
                deleteFunMenu(context);
                break;
        }
    }
    /// <summary>
    /// 加载菜单列表
    /// </summary>
    /// <param name="context"></param>
    public void bindFunMenu(HttpContext context)
    {
        int pageIndex = Convert.ToInt32(context.Request["page"]);
        int pageSize = Convert.ToInt32(context.Request["rp"]);
        FunMenuCond fmc = new FunMenuCond();
        fmc.page = pageIndex;
        fmc.pageSize = pageSize;
        if (!String.IsNullOrEmpty(context.Request["funMenuCode"]) && "0" != context.Request["funMenuCode"] && "undefined" != context.Request["funMenuCode"])
        {
            fmc.businssAnd = "  (CODE LIKE '" + context.Request["funMenuCode"] + "%' OR SUBCODE LIKE  '" + context.Request["funMenuCode"] + "%')";
        }
        if (!String.IsNullOrEmpty(context.Request["id"]))
        {
            fmc.ID = context.Request["id"];
        }
        fmc.FLAG = "false";
        fmc.orderBy = " CODE ASC";
        IList<Api.SysManagement.Security.entity.FunMenu> funMenuList = Api.ServiceAccessor.getFunMenuService().getFunMenu(fmc);
        int recordCount = Api.ServiceAccessor.getFunMenuService().getFunMenuCount(fmc);
        StringBuilder sb = new StringBuilder();
        sb.Append("{\"rows\":[");
        foreach (Api.SysManagement.Security.entity.FunMenu fm in funMenuList)
        {
            string cz = "<a  href=javascript:addFunMenu(" + fm.ID + ")>添加</a>&nbsp;<a  href=javascript:updateFunMenu(" + fm.ID + ")>修改</a>&nbsp;<a  href=javascript:deleteFunMenu(" + fm.ID + ")>删除</a>&nbsp;<a  href=javascript:AddButton('" + fm.CODE + "')>添加按钮</a>";

            sb.AppendFormat("{{\"CATEGORY\":\"{0}\",\"SUBCODE\":\"{1}\",\"CODE\":\"{2}\",\"NAME\":\"{3}\",\"URL\":\"{4}\",\"IMG\":\"{5}\",\"FLAG\":\"{6}\",\"LEAF\":\"{7}\",\"NOTE\":\"{8}\",\"gxtj\":\"{9}\",\"CZ\":\"{10}\",\"ID\":\"{11}\"}},",
                fm.PARENTCODE, fm.SUBCODE, fm.CODE, fm.NAME, fm.URL, fm.IMG, fm.FLAG, fm.LEAF, fm.NOTE, fm.ID, cz, fm.ID);
        }
        string js = sb.ToString();
        if (js.LastIndexOf(',') > -1)
        {
            js = js.Substring(0, js.LastIndexOf(','));

        }
        js += String.Format("],\"page\":{0},\"rp\":{1},\"total\":{2}}}", pageIndex, pageSize, recordCount);

        HttpContext.Current.Response.Write(js);


    }

    /// <summary>
    /// 添加菜单
    /// </summary>
    /// <param name="context"></param>
    public void addFunMenu(HttpContext context)
    {
        Api.SysManagement.Security.entity.FunMenu funMenu = new Api.SysManagement.Security.entity.FunMenu();
        funMenu.CODE = context.Request.Form["CODE"];//等级
        funMenu.FLAG = context.Request.Form["FLAG"];
        funMenu.IMG = context.Request.Form["IMG"];//等级
        funMenu.NAME = context.Request.Form["NAME"];//等级
        funMenu.SUBCODE = context.Request.Form["SUBCODE"];//等级
        funMenu.URL = context.Request.Form["URL"];//等级
        funMenu.PARENTCODE = context.Request.Form["PARENTCODE"];
        funMenu.LEAF = context.Request.Form["LEAF"];
        bool flag = Api.ServiceAccessor.getFunMenuService().addFunMenu(funMenu);
        context.Response.Write(flag ? "1" : "-1");
        context.Response.End();
    }
    /// <summary>
    /// 修改菜单
    /// </summary>
    /// <param name="context"></param>
    public void updateFunMenu(HttpContext context)
    {
        Api.SysManagement.Security.entity.FunMenu funMenu = Api.ServiceAccessor.getFunMenuService().getFunMenu(context.Request["id"]);
        funMenu.CODE = context.Request.Form["CODE"];//等级

        funMenu.FLAG = context.Request.Form["FLAG"];
        funMenu.IMG = context.Request.Form["IMG"];//等级
        funMenu.NAME = context.Request.Form["NAME"];//等级
        funMenu.SUBCODE = context.Request.Form["SUBCODE"];//等级
        funMenu.URL = context.Request.Form["URL"];//等级
        funMenu.PARENTCODE = context.Request.Form["PARENTCODE"];
        funMenu.LEAF = context.Request.Form["LEAF"];
        bool flag = Api.ServiceAccessor.getFunMenuService().updateFunMenu(funMenu);
        context.Response.Write(flag ? "1" : "-1");
        context.Response.End();
    }
    /// <summary>
    /// 删除菜单
    /// </summary>
    /// <param name="context"></param>
    public void deleteFunMenu(HttpContext context)
    {
        bool flag = Api.ServiceAccessor.getFunMenuService().deleteFunMenu(context.Request["id"]);
        context.Response.Write(flag ? "1" : "-1");
        context.Response.End();
    }
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}