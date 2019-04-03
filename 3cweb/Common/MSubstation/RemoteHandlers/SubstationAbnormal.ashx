<%@ WebHandler Language="C#" Class="SubstationAbnormal" %>

using System;
using System.Web;
using System.IO;
using System.Collections.Generic;
using Aspose.Cells;
using System.Data;
using Api.ADO.entity;
using Api.Util;
using System.Text;
using Api.Foundation.entity.Foundation;
using System.Linq;

public class SubstationAbnormal : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        try
        {
            string type = HttpContext.Current.Request["action"];
            switch (type)
            {
                case "upLoad":
                    UpLoad();
                    break;
                case "queryErrorList":
                    QueryErrorList();
                    break;
                case "queryAllList":
                    QueryAllList();
                    break;
            }
        }
        catch (Exception ex)
        {
            log4net.ILog log = log4net.LogManager.GetLogger("变电所异常数据");
            log.Error("执行出错", ex);
        }
    }
    public void UpLoad()
    {
        HttpFileCollection files = HttpContext.Current.Request.Files;//上传文件
        bool sign = false;
        string re = "";
        if (files != null && files.Count > 0)
        {
            HttpPostedFile file = files[0];
            string fileName = Path.GetFileName(file.FileName);
            string fileExt = Path.GetExtension(file.FileName);
            if (fileExt != ".xls" && fileExt != ".XLS" && fileExt != ".xlsx" && fileExt != ".XLSX")
            {
                re = "请选择正确的文件格式";
            }
            else
            {
                ADO.IVirtual_dir_infoImpl iserver = new ADO.IVirtual_dir_infoImpl();

                Virtual_Dir_Info vp = iserver.getVirtualAndPhysical();

                string VIRTUAL_DIR_NAME = vp.VIRTUAL_DIR_NAME;

                if (!string.IsNullOrEmpty(VIRTUAL_DIR_NAME))
                {
                    string savePath = "";
                    try
                    {
                        fileName = DateTime.Now.ToString("yyyymmddhhMMss") + "_" + file.FileName;//获取Execle文件名  DateTime日期函数
                        savePath = HttpContext.Current.Server.MapPath("/" + VIRTUAL_DIR_NAME + "/SubstatiobExcel/");//Server.MapPath 获得虚拟服务器相对路径
                        if (!System.IO.Directory.Exists(savePath))
                        {
                            System.IO.Directory.CreateDirectory(savePath);
                        }
                        //打开EXCEL   
                        file.SaveAs(savePath + fileName);
                    }
                    catch (Exception ex)
                    {
                        re = "上传失败";
                        log4net.ILog log = log4net.LogManager.GetLogger("变电所数据上传");
                        log.Error("执行出错", ex);
                    }
                    re = ExcelRead(savePath, fileName);
                    if (re == "成功")
                    {
                        sign = true;
                    }
                }
            }
        }
        else
        {
            re = "无文件";
        }
        StringBuilder json = new StringBuilder();
        json.Append("{\"sign\":\"" + sign + "\",\"re\":\"" + re + "\"}");

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }
    public string ExcelRead(string path, string file)
    {
        string re = "";
        try
        {
            Workbook book = new Workbook(path + file);
            foreach (Worksheet sheet in book.Worksheets)
            {
                Cells cells = sheet.Cells;

                ///找到报警记录的列表
                int startrow = GetStartRow(cells);

                ///转换DataTable
                if (startrow > 0)
                {
                    DataTable dt = cells.ExportDataTableAsString(startrow, 0, cells.MaxDataRow + 1, cells.MaxDataColumn + 1, true);
                    Insert(dt);
                }
            }
            re = "成功";
        }
        catch (Exception ex)
        {
            re = "读取入库失败";
            log4net.ILog log = log4net.LogManager.GetLogger("变电所异常数据读取入库");
            log.Error("执行出错", ex);
        }


        return re;
    }
    /// <summary>
    /// 找到记录列表的开始行数
    /// </summary>
    /// <param name="cells"></param>
    /// <returns></returns>
    public static int GetStartRow(Cells cells)
    {
        int startrow = 0;
        if (cells.MaxDataRow < 0)
        {
            startrow = -1;
        }
        else
        {
            for (int i = 0; i < cells.MaxDataRow + 1; i++)
            {
                for (int j = 0; j < cells.MaxDataColumn + 1; j++)
                {
                    //一行行的读取数据，插入数据库的代码也可以在这里写
                    string s = cells[i, j].StringValue.Trim();
                    if (s.Contains("故障报告"))
                    {
                        startrow = i + 1;
                        return startrow;
                    }
                }
            }
        }
        return startrow;
    }
    public void Insert(DataTable dt)
    {
        if (dt != null && dt.Rows.Count > 0)
        {
            List<MIS_SUBST_EXP> list = new List<MIS_SUBST_EXP>();
            StringBuilder sql = new StringBuilder();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                if (!string.IsNullOrEmpty(dt.Rows[i]["记录号"].ToString()))
                {
                    MIS_SUBST_EXP mis_subst_exp = new MIS_SUBST_EXP();
                    mis_subst_exp.ID = "C" + Guid.NewGuid().ToString().Replace("-", "");
                    if (!string.IsNullOrEmpty(dt.Rows[i]["被控站名称"].ToString()))
                    {
                        mis_subst_exp.SUBST_NAME = dt.Rows[i]["被控站名称"].ToString().Replace("_", "");
                        mis_subst_exp.SUBST_CODE = getSubstationCode(mis_subst_exp.SUBST_NAME);
                    }
                    string TRBL_TIME = dt.Rows[i]["故障日期"].ToString();
                    if (!string.IsNullOrEmpty(dt.Rows[i]["故障时间"].ToString()))
                    {
                        TRBL_TIME = TRBL_TIME + " " + dt.Rows[i]["故障时间"].ToString().Split('.')[0];
                    }
                    try
                    {
                        if (!string.IsNullOrEmpty(TRBL_TIME))
                        {
                            mis_subst_exp.TRBL_TIME = Convert.ToDateTime(TRBL_TIME);
                        }
                    }
                    catch (Exception)
                    {
                        log4net.ILog log = log4net.LogManager.GetLogger("变电所异常数据读取入库,日期转换失败");
                        log.Error("执行出错,日期为: " + TRBL_TIME);
                    }
                    mis_subst_exp.SPW_TP = dt.Rows[i]["供电类型"].ToString();
                    mis_subst_exp.DEV_NAME = dt.Rows[i]["设备名称"].ToString();
                    mis_subst_exp.TRBL_SN = string.IsNullOrEmpty(dt.Rows[i]["故障序号"].ToString()) ? -1 : Convert.ToInt32(dt.Rows[i]["故障序号"].ToString());
                    if (!string.IsNullOrEmpty(dt.Rows[i]["故障内容"].ToString()))
                    {
                        mis_subst_exp.TRBL_CNT = dt.Rows[i]["故障内容"].ToString().Replace("\r\n", ";").Replace("\n", ";").Replace("\r", ";");
                    }
                    mis_subst_exp.LD_USR = Public.GetCurrentUser().PersonName;
                    mis_subst_exp.LD_TIME = DateTime.Now;

                    int count = ADO.SUBST_EXP.getSub_ExpCount(mis_subst_exp.SUBST_NAME, mis_subst_exp.DEV_NAME, mis_subst_exp.TRBL_SN, mis_subst_exp.TRBL_TIME);
                    if (count <= 0)
                    {
                        list.Add(mis_subst_exp);
                    }
                }
            }
            if (list.Count > 0)
            {
                sql.Append("begin ");
                for (int i = 0; i < list.Count; i++)
                {
                    string insert = string.Format(@" INSERT INTO MIS_SUBST_EXP (ID,REC_NO,SUBST_CODE,SUBST_NAME,TRBL_TIME,SPW_TP,DEV_NAME,TRBL_SN,TRBL_CNT,LD_USR,LD_TIME) values ('{0}',{1},'{2}','{3}',TO_DATE('{4}','YYYY-MM-DD HH24:MI:SS'),'{5}','{6}',{7},'{8}','{9}',TO_DATE('{10}','YYYY-MM-DD HH24:MI:SS')); ", list[i].ID, list[i].REC_NO, list[i].SUBST_CODE, list[i].SUBST_NAME, list[i].TRBL_TIME, list[i].SPW_TP, list[i].DEV_NAME, list[i].TRBL_SN, list[i].TRBL_CNT, list[i].LD_USR, list[i].LD_TIME);
                    sql.Append(insert);
                }
                sql.Append(" end;");
                DbHelperOra.ExecuteSql(sql.ToString());
            }
        }
    }
    public string getSubstationCode(string name)
    {
        string re = "";
        if (!string.IsNullOrEmpty(name))
        {
            Substation[] sub = Api.Util.Common.substationDic.Values.ToArray();
            IList<Substation> subList = (from l in sub where l.SUBSTATION_NAME == name select l).ToArray();
            if (subList.Count > 0)
            {
                re = subList[0].SUBSTATION_CODE;
            }
            else
            {
                re = name;
            }
        }
        return re;
    }

    public void QueryErrorList()
    {
        string LINE_CODE = HttpContext.Current.Request["LINE_CODE"];//线路编码
        string SUBSTATION_NAME = HttpContext.Current.Request["SUBSTATION_NAME"];//变电所编码
        int PAGESIZE = string.IsNullOrEmpty(HttpContext.Current.Request["PAGESIZE"]) ? 30 : Convert.ToInt32(HttpContext.Current.Request["PAGESIZE"]);//当前页
        int CURRENTPAGE = string.IsNullOrEmpty(HttpContext.Current.Request["CURRENTPAGE"]) ? 1 : Convert.ToInt32(HttpContext.Current.Request["CURRENTPAGE"]);//当前页

        System.Data.DataSet ds = new System.Data.DataSet();

        ds = ADO.SUBST_EXP.GetSub_ExpList(LINE_CODE, SUBSTATION_NAME, PAGESIZE, CURRENTPAGE);
        StringBuilder json = new StringBuilder();
        json.Append("{\"data\":[");

        if (ds != null && ds.Tables.Count > 0)
        {
            for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
            {

                DateTime TRBL_TIME = new DateTime();
                if (!string.IsNullOrEmpty(ds.Tables[0].Rows[i]["TRBL_TIME"].ToString()))
                {
                    TRBL_TIME = Convert.ToDateTime(ds.Tables[0].Rows[i]["TRBL_TIME"].ToString());
                }

                string wz = getSubstactionPosition(ds.Tables[0].Rows[i]);
                if (!string.IsNullOrEmpty(HttpContext.Current.Request["remove"]) && !string.IsNullOrEmpty(wz))
                {
                    wz = wz.Replace("&nbsp;"," ");
                }

                json.Append("{");

                json.Append("\"SUBSTATION_NAME\":\"" + ds.Tables[0].Rows[i]["SUBSTATION_NAME"] + "\",");//变电所名称
                json.Append("\"SUBSTATION_CODE\":\"" + ds.Tables[0].Rows[i]["SUBSTATION_CODE"] + "\",");//变电所编码
                json.Append("\"TRBL_TIME\":\"" + ((TRBL_TIME != null && TRBL_TIME == DateTime.MinValue) ? "" : TRBL_TIME.ToString("yyyy-MM-dd HH:mm:ss")) + "\",");//故障时间
                json.Append("\"DEV_NAME\":\"" + ds.Tables[0].Rows[i]["DEV_NAME"] + "\",");//设备名称
                json.Append("\"TRBL_SN\":\"" + ds.Tables[0].Rows[i]["TRBL_SN"] + "\",");//故障序号
                if (!string.IsNullOrEmpty(ds.Tables[0].Rows[i]["TRBL_CNT"].ToString()))
                {
                    string TRBL_CNT = ds.Tables[0].Rows[i]["TRBL_CNT"].ToString();
                    int count = TRBL_CNT.Split(';').Length;
                    json.Append("\"TRBL_CNT_TITLE\":\"" + TRBL_CNT.Split(';')[0] + "\",");
                    json.Append("\"TRBL_CNT_CONTEXT\":[");
                    for (int j = 1; j < count; j++)
                    {
                        json.Append("\"" + TRBL_CNT.Split(';')[j] + "\"");
                        if (j < count - 1)
                        {
                            json.Append(",");
                        }
                    }
                    json.Append("],");
                }
                else
                {
                    json.Append("\"TRBL_CNT_TITLE\":\"" + "" + "\",");
                    json.Append("\"TRBL_CNT_CONTEXT\":[" + "" + "],");
                }
                json.Append("\"WZ\":\"" + wz + "\"");

                json.Append("}");

                if (i < ds.Tables[0].Rows.Count - 1)
                {
                    json.Append(",");
                }
            }
        }

        json.Append("]");

        PageHelper ph = new PageHelper();
        int total = 0;
        if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
        {
            total = Convert.ToInt32(ds.Tables[0].Rows[0]["TOTALCOUNT"]);
        }
        json.Append("," + ph.getPageJson(total, CURRENTPAGE, PAGESIZE));
        json.Append("}");

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);

    }
    public void QueryAllList()
    {
        System.Data.DataSet ds = new System.Data.DataSet();

        ds = ADO.SUBST_EXP.getAllSubList();
        StringBuilder json = new StringBuilder();
        json.Append("{\"data\":[");

        if (ds != null && ds.Tables.Count > 0)
        {
            List<CoordinateConvert.Point2> newlist = new List<CoordinateConvert.Point2>();
            newlist = GPSTranAndUpdate_list(ds, "GIS_LON", "GIS_LAT", "ID", "MIS_SUBSTATION");
            int t = 0;
            for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
            {
                string GIS_LON_O = ds.Tables[0].Rows[i]["GIS_LON_O"].ToString();
                string GIS_LAT_O = ds.Tables[0].Rows[i]["GIS_LAT_O"].ToString();
                string GIS_LON = ds.Tables[0].Rows[i]["GIS_LON"].ToString();
                string GIS_LAT = ds.Tables[0].Rows[i]["GIS_LAT"].ToString();

                DateTime TRBL_TIME = new DateTime();
                if (!string.IsNullOrEmpty(ds.Tables[0].Rows[i]["TRBL_TIME"].ToString()))
                {
                    TRBL_TIME = Convert.ToDateTime(ds.Tables[0].Rows[i]["TRBL_TIME"].ToString());
                }

                json.Append("{");

                json.Append("\"SUBSTATION_NAME\":\"" + ds.Tables[0].Rows[i]["SUBSTATION_NAME"] + "\",");//变电所名称
                json.Append("\"SUBSTATION_CODE\":\"" + ds.Tables[0].Rows[i]["SUBSTATION_CODE"] + "\",");//变电所编码
                json.Append("\"LINE_NAME\":\"" + ds.Tables[0].Rows[i]["LINE_NAME"] + "\",");//变电所名称
                json.Append("\"LINE_CODE\":\"" + ds.Tables[0].Rows[i]["LINE_CODE"] + "\",");//变电所编码
                json.Append("\"TRBL_TIME\":\"" + ((TRBL_TIME != null && TRBL_TIME == DateTime.MinValue) ? "" : TRBL_TIME.ToString("yyyy-MM-dd HH:mm:ss")) + "\",");//故障时间

                //if ((string.IsNullOrEmpty(GIS_LON) || string.IsNullOrEmpty(GIS_LAT)) && (!string.IsNullOrEmpty(GIS_LON_O) && Convert.ToDouble(GIS_LON_O) != Convert.ToDouble(0) && !string.IsNullOrEmpty(GIS_LAT_O) && Convert.ToDouble(GIS_LAT_O) != Convert.ToDouble(0)))
                //{
                //    string bPoint = CoordinateConvert.convert2B(GIS_LON_O, GIS_LAT_O);
                //}
                if ((string.IsNullOrEmpty(GIS_LON) || string.IsNullOrEmpty(GIS_LAT) || Convert.ToDouble(GIS_LON) == Convert.ToDouble(0) || Convert.ToDouble(GIS_LAT) == Convert.ToDouble(0)) && (!string.IsNullOrEmpty(GIS_LON_O) && Convert.ToDouble(GIS_LON_O) != Convert.ToDouble(0) && !string.IsNullOrEmpty(GIS_LAT_O) && Convert.ToDouble(GIS_LAT_O) != Convert.ToDouble(0)))
                {
                    if (newlist.Count > 0 && t < newlist.Count)
                    {
                        if (newlist[t].x != "0" && newlist[t].x != "")
                        {
                            json.Append("\"GIS_LON\":\"" + newlist[t].x + "\",");//百度经度
                            json.Append("\"GIS_LAT\":\"" + newlist[t].y + "\",");//百度纬度
                        }
                        else
                        {
                            json.Append("\"GIS_LON\":\"" + GIS_LON + "\",");//百度经度
                            json.Append("\"GIS_LAT\":\"" + GIS_LAT + "\",");//百度纬度
                        }
                        t = t + 1;
                    }
                }
                else
                {
                    json.Append("\"GIS_LON\":\"" + GIS_LON + "\",");//百度经度
                    json.Append("\"GIS_LAT\":\"" + GIS_LAT + "\",");//百度纬度
                }
                if (!string.IsNullOrEmpty(ds.Tables[0].Rows[i]["SEID"].ToString()))
                {
                    json.Append("\"ERROR\":\"" + "True" + "\"");
                }
                else
                {
                    json.Append("\"ERROR\":\"" + "False" + "\"");
                }

                json.Append("}");

                if (i < ds.Tables[0].Rows.Count - 1)
                {
                    json.Append(",");
                }
            }
        }

        json.Append("]");
        int total = 0;
        int ERRORCOUNT = 0;
        int RIRHTCOUNT = 0;
        if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
        {
            total = Convert.ToInt32(ds.Tables[0].Rows[0]["TOTALCOUNT"]);
            ERRORCOUNT = Convert.ToInt32(ds.Tables[0].Rows[0]["ERRORCOUNT"]);
            RIRHTCOUNT = total - ERRORCOUNT;
        }
        json.Append("," + "\"TOTALCOUNT\":\"" + total + "\",");
        json.Append("\"ERRORCOUNT\":\"" + ERRORCOUNT + "\",");
        json.Append("\"RIRHTCOUNT\":\"" + RIRHTCOUNT + "\"");
        json.Append("}");

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }
    public string getSubstactionPosition(DataRow dr)
    {
        int wzInfo = 0;
        string wz = "";
        try
        {
            //线路、区站、桥隧
            if (!string.IsNullOrEmpty(dr["LINE_NAME"].ToString()))
            {
                wz += "&nbsp;" + dr["LINE_NAME"].ToString();
                wzInfo++;
            }

            if (!string.IsNullOrEmpty(dr["POSITION_NAME"].ToString()))
            {
                wz += "&nbsp;" + dr["POSITION_NAME"].ToString();
                wzInfo++;
            }

            //if (!string.IsNullOrEmpty(BRG_TUN_NAME))
            //{
            //    wz += "&nbsp;" + BRG_TUN_NAME;
            //    wzInfo++;
            //}

            //行别
            if (!string.IsNullOrEmpty(dr["DIRECTION"].ToString()))
            {
                wz += "&nbsp;" + dr["DIRECTION"].ToString() + "&nbsp;";
                wzInfo++;
            }

            //公里标

            if (!string.IsNullOrEmpty(dr["KM_MARK"].ToString()) && Convert.ToInt32(dr["KM_MARK"]) < my_const.MAX_KM)
            {
                string km = PublicMethod.kmtoString(dr["KM_MARK"].ToString());
                wz += km;
                if (!string.IsNullOrEmpty(km))
                {
                    wzInfo++;
                }
            }

            ////支柱号
            //if (!string.IsNullOrEmpty(POLE_NUMBER))
            //{
            //    if (Api.Util.Common.FunEnable("Fun_OneGear") == true && !string.IsNullOrEmpty(DEVICE_ID))
            //    {
            //        wz += "&nbsp;<a href=/Common/MOnePoleData/oneChockoneGAN.html?id=polenoinfo&device_id=" + DEVICE_ID + " data-rel=tooltip title=查看杆号详细情况  target=_blank>" + POLE_NUMBER + "支柱</a>";
            //    }
            //    else
            //    {
            //        wz += "&nbsp;" + POLE_NUMBER + "支柱";
            //    }
            //    wzInfo++;
            //}

            ////交路相关
            //string CROSS_str = "";
            //if (!string.IsNullOrEmpty(ROUTING_NO) && ROUTING_NO != "-1")
            //{
            //    if (Convert.ToInt32(ROUTING_NO) < 1000)
            //    {
            //        CROSS_str += ROUTING_NO + "号交路";
            //        if (!string.IsNullOrEmpty(AREA_NO) && AREA_NO.Trim() != "-1")
            //        {
            //            CROSS_str += "&nbsp;运用区段:" + AREA_NO;
            //        }
            //    }
            //}

            //if (!string.IsNullOrEmpty(STATION_NO) && STATION_NO != "-1")
            //{
            //    if (Convert.ToInt32(STATION_NO) < 1000)
            //    {
            //        CROSS_str += "&nbsp;" + STATION_NO + "号站点 " + STATION_NAME;
            //    }
            //}

            //if (CROSS_str != "")
            //{
            //    wz += "（" + CROSS_str + "）";
            //    wzInfo++;
            //}

            //if (TAX_MONITOR_STATUS == "0" && wzInfo > 0)
            //{
            //    wz += string.Format("&nbsp;&nbsp;<font color=#9A8178>{0}</font>", my_const.TAX_MONITOR_STATUS);
            //}
        }
        catch { }
        return wz;
    }

    public List<CoordinateConvert.Point2> GPSTranAndUpdate_list(System.Data.DataSet ds, string GPS_X_NAME, string GPS_Y_NAME, string ID_NAME, string TABLE_NAME)
    {
        List<CoordinateConvert.Point2> oldlist = new List<CoordinateConvert.Point2>();
        List<CoordinateConvert.Point2> relist = new List<CoordinateConvert.Point2>();

        for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
        {
            string GIS_LON_O = ds.Tables[0].Rows[i]["GIS_LON_O"].ToString();
            string GIS_LAT_O = ds.Tables[0].Rows[i]["GIS_LAT_O"].ToString();
            string GIS_LON = ds.Tables[0].Rows[i]["GIS_LON"].ToString();
            string GIS_LAT = ds.Tables[0].Rows[i]["GIS_LAT"].ToString();

            if ((string.IsNullOrEmpty(GIS_LON) || string.IsNullOrEmpty(GIS_LAT)||Convert.ToDouble(GIS_LON)==Convert.ToDouble(0)||Convert.ToDouble(GIS_LAT)==Convert.ToDouble(0)) && (!string.IsNullOrEmpty(GIS_LON_O) && Convert.ToDouble(GIS_LON_O) != Convert.ToDouble(0) && !string.IsNullOrEmpty(GIS_LAT_O) && Convert.ToDouble(GIS_LAT_O) != Convert.ToDouble(0)))
            {
                CoordinateConvert.Point2 point2 = new CoordinateConvert.Point2();
                point2.x_o = GIS_LON_O;
                point2.y_o = GIS_LAT_O;
                point2.ID = ds.Tables[0].Rows[i]["ID"].ToString();
                oldlist.Add(point2);
            }
        }
        TransAndUpdate_p m_p = new TransAndUpdate_p();
        m_p.gps_x_name = GPS_X_NAME;
        m_p.gps_y_name = GPS_Y_NAME;
        m_p.ID_name = ID_NAME;
        m_p.tableName = TABLE_NAME;
        m_p.oldlist = oldlist;
        GPSTransform t = new GPSTransform();
        relist = t.TransAndUpdate(m_p);
        return relist;
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}