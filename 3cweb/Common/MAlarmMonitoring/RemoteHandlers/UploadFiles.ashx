<%@ WebHandler Language="C#" Class="UploadFiles" %>

using Api.ADO.entity;
using Api.Fault.entity.alarm;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;


public class UploadFiles : ReferenceClass,IHttpHandler
{
    public void ProcessRequest(HttpContext context)
    {

        try
        {
            string action = HttpContext.Current.Request["action"];
            switch (action)
            {
                case "UpLoad":
                    UpLoad();
                    break;
                //case "query":
                //    Query();
                //    break;
                case "delete":
                    Delete();
                    break;
            }
        }
        catch (Exception ex)
        {
            log4net.ILog log = log4net.LogManager.GetLogger("图片上传");
            log.Error("执行出错", ex);
        }
    }
    /// <summary>
    /// 图片上传
    /// </summary>
    public void UpLoad()
    {
        //string feather = HttpContext.Current.Request["feather"];//类型
        string feather = "";
        HttpFileCollection files = HttpContext.Current.Request.Files;//上传文件
        string addurls = null;
        int t = 0;
        try
        {
            ADO.IVirtual_dir_infoImpl iserver = new ADO.IVirtual_dir_infoImpl();
            Virtual_Dir_Info vp = iserver.getVirtualAndPhysical();
            string VIRTUAL_DIR_NAME = vp.VIRTUAL_DIR_NAME;

            HttpPostedFile file = files[0];

            if (!string.IsNullOrEmpty(VIRTUAL_DIR_NAME))
            {
                string path = HttpContext.Current.Server.MapPath("/" + VIRTUAL_DIR_NAME);

                string fileName = Path.GetFileName(file.FileName);
                string fileExt = Path.GetExtension(file.FileName);

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
                    //string ss = path + fileName;
                    file.SaveAs(path + fileName);
                    //写入数据库的路径
                    string addurl = "/" + VIRTUAL_DIR_NAME + "\\" + "TaskFiles" + newfile + fileName;
                    addurls = addurls + addurl + ";";
                }
                else if (fileExt.Equals(".doc", StringComparison.OrdinalIgnoreCase) || fileExt.Equals(".xls", StringComparison.OrdinalIgnoreCase) || fileExt.Equals(".xlsx", StringComparison.OrdinalIgnoreCase) || fileExt.Equals(".docx", StringComparison.OrdinalIgnoreCase) || fileExt.Equals(".txt", StringComparison.OrdinalIgnoreCase) || fileExt.Equals(".pdf", StringComparison.OrdinalIgnoreCase))
                {
                    feather = "file";
                    string newfile = "\\" + feather + "\\" + DateTime.Now.ToString("yyyy") + "\\" + DateTime.Now.ToString("MM") + "\\" + DateTime.Now.ToString("dd") + "\\";
                    path = path + "\\" + "TaskFiles" + newfile;
                    if (!Directory.Exists(path))
                    {
                        Directory.CreateDirectory(path);
                    }

                    Random rd = new Random();
                    int num = rd.Next(100000, 1000000);

                    fileName = DateTime.Now.ToString("yyyyMMdd_HHmmss") + "_" + num + fileExt;
                    //string ss = path + fileName;
                    file.SaveAs(path + fileName);
                    //写入数据库的路径
                    string addurl = "/" + VIRTUAL_DIR_NAME + "\\" + "TaskFiles" + newfile + fileName;
                    addurls = addurls + addurl + ";";
                }
            }
        }
        catch (Exception ex)
        {
            log4net.ILog log2 = log4net.LogManager.GetLogger("图片上传");
            log2.Error("Error", ex);
        }
        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(addurls);
    }

    public string getValues(Api.Task.entity.MisTask misTask, string formname)
    {
        string values = "";
        switch (formname)
        {
            case "DEAL_RESULT":
                values = misTask.DEAL_RESULT;
                break;
            case "DEAL_DESCRIPT":
                values = misTask.DEAL_DESCRIPT;
                break;
            case "CHECK_DESCRIPT":
                values = misTask.CHECK_DESCRIPT;
                break;
            case "PROPOSAL":
                values = misTask.PROPOSAL;
                break;
        }
        return values;
    }


    ///// <summary>
    ///// 查看上传的图片路径
    ///// </summary>
    //public void Query()
    //{
    //    string formname = HttpContext.Current.Request["formname"];//Form表单名
    //    string taskid = HttpContext.Current.Request["taskid"];//任务ID



    //    StringBuilder json = new StringBuilder();
    //    json.Append("{\"data\":[");
    //    if (!string.IsNullOrEmpty(alarmid))
    //    {
    //        System.Data.DataTable dt = ADO.AlarmQuery.QueryRepairPicture(alarmid);
    //        if (dt != null && dt.Rows.Count > 0)
    //        {
    //            for (int i = 0; i < dt.Rows.Count; i++)
    //            {
    //                json.Append("{");

    //                json.Append("\"WAIT_REPAIR_PICTURE\":[" + getUrl(dt.Rows[i], "WAIT_REPAIR_PICTURE") + "],");
    //                json.Append("\"DONE_REPAIR_PICTURE\":[" + getUrl(dt.Rows[i], "DONE_REPAIR_PICTURE") + "]");

    //                json.Append("}");
    //                if (i < dt.Rows.Count - 1)
    //                {
    //                    json.Append(",");
    //                }
    //            }
    //        }
    //    }
    //    json.Append("]}");

    //    HttpContext.Current.Response.ContentType = "application/json";
    //    HttpContext.Current.Response.Write(json.ToString());
    //}
    ///// <summary>
    ///// 分割URL
    ///// </summary>
    //public string getUrl(DataRow dr, string name)
    //{
    //    StringBuilder json = new StringBuilder();

    //    if (dr[name] != DBNull.Value)
    //    {
    //        string[] Array = dr[name].ToString().Split(';');
    //        for (int i = 0; i < Array.Length; i++)
    //        {
    //            json.Append("\"" + Array[i].Replace("\\", "\\\\") + "\"");

    //            if (i < Array.Length - 1)
    //            {
    //                json.Append(",");
    //            }
    //        }
    //    }
    //    if (json != null)
    //    {
    //        return json.ToString();
    //    }
    //    return null;
    //}

    /// <summary>
    /// 删除图片
    /// </summary>
    public void Delete()
    {
        string addurls = HttpContext.Current.Request["addurls"];//所有文件路径路径
        string file = HttpContext.Current.Request["file"];//图片路径

        string url = HttpContext.Current.Server.MapPath(file);
        url = url.Replace("#", "%23");
        bool re = false;

        if (File.Exists(url))
        {
            try
            {
                FileInfo fi = new FileInfo(url);
                File.Delete(url);
                re = true;
            }
            catch (Exception ex)
            {
                log4net.ILog log3 = log4net.LogManager.GetLogger("删除上传图片" + ex);
                log3.Error("服务器无文件：" + url);
            }
        }
        else
        {
            log4net.ILog log2 = log4net.LogManager.GetLogger("删除上传图片");
            log2.Info("服务器无文件：" + url);
        }

        if (re)
        {
            if (addurls.Contains(file + ";"))
                addurls = addurls.Replace(file + ";", "");
            else
                addurls = addurls.Replace(file, "");
        }
        else
        {
            addurls = "删除失败";
        }

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(addurls);
    }


    public bool RemoteFileExists(string fileUrl)
    {
        try
        {
            HttpWebRequest re = (HttpWebRequest)WebRequest.Create(fileUrl);
            HttpWebResponse res = (HttpWebResponse)re.GetResponse();
            log4net.ILog log2 = log4net.LogManager.GetLogger("删除图片");
            log2.Error("判断远程文件存在与否" + fileUrl);
            log2.Error("判断远程文件存在与否res.ContentLength" + res.ContentLength);
            if (res.ContentLength != 0)
            {
                res.Close();
                return true;
            }
            res.Close();
        }
        catch (Exception ex)
        {

            return false;
        }
        return false;
    }


    public bool IsReusable {
        get {
            return false;
        }
    }
}