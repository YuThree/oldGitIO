<%@ WebHandler Language="C#" Class="GetMonitorLocoAlarmList" %>

using System;
using System.Web;
using System.IO;
using System.Data;
using System.Collections.Generic;
using Api.Fault.entity.alarm;
using Api.Foundation.entity.Cond;
using Api.Foundation.entity.Foundation;
using System.Configuration;

/// <summary>
/// 报警分析日志列表
/// </summary>
public class GetMonitorLocoAlarmList : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        try
        {
            //生成报警列表条件
            C3_AlarmCond alarmCond = CreateWhere();

            //报警列表
            List<C3_Alarm> alarmList = Api.ServiceAccessor.GetAlarmService().getC3Alarm(alarmCond);

            //获取总条数
            int recordCount = Api.ServiceAccessor.GetAlarmService().getAlarmCount(alarmCond);

            //生成json
            string json = CreateJSON(alarmList, recordCount);

            HttpContext.Current.Response.Write(json);


        }
        catch (Exception ex)
        {
            log4net.ILog log2 = log4net.LogManager.GetLogger("报警分析日志列表");
            log2.Error("Error", ex);
        }

    }


    public string CreateJSON(List<C3_Alarm> alarmList, int recordCount)
    {

        int pageIndex = Convert.ToInt32(HttpContext.Current.Request["page"]); //获取前台页码
        int pageSize = Convert.ToInt32(HttpContext.Current.Request["rp"]);//获取前台条数
        string sore = HttpContext.Current.Request["sore"];//source

        string wz = "";
        string status;
        string font1 = "";//行字体颜色开头
        string font2 = "";//行字体颜色结尾  
        string url;
        string IRV;
        string GIS;

        System.Text.StringBuilder jsonStr = new System.Text.StringBuilder();
        jsonStr.Append("{'rows':[");
        //  string jsonStr = "{'rows':[";
        for (int i = 0; i < alarmList.Count; i++)
        {
            if(i>0)
                jsonStr.Append(",");

            if (sore != "GS")
            {
                url = "<a  href=javascript:selectInfo(C" + alarmList[i].ID + ")>处理</a>";
                IRV = "<a href=javascript:IRVXZ(C" + alarmList[i].ID + ")>视频下载</a>";
            }
            else
            {
                url = "<a  href=javascript:UpdateInfo(C" + alarmList[i].ID + ")>修改</a>&nbsp;<a  href=javascript:selectInfo(C" + alarmList[i].ID + ")>处理</a>";
                //   c3 = Api.ServiceAccessor.GetAlarmService().getC3Alarm(alarmList[i].ID);
                if (alarmList[i].RAISE_FILE_IR == null || alarmList[i].RAISE_FILE_IR == "")
                {
                    IRV = "";
                }
                else
                {
                    IRV = "<a href=javascript:IRVXZ(C" + alarmList[i].ID + ")>视频下载</a>";
                }
            }

            GIS = "<a href=javascript:ShowGis(C" + alarmList[i].ID + ")>东经:" + alarmList[i].GIS_X.ToString("f2") + " 北纬:" + alarmList[i].GIS_Y.ToString("f2") + "</a>";
            status = alarmList[i].STATUS_NAME; //状态
            if (status == "新上报")
            {
                //status = "<font color=red>" + status + "</font>";
                font1 = "<font>";
                font2 = "</font>";
            }
            else if (status == "已确认" || status == "新缺陷")
            {
                font1 = "<font color=red>";
                font2 = "</font>";
            }
            else if (status == "已取消")
            {
                font1 = "<font color=green>";
                font2 = "</font>";
            }

            wz = PublicMethod.GetPositionByC3_Alarm(alarmList[i]);
            jsonStr.Append( "{'LOCOMOTIVE_CODE':'" + font1 + alarmList[i].DETECT_DEVICE_CODE + font2 + "',");//车号
            jsonStr.Append( "'XL':'" + font1 + alarmList[i].LINE_NAME + font2 + "',");//线路
            jsonStr.Append( "'STATION':'" + font1 + alarmList[i].POSITION_NAME + font2 + "',");//车站名
            jsonStr.Append( "'JL':'" + font1 + alarmList[i].ROUTING_NO + font2 + "',");//交路
            jsonStr.Append( "'QD':'" + font1 + alarmList[i].AREA_NO + font2 + "',");//运用区段
            string FXStatus = "";
            if (alarmList[i].STATUS == "AFSTATUS01" || alarmList[i].STATUS_TIME.ToString() == "" || alarmList[i].STATUS_TIME.ToString() == "0001-1-1 00:00:00" || alarmList[i].STATUS_TIME.ToString() == "0001/1/1 0:00:00")
            {
                FXStatus = "<font color=#33CC33>未分析</font>";
                font1 = "<font color=#33CC33> ";
                font2 = "</font>";
            }
            else if (alarmList[i].DVALUE3.ToString() == "" || alarmList[i].DVALUE3.ToString() == "0001-1-1 00:00:00" || alarmList[i].DVALUE3.ToString() == "0001/1/1 0:00:00" && alarmList[i].STATUS_TIME.ToString() != "")
            {
                FXStatus = "<font color=#FF3366>部分分析</font>";
                font1 = "<font color=#FF3366> ";
                font2 = "</font>";
            }
            else if (alarmList[i].DVALUE3.ToString() != "" && alarmList[i].DVALUE3.ToString() != "0001-1-1 00:00:00" && alarmList[i].DVALUE3.ToString() != "0001/1/1 0:00:00" && alarmList[i].STATUS_TIME > alarmList[i].DVALUE3)
            {
                FXStatus = "完整分析";

                font1 = "<font> ";
                font2 = "</font>";
            }
            else
            {
                FXStatus = "部分分析";
                font1 = "<font color=#FF3366> ";
                font2 = "</font>";
            }


            jsonStr.Append( "'KM':'" + font1 + PublicMethod.KmtoString(alarmList[i].KM_MARK) + font2 + "',");//KM
            jsonStr.Append( "'GIS':'" + GIS + "',");//KM
            jsonStr.Append( "'GISX':'" + alarmList[i].GIS_X + "',");//KM
            jsonStr.Append( "'GISY':'" + alarmList[i].GIS_Y + "',");//KM
            jsonStr.Append( "'GWZ':'" + font1 + alarmList[i].BOW_TYPE + font2 + "',");//弓位置
            jsonStr.Append( "'SD':'" + font1 + alarmList[i].SPEED + "km/h" + font2 + "',");//速度
            jsonStr.Append( "'DVALUE1':'" + font1 + DvalueDateTime(alarmList[i].DVALUE1) + font2 + "',");//收到FaultI文件时间
            jsonStr.Append( "'DVALUE2':'" + font1 + DvalueDateTime(alarmList[i].IRV_RECV_TIME) + font2 + "',");//收到红外视频时间
            jsonStr.Append( "'DVALUE3':'" + font1 + DvalueDateTime(alarmList[i].DVALUE3) + font2 + "',");//收到可见光视频时间
            jsonStr.Append( "'DVALUE4':'" + font1 + DvalueDateTime(alarmList[i].DVALUE4) + font2 + "',");//收到全景I视频时间
            jsonStr.Append( "'DVALUE5':'" + font1 + DvalueDateTime(alarmList[i].DVALUE5) + font2 + "',");//收到全景II视频时间
            jsonStr.Append( "'STATUS_TIME':'" + font1 + DvalueDateTime(alarmList[i].STATUS_TIME) + font2 + "',");//分析时间
            jsonStr.Append( "'CHULIZT':'" + font1 + FXStatus + font2 + "',");//分析状态
            jsonStr.Append( "'WD':'" + font1 + myfiter.GetTEMP_MAX(alarmList[i]) + font2 + "',");//红外温度
            jsonStr.Append( "'HJWD':'" + font1 + myfiter.GetTEMP_ENV(alarmList[i]) + font2 + "',");//环境温度
            jsonStr.Append( "'DGZ':'" + font1 + myfiter.GetLINE_HEIGHT(alarmList[i]) + "',");//导高
            jsonStr.Append( "'LCZ':'" + font1 + myfiter.GetPULLING_VALUE(alarmList[i]) + "',");//拉出值
            jsonStr.Append( "'JB':'" + font1 + alarmList[i].SEVERITY + font2 + "',");//级别
            jsonStr.Append( "'WZ':'" + font1 + wz + font2 + "',");//位置信息
            jsonStr.Append( "'QXZT':'" + font1 + alarmList[i].CODE_NAME + font2 + "',");//缺陷状态
            jsonStr.Append( "'ZT':'" + font1 + alarmList[i].STATUS_NAME + font2 + "',");//状态
            jsonStr.Append( "'NOWDATE':'" + font1 + alarmList[i].RAISED_TIME.ToString("yyyy-MM-dd HH:mm:ss") + font2 + "',");//发生时间
            jsonStr.Append( "'CZ':'" + url + "',");//操作
            jsonStr.Append( "'XZ':'" + IRV + "',");
            jsonStr.Append( "'ID':'C" + alarmList[i].ID + "'");
            jsonStr.Append( " }");
        }

        jsonStr.Append( "],'page':'" + pageIndex + "','rp':'" + pageSize + "','total':'" + recordCount + "'}");

        return myfiter.json_RemoveSpecialStr(jsonStr.ToString());
    }


    public C3_AlarmCond CreateWhere()
    {
        int pageIndex = Convert.ToInt32(HttpContext.Current.Request["page"]); //获取前台页码
        int pageSize = Convert.ToInt32(HttpContext.Current.Request["rp"]);//获取前台条数
        string jlh = HttpContext.Current.Request["jlh"];//交路号
        string loccode = HttpContext.Current.Request["locid"];//车号
        string startdate = HttpContext.Current.Request["startdate"];//开始时间
        string enddate = HttpContext.Current.Request["enddate"];//结束时间
        string ddlzt = HttpContext.Current.Request["ddlzt"];//报警状态
        string startkm = HttpContext.Current.Request["startkm"];//开始公里标
        string endkm = HttpContext.Current.Request["endkm"];//结束公里标
        string jb = HttpContext.Current.Request["jb"];//缺陷级别
        string ju = HttpContext.Current.Request["ju"]; //局
        string jwd = HttpContext.Current.Request["jwd"];//机务段
        string sore = HttpContext.Current.Request["sore"];//source
        string line = HttpContext.Current.Request["line"];//线路
        string afcode = HttpContext.Current.Request["afcode"];
        string zhuangtai = HttpContext.Current.Request["zhuangtai"];//缺陷类型
        string fxJG = HttpContext.Current.Request["fxJG"];

        LocomotiveCond locoCond = new LocomotiveCond();
        C3_AlarmCond alarmCond = new C3_AlarmCond();


        if (zhuangtai != null && zhuangtai != "")
        {
            //zhuangtai.Split(',').Length
            SysDictionaryCond syscond = new SysDictionaryCond();
            syscond.CODE_NAME = zhuangtai;
            IList<SysDictionary> syslist = Api.ServiceAccessor.GetFoundationService().querySysDictionary(syscond);
            if (syslist.Count > 0)
            {
                if (syslist[0].P_CODE != null && syslist[0].P_CODE != "")
                {
                    alarmCond.CODE = syslist[0].DIC_CODE;
                }
                else
                {
                    SysDictionaryCond syscond1 = new SysDictionaryCond();
                    syscond1.P_CODE = syslist[0].DIC_CODE;
                    IList<SysDictionary> syslist1 = Api.ServiceAccessor.GetFoundationService().querySysDictionary(syscond1);
                    if (syslist1.Count > 0)
                    {
                        string diccode = "";
                        for (int i = 0, count = syslist1.Count; i < count; i++)
                        {
                            diccode += syslist1[i].DIC_CODE + ",";
                        }
                        alarmCond.CODE = diccode;
                    }
                }
            }
        }


        if (line != null && line != "0")
        {
            alarmCond.LINE_CODE = line;
        }
        //if (ju != null && ju != "0")
        //{
        //    locoCond.BUREAU_CODE = ju;
        //    alarmCond.BUREAU_CODE = ju;
        //}
        if (jb != null && jb != "0" && jb != "")
        {
            alarmCond.SEVERITY = jb;
        }
        if (sore != null && sore != "0")
        {
            alarmCond.SOURCE = sore;
        }
        if (jwd != null && jwd != "0")
        {
            locoCond.P_ORG_CODE = jwd;
            alarmCond.P_ORG_CODE = jwd;
        }

        if (loccode != null && loccode != "")
        {
            alarmCond.DETECT_DEVICE_CODE = loccode;
            //  locoCond.LOCOMOTIVE_CODE = loccode;
        }

        //   IList<Locomotive> locoList = Api.ServiceAccessor.GetFoundationService().queryLocomotive(locoCond);

        //   if (locoList.Count > 0)
        //   {
        //    foreach (Locomotive loco in locoList)
        //    {
        //      alarmCond.DETECT_DEVICE_CODE += loco.LOCOMOTIVE_CODE + ",";
        //     }

        if (jlh != null && jlh != "")
        {
            alarmCond.ROUTING_NO = jlh;
        }

        if (ddlzt != null && ddlzt != "0" && ddlzt != "")
        {
            alarmCond.STATUS = ddlzt;
        }


        if (fxJG == "0" || fxJG == "")
        {
        }
        else if (fxJG == "1")
        {
            alarmCond.businssAnd = " status='AFSTATUS01' ";
        }
        else if (fxJG == "2")
        {
            alarmCond.businssAnd = " ((DVALUE3 is  null or to_char(alarm.DVALUE3) = '01-1月 -01' or STATUS_TIME <DVALUE3 ) and (  status !='AFSTATUS01'))";
        }
        else if (fxJG == "3")
        {
            alarmCond.businssAnd = " STATUS_TIME >DVALUE3 and DVALUE3 is not null and to_char(alarm.DVALUE3) != '01-1月 -01'";
        }


        if (ju != null && ju != "0")
        {
          
            if (!string.IsNullOrEmpty(alarmCond.businssAnd))
            {
                alarmCond.businssAnd += " and ";
            }
            alarmCond.businssAnd += " P_ORG_CODE like '" + ju + "%' ";


        }



        if (!string.IsNullOrEmpty(startkm))
        {
            alarmCond.startKm = int.Parse(startkm);
        }

        if (!string.IsNullOrEmpty(endkm))
        {
            alarmCond.endKm = int.Parse(endkm);
        }

        if (!string.IsNullOrEmpty(startdate))
        {
            alarmCond.startTime = DateTime.Parse(startdate);
        }

        if (!string.IsNullOrEmpty(enddate))
        {
            alarmCond.endTime = DateTime.Parse(enddate);
        }

        alarmCond.CATEGORY_CODE = "3C";
        alarmCond.orderBy = " RAISED_TIME desc";    //排序

        alarmCond.pageSize = pageSize;
        alarmCond.page = pageIndex;
        //   }


        return alarmCond;

    }

    public string DvalueDateTime(DateTime dt)
    {
        if (dt.ToString() == "0001-1-1 00:00:00" || dt.ToString() == "0001/1/1 0:00:00")
        {
            return "";
        }
        else
        {
            return dt.ToString();
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