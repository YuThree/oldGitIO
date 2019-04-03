 <%@ WebHandler Language="C#" Class="GetExceptionList" %>

using System;
using System.Web;
using System.Text;
using System.Data;
using System.Collections;
using System.Web.Caching;
public class GetExceptionList : ReferenceClass, IHttpHandler
{
    /// <summary>
    /// 异常状态提醒相关功能
    /// </summary>
    /// <param name="context"></param>
    public void ProcessRequest(HttpContext context)
    {

        try
        {
            string action = HttpContext.Current.Request["action"];
            switch (action)
            {
                case "monitor":
                    getExceptionList();
                    break;
                case "settime":
                    SetTime();
                    break;
                case "count":
                    getCount();
                    break;
                default:
                    break;
            }
        }
        catch (Exception ex)
        {
            log4net.ILog log = log4net.LogManager.GetLogger("特殊异常（双端降弓）");
            log.Error("执行出错", ex);
        }
        //ArrayList myarray = new ArrayList();
        //Cache cache = HttpRuntime.Cache;
        //myarray.Add("1.学习天地1");
        //myarray.Add("2.学习天地1");
        //myarray.Add("3.学习天地1");
        //myarray.Add("4.学习天地1");
        ////string item = "这是一条缓存";
        ////cache["item"] = item;//赋值
        ////HttpContext.Current.Response.Write(cache.Get("item") + "<br/>");

        //string item = "更改一条缓存数据";
        ////cache.Insert("item", item);//更改缓存值
        //cache.Add("item", item, null, DateTime.Now.AddSeconds(5), TimeSpan.Zero, CacheItemPriority.Normal, null);
        //HttpContext.Current.Response.Write(cache.Get("item") + "<br/>");


        //cache.Remove("item"); //移除缓存值
        //HttpContext.Current.Response.Write(cache.Get("item") + "<br/>");

        //HttpContext.Current.Response.Write(cache["item"].GetType().Name + "<br/>");//GetType获得Cache的数据类型 
        //HttpContext.Current.Response.Write(cache.Get("Array") + "<br/>");//GetType获得Cache的数据类型


        //IDictionaryEnumerator bianli = cache.GetEnumerator();//遍历整个缓存
        //while (bianli.MoveNext())
        //{
        //    HttpContext.Current.Response.Write(bianli.Value + "<br/>");
        //}
        //HttpContext.Current.Response.Write("获取缓存数量：" + cache.Count);

        //if (cache["Array"] == null)
        //{//当缓存Array不存在时，添加缓存，缓存时间设定为5秒
        //    cache.Add("Array", myarray, null, DateTime.Now.AddSeconds(15), TimeSpan.Zero, CacheItemPriority.Normal, null);
        //}
        //HttpContext.Current.Response.Write(cache.Get("Array") + "<br/>");//GetType获得Cache的数据类型

    }
    /// <summary>
    /// 获取异常状态报警列表
    /// </summary>
    public void getExceptionList()
    {
        DateTime starttime = string.IsNullOrEmpty(HttpContext.Current.Request["starttime"]) ? DateTime.Parse("0001-01-01") : (Convert.ToDateTime(HttpContext.Current.Request["starttime"]));//起始时间
        DateTime endtime = string.IsNullOrEmpty(HttpContext.Current.Request["endtime"]) ? DateTime.Parse("2999-01-01") : (Convert.ToDateTime(HttpContext.Current.Request["endtime"]));//终止时间
        int pageIndex = string.IsNullOrEmpty(HttpContext.Current.Request["pageIndex"]) ? -1 : Convert.ToInt32(HttpContext.Current.Request["pageIndex"]);//当前页
        int pageSize = string.IsNullOrEmpty(HttpContext.Current.Request["pageSize"]) ? -1 : Convert.ToInt32(HttpContext.Current.Request["pageSize"]);//页大小
        string LOCOMOTIVE_CODE = HttpContext.Current.Request["LOCOMOTIVE_CODE"];//设备编号
        string EXP_TYPE = HttpContext.Current.Request["EXP_TYPE"];//异常说明

        StringBuilder Json = getList(starttime,endtime,LOCOMOTIVE_CODE,EXP_TYPE,pageIndex,pageSize);

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(myfiter.json_RemoveSpecialStr(Json.ToString()));
    }
    /// <summary>
    /// 设置多长时间不报警
    /// </summary>
    public void SetTime()
    {
        string sms_id = HttpContext.Current.Request["sms_id"];
        int time = Convert.ToInt32(HttpContext.Current.Request["time"]);
        ADO.IC3_Sms_ExceptionImpl c3sms = new ADO.IC3_Sms_ExceptionImpl();
        int count = c3sms.UpdateConfirmTimeRange(sms_id, time);
        HttpContext.Current.Response.Write(count);

    }
    /// <summary>
    /// 获取异常状态信息列表
    /// </summary>
    /// <param name="starttime">开始时间</param>
    /// <param name="endtime">结束时间</param>
    /// <param name="LOCOMOTIVE_CODE">设备编号</param>
    /// <param name="EXP_TYPE">异常类型</param>
    /// <param name="pageIndex">当前页</param>
    /// <param name="pageSize">分页大小</param>
    /// <returns>异常状态信息列表</returns>
    public StringBuilder getList(DateTime starttime, DateTime endtime,string LOCOMOTIVE_CODE,string EXP_TYPE,int pageIndex,int pageSize)
    {
        System.Data.DataSet ds = ADO.IC3_Sms_ExceptionImpl.GetExceptionList(starttime,endtime,LOCOMOTIVE_CODE,EXP_TYPE,pageSize,pageIndex);
        StringBuilder Json = new StringBuilder("{\"list\":[");
        if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
        {
            for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
            {
                DataRow row = ds.Tables[0].Rows[i];
                Json.Append(getJson(row));
                if (i + 1 != ds.Tables[0].Rows.Count)
                {
                    Json.Append(",");
                }
            }
        }
        Json.Append("]");

        PageHelper ph = new PageHelper();
        int total = 0;
        if (ds.Tables[0].Rows.Count > 0)
        {
            total = Convert.ToInt32(ds.Tables[0].Rows[0]["total"]);
        }
        Json.Append("," + ph.getPageJson(total,pageIndex,pageSize) + "}");
        return Json;
    }
    /// <summary>
    ///  将需要显示的信息拼成json
    /// </summary>
    /// <param name="row">当前行</param>
    /// <returns></returns>
    public StringBuilder getJson(DataRow row)
    {
        StringBuilder Json = new StringBuilder("");

        Json.AppendFormat("{{\"LOCOMOTIVE_CODE\":\"{0}\",\"CREATE_TIME\":\"{1}\",\"WZ\":\"{2}\",\"EXP_TYPE\":\"{3}\",\"starttime\":\"{4}\",\"endtime\":\"{5}\",\"SMS_ID\":\"{6}\",\"ROW_\":\"{7}\"}}"
            , row["LOCOMOTIVE_CODE"], string.IsNullOrEmpty(row["CREATE_TIME"].ToString())?"": Convert.ToDateTime(row["CREATE_TIME"]).ToString("yyyy-MM-dd HH:mm:ss"), PublicMethod.GetPositionBySMSID(row["SMS_ID"].ToString()), row["EXP_TYPE"], Convert.ToDateTime(row["CREATE_TIME"]).AddMinutes(-2).ToString("yyyy-MM-dd HH:mm:ss"), Convert.ToDateTime(row["CREATE_TIME"]).AddMinutes(2).ToString("yyyy-MM-dd HH:mm:ss"), row["SMS_ID"],row["ROW_"]);
        return Json;
    }
    /// <summary>
    /// 获取当前异常报警数量
    /// </summary>
    public void getCount()
    {
        Cache cache = HttpRuntime.Cache;
        if (cache["Count"] == null)
        {
            int count = 0;
            ADO.IC3_Sms_ExceptionImpl C3_EX = new ADO.IC3_Sms_ExceptionImpl();
            DateTime endtime = DateTime.Now;
            DateTime starttime = new DateTime();
            StringBuilder json = new StringBuilder();

            if (cache["StartTime"] == null)
            {
                starttime = endtime.AddHours(-2);
            }
            else
            {
                starttime = Convert.ToDateTime(cache["StartTime"]);
            }
            System.Data.DataSet list = C3_EX.GetC3_sms_exception(starttime, endtime);
            if (list.Tables[0].Rows.Count > 0)
            {
                count = list.Tables[0].Rows.Count;
                cache.Remove("StartTime");
                cache.Add("StartTime", list.Tables[0].Rows[0]["CREATE_TIME"], null, DateTime.Now.AddHours(2), TimeSpan.Zero, CacheItemPriority.Normal, null);
                json.Append("{\"data\":[{\"count\":\"" + count + "\",\"starttime\":\"" + starttime + "\",\"endtime\":\"" + endtime + "\"}]}");
            }
            else
            {
                json.Append("{\"data\":[{\"count\":\"" + count + "\",\"starttime\":\"" + starttime + "\",\"endtime\":\"" + endtime + "\"}]}");
            }
            cache.Add("Count", json, null, DateTime.Now.AddSeconds(55), TimeSpan.Zero, CacheItemPriority.Normal, null);

            //DateTime endtime = DateTime.Now;
            //DateTime starttime = new DateTime();
            //StringBuilder json = new StringBuilder();

            //string getstarttime = HttpContext.Current.Request["starttime"];
            //int count = 0;
            //ADO.IC3_Sms_ExceptionImpl C3_EX = new ADO.IC3_Sms_ExceptionImpl();
            //if (string.IsNullOrEmpty(getstarttime))
            //{
            //    //DateTime starttime = endtime.AddSeconds(-90);//实际
            //    starttime = endtime.AddHours(-2);//测试用
            //}
            //else
            //{
            //    starttime = Convert.ToDateTime(getstarttime);
            //}
            //System.Data.DataSet list = C3_EX.GetC3_sms_exception(starttime, endtime);
            //if (list.Tables[0].Rows.Count>0)
            //{
            //    count = list.Tables[0].Rows.Count;
            //    json.Append("{\"data\":[{\"count\":\"" + count + "\",\"newest\":\"" + list.Tables[0].Rows[0]["CREATE_TIME"] + "\",\"starttime\":\"" + starttime + "\",\"endtime\":\"" + endtime + "\"}]}");
            //}
            //else
            //{
            //    json.Append("{\"data\":[{\"count\":\"" + count + "\",\"newest\":\"" + "" + "\",\"starttime\":\"" + starttime + "\",\"endtime\":\"" + endtime + "\"}]}");
            //}

            //cache.Add("Count", json, null, DateTime.Now.AddSeconds(60), TimeSpan.Zero, CacheItemPriority.Normal, null);
        }
        HttpContext.Current.Response.Write(cache.Get("Count"));
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}