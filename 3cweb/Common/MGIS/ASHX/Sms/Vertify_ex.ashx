<%@ WebHandler Language="C#" Class="Vertify_ex" %>

using System;
using System.Web;
using System.Text;
using System.Text.RegularExpressions;
using System.Collections;

public class Vertify_ex : ReferenceClass,IHttpHandler {

    public void ProcessRequest(HttpContext context)
    {
        try

        {
            string action = HttpContext.Current.Request["action"];
            switch (action)
            {
                case "getInfo":
                    getInfo();
                    break;
                case "analysis":
                    Analysis();
                    break;
                case "update_desc":
                    update_desc();
                    break;
                case "statisticsPosition":
                    queryPositionPole();
                    break;
                case "statisticsLine":
                    queryLinePole();
                    break;
                default:
                    break;
            }
        }
        catch (Exception ex)
        {

            log4net.ILog log = log4net.LogManager.GetLogger("验证工具");
            log.Error("执行出错", ex);
        }
    }
    /// <summary>
    /// 验证工具分析
    /// </summary>
    public void Analysis()
    {
        string org_code = HttpContext.Current.Request["org_code"];//组织机构
        string org_type = HttpContext.Current.Request["org_type"];
        string LPB_type = HttpContext.Current.Request["LPB_Type"];//线路、区站、桥隧
        string LPB_Code = HttpContext.Current.Request["LPB_Code"];
        string direction = HttpContext.Current.Request["direction"];//行别
        int startKM = (string.IsNullOrEmpty(HttpContext.Current.Request["start_km"]) ? -1 : Convert.ToInt32(HttpContext.Current.Request["start_km"]));
        int endKM = (string.IsNullOrEmpty(HttpContext.Current.Request["end_km"]) ? -1 : Convert.ToInt32(HttpContext.Current.Request["end_km"]));
        string pole_No = (string.IsNullOrEmpty(HttpContext.Current.Request["pole_no"]) ? "" : HttpContext.Current.Request["pole_no"]);
        //string Sort = "DESC";
        //string sort = HttpContext.Current.Request["sort"];
        //if (!string.IsNullOrEmpty(sort))
        //{
        //    if (sort == "1")
        //    {
        //        Sort = "DESC";
        //    }
        //    else if (sort == "0")
        //    {
        //        Sort = "ASC";
        //    }
        //}
        //string Sort_type = "KMSTANDARD";
        //string sort_type = HttpContext.Current.Request["sort_type"];
        //if (!string.IsNullOrEmpty(sort_type))
        //{
        //    Sort_type = sort_type;
        //}
        string order = "order by LINE_CODE,POLE_DIRECTION,KMSTANDARD,POLE_ORDER " ;//排序
        int pageSize = (string.IsNullOrEmpty(HttpContext.Current.Request["pagesize"]) ? 200000 : Convert.ToInt32(HttpContext.Current.Request["pagesize"]));//页大小
        int pageIndex = (string.IsNullOrEmpty(HttpContext.Current.Request["pageindex"]) ? 1 : Convert.ToInt32(HttpContext.Current.Request["pageindex"]));//当前页
        ADO.VerifyImpl v = new ADO.VerifyImpl();
        v.UpdateToNull();
        System.Data.DataSet ds = v.VerifyTools(org_code, org_type, direction, LPB_Code, LPB_type, order, startKM, endKM, pole_No, pageSize, pageIndex);


        StringBuilder Json = new StringBuilder();
        StringBuilder content1 = new StringBuilder();//边界杆标识
        StringBuilder content2 = new StringBuilder();//重复管辖标识
        StringBuilder content3 = new StringBuilder();//异常标识
        StringBuilder sql = new StringBuilder();
        ArrayList sqlcontent = new ArrayList();

        Json.Append("{\"data\":[");
        for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
        {
            content1.Clear();
            content2.Clear();
            content3.Clear();
            Json.Append("{");
            if (ds.Tables[0].Rows[i]["gis_lon"].ToString() == "" || ds.Tables[0].Rows[i]["gis_lon"].ToString() == "0")
            {
                ds.Tables[0].Rows[i]["gis_lon"] = ds.Tables[0].Rows[i]["gis_lon_o"];
                ds.Tables[0].Rows[i]["gis_lat"] = ds.Tables[0].Rows[i]["gis_lat_o"];
            }
            Json.Append("\"gis_lon\":\"" + ds.Tables[0].Rows[i]["gis_lon_o"].ToString() + "\",");//原始坐标
            Json.Append("\"gis_lat\":\"" + ds.Tables[0].Rows[i]["gis_lat_o"].ToString() + "\",");
            Json.Append("\"gis_lon_b\":\"" + ds.Tables[0].Rows[i]["gis_lon"].ToString() + "\",");//百度坐标
            Json.Append("\"gis_lat_b\":\"" + ds.Tables[0].Rows[i]["gis_lat"].ToString() + "\",");
            Json.Append("\"id\":\"" + ds.Tables[0].Rows[i]["ID"] + "\",");
            Json.Append("\"bureauName\":\"" + ds.Tables[0].Rows[i]["bureau_name"] + "\",");//局
            Json.Append("\"line_name\":\"" + ds.Tables[0].Rows[i]["line_name"] + "\",");//线路
            Json.Append("\"km_mark\":\"" + PublicMethod.KmtoString(ds.Tables[0].Rows[i]["kmstandard"].ToString()) + "\",");//公里标
            Json.Append("\"POLE_NO\":\"" + ds.Tables[0].Rows[i]["POLE_NO"].ToString() + "\",");//杆号
                                                                                               //计算距离
            string WZ = "";
            if (i > 0)
            {
                string lon1 = ds.Tables[0].Rows[i - 1]["gis_lon"].ToString();
                string lat1 = ds.Tables[0].Rows[i - 1]["gis_lat"].ToString();

                string lon2 = ds.Tables[0].Rows[i]["gis_lon"].ToString();
                string lat2 = ds.Tables[0].Rows[i]["gis_lat"].ToString();
                double distance = 0;
                if (!string.IsNullOrEmpty(lon1) && !string.IsNullOrEmpty(lat1) && !string.IsNullOrEmpty(lon2) && !string.IsNullOrEmpty(lat2))
                {
                    distance = my_gps.Distance(Convert.ToDouble(lon1), Convert.ToDouble(lat1), Convert.ToDouble(lon2), Convert.ToDouble(lat2));//两杆距离
                }

                WZ = "" + ds.Tables[0].Rows[i]["POLE_NO"].ToString() + "号支柱(" + ds.Tables[0].Rows[i]["SERIAL_NO"].ToString() + ")与相邻的" + ds.Tables[0].Rows[i - 1]["POLE_NO"].ToString() + "号支柱(" + ds.Tables[0].Rows[i - 1]["SERIAL_NO"].ToString() + ")，相距：" + Convert.ToInt32(distance) + "米";
                string distanceMax = HttpContext.Current.Request.QueryString["JL"];
                string distanceMin = HttpContext.Current.Request.QueryString["_JL"];
                if (!string.IsNullOrEmpty(distanceMax))
                {
                    if (distance > Convert.ToDouble(distanceMax))
                    {
                        Json.Append("\"JL\":\"" + 1 + "\",");//两杆距离大于上限
                    }
                    else
                    {
                        Json.Append("\"JL\":\"" + 0 + "\",");//两杆距离小于等于上限
                    }
                }
                else
                {
                    Json.Append("\"JL\":\"" + 0 + "\",");
                }
                if (!string.IsNullOrEmpty(distanceMin))
                {
                    if (Convert.ToDouble(distanceMin) > distance)
                    {
                        Json.Append("\"XJL\":\"" + 1 + "\",");//两杆距离小于下限
                    }
                    else
                    {
                        Json.Append("\"XJL\":\"" + 0 + "\",");//两杆距离大于等于下限
                    }
                }
                else
                {
                    Json.Append("\"XJL\":\"" + 0 + "\",");
                }
            }
            else
            {
                Json.Append("\"JL\":\"" + 0 + "\",");
                Json.Append("\"XJL\":\"" + 0 + "\",");
            }
            Json.Append("\"SERIAL_NO\":\"" + ds.Tables[0].Rows[i]["SERIAL_NO"] + "\",");//序号
            Json.Append("\"position_name\":\"" + ds.Tables[0].Rows[i]["position_name"] + "\",");
            Json.Append("\"LINE_CODE\":\"" + ds.Tables[0].Rows[i]["LINE_CODE"] + "\",");//线路
            Json.Append("\"POSITION_CODE\":\"" + ds.Tables[0].Rows[i]["POSITION_CODE"] + "\",");//区站
            Json.Append("\"BUREAU_CODE\":\"" + ds.Tables[0].Rows[i]["BUREAU_CODE"] + "\",");//局
            Json.Append("\"power_section_name\":\"" + ds.Tables[0].Rows[i]["power_section_name"] + "\",");//供电段
            string time = ds.Tables[0].Rows[i]["CREATE_TIME"].ToString();
            if (!string.IsNullOrEmpty(time))
            {
                time = Convert.ToDateTime(time).ToString("yyyy-MM-dd HH:mm:ss");
            }
            Json.Append("\"CREATE_TIME\":\"" + time + "\",");
            Json.Append("\"BRG_TUN_CODE\":\"" + ds.Tables[0].Rows[i]["BRG_TUN_CODE"] + "\",");//桥隧
            Json.Append("\"BRG_TUN_NAME\":\"" + ds.Tables[0].Rows[i]["BRG_TUN_NAME"] + "\",");
            Json.Append("\"FRAME_NO\":\"" + ds.Tables[0].Rows[i]["FRAME_NO"] + "\",");
            Json.Append("\"EXCEPTION_DATA_TYPE\":\"" + ds.Tables[0].Rows[i]["EXCEPTION_DATA_TYPE"] + "\",");
            Json.Append("\"WZ\":\"" + WZ + "\",");//位置信息
            Json.Append("\"direction\":\"" + ds.Tables[0].Rows[i]["POLE_DIRECTION"] + "\",");//行别
            Json.Append("\"pole_type\":\"" + ds.Tables[0].Rows[i]["pole_type"] + "\"");
            //判断是否为边界杆
            if (i > 0)
            {
                string org_code1 = ds.Tables[0].Rows[i - 1]["org_code"].ToString();
                string org_code2 = ds.Tables[0].Rows[i]["org_code"].ToString();
                string line_code1 = ds.Tables[0].Rows[i]["LINE_CODE"].ToString();
                string line_code2 = ds.Tables[0].Rows[i - 1]["LINE_CODE"].ToString();
                if ((!org_code1.Equals(org_code2)) && (line_code1.Equals(line_code2)))
                {
                    Json.Append(",\"DUP_POLE\":\"" + "边界杆" + "上一条线路："+ds.Tables[0].Rows[i-1]["LINE_NAME"] +" 行别：" +ds.Tables[0].Rows[i-1]["POLE_DIRECTION"] +" 公里标："+ds.Tables[0].Rows[i-1]["KMSTANDARD"]+" 供电段：" + ds.Tables[0].Rows[i-1]["ORG_NAME"]+ "\"");
                    sqlcontent.Add("update mis_pole t set t.DUP_POLE = '边界杆" + "上一条线路："+ds.Tables[0].Rows[i-1]["LINE_NAME"] +" 行别：" +ds.Tables[0].Rows[i-1]["POLE_DIRECTION"] +" 公里标："+ds.Tables[0].Rows[i-1]["KMSTANDARD"]+" 供电段：" + ds.Tables[0].Rows[i-1]["ORG_NAME"]+ "' where t.id='" + ds.Tables[0].Rows[i]["ID"].ToString() + "';");
                }
                else
                {
                    Json.Append(",\"DUP_POLE\":\"" + ds.Tables[0].Rows[i]["DUP_POLE"] + "\"");
                }
            }
            else
            {
                Json.Append(",\"DUP_POLE\":\"" + ds.Tables[0].Rows[i]["DUP_POLE"] + "\"");
            }
            //判断是否为重复管辖
            string org_code_p = ds.Tables[0].Rows[i]["org_code"].ToString();
            if (org_code_p.Split(Convert.ToChar(",")).Length > 1)
            {
                Json.Append(",\"DUP_PW\":\"" + "重复管辖" + "\"");
                sqlcontent.Add("update mis_pole t set t.DUP_PW = '重复管辖' where t.id='" + ds.Tables[0].Rows[i]["ID"].ToString() + "';");
            }
            else
            {
                Json.Append(",\"DUP_PW\":\"" + ds.Tables[0].Rows[i]["DUP_PW"] + "\"");
            }
            //根据行别判断杆号是否正确
            string content = Judge_PoleNo(ds, i);
            if (!string.IsNullOrEmpty(content))
            {
                content3.Append(content);
            }
            //判断杆编码是否正确
            string ss = Judge_PoleCode(ds, i);
            if (!string.IsNullOrEmpty(ss))
            {
                content3.Append(ss);
            }
            if (!string.IsNullOrEmpty(content3.ToString()))
            {
                string str = content3.ToString().Substring(0, content3.ToString().Length - 1);
                Json.Append(",\"ACDesc\":\"" + str + "\"");
                sqlcontent.Add("update mis_pole t set t.acdesc = '" + str + "' where t.id='" + ds.Tables[0].Rows[i]["ID"].ToString() + "';");
            }
            else
            {
                Json.Append(",\"ACDesc\":\"" + ds.Tables[0].Rows[i]["ACDesc"] + "\"");
            }
            Json.Append(",\"MCDesc\":\"" + ds.Tables[0].Rows[i]["MCDesc"] + "\"");

            if (i < ds.Tables[0].Rows.Count - 1)
            {
                Json.Append("},");
            }
            else
            {
                Json.Append("}");
            }
        }
        if (sqlcontent.Count > 0)
        {
            int size = 5000;//一次提交的数量
            int i = sqlcontent.Count / size;
            for (int j = 0; j <= i; j++)
            {
                sql.Clear();
                sql.Append("begin ");
                if (j == i)
                {
                    for (int t = j * size; t < sqlcontent.Count; t++)
                    {
                        sql.Append(sqlcontent[t]);
                    }
                }
                else
                {
                    for (int t = j * size; t < (j + 1) * size; t++)
                    {
                        sql.Append(sqlcontent[t]);
                    }

                }
                sql.Append(" end;");
                DbHelperOra.ExecuteSql(sql.ToString());
            }
        }
        Json.Append("]}");
        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(Json);
    }
    /// <summary>
    /// 验证工具查询列表
    /// </summary>
    public void getInfo()
    {

        string org_code = HttpContext.Current.Request["org_code"];//组织机构
        string org_type = HttpContext.Current.Request["org_type"];
        string LPB_type = HttpContext.Current.Request["LPB_Type"];//线路、区站、桥隧
        string LPB_Code = HttpContext.Current.Request["LPB_Code"];
        string direction = HttpContext.Current.Request["direction"];//行别
        int startKM = (string.IsNullOrEmpty(HttpContext.Current.Request["start_km"])?-1:Convert.ToInt32(HttpContext.Current.Request["start_km"]));
        int endKM = (string.IsNullOrEmpty(HttpContext.Current.Request["end_km"])?-1:Convert.ToInt32(HttpContext.Current.Request["end_km"]));
        string pole_No = (string.IsNullOrEmpty(HttpContext.Current.Request["pole_no"])?"":HttpContext.Current.Request["pole_no"]);
        string Sort = "DESC";
        string sort = HttpContext.Current.Request["sort"];
        if (!string.IsNullOrEmpty(sort))
        {
            if (sort == "1")
            {
                Sort = "DESC";
            }
            else if (sort == "0")
            {
                Sort = "ASC";
            }
        }
        string Sort_type = "KMSTANDARD";
        string sort_type = HttpContext.Current.Request["sort_type"];
        if (!string.IsNullOrEmpty(sort_type))
        {
            Sort_type = sort_type;
        }
        string order = "order by " + Sort_type + " " + Sort;//排序
        int pageSize = (string.IsNullOrEmpty(HttpContext.Current.Request["pagesize"])?-1:Convert.ToInt32(HttpContext.Current.Request["pagesize"]));//页大小
        int pageIndex = (string.IsNullOrEmpty(HttpContext.Current.Request["pageindex"])?-1:Convert.ToInt32(HttpContext.Current.Request["pageindex"]));//当前页
        ADO.VerifyImpl v = new ADO.VerifyImpl();
        System.Data.DataSet ds = v.VerifyTools(org_code,org_type,direction,LPB_Code,LPB_type,order,startKM,endKM,pole_No,pageSize,pageIndex);
        StringBuilder Json = new StringBuilder();
        Json.Append("{\"data\":[");
        string jsonstring = getJson(ds);
        Json.Append(jsonstring);
        Json.Append("]");
        int total_rows = ds.Tables[0].Rows.Count > 0 ? Convert.ToInt32(ds.Tables[0].Rows[0]["total"]) : 0;
        PageHelper ph = new PageHelper();
        string pagejson = ph.getPageJson(total_rows, pageIndex, pageSize);
        Json.Append("," + pagejson + "}");

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(Json);

    }
    //public string getJson(System.Data.DataSet ds)
    //{
    //    StringBuilder Json = new StringBuilder();
    //    StringBuilder content1 = new StringBuilder();//边界杆标识
    //    StringBuilder content2 = new StringBuilder();//重复管辖标识
    //    StringBuilder content3 = new StringBuilder();//异常标识
    //    StringBuilder sql = new StringBuilder();
    //    ArrayList sqlcontent = new ArrayList();
    //    for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
    //    {
    //        content1.Clear();
    //        content2.Clear();
    //        content3.Clear();
    //        Json.Append("{");
    //        if (ds.Tables[0].Rows[i]["gis_lon"].ToString() == "" || ds.Tables[0].Rows[i]["gis_lon"].ToString() == "0")
    //        {
    //            ds.Tables[0].Rows[i]["gis_lon"] = ds.Tables[0].Rows[i]["gis_lon_o"];
    //            ds.Tables[0].Rows[i]["gis_lat"] = ds.Tables[0].Rows[i]["gis_lat_o"];
    //        }
    //        Json.Append("\"gis_lon\":\"" + ds.Tables[0].Rows[i]["gis_lon_o"].ToString() + "\",");//原始坐标
    //        Json.Append("\"gis_lat\":\"" + ds.Tables[0].Rows[i]["gis_lat_o"].ToString() + "\",");
    //        Json.Append("\"gis_lon_b\":\"" + ds.Tables[0].Rows[i]["gis_lon"].ToString() + "\",");//百度坐标
    //        Json.Append("\"gis_lat_b\":\"" + ds.Tables[0].Rows[i]["gis_lat"].ToString() + "\",");
    //        Json.Append("\"id\":\"" + ds.Tables[0].Rows[i]["ID"] + "\",");
    //        Json.Append("\"bureauName\":\"" + ds.Tables[0].Rows[i]["bureau_name"] + "\",");//局
    //        Json.Append("\"line_name\":\"" + ds.Tables[0].Rows[i]["line_name"] + "\",");//线路
    //        Json.Append("\"km_mark\":\"" + PublicMethod.KmtoString(ds.Tables[0].Rows[i]["kmstandard"].ToString()) + "\",");//公里标
    //        Json.Append("\"POLE_NO\":\"" + ds.Tables[0].Rows[i]["POLE_NO"].ToString() + "\",");//杆号
    //        //计算距离
    //        string WZ = "";
    //        if (i > 0)
    //        {
    //            string lon1 = ds.Tables[0].Rows[i - 1]["gis_lon"].ToString();
    //            string lat1 = ds.Tables[0].Rows[i - 1]["gis_lat"].ToString();

    //            string lon2 = ds.Tables[0].Rows[i]["gis_lon"].ToString();
    //            string lat2 = ds.Tables[0].Rows[i]["gis_lat"].ToString();
    //            double distance = 0;
    //            if (!string.IsNullOrEmpty(lon1) && !string.IsNullOrEmpty(lat1) && !string.IsNullOrEmpty(lon2) && !string.IsNullOrEmpty(lat2))
    //            {
    //                distance = my_gps.Distance(Convert.ToDouble(lon1), Convert.ToDouble(lat1), Convert.ToDouble(lon2), Convert.ToDouble(lat2));//两杆距离
    //            }

    //            WZ = "" + ds.Tables[0].Rows[i]["POLE_NO"].ToString() + "号支柱(" + ds.Tables[0].Rows[i]["SERIAL_NO"].ToString() + ")与相邻的" + ds.Tables[0].Rows[i - 1]["POLE_NO"].ToString() + "号支柱(" + ds.Tables[0].Rows[i - 1]["SERIAL_NO"].ToString() + ")，相距：" + Convert.ToInt32(distance) + "米";
    //            string distanceMax = HttpContext.Current.Request.QueryString["JL"];
    //            string distanceMin = HttpContext.Current.Request.QueryString["_JL"];
    //            if (!string.IsNullOrEmpty(distanceMax))
    //            {
    //                if (distance > Convert.ToDouble(distanceMax))
    //                {
    //                    Json.Append("\"JL\":\"" + 1 + "\",");//两杆距离大于上限
    //                }
    //                else
    //                {
    //                    Json.Append("\"JL\":\"" + 0 + "\",");//两杆距离小于等于上限
    //                }
    //            }
    //            else
    //            {
    //                Json.Append("\"JL\":\"" + 0 + "\",");
    //            }
    //            if (!string.IsNullOrEmpty(distanceMin))
    //            {
    //                if (Convert.ToDouble(distanceMin) > distance)
    //                {
    //                    Json.Append("\"XJL\":\"" + 1 + "\",");//两杆距离小于下限
    //                }
    //                else
    //                {
    //                    Json.Append("\"XJL\":\"" + 0 + "\",");//两杆距离大于等于下限
    //                }
    //            }
    //            else
    //            {
    //                Json.Append("\"XJL\":\"" + 0 + "\",");
    //            }
    //        }
    //        else
    //        {
    //            Json.Append("\"JL\":\"" + 0 + "\",");
    //            Json.Append("\"XJL\":\"" + 0 + "\",");
    //        }
    //        Json.Append("\"SERIAL_NO\":\"" + ds.Tables[0].Rows[i]["SERIAL_NO"] + "\",");//序号
    //        Json.Append("\"position_name\":\"" + ds.Tables[0].Rows[i]["position_name"] + "\",");
    //        Json.Append("\"LINE_CODE\":\"" + ds.Tables[0].Rows[i]["LINE_CODE"] + "\",");//线路
    //        Json.Append("\"POSITION_CODE\":\"" + ds.Tables[0].Rows[i]["POSITION_CODE"] + "\",");//区站
    //        Json.Append("\"BUREAU_CODE\":\"" + ds.Tables[0].Rows[i]["BUREAU_CODE"] + "\",");//局
    //        Json.Append("\"power_section_name\":\"" + ds.Tables[0].Rows[i]["power_section_name"] + "\",");//供电段
    //        string time = ds.Tables[0].Rows[i]["CREATE_TIME"].ToString();
    //        if (!string.IsNullOrEmpty(time))
    //        {
    //            time = Convert.ToDateTime(time).ToString("yyyy-MM-dd HH:mm:ss");
    //        }
    //        Json.Append("\"CREATE_TIME\":\"" + time + "\",");
    //        Json.Append("\"BRG_TUN_CODE\":\"" + ds.Tables[0].Rows[i]["BRG_TUN_CODE"] + "\",");//桥隧
    //        Json.Append("\"BRG_TUN_NAME\":\"" + ds.Tables[0].Rows[i]["BRG_TUN_NAME"] + "\",");
    //        Json.Append("\"FRAME_NO\":\"" + ds.Tables[0].Rows[i]["FRAME_NO"] + "\",");
    //        Json.Append("\"EXCEPTION_DATA_TYPE\":\"" + ds.Tables[0].Rows[i]["EXCEPTION_DATA_TYPE"] + "\",");
    //        Json.Append("\"WZ\":\"" + WZ + "\",");//位置信息
    //        Json.Append("\"direction\":\"" + ds.Tables[0].Rows[i]["POLE_DIRECTION"] + "\",");//行别
    //        Json.Append("\"pole_type\":\"" + ds.Tables[0].Rows[i]["pole_type"] + "\"");
    //        //判断是否为边界杆
    //        if (string.IsNullOrEmpty(ds.Tables[0].Rows[i]["DUP_POLE"].ToString()))
    //        {
    //            if (i > 0)
    //            {
    //                string org_code1 = ds.Tables[0].Rows[i - 1]["org_code"].ToString();
    //                string org_code2 = ds.Tables[0].Rows[i]["org_code"].ToString();
    //                string line_code1 = ds.Tables[0].Rows[i]["LINE_CODE"].ToString();
    //                string line_code2 = ds.Tables[0].Rows[i - 1]["LINE_CODE"].ToString();
    //                if ((!org_code1.Equals(org_code2))&&(line_code1.Equals(line_code2)))
    //                {
    //                    Json.Append(",\"boundary\":\"" + 1 + "\"");
    //                    sqlcontent.Add("update mis_pole t set t.DUP_POLE = '边界杆' where t.id='" + ds.Tables[0].Rows[i]["ID"].ToString() + "';");
    //                }
    //                else
    //                {
    //                    sqlcontent.Add("update mis_pole t set t.DUP_POLE = '0' where t.id='" + ds.Tables[0].Rows[i]["ID"].ToString() + "';");
    //                }
    //            }
    //            Json.Append(",\"boundary\":\"" + 0 + "\"");
    //        }
    //        else if (ds.Tables[0].Rows[i]["DUP_POLE"].ToString().Equals("0"))
    //        {
    //            Json.Append(",\"boundary\":\"" + 0 + "\"");
    //        }
    //        else
    //        {
    //            Json.Append(",\"boundary\":\"" + 1 + "\"");
    //        }
    //        //
    //        //判断是否为重复管辖
    //        if (string.IsNullOrEmpty(ds.Tables[0].Rows[i]["DUP_PW"].ToString()))
    //        {
    //            string org_code = ds.Tables[0].Rows[i]["org_code"].ToString();
    //            if (org_code.Split(Convert.ToChar(",")).Length > 1)
    //            {
    //                Json.Append(",\"repeat\":\"" + 1 + "\"");
    //                sqlcontent.Add("update mis_pole t set t.DUP_PW = '重复管辖' where t.id='" + ds.Tables[0].Rows[i]["ID"].ToString() + "';");
    //            }
    //            Json.Append(",\"repeat\":\"" + 0 + "\"");
    //            sqlcontent.Add("update mis_pole t set t.DUP_PW = '0' where t.id='" + ds.Tables[0].Rows[i]["ID"].ToString() + "';");
    //        }
    //        else if (ds.Tables[0].Rows[i]["DUP_PW"].ToString().Equals("0"))
    //        {
    //            Json.Append(",\"repeat\":\"" + 0 + "\"");
    //        }
    //        else
    //        {
    //            Json.Append(",\"repeat\":\"" + 1 + "\"");
    //        }

    //        if (string.IsNullOrEmpty(ds.Tables[0].Rows[i]["ACDesc"].ToString()))
    //        {
    //            //根据行别判断杆号是否正确
    //            string content = Judge_PoleNo(ds, i);
    //            if (!string.IsNullOrEmpty(content))
    //            {
    //                content3.Append(content);
    //            }
    //            //判断杆编码是否正确
    //            string ss = Judge_PoleCode(ds, i);
    //            if (!string.IsNullOrEmpty(ss))
    //            {
    //                content3.Append(ss);
    //            }
    //            if (string.IsNullOrEmpty(content3.ToString()))
    //            {
    //                Json.Append(",\"ISZC\":\"" + 0 + "\"");
    //                Json.Append(",\"ACDesc\":\"" + "" + "\"");
    //                sqlcontent.Add("update mis_pole t set t.acdesc = '0' where t.id='" + ds.Tables[0].Rows[i]["ID"].ToString() + "';");
    //            }
    //            else
    //            {
    //                Json.Append(",\"ISZC\":\"" + 1 + "\"");
    //                string str = content3.ToString().Substring(0, content3.ToString().Length - 1);
    //                Json.Append(",\"ACDesc\":\"" + str + "\"");
    //                sqlcontent.Add("update mis_pole t set t.acdesc = '"+ str + "' where t.id='" + ds.Tables[0].Rows[i]["ID"].ToString() + "';");
    //            }
    //        }
    //        else if (ds.Tables[0].Rows[i]["ACDesc"].ToString().Equals("0"))
    //        {
    //            Json.Append(",\"ISZC\":\"" + 0 + "\"");
    //            Json.Append(",\"ACDesc\":\"" + "" + "\"");
    //        }
    //        else
    //        {
    //            Json.Append(",\"ISZC\":\"" + 1 + "\"");
    //            Json.Append(",\"ACDesc\":\"" + ds.Tables[0].Rows[i]["ACDesc"] + "\"");
    //        }

    //        Json.Append(",\"MCDesc\":\"" + ds.Tables[0].Rows[i]["MCDesc"] + "\"");

    //        if (i < ds.Tables[0].Rows.Count - 1)
    //        {
    //            Json.Append("},");
    //        }
    //        else
    //        {
    //            Json.Append("}");
    //        }
    //    }
    //    if (sqlcontent.Count>0)
    //    {
    //        int size = 5000;//一次提交的数量
    //        int i = sqlcontent.Count / size;
    //        for (int j = 0; j <= i; j++)
    //        {
    //            sql.Clear();
    //            sql.Append("begin ");
    //            if (j == i)
    //            {
    //                for (int t = j * size; t < sqlcontent.Count; t++)
    //                {
    //                    sql.Append(sqlcontent[t]);
    //                }
    //            }
    //            else
    //            {
    //                for (int t = j * size; t < (j + 1) * size; t++)
    //                {
    //                    sql.Append(sqlcontent[t]);
    //                }

    //            }
    //            sql.Append(" end;");
    //            DbHelperOra.ExecuteSql(sql.ToString());
    //        }
    //    }
    //    return Json.ToString();
    //}
    public string getJson(System.Data.DataSet ds)
    {
        StringBuilder Json = new StringBuilder();
        StringBuilder content1 = new StringBuilder();//边界杆标识
        StringBuilder content2 = new StringBuilder();//重复管辖标识
        StringBuilder content3 = new StringBuilder();//异常标识
        StringBuilder sql = new StringBuilder();
        ArrayList sqlcontent = new ArrayList();
        for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
        {
            content1.Clear();
            content2.Clear();
            content3.Clear();
            Json.Append("{");
            if (ds.Tables[0].Rows[i]["gis_lon"].ToString() == "" || ds.Tables[0].Rows[i]["gis_lon"].ToString() == "0")
            {
                ds.Tables[0].Rows[i]["gis_lon"] = ds.Tables[0].Rows[i]["gis_lon_o"];
                ds.Tables[0].Rows[i]["gis_lat"] = ds.Tables[0].Rows[i]["gis_lat_o"];
            }
            Json.Append("\"gis_lon\":\"" + ds.Tables[0].Rows[i]["gis_lon_o"].ToString() + "\",");//原始坐标
            Json.Append("\"gis_lat\":\"" + ds.Tables[0].Rows[i]["gis_lat_o"].ToString() + "\",");
            Json.Append("\"gis_lon_b\":\"" + ds.Tables[0].Rows[i]["gis_lon"].ToString() + "\",");//百度坐标
            Json.Append("\"gis_lat_b\":\"" + ds.Tables[0].Rows[i]["gis_lat"].ToString() + "\",");
            Json.Append("\"id\":\"" + ds.Tables[0].Rows[i]["ID"] + "\",");
            Json.Append("\"bureauName\":\"" + ds.Tables[0].Rows[i]["bureau_name"] + "\",");//局
            Json.Append("\"line_name\":\"" + ds.Tables[0].Rows[i]["line_name"] + "\",");//线路
            Json.Append("\"km_mark\":\"" + PublicMethod.KmtoString(ds.Tables[0].Rows[i]["kmstandard"].ToString()) + "\",");//公里标
            Json.Append("\"POLE_NO\":\"" + ds.Tables[0].Rows[i]["POLE_NO"].ToString() + "\",");//杆号
                                                                                               //计算距离
            string WZ = "";
            if (i > 0)
            {
                string lon1 = ds.Tables[0].Rows[i - 1]["gis_lon"].ToString();
                string lat1 = ds.Tables[0].Rows[i - 1]["gis_lat"].ToString();

                string lon2 = ds.Tables[0].Rows[i]["gis_lon"].ToString();
                string lat2 = ds.Tables[0].Rows[i]["gis_lat"].ToString();
                double distance = 0;
                if (!string.IsNullOrEmpty(lon1) && !string.IsNullOrEmpty(lat1) && !string.IsNullOrEmpty(lon2) && !string.IsNullOrEmpty(lat2))
                {
                    distance = my_gps.Distance(Convert.ToDouble(lon1), Convert.ToDouble(lat1), Convert.ToDouble(lon2), Convert.ToDouble(lat2));//两杆距离
                }

                WZ = "" + ds.Tables[0].Rows[i]["POLE_NO"].ToString() + "号支柱(" + ds.Tables[0].Rows[i]["SERIAL_NO"].ToString() + ")与相邻的" + ds.Tables[0].Rows[i - 1]["POLE_NO"].ToString() + "号支柱(" + ds.Tables[0].Rows[i - 1]["SERIAL_NO"].ToString() + ")，相距：" + Convert.ToInt32(distance) + "米";
                string distanceMax = HttpContext.Current.Request.QueryString["JL"];
                string distanceMin = HttpContext.Current.Request.QueryString["_JL"];
                if (!string.IsNullOrEmpty(distanceMax))
                {
                    if (distance > Convert.ToDouble(distanceMax))
                    {
                        Json.Append("\"JL\":\"" + 1 + "\",");//两杆距离大于上限
                    }
                    else
                    {
                        Json.Append("\"JL\":\"" + 0 + "\",");//两杆距离小于等于上限
                    }
                }
                else
                {
                    Json.Append("\"JL\":\"" + 0 + "\",");
                }
                if (!string.IsNullOrEmpty(distanceMin))
                {
                    if (Convert.ToDouble(distanceMin) > distance)
                    {
                        Json.Append("\"XJL\":\"" + 1 + "\",");//两杆距离小于下限
                    }
                    else
                    {
                        Json.Append("\"XJL\":\"" + 0 + "\",");//两杆距离大于等于下限
                    }
                }
                else
                {
                    Json.Append("\"XJL\":\"" + 0 + "\",");
                }
            }
            else
            {
                Json.Append("\"JL\":\"" + 0 + "\",");
                Json.Append("\"XJL\":\"" + 0 + "\",");
            }
            Json.Append("\"SERIAL_NO\":\"" + ds.Tables[0].Rows[i]["SERIAL_NO"] + "\",");//序号
            Json.Append("\"position_name\":\"" + ds.Tables[0].Rows[i]["position_name"] + "\",");
            Json.Append("\"LINE_CODE\":\"" + ds.Tables[0].Rows[i]["LINE_CODE"] + "\",");//线路
            Json.Append("\"POSITION_CODE\":\"" + ds.Tables[0].Rows[i]["POSITION_CODE"] + "\",");//区站
            Json.Append("\"BUREAU_CODE\":\"" + ds.Tables[0].Rows[i]["BUREAU_CODE"] + "\",");//局
            Json.Append("\"power_section_name\":\"" + ds.Tables[0].Rows[i]["power_section_name"] + "\",");//供电段
            string time = ds.Tables[0].Rows[i]["CREATE_TIME"].ToString();
            if (!string.IsNullOrEmpty(time))
            {
                time = Convert.ToDateTime(time).ToString("yyyy-MM-dd HH:mm:ss");
            }
            Json.Append("\"CREATE_TIME\":\"" + time + "\",");
            Json.Append("\"BRG_TUN_CODE\":\"" + ds.Tables[0].Rows[i]["BRG_TUN_CODE"] + "\",");//桥隧
            Json.Append("\"BRG_TUN_NAME\":\"" + ds.Tables[0].Rows[i]["BRG_TUN_NAME"] + "\",");
            Json.Append("\"FRAME_NO\":\"" + ds.Tables[0].Rows[i]["FRAME_NO"] + "\",");
            Json.Append("\"EXCEPTION_DATA_TYPE\":\"" + ds.Tables[0].Rows[i]["EXCEPTION_DATA_TYPE"] + "\",");
            Json.Append("\"WZ\":\"" + WZ + "\",");//位置信息
            Json.Append("\"direction\":\"" + ds.Tables[0].Rows[i]["POLE_DIRECTION"] + "\",");//行别
            Json.Append("\"pole_type\":\"" + ds.Tables[0].Rows[i]["pole_type"] + "\"");
            Json.Append(",\"DUP_POLE\":\"" + ds.Tables[0].Rows[i]["DUP_POLE"] + "\"");//边界杆
            Json.Append(",\"DUP_PW\":\"" + ds.Tables[0].Rows[i]["DUP_PW"] + "\"");//重复管辖
            Json.Append(",\"ACDesc\":\"" + ds.Tables[0].Rows[i]["ACDesc"] + "\"");//自动分析
            Json.Append(",\"MCDesc\":\"" + ds.Tables[0].Rows[i]["MCDesc"] + "\"");//人工分析

            if (i < ds.Tables[0].Rows.Count - 1)
            {
                Json.Append("},");
            }
            else
            {
                Json.Append("}");
            }
        }
        return Json.ToString();
    }
    /// <summary>
    /// 根据行别判断杆号是否正确
    /// </summary>
    /// <param name="ds">杆相关信息</param>
    /// <param name="i">计数</param>
    /// <returns></returns>
    public string Judge_PoleNo(System.Data.DataSet ds, int i)
    {
        string content = null;

        string poledirection = ds.Tables[0].Rows[i]["POLE_DIRECTION"].ToString();

        if (string.IsNullOrEmpty(poledirection))
        {
            content = "行别为空,";
        }
        else
        {
            if (!string.IsNullOrEmpty(ds.Tables[0].Rows[i]["POLE_NO"].ToString()))
            {
                string str = ds.Tables[0].Rows[i]["POLE_NO"].ToString();
                string p = Regex.Replace(str, @"[^\d]*", "");//匹配数字,上行为偶数，下行为奇数
                if (p == "")
                {
                    content = "杆号不正确,";
                }
                else
                {
                    int y = Convert.ToInt32(p) % 2;
                    if (y == 0)
                    {
                        content = (poledirection.Equals("下行")?"杆号不正确,":null);
                    }
                    else if (y == 1)
                    {
                        content = (poledirection.Equals("上行")?"杆号不正确,":null);
                    }
                }
            }
            else
            {
                content = "杆号为空,";
            }
        }

        return content;
    }
    /// <summary>
    /// 根据线路、行别和序号判断杆编码是否正确
    /// </summary>
    /// <param name="ds">杆相关信息</param>
    /// <param name="i">计数</param>
    /// <returns></returns>
    public string Judge_PoleCode(System.Data.DataSet ds, int i)
    {
        string content = null;

        string polecode = ds.Tables[0].Rows[i]["pole_code"].ToString();
        if (string.IsNullOrEmpty(polecode))
        {
            content = "杆编码为空,";
        }
        else
        {
            string linecode = ds.Tables[0].Rows[i]["line_code"].ToString();//线路
            string positioncode = ds.Tables[0].Rows[i]["POSITION_CODE"].ToString();//区站
            string direction = ds.Tables[0].Rows[i]["POLE_DIRECTION"].ToString();//行别
            string poleno = ds.Tables[0].Rows[i]["POLE_NO"].ToString();//杆号                                                                               
            string[] Array = polecode.Split(Convert.ToChar("$"));
            string sign = "1";
            if (!string.IsNullOrEmpty(direction))
            {
                if (direction.Equals("上行"))
                {
                    sign = "1";
                }
                else if (direction.Equals("下行"))
                {
                    sign = "0";
                }
            }
            else
            {
                sign = "";
            }
            if (Array.Length == 6)
            {
                if (string.IsNullOrEmpty(positioncode))
                {
                    content = "杆号编码不正确,";
                }
                else
                {
                    if (!((Array[0] + "$" + Array[1] + "$" + Array[2]).Equals(positioncode)) || !(Array[3].Equals(sign)) || !(Array[4].Equals(poleno)))
                    {
                        content = "杆号编码不正确,";
                    }
                }
                //if (!((Array[0] + "$" + Array[1]).Equals(linecode)) || !(Array[2].Equals(sign)) || (!Array[3].Equals(serialno)))
                //{
                //    content = "杆号编码不正确,";
                //}
            }
            else if (Array.Length == 5)
            {
                if (!string.IsNullOrEmpty(positioncode))
                {
                    content = "杆号编码不正确,";
                }
                else
                {
                    if (!((Array[0] + "$" + Array[1]).Equals(positioncode)) || !(Array[2].Equals(sign)) || !(Array[3].Equals(poleno)))
                    {
                        content = "杆号编码不正确,";
                    }
                }
            }

        }

        return content;
    }
    /// <summary>
    /// 人工判断字段更新操作
    /// </summary>
    public void update_desc()
    {
        string id = HttpContext.Current.Request["ID"];
        string MCDESC = HttpContext.Current.Request["MCDESC"];//人工更新字段
        ADO.VerifyImpl v = new ADO.VerifyImpl();
        int re = v.UpdateDesc(id,"MCDESC",MCDESC);
        HttpContext.Current.Response.Write(re);
    }

    /// <summary>
    /// 验证工具查询线路区站起止杆
    /// </summary>
    public void queryPositionPole()
    {
        string org_code = HttpContext.Current.Request["org_code"];//组织机构
        string org_type = HttpContext.Current.Request["org_type"];
        string LPB_type = HttpContext.Current.Request["LPB_Type"];//线路、区站、桥隧
        string LPB_Code = HttpContext.Current.Request["LPB_Code"];
        string direction = HttpContext.Current.Request["direction"];//行别
        int pageSize = (string.IsNullOrEmpty(HttpContext.Current.Request["pagesize"]) ? -1 : Convert.ToInt32(HttpContext.Current.Request["pagesize"]));//页大小
        int pageIndex = (string.IsNullOrEmpty(HttpContext.Current.Request["pageindex"]) ? -1 : Convert.ToInt32(HttpContext.Current.Request["pageindex"]));//当前页
        int startRownum = 0;//开始行号 
        int endRonum = 0;//结束行号

        //计算起止行号，分页用
        if (pageIndex != -1 && pageSize != -1)
        {
            startRownum = pageSize * (pageIndex - 1) + 1;
            endRonum = pageSize * pageIndex;
        }

        //数据查询
        System.Data.DataSet ds = ADO.VerifyImpl.QueryPositionPole(org_code,org_type,direction,LPB_Code,LPB_type,startRownum,endRonum,null);

        //转JSON
        try
        {
            StringBuilder json = new StringBuilder();
            if (ds.Tables.Count != 0)
            {
                json.Append("{\"data\":[");
                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    json.Append("{");
                    for (int j = 0; j < ds.Tables[0].Columns.Count; j++)
                    {
                        string key = ds.Tables[0].Columns[j].ColumnName.ToString();
                        string value = ds.Tables[0].Rows[i][j]==DBNull.Value?null:ds.Tables[0].Rows[i][j].ToString();
                        if (key.Contains("KM_MARK")&&value!=null)
                        {
                            value = "K" + Convert.ToInt32(value) / 1000 + "+" + Convert.ToInt32(value) % 1000;
                        }
                        json.Append("\""+key+"\":");
                        if (j < ds.Tables[0].Columns.Count - 1)
                        {
                            json.Append("\"" + value + "\",");
                        }
                        else
                        {
                            json.Append("\"" + value + "\"");
                        }
                    }
                    json.Append("},");
                }
                if (ds.Tables[0].Rows.Count > 0)
                {
                    json.Remove(json.Length - 1, 1);
                }
                json.Append("]");
                PageHelper page = new PageHelper();
                string pagejson = page.getPageJson(ds.Tables[0].Rows.Count > 0 ? Convert.ToInt32(ds.Tables[0].Rows[0]["TOTAL"]) : 0, pageIndex, pageSize);//拼接分页数据
                json.Append("," + pagejson + "}");
            }
            HttpContext.Current.Response.ContentType = "application/json";
            HttpContext.Current.Response.Write(json.ToString());
        }
        catch(Exception ex)
        {
            log4net.ILog log_ = log4net.LogManager.GetLogger("查询列表转json");
            log_.Error("执行出错", ex);
        }
    }

    /// <summary>
    /// 验证工具查询线路起止杆
    /// </summary>
    public void queryLinePole()
    {
        string org_code = HttpContext.Current.Request["org_code"];//组织机构
        string org_type = HttpContext.Current.Request["org_type"];
        string LPB_type = HttpContext.Current.Request["LPB_Type"];//线路、区站、桥隧
        string LPB_Code = HttpContext.Current.Request["LPB_Code"];
        string direction = HttpContext.Current.Request["direction"];//行别
        int pageSize = (string.IsNullOrEmpty(HttpContext.Current.Request["pagesize"]) ? -1 : Convert.ToInt32(HttpContext.Current.Request["pagesize"]));//页大小
        int pageIndex = (string.IsNullOrEmpty(HttpContext.Current.Request["pageindex"]) ? -1 : Convert.ToInt32(HttpContext.Current.Request["pageindex"]));//当前页
        int startRownum = 0;//开始行号 
        int endRonum = 0;//结束行号

        //计算起止行号，分页用
        if (pageIndex != -1 && pageSize != -1)
        {
            startRownum = pageSize * (pageIndex - 1) + 1;
            endRonum = pageSize * pageIndex;
        }

        //数据查询
        System.Data.DataSet ds = ADO.VerifyImpl.QueryLinePole(org_code, org_type, direction, LPB_Code, LPB_type, startRownum, endRonum);

        //转JSON
        try
        {
            StringBuilder json = new StringBuilder();
            if (ds.Tables.Count != 0)
            {
                json.Append("{\"data\":[");
                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    if (i != 0)
                    {
                        if ((ds.Tables[0].Rows[i]["LINE_CODE"].ToString() == ds.Tables[0].Rows[i - 1]["LINE_CODE"].ToString() && ds.Tables[0].Rows[i]["POLE_DIRECTION"].ToString() == ds.Tables[0].Rows[i - 1]["POLE_DIRECTION"].ToString()) || (ds.Tables[0].Rows[i]["LINE_CODE"].ToString() == ds.Tables[0].Rows[i - 1]["LINE_CODE"].ToString() && ds.Tables[0].Rows[i]["POLE_DIRECTION"].ToString() == ds.Tables[0].Rows[i - 1]["POLE_DIRECTION"].ToString()))
                        {
                            continue;
                        }
                    }
                    json.Append("{");
                    for (int j = 0; j < ds.Tables[0].Columns.Count; j++)
                    {
                        string key = ds.Tables[0].Columns[j].ColumnName.ToString();
                        object value = ds.Tables[0].Rows[i][j];
                        if (key.Contains("KM_MARK") && value != System.DBNull.Value)
                        {
                            value = "K" + Convert.ToInt32(value) / 1000 + "+" + Convert.ToInt32(value) % 1000;
                        }
                        json.Append("\"" + key + "\":");
                        if (j < ds.Tables[0].Columns.Count - 1)
                        {
                            json.Append("\"" + value + "\",");
                        }
                        else
                        {
                            json.Append("\"" + value + "\"");
                        }
                    }
                    json.Append("},");
                }
                if (ds.Tables[0].Rows.Count > 0)
                {
                    json.Remove(json.Length - 1, 1);
                }
                json.Append("]");
                //分页有可能不正确 以后用到需优化
                PageHelper page = new PageHelper();
                string pagejson = page.getPageJson(ds.Tables[0].Rows.Count > 0 ? Convert.ToInt32(ds.Tables[0].Rows[0]["TOTAL"]) : 0, pageIndex, pageSize);//拼接分页数据
                json.Append("," + pagejson + "}");
            }
            HttpContext.Current.Response.ContentType = "application/json";
            HttpContext.Current.Response.Write(json.ToString());
        }
        catch (Exception ex)
        {
            log4net.ILog log_ = log4net.LogManager.GetLogger("查询列表转json");
            log_.Error("执行出错", ex);
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