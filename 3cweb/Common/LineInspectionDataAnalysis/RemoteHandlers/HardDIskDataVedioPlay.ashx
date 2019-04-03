<%@ WebHandler Language="C#" Class="HardDIskDataVedioPlay" %>

using System;
using System.Web;
using System.Text;
using Api.Fault.entity.alarm;
using Api.ADO.entity;
using System.Collections.Generic;
using System.Web.Caching;
using System.Net;
using _3CDataProviderService;
using System.IO;
using System.Drawing;
using System.Runtime.Serialization.Formatters.Binary;
using System.Web.SessionState;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Text.RegularExpressions;

public class HardDIskDataVedioPlay : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        try
        {
            string action = context.Request["action"];
            switch (action)
            {
                case "VedioPlayList":
                    getVedioPlayList();
                    break;
                case "IRVTemp":
                    getIRVTemp();
                    break;
                case "IsAlarmExist":
                    getAlarm();
                    break;
                case "ModifiedPrioriy":
                    modifyPrioriy(context);
                    break;
                case "AlarmSure":
                    AlarmSure();
                    break;
                case "Index":
                    getIndex();
                    break;
                case "TotalPages":
                    getTotalPages();
                    break;
                case "locomotive":
                    getLocomotiveInfo();
                    break;
                case "AlarmList":
                    getAlarmList();
                    break;
                case "FileInfoList":
                    getFileInfoList();
                    break;
                case "FileTaskPlayList":
                    getFileTaskPlayList();
                    break;
                case "FileTaskTotalPages":
                    getTotalFileTaskPages();
                    break;
            }
        }
        catch (Exception ex)
        {
            log4net.ILog log = log4net.LogManager.GetLogger("硬盘数据播放");
            log.Error("执行出错", ex);
        }
    }

    private System.Data.DataSet tds = new System.Data.DataSet();

    private void modifyPrioriy(HttpContext context)
    {
        string line_code = HttpContext.Current.Request["line_code"];//杆序号
        string direction = HttpContext.Current.Request["direction"];//方向
        string start_timestamp = HttpContext.Current.Request["start_timestamp"];//方向
        string end_timestamp = HttpContext.Current.Request["end_timestamp"];//方向
        string prioriy = HttpContext.Current.Request["prioriy"];//方向
        string bow_position_code = HttpContext.Current.Request["bow_position_code"];//方向
        string loco = HttpContext.Current.Request["loco"];//方向
        string start_id = HttpContext.Current.Request["start_id"];//方向
        string end_id = HttpContext.Current.Request["end_id"];//方向
        string start_POLE_SERIALNO = HttpContext.Current.Request["start_POLE_SERIALNO"];//方向
        string end_POLE_SERIALNO = HttpContext.Current.Request["end_POLE_SERIALNO"];//方向

        //DateTime dtStart = TimeZone.CurrentTimeZone.ToLocalTime(new DateTime(1970, 1, 1, 0, 0, 0));
        //long lTime1 = long.Parse(start_timestamp + "0000");
        //TimeSpan toNow1 = new TimeSpan(lTime1);
        //DateTime start_time = dtStart.Add(toNow1);

        //long lTime2 = long.Parse(end_timestamp + "0000");
        //TimeSpan toNow2 = new TimeSpan(lTime2);
        //DateTime end_time = dtStart.Add(toNow2);

        bool result = ADO.HardDiskData.ModifiedPrioriy(line_code, direction, start_timestamp, end_timestamp, bow_position_code, prioriy, loco, start_id, end_id, start_POLE_SERIALNO, end_POLE_SERIALNO);

        //触发标准线路重计算
        if (result)
        {
            if (!string.IsNullOrEmpty(line_code) && !string.IsNullOrEmpty(direction))
                ADO.HardDiskData.ModifiedLineStatus(line_code, direction, start_POLE_SERIALNO, end_POLE_SERIALNO);
        }

        StringBuilder json = new StringBuilder();

        json.Append("{\"RESULT\":\"" + result.ToString() + "\"}");

        context.Response.ContentType = "application/json";
        context.Response.Write(json);
    }

    /// <summary>
    /// 硬盘数据播放list
    /// </summary>
    public void getVedioPlayList()
    {
        string line_code = HttpContext.Current.Request["line_code"];//线路编码
        string pole_direction = HttpContext.Current.Request["pole_direction"];//行别
        string position_code = HttpContext.Current.Request["position_code"];//区站编码                                                                          
        string start_timestamp = HttpContext.Current.Request["start_timestamp"];//开始红外时间戳
        string end_timestamp = HttpContext.Current.Request["end_timestamp"];//结束时间
        string locomotive_code = HttpContext.Current.Request["locomotive_code"];//设备号
        string bow_position_code = HttpContext.Current.Request["bow_position_code"];//弓位置编码
        string total = HttpContext.Current.Request["total"];//总条数

        int pageIndex = string.IsNullOrEmpty("pageIndex") ? 1 : Convert.ToInt32(HttpContext.Current.Request["pageIndex"]);//当前页
        int pageSize = string.IsNullOrEmpty("pageSize") ? 30 : Convert.ToInt32(HttpContext.Current.Request["pageSize"]);//页大小

        int startrow = pageSize * (pageIndex - 1) + 1;
        int endrow = pageSize * pageIndex;
        if (!string.IsNullOrEmpty(locomotive_code) && string.IsNullOrEmpty(bow_position_code))
        {
            string relations = Api.Util.Common.getLocomotiveInfo(locomotive_code).DEVICE_BOW_RELATIONS;
            if (!string.IsNullOrEmpty(relations) && relations.Contains("#"))
            {
                bow_position_code = "#1_A";
            }
            else
            {
                bow_position_code = "_A";
            }
        }

        System.Data.DataSet ds = ADO.HardDiskData.GetDetailByPage(line_code, pole_direction, position_code, start_timestamp, end_timestamp, locomotive_code, bow_position_code, startrow, endrow);

        //传送播放文件摘要信息    
        //tds = ds;
        string path_json = "";
        path_json = getFileInfoList();

        StringBuilder json = new StringBuilder();

        json.Append("{\"data\":[");

        for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
        {
            DateTime time = new DateTime();
            DateTime dtStart = TimeZone.CurrentTimeZone.ToLocalTime(new DateTime(1970, 1, 1, 0, 0, 0));
            long lTime = long.Parse(ds.Tables[0].Rows[i]["TIMESTAMP_IRV"] + "0000");
            TimeSpan toNow = new TimeSpan(lTime);
            time = dtStart.Add(toNow);

            json.Append("{");
            json.Append("\"ID\":\"" + ds.Tables[0].Rows[i]["ID"] + "\",");//唯一标识
            json.Append("\"TIMESTAMP_IRV\":\"" + ds.Tables[0].Rows[i]["TIMESTAMP_IRV"] + "\",");//红外时间戳
            json.Append("\"time\":\"" + time.ToString("yyyy-MM-dd HH:mm:ss") + "\",");
            json.Append("\"N_SATELLITE\":\"" + ds.Tables[0].Rows[i]["N_SATELLITE"] + "\",");//卫星数
            json.Append("\"N_STAGGER\":\"" + myfiter.GetPULLING_VALUE(ds.Tables[0].Rows[i]["N_STAGGER"]) + "\",");//拉出值
            json.Append("\"N_HIGH\":\"" + myfiter.GetLINE_HEIGHT(ds.Tables[0].Rows[i]["N_HIGH"]) + "\",");//导高值
            json.Append("\"N_IRV_TEMP\":\"" + myfiter.GetTEMP(string.IsNullOrEmpty(ds.Tables[0].Rows[i]["N_IRV_TEMP"].ToString()) ? 0 : Convert.ToInt32(ds.Tables[0].Rows[i]["N_IRV_TEMP"])) + "\",");//红外温度
            json.Append("\"N_ENV_TEMP\":\"" + myfiter.GetTEMP(string.IsNullOrEmpty(ds.Tables[0].Rows[i]["N_ENV_TEMP"].ToString()) ? 0 : Convert.ToInt32(ds.Tables[0].Rows[i]["N_ENV_TEMP"])) + "\",");//环境温度
            json.Append("\"N_SPEED\":\"" + myfiter.GetSpeed(ds.Tables[0].Rows[i]["N_SPEED"]) + "\",");//速度
            json.Append("\"LINE_CODE\":\"" + ds.Tables[0].Rows[i]["LINE_CODE"] + "\",");//线路编码
            json.Append("\"LINE_NAME\":\"" + Api.Util.Common.getLineInfo(ds.Tables[0].Rows[i]["LINE_CODE"].ToString()).LINE_NAME + "\",");//线路名
            json.Append("\"DIRECTION\":\"" + ds.Tables[0].Rows[i]["DIRECTION"] + "\",");//行别

            string positioncode = ds.Tables[0].Rows[i]["POSITION_CODE"].ToString();
            string positionname = Api.Util.Common.getStationSectionInfo(ds.Tables[0].Rows[i]["POSITION_CODE"].ToString()).POSITION_NAME;
            string positiontype = Api.Util.Common.getStationSectionInfo(ds.Tables[0].Rows[i]["POSITION_CODE"].ToString()).POSITION_TYPE;
            if (!string.IsNullOrEmpty(positionname) && (positiontype == "Q") && (ds.Tables[0].Rows[i]["DIRECTION"].ToString() == "下行"))
            {
                string[] p = positionname.Split('－');
                positionname = p[1] + "-" + p[0];
            }
            json.Append("\"POSITION_CODE\":\"" + positioncode + "\",");//区站编码
            json.Append("\"POSITION_NAME\":\"" + positionname + "\",");//区站名

            json.Append("\"BRG_TUN_CODE\":\"" + ds.Tables[0].Rows[i]["BRG_TUN_CODE"] + "\",");//桥隧编码
            json.Append("\"BRG_TUN_NAME\":\"" + Api.Util.Common.getBridgeTuneInfo(ds.Tables[0].Rows[i]["BRG_TUN_CODE"].ToString()).BRG_TUN_NAME + "\",");//桥隧名
            json.Append("\"KM_MARK\":\"" + ds.Tables[0].Rows[i]["KM_MARK"] + "\",");//公里标
            json.Append("\"KM\":\"" + PublicMethod.KmtoString(ds.Tables[0].Rows[i]["KM_MARK"].ToString()) + "\",");//转换后的公里标
            json.Append("\"POLE_NUMBER\":\"" + ds.Tables[0].Rows[i]["POLE_NUMBER"] + "\",");//杆号
            json.Append("\"POLE_CODE\":\"" + ds.Tables[0].Rows[i]["POLE_CODE"] + "\",");//杆编码
            json.Append("\"POLE_SERIALNO\":\"" + ds.Tables[0].Rows[i]["POLE_SERIALNO"] + "\",");//杆序号
            json.Append("\"BUREAU_CODE\":\"" + Api.Util.Common.getOrgInfo(ds.Tables[0].Rows[i]["BUREAU_CODE"].ToString()).ORG_NAME + "\",");//局编码
            json.Append("\"BUREAU_NAME\":\"" + Api.Util.Common.getOrgInfo(ds.Tables[0].Rows[i]["BUREAU_CODE"].ToString()).ORG_NAME + "\",");//局名称
            json.Append("\"POWER_SECTION_CODE\":\"" + ds.Tables[0].Rows[0]["POWER_SECTION_CODE"] + "\",");//供电段编码
            json.Append("\"POWER_SECTION_NAME\":\"" + Api.Util.Common.getOrgInfo(ds.Tables[0].Rows[i]["POWER_SECTION_CODE"].ToString()).ORG_NAME + "\",");//供电段名称
            json.Append("\"P_ORG_CODE\":\"" + ds.Tables[0].Rows[i]["P_ORG_CODE"] + "\",");//机务段编码
            json.Append("\"P_ORG_NAME\":\"" + Api.Util.Common.getOrgInfo(ds.Tables[0].Rows[i]["P_ORG_CODE"].ToString()).ORG_NAME + "\",");//机务段名称
            json.Append("\"ORG_CODE\":\"" + ds.Tables[0].Rows[i]["ORG_CODE"] + "\",");//供电段编码
            json.Append("\"ORG_NAME\":\"" + Api.Util.Common.getOrgInfo(ds.Tables[0].Rows[i]["ORG_CODE"].ToString()).ORG_NAME + "\",");//供电段名称
            json.Append("\"FILEPATH_IRV\":\"" + (string.IsNullOrEmpty(ds.Tables[0].Rows[i]["IRV_FILE_PATH"].ToString().ToString()) ? "" : ds.Tables[0].Rows[i]["IRV_FILE_PATH"].ToString().Replace("\\", "%5c").Replace("#", "%23")) + "\",");//红外文件路径
            json.Append("\"FILEPATH_OV\":\"" + (string.IsNullOrEmpty(ds.Tables[0].Rows[i]["OV_FILE_PATH"].ToString().ToString()) ? "" : ds.Tables[0].Rows[i]["OV_FILE_PATH"].ToString().Replace("\\", "%5c").Replace("#", "%23")) + "\",");//全景文件路径
            json.Append("\"FILEPATH_VI\":\"" + (string.IsNullOrEmpty(ds.Tables[0].Rows[i]["VI_FILE_PATH"].ToString()) ? "" : ds.Tables[0].Rows[i]["VI_FILE_PATH"].ToString().Replace("\\", "%5c").Replace("#", "%23")) + "\",");//可见光文件路径
            json.Append("\"FILEPATH_AUX\":\"" + (string.IsNullOrEmpty(ds.Tables[0].Rows[i]["AUX_FILE_PATH"].ToString()) ? "" : ds.Tables[0].Rows[i]["AUX_FILE_PATH"].ToString().Replace("\\", "%5c").Replace("#", "%23")) + "\",");//辅助文件路径
            json.Append("\"BOW_POSITION_CODE\":\"" + ds.Tables[0].Rows[i]["IRV_BOW_POSITION_CODE"] + "\",");//弓位置编码
            json.Append("\"BOW_POSITION_NAME\":\"" + ds.Tables[0].Rows[i]["IRV_BOW_POSITION_NAME"] + "\",");//弓位置名称
            json.Append("\"LOCOMOTIVE_CODE\":\"" + ds.Tables[0].Rows[i]["LOCOMOTIVE_CODE"] + "\",");//车号
            json.Append("\"IRV_IDX\":\"" + ds.Tables[0].Rows[i]["IRV_IDX"] + "\",");//红外索引
            json.Append("\"OV_IDX\":\"" + ds.Tables[0].Rows[i]["OV_IDX"] + "\",");//全景索引
            json.Append("\"VI_IDX\":\"" + ds.Tables[0].Rows[i]["VI_IDX"] + "\",");//可见光索引
            json.Append("\"AUX_IDX\":\"" + ds.Tables[0].Rows[i]["AUX_IDX"] + "\",");//辅助索引
            json.Append("\"OV_OFFSET\":\"" + ds.Tables[0].Rows[i]["OV_OFFSET"] + "\",");//全景偏移
            json.Append("\"VI_OFFSET\":\"" + ds.Tables[0].Rows[i]["VI_OFFSET"] + "\",");//可见光偏移
            json.Append("\"AUX_OFFSET\":\"" + ds.Tables[0].Rows[i]["AUX_OFFSET"] + "\",");//辅助偏移
            json.Append("\"GEO_STATUS\":\"" + ds.Tables[0].Rows[i]["GEO_STATUS"] + "\"");
            //json.Append("\"DEVICE_BOW_RELATIONS\":\"" + ds.Tables[0].Rows[i]["DEVICE_BOW_RELATIONS"] + "\"");//
            json.Append("}");
            if (i < ds.Tables[0].Rows.Count - 1)
            {
                json.Append(",");
            }

        }

        json.Append("]");

        json.Append(",\"DEVICE_BOW_RELATIONS\":\"" + Api.Util.Common.getLocomotiveInfo(locomotive_code).DEVICE_BOW_RELATIONS + "\",");
        json.Append(path_json);

        PageHelper ph = new PageHelper();
        int itotal = 0;
        if (!string.IsNullOrEmpty(total))
        {
            itotal = Convert.ToInt32(total);
        }
        json.Append("," + ph.getPageJson(itotal, pageIndex, pageSize) + "}");


        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }
    /// <summary>
    /// 获取红外图像坐标点温度
    /// </summary>
    public void getIRVTemp()
    {
        string path = HttpContext.Current.Request["path"];//红外文件路径
        string locomotive = HttpContext.Current.Request["locomotive"];//设备号
        //string timestamp = HttpContext.Current.Request["timestamp"];//红外时间戳
        string IRVIDX = HttpContext.Current.Request["IRVIDX"];//红外索引
        int x1 = string.IsNullOrEmpty(HttpContext.Current.Request["x1"]) ? 320 : Convert.ToInt32(HttpContext.Current.Request["x1"]);//左上角X坐标点
        int y1 = string.IsNullOrEmpty(HttpContext.Current.Request["y1"]) ? 320 : Convert.ToInt32(HttpContext.Current.Request["y1"]);//左下角Y坐标点

        int x2 = string.IsNullOrEmpty(HttpContext.Current.Request["x2"]) ? 0 : Convert.ToInt32(HttpContext.Current.Request["x2"]);//右上角X坐标点
        int y2 = string.IsNullOrEmpty(HttpContext.Current.Request["y2"]) ? 0 : Convert.ToInt32(HttpContext.Current.Request["y2"]);//右下角Y坐标点

        long idx = Convert.ToInt64(IRVIDX);
        string filepath = string.IsNullOrEmpty(path) ? "" : path.Replace("%5c", "\\").Replace("%23", "#");

        string sessionid = HttpContext.Current.Session.SessionID;
        object o = WCF3CDataProvider.ExecuteMetod_T<IDataProvider>("hardProvider", "GetIrvTempData", new object[] { sessionid, locomotive, filepath, idx, x1, y1, x2, y2 });

        StringBuilder json = new StringBuilder();
        //json.Append("{\"temp\":\"" + o + "\"}");
        json.Append(o);

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);

    }
    /// <summary>
    /// 判断当前时间报警是否存在，并返回相关信息
    /// </summary>
    public void getAlarm()
    {
        string time = HttpContext.Current.Request["time"];//原始数据时间，精确到秒
        string locomotive = HttpContext.Current.Request["locomotive"];//车号

        AlarmCond alarmcond = new AlarmCond();

        if (!string.IsNullOrEmpty(alarmcond.businssAnd))
        {
            alarmcond.businssAnd += " and ";
        }
        alarmcond.businssAnd += " RAISED_TIME = TO_DATE('" + time + "','yyyy-mm-dd hh24:mi:ss')";

        alarmcond.DETECT_DEVICE_CODE = locomotive;

        List<Alarm> list = Api.ServiceAccessor.GetAlarmService().getAlarm(alarmcond);

        StringBuilder json = new StringBuilder();

        json.Append("{\"sign\":\"" + list.Count + "\",");
        json.Append("\"ID\":[");
        for (int i = 0; i < list.Count; i++)
        {
            json.Append("\"" + list[i].ID + "\"");
            if (i < list.Count - 1)
            {
                json.Append(",");
            }
        }
        json.Append("]}");
        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }
    /// <summary>
    /// 原始数据确认为报警
    /// </summary>
    public void AlarmSure()
    {
        string locomotive_code = HttpContext.Current.Request["locomotive_code"];//车号
        string IRVPATH = HttpContext.Current.Request["IRVPATH"];//红外路径
        string VIPATH = HttpContext.Current.Request["VIPATH"];//可见光路径
        string OVPATH = HttpContext.Current.Request["OVPATH"]; //全景路径
        string IRVTimeStamp = HttpContext.Current.Request["IRVTimeStamp"];//时间戳
        string IRVIDX = HttpContext.Current.Request["IRVIDX"];//红外索引
        string VIOFFSET = HttpContext.Current.Request["VIOFFSET"];//可见光偏移
        string OVOFFSET = HttpContext.Current.Request["OVOFFSET"];//全景偏移
        string beforecount = HttpContext.Current.Request["beforecount"];//红外缺陷帧前帧数
        string aftercount = HttpContext.Current.Request["aftercount"];//红外缺陷帧后帧数

        string txtDefect = HttpContext.Current.Request["txtDefect"];//缺陷分析
        string txtAdvice = HttpContext.Current.Request["txtAdvice"];//处理建议
        string txtNote = HttpContext.Current.Request["txtNote"];//备注
        string txtReporter = HttpContext.Current.Request["txtReporter"];//报告人
        string afcode = HttpContext.Current.Request["afcode"];//缺陷类型
        string DefectMarkCode = HttpContext.Current.Request["DefectMarkCode"];//缺陷标志code
        string CUST_ALARM_CODE = HttpContext.Current.Request["Alarmcode"];//告警编码
        string severity = HttpContext.Current.Request["severity"];//缺陷级别
        string SAMPLE_CODE = HttpContext.Current.Request["SAMPLE_CODE"];//样本编码
        string SAMPLE_DETAIL_CODE = HttpContext.Current.Request["SAMPLE_DETAIL_CODE"];//样本详细编码

        int t_severity = string.IsNullOrEmpty(HttpContext.Current.Request["tseverity"]) ? 0 : Convert.ToInt32(HttpContext.Current.Request["tseverity"]);//手动转发标志,0为自然状态
        DateTime reportdate = DateTime.Now;
        if (!String.IsNullOrEmpty(HttpContext.Current.Request["reportdate"]))
        {
            reportdate = DateTime.Parse(HttpContext.Current.Request["reportdate"]);//日期
        }

        string FILEIRVPATH = string.IsNullOrEmpty(IRVPATH) ? "" : IRVPATH.Replace("%5c", "\\").Replace("%23", "#");
        string FILEVIPATH = string.IsNullOrEmpty(VIPATH) ? "" : VIPATH.Replace("%5c", "\\").Replace("%23", "#");
        string FILEOVPATH = string.IsNullOrEmpty(OVPATH) ? "" : OVPATH.Replace("%5c", "\\").Replace("%23", "#");
        string sessionid = HttpContext.Current.Session.SessionID;


        long time = Convert.ToInt64(IRVTimeStamp);
        long irvindex = Convert.ToInt64(IRVIDX);
        int ovof = Convert.ToInt32(OVOFFSET);
        int viof = Convert.ToInt32(VIOFFSET);
        int beforeFrameCnt = string.IsNullOrEmpty(beforecount) ? 5 : Convert.ToInt32(beforecount);
        int afterFrameCnt = string.IsNullOrEmpty(aftercount) ? 5 : Convert.ToInt32(aftercount);

        StringBuilder json = new StringBuilder();
        json.Append("{");
        json.Append("\"defectFrame\":\"" + irvindex + "\",");
        json.Append("\"alarmAnalysis\":\"" + txtDefect + "\",");
        json.Append("\"proposal\":\"" + txtAdvice + "\",");
        json.Append("\"remark\":\"" + txtNote + "\",");
        json.Append("\"reportPerson\":\"" + txtReporter + "\",");
        json.Append("\"code\":\"" + afcode + "\",");
        json.Append("\"aFlagCode\":\"" + DefectMarkCode + "\",");
        json.Append("\"severity\":\"" + severity + "\",");
        json.Append("\"sampleCode\":\"" + SAMPLE_CODE + "\",");
        json.Append("\"sampleDetail\":\"" + SAMPLE_DETAIL_CODE + "\",");
        json.Append("\"isTransAllowd\":\"" + t_severity + "\",");
        json.Append("\"reportTime\":\"" + reportdate + "\",");
        json.Append("\"lable\":\"" + CUST_ALARM_CODE + "\",");
        json.Append("\"statusTime\":\"" + DateTime.Now + "\"");
        json.Append("}");

        string alarmParamJson = json.ToString();

        //接口
        object o = WCF3CDataProvider.ExecuteMetod_T<IDataProvider>("hardProvider", "CreateAlarm", new object[] { sessionid, locomotive_code, FILEIRVPATH, FILEVIPATH, FILEOVPATH, time, irvindex, viof, ovof, 0, alarmParamJson, beforeFrameCnt, afterFrameCnt });

        StringBuilder re = new StringBuilder();
        re.Append("{\"re\":\"" + o + "\"}");

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(re);

    }
    public void getIndex()
    {
        string line_code = HttpContext.Current.Request["line_code"];//线路编码
        string pole_direction = HttpContext.Current.Request["pole_direction"];//行别
        string position_code = HttpContext.Current.Request["position_code"];//区站编码
        string start_timestamp = HttpContext.Current.Request["start_timestamp"];//开始红外时间戳
        string end_timestamp = HttpContext.Current.Request["end_timestamp"];//结束时间
        string locomotive_code = HttpContext.Current.Request["locomotive_code"];//设备号
        string bow_position_code = HttpContext.Current.Request["bow_position_code"];//弓位置编码
        string t_start_time = HttpContext.Current.Request["t_start_time"];//定位开始时间
        string t_line_code = HttpContext.Current.Request["t_line_code"];//定位线路编码
        string t_pole_direction = HttpContext.Current.Request["t_pole_direction"];//定位行别
        string t_position_code = HttpContext.Current.Request["t_position_code"];//定位区站编码
        string t_brg_tun_code = HttpContext.Current.Request["t_brg_tun_code"];//定位桥隧编码
        string t_start_km = HttpContext.Current.Request["t_start_km"];//定位开始公里标
        string t_end_km = HttpContext.Current.Request["t_end_km"];//定位结束公里标
        string t_pole_code = HttpContext.Current.Request["t_pole_code"];//定位支柱编码
        if (!string.IsNullOrEmpty(t_pole_code))
        {
            t_pole_code = t_pole_code.Replace("%23", "#");
        }
        if (!string.IsNullOrEmpty(locomotive_code) && string.IsNullOrEmpty(bow_position_code))
        {
            string relations = Api.Util.Common.getLocomotiveInfo(locomotive_code).DEVICE_BOW_RELATIONS;
            if (!string.IsNullOrEmpty(relations) && relations.Contains("#"))
            {
                bow_position_code = "#1_A";
            }
            else
            {
                bow_position_code = "_A";
            }
        }

        System.Data.DataSet ds = ADO.HardDiskData.GetIndex(line_code, pole_direction, position_code, start_timestamp, end_timestamp, locomotive_code, bow_position_code, t_start_time, t_line_code, t_pole_direction, t_position_code, t_brg_tun_code, t_start_km, t_end_km, t_pole_code);

        int index = -1;
        if (ds.Tables[0].Rows.Count > 0)
        {
            index = Convert.ToInt32(ds.Tables[0].Rows[0]["MYINDEX"].ToString());
        }


        StringBuilder json = new StringBuilder();
        json.Append("{\"INDEX\":\"" + index + "\"}");

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }
    /// <summary>
    /// 获取硬盘数据播放总条数
    /// </summary>
    public void getTotalPages()
    {
        int re = 0;
        string line_code = HttpContext.Current.Request["line_code"];//线路编码
        string pole_direction = HttpContext.Current.Request["pole_direction"];//行别
        string position_code = HttpContext.Current.Request["position_code"];//区站编码                                                                           
        string start_timestamp = HttpContext.Current.Request["start_timestamp"];//开始红外时间戳
        string end_timestamp = HttpContext.Current.Request["end_timestamp"];//结束时间
        string locomotive_code = HttpContext.Current.Request["locomotive_code"];//设备号
        string bow_position_code = HttpContext.Current.Request["bow_position_code"];//弓位置编码
        if (!string.IsNullOrEmpty(locomotive_code) && string.IsNullOrEmpty(bow_position_code))
        {
            string relations = Api.Util.Common.getLocomotiveInfo(locomotive_code).DEVICE_BOW_RELATIONS;
            if (!string.IsNullOrEmpty(relations) && relations.Contains("#"))
            {
                bow_position_code = "#1_A";
            }
            else
            {
                bow_position_code = "_A";
            }
        }

        re = ADO.HardDiskData.GetTotalPage(line_code, pole_direction, position_code, start_timestamp, end_timestamp, locomotive_code, bow_position_code);

        StringBuilder json = new StringBuilder();
        json.Append("{\"TotalPages\":\"" + re + "\",");
        json.Append("\"sessionid\":\"" + HttpContext.Current.Session.SessionID + "\"}");

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);

    }
    /// <summary>
    /// 获取设备弓位置信息
    /// </summary>
    public void getLocomotiveInfo()
    {
        string locomotive_code = HttpContext.Current.Request["locomotive_code"];//车号
        string relations = "";
        if (!string.IsNullOrEmpty(locomotive_code))
        {
            relations = Api.Util.Common.getLocomotiveInfo(locomotive_code).DEVICE_BOW_RELATIONS;
        }
        StringBuilder json = new StringBuilder();
        json.Append("{\"DEVICE_BOW_RELATIONS\":\"" + relations + "\"}");

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }
    public void getAlarmList()
    {
        string start_timestamp = HttpContext.Current.Request["start_timestamp"];//开始红外时间戳
        string end_timestamp = HttpContext.Current.Request["end_timestamp"];//结束红外时间戳
        string line_code = HttpContext.Current.Request["line_code"];//线路编码
        string pole_direction = HttpContext.Current.Request["pole_direction"];//行别
        string position_code = HttpContext.Current.Request["position_code"];//区站编码
        string locomotive_code = HttpContext.Current.Request["locomotive_code"]; //设备号

        System.Data.DataSet ds = ADO.HardDiskData.GetAlarmList(start_timestamp, end_timestamp, line_code, pole_direction, position_code, locomotive_code);

        StringBuilder json = new StringBuilder();
        json.Append("{\"data\":[");

        for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
        {

            json.Append("{");
            json.Append("\"RAISED_TIME_M\":\"" + ds.Tables[0].Rows[i]["RAISED_TIME_M"] + "\",");//发生时间（时间戳）
            json.Append("\"RAISED_TIME\":\"" + ds.Tables[0].Rows[i]["RAISED_TIME"] + "\",");//发生时间
            json.Append("\"CODE_NAME\":\"" + ds.Tables[0].Rows[i]["CODE_NAME"] + "\",");//缺陷类型名称
            json.Append("\"SEVERITY\":\"" + Api.Util.Common.sysDictionaryDic[ds.Tables[0].Rows[i]["SEVERITY"].ToString()].CODE_NAME + "\",");//缺陷级别
            json.Append("\"BOW_POSITION\":\"" + ds.Tables[0].Rows[i]["SVALUE8"] + "\",");//弓位置
            json.Append("\"ID\":\"" + ds.Tables[0].Rows[i]["ID"] + "\"");//ID
            json.Append("}");

            if (i < ds.Tables[0].Rows.Count - 1)
            {
                json.Append(",");
            }

        }


        json.Append("]}");

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);

    }

    /// <summary>
    /// 传送播放文件摘要信息    
    /// </summary>
    public string getFileInfoList()
    {
        DataTable dt = new DataTable();
        if (tds.Tables.Count > 0)
            dt = tds.Tables[0];
        DataRow[] dr = dt.Select();
        string[] irv = new string[dt.Rows.Count];
        string[] vi = new string[dt.Rows.Count];
        string[] ov = new string[dt.Rows.Count];
        string[] aux = new string[dt.Rows.Count];
        List<string> irv_lis = new List<string>(irv);
        List<string> vi_lis = new List<string>(vi);
        List<string> ov_lis = new List<string>(ov);
        List<string> aux_lis = new List<string>(aux);
        List<string> lis = new List<string>();


        if (dt.Rows.Count > 0)
        {
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                irv[i] = dr[i]["IRV_FILE_PATH"].ToString().Replace("\\", "\\\\").Replace("#", "%23");//红外文件路径
                vi[i] = dr[i]["VI_FILE_PATH"].ToString().Replace("\\", "\\\\").Replace("#", "%23");//可见光文件路径
                ov[i] = dr[i]["OV_FILE_PATH"].ToString().Replace("\\", "\\\\").Replace("#", "%23");//全景文件路径
                aux[i] = dr[i]["AUX_FILE_PATH"].ToString().Replace("\\", "\\\\").Replace("#", "%23");//辅助文件路径
            }
            irv = irv.Distinct().ToArray();
            vi = vi.Distinct().ToArray();
            ov = ov.Distinct().ToArray();
            aux = aux.Distinct().ToArray();


            lis.AddRange(irv_lis);
            lis.AddRange(vi_lis);
            lis.AddRange(ov_lis);
            lis.AddRange(aux_lis);
        }



        string locomotive_code = HttpContext.Current.Request["locomotive_code"];//设备号
        string sessionid = HttpContext.Current.Session.SessionID;

        StringBuilder json = new StringBuilder();

        string linetype = "ordinary";
        json.Append("\"linetype\":\"" + linetype + "\",\"summary\":[");
        if (lis.Count > 0)
        {
            foreach (string str in lis)
            {
                if (!string.IsNullOrEmpty(str))
                {
                    json.Append("{");
                    json.Append("\"locomotive\":\"" + locomotive_code + "\",");//车号
                    json.Append("\"filepath\":\"" + str + "\",");//文件路径
                    json.Append("\"beginidx\":\"\",");//开始帧号
                    json.Append("\"endidx\":\"\",");//结束帧号
                    json.Append("\"width\":\"640\",");//图像宽
                    json.Append("\"height\":\"480\",");//图像高
                    json.Append("\"autoexposure\":\"false\"");//是否曝光
                    json.Append("},");
                }

            }
            json.Remove(json.Length - 1, 1);
        }
        json.Append("]");

        return json.ToString();

        // object o = WCF3CDataProvider.ExecuteMetod_T<IDataProvider>("NotifyNextInformation", new object[] { sessionid, linetype, json.ToString() });

        //StringBuilder json = new StringBuilder();
        ////json.Append("{\"temp\":\"" + o + "\"}");
        //json.Append(o);

        //HttpContext.Current.Response.ContentType = "application/json";
        //HttpContext.Current.Response.Write(json);
    }

    /// <summary>
    /// 原始数据播放list
    /// </summary>
    public void getFileTaskPlayList()
    {
        string line_code = HttpContext.Current.Request["line_code"];//线路编码
        string pole_direction = HttpContext.Current.Request["pole_direction"];//行别
        string position_code = HttpContext.Current.Request["position_code"];//区站编码                                                                          
        string start_timestamp = HttpContext.Current.Request["start_timestamp"];//开始红外时间戳
        string end_timestamp = HttpContext.Current.Request["end_timestamp"];//结束时间
        string locomotive_code = HttpContext.Current.Request["locomotive_code"];//设备号
        string bow_position_code = HttpContext.Current.Request["bow_position_code"];//弓位置编码
        string total = HttpContext.Current.Request["total"];//总条数

        int pageIndex = string.IsNullOrEmpty("pageIndex") ? 1 : Convert.ToInt32(HttpContext.Current.Request["pageIndex"]);//当前页
        int pageSize = string.IsNullOrEmpty("pageSize") ? 30 : Convert.ToInt32(HttpContext.Current.Request["pageSize"]);//页大小

        int startrow = pageSize * (pageIndex - 1) + 1;
        int endrow = pageSize * pageIndex;
        if (!string.IsNullOrEmpty(locomotive_code) && string.IsNullOrEmpty(bow_position_code))
        {
            string relations = Api.Util.Common.getLocomotiveInfo(locomotive_code).DEVICE_BOW_RELATIONS;
            if (!string.IsNullOrEmpty(relations) && relations.Contains("#"))
            {
                bow_position_code = "#1_A";
            }
            else
            {
                bow_position_code = "_A";
            }
        }

        System.Data.DataSet ds = ADO.HardDiskData.GetFileTaskByPage(line_code, pole_direction, position_code, start_timestamp, end_timestamp, locomotive_code, bow_position_code, startrow, endrow);

        //传送播放文件摘要信息    
        //tds = ds;
        string path_json = "";
        path_json = getFileInfoList();

        StringBuilder json = new StringBuilder();

        json.Append("{\"data\":[");
        if (ds.Tables.Count > 0)
        {
            if (ds.Tables[0].Rows.Count > 0)
            {
                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    DateTime time = new DateTime();
                    DateTime dtStart = TimeZone.CurrentTimeZone.ToLocalTime(new DateTime(1970, 1, 1, 0, 0, 0));
                    long lTime = long.Parse(ds.Tables[0].Rows[i]["TIMESTAMP_IRV"] + "0000");
                    TimeSpan toNow = new TimeSpan(lTime);
                    time = dtStart.Add(toNow);

                    json.Append("{");
                    json.Append("\"ID\":\"" + ds.Tables[0].Rows[i]["ID"] + "\",");//唯一标识
                    json.Append("\"TIMESTAMP_IRV\":\"" + ds.Tables[0].Rows[i]["TIMESTAMP_IRV"] + "\",");//红外时间戳
                    json.Append("\"time\":\"" + time.ToString("yyyy-MM-dd HH:mm:ss") + "\",");
                    json.Append("\"N_SATELLITE\":\"" + ds.Tables[0].Rows[i]["N_SATELLITE"] + "\",");//卫星数
                    json.Append("\"N_STAGGER\":\"" + myfiter.GetPULLING_VALUE(ds.Tables[0].Rows[i]["N_STAGGER"]) + "\",");//拉出值
                    json.Append("\"N_HIGH\":\"" + myfiter.GetLINE_HEIGHT(ds.Tables[0].Rows[i]["N_HIGH"]) + "\",");//导高值
                    json.Append("\"N_IRV_TEMP\":\"" + myfiter.GetTEMP(string.IsNullOrEmpty(ds.Tables[0].Rows[i]["N_IRV_TEMP"].ToString()) ? 0 : Convert.ToInt32(ds.Tables[0].Rows[i]["N_IRV_TEMP"])) + "\",");//红外温度
                    json.Append("\"N_ENV_TEMP\":\"" + myfiter.GetTEMP(string.IsNullOrEmpty(ds.Tables[0].Rows[i]["N_ENV_TEMP"].ToString()) ? 0 : Convert.ToInt32(ds.Tables[0].Rows[i]["N_ENV_TEMP"])) + "\",");//环境温度
                    json.Append("\"N_SPEED\":\"" + myfiter.GetSpeed(ds.Tables[0].Rows[i]["N_SPEED"]) + "\",");//速度
                    json.Append("\"LINE_CODE\":\"" + ds.Tables[0].Rows[i]["LINE_CODE"] + "\",");//线路编码
                    json.Append("\"LINE_NAME\":\"" + Api.Util.Common.getLineInfo(ds.Tables[0].Rows[i]["LINE_CODE"].ToString()).LINE_NAME + "\",");//线路名
                    json.Append("\"DIRECTION\":\"" + ds.Tables[0].Rows[i]["DIRECTION"] + "\",");//行别

                    string positioncode = ds.Tables[0].Rows[i]["POSITION_CODE"].ToString();
                    string positionname = Api.Util.Common.getStationSectionInfo(ds.Tables[0].Rows[i]["POSITION_CODE"].ToString()).POSITION_NAME;
                    string positiontype = Api.Util.Common.getStationSectionInfo(ds.Tables[0].Rows[i]["POSITION_CODE"].ToString()).POSITION_TYPE;
                    if (!string.IsNullOrEmpty(positionname) && (positiontype == "Q") && (ds.Tables[0].Rows[i]["DIRECTION"].ToString() == "下行"))
                    {
                        string[] p = positionname.Split('－');
                        positionname = p[1] + "-" + p[0];
                    }
                    json.Append("\"POSITION_CODE\":\"" + positioncode + "\",");//区站编码
                    json.Append("\"POSITION_NAME\":\"" + positionname + "\",");//区站名

                    json.Append("\"BRG_TUN_CODE\":\"" + ds.Tables[0].Rows[i]["BRG_TUN_CODE"] + "\",");//桥隧编码
                    json.Append("\"BRG_TUN_NAME\":\"" + Api.Util.Common.getBridgeTuneInfo(ds.Tables[0].Rows[i]["BRG_TUN_CODE"].ToString()).BRG_TUN_NAME + "\",");//桥隧名
                    json.Append("\"KM_MARK\":\"" + ds.Tables[0].Rows[i]["KM_MARK"] + "\",");//公里标
                    json.Append("\"KM\":\"" + PublicMethod.KmtoString(ds.Tables[0].Rows[i]["KM_MARK"].ToString()) + "\",");//转换后的公里标
                    json.Append("\"POLE_NUMBER\":\"" + ds.Tables[0].Rows[i]["POLE_NUMBER"] + "\",");//杆号
                    json.Append("\"POLE_CODE\":\"" + ds.Tables[0].Rows[i]["POLE_CODE"] + "\",");//杆编码
                    json.Append("\"POLE_SERIALNO\":\"" + ds.Tables[0].Rows[i]["POLE_SERIALNO"] + "\",");//杆序号
                    json.Append("\"BUREAU_CODE\":\"" + Api.Util.Common.getOrgInfo(ds.Tables[0].Rows[i]["BUREAU_CODE"].ToString()).ORG_NAME + "\",");//局编码
                    json.Append("\"BUREAU_NAME\":\"" + Api.Util.Common.getOrgInfo(ds.Tables[0].Rows[i]["BUREAU_CODE"].ToString()).ORG_NAME + "\",");//局名称
                    json.Append("\"POWER_SECTION_CODE\":\"" + ds.Tables[0].Rows[0]["POWER_SECTION_CODE"] + "\",");//供电段编码
                    json.Append("\"POWER_SECTION_NAME\":\"" + Api.Util.Common.getOrgInfo(ds.Tables[0].Rows[i]["POWER_SECTION_CODE"].ToString()).ORG_NAME + "\",");//供电段名称
                    json.Append("\"P_ORG_CODE\":\"" + ds.Tables[0].Rows[i]["P_ORG_CODE"] + "\",");//机务段编码
                    json.Append("\"P_ORG_NAME\":\"" + Api.Util.Common.getOrgInfo(ds.Tables[0].Rows[i]["P_ORG_CODE"].ToString()).ORG_NAME + "\",");//机务段名称
                    json.Append("\"ORG_CODE\":\"" + ds.Tables[0].Rows[i]["ORG_CODE"] + "\",");//供电段编码
                    json.Append("\"ORG_NAME\":\"" + Api.Util.Common.getOrgInfo(ds.Tables[0].Rows[i]["ORG_CODE"].ToString()).ORG_NAME + "\",");//供电段名称

                    json.Append("\"FILEPATH_IRV\":\"" + getFileTaskPicture(ds.Tables[0].Rows[i]["FILEURL_NET"].ToString(), ds.Tables[0].Rows[i]["IRV_DIRID"].ToString()) + "\",");//红外文件路径

                    json.Append("\"FILEPATH_OV\":\"" + getFileTaskPicture(ds.Tables[0].Rows[i]["FILEURL_NET"].ToString(), ds.Tables[0].Rows[i]["OV_DIRID"].ToString()) + "\",");//全景文件路径

                    json.Append("\"FILEPATH_VI\":\"" + getFileTaskPicture(ds.Tables[0].Rows[i]["FILEURL_NET"].ToString(), ds.Tables[0].Rows[i]["VI_DIRID"].ToString()) + "\",");//可见光文件路径

                    json.Append("\"FILEPATH_AUX\":\"" + getFileTaskPicture(ds.Tables[0].Rows[i]["FILEURL_NET"].ToString(), ds.Tables[0].Rows[i]["AUX_DIRID"].ToString()) + "\",");//辅助文件路径

                    json.Append("\"BOW_POSITION_CODE\":\"" + ds.Tables[0].Rows[i]["BOWPOSITION"] + "\",");//弓位置编码
                    json.Append("\"BOW_POSITION_NAME\":\"" + PublicMethod.getBownameByCode(ds.Tables[0].Rows[i]["LOCOMOTIVE_CODE"].ToString(), ds.Tables[0].Rows[i]["BOWPOSITION"].ToString()) + "车\",");//弓位置名称
                    json.Append("\"LOCOMOTIVE_CODE\":\"" + ds.Tables[0].Rows[i]["LOCOMOTIVE_CODE"] + "\",");//车号
                    json.Append("\"OV_OFFSET\":\"" + 0 + "\",");//全景偏移
                    json.Append("\"VI_OFFSET\":\"" + 0 + "\",");//可见光偏移
                    json.Append("\"AUX_OFFSET\":\"" + 0 + "\",");//辅助偏移
                    json.Append("\"IRV_IDX\":\"" + ds.Tables[0].Rows[i]["IRV_IDX"] + "\",");//红外索引
                    json.Append("\"OV_IDX\":\"" + ds.Tables[0].Rows[i]["OV_IDX"] + "\",");//全景索引
                    json.Append("\"VI_IDX\":\"" + ds.Tables[0].Rows[i]["VI_IDX"] + "\",");//可见光索引
                    json.Append("\"AUX_IDX\":\"" + ds.Tables[0].Rows[i]["AUX_IDX"] + "\"");//辅助索引
                                                                                           //json.Append("\"DEVICE_BOW_RELATIONS\":\"" + ds.Tables[0].Rows[i]["DEVICE_BOW_RELATIONS"] + "\"");//
                    json.Append("}");
                    if (i < ds.Tables[0].Rows.Count - 1)
                    {
                        json.Append(",");
                    }
                }
            }
        }
        json.Append("]");

        json.Append(",\"DEVICE_BOW_RELATIONS\":\"" + Api.Util.Common.getLocomotiveInfo(locomotive_code).DEVICE_BOW_RELATIONS + "\",");
        json.Append(path_json);

        PageHelper ph = new PageHelper();
        int itotal = 0;
        if (!string.IsNullOrEmpty(total))
        {
            itotal = Convert.ToInt32(total);
        }
        json.Append("," + ph.getPageJson(itotal, pageIndex, pageSize) + "}");


        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }

    /// <summary>
    /// 获取原始数据播放总条数
    /// </summary>
    public void getTotalFileTaskPages()
    {
        double re = 0;
        string start = "";
        string end = "";
        DataTable dt = new DataTable();
        string taskid = HttpContext.Current.Request["taskid"];//线路编码
        string queueid = HttpContext.Current.Request["queueid"];//行别


        dt = ADO.HardDiskData.GetTotalFileTaskPage(taskid, queueid);
        if (dt.Rows.Count > 0)
        {
            re = Convert.ToDouble(dt.Rows[0]["TNT"]);
            start = Convert.ToString(dt.Rows[0]["TIMESTAMP_IRV"]);
            end = Convert.ToString(dt.Rows[dt.Rows.Count - 1]["TIMESTAMP_IRV"]);
        }
        StringBuilder json = new StringBuilder();
        json.Append("{\"TotalPages\":\"" + re + "\",");
        json.Append("\"start_timestamp\":\"" + start + "\",");
        json.Append("\"end_timestamp\":\"" + end + "\",");
        json.Append("\"sessionid\":\"" + HttpContext.Current.Session.SessionID + "\"}");

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }

    /// <summary>
    /// 转换为WCF请求格式的地址
    /// </summary>
    /// <param name="fileurl_net"></param>
    /// <param name="pic"></param>
    /// <returns></returns>
    public string getFileTaskPicture(string fileurl_net, string pic)
    {
        string path = "";
        if (!string.IsNullOrEmpty(fileurl_net))
        {
            string regex1 = @"\d*\.\d*\.\d*\.\d*";
            var httppath = Regex.Match(fileurl_net, regex1).Value;

            string regex2 = @"\\\w\\.*3C";
            var physicpath = Regex.Match(fileurl_net, regex2).Value;
            physicpath = physicpath.Substring(1).Replace("3C", "");

            string phy = "";
            if (!string.IsNullOrEmpty(physicpath))
            {
                string[] strs = physicpath.Split('\\');
                if (strs.Length > 2)
                {

                    for (int i = 0; i < strs.Length; i++)
                    {
                        if (!string.IsNullOrEmpty(strs[i]))
                        {
                            if (i == 0)
                            {
                                phy += strs[i] + ":\\";
                            }
                            else
                            {
                                phy += strs[i] + "\\";
                            }
                        }
                    }
                }
            }
            //string regex3 = @"\\\\\d*\.\d*\.\d*\.\d*\\.*3C";
            //var str = Regex.Match(fileurl_net, regex3).Value;
            //str = str.Replace(@"\3C", "");

            Virtual_Dir_Info vp = ADO.IVirtual_dir_infoImpl.getVirByCond(httppath, phy);
            path = fileurl_net.Replace("\\\\" + httppath + "\\" + physicpath, vp.VIRTUAL_DIR_NAME) + @"\" + pic;
            path = path.Replace("\\", "%5c").Replace("#", "%23");
        }
        return path;
    }

    //public string getIrvPicture(string pic)
    //{
    //    if (pic.Contains("scs") || pic.Contains("SCS"))
    //    {
    //        string[] strs = pic.Split('_');
    //        if (strs.Length >= 5)
    //        {
    //            pic = strs[0] + "_" + "1" + "_" + strs[2] + "_" + strs[3] + "_" + strs[4] + "_" + strs[5].Replace("scs", "dlv").Replace("SCS", "dlv");
    //        }
    //    }
    //    return pic;
    //}

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }


}
