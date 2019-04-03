<%@ WebHandler Language="C#" Class="SubstationControl" %>

using System;
using System.Web;
using Api.Foundation.entity.Foundation;
using System.Collections.Generic;
using Api.Foundation.service;
using Api;
using Api.Foundation.entity.Cond;
using System.Linq;
using System.Text;

public class SubstationControl : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        string type = context.Request["type"];
        switch (type)
        {
            //查询所有
            case "all":
                GetAll();
                break;
            //添加变电所
            case "add":
                Add();
                break;
            //修改变电所
            case "update":
                Update();
                break;
            //删除变电所
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
        string id = HttpContext.Current.Request["id"];
        string rs = "1";
        try
        {
            rs = ServiceAccessor.GetFoundationService().substationDelete(id) ? "1" : "-1";
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
    /// 修改
    /// </summary>
    private void Update()
    {
        string rs = "1";
        try
        {
            string id = HttpContext.Current.Request["id"];

            Substation substation = ServiceAccessor.GetFoundationService().querySubstation(id);

            //substation.SUBSTATION_NAME = HttpContext.Current.Request.Form["SUBSTATION_NAME"];
            //substation.SUBSTATION_TYPE = HttpContext.Current.Request.Form["SUBSTATION_TYPE"];
            if (HttpContext.Current.Request.Form["BUREAU_CODE"] != "0")
            {
                substation.BUREAU_NAME = HttpContext.Current.Request.Form["BUREAU_NAME"];
                substation.BUREAU_CODE = HttpContext.Current.Request.Form["BUREAU_CODE"];
            }
            if (HttpContext.Current.Request.Form["POWER_SECTION_CODE"] != "0")
            {
                substation.POWER_SECTION_NAME = HttpContext.Current.Request.Form["POWER_SECTION_NAME"];
                substation.POWER_SECTION_CODE = HttpContext.Current.Request.Form["POWER_SECTION_CODE"];

            }
            if (HttpContext.Current.Request.Form["WORKSHOP_CODE"] != "0")
            {
                substation.WORKSHOP_NAME = HttpContext.Current.Request.Form["WORKSHOP_NAME"];
                substation.WORKSHOP_CODE = HttpContext.Current.Request.Form["WORKSHOP_CODE"];

            }
            if (HttpContext.Current.Request.Form["ORG_CODE"] != "0")
            {
                substation.ORG_NAME = HttpContext.Current.Request.Form["ORG_NAME"];
                substation.ORG_CODE = HttpContext.Current.Request.Form["ORG_CODE"];
            }
            //substation.LINE_NAME = HttpContext.Current.Request.Form["LINE_NAME"];
            //substation.LINE_CODE = HttpContext.Current.Request.Form["LINE_CODE"];
            if (HttpContext.Current.Request.Form["POSITION_CODE"] != "0")
            {
                substation.POSITION_NAME = HttpContext.Current.Request.Form["POSITION_NAME"];
                substation.POSITION_CODE = HttpContext.Current.Request.Form["POSITION_CODE"];
            }
            string GIS_LAT = HttpContext.Current.Request.Form["GIS_LAT"];
            if (!String.IsNullOrEmpty(GIS_LAT))
                substation.GIS_LAT = Convert.ToDouble(GIS_LAT);

            string GIS_LON = HttpContext.Current.Request.Form["GIS_LON"];
            if (!String.IsNullOrEmpty(GIS_LON))
                substation.GIS_LON = Convert.ToDouble(GIS_LON);

            //substation.SUBSTATION_NO = HttpContext.Current.Request.Form["SUBSTATION_NO"];
            substation.MONITOR_PLACE = HttpContext.Current.Request.Form["MONITOR_PLACE"];

            string KM_MARK_SX = HttpContext.Current.Request.Form["KM_MARK_SX"];
            if (!String.IsNullOrEmpty(KM_MARK_SX))
                substation.KM_MARK_SX = Convert.ToInt32(KM_MARK_SX);

            string KM_MARK_XX = HttpContext.Current.Request.Form["KM_MARK_XX"];
            if (!String.IsNullOrEmpty(KM_MARK_XX))
                substation.KM_MARK_XX = Convert.ToInt32(KM_MARK_XX);

            //substation.INF_VERSION = HttpContext.Current.Request.Form["INF_VERSION"];

            substation.NOTE = HttpContext.Current.Request.Form["NOTE"];

            rs = ServiceAccessor.GetFoundationService().substationUpdate(substation) ? "1" : "-1";
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
    /// 增加
    /// </summary>
    private void Add()
    {
        string rs = "1";
        try
        {
            Substation substation = new Substation();

            string LINE_CODE = HttpContext.Current.Request.Form["LINE_CODE"];
            string SUBSTATION_NO = HttpContext.Current.Request.Form["SUBSTATION_NO"];

            string STTYPE = HttpContext.Current.Request.Form["SUBSTATION_TYPE"];
            //string SUBSTATION_TYPE_NAME = HttpContext.Current.Request.Form["SUBSTATION_TYPE_NAME"];
            string SUBSTATION_NAME_CODE = HttpContext.Current.Request.Form["SUBSTATION_NAME_CODE"];

            substation.SUBSTATION_CODE = LINE_CODE + "$" + SUBSTATION_NAME_CODE + "$" + SUBSTATION_NO.PadLeft(3, '0') + "$" + STTYPE;

            SubstationCond sc = new SubstationCond();
            sc.SUBSTATION_CODE = substation.SUBSTATION_CODE;

            Substation sb = ServiceAccessor.GetFoundationService().querySubstationBySubstationCode(substation.SUBSTATION_CODE);
            if (String.IsNullOrEmpty(sb.ID))
            {
                substation.SUBSTATION_NAME = HttpContext.Current.Request.Form["SUBSTATION_NAME"];
                if (HttpContext.Current.Request.Form["SUBSTATION_TYPE"] != "0")
                    substation.SUBSTATION_TYPE = HttpContext.Current.Request.Form["SUBSTATION_TYPE_NAME"];
                if (HttpContext.Current.Request.Form["BUREAU_CODE"] != "0")
                {
                    substation.BUREAU_NAME = HttpContext.Current.Request.Form["BUREAU_NAME"];
                    substation.BUREAU_CODE = HttpContext.Current.Request.Form["BUREAU_CODE"];
                }
                if (HttpContext.Current.Request.Form["POWER_SECTION_CODE"] != "0")
                {
                    substation.POWER_SECTION_NAME = HttpContext.Current.Request.Form["POWER_SECTION_NAME"];
                    substation.POWER_SECTION_CODE = HttpContext.Current.Request.Form["POWER_SECTION_CODE"];

                }
                if (HttpContext.Current.Request.Form["WORKSHOP_CODE"] != "0")
                {
                    substation.WORKSHOP_NAME = HttpContext.Current.Request.Form["WORKSHOP_NAME"];
                    substation.WORKSHOP_CODE = HttpContext.Current.Request.Form["WORKSHOP_CODE"];
                }
                if (HttpContext.Current.Request.Form["ORG_CODE"] != "0")
                {
                    substation.ORG_NAME = HttpContext.Current.Request.Form["ORG_NAME"];
                    substation.ORG_CODE = HttpContext.Current.Request.Form["ORG_CODE"];
                }
                if (HttpContext.Current.Request.Form["LINE_CODE"] != "0")
                {
                    substation.LINE_NAME = HttpContext.Current.Request.Form["LINE_NAME"];
                    substation.LINE_CODE = HttpContext.Current.Request.Form["LINE_CODE"];
                }
                if (HttpContext.Current.Request.Form["POSITION_CODE"] != "0")
                {
                    substation.POSITION_NAME = HttpContext.Current.Request.Form["POSITION_NAME"];
                    substation.POSITION_CODE = HttpContext.Current.Request.Form["POSITION_CODE"];
                }

                string GIS_LAT = HttpContext.Current.Request.Form["GIS_LAT"];
                if (!String.IsNullOrEmpty(GIS_LAT))
                    substation.GIS_LAT = Convert.ToDouble(GIS_LAT);

                string GIS_LON = HttpContext.Current.Request.Form["GIS_LON"];
                if (!String.IsNullOrEmpty(GIS_LON))
                    substation.GIS_LON = Convert.ToDouble(GIS_LON);

                substation.SUBSTATION_NO = HttpContext.Current.Request.Form["SUBSTATION_NO"];
                substation.MONITOR_PLACE = HttpContext.Current.Request.Form["MONITOR_PLACE"];

                string KM_MARK_SX = HttpContext.Current.Request.Form["KM_MARK_SX"];
                if (!String.IsNullOrEmpty(KM_MARK_SX))
                    substation.KM_MARK_SX = Convert.ToInt32(KM_MARK_SX);

                string KM_MARK_XX = HttpContext.Current.Request.Form["KM_MARK_XX"];
                if (!String.IsNullOrEmpty(KM_MARK_XX))
                    substation.KM_MARK_XX = Convert.ToInt32(KM_MARK_XX);

                //substation.INF_VERSION = HttpContext.Current.Request.Form["INF_VERSION"];

                substation.NOTE = HttpContext.Current.Request.Form["NOTE"];

                rs = ServiceAccessor.GetFoundationService().substationAdd(substation) ? "1" : "-1";
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
    /// 获取所有用户
    /// </summary>
    private void GetAll()
    {
        //获取前台页码
        int pageIndex = Convert.ToInt32(HttpContext.Current.Request["page"]);
        //获取前台条数
        int pageSize = Convert.ToInt32(HttpContext.Current.Request["rp"]);
        SubstationCond cond = new SubstationCond();
        cond.pageNum = pageIndex;
        cond.pageSize = pageSize;


        string BUREAU = HttpContext.Current.Request["BUREAU"];
        string SECTION = HttpContext.Current.Request["SECTION"];
        string LINE = HttpContext.Current.Request["LINE"];
        string NAME = HttpContext.Current.Request["NAME"];
        string CODE = HttpContext.Current.Request["CODE"];
        string TREETYPE = HttpContext.Current.Request["TREETYPE"];
        string PID = HttpContext.Current.Request["PID"];
        if (!String.IsNullOrEmpty(BUREAU) && BUREAU != "0") cond.BUREAU_CODE = BUREAU;
        if (!String.IsNullOrEmpty(SECTION) && SECTION != "0") cond.POWER_SECTION_CODE = SECTION;
        if (!String.IsNullOrEmpty(LINE) && LINE != "0") cond.LINE_CODE = LINE;
        if (!String.IsNullOrEmpty(NAME)) cond.businssAnd = " SUBSTATION_NAME like '%" + NAME + "%'";
        //if (!String.IsNullOrEmpty(NAME)) cond.SUBSTATION_NAME = NAME;
        if (!String.IsNullOrEmpty(CODE))
        {
            switch (TREETYPE)
            {
                case "J":
                    cond.BUREAU_CODE = CODE;
                    break;
                case "GDD":
                    cond.POWER_SECTION_CODE = CODE;
                    break;
                case "SUBSTATIONTYPE":
                    cond.POWER_SECTION_CODE = PID;
                    cond.SUBSTATION_TYPE = CODE;
                    break;
                case "SUBSTATION":
                    cond.SUBSTATION_CODE = CODE;
                    break;

            }
        }
        IList<Substation> list = ServiceAccessor.GetFoundationService().querySubstation(cond);

        //获取总条数
        int recordCount = ServiceAccessor.GetFoundationService().getSubstationCount(cond);

        StringBuilder sb = new StringBuilder();

        sb.Append("{\"rows\":[");
        foreach (Substation s in list)
        {

            string url = "<a  href=javascript:updateSubstationModal(" + s.ID + ")>修改</a>&nbsp;<a href=javascript:deleteSubstation(" + s.ID + ")>删除</a>";

            sb.AppendFormat("{{\"id\":\"{0}\",\"SUBSTATION_CODE\":\"{1}\",\"SUBSTATION_NO\":\"{2}\",\"SUBSTATION_NAME\":\"{3}\",\"SUBSTATION_TYPE\":\"{4}\",",
                            s.ID, s.SUBSTATION_CODE, s.SUBSTATION_NO, s.SUBSTATION_NAME, s.SUBSTATION_TYPE);
            sb.AppendFormat("\"BUREAU_NAME\":\"{0}\",\"BUREAU_CODE\":\"{1}\",\"POWER_SECTION_NAME\":\"{2}\",\"POWER_SECTION_CODE\":\"{3}\",\"WORKSHOP_NAME\":\"{4}\",\"WORKSHOP_CODE\":\"{5}\",",
                            s.BUREAU_NAME, s.BUREAU_CODE, s.POWER_SECTION_NAME, s.POWER_SECTION_CODE, s.WORKSHOP_NAME, s.WORKSHOP_CODE);
            sb.AppendFormat("\"ORG_NAME\":\"{0}\",\"ORG_CODE\":\"{1}\",\"LINE_NAME\":\"{2}\",\"LINE_CODE\":\"{3}\",\"POSITION_NAME\":\"{4}\",",
                             s.ORG_NAME, s.ORG_CODE, s.LINE_NAME, s.LINE_CODE, s.POSITION_NAME);
            sb.AppendFormat("\"POSITION_CODE\":\"{0}\",\"GIS_LAT\":\"{1}\",\"GIS_LON\":\"{2}\",\"MONITOR_PLACE\":\"{3}\",\"KM_MARK_SX\":\"{4}\",",
                            s.POSITION_CODE, s.GIS_LAT, s.GIS_LON, s.MONITOR_PLACE, s.KM_MARK_SX);
            sb.AppendFormat("\"KM_MARK_XX\":\"{0}\",\"INF_VERSION\":\"{1}\",\"NOTE\":\"{2}\",\"cz\":\"{3}\"}},",
                            s.KM_MARK_XX, "", s.NOTE, url);
        }

        string js = sb.ToString();
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