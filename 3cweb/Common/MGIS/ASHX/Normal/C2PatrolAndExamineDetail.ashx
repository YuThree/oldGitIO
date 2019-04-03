<%@ WebHandler Language="C#" Class="C2PatrolAndExamineDetail" %>

using System;
using System.Web;
using System.Text;
using System.Collections.Generic;
using Api.Fault.entity.alarm;

public class C2PatrolAndExamineDetail : ReferenceClass,IHttpHandler {

    public void ProcessRequest (HttpContext context) {

        string harddisk_id = context.Request["harddisk_id"];//硬盘ID

        int pageSize = string.IsNullOrEmpty(context.Request["pageSize"]) ? 0 : Convert.ToInt32(context.Request["pageSize"]);//单次请求的条数
        int pageIndex = string.IsNullOrEmpty(context.Request["pageIndex"]) ? 0 : Convert.ToInt32(context.Request["pageIndex"]);//当前页码

        string active = context.Request["active"];//操作选择

        switch (active)
        {
            case "PlayIndex"://页面右上角播放索引，带分页请求
                PatrolAndExamineDataPlay(harddisk_id, pageSize, pageIndex);
                break;
            case "AlarmList"://页面左下角报警列表，带分页请求
                GetPatrolAndExamineAlarmList(harddisk_id, pageSize, pageIndex);
                break;
            case "AlarmStatistics"://页面右下报警统计，按等级统计数量
                GetAlarmNumber(harddisk_id);
                break;
            default://其他情况，直接返回
                context.Response.ContentType = "application/json";
                context.Response.Write("{}");
                break;
        }
    }

    /// <summary>
    /// C2巡检详情页 巡检数据播放
    /// </summary>
    /// <param name="harddisk_id"></param>
    /// <param name="pageSize"></param>
    /// <param name="pageIndex"></param>
    public void PatrolAndExamineDataPlay(string harddisk_id,int pageSize,int pageIndex)
    {
        //判断条件参数是否正常 
        if (string.IsNullOrEmpty(harddisk_id) || pageIndex == 0 || pageSize == 0)
        {
            HttpContext.Current.Response.ContentType = "application/json";
            HttpContext.Current.Response.Write("{}");
            return;
        }

        int startRownum = pageSize * (pageIndex - 1) + 1;
        int endRownum = pageIndex * pageSize;

        //数据查询
        System.Data.DataSet ds = ADO.PatrolAndExamine.GetC2PatrolAndExamineData(harddisk_id, startRownum, endRownum);

        //json拼接

        StringBuilder result = new StringBuilder();
        if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
        {
            result.Append("{\"data\":[],\"total_Rows\":\"0\",\"pageIndex\":\"0\",\"pageSize\":\"0\",\"pageOfTotal\":\"1/1\",\"pageRange\":\"0~0\",\"Current_pagesize\":\"0\",\"totalPages\":\"1\"}");
        }
        else
        {
            result.Append("{\"data\":[");

            for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
            {
                System.Data.DataRow dr = ds.Tables[0].Rows[i];

                result.Append("{\"C2XQTime\":\"" + (dr["SAMPLLED_TIME"] == DBNull.Value ? null : Convert.ToDateTime(dr["SAMPLLED_TIME"]).ToString("yyyy-MM-dd HH:mm:ss")) + "\",");//C2时间
                result.Append("\"C2LineName\":\"" + dr["LINE_NAME"] + "\",");//线路名
                result.Append("\"C2PositionName\":\"" + dr["POSITION_NAME"] + "\",");//区站名
                result.Append("\"C2Brg_tun_Name\":\"" + dr["BRG_TUN_NAME"] + "\",");//桥隧名
                result.Append("\"C2Direction\":\"" + dr["POLE_DIRECTION"] + "\",");//行别
                if (dr["KM_MARK"] == DBNull.Value || Convert.ToString(dr["KM_MARK"]) == "-1000" || Convert.ToString(dr["KM_MARK"]) == "-1")
                    dr["KM_MARK"] = 0;
                result.Append("\"C2KmMark\":\"" + ("K" + Convert.ToInt32(dr["KM_MARK"]) / 1000 + "+" + Convert.ToInt32(dr["KM_MARK"]) % 1000) + "\",");//公里标
                result.Append("\"C2PoleNo\":\"" + dr["POLE_NO"] + "\",");//杆号
                result.Append("\"C2GIS_LON\":\"" + dr["GIS_LON"] + "\",");//GPS经度
                result.Append("\"C2GIS_LAT\":\"" + dr["GIS_LAT"] + "\",");//GPS纬度
                result.Append("\"C2GIS_LON_O\":\"" + dr["GIS_LON_O"] + "\",");//GPS原始经度
                result.Append("\"C2GIS_LAT_O\":\"" + dr["GIS_LAT_O"] + "\",");//GPS原始纬度
                result.Append("\"C2ID\":\"" + dr["ID"] + "\",");//C2事件ID
                result.Append("\"C2500Img\":\"" + PublicMethod.GetFullDir(dr["PIC_PATH_500W"].ToString()) + "\",");//C2500
                result.Append("\"C2100Img\":\"" + PublicMethod.GetFullDir(dr["PIC_PATH_100W"].ToString()) + "\",");//C2100 
                result.Append("\"C2EventALARMID\":\"" + dr["ALARM_ID"] + "\",");//C2事件对应报警ID
                result.Append("\"C2DEVICE_ID\":\"" + dr["DEVICE_ID"] + "\"},");//支柱编码
            }

            result.Remove(result.Length - 1, 1);
            result.Append("]");
            int total_rows = ds.Tables[0].Rows.Count > 0 ? Convert.ToInt32(ds.Tables[0].Rows[0]["TOTAL"]) : 0;
            PageHelper page = new PageHelper();
            string pagejson = page.getPageJson(total_rows, pageIndex, pageSize);//拼接分页数据
            result.Append("," + pagejson + "}");
        }

        result = result.Replace("\\", "/");
        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(result);
    }

    /// <summary>
    /// 获取本次巡检的报警列表
    /// </summary>
    /// <param name="harddisk_id"></param>
    /// <param name="pageSize"></param>
    /// <param name="pageIndex"></param>
    public void GetPatrolAndExamineAlarmList(string harddisk_id,int pageSize,int pageIndex)
    {
        //判断条件参数是否正常 
        if (string.IsNullOrEmpty(harddisk_id) || pageIndex == 0 || pageSize == 0)
        {
            HttpContext.Current.Response.ContentType = "application/json";
            HttpContext.Current.Response.Write("{}");
            return;
        }

        //数据查询
        //System.Data.DataSet ds = ADO.PatrolAndExamine.GetPatrolAndExamineAlarmList(harddisk_id, startRownum, endRownum);

        //获取C2报警列表
        C2_AlarmCond c2AlarmCond = new C2_AlarmCond();
        c2AlarmCond.pageSize = pageSize;
        c2AlarmCond.page = pageIndex;
        c2AlarmCond.HARDDISK_MANAGE_ID = harddisk_id;
        List<C2_Alarm> C2AlarmList = Api.ServiceAccessor.GetAlarmService().getC2Alarm(c2AlarmCond);

        //获取报警总条数
        int recordCount = Api.ServiceAccessor.GetAlarmService().getAlarmCount(c2AlarmCond);

        //json拼接
        StringBuilder result = new StringBuilder();
        if (C2AlarmList.Count == 0)
        {
            result.Append("{\"data\":[],\"total_Rows\":\"0\",\"pageIndex\":\"0\",\"pageSize\":\"0\",\"pageOfTotal\":\"1/1\",\"pageRange\":\"0~0\",\"Current_pagesize\":\"0\",\"totalPages\":\"1\"}");
        }
        else
        {
            result.Append("{\"data\":[");

            foreach(C2_Alarm c2Alarm in C2AlarmList)
            {
                result.Append("{\"C2XQTime\":\"" + c2Alarm.RAISED_TIME.ToString("yyyy-MM-dd HH:mm:ss") + "\",");//C2时间
                result.Append("\"C2LineName\":\"" + c2Alarm.LINE_NAME + "\",");//线路名
                result.Append("\"C2PositionName\":\"" + c2Alarm.POSITION_NAME + "\",");//区站名
                result.Append("\"C2Brg_tun_Name\":\"" + c2Alarm.BRG_TUN_NAME + "\",");//桥隧名
                result.Append("\"C2Direction\":\"" + c2Alarm.DIRECTION + "\",");//行别
                result.Append("\"C2KmMark\":\"" + (("K" + c2Alarm.KM_MARK / 1000 + "+" + c2Alarm.KM_MARK % 1000)) + "\",");//公里标
                result.Append("\"C2PoleNo\":\"" + c2Alarm.POLE_NUMBER + "\",");//杆号
                result.Append("\"C2GIS_LON\":\"" + c2Alarm.GIS_X+ "\",");//GPS经度
                result.Append("\"C2GIS_LAT\":\"" + c2Alarm.GIS_Y + "\",");//GPS纬度
                result.Append("\"C2GIS_LON_O\":\"" + c2Alarm.GIS_X_O + "\",");//GPS原始经度
                result.Append("\"C2GIS_LAT_O\":\"" + c2Alarm.GIS_Y_O + "\",");//GPS原始纬度
                result.Append("\"C2ID\":\"" + c2Alarm.ID + "\",");//C2报警ID
                result.Append("\"C2SEVERITY\":\"" + Api.Util.Common.getSysDictionaryInfo(c2Alarm.SEVERITY).CODE_NAME + "\",");//C2报警等级
                result.Append("\"C2CodeName\":\"" + c2Alarm.CODE_NAME + "\",");//C2报警类型
                result.Append("\"C2StatusName\":\"" + c2Alarm.STATUS_NAME + "\",");//C2报警状态
                result.Append("\"C2500Img\":\"" + PublicMethod.GetFullDir(c2Alarm) + c2Alarm.SNAPPED_500JPG.Split(';')[c2Alarm.NVALUE5] + "\",");//C2500
                result.Append("\"C2100Img\":\"" + PublicMethod.GetFullDir(c2Alarm) + c2Alarm.SNAPPED_JPG.Split(';')[c2Alarm.NVALUE5] + "\",");//C2100 
                //result.Append("\"C2EventALARMID\":\"" + dr["ALARM_ID"] + "\",");//C2事件对应报警ID
                result.Append("\"C2DEVICE_ID\":\"" + c2Alarm.DEVICE_ID + "\"},");//支柱编码
            }

            result.Remove(result.Length - 1, 1);
            result.Append("]");
            //int total_rows = ds.Tables[0].Rows.Count > 0 ? Convert.ToInt32(ds.Tables[0].Rows[0]["TOTAL"]) : 0;
            PageHelper page = new PageHelper();
            string pagejson = page.getPageJson(recordCount, pageIndex, pageSize);//拼接分页数据
            result.Append("," + pagejson + "}");
        }

        result = result.Replace("\\", "/");
        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(result);

    }

    /// <summary>
    /// 获取本次巡检的报警数量统计
    /// </summary>
    /// <param name="harddisk_id"></param>
    public static void GetAlarmNumber(string harddisk_id)
    {
        if (string.IsNullOrEmpty(harddisk_id))
        {
            HttpContext.Current.Response.ContentType = "application/json";
            HttpContext.Current.Response.Write("{}");
            return;
        }

        //数据访问
        System.Data.DataSet ds = ADO.PatrolAndExamine.GetPatrolAndExamineAlarmNumber(harddisk_id);

        //JSON拼接
        StringBuilder result = new StringBuilder();
        if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count < 3)
        {
            result.Append("[]");
        }
        else
        {
            result.Append("[");

            result.Append("{\"SEVERITY\":\"" + Api.Util.Common.getSysDictionaryInfo("一类").CODE_NAME + "\",");
            result.Append("\"COUNT\":\"" + ds.Tables[0].Rows[0]["NUM"] + "\"},");
            result.Append("{\"SEVERITY\":\"" + Api.Util.Common.getSysDictionaryInfo("二类").CODE_NAME + "\",");
            result.Append("\"COUNT\":\"" + ds.Tables[0].Rows[1]["NUM"] + "\"},");
            result.Append("{\"SEVERITY\":\"" + Api.Util.Common.getSysDictionaryInfo("三类").CODE_NAME + "\",");
            result.Append("\"COUNT\":\"" + ds.Tables[0].Rows[2]["NUM"] + "\"}");

            result.Append("]");
        }

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(result);

    }

    public bool IsReusable {
        get {
            return false;
        }
    }

}