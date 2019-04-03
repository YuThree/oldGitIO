<%@ WebHandler Language="C#" Class="downloadSampleFile" %>

using Api.ADO.entity;
using Api.Fault.entity.alarm;
using ICSharpCode.SharpZipLib.Zip;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public class downloadSampleFile :  ReferenceClass, IHttpHandler {

    public void ProcessRequest (HttpContext context) {

        Special_class sc = new Special_class();

        Page p = new Page();

        Thread.Sleep(1000 * 20);

        string alarmID = context.Request["alarmID"]; //报警ID
        C3_Alarm c3Alarm = Api.ServiceAccessor.GetAlarmService().getC3Alarm_Aux(alarmID);//查询alarm和alarm_aux表获取报警信息和类别
        string url = Api.ServiceAccessor.GetAlarmService().getURL(alarmID);
        c3Alarm.MY_STR_1 = url;

        Virtual_Dir_Info vd = ADO.IVirtual_dir_infoImpl.getVirtualAndPhysical("8");//获取虚拟路径及物理路径地址
        string path = p.Server.MapPath("~/" + vd.VIRTUAL_DIR_NAME) + "\\" + c3Alarm.Alarm_Aux.SAMPLE_DETAIL_NAME + "\\" + c3Alarm.CODE_NAME + "\\" + c3Alarm.RAISED_TIME.ToString("yyyyMMdd") + "_" + (c3Alarm.ORG_CODE == null ? c3Alarm.P_ORG_NAME : c3Alarm.ORG_NAME) + "_" + c3Alarm.CODE_NAME + "_" + c3Alarm.DETECT_DEVICE_CODE + "\\";
        c3Alarm.MY_STR_2 = path;

        System.Security.Principal.WindowsIdentity obj = System.Security.Principal.WindowsIdentity.GetCurrent();



        string host = HttpContext.Current.Request.Url.Host + ":" + HttpContext.Current.Request.Url.Port + "/";
        c3Alarm.MY_STR_3 = host;


        sc.C3Alarm = c3Alarm;
        sc.context = context;
        sc.WI = obj;

        Thread sub = new Thread(chushi);
        sub.Start(sc);//开始

    }

    public void chushi(object c3alarm)
    {

        Special_class s_c = new Special_class();
        s_c = (Special_class)c3alarm;


        C3_Alarm c3Alarm = s_c.C3Alarm;

        System.Security.Principal.WindowsIdentity.Impersonate(s_c.WI.Token);
        //在指定位置创建文件夹

        //文件存放路径
        string path = c3Alarm.MY_STR_2;

        if (!System.IO.Directory.Exists(path))
        {
            System.IO.Directory.CreateDirectory(path);
        }

        //保存MFC3到指定位置
        package(s_c, path);

        //将报警的报告保存至指定位置
        int loopCount = 0;
        line1: string url = c3Alarm.MY_STR_1;

        if (!string.IsNullOrEmpty(url))
        {
            string[] urlArr = url.Split('\\');
            HttpWebRequest request = (HttpWebRequest)FileWebRequest.Create(@"http://" + c3Alarm.MY_STR_3.ToString().Remove(c3Alarm.MY_STR_3.Length-1) + url);
            HttpWebResponse response = request.GetResponse() as HttpWebResponse;
            Stream responseStream = response.GetResponseStream();
            Stream stream = new FileStream(path + urlArr[urlArr.Length - 1], FileMode.Create);
            byte[] bArr = new byte[1024];
            int size = responseStream.Read(bArr, 0, bArr.Length);
            while (size > 0)
            {
                stream.Write(bArr, 0, size);
                size = responseStream.Read(bArr, 0, bArr.Length);
            }
            stream.Close();
            responseStream.Close();
        }
        else
        {
            //loopCount++;
            //if (loopCount <= 5)
            //{
            //    Thread.Sleep(3 * 1000);//若缺陷报告未生成，则重复请求5次，每次等待3秒钟
            //    goto line1;
            //}
            //else
            {
                log4net.ILog log = log4net.LogManager.GetLogger("报警ID=" + c3Alarm.ID);
                log.Error("样本库，请求缺陷报告出错.");
            }

        }
    }

    #region 下载MFC3文件
    public void package(Special_class sc, string path)
    {
        HttpContext p = sc.context;
        C3_Alarm m_alarm = sc.C3Alarm;

        if ((m_alarm.SVALUE1.ToUpper()).IndexOf(".MFC3") > -1)
        {
            string Url = "";
            if ((m_alarm.DIR_PATH).IndexOf("/FtpRoot") > -1)
            {
                Url = m_alarm.DIR_PATH + m_alarm.SVALUE1;
            }
            else if ((m_alarm.DIR_PATH).IndexOf("FtpRoot") > -1)
            {
                Url = "/" + m_alarm.DIR_PATH + m_alarm.SVALUE1;
            }
            else
            {
                Url = "/FtpRoot/" + m_alarm.DIR_PATH + m_alarm.SVALUE1;
            }

            Url = Url.Replace("#", "%23");

            //Response.Redirect(Url);
        }
        else
        {
            string saveFile = m_alarm.DETECT_DEVICE_CODE + "_" + m_alarm.RAISED_TIME.ToString("yyyyMMddhhmmss") + ".zip";

            MemoryStream ms = new MemoryStream();
            byte[] buffer = null;
            int size = 0;
            using (ZipFile file = ZipFile.Create(ms))
            {
                file.BeginUpdate();
                file.NameTransform = new MyNameTransfom();//通过这个名称格式化器，可以将里面的文件名进行一些处理。默认情况下，会自动根据文件的路径在zip中创建有关的文件夹。


                //file.Add(Server.MapPath("~/re.aspx"));
                //file.Add(Server.MapPath("~/a.aspx"));
                //file.Add(Server.MapPath("~/FtpRoot_20160222/3C/CRH2A-2222/2016-01-17/20160117103243_1_CRH2A-2234_720_0_A/20160117103243_1_CRH2A-2234_720_0_A_IRV1.JPG"));
                //file.Add(Server.MapPath("~/FtpRoot_20160222/3C/CRH2A-2222/2016-01-17/20160117103243_1_CRH2A-2234_720_0_A/20160117103243_1_CRH2A-2234_720_0_A_IRV2.JPG"));
                //\\192.168.1.249\e\3C数据备份及转发\6CFilesBak\3C\CRH2A-2222\2016-01-17




                if (m_alarm != null)
                {

                    string dir = m_alarm.SVALUE1;// "/Ftp_bak/3C/CRH2A-2222/2016-01-17/";
                    string tempName = m_alarm.SVALUE14;// "20160117103243_9_CRH2A-2234_720_0_A.scs";



                    tempName = tempName.Replace("_9_", "_#序号#_").Replace(".scs", ".#扩展名#");  // "20160117103243_#序号#_CRH2A-2234_720_0_A.#扩展名#";


                    saveFile = tempName.Replace("#序号#", "1").Replace("#扩展名#", "MFC3"); //下载文件名，固定格式。

                    string tempFullName = dir + tempName;
                    string http = ConfigurationManager.AppSettings["RootDomain"];
                    if (string.IsNullOrEmpty(http))
                    {
                        http = "http://" + m_alarm.MY_STR_3;
                    }
                    else
                    {
                        http = http + "/";
                    }
                    string url = http + tempFullName;

                    addfile(file, p.Server.MapPath("~/" + tempFullName.Replace("#序号#", "9").Replace("#扩展名#", "scs")), (url.Replace("#序号#", "9").Replace("#扩展名#", "scs")));
                    addfile(file, p.Server.MapPath("~/" + tempFullName.Replace("#序号#", "9").Replace("#扩展名#", "tax")), (url.Replace("#序号#", "9").Replace("#扩展名#", "tax")));
                    addfile(file, p.Server.MapPath("~/" + tempFullName.Replace("#序号#", "1").Replace("#扩展名#", "dlv")), (url.Replace("#序号#", "1").Replace("#扩展名#", "dlv")));
                    addfile(file, p.Server.MapPath("~/" + tempFullName.Replace("#序号#", "1").Replace("#扩展名#", "dlv.IDX")), (url.Replace("#序号#", "1").Replace("#扩展名#", "dlv.IDX")));
                    addfile(file, p.Server.MapPath("~/" + tempFullName.Replace("#序号#", "1").Replace("#扩展名#", "IRV")), (url.Replace("#序号#", "1").Replace("#扩展名#", "IRV")));//破解机车红外文件

                    addfile(file, p.Server.MapPath("~/" + tempFullName.Replace("#序号#", "2").Replace("#扩展名#", "mv")), (url.Replace("#序号#", "2").Replace("#扩展名#", "mv")));
                    addfile(file, p.Server.MapPath("~/" + tempFullName.Replace("#序号#", "2").Replace("#扩展名#", "mv.IDX")), (url.Replace("#序号#", "2").Replace("#扩展名#", "mv.IDX")));

                    addfile(file, p.Server.MapPath("~/" + tempFullName.Replace("#序号#", "3").Replace("#扩展名#", "mv")), (url.Replace("#序号#", "3").Replace("#扩展名#", "mv")));
                    addfile(file, p.Server.MapPath("~/" + tempFullName.Replace("#序号#", "3").Replace("#扩展名#", "mv.IDX")), (url.Replace("#序号#", "3").Replace("#扩展名#", "mv.IDX")));

                    addfile(file, p.Server.MapPath("~/" + tempFullName.Replace("#序号#", "4").Replace("#扩展名#", "mv")), (url.Replace("#序号#", "4").Replace("#扩展名#", "mv")));
                    addfile(file, p.Server.MapPath("~/" + tempFullName.Replace("#序号#", "4").Replace("#扩展名#", "mv.IDX")), (url.Replace("#序号#", "4").Replace("#扩展名#", "mv.IDX")));

                    file.CommitUpdate();

                    buffer = new byte[ms.Length];
                    ms.Position = 0;
                    size = ms.Read(buffer, 0, buffer.Length);
                }

            }

            Stream stream = new FileStream(path + saveFile, FileMode.Create);

            while (size > 0)
            {
                stream.Write(buffer, 0, size);
                size = ms.Read(buffer, 0, buffer.Length);
            }
            stream.Close();
            ms.Close();
        }
    }

    public void addfile(ZipFile file, string FileURL, string WebURL)
    {

        try
        {
            if (!WebURL.Contains("http://"))
            {
                WebURL = "http://" + WebURL;
            }
            string url = (WebURL.Replace("\\", "/")).Replace("#", "%23");
            log4net.ILog log3 = log4net.LogManager.GetLogger("下载MFC3");
            log3.Info("添加文件,本地:" + FileURL);
            log3.Info("添加文件,网络:" + url);
            if (RemoteFileExists(url))
            {
                file.Add(FileURL);
            }
            else
            {
                log4net.ILog log2 = log4net.LogManager.GetLogger("下载MFC3");
                log2.Info("无文件：" + FileURL);
            }
        }

        catch (Exception ex)
        {
            log4net.ILog log2 = log4net.LogManager.GetLogger("下载MFC3");
            log2.Error("添加文件出错" + FileURL, ex);
        }

    }

    public bool RemoteFileExists(string fileUrl)
    {
        try
        {
            HttpWebRequest re = (HttpWebRequest)WebRequest.Create(fileUrl);
            HttpWebResponse res = (HttpWebResponse)re.GetResponse();
            log4net.ILog log2 = log4net.LogManager.GetLogger("下载MFC3");
            log2.Error("判断远程文件存在与否" + fileUrl);
            log2.Error("判断远程文件存在与否res.ContentLength" + res.ContentLength);
            if (res.ContentLength != 0)
            {
                return true;
            }
        }
        catch (Exception ex)
        {

            return false;
        }
        return false;
    }
    public class MyNameTransfom : ICSharpCode.SharpZipLib.Core.INameTransform
    {

        #region INameTransform 成员

        public string TransformDirectory(string name)
        {
            return null;
        }

        public string TransformFile(string name)
        {
            return Path.GetFileName(name);
        }

        #endregion
    }
    #endregion



    public bool IsReusable {
        get {
            return false;
        }
    }

}

public class Special_class
{
    public System.Security.Principal.WindowsIdentity WI;

    public C3_Alarm C3Alarm;

    public HttpContext context;
}