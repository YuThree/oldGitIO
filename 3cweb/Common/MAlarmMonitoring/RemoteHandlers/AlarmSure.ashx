<%@ WebHandler Language="C#" Class="AlarmSure" %>

using System;
using System.Web;

using Api.Fault.entity.alarm;
using Api.Util;
using System.Collections.Generic;
using Api.Event.entity;
using System.Text;
using Api.Foundation.entity.Foundation;
using System.Web.Script.Serialization;
using SharedDefinition.Definitions;
using System.Data;

public class AlarmSure : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "text/plain";
        switch (context.Request["active"])
        {
            case "Load":
                Load();
                break;
            case "CompareLoad":
                CompareLoad();
                break;
            case "Save":
                Save();
                break;
            case "Save_3c":
                Save_3c();
                break;
            case "Save_5c":
                Save_5c();
                break;
            case "Sample_Z":
                QuerySampleTypeAndPath();//查询正样本类型及文件保存路径
                break;
            case "Save_sample":
                Save_sample();//单独确认样本
                break;
            case "Save_ScenceSample":
                Save_ScenceSample();//单独确认场景样本
                break;
        }
    }

    public void Load()
    {
        string alarmid = HttpContext.Current.Request["alarmid"];
        C3_Alarm m = Api.ServiceAccessor.GetAlarmService().getC3Alarm_Aux(alarmid);


        //返回延迟时间超时标志
        CommonWithWeb.Transmit.TransMethods cd = new CommonWithWeb.Transmit.TransMethods();
        List<DateTime> ld_S = ADO.FileTransImpl.getSpecialWorkDays(1);//获取工作日列表
        List<DateTime> ld_N = ADO.FileTransImpl.getSpecialWorkDays(0);//获取非工作日列表
        bool OutTime = cd.IsDelayPassed(m.ORG_CODE == null ? "OTHERS" : m.ORG_CODE, m.RAISED_TIME, InitFileTrans.DelayTrans, ld_S, ld_N);//后端dll接口，返回超时标志
                                                                                                                                         //bool OutTime = false;

        string result = null;
        string AFLG_CODE = null;
        string AFLG_NAME = null;
        if (m.Alarm_Aux != null)
        {
            AFLG_CODE = m.Alarm_Aux.AFLG_CODE;
            AFLG_NAME = m.Alarm_Aux.AFLG_NAME;
        }

        Organization org = Common.getOrgInfo(Public.GetDeptCode);
        string userorg = Public.GetDeptCode;

        if (org.ORG_TYPE == "科")
        {
            userorg = org.SUP_ORG_CODE;
        }
        result = "{"
                    + "\"SUMMARYDIC\":\"" + m.CODE_NAME + "\", "//故障类型 
                    + "\"DIC_CODE\":\"" + m.CODE + "\", "//故障类型 
                    + "\"DETAIL\":\"" + m.DETAIL + "\", "//描述
                    + "\"STATUSDIC\":\"" + m.STATUS_NAME + "\", "//状态
                    + "\"REPORT_DATE\":\"" + m.REPORT_DATE + "\", "//报告时间
                    + "\"RAISED_TIME\":\"" + m.RAISED_TIME + "\", "//发生时间
                    + "\"STATUS_TIME\":\"" + m.STATUS_TIME + "\", "//状态变化时间
                    + "\"LOCNO\":\"" + m.DETECT_DEVICE_CODE + "\", "//设备编号
                    + "\"VENDOR\":\"" + m.VENDOR + "\", "//设备厂商
                    + "\"ALARM_ANALYSIS\":\"" + m.ALARM_ANALYSIS + "\", "//缺陷分析
                    + "\"AFLG_CODE\":\"" + AFLG_CODE + "\", "//缺陷标志code
                    + "\"AFLG_NAME\":\"" + AFLG_NAME + "\", "//缺陷标志name
                    + "\"PROPOSAL\":\"" + m.PROPOSAL + "\", "//处理建议
                    + "\"REMARK\":\"" + m.REMARK + "\", "//备注
                    + "\"REPORT_PERSON\":\"" + m.REPORT_PERSON + "\", "//报告人
                    + "\"name\":\"" + Public.GetPersonName + "\", "//当前用户名称
                    + "\"userCode\":\"" + Public.GetUserCode + "\", "//当前用户编码
                    + "\"code\":\"" + Public.GetUserCode + "\", "//当前用户编码
                    + "\"orgcode\":\"" + userorg + "\", "//当前用户组织机构编码
                    + "\"orgName\":\"" + Public.GetDeptName + "\", "//当前用户组织机构名
                    + "\"loginId\":\"" + Public.GetLoginID + "\", "//当前用户ID(登录ID)
                    + "\"PersonName\":\"" + Public.GetPersonName + "\", "//当前用户名称
                    + "\"CUST_ALARM_CODE\":\"" + m.CUST_ALARM_CODE + "\", "//客户自定义告警编码
                    + "\"ISOUTTIME\":\"" + OutTime + "\", "//报警延时是否过期，false为过期
                    + "\"SAMPLE_CODE\":\"" + (m.Alarm_Aux == null ? null : m.Alarm_Aux.SAMPLE_CODE) + "\", "//样本类型编码
                    + "\"SAMPLE_NAME\":\"" + (m.Alarm_Aux == null ? null : m.Alarm_Aux.SAMPLE_NAME) + "\", "//样本类型名
                    + "\"SAMPLE_DETAIL_CODE\":\"" + (m.Alarm_Aux == null ? null : m.Alarm_Aux.SAMPLE_DETAIL_CODE) + "\", "//样本详细类型编码
                    + "\"SAMPLE_DETAIL_NAME\":\"" + (m.Alarm_Aux == null ? null : m.Alarm_Aux.SAMPLE_DETAIL_NAME) + "\", "//样本详细类型名
                     + "\"SCENCESAMPLE_CODE\":\"" + (m.Alarm_Aux == null ? null : m.Alarm_Aux.SCENCESAMPLE_CODE) + "\", "//场景样本类型编码
                    + "\"SCENCESAMPLE_NAME\":\"" + (m.Alarm_Aux == null ? null : m.Alarm_Aux.SCENCESAMPLE_NAME) + "\", "//场景样本类型名
                    + "\"FAULTPULL\":\"" + m.NVALUE3 + "\", "//缺陷帧拉出值
                     + "\"ALLPULLVALUE\":[" + getPullValue(m) + "], "//缺陷帧拉出值
                    + "\"SEVERITY_CODE\":\"" + m.MY_STR_8 + "\", "//级别code
                    + "\"SEVERITY\":\"" + m.SEVERITY + "\"";//级别


        result += "}";


        HttpContext.Current.Response.Write(Newtonsoft.Json.JsonConvert.DeserializeObject(result));

    }
    public void CompareLoad()
    {
        string alarmid = HttpContext.Current.Request["alarmid"];
        C3_Alarm m = Api.ServiceAccessor.GetAlarmService().getC3Alarm_Aux(alarmid);
        string sign = "0";
        string result = "";
        StringBuilder json = new StringBuilder();

        if (!string.IsNullOrEmpty(m.REPORT_PERSON))
        {
            sign = "1";
            string AFLG_CODE = null;
            string AFLG_NAME = null;
            if (m.Alarm_Aux != null)
            {
                AFLG_CODE = m.Alarm_Aux.AFLG_CODE;
                AFLG_NAME = m.Alarm_Aux.AFLG_NAME;
            }
            result = "\"SUMMARYDIC\":\"" + m.CODE_NAME + "\", "//故障类型 
                        + "\"DIC_CODE\":\"" + m.CODE + "\", "//故障类型 
                        + "\"DETAIL\":\"" + m.DETAIL + "\", "//描述
                        + "\"STATUSDIC\":\"" + m.STATUS_NAME + "\", "//状态
                        + "\"REPORT_DATE\":\"" + m.REPORT_DATE + "\", "//报告时间
                        + "\"RAISED_TIME\":\"" + m.RAISED_TIME + "\", "//发生时间
                        + "\"STATUS_TIME\":\"" + m.STATUS_TIME + "\", "//状态变化时间
                        + "\"LOCNO\":\"" + m.DETECT_DEVICE_CODE + "\", "//设备编号
                        + "\"VENDOR\":\"" + m.VENDOR + "\", "//设备厂商
                        + "\"ALARM_ANALYSIS\":\"" + m.ALARM_ANALYSIS + "\", "//缺陷分析
                        + "\"AFLG_CODE\":\"" + AFLG_CODE + "\", "//缺陷标志code
                        + "\"AFLG_NAME\":\"" + AFLG_NAME + "\", "//缺陷标志name
                        + "\"PROPOSAL\":\"" + m.PROPOSAL + "\", "//处理建议
                        + "\"REMARK\":\"" + m.REMARK + "\", "//备注
                        + "\"REPORT_PERSON\":\"" + m.REPORT_PERSON + "\", "//报告人
                        + "\"PersonName\":\"" + Public.GetPersonName + "\", "//当前用户
                        + "\"CUST_ALARM_CODE\":\"" + m.CUST_ALARM_CODE + "\", "//当前用户
                        + "\"SEVERITY_CODE\":\"" + m.MY_STR_8 + "\", "//级别code
                        + "\"SEVERITY\":\"" + m.SEVERITY + "\"";//级别
        }


        json.Append("{\"sign\":\"" + sign + "\",\"result\":{" + result + "}}");
        HttpContext.Current.Response.Write(Newtonsoft.Json.JsonConvert.DeserializeObject(json.ToString()));

    }
    public void Save()
    {
        try
        {
            string responsestr = null;
            string category = HttpContext.Current.Request["category"];
            string alarmid = HttpContext.Current.Request["alarmid"];//缺陷ID
            string btntype = HttpContext.Current.Request["btntype"];//操作类型btnOk/确认 btnCan/取消 btnSave/保存
            string txtDefect = HttpContext.Current.Request["txtDefect"];//缺陷分析
            string txtAdvice = HttpContext.Current.Request["txtAdvice"];//处理建议
            string txtNote = HttpContext.Current.Request["txtNote"];//备注
            string txtReporter = HttpContext.Current.Request["txtReporter"];//报告人
            string afcode = HttpContext.Current.Request["afcode"];//缺陷类型
            string afcodeName = HttpContext.Current.Request["afcodeName"];//缺陷类型名称
            string DefectMarkName = HttpContext.Current.Request["DefectMarkName"];//缺陷标志name
            string DefectMarkCode = HttpContext.Current.Request["DefectMarkCode"];//缺陷标志code

            string CUST_ALARM_CODE = HttpContext.Current.Request["Alarmcode"];//告警编码
            string severity = HttpContext.Current.Request["severity"];//缺陷级别
            string ids = HttpContext.Current.Request["ids"];//
            DateTime reportdate = DateTime.Now;
            if (!String.IsNullOrEmpty(HttpContext.Current.Request["reportdate"]))
            {
                reportdate = DateTime.Parse(HttpContext.Current.Request["reportdate"]);//日期
            }

            switch (category)
            {
                case "1C":
                    responsestr = Api.ServiceAccessor.GetEventService().convertC1EventToAlarm(alarmid, afcode, afcodeName, severity, txtDefect, txtAdvice);
                    break;
                case "REPEAT":
                    C3_AlarmCond cond = new C3_AlarmCond();
                    string idsStr = "";
                    foreach (string item in ids.Split(','))
                    {
                        idsStr += string.Format(",'{0}'", item);
                    }
                    if (!string.IsNullOrEmpty(idsStr))
                    {
                        cond.businssAnd = string.Format(" ALARM.id in ({0})", idsStr.Substring(1));
                        cond.orderBy = " raised_time desc ";
                    }
                    //IList<C3_Alarm> list = Api.ServiceAccessor.GetAlarmService().getC3Alarm(cond);
                    IList<C3_Alarm> list = Api.ServiceAccessor.GetAlarmService().getC3Alarm_Aux(cond);
                    for (int i = 0; i < list.Count; i++)
                    {
                        C3_Alarm c3_alarm = list[i];
                        if (c3_alarm.STATUS == "AFSTATUS04" || c3_alarm.STATUS == "AFSTATUS05")
                            continue;

                        c3_alarm.ALARM_ANALYSIS = txtDefect;
                        c3_alarm.PROPOSAL = txtAdvice;
                        c3_alarm.REMARK = txtNote;
                        c3_alarm.REPORT_PERSON = txtReporter;
                        c3_alarm.REPORT_DATE = reportdate;
                        c3_alarm.STATUS_TIME = DateTime.Now;
                        c3_alarm.CODE = afcode;
                        c3_alarm.CODE_NAME = afcodeName;

                        if (!string.IsNullOrEmpty(severity) && severity != "请选择" && severity != "0")
                            c3_alarm.SEVERITY = severity;
                        c3_alarm.MY_STR_8 = severity;


                        if (i == 0)
                        {
                            c3_alarm.SVALUE15 = "重复报警";
                        }
                        else
                        {
                            c3_alarm.SVALUE15 = list[0].ID;
                        }
                        if (btntype == "btnOk")
                        {
                            c3_alarm.STATUS = "AFSTATUS03";
                            c3_alarm.STATUS_NAME = "已确认";
                            c3_alarm.DATA_TYPE = "FAULT";
                            c3_alarm.STATUS_TIME = DateTime.Now;
                        }
                        else if (btntype == "btnCan")
                        {
                            c3_alarm.STATUS = "AFSTATUS02";
                            c3_alarm.STATUS_NAME = "已取消";
                            c3_alarm.STATUS_TIME = DateTime.Now;
                            c3_alarm.SVALUE15 = "";
                        }
                        if (Api.ServiceAccessor.GetAlarmService().updateC3Alarm(c3_alarm))
                        {
                            //进行重复报警操作时 将重复次数写入附加信息表中
                            if (c3_alarm.Alarm_Aux != null)
                            {
                                c3_alarm.Alarm_Aux.ALARM_REP_COUNT = list.Count;
                                Api.ServiceAccessor.GetAlarmService().updateAlarm_Aux(c3_alarm.Alarm_Aux);
                            }
                            else
                            {
                                Alarm_AUX aux = new Alarm_AUX();
                                aux.ALARM_ID = c3_alarm.ID;
                                aux.AUX_ID = Guid.NewGuid().ToString();
                                aux.ALARM_REP_COUNT = list.Count;
                                Api.ServiceAccessor.GetAlarmService().addAlarm_Aux(aux);
                            }
                            //如果是报警确认操作，将trans_data表中的trans_result字段置为wait
                            if (btntype == "btnOk")
                            {
                                int count;
                                log4net.ILog log2 = log4net.LogManager.GetLogger("TRANS状态");
                                string sql = string.Format("update trans_data set trans_result ='wait' where id='{0}'", c3_alarm.ID);
                                int val = 0;
                                for (count = 0; count < 4; count++)
                                {
                                    val = DbHelperOra.ExecuteSql(sql);
                                    if (val > 0)
                                        break;
                                    System.Threading.Thread.Sleep(200);
                                }



                                log2.DebugFormat("执行SQL:{0},执行结果:{1},执行次数{2}", sql, val, count + 1);

                            }
                        }
                    }
                    responsestr = "1";
                    break;
                case "3C":
                    #region 3C
                    Api.Foundation.entity.Cond.SysDictionaryCond syscond = new Api.Foundation.entity.Cond.SysDictionaryCond();
                    syscond.CODE_NAME = afcode;
                    //System.Collections.Generic.IList<Api.Foundation.entity.Foundation.SysDictionary> sys = Api.ServiceAccessor.GetFoundationService().querySysDictionary(syscond);
                    //try { afcode = sys[0].DIC_CODE; }
                    //catch { }

                    string[] alarmids = alarmid.Split(',');

                    foreach (string _alarmID in alarmids)
                    {
                        if (string.IsNullOrEmpty(_alarmID)) continue;

                        C3_Alarm alarm = Api.ServiceAccessor.GetAlarmService().getC3Alarm_Aux(_alarmID);
                        if (alarm.ID != null && alarmid != "null")
                        {
                            alarm.ALARM_ANALYSIS = txtDefect;
                            alarm.PROPOSAL = txtAdvice;
                            alarm.REMARK = txtNote;
                            alarm.REPORT_PERSON = txtReporter;
                            alarm.REPORT_DATE = reportdate;
                            alarm.STATUS_TIME = DateTime.Now;
                            alarm.CODE = afcode;
                            alarm.CUST_ALARM_CODE = CUST_ALARM_CODE;
                            if (alarm.Alarm_Aux != null)
                            {
                                if (!string.IsNullOrEmpty(DefectMarkName))
                                {
                                    alarm.Alarm_Aux.AFLG_NAME = DefectMarkName;
                                }
                                if (!string.IsNullOrEmpty(DefectMarkCode))
                                {
                                    alarm.Alarm_Aux.AFLG_CODE = DefectMarkCode;
                                }
                            }
                            else
                            {  //如果这条报警的附加表不存在
                                Alarm_AUX alarmaux = new Alarm_AUX();
                                alarmaux.ALARM_ID = alarmid;
                                if (!string.IsNullOrEmpty(DefectMarkName))
                                {
                                    alarmaux.AFLG_NAME = DefectMarkName;
                                }
                                if (!string.IsNullOrEmpty(DefectMarkCode))
                                {
                                    alarmaux.AFLG_CODE = DefectMarkCode;
                                }
                                Api.ServiceAccessor.GetAlarmService().addAlarm_Aux(alarmaux);
                            }


                            Api.Foundation.entity.Foundation.SysDictionary m_code = Common.getSysDictionaryInfo(alarm.CODE);
                            if (m_code != null)
                                alarm.CODE_NAME = m_code.CODE_NAME;

                            if (!string.IsNullOrEmpty(severity) && severity != "请选择" && severity != "0")
                                alarm.SEVERITY = severity;


                            if (btntype == "btnOk")
                            {
                                alarm.STATUS = "AFSTATUS03";
                                alarm.STATUS_NAME = Public.GetStatusName(alarm.STATUS);
                                alarm.DATA_TYPE = "FAULT";
                                alarm.STATUS_TIME = DateTime.Now;

                                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "报警确认", Api.Util.Public.FunNames.报警监控.ToString(), Public.GetLoginIP, "对报警<a  href=javascript:ShowWinOpen(\\\"../../C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmID=" + alarm.ID + "\\\")>" + alarm.ID + "</a>进行了确认操作", "", true);

                            }
                            else if (btntype == "btnCan")
                            {
                                alarm.STATUS = "AFSTATUS02";
                                alarm.STATUS_NAME = Public.GetStatusName(alarm.STATUS);
                                alarm.STATUS_TIME = DateTime.Now;
                                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "缺陷取消", Api.Util.Public.FunNames.报警监控.ToString(), Public.GetLoginIP, "对缺陷<a  href=javascript:ShowWinOpen(\\\"../../C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmID=" + alarm.ID + "\\\")>" + alarm.ID + "</a>进行了取消操作", "", true);
                            }

                            try
                            {
                                if (Api.ServiceAccessor.GetAlarmService().updateC3Alarm(alarm))
                                {

                                    if (alarm.Alarm_Aux != null)
                                    {
                                        alarm.Alarm_Aux.AFLG_NAME = DefectMarkName;
                                        alarm.Alarm_Aux.AFLG_CODE = DefectMarkCode;
                                        Api.ServiceAccessor.GetAlarmService().updateAlarm_Aux(alarm.Alarm_Aux);
                                    }


                                    //如果是报警确认操作，将trans_data表中的trans_result字段置为wait
                                    if (btntype == "btnOk")
                                    {

                                        if (alarm.SEVERITY.Equals("一类") || alarm.SEVERITY.Equals("二类"))
                                        {
                                            Api.ServiceAccessor.GetAlarmService().updateReportDBForce(alarm.ID);
                                        }
                                        else if (alarm.SEVERITY.Equals("三类"))
                                        {
                                            Api.ServiceAccessor.GetAlarmService().UpdateStatusAndURLToNull(alarm.ID);
                                        }

                                        int count = 0;
                                        log4net.ILog log2 = log4net.LogManager.GetLogger("TRANS状态");
                                        string sql = string.Format("update trans_data set trans_result ='wait' where id='{0}'", alarm.ID);
                                        int val = 0;
                                        try
                                        {

                                            for (count = 0; count < 4; count++)
                                            {
                                                val = DbHelperOra.ExecuteSql(sql);
                                                if (val > 0)
                                                    break;
                                                System.Threading.Thread.Sleep(200);
                                            }
                                        }
                                        catch (Exception ex)
                                        {

                                            log2.Error("确认后，更新trans_data 出错 ", ex);

                                        }


                                        log2.DebugFormat("执行SQL:{0},执行结果:{1},执行次数{2}", sql, val, count + 1);

                                    }
                                    else
                                    {

                                        //取消 不生成word,   //之后再加上删除文件。
                                        Api.ServiceAccessor.GetAlarmService().UpdateStatusAndURLToNull(alarm.ID);



                                    }
                                    responsestr = "1";
                                }
                            }
                            catch (Exception ex)
                            {
                                log4net.ILog log2 = log4net.LogManager.GetLogger("确认报警");
                                log2.Error("updateAlarm", ex);
                            }
                        }
                    }


                    #endregion

                    break;
                case "4C":
                    #region 确认4C
                    string txt_code = afcodeName;
                    string code = afcode;
                    string sele_level = severity;
                    string txtReportdate = reportdate.ToString();
                    string eid = HttpContext.Current.Request["eid"];

                    C4EventCond e4_cond = new C4EventCond();
                    e4_cond.ID = eid;
                    IList<C4Event> list_e4 = Api.ServiceAccessor.GetEventService().getC4EventDetail(e4_cond);

                    if (list_e4.Count > 0)
                    {

                        C4Event e4 = list_e4[0];

                        //查询是否有缺陷数据
                        AlarmCond alarm_cond = new AlarmCond();
                        alarm_cond.DEVICE_ID = e4.DEVICE_ID;
                        alarm_cond.HARDDISK_MANAGE_ID = e4.HARDDISK_MANAGE_ID;
                        int n = Api.ServiceAccessor.GetAlarmService().getAlarmCount(alarm_cond);

                        if (n == 0)
                        {
                            //不存在，才继续操作。
                            C4_Alarm m = Api.ServiceAccessor.GetEventService().convertC4EventToAlarm(e4);
                            m.CODE = code;
                            m.SUMMARY = txt_code;
                            m.SEVERITY = sele_level;
                            m.DETAIL = txt_code;
                            m.ALARM_ANALYSIS = txtDefect;
                            m.PROPOSAL = txtAdvice;
                            m.REMARK = txtNote;
                            m.REPORT_PERSON = txtReporter;

                            try
                            {
                                DateTime dt = Convert.ToDateTime(txtReportdate);
                                m.REPORT_DATE = dt;
                            }
                            catch (Exception ex) { }


                            #region 图片处理

                            string ftproot = "~/FtpRoot/";

                            List<string> olist = new List<string>();
                            olist.Add(ftproot + e4.PIC_PATH_A01);
                            olist.Add(ftproot + e4.PIC_PATH_A02);
                            olist.Add(ftproot + e4.PIC_PATH_A03);
                            olist.Add(ftproot + e4.PIC_PATH_A04);
                            olist.Add(ftproot + e4.PIC_PATH_A05);
                            olist.Add(ftproot + e4.PIC_PATH_A06);
                            olist.Add(ftproot + e4.PIC_PATH_B01);
                            olist.Add(ftproot + e4.PIC_PATH_B02);
                            olist.Add(ftproot + e4.PIC_PATH_B03);
                            olist.Add(ftproot + e4.PIC_PATH_B04);
                            olist.Add(ftproot + e4.PIC_PATH_B05);
                            olist.Add(ftproot + e4.PIC_PATH_B06);

                            List<string> Tolist = new List<string>();

                            foreach (string imgsrc in m.MY_STR_3.Split('#'))
                            {
                                if (!string.IsNullOrEmpty(imgsrc))
                                {
                                    Tolist.Add(ftproot + m.DIR_PATH + imgsrc);
                                }
                            }

                            if (olist.Count == Tolist.Count)
                            {
                                for (int i = 0; i < olist.Count; i++)
                                {

                                    string o_local_100 = HttpContext.Current.Server.MapPath(olist[i]);
                                    string To_local_100 = HttpContext.Current.Server.MapPath(Tolist[i]);

                                    string tmep_To_local_dic = To_local_100.Substring(0, To_local_100.LastIndexOf("\\"));

                                    if (!System.IO.Directory.Exists(tmep_To_local_dic))
                                        System.IO.Directory.CreateDirectory(tmep_To_local_dic);

                                    try
                                    {
                                        System.IO.File.Copy(o_local_100, To_local_100, true);
                                    }
                                    catch { }

                                }
                            }


                            #endregion




                            bool success = Api.ServiceAccessor.GetAlarmService().addC4Alarm(m);
                            if (success)
                            {
                                responsestr = m.ID;
                                //  HttpContext.Current.Response.Write("操作成功");
                            }
                            else
                            {
                                // HttpContext.Current.Response.Write("操作失败");
                            }

                        }
                        else
                        {

                            //  HttpContext.Current.Response.Write("缺陷库中已经存在");
                        }

                    }
                    #endregion
                    break;




            }


            HttpContext.Current.Response.Write(responsestr);
            //        
        }
        catch (Exception ex2)
        {
            log4net.ILog log2 = log4net.LogManager.GetLogger("确认报警");
            log2.Error("Save", ex2);
        }
    }
    public void Save_sample()
    {
        try
        {
            string responsestr = null;
            string alarmid = HttpContext.Current.Request["alarmid"];//缺陷ID
            string SAMPLE_CODE = HttpContext.Current.Request["SAMPLE_CODE"];//样本编码
            string SAMPLE_NAME = HttpContext.Current.Request["SAMPLE_NAME"];//样本名
            string SAMPLE_DETAIL_CODE = HttpContext.Current.Request["SAMPLE_DETAIL_CODE"];//样本详细编码
            string SAMPLE_DETAIL_NAME = HttpContext.Current.Request["SAMPLE_DETAIL_NAME"];//样本详细名称
            string Alarmcode = HttpContext.Current.Request["Alarmcode"];//报警类型编码
            C3_Alarm c3_alarm = Api.ServiceAccessor.GetAlarmService().getC3Alarm_Aux(alarmid);
            C3_Alarm alarm = Api.ServiceAccessor.GetAlarmService().getC3Alarm(alarmid);
            if (SAMPLE_NAME == "正样本")
            {
                string sql = " SELECT S.CODE_NAME FROM SYS_DIC S  WHERE S.DIC_CODE = '" + Alarmcode + "'";
                string result = DbHelperOra.GetSingle(sql) == DBNull.Value ? null : DbHelperOra.GetSingle(sql).ToString();
                if (true)
                {
                    alarm.CODE_NAME = result;
                    alarm.CODE = Alarmcode;
                }
            }
            c3_alarm.Alarm_Aux.SAMPLE_CODE = SAMPLE_CODE;
            c3_alarm.Alarm_Aux.SAMPLE_NAME = SAMPLE_NAME;
            c3_alarm.Alarm_Aux.SAMPLE_DETAIL_CODE = SAMPLE_DETAIL_CODE;
            c3_alarm.Alarm_Aux.SAMPLE_DETAIL_NAME = SAMPLE_DETAIL_NAME;
            alarm.SEVERITY = alarm.SEVERITY.Replace("级", "类");

            Api.ServiceAccessor.GetAlarmService().updateAlarm_Aux(c3_alarm.Alarm_Aux);
            Api.ServiceAccessor.GetAlarmService().updateC3Alarm(alarm);
            StringBuilder json = new StringBuilder();
            responsestr = "1";
            json.Append("{\"sign\":\"" + responsestr + "\"}");
            HttpContext.Current.Response.ContentType = "application/json";
            HttpContext.Current.Response.Write(json);

        }
        catch (Exception ex2)
        {
            log4net.ILog log2 = log4net.LogManager.GetLogger("确认样本出错");
            log2.Error("Save_sample", ex2);
        }
    }
    /// <summary>
    /// 优化3C报警确认和取消
    /// </summary>
    public void Save_3c()
    {
        try
        {
            string responsestr = null;
            string category = HttpContext.Current.Request["category"];
            string alarmid = HttpContext.Current.Request["alarmid"];//缺陷ID
            string btntype = HttpContext.Current.Request["btntype"];//操作类型btnOk/确认 btnCan/取消 btnSave/保存
            string txtDefect = HttpContext.Current.Request["txtDefect"];//缺陷分析
            string txtAdvice = HttpContext.Current.Request["txtAdvice"];//处理建议
            string txtNote = HttpContext.Current.Request["txtNote"];//备注
            string txtReporter = HttpContext.Current.Request["txtReporter"];//报告人
            string txtReporterCode = HttpContext.Current.Request["txtReporterCode"];//报告人
            string afcode = HttpContext.Current.Request["afcode"];//缺陷类型
            string afcodeName = HttpContext.Current.Request["afcodeName"];//缺陷类型名称
            string DefectMarkName = HttpContext.Current.Request["DefectMarkName"];//缺陷标志name
            string DefectMarkCode = HttpContext.Current.Request["DefectMarkCode"];//缺陷标志code

            string CUST_ALARM_CODE = HttpContext.Current.Request["Alarmcode"];//告警编码
            string severity = HttpContext.Current.Request["severity"];//缺陷级别
            string ids = HttpContext.Current.Request["ids"];//
            string SAMPLE_CODE = HttpContext.Current.Request["SAMPLE_CODE"];//样本编码
            string SAMPLE_NAME = HttpContext.Current.Request["SAMPLE_NAME"];//样本名

            string SAMPLE_DETAIL_CODE = HttpContext.Current.Request["SAMPLE_DETAIL_CODE"];//样本详细编码
            string SAMPLE_DETAIL_NAME = HttpContext.Current.Request["SAMPLE_DETAIL_NAME"];//样本详细名称

            string SCENCESAMPLE_NAME = HttpContext.Current.Request["SCENCESAMPLE_NAME"];//场景样本名称
            string SCENCESAMPLE_CODE = HttpContext.Current.Request["SCENCESAMPLE_CODE"];//场景样本编码

            int t_severity = Convert.ToInt32(string.IsNullOrEmpty(HttpContext.Current.Request["tseverity"]) ? "-1" : HttpContext.Current.Request["tseverity"].ToString());//手动转发标志
            DateTime reportdate = DateTime.Now;
            if (!String.IsNullOrEmpty(HttpContext.Current.Request["reportdate"]))
            {
                reportdate = DateTime.Parse(HttpContext.Current.Request["reportdate"]);//日期
            }
            int alarmcount = 0;
            switch (category)
            {
                case "1C":
                    responsestr = Api.ServiceAccessor.GetEventService().convertC1EventToAlarm(alarmid, afcode, afcodeName, severity, txtDefect, txtAdvice);
                    break;
                case "REPEAT":
                    C3_AlarmCond cond = new C3_AlarmCond();
                    string idsStr = "";
                    foreach (string item in ids.Split(','))
                    {
                        idsStr += string.Format(",'{0}'", item);
                    }
                    if (!string.IsNullOrEmpty(idsStr))
                    {
                        cond.businssAnd = string.Format(" ALARM.id in ({0})", idsStr.Substring(1));
                        cond.orderBy = " raised_time desc ";
                    }
                    //IList<C3_Alarm> list = Api.ServiceAccessor.GetAlarmService().getC3Alarm(cond);
                    IList<C3_Alarm> list = Api.ServiceAccessor.GetAlarmService().getC3Alarm_Aux(cond);
                    for (int i = 0; i < list.Count; i++)
                    {
                        string sign = null;
                        C3_Alarm c3_alarm = Api.ServiceAccessor.GetAlarmService().getC3Alarm_Aux(list[i].ID);
                        sign = c3_alarm.SVALUE15;
                        if (c3_alarm.STATUS == "AFSTATUS04" || c3_alarm.STATUS == "AFSTATUS05")
                            continue;
                        if (Api.Util.Common.FunEnable("Fun_UpdateFlag") == false)//外部功能
                        {
                            if (btntype == "btnOk")
                            {
                                if (c3_alarm.STATUS != "AFSTATUS03" || c3_alarm.STATUS_NAME != Public.GetStatusName("AFSTATUS03"))
                                {
                                    ADO.ModifyLog.UpdateTableCols(c3_alarm.ID, "STATUS", txtReporterCode);
                                }
                            }
                            else if (btntype == "btnCan")
                            {
                                if (c3_alarm.STATUS != "AFSTATUS02" || c3_alarm.STATUS_NAME != Public.GetStatusName("AFSTATUS02"))
                                {
                                    ADO.ModifyLog.UpdateTableCols(c3_alarm.ID, "STATUS", txtReporterCode);
                                }
                            }
                            if (i == 0)
                            {
                                if (c3_alarm.CODE != afcode || c3_alarm.CODE_NAME != afcodeName || c3_alarm.MY_STR_8 != severity)
                                {
                                    ADO.ModifyLog.UpdateTableCols(c3_alarm.ID, "LEVEL", txtReporterCode);
                                }
                                if (c3_alarm.ALARM_ANALYSIS != txtDefect || c3_alarm.PROPOSAL != txtAdvice || c3_alarm.REMARK != txtNote)
                                {
                                    ADO.ModifyLog.UpdateTableCols(c3_alarm.ID, "ANA", txtReporterCode);
                                }
                            }
                        }
                        if (btntype == "btnOk")
                        {
                            if (i == 0)
                            {
                                c3_alarm.ALARM_ANALYSIS = txtDefect.Replace("+", "＋");
                                c3_alarm.PROPOSAL = txtAdvice;
                                c3_alarm.REMARK = txtNote;
                                c3_alarm.REPORT_PERSON = txtReporter;
                                c3_alarm.REPORT_DATE = reportdate;
                                c3_alarm.STATUS_TIME = DateTime.Now;
                                c3_alarm.CODE = afcode;
                                c3_alarm.CODE_NAME = afcodeName;
                                c3_alarm.CUST_ALARM_CODE = CUST_ALARM_CODE;

                                if (!string.IsNullOrEmpty(severity) && severity != "请选择" && severity != "0")
                                    c3_alarm.SEVERITY = severity;
                                c3_alarm.MY_STR_8 = severity;
                                c3_alarm.SVALUE15 = "重复报警";
                            }
                            else
                            {
                                c3_alarm.SEVERITY = c3_alarm.MY_STR_8;
                                c3_alarm.SVALUE15 = list[0].ID;
                            }
                            c3_alarm.STATUS = "AFSTATUS03";
                            c3_alarm.STATUS_NAME = "已确认";
                            c3_alarm.DATA_TYPE = "FAULT";
                            c3_alarm.STATUS_TIME = DateTime.Now;
                        }
                        else if (btntype == "btnCan")
                        {
                            if (c3_alarm.SVALUE15 == "重复报警")
                            {
                                c3_alarm.ALARM_ANALYSIS = txtDefect.Replace("+", "＋");
                                c3_alarm.PROPOSAL = txtAdvice;
                                c3_alarm.REMARK = txtNote;
                                c3_alarm.REPORT_PERSON = txtReporter;
                                c3_alarm.REPORT_DATE = reportdate;
                                c3_alarm.STATUS_TIME = DateTime.Now;
                                c3_alarm.CODE = afcode;
                                c3_alarm.CODE_NAME = afcodeName;
                                c3_alarm.CUST_ALARM_CODE = CUST_ALARM_CODE;

                                if (!string.IsNullOrEmpty(severity) && severity != "请选择" && severity != "0")
                                    c3_alarm.SEVERITY = severity;
                                c3_alarm.MY_STR_8 = severity;
                            }
                            else
                            {
                                c3_alarm.SEVERITY = c3_alarm.MY_STR_8;
                            }
                            c3_alarm.STATUS = "AFSTATUS02";
                            c3_alarm.STATUS_NAME = "已取消";
                            c3_alarm.STATUS_TIME = DateTime.Now;
                            c3_alarm.SVALUE15 = "";
                            c3_alarm.DATA_TYPE = "ALARM";

                        }
                        Api.ServiceAccessor.GetAlarmService().InsertAlarmHis(c3_alarm.ID);//将报警原始数据存入报警历史表
                        if (Api.ServiceAccessor.GetAlarmService().updateC3Alarm(c3_alarm))
                        {
                            //进行重复报警操作时 将重复次数写入附加信息表中
                            if (btntype == "btnOk")
                            {
                                if (c3_alarm.Alarm_Aux != null)
                                {
                                    c3_alarm.Alarm_Aux.ALARM_REP_COUNT = list.Count;
                                    Api.ServiceAccessor.GetAlarmService().updateAlarm_Aux(c3_alarm.Alarm_Aux);
                                }
                                else
                                {
                                    Alarm_AUX aux = new Alarm_AUX();
                                    aux.ALARM_ID = c3_alarm.ID;
                                    aux.AUX_ID = Guid.NewGuid().ToString();
                                    aux.ALARM_REP_COUNT = list.Count;
                                    Api.ServiceAccessor.GetAlarmService().addAlarm_Aux(aux);
                                }
                            }
                            else if (btntype == "btnCan")
                            {
                                if (!string.IsNullOrEmpty(sign) && sign == "重复报警")
                                {
                                    sign = "";
                                }
                                ADO.Alarm_ConfirmImpl.RepartAlarmCancel(c3_alarm.ID, sign);
                            }
                        }
                        //if (c3_alarm.Alarm_Aux != null)
                        //{
                        //    c3_alarm.Alarm_Aux.ALARM_REP_COUNT = list.Count;
                        //    Api.ServiceAccessor.GetAlarmService().updateAlarm_Aux(c3_alarm.Alarm_Aux);
                        //}
                        //else
                        //{
                        //    Alarm_AUX aux = new Alarm_AUX();
                        //    aux.ALARM_ID = c3_alarm.ID;
                        //    aux.AUX_ID = Guid.NewGuid().ToString();
                        //    aux.ALARM_REP_COUNT = list.Count;
                        //    Api.ServiceAccessor.GetAlarmService().addAlarm_Aux(aux);
                        //}
                        //如果是报警确认操作，将trans_data表中的trans_result字段置为wait
                        //if (btntype == "btnOk")
                        //{
                        //    int count;
                        //    log4net.ILog log2 = log4net.LogManager.GetLogger("TRANS状态");
                        //    string sql = string.Format("update trans_data set trans_result ='wait' where id='{0}'", c3_alarm.ID);
                        //    int val = 0;
                        //    for (count = 0; count < 4; count++)
                        //    {
                        //        val = DbHelperOra.ExecuteSql(sql);
                        //        if (val > 0)
                        //            break;
                        //        System.Threading.Thread.Sleep(200);
                        //    }



                        //    log2.DebugFormat("执行SQL:{0},执行结果:{1},执行次数{2}", sql, val, count + 1);

                        //}
                        //Api.ServiceAccessor.GetAlarmService().UpdateTransData(c3_alarm.ID);
                        if (btntype == "btnOk")
                        {
                            Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "报警确认", Api.Util.Public.FunNames.报警监控.ToString(), Public.GetLoginIP, "对报警<a  href=javascript:ShowWinOpen(\\\"../../C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmID=" + c3_alarm.ID + "\\\")>" + c3_alarm.ID + "</a>进行了重复报警确认操作", "", true);
                        }
                        else if (btntype == "btnCan")
                        {
                            Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "缺陷取消", Api.Util.Public.FunNames.报警监控.ToString(), Public.GetLoginIP, "对缺陷<a  href=javascript:ShowWinOpen(\\\"../../C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmID=" + c3_alarm.ID + "\\\")>" + c3_alarm.ID + "</a>进行了重复报警取消操作", "", true);
                        }
                    }

                    responsestr = "1";
                    break;
                case "3C":
                    #region 3C

                    string[] alarmids = alarmid.Split(',');
                    foreach (string _alarmID in alarmids)
                    {
                        if (string.IsNullOrEmpty(_alarmID)) continue;

                        try
                        {
                            Api.Foundation.entity.Foundation.SysDictionary mcode = Common.getSysDictionaryInfo(afcode);
                            int i = 0;
                            Alarm m = Api.ServiceAccessor.GetAlarmService().getAlarm(_alarmID);

                            if (btntype == "btnOk")
                            {
                                if (Api.Util.Common.FunEnable("Fun_UpdateFlag") == false)//外部功能
                                {
                                    if (m.STATUS != "AFSTATUS03" || m.STATUS_NAME != Public.GetStatusName("AFSTATUS03"))
                                    {
                                        ADO.ModifyLog.UpdateTableCols(_alarmID, "STATUS", txtReporterCode);
                                    }
                                    if (m.CODE != afcode || m.CODE_NAME != afcodeName || m.SEVERITY != severity)
                                    {
                                        ADO.ModifyLog.UpdateTableCols(_alarmID, "LEVEL", txtReporterCode);
                                    }
                                    if (m.ALARM_ANALYSIS != txtDefect || m.PROPOSAL != txtAdvice || m.REMARK != txtNote)
                                    {
                                        ADO.ModifyLog.UpdateTableCols(_alarmID, "ANA", txtReporterCode);
                                    }
                                }
                                Api.ServiceAccessor.GetAlarmService().InsertAlarmHis(_alarmID);//将报警数据保存至报警历史表
                                SetTransByPerson(_alarmID, t_severity);//设置手动转发
                                i = ADO.Alarm_ConfirmImpl.AlarmConfirm(_alarmID, DefectMarkCode, DefectMarkName, severity, Public.GetStatusName("AFSTATUS03"), "AFSTATUS03", txtDefect.Replace("+", "＋"), txtAdvice, txtNote, txtReporter, reportdate, afcode, CUST_ALARM_CODE, mcode.CODE_NAME, btntype, SAMPLE_CODE, SAMPLE_NAME, SAMPLE_DETAIL_CODE, SAMPLE_DETAIL_NAME, SCENCESAMPLE_NAME, SCENCESAMPLE_CODE);
                                alarmcount = alarmcount + i;

                                //如果是报警确认操作，将trans_data表中的trans_result字段置为wait
                                //if (i > 0)
                                //{
                                //    log4net.ILog log2 = log4net.LogManager.GetLogger("TRANS状态");
                                //    string sql = string.Format("update trans_data set trans_result ='wait' where id='{0}'", _alarmID);
                                //    int val = 0;
                                //    val = DbHelperOra.ExecuteSql(sql);

                                //    if (val == 0)
                                //    {
                                //        log2.DebugFormat("执行SQL:{0},执行结果:{1},执行失败", sql, val);
                                //    }
                                //}
                                //else
                                //{
                                //    log4net.ILog log2 = log4net.LogManager.GetLogger("报警确认、取消更新操作");
                                //    log2.DebugFormat("执行失败,ID:{0}", _alarmID);
                                //}

                                if (i == 1)
                                {
                                    Alarm alarm = Api.ServiceAccessor.GetAlarmService().getAlarm(_alarmID);
                                    alarm.PROCESS_STATUS = "未销号";
                                    Api.ServiceAccessor.GetAlarmService().updateAlarm(alarm);
                                }

                                //Api.ServiceAccessor.GetAlarmService().UpdateTransData(_alarmID);

                                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "报警确认", Api.Util.Public.FunNames.报警监控.ToString(), Public.GetLoginIP, "对报警<a  href=javascript:ShowWinOpen(\\\"../../C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmID=" + _alarmID + "\\\")>" + _alarmID + "</a>进行了确认操作", "", true);


                            }
                            else
                            {
                                if (Api.Util.Common.FunEnable("Fun_UpdateFlag") == false)//外部功能
                                {
                                    if (m.STATUS != "AFSTATUS02" || m.STATUS_NAME != Public.GetStatusName("AFSTATUS02"))
                                    {
                                        ADO.ModifyLog.UpdateTableCols(_alarmID, "STATUS", txtReporterCode);
                                    }
                                    if (m.CODE != afcode || m.CODE_NAME != afcodeName || m.SEVERITY != severity)
                                    {
                                        ADO.ModifyLog.UpdateTableCols(_alarmID, "LEVEL", txtReporterCode);
                                    }
                                    if (m.ALARM_ANALYSIS != txtDefect || m.PROPOSAL != txtAdvice || m.REMARK != txtNote)
                                    {
                                        ADO.ModifyLog.UpdateTableCols(_alarmID, "ANA", txtReporterCode);
                                    }
                                }
                                //取消 不生成word,   //之后再加上删除文件。
                                Api.ServiceAccessor.GetAlarmService().InsertAlarmHis(_alarmID);//将报警数据保存至报警历史表
                                SetTransByPerson(_alarmID, t_severity);//设置手动转发
                                i = ADO.Alarm_ConfirmImpl.AlarmConfirm(_alarmID, DefectMarkCode, DefectMarkName, severity, Public.GetStatusName("AFSTATUS02"), "AFSTATUS02", txtDefect, txtAdvice, txtNote, txtReporter, reportdate, afcode, CUST_ALARM_CODE, mcode.CODE_NAME, btntype, SAMPLE_CODE, SAMPLE_NAME, SAMPLE_DETAIL_CODE, SAMPLE_DETAIL_NAME, SCENCESAMPLE_NAME, SCENCESAMPLE_CODE);
                                alarmcount = alarmcount + i;

                                if (i == 1)
                                {
                                    Alarm alarm = Api.ServiceAccessor.GetAlarmService().getAlarm(_alarmID);
                                    alarm.PROCESS_STATUS = "";
                                    Api.ServiceAccessor.GetAlarmService().updateAlarm(alarm);
                                }

                                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "缺陷取消", Api.Util.Public.FunNames.报警监控.ToString(), Public.GetLoginIP, "对缺陷<a  href=javascript:ShowWinOpen(\\\"../../C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmID=" + m.ID + "\\\")>" + m.ID + "</a>进行了取消操作", "", true);


                            }
                            if (alarmcount == alarmids.Length)
                            {
                                responsestr = "1";
                            }

                            //}
                        }
                        catch (Exception ex)
                        {
                            log4net.ILog log2 = log4net.LogManager.GetLogger("确认报警");
                            log2.Error("updateAlarm", ex);
                        }

                    }

                    #endregion

                    break;
                case "4C":
                    #region 确认4C
                    string txt_code = afcodeName;
                    string code = afcode;
                    string sele_level = severity;
                    string txtReportdate = reportdate.ToString();
                    string eid = HttpContext.Current.Request["eid"];

                    C4EventCond e4_cond = new C4EventCond();
                    e4_cond.ID = eid;
                    IList<C4Event> list_e4 = Api.ServiceAccessor.GetEventService().getC4EventDetail(e4_cond);

                    if (list_e4.Count > 0)
                    {

                        C4Event e4 = list_e4[0];

                        //查询是否有缺陷数据
                        AlarmCond alarm_cond = new AlarmCond();
                        alarm_cond.DEVICE_ID = e4.DEVICE_ID;
                        alarm_cond.HARDDISK_MANAGE_ID = e4.HARDDISK_MANAGE_ID;
                        int n = Api.ServiceAccessor.GetAlarmService().getAlarmCount(alarm_cond);

                        if (n == 0)
                        {
                            //不存在，才继续操作。
                            C4_Alarm m = Api.ServiceAccessor.GetEventService().convertC4EventToAlarm(e4);
                            m.CODE = code;
                            m.SUMMARY = txt_code;
                            m.SEVERITY = sele_level;
                            m.DETAIL = txt_code;
                            m.ALARM_ANALYSIS = txtDefect;
                            m.PROPOSAL = txtAdvice;
                            m.REMARK = txtNote;
                            m.REPORT_PERSON = txtReporter;

                            try
                            {
                                DateTime dt = Convert.ToDateTime(txtReportdate);
                                m.REPORT_DATE = dt;
                            }
                            catch (Exception ex) { }


                            #region 图片处理

                            string ftproot = "~/FtpRoot/";

                            List<string> olist = new List<string>();
                            olist.Add(ftproot + e4.PIC_PATH_A01);
                            olist.Add(ftproot + e4.PIC_PATH_A02);
                            olist.Add(ftproot + e4.PIC_PATH_A03);
                            olist.Add(ftproot + e4.PIC_PATH_A04);
                            olist.Add(ftproot + e4.PIC_PATH_A05);
                            olist.Add(ftproot + e4.PIC_PATH_A06);
                            olist.Add(ftproot + e4.PIC_PATH_B01);
                            olist.Add(ftproot + e4.PIC_PATH_B02);
                            olist.Add(ftproot + e4.PIC_PATH_B03);
                            olist.Add(ftproot + e4.PIC_PATH_B04);
                            olist.Add(ftproot + e4.PIC_PATH_B05);
                            olist.Add(ftproot + e4.PIC_PATH_B06);

                            List<string> Tolist = new List<string>();

                            foreach (string imgsrc in m.MY_STR_3.Split('#'))
                            {
                                if (!string.IsNullOrEmpty(imgsrc))
                                {
                                    Tolist.Add(ftproot + m.DIR_PATH + imgsrc);
                                }
                            }

                            if (olist.Count == Tolist.Count)
                            {
                                for (int i = 0; i < olist.Count; i++)
                                {

                                    string o_local_100 = HttpContext.Current.Server.MapPath(olist[i]);
                                    string To_local_100 = HttpContext.Current.Server.MapPath(Tolist[i]);

                                    string tmep_To_local_dic = To_local_100.Substring(0, To_local_100.LastIndexOf("\\"));

                                    if (!System.IO.Directory.Exists(tmep_To_local_dic))
                                        System.IO.Directory.CreateDirectory(tmep_To_local_dic);

                                    try
                                    {
                                        System.IO.File.Copy(o_local_100, To_local_100, true);
                                    }
                                    catch { }

                                }
                            }


                            #endregion




                            bool success = Api.ServiceAccessor.GetAlarmService().addC4Alarm(m);
                            if (success)
                            {
                                responsestr = m.ID;
                                //  HttpContext.Current.Response.Write("操作成功");
                            }
                            else
                            {
                                // HttpContext.Current.Response.Write("操作失败");
                            }

                        }
                        else
                        {

                            //  HttpContext.Current.Response.Write("缺陷库中已经存在");
                        }

                    }
                    #endregion
                    break;


                case "DPC":
                    #region DPC
                    Api.Foundation.entity.Cond.SysDictionaryCond syscond2 = new Api.Foundation.entity.Cond.SysDictionaryCond();
                    syscond2.CODE_NAME = afcode;
                    //System.Collections.Generic.IList<Api.Foundation.entity.Foundation.SysDictionary> sys = Api.ServiceAccessor.GetFoundationService().querySysDictionary(syscond);
                    //try { afcode = sys[0].DIC_CODE; }
                    //catch { }

                    string[] alarmids2 = alarmid.Split(',');

                    foreach (string _alarmID in alarmids2)
                    {
                        if (string.IsNullOrEmpty(_alarmID)) continue;

                        Alarm alarm = Api.ServiceAccessor.GetAlarmService().getAlarm(_alarmID);

                        if (alarm.ID != null && alarmid != "null")
                        {
                            alarm.ALARM_ANALYSIS = txtDefect;
                            alarm.PROPOSAL = txtAdvice;
                            alarm.REMARK = txtNote;
                            alarm.REPORT_PERSON = txtReporter;
                            alarm.REPORT_DATE = reportdate;
                            alarm.STATUS_TIME = DateTime.Now;
                            //alarm.CODE = afcode;
                            alarm.CUST_ALARM_CODE = CUST_ALARM_CODE;

                            if (alarm.CATEGORY_CODE == "3C")
                            {
                                Alarm_AUX aux = Api.ServiceAccessor.GetAlarmService().getAlarm_Aux(_alarmID);
                                alarm.Alarm_Aux = aux;
                                if (!string.IsNullOrEmpty(aux.AUX_ID))
                                {
                                    if (!string.IsNullOrEmpty(DefectMarkName))
                                    {
                                        alarm.Alarm_Aux.AFLG_NAME = DefectMarkName;
                                    }
                                    if (!string.IsNullOrEmpty(DefectMarkCode))
                                    {
                                        alarm.Alarm_Aux.AFLG_CODE = DefectMarkCode;
                                    }
                                }
                                else
                                {  //如果这条报警的附加表不存在
                                    Alarm_AUX alarmaux = new Alarm_AUX();
                                    alarmaux.ALARM_ID = alarmid;
                                    if (!string.IsNullOrEmpty(DefectMarkName))
                                    {
                                        alarmaux.AFLG_NAME = DefectMarkName;
                                    }
                                    if (!string.IsNullOrEmpty(DefectMarkCode))
                                    {
                                        alarmaux.AFLG_CODE = DefectMarkCode;
                                    }
                                    Api.ServiceAccessor.GetAlarmService().addAlarm_Aux(alarmaux);
                                }
                            }


                            //Api.Foundation.entity.Foundation.SysDictionary m_code = Common.getSysDictionaryInfo(alarm.CODE);
                            //if (m_code != null)
                            //    alarm.CODE_NAME = m_code.CODE_NAME;

                            //if (!string.IsNullOrEmpty(severity) && severity != "请选择" && severity != "0")
                            //    alarm.SEVERITY = severity;


                            if (btntype == "btnOk")
                            {
                                alarm.STATUS = "AFSTATUS03";
                                alarm.STATUS_NAME = Public.GetStatusName(alarm.STATUS);
                                alarm.DATA_TYPE = "FAULT";
                                alarm.STATUS_TIME = DateTime.Now;

                                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "报警确认", Api.Util.Public.FunNames.报警监控.ToString(), Public.GetLoginIP, "对报警<a  href=javascript:ShowWinOpen(\\\"../../C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmID=" + alarm.ID + "\\\")>" + alarm.ID + "</a>进行了确认操作", "", true);

                            }
                            else if (btntype == "btnCan")
                            {
                                alarm.STATUS = "AFSTATUS02";
                                alarm.STATUS_NAME = Public.GetStatusName(alarm.STATUS);
                                alarm.STATUS_TIME = DateTime.Now;
                                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "缺陷取消", Api.Util.Public.FunNames.报警监控.ToString(), Public.GetLoginIP, "对缺陷<a  href=javascript:ShowWinOpen(\\\"../../C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmID=" + alarm.ID + "\\\")>" + alarm.ID + "</a>进行了取消操作", "", true);
                            }

                            try
                            {
                                if (Api.ServiceAccessor.GetAlarmService().updateAlarm(alarm))
                                {

                                    if (alarm.Alarm_Aux != null)
                                    {
                                        alarm.Alarm_Aux.AFLG_NAME = DefectMarkName;
                                        alarm.Alarm_Aux.AFLG_CODE = DefectMarkCode;
                                        Api.ServiceAccessor.GetAlarmService().updateAlarm_Aux(alarm.Alarm_Aux);
                                    }


                                    //如果是报警确认操作，将trans_data表中的trans_result字段置为wait
                                    if (btntype == "btnOk")
                                    {
                                        if (alarm.CATEGORY_CODE == "3C")
                                        {
                                            if (alarm.SEVERITY.Equals("一类") || alarm.SEVERITY.Equals("二类"))
                                            {
                                                Api.ServiceAccessor.GetAlarmService().updateReportDBForce(alarm.ID);
                                            }
                                            else if (alarm.SEVERITY.Equals("三类"))
                                            {
                                                Api.ServiceAccessor.GetAlarmService().UpdateStatusAndURLToNull(alarm.ID);
                                            }
                                        }

                                        int count = 0;
                                        log4net.ILog log2 = log4net.LogManager.GetLogger("TRANS状态");
                                        string sql = string.Format("update trans_data set trans_result ='wait' where id='{0}'", alarm.ID);
                                        int val = 0;
                                        try
                                        {

                                            for (count = 0; count < 4; count++)
                                            {
                                                val = DbHelperOra.ExecuteSql(sql);
                                                if (val > 0)
                                                    break;
                                                System.Threading.Thread.Sleep(200);
                                            }
                                        }
                                        catch (Exception ex)
                                        {

                                            log2.Error("确认后，更新trans_data 出错 ", ex);

                                        }


                                        log2.DebugFormat("执行SQL:{0},执行结果:{1},执行次数{2}", sql, val, count + 1);

                                    }
                                    else
                                    {
                                        if (alarm.CATEGORY_CODE == "3C")
                                        {
                                            //取消 不生成word,   //之后再加上删除文件。
                                            Api.ServiceAccessor.GetAlarmService().UpdateStatusAndURLToNull(alarm.ID);


                                        }
                                    }
                                    responsestr = "1";
                                }
                            }
                            catch (Exception ex)
                            {
                                log4net.ILog log2 = log4net.LogManager.GetLogger("确认报警");
                                log2.Error("updateAlarm", ex);
                            }
                        }
                    }
                    #endregion

                    break;
                case "DPC_ELSE":
                    #region DPC中1C,2C,4C报警进行确认

                    //缺陷实体
                    Api.Foundation.entity.Cond.SysDictionaryCond syscond = new Api.Foundation.entity.Cond.SysDictionaryCond();
                    syscond.CODE_NAME = afcode;
                    IList<SysDictionary> sys = Api.ServiceAccessor.GetFoundationService().querySysDictionary(syscond);
                    try { afcode = sys[0].DIC_CODE; }
                    catch { }
                    Alarm DPC_ELSE_alarm = Api.ServiceAccessor.GetAlarmService().getAlarm(alarmid);
                    if (DPC_ELSE_alarm.ID != null && alarmid != "null")
                    {
                        DPC_ELSE_alarm.ALARM_ANALYSIS = txtDefect;
                        DPC_ELSE_alarm.PROPOSAL = txtAdvice;
                        DPC_ELSE_alarm.REMARK = txtNote;
                        DPC_ELSE_alarm.REPORT_PERSON = txtReporter;
                        DPC_ELSE_alarm.REPORT_DATE = reportdate;
                        DPC_ELSE_alarm.STATUS_TIME = DateTime.Now;
                        DPC_ELSE_alarm.CODE = afcode;
                        DPC_ELSE_alarm.CODE_NAME = afcodeName;
                        DPC_ELSE_alarm.SEVERITY = severity;
                        if (btntype == "btnOk")
                        {
                            DPC_ELSE_alarm.STATUS = "AFSTATUS03";
                            DPC_ELSE_alarm.STATUS_NAME = "已确认";
                            DPC_ELSE_alarm.DATA_TYPE = "FAULT";
                            DPC_ELSE_alarm.STATUS_TIME = DateTime.Now;
                            DPC_ELSE_alarm.PROCESS_STATUS = "未销号";
                            Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "报警确认", "报警监控", Public.GetLoginIP, "对报警<a  href=javascript:ShowWinOpen(\\\"../Monitor/MonitorAlarmList.htm?id=" + DPC_ELSE_alarm.ID + "\\\")>" + DPC_ELSE_alarm.ID + "</a>进行了确认操作", "", true);

                        }
                        else if (btntype == "btnCan")
                        {
                            DPC_ELSE_alarm.STATUS = "AFSTATUS02";
                            DPC_ELSE_alarm.STATUS_NAME = "已取消";
                            DPC_ELSE_alarm.STATUS_TIME = DateTime.Now;
                            DPC_ELSE_alarm.PROCESS_STATUS = "";
                            Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "缺陷取消", "缺陷监控", Public.GetLoginIP, "对缺陷<a  href=javascript:ShowWinOpen(\\\"../Monitor/MonitorAlarmList.htm?id=" + DPC_ELSE_alarm.ID + "\\\")>" + DPC_ELSE_alarm.ID + "</a>进行了取消操作", "", true);
                        }
                        if (Api.ServiceAccessor.GetAlarmService().updateAlarm(DPC_ELSE_alarm))
                        {
                            responsestr = "1";
                        }
                    }

                    #endregion
                    break;


            }


            string jsonsign = HttpContext.Current.Request["jsonsign"];
            if (!string.IsNullOrEmpty(jsonsign))
            {
                StringBuilder json = new StringBuilder();
                json.Append("{\"sign\":\"" + responsestr + "\"}");
                HttpContext.Current.Response.ContentType = "application/json";
                HttpContext.Current.Response.Write(json);
            }
            else
            {
                HttpContext.Current.Response.Write(responsestr);
            }
            //        
        }
        catch (Exception ex2)
        {
            log4net.ILog log2 = log4net.LogManager.GetLogger("确认报警");
            log2.Error("Save", ex2);
        }
    }

    /// <summary>
    /// 对于已经确认为缺陷的5C缺陷数据，进行重复确认或者取消
    /// </summary>
    public static void Save_5c()
    {
        HttpContext context = HttpContext.Current;
        string[] ids = context.Request["ids"].Replace("','", ",").Split(',');//为了应对批量确认的情况，全部以批量id作为处理对象遍历
        string severity = context.Request["severity"];
        string faultCode = context.Request["faultCode"];
        string reportPerson = context.Request["reportPerson"];
        string reportDate = context.Request["reportDate"];
        string custAlarmCode = context.Request["custAlarmCode"];//标签
        string alarmAnalyse = context.Request["alarmAnalyse"];//报警分析
        string proposal = context.Request["proposal"];//处理建议
        string remark = context.Request["remark"];//备注
        string status = context.Request["status"];//状态 确认or取消的编码

        StringBuilder result = new StringBuilder();
        result.Append("[");

        foreach (string id in ids)
        {
            Alarm a = Api.ServiceAccessor.GetAlarmService().getAlarm(id);

            a.SEVERITY = severity;
            a.CODE = faultCode;
            a.CODE_NAME = Api.Util.Common.getSysDictionaryInfo(faultCode).CODE_NAME;
            a.REPORT_DATE = reportDate == null ? Convert.ToDateTime("0001-01-01") : Convert.ToDateTime(reportDate);
            a.REPORT_PERSON = reportPerson;
            a.CUST_ALARM_CODE = custAlarmCode;
            a.ALARM_ANALYSIS = alarmAnalyse;
            a.PROPOSAL = proposal;
            a.REMARK = remark;
            a.STATUS = status;
            a.STATUS_NAME = Api.Util.Common.getSysDictionaryInfo(status).CODE_NAME;

            if(Api.ServiceAccessor.GetAlarmService().InsertAlarmHis(id))//将报警数据保存至报警历史表
            {
                try
                {
                    Api.ServiceAccessor.GetAlarmService().updateAlarm(a);
                    ADO.C5Query.UpdateC5DetectData(id, remark, a.DETECT_DEVICE_CODE, a.SVALUE15);
                }
                catch (Exception ex)
                {
                    log4net.ILog log = log4net.LogManager.GetLogger("重复确认或去取消5C缺陷数据出错,缺陷ID=" + id);
                    log.Error(ex);
                }
                finally
                {
                    result.Append("{\"alarm_id\":\"" + id + "\"},");
                }
            }


        }
        result.Remove(result.Length - 1, 1);
        result.Append("]");
        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(result);
    }

    /// <summary>
    /// 设置手动转发，只有报警确认才转发，重复报警确认不设置转发
    /// </summary>
    /// <param name="context"></param>
    public void SetTransByPerson(String alarmid, int t_severity)
    {
        //string alarmid = context.Request["alarmid"];//报警ID
        //int t_severity = Convert.ToInt32(context.Request["tseverity"]);//转发优先级

        string updateSQL = String.Format(@"begin update alarm_aux aux set aux.is_trans_allowed={0} where aux.alarm_id='{1}' ;
                                           update trans_data t set t.is_trans_allowed={0},t.trans_result='wait',t.is_re_syn='1' where t.id='{1}'; end;", t_severity, alarmid);
        if (t_severity == -1)
        {
            updateSQL = String.Format(@"begin update alarm_aux aux set aux.is_trans_allowed={0} where aux.alarm_id='{1}' ;
                                           update trans_data t set t.is_trans_allowed={0} where t.id='{1}'; end;", t_severity, alarmid);
        }
        int update_result = 0;
        //int trans_result = 0;
        try
        {
            update_result = DbHelperOra.ExecuteSql(updateSQL);
            //trans_result = Api.ServiceAccessor.GetAlarmService().UpdateTransData(alarmid);
        }
        catch (Exception ex)
        {
            log4net.ILog log = log4net.LogManager.GetLogger("手动转发缺陷设置出错");
            log.Error("执行出错", ex);
        }
        //转发结果
        //if (update_result > 0 && trans_result > 0)
        //{
        //    HttpContext.Current.Response.Write("true");
        //}
        //else
        //{
        //    HttpContext.Current.Response.Write("false");
        //}

    }
    public string getPullValue(Alarm alarm)
    {
        string re = "";

        try
        {
            C3_Alarm c3alarm = Api.ServiceAccessor.GetAlarmService().SConvertToC3_Alarm(alarm);

            JavaScriptSerializer jss = new JavaScriptSerializer();
            ShortFaultBasicInfo sbi = jss.Deserialize<ShortFaultBasicInfo>(c3alarm.SVALUE3);
            FaultBasicInfo fbi = sbi.ConvertToFaultBasicInfo();

            for (int i = 0; i < fbi.FRAME_INFO.Length; i++)
            {
                re = re + fbi.FRAME_INFO[i].PULLING_VALUE;
                if (i < fbi.FRAME_INFO.Length - 1)
                {
                    re = re + ",";
                }
            }
        }
        catch (Exception ex)
        {
            log4net.ILog log2 = log4net.LogManager.GetLogger("报警确认，解析SVALUE3获取拉出值");
            log2.Error("Error", ex);
        }

        return re;
    }

    /// <summary>
    /// 查询正样本详细类型及文件保存路径
    /// </summary>
    //public static void QuerySampleTypeAndPath()
    //{
    //    string alarmCode = HttpContext.Current.Request["alarmcode"];//报警类型
    //    string result = null;
    //    string sql = @"SELECT D.CODE_NAME,S.SAMPLE_CODE FROM SAMPLE_AFCODE_RELATION S ,SYS_DIC D WHERE S.SAMPLE_CODE=D.DIC_CODE AND S.ALARM_CODE='" + alarmCode + "'";

    //    try
    //    {
    //        result = DbHelperOra.GetSingle(sql) == DBNull.Value ? null : DbHelperOra.GetSingle(sql).ToString();
    //    }
    //    catch (Exception ex)
    //    {
    //        log4net.ILog log = log4net.LogManager.GetLogger("查询报警类型异常，sql =" + sql);
    //        log.Error("执行出错", ex);
    //    }

    //    if (string.IsNullOrEmpty(result))
    //    {
    //        HttpContext.Current.Response.Write("报警类型无法匹配到相关部件.");
    //    }
    //    else
    //    {
    //        //Api.ADO.entity.Virtual_Dir_Info vd = ADO.IVirtual_dir_infoImpl.getVirtualAndPhysical("8");//获取虚拟路径及物理路径地址
    //        //string path = HttpContext.Current.Request.MapPath("~/" + vd.VIRTUAL_DIR_NAME) + "\\" + result + "\\" + Common.getSysDictionaryInfo(alarmCode).CODE_NAME;
    //        HttpContext.Current.Response.Write(result);
    //    }
    //}
    public static void QuerySampleTypeAndPath()
    {
        string alarmCode = HttpContext.Current.Request["alarmcode"];//报警类型
        DataSet ds = null;
        string sql = @"SELECT S.SAMPLE_CODE ,D.CODE_NAME FROM SAMPLE_AFCODE_RELATION S ,SYS_DIC D WHERE S.SAMPLE_CODE=D.DIC_CODE AND S.ALARM_CODE='" + alarmCode + "'";
        ds = DbHelperOra.Query(sql);
        DataTable dt = ds.Tables[0];
        HttpContext.Current.Response.ContentType = "application/json";
        StringBuilder jsonStr = new StringBuilder();
        if (dt.Rows.Count > 0)
        {
            try
            {
                //result = DbHelperOra.GetSingle(sql) == DBNull.Value ? null : DbHelperOra.GetSingle(sql).ToString();

                foreach (DataRow row in dt.Rows)
                {
                    int n = 0;
                    if (n == 0)
                    {
                        jsonStr.Append("{");
                    }
                    else
                    {
                        jsonStr.Append(",{");
                    }
                    jsonStr.AppendFormat("'SAMPLE_CODE':'{0}',", row["SAMPLE_CODE"]);
                    jsonStr.AppendFormat("'SAMPLE_NAME':'{0}',", row["CODE_NAME"]);
                    jsonStr.AppendFormat("'SUCCESS':'{0}'", "true");
                    jsonStr.Append("}");
                    n++;
                }
                jsonStr = jsonStr.Replace("'", "\"");
                HttpContext.Current.Response.Write(jsonStr);
            }
            catch (Exception ex)
            {
                log4net.ILog log = log4net.LogManager.GetLogger("查询报警类型异常，sql =" + sql);
                log.Error("执行出错", ex);
            }
        }
        else
        {
            jsonStr.Append("{");
            jsonStr.AppendFormat("'SUCCESS':'{0}',", "false");
            jsonStr.AppendFormat("'ERROR':'{0}'", "报警类型无法匹配到相关部件.");
            jsonStr.Append("}");
            jsonStr = jsonStr.Replace("'", "\"");
            HttpContext.Current.Response.Write(jsonStr);
        }
    }
    public void Save_ScenceSample()
    {
        string alarmid = HttpContext.Current.Request["alarmid"];//缺陷ID
        string SCENCESAMPLE_CODE = HttpContext.Current.Request["SCENCESAMPLE_CODE"];//样本编码
        string SCENCESAMPLE_NAME = HttpContext.Current.Request["SCENCESAMPLE_NAME"];//样本名
        StringBuilder json = new StringBuilder();
        int re = -1;
        string sql = "";
        if (!string.IsNullOrEmpty(alarmid))
        {
            try
            {
                if (!string.IsNullOrEmpty(SCENCESAMPLE_CODE))
                {
                    SCENCESAMPLE_CODE.Replace(" ", "");
                }
                if (!string.IsNullOrEmpty(SCENCESAMPLE_NAME))
                {
                    SCENCESAMPLE_NAME = SCENCESAMPLE_NAME.Replace(" ", "");
                }
                sql = "UPDATE ALARM_AUX SET SCENCESAMPLE_CODE = '" + SCENCESAMPLE_CODE + "', SCENCESAMPLE_NAME = '" + SCENCESAMPLE_NAME + "' WHERE ALARM_ID = '" + alarmid + "' ";
                re = DbHelperOra.ExecuteSql(sql);
            }
            catch (Exception ex)
            {
                log4net.ILog log = log4net.LogManager.GetLogger("更新场景样本,执行出错，sql=" + sql);
                log.Error("执行出错", ex);
            }
        }
        json.Append("{\"re\":\"" + re + "\"}");
        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}