<%@ WebHandler Language="C#" Class="SUBST_APPRSControl" %>

using System;
using System.Web;
using Api.Foundation.entity.Cond;
using Api.Foundation.entity.Foundation;
using System.Text;
using System.Collections.Generic;


public class SUBST_APPRSControl : ReferenceClass, IHttpHandler {

    public void ProcessRequest(HttpContext context)
    {
        string action = context.Request["action"];
        try
        {


            switch (action)
            {
                case "Add":
                    addSUBST_APPRS();
                    break;
                case "Delete":
                    deleteSUBST_APPRS();
                    break;
                case "Update":
                    updateSUBST_APPRS();
                    break;
                case "QueryList":
                    QuerySUBST_APPRSList();
                    break;
                default:
                    break;
            }
        }
        catch (Exception ex )
        {

            log4net.ILog log = log4net.LogManager.GetLogger("变电所质量鉴定表管理");
            log.Error("执行出错", ex);
        }
    }
    public void addSUBST_APPRS()
    {
        string APPRS_ID = HttpContext.Current.Request["APPRS_ID"];//主键
        string SUBST_ID = HttpContext.Current.Request["SUBST_ID"];//变电所ID
        string APPRS_DATE = HttpContext.Current.Request["APPRS_DATE"];//鉴定日期
        string APPRS_RST = HttpContext.Current.Request["APPRS_RST"];//鉴定结果
        string APPRS_DGR = HttpContext.Current.Request["APPRS_DGR"];//鉴定等级
        string APPRS_DFT = HttpContext.Current.Request["APPRS_DFT"];//主要缺陷
        string APPRS_CXT = HttpContext.Current.Request["APPRS_CXT"];//鉴定内容

        SUBST_APPRS subst_apprs = new SUBST_APPRS();

        if (!string.IsNullOrEmpty(APPRS_ID))
        {
            subst_apprs.APPRS_ID = APPRS_ID;
        }
        else
        {
            subst_apprs.APPRS_ID = "C" + Guid.NewGuid().ToString().Replace("-", "");
        }
        subst_apprs.SUBST_ID = SUBST_ID;
        if (!string.IsNullOrEmpty(APPRS_DATE))
        {
            subst_apprs.APPRS_DATE = Convert.ToDateTime(APPRS_DATE);
        }
        else
        {
            subst_apprs.APPRS_DATE = DateTime.Now;
        }
        subst_apprs.APPRS_RST = APPRS_RST;
        subst_apprs.APPRS_DGR = APPRS_DGR;
        subst_apprs.APPRS_DFT = APPRS_DFT;
        subst_apprs.APPRS_CXT = Microsoft.JScript.GlobalObject.escape(APPRS_CXT);

        bool sign = false;

        try
        {
            sign = Api.ServiceAccessor.GetFoundationService().subst_apprsAdd(subst_apprs);
        }
        catch (Exception ex)
        {
            log4net.ILog log = log4net.LogManager.GetLogger("变电所质量鉴定表添加");
            log.Error("执行出错", ex);
        }

        StringBuilder json = new StringBuilder();
        json.Append("{\"sign\":\"" + sign + "\"}");

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);

    }
    public void deleteSUBST_APPRS()
    {
        string APPRS_ID = HttpContext.Current.Request["APPRS_ID"];//变电所质量鉴定表ID
        bool sign = false;
        if (!string.IsNullOrEmpty(APPRS_ID))
        {
            try
            {
                sign = Api.ServiceAccessor.GetFoundationService().subst_apprsDelete(APPRS_ID);
            }
            catch (Exception ex)
            {
                log4net.ILog log = log4net.LogManager.GetLogger("变电所质量鉴定表删除");
                log.Error("执行出错", ex);
            }
        }
        StringBuilder json = new StringBuilder();
        json.Append("{\"sign\":\"" + sign + "\"}");

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }
    public void updateSUBST_APPRS()
    {
        string APPRS_ID = HttpContext.Current.Request["APPRS_ID"];//主键
        string SUBST_ID = HttpContext.Current.Request["SUBST_ID"];//变电所ID
        string APPRS_DATE = HttpContext.Current.Request["APPRS_DATE"];//鉴定日期
        string APPRS_RST = HttpContext.Current.Request["APPRS_RST"];//鉴定结果
        string APPRS_DGR = HttpContext.Current.Request["APPRS_DGR_CODE"];//鉴定等级
        string APPRS_DFT = HttpContext.Current.Request["APPRS_DFT"];//主要缺陷
        string APPRS_CXT = HttpContext.Current.Request["APPRS_CXT"];//鉴定内容
        bool sign = false;

        SUBST_APPRS subst_apprs = new SUBST_APPRS();


        subst_apprs.APPRS_ID = APPRS_ID;
        subst_apprs.SUBST_ID = SUBST_ID;
        if (!string.IsNullOrEmpty(APPRS_DATE))
        {
            subst_apprs.APPRS_DATE = Convert.ToDateTime(APPRS_DATE);
        }
        else
        {
            subst_apprs.APPRS_DATE = DateTime.Now;
        }
        subst_apprs.APPRS_RST = APPRS_RST;
        subst_apprs.APPRS_DGR = APPRS_DGR;
        subst_apprs.APPRS_DFT = APPRS_DFT;
        subst_apprs.APPRS_CXT = Microsoft.JScript.GlobalObject.escape(APPRS_CXT);

        try
        {
            sign = Api.ServiceAccessor.GetFoundationService().subst_apprsUpdate(subst_apprs);
        }
        catch (Exception ex)
        {
            log4net.ILog log = log4net.LogManager.GetLogger("变电所质量鉴定表更新");
            log.Error("执行出错", ex);
        }
        StringBuilder json = new StringBuilder();
        json.Append("{\"sign\":\"" + sign + "\"}");

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }
    public void QuerySUBST_APPRSList()
    {
        string SUBST_ID = HttpContext.Current.Request["SUBST_ID"];//变电所编码
        int PAGESIZE = string.IsNullOrEmpty(HttpContext.Current.Request["PAGESIZE"]) ? 5 : Convert.ToInt32(HttpContext.Current.Request["PAGESIZE"]);//当前页
        int CURRENTPAGE = string.IsNullOrEmpty(HttpContext.Current.Request["CURRENTPAGE"]) ? 1 : Convert.ToInt32(HttpContext.Current.Request["CURRENTPAGE"]);//当前页

        SUBST_APPRSCond cond = new SUBST_APPRSCond();

        cond.businssAnd = " 1=1 ";

        cond.startRowNum = (CURRENTPAGE - 1) * PAGESIZE + 1;
        cond.endRowNum = CURRENTPAGE * PAGESIZE;
        if (!string.IsNullOrEmpty(SUBST_ID))
        {
            cond.SUBST_ID = SUBST_ID;
        }
        cond.orderBy = " APPRS_DATE DESC ";
        IList<SUBST_APPRS> list = new List<SUBST_APPRS>();
        list = Api.ServiceAccessor.GetFoundationService().querySubst_apprs_page(cond,false);

        StringBuilder json = new StringBuilder();
        json.Append("{\"data\":[");

        for (int i = 0; i < list.Count; i++)
        {
            json.Append("{\"APPRS_ID\":\"" + list[i].APPRS_ID + "\",");
            json.Append("\"SUBST_ID\":\"" + list[i].SUBST_ID + "\",");
            json.Append("\"APPRS_DATE\":\"" + (list[i].APPRS_DATE == DateTime.MinValue ? "" : list[i].APPRS_DATE.ToString("yyyy-MM-dd")) + "\",");
            json.Append("\"APPRS_RST\":\"" + list[i].APPRS_RST + "\",");
            json.Append("\"APPRS_DGR_CODE\":\"" + list[i].APPRS_DGR + "\",");
            json.Append("\"APPRS_DGR_NAME\":\"" + getCode_Name(list[i].APPRS_DGR) + "\",");
            json.Append("\"APPRS_DFT\":\"" + list[i].APPRS_DFT + "\",");
            json.Append("\"APPRS_CXT_BR\":\"" + (string.IsNullOrEmpty(list[i].APPRS_CXT) ? "" : list[i].APPRS_CXT.Replace("%0A", "<br/>")) + "\",");
            json.Append("\"APPRS_CXT\":\"" + list[i].APPRS_CXT + "\"}");
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
    public string getCode_Name(string code)
    {
        string re = "";
        if (!string.IsNullOrEmpty(code))
        {
            if (Api.Util.Common.sysDictionaryDic.ContainsKey(code))
            {
                re = Api.Util.Common.sysDictionaryDic[code].CODE_NAME;
            }
            else
            {
                re = code;
            }
        }
        return re;
    }

    public bool IsReusable {
        get {
            return false;
        }
    }

}