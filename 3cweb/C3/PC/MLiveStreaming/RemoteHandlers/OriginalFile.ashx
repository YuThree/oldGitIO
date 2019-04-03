<%@ WebHandler Language="C#" Class="OriginalFile" %>

using System;
using System.Web;
using System.Net;
using Api.Foundation.entity.Cond;
using Api.Foundation.entity.Foundation;
using System.Collections.Generic;
using System.Configuration;
/// <summary>
/// 获取原始文件页面后台 By TJY 2017.2.24
/// </summary>
public class OriginalFile : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {

        string action = context.Request["action"];
        switch (action)
        {
            case "createTask":
                CreateTask();//创建下载原始文件任务
                break;
            case "queryTask":
                QueryTask();//查询已经创建的任务
                break;
            case "setTaskStatus":
                SetTaskStatus();//更改任务状态
                break;
        }

    }

    /// <summary>
    /// 创建下载原始文件任务
    /// </summary>
    public static void CreateTask()
    {
        string taskName = HttpContext.Current.Request["taskname"];//任务名称
        string taskType = HttpContext.Current.Request["tasktype"];//任务类型（时间/位置）
        string alarmId = HttpContext.Current.Request["alarmid"];//报警ID
        string lineCode = HttpContext.Current.Request["linecode"];//线路编码
        string positionCode = HttpContext.Current.Request["positioncode"];//区站编码
        string brgtunCode = HttpContext.Current.Request["brgtuncode"];//桥隧编码
        string direction = HttpContext.Current.Request["direction"];//行别
        string poleNumber = HttpContext.Current.Request["polenumber"];//杆号
        string poleCode = HttpContext.Current.Request["polecode"];//支柱编码
        int kmMark = String.IsNullOrEmpty(HttpContext.Current.Request["kmmark"]) ? 0 : Convert.ToInt32(HttpContext.Current.Request["kmmark"]);//公里标
        string startTime = HttpContext.Current.Request["starttime"];//开始时间
        int limitTimes = String.IsNullOrEmpty(HttpContext.Current.Request["limittimes"]) ? 0 : Convert.ToInt32(HttpContext.Current.Request["limittimes"]);//次数限制
        string limitEndtime = HttpContext.Current.Request["limitendtime"];//截止时间限制
        string limitLocomotive = HttpContext.Current.Request["limitlocomotive"];//车辆限制，多车辆以逗号隔开
        string bowPosition = HttpContext.Current.Request["bowposition"];
        string sysGuid = Guid.NewGuid().ToString();//生成报警ID

        //获取用户信息
        Api.Foundation.entity.Foundation.LoginUser m_login = Api.Util.Public.GetCurrentUser();
        //string type = m_login.DeptType;
        string userCode = m_login.USER_CODE;
        string userName = m_login.PersonName;

        //字符判断，规范化存储，避免前台无效字段存入数据库
        if (String.IsNullOrEmpty(positionCode) || positionCode == "undefined" || positionCode == "null")
        {
            positionCode = null;
        }
        if (String.IsNullOrEmpty(brgtunCode) || brgtunCode == "undefined" || brgtunCode == "null")
        {
            brgtunCode = null;
        }
        if (direction == "0")
        {
            direction = null;
        }
        if (String.IsNullOrEmpty(alarmId) || alarmId == "undefined" || alarmId == "null")
        {
            alarmId = null;
        }
        //判断原始任务来源
        string source = Api.Util.Common.getFunCustomInfo("Fun_SpotWeb").FunName;

        //以位置创建的任务需要获取位置信息
        if (taskType == "address")
        {
            //获取位置信息(当只传入区站编码时获取线路编码)
            if ((lineCode == "undefined" || String.IsNullOrEmpty(lineCode)) && !String.IsNullOrEmpty(positionCode))
            {
                lineCode = Api.Util.Common.getStationSectionInfo(positionCode).LINE_CODE;
            }


            //获取公里标kmMark和poleCode
            PoleCond pc = new PoleCond();
            pc.LINE_CODE = lineCode;
            pc.POSITION_CODE = positionCode;
            pc.POLE_DIRECTION = direction;
            pc.POLE_NO = poleNumber;
            IList<Pole> lp = new List<Pole>();

            if (!string.IsNullOrEmpty(lineCode) || !string.IsNullOrEmpty(positionCode))
                lp = Api.ServiceAccessor.GetFoundationService().queryPole(pc);

            if (lp.Count != 0)
            {
                kmMark = Convert.ToInt32(lp[0].KMSTANDARD);
                poleCode = lp[0].POLE_CODE;
            }
        }

        //如果没有查到支柱信息则不添加地点任务
        if (String.IsNullOrEmpty(poleCode) && taskType == "address")
        {
            HttpContext.Current.Response.ContentType = "text/plain";
            HttpContext.Current.Response.Write("false");
            return;
        }

        bool result = true;

        //如果非公司网站则要进行远程向公司请求
        if (Api.Util.Common.getFunCustomInfo("Fun_SpotWeb").FunName == "GTDQ" || Api.Util.Common.getFunCustomInfo("Fun_SpotWeb") == new Api.SysManagement.Security.entity.FunCustom())
        {
        }
        else
        {
            //向公司远程请求
            string url = Api.Util.Common.ParamterDic["HttpPostWeb"].VALUE;
            string parmater = string.Format(@"TASKID:{0}|TASKNAME:{1}|TASKTYPE:{2}|ALARM_ID:{3}|LINE_CODE:{4}|POSITION_CODE:{5}|BRG_TUN_CODE:{6}|DIRECTION:{7}|POLE_NUMBER:{8}|POLE_CODE:{9}|KM_MARK:{10}|STARTTIME:{11}|LIMIT_TIMES:{12}|LIMIT_ENDTIME:{13}|LIMIT_LOCOS:{14}|TASK_STATUS:{15}|CREATEUSERCODE:{16}| CREATEUSERNAME:{17}|CREATEDATETIME:{18}|ROLLING_NUM:{19}|BOWPOSITION:{20}|SOURCE:{21}", sysGuid, taskName, taskType, alarmId, lineCode, positionCode, brgtunCode, direction, poleNumber, poleCode, kmMark, startTime, limitTimes, limitEndtime, limitLocomotive, "", userCode, userName, DateTime.Now, "", bowPosition, source);
            parmater = Api.Util.DES.AESEncrypt(parmater, "gtdqzzj1984");

            string re = PublicMethod.HttpPost(url, parmater);
            if (re.Contains("False"))
                result = false;
        }

        if (result)
            //数据访问
            result = ADO.GetFileTask.CreateNewTask(sysGuid, taskName, taskType, alarmId, lineCode, positionCode, brgtunCode, direction, poleNumber, poleCode, kmMark, startTime, limitTimes, limitEndtime, limitLocomotive, userCode, userName, bowPosition, source);





        HttpContext.Current.Response.ContentType = "text/plain";
        HttpContext.Current.Response.Write(result);
    }

    /// <summary>
    /// 查询已经创建的原始文件任务
    /// </summary>
    public static void QueryTask()
    {
        string taskName = HttpContext.Current.Request["taskname"];//任务名称
        string taskType = HttpContext.Current.Request["tasktype"];//任务类型（时间/位置）
        string alarmId = HttpContext.Current.Request["alarmid"];//报警ID
        string positionType = HttpContext.Current.Request["positiontype"];//位置类型
        string positionCode = HttpContext.Current.Request["positioncode"];//区站编码
        string direction = HttpContext.Current.Request["direction"];//行别
        string poleNumber = HttpContext.Current.Request["polenumber"];//杆号
        string startKmMark = HttpContext.Current.Request["startkmmark"];//开始公里标
        string endKmMark = HttpContext.Current.Request["endkmmark"];//结束公里标
        string startTime = HttpContext.Current.Request["starttime"];//开始时间
        string endTime = HttpContext.Current.Request["endtime"];//结束时间
        string limitLocomotive = HttpContext.Current.Request["limitlocomotive"];//车辆限制，多车辆以逗号隔开
        string taskStatus = HttpContext.Current.Request["taskstatus"];//任务状态
        int pageSize = String.IsNullOrEmpty(HttpContext.Current.Request["pagesize"]) ? 0 : Convert.ToInt32(HttpContext.Current.Request["pagesize"]);//分页大小
        int pageIndex = String.IsNullOrEmpty(HttpContext.Current.Request["pageindex"]) ? 0 : Convert.ToInt32(HttpContext.Current.Request["pageindex"]);//当前页

        //计算分页信息
        int startRownum = pageSize * (pageIndex - 1) + 1;
        int endRonum = pageIndex * pageSize;

        //数据访问查询
        System.Data.DataSet ds = ADO.GetFileTask.QueryTask(taskName, alarmId, positionType, positionCode, direction, poleNumber, startKmMark, endKmMark, startTime, endTime, limitLocomotive, taskStatus, startRownum, endRonum);

        System.Text.StringBuilder json = new System.Text.StringBuilder();
        if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
        {
            json.Append("{\"data\":[],\"total_Rows\":\"0\",\"pageIndex\":\"0\",\"pageSize\":\"0\",\"pageOfTotal\":\"1/1\",\"pageRange\":\"0~0\",\"Current_pagesize\":\"0\",\"totalPages\":\"1\"}");
        }
        else
        {
            json.Append("{\"data\":[");
            for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
            {
                System.Data.DataRow dr = ds.Tables[0].Rows[i];
                if (i == 0 || dr["TASKID"].ToString() != ds.Tables[0].Rows[i - 1]["TASKID"].ToString())
                {

                    if (i != 0)
                    {
                        if (ds.Tables[0].Rows[i - 1]["ID"] == DBNull.Value)
                        {
                            json.Remove(json.Length - 1, 1);
                            json.Append("]},");
                        }
                        else
                        {
                            json.Remove(json.Length - 1, 1);
                            json.Append("]},");
                        }

                    }
                    json.Append("{");
                    json.Append("\"taskid\":\"");
                    json.Append(dr["TASKID"].ToString() + "\",");
                    json.Append("\"taskname\":\"");
                    json.Append((dr["TASKNAME"] == DBNull.Value ? "" : dr["TASKNAME"].ToString()) + "\",");
                    json.Append("\"source\":\"");
                    json.Append((dr["SOURCE"] == DBNull.Value ? "" : dr["SOURCE"].ToString()) + "\",");
                    json.Append("\"task_start_timestamp\":\"");
                    json.Append(dr["STARTTIME"] == DBNull.Value ? "0\"," : PublicMethod.DatetimeToTimestamp(Convert.ToDateTime(dr["STARTTIME"].ToString())) + "\",");
                    json.Append("\"task_end_timestamp\":\"");
                    json.Append(dr["LIMIT_ENDTIME"] == DBNull.Value ? "0\"," : PublicMethod.DatetimeToTimestamp(Convert.ToDateTime(dr["LIMIT_ENDTIME"].ToString())) + "\",");
                    json.Append("\"tasktype\":\"");
                    json.Append((dr["TASKTYPE"] == DBNull.Value ? "" : dr["TASKTYPE"].ToString()) + "\",");
                    json.Append("\"alarmid\":\"");
                    json.Append((dr["ALARM_ID"] == DBNull.Value ? "-" : dr["ALARM_ID"].ToString()) + "\",");
                    json.Append("\"linecode\":\"");
                    json.Append((dr["LINE_CODE"] == DBNull.Value ? "" : dr["LINE_CODE"].ToString()) + "\",");
                    json.Append("\"linename\":\"");
                    json.Append((Api.Util.Common.getLineInfo(dr["LINE_CODE"] == DBNull.Value ? "null" : dr["LINE_CODE"].ToString()).LINE_NAME) + "\",");
                    json.Append("\"positioncode\":\"");
                    json.Append((dr["POSITION_CODE"] == DBNull.Value ? "" : dr["POSITION_CODE"].ToString()) + "\",");
                    json.Append("\"positionname\":\"");
                    json.Append((Api.Util.Common.getStationSectionInfo(dr["POSITION_CODE"] == DBNull.Value ? "null" : dr["POSITION_CODE"].ToString()).POSITION_NAME) + "\",");
                    json.Append("\"brg_tun_code\":\"");
                    json.Append((dr["BRG_TUN_CODE"] == DBNull.Value ? "" : dr["BRG_TUN_CODE"].ToString()) + "\",");
                    json.Append("\"brg_tun_name\":\"");
                    json.Append((Api.Util.Common.getBridgeTuneInfo(dr["BRG_TUN_CODE"] == DBNull.Value ? "null" : dr["BRG_TUN_CODE"].ToString()).BRG_TUN_NAME) + "\",");
                    json.Append("\"direction\":\"");
                    json.Append((dr["DIRECTION"] == DBNull.Value ? "" : dr["DIRECTION"].ToString()) + "\",");
                    json.Append("\"pole_num\":\"");
                    json.Append((dr["POLE_NUMBER"] == DBNull.Value ? "" : dr["POLE_NUMBER"].ToString()) + "\",");
                    json.Append("\"pole_code\":\"");
                    json.Append((dr["POLE_CODE"] == DBNull.Value ? "" : dr["POLE_CODE"].ToString()) + "\",");
                    json.Append("\"kmmark\":\"");
                    json.Append((dr["KM_MARK"] == DBNull.Value ? "" : dr["KM_MARK"].ToString()) + "\",");
                    json.Append("\"starttime\":\"");
                    json.Append((dr["STARTTIME"] == DBNull.Value ? "" : dr["STARTTIME"].ToString()) + "\",");
                    json.Append("\"limittimes\":\"");
                    json.Append((dr["LIMIT_TIMES"] == DBNull.Value ? "" : dr["LIMIT_TIMES"].ToString()) + "\",");
                    json.Append("\"limitendtime\":\"");
                    json.Append((dr["LIMIT_ENDTIME"] == DBNull.Value ? "" : dr["LIMIT_ENDTIME"].ToString()) + "\",");
                    json.Append("\"limitloco\":\"");
                    json.Append((dr["LIMIT_LOCOS"] == DBNull.Value ? "" : dr["LIMIT_LOCOS"].ToString()) + "\",");
                    json.Append("\"taskstatus\":\"");//状态转码
                    {
                        string status = null;
                        status = dr["TASK_STATUS"] == DBNull.Value ? "" : dr["TASK_STATUS"].ToString();
                        switch (status)
                        {
                            case "WAIT":
                                status = "处理中";
                                break;
                            case "PAUSE":
                                status = "暂停";
                                break;
                            case "TIMEOUT":
                                status = "已超时";
                                break;
                            case "DONE":
                                status = "已完成";
                                break;
                            case "PLAY":
                                status = "可播放";
                                break;
                        }
                        json.Append(status + "\",");
                    }

                    json.Append("\"createusername\":\"");
                    json.Append((dr["CREATEUSERNAME"] == DBNull.Value ? "" : dr["CREATEUSERNAME"].ToString()) + "\",");
                    json.Append("\"createdatetime\":\"");
                    json.Append((dr["CREATEDATETIME"] == DBNull.Value ? "" : dr["CREATEDATETIME"].ToString()) + "\",");
                    json.Append("\"data\":[");
                    if (dr["ID"] != DBNull.Value)
                    {
                        json.Append("{");
                        json.Append("\"locomotivecode\":\"");
                        json.Append((dr["LOCOMOTIVE_CODE"] == DBNull.Value ? "" : dr["LOCOMOTIVE_CODE"].ToString()) + "\",");
                        json.Append("\"getdatatime\":\"");
                        json.Append((dr["GETDATATIME"] == DBNull.Value ? "" : dr["GETDATATIME"].ToString()) + "\",");
                        json.Append("\"queueid\":\"");
                        json.Append((dr["ID"] == DBNull.Value ? "" : dr["ID"].ToString()) + "\",");
                        json.Append("\"taskqueuesattus\":\"");//具体任务状态转码
                        {
                            string status_queue = null;
                            status_queue = dr["TASK_QUEUE_STATUS"] == DBNull.Value ? "" : dr["TASK_QUEUE_STATUS"].ToString();
                            switch (status_queue)
                            {
                                case "WAIT":
                                    status_queue = "处理中";
                                    break;
                                case "PAUSE":
                                    status_queue = "暂停";
                                    break;
                                case "TIMEOUT":
                                    status_queue = "已超时";
                                    break;
                                case "DONE":
                                    status_queue = "已完成";
                                    break;
                                case "LOST":
                                    status_queue = "原始数据已丢失";
                                    break;
                                case "OVERNUM":
                                    status_queue = "已超出任务限制数量";
                                    break;
                                case "PLAY":
                                    status_queue = "可播放";
                                    break;
                            }
                            json.Append(status_queue + "\",");
                        }
                        //json.Append((dr["TASK_QUEUE_STATUS"] == DBNull.Value ? "" : dr["TASK_QUEUE_STATUS"].ToString()) + "\",");
                        json.Append("\"fileurl_net\":\"");
                        json.Append((dr["FILEURL_NET"] == DBNull.Value ? "-" : dr["FILEURL_NET"].ToString().Replace("\\", "%5C")) + "\",");
                        json.Append("\"start_timestamp\":\"");
                        json.Append(Convert.ToDateTime(dr["GETDATATIME"].ToString()) == new DateTime() ? "0\"," : PublicMethod.DatetimeToTimestamp(Convert.ToDateTime(dr["GETDATATIME"].ToString())) + "\",");
                        json.Append("\"end_timestamp\":\"");
                        json.Append(Convert.ToDateTime(dr["GETDATATIME"].ToString()) == new DateTime() ? "0\"," : PublicMethod.DatetimeToTimestamp(Convert.ToDateTime(dr["GETDATATIME"].ToString()).AddSeconds(1)) + "\",");
                        json.Append("\"bowname\":\"");
                        json.Append((dr["BOWPOSITION"] == DBNull.Value ? "" : Api.ServiceAccessor.GetFoundationService().getLocomotiveBowname(dr["LOCOMOTIVE_CODE"].ToString(), dr["BOWPOSITION"].ToString())) + "\",");
                        json.Append("\"bowposition\":\"");
                        json.Append((dr["BOWPOSITION"] == DBNull.Value ? "" : dr["BOWPOSITION"].ToString()) + "\"},");
                    }
                    else
                    {
                        json.Append(",");
                    }

                }
                else
                {
                    json.Append("{");
                    json.Append("\"locomotivecode\":\"");
                    json.Append((dr["LOCOMOTIVE_CODE"] == DBNull.Value ? "" : dr["LOCOMOTIVE_CODE"].ToString()) + "\",");
                    json.Append("\"getdatatime\":\"");
                    json.Append((dr["GETDATATIME"] == DBNull.Value ? "" : dr["GETDATATIME"].ToString()) + "\",");
                    json.Append("\"taskqueuesattus\":\"");
                    {
                        string status_queue = null;
                        status_queue = dr["TASK_QUEUE_STATUS"] == DBNull.Value ? "" : dr["TASK_QUEUE_STATUS"].ToString();
                        switch (status_queue)
                        {
                            case "WAIT":
                                status_queue = "处理中";
                                break;
                            case "PAUSE":
                                status_queue = "暂停";
                                break;
                            case "TIMEOUT":
                                status_queue = "已超时";
                                break;
                            case "DONE":
                                status_queue = "已完成";
                                break;
                            case "LOST":
                                status_queue = "原始数据已丢失";
                                break;
                            case "OVERNUM":
                                status_queue = "已超出任务限制数量";
                                break;
                            case "PLAY":
                                status_queue = "可播放";
                                break;
                        }
                        json.Append(status_queue + "\",");
                    }
                    //json.Append((dr["TASK_QUEUE_STATUS"] == DBNull.Value ? "" : dr["TASK_QUEUE_STATUS"].ToString()) + "\",");
                    json.Append("\"fileurl_net\":\"");
                    json.Append((dr["FILEURL_NET"] == DBNull.Value ? "-" : dr["FILEURL_NET"].ToString().Replace("\\", "%5C")) + "\",");
                    json.Append("\"start_timestamp\":\"");
                    json.Append(Convert.ToDateTime(dr["GETDATATIME"].ToString()) == new DateTime() ? "0\"," : PublicMethod.DatetimeToTimestamp(Convert.ToDateTime(dr["GETDATATIME"].ToString())) + "\",");
                    json.Append("\"end_timestamp\":\"");
                    json.Append(Convert.ToDateTime(dr["GETDATATIME"].ToString()) == new DateTime() ? "0\"," : PublicMethod.DatetimeToTimestamp(Convert.ToDateTime(dr["GETDATATIME"].ToString()).AddSeconds(1)) + "\",");
                    json.Append("\"bowname\":\"");
                    json.Append((dr["BOWPOSITION"] == DBNull.Value ? "" : Api.ServiceAccessor.GetFoundationService().getLocomotiveBowname(dr["LOCOMOTIVE_CODE"].ToString(), dr["BOWPOSITION"].ToString())) + "\",");
                    json.Append("\"bowposition\":\"");
                    json.Append((dr["BOWPOSITION"] == DBNull.Value ? "" : dr["BOWPOSITION"].ToString()) + "\"},");
                }
            }
            json.Remove(json.Length - 1, 1);
            json.Append("]}]");
            //json.Append("]");
            PageHelper page = new PageHelper();
            string pagejson = page.getPageJson(Convert.ToInt32(ds.Tables[0].Rows[0]["TOTAL"]), pageIndex, pageSize);//拼接分页数据
            json.Append("," + pagejson + "}");
        }

        HttpContext.Current.Response.ContentType = "text/plain";
        HttpContext.Current.Response.Write(json);
    }

    /// <summary>
    /// 设置任务状态
    /// </summary>
    public static void SetTaskStatus()
    {
        string taskID = HttpContext.Current.Request["taskid"];//任务ID
        string status = HttpContext.Current.Request["status"];//设置任务状态

        //数据访问
        bool result = ADO.GetFileTask.SetTaskStatus(taskID, status);

        HttpContext.Current.Response.ContentType = "text/plain";
        HttpContext.Current.Response.Write(result);
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}