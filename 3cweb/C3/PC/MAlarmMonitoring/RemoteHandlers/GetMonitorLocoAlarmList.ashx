<%@ WebHandler Language="C#" Class="GetMonitorLocoAlarmList" %>
using System.Diagnostics;
using System;
using System.Web;
using System.IO;
using System.Data;
using System.Collections.Generic;
using Api.Fault.entity.alarm;
using Api.Foundation.entity.Cond;
using Api.Foundation.entity.Foundation;
using System.Configuration;
using System.Collections;
using System.Reflection;
using System.Text.RegularExpressions;

/// <summary>
/// 报警列表
/// </summary>
public class GetMonitorLocoAlarmList : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        try
        {
            string action = HttpContext.Current.Request["action"];
            if (string.IsNullOrEmpty(action))
            {
                GetList();
            }
            else
            {
                switch (action)
                {
                    case "start":
                        Start(context);
                        break;
                    case "produce":
                        GetReport(context);
                        break;
                    case "list":
                        GetAlarmList();
                        break;
                    case "samplePath":
                        GetSamplePath();
                        break;
                    case "vertifyScenceSample_Str":
                        VertifyScenceSample_Str();
                        break;
                    default:
                        break;
                }
            }

        }
        catch (Exception ex)
        {

            log4net.ILog log = log4net.LogManager.GetLogger("报警列表");
            log.Error("执行出错", ex);
        }
    }
    public void Start(HttpContext context)
    {
        //C3_AlarmCond alarmCond = my_alarm.GetC3_AlermCond_byListWhere(); //生成告警条件实体
        //List<C3_Alarm> alarmList = Api.ServiceAccessor.GetAlarmService().getC3Alarm_Aux(alarmCond); //取告警实体对象列表
        C3_AlarmCond alarmCond = my_alarm.GetC3_AlermCond_AlarmList();
        string user = Api.Util.UserPermissionc.GetUser_PermissionWhereStr_orgCode_p_orgCode();
        if (!string.IsNullOrEmpty(user))
        {
            if (!string.IsNullOrEmpty(alarmCond.businssAnd))
            {
                alarmCond.businssAnd += " and ";
            }
            alarmCond.businssAnd += "(" + user + ")";
        }
        bool sign = false;
        try
        {
            alarmCond.orderBy = null;
            sign = Api.ServiceAccessor.GetAlarmService().updatereporetstatusbycond(alarmCond);
        }
        catch (Exception ex)
        {
            log4net.ILog log2 = log4net.LogManager.GetLogger("开始申请批量下载");
            log2.Error("Error", ex);
        }
        HttpContext.Current.Response.Write(sign);
    }
    public void GetReport(HttpContext context)
    {
        //C3_AlarmCond alarmCond = my_alarm.GetC3_AlermCond_byListWhere(); //生成告警条件实体
        C3_AlarmCond alarmCond = my_alarm.GetC3_AlermCond_AlarmList();
        alarmCond.orderBy = null;
        int already = 1;
        int total = 1;
        Api.ServiceAccessor.GetAlarmService().queryCountofAlarmList(alarmCond, out already, out total);
        if (!(total == 0))
        {
            System.Text.StringBuilder json = new System.Text.StringBuilder();
            string result = (Convert.ToDouble(already) * 100 / Convert.ToDouble(total)).ToString("0.00");
            json.Append("{\"result\":\"" + result + "\",");
            json.Append("\"already\":\"" + already + "\",");
            json.Append("\"total\":\"" + total + "\"}");
            HttpContext.Current.Response.ContentType = "application/json";
            HttpContext.Current.Response.Write(json);
        }
    }
    public void GetList()
    {
        try
        {
            C3_AlarmCond alarmCond = my_alarm.GetC3_AlermCond_byListWhere(); //生成告警条件实体
                                                                             //List<C3_Alarm> alarmList = Api.ServiceAccessor.GetAlarmService().getC3Alarm(alarmCond); //取告警实体对象列表
            List<C3_Alarm> alarmList = Api.ServiceAccessor.GetAlarmService().getC3Alarm_Aux(alarmCond); //取告警实体对象列表
            int recordCount = Api.ServiceAccessor.GetAlarmService().getAlarmCount(alarmCond);        //告警列表总数量    

            string re = GetJSON(alarmList, recordCount); //得到json
            HttpContext.Current.Response.ContentType = "application/json";
            HttpContext.Current.Response.Write(Newtonsoft.Json.JsonConvert.DeserializeObject(re));

        }
        catch (Exception ex)
        {
            log4net.ILog log2 = log4net.LogManager.GetLogger("缺陷列表页");
            log2.Error("Error", ex);
        }
    }
    /// <summary>
    /// 优化效率后的报警列表
    /// </summary>
    public void GetAlarmList()
    {
        try
        {
            C3_AlarmCond alarmCond = my_alarm.GetC3_AlermCond_AlarmList(); //生成告警条件实体  

            bool sign = false;
            sign = IsCondNull(alarmCond);


            List<Alarm> alarmList = new List<Alarm>();

            if (sign)
            {
                //判断机车还是动车
                if (Api.Util.Common.FunEnable("Fun_isCRH") == true)
                {
                    if (Api.Util.Common.FunEnable("Fun_StatisticsTimes") == false)//判断内部版还是外部版
                    {
                        alarmList = Api.ServiceAccessor.GetAlarmService().GetAlarmList(alarmCond); //取告警实体对象列表，使用Alarm实体对象，外部版  
                    }
                    else
                    {
                        alarmList = Api.ServiceAccessor.GetAlarmService().GetAlarmListAndPoleAlarm(alarmCond); //取告警实体对象列表，使用Alarm实体对象，内部版，增加支柱报警
                    }

                }
                else
                {
                    //if (Api.Util.Common.FunEnable("Fun_StatisticsTimes") == false)//判断内部版还是外部版
                    //{
                    //    alarmList = Api.ServiceAccessor.GetAlarmService().GetAlarmList(alarmCond); //取告警实体对象列表，使用Alarm实体对象，外部版  
                    //}
                    //else
                    //{
                    //    //机车内部版，增加设备类型选项
                    alarmList = Api.ServiceAccessor.GetAlarmService().GetAlarmListJC_Inside(alarmCond); //取告警实体对象列表，使用Alarm实体对象，内部版，增加支柱报警
                                                                                                        //}
                }
            }


            string re = GetJson(alarmList); //得到json
            HttpContext.Current.Response.ContentType = "application/json";
            HttpContext.Current.Response.Write(Newtonsoft.Json.JsonConvert.DeserializeObject(re));
            //HttpContext.Current.Response.Write(re);

        }
        catch (Exception ex)
        {
            log4net.ILog log2 = log4net.LogManager.GetLogger("缺陷列表页");
            log2.Error("Error", ex);
        }
    }


    /// <summary>
    /// 得到json字串
    /// </summary>
    /// <param name="alarmList">告警实体对象列表</param>
    /// <returns></returns>
    public string GetJSON(List<C3_Alarm> alarmList, int recordCount)
    {
        string sore = HttpContext.Current.Request["sore"];
        int pageIndex = Convert.ToInt32(HttpContext.Current.Request["page"]);  //获取前台页码
        int pageSize = Convert.ToInt32(HttpContext.Current.Request["rp"]); //获取前台条数

        string wz = "";
        string status;
        string font1 = "";//行字体颜色开头
        string font2 = "";//行字体颜色结尾
        string url;
        string IRV;
        string GIS;
        string REP_COUNT;

        System.Text.StringBuilder jsonStr = new System.Text.StringBuilder();
        jsonStr.Append("{'rows':[");

        for (int i = 0; i < alarmList.Count; i++)
        {
            REP_COUNT = "";
            if (alarmList[i].Alarm_Aux != null)
            {
                if (alarmList[i].SVALUE15 == "重复报警")
                {
                    REP_COUNT = alarmList[i].Alarm_Aux.ALARM_REP_COUNT == 0 ? "" : "<a  class=\"label\" style=\"background-color:red;\" href=javascript:goRepeate(\"" + alarmList[i].ID + "\",\"" + alarmList[i].ID + "\")>最新重复 " + alarmList[i].Alarm_Aux.ALARM_REP_COUNT + " 次</a>";
                }
                else
                {
                    REP_COUNT = alarmList[i].Alarm_Aux.ALARM_REP_COUNT == 0 ? "" : "<a  class=\"label\" style=\"background-color:#987B40;\" href=javascript:goRepeate(\"" + alarmList[i].ID + "\",\"" + alarmList[i].SVALUE15 + "\")>历史重复 " + alarmList[i].Alarm_Aux.ALARM_REP_COUNT + " 次</a>";
                }

            }
            if (i > 0)
            {
                jsonStr.Append(",");
            }

            if (sore != "GS")
            {
                url = "<a  href=javascript:selectInfo(" + alarmList[i].ID + ")>处理</a>";
                IRV = "<a href=javascript:IRVXZ(" + alarmList[i].ID + ")>视频下载</a>";
            }
            else
            {
                url = "<a  href=javascript:UpdateInfo(" + alarmList[i].ID + ")>修改</a>&nbsp;<a  href=javascript:selectInfo(" + alarmList[i].ID + ")>处理</a>";

                if (alarmList[i].RAISE_FILE_IR == null || alarmList[i].RAISE_FILE_IR == "")
                {
                    IRV = "";
                }
                else
                {
                    IRV = "<a href=javascript:IRVXZ(" + alarmList[i].ID + ")>视频下载</a>";
                }
            }

            GIS = "<a href=javascript:ShowGis(" + alarmList[i].ID + ")>东经:" + alarmList[i].GIS_X.ToString("f2") + " 北纬:" + alarmList[i].GIS_Y.ToString("f2") + "</a>";
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
            else if (status == "已取消" || status == "已关闭")
            {
                font1 = "<font color=green>";
                font2 = "</font>";
            }

            //判断可见光和全景视频时间存在否
            if (Api.Util.Common.FunEnable("Fun_PositionNull"))
            {
                if ((DvalueDateTime(alarmList[i].DVALUE3) == "" || DvalueDateTime(alarmList[i].DVALUE3) == null) || ((DvalueDateTime(alarmList[i].DVALUE4) == "" || DvalueDateTime(alarmList[i].DVALUE4) == null) && (DvalueDateTime(alarmList[i].DVALUE5) == "" || DvalueDateTime(alarmList[i].DVALUE5) == null)))
                {
                    font1 = "<font color=#ccc>";
                    font2 = "</font>";
                }
            }

            jsonStr.Append("{'LOCOMOTIVE_CODE':'" + font1 + alarmList[i].DETECT_DEVICE_CODE + font2 + "',");//车号


            jsonStr.Append("'XL':'" + font1 + alarmList[i].LINE_NAME + font2 + "',");//线路
            jsonStr.Append("'STATION':'" + font1 + alarmList[i].POSITION_NAME + font2 + "',");//车站名


            //wz = PublicMethod.GetPositionByC3_Alarm(alarmList[i]);
            wz = PublicMethod.GetPosition_Alarm(alarmList[i].LINE_NAME, alarmList[i].POSITION_NAME, alarmList[i].BRG_TUN_NAME, alarmList[i].DIRECTION, alarmList[i].KM_MARK, alarmList[i].POLE_NUMBER, alarmList[i].DEVICE_ID, alarmList[i].ROUTING_NO, alarmList[i].AREA_NO, alarmList[i].STATION_NO, alarmList[i].STATION_NAME, alarmList[i].TAX_MONITOR_STATUS);
            jsonStr.Append("'JL':'" + font1 + alarmList[i].ROUTING_NO + font2 + "',");//交路
            jsonStr.Append("'QD':'" + font1 + alarmList[i].AREA_NO + font2 + "',");//运用区段 
            jsonStr.Append("'KM':'" + font1 + PublicMethod.KmtoString(alarmList[i].KM_MARK) + font2 + "',");//KM
            jsonStr.Append("'GIS':'" + GIS + "',");//KM
            jsonStr.Append("'GISX':'" + alarmList[i].GIS_X + "',");//KM
            jsonStr.Append("'GISY':'" + alarmList[i].GIS_Y + "',");//KM
            jsonStr.Append("'GWZ':'" + font1 + alarmList[i].BOW_TYPE + font2 + "',");//弓位置
            jsonStr.Append("'SD':'" + font1 + myfiter.GetSpeed(alarmList[i].SPEED) + font2 + "',");//速度
            jsonStr.Append("'WD':'" + font1 + myfiter.GetTEMP_MAX(alarmList[i]) + font2 + "',");//红外温度
            jsonStr.Append("'HJWD':'" + font1 + myfiter.GetTEMP(alarmList[i].ENV_TEMP) + font2 + "',");//环境温度
            jsonStr.Append("'DGZ':'" + font1 + myfiter.GetLINE_HEIGHT(alarmList[i]) + "',");//导高
            jsonStr.Append("'LCZ':'" + font1 + myfiter.GetPULLING_VALUE(alarmList[i]) + "',");//拉出值
            jsonStr.Append("'JB':'" + font1 + alarmList[i].SEVERITY + font2 + "',");//级别
            jsonStr.Append("'WZ':'" + REP_COUNT + "  " + font1.Replace(">", " class=itemWZ  title=" + myfiter.RemoveHTML(wz, my_const.TAX_MONITOR_STATUS.Length) + " class=tooltip-test data-toggle=tooltip >") + wz + font2 + "',");//位置信息
            jsonStr.Append("'QXZT':'" + font1 + alarmList[i].CODE_NAME + font2 + "',");//缺陷状态
            jsonStr.Append("'ZT':'" + font1 + alarmList[i].STATUS_NAME + font2 + "',");//状态
            jsonStr.Append("'NOWDATE':'" + font1 + alarmList[i].RAISED_TIME.ToString("yyyy-MM-dd HH:mm:ss") + font2 + "',");//发生时间
            jsonStr.Append("'alarm_analysis':'" + font1.Replace(">", " class=itemANA  title=" + myfiter.RemoveHTML(alarmList[i].ALARM_ANALYSIS, 100) + " data-html=true data-rel=tooltip  >") + alarmList[i].ALARM_ANALYSIS + font2 + "',");//报警分析
            jsonStr.Append("'checkbox':'<input type=checkbox class=cb_item value=" + alarmList[i].ID + " />',");//报警分析


            jsonStr.Append("'HW':'" + PublicMethod.GetFullDir(alarmList[i]) + alarmList[i].SNAPPED_IMA.Replace(".IMA", "_IRV.jpg").Replace("#", "%23") + "',");//操作
            jsonStr.Append("'KJG':'" + PublicMethod.GetFullDir(alarmList[i]) + alarmList[i].SNAPPED_JPG.Replace("#", "%23") + "',");//操作
            if (!string.IsNullOrEmpty(alarmList[i].SVALUE9))
            {
                jsonStr.Append("'QJ':'" + PublicMethod.GetFullDir(alarmList[i]) + alarmList[i].SVALUE9.Replace("#", "%23") + "',");
            }
            else
            {
                jsonStr.Append("'QJ':'',");
            }
            //


            jsonStr.Append("'portOut':'" + "<a  href=# onclick=portOutwordSingle(" + alarmList[i].ID + ")>导出报告</a>" + "',");//导出Word  




            jsonStr.Append("'Save':' <span class=\\\"label btn_save collect\\\">  <i  class=\\\"i_save icon icon-star-on icon-white\\\" ></i> 收藏  </span> ',");//收藏
            string duty_range = "";
            PublicMethod.GetDutyRange(alarmList[i].ORG_CODE, ref duty_range);
            jsonStr.Append("'ORG':'" + duty_range + "',");//组织机构

            jsonStr.Append("'CZ':'" + url + "',");//操作
            jsonStr.Append("'XZ':'" + IRV + "',");//XZ
            jsonStr.Append("'ID':'" + alarmList[i].ID + "',");
            jsonStr.Append("'bjbm':'" + font1 + alarmList[i].CUST_ALARM_CODE + font2 + "'");
            jsonStr.Append(" }");
        }

        jsonStr.Append("],'page':'" + pageIndex + "','rp':'" + pageSize + "','total':'" + recordCount + "',");
        PageHelper ph = new PageHelper();
        ph.getPageHelper(recordCount, pageIndex, pageSize);
        string pageOfTotal = ph.PageOfTotal;
        string pageRange = ph.PageRange;
        int totalPages = ph.Total_pages;
        jsonStr.Append("'pageOfTotal':'" + pageOfTotal + "','pageRange':'" + pageRange + "','totalPages':'" + totalPages + "'}");

        return myfiter.json_RemoveSpecialStr_N(jsonStr.ToString());

    }
    /// <summary>
    /// 优化效率后得到的json字串
    /// </summary>
    /// <param name="alarmList">告警实体对象列表</param>
    /// <returns></returns>
    public string GetJson(List<Alarm> alarmList)
    {
        string sore = HttpContext.Current.Request["sore"];
        int pageIndex = Convert.ToInt32(HttpContext.Current.Request["page"]);  //获取前台页码
        int pageSize = Convert.ToInt32(HttpContext.Current.Request["rp"]); //获取前台条数

        string wz = "";
        string status;
        string font1 = "";//行字体颜色开头
        string font2 = "";//行字体颜色结尾
        string url;
        string IRV;
        string GIS;
        string REP_COUNT;
        string IsCrack = "";//是否为破解机车
        string REP_P_ID = "";//重复报警父ID
        string spanL = "<span class=\\\"status\\\">";
        string spanR = "</span>";

        System.Text.StringBuilder json = new System.Text.StringBuilder();
        System.Text.StringBuilder resultjson = new System.Text.StringBuilder();//返回值
        json.Append("{\"rows\":[");

        for (int i = 0; i < alarmList.Count; i++)
        {
            System.Text.StringBuilder jsonStr = new System.Text.StringBuilder();//循环体
            try
            {
                REP_COUNT = "";
                if (alarmList[i].SVALUE15 == "重复报警")
                {
                    REP_COUNT = alarmList[i].NVALUE19 == 0 ? "" : "<a  class=\\\"label\\\" style=\\\"background-color:red;\\\" href=javascript:goRepeate(\\\"" + alarmList[i].ID + "\\\",\\\"" + alarmList[i].ID + "\\\")>最新重复 " + alarmList[i].NVALUE19 + " 次</a>";
                    REP_P_ID = alarmList[i].NVALUE19 == 0 ? "" : alarmList[i].ID;
                }
                else
                {
                    REP_COUNT = alarmList[i].NVALUE19 == 0 ? "" : "<a  class=\\\"label\\\" style=\\\"background-color:#987B40;\\\" href=javascript:goRepeate(\\\"" + alarmList[i].ID + "\\\",\\\"" + alarmList[i].SVALUE15 + "\\\")>历史重复 " + alarmList[i].NVALUE19 + " 次</a>";
                    REP_P_ID = alarmList[i].NVALUE19 == 0 ? "" : alarmList[i].ID;
                }

                if (sore != "GS")
                {
                    url = "<a  href=javascript:selectInfo(" + alarmList[i].ID + ")>处理</a>";
                    IRV = "<a href=javascript:IRVXZ(" + alarmList[i].ID + ")>视频下载</a>";
                }
                else
                {
                    url = "<a  href=javascript:UpdateInfo(" + alarmList[i].ID + ")>修改</a>&nbsp;<a  href=javascript:selectInfo(" + alarmList[i].ID + ")>处理</a>";

                    if (Convert_Url(alarmList[i].SVALUE14.Replace("_9_", "_1_").Replace(".scs", ".mfc3")) == null || Convert_Url(alarmList[i].SVALUE14.Replace("_9_", "_1_").Replace(".scs", ".mfc3")) == "")
                    {
                        IRV = "";
                    }
                    else
                    {
                        IRV = "<a href=javascript:IRVXZ(" + alarmList[i].ID + ")>视频下载</a>";
                    }
                }

                GIS = "<a href=javascript:ShowGis(" + alarmList[i].ID + ")>东经:" + alarmList[i].GIS_X.ToString("f2") + " 北纬:" + alarmList[i].GIS_Y.ToString("f2") + "</a>";
                status = alarmList[i].STATUS_NAME; //状态
                if (status == "新上报" || status == null || status == "")
                {
                    font1 = "<font>";
                    font2 = "</font>";
                }
                else if (status == "已确认" || status == "新缺陷")
                {
                    font1 = "<font color=red>";
                    font2 = "</font>";
                }
                else if (status == "已取消" || status == "已关闭")
                {
                    font1 = "<font color=green>";
                    font2 = "</font>";
                }
                else if (status == "已计划")
                {
                    font1 = "<font color=#a88809>";
                    font2 = "</font>";
                }
                else if (status == "检修中")
                {
                    font1 = "<font color=#2e93e1>";
                    font2 = "</font>";
                }
                if ((!string.IsNullOrEmpty(alarmList[i].MY_STR_6)) && (alarmList[i].MY_STR_6 == "PS3B" || alarmList[i].MY_STR_6 == "PS4B"))//破解机车
                {
                    IsCrack = "破解";
                }
                else
                {
                    IsCrack = "自研";
                }
                //判断可见光和全景视频时间存在否
                if (Api.Util.Common.FunEnable("Fun_PositionNull"))
                {
                    if (alarmList[i].MY_STR_6 == "PS3B" || alarmList[i].MY_STR_6 == "PS4B")
                    {
                        if ((DvalueDateTime(alarmList[i].DVALUE3) == "" || DvalueDateTime(alarmList[i].DVALUE3) == null))
                        {
                            font1 = "<font color=#ccc>";
                            font2 = "</font>";
                        }
                    }
                    else
                    {
                        if ((DvalueDateTime(alarmList[i].DVALUE3) == "" || DvalueDateTime(alarmList[i].DVALUE3) == null) || ((DvalueDateTime(alarmList[i].DVALUE4) == "" || DvalueDateTime(alarmList[i].DVALUE4) == null) && (DvalueDateTime(alarmList[i].DVALUE5) == "" || DvalueDateTime(alarmList[i].DVALUE5) == null)))
                        {
                            font1 = "<font color=#ccc>";
                            font2 = "</font>";
                        }
                    }
                }

                jsonStr.Append("{\"LOCOMOTIVE_CODE\":\"" + font1 + alarmList[i].DETECT_DEVICE_CODE + font2 + "\",");//车号


                jsonStr.Append("\"XL\":\"" + font1 + alarmList[i].LINE_NAME + font2 + "\",");//线路
                jsonStr.Append("\"STATION\":\"" + font1 + alarmList[i].POSITION_NAME + font2 + "\",");//车站名


                //wz = PublicMethod.GetPositionByC3_Alarm(alarmList[i]);
                wz = PublicMethod.GetPosition_Alarm(alarmList[i].LINE_NAME, alarmList[i].POSITION_NAME, alarmList[i].BRG_TUN_NAME, alarmList[i].DIRECTION, alarmList[i].KM_MARK, alarmList[i].POLE_NUMBER, alarmList[i].DEVICE_ID, alarmList[i].ROUTING_NO, alarmList[i].AREA_NO, alarmList[i].STATION_NO, alarmList[i].STATION_NAME, alarmList[i].TAX_MONITOR_STATUS);
                jsonStr.Append("\"JL\":\"" + font1 + alarmList[i].ROUTING_NO + font2 + "\",");//交路
                jsonStr.Append("\"QD\":\"" + font1 + alarmList[i].AREA_NO + font2 + "\",");//运用区段 
                jsonStr.Append("\"KM\":\"" + font1 + PublicMethod.KmtoString(alarmList[i].KM_MARK) + font2 + "\",");//KM
                jsonStr.Append("\"GIS\":\"" + GIS + "\",");//KM
                jsonStr.Append("\"GISX\":\"" + alarmList[i].GIS_X + "\",");//KM
                jsonStr.Append("\"GISY\":\"" + alarmList[i].GIS_Y + "\",");//KM
                jsonStr.Append("\"GWZ\":\"" + font1 + alarmList[i].SVALUE8 + font2 + "\",");//弓位置
                jsonStr.Append("\"SD\":\"" + font1 + myfiter.GetSpeed(alarmList[i].NVALUE1) + font2 + "\",");//速度
                jsonStr.Append("\"WD\":\"" + font1 + myfiter.GetTEMP_MAX(alarmList[i]) + font2 + "\",");//红外温度
                jsonStr.Append("\"HJWD\":\"" + font1 + myfiter.GetTEMP(alarmList[i].NVALUE5) + font2 + "\",");//环境温度
                jsonStr.Append("\"DGZ\":\"" + font1 + myfiter.GetLINE_HEIGHT(alarmList[i]) + "\",");//导高
                jsonStr.Append("\"LCZ\":\"" + font1 + myfiter.GetPULLING_VALUE(alarmList[i]) + "\",");//拉出值
                jsonStr.Append("\"WXS\":\"" + font1 + alarmList[i].NVALUE6 + "\",");//卫星数


                string alarm_analysis_title = myfiter.json_RemoveSpecialStr_item_double(myfiter.RemoveHTML(alarmList[i].ALARM_ANALYSIS, 100));
                string alarm_analysis = myfiter.json_RemoveSpecialStr_item_double(alarmList[i].ALARM_ANALYSIS);

                jsonStr.Append("\"JB\":\"" + font1 + PublicMethod.getCode_Name(alarmList[i].SEVERITY) + font2 + "\",");//级别

                jsonStr.Append("\"WZ\":\"" + REP_COUNT + "  " + font1.Replace(">", " class=itemWZ  title=" + myfiter.RemoveHTML(wz, my_const.TAX_MONITOR_STATUS.Length).Replace(">", "%3e") + "  >") + wz + font2 + "\",");//位置信息
                jsonStr.Append("\"QXZT\":\"" + font1 + alarmList[i].CODE_NAME + font2 + "\",");//缺陷状态
                jsonStr.Append("\"ZT\":\"" + font1 + spanL + alarmList[i].STATUS_NAME + spanR + font2 + "\",");//状态
                jsonStr.Append("\"NOWDATE\":\"" + font1 + alarmList[i].RAISED_TIME.ToString("yyyy-MM-dd HH:mm:ss") + font2 + "\",");//发生时间
                jsonStr.Append("\"alarm_analysis\":\"" + font1.Replace(">", " class=itemANA  title=" + alarm_analysis_title + " data-html=true data-rel=tooltip  >") + alarm_analysis + font2 + "\",");//报警分析
                jsonStr.Append("\"checkbox\":\"<input type=checkbox class=cb_item value=" + alarmList[i].ID + " />\",");//报警分析


                //jsonStr.Append("\"HW\":\"" + PublicMethod.GetFullDir(alarmList[i]) + alarmList[i].SVALUE11.Replace(".IMA", "_IRV.jpg") + "\",");//红外
                ///获取虚拟表缓存中的Ip
                string[] virtualPath = PublicMethod.GetFullDir(alarmList[i]).Split('/');
                string ip = null;
                if (Api.Util.Common.virtual_Dir_InfoCache.ContainsKey(virtualPath[1]))//检测虚拟缓存表中是否含有Alarm表记录的虚拟目录名
                    ip = Api.Util.Common.virtual_Dir_InfoCache[virtualPath[1]].PATH;
                else
                {
                    Api.Util.Common.virtual_Dir_InfoCache = ADO.IVirtual_dir_infoImpl.InitVirtualCache();//如果第一次没在虚拟表中找到，则再将虚拟目录表缓存一次
                    if (Api.Util.Common.virtual_Dir_InfoCache.ContainsKey(virtualPath[1]))
                        ip = Api.Util.Common.virtual_Dir_InfoCache[virtualPath[1]].PATH;
                }


                if (string.IsNullOrEmpty(alarmList[i].SVALUE11))
                {
                    if (string.IsNullOrEmpty(alarmList[i].SVALUE14))
                    {
                        jsonStr.Append("\"HW\":\"" + "\",");
                    }
                    else
                    {

                        jsonStr.Append("\"HW\":\"" + myfiter.GetPicUrl(PublicMethod.GetFullDir(alarmList[i]) + (Convert_Url(Path.GetFileNameWithoutExtension(alarmList[i].SVALUE14.Replace("_9_", "_1_"))) + ".IMA").Replace(".IMA", "_IRV.jpg")) + "\",");//红外
                    }
                }
                else
                {

                    jsonStr.Append("\"HW\":\"" + myfiter.GetPicUrl(PublicMethod.GetFullDir(alarmList[i]) + Convert_Url(alarmList[i].SVALUE11).Replace(".IMA", "_IRV.jpg")) + "\",");//红外

                }
                if (DvalueDateTime(alarmList[i].DVALUE3) == "" || DvalueDateTime(alarmList[i].DVALUE3) == null)
                {
                    jsonStr.Append("\"KJG\":\"" + myfiter.GetPicUrl(PublicMethod.GetFullDir(alarmList[i]) + Convert_Url(alarmList[i].SVALUE5)) + "?r=0\",");//可见光
                }
                else
                {

                    jsonStr.Append("\"KJG\":\"" + myfiter.GetPicUrl(PublicMethod.GetFullDir(alarmList[i]) + Convert_Url(alarmList[i].SVALUE5)) + "?r=1\",");//可见光
                }
                //jsonStr.Append("\"KJG\":\"" + PublicMethod.GetFullDir(alarmList[i]) + Convert_Url(alarmList[i].SVALUE5) + "\",");//可见光
                if (!string.IsNullOrEmpty(Convert_Url(alarmList[i].SVALUE9)))
                {

                    jsonStr.Append("\"QJ\":\"" + myfiter.GetPicUrl(PublicMethod.GetFullDir(alarmList[i]) + Convert_Url(alarmList[i].SVALUE9)) + "\",");
                }
                else
                {
                    jsonStr.Append("\"QJ\":\"\",");
                }
                jsonStr.Append("\"portOut\":\"" + "<a  href=# onclick=portOutwordSingle(" + alarmList[i].ID + ")>导出报告</a>" + "\",");//导出Word  

                jsonStr.Append("\"SELECT_DPC\":\" <select code=\\\"" + alarmList[i].ID + "\\\" class=\\\"table_select\\\"><option value=\\\"0\\\">无</option><option value=\\\"Mission\\\">转任务</option><option value=\\\"Canc\\\">取消</option></select> \",");//报警列表收藏类型选项


                jsonStr.Append("\"Save\":\" <span class=\\\"label btn_save collect\\\">  <i  class=\\\"i_save icon icon-star-on icon-white\\\" ></i>   </span> \",");//收藏
                string duty_range = "";
                PublicMethod.GetDutyRange(alarmList[i].ORG_CODE, ref duty_range);
                jsonStr.Append("\"ORG\":\"" + font1 + duty_range + font2 + "\",");//组织机构

                jsonStr.Append("\"CZ\":\"" + url + "\",");//操作
                jsonStr.Append("\"XZ\":\"" + IRV + "\",");//XZ
                jsonStr.Append("\"ID\":\"" + alarmList[i].ID + "\",");
                jsonStr.Append("\"bjbm\":\"" + font1 + alarmList[i].CUST_ALARM_CODE + font2 + "\",");//标签
                jsonStr.Append("\"ReportPerson\":\"" + font1 + alarmList[i].REPORT_PERSON + font2 + "\",");//报告人
                jsonStr.Append("\"qxbz\":\"" + font1 + alarmList[i].MY_STR_2 + font2 + "\",");//缺陷标志
                jsonStr.Append("\"INITIAL_CODE\":\"" + font1 + alarmList[i].MY_STR_3 + font2 + "\",");//原始报警编码
                jsonStr.Append("\"INITIAL_CODE_NAME\":\"" + font1 + alarmList[i].MY_STR_4 + font2 + "\",");//原始报警类型
                jsonStr.Append("\"polealarmcount\":\"" + font1 + alarmList[i].MY_INT_2 + font2 + "\",");//支柱重复报警数
                jsonStr.Append("\"ACCESSCOUNT\":\"" + font1 + alarmList[i].MY_INT_1 + font2 + "\",");//浏览量
                jsonStr.Append("\"IS_TRANS_ALLOWED\":\"" + font1 + JudgeAllow(alarmList[i].MY_INT_8) + font2 + "\",");//转发类型
                jsonStr.Append("\"REP_P_ID\":\"" + REP_P_ID + "\",");//重复报警父ID
                if (alarmList[i].MY_STR_5 != null)
                {
                    jsonStr.Append("\"LOCK_PERSON_NAME\":\"" + "<i title=\\\"已被锁定\\\" style=\\\"color:#EA7B54;\\\" class=\\\"glyphicon glyphicon-lock\\\"></i>" + " \",");//锁定报警
                }
                if (alarmList[i].MY_DOU_1 != 0)
                {
                    jsonStr.Append("\"SPART_PIXEL_PCT\":\"" + font1 + alarmList[i].MY_DOU_1 + "%" + font2 + "\",");//燃弧百分比
                }
                else
                {
                    jsonStr.Append("\"SPART_PIXEL_PCT\":\"" + font1 + "" + font2 + "\",");//燃弧百分比
                }
                if (alarmList[i].MY_DOU_2 != 0)
                {
                    jsonStr.Append("\"SPART_PIXELS\":\"" + font1 + alarmList[i].MY_DOU_2 + font2 + "\",");//燃弧像素点
                }
                else
                {
                    jsonStr.Append("\"SPART_PIXELS\":\"" + font1 + "" + font2 + "\",");//燃弧百分比
                }
                jsonStr.Append("\"CRITERION\":\""  + font1 + alarmList[i].MY_STR_7 + font2 + "\",");//报警判断依据
                jsonStr.Append("\"LOCK_PERSON_NAME_T\":\"" + alarmList[i].MY_STR_5 + "\",");//锁定报警
                jsonStr.Append("\"proposal\":\"" + alarmList[i].PROPOSAL + "\",");
                jsonStr.Append("\"IsCrack\":\"<span class=\\\"choose_carType_forIsSaveBtn\\\">" + IsCrack + "</span>\",");
                jsonStr.Append("\"REPORT_DATE\":\"" + font1 + alarmList[i].REPORT_DATE.ToString("yyyy-MM-dd HH:mm:ss") + font2 + "\"");
                jsonStr.Append(" },");
            }
            catch (Exception ex)
            {
                jsonStr.Clear();
                log4net.ILog log2 = log4net.LogManager.GetLogger("缺陷列表页");
                log2.DebugFormat("json生成出错，缺陷ID:{0}", alarmList[i].ID + ex);
            }
            json.Append(jsonStr);
        }
        string str = json.ToString();
        if (json.Length > 9)//判断循环体内是否为空，9为"{\"rows\":["的长度
        {
            str = str.Substring(0, json.ToString().Length - 1);
        }
        resultjson.Append(str);
        int total = 0;
        if (alarmList.Count > 0)
        {
            total = alarmList[0].NVALUE11;
        }
        resultjson.Append("],\"page\":\"" + pageIndex + "\",\"rp\":\"" + pageSize + "\",\"total\":\"" + total + "\",\"total_Rows\":\"" + total + "\",\"pageIndex\":\"" + pageIndex + "\",\"pageSize\":\"" + pageSize + "\",");
        PageHelper ph = new PageHelper();
        ph.getPageHelper(total, pageIndex, pageSize);
        string pageOfTotal = ph.PageOfTotal;
        string pageRange = ph.PageRange;
        int totalPages = ph.Total_pages;
        resultjson.Append("\"pageOfTotal\":\"" + pageOfTotal + "\",\"pageRange\":\"" + pageRange + "\",\"totalPages\":\"" + totalPages + "\"}");

        string remove = HttpContext.Current.Request["remove"];//是否移除html代码
        string rejson = resultjson.ToString();
        if (remove == "1")
        {
            rejson = myfiter.RemoveHTML(rejson, 0);
        }

        return string.IsNullOrEmpty(rejson) ? "" : rejson.Replace("\n", "").Replace("\r", "").Replace("\t", "");

    }

    /// <summary>
    /// 场景样本查询输入运算式格式判断
    /// </summary>
    public void VertifyScenceSample_Str()
    {
        string SCENCESAMPLE_STR = HttpContext.Current.Request["SCENCESAMPLE_STR"];//场景样本名称查询字符串
        bool re = false;
        string zz = @"^-?[\u4E00-\u9FA5]{1,}((-|\+|\*)[\u4E00-\u9FA5]{1,})*$";
        if (!string.IsNullOrEmpty(SCENCESAMPLE_STR))
        {
            if (Regex.IsMatch(SCENCESAMPLE_STR, zz))
            {
                re = true;
            }
        }
        System.Text.StringBuilder json = new System.Text.StringBuilder();
        json.Append("{\"re\":\"" + re + "\"}");
        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);

    }


    ///// <summary>
    ///// 生成条件实体
    ///// </summary>
    ///// <returns></returns>
    //public C3_AlarmCond GetWhere()
    //{
    //    int pageIndex = Convert.ToInt32(HttpContext.Current.Request["page"]);  //获取前台页码
    //    int pageSize = Convert.ToInt32(HttpContext.Current.Request["rp"]); //获取前台条数
    //    string jlh = HttpContext.Current.Request["jlh"];
    //    string loccode = HttpContext.Current.Request["locid"];
    //    string startdate = HttpContext.Current.Request["startdate"];
    //    string enddate = HttpContext.Current.Request["enddate"];
    //    string ddlzt = HttpContext.Current.Request["zt"];
    //    string startkm = HttpContext.Current.Request["startkm"];
    //    string endkm = HttpContext.Current.Request["endkm"];
    //    string jb = HttpContext.Current.Request["jb"];
    //    string ju = HttpContext.Current.Request["ju"];//局
    //    string jwd = HttpContext.Current.Request["jwd"];//机务段
    //    string duanText = HttpContext.Current.Request["duanText"];//机务段 名称
    //    string sore = HttpContext.Current.Request["sore"];
    //    string line = HttpContext.Current.Request["line"];
    //    //   string afcode = HttpContext.Current.Request["afcode"];
    //    string code = HttpContext.Current.Request["code"];
    //    string qz = HttpContext.Current.Request["qz"]; //区站
    //    string txt_bow = HttpContext.Current.Request["txt_bow"]; //弓位置
    //    string poleCode = HttpContext.Current.Request["poleCode"]; //支柱


    //    string txt_fx = HttpContext.Current.Request["txt_fx"];
    //    string txt_temp_hw1=HttpContext.Current.Request["txt_temp_hw1"];
    //    string txt_temp_hw2=HttpContext.Current.Request["txt_temp_hw2"];
    //    string txt_temp_hj1 = HttpContext.Current.Request["txt_temp_hj1"];
    //    string txt_temp_hj2 = HttpContext.Current.Request["txt_temp_hj2"];

    //    string txt_dg1=HttpContext.Current.Request["txt_dg1"];
    //    string txt_dg2=HttpContext.Current.Request["txt_dg2"];

    //    string txt_lc1=HttpContext.Current.Request["txt_lc1"];
    //    string txt_lc2=HttpContext.Current.Request["txt_lc2"];

    //    string txt_speed1 = HttpContext.Current.Request["txt_speed1"];
    //    string txt_speed2=HttpContext.Current.Request["txt_speed2"];



    //    C3_AlarmCond alarmCond = new C3_AlarmCond();
    //    //  List<C3_Alarm> alarmList = new List<C3_Alarm>();

    //    if (!string.IsNullOrEmpty(txt_fx))
    //    {
    //        alarmCond.ALARM_ANALYSIS = txt_fx;
    //    }

    //    if (!string.IsNullOrEmpty(txt_temp_hw1))
    //    {
    //        alarmCond.startTemp_Max = Convert.ToDouble(txt_temp_hw1);
    //    }

    //    if (!string.IsNullOrEmpty(txt_temp_hw2))
    //    {
    //        alarmCond.endTemp_Max = Convert.ToDouble(txt_temp_hw2);
    //    }

    //    if (!string.IsNullOrEmpty(txt_temp_hj1))
    //    {
    //        alarmCond.startTemp_Env = Convert.ToDouble(txt_temp_hj1);
    //    }
    //    if (!string.IsNullOrEmpty(txt_temp_hj2))
    //    {
    //        alarmCond.endTemp_Env = Convert.ToDouble(txt_temp_hj2);
    //    }

    //     if (!string.IsNullOrEmpty(txt_dg1))
    //    {
    //        alarmCond.startHeight = Convert.ToDouble(txt_dg1);
    //    }
    //    if (!string.IsNullOrEmpty(txt_dg2))
    //    {
    //        alarmCond.endHeight = Convert.ToDouble(txt_dg2);
    //    }

    //    if (!string.IsNullOrEmpty(txt_lc1))
    //    {
    //        alarmCond.startPull = Convert.ToDouble(txt_lc1);
    //    }
    //    if (!string.IsNullOrEmpty(txt_lc2))
    //    {
    //        alarmCond.endPull = Convert.ToDouble(txt_lc2);
    //    }

    //     if (!string.IsNullOrEmpty(txt_speed1))
    //    {
    //        alarmCond.startSpeed = Convert.ToDouble(txt_speed1);
    //    }
    //    if (!string.IsNullOrEmpty(txt_speed2))
    //    {
    //        alarmCond.endSpeed = Convert.ToDouble(txt_speed2);
    //    }


    //    string data_type = "ALARM";
    //    if (HttpContext.Current.Request["data_type"] != null)
    //    {
    //        data_type = HttpContext.Current.Request["data_type"].ToUpper();
    //    }

    //    if (data_type == "FAULT")
    //    {
    //        alarmCond.DATA_TYPE = data_type;
    //    }


    //    if (!string.IsNullOrEmpty(code))
    //    {
    //        alarmCond.CODE = code;  //报警类型 AFBOW,AFBOWHOT,AFBOWERROR,AFSOFTLINKHOT
    //    }



    //    if (!string.IsNullOrEmpty(qz ))
    //    {
    //        string linecode = "";
    //        if (line != null && line != "0")
    //        {
    //            linecode = line;
    //        }
    //        ArrayList statList = new ArrayList();
    //        IList<StationSection> secttionlist = Api.ServiceAccessor.GetFoundationService().wildcardQueryStationSection(linecode, qz);
    //        if (secttionlist.Count > 0)
    //        {
    //            foreach (StationSection ss in secttionlist)
    //            {
    //                statList.Add(ss.POSITION_CODE);
    //            }
    //            alarmCond.positionList = statList;
    //        }
    //        else
    //        {
    //            alarmCond.businssAnd = "1=2";
    //        }

    //    }

    //    if (line != null && line != "0")
    //    {
    //        alarmCond.LINE_CODE = line;
    //    }

    //    if (jb != null && jb != "0" && jb != "")
    //    {
    //        alarmCond.SEVERITY = jb;
    //    }
    //    if (sore != null && sore != "0")
    //    {
    //        alarmCond.SOURCE = sore;
    //    }

    //    if (ju != null && ju != "0")
    //    {
    //        //  locoCond.BUREAU_CODE = ju;
    //        alarmCond.BUREAU_CODE = ju;
    //    }

    //    if (jwd != null && jwd != "0")
    //    {
    //        // locoCond.P_ORG_CODE = jwd;
    //        if (duanText.Split('供').Length > 1)
    //            alarmCond.POWER_SECTION_CODE = jwd;
    //        else
    //            alarmCond.P_ORG_CODE = jwd;
    //    }

    //    if (!string.IsNullOrEmpty(loccode ))
    //    {
    //        alarmCond.DETECT_DEVICE_CODE = loccode;
    //        //Locomotive m_loco = Api.Util.Common.getLocomotiveInfo(loccode);
    //        //if (m_loco != null)
    //        //{
    //        //    alarmCond.DETECT_DEVICE_CODE = m_loco.LOCOMOTIVE_CODE;
    //        //}
    //    }



    //    if (jlh != null && jlh != "")
    //    {
    //        alarmCond.ROUTING_NO = jlh;
    //    }

    //    if ( !string.IsNullOrEmpty( ddlzt) && ddlzt != "0")
    //    {
    //        alarmCond.STATUS = ddlzt;
    //    }




    //    if (!string.IsNullOrEmpty(startkm))
    //    {
    //        try
    //        {
    //            alarmCond.startKm = int.Parse(startkm);
    //        }
    //        catch { }
    //    }

    //    if (!string.IsNullOrEmpty(endkm))
    //    {
    //        try { alarmCond.endKm = int.Parse(endkm); }

    //        catch { }
    //    }

    //    if (!string.IsNullOrEmpty(startdate))
    //    {
    //        try { alarmCond.startTime = DateTime.Parse(startdate); }
    //        catch { }
    //    }

    //    if (!string.IsNullOrEmpty(enddate))
    //    {
    //        try { alarmCond.endTime = DateTime.Parse(enddate); }
    //        catch { }
    //    }
    //    else
    //    {
    //        alarmCond.endTime = DateTime.Now;
    //    }
    //    if (!string.IsNullOrEmpty(poleCode))
    //    {
    //        alarmCond.DEVICE_ID = poleCode;
    //    }

    //    alarmCond.CATEGORY_CODE = "3C";
    //    alarmCond.orderBy = " RAISED_TIME desc";    //排序

    //    alarmCond.pageSize = pageSize;
    //    alarmCond.page = pageIndex;


    //    if (!string.IsNullOrEmpty(txt_bow))
    //    {
    //        if (alarmCond.businssAnd == null)
    //        {
    //            alarmCond.businssAnd = "SVALUE8 = '" + txt_bow + "'";
    //        }
    //        else
    //        {
    //            alarmCond.businssAnd += " and SVALUE8 = '" + txt_bow + "'";
    //        }

    //    }

    //    return alarmCond;

    //}
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
    public string Convert_Url(string re)
    {
        if (re == null)
        {
            return null;
        }
        else
        {
            return re.Replace("#", "%23");
        }
    }

    public string JudgeAllow(int allow)
    {
        string all = "";
        switch (allow)
        {
            case -1:
                all = "不转发";
                break;
            case 1:
                all = "紧急转发";
                break;
            case 2:
                all = "普通转发";
                break;
            case 0:
                all = "未处理";
                break;
        }
        return all;
    }

    /// <summary>
    /// 判断C3_AlarmCond是否被赋值
    /// </summary>
    /// <param name="alarmCond"></param>
    /// <returns></returns>
    public bool IsCondNull(C3_AlarmCond alarmCond)
    {
        C3_AlarmCond newalarmCond = new C3_AlarmCond();
        FieldInfo[] propertys = alarmCond.GetType().GetFields();
        FieldInfo[] npropertys = newalarmCond.GetType().GetFields();
        bool sign = false;
        for (int i = 0; i < propertys.Length; i++)
        {
            //if (propertys[i].GetValue(alarmCond) != npropertys[i].GetValue(newalarmCond))
            if (!object.Equals(propertys[i].GetValue(alarmCond), npropertys[i].GetValue(newalarmCond)))
            {
                sign = true;
            }
            i++;
        }

        return sign;
    }

    /// <summary>
    /// 获取样本库文件保存路径
    /// </summary>
    public void GetSamplePath()
    {
        Api.ADO.entity.Virtual_Dir_Info vd = ADO.IVirtual_dir_infoImpl.getVirtualAndPhysical("8");//获取虚拟路径及物理路径地址
        string path = HttpContext.Current.Request.MapPath("~/" + vd.VIRTUAL_DIR_NAME);
        HttpContext.Current.Response.Write(path);
    }
}