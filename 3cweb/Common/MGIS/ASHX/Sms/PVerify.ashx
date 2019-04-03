<%@ WebHandler Language="C#" Class="PVerify" %>

using System;
using System.Web;
using System.Text;
using Newtonsoft.Json;
using System.Data;
using Api.Util;
using System.Collections.Generic;
using Api.Foundation.entity.Cond;
using Api.Foundation.entity.Foundation;

public class PVerify : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        string mess = "";
        try
        {
            String ju = context.Request.QueryString["ju"].ToString();
            String jwd = context.Request.QueryString["jwd"].ToString();
            String line = context.Request.QueryString["line"].ToString();
            String XB = context.Request.QueryString["XB"].ToString();

            String pointlon1 = context.Request.QueryString["pointlon1"].ToString();
            String pointlon3 = context.Request.QueryString["pointlon3"].ToString();
            String pointlat1 = context.Request.QueryString["pointlat1"].ToString();
            String pointlat3 = context.Request.QueryString["pointlat3"].ToString();
            String tpye = context.Request.QueryString["type"].ToString();
            String _type = context.Request.QueryString["_type"].ToString();
            if (tpye == "Pole")
            {
                if (_type == "delete")
                {
                    DeletePole(ju, jwd, line, XB, pointlon1, pointlon3, pointlat1, pointlat3, "MIS_POLE", "MIS_POLE_BAK");
                }
                else
                {
                    String _ju = context.Request.QueryString["_ju"].ToString();
                    String _jwd = context.Request.QueryString["_jwd"].ToString();
                    String _line = context.Request.QueryString["_line"].ToString();
                    String _XB = context.Request.QueryString["_XB"].ToString();
                    String _Position = context.Request.QueryString["_Position"].ToString();
                    UpdatePole(ju, jwd, line, XB, _ju, _jwd, _line, _XB, _Position, pointlon1, pointlon3, pointlat1, pointlat3);

                }
            }
            else if (tpye == "INFO")
            {
                if (_type == "delete")
                {
                    DeleteInfo(ju, jwd, line, XB, pointlon1, pointlon3, pointlat1, pointlat3, "LOCATION_INFO", "LOCATION_INFO_BAK");
                }
                else if (_type == "SetPY")
                {
                    UpdateInfoPY(ju, jwd, line, XB, pointlon1, pointlon3, pointlat1, pointlat3);
                }
                else if (_type == "SetHFPY")
                {
                    UpdateInfoHFPY(ju, jwd, line, XB, pointlon1, pointlon3, pointlat1, pointlat3);
                }
                else
                {
                    String _ju = context.Request.QueryString["_ju"].ToString();
                    String _jwd = context.Request.QueryString["_jwd"].ToString();
                    String _line = context.Request.QueryString["_line"].ToString();
                    String _XB = context.Request.QueryString["_XB"].ToString();
                    String _Position = context.Request.QueryString["_Position"].ToString();
                    UpdateInfo(ju, jwd, line, XB, pointlon1, pointlon3, pointlat1, pointlat3, _ju, _line, _XB, _Position, _jwd);
                }

            }
            else if (tpye == "INFO_BAK")
            {
                DeleteInfo(ju, jwd, line, XB, pointlon1, pointlon3, pointlat1, pointlat3, "LOCATION_INFO_BAK", "LOCATION_INFO");
            }
            else if (tpye == "Pole_BAK")
            {
                DeletePole(ju, jwd, line, XB, pointlon1, pointlon3, pointlat1, pointlat3, "MIS_POLE_BAK", "MIS_POLE");
            }
            mess = "成功";
        }
        catch (Exception)
        {
            mess = "失败";
            //throw;
        }
        context.Response.ContentType = "text/plain";
        context.Response.Write(mess);
    }

    private static void UpdateInfoPY(String ju, String jwd, String line, String XB, String pointlon1, String pointlon3, String pointlat1, String pointlat3)
    {
        string updateSql = " update LOCATION_INFO set EXCEPTION_DATA_TYPE='数据偏移' ";




        updateSql += " where 1=1 ";
        if (ju != "0")
        {
            updateSql += " and bureau_code='" + ju + "'";
        }

        if (line != "0")
        {
            updateSql += " and line_code='" + line + "'";
        }
        if (XB != "")
        {
            updateSql += " and direction='" + XB + "'";
        }
        if (Convert.ToDouble(pointlon1) >= Convert.ToDouble(pointlon3))
        {
            if (Convert.ToDouble(pointlat1) >= Convert.ToDouble(pointlat3))
                updateSql = GetPoit(pointlon1, pointlon3, pointlat1, pointlat3, updateSql);
            else
                updateSql = GetPoit(pointlon1, pointlon3, pointlat1, pointlat3, updateSql);
        }
        else
        {
            if (Convert.ToDouble(pointlat1) >= Convert.ToDouble(pointlat3))
                updateSql = GetPoit(pointlon3, pointlon1, pointlat1, pointlat3, updateSql);
            else
                updateSql = GetPoit(pointlon3, pointlon1, pointlat3, pointlat1, updateSql);
        }


        object u = DbHelperOra.GetSingle(updateSql);

        Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "验证工具", Api.Util.Public.FunNames.缺陷监控.ToString(), Public.GetLoginIP, "验证工具中设置了偏移数据", "", true);
    }

    private static void UpdateInfoHFPY(String ju, String jwd, String line, String XB, String pointlon1, String pointlon3, String pointlat1, String pointlat3)
    {
        string updateSql = " update LOCATION_INFO set EXCEPTION_DATA_TYPE='' ";




        updateSql += " where 1=1 and EXCEPTION_DATA_TYPE ='数据偏移' ";
        if (ju != "0")
        {
            updateSql += " and bureau_code='" + ju + "'";
        }

        if (line != "0")
        {
            updateSql += " and line_code='" + line + "'";
        }
        if (XB != "")
        {
            updateSql += " and direction='" + XB + "'";
        }
        if (Convert.ToDouble(pointlon1) >= Convert.ToDouble(pointlon3))
        {
            if (Convert.ToDouble(pointlat1) >= Convert.ToDouble(pointlat3))
                updateSql = GetPoit(pointlon1, pointlon3, pointlat1, pointlat3, updateSql);
            else
                updateSql = GetPoit(pointlon1, pointlon3, pointlat1, pointlat3, updateSql);
        }
        else
        {
            if (Convert.ToDouble(pointlat1) >= Convert.ToDouble(pointlat3))
                updateSql = GetPoit(pointlon3, pointlon1, pointlat1, pointlat3, updateSql);
            else
                updateSql = GetPoit(pointlon3, pointlon1, pointlat3, pointlat1, updateSql);
        }


        object u = DbHelperOra.GetSingle(updateSql);

        Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "验证工具", Api.Util.Public.FunNames.缺陷监控.ToString(), Public.GetLoginIP, "验证工具中设置了正常数据", "", true);
    }

    private static string GetPoit(String pointlon1, String pointlon3, String pointlat1, String pointlat3, string updateSql)
    {
        updateSql += " and GIS_LON>=" + pointlon3 + "";

        updateSql += " and GIS_LON<=" + pointlon1 + "";

        updateSql += " and GIS_LAT<=" + pointlat1 + "";

        updateSql += " and GIS_LAT>=" + pointlat3 + "";
        return updateSql;
    }


    private static void UpdateInfo(String ju, String jwd, String line, String XB, String pointlon1, String pointlon3, String pointlat1, String pointlat3, String _ju, String _line, String _XB, String _Position, String _jwd)
    {
        string updateSql = " update LOCATION_INFO set id=id";
        if (_ju != "0")
        {
            updateSql += ",bureau_code='" + _ju + "'";
            updateSql += ",bureau_name='" + Api.Util.Common.getOrgInfo(_ju).ORG_NAME + "'";
        }
        if (_line != "0")
        {
            updateSql += ",line_code='" + _line + "'";
            updateSql += ",line_name='" + Api.Util.Common.getLineInfo(_line).LINE_NAME + "'";
        }
        if (_XB != "0")
            updateSql += ",direction='" + _XB + "'";
        if (_jwd != "0")
        {
            updateSql += ",power_section_code='" + _jwd + "'";
            updateSql += ",power_section_name='" + Api.Util.Common.getOrgInfo(_jwd).ORG_NAME + "'";
        }
        StationSectionCond sta = new StationSectionCond();
        sta.POSITION_NAME = _Position;
        if (_Position != "")
        {
            IList<StationSection> liststation = Api.Util.Common.getStationSectionInfoFromCache(sta);
            if (liststation.Count > 0)
            {
                updateSql += ",position_code='" + liststation[0].POSITION_CODE + "'";
                updateSql += ",POSITION_NAME='" + liststation[0].POSITION_NAME + "'";
            }
        }
        updateSql += " where 1=1";
        if (ju != "0")
        {
            updateSql += " and bureau_code='" + ju + "'";
        }
        if (jwd != "0")
        {
            //updateSql += " and power_section_code='" + jwd + "'";
        }
        if (line != "0")
        {
            updateSql += " and line_code='" + line + "'";
        }
        if (XB != "")
        {
            updateSql += " and direction='" + XB + "'";
        }
        updateSql += " and gis_lon>=" + pointlon1 + "";

        updateSql += " and gis_lon<=" + pointlon3 + "";

        updateSql += " and gis_lat<=" + pointlat1 + "";

        updateSql += " and gis_lat>=" + pointlat3 + "";

        object u = DbHelperOra.GetSingle(updateSql);

        Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "验证工具", Api.Util.Public.FunNames.缺陷监控.ToString(), Public.GetLoginIP, "验证工具中进行了编辑操作", "", true);
    }

    private static void UpdatePole(String ju, String jwd, String line, String XB, String _ju, String _jwd, String _line, String _XB, String _Position, String pointlon1, String pointlon3, String pointlat1, String pointlat3)
    {
        string updateSql = " update mis_pole set alarm_count=alarm_count ";

        if (_ju != "0")
            updateSql += ",bureau_code='" + _ju + "'";
        if (_jwd != "0")
            updateSql += ",power_section_code='" + _jwd + "'";
        if (_line != "0")
            updateSql += ",line_code='" + _line + "'";
        if (_XB != "0")
            updateSql += ",pole_direction='" + _XB + "'";

        StationSectionCond sta = new StationSectionCond();
        sta.POSITION_NAME = _Position;
        if (_Position != "")
        {
            IList<StationSection> liststation = Api.Util.Common.getStationSectionInfoFromCache(sta);
            if (liststation.Count > 0)
            {
                updateSql += ",position_code='" + liststation[0].POSITION_CODE + "'";
            }
        }
        updateSql += " where 1=1 ";
        if (ju != "0")
        {
            updateSql += " and bureau_code='" + ju + "'";
        }
        if (jwd != "0")
        {
            updateSql += " and power_section_code='" + jwd + "'";
        }
        if (line != "0")
        {
            updateSql += " and line_code='" + line + "'";
        }
        if (XB != "0")
        {
            updateSql += " and pole_direction='" + XB + "'";
        }
        updateSql += " and GIS_LON_CALC>=" + pointlon1 + "";

        updateSql += " and GIS_LON_CALC<=" + pointlon3 + "";

        updateSql += " and GIS_LAT_CALC<=" + pointlat1 + "";

        updateSql += " and GIS_LAT_CALC>=" + pointlat3 + "";

        object u = DbHelperOra.GetSingle(updateSql);
    }
    /// <summary>
    /// 批量删除定位数据
    /// </summary>
    /// <param name="ju"></param>
    /// <param name="jwd"></param>
    /// <param name="line"></param>
    /// <param name="XB"></param>
    /// <param name="pointlon1"></param>
    /// <param name="pointlon3"></param>
    /// <param name="pointlat1"></param>
    /// <param name="pointlat3"></param>
    private static void DeleteInfo(String ju, String jwd, String line, String XB, String pointlon1, String pointlon3, String pointlat1, String pointlat3, String table1, String table2)
    {
        string sql = "select * from " + table1 + " where 1=1 ";
        if (ju != "0")
        {
            sql += " and bureau_code='" + ju + "'";
        }
        if (jwd != "0")
        {
            // sql += " and t.power_section_code='" + jwd + "'";
        }
        if (line != "0")
        {
            sql += " and line_code='" + line + "'";
        }
        if (XB != "0")
        {
            sql += " and direction='" + XB + "'";
        }
        sql += " and GIS_LON>=" + pointlon1 + "";

        sql += " and GIS_LON<=" + pointlon3 + "";

        sql += " and GIS_LAT<=" + pointlat1 + "";

        sql += " and GIS_LAT>=" + pointlat3 + "";
        DataSet ds = DbHelperOra.Query(sql);
        string updatesql = " begin ";
        for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
        {
            updatesql = updatesql + GetInsertSql(ds, updatesql, i, table2) + ";\n";

        }
        updatesql += " end;";
        if (ds.Tables[0].Rows.Count > 0)
        {
            object u = DbHelperOra.GetSingle(updatesql);
        }
        string deleteSql = " delete from " + table1 + " where 1=1";
        if (ju != "0")
        {
            deleteSql += " and bureau_code='" + ju + "'";
        }
        if (jwd != "0")
        {
            // deleteSql += " and t.power_section_code='" + jwd + "'";
        }
        if (line != "0")
        {
            deleteSql += " and line_code='" + line + "'";
        }
        if (XB != "0")
        {
            deleteSql += " and direction='" + XB + "'";
        }
        deleteSql += " and GIS_LON_B>=" + pointlon1 + "";

        deleteSql += " and GIS_LON_B<=" + pointlon3 + "";

        deleteSql += " and GIS_LAT_B<=" + pointlat1 + "";

        deleteSql += " and GIS_LAT_B>=" + pointlat3 + "";
        object d = DbHelperOra.GetSingle(deleteSql);
    }

    private static string GetInsertSql(DataSet ds, string updatesql, int i, String table2)
    {
        updatesql = "insert into " + table2 + " values('" + ds.Tables[0].Rows[i]["C3_SMS_ID"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["CROSSING_NO"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["GIS_X"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["GIS_Y"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["KM_MARK"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["STATION_NO"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["BUREAU_CODE"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["LINE_CODE"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["DIRECTION"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["POSITION_CODE"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["GIS_LON"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["GIS_LAT"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["GIS_LON_B"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["GIS_LAT_B"].ToString() + "')";
        return updatesql;
    }
    /// <summary>
    /// 批量删除支柱
    /// </summary>
    /// <param name="ju"></param>
    /// <param name="jwd"></param>
    /// <param name="line"></param>
    /// <param name="XB"></param>
    /// <param name="pointlon1"></param>
    /// <param name="pointlon3"></param>
    /// <param name="pointlat1"></param>
    /// <param name="pointlat3"></param>
    private static void DeletePole(String ju, String jwd, String line, String XB, String pointlon1, String pointlon3, String pointlat1, String pointlat3, String table1, String table2)
    {
        string sql = "select * from " + table1 + " where 1=1 ";
        if (ju != "0")
        {
            sql += " and bureau_code='" + ju + "'";
        }
        if (jwd != "0")
        {
            sql += " and power_section_code='" + jwd + "'";
        }
        if (line != "0")
        {
            sql += " and line_code='" + line + "'";
        }
        if (XB != "0")
        {
            sql += " and pole_direction='" + XB + "'";
        }
        sql += " and GIS_LON_CALC>=" + pointlon1 + "";

        sql += " and GIS_LON_CALC<=" + pointlon3 + "";

        sql += " and GIS_LAT_CALC>=" + pointlat3 + "";

        sql += " and GIS_LAT_CALC<=" + pointlat1 + "";
        DataSet ds = DbHelperOra.Query(sql);
        string updatesql = " begin ";
        for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
        {

            updatesql = updatesql + GetUpdateSql(ds, i, updatesql, table2) + ";\n";
        }
        updatesql += " end;";
        if (ds.Tables[0].Rows.Count > 0)
        {
            object u = DbHelperOra.GetSingle(updatesql);
        }
        string deleteSql = " delete from " + table1 + " where 1=1 ";
        if (ju != "0")
        {
            deleteSql += " and bureau_code='" + ju + "'";
        }
        if (jwd != "0")
        {
            deleteSql += " and power_section_code='" + jwd + "'";
        }
        if (line != "0")
        {
            deleteSql += " and line_code='" + line + "'";
        }
        if (XB != "0")
        {
            deleteSql += " and pole_direction='" + XB + "'";
        }

        deleteSql += " and GIS_LON_CALC>=" + pointlon1 + "";

        deleteSql += " and GIS_LON_CALC<=" + pointlon3 + "";

        deleteSql += " and GIS_LAT_CALC<=" + pointlat1 + "";

        deleteSql += " and GIS_LAT_CALC>=" + pointlat3 + "";
        object d = DbHelperOra.GetSingle(deleteSql);

    }

    private static string GetUpdateSql(DataSet ds, int i, string updatesql, String table2)
    {
        updatesql = "insert into " + table2 + " values('" + ds.Tables[0].Rows[i]["ID"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["POLE_CODE"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["POLE_NO"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["POLE_ORDER"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["LINE_CODE"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["POSITION_CODE"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["BRG_TUN_CODE"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["MD_CODE"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["ORG_CODE"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["POLE_TYPE"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["POLE_DIRECTION"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["INSTALL_IMG_NO"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["INSTALL_TIME"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["POLE_USAGE"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["STRUCTURE_HEIGHT"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["GEOGRAPHY_NAME"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["KMSTANDARD"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["SIDE_LIMIT_CX"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["CURVE_RADIUS"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["RAILFACE_HIGH"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["CURVE_DIRECTION"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["POLE_BASIC_TYPE"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["IS_FILLED"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["FILLING_HEIGHT"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["WIRE_DESIGN_HEIGHT"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["WIRE_LIMIT_HEIGHT"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["DESIGN_PULLING_VALUE"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["LIMIT_PULLING_VALUE"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["COMPS_PROPORTION"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["POLE_ZT_TYPE"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["POLE_STATUS"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["NOTE"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["POLE_CLS_BCBL"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["POLE_IMG"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["LOCATING_METHOD"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["GIS_LON"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["GIS_LAT"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["GIS_LON_CALC"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["GIS_LAT_CALC"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["POLE_CLSA"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["POLE_CLSB"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["POLE_JCXA"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["POLE_JCXB"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["PULLOUT_VA"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["PULLOUT_VB"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["PROC_ENV_TYPE"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["PROC_ENVIRONMENT"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["PROC_POSITION_TYPE"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["PROC_SUPPORT_STRU"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["PROC_LOCAL_Z_WAY"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["PROC_EARTHING_WAY"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["SUSPENDED_EPMT"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["WAY_NO"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["BUREAU_CODE"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["POWER_SECTION_CODE"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["WORKSHOP_CODE"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["SUBSTATION_CODE"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["POLE_IMG_C2"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["POLE_IMG_C4"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["ALARM_COUNT"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["FAULT_COUNT"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["SPAN_LENGTH"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["STRONG_LINE"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["PROTECT_LINE"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["POSITIVE_FEEDER"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["POLENO_C2"].ToString() + "')";
        return updatesql;
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}