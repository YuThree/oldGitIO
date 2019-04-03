/*========================================================================================*
* 功能说明：短信信息
* 注意事项：
* 作    者： 邓杰
* 版本日期：2013年10月21日
* 变更说明：
* 版 本 号： V1.0
*=======================================================================================*/
<%@ WebHandler Language="C#" Class="C3ProcessInfo" %>

using System;
using System.Web;
using System.Text;
using Newtonsoft.Json;
using System.Data;
using System.Collections.Generic;
using Api.Fault.entity.sms;
using Api.Foundation.entity.Cond;

public class C3ProcessInfo : ReferenceClass, IHttpHandler
{
    /// <summary>
    /// 轨迹
    /// </summary>
    /// <param name="context"></param>
    public void ProcessRequest(HttpContext context)
    {

        String type = context.Request.QueryString["type"].ToString();
        DateTime startdate = DateTime.MinValue;
        DateTime enddate = System.DateTime.MinValue;
        //获取日期
        if (context.Request.QueryString["startdate"] != null && context.Request.QueryString["startdate"] != "")
        {
            startdate = DateTime.Parse(context.Request.QueryString["startdate"]);
        }
        if (context.Request.QueryString["enddate"] != null && context.Request.QueryString["enddate"] != "")
        {
            enddate = DateTime.Parse(context.Request.QueryString["enddate"]);
        }
        if (type == "4")
        {
            String TrainNo = context.Request.QueryString["TrainNo"].ToString();
            getMapC3DeviceVersion(TrainNo, context);
        }
        else
        {
            String deviceid = context.Request.QueryString["deviceid"].ToString();
            getMapC3ProcessDataPoint(deviceid, type, context, startdate, enddate);
        }
    }

    /// <summary>
    /// 获取C3数据
    /// </summary>
    /// <param name="deviceid">设备号</param>
    /// <param name="type">类型1：取轨迹 2：发短信</param>
    /// <param name="context"></param>
    private void getMapC3ProcessDataPoint(string deviceid, String type, HttpContext context, DateTime startdate, DateTime enddate)
    {
        switch (type)
        {
            //获取轨迹数据
            case "1":
                C3_SmsCond c3Smscond = new C3_SmsCond();
                c3Smscond.LOCOMOTIVE_CODE = deviceid;
                c3Smscond.orderBy = " detect_time desc";
                string jl = context.Request.QueryString["jl"].ToString();
                if (!string.IsNullOrEmpty(jl) && jl != "null")
                {
                    c3Smscond.ROUTING_NO = jl;
                }
                if (startdate != DateTime.MinValue && enddate != DateTime.MinValue)
                {
                    c3Smscond.endTime = enddate;
                    c3Smscond.startTime = startdate;
                }
                c3Smscond.page = 1;
                c3Smscond.pageSize = 1;
                c3Smscond.businssAnd = " GIS_X != 0 and GIS_Y !=0";
                //获取短信对象(为了取时间排序第一条)
                List<C3_Sms> listc3sms = Api.ServiceAccessor.GetSmsService().getC3SmsbyCondition(c3Smscond);
                if (startdate == DateTime.MinValue)
                {
                    if (listc3sms.Count > 0)
                    {
                        c3Smscond.endTime = Convert.ToDateTime(enddate);
                        c3Smscond.startTime = Convert.ToDateTime(enddate).AddHours(-3);
                    }
                }

                //获取指定时间段的设备短信JSON串
                c3Smscond.page = 0; //取消分页条件
                c3Smscond.pageSize = 0;
                c3Smscond.businssAnd = " GIS_X_O != 0 and GIS_Y_O !=0";
                List<C3_Sms> list = Api.ServiceAccessor.GetSmsService().getC3SmsJsonbyCondition(c3Smscond);

                StringBuilder json = new StringBuilder();
                json.Append("[");
                for (int i = 0; i < list.Count; i++)
                {
                    string wz = PublicMethod.GetPositionBySMSID(list[i]);
                    string ROUTING_NO = myfiter.GetRouingNo(list[i].ROUTING_NO);
                    
                    Api.Foundation.entity.Foundation.Locomotive m_loco = Api.Util.Common.getLocomotiveInfo(list[i].LOCOMOTIVE_CODE);

                    json.Append("{");
                    json.Append("CROSSING_NO:\"" + ROUTING_NO + "\"");//交路号
                    json.Append(",");
                    json.Append("KM_MARK:\"" + list[i].KM_MARK + "\"");//公里标
                    if (list[i].GIS_LON != 0)
                    {
                        json.Append(",");
                        json.Append("GIS_X:\"" + list[i].GIS_LON + "\"");//经度
                        json.Append(",");
                        json.Append("GIS_Y:\"" + list[i].GIS_LAT + "\"");//纬度
                    }
                    else
                    {
                        string bPoint = CoordinateConvert.convert2B(list[i].GIS_LON_O.ToString(), list[i].GIS_LAT_O.ToString());
                        if (bPoint != null)
                        {
                            if (bPoint.Split(',')[0] != "0")
                            {
                                json.Append(",");
                                json.Append("GIS_X:\"" + bPoint.Split(',')[0] + "\"");//经度
                                json.Append(",");
                                json.Append("GIS_Y:\"" + bPoint.Split(',')[1] + "\"");//纬度
                            }
                            else
                            {
                                json.Append(",");
                                json.Append("GIS_X:\"" + list[i].GIS_LON_O + "\"");//经度
                                json.Append(",");
                                json.Append("GIS_Y:\"" + list[i].GIS_LAT_O + "\"");//纬度
                            }
                        }
                        else
                        {
                            json.Append(",");
                            json.Append("GIS_X:\"" + list[i].GIS_LON_O + "\"");//经度
                            json.Append(",");
                            json.Append("GIS_Y:\"" + list[i].GIS_LAT_O + "\"");//纬度
                        }

                    }
                    json.Append(",");
                    json.Append("GIS_X_O:\"" + list[i].GIS_LON_O + "\"");//经度
                    json.Append(",");
                    json.Append("GIS_Y_O:\"" + list[i].GIS_LAT_O + "\"");//纬度
                    json.Append(",");
                    json.Append("SPEED:\"" + list[i].SPEED + "\"");//速度
                    json.Append(",");
                    json.Append("DIRECTION:\"" + list[i].DIRECTION + "\"");//行别
                    json.Append(",");
                    json.Append("TRAIN_NO:\"" + list[i].LOCOMOTIVE_CODE + "\"");//设备号
                    json.Append(",");
                    json.Append("WZ:\"" + wz + "\"");//位置
                    json.Append(",");
                    json.Append("TRAIN_STATUS:\"" + "" + "\"");//运行状态  GIS_LON_O
                    json.Append(",");
                    json.Append("BOW_UPDOWN_STATUS:\"" +myfiter.GetBowStatus(list[i],m_loco.DEVICE_BOW_RELATIONS)  + "\"");//运行状态  GIS_LON_O
                    json.Append(",");
                    json.Append("STATION_NO:\"" + list[i].STATION_NO + "\"");//车站号
                    json.Append(",");
                    json.Append("DETECT_TIME:\"" + list[i].DETECT_TIME + "\"");//时间
                    json.Append(",");
                    json.Append("SENSOR_TEMP:\"" + myfiter.GetTEMP_ENV_D(list[i]) + "\"");//温度
                    json.Append(",");
                    json.Append("SATELLITE_NUM:\"" + list[i].SATELLITE_NUM + "\"");//SATELLITE_NUM卫星数
                    json.Append(",");
                    json.Append("IRV_TEMP:\"" + myfiter.GetTEMP_MAX_D(list[i]) + "\"");//红外温度
                    json.Append(",");
                    json.Append("LINE_HEIGHT:\"" + myfiter.GetLINE_HEIGHT_D(list[i].LINE_HEIGHT_1) + "\"");//导高
                    json.Append(",");
                    json.Append("PULLING_VALUE:\"" + myfiter.GetPULLING_VALUE_D(list[i].PULLING_VALUE_1) + "\"");//导高
                    json.Append(",");
                    json.Append("BUREAU_CODE:\"" + list[i].BUREAU_CODE + "\"");//局
                    if (list[i].BUREAU_CODE != "" && list[i].BUREAU_CODE != null && list[i].ROUTING_NO != "" && list[i].ROUTING_NO != null)
                    {
                        string CODE = list[i].BUREAU_CODE + list[i].ROUTING_NO;
                        Api.Foundation.entity.Foundation.Routing Rout = Api.Util.Common.getRoutingInfo(CODE);//.ServiceAccessor.GetFoundationService().queryRouting(routing);
                        if (Rout != null)
                        {

                            json.Append(",");
                            json.Append("ROUTING_CODE:\"" + Rout.AREA_SECTION + "\"");//区站
                        }
                        else
                        {
                            json.Append(",");
                            json.Append("ROUTING_CODE:\"" + "" + "\"");//区站
                        }
                    }
                    else
                    {
                        json.Append(",");
                        json.Append("ROUTING_CODE:\"" + "" + "\"");//区站
                    }

                    json.Append(",");
                    json.Append("LINE_NAME:\"" + list[i].LINE_NAME + "\"");//线路


                    if (list[i].BUREAU_CODE != "" && list[i].BUREAU_CODE != null && list[i].ROUTING_NO != "" && list[i].ROUTING_NO != null && list[i].STATION_NO != "" && list[i].STATION_NO != null)
                    {

                        Api.Foundation.entity.Foundation.RoutingStationRel RoutingStation = Api.Util.Common.getRoutingStationRel(list[i].BUREAU_CODE, list[i].ROUTING_NO, list[i].STATION_NO);
                        if (RoutingStation != null)
                        {

                            json.Append(",");
                            json.Append("STATION_NAME:\"" + RoutingStation.STATION_NAME + "\"");//站名
                        }
                        else
                        {
                            json.Append(",");
                            json.Append("STATION_NAME:\"" + "" + "\"");//站名
                        }

                    }
                    else
                    {
                        json.Append(",");
                        json.Append("STATION_NAME:\"" + "" + "\"");//站名
                    }
                    if (i < list.Count - 1)
                    {
                        json.Append("},");
                    }
                    else
                    {
                        json.Append("}");
                    }
                }

                json.Append("]");
                StringBuilder Json = new StringBuilder();
                Json.Append("[");
                Json.Append("[");
                if (listc3sms.Count > 0)
                    if (listc3sms[0].GIS_LON != 0)
                    {
                        Json.Append("{\"GIS_X\":\"" + listc3sms[0].GIS_LON + "\",\"GIS_Y\":\"" + listc3sms[0].GIS_LAT + "\"},");
                    }
                    else
                    {
                        string bPoint = CoordinateConvert.convert2B(listc3sms[0].GIS_LON_O.ToString(), listc3sms[0].GIS_LAT_O.ToString());
                        if (bPoint != null)
                        {
                            if (bPoint.Split(',')[0] != "0")
                                Json.Append("{\"GIS_X\":\"" + bPoint.Split(',')[0] + "\",\"GIS_Y\":\"" + bPoint.Split(',')[1] + "\"},");
                            else
                                Json.Append("{\"GIS_X\":\"" + listc3sms[0].GIS_LON_O.ToString() + "\",\"GIS_Y\":\"" + listc3sms[0].GIS_LAT_O.ToString() + "\"},");
                        }
                        else
                        {
                            Json.Append("{\"GIS_X\":\"" + listc3sms[0].GIS_LON_O.ToString() + "\",\"GIS_Y\":\"" + listc3sms[0].GIS_LAT_O.ToString() + "\"},");
                        }
                    }
                else
                {
                    Json.Append("{\"GIS_X\":\"" + listc3sms[0].GIS_LON_O.ToString() + "\",\"GIS_Y\":\"" + listc3sms[0].GIS_LAT_O.ToString() + "\"},");
                }
                Json.Append("{\"JCINFO\":" + json.ToString() + "}");
                Json.Append("]");
                object myObj = JsonConvert.DeserializeObject(Json.ToString());
                context.Response.Write(myObj.ToString());

                break;
            //发送短信
            case "2":
                //SmsService.sendSms("18244941204", "Keii:DC*"+deviceid);
                break;
            //获取设备缺陷数据
            case "3":
                //String sqlqx = "SELECT * FROM fault where alarm_id='" + deviceid + "'";
                //DataSet qxds = DbHelperOra.Query(sqlqx);
                //object qxObj = JsonConvert.DeserializeObject(Dal.DataTableToJson(qxds.Tables[0]));
                //context.Response.Write(qxObj);
                //qxds.Dispose();
                break;
        }

    }
    //获取设备版本
    public void getMapC3DeviceVersion(string TrainNo, HttpContext context)
    {
        Api.Foundation.entity.Foundation.Locomotive loco = Api.ServiceAccessor.GetFoundationService().getLocomotiveByCode(TrainNo);
        StringBuilder Json = new StringBuilder();
        Json.Append("[");
        Json.Append("{");
        Json.Append("deviceVersion:\"" + loco.DEVICE_VERSION + "\"");
        Json.Append("}");
        Json.Append("]");
        object myObj = JsonConvert.DeserializeObject(Json.ToString());
        context.Response.Write(myObj.ToString());
    }


    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}