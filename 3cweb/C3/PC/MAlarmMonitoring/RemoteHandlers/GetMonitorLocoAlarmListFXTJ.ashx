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

public class GetMonitorLocoAlarmList : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        //获取前台页码
        int pageIndex = Convert.ToInt32(HttpContext.Current.Request["page"]);
        //获取前台条数
        int pageSize = Convert.ToInt32(HttpContext.Current.Request["rp"]);
        //交路号
        string jlh = HttpContext.Current.Request["jlh"];
        //设备编号
        string loccode = HttpContext.Current.Request["locid"];
        string startdate = HttpContext.Current.Request["startdate"];
        string enddate = HttpContext.Current.Request["enddate"];
        //dropdownlist状态
        string ddlzt = HttpContext.Current.Request["ddlzt"];
        string startkm = HttpContext.Current.Request["startkm"];
        string endkm = HttpContext.Current.Request["endkm"];
        //级别
        string jb = HttpContext.Current.Request["jb"];
        //局
        string ju = HttpContext.Current.Request["ju"];
        //机务段
        string jwd = HttpContext.Current.Request["jwd"];
        //数据来源
        string sore = HttpContext.Current.Request["sore"];
        //线路编码
        string line = HttpContext.Current.Request["line"];
        //缺陷类型编码
        string afcode = HttpContext.Current.Request["afcode"];
        //状态
        string zhuangtai = HttpContext.Current.Request["zhuangtai"];
        //平均
        string pj = HttpContext.Current.Request["pj"];

        string fxJG = HttpContext.Current.Request["fxJG"];

        //红外延迟时间
        int IR_Delay = -1/*Convert.ToInt32(HttpContext.Current.Request["IR_Delay"]);*/;

        //可见光延迟时间
        int VI_Delay = -1/*Convert.ToInt32(HttpContext.Current.Request["VI_Delay"]);*/;

        //全景1延迟时间
        int OV_Delay_1 = -1/*Convert.ToInt32(HttpContext.Current.Request["OV_Delay_1"])*/;

        //全景2延迟时间
        int OV_Delay_2 = -1/*Convert.ToInt32(HttpContext.Current.Request["OV_Delay_2"])*/;

        //同步文件延迟时间
        int LOG_Delay = -1/*Convert.ToInt32(HttpContext.Current.Request["LOG_Delay"])*/;

        //分析时差
        int Analyse_Delay = -1/*Convert.ToInt32(HttpContext.Current.Request["Analyse_Delay"])*/;

        //好像没什么用locoCond
        LocomotiveCond locoCond = new LocomotiveCond();

        //数据查询方法的参数实体
        C3_AlarmCond alarmCond = new C3_AlarmCond();

        //取得的结果集列表
        List<C3_Alarm> alarmList = new List<C3_Alarm>();

        //符合条件的报警总数
        int recordCount = 0;
        //if (afcode != null && afcode != "0")
        //{
        //alarmCond.CODE = afcode;
        //}
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

        if (jb != null && jb != "0" && jb != "")
        {
            alarmCond.SEVERITY = jb;
        }
        if (sore != null && sore != "0")
        {
            alarmCond.SOURCE = sore;
        }

        //好像没什么用
        //bool isSeekLoca = false;



        if (jwd != null && jwd != "0")
        {
            locoCond.P_ORG_CODE = jwd;
            alarmCond.P_ORG_CODE = jwd;
            bool isSeekLoca = true;
        }

        if (loccode != null && loccode != "")
        {
            alarmCond.DETECT_DEVICE_CODE = loccode;
            //locoCond.LOCOMOTIVE_CODE = loccode;
            //isSeekLoca = true;
        }

        //if (isSeekLoca)
        //{
        //    IList<Locomotive> locoList = Api.ServiceAccessor.GetFoundationService().queryLocomotive(locoCond);

        //    if (locoList.Count > 0)
        //    {
        //        foreach (Locomotive loco in locoList)
        //        {
        //            alarmCond.DETECT_DEVICE_CODE += loco.LOCOMOTIVE_CODE + ",";
        //        }



        //    }
        //}


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
            //alarmCond.businssAnd = " STATUS_TIME is not null and to_char(alarm.STATUS_TIME) != '01-1月 -01' ";
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
            //locoCond.BUREAU_CODE = ju;
            //alarmCond.BUREAU_CODE = ju;
            //isSeekLoca = true;

            if (!string.IsNullOrEmpty(alarmCond.businssAnd))
            {
                alarmCond.businssAnd += " and ";
            }
            alarmCond.businssAnd += " P_ORG_CODE like '" + ju + "%' ";


        }

        //利用MY_STR_1字段，作为时差筛选条件的strwhere
        alarmCond.MY_STR_1 = "";

        //同步文件时差,空值传-1
        if (LOG_Delay >= 0)
        {
            alarmCond.MY_STR_1 += " AND NVALUE11 <=" + LOG_Delay;
            //alarmCond.NVALUE11 = LOG_Delay;
        }

        //红外延迟时间，空值传-1
        if (IR_Delay >= 0)
        {
            alarmCond.MY_STR_1 += " AND NVALUE12 <=" + IR_Delay;
            //alarmCond.NVALUE12 = IR_Delay;
        }

        //可见光延迟时间，空值传-1
        if (VI_Delay >= 0)
        {
            alarmCond.MY_STR_1 += " AND NVALUE13 <=" + VI_Delay;
            //alarmCond.NVALUE13 = VI_Delay;
        }

        //全景I延迟时间，空值传-1
        if (OV_Delay_1 >= 0)
        {
            alarmCond.MY_STR_1 += " AND NVALUE14 <=" + OV_Delay_1;
            //alarmCond.NVALUE14 = OV_Delay_1;
        }

        //全景II延迟时间，空值传-1
        if (OV_Delay_2 >= 0)
        {
            alarmCond.MY_STR_1 += " AND NVALUE15 <=" + OV_Delay_2;
            //alarmCond.NVALUE15 = OV_Delay_2;
        }

        //分析时差，空值传-1
        if (Analyse_Delay >= 0)
        {
            alarmCond.MY_STR_1 += " AND NVALUE16 <=" + Analyse_Delay;
            //alarmCond.NVALUE16 = Analyse_Delay;
        }



        try { alarmCond.startKm = int.Parse(startkm); }
        catch { }
        try { alarmCond.endKm = int.Parse(endkm); }
        catch { }
        try { alarmCond.startTime = DateTime.Parse(startdate); }
        catch { }
        try { alarmCond.endTime = DateTime.Parse(enddate); }
        catch { }

        alarmCond.CATEGORY_CODE = "3C";
        alarmCond.orderBy = " RAISED_TIME desc";    //排序

        //是否查看平均时差
        if (pj == "1")
        {
            //获取报警list
            string avg = Api.ServiceAccessor.GetAlarmService().getC3AlarmAvg(alarmCond);
            string[] arrayAvg = avg.Split(',');


            for (int i = 0; i < arrayAvg.Length; i++)
            {
                if (string.IsNullOrEmpty(arrayAvg[i]))
                {
                    arrayAvg[i] = "0";
                }

            }


            System.Text.StringBuilder Json = new System.Text.StringBuilder();
            Json.Append("[");
            Json.Append("{");
            Json.Append("FalutI:\"" + String.Format("{0:F}", Convert.ToDouble(arrayAvg[0])) + "\"");
            Json.Append(",");
            Json.Append("HW:\"" + String.Format("{0:F}", Convert.ToDouble(arrayAvg[1])) + "\"");
            Json.Append(",");
            Json.Append("KJJG:\"" + String.Format("{0:F}", Convert.ToDouble(arrayAvg[2])) + "\"");
            Json.Append(",");
            Json.Append("QJ1:\"" + String.Format("{0:F}", Convert.ToDouble(arrayAvg[3])) + "\"");
            Json.Append(",");
            Json.Append("QJ2:\"" + String.Format("{0:F}", Convert.ToDouble(arrayAvg[4])) + "\"");
            Json.Append(",");
            Json.Append("FX:\"" + String.Format("{0:F}", Convert.ToDouble(arrayAvg[5])) + "\"");
            Json.Append(",");
            Json.Append("ds1:\"" + String.Format("{0:F}", Convert.ToDouble(arrayAvg[6])) + "\"");
            Json.Append(",");
            Json.Append("ds2:\"" + String.Format("{0:F}", Convert.ToDouble(arrayAvg[7])) + "\"");
            Json.Append(",");
            Json.Append("ds3:\"" + String.Format("{0:F}", Convert.ToDouble(arrayAvg[8])) + "\"");
            Json.Append(",");
            Json.Append("ds4:\"" + String.Format("{0:F}", Convert.ToDouble(arrayAvg[9])) + "\"");
            Json.Append(",");
            Json.Append("ds5:\"" + String.Format("{0:F}", Convert.ToDouble(arrayAvg[10])) + "\"");
            Json.Append(",");
            Json.Append("ds6:\"" + String.Format("{0:F}", Convert.ToDouble(arrayAvg[11])) + "\"");
            Json.Append("}");
            Json.Append("]");
            object myObj = Newtonsoft.Json.JsonConvert.DeserializeObject(Json.ToString());
            context.Response.Write(myObj.ToString());

        }
        else
        {


            alarmCond.pageSize = pageSize;
            alarmCond.page = pageIndex;
            //获取报警list
            alarmList = Api.ServiceAccessor.GetAlarmService().getC3Alarm(alarmCond);
            //获取总条数
            recordCount = Api.ServiceAccessor.GetAlarmService().getAlarmCount(alarmCond);

            //cond没什么用
            //Api.Foundation.entity.Cond.PoleCond cond = new Api.Foundation.entity.Cond.PoleCond();

            //rel没什么用
            //RoutingStationRel rel = new RoutingStationRel();
            string wz = "";
            string status;
            string font1 = "";//行字体颜色开头
            string font2 = "";//行字体颜色结尾  
            string url;
            string IRV;
            string GIS;
            string jsonStr = "{'rows':[";
            for (int i = 0; i < alarmList.Count; i++)
            {

                if (sore != "GS")
                {
                    url = "<a  href=javascript:selectInfo(C" + alarmList[i].ID + ")>处理</a>";
                    IRV = "<a href=javascript:IRVXZ(C" + alarmList[i].ID + ")>视频下载</a>";
                }
                else
                {
                    url = "<a  href=javascript:UpdateInfo(C" + alarmList[i].ID + ")>修改</a>&nbsp;<a  href=javascript:selectInfo(C" + alarmList[i].ID + ")>处理</a>";
                    //  c3 = Api.ServiceAccessor.GetAlarmService().getC3Alarm(alarmList[i].ID);
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
                //wz = PublicMethod.GetPositionByC3_Alarm(alarmList[i]);
                wz = PublicMethod.GetPosition_Alarm(alarmList[i].LINE_NAME, alarmList[i].POSITION_NAME, alarmList[i].BRG_TUN_NAME, alarmList[i].DIRECTION, alarmList[i].KM_MARK, alarmList[i].POLE_NUMBER, alarmList[i].DEVICE_ID, alarmList[i].ROUTING_NO, alarmList[i].AREA_NO, alarmList[i].STATION_NO, alarmList[i].STATION_NAME, alarmList[i].TAX_MONITOR_STATUS);
                jsonStr += "{'LOCOMOTIVE_CODE':'" + font1 + alarmList[i].DETECT_DEVICE_CODE + font2 + "',";//车号


                jsonStr += "'XL':'" + font1 + alarmList[i].LINE_NAME + font2 + "',";//线路
                jsonStr += "'STATION':'" + font1 + alarmList[i].POSITION_NAME + font2 + "',";//车站名



                jsonStr += "'JL':'" + font1 + alarmList[i].ROUTING_NO + font2 + "',";//交路
                jsonStr += "'QD':'" + font1 + alarmList[i].AREA_NO + font2 + "',";//运用区段
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
                //string forGT = ConfigurationManager.AppSettings["ForGT"];
                //if (forGT == "1")
                //{
                //    jsonStr += "'STATION':'" + font1 + alarmList[i].MIS_POSITION.POSITION_NAME + font2 + "',";//车站名
                //}
                //else
                //{
                //    RoutingStationRel rel = Api.Util.Common.getRoutingStationRel(alarmList[i].G_BUREAU_ORG.ORG_CODE + alarmList[i].CROSSING_NO + alarmList[i].STATION_NO);
                //    jsonStr += "'STATION':'" + font1 + alarmList[i].STATION_NO + " " + rel.STATION_NAME + font2 + "',";//车站名
                //}
                jsonStr += "'KM':'" + font1 + PublicMethod.KmtoString(alarmList[i].KM_MARK) + font2 + "',";//KM

                jsonStr += "'GIS':'" + GIS + "',";//KM
                jsonStr += "'GISX':'" + alarmList[i].GIS_X + "',";//KM
                jsonStr += "'GISY':'" + alarmList[i].GIS_Y + "',";//KM
                jsonStr += "'HW':'" + PublicMethod.GetFullDir(alarmList[i]) + alarmList[i].SNAPPED_IMA.Replace(".IMA", "_IRV.jpg") + "',";
                jsonStr += "'KJG':'" + PublicMethod.GetFullDir(alarmList[i]) + alarmList[i].SNAPPED_JPG + "',";
                //jsonStr += "'Save':' <span class=\\\"label btn_save collect\\\" >  <i  class=\\\"i_save icon icon-star-on icon-white\\\" ></i> 收藏  </span> ',";//操作
                jsonStr += "'Save':' <span class=\\\"label btn_save collect\\\"> <i class=\\\"i_save icon icon-star-on icon-white\\\" ></i></span> ',";//收藏
                jsonStr += "'GWZ':'" + font1 + alarmList[i].BOW_TYPE + font2 + "',";//弓位置
                jsonStr += "'SD':'" + font1 + alarmList[i].SPEED + "km/h" + font2 + "',";//速度
                jsonStr += "'DVALUE1':'" + font1 + DvalueDateTime(alarmList[i].DVALUE1) + font2 + "',";//收到FaultI文件时间
                jsonStr += "'DVALUE2':'" + font1 + DvalueDateTime(alarmList[i].DVALUE2) + font2 + "',";//收到红外视频时间
                jsonStr += "'DVALUE3':'" + font1 + DvalueDateTime(alarmList[i].DVALUE3) + font2 + "',";//收到可见光视频时间
                jsonStr += "'DVALUE4':'" + font1 + DvalueDateTime(alarmList[i].DVALUE4) + font2 + "',";//收到全景I视频时间
                jsonStr += "'DVALUE5':'" + font1 + DvalueDateTime(alarmList[i].DVALUE5) + font2 + "',";//收到全景II视频时间
                jsonStr += "'STATUS_TIME':'" + font1 + DvalueDateTime(alarmList[i].STATUS_TIME) + font2 + "',";//分析时间
                jsonStr += "'DVALUE1C':'" + font1 + CheckTime(alarmList[i].NVALUE11) + "" + font2 + "',";//上报同步文件时差
                jsonStr += "'DVALUE2C':'" + font1 + CheckTime(alarmList[i].NVALUE12) + "" + font2 + "',";//上报红外时差
                jsonStr += "'DVALUE3C':'" + font1 + CheckTime(alarmList[i].NVALUE13) + "" + font2 + "',";//上报可见光时差
                jsonStr += "'DVALUE4C':'" + font1 + CheckTime(alarmList[i].NVALUE14) + "" + font2 + "',";//上报全景I时差
                jsonStr += "'DVALUE5C':'" + font1 + CheckTime(alarmList[i].NVALUE15) + "" + font2 + "',";//上报全景II时差
                jsonStr += "'STATUS_TIMEC':'" + font1 + CheckTime(alarmList[i].NVALUE16) + "" + font2 + "',";//分析时间差
                jsonStr += "'CHULIZT':'" + font1 + FXStatus + font2 + "',";//分析状态
                jsonStr += "'WD':'" + font1 + myfiter.GetTEMP_MAX(alarmList[i]) + font2 + "',";//红外温度
                jsonStr += "'HJWD':'" + font1 + myfiter.GetTEMP_ENV(alarmList[i]) + font2 + "',";//环境温度
                jsonStr += "'DGZ':'" + font1 + myfiter.GetLINE_HEIGHT(alarmList[i]) + "',";//导高
                jsonStr += "'LCZ':'" + font1 + myfiter.GetPULLING_VALUE(alarmList[i]) + "',";//拉出值
                jsonStr += "'JB':'" + font1 + alarmList[i].SEVERITY + font2 + "',";//级别
                jsonStr += "'WZ':'" + font1 + wz + font2 + "',";//位置信息
                jsonStr += "'QXZT':'" + font1 + alarmList[i].CODE_NAME + font2 + "',";//缺陷状态
                jsonStr += "'ZT':'" + font1 + alarmList[i].STATUS_NAME + font2 + "',";//状态
                jsonStr += "'NOWDATE':'" + font1 + alarmList[i].RAISED_TIME.ToString("yyyy-MM-dd HH:mm:ss") + font2 + "',";//发生时间
                jsonStr += "'CZ':'" + url + "',";//操作
                jsonStr += "'XZ':'" + IRV + "',";//XZ
                jsonStr += "'ID':'" + alarmList[i].ID + "'";
                jsonStr += " },";
            }
            if (jsonStr.LastIndexOf(',') > 0)
            {
                jsonStr = jsonStr.Substring(0, jsonStr.LastIndexOf(',')) + "],'page':" + pageIndex + ",'rp':" + pageSize + ",'total':" + recordCount + "}";
            }
            else
            {
                jsonStr += "],'page':'" + pageIndex + "','rp':'" + pageSize + "','total':'" + recordCount + "'}";

            }

            jsonStr = jsonStr.Replace("'", "\"");
            HttpContext.Current.Response.Write(myfiter.json_RemoveSpecialStr(jsonStr));
        }
    }

    /// <summary>
    /// 将时间格式转化为字符串
    /// </summary>
    /// <param name="dt"></param>
    /// <returns></returns>
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

    /// <summary>
    /// 计算视频时间差
    /// </summary>
    /// <param name="dt">结束时间（收到文件的时间）</param>
    /// <param name="statetime">开始时间（事件的发生时间）</param>
    /// <returns></returns>
    public string DvalueCDateTime(DateTime dt, DateTime statetime)
    {
        if (dt.ToString() == "0001-1-1 00:00:00" || dt.ToString() == "" || dt.ToString() == "0001/1/1 0:00:00")
        {

            return "";
        }
        else
        {
            TimeSpan ts = dt - statetime;
            return Convert.ToDouble(String.Format("{0:F}", ts.TotalHours)).ToString() + "小时";
        }
    }

    /// <summary>
    /// 当分钟数为负时，显示空值
    /// </summary>
    /// <param name="time_delay">分钟数</param>
    /// <returns></returns>
    public string CheckTime(int time_delay)
    {
        if (time_delay < 0)
        {
            return "";
        }
        else
        {
            return Convert.ToString(time_delay) + "分钟";
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