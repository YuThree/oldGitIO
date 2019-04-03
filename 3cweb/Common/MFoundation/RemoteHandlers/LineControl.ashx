<%@ WebHandler Language="C#" Class="LineControl" %>

using System;
using System.Web;
using Api.Foundation.entity.Cond;
using Api.Foundation.entity.Foundation;
using System.Collections.Generic;
using Api.Foundation.service;
using Api;
using Api.Util;
using System.Text;
using System.Linq;

public class LineControl : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        string type = context.Request["type"];
        switch (type)
        {
            //查询所有设备
            case "all":
                GetAll();
                break;
            //添加线路
            case "add":
                Add(context);
                break;
            //修改线路
            case "update":
                Update(context);
                break;
            //删除线路
            case "delete":
                Delete();
                break;
            case "verify":
                verify("context");
                break;
        }
    }
    /// <summary>
    /// 删除
    /// </summary>
    private void Delete()
    {
        //PublicMethod.SysDataBackUp("MIS_LINE", "MIS_LINE_OPT", HttpContext.Current.Request["ID"]);
        bool str = ServiceAccessor.GetFoundationService().lineDelete(HttpContext.Current.Request["ID"]);
        HttpContext.Current.Response.Write(str ? "1" : "-1");

        if (str)
        {
            Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "线路管理", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "线路管理删除了线路" + HttpContext.Current.Request["ID"], "", true);
        }
        else
        {
            Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "线路管理", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "线路管理删除了线路" + HttpContext.Current.Request["ID"], "", false);
        }
    }
    /// <summary>
    /// 修改
    /// </summary>
    private void Update(HttpContext context)
    {
        bool str = false;
        try
        {
            Line line = Api.ServiceAccessor.GetFoundationService().queryLine(context.Request["id"]);
            line.LINE_NAME = context.Request.Form["LineName"];
            line.LINE_CODE = context.Request.Form["LINE_CODE"];
            string line_no = context.Request.Form["LINE_NO"].ToString();
            if (!String.IsNullOrEmpty(line_no))
                line.LINE_NO = int.Parse(line_no);
            line.LINE_TYPE = context.Request.Form["LINE_TYPE"];
            line.DIRECTION = context.Request.Form["DIRECTION"];
            line.BUREAU_CODE = context.Request.Form["BUREAU_CODE"];
            line.BUREAU_NAME = context.Request.Form["BUREAU_NAME"];

            if (!String.IsNullOrEmpty(context.Request.Form["GIS_CENTER_LON"]))
                line.GIS_CENTER_LON = Convert.ToDouble(context.Request.Form["GIS_CENTER_LON"]);
            if (!String.IsNullOrEmpty(context.Request.Form["GIS_CENTER_LAT"]))
                line.GIS_CENTER_LAT = Convert.ToDouble(context.Request.Form["GIS_CENTER_LAT"]);
            line.START_KM = PublicMethod.KmToString(HttpContext.Current.Request["StartKm"]);
            line.END_KM = Convert.ToDouble(PublicMethod.KmToString(HttpContext.Current.Request["EndKm"]));
            line.START_STATION_CODE = HttpContext.Current.Request["ddlPositionStart"];
            line.END_STATION_CODE = HttpContext.Current.Request["ddlPositionEnd"];
            line.IS_SHOW = HttpContext.Current.Request["IS_SHOW"];
            try { line.OPT_MLG = Convert.ToUInt32(HttpContext.Current.Request["OperationMile"]); }
            catch (Exception) { line.OPT_MLG = 0; }
            line.SPD_DGR = HttpContext.Current.Request["SPEED_DGR"];
            line.LN_DGR = HttpContext.Current.Request["LINE_DGR"];
            try { line.OPN_DT = Convert.ToDateTime(HttpContext.Current.Request["OPEN_DATE"]); }
            catch (Exception) { line.OPN_DT = DateTime.Now; }///电化开通日期
            line.PW_SPLY_MD = HttpContext.Current.Request["PowerMethod"].Replace("（","(").Replace("）",")");//供电方式
            line.CTNR_TP = HttpContext.Current.Request["HangType"];
            line.PRPT_DPTMT = HttpContext.Current.Request["Department"];
            line.OTH_DESC = HttpContext.Current.Request["OTHER"];

            //line.OPT_ACTION = "修改";
            //line.OPT_PERSON = Api.Util.Public.GetPersonName;
            //line.OPT_TIME = DateTime.Now;
            //line.OPT_IP = Api.Util.Public.GetLoginIP;
            //line.OPT_ID = PublicMethod.SysDataBackUp("MIS_LINE", "MIS_LINE_OPT", line.ID);
            str = ServiceAccessor.GetFoundationService().lineUpdate(line);

            if (str)
            {
                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "线路管理", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "线路管理修改了线路" + context.Request.Form["LineName"] + context.Request.Form["LINE_CODE"], "", true);
            }
            else
            {
                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "线路管理", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "线路管理修改了线路" + context.Request.Form["LineName"] + context.Request.Form["LINE_CODE"], "", false);
            }

        }
        catch
        {
            str = false;
        }
        HttpContext.Current.Response.Write(str ? "1" : "-1");


    }
    /// <summary>
    /// 增加
    /// </summary>
    private void Add(HttpContext context)
    {
        string rs = "";
        if (verify("") == "1")
        { }
        else
        {
            try
            {
                Line line = new Line();
                line.IS_MODIFY_ALLOWED = "1";
                line.LINE_NAME = context.Request.Form["LineName"];
                line.LINE_CODE = context.Request.Form["LINE_CODE"];
                //if (String.IsNullOrEmpty(ServiceAccessor.GetFoundationService().getLineByCode(line.LINE_CODE).ID))
                //{
                line.LINE_TYPE = context.Request.Form["LINE_TYPE"];
                string line_no = context.Request.Form["LINE_NO"].ToString();
                if (!String.IsNullOrEmpty(line_no))
                    line.LINE_NO = int.Parse(line_no);
                line.DIRECTION = context.Request.Form["DIRECTION"];
                line.BUREAU_CODE = context.Request.Form["BUREAU_CODE"];
                line.BUREAU_NAME = context.Request.Form["BUREAU_NAME"];
                if (!String.IsNullOrEmpty(context.Request.Form["GIS_CENTER_LON"]))
                    line.GIS_CENTER_LON = Convert.ToDouble(context.Request.Form["GIS_CENTER_LON"]);
                if (!String.IsNullOrEmpty(context.Request.Form["GIS_CENTER_LAT"]))
                    line.GIS_CENTER_LAT = Convert.ToDouble(context.Request.Form["GIS_CENTER_LAT"]);
                if (!string.IsNullOrEmpty(HttpContext.Current.Request["StartKm"]))
                    line.START_KM = Convert.ToDouble(HttpContext.Current.Request["StartKm"]);
                if (!string.IsNullOrEmpty(HttpContext.Current.Request["EndKm"]))
                    line.END_KM = Convert.ToDouble(HttpContext.Current.Request["EndKm"]);
                line.START_STATION_CODE = HttpContext.Current.Request["ddlPositionStart"];
                line.END_STATION_CODE = HttpContext.Current.Request["ddlPositionEnd"];
                line.IS_SHOW = HttpContext.Current.Request["IS_SHOW"];
                if (!string.IsNullOrEmpty(HttpContext.Current.Request["OperationMile"]))
                    line.OPT_MLG = Convert.ToDouble(HttpContext.Current.Request["OperationMile"]);
                line.SPD_DGR = HttpContext.Current.Request["SPEED_DGR"];
                line.LN_DGR = HttpContext.Current.Request["LINE_DGR"];
                try { line.OPN_DT = Convert.ToDateTime(HttpContext.Current.Request["OPEN_DATE"]); }
                catch (Exception) { line.OPN_DT = new DateTime(); }
                line.PW_SPLY_MD = HttpContext.Current.Request["PowerMethod"].Replace("（","(").Replace("）",")");//供电方式
                line.CTNR_TP = HttpContext.Current.Request["HangType"];
                line.PRPT_DPTMT = HttpContext.Current.Request["Department"];
                line.OTH_DESC = HttpContext.Current.Request["OTHER"];
                rs = ServiceAccessor.GetFoundationService().lineAdd(line) ? "1" : "-1";

                if (rs == "1")
                {
                    Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "线路管理", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "线路管理添加了新的线路" + context.Request.Form["LineName"] + context.Request.Form["LINE_CODE"], "", true);
                }
                else
                {
                    Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "线路管理", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "线路管理添加了新的线路" + context.Request.Form["LineName"] + context.Request.Form["LINE_CODE"], "", false);
                }
                //}
                //else
                //{
                //    rs = "-2";
                //}
            }
            catch (Exception EX)
            {
                rs = "-1";
            }
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

        //条件
        LineCond cond = new LineCond();
        cond.pageNum = pageIndex;
        cond.pageSize = pageSize;

        //cond.IS_SHOW = "1";
        //if (!String.IsNullOrEmpty(HttpContext.Current.Request["select1"]))
        //{
        //    cond.IS_SHOW = HttpContext.Current.Request["select1"];
        //}
        if (!String.IsNullOrEmpty(HttpContext.Current.Request["LINE_NAME"]))
            cond.businssAnd = "LINE_NAME like '%" + HttpContext.Current.Request["LINE_NAME"] + "%'";
        if (!String.IsNullOrEmpty(HttpContext.Current.Request["DIRECTION"]))
            cond.DIRECTION = HttpContext.Current.Request["DIRECTION"];
        if (!String.IsNullOrEmpty(HttpContext.Current.Request["LINE_TYPE"]))
            cond.LINE_TYPE = HttpContext.Current.Request["LINE_TYPE"];
        if (!String.IsNullOrEmpty(HttpContext.Current.Request["SPEED_DGR"]))//速度等级
            cond.SPD_DGR = HttpContext.Current.Request["SPEED_DGR"];
        if (!String.IsNullOrEmpty(HttpContext.Current.Request["LINE_DGR"]))//线路等级
            cond.LN_DGR = HttpContext.Current.Request["LINE_DGR"];
        if (!String.IsNullOrEmpty(HttpContext.Current.Request["PowerMethod"]))//供电方式
            cond.PW_SPLY_MD = HttpContext.Current.Request["POWERMETHOD"];
        if (!String.IsNullOrEmpty(HttpContext.Current.Request["HangType"]))//悬挂类型
            cond.CTNR_TP = HttpContext.Current.Request["HangType"];

        cond.orderBy = " LINE_NO";
        //if (!string.IsNullOrEmpty(cond.businssAnd))
        //{
        //    cond.businssAnd += " and ";
        //}
        //     cond.businssAnd = cond.businssAnd + " INSTR（'" + Api.Util.Public.GetUser_DataOrg + "',bureau_code）>0 ";
        IList<Line> list = ServiceAccessor.GetFoundationService().queryLine(cond);

        //获取总条数
        int recordCount = ServiceAccessor.GetFoundationService().getLineCount(cond);

        StringBuilder sb = new StringBuilder();
        sb.Append("{'rows':[");
        foreach (Line l in list)
        {

            string url = "", stationName1 = "", stationName2 = "", operationmile = "", opndate = "";
            DateTime time = new DateTime();

            ///功能修改为前端列表行若获取焦点，则显示修改或删除按钮
            ///不再判断IS_MODIFY_ALLOWED字段
            //if (l.IS_MODIFY_ALLOWED == "1")
            //{
            //    if (PublicMethod.buttonControl("LineList.htm", "UPDATE"))
            //    {
            //        url += "<a  href=javascript:updateLineModal(" + l.ID + ")>修改</a>&nbsp;";
            //    }
            //    if (PublicMethod.buttonControl("LineList.htm", "DELETE"))
            //        url += "<a href=javascript:deleteLine(" + l.ID + ")>删除</a>";

            //}

            if (!string.IsNullOrEmpty(l.START_STATION_CODE))
            {
                StationSection m_s1 = Api.Util.Common.getStationSectionInfo(l.START_STATION_CODE);
                if (m_s1 != null) stationName1 = m_s1.POSITION_NAME;
            }
            if (!string.IsNullOrEmpty(l.END_STATION_CODE))
            {
                StationSection m_s1 = Api.Util.Common.getStationSectionInfo(l.END_STATION_CODE);
                if (m_s1 != null) stationName2 = m_s1.POSITION_NAME;
            }

            if (!string.IsNullOrEmpty(l.OPT_MLG.ToString()) && l.OPT_MLG.ToString() != "0")//运营历程异常值
                operationmile = l.OPT_MLG.ToString();
            if (!string.IsNullOrEmpty(l.OPN_DT.ToString()) && l.OPN_DT != time)
                opndate = l.OPN_DT.Year.ToString() + "年" + l.OPN_DT.Month.ToString() + "月" + l.OPN_DT.Day.ToString() + "日";

            string startKm = "", endKm = "";
            try { startKm = PublicMethod.KmtoString(Convert.ToInt32(l.START_KM)); } catch (Exception ex) { startKm = ""; }
            try { endKm = PublicMethod.KmtoString(Convert.ToInt32(l.END_KM)); } catch (Exception ex) { endKm = ""; }

            sb.AppendFormat(@"{{'LINE_NAME':'{0}','DIRECTION':'{1}','BUREAU_NAME':'{2}',
                                    'BUREAU_CODE':'{3}','IS_SHOW':'{4}','LINETYPE':'{5}',
                                    'START_KM':'{6}','START_KM_YS':'{7}','END_KM':'{8}',
                                    'END_KM_YS':'{9}','LINE_CODE':'{10}','START_STATION_CODE':'{11}',
                                    'END_STATION_CODE':'{12}','START_STATION_NAME':'{13}','END_STATION_NAME':'{14}',
'CZ':'{15}','ID':'{16}','LINE_NO':'{17}','SPEED_DGR':'{18}','LINE_DGR':'{19}','OPEN_DATE':'{20}','OperationMile':'{21}','PowerMethod':'{22}','HangType':'{23}','Department':'{24}','OTHER':'{25}'}},",
                        l.LINE_NAME, l.DIRECTION, l.BUREAU_NAME,
                        l.BUREAU_CODE, l.IS_SHOW, l.LINE_TYPE, startKm
                        , l.START_KM, endKm,
                        l.END_KM, l.LINE_CODE, l.START_STATION_CODE,
                        l.END_STATION_CODE, stationName1, stationName2,
                        url, l.ID, l.LINE_NO, l.SPD_DGR, l.LN_DGR, opndate, operationmile, l.PW_SPLY_MD, l.CTNR_TP, l.PRPT_DPTMT, l.OTH_DESC);
        }

        string js = sb.ToString();
        if (js.LastIndexOf(',') > -1)
        {
            js = js.Substring(0, js.LastIndexOf(','));
        }
        js += String.Format("],'page':{0},'rp':{1},'total':{2}}}", pageIndex, pageSize, recordCount);
        js = myfiter.json_RemoveSpecialStr(js);

        HttpContext.Current.Response.Write(js);

    }
    /// <summary>
    /// 添加功能即时验证
    /// </summary>
    /// <param name="type"></param>
    /// <returns></returns>
    public string verify(string type)
    {
        string linecode = HttpContext.Current.Request.Form["LINE_CODE"];
        string sql = "SELECT COUNT(1) FROM MIS_LINE WHERE LINE_CODE = '" + linecode + "'";
        string result = DbHelperOra_ADO.Exists(sql) ? "1" : "-1";
        if (type == "context")
        {
            //string json =string.Format( "{\"verify_result\":\"{0}\"}",result);
            //HttpContext.Current.Response.Write(json);
            HttpContext.Current.Response.Write(result);
        }
        return result;
    }
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}