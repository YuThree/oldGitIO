<%@ WebHandler Language="C#" Class="Get3CAlarmJson" %>

using System;
using System.Web;
using System.Text;
using Newtonsoft.Json;
using System.Data;
using System.Text;
using System.Collections.Generic;
using System.Configuration;
using Api.Fault.entity.alarm;
using Api.Foundation.entity.Foundation;
using Api.Foundation.entity.Cond;
using Api.Foundation.entity;

public class Get3CAlarmJson : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {

        string type = HttpContext.Current.Request["type"];

        string OrgCode = HttpContext.Current.Request["OrgCode"];
        string orgType = HttpContext.Current.Request["OrgType"];
        string LineCode = HttpContext.Current.Request["LineCode"];
        string LocaType = HttpContext.Current.Request["LocaType"];

        if (type == "NAME")
        {
            if (orgType == "总公司")
            {
                IList<Organization> orgList = new List<Organization>();
                OrganizationCond org = new OrganizationCond();

                org.ORG_TYPE = "局";

                orgList = Api.ServiceAccessor.GetFoundationService().queryOrganization(org);




                string Json = "";
                Json += "[";
                for (int i = 0; i < orgList.Count; i++)
                {
                    if (i == orgList.Count - 1)
                    {
                        Json += "'" + orgList[i].ORG_NAME.Replace("铁路", "") + "'";//名称
                    }
                    else
                    {
                        Json += "'" + orgList[i].ORG_NAME.Replace("铁路", "") + "'" + ",";//名称
                    }
                }
                Json += "]";
                context.Response.Cache.SetCacheability(HttpCacheability.NoCache);
                context.Response.ContentType = "text/plain";
                object myObj = Newtonsoft.Json.JsonConvert.DeserializeObject(Json.ToString());
                context.Response.Write(myObj);
            }
            else if (orgType == "局")
            {
                IList<Line> LineList = new List<Line>();
                LineCond linecode = new LineCond();
                linecode.BUREAU_CODE = OrgCode;
                linecode.IS_SHOW = "1";
                if (LineCode != "")
                {
                    linecode.LINE_CODE = LineCode;
                }
                LineList = Api.ServiceAccessor.GetFoundationService().queryLine(linecode);




                string Json = "";
                Json += "[";
                for (int i = 0; i < LineList.Count; i++)
                {
                    if (i == LineList.Count - 1)
                    {
                        Json += "'" + LineList[i].LINE_NAME + "'";//名称
                    }
                    else
                    {
                        Json += "'" + LineList[i].LINE_NAME + "'" + ",";//名称
                    }
                }
                Json += "]";
                context.Response.Cache.SetCacheability(HttpCacheability.NoCache);
                context.Response.ContentType = "text/plain";
                object myObj = Newtonsoft.Json.JsonConvert.DeserializeObject(Json.ToString());
                context.Response.Write(myObj);
            }
        }
        else if (type == "1")
        {
            GetAlarmJson(context, OrgCode, orgType, LineCode, type);
        }
        else if (type == "2")
        {
            GetAlarmJson(context, OrgCode, orgType, LineCode, type);
        }
        else if (type == "3")
        {
            GetAlarmJson(context, OrgCode, orgType, LineCode, type);
        }
    }

    private static void GetAlarmJson(HttpContext context, string OrgCode, string orgType, string LineCode, string type)
    {
        if (orgType == "总公司")
        {
            IList<Organization> orgList = new List<Organization>();
            OrganizationCond org = new OrganizationCond();
            org.ORG_TYPE = "局";
            orgList = Api.ServiceAccessor.GetFoundationService().queryOrganization(org);

            AlarmCond alarmCond = new AlarmCond();
            if (type == "1")
            {
                alarmCond.SEVERITY = "一类";
            }
            else if (type == "2")
            {
                alarmCond.SEVERITY = "二类";
            }
            else if (type == "3")
            {
                alarmCond.SEVERITY = "三类";

            }
            alarmCond.startTime = Convert.ToDateTime(DateTime.Now.ToString("yyyy-MM-dd 00:00:00"));
            alarmCond.endTime = DateTime.Now;
            string Json = "";
            Json += "[";
            for (int i = 0; i < orgList.Count; i++)
            {
                alarmCond.BUREAU_CODE = orgList[i].ORG_CODE;
                alarmCond.businssAnd = " gis_x_o!= 0  and  status !='AFSTATUS02'";
                alarmCond.CATEGORY_CODE = "3C";

                if (i == orgList.Count - 1)
                {
                    Json += Api.ServiceAccessor.GetAlarmService().getAlarmCount(alarmCond);//数量
                }
                else
                {
                    Json += Api.ServiceAccessor.GetAlarmService().getAlarmCount(alarmCond) + ",";//数量
                }
            }
            Json += "]";
            context.Response.Cache.SetCacheability(HttpCacheability.NoCache);
            context.Response.ContentType = "text/plain";
            object myObj = Newtonsoft.Json.JsonConvert.DeserializeObject(Json.ToString());
            context.Response.Write(myObj);
        }
        else
        {
            IList<Line> LineList = new List<Line>();
            LineCond linecode = new LineCond();
            linecode.BUREAU_CODE = OrgCode;
            linecode.IS_SHOW = "1";
            if (LineCode != "")
            {
                linecode.LINE_CODE = LineCode;
            }
            LineList = Api.ServiceAccessor.GetFoundationService().queryLine(linecode);

            AlarmCond alarmCond = new AlarmCond();
            if (type == "1")
            {
                alarmCond.SEVERITY = "一类";
            }
            else if (type == "2")
            {
                alarmCond.SEVERITY = "二类";
            }
            else if (type == "3")
            {
                alarmCond.SEVERITY = "三类";

            }
            alarmCond.startTime = Convert.ToDateTime(DateTime.Now.ToString("yyyy-MM-dd 00:00:00"));
            alarmCond.endTime = DateTime.Now;
            alarmCond.BUREAU_CODE = OrgCode;
            string Json = "";
            Json += "[";
            for (int i = 0; i < LineList.Count; i++)
            {
                alarmCond.LINE_CODE = LineList[i].LINE_CODE;
                alarmCond.businssAnd = " gis_x_o!= 0 and  status !='AFSTATUS02'";
                alarmCond.CATEGORY_CODE = "3C";

                if (i == LineList.Count - 1)
                {
                    Json += Api.ServiceAccessor.GetAlarmService().getAlarmCount(alarmCond);//数量
                }
                else
                {
                    Json += Api.ServiceAccessor.GetAlarmService().getAlarmCount(alarmCond) + ",";//数量
                }
            }
            Json += "]";
            context.Response.Cache.SetCacheability(HttpCacheability.NoCache);
            context.Response.ContentType = "text/plain";
            object myObj = Newtonsoft.Json.JsonConvert.DeserializeObject(Json.ToString());
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