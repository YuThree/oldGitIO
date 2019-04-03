<%@ WebHandler Language="C#" Class="HardDiskLineVedioPlay" %>

using System;
using System.Web;
using System.Text;
using Api.Fault.entity.alarm;
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



public class HardDiskLineVedioPlay : ReferenceClass, IHttpHandler {

    public List<PoleStandard> POLE_LIS = new List<PoleStandard>();
    public List<string> POLE_CODE_LIS = new List<string>();

    public void ProcessRequest(HttpContext context)
    {
        try
        {
            string action = context.Request["action"];
            switch (action)
            {
                case "VedioPlayList":
                    getVedioPlayList(context);
                    break;
                case "VedioPlaySingel":
                    getVedioPlaySingel(context);
                    break;
                case "PoleToLoco":
                    getLocoLis(context);
                    break;
                case "IRVTemp":
                    getIRVTemp();
                    break;
                case "IsAlarmExist":
                    getAlarm();
                    break;
                case "AlarmSure":
                    AlarmSure();
                    break;
                case "Index":
                    getIndex();
                    break;
                case "locomotive":
                    getLocomotiveInfo();
                    break;
                case "AlarmList":
                    getAlarmList();
                    break;

            }
        }
        catch (Exception ex)
        {
            log4net.ILog log = log4net.LogManager.GetLogger("硬盘数据播放");
            log.Error("执行出错", ex);
        }
    }
    /// <summary>
    /// 硬盘数据播放list
    /// </summary>
    public void getVedioPlayList(HttpContext context)
    {
        getTotalPoles();

        string line_code = HttpContext.Current.Request["line_code"];//线路编码
        string pole_direction = HttpContext.Current.Request["direction"];//行别                                                                    
        DateTime endDate = Convert.ToDateTime(context.Request["end_time"]);//结束时间
        DateTime startDate = Convert.ToDateTime(context.Request["start_time"]);//开始时间
        string bureau_code = HttpContext.Current.Request["bureau_code"];//局编码
        string org_code = HttpContext.Current.Request["org_code"];//供电段编码
        string index = HttpContext.Current.Request["index"];//杆序号
        string sort = HttpContext.Current.Request["sort"];//方向
        string polecount = HttpContext.Current.Request["polecount"];//请求杆数


        int inde = int.Parse(index);
        //计算开始时间和结束时间的时间戳
        TimeSpan ts_start = startDate.ToUniversalTime() - new DateTime(1970, 1, 1, 0, 0, 0, 0);
        string startTimestamp = Convert.ToInt64(ts_start.TotalMilliseconds).ToString();

        TimeSpan ts_end = endDate.ToUniversalTime() - new DateTime(1970, 1, 1, 0, 0, 0, 0);
        string endTimestamp = Convert.ToInt64(ts_end.TotalMilliseconds).ToString();

        //标准线路ID集
        string lineids = GetLineIds(context);

        bool result = ADO.HardDiskData.GetHardLineStandardDataExist(POLE_LIS[inde].POLE_CODE, startTimestamp, endTimestamp);
        DataTable dt = new DataTable();
        if (result)
        {
            string pole_lis = GetPosi_lis(inde,polecount);
            dt = ADO.HardDiskData.GetHardLineStandardData(pole_lis, startTimestamp, endTimestamp, line_code, pole_direction,lineids);
        }
        else
        {
            string pole = ADO.HardDiskData.GetHardLineStandardDataIndex(lineids, POLE_LIS[inde].POLE_ORDER, sort);
            inde = POLE_CODE_LIS.IndexOf(pole);
            string pole_lis = GetPosi_lis(inde,polecount);
            dt = ADO.HardDiskData.GetHardLineStandardData(pole_lis, startTimestamp, endTimestamp, line_code, pole_direction,lineids);
        }
        List<DataStandard> datalis = HardDiskLineStandard.ModelConvertHelper<DataStandard>.ConvertToModel(dt);
        //datalis = CheckPoleToLis(datalis);
        StringBuilder json = GetJson(datalis);

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }

    private void getLocoLis(HttpContext context)
    {
        string pole_code = HttpContext.Current.Request["pole_code"];//杆编码   
        string bow_position_code = HttpContext.Current.Request["bow_position_code"];
        DateTime endDate = Convert.ToDateTime(context.Request["end_time"]);//结束时间
        DateTime startDate = Convert.ToDateTime(context.Request["start_time"]);//开始时间
        string line_code = HttpContext.Current.Request["line_code"];
        string direction = HttpContext.Current.Request["direction"];
        //计算开始时间和结束时间的时间戳
        TimeSpan ts_start = startDate.ToUniversalTime() - new DateTime(1970, 1, 1, 0, 0, 0, 0);
        string startTimestamp = Convert.ToInt64(ts_start.TotalMilliseconds).ToString();

        TimeSpan ts_end = endDate.ToUniversalTime() - new DateTime(1970, 1, 1, 0, 0, 0, 0);
        string endTimestamp = Convert.ToInt64(ts_end.TotalMilliseconds).ToString();
        bow_position_code = "";

        DataTable dt_posi = ADO.HardDiskData.GetHardLineStandardLoco(startTimestamp, endTimestamp, line_code, direction);
        DataTable dt_data = ADO.HardDiskData.GetHardLineStandardLoco_Data(pole_code, startTimestamp, endTimestamp, bow_position_code, line_code, direction);

        List<LocoStandard> locolis = new List<LocoStandard>();
        if (dt_data.Rows.Count > 0 && dt_posi.Rows.Count > 0)
        {
            for (int i = 0; i < dt_posi.Rows.Count; i++)
            {
                for (int j = 0; j < dt_data.Rows.Count; j++)
                {
                    if (Convert.ToString(dt_posi.Rows[i]["LOCOMOTIVE_CODE"]) == Convert.ToString(dt_data.Rows[j]["LOCOMOTIVE_CODE"]) &&Convert.ToString(dt_posi.Rows[i]["BOW_POSITION_CODE"]) == Convert.ToString(dt_data.Rows[j]["BOW_POSITION_CODE"])&& Convert.ToDouble(dt_data.Rows[j]["TIMESTAMP_IRV"]) >= Convert.ToDouble(dt_posi.Rows[i]["START_TIMESTAMP_IRV"]) && Convert.ToDouble(dt_data.Rows[j]["TIMESTAMP_IRV"]) <= Convert.ToDouble(dt_posi.Rows[i]["END_TIMESTAMP_IRV"]))
                    {
                        LocoStandard loco = new LocoStandard();
                        loco.ID = Convert.ToString(dt_posi.Rows[i]["ID"]);
                        loco.LINE_CODE = Convert.ToString(dt_posi.Rows[i]["LINE_CODE"]);
                        loco.LINE_NAME = Api.Util.Common.getLineInfo(Convert.ToString(dt_posi.Rows[i]["LINE_CODE"])).LINE_NAME;
                        loco.LOCOMOTIVE_CODE = Convert.ToString(dt_posi.Rows[i]["LOCOMOTIVE_CODE"]);
                        loco.POSITION_CODE = Convert.ToString(dt_posi.Rows[i]["POSITION_CODE"]);
                        loco.POSITION_NAME = Api.Util.Common.getStationSectionInfo(Convert.ToString(dt_posi.Rows[i]["POSITION_CODE"])).POSITION_NAME;
                        loco.START_TIMESTAMP_IRV = Convert.ToString(dt_posi.Rows[i]["START_TIMESTAMP_IRV"]);
                        loco.END_TIMESTAMP_IRV = Convert.ToString(dt_posi.Rows[i]["END_TIMESTAMP_IRV"]);
                        loco.DIRECTION = Convert.ToString(dt_posi.Rows[i]["DIRECTION"]);
                        loco.PRIORITY = Convert.ToString(dt_data.Rows[j]["PRIORITY"]);
                        loco.TIMESTAMP_IRV = Convert.ToString(dt_data.Rows[j]["TIMESTAMP_IRV"]);
                        loco.BOW_POSITION_CODE = Convert.ToString(dt_data.Rows[j]["BOW_POSITION_CODE"]);
                        loco.BOW_POSITION_NAME = Convert.ToString(dt_data.Rows[j]["BOW_POSITION_NAME"]);
                        locolis.Add(loco);
                        break;
                    }
                }
            }
        }

        //  List<LocoStandard> locolis = HardDiskLineStandard.ModelConvertHelper<LocoStandard>.ConvertToModel(dt);
        var idlis = locolis.GroupBy(x => new { x.ID,x.BOW_POSITION_CODE,x.LOCOMOTIVE_CODE }).Select(g => g.ToList()).ToList();
        StringBuilder json = GetLocoJson(idlis, pole_code);

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }

    /// <summary>
    /// 硬盘数据播放单个杆
    /// </summary>
    public void getVedioPlaySingel(HttpContext context)
    {
        getTotalPoles();

        string line_code = HttpContext.Current.Request["line_code"];//线路编码
        string pole_direction = HttpContext.Current.Request["direction"];//行别                                                                    
        DateTime endDate = Convert.ToDateTime(context.Request["end_time"]);//结束时间
        DateTime startDate = Convert.ToDateTime(context.Request["start_time"]);//开始时间
        string bureau_code = HttpContext.Current.Request["bureau_code"];//局编码
        string org_code = HttpContext.Current.Request["org_code"];//供电段编码
        string index = HttpContext.Current.Request["index"];//杆序号
        string sort = HttpContext.Current.Request["sort"];//方向

        int inde = int.Parse(index);
        //计算开始时间和结束时间的时间戳
        TimeSpan ts_start = startDate.ToUniversalTime() - new DateTime(1970, 1, 1, 0, 0, 0, 0);
        string startTimestamp = Convert.ToInt64(ts_start.TotalMilliseconds).ToString();

        TimeSpan ts_end = endDate.ToUniversalTime() - new DateTime(1970, 1, 1, 0, 0, 0, 0);
        string endTimestamp = Convert.ToInt64(ts_end.TotalMilliseconds).ToString();

        //标准线路ID集
        string lineids = GetLineIds(context);

        bool result = ADO.HardDiskData.GetHardLineStandardDataExist(POLE_LIS[inde].POLE_CODE, startTimestamp, endTimestamp);
        DataTable dt = new DataTable();
        if (result)
        {
            string pole_lis = "'" + POLE_LIS[inde].POLE_CODE + "'";
            dt = ADO.HardDiskData.GetHardLineStandardData(pole_lis, startTimestamp, endTimestamp, line_code, pole_direction,lineids);
        }
        else
        {
            string pole = ADO.HardDiskData.GetHardLineStandardDataIndex(lineids, POLE_LIS[inde].POLE_ORDER, sort);
            inde = POLE_CODE_LIS.IndexOf(pole);
            string pole_lis = "'" + POLE_LIS[inde].POLE_CODE + "'";
            dt = ADO.HardDiskData.GetHardLineStandardData(pole_lis, startTimestamp, endTimestamp, line_code, pole_direction,lineids);
        }
        List<DataStandard> datalis = HardDiskLineStandard.ModelConvertHelper<DataStandard>.ConvertToModel(dt);
        //datalis = CheckPoleToLis(datalis);
        StringBuilder json = GetJson(datalis);

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }


    private List<DataStandard> CheckPoleToLis(List<DataStandard> datalis)
    {
        List<DataStandard> datalis_bak = new List<global::DataStandard>();
        var polelis = datalis.GroupBy(x => new { x.POLE_CODE }).Select(g => g.ToList()).ToList();
        foreach (List<DataStandard> poles in polelis)
        {
            List<DataStandard> poles_bak = poles.Where(m =>
            {
                bool str = true;
                if (!string.IsNullOrEmpty(poles[0].IRV_BOW_POSITION_CODE))
                {
                    str = m.IRV_BOW_POSITION_CODE == poles[0].IRV_BOW_POSITION_CODE;
                }
                if (!string.IsNullOrEmpty(poles[0].LOCOMOTIVE_CODE))
                {
                    str = str && m.LOCOMOTIVE_CODE == poles[0].LOCOMOTIVE_CODE;
                }
                if (!string.IsNullOrEmpty(poles[0].PRIORITY))
                {
                    str = str && m.PRIORITY==poles[0].PRIORITY;
                }
                if (!string.IsNullOrEmpty(poles[0].TASKTIME))
                {
                    str = str && Convert.ToDateTime(m.TASKTIME) >= Convert.ToDateTime(poles[0].TASKTIME).AddSeconds(-5);
                }
                if (!string.IsNullOrEmpty(poles[0].TASKTIME))
                {
                    str = str && Convert.ToDateTime(m.TASKTIME) <= Convert.ToDateTime(poles[0].TASKTIME);
                }
                return str;
            }).Select(m =>
            {
                var x = new DataStandard();
                x.ID = m.ID;
                x.TIMESTAMP_IRV = m.TIMESTAMP_IRV;
                x.GIS_X = m.GIS_X;
                x.GIS_Y = m.GIS_Y;
                x.GIS_X_O = m.GIS_X_O;
                x.GIS_Y_O = m.GIS_Y_O;
                x.N_SATELLITE = m.N_SATELLITE;
                x.N_STAGGER = m.N_STAGGER;
                x.N_HIGH = m.N_HIGH;
                x.N_IRV_TEMP = m.N_IRV_TEMP;
                x.N_ENV_TEMP = m.N_ENV_TEMP;
                x.N_SPEED = m.N_SPEED;
                x.LINE_CODE = m.LINE_CODE;
                x.DIRECTION = m.DIRECTION;
                x.POSITION_CODE = m.POSITION_CODE;
                x.KM_MARK = m.KM_MARK;
                x.POLE_NUMBER = m.POLE_NUMBER;
                x.POLE_CODE = m.POLE_CODE;
                x.POLE_SERIALNO = m.POLE_SERIALNO;
                x.BUREAU_CODE = m.BUREAU_CODE;
                x.POWER_SECTION_CODE = m.POWER_SECTION_CODE;
                x.P_ORG_CODE = m.P_ORG_CODE;
                x.ORG_CODE = m.ORG_CODE;
                x.STATUS = m.STATUS;
                x.CREATETIME = m.CREATETIME;
                x.EDITIME = m.EDITIME;
                x.TASKTIME = m.TASKTIME;
                x.BOW_OFFSET = m.BOW_OFFSET;
                x.LOCOMOTIVE_CODE = m.LOCOMOTIVE_CODE;
                x.IRV_DIRID = m.IRV_DIRID;
                x.VI_DIRID = m.VI_DIRID;
                x.OV_DIRID = m.OV_DIRID;
                x.IRV_IDX = m.IRV_IDX;
                x.VI_IDX = m.VI_IDX;
                x.OV_IDX = m.OV_IDX;
                x.AUX_IDX = m.AUX_IDX;
                x.AUX_DIRID = m.AUX_DIRID;
                x.PRIORITY = m.PRIORITY;
                x.IRV_DID = m.IRV_DID;
                x.IRV_BOW_POSITION_NAME = m.IRV_BOW_POSITION_NAME;
                x.IRV_BOW_POSITION_CODE = m.IRV_BOW_POSITION_CODE;
                x.IRV_START_TIMESTAMP = m.IRV_START_TIMESTAMP;
                x.IRV_END_TIMESTAMP = m.IRV_END_TIMESTAMP;
                x.IRV_FILE_TYPE = m.IRV_FILE_TYPE;
                x.IRV_FILE_PATH = m.IRV_FILE_PATH;
                x.IRV_TASK_ID = m.IRV_TASK_ID;
                x.VI_DID = m.VI_DID;
                x.VI_START_TIMESTAMP = m.VI_START_TIMESTAMP;
                x.VI_END_TIMESTAMP = m.VI_END_TIMESTAMP;
                x.VI_FILE_TYPE = m.VI_FILE_TYPE;
                x.VI_FILE_PATH = m.VI_FILE_PATH;
                x.VI_OFFSET = m.VI_OFFSET;
                x.OV_DID = m.OV_DID;
                x.OV_START_TIMESTAMP = m.OV_START_TIMESTAMP;
                x.OV_END_TIMESTAMP = m.OV_END_TIMESTAMP;
                x.OV_FILE_TYPE = m.OV_FILE_TYPE;
                x.OV_FILE_PATH = m.OV_FILE_PATH;
                x.OV_OFFSET = m.OV_OFFSET;
                x.AUX_DID = m.AUX_DID;
                x.AUX_START_TIMESTAMP = m.AUX_START_TIMESTAMP;
                x.AUX_END_TIMESTAMP = m.AUX_END_TIMESTAMP;
                x.AUX_FILE_TYPE = m.AUX_FILE_TYPE;
                x.AUX_FILE_PATH = m.AUX_FILE_PATH;
                x.AUX_OFFSET = m.AUX_OFFSET;
                return x;
            }).ToList();
            poles_bak = poles_bak.OrderBy(m => m.TIMESTAMP_IRV).ToList();
            datalis_bak.AddRange(poles_bak);
        }
        datalis_bak = datalis_bak.OrderBy(m => m.POLE_SERIALNO).ToList();
        return datalis_bak;
    }


    private StringBuilder GetLocoJson(List<List<LocoStandard>> loco_total, string pole_code)
    {
        loco_total=  loco_total.OrderByDescending(m => m[0].PRIORITY).ToList();
        StringBuilder json = new StringBuilder();
        if (loco_total.Count > 0)
        {
            json.Append("{\"data\":[");

            foreach (List<LocoStandard> loco_lis in loco_total)
            {

                DateTime time = new DateTime();
                DateTime dtStart = TimeZone.CurrentTimeZone.ToLocalTime(new DateTime(1970, 1, 1, 0, 0, 0));

                long lTime = long.Parse(loco_lis[0].TIMESTAMP_IRV + "0000");
                TimeSpan toNow = new TimeSpan(lTime);
                time = dtStart.Add(toNow);

                long lTime1 = long.Parse(loco_lis[0].START_TIMESTAMP_IRV + "0000");
                TimeSpan toNow1 = new TimeSpan(lTime1);
                DateTime start_time = dtStart.Add(toNow1);

                long lTime2 = long.Parse(loco_lis[0].END_TIMESTAMP_IRV + "0000");
                TimeSpan toNow2 = new TimeSpan(lTime2);
                DateTime end_time = dtStart.Add(toNow2);

                json.Append("{");
                json.Append("\"ID\":\"" + loco_lis[0].ID + "\",");//唯一标识
                json.Append("\"POLE_CODE\":\"" + pole_code + "\",");//红外时间戳
                json.Append("\"TIMESTAMP_IRV\":\"" + loco_lis[0].TIMESTAMP_IRV + "\",");//红外时间戳
                json.Append("\"time\":\"" + time.ToString("yyyy-MM-dd HH:mm:ss") + "\",");
                json.Append("\"DATE\":\"" + start_time.ToString("yyyy-MM-dd") + "\",");//日期
                json.Append("\"LINE_CODE\":\"" + loco_lis[0].LINE_CODE + "\",");//线路编码
                json.Append("\"LINE_NAME\":\"" + loco_lis[0].LINE_NAME + "\",");//线路名
                json.Append("\"DIRECTION\":\"" + loco_lis[0].DIRECTION + "\",");//行别
                string positioncode = loco_lis[0].POSITION_CODE;
                string positionname = Api.Util.Common.getStationSectionInfo(loco_lis[0].POSITION_CODE).POSITION_NAME;
                string positiontype = Api.Util.Common.getStationSectionInfo(loco_lis[0].POSITION_CODE).POSITION_TYPE;
                if (!string.IsNullOrEmpty(positionname) && (positiontype == "Q") && (loco_lis[0].DIRECTION == "下行"))
                {
                    string[] p = positionname.Split('－');
                    positionname = p[1] + "-" + p[0];
                }
                json.Append("\"POSITION_CODE\":\"" + positioncode + "\",");//区站编码
                json.Append("\"POSITION_NAME\":\"" + positionname + "\",");//区站名
                json.Append("\"START_TIME\":\"" + start_time.ToString("yyyy-MM-dd HH:mm:ss") + "\",");//开始时间
                json.Append("\"END_TIME\":\"" + end_time.ToString("yyyy-MM-dd HH:mm:ss") + "\",");//结束时间
                json.Append("\"START_TIMESTAMP\":\"" + loco_lis[0].START_TIMESTAMP_IRV + "\",");//开始时间戳
                json.Append("\"END_TIMESTAMP\":\"" + loco_lis[0].END_TIMESTAMP_IRV + "\",");//结束时间戳
                json.Append("\"PRIORITY\":\"" + loco_lis[0].PRIORITY + "\",");//优先级
                json.Append("\"BOW_POSITION_NAME\":\"" + loco_lis[0].BOW_POSITION_NAME + "\",");//弓位置
                json.Append("\"BOW_POSITION_CODE\":\"" + loco_lis[0].BOW_POSITION_CODE + "\",");//弓位置编码
                json.Append("\"LOCOMOTIVE_CODE\":\"" + loco_lis[0].LOCOMOTIVE_CODE + "\"");//车号

                //json.Append("\"DEVICE_BOW_RELATIONS\":\"" + datalis.DEVICE_BOW_RELATIONS + "\"");//
                json.Append("},");

            }
            json.Remove(json.Length - 1, 1);
            json.Append("]}");
        }
        return json;
    }



    private StringBuilder GetJson(List<DataStandard> datalis)
    {
        StringBuilder json = new StringBuilder();
        json.Append("{\"data\":[");

        for (int i = 0; i < datalis.Count; i++)
        {
            if (!string.IsNullOrEmpty(datalis[i].ID))
            {
                DateTime time = new DateTime();
                DateTime dtStart = TimeZone.CurrentTimeZone.ToLocalTime(new DateTime(1970, 1, 1, 0, 0, 0));
                long lTime = long.Parse(datalis[i].TIMESTAMP_IRV + "0000");
                TimeSpan toNow = new TimeSpan(lTime);
                time = dtStart.Add(toNow);

                json.Append("{");
                json.Append("\"ID\":\"" + datalis[i].ID + "\",");//唯一标识
                json.Append("\"TIMESTAMP_IRV\":\"" + datalis[i].TIMESTAMP_IRV + "\",");//红外时间戳
                json.Append("\"time\":\"" + time.ToString("yyyy-MM-dd HH:mm:ss") + "\",");
                json.Append("\"N_SATELLITE\":\"" + datalis[i].N_SATELLITE + "\",");//卫星数
                json.Append("\"N_STAGGER\":\"" + myfiter.GetPULLING_VALUE(datalis[i].N_STAGGER) + "\",");//拉出值
                json.Append("\"N_HIGH\":\"" + myfiter.GetLINE_HEIGHT(datalis[i].N_HIGH) + "\",");//导高值
                json.Append("\"N_IRV_TEMP\":\"" + myfiter.GetTEMP(string.IsNullOrEmpty(datalis[i].N_IRV_TEMP) ? 0 : Convert.ToInt32(datalis[i].N_IRV_TEMP)) + "\",");//红外温度
                json.Append("\"N_ENV_TEMP\":\"" + myfiter.GetTEMP(string.IsNullOrEmpty(datalis[i].N_ENV_TEMP) ? 0 : Convert.ToInt32(datalis[i].N_ENV_TEMP)) + "\",");//环境温度
                json.Append("\"N_SPEED\":\"" + myfiter.GetSpeed(datalis[i].N_SPEED) + "\",");//速度
                json.Append("\"LINE_CODE\":\"" + datalis[i].LINE_CODE + "\",");//线路编码
                json.Append("\"LINE_NAME\":\"" + Api.Util.Common.getLineInfo(datalis[i].LINE_CODE).LINE_NAME + "\",");//线路名
                json.Append("\"DIRECTION\":\"" + datalis[i].DIRECTION + "\",");//行别

                string positioncode = datalis[i].POSITION_CODE;
                string positionname = Api.Util.Common.getStationSectionInfo(datalis[i].POSITION_CODE).POSITION_NAME;
                string positiontype = Api.Util.Common.getStationSectionInfo(datalis[i].POSITION_CODE).POSITION_TYPE;
                if (!string.IsNullOrEmpty(positionname) && (positiontype == "Q") && (datalis[i].DIRECTION == "下行"))
                {
                    string[] p = positionname.Split('－');
                    positionname = p[1] + "-" + p[0];
                }
                json.Append("\"POSITION_CODE\":\"" + positioncode + "\",");//区站编码
                json.Append("\"POSITION_NAME\":\"" + positionname + "\",");//区站名

                json.Append("\"BRG_TUN_CODE\":\"" + datalis[i].BRG_TUN_CODE + "\",");//桥隧编码
                json.Append("\"BRG_TUN_NAME\":\"" + Api.Util.Common.getBridgeTuneInfo(datalis[i].BRG_TUN_CODE).BRG_TUN_NAME + "\",");//桥隧名
                json.Append("\"KM_MARK\":\"" + datalis[i].KM_MARK + "\",");//公里标
                json.Append("\"KM\":\"" + PublicMethod.KmtoString(datalis[i].KM_MARK) + "\",");//转换后的公里标
                json.Append("\"POLE_NUMBER\":\"" + datalis[i].POLE_NUMBER + "\",");//杆号
                json.Append("\"POLE_CODE\":\"" + datalis[i].POLE_CODE + "\",");//杆编码
                json.Append("\"POLE_SERIALNO\":\"" + datalis[i].POLE_SERIALNO + "\",");//杆序号
                json.Append("\"BUREAU_CODE\":\"" + Api.Util.Common.getOrgInfo(datalis[i].BUREAU_CODE).ORG_NAME + "\",");//局编码
                json.Append("\"BUREAU_NAME\":\"" + Api.Util.Common.getOrgInfo(datalis[i].BUREAU_CODE).ORG_NAME + "\",");//局名称
                json.Append("\"POWER_SECTION_CODE\":\"" + datalis[i].POWER_SECTION_CODE + "\",");//供电段编码
                json.Append("\"POWER_SECTION_NAME\":\"" + Api.Util.Common.getOrgInfo(datalis[i].POWER_SECTION_CODE).ORG_NAME + "\",");//供电段名称
                json.Append("\"P_ORG_CODE\":\"" + datalis[i].P_ORG_CODE + "\",");//机务段编码
                json.Append("\"P_ORG_NAME\":\"" + Api.Util.Common.getOrgInfo(datalis[i].P_ORG_CODE).ORG_NAME + "\",");//机务段名称
                json.Append("\"ORG_CODE\":\"" + datalis[i].ORG_CODE + "\",");//供电段编码
                json.Append("\"ORG_NAME\":\"" + Api.Util.Common.getOrgInfo(datalis[i].ORG_CODE).ORG_NAME + "\",");//供电段名称
                json.Append("\"FILEPATH_IRV\":\"" + (string.IsNullOrEmpty(datalis[i].IRV_FILE_PATH) ? "" : datalis[i].IRV_FILE_PATH.Replace("\\", "%5c").Replace("#", "%23")) + "\",");//红外文件路径
                json.Append("\"FILEPATH_OV\":\"" + (string.IsNullOrEmpty(datalis[i].OV_FILE_PATH) ? "" : datalis[i].OV_FILE_PATH.Replace("\\", "%5c").Replace("#", "%23")) + "\",");//全景文件路径
                json.Append("\"FILEPATH_VI\":\"" + (string.IsNullOrEmpty(datalis[i].VI_FILE_PATH) ? "" : datalis[i].VI_FILE_PATH.Replace("\\", "%5c").Replace("#", "%23")) + "\",");//可见光文件路径
                json.Append("\"FILEPATH_AUX\":\"" + (string.IsNullOrEmpty(datalis[i].AUX_FILE_PATH) ? "" : datalis[i].AUX_FILE_PATH.Replace("\\", "%5c").Replace("#", "%23")) + "\",");//辅助文件路径
                json.Append("\"BOW_POSITION_CODE\":\"" + datalis[i].IRV_BOW_POSITION_CODE + "\",");//弓位置编码
                json.Append("\"BOW_POSITION_NAME\":\"" + datalis[i].IRV_BOW_POSITION_NAME + "\",");//弓位置名称
                json.Append("\"LOCOMOTIVE_CODE\":\"" + datalis[i].LOCOMOTIVE_CODE + "\",");//车号
                json.Append("\"IRV_IDX\":\"" + datalis[i].IRV_IDX + "\",");//红外索引
                json.Append("\"OV_IDX\":\"" + datalis[i].OV_IDX + "\",");//全景索引
                json.Append("\"VI_IDX\":\"" + datalis[i].VI_IDX + "\",");//可见光索引
                json.Append("\"AUX_IDX\":\"" + datalis[i].AUX_IDX + "\",");//辅助索引
                json.Append("\"OV_OFFSET\":\"" + datalis[i].OV_OFFSET + "\",");//全景偏移
                json.Append("\"VI_OFFSET\":\"" + datalis[i].VI_OFFSET + "\",");//可见光偏移
                json.Append("\"AUX_OFFSET\":\"" + datalis[i].AUX_OFFSET + "\",");//辅助偏移
                json.Append("\"POLE_INDEX\":\"" + POLE_CODE_LIS.IndexOf(datalis[i].POLE_CODE).ToString() + "\",");
                json.Append("\"POLE_TOTAL\":\"" + POLE_LIS.Count + "\"");
                //json.Append("\"DEVICE_BOW_RELATIONS\":\"" + datalis.DEVICE_BOW_RELATIONS + "\"");//
                json.Append("},");
            }
        }
        json.Remove(json.Length - 1, 1);
        json.Append("],");
        json.Append("\"sessionid\":\"" + HttpContext.Current.Session.SessionID + "\",\"request_index\":\""+ POLE_CODE_LIS.IndexOf(datalis[datalis.Count/2].POLE_CODE).ToString()+"\"}");



        return json;
    }



    private string GetPosi_lis(int index, string polecount)
    {
        string str = "";
        int num = int.Parse(polecount);
        int count = (index + num) > POLE_LIS.Count() ? POLE_LIS.Count() : (index + num);
        for (int i = index; i < count; i++)
        {
            if (i == index + num - 1 || i == POLE_LIS.Count - 1)
            {
                str += "'" + POLE_LIS[i].POLE_CODE + "'";
                break;
            }
            else
                str += "'" + POLE_LIS[i].POLE_CODE + "',";
        }
        return str;
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
        int x1 = string.IsNullOrEmpty(HttpContext.Current.Request["x1"])?320:Convert.ToInt32(HttpContext.Current.Request["x1"]);//左上角X坐标点
        int y1 = string.IsNullOrEmpty(HttpContext.Current.Request["y1"])?320:Convert.ToInt32(HttpContext.Current.Request["y1"]);//左下角Y坐标点

        int x2 = string.IsNullOrEmpty(HttpContext.Current.Request["x2"])?0:Convert.ToInt32(HttpContext.Current.Request["x2"]);//右上角X坐标点
        int y2 = string.IsNullOrEmpty(HttpContext.Current.Request["y2"])?0:Convert.ToInt32(HttpContext.Current.Request["y2"]);//右下角Y坐标点

        long idx = Convert.ToInt64(IRVIDX);
        string filepath = string.IsNullOrEmpty(path) ? "" : path.Replace("%5c", "\\").Replace("%23", "#");

        string sessionid = HttpContext.Current.Session.SessionID;
        object o = WCF3CDataProvider.ExecuteMetod_T<IDataProvider>("hardProvider","GetIrvTempData",new object[] { sessionid, locomotive, filepath, idx ,x1,y1,x2,y2 });

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
        alarmcond.businssAnd += " RAISED_TIME = TO_DATE('" + time +"','yyyy-mm-dd hh24:mi:ss')";

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

        int t_severity = string.IsNullOrEmpty(HttpContext.Current.Request["tseverity"])  ? 0 :Convert.ToInt32(HttpContext.Current.Request["tseverity"]);//手动转发标志,0为自然状态
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
        object o = WCF3CDataProvider.ExecuteMetod_T<IDataProvider>("hardProvider","CreateAlarm", new object[] { sessionid,locomotive_code , FILEIRVPATH, FILEVIPATH,FILEOVPATH, time,irvindex,viof,ovof,0, alarmParamJson,beforeFrameCnt,afterFrameCnt });

        StringBuilder re = new StringBuilder();
        re.Append("{\"re\":\"" + o + "\"}");

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(re);

    }
    public void getIndex()
    {
        getTotalPoles();

        string line_code = HttpContext.Current.Request["line_code"];//线路编码
        string pole_direction = HttpContext.Current.Request["direction"];//行别
        string position_code = HttpContext.Current.Request["position_code"];//区站编码
        DateTime start_time = Convert.ToDateTime(HttpContext.Current.Request["start_time"]);//开始红外时间戳
        DateTime end_time = Convert.ToDateTime(HttpContext.Current.Request["end_time"]);//结束时间
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
        string bureau_code = HttpContext.Current.Request["bureau_code"];//局编码
        string org_code = HttpContext.Current.Request["org_code"];//供电段编码


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

        //计算开始时间和结束时间的时间戳
        TimeSpan ts_start = start_time.ToUniversalTime() - new DateTime(1970, 1, 1, 0, 0, 0, 0);
        string start_timestamp = Convert.ToInt64(ts_start.TotalMilliseconds).ToString();

        TimeSpan ts_end = end_time.ToUniversalTime() - new DateTime(1970, 1, 1, 0, 0, 0, 0);
        string end_timestamp = Convert.ToInt64(ts_end.TotalMilliseconds).ToString();

        System.Data.DataSet ds = ADO.HardDiskData.GetIndexStandard(line_code, pole_direction, position_code, start_timestamp, end_timestamp, locomotive_code, bow_position_code, t_start_time, t_line_code, t_pole_direction, t_position_code, t_brg_tun_code, t_start_km, t_end_km, t_pole_code,bureau_code,org_code);

        int index = -1;
        if (ds.Tables[0].Rows.Count > 0)
        {
            string pole_code = ds.Tables[0].Rows[0]["POLE_CODE"].ToString();
            index = POLE_CODE_LIS.IndexOf(pole_code);
        }


        StringBuilder json = new StringBuilder();
        json.Append("{\"POLE_INDEX\":\"" + index + "\"}");

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }

    /// <summary>
    /// 获取硬盘数据播放总杆数
    /// </summary>
    public void getTotalPoles()
    {
        string line_code = HttpContext.Current.Request["line_code"];//线路编码
        string pole_direction = HttpContext.Current.Request["direction"];//行别                                                                    
        string bureau_code = HttpContext.Current.Request["bureau_code"];//局编码
        string org_code = HttpContext.Current.Request["org_code"];//供电段编码


        string strwhere = GetStrwhere(line_code, pole_direction, bureau_code, org_code);
        DataTable dt = ADO.HardDiskData.GetHardLineStandardPole(strwhere);
        List<PoleStandard> pole_lis = new List<PoleStandard>();
        List<string> pole_code_lis = new List<string>();
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            PoleStandard pole = new global::PoleStandard();
            pole.POLE_CODE = dt.Rows[i]["POLE_CODE"].ToString();
            pole.POLE_ORDER = int.Parse(dt.Rows[i]["POLE_ORDER"].ToString());
            pole_lis.Add(pole);
            pole_code_lis.Add(dt.Rows[i]["POLE_CODE"].ToString());
        }
        POLE_LIS = pole_lis;
        POLE_CODE_LIS = pole_code_lis;
    }

    private string GetStrwhere(string line_code, string pole_direction, string bureau_code, string org_code)
    {
        string strwhere = "1=1";
        if (!string.IsNullOrEmpty(line_code))
        {
            strwhere += " AND LINE_CODE='" + line_code + "'";
        }
        if (!string.IsNullOrEmpty(pole_direction))
        {
            strwhere += " AND ORG_DIRECTION='" + pole_direction + "'";
        }
        if (!string.IsNullOrEmpty(bureau_code))
        {
            strwhere += " AND BUREAU_CODE='" + bureau_code + "'";
        }
        if (!string.IsNullOrEmpty(org_code))
        {
            strwhere += " AND POWER_SECTION_CODE='" + org_code + "'";
        }
        return strwhere;
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

        System.Data.DataSet ds = ADO.HardDiskData.GetAlarmList(start_timestamp,end_timestamp,line_code,pole_direction,position_code,locomotive_code);

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

    public string GetLineIds(HttpContext context)
    {
        string lineids = "";
        string line_code = HttpContext.Current.Request["line_code"];//线路编码
        string pole_direction = HttpContext.Current.Request["direction"];//行别                                                                    
        DateTime endDate = Convert.ToDateTime(context.Request["end_time"]);//结束时间
        DateTime startDate = Convert.ToDateTime(context.Request["start_time"]);//开始时间
        string bureau_code = HttpContext.Current.Request["bureau_code"];//局编码
        string org_code = HttpContext.Current.Request["org_code"];//供电段编码
        startDate = startDate.AddDays(1 - startDate.Day);  //本月月初  

        DataTable dt = ADO.HardDiskData.GetHardLineStandardLineIds(startDate, endDate, bureau_code, org_code, line_code, pole_direction);
        if (dt.Rows.Count > 0)
        {
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                lineids += "'" + dt.Rows[i]["ID"] + "',";
            }
            lineids = lineids.Substring(0, lineids.Length - 1);
        }

        return lineids;
    }


    public bool IsReusable {
        get {
            return false;
        }
    }


}

public class PoleStandard
{
    public string POLE_CODE;
    public int POLE_ORDER;
}

public class DataStandard
{
    public string ID;
    public string TIMESTAMP_IRV;
    public string GIS_X;
    public string GIS_Y;
    public string GIS_X_O;
    public string GIS_Y_O;
    public string N_SATELLITE;
    public string N_STAGGER;
    public string N_HIGH;
    public string N_IRV_TEMP;
    public string N_ENV_TEMP;
    public string N_SPEED;
    public string LINE_CODE;
    public string DIRECTION;
    public string POSITION_CODE;
    public string BRG_TUN_CODE;
    public string KM_MARK;
    public string POLE_NUMBER;
    public string POLE_CODE;
    public string POLE_SERIALNO;
    public string BUREAU_CODE;
    public string POWER_SECTION_CODE;
    public string P_ORG_CODE;
    public string ORG_CODE;
    public string STATUS;
    public string CREATETIME;
    public string EDITIME;
    public string TASKTIME;
    public string BOW_OFFSET;
    public string LOCOMOTIVE_CODE;
    public string IRV_DIRID;
    public string VI_DIRID;
    public string OV_DIRID;
    public string IRV_IDX;
    public string VI_IDX;
    public string OV_IDX;
    public string AUX_IDX;
    public string AUX_DIRID;
    public string PRIORITY;
    public string IRV_DID;
    public string IRV_BOW_POSITION_NAME;
    public string IRV_BOW_POSITION_CODE;
    public string IRV_START_TIMESTAMP;
    public string IRV_END_TIMESTAMP;
    public string IRV_FILE_TYPE;
    public string IRV_FILE_PATH;
    public string IRV_TASK_ID;
    public string VI_DID;
    public string VI_START_TIMESTAMP;
    public string VI_END_TIMESTAMP;
    public string VI_FILE_TYPE;
    public string VI_FILE_PATH;
    public string VI_OFFSET;
    public string OV_DID;
    public string OV_START_TIMESTAMP;
    public string OV_END_TIMESTAMP;
    public string OV_FILE_TYPE;
    public string OV_FILE_PATH;
    public string OV_OFFSET;
    public string AUX_DID;
    public string AUX_START_TIMESTAMP;
    public string AUX_END_TIMESTAMP;
    public string AUX_FILE_TYPE;
    public string AUX_FILE_PATH;
    public string AUX_OFFSET;
}

public class LocoStandard
{
    public string ID;
    public string TIMESTAMP_IRV;
    public string LINE_CODE;
    public string LINE_NAME;
    public string DIRECTION;
    public string POSITION_CODE;
    public string POSITION_NAME;
    public string LOCOMOTIVE_CODE;
    public string START_TIMESTAMP_IRV;
    public string END_TIMESTAMP_IRV;
    public string PRIORITY;
    public string BOW_POSITION_NAME;
    public string BOW_POSITION_CODE;
}