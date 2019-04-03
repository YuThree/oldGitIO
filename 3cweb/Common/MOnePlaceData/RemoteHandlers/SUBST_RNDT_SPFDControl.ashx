<%@ WebHandler Language="C#" Class="SUBST_RNDT_SPFDControl" %>

using System;
using System.Web;
using Api.Foundation.entity.Cond;
using Api.Foundation.entity.Foundation;
using System.Text;
using System.Collections.Generic;

public class SUBST_RNDT_SPFDControl : ReferenceClass, IHttpHandler {

    public void ProcessRequest (HttpContext context) {
        string action = context.Request["action"];
        try
        {

            switch (action)
            {
                case "Add":
                    addSUBST_RNDT_SPFD();
                    break;
                case "Delete":
                    deleteSUBST_RNDT_SPFD();
                    break;
                case "Update":
                    updateSUBST_RNDT_SPFD();
                    break;
                case "QueryList":
                    QuerySUBST_RNDT_SPFDList();
                    break;
                default:
                    break;
            }
        }
        catch (Exception ex)
        {

            log4net.ILog log = log4net.LogManager.GetLogger("变电所备用馈线管理");
            log.Error("执行出错", ex);
        }
    }

    public void addSUBST_RNDT_SPFD()
    {
        string SPFD_ID = HttpContext.Current.Request["SPFD_ID"];//主键
        string SUBST_ID = HttpContext.Current.Request["SUBST_ID"];//变电所ID
        string SPFDNM = HttpContext.Current.Request["SPFDNM"];//备用馈线名称
        string SPFD = HttpContext.Current.Request["SPFD"];//备用馈线编号
        string SPFD_SN = HttpContext.Current.Request["SPFD_SN"];//备用馈线序号

        SUBST_RNDT_SPFD subst_rndt_spfd = new SUBST_RNDT_SPFD();

        if (!string.IsNullOrEmpty(SPFD_ID))
        {
            subst_rndt_spfd.SPFD_ID = SPFD_ID;
        }
        else
        {
            subst_rndt_spfd.SPFD_ID = "C" + Guid.NewGuid().ToString().Replace("-", "");
        }
        subst_rndt_spfd.SUBST_ID = SUBST_ID;
        subst_rndt_spfd.SPFDNM = SPFDNM;
        subst_rndt_spfd.SPFD = SPFD;
        if (!string.IsNullOrEmpty(SPFD_SN))
        {
            subst_rndt_spfd.SPFD_SN = Convert.ToInt32(SPFD_SN);
        }

        bool sign = false;

        try
        {
            sign = Api.ServiceAccessor.GetFoundationService().subst_rndt_spfdAdd(subst_rndt_spfd);
        }
        catch (Exception ex)
        {
            log4net.ILog log = log4net.LogManager.GetLogger("变电所备用馈线添加");
            log.Error("执行出错", ex);
        }

        StringBuilder json = new StringBuilder();
        json.Append("{\"sign\":\"" + sign + "\"}");

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);

    }
    public void deleteSUBST_RNDT_SPFD()
    {
        string SPFD_ID = HttpContext.Current.Request["SPFD_ID"];//变电所质量鉴定表ID
        bool sign = false;
        if (!string.IsNullOrEmpty(SPFD_ID))
        {
            try
            {
                sign = Api.ServiceAccessor.GetFoundationService().subst_rndt_spfDelete(SPFD_ID);
            }
            catch (Exception ex)
            {
                log4net.ILog log = log4net.LogManager.GetLogger("变电所备用馈线删除");
                log.Error("执行出错", ex);
            }
        }
        StringBuilder json = new StringBuilder();
        json.Append("{\"sign\":\"" + sign + "\"}");

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }
    public void updateSUBST_RNDT_SPFD()
    {
        string SPFD_ID = HttpContext.Current.Request["SPFD_ID"];//主键
        string SUBST_ID = HttpContext.Current.Request["SUBST_ID"];//变电所ID
        string SPFDNM = HttpContext.Current.Request["SPFDNM"];//备用馈线名称
        string SPFD = HttpContext.Current.Request["SPFD"];//备用馈线编号
        string SPFD_SN = HttpContext.Current.Request["SPFD_SN"];//备用馈线序号

        SUBST_RNDT_SPFD subst_rndt_spfd = new SUBST_RNDT_SPFD();

        if (!string.IsNullOrEmpty(SPFD_ID))
        {
            subst_rndt_spfd.SPFD_ID = SPFD_ID;
        }
        else
        {
            subst_rndt_spfd.SPFD_ID = "C" + Guid.NewGuid().ToString().Replace("-", "");
        }
        subst_rndt_spfd.SUBST_ID = SUBST_ID;
        subst_rndt_spfd.SPFDNM = SPFDNM;
        subst_rndt_spfd.SPFD = SPFD;
        if (!string.IsNullOrEmpty(SPFD_SN))
        {
            subst_rndt_spfd.SPFD_SN = Convert.ToInt32(SPFD_SN);
        }

        bool sign = false;

        try
        {
            sign = Api.ServiceAccessor.GetFoundationService().subst_rndt_spfUpdate(subst_rndt_spfd);
        }
        catch (Exception ex)
        {
            log4net.ILog log = log4net.LogManager.GetLogger("变电所备用馈线更新");
            log.Error("执行出错", ex);
        }

        StringBuilder json = new StringBuilder();
        json.Append("{\"sign\":\"" + sign + "\"}");

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }
    public void QuerySUBST_RNDT_SPFDList()
    {
        string SUBST_ID = HttpContext.Current.Request["SUBST_ID"];//变电所编码
        int PAGESIZE = string.IsNullOrEmpty(HttpContext.Current.Request["PAGESIZE"]) ? 5 : Convert.ToInt32(HttpContext.Current.Request["PAGESIZE"]);//当前页
        int CURRENTPAGE = string.IsNullOrEmpty(HttpContext.Current.Request["CURRENTPAGE"]) ? 1 : Convert.ToInt32(HttpContext.Current.Request["CURRENTPAGE"]);//当前页

        SUBST_RNDT_SPFDCond cond = new SUBST_RNDT_SPFDCond();

        cond.businssAnd = " 1=1 ";

        cond.startRowNum = (CURRENTPAGE - 1) * PAGESIZE + 1;
        cond.endRowNum = CURRENTPAGE * PAGESIZE;
        if (!string.IsNullOrEmpty(SUBST_ID))
        {
            cond.SUBST_ID = SUBST_ID;
        }
        cond.orderBy = " SPFD DESC ";
        IList<SUBST_RNDT_SPFD> list = new List<SUBST_RNDT_SPFD>();
        list = Api.ServiceAccessor.GetFoundationService().querySubst_rndt_spfd_page(cond, false);

        StringBuilder json = new StringBuilder();
        json.Append("{\"data\":[");

        for (int i = 0; i < list.Count; i++)
        {
            json.Append("{\"SPFD_ID\":\"" + list[i].SPFD_ID + "\",");
            json.Append("\"SUBST_ID\":\"" + list[i].SUBST_ID + "\",");
            json.Append("\"SPFDNM\":\"" + list[i].SPFDNM + "\",");
            json.Append("\"SPFD\":\"" + list[i].SPFD + "\",");
            json.Append("\"NTHDT\":\"" + list[i].SPFD_SN + "\"}");
            if (i < list.Count - 1)
            {
                json.Append(",");
            }
        }

        json.Append("]");

        PageHelper ph = new PageHelper();
        int total = 0;
        if (list.Count > 0)
        {
            total = Convert.ToInt32(list[0].MY_INT_1);
        }
        json.Append("," + ph.getPageJson(total, CURRENTPAGE, PAGESIZE) + "}");


        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);

    }

    public bool IsReusable {
        get {
            return false;
        }
    }

}