<%@ WebHandler Language="C#" Class="C1HardDiskHandler" %>

using System;
using System.IO;
using System.Text;
using System.Web;
using Api.Fault.entity.alarm;
using System.Collections.Generic;
using Api.Util;
using Api.Event.entity;
using Api.Foundation.entity.Cond;
using Api.HardDisk.entity;
using Api.SysManagement.Security.entity;
using Api.SysManagement.Security.entity.Cond;

public class C1HardDiskHandler : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        string type = context.Request["type"];
        switch (type)
        {
            //查询C1原始数据
            case "loadList":
                GetList(context);
                break;
            case "deletedata":
                DeteleDate();
                break;

        }
    }
    /// <summary>
    /// 
    /// </summary>
    /// <param name="context"></param>
    public void GetList(HttpContext context)
    {
        //获取前台页码
        int pageIndex = Convert.ToInt32(HttpContext.Current.Request["page"]);
        //获取前台条数
        int pageSize = Convert.ToInt32(HttpContext.Current.Request["rp"]);

        string CateGory = HttpContext.Current.Request["category"];

        HardDiskManageCond hardDiskManageCond = new HardDiskManageCond();
        hardDiskManageCond.DATA_TYPE = CateGory;// "1C";
        hardDiskManageCond.page = pageIndex;
        hardDiskManageCond.pageSize = pageSize;
        hardDiskManageCond.orderBy = " START_TIME DESC,START_KM ";

        if (!String.IsNullOrEmpty(context.Request["lineName"]))
        {
            hardDiskManageCond.LINE_NAME = context.Request["lineName"];
        }
        if (!String.IsNullOrEmpty(context.Request["startTime"]))
        {
            hardDiskManageCond.startTime = Convert.ToDateTime(context.Request["startTime"]);
        }
        if (!String.IsNullOrEmpty(context.Request["endTime"]))
        {
            hardDiskManageCond.endTime = Convert.ToDateTime(context.Request["endTime"]);
        }
        string Real_Org_Permisson = Public.GetUser_PermissionOrg;
        if (!string.IsNullOrEmpty(Real_Org_Permisson))
        {
            hardDiskManageCond.MY_STR_1 = Real_Org_Permisson;
        }
        List<HardDiskManage> hardDiskManagelist = Api.ServiceAccessor.GetHardDiskManageServer().GetHardDiskManage_alarmCount(hardDiskManageCond);

        int recordCount = Api.ServiceAccessor.GetHardDiskManageServer().GetHardDiskManageCount(hardDiskManageCond);

        StringBuilder jsonStr = new StringBuilder();
        jsonStr.Append("{'rows':[");
        string url = "";
        for (int i = 0; i < hardDiskManagelist.Count; i++)
        {

            switch (CateGory)
            {
                case "1C":
                    url = "<a href=javascript:openC1HardDiskManage(" + hardDiskManagelist[i].ID + ")>综合分析</a>&nbsp;&nbsp;&nbsp;<a href=javascript:openC1EventList(" + hardDiskManagelist[i].ID + ")>查看原始数据</a>&nbsp;&nbsp;&nbsp;<a href=javascript:delete_Data(" + hardDiskManagelist[i].ID + ")>删除</a>";
                    break;
                case "2C":
                    url = "<a href=javascript:openC2Event(" + hardDiskManagelist[i].ID + ")>综合分析</a>&nbsp;&nbsp;&nbsp;<a href=vip1:123-MonacoGP-19279-Senna>调用地面软件</a>&nbsp;&nbsp;&nbsp;<a href=javascript:delete_Data(" + hardDiskManagelist[i].ID + ")>删除</a>";
                    break;
                case "4C":
                    url = "<a href=javascript:openC4Event(" + hardDiskManagelist[i].ID + ")>综合分析</a>&nbsp;&nbsp;&nbsp;<a href=vip3:123-MonacoGP-19279-Senna>调用地面软件</a>&nbsp;&nbsp;&nbsp;<a href=javascript:delete_Data(" + hardDiskManagelist[i].ID + ")>删除</a>";
                    break;


            }
            string alarmN = "<a href=javascript:openMap(\\\"" + hardDiskManagelist[i].MIS_LINE_ID + "\\\",\\\"" + hardDiskManagelist[i].DIRECTION + "\\\",\\\"" + hardDiskManagelist[i].ID + "\\\",\\\"" + CateGory + "\\\",\\\"" + hardDiskManagelist[i].START_TIME.ToShortDateString() + "\\\",\\\"" + hardDiskManagelist[i].END_TIME.ToShortDateString() + "\\\") >" + hardDiskManagelist[i].MY_INT_1 + "</a>";
            jsonStr.Append("{'startTime':'" + hardDiskManagelist[i].START_TIME.ToShortDateString() + "',");
            jsonStr.Append("'endTime':'" + hardDiskManagelist[i].END_TIME.ToShortDateString() + "',");
            jsonStr.Append("'lineName':'" + hardDiskManagelist[i].LINE_NAME + "',");
            jsonStr.Append("'Line_code':'" + hardDiskManagelist[i].MIS_LINE_ID + "',");
            jsonStr.Append("'direction':'" + hardDiskManagelist[i].DIRECTION + "',");
            jsonStr.Append("'startKm':'K" + hardDiskManagelist[i].START_KM / 1000 + "+" + hardDiskManagelist[i].START_KM % 1000 + "',");
            jsonStr.Append("'endKm':'K" + hardDiskManagelist[i].END_KM / 1000 + "+" + hardDiskManagelist[i].END_KM % 1000 + "',");
            jsonStr.Append("'START_STATION':'" + hardDiskManagelist[i].START_STATION + "',");
            jsonStr.Append("'END_STATION':'" + hardDiskManagelist[i].END_STATION + "',");
            jsonStr.Append("'LINE_CODE':'" + hardDiskManagelist[i].MIS_LINE_ID + "',");
            jsonStr.Append("'MIS_LINE_ID':'" + GetLineIdbyLineCode(hardDiskManagelist[i].MIS_LINE_ID) + "',");
            jsonStr.Append("'VIDEO_PATH':'" + (hardDiskManagelist[i].VIDEO_PATH == null ? null : hardDiskManagelist[i].VIDEO_PATH.Replace("\\", "/")) + "',");
            jsonStr.Append("'alarmN':'" + alarmN + "',");
            jsonStr.Append("'ID':'" + hardDiskManagelist[i].ID + "',");
            jsonStr.Append("'CZ':'" + url + "',");
            jsonStr.Append("'DATA_TYPE':'" + hardDiskManagelist[i].DATA_TYPE + "'");
            jsonStr.Append(i == hardDiskManagelist.Count - 1 ? "}" : "},");
        }
        jsonStr.Append("],'page':'" + pageIndex + "','rp':'" + pageSize + "','total':'" + recordCount + "'}");
        jsonStr = jsonStr.Replace("'", "\"");
        context.Response.Write(jsonStr);
        context.Response.End();
        context.Response.Clear();
    }
    /// <summary>
    /// 
    /// </summary>
    /// <param name="lineCode"></param>
    /// <returns></returns>
    private string GetLineIdbyLineCode(String lineCode)
    {
        LineCond lineCond = new LineCond();
        lineCond.LINE_CODE = lineCode;
        String misLineId = "";
        IList<Api.Foundation.entity.Foundation.Line> lineList = Api.ServiceAccessor.GetFoundationService().queryLine(lineCond);
        if (lineList.Count == 1)
        {
            misLineId = lineList[0].ID;
        }
        return misLineId;
    }
    public void DeteleDate()
    {
        string HARDDISK_MANAGE_ID = HttpContext.Current.Request["HARDDISK_MANAGE_ID"];
        string DATA_TYPE = HttpContext.Current.Request["DATA_TYPE"];
        bool re = false;

        try
        {
            switch (DATA_TYPE)
            {
                //查询C1原始数据
                case "1C":
                    DeleteC1Event(HARDDISK_MANAGE_ID);
                    break;
                case "2C":
                    DeleteC2Event(HARDDISK_MANAGE_ID);
                    break;
                case "4C":
                    DeleteC4Event(HARDDISK_MANAGE_ID);
                    break;
                default:
                    DeleteC1Event(HARDDISK_MANAGE_ID);
                    break;
            }
            re = true;
        }
        catch (Exception ex)
        {
            log4net.ILog log = log4net.LogManager.GetLogger("批量删除巡检数据");
            log.Error("执行出错", ex);
        }

        StringBuilder json = new StringBuilder();
        json.Append("{\"re\":\"" + re + "\"}");

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }
    public void DeleteC1Event(string HARDDISK_MANAGE_ID)
    {
        string alarmsql = string.Format(@"UPDATE ALARM SET HARDDISK_MANAGE_ID = NULL WHERE HARDDISK_MANAGE_ID = '{0}'", HARDDISK_MANAGE_ID);
        string eventsql = string.Format(@"UPDATE C1_EVENT SET HARDDISK_MANAGE_ID = NULL WHERE HARDDISK_MANAGE_ID = '{0}'", HARDDISK_MANAGE_ID);

        Api.ServiceAccessor.GetEventService().deleteC1EventByHARDDISK_MANAGE_ID(HARDDISK_MANAGE_ID);//删除event
        DbHelperOra.ExecuteSql(alarmsql);//将alarm对应的HARDDISK_MANAGE_ID清空
        DbHelperOra.ExecuteSql(eventsql);//将C1_EVENT对应的HARDDISK_MANAGE_ID清空
        Api.ServiceAccessor.GetHardDiskManageServer().DeleteHardDiskManage(HARDDISK_MANAGE_ID);//删除对应的HARDDISK_MANAGE记录
    }
    public void DeleteC2Event(string HARDDISK_MANAGE_ID)
    {
        string alarmsql = string.Format(@"UPDATE ALARM SET HARDDISK_MANAGE_ID = NULL WHERE HARDDISK_MANAGE_ID = '{0}'", HARDDISK_MANAGE_ID);
        string eventsql = string.Format(@"UPDATE C2_EVENT SET HARDDISK_MANAGE_ID = NULL WHERE HARDDISK_MANAGE_ID = '{0}'", HARDDISK_MANAGE_ID);

        C2EventCond c2eventcond = new C2EventCond();
        c2eventcond.HARDDISK_MANAGE_ID = HARDDISK_MANAGE_ID;
        IList<C2Event> c2eventlist = new List<C2Event>();
        c2eventlist = Api.ServiceAccessor.GetEventService().getC2EventDetail(c2eventcond);
        Api.ServiceAccessor.GetEventService().deleteC2EventByHARDDISK_MANAGE_ID(HARDDISK_MANAGE_ID);//删除event
        DbHelperOra.ExecuteSql(alarmsql);//将alarm对应的HARDDISK_MANAGE_ID清空
        DbHelperOra.ExecuteSql(eventsql);//将C2_EVENT对应的HARDDISK_MANAGE_ID清空
        Api.ServiceAccessor.GetHardDiskManageServer().DeleteHardDiskManage(HARDDISK_MANAGE_ID);//删除对应的HARDDISK_MANAGE记录

        List<string> imglist = new List<string>();
        for (int i = 0; i < c2eventlist.Count; i++)
        {
            imglist.Add(c2eventlist[i].PIC_PATH_100W);
            imglist.Add(c2eventlist[i].PIC_PATH_500W);
        }
        DeleteIMG(imglist);//删除图片
    }
    public void DeleteC4Event(string HARDDISK_MANAGE_ID)
    {
        string alarmsql = string.Format(@"UPDATE ALARM SET HARDDISK_MANAGE_ID = NULL WHERE HARDDISK_MANAGE_ID = '{0}'", HARDDISK_MANAGE_ID);
        string eventsql = string.Format(@"UPDATE C4_EVENT SET HARDDISK_MANAGE_ID = NULL WHERE HARDDISK_MANAGE_ID = '{0}'", HARDDISK_MANAGE_ID);

        C4EventCond c4eventcond = new C4EventCond();
        c4eventcond.HARDDISK_MANAGE_ID = HARDDISK_MANAGE_ID;
        IList<C4Event> c4eventlist = new List<C4Event>();
        c4eventlist = Api.ServiceAccessor.GetEventService().getC4EventDetail(c4eventcond);
        Api.ServiceAccessor.GetEventService().deleteC4EventByHARDDISK_MANAGE_ID(HARDDISK_MANAGE_ID);//删除event
        DbHelperOra.ExecuteSql(alarmsql);//将alarm对应的HARDDISK_MANAGE_ID清空
        DbHelperOra.ExecuteSql(eventsql);//将C4_EVENT对应的HARDDISK_MANAGE_ID清空
        Api.ServiceAccessor.GetHardDiskManageServer().DeleteHardDiskManage(HARDDISK_MANAGE_ID);//删除对应的HARDDISK_MANAGE记录

        List<string> imglist = new List<string>();
        for (int i = 0; i < c4eventlist.Count; i++)
        {
            imglist.Add(c4eventlist[i].PIC_PATH_A01);
            imglist.Add(c4eventlist[i].PIC_PATH_A02);
            imglist.Add(c4eventlist[i].PIC_PATH_A03);
            imglist.Add(c4eventlist[i].PIC_PATH_A04);
            imglist.Add(c4eventlist[i].PIC_PATH_A05);
            imglist.Add(c4eventlist[i].PIC_PATH_A06);
            imglist.Add(c4eventlist[i].PIC_PATH_B01);
            imglist.Add(c4eventlist[i].PIC_PATH_B02);
            imglist.Add(c4eventlist[i].PIC_PATH_B03);
            imglist.Add(c4eventlist[i].PIC_PATH_B04);
            imglist.Add(c4eventlist[i].PIC_PATH_B05);
            imglist.Add(c4eventlist[i].PIC_PATH_B06);
        }
        DeleteIMG(imglist);//删除图片
    }
    public void DeleteIMG(List<string> imglist)
    {
        for (int i = 0; i < imglist.Count; i++)
        {
            if (!string.IsNullOrEmpty(imglist[i]))
            {
                string url = HttpContext.Current.Server.MapPath("/" + imglist[i].Replace("#","%23"));
                if (File.Exists(url))
                {
                    try
                    {
                        File.Delete(url);
                    }
                    catch (System.Exception ex)
                    {
                        // 忽略文件删除错误
                        log4net.ILog log = log4net.LogManager.GetLogger("删除巡检图片");
                        log.Error("执行出错，图片路径：" + imglist[i], ex);
                    }
                }
            }
        }
    }
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}