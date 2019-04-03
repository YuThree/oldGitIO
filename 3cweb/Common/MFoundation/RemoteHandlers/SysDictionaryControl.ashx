<%@ WebHandler Language="C#" Class="SysDictionaryControl" %>

using System;
using System.Web;
using Api.Foundation.entity.Foundation;
using System.Collections.Generic;
using Api.Foundation.service;
using Api;
using Api.Util;
using System.Text;
using Api.Foundation.entity.Cond;

public class SysDictionaryControl : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        string type = context.Request["type"];
        switch (type)
        {
            //查询所有组织机构
            case "all":
                getAll();
                break;
            //添加组织机构
            case "add":
                getAdd();
                break;
            //修改组织机构
            case "update":
                getUpdate();
                break;
            //删除组织机构
            case "delete":
                getDelete();
                break;
            default:
                break;
        }
    }



    /// <summary>
    /// 获取列表信息
    /// </summary>
    private void getAll()
    {
        int pageIndex = Convert.ToInt32(HttpContext.Current.Request["page"]);
        int pageSize = Convert.ToInt32(HttpContext.Current.Request["rp"]);
        Api.Foundation.entity.Cond.SysDictionaryCond cond = new Api.Foundation.entity.Cond.SysDictionaryCond();
        cond.pageNum = pageIndex;
        cond.pageSize = pageSize;
        if (HttpContext.Current.Request["CODE_NAME"] != null && HttpContext.Current.Request["CODE_NAME"] != "")
        {
            cond.businssAnd = "code_name like '%" + HttpContext.Current.Request["CODE_NAME"] + "%'";
        }
        if (HttpContext.Current.Request["CODE"] != null && HttpContext.Current.Request["CODE"] != "undefined" && HttpContext.Current.Request["CODE"] != "")
        {
            cond.P_CODE = HttpContext.Current.Request["CODE"];
        }
        if (HttpContext.Current.Request["DIC_CODE"] != null && HttpContext.Current.Request["DIC_CODE"] != "undefined" && HttpContext.Current.Request["DIC_CODE"] != "")
        {
            cond.DIC_CODE = HttpContext.Current.Request["DIC_CODE"];
        }
        IList<SysDictionary> list = ServiceAccessor.GetFoundationService().querySysDictionary(cond);
        int recordCount = ServiceAccessor.GetFoundationService().getSysDictionaryCount(cond);

        StringBuilder sb = new StringBuilder();
        sb.Append("{\"rows\":[");
        foreach (SysDictionary sd in list)
        {
            string url = "";
            if (sd.IS_MODIFY_ALLOWED == "1")
            {
                if (PublicMethod.buttonControl("SysDictionaryList.htm", "UPDATE"))
                {
                    url += "<a  href=javascript:updateSysDictionaryModal(SysDictionary" + sd.ID + ")>修改</a>&nbsp;";
                }
                if (PublicMethod.buttonControl("SysDictionaryList.htm", "DELETE"))
                {
                    url += "<a href=javascript:deleteSysDictionary(SysDictionary" + sd.ID + ")>删除</a>";
                }
            }
            sb.AppendFormat("{{\"CODE_NAME\":\"{0}\",\"DIC_CODE\":\"{1}\",\"category\":\"{2}\",\"P_CODE\":\"{3}\",\"CODE_TYPE\":\"{4}\",\"DESCRIPTION\":\"{5}\",\"cz\":\"{6}\",\"id\":\"SysDictionary{7}\"}},",
                sd.CODE_NAME, sd.DIC_CODE, sd.CATEGORY, sd.P_CODE, sd.CODE_TYPE, sd.DESCRIPTION, url, sd.ID);
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
    /// 增加
    /// </summary>
    private void getAdd()
    {
        bool str = false;
        try
        {
            string TreeCode = myfiter.remove_input(HttpContext.Current.Request.Form["P_CODE"]);
            string DIC_CODE = myfiter.remove_input(HttpContext.Current.Request.Form["DIC_CODE"]);
            string CODE_NAME = myfiter.remove_input(HttpContext.Current.Request["CODE_NAME"]);
            string category = myfiter.remove_input(HttpContext.Current.Request["category"]);
            string codeType = myfiter.remove_input(HttpContext.Current.Request["codeType"]);

            SysDictionaryCond cond = new SysDictionaryCond();
            cond.P_CODE = TreeCode;
            if (category == "")
            {
                IList<SysDictionary> sysDictionaryPCODElist = Api.ServiceAccessor.GetFoundationService().querySysDictionary(cond);
                if (sysDictionaryPCODElist.Count > 0)
                {
                    cond.CATEGORY = sysDictionaryPCODElist[0].CATEGORY;
                }
                cond.P_CODE = null;
                cond.DIC_CODE = TreeCode;
                IList<SysDictionary> sysDictionaryCODElist = Api.ServiceAccessor.GetFoundationService().querySysDictionary(cond);
                if (sysDictionaryCODElist.Count > 0)
                {
                    cond.CATEGORY = sysDictionaryCODElist[0].CATEGORY;
                }
            }
            else
            {
                cond.CATEGORY = category;
            }
            cond.DIC_CODE = DIC_CODE;
            cond.P_CODE = TreeCode;
            cond.CODE_NAME = CODE_NAME;
            cond.CODE_TYPE = codeType;
            cond.IS_MODIFY_ALLOWED = "1";
            str = ServiceAccessor.GetFoundationService().sysDictionaryAdd(cond);

            if (str)
            {
                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "数据字典", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "添加了新的数据字典" + CODE_NAME + DIC_CODE, "", true);
            }
            else
            {
                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "数据字典", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "添加了新的数据字典" + CODE_NAME + DIC_CODE, "", false);
            }

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
    /// <summary>
    /// 修改
    /// </summary>
    private void getUpdate()
    {
        bool str = false;
        try
        {
            // string id = HttpContext.Current.Request["ID"];
            string DIC_CODE = myfiter.remove_input(HttpContext.Current.Request["DIC_CODE"]);
            string CODE_NAME = myfiter.remove_input(HttpContext.Current.Request["CODE_NAME"]);
            string P_CODE = myfiter.remove_input(HttpContext.Current.Request["P_CODE"]);
            string category = myfiter.remove_input(HttpContext.Current.Request["category"]);
            string codeType = myfiter.remove_input(HttpContext.Current.Request["codeType"]);

            SysDictionaryCond cond = new SysDictionaryCond();
            cond.DIC_CODE = DIC_CODE;
            IList<SysDictionary> syslist = ServiceAccessor.GetFoundationService().querySysDictionary(cond);
            SysDictionary sysdictionary = syslist[0];
            sysdictionary.CODE_NAME = CODE_NAME;
            sysdictionary.DIC_CODE = DIC_CODE;
            sysdictionary.P_CODE = P_CODE;
            sysdictionary.CATEGORY = category;
            sysdictionary.CODE_TYPE = codeType;

            str = ServiceAccessor.GetFoundationService().sysDictionaryUpdate(sysdictionary);

            if (str)
            {
                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "数据字典", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "修改了数据字典" + CODE_NAME + DIC_CODE, "", true);
            }
            else
            {
                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "数据字典", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "修改了数据字典" + CODE_NAME + DIC_CODE, "", false);
            }
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
    /// <summary>
    /// 删除
    /// </summary>
    private void getDelete()
    {
        bool str = false;
        try
        {
            string code = HttpContext.Current.Request["Code"];
            str = ServiceAccessor.GetFoundationService().sysDictionaryDelete(code);

            if (str)
            {
                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "数据字典", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "删除了数据字典" + code, "", true);
            }
            else
            {
                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "数据字典", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "删除了数据字典" + code, "", false);
            }
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
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}