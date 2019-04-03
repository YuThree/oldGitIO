<%@ WebHandler Language="C#" Class="OrganizationControl" %>

using System;
using System.Web;
using Api.Foundation.entity.Foundation;
using System.Collections.Generic;
using Api.Foundation.service;
using Api;
using Api.Util;
using System.Text;
using Api.Foundation.entity.Cond;
using System.Data;

public class OrganizationControl : ReferenceClass, IHttpHandler
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
            //根据code获取类型
            case "tp":
                getOrganizationTypeByCode();
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
            case "refresh":
                orgRefresh();
                break;
        }
    }


    /// <summary>
    /// 获取所有机构
    /// </summary>
    private void getAll()
    {
        int pageIndex = Convert.ToInt32(HttpContext.Current.Request["page"]);
        int pageSize = Convert.ToInt32(HttpContext.Current.Request["rp"]);
        Api.Foundation.entity.Cond.OrganizationCond cond = new Api.Foundation.entity.Cond.OrganizationCond();
        cond.pageNum = pageIndex;
        cond.pageSize = pageSize;
        if (HttpContext.Current.Request["ORG_NAME"] != null && HttpContext.Current.Request["ORG_NAME"] != "")
        {
            cond.ORG_NAME = HttpContext.Current.Request["ORG_NAME"];
        }
        if (HttpContext.Current.Request["CODE"] != null && HttpContext.Current.Request["CODE"] != "undefined" && HttpContext.Current.Request["CODE"] != "")
        {
            cond.ORG_CODE = HttpContext.Current.Request["CODE"];
        }

        IList<Organization> list = ServiceAccessor.GetFoundationService().queryOrganizationFuzzyCode(cond);//
        int recordCount = ServiceAccessor.GetFoundationService().getOrganizationCount(cond);
        StringBuilder sb = new StringBuilder();
        sb.Append("{\"rows\":[");
        foreach (Organization o in list)
        {

            string url = "";
            if (o.IS_MODIFY_ALLOWED == "1")
            {
                if (PublicMethod.buttonControl("OrganizationList.htm", "UPDATE"))
                {
                    url += "<a  href=javascript:updateOrganizationModal(organization" + o.ID + ")>修改</a>&nbsp;";
                }
                if (PublicMethod.buttonControl("OrganizationList.htm", "DELETE"))
                {
                    url += "<a href=javascript:deleteOrganization(organization" + o.ID + ")>删除</a>";
                }
            }
            sb.AppendFormat("{{\"ORG_NAME\":\"{0}\",\"ORG_TYPE\":\"{1}\",\"ORG_ORDER\":\"{2}\",\"SUP_ORG_NAME\":\"{3}\",\"LINK_MAN\":\"{4}\",\"LINK_TEL\":\"{5}\",\"ORG_ADDR\":\"{6}\",\"POSTCODE\":\"{7}\",\"GIS_LON\":\"{8}\",\"GIS_LAT\":\"{9}\",\"cz\":\"{10}\",\"ORG_CODE\":\"{11}\",\"id\":\"organization{12}\",\"ORG_DERGEE\":\"{13}\"}},",
                o.ORG_NAME, o.ORG_TYPE, o.ORG_ORDER, o.SUP_ORG_NAME, o.LINK_MAN, o.LINK_TEL, o.ORG_ADDR, o.POSTCODE, o.GIS_LON, o.GIS_LAT, url, o.ORG_CODE, o.ID, o.ORG_DEGREE);
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
    /// 组织机构类型
    /// </summary>
    private string ORG_TYPE_GQ = "GQ";



    /// <summary>
    /// 增加
    /// </summary>
    private void getAdd()
    {
        string rs = "1";
        try
        {
            string TreeCode = HttpContext.Current.Request["TreeCode"];
            Organization Suporganization = Api.ServiceAccessor.GetFoundationService().queryOrganizationByCode(TreeCode);

            string orgCode = Suporganization.ORG_CODE + "$" + HttpContext.Current.Request["ORG_CODE"];
            Organization org = Api.ServiceAccessor.GetFoundationService().queryOrganizationByCode(orgCode);
            if (String.IsNullOrEmpty(org.ID))
            {
                Organization organization = new Organization();
                organization.ORG_CODE = orgCode;
                organization.ORG_NAME = HttpContext.Current.Request["ORG_NAME"];
                organization.LINK_MAN = HttpContext.Current.Request["LINK_MAN"];
                organization.LINK_TEL = HttpContext.Current.Request["LINK_TEL"];
                organization.ORG_ADDR = HttpContext.Current.Request["ORG_ADDR"];
                organization.POSTCODE = HttpContext.Current.Request["POSTCODE"];
                organization.ORG_TYPE = HttpContext.Current.Request["ORG_TYPE"];
                organization.ORG_DEGREE = HttpContext.Current.Request["ORG_DEGREE"];
                if (HttpContext.Current.Request["ORG_ORDER"] != "")
                {
                    organization.ORG_ORDER = Convert.ToUInt32(HttpContext.Current.Request["ORG_ORDER"]);
                }
                organization.SUP_ORG_CODE = Suporganization.ORG_CODE;
                organization.SUP_ORG_NAME = Suporganization.ORG_NAME;


                string ORG_TYPE = HttpContext.Current.Request["ORG_TYPE"];

                if (ORG_TYPE == ORG_TYPE_GQ)
                {
                    organization.ORG_LAYER = Suporganization.ORG_LAYER;
                }
                else
                {
                    organization.ORG_LAYER = Suporganization.ORG_LAYER + 10;
                }


                if (HttpContext.Current.Request["GIS_LON"] != "" && HttpContext.Current.Request["GIS_LON"] != null)
                {
                    organization.GIS_LON = Convert.ToDouble(HttpContext.Current.Request["GIS_LON"]);
                }
                if (HttpContext.Current.Request["GIS_LAT"] != "" && HttpContext.Current.Request["GIS_LAT"] != null)
                {
                    organization.GIS_LAT = Convert.ToDouble(HttpContext.Current.Request["GIS_LAT"]);
                }
                organization.IS_MODIFY_ALLOWED = "1";
                rs = ServiceAccessor.GetFoundationService().organizationAdd(organization) ? "1" : "-1";

                if (rs == "1")
                {
                    Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "组织机构", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "添加了组织机构" + orgCode + HttpContext.Current.Request["ORG_NAME"], "", true);
                }
                else
                {
                    Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "组织机构", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "添加了组织机构" + orgCode + HttpContext.Current.Request["ORG_NAME"], "", false);
                }
                
            }
            else
            {
                rs = "-2";
            }
        }
        catch
        {
            rs = "-1";
        }
        finally
        {
            HttpContext.Current.Response.Write(rs);

        }
    }

    /// <summary>
    /// 根据组织机构code获取type
    /// </summary>
    /// <param name="code"></param>
    private void getOrganizationTypeByCode()
    {
        string rs = "";
        string code = HttpContext.Current.Request["Code"];
        if (code != null && code != "")
        {
            Organization organization = ServiceAccessor.GetFoundationService().queryOrganizationByCode(code);
            SysDictionaryCond sysDictionaryCond = new SysDictionaryCond();
            sysDictionaryCond.CODE_NAME = organization.ORG_TYPE;
            IList<SysDictionary> sysdictionarylist = ServiceAccessor.GetFoundationService().querySysDictionary(sysDictionaryCond);
            sysDictionaryCond.CODE_NAME = null;
            rs = sysdictionarylist[0].DIC_CODE;
        }
        else
        {
            rs = "ORG";
        }

        HttpContext.Current.Response.Write(rs);

    }

    /// <summary>
    /// 修改
    /// </summary>
    private void getUpdate()
    {
        bool str = false;
        try
        {
            string id = HttpContext.Current.Request["id"].Replace("organization", "");
            Organization organization = ServiceAccessor.GetFoundationService().queryOrganization(id);
            organization.ORG_CODE = HttpContext.Current.Request["ORG_CODE"];
            organization.ORG_NAME = HttpContext.Current.Request["ORG_NAME"];
            organization.LINK_MAN = HttpContext.Current.Request["LINK_MAN"];
            organization.LINK_TEL = HttpContext.Current.Request["LINK_TEL"];
            organization.ORG_ADDR = HttpContext.Current.Request["ORG_ADDR"];
            organization.POSTCODE = HttpContext.Current.Request["POSTCODE"];
            organization.ORG_DEGREE = HttpContext.Current.Request["ORG_DEGREE"];
            if (HttpContext.Current.Request["ORG_ORDER"] != "")
            {
                organization.ORG_ORDER = Convert.ToUInt32(HttpContext.Current.Request["ORG_ORDER"]);
            }
            organization.GIS_LON = Convert.ToDouble(HttpContext.Current.Request["GIS_LON"]);
            organization.GIS_LAT = Convert.ToDouble(HttpContext.Current.Request["GIS_LAT"]);
            str = ServiceAccessor.GetFoundationService().organizationUpdate(organization);

            if (str)
            {
                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "组织机构", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "修改了组织机构" + HttpContext.Current.Request["ORG_CODE"] + HttpContext.Current.Request["ORG_NAME"], "", true);
            }
            else
            {
                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "组织机构", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "修改了组织机构" + HttpContext.Current.Request["ORG_CODE"] + HttpContext.Current.Request["ORG_NAME"], "", false);
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
            string id = HttpContext.Current.Request["id"].Replace("organization", "");
            str = ServiceAccessor.GetFoundationService().organizationDelete(id);

            if (str)
            {
                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "组织机构", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "删除了组织机构" + HttpContext.Current.Request["id"], "", true);
            }
            else
            {
                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "组织机构", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "删除了组织机构" + HttpContext.Current.Request["id"], "", false);
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
    /// 刷新缓存
    /// </summary>
    private void orgRefresh()
    {
        string str = "1";
        try
        {
            Api.Util.Common.InitOrganization(Api.ServiceAccessor.GetFoundationService());
        }
        catch (Exception ex)
        {
            str = "0";
        }
        finally
        {
            HttpContext.Current.Response.Write(str);
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