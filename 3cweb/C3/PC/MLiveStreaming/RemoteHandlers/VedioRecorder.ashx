<%@ WebHandler Language="C#" Class="VedioRecorder" %>

using System;
using System.Web;
using System.Data;
using System.Text;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

public class VedioRecorder : ReferenceClass, IHttpHandler {

    public void ProcessRequest (HttpContext context) {


        string action = HttpContext.Current.Request["action"];
        try
        {
            switch (action)
            {
                case "creat":
                    CreatVedioTask();
                    break;
                case "query":
                    QueryTask();
                    break;
                case "playquery":
                    PlayQuery();
                    break;
                case"getOrigin":
                    GetOriginalFile();
                    break;
                default:
                    break;
            }
        }
        catch (Exception ex)
        {

            log4net.ILog log = log4net.LogManager.GetLogger("视频录制回放出错，action="+action);
            log.Error("执行出错", ex);
        }

    }
    /// <summary>
    /// 新建录像任务
    /// </summary>
    public void CreatVedioTask()
    {
        string LOCOMOTIVE_CODE = HttpContext.Current.Request["LOCOMOTIVE_CODE"];//车号
        string LINE_NAME = HttpContext.Current.Request["LINE_NAME"];//线路名
        string LINE_CODE = HttpContext.Current.Request["LINE_CODE"];//线路编码
        string DIRECTION = HttpContext.Current.Request["DIRECTION"];//行别
        string title = HttpContext.Current.Request["title"];//标题
        string starttime = HttpContext.Current.Request["starttime"];//开始时间
        string endtime = HttpContext.Current.Request["endtime"];//结束时间
        string IR = HttpContext.Current.Request["IR"];//红外通道标识
        string Detail = HttpContext.Current.Request["Detail"];//局部通道标识
        string PANORAMA = HttpContext.Current.Request["PANORAMA"];//全景通道标识
        string AUX = HttpContext.Current.Request["AUX"];//辅助通道标识
        string BowPostition = string.IsNullOrEmpty(HttpContext.Current.Request["BowPostition"])?"":HttpContext.Current.Request["BowPostition"].Replace("%23","#");//弓位置

        int i = ADO.VedioDownload.CreatTask(title,LINE_CODE,LINE_NAME,DIRECTION,LOCOMOTIVE_CODE,starttime,endtime,null,IR,Detail,PANORAMA,AUX,BowPostition);

        HttpContext.Current.Response.Write(i);
    }
    /// <summary>
    /// 查询任务
    /// </summary>
    public void QueryTask()
    {
        string LOCOMOTIVE_CODE = HttpContext.Current.Request["LOCOMOTIVE_CODE"];//车号
        string title = HttpContext.Current.Request["title"];//标题
        string LINE_CODE = HttpContext.Current.Request["LINE_CODE"];//线路编码
        string DIRECTION = HttpContext.Current.Request["DIRECTION"];//行别
        int pageIndex = string.IsNullOrEmpty(HttpContext.Current.Request["pageIndex"])?0:Convert.ToInt32(HttpContext.Current.Request["pageIndex"]);//当前页
        int pageSize = string.IsNullOrEmpty(HttpContext.Current.Request["pageSize"]) ? 0 : Convert.ToInt32(HttpContext.Current.Request["pageSize"]);//页大小

        DataTable dt = ADO.VedioDownload.QueryTaskList(title, LOCOMOTIVE_CODE, LINE_CODE, DIRECTION, pageSize, pageIndex);
        DataTable dt_b = ADO.VedioDownload.TaskProgressBar(title, LOCOMOTIVE_CODE, LINE_CODE, DIRECTION);

        string json = getTaskJson(dt,dt_b, pageSize, pageIndex);//转换为json

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);

    }
    /// <summary>
    /// 查询播放用相关信息
    /// </summary>
    public void PlayQuery()
    {
        string TaskID = HttpContext.Current.Request["TaskID"];
        DataTable dt = ADO.VedioDownload.VedioPlay(TaskID);

        string json = getPlayJson(dt);

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }
    /// <summary>
    /// 获取任务列表json
    /// </summary>
    /// <param name="dt">其他信息数据源</param>
    /// <param name="dt_b">进度相关信息数据源</param>
    /// <param name="pageSize">页大小</param>
    /// <param name="pageIndex">当前页</param>
    /// <returns>任务列表json</returns>
    public string getTaskJson(DataTable dt,DataTable dt_b, int pageSize, int pageIndex)
    {
        StringBuilder json = new StringBuilder();
        json.Append("{\"data\":[");
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            DateTime Record_StartDate = new DateTime();
            DateTime Record_EndDate = new DateTime();
            double total = Convert.ToDouble(0);
            json.Append("{\"ID\":\"" + dt.Rows[i]["ID"] + "\",");//任务ID
            json.Append("\"TITLE\":\"" + dt.Rows[i]["TITLE"] + "\",");//标题
            json.Append("\"LOCOMOTIVE_CODE\":\"" + dt.Rows[i]["LOCOMOTIVE_CODE"] + "\",");//车号
            json.Append("\"LINE_NAME\":\"" + dt.Rows[i]["LINE_NAME"] + "\",");//线路名
            json.Append("\"DIRECTION\":\"" + dt.Rows[i]["DIRECTION"] + "\",");//行别

            if (!string.IsNullOrEmpty(dt.Rows[i]["Record_StartDate"].ToString()))
            {
                Record_StartDate = Convert.ToDateTime(dt.Rows[i]["Record_StartDate"]);
                json.Append("\"Record_StartDate\":\"" + Record_StartDate.ToString("yyyy-MM-dd HH:mm:ss") + "\",");//录制开始时间
            }
            else
            {
                json.Append("\"Record_StartDate\":\"" + "" + "\",");
            }
            if (!string.IsNullOrEmpty(dt.Rows[i]["Record_EndDate"].ToString()))
            {
                Record_EndDate = Convert.ToDateTime(dt.Rows[i]["Record_EndDate"]);
                json.Append("\"Record_EndDate\":\"" + Record_EndDate.ToString("yyyy-MM-dd HH:mm:ss") + "\",");//录制结束时间
            }
            else
            {
                json.Append("\"Record_EndDate\":\"" + "" + "\",");
            }
            total = Convert.ToDouble((Record_EndDate - Record_StartDate).TotalSeconds);
            string taskid = dt.Rows[i]["ID"].ToString();
            string BowPosition = dt.Rows[i]["BowPosition"].ToString();
            int a = BowPosition.Split(Convert.ToChar(",")).Length;
            int count = 0;
            double  div = Convert.ToDouble(0);
            double  sum = Convert.ToDouble(0);
            for (int t = 0; t < dt_b.Rows.Count; t++)
            {
                if (taskid.Equals(dt_b.Rows[t]["ID"]))//匹配进度表
                {
                    if (!string.IsNullOrEmpty(dt_b.Rows[t]["CompletedDate_IR"].ToString()))
                    {
                        sum = sum + Convert.ToInt32((Convert.ToDateTime(dt_b.Rows[t]["CompletedDate_IR"]) - Record_StartDate).TotalSeconds);
                        div = div + 1;
                    }
                    if (!string.IsNullOrEmpty(dt_b.Rows[t]["CompletedDate_Detail"].ToString()))
                    {
                        sum = sum + Convert.ToInt32((Convert.ToDateTime(dt_b.Rows[t]["CompletedDate_Detail"]) - Record_StartDate).TotalSeconds);
                        div = div + 1;
                    }
                    if (!string.IsNullOrEmpty(dt_b.Rows[t]["CompletedDate_panorama"].ToString()))
                    {
                        sum = sum + Convert.ToInt32((Convert.ToDateTime(dt_b.Rows[t]["CompletedDate_panorama"]) - Record_StartDate).TotalSeconds);
                        div = div + 1;
                    }
                    if (!string.IsNullOrEmpty(dt_b.Rows[t]["CompletedDate_Aux"].ToString()))
                    {
                        sum = sum + Convert.ToInt32((Convert.ToDateTime(dt_b.Rows[t]["CompletedDate_Aux"]) - Record_StartDate).TotalSeconds);
                        div = div + 1;
                    }
                    count = count + 1;
                }
                if (a == count)
                {
                    break;
                }
            }
            if (count != 0 && div != Convert.ToDouble(0) && sum != Convert.ToDouble(0) && total != Convert.ToDouble(0))
            {
                json.Append("\"progress\":\"" + (sum / div / total*100).ToString("f2") + "\"}");
            }
            else
            {
                json.Append("\"progress\":\"" + 0 + "\"}");
            }



            if (i < dt.Rows.Count - 1)
            {
                json.Append(",");
            }
        }
        json.Append("]");
        int total_rows = dt.Rows.Count > 0 ? Convert.ToInt32(dt.Rows[0]["total"]) : 0;
        PageHelper page = new PageHelper();
        string pagejson = page.getPageJson(total_rows, pageIndex, pageSize);//拼接分页数据
        json.Append("," + pagejson + "}");
        return json.ToString();

    }
    /// <summary>
    ///获取播放用相关JSON
    /// </summary>
    /// <param name="dt">数据源</param>
    /// <returns>播放用相关信息</returns>
    public string getPlayJson(DataTable dt)
    {
        StringBuilder json = new StringBuilder();

        json.Append("{\"data\":[");
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            DateTime start = new DateTime();
            DateTime end = new DateTime();
            json.Append("{\"TITLE\":\"" + dt.Rows[i]["TITLE"] + "\",");//标题
            json.Append("\"LOCOMOTIVE_CODE\":\"" + dt.Rows[i]["LOCOMOTIVE_CODE"] + "\",");//车号
            json.Append("\"LINE_NAME\":\"" + dt.Rows[i]["LINE_NAME"] + "\",");//线路名
            json.Append("\"DIRECTION\":\"" + dt.Rows[i]["DIRECTION"] + "\",");//上行
            if (!string.IsNullOrEmpty(dt.Rows[i]["RECORD_STARTDATE"].ToString()))
            {
                start = Convert.ToDateTime(dt.Rows[i]["RECORD_STARTDATE"]);
                json.Append("\"RECORD_STARTDATE\":\"" + Convert.ToDateTime(dt.Rows[i]["RECORD_STARTDATE"]).ToString("yyyy-MM-dd HH:mm:ss") + "\",");//录制开始时间
                json.Append("\"RECORD_STARTDATE_DATE\":\"" + Convert.ToDateTime(dt.Rows[i]["RECORD_STARTDATE"]).Date.ToString("yyyyMMdd") + "\",");//
                json.Append("\"RECORD_STARTDATE_YEAR\":\"" + Convert.ToDateTime(dt.Rows[i]["RECORD_STARTDATE"]).Year.ToString().PadLeft(4, '0') + "\",");//
                json.Append("\"RECORD_STARTDATE_MONTH\":\"" + Convert.ToDateTime(dt.Rows[i]["RECORD_STARTDATE"]).Month.ToString().PadLeft(2, '0') + "\",");//
                json.Append("\"RECORD_STARTDATE_DAY\":\"" + Convert.ToDateTime(dt.Rows[i]["RECORD_STARTDATE"]).Day.ToString().PadLeft(2, '0') + "\",");//
                json.Append("\"RECORD_STARTDATE_HOUR\":\"" + Convert.ToDateTime(dt.Rows[i]["RECORD_STARTDATE"]).Hour.ToString().PadLeft(2, '0') + "\",");//
                json.Append("\"RECORD_STARTDATE_Minute\":\"" + Convert.ToDateTime(dt.Rows[i]["RECORD_STARTDATE"]).Minute.ToString().PadLeft(2, '0') + "\",");//
                json.Append("\"RECORD_STARTDATE_Second\":\"" + Convert.ToDateTime(dt.Rows[i]["RECORD_STARTDATE"]).Second.ToString().PadLeft(2, '0') + "\",");//
            }
            else
            {
                json.Append("\"RECORD_STARTDATE\":\"" + "" + "\",");//录制开始时间
                json.Append("\"RECORD_STARTDATE_DATE\":\"" + "" + "\",");//
                json.Append("\"RECORD_STARTDATE_YEAR\":\"" + Convert.ToDateTime(dt.Rows[i]["RECORD_STARTDATE"]).Hour.ToString().PadLeft(2, '0') + "\",");//
                json.Append("\"RECORD_STARTDATE_MONTH\":\"" + Convert.ToDateTime(dt.Rows[i]["RECORD_STARTDATE"]).Hour.ToString().PadLeft(2, '0') + "\",");//
                json.Append("\"RECORD_STARTDATE_DAY\":\"" + Convert.ToDateTime(dt.Rows[i]["RECORD_STARTDATE"]).Hour.ToString().PadLeft(2, '0') + "\",");//
                json.Append("\"RECORD_STARTDATE_HOUR\":\"" + "" + "\",");//
                json.Append("\"RECORD_STARTDATE_Minute\":\"" + "" + "\",");//
                json.Append("\"RECORD_STARTDATE_Second\":\"" + "" + "\",");//
            }
            if (!string.IsNullOrEmpty(dt.Rows[i]["RECORD_ENDDATE"].ToString()))
            {
                end = Convert.ToDateTime(dt.Rows[i]["RECORD_ENDDATE"]);
                json.Append("\"RECORD_ENDDATE\":\"" + Convert.ToDateTime(dt.Rows[i]["RECORD_ENDDATE"]).ToString("yyyy-MM-dd HH:mm:ss") + "\",");//录制结束时间
            }
            else
            {
                json.Append("\"RECORD_ENDDATE\":\"" + "" + "\",");//录制结束时间
            }
            if (!string.IsNullOrEmpty(start.ToString()) && !string.IsNullOrEmpty(end.ToString()))
            {
                json.Append("\"TIME_DIFFERENCE\":\"" + (end - start).TotalMilliseconds + "\",");
            }
            else
            {
                json.Append("\"TIME_DIFFERENCE\":\"" + "" + "\",");
            }
            json.Append("\"TIME_DELAY\":\"" + (string.IsNullOrEmpty(dt.Rows[i]["TIME_DELAY"].ToString())?"":dt.Rows[i]["TIME_DELAY"].ToString().PadLeft(3,'0')) + "\",");//采集时间间隔
            json.Append("\"BowPosition\":\"" +  (string.IsNullOrEmpty(dt.Rows[i]["BowPosition"].ToString())?"":dt.Rows[i]["BowPosition"].ToString().Replace("#","%23")) + "\",");//弓位置（合集）
            json.Append("\"IsSave_IR\":\"" + dt.Rows[i]["IsSave_IR"] + "\",");//红外采集标志
            json.Append("\"IsSave_Detail\":\"" + dt.Rows[i]["IsSave_Detail"] + "\",");//局部采集标志
            json.Append("\"IsSave_panorama\":\"" + dt.Rows[i]["IsSave_panorama"] + "\",");//全景采集标志
            json.Append("\"IsSave_Aux\":\"" + dt.Rows[i]["IsSave_Aux"] + "\",");//辅助采集标志
            json.Append("\"VirtualDirectory\":\"" + dt.Rows[i]["VirtualDirectory"] + "\",");//虚拟目录名
            json.Append("\"IsComplete\":\"" + dt.Rows[i]["IsComplete"] + "\",");//是否完成

            string BowPosition1 = dt.Rows[i]["BowPosition1"].ToString();
            string DEVICE_BOW_RELATIONS = dt.Rows[i]["DEVICE_BOW_RELATIONS"].ToString();
            int BowPositionNumber = 0;
            try
            {
                if (!string.IsNullOrEmpty(BowPosition1) && !string.IsNullOrEmpty(DEVICE_BOW_RELATIONS))
                {
                    if (BowPosition1.Contains("#"))
                    {
                        string[] Array = DEVICE_BOW_RELATIONS.Split('#');
                        int a = Convert.ToInt32(BowPosition1.Substring(1, 1))-1;
                        string b = BowPosition1.Substring(3, 1);
                        int c = 0;
                        if (b == "A")
                        {
                            c = 0;
                        }
                        else if (b == "B")
                        {
                            c = 1;
                        }
                        string ss = Array[a];
                        string str = Array[a].Substring(2, Array[a].Length - 2);
                        string[] strlist = str.Split(',');
                        BowPositionNumber = Convert.ToInt32(strlist[c]);
                    }
                    else
                    {
                        string b = BowPosition1.Substring(1, 1);
                        int c = 0;
                        if (b == "A")
                        {
                            c = 0;
                        }
                        else if (b == "B")
                        {
                            c = 1;
                        }
                        string str = DEVICE_BOW_RELATIONS.Substring(2, DEVICE_BOW_RELATIONS.Length - 2);
                        string[] strlist = str.Split(',');
                        BowPositionNumber = Convert.ToInt32(strlist[c]);
                    }
                    json.Append("\"BowPositionNumber\":\"" + BowPositionNumber + "\",");
                }
                else
                {
                    json.Append("\"BowPositionNumber\":\"" + "" + "\",");
                }
            }
            catch (Exception)
            {

                json.Append("\"BowPositionNumber\":\"" + "" + "\",");
            }

            json.Append("\"BowPosition1\":\"" + BowPosition1.Replace("#","%23") + "\",");//弓位置
            json.Append("\"DEVICE_BOW_RELATIONS\":\"" + DEVICE_BOW_RELATIONS + "\",");//弓位置

            DateTime CompletedDate_IR = string.IsNullOrEmpty(dt.Rows[i]["CompletedDate_IR"].ToString()) ? new DateTime(): Convert.ToDateTime(dt.Rows[i]["CompletedDate_IR"]);
            DateTime CompletedDate_Detail = string.IsNullOrEmpty(dt.Rows[i]["CompletedDate_Detail"].ToString()) ? new DateTime(): Convert.ToDateTime(dt.Rows[i]["CompletedDate_Detail"]);
            DateTime CompletedDate_panorama = string.IsNullOrEmpty(dt.Rows[i]["CompletedDate_panorama"].ToString()) ? new DateTime(): Convert.ToDateTime(dt.Rows[i]["CompletedDate_panorama"]);
            DateTime CompletedDate_Aux = string.IsNullOrEmpty(dt.Rows[i]["CompletedDate_Aux"].ToString()) ? new DateTime(): Convert.ToDateTime(dt.Rows[i]["CompletedDate_Aux"]);

            json.Append("\"CompletedDate_IR\":\"" + CompletedDate_IR.ToString("yyyy-MM-dd HH:mm:ss") + "\",");//红外已完成到时间
            json.Append("\"CompletedDate_Detail\":\"" + CompletedDate_Detail.ToString("yyyy-MM-dd HH:mm:ss") + "\",");//局部已完成到时间
            json.Append("\"CompletedDate_panorama\":\"" + CompletedDate_panorama.ToString("yyyy-MM-dd HH:mm:ss") + "\",");//全景已完成到时间
            json.Append("\"CompletedDate_Aux\":\"" + CompletedDate_Aux.ToString("yyyy-MM-dd HH:mm:ss") + "\",");//辅助已完成到时间


            DateTime max = new DateTime();
            List <DateTime> list = new List<DateTime>();
            list.Add(CompletedDate_IR);
            list.Add(CompletedDate_Detail);
            list.Add(CompletedDate_panorama);
            list.Add(CompletedDate_Aux);

            if (Convert.ToInt32((end - start).TotalSeconds) != 0)
            {
                for (int j = 0; j < list.Count; j++)
                {
                    if (list[j] >= max)
                    {
                        max = list[j];
                    }
                }
                json.Append("\"Max_Date\":\"" + max.ToString("yyyy-MM-dd HH:mm:ss")+ "\"}");//最大进度
            }
            if (i < dt.Rows.Count - 1)
            {
                json.Append(",");
            }
        }
        json.Append("]}");

        return json.ToString();
    }

    /// <summary>
    /// 获取原始文件
    /// </summary>
    public void GetOriginalFile()
    {
        string train = HttpContext.Current.Request["LOCOMOTIVE_CODE"];//车号
        string bowposition = string.IsNullOrEmpty(HttpContext.Current.Request["BowPostition"])?"":HttpContext.Current.Request["BowPostition"];//弓位置
        DateTime starttime = HttpContext.Current.Request["starttime"]==null?Convert.ToDateTime(null):Convert.ToDateTime(HttpContext.Current.Request["starttime"]);//开始时间
                                                                                                                                                                  //DateTime endtime = HttpContext.Current.Request["endtime"] == null ? Convert.ToDateTime(null) : Convert.ToDateTime(HttpContext.Current.Request["endtime"]);//结束时间

        //当开始时间和结束时间都大于2000年1月1日并且结束时间大于等于开始时间时，请求
        //while ((starttime <= endtime)&&(starttime>new DateTime(2000,1,1,0,0,0))&&(endtime>new DateTime(2000,1,1,0,0,0)))
        //{
        //计算时间戳
        TimeSpan span = Convert.ToDateTime(starttime).ToUniversalTime() - new DateTime(1970, 1, 1, 0, 0, 0, 0);
        string time = Convert.ToInt64(span.TotalMilliseconds).ToString();

        string request_ = String.Format(@"http://125.69.149.77/api/hisalarm?car={0}{1}&time={2}", train, bowposition.Replace("#","%23"), time);
        string resultjson= PublicMethod.GetUrltoHtml(request_, "gb2312");

        log4net.ILog log = log4net.LogManager.GetLogger("请求技术部接口获取原始文件，url=" + request_);
        log.Info("获取原始文件接口请求");
        //时间+1s
        //starttime.AddSeconds(1);
        //}
        JObject jo = (JObject)JsonConvert.DeserializeObject(resultjson);
        string zone = jo["code"]["error_msg"].ToString().Replace("\"", "");
        //if (starttime == endtime)
        //{
        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(zone);
        //}
        //else
        //{
        //    HttpContext.Current.Response.ContentType = "application/json";
        //    HttpContext.Current.Response.Write("false");
        //}
    }

    public bool IsReusable {
        get {
            return false;
        }
    }

}