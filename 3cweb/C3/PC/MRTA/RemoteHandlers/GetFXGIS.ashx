<%@ WebHandler Language="C#" Class="Get3CMrta" %>

using System;
using System.Web;
using System.Text;
using Newtonsoft.Json;
using System.Data;
using Api.Util;
using Api.Fault.entity.alarm;
using System.Collections.Generic;
using Api.Fault.entity.sms;
using Api.Foundation.entity.Cond;
using Api.Foundation.entity.Foundation;

public class Get3CMrta : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        String type = context.Request.QueryString["type"];
        if (type == "alarm")
        {
            LineCond lincode = new LineCond();
            lincode.IS_SHOW = "1";
            lincode.myParaTime1 = DateTime.Now.AddDays(-1);
            lincode.myParaTime2 = DateTime.Now;
            lincode.myPara1 = "FAULT";
            lincode.myPara2 = "";
            IList<Line> lineList = Api.ServiceAccessor.GetFoundationService().queryLine(lincode);

            AlarmCond alarm = new AlarmCond();
            alarm.startTime = DateTime.Now.AddDays(-1);
            alarm.endTime = DateTime.Now;
            alarm.DATA_TYPE = "FAULT";
            int alarmCount = Api.ServiceAccessor.GetAlarmService().getAlarmCount(alarm);
            string html = "";
            if (alarmCount == 0)
            {
                alarmCount = 1;
            }
            for (int i = 0; i < lineList.Count; i++)
            {
                int Count =Convert.ToInt32(lineList[i].MY_STR_1);


                html += "<li data-corners='false' data-shadow='false' data-iconshadow='true' data-wrapperels='div' data-icon='arrow-r' data-iconpos='right' data-theme='c' class='ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-first-child ui-btn-up-c'>";
                html += "<div class='ui-btn-inner ui-li'><div class='ui-btn-text'>";
                html += "<a href='#' onclick='SetLine(\"" + lineList[i].LINE_CODE + "\",\"22\")' class='ui-link-inherit'>" + lineList[i].LINE_NAME + "-------------" + Count / alarmCount * 100 + "%</a>";
                html += "</div><span class='ui-icon ui-icon-arrow-r ui-icon-shadow'>&nbsp;</span></div></li>";
            }
            context.Response.Write(html);
        }
        else
        {

            StationSectionCond stationsection = new StationSectionCond();
            //区站名称
            String StationSectionName = context.Request.QueryString["positonCode"].ToString();
            //线路CODE
            String mislineCode = context.Request.QueryString["lineCode"].ToString();
            string Direction = context.Request.QueryString["Direction"].ToString();
            stationsection.LINE_CODE = mislineCode;

            if (StationSectionName.Split('*').Length > 1)

                stationsection.POSITION_CODE_PLUS = StationSectionName;
            else
                stationsection.POSITION_CODE = StationSectionName;

            IList<StationSection> liststationsection = Api.ServiceAccessor.GetFoundationService().queryStationSection(stationsection);

            C3_SmsCond c3sms = new C3_SmsCond();
            string positionName = "";
            if (liststationsection.Count > 0)
            {
                c3sms.POSITION_CODE = liststationsection[0].POSITION_CODE;
                positionName = liststationsection[0].POSITION_NAME;
            }
            

            c3sms.LINE_CODE = mislineCode;
            c3sms.startTime = DateTime.Now.AddDays(-3);
            c3sms.endTime = DateTime.Now;
            c3sms.DIRECTION = Direction;
            IList<C3_Sms> listc3sms = Api.ServiceAccessor.GetSmsService().getC3SmsbyCondition(c3sms);
            if (positionName == "" && listc3sms.Count > 0)
            {
                // positionName=listc3sms[0].p
            }

            AlarmCond alarm = new AlarmCond();
            alarm.startTime = DateTime.Now.AddDays(-3);
            alarm.endTime = DateTime.Now;
            if (liststationsection.Count > 0)
            {
                alarm.POSITION_CODE = liststationsection[0].POSITION_CODE;
            }
            alarm.LINE_CODE = mislineCode;
            alarm.DIRECTION = Direction;
            int AlarmCount = 0;
            if (type == "Alarm")
            {
                IList<Alarm> alarmList = Api.ServiceAccessor.GetAlarmService().getAlarm(alarm);

                if (positionName == "" && alarmList.Count > 0)
                {
                    positionName = alarmList[0].POSITION_NAME;
                }
                AlarmCount = alarmList.Count;
            }
            StringBuilder Json = new StringBuilder();
            Json.Append("[");
            Json.Append("{");
            Json.Append("Sms:\"" + listc3sms.Count + "\"");
            Json.Append(",");
            Json.Append("position:\"" + positionName + "\"");
            Json.Append(",");
            Json.Append("alarm:\"" + AlarmCount + "\"");
            Json.Append("}");
            Json.Append("]");

            object myObj = JsonConvert.DeserializeObject(Json.ToString());
            context.Response.Write(myObj);
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