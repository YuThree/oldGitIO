<%@ WebHandler Language="C#" Class="downloadReportCombine" %>

using System;
using System.Web;
using Api.Fault.entity.alarm;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using Api.ADO.entity;
using System.IO;

public class downloadReportCombine :ReferenceClass,IHttpHandler {

    public void ProcessRequest (HttpContext context) {
        try
        {
            download(context);
        }
        catch (Exception ex)
        {

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
        // C3_AlarmCond alarmCond = my_alarm.GetC3_AlermCond_AlarmList(); //生成告警条件实体
        C3_AlarmCond alarmCond= my_alarm.GetC3_AlermCond_AlarmList();
        alarmCond.orderBy = null;
        //alarmCond.LINE_CODE = null;
        //alarmCond.startRowNum = 0;
        //alarmCond.endRowNum = 70;//最多合并70个文档
        List<Alarm> mlist = Api.ServiceAccessor.GetAlarmService().getC3AlarmReport(alarmCond);
        Api.Util.WordAspose word = new Api.Util.WordAspose();
        Virtual_Dir_Info vp = GetDir();
        if (mlist.Count > 0)
        {
            if (!Directory.Exists(System.Web.HttpContext.Current.Server.MapPath(@"~/TempReport/")))
            {
                DirectoryInfo directoryInfo = new DirectoryInfo(System.Web.HttpContext.Current.Server.MapPath(@"~/TempReport/"));
                directoryInfo.Create();
            }
            //header页眉名
            string file = System.Web.HttpContext.Current.Server.MapPath(@"~/Report/") + "Model2.doc";

            word.OpenWord(file);
            int index3 = 1;
            try
            {
                for (int i = 0; i < mlist.Count; i++)
                {

                    if (i == 0)
                    {
                        word.InsertText(1,mlist[i].SVALUE12, 22);
                        word.InsertText(2,mlist[i].CODE_NAME, 18);
                        string text = mlist[i].CODE_NAME + index3;
                        string delete = mlist[i].CODE_NAME + "缺陷报告";
                        word.InsertFile(3, text, 16, http + mlist[i].SVALUE13, delete);

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
                                                string text = mlist[i].CODE_NAME + index3;
                                                string delete = mlist[i].CODE_NAME + "缺陷报告";
                                                word.InsertFile(3, text, 16, http + mlist[i].SVALUE13, delete);
                                            }

                                        }
                                    }
                                    else
                                    {
                                        index3 = 1;
                                        word.InsertText(2,mlist[i].CODE_NAME, 18);
                                        string text = mlist[i].CODE_NAME + index3;
                                        string delete = mlist[i].CODE_NAME + "缺陷报告";
                                        word.InsertFile(3, text, 16, http + mlist[i].SVALUE13, delete);
                                    }

                                }
                            }
                            else
                            {
                                index3 = 1;
                                word.InsertText(1,mlist[i].SVALUE12, 22);
                                word.InsertText(2,mlist[i].CODE_NAME, 18);
                                string text = mlist[i].CODE_NAME + index3;
                                string delete = mlist[i].CODE_NAME + "缺陷报告";
                                word.InsertFile(3, text, 16, http + mlist[i].SVALUE13, delete);
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
            string name = "（合并版）动车组车载接触网运行状态检测装置（3C）报告（" + alarmCond.startTime.ToString("yyyyMMdd") + "-" + alarmCond.endTime.ToString("yyyyMMdd") + "）.doc";
            string filename =  System.Web.HttpContext.Current.Server.MapPath(@"~/TempReport/")+name;
            word.SaveAs(file,filename);
            return "/TempReport/"+name;
        }
        else
        {
            return null;
        }
    }
    /// <summary>
    /// 转换级别的标题名
    /// </summary>
    /// <param name="s"></param>
    /// <returns></returns>
    public string GetSeverity(string s)
    {
        string str = "";
        switch (s)
        {
            case ("一类"):
                str = "严重缺陷";
                break;
            case ("二类"):
                str = "一般缺陷";
                break;
            case ("三类"):
                str = "轻微缺陷";
                break;
        }
        return str;
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

        Virtual_Dir_Info vp =  ADO.IVirtual_dir_infoImpl.getVirtualAndPhysical("1");

        return vp;
    }

    public bool IsReusable {
        get {
            return false;
        }
    }

}