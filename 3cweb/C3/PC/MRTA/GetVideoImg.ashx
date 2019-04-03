<%@ WebHandler Language="C#" Class="GetVideoImg" %>

using System;
using System.Web;
using System.Net;
using System.Collections.Generic;
using System.Linq;
using System.Web.Script.Serialization;
using System.Drawing.Imaging;
public class GetVideoImg : ReferenceClass,IHttpHandler {




    public void ProcessRequest (HttpContext context) {
        //context.Response.ContentType = "text/plain";
        //context.Response.Write("Hello World");

        // context.Server.MapPath()

        //http://172.16.1.10:/user.do?action=GetRealTimeHDImage&type=2&tid=

        string temp = AppDomain.CurrentDomain.BaseDirectory;

        try
        {
            System.Net.ServicePointManager.DefaultConnectionLimit = 50;

            string ip = context.Request.QueryString["IP"] != null ? context.Request.QueryString["IP"].ToString() : "172.16.1.10";//传过来的vpnIP,172开头
            string action = context.Request.QueryString["action"] != null ? context.Request.QueryString["action"].ToString() : "GetRealTimeHDImage";
            string type = context.Request.QueryString["type"] != null ? context.Request.QueryString["type"].ToString() : "2";
            string tid = context.Request.QueryString["tid"] != null ? context.Request.QueryString["tid"].ToString() : "";
            string auto = context.Request.QueryString["auto"] != null ? context.Request.QueryString["auto"].ToString() : "";
           // string definition= context.Request.QueryString["definition"] != null ? context.Request.QueryString["definition"].ToString() : ""; //清晰度
            string locaType= context.Request.QueryString["locaType"] != null ? context.Request.QueryString["locaType"].ToString() : ""; //动车DC 机车JC
            string AB= context.Request.QueryString["AB"] != null ? context.Request.QueryString["AB"].ToString() : ""; //A/B面
            string locaNo= context.Request.QueryString["locaNo"] != null ? context.Request.QueryString["locaNo"].ToString() : ""; //车号
            string time= context.Request.QueryString["time"] != null ? context.Request.QueryString["time"].ToString() : ""; //车号

            string realIP = "";
            string vpnIP = ip;
            bool ispass = false;

            if (locaType == "DC")
            {
                locaNo += "_" + AB;
            }


            if(ip=="WebGetIP")
            {
                //PS5 GT3  自研动车，机车  。没有配置信息。远程获取ip和端口           
                LocaStatus m_locaStatus= PublicMethod.GetRealIP(locaNo);
                if (m_locaStatus != null)
                {
                    realIP = m_locaStatus.ip;
                    vpnIP = m_locaStatus.vpnip;

                    if (realIP != "")
                    {
                        //真实ip 连接测试。
                        bool realIPispass = Ping(realIP);
                        if (realIPispass)
                        {
                            ip = realIP + ":8080";
                            ispass = true;
                        }
                    }

                }
            }

            if (!ispass)
            {
                //未通过，使用vpnIP连接测试。
                bool vpnIPispass = Ping(vpnIP);
                if (vpnIPispass)
                {
                    ip = vpnIP;
                    ispass = true;
                }
            }


            string CacheName = "VideoImg_" + ip.Replace(".", "") + action + type;


            log4net.ILog log = log4net.LogManager.GetLogger("视频直播");
            log.Info("连接的IP" + ip);

            //var jser    = new JavaScriptSerializer();
            ////    var json    = jser.Serialize(new List<Person>() { p1, p2 });
            //string url_localist = "http://125.69.149.77/getiplist?type=1";
            //string json= GetUrltoHtml(url_localist, "utf-8");
            //var persons = jser.Deserialize<List<LocaStatus>>(json);


            //   bool ispass2 = Ping("www.baidu.com");

            if(ip.Contains("125.69.149.77"))
                ispass = true;

            if (ispass)
            {

                if (context.Cache[CacheName] != null)
                {
                    //直播取缓存。
                    byte[] _re_convert = (byte[])context.Cache[CacheName];
                    context.Response.BinaryWrite(_re_convert);
                    return;
                }
                else
                {

                    //无缓存
                    string timeStr = "";
                    if (!string.IsNullOrEmpty(time))
                    {
                        timeStr = "&time="+time;
                    }

                    string _url = string.Format("http://{0}/user.do?action={1}&type={2}{3}&tid={4}"
                            , ip, action, type,timeStr, tid
                        );

                    Uri uri = new Uri(_url);
                    System.Net.HttpWebRequest request = (System.Net.HttpWebRequest)System.Net.HttpWebRequest.Create(uri);
                    request.Timeout = 10000;
                    //    request.ReadWriteTimeout = 2000;

                    System.Net.HttpWebResponse response = (HttpWebResponse)request.GetResponse();

                    System.IO.Stream resStream = response.GetResponseStream();//得到图片数据流
                    System.Drawing.Bitmap bitmap = new System.Drawing.Bitmap(resStream);//初始化Bitmap图片

                    System.IO.MemoryStream ms = new System.IO.MemoryStream();

                    System.Drawing.Imaging.EncoderParameter p;
                    System.Drawing.Imaging.EncoderParameters ps;
                    ps = new System.Drawing.Imaging.EncoderParameters(1);
                    p = new System.Drawing.Imaging.EncoderParameter(System.Drawing.Imaging.Encoder.Quality,100L);
                    ps.Param[0] = p;
                    bitmap.Save(ms, GetCodecInfo("image/jpeg"), ps);

                    //  bitmap.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);



                    context.Response.ClearContent();
                    context.Response.ContentType = "image/jpeg";


                    byte[] re = ms.ToArray();


                    //context.Response.BinaryWrite(re);
                    //return;

                    #region  增加曝光

                    try
                    {

                        string AutoExpose = System.Configuration.ConfigurationManager.AppSettings["AutoExpose"] != null ? System.Configuration.ConfigurationManager.AppSettings["AutoExpose"].ToString() : "";

                        if (auto=="1" && AutoExpose == "1")
                        {
                            int len = re.Length;
                            byte[] re2 = new byte[166547];
                            for (int i = 0; i < re.Length; i++)
                            {
                                re2[i] = re[i];
                            }

                            AutoExposure.dlvJPGAutoExpose(0, re2, ref len, 480, 360, 1);

                            re = re2.Take(len).ToArray();

                        }
                    }
                    catch (Exception ex)
                    {
                        log4net.ILog log2 = log4net.LogManager.GetLogger("视频直播_曝光");
                        log2.Error("Error", ex);
                    }


                    #endregion


                    context.Cache.Insert(CacheName, re, null, DateTime.Now.AddSeconds(1), TimeSpan.Zero);
                    context.Response.BinaryWrite(re);

                }

                //log4net.ILog log = log4net.LogManager.GetLogger("记录");
                //log.Error("Error", ex);               

            }

            // this.pictureBox1.Image = sourcebm;
        }
        catch (Exception ex) {


            log4net.ILog log = log4net.LogManager.GetLogger("视频直播");
            log.Error("Error", ex);

        }


    }

    public bool IsReusable {
        get {
            return false;
        }
    }

    /**//// <summary>
        /// 保存JPG时用
        /// </summary>
        /// <param name="mimeType"></param>
        /// <returns>得到指定mimeType的ImageCodecInfo</returns>
    private static ImageCodecInfo GetCodecInfo(string mimeType)
    {
        ImageCodecInfo[] CodecInfo = ImageCodecInfo.GetImageEncoders();
        foreach (ImageCodecInfo ici in CodecInfo)
        {
            if (ici.MimeType == mimeType) return ici;
        }
        return null;
    }

    /// <summary>  
    /// 是否能 Ping 通指定的主机  
    /// </summary>  
    /// <param name="ip">ip 地址或主机名或域名</param>  
    /// <returns>true 通，false 不通</returns>  
    public bool Ping(string ip)
    {
        if (ip == "" || ip == "no" || ip == "WebGetIP")
        {
            return false;
        }

        if (ip.IndexOf(":") >= 0)
        {
            ip = ip.Split(':')[0];
        }

        System.Net.NetworkInformation.Ping p = new System.Net.NetworkInformation.Ping();
        System.Net.NetworkInformation.PingOptions options = new System.Net.NetworkInformation.PingOptions();
        options.DontFragment = true;
        string data = "Test Data!";
        byte[] buffer = System.Text.Encoding.ASCII.GetBytes(data);
        int timeout = 3000; // Timeout 时间，单位：毫秒  
        System.Net.NetworkInformation.PingReply reply = p.Send(ip, timeout, buffer, options);
        if (reply.Status == System.Net.NetworkInformation.IPStatus.Success)
            return true;
        else
            return false;
    }

    ///// <summary>
    ///// 得到真实IP
    ///// </summary>
    ///// <param name="locaNo"></param>
    ///// <returns></returns>
    //public LocaStatus GetRealIP(string locaNo)
    //{
    //    // string ip = "";
    //    try
    //    {

    //        //bool ispass = Ping("125.69.149.77");

    //        //if (ispass)
    //        //{
    //        //string url_localist = "http://125.69.149.77/getiplist?type=1";  得到所有动车列表。
    //        string url_localist = "http://125.69.149.77/getip?car=" + locaNo; //CRH2A-2228_A
    //        string json = GetUrltoHtml(url_localist, "utf-8");
    //        var jser = new JavaScriptSerializer();
    //        var persons = jser.Deserialize<List<LocaStatus>>(json);


    //        if (persons[0].online)
    //        {
    //            return persons[0];
    //        }


    //        //  }
    //    }
    //    catch (Exception ex)
    //    {

    //        log4net.ILog log = log4net.LogManager.GetLogger("视频直播_得到真实IP");
    //        log.Error("Error", ex);

    //    }

    //    return null;

    //}


    //public static string GetUrltoHtml(string Url, string type)
    //{

    //    try
    //    {

    //        System.Net.WebRequest wReq = System.Net.WebRequest.Create(Url);

    //        // Get the response instance.

    //        System.Net.WebResponse wResp = wReq.GetResponse();

    //        System.IO.Stream respStream = wResp.GetResponseStream();

    //        // Dim reader As StreamReader = New StreamReader(respStream)

    //        using (System.IO.StreamReader reader = new System.IO.StreamReader(respStream, System.Text.Encoding.GetEncoding(type)))
    //        {
    //            return reader.ReadToEnd();
    //        }

    //    }
    //    catch (System.Exception ex)
    //    {
    //        //errorMsg = ex.Message;
    //    }
    //    return "";
    //}

}