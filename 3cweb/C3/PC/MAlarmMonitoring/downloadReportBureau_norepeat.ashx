<%@ WebHandler Language="C#" Class="downloadReportBureau_norepeat" %>

using System;
using System.Web;
using Api.Fault.entity.alarm;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using Api.ADO.entity;
using System.IO;
using System.Net;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using Microsoft.Reporting.WebForms;
using System.Data.OracleClient;
using System.Reflection;
using Newtonsoft.Json;

public class downloadReportBureau_norepeat :ReferenceClass,IHttpHandler {

    private DataSet ds;
    private int loadIndex = 0;
    private string repeat_info = "";
    private DataSet myDataSet;
    private DataTable tblChart;
    private DataTable tblDetail;
    private DataTable tblChartB;
    private DataTable tblChartC;
    private DataTable tblChartD;
    private DataTable tblChartE;
    private DataTable tblChartF;

    public void ProcessRequest (HttpContext context) {
        try
        {
            download(context);
        }
        catch (Exception ex)
        {
            HttpContext.Current.Response.Write("false");
            log4net.ILog log = log4net.LogManager.GetLogger("报表下载");
            log.Error("执行出错", ex);
        }
    }

    public void download(HttpContext context)
    {
        string str = Combine(context);
        string url ="{\"url\":["+ "\"" + str.Replace("\\", "\\\\")+ "\"" +"]}";

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(url);
    }

    /// <summary>
    /// 合成报表模板
    /// </summary>
    /// <param name="context"></param>
    /// <returns></returns>
    public string  Combine(HttpContext context)
    {
        string http = PublicMethod.GetHttp();
        C3_AlarmCond alarmCond = my_alarm.GetC3_AlermCond_AlarmList(); //生成告警条件实体
        alarmCond.orderBy = null;
        alarmCond.LINE_CODE = null;
        //alarmCond.startRowNum = 0;
        //alarmCond.endRowNum = 100;//最多合并100个文档
        List<Alarm> mlist = Api.ServiceAccessor.GetAlarmService().getC3AlarmReport_noRepeat(alarmCond);

        //Virtual_Dir_Info vp = GetDir();
        if (mlist.Count > 0)
        {
            if (!Directory.Exists(System.Web.HttpContext.Current.Server.MapPath(@"~/TempReport/")))
            {
                DirectoryInfo directoryInfo = new DirectoryInfo(System.Web.HttpContext.Current.Server.MapPath(@"~/TempReport/"));
                directoryInfo.Create();
            }

            //获取模板文档  网站根目录/Report/Model.doc
            string file = System.Web.HttpContext.Current.Server.MapPath(@"~/Report/") + "Model.doc";

            //获取对应铁路局编码orgCode和铁路局名orgName
            string time = DateTime.Now.ToString("yyyyMMddhhmmssfff");
            string orgcode = HttpContext.Current.Request["orgCode"];;
            string orgname = HttpContext.Current.Request["orgName"];;
            //在非超级管理员用户下  获取当前用户所属铁路局
            Api.Foundation.entity.Foundation.LoginUser m22 = Api.Util.Public.GetCurrentUser();
            if (m22.USER_CODE != "admin")
            {
                orgcode = m22.ORG_CODE;
                Api.Foundation.entity.Foundation.Organization m23 = Api.ServiceAccessor.GetFoundationService().queryOrganizationByCode(orgcode);
                orgname = m23.ORG_NAME;
            }

            //实例化统计板块的相关参数
            string text_type_in = "";
            string text_type_out = "";
            string text_line_in = "";
            string text_line_out = "";
            StringBuilder text_locodate = new StringBuilder();
            int dective_count = 0;

            export(time, orgname, orgcode,ref text_type_in,ref text_type_out,ref text_line_in,ref text_line_out,ref text_locodate,ref dective_count);//生成周报的统计版块

            Api.Util.WordAspose word = new Api.Util.WordAspose();
            word.OpenWord(orgname,file,alarmCond.startTime,alarmCond.endTime);
            word.InsertText(1, " 概述", 22);
            word.InsertText(2, "本路局车辆检测情况", 18);
            word.InsertText(0, text_type_in, 14);
            word.InsertFile(System.Web.HttpContext.Current.Server.MapPath(@"~/TempReport/1AlarmBureau"+orgname+time+".doc"));
            word.InsertText(0, "车辆运行情况如下：", 14);
            word.InsertText(0, text_locodate.ToString(), 14);
            if (dective_count > 7)
            {
                word.InsertBreak(1);
            }
            word.InsertText(0, text_line_in, 14);
            word.InsertFile(System.Web.HttpContext.Current.Server.MapPath(@"~/TempReport/2AlarmBureau"+orgname+time+".doc"));
            word.InsertText(2, "其他路局设备检测到本路局管辖范围线路情况", 18);
            word.InsertText(0, text_type_out, 14);
            word.InsertFile(System.Web.HttpContext.Current.Server.MapPath(@"~/TempReport/3AlarmBureau"+orgname+time+".doc"));
            word.InsertText(0, text_line_out, 14);
            word.InsertFile(System.Web.HttpContext.Current.Server.MapPath(@"~/TempReport/4AlarmBureau"+orgname+time+".doc"));

            int index3 = 1;

            try
            {
                for (int i = 0; i < mlist.Count; i++)
                {
                    if (i == 0)
                    {
                        word.InsertText(1,mlist[i].SVALUE12, 22);
                        word.InsertText(2,mlist[i].CODE_NAME, 18);
                        if (mlist[i].NVALUE15>1)
                        {
                            string repeatpath = repeat(mlist[i].SVALUE10, alarmCond.startTime, alarmCond.endTime);
                            if (i != mlist.Count-1)
                            {
                                if (mlist[i].CODE == mlist[i + 1].CODE)
                                {
                                    string delete = "0";
                                    string text = mlist[i].CODE_NAME + index3 + "（重复）";
                                    word.InsertFile(3, text, 16, repeatpath, delete);
                                    word.Delete(repeatpath);
                                }
                                else
                                {
                                    string delete = "0";
                                    word.InsertFile(repeatpath, delete,1);
                                    word.Delete(repeatpath);
                                }
                            }
                            else
                            {
                                string delete = "0";
                                word.InsertFile(repeatpath, delete,0);
                                word.Delete(repeatpath);
                            }
                        }
                        else
                        {
                            if (i != mlist.Count-1)
                            {
                                if (mlist[i].CODE == mlist[i + 1].CODE)
                                {
                                    string text = mlist[i].CODE_NAME + index3;
                                    string delete = mlist[i].CODE_NAME + "缺陷报告";
                                    word.InsertFile(3, text, 16, http + mlist[i].SVALUE13, delete);
                                }
                                else
                                {
                                    string delete = mlist[i].CODE_NAME + "缺陷报告";
                                    word.InsertFile(http + mlist[i].SVALUE13, delete,1);
                                }
                            }
                            else
                            {
                                string delete = mlist[i].CODE_NAME + "缺陷报告";
                                word.InsertFile(http + mlist[i].SVALUE13, delete,0);
                            }
                        }
                    }
                    else
                    {
                        if (!string.IsNullOrEmpty(mlist[i].SVALUE14))
                        {
                            if (mlist[i].SVALUE14 == mlist[i - 1].SVALUE14)
                            {
                                if (!string.IsNullOrEmpty(mlist[i].CODE))
                                {
                                    if (mlist[i].CODE == mlist[i - 1].CODE)
                                    {

                                        if (!string.IsNullOrEmpty(mlist[i].ID))
                                        {
                                            if (mlist[i].ID == mlist[i - 1].ID)
                                            {

                                            }
                                            else
                                            {
                                                index3++;
                                                if (mlist[i].NVALUE15>1)
                                                {
                                                    string repeatpath = repeat(mlist[i].SVALUE10, alarmCond.startTime, alarmCond.endTime);
                                                    string text = mlist[i].CODE_NAME + index3+"（重复）";
                                                    string delete = "0";
                                                    word.InsertFile(3, text, 16, repeatpath,delete);
                                                    word.Delete(repeatpath);
                                                }
                                                else
                                                {
                                                    string text = mlist[i].CODE_NAME + index3;
                                                    string delete = mlist[i].CODE_NAME + "缺陷报告";
                                                    word.InsertFile(3, text, 16, http + mlist[i].SVALUE13, delete);
                                                }
                                            }

                                        }
                                    }
                                    else
                                    {
                                        index3 = 1;
                                        word.InsertText(2,mlist[i].CODE_NAME, 18);
                                        if (mlist[i].NVALUE15>1)
                                        {
                                            string repeatpath = repeat(mlist[i].SVALUE10, alarmCond.startTime, alarmCond.endTime);
                                            if (i != mlist.Count-1)
                                            {
                                                if (mlist[i].CODE == mlist[i + 1].CODE)
                                                {
                                                    string delete = "0";
                                                    string text = mlist[i].CODE_NAME + index3 + "（重复）";
                                                    word.InsertFile(3, text, 16, repeatpath, delete);
                                                    word.Delete(repeatpath);
                                                }
                                                else
                                                {
                                                    string delete = "0";
                                                    word.InsertFile(repeatpath, delete,1);
                                                    word.Delete(repeatpath);
                                                }
                                            }
                                            else
                                            {
                                                string delete = "0";
                                                word.InsertFile(repeatpath, delete,0);
                                                word.Delete(repeatpath);
                                            }
                                        }
                                        else
                                        {
                                            if (i != mlist.Count-1)
                                            {
                                                if (mlist[i].CODE == mlist[i + 1].CODE)
                                                {
                                                    string text = mlist[i].CODE_NAME + index3;
                                                    string delete = mlist[i].CODE_NAME + "缺陷报告";
                                                    word.InsertFile(3, text, 16, http + mlist[i].SVALUE13, delete);
                                                }
                                                else
                                                {
                                                    string delete = mlist[i].CODE_NAME + "缺陷报告";
                                                    word.InsertFile(http + mlist[i].SVALUE13, delete,1);
                                                }
                                            }
                                            else
                                            {
                                                string delete = mlist[i].CODE_NAME + "缺陷报告";
                                                word.InsertFile(http + mlist[i].SVALUE13, delete,0);
                                            }
                                        }
                                    }

                                }
                            }
                            else
                            {
                                index3 = 1;
                                word.InsertText(1,mlist[i].SVALUE12, 22);
                                word.InsertText(2, mlist[i].CODE_NAME, 18);
                                if (mlist[i].NVALUE15>1)
                                {
                                    string repeatpath = repeat(mlist[i].SVALUE10, alarmCond.startTime, alarmCond.endTime);
                                    if (i != mlist.Count-1)
                                    {
                                        if (mlist[i].CODE == mlist[i + 1].CODE)
                                        {
                                            string delete = "0";
                                            string text = mlist[i].CODE_NAME + index3 + "（重复）";
                                            word.InsertFile(3, text, 16, repeatpath, delete);
                                            word.Delete(repeatpath);
                                        }
                                        else
                                        {
                                            string delete = "0";
                                            word.InsertFile(repeatpath, delete,1);
                                            word.Delete(repeatpath);
                                        }
                                    }
                                    else
                                    {
                                        string delete = "0";
                                        word.InsertFile(repeatpath, delete,0);
                                        word.Delete(repeatpath);
                                    }
                                }
                                else
                                {
                                    if (i != mlist.Count-1)
                                    {
                                        if (mlist[i].CODE == mlist[i + 1].CODE)
                                        {
                                            string text = mlist[i].CODE_NAME + index3;
                                            string delete = mlist[i].CODE_NAME + "缺陷报告";
                                            word.InsertFile(3, text, 16, http + mlist[i].SVALUE13, delete);
                                        }
                                        else
                                        {
                                            string delete = mlist[i].CODE_NAME + "缺陷报告";
                                            word.InsertFile(http + mlist[i].SVALUE13, delete,1);
                                        }
                                    }
                                    else
                                    {
                                        string delete = mlist[i].CODE_NAME + "缺陷报告";
                                        word.InsertFile(http + mlist[i].SVALUE13, delete,0);
                                    }
                                }
                            }

                        }

                    }
                }
            }

            catch (Exception ex)
            {
                log4net.ILog log = log4net.LogManager.GetLogger("插入文档");
                log.Error("执行出错", ex);
            }

            //filename生成路径名：网站目录\TempReport\WordModel+当前时间.doc
            string name = "动车组车载接触网运行状态检测装置（3C）" + orgname + "疑似缺陷周报（" + alarmCond.startTime.ToString("yyyy.MM.dd") + "-" + alarmCond.endTime.ToString("yyyy.MM.dd") + "）.doc";
            string filename =  System.Web.HttpContext.Current.Server.MapPath(@"~/TempReport/")+name;
            word.SaveAs(file,filename);
            word.Update(filename);

            //删除生成的子文件
            word.Delete(System.Web.HttpContext.Current.Server.MapPath(@"~/TempReport/1AlarmBureau"+orgname+time+".doc"));
            word.Delete(System.Web.HttpContext.Current.Server.MapPath(@"~/TempReport/2AlarmBureau"+orgname+time+".doc"));
            word.Delete(System.Web.HttpContext.Current.Server.MapPath(@"~/TempReport/3AlarmBureau"+orgname+time+".doc"));
            word.Delete(System.Web.HttpContext.Current.Server.MapPath(@"~/TempReport/4AlarmBureau"+orgname+time+".doc"));

            return "/TempReport/"+ name;
        }
        else
        {
            return null;
        }
    }

    private void  export(string time,string orgname,string orgcode, ref string text_type_in,ref string text_type_out,ref string text_line_in, ref string text_line_out, ref StringBuilder text_locodate, ref int dective_count)
    {

        string startDate = HttpContext.Current.Request["startDate"];
        string endDate = HttpContext.Current.Request["endDate"];
        string ju = orgcode;//局
        string juname = orgname;//局名称 
        if (string.IsNullOrEmpty(ju))
        {
            ju = "";
        }
        else if (ju == "0")
        {
            ju = "$";
        }
        string title = "线路缺陷分布图";
        if(juname == "乌鲁木齐铁路局")
        {
            title = "重复缺陷分布图";
        }

        ADO.AlarmBureauDal aa = new ADO.AlarmBureauDal();
        int totalcount_type_in = 0;
        int totalcount_type_out = 0;
        int totalcount_chart_type_in = 0;
        int totalcount_chart_type_out = 0;
        int totalcount_line_line_in = 0;
        int totalcount_line_line_out = 0;
        string loco_in = "";
        string loco_out = "";
        string line_in = "";
        string line_in_count = "";
        string line_out = "";
        int line_out_count = 0;


        DataTable ds_type_in = new DataTable();
        DataTable ds_type_out = new DataTable();
        DataTable ds_line_in = new DataTable();
        DataTable ds_line_out = new DataTable();
        DataTable ds_chart_type_in = new DataTable();
        DataTable ds_chart_type_out = new DataTable();
        DataTable ds_chart_line_in = new DataTable();
        DataTable ds_chart_line_out = new DataTable();
        string p_org_code = GetP_Org_Code(ju);

        ds_type_in = aa.GetType_in(Getstrwhere(), ju, p_org_code, ref totalcount_type_in, ref loco_in);
        ds_type_out = aa.GetType_out(Getstrwhere(), ju, p_org_code, ref totalcount_type_out, ref loco_out);
        ds_line_in = aa.GetLine_in(Getstrwhere(), ju, p_org_code, ref line_in, ref line_in_count);
        ds_line_out = aa.GetLine_out(Getstrwhere(), ju, p_org_code, ref line_out, ref line_out_count);

        ds_chart_type_in = aa.GetChar_type_in(Getstrwhere(), ju, p_org_code, ref totalcount_chart_type_in);
        ds_chart_type_out = aa.GetChar_type_out(Getstrwhere(), ju, p_org_code, ref totalcount_chart_type_out);
        ds_chart_line_in = aa.GetChar_line_in(Getstrwhere(), ju, p_org_code, ref totalcount_line_line_in);
        ds_chart_line_out = aa.GetChar_line_out(Getstrwhere(), ju, p_org_code, ref totalcount_line_line_out);

        string date = Gettextdate(startDate, endDate);
        text_type_in = string.Format(@"{0}动车 {1}在{2}，共检测出{3}条缺陷报警。其中典型缺陷{4}条，统计结果见下表：",juname,loco_in, date, totalcount_type_in,totalcount_chart_type_in);

        text_type_out = string.Format(@"{0}，{1}。共发现了疑似缺陷{2}条；其中典型缺陷{3}条，线路缺陷统计及典型缺陷统计情况如下图表所示：", date, loco_out,totalcount_type_out,totalcount_chart_type_out);

        text_line_in = string.Format(@"{0}在{1}运行线路为 {2}；在管辖范围内检测疑似缺陷情况：{3}。线路缺陷分布情况如下图表所示：",juname, date, line_in,line_in_count);

        text_line_out = string.Format(@"{0}，{1}。共发现了疑似缺陷{2}条。线路缺陷分布情况如下图表所示：", date, line_out, line_out_count);


        string locomative = null;
        List<KmMarkCount> list = new List<KmMarkCount>();
        list = my_sms.GetListKmCount(ju, locomative, startDate, endDate);
        if (list != null)
        {
            dective_count = list.Count;
            if (dective_count > 0)
            {
                int i = 1;
                foreach (KmMarkCount m in list)
                {
                    string text = string.Format("   （{0}）{1}在线运行{2}天，运行里程数约{3}公里；", i, m.locoCode, m.runDays, m.totalDis / 1000);
                    text_locodate.AppendLine(text);
                    i++;
                }
            }
        }
        string start = DateTime.Parse(startDate).ToString("yyyyMMdd");
        string end = DateTime.Parse(endDate).ToString("yyyyMMdd");

        using (Microsoft.Reporting.WebForms.LocalReport lr = new Microsoft.Reporting.WebForms.LocalReport())
        {
            lr.ReportPath =  System.Web.HttpContext.Current.Server.MapPath(@"~/Report/rdlc/AlarmBureau1.rdlc");
            lr.DataSources.Clear();
            //ReportParameter TYPE_IN = new ReportParameter("TYPE_IN", text_type_in);
            //ReportParameter TYPE_OUT = new ReportParameter("TYPE_OUT", text_type_out);
            //ReportParameter LINE_IN = new ReportParameter("LINE_IN", text_line_in);
            //ReportParameter LINE_OUT = new ReportParameter("LINE_OUT", text_line_out);
            //ReportParameter LOCODATE = new ReportParameter("LOCODATE", text_locodate.ToString());
            //lr.SetParameters(new ReportParameter[] { TYPE_IN, LINE_IN, LOCODATE });
            ReportDataSource rds1 = new ReportDataSource("chart_type_in", ds_chart_type_in);
            lr.DataSources.Add(rds1);
            // ReportDataSource rds2 = new ReportDataSource("chart_type_out", ds_chart_type_out);
            // lr.DataSources.Add(rds2);
            //ReportDataSource rds3 = new ReportDataSource("chart_line_in", ds_chart_line_in);
            //lr.DataSources.Add(rds3);
            // ReportDataSource rds4 = new ReportDataSource("chart_line_out", ds_chart_line_out);
            // lr.DataSources.Add(rds4);
            lr.Refresh();

            Microsoft.Reporting.WebForms.Warning[] Warnings;
            string deviceInfo = "<DeviceInfo>" + "<SimplePageHeaders>True</SimplePageHeaders>" + "</DeviceInfo>";
            string format = "Word";


            byte[] bytes = lr.Render(format, deviceInfo);

            using (FileStream fs = new FileStream(System.Web.HttpContext.Current.Server.MapPath(@"~/TempReport/1AlarmBureau"+orgname+time+".doc"), FileMode.Create))
            {
                fs.Write(bytes, 0, bytes.Length);

                fs.Dispose();
            }
            bytes = null;

            lr.DataSources.Clear();
            lr.Dispose();

        }

        using (Microsoft.Reporting.WebForms.LocalReport lr2 = new Microsoft.Reporting.WebForms.LocalReport())
        {
            lr2.ReportPath = System.Web.HttpContext.Current.Server.MapPath(@"~/Report/rdlc/AlarmBureau2.rdlc");
            lr2.DataSources.Clear();
            //  ReportParameter TYPE_IN = new ReportParameter("TYPE_IN", text_type_in);
            //  ReportParameter TYPE_OUT = new ReportParameter("TYPE_OUT", text_type_out);
            ReportParameter LINE_IN = new ReportParameter("LINE_IN", title);
            //  ReportParameter LINE_OUT = new ReportParameter("LINE_OUT", text_line_out);
            //  ReportParameter LOCODATE = new ReportParameter("LOCODATE", text_locodate.ToString());
            lr2.SetParameters(new ReportParameter[] { LINE_IN });
            //  ReportDataSource rds1 = new ReportDataSource("chart_type_in", ds_chart_type_in);
            //  lr2.DataSources.Add(rds1);
            //  ReportDataSource rds2 = new ReportDataSource("chart_type_out", ds_chart_type_out);
            //  lr2.DataSources.Add(rds2);
            ReportDataSource rds3 = new ReportDataSource("chart_line_in", ds_chart_line_in);
            lr2.DataSources.Add(rds3);
            //  ReportDataSource rds4 = new ReportDataSource("chart_line_out", ds_chart_line_out);
            //  lr2.DataSources.Add(rds4);
            lr2.Refresh();

            Microsoft.Reporting.WebForms.Warning[] Warnings;
            string deviceInfo = "<DeviceInfo>" + "<SimplePageHeaders>True</SimplePageHeaders>" + "</DeviceInfo>";
            string format = "Word";


            byte[] bytes = lr2.Render(format, deviceInfo);

            using (FileStream fs = new FileStream(System.Web.HttpContext.Current.Server.MapPath(@"~/TempReport/2AlarmBureau" + orgname + time + ".doc"), FileMode.Create))
            {
                fs.Write(bytes, 0, bytes.Length);

                fs.Dispose();
            }
            bytes = null;
            lr2.DataSources.Clear();
            lr2.Dispose();

        }

        using (Microsoft.Reporting.WebForms.LocalReport lr3 = new Microsoft.Reporting.WebForms.LocalReport())
        {
            lr3.ReportPath = System.Web.HttpContext.Current.Server.MapPath(@"~/Report/rdlc/AlarmBureau3.rdlc");
            lr3.DataSources.Clear();
            //  ReportParameter TYPE_IN = new ReportParameter("TYPE_IN", text_type_in);
            //  ReportParameter TYPE_OUT = new ReportParameter("TYPE_OUT", text_type_out);
            //  ReportParameter LINE_IN = new ReportParameter("LINE_IN", text_line_in);
            //  ReportParameter LINE_OUT = new ReportParameter("LINE_OUT", text_line_out);
            //  ReportParameter LOCODATE = new ReportParameter("LOCODATE", text_locodate.ToString());
            //  lr3.SetParameters(new ReportParameter[] { TYPE_OUT, LINE_OUT });
            //  ReportDataSource rds1 = new ReportDataSource("chart_type_in", ds_chart_type_in);
            //  lr2.DataSources.Add(rds1);
            ReportDataSource rds2 = new ReportDataSource("chart_type_out", ds_chart_type_out);
            lr3.DataSources.Add(rds2);
            //  ReportDataSource rds3 = new ReportDataSource("chart_line_in", ds_chart_line_in);
            //  lr2.DataSources.Add(rds3);
            //  ReportDataSource rds4 = new ReportDataSource("chart_line_out", ds_chart_line_out);
            //  lr3.DataSources.Add(rds4);
            lr3.Refresh();

            Microsoft.Reporting.WebForms.Warning[] Warnings;
            string deviceInfo = "<DeviceInfo>" + "<SimplePageHeaders>True</SimplePageHeaders>" + "</DeviceInfo>";
            string format = "Word";


            byte[] bytes = lr3.Render(format, deviceInfo);

            using (FileStream fs = new FileStream(System.Web.HttpContext.Current.Server.MapPath(@"~/TempReport/3AlarmBureau" + orgname + time + ".doc"), FileMode.Create))
            {
                fs.Write(bytes, 0, bytes.Length);

                fs.Dispose();
            }
            bytes = null;
            lr3.DataSources.Clear();
            lr3.Dispose();

        }

        using (Microsoft.Reporting.WebForms.LocalReport lr4 = new Microsoft.Reporting.WebForms.LocalReport())
        {
            lr4.ReportPath = System.Web.HttpContext.Current.Server.MapPath(@"~/Report/rdlc/AlarmBureau4.rdlc");
            lr4.DataSources.Clear();
            //  ReportParameter TYPE_IN = new ReportParameter("TYPE_IN", text_type_in);
            //  ReportParameter TYPE_OUT = new ReportParameter("TYPE_OUT", text_type_out);
            //  ReportParameter LINE_IN = new ReportParameter("LINE_IN", text_line_in);
            ReportParameter LINE_OUT = new ReportParameter("LINE_OUT", title);
            //  ReportParameter LOCODATE = new ReportParameter("LOCODATE", text_locodate.ToString());
            lr4.SetParameters(new ReportParameter[] { LINE_OUT });
            //  ReportDataSource rds1 = new ReportDataSource("chart_type_in", ds_chart_type_in);
            //  lr2.DataSources.Add(rds1);
            //  ReportDataSource rds2 = new ReportDataSource("chart_type_out", ds_chart_type_out);
            //  lr4.DataSources.Add(rds2);
            //  ReportDataSource rds3 = new ReportDataSource("chart_line_in", ds_chart_line_in);
            //  lr4.DataSources.Add(rds3);
            ReportDataSource rds4 = new ReportDataSource("chart_line_out", ds_chart_line_out);
            lr4.DataSources.Add(rds4);
            lr4.Refresh();

            Microsoft.Reporting.WebForms.Warning[] Warnings;
            string deviceInfo = "<DeviceInfo>" + "<SimplePageHeaders>True</SimplePageHeaders>" + "</DeviceInfo>";
            string format = "Word";


            byte[] bytes = lr4.Render(format, deviceInfo);

            using (FileStream fs = new FileStream(System.Web.HttpContext.Current.Server.MapPath(@"~/TempReport/4AlarmBureau" + orgname + time + ".doc"), FileMode.Create))
            {
                fs.Write(bytes, 0, bytes.Length);

                fs.Dispose();
            }
            bytes = null;
            lr4.DataSources.Clear();
            lr4.Dispose();

        }

    }

    private string repeat(string id,DateTime start,DateTime end)
    {
        string filename = "";
        //动态生成一个温度曲线数据表
        tblChart = new DataTable("chart");
        DataColumn dc = new DataColumn("X", Type.GetType("System.String"));
        tblChart.Columns.Add(dc);
        dc = new DataColumn("Y", Type.GetType("System.Int32"));
        tblChart.Columns.Add(dc);
        dc = new DataColumn("ID", Type.GetType("System.String"));
        tblChart.Columns.Add(dc);
        //动态生成一个 展示五条温度曲线
        tblChartB = new DataTable("AlarmRepeatChart");
        dc = new DataColumn("X", Type.GetType("System.String"));
        tblChartB.Columns.Add(dc);
        dc = new DataColumn("A", Type.GetType("System.Int32"));
        tblChartB.Columns.Add(dc);
        dc = new DataColumn("B", Type.GetType("System.Int32"));
        tblChartB.Columns.Add(dc);
        dc = new DataColumn("C", Type.GetType("System.Int32"));
        tblChartB.Columns.Add(dc);
        dc = new DataColumn("D", Type.GetType("System.Int32"));
        tblChartB.Columns.Add(dc);
        dc = new DataColumn("E", Type.GetType("System.Int32"));
        tblChartB.Columns.Add(dc);


        //动态生成一个拉出值曲线数据表
        tblChartE = new DataTable("AlarmRepeatChartE");
        dc = new DataColumn("X", Type.GetType("System.String"));
        tblChartE.Columns.Add(dc);
        dc = new DataColumn("Y", Type.GetType("System.Int32"));
        tblChartE.Columns.Add(dc);
        dc = new DataColumn("ID", Type.GetType("System.String"));
        tblChartE.Columns.Add(dc);
        //动态生成一个 展示五条拉出值曲线
        tblChartF = new DataTable("AlarmRepeatChartF");
        dc = new DataColumn("X", Type.GetType("System.String"));
        tblChartF.Columns.Add(dc);
        dc = new DataColumn("A", Type.GetType("System.Int32"));
        tblChartF.Columns.Add(dc);
        dc = new DataColumn("B", Type.GetType("System.Int32"));
        tblChartF.Columns.Add(dc);
        dc = new DataColumn("C", Type.GetType("System.Int32"));
        tblChartF.Columns.Add(dc);
        dc = new DataColumn("D", Type.GetType("System.Int32"));
        tblChartF.Columns.Add(dc);
        dc = new DataColumn("E", Type.GetType("System.Int32"));
        tblChartF.Columns.Add(dc);

        //速度与拉出值关系图
        tblChartC = new DataTable("AlarmRepeatChartC");
        dc = new DataColumn("ID", Type.GetType("System.String"));
        tblChartC.Columns.Add(dc);
        dc = new DataColumn("X", Type.GetType("System.String"));
        tblChartC.Columns.Add(dc);
        dc = new DataColumn("Y", Type.GetType("System.Int32"));
        tblChartC.Columns.Add(dc);

        //速度与导高值关系图
        tblChartD = new DataTable("AlarmRepeatChartD");
        dc = new DataColumn("ID", Type.GetType("System.String"));
        tblChartD.Columns.Add(dc);
        dc = new DataColumn("X", Type.GetType("System.String"));
        tblChartD.Columns.Add(dc);
        dc = new DataColumn("Y", Type.GetType("System.Int32"));
        tblChartD.Columns.Add(dc);

        using (Microsoft.Reporting.WebForms.LocalReport lr3 = new Microsoft.Reporting.WebForms.LocalReport())
        {
            lr3.ReportPath =  System.Web.HttpContext.Current.Server.MapPath(@"~/Report/rdlc/AlarmRepeatWeek_.rdlc");
            //定义子报表处理方法
            lr3.SubreportProcessing += new SubreportProcessingEventHandler(LocalReport_SubreportProcessing);

            lr3.EnableExternalImages = true;

            ds = new DataSet();
            ds.Tables.Clear();
            loadIndex = 0;
            C3_AlarmCond cond = new C3_AlarmCond();
            //cond.businssAnd = string.Format(" id in ({0}) ", id);
            //cond.businssAnd = string.Format(" id in ('{0}') or svalue15 in ('{0}') ", id);//导出周报功能时使用
            cond = my_alarm.GetC3_AlermCond_AlarmList(); //生成告警条件实体
            cond.businssAnd = string.Format(" device_id in ('{0}')",id);
            cond.orderBy = " RAISED_TIME DESC ";
            IList<C3_Alarm> c3List = Api.ServiceAccessor.GetAlarmService().getC3Alarm(cond);
            if (c3List.Count > 0)
            {
                DataTable dt = getDataTable(c3List, start, end);
                tblDetail = getDetailDataTable(c3List);
                tblChartB = getChartTable(c3List);
                tblChartC = getChartCTable(c3List);
                tblChartD = getChartDTable(c3List);
                tblChartF = getChartFTable(c3List);
                ReportDataSource rds = new ReportDataSource("AlarmRepeat", dt);
                lr3.DataSources.Clear();
                lr3.DataSources.Add(rds);
                rds = new ReportDataSource("AlarmRepeat1", tblDetail);
                lr3.DataSources.Add(rds);
                lr3.Refresh();

                Microsoft.Reporting.WebForms.Warning[] Warnings;
                string deviceInfo = "<DeviceInfo>" + "<SimplePageHeaders>True</SimplePageHeaders>" + "</DeviceInfo>";
                string format = "Word";


                byte[] bytes = lr3.Render(format, deviceInfo);

                using (FileStream fs = new FileStream(System.Web.HttpContext.Current.Server.MapPath(@"~/TempReport/Repeat_" + id + ".doc"), FileMode.Create))
                {
                    fs.Write(bytes, 0, bytes.Length);

                    fs.Dispose();
                }
                bytes = null;

                filename = System.Web.HttpContext.Current.Server.MapPath(@"~/TempReport/Repeat_" + id + ".doc");
                //删除压缩的图片
                foreach (C3_Alarm c3Alarm in c3List)
                {
                    my_img.DeleteFolder(System.Web.HttpContext.Current.Server.MapPath(@"~/TempImage/"), c3Alarm.ID);
                }
                lr3.Dispose();
                GC.Collect();
                lr3.ReleaseSandboxAppDomain();
                lr3.ExecuteReportInSandboxAppDomain();
            }
        }
        return filename;
    }

    private string Getstrwhere()
    {
        string startDate = HttpContext.Current.Request["startDate"];
        string endDate = HttpContext.Current.Request["endDate"];
        string strwhere = "";
        if (startDate != "" && startDate != "undefined")
            strwhere += " and a.raised_time>= to_date('" + startDate + " ', 'yyyy-MM-dd hh24:mi:ss')";
        if (endDate != "" && endDate != "undefined")
            strwhere += " and a.raised_time<= to_date('" + endDate + " ', 'yyyy-MM-dd hh24:mi:ss')";
        return strwhere;
    }

    private string Gettextdate(string startdate,string enddate)
    {
        string text_date = "";
        DateTime start = DateTime.Parse(startdate);
        DateTime end = DateTime.Parse(enddate);
        string datediff = DateDiff(start, end);
        string s = start.Year.ToString() + "年" + start.Month.ToString() + "月" + start.Day.ToString() + "日";
        string e = end.Year.ToString() + "年" + end.Month.ToString() + "月" + end.Day.ToString() + "日";
        switch (datediff)
        {
            case ("6天23小时59分钟59秒"):
                text_date = "本周";
                break;
            case ("27天23小时59分钟59秒"):
                text_date = "本月";
                break;
            case ("29天23小时59分钟59秒"):
                text_date = "本月";
                break;
            case ("30天23小时59分钟59秒"):
                text_date = "本月";
                break;
            default:
                text_date = s+"到"+e;
                break;

        }
        return text_date;
    }

    private string DateDiff(DateTime DateTime1, DateTime DateTime2)

    {

        string dateDiff = null;

        try

        {

            TimeSpan ts1 = new TimeSpan(DateTime1.Ticks);

            TimeSpan ts2 = new TimeSpan(DateTime2.Ticks);

            TimeSpan ts = ts1.Subtract(ts2).Duration();

            dateDiff = ts.Days.ToString() + "天"

                    + ts.Hours.ToString() + "小时"

                    + ts.Minutes.ToString() + "分钟"

                    + ts.Seconds.ToString() + "秒";

        }

        catch

        {
        }

        return dateDiff;

    }

    /// <summary>
    /// 将虚拟路径转换为实体路径
    /// </summary>
    /// <param name="str"></param>
    /// <returns></returns>
    public string Convert_PHYSICAL_Url(string str)
    {
        Virtual_Dir_Info vp = GetDir();
        string vir = "/" + vp.VIRTUAL_DIR_NAME+ "\\" ;
        string url = str.Replace(vir, vp.PHYSICAL_DIR_PATH);
        return url;
    }

    /// <summary>
    /// 将实体路径转换为虚拟路径
    /// </summary>
    /// <param name="str"></param>
    /// <returns></returns>
    public string Convert_VIRTUAL_Url(string str)
    {
        Virtual_Dir_Info vp = GetDir();
        string vir = "/" + vp.VIRTUAL_DIR_NAME+ "\\" ;
        string url = string.Format("{0}",str.Replace(vp.PHYSICAL_DIR_PATH, vir));
        return url;
    }

    public static Virtual_Dir_Info GetDir()
    {
        //获得生成报表对应的服务器 虚拟目录和 实体目录地址

        Virtual_Dir_Info vp = ADO.IVirtual_dir_infoImpl.getVirtualAndPhysical("1");

        return vp;
    }

    private DataTable getDataTable(IList<C3_Alarm> c3List,DateTime start,DateTime end)
    {
        //DataTable chartDt = tblChart.Clone();
        int rn = 0;
        string gps = "";

        foreach (C3_Alarm c3Alarm in c3List)
        {
            gps += string.Format("|{0},{1}", c3Alarm.GIS_X, c3Alarm.GIS_Y);

            //添加缺陷帧
            DataRow row = tblChart.NewRow();
            try
            {
                row["ID"] = c3Alarm.ID;
                //报警量超过10条，显示编号，不超过10条是X轴展示报警时间
                if (c3List.Count >= 10)
                    row["X"] = ++rn;
                else
                    row["X"] = c3Alarm.RAISED_TIME;
                row["Y"] = c3Alarm.NVALUE4 / 100;
            }
            catch (Exception)
            {
                row["Y"] = 0;
            }
            tblChart.Rows.Add(row);
        }

        rn = 0;
        foreach (C3_Alarm c3Alarm in c3List)
        {
            gps += string.Format("|{0},{1}", c3Alarm.GIS_X, c3Alarm.GIS_Y);

            //添加缺陷帧
            DataRow row = tblChartE.NewRow();
            try
            {
                row["ID"] = c3Alarm.ID;
                //报警量超过10条，显示编号，不超过10条是X轴展示报警时间
                if (c3List.Count >= 10)
                    row["X"] = ++rn;
                else
                    row["X"] = c3Alarm.RAISED_TIME;
                row["Y"] = c3Alarm.NVALUE3 ;
            }
            catch (Exception)
            {
                row["Y"] = 0;
            }
            tblChartE.Rows.Add(row);
        }
        if (gps.Length > 0)
            gps = gps.Substring(1);
        string map_layer = Api.ServiceAccessor.GetParamterService().getParamterByKey("MapLayer");
        map_layer = string.IsNullOrEmpty(map_layer) ? "" : map_layer;
        string gis_url = string.Format("http://api.map.baidu.com/staticimage?width=400&height=200&center=&markers={0}&zoom={1}&markerStyles=s,A,0xff0000", gps, map_layer);
        DataTable dt = new DataTable();
        DataColumn dc0 = new DataColumn("Org_Name", Type.GetType("System.String"));
        DataColumn dc1 = new DataColumn("WZ1", Type.GetType("System.String"));
        DataColumn dc2 = new DataColumn("REPEAT_INFO", Type.GetType("System.String"));
        DataColumn dc3 = new DataColumn("ALARM_ANALYSIS", Type.GetType("System.String"));
        DataColumn dc4 = new DataColumn("PROPOSAL", Type.GetType("System.String"));
        DataColumn dc5 = new DataColumn("REPAIR_METHOD", Type.GetType("System.String"));
        DataColumn dc6 = new DataColumn("REPORT_PERSON", Type.GetType("System.String"));
        DataColumn dc7 = new DataColumn("REPORT_DATE", Type.GetType("System.String"));
        DataColumn dc8 = new DataColumn("GIS", Type.GetType("System.String"));
        DataColumn dc9 = new DataColumn("GIS_SHOW", Type.GetType("System.String"));
        DataColumn dc10 = new DataColumn("ALARM_COUNT", Type.GetType("System.Int32"));
        DataColumn dc11 = new DataColumn("DG_SHOW", Type.GetType("System.String"));
        DataColumn dc12 = new DataColumn("LC_SHOW", Type.GetType("System.String"));
        DataColumn dc13 = new DataColumn("WD_VAULE1", Type.GetType("System.String"));
        DataColumn dc14 = new DataColumn("WD_VAULE2", Type.GetType("System.String"));
        DataColumn dc15 = new DataColumn("LC_VAULE1", Type.GetType("System.String"));
        DataColumn dc16 = new DataColumn("LC_VAULE2", Type.GetType("System.String"));
        DataColumn dc17 = new DataColumn("Bureau", Type.GetType("System.String"));
        DataColumn dc18 = new DataColumn("Alarm_Name", Type.GetType("System.String"));

        dt.Columns.Add(dc0);
        dt.Columns.Add(dc1);
        dt.Columns.Add(dc2);
        dt.Columns.Add(dc3);
        dt.Columns.Add(dc4);
        dt.Columns.Add(dc5);
        dt.Columns.Add(dc6);
        dt.Columns.Add(dc7);
        dt.Columns.Add(dc8);
        dt.Columns.Add(dc9);
        dt.Columns.Add(dc10);
        dt.Columns.Add(dc11);
        dt.Columns.Add(dc12);
        dt.Columns.Add(dc13);
        dt.Columns.Add(dc14);
        dt.Columns.Add(dc15);
        dt.Columns.Add(dc16);
        dt.Columns.Add(dc17);
        dt.Columns.Add(dc18);

        DataRow dr = dt.NewRow();
        if (c3List.Count > 0)
        {
            C3_Alarm c3Alarm = c3List[0];
            dr["WZ1"] = getWZInfo(c3Alarm);
            dr["Org_Name"] =c3Alarm.BUREAU_NAME+" "+c3Alarm.ORG_NAME;
            dr["Bureau"] = c3Alarm.BUREAU_NAME;
            dr["Alarm_Name"] = c3Alarm.CODE_NAME;
            dr["REPEAT_INFO"] = "在"+start.ToString("yyyy-MM-dd HH:mm:ss")+"到"+end.ToString("yyyy-MM-dd HH:mm:ss")+"之间，检测出"+c3List.Count+"次疑似缺陷报警";
            dr["ALARM_ANALYSIS"] = c3Alarm.ALARM_ANALYSIS;
            dr["PROPOSAL"] = c3Alarm.PROPOSAL;
            dr["REPAIR_METHOD"] = c3Alarm.REPAIR_METHOD;
            dr["REPORT_PERSON"] = c3Alarm.REPORT_PERSON;
            dr["REPORT_DATE"] = c3Alarm.REPORT_DATE;
            dr["GIS"] = gis_url;
            dr["GIS_SHOW"] = c3Alarm.GIS_X != 0 ? "true" : "false";//是否展示GIS地图
            dr["ALARM_COUNT"] = c3List.Count;
            dr["DG_SHOW"] = "true";
            dr["LC_SHOW"] = "true";
            dr["WD_VAULE1"] = "false";
            dr["WD_VAULE2"] = "false";
            dr["LC_VAULE1"] = "false";
            dr["LC_VAULE2"] = "false";
            if (c3List[0].CODE != null && "AFCODEDGZ".IndexOf(c3List[0].CODE) > -1)
            {
                dr["DG_SHOW"] = "true";
            }
            else
            {
                dr["DG_SHOW"] = "false";
            }
            if (c3List[0].CODE != null && "AFCODELCZ".IndexOf(c3List[0].CODE) > -1)
            {
                dr["LC_SHOW"] = "true";
                if (c3List.Count > 5)
                {
                    dr["LC_VAULE1"] = "true";
                }
                else
                {
                    dr["LC_VAULE2"] = "true";
                }
            }
            else
            {
                dr["LC_SHOW"] = "false";
                if (c3List.Count > 5)
                {
                    dr["WD_VAULE1"] = "true";
                }
                else
                {
                    dr["WD_VAULE2"] = "true";
                }
            }
            dt.Rows.Add(dr);
        }
        return dt;
    }

    private DataTable getDetailDataTable(IList<C3_Alarm> c3List)
    {
        DataTable dt = new DataTable();
        DataColumn dc1 = new DataColumn("RN", Type.GetType("System.String"));
        DataColumn dc2 = new DataColumn("RAISED_TIME", Type.GetType("System.String"));
        DataColumn dc3 = new DataColumn("DETECT_DEVICE_CODE", Type.GetType("System.String"));
        DataColumn dc4 = new DataColumn("P_ORG_NAME", Type.GetType("System.String"));
        DataColumn dc5 = new DataColumn("WZ2", Type.GetType("System.String"));
        DataColumn dc6 = new DataColumn("SPEED", Type.GetType("System.String"));
        DataColumn dc7 = new DataColumn("GWZ", Type.GetType("System.String"));
        DataColumn dc8 = new DataColumn("QXWD", Type.GetType("System.String"));
        DataColumn dc9 = new DataColumn("HJWD", Type.GetType("System.String"));
        DataColumn dc10 = new DataColumn("DGZ", Type.GetType("System.String"));
        DataColumn dc11 = new DataColumn("LCZ", Type.GetType("System.String"));
        DataColumn dc12 = new DataColumn("TRAIN_NO", Type.GetType("System.String"));
        DataColumn dc13 = new DataColumn("IRV", Type.GetType("System.String"));
        DataColumn dc14 = new DataColumn("VI", Type.GetType("System.String"));
        DataColumn dc15 = new DataColumn("OV", Type.GetType("System.String"));
        DataColumn dc16 = new DataColumn("IRV_SHOW", Type.GetType("System.String"));
        DataColumn dc17 = new DataColumn("VI_SHOW", Type.GetType("System.String"));
        DataColumn dc18 = new DataColumn("OV_SHOW", Type.GetType("System.String"));
        DataColumn dc21 = new DataColumn("ORG_NAME", Type.GetType("System.String"));
        DataColumn dc22 = new DataColumn("SEVERITY", Type.GetType("System.String"));
        DataColumn dc23 = new DataColumn("ALARM_CODE", Type.GetType("System.String"));

        dt.Columns.Add(dc1);
        dt.Columns.Add(dc2);
        dt.Columns.Add(dc3);
        dt.Columns.Add(dc4);
        dt.Columns.Add(dc5);
        dt.Columns.Add(dc6);
        dt.Columns.Add(dc7);
        dt.Columns.Add(dc8);
        dt.Columns.Add(dc9);
        dt.Columns.Add(dc10);
        dt.Columns.Add(dc11);
        dt.Columns.Add(dc12);
        dt.Columns.Add(dc13);
        dt.Columns.Add(dc14);
        dt.Columns.Add(dc15);
        dt.Columns.Add(dc16);
        dt.Columns.Add(dc17);
        dt.Columns.Add(dc18);
        dt.Columns.Add(dc21);
        dt.Columns.Add(dc22);
        dt.Columns.Add(dc23);

        int rn = 0;
        foreach (C3_Alarm c3Alarm in c3List)
        {
            DataRow dr = dt.NewRow();
            dr["RN"] = ++rn;
            dr["RAISED_TIME"] = c3Alarm.RAISED_TIME.ToString("yyyy/MM/dd HH:mm:ss");
            dr["DETECT_DEVICE_CODE"] = c3Alarm.DETECT_DEVICE_CODE;
            dr["P_ORG_NAME"] = c3Alarm.P_ORG_NAME;//是否展示GIS地图
            dr["ORG_NAME"] = c3Alarm.ORG_NAME;
            dr["WZ2"] = getWZInfo(c3Alarm);
            dr["SPEED"] = Convert_ling(myfiter.GetSpeed(c3Alarm.NVALUE1));
            dr["GWZ"] = c3Alarm.SVALUE8;
            dr["QXWD"] = Convert_ling(myfiter.GetTEMP_MAX(c3Alarm));
            dr["HJWD"] = Convert_ling(myfiter.GetTEMP_ENV(c3Alarm));
            dr["DGZ"] = myfiter.GetLINE_HEIGHT(c3Alarm.NVALUE2);
            dr["LCZ"] = Convert_ling(myfiter.GetPULLING_VALUE(c3Alarm.NVALUE3));
            dr["TRAIN_NO"] = c3Alarm.TRAIN_NO == "0" ? "" : c3Alarm.TRAIN_NO;
            dr["SEVERITY"] = c3Alarm.SEVERITY;
            dr["ALARM_CODE"] = c3Alarm.CODE_NAME;
            string dir = PublicMethod.GetFullDir(c3Alarm);

            string irv = /*"http://192.168.1.249:10022/"*/"http://" + HttpContext.Current.Request.Url.Host + ":" + HttpContext.Current.Request.Url.Port  +dir + c3Alarm.SNAPPED_IMA.Replace(".IMA", "_IRV.jpg");
            dr["IRV_SHOW"] = string.IsNullOrEmpty(c3Alarm.SNAPPED_IMA) ? "true" : "false";
            string jpg = /*"http://192.168.1.249:10022/"*/"http://" + HttpContext.Current.Request.Url.Host + ":" + HttpContext.Current.Request.Url.Port + dir + c3Alarm.SNAPPED_JPG;
            dr["VI_SHOW"] = string.IsNullOrEmpty(c3Alarm.SNAPPED_JPG) ? "true" : "false";
            string ov = /*"http://192.168.1.249:10022/"*/"http://" + HttpContext.Current.Request.Url.Host + ":" + HttpContext.Current.Request.Url.Port + dir + Convert_Url(c3Alarm.SVALUE9);
            dr["OV_SHOW"] = string.IsNullOrEmpty(c3Alarm.SVALUE9) ? "true" : "false";

            dr["IRV"] = irv;
            dr["VI"] =my_img.compression(jpg, c3Alarm.ID + "jpg",true);
            dr["OV"] = my_img.compression(ov, c3Alarm.ID + "ov",true);

            dt.Rows.Add(dr);
        }
        return dt;
    }

    /// <summary>
    /// 获取温度值缺陷帧
    /// </summary>
    /// <param name="c3List"></param>
    /// <returns></returns>
    private DataTable getChartTable(IList<C3_Alarm> c3List)
    {
        if (c3List.Count > 0)
        {
            if (c3List[0].FRAME_INFO_LIST != null && c3List[0].FRAME_INFO_LIST != "")
            {
                Newtonsoft.Json.Linq.JArray jo1 = new Newtonsoft.Json.Linq.JArray(), jo2 = new Newtonsoft.Json.Linq.JArray(), jo3 = new Newtonsoft.Json.Linq.JArray(), jo4 = new Newtonsoft.Json.Linq.JArray(), jo5 = new Newtonsoft.Json.Linq.JArray();
                if (c3List.Count > 0)
                    jo1 = (Newtonsoft.Json.Linq.JArray)JsonConvert.DeserializeObject(c3List[0].FRAME_INFO_LIST);
                if (c3List.Count > 1)
                    jo2 = (Newtonsoft.Json.Linq.JArray)JsonConvert.DeserializeObject(c3List[1].FRAME_INFO_LIST);
                if (c3List.Count > 2)
                    jo3 = (Newtonsoft.Json.Linq.JArray)JsonConvert.DeserializeObject(c3List[2].FRAME_INFO_LIST);
                if (c3List.Count > 3)
                    jo4 = (Newtonsoft.Json.Linq.JArray)JsonConvert.DeserializeObject(c3List[3].FRAME_INFO_LIST);
                if (c3List.Count > 4)
                    jo5 = (Newtonsoft.Json.Linq.JArray)JsonConvert.DeserializeObject(c3List[4].FRAME_INFO_LIST);
                int i = 0;
                for (int j = 0; j < jo1.Count; j++)
                {
                    //添加缺陷帧
                    DataRow row = tblChartB.NewRow();
                    try
                    {
                        row["X"] = ++i + "帧";
                        if (c3List.Count > 0)
                        {
                            row["A"] = int.Parse(jo1[j]["TEMP_IRV"].ToString()) / 100;
                        }
                        if (c3List.Count > 1)
                        {
                            row["B"] = int.Parse(jo2[j]["TEMP_IRV"].ToString()) / 100;
                        }
                        if (c3List.Count > 2)
                        {
                            row["C"] = int.Parse(jo3[j]["TEMP_IRV"].ToString()) / 100;
                        }
                        if (c3List.Count > 3)
                        {
                            row["D"] = int.Parse(jo4[j]["TEMP_IRV"].ToString()) / 100;
                        }
                        if (c3List.Count > 4)
                        {
                            row["E"] = int.Parse(jo5[j]["TEMP_IRV"].ToString()) / 100;
                        }
                    }
                    catch (Exception)
                    {
                        row["A"] = 0;
                        row["B"] = 0;
                        row["C"] = 0;
                        row["D"] = 0;
                        row["E"] = 0;
                    }
                    tblChartB.Rows.Add(row);
                }
            }
            return tblChartB;
        }
        else
        {
            return null;
        }
    }

    /// <summary>
    /// 获取拉出值缺陷帧
    /// </summary>
    /// <param name="c3List"></param>
    /// <returns></returns>
    private DataTable getChartFTable(IList<C3_Alarm> c3List)
    {
        if (c3List.Count > 0)
        {
            if (c3List[0].FRAME_INFO_LIST != null && c3List[0].FRAME_INFO_LIST != "")
            {
                Newtonsoft.Json.Linq.JArray jo1 = new Newtonsoft.Json.Linq.JArray(), jo2 = new Newtonsoft.Json.Linq.JArray(), jo3 = new Newtonsoft.Json.Linq.JArray(), jo4 = new Newtonsoft.Json.Linq.JArray(), jo5 = new Newtonsoft.Json.Linq.JArray();
                if (c3List.Count > 0)
                    jo1 = (Newtonsoft.Json.Linq.JArray)JsonConvert.DeserializeObject(c3List[0].FRAME_INFO_LIST);
                if (c3List.Count > 1)
                    jo2 = (Newtonsoft.Json.Linq.JArray)JsonConvert.DeserializeObject(c3List[1].FRAME_INFO_LIST);
                if (c3List.Count > 2)
                    jo3 = (Newtonsoft.Json.Linq.JArray)JsonConvert.DeserializeObject(c3List[2].FRAME_INFO_LIST);
                if (c3List.Count > 3)
                    jo4 = (Newtonsoft.Json.Linq.JArray)JsonConvert.DeserializeObject(c3List[3].FRAME_INFO_LIST);
                if (c3List.Count > 4)
                    jo5 = (Newtonsoft.Json.Linq.JArray)JsonConvert.DeserializeObject(c3List[4].FRAME_INFO_LIST);
                int i = 0;
                for (int j = 0; j < jo1.Count; j++)
                {
                    //添加缺陷帧
                    DataRow row = tblChartF.NewRow();
                    try
                    {
                        row["X"] = ++i + "帧";
                        if (c3List.Count > 0)
                        {
                            row["A"] = int.Parse(jo1[j]["PULLING_VALUE"].ToString());
                        }
                        if (c3List.Count > 1)
                        {
                            row["B"] = int.Parse(jo2[j]["PULLING_VALUE"].ToString());
                        }
                        if (c3List.Count > 2)
                        {
                            row["C"] = int.Parse(jo3[j]["PULLING_VALUE"].ToString());
                        }
                        if (c3List.Count > 3)
                        {
                            row["D"] = int.Parse(jo4[j]["PULLING_VALUE"].ToString());
                        }
                        if (c3List.Count > 4)
                        {
                            row["E"] = int.Parse(jo5[j]["PULLING_VALUE"].ToString());
                        }
                    }
                    catch (Exception)
                    {
                        row["A"] = 0;
                        row["B"] = 0;
                        row["C"] = 0;
                        row["D"] = 0;
                        row["E"] = 0;
                    }
                    tblChartF.Rows.Add(row);
                }
            }
            return tblChartF;
        }
        else
        {
            return null;
        }
    }

    private DataTable getChartCTable(IList<C3_Alarm> c3List)
    {

        foreach (C3_Alarm item in c3List)
        {
            DataRow row = tblChartC.NewRow();
            try
            {
                row["ID"] = item.ID;
                row["X"] = item.SPEED;
                row["Y"] = item.PULLING_VALUE;
            }
            catch (Exception)
            {
                continue;
            }
            tblChartC.Rows.Add(row);
        }
        return tblChartC;


    }

    private DataTable getChartDTable(IList<C3_Alarm> c3List)
    {
        foreach (C3_Alarm item in c3List)
        {
            DataRow row = tblChartD.NewRow();
            try
            {
                row["ID"] = item.ID;
                row["X"] = item.SPEED;
                row["Y"] = item.LINE_HEIGHT;
            }
            catch (Exception)
            {
                continue;
            }
            tblChartD.Rows.Add(row);
        }
        return tblChartD;
    }

    private string getWZInfo(C3_Alarm c3Alarm)
    {
        string wz = "";
        if (c3Alarm.DETECT_DEVICE_CODE.IndexOf("CRH") > -1)
        {
            if (c3Alarm.LINE_CODE != null)
            {
                wz = c3Alarm.LINE_NAME + " " + c3Alarm.POSITION_NAME + " " + c3Alarm.DIRECTION + " " + PublicMethod.KmtoString(c3Alarm.KM_MARK) + " " + (!string.IsNullOrEmpty(c3Alarm.POLE_NUMBER) ? c3Alarm.POLE_NUMBER + "支柱" : "");
            }
            else
            {
                wz = "东经" + c3Alarm.GIS_X_O + " 北纬" + c3Alarm.GIS_Y_O;
            }
        }
        else
        {
            if (!string.IsNullOrEmpty(c3Alarm.LINE_NAME))
            {
                wz = c3Alarm.LINE_NAME + " " + c3Alarm.POSITION_NAME + " " + c3Alarm.DIRECTION + " " + PublicMethod.KmtoString(c3Alarm.KM_MARK) + " " + (!string.IsNullOrEmpty(c3Alarm.POLE_NUMBER) ? c3Alarm.POLE_NUMBER + "支柱" : "");
            }
            else if (c3Alarm.LINE_NAME == null && c3Alarm.ROUTING_NO != "-1" && c3Alarm.ROUTING_NO != "0" && c3Alarm.STATION_NO != "0")
            {
                wz = c3Alarm.ROUTING_NO + "号交路  运用区段: " + c3Alarm.AREA_NO + " " + c3Alarm.STATION_NO + "号站点" + (string.IsNullOrEmpty(c3Alarm.STATION_NAME) ? "" : ("(" + c3Alarm.STATION_NAME + ")"));
            }
            else
            {
                wz = "东经" + c3Alarm.GIS_X_O + " 北纬" + c3Alarm.GIS_Y_O;
            }
        }
        return wz;
    }

    void LocalReport_SubreportProcessing(object sender, SubreportProcessingEventArgs e)
    {
        // e.DataSources.Add(new ReportDataSource("AlarmRepeatSub", tblDetail));
        e.DataSources.Add(new ReportDataSource("AlarmRepeatChart", tblChart));
        e.DataSources.Add(new ReportDataSource("AlarmRepeatChartB", tblChartB));
        e.DataSources.Add(new ReportDataSource("AlarmRepeatChartC", tblChartC));
        e.DataSources.Add(new ReportDataSource("AlarmRepeatChartD", tblChartD));
        e.DataSources.Add(new ReportDataSource("AlarmRepeatChartE", tblChartE));
        e.DataSources.Add(new ReportDataSource("AlarmRepeatChartF", tblChartF));
        //if (loadIndex < ds.Tables.Count)
        //{
        //    e.DataSources.Add(new ReportDataSource("chart", ds.Tables[loadIndex++]));
        //}
    }

    /// <summary>
    /// 获取组织机构对应的局编码(动车)
    /// </summary>
    /// <param name="orgcode"></param>
    /// <returns></returns>
    public string GetP_Org_Code(string orgcode)
    {
        string str = orgcode;
        try
        {
            if (orgcode == "TOPBOSS" || orgcode == "$" || string.IsNullOrEmpty(orgcode))
            {

            }
            else if (orgcode.Contains("GDD"))
            {
                string[] ss = orgcode.Split('$');
                str = ss[0] + "$" + ss[1] + "$" + ss[2];
            }
        }
        catch (Exception ex)
        {
            log4net.ILog log = log4net.LogManager.GetLogger("获取组织机构对应的局编码");
            log.Error("执行出错", ex);
        }
        return str;
    }

    public string Convert_Url(string re)
    {
        if (re == null)
        {
            return null;
        }
        else
        {
            return re.Replace("#", "%23");
        }
    }

    public string Convert_ling(string re)
    {
        string m = "";
        if(re == "0")
        {
            m = "O";
        }
        else
        {
            m = re;
        }
        return m;
    }

    public bool IsReusable {
        get {
            return false;
        }
    }

}