<%@ WebHandler Language="C#" Class="GetMonitorAlarmC3Form" %>

using System;
using System.Web;
using System.Xml;
using Api.Fault.entity.alarm;
using System.Collections.Generic;
using PASS;
using Api.Util;
using Api.Foundation.entity.Foundation;
using System.Web.SessionState;
using Newtonsoft.Json;
using System.Configuration;
using System.IO;
using System.Data;
using SharedDefinition.Definitions;
using System.Web.Script.Serialization;
using System.Text;
using System.Text.RegularExpressions;
using Fault.Dao;
using _3CDataProviderService;

/// <summary>
/// 缺陷详细页
/// </summary>
public class GetMonitorAlarmC3Form : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        string type = HttpContext.Current.Request["type"];

        switch (type)
        {
            case "set"://设置缺陷帧
                SetAlarmFrame(context);
                break;
            case "map":
                SaveMapImage();
                break;
            case "dev"://获取设备部件
                GetAlarmDev(context);
                break;
            case "total"://获取报警详情页完整数据
                GetAlarmJsonTotal(context);
                break;
            case "update"://详情页加载完成后进行更新操作
                updateAlarm(context);
                break;
            //case "Gif"://设置缺陷帧
            //    SetAlarmGif(context);
            //    break;
            case "lock":
                LockAlarm(context);
                break;
            case "unlock":
                UnlockAlarm(context);
                break;
            case "trans":
                SetTransByPerson(context);//设置手动转发情况
                break;
            case "history":
                QueryAlarmHis(context);//查询报警修改历史
                break;
            case "ReportStatus":
                setReportStatus(context);
                break;
            case "StaggerSelect":
                getStaggerGroup();//选择多组拉出值
                break;
            case "getStaggerByPerson":
                getStaggerByPerson();//获取拉出值中心点坐标及图像比例
                break;
            //case "CalculateStagger":
            //    calculateStagger();//存储手动计算拉出值
            //    break;
            case "setall"://设置缺陷帧
                SetAlarmFrameAll(context);
                break;
            case "rerun"://重解析
                ReRun();
                break;
            case "getTemper":
                getTemper();
                break;
            //case "Pole_strct":
            //    GetPoleStrct(context);
            //    break;
            default://缺陷详细json
                GetAlarmJson(context);
                break;
        }
    }
    public void setReportStatus(HttpContext context)
    {
        string alarmid = context.Request["alarmid"];
        bool sign = false;
        try
        {
            if (!string.IsNullOrEmpty(alarmid))
            {
                Api.ServiceAccessor.GetAlarmService().updateReportDBForce(alarmid);
                sign = true;
            }
        }
        catch (Exception)
        {

            throw;
        }
        HttpContext.Current.Response.Write(sign);

    }

    /// <summary>
    /// 详细页加载时异步读取百度地图图片保存到服务器
    /// </summary>
    public void SaveMapImage()
    {
        string alarmid = HttpContext.Current.Request["alarmid"];//缺陷ID

        C3_Alarm c3Alarm = Api.ServiceAccessor.GetAlarmService().getC3Alarm_Aux(alarmid);
        System.Data.DataSet ds = DbHelperOra.Query("SELECT T.ID,T.VIRTUAL_DIR_NAME,T.PHYSICAL_DIR_PATH,T.STRAT_USE_DATE FROM VIRTUAL_DIR_INFO T ORDER BY STRAT_USE_DATE DESC");
        string ftpName = "FtpRoot";

        string rootDirPath = @"E:\6CFiles";

        if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
        {
            rootDirPath = Convert.ToString(ds.Tables[0].Rows[0]["PHYSICAL_DIR_PATH"]);
            ftpName = Convert.ToString(ds.Tables[0].Rows[0]["VIRTUAL_DIR_NAME"]);
        }

        string filePath = rootDirPath + "/3C" + "/" + c3Alarm.DETECT_DEVICE_CODE + "/" + c3Alarm.RAISED_TIME.ToString("yyyy-MM-dd") + "/" + c3Alarm.ID;
        //string filePath = rootDirPath + "\\3C" + "\\" + c3Alarm.DETECT_DEVICE_CODE + "\\" + c3Alarm.RAISED_TIME.ToString("yyyy-MM-dd") + "\\" + c3Alarm.ID;

        if (!Directory.Exists(filePath))
        {
            Directory.CreateDirectory(filePath);
        }
        string fileName = filePath + "/" + c3Alarm.ID + ".jpg";

        if (!File.Exists(fileName) || c3Alarm.Alarm_Aux == null)
        {
            try
            {
                //通过参数表取出地图图层
                string map_layer = Api.ServiceAccessor.GetParamterService().getParamterByKey("MapLayer");
                map_layer = string.IsNullOrEmpty(map_layer) ? "" : map_layer;
                string gis_url = string.Format("http://api.map.baidu.com/staticimage?width=400&height=200&center=&markers={0},{1}&zoom={2}&markerStyles=s,A,0xff0000", c3Alarm.GIS_X, c3Alarm.GIS_Y, map_layer);
                System.Net.WebClient client = new System.Net.WebClient();
                client.DownloadFile(gis_url, fileName);
                Alarm_AUX alarm_aux;
                if (c3Alarm.Alarm_Aux != null)
                {
                    alarm_aux = c3Alarm.Alarm_Aux;
                }
                else
                {
                    alarm_aux = new Alarm_AUX();
                }
                alarm_aux.ALARM_ID = alarmid;
                alarm_aux.BMI_FILE_NAME = "/" + fileName.Replace(rootDirPath, ftpName);
                //如果附加信息存在却没有图片则修改附加信息表
                if (c3Alarm.Alarm_Aux != null)
                {
                    //alarm_aux.AUX_ID = c3Alarm.Alarm_Aux.AUX_ID;
                    Api.ServiceAccessor.GetAlarmService().updateAlarm_Aux(alarm_aux);//修改附加信息
                }
                else
                {
                    Api.ServiceAccessor.GetAlarmService().addAlarm_Aux(alarm_aux);//添加附加信息
                }
            }
            catch
            {

            }
        }

    }

    /// <summary>
    /// 得到缺陷详细页使用的json对象
    /// </summary>
    public void GetAlarmJson(HttpContext context)
    {
        //C3_AlarmCond cd = new C3_AlarmCond();
        //cd.ID = "ff371f5a72b547d08a176a51f3a76ee8";
        //List<C3_Alarm> a = Api.ServiceAccessor.GetAlarmService().getC3Alarm_Aux(cd);
        //C3_Alarm b = Api.ServiceAccessor.GetAlarmService().getC3Alarm_Aux(

        string alarmid = HttpContext.Current.Request["alarmid"];//缺陷ID
                                                                //string result = null;
        System.Text.StringBuilder result = new System.Text.StringBuilder();

        try
        {
            //查询C3
            //C3_Alarm c3Alarm = Api.ServiceAccessor.GetAlarmService().getC3Alarm(alarmid);
            C3_Alarm c3Alarm = Api.ServiceAccessor.GetAlarmService().getC3Alarm_Aux(alarmid);

            if (c3Alarm.GIS_X == 0 && c3Alarm.GIS_X_O > 0)
            {
                string bPoint = CoordinateConvert.convert2B(c3Alarm.GIS_X_O.ToString(), c3Alarm.GIS_Y_O.ToString());
                if (bPoint != null)
                {
                    if (bPoint.Split(',')[0] != "0" && bPoint.Split(',')[0] != "")
                    {
                        //   Json.Append("{\"GIS_X\":\"" + bPoint.Split(',')[0] + "\",\"GIS_Y\":\"" + bPoint.Split(',')[1] + "\"},");
                        c3Alarm.GIS_X = Convert.ToDouble(bPoint.Split(',')[0]);
                        c3Alarm.GIS_Y = Convert.ToDouble(bPoint.Split(',')[1]);


                        Alarm_Original.UpdateGPS(c3Alarm);

                        //     Api.ServiceAccessor.GetAlarmService().updateC3Alarm(c3Alarm);
                        //  alarmlist_waitUpdate.Add(alarmlist[i]);

                    }
                }
            }
            //为1时表示要进行预加载操作
            string IS_LOADBMI = "", IS_LOADRPT = "";
            if (c3Alarm.Alarm_Aux != null)
            {
                //地图
                if (string.IsNullOrEmpty(c3Alarm.Alarm_Aux.BMI_FILE_NAME) || !File.Exists(HttpContext.Current.Server.MapPath("~" + c3Alarm.Alarm_Aux.BMI_FILE_NAME)))
                {
                    IS_LOADBMI = "1";
                }
                //报告
                if (string.IsNullOrEmpty(c3Alarm.Alarm_Aux.RPT_FILE_NAME) || !File.Exists(HttpContext.Current.Server.MapPath("~" + c3Alarm.Alarm_Aux.RPT_FILE_NAME)))
                {
                    IS_LOADRPT = "1";
                }
            }
            else { IS_LOADBMI = "1"; IS_LOADRPT = "1"; }



            string REP_COUNT = "";
            string c3Show = "c3false"; //c3图片是否显示
            string c3IMA = "";//红外图片名
            if (!string.IsNullOrEmpty(c3Alarm.SNAPPED_JPG))
            {
                c3Show = "c3true";
                c3IMA = c3Alarm.SNAPPED_IMA.Replace(".IMA", "_IRV.jpg");
            }


            string SPEED = myfiter.GetSpeed(c3Alarm.SPEED);
            string LINE_NAME = "";//位置信息中已存在，此属性未使用，不赋值
            string StationD = "";//位置信息中已存在，此属性未使用，不赋值

            string KM = "";//公里标
            if (PublicMethod.KmtoString(c3Alarm.KM_MARK) != "0")
            {
                KM = PublicMethod.KmtoString(c3Alarm.KM_MARK);
            }


            if (c3Alarm.Alarm_Aux != null)
            {
                if (c3Alarm.SVALUE15 == "重复报警")
                {
                    REP_COUNT = c3Alarm.Alarm_Aux.ALARM_REP_COUNT == 0 ? "" : "<a  class='label' style='background-color:red;' href=javascript:goRepeate('" + c3Alarm.ID + "','" + c3Alarm.ID + "')>最新重复 " + c3Alarm.Alarm_Aux.ALARM_REP_COUNT + " 次</a>";
                }
                else
                {
                    REP_COUNT = c3Alarm.Alarm_Aux.ALARM_REP_COUNT == 0 ? "" : "<a  class='label' style='background-color:#987B40;' href=javascript:goRepeate('" + c3Alarm.ID + "','" + c3Alarm.SVALUE15 + "')>历史重复 " + c3Alarm.Alarm_Aux.ALARM_REP_COUNT + " 次</a>";
                }
            }

            //string wz = REP_COUNT + PublicMethod.GetPositionByAlarmid(c3Alarm);//位置信息
            string wz = PublicMethod.GetPosition_Alarm(c3Alarm.LINE_NAME, c3Alarm.POSITION_NAME, c3Alarm.BRG_TUN_NAME, c3Alarm.DIRECTION, c3Alarm.KM_MARK, c3Alarm.POLE_NUMBER, c3Alarm.DEVICE_ID, c3Alarm.ROUTING_NO, c3Alarm.AREA_NO, c3Alarm.STATION_NO, c3Alarm.STATION_NAME, c3Alarm.TAX_MONITOR_STATUS);//位置信息
            string delay_hw = "";
            string delay_vi = "";
            string delay_all1 = "";
            string delay_all2 = "";
            string delay_file = "";//同步文件 

            if (c3Alarm.IRV_RECV_TIME != null)
            {
                delay_hw = GetDelay(c3Alarm.IRV_RECV_TIME, c3Alarm.RAISED_TIME);
            }

            if (c3Alarm.VI_RECV_TIME != null)
            {
                delay_vi = GetDelay(c3Alarm.VI_RECV_TIME, c3Alarm.RAISED_TIME);
            }

            if (c3Alarm.DVALUE4 != null)
            {
                delay_all1 = GetDelay(c3Alarm.DVALUE4, c3Alarm.RAISED_TIME);
            }

            if (c3Alarm.DVALUE5 != null)
            {
                delay_all2 = GetDelay(c3Alarm.DVALUE5, c3Alarm.RAISED_TIME);
            }

            if (c3Alarm.DVALUE1 != null)
            {
                delay_file = GetDelay(c3Alarm.DVALUE1, c3Alarm.RAISED_TIME);
            }



            Locomotive m_loco = Common.getLocomotiveInfo(c3Alarm.DETECT_DEVICE_CODE);

            result.Append("{");
            result.Append("\"IS_LOADBMI\":\"" + IS_LOADBMI + "\",");//地图
            result.Append("\"IS_LOADRPT\":\"" + IS_LOADRPT + "\",");//报告
            result.Append("\"dtime_hw\":\"" + c3Alarm.IRV_RECV_TIME + "\",");//上报延时
            result.Append("\"delay_hw\":\"" + delay_hw + "\",");//上报延时

            result.Append("\"dtime_vi\":\"" + c3Alarm.VI_RECV_TIME + "\",");//上报延时
            result.Append("\"delay_vi\":\"" + delay_vi + "\",");//上报延时

            result.Append("\"dtime_all1\":\"" + c3Alarm.DVALUE4 + "\",");//上报延时
            result.Append("\"delay_all1\":\"" + delay_all1 + "\",");//上报延时

            result.Append("\"dtime_all2\":\"" + c3Alarm.DVALUE5 + "\",");//上报延时
            result.Append("\"delay_all2\":\"" + delay_all2 + "\",");//上报延时

            result.Append("\"dtime_file\":\"" + c3Alarm.DVALUE1 + "\",");//上报延时
            result.Append("\"delay_file\":\"" + delay_file + "\",");//上报延时



            result.Append("\"SNAPPED_IMA\":\"" + PublicMethod.C3FtpRoot + "/" + c3Alarm.DIR_PATH + c3IMA + "\","); //红外图片
            result.Append("\"SNAPPED_JPG\":\"" + PublicMethod.C3FtpRoot + "/" + c3Alarm.DIR_PATH + c3Alarm.SNAPPED_JPG + "\",");//可见光

            string dir = c3Alarm.DIR_PATH.Contains("FtpRoot") ? "/" + c3Alarm.DIR_PATH : "/FtpRoot/" + c3Alarm.DIR_PATH;
            result.Append("\"hw\":\"" + dir + c3Alarm.SVALUE11 + "\",");//IRV
            result.Append("\"kjg\":\"" + dir + c3Alarm.SVALUE5 + "\",");//IRV
            result.Append("\"allimg\":\"" + dir + c3Alarm.SVALUE9 + "\",");//IRV

            result.Append("\"c3Show\":\"" + c3Show + "\",");//c3图片是否存在
            result.Append("\"xj\":\"" + c3Alarm.SATELLITE_NUM + "\",");//卫星数量
            result.Append("\"DEVICE_ID\":\"" + c3Alarm.DEVICE_ID + "\",");//DEVICE_ID
            result.Append("\"CROSSING_NO\":\"" + c3Alarm.ROUTING_NO + "\",");//交路号
            result.Append("\"SPEED\":\"" + SPEED + "\",");//速度
            result.Append("\"WENDU\":\"" + myfiter.GetTEMP(c3Alarm.MAX_TEMP, "℃") + "\",");//最大红外温度
            result.Append("\"HJWENDU\":\"" + myfiter.GetTEMP(c3Alarm.ENV_TEMP, "℃") + "\",");//环境温度
            result.Append("\"LINE_HEIGHT\":\"" + myfiter.GetLINE_HEIGHT(c3Alarm) + "\",");//导高
            result.Append("\"PULLING_VALUE\":\"" + myfiter.GetPULLING_VALUE(c3Alarm) + "\",");//拉出
            result.Append("\"AREA_SECTION\":\"" + c3Alarm.AREA_NO + "\",");//运用区段
            result.Append("\"STATION_NO\":\"" + StationD + "\",");//车站号
            result.Append("\"TRAIN_NO\":\"" + c3Alarm.TRAIN_NO + "\",");//车站郝
            result.Append("\"LINE_NAME\":\"" + LINE_NAME + "\",");//线路
            result.Append("\"wz\":\"" + wz + "\",");//位置 
            result.Append("\"wz_fz\":\"" + c3Alarm.SVALUE10 + "\",");//辅助位置 

            string dutyRange = "";
            PublicMethod.GetDutyRange(c3Alarm.ORG_CODE, ref dutyRange);
            result.Append("\"DUTY_RANGE\":\"" + (dutyRange == "" ? "" : "(" + dutyRange + ")") + "\",");//局
            Locomotive loc = Api.Util.Common.getLocomotiveInfo(c3Alarm.DETECT_DEVICE_CODE);
            result.Append("\"PSD\":\"" + loc.P_ORG_NAME + "\",");//配属段
            result.Append("\"GSD\":\"" + loc.ORG_NAME + "\",");//归属段

            result.Append("\"JU\":\"" + c3Alarm.BUREAU_NAME + "\",");//局
            result.Append("\"GDD\":\"" + c3Alarm.POWER_SECTION_NAME + "\",");//供电段
            result.Append("\"JWD\":\"" + c3Alarm.P_ORG_NAME + "\",");//机务段
            result.Append("\"LINE\":\"" + c3Alarm.LINE_NAME + "\",");//线路
            result.Append("\"JUCODE\":\"" + c3Alarm.BUREAU_CODE + "\",");//局CODE
            result.Append("\"CJ\":\"" + c3Alarm.WORKSHOP_NAME + "\",");//供电车间
            result.Append("\"BZ\":\"" + c3Alarm.ORG_NAME + "\", ");//班组
            result.Append("\"QZ\":\"" + c3Alarm.POSITION_NAME + "\", ");//工区
            result.Append("\"DIRECTION\":\"" + c3Alarm.DIRECTION + "\", ");//行别
            result.Append("\"BRIDGE_TUNNEL_NO\":\"" + c3Alarm.BRG_TUN_CODE + "\", ");//桥隧
            result.Append("\"POLE_NUMBER\":\"" + c3Alarm.POLE_NUMBER + "\", ");//支柱
            result.Append("\"KM\":\"" + KM + "\", ");//公里标
            result.Append("\"GIS_X\":\"" + c3Alarm.GIS_X + "\", ");//X
            result.Append("\"GIS_Y\":\"" + c3Alarm.GIS_Y + "\", ");//Y
            result.Append("\"GIS_X_O\":\"" + c3Alarm.GIS_X_O + "\", ");//X
            result.Append("\"GIS_Y_O\":\"" + c3Alarm.GIS_Y_O + "\", ");//Y
            result.Append("\"SUMMARYDIC\":\"" + c3Alarm.CODE_NAME + "\", ");//故障类型
            result.Append("\"SUMMARYDICCODE\":\"" + c3Alarm.CODE + "\", ");//故障类型code
            result.Append("\"BOW_TYPE\":\"" + c3Alarm.BOW_TYPE + "\", ");//弓位置
            result.Append("\"DRIVER_NUMBER\":\"" + c3Alarm.DRIVER_NO + "\", ");//司机号
            result.Append("\"DETAIL\":\"" + c3Alarm.DETAIL + "\", ");//描述
            if (string.IsNullOrEmpty(c3Alarm.STATUS_NAME))
            {
                result.Append("\"STATUSDIC\":\"" + "" + "\", ");//状态
            }
            else
            {
                result.Append("\"STATUSDIC\":\"" + c3Alarm.STATUS_NAME.Trim() + "\", ");//状态
            }
            result.Append("\"REPORT_DATE\":\"" + c3Alarm.REPORT_DATE + "\", ");//报告时间
            result.Append("\"RAISED_TIME\":\"" + c3Alarm.RAISED_TIME.ToString("yyyy-MM-dd HH:mm:ss") + "\", ");//发生时间
            result.Append("\"STATUS_TIME\":\"" + c3Alarm.STATUS_TIME + "\", ");//状态变化时间
            result.Append("\"LOCNO\":\"" + c3Alarm.DETECT_DEVICE_CODE + "\", ");//设备编号
            result.Append("\"VENDOR\":\"" + c3Alarm.VENDOR + "\", ");//设备厂商K
            result.Append("\"ALARM_ANALYSIS\":\"" + myfiter.json_RemoveSpecialStr_item_double(c3Alarm.ALARM_ANALYSIS) + "\", ");//缺陷分析
            result.Append("\"PROPOSAL\":\"" + c3Alarm.PROPOSAL + "\", ");//处理建议
            result.Append("\"REMARK\":\"" + c3Alarm.REMARK + "\", ");//备注
            result.Append("\"REPORT_PERSON\":\"" + c3Alarm.REPORT_PERSON + "\", ");//报告人
            result.Append("\"SEVERITY\":\"" + c3Alarm.SEVERITY + "\", ");//级别
            result.Append("\"SEVERITY_CODE\":\"" + c3Alarm.MY_STR_8 + "\", ");//级别
            result.Append("\"Loco_JU\":\"" + m_loco.BUREAU_NAME + "\", ");//车子的局
            result.Append("\"CUST_ALARM_CODE\":\"" + c3Alarm.CUST_ALARM_CODE + "\", ");//报警编码
            result.Append("\"IS_TYPICAL\":\"" + c3Alarm.IS_TYPICAL + "\", "); //典型缺陷
            result.Append("\"ID\":\"" + c3Alarm.ID + "\", "); //报警ID

            Api.Task.entity.MisTask misTask = GetTask(alarmid);
            string MisShow = "false";
            if (misTask != null)
            {
                Api.Foundation.entity.Foundation.LoginUser m22 = Api.Util.Public.GetCurrentUser();

                if (misTask.STATUS != "完成" && misTask.STATUS != "取消")
                {
                    if (!string.IsNullOrEmpty(misTask.RECV_DEPT))
                    {
                        if (Regex.IsMatch(misTask.RECV_DEPT, (m22.ORG_CODE + "$|" + m22.ORG_CODE + ",")))
                            MisShow = "false";
                        else
                        {
                            if (!string.IsNullOrEmpty(Public.GetUser_PermissionOrg))
                            {
                                if (Public.GetUser_PermissionOrg.Contains(misTask.RECV_DEPT))
                                    MisShow = "false";
                                else
                                    MisShow = "true";
                            }
                        }
                    }
                }
                else
                    MisShow = "true";

                result.Append("\"MISID\":\"" + misTask.ID + "\", ");//任务主键  
            }

            result.Append("\"MisShow\":\"" + MisShow + "\", \"PersonName\":\"" + Public.GetPersonName + "\" }");//是否有任务

            string re = myfiter.json_RemoveSpecialStr_N(result.ToString());

            context.Response.Write(Newtonsoft.Json.JsonConvert.DeserializeObject(re));
            //    context.Response.End();

        }
        catch (Exception ex)
        {
            log4net.ILog log2 = log4net.LogManager.GetLogger("读取C3详细页信息");
            log2.Error("Error", ex);
        }
    }
    /// <summary>
    /// 得到缺陷详细页使用的json对象，使用Alarm实体
    /// </summary>
    public void GetAlarm_aJson(HttpContext context)
    {
        //C3_AlarmCond cd = new C3_AlarmCond();
        //cd.ID = "ff371f5a72b547d08a176a51f3a76ee8";
        //List<C3_Alarm> a = Api.ServiceAccessor.GetAlarmService().getC3Alarm_Aux(cd);
        //C3_Alarm b = Api.ServiceAccessor.GetAlarmService().getC3Alarm_Aux(

        string alarmid = HttpContext.Current.Request["alarmid"];//缺陷ID
        C3_AlarmCond alarmcond = new C3_AlarmCond();
        alarmcond.ID = alarmid;
        //string result = null;
        System.Text.StringBuilder result = new System.Text.StringBuilder();
        JavaScriptSerializer jss = new JavaScriptSerializer();

        try
        {
            //查询C3
            //C3_Alarm c3Alarm = Api.ServiceAccessor.GetAlarmService().getC3Alarm(alarmid);
            Alarm Alarm = Api.ServiceAccessor.GetAlarmService().GetAlarmDetail(alarmcond);

            if (Alarm.GIS_X == 0 && Convert.ToDouble(Alarm.GIS_X_O) > 0)
            {
                string bPoint = CoordinateConvert.convert2B(Alarm.GIS_X_O.ToString(), Alarm.GIS_Y_O.ToString());
                if (bPoint != null)
                {
                    if (bPoint.Split(',')[0] != "0" && bPoint.Split(',')[0] != "")
                    {
                        //   Json.Append("{\"GIS_X\":\"" + bPoint.Split(',')[0] + "\",\"GIS_Y\":\"" + bPoint.Split(',')[1] + "\"},");
                        Alarm.GIS_X = Convert.ToDouble(bPoint.Split(',')[0]);
                        Alarm.GIS_Y = Convert.ToDouble(bPoint.Split(',')[1]);


                        Alarm_Original.UpdateGPS(Alarm);

                        //     Api.ServiceAccessor.GetAlarmService().updateC3Alarm(c3Alarm);
                        //  alarmlist_waitUpdate.Add(alarmlist[i]);

                    }
                }
            }
            //为1时表示要进行预加载操作
            string IS_LOADBMI = "", IS_LOADRPT = "";
            if (Alarm.Alarm_Aux != null)
            {
                //地图
                if (string.IsNullOrEmpty(Alarm.Alarm_Aux.BMI_FILE_NAME) || !File.Exists(HttpContext.Current.Server.MapPath("~" + Alarm.Alarm_Aux.BMI_FILE_NAME)))
                {
                    IS_LOADBMI = "1";
                }
                //报告
                if (string.IsNullOrEmpty(Alarm.Alarm_Aux.RPT_FILE_NAME) || !File.Exists(HttpContext.Current.Server.MapPath("~" + Alarm.Alarm_Aux.RPT_FILE_NAME)))
                {
                    IS_LOADRPT = "1";
                }
            }
            else { IS_LOADBMI = "1"; IS_LOADRPT = "1"; }



            string REP_COUNT = "";
            string c3Show = "c3false"; //c3图片是否显示
            string c3IMA = "";//红外图片名
            if (!string.IsNullOrEmpty(Alarm.SVALUE11))
            {
                c3Show = "c3true";
                c3IMA = Alarm.SVALUE11.Replace(".IMA", "_IRV.jpg");
            }


            string SPEED = myfiter.GetSpeed(Alarm.NVALUE7);
            string LINE_NAME = "";//位置信息中已存在，此属性未使用，不赋值
            string StationD = "";//位置信息中已存在，此属性未使用，不赋值

            string KM = "";//公里标
            if (PublicMethod.KmtoString(Alarm.KM_MARK) != "0")
            {
                KM = PublicMethod.KmtoString(Alarm.KM_MARK);
            }


            if (Alarm.Alarm_Aux != null)
            {
                if (Alarm.SVALUE15 == "重复报警")
                {
                    REP_COUNT = Alarm.Alarm_Aux.ALARM_REP_COUNT == 0 ? "" : "<a  class='label' style='background-color:red;' href=javascript:goRepeate('" + Alarm.ID + "','" + Alarm.ID + "')>最新重复 " + Alarm.Alarm_Aux.ALARM_REP_COUNT + " 次</a>";
                }
                else
                {
                    REP_COUNT = Alarm.Alarm_Aux.ALARM_REP_COUNT == 0 ? "" : "<a  class='label' style='background-color:#987B40;' href=javascript:goRepeate('" + Alarm.ID + "','" + Alarm.SVALUE15 + "')>历史重复 " + Alarm.Alarm_Aux.ALARM_REP_COUNT + " 次</a>";
                }
            }

            string wz = REP_COUNT + PublicMethod.GetPositionByAlarmid(Alarm);//位置信息
            string delay_hw = "";
            string delay_vi = "";
            string delay_all1 = "";
            string delay_all2 = "";
            string delay_file = "";//同步文件 

            if (Alarm.DVALUE2 != null)//收到红外的时间
            {
                delay_hw = GetDelay(Alarm.DVALUE2, Alarm.RAISED_TIME);
            }

            if (Alarm.DVALUE3 != null)//可见光
            {
                delay_vi = GetDelay(Alarm.DVALUE3, Alarm.RAISED_TIME);
            }

            if (Alarm.DVALUE4 != null)
            {
                delay_all1 = GetDelay(Alarm.DVALUE4, Alarm.RAISED_TIME);
            }

            if (Alarm.DVALUE5 != null)
            {
                delay_all2 = GetDelay(Alarm.DVALUE5, Alarm.RAISED_TIME);
            }

            if (Alarm.DVALUE1 != null)
            {
                delay_file = GetDelay(Alarm.DVALUE1, Alarm.RAISED_TIME);
            }



            Locomotive m_loco = Common.getLocomotiveInfo(Alarm.DETECT_DEVICE_CODE);

            result.Append("{");
            result.Append("\"IS_LOADBMI\":\"" + IS_LOADBMI + "\",");//地图
            result.Append("\"IS_LOADRPT\":\"" + IS_LOADRPT + "\",");//报告
            result.Append("\"dtime_hw\":\"" + Alarm.DVALUE2 + "\",");//上报延时
            result.Append("\"delay_hw\":\"" + delay_hw + "\",");//上报延时

            result.Append("\"dtime_vi\":\"" + Alarm.DVALUE3 + "\",");//上报延时
            result.Append("\"delay_vi\":\"" + delay_vi + "\",");//上报延时

            result.Append("\"dtime_all1\":\"" + Alarm.DVALUE4 + "\",");//上报延时
            result.Append("\"delay_all1\":\"" + delay_all1 + "\",");//上报延时

            result.Append("\"dtime_all2\":\"" + Alarm.DVALUE5 + "\",");//上报延时
            result.Append("\"delay_all2\":\"" + delay_all2 + "\",");//上报延时

            result.Append("\"dtime_file\":\"" + Alarm.DVALUE1 + "\",");//上报延时
            result.Append("\"delay_file\":\"" + delay_file + "\",");//上报延时



            result.Append("\"SNAPPED_IMA\":\"" + PublicMethod.C3FtpRoot + "/" + Alarm.DIR_PATH + c3IMA + "\","); //红外图片
            result.Append("\"SNAPPED_JPG\":\"" + PublicMethod.C3FtpRoot + "/" + Alarm.DIR_PATH + Alarm.SVALUE5 + "\",");//可见光

            string dir = Alarm.DIR_PATH.Contains("FtpRoot") ? "/" + Alarm.DIR_PATH : "/FtpRoot/" + Alarm.DIR_PATH;
            result.Append("\"IRV\":\"" + dir + Alarm.SVALUE1 + "\",");//IRV


            result.Append("\"c3Show\":\"" + c3Show + "\",");//c3图片是否存在
            result.Append("\"xj\":\"" + Alarm.NVALUE6 + "\",");//卫星数量
            result.Append("\"DEVICE_ID\":\"" + Alarm.DEVICE_ID + "\",");//DEVICE_ID
            result.Append("\"CROSSING_NO\":\"" + Alarm.ROUTING_NO + "\",");//交路号
            result.Append("\"SPEED\":\"" + SPEED + "\",");//速度
            result.Append("\"WENDU\":\"" + myfiter.GetTEMP(Alarm.NVALUE4, "℃") + "\",");//最大红外温度
            result.Append("\"HJWENDU\":\"" + myfiter.GetTEMP(Alarm.NVALUE5, "℃") + "\",");//环境温度
            result.Append("\"LINE_HEIGHT\":\"" + myfiter.GetLINE_HEIGHT(Alarm) + "\",");//导高
            result.Append("\"PULLING_VALUE\":\"" + myfiter.GetPULLING_VALUE(Alarm) + "\",");//拉出
            result.Append("\"AREA_SECTION\":\"" + Alarm.AREA_NO + "\",");//运用区段
            result.Append("\"STATION_NO\":\"" + StationD + "\",");//车站号
            if (!string.IsNullOrEmpty(Alarm.SVALUE12))
            {
                TaxExtraInfo ti = jss.Deserialize<TaxExtraInfo>(Alarm.SVALUE12);
                result.Append("\"TRAIN_NO\":\"" + ti.TRAIN_NO.ToString() + "\",");//车站郝
            }
            else
            {
                result.Append("\"TRAIN_NO\":\"" + "" + "\",");//车站郝
            }
            result.Append("\"LINE_NAME\":\"" + LINE_NAME + "\",");//线路
            result.Append("\"wz\":\"" + wz + "\",");//位置 
            result.Append("\"wz_fz\":\"" + Alarm.SVALUE10 + "\",");//辅助位置 

            string dutyRange = "";
            PublicMethod.GetDutyRange(Alarm.ORG_CODE, ref dutyRange);
            result.Append("\"DUTY_RANGE\":\"" + (dutyRange == "" ? "" : "(" + dutyRange + ")") + "\",");//局
            Locomotive loc = Api.Util.Common.getLocomotiveInfo(Alarm.DETECT_DEVICE_CODE);
            result.Append("\"PSD\":\"" + loc.P_ORG_NAME + "\",");//配属段
            result.Append("\"GSD\":\"" + loc.ORG_NAME + "\",");//归属段

            result.Append("\"JU\":\"" + Alarm.BUREAU_NAME + "\",");//局
            result.Append("\"GDD\":\"" + Alarm.POWER_SECTION_NAME + "\",");//供电段
            result.Append("\"JWD\":\"" + Alarm.P_ORG_NAME + "\",");//机务段
            result.Append("\"LINE\":\"" + Alarm.LINE_NAME + "\",");//线路
            result.Append("\"JUCODE\":\"" + Alarm.BUREAU_CODE + "\",");//局CODE
            result.Append("\"CJ\":\"" + Alarm.WORKSHOP_NAME + "\",");//供电车间
            result.Append("\"BZ\":\"" + Alarm.ORG_NAME + "\", ");//班组
            result.Append("\"QZ\":\"" + Alarm.POSITION_NAME + "\", ");//工区
            result.Append("\"DIRECTION\":\"" + Alarm.DIRECTION + "\", ");//行别
            result.Append("\"BRIDGE_TUNNEL_NO\":\"" + Alarm.BRG_TUN_CODE + "\", ");//桥隧
            result.Append("\"POLE_NUMBER\":\"" + Alarm.POLE_NUMBER + "\", ");//支柱
            result.Append("\"KM\":\"" + KM + "\", ");//公里标  
            result.Append("\"GIS_X\":\"" + Alarm.GIS_X + "\", ");//X
            result.Append("\"GIS_Y\":\"" + Alarm.GIS_Y + "\", ");//Y
            result.Append("\"GIS_X_O\":\"" + Alarm.GIS_X_O + "\", ");//X
            result.Append("\"GIS_Y_O\":\"" + Alarm.GIS_Y_O + "\", ");//Y
            result.Append("\"SUMMARYDIC\":\"" + Alarm.CODE_NAME + "\", ");//故障类型
            result.Append("\"SUMMARYDICCODE\":\"" + Alarm.CODE + "\", ");//故障类型code
            result.Append("\"BOW_TYPE\":\"" + Alarm.SVALUE8 + "\", ");//弓位置
            if (!string.IsNullOrEmpty(Alarm.SVALUE12))
            {
                TaxExtraInfo ti = jss.Deserialize<TaxExtraInfo>(Alarm.SVALUE12);
                result.Append("\"DRIVER_NUMBER\":\"" + ti.DRIVER_NO.ToString() + "\",");//司机号
            }
            else
            {
                result.Append("\"DRIVER_NUMBER\":\"" + "" + "\",");//司机号
            }
            result.Append("\"DETAIL\":\"" + Alarm.DETAIL + "\", ");//描述
            result.Append("\"STATUSDIC\":\"" + Alarm.STATUS_NAME.Trim() + "\", ");//状态
            result.Append("\"REPORT_DATE\":\"" + Alarm.REPORT_DATE + "\", ");//报告时间
            result.Append("\"RAISED_TIME\":\"" + Alarm.RAISED_TIME.ToString("yyyy-MM-dd HH:mm:ss") + "\", ");//发生时间
            result.Append("\"STATUS_TIME\":\"" + Alarm.STATUS_TIME + "\", ");//状态变化时间
            result.Append("\"LOCNO\":\"" + Alarm.DETECT_DEVICE_CODE + "\", ");//设备编号
            result.Append("\"VENDOR\":\"" + Alarm.VENDOR + "\", ");//设备厂商
            result.Append("\"ALARM_ANALYSIS\":\"" + myfiter.json_RemoveSpecialStr_item_double(Alarm.ALARM_ANALYSIS) + "\", ");//缺陷分析
            result.Append("\"PROPOSAL\":\"" + Alarm.PROPOSAL + "\", ");//处理建议
            result.Append("\"REMARK\":\"" + Alarm.REMARK + "\", ");//备注
            result.Append("\"REPORT_PERSON\":\"" + Alarm.REPORT_PERSON + "\", ");//报告人
            if (Alarm.SEVERITY.Equals("一类"))
            {
                result.Append("\"SEVERITY\":\"" + "三类" + "\", ");//级别
            }
            else if (Alarm.SEVERITY.Equals("三类"))
            {
                result.Append("\"SEVERITY\":\"" + "一类" + "\", ");//级别
            }
            else
            {
                result.Append("\"SEVERITY\":\"" + Alarm.SEVERITY + "\", ");//级别
            }
            result.Append("\"SEVERITY_CODE\":\"" + Alarm.SEVERITY + "\", ");//级别
            result.Append("\"Loco_JU\":\"" + m_loco.BUREAU_NAME + "\", ");//车子的局
            result.Append("\"CUST_ALARM_CODE\":\"" + Alarm.CUST_ALARM_CODE + "\", ");//报警编码
            result.Append("\"IS_TYPICAL\":\"" + Alarm.IS_TYPICAL + "\", "); //典型缺陷
            result.Append("\"ID\":\"" + Alarm.ID + "\", "); //报警ID

            Api.Task.entity.MisTask misTask = GetTask(alarmid);
            string MisShow = "false";
            if (misTask != null)
            {
                Api.Foundation.entity.Foundation.LoginUser m22 = Api.Util.Public.GetCurrentUser();

                if (misTask.STATUS != "完成" && misTask.STATUS != "取消")
                {
                    if (!string.IsNullOrEmpty(misTask.RECV_DEPT))
                    {
                        if (Regex.IsMatch(misTask.RECV_DEPT, (m22.ORG_CODE + "$|" + m22.ORG_CODE + ",")))
                            MisShow = "false";
                        else
                        {
                            if (!string.IsNullOrEmpty(Public.GetUser_PermissionOrg))
                            {
                                if (Public.GetUser_PermissionOrg.Contains(misTask.RECV_DEPT))
                                    MisShow = "false";
                                else
                                    MisShow = "true";
                            }
                        }
                    }
                }
                else
                    MisShow = "true";

                result.Append("\"MISID\":\"" + misTask.ID + "\", ");//任务主键  
            }

            result.Append("\"MisShow\":\"" + MisShow + "\", \"PersonName\":\"" + Public.GetPersonName + "\" }");//是否有任务

            string re = myfiter.json_RemoveSpecialStr_N(result.ToString());

            context.Response.Write(Newtonsoft.Json.JsonConvert.DeserializeObject(re));
            //    context.Response.End();

        }
        catch (Exception ex)
        {
            log4net.ILog log2 = log4net.LogManager.GetLogger("读取C3详细页信息");
            log2.Error("Error", ex);
        }
    }

    public string GetDelay(DateTime dtEnd, DateTime dtStart)
    {
        string re = "";
        TimeSpan ts1 = dtEnd - dtStart;
        if (ts1.Days > 0)
            re += ts1.Days + "天";

        if (ts1.Hours > 0)
            re += ts1.Hours + "小时";

        if (ts1.Minutes > 0)
            re += ts1.Minutes + "分";

        if (ts1.Seconds > 0)
        {
            re += ts1.Seconds + "秒";
        }
        return re;
    }

    /// <summary>
    /// 设置缺陷帧
    /// </summary>
    public void SetAlarmFrame(HttpContext context)
    {
        try
        {

            string alarmid = HttpContext.Current.Request["alarmid"];
            Alarm m = Api.ServiceAccessor.GetAlarmService().getAlarm(alarmid);
            string imgType = HttpContext.Current.Request["imgType"];
            int index = Convert.ToInt32(HttpContext.Current.Request["index"]);

            //将原始报警信息存入历史表
            bool history = Api.ServiceAccessor.GetAlarmService().InsertAlarmHis(alarmid);
            switch (imgType)
            {
                case "IR":
                    Api.ServiceAccessor.GetAlarmService().setFaultFrameIndex(alarmid, SharedDefinition.Definitions.VideoType.IR, index);
                    break;
                case "VI":
                    Api.ServiceAccessor.GetAlarmService().setFaultFrameIndex(alarmid, SharedDefinition.Definitions.VideoType.VI, index);
                    break;
                case "OA":
                    Api.ServiceAccessor.GetAlarmService().setFaultFrameIndex(alarmid, SharedDefinition.Definitions.VideoType.OA, index);
                    break;
                case "OB":
                    Api.ServiceAccessor.GetAlarmService().setFaultFrameIndex(alarmid, SharedDefinition.Definitions.VideoType.OB, index);
                    break;

            }
            if ((m.SEVERITY.Equals("一类") || m.SEVERITY.Equals("二类")) && (!m.STATUS.Equals("AFSTATUS01")) && (!m.STATUS.Equals("AFSTATUS02")))
            {

                Api.ServiceAccessor.GetAlarmService().updateReportDBForce(alarmid);
            }

        }
        catch (Exception ex)
        {
            log4net.ILog log2 = log4net.LogManager.GetLogger("设置缺陷帧");
            log2.Error("Error", ex);
        }
    }

    /// <summary>
    /// 获取缺陷关联任务
    /// </summary>
    /// <param name="alarmid"></param>
    /// <returns></returns>
    public Api.Task.entity.MisTask GetTask(string alarmid)
    {
        Api.Task.entity.MisTaskCond miscond = new Api.Task.entity.MisTaskCond();
        miscond.FAULTID = alarmid;
        miscond.orderBy = " SPONSOR_TIME DESC";
        List<Api.Task.entity.MisTask> misTasklist = Api.ServiceAccessor.GetTaskService().getMisTask(miscond);
        if (misTasklist.Count > 0)
        {
            Api.Task.entity.MisTask mistask = misTasklist[0];
            return mistask;
        }
        else
        {
            return null;
        }

    }

    /// <summary>
    /// 设置手动转发
    /// </summary>
    /// <param name="context"></param>
    public void SetTransByPerson(HttpContext context)
    {
        string alarmid = context.Request["alarmid"];//报警ID
        int t_severity = Convert.ToInt32(context.Request["tseverity"]);//转发优先级

        string updateSQL = String.Format(@"begin update alarm_aux aux set aux.is_trans_allowed={0} where aux.alarm_id='{1}' ;
                                           update trans_data t set t.is_trans_allowed={0} where t.id='{1}'; end;", t_severity, alarmid);
        int update_result = 0;
        int trans_result = 0;
        try
        {
            update_result = DbHelperOra.ExecuteSql(updateSQL);
            trans_result = Api.ServiceAccessor.GetAlarmService().UpdateTransData(alarmid);
        }
        catch (Exception ex)
        {
            log4net.ILog log = log4net.LogManager.GetLogger("手动转发缺陷设置出错");
            log.Error("执行出错", ex);
        }
        if (update_result > 0 && trans_result > 0)
        {
            HttpContext.Current.Response.Write("true");
        }
        else
        {
            HttpContext.Current.Response.Write("false");
        }

    }

    /// <summary>
    /// 查看报警修改历史
    /// </summary>
    /// <param name="context"></param>
    public void QueryAlarmHis(HttpContext context)
    {
        string alarmid = context.Request["alarmid"];//报警ID
        int pageSize = context.Request["pagesize"] == null ? 0 : Convert.ToInt32(context.Request["pagesize"]);//页面大小
        int pageIndex = context.Request["pageindex"] == null ? 0 : Convert.ToInt32(context.Request["pageindex"]);//当前页

        System.Data.DataSet ds1 = ADO.AlarmQuery.QueryAlarmByID(alarmid);//查询当前报警信息
        System.Data.DataSet ds2 = ADO.AlarmQuery.QueryAlarmHisByID(alarmid, pageSize, pageIndex);//查询报警修改历史

        if (ds1.Tables.Count == 0 || ds2.Tables.Count == 0 || ds1.Tables[0].Rows.Count == 0 || ds2.Tables[0].Rows.Count == 0)//两个结果集任一为0代表查询出错，ds1没有数据，代表查询出错，ds2行数为0，代表没有历史
        {
            return;
        }
        else
        {
            string value1 = null;
            string value2 = null;
            string columnname = null;
            StringBuilder json = new StringBuilder();
            json.Append("{\"data\":[");
            for (int i = 0; i < ds2.Tables[0].Rows.Count; i++)
            {
                if (i == 0 && pageIndex != 1)//非第一页的第一条数据不参与对比
                {
                    continue;
                }
                json.Append("{");
                json.Append("\"EDIT_PERSON\":");
                json.Append("\"" + ds2.Tables[0].Rows[i]["EDIT_PERSON"] + "\",");
                json.Append("\"EDIT_TIME\":");
                json.Append("\"" + ds2.Tables[0].Rows[i]["EDIT_TIME"] + "\",");
                json.Append("\"data\":[");
                for (int j = 1; j < ds1.Tables[0].Columns.Count; j++)//第一列均为ID，不用比，从第二列开始，列数以alarm表的列数为准
                {
                    if (j == 103 || j == 105 || j == 106)
                    {

                    }
                    if (i == 0 && pageIndex == 1)//判断为报警历史表中的第一条数据
                    {
                        value1 = ds2.Tables[0].Rows[i][j] == DBNull.Value ? null : ds2.Tables[0].Rows[i][j].ToString().Replace("%23", "#");//因为车组编码的问题，需要把URL中的%23转为#
                        string value1columnname = ds2.Tables[0].Columns[j].ColumnName.ToString();//获取列名
                        if (ds1.Tables[0].Columns.Contains(value1columnname))
                        {
                            value2 = ds1.Tables[0].Rows[0][value1columnname] == DBNull.Value ? null : ds1.Tables[0].Rows[0][value1columnname].ToString().Replace("%23", "#");//value2 为每次比较中较新的数据
                        }
                        else
                        {
                            value1 = null;
                            value2 = null;
                        }
                        //value2 = ds1.Tables[0].Rows[0][j] == DBNull.Value ? null : ds1.Tables[0].Rows[0][j].ToString().Replace("%23","#");//value2 为每次比较中较新的数据
                    }
                    else
                    {
                        value1 = ds2.Tables[0].Rows[i][j] == DBNull.Value ? null : ds2.Tables[0].Rows[i][j].ToString().Replace("%23", "#");
                        value2 = ds2.Tables[0].Rows[i - 1][j] == DBNull.Value ? null : ds2.Tables[0].Rows[i - 1][j].ToString().Replace("%23", "#");//value2 为每次比较中较新的数据
                    }
                    if ((value1 != value2) && (/*value1!=null &&*/value2 != "0001/1/1 0:00:00"))//过滤从控制修改为0001/1/1 0:00:00的情况
                    {
                        columnname = ds2.Tables[0].Columns[j].ColumnName.ToString();//获取列名
                        switch (columnname)//列名转换
                        {
                            case "DETECT_DEVICE_CODE":
                                json.Append("\"车号|");
                                break;
                            case "RAISED_TIME":
                                json.Append("\"发生时间|");
                                break;
                            case "DIRECTION":
                                json.Append("\"行别|");
                                break;
                            case "KM_MARK":
                                json.Append("\"公里标|");
                                break;
                            case "LINE_NAME":
                                json.Append("\"线路名|");
                                break;
                            case "POLE_NUMBER":
                                json.Append("\"支柱号|");
                                break;
                            case "BRG_TUN_NAME":
                                json.Append("\"桥隧名称|");
                                break;
                            case "POSITION_NAME":
                                json.Append("\"区站名称|");
                                break;
                            case "STATION_NAME":
                                json.Append("\"站点名称|");
                                break;
                            case "AREA_NO":
                                json.Append("\"运营区段|");
                                break;
                            case "ROUTING_NO":
                                json.Append("\"交路号|");
                                break;
                            case "STATUS_NAME":
                                json.Append("\"报警状态|");
                                break;
                            case "SEVERITY":
                                json.Append("\"报警级别|");
                                break;
                            case "CODE_NAME":
                                json.Append("\"报警类型|");
                                break;
                            case "ALARM_ANALYSIS":
                                json.Append("\"报警分析|");
                                break;
                            case "PROPOSAL":
                                json.Append("\"处理建议|");
                                break;
                            case "REPORT_PERSON":
                                json.Append("\"报告人|");
                                break;
                            case "report_date":
                                json.Append("\"报告时间|");
                                break;
                            case "ORG_NAME":
                                json.Append("\"报警所属段|");
                                break;
                            case "WORKSHOP_NAME":
                                json.Append("\"报警所属组织机构|");
                                break;
                            //case "POWER_SECTION_NAME":
                            //    json.Append("\"报警所属段|");
                            //    break;
                            case "BUREAU_NAME":
                                json.Append("\"报警所属局|");
                                break;
                            case "SVALUE5":
                                json.Append("\"可见光缺陷帧URL|");
                                break;
                            case "SVALUE8":
                                json.Append("\"弓位置|");
                                break;
                            case "SVALUE9":
                                json.Append("\"全景缺陷帧URL|");
                                break;
                            case "SVALUE10":
                                json.Append("\"辅助定位信息|");
                                break;
                            case "SVALUE11":
                                json.Append("\"红外缺陷帧URL|");
                                break;
                            case "SVALUE12":
                                json.Append("\"其它TAX箱数据|");
                                break;
                            case "SVALUE13":
                                json.Append("\"数据过滤分析结果|");
                                break;
                            //case "SVALUE14":
                            //    json.Append("\"FaultI文件名|");
                            //    break;
                            //case "SVALUE15":
                            //    json.Append("\"父告警ID|");
                            //    break;
                            case "NVALUE1":
                                json.Append("\"机车速度|");
                                break;
                            case "NVALUE2":
                                json.Append("\"导高值|");
                                break;
                            case "NVALUE3":
                                json.Append("\"拉出值|");
                                break;
                            case "NVALUE4":
                                json.Append("\"红外最高温度|");
                                break;
                            case "NVALUE5":
                                json.Append("\"环境温度|");
                                break;
                            case "NVALUE6":
                                json.Append("\"卫星数量|");
                                break;
                            case "NVALUE7":
                                json.Append("\"GPS速度|");
                                break;
                            case "NVALUE8":
                                json.Append("\"水平间距|");
                                break;
                            case "NVALUE9":
                                json.Append("\"弓状态|");
                                break;
                            case "NVALUE10":
                                json.Append("\"线路号|");
                                break;
                            //case "NVALUE20":
                            //    json.Append("\"是否国铁自研C3设备|");
                            //    break;
                            case "DVALUE1":
                                json.Append("\"收到SCS文件时间|");
                                break;
                            case "DVALUE2":
                                json.Append("\"收到红外时间|");
                                break;
                            case "DVALUE3":
                                json.Append("\"收到可见光时间|");
                                break;
                            case "DVALUE4":
                                json.Append("\"收到全景I时间|");
                                break;
                            case "DVALUE5":
                                json.Append("\"收到全景II时间|");
                                break;
                            //case "POS_CONFIRMED":
                            //    json.Append("\"标识位置是否已确认|");
                            //    break;
                            case "CUST_ALARM_CODE":
                                json.Append("\"标签|");
                                break;
                            case "SVALUE2":
                                json.Append("\"视频信息|");
                                break;
                            case "SVALUE3":
                                //json.Append("\"全帧信息|");
                                break;
                            case "SVALUE4":
                                json.Append("\"附加信息|");
                                break;
                            default:
                                continue;
                        }

                        if (columnname != "SVALUE3" && columnname != "SVALUE2" && columnname != "SVALUE4")//三个字段的值以json格式存储，需要分别解析
                        {
                            if (columnname == "NVALUE4" || columnname == "NVALUE5")
                            {
                                json.Append("" + (value1 == null ? "" : (Convert.ToInt32(value1) / 100).ToString() + "." + (Convert.ToInt32(value1) % 100).ToString()) + "|" + (value2 == null ? "" : (Convert.ToInt32(value2) / 100).ToString()) + "." + (Convert.ToInt32(value2) % 100).ToString() + "\",");
                            }
                            else if (columnname == "SEVERITY")
                            {
                                json.Append("" + (value1 == null ? "" : Api.Util.Common.sysDictionaryDic[value1].CODE_NAME) + "|" + (value2 == null ? "" : Api.Util.Common.sysDictionaryDic[value2].CODE_NAME) + "\",");
                            }
                            else
                            {
                                json.Append("" + (value1 == null ? "" : value1) + "|" + (value2 == null ? "" : value2) + "\",");
                            }

                        }
                        else if (columnname == "SVALUE3")//全帧信息
                        {
                            //json.Append("\"全帧信息\":");
                            //解析SVALUE3数据
                            JavaScriptSerializer jss = new JavaScriptSerializer();
                            ShortFaultBasicInfo sbi_1 = jss.Deserialize<ShortFaultBasicInfo>(value1);
                            ShortFaultBasicInfo sbi_2 = jss.Deserialize<ShortFaultBasicInfo>(value2);
                            if (sbi_1.IRV_NUM != sbi_2.IRV_NUM)//红外帧数
                            {
                                json.Append("\"红外数量|" + sbi_1.IRV_NUM + "|" + sbi_2.IRV_NUM + "\",");
                            }
                            if (sbi_1.VI_NUM != sbi_2.VI_NUM)//可见光帧数
                            {
                                json.Append("\"可见光数量|" + sbi_1.VI_NUM + "|" + sbi_2.VI_NUM + "\",");
                            }
                            if (sbi_1.OVA_NUM != sbi_2.OVA_NUM)//全景I帧数
                            {
                                json.Append("\"全景I数量|" + sbi_1.OVA_NUM + "|" + sbi_2.OVA_NUM + "\",");
                            }
                            if (sbi_1.OVB_NUM != sbi_2.OVB_NUM)//全景I帧数
                            {
                                json.Append("\"全景II数量|" + sbi_1.OVB_NUM + "|" + sbi_2.OVB_NUM + "\",");
                            }
                            if (sbi_1.FAULT_IDX != sbi_2.FAULT_IDX)//红外缺陷帧序号
                            {
                                json.Append("\"红外缺陷帧序号|" + (sbi_1.FAULT_IDX + 1) + "|" + (sbi_2.FAULT_IDX + 1) + "\",");
                            }
                            if (sbi_1.VI_IDX != sbi_2.VI_IDX)//局部缺陷帧序号
                            {
                                json.Append("\"可见光缺陷帧序号|" + (sbi_1.VI_IDX + 1) + "|" + (sbi_2.VI_IDX + 1) + "\",");
                            }
                            if (sbi_1.OVA_IDX != sbi_2.OVA_IDX)//全景I缺陷帧序号
                            {
                                json.Append("\"全景I缺陷帧序号|" + (sbi_1.OVA_IDX + 1) + "|" + (sbi_2.OVA_IDX + 1) + "\",");
                            }
                            if (sbi_1.OVB_IDX != sbi_2.OVB_IDX)//全景II缺陷帧序号
                            {
                                json.Append("\"全景II缺陷帧序号| " + (sbi_1.OVB_IDX + 1) + "|" + (sbi_2.OVB_IDX + 1) + "\",");
                            }
                            FaultBasicInfo fbi_1 = sbi_1.ConvertToFaultBasicInfo();
                            FaultBasicInfo fbi_2 = sbi_2.ConvertToFaultBasicInfo();
                            //PlayIndex pi = fbi_.PLAY_IDX[1]; 播放信息忽略，播放信息随着缺陷帧变化而变化
                            for (int i_ = 0; i_ < fbi_1.IRV_NUM; i_++)
                            {
                                FrameInfo fi1 = fbi_1.FRAME_INFO[i_];
                                FrameInfo fi2 = fbi_2.FRAME_INFO[i_];
                                if (fi1.ROUTING_NO != fi2.ROUTING_NO)//交路号
                                {
                                    json.Append("\"" + (i_ + 1) + "帧交路号|" + fi1.ROUTING_NO + "|" + fi2.ROUTING_NO + "\",");
                                }
                                if (fi1.KM_MARK != fi2.KM_MARK)//公里标
                                {
                                    json.Append("\"" + (i_ + 1) + "帧公里标|" + fi1.KM_MARK + "|" + fi2.KM_MARK + "\",");
                                }
                                if (fi1.TEMP_IRV != fi2.TEMP_IRV)//红外最高温度
                                {
                                    json.Append("\"" + (i_ + 1) + "帧红外最高温度|" + fi1.TEMP_IRV / 100 + "." + fi1.TEMP_IRV % 100 + "|" + fi2.TEMP_IRV / 100 + "." + fi2.TEMP_IRV % 100 + "\",");
                                }
                                if (fi1.TEMP_ENV != fi2.TEMP_ENV)//环境温度
                                {
                                    json.Append("\"" + (i_ + 1) + "帧环境温度|" + fi1.TEMP_ENV / 100 + "." + fi1.TEMP_ENV % 100 + "|" + fi2.TEMP_ENV / 100 + "." + fi2.TEMP_ENV % 100 + "\",");
                                }
                                if (fi1.LINE_HEIGHT != fi2.LINE_HEIGHT)//导高值
                                {
                                    json.Append("\"" + (i_ + 1) + "帧导高值|" + fi1.LINE_HEIGHT + "|" + fi2.LINE_HEIGHT + "\",");
                                }
                                if (fi1.PULLING_VALUE != fi2.PULLING_VALUE)//拉出值
                                {
                                    json.Append("\"" + (i_ + 1) + "帧拉出值|" + fi1.PULLING_VALUE + "|" + fi2.PULLING_VALUE + "\",");
                                }
                                if (fi1.SPEED != fi2.SPEED)//速度
                                {
                                    json.Append("\"" + (i_ + 1) + "帧速度|" + fi1.SPEED + "|" + fi2.SPEED + "\",");
                                }
                            }

                            //json.Append("\"修改了全帧信息\",");
                        }
                        else if (columnname == "SVALUE2")//视频信息
                        {
                            json.Append("\"修改了视频文件信息\",");
                        }
                        else if (columnname == "SVALUE4")//附加信息
                        {
                            json.Append("\"修改了附加信息\",");
                        }
                    }
                }
                if (json.ToString().Substring(json.Length - 1) == ",")//判断最后一个字符是否为逗号
                {
                    json.Remove(json.Length - 1, 1);
                }
                json.Append("]");
                json.Append("},");
            }
            json.Remove(json.Length - 1, 1);
            json.Append("]");
            int total_rows = ds2.Tables[0].Rows.Count > 0 ? Convert.ToInt32(ds2.Tables[0].Rows[0]["TOTAL"]) : 0;
            PageHelper page = new PageHelper();
            string pagejson = page.getPageJson(total_rows, pageIndex, pageSize);//拼接分页数据
            json.Append("," + pagejson + "}");
            HttpContext.Current.Response.ContentType = "application/json";
            HttpContext.Current.Response.Write(json);
        }
    }

    /// <summary>
    /// 设置缺陷帧
    /// </summary>
    //public void SetAlarmGif(HttpContext context)
    //{
    //    try
    //    {
    //        string alarmid = HttpContext.Current.Request["alarmid"];
    //        string imgType = HttpContext.Current.Request["imgType"];
    //        string httpUrl = HttpContext.Current.Request["httpUrl"];
    //        C3_Alarm c3Alarm = Api.ServiceAccessor.GetAlarmService().getC3Alarm(alarmid);

    //        if (c3Alarm.OA_PICS == null)
    //        {
    //            imgType = "OB_PICS";
    //        }
    //        string ImgPICS = "";
    //        switch (imgType)
    //        {
    //            case "IR_PICS":
    //                ImgPICS = c3Alarm.IR_PICS;
    //                break;
    //            case "VI_PICS":
    //                ImgPICS = c3Alarm.VI_PICS;
    //                break;
    //            case "OA_PICS":
    //                ImgPICS = c3Alarm.OA_PICS;
    //                break;
    //            case "OB_PICS":
    //                ImgPICS = c3Alarm.OB_PICS;
    //                break;

    //        }
    //        string[] imgs = ImgPICS.Replace("[", "").Replace("]", "").Replace("\"", "").Split(',');
    //        List<Uri> urlList = new List<Uri>();
    //        for (int i = 0; i < imgs.Length; i++)
    //        {
    //            string imgUrl = httpUrl + imgs[i];
    //            Uri uri = new Uri(imgUrl);
    //            urlList.Add(uri);
    //        }

    //        string rootDirPath = @"D:\dpcNew\6CWeb\TempGif";
    //        string ftp = imgs[0].Split('/')[1].ToString();
    //        //string str = rootDirPath + "" + c3Alarm.DIR_PATH.ToString().Replace(ftp, "") + "" + c3Alarm.SVALUE5.Replace(".jpg", "") + "_" + imgType + ".gif";
    //        string str = rootDirPath + "/" + imgType + ".gif";

    //        GifEncoder.GifConversion gif = new GifEncoder.GifConversion();

    //        bool b = gif.SaveTextToGif(urlList, str, 1000);          
    //        if (b)
    //        {
    //            //string GifStr = "/TempGif/" + imgType + ".gif";

    //            myImgTrans(str);

    //            //context.Response.Write(GifStr);
    //            context.Response.End();
    //        }
    //    }
    //    catch (Exception ex)
    //    {
    //        log4net.ILog log2 = log4net.LogManager.GetLogger("导出GIF");
    //        log2.Error("Error", ex);
    //    }
    //}





    /// <summary>
    /// 得到缺陷详细页使用的完整json对象
    /// </summary>
    public void GetAlarmJsonTotal(HttpContext context)
    {

        string alarmid = HttpContext.Current.Request["alarmid"];//缺陷ID
        System.Text.StringBuilder result = new System.Text.StringBuilder();
        // Dictionary<string, Api.ADO.entity.Virtual_Dir_Info> virCache = new Dictionary<string, Api.ADO.entity.Virtual_Dir_Info>();


        try
        {
            C3_Alarm c3Alarm = Api.ServiceAccessor.GetAlarmService().getC3Alarm_Aux(alarmid);

            if (c3Alarm.GIS_X == 0 && c3Alarm.GIS_X_O > 0)
            {
                string bPoint = CoordinateConvert.convert2B(c3Alarm.GIS_X_O.ToString(), c3Alarm.GIS_Y_O.ToString());
                if (bPoint != null)
                {
                    if (bPoint.Split(',')[0] != "0" && bPoint.Split(',')[0] != "")
                    {

                        c3Alarm.GIS_X = Convert.ToDouble(bPoint.Split(',')[0]);
                        c3Alarm.GIS_Y = Convert.ToDouble(bPoint.Split(',')[1]);


                        Alarm_Original.UpdateGPS(c3Alarm);

                    }
                }
            }
            //为1时表示要进行预加载操作
            string IS_LOADBMI = "", IS_LOADRPT = "";
            if (c3Alarm.Alarm_Aux != null)
            {
                //地图
                if (string.IsNullOrEmpty(c3Alarm.Alarm_Aux.BMI_FILE_NAME) || !File.Exists(HttpContext.Current.Server.MapPath("~" + c3Alarm.Alarm_Aux.BMI_FILE_NAME)))
                {
                    IS_LOADBMI = "1";
                }
                //报告
                if (string.IsNullOrEmpty(c3Alarm.Alarm_Aux.RPT_FILE_NAME) || !File.Exists(HttpContext.Current.Server.MapPath("~" + c3Alarm.Alarm_Aux.RPT_FILE_NAME)))
                {
                    IS_LOADRPT = "1";
                }
            }
            else { IS_LOADBMI = "1"; IS_LOADRPT = "1"; }



            string REP_COUNT = "";
            string c3Show = "c3false"; //c3图片是否显示
            string c3IMA = "";//红外图片名
            string REP_P_ID = "";//重复报警父ID
            if (!string.IsNullOrEmpty(c3Alarm.SNAPPED_JPG))
            {
                c3Show = "c3true";
                c3IMA = c3Alarm.SNAPPED_IMA.Replace(".IMA", "_IRV.jpg");
            }


            string SPEED = myfiter.GetSpeed(c3Alarm.SPEED);
            string LINE_NAME = "";//位置信息中已存在，此属性未使用，不赋值
            string StationD = "";//位置信息中已存在，此属性未使用，不赋值

            string KM = "";//公里标
            if (PublicMethod.KmtoString(c3Alarm.KM_MARK) != "0")
            {
                KM = PublicMethod.KmtoString(c3Alarm.KM_MARK);
            }


            if (c3Alarm.Alarm_Aux != null)
            {
                if (c3Alarm.SVALUE15 == "重复报警")
                {
                    REP_COUNT = c3Alarm.Alarm_Aux.ALARM_REP_COUNT == 0 ? "" : "<a  class='label' style='background-color:red;' href=javascript:goRepeate('" + c3Alarm.ID + "','" + c3Alarm.ID + "')>最新重复 " + c3Alarm.Alarm_Aux.ALARM_REP_COUNT + " 次</a>";
                    REP_P_ID = c3Alarm.Alarm_Aux.ALARM_REP_COUNT == 0 ? "" : c3Alarm.ID;
                }
                else
                {
                    REP_COUNT = c3Alarm.Alarm_Aux.ALARM_REP_COUNT == 0 ? "" : "<a  class='label' style='background-color:#987B40;' href=javascript:goRepeate('" + c3Alarm.ID + "','" + c3Alarm.SVALUE15 + "')>历史重复 " + c3Alarm.Alarm_Aux.ALARM_REP_COUNT + " 次</a>";
                    REP_P_ID = c3Alarm.Alarm_Aux.ALARM_REP_COUNT == 0 ? "" : c3Alarm.SVALUE15;
                }
            }

            string IsCrack = "";//是否是破解机车
            if (c3Alarm.Alarm_Aux != null)
            {
                if (c3Alarm.Alarm_Aux.DEVICE_VERSION == "PS3B" || c3Alarm.Alarm_Aux.DEVICE_VERSION == "PS4B")
                {
                    IsCrack = "1";
                }
            }


            //string wz = REP_COUNT + PublicMethod.GetPositionByAlarmid(c3Alarm);//位置信息
            string wz = REP_COUNT + PublicMethod.GetPosition_Alarm(c3Alarm.LINE_NAME, c3Alarm.POSITION_NAME, c3Alarm.BRG_TUN_NAME, c3Alarm.DIRECTION, c3Alarm.KM_MARK, c3Alarm.POLE_NUMBER, c3Alarm.DEVICE_ID, c3Alarm.ROUTING_NO, c3Alarm.AREA_NO, c3Alarm.STATION_NO, c3Alarm.STATION_NAME, c3Alarm.TAX_MONITOR_STATUS);//位置信息
            string delay_hw = "";
            string delay_vi = "";
            string delay_all1 = "";
            string delay_all2 = "";
            string delay_file = "";//同步文件 

            if (c3Alarm.IRV_RECV_TIME != null)
            {
                delay_hw = GetDelay(c3Alarm.IRV_RECV_TIME, c3Alarm.RAISED_TIME);
            }

            if (c3Alarm.VI_RECV_TIME != null)
            {
                delay_vi = GetDelay(c3Alarm.VI_RECV_TIME, c3Alarm.RAISED_TIME);
            }

            if (c3Alarm.DVALUE4 != null)
            {
                delay_all1 = GetDelay(c3Alarm.DVALUE4, c3Alarm.RAISED_TIME);
            }

            if (c3Alarm.DVALUE5 != null)
            {
                delay_all2 = GetDelay(c3Alarm.DVALUE5, c3Alarm.RAISED_TIME);
            }

            if (c3Alarm.DVALUE1 != null)
            {
                delay_file = GetDelay(c3Alarm.DVALUE1, c3Alarm.RAISED_TIME);
            }

            Locomotive m_loco = Common.getLocomotiveInfo(c3Alarm.DETECT_DEVICE_CODE);

            result.Append("{");
            result.Append("\"IS_LOADBMI\":\"" + IS_LOADBMI + "\",");//地图
            result.Append("\"IS_LOADRPT\":\"" + IS_LOADRPT + "\",");//报告
            result.Append("\"dtime_hw\":\"" + c3Alarm.IRV_RECV_TIME + "\",");//上报延时
            result.Append("\"delay_hw\":\"" + delay_hw + "\",");//上报延时

            result.Append("\"dtime_vi\":\"" + c3Alarm.VI_RECV_TIME + "\",");//上报延时
            result.Append("\"delay_vi\":\"" + delay_vi + "\",");//上报延时

            result.Append("\"dtime_all1\":\"" + c3Alarm.DVALUE4 + "\",");//上报延时
            result.Append("\"delay_all1\":\"" + delay_all1 + "\",");//上报延时

            result.Append("\"dtime_all2\":\"" + c3Alarm.DVALUE5 + "\",");//上报延时
            result.Append("\"delay_all2\":\"" + delay_all2 + "\",");//上报延时

            result.Append("\"dtime_file\":\"" + c3Alarm.DVALUE1 + "\",");//上报延时
            result.Append("\"delay_file\":\"" + delay_file + "\",");//上报延时



            result.Append("\"SNAPPED_IMA\":\"" + PublicMethod.C3FtpRoot + "/" + c3Alarm.DIR_PATH + c3IMA + "\","); //红外图片
            result.Append("\"SNAPPED_JPG\":\"" + PublicMethod.C3FtpRoot + "/" + c3Alarm.DIR_PATH + c3Alarm.SNAPPED_JPG + "\",");//可见光

            string dir = "";

            dir = c3Alarm.DIR_PATH.Contains("FtpRoot") ? "/" + c3Alarm.DIR_PATH : "/FtpRoot/" + c3Alarm.DIR_PATH;


            result.Append("\"hw\":\"" + myfiter.GetPicUrl(dir + c3Alarm.SVALUE11) + "\",");//IRV，Alarm表中的SVALUE11表示红外文件的相对路径
            result.Append("\"kjg\":\"" + myfiter.GetPicUrl(dir + c3Alarm.SVALUE5) + "\",");//IRV
            result.Append("\"allimg\":\"" + myfiter.GetPicUrl(dir + c3Alarm.SVALUE9) + "\",");//IRV，Alarm表中的SVALUE9表示红外文件的相对路径

            result.Append("\"BackUpFile\":\"" + c3Alarm.SVALUE1 + "\",");//备份原始原件目录
            result.Append("\"scs\":\"" + c3Alarm.SVALUE14 + "\",");//SCS文件名称

            result.Append("\"c3Show\":\"" + c3Show + "\",");//c3图片是否存在
            result.Append("\"xj\":\"" + c3Alarm.SATELLITE_NUM + "\",");//卫星数量
            result.Append("\"DEVICE_ID\":\"" + c3Alarm.DEVICE_ID + "\",");//DEVICE_ID
            result.Append("\"CROSSING_NO\":\"" + c3Alarm.ROUTING_NO + "\",");//交路号
            result.Append("\"SPEED\":\"" + SPEED + "\",");//速度
            result.Append("\"WENDU\":\"" + myfiter.GetTEMP(c3Alarm.MAX_TEMP, "℃") + "\",");//最大红外温度
            result.Append("\"HJWENDU\":\"" + myfiter.GetTEMP(c3Alarm.ENV_TEMP, "℃") + "\",");//环境温度
            result.Append("\"LINE_HEIGHT\":\"" + myfiter.GetLINE_HEIGHT(c3Alarm) + "\",");//导高
            result.Append("\"PULLING_VALUE\":\"" + myfiter.GetPULLING_VALUE(c3Alarm) + "\",");//拉出
            result.Append("\"AREA_SECTION\":\"" + c3Alarm.AREA_NO + "\",");//运用区段
            result.Append("\"STATION_NO\":\"" + StationD + "\",");//车站号
            result.Append("\"TRAIN_NO\":\"" + c3Alarm.TRAIN_NO + "\",");//车站郝
            result.Append("\"LINE_NAME\":\"" + LINE_NAME + "\",");//线路
            result.Append("\"wz\":\"" + wz + "\",");//位置 REP_COUNT
            result.Append("\"REP_INFO\":\"" + REP_COUNT + "\",");
            result.Append("\"wz_fz\":\"" + c3Alarm.SVALUE10 + "\",");//辅助位置 

            string dutyRange = "";
            PublicMethod.GetDutyRange(c3Alarm.ORG_CODE, ref dutyRange);
            result.Append("\"DUTY_RANGE\":\"" + (dutyRange == "" ? "" : "(" + dutyRange + ")") + "\",");//局
            Locomotive loc = Api.Util.Common.getLocomotiveInfo(c3Alarm.DETECT_DEVICE_CODE);
            result.Append("\"PSD\":\"" + loc.P_ORG_NAME + "\",");//配属段
            result.Append("\"GSD\":\"" + loc.ORG_NAME + "\",");//归属段

            result.Append("\"JU\":\"" + c3Alarm.BUREAU_NAME + "\",");//局
            result.Append("\"GDD\":\"" + c3Alarm.POWER_SECTION_NAME + "\",");//供电段
            result.Append("\"JWD\":\"" + c3Alarm.P_ORG_NAME + "\",");//机务段
            result.Append("\"LINE\":\"" + c3Alarm.LINE_NAME + "\",");//线路
            result.Append("\"LINE_CODE\":\"" + c3Alarm.LINE_CODE + "\",");//线路编码
            result.Append("\"POSITION_CODE\":\"" + c3Alarm.POSITION_CODE + "\",");//区站编码
            result.Append("\"JUCODE\":\"" + c3Alarm.BUREAU_CODE + "\",");//局CODE
            result.Append("\"CJ\":\"" + c3Alarm.WORKSHOP_NAME + "\",");//供电车间
            result.Append("\"BZ\":\"" + c3Alarm.ORG_NAME + "\", ");//班组
            result.Append("\"QZ\":\"" + c3Alarm.POSITION_NAME + "\", ");//工区
            result.Append("\"DIRECTION\":\"" + c3Alarm.DIRECTION + "\", ");//行别
            result.Append("\"BRIDGE_TUNNEL_NO\":\"" + c3Alarm.BRG_TUN_CODE + "\", ");//桥隧
            result.Append("\"POLE_NUMBER\":\"" + c3Alarm.POLE_NUMBER + "\", ");//支柱
            result.Append("\"KM\":\"" + KM + "\", ");//公里标
            result.Append("\"GIS_X\":\"" + c3Alarm.GIS_X + "\", ");//X
            result.Append("\"GIS_Y\":\"" + c3Alarm.GIS_Y + "\", ");//Y
            result.Append("\"GIS_X_O\":\"" + c3Alarm.GIS_X_O + "\", ");//X
            result.Append("\"GIS_Y_O\":\"" + c3Alarm.GIS_Y_O + "\", ");//Y

            result.Append("\"SUMMARYDIC\":\"" + c3Alarm.CODE_NAME + "\", ");//故障类型
            result.Append("\"SUMMARYDICCODE\":\"" + c3Alarm.CODE + "\", ");//故障类型code
            result.Append("\"BOW_TYPE\":\"" + c3Alarm.BOW_TYPE + "\", ");//弓位置
            result.Append("\"DRIVER_NUMBER\":\"" + c3Alarm.DRIVER_NO + "\", ");//司机号
            result.Append("\"DETAIL\":\"" + c3Alarm.DETAIL + "\", ");//描述
            if (string.IsNullOrEmpty(c3Alarm.STATUS_NAME))
            {
                result.Append("\"STATUSDIC\":\"" + "" + "\", ");//状态
            }
            else
            {
                result.Append("\"STATUSDIC\":\"" + c3Alarm.STATUS_NAME.Trim() + "\", ");//状态
            }
            result.Append("\"REPORT_DATE\":\"" + c3Alarm.REPORT_DATE + "\", ");//报告时间
            result.Append("\"RAISED_TIME\":\"" + c3Alarm.RAISED_TIME.ToString("yyyy-MM-dd HH:mm:ss") + "\", ");//发生时间
            result.Append("\"STATUS_TIME\":\"" + c3Alarm.STATUS_TIME + "\", ");//状态变化时间
            result.Append("\"LOCNO\":\"" + c3Alarm.DETECT_DEVICE_CODE + "\", ");//设备编号
            result.Append("\"VENDOR\":\"" + c3Alarm.VENDOR + "\", ");//设备厂商

            result.Append("\"REPAIR_DATE\":\"" + c3Alarm.REPAIR_DATE.ToString("yyyy-MM-dd HH:mm:ss") + "\", ");//检修日期
            result.Append("\"REPAIR_PERSON\":\"" + c3Alarm.REPAIR_PERSON + "\", ");//检修人
            result.Append("\"REPAIR_ORG\":\"" + c3Alarm.REPAIR_ORG + "\", ");//检修机构
            result.Append("\"REPAIR_METHOD\":\"" + c3Alarm.REPAIR_METHOD + "\", ");//检修方式

            result.Append("\"ALARM_ANALYSIS\":\"" + myfiter.json_RemoveSpecialStr_item_double(c3Alarm.ALARM_ANALYSIS) + "\", ");//缺陷分析
            result.Append("\"PROPOSAL\":\"" + c3Alarm.PROPOSAL + "\", ");//处理建议
            result.Append("\"REMARK\":\"" + c3Alarm.REMARK + "\", ");//备注
            result.Append("\"REPORT_PERSON\":\"" + c3Alarm.REPORT_PERSON + "\", ");//报告人
            result.Append("\"SEVERITY\":\"" + c3Alarm.SEVERITY + "\", ");//级别
            result.Append("\"SEVERITY_CODE\":\"" + c3Alarm.MY_STR_8 + "\", ");//级别
            result.Append("\"Loco_JU\":\"" + m_loco.BUREAU_NAME + "\", ");//车子的局
            result.Append("\"CUST_ALARM_CODE\":\"" + c3Alarm.CUST_ALARM_CODE + "\", ");//报警编码
            result.Append("\"IS_TYPICAL\":\"" + c3Alarm.IS_TYPICAL + "\", "); //典型缺陷
            result.Append("\"ID\":\"" + c3Alarm.ID + "\", "); //报警ID

            result.Append("\"EOAS_TRAINNO\":\"" + c3Alarm.EOAS_TRAINNO + "\", "); //新加的车次号
            string locname;//标题描述
            string localarminfo;//报警描述

            locname = PublicMethod.GetPositionByAlarmid(c3Alarm.ID);
            localarminfo = "最高温度:" + myfiter.GetTEMP_MAX(c3Alarm) + "℃&nbsp;" + "环境温度:" + myfiter.GetTEMP_ENV(c3Alarm) + "℃&nbsp;" + "导高值:" + myfiter.GetLINE_HEIGHT(c3Alarm) + "mm&nbsp;" + "拉出值:" + myfiter.GetPULLING_VALUE(c3Alarm) + "mm&nbsp;" + "速度:" + c3Alarm.SPEED + "km/h&nbsp;";


            string OA = myfiter.GetPicUrl(c3Alarm.OA_PICS);
            string OB = myfiter.GetPicUrl(c3Alarm.OB_PICS);
            string IR_PICS = myfiter.GetPicUrl(c3Alarm.IR_PICS);
            string VI_PICS = myfiter.GetPicUrl(c3Alarm.VI_PICS);


            OB = OB == null ? "[]" : OB;
            OA = OA == null ? "[]" : OA;
            IR_PICS = IR_PICS == null ? "[]" : IR_PICS;
            VI_PICS = VI_PICS == null ? "[]" : VI_PICS;

            string FRAME_INFO = string.IsNullOrEmpty(c3Alarm.FRAME_INFO) ? "[]" : c3Alarm.FRAME_INFO;
            string PLAY_IDX = string.IsNullOrEmpty(c3Alarm.PLAY_IDX) ? "[]" : c3Alarm.PLAY_IDX;
            string FRAME_INFO_LIST = string.IsNullOrEmpty(c3Alarm.FRAME_INFO_LIST) ? "[]" : c3Alarm.FRAME_INFO_LIST;

            result.Append("\"IR_PICS\":" + IR_PICS + ",");//红外图片
            result.Append("\"VI_PICS\":" + VI_PICS + ",");//可见光
            result.Append("\"OA_PICS\":" + OA + ",");//全景A
            result.Append("\"OB_PICS\":" + OB + ",");//全景B
            result.Append("\"FRAME_INFO\":" + FRAME_INFO + ",");//字幕
            result.Append("\"PLAY_IDX\":" + PLAY_IDX + ",");//播放索引      
            result.Append("\"FRAME_INFO_LIST\":" + FRAME_INFO_LIST + ",");////红光温度，环境温度等。。    
            result.Append("\"ch\":\"" + c3Alarm.DETECT_DEVICE_CODE + "\",");//车号
            result.Append("\"fssj\":\"" + c3Alarm.RAISED_TIME + "\",");//发生时间  
            result.Append("\"line\":\"" + c3Alarm.LINE_NAME + "\",");//线路  
            result.Append("\"position\":\"" + c3Alarm.POSITION_NAME + "\",");//站   
                                                                             //result.Append("\"SUMMARYDIC_\":\"" + Alarm.CODE_NAME + "\",");//缺陷类型  
                                                                             //result.Append("\"km\":\"" + PublicMethod.KmtoString(c3Alarm.KM_MARK) + "\",");//公里标  
                                                                             //result.Append("\"xb\":\"" + c3Alarm.DIRECTION + "\",");//行别 
            result.Append("\"gis_x_N2\":\"" + c3Alarm.GIS_X.ToString("N2") + "\",");//IRV 
            result.Append("\"gis_y_N2\":\"" + c3Alarm.GIS_Y.ToString("N2") + "\",");//IRV  
            result.Append("\"locname\":\"" + locname + "\",");//标题描述  
            result.Append("\"localarminfo\":\"" + localarminfo + "\",");//报警描述
            result.Append("\"IsCrack\":\"" + IsCrack + "\",");//破解机车标识
            result.Append("\"TAX_MONITOR_STATUS\":\"" + c3Alarm.TAX_MONITOR_STATUS + "\",");//tax监控状态
            result.Append("\"TAX_SCHEDULE_STATUS\":\"" + c3Alarm.TAX_SCHEDULE_STATUS + "\",");//tax调车状态
            result.Append("\"TAX_POSITION\":\"" + c3Alarm.TAX_POSITION + "\",");//tax本补机
            result.Append("\"PROCESS_STATUS\":\"" + c3Alarm.PROCESS_STATUS + "\",");//处理状态
            result.Append("\"REP_P_ID\":\"" + REP_P_ID + "\",");//重复报警父ID
            if (c3Alarm.Alarm_Aux != null)
            {
                result.Append("\"ISEXPORTREPORT\":\"" + c3Alarm.Alarm_Aux.ISEXPORTREPORT + "\",");//周报标志
                result.Append("\"INITIAL_CODE\":\"" + c3Alarm.Alarm_Aux.INITIAL_CODE + "\",");//原始报警类型编码
                result.Append("\"INITIAL_CODE_NAME\":\"" + c3Alarm.Alarm_Aux.INITIAL_CODE_NAME + "\",");//原始报警类型
                result.Append("\"LOCK_PERSON_ID\":\"" + c3Alarm.Alarm_Aux.LOCK_PERSON_ID + "\",");//报警当前锁定用户ID
                result.Append("\"LOCK_PERSON_NAME\":\"" + c3Alarm.Alarm_Aux.LOCK_PERSON_NAME + "\",");//报警当前锁定用户名
                result.Append("\"LOCK_TIME\":\"" + c3Alarm.Alarm_Aux.LOCK_TIME + "\",");//锁定时间
                result.Append("\"RERUN_TYPE\":\"" + c3Alarm.Alarm_Aux.RERUN_TYPE + "\",");//重解析标志
                result.Append("\"SAMPLE_CODE\":\"" + c3Alarm.Alarm_Aux.SAMPLE_CODE + "\",");//样本类型编码
                result.Append("\"SAMPLE_NAME\":\"" + c3Alarm.Alarm_Aux.SAMPLE_NAME + "\",");//样本类型名称
                result.Append("\"SAMPLE_DETAIL_CODE\":\"" + c3Alarm.Alarm_Aux.SAMPLE_DETAIL_CODE + "\",");//样本详细类型编码
                result.Append("\"SAMPLE_DETAIL_NAME\":\"" + c3Alarm.Alarm_Aux.SAMPLE_DETAIL_NAME + "\",");//样本详细类型名称
                result.Append("\"SCENCESAMPLE_CODE\":\"" + c3Alarm.Alarm_Aux.SCENCESAMPLE_CODE + "\",");//场景样本编码
                result.Append("\"SCENCESAMPLE_NAME\":\"" + c3Alarm.Alarm_Aux.SCENCESAMPLE_NAME + "\",");//场景样本编码名称
                result.Append("\"CRITERION\":\"" + c3Alarm.Alarm_Aux.ALGCODENAME + "\",");//报警判断依据
            }
            else
            {
                result.Append("\"ISEXPORTREPORT\":\"" + "" + "\",");//周报标志
                result.Append("\"INITIAL_CODE\":\"" + "" + "\",");//原始报警类型编码
                result.Append("\"INITIAL_CODE_NAME\":\"" + "" + "\",");//原始报警类型
                result.Append("\"LOCK_PERSON_ID\":\"" + "" + "\",");//报警当前锁定用户ID
                result.Append("\"LOCK_PERSON_NAME\":\"" + "" + "\",");//报警当前锁定用户名
                result.Append("\"LOCK_TIME\":\"" + "" + "\",");//锁定时间
                result.Append("\"RERUN_TYPE\":\"" + "" + "\",");//重解析标志
                result.Append("\"SAMPLE_CODE\":\"" + "" + "\",");//样本类型编码
                result.Append("\"SAMPLE_NAME\":\"" + "" + "\",");//样本类型名称
                result.Append("\"SAMPLE_DETAIL_CODE\":\"" + "" + "\",");//样本详细类型编码
                result.Append("\"SAMPLE_DETAIL_NAME\":\"" + "" + "\",");//样本详细类型名称
                result.Append("\"SCENCESAMPLE_CODE\":\"" + "" + "\",");//场景样本编码
                result.Append("\"SCENCESAMPLE_NAME\":\"" + "" + "\",");//场景样本编码名称
                result.Append("\"CRITERION\":\"" + "" + "\",");//报警判断依据
            }

            string SPARK_SHAPE = "";
            if (c3Alarm.ALARM_IMA_DATA != null)
            {
                int sign = c3Alarm.ALARM_IMA_DATA.SPARK_SHAPE;//燃弧形状
                switch (sign)
                {
                    case -1:
                        SPARK_SHAPE = "数据有误";
                        break;
                    case 0:
                        SPARK_SHAPE = "无燃弧";
                        break;
                    case 1:
                        SPARK_SHAPE = "暴燃";
                        break;
                    case 2:
                        SPARK_SHAPE = "飘弧";
                        break;
                    case 3:
                        SPARK_SHAPE = "溅弧";
                        break;
                }
            }

            if (c3Alarm.ALARM_IMA_DATA != null /*&& Api.Util.Common.FunEnable("Fun_Arc_Analysis")*/)
            {
                result.Append("\"ARCING_AREA\":\"" + c3Alarm.ALARM_IMA_DATA.SPART_PIXEL_PCT + "\",");//燃弧面积
                result.Append("\"SPARK_SHAPE\":\"" + SPARK_SHAPE + "\",");//燃弧形状
                result.Append("\"SPARK_ELAPSE\":\"" + c3Alarm.ALARM_IMA_DATA.SPARK_ELAPSE + "\",");//燃弧时长
                result.Append("\"SPARK_NUM\":\"" + c3Alarm.ALARM_IMA_DATA.SPARK_NUM + "\",");//燃弧个数                
                result.Append("\"SPART_PIXELS\":\"" + c3Alarm.ALARM_IMA_DATA.SPART_PIXELS + "\",");//燃弧像素
            }
            else
            {
                result.Append("\"ARCING_AREA\":\"" + "" + "\",");//燃弧面积
                result.Append("\"SPARK_SHAPE\":\"" + "" + "\",");//燃弧形状
                result.Append("\"SPARK_ELAPSE\":\"" + "" + "\",");//燃弧时长
                result.Append("\"SPARK_NUM\":\"" + "" + "\",");//燃弧个数
                result.Append("\"SPART_PIXELS\":\"" + "" + "\",");//燃弧像素
            }

            Api.Task.entity.MisTask misTask = GetTask(alarmid);
            string MisShow = "false";
            if (misTask != null)
            {
                Api.Foundation.entity.Foundation.LoginUser m22 = Api.Util.Public.GetCurrentUser();

                if (misTask.STATUS != "完成" && misTask.STATUS != "取消")
                {
                    if (!string.IsNullOrEmpty(misTask.RECV_DEPT))
                    {
                        if (Regex.IsMatch(misTask.RECV_DEPT, (m22.ORG_CODE.Replace("$", "\\$") + "$|" + m22.ORG_CODE.Replace("$", "\\$") + ",+")))
                            MisShow = "false";
                        else
                        {
                            if (!string.IsNullOrEmpty(Public.GetUser_PermissionOrg))
                            {
                                if (Public.GetUser_PermissionOrg.Contains(misTask.RECV_DEPT))
                                    MisShow = "false";
                                else
                                    MisShow = "true";
                            }
                        }
                    }
                }
                else
                    MisShow = "true";


                result.Append("\"MISID\":\"" + misTask.ID + "\", ");//任务主键  
                result.Append("\"TASKSTATUS\":\"" + misTask.STATUS + "\", ");//任务状态
            }
            else
            {
                result.Append("\"MISID\":\"" + "" + "\", ");//任务主键  
                result.Append("\"TASKSTATUS\":\"" + "" + "\", ");//任务状态
            }
            //原始数据播放
            if (!string.IsNullOrEmpty(c3Alarm.DETECT_DEVICE_CODE))
            {
                string orginal = ADO.GetFileTask.JudgeFiletaskToAlarm(c3Alarm.DETECT_DEVICE_CODE, c3Alarm.RAISED_TIME);
                result.Append("\"ORGINAL\":\"" + orginal + "\", ");//原始数据播放
            }

            result.Append("\"MisShow\":\"" + MisShow + "\", \"PersonName\":\"" + Public.GetPersonName + "\" }");//是否有任务


            string re = myfiter.json_RemoveSpecialStr_N(result.ToString());

            string remove = HttpContext.Current.Request["remove"];
            if (remove == "1")
            {
                re = myfiter.RemoveHTML(re, 0);
            }

            context.Response.Write(Newtonsoft.Json.JsonConvert.DeserializeObject(re));
            //    context.Response.End();

        }
        catch (Exception ex)
        {
            log4net.ILog log2 = log4net.LogManager.GetLogger("读取C3详细页信息");
            log2.Error("Error", ex);
        }
    }
    /// <summary>
    /// 对报警加锁
    /// </summary>
    /// <param name="context"></param>
    public void LockAlarm(HttpContext context)
    {
        bool sign = false;

        string alarmid = HttpContext.Current.Request["alarmid"];
        string user = Api.Util.Public.GetPersonName;
        string loginId = Api.Util.Public.GetLoginID;
        string locktime = "";
        StringBuilder json = new StringBuilder();

        if (!string.IsNullOrEmpty(user) && !string.IsNullOrEmpty(loginId))
        {
            int result = ADO.AlarmLock.LockAlarm(alarmid, loginId, user, ref locktime);
            if (result == 1)
            {
                sign = true;
            }
        }

        json.Append("{\"sign\":\"" + sign + "\",\"locktime\":\"" + locktime + "\"}");
        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }
    /// <summary>
    /// 报警解锁
    /// </summary>
    /// <param name="context"></param>
    public void UnlockAlarm(HttpContext context)
    {
        bool sign = false;

        string alarmid = HttpContext.Current.Request["alarmid"];
        string user = Api.Util.Public.GetPersonName;
        string loginId = Api.Util.Public.GetLoginID;

        if (!string.IsNullOrEmpty(user) && !string.IsNullOrEmpty(loginId))
        {
            int result = ADO.AlarmLock.UnlockAlarm(alarmid, loginId, user);
            if (result == 1)
            {
                sign = true;
            }
        }
        HttpContext.Current.Response.Write(sign);
    }
    /// <summary>
    /// 缓存虚拟目录表
    /// </summary>

    /// <summary>
    /// 更新报警浏览量
    /// </summary>
    /// <param name="context"></param>
    public void updateAlarm(HttpContext context)
    {
        string AlarmID = HttpContext.Current.Request["alarmid"];//缺陷ID
        Api.ServiceAccessor.GetAlarmService().updateALARM_AUXACCESSCOUNT(AlarmID);
    }
    /// <summary>
    /// 提供多组拉出值提供选择
    /// </summary>
    public void getStaggerGroup()
    {
        string alarmid = HttpContext.Current.Request["alarmid"];//报警ID

        //数据查询
        System.Data.DataSet ds = ADO.AlarmQuery.QueryStaggerInfo(alarmid);

        StringBuilder json = new StringBuilder();
        json.Append("{\"data\":[");

        if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
        {
            DataTable dt = ds.Tables[0];
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                json.Append("{");
                json.Append("\"FRAMENO\":\"" + dt.Rows[i]["FRAME_NO"] + "\",");
                json.Append("\"STAGGER\":\"" + dt.Rows[i]["STAGGER1"] + ",");
                json.Append(/*"\"STAGGER2\":\"" + */dt.Rows[i]["STAGGER2"] + ",");
                json.Append(/*"\"STAGGER3\":\"" +*/ dt.Rows[i]["STAGGER3"] + ",");
                json.Append(/*"\"STAGGER4\":\"" + */dt.Rows[i]["STAGGER4"] + "\"");
                json.Append("},");
            }
            json.Remove(json.Length - 1, 1);
        }
        json.Append("]}");

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }
    /// <summary>
    /// 返回图像中心点坐标及图像比例
    /// </summary>
    public void getStaggerByPerson()
    {
        string alarmid = HttpContext.Current.Request["alarmid"];//报警ID

        //数据查询
        System.Data.DataSet ds = ADO.AlarmQuery.QueryStaggerInfo(alarmid);

        //拼接json
        StringBuilder json = new StringBuilder();
        json.Append("{\"data\":[");
        if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
        {
            DataRowCollection drc = ds.Tables[0].Rows;
            foreach (DataRow dr in drc)
            {
                json.Append("{");
                json.Append("\"FRAME_NO\":\"" + (Convert.ToInt32(dr["FRAME_NO"]) + 1) + "\",");//帧序号
                json.Append("\"STAGGER_CUR\":\"" + dr["STAGGER_CUR"] + "\",");//当前拉出值
                json.Append("\"BOWCENTERX\":\"" + dr["BOWCENTERX"] + "\",");//弓中心点X坐标
                json.Append("\"BOWCENTERY\":\"" + dr["BOWCENTERY"] + "\",");//弓中心点Y坐标
                json.Append("\"MATSCALE\":\"" + dr["MATSCALE"] + "\"");//计算比例
                json.Append("},");
            }
            json.Remove(json.Length - 1, 1);
        }
        json.Append("]}");

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }
    public void SetAlarmFrameAll(HttpContext context)
    {
        StringBuilder json = new StringBuilder();
        bool re = false;
        try
        {
            string alarmid = HttpContext.Current.Request["alarmid"];
            int FRAMENO = string.IsNullOrEmpty(HttpContext.Current.Request["FRAMENO"]) ? -1 : Convert.ToInt32(HttpContext.Current.Request["FRAMENO"]);

            //将原始报警信息存入历史表
            bool history = Api.ServiceAccessor.GetAlarmService().InsertAlarmHis(alarmid);

            Alarm a = Api.ServiceAccessor.GetAlarmService().getAlarm(alarmid);
            C3_Alarm alarm = Api.ServiceAccessor.GetAlarmService().SConvertToC3_Alarm(a);
            JavaScriptSerializer jss = new JavaScriptSerializer();
            MyPlayIndex[] playIndex = jss.Deserialize<MyPlayIndex[]>(alarm.PLAY_IDX);
            ShortFaultBasicInfo sbi = jss.Deserialize<ShortFaultBasicInfo>(alarm.SVALUE3);
            FaultBasicInfo fbi = sbi.ConvertToFaultBasicInfo();

            int CVI = -1;
            int COA = -1;
            int COB = -1;
            if (FRAMENO != -1)
            {
                for (int i = 0; i < playIndex.Length - 1; i++)
                {
                    if (FRAMENO == playIndex[i].IR)
                    {
                        CVI = playIndex[i].VI;//当前红外帧序号对应的可见光帧序号
                        COA = playIndex[i].OA;//当前红外帧序号对应的全景A帧序号
                        COB = playIndex[i].OB;//当前红外帧序号对应的全景B帧序号
                        break;
                    }
                }
            }
            //红外
            if (FRAMENO != -1)
            {
                fbi.FLAG[0] = 1;
                fbi.FAULT_IDX = FRAMENO;// playIndex[faultIndex].IR;
                string irvFileNameWithoutExt = fbi.IRV_DIR;
                int index = sbi.IRV_DIR.IndexOf("-IRV");
                if (index > -1)
                {
                    irvFileNameWithoutExt = fbi.IRV_DIR.Substring(0, index);
                }
                alarm.SVALUE11 = fbi.IRV_DIR + "/" + irvFileNameWithoutExt + "_IRV" + (fbi.FAULT_IDX + fbi.START_IDX) + ".jpg";
                //将报警集合参数修改为红外缺陷帧数据
                //if(alarm.CODE=="AFCODELCZ")
                {
                    ShortFaultBasicInfo sbi_ = jss.Deserialize<ShortFaultBasicInfo>(alarm.SVALUE3);
                    FaultBasicInfo fbi_ = sbi.ConvertToFaultBasicInfo();
                    string[] captions = new string[fbi.FRAME_INFO.Length];
                    FrameInfo fi = fbi.FRAME_INFO[FRAMENO];
                    alarm.NVALUE1 = fi.SPEED;//速度
                    alarm.NVALUE2 = fi.LINE_HEIGHT;//导高
                    alarm.NVALUE3 = fi.PULLING_VALUE;//拉出值
                    alarm.NVALUE4 = fi.TEMP_IRV;//红外温度
                    alarm.NVALUE5 = fi.TEMP_ENV;//环境温度
                }
            }
            //可见光
            if (CVI != -1)
            {
                fbi.FLAG[1] = 1;
                fbi.VI_IDX = CVI;// playIndex[faultIndex].VI;
                alarm.SVALUE5 = fbi.VI_DIR + "/" + "Images_" + (fbi.VI_IDX + sbi.START_IDX) + ".jpg";
            }
            if (COA != -1)
            {
                fbi.FLAG[2] = 1;
                fbi.OVA_IDX = COA;// playIndex[faultIndex].OA;
                alarm.SVALUE9 = fbi.OVA_DIR + "/" + "Images_" + (fbi.OVA_IDX + fbi.START_IDX) + ".jpg";
            }
            if (COB != -1 && playIndex[playIndex.Length - 1].OB != 0)
            {
                fbi.FLAG[3] = 1;
                fbi.OVB_IDX = COB;// playIndex[faultIndex].OB;
                alarm.SVALUE9 = fbi.OVB_DIR + "/" + "Images_" + (fbi.OVB_IDX + fbi.START_IDX) + ".jpg";
            }
            fbi.CalcPlayIndex(SharedDefinition.FileNameUtil.IsGuotieFile(alarm.SVALUE14));
            sbi = fbi.ConvertToShortFaultBasicInfo();
            alarm.SVALUE3 = jss.Serialize(sbi);
            if (Api.ServiceAccessor.GetAlarmService().updateC3Alarm(alarm))
            {
                re = true;
            }

            Api.ServiceAccessor.GetAlarmService().UpdateTransData(alarmid);//更新转发表，2016.11.16新增

            Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "拉出值超限自动设置缺陷帧", Api.Util.Public.FunNames.报警监控.ToString(), Public.GetLoginIP, "对报警<a  href=javascript:ShowWinOpen(\\\"../../C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmID=" + alarmid + "\\\")>" + alarmid + "</a>进行了修改缺陷帧操作(全通道)," + " 缺陷帧序号" + (FRAMENO + 1), "", true);
            if ((alarm.SEVERITY.Equals("一类") || alarm.SEVERITY.Equals("二类")) && (!alarm.STATUS.Equals("AFSTATUS01")) && (!alarm.STATUS.Equals("AFSTATUS02")))
            {
                Api.ServiceAccessor.GetAlarmService().updateReportDBForce(alarmid);
            }

        }
        catch (Exception ex)
        {
            log4net.ILog log2 = log4net.LogManager.GetLogger("拉出值超限自动设置缺陷帧(全通道)");
            log2.Error("Error", ex);
        }
        json.Append("{\"sign\":\"" + re + "\"}");
        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);

    }
    public void ReRun()
    {
        string alarmid = HttpContext.Current.Request["alarmid"];//缺陷ID
        string signal = HttpContext.Current.Request["signal"];//重解析标志
        StringBuilder json = new StringBuilder();
        bool re = false;
        re = Alarm_Original.ModifyReRunSign(alarmid, signal);
        json.Append("{\"sign\":\"" + re + "\"}");
        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }
    public void getTemper()
    {
        string backupfile = HttpContext.Current.Request["backupfile"];//备份原始文件目录
        string scsname = HttpContext.Current.Request["scsname"];//SCS文件名称
        string locomotive = HttpContext.Current.Request["locomotive"];//设备号
        string IRVIDX = HttpContext.Current.Request["IRVIDX"];//红外索引
        string IsCrack = HttpContext.Current.Request["IsCrack"];//破解机车标识
        int x1 = string.IsNullOrEmpty(HttpContext.Current.Request["x1"]) ? 320 : Convert.ToInt32(HttpContext.Current.Request["x1"]);//左上角X坐标点
        int y1 = string.IsNullOrEmpty(HttpContext.Current.Request["y1"]) ? 320 : Convert.ToInt32(HttpContext.Current.Request["y1"]);//左下角Y坐标点

        int x2 = string.IsNullOrEmpty(HttpContext.Current.Request["x2"]) ? 0 : Convert.ToInt32(HttpContext.Current.Request["x2"]);//右上角X坐标点
        int y2 = string.IsNullOrEmpty(HttpContext.Current.Request["y2"]) ? 0 : Convert.ToInt32(HttpContext.Current.Request["y2"]);//右下角Y坐标点

        long idx = Convert.ToInt64(IRVIDX);
        string path = "";
        if (!string.IsNullOrEmpty(scsname))
        {
            if (IsCrack == "1")
            {
                scsname = scsname.Replace("_9_", "_1_").Replace(".scs", ".IRV");
            }
            else
            {
                scsname = scsname.Replace("_9_", "_1_").Replace(".scs", ".dlv");
            }
        }
        path = backupfile + scsname;
        string filepath = string.IsNullOrEmpty(path) ? "" : path.Replace("%23", "#");

        string sessionid = HttpContext.Current.Session.SessionID;
        object o = WCF3CDataProvider.ExecuteMetod_T<IDataProvider>("dataProvider", "GetIrvTempData", new object[] { sessionid, locomotive, filepath, idx, x1, y1, x2, y2 });

        StringBuilder json = new StringBuilder();
        json.Append(o);

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }
    /// <summary>
    /// 获取设备部件
    /// </summary>
    /// <param name="context"></param>
    public void GetAlarmDev(HttpContext context)
    {
        string alarmid = HttpContext.Current.Request["alarmid"].Replace("'", "");//缺陷ID
        StringBuilder json = new StringBuilder();
        if (alarmid != "")
        {
            try
            {
                System.Data.DataSet alarm = ADO.AlarmQuery.QueryAlarmByID(alarmid);
                DataTable dt = alarm.Tables[0];
                int frameNo = int.Parse(dt.Rows[0]["NVALUE14"].ToString());
                System.Text.StringBuilder jsonStr = new System.Text.StringBuilder();
                jsonStr.Append("[");
                System.Data.DataSet ds = ADO.AlarmDevDetectTarget.QueryDev(alarmid, frameNo);
                DataTable dt1 = ds.Tables[0];
                //List <AlarmDevDetect> DEV_NAME = new List<AlarmDevDetect>();
                List<AlarmDevDetect> DEV_TYPE = HardDiskLineStandard.ModelConvertHelper<AlarmDevDetect>.ConvertToModel(dt1);
                if (DEV_TYPE.Count > 0)
                {
                    foreach (AlarmDevDetect DEV in DEV_TYPE)
                    {
                        DEV.DEV_NAME = Api.Util.Common.getSysDictionaryInfo(DEV.DEV_TYPE).CODE_NAME;
                    }
                }
                //将重复部件去掉，同时将多个部件按照逗号分隔开来
                for (int i = 0; i < DEV_TYPE.Count; i++)
                {
                    jsonStr.Append("");
                    jsonStr.AppendFormat("'{0}'", DEV_TYPE[i].DEV_NAME);

                    jsonStr.Append(" ,");
                }
                jsonStr.Remove(jsonStr.Length - 1, 1);

                //    //从数据字典中根据编码查询名称（从数据库中查）
                //    //SysDictionaryCond cond = new SysDictionaryCond();
                //    //cond.DIC_CODE = str;
                //    //IList<SysDictionary> retList = Api.ServiceAccessor.GetFoundationService().querySysDictionary(cond);
                //    json.Append("{\"dev\":\"" + str + "\"}");
                //}
                HttpContext.Current.Response.ContentType = "application/json";
                jsonStr.Append("]");
                jsonStr = jsonStr.Replace("'", "\"");
                HttpContext.Current.Response.Write(jsonStr);
            }
            catch (Exception ex)
            {
                log4net.ILog log2 = log4net.LogManager.GetLogger("读取部件信息失败");
                log2.Error("Error", ex);
            }
        }
    }
    /// <summary>
    /// 设备部件属性的结构体
    /// </summary>
    public class PoleStrct
    {
        public string POLE_CODE;
        public string POLE_STRCT_TYPE;
        public string POLE_STRCT_VALUE;
    }
    /// <summary>
    /// 设备部件的结构体
    /// </summary>
    public class AlarmDevDetect
    {
        public string DEV_TYPE;
        public string DEV_NAME;
    }

    /// <summary>
    /// 获取设备属性及值
    /// </summary>
    /// <param name="context"></param>
    public void GetPoleStrct(HttpContext context)
    {
        string device_id = HttpContext.Current.Request["device_id"];//杆号
        StringBuilder json = new StringBuilder();
        if (device_id != "")
        {
            try
            {
                System.Text.StringBuilder jsonStr = new System.Text.StringBuilder();
                jsonStr.Append("{'POLESTRCT':[");
                System.Data.DataSet ds = ADO.AlarmDevDetectTarget.QueryPole(device_id);
                DataTable dt = ds.Tables[0];
                List<PoleStrct> PoleStrctList = HardDiskLineStandard.ModelConvertHelper<PoleStrct>.ConvertToModel(dt);
                //将重复部件去掉，同时将多个部件按照逗号分隔开来
                for (int i = 0; i < PoleStrctList.Count; i++)
                {
                    jsonStr.Append("{");
                    jsonStr.AppendFormat("'POLE_CODE':'{0}',", PoleStrctList[i].POLE_CODE);
                    jsonStr.AppendFormat("'POLE_STRCT_TYPE':'{0}',", PoleStrctList[i].POLE_STRCT_TYPE);
                    jsonStr.AppendFormat("'POLE_STRCT_VALUE':'{0}'", PoleStrctList[i].POLE_STRCT_VALUE);
                    jsonStr.Append(" },");
                }
                jsonStr.Remove(jsonStr.Length - 1, 1);
                HttpContext.Current.Response.ContentType = "application/json";
                jsonStr.Append("]}");
                jsonStr = jsonStr.Replace("'", "\"");
                HttpContext.Current.Response.Write(jsonStr);
            }
            catch (Exception ex)
            {
                log4net.ILog log2 = log4net.LogManager.GetLogger("读取部件属性失败");
                log2.Error("Error", ex);
            }
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