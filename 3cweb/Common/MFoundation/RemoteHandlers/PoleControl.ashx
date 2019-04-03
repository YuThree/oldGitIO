<%@ WebHandler Language="C#" Class="PoleControl" %>

using System;
using System.Web;
using Api.Foundation.entity.Foundation;
using System.Collections.Generic;
using Api;
using Api.Util;
using System.Text;
using ADO.Model;
using ADO.BLL;
using Api.ADO.entity;
using System.IO;
using System.Linq;



public class PoleControl : ReferenceClass, IHttpHandler
{
    public void ProcessRequest(HttpContext context)
    {
        string type = context.Request["type"];
        string newSupportNum = context.Request["newSupportNum"];
        string newLocationNum = context.Request["newLocationNum"];

        switch (type)
        {
            //获取详细信息列表
            case "detail":
                GetDetail();
                break;
            //查询所有支柱
            case "all":
                GetAll();
                break;
            //添加支柱
            case "add":
                Add(newSupportNum, newLocationNum);
                break;
            //修改支柱
            case "update":
                Update(newSupportNum, newLocationNum);
                break;
            //删除支柱
            case "delete":
                Delete();
                break;
            case "Reload":
                Reload();
                break;
            //添加功能即时验证支柱号
            case "verify":
                Exist("context");
                break;
            //修改功能即时验证支柱号
            case "verify_update":
                Exist_update("context");
                break;
            default:
                break;
        }
    }

    private void Reload()
    {
        Api.Util.Common.ReloadPole();
        HttpContext.Current.Response.Write("ok");
    }

    /// <summary>
    /// 获取详细信息列表
    /// </summary>
    private void GetDetail()
    {
        string id = HttpContext.Current.Request["id"];
        ADO.BLL.MIS_POLE pole = new ADO.BLL.MIS_POLE();
        ADO.Model.MIS_POLE p = pole.GetModel(id);
        ADO.Model.MIS_POLE_SPTD poleSup = new ADO.Model.MIS_POLE_SPTD();
        ADO.Model.MIS_POLE_LOCATOR poleLoc = new ADO.Model.MIS_POLE_LOCATOR();
        string polecode = p.POLE_CODE;
        string countSup = "select count(1) from MIS_POLE_SPTD WHERE POLE_CODE ='" + polecode + "'";//查询同一支柱的支持装置数
        string countLoc = "select count(1) from MIS_POLE_LOCATOR WHERE POLE_CODE ='" + polecode + "'";//查询同一支柱的定位装置数

        int newSupportCount, newLocatorCount;
        try { newSupportCount = Convert.ToInt32(DbHelperOra_ADO.GetSingle(countSup)); } catch (Exception) { newSupportCount = 0; }//数据库中同一支柱的支持装置数
        try { newLocatorCount = Convert.ToInt32(DbHelperOra_ADO.GetSingle(countLoc)); } catch (Exception) { newLocatorCount = 0; }//数据库中同一支柱的定位装置数



        string imgUrl = "";//支柱图片
        if (!string.IsNullOrEmpty(p.POLE_IMG))
        {
            imgUrl = p.POLE_IMG;
        }
        else if (!string.IsNullOrEmpty(p.POLE_IMG_C2))
        {
            imgUrl = p.POLE_IMG_C2;
        }
        else if (!string.IsNullOrEmpty(p.POLE_IMG_C4))
        {
            imgUrl = p.POLE_IMG_C4;
        }
        string prod_time = "";//出厂日期
        if (p.PROD_DATE.ToString() != "0001/1/1 0:00:00")
            prod_time = p.PROD_DATE.ToString("yyyy-MM-dd hh:mm:ss");
        string comms_date = "";//投运日期
        if (p.COMMS_DATE.ToString() != "0001/1/1 0:00:00")
            comms_date = p.COMMS_DATE.ToString("yyyy-MM-dd hh:mm:ss");

        int kmMark = Convert.ToInt32(p.KMSTANDARD);

        StringBuilder sb = new StringBuilder();
        //支柱信息
        sb.AppendFormat("{{\"POLE_CODE\":\"{0}\",\"POLE_NO\":\"{1}\",\"POLE_ORDER\":\"{2}\",\"LINE_CODE\":\"{3}\",\"LINE_NAME\":\"{4}\",",
                        p.POLE_CODE, p.POLE_NO, p.POLE_ORDER, p.LINE_CODE, p.LINE_NAME);
        sb.AppendFormat("\"POSITION_CODE\":\"{0}\",\"POSITION_NAME\":\"{1}\",\"BRG_TUN_CODE\":\"{2}\",\"BRG_TUN_NAME\":\"{3}\",\"ORG_CODE\":\"{4}\",",
                        p.POSITION_CODE, p.POSITION_NAME, p.BRG_TUN_CODE, p.BRG_TUN_NAME, p.ORG_CODE);
        sb.AppendFormat("\"ORG_NAME\":\"{0}\",\"MD_CODE\":\"{1}\",\"MD_NAME\":\"{2}\",\"POLE_TYPE\":\"{3}\",\"POLE_DIRECTION\":\"{4}\",",
                        p.ORG_NAME, p.MD_CODE, "", p.POLE_TYPE, p.POLE_DIRECTION);
        sb.AppendFormat("\"KMSTANDARD_K\":\"{0}\",", PublicMethod.KmtoString(kmMark));
        sb.AppendFormat("\"KMSTANDARD\":\"{0}\",\"INSTALL_IMG_NO\":\"{1}\",\"INSTALL_TIME\":\"{2}\",\"POLE_USAGE\":\"{3}\",\"STRUCTURE_HEIGHT\":\"{4}\",",
                        p.KMSTANDARD, p.INSTALL_IMG_NO, p.INSTALL_TIME, p.POLE_USAGE, p.STRUCTURE_HEIGHT);
        sb.AppendFormat("\"GEOGRAPHY_NAME\":\"{0}\",\"SIDE_LIMIT_CX\":\"{1}\",\"CURVE_RADIUS\":\"{2}\",\"RAILFACE_HIGH\":\"{3}\",\"CURVE_DIRECTION\":\"{4}\",",
                        p.GEOGRAPHY_NAME, p.SIDE_LIMIT_CX, p.CURVE_RADIUS, p.RAILFACE_HIGH, p.CURVE_DIRECTION);
        sb.AppendFormat("\"POLE_BASIC_TYPE\":\"{0}\",\"IS_FILLED\":\"{1}\",\"WIRE_DESIGN_HEIGHT\":\"{2}\",\"WIRE_LIMIT_HEIGHT\":\"{3}\",",
                        p.POLE_BASIC_TYPE, p.IS_FILLED, p.WIRE_DESIGN_HEIGHT, p.WIRE_LIMIT_HEIGHT);
        sb.AppendFormat("\"DESIGN_PULLING_VALUE\":\"{0}\",\"LIMIT_PULLING_VALUE\":\"{1}\",\"COMPS_PROPORTION\":\"{2}\",\"POLE_ZT_TYPE\":\"{3}\",\"POLE_STATUS\":\"{4}\",",
                        p.DESIGN_PULLING_VALUE, p.LIMIT_PULLING_VALUE, p.COMPS_PROPORTION, p.POLE_ZT_TYPE, p.POLE_STATUS);
        sb.AppendFormat("\"NOTE\":\"{0}\",\"POLE_CLS_BCBL\":\"{1}\",\"POLE_IMG\":\"{2}\",\"LOCATING_METHOD\":\"{3}\",\"GIS_LON\":\"{4}\",",
                        p.NOTE, p.POLE_CLS_BCBL, @"/"+imgUrl, p.LOCATING_METHOD, p.GIS_LON);
        sb.AppendFormat("\"GIS_LAT\":\"{0}\",\"GIS_LON_CALC\":\"{1}\",\"GIS_LAT_CALC\":\"{2}\",\"BUREAU_CODE\":\"{3}\",\"BUREAU_NAME\":\"{4}\",",
                        p.GIS_LAT, p.GIS_LON_O, p.GIS_LAT_O, p.BUREAU_CODE, p.BUREAU_NAME);
        sb.AppendFormat("\"POWER_SECTION_CODE\":\"{0}\",\"POWER_SECTION_NAME\":\"{1}\",\"WORKSHOP_CODE\":\"{2}\",\"WORKSHOP_NAME\":\"{3}\",\"SPAN_LENGTH\":\"{4}\",",
                        p.POWER_SECTION_CODE, p.POWER_SECTION_NAME, p.WORKSHOP_CODE, p.WORKSHOP_NAME, p.SPAN_LENGTH);
        sb.AppendFormat("\"STRONG_LINE\":\"{0}\",\"PROTECT_LINE\":\"{1}\",\"POSITIVE_FEEDER\":\"{2}\",\"ID\":\"{3}\",",
                        p.STRONG_LINE, p.PROTECT_LINE, p.POSITIVE_FEEDER, p.ID);
        sb.AppendFormat("\"CREATE_TIME\":\"{0}\",\"SERIAL_NO\":\"{1}\",\"FRAME_NO\":\"{2}\",\"EXCEPTION_DATA_TYPE\":\"{3}\",\"KM_TREND\":\"{4}\",\"VER_CODE\":\"{5}\",\"MCDESC\":\"{6}\",\"ACDESC\":\"{7}\",\"DUP_POLE\":\"{8}\",\"DUP_PW\":\"{9}\",\"TRACK_CODE\":\"{10}\",\"ORG_DIRECTION\":\"{11}\",\"MDGJ_ID\":\"{12}\",\"MTR_QLT\":\"{13}\",\"MNFT_FCT\":\"{14}\",\"COMMS_DATE\":\"{15}\",\"PROD_DATE\":\"{16}\",\"DSGN_LIFE\":\"{17}\",\"POLE_BSC_STS\":\"{18}\",\"GRND_STS\":\"{19}\",\"AUX_HAS_BCZZ\":\"{20}\",\"AUX_HAS_FDJYQ\":\"{21}\",\"AUX_HAS_FXJYQ\":\"{22}\",\"AUX_BE_JCXC\":\"{23}\",\"AUX_BE_LXWJCXC\":\"{24}\",\"AUX_BE_SXWJCXC\":\"{25}\",\"AUX_BE_MDGJSDFX\":\"{26}\",\"AUX_HAS_YHK\":\"{27}\",\"AUX_HAS_DLJX\":\"{28}\",\"AUX_HAS_GLKG\":\"{29}\",\"AUX_HAS_BLQ\":\"{30}\",\"AUX_HAS_DCGYZZ\":\"{31}\",\"AUX_HAS_XCBZP\":\"{32}\",\"AUX_HAS_JDZZ\":\"{33}\",\"AUX_HAS_XSX\":\"{34}\",\"AUX_HAS_HLX\":\"{35}\",\"AUX_HAS_GWX\":\"{36}\",\"AUX_HAS_GDX\":\"{37}\",\"AUX_HAS_PWX\":\"{38}\",\"AUX_HAS_AFX\":\"{39}\",\"AUX_HAS_JQX\":\"{40}\",\"AUX_HAS_BLZ\":\"{41}\",\"AUX_HAS_LX\":\"{42}\",\"AUX_HAS_ZM\":\"{43}\",\"AUX_GQ\":\"{44}\",\"AUX_JXZQ\":\"{45}\",\"POLE_MDL\":\"{46}\",", p.CREATE_TIME, p.SERIAL_NO, p.FRAME_NO, p.EXCEPTION_DATA_TYPE, p.KM_TREND, p.VER_CODE, p.MCDESC, p.ACDESC, p.DUP_POLE, p.DUP_PW, p.TRACK_CODE, p.ORG_DIRECTION, p.MDGJ_ID, p.MTR_QLT, p.MNFT_FCT, comms_date, prod_time, p.DSGN_LIFE, p.POLE_BSC_STS, p.GRND_STS, p.AUX_HAS_BCZZ, p.AUX_HAS_FDJYQ, p.AUX_HAS_FXJYQ, p.AUX_BE_JCXC, p.AUX_BE_LXWJCXC, p.AUX_BE_SXWJCXC, p.AUX_BE_MDGJSDFX, p.AUX_HAS_YHK, p.AUX_HAS_DLJX, p.AUX_HAS_GLKG, p.AUX_HAS_BLQ, p.AUX_HAS_DCGYZZ, p.AUX_HAS_XCBZP, p.AUX_HAS_JDZZ, p.AUX_HAS_XSX, p.AUX_HAS_HLX, p.AUX_HAS_GWX, p.AUX_HAS_GDX, p.AUX_HAS_PWX, p.AUX_HAS_AFX, p.AUX_HAS_JQX, p.AUX_HAS_BLZ, p.AUX_HAS_LX, p.AUX_HAS_ZM, p.AUX_GQ, p.AUX_JXZQ, p.POLE_MDL);
        //支持装置信息
        sb.Append("\"SUPPORT\":[");
        if (newSupportCount > 0)
        {
            System.Data.DataSet ds = new System.Data.DataSet();
            string sqlSup = "SELECT * FROM MIS_POLE_SPTD WHERE POLE_CODE ='" + polecode + "'";
            ds = DbHelperOra_ADO.Query(sqlSup);
            string s = ",";

            for (int i = 0; i < ds.Tables[0].Rows.Count; i++)//同一支柱可能存在多个支持装置信息，循环取出放入JSON数组
            {
                System.Data.DataRow dr = ds.Tables[0].Rows[i];

                if (i == ds.Tables[0].Rows.Count - 1)//最后一个JSON组去掉逗号
                {
                    s = "";
                }
                sb.AppendFormat("{{\"OTH_ARM_MDL\":\"{0}\",\"SPTDVC_NO\":\"{1}\",\"STRTHG_STD\":\"{2}\",\"STRTHG_MSD\":\"{3}\",\"STRTHG_SFV\":\"{4}\",\"HRM_DMT\":\"{5}\",\"HRM_LEN_STD\":\"{6}\",\"HRM_LEN_MSD\":\"{7}\",\"ORM_DMT\":\"{8}\",\"ORM_LEN_STD\":\"{9}\",\"ORM_LEN_MSD\":\"{10}\",\"ARM_LEN_STD\":\"{11}\",\"ARM_LEN_MSD\":\"{12}\",\"UBMH_NUM\":\"{13}\",\"BSPC\":\"{14}\",\"OCB_LEN_STD\":\"{15}\",\"OCB_LEN_MSD\":\"{16}\",\"OCBL_DMT\":\"{17}\",\"ASTWHRM_STD\":\"{18}\",\"ASTWHRM_MSD\":\"{19}\",\"ASTWHRM_SFV\":\"{20}\",\"ASTWORM\":\"{21}\",\"BSHS\":\"{22}\",\"MSSGS\":\"{23}\",\"BSHC\":\"{24}\",\"BSHSE\":\"{25}\",\"RMB_HRM_BMDL\":\"{26}\",\"RMB_HRM_TRQ_STD\":\"{27}\",\"RMB_HRM_TRQ_MSD\":\"{28}\",\"RMB_HRM_TRQ_SFV\":\"{29}\",\"RMB_HRM_SOPT\":\"{30}\",\"RMB_ORM_BMDL\":\"{31}\",\"RMB_ORM_TRQ_STD\":\"{32}\",\"RMB_ORM_TRQ_MSD\":\"{33}\",\"RMB_ORM_TRQ_SFV\":\"{34}\",\"RMB_ORM_SOPT\":\"{35}\",\"IPT_HRM_TRQ_STD\":\"{36}\",\"IPT_HRM_TRQ_MSD\":\"{37}\",\"IPT_HRM_TRQ_SFV\":\"{38}\",\"IPT_ORM_TRQ_STD\":\"{39}\",\"IPT_ORM_TRQ_MSD\":\"{40}\",\"IPT_ORM_TRQ_SFV\":\"{41}\",\"ARMSP_ARM_STS\":\"{42}\",\"ARMSP_ARMS_STS\":\"{43}\",\"ARMSP_HRM_TRQ_STD\":\"{44}\",\"ARMSP_HRM_TRQ_MSD\":\"{45}\",\"ARMSP_HRM_TRQ_SFV\":\"{46}\",\"ARMSP_ORM_TRQ_STD\":\"{47}\",\"ARMSP_ORM_TRQ_MSD\":\"{48}\",\"ARMSP_ORM_TRQ_SFV\":\"{49}\",\"ARMSP_HRM_TWTRQ_STD\":\"{50}\",\"ARMSP_HRM_TWTRQ_MSD\":\"{51}\",\"ARMSP_HRM_TWTRQ_SFV\":\"{52}\",\"ARMSP_HRM_NTTRQ_STD\":\"{53}\",\"ARMSP_HRM_NTTRQ_MSD\":\"{54}\",\"ARMSP_HRM_NTTRQ_SFV\":\"{55}\",\"ARMSP_ARMDE_STS\":\"{56}\",\"ARMSP_ORMDE_CPN_STD\":\"{57}\",\"ARMSP_ORMDE_CPN_MSD\":\"{58}\",\"ARMSP_ORMDE_CPN_SFV\":\"{59}\",\"ARMSP_ORMDE_CMP\":\"{60}\",\"ARMSP_ORMDE_TRQ_STD\":\"{61}\",\"ARMSP_ORMDE_TRQ_MSD\":\"{62}\",\"ARMSP_ORMDE_TRQ_SFV\":\"{63}\",\"ARMSP_ORMDES_STS\":\"{64}\",\"HAS_CAP_STD\":\"{65}\",\"HAS_CAP_MSD\":\"{66}\",\"ARMB_BLF_STS\":\"{67}\",\"ARMBS\":\"{68}\",\"ARMB_CTP\":\"{69}\",\"ARMS_BLF_STS\":\"{70}\",\"ARMS\":\"{71}\",\"ARMSP_BLF_STS\":\"{72}\",\"ARMSPS\":\"{73}\",\"ARMSPS_CTP\":\"{74}\",\"CNT_CTP\":\"{75}\",\"CTNS\":\"{76}\",\"TRC_BLF_STS\":\"{77}\",\"TRCS\":\"{78}\",\"TRC_CTP\":\"{79}\",\"TRCDE_BLF_STS\":\"{80}\",\"TRCDES\":\"{81}\",\"TRCDE_CTP\":\"{82}\"}}{83}", DoubleToString(dr["OTH_ARM_MDL"]), DoubleToString(dr["SPTDVC_NO"]), DoubleToString(dr["STRTHG_STD"]), DoubleToString(dr["STRTHG_MSD"]), DoubleToString(dr["STRTHG_SFV"]), DoubleToString(dr["HRM_DMT"]), DoubleToString(dr["HRM_LEN_STD"]), DoubleToString(dr["HRM_LEN_MSD"]), DoubleToString(dr["ORM_DMT"]), DoubleToString(dr["ORM_LEN_STD"]), DoubleToString(dr["ORM_LEN_MSD"]), DoubleToString(dr["ARM_LEN_STD"]), DoubleToString(dr["ARM_LEN_MSD"]), DoubleToString(dr["UBMH_NUM"]), DoubleToString(dr["BSPC"]), DoubleToString(dr["OCB_LEN_STD"]), DoubleToString(dr["OCB_LEN_MSD"]), DoubleToString(dr["OCBL_DMT"]), DoubleToString(dr["ASTWHRM_STD"]), DoubleToString(dr["ASTWHRM_MSD"]), DoubleToString(dr["ASTWHRM_SFV"]), DoubleToString(dr["ASTWORM"]), DoubleToString(dr["BSHS"]), DoubleToString(dr["MSSGS"]), DoubleToString(dr["BSHC"]), DoubleToString(dr["BSHSE"]), DoubleToString(dr["RMB_HRM_BMDL"]), DoubleToString(dr["RMB_HRM_TRQ_STD"]), DoubleToString(dr["RMB_HRM_TRQ_MSD"]), DoubleToString(dr["RMB_HRM_TRQ_SFV"]), DoubleToString(dr["RMB_HRM_SOPT"]), DoubleToString(dr["RMB_ORM_BMDL"]), DoubleToString(dr["RMB_ORM_TRQ_STD"]), DoubleToString(dr["RMB_ORM_TRQ_MSD"]), DoubleToString(dr["RMB_ORM_TRQ_SFV"]), DoubleToString(dr["RMB_ORM_SOPT"]), DoubleToString(dr["IPT_HRM_TRQ_STD"]), DoubleToString(dr["IPT_HRM_TRQ_MSD"]), DoubleToString(dr["IPT_HRM_TRQ_SFV"]), DoubleToString(dr["IPT_ORM_TRQ_STD"]), DoubleToString(dr["IPT_ORM_TRQ_MSD"]), DoubleToString(dr["IPT_ORM_TRQ_SFV"]), DoubleToString(dr["ARMSP_ARM_STS"]), DoubleToString(dr["ARMSP_ARMS_STS"]), DoubleToString(dr["ARMSP_HRM_TRQ_STD"]), DoubleToString(dr["ARMSP_HRM_TRQ_MSD"]), DoubleToString(dr["ARMSP_HRM_TRQ_SFV"]), DoubleToString(dr["ARMSP_ORM_TRQ_STD"]), DoubleToString(dr["ARMSP_ORM_TRQ_MSD"]), DoubleToString(dr["ARMSP_ORM_TRQ_SFV"]), DoubleToString(dr["ARMSP_HRM_TWTRQ_STD"]), DoubleToString(dr["ARMSP_HRM_TWTRQ_MSD"]), DoubleToString(dr["ARMSP_HRM_TWTRQ_SFV"]), DoubleToString(dr["ARMSP_HRM_NTTRQ_STD"]), DoubleToString(dr["ARMSP_HRM_NTTRQ_MSD"]), DoubleToString(dr["ARMSP_HRM_NTTRQ_SFV"]), DoubleToString(dr["ARMSP_ARMDE_STS"]), DoubleToString(dr["ARMSP_ORMDE_CPN_STD"]), DoubleToString(dr["ARMSP_ORMDE_CPN_MSD"]), DoubleToString(dr["ARMSP_ORMDE_CPN_SFV"]), DoubleToString(dr["ARMSP_ORMDE_CMP"]), DoubleToString(dr["ARMSP_ORMDE_TRQ_STD"]), DoubleToString(dr["ARMSP_ORMDE_TRQ_MSD"]), DoubleToString(dr["ARMSP_ORMDE_TRQ_SFV"]), DoubleToString(dr["ARMSP_ORMDES_STS"]), DoubleToString(dr["HAS_CAP_STD"]), DoubleToString(dr["HAS_CAP_MSD"]), DoubleToString(dr["ARMB_BLF_STS"]), DoubleToString(dr["ARMBS"]), DoubleToString(dr["ARMB_CTP"]), DoubleToString(dr["ARMS_BLF_STS"]), DoubleToString(dr["ARMS"]), DoubleToString(dr["ARMSP_BLF_STS"]), DoubleToString(dr["ARMSPS"]), DoubleToString(dr["ARMSPS_CTP"]), DoubleToString(dr["CNT_CTP"]), DoubleToString(dr["CTNS"]), DoubleToString(dr["TRC_BLF_STS"]), DoubleToString(dr["TRCS"]), DoubleToString(dr["TRC_CTP"]), DoubleToString(dr["TRCDE_BLF_STS"]), DoubleToString(dr["TRCDES"]), DoubleToString(dr["TRCDE_CTP"]), s);
            }
        }
        sb.Append("],");
        //定位装置信息 
        sb.Append("\"LOCATION\":[");
        if (newLocatorCount > 0)
        {
            System.Data.DataSet ds = new System.Data.DataSet();
            string sqlLoc = "SELECT * FROM MIS_POLE_LOCATOR WHERE POLE_CODE ='" + polecode + "'";
            ds = DbHelperOra_ADO.Query(sqlLoc);
            string s = ",";

            for (int i = 0; i < ds.Tables[0].Rows.Count; i++)//同一支柱可能存在多个定位装置信息，循环取出放入JSON数组
            {
                System.Data.DataRow dr = ds.Tables[0].Rows[i];

                if (i == ds.Tables[0].Rows.Count - 1)//最后一个JSON组去掉逗号
                {
                    s = "";
                }
                sb.AppendFormat("{{\"LCT_ID\":\"{0}\",\"LCT_NO\":\"{1}\",\"LCTDMT\":\"{2}\",\"LCTTLEN_STD\":\"{3}\",\"LCTTLEN_MSD\":\"{4}\",\"LCTTLEN_SFV\":\"{5}\",\"LSPLEN_STD\":\"{6}\",\"LSPLEN_MSD\":\"{7}\",\"LSPLEN_SFV\":\"{8}\",\"LCTLEN_STD\":\"{9}\",\"LCTLEN_MSD\":\"{10}\",\"LCTLEN_SFV\":\"{11}\",\"LCTCLRC_STD\":\"{12}\",\"LCTCLRC_MSD\":\"{13}\",\"LCTCLRC_SFV\":\"{14}\",\"WDPCBLLEN_STD\":\"{15}\",\"WDPCBLLEN_MSD\":\"{16}\",\"WDPCBL_DMT\":\"{17}\",\"LCTTWHARM\":\"{18}\",\"LCTRW\":\"{19}\",\"LCTTWORM\":\"{20}\",\"LCTWLCTT\":\"{21}\",\"LCTUW\":\"{22}\",\"LCT_TP\":\"{23}\",\"LCT_MDL\":\"{24}\",\"LCT_SLP\":\"{25}\",\"LCTRMMT_STD\":\"{26}\",\"LCTRMMT_MSD\":\"{27}\",\"LCTRS_STS\":\"{28}\",\"LCTR_LSP_CMP\":\"{29}\",\"LCTR_POP_STD\":\"{30}\",\"LCTR_POP_MSD\":\"{31}\",\"LCTR_POP_SFV\":\"{32}\",\"LCTTDETWMMT_STD\":\"{33}\",\"LCTTDETWMMT_MSD\":\"{34}\",\"LCTTDESPTNT_STD\":\"{35}\",\"LCTTDESPTNT_MSD\":\"{36}\",\"LCTTDES_STS\":\"{37}\",\"LCTTDE_LSSTS\":\"{38}\",\"LCTSPMMT_STD\":\"{39}\",\"LCTSPMMT_MSD\":\"{40}\",\"LCTSPS_STS\":\"{41}\",\"CNWMMT_STD\":\"{42}\",\"CNWMMT_MSD\":\"{43}\",\"CNWS_STS\":\"{44}\",\"LCTS_STS\":\"{45}\",\"WDPC_STS\":\"{46}\",\"LCTCLMPMMT_STD\":\"{47}\",\"LCTCLMPMMT_MSD\":\"{48}\",\"LCTCLMPS_STS\":\"{49}\",\"LSDEOR_TW_MMT_MSD\":\"{50}\",\"LSDEOR_TW_MMT_STD\":\"{51}\",\"LSDEOR_SPNT_MMT_MSD\":\"{52}\",\"LSDEOR_SPNT_MMT_STD\":\"{53}\",\"LSDEORS_STS\":\"{54}\",\"LSDELTC_TW_MMT_MSD\":\"{55}\",\"LSDELTC_TW_MMT_STD\":\"{56}\",\"LSDELTC_SPNT_MMT_MSD\":\"{57}\",\"LSDELTC_SPNT_MMT_STD\":\"{58}\",\"LSDELTCS_STS\":\"{59}\",\"BSHSEORM_MMT_STD\":\"{60}\",\"BSHSEORM_MMT_MSD\":\"{61}\",\"BSHSEORMS_STS\":\"{62}\",\"BSHSELTC_MMT_STD\":\"{63}\",\"BSHSELTC_MMT_MSD\":\"{64}\",\"BSHSELTCS_STS\":\"{65}\",\"LCTNT_STS\":\"{66}\",\"SPSB\":\"{67}\",\"SPOP\":\"{68}\",\"LCTCLMP_STS\":\"{69}\",\"LCTCLMPSB\":\"{70}\",\"LCTBLT_STS\":\"{71}\",\"LCTSB\":\"{72}\",\"LCTOP\":\"{73}\",\"LCTT_STS\":\"{74}\",\"LCTTSB\":\"{75}\",\"LCTRB_STS\":\"{76}\",\"LCTRSB\":\"{77}\",\"LCTSPB_STS\":\"{78}\",\"LCTSPSB\":\"{79}\"}}{80}", DoubleToString(dr["LCT_ID"]), DoubleToString(dr["LCT_NO"]), DoubleToString(dr["LCTDMT"]), DoubleToString(dr["LCTTLEN_STD"]), DoubleToString(dr["LCTTLEN_MSD"]), DoubleToString(dr["LCTTLEN_SFV"]), DoubleToString(dr["LSPLEN_STD"]), DoubleToString(dr["LSPLEN_MSD"]), DoubleToString(dr["LSPLEN_SFV"]), DoubleToString(dr["LCTLEN_STD"]), DoubleToString(dr["LCTLEN_MSD"]), DoubleToString(dr["LCTLEN_SFV"]), DoubleToString(dr["LCTCLRC_STD"]), DoubleToString(dr["LCTCLRC_MSD"]), DoubleToString(dr["LCTCLRC_SFV"]), DoubleToString(dr["WDPCBLLEN_STD"]), DoubleToString(dr["WDPCBLLEN_MSD"]), DoubleToString(dr["WDPCBL_DMT"]), DoubleToString(dr["LCTTWHARM"]), DoubleToString(dr["LCTRW"]), DoubleToString(dr["LCTTWORM"]), DoubleToString(dr["LCTWLCTT"]), DoubleToString(dr["LCTUW"]), DoubleToString(dr["LCT_TP"]), DoubleToString(dr["LCT_MDL"]), DoubleToString(dr["LCT_SLP"]), DoubleToString(dr["LCTRMMT_STD"]), DoubleToString(dr["LCTRMMT_MSD"]), DoubleToString(dr["LCTRS_STS"]), DoubleToString(dr["LCTR_LSP_CMP"]), DoubleToString(dr["LCTR_POP_STD"]), DoubleToString(dr["LCTR_POP_MSD"]), DoubleToString(dr["LCTR_POP_SFV"]), DoubleToString(dr["LCTTDETWMMT_STD"]), DoubleToString(dr["LCTTDETWMMT_MSD"]), DoubleToString(dr["LCTTDESPTNT_STD"]), DoubleToString(dr["LCTTDESPTNT_MSD"]), DoubleToString(dr["LCTTDES_STS"]), DoubleToString(dr["LCTTDE_LSSTS"]), DoubleToString(dr["LCTSPMMT_STD"]), DoubleToString(dr["LCTSPMMT_MSD"]), DoubleToString(dr["LCTSPS_STS"]), DoubleToString(dr["CNWMMT_STD"]), DoubleToString(dr["CNWMMT_MSD"]), DoubleToString(dr["CNWS_STS"]), DoubleToString(dr["LCTS_STS"]), DoubleToString(dr["WDPC_STS"]), DoubleToString(dr["LCTCLMPMMT_STD"]), DoubleToString(dr["LCTCLMPMMT_MSD"]), DoubleToString(dr["LCTCLMPS_STS"]), DoubleToString(dr["LSDEOR_TW_MMT_MSD"]), DoubleToString(dr["LSDEOR_TW_MMT_STD"]), DoubleToString(dr["LSDEOR_SPNT_MMT_MSD"]), DoubleToString(dr["LSDEOR_SPNT_MMT_STD"]), DoubleToString(dr["LSDEORS_STS"]), DoubleToString(dr["LSDELTC_TW_MMT_MSD"]), DoubleToString(dr["LSDELTC_TW_MMT_STD"]), DoubleToString(dr["LSDELTC_SPNT_MMT_MSD"]), DoubleToString(dr["LSDELTC_SPNT_MMT_STD"]), DoubleToString(dr["LSDELTCS_STS"]), DoubleToString(dr["BSHSEORM_MMT_STD"]), DoubleToString(dr["BSHSEORM_MMT_MSD"]), DoubleToString(dr["BSHSEORMS_STS"]), DoubleToString(dr["BSHSELTC_MMT_STD"]), DoubleToString(dr["BSHSELTC_MMT_MSD"]), DoubleToString(dr["BSHSELTCS_STS"]), DoubleToString(dr["LCTNT_STS"]), DoubleToString(dr["SPSB"]), DoubleToString(dr["SPOP"]), DoubleToString(dr["LCTCLMP_STS"]), DoubleToString(dr["LCTCLMPSB"]), DoubleToString(dr["LCTBLT_STS"]), DoubleToString(dr["LCTSB"]), DoubleToString(dr["LCTOP"]), DoubleToString(dr["LCTT_STS"]), DoubleToString(dr["LCTTSB"]), DoubleToString(dr["LCTRB_STS"]), DoubleToString(dr["LCTRSB"]), DoubleToString(dr["LCTSPB_STS"]), DoubleToString(dr["LCTSPSB"]), s);
            }
        }
        sb.Append("]}");
        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(sb.ToString());
    }

    /// <summary>
    /// 删除
    /// </summary>
    private void Delete()
    {
        string rs = "1";
        string rsSup = "", rsLoc = "";
        try
        {
            string id = HttpContext.Current.Request["id"];
            ADO.BLL.MIS_POLE bllPole = new ADO.BLL.MIS_POLE();
            ADO.BLL.MIS_POLE_SPTD bllPoleSup = new ADO.BLL.MIS_POLE_SPTD();
            ADO.BLL.MIS_POLE_LOCATOR bllPoleLoc = new ADO.BLL.MIS_POLE_LOCATOR();
            ADO.Model.MIS_POLE pole = bllPole.GetModel(id);//通过ID获取支柱实体
            ADO.Model.MIS_POLE_SPTD poleSup = new ADO.Model.MIS_POLE_SPTD();
            ADO.Model.MIS_POLE_LOCATOR poleLoc = new ADO.Model.MIS_POLE_LOCATOR();
            //PublicMethod.SysDataBackUp("MIS_POLE", "MIS_POLE_VERSION", id, "删除");//数据备份
            rs = bllPole.Delete(id) ? "1" : "-1";

            if (rs == "1")
            {
                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "支柱管理", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "支柱管理删除了信息" + pole.POLE_CODE, "", true);

                poleSup.POLE_CODE = pole.POLE_CODE;
                poleLoc.POLE_CODE = pole.POLE_CODE;
                string sqlSup = "DELETE FROM MIS_POLE_SPTD WHERE POLE_CODE = '" + poleSup.POLE_CODE + "'";
                string sqlLoc = "DELETE FROM MIS_POLE_LOCATOR WHERE POLE_CODE ='" + poleLoc.POLE_CODE + "'";
                //PublicMethod.SysDataBackUp("MIS_POLE_SPTD", "MIS_POLE_VERSION", poleSup.POLE_CODE, "删除");//数据备份
                int rowLoc = 0;
                int rowSup = 0;
                rowSup = DbHelperOra_ADO.ExecuteSql(sqlSup);
                rowLoc = DbHelperOra_ADO.ExecuteSql(sqlLoc);

                if (bllPoleSup.GetRecordCount("POLE_CODE = '" + poleSup.POLE_CODE+"'") == 0)//老数据的支柱没有对应的定位装置和支持装置，删除支柱时同时返回支持装置和定位装置删除成功
                {
                    rowSup = 2;
                }
                //PublicMethod.SysDataBackUp("MIS_POLE_LOCATOR", "MIS_POLE_VERSION", poleSup.POLE_CODE, "删除");//数据备份
                if (bllPoleLoc.GetRecordCount("POLE_CODE = '" + poleLoc.POLE_CODE+"'") == 0)
                {
                    rowLoc = 3;
                }
                rsSup = rowSup > 0 ? "2" : "-2";
                rsLoc = rowLoc > 0 ? "3" : "-3";
            }
            else
            {
                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "支柱管理", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "支柱管理删除了信息" + pole.POLE_CODE, "", false);
            }
        }
        catch
        {
            rs = "-1";
        }
        finally
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendFormat("{{\"POLE_RESULT\":\"{0}\",\"POLE_SPTD_RESULT\":\"{1}\",\"POLE_LOCATOR\":\"{2}\"}}", rs, rsSup, rsLoc);
            string js = sb.ToString();
            HttpContext.Current.Response.Write(js);
        }
    }
    /// <summary>
    /// 修改
    /// </summary>
    private void Update(string newSupNum, string newLocNum)
    {
        if (Exist_update("") == "1")
        {
        }
        else
        {
            string rs_exist = Exist_update("");
            int supNum, locNum;
            try { supNum = Int16.Parse(newSupNum); } catch (Exception) { supNum = 0; }//支持装置选项卡
            try { locNum = Int16.Parse(newLocNum); } catch (Exception) { locNum = 0; }//定位装置选项卡
            string rs = "", rsSup = "", rsLoc = "";
            try
            {
                var id = HttpContext.Current.Request["id"];
                ADO.BLL.MIS_POLE bllPole = new ADO.BLL.MIS_POLE();
                ADO.Model.MIS_POLE pole = bllPole.GetModel(id);//通过id来获取pole实体

                pole.BUREAU_CODE = HttpContext.Current.Request.Form["bureau_code"];//局编码
                pole.POWER_SECTION_CODE = HttpContext.Current.Request.Form["power_section_code"];//供电段编码
                pole.WORKSHOP_CODE = HttpContext.Current.Request.Form["workshop_code"];//车间编码
                pole.ORG_CODE = HttpContext.Current.Request.Form["org_code"];//工区编码

                #region 支柱修改界面-支柱信息
                //基础信息
                pole.POLE_IMG = HttpContext.Current.Request.Form["pole_img"];//支柱图片路径
                pole.LINE_NAME = HttpContext.Current.Request.Form["line_name"];//线路名称
                pole.POLE_DIRECTION = HttpContext.Current.Request.Form["pole_direction"];//行别
                pole.POSITION_NAME = HttpContext.Current.Request.Form["position_name"];//区站名称
                pole.BRG_TUN_NAME = HttpContext.Current.Request.Form["brg_tun_name"];//桥隧名称
                pole.POLE_NO = HttpContext.Current.Request.Form["pole_no"];//支柱号
                try { pole.KMSTANDARD = ulong.Parse(HttpContext.Current.Request.Form["kmstandard"]); }
                catch (Exception) { pole.KMSTANDARD = 0; }//公里标
                pole.BUREAU_NAME = HttpContext.Current.Request.Form["bureau_name"];//路局名称
                pole.POWER_SECTION_NAME = HttpContext.Current.Request.Form["power_section_name"];//供电段名称
                pole.WORKSHOP_NAME = HttpContext.Current.Request.Form["workshop_name"];//车间名称
                pole.ORG_NAME = HttpContext.Current.Request.Form["org_name"];//工区名称
                //支柱属性
                pole.MD_CODE = HttpContext.Current.Request.Form["md_code"];//锚段号
                pole.TRACK_CODE = HttpContext.Current.Request.Form["track_code"];//股道编码
                pole.POLE_TYPE = HttpContext.Current.Request.Form["pole_type"];//支柱类型
                pole.POLE_MDL = HttpContext.Current.Request.Form["pole_mdl"];//支柱型号
                pole.POLE_USAGE = HttpContext.Current.Request.Form["pole_usage"];//用途
                pole.INSTALL_IMG_NO = HttpContext.Current.Request.Form["install_img_no"];//安装图号
                pole.MTR_QLT = HttpContext.Current.Request.Form["MTR_QLT"];//材质
                pole.SPAN_LENGTH = HttpContext.Current.Request.Form["span_length"];//跨距
                pole.CURVE_RADIUS = HttpContext.Current.Request.Form["curve_radius"];//曲线半径
                pole.SIDE_LIMIT_CX = HttpContext.Current.Request.Form["side_limit_cx"];//侧面限界
                pole.RAILFACE_HIGH = HttpContext.Current.Request.Form["railface_high"];//外轨超高
                //pole.ADDITIONNO = HttpContext.Current.Request.Form["ADDITIONNO"];/////////////////////////
                pole.POLE_BSC_STS = HttpContext.Current.Request.Form["pole_bsc_sts"];//支柱基础状态
                pole.POLE_BASIC_TYPE = HttpContext.Current.Request.Form["pole_basic_type"];//基础类型
                pole.POLE_STATUS = HttpContext.Current.Request.Form["pole_status"];//支柱状态
                pole.MNFT_FCT = HttpContext.Current.Request.Form["mnft_fct"];//生产厂家
                try { pole.COMMS_DATE = Convert.ToDateTime(HttpContext.Current.Request.Form["comms_date"]); }
                catch (Exception) { pole.COMMS_DATE = DateTime.Now; }//投运日期
                pole.CURVE_DIRECTION = HttpContext.Current.Request.Form["curve_direction"];//曲内外
                try { pole.PROD_DATE = Convert.ToDateTime(HttpContext.Current.Request.Form["prod_date"]); }
                catch (Exception) { pole.PROD_DATE = DateTime.Now; }//出厂日期
                try { pole.DSGN_LIFE = Convert.ToUInt32(HttpContext.Current.Request.Form["dsgn_life"]); }
                catch (Exception) { pole.DSGN_LIFE = 0; }//设计寿命
                pole.AUX_JXZQ = HttpContext.Current.Request.Form["aux_jxzq"];//检修周期
                pole.GRND_STS = HttpContext.Current.Request.Form["grnd_sts"];//地线状态
                //其他部件
                pole.AUX_HAS_BCZZ = HttpContext.Current.Request.Form["aux_has_bczz"];//是否有补偿装置
                pole.AUX_HAS_FDJYQ = HttpContext.Current.Request.Form["aux_has_fdjyq"];//是否有分段绝缘器
                pole.AUX_HAS_FXJYQ = HttpContext.Current.Request.Form["aux_has_fxjyq"];//是否有分相绝缘器
                pole.AUX_BE_JCXC = HttpContext.Current.Request.Form["aux_has_jcxc"];//是否处于交叉线岔
                pole.AUX_BE_LXWJCXC = HttpContext.Current.Request.Form["aux_be_lxwjcxc"];//是否处于两线无交叉线岔
                pole.AUX_BE_SXWJCXC = HttpContext.Current.Request.Form["aux_be_sxwjcxc"];//是否处于三线无交叉线岔
                pole.AUX_BE_MDGJSDFX = HttpContext.Current.Request.Form["aux_be_mdgjsdfx"];//是否处于锚段关节式电分相
                pole.AUX_HAS_YHK = HttpContext.Current.Request.Form["aux_has_yhx"];//是否有硬横跨
                pole.AUX_HAS_DLJX = HttpContext.Current.Request.Form["aux_has_dljx"];//是否有电连接
                pole.AUX_HAS_GLKG = HttpContext.Current.Request.Form["aux_has_glkg"];//是否有隔离开关
                pole.AUX_HAS_BLQ = HttpContext.Current.Request.Form["aux_has_blq"];//是否有避雷器
                pole.AUX_HAS_DCGYZZ = HttpContext.Current.Request.Form["aux_has_dcgyzz"];//是否有地磁感应装置
                pole.AUX_HAS_XCBZP = HttpContext.Current.Request.Form["aux_has_xcbzp"];//是否有行车标志牌
                pole.AUX_HAS_JDZZ = HttpContext.Current.Request.Form["aux_has_jdzz"];//是否有接地装置
                pole.AUX_HAS_XSX = HttpContext.Current.Request.Form["aux_has_xsx"];//是否有吸上线
                pole.AUX_HAS_HLX = HttpContext.Current.Request.Form["aux_has_hlx"];//是否有回流线
                pole.AUX_HAS_GWX = HttpContext.Current.Request.Form["aux_has_gwx"];//是否有GW线
                pole.AUX_HAS_GDX = HttpContext.Current.Request.Form["aux_has_gdx"];//是否有供电线
                pole.AUX_HAS_PWX = HttpContext.Current.Request.Form["aux_has_pwx"];//是否有PW线
                pole.AUX_HAS_AFX = HttpContext.Current.Request.Form["aux_has_afx"];//是否有AF线
                pole.AUX_HAS_JQX = HttpContext.Current.Request.Form["aux_has_jqx"];//是否有加强线
                pole.AUX_HAS_BLZ = HttpContext.Current.Request.Form["aux_has_blz"];//是否有避雷线
                pole.AUX_HAS_LX = HttpContext.Current.Request.Form["aux_has_lx"];//是否有拉线
                pole.AUX_HAS_ZM = HttpContext.Current.Request.Form["aux_has_zm"];//是否有中锚
                #endregion
                rs = bllPole.Update(pole) ? "1" : "-1";

                if (rs == "1")
                {
                    Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "支柱管理", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "支柱管理修改了信息" + id, "", true);

                    #region 支柱修改界面-支持装置
                    ADO.BLL.MIS_POLE_SPTD bllPoleSup = new ADO.BLL.MIS_POLE_SPTD();
                    ADO.Model.MIS_POLE_SPTD poleSup = new ADO.Model.MIS_POLE_SPTD();
                    //查询数据库里同一支柱的支持装置数
                    string countSup = "select count(1) from MIS_POLE_SPTD WHERE POLE_CODE ='" + pole.POLE_CODE + "'";
                    int newSupportCount;
                    try { newSupportCount = Convert.ToInt32(DbHelperOra_ADO.GetSingle(countSup)); } catch (Exception) { newSupportCount = 0; }

                    bool isSuccessSupUpdate = false;
                    string sup = "";
                    try
                    {
                        if (supNum < newSupportCount)//修改时不添加新的支持装置（supNum代表支持装置总数，newSupportCount代表数据库支持装置总数）
                        {
                            for (int i = 0; i < newSupportCount; i++)
                            {
                                if (i > 0)
                                    sup = "new_support-" + i + "-";
                                //////支撑装置
                                poleSup.POLE_CODE = pole.POLE_CODE;
                                poleSup.SPTDVC_NO = HttpContext.Current.Request[sup + "sptdvc_no"];//向前端请求支持装置编号SPTDVC_NO
                                poleSup.UBMH_NUM = StrToDouble(HttpContext.Current.Request.Form[sup + "ubmh_num"]);//上底座安装孔位
                                poleSup.BSPC = StrToDouble(HttpContext.Current.Request.Form[sup + "bspc"]);//底座间距
                                poleSup.BSHS = StrToDouble(HttpContext.Current.Request.Form[sup + "bshs"]);// 套管座位置
                                poleSup.MSSGS = StrToDouble(HttpContext.Current.Request.Form[sup + "mssgs"]);// 承力索座位置
                                poleSup.BSHC = StrToDouble(HttpContext.Current.Request.Form[sup + "bshc"]);// 套管环位置
                                poleSup.BSHSE = StrToDouble(HttpContext.Current.Request.Form[sup + "bshse"]);// φ55套管单耳位置
                                poleSup.STRTHG_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "strthg_std"]);//结构高度（标准值）
                                poleSup.STRTHG_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "strthg_msd"]);//结构高度（实测值）
                                poleSup.STRTHG_SFV = StrToDouble(HttpContext.Current.Request.Form[sup + "strthg_sfv"]);//结构高度（安全值）
                                //平腕臂管
                                poleSup.HRM_DMT = StrToDouble(HttpContext.Current.Request.Form[sup + "hrm_dmt"]);//平腕臂管_直径
                                poleSup.HRM_LEN_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "hrm_len_std"]);//平腕臂管_长度(标准值)
                                poleSup.HRM_LEN_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "hrm_len_msd"]);//平腕臂管_长度(实测值)
                                //斜腕臂管
                                poleSup.ORM_DMT = StrToDouble(HttpContext.Current.Request.Form[sup + "orm_dmt"]);
                                poleSup.ORM_LEN_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "orm_len_std"]);
                                poleSup.ORM_LEN_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "orm_len_msd"]);
                                //斜拉线
                                poleSup.OCB_LEN_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "ocb_len_std"]);
                                poleSup.OCB_LEN_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "ocb_len_msd"]);
                                poleSup.OCBL_DMT = StrToDouble(HttpContext.Current.Request.Form[sup + "ocbl_dmt"]);
                                //腕臂支撑管在平腕臂位置
                                poleSup.ASTWHRM_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "astwhrm_std"]);
                                poleSup.ASTWHRM_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "astwhrm_msd"]);
                                poleSup.ASTWHRM_SFV = StrToDouble(HttpContext.Current.Request.Form[sup + "astwhrm_sfv"]);
                                //腕臂支撑管在斜腕臂位置
                                poleSup.ASTWORM = StrToDouble(HttpContext.Current.Request.Form[sup + "astworm"]);
                                //铁帽压板-平腕臂
                                poleSup.IPT_HRM_TRQ_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "ipt_hrm_trq_std"]);
                                poleSup.IPT_HRM_TRQ_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "ipt_hrm_trq_msd"]);
                                poleSup.IPT_HRM_TRQ_SFV = StrToDouble(HttpContext.Current.Request.Form[sup + "ipt_hrm_trq_sfv"]);
                                //铁帽压板-斜腕臂
                                poleSup.IPT_ORM_TRQ_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "ipt_orm_trq_std"]);
                                poleSup.IPT_ORM_TRQ_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "ipt_orm_trq_msd"]);
                                poleSup.IPT_ORM_TRQ_SFV = StrToDouble(HttpContext.Current.Request.Form[sup + "ipt_orm_trq_sfv"]);
                                //腕臂底座-平腕臂底座
                                poleSup.RMB_HRM_BMDL = HttpContext.Current.Request.Form[sup + "rmb_hrm_bmdl"];
                                poleSup.RMB_HRM_TRQ_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "rmb_hrm_trq_std"]);
                                poleSup.RMB_HRM_TRQ_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "rmb_hrm_trq_msd"]);
                                poleSup.RMB_HRM_TRQ_SFV = StrToDouble(HttpContext.Current.Request.Form[sup + "rmb_hrm_trq_sfv"]);
                                poleSup.RMB_HRM_SOPT = HttpContext.Current.Request.Form[sup + "rmb_hrm_sopt"];
                                //腕臂底座-斜腕臂底座
                                poleSup.RMB_ORM_BMDL = HttpContext.Current.Request.Form[sup + "rmb_orm_bmdl"];
                                poleSup.RMB_ORM_TRQ_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "rmb_orm_trq_std"]);
                                poleSup.RMB_ORM_TRQ_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "rmb_orm_trq_msd"]);
                                poleSup.RMB_ORM_TRQ_SFV = StrToDouble(HttpContext.Current.Request.Form[sup + "rmb_orm_trq_sfv"]);
                                poleSup.RMB_ORM_SOPT = HttpContext.Current.Request.Form[sup + "rmb_orm_sopt"];
                                //腕臂支撑
                                poleSup.ARM_LEN_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "arm_len_std"]);
                                poleSup.ARM_LEN_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "arm_len_msd"]);
                                //腕臂及支撑
                                poleSup.ARMSP_ARM_STS = HttpContext.Current.Request.Form[sup + "armsp_arm_sts"];
                                poleSup.ARMSP_ARMS_STS = HttpContext.Current.Request.Form[sup + "armsp_arms_sts"];
                                //腕臂及支撑_平腕臂套管单耳
                                poleSup.ARMSP_HRM_TRQ_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_hrm_trq_std"]);
                                poleSup.ARMSP_HRM_TRQ_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_hrm_trq_msd"]);
                                poleSup.ARMSP_HRM_TRQ_SFV = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_hrm_trq_sfv"]);
                                //腕臂及支撑_斜腕臂套管单耳
                                poleSup.ARMSP_ORM_TRQ_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_orm_trq_std"]);
                                poleSup.ARMSP_ORM_TRQ_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_orm_trq_msd"]);
                                poleSup.ARMSP_ORM_TRQ_SFV = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_orm_trq_sfv"]);
                                //腕臂及支撑_平腕臂双耳套筒
                                poleSup.ARMSP_HRM_TWTRQ_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_hrm_twtrq_std"]);
                                poleSup.ARMSP_HRM_TWTRQ_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_hrm_twtrq_msd"]);
                                poleSup.ARMSP_HRM_TWTRQ_SFV = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_hrm_twtrq_sfv"]);
                                poleSup.ARMSP_HRM_NTTRQ_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_hrm_nttrq_std"]);
                                poleSup.ARMSP_HRM_NTTRQ_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_hrm_nttrq_msd"]);
                                poleSup.ARMSP_HRM_NTTRQ_SFV = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_hrm_nttrq_sfv"]);
                                poleSup.ARMSP_ARMDE_STS = HttpContext.Current.Request.Form[sup + "armsp_armde_sts"];
                                poleSup.ARMSP_ORMDE_CPN_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_ormde_cpn_std"]);
                                poleSup.ARMSP_ORMDE_CPN_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_ormde_cpn_msd"]);
                                poleSup.ARMSP_ORMDE_CPN_SFV = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_ormde_cpn_sfv"]);
                                //腕臂及支撑_斜腕臂双耳套筒
                                poleSup.ARMSP_ORMDE_CMP = HttpContext.Current.Request.Form[sup + "armsp_ormde_cmp"];
                                poleSup.ARMSP_ORMDE_TRQ_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_ormde_trq_std"]);
                                poleSup.ARMSP_ORMDE_TRQ_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_ormde_trq_msd"]);
                                poleSup.ARMSP_ORMDE_TRQ_SFV = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_ormde_trq_sfv"]);
                                poleSup.ARMSP_ORMDES_STS = HttpContext.Current.Request.Form[sup + "armsp_ormdes_sts"];
                                //腕臂底座
                                poleSup.ARMB_BLF_STS = HttpContext.Current.Request.Form[sup + "armb_blf_sts"];
                                poleSup.ARMBS = HttpContext.Current.Request.Form[sup + "armbs"];
                                poleSup.ARMB_CTP = HttpContext.Current.Request.Form[sup + "armb_ctp"];
                                //腕臂支撑
                                poleSup.ARMSP_BLF_STS = HttpContext.Current.Request.Form[sup + "armsp_blf_sts"];
                                poleSup.ARMSPS = HttpContext.Current.Request.Form[sup + "armsps"];
                                poleSup.ARMSPS_CTP = HttpContext.Current.Request.Form[sup + "armsps_ctp"];
                                //套管铰环
                                poleSup.TRC_BLF_STS = HttpContext.Current.Request.Form[sup + "trc_blf_sts"];
                                poleSup.TRCS = HttpContext.Current.Request.Form[sup + "trcs"];
                                poleSup.TRC_CTP = HttpContext.Current.Request.Form[sup + "trc_ctp"];
                                //套管双耳
                                poleSup.TRCDE_BLF_STS = HttpContext.Current.Request.Form[sup + "trcde_blf_sts"];
                                poleSup.TRCDES = HttpContext.Current.Request.Form[sup + "trcdes"];
                                poleSup.TRCDE_CTP = HttpContext.Current.Request.Form[sup + "trcde_ctp"];
                                //腕臂本体（含隧道弓型腕臂）
                                poleSup.ARMS_BLF_STS = HttpContext.Current.Request.Form[sup + "arms_blf_sts"];
                                poleSup.ARMS = HttpContext.Current.Request.Form[sup + "arms"];
                                //连接器
                                poleSup.CNT_CTP = HttpContext.Current.Request.Form[sup + "cnt_ctp"];
                                poleSup.CTNS = HttpContext.Current.Request.Form[sup + "ctns"];
                                //有无管帽
                                poleSup.HAS_CAP_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "has_cap_std"]);
                                poleSup.HAS_CAP_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "has_cap_msd"]);
                                //其他特殊腕臂型式 
                                poleSup.OTH_ARM_MDL = HttpContext.Current.Request.Form[sup + "oth_arm_mdl"];
                                try
                                {
                                    isSuccessSupUpdate = bllPoleSup.Update(poleSup);
                                }
                                catch (Exception)
                                {
                                    isSuccessSupUpdate = false;
                                }
                            }
                        }
                        else if (supNum >= newSupportCount)//修改时有新增的支持装置选项卡
                        {
                            for (int i = newSupportCount; i <= supNum; i++)
                            {
                                if (i > newSupportCount - 1)
                                    sup = "new_support-" + i + "-";
                                //////支撑装置
                                poleSup.POLE_CODE = pole.POLE_CODE;
                                poleSup.SPTDVC_NO = "S" + Guid.NewGuid().ToString().Replace("-", "");
                                poleSup.UBMH_NUM = StrToDouble(HttpContext.Current.Request.Form[sup + "ubmh_num"]);//上底座安装孔位
                                poleSup.BSPC = StrToDouble(HttpContext.Current.Request.Form[sup + "bspc"]);//底座间距
                                poleSup.BSHS = StrToDouble(HttpContext.Current.Request.Form[sup + "bshs"]);// 套管座位置
                                poleSup.MSSGS = StrToDouble(HttpContext.Current.Request.Form[sup + "mssgs"]);// 承力索座位置
                                poleSup.BSHC = StrToDouble(HttpContext.Current.Request.Form[sup + "bshc"]);// 套管环位置
                                poleSup.BSHSE = StrToDouble(HttpContext.Current.Request.Form[sup + "bshse"]);// φ55套管单耳位置
                                                                                                             //结构高度
                                poleSup.STRTHG_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "strthg_std"]);
                                poleSup.STRTHG_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "strthg_msd"]);
                                poleSup.STRTHG_SFV = StrToDouble(HttpContext.Current.Request.Form[sup + "strthg_sfv"]);
                                //平腕臂管
                                poleSup.HRM_DMT = StrToDouble(HttpContext.Current.Request.Form[sup + "hrm_dmt"]);
                                poleSup.HRM_LEN_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "hrm_len_std"]);
                                poleSup.HRM_LEN_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "hrm_len_msd"]);
                                //斜腕臂管
                                poleSup.ORM_DMT = StrToDouble(HttpContext.Current.Request.Form[sup + "orm_dmt"]);
                                poleSup.ORM_LEN_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "orm_len_std"]);
                                poleSup.ORM_LEN_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "orm_len_msd"]);
                                //斜拉线
                                poleSup.OCB_LEN_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "ocb_len_std"]);
                                poleSup.OCB_LEN_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "ocb_len_msd"]);
                                poleSup.OCBL_DMT = StrToDouble(HttpContext.Current.Request.Form[sup + "ocbl_dmt"]);
                                //腕臂支撑管在平腕臂位置
                                poleSup.ASTWHRM_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "astwhrm_std"]);
                                poleSup.ASTWHRM_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "astwhrm_msd"]);
                                poleSup.ASTWHRM_SFV = StrToDouble(HttpContext.Current.Request.Form[sup + "astwhrm_sfv"]);
                                //腕臂支撑管在斜腕臂位置
                                poleSup.ASTWORM = StrToDouble(HttpContext.Current.Request.Form[sup + "astworm"]);
                                //铁帽压板-平腕臂
                                poleSup.IPT_HRM_TRQ_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "ipt_hrm_trq_std"]);
                                poleSup.IPT_HRM_TRQ_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "ipt_hrm_trq_msd"]);
                                poleSup.IPT_HRM_TRQ_SFV = StrToDouble(HttpContext.Current.Request.Form[sup + "ipt_hrm_trq_sfv"]);
                                //铁帽压板-斜腕臂
                                poleSup.IPT_ORM_TRQ_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "ipt_orm_trq_std"]);
                                poleSup.IPT_ORM_TRQ_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "ipt_orm_trq_msd"]);
                                poleSup.IPT_ORM_TRQ_SFV = StrToDouble(HttpContext.Current.Request.Form[sup + "ipt_orm_trq_sfv"]);
                                //腕臂底座-平腕臂底座
                                poleSup.RMB_HRM_BMDL = HttpContext.Current.Request.Form[sup + "rmb_hrm_bmdl"];
                                poleSup.RMB_HRM_TRQ_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "rmb_hrm_trq_std"]);
                                poleSup.RMB_HRM_TRQ_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "rmb_hrm_trq_msd"]);
                                poleSup.RMB_HRM_TRQ_SFV = StrToDouble(HttpContext.Current.Request.Form[sup + "rmb_hrm_trq_sfv"]);
                                poleSup.RMB_HRM_SOPT = HttpContext.Current.Request.Form[sup + "rmb_hrm_sopt"];
                                //腕臂底座-斜腕臂底座
                                poleSup.RMB_ORM_BMDL = HttpContext.Current.Request.Form[sup + "rmb_orm_bmdl"];
                                poleSup.RMB_ORM_TRQ_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "rmb_orm_trq_std"]);
                                poleSup.RMB_ORM_TRQ_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "rmb_orm_trq_msd"]);
                                poleSup.RMB_ORM_TRQ_SFV = StrToDouble(HttpContext.Current.Request.Form[sup + "rmb_orm_trq_sfv"]);
                                poleSup.RMB_ORM_SOPT = HttpContext.Current.Request.Form[sup + "rmb_orm_sopt"];
                                //腕臂支撑
                                poleSup.ARM_LEN_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "arm_len_std"]);
                                poleSup.ARM_LEN_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "arm_len_msd"]);
                                //腕臂及支撑
                                poleSup.ARMSP_ARM_STS = HttpContext.Current.Request.Form[sup + "armsp_arm_sts"];
                                poleSup.ARMSP_ARMS_STS = HttpContext.Current.Request.Form[sup + "armsp_arms_sts"];
                                //腕臂及支撑_平腕臂套管单耳
                                poleSup.ARMSP_HRM_TRQ_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_hrm_trq_std"]);
                                poleSup.ARMSP_HRM_TRQ_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_hrm_trq_msd"]);
                                poleSup.ARMSP_HRM_TRQ_SFV = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_hrm_trq_sfv"]);
                                //腕臂及支撑_斜腕臂套管单耳
                                poleSup.ARMSP_ORM_TRQ_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_orm_trq_std"]);
                                poleSup.ARMSP_ORM_TRQ_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_orm_trq_msd"]);
                                poleSup.ARMSP_ORM_TRQ_SFV = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_orm_trq_sfv"]);
                                //腕臂及支撑_平腕臂双耳套筒
                                poleSup.ARMSP_HRM_TWTRQ_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_hrm_twtrq_std"]);
                                poleSup.ARMSP_HRM_TWTRQ_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_hrm_twtrq_msd"]);
                                poleSup.ARMSP_HRM_TWTRQ_SFV = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_hrm_twtrq_sfv"]);
                                poleSup.ARMSP_HRM_NTTRQ_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_hrm_nttrq_std"]);
                                poleSup.ARMSP_HRM_NTTRQ_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_hrm_nttrq_msd"]);
                                poleSup.ARMSP_HRM_NTTRQ_SFV = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_hrm_nttrq_sfv"]);
                                poleSup.ARMSP_ARMDE_STS = HttpContext.Current.Request.Form[sup + "armsp_armde_sts"];
                                poleSup.ARMSP_ORMDE_CPN_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_ormde_cpn_std"]);
                                poleSup.ARMSP_ORMDE_CPN_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_ormde_cpn_msd"]);
                                poleSup.ARMSP_ORMDE_CPN_SFV = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_ormde_cpn_sfv"]);
                                //腕臂及支撑_斜腕臂双耳套筒
                                poleSup.ARMSP_ORMDE_CMP = HttpContext.Current.Request.Form[sup + "armsp_ormde_cmp"];
                                poleSup.ARMSP_ORMDE_TRQ_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_ormde_trq_std"]);
                                poleSup.ARMSP_ORMDE_TRQ_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_ormde_trq_msd"]);
                                poleSup.ARMSP_ORMDE_TRQ_SFV = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_ormde_trq_sfv"]);
                                poleSup.ARMSP_ORMDES_STS = HttpContext.Current.Request.Form[sup + "armsp_ormdes_sts"];
                                //腕臂底座
                                poleSup.ARMB_BLF_STS = HttpContext.Current.Request.Form[sup + "armb_blf_sts"];
                                poleSup.ARMBS = HttpContext.Current.Request.Form[sup + "armbs"];
                                poleSup.ARMB_CTP = HttpContext.Current.Request.Form[sup + "armb_ctp"];
                                //腕臂支撑
                                poleSup.ARMSP_BLF_STS = HttpContext.Current.Request.Form[sup + "armsp_blf_sts"];
                                poleSup.ARMSPS = HttpContext.Current.Request.Form[sup + "armsps"];
                                poleSup.ARMSPS_CTP = HttpContext.Current.Request.Form[sup + "armsps_ctp"];
                                //套管铰环
                                poleSup.TRC_BLF_STS = HttpContext.Current.Request.Form[sup + "trc_blf_sts"];
                                poleSup.TRCS = HttpContext.Current.Request.Form[sup + "trcs"];
                                poleSup.TRC_CTP = HttpContext.Current.Request.Form[sup + "trc_ctp"];
                                //套管双耳
                                poleSup.TRCDE_BLF_STS = HttpContext.Current.Request.Form[sup + "trcde_blf_sts"];
                                poleSup.TRCDES = HttpContext.Current.Request.Form[sup + "trcdes"];
                                poleSup.TRCDE_CTP = HttpContext.Current.Request.Form[sup + "trcde_ctp"];
                                //腕臂本体（含隧道弓型腕臂）
                                poleSup.ARMS_BLF_STS = HttpContext.Current.Request.Form[sup + "arms_blf_sts"];
                                poleSup.ARMS = HttpContext.Current.Request.Form[sup + "arms"];
                                //连接器
                                poleSup.CNT_CTP = HttpContext.Current.Request.Form[sup + "cnt_ctp"];
                                poleSup.CTNS = HttpContext.Current.Request.Form[sup + "ctns"];
                                //有无管帽
                                poleSup.HAS_CAP_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "has_cap_std"]);
                                poleSup.HAS_CAP_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "has_cap_msd"]);
                                //其他特殊腕臂型式 
                                poleSup.OTH_ARM_MDL = HttpContext.Current.Request.Form[sup + "oth_arm_mdl"];
                                try
                                {
                                    isSuccessSupUpdate = bllPoleSup.Add(poleSup);
                                }
                                catch (Exception)
                                {
                                    isSuccessSupUpdate = false;
                                }
                            }
                        }
                        rsSup = isSuccessSupUpdate ? "2" : "-2";

                    }
                    catch (Exception ex)
                    {
                        rsSup = "-2";
                    }
                    #endregion
                    #region 支柱修改界面-定位装置
                    ADO.BLL.MIS_POLE_LOCATOR bllPoleLoc = new ADO.BLL.MIS_POLE_LOCATOR();
                    ADO.Model.MIS_POLE_LOCATOR poleLoc = new ADO.Model.MIS_POLE_LOCATOR();
                    //查询数据库里同一支柱的定位装置数
                    string countLoc = "select count(1) from MIS_POLE_LOCATOR WHERE POLE_CODE ='" + pole.POLE_CODE + "'";//查询同一支柱的定位装置数
                    int newLocatorCount;
                    try { newLocatorCount = Convert.ToInt32(DbHelperOra_ADO.GetSingle(countLoc)); } catch (Exception) { newLocatorCount = 0; }
                    bool isSuccessLocUpdate = false;
                    string loc = "";
                    try
                    {
                        if (locNum < newLocatorCount)//修改时不添加新的定位装置（supNum代表定位装置总数，newSupportCount代表数据库定位装置总数）
                        {
                            for (int i = 0; i < newLocatorCount; i++)
                            {
                                if (i > 0)
                                    loc = "new_location-" + i + "-";
                                poleLoc.POLE_CODE = pole.POLE_CODE;
                                poleLoc.LCT_ID = HttpContext.Current.Request[loc + "lct_id"];//向前端请求定位装置ID
                                poleLoc.LCT_NO = HttpContext.Current.Request.Form[loc + "lct_no"];
                                poleLoc.LCTDMT = StrToDouble(HttpContext.Current.Request.Form[loc + "lctdmt"]);
                                poleLoc.LCTTLEN_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "lcttlen_std"]);
                                poleLoc.LCTTLEN_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "lcttlen_msd"]);
                                poleLoc.LCTTLEN_SFV = StrToDouble(HttpContext.Current.Request.Form[loc + "lcttlen_sfv"]);
                                poleLoc.LSPLEN_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "lsplen_std"]);
                                poleLoc.LSPLEN_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "lsplen_msd"]);
                                poleLoc.LSPLEN_SFV = StrToDouble(HttpContext.Current.Request.Form[loc + "lsplen_sfv"]);
                                poleLoc.LCTLEN_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "lctlen_std"]);
                                poleLoc.LCTLEN_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "lctlen_msd"]);
                                poleLoc.LCTLEN_SFV = StrToDouble(HttpContext.Current.Request.Form[loc + "lctlen_sfv"]);
                                poleLoc.LCTCLRC_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "lctclrc_std"]);
                                poleLoc.LCTCLRC_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "lctclrc_msd"]);
                                poleLoc.LCTCLRC_SFV = StrToDouble(HttpContext.Current.Request.Form[loc + "lctclrc_sfv"]);
                                poleLoc.WDPCBLLEN_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "wdpcbllen_std"]);
                                poleLoc.WDPCBLLEN_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "wdpcbllen_msd"]);
                                poleLoc.WDPCBL_DMT = StrToDouble(HttpContext.Current.Request.Form[loc + "wdpcbl_dmt"]);
                                poleLoc.LCTTWHARM = HttpContext.Current.Request.Form[loc + "lcttwharm"];
                                poleLoc.LCTRW = StrToDouble(HttpContext.Current.Request.Form[loc + "lctrw"]);
                                poleLoc.LCTTWORM = StrToDouble(HttpContext.Current.Request.Form[loc + "lcttworm"]);
                                poleLoc.LCTWLCTT = StrToDouble(HttpContext.Current.Request.Form[loc + "lctwlctt"]);
                                poleLoc.LCTUW = StrToDouble(HttpContext.Current.Request.Form[loc + "lctuw"]);
                                poleLoc.LCT_TP = HttpContext.Current.Request.Form[loc + "lct_tp"];
                                poleLoc.LCT_MDL = HttpContext.Current.Request.Form[loc + "lct_mdl"];
                                poleLoc.LCT_SLP = StrToDouble(HttpContext.Current.Request.Form[loc + "lct_slp"]);
                                poleLoc.LCTRMMT_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "lctrmmt_std"]);
                                poleLoc.LCTRMMT_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "lctrmmt_msd"]);
                                poleLoc.LCTRS_STS = HttpContext.Current.Request.Form[loc + "lctrs_sts"];
                                poleLoc.LCTR_LSP_CMP = HttpContext.Current.Request.Form[loc + "lctr_lsp_cmp"];
                                poleLoc.LCTR_POP_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "lctr_pop_std"]);
                                poleLoc.LCTR_POP_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "lctr_pop_msd"]);
                                poleLoc.LCTR_POP_SFV = StrToDouble(HttpContext.Current.Request.Form[loc + "lctr_pop_sfv"]);
                                poleLoc.LCTTDETWMMT_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "lcttdetwmmt_std"]);
                                poleLoc.LCTTDETWMMT_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "lcttdetwmmt_msd"]);
                                poleLoc.LCTTDESPTNT_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "lcttdesptnt_std"]);
                                poleLoc.LCTTDESPTNT_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "lcttdesptnt_msd"]);
                                poleLoc.LCTTDES_STS = HttpContext.Current.Request.Form[loc + "lcttdes_sts"];
                                poleLoc.LCTTDE_LSSTS = HttpContext.Current.Request.Form[loc + "lcttde_lssts"];
                                poleLoc.LCTSPMMT_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "lctspmmt_std"]);
                                poleLoc.LCTSPMMT_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "lctspmmt_msd"]);
                                poleLoc.LCTSPS_STS = HttpContext.Current.Request.Form[loc + "lctsps_sts"];
                                poleLoc.CNWMMT_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "cnwmmt_std"]);
                                poleLoc.CNWMMT_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "cnwmmt_msd"]);
                                poleLoc.CNWS_STS = HttpContext.Current.Request.Form[loc + "cnws_sts"];
                                poleLoc.LCTS_STS = HttpContext.Current.Request.Form[loc + "lcts_sts"];
                                poleLoc.WDPC_STS = HttpContext.Current.Request.Form[loc + "wdpc_sts"];
                                poleLoc.LCTCLMPMMT_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "lctclmpmmt_std"]);
                                poleLoc.LCTCLMPMMT_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "lctclmpmmt_msd"]);
                                poleLoc.LCTCLMPS_STS = HttpContext.Current.Request.Form[loc + "lctclmps_sts"];
                                poleLoc.LSDEOR_TW_MMT_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "lsdeor_tw_mmt_msd"]);
                                poleLoc.LSDEOR_TW_MMT_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "lsdeor_tw_mmt_std"]);
                                poleLoc.LSDEOR_SPNT_MMT_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "lsdeor_spnt_mmt_msd"]);
                                poleLoc.LSDEOR_SPNT_MMT_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "lsdeor_spnt_mmt_std"]);
                                poleLoc.LSDEORS_STS = HttpContext.Current.Request.Form[loc + "lsdeors_sts"];
                                poleLoc.LSDELTC_TW_MMT_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "lsdeltc_tw_mmt_msd"]);
                                poleLoc.LSDELTC_TW_MMT_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "lsdeltc_tw_mmt_std"]);
                                poleLoc.LSDELTC_SPNT_MMT_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "lsdeltc_spnt_mmt_msd"]);
                                poleLoc.LSDELTC_SPNT_MMT_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "lsdeltc_spnt_mmt_std"]);
                                poleLoc.LSDELTCS_STS = HttpContext.Current.Request.Form[loc + "lsdeltcs_sts"];
                                poleLoc.BSHSEORM_MMT_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "bshseorm_mmt_std"]);
                                poleLoc.BSHSEORM_MMT_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "bshseorm_mmt_msd"]);
                                poleLoc.BSHSEORMS_STS = HttpContext.Current.Request.Form[loc + "bshseorms_sts"];
                                poleLoc.BSHSELTC_MMT_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "bshseltc_mmt_std"]);
                                poleLoc.BSHSELTC_MMT_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "bshseltc_mmt_msd"]);
                                poleLoc.BSHSELTCS_STS = HttpContext.Current.Request.Form[loc + "bshseltcs_sts"];
                                poleLoc.LCTNT_STS = HttpContext.Current.Request.Form[loc + "lctnt_sts"];
                                poleLoc.SPSB = HttpContext.Current.Request.Form[loc + "spsb"];
                                poleLoc.SPOP = HttpContext.Current.Request.Form[loc + "spop"];
                                poleLoc.LCTCLMP_STS = HttpContext.Current.Request.Form[loc + "lctclmp_sts"];
                                poleLoc.LCTCLMPSB = HttpContext.Current.Request.Form[loc + "lctclmpsb"];
                                poleLoc.LCTBLT_STS = HttpContext.Current.Request.Form[loc + "lctblt_sts"];
                                poleLoc.LCTSB = HttpContext.Current.Request.Form[loc + "lctsb"];
                                poleLoc.LCTOP = HttpContext.Current.Request.Form[loc + "lctop"];
                                poleLoc.LCTT_STS = HttpContext.Current.Request.Form[loc + "lctt_sts"];
                                poleLoc.LCTTSB = HttpContext.Current.Request.Form[loc + "lcttsb"];
                                poleLoc.LCTRB_STS = HttpContext.Current.Request.Form[loc + "lctrb_sts"];
                                poleLoc.LCTRSB = HttpContext.Current.Request.Form[loc + "lctrsb"];
                                poleLoc.LCTSPB_STS = HttpContext.Current.Request.Form[loc + "lctspb_sts"];
                                poleLoc.LCTSPSB = HttpContext.Current.Request.Form[loc + "lctspsb"];
                                try
                                {
                                    isSuccessLocUpdate = bllPoleLoc.Update(poleLoc);
                                }
                                catch (Exception)
                                {
                                    isSuccessLocUpdate = false;
                                }
                            }
                        }
                        else if (locNum >= newLocatorCount)//修改时有新增的定位装置选项卡
                        {
                            for (int i = newLocatorCount; i <= locNum; i++)
                            {
                                if (i > newLocatorCount - 1)
                                    loc = "new_location-" + i + "-";
                                poleLoc.POLE_CODE = pole.POLE_CODE;
                                poleLoc.LCT_ID = "L" + Guid.NewGuid().ToString().Replace("-", "");
                                poleLoc.LCT_NO = HttpContext.Current.Request.Form[loc + "lct_no"];
                                poleLoc.LCTDMT = StrToDouble(HttpContext.Current.Request.Form[loc + "lctdmt"]);
                                poleLoc.LCTTLEN_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "lcttlen_std"]);
                                poleLoc.LCTTLEN_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "lcttlen_msd"]);
                                poleLoc.LCTTLEN_SFV = StrToDouble(HttpContext.Current.Request.Form[loc + "lcttlen_sfv"]);
                                poleLoc.LSPLEN_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "lsplen_std"]);
                                poleLoc.LSPLEN_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "lsplen_msd"]);
                                poleLoc.LSPLEN_SFV = StrToDouble(HttpContext.Current.Request.Form[loc + "lsplen_sfv"]);
                                poleLoc.LCTLEN_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "lctlen_std"]);
                                poleLoc.LCTLEN_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "lctlen_msd"]);
                                poleLoc.LCTLEN_SFV = StrToDouble(HttpContext.Current.Request.Form[loc + "lctlen_sfv"]);
                                poleLoc.LCTCLRC_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "lctclrc_std"]);
                                poleLoc.LCTCLRC_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "lctclrc_msd"]);
                                poleLoc.LCTCLRC_SFV = StrToDouble(HttpContext.Current.Request.Form[loc + "lctclrc_sfv"]);
                                poleLoc.WDPCBLLEN_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "wdpcbllen_std"]);
                                poleLoc.WDPCBLLEN_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "wdpcbllen_msd"]);
                                poleLoc.WDPCBL_DMT = StrToDouble(HttpContext.Current.Request.Form[loc + "wdpcbl_dmt"]);
                                poleLoc.LCTTWHARM = HttpContext.Current.Request.Form[loc + "lcttwharm"];
                                poleLoc.LCTRW = StrToDouble(HttpContext.Current.Request.Form[loc + "lctrw"]);
                                poleLoc.LCTTWORM = StrToDouble(HttpContext.Current.Request.Form[loc + "lcttworm"]);
                                poleLoc.LCTWLCTT = StrToDouble(HttpContext.Current.Request.Form[loc + "lctwlctt"]);
                                poleLoc.LCTUW = StrToDouble(HttpContext.Current.Request.Form[loc + "lctuw"]);
                                poleLoc.LCT_TP = HttpContext.Current.Request.Form[loc + "lct_tp"];
                                poleLoc.LCT_MDL = HttpContext.Current.Request.Form[loc + "lct_mdl"];
                                poleLoc.LCT_SLP = StrToDouble(HttpContext.Current.Request.Form[loc + "lct_slp"]);
                                poleLoc.LCTRMMT_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "lctrmmt_std"]);
                                poleLoc.LCTRMMT_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "lctrmmt_msd"]);
                                poleLoc.LCTRS_STS = HttpContext.Current.Request.Form[loc + "lctrs_sts"];
                                poleLoc.LCTR_LSP_CMP = HttpContext.Current.Request.Form[loc + "lctr_lsp_cmp"];
                                poleLoc.LCTR_POP_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "lctr_pop_std"]);
                                poleLoc.LCTR_POP_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "lctr_pop_msd"]);
                                poleLoc.LCTR_POP_SFV = StrToDouble(HttpContext.Current.Request.Form[loc + "lctr_pop_sfv"]);
                                poleLoc.LCTTDETWMMT_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "lcttdetwmmt_std"]);
                                poleLoc.LCTTDETWMMT_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "lcttdetwmmt_msd"]);
                                poleLoc.LCTTDESPTNT_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "lcttdesptnt_std"]);
                                poleLoc.LCTTDESPTNT_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "lcttdesptnt_msd"]);
                                poleLoc.LCTTDES_STS = HttpContext.Current.Request.Form[loc + "lcttdes_sts"];
                                poleLoc.LCTTDE_LSSTS = HttpContext.Current.Request.Form[loc + "lcttde_lssts"];
                                poleLoc.LCTSPMMT_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "lctspmmt_std"]);
                                poleLoc.LCTSPMMT_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "lctspmmt_msd"]);
                                poleLoc.LCTSPS_STS = HttpContext.Current.Request.Form[loc + "lctsps_sts"];
                                poleLoc.CNWMMT_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "cnwmmt_std"]);
                                poleLoc.CNWMMT_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "cnwmmt_msd"]);
                                poleLoc.CNWS_STS = HttpContext.Current.Request.Form[loc + "cnws_sts"];
                                poleLoc.LCTS_STS = HttpContext.Current.Request.Form[loc + "lcts_sts"];
                                poleLoc.WDPC_STS = HttpContext.Current.Request.Form[loc + "wdpc_sts"];
                                poleLoc.LCTCLMPMMT_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "lctclmpmmt_std"]);
                                poleLoc.LCTCLMPMMT_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "lctclmpmmt_msd"]);
                                poleLoc.LCTCLMPS_STS = HttpContext.Current.Request.Form[loc + "lctclmps_sts"];
                                poleLoc.LSDEOR_TW_MMT_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "lsdeor_tw_mmt_msd"]);
                                poleLoc.LSDEOR_TW_MMT_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "lsdeor_tw_mmt_std"]);
                                poleLoc.LSDEOR_SPNT_MMT_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "lsdeor_spnt_mmt_msd"]);
                                poleLoc.LSDEOR_SPNT_MMT_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "lsdeor_spnt_mmt_std"]);
                                poleLoc.LSDEORS_STS = HttpContext.Current.Request.Form[loc + "lsdeors_sts"];
                                poleLoc.LSDELTC_TW_MMT_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "lsdeltc_tw_mmt_msd"]);
                                poleLoc.LSDELTC_TW_MMT_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "lsdeltc_tw_mmt_std"]);
                                poleLoc.LSDELTC_SPNT_MMT_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "lsdeltc_spnt_mmt_msd"]);
                                poleLoc.LSDELTC_SPNT_MMT_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "lsdeltc_spnt_mmt_std"]);
                                poleLoc.LSDELTCS_STS = HttpContext.Current.Request.Form[loc + "lsdeltcs_sts"];
                                poleLoc.BSHSEORM_MMT_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "bshseorm_mmt_std"]);
                                poleLoc.BSHSEORM_MMT_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "bshseorm_mmt_msd"]);
                                poleLoc.BSHSEORMS_STS = HttpContext.Current.Request.Form[loc + "bshseorms_sts"];
                                poleLoc.BSHSELTC_MMT_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "bshseltc_mmt_std"]);
                                poleLoc.BSHSELTC_MMT_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "bshseltc_mmt_msd"]);
                                poleLoc.BSHSELTCS_STS = HttpContext.Current.Request.Form[loc + "bshseltcs_sts"];
                                poleLoc.LCTNT_STS = HttpContext.Current.Request.Form[loc + "lctnt_sts"];
                                poleLoc.SPSB = HttpContext.Current.Request.Form[loc + "spsb"];
                                poleLoc.SPOP = HttpContext.Current.Request.Form[loc + "spop"];
                                poleLoc.LCTCLMP_STS = HttpContext.Current.Request.Form[loc + "lctclmp_sts"];
                                poleLoc.LCTCLMPSB = HttpContext.Current.Request.Form[loc + "lctclmpsb"];
                                poleLoc.LCTBLT_STS = HttpContext.Current.Request.Form[loc + "lctblt_sts"];
                                poleLoc.LCTSB = HttpContext.Current.Request.Form[loc + "lctsb"];
                                poleLoc.LCTOP = HttpContext.Current.Request.Form[loc + "lctop"];
                                poleLoc.LCTT_STS = HttpContext.Current.Request.Form[loc + "lctt_sts"];
                                poleLoc.LCTTSB = HttpContext.Current.Request.Form[loc + "lcttsb"];
                                poleLoc.LCTRB_STS = HttpContext.Current.Request.Form[loc + "lctrb_sts"];
                                poleLoc.LCTRSB = HttpContext.Current.Request.Form[loc + "lctrsb"];
                                poleLoc.LCTSPB_STS = HttpContext.Current.Request.Form[loc + "lctspb_sts"];
                                poleLoc.LCTSPSB = HttpContext.Current.Request.Form[loc + "lctspsb"];
                                try
                                {
                                    isSuccessLocUpdate = bllPoleLoc.Add(poleLoc);
                                }
                                catch (Exception)
                                {
                                    isSuccessLocUpdate = false;
                                }
                            }
                        }
                        rsLoc = isSuccessLocUpdate & isSuccessLocUpdate ? "3" : "-3";
                    }
                    catch (Exception ex)
                    {
                        rsLoc = "-2";
                    }
                    #endregion
                }
                else
                {
                    Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "支柱管理", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "支柱管理修改了信息" + id, "", false);
                }
            }
            catch (Exception ex)
            {
                rs = "-1";
            }
            finally
            {
                //返回执行结果
                StringBuilder sb = new StringBuilder();
                sb.AppendFormat("{{\"POLE_RESULT\":\"{0}\",\"POLE_SPTD_RESULT\":\"{1}\",\"POLE_LOCATOR\":\"{2}\",\"POLE_EXIST\":\"{3}\"}}", rs, rsSup, rsLoc, rs_exist);
                string js = sb.ToString();
                HttpContext.Current.Response.Write(js);
            }
        }
    }
    /// <summary>
    /// 增加
    /// </summary>
    private void Add(string newSupNum, string newLocNum)
    {
        if (Exist("") == "1")
        {
        }
        else
        {
            string rs_exist = Exist("");
            int supNum, locNum;
            try { supNum = Int16.Parse(newSupNum); } catch (Exception) { supNum = 0; }//支持装置选项卡
            try { locNum = Int16.Parse(newLocNum); } catch (Exception) { locNum = 0; }//定位装置选项卡
            string rs = "-1", rsSup = "", rsLoc = "";
            try
            {
                ADO.BLL.MIS_POLE bllPole = new ADO.BLL.MIS_POLE();
                ADO.BLL.MIS_POLE_SPTD bllPoleSup = new ADO.BLL.MIS_POLE_SPTD();
                ADO.BLL.MIS_POLE_LOCATOR bllPoleLoc = new ADO.BLL.MIS_POLE_LOCATOR();
                ADO.Model.MIS_POLE pole = new ADO.Model.MIS_POLE();
                ADO.Model.MIS_POLE_SPTD poleSup = new ADO.Model.MIS_POLE_SPTD();
                ADO.Model.MIS_POLE_LOCATOR poleLoc = new ADO.Model.MIS_POLE_LOCATOR();
                string polecode = "P" + Guid.NewGuid().ToString().Replace("-", "");//生成POLE_CODE

                pole.LINE_CODE = HttpContext.Current.Request.Form["line_code"];
                pole.POSITION_CODE = HttpContext.Current.Request.Form["position_code"];
                pole.BRG_TUN_CODE = HttpContext.Current.Request.Form["brg_tun_code"];
                pole.BUREAU_CODE = HttpContext.Current.Request.Form["bureau_code"];
                pole.POWER_SECTION_CODE = HttpContext.Current.Request.Form["power_section_code"];
                pole.WORKSHOP_CODE = HttpContext.Current.Request.Form["workshop_code"];
                pole.ORG_CODE = HttpContext.Current.Request.Form["org_code"];

                pole.POLE_CODE = polecode;

                #region 支柱添加界面-支柱信息
                //基础信息
                pole.POLE_IMG = HttpContext.Current.Request.Form["pole_img"];
                pole.LINE_NAME = HttpContext.Current.Request.Form["line_name"];
                pole.POLE_DIRECTION = HttpContext.Current.Request.Form["pole_direction"];
                pole.POSITION_NAME = HttpContext.Current.Request.Form["position_name"];
                pole.BRG_TUN_NAME = HttpContext.Current.Request.Form["brg_tun_name"];
                pole.POLE_NO = HttpContext.Current.Request.Form["pole_no"];
                try { pole.KMSTANDARD = ulong.Parse(HttpContext.Current.Request.Form["kmstandard"]); }
                catch (Exception) { pole.KMSTANDARD = 0; }
                pole.BUREAU_NAME = HttpContext.Current.Request.Form["bureau_name"];
                pole.POWER_SECTION_NAME = HttpContext.Current.Request.Form["power_section_name"];
                pole.WORKSHOP_NAME = HttpContext.Current.Request.Form["workshop_name"];
                pole.ORG_NAME = HttpContext.Current.Request.Form["org_name"];

                //支柱属性
                pole.MD_CODE = HttpContext.Current.Request.Form["md_code"];
                pole.TRACK_CODE = HttpContext.Current.Request.Form["track_code"];
                pole.POLE_TYPE = HttpContext.Current.Request.Form["pole_type"];
                pole.POLE_MDL = HttpContext.Current.Request.Form["pole_mdl"];
                pole.POLE_USAGE = HttpContext.Current.Request.Form["pole_usage"];
                pole.INSTALL_IMG_NO = HttpContext.Current.Request.Form["install_img_no"];
                pole.MTR_QLT = HttpContext.Current.Request.Form["mtr_qlt"];
                pole.SPAN_LENGTH = HttpContext.Current.Request.Form["span_length"];
                pole.CURVE_RADIUS = HttpContext.Current.Request.Form["curve_radius"];
                pole.SIDE_LIMIT_CX = HttpContext.Current.Request.Form["side_limit_cx"];
                pole.RAILFACE_HIGH = HttpContext.Current.Request.Form["railface_high"];
                //pole.ADDITIONNO = HttpContext.Current.Request.Form["ADDITIONNO"];/////////////////////////
                pole.POLE_BSC_STS = HttpContext.Current.Request.Form["pole_bsc_sts"];
                pole.POLE_BASIC_TYPE = HttpContext.Current.Request.Form["pole_basic_type"];
                pole.POLE_STATUS = HttpContext.Current.Request.Form["pole_status"];
                pole.MNFT_FCT = HttpContext.Current.Request.Form["mnft_fct"];
                try { pole.COMMS_DATE = Convert.ToDateTime(HttpContext.Current.Request.Form["comms_date"]); }
                catch (Exception) { pole.COMMS_DATE = DateTime.Now; }
                pole.CURVE_DIRECTION = HttpContext.Current.Request.Form["curve_direction"];
                try { pole.PROD_DATE = Convert.ToDateTime(HttpContext.Current.Request.Form["prod_date"]); }
                catch (Exception) { pole.PROD_DATE = DateTime.Now; }
                try { pole.DSGN_LIFE = Convert.ToUInt32(HttpContext.Current.Request.Form["dsgn_life"]); }
                catch (Exception) { pole.DSGN_LIFE = 0; }
                pole.AUX_JXZQ = HttpContext.Current.Request.Form["aux_jxzq"];
                pole.GRND_STS = HttpContext.Current.Request.Form["grnd_sts"];
                //其他部件
                pole.AUX_HAS_BCZZ = HttpContext.Current.Request.Form["aux_has_bczz"];
                pole.AUX_HAS_FDJYQ = HttpContext.Current.Request.Form["aux_has_fdjyq"];
                pole.AUX_HAS_FXJYQ = HttpContext.Current.Request.Form["aux_has_fxjyq"];
                pole.AUX_BE_JCXC = HttpContext.Current.Request.Form["aux_has_jcxc"];
                pole.AUX_BE_LXWJCXC = HttpContext.Current.Request.Form["aux_be_lxwjcxc"];
                pole.AUX_BE_SXWJCXC = HttpContext.Current.Request.Form["aux_be_sxwjcxc"];
                pole.AUX_BE_MDGJSDFX = HttpContext.Current.Request.Form["aux_be_mdgjsdfx"];
                pole.AUX_HAS_YHK = HttpContext.Current.Request.Form["aux_has_yhx"];
                pole.AUX_HAS_DLJX = HttpContext.Current.Request.Form["aux_has_dljx"];
                pole.AUX_HAS_GLKG = HttpContext.Current.Request.Form["aux_has_glkg"];
                pole.AUX_HAS_BLQ = HttpContext.Current.Request.Form["aux_has_blq"];
                pole.AUX_HAS_DCGYZZ = HttpContext.Current.Request.Form["aux_has_dcgyzz"];
                pole.AUX_HAS_XCBZP = HttpContext.Current.Request.Form["aux_has_xcbzp"];
                pole.AUX_HAS_JDZZ = HttpContext.Current.Request.Form["aux_has_jdzz"];
                pole.AUX_HAS_XSX = HttpContext.Current.Request.Form["aux_has_xsx"];
                pole.AUX_HAS_HLX = HttpContext.Current.Request.Form["aux_has_hlx"];
                pole.AUX_HAS_GWX = HttpContext.Current.Request.Form["aux_has_gwx"];
                pole.AUX_HAS_GDX = HttpContext.Current.Request.Form["aux_has_gdx"];
                pole.AUX_HAS_PWX = HttpContext.Current.Request.Form["aux_has_pwx"];
                pole.AUX_HAS_AFX = HttpContext.Current.Request.Form["aux_has_afx"];
                pole.AUX_HAS_JQX = HttpContext.Current.Request.Form["aux_has_jqx"];
                pole.AUX_HAS_BLZ = HttpContext.Current.Request.Form["aux_has_blz"];
                pole.AUX_HAS_LX = HttpContext.Current.Request.Form["aux_has_lx"];
                pole.AUX_HAS_ZM = HttpContext.Current.Request.Form["aux_has_zm"];
                #endregion
                //if (!string.IsNullOrEmpty(pole.LINE_CODE) && !string.IsNullOrEmpty(pole.POSITION_CODE) && !string.IsNullOrEmpty(pole.POLE_DIRECTION) && !string.IsNullOrEmpty(pole.POLE_NO))//线路、区站、行别、支柱号不能为空
                //{
                //}
                rs = bllPole.Add(pole) ? "1" : "-1";

                if (rs == "1")
                {
                    Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "支柱管理", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "支柱管理添加了新的信息" + pole.POLE_CODE, "", true);
                    #region 支柱添加界面-支持装置
                    string sup = "";
                    for (int i = 0; i <= supNum; i++)
                    {
                        if (i > 0)
                            sup = "new_support-" + i + "-";
                        //////支撑装置
                        poleSup.POLE_CODE = polecode;
                        string sptd_no = "S" + Guid.NewGuid().ToString().Replace("-", "");//生成支持装置编号SPTD_NO
                        poleSup.SPTDVC_NO = sptd_no;
                        poleSup.UBMH_NUM = StrToDouble(HttpContext.Current.Request.Form[sup + "ubmh_num"]);//上底座安装孔位
                        poleSup.BSPC = StrToDouble(HttpContext.Current.Request.Form[sup + "bspc"]);//底座间距
                        poleSup.BSHS = StrToDouble(HttpContext.Current.Request.Form[sup + "bshs"]);// 套管座位置
                        poleSup.MSSGS = StrToDouble(HttpContext.Current.Request.Form[sup + "mssgs"]);// 承力索座位置
                        poleSup.BSHC = StrToDouble(HttpContext.Current.Request.Form[sup + "bshc"]);// 套管环位置
                        poleSup.BSHSE = StrToDouble(HttpContext.Current.Request.Form[sup + "bshse"]);// φ55套管单耳位置
                                                                                                     //结构高度
                        poleSup.STRTHG_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "strthg_std"]);
                        poleSup.STRTHG_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "strthg_msd"]);
                        poleSup.STRTHG_SFV = StrToDouble(HttpContext.Current.Request.Form[sup + "strthg_sfv"]);
                        //平腕臂管
                        poleSup.HRM_DMT = StrToDouble(HttpContext.Current.Request.Form[sup + "hrm_dmt"]);
                        poleSup.HRM_LEN_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "hrm_len_std"]);
                        poleSup.HRM_LEN_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "hrm_len_msd"]);
                        //斜腕臂管
                        poleSup.ORM_DMT = StrToDouble(HttpContext.Current.Request.Form[sup + "orm_dmt"]);
                        poleSup.ORM_LEN_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "orm_len_std"]);
                        poleSup.ORM_LEN_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "orm_len_msd"]);
                        //斜拉线
                        poleSup.OCB_LEN_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "ocb_len_std"]);
                        poleSup.OCB_LEN_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "ocb_len_msd"]);
                        poleSup.OCBL_DMT = StrToDouble(HttpContext.Current.Request.Form[sup + "ocbl_dmt"]);
                        //腕臂支撑管在平腕臂位置
                        poleSup.ASTWHRM_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "astwhrm_std"]);
                        poleSup.ASTWHRM_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "astwhrm_msd"]);
                        poleSup.ASTWHRM_SFV = StrToDouble(HttpContext.Current.Request.Form[sup + "astwhrm_sfv"]);
                        //腕臂支撑管在斜腕臂位置
                        poleSup.ASTWORM = StrToDouble(HttpContext.Current.Request.Form[sup + "astworm"]);
                        //铁帽压板-平腕臂
                        poleSup.IPT_HRM_TRQ_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "ipt_hrm_trq_std"]);
                        poleSup.IPT_HRM_TRQ_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "ipt_hrm_trq_msd"]);
                        poleSup.IPT_HRM_TRQ_SFV = StrToDouble(HttpContext.Current.Request.Form[sup + "ipt_hrm_trq_sfv"]);
                        //铁帽压板-斜腕臂
                        poleSup.IPT_ORM_TRQ_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "ipt_orm_trq_std"]);
                        poleSup.IPT_ORM_TRQ_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "ipt_orm_trq_msd"]);
                        poleSup.IPT_ORM_TRQ_SFV = StrToDouble(HttpContext.Current.Request.Form[sup + "ipt_orm_trq_sfv"]);
                        //腕臂底座-平腕臂底座
                        poleSup.RMB_HRM_BMDL = HttpContext.Current.Request.Form[sup + "rmb_hrm_bmdl"];
                        poleSup.RMB_HRM_TRQ_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "rmb_hrm_trq_std"]);
                        poleSup.RMB_HRM_TRQ_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "rmb_hrm_trq_msd"]);
                        poleSup.RMB_HRM_TRQ_SFV = StrToDouble(HttpContext.Current.Request.Form[sup + "rmb_hrm_trq_sfv"]);
                        poleSup.RMB_HRM_SOPT = HttpContext.Current.Request.Form[sup + "rmb_hrm_sopt"];
                        //腕臂底座-斜腕臂底座
                        poleSup.RMB_ORM_BMDL = HttpContext.Current.Request.Form[sup + "rmb_orm_bmdl"];
                        poleSup.RMB_ORM_TRQ_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "rmb_orm_trq_std"]);
                        poleSup.RMB_ORM_TRQ_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "rmb_orm_trq_msd"]);
                        poleSup.RMB_ORM_TRQ_SFV = StrToDouble(HttpContext.Current.Request.Form[sup + "rmb_orm_trq_sfv"]);
                        poleSup.RMB_ORM_SOPT = HttpContext.Current.Request.Form[sup + "rmb_orm_sopt"];
                        //腕臂支撑
                        poleSup.ARM_LEN_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "arm_len_std"]);
                        poleSup.ARM_LEN_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "arm_len_msd"]);
                        //腕臂及支撑
                        poleSup.ARMSP_ARM_STS = HttpContext.Current.Request.Form[sup + "armsp_arm_sts"];
                        poleSup.ARMSP_ARMS_STS = HttpContext.Current.Request.Form[sup + "armsp_arms_sts"];
                        //腕臂及支撑_平腕臂套管单耳
                        poleSup.ARMSP_HRM_TRQ_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_hrm_trq_std"]);
                        poleSup.ARMSP_HRM_TRQ_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_hrm_trq_msd"]);
                        poleSup.ARMSP_HRM_TRQ_SFV = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_hrm_trq_sfv"]);
                        //腕臂及支撑_斜腕臂套管单耳
                        poleSup.ARMSP_ORM_TRQ_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_orm_trq_std"]);
                        poleSup.ARMSP_ORM_TRQ_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_orm_trq_msd"]);
                        poleSup.ARMSP_ORM_TRQ_SFV = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_orm_trq_sfv"]);
                        //腕臂及支撑_平腕臂双耳套筒
                        poleSup.ARMSP_HRM_TWTRQ_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_hrm_twtrq_std"]);
                        poleSup.ARMSP_HRM_TWTRQ_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_hrm_twtrq_msd"]);
                        poleSup.ARMSP_HRM_TWTRQ_SFV = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_hrm_twtrq_sfv"]);
                        poleSup.ARMSP_HRM_NTTRQ_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_hrm_nttrq_std"]);
                        poleSup.ARMSP_HRM_NTTRQ_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_hrm_nttrq_msd"]);
                        poleSup.ARMSP_HRM_NTTRQ_SFV = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_hrm_nttrq_sfv"]);
                        poleSup.ARMSP_ARMDE_STS = HttpContext.Current.Request.Form[sup + "armsp_armde_sts"];
                        poleSup.ARMSP_ORMDE_CPN_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_ormde_cpn_std"]);
                        poleSup.ARMSP_ORMDE_CPN_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_ormde_cpn_msd"]);
                        poleSup.ARMSP_ORMDE_CPN_SFV = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_ormde_cpn_sfv"]);
                        //腕臂及支撑_斜腕臂双耳套筒
                        poleSup.ARMSP_ORMDE_CMP = HttpContext.Current.Request.Form[sup + "armsp_ormde_cmp"];
                        poleSup.ARMSP_ORMDE_TRQ_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_ormde_trq_std"]);
                        poleSup.ARMSP_ORMDE_TRQ_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_ormde_trq_msd"]);
                        poleSup.ARMSP_ORMDE_TRQ_SFV = StrToDouble(HttpContext.Current.Request.Form[sup + "armsp_ormde_trq_sfv"]);
                        poleSup.ARMSP_ORMDES_STS = HttpContext.Current.Request.Form[sup + "armsp_ormdes_sts"];
                        //腕臂底座
                        poleSup.ARMB_BLF_STS = HttpContext.Current.Request.Form[sup + "armb_blf_sts"];
                        poleSup.ARMBS = HttpContext.Current.Request.Form[sup + "armbs"];
                        poleSup.ARMB_CTP = HttpContext.Current.Request.Form[sup + "armb_ctp"];
                        //腕臂支撑
                        poleSup.ARMSP_BLF_STS = HttpContext.Current.Request.Form[sup + "armsp_blf_sts"];
                        poleSup.ARMSPS = HttpContext.Current.Request.Form[sup + "armsps"];
                        poleSup.ARMSPS_CTP = HttpContext.Current.Request.Form[sup + "armsps_ctp"];
                        //套管铰环
                        poleSup.TRC_BLF_STS = HttpContext.Current.Request.Form[sup + "trc_blf_sts"];
                        poleSup.TRCS = HttpContext.Current.Request.Form[sup + "trcs"];
                        poleSup.TRC_CTP = HttpContext.Current.Request.Form[sup + "trc_ctp"];
                        //套管双耳
                        poleSup.TRCDE_BLF_STS = HttpContext.Current.Request.Form[sup + "trcde_blf_sts"];
                        poleSup.TRCDES = HttpContext.Current.Request.Form[sup + "trcdes"];
                        poleSup.TRCDE_CTP = HttpContext.Current.Request.Form[sup + "trcde_ctp"];
                        //腕臂本体（含隧道弓型腕臂）
                        poleSup.ARMS_BLF_STS = HttpContext.Current.Request.Form[sup + "arms_blf_sts"];
                        poleSup.ARMS = HttpContext.Current.Request.Form[sup + "arms"];
                        //连接器
                        poleSup.CNT_CTP = HttpContext.Current.Request.Form[sup + "cnt_ctp"];
                        poleSup.CTNS = HttpContext.Current.Request.Form[sup + "ctns"];
                        //有无管帽
                        poleSup.HAS_CAP_STD = StrToDouble(HttpContext.Current.Request.Form[sup + "has_cap_std"]);
                        poleSup.HAS_CAP_MSD = StrToDouble(HttpContext.Current.Request.Form[sup + "has_cap_msd"]);
                        //其他特殊腕臂型式 
                        poleSup.OTH_ARM_MDL = HttpContext.Current.Request.Form[sup + "oth_arm_mdl"];
                        try
                        {
                            rsSup = bllPoleSup.Add(poleSup) ? "2" : "-2";//支持装置添加方法
                        }
                        catch (Exception)
                        {
                            rsSup = "-2";
                        }
                    }
                    #endregion

                    #region 支柱添加界面-定位装置
                    string loc = "";
                    for (int i = 0; i <= locNum; i++)
                    {
                        if (i > 0)
                            loc = "new_location-" + i + "-";
                        poleLoc.POLE_CODE = polecode;
                        poleLoc.LCT_NO = HttpContext.Current.Request.Form[loc + "lct_no"];//编号
                        poleLoc.LCTDMT = StrToDouble(HttpContext.Current.Request.Form[loc + "lctdmt"]);//定位管_直径(mm)
                        poleLoc.LCTTLEN_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "lcttlen_std"]);//
                        poleLoc.LCTTLEN_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "lcttlen_msd"]);//
                        poleLoc.LCTTLEN_SFV = StrToDouble(HttpContext.Current.Request.Form[loc + "lcttlen_sfv"]);//
                        poleLoc.LSPLEN_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "lsplen_std"]);//
                        poleLoc.LSPLEN_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "lsplen_msd"]);//
                        poleLoc.LSPLEN_SFV = StrToDouble(HttpContext.Current.Request.Form[loc + "lsplen_sfv"]);//
                        poleLoc.LCTLEN_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "lctlen_std"]);//
                        poleLoc.LCTLEN_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "lctlen_msd"]);//
                        poleLoc.LCTLEN_SFV = StrToDouble(HttpContext.Current.Request.Form[loc + "lctlen_sfv"]);//
                        poleLoc.LCTCLRC_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "lctclrc_std"]);//
                        poleLoc.LCTCLRC_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "lctclrc_msd"]);//
                        poleLoc.LCTCLRC_SFV = StrToDouble(HttpContext.Current.Request.Form[loc + "lctclrc_sfv"]);//
                        poleLoc.WDPCBLLEN_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "wdpcbllen_std"]);//
                        poleLoc.WDPCBLLEN_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "wdpcbllen_msd"]);//
                        poleLoc.WDPCBL_DMT = StrToDouble(HttpContext.Current.Request.Form[loc + "wdpcbl_dmt"]);//
                        poleLoc.LCTTWHARM = HttpContext.Current.Request.Form[loc + "lcttwharm"];//
                        poleLoc.LCTRW = StrToDouble(HttpContext.Current.Request.Form[loc + "lctrw"]);//
                        poleLoc.LCTTWORM = StrToDouble(HttpContext.Current.Request.Form[loc + "lcttworm"]);//
                        poleLoc.LCTWLCTT = StrToDouble(HttpContext.Current.Request.Form[loc + "lctwlctt"]);//
                        poleLoc.LCTUW = StrToDouble(HttpContext.Current.Request.Form[loc + "lctuw"]);//
                        poleLoc.LCT_TP = HttpContext.Current.Request.Form[loc + "lct_tp"];//
                        poleLoc.LCT_MDL = HttpContext.Current.Request.Form[loc + "lct_mdl"];//
                        poleLoc.LCT_SLP = StrToDouble(HttpContext.Current.Request.Form[loc + "lct_slp"]);
                        poleLoc.LCTRMMT_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "lctrmmt_std"]);//
                        poleLoc.LCTRMMT_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "lctrmmt_msd"]);//
                        poleLoc.LCTRS_STS = HttpContext.Current.Request.Form[loc + "lctrs_sts"];//
                        poleLoc.LCTR_LSP_CMP = HttpContext.Current.Request.Form[loc + "lctr_lsp_cmp"];//
                        poleLoc.LCTR_POP_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "lctr_pop_std"]);//
                        poleLoc.LCTR_POP_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "lctr_pop_msd"]);//
                        poleLoc.LCTR_POP_SFV = StrToDouble(HttpContext.Current.Request.Form[loc + "lctr_pop_sfv"]);//
                        poleLoc.LCTTDETWMMT_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "lcttdetwmmt_std"]);//
                        poleLoc.LCTTDETWMMT_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "lcttdetwmmt_msd"]);//
                        poleLoc.LCTTDESPTNT_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "lcttdesptnt_std"]);//
                        poleLoc.LCTTDESPTNT_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "lcttdesptnt_msd"]);//
                        poleLoc.LCTTDES_STS = HttpContext.Current.Request.Form[loc + "lcttdes_sts"];//
                        poleLoc.LCTTDE_LSSTS = HttpContext.Current.Request.Form[loc + "lcttde_lssts"];//
                        poleLoc.LCTSPMMT_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "lctspmmt_std"]);//
                        poleLoc.LCTSPMMT_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "lctspmmt_msd"]);//
                        poleLoc.LCTSPS_STS = HttpContext.Current.Request.Form[loc + "lctsps_sts"];//
                        poleLoc.CNWMMT_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "cnwmmt_std"]);//
                        poleLoc.CNWMMT_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "cnwmmt_msd"]);//
                        poleLoc.CNWS_STS = HttpContext.Current.Request.Form[loc + "cnws_sts"];//
                        poleLoc.LCTS_STS = HttpContext.Current.Request.Form[loc + "lcts_sts"];//
                        poleLoc.WDPC_STS = HttpContext.Current.Request.Form[loc + "wdpc_sts"];//
                        poleLoc.LCTCLMPMMT_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "lctclmpmmt_std"]);//
                        poleLoc.LCTCLMPMMT_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "lctclmpmmt_msd"]);//
                        poleLoc.LCTCLMPS_STS = HttpContext.Current.Request.Form[loc + "lctclmps_sts"];//
                        poleLoc.LSDEOR_TW_MMT_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "lsdeor_tw_mmt_msd"]);//
                        poleLoc.LSDEOR_TW_MMT_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "lsdeor_tw_mmt_std"]);//
                        poleLoc.LSDEOR_SPNT_MMT_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "lsdeor_spnt_mmt_msd"]);//
                        poleLoc.LSDEOR_SPNT_MMT_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "lsdeor_spnt_mmt_std"]);//
                        poleLoc.LSDEORS_STS = HttpContext.Current.Request.Form[loc + "lsdeors_sts"];//
                        poleLoc.LSDELTC_TW_MMT_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "lsdeltc_tw_mmt_msd"]);//
                        poleLoc.LSDELTC_TW_MMT_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "lsdeltc_tw_mmt_std"]);//
                        poleLoc.LSDELTC_SPNT_MMT_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "lsdeltc_spnt_mmt_msd"]);//
                        poleLoc.LSDELTC_SPNT_MMT_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "lsdeltc_spnt_mmt_std"]);//
                        poleLoc.LSDELTCS_STS = HttpContext.Current.Request.Form[loc + "lsdeltcs_sts"];//
                        poleLoc.BSHSEORM_MMT_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "bshseorm_mmt_std"]);
                        poleLoc.BSHSEORM_MMT_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "bshseorm_mmt_msd"]);
                        poleLoc.BSHSEORMS_STS = HttpContext.Current.Request.Form[loc + "bshseorms_sts"];
                        poleLoc.BSHSELTC_MMT_STD = StrToDouble(HttpContext.Current.Request.Form[loc + "bshseltc_mmt_std"]);
                        poleLoc.BSHSELTC_MMT_MSD = StrToDouble(HttpContext.Current.Request.Form[loc + "bshseltc_mmt_msd"]);
                        poleLoc.BSHSELTCS_STS = HttpContext.Current.Request.Form[loc + "bshseltcs_sts"];
                        poleLoc.LCTNT_STS = HttpContext.Current.Request.Form[loc + "lctnt_sts"];
                        poleLoc.SPSB = HttpContext.Current.Request.Form[loc + "spsb"];
                        poleLoc.SPOP = HttpContext.Current.Request.Form[loc + "spop"];
                        poleLoc.LCTCLMP_STS = HttpContext.Current.Request.Form[loc + "lctclmp_sts"];
                        poleLoc.LCTCLMPSB = HttpContext.Current.Request.Form[loc + "lctclmpsb"];
                        poleLoc.LCTBLT_STS = HttpContext.Current.Request.Form[loc + "lctblt_sts"];
                        poleLoc.LCTSB = HttpContext.Current.Request.Form[loc + "lctsb"];
                        poleLoc.LCTOP = HttpContext.Current.Request.Form[loc + "lctop"];
                        poleLoc.LCTT_STS = HttpContext.Current.Request.Form[loc + "lctt_sts"];
                        poleLoc.LCTTSB = HttpContext.Current.Request.Form[loc + "lcttsb"];
                        poleLoc.LCTRB_STS = HttpContext.Current.Request.Form[loc + "lctrb_sts"];
                        poleLoc.LCTRSB = HttpContext.Current.Request.Form[loc + "lctrsb"];
                        poleLoc.LCTSPB_STS = HttpContext.Current.Request.Form[loc + "lctspb_sts"];
                        poleLoc.LCTSPSB = HttpContext.Current.Request.Form[loc + "lctspsb"];
                        try
                        {
                            rsLoc = bllPoleLoc.Add(poleLoc) ? "3" : "-3";//定位装置添加方法
                        }
                        catch (Exception)
                        {
                            rsLoc = "-3";
                        }
                    }
                    #endregion
                }
                else
                {
                    Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "支柱管理", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "支柱管理添加了新的信息" + pole.POLE_CODE, "", false);
                }
            }
            catch
            {
                rs = "-1";
            }
            finally
            {
                //返回执行结果
                StringBuilder sb = new StringBuilder();
                sb.AppendFormat("{{\"POLE_RESULT\":\"{0}\",\"POLE_SPTD_RESULT\":\"{1}\",\"POLE_LOCATOR\":\"{2}\",\"POLE_EXIST\":\"{3}\"}}", rs, rsSup, rsLoc, rs_exist);
                string js = sb.ToString();
                HttpContext.Current.Response.Write(js);
            }
        }
    }

    /// <summary>
    /// 获取支柱列表
    /// </summary>
    private void GetAll()
    {
        //获取前台页码
        int pageIndex = Convert.ToInt32(HttpContext.Current.Request["page"]);
        //获取前台条数
        int pageSize = Convert.ToInt32(HttpContext.Current.Request["rp"]);
        //Api.Foundation.entity.Cond.PoleCond cond = new Api.Foundation.entity.Cond.PoleCond();

        StringBuilder strWhere = new StringBuilder("");
        if (!string.IsNullOrEmpty(HttpContext.Current.Request["POLENO"]) && HttpContext.Current.Request["POLENO"] != "undefined")
        {
            string CondPOLE_NO = HttpContext.Current.Request["POLENO"];
            strWhere.AppendFormat("AND POLE_NO = '{0}' ", CondPOLE_NO);// 查询条件的WHERE子句
        }
        if (!string.IsNullOrEmpty(HttpContext.Current.Request["START_KM"]))
        {
            int CondstartKm = Convert.ToInt32(HttpContext.Current.Request["START_KM"]);
            strWhere.AppendFormat("AND KMSTANDARD >= {0} ", CondstartKm);
        }
        if (!string.IsNullOrEmpty(HttpContext.Current.Request["END_KM"]))
        {
            int CondendKm = Convert.ToInt32(HttpContext.Current.Request["END_KM"]);
            strWhere.AppendFormat("AND KMSTANDARD <= {0} ", CondendKm);
        }
        if (!string.IsNullOrEmpty(HttpContext.Current.Request["LINE_CODE"]) && HttpContext.Current.Request["LINE_CODE"] != "0" && HttpContext.Current.Request["LINE_CODE"] != "undefined")
        {
            string CondLINE_CODE = HttpContext.Current.Request["LINE_CODE"];
            strWhere.AppendFormat("AND LINE_CODE = '{0}' ", CondLINE_CODE);
        }
        if (!string.IsNullOrEmpty(HttpContext.Current.Request["POSITION_CODE"]) && HttpContext.Current.Request["POSITION_CODE"] != "0" && HttpContext.Current.Request["POSITION_CODE"] != "undefined")
        {
            string CondPOSITION_CODE = myfiter.Filter_Script(HttpContext.Current.Request["POSITION_CODE"]);
            strWhere.AppendFormat("AND POSITION_CODE = '{0}' ", CondPOSITION_CODE);
        }
        if (HttpContext.Current.Request["BRIDGE_CODE"] != null && HttpContext.Current.Request["BRIDGE_CODE"] != "0" && HttpContext.Current.Request["BRIDGE_CODE"] != "undefined")
        {
            string condBRG_TUN_CODE = HttpContext.Current.Request["BRIDGE_CODE"];
            strWhere.AppendFormat("AND BRG_TUN_CODE = '{0}' ", condBRG_TUN_CODE);
        }
        if (HttpContext.Current.Request["BUREAU_CODE"] != null && HttpContext.Current.Request["BUREAU_CODE"] != "0" && HttpContext.Current.Request["BUREAU_CODE"] != "undefined")
        {
            string condBUREAU_CODE = HttpContext.Current.Request["BUREAU_CODE"];
            strWhere.AppendFormat("AND BUREAU_CODE = '{0}' ", condBUREAU_CODE);
        }
        if (HttpContext.Current.Request["POWER_SECTION_CODE"] != null && HttpContext.Current.Request["POWER_SECTION_CODE"] != "0" && HttpContext.Current.Request["POWER_SECTION_CODE"] != "undefined")
        {
            string condPOWER_SECTION_CODE = HttpContext.Current.Request["POWER_SECTION_CODE"];
            strWhere.AppendFormat("AND POWER_SECTION_CODE = '{0}' ", condPOWER_SECTION_CODE);
        }
        if (HttpContext.Current.Request["WORKSHOP_CODE"] != null && HttpContext.Current.Request["WORKSHOP_CODE"] != "0" && HttpContext.Current.Request["WORKSHOP_CODE"] != "undefined")
        {
            string condWORKSHOP_CODE = HttpContext.Current.Request["WORKSHOP_CODE"];
            strWhere.AppendFormat("AND WORKSHOP_CODE = '{0}' ", condWORKSHOP_CODE);
        }
        if (HttpContext.Current.Request["WORKAREA_CODE"] != null && HttpContext.Current.Request["WORKAREA_CODE"] != "0" && HttpContext.Current.Request["WORKAREA_CODE"] != "undefined")
        {
            string condORG_CODE = HttpContext.Current.Request["WORKAREA_CODE"];
            strWhere.AppendFormat("AND ORG_CODE = '{0}' ", condORG_CODE);
        }
        if (HttpContext.Current.Request["CODE"] != null && HttpContext.Current.Request["CODE"] != "undefined" && HttpContext.Current.Request["CODE"] != "")
        {
            string CondPOSITION_CODE, CondLINE_CODE, CondBRG_TUN_CODE;
            if (HttpContext.Current.Request["TREETYPE"] == "POSITION")
            {
                CondPOSITION_CODE = HttpContext.Current.Request["CODE"];
                strWhere.AppendFormat("AND POSITION_CODE = '{0}' ", CondPOSITION_CODE);
            }
            else if (HttpContext.Current.Request["TREETYPE"] == "LINE")
            {
                CondLINE_CODE = HttpContext.Current.Request["CODE"];
                strWhere.AppendFormat("AND LINE_CODE = '{0}' ", CondLINE_CODE);
            }
            else if (HttpContext.Current.Request["TREETYPE"] == "BRIDGETUNE")
            {
                CondBRG_TUN_CODE = HttpContext.Current.Request["CODE"];
                strWhere.AppendFormat("AND BRG_TUN_CODE = '{0}' ", CondBRG_TUN_CODE);
            }
        }
        if (!string.IsNullOrEmpty(HttpContext.Current.Request["XB"]) && HttpContext.Current.Request["XB"] != "0")
        {
            string CondPOLE_DIRECTION = HttpContext.Current.Request["XB"];
            strWhere.AppendFormat("AND POLE_DIRECTION = '{0}' ", CondPOLE_DIRECTION);
        }

        string orderby = "POLE_ORDER";

        //条件
        ADO.BLL.MIS_POLE bllPole = new ADO.BLL.MIS_POLE();
        int startRowNum, endRowNum;
        if ((pageIndex != 0) && (pageSize != 0))// 计算翻页的起始与结束行号
        {
            {
                startRowNum = (pageIndex - 1) * pageSize + 1;
                endRowNum = startRowNum + pageSize - 1;

                System.Data.DataSet ds = bllPole.GetListByPage(strWhere.ToString(), orderby, startRowNum, endRowNum);
                List<ADO.Model.MIS_POLE> list = bllPole.DataTableToList(ds.Tables[0]);
                //获取总条数
                int recordCount = bllPole.GetRecordCount(strWhere.ToString());

                StringBuilder sb = new StringBuilder();
                sb.Append("{\"rows\":[");

                foreach (ADO.Model.MIS_POLE p in list)
                {
                    string km = PublicMethod.KmtoString(Convert.ToInt32(p.KMSTANDARD));
                    sb.AppendFormat("{{\"POLE_CODE\":\"{0}\",\"POLE_NO\":\"{1}\",\"LINE_NAME\":\"{2}\", \"POSITION_NAME\":\"{3}\",\"BRG_TUN_NAME\":\"{4}\", \"WORKSHOP_NAME\":\"{5}\",\"POLE_TYPE\":\"{6}\",\"POLE_DIRECTION\":\"{7}\",\"KMSTANDARD\":\"{8}\",\"ID\":\"{9}\",\"KMSTANDARD_K\":\"{10}\"}},",
                                    p.POLE_CODE, p.POLE_NO, p.LINE_NAME, p.POSITION_NAME, p.BRG_TUN_NAME, p.ORG_NAME, p.POLE_TYPE, p.POLE_DIRECTION, p.KMSTANDARD, p.ID, km);
                }
                string js = sb.ToString();
                if (js.LastIndexOf(',') > -1)
                {
                    js = js.Substring(0, js.LastIndexOf(','));
                }
                js += String.Format("],\"page\":{0},\"rp\":{1},\"total\":{2}}}", pageIndex, pageSize, recordCount);
                HttpContext.Current.Response.Write(js);
            }
        }
    }

    /// <summary>
    /// 添加功能支柱号即时验证
    /// </summary>
    private string Exist(string verifyType)
    {
        string rs = "-1";
        ADO.BLL.MIS_POLE bllPole = new ADO.BLL.MIS_POLE();
        string sql = "SELECT COUNT(1) FROM MIS_POLE WHERE 1=1";
        string LINE_CODE = HttpContext.Current.Request["line_code"];
        string POLE_DIRECTION = HttpContext.Current.Request["pole_direction"];
        string POSITION_CODE = HttpContext.Current.Request["position_code"];
        string BRG_TUN_CODE = HttpContext.Current.Request["brg_tun_code"];
        string POLE_NO = HttpContext.Current.Request["pole_no"];
        string KMSTANDARD = HttpContext.Current.Request["kmstandard"];
        if (!string.IsNullOrEmpty(LINE_CODE))
            sql += " AND LINE_CODE = '" + LINE_CODE + "'";
        if (!string.IsNullOrEmpty(POLE_DIRECTION))
            sql += " AND POLE_DIRECTION = '" + POLE_DIRECTION + "'";
        if (!string.IsNullOrEmpty(POSITION_CODE))
            sql += " AND POSITION_CODE = '" + POSITION_CODE + "'";
        if (!string.IsNullOrEmpty(BRG_TUN_CODE))
            sql += " AND BRG_TUN_CODE = '" + BRG_TUN_CODE + "'";
        if (!string.IsNullOrEmpty(POLE_NO))
            sql += " AND POLE_NO = '" + POLE_NO + "'";
        if (!string.IsNullOrEmpty(KMSTANDARD))
            sql += " AND KMSTANDARD = '" + KMSTANDARD + "'";
        if (!(string.IsNullOrEmpty(LINE_CODE) && string.IsNullOrEmpty(POLE_DIRECTION) && string.IsNullOrEmpty(POSITION_CODE) && string.IsNullOrEmpty(POLE_NO) && string.IsNullOrEmpty(BRG_TUN_CODE) && string.IsNullOrEmpty(KMSTANDARD)))
            rs = DbHelperOra_ADO.Exists(sql) ? "1" : "-1";

        StringBuilder sb = new StringBuilder();

        sb.AppendFormat("{{\"POLE_EXIST\":\"{0}\"}}", rs);
        string js = sb.ToString();
        if (verifyType == "context")
        {
            HttpContext.Current.Response.Write(js);
        }
        return rs;
    }
    /// <summary>
    /// 修改功能支柱号即时验证
    /// </summary>
    /// <param name="verifyType"></param>
    /// <returns></returns>
    private string Exist_update(string verifyType)
    {
        string rs = "-1";
        string id = HttpContext.Current.Request["id"];
        ADO.BLL.MIS_POLE bllPole = new ADO.BLL.MIS_POLE();
        ADO.Model.MIS_POLE pole = bllPole.GetModel(id);//通过id来获取pole实体
        string LINE_CODE = HttpContext.Current.Request["line_code"];
        string POLE_DIRECTION = HttpContext.Current.Request["pole_direction"];
        string POSITION_CODE = HttpContext.Current.Request["position_code"];
        string BRG_TUN_CODE = HttpContext.Current.Request["brg_tun_code"];
        string POLE_NO = HttpContext.Current.Request["pole_no"];
        string KMSTANDARD = HttpContext.Current.Request["kmstandard"];
        if (pole.LINE_CODE == LINE_CODE && pole.POLE_DIRECTION == POLE_DIRECTION && pole.POSITION_CODE == POSITION_CODE && pole.BRG_TUN_CODE == BRG_TUN_CODE && pole.POLE_NO == POLE_NO)//修改时没有改支柱位置
        {
        }
        else
        {
            string sql = "SELECT COUNT(1) FROM MIS_POLE WHERE 1=1";
            if (!string.IsNullOrEmpty(LINE_CODE))
                sql += " AND LINE_CODE = '" + LINE_CODE + "'";
            if (!string.IsNullOrEmpty(POLE_DIRECTION))
                sql += " AND POLE_DIRECTION = '" + POLE_DIRECTION + "'";
            if (!string.IsNullOrEmpty(POSITION_CODE))
                sql += " AND POSITION_CODE = '" + POSITION_CODE + "'";
            if (!string.IsNullOrEmpty(BRG_TUN_CODE))
                sql += " AND BRG_TUN_CODE = '" + BRG_TUN_CODE + "'";
            if (!string.IsNullOrEmpty(POLE_NO))
                sql += " AND POLE_NO = '" + POLE_NO + "'";
            if (!string.IsNullOrEmpty(KMSTANDARD))
                sql += " AND KMSTANDARD = '" + KMSTANDARD + "'";
            if (!(string.IsNullOrEmpty(LINE_CODE) && string.IsNullOrEmpty(POLE_DIRECTION) && string.IsNullOrEmpty(POSITION_CODE) && string.IsNullOrEmpty(POLE_NO) && string.IsNullOrEmpty(BRG_TUN_CODE) && string.IsNullOrEmpty(KMSTANDARD)))
                rs = DbHelperOra_ADO.Exists(sql) ? "1" : "-1";
        }
        StringBuilder sb = new StringBuilder();

        sb.AppendFormat("{{\"POLE_EXIST\":\"{0}\"}}", rs);
        string js = sb.ToString();
        if (verifyType == "context")
        {
            HttpContext.Current.Response.Write(js);
        }
        return rs;
    }
    /// <summary>
    /// 入库DOUBLE型数据前判空，-1表示无数据
    /// </summary>
    /// <param name="str"></param>
    /// <returns></returns>
    public Double StrToDouble(string str)
    {
        Double dou = -1;
        if (!string.IsNullOrEmpty(str))
            dou = Convert.ToDouble(str);
        return dou;
    }
    /// <summary>
    /// double型值为-1时，详情页显示为空
    /// </summary>
    /// <param name="dou"></param>
    /// <returns></returns>
    public string DoubleToString(object obj)
    {
        string str = "";
        if (obj.ToString() != "-1" && obj.ToString() != null)
            str = obj.ToString();
        return str;

    }


    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}