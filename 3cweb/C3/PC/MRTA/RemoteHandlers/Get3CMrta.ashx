<%@ WebHandler Language="C#" Class="Get3CMrta" %>

using System;
using System.Web;
using System.Text;
using Newtonsoft.Json;
using System.Data;
using Api.Util;
using Api.Fault.entity.alarm;
using System.Collections.Generic;
using Api.Fault.entity.sms;
using Api.Foundation.entity.Cond;
using Api.Foundation.entity.Foundation;
using Api.Foundation.service;
using Api;
using Api.SysManagement.Security.entity;
using System.Linq;

public class Get3CMrta : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {

        string type = HttpContext.Current.Request["Type"];
        switch (type)
        {
            case "org":
                GetOrgList();
                break;
            case "line":
                GetLineList();
                break;
            case "loco":
                GetLocoList();
                break;
            default:
                break;
        }

    }

    private static void GetOrgList()
    {
        try
        {
            string orgType = "总公司";// Public.GetDeptType;
            string html = "";

            if (orgType == "总公司")
            {
                html += "";
                html += " <a href='#' onclick='SetTsysOrg(\"" + orgType + "\",\"" + orgType + "\",\"" + orgType + "\")'>铁路总公司</a><br/>";


                IList<Organization> orgList = new List<Organization>();
                OrganizationCond org = new OrganizationCond();
                org.ORG_TYPE = "局";
                orgList = Api.ServiceAccessor.GetFoundationService().queryOrganization(org);
                for (int i = 0; i < orgList.Count; i++)
                {
                    html += " <a href='#' onclick='SetTsysOrg(\"" + orgList[i].ORG_NAME + "\",\"" + orgList[i].ORG_CODE + "\",\"" + orgList[i].ORG_TYPE + "\")'>" + orgList[i].ORG_NAME + "</a><br/>";

                    OrganizationCond orgDuan = new OrganizationCond();
                    orgDuan.SUP_ORG_CODE = orgList[i].ORG_CODE;
                    Organization Duanorg = Api.Util.Common.getSupOrgInfo(orgList[i].ORG_CODE);//.ServiceAccessor.GetFoundationService().queryOrganization(orgDuan);

                    if (Duanorg != null)
                    {
                        html += " <a href='#' onclick='SetTsysOrg(\"" + Duanorg.ORG_NAME + "\",\"" + Duanorg.ORG_CODE + "\",\"" + Duanorg.ORG_TYPE + "\")'> " + Duanorg.ORG_NAME + "</a><br/>";

                    }
                }





            }
            else if (orgType == "局")
            {

            }
            else
            {

            }

            HttpContext.Current.Response.Write(html);


        }
        catch (Exception)
        {

            throw;
        }
    }

    private static void GetLineList()
    {
        try
        {
            string html = "";
            string OrgCode = HttpContext.Current.Request["OrgCode"];
            string OrgType = HttpContext.Current.Request["OrgType"];
            LineCond lincode = new LineCond();
            if (OrgCode == "")
            {
                OrgCode = Public.GetDeptCode;
                OrgType = Public.GetDeptType;
            }
            switch (OrgType)
            {
                case "J":
                    lincode.BUREAU_CODE = OrgCode;
                    break;
                //case "供电段":
                //    lincode.POWER_SECTION_CODE = OrgCode;
                //    break;
                //case "机务段":
                //    lincode.P_ORG_CODE = OrgCode;
                //    break;
                default:
                    break;
            }
            lincode.IS_SHOW = "1";
            lincode.orderBy = "LINE_NO";
            // IList<Line> lineList = Api.ServiceAccessor.GetFoundationService().queryLine(lincode);


            //因为与查询列表的线路数不一致 该走统一的缓存机制
            IList<Line> lineList = new List<Line>();
            if (Api.Util.Public.IsPowerSectionUser())
            {

                var   poslinelist = from n in Api.Util.Common.lineDic.Values
                                    where n.ORG_CODE != null && Api.Util.Public.IsHavePermisson_orgCode(n.ORG_CODE)
                                    orderby n.LINE_NO
                                    select n;

                lineList = poslinelist.ToList<Line>();
            }
            else
            {
                //车辆用户，不筛选线路。

                var   poslinelist = from n in Api.Util.Common.lineDic.Values
                                        //  where n.ORG_CODE != null && Api.Util.Public.IsHavePermisson_orgCode(n.ORG_CODE)
                                    orderby n.LINE_NO
                                    select n;

                lineList = poslinelist.ToList<Line>();
            }





            if (lineList.Count > 0)
            {
                html += " <a href='#' onclick='SetMisLine(\"" + "" + "\",\"" + "" + "\")'>" + "全部" + "</a><br/>";
            }
            for (int i = 0; i < lineList.Count; i++)
            {

                if (lineList[i].BUREAU_CODE != null && !Api.Util.Public.IsHavePermisson_orgCode_BUREAU(lineList[i].BUREAU_CODE))
                {
                    continue;
                }
                if (string.IsNullOrEmpty(lineList[i].ORG_CODE))
                {
                    continue;
                }
                html += " <a href='#' onclick='SetMisLine(\"" + lineList[i].LINE_NAME + "\",\"" + lineList[i].LINE_CODE + "\")'>" + lineList[i].LINE_NAME + "</a><br/>";
            }
            if (html == "")
            {
                html = "<h3>当前组织没有线路信息<h3>";
            }
            HttpContext.Current.Response.Write(html);


        }
        catch (Exception ex)
        {
            log4net.ILog log2 = log4net.LogManager.GetLogger("GetLineList");
            log2.Error("GetLineList", ex);
        }
    }

    private static void GetLocoList()
    {
        try
        {
            string html = "";
            html += " <a href='#' onclick='SetMisLoco(\"" + "" + "\",\"" + "" + "\")'>----全部----</a><br/>";
            html += " <a href='#' onclick='SetMisLoco(\"" + "动车" + "\",\"" + "1" + "\")'><img style='width:30px;height:35px; margin-top:10px;' align='absmiddle' src='/Common/MRTA/img/动车.png' />动车</a><br/>";
            html += " <a href='#' onclick='SetMisLoco(\"" + "机车" + "\",\"" + "0" + "\")'><img style='width:30px;height:35px; margin-top:10px; ' align='absmiddle' src='/Common/MRTA/img/机车.png' />机车</a><br/>";

            HttpContext.Current.Response.Write(html);


        }
        catch (Exception ex)
        {
            log4net.ILog log2 = log4net.LogManager.GetLogger("GetLocoList");
            log2.Error("GetLocoList", ex);
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