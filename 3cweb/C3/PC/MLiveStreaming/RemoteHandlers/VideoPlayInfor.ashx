<%@ WebHandler Language="C#" Class="VideoPlayInfor" %>

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using System.Drawing;
using System.Net;
using System.Text;
using System.Security.Cryptography;

public class VideoPlayInfor : ReferenceClass, IHttpHandler
{

    //protected void Page_Load(object sender, EventArgs e)
    //{
    //    try
    //    {
    //        ProcessRequest();
    //    }
    //    catch (Exception ex)
    //    {

    //        log4net.ILog log = log4net.LogManager.GetLogger("视频播放");
    //        log.Error("执行出错", ex);
    //    }
    //}


    public void ProcessRequest(HttpContext context)
    {
        try
        {


            ProcessRequest();
        }
        catch (Exception ex)
        {

            log4net.ILog log = log4net.LogManager.GetLogger("视频播放");
            log.Error("执行出错", ex);
        }

    }


    /// <summary>
    /// 视频播放处理
    /// </summary>
    /// <param name="context"></param>
    public void ProcessRequest()
    {
        string strKey = "gtdq-xxb";//发开KEY


        string car = HttpContext.Current.Request.QueryString["car"]; //车号
        string camera = HttpContext.Current.Request["camera"];//（1红外2局部3全景4辅助）
        string resolution = HttpContext.Current.Request["resolution"];//尺寸
        string quality = HttpContext.Current.Request["quality"];//图片的清晰度
        string playmode = HttpContext.Current.Request["playmode"];//直播或者回放
        string time = HttpContext.Current.Request["time"];//回放时间

        string ip = HttpContext.Current.Request.QueryString["IP"] != null ? HttpContext.Current.Request.QueryString["IP"].ToString() : "172.16.1.10";//传过来的vpnIP,172开头
        string action = HttpContext.Current.Request.QueryString["action"] != null ? HttpContext.Current.Request.QueryString["action"].ToString() : "GetRealTimeHDImage";
        string type = HttpContext.Current.Request.QueryString["type"] != null ? HttpContext.Current.Request.QueryString["type"].ToString() : "2";

        string CacheName = "VideoImg_" + ip.Replace(".", "") + action + type;


        if (HttpContext.Current.Cache[CacheName] != null && HttpContext.Current.Request.QueryString["IP"] != null)
        {
            //直播取缓存。
            byte[] _re_convert = (byte[])HttpContext.Current.Cache[CacheName];

            HttpContext.Current.Response.BinaryWrite(_re_convert);
            return;
        }else
        {
            //无缓存
            string uri = "";
            if (playmode == "回放")
            {
                uri = "http://125.69.149.77/api/hisvideo?car=" + car.Replace("#", "%23") + "&camera=" + camera + "&resolution=" + resolution + "&quality=" + quality + "&time=" + time;
            }
            else
            {
                uri = "http://125.69.149.77/api/realvideo?car=" + car.Replace("#", "%23") + "&camera=" + camera + "&resolution=" + resolution + "&quality=" + quality;
            }
            System.Net.HttpWebRequest req = (System.Net.HttpWebRequest)System.Net.HttpWebRequest.Create(uri);// = (HttpRequest)HttpRequest.Create("http://fanyi.baidu.com/transcontent");
            req.Method = "GET";
            //当前时间戳
            TimeSpan ts = DateTime.UtcNow - new DateTime(1970, 1, 1, 0, 0, 0, 0);
            string str_timestamp = Convert.ToInt64(ts.TotalSeconds).ToString();
            //
            string str_sha1_in = strKey + str_timestamp;

            //进行数字签名
            SHA1 sha1 = new SHA1CryptoServiceProvider();
            byte[] bytes_sha1_in = UTF8Encoding.Default.GetBytes(str_sha1_in);
            byte[] bytes_sha1_out = sha1.ComputeHash(bytes_sha1_in);
            string str_sha1_out = BitConverter.ToString(bytes_sha1_out);
            str_sha1_out = str_sha1_out.Replace("-", "");

            req.Headers["token"] = str_sha1_out;
            req.Headers["timestamp"] = str_timestamp;

            using (HttpWebResponse response = (HttpWebResponse)req.GetResponse())
            {
                Stream stream = response.GetResponseStream();

                using (Image mImage = Image.FromStream(stream))
                {
                    using (MemoryStream ms = new MemoryStream())
                    {
                        mImage.Save(ms, mImage.RawFormat);
                        HttpContext.Current.Response.ContentType = "image/image_type";
                        HttpContext.Current.Response.BinaryWrite(ms.ToArray());

                        //存储缓存供非直连
                        HttpContext.Current.Cache.Insert(CacheName, ms.ToArray(), null, DateTime.Now.AddSeconds(1), TimeSpan.Zero);
                        HttpContext.Current.Response.BinaryWrite(ms.ToArray());
                    }
                }
            }
        }
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}