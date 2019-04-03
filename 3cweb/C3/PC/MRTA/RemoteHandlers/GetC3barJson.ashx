<%@ WebHandler Language="C#" Class="GetC6TempJson" %>
using System;
using System.Web;
using System.Text;
using Newtonsoft.Json;
using System.Data;
using System.Text;
using Api.Fault.entity.alarm;
using System.Collections.Generic;
using System.Configuration;
using Api.Fault.entity.sms;
using Api.Foundation.entity.Foundation;
using System.Linq;

public class GetC6TempJson : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {

        //类型 1/2/3/NAME
        string type = context.Request["type"];

        switch (type)
        {

            case "GIS":
                GetGisByLocotiveNO(context, context.Request["locomotiveNo"]);
                break;
            case "scatter":
                DateTime bengtime = DateTime.Parse(context.Request["bgdate"]);
                DateTime endtime = DateTime.Parse(context.Request["eddate"]+ " 23:59:59");
                string locid = context.Request["locid"];
                string Bhvalues = context.Request["Bhvalues"];
                GetScatterchart(context, bengtime, endtime, Bhvalues);
                break;
            case "pie":
                GetPiechart(context, context.Request["bgdate"], context.Request["eddate"], context.Request["Bhvalues"]);
                break;
            case "area":
                Getareachart(context, context.Request["bgdate"], context.Request["eddate"], context.Request["Bhvalues"]);
                break;
            case "bar":
                string tp1 = context.Request["tp"];
                GetC3barValue(context, tp1);
                break;
            case "name":
                GetC3barName(context);
                break;
            case "GetLineCount":
                GetLineCount();
                break;

        }


    }

    private void GetLineCount()
    {
        string WhereLineName = HttpContext.Current.Request["WhereLineName"];
        string StarTime = HttpContext.Current.Request["StarTime"];
        string EndTime = HttpContext.Current.Request["EndTime"];

        DataTable dt = Alarm_Original.GetLineCount(WhereLineName, EndTime, StarTime).Tables[0];
        string names = "[";
        string values = "[";
        foreach (DataRow dr in dt.Rows)
        {
            string lineName = dr["line_name"].ToString();
            string lineCode = dr["line_code"].ToString();
            string n = dr["n"].ToString();

            if (names != "[")
            {
                names += ",{value:'" + lineName + "',lineCode:'" + lineCode + "'}";
            }
            else
            {
                names += "{value:'" + lineName + "',lineCode:'" + lineCode + "'}";
            }

            if (values == "[")
            {
                values += n;
            }
            else
            {
                values += "," + n;
            }
        }

        names += "]";
        values += "]";

        //["name1","name2"],[10,30]

        HttpContext.Current.Response.Write(names + '@' + values);


    }


    /// <summary>
    /// 获取设备的GIS坐标
    /// </summary>
    /// <param name="context"></param>
    /// <param name="locomotiveNo"></param>
    private void GetGisByLocotiveNO(HttpContext context, String locomotiveNo)
    {
        C3_SmsCond c3SmsCond = new C3_SmsCond();
        c3SmsCond.LOCOMOTIVE_CODE = locomotiveNo;
        c3SmsCond.orderBy = " detect_time desc";
        List<C3_Sms> list = Api.ServiceAccessor.GetSmsService().getC3SmsJsonbyCondition(c3SmsCond);
        String json = "[{GIS_X:'" + list[0].GIS_LON + "'" + ",GIS_Y:'" + list[0].GIS_LAT + "'" + "}]";
        context.Response.Cache.SetCacheability(HttpCacheability.NoCache);
        context.Response.ContentType = "application/json";
        object myObj = Newtonsoft.Json.JsonConvert.DeserializeObject(json);
        context.Response.Write(myObj);
    }

    /// <summary>
    /// 获取线路名称
    /// </summary>
    /// <param name="context"></param>
    public void GetC3barName(HttpContext context)
    {
        Api.Foundation.entity.Cond.LineCond linecod = new Api.Foundation.entity.Cond.LineCond();
        linecod.IS_SHOW = "1";
        IList<Api.Foundation.entity.Foundation.Line> Line = Api.ServiceAccessor.GetFoundationService().queryLine(linecod);
        string Json = "";
        Json += "[";
        for (int i = 0; i < Line.Count; i++)
        {
            Json += "'" + Line[i].LINE_NAME + "'" + ",";//名称
        }
        Json = Json.TrimEnd(',') + "]";
        context.Response.Cache.SetCacheability(HttpCacheability.NoCache);
        context.Response.ContentType = "text/plain";
        object myObj = Newtonsoft.Json.JsonConvert.DeserializeObject(Json.ToString());
        context.Response.Write(myObj);
    }


    /// <summary>
    /// 获取温度散列图
    /// </summary>
    /// <param name="context"></param>
    public void GetScatterchart(HttpContext context, string locid, DateTime bengtime, DateTime endtime)
    {
        C3_AlarmCond alarmCond = new C3_AlarmCond();
        List<C3_Alarm> alarmList = new List<C3_Alarm>();
        alarmCond.startTime = bengtime;
        alarmCond.endTime = endtime;
        alarmCond.DETECT_DEVICE_CODE = locid;
        alarmCond.CATEGORY_CODE = "3C";
        alarmList = Api.ServiceAccessor.GetAlarmService().getC3Alarm(alarmCond);
        StringBuilder Json = new StringBuilder();
        Json.Append("[");
        for (int i = 0, count = alarmList.Count; i < count; i++)
        {
            if (alarmList[i].MAX_TEMP / 100 >= 60)
            {
                Json.Append("{xv:" + alarmList[i].SPEED + ",yv:" + alarmList[i].MAX_TEMP / 100 + ",id:'" + alarmList[i].ID + "'},");//温度
            }
        }
        string rs = Json.ToString().TrimEnd(',') + "]";

        context.Response.Cache.SetCacheability(HttpCacheability.NoCache);
        context.Response.ContentType = "application/json";
        object myObj = Newtonsoft.Json.JsonConvert.DeserializeObject(rs);
        context.Response.Write(myObj);
    }
    /// <summary>
    /// 获取温度散列
    /// </summary>
    /// <param name="context"></param>
    /// <param name="bengtime"></param>
    /// <param name="endtime"></param>
    public void GetScatterchart(HttpContext context, DateTime bengtime, DateTime endtime, string Bhvalues)
    {
        C3_AlarmCond alarmCond = new C3_AlarmCond();
        alarmCond.startTime = bengtime;
        alarmCond.endTime = endtime ;
        // alarmCond.DETECT_DEVICE_CODE = "";
        if (Bhvalues != null)
        {
            alarmCond.businssAnd = "DETECT_DEVICE_CODE in (" + Bhvalues + ")";
        }

        alarmCond.orderBy = "DETECT_DEVICE_CODE";
        List<C3_Alarm> alarmList = Api.ServiceAccessor.GetAlarmService().queryC3AlarmTempScatter(alarmCond);

        StringBuilder Json = new StringBuilder();
        string currentLOCA = "";

        if (alarmList.Count > 0)
        {
            Json.Append("[");

            for (int i = 0, count = alarmList.Count; i < count; i++)
            {
                if (alarmList[i].DETECT_DEVICE_CODE != currentLOCA)
                {
                    currentLOCA = alarmList[i].DETECT_DEVICE_CODE;
                    Json.Append("{name:'" + alarmList[i].DETECT_DEVICE_CODE + "',data:[");
                }

                if (alarmList[i].MAX_TEMP / 100 >= 60)
                {
                    Json.Append("{xv:" + alarmList[i].SPEED + ",yv:" + alarmList[i].MAX_TEMP / 100 + ",id:'" + alarmList[i].ID + "'}" + (i == count - 1 ? "" : ","));//温度
                }
                if (i + 1 < alarmList.Count)
                {
                    if (alarmList[i + 1].DETECT_DEVICE_CODE != currentLOCA)
                    {
                        Json.Append("],xField: 'xv',yField: 'yv'},");
                    }
                }

            }
            Json.Append("],xField: 'xv',yField: 'yv'}");
            Json.Append("]");
        }

        context.Response.Cache.SetCacheability(HttpCacheability.NoCache);
        context.Response.ContentType = "application/json";
        object myObj = Newtonsoft.Json.JsonConvert.DeserializeObject(Json.ToString());
        context.Response.Write(myObj);
    }

    /// <summary>
    /// 获取温度散列图
    /// </summary>
    /// <param name="context"></param>
    public void GetPiechart(HttpContext context, string bengtime, string endtime, string Bhvalues)
    {

        StringBuilder Json = new StringBuilder();
        Json.Append("[");
        C3_AlarmCond c3ac = new C3_AlarmCond();
        c3ac.startTime =Convert.ToDateTime(bengtime);
        c3ac.endTime = Convert.ToDateTime(endtime + " 23:59:59");
        string whereadd = "";
        if (Bhvalues != null)
        {

            whereadd = " and DETECT_DEVICE_CODE in (" + Bhvalues + ")";
        }
        int maxWD = Api.ServiceAccessor.GetAlarmService().queryAlarmMaxTemperature(c3ac) / 100;

        int minWD = 60;

        int wdcount = maxWD / 20;


        C3_AlarmCond cac = new C3_AlarmCond();
        int startwd;
        int endwd;
        for (int i = 0; i <= wdcount - 3; i++)
        {
            startwd = minWD;
            endwd = minWD + 20;
            minWD = endwd;
            cac.startTime = DateTime.Parse(bengtime);
            cac.endTime = DateTime.Parse(endtime + " 23:59:59");


            cac.businssAnd = " NVALUE4>=" + startwd * 100 + " and NVALUE4<" + endwd * 100 + whereadd;




            int c3count = Api.ServiceAccessor.GetAlarmService().getC3AlarmCount(cac);

            if (c3count > 0)
                Json.AppendFormat("{{category:'{0}',value:'{1}'}},", startwd + "℃至" + endwd + "℃", c3count);
        }
        string rs = Json.ToString().TrimEnd(',') + "]";
        context.Response.Cache.SetCacheability(HttpCacheability.NoCache);
        context.Response.ContentType = "application/json";
        object myObj = Newtonsoft.Json.JsonConvert.DeserializeObject(rs);
        context.Response.Write(myObj);
    }
    /// <summary>
    /// 温度区域
    /// </summary>
    /// <param name="context"></param>
    /// <param name="bengtime"></param>
    /// <param name="endtime"></param>
    public void Getareachart(HttpContext context, string bengtime, string endtime, string Bhvalues)
    {

        StringBuilder Json = new StringBuilder();
        Json.Append("[");
        C3_AlarmCond c3ac = new C3_AlarmCond();
        c3ac.startTime = DateTime.Parse(bengtime);
        c3ac.endTime = DateTime.Parse(endtime + " 23:59:59");
        if (Bhvalues != null)
        {
            c3ac.businssAnd = "DETECT_DEVICE_CODE in (" + Bhvalues + ")";
        }

        int maxWD = Api.ServiceAccessor.GetAlarmService().queryAlarmMaxTemperature(c3ac) / 100;
        List<C3_Alarm> list = Api.ServiceAccessor.GetAlarmService().queryC3AlarmTempArea(c3ac);

        int minWD = 60;
        int wdcount = maxWD / 20;
        int startwd;
        int endwd;

        Api.Foundation.entity.Cond.LineCond linecod = new Api.Foundation.entity.Cond.LineCond();
        linecod.IS_SHOW = "1";
        IList<Line> lineList = Api.ServiceAccessor.GetFoundationService().queryLine(linecod);


        for (int i = 0; i <= wdcount - 3; i++)
        {
            startwd = minWD;
            endwd = minWD + 20;
            minWD = endwd;
            string datas = "[";
            foreach (Line l in lineList)
            {
                datas += list.Where(p => p.MAX_TEMP > startwd * 100 && p.MAX_TEMP < endwd * 100 && p.LINE_CODE == l.LINE_CODE).Count() + ",";
            }
            datas += "]";
            Json.Append("{name: '" + startwd + "℃至" + endwd + "℃',data: " + datas + "},");
        }
        string rs = Json.ToString().TrimEnd(',') + "]";
        context.Response.Cache.SetCacheability(HttpCacheability.NoCache);
        context.Response.ContentType = "application/json";
        object myObj = Newtonsoft.Json.JsonConvert.DeserializeObject(rs);
        context.Response.Write(myObj);
    }

    /// <summary>
    /// 取出各条线路的各类温度报警数量
    /// </summary>
    /// <param name="bengtime"></param>
    /// <param name="endtime"></param>
    /// <param name="startwd"></param>
    /// <param name="endwd"></param>
    /// <returns></returns>
    public static string GetLineAlarmCountByWD(string bengtime, string endtime, int startwd, int endwd, IList<Line> lineList)
    {
        string Json = "[";
        C3_AlarmCond cac = new C3_AlarmCond();
        for (int i = 0; i < lineList.Count; i++)
        {
            cac.startTime = DateTime.Parse(bengtime);
            cac.endTime = DateTime.Parse(endtime + " 23:59:59");
            cac.LINE_CODE = lineList[i].LINE_CODE;
            cac.businssAnd = " NVALUE4>=" + startwd * 100 + " and NVALUE4<" + endwd * 100;
            int c3count = Api.ServiceAccessor.GetAlarmService().getC3AlarmCount(cac);
            Json += c3count + ",";
        }
        Json += "]";
        return Json;
    }


    /// <summary>
    /// 获取线路各类缺陷值
    /// </summary>
    /// <param name="context"></param>
    public void GetC3barValue(HttpContext context, string type)
    {



        Api.Foundation.entity.Cond.LineCond linecod = new Api.Foundation.entity.Cond.LineCond();
        linecod.IS_SHOW = "1";
        IList<Api.Foundation.entity.Foundation.Line> Line = Api.ServiceAccessor.GetFoundationService().queryLine(linecod);
        C3_AlarmCond alarmCond = new C3_AlarmCond();
        alarmCond.DATA_TYPE = "FAULT";
        alarmCond.businssAnd += " status <> 'AFSTATUS05'  and status <> 'AFSTATUS02' ";
        alarmCond.startTime = DateTime.Now.AddDays(Int32.Parse(ConfigurationManager.AppSettings["FaultTimePeriod"]));
        alarmCond.endTime = DateTime.Now;
        StringBuilder sb = new StringBuilder();

        switch (type)
        {
            case "1":
                alarmCond.SEVERITY = "一类";

                break;
            case "2":
                alarmCond.SEVERITY = "二类";
                break;
            case "3":
                alarmCond.SEVERITY = "三类";
                break;
        }

        sb.Append("{name:\"" + alarmCond.SEVERITY + "\",startTime:\"" + alarmCond.startTime.ToString("yyyy-MM-dd") + "\",endTime:\"" + alarmCond.endTime.ToString("yyyy-MM-dd") + "\",data:[");
        for (int i = 0; i < Line.Count; i++)
        {
            alarmCond.LINE_CODE = Line[i].LINE_CODE;
            sb.Append("{value:'" + Api.ServiceAccessor.GetAlarmService().getC3AlarmCount(alarmCond) + "',code:'" + Line[i].LINE_CODE + "'}" + (i == Line.Count - 1 ? "" : ","));//数量
        }
        sb.Append("]}");
        context.Response.Cache.SetCacheability(HttpCacheability.NoCache);
        context.Response.ContentType = "text/plain";
        context.Response.Write(sb.ToString());
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}