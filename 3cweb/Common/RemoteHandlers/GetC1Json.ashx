<%@ WebHandler Language="C#" Class="GetC1Json" %>

using System;
using System.Data;
using System.Web;
using System.Xml;
using Api.Fault.entity.alarm;
using Api.Event.entity;
using Api.Foundation.entity.Foundation;
using Api.Foundation.entity.Cond;
using System.Collections.Generic;
using System.Text;

public class GetC1Json : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {

        //获取设备ID
        string deviceid = HttpContext.Current.Request["deviceid"];//"WHJJJXD105$00000$001760"; 
        string type = HttpContext.Current.Request["type"];
        string datatype = HttpContext.Current.Request["datatype"];
        string harddiskid = HttpContext.Current.Request["harddiskid"];
        string eid = HttpContext.Current.Request["eventid"];
        string Json = "";

        switch (type)
        {
            case "Name":
                Json = GetC1NameJson(eid, deviceid, harddiskid);
                break;
            case "allvalue":
                Json = GetC1allvalueJson(eid, deviceid, harddiskid);
                break;
            case "Last":
                Json = GetC1LastValueJson(deviceid, datatype, harddiskid);
                break;
            case "SC":
                Json = GetC1SCValueJson(deviceid, datatype, harddiskid);
                break;
        }

        context.Response.Cache.SetCacheability(HttpCacheability.NoCache);
        context.Response.ContentType = "text/plain";
        object myObj = Newtonsoft.Json.JsonConvert.DeserializeObject(Json.ToString());
        context.Response.Write(myObj);
    }

    /// <summary>
    /// 获得C1表头JSON串
    /// </summary>
    /// <param name="deviceid">部件ID</param>
    /// <returns></returns>
    public string GetC1NameJson(string eid, string deviceid, string hardDiskID)
    {

        C1Event ce = new C1Event();
        if (string.IsNullOrEmpty(hardDiskID) && !string.IsNullOrEmpty(eid))
        {
            ce = Api.ServiceAccessor.GetEventService().queryC1Event(eid);
            hardDiskID = ce.HARDDISK_MANAGE_ID;
            deviceid = ce.DEVICE_ID;
        }
        if (!string.IsNullOrEmpty(deviceid) && !string.IsNullOrEmpty(hardDiskID))
        {
            C1EventCond cec = new C1EventCond();
            cec.DEVICE_ID = deviceid;
            cec.HARDDISK_MANAGE_ID = hardDiskID;
            IList<C1Event> c1list = Api.ServiceAccessor.GetEventService().queryC1Event(cec);
            if (c1list.Count > 0) ce = c1list[0];
        }
        string Json = "";
        if (!String.IsNullOrEmpty(ce.ID))
        {
            Json += "[";
            IList<C1Event> c1list = Api.ServiceAccessor.GetEventService().queryNearChartC1Event(ce, 10, hardDiskID);
            if (c1list.Count > 0)
            {
                foreach (C1Event c1 in c1list)
                    Json += "'" + c1.POLE_NUMBER + "',";//杆号
            }
            else
            {
                Json += "'0'";
            }
            Json += "]";
        }
        return Json;

    }
    /// <summary>
    /// 获取趋势图JSON串
    /// </summary>
    /// <param name="deviceid">部件ID</param>
    /// <param name="datatype">数据类型</param>
    /// <returns></returns>
    public string GetC1allvalueJson(string eid, string deviceid, string hardDiskID)
    {
        string Json = "[";
        string WYJson = "";
        string YDJson = "";
        string BZDGJson = "";
        string BZLCJson = "";
        string DGJson = "";
        string LCJson = "";
        string names = "";
        string dtime = "";

        string pole_code = "";


        //C1Event ce = new C1Event();
        //if (!string.IsNullOrEmpty(eid))
        //{
        //    C1EventCond cec = new C1EventCond();
        //    cec.ALARM_ID = eid;
        //    IList<C1Event> c1list = Api.ServiceAccessor.GetEventService().queryC1Event(cec);
        //    string eventid = "";
        //    if (c1list.Count > 0)
        //        eventid = c1list[0].ID;


        //    ce = Api.ServiceAccessor.GetEventService().queryC1Event(eventid);
        //    hardDiskID = ce.HARDDISK_MANAGE_ID;
        //    deviceid = ce.DEVICE_ID;
        //}
        //else
        //{
        //    C1EventCond cec = new C1EventCond();
        //    cec.DEVICE_ID = deviceid;
        //    cec.HARDDISK_MANAGE_ID = hardDiskID;
        //    IList<C1Event> c1list = Api.ServiceAccessor.GetEventService().queryC1Event(cec);
        //    if (c1list.Count > 0) ce = c1list[0];
        //}
        WYJson += "[";
        YDJson += "[";
        BZDGJson += "[";
        BZLCJson += "[";
        DGJson += "[";
        LCJson += "[";
        names += "[";
        dtime += "[";

        //if (!String.IsNullOrEmpty(ce.ID))
        {
            //之前获取临近支柱的方式，因为巡检数据和基础数据准确性不高，所以弃用了 by TJY 2017.07.09
            //IList<C1Event> list = Api.ServiceAccessor.GetEventService().queryNearChartC1Event(ce, 10, hardDiskID);

            //if (list.Count > 0)
            //{
            //    List<C1Event> c1list = new List<C1Event>();
            //    foreach (C1Event c1e in list)
            //    {
            //        int pole_numer = int.Parse(ce.POLE_NUMBER);
            //        int po = int.Parse(c1e.POLE_NUMBER);
            //        if (Math.Abs(po - pole_numer) < 10)
            //            c1list.Add(c1e);
            //    }

            //    for (int i = 0; i < c1list.Count; i++)
            //    {
            //        if (c1list[i].DEVICE_ID == deviceid)
            //        {
            //            WYJson += "{value:" + c1list[i].NETV + ",symbol: 'emptypin',symbolSize : 5,itemStyle : { normal: {label : {show: true,textStyle : {fontSize : '14',fontFamily : '微软雅黑',fontWeight : 'bold'}}}}},";
            //        }
            //        else { WYJson += c1list[i].NETV + ","; }//网压
            //        if (c1list[i].DEVICE_ID == deviceid)
            //        {
            //            YDJson += "{value:" + c1list[i].H2 + ",symbol: 'emptypin',symbolSize : 5,itemStyle : { normal: {label : {show: true,textStyle : {fontSize : '14',fontFamily : '微软雅黑',fontWeight : 'bold'}}}}},";
            //        }
            //        else { YDJson += c1list[i].H2 + ","; }//硬点
            //        if (c1list[i].DEVICE_ID == deviceid)
            //        {
            //            DGJson += "{value:" + StrChange("DAOGAO_T", i, c1list) + ",symbol: 'emptypin',symbolSize : 5,itemStyle : { normal: {label : {show: true,textStyle : {fontSize : '14',fontFamily : '微软雅黑',fontWeight : 'bold'}}}}},";
            //        }
            //        else { DGJson += StrChange("DAOGAO_T", i, c1list) + ","; }//=导高

            //        if (c1list[i].DEVICE_ID == deviceid)
            //        {
            //            LCJson += "{value:" + StrChange("STAGGER_T", i, c1list) + ",symbol: 'emptypin',symbolSize : 5,itemStyle : { normal: {label : {show: true,textStyle : {fontSize : '14',fontFamily : '微软雅黑',fontWeight : 'bold'}}}}},";
            //        }
            //        else { LCJson += StrChange("STAGGER_T", i, c1list) + ","; }//拉出
            //        BZDGJson += c1list[i].DAOGAO + ",";//标准导高值
            //        BZLCJson += c1list[i].STAGGER + ",";//标准拉出值
            //        names += c1list[i].POLE_NUMBER + ",";//杆号
            //        dtime += "'" + c1list[i].RAISED_TIME.ToString("yyyy/MM/dd") + "',";
            //    }
            //}
            //else
            //{
            //    WYJson += "0";
            //    YDJson += "0";
            //    BZDGJson += "0";
            //    BZLCJson += "0";
            //    DGJson += "0";
            //    LCJson += "0";
            //    names += "0";
            //    dtime += "0";
            //}

            //只根据巡检获取支柱的临近支柱
            int NETV = 0;
            int H2 = 0;
            int DAOGAO_T = 0;
            int DAOGAO_NT = 0;
            int STAGGER_T = 0;
            int STAGGER_NT = 0;
            int LINE_HEIGHT = 0;
            string BZSTAGGER = null;
            string POLE_NUMBER = null;
            DateTime RAISED_TIME = DateTime.Now;

            System.Data.DataSet ds = new System.Data.DataSet();

            //判断查询报警还是事件
            if (!string.IsNullOrEmpty(eid))
            {
                C1_Alarm A = Api.ServiceAccessor.GetAlarmService().getC1Alarm(eid);
                //ds = ADO.PatrolAndExamine.GetgC1NearPoleValue(A.LINE_NAME, A.POSITION_NAME, A.BRG_TUN_NAME, A.DIRECTION, A.POLE_NUMBER, hardDiskID, A.KM_MARK);
                ds = ADO.PatrolAndExamine.GetC1Json(eid, A.LINE_NAME, A.POSITION_NAME, A.BRG_TUN_NAME, A.DIRECTION, A.POLE_NUMBER, hardDiskID, A.KM_MARK);
                NETV = A.NETV;
                H2 = A.H2;
                DAOGAO_T = A.DAOGAO_T;
                DAOGAO_NT = A.DAOGAO_NT;
                STAGGER_NT = A.STAGGER_NT;
                STAGGER_T = A.STAGGER_T;
                LINE_HEIGHT = A.LINE_HEIGHT;
                BZSTAGGER = A.SVALUE7;
                POLE_NUMBER = A.POLE_NUMBER;
                pole_code = A.DEVICE_ID;
            }
            else
            {
                C1EventCond C1Cond = new C1EventCond();
                C1Cond.DEVICE_ID = deviceid;
                C1Cond.HARDDISK_MANAGE_ID = hardDiskID;
                IList<C1Event> A = Api.ServiceAccessor.GetEventService().getC1EventDetail(C1Cond);
                if (A.Count != 0)
                {
                    ds = ADO.PatrolAndExamine.GetC1Json("", A[0].LINE_NAME, A[0].POSITION_NAME, A[0].BRG_TUN_NAME, A[0].DIRECTION, A[0].POLE_NUMBER, hardDiskID, A[0].KM_MARK);
                    NETV = A[0].NETV;
                    H2 = A[0].H2;
                    DAOGAO_T = A[0].DAOGAO_T;
                    DAOGAO_NT = A[0].DAOGAO_NT;
                    STAGGER_NT = A[0].STAGGER_NT;
                    STAGGER_T = A[0].STAGGER_T;
                    LINE_HEIGHT = A[0].DAOGAO;
                    BZSTAGGER = A[0].STAGGER.ToString();
                    POLE_NUMBER = A[0].POLE_NUMBER;

                    pole_code = A[0].DEVICE_ID;
                }

            }
            if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
            {
                //WYJson += "0";
                //YDJson += "0";
                //BZDGJson += "0";
                //BZLCJson += "0";
                //DGJson += "0";
                //LCJson += "0";
                //names += "0";
                //dtime += "0";
                Pole m = new Pole();
                int DESIGN_PULLING_VALUE = 0;
                int LC = (STAGGER_T == 0 || STAGGER_T == -1000) ? STAGGER_NT : STAGGER_T;
                if (!string.IsNullOrEmpty(pole_code))
                {
                    m = Api.ServiceAccessor.GetFoundationService().queryPoleByPoleCode(pole_code);
                }
                WYJson += NETV;
                YDJson += H2;
                DGJson += (DAOGAO_T == 0 || DAOGAO_T == -1000) ? DAOGAO_NT : DAOGAO_T;
                LCJson += LC;
                names += POLE_NUMBER;
                dtime += "\"" + RAISED_TIME.ToString("yyyy/MM/dd") + "\"";
                if (m != null && m.POLE_CODE != "")
                {
                    int WIRE_DESIGN_HEIGHT = Convert.ToInt32(m.WIRE_DESIGN_HEIGHT);
                    BZDGJson += (WIRE_DESIGN_HEIGHT == 0 ? -1000 : WIRE_DESIGN_HEIGHT);
                    DESIGN_PULLING_VALUE = m.DESIGN_PULLING_VALUE;
                    if (LC > 0 && DESIGN_PULLING_VALUE != -1000)
                    {
                        DESIGN_PULLING_VALUE = System.Math.Abs(m.DESIGN_PULLING_VALUE);
                    }
                    else if (LC < 0 && LC != -1000 && DESIGN_PULLING_VALUE != -1000)
                    {
                        DESIGN_PULLING_VALUE = System.Math.Abs(m.DESIGN_PULLING_VALUE) * -1;
                    }

                    BZLCJson += DESIGN_PULLING_VALUE;
                }
                else
                {
                    BZDGJson += (LINE_HEIGHT == 0 ? -1000 : LINE_HEIGHT);
                    DESIGN_PULLING_VALUE = (string.IsNullOrEmpty(BZSTAGGER) ? -1000 : Convert.ToInt32(BZSTAGGER));
                    if (LC > 0 && DESIGN_PULLING_VALUE != -1000)
                    {
                        DESIGN_PULLING_VALUE = System.Math.Abs(m.DESIGN_PULLING_VALUE);
                    }
                    else if (LC < 0 && LC != -1000 && DESIGN_PULLING_VALUE != -1000)
                    {
                        DESIGN_PULLING_VALUE = System.Math.Abs(m.DESIGN_PULLING_VALUE) * -1;
                    }
                    BZLCJson += DESIGN_PULLING_VALUE;
                    //BZLCJson += (string.IsNullOrEmpty(BZSTAGGER) ? "-1000":BZSTAGGER);
                }
            }
            else
            {
                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    string table_device_id = ds.Tables[0].Rows[i]["DEVICE_ID"] == DBNull.Value ? "XXX" : ds.Tables[0].Rows[i]["DEVICE_ID"].ToString();
                    Pole m = Api.ServiceAccessor.GetFoundationService().queryPoleByPoleCode(table_device_id);
                    int DESIGN_PULLING_VALUE = 0;
                    int LC = 0;
                    if (i == (ds.Tables[0].Rows.Count / 2 + 1))
                    {
                        LC = ((STAGGER_T == 0 || STAGGER_T == -1000) ? STAGGER_NT : STAGGER_T);
                        //if (table_device_id == deviceid)
                        if (1 == 1)
                        {
                            WYJson += "{value:" + NETV + ",symbol: 'emptypin',symbolSize : 5,itemStyle : { normal: {label : {show: true,textStyle : {fontSize : '14',fontFamily : '微软雅黑',fontWeight : 'bold'}}}}},";
                        }
                        else { WYJson += NETV + ","; }//网压
                                                      //if (table_device_id == deviceid)
                        if (1 == 1)
                        {
                            YDJson += "{value:" + H2 + ",symbol: 'emptypin',symbolSize : 5,itemStyle : { normal: {label : {show: true,textStyle : {fontSize : '14',fontFamily : '微软雅黑',fontWeight : 'bold'}}}}},";
                        }
                        else { YDJson += H2 + ","; }//硬点
                                                    //if (table_device_id == deviceid)
                        if (1 == 1)
                        {
                            DGJson += "{value:" + ((DAOGAO_T == 0 || DAOGAO_T == -1000) ? DAOGAO_NT : DAOGAO_T) + ",symbol: 'emptypin',symbolSize : 5,itemStyle : { normal: {label : {show: true,textStyle : {fontSize : '14',fontFamily : '微软雅黑',fontWeight : 'bold'}}}}},";
                        }
                        else { DGJson += ((DAOGAO_T == 0 || DAOGAO_T == -1000) ? DAOGAO_NT : DAOGAO_T) + ","; }//=导高

                        //if (table_device_id == deviceid)
                        if (1 == 1)
                        {
                            LCJson += "{value:" + LC + ",symbol: 'emptypin',symbolSize : 5,itemStyle : { normal: {label : {show: true,textStyle : {fontSize : '14',fontFamily : '微软雅黑',fontWeight : 'bold'}}}}},";
                        }
                        else { LCJson += LC + ","; }//拉出
                        if (m != null && m.POLE_CODE != "")
                        {
                            int WIRE_DESIGN_HEIGHT = Convert.ToInt32(m.WIRE_DESIGN_HEIGHT);
                            BZDGJson += (WIRE_DESIGN_HEIGHT == 0 ? -1000 : WIRE_DESIGN_HEIGHT) + ",";//标准导高值

                            DESIGN_PULLING_VALUE = m.DESIGN_PULLING_VALUE;
                            if (LC > 0 && DESIGN_PULLING_VALUE != -1000)
                            {
                                DESIGN_PULLING_VALUE = System.Math.Abs(m.DESIGN_PULLING_VALUE);
                            }
                            else if (LC < 0 && LC != -1000 && DESIGN_PULLING_VALUE != -1000)
                            {
                                DESIGN_PULLING_VALUE = System.Math.Abs(m.DESIGN_PULLING_VALUE) * -1;
                            }

                            BZLCJson += DESIGN_PULLING_VALUE + ",";
                            //BZLCJson += m.DESIGN_PULLING_VALUE + ",";//标准拉出值
                        }
                        else
                        {
                            BZDGJson += (LINE_HEIGHT == 0 ? -1000 : LINE_HEIGHT) + ",";//标准导高值

                            DESIGN_PULLING_VALUE = (string.IsNullOrEmpty(BZSTAGGER) ? -1000 : Convert.ToInt32(BZSTAGGER));
                            if (LC > 0 && DESIGN_PULLING_VALUE != -1000)
                            {
                                DESIGN_PULLING_VALUE = System.Math.Abs(m.DESIGN_PULLING_VALUE);
                            }
                            else if (LC < 0 && LC != -1000 && DESIGN_PULLING_VALUE != -1000)
                            {
                                DESIGN_PULLING_VALUE = System.Math.Abs(m.DESIGN_PULLING_VALUE) * -1;
                            }
                            BZLCJson += DESIGN_PULLING_VALUE + ",";

                            //BZLCJson += (string.IsNullOrEmpty(BZSTAGGER) ? "-1000" : BZSTAGGER) + ",";//标准拉出值
                        }
                        names += "'" + POLE_NUMBER + "',";//杆号
                        dtime += "'" + RAISED_TIME.ToString("yyyy/MM/dd") + "',";
                    }

                    if (table_device_id == deviceid)
                    {
                        WYJson += "{value:" + ds.Tables[0].Rows[i]["NETV"] + ",symbol: 'emptypin',symbolSize : 5,itemStyle : { normal: {label : {show: true,textStyle : {fontSize : '14',fontFamily : '微软雅黑',fontWeight : 'bold'}}}}},";
                    }
                    else { WYJson += ds.Tables[0].Rows[i]["NETV"] + ","; }//网压
                    if (table_device_id == deviceid)
                    {
                        YDJson += "{value:" + ds.Tables[0].Rows[i]["H2"] + ",symbol: 'emptypin',symbolSize : 5,itemStyle : { normal: {label : {show: true,textStyle : {fontSize : '14',fontFamily : '微软雅黑',fontWeight : 'bold'}}}}},";
                    }
                    else { YDJson += ds.Tables[0].Rows[i]["H2"] + ","; }//硬点
                    if (table_device_id == deviceid)
                    {
                        DGJson += "{value:" + ((ds.Tables[0].Rows[i]["DAOGAO_T"] == DBNull.Value || ds.Tables[0].Rows[i]["DAOGAO_T"].ToString() != "-1000") ? ds.Tables[0].Rows[i]["DAOGAO_NT"] : ds.Tables[0].Rows[i]["DAOGAO_T"]) + ",symbol: 'emptypin',symbolSize : 5,itemStyle : { normal: {label : {show: true,textStyle : {fontSize : '14',fontFamily : '微软雅黑',fontWeight : 'bold'}}}}},";
                    }
                    else { DGJson += ((ds.Tables[0].Rows[i]["DAOGAO_T"] == DBNull.Value || ds.Tables[0].Rows[i]["DAOGAO_T"].ToString() != "-1000") ? ds.Tables[0].Rows[i]["DAOGAO_NT"] : ds.Tables[0].Rows[i]["DAOGAO_T"]) + ","; }//=导高
                    LC = ((ds.Tables[0].Rows[i]["STAGGER_T"] == DBNull.Value || ds.Tables[0].Rows[i]["STAGGER_T"].ToString() != "-1000") ? Convert.ToInt32(ds.Tables[0].Rows[i]["STAGGER_NT"] == DBNull.Value ? "-1000" : ds.Tables[0].Rows[i]["STAGGER_NT"].ToString()) : Convert.ToInt32(ds.Tables[0].Rows[i]["STAGGER_T"]));
                    if (table_device_id == deviceid)
                    {
                        LCJson += "{value:" + LC + ",symbol: 'emptypin',symbolSize : 5,itemStyle : { normal: {label : {show: true,textStyle : {fontSize : '14',fontFamily : '微软雅黑',fontWeight : 'bold'}}}}},";
                    }
                    else { LCJson += LC + ","; }//拉出
                    if (m != null && m.POLE_CODE != "")
                    {
                        int WIRE_DESIGN_HEIGHT = Convert.ToInt32(m.WIRE_DESIGN_HEIGHT);
                        BZDGJson += (WIRE_DESIGN_HEIGHT == 0 ? -1000 : WIRE_DESIGN_HEIGHT) + ",";//标准导高值

                        DESIGN_PULLING_VALUE = m.DESIGN_PULLING_VALUE;
                        if (LC > 0 && DESIGN_PULLING_VALUE != -1000)
                        {
                            DESIGN_PULLING_VALUE = System.Math.Abs(m.DESIGN_PULLING_VALUE);
                        }
                        else if (LC < 0 && LC != -1000 && DESIGN_PULLING_VALUE != -1000)
                        {
                            DESIGN_PULLING_VALUE = System.Math.Abs(m.DESIGN_PULLING_VALUE) * -1;
                        }
                        BZLCJson += DESIGN_PULLING_VALUE + ",";
                        //BZLCJson += m.DESIGN_PULLING_VALUE + ",";//标准拉出值
                    }
                    else
                    {
                        BZDGJson += (ds.Tables[0].Rows[i]["DAOGAO"] == DBNull.Value ? "-1000" : ds.Tables[0].Rows[i]["DAOGAO"]) + ",";//标准导高值

                        DESIGN_PULLING_VALUE = (ds.Tables[0].Rows[i]["POLE_NUMBER"] == DBNull.Value ? -1000 : Convert.ToInt32(ds.Tables[0].Rows[i]["STAGGER"]));
                        if (LC > 0 && DESIGN_PULLING_VALUE != -1000)
                        {
                            DESIGN_PULLING_VALUE = System.Math.Abs(m.DESIGN_PULLING_VALUE);
                        }
                        else if (LC < 0 && LC != -1000 && DESIGN_PULLING_VALUE != -1000)
                        {
                            DESIGN_PULLING_VALUE = System.Math.Abs(m.DESIGN_PULLING_VALUE) * -1;
                        }
                        BZLCJson += DESIGN_PULLING_VALUE + ",";

                        //BZLCJson += ((ds.Tables[0].Rows[i]["STAGGER"] == DBNull.Value || ds.Tables[0].Rows[i]["STAGGER"].ToString() == "0") ? "-1000" : ds.Tables[0].Rows[i]["STAGGER"]) + ",";//标准拉出值
                    }

                    names += "'" + (ds.Tables[0].Rows[i]["POLE_NUMBER"] == DBNull.Value ? "\"未知\"" : ds.Tables[0].Rows[i]["POLE_NUMBER"]) + "',";//杆号
                    dtime += "'" + Convert.ToDateTime(ds.Tables[0].Rows[i]["RAISED_TIME"]).ToString("yyyy/MM/dd") + "',";
                }
            }
        }
        //else
        //{
        //    WYJson += "0";
        //    YDJson += "0";
        //    BZDGJson += "0";
        //    BZLCJson += "0";
        //    DGJson += "0";
        //    LCJson += "0";
        //    names += "0";
        //    dtime += "0";
        //}
        WYJson += "]";
        YDJson += "]";
        BZDGJson += "]";
        BZLCJson += "]";
        DGJson += "]";
        LCJson += "]";
        names += "]";
        dtime += "]";
        Json += WYJson + ",";
        Json += YDJson + ",";
        Json += DGJson + ",";
        Json += LCJson + ",";
        Json += BZDGJson + ",";
        Json += BZLCJson + ",";
        Json += names + ",";
        Json += dtime + "";
        Json += "]";
        return Json;
    }

    public string GetC1SCValueJson(string deviceid, string datatype, string hardDiskID)
    {
        string Json = "";
        //条件
        PoleCond dc = new PoleCond();
        dc.POLE_CODE = deviceid;
        List<Pole> devicelist = (List<Pole>)Api.ServiceAccessor.GetFoundationService().queryPole(dc);
        Json += "[";
        if (hardDiskID != "")
        {
            IList<Api.Event.entity.C1Event> c1list = Api.ServiceAccessor.GetEventService().getNearbyC1Event(devicelist[0], 10, hardDiskID);

            Json += "[";

            if (c1list.Count != 0)
            {
                for (int i = 0; i < c1list.Count; i++)
                {
                    switch (datatype)
                    {
                        case "dg":
                            if (c1list[i].DEVICE_ID == deviceid)
                            {

                                Json += "{value:" + StrChange("DAOGAO_T", i, c1list) + ",symbol: 'emptypin',symbolSize : 5,itemStyle : { normal: {label : {show: true,textStyle : {fontSize : '14',fontFamily : '微软雅黑',fontWeight : 'bold'}}}}},";
                            }
                            else { Json += StrChange("DAOGAO_T", i, c1list) + ","; }//=导高
                            break;
                        case "lc":
                            if (c1list[i].DEVICE_ID == deviceid)
                            {
                                Json += "{value:" + StrChange("STAGGER_T", i, c1list) + ",symbol: 'emptypin',symbolSize : 5,itemStyle : { normal: {label : {show: true,textStyle : {fontSize : '14',fontFamily : '微软雅黑',fontWeight : 'bold'}}}}},";
                            }
                            else { Json += StrChange("STAGGER_T", i, c1list) + ","; }//拉出
                            break;
                        default:
                            break;


                    }
                }
            }
            else
            {
                Json += "0";
            }
            Json += "]";
        }
        return Json;
    }
    /// <summary>
    /// 获取修后的检测值
    /// </summary>
    /// <param name="deviceid"></param>
    /// <param name="datatype"></param>
    /// <param name="hardDiskID"></param>
    /// <returns></returns>
    public string GetC1LastValueJson(string deviceid, string datatype, string hardDiskID)
    {
        string Json = "";
        //条件
        PoleCond dc = new PoleCond();
        dc.POLE_CODE = deviceid;
        List<Pole> devicelist = (List<Pole>)Api.ServiceAccessor.GetFoundationService().queryPole(dc);
        IList<Api.Event.entity.C1Event> c1list = Api.ServiceAccessor.GetEventService().getNearbyC1LastEventByTime(devicelist[0], 10, Convert.ToDateTime(hardDiskID));
        Json += "[";
        if (c1list.Count != 0)
        {
            for (int i = 0; i < c1list.Count; i++)
            {
                switch (datatype)
                {
                    case "wy":
                        Json += c1list[i].NETV + ","; //网压
                        break;
                    case "yd":
                        Json += c1list[i].H2 + ","; //硬点
                        break;
                    case "dg":
                        Json += StrChange("DAOGAO_NT", i, c1list) + ","; //=导高
                        break;
                    case "lc":
                        Json += StrChange("STAGGER_NT", i, c1list) + ","; //拉出
                        break;
                }
            }
        }
        else { Json += "0"; }
        Json += "]";
        return Json;
    }
    private String StrChange(String type, Int32 i, IList<C1Event> list)
    {
        String ret = "-1000";
        switch (type)
        {
            case "DAOGAO_T":
                if (list[i].DAOGAO_T.ToString() != "0" && list[i].DAOGAO_T.ToString() != "-1000")
                {
                    ret = list[i].DAOGAO_T.ToString();
                }
                else
                {
                    ret = list[i].DAOGAO_NT.ToString();
                }
                break;
            case "STAGGER_T":
                if (list[i].STAGGER_T.ToString() != "0" && list[i].STAGGER_T.ToString() != "-1000")
                {
                    ret = list[i].STAGGER_T.ToString();
                }
                else
                {
                    ret = list[i].STAGGER_NT.ToString();
                }
                break;

        }
        return ret;
    }


    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}