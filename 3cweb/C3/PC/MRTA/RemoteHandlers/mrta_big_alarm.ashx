<%@ WebHandler Language="C#" Class="mrta_big_alarm" %>

using System;
using System.Web;

using System.Text;
using System.Collections.Generic;
using Api.Fault.entity.alarm;

using Api.Fault.entity.sms;
using Api.Foundation.entity.Foundation;
using Api.Foundation.entity.Cond;

public class mrta_big_alarm :ReferenceClass, IHttpHandler {

    
    public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "text/plain";
     //   context.Response.Write("Hello World");

        string action = context.Request["action"].ToString();

        switch (action)
        { 
            case "GetList":
                GetList(context);
                break;
            case "GetList_loca":
                GetList_loca(context);
                break;
        
        }        
        
    }

    private void GetList_loca(HttpContext context)
    {

        C3_SmsCond c3 = new C3_SmsCond();
        c3.startTime = DateTime.Now.AddDays(-10);    
        c3.page = 1;
        c3.pageSize = 10;
        c3.businssAnd = " GIS_X_O !=0 ";

        string ju = HttpContext.Current.Request["ju"];
        string lineCode = HttpContext.Current.Request["LineCode"];
        string key = HttpContext.Current.Request["key"].ToUpper();

        string LocaType = HttpContext.Current.Request["LocaType"];

       
        

        if (!string.IsNullOrEmpty(LocaType))
        {
            c3.businssAnd +=" and  GetLocaType(locomotive_code)=" + LocaType;

        }

        if (!string.IsNullOrEmpty(key))
        {
            c3.businssAnd += " and  TRAIN_NO like '%" + key + "%'";
        
        }
        
        if (!string.IsNullOrEmpty(ju) && ju != "0")
        {
            string OrgType = HttpContext.Current.Request["OrgType"]; //组织类型：局、机务段、供电段

            switch (OrgType)
            {
                case "局":
                    c3.BUREAU_CODE = ju;
                    break;
                case "机务段":
                    c3.P_ORG_CODE = ju;
                    break;
                case "供电段":
                    c3.P_ORG_CODE = ju;
                    break;
            }
           
        }
        
        
        if (!string.IsNullOrEmpty(lineCode)  && lineCode != "0")
        {
            c3.LINE_CODE = lineCode;
        }
        
        
        
        List<C3_Sms> locgj = Api.ServiceAccessor.GetSmsService().getC3SmsbyCondition_OnelocaOneData(c3);

        StringBuilder re = new StringBuilder();
        
        for (int i = 0; i < locgj.Count; i++)
        {
       
            string wz =  PublicMethod.GetPositionBySMSID(locgj[i].ID);
            
            re.Append(string.Format(@"
<div class='locaItem' id='{0}'>
    <div class='m_loca0 d'  title='{0}'>{0}</div>
    <div class='m_loca1 d'  title='{1}'>{1}</div>
    <div class='m_loca2 d' title='{2}'>{2}</div>
    <div class='cls'></div>    
</div>", locgj[i].LOCOMOTIVE_CODE
       , locgj[i].DETECT_TIME.ToString("MM-dd HH:mm:ss")
       , wz


       ));

        }


        context.Response.Write(re.ToString());        
        
    }    
    

    private void GetList(HttpContext context)
    {
        C3_AlarmCond alarmCond = new C3_AlarmCond();

        alarmCond.STATUS = "AFSTATUS01";
        alarmCond.DATA_TYPE = "ALARM";
        alarmCond.CATEGORY_CODE = "3C";
        alarmCond.businssAnd = " GIS_X_O !=0 ";
        alarmCond.page = 1;
        alarmCond.pageSize = Int32.Parse(System.Configuration.ConfigurationManager.AppSettings["AlarmCount"]);

        string ju = HttpContext.Current.Request["ju"];
        string lineCode = HttpContext.Current.Request["LineCode"];
        string LocaType = HttpContext.Current.Request["LocaType"];

        if (!string.IsNullOrEmpty(LocaType))
        {
            alarmCond.businssAnd += " and GetLocaType(detect_device_code)=" + LocaType;

        }

        if (!string.IsNullOrEmpty(ju) && ju != "0")
        {
            string OrgType = HttpContext.Current.Request["OrgType"]; //组织类型：局、机务段、供电段

            switch (OrgType)
            {
                case "局":
                    alarmCond.BUREAU_CODE = ju;
                    break;
                case "机务段":
                    alarmCond.P_ORG_CODE = ju;
                    break;
                case "供电段":
                    alarmCond.POWER_SECTION_CODE = ju;
                    break;
            }
        }
        
        if (!string.IsNullOrEmpty(lineCode) && lineCode != "0")
        {
            alarmCond.LINE_CODE = lineCode;
        }
        
        
        
        alarmCond.orderBy = " RAISED_TIME desc";    //排序                 
        List<C3_Alarm> alarmList =  Api.ServiceAccessor.GetAlarmService().getC3Alarm(alarmCond);
        
        StringBuilder locTagstr = new StringBuilder();

        for (int i = 0; i < alarmList.Count; i++)
        {

                    
            string lineName=alarmList[i].LINE_NAME;
            if(!string.IsNullOrEmpty(lineName))
            {
                lineName = lineName + "&nbsp;";
            }
            
            string wz = lineName + PublicMethod.GetWZbyAlarm(alarmList[i],null);
           

            string Summary = PublicMethod.GetSummaryByAlarm(alarmList[i]).Replace("车号" + alarmList[i].DETECT_DEVICE_CODE + "&nbsp;", "");

            
            
            
            string clickStr = "onclick=ClickAlarm('" + alarmList[i].ID + "')";
            locTagstr.Append(string.Format(@"
<div class='alarmItem' id='{4}' {3} >
    <div class='m_locaNo d'  title='{0}'>{0}</div>
    <div class='m_mapInfo  d'  title='{7}'>{1}</div>
    <div class='m_type d' title='{5}'>{5}</div>
    <div class='m_level d' title='{2}'>{2}</div>   
    <div class='m_memo d' style='display:none' data-toggle='tooltip' title='{6}'>{6}</div> 
    <div class='cls'></div>    
</div>"
                , alarmList[i].DETECT_DEVICE_CODE
                , alarmList[i].RAISED_TIME.ToString("MM-dd HH:mm")
                , alarmList[i].SEVERITY
                , clickStr
                , alarmList[i].ID
                ,wz
                ,Summary
                , alarmList[i].RAISED_TIME.ToString("yyyy-MM-dd HH:mm:ss")
                ));

        }
        context.Response.Write(locTagstr.ToString());        
    }


    
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}