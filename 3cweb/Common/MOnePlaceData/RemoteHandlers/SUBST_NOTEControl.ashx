<%@ WebHandler Language="C#" Class="SUBST_NOTEControl" %>

using System;
using System.Web;
using Api.Foundation.entity.Cond;
using Api.Foundation.entity.Foundation;
using System.Text;
using System.Collections.Generic;

public class SUBST_NOTEControl : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        string action = context.Request["action"];
        try
        {

            switch (action)
            {
                case "Add":
                    addSUBST_NOTE();
                    break;
                case "Delete":
                    deleteSUBST_NOTE();
                    break;
                case "Update":
                    updateSUBST_NOTE();
                    break;
                case "QueryList":
                    QuerySUBST_NOTEList();
                    break;
                default:
                    break;
            }
        }
        catch (Exception ex)
        {

            log4net.ILog log = log4net.LogManager.GetLogger("变电所记事管理");
            log.Error("执行出错", ex);
        }
    }
    public void addSUBST_NOTE()
    {
        string NOTE_ID = HttpContext.Current.Request["NOTE_ID"];//主键
        string SUBST_ID = HttpContext.Current.Request["SUBST_ID"];//变电所ID
        string NTTL = HttpContext.Current.Request["NTTL"];//标题
        string NTCNT = HttpContext.Current.Request["NTCNT"];//内容
        string NTFP = HttpContext.Current.Request["NTFP"];//填写人
        string NTFD = HttpContext.Current.Request["NTFD"];//填写日期
        string NTHDT = HttpContext.Current.Request["NTHDT"];//记事发生日期

        SUBST_NOTE subst_note = new SUBST_NOTE();

        if (!string.IsNullOrEmpty(NOTE_ID))
        {
            subst_note.NOTE_ID = NOTE_ID;
        }
        else
        {
            subst_note.NOTE_ID = "C" + Guid.NewGuid().ToString().Replace("-", "");
        }
        subst_note.SUBST_ID = SUBST_ID;
        subst_note.NTTL = NTTL;
        subst_note.NTCNT = Microsoft.JScript.GlobalObject.escape(NTCNT);
        subst_note.NTFP = NTFP;
        if (!string.IsNullOrEmpty(NTFD))
        {
            subst_note.NTFD = Convert.ToDateTime(NTFD);
        }
        else
        {
            subst_note.NTFD = DateTime.Now;
        }
        if (!string.IsNullOrEmpty(NTHDT))
        {
            subst_note.NTHDT = Convert.ToDateTime(NTHDT);
        }
        else
        {
            subst_note.NTHDT = DateTime.Now;
        }

        bool sign = false;

        try
        {
            sign = Api.ServiceAccessor.GetFoundationService().subst_noteAdd(subst_note);
        }
        catch (Exception ex)
        {
            log4net.ILog log = log4net.LogManager.GetLogger("变电所记事添加");
            log.Error("执行出错", ex);
        }

        StringBuilder json = new StringBuilder();
        json.Append("{\"sign\":\"" + sign + "\"}");

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);

    }
    public void deleteSUBST_NOTE()
    {
        string NOTE_ID = HttpContext.Current.Request["NOTE_ID"];//变电所质量鉴定表ID
        bool sign = false;
        if (!string.IsNullOrEmpty(NOTE_ID))
        {
            try
            {
                sign = Api.ServiceAccessor.GetFoundationService().subst_noteDelete(NOTE_ID);
            }
            catch (Exception ex)
            {
                log4net.ILog log = log4net.LogManager.GetLogger("变电所记事删除");
                log.Error("执行出错", ex);
            }
        }
        StringBuilder json = new StringBuilder();
        json.Append("{\"sign\":\"" + sign + "\"}");

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }
    public void updateSUBST_NOTE()
    {
        string NOTE_ID = HttpContext.Current.Request["NOTE_ID"];//主键
        string SUBST_ID = HttpContext.Current.Request["SUBST_ID"];//变电所ID
        string NTTL = HttpContext.Current.Request["NTTL"];//标题
        string NTCNT = HttpContext.Current.Request["NTCNT"];//内容
        string NTFP = HttpContext.Current.Request["NTFP"];//填写人
        string NTFD = HttpContext.Current.Request["NTFD"];//填写日期
        string NTHDT = HttpContext.Current.Request["NTHDT"];//记事发生日期

        SUBST_NOTE subst_note = new SUBST_NOTE();

        subst_note.NOTE_ID = NOTE_ID;
        subst_note.SUBST_ID = SUBST_ID;
        subst_note.NTTL = NTTL;
        subst_note.NTCNT = Microsoft.JScript.GlobalObject.escape(NTCNT);
        subst_note.NTFP = NTFP;
        if (!string.IsNullOrEmpty(NTFD))
        {
            subst_note.NTFD = Convert.ToDateTime(NTFD);
        }
        else
        {
            subst_note.NTFD = DateTime.Now;
        }
        if (!string.IsNullOrEmpty(NTHDT))
        {
            subst_note.NTHDT = Convert.ToDateTime(NTHDT);
        }
        else
        {
            subst_note.NTHDT = DateTime.Now;
        }

        bool sign = false;

        try
        {
            sign = Api.ServiceAccessor.GetFoundationService().subst_noteUpdate(subst_note);
        }
        catch (Exception ex)
        {
            log4net.ILog log = log4net.LogManager.GetLogger("变电所记事更新");
            log.Error("执行出错", ex);
        }

        StringBuilder json = new StringBuilder();
        json.Append("{\"sign\":\"" + sign + "\"}");

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }
    public void QuerySUBST_NOTEList()
    {
        string SUBST_ID = HttpContext.Current.Request["SUBST_ID"];//变电所编码
        int PAGESIZE = string.IsNullOrEmpty(HttpContext.Current.Request["PAGESIZE"]) ? 5 : Convert.ToInt32(HttpContext.Current.Request["PAGESIZE"]);//当前页
        int CURRENTPAGE = string.IsNullOrEmpty(HttpContext.Current.Request["CURRENTPAGE"]) ? 1 : Convert.ToInt32(HttpContext.Current.Request["CURRENTPAGE"]);//当前页

        SUBST_NOTECond cond = new SUBST_NOTECond();

        cond.businssAnd = " 1=1 ";

        cond.startRowNum = (CURRENTPAGE - 1) * PAGESIZE + 1;
        cond.endRowNum = CURRENTPAGE * PAGESIZE;
        if (!string.IsNullOrEmpty(SUBST_ID))
        {
            cond.SUBST_ID = SUBST_ID;
        }
        cond.orderBy = " NTHDT DESC ";
        IList<SUBST_NOTE> list = new List<SUBST_NOTE>();
        list = Api.ServiceAccessor.GetFoundationService().querySubst_note_page(cond, false);

        StringBuilder json = new StringBuilder();
        json.Append("{\"data\":[");

        for (int i = 0; i < list.Count; i++)
        {
            json.Append("{\"NOTE_ID\":\"" + list[i].NOTE_ID + "\",");
            json.Append("\"SUBST_ID\":\"" + list[i].SUBST_ID + "\",");
            json.Append("\"NTTL\":\"" + myfiter.json_RemoveSpecialStr_N(list[i].NTTL) + "\",");
            json.Append("\"NTCNT_BR\":\"" + (string.IsNullOrEmpty(list[i].NTCNT) ? "" : list[i].NTCNT.Replace("%0A", "<br/>")) + "\",");
            json.Append("\"NTCNT\":\"" + list[i].NTCNT + "\",");
            json.Append("\"NTFP\":\"" + list[i].NTFP + "\",");
            json.Append("\"NTFD\":\"" + (list[i].NTFD == DateTime.MinValue ? "" : list[i].NTFD.ToString("yyyy-MM-dd")) + "\",");
            json.Append("\"NTHDT\":\"" + (list[i].NTHDT == DateTime.MinValue ? "" : list[i].NTHDT.ToString("yyyy-MM-dd")) + "\"}");
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

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}