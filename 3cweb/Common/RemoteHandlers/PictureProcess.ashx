<%@ WebHandler Language="C#" Class="PictureProcess" %>

using System;
using System.Web;
using System.Net;
using System.IO;
using System.Drawing.Imaging;
using System.Drawing;

/// <summary>
/// 图片压缩处理 BY TJY 2017.08.01
/// </summary>
public class PictureProcess : ReferenceClass,IHttpHandler {

    public void ProcessRequest (HttpContext context) {
        string url = context.Request["url"];

        WebRequest wr = WebRequest.Create(url);
        using (HttpWebResponse wresp = (HttpWebResponse)wr.GetResponse())
        {
            Stream s = wresp.GetResponseStream();
            using (Image img = Image.FromStream(s))
            {
                int l = 120;
                int w = 71;

                //执行压缩
                Image des_pic = new Bitmap(l, w);
                Graphics g = Graphics.FromImage(des_pic);
                g.DrawImage(img, 0f, 0f, l, w);

                using (MemoryStream ms = new MemoryStream())
                {
                    des_pic.Save(ms, ImageFormat.Jpeg);
                    HttpContext.Current.Response.ContentType = "image/Jpeg";
                    HttpContext.Current.Response.BinaryWrite(ms.ToArray());
                }
            }
        }
    }

    public bool IsReusable {
        get {
            return false;
        }
    }

}