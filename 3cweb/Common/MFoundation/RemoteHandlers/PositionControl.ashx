<%@ WebHandler Language="C#" Class="PositionControl" %>

using System;
using System.Web;
using Api.Foundation.entity.Foundation;
using System.Collections.Generic;
using Api.Foundation.service;
using Api;
using Api.Util;
using Api.Foundation.entity.Cond;
using System.Linq;
using System.Text;

public class PositionControl : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        string type = context.Request["type"];
        switch (type)
        {
            //查询区站
            case "all":
                GetAll();
                break;
            //添加区站
            case "add":
                Add(context);
                break;
            //修改区站
            case "update":
                Update(context);
                break;
            //删除区站
            case "delete":
                Delete();
                break;
            default:
                break;
        }
    }
    /// <summary>
    /// 删除
    /// </summary>
    private void Delete()
    {
        //PublicMethod.SysDataBackUp("MIS_POSITION", "MIS_POSITION_OPT", HttpContext.Current.Request["id"]);
        string rs = ServiceAccessor.GetFoundationService().stationSectionDelete(HttpContext.Current.Request["id"]) ? "1" : "-1";
        HttpContext.Current.Response.Write(rs);

        if (rs == "1")
        {
            Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "区站管理", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "区站管理删除了信息" + HttpContext.Current.Request["id"], "", true);
        }
        else
        {
            Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "区站管理", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "区站管理删除了信息" + HttpContext.Current.Request["id"], "", false);
        }
    }
    /// <summary>
    /// 修改
    /// </summary>
    private void Update(HttpContext context)
    {
        string rs = "1";
        try
        {
            string id = context.Request.QueryString["id"];
            StationSection section = ServiceAccessor.GetFoundationService().getStationSectionById(id);
            section.POSITION_NAME = context.Request.Form["txtPOSITION_NAME"];
            section.LINE_CODE = context.Request.Form["ddlLine"] == "0" ? "" : context.Request.Form["ddlLine"];
            section.LINE_NAME = context.Request.Form["LINE_NAME"];
            section.WORKSHOP_CODE = context.Request.Form["ddlWorkshop"] == "0" ? "" : context.Request.Form["ddlWorkshop"];
            section.WORKSHOP_NAME = context.Request.Form["WORKSHOP_NAME"];
            section.ORG_CODE = context.Request.Form["ddlOrg"] == "0" ? "" : context.Request.Form["ddlOrg"];
            section.ORG_NAME = context.Request.Form["ORG_NAME"];
            //section.POSITION_ORDER = Convert.ToUInt32(HttpContext.Current.Request["txtPOSITION_ORDER"]);

            section.GIS_SHOW = ushort.Parse(HttpContext.Current.Request["ddlGis"]);
            section.POSITION_TYPE = HttpContext.Current.Request["POSITION_TYPE"];

            section.USAGE_STATUS = HttpContext.Current.Request["SECTION_STATE"];

            section.GIS_LAT = double.Parse(HttpContext.Current.Request["txtGIS_Y"]);
            section.GIS_LON = double.Parse(HttpContext.Current.Request["txtGIS_X"]);
            section.POSITION_LENGTH = HttpContext.Current.Request["POSITION_LENGTH"];
            section.IS_SERIOUS_POLLUTED = HttpContext.Current.Request["ISZWR"];
            section.ICON_PATH = HttpContext.Current.Request["ICONPATH"];
            section.NOTE = HttpContext.Current.Request["NOTE"];
            section.START_KM = PublicMethod.KmToString(HttpContext.Current.Request["START_KM"]);
            section.END_KM = PublicMethod.KmToString(HttpContext.Current.Request["END_KM"]);
            if (!string.IsNullOrEmpty(HttpContext.Current.Request["TRCS_NUM"]))
                section.TRCS_NUM = double.Parse(HttpContext.Current.Request["TRCS_NUM"]);
            if (section.POSITION_TYPE == "Q")
            {
                section.POSITION_CODE_PLUS = HttpContext.Current.Request["startStation"] + "*" + HttpContext.Current.Request["endStation"];
            }

            rs = ServiceAccessor.GetFoundationService().stationSectionUpdate(section) ? "1" : "-1";

            if (rs == "1")
            {
                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "区站管理", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "区站管理修改了信息" + context.Request.Form["txtPOSITION_NAME"], "", true);
            }
            else
            {
                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "区站管理", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "区站管理修改了信息" + context.Request.Form["txtPOSITION_NAME"], "", false);
            }

        }
        catch
        {
            rs = "-1";
        }
        HttpContext.Current.Response.Write(rs);


    }
    /// <summary>
    /// 增加
    /// </summary>
    private void Add(HttpContext context)
    {
        string rs = "1";
        try
        {
            string lineCode = context.Request.Form["ddlLine"] == "0" ? "" : context.Request.Form["ddlLine"];
            uint postionOrder = Convert.ToUInt32(HttpContext.Current.Request["txtPOSITION_ORDER"]);

            string code = lineCode + "$" + postionOrder.ToString("00000");

            StationSection s = ServiceAccessor.GetFoundationService().getStationSectionByCode(code);
            if (String.IsNullOrEmpty(s.ID))
            {
                StationSection section = new StationSection();
                section.POSITION_NAME = context.Request.Form["txtPOSITION_NAME"];
                section.LINE_CODE = lineCode;
                section.LINE_NAME = context.Request.Form["LINE_NAME"];

                section.WORKSHOP_CODE = context.Request.Form["ddlWorkshop"] == "0" ? "" : context.Request.Form["ddlWorkshop"];
                section.WORKSHOP_NAME = context.Request.Form["WORKSHOP_NAME"];

                section.ORG_CODE = context.Request.Form["ddlOrg"] == "0" ? "" : context.Request.Form["ddlOrg"];
                section.ORG_NAME = context.Request.Form["ORG_NAME"];

                section.POSITION_ORDER = postionOrder;

                section.GIS_SHOW = ushort.Parse(HttpContext.Current.Request["ddlGis"]);
                section.POSITION_TYPE = HttpContext.Current.Request["POSITION_TYPE"];

                section.USAGE_STATUS = HttpContext.Current.Request["SECTION_STATE"];

                section.GIS_LAT = double.Parse(HttpContext.Current.Request["txtGIS_Y"]);
                section.GIS_LON = double.Parse(HttpContext.Current.Request["txtGIS_X"]);
                section.POSITION_LENGTH = HttpContext.Current.Request["POSITION_LENGTH"];
                section.IS_SERIOUS_POLLUTED = HttpContext.Current.Request["ISZWR"];
                section.ICON_PATH = HttpContext.Current.Request["ICONPATH"];
                section.NOTE = HttpContext.Current.Request["NOTE"];
                if (section.POSITION_TYPE == "Q")
                {
                    section.POSITION_CODE_PLUS = HttpContext.Current.Request["startStation"] + "*" + HttpContext.Current.Request["endStation"];
                }

                section.POSITION_CODE = section.LINE_CODE + "$" + section.POSITION_ORDER.ToString("00000");
                if (!string.IsNullOrEmpty(HttpContext.Current.Request["START_KM"]))
                    section.START_KM = Convert.ToDouble(HttpContext.Current.Request["START_KM"]);
                if (!string.IsNullOrEmpty(HttpContext.Current.Request["END_KM"]))
                    section.END_KM = Convert.ToDouble(HttpContext.Current.Request["END_KM"]);
                if (!string.IsNullOrEmpty(HttpContext.Current.Request["TRCS_NUM"]))
                    section.TRCS_NUM = Convert.ToDouble(HttpContext.Current.Request["TRCS_NUM"]);
                section.IS_MODIFY_ALLOWED = "1";
                rs = ServiceAccessor.GetFoundationService().stationSectionAdd(section) ? "1" : "-1";

                if (rs == "1")
                {
                    Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "区站管理", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "区站管理添加了新的信息" + context.Request.Form["txtPOSITION_NAME"], "", true);
                }
                else
                {
                    Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "区站管理", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "区站管理添加了新的信息" + context.Request.Form["txtPOSITION_NAME"], "", false);
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
        HttpContext.Current.Response.Write(rs);


    }
    /// <summary>
    /// 获取所有用户
    /// </summary>
    private void GetAll()
    {
        //获取前台页码
        int pageIndex = Convert.ToInt32(HttpContext.Current.Request["page"]);
        //获取前台条数
        int pageSize = Convert.ToInt32(HttpContext.Current.Request["rp"]);
        StationSectionCond cond = new StationSectionCond();
        cond.pageNum = pageIndex;
        cond.pageSize = pageSize;
        if (!String.IsNullOrEmpty(HttpContext.Current.Request["POSITION_NAME"]))
        {
            cond.businssAnd = "POSITION_NAME like '%" + HttpContext.Current.Request["POSITION_NAME"] + "%'";
        }

        string lineCode = HttpContext.Current.Request["LINE_CODE"];
        string code = HttpContext.Current.Request["CODE"];
        string treeType = HttpContext.Current.Request["TREETYPE"];
        if (!String.IsNullOrEmpty(lineCode) && lineCode != "0")
        {
            cond.LINE_CODE = HttpContext.Current.Request["LINE_CODE"];
        }
        if (!String.IsNullOrEmpty(code))
        {
            if (treeType == "POSITION")
                cond.POSITION_CODE = code;
            else if (treeType == "LINE")
                cond.LINE_CODE = code;
        }

        //获取list
        IList<StationSection> list = ServiceAccessor.GetFoundationService().queryStationSection(cond);

        //获取总条数
        int recordCount = ServiceAccessor.GetFoundationService().getStationSectionCount(cond);
        StringBuilder sb = new StringBuilder();

        sb.Append("{\"rows\":[");
        foreach (StationSection s in list)
        {
            string url = "";
            //if (s.IS_MODIFY_ALLOWED == "1")
            //{
            //    if (PublicMethod.buttonControl("PositionList.htm", "UPDATE"))
            //    {
            //        url += "<a  href=javascript:updatePositionModal(pos" + s.ID + ")>修改</a>&nbsp;";
            //    }
            //    if (PublicMethod.buttonControl("PositionList.htm", "DELETE"))
            //    {
            //        url += "<a href=javascript:deletePosition(pos" + s.ID + ")>删除</a>";
            //    }
            //}

            string p_type = "";
            if (!string.IsNullOrEmpty(s.POSITION_TYPE))
                p_type = s.POSITION_TYPE == "Q" ? "区" : "站";
            string trcs_num = "";
            if (!string.IsNullOrEmpty(s.TRCS_NUM.ToString()) && s.TRCS_NUM.ToString() != "0")
                trcs_num = s.TRCS_NUM.ToString();

            sb.AppendFormat("{{\"POSITION_CODE\":\"{0}\",\"POSITION_NAME\":\"{1}\",\"LINE_NAME\":\"{2}\",\"POSITION_ORDER\":\"{3}\",\"GIS_SHOW\":\"{4}\",",
                        s.POSITION_CODE, s.POSITION_NAME, s.LINE_NAME, s.POSITION_ORDER, (s.GIS_SHOW == 0 ? "否" : "是"));

            sb.AppendFormat("\"PROC_POSITION_TYPE\":\"{0}\",\"SECTION_STATE\":\"{1}\",\"ORG_CODE\":\"{2}\",\"ORG_NAME\":\"{3}\",\"GIS_Y\":\"{4}\",\"GIS_X\":\"{5}\",",
                            p_type, s.USAGE_STATUS, s.ORG_CODE, s.ORG_NAME, s.GIS_LAT, s.GIS_LON);

            sb.AppendFormat("\"POSITION_LENGTH\":\"{0}\",\"ISZWR\":\"{1}\",\"ICONPATH\":\"{2}\",\"NOTE\":\"{3}\",\"LINE_CODE\":\"{4}\",",
                             s.POSITION_LENGTH, (s.IS_SERIOUS_POLLUTED == "0" ? "否" : "是"), s.ICON_PATH, s.NOTE, s.LINE_CODE);

            sb.AppendFormat("\"WORKSHOP_CODE\":\"{0}\",\"WORKSHOP_NAME\":\"{1}\",\"cz\":\"{2}\",\"POSITION_CODE_PLUS\":\"{3}\",\"id\":\"pos{4}\",",
                            s.WORKSHOP_CODE, s.WORKSHOP_NAME, url, s.POSITION_CODE_PLUS, s.ID);
            sb.AppendFormat("\"START_KM\":\"{0}\",\"END_KM\":\"{1}\",\"TRCS_NUM\":\"{2}\"}},",PublicMethod.KmtoString(Convert.ToInt32(s.START_KM)),PublicMethod.KmtoString(Convert.ToInt32(s.END_KM)),trcs_num);
        }

        string js = myfiter.json_RemoveSpecialStr( sb.ToString());
        if (js.LastIndexOf(',') > -1)
        {
            js = js.Substring(0, js.LastIndexOf(','));
        }
        js += String.Format("],\"page\":{0},\"rp\":{1},\"total\":{2}}}", pageIndex, pageSize, recordCount);

        HttpContext.Current.Response.Write(js);

    }



    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}