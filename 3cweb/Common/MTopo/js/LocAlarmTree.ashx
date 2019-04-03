<%@ WebHandler Language="C#" Class="LocAlarmTree" %>

using System;
using System.Web;
using Api.Foundation.entity.Foundation;
using System.Collections.Generic;
using Api.Foundation.service;
using Api;
using Newtonsoft.Json;
using System.Text;
using Api.Foundation.entity.Cond;
using Api.Fault.entity.alarm;
using Api.Fault.entity.sms;

public class LocAlarmTree :ReferenceClass, IHttpHandler
{
    public int lastday = int.Parse(System.Configuration.ConfigurationManager.AppSettings["AlarmTimePeriod"].ToString());
    public void ProcessRequest(HttpContext context)
    {
        string type = context.Request["type"];
        switch (type)
        {

            //获取设备树
            case "tree":
                GetTree();
                break;
            case "list":
                Getlist();
                break;
            case "6C":
                Get6Clist();
                break;
            default:
                break;
        }
    }
    private void Getlist()
    {
        C3_AlarmCond alarmCond = new C3_AlarmCond();
        List<C3_Alarm> alarmList = new List<C3_Alarm>();
        int recordCount = 0;
        alarmCond.CATEGORY_CODE = "3C";
        alarmCond.STATUS = "AFSTATUS01";
        alarmCond.orderBy = " RAISED_TIME desc";    //排序
        alarmCond.pageSize = 5;
        alarmCond.page = 1;
        alarmCond.startTime = DateTime.Now.AddDays(lastday);
        alarmCond.endTime = DateTime.Now;
        //获取报警list
        alarmList = Api.ServiceAccessor.GetAlarmService().getC3Alarm(alarmCond);
        //获取总条数
        recordCount = Api.ServiceAccessor.GetAlarmService().getAlarmCount(alarmCond);
        C3_Alarm c3 = new C3_Alarm();
        StationSection station = new StationSection();
        Api.Foundation.entity.Cond.PoleCond cond = new Api.Foundation.entity.Cond.PoleCond();
        IList<Pole> polelist = null;
        RoutingStationRel rel = new RoutingStationRel();
        string wz = "";
        string status;
        double distance;
        string posCode;
        string font1 = "";//行字体颜色开头
        string font2 = "";//行字体颜色结尾
        string url;
        string IRV;
        string GIS;
        string jsonStr = "{'rows':[";
        for (int i = 0; i < alarmList.Count; i++)
        {

            if (alarmList[i].SOURCE != "GS")
            {
                url = "<a  href=javascript:selectInfo(C" + alarmList[i].ID + ")>处理</a>";
                IRV = "<a href=javascript:IRVXZ(C" + alarmList[i].ID + ")>视频下载</a>";
            }
            else
            {
                url = "<a  href=javascript:UpdateInfo(C" + alarmList[i].ID + ")>修改</a>&nbsp;<a  href=javascript:selectInfo(C" + alarmList[i].ID + ")>处理</a>";
                c3 = Api.ServiceAccessor.GetAlarmService().getC3Alarm(alarmList[i].ID);
                if (c3.RAISE_FILE_IR == null || c3.RAISE_FILE_IR == "")
                {
                    IRV = "";
                }
                else
                {
                    IRV = "<a href=javascript:IRVXZ(C" + alarmList[i].ID + ")>视频下载</a>";
                }
            }
            if (alarmList[i].GIS_X != null && alarmList[i].GIS_X != 0)
            {
                posCode = Api.Util.PositionConverter.getStationInfoByGPS(alarmList[i].GIS_X, alarmList[i].GIS_Y, out distance, alarmList[i].BUREAU_CODE);
                station = Api.Util.Common.getStationSectionInfo(posCode);
            }
            else
            {
                station = null;
            }
            GIS = "<a href=javascript:ShowGis(C" + alarmList[i].ID + ")>东经:" + alarmList[i].GIS_X.ToString("f2") + " 北纬:" + alarmList[i].GIS_Y.ToString("f2") + "</a>";
            status = alarmList[i].STATUS_NAME; //状态
            if (status == "新上报")
            {
                //status = "<font color=red>" + status + "</font>";
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

            cond.POLE_NO = alarmList[i].POLE_NUMBER;
            polelist = Api.ServiceAccessor.GetFoundationService().queryPole(cond);
            wz = "";
            //////////////////////////////////////////////////////////
            if (alarmList[i].ROUTING_NO != null && alarmList[i].ROUTING_NO != "")
            {
                wz += alarmList[i].ROUTING_NO + "号交路";
                if (alarmList[i].AREA_NO != null && alarmList[i].AREA_NO != "")
                {
                    wz += "(" + alarmList[i].AREA_NO + ")";
                }
                wz += "&nbsp;";
            }
            if (alarmList[i].STATION_NO != null && alarmList[i].STATION_NO != "")
            {
                rel = Api.Util.Common.getRoutingStationRel(alarmList[i].BUREAU_CODE + alarmList[i].ROUTING_NO + alarmList[i].STATION_NO);
                wz += "&nbsp;" + alarmList[i].STATION_NO;
                if (rel.STATION_NAME != null && rel.STATION_NAME.Trim() != "")
                {
                    wz += "(" + rel.STATION_NAME + ") ";
                }
            }
            if (!String.IsNullOrEmpty(alarmList[i].LINE_NAME))
            {
                wz += alarmList[i].LINE_NAME + "&nbsp;" + alarmList[i].POSITION_NAME + "&nbsp;";
                if (alarmList[i].POLE_NUMBER != null && alarmList[i].POLE_NUMBER != "")
                {
                    wz += "(" + alarmList[i].POLE_NUMBER + ")";
                }
            }
            else if (polelist.Count > 0)
            {
                wz += polelist[0].LINE_NAME + "&nbsp;" + polelist[0].POSITION_NAME + "&nbsp;";
                if (alarmList[i].POLE_NUMBER != null && alarmList[i].POLE_NUMBER != "")
                {
                    wz += "(" + alarmList[i].POLE_NUMBER + ")";
                }
            }
            else if (station != null)
            {
                wz += station.LINE_NAME + "&nbsp;" + station.POSITION_NAME + "&nbsp;";
                if (alarmList[i].POLE_NUMBER != null && alarmList[i].POLE_NUMBER != "")
                {
                    wz += "(" + alarmList[i].POLE_NUMBER + ")";
                }
            }

            ///////////////////////////////////////////////////////////
            jsonStr += "{'LOCOMOTIVE_CODE':'" + font1 + alarmList[i].DETECT_DEVICE_CODE + font2 + "',";//车号
            if (station != null )
            {
                jsonStr += "'XL':'" + font1 + station.LINE_NAME + font2 + "',";//线路
                jsonStr += "'STATION':'" + font1 + station.POSITION_NAME + font2 + "',";//车站名
            }
            else
            {
                jsonStr += "'XL':'" + font1 + alarmList[i].LINE_NAME + font2 + "',";//线路
                jsonStr += "'STATION':'" + font1 + alarmList[i].POSITION_NAME + font2 + "',";//车站名
            }
            jsonStr += "'JL':'" + font1 + alarmList[i].ROUTING_NO + font2 + "',";//交路
            jsonStr += "'QD':'" + font1 + alarmList[i].AREA_NO + font2 + "',";//运用区段
            jsonStr += "'KM':'" + font1 + PublicMethod.KmtoString(alarmList[i].KM_MARK) + font2 + "',";//KM
            jsonStr += "'GIS':'" + GIS + "',";//KM
            jsonStr += "'GISX':'" + alarmList[i].GIS_X + "',";//KM
            jsonStr += "'GISY':'" + alarmList[i].GIS_Y + "',";//KM
            jsonStr += "'GWZ':'" + font1 + alarmList[i].BOW_TYPE + font2 + "',";//弓位置
            jsonStr += "'SD':'" + font1 + alarmList[i].SPEED + "km/h" + font2 + "',";//速度
            jsonStr += "'WD':'" + font1 + alarmList[i].MAX_TEMP / 100 + font2 + "',";//红外温度
            jsonStr += "'HJWD':'" + font1 + alarmList[i].ENV_TEMP / 100 + font2 + "',";//环境温度
            jsonStr += "'DGZ':'" + font1 + alarmList[i].LINE_HEIGHT + "',";//导高
            jsonStr += "'LCZ':'" + font1 + alarmList[i].PULLING_VALUE + "',";//拉出值
            jsonStr += "'JB':'" + font1 + alarmList[i].SEVERITY + font2 + "',";//级别
            jsonStr += "'WZ':'" + font1 + wz + font2 + "',";//位置信息
            jsonStr += "'QXZT':'" + font1 + alarmList[i].CODE_NAME + font2 + "',";//缺陷状态
            jsonStr += "'ZT':'" + font1 + alarmList[i].STATUS_NAME + font2 + "',";//状态
            jsonStr += "'NOWDATE':'" + font1 + alarmList[i].RAISED_TIME.ToString("yyyy-MM-dd HH:mm:ss") + font2 + "',";//发生时间
            jsonStr += "'CZ':'" + url + "',";//操作
            jsonStr += "'XZ':'" + IRV + "',";//XZ
            jsonStr += "'ID':'C" + alarmList[i].ID + "'";
            jsonStr += " },";
        }
        if (jsonStr.LastIndexOf(',') > 0)
        {
            jsonStr = jsonStr.Substring(0, jsonStr.LastIndexOf(',')) + "],'page':" + 1 + ",'rp':" + 10 + ",'total':" + recordCount + "}";
        }
        else
        {
            jsonStr += "],'page':'" + 1 + "','rp':'" + 10 + "','total':'" + recordCount + "'}";

        }

        jsonStr = jsonStr.Replace("'", "\"");
        HttpContext.Current.Response.Write(jsonStr);
        
        
    }
    /// <summary>
    /// 获取设备树
    /// </summary>
    private void GetTree()
    {
        StringBuilder Json = new StringBuilder();
        Json.Append("[");
        OrganizationCond bureauCond = new OrganizationCond();
        bureauCond.ORG_TYPE = "局";
        IList<Organization> bureauList = ServiceAccessor.GetFoundationService().queryOrganization(bureauCond);
        foreach (Organization bureau in bureauList)
        {
            Json.Append("{");
            Json.Append("id:\"" + bureau.ORG_CODE + "\",");
            Json.Append("pId:\"" + "0" + "\",");
            Json.Append("name:\"" + bureau.ORG_NAME + "\",");
            Json.Append("open:true,");
            Json.Append("click:\"TreeClick('" + bureau.ORG_NAME + "','" + bureau.ORG_CODE + "','BUREAU','" + bureau.ID + "')\"");
            Json.Append("},");
            OrganizationCond orgCond = new OrganizationCond();
            orgCond.SUP_ORG_CODE = bureau.ORG_CODE;
            IList<Organization> orgList = ServiceAccessor.GetFoundationService().queryOrganization(orgCond);
            IList<Locomotive> locomotiveList = null;
            C3_AlarmCond alarmCond = new C3_AlarmCond();
            List<C3_Alarm> alarmList = new List<C3_Alarm>();
            C3_SmsCond c3smsCond = new C3_SmsCond();
            //设备轨迹
            List<C3_Sms> locgj = null;
            string locGISX = "0";
            string locGISY = "0";
            string locID ="";
            foreach (Organization org in orgList)
            {
                LocomotiveCond cond = new LocomotiveCond();
                cond.P_ORG_CODE = org.ORG_CODE;
                //增加对设备版本的判断，用于视频直播时筛选设备列表
                if (HttpContext.Current.Request["LOCO_VERSION"] != null && HttpContext.Current.Request["LOCO_VERSION"] != "undefined" && HttpContext.Current.Request["LOCO_VERSION"] != "" && HttpContext.Current.Request["LOCO_VERSION"] != "0")
                {
                    cond.DEVICE_VERSION = HttpContext.Current.Request["LOCO_VERSION"];
                }
                locomotiveList = ServiceAccessor.GetFoundationService().queryLocomotive(cond);
                if (locomotiveList != null && locomotiveList.Count > 0)
                {
                    Json.Append("{");
                    Json.Append("id:\"" + org.ORG_CODE + "\",");
                    Json.Append("pId:\"" + bureau.ORG_CODE + "\",");
                    Json.Append("name:\"" + org.ORG_NAME + "\",");
                    Json.Append("open:true,");
                    Json.Append("click:\"TreeClick('" + org.GIS_LON + "','" + org.GIS_LAT + "','ORG','')\"");
                    Json.Append("},");
                    foreach (Locomotive locomotive in locomotiveList)
                    {
                        c3smsCond.LOCOMOTIVE_CODE = locomotive.LOCOMOTIVE_CODE;
                        c3smsCond.startTime = DateTime.Now.AddDays(-7);
                        c3smsCond.endTime = DateTime.Now;
                        c3smsCond.orderBy = " DETECT_TIME DESC";
                        locgj = Api.ServiceAccessor.GetSmsService().getC3SmsbyCondition(c3smsCond);
                        if (locgj.Count > 0)
                        {
                            locGISX = locgj[0].GIS_LON.ToString();
                            locGISY = locgj[0].GIS_LAT.ToString();
                            locID = locgj[0].ID;
                        }
                        Json.Append("{");
                        Json.Append("id:\"" + locomotive.LOCOMOTIVE_CODE + "\",");
                        Json.Append("pId:\"" + org.ORG_CODE + "\",");
                        Json.Append("name:\"" + locomotive.LOCOMOTIVE_CODE + "\",");
                        Json.Append("click:\"TreeClick('" + locGISX + "','" + locGISY + "','LOCOMOTIVE','" + locID + "')\"");
                        Json.Append("},");
                        alarmCond.DETECT_DEVICE_CODE = locomotive.LOCOMOTIVE_CODE;
                        alarmCond.startTime = DateTime.Now.AddDays(lastday);
                        alarmCond.endTime = DateTime.Now;
                        alarmCond.orderBy = " RAISED_TIME DESC ";
                        alarmCond.STATUS = "AFSTATUS01";
                        alarmList = Api.ServiceAccessor.GetAlarmService().getC3Alarm(alarmCond);
                        foreach (C3_Alarm c3alarm in alarmList)
                        {
                            Json.Append("{");
                            Json.Append("id:\"" + c3alarm.ID + "\",");
                            Json.Append("pId:\"" + locomotive.LOCOMOTIVE_CODE + "\",");
                            Json.Append("name:\"" + c3alarm.RAISED_TIME.ToString("yyyy-MM-dd HH:mm:ss") + "\",");
                            Json.Append("click:\"TreeClick('" + c3alarm.GIS_X + "','" + c3alarm.GIS_Y + "','ALARM','" + c3alarm.ID + "')\"");
                            Json.Append("},");
                        }

                    }
                }
            }
        }
        string json = Json.ToString().Substring(0, Json.Length - 1);
        json += "]";
        Json.Clear();
        Json.Append(json);
        HttpContext.Current.Response.Write(Json);
        
        
    }


    private void Get6Clist()
    {
        //条件
        AlarmCond alarmCond = new AlarmCond();
        alarmCond.startTime = DateTime.Now.AddDays(-7);
        alarmCond.endTime = DateTime.Now;
        alarmCond.STATUS = "AFSTATUS01,AFSTATUS03,AFSTATUS04";
        alarmCond.page = 1;
        alarmCond.pageSize = 5;
        alarmCond.orderBy = " RAISED_TIME DESC";

        //获取6Clist
        List<Alarm> c3List = Api.ServiceAccessor.GetAlarmService().getAlarm(alarmCond);
        //获取总条数
        int recordCount = Api.ServiceAccessor.GetAlarmService().getAlarmCount(alarmCond);
        string jsonStr = "{'rows':[";
        for (int i = 0; i < c3List.Count; i++)
        {
            string url = "<a  href=javascript:selectInfo(C" + c3List[i].ID + ")>查看明细</a> ";

            string status = c3List[i].STATUS_NAME;//状态

            string Summary = "";

            if (c3List[i].CATEGORY_CODE == "3C")
            {
                if (c3List[i].NVALUE1.ToString() != "" && c3List[i].NVALUE1 != null)
                {
                    Summary += "速度" + c3List[i].NVALUE1 + "km/h&nbsp;";
                }

                if (c3List[i].NVALUE2.ToString() != "" && c3List[i].NVALUE2 != null)
                {
                    Summary += "最高温度" + c3List[i].NVALUE2 / 100 + "℃&nbsp;";
                }
                if (c3List[i].NVALUE3.ToString() != "" && c3List[i].NVALUE3 != null)
                {
                    Summary += "导高值" + c3List[i].NVALUE3 + "mm&nbsp;";
                }
                if (c3List[i].NVALUE4.ToString() != "" && c3List[i].NVALUE4 != null)
                {
                    Summary += "拉出值" + c3List[i].NVALUE4 + "mm";
                }
            }
            else if (c3List[i].CATEGORY_CODE == "6C")
            {
                if (c3List[i].NVALUE2.ToString() != "" && c3List[i].NVALUE2 != null)
                {
                    Summary += "区域温度" + c3List[i].NVALUE2 + "℃&nbsp;";
                }

                if (c3List[i].NVALUE3.ToString() != "" && c3List[i].NVALUE3 != null)
                {
                    Summary += "环境温差" + c3List[i].NVALUE3 + "℃";
                }

            }
            else if (c3List[i].CATEGORY_CODE == "综合分析")
            {
                Summary = c3List[i].DETAIL;
            }
            else
            {
                Summary = c3List[i].DETAIL;
            }
            if (status == "新上报")
            {
                status = "<font color=red>" + status + "</font>";
            }
            jsonStr += "{'G_DUAN_ORG':'" + c3List[i].POWER_SECTION_NAME + "',";//段
            jsonStr += "'G_CJ_ORG':'" + c3List[i].WORKSHOP_NAME + "',";//车间
            jsonStr += "'G_TSYS_ORG':'" + c3List[i].ORG_NAME + "',";//工区
            jsonStr += "'LINE_CODE':'" + c3List[i].LINE_NAME + "',";//线路
            jsonStr += "'G_JU':'" + c3List[i].BUREAU_NAME + "',";//局
            jsonStr += "'POSITION_CODE':'" + c3List[i].POSITION_NAME + "',";//区站
            jsonStr += "'CATEGORY_CODE':'" + c3List[i].CATEGORY_CODE + "',";//数据类型
            jsonStr += "'KM_MARK':'" + PublicMethod.KmtoString(c3List[i].KM_MARK) + "',";//公里标
            jsonStr += "'POLE_NUMBER':'" + c3List[i].POLE_NUMBER + "',";//杆号
            jsonStr += "'SUMMARY':'" + Summary + "',";//c3List[i].SUMMARYDIC.CODE_NAME缺陷类型
            jsonStr += "'SEVERITY':'" + c3List[i].SEVERITY + "',";//级别
            jsonStr += "'CREATED_TIME':'" + c3List[i].RAISED_TIME.ToString("yyyy-MM-dd HH:mm:ss") + "',";//发生时间
            jsonStr += "'STATUS':'" + status + "',";//状态
            jsonStr += "'GISX':'" + c3List[i].GIS_X + "',";//KM
            jsonStr += "'GISY':'" + c3List[i].GIS_Y + "',";//KM
            jsonStr += "'ID':'C" + c3List[i].ID + "'";
            jsonStr += " },";
        }
        if (jsonStr.LastIndexOf(',') > 0)
        {
            jsonStr = jsonStr.Substring(0, jsonStr.LastIndexOf(',')) + "],'page':" + 1 + ",'rp':" + 5 + ",'total':" + recordCount + "}";
        }
        else
        {
            jsonStr += "],'page':'" + 1 + "','rp':'" + 5 + "','total':'" + recordCount + "'}";

        }

        jsonStr = jsonStr.Replace("'", "\"");
        HttpContext.Current.Response.Write(jsonStr);
        
        

    }
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}