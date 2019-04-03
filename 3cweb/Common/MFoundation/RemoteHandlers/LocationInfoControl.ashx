<%@ WebHandler Language="C#" Class="LocationInfoControl" %>

using System;
using System.Web;
using Api.Foundation.entity.Foundation;
using System.Collections.Generic;
using Api.Foundation.service;
using Api;
using Newtonsoft.Json;
using System.Text;
using Api.Foundation.entity.Cond;

public class LocationInfoControl : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        string type = context.Request["type"];

        switch (type)
        {
            //查询所有设备
            case "all":
                GetAll();
                break;
        }
    }

    /// <summary>
    /// 获取根据条件获取定位数据库
    /// </summary>
    private void GetAll()
    {
        //获取前台页码
        int pageIndex = Convert.ToInt32(HttpContext.Current.Request["page"]);
        //获取前台条数
        int pageSize = Convert.ToInt32(HttpContext.Current.Request["rp"]);

        LocationInfoCond cond = new LocationInfoCond();
        cond.pageNum = pageIndex;
        cond.pageSize = pageSize;
        if (HttpContext.Current.Request["LINE_CODE"] != null && HttpContext.Current.Request["LINE_CODE"] != "undefined" && HttpContext.Current.Request["LINE_CODE"] != "" && HttpContext.Current.Request["LINE_CODE"] != "0")
        {
            cond.LINE_CODE = HttpContext.Current.Request["LINE_CODE"];
        }
        if (HttpContext.Current.Request["DIRECTION"] != null && HttpContext.Current.Request["DIRECTION"] != "undefined" && HttpContext.Current.Request["DIRECTION"] != "" && HttpContext.Current.Request["DIRECTION"] != "全部")
        {
            cond.DIRECTION = HttpContext.Current.Request["DIRECTION"];
        }
        if (HttpContext.Current.Request["START_KM"] != null && HttpContext.Current.Request["START_KM"] != "undefined" && HttpContext.Current.Request["START_KM"] != "" && HttpContext.Current.Request["START_KM"] != "0")
        {
            cond.startKm = Convert.ToInt32(HttpContext.Current.Request["START_KM"]);
        }
        if (HttpContext.Current.Request["END_KM"] != null && HttpContext.Current.Request["END_KM"] != "undefined" && HttpContext.Current.Request["END_KM"] != "" && HttpContext.Current.Request["END_KM"] != "0")
        {
            cond.endKm = Convert.ToInt32(HttpContext.Current.Request["END_KM"]);
        }


        

        IList<LocationInfo> list = ServiceAccessor.GetFoundationService().queryLocationInfo(cond);


        

        //获取总条数
        int recordCount = ServiceAccessor.GetFoundationService().getLocationInfoCount(cond);

        StringBuilder sb = new StringBuilder();
        sb.Append("{\"rows\":[");
        foreach (LocationInfo l in list)
        {
            sb.AppendFormat("{{\"LINE_CODE\":\"{0}\",\"DIRECTION\":\"{1}\",\"KM_MARK\":\"{2}\",\"GIS_X\":\"{3}\",\"GIS_Y\":\"{4}\"}},",
                Api.Util.Common.getLineInfo(l.LINE_CODE).LINE_NAME, l.DIRECTION, convertKm(l.KM_MARK.ToString()), l.GIS_LON, l.GIS_LAT);
        }
        string js = sb.ToString();
        if (js.LastIndexOf(',') > -1)
        {
            js = js.Substring(0, js.LastIndexOf(','));
        }
        js += String.Format("],\"page\":{0},\"rp\":{1},\"total\":{2}}}", pageIndex, pageSize, recordCount);

        HttpContext.Current.Response.Write(js);

    }

    private string convertKm(string km)
    {
        string formattedKM = string.Empty;
        if (km.Length < 4)
        {
            formattedKM = "K0+" + km;
        }
        else
        {
            string mile = km.Substring(km.Length - 3);
            if (mile.Equals("000"))
            {
                formattedKM = "K" + km.Substring(0, km.Length - 3) + "+0";
            }
            else
            {
                formattedKM = "K" + km.Substring(0, km.Length - 3) + "+" + km.Substring(km.Length - 3);
            }

        }
        return formattedKM;
    }
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}