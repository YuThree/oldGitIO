<%@ WebHandler Language="C#" Class="Upload1CSource" %>

using System;
using System.Web;
using System.IO;
using System.Data;
using System.Collections.Generic;
using Aspose.Cells;
using System.Data;
using Api.ADO.entity;
using Api.Fault.entity.alarm;
using Api.Fault.service;
using Api.Util;
using System.Text;
using Api.Foundation.entity.Foundation;
using System.Linq;
using System.Text.RegularExpressions;

public class Upload1CSource : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        try
        {
            string type = HttpContext.Current.Request["action"];
            switch (type)
            {
                case "upLoad":
                    UpLoad();
                    break;
            }
        }
        catch (Exception ex)
        {
            log4net.ILog log = log4net.LogManager.GetLogger("变电所异常数据");
            log.Error("执行出错", ex);
        }
    }
    public void UpLoad()
    {
        int suc = 0;
        int fail = 0;
        string feather = "";//类型
        HttpFileCollection files = HttpContext.Current.Request.Files;//上传文件

        ADO.IVirtual_dir_infoImpl iserver = new ADO.IVirtual_dir_infoImpl();
        Virtual_Dir_Info vp = iserver.getVirtualAndPhysical();
        string VIRTUAL_DIR_NAME = vp.VIRTUAL_DIR_NAME;

        for (int i = 0; i < files.Count; i++)
        {
            string alarmid = GetAlarmId(Path.GetFileName(files[i].FileName));
            //判断是否匹配到对应的报警ID
            if (!string.IsNullOrEmpty(alarmid))
            {
                try
                {
                    if (!string.IsNullOrEmpty(VIRTUAL_DIR_NAME))
                    {
                        string path = HttpContext.Current.Server.MapPath("/" + VIRTUAL_DIR_NAME);

                        string fileName = "";
                        string fileExt = Path.GetExtension(files[i].FileName);
                        //图片类型
                        if (fileExt.Equals(".jpeg", StringComparison.OrdinalIgnoreCase) || fileExt.Equals(".bmp", StringComparison.OrdinalIgnoreCase) || fileExt.Equals(".png", StringComparison.OrdinalIgnoreCase) || fileExt.Equals(".gif", StringComparison.OrdinalIgnoreCase) || fileExt.Equals(".jpg", StringComparison.OrdinalIgnoreCase))
                        {
                            feather = "picture";
                            string newfile = "\\" + feather + "\\" + DateTime.Now.ToString("yyyy") + "\\" + DateTime.Now.ToString("MM") + "\\" + DateTime.Now.ToString("dd") + "\\";
                            path = path + "\\" + "TaskFiles" + newfile;
                            if (!Directory.Exists(path))
                            {
                                Directory.CreateDirectory(path);
                            }

                            Random rd = new Random(DateTime.Now.Millisecond);
                            int num = rd.Next(100000, 1000000);

                            fileName = DateTime.Now.ToString("yyyyMMdd_HHmmss") + "_" + num + fileExt;

                            files[i].SaveAs(path + fileName);
                            //写入数据库的路径
                            string addurl = (VIRTUAL_DIR_NAME + "/TaskFiles" + newfile + fileName).Replace("\\", "/");


                            Alarm alarm = Api.ServiceAccessor.GetAlarmService().getAlarm(alarmid);
                            //删除以前的图片
                            PublicMethod.DeleteFile(HttpContext.Current.Server.MapPath("~/" + alarm.ATTACHMENT));
                            //更新
                            alarm.ATTACHMENT = addurl;
                            Api.ServiceAccessor.GetAlarmService().updateAlarm(alarm);
                        }
                        //文件类型
                        else if (fileExt.Equals(".doc", StringComparison.OrdinalIgnoreCase) || fileExt.Equals(".xls", StringComparison.OrdinalIgnoreCase) || fileExt.Equals(".xlsx", StringComparison.OrdinalIgnoreCase) || fileExt.Equals(".docx", StringComparison.OrdinalIgnoreCase) || fileExt.Equals(".txt", StringComparison.OrdinalIgnoreCase) || fileExt.Equals(".pdf", StringComparison.OrdinalIgnoreCase))
                        {
                            feather = "files[i]";
                            string newfile = "\\" + feather + "\\" + DateTime.Now.ToString("yyyy") + "\\" + DateTime.Now.ToString("MM") + "\\" + DateTime.Now.ToString("dd") + "\\";
                            path = path + "\\" + "TaskFiles" + newfile;
                            if (!Directory.Exists(path))
                            {
                                Directory.CreateDirectory(path);
                            }

                            Random rd = new Random();
                            int num = rd.Next(100000, 1000000);

                            fileName = DateTime.Now.ToString("yyyyMMdd_HHmmss") + "_" + num + fileExt;

                            files[i].SaveAs(path + fileName);
                            //写入数据库的路径
                            string addurl = (VIRTUAL_DIR_NAME + "/TaskFiles" + newfile + fileName).Replace("\\", "/");

                            Alarm alarm = Api.ServiceAccessor.GetAlarmService().getAlarm(alarmid);
                            //删除以前的表单
                            PublicMethod.DeleteFile(HttpContext.Current.Server.MapPath("~/" + alarm.SVALUE14));
                            alarm.SVALUE14 = addurl;
                            Api.ServiceAccessor.GetAlarmService().updateAlarm(alarm);
                        }
                    }
                    suc++;//匹配成功一条
                }
                catch (Exception ex)
                {
                    log4net.ILog log = log4net.LogManager.GetLogger("1C附件匹配报警失败");
                    log.Error("执行出错", ex);

                }
            }
        }
        StringBuilder json = new StringBuilder();
        json.Append("{\"success\":\"" + suc + "\",\"failure\":\"" + (files.Count - suc) + "\"}");

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json.ToString());
    }


    public string GetAlarmId(string filename)
    {
        string id = "";
        try
        {
            string regex1 = @"^\d\d\d\d-\d\d-\d\d";
            string regex2 = @"[\u4e00-\u9fa5]+";
            string regex3 = @"K\d*\.\d*";
            var ss1 = Regex.Match(filename, regex1).Value;
            var ss2 = Regex.Match(filename, regex2).Value;
            var ss3 = Regex.Match(filename, regex3).Value;

            string cond = "";
            cond += " AND A.CATEGORY_CODE= '1C' ";
            if (!string.IsNullOrEmpty(ss1))
            {
                cond += " AND A.RAISED_TIME >= TO_DATE('" + ss1 + "','yyyy-MM-dd') ";
                cond += " AND A.RAISED_TIME < TO_DATE('" + Convert.ToDateTime(ss1).AddDays(1).ToString("yyyy-MM-dd") + "','yyyy-MM-dd') ";
            }
            if (!string.IsNullOrEmpty(ss2))
            {
                string direction = ss2.Substring(ss2.Length - 2, 2);
                string line_name = ss2.Substring(0, ss2.Length - 2);
                cond += " AND A.DIRECTION= '" + direction + "' ";
                cond += " AND A.LINE_NAME= '" + line_name + "' ";
            }
            if (!string.IsNullOrEmpty(ss3))
            {
                ss3 = ss3.Remove(ss3.IndexOf("K"), 1);
                double kmmark = double.Parse(ss3) * 1000;
                cond += " AND A.KM_MARK= " + kmmark;
            }
            if (!string.IsNullOrEmpty(ss1) && !string.IsNullOrEmpty(ss2) && !string.IsNullOrEmpty(ss3))
            {
                string sql = string.Format(@"SELECT id FROM ALARM A WHERE 1=1 {0} ORDER BY A.RAISED_TIME DESC", cond);
                System.Data.DataSet ds = DbHelperOra_ADO.Query(sql);///数据库连接字符串(web.config来配置)

                if (ds.Tables.Count > 0)
                    if (ds.Tables[0].Rows.Count > 0)
                        id = ds.Tables[0].Rows[0]["ID"].ToString();
            }
        }
        catch (Exception ex)
        {
            log4net.ILog log = log4net.LogManager.GetLogger("1C匹配报警ID失败");
            log.Error("执行出错", ex);
        }
        return id;
    }




    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}