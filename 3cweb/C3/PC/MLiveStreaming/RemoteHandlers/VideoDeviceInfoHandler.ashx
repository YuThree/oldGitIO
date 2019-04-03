<%@ WebHandler Language="C#" Class="VideoDeviceInfoHandler" %>

using System;
using System.Web;
using System.Net;
using System.IO;
using System.Text;
using System.Collections.Generic;

public class VideoDeviceInfoHandler : ReferenceClass, IHttpHandler
{

    private DPC.AM.AMF.PROTOCOL.SocketService socketService = new DPC.AM.AMF.PROTOCOL.SocketService();
    private System.Text.StringBuilder reqCmd = new System.Text.StringBuilder();
    private String _ipAddr;
    public VideoDeviceInfoHandler() : base()
    {
        string videoIPServer = Api.Util.Common.getParamterInfo("VideoIPServer").VALUE;
        string[] ipPort = videoIPServer.Split(':');
        socketService.ip = ipPort[0];
        socketService.port = int.Parse(ipPort[1]);
    }
    public void ProcessRequest(HttpContext context)
    {

        string type = HttpContext.Current.Request["type"];
        switch (type)
        {
            case "getLocomotiveVideoInfo":
                getLocomotiveVideoInfo();
                break;
            case "getLocomotiveVideoInfo_GT":
                getLocomotiveVideoInfo_GT();
                break;
            case "getTodayRunningStatus":
                getTodayRunningStatus();
                break;
            case "updatePlayStatus":
                updatePlayStatus();
                break;
            case "GetTimes"://得到历史播放，
                GetTimes();
                break;
            case "SetHistoryStartTime":
                SetHistoryStartTime();
                break;
            case "SetHistoryPastTime"://设置播放向后的秒数，
                SetHistoryPastTime();
                break;
            case "getOnlineLoco":
                getOnlineLoco();
                break;
            case "getOnlineLoco_json":
                getOnlineLoco_json();
                break;
            case "SetRec_DC"://动车，设置图像质量
                SetRec_DC();
                break;
            default:
                break;
        }

    }

    public void SetRec_DC()
    {
        string ip = HttpContext.Current.Request["ip"];
        string type = HttpContext.Current.Request["typeN"];
        string url = "http://" + ip + "/user.do?action=SetHistoryPlayConfig&type=" + type + "&tid=" + DateTime.Now;
        string re = HttpGet(url, "");

    }


    public void getOnlineLoco()
    {
        List<LocaStatus> locolist_online = PublicMethod.GetOnlineLoco();

        StringBuilder re = new StringBuilder();
        if (locolist_online != null && locolist_online.Count > 0)
        {
            foreach (LocaStatus item in locolist_online)
            {
                re.Append(item.car + ",");
            }
        }
        HttpContext.Current.Response.Write(re.ToString());
    }
    public void getOnlineLoco_json()
    {
        List<LocaStatus> locolist_online = PublicMethod.GetOnlineLoco();

        StringBuilder re = new StringBuilder();
        re.Append("{\"data\":[");
        if (locolist_online != null && locolist_online.Count > 0)
        {
            for (int i = 0; i < locolist_online.Count; i++)
            {
                re.Append("\"" + locolist_online[i].car.Replace("#","%23") + "\"");
                if (i < locolist_online.Count - 1)
                {
                    re.Append(",");
                }
            }
        }
        re.Append("]}");
        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(re.ToString());
    }



    public string HttpGet(string Url, string postDataStr)
    {
        HttpWebRequest request = (HttpWebRequest)WebRequest.Create(Url + (postDataStr == "" ? "" : "?") + postDataStr);
        request.Method = "GET";
        request.ContentType = "text/html";

        HttpWebResponse response = (HttpWebResponse)request.GetResponse();
        Stream myResponseStream = response.GetResponseStream();
        StreamReader myStreamReader = new StreamReader(myResponseStream, Encoding.Default);
        string retString = myStreamReader.ReadToEnd();
        myStreamReader.Close();
        myResponseStream.Close();

        return retString;
    }

    public void SetHistoryStartTime()
    {
        string ip = HttpContext.Current.Request["ip"];
        string start_time = HttpContext.Current.Request["start_time"];
        string url = "http://" + ip + "/user.do?action=SetHistoryStartTime&start_time=" + start_time + "&tid=" + DateTime.Now;

        string re = HttpGet(url, "");
        HttpContext.Current.Response.Write(re);

    }

    private void GetTimes()
    {
        //http://36.98.159.136:8080/user.do?action=GetHistoryDatas&tid=1111
        string ip = HttpContext.Current.Request["ip"];
        string url = "http://" + ip + "/user.do?action=GetHistoryDatas&tid=" + DateTime.Now;

        string re = HttpGet(url, "");
        HttpContext.Current.Response.Write(re);


    }

    private void SetHistoryPastTime()
    {
        string ip = HttpContext.Current.Request["ip"];
        string past_time = HttpContext.Current.Request["past_time"];
        string url = "http://" + ip + "/user.do?action=SetHistoryPastTime&past_time=" + past_time + "&tid=" + DateTime.Now;

        string re = HttpGet(url, "");
        HttpContext.Current.Response.Write(re);
    }

    private void updatePlayStatus()
    {
        //设备号
        string locomotiveCode = HttpContext.Current.Request["locomotiveCode"];
        string terminalSeq = HttpContext.Current.Request["terminalSeq"];
        string newStatus = HttpContext.Current.Request["newStatus"];
        string userName = Api.Util.Public.GetLoginID;
        string ip = Api.Util.Public.GetLoginIP;
        Api.Foundation.entity.Foundation.VideoDeviceInfo vdi = Api.ServiceAccessor.GetFoundationService().getVideoDevices(locomotiveCode, uint.Parse(terminalSeq));
        vdi.IP_ADDR = _ipAddr;//机车动态IP
        vdi.LOCOMOTIVE_CODE = locomotiveCode;
        vdi.TERMINAL_SEQUENCE = uint.Parse(terminalSeq);
        vdi.IS_PLAYING = uint.Parse(newStatus);
        vdi.LAST_ACCESS_USER = userName;
        vdi.LAST_ACCESS_IP = ip;
        vdi.LAST_PLAY_TIME = DateTime.Now;
        vdi.LAST_ACCESS_MODE = 1;

        string jsonC3Sms = "{}";
        Api.ServiceAccessor.GetFoundationService().updateVideoDeivce(vdi);


        HttpContext.Current.Response.ContentType = "text/plain";
        HttpContext.Current.Response.Write(Newtonsoft.Json.JsonConvert.DeserializeObject(jsonC3Sms));

    }
    private void getTodayRunningStatus()
    {
        //设备号
        string locomotiveCode = HttpContext.Current.Request["locomotiveCode"];

        Api.Fault.entity.sms.C3_SmsCond condition = new Api.Fault.entity.sms.C3_SmsCond();
        condition.LOCOMOTIVE_CODE = locomotiveCode;
        condition.startTime = DateTime.Now.Date;
        condition.orderBy = " DETECT_TIME desc ";
        string jsonC3Sms = "{}";
        System.Collections.Generic.IList<Api.Fault.entity.sms.C3_Sms> smsList = Api.ServiceAccessor.GetSmsService().getC3SmsbyCondition(condition);
        if (smsList.Count > 0)
        {
            jsonC3Sms = "[{"
                + "'DETECT_TIME':'" + smsList[0].DETECT_TIME + "',"
                + "'CROSSING_NO':'" + smsList[0].ROUTING_NO + "',"
                + "'AREA_SECTION':'" + Api.Util.Common.getRoutingInfo(smsList[0].BUREAU_CODE + smsList[0].ROUTING_NO).AREA_SECTION + "',"
                + "'TRAIN_NUMBER':'" + smsList[0].LOCOMOTIVE_CODE + "',"
                + "'DRIVER_NO':'" + smsList[0].DRIVER_NO + "',"
                + "}]";
        }

        HttpContext.Current.Response.ContentType = "text/plain";
        HttpContext.Current.Response.Write(Newtonsoft.Json.JsonConvert.DeserializeObject(jsonC3Sms));

    }
    private void getLocomotiveVideoInfo()
    {
        //设备号
        string locomotiveCode = HttpContext.Current.Request["locomotiveCode"];
        //视频设备序号
        string terminalSeq = HttpContext.Current.Request["terminalSeq"];
        string jsonResp = string.Empty;
        Api.Foundation.entity.Foundation.VideoDeviceInfo vdi = Api.ServiceAccessor.GetFoundationService().getVideoDevices(locomotiveCode, uint.Parse(terminalSeq));

        string ip;

        if (vdi.VIDEO_VENDOR == "HIKVISION")
        {
            //科易版，要取重新取ip    
            ip = getIP(locomotiveCode, terminalSeq);
            if (ip != null && !ip.Equals(string.Empty))
            {
                vdi.IP_ADDR = ip;
                _ipAddr = ip;
            }
        }

        jsonResp = "{\"LOCOMOTIVE_CODE\":\"" + vdi.LOCOMOTIVE_CODE + "\","               //设备号
                                + "\"TERMINAL_SEQUENCE\":\"" + vdi.TERMINAL_SEQUENCE + "\","
                                + "\"VIDEO_TYPE\":\"" + vdi.VIDEO_TYPE + "\","
                                + "\"VIDEO_VENDOR\":\"" + vdi.VIDEO_VENDOR + "\","
                                + "\"VIDEO_MODEL\":\"" + vdi.VIDEO_MODEL + "\","
                                + "\"IP_ADDR\":\"" + vdi.IP_ADDR + "\","
                                + "\"PORT\":\"" + vdi.PORT + "\","
                                + "\"HTTP_PORT\":\"" + vdi.HTTP_PORT + "\","
                                + "\"RTSP_PORT\":\"" + vdi.RTSP_PORT + "\","
                                + "\"USER_NAME\":\"" + vdi.USER_NAME + "\","
                                + "\"PASSWORD\":\"" + vdi.PASSWORD + "\","
                                + "\"CHANNEL_NO\":\"" + vdi.CHANNEL_NO + "\","
                                + "\"STREAM_TYPE\":\"" + vdi.STREAM_TYPE + "\","
                                + "\"DEFAULT_WINDOW_NO\":\"" + vdi.DEFAULT_WINDOW_NO + "\","
                                + "\"IS_PLAYING\":\"" + vdi.IS_PLAYING + "\","
                                + "\"LAST_ACCESS_IP\":\"" + vdi.LAST_ACCESS_IP + "\","
                                + "\"LAST_ACCESS_USER\":\"" + vdi.LAST_ACCESS_USER + "\","
                                ;
        jsonResp += "}";

        HttpContext.Current.Response.ContentType = "text/plain";
        HttpContext.Current.Response.Write(Newtonsoft.Json.JsonConvert.DeserializeObject(jsonResp));

    }


    private void getLocomotiveVideoInfo_GT()
    {
        //设备号
        string locomotiveCode = HttpContext.Current.Request["locomotiveCode"];
        System.Text.StringBuilder re = new System.Text.StringBuilder();

        Api.Foundation.entity.Foundation.Locomotive m_loco = Api.Util.Common.getLocomotiveInfo(locomotiveCode);

        Api.Foundation.entity.Cond.VideoDeviceInfoCond cond_v = new Api.Foundation.entity.Cond.VideoDeviceInfoCond();
        cond_v.LOCOMOTIVE_CODE = locomotiveCode;
        System.Collections.Generic.IList<Api.Foundation.entity.Foundation.VideoDeviceInfo> vdis = Api.ServiceAccessor.GetFoundationService().queryVideoDevices(cond_v);
        if (vdis.Count > 0)
        {
            re.Append("{");//只加一次.
            re.AppendFormat("\"DEVICE_VERSION\":\"{0}\",", m_loco.DEVICE_VERSION);
            re.AppendFormat("\"LOCOMOTIVE_CODE\":\"{0}\",", locomotiveCode);
            re.AppendFormat("\"VIDEO_VENDOR\":\"{0}\",", vdis[0].VIDEO_VENDOR);

            foreach (Api.Foundation.entity.Foundation.VideoDeviceInfo vdi in vdis)
            {
                if (vdi.TERMINAL_SEQUENCE == 1)
                {
                    re.AppendFormat("\"ip_A\":\"{0}\",", vdi.IP_ADDR);
                    re.AppendFormat("\"HTTP_PORT_A\":\"{0}\",", vdi.HTTP_PORT);

                    bool isOnline = Ping(vdi.IP_ADDR);
                    re.AppendFormat("\"online\":\"{0}\",", isOnline);
                }
                else if (vdi.TERMINAL_SEQUENCE == 2)
                {
                    re.AppendFormat("\"ip_B\":\"{0}\",", vdi.IP_ADDR);
                    re.AppendFormat("\"HTTP_PORT_B\":\"{0}\",", vdi.HTTP_PORT);
                }
            }
            re.Append("}");
        }
        else
        {
            //无配置信息
            //车辆类型查询，动车，全部统一一种显示模式。GT2-HIKVISION-DC

            if (m_loco != null)
            {
                string ip = "WebGetIP", realIP = "", vpnIP = "", ip2 = "";
                bool online = false;



                if (m_loco.DEVICE_VERSION == "GT3")
                {
                    List<LocaStatus> listlocaStatus = PublicMethod.GetOnlineLoco(m_loco.LOCOMOTIVE_CODE);
                    // LocaStatus m_locaStatus_B = PublicMethod.GetRealIP(m_loco.LOCOMOTIVE_CODE + "_B");

                    //  ip = string.IsNullOrEmpty(m_locaStatus_A.videoaddr) ? m_locaStatus_A.ip + ":8080" : m_locaStatus_A.videoaddr;
                    //   ip2 = string.IsNullOrEmpty(m_locaStatus_B.videoaddr) ? m_locaStatus_B.ip + ":8080" : m_locaStatus_B.videoaddr;

                    re.Append("{");
                    re.AppendFormat("\"DEVICE_VERSION\":\"{0}\",", m_loco.DEVICE_VERSION);
                    re.AppendFormat("\"LOCOMOTIVE_CODE\":\"{0}\",", locomotiveCode);
                    re.AppendFormat("\"VIDEO_VENDOR\":\"{0}\",", "GT2-HIKVISION-DC");
                    re.AppendFormat("\"HTTP_PORT_A\":\"{0}\",", "");
                    for (int i = 0; i < listlocaStatus.Count; i++)
                    {
                        string code = "";
                        if (listlocaStatus[i].car.Split('#').Length > 1)
                        {
                            code = listlocaStatus[i].car.Split('#')[1];
                        }
                        else {
                            if (listlocaStatus[i].car.Contains("_"))
                                code = listlocaStatus[i].car.Split('_')[1];
                        }
                        re.AppendFormat("\"ip{0}\":\"{1}\",\"car{2}\":\"{3}\",", code, string.IsNullOrEmpty(listlocaStatus[i].videoaddr) ? listlocaStatus[i].ip + ":8080" : listlocaStatus[i].videoaddr,code,listlocaStatus[i].car);
                    }
                    re.AppendFormat("\"ip_B\":\"{0}\",", ip2);
                    re.AppendFormat("\"HTTP_PORT_B\":\"{0}\",", "");
                    re.AppendFormat("\"online\":\"{0}\",", listlocaStatus[0].online);
                    re.Append("}");

                }
                else
                {
                    LocaStatus m_locaStatus = PublicMethod.GetRealIP(m_loco.LOCOMOTIVE_CODE);

                    if (m_locaStatus != null)
                    {
                        ip = m_locaStatus.ip;
                        realIP = m_locaStatus.ip;
                        vpnIP = m_locaStatus.vpnip;
                        online = m_locaStatus.online;


                        if (vpnIP != "" && Ping(vpnIP)) //未通过，使用vpnIP连接测试。 
                        {
                            ip = vpnIP +":8080";
                        }
                        else if ( realIP != "" && Ping(realIP))
                        {
                            //真实ip 连接测试。 
                            ip = realIP + ":8080";
                        }

                        //自研机车
                        re.Append("{");
                        re.AppendFormat("\"DEVICE_VERSION\":\"{0}\",", m_loco.DEVICE_VERSION);
                        re.AppendFormat("\"LOCOMOTIVE_CODE\":\"{0}\",", locomotiveCode);
                        re.AppendFormat("\"VIDEO_VENDOR\":\"{0}\",", "GT2-HIKVISION");
                        re.AppendFormat("\"ip_A\":\"{0}\",", ip);
                        re.AppendFormat("\"HTTP_PORT_A\":\"{0}\",", "");
                        re.AppendFormat("\"ip_B\":\"{0}\",", ip);
                        re.AppendFormat("\"HTTP_PORT_B\":\"{0}\",", "");
                        re.AppendFormat("\"online\":\"{0}\",", online);
                        re.Append("}");
                    }
                }
            }
        }

        HttpContext.Current.Response.ContentType = "text/plain";
        HttpContext.Current.Response.Write(Newtonsoft.Json.JsonConvert.DeserializeObject(re.ToString()));

    }



    private string getIP(string locomotiveCode, string terminalSeq)
    {
        reqCmd.Append("REQADDR").Append(locomotiveCode).Append(":").Append(terminalSeq).Append("#");
        string socketRetMsg = string.Empty;
        try
        {
            socketService.connect();
            socketService.sendMsg(reqCmd.ToString());
            socketRetMsg = socketService.recvedString;
        }
        catch (Exception ex) { }
        finally
        {
            socketService.close();
        }

        if (socketRetMsg.StartsWith("RESPSucc"))
        {
            string[] sArray = socketRetMsg.Split(':');
            return sArray[0].Substring(8);
        }
        else
        {
            return String.Empty;
        }

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



    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}
