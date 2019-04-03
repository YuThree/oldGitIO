<%@ WebHandler Language="C#" Class="PolePictureUpload" %>

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


public class PolePictureUpload : ReferenceClass,IHttpHandler
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
                case "delete":
                    Delete();
                    break;
                default:
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
        HttpFileCollection files = HttpContext.Current.Request.Files;//上传文件
        string addurl = "";
        try
        {
            string uid = HttpContext.Current.Request["uid"];
            if (!string.IsNullOrEmpty(uid) && files != null && files.Count > 0)
            {
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
                        string newfile = "\\" + uid + "\\";
                        path = path + "\\" + "PolePicture" + newfile;
                        if (!Directory.Exists(path))
                        {
                            Directory.CreateDirectory(path);
                        }
                        TimeSpan span = DateTime.Now.ToUniversalTime() - new DateTime(1970, 1, 1, 0, 0, 0, 0);
                        string time = Convert.ToInt64(span.TotalMilliseconds).ToString();
                        fileName = "Pole" + "_" + time + fileExt;
                        //string ss = path + fileName;
                        file.SaveAs(path + fileName);
                        //写入数据库的路径
                        addurl ="\\"+VIRTUAL_DIR_NAME + "\\" + "PolePicture" + newfile + fileName;

                        StringBuilder json = new StringBuilder();
                        json.Append("{");
                        json.AppendFormat("\"imageUrl\":\"" + addurl + "\"");
                        json.Append("}");
                        json.Replace(@"\", @"/");


                        //string str = addurl.Replace(@"\", @"/");
                        HttpContext.Current.Response.ContentType = "application/json";
                        HttpContext.Current.Response.Write(json.ToString());
                    }
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
    /// 删除图片
    /// </summary>
    public void Delete()
    {
        string file = HttpContext.Current.Request["file"];//图片路径

        string sign = "false";
        string url = HttpContext.Current.Server.MapPath(file);
        url = url.Replace("#", "%23");
        if (File.Exists(url))
        {
            FileInfo fi = new FileInfo(url);
            File.Delete(url);
            sign = "true";
        }
        else
        {
            log4net.ILog log2 = log4net.LogManager.GetLogger("删除上传图片");
            log2.Info("服务器无文件：" + url);
        }
        HttpContext.Current.Response.Write(sign);
    }


    public bool IsReusable {
        get {
            return false;
        }
    }
}