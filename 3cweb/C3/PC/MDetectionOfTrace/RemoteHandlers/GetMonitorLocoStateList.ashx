<%@ WebHandler Language="C#" Class="GetMonitorLocoStateList" %>

using System;
using System.Web;
using System.IO;
using System.Data;
using System.Collections.Generic;
using Api.Foundation.entity.Foundation;
using Api.Foundation.entity.Cond;
using Api.Fault.entity.alarm;

/// <summary>
/// δʹ�á�
/// </summary>
public class GetMonitorLocoStateList : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {

        int pageIndex = Convert.ToInt32(HttpContext.Current.Request["page"]); //��ȡǰ̨ҳ��
        int pageSize = Convert.ToInt32(HttpContext.Current.Request["rp"]);//��ȡǰ̨����
        string ju = HttpContext.Current.Request["ju"]; //��
        string jwd = HttpContext.Current.Request["jwd"]; //�����
        string loccode = HttpContext.Current.Request["loccode"];//�豸���

        LocomotiveCond locc = new LocomotiveCond();
        
        //��ȡ����
        if (HttpContext.Current.Request["startdate"] != null && HttpContext.Current.Request["startdate"] != "")
        {
            DateTime startdate = DateTime.Parse(HttpContext.Current.Request["startdate"]);
            locc.startTime = startdate;
        }
        if (HttpContext.Current.Request["enddate"] != null && HttpContext.Current.Request["enddate"] != "")
        {
            DateTime enddate = DateTime.Parse(HttpContext.Current.Request["enddate"] + " 23:59:59");
            locc.endTime = enddate;
        }
        if (ju != null && ju != "0")
        {
            locc.BUREAU_CODE = ju;
        }
        if (jwd != null && jwd != "0")
        {
            locc.P_ORG_CODE = jwd;
        }
        if ( !string.IsNullOrEmpty( loccode))
        {
            locc.LOCOMOTIVE_CODE = loccode;
        }


        IList<LocomotiveListItem> loclist = Api.ServiceAccessor.GetFoundationService().queryLocomotiveList(locc);

        //��ȡ������
        int recordCount = loclist.Count; ;
        string bowstatus = "";   
        string gjurl;
        string gjmxurl;
        string YLnum;
        string ELnum;
        string SLnum;
        string jsonStr = "{'rows':[";
        for (int i = 0; i < loclist.Count; i++)
        {
            gjurl = "<a  href=javascript:selectInfo(" + loclist[i].LOCOMOTIVE_CODE + ")>ͼ�λ��켣</a> ";
            gjmxurl = "<a  href=javascript:selectDetailInfo(" + loclist[i].LOCOMOTIVE_CODE + ")>�鿴</a> ";

            YLnum = "<a  href=javascript:selectYLnumInfo(" + loclist[i].LOCOMOTIVE_CODE + ")>" + loclist[i].fault1Count + "</a> ";//��������
            ELnum = "<a  href=javascript:selectELnumInfo(" + loclist[i].LOCOMOTIVE_CODE + ")>" + loclist[i].fault2Count + "</a> ";//ȱ�ݸ���
            SLnum = "<a  href=javascript:selectSLnumInfo(" + loclist[i].LOCOMOTIVE_CODE + ")>" + loclist[i].fault3Count + "</a> ";//ȱ�ݸ���
            if (PublicMethod.marcar != "1")
            {
                if (loclist[i].bowStatus == "1")
                {
                    bowstatus = "����";
                }
                else
                {
                    bowstatus = "�쳣";
                }
            }
            else
            {
                if (loclist[i].bowStatus == "00")
                {
                    bowstatus = "4��5������";
                }
                else if (loclist[i].bowStatus == "01")
                {
                    bowstatus = "4������5���쳣";
                }
                else if (loclist[i].bowStatus == "10")
                {
                    bowstatus = "4���쳣5������";
                }
                else if (loclist[i].bowStatus == "11")
                {
                    bowstatus = "4���쳣5���쳣";
                }
                else
                {
                    bowstatus = "4���쳣5���쳣";
                }
            }
            jsonStr += "{'LOCOMOTIVE_CODE':'" + loclist[i].LOCOMOTIVE_CODE + "',";//�豸���
            //jsonStr += "'ju':'" + loclist[i].belongingBureau.ORG_NAME + "',";//��
            //jsonStr += "'duan':'" + loclist[i].belongingDepot.ORG_NAME + "',";//��
            jsonStr += "'runningStatus':'" + loclist[i].runningStatus + "',";//����״̬
            jsonStr += "'Statustime':'" + loclist[i].CREATE_DATE + "',";//���״̬ʱ��
            jsonStr += "'taxStatus':'" + loclist[i].taxStatus + "',";//tax
            jsonStr += "'renderStatus':'" + loclist[i].renderStatus + "',";//�״�
            jsonStr += "'gpsStatus':'" + loclist[i].gpsStatus + "',";//gps
            jsonStr += "'bowStatus':'" + bowstatus + "',";//��
            jsonStr += "'kmFlag':'" + PublicMethod.KmtoString(loclist[i].kmFlag) + "',";//�����
            jsonStr += "'YLnum':'" + YLnum + "',";//1
            jsonStr += "'ELnum':'" + ELnum + "',";//2
            jsonStr += "'SLnum':'" + SLnum + "',";//3
            jsonStr += "'GJurl':'" + gjurl + "',";//�켣
            jsonStr += "'GJMXurl':'" + gjmxurl + "',";//�켣��ϸ
            jsonStr += "'ID':'" + loclist[i].LOCOMOTIVE_CODE + "'";//����
            jsonStr += " },";
        }
        if (jsonStr.LastIndexOf(',') > 0)
        {
            jsonStr = jsonStr.Substring(0, jsonStr.LastIndexOf(',')) + "],'page':" + pageIndex + ",'rp':" + pageSize + ",'total':" + recordCount + "}";
        }
        else
        {
            jsonStr += "],'page':'" + pageIndex + "','rp':'" + pageSize + "','total':'" + recordCount + "'}";

        }
        jsonStr = jsonStr.Replace("'", "\"");
        HttpContext.Current.Response.Write(jsonStr);
        
        
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}