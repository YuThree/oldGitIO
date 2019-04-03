<%@ WebHandler Language="C#" Class="ShowImg" %>

using System;
using System.Web;
using System.IO;
using System.Drawing;
using Api.Util;

public class ShowImg :ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        string strImg = context.Request.Form["X_Img"];

        string _Img = HttpContext.Current.Request["Img_src"];

        SaveImage(strImg, _Img, context);

    }

    public void SaveImage(string strImg, string _Img, HttpContext context)
    {
        string mess = "";
        try
        {
            string strPath = System.Web.HttpContext.Current.Server.MapPath("/FtpRoot");

            string[] file = _Img.Split(new string[] { "FtpRoot" }, StringSplitOptions.RemoveEmptyEntries);

            String newFilePath = strPath + file[1]; //文件保存路径

            byte[] arr = Convert.FromBase64String(strImg);
            MemoryStream ms = new MemoryStream(arr);
            Bitmap bmp = new Bitmap(ms);
            bmp.Save(newFilePath, System.Drawing.Imaging.ImageFormat.Jpeg);   //保存为.jpg格式
            ms.Close();
            mess = "成功";
            Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "图片保存", Api.Util.Public.FunNames.报警监控.ToString(), Public.GetLoginIP, "对图片" + _Img + "进行了修改保存操作", "", true);
        }
        catch (Exception ex)
        {

            mess = "失败";

            Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "图片保存", Api.Util.Public.FunNames.报警监控.ToString(), Public.GetLoginIP, "对图片" + _Img + "进行了修改保存操作", "", false);

            log4net.ILog log2 = log4net.LogManager.GetLogger("保存图片");
            log2.Error("保存图片", ex);

        }
        context.Response.ContentType = "text/plain";
        context.Response.Write(mess);
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}