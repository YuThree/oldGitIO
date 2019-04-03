/*========================================================================================*
* 功能说明：组织机构管辖区间页面操作的数据交互
* 注意事项：
* 作    者： zzj
* 版本日期：2014年12月3日
* 变更说明：
* 版 本 号： V1.0
*=======================================================================================*/
<%@ WebHandler Language="C#" Class="DutyRangeControl" %>

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

public class DutyRangeControl : ReferenceClass, IHttpHandler
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
            //删除组织机构
            case "delete":
                getDelete();
                break;
            case "MSave":
                MSave();
                break;
            default:
                break;
        }
    }


    private void MSave()
    {
        bool str = false;
        try
        {
            string code = HttpContext.Current.Request["code"];
            string name = HttpContext.Current.Request["name"];
            string RID = HttpContext.Current.Request["RID"].Replace("-", "");
            string level = HttpContext.Current.Request["level"].ToString();
            string lineCode = HttpContext.Current.Request["lineCode"];
            string start_km = HttpContext.Current.Request["start_km"];
            string end_km = HttpContext.Current.Request["end_km"];
            string direction = HttpContext.Current.Request["direction"];

            DutyRange m = new DutyRange();
            m.ID = RID;
            m.LINE_CODE = lineCode;
            m.ORG_CODE = code;

            if (!string.IsNullOrEmpty(level))
                m.ORG_LEVEL = Convert.ToDouble(level);
            m.ORG_NAME = name;

            if (!string.IsNullOrEmpty(start_km))
                m.START_KM = Convert.ToInt32(start_km);

            if (!string.IsNullOrEmpty(end_km))
                m.END_KM = Convert.ToInt32(end_km); ;
            m.DIRECTION = direction;


            if (string.IsNullOrEmpty(RID))
            {
                
                //添加
                m.ID = Guid.NewGuid().ToString().Replace("-", "");
                str = ServiceAccessor.GetFoundationService().DutyRangeAdd(m);
                if (str)
                {
                    Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "组织管辖", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "添加了新的组织" + name + code, "", true);
                }
                else
                {
                    Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "组织管辖", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "添加了新的组织" + name + code, "", false);
                }
                
            }
            else
            {
                //修改
                str = ServiceAccessor.GetFoundationService().DutyRangeUpdate(m);

                if (str)
                {
                    Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "组织管辖", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "修改了组织" + name + code, "", true);
                }
                else
                {
                    Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "组织管辖", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "修改了组织" + name + code, "", false);
                }
                
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
    /// 获取所有机构
    /// </summary>
    private void getAll()
    {
        int pageIndex = Convert.ToInt32(HttpContext.Current.Request["page"]);
        int pageSize = Convert.ToInt32(HttpContext.Current.Request["rp"]);
        Api.Foundation.entity.Cond.DutyRangeCond cond = new Api.Foundation.entity.Cond.DutyRangeCond();

        cond.pageNum = pageIndex;
        cond.pageSize = pageSize;
        IList<DutyRange> list = new List<DutyRange>();
        cond.businssAnd = "1=1";
        int recordCount = 0;
        if (HttpContext.Current.Request["ORG_NAME"] != null && HttpContext.Current.Request["ORG_NAME"] != "")
        {
            cond.businssAnd += " and ORG_NAME like '%" + HttpContext.Current.Request["ORG_NAME"] + "%'";

        }
        if (HttpContext.Current.Request["CODE"] != null && HttpContext.Current.Request["CODE"] != "undefined" && HttpContext.Current.Request["CODE"] != "")
        {
            cond.businssAnd += " and ORG_CODE like '%" + HttpContext.Current.Request["CODE"] + "%'";
        }


        list = ServiceAccessor.GetFoundationService().queryDutyRange(cond);
        recordCount = ServiceAccessor.GetFoundationService().getDutyRangeCount(cond);


        StringBuilder sb = new StringBuilder();
        sb.Append("{\"rows\":[");

        foreach (DutyRange dr in list)
        {
            string url = "";
            if (PublicMethod.buttonControl("OrganizationList.htm", "UPDATE"))
            {
                url += "<a  href=javascript:MModal(organization" + dr.ID + ")>修改</a>&nbsp;";
            }
            if (PublicMethod.buttonControl("OrganizationList.htm", "DELETE"))
            {
                url += "<a href=javascript:deleteOrganization(organization" + dr.ID + ")>删除</a>";
            }

            string lineName = Api.Util.Common.getLineInfo(dr.LINE_CODE).LINE_NAME;

            sb.AppendFormat("{{\"ORG_NAME\":\"{0}\",\"cz\":\"{1}\",\"ORG_CODE\":\"{2}\",\"id\":\"organization{3}\",\"RID\":\"{3}\",\"org_level\":\"{4}\",\"line_Name\":\"{5}\",\"line_code\":\"{6}\",\"start_km\":\"{7}\",\"end_km\":\"{8}\",\"direction\":\"{9}\"}},",
                dr.ORG_NAME, url, dr.ORG_CODE, dr.ID, dr.ORG_LEVEL, lineName, dr.LINE_CODE, dr.START_KM, dr.END_KM, dr.DIRECTION);
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
    /// 删除
    /// </summary>
    private void getDelete()
    {
        bool str = false;
        try
        {
            string id = HttpContext.Current.Request["id"];
            str = ServiceAccessor.GetFoundationService().DutyRangeDelete(id);

            if (str)
            {
                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "组织管辖", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "删除了组织" + id, "", true);
            }
            else
            {
                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "组织管辖", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "删除了组织" + id, "", false);
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