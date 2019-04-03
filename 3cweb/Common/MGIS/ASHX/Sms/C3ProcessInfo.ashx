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
using System.Linq;
using System.Collections.Generic;
using Api.Fault.entity.sms;
using Api.Foundation.entity.Cond;
using Api.Foundation.entity.Foundation;
using Api.Util;

public class C3ProcessInfo : ReferenceClass, IHttpHandler
{
    /// <summary>
    /// 轨迹
    /// </summary>
    /// <param name="context"></param>
    public void ProcessRequest(HttpContext context)
    {

        String type = context.Request.QueryString["type"];
        if (type == "Newest")
        {
            //视频直播位置信息
            GetNewestC3Sms(context);
        }
        else
        {

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
                ////获取设备版本
                String TrainNo = context.Request.QueryString["TrainNo"].ToString();
                getMapC3DeviceVersion(TrainNo, context);
            }
            else if (type == "5")
            {
                //设置行别
                String deviceid = context.Request.QueryString["deviceid"].ToString();
                setDirection(deviceid, startdate, enddate);
            }
            else if (type == "6")
            {
                //设置状态及线路和区站
                String deviceid = context.Request.QueryString["deviceid"].ToString();
                String ID = context.Request.QueryString["ID"].ToString();
                String status = context.Request.QueryString["status"].ToString();

                String point1lng = context.Request.QueryString["point1lng"].ToString();
                String point1lat = context.Request.QueryString["point1lat"].ToString();
                String point2lng = context.Request.QueryString["point2lng"].ToString();
                String point2lat = context.Request.QueryString["point2lat"].ToString();
                String _linecode = context.Request.QueryString["_linecode"].ToString();
                String _positioncode = context.Request.QueryString["_positioncode"].ToString();
                setStatus(deviceid, startdate, enddate, ID, status, point1lng, point1lat, point2lng, point2lat, _linecode, _positioncode);
            }
            else
            {
                //type=1 图形化轨迹搜索，加载 使用
                String deviceid = context.Request.QueryString["deviceid"].ToString();
                getMapC3ProcessDataPoint(deviceid, type, context, startdate, enddate);
            }
        }
    }

    /// <summary>
    /// 获取C3设备最新坐标点数据
    /// </summary>
    /// <param name="mislineid">线路CODE</param>
    /// <param name="context"></param>
    private void GetNewestC3Sms(HttpContext context)
    {
        C3_SmsCond c3Smscond = new C3_SmsCond();
        if (!string.IsNullOrEmpty(context.Request.QueryString["lineCode"]))
        {
            String lineCode = context.Request.QueryString["lineCode"].ToString();
            if (lineCode != "")
            {
                c3Smscond.LINE_CODE = lineCode;
            }
        }
        String OrgCode = context.Request.QueryString["OrgCode"];//
        String OrgType = context.Request.QueryString["OrgType"];//
        String LocaType = context.Request.QueryString["LocaType"];//
        string isplayback = context.Request["isplayback"];//是否是视频回放数据获取
        if (!string.IsNullOrEmpty(LocaType))
        {
            c3Smscond.businssAnd = " GetLocaType(locomotive_code)=" + LocaType;

        }

        switch (OrgType)
        {
            case Api.Foundation.entity.Foundation.LocoType.JU:
                c3Smscond.BUREAU_CODE = OrgCode;
                break;
            case Api.Foundation.entity.Foundation.LocoType.JWD:
                c3Smscond.P_ORG_CODE = OrgCode;
                break;
            case Api.Foundation.entity.Foundation.LocoType.GDD:
                c3Smscond.P_ORG_CODE = OrgCode;
                break;
        }


        c3Smscond.endTime = string.IsNullOrEmpty(HttpContext.Current.Request["time"]) ? DateTime.Now : (Convert.ToDateTime(HttpContext.Current.Request["time"]));
        c3Smscond.startTime = DateTime.Now.AddDays(-7);

        if (c3Smscond.businssAnd != null)
        {
            c3Smscond.businssAnd += " and ";
        }
        c3Smscond.businssAnd += " gis_LAT_o >0 and gis_lon_o >0";

        if (!string.IsNullOrEmpty(HttpContext.Current.Request["key"]))
        {
            string key = HttpContext.Current.Request["key"].ToUpper();
            if (!string.IsNullOrEmpty(key))
            {
                c3Smscond.businssAnd += " and  locomotive_code like '%" + key + "%'";
            }
        }

        List<C3_Sms> list = Api.ServiceAccessor.GetSmsService().getC3SmsbyCondition_OnelocaOneData(c3Smscond);

        StringBuilder Json = new StringBuilder();
        Json.Append("[");
        for (int i = 0; i < list.Count; i++)
        {
            try
            {
                if (list[i].GIS_LON_O != 0)
                {
                    string wz = PublicMethod.GetPositionBySMSID(list[i]);
                    string wz2 = PublicMethod.GetPositionBySMSID_2(list[i]);

                    if (list[i].GIS_LON == 0)
                    {
                        string bPoint = CoordinateConvert.convert2B(list[i].GIS_LON_O.ToString(), list[i].GIS_LAT_O.ToString());
                        if (bPoint != null)
                        {
                            if (bPoint.Split(',')[0] != "0" && bPoint.Split(',')[0] != "")
                            {
                                list[i].GIS_LON = Convert.ToDouble(bPoint.Split(',')[0]);
                                list[i].GIS_LAT = Convert.ToDouble(bPoint.Split(',')[1]);

                                Api.ServiceAccessor.GetSmsService().updateC3Sms(list[i]);//得到的结果保存起来。

                            }
                        }
                    }

                    Api.Foundation.entity.Foundation.Locomotive m_loco = Api.Util.Common.getLocomotiveInfo(list[i].LOCOMOTIVE_CODE);

                    Json.Append("{");
                    Json.Append("WZ:\"" + wz + "\",");//位置信息
                    Json.Append("WZ2:\"" + wz2 + "\",");//位置信息

                    Json.Append("deviceVersion:\"" + m_loco.VENDOR + "\"");//设备版本号
                    Json.Append(",");
                    Json.Append("CROSSING_NO:\"" + list[i].ROUTING_NO + "\"");//交路号
                    Json.Append(",");
                    Json.Append("KM_MARK:\"" + list[i].KM_MARK + "\"");//公里标
                    Json.Append(",");
                    if (list[i].GIS_LON != 0)
                    {
                        Json.Append("GIS_X:\"" + list[i].GIS_LON + "\"");//经度
                        Json.Append(",");
                        Json.Append("GIS_Y:\"" + list[i].GIS_LAT + "\"");//纬度
                        Json.Append(",");
                    }
                    else
                    {
                        Json.Append("GIS_X:\"" + list[i].GIS_LON_O + "\"");//经度
                        Json.Append(",");
                        Json.Append("GIS_Y:\"" + list[i].GIS_LAT_O + "\"");//纬度
                        Json.Append(",");
                    }
                    Json.Append("GIS_X_O:\"" + list[i].GIS_LON_O + "\"");//经度
                    Json.Append(",");
                    Json.Append("GIS_Y_O:\"" + list[i].GIS_LAT_O + "\"");//纬度
                    Json.Append(",");
                    Json.Append("SPEED:\"" + myfiter.GetSpeed(list[i].SPEED) + "\"");//速度
                    Json.Append(",");
                    Json.Append("DIRECTION:\"" + list[i].DIRECTION + "\"");//速度
                    Json.Append(",");
                    Json.Append("TRAIN_NO:\"" + list[i].LOCOMOTIVE_CODE + "\"");//设备号
                    Json.Append(",");
                    Json.Append("TRAIN_STATUS:\"" + "" + "\"");//运行状态   不要了。
                    Json.Append(",");

                    Json.Append("BOW_UPDOWN_STATUS:\"" + myfiter.GetBowStatus(list[i], m_loco.DEVICE_BOW_RELATIONS) + "\"");//运行状态  GIS_LON_O
                    Json.Append(",");
                    Json.Append("STATION_NO:\"" + list[i].STATION_NO + "\"");//车站号
                    Json.Append(",");
                    Json.Append("DETECT_TIME:\"" + list[i].DETECT_TIME + "\"");//时间
                    Json.Append(",");
                    Json.Append("SATELLITE_NUM:\"" + list[i].SATELLITE_NUM + "\"");//卫星数
                    Json.Append(",");
                    Json.Append("SENSOR_TEMP:\"" + myfiter.GetTEMP_ENV(list[i]) + (myfiter.GetTEMP_ENV(list[i]) == "温度传感器正在连接" ? "" : "") + "\"");//温度
                    Json.Append(",");
                    Json.Append("IRV_TEMP:\"" + myfiter.GetTEMP_MAX(list[i]) + (myfiter.GetTEMP_MAX(list[i]) == "红外设备正在连接" ? "" : "") + "\"");//红外温度
                    Json.Append(",");
                    Json.Append("LINE_HEIGHT:\"" + myfiter.GetLINE_HEIGHT(list[i].LINE_HEIGHT_1) + (myfiter.GetLINE_HEIGHT(list[i].LINE_HEIGHT_1) == "" ? "" : "") + "\"");//导高
                    Json.Append(",");
                    Json.Append("PULLING_VALUE:\"" + myfiter.GetPULLING_VALUE(list[i].PULLING_VALUE_1) + (myfiter.GetPULLING_VALUE(list[i].PULLING_VALUE_1) == "" ? "" : "") + "\"");//导高
                    Json.Append(",");
                    Json.Append("ID:\"" + list[i].ID + "\"");//
                    Json.Append(",");
                    Json.Append("BUREAU_CODE:\"" + list[i].BUREAU_CODE + "\",");//局
                    Json.Append("BUREAU_NAME:\"" + list[i].BUREAU_NAME + "\",");//局名称
                    Json.Append("P_ORG_NAME:\"" + list[i].P_ORG_NAME + "\",");//段名
                    Json.Append("ROUTING_CODE:\"" + list[i].AREA_NO + "\"");//区段号
                    Json.Append(",");
                    Json.Append("LINE_NAME:\"" + list[i].LINE_NAME + "\"");//线路


                    if (list[i].BUREAU_CODE != "" && list[i].BUREAU_CODE != null && list[i].ROUTING_NO != "" && list[i].ROUTING_NO != null && list[i].STATION_NO != "" && list[i].STATION_NO != null)
                    {
                        Api.Foundation.entity.Foundation.RoutingStationRel RoutingStation = Api.Util.Common.getRoutingStationRel(list[i].BUREAU_CODE, list[i].ROUTING_NO, list[i].STATION_NO);
                        if (RoutingStation != null)
                        {

                            Json.Append(",");
                            Json.Append("STATION_NAME:\"" + RoutingStation.STATION_NAME + "\"");//站名
                        }
                        else
                        {
                            Json.Append(",");
                            Json.Append("STATION_NAME:\"" + "" + "\"");//站名
                        }

                    }
                    else
                    {
                        Json.Append(",");
                        Json.Append("STATION_NAME:\"" + "" + "\"");//站名
                    }
                    if (i < list.Count - 1)
                    {
                        Json.Append("},");
                    }
                    else
                    {
                        Json.Append("}");
                    }
                }
            }
            catch (Exception ex)
            {
                log4net.ILog log2 = log4net.LogManager.GetLogger("3C地图数据加载,设备遍历生成json");
                log2.Error("Error", ex);
            }
        }

        Json.Append("]");
        object myObj = JsonConvert.DeserializeObject(Json.ToString());
        context.Response.Write(myObj);
    }







    /// <summary>
    /// 设置轨迹行别
    /// </summary>
    private void setDirection(string deviceid, DateTime startdate, DateTime enddate)
    {
        C3_SmsCond c3Smscond = new C3_SmsCond();
        c3Smscond.LOCOMOTIVE_CODE = deviceid;
        c3Smscond.businssAnd = " 1=1 ";
        c3Smscond.orderBy = " detect_time desc";
        string jl = HttpContext.Current.Request.QueryString["jl"].ToString();
        if (!string.IsNullOrEmpty(jl) && jl != "null")
        {
            c3Smscond.ROUTING_NO = jl;
        }
        string txtqz = HttpContext.Current.Request["txtqz"];//区站
        string direction = HttpContext.Current.Request["direction"];//行别
        string startSpeed = HttpContext.Current.Request["startSpeed"];//最小速度
        string endSpeed = HttpContext.Current.Request["endSpeed"]; //最大速度
        string xb = HttpContext.Current.Request["xb"];//区站
        if (!string.IsNullOrEmpty(txtqz) && txtqz != "undefined")
        {
            //c3Smscond.POSITION_NAME = txtqz;
            if (!string.IsNullOrEmpty(c3Smscond.businssAnd))
            {
                c3Smscond.businssAnd += " and ";
            }
            if (txtqz.IndexOf("－") > -1)
            {
                string[] charList = txtqz.Split('－');
                c3Smscond.businssAnd += string.Format(" (POSITION_NAME='{0}' or POSITION_NAME='{1}' or POSITION_NAME='{2}' or POSITION_NAME='{3}')", charList[0] + "－" + charList[1], charList[1] + "－" + charList[0], charList[0] + "-" + charList[1], charList[1] + "-" + charList[0]);
            }
            else
            {
                c3Smscond.businssAnd += string.Format(" POSITION_NAME='{0}'", txtqz);
            }
        }
        if (!string.IsNullOrEmpty(direction) && direction != "undefined")
        {
            if (direction == "无行别")
            {
                c3Smscond.businssAnd += " and direction is null ";
            }
            else
            {
                if (direction == "-1")
                {
                    c3Smscond.businssAnd += " and DIRECTION is null";
                }
                else if (!string.IsNullOrEmpty(direction))
                {
                    c3Smscond.DIRECTION = direction;
                }

            }
        }
        if (!string.IsNullOrEmpty(startSpeed) && startSpeed != "undefined")
        {
            c3Smscond.startSpeed = Convert.ToInt32(startSpeed);
        }
        if (!string.IsNullOrEmpty(endSpeed) && endSpeed != "undefined")
        {
            c3Smscond.endSpeed = Convert.ToInt32(endSpeed);
        }

        if (startdate != DateTime.MinValue && enddate != DateTime.MinValue)
        {
            c3Smscond.endTime = enddate;
            c3Smscond.startTime = startdate;
        }
        else
        {
            c3Smscond.page = 1;
            c3Smscond.pageSize = 1;
            c3Smscond.businssAnd += " and GIS_LON_O >73  and GIS_LON_O <135 and GIS_LAT_O>10 and GIS_LAT_O<54";
            c3Smscond.orderBy = " detect_time desc";
            //获取短信对象(为了取时间排序第一条)
            List<C3_Sms> listc3sms = Api.ServiceAccessor.GetSmsService().getC3SmsbyCondition(c3Smscond);
            if (startdate == DateTime.MinValue || enddate == DateTime.MinValue)
            {
                if (listc3sms.Count > 0)
                {
                    c3Smscond.endTime = listc3sms[0].DETECT_TIME;
                    c3Smscond.startTime = Convert.ToDateTime(listc3sms[0].DETECT_TIME.ToString("yyyy-MM-dd 00:00:00")); //listc3sms[0].DETECT_TIME.AddHours(-3);
                }
            }

        }

        //获取指定时间段的设备短信JSON串
        c3Smscond.page = 0; //取消分页条件
        c3Smscond.pageSize = 0;
        c3Smscond.businssAnd += " and GIS_LON_O >73  and GIS_LON_O <135 and GIS_LAT_O>10 and GIS_LAT_O<54";
        c3Smscond.orderBy = " detect_time asc";
        List<C3_Sms> list = Api.ServiceAccessor.GetSmsService().getC3Sms_tvJsonbyCondition(c3Smscond);
        string id = "";
        foreach (C3_Sms item in list)
        {
            id += string.Format(",'{0}'", item.ID);
        }
        C3_Sms sms = new C3_Sms();
        id = id.Substring(1);
        //sms.DIRECTION = xb;
        string sql = "";
        if (xb == "无行别")
            sql = string.Format("UPDATE C3_SMS SET DIRECTION = null,POS_CONFIRMED='9' WHERE ID in ({0})", id);
        else
            sql = string.Format("UPDATE C3_SMS SET DIRECTION = '{0}',POS_CONFIRMED='9' WHERE ID in ({1})", xb, id);
        if (DbHelperOra.ExecuteSql(sql) > 0)
        {
            HttpContext.Current.Response.Write("true");

            Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "轨迹行别设置", Api.Util.Public.FunNames.报警监控.ToString(), Public.GetLoginIP, "对" + deviceid + "的行别进行了设置", "", true);
        }
        else
        {
            HttpContext.Current.Response.Write("false");

            Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "轨迹行别设置", Api.Util.Public.FunNames.报警监控.ToString(), Public.GetLoginIP, "对" + deviceid + "的行别进行了设置", "", false);
        }
        //bool result = Api.ServiceAccessor.GetSmsService().setDirectionC3Sms(sms);


    }

    /// <summary>
    /// 设置轨迹行别
    /// </summary>
    private void setStatus(string devId, DateTime startdate, DateTime enddate, string ID, string status, string point1lng, string point1lat, string point2lng, string point2lat, string _linecode, string _positioncode)
    {

        string sql = "";
        string where = " 1=1 ";
        string ju = HttpContext.Current.Request["ju"];//局
        string duan = HttpContext.Current.Request["duan"];//段
        if (ID == "")
        {
            string jl = HttpContext.Current.Request.QueryString["jl"].ToString();
            string txtline = HttpContext.Current.Request["txtline"];//线路
            where += " and locomotive_code='" + devId + "'";
            if (!string.IsNullOrEmpty(jl) && jl != "null")
            {
                where += " and ROUTING_NO='" + jl + "'";
            }
            string direction = HttpContext.Current.Request["direction"];//行别

            if (!string.IsNullOrEmpty(direction) && direction != "undefined")
            {
                if (direction == "无行别")
                {
                    where += " and direction is null ";
                }
                else
                {
                    if (direction == "-1")
                    {
                        where += " and DIRECTION is null";
                    }
                    else if (!string.IsNullOrEmpty(direction))
                    {
                        where += " and DIRECTION ='" + direction + "'";
                    }

                }
            }
            if (!string.IsNullOrEmpty(txtline) && txtline != "undefined" && txtline != "0")
            {
                if (txtline == "-1")
                {
                    where += " and LINE_CODE is null ";
                }
                else
                {
                    where += " and LINE_CODE ='" + txtline + "' ";
                }
            }

            if (startdate != DateTime.MinValue && enddate != DateTime.MinValue)
            {
                where += " and detect_time>=to_date('" + startdate + "','yyyy-MM-dd HH24:mi:ss')";
                where += " and detect_time<=to_date('" + enddate + "','yyyy-MM-dd HH24:mi:ss')";
            }


        }
        string pos_confirmed = "";
        sql = string.Format("UPDATE C3_SMS SET id=id");
        if (status == "")
            sql += string.Format(" , INVALID_TRACK = null ");
        else if (status == "0")
            sql += string.Format(" , INVALID_TRACK = '{0}'", "0");
        else if (status == "1")
            sql += string.Format(" , INVALID_TRACK = '{0}'", "1");
        if (_linecode != "0")
        {
            sql += string.Format(" , LINE_CODE = '{0}'", _linecode);
            sql += string.Format(" , LINE_NAME = '{0}'", Api.Util.Common.getLineInfo(_linecode).LINE_NAME);
            pos_confirmed = "9";
        }
        if (ju != "0")
        {
            sql += string.Format(" , bureau_code = '{0}'", ju);
            sql += string.Format(" , bureau_name = '{0}'", Api.Util.Common.getOrgInfo(ju).ORG_NAME);
            pos_confirmed = "9";
        }
        if (duan != "0")
        {
            sql += string.Format(" , p_org_code = '{0}'", duan);
            sql += string.Format(" , p_org_name = '{0}'", Api.Util.Common.getOrgInfo(duan).ORG_NAME);
            pos_confirmed = "9";
        }
        if (!string.IsNullOrEmpty(_positioncode))
        {
            StationSectionCond staCond = new StationSectionCond();
            staCond.POSITION_NAME = _positioncode;
            IList<StationSection> list = Api.Util.Common.getStationSectionInfoFromCache(staCond);
            if (list.Count > 0)
            {
                sql += string.Format(" , POSITION_CODE = '{0}'", list[0].POSITION_CODE);
                sql += string.Format(" , POSITION_NAME = '{0}'", _positioncode);
                pos_confirmed = "9";
            }
        }
        if (!string.IsNullOrEmpty(pos_confirmed))
        {
            sql += string.Format(" , POS_CONFIRMED = '9'");
        }
        sql += string.Format(" where  {0}", where);
        if (DbHelperOra.ExecuteSql(sql) > 0)
        {
            HttpContext.Current.Response.Write("true");

            Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "原始轨迹编辑", Api.Util.Public.FunNames.报警监控.ToString(), Public.GetLoginIP, "对" + devId + "的原始轨迹进行了编辑", "", true);
        }
        else
        {
            HttpContext.Current.Response.Write("false");

            Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "原始轨迹编辑", Api.Util.Public.FunNames.报警监控.ToString(), Public.GetLoginIP, "对" + devId + "的原始轨迹进行了编辑", "", false);
        }
        //bool result = Api.ServiceAccessor.GetSmsService().setDirectionC3Sms(sms);


    }

    /// <summary>
    /// 获取C3数据
    /// </summary>
    /// <param name="deviceid">设备号，多车不传车号</param>
    /// <param name="type">类型1：取轨迹 2：发短信</param>
    /// <param name="context"></param>
    private void getMapC3ProcessDataPoint(string deviceid, String type, HttpContext context, DateTime startdate, DateTime enddate)
    {
        switch (type)
        {
            //获取轨迹数据
            case "1":
                C3_SmsCond c3Smscond = new C3_SmsCond();
                c3Smscond = GetC3SmsCond(deviceid, context, startdate, enddate, c3Smscond,1);
                List<C3_Sms> list = Api.ServiceAccessor.GetSmsService().getC3Sms_tvJsonbyCondition(c3Smscond);


                if (list.Count == 0)
                {
                    c3Smscond = GetC3SmsCond(deviceid, context, startdate, enddate, c3Smscond,2);
                    list = Api.ServiceAccessor.GetSmsService().getC3Sms_tvJsonbyCondition(c3Smscond);
                }

                StringBuilder Json = new StringBuilder();
                Json.Append("[");
                Json.Append("[");
                if (list.Count > 0)
                {
                    //地图中心点。最后一个点。
                    Json.Append("{\"GIS_X\":\"" + list[list.Count - 1].GIS_LON_O.ToString() + "\",\"GIS_Y\":\"" + list[list.Count - 1].GIS_LAT_O.ToString() + "\"},");
                }
                else
                {
                    Json.Append("{\"GIS_X\":\"" + 0 + "\",\"GIS_Y\":\"" + 0 + "\"},");
                }

                //判断是否有相同时间节点的数据和设置只存到分钟的时间字段（用于播放是时间计数用）
                for (int j = 0; j < list.Count; j++)
                {
                    if (j != 0 && list[j - 1].DETECT_TIME.ToString("yyyy-MM-dd HH:mm") == list[j].DETECT_TIME.ToString("yyyy-MM-dd HH:mm"))
                    {
                        list[j].MY_STR_7 = "时间相同";
                    }
                    list[j].MY_STR_5 = list[j].DETECT_TIME.ToString("yyyy-MM-dd HH:mm");
                }
                ///分组车号
                var data = (from a in list
                            group a by new { a.LOCOMOTIVE_CODE } into b
                            select new
                            {
                                LOCOMOTIVE_CODE = b.Key.LOCOMOTIVE_CODE
                            }).OrderBy(t => t.LOCOMOTIVE_CODE);
                StringBuilder json = new StringBuilder();
                json.Append("[");
                int i = 1;
                //查询每个车的JSON
                foreach (var anItem in data)
                {
                    string LOCOMOTIVE_CODE = anItem.LOCOMOTIVE_CODE;
                    IEnumerable<C3_Sms> largeNumbersQuery = list.Where(c => c.LOCOMOTIVE_CODE == LOCOMOTIVE_CODE && c.MY_STR_7!="时间相同");

                    List<C3_Sms> CarItemSMSList = largeNumbersQuery.ToList<C3_Sms>();

                    if (context.Request.QueryString["_type"] == "OK" && list.Count > 0 && CarItemSMSList.Count > 0)
                    {
                        //图形化轨迹页面，  不传为原始轨迹页面。

                        //过滤算法。
                        my_gps.FiterErrorData(CarItemSMSList);
                    }


                    StringBuilder SmsJson = GetC3SmsJson_new(CarItemSMSList);
                    json.Append("{\"SmsJson\":" + SmsJson.ToString() + "},");
                    i++;
                };
                json.Append("]");
                Json.Append("{\"JCINFO\":" + json.ToString() + "},");

                // 按 分钟数 分组  并组合JSON
                var datalist = (from a in list
                                group a by new { a.MY_STR_5 } into b
                                select new
                                {
                                    MY_STR_5 = b.Key.MY_STR_5
                                }).OrderBy(t => t.MY_STR_5);
                int n = 1;
                StringBuilder Timejson = new StringBuilder();
                Timejson.Append("[");
                foreach (var anItem in datalist)
                {
                    string MY_STR_5 = anItem.MY_STR_5;
                    Timejson.Append("{");
                    Timejson.Append("Dtime:\"" + MY_STR_5 + "\"");//经度
                    Timejson.Append(",");
                    Timejson.Append("number:\"" + n + "\"");//纬度
                    Timejson.Append("},");
                    n++;
                };
                Timejson.Append("]");
                Json.Append("{\"Dtime\":" + Timejson.ToString() + "},");
                Json.Append("]");
                object myObj = JsonConvert.DeserializeObject(myfiter.json_RemoveSpecialStr(Json.ToString()));
                string re = myObj.ToString();

                string remove = HttpContext.Current.Request["remove"];
                if (!string.IsNullOrEmpty(remove))
                {
                    re = myfiter.RemoveHTML(re, 0);
                }

                context.Response.Write(re);

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
    /// <summary>
    /// 拼接查询c3sms对象
    /// </summary>
    /// <param name="deviceid"></param>
    /// <param name="context"></param>
    /// <param name="startdate"></param>
    /// <param name="enddate"></param>
    /// <param name="c3Smscond"></param>
    /// <returns></returns>
    private static C3_SmsCond GetC3SmsCond(string deviceid, HttpContext context, DateTime startdate, DateTime enddate, C3_SmsCond c3Smscond,int group)
    {
        if (!string.IsNullOrEmpty(deviceid))
            c3Smscond.LOCOMOTIVE_CODE = deviceid;
        c3Smscond.orderBy = " detect_time desc";
        c3Smscond.businssAnd = " 1=1 ";
        //string jl = context.Request.QueryString["jl"].ToString();
        //if (!string.IsNullOrEmpty(jl) && jl != "null")
        //{
        //    c3Smscond.ROUTING_NO = jl;
        //}
        if (!string.IsNullOrEmpty(context.Request.QueryString["jl"]))
        {
            string jl = context.Request.QueryString["jl"].ToString();
            if (jl != "null")
            {
                c3Smscond.ROUTING_NO = jl;
            }
        }
        string txtqz = HttpContext.Current.Request["txtqz"];//区站
        string txtline = HttpContext.Current.Request["txtline"];//线路
        string direction = HttpContext.Current.Request["direction"];//行别
        string startSpeed = HttpContext.Current.Request["startSpeed"];//最小速度
        string endSpeed = HttpContext.Current.Request["endSpeed"]; //最大速度

        string alarmType = HttpContext.Current.Request["alarmType"]; //报警类型

        if (!string.IsNullOrEmpty(txtqz) && txtqz != "undefined")
        {
            //   c3Smscond.POSITION_NAME = txtqz;
            if (!string.IsNullOrEmpty(c3Smscond.businssAnd))
            {
                c3Smscond.businssAnd += " and ";
            }
            if (txtqz.IndexOf("－") > -1)
            {
                string[] charList = txtqz.Split('－');
                c3Smscond.businssAnd += string.Format(" (POSITION_NAME='{0}' or POSITION_NAME='{1}' or POSITION_NAME='{2}' or POSITION_NAME='{3}')", charList[0] + "－" + charList[1], charList[1] + "－" + charList[0], charList[0] + "-" + charList[1], charList[1] + "-" + charList[0]);
            }
            else
            {
                c3Smscond.businssAnd += string.Format(" POSITION_NAME='{0}'", txtqz);
            }


        }
        if (!string.IsNullOrEmpty(direction) && direction != "undefined"&& direction != "0")
        {
            if (direction == "-1" || direction == "无行别"|| direction =="交路无行别")
            {
                if (Api.Util.Common.FunEnable("Fun_NullDirection") == false)
                {
                    if (direction == "交路无行别")
                    {
                        c3Smscond.businssAnd += " and DIRECTION is null";
                    }
                    else
                    {
                        c3Smscond.businssAnd += " and (DIRECTION is null and line_code is null)";
                    }
                }
                else
                {
                    c3Smscond.businssAnd += " and DIRECTION is null";
                }
            }
            else if (!string.IsNullOrEmpty(direction))
            {
                c3Smscond.DIRECTION = direction;
            }
        }
        //if (Api.Util.Common.FunEnable("Fun_NullDirection") == false)
        //{
        //    if (string.IsNullOrEmpty(direction))
        //    {
        //        if (!string.IsNullOrEmpty(c3Smscond.businssAnd))
        //        {
        //            c3Smscond.businssAnd += " and ";
        //        }
        //        c3Smscond.businssAnd += "(line_code is null or (line_code is not null  and DIRECTION is not null))";
        //    }
        //}
        if (!string.IsNullOrEmpty(txtline) && txtline != "undefined" && txtline != "0")
        {
            if (txtline == "-1"|| txtline == "wu")
            {
                c3Smscond.businssAnd += " and line_code is null  ";
            }
            else
            {
                c3Smscond.LINE_CODE = txtline;
            }
        }
        if (!string.IsNullOrEmpty(startSpeed) && startSpeed != "undefined")
        {
            c3Smscond.startSpeed = Convert.ToInt32(startSpeed);
        }
        if (!string.IsNullOrEmpty(endSpeed) && endSpeed != "undefined")
        {
            c3Smscond.endSpeed = Convert.ToInt32(endSpeed);
        }

        if (startdate != DateTime.MinValue && enddate != DateTime.MinValue)
        {
            c3Smscond.endTime = enddate;
            c3Smscond.startTime = startdate;
        }
        else
        {
            //取实时车数据
            //c3Smscond.page = 1;
            //c3Smscond.pageSize = 1;
            //c3Smscond.businssAnd += " and GIS_LON_O >73  and GIS_LON_O <135 and GIS_LAT_O>10 and GIS_LAT_O<54";
            //c3Smscond.orderBy = " detect_time desc";
            ////获取短信对象(为了取时间排序第一条)
            //List<C3_Sms> listc3sms = Api.ServiceAccessor.GetSmsService().getC3SmsbyCondition(c3Smscond);
            //if (startdate == DateTime.MinValue || enddate == DateTime.MinValue)
            //{
            //    if (listc3sms.Count > 0)
            //    {
            //        c3Smscond.endTime = listc3sms[0].DETECT_TIME;
            //        c3Smscond.startTime = Convert.ToDateTime(listc3sms[0].DETECT_TIME.ToString("yyyy-MM-dd 00:00:00")); //listc3sms[0].DETECT_TIME.AddHours(-3);
            //    }
            //}

        }

        //获取指定时间段的设备短信JSON串
        c3Smscond.page = 0; //取消分页条件
        c3Smscond.pageSize = 0;
        c3Smscond.orderBy = " detect_time asc";
        string _type = context.Request.QueryString["_type"];
        if (_type == "OK")
        {
            c3Smscond.businssAnd += " and GIS_LON_O >73  and GIS_LON_O <135 and GIS_LAT_O>10 and GIS_LAT_O<54";

            c3Smscond.businssAnd += " and  nvl(INVALID_TRACK,0) !='1'";
        }
        //16编组 只显示空和1的数据

        //if (group == 1)
        //{
        //    //第一组状态数据
        //    c3Smscond.businssAnd += " and ( device_group_no is null or device_group_no ='1' )";
        //}
        //else
        //{
        //    //第二组状态数据
        //    c3Smscond.businssAnd += " and device_group_no ='2' ";
        //}
        //  List<C3_Sms> list = Api.ServiceAccessor.GetSmsService().getC3SmsJsonbyCondition(c3Smscond);
        return c3Smscond;
    }
    /// <summary>
    /// GPS坐标转换并更新数据库
    /// </summary>
    /// <param name="list">数据源</param>
    /// <param name="GPS_X_NAME">百度经度列名</param>
    /// <param name="GPS_Y_NAME">百度纬度列名</param>
    /// <param name="ID_NAME">主键名</param>
    /// <param name="TABLE_NAME">表名</param>
    /// <returns></returns>
    public List<CoordinateConvert.Point2> GPSTranAndUpdate_list (List<C3_Sms> list,string GPS_X_NAME,string GPS_Y_NAME,string ID_NAME,string TABLE_NAME)
    {
        List<CoordinateConvert.Point2> oldlist = new List<CoordinateConvert.Point2>();
        List<CoordinateConvert.Point2> relist = new List<CoordinateConvert.Point2>();
        foreach (C3_Sms c3sms in list)
        {
            if (c3sms.GIS_LON == 0 || c3sms.GIS_LAT == 0)
            {
                CoordinateConvert.Point2 point2 = new CoordinateConvert.Point2();
                point2.x_o = c3sms.GIS_LON_O.ToString();
                point2.y_o = c3sms.GIS_LAT_O.ToString();
                point2.ID = c3sms.ID;
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

    private StringBuilder GetC3SmsJson(List<C3_Sms> list)
    {
        StringBuilder json = new StringBuilder();
        json.Append("[");

        string oldTime = "";

        foreach (C3_Sms c3Sms in list)
        {
            Api.Foundation.entity.Foundation.Locomotive m_loco = Api.Util.Common.getLocomotiveInfo(c3Sms.LOCOMOTIVE_CODE);


            if (oldTime == c3Sms.DETECT_TIME.ToString("yyyy-MM-dd HH:mm"))
            {
                continue;
            }

            oldTime = c3Sms.DETECT_TIME.ToString("yyyy-MM-dd HH:mm");

            string wz = PublicMethod.GetPositionBySMSID(c3Sms);
            wz += "(卫星数：" + c3Sms.SATELLITE_NUM + ")";
            string ROUTING_NO = myfiter.GetRouingNo(c3Sms.ROUTING_NO);
            if (c3Sms.MY_STR_7 == "时间相同")
            {
                continue;
            }
            json.Append("{");
            json.Append("IsAbnormal:\"" + c3Sms.MY_STR_8 + "\",");//“异常点” 或为空
            json.Append("CROSSING_NO:\"" + ROUTING_NO + "\"");//交路号
            json.Append(",");
            json.Append("KM_MARK:\"" + c3Sms.KM_MARK + "\"");//公里标
            if (c3Sms.GIS_LON != 0)
            {
                json.Append(",");
                json.Append("GIS_X:\"" + c3Sms.GIS_LON + "\"");//经度
                json.Append(",");
                json.Append("GIS_Y:\"" + c3Sms.GIS_LAT + "\"");//纬度
            }
            else
            {
                string bPoint = CoordinateConvert.convert2B(c3Sms.GIS_LON_O.ToString(), c3Sms.GIS_LAT_O.ToString());
                if (bPoint != null)
                {
                    if (bPoint.Split(',')[0] != "0" && judge(bPoint.Split(',')[0]))
                    {

                        c3Sms.GIS_LON = Convert.ToDouble(bPoint.Split(',')[0]);
                        c3Sms.GIS_LAT = Convert.ToDouble(bPoint.Split(',')[1]);

                        Api.ServiceAccessor.GetSmsService().updateC3Sms(c3Sms);//得到的结果保存起来。


                        json.Append(",");
                        json.Append("GIS_X:\"" + bPoint.Split(',')[0] + "\"");//经度
                        json.Append(",");
                        json.Append("GIS_Y:\"" + bPoint.Split(',')[1] + "\"");//纬度
                    }
                    else
                    {
                        json.Append(",");
                        json.Append("GIS_X:\"" + c3Sms.GIS_LON_O + "\"");//经度
                        json.Append(",");
                        json.Append("GIS_Y:\"" + c3Sms.GIS_LAT_O + "\"");//纬度
                    }
                }
                else
                {
                    json.Append(",");
                    json.Append("GIS_X:\"" + c3Sms.GIS_LON_O + "\"");//经度
                    json.Append(",");
                    json.Append("GIS_Y:\"" + c3Sms.GIS_LAT_O + "\"");//纬度
                }

            }
            json.Append(",");
            json.Append("GIS_X_O:\"" + c3Sms.GIS_LON_O + "\"");//经度
            json.Append(",");
            json.Append("GIS_Y_O:\"" + c3Sms.GIS_LAT_O + "\"");//纬度
            json.Append(",");
            json.Append("SPEED:\"" + c3Sms.SPEED + "\"");//速度
            json.Append(",");
            json.Append("DIRECTION:\"" + c3Sms.DIRECTION + "\"");//行别
            json.Append(",");
            json.Append("TRAIN_NO:\"" + c3Sms.LOCOMOTIVE_CODE + "\"");//设备号
            json.Append(",");
            json.Append("BOW_UPDOWN_STATUS:\"" + myfiter.GetBowStatus(c3Sms, m_loco.DEVICE_BOW_RELATIONS) + "\"");//弓状态
            json.Append(",");
            //json.Append("TRAIN_STATUS:\"" + c3Sms.TRAIN_STATUS + "\"");//运行状态
            //json.Append(",");
            json.Append("WZ:\"" + wz + "\"");//位置
            json.Append(",");
            json.Append("Dtime:\"" + c3Sms.DETECT_TIME.ToString("yyyy-MM-dd HH:mm") + "\"");//位置
            json.Append(",");
            json.Append("STATION_NO:\"" + c3Sms.STATION_NO + "\"");//车站号
            json.Append(",");
            json.Append("DETECT_TIME:\"" + c3Sms.DETECT_TIME + "\"");//时间
            json.Append(",");
            json.Append("SENSOR_TEMP:\"" + myfiter.GetTEMP_ENV(c3Sms) + "\"");//温度
            json.Append(",");
            json.Append("SATELLITE_NUM:\"" + c3Sms.SATELLITE_NUM + "\"");//SATELLITE_NUM卫星数
            json.Append(",");
            json.Append("IRV_TEMP:\"" + myfiter.GetTEMP_MAX(c3Sms) + "\"");//红外温度
            json.Append(",");
            json.Append("LINE_HEIGHT:\"" + myfiter.GetLINE_HEIGHT(c3Sms.LINE_HEIGHT_1) + "\"");//导高
            json.Append(",");
            json.Append("PULLING_VALUE:\"" + myfiter.GetPULLING_VALUE(c3Sms.PULLING_VALUE_1) + "\"");//导高
            json.Append(",");
            json.Append("INVALID_TRACK:\"" + c3Sms.INVALID_TRACK + "\"");//是否可用
            json.Append(",");
            json.Append("ID:\"" + c3Sms.ID + "\"");//ID
            json.Append(",");
            json.Append("BUREAU_CODE:\"" + c3Sms.BUREAU_CODE + "\"");//局


            json.Append(",LINE_NAME:\"" + c3Sms.MY_STR_1 + "\"");//线路


            json.Append(",ROUTING_CODE:\"" + c3Sms.MY_STR_2 + "\"");//区站


            json.Append(",STATION_NAME:\"" + c3Sms.MY_STR_4 + "\"");//站名



            json.Append("},");

        }


        json.Append("]");

        return json;
    }
    private StringBuilder GetC3SmsJson_new(List<C3_Sms> list)
    {
        StringBuilder json = new StringBuilder();
        List<CoordinateConvert.Point2> newlist = new List<CoordinateConvert.Point2>();
        newlist = GPSTranAndUpdate_list(list,"GIS_LON","GIS_LAT","ID","C3_SMS");
        int i = 0;
        json.Append("[");

        string oldTime = "";

        foreach (C3_Sms c3Sms in list)
        {
            Api.Foundation.entity.Foundation.Locomotive m_loco = Api.Util.Common.getLocomotiveInfo(c3Sms.LOCOMOTIVE_CODE);


            if (oldTime == c3Sms.DETECT_TIME.ToString("yyyy-MM-dd HH:mm"))
            {
                if (c3Sms.GIS_LON == 0 && newlist.Count > 0 && i < newlist.Count)
                {
                    i = i + 1;
                }
                continue;
            }

            oldTime = c3Sms.DETECT_TIME.ToString("yyyy-MM-dd HH:mm");

            string wz = PublicMethod.GetPositionBySMSID(c3Sms);
            wz += "(卫星数：" + c3Sms.SATELLITE_NUM + ")";
            string ROUTING_NO = myfiter.GetRouingNo(c3Sms.ROUTING_NO);
            if (c3Sms.MY_STR_7 == "时间相同")
            {
                if (c3Sms.GIS_LON == 0 && newlist.Count > 0 && i < newlist.Count)
                {
                    i = i + 1;
                }
                continue;
            }
            json.Append("{");
            json.Append("IsAbnormal:\"" + c3Sms.MY_STR_8 + "\",");//“异常点” 或为空
            json.Append("CROSSING_NO:\"" + ROUTING_NO + "\"");//交路号
            json.Append(",");
            json.Append("KM_MARK:\"" + c3Sms.KM_MARK + "\"");//公里标
            if (c3Sms.GIS_LON != 0)
            {
                json.Append(",");
                json.Append("GIS_X:\"" + c3Sms.GIS_LON + "\"");//经度
                json.Append(",");
                json.Append("GIS_Y:\"" + c3Sms.GIS_LAT + "\"");//纬度
            }
            else
            {
                if (newlist.Count>0&&i<newlist.Count)
                {
                    if (c3Sms.ID == newlist[i].ID)
                    {

                        c3Sms.GIS_LON = Convert.ToDouble(newlist[i].x);
                        c3Sms.GIS_LAT = Convert.ToDouble(newlist[i].y);

                        json.Append(",");
                        json.Append("GIS_X:\"" + newlist[i].x + "\"");//经度
                        json.Append(",");
                        json.Append("GIS_Y:\"" + newlist[i].y + "\"");//纬度
                    }
                    else
                    {
                        json.Append(",");
                        json.Append("GIS_X:\"" + c3Sms.GIS_LON_O + "\"");//经度
                        json.Append(",");
                        json.Append("GIS_Y:\"" + c3Sms.GIS_LAT_O + "\"");//纬度
                    }
                    i = i + 1;
                }
                else
                {
                    json.Append(",");
                    json.Append("GIS_X:\"" + c3Sms.GIS_LON_O + "\"");//经度
                    json.Append(",");
                    json.Append("GIS_Y:\"" + c3Sms.GIS_LAT_O + "\"");//纬度
                }

            }
            json.Append(",");
            json.Append("GIS_X_O:\"" + c3Sms.GIS_LON_O + "\"");//经度
            json.Append(",");
            json.Append("GIS_Y_O:\"" + c3Sms.GIS_LAT_O + "\"");//纬度
            json.Append(",");
            json.Append("SPEED:\"" + c3Sms.SPEED + "\"");//速度
            json.Append(",");
            json.Append("DIRECTION:\"" + c3Sms.DIRECTION + "\"");//行别
            json.Append(",");
            json.Append("TRAIN_NO:\"" + c3Sms.LOCOMOTIVE_CODE + "\"");//设备号
            json.Append(",");
            json.Append("BOW_UPDOWN_STATUS:\"" + myfiter.GetBowStatus(c3Sms, m_loco.DEVICE_BOW_RELATIONS) + "\"");//弓状态
            json.Append(",");
            //json.Append("TRAIN_STATUS:\"" + c3Sms.TRAIN_STATUS + "\"");//运行状态
            //json.Append(",");
            json.Append("WZ:\"" + wz + "\"");//位置
            json.Append(",");
            json.Append("Dtime:\"" + c3Sms.DETECT_TIME.ToString("yyyy-MM-dd HH:mm") + "\"");//位置
            json.Append(",");
            json.Append("STATION_NO:\"" + c3Sms.STATION_NO + "\"");//车站号
            json.Append(",");
            json.Append("DETECT_TIME:\"" + c3Sms.DETECT_TIME + "\"");//时间
            json.Append(",");
            json.Append("SENSOR_TEMP:\"" + myfiter.GetTEMP_ENV(c3Sms) + "\"");//温度
            json.Append(",");
            json.Append("SATELLITE_NUM:\"" + c3Sms.SATELLITE_NUM + "\"");//SATELLITE_NUM卫星数
            json.Append(",");
            json.Append("IRV_TEMP:\"" + myfiter.GetTEMP_MAX(c3Sms) + "\"");//红外温度
            json.Append(",");
            json.Append("LINE_HEIGHT:\"" + myfiter.GetLINE_HEIGHT(c3Sms.LINE_HEIGHT_1) + "\"");//导高
            json.Append(",");
            json.Append("PULLING_VALUE:\"" + myfiter.GetPULLING_VALUE(c3Sms.PULLING_VALUE_1) + "\"");//导高
            json.Append(",");
            json.Append("INVALID_TRACK:\"" + c3Sms.INVALID_TRACK + "\"");//是否可用
            json.Append(",");
            json.Append("ID:\"" + c3Sms.ID + "\"");//ID
            json.Append(",");
            json.Append("BUREAU_CODE:\"" + c3Sms.BUREAU_CODE + "\"");//局


            json.Append(",LINE_NAME:\"" + c3Sms.MY_STR_1 + "\"");//线路


            json.Append(",ROUTING_CODE:\"" + c3Sms.MY_STR_2 + "\"");//区站


            json.Append(",STATION_NAME:\"" + c3Sms.MY_STR_4 + "\"");//站名



            json.Append("},");

        }


        json.Append("]");

        return json;
    }

    /// <summary>
    /// //获取设备版本
    /// </summary>
    /// <param name="TrainNo"></param>
    /// <param name="context"></param>
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
    private bool judge(string s)
    {
        try { Convert.ToDouble(s); return true; }
        catch { return false; }
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}