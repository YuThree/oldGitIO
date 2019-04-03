<%@ WebHandler Language="C#" Class="VideoPlayInfor_JC" %>

using System;
using System.Web;
using System.Net;
using System.IO;
using System.Text;
using System.Security.Cryptography;
using System.Drawing;

public class VideoPlayInfor_JC : ReferenceClass, IHttpHandler {

    public void ProcessRequest (HttpContext context) {

        string tag = HttpContext.Current.Request["tag"];
        switch (tag)
        {
            case "VedioPlay":
                VedioPlay();
                break;
            case "getHistoryStartTime":
                getHistoryStartTime();
                break;
        }
    }
    /// <summary>
    /// 获取机车历史图片开始时间
    /// </summary>
    public void getHistoryStartTime()
    {
        string car = HttpContext.Current.Request["car"];//车号
        string location = HttpContext.Current.Request["location"];//弓位置(A,B)
        string camera = HttpContext.Current.Request["camera"];//相机号（1红外2局部3全景）

        string ip = "125.69.149.77";
        string url = "http://" + ip + "/api/jc/hisbegintime?car=" + car + "&location=" + location + "&camera=" + camera;

        string re = HttpGet(url);

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(re);
    }
    /// <summary>
    /// 获取机车图片
    /// </summary>
    public void VedioPlay()
    {
        string strKey = "gtdq-xxb";//发开KEY

        string car = HttpContext.Current.Request["car"];//车号
        string location = HttpContext.Current.Request["location"];//弓位置(A,B)
        string camera = HttpContext.Current.Request["camera"];//相机号（1红外2局部3全景）
        string time = HttpContext.Current.Request["time"];//要请求历史图像的毫秒级时间戳
        string mode = HttpContext.Current.Request["mode"];//直播、回放

        string ip = "125.69.149.77";
        string url = "";

        if (mode == "real")//直播
        {
            url = "http://" + ip + "/api/jc/realvideo?car=" + car + "&location=" + location + "&camera=" + camera;
        }
        else if (mode == "history" )//回放
        {
            url = "http://" + ip + "/api/jc/hisvideo?car=" + car + "&location=" + location + "&camera=" + camera + "&time=" + time;
        }
        System.Net.HttpWebRequest req = (System.Net.HttpWebRequest)System.Net.HttpWebRequest.Create(url);
        //System.Net.HttpWebRequest req = (System.Net.HttpWebRequest)System.Net.HttpWebRequest.Create("http://api.map.baidu.com/staticimage?center=116.403874,39.914889&width=400&height=300&zoom=11&markers=116.288891,40.004261|116.487812,40.017524|116.525756,39.967111|116.536105,39.872374|116.442968,39.797022|116.270494,39.851993|116.275093,39.935251|116.383177,39.923743&markerStyles=l,A|m,B|l,C|l,D|m,E|,|l,G|m,H");
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
                }
            }
        }
    }
    /// <summary>
    /// http请求，返回string
    /// </summary>
    /// <param name="Url"></param>
    /// <returns></returns>
    public string HttpGet(string Url)
    {
        string strKey = "gtdq-xxb";//发开KEY

        System.Net.HttpWebRequest req = (System.Net.HttpWebRequest)System.Net.HttpWebRequest.Create(Url);
        //System.Net.HttpWebRequest req = (System.Net.HttpWebRequest)System.Net.HttpWebRequest.Create("http://fanyi.baidu.com/transcontent");
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

        HttpWebResponse response = (HttpWebResponse)req.GetResponse();
        Stream myResponseStream = response.GetResponseStream();
        StreamReader myStreamReader = new StreamReader(myResponseStream, Encoding.Default);
        string retString = myStreamReader.ReadToEnd();
        myStreamReader.Close();
        myResponseStream.Close();

        return retString;
    }

    public bool IsReusable {
        get {
            return false;
        }
    }

}