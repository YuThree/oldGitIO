<%@ WebHandler Language="C#" Class="Get3CLocoJson" %>

using System;
using System.Web;
using System.Text;
using Newtonsoft.Json;
using System.Data;
using System.Text;
using System.Collections.Generic;
using System.Configuration;
using Api.Fault.entity.sms;
using Api.Foundation.entity.Foundation;
using Api.Foundation.entity.Cond;
using Api.Foundation.entity;

public class Get3CLocoJson : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {


        string type = HttpContext.Current.Request["type"];

        string OrgCode = HttpContext.Current.Request["OrgCode"];
        string OrgType = HttpContext.Current.Request["OrgType"];
        string LineCode = HttpContext.Current.Request["LineCode"];
        string LocaType = HttpContext.Current.Request["LocaType"];
        if (type == "NAME")
        {
            IList<Organization> orgList = new List<Organization>();
            OrganizationCond org = new OrganizationCond();

            if (OrgType == "局")
            {
                org.ORG_CODE = OrgCode;
            }
            else
            {
                org.ORG_TYPE = "局";
            }
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
        else if (type == "1")
        {
            IList<Organization> orgList = new List<Organization>();
            OrganizationCond org = new OrganizationCond();
            if (OrgType == "局")
            {
                org.ORG_CODE = OrgCode;
            }
            else
            {
                org.ORG_TYPE = "局";
            }

            orgList = Api.ServiceAccessor.GetFoundationService().queryOrganization(org);

            C3_SmsCond smsCond = new C3_SmsCond();
            if (!string.IsNullOrEmpty(LocaType))
            {
                smsCond.businssAnd = " GetLocaType(locomotive_code)=" + LocaType;

            }
            if (LineCode != "")
            {
                smsCond.LINE_CODE = LineCode;
            }
            smsCond.startTime = Convert.ToDateTime(DateTime.Now.ToString("yyyy-MM-dd 00:00:00"));
            smsCond.endTime = DateTime.Now;
            if (smsCond.businssAnd != null)
            {
                smsCond.businssAnd += " and ";
            }
            smsCond.businssAnd += " gis_x_o !=0";
            string Json = "";
            Json += "[";
            for (int i = 0; i < orgList.Count; i++)
            {
                smsCond.BUREAU_CODE = orgList[i].ORG_CODE;

                if (i == orgList.Count - 1)
                {
                    Json += Api.ServiceAccessor.GetSmsService().getC3SmsLocoCount(smsCond);//数量
                }
                else
                {
                    Json += Api.ServiceAccessor.GetSmsService().getC3SmsLocoCount(smsCond) + ",";//数量
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