<%@ WebHandler Language="C#" Class="Verify" %>

using System;
using System.Web;
using System.Text;
using Newtonsoft.Json;
using System.Data;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using Api.Util;

public class Verify : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        String ju = context.Request.QueryString["ju"].ToString();
        String jwd = context.Request.QueryString["jwd"].ToString();
        String line = context.Request.QueryString["line"].ToString();
        String XB = context.Request.QueryString["XB"].ToString();
        String tpye = context.Request.QueryString["type"].ToString();
        int page = Convert.ToInt32(context.Request.QueryString["page"].ToString());
        if (tpye == "Pole")
        {
            // DeletePole(ju, jwd, line, XB, "73", "135", "10", "54", "MIS_POLE", "MIS_POLE_BAK");
            GetPoleGPS(ju, jwd, line, XB, page, context);
        }
        else if (tpye == "INFO")
        {
            // DeleteInfo(ju, jwd, line, XB, "73", "135", "10", "54", "LOCATION_INFO", "LOCATION_INFO_BAK");
            GetInfoGPS(context, ju, jwd, page, line, XB);

        }
        else if (tpye == "Pole_BAK")
        {
            GetPoleGPS_BAK(ju, jwd, line, XB, page, context);
        }
        else if (tpye == "INFO_BAK")
        {
            GetInfoGPS_BAK(context, ju, jwd, page, line, XB);

        }
        else if (tpye == "Position")
        {
            GetPosition(context, ju, jwd, line, XB);
        }
        else if (tpye == "update")
        {
            UpdateInfo(context);
        }

    }

    private static void UpdateInfo(HttpContext context)
    {
        String txtxb = context.Request.QueryString["txtxb"].ToString();
        String txtkm = context.Request.QueryString["txtkm"].ToString();
        String txtgh = context.Request.QueryString["txtgh"].ToString();
        String txtbh = context.Request.QueryString["txtbh"].ToString();
        String id = context.Request.QueryString["id"].ToString();
        string Updatesql = "UPDATE MIS_POLE SET ";
        Updatesql += "POLE_DIRECTION='" + txtxb + "' ";
        Updatesql += " , KMSTANDARD='" + txtkm + "' ";
        Updatesql += " , POLE_NO='" + txtgh + "' ";

        Updatesql += " WHERE ID='" + id + "'";
        string sql = " SELECT  * FROM MIS_POLE WHERE ID='" + id + "'";
        DataSet ds = DbHelperOra.Query(sql);
        string mess = "";
        if (ds.Tables[0].Rows.Count > 0)
        {
            if (txtbh == ds.Tables[0].Rows[0]["SERIAL_NO"].ToString())
            {
                int n = DbHelperOra.ExecuteSql(Updatesql);
                if (n > 0)
                {
                    mess = "修改成功";
                    Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "验证工具", Api.Util.Public.FunNames.缺陷监控.ToString(), Public.GetLoginIP, "对" + id + "进行了保存", "", true);
                }
                else
                {
                    mess = "修改失败，联系开发！";

                    Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "验证工具", Api.Util.Public.FunNames.缺陷监控.ToString(), Public.GetLoginIP, "对" + id + "进行了保存", "", false);
                }
            }
            else
            {
                string sql1 = " select  * from LOCATION_INFO where line_code='" + ds.Tables[0].Rows[0]["line_code"].ToString() + "'";
                sql1 += " and direction='" + ds.Tables[0].Rows[0]["direction"].ToString() + "' ";
                sql1 += " and SERIAL_NO='" + txtbh + "' ";
                DataSet ds1 = DbHelperOra.Query(sql1);
                if (ds1.Tables[0].Rows.Count > 0)
                {
                    mess = "编号重复！";
                }
            }
        }
        else
        {
            int n = DbHelperOra.ExecuteSql(Updatesql);
            if (n > 0)
            {
                mess = "修改成功";
            }
            else
            {
                mess = "修改失败，联系开发！";
            }
        }

        context.Response.Write(mess);
    }

    private static void GetPosition(HttpContext context, String ju, String jwd, String line, String XB)
    {
        string sql = "select gis_lon,gis_lat,position_name from mis_position where 1=1 and position_type='S' and gis_lon>10 ";
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
            //  sql += " and direction='" + XB + "'";
        }
        DataSet ds = DbHelperOra.Query(sql);
        StringBuilder Json = new StringBuilder();
        Json.Append("[");
        for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
        {
            Json.Append("{");
            Json.Append("gis_lon:\"" + ds.Tables[0].Rows[i]["gis_lon"].ToString() + "\"");
            Json.Append(",");
            Json.Append("gis_lat:\"" + ds.Tables[0].Rows[i]["gis_lat"].ToString() + "\"");
            Json.Append(",");
            Json.Append("position_name:\"" + ds.Tables[0].Rows[i]["position_name"].ToString() + "\"");

            if (i < ds.Tables[0].Rows.Count - 1)
            {
                Json.Append("},");
            }
            else
            {
                Json.Append("}");
            }
        }
        object myObj = JsonConvert.DeserializeObject(Json.ToString());
        context.Response.Write(myObj.ToString());
    }

    private static void GetInfoGPS(HttpContext context, String ju, String jwd, int page, String line, String XB)
    {
        string sql = "";
        sql = "SELECT * FROM (SELECT ROWNUM AS rowno, org.org_name as bureauName,  t.* from  (select * from LOCATION_INFO where 1=1 and gis_lat>0 ";
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
        if (XB != "0" && XB != "")
        {
            sql += " and direction='" + XB + "'";
        }
        sql += " order by line_code,direction,to_number(SERIAL_NO)  ) t ";
        sql += " left join mis_line line on line.line_code=t.line_code";
        sql += " left join mis_position position on position.position_code=t.position_code";
        sql += " left join tsys_org org on org.org_code=t.bureau_code";

        sql += ") table_alias ";
        //sql += " WHERE table_alias.rowno >=" + (page - 1) * 1000 + "and  table_alias.rowno  <= " + page * 1000;
        DataSet ds = DbHelperOra.Query(sql);
        StringBuilder Json = new StringBuilder();
        Json.Append("[");
        int count = 0;
        if (ds.Tables[0].Rows.Count % 1000 > 0)
        {
            count = ds.Tables[0].Rows.Count / 1000 + 1;
        }
        else
        {
            count = ds.Tables[0].Rows.Count / 1000;
        }
        for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
        {
            Json.Append("{");
            if (ds.Tables[0].Rows[i]["gis_lon"].ToString() == "" || ds.Tables[0].Rows[i]["gis_lon"].ToString() == "0")
            {
                //string bPoint = CoordinateConvert.convert2B(ds.Tables[0].Rows[i]["gis_lon"].ToString().ToString(), ds.Tables[0].Rows[i]["gis_lat"].ToString());
                //if (bPoint != null)
                //{
                //    if (bPoint.Split(',')[0] != "0" && judge(bPoint.Split(',')[0]))
                //    {
                //        ds.Tables[0].Rows[i]["gis_lon"] = Convert.ToDouble(bPoint.Split(',')[0]);
                //        ds.Tables[0].Rows[i]["gis_lat"] = Convert.ToDouble(bPoint.Split(',')[1]);
                //        //  string sql1 = "update mis_pole t set t.gis_lon= " + Convert.ToDouble(bPoint.Split(',')[0]) + ", t.gis_lat=" + Convert.ToDouble(bPoint.Split(',')[1]) + " where t.id='" + ds.Tables[0].Rows[i]["id"].ToString() + "' ";
                //        // object c = DbHelperOra.GetSingle(sql1);
                //    }
                //}
                //else
                //{

                ds.Tables[0].Rows[i]["gis_lon"] = ds.Tables[0].Rows[i]["gis_lon_o"];
                ds.Tables[0].Rows[i]["gis_lat"] = ds.Tables[0].Rows[i]["gis_lat_o"];
                //}

            }
            Json.Append("gis_lon:\"" + ds.Tables[0].Rows[i]["gis_lon_o"].ToString() + "\"");
            Json.Append(",");
            Json.Append("gis_lat:\"" + ds.Tables[0].Rows[i]["gis_lat_o"].ToString() + "\"");
            Json.Append(",");
            Json.Append("gis_lon_b:\"" + ds.Tables[0].Rows[i]["gis_lon"].ToString() + "\"");
            Json.Append(",");
            Json.Append("gis_lat_b:\"" + ds.Tables[0].Rows[i]["gis_lat"].ToString() + "\"");
            Json.Append(",");
            Json.Append("id:\"" + ds.Tables[0].Rows[i]["ID"] + "\"");
            Json.Append(",");
            Json.Append("bureauName:\"" + ds.Tables[0].Rows[i]["bureauName"] + "\"");
            Json.Append(",");
            Json.Append("line_name:\"" + ds.Tables[0].Rows[i]["line_name"] + "\"");
            Json.Append(",");
            Json.Append("km_mark:\"" + ds.Tables[0].Rows[i]["km_mark"] + "\"");
            Json.Append(",");
            Json.Append("Count:\"" + count + "\"");
            Json.Append(",");
            Json.Append("POLE_NO:\"" + ds.Tables[0].Rows[i]["POLE_NO"].ToString() + "\"");
            Json.Append(",");
            if (ds.Tables[0].Rows[i]["DIRECTION"].ToString() == "上行")
            {
                if (!string.IsNullOrEmpty(ds.Tables[0].Rows[i]["POLE_NO"].ToString()))
                {
                    try
                    {
                        int y = Convert.ToInt32(ds.Tables[0].Rows[i]["POLE_NO"].ToString()) % 2;
                        if (y == 0)
                        {
                            Json.Append("ISZC:\"" + 0 + "\"");
                            Json.Append(",");
                        }
                        else
                        {
                            Json.Append("ISZC:\"" + 1 + "\"");
                            Json.Append(",");
                        }
                    }
                    catch (Exception)
                    {

                        string str = ds.Tables[0].Rows[i]["POLE_NO"].ToString();
                        string regex = @"(\d+)\D+(\d+.)";
                        string _p = Regex.Replace(str, @"[^\d]*", "");

                        if (_p == "")
                        {
                            Json.Append("ISZC:\"" + 1 + "\"");
                            Json.Append(",");
                        }
                        else
                        {
                            int y = Convert.ToInt32(_p) % 2;
                            if (y == 0)
                            {
                                Json.Append("ISZC:\"" + 0 + "\"");
                                Json.Append(",");
                            }
                            else
                            {
                                Json.Append("ISZC:\"" + 1 + "\"");
                                Json.Append(",");
                            }
                        }
                    }
                }
                else
                {
                    Json.Append("ISZC:\"" + 1 + "\"");
                    Json.Append(",");
                }
            }
            else
            {
                if (!string.IsNullOrEmpty(ds.Tables[0].Rows[i]["POLE_NO"].ToString()))
                {
                    try
                    {
                        int y = Convert.ToInt32(ds.Tables[0].Rows[i]["POLE_NO"].ToString()) % 2;
                        if (y == 0)
                        {
                            Json.Append("ISZC:\"" + 1 + "\"");
                            Json.Append(",");
                        }
                        else
                        {
                            Json.Append("ISZC:\"" + 0 + "\"");
                            Json.Append(",");
                        }
                    }
                    catch (Exception)
                    {
                        string str = ds.Tables[0].Rows[i]["POLE_NO"].ToString();
                        string regex = @"(\d+)\D+(\d+.)";
                        string _p = Regex.Replace(str, @"[^\d]*", "");

                        if (_p == "")
                        {
                            Json.Append("ISZC:\"" + 1 + "\"");
                            Json.Append(",");
                        }
                        else
                        {
                            int y = Convert.ToInt32(_p) % 2;
                            if (y == 0)
                            {
                                Json.Append("ISZC:\"" + 1 + "\"");
                                Json.Append(",");
                            }
                            else
                            {
                                Json.Append("ISZC:\"" + 0 + "\"");
                                Json.Append(",");
                            }
                        }
                    }
                }
                else
                {
                    Json.Append("ISZC:\"" + 1 + "\"");
                    Json.Append(",");
                }
            }
            string WZ = "";
            if (i > 0)
            {
                string lon1 = ds.Tables[0].Rows[i - 1]["gis_lon"].ToString();
                string lat1 = ds.Tables[0].Rows[i - 1]["gis_lat"].ToString();

                string lon2 = ds.Tables[0].Rows[i]["gis_lon"].ToString();
                string lat2 = ds.Tables[0].Rows[i]["gis_lat"].ToString();
                double jl = my_gps.Distance(Convert.ToDouble(lon1), Convert.ToDouble(lat1), Convert.ToDouble(lon2), Convert.ToDouble(lat2));
                WZ = "" + ds.Tables[0].Rows[i]["POLE_NO"].ToString() + "号支柱(" + ds.Tables[0].Rows[i]["SERIAL_NO"].ToString() + ")与相邻的" + ds.Tables[0].Rows[i - 1]["POLE_NO"].ToString() + "号支柱(" + ds.Tables[0].Rows[i - 1]["SERIAL_NO"].ToString() + ")，相距：" + Convert.ToInt32(jl) + "米";
                string csJl = context.Request.QueryString["JL"];
                string xJl = context.Request.QueryString["_JL"];
                if (!string.IsNullOrEmpty(csJl))
                {
                    if (jl > Convert.ToDouble(csJl))
                    {
                        Json.Append("JL:\"" + 1 + "\"");
                        Json.Append(",");

                    }
                    else
                    {
                        Json.Append("JL:\"" + 0 + "\"");
                        Json.Append(",");
                    }
                }
                else
                {
                    Json.Append("JL:\"" + 0 + "\"");
                    Json.Append(",");
                }
                if (!string.IsNullOrEmpty(xJl))
                {
                    if (Convert.ToDouble(xJl) > jl)
                    {
                        Json.Append("XJL:\"" + 1 + "\"");
                        Json.Append(",");
                    }
                    else
                    {
                        Json.Append("XJL:\"" + 0 + "\"");
                        Json.Append(",");
                    }
                }
                else
                {
                    Json.Append("XJL:\"" + 0 + "\"");
                    Json.Append(",");
                }
            }
            else
            {
                Json.Append("JL:\"" + 0 + "\"");
                Json.Append(",");
                Json.Append("XJL:\"" + 0 + "\"");
                Json.Append(",");
            }
            Json.Append("SERIAL_NO:\"" + ds.Tables[0].Rows[i]["SERIAL_NO"] + "\"");
            Json.Append(",");
            Json.Append("position_name:\"" + ds.Tables[0].Rows[i]["position_name"] + "\"");
            Json.Append(",");

            Json.Append("LINE_CODE:\"" + ds.Tables[0].Rows[i]["LINE_CODE"] + "\"");
            Json.Append(",");
            Json.Append("POSITION_CODE:\"" + ds.Tables[0].Rows[i]["POSITION_CODE"] + "\"");
            Json.Append(",");
            Json.Append("BUREAU_CODE:\"" + ds.Tables[0].Rows[i]["BUREAU_CODE"] + "\"");
            Json.Append(",");
            Json.Append("power_section_name:\"" + ds.Tables[0].Rows[i]["power_section_name"] + "\"");
            Json.Append(",");
            Json.Append("CREATE_TIME:\"" + ds.Tables[0].Rows[i]["CREATE_TIME"] + "\"");
            Json.Append(",");
            Json.Append("BRG_TUN_CODE:\"" + ds.Tables[0].Rows[i]["BRG_TUN_CODE"] + "\"");
            Json.Append(",");
            Json.Append("BRG_TUN_NAME:\"" + ds.Tables[0].Rows[i]["BRG_TUN_NAME"] + "\"");
            Json.Append(",");
            Json.Append("FRAME_NO:\"" + ds.Tables[0].Rows[i]["FRAME_NO"] + "\"");
            Json.Append(",");
            Json.Append("EXCEPTION_DATA_TYPE:\"" + ds.Tables[0].Rows[i]["EXCEPTION_DATA_TYPE"] + "\"");
            Json.Append(",");
            Json.Append("WZ:\"" + WZ + "\"");
            Json.Append(",");
            Json.Append("direction:\"" + ds.Tables[0].Rows[i]["direction"] + "\"");
            if (i < ds.Tables[0].Rows.Count - 1)
            {
                Json.Append("},");
            }
            else
            {
                Json.Append("}");
            }
        }
        object myObj = JsonConvert.DeserializeObject(Json.ToString());
        context.Response.Write(myObj.ToString());
    }

    private static void GetInfoGPS_BAK(HttpContext context, String ju, String jwd, int page, String line, String XB)
    {
        string sql = "";
        sql = "SELECT * FROM (SELECT ROWNUM AS rowno, org.org_name as bureauName, line.line_name,position.position_name,  t.* from  (select * from LOCATION_INFO_BAK where 1=1 ";
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
        sql += " order by line_code,direction,to_number(km_mark)  ) t ";
        sql += " left join mis_line line on line.line_code=t.line_code";
        sql += " left join mis_position position on position.position_code=t.position_code";
        sql += " left join tsys_org org on org.org_code=t.bureau_code";

        sql += ") table_alias";
        //sql += " WHERE table_alias.rowno >=" + (page - 1) * 1000 + "and  table_alias.rowno  <= " + page * 1000;
        DataSet ds = DbHelperOra.Query(sql);
        StringBuilder Json = new StringBuilder();
        Json.Append("[");
        int count = 0;
        if (ds.Tables[0].Rows.Count % 1000 > 0)
        {
            count = ds.Tables[0].Rows.Count / 1000 + 1;
        }
        else
        {
            count = ds.Tables[0].Rows.Count / 1000;
        }
        for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
        {
            Json.Append("{");
            if (ds.Tables[0].Rows[i]["gis_lon"].ToString() == "" || ds.Tables[0].Rows[i]["gis_lon"].ToString() == "0")
            {
                //string bPoint = CoordinateConvert.convert2B(ds.Tables[0].Rows[i]["gis_lon"].ToString().ToString(), ds.Tables[0].Rows[i]["gis_lat"].ToString());
                //if (bPoint != null)
                //{
                //    if (bPoint.Split(',')[0] != "0" && judge(bPoint.Split(',')[0]))
                //    {
                //        ds.Tables[0].Rows[i]["gis_lon"] = Convert.ToDouble(bPoint.Split(',')[0]);
                //        ds.Tables[0].Rows[i]["gis_lat"] = Convert.ToDouble(bPoint.Split(',')[1]);
                //        //  string sql1 = "update mis_pole t set t.gis_lon= " + Convert.ToDouble(bPoint.Split(',')[0]) + ", t.gis_lat=" + Convert.ToDouble(bPoint.Split(',')[1]) + " where t.id='" + ds.Tables[0].Rows[i]["id"].ToString() + "' ";
                //        // object c = DbHelperOra.GetSingle(sql1);
                //    }
                //}
                //else
                //{

                ds.Tables[0].Rows[i]["gis_lon"] = ds.Tables[0].Rows[i]["gis_lon_o"];
                ds.Tables[0].Rows[i]["gis_lat"] = ds.Tables[0].Rows[i]["gis_lat_o"];
                //}

            }
            Json.Append("gis_lon:\"" + ds.Tables[0].Rows[i]["gis_lon_o"].ToString() + "\"");
            Json.Append(",");
            Json.Append("gis_lat:\"" + ds.Tables[0].Rows[i]["gis_lat_o"].ToString() + "\"");
            Json.Append(",");
            Json.Append("gis_lon:\"" + ds.Tables[0].Rows[i]["gis_lon"].ToString() + "\"");
            Json.Append(",");
            Json.Append("gis_lat:\"" + ds.Tables[0].Rows[i]["gis_lat"].ToString() + "\"");
            Json.Append(",");
            Json.Append("id:\"" + ds.Tables[0].Rows[i]["C3_SMS_ID"] + "\"");
            Json.Append(",");
            Json.Append("bureauName:\"" + ds.Tables[0].Rows[i]["bureauName"] + "\"");
            Json.Append(",");
            Json.Append("line_name:\"" + ds.Tables[0].Rows[i]["line_name"] + "\"");
            Json.Append(",");
            Json.Append("km_mark:\"" + ds.Tables[0].Rows[i]["km_mark"] + "\"");
            Json.Append(",");
            Json.Append("Count:\"" + count + "\"");
            Json.Append(",");
            Json.Append("position_name:\"" + ds.Tables[0].Rows[i]["position_name"] + "\"");
            Json.Append(",");
            Json.Append("direction:\"" + ds.Tables[0].Rows[i]["direction"] + "\"");
            if (i < ds.Tables[0].Rows.Count - 1)
            {
                Json.Append("},");
            }
            else
            {
                Json.Append("}");
            }
        }
        object myObj = JsonConvert.DeserializeObject(Json.ToString());
        context.Response.Write(myObj.ToString());
    }

    private void GetPoleGPS(String ju, String jwd, String line, String XB, int page, HttpContext context)
    {
        string sql = "";
        sql = "SELECT * FROM (SELECT ROWNUM AS rowno, t.id, t.kmstandard,org.org_name as bureauName,orgs.org_name, line.line_name,position.position_name,t.pole_direction,t.pole_no,t.pole_order, t.gis_lon,t.gis_lat,t.gis_lon_calc,t.gis_lat_calc  from (select * from mis_pole where 1=1 ";
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
        sql += " order by line_code,pole_direction,kmstandard  ) t";
        sql += " left join mis_line line on line.line_code=t.line_code";
        sql += " left join mis_position position on position.position_code=t.position_code";
        sql += " left join tsys_org org on org.org_code=t.bureau_code";
        sql += " left join tsys_org orgs on orgs.org_code=t.power_section_code";
        sql += " where 1=1 and t.gis_lon_calc >73  and t.gis_lon_calc <135 and t.gis_lat_calc>10 and t.gis_lat_calc<54";


        sql += ") table_alias";
        // sql += " WHERE table_alias.rowno >=" + (page - 1) * 1000 + "and  table_alias.rowno  <= " + page * 1000;
        DataSet ds = DbHelperOra.Query(sql);
        StringBuilder Json = new StringBuilder();
        Json.Append("[");
        int count = 0;
        if (ds.Tables[0].Rows.Count % 1000 > 0)
        {
            count = ds.Tables[0].Rows.Count / 1000 + 1;
        }
        else
        {
            count = ds.Tables[0].Rows.Count / 1000;
        }
        for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
        {
            Json.Append("{");
            if (ds.Tables[0].Rows[i]["gis_lon_calc"].ToString() != "" && ds.Tables[0].Rows[i]["gis_lon_calc"].ToString() != "0")
            {
                //string bPoint = CoordinateConvert.convert2B(ds.Tables[0].Rows[i]["gis_lon"].ToString().ToString(), ds.Tables[0].Rows[i]["gis_lat"].ToString());
                //if (bPoint != null)
                //{
                //    if (bPoint.Split(',')[0] != "0" && judge(bPoint.Split(',')[0]))
                //    {
                //        ds.Tables[0].Rows[i]["gis_lon_calc"] = Convert.ToDouble(bPoint.Split(',')[0]);
                //        ds.Tables[0].Rows[i]["gis_lat_calc"] = Convert.ToDouble(bPoint.Split(',')[1]);
                //        //  string sql1 = "update mis_pole t set t.gis_lon_calc= " + Convert.ToDouble(bPoint.Split(',')[0]) + ", t.gis_lat_calc=" + Convert.ToDouble(bPoint.Split(',')[1]) + " where t.id='" + ds.Tables[0].Rows[i]["id"].ToString() + "' ";
                //        // object c = DbHelperOra.GetSingle(sql1);
                //    }
                //}
                //else
                //{

                //  ds.Tables[0].Rows[i]["gis_lon_calc"] = ds.Tables[0].Rows[i]["gis_lon"];
                // ds.Tables[0].Rows[i]["gis_lat_calc"] = ds.Tables[0].Rows[i]["gis_lat"];
                //}

            }
            Json.Append("gis_lon:\"" + ds.Tables[0].Rows[i]["gis_lon"].ToString() + "\"");
            Json.Append(",");
            Json.Append("gis_lat:\"" + ds.Tables[0].Rows[i]["gis_lat"].ToString() + "\"");
            Json.Append(",");
            Json.Append("gis_lon_calc:\"" + ds.Tables[0].Rows[i]["gis_lon_calc"].ToString() + "\"");
            Json.Append(",");
            Json.Append("gis_lat_calc:\"" + ds.Tables[0].Rows[i]["gis_lat_calc"].ToString() + "\"");
            Json.Append(",");
            Json.Append("id:\"" + ds.Tables[0].Rows[i]["id"] + "\"");
            Json.Append(",");
            Json.Append("bureauName:\"" + ds.Tables[0].Rows[i]["bureauName"] + "\"");
            Json.Append(",");
            Json.Append("org_name:\"" + ds.Tables[0].Rows[i]["org_name"] + "\"");
            Json.Append(",");
            Json.Append("line_name:\"" + ds.Tables[0].Rows[i]["line_name"] + "\"");
            Json.Append(",");
            Json.Append("position_name:\"" + ds.Tables[0].Rows[i]["position_name"] + "\"");
            Json.Append(",");
            Json.Append("kmstandard:\"" + ds.Tables[0].Rows[i]["kmstandard"] + "\"");
            Json.Append(",");
            Json.Append("Count:\"" + count + "\"");
            Json.Append(",");
            Json.Append("pole_direction:\"" + ds.Tables[0].Rows[i]["pole_direction"] + "\"");
            Json.Append(",");
            Json.Append("pole_no:\"" + ds.Tables[0].Rows[i]["pole_no"] + "\"");
            if (i < ds.Tables[0].Rows.Count - 1)
            {
                Json.Append("},");
            }
            else
            {
                Json.Append("}");
            }
        }
        object myObj = JsonConvert.DeserializeObject(Json.ToString());
        context.Response.Write(myObj.ToString());
    }


    private void GetPoleGPS_BAK(String ju, String jwd, String line, String XB, int page, HttpContext context)
    {
        string sql = "";
        sql = "SELECT * FROM (SELECT ROWNUM AS rowno, t.id, t.kmstandard,org.org_name as bureauName,orgs.org_name, line.line_name,position.position_name,t.pole_direction,t.pole_no,t.pole_order, t.gis_lon,t.gis_lat,t.gis_lon_calc,t.gis_lat_calc  from (select * from mis_pole_BAK where 1=1 ";
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
        sql += " order by line_code,pole_direction,kmstandard  ) t";
        sql += " left join mis_line line on line.line_code=t.line_code";
        sql += " left join mis_position position on position.position_code=t.position_code";
        sql += " left join tsys_org org on org.org_code=t.bureau_code";
        sql += " left join tsys_org orgs on orgs.org_code=t.power_section_code";
        sql += " where 1=1 and t.gis_lon_calc >73  and t.gis_lon_calc <135 and t.gis_lat_calc>10 and t.gis_lat_calc<54";


        sql += ") table_alias";
        // sql += " WHERE table_alias.rowno >=" + (page - 1) * 1000 + "and  table_alias.rowno  <= " + page * 1000;
        DataSet ds = DbHelperOra.Query(sql);
        StringBuilder Json = new StringBuilder();
        Json.Append("[");
        int count = 0;
        if (ds.Tables[0].Rows.Count % 1000 > 0)
        {
            count = ds.Tables[0].Rows.Count / 1000 + 1;
        }
        else
        {
            count = ds.Tables[0].Rows.Count / 1000;
        }
        for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
        {
            Json.Append("{");
            if (ds.Tables[0].Rows[i]["gis_lon_calc"].ToString() != "" && ds.Tables[0].Rows[i]["gis_lon_calc"].ToString() != "0")
            {
                //string bPoint = CoordinateConvert.convert2B(ds.Tables[0].Rows[i]["gis_lon"].ToString().ToString(), ds.Tables[0].Rows[i]["gis_lat"].ToString());
                //if (bPoint != null)
                //{
                //    if (bPoint.Split(',')[0] != "0" && judge(bPoint.Split(',')[0]))
                //    {
                //        ds.Tables[0].Rows[i]["gis_lon_calc"] = Convert.ToDouble(bPoint.Split(',')[0]);
                //        ds.Tables[0].Rows[i]["gis_lat_calc"] = Convert.ToDouble(bPoint.Split(',')[1]);
                //        //  string sql1 = "update mis_pole t set t.gis_lon_calc= " + Convert.ToDouble(bPoint.Split(',')[0]) + ", t.gis_lat_calc=" + Convert.ToDouble(bPoint.Split(',')[1]) + " where t.id='" + ds.Tables[0].Rows[i]["id"].ToString() + "' ";
                //        // object c = DbHelperOra.GetSingle(sql1);
                //    }
                //}
                //else
                //{

                //  ds.Tables[0].Rows[i]["gis_lon_calc"] = ds.Tables[0].Rows[i]["gis_lon"];
                // ds.Tables[0].Rows[i]["gis_lat_calc"] = ds.Tables[0].Rows[i]["gis_lat"];
                //}

            }
            Json.Append("gis_lon:\"" + ds.Tables[0].Rows[i]["gis_lon"].ToString() + "\"");
            Json.Append(",");
            Json.Append("gis_lat:\"" + ds.Tables[0].Rows[i]["gis_lat"].ToString() + "\"");
            Json.Append(",");
            Json.Append("gis_lon_calc:\"" + ds.Tables[0].Rows[i]["gis_lon_calc"].ToString() + "\"");
            Json.Append(",");
            Json.Append("gis_lat_calc:\"" + ds.Tables[0].Rows[i]["gis_lat_calc"].ToString() + "\"");
            Json.Append(",");
            Json.Append("id:\"" + ds.Tables[0].Rows[i]["id"] + "\"");
            Json.Append(",");
            Json.Append("bureauName:\"" + ds.Tables[0].Rows[i]["bureauName"] + "\"");
            Json.Append(",");
            Json.Append("org_name:\"" + ds.Tables[0].Rows[i]["org_name"] + "\"");
            Json.Append(",");
            Json.Append("line_name:\"" + ds.Tables[0].Rows[i]["line_name"] + "\"");
            Json.Append(",");
            Json.Append("position_name:\"" + ds.Tables[0].Rows[i]["position_name"] + "\"");
            Json.Append(",");
            Json.Append("kmstandard:\"" + ds.Tables[0].Rows[i]["kmstandard"] + "\"");
            Json.Append(",");
            Json.Append("Count:\"" + count + "\"");
            Json.Append(",");
            Json.Append("pole_direction:\"" + ds.Tables[0].Rows[i]["pole_direction"] + "\"");
            Json.Append(",");
            Json.Append("pole_no:\"" + ds.Tables[0].Rows[i]["pole_no"] + "\"");
            if (i < ds.Tables[0].Rows.Count - 1)
            {
                Json.Append("},");
            }
            else
            {
                Json.Append("}");
            }
        }
        object myObj = JsonConvert.DeserializeObject(Json.ToString());
        context.Response.Write(myObj.ToString());
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
        sql += " and GIS_LON_CALC<=" + pointlon1 + "";

        sql += " and GIS_LON_CALC>=" + pointlon3 + "";

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

        deleteSql += " and GIS_LON_CALC<=" + pointlon1 + "";

        deleteSql += " and GIS_LON_CALC>=" + pointlon3 + "";

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
        sql += " and ( GIS_LON_o<=" + pointlon1 + "";

        sql += " or GIS_LON_o>=" + pointlon3 + "";

        sql += " or GIS_LAT<=" + pointlat1 + "";

        sql += " or GIS_LAT>=" + pointlat3 + ")";
        DataSet ds = DbHelperOra.Query(sql);
        if (ds.Tables[0].Rows.Count > 0)
        {
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
            deleteSql += " and (GIS_LON_o<=" + pointlon1 + "";

            deleteSql += " or GIS_LON_o>=" + pointlon3 + "";

            deleteSql += " or GIS_LAT<=" + pointlat1 + "";

            deleteSql += " or GIS_LAT>=" + pointlat3 + ")";
            object d = DbHelperOra.GetSingle(deleteSql);
        }
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
        updatesql += "'" + ds.Tables[0].Rows[i]["GIS_LON_o"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["GIS_LAT_o"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["gis_lon"].ToString() + "',";
        updatesql += "'" + ds.Tables[0].Rows[i]["gis_lat"].ToString() + "')";
        return updatesql;
    }
    private bool judge(string s)
    {
        try { Convert.ToDouble(s); return true; }
        catch { return false; }
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}