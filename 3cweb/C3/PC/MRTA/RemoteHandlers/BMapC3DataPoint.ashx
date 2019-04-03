/*========================================================================================*
* 功能说明：缺陷和报警、及设备信息
* 注意事项：
* 作    者： 邓杰
* 版本日期：2013年10月21日
* 变更说明：
* 版 本 号： V1.0
*=======================================================================================*/
<%@ WebHandler Language="C#" Class="BMapC3DataPoint" %>

using System;
using System.Web;
using System.Text;
using Newtonsoft.Json;
using System.Data;
using Api.Fault.entity.alarm;
using System.Collections.Generic;
using Api.Fault.entity.sms;
using Api.Foundation.entity.Cond;
using System.Configuration;
using System.Collections;
using Api.Foundation.entity.Foundation;
using Api.Task.entity;
using System.Linq;

public class BMapC3DataPoint : ReferenceClass, IHttpHandler
{
    /// <summary>
    /// 设备和缺陷
    /// </summary>
    /// <param name="context"></param>
    public void ProcessRequest(HttpContext context)
    {
        try
        {
            String type = context.Request.QueryString["type"].ToString();
            switch (type)
            {
                case "1"://获取设备
                    String mislineid = context.Request.QueryString["mislineid"].ToString();
                    getMapC3DataPoint(mislineid, context);
                    break;
                case "2": //获取缺陷
                    String LineCode = context.Request.QueryString["LineCode"];//线路编码
                    String deviceid = context.Request.QueryString["deviceid"].ToString();//车号
                    String LeNum = context.Request.QueryString["LeNum"].ToString();//类型 1.第一个GIS的缺陷、2.设备轨迹中的缺陷、3.缺陷GIS查询
                    String startTime = context.Request.QueryString["startTime"].ToString();//开始时间
                    String endTime = context.Request.QueryString["endTime"].ToString();//结束时间

                    getMapC3AlarmDataPoint(context, LineCode, deviceid, LeNum, startTime, endTime);
                    break;
                case "3"://获取报警最近的区站和与区站的距离
                    double distance;
                    double lon = double.Parse(context.Request.QueryString["lon"].ToString());
                    double lat = double.Parse(context.Request.QueryString["lat"].ToString());
                    string bureauCode = context.Request.QueryString["bureauCode"].ToString();
                    if (bureauCode == "null")
                    {
                        bureauCode = null;
                    }
                    string posCode = Api.Util.PositionConverter.getStationInfoByGPS(lon, lat, out distance, bureauCode);
                    Api.Util.Common.getStationSectionInfo(posCode);
                    StringBuilder Json = new StringBuilder();
                    Json.Append("{");
                    Json.Append("posCode:\"" + posCode + "\",");
                    Json.Append("distance:\"" + distance + "\",");
                    Json.Append("}");
                    context.Response.Write(Json.ToString());
                    break;
                case "4": //在线实时监测获取缺陷、效率优化
                    String lineCode = context.Request.QueryString["LineCode"];//线路编码
                    String Deviceid = context.Request.QueryString["deviceid"].ToString();//车号
                    String leNum = context.Request.QueryString["LeNum"].ToString();//类型 1.第一个GIS的缺陷、2.设备轨迹中的缺陷、3.缺陷GIS查询
                    String StartTime = context.Request.QueryString["startTime"].ToString();//开始时间
                    String EndTime = context.Request.QueryString["endTime"].ToString();//结束时间

                    getC3AlarmDataPoint(context, lineCode, Deviceid, leNum, StartTime, EndTime);
                    break;
            }
        }
        catch (Exception ex)
        {
            log4net.ILog log2 = log4net.LogManager.GetLogger("3C地图数据加载");
            log2.Error("Error", ex);
        }
    }
    /// <summary>
    /// 获取C3设备最新坐标点数据
    /// </summary>
    /// <param name="mislineid">线路CODE</param>
    /// <param name="context"></param>
    private void getMapC3DataPoint(string mislineid, HttpContext context)
    {
        String OrgCode = context.Request.QueryString["OrgCode"];//
        String OrgType = context.Request.QueryString["OrgType"];//
        String LocaType = context.Request.QueryString["LocaType"];//
        string key = HttpContext.Current.Request["key"].ToUpper();

        String order = context.Request.QueryString["order"];//
        if (!string.IsNullOrEmpty(order))
        {
            if (order.Equals("0"))
                order = " order by locomotive_code";
            if (order.Equals("1"))
                //asc 按升序排列 (默认)
                //desc 按降序排列 
                //@addby bro.hon
                order = " order by detect_time desc";
            if (order.Equals("2"))
                order = " order by detect_time asc";
        }
        else
        {
            order = "";
        }

        DataTable dt = my_sms.GetSMS_new(LocaType, OrgCode, mislineid, key, 30, order).Tables[0];
        string Json = my_sms.GetC3_SMS_Json_new(dt);



        string remove = HttpContext.Current.Request["remove"];
        if (remove == "1")//@addby bro.hon
        {
            string re = myfiter.json_RemoveSpecialStr_N(Json);

            re = myfiter.RemoveHTML(re, 0);
            context.Response.Write(Newtonsoft.Json.JsonConvert.DeserializeObject(re));
        }
        else
        {
            object myObj = JsonConvert.DeserializeObject(Json);
            context.Response.Write(myObj);
        }


    }


    /// <summary>
    /// 获取C3设备报警点数据
    /// </summary>
    /// <param name="context"></param>
    private void getMapC3AlarmDataPoint(HttpContext context, String LineCode, String deviceid, string Lenum, string startTime, string endTime)
    {
        C3_AlarmCond alarmcond = new C3_AlarmCond();
        if (Lenum == "2")
        {
            //轨迹类的缺陷。

            if (startTime != "")
            {
                alarmcond.startTime = Convert.ToDateTime(startTime);
                alarmcond.endTime = Convert.ToDateTime(endTime);
            }
            else
            {
                C3_SmsCond c3Smscond = new C3_SmsCond();
                c3Smscond.LOCOMOTIVE_CODE = deviceid;
                c3Smscond.orderBy = " detect_time desc";
                c3Smscond.page = 1;
                c3Smscond.pageSize = 1;

                List<C3_Sms> listc3sms = Api.ServiceAccessor.GetSmsService().getC3SmsbyCondition(c3Smscond);
                if (listc3sms.Count > 0)
                {
                    //设备轨迹缺陷查询
                    alarmcond.startTime = listc3sms[0].DETECT_TIME.AddHours(-3);
                    alarmcond.endTime = listc3sms[0].DETECT_TIME;
                    alarmcond.page = 1;
                    alarmcond.pageSize = 50;
                    alarmcond.businssAnd = "  status <> 'AFSTATUS02'";
                }
            }
        }
        else if (Lenum == "1")
        {
            //最近多少条报警，没传时间，在线实时监控，            
            //GIS缺陷查询
            if (!string.IsNullOrEmpty(LineCode))
            {
                alarmcond.LINE_CODE = LineCode;
            }

            string Org = HttpContext.Current.Request["Org"];
            string OrgType = HttpContext.Current.Request["OrgType"];
            string LocaTpye = HttpContext.Current.Request["LocaTpye"];

            if (HttpContext.Current.Request["severity"] != null && HttpContext.Current.Request["severity"].ToString() != "")
            {
                alarmcond.SEVERITY = HttpContext.Current.Request["severity"].ToString();
            }

            if (HttpContext.Current.Request["status"] != null && HttpContext.Current.Request["status"].ToString() != "")
            {
                alarmcond.STATUS = HttpContext.Current.Request["status"].ToString();
            }

            string firstLoad = HttpContext.Current.Request["firstLoad"];

            if (firstLoad != null && firstLoad.ToUpper() == "TRUE")
            {
                // 排除已取消的。
                alarmcond.businssAnd = "status !='AFSTATUS02'";

            }
            else
            {
                ///获取更新列表，不排除/
                alarmcond.businssAnd = "1=1 ";

            }

            if (!string.IsNullOrEmpty(Org) && Org!="TOPBOSS")
            {
                string whereadd = Api.Util.UserPermissionc.GetUser_PermissionWhereStr_orgCode_p_orgCode(Org,null);

                if (!string.IsNullOrEmpty(whereadd))
                {
                    alarmcond.businssAnd += " and (" + whereadd + ")";
                }
            }
            //switch (OrgType.ToUpper())
            //{
            //    case Api.Foundation.entity.Foundation.LocoType.JU:
            //        alarmcond.BUREAU_CODE = Org;
            //        break;
            //    case Api.Foundation.entity.Foundation.LocoType.GDD:
            //        alarmcond.POWER_SECTION_CODE = Org;
            //        break;
            //    case Api.Foundation.entity.Foundation.LocoType.JWD:
            //    case Api.Foundation.entity.Foundation.LocoType.CLD:
            //        alarmcond.P_ORG_CODE = Org;
            //        break;
            //    default:
            //        break;
            //}


            if (!string.IsNullOrEmpty(LocaTpye))
            {
                alarmcond.businssAnd += " and GetLocaType(detect_device_code)=" + LocaTpye;

            }

            if (startTime != "" && startTime != "undefined")
            {
                alarmcond.orderBy = " raised_time asc";
                alarmcond.businssAnd += string.Format(" and raised_time >=sysdate-" + (double.Parse(Api.Util.Common.ParamterDic["AlarmTime"].VALUE) / 24) + " and (raised_time > to_date('{0}','yyyy-MM-dd hh24:mi:ss') or status_time> to_date('{0}','yyyy-MM-dd hh24:mi:ss'))", startTime);
                //alarmcond.startTime = Convert.ToDateTime(startTime);
                //alarmcond.endTime = DateTime.Now;
                alarmcond.page = 1;
                alarmcond.pageSize = Int32.Parse(Api.Util.Common.ParamterDic["AlarmCount"].VALUE);//Int32.Parse(ConfigurationManager.AppSettings["AlarmCount"]);
            }
            else
            {
                alarmcond.orderBy = " raised_time desc";
                alarmcond.businssAnd += " and raised_time >=(select max(t4.raised_time)-" + (double.Parse(Api.Util.Common.ParamterDic["AlarmTime"].VALUE) / 24) + " from alarm t4  where category_code='3C' and status !='AFSTATUS02' and raised_time<= sysdate )";//最大日期(小于当天)，减2天以内，类型为3C的报警数据。  排除状态为已取消的， 
                alarmcond.page = 1;
                alarmcond.pageSize = Int32.Parse(Api.Util.Common.ParamterDic["AlarmCount"].VALUE);//Int32.Parse(ConfigurationManager.AppSettings["AlarmCount"]);
            }
        }
        else
        {
            #region 缺陷GIS条件查询  C3中无用。

            if (startTime != "")
            {

                string where = "";
                string id = HttpContext.Current.Request["id"];//id
                string ju = HttpContext.Current.Request["ju"];//ju
                string duan = HttpContext.Current.Request["duan"];//段
                string chejian = HttpContext.Current.Request["chejian"];//车间
                string gongqu = HttpContext.Current.Request["gongqu"];//工区
                string line = HttpContext.Current.Request["line"];//线路
                string xb = HttpContext.Current.Request["xb"];//行别
                string txtqz = HttpContext.Current.Request["txtqz"];//区站
                string startkm = HttpContext.Current.Request["txtstartkm"];//起始公里标
                string endkm = HttpContext.Current.Request["txtendkm"];//结束公里标

                string ddllx = HttpContext.Current.Request["ddllx"];//数据类型

                //   ddllx = PublicMethod.CateGoryChangeCInt_ForAlarm(ddllx);//将1C转为C1,2C转为C2

                string dllzt = HttpContext.Current.Request["dllzt"];//数据状态
                string txtpole = HttpContext.Current.Request["txtpole"];//支柱
                //条件
                string jibie = HttpContext.Current.Request["jibie"];//jibie
                string zhuangtai = HttpContext.Current.Request["zhuangtai"]; //报警类型

                string Harddisk_Manage_ID = HttpContext.Current.Request["Harddisk_Manage_ID"];
                string summary = HttpContext.Current.Request["summary"];
                string severity = HttpContext.Current.Request["severity"];


                string data_type = "ALARM";

                if (HttpContext.Current.Request["data_type"] != null)
                {
                    data_type = HttpContext.Current.Request["data_type"];
                }


                alarmcond.businssAnd = "1=1";

                if (!string.IsNullOrEmpty(Harddisk_Manage_ID))
                {
                    alarmcond.HARDDISK_MANAGE_ID = Harddisk_Manage_ID;
                }

                if (!string.IsNullOrEmpty(summary))
                {
                    alarmcond.businssAnd += " and summary like '%" + summary + "%'";
                }

                if (!string.IsNullOrEmpty(severity))
                {
                    alarmcond.SEVERITY = severity;
                }


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
                            alarmcond.CODE = syslist[0].DIC_CODE;
                        }
                        else
                        {
                            SysDictionaryCond syscond1 = new SysDictionaryCond();
                            syscond1.P_CODE = syslist[0].DIC_CODE;
                            IList<SysDictionary> syslist1 = Api.ServiceAccessor.GetFoundationService().querySysDictionary(syscond1);
                            string diccode = "";
                            diccode += syslist[0].DIC_CODE;
                            if (syslist1.Count > 0)
                            {
                                for (int i = 0, count = syslist1.Count; i < count; i++)
                                {
                                    diccode += syslist1[i].DIC_CODE + ",";
                                }
                            }
                            alarmcond.CODE = diccode;
                        }
                    }
                }

                if (jibie != null && jibie != "全部" && jibie != "")
                {
                    alarmcond.SEVERITY = jibie;
                }
                if (HttpContext.Current.Request["DeviceCode"] != null)
                {
                    alarmcond.POLE_NUMBER = HttpContext.Current.Request["DeviceCode"] + "#";
                }
                try { alarmcond.startKm = int.Parse(System.Text.RegularExpressions.Regex.Replace(startkm, @"\D", "")); }
                catch { }
                try { alarmcond.endKm = int.Parse(System.Text.RegularExpressions.Regex.Replace(endkm, @"\D", "")); }
                catch { }

                //source
                if (id != null && id != "")
                {
                    alarmcond.ID = id;
                }
                if (ju != null && ju != "0")
                {
                    alarmcond.BUREAU_CODE = ju;
                }
                if (duan != null && duan != "0")
                {
                    alarmcond.POWER_SECTION_CODE = duan;
                }
                if (chejian != null && chejian != "0")
                {
                    alarmcond.WORKSHOP_CODE = chejian;
                }
                if (gongqu != null && gongqu != "0")
                {
                    alarmcond.ORG_CODE = gongqu;
                }
                if (line != null && line != "0")
                {
                    alarmcond.LINE_CODE = line;
                }
                if (txtqz != null && txtqz != "")
                {
                    string linecode = "";
                    if (line != null && line != "0")
                    {
                        linecode = line;
                    }
                    ArrayList statList = new ArrayList();
                    IList<StationSection> secttionlist = Api.ServiceAccessor.GetFoundationService().wildcardQueryStationSection(linecode, txtqz);
                    if (secttionlist.Count > 0)
                    {
                        foreach (StationSection ss in secttionlist)
                        {
                            statList.Add(ss.POSITION_CODE);
                        }
                        alarmcond.positionList = statList;
                    }
                    else
                    {
                        alarmcond.businssAnd = "1=2";
                    }

                }
                if (xb != null && xb != "0")
                {
                    alarmcond.DIRECTION = xb;
                }
                if (startkm != null && startkm != "")
                {
                    alarmcond.KM_MARK = int.Parse(startkm);
                }

                alarmcond.CATEGORY_CODE = PublicMethod.GetCurrentC(ddllx);


                try
                {
                    DateTime startdate = DateTime.Parse(HttpContext.Current.Request["startTime"]);
                    alarmcond.startTime = startdate;
                }
                catch { }

                try
                {
                    DateTime enddate = DateTime.Parse(HttpContext.Current.Request["endTime"]);
                    alarmcond.endTime = enddate;
                }
                catch { }
                if (txtpole != null && txtpole != "")
                {
                    alarmcond.businssAnd += " and POLE_NUMBER ='" + txtpole + "'";
                    // alarmcond.POLE_NUMBER = txtpole;
                }
                if (dllzt != null && dllzt != "0")
                {
                    alarmcond.STATUS = dllzt;
                }
                if (deviceid != null && deviceid != "")
                {
                    alarmcond.DEVICE_ID = deviceid;
                    alarmcond.STATUS = "AFSTATUS01";
                }

                if (data_type == "ALARM")
                {
                    alarmcond.businssAnd += " and DATA_TYPE !='EVENT'";
                }
                else
                {
                    alarmcond.businssAnd += " and DATA_TYPE ='FAULT'";
                }

                alarmcond.orderBy = " RAISED_TIME DESC";

            }
            else
            {
                alarmcond.startTime = DateTime.Now.AddDays(Int32.Parse(ConfigurationManager.AppSettings["FaultTimePeriod"]));
                alarmcond.endTime = DateTime.Now;
                alarmcond.page = 1;
                alarmcond.pageSize = Int32.Parse(ConfigurationManager.AppSettings["FaultCount"]);
                if (alarmcond.businssAnd != "" && alarmcond.businssAnd != null)
                {
                    alarmcond.businssAnd += " and ";
                }
                alarmcond.businssAnd += " status <> 'AFSTATUS05'  and status <> 'AFSTATUS02' ";//状态
            }
            if (alarmcond.DATA_TYPE != "" && alarmcond.DATA_TYPE != null)
            {

            }
            else
            {
                if (deviceid == "6CAlarmTopo")
                {
                    deviceid = "";
                }
            }


            #endregion
        }



        if (context.Request["Category_Code"] != "DPC")
            alarmcond.CATEGORY_CODE = context.Request["Category_Code"];
        //alarmcond.orderBy = " Raised_Time desc";
        string value = Api.Util.Common.ParamterDic["For6C"].VALUE;// System.Configuration.ConfigurationManager.AppSettings["For6C"];
        alarmcond.page = 1;
        alarmcond.pageSize = 0;//Int32.Parse(Api.Util.Common.ParamterDic["AlarmCount"].VALUE); // Convert.ToInt32(System.Configuration.ConfigurationManager.AppSettings["AlarmCount"]);
        if (deviceid != "" && deviceid != null)
            alarmcond.DETECT_DEVICE_CODE = deviceid;
        if (alarmcond.businssAnd != null)
        {
            alarmcond.businssAnd += " and ";

        }
        alarmcond.businssAnd += " GIS_X_O !=0 ";


        List<C3_Alarm> alarmlist = new List<C3_Alarm>();
        alarmlist = Api.ServiceAccessor.GetAlarmService().getC3Alarm(alarmcond);

        StringBuilder Json = new StringBuilder();

        if (alarmlist != null && alarmlist.Count > 0)
        {

            DateTime raised_time = alarmlist.Max(m => m.RAISED_TIME);//取最近发生时间
            DateTime status_time = alarmlist.Max(m => m.STATUS_TIME);//取最近状态时间

            string last_time = DateTime.Compare(raised_time, status_time) > 0 ? raised_time.ToString("yyyy-MM-dd HH:mm:ss") : status_time.ToString("yyyy-MM-dd HH:mm:ss");

            List<C3_Alarm> alarmlist_waitUpdate = new List<C3_Alarm>();


            string MinServerTime = DateTime.Now.AddDays(-(Int32.Parse(Api.Util.Common.ParamterDic["AlarmTime"].VALUE) / 24)).ToString("yyyy-MM-dd HH:mm:ss");
            Json.AppendFormat("{{last_time:\"{0}\",MinServerTime:\"{1}\",json:[", last_time, MinServerTime);


            for (int i = 0; i < alarmlist.Count; i++)
            {
                string lineName = alarmlist[i].LINE_NAME;
                if (!string.IsNullOrEmpty(lineName))
                {
                    lineName = lineName + "&nbsp;";
                }
                //string wz = lineName + PublicMethod.GetWZbyAlarm(alarmlist[i]);
                string wz = PublicMethod.GetPosition_Alarm(alarmlist[i].LINE_NAME, alarmlist[i].POSITION_NAME, alarmlist[i].BRG_TUN_NAME, alarmlist[i].DIRECTION, alarmlist[i].KM_MARK, alarmlist[i].POLE_NUMBER, alarmlist[i].DEVICE_ID, alarmlist[i].ROUTING_NO, alarmlist[i].AREA_NO, alarmlist[i].STATION_NO, alarmlist[i].STATION_NAME, alarmlist[i].TAX_MONITOR_STATUS);
                string Summary = PublicMethod.GetSummaryByAlarm(alarmlist[i]).Replace("车号" + alarmlist[i].DETECT_DEVICE_CODE + "&nbsp;", "");

                string taskId = alarmlist[i].TASK_ID;
                string taskName = "";
                if (!string.IsNullOrEmpty(taskId))
                {
                    MisTask misTask = Api.ServiceAccessor.GetTaskService().getSendMisTask(taskId);
                    if (misTask != null && misTask.STATUS != null)
                        taskName = "处理状态：" + misTask.STATUS + "<br/>处理结果：" + misTask.DEAL_RESULT;
                }

                if (alarmlist[i].GIS_X == 0)
                {
                    string bPoint = CoordinateConvert.convert2B(alarmlist[i].GIS_X_O.ToString(), alarmlist[i].GIS_Y_O.ToString());
                    if (bPoint != null)
                    {
                        if (bPoint.Split(',')[0] != "0" && bPoint.Split(',')[0] != "")
                        {

                            alarmlist[i].GIS_X = Convert.ToDouble(bPoint.Split(',')[0]);
                            alarmlist[i].GIS_Y = Convert.ToDouble(bPoint.Split(',')[1]);

                            alarmlist_waitUpdate.Add(alarmlist[i]);

                        }
                    }
                }
                Json.Append("{");
                Json.Append("GIS_X:\"" + alarmlist[i].GIS_X + "\",");
                Json.Append("GIS_Y:\"" + alarmlist[i].GIS_Y + "\",");
                Json.Append("GIS_X_O:\"" + alarmlist[i].GIS_X_O + "\",");
                Json.Append("GIS_Y_O:\"" + alarmlist[i].GIS_Y_O + "\",");
                Json.Append("RAISED_TIME:\"" + alarmlist[i].RAISED_TIME + "\",");
                Json.Append("STATUS_TIME:\"" + alarmlist[i].STATUS_TIME + "\",");
                Json.Append("SEVERITY:\"" + alarmlist[i].SEVERITY + "\",");
                Json.Append("SEVERITY_Code:\"" + alarmlist[i].MY_STR_8 + "\",");
                Json.Append("ALARM_ID:\"" + alarmlist[i].ID + "\",");
                Json.Append("BUREAU_CODE:\"" + alarmlist[i].BUREAU_CODE + "\",");
                Json.Append("POLE_NUMBER:\"" + alarmlist[i].POLE_NUMBER + "\",");
                Json.Append("POSITION_NAME:\"" + alarmlist[i].POSITION_NAME + "\",");
                Json.Append("BRG_TUN_NAME:\"" + alarmlist[i].BRG_TUN_NAME + "\",");
                Json.Append("CATEGORY_CODE:\"" + alarmlist[i].CATEGORY_CODE + "\",");
                Json.Append("DETECT_DEVICE_CODE:\"" + alarmlist[i].DETECT_DEVICE_CODE + "\",");
                Json.Append("LINE_NAME:\"" + alarmlist[i].LINE_NAME + "\",");
                Json.Append("DIRECTION:\"" + alarmlist[i].DIRECTION + "\",");
                Json.Append("CODE_NAME:\"" + alarmlist[i].STATUS_NAME + "\",");
                Json.Append("STATUS:\"" + alarmlist[i].STATUS + "\",");
                Json.Append("SATELLITE_NUM:\"" + alarmlist[i].SATELLITE_NUM + "\",");
                Json.Append("Summary:\"" + Summary + "\",");
                Json.Append("wz:\"" + wz + "\",");
                Json.Append("taskName:\"" + taskName + "\",");
                Json.Append("KM_MARK:\"" + alarmlist[i].KM_MARK + "\"");
                if (i < alarmlist.Count - 1)
                {
                    Json.Append("},");
                }
                else
                {
                    Json.Append("}");
                }
            }

            //更新GPS
            Alarm_Original.UpdateGPS(alarmlist_waitUpdate);


        }
        else
        {
            //alarmlist为空时，直接返回空json数组
            Json.AppendFormat("{{last_time:\"{0}\",MinServerTime:\"{1}\",json:[", "", "");
        }

        Json.Append("]");
        Json.Append("}");
        object myObj = JsonConvert.DeserializeObject(myfiter.json_RemoveSpecialStr(Json.ToString()));
        context.Response.Write(myObj);

    }
    /// <summary>
    /// 获取C3设备报警点数据、效率优化
    /// </summary>
    /// <param name="context"></param>
    private void getC3AlarmDataPoint(HttpContext context, String LineCode, String deviceid, string Lenum, string startTime, string endTime)
    {
        C3_AlarmCond alarmcond = new C3_AlarmCond();
        if (Lenum == "2")
        {
            //轨迹类的缺陷。

            if (startTime != "")
            {
                alarmcond.startTime = Convert.ToDateTime(startTime);
                alarmcond.endTime = Convert.ToDateTime(endTime);
            }
            else
            {
                C3_SmsCond c3Smscond = new C3_SmsCond();
                c3Smscond.LOCOMOTIVE_CODE = deviceid;
                c3Smscond.orderBy = " detect_time desc";
                c3Smscond.page = 1;
                c3Smscond.pageSize = 1;

                List<C3_Sms> listc3sms = Api.ServiceAccessor.GetSmsService().getC3SmsbyCondition(c3Smscond);
                if (listc3sms.Count > 0)
                {
                    //设备轨迹缺陷查询
                    alarmcond.startTime = listc3sms[0].DETECT_TIME.AddHours(-3);
                    alarmcond.endTime = listc3sms[0].DETECT_TIME;
                    alarmcond.page = 1;
                    alarmcond.pageSize = 50;
                    alarmcond.businssAnd = "  status <> 'AFSTATUS02'";
                }
            }
        }
        else if (Lenum == "1")
        {
            //最近多少条报警，没传时间，在线实时监控，            
            //GIS缺陷查询
            if (!string.IsNullOrEmpty(LineCode))
            {
                alarmcond.LINE_CODE = LineCode;
            }

            string Org = HttpContext.Current.Request["Org"];
            string OrgType = HttpContext.Current.Request["OrgType"];
            string LocaTpye = HttpContext.Current.Request["LocaTpye"];

            if (HttpContext.Current.Request["severity"] != null && HttpContext.Current.Request["severity"].ToString() != "")
            {
                alarmcond.SEVERITY = HttpContext.Current.Request["severity"].ToString();
            }

            if (HttpContext.Current.Request["status"] != null && HttpContext.Current.Request["status"].ToString() != "")
            {
                alarmcond.STATUS = HttpContext.Current.Request["status"].ToString();
            }

            string firstLoad = HttpContext.Current.Request["firstLoad"];

            if (firstLoad != null && firstLoad.ToUpper() == "TRUE")
            {
                // 排除已取消的。
                alarmcond.businssAnd = "status !='AFSTATUS02'";

            }
            else
            {
                ///获取更新列表，不排除/
                alarmcond.businssAnd = "1=1 ";

            }

            if (!string.IsNullOrEmpty(Org) && Org!="TOPBOSS")
            {
                string whereadd = Api.Util.UserPermissionc.GetUser_PermissionWhereStr_orgCode_p_orgCode(Org,null);

                if (!string.IsNullOrEmpty(whereadd))
                {
                    alarmcond.businssAnd += " and (" + whereadd + ")";
                }
            }
            //switch (OrgType.ToUpper())
            //{
            //    case Api.Foundation.entity.Foundation.LocoType.JU:
            //        alarmcond.BUREAU_CODE = Org;
            //        break;
            //    case Api.Foundation.entity.Foundation.LocoType.GDD:
            //        alarmcond.POWER_SECTION_CODE = Org;
            //        break;
            //    case Api.Foundation.entity.Foundation.LocoType.JWD:
            //    case Api.Foundation.entity.Foundation.LocoType.CLD:
            //        alarmcond.P_ORG_CODE = Org;
            //        break;
            //    default:
            //        break;
            //}


            if (!string.IsNullOrEmpty(LocaTpye))
            {
                alarmcond.businssAnd += " and GetLocaType(detect_device_code)=" + LocaTpye;

            }

            if (startTime != "" && startTime != "undefined")
            {
                alarmcond.orderBy = " raised_time asc";
                alarmcond.businssAnd += string.Format(" and raised_time >=sysdate-" + (double.Parse(Api.Util.Common.ParamterDic["AlarmTime"].VALUE) / 24) + " and (raised_time > to_date('{0}','yyyy-MM-dd hh24:mi:ss') or status_time> to_date('{0}','yyyy-MM-dd hh24:mi:ss'))", startTime);
                //alarmcond.startTime = Convert.ToDateTime(startTime);
                //alarmcond.endTime = DateTime.Now;
                alarmcond.page = 1;
                alarmcond.pageSize = Int32.Parse(Api.Util.Common.ParamterDic["AlarmCount"].VALUE);//Int32.Parse(ConfigurationManager.AppSettings["AlarmCount"]);
            }
            else
            {
                alarmcond.orderBy = " raised_time desc";
                string powerStr = Api.Util.UserPermissionc.GetUser_PermissionWhereStr_orgCode_p_orgCode();
                if (!string.IsNullOrEmpty(powerStr))
                {
                    powerStr = " and ( " +powerStr +")";
                }

                alarmcond.businssAnd += " and raised_time >=(select max(t4.raised_time)-" + (double.Parse(Api.Util.Common.ParamterDic["AlarmTime"].VALUE) / 24) + " from alarm t4  where category_code='3C' and status !='AFSTATUS02' and raised_time<= sysdate AND raised_time>=SYSDATE-7  "+powerStr+" )";//最大日期(小于当天)，减2天以内，类型为3C的报警数据。  排除状态为已取消的， 
                                                                                                                                                                                                                                                                                                            //alarmcond.businssAnd += " AND RAISED_TIME >=SYSDATE-6/24";
                alarmcond.page = 1;
                alarmcond.pageSize = Int32.Parse(Api.Util.Common.ParamterDic["AlarmCount"].VALUE);//Int32.Parse(ConfigurationManager.AppSettings["AlarmCount"]);
            }
        }
        else
        {
            #region 缺陷GIS条件查询  C3中无用。

            if (startTime != "")
            {

                string where = "";
                string id = HttpContext.Current.Request["id"];//id
                string ju = HttpContext.Current.Request["ju"];//ju
                string duan = HttpContext.Current.Request["duan"];//段
                string chejian = HttpContext.Current.Request["chejian"];//车间
                string gongqu = HttpContext.Current.Request["gongqu"];//工区
                string line = HttpContext.Current.Request["line"];//线路
                string xb = HttpContext.Current.Request["xb"];//行别
                string txtqz = HttpContext.Current.Request["txtqz"];//区站
                string startkm = HttpContext.Current.Request["txtstartkm"];//起始公里标
                string endkm = HttpContext.Current.Request["txtendkm"];//结束公里标

                string ddllx = HttpContext.Current.Request["ddllx"];//数据类型

                //   ddllx = PublicMethod.CateGoryChangeCInt_ForAlarm(ddllx);//将1C转为C1,2C转为C2

                string dllzt = HttpContext.Current.Request["dllzt"];//数据状态
                string txtpole = HttpContext.Current.Request["txtpole"];//支柱
                //条件
                string jibie = HttpContext.Current.Request["jibie"];//jibie
                string zhuangtai = HttpContext.Current.Request["zhuangtai"]; //报警类型

                string Harddisk_Manage_ID = HttpContext.Current.Request["Harddisk_Manage_ID"];
                string summary = HttpContext.Current.Request["summary"];
                string severity = HttpContext.Current.Request["severity"];


                string data_type = "ALARM";

                if (HttpContext.Current.Request["data_type"] != null)
                {
                    data_type = HttpContext.Current.Request["data_type"];
                }


                alarmcond.businssAnd = "1=1";

                if (!string.IsNullOrEmpty(Harddisk_Manage_ID))
                {
                    alarmcond.HARDDISK_MANAGE_ID = Harddisk_Manage_ID;
                }

                if (!string.IsNullOrEmpty(summary))
                {
                    alarmcond.businssAnd += " and summary like '%" + summary + "%'";
                }

                if (!string.IsNullOrEmpty(severity))
                {
                    alarmcond.SEVERITY = severity;
                }


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
                            alarmcond.CODE = syslist[0].DIC_CODE;
                        }
                        else
                        {
                            SysDictionaryCond syscond1 = new SysDictionaryCond();
                            syscond1.P_CODE = syslist[0].DIC_CODE;
                            IList<SysDictionary> syslist1 = Api.ServiceAccessor.GetFoundationService().querySysDictionary(syscond1);
                            string diccode = "";
                            diccode += syslist[0].DIC_CODE;
                            if (syslist1.Count > 0)
                            {
                                for (int i = 0, count = syslist1.Count; i < count; i++)
                                {
                                    diccode += syslist1[i].DIC_CODE + ",";
                                }
                            }
                            alarmcond.CODE = diccode;
                        }
                    }
                }

                if (jibie != null && jibie != "全部" && jibie != "")
                {
                    alarmcond.SEVERITY = jibie;
                }
                if (HttpContext.Current.Request["DeviceCode"] != null)
                {
                    alarmcond.POLE_NUMBER = HttpContext.Current.Request["DeviceCode"] + "#";
                }
                try { alarmcond.startKm = int.Parse(System.Text.RegularExpressions.Regex.Replace(startkm, @"\D", "")); }
                catch { }
                try { alarmcond.endKm = int.Parse(System.Text.RegularExpressions.Regex.Replace(endkm, @"\D", "")); }
                catch { }

                //source
                if (id != null && id != "")
                {
                    alarmcond.ID = id;
                }
                if (ju != null && ju != "0")
                {
                    alarmcond.BUREAU_CODE = ju;
                }
                if (duan != null && duan != "0")
                {
                    alarmcond.POWER_SECTION_CODE = duan;
                }
                if (chejian != null && chejian != "0")
                {
                    alarmcond.WORKSHOP_CODE = chejian;
                }
                if (gongqu != null && gongqu != "0")
                {
                    alarmcond.ORG_CODE = gongqu;
                }
                if (line != null && line != "0")
                {
                    alarmcond.LINE_CODE = line;
                }
                if (txtqz != null && txtqz != "")
                {
                    string linecode = "";
                    if (line != null && line != "0")
                    {
                        linecode = line;
                    }
                    ArrayList statList = new ArrayList();
                    IList<StationSection> secttionlist = Api.ServiceAccessor.GetFoundationService().wildcardQueryStationSection(linecode, txtqz);
                    if (secttionlist.Count > 0)
                    {
                        foreach (StationSection ss in secttionlist)
                        {
                            statList.Add(ss.POSITION_CODE);
                        }
                        alarmcond.positionList = statList;
                    }
                    else
                    {
                        alarmcond.businssAnd = "1=2";
                    }

                }
                if (xb != null && xb != "0")
                {
                    alarmcond.DIRECTION = xb;
                }
                if (startkm != null && startkm != "")
                {
                    alarmcond.KM_MARK = int.Parse(startkm);
                }

                alarmcond.CATEGORY_CODE = PublicMethod.GetCurrentC(ddllx);


                try
                {
                    DateTime startdate = DateTime.Parse(HttpContext.Current.Request["startTime"]);
                    alarmcond.startTime = startdate;
                }
                catch { }

                try
                {
                    DateTime enddate = DateTime.Parse(HttpContext.Current.Request["endTime"]);
                    alarmcond.endTime = enddate;
                }
                catch { }
                if (txtpole != null && txtpole != "")
                {
                    alarmcond.businssAnd += " and POLE_NUMBER ='" + txtpole + "'";
                    // alarmcond.POLE_NUMBER = txtpole;
                }
                if (dllzt != null && dllzt != "0")
                {
                    alarmcond.STATUS = dllzt;
                }
                if (deviceid != null && deviceid != "")
                {
                    alarmcond.DEVICE_ID = deviceid;
                    alarmcond.STATUS = "AFSTATUS01";
                }

                if (data_type == "ALARM")
                {
                    alarmcond.businssAnd += " and DATA_TYPE !='EVENT'";
                }
                else
                {
                    alarmcond.businssAnd += " and DATA_TYPE ='FAULT'";
                }

                alarmcond.orderBy = " RAISED_TIME DESC";

            }
            else
            {
                alarmcond.startTime = DateTime.Now.AddDays(Int32.Parse(ConfigurationManager.AppSettings["FaultTimePeriod"]));
                alarmcond.endTime = DateTime.Now;
                alarmcond.page = 1;
                alarmcond.pageSize = Int32.Parse(ConfigurationManager.AppSettings["FaultCount"]);
                if (alarmcond.businssAnd != "" && alarmcond.businssAnd != null)
                {
                    alarmcond.businssAnd += " and ";
                }
                alarmcond.businssAnd += " status <> 'AFSTATUS05'  and status <> 'AFSTATUS02' ";//状态
            }
            if (alarmcond.DATA_TYPE != "" && alarmcond.DATA_TYPE != null)
            {

            }
            else
            {
                if (deviceid == "6CAlarmTopo")
                {
                    deviceid = "";
                }
            }


            #endregion
        }



        if (context.Request["Category_Code"] != "DPC")
            alarmcond.CATEGORY_CODE = context.Request["Category_Code"];
        //alarmcond.orderBy = " Raised_Time desc";
        string value = Api.Util.Common.ParamterDic["For6C"].VALUE;// System.Configuration.ConfigurationManager.AppSettings["For6C"];
        alarmcond.page = 1;
        alarmcond.pageSize = 0;//Int32.Parse(Api.Util.Common.ParamterDic["AlarmCount"].VALUE); // Convert.ToInt32(System.Configuration.ConfigurationManager.AppSettings["AlarmCount"]);
        if (deviceid != "" && deviceid != null)
            alarmcond.DETECT_DEVICE_CODE = deviceid;
        if (alarmcond.businssAnd != null)
        {
            alarmcond.businssAnd += " and ";

        }
        alarmcond.businssAnd += " GIS_X_O !=0 ";


        List<Alarm> alarmlist = new List<Alarm>();
        alarmlist = Api.ServiceAccessor.GetAlarmService().GetRealTimeAlarm(alarmcond);
        List<CoordinateConvert.Point2> newlist = new List<CoordinateConvert.Point2>();
        newlist = GPSTranAndUpdate_list(alarmlist, "GIS_X","GIS_Y","ID","ALARM");
        int t = 0;

        StringBuilder Json = new StringBuilder();

        if (alarmlist != null && alarmlist.Count > 0)
        {

            DateTime raised_time = alarmlist.Max(m => m.RAISED_TIME);//取最近发生时间
            DateTime status_time = alarmlist.Max(m => m.STATUS_TIME);//取最近状态时间

            string last_time = DateTime.Compare(raised_time, status_time) > 0 ? raised_time.ToString("yyyy-MM-dd HH:mm:ss") : status_time.ToString("yyyy-MM-dd HH:mm:ss");

            List<Alarm> alarmlist_waitUpdate = new List<Alarm>();


            string MinServerTime = DateTime.Now.AddDays(-(Int32.Parse(Api.Util.Common.ParamterDic["AlarmTime"].VALUE) / 24)).ToString("yyyy-MM-dd HH:mm:ss");
            Json.AppendFormat("{{last_time:\"{0}\",MinServerTime:\"{1}\",json:[", last_time, MinServerTime);


            for (int i = 0; i < alarmlist.Count; i++)
            {
                string lineName = alarmlist[i].LINE_NAME;
                if (!string.IsNullOrEmpty(lineName))
                {
                    lineName = lineName + "&nbsp;";
                }
                //string wz = lineName + PublicMethod.GetWZbyAlarm(alarmlist[i]);
                string wz = PublicMethod.GetPosition_Alarm(alarmlist[i].LINE_NAME, alarmlist[i].POSITION_NAME, alarmlist[i].BRG_TUN_NAME, alarmlist[i].DIRECTION, alarmlist[i].KM_MARK, alarmlist[i].POLE_NUMBER, alarmlist[i].DEVICE_ID, alarmlist[i].ROUTING_NO, alarmlist[i].AREA_NO, alarmlist[i].STATION_NO, alarmlist[i].STATION_NAME, alarmlist[i].TAX_MONITOR_STATUS);
                string Summary = PublicMethod.GetSummaryByAlarm(alarmlist[i]).Replace("车号" + alarmlist[i].DETECT_DEVICE_CODE + "&nbsp;", "");

                string taskId = alarmlist[i].TASK_ID;
                string taskName = "";
                if (!string.IsNullOrEmpty(taskId))
                {
                    MisTask misTask = Api.ServiceAccessor.GetTaskService().getSendMisTask(taskId);
                    if (misTask != null && misTask.STATUS != null)
                        taskName = "处理状态：" + misTask.STATUS + "<br/>处理结果：" + misTask.DEAL_RESULT;
                }

                if (alarmlist[i].GIS_X == 0)
                {
                    if (newlist.Count>0 && t < newlist.Count)
                    {
                        if (newlist[t].x != "0" && newlist[t].x != "")
                        {
                            alarmlist[i].GIS_X = Convert.ToDouble(newlist[t].x);
                            alarmlist[i].GIS_Y = Convert.ToDouble(newlist[t].y);
                        }
                        t = t + 1;
                    }
                }
                Json.Append("{");
                Json.Append("GIS_X:\"" + alarmlist[i].GIS_X + "\",");
                Json.Append("GIS_Y:\"" + alarmlist[i].GIS_Y + "\",");
                Json.Append("GIS_X_O:\"" + alarmlist[i].GIS_X_O + "\",");
                Json.Append("GIS_Y_O:\"" + alarmlist[i].GIS_Y_O + "\",");
                Json.Append("RAISED_TIME:\"" + alarmlist[i].RAISED_TIME + "\",");
                Json.Append("STATUS_TIME:\"" + alarmlist[i].STATUS_TIME + "\",");

                if (!string.IsNullOrEmpty(alarmlist[i].SEVERITY) && Api.Util.Common.sysDictionaryDic.Count > 0 && Api.Util.Common.sysDictionaryDic.ContainsKey(alarmlist[i].SEVERITY))
                {
                    //c3Alarm.SEVERITY = Api.Util.Common.sysDictionaryDic[alarm.SEVERITY].CODE_NAME;
                    //c3Alarm.MY_STR_8 = alarm.SEVERITY;
                    Json.Append("SEVERITY:\"" + Api.Util.Common.sysDictionaryDic[alarmlist[i].SEVERITY].CODE_NAME + "\",");
                    Json.Append("SEVERITY_Code:\"" + alarmlist[i].SEVERITY + "\",");
                }
                else
                {
                    Json.Append("SEVERITY:\"" + alarmlist[i].SEVERITY + "\",");
                    Json.Append("SEVERITY_Code:\"" + alarmlist[i].SEVERITY + "\",");
                }
                Json.Append("ALARM_ID:\"" + alarmlist[i].ID + "\",");
                Json.Append("BUREAU_CODE:\"" + alarmlist[i].BUREAU_CODE + "\",");
                Json.Append("POLE_NUMBER:\"" + alarmlist[i].POLE_NUMBER + "\",");
                Json.Append("POSITION_NAME:\"" + alarmlist[i].POSITION_NAME + "\",");
                Json.Append("BRG_TUN_NAME:\"" + alarmlist[i].BRG_TUN_NAME + "\",");
                Json.Append("CATEGORY_CODE:\"" + alarmlist[i].CATEGORY_CODE + "\",");
                Json.Append("DETECT_DEVICE_CODE:\"" + alarmlist[i].DETECT_DEVICE_CODE + "\",");
                Json.Append("LINE_NAME:\"" + alarmlist[i].LINE_NAME + "\",");
                Json.Append("DIRECTION:\"" + alarmlist[i].DIRECTION + "\",");
                Json.Append("CODE_NAME:\"" + alarmlist[i].STATUS_NAME + "\",");
                Json.Append("STATUS:\"" + alarmlist[i].STATUS + "\",");
                Json.Append("SATELLITE_NUM:\"" + alarmlist[i].NVALUE6 + "\",");
                Json.Append("Summary:\"" + Summary + "\",");
                Json.Append("wz:\"" + wz + "\",");
                Json.Append("taskName:\"" + taskName + "\",");
                Json.Append("KM_MARK:\"" + alarmlist[i].KM_MARK + "\",");
                //@addby bro.hon 报警温度100℃ 环境温度28℃ 导高值6383mm 拉出值270mm速度194km/h
                Json.Append("SD:\"" + myfiter.GetSpeed(alarmlist[i].NVALUE1) + "km/h\",");//速度
                Json.Append("WD:\"" + myfiter.GetTEMP_MAX(alarmlist[i]) + "℃\",");//红外温度
                Json.Append("HJWD:\"" + myfiter.GetTEMP(alarmlist[i].NVALUE5) + "℃\",");//环境温度
                Json.Append("DGZ:\"" + myfiter.GetLINE_HEIGHT(alarmlist[i]) + "mm\",");//导高
                Json.Append("LCZ:\"" + myfiter.GetPULLING_VALUE(alarmlist[i]) + "mm\"");//拉出值
                if (i < alarmlist.Count - 1)
                {
                    Json.Append("},");
                }
                else
                {
                    Json.Append("}");
                }
            }

            //更新GPS
            Alarm_Original.UpdateGPS(alarmlist_waitUpdate);


        }
        else
        {
            //alarmlist为空时，直接返回空json数组
            Json.AppendFormat("{{last_time:\"{0}\",MinServerTime:\"{1}\",json:[", "", "");
        }

        Json.Append("]");
        Json.Append("}");

        string re = myfiter.json_RemoveSpecialStr(Json.ToString());



        string remove = HttpContext.Current.Request["remove"];
        if (remove == "1")//@addby bro.hon
        {


            re = myfiter.RemoveHTML(re, 0);
            context.Response.Write(Newtonsoft.Json.JsonConvert.DeserializeObject(re));
        }
        else
        {
            object myObj = JsonConvert.DeserializeObject(re);
            context.Response.Write(myObj);
        }

    }
    /// <summary>
    /// GPS转换并更新数据库
    /// </summary>
    /// <param name="list">数据源</param>
    /// <param name="GPS_X_NAME">百度经度列名</param>
    /// <param name="GPS_Y_NAME">百度纬度列名</param>
    /// <param name="ID_NAME">主键名</param>
    /// <param name="TABLE_NAME">表名</param>
    /// <returns></returns>
    public List<CoordinateConvert.Point2> GPSTranAndUpdate_list (List<Alarm> list,string GPS_X_NAME,string GPS_Y_NAME,string ID_NAME,string TABLE_NAME)
    {
        List<CoordinateConvert.Point2> oldlist = new List<CoordinateConvert.Point2>();
        List<CoordinateConvert.Point2> relist = new List<CoordinateConvert.Point2>();
        foreach (Alarm alarm in list)
        {
            if (alarm.GIS_X == 0 || alarm.GIS_Y == 0)
            {
                CoordinateConvert.Point2 point2 = new CoordinateConvert.Point2();
                point2.x_o = alarm.GIS_X_O.ToString();
                point2.y_o = alarm.GIS_Y_O.ToString();
                point2.ID = alarm.ID;
                oldlist.Add(point2);
            }
        }
        TransAndUpdate_p m_p = new TransAndUpdate_p();
        m_p.gps_x_name = GPS_X_NAME;
        m_p.gps_y_name = GPS_Y_NAME;
        m_p.ID_name = ID_NAME;
        m_p.tableName = TABLE_NAME;
        m_p.oldlist = oldlist;
        GPSTransform t = new GPSTransform();
        relist = t.TransAndUpdate(m_p);
        return relist;
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}