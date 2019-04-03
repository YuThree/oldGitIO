<%@ WebHandler Language="C#" Class="AlarmEdit" %>

using System;
using System.Web;

using Api.Fault.entity.alarm;
using Api.Util;
using System.Collections.Generic;
using Api.Event.entity;
using Api.Foundation.entity.Cond;
using Api.Foundation.entity.Foundation;
using Fault.Dao;
using SharedDefinition.Definitions;
using System.Data;
using System.IO;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Web.Script.Serialization;
using Newtonsoft.Json;
using System.Linq;

public class AlarmEdit : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "text/plain";
        switch (context.Request["active"])
        {
            case "Load":
                Load();
                break;
            case "C1Load":
                C1Load();
                break;
            case "Save":
                Save(context);
                break;
            case "Marker":
                Marker();
                break;
            case "ModifyFrameInfo":
                ModifyFrameInfo();
                break;
            case "CalculateStagger":
                CalculateStagger();//手动计算拉出值，保存
                break;
            case "StaggerSelect":
                SelectStaggerGroup();//多组拉出值选择保存
                break;
        }


    }
    public void C1Load()
    {
        string alarmid = HttpContext.Current.Request["alarmid"];
        C1_Alarm m = Api.ServiceAccessor.GetAlarmService().getC1Alarm(alarmid);
        string result = null;
        result = "{"
                    + "\"SPEED\":\"" + m.SPEED + "\","//速度
                    + "\"F_ALL\":\"" + m.F_ALL + "\","//网压和
                    + "\"F1\":\"" + m.F1 + "\", "//网压1
                    + "\"F2\":\"" + m.F2 + "\", "//网压2
                    + "\"F3\":\"" + m.F3 + "\", "//网压3
                    + "\"F4\":\"" + m.F4 + "\", "//网压4

                    + "\"H1\":\"" + m.H1 + "\","//硬点1
                    + "\"H2\":\"" + m.H2 + "\","//硬点2

                    + "\"STAGGER_T\":\"" + m.STAGGER_T + "\","//接触式拉出
                    + "\"STAGGER_NT\":\"" + m.STAGGER_NT + "\","//非接触式拉出

                    + "\"DAOGAO_T\":\"" + m.DAOGAO_T + "\","//接触式导高
                    + "\"DAOGAO_NT\":\"" + m.DAOGAO_NT + "\","//非接触式导高

                    + "\"PARRALELDISTANCE\":\"" + m.PARRALELDISTANCE + "\","//平行线间距
                    + "\"PARRALELELEVATION\":\"" + m.PARRALELELEVATION + "\","//平行线高差

                    + "\"PARRALELTYPE\":\"" + m.PARRALELTYPE + "\", "//平行线类型
                    + "\"LINESLOPE\":\"" + m.LINESLOPE + "\", "//导线坡度
                    + "\"KUAJU\":\"" + m.KUAJU + "\", "//跨距
                    + "\"KUANEIGAOCHAO\":\"" + m.KUANEIGAOCHAO + "\", "//跨内高差
                    + "\"OFFLINE_TIME\":\"" + m.OFFLINE_TIME + "\", "//离线时间
                    + "\"TEMPERATURE\":\"" + m.TEMPERATURE + "\", "//温度
                    + "\"HUMIDITY\":\"" + m.HUMIDITY + "\", "//离线时间
                    + "\"DINGWEIGUANPODU\":\"" + m.DINGWEIGUANPODU + "\", "//定位管坡度
                    + "\"PIANMO\":\"" + m.PIANMO + "\", "//偏磨
                    + "\"LINETYPE\":\"" + m.LINETYPE + "\", "//导线类型
                    + "\"BCDAOGAO_T\":\"" + m.BCDAOGAO_T + "\", "//补偿接触式导高
                    + "\"BCDAOGAO_NT\":\"" + m.BCDAOGAO_NT + "\", "//补偿非接触式导高
                    + "\"ISXIANJIE\":\"" + m.ISXIANJIE + "\", "//是否限界
                    + "\"XIANJIE\":\"" + m.XIANJIE + "\", "//限界
                    + "\"BCSTAGGER_T\":\"" + m.BCSTAGGER_T + "\", "//接触式补偿拉出值
                    + "\"BCSTAGGER_NT\":\"" + m.BCSTAGGER_NT + "\", ";//非接触式补偿拉出值


        result += "}";
        HttpContext.Current.Response.Write(Newtonsoft.Json.JsonConvert.DeserializeObject(result.Replace("-1000", "")));

    }
    public void Load()
    {

        string alarmid = HttpContext.Current.Request["alarmid"];

        Alarm m = Api.ServiceAccessor.GetAlarmService().getAlarm(alarmid);
        string result = null;
        if (m.CATEGORY_CODE != "3C" && m.SVALUE10 == "0")
            m.SVALUE10 = "";

        result = "{"
                    + "\"LINE_CODE\":\"" + m.LINE_CODE + "\","//线路code
                    + "\"LINE_NAME\":\"" + m.LINE_NAME + "\","//线路
                    + "\"POSITION_CODE\":\"" + m.POSITION_CODE + "\", "//区站
                    + "\"POSITION_NAME\":\"" + m.POSITION_NAME + "\", "//区站
                    + "\"BRG_TUN_NAME\":\"" + m.BRG_TUN_NAME + "\", "//桥隧
                    + "\"BRG_TUN_CODE\":\"" + m.BRG_TUN_CODE + "\", "//桥隧

                    + "\"DIRECTION\":\"" + m.DIRECTION + "\","//行别
                    + "\"KM_MARK\":\"" + (m.KM_MARK >= my_const.MAX_KM || m.KM_MARK <= my_const.MIN_KM ? "" : m.KM_MARK.ToString()) + "\","//公里标

                    + "\"BUREAU_NAME\":\"" + m.BUREAU_NAME + "\","//局
                    + "\"BUREAU_CODE\":\"" + m.BUREAU_CODE + "\","//局code
                    + "\"POWER_SECTION_NAME\":\"" + m.POWER_SECTION_NAME + "\","//供电段名称
                    + "\"POWER_SECTION_CODE\":\"" + m.POWER_SECTION_CODE + "\","//供电段code
                    + "\"WORKSHOP_CODE\":\"" + m.WORKSHOP_CODE + "\","//供电车间Code
                    + "\"WORKSHOP_NAME\":\"" + m.WORKSHOP_NAME + "\","//供电车间Name
                    + "\"ORG_CODE\":\"" + m.ORG_CODE + "\", "//工区Code
                    + "\"ORG_NAME\":\"" + m.ORG_NAME + "\", "//工区名称

                    + "\"POLE_NUMBER\":\"" + m.POLE_NUMBER + "\", "//杆号

            + "\"AssistantPosition\":\"" + m.SVALUE10 + "\", "//辅助定位

        + "\"NVALUE1\":\"" + m.NVALUE1 + "\", "//速度
        + "\"NVALUE2\":\"" + myfiter.GetLINE_HEIGHT(m.NVALUE2) + "\", "//导高
        + "\"NVALUE3\":\"" + myfiter.GetPULLING_VALUE(m.NVALUE3) + "\", "//拉出
        + "\"NVALUE4\":\"" + m.NVALUE4 + "\", "//报警温度
        + "\"NVALUE5\":\"" + m.NVALUE5 + "\", "//环境温度
        + "\"DVALUE1\":\"" + m.DVALUE1 + "\", "//收到FaulI文件时间
        + "\"DVALUE2\":\"" + m.DVALUE2 + "\", "//收到红外视频时间
        + "\"DVALUE3\":\"" + m.DVALUE3 + "\", "//收到可见光视频时间
        + "\"DVALUE4\":\"" + m.DVALUE4 + "\", "//收到全景I视频时间
        + "\"DVALUE5\":\"" + m.DVALUE5 + "\", "//收到全景II视频时间
        + "\"GIS_X\":\"" + m.GIS_X + "\", "//X
        + "\"GIS_Y\":\"" + m.GIS_Y + "\", "//Y
        + "\"IS_TYPICAL\":\"" + m.IS_TYPICAL + "\", "//Y
                                                     //+ "\"SVALUE3\":\"" + m.SVALUE3.Replace("\"", "'") + "\",";//Y
        + "\"SVALUE3\":" + ((string.IsNullOrEmpty(m.SVALUE3) || m.SVALUE3.IndexOf("{") < 0) ? "\"\"" : Newtonsoft.Json.JsonConvert.DeserializeObject(m.SVALUE3));

        // m.NVALUE2 = Convert.ToInt32(context.Request.Form["txt_DG"]);

        result += "}";
        HttpContext.Current.Response.Write(result);

    }


    public void Save(HttpContext context)
    {

        string alarmid = context.Request["alarmid"];//缺陷ID
        Alarm m = Api.ServiceAccessor.GetAlarmService().getAlarm(alarmid);
        if (!string.IsNullOrEmpty(context.Request["lineCode"]))
        {
            if (m.LINE_CODE != context.Request["lineCode"])
            {
                m.POS_CONFIRMED = "9";//修改位置信息时可靠度改为1,前后信息不一样才改正
            }
            m.LINE_CODE = context.Request["lineCode"];

            m.LINE_NAME = context.Request["linename"];
        }
        else
        {
            m.LINE_CODE = null;
            m.LINE_NAME = null;
        }
        if ("0" != context.Request.Form["positionselect"])
        {

            if (m.POSITION_CODE != context.Request.Form["positionselect"])
            {
                m.POS_CONFIRMED = "9";//修改位置信息时可靠度改为1,前后信息不一样才改正
            }

            if (context.Request.Form["POLE_DIRECTION"] == "下行")
            {
                m.POSITION_CODE = context.Request.Form["positionselect"];
                string QZname = Common.getStationSectionInfo(context.Request.Form["positionselect"]).POSITION_NAME;
                m.POSITION_NAME = QZname;
                if (QZname.IndexOf("－") > 0)
                {
                    string[] QZnamearry = QZname.Split('－');
                    m.POSITION_NAME = QZnamearry[1] + "－" + QZnamearry[0];
                }
            }
            else
            {
                m.POSITION_CODE = context.Request.Form["positionselect"];
                m.POSITION_NAME = Common.getStationSectionInfo(m.POSITION_CODE).POSITION_NAME;// context.Request.Form["POSITION_NAME"]; 
            }
        }
        else
        {
            m.POSITION_CODE = null;
            m.POSITION_NAME = null;

        }


        if ("0" != context.Request.Form["brgtunselect"])
        {
            if (m.BRG_TUN_CODE != context.Request.Form["brgtunselect"])
            {
                m.POS_CONFIRMED = "9";//修改位置信息时可靠度改为1,前后信息不一样才改正
            }
            m.BRG_TUN_CODE = context.Request.Form["brgtunselect"];
            m.BRG_TUN_NAME = Common.getBridgeTuneInfo(m.BRG_TUN_CODE).BRG_TUN_NAME; //context.Request.Form["BRG_TUN_NAME"];

            m.POS_CONFIRMED = "9";//修改位置信息时可靠度改为1
        }
        else
        {
            m.BRG_TUN_CODE = null;
            m.BRG_TUN_NAME = null;
        }

        if (!String.IsNullOrEmpty(context.Request.Form["POLE_DIRECTION"]))
        {
            if (m.DIRECTION != context.Request.Form["POLE_DIRECTION"])
            {
                m.POS_CONFIRMED = "9";//修改位置信息时可靠度改为1,前后信息不一样才改正
            }
            m.DIRECTION = context.Request.Form["POLE_DIRECTION"];
        }
        else
        {
            m.DIRECTION = context.Request.Form["POLE_DIRECTION"];
        }

        if (!String.IsNullOrEmpty(context.Request.Form["txt_km"]))
        {
            if (m.KM_MARK != Convert.ToInt32(context.Request.Form["txt_km"]))
            {
                m.POS_CONFIRMED = "9";//修改位置信息时可靠度改为1,前后信息不一样才改正
            }
            m.KM_MARK = Convert.ToInt32(context.Request.Form["txt_km"]);
        }
        else
            m.KM_MARK = -99999999;

        m.SVALUE10 = context.Request.Form["txt_fzdw"];


        if (!String.IsNullOrEmpty(context.Request.Form["POLE_NO"]))
        {
            if (m.POLE_NUMBER != context.Request.Form["POLE_NO"])
            {
                m.POS_CONFIRMED = "9";//修改位置信息时可靠度改为1,前后信息不一样才改正
            }
            m.POLE_NUMBER = context.Request.Form["POLE_NO"];
        }
        else
            m.POLE_NUMBER = null;

        //铁路局 BUREAU_CODE
        if ("0" != context.Request.Form["juselect"])
        {
            if (m.BUREAU_CODE != context.Request.Form["juselect"])
            {
                m.POS_CONFIRMED = "9";//修改位置信息时可靠度改为1,前后信息不一样才改正
            }
            m.BUREAU_CODE = context.Request.Form["juselect"];
            m.BUREAU_NAME = Common.getOrgInfo(m.BUREAU_CODE).ORG_NAME;// context.Request.Form["BUREAU_NAME"];

            m.ORG_CODE = m.BUREAU_CODE;
            m.ORG_NAME = m.BUREAU_NAME;
        }
        else
        {
            m.BUREAU_CODE = null;
            m.BUREAU_NAME = null;
        }

        //供电段 POWER_SECTION_CODE
        if ("0" != context.Request.Form["duanselect"])
        {
            if (m.POWER_SECTION_CODE != context.Request.Form["duanselect"])
            {
                m.POS_CONFIRMED = "9";//修改位置信息时可靠度改为1,前后信息不一样才改正
            }
            m.POWER_SECTION_CODE = context.Request.Form["duanselect"];
            m.POWER_SECTION_NAME = Common.getOrgInfo(m.POWER_SECTION_CODE).ORG_NAME;// context.Request.Form["POWER_SECTION_NAME"];

            m.ORG_CODE = m.POWER_SECTION_CODE;
            m.ORG_NAME = m.POWER_SECTION_NAME;
        }
        //else if ("0" != context.Request.Form["juselect"])
        //{
        //    if (m.POWER_SECTION_CODE != context.Request.Form["juselect"])
        //    {
        //        m.POS_CONFIRMED = "9";//修改位置信息时可靠度改为1,前后信息不一样才改正
        //    }
        //    m.POWER_SECTION_CODE = context.Request.Form["juselect"];
        //    m.POWER_SECTION_NAME = Common.getOrgInfo(m.BUREAU_CODE).ORG_NAME;// context.Request.Form["BUREAU_NAME"];
        //}
        else
        {
            m.POWER_SECTION_CODE = null;
            m.POWER_SECTION_NAME = null;
        }

        //车间 WORKSHOP_CODE
        if ("0" != context.Request.Form["chejianselect"])
        {
            if (m.WORKSHOP_CODE != context.Request.Form["chejianselect"])
            {
                m.POS_CONFIRMED = "9";//修改位置信息时可靠度改为1,前后信息不一样才改正
            }
            m.WORKSHOP_CODE = context.Request.Form["chejianselect"];
            m.WORKSHOP_NAME = Common.getOrgInfo(m.WORKSHOP_CODE).ORG_NAME;// context.Request.Form["WORKSHOP_NAME"];

            m.ORG_CODE = m.WORKSHOP_CODE;
            m.ORG_NAME = m.WORKSHOP_NAME;
        }
        else
        {
            m.WORKSHOP_CODE = null;
            m.WORKSHOP_NAME = null;
        }

        //工区 ORG_CODE
        if ("0" != context.Request.Form["juselect"])
        {
             if (m.ORG_CODE != context.Request.Form["juselect"])
            {
                m.POS_CONFIRMED = "9";//修改位置信息时可靠度改为1,前后信息不一样才改正
            }
            m.ORG_CODE = context.Request.Form["juselect"];
            m.ORG_NAME = Common.getOrgInfo(m.BUREAU_CODE).ORG_NAME;// context.Request.Form["BUREAU_NAME"];
        }
        if ("0" != context.Request.Form["duanselect"])
        {
            if (m.ORG_CODE != context.Request.Form["duanselect"])
            {
                m.POS_CONFIRMED = "9";//修改位置信息时可靠度改为1,前后信息不一样才改正
            }
            m.ORG_CODE = context.Request.Form["duanselect"];
            m.ORG_NAME = Common.getOrgInfo(m.ORG_CODE).ORG_NAME;// context.Request.Form["ORG_NAME"];
        }
        if ("0" != context.Request.Form["chejianselect"])
        {
            if (m.WORKSHOP_CODE != context.Request.Form["chejianselect"])
            {
                m.POS_CONFIRMED = "9";//修改位置信息时可靠度改为1,前后信息不一样才改正
            }
            m.ORG_CODE = context.Request.Form["chejianselect"];
            m.ORG_NAME = Common.getOrgInfo(m.WORKSHOP_CODE).ORG_NAME;// context.Request.Form["WORKSHOP_NAME"];
        }
        if ("0" != context.Request.Form["gongquselect"])
        {
            if (m.ORG_CODE != context.Request.Form["gongquselect"])
            {
                m.POS_CONFIRMED = "9";//修改位置信息时可靠度改为1,前后信息不一样才改正
            }
            m.ORG_CODE = context.Request.Form["gongquselect"];
            m.ORG_NAME = Common.getOrgInfo(m.ORG_CODE).ORG_NAME;// context.Request.Form["ORG_NAME"];
        }
        //else
        //{
        //    m.ORG_CODE = null;
        //    m.ORG_NAME = null;
        //}

        if (!string.IsNullOrEmpty(context.Request.Form["NVALUE1"]))
        {
            m.NVALUE1 = Convert.ToInt32(context.Request.Form["NVALUE1"]);
        }
        if (!string.IsNullOrEmpty(context.Request.Form["NVALUE2"]))
        {
            m.NVALUE2 = Convert.ToInt32(context.Request.Form["NVALUE2"]);
        }
        if (!string.IsNullOrEmpty(context.Request.Form["NVALUE3"]))
        {
            m.NVALUE3 = Convert.ToInt32(context.Request.Form["NVALUE3"]);
        }
        if (!string.IsNullOrEmpty(context.Request.Form["NVALUE4"]))
        {
            m.NVALUE4 = Convert.ToInt32(context.Request.Form["NVALUE4"]);
        }
        if (!string.IsNullOrEmpty(context.Request.Form["NVALUE5"]))
        {
            m.NVALUE5 = Convert.ToInt32(context.Request.Form["NVALUE5"]);
        }
        if (!string.IsNullOrEmpty(context.Request.Form["DVALUE1"]) && Convert.ToDateTime(context.Request.Form["DVALUE1"]) >= DateTime.MinValue)
        {
            m.DVALUE1 = Convert.ToDateTime(context.Request.Form["DVALUE1"]);
        }
        if (!string.IsNullOrEmpty(context.Request.Form["DVALUE2"]) && Convert.ToDateTime(context.Request.Form["DVALUE2"]) >= DateTime.MinValue)
        {
            m.DVALUE2 = Convert.ToDateTime(context.Request.Form["DVALUE2"]);
        }
        if (!string.IsNullOrEmpty(context.Request.Form["DVALUE3"]) && Convert.ToDateTime(context.Request.Form["DVALUE3"]) >= DateTime.MinValue)
        {
            m.DVALUE3 = Convert.ToDateTime(context.Request.Form["DVALUE3"]);
        }
        if (!string.IsNullOrEmpty(context.Request.Form["DVALUE4"]) && Convert.ToDateTime(context.Request.Form["DVALUE4"]) >= DateTime.MinValue)
        {
            m.DVALUE4 = Convert.ToDateTime(context.Request.Form["DVALUE4"]);
        }
        if (!string.IsNullOrEmpty(context.Request.Form["DVALUE5"]) && Convert.ToDateTime(context.Request.Form["DVALUE5"]) >= DateTime.MinValue)
        {
            m.DVALUE5 = Convert.ToDateTime(context.Request.Form["DVALUE5"]);
        }
        if (!string.IsNullOrEmpty(context.Request.Form["JSON"]))
        {
            m.SVALUE3 = context.Request.Form["JSON"].Replace("'", "\"");
        }

        bool re = false;
        string reStr = "失败";


        log4net.ILog log2 = log4net.LogManager.GetLogger("报警编辑");
        log2.Debug(m.ID + "绑定实体:（m.POWER_SECTION_CODE：" + m.POWER_SECTION_CODE + ",POWER_SECTION_NAME：" + m.POWER_SECTION_NAME);

        //先对报警进行备份，备份成功时执行修改报警测量信息。
        if (Api.ServiceAccessor.GetAlarmService().InsertAlarmHis(alarmid))
        {

            log2.Debug("完成备份到alarm_hist:" + m.ID);

            if (Api.Util.Common.FunEnable("Fun_UpdateFlag") == false)//外部功能
            {
                Alarm alarm = Api.ServiceAccessor.GetAlarmService().getAlarm(alarmid);
                if (alarm.SVALUE10 != context.Request.Form["txt_fzdw"] || m.POS_CONFIRMED == "9")
                {
                    ADO.ModifyLog.UpdateTableCols(alarmid, "POS", Public.GetUserCode);
                }
            }

            //根据新的位置信息修改device_id
            {
                PoleCond pc = new PoleCond();
                pc.LINE_CODE = m.LINE_CODE;
                pc.POSITION_CODE = m.POSITION_CODE;
                pc.POLE_DIRECTION = m.DIRECTION;
                pc.BRG_TUN_CODE = m.BRG_TUN_CODE;
                pc.startKm = m.KM_MARK;
                pc.endKm = m.KM_MARK;
                pc.POLE_NO = m.POLE_NUMBER;

                IList<Pole> lp = Api.ServiceAccessor.GetFoundationService().queryPole(pc);

                if (lp.Count > 0)
                {
                    m.DEVICE_ID = lp[0].POLE_CODE;
                }
                else
                {
                    m.DEVICE_ID = null;
                }
            }


            re = Api.ServiceAccessor.GetAlarmService().updateAlarm(m);
            if ((m.SEVERITY.Equals("一类") || m.SEVERITY.Equals("二类")) && (!m.STATUS.Equals("AFSTATUS01")) && (!m.STATUS.Equals("AFSTATUS02")))
            {
                Api.ServiceAccessor.GetAlarmService().updateReportDBForce(m.ID);
            }
            //Api.ServiceAccessor.GetAlarmService().updateReportDBForce(alarmid,true);
            log2.Debug("更新操作完成:" + re + ",ID:" + m.ID);
        }
        if (re)
        {

            Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "编辑位置", Api.Util.Public.FunNames.报警监控.ToString(), Public.GetLoginIP, "对报警" + m.ID + "进行了位置编辑", "", true);
            reStr = "成功";

            //编辑位置 保存后 巡检表中的数据同步修改
            int result = ADO.PatrolAndExamine.UpdataEventByEditPosition(m);
        }
        else
        {
            Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "编辑位置", Api.Util.Public.FunNames.报警监控.ToString(), Public.GetLoginIP, "对报警" + m.ID + "进行了位置编辑", "", false);
        }

        HttpContext.Current.Response.Write(reStr);
        Api.ServiceAccessor.GetAlarmService().UpdateTransData(alarmid);

        CheckLcFrame(m, alarmid);//如果是拉出值超限 自动定义缺陷帧
    }

    public void Marker()
    {
        string alarmid = HttpContext.Current.Request["alarmid"];//缺陷ID
        string typical = HttpContext.Current.Request["typical"];//是否为典型缺陷
        string weekly = HttpContext.Current.Request["weekly"];//周报标志

        Alarm m = Api.ServiceAccessor.GetAlarmService().getAlarm(alarmid);
        bool re = false;
        bool re_ = false;

        if (typical == "true")
        {
            m.IS_TYPICAL = "1";
        }
        else
        {
            m.IS_TYPICAL = "0";
        }

        if (weekly == "true")
        {
            m.MY_STR_3 = "1";
        }
        else
        {
            m.MY_STR_3 = "";
        }


        re = Api.ServiceAccessor.GetAlarmService().updateAlarm(m);//更新Alarm表几乎全部字段和aux表部分字段
        re_ = Api.ServiceAccessor.GetAlarmService().UpdateAlarmAUX_ISEXPORTREPORT(m);//只更新一个字段


        HttpContext.Current.Response.Write(re);
    }
    public void ModifyFrameInfo()
    {
        string alarmid = HttpContext.Current.Request["alarmid"];//缺陷id
        string FRAME_NO = HttpContext.Current.Request["FRAME_NO"];//帧序号
        string ROUTING_NO = HttpContext.Current.Request["ROUTING_NO"];//交路号
        string KM_MARK = HttpContext.Current.Request["KM_MARK"];//公里标
        string IRV_TEMP = HttpContext.Current.Request["IRV_TEMP"];//红外最高温度
        string ENV_TEMP = HttpContext.Current.Request["ENV_TEMP"];//环境温度
        string LINE_HEIGHT = HttpContext.Current.Request["LINE_HEIGHT"];//导高值
        string PULLING_VALUE = HttpContext.Current.Request["PULLING_VALUE"];//拉出值
        string SPEED = HttpContext.Current.Request["SPEED"];//速度

        bool sign = false;

        try
        {
            if (Api.ServiceAccessor.GetAlarmService().InsertAlarmHis(alarmid))//将报警数据存入历史表
            {
                Alarm m = Api.ServiceAccessor.GetAlarmService().getAlarm(alarmid);
                C3_Alarm c3alarm = Api.ServiceAccessor.GetAlarmService().SConvertToC3_Alarm(m);

                JavaScriptSerializer jss = new JavaScriptSerializer();
                ShortFaultBasicInfo sbi = jss.Deserialize<ShortFaultBasicInfo>(c3alarm.SVALUE3);
                FaultBasicInfo fbi = sbi.ConvertToFaultBasicInfo();

                if (!string.IsNullOrEmpty(FRAME_NO))
                {
                    int i = Convert.ToInt32(FRAME_NO);
                    if (!string.IsNullOrEmpty(ROUTING_NO))
                    {
                        fbi.FRAME_INFO[i].ROUTING_NO = Convert.ToInt32(ROUTING_NO);
                        if (i == fbi.FAULT_IDX)
                        {
                            c3alarm.ROUTING_NO = ROUTING_NO;
                        }
                    }
                    if (!string.IsNullOrEmpty(KM_MARK))
                    {
                        fbi.FRAME_INFO[i].KM_MARK = Convert.ToInt64(KM_MARK);
                        if (i == fbi.FAULT_IDX)
                        {
                            c3alarm.KM_MARK = Convert.ToInt32(KM_MARK);
                        }
                    }
                    if (!string.IsNullOrEmpty(IRV_TEMP))
                    {
                        fbi.FRAME_INFO[i].TEMP_IRV = Convert.ToInt32(IRV_TEMP);
                        if (i == fbi.FAULT_IDX)
                        {
                            c3alarm.NVALUE4 = Convert.ToInt32(IRV_TEMP);
                        }
                    }
                    if (!string.IsNullOrEmpty(ENV_TEMP))
                    {
                        fbi.FRAME_INFO[i].TEMP_ENV = Convert.ToInt32(ENV_TEMP);
                        if (i == fbi.FAULT_IDX)
                        {
                            c3alarm.NVALUE5 = Convert.ToInt32(ENV_TEMP);
                        }
                    }
                    if (!string.IsNullOrEmpty(LINE_HEIGHT))
                    {
                        fbi.FRAME_INFO[i].LINE_HEIGHT = Convert.ToInt32(LINE_HEIGHT);
                        if (i == fbi.FAULT_IDX)
                        {
                            c3alarm.NVALUE2 = Convert.ToInt32(LINE_HEIGHT);
                        }
                    }
                    if (!string.IsNullOrEmpty(PULLING_VALUE))
                    {
                        fbi.FRAME_INFO[i].PULLING_VALUE = Convert.ToInt32(PULLING_VALUE);
                        if (i == fbi.FAULT_IDX)
                        {
                            c3alarm.NVALUE3 = Convert.ToInt32(PULLING_VALUE);
                        }
                    }
                    if (!string.IsNullOrEmpty(SPEED))
                    {
                        fbi.FRAME_INFO[i].SPEED = Convert.ToInt32(SPEED);
                        if (i == fbi.FAULT_IDX)
                        {
                            c3alarm.NVALUE1 = Convert.ToInt32(SPEED);
                        }
                    }
                }
                sbi = fbi.ConvertToShortFaultBasicInfo();
                c3alarm.SVALUE3 = jss.Serialize(sbi);
                sign = Api.ServiceAccessor.GetAlarmService().updateC3Alarm(c3alarm);

                CheckLcFrame(m, alarmid);//如果是拉出值超限 自动定义缺陷帧
            }
        }
        catch (Exception ex)
        {
            log4net.ILog log = log4net.LogManager.GetLogger("修改全帧信息");
            log.Error("执行出错", ex);
        }

        string jsonsign = HttpContext.Current.Request["jsonsign"];
        if (!string.IsNullOrEmpty(jsonsign))
        {
            StringBuilder json = new StringBuilder();
            json.Append("{\"sign\":\"" + sign + "\"}");
            HttpContext.Current.Response.ContentType = "application/json";
            HttpContext.Current.Response.Write(json);
        }
        else
        {
            HttpContext.Current.Response.Write(sign);
        }
    }

    ///// <summary>
    ///// 手动计算拉出值，保存
    ///// </summary>
    public void CalculateStagger()
    {
        string alarmid = HttpContext.Current.Request["alarmid"];//缺陷id
        string FRAME_NO = HttpContext.Current.Request["FRAME_NO"];//帧序号
        string ROUTING_NO = HttpContext.Current.Request["ROUTING_NO"];//交路号
        string KM_MARK = HttpContext.Current.Request["KM_MARK"];//公里标
        string IRV_TEMP = HttpContext.Current.Request["IRV_TEMP"];//红外最高温度
        string ENV_TEMP = HttpContext.Current.Request["ENV_TEMP"];//环境温度
        string LINE_HEIGHT = HttpContext.Current.Request["LINE_HEIGHT"];//导高值
        string PULLING_VALUE = HttpContext.Current.Request["PULLING_VALUE"];//拉出值
        string SPEED = HttpContext.Current.Request["SPEED"];//速度
        string isFault = HttpContext.Current.Request["isfault"];//是否为缺陷帧
        string centerX = HttpContext.Current.Request["centerx"];//中心点X坐标
        string centerY = HttpContext.Current.Request["centery"];//中心点Y坐标

        bool sign = false;

        try
        {
            if (Api.ServiceAccessor.GetAlarmService().InsertAlarmHis(alarmid))//将报警数据存入历史表
            {
                Alarm m = Api.ServiceAccessor.GetAlarmService().getAlarm(alarmid);
                C3_Alarm c3alarm = Api.ServiceAccessor.GetAlarmService().SConvertToC3_Alarm(m);

                JavaScriptSerializer jss = new JavaScriptSerializer();
                ShortFaultBasicInfo sbi = jss.Deserialize<ShortFaultBasicInfo>(c3alarm.SVALUE3);
                FaultBasicInfo fbi = sbi.ConvertToFaultBasicInfo();

                if (!string.IsNullOrEmpty(FRAME_NO))
                {
                    int i = Convert.ToInt32(FRAME_NO);
                    if (!string.IsNullOrEmpty(ROUTING_NO))
                    {
                        fbi.FRAME_INFO[i].ROUTING_NO = Convert.ToInt32(ROUTING_NO);
                    }
                    if (!string.IsNullOrEmpty(KM_MARK))
                    {
                        fbi.FRAME_INFO[i].KM_MARK = Convert.ToInt64(KM_MARK);
                    }
                    if (!string.IsNullOrEmpty(IRV_TEMP))
                    {
                        fbi.FRAME_INFO[i].TEMP_IRV = Convert.ToInt32(IRV_TEMP);
                    }
                    if (!string.IsNullOrEmpty(ENV_TEMP))
                    {
                        fbi.FRAME_INFO[i].TEMP_ENV = Convert.ToInt32(ENV_TEMP);
                    }
                    if (!string.IsNullOrEmpty(LINE_HEIGHT))
                    {
                        fbi.FRAME_INFO[i].LINE_HEIGHT = Convert.ToInt32(LINE_HEIGHT);
                    }
                    if (!string.IsNullOrEmpty(PULLING_VALUE))
                    {
                        fbi.FRAME_INFO[i].PULLING_VALUE = Convert.ToInt32(PULLING_VALUE);
                    }
                    if (!string.IsNullOrEmpty(SPEED))
                    {
                        fbi.FRAME_INFO[i].SPEED = Convert.ToInt32(SPEED);
                    }
                }

                //如果为缺陷帧，要同步修改报警拉出值
                if (isFault == "true")
                {
                    c3alarm.NVALUE3 = Convert.ToInt32(PULLING_VALUE);
                }

                sbi = fbi.ConvertToShortFaultBasicInfo();
                c3alarm.SVALUE3 = jss.Serialize(sbi);
                sign = Api.ServiceAccessor.GetAlarmService().updateC3Alarm(c3alarm);

                //保存到拉出值表
                if (sign == true)
                {
                    int result = ADO.AlarmQuery.UpdateStaggerTable(alarmid, Convert.ToInt32(FRAME_NO), Convert.ToInt32(PULLING_VALUE), centerX, centerY);
                }
                CheckLcFrame(m, alarmid);//如果是拉出值超限 自动定义缺陷帧
            }

        }
        catch (Exception ex)
        {
            log4net.ILog log = log4net.LogManager.GetLogger("修改全帧信息");
            log.Error("执行出错", ex);
        }
        HttpContext.Current.Response.Write(sign);
    }
    public void CheckLcFrame(Alarm alarm, string id)
    {
        //拉出值会自动重新定义缺陷帧
        if (alarm.CODE == "AFCODELCZ")
        {
            Alarm m1 = Api.ServiceAccessor.GetAlarmService().getAlarm(id);
            C3_Alarm c3alarm1 = Api.ServiceAccessor.GetAlarmService().SConvertToC3_Alarm(m1);
            JavaScriptSerializer jss1 = new JavaScriptSerializer();
            ShortFaultBasicInfo sbi1 = jss1.Deserialize<ShortFaultBasicInfo>(c3alarm1.SVALUE3);
            FaultBasicInfo fbi1 = sbi1.ConvertToFaultBasicInfo();

            string FRAME_INFO_LIST = jss1.Serialize(fbi1.FRAME_INFO);
            Newtonsoft.Json.Linq.JArray jo = (Newtonsoft.Json.Linq.JArray)JsonConvert.DeserializeObject(FRAME_INFO_LIST);

            List<int> pulls = new List<int>();
            for (int i = 0; i <= jo.Count - 1; i++)
            {
                if (Convert.ToInt32(jo[i]["PULLING_VALUE"].ToString()) <= my_const.MIN_PULLING_VALUE)
                {
                    pulls.Add(0);//占位
                    continue;
                }

                int pull = System.Math.Abs(int.Parse(jo[i]["PULLING_VALUE"].ToString()));//获取真实拉出值的绝对值
                pulls.Add(pull);
            }
            var vv = pulls.Max();//获取最大的拉出值
            int index = pulls.FindIndex(x => x == vv);//获取最大拉出值的索引

            string severity = "三类";
            if (m1.DETECT_DEVICE_CODE.Contains("380D") || m1.DETECT_DEVICE_CODE.Contains("380BL"))
            {
                if (vv >= 500)
                    severity = "一类";
            }
            else if (m1.DETECT_DEVICE_CODE.Contains("CRH380B-5881") || m1.DETECT_DEVICE_CODE.Contains("CRH380B-5882") || m1.DETECT_DEVICE_CODE.Contains("CRH380B-5883") || m1.DETECT_DEVICE_CODE.Contains("CRH380B-5884"))
            {
                if (vv >= 500)
                    severity = "一类";
            }
            else
            {
                if (vv >= 500)
                    severity = "一类";
                else if (vv >= 450 && vv < 500)
                    severity = "二类";
            }

            SetAlarmFrameAll(id, index, severity);//设置新的缺陷帧对应的展示信息值（拉出值，导高值，速度，温度....）
        }
    }
    // <summary>
    /// 设置缺陷帧对应的值
    /// </summary>
    /// <param name="id"></param>
    /// <param name="frame"></param>
    /// <returns></returns>
    public bool SetAlarmFrameAll(string id, int frame, string severity)
    {
        bool re = false;
        try
        {
            string alarmid = id;
            int FRAMENO = frame;

            //将原始报警信息存入历史表
            bool history = Api.ServiceAccessor.GetAlarmService().InsertAlarmHis(alarmid);

            Alarm a = Api.ServiceAccessor.GetAlarmService().getAlarm(alarmid);
            C3_Alarm alarm = Api.ServiceAccessor.GetAlarmService().SConvertToC3_Alarm(a);
            JavaScriptSerializer jss = new JavaScriptSerializer();
            MyPlayIndex[] playIndex = jss.Deserialize<MyPlayIndex[]>(alarm.PLAY_IDX);
            ShortFaultBasicInfo sbi = jss.Deserialize<ShortFaultBasicInfo>(alarm.SVALUE3);
            FaultBasicInfo fbi = sbi.ConvertToFaultBasicInfo();

            alarm.SEVERITY = severity;//报警级别
            int CVI = -1;
            int COA = -1;
            int COB = -1;
            if (FRAMENO != -1)
            {
                //for (int i = 0; i < playIndex.Length - 1; i++)
                //{
                //    if (FRAMENO == playIndex[i].IR)
                //    {
                //     //   CVI = playIndex[i].VI;//当前红外帧序号对应的可见光帧序号
                //     //   COA = playIndex[i].OA;//当前红外帧序号对应的全景A帧序号
                //    //    COB = playIndex[i].OB;//当前红外帧序号对应的全景B帧序号
                //        break;
                //    }
                //}
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
            if (COA != -1 && sbi.OVA_NUM > 0)
            {
                fbi.FLAG[2] = 1;
                fbi.OVA_IDX = COA;// playIndex[faultIndex].OA;
                alarm.SVALUE9 = fbi.OVA_DIR + "/" + "Images_" + (fbi.OVA_IDX + fbi.START_IDX) + ".jpg";
            }
            if (COB != -1 && sbi.OVB_NUM > 0)
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

        return re;
    }
    //多组拉出值选择保存
    public void SelectStaggerGroup()
    {
        string alarmid = HttpContext.Current.Request["alarmid"];//报警ID
        string staggergroup = HttpContext.Current.Request["staggerno"];//拉出值组编号
        bool sign = false;//更新标志

        ////规范化字段名称
        if (!String.IsNullOrEmpty(staggergroup))
        {
            staggergroup = "STAGGER" + staggergroup;
        }

        //数据查询
        System.Data.DataSet ds = ADO.AlarmQuery.QueryStaggerInfo(alarmid);

        //更新Alarm表SVALUE3
        if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
        {
            Alarm m = Api.ServiceAccessor.GetAlarmService().getAlarm(alarmid);
            C3_Alarm c3alarm = Api.ServiceAccessor.GetAlarmService().SConvertToC3_Alarm(m);

            JavaScriptSerializer jss = new JavaScriptSerializer();
            ShortFaultBasicInfo sbi = jss.Deserialize<ShortFaultBasicInfo>(c3alarm.SVALUE3);
            FaultBasicInfo fbi = sbi.ConvertToFaultBasicInfo();

            for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
            {
                if (ds.Tables[0].Rows[i][staggergroup] != DBNull.Value)//空值不做更新
                {
                    fbi.FRAME_INFO[i].PULLING_VALUE = Convert.ToInt32(ds.Tables[0].Rows[i][staggergroup].ToString());
                }
            }
            sbi = fbi.ConvertToShortFaultBasicInfo();
            c3alarm.SVALUE3 = jss.Serialize(sbi);

            if (ds.Tables[0].Rows[fbi.FAULT_IDX][staggergroup] != DBNull.Value)
            {
                c3alarm.NVALUE3 = Convert.ToInt32(ds.Tables[0].Rows[fbi.FAULT_IDX][staggergroup].ToString());
            }

            Api.ServiceAccessor.GetAlarmService().InsertAlarmHis(alarmid);//将报警信息添加到历史表
            sign = Api.ServiceAccessor.GetAlarmService().updateC3Alarm(c3alarm);

            if (sign == true)
            {
                int UpdateStagger = ADO.AlarmQuery.UpdateStaggerGroup(alarmid, staggergroup);//更新拉出值表
                HttpContext.Current.Response.Write("true");

                CheckLcFrame(m, alarmid);//如果是拉出值超限 自动定义缺陷帧
            }
            else
            {
                HttpContext.Current.Response.Write("false");//更新失败
            }
        }
        else
        {
            HttpContext.Current.Response.Write("false");//更新失败
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