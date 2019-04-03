<%@ WebHandler Language="C#" Class="UploadPicture" %>

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


public class UploadPicture : ReferenceClass,IHttpHandler
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
                case "query":
                    Query();
                    break;
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
        string feather = HttpContext.Current.Request["feather"];//类型
        string alarmid = HttpContext.Current.Request["alarmid"];//缺陷编码
        HttpFileCollection files = HttpContext.Current.Request.Files;//上传文件
        string addurl = null;
        int t = 0;
        try
        {

            if (!string.IsNullOrEmpty(feather) && !string.IsNullOrEmpty(alarmid) && files != null && files.Count > 0)
            {
                //Alarm alarm = Api.ServiceAccessor.GetAlarmService().getAlarm(alarmid);
                Alarm alarm = Api.ServiceAccessor.GetAlarmService().getAlarm(alarmid);


                ADO.IVirtual_dir_infoImpl iserver = new ADO.IVirtual_dir_infoImpl();

                Virtual_Dir_Info vp = iserver.getVirtualAndPhysical();

                string VIRTUAL_DIR_NAME = vp.VIRTUAL_DIR_NAME;

                if (!string.IsNullOrEmpty(VIRTUAL_DIR_NAME))
                {
                    string path = HttpContext.Current.Server.MapPath("/" + VIRTUAL_DIR_NAME);
                    HttpPostedFile file = files[0];
                    string fileName = Path.GetFileName(file.FileName);
                    string fileExt = Path.GetExtension(file.FileName);
                    if (fileExt.Equals(".jpeg", StringComparison.OrdinalIgnoreCase) || fileExt.Equals(".bmp", StringComparison.OrdinalIgnoreCase) || fileExt.Equals(".png", StringComparison.OrdinalIgnoreCase) || fileExt.Equals(".gif", StringComparison.OrdinalIgnoreCase) || fileExt.Equals(".jpg", StringComparison.OrdinalIgnoreCase))
                    {
                        string newfile = "\\" + alarm.CATEGORY_CODE + "\\" + alarm.RAISED_TIME.ToString("yyyy") + "\\" + alarm.RAISED_TIME.ToString("MM") + "\\" + alarm.RAISED_TIME.ToString("dd") + "\\";
                        path = path + "\\" + "RepairPicture" + newfile;
                        if (!Directory.Exists(path))
                        {
                            Directory.CreateDirectory(path);
                        }
                        TimeSpan span = DateTime.Now.ToUniversalTime() - new DateTime(1970, 1, 1, 0, 0, 0, 0);
                        string time = Convert.ToInt64(span.TotalMilliseconds).ToString();
                        fileName = alarm.RAISED_TIME.ToString("yyyyMMdd_HHmmss") + "_" + feather + "_" + time + fileExt;
                        //string ss = path + fileName;
                        file.SaveAs(path + fileName);
                        //写入数据库的路径
                        addurl = "/" + VIRTUAL_DIR_NAME + "\\" + "RepairPicture" + newfile + fileName;
                    }
                    DataTable dt = ADO.AlarmQuery.QueryRepairPicture(alarmid);
                    if (dt.Rows.Count <= 0)
                    {
                        if (feather == "wait")
                            t = ADO.AlarmQuery.InsertRepairPicture(alarmid, addurl, "");
                        else
                            t = ADO.AlarmQuery.InsertRepairPicture(alarmid, "", addurl);
                    }
                    else
                        t = ADO.AlarmQuery.UpdateRepairPicture(alarmid, feather, addurl);

                }
            }
        }
        catch (Exception ex)
        {
            log4net.ILog log2 = log4net.LogManager.GetLogger("图片上传");
            log2.Error("Error", ex);
        }
    }

    /// <summary>
    /// 查看上传的图片路径
    /// </summary>
    public void Query()
    {
        string alarmid = HttpContext.Current.Request["alarmid"];//报警编码
        StringBuilder json = new StringBuilder();
        json.Append("{\"data\":[");
        if (!string.IsNullOrEmpty(alarmid))
        {
            System.Data.DataTable dt = ADO.AlarmQuery.QueryRepairPicture(alarmid);
            if (dt != null && dt.Rows.Count > 0)
            {
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    json.Append("{");

                    json.Append("\"WAIT_REPAIR_PICTURE\":[" + getUrl(dt.Rows[i], "WAIT_REPAIR_PICTURE") + "],");
                    json.Append("\"DONE_REPAIR_PICTURE\":[" + getUrl(dt.Rows[i], "DONE_REPAIR_PICTURE") + "]");

                    json.Append("}");
                    if (i < dt.Rows.Count - 1)
                    {
                        json.Append(",");
                    }
                }
            }
        }
        json.Append("]}");

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json.ToString());
    }
    /// <summary>
    /// 分割URL
    /// </summary>
    public string getUrl(DataRow dr, string name)
    {
        StringBuilder json = new StringBuilder();

        if (dr[name] != DBNull.Value)
        {
            string[] Array = dr[name].ToString().Split(';');
            for (int i = 0; i < Array.Length; i++)
            {
                json.Append("\"" + Array[i].Replace("\\", "\\\\") + "\"");

                if (i < Array.Length - 1)
                {
                    json.Append(",");
                }
            }
        }
        if (json != null)
        {
            return json.ToString();
        }
        return null;
    }
    /// <summary>
    /// 删除图片
    /// </summary>
    public void Delete()
    {
        string feather = HttpContext.Current.Request["feather"];//类型
        string alarmid = HttpContext.Current.Request["alarmid"];//缺陷编码
        string file = HttpContext.Current.Request["file"];//图片路径

        bool sign = false;
        string state = "删除成功";
        string url = HttpContext.Current.Server.MapPath(file);
        url = url.Replace("#", "%23");
        if (File.Exists(url))
        {
            int re = ADO.AlarmQuery.DeleteRepairPicture(alarmid, feather, file);
            if (re > 0)
            {
                FileInfo fi = new FileInfo(url);
                File.Delete(url);
                sign = true;
            }
            else
            {
                state = "删除失败";
                log4net.ILog log2 = log4net.LogManager.GetLogger("删除上传图片");
                log2.Info("数据库记录删除失败：" + url);
            }
        }
        else
        {
            log4net.ILog log2 = log4net.LogManager.GetLogger("删除上传图片");
            log2.Info("服务器无文件：" + url);
            int re = ADO.AlarmQuery.DeleteRepairPicture(alarmid, feather, file);//服务器上不存在仍对数据库记录进行删除
            if (re > 0)
            {
                sign = true;
                state = "服务器无文件，删除数据库记录成功";
            }
            else
            {
                state = "服务器无文件，删除数据库记录失败";
                log2.Info("数据库记录删除失败：" + url);
            }
        }

        StringBuilder json = new StringBuilder();
        json.Append("{\"sign\":\"" + sign + "\",\"state\":\"" + state + "\"}");

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json.ToString());
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