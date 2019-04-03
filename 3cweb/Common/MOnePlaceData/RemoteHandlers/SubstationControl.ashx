<%@ WebHandler Language="C#" Class="SubstationControl" %>

using System;
using System.Web;
using Api.Foundation.entity.Cond;
using Api.Foundation.entity.Foundation;
using System.Text;
using System.Collections.Generic;

public class SubstationControl : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        try
        {
            string action = context.Request["action"];
            switch (action)
            {
                case "Add":
                    addSubstation();
                    break;
                case "Delete":
                    deleteSubstation();
                    break;
                case "Update":
                    updateSubstation();
                    break;
                case "Detail":
                    QuerySubstationDetail();
                    break;
                case "QueryList":
                    QuerySubstationList();
                    break;
                default:
                    break;
            }
        }
        catch (Exception ex)
        {

            log4net.ILog log = log4net.LogManager.GetLogger("变电所管理");
            log.Error("执行出错", ex);
        }
    }
    public void addSubstation()
    {
        bool sign = false;
        string context = "添加失败";

        context = ReInsertSubstion();

        if (string.IsNullOrEmpty(context))
        {
            Substation substation = new Substation();
            substation = getSubstation("add");

            try
            {
                sign = Api.ServiceAccessor.GetFoundationService().substationAdd(substation);
                context = "添加成功";
            }
            catch (Exception ex)
            {
                log4net.ILog log = log4net.LogManager.GetLogger("新增变电所信息");
                log.Error("执行出错", ex);
                context = "添加失败";
            }
        }

        StringBuilder json = new StringBuilder();
        json.Append("{\"sign\":\"" + sign + "\",\"content\":\"" + context + "\"}");

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }

    public void deleteSubstation()
    {
        string ID = HttpContext.Current.Request["ID"];//主键
        string SUBSTATION_CODE = HttpContext.Current.Request["SUBSTATION_CODE"];//变电所编码

        bool sign = false;
        if (!string.IsNullOrEmpty(ID)&&!string.IsNullOrEmpty(SUBSTATION_CODE))
        {
            try
            {
                //sign = Api.ServiceAccessor.GetFoundationService().substationDeleteDPC(ID);
                StringBuilder sql = new StringBuilder();
                sql.Append("begin ");
                sql.Append("DELETE FROM MIS_SUBSTATION WHERE ID = '" + ID + "';");
                sql.Append("DELETE FROM MIS_SUBST_APPRS WHERE SUBST_ID = '" + SUBSTATION_CODE + "';");
                sql.Append("DELETE FROM MIS_SUBST_NOTE WHERE SUBST_ID = '" + SUBSTATION_CODE + "';");
                sql.Append("DELETE FROM MIS_SUBST_RNDT_SPFD WHERE SUBST_ID = '" + SUBSTATION_CODE + "';");
                sql.Append(" end;");
                int rec = DbHelperOra.ExecuteSql(sql.ToString());
                if (rec > 0)
                {
                    try
                    {
                        SubstationCond cond = new SubstationCond();
                        cond.ID = ID;
                        cond.SUBSTATION_CODE = SUBSTATION_CODE;
                        Api.Util.Common.Delete(cond);
                    }
                    catch (Exception)
                    {

                    }
                    sign = true;
                }

            }
            catch (Exception ex)
            {
                log4net.ILog log = log4net.LogManager.GetLogger("删除变电所信息");
                log.Error("执行出错", ex);
            }
        }
        StringBuilder json = new StringBuilder();
        json.Append("{\"sign\":\"" + sign + "\"}");

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }
    public void updateSubstation()
    {

        Substation substation = new Substation();
        substation = getSubstation("update");

        bool sign = false;

        try
        {
            sign = Api.ServiceAccessor.GetFoundationService().substationUpdate(substation);
        }
        catch (Exception ex)
        {
            log4net.ILog log = log4net.LogManager.GetLogger("修改变电所信息");
            log.Error("执行出错", ex);
        }

        StringBuilder json = new StringBuilder();
        json.Append("{\"sign\":\"" + sign + "\"}");

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }
    public void QuerySubstationDetail()
    {
        string ID = HttpContext.Current.Request["ID"];
        Substation substation = new Substation();
        substation = Api.ServiceAccessor.GetFoundationService().querySubstationDPC(ID);

        StringBuilder json = new StringBuilder();
        json.Append("{\"ID\":\"" + substation.ID + "\",");

        json.Append("\"SUBSTATION_NAME\":\"" + substation.SUBSTATION_NAME + "\",");
        json.Append("\"SUBSTATION_CODE\":\"" + substation.SUBSTATION_CODE + "\",");
        json.Append("\"LINE_NAME\":\"" + substation.LINE_NAME + "\",");
        json.Append("\"LINE_CODE\":\"" + substation.LINE_CODE + "\",");
        json.Append("\"DIRECTION\":\"" + substation.DIRECTION + "\",");
        json.Append("\"KM_MARK\":\"" + substation.SUBKM + "\",");
        json.Append("\"BUREAU_NAME\":\"" + substation.BUREAU_NAME + "\",");
        json.Append("\"BUREAU_CODE\":\"" + substation.BUREAU_CODE + "\",");
        json.Append("\"POWER_SECTION_NAME\":\"" + substation.POWER_SECTION_NAME + "\",");
        json.Append("\"POWER_SECTION_CODE\":\"" + substation.POWER_SECTION_CODE + "\",");
        json.Append("\"WORKSHOP_NAME\":\"" + substation.WORKSHOP_NAME + "\",");
        json.Append("\"WORKSHOP_CODE\":\"" + substation.WORKSHOP_CODE + "\",");
        json.Append("\"ORG_CODE\":\"" + substation.ORG_CODE + "\",");
        json.Append("\"ORG_NAME\":\"" + substation.ORG_NAME + "\",");
        json.Append("\"PWMDL_CODE\":\"" + substation.PWMDL + "\",");
        json.Append("\"PWMDL_NAME\":\"" + getCode_Name(substation.PWMDL) + "\",");
        json.Append("\"START_PWRNG\":\"" + substation.USKM + "\",");
        json.Append("\"END_PWRNG\":\"" + substation.UEKM + "\",");
        json.Append("\"GIS_LON_O\":\"" + substation.GIS_LON_O + "\",");
        json.Append("\"GIS_LAT_O\":\"" + substation.GIS_LAT_O + "\",");
        json.Append("\"NATURE\":\"" + substation.NATURE + "\",");
        json.Append("\"BSDESC\":\"" + substation.BSDESC + "\",");
        json.Append("\"BSDESC_BR\":\"" + (string.IsNullOrEmpty(substation.BSDESC) ? "" : substation.BSDESC.Replace("%0A", "<br/>")) + "\",");
        json.Append("\"NOTE\":\"" + substation.NOTE + "\",");
        json.Append("\"TAREA\":\"" + substation.TAREA + "\",");
        json.Append("\"BTEARA\":\"" + substation.BTEARA + "\",");
        json.Append("\"PBEARA\":\"" + substation.PBEARA + "\",");
        json.Append("\"RMNUM\":\"" + substation.RMNUM + "\",");
        json.Append("\"FSHD\":\"" + (substation.FSHD == DateTime.MinValue ? "" : substation.FSHD.ToString("yyyy-MM-dd HH:mm:ss")) + "\",");
        json.Append("\"NTKM\":\"" + substation.NTKM + "\",");
        json.Append("\"DVNUM\":\"" + substation.DVNUM + "\",");
        json.Append("\"RNNO\":\"" + substation.RNNO + "\",");
        json.Append("\"RNNM\":\"" + substation.RNNM + "\",");
        json.Append("\"INSDATE\":\"" + (substation.INSDATE == DateTime.MinValue ? "" : substation.INSDATE.ToString("yyyy-MM-dd HH:mm:ss")) + "\",");
        json.Append("\"OPTDATE\":\"" + (substation.OPTDATE == DateTime.MinValue ? "" : substation.OPTDATE.ToString("yyyy-MM-dd HH:mm:ss")) + "\",");
        json.Append("\"OPTSTS\":\"" + substation.OPTSTS + "\",");
        json.Append("\"RECQ\":\"" + substation.RECQ + "\",");
        json.Append("\"SPEQ\":\"" + substation.SPEQ + "\",");
        json.Append("\"TREQ\":\"" + substation.TREQ + "\",");
        json.Append("\"NTREQ\":\"" + substation.NTREQ + "\",");
        json.Append("\"SUEQ\":\"" + substation.SUEQ + "\",");
        json.Append("\"INPFPNM\":\"" + substation.INPFPNM + "\",");
        json.Append("\"INPFPCD\":\"" + substation.INPFPCD + "\",");
        json.Append("\"RVTG\":\"" + substation.RVTG + "\",");
        json.Append("\"VTGDGR\":\"" + substation.VTGDGR + "\",");
        json.Append("\"INPFMDL_CODE\":\"" + substation.INPFMDL + "\",");
        json.Append("\"INPFMDL_NAME\":\"" + getCode_Name(substation.INPFMDL) + "\",");
        json.Append("\"INPFLEN\":\"" + substation.INPFLEN + "\",");
        json.Append("\"INPSNM\":\"" + substation.INPSNM + "\",");
        json.Append("\"INPSPNM\":\"" + substation.INPSPNM + "\",");
        json.Append("\"INPSPCD\":\"" + substation.INPSPCD + "\",");
        json.Append("\"INPSMDL_CODE\":\"" + substation.INPSMDL + "\",");
        json.Append("\"INPSMDL_NAME\":\"" + getCode_Name(substation.INPSMDL) + "\",");
        json.Append("\"INPSLEN\":\"" + substation.INPSLEN + "\",");
        json.Append("\"FDFNM\":\"" + substation.FDFNM + "\",");
        json.Append("\"FDFNO\":\"" + substation.FDFNO + "\",");
        json.Append("\"FDSNM\":\"" + substation.FDSNM + "\",");
        json.Append("\"FDSNO\":\"" + substation.FDSNO + "\",");
        json.Append("\"FDSDNM\":\"" + substation.FDSDNM + "\",");
        json.Append("\"FDSDNO\":\"" + substation.FDSDNO + "\",");
        json.Append("\"FDTHNM\":\"" + substation.FDTHNM + "\",");
        json.Append("\"FDTHNO\":\"" + substation.FDTHNO + "\"}");

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);

    }
    public void QuerySubstationList()
    {
        SubstationCond substationcond = new SubstationCond();
        substationcond = my_substation.getDPCSubstationCond();
        substationcond.orderBy = " LINE_CODE,POSITION_CODE DESC";
        int PAGESIZE = string.IsNullOrEmpty(HttpContext.Current.Request["rp"]) ? 30 : Convert.ToInt32(HttpContext.Current.Request["rp"]);//当前页
        int CURRENTPAGE = string.IsNullOrEmpty(HttpContext.Current.Request["page"]) ? 1 : Convert.ToInt32(HttpContext.Current.Request["page"]);//当前页
        substationcond.startRowNum = (CURRENTPAGE - 1) * PAGESIZE + 1;
        substationcond.endRowNum = CURRENTPAGE * PAGESIZE;

        IList<Substation> list = new List<Substation>();
        list = Api.ServiceAccessor.GetFoundationService().querySubstationDPC_PAGE(substationcond, false);

        StringBuilder json = new StringBuilder();
        json.Append("{\"rows\":[");

        for (int i = 0; i < list.Count; i++)
        {
            json.Append("{\"ID\":\"C" + list[i].ID + "\",");
            json.Append("\"SUBSTATION_NAME\":\"" + list[i].SUBSTATION_NAME + "\",");
            json.Append("\"SUBSTATION_CODE\":\"" + list[i].SUBSTATION_CODE + "\",");
            json.Append("\"LINE_NAME\":\"" + list[i].LINE_NAME + "\",");
            json.Append("\"LINE_CODE\":\"" + list[i].LINE_CODE + "\",");
            json.Append("\"DIRECTION\":\"" + list[i].DIRECTION + "\",");
            json.Append("\"KM_MARK\":\"" + PublicMethod.KmtoString((list[i].SUBKM.HasValue ? list[i].SUBKM.ToString() : "")) + "\",");
            json.Append("\"PWMDL_CODE\":\"" + list[i].PWMDL + "\",");//供电方式
            json.Append("\"PWMDL_NAME\":\"" + getCode_Name(list[i].PWMDL) + "\",");//供电方式
            json.Append("\"BUREAU_NAME\":\"" + list[i].BUREAU_NAME + "\",");
            json.Append("\"BUREAU_CODE\":\"" + list[i].BUREAU_CODE + "\",");
            json.Append("\"POWER_SECTION_NAME\":\"" + list[i].POWER_SECTION_NAME + "\",");
            json.Append("\"POWER_SECTION_CODE\":\"" + list[i].POWER_SECTION_CODE + "\",");
            json.Append("\"WORKSHOP_NAME\":\"" + list[i].WORKSHOP_NAME + "\",");
            json.Append("\"WORKSHOP_CODE\":\"" + list[i].WORKSHOP_CODE + "\",");
            json.Append("\"ORG_NAME\":\"" + list[i].ORG_NAME + "\",");
            json.Append("\"ORG_CODE\":\"" + list[i].ORG_CODE + "\",");
            json.Append("\"CZ\":\"<a href=javascript:editInformation(C" + list[i].ID + ")>编辑</a>&nbsp;<a href=javascript:checkInformation(C" + list[i].ID + ")>查看</a>&nbsp;<a href=javascript:delInformation(C" + list[i].ID + ")>删除</a>\"}");
            if (i < list.Count - 1)
            {
                json.Append(",");
            }
        }

        json.Append("]");

        int total = 0;
        if (list.Count > 0)
        {
            total = Convert.ToInt32(list[0].MY_INT_1);
        }
        json.Append("," + "\"page\":\"" +CURRENTPAGE +"\",\"rp\":\"" + PAGESIZE + "\",\"total\":\"" + total + "\"" + "}");


        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }

    public Substation getSubstation(string type)
    {
        string ID = HttpContext.Current.Request["ID"];//ID
        string SUBSTATION_NAME = HttpContext.Current.Request["SUBSTATION_NAME"];//变电所名称
        string SUBSTATION_CODE = HttpContext.Current.Request["SUBSTATION_CODE"];//变电所编码
        string LINE_NAME = HttpContext.Current.Request["LINE_NAME"];//线路
        string LINE_CODE = HttpContext.Current.Request["LINE_CODE"];
        string DIRECTION = HttpContext.Current.Request["DIRECTION"];//行别
        string KM_MARK = HttpContext.Current.Request["KM_MARK"];//公里标
        string BUREAU_NAME = HttpContext.Current.Request["BUREAU_NAME"];//局
        string BUREAU_CODE = HttpContext.Current.Request["BUREAU_CODE"];
        string POWER_SECTION_NAME = HttpContext.Current.Request["POWER_SECTION_NAME"];//段
        string POWER_SECTION_CODE = HttpContext.Current.Request["POWER_SECTION_CODE"];
        string WORKSHOP_NAME = HttpContext.Current.Request["WORKSHOP_NAME"];//车间
        string WORKSHOP_CODE = HttpContext.Current.Request["WORKSHOP_CODE"];
        string ORG_NAME = HttpContext.Current.Request["ORG_NAME"];//班组（工区）
        string ORG_CODE = HttpContext.Current.Request["ORG_CODE"];//
        string PWMDL = HttpContext.Current.Request["PWMDL_CODE"];//供电方式
        string START_PWRNG = HttpContext.Current.Request["START_PWRNG"];//开始供电范围公里标
        string END_PWRNG = HttpContext.Current.Request["END_PWRNG"];//结束供电范围公里标
        string GIS_LON_O = HttpContext.Current.Request["GIS_LON_O"];//经度
        string GIS_LAT_O = HttpContext.Current.Request["GIS_LAT_O"];//纬度
        string NATURE = HttpContext.Current.Request["NATURE"];//性质
        string BSDESC = HttpContext.Current.Request["BSDESC"];//基本概况
        string NOTE = HttpContext.Current.Request["NOTE"];//其他

        string TAREA = HttpContext.Current.Request["TAREA"];//占地总面积
        string BTEARA = HttpContext.Current.Request["BTEARA"];//房屋建筑总面积
        string PBEARA = HttpContext.Current.Request["PBEARA"];//生产房屋面积
        string RMNUM = HttpContext.Current.Request["RMNUM"];//房间数量
        string FSHD = HttpContext.Current.Request["FSHD"];//竣工时间
        string NTKM = HttpContext.Current.Request["NTKM"];//换算接触网条公里
        string DVNUM = HttpContext.Current.Request["DVNUM"];//所设备数量汇总

        string RNNO = HttpContext.Current.Request["RNNO"];// 运行编号
        string RNNM = HttpContext.Current.Request["RNNM"];//运行名称
        string INSDATE = HttpContext.Current.Request["INSDATE"];//安装日期
        string OPTDATE = HttpContext.Current.Request["OPTDATE"];//投运日期
        string OPTSTS = HttpContext.Current.Request["OPTSTS"];//运行状态
        string RECQ = HttpContext.Current.Request["RECQ"];//受电量
        string SPEQ = HttpContext.Current.Request["SPEQ"];//供电量
        string TREQ = HttpContext.Current.Request["TREQ"];//牵引供电量
        string NTREQ = HttpContext.Current.Request["NTREQ"];//非牵引供电量
        string SUEQ = HttpContext.Current.Request["SUEQ"];//自用电量
        string INPFNM = HttpContext.Current.Request["INPFNM"];//进线电源一名称
        string INPFPNM = HttpContext.Current.Request["INPFPNM"];//第一路进线上级变电站名称
        string INPFPCD = HttpContext.Current.Request["INPFPCD"];//第一路进线上级变电站编码
        string RVTG = HttpContext.Current.Request["RVTG"];//受电电压
        string VTGDGR = HttpContext.Current.Request["VTGDGR"];//电压等级
        string INPFMDL = HttpContext.Current.Request["INPFMDL_CODE"];//第一路进线电源引入方式
        string INPFLEN = HttpContext.Current.Request["INPFLEN"];//第一路进线电源线路长度
        string INPSNM = HttpContext.Current.Request["INPSNM"];//进线电源二名称
        string INPSPNM = HttpContext.Current.Request["INPSPNM"];//第二路进线上级变电站名称
        string INPSPCD = HttpContext.Current.Request["INPSPCD"];//第二路进线上级变电站编码
        string INPSMDL = HttpContext.Current.Request["INPSMDL_CODE"];//第二路进线电源引入方式
        string INPSLEN = HttpContext.Current.Request["INPSLEN"];//第二路进线电源线路长度
        string FDFNM = HttpContext.Current.Request["FDFNM"];//馈线一名称
        string FDFNO = HttpContext.Current.Request["FDFNO"];//馈线一编号
        string FDSNM = HttpContext.Current.Request["FDSNM"];//馈线二名称
        string FDSNO = HttpContext.Current.Request["FDSNO"];//馈线二编号
        string FDSDNM = HttpContext.Current.Request["FDSDNM"];//馈线三名称
        string FDSDNO = HttpContext.Current.Request["FDSDNO"];//馈线三编号
        string FDTHNM = HttpContext.Current.Request["FDTHNM"];//馈线四名称
        string FDTHNO = HttpContext.Current.Request["FDTHNO"];//馈线四编号

        //int PAGESIZE = string.IsNullOrEmpty(HttpContext.Current.Request["PAGESIZE"]) ? 30 : Convert.ToInt32(string.IsNullOrEmpty(HttpContext.Current.Request["PAGESIZE"]));//当前页
        //int CURRENTPAGE = string.IsNullOrEmpty(HttpContext.Current.Request["CURRENTPAGE"]) ? 1 : Convert.ToInt32(string.IsNullOrEmpty(HttpContext.Current.Request["CURRENTPAGE"]));//当前页

        Substation substation = new Substation();
        if (type == "add")
        {
            if (!string.IsNullOrEmpty(ID))
            {
                substation.ID = ID;
            }
            else
            {
                substation.ID = "C" + Guid.NewGuid().ToString().Replace("-", "");
            }
        }
        else
        {
            substation.ID = ID;
            //substation = Api.ServiceAccessor.GetFoundationService().querySubstationDPC(ID);
        }

        substation.SUBSTATION_NAME = SUBSTATION_NAME;
        substation.SUBSTATION_CODE = SUBSTATION_CODE;
        substation.LINE_NAME = LINE_NAME;
        substation.LINE_CODE = LINE_CODE;
        substation.DIRECTION = DIRECTION;
        if (!string.IsNullOrEmpty(KM_MARK))
        {
            //if (DIRECTION == "下行")
            //{
            //    substation.KM_MARK_XX = Convert.ToInt32(KM_MARK);
            //}
            //else
            //{
            substation.SUBKM = Convert.ToInt32(KM_MARK);
            //}
        }
        substation.BUREAU_NAME = BUREAU_NAME;
        substation.BUREAU_CODE = BUREAU_CODE;
        substation.POWER_SECTION_NAME = POWER_SECTION_NAME;
        substation.POWER_SECTION_CODE = POWER_SECTION_CODE;
        substation.WORKSHOP_NAME = WORKSHOP_NAME;
        substation.WORKSHOP_CODE = WORKSHOP_CODE;
        substation.ORG_NAME = ORG_NAME;
        substation.ORG_CODE = ORG_CODE;
        substation.PWMDL = PWMDL;
        if (!string.IsNullOrEmpty(START_PWRNG))
        {
            //if (DIRECTION == "下行")
            //{
            //    substation.DSKM = Convert.ToInt32(START_PWRNG);
            //}
            //else
            //{
            substation.USKM = Convert.ToInt32(START_PWRNG);
            //}
        }
        if (!string.IsNullOrEmpty(END_PWRNG))
        {
            //if (DIRECTION == "下行")
            //{
            //    substation.DEKM = Convert.ToInt32(END_PWRNG);
            //}
            //else
            //{
            substation.UEKM = Convert.ToInt32(END_PWRNG);
            //}
        }
        if (!string.IsNullOrEmpty(GIS_LON_O))
        {
            substation.GIS_LON_O = Convert.ToDouble(GIS_LON_O);
        }
        if (!string.IsNullOrEmpty(GIS_LAT_O))
        {
            substation.GIS_LAT_O = Convert.ToDouble(GIS_LAT_O);
        }
        substation.BUREAU_NAME = BUREAU_NAME;
        substation.NATURE = NATURE;
        substation.BSDESC = Microsoft.JScript.GlobalObject.escape(BSDESC);
        substation.NOTE =  NOTE;
        if (!string.IsNullOrEmpty(TAREA))
        {
            substation.TAREA = Convert.ToDouble(TAREA);
        }
        if (!string.IsNullOrEmpty(BTEARA))
        {
            substation.BTEARA = Convert.ToDouble(BTEARA);
        }
        if (!string.IsNullOrEmpty(PBEARA))
        {
            substation.PBEARA = Convert.ToDouble(PBEARA);
        }
        if (!string.IsNullOrEmpty(RMNUM))
        {
            substation.RMNUM = Convert.ToInt32(RMNUM);
        }
        if (!string.IsNullOrEmpty(FSHD))
        {
            substation.FSHD = Convert.ToDateTime(FSHD);
        }
        if (!string.IsNullOrEmpty(NTKM))
        {
            substation.NTKM = Convert.ToDouble(NTKM);
        }
        if (!string.IsNullOrEmpty(DVNUM))
        {
            substation.DVNUM = Convert.ToInt32(DVNUM);
        }
        substation.RNNO = RNNO;
        substation.RNNM = RNNM;
        if (!string.IsNullOrEmpty(INSDATE))
        {
            substation.INSDATE = Convert.ToDateTime(INSDATE);
        }
        if (!string.IsNullOrEmpty(OPTDATE))
        {
            substation.OPTDATE = Convert.ToDateTime(OPTDATE);
        }
        substation.OPTSTS = OPTSTS;
        if (!string.IsNullOrEmpty(RECQ))
        {
            substation.RECQ = Convert.ToDouble(RECQ);
        }
        if (!string.IsNullOrEmpty(SPEQ))
        {
            substation.SPEQ = Convert.ToDouble(SPEQ);
        }
        if (!string.IsNullOrEmpty(TREQ))
        {
            substation.TREQ = Convert.ToDouble(TREQ);
        }
        if (!string.IsNullOrEmpty(NTREQ))
        {
            substation.NTREQ = Convert.ToDouble(NTREQ);
        }
        if (!string.IsNullOrEmpty(SUEQ))
        {
            substation.SUEQ = Convert.ToDouble(SUEQ);
        }
        substation.INPFNM = INPFNM;
        substation.INPFPNM = INPFPNM;
        substation.INPFPCD = INPFPCD;
        if (!string.IsNullOrEmpty(RVTG))
        {
            substation.RVTG = Convert.ToDouble(RVTG);
        }
        substation.VTGDGR = VTGDGR;
        substation.INPFMDL = INPFMDL;
        if (!string.IsNullOrEmpty(INPFLEN))
        {
            substation.INPFLEN = Convert.ToDouble(INPFLEN);
        }
        substation.INPSNM = INPSNM;
        substation.INPSPNM = INPSPNM;
        substation.INPSPCD = INPSPCD;
        substation.INPSMDL = INPSMDL;
        if (!string.IsNullOrEmpty(INPSLEN))
        {
            substation.INPSLEN = Convert.ToDouble(INPSLEN);
        }
        substation.FDFNM = FDFNM;
        substation.FDFNO = FDFNO;
        substation.FDSNM = FDSNM;
        substation.FDSNO = FDSNO;
        substation.FDSDNM = FDSDNM;
        substation.FDSDNO = FDSDNO;
        substation.FDTHNM = FDTHNM;
        substation.FDTHNO = FDTHNO;
        //substation.startRowNum = (CURRENTPAGE - 1) * PAGESIZE + 1;
        //substation.endRowNum = CURRENTPAGE * PAGESIZE;

        return substation;
    }
    public string ReInsertSubstion()
    {
        string context = "";
        SubstationCond substationcond = new SubstationCond();
        IList<Substation> list = new List<Substation>();

        string SUBSTATION_CODE = HttpContext.Current.Request["SUBSTATION_CODE"];//变电所编码
        string LINE_CODE = HttpContext.Current.Request["LINE_CODE"];//线路
        string DIRECTION = HttpContext.Current.Request["DIRECTION"];//行别
        string KM_MARK = HttpContext.Current.Request["KM_MARK"];//公里标

        substationcond.SUBSTATION_CODE = SUBSTATION_CODE;
        list = Api.ServiceAccessor.GetFoundationService().querySubstationDPC(substationcond, false);
        if (list.Count >= 1)
        {
            context = "变电所表编码重复";
        }
        else
        {
            substationcond = new SubstationCond();
            list = new List<Substation>();

            substationcond.LINE_CODE = LINE_CODE;
            substationcond.DIRECTION = DIRECTION;
            if (!string.IsNullOrEmpty(KM_MARK))
            {
                if (!string.IsNullOrEmpty(substationcond.businssAnd))
                {
                    substationcond.businssAnd += " AND";
                }
                substationcond.businssAnd += " SUBKM = " + KM_MARK + " ";
            }

            list = Api.ServiceAccessor.GetFoundationService().querySubstationDPC(substationcond, false);

            if (list.Count >= 1)
            {
                context = "位置信息（线路行别公里标）重复";
            }
        }

        return context;
    }
    public string getCode_Name(string code)
    {
        string re = "";
        if (!string.IsNullOrEmpty(code))
        {
            if (Api.Util.Common.sysDictionaryDic.ContainsKey(code))
            {
                re = Api.Util.Common.sysDictionaryDic[code].CODE_NAME;
            }
            else
            {
                re = code;
            }
        }
        return re;
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}