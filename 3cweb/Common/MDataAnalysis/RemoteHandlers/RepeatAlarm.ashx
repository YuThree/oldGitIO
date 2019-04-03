<%@ WebHandler Language="C#" Class="RepeatAlarm" %>

using System;
using System.Web;
using Api.Fault.entity.alarm;
using System.Collections.Generic;
using System.IO;
using Newtonsoft.Json;
using Api.Foundation.entity.Foundation;
using System.Text;
using Api.Util;

public class RepeatAlarm : ReferenceClass, IHttpHandler
{


    public void ProcessRequest(HttpContext context)
    {
        string type = context.Request["type"];
        switch (type)
        {
            case "click":
                ProcessAlarm();
                break;
            case "getJson":
                GetJson();
                break;
            case "save":
                SaveEd();
                break;
        }
    }

    private void GetJson()
    {
        string json = "";
        try
        {
            StringBuilder sb = new StringBuilder();
            string alarmid = HttpContext.Current.Request["alarmid"];
            C3_AlarmCond cond = new C3_AlarmCond();
            cond.businssAnd = String.Format(" (ALARM.ID ='{0}' or ALARM.SVALUE15='{0}') ", alarmid);
            cond.orderBy = " RAISED_TIME DESC ";

            //对外 三级过滤级别筛选
            if (!Api.Util.Common.IsInternalVersion())
                cond.severitySign = false;

            //分析重复报警
            IList<C3_Alarm> list = Api.ServiceAccessor.GetAlarmService().getC3Alarm_Aux(cond);
            sb.Append("[");
            foreach (C3_Alarm a in list)
            {
                sb.AppendFormat("{{\"ID\":\"{0}\",\"GIS_X\":\"{1}\",\"GIS_Y\":\"{2}\",\"ImgHW\":\"{3}\",\"ImgKJG\":\"{4}\",\"LINE_NAME\":\"{5}\",\"POSITION_NAME\":\"{6}\",\"DIRECTION\":\"{7}\",\"DETAIL\":\"{8}\",\"DETECT_DEVICE_CODE\":\"{9}\",\"RAISED_TIME\":\"{10}\",\"ROUTING_NO\":\"{11}\",\"POLE_NUMBER\":\"{12}\",\"STATION_NAME\":\"{13}\",\"STATION_NO\":\"{14}\",\"KM_MARK\":\"{15}\",\"STATUS_NAME\":\"{16}\",\"GT\":\"{17}\",\"CODE_NAME\":\"{18}\",\"TYPE\":\"{19}\",\"BRG_TUN_NAME\":\"{20}\",\"BOW_TYPE\":\"{21}\",\"CODE\":\"{22}\",\"SEVERITY\":\"{23}\",\"WD\":\"{24}\",\"HJWD\":\"{25}\",\"SPEED\":\"{26}\",\"LCZ\":\"{27}\",\"DGZ\":\"{28}\",\"LINE_CODE\":\"{29}\",\"POSITION_CODE\":\"{30}\",\"BRG_TUN_CODE\":\"{31}\",\"GIS_X_O\":\"{32}\",\"GIS_Y_O\":\"{33}\",\"SVALUE15\":\"{34}\",\"CUST_ALARM_CODE\":\"{35}\"}},",
                    a.ID, a.GIS_X, a.GIS_Y, a.RAISE_FILE_IR, a.RAISE_FILE_VI, a.LINE_NAME, a.POSITION_NAME, a.DIRECTION, a.DETAIL, a.DETECT_DEVICE_CODE, a.RAISED_TIME.ToString("yyyy-MM-dd HH:mm:ss"), a.ROUTING_NO, a.POLE_NUMBER, a.STATION_NAME, a.STATION_NO, PublicMethod.KmtoString(a.KM_MARK), a.STATUS_NAME, (a.DETECT_DEVICE_CODE.IndexOf("CRH") > -1 ? "true" : "false"), a.CODE_NAME, "gps", a.BRG_TUN_NAME, a.BOW_TYPE, a.CODE, a.SEVERITY, myfiter.GetTEMP_MAX(a), myfiter.GetTEMP_ENV(a), myfiter.GetSpeed(a.SPEED), myfiter.GetPULLING_VALUE(a), myfiter.GetLINE_HEIGHT(a), a.LINE_CODE, a.POSITION_CODE, a.BRG_TUN_CODE, a.GIS_X_O, a.GIS_Y_O, a.SVALUE15, a.CUST_ALARM_CODE);
            }
            sb.Append("],");

            json = sb.ToString().TrimEnd(',');

        }
        catch (Exception e)
        {

        }
        finally
        {
            if (json != null)
            {
                //以JSON串格式传到前台
                object myObj = JsonConvert.DeserializeObject(json.ToString());
                HttpContext.Current.Response.Write(myObj);

            }
        }
    }

    private void ProcessAlarm()
    {
        string json = "";
        try
        {

            int repeatCount = Int32.Parse(HttpContext.Current.Request["REPEAT_COUT"]);//重复次数
                                                                                      //float range = Int32.Parse(HttpContext.Current.Request["RANGE"]) / 1000f;
            int range = Int32.Parse(HttpContext.Current.Request["RANGE"]);//间距
            string startTimeStr = HttpContext.Current.Request["START_DATE"];//起始时间
            string endTimeStr = HttpContext.Current.Request["END_DATE"];//终止时间
            DateTime startTime, endTime;
            //转换时间字符串，从报警详情页面来的不需要转换，从分析报表来的需要转换         
            if (startTimeStr.IndexOf(":") > 0)
            {
                startTime = Convert.ToDateTime(startTimeStr);
                endTime = Convert.ToDateTime(endTimeStr);
            }
            else
            {
                startTime = Convert.ToDateTime(startTimeStr + " 00:00:00");
                endTime = Convert.ToDateTime(endTimeStr + " 23:59:59");
            }

            string lineCode = HttpContext.Current.Request["LINE_CODE"];//线路CODE
                                                                       //string alarm_ID = HttpContext.Current.Request["ALARM_ID"];//报警ID
            string xb = HttpContext.Current.Request["XB"];//行别
            string jb = HttpContext.Current.Request["JB"];//缺陷级别
            string org_code = HttpContext.Current.Request["ORG_CODE"];//缺陷级别
            string org_name = HttpContext.Current.Request["ORG_NAME"];//缺陷级别
            string org_type = HttpContext.Current.Request["ORG_TYPE"];//缺陷级别
            string locomotive_code = HttpContext.Current.Request["LOCOMOTIVE_CODE"];//缺陷级别
            string txtqz = HttpContext.Current.Request["TXTQZ"];//区站
            string type = HttpContext.Current.Request["QTYPE"];//分析类型 line,gps 区分线路查询和经纬度查询 
            int start_km = 0;//
            int end_km = 0;//
            double gis_x1 = 0, gis_x2 = 0;//
            double gis_y1 = 0, gis_y2 = 0;//
            if (!string.IsNullOrEmpty(HttpContext.Current.Request["START_KM"]))
            {
                start_km = Convert.ToInt32(HttpContext.Current.Request["START_KM"]);
            }
            if (!string.IsNullOrEmpty(HttpContext.Current.Request["END_KM"]))
            {
                end_km = Convert.ToInt32(HttpContext.Current.Request["END_KM"]);
            }
            if (!string.IsNullOrEmpty(HttpContext.Current.Request["GIS_X1"]) && HttpContext.Current.Request["GIS_X1"] != "null")
            {
                gis_x1 = Convert.ToDouble(HttpContext.Current.Request["GIS_X1"]);
            }
            if (!string.IsNullOrEmpty(HttpContext.Current.Request["GIS_Y1"]) && HttpContext.Current.Request["GIS_X1"] != "null")
            {
                gis_y1 = Convert.ToDouble(HttpContext.Current.Request["GIS_Y1"]);
            }
            if (!string.IsNullOrEmpty(HttpContext.Current.Request["GIS_X2"]) && HttpContext.Current.Request["GIS_X1"] != "null")
            {
                gis_x2 = Convert.ToDouble(HttpContext.Current.Request["GIS_X2"]);
            }
            if (!string.IsNullOrEmpty(HttpContext.Current.Request["GIS_Y2"]) && HttpContext.Current.Request["GIS_X1"] != "null")
            {
                gis_y2 = Convert.ToDouble(HttpContext.Current.Request["GIS_Y2"]);
            }
            string zt = HttpContext.Current.Request["ZT"];
            string afcode = HttpContext.Current.Request["AFCODE"];
            //if (alarm_ID == "null")
            //{
            //    alarm_ID = null;
            //}
            StringBuilder sb = new StringBuilder();
            //分析重复报警
            IList<IList<C3_Alarm>> list = Api.Util.Common.getSamePositionAlarmsByGPS(lineCode, xb, jb, org_code, org_name, org_type, locomotive_code, startTime, endTime, txtqz, start_km, end_km, gis_x1, gis_y1, gis_x2, gis_y2, zt, afcode, range, repeatCount, type);
            sb.Append("[");
            foreach (IList<C3_Alarm> ll in list)
            {/*RAISE_FILE_VI DETECT_DEVICE_CODE  ROUTING_NO STATION_NAME STATION_NO BRG_TUN_NAME*/
                StringBuilder ssb = new StringBuilder();
                ssb.Append("[");
                foreach (C3_Alarm a in ll)
                {
                    ssb.AppendFormat("{{\"ID\":\"{0}\",\"GIS_X\":\"{1}\",\"GIS_Y\":\"{2}\",\"ImgHW\":\"{3}\",\"ImgKJG\":\"{4}\",\"LINE_NAME\":\"{5}\",\"POSITION_NAME\":\"{6}\",\"DIRECTION\":\"{7}\",\"DETAIL\":\"{8}\",\"DETECT_DEVICE_CODE\":\"{9}\",\"RAISED_TIME\":\"{10}\",\"ROUTING_NO\":\"{11}\",\"POLE_NUMBER\":\"{12}\",\"STATION_NAME\":\"{13}\",\"STATION_NO\":\"{14}\",\"KM_MARK\":\"{15}\",\"KM_MARK_NUMBER\":\"{36}\",\"STATUS_NAME\":\"{16}\",\"GT\":\"{17}\",\"CODE_NAME\":\"{18}\",\"TYPE\":\"{19}\",\"BRG_TUN_NAME\":\"{20}\",\"BOW_TYPE\":\"{21}\",\"CODE\":\"{22}\",\"SEVERITY\":\"{23}\",\"WD\":\"{24}\",\"HJWD\":\"{25}\",\"SPEED\":\"{26}\",\"LCZ\":\"{27}\",\"DGZ\":\"{28}\",\"LINE_CODE\":\"{29}\",\"POSITION_CODE\":\"{30}\",\"BRG_TUN_CODE\":\"{31}\",\"GIS_X_O\":\"{32}\",\"GIS_Y_O\":\"{33}\",\"SVALUE15\":\"{34}\",\"CUST_ALARM_CODE\":\"{35}\"}},",
                        a.ID, a.GIS_X, a.GIS_Y, a.RAISE_FILE_IR, a.RAISE_FILE_VI, a.LINE_NAME, a.POSITION_NAME, a.DIRECTION, a.DETAIL, a.DETECT_DEVICE_CODE, a.RAISED_TIME.ToString("yyyy-MM-dd HH:mm:ss"), a.ROUTING_NO, a.POLE_NUMBER, a.STATION_NAME, a.STATION_NO, PublicMethod.KmtoString(a.KM_MARK), a.STATUS_NAME, !string.IsNullOrEmpty(a.DETECT_DEVICE_CODE) ? (a.DETECT_DEVICE_CODE.IndexOf("CRH") > -1 ? "true" : "false") : "false", a.CODE_NAME, type, a.BRG_TUN_NAME, a.BOW_TYPE, a.CODE, a.SEVERITY, myfiter.GetTEMP_MAX(a), myfiter.GetTEMP_ENV(a), myfiter.GetSpeed(a.SPEED), myfiter.GetPULLING_VALUE(a), myfiter.GetLINE_HEIGHT(a), a.LINE_CODE, a.POSITION_CODE, a.BRG_TUN_CODE, a.GIS_X_O, a.GIS_Y_O, a.SVALUE15, a.CUST_ALARM_CODE, (a.KM_MARK >= my_const.MAX_KM || a.KM_MARK <= my_const.MIN_KM ? "" : a.KM_MARK.ToString()));
                }
                sb.Append(ssb.ToString().TrimEnd(','));
                sb.Append("],");
            }
            json = sb.ToString().TrimEnd(',') + "]";

        }
        catch (Exception e)
        {

        }
        finally
        {
            if (json != null)
            {
                //以JSON串格式传到前台
                object myObj = JsonConvert.DeserializeObject(json.ToString());
                HttpContext.Current.Response.Write(myObj);

            }
        }
    }

    private void SaveEd()
    {
        string Linecode = HttpContext.Current.Request["Linecode"]; //线路编码
        string Linename = HttpContext.Current.Request["Linename"]; //线路名称
        string Positioncode = HttpContext.Current.Request["Positioncode"]; //区站编码
        string Positionname = HttpContext.Current.Request["Positionname"]; //区站名称
        string Direction = HttpContext.Current.Request["Direction"]; //行别
        string Brgtuncode = HttpContext.Current.Request["Brgtuncode"]; //桥隧编码
        string Brgtunname = HttpContext.Current.Request["Brgtunname"]; //桥隧名称
        string Polenumber = HttpContext.Current.Request["Polenumber"]; //杆号
        string Kmmark = HttpContext.Current.Request["Kmmark"]; //公里标
        string AlarmId = HttpContext.Current.Request["AlarmId"]; //id
        bool BOOL = false;
        AlarmCond alarm = new AlarmCond();
        AlarmId = AlarmId.Replace(",", "','");
        alarm.businssAnd = " id in('" + AlarmId + "')";
        List<Alarm> lists = Api.ServiceAccessor.GetAlarmService().getAlarm(alarm);
        for (int i = 0; i < lists.Count; i++)
        {
            C3_Alarm c3alarm = Api.ServiceAccessor.GetAlarmService().SConvertToC3_Alarm(lists[i]);
            if (!string.IsNullOrEmpty(Linecode) && Linecode != "0")
            {
                if (lists[i].LINE_CODE != Linecode)
                {
                    lists[i].POS_CONFIRMED = "9";//修改位置信息时可靠度改为9,前后信息不一样才改正
                }
                c3alarm.LINE_CODE = Linecode;
            }
            if (!string.IsNullOrEmpty(Linename) && Linename != "暂无")
            {
                c3alarm.LINE_NAME = Linename;
            }
            if (!string.IsNullOrEmpty(Positioncode) && Positioncode != "0")
            {
                if (lists[i].POSITION_CODE != Positioncode)
                {
                    lists[i].POS_CONFIRMED = "9";//修改位置信息时可靠度改为9,前后信息不一样才改正
                }
                c3alarm.POSITION_CODE = Positioncode;
            }
            if (!string.IsNullOrEmpty(Positionname) && Positionname != "暂无")
            {
                c3alarm.POSITION_NAME = Positionname;
            }
            if (!string.IsNullOrEmpty(Direction) && Direction != "0")
            {
                if (lists[i].DIRECTION != Direction)
                {
                    lists[i].POS_CONFIRMED = "9";//修改位置信息时可靠度改为9,前后信息不一样才改正
                }
                c3alarm.DIRECTION = Direction;
            }
            if (!string.IsNullOrEmpty(Brgtuncode) && Brgtuncode != "0")
            {
                if (lists[i].BRG_TUN_CODE != Brgtuncode)
                {
                    lists[i].POS_CONFIRMED = "9";//修改位置信息时可靠度改为9,前后信息不一样才改正
                }
                c3alarm.BRG_TUN_CODE = Brgtuncode;
            }
            if (!string.IsNullOrEmpty(Brgtunname) && Brgtunname != "暂无")
            {
                c3alarm.BRG_TUN_NAME = Brgtunname;
            }
            if (!string.IsNullOrEmpty(Polenumber))
            {
                if (lists[i].POLE_NUMBER != Polenumber)
                {
                    lists[i].POS_CONFIRMED = "9";//修改位置信息时可靠度改为9,前后信息不一样才改正
                }
                c3alarm.POLE_NUMBER = Polenumber;
            }
            if (!string.IsNullOrEmpty(Kmmark))
            {
                if (lists[i].KM_MARK != int.Parse(Kmmark))
                {
                    lists[i].POS_CONFIRMED = "9";//修改位置信息时可靠度改为9,前后信息不一样才改正
                }
                c3alarm.KM_MARK = int.Parse(Kmmark);
            }
            if (Api.Util.Common.FunEnable("Fun_UpdateFlag") == false)//外部功能
            {
                if (lists[i].POS_CONFIRMED == "9")
                {
                    ADO.ModifyLog.UpdateTableCols(lists[i].ID, "POS", Public.GetUserCode);
                }

            }
            Api.ServiceAccessor.GetAlarmService().InsertAlarmHis(c3alarm.ID);//写入报警历史表
            BOOL = Api.ServiceAccessor.GetAlarmService().updateC3Alarm(c3alarm);
            Api.ServiceAccessor.GetAlarmService().UpdateTransData(c3alarm.ID);

        }
        if (BOOL == true)
        {
            Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "批量编辑", Api.Util.Public.FunNames.报警监控.ToString(), Public.GetLoginIP, "对重复报警组" + AlarmId + "进行了批量编辑", "", true);
        }
        else
        {
            Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "批量编辑", Api.Util.Public.FunNames.报警监控.ToString(), Public.GetLoginIP, "对重复报警组" + AlarmId + "进行了批量编辑", "", false);
        };
        HttpContext.Current.Response.Write(BOOL);
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }
}