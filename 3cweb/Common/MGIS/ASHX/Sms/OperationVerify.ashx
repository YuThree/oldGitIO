<%@ WebHandler Language="C#" Class="OperationVerify" %>

using System;
using System.Web;
using System.Data;

public class OperationVerify :ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        string mess = "";
        try
        {
            String type = context.Request.QueryString["type"].ToString();
            String _type = context.Request.QueryString["_type"].ToString();
            String id = context.Request.QueryString["id"].ToString();
            if (type == "Pole")
            {
                string sql = "select * from mis_pole where id='" + id + "'";
                DataSet ds = DbHelperOra.Query(sql);
                string updatesql = "";
                if (ds.Tables[0].Rows.Count > 0)
                {
                    updatesql = "insert into MIS_POLE_BAK values('" + ds.Tables[0].Rows[0]["ID"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["POLE_CODE"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["POLE_NO"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["POLE_ORDER"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["LINE_CODE"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["POSITION_CODE"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["BRG_TUN_CODE"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["MD_CODE"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["ORG_CODE"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["POLE_TYPE"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["POLE_DIRECTION"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["INSTALL_IMG_NO"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["INSTALL_TIME"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["POLE_USAGE"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["STRUCTURE_HEIGHT"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["GEOGRAPHY_NAME"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["KMSTANDARD"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["SIDE_LIMIT_CX"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["CURVE_RADIUS"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["RAILFACE_HIGH"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["CURVE_DIRECTION"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["POLE_BASIC_TYPE"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["IS_FILLED"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["FILLING_HEIGHT"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["WIRE_DESIGN_HEIGHT"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["WIRE_LIMIT_HEIGHT"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["DESIGN_PULLING_VALUE"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["LIMIT_PULLING_VALUE"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["COMPS_PROPORTION"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["POLE_ZT_TYPE"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["POLE_STATUS"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["NOTE"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["POLE_CLS_BCBL"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["POLE_IMG"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["LOCATING_METHOD"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["GIS_LON"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["GIS_LAT"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["GIS_LON_CALC"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["GIS_LAT_CALC"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["POLE_CLSA"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["POLE_CLSB"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["POLE_JCXA"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["POLE_JCXB"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["PULLOUT_VA"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["PULLOUT_VB"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["PROC_ENV_TYPE"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["PROC_ENVIRONMENT"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["PROC_POSITION_TYPE"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["PROC_SUPPORT_STRU"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["PROC_LOCAL_Z_WAY"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["PROC_EARTHING_WAY"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["SUSPENDED_EPMT"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["WAY_NO"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["BUREAU_CODE"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["POWER_SECTION_CODE"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["WORKSHOP_CODE"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["SUBSTATION_CODE"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["POLE_IMG_C2"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["POLE_IMG_C4"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["ALARM_COUNT"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["FAULT_COUNT"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["SPAN_LENGTH"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["STRONG_LINE"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["PROTECT_LINE"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["POSITIVE_FEEDER"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["POLENO_C2"].ToString() + "')";
                    object u = DbHelperOra.GetSingle(updatesql);
                }

                if (_type == "update")
                {

                }
                else
                {
                    string deleteSql = " delete from mis_pole where id='" + id + "'";
                    object d = DbHelperOra.GetSingle(deleteSql);
                }
                mess = "成功";
            }
            else
            {
                string sql = "select * from LOCATION_INFO where c3_sms_id='" + id + "'";
                DataSet ds = DbHelperOra.Query(sql);
                string updatesql = "";
                if (ds.Tables[0].Rows.Count > 0)
                {
                    updatesql = "insert into LOCATION_INFO_BAK values('" + ds.Tables[0].Rows[0]["C3_SMS_ID"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["CROSSING_NO"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["GIS_X"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["GIS_Y"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["KM_MARK"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["STATION_NO"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["BUREAU_CODE"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["LINE_CODE"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["DIRECTION"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["POSITION_CODE"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["GIS_LON"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["GIS_LAT"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["GIS_LON_B"].ToString() + "',";
                    updatesql += "'" + ds.Tables[0].Rows[0]["GIS_LAT_B"].ToString() + "')";
                    object u = DbHelperOra.GetSingle(updatesql);

                }
                if (_type == "update")
                {

                }
                else
                {
                    string deleteSql = " delete from LOCATION_INFO where c3_sms_id='" + id + "'";
                    object d = DbHelperOra.GetSingle(deleteSql);

                }
                mess = "成功";
            }
        }
        catch (Exception)
        {
            mess = "失败";
            throw;
        }
        context.Response.ContentType = "text/plain";
        context.Response.Write(mess);
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}