<%@ WebHandler Language="C#" Class="Handler1" %>

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net;
using System.IO;
using System.Text;
using System.Security.Cryptography;
using System.Drawing;
 /// <summary>
    /// Handler1 的摘要说明
    /// </summary>
    public class Handler1 : IHttpHandler
    {
        string strKey = "gtdq-test";//发开KEY

        public void ProcessRequest(HttpContext context)
        {
            string car = context.Request.QueryString["car"];
            string camera = context.Request.QueryString["camera"];//（1红外2局部3全景4辅助）
            car = car.Replace("#", "%23");
            string uri = "http://192.168.1.60:8000/api/realvideo?car=" + car + "&camera=" + camera + "&resolution=0&quality=50";
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
            req.Headers["timestamp"] =str_timestamp;

            using (HttpWebResponse response = (HttpWebResponse)req.GetResponse())
            {
                Stream stream = response.GetResponseStream();

                using (Image mImage = Image.FromStream(stream))
                {
                    using (MemoryStream ms = new MemoryStream())
                    {
                        mImage.Save(ms, mImage.RawFormat);
                        context.Response.ContentType = "image/image_type";
                        context.Response.BinaryWrite(ms.ToArray());
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