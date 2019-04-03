<%@ WebHandler Language="C#" Class="DictionaryControl" %>

using System;
using System.Web;
using Api.Foundation.entity.Foundation;
using System.Collections.Generic;
using Api.Foundation.service;
using Api;
using System.Text;
using Api.Foundation.entity.Cond;

public class DictionaryControl : ReferenceClass, IHttpHandler
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
            //获取下拉列表
            case "pcodeSelect":
                getPcodeSelect();
                break;
            default:
                break;
        }
    }
    private void getAll()
    {
        string jsonStr = "";
        //获取前台页码
        int pageIndex = Convert.ToInt32(HttpContext.Current.Request["page"]);
        //获取前台条数
        int pageSize = Convert.ToInt32(HttpContext.Current.Request["rp"]);
        //条件
        Api.Foundation.entity.Cond.SysDictionaryCond cond = new Api.Foundation.entity.Cond.SysDictionaryCond();

        cond.pageNum = pageIndex;
        cond.pageSize = pageSize;
        IList<SysDictionary> list = new List<SysDictionary>();
        //获取总条数
        int recordCount = 0;
        string CODE_NAME = HttpContext.Current.Request["CODE_NAME"];
        string CODE = HttpContext.Current.Request["CODE"];
        if (!String.IsNullOrEmpty(CODE_NAME))
        {
            cond.CODE_NAME = CODE_NAME;
        }
        if (!String.IsNullOrEmpty(CODE) && CODE != "undefined")
        {
            cond.P_CODE = CODE;
        }
        cond.CATEGORY = "AFCODE";
        cond.businssAnd = " p_code is not null ";
        list = ServiceAccessor.GetFoundationService().querySysDictionary(cond);
        recordCount = ServiceAccessor.GetFoundationService().getSysDictionaryCount(cond);




        if (list != null)
        {
            jsonStr = "{'rows':[";
            for (int i = 0; i < list.Count; i++)
            {
                SysDictionary pdic = Api.Util.Common.getSysDictionaryInfo(list[i].P_CODE);
                string url = "";
                url += "<a  href=javascript:updateSysDictionaryModal(SysDictionary" + list[i].ID + ")>修改</a>&nbsp;";

                url += "<a href=javascript:deleteSysDictionary(SysDictionary" + list[i].ID + ")>删除</a>";

                jsonStr += "{'CODE_NAME':'" + list[i].CODE_NAME + "','DIC_CODE':'" + list[i].DIC_CODE + "','category':'" + list[i].CATEGORY + "','P_CODE':'" + list[i].P_CODE + "','P_NAME':'" + pdic.CODE_NAME + "','CODE_TYPE':'" + list[i].CODE_TYPE + "','DESCRIPTION':'" + list[i].DESCRIPTION + "','cz':'" + url + "','id':'SysDictionary" + list[i].ID + "'},";
            }
            if (jsonStr.LastIndexOf(',') > 0)
            {
                jsonStr = jsonStr.Substring(0, jsonStr.LastIndexOf(',')) + "],'page':" + pageIndex + ",'rp':" + pageSize + ",'total':" + recordCount + "}";
            }
            else
            {
                jsonStr += "],'page':'1','rp':'20','total':'" + list.Count + "'}";

            }

            jsonStr = jsonStr.Replace("'", "\"");
        }
        HttpContext.Current.Response.Write(jsonStr);
        
        
    }


    /// <summary>
    /// 增加
    /// </summary>
    private void getAdd()
    {
        bool str = false;
        try
        {
            string DIC_CODE = HttpContext.Current.Request["DIC_CODE"];
            string CODE_NAME = HttpContext.Current.Request["CODE_NAME"];
            ////string category = HttpContext.Current.Request["category"];
            string DESCRIPTION = HttpContext.Current.Request["DESCRIPTION"];
            string P_CODE = HttpContext.Current.Request["P_CODE"];
            SysDictionaryCond cond = new SysDictionaryCond();
            //if (category == "")
            //{
            //    IList<SysDictionary> sysDictionaryPCODElist = Api.ServiceAccessor.GetFoundationService().querySysDictionary(cond);
            //    if (sysDictionaryPCODElist.Count > 0)
            //    {
            //        cond.CATEGORY = sysDictionaryPCODElist[0].CATEGORY;
            //    }
            //    cond.P_CODE = null;
            //    IList<SysDictionary> sysDictionaryCODElist = Api.ServiceAccessor.GetFoundationService().querySysDictionary(cond);
            //    if (sysDictionaryCODElist.Count > 0)
            //    {
            //        cond.CATEGORY = sysDictionaryCODElist[0].CATEGORY;
            //    }
            //}
            //else
            //{
            //    cond.CATEGORY = category;
            //}

            cond.DIC_CODE = DIC_CODE;
            IList<SysDictionary> dicList = ServiceAccessor.GetFoundationService().querySysDictionary(cond);
            if (dicList.Count == 0)
            {
                cond.P_CODE = P_CODE;
                cond.CATEGORY = "AFCODE";
                cond.CODE_NAME = CODE_NAME;
                cond.DESCRIPTION = DESCRIPTION;
                str = ServiceAccessor.GetFoundationService().sysDictionaryAdd(cond);
            }
        }
        catch (Exception ex)
        {
            str = false;
        }
        finally
        {
            HttpContext.Current.Response.Write(str);
            
            
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
            string P_CODE = HttpContext.Current.Request["P_CODE"];
            string DIC_CODE = HttpContext.Current.Request["DIC_CODE"];
            string CODE_NAME = HttpContext.Current.Request["CODE_NAME"];
            string DESCRIPTION = HttpContext.Current.Request["DESCRIPTION"];
            SysDictionaryCond cond = new SysDictionaryCond();
            cond.DIC_CODE = DIC_CODE;
            IList<SysDictionary> syslist = ServiceAccessor.GetFoundationService().querySysDictionary(cond);
            SysDictionary sysdictionary = syslist[0];
            sysdictionary.CODE_NAME = CODE_NAME;
            sysdictionary.DESCRIPTION = DESCRIPTION;
            sysdictionary.P_CODE = P_CODE;
            str = ServiceAccessor.GetFoundationService().sysDictionaryUpdate(sysdictionary);
        }
        catch (Exception ex)
        {
            str = false;
        }
        finally
        {
            HttpContext.Current.Response.Write(str);
            
            
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
        }
        catch (Exception ex)
        {
            str = false;
        }
        finally
        {
            HttpContext.Current.Response.Write(str);
            
            
        }
    }
    private void getPcodeSelect()
    {
        string selectList = "<select id='ddlPcode' style='width: 135px;'>";
        selectList += "<option value=''></option>";
        SysDictionaryCond cond = new SysDictionaryCond();
        cond.CATEGORY = "AFCODE";
        cond.businssAnd = " p_code is null ";
        IList<SysDictionary> list = ServiceAccessor.GetFoundationService().querySysDictionary(cond);
        foreach (SysDictionary dic in list)
        {
            selectList += "<option value='" + dic.DIC_CODE + "'>" + dic.CODE_NAME + "</option>";
        }
        selectList += "</select>";
        HttpContext.Current.Response.Write(selectList);
        
        
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}