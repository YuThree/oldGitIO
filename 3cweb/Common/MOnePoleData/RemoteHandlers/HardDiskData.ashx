<%@ WebHandler Language="C#" Class="HardDiskData" %>

using System;
using System.Web;
using System.Text;
using System.Linq;
using System.Data;

public class HardDiskData : ReferenceClass, IHttpHandler {

    public void ProcessRequest (HttpContext context) {
        try
        {
            string action = context.Request["action"];
            switch (action)
            {
                case "list":
                    getList();
                    break;
                case "detail":
                    getDetail();
                    break;
            }
        }
        catch (Exception ex)
        {
            log4net.ILog log = log4net.LogManager.GetLogger("一杆一档硬盘数据");
            log.Error("执行出错", ex);
        }
    }
    /// <summary>
    /// 一杆一档硬盘数据列表
    /// </summary>
    public void getList()
    {
        string pole_code = HttpContext.Current.Request["pole_code"];//杆编码
        string line_code = HttpContext.Current.Request["line_code"];//线路编码
        string pole_direction = HttpContext.Current.Request["pole_direction"];//行别
        string position_code = HttpContext.Current.Request["position_code"];//区站编码
        string brg_tun_code = HttpContext.Current.Request["brg_tun_code"];//桥隧编码
        string km_mark = HttpContext.Current.Request["km_mark"];//公里标
        string start_date = HttpContext.Current.Request["start_time"];//开始时间
        string end_date = HttpContext.Current.Request["end_time"];//结束时间
        int pageindex = string.IsNullOrEmpty(HttpContext.Current.Request["pageindex"]) ? 1 : Convert.ToInt32(HttpContext.Current.Request["pageindex"]);//当前页
        int pagesize = string.IsNullOrEmpty(HttpContext.Current.Request["pagesize"]) ? 10 : Convert.ToInt32(HttpContext.Current.Request["pagesize"]);//页大小

        string start_timestamp = "";
        string end_timestamp = "";
        //string start_date = "";
        //string end_date = "";
        if (!string.IsNullOrEmpty(pole_code))
        {
            pole_code = pole_code.Replace("%23", "#");
        }
        if (!string.IsNullOrEmpty(start_date))
        {
            TimeSpan ts = Convert.ToDateTime(start_date).ToUniversalTime() - new DateTime(1970, 1, 1, 0, 0, 0, 0);
            start_timestamp = Convert.ToInt64(ts.TotalMilliseconds).ToString();
            //start_date = Convert.ToDateTime(start_time).ToShortDateString();
        }
        if (!string.IsNullOrEmpty(end_date))
        {
            TimeSpan ts = Convert.ToDateTime(end_date).ToUniversalTime() - new DateTime(1970, 1, 1, 0, 0, 0, 0);
            end_timestamp = Convert.ToInt64(ts.TotalMilliseconds).ToString();
            //end_date = Convert.ToDateTime(end_time).ToShortDateString();
        }

        int startrow = pagesize * (pageindex-1) + 1;
        int endrow = pagesize * pageindex;

        System.Data.DataSet ds = ADO.HardDiskData.GetDataDiskList(pole_code,line_code,pole_direction,position_code,brg_tun_code,km_mark,start_timestamp,end_timestamp,start_date,end_date,startrow,endrow);

        StringBuilder json = new StringBuilder();
        json.Append("{\"data\":[");
        for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
        {
            DateTime datetime = new DateTime();
            DateTime dtStart = TimeZone.CurrentTimeZone.ToLocalTime(new DateTime(1970, 1, 1, 0, 0, 0));
            long lTime = long.Parse(ds.Tables[0].Rows[i]["MIN_TIMESTAMP_IRV"] + "0000");
            TimeSpan toNow = new TimeSpan(lTime);
            datetime = dtStart.Add(toNow);

            json.Append("{\"DATETIME\":\"" + datetime.ToString("yyyy-MM-dd HH:mm:ss") + "\",");//当前杆第一帧红外检测时间
            json.Append("\"MIN_TIMESTAMP_IRV\":\"" + ds.Tables[0].Rows[i]["MIN_TIMESTAMP_IRV"] + "\",");
            json.Append("\"MAX_TIMESTAMP_IRV\":\"" + ds.Tables[0].Rows[i]["MAX_TIMESTAMP_IRV"] + "\",");
            json.Append("\"DATA_DATE\":\"" + ds.Tables[0].Rows[i]["DATA_DATE"] + "\",");
            json.Append("\"LOCOMOTIVE_CODE\":\"" + ds.Tables[0].Rows[i]["LOCOMOTIVE_CODE_P"] + "\"}");
            if (i < ds.Tables[0].Rows.Count - 1)
            {
                json.Append(",");
            }
        }
        json.Append("]");

        PageHelper ph = new PageHelper();
        int total = 0;
        if (ds.Tables[0].Rows.Count > 0)
        {
            total = Convert.ToInt32(ds.Tables[0].Rows[0]["TOTAL"]);
        }
        json.Append("," + ph.getPageJson(total, pageindex, pagesize) + "}");

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);

    }

    public void getDetail()
    {
        string pole_code = HttpContext.Current.Request["pole_code"];//杆编码
        string line_code = HttpContext.Current.Request["line_code"];//线路编码
        string pole_direction = HttpContext.Current.Request["pole_direction"];//行别
        string position_code = HttpContext.Current.Request["position_code"];//区站编码
        string brg_tun_code = HttpContext.Current.Request["brg_tun_code"];//桥隧编码
        string km_mark = HttpContext.Current.Request["km_mark"];//公里标
        string start_timestamp = HttpContext.Current.Request["start_timestamp"];//开始红外时间戳
        string end_timestamp = HttpContext.Current.Request["end_timestamp"];//结束时间
        string locomotive_code = HttpContext.Current.Request["locomotive_code"];//设备号
        string bow_position_code = HttpContext.Current.Request["bow_position_code"];//弓位置编码
        if (!string.IsNullOrEmpty(pole_code))
        {
            pole_code = pole_code.Replace("%23", "#");
        }
        string relations = Api.Util.Common.getLocomotiveInfo(locomotive_code).DEVICE_BOW_RELATIONS;
        if (!string.IsNullOrEmpty(locomotive_code) && string.IsNullOrEmpty(bow_position_code))
        {
            if (!string.IsNullOrEmpty(relations) && relations.Contains("#"))
            {
                bow_position_code = "#1_A";
            }
            else
            {
                bow_position_code = "_A";
            }
        }

        System.Data.DataSet ds = ADO.HardDiskData.GetDetail(pole_code, line_code, pole_direction, position_code, brg_tun_code, km_mark, start_timestamp, end_timestamp, locomotive_code);

        StringBuilder json = new StringBuilder();
        json.Append("{");

        if (ds.Tables[0].Rows.Count > 0)
        {
            json.Append("\"DEVICE_BOW_RELATIONS\":\"" + relations + "\",");

            string bow_string = null;
            if (string.IsNullOrEmpty(relations) || !relations.Contains("#"))
            {
                bow_string = "_A,_B";
            }
            else
            {
                bow_string = "#1_A,#1_B,#2_A,#2_B";
            }
            json.Append("\"content\":[");
            string[] bow_list = bow_string.Split(',');
            for (int i = 0; i < bow_list.Length; i++)
            {
                json.Append("{");

                var data = from dt in ds.Tables[0].AsEnumerable()//查询   
                           where dt.Field<string>("IRV_BOW_POSITION_CODE") == bow_list[i]
                           select dt;
                int j = 0;
                int count = data.Count<DataRow>();
                if (count > 0)
                {

                    DateTime start_time = new DateTime();
                    DateTime dtStart = TimeZone.CurrentTimeZone.ToLocalTime(new DateTime(1970, 1, 1, 0, 0, 0));
                    //long lTime = long.Parse(ds.Tables[0].Rows[0]["TIMESTAMP_IRV"] + "0000");
                    long lTime = long.Parse(data.First<DataRow>()["TIMESTAMP_IRV"] + "0000");
                    TimeSpan toNow = new TimeSpan(lTime);
                    start_time = dtStart.Add(toNow);

                    json.Append("\"start_time\":\"" + start_time.ToString("yyyy-MM-dd HH:mm:ss") + "\",");
                    json.Append("\"locomotive_code\":\"" + data.First<DataRow>()["LOCOMOTIVE_CODE"] + "\",");
                    json.Append("\"bow_position_code\":\"" + data.First<DataRow>()["IRV_BOW_POSITION_CODE"] + "\",");
                    json.Append("\"bow_position_name\":\"" + data.First<DataRow>()["IRV_BOW_POSITION_NAME"] + "\",");
                    json.Append("\"TEMP_IRV\":\"" + myfiter.GetTEMP(Convert.ToInt32(data.First<DataRow>()["N_IRV_TEMP"])) + "\",");
                    json.Append("\"TEMP_ENV\":\"" + myfiter.GetTEMP_EN(Convert.ToInt32(data.First<DataRow>()["N_ENV_TEMP"])) + "\",");
                    json.Append("\"LINE_HEIGHT\":\"" + myfiter.GetLINE_HEIGHT(Convert.ToInt32(data.First<DataRow>()["N_HIGH"])) + "\",");
                    json.Append("\"PULLING_VALUE\":\"" + myfiter.GetPULLING_VALUE(data.First<DataRow>()["N_STAGGER"]) + "\",");
                    json.Append("\"SPEED\":\"" + data.First<DataRow>()["N_SPEED"] + "\",");
                    json.Append("\"DEVICE_BOW_RELATIONS\":\"" + Api.Util.Common.getLocomotiveInfo(locomotive_code).DEVICE_BOW_RELATIONS + "\",");
                    json.Append("\"TIMESTAMP_IRV\":[");
                    foreach (var item in data)
                    {
                        j = j + 1;
                        json.Append("\"" + item["TIMESTAMP_IRV"] + "\"");
                        if (j < count)
                        {
                            json.Append(",");
                        }
                    }
                    json.Append("],");
                    json.Append("\"IRV\":[");
                    j = 0;
                    foreach (var item in data)
                    {
                        j = j + 1;
                        json.Append("\"" + item["IRV_FILE_PATH"].ToString().Replace("#", "%23").Replace("\\", "%5c") + "\"");
                        if (j < count)
                        {
                            json.Append(",");
                        }
                    }
                    json.Append("],");
                    json.Append("\"IRV_IDX\":[");
                    j = 0;
                    foreach (var item in data)
                    {
                        j = j + 1;
                        json.Append("\"" + item["IRV_IDX"] + "\"");
                        if (j < count)
                        {
                            json.Append(",");
                        }
                    }
                    json.Append("],");
                    json.Append("\"OV\":[");
                    j = 0;
                    foreach (var item in data)
                    {
                        j = j + 1;
                        json.Append("\"" + item["OV_FILE_PATH"].ToString().Replace("#", "%23").Replace("\\", "%5c") + "\"");
                        if (j < count)
                        {
                            json.Append(",");
                        }
                    }
                    json.Append("],");
                    json.Append("\"OV_IDX\":[");
                    j = 0;
                    foreach (var item in data)
                    {
                        j = j + 1;
                        json.Append("\"" + item["OV_IDX"] + "\"");
                        if (j < count)
                        {
                            json.Append(",");
                        }
                    }
                    json.Append("],");
                    json.Append("\"OV_OFFSET\":[");
                    j = 0;
                    foreach (var item in data)
                    {
                        j = j + 1;
                        json.Append("\"" + item["OV_OFFSET"] + "\"");
                        if (j < count)
                        {
                            json.Append(",");
                        }
                    }
                    json.Append("],");
                    json.Append("\"VI\":[");
                    j = 0;
                    foreach (var item in data)
                    {
                        j = j + 1;
                        json.Append("\"" + item["VI_FILE_PATH"].ToString().Replace("#", "%23").Replace("\\", "%5c") + "\"");
                        if (j < count)
                        {
                            json.Append(",");
                        }
                    }
                    json.Append("],");
                    json.Append("\"VI_IDX\":[");
                    j = 0;
                    foreach (var item in data)
                    {
                        j = j + 1;
                        json.Append("\"" + item["VI_IDX"] + "\"");
                        if (j < count)
                        {
                            json.Append(",");
                        }
                    }
                    json.Append("],");
                    json.Append("\"VI_OFFSET\":[");
                    j = 0;
                    foreach (var item in data)
                    {
                        j = j + 1;
                        json.Append("\"" + item["VI_OFFSET"] + "\"");
                        if (j < count)
                        {
                            json.Append(",");
                        }
                    }
                    json.Append("],");
                    json.Append("\"AUX\":[");
                    j = 0;
                    foreach (var item in data)
                    {
                        j = j + 1;
                        json.Append("\"" + item["AUX_FILE_PATH"].ToString().Replace("#", "%23").Replace("\\", "%5c") + "\"");
                        if (j < count)
                        {
                            json.Append(",");
                        }
                    }
                    json.Append("],");
                    json.Append("\"AUX_IDX\":[");
                    j = 0;
                    foreach (var item in data)
                    {
                        j = j + 1;
                        json.Append("\"" + item["AUX_IDX"] + "\"");
                        if (j < count)
                        {
                            json.Append(",");
                        }
                    }
                    json.Append("],");
                    json.Append("\"AUX_OFFSET\":[");
                    j = 0;
                    foreach (var item in data)
                    {
                        j = j + 1;
                        json.Append("\"" + item["AUX_OFFSET"] + "\"");
                        if (j < count)
                        {
                            json.Append(",");
                        }
                    }
                    json.Append("],");
                    json.Append("\"INFO\":[");
                    j = 0;
                    foreach (var item in data)
                    {
                        j = j + 1;
                        json.Append("\"" + "最高温度:" + myfiter.GetTEMP(Convert.ToInt32(item["N_IRV_TEMP"])) + "℃&nbsp;" + "环境温度:" + myfiter.GetTEMP_EN(Convert.ToInt32(item["N_ENV_TEMP"])) + "℃&nbsp;" + "导高值:" + myfiter.GetLINE_HEIGHT(Convert.ToInt32(item["N_HIGH"])) + (string.IsNullOrEmpty(myfiter.GetLINE_HEIGHT(Convert.ToInt32(item["N_HIGH"]))) ? "&nbsp;" : "mm") + "&nbsp;" + "拉出值:" + myfiter.GetPULLING_VALUE(item["N_STAGGER"]) + (string.IsNullOrEmpty(myfiter.GetPULLING_VALUE(item["N_STAGGER"])) ? "&nbsp;" : "mm") + "&nbsp;" + "速度:" + item["N_SPEED"] + "km/h&nbsp" + "\"");
                        if (j < count)
                        {
                            json.Append(",");
                        }
                    }
                    json.Append("],");
                    json.Append("\"FRAME_INFO_LIST\":[");
                    j = 0;
                    foreach (var item in data)
                    {
                        j = j + 1;
                        json.Append("{");
                        json.Append("\"FRAME_NO\":\"" + (j - 1) + "\",");
                        json.Append("\"TEMP_IRV\":\"" + myfiter.GetTEMP(Convert.ToInt32(item["N_IRV_TEMP"])) + "\",");
                        json.Append("\"TEMP_ENV\":\"" + myfiter.GetTEMP_EN(Convert.ToInt32(item["N_ENV_TEMP"])) + "\",");
                        json.Append("\"LINE_HEIGHT\":\"" + myfiter.GetLINE_HEIGHT(Convert.ToInt32(item["N_HIGH"])) + "\",");
                        json.Append("\"PULLING_VALUE\":\"" + myfiter.GetPULLING_VALUE(item["N_STAGGER"]) + "\",");
                        json.Append("\"SPEED\":\"" + item["N_SPEED"] + "\"");
                        json.Append("}");
                        if (j < count)
                        {
                            json.Append(",");
                        }
                    }
                    json.Append("]");
                }
                json.Append("}");
                if (i < bow_list.Length - 1)
                {
                    json.Append(",");
                }
            }
            json.Append("]");
        }
        json.Append("}");

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }

    public bool IsReusable {
        get {
            return false;
        }
    }

}