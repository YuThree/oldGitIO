<%@ WebHandler Language="C#" Class="DaliyWalkAlarm" %>

using System;
using System.Web;
using Api.Foundation.entity.Foundation;
using Api.Foundation.entity.Cond;
using System.Collections.Generic;
using System.Text;
using Api.Fault.entity.alarm;
using Api.ADO.entity;
using System.IO;
using Api.Util;
using Api;

public class DaliyWalkAlarm : ReferenceClass, IHttpHandler {

    public void ProcessRequest(HttpContext context)
    {

        try
        {
            string action = context.Request["action"];
            switch (action)
            {
                case "Add":
                    AddDailyWorkAlrm();
                    break;
                case "GetPoleList":
                    GetPoleList();
                    break;
                case "UpLoad":
                    UpLoad();
                    break;
                case "AlarmPictureUpLoad":
                    AlarmPictureUpLoad();
                    break;
                case "Delete":
                    Delete();
                    break;
                case "GetDetail":
                    GetDetail();
                    break;
                default:
                    break;
            }
        }
        catch (Exception ex)
        {

            log4net.ILog log = log4net.LogManager.GetLogger("日常步行巡检缺陷");
            log.Error("执行出错", ex);
        }
    }
    public void GetPoleList()
    {
        //线路
        string lineCode = HttpContext.Current.Request["lineCode"];
        //行别
        string direction = HttpContext.Current.Request["direction"];
        //区站
        string positionCode = HttpContext.Current.Request["positionCode"];
        //桥隧
        string brg_tun_code = HttpContext.Current.Request["bridgetune"];
        //杆号
        string pole_no = HttpContext.Current.Request["pole_no"];
        //开始公里标
        int startKM = !string.IsNullOrEmpty(HttpContext.Current.Request["startKM"]) ? Convert.ToInt32(HttpContext.Current.Request["startKM"]) : -1;
        //结束公里标
        int endKM = !string.IsNullOrEmpty(HttpContext.Current.Request["endKM"]) ? Convert.ToInt32(HttpContext.Current.Request["endKM"]) : -1;
        //前台页码
        int pageIndex = !string.IsNullOrEmpty(HttpContext.Current.Request["pageIndex"]) ? Convert.ToInt32(HttpContext.Current.Request["pageIndex"]) : 1;
        //前台条数
        int pageSize = !string.IsNullOrEmpty(HttpContext.Current.Request["pageSize"]) ? Convert.ToInt32(HttpContext.Current.Request["pageSize"]) : 30;
        PoleCond polecond = new PoleCond();
        polecond.businssAnd += " 1=1 ";
        if (!string.IsNullOrEmpty(pole_no))
        {
            pole_no = pole_no.Replace("%23", "#");
        }
        if (!string.IsNullOrEmpty(lineCode))
        {
            polecond.LINE_CODE = lineCode;
        }
        if (!string.IsNullOrEmpty(direction))
        {
            polecond.ORG_DIRECTION = direction;
        }
        if (!string.IsNullOrEmpty(positionCode))
        {
            polecond.POSITION_CODE = positionCode;
        }
        if (!string.IsNullOrEmpty(brg_tun_code))
        {
            polecond.BRG_TUN_CODE = brg_tun_code;
        }
        if (startKM != -1)
        {
            polecond.startKm = startKM;
        }
        if (endKM != -1)
        {
            polecond.endKm = endKM;
        }
        if (!string.IsNullOrEmpty(pole_no))
        {
            if (!string.IsNullOrEmpty(polecond.businssAnd))
            {
                polecond.businssAnd += " AND ";
            }

            polecond.businssAnd += string.Format(" POLE_NO LIKE '%{0}%'", pole_no);

        }
        polecond.pageSize = pageSize;
        polecond.pageNum = pageIndex;
        polecond.orderBy = "KMSTANDARD ASC";

        StringBuilder json = new StringBuilder();

        json.Append("{\"data\":[");

        IList<Pole> poleList = Api.ServiceAccessor.GetFoundationService().queryPolePage(polecond, true);

        for (int i = 0; i < poleList.Count; i++)
        {
            string org = getOrg(poleList[i]);

            json.Append("{\"KM_MARK\":\"" + PublicMethod.KmtoString(poleList[i].KMSTANDARD.ToString()) + "\",");
            json.Append("\"KM\":\"" + poleList[i].KMSTANDARD + "\",");
            json.Append("\"POLE_CODE\":\"" + poleList[i].POLE_CODE + "\",");
            json.Append("\"GIS_LAT\":\"" + poleList[i].GIS_LAT + "\",");
            json.Append("\"GIS_LON\":\"" + poleList[i].GIS_LON + "\",");
            json.Append("\"ORG\":\"" + org + "\",");
            json.Append("\"ORG_CODE\":\"" + poleList[i].ORG_CODE + "\",");
            json.Append("\"ORG_NAME\":\"" + poleList[i].ORG_NAME + "\",");
            json.Append("\"POLE_NO\":\"" + poleList[i].POLE_NO + "\"}");
            if (i < poleList.Count - 1)
            {
                json.Append(",");
            }
        }
        json.Append("]");

        PageHelper ph = new PageHelper();
        int total = 0;
        if (poleList.Count > 0)
        {
            total = Convert.ToInt32(poleList[0].MY_INT_1);
        }
        json.Append("," + ph.getPageJson(total, pageIndex, pageSize) + "}");


        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }
    public string getOrg(Pole pole)
    {
        string re = "";

        if (!string.IsNullOrEmpty(pole.BUREAU_NAME))
        {
            re += "&nbsp;" + pole.BUREAU_NAME;
        }
        if (!string.IsNullOrEmpty(pole.LINE_NAME))
        {
            re += "&nbsp;" + pole.LINE_NAME;
        }
        if (!string.IsNullOrEmpty(pole.WORKSHOP_NAME))
        {
            re += "&nbsp;" + pole.WORKSHOP_NAME;
        }
        if (!string.IsNullOrEmpty(pole.ORG_NAME))
        {
            re += "&nbsp;" + pole.ORG_NAME;
        }

        return re;
    }
    public void AddDailyWorkAlrm()
    {
        string pole_code = HttpContext.Current.Request["pole_code"];
        string severity = HttpContext.Current.Request["severity"];
        string code = HttpContext.Current.Request["code"];
        string code_name = HttpContext.Current.Request["code_name"];
        string raised_time = HttpContext.Current.Request["raised_time"];
        string line_code = HttpContext.Current.Request["line_code"];
        string line_name = HttpContext.Current.Request["line_name"];
        string position_code = HttpContext.Current.Request["position_code"];
        string position_name = HttpContext.Current.Request["position_name"];
        string direction = HttpContext.Current.Request["direction"];
        string pole_no = HttpContext.Current.Request["pole_no"];
        string km = HttpContext.Current.Request["km"];
        string alarm_analysis = HttpContext.Current.Request["alarm_analysis"];
        string files = HttpContext.Current.Request["files"];
        string report_person = HttpContext.Current.Request["report_person"];
        string report_date = HttpContext.Current.Request["report_date"];

        Alarm fault = new Alarm();


        if (!string.IsNullOrEmpty(pole_code))
        {
            pole_code = pole_code.Replace("%23", "#");
            fault.DEVICE_ID = pole_code;
        }
        if (!string.IsNullOrEmpty(severity))
        {
            fault.SEVERITY = severity;
        }
        if (!string.IsNullOrEmpty(code))
        {
            fault.CODE = code;
        }
        if (!string.IsNullOrEmpty(code_name))
        {
            fault.CODE_NAME = code_name;
        }
        if (!string.IsNullOrEmpty(raised_time))
        {
            fault.RAISED_TIME = Convert.ToDateTime(raised_time);
        }
        if (!string.IsNullOrEmpty(line_code))
        {
            fault.LINE_CODE = line_code;
        }
        if (!string.IsNullOrEmpty(line_name))
        {
            fault.LINE_NAME = line_name;
        }
        if (!string.IsNullOrEmpty(position_code))
        {
            fault.POSITION_CODE = position_code;
        }
        if (!string.IsNullOrEmpty(position_name))
        {
            fault.POSITION_NAME = position_name;
        }
        if (!string.IsNullOrEmpty(direction))
        {
            fault.DIRECTION = direction;
        }
        if (!string.IsNullOrEmpty(pole_no))
        {
            fault.POLE_NUMBER = pole_no;
        }
        if (!string.IsNullOrEmpty(km))
        {
            fault.KM_MARK = Convert.ToInt32(km);
        }
        else
        {
            fault.KM_MARK = -99999999;
        }
        if (!string.IsNullOrEmpty(alarm_analysis))
        {
            fault.ALARM_ANALYSIS = alarm_analysis;
        }
        if (!string.IsNullOrEmpty(files))
        {
            fault.SVALUE5 = files.Replace("/", "");
            fault.SVALUE5 = fault.SVALUE5.Replace("\\", "/");
        }
        if (!string.IsNullOrEmpty(report_person))
        {
            fault.REPORT_PERSON = report_person;
        }
        if (!string.IsNullOrEmpty(report_date))
        {
            fault.REPORT_DATE = Convert.ToDateTime(report_date);
        }
        else
        {
            fault.REPORT_DATE = DateTime.Now;
        }
        if (!string.IsNullOrEmpty(pole_code))
        {
            pole_code = pole_code.Replace("%23", "#");
            Pole poleInfo = Api.ServiceAccessor.GetFoundationService().queryPoleByPoleCode(pole_code);
            if (!string.IsNullOrEmpty(poleInfo.POLE_CODE))
            {
                fault.GIS_X = poleInfo.GIS_LON;
                fault.GIS_Y = poleInfo.GIS_LAT;
                fault.POSITION_CODE = poleInfo.POSITION_CODE;
                fault.POSITION_NAME = poleInfo.POSITION_NAME;
                fault.POWER_DEVICE_CODE = poleInfo.SUBSTATION_CODE;
                fault.LINE_CODE = poleInfo.LINE_CODE;
                fault.LINE_NAME = poleInfo.LINE_NAME;
                fault.BUREAU_CODE = poleInfo.BUREAU_CODE;
                fault.BUREAU_NAME = poleInfo.BUREAU_NAME;
                fault.POWER_SECTION_CODE = poleInfo.POWER_SECTION_CODE;
                fault.POWER_SECTION_NAME = poleInfo.POWER_SECTION_NAME;
                fault.BRG_TUN_CODE = poleInfo.BRG_TUN_CODE;
                fault.BRG_TUN_NAME = poleInfo.BRG_TUN_NAME;
                fault.WORKSHOP_CODE = poleInfo.WORKSHOP_CODE;
                fault.WORKSHOP_NAME = poleInfo.WORKSHOP_NAME;
                fault.ORG_CODE = poleInfo.ORG_CODE;
                fault.ORG_NAME = poleInfo.ORG_NAME;
                fault.DEVICE_ID = poleInfo.POLE_CODE;
                fault.KM_MARK = Convert.ToInt32(poleInfo.KMSTANDARD);
                fault.POLE_NUMBER = poleInfo.POLE_NO;
                fault.DIRECTION = poleInfo.POLE_DIRECTION;
            }
        }

        fault.CATEGORY_CODE = "STEP_PET";
        fault.DATA_TYPE = "ALARM";
        fault.SOURCE = "人工输入";
        fault.VENDOR = "成都国铁电气";
        fault.STATUS = "AFSTATUS01";
        fault.STATUS_NAME = "新上报";
        fault.CREATED_TIME = DateTime.Now;
        fault.STATUS_TIME = DateTime.Now;
        fault.IS_TYPICAL = "0";
        fault.ID = "C" + Guid.NewGuid().ToString().Replace("-", "");
        bool re = Api.ServiceAccessor.GetAlarmService().addAlarm(fault);
        string alarmid = "";
        if (re)
        {
            Alarm_AUX alarm_aux = new Alarm_AUX();
            alarm_aux.ALARM_ID = fault.ID;
            re = Api.ServiceAccessor.GetAlarmService().addAlarm_Aux(alarm_aux);
        }
        if (re)
        {
            alarmid = fault.ID;
        }
        StringBuilder json = new StringBuilder();
        json.Append("{\"re\":\"" + re + "\",\"alarmid\":\"" + alarmid + "\"}");
        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }
    /// <summary>
    /// 日常步行巡检缺陷详情页报警上传
    /// </summary>
    public void AlarmPictureUpLoad()
    {
        string alarmid = HttpContext.Current.Request["alarmid"];//缺陷编码
        HttpFileCollection files = HttpContext.Current.Request.Files;//上传文件
        string addurl = null;
        string feather = "picture";
        int t = 0;
        StringBuilder json = new StringBuilder();
        bool re = false;
        try
        {

            if (!string.IsNullOrEmpty(alarmid) && files != null && files.Count > 0)
            {
                //Alarm alarm = Api.ServiceAccessor.GetAlarmService().getAlarm(alarmid);
                Alarm alarm = Api.ServiceAccessor.GetAlarmService().getAlarm(alarmid);

                ADO.IVirtual_dir_infoImpl iserver = new ADO.IVirtual_dir_infoImpl();
                Virtual_Dir_Info vp = iserver.getVirtualAndPhysical();

                string VIRTUAL_DIR_NAME = vp.VIRTUAL_DIR_NAME;

                if (!string.IsNullOrEmpty(VIRTUAL_DIR_NAME))
                {
                    string path = HttpContext.Current.Server.MapPath("/" + VIRTUAL_DIR_NAME);
                    HttpPostedFile file = files[0];
                    string fileName = Path.GetFileName(file.FileName);
                    string fileExt = Path.GetExtension(file.FileName);
                    if (fileExt.Equals(".jpeg", StringComparison.OrdinalIgnoreCase) || fileExt.Equals(".bmp", StringComparison.OrdinalIgnoreCase) || fileExt.Equals(".png", StringComparison.OrdinalIgnoreCase) || fileExt.Equals(".gif", StringComparison.OrdinalIgnoreCase) || fileExt.Equals(".jpg", StringComparison.OrdinalIgnoreCase))
                    {
                        string newfile = "\\" + feather + "\\" + DateTime.Now.ToString("yyyy") + "\\" + DateTime.Now.ToString("MM") + "\\" + DateTime.Now.ToString("dd") + "\\";
                        path = path + "\\" + "DailyWalkAlarmFiles" + newfile;
                        if (!Directory.Exists(path))
                        {
                            Directory.CreateDirectory(path);
                        }
                        Random rd = new Random(DateTime.Now.Millisecond);
                        int num = rd.Next(100000, 1000000);

                        fileName = DateTime.Now.ToString("yyyyMMdd_HHmmss") + "_" + num + fileExt;
                        //string ss = path + fileName;
                        file.SaveAs(path + fileName);
                        //写入数据库的路径
                        addurl = "/" + VIRTUAL_DIR_NAME + "\\" + "DailyWalkAlarmFiles" + newfile + fileName;
                        addurl = addurl.Replace("/", "");
                        addurl = addurl.Replace("\\", "/");
                    }
                    t = ADO.AlarmQuery.UpdateDailyAlarmLoadPic(alarmid, addurl);
                    if (t > 0)
                    {
                        re = true;
                    }
                }
            }
        }
        catch (Exception ex)
        {
            log4net.ILog log2 = log4net.LogManager.GetLogger("日常步行巡检缺陷详情页报警上传");
            log2.Error("Error", ex);
        }
        json.Append("{\"re\":\"" + re + "\"}");
        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }
    /// <summary>
    /// 删除文件
    /// </summary>
    public void Delete()
    {
        string alarmid = HttpContext.Current.Request["alarmid"];//缺陷编码
        string file = HttpContext.Current.Request["file"];//图片路径

        bool sign = false;
        string state = "删除成功";
        if (!string.IsNullOrEmpty(file) && !string.IsNullOrEmpty(alarmid))
        {
            string url = HttpContext.Current.Server.MapPath(file);
            url = url.Replace("#", "%23");
            if (File.Exists(url))
            {
                file = file.TrimStart('/');
                int re = ADO.AlarmQuery.DeleteDailyAlarmPicPath(alarmid, file);
                if (re > 0)
                {
                    FileInfo fi = new FileInfo(url);
                    File.Delete(url);
                    sign = true;
                }
                else
                {
                    state = "删除失败";
                    log4net.ILog log2 = log4net.LogManager.GetLogger("删除上传图片");
                    log2.Info("数据库记录删除失败：" + url);
                }
            }
            else
            {
                log4net.ILog log2 = log4net.LogManager.GetLogger("删除上传图片");
                log2.Info("服务器无文件：" + url);
                file = file.TrimStart('/');
                int re = ADO.AlarmQuery.DeleteDailyAlarmPicPath(alarmid, file);//服务器上不存在仍对数据库记录进行删除
                if (re > 0)
                {
                    sign = true;
                    state = "服务器无文件，删除数据库记录成功";
                }
                else
                {
                    state = "服务器无文件，删除数据库记录失败";
                    log2.Info("数据库记录删除失败：" + url);
                }
            }
        }

        StringBuilder json = new StringBuilder();
        json.Append("{\"sign\":\"" + sign + "\",\"state\":\"" + state + "\"}");

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json.ToString());
    }
    /// <summary>
    /// 文件上传
    /// </summary>
    public void UpLoad()
    {
        //string feather = HttpContext.Current.Request["feather"];//类型
        string feather = "";
        HttpFileCollection files = HttpContext.Current.Request.Files;//上传文件
        string addurls = null;
        int t = 0;
        try
        {
            ADO.IVirtual_dir_infoImpl iserver = new ADO.IVirtual_dir_infoImpl();
            Virtual_Dir_Info vp = iserver.getVirtualAndPhysical();
            string VIRTUAL_DIR_NAME = vp.VIRTUAL_DIR_NAME;

            HttpPostedFile file = files[0];

            if (!string.IsNullOrEmpty(VIRTUAL_DIR_NAME))
            {
                string path = HttpContext.Current.Server.MapPath("/" + VIRTUAL_DIR_NAME);

                string fileName = Path.GetFileName(file.FileName);
                string fileExt = Path.GetExtension(file.FileName);

                if (fileExt.Equals(".jpeg", StringComparison.OrdinalIgnoreCase) || fileExt.Equals(".bmp", StringComparison.OrdinalIgnoreCase) || fileExt.Equals(".png", StringComparison.OrdinalIgnoreCase) || fileExt.Equals(".gif", StringComparison.OrdinalIgnoreCase) || fileExt.Equals(".jpg", StringComparison.OrdinalIgnoreCase))
                {
                    feather = "picture";
                    string newfile = "\\" + feather + "\\" + DateTime.Now.ToString("yyyy") + "\\" + DateTime.Now.ToString("MM") + "\\" + DateTime.Now.ToString("dd") + "\\";
                    path = path + "\\" + "DailyWalkAlarmFiles" + newfile;
                    if (!Directory.Exists(path))
                    {
                        Directory.CreateDirectory(path);
                    }

                    Random rd = new Random(DateTime.Now.Millisecond);
                    int num = rd.Next(100000, 1000000);

                    fileName = DateTime.Now.ToString("yyyyMMdd_HHmmss") + "_" + num + fileExt;
                    //string ss = path + fileName;
                    file.SaveAs(path + fileName);
                    //写入数据库的路径
                    string addurl = "/" + VIRTUAL_DIR_NAME + "\\" + "DailyWalkAlarmFiles" + newfile + fileName;
                    addurls = addurls + addurl + ";";
                }
                else if (fileExt.Equals(".doc", StringComparison.OrdinalIgnoreCase) || fileExt.Equals(".xls", StringComparison.OrdinalIgnoreCase) || fileExt.Equals(".xlsx", StringComparison.OrdinalIgnoreCase) || fileExt.Equals(".docx", StringComparison.OrdinalIgnoreCase) || fileExt.Equals(".txt", StringComparison.OrdinalIgnoreCase) || fileExt.Equals(".pdf", StringComparison.OrdinalIgnoreCase))
                {
                    feather = "file";
                    string newfile = "\\" + feather + "\\" + DateTime.Now.ToString("yyyy") + "\\" + DateTime.Now.ToString("MM") + "\\" + DateTime.Now.ToString("dd") + "\\";
                    path = path + "\\" + "DailyWalkAlarmFiles" + newfile;
                    if (!Directory.Exists(path))
                    {
                        Directory.CreateDirectory(path);
                    }

                    Random rd = new Random();
                    int num = rd.Next(100000, 1000000);

                    fileName = DateTime.Now.ToString("yyyyMMdd_HHmmss") + "_" + num + fileExt;
                    //string ss = path + fileName;
                    file.SaveAs(path + fileName);
                    //写入数据库的路径
                    string addurl = "/" + VIRTUAL_DIR_NAME + "\\" + "DailyWalkAlarmFiles" + newfile + fileName;
                    addurls = addurls + addurl + ";";
                }
            }
        }
        catch (Exception ex)
        {
            log4net.ILog log2 = log4net.LogManager.GetLogger("文件上传");
            log2.Error("Error", ex);
        }
        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(addurls);
    }
    public void GetDetail()
    {
        string alarmid = HttpContext.Current.Request["alarmid"];
        Alarm alarm = Api.ServiceAccessor.GetAlarmService().getAlarm(alarmid);

        StringBuilder json = new StringBuilder();

        string pole_img = "";
        if (!string.IsNullOrEmpty(alarm.DEVICE_ID) && !string.IsNullOrEmpty(Common.getPoleInfo(alarm.DEVICE_ID).POLE_IMG_C2))
        {
            pole_img = PublicMethod.GetFullDir(Common.getPoleInfo(alarm.DEVICE_ID).POLE_IMG_C2);
        }
        string MisShow = "false";
        string TASKSTATUS = "";
        if (!String.IsNullOrEmpty(alarm.TASK_ID))
        {
            Api.Task.entity.MisTask misTask = Api.ServiceAccessor.GetTaskService().getMisTask(alarm.TASK_ID);
            Api.Foundation.entity.Foundation.LoginUser m22 = Api.Util.Public.GetCurrentUser();

            TASKSTATUS = misTask.STATUS;

            if (misTask.RECV_DEPT.Contains(m22.ORG_CODE) && misTask.STATUS != "完成" && misTask.STATUS != "取消")
                MisShow = "false";
            else
                MisShow = "true";
        }

        json.Append("{");

        json.Append("\"Info\":\"" + "时间&nbsp;" + alarm.RAISED_TIME + "。描述&nbsp;" + alarm.DETAIL + "。级别&nbsp;" + Api.Util.Common.getSysDictionaryInfo(alarm.SEVERITY).CODE_NAME + "。" + "\",");//C2信息     
        json.Append("\"PICS\":[");
        if (!string.IsNullOrEmpty(alarm.SVALUE5))
        {
            string DailyWalkFaultImg = "";
            string[] pic = alarm.SVALUE5.Split(';');
            for (int j = 0; j < pic.Length; j++)
            {
                if (!string.IsNullOrEmpty(pic[j]))
                {
                    if (pic[j].IndexOf(".jpeg", StringComparison.OrdinalIgnoreCase) > -1 || pic[j].IndexOf(".bmp", StringComparison.OrdinalIgnoreCase) > -1 || pic[j].IndexOf(".png", StringComparison.OrdinalIgnoreCase) > -1 || pic[j].IndexOf(".gif", StringComparison.OrdinalIgnoreCase) > -1 || pic[j].IndexOf(".jpg", StringComparison.OrdinalIgnoreCase) > -1)
                    {
                        DailyWalkFaultImg = DailyWalkFaultImg + "\"/" + pic[j] + "\",";
                    }
                }
            }
            if (!string.IsNullOrEmpty(DailyWalkFaultImg))
            {
                DailyWalkFaultImg = DailyWalkFaultImg.Substring(0, DailyWalkFaultImg.Length - 1);
            }
            json.Append(DailyWalkFaultImg);
        }
        json.Append("],");
        json.Append("\"DEVICE_ID\":\"" + alarm.DEVICE_ID + "\",");//DEVICE_ID
        json.Append("\"CROSSING_NO\":\"" + alarm.ROUTING_NO + "\",");//交路号
        json.Append("\"AREA_SECTION\":\"" + alarm.AREA_NO + "\",");//运用区段
        json.Append("\"LINE_NAME\":\"" + alarm.LINE_NAME + "\",");//线路
        json.Append("\"JU\":\"" + alarm.BUREAU_NAME + "\",");//局
        json.Append("\"GDD\":\"" + alarm.POWER_SECTION_NAME + "\",");//供电段
        json.Append("\"JWD\":\"" + alarm.P_ORG_NAME + "\",");//机务段
        json.Append("\"CJ\":\"" + alarm.WORKSHOP_NAME + "\",");//供电车间
        json.Append("\"BZ\":\"" + alarm.ORG_NAME + "\",");//班组
        json.Append("\"QZ\":\"" + alarm.POSITION_NAME + "\",");//区站
        json.Append("\"BRIDGE_TUNNEL_NO\":\"" + alarm.BRG_TUN_NAME + "\",");//桥隧
        json.Append("\"POLE_NUMBER\":\"" + alarm.POLE_NUMBER + "\",");//支柱
        json.Append("\"DIRECTION\":\"" + alarm.DIRECTION + "\",");//行别
        json.Append("\"POLE_IMG\":\"" + pole_img + "\",");//支柱图片
        json.Append("\"KM\":\"" + PublicMethod.KmtoString(alarm.KM_MARK) + "\",");//班组
        json.Append("\"GIS_X\":\"" + alarm.GIS_X + "\",");//X
        json.Append("\"GIS_Y\":\"" + alarm.GIS_Y + "\",");//Y
        json.Append("\"SUMMARYDIC\":\"" + alarm.CODE_NAME + "\",");//故障类型
        json.Append("\"DETAIL\":\"" + alarm.DETAIL + "\",");//描述
        json.Append("\"STATUSDIC\":\"" + alarm.STATUS_NAME + "\",");//状态
        json.Append("\"SOURCE\":\"" + alarm.SOURCE + "\",");//数据来源
        json.Append("\"REPORT_DATE\":\"" + alarm.REPORT_DATE + "\",");//报告时间
        json.Append("\"RAISED_TIME\":\"" + alarm.RAISED_TIME + "\",");//发生时间
        json.Append("\"STATUS_TIME\":\"" + alarm.STATUS_TIME + "\",");//状态变化时间
        json.Append("\"LOCNO\":\"" + alarm.DETECT_DEVICE_CODE + "\",");//设备编号
        json.Append("\"VENDOR\":\"" + alarm.VENDOR + "\",");//设备厂商

        json.Append("\"REPAIR_DATE\":\"" + alarm.REPAIR_DATE.ToString("yyyy-MM-dd HH:mm:ss") + "\",");//检修日期
        json.Append("\"REPAIR_PERSON\":\"" + alarm.REPAIR_PERSON + "\",");//检修人
        json.Append("\"REPAIR_ORG\":\"" + alarm.REPAIR_ORG + "\",");//检修机构
        json.Append("\"REPAIR_METHOD\":\"" + alarm.REPAIR_METHOD + "\",");//检修方式

        json.Append("\"IS_TYPICAL\":\"" + alarm.IS_TYPICAL + "\",");//是否为典型缺陷
        json.Append("\"ALARM_ANALYSIS\":\"" + alarm.ALARM_ANALYSIS + "\",");//缺陷分析
        json.Append("\"PROPOSAL\":\"" + alarm.PROPOSAL + "\",");//处理建议
        json.Append("\"REMARK\":\"" + alarm.REMARK + "\",");//备注
        json.Append("\"REPORT_PERSON\":\"" + alarm.REPORT_PERSON + "\",");//报告人
        json.Append("\"SEVERITY\":\"" + PublicMethod.getCode_Name(alarm.SEVERITY) + "\",");//级别
        json.Append("\"MISID\":\"" + alarm.TASK_ID + "\",");//任务主键
        json.Append("\"TASKSTATUS\":\"" + TASKSTATUS + "\",");//任务状态
        json.Append("\"STATUS_TIME\":\"" + alarm.STATUS_TIME + "\",");  //状态变化时间

        json.Append("\"MisShow\":\"" + MisShow + "\"");//是否有任务

        json.Append("}");

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);

    }
    public bool IsReusable {
        get {
            return false;
        }
    }

}