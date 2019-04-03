<%@ WebHandler Language="C#" Class="downloadReportCombine" %>

using System;
using System.Web;
using Api.Fault.entity.alarm;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using Api.ADO.entity;

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

        AlarmCond alarmCond = my_alarm.Get_AlermCond_byListWhere(context); //生成告警条件实体
        alarmCond.orderBy = null;
        alarmCond.LINE_CODE = null;
        List<Alarm> mlist = Api.ServiceAccessor.GetAlarmService().getC3AlarmReport(alarmCond);
        Api.Util.WordCombine word = new Api.Util.WordCombine();
        Virtual_Dir_Info vp = GetDir();
        if (mlist.Count > 0)
        {
            //header页眉名
            string header = "";
            string file = System.Web.HttpContext.Current.Server.MapPath(@"~/TempImage/");
            //filename生成路径名：实体路径\Report\WordModel+当前时间.doc
            string name = "WordModel" + DateTime.Now.ToString("yyyyMMddhhmmssfff") + ".doc";//文件名
            string filename = word.CreateWord(header,file,name);

            //string s1 = @"E:\1.doc";
            //string s2 = @"E:\2.doc";
            //word.Open(s1, header);
            //Alarm alarm = new Alarm();

            // if (mlist.Find(a => a.SEVERITY.Equals("一类")) != null)
            // {
            //     word.InsertText(1, "严重缺陷", 20);
            // }

            //IEnumerable<IGrouping<string, Alarm>> query = mlist.GroupBy(a => a.CODE, pet => pet);  
            //foreach (IGrouping<string, Alarm> info in query)  
            //{  
            //    List<Alarm> sl = info.ToList<Alarm>();//分组后的集合                  
            //        //也可循环得到分组后，集合中的对象，你可以用info.Key去控制  
            //        //foreach (KqiPageSetupInfo set in info)   
            //        //{   
            //        //}   

            //}  
            // List<Alarm> lis = GetList(mlist,alarm.CODE,"一类");
            int index1 = 2;
            int index2 = 1;
            int index3 = 1;
            try
            {
                for (int i = 0; i < mlist.Count; i++)
                {

                    if (i == 0)
                    {

                        word.InsertText(1, index1+mlist[i].SVALUE15, 22);
                        word.InsertText(2, index1+"."+index2+mlist[i].CODE_NAME, 16);
                        string text = index1+"."+index2+"."+index3+mlist[i].CODE_NAME + index3;
                        word.InsertFile(3, text, 16, Convert_PHYSICAL_Url(mlist[i].SVALUE13));

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
                                                string text = index1+"."+index2+"."+index3+mlist[i].CODE_NAME + index3;
                                                word.InsertFile(3, text, 16, Convert_PHYSICAL_Url(mlist[i].SVALUE13));
                                            }

                                        }
                                    }
                                    else
                                    {
                                        index2++;
                                        index3 = 1;
                                        word.InsertText(2, index1+"."+index2+mlist[i].CODE_NAME, 16);
                                        string text = index1+"."+index2+"."+index3+mlist[i].CODE_NAME + index3;
                                        word.InsertFile(3, text, 16, Convert_PHYSICAL_Url(mlist[i].SVALUE13));
                                    }

                                }
                            }
                            else
                            {
                                index1++;
                                index2 = 1;
                                index3 = 1;
                                word.InsertText(1, index1+mlist[i].SVALUE15, 22);
                                word.InsertText(2, index1+"."+index2+mlist[i].CODE_NAME, 16);
                                string text = index1+"."+index2+"."+index3+mlist[i].CODE_NAME + index3;
                                word.InsertFile(3, text, 16, Convert_PHYSICAL_Url(mlist[i].SVALUE13));
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
            //生成filename路径的WORD文件
            word.SaveAs(filename);
            return "/TempImage/"+name;
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

        ADO.IVirtual_dir_infoImpl iserver = new ADO.IVirtual_dir_infoImpl();

        Virtual_Dir_Info vp = iserver.getVirtualAndPhysical();

        return vp;
    }


    public bool IsReusable {
        get {
            return false;
        }
    }

}