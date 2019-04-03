<%@ WebHandler Language="C#" Class="XtButtonControl" %>

using System;
using System.Web;
using System.Xml;
using Api.Fault.entity.alarm;
using System.Collections.Generic;

using Api;
using Api.SysManagement.Security.service;
using Api.SysManagement.Log.service;
using Api.Util;
using System.Text;
using Api.SysManagement.Security.entity;
using Api.SysManagement.Security.entity.Cond;

public class XtButtonControl : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        //
        string type = HttpContext.Current.Request["type"];


        switch (type)
        {
            case "list":
                getlist(context);
                break;
            case "add":
                AddButton(context);
                break;
        }


    }


    private void getlist(HttpContext context)
    {

        string Code = HttpContext.Current.Request["Code"];
        int pageIndex = Convert.ToInt32(context.Request["page"]);
        int pageSize = Convert.ToInt32(context.Request["rp"]);


        string result = "";
        try
        {
            XtButtonCond xtButtonCond = new XtButtonCond();
            xtButtonCond.XT_MEM_CODE = Code;
            IList<XtButton> listButton = Api.ServiceAccessor.GetSecurityService().queryXtButton(xtButtonCond);
            int recordCount = Api.ServiceAccessor.GetSecurityService().queryXtButtonCount(xtButtonCond);
            StringBuilder strb = new StringBuilder();
            strb.Append("{\"rows\":[");
            foreach (Api.SysManagement.Security.entity.XtButton fm in listButton)
            {
                string cz = "<a  href=javascript:updateFunMenu(" + fm.XT_BUTTON_ID + ")>修改</a>&nbsp;<a  href=javascript:deleteFunMenu(" + fm.XT_BUTTON_ID + ")>删除</a>";

                strb.AppendFormat("{{\"XT_BUTTON_CODE\":\"{0}\",\"XT_MEM_CODE\":\"{1}\",\"XT_BUTTON_NAME\":\"{2}\",\"XT_BUTTON_OBJ_ID\":\"{3}\",\"XT_BUTTON_TYPE\":\"{4}\",\"XT_REQ_METHOD\":\"{5}\",\"XT_MEMO\":\"{6}\",\"CZ\":\"{7}\",\"ID\":\"{8}\"}},",
                    fm.XT_BUTTON_CODE, fm.XT_MEM_CODE, fm.XT_BUTTON_NAME, fm.XT_BUTTON_OBJ_ID, fm.XT_BUTTON_TYPE, fm.XT_REQ_METHOD, fm.XT_MEMO, cz, fm.XT_BUTTON_ID);
            }
            string js = strb.ToString();
            if (js.LastIndexOf(',') > -1)
            {
                js = js.Substring(0, js.LastIndexOf(','));

            }
            js += String.Format("],\"page\":{0},\"rp\":{1},\"total\":{2}}}", pageIndex, pageSize, recordCount);

            HttpContext.Current.Response.Write(js);
        }
        catch (Exception ex)
        {



        }


    }



    public void AddButton(HttpContext context)
    {
        string rs = "-1";
        try
        {
            XtButton xtButton = new XtButton();
            string XT_MEM_CODE = context.Request["Code"];
            string XT_BUTTON_NAME = context.Request.Form["XT_BUTTON_NAME"];
            string XT_BUTTON_OBJ_ID = context.Request.Form["XT_BUTTON_OBJ_ID"];
            string XT_REQ_METHOD = context.Request.Form["XT_REQ_METHOD"];
            string XT_BUTTON_TYPE = context.Request.Form["XT_BUTTON_TYPE"];
            string XT_MEMO = context.Request.Form["XT_MEMO"];
            string XT_BUTTON_CODE = PublicMethod.GetPingYing(XT_BUTTON_NAME);
            xtButton.XT_BUTTON_CODE = XT_MEM_CODE + "_" + XT_BUTTON_CODE;
            xtButton.XT_BUTTON_NAME = XT_BUTTON_NAME;
            xtButton.XT_BUTTON_OBJ_ID = XT_BUTTON_OBJ_ID;
            xtButton.XT_BUTTON_TYPE = XT_BUTTON_TYPE;
            xtButton.XT_MEM_CODE = XT_MEM_CODE;
            xtButton.XT_MEMO = XT_MEMO;
            xtButton.XT_REQ_METHOD = XT_REQ_METHOD;
            string id = Guid.NewGuid().ToString().Replace("-", "");
            xtButton.XT_BUTTON_ID = id;
            rs = Api.ServiceAccessor.GetSecurityService().addXtButton(xtButton) ? "1" : "-1";

            if (rs == "1")
            {
                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "菜单管理", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "菜单管理添加了新的按钮" + XT_BUTTON_NAME + XT_BUTTON_CODE, "", true);
            }
            else
            {
                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "菜单管理", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "菜单管理添加了新的按钮" + XT_BUTTON_NAME + XT_BUTTON_CODE, "", false);
            }
        }
        catch
        {

            rs = "-1";
        }
        HttpContext.Current.Response.Write(rs);
    }




    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}