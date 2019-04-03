/*========================================================================================*
* 功能说明：下拉列表信息
* 注意事项：
* 作    者： 邓杰
* 版本日期：2013年10月21日
* 变更说明：
* 版 本 号： V1.0
*=======================================================================================*/
<%@ WebHandler Language="C#" Class="Select" %>

using System;
using System.Web;
using Api.Foundation.entity.Foundation;
using System.Collections.Generic;
using Api.Foundation.service;
using Api;
using System.Text;
using Api.Foundation.entity.Cond;

public class Select : ReferenceClass, IHttpHandler
{
    /// <summary>
    /// 下拉列表
    /// </summary>
    /// <param name="context"></param>
    public void ProcessRequest(HttpContext context)
    {

        string selectList = "";//返回的下拉列表集合
        string type = context.Request["type"].ToString();//是什么下拉列表类型
        switch (type)
        {
            case "1":
                //线路下拉
                selectList = selectLine(selectList);
                break;
            case "2":
                //线路下的区站
                selectList = getPositionSelect(selectList);
                break;
            case "3":
                //段下的车间
                selectList = getSelectPOrg(selectList);
                break;
            case "4":
                //车间下的工区
                selectList = getSelectOrg(selectList);
                break;
            default:
                break;
        }

        HttpContext.Current.Response.Write(selectList);
        
        

    }
    /// <summary>
    /// 线路和段下拉
    /// </summary>
    private static string selectLine(string selectList)
    {
        Api.Foundation.entity.Cond.LineCond linecode = new Api.Foundation.entity.Cond.LineCond();
        linecode.IS_SHOW = "1";
        IList<Line> lineList = Api.ServiceAccessor.GetFoundationService().queryLine(linecode);
        selectList = "<select id='txtLine' style='width: 135px;' onchange='LineChange2(this.value)'>";
        selectList += "<option value='0'>--全部--</option>";
        foreach (Line line in lineList)
        {
            selectList += "<option value='" + line.LINE_CODE + "'>" + line.LINE_NAME + "</option>";
        }
        selectList += "</select>";
        OrganizationCond orgCond = new OrganizationCond();
        orgCond.ORG_TYPE = "供电段";
        IList<Organization> orgList = ServiceAccessor.GetFoundationService().queryOrganization(orgCond);
        selectList += "$<select id='ddlOrg' style='width: 135px;' onchange='OrgChange3(this.value)'>";
        selectList += "<option value='0'>--全部--</option>";
        foreach (Organization org in orgList)
        {
            selectList += "<option value='" + org.ORG_CODE + "'>" + org.ORG_NAME + "</option>";
        }
        selectList += "</select>";
        return selectList;
    }
    /// <summary>
    /// 线路下的区站
    /// </summary>
    /// <param name="selectList"></param>
    /// <returns></returns>
    private string getPositionSelect(string selectList)
    {
        string lineCode = HttpContext.Current.Request["LINE_CODE"];
        selectList = "<select id='ddlPosition' style='width: 135px;'>";
        StationSectionCond stationCond = new StationSectionCond();
        stationCond.LINE_CODE = lineCode;
        selectList += "<option value='0'>--全部--</option>";
        IList<StationSection> stationList = ServiceAccessor.GetFoundationService().queryStationSection(stationCond);
        foreach (StationSection station in stationList)
        {
            selectList += "<option value='" + station.POSITION_CODE + "'>" + station.POSITION_NAME + "</option>";
        }
        selectList += "</select>";
        return selectList;
    }
    /// <summary>
    /// 段下的车间
    /// </summary>
    /// <param name="selectList"></param>
    private string getSelectPOrg(string selectList)
    {
        string orgCode = HttpContext.Current.Request["ORG_CODE"];
        selectList = "<select id='ddlWorkshop' style='width: 135px;' onchange='OrgChange4(this.value)'>";
        OrganizationCond orgCond = new OrganizationCond();
        orgCond.ORG_TYPE = "供电车间";
        orgCond.SUP_ORG_CODE = orgCode;
        selectList += "<option value='0'>--全部--</option>";
        IList<Organization> orgList = ServiceAccessor.GetFoundationService().queryOrganization(orgCond);
        foreach (Organization org in orgList)
        {
            selectList += "<option value='" + org.ORG_CODE + "'>" + org.ORG_NAME + "</option>";
        }
        selectList += "</select>";
        return selectList;
    }
    /// <summary>
    /// 车间下的工区
    /// </summary>
    /// <param name="selectList"></param>
    private string getSelectOrg(string selectList)
    {
        string orgCode = HttpContext.Current.Request["ORG_CODE"];
        selectList = "<select id='ddlWorkshoporg' style='width: 135px;'>";
        OrganizationCond orgCond = new OrganizationCond();
        orgCond.SUP_ORG_CODE = orgCode;
        selectList += "<option value='0'>--全部--</option>";
        IList<Organization> orgList = ServiceAccessor.GetFoundationService().queryOrganization(orgCond);
        foreach (Organization org in orgList)
        {
            selectList += "<option value='" + org.ORG_CODE + "'>" + org.ORG_NAME + "</option>";
        }
        selectList += "</select>";
        return selectList;
    }
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}