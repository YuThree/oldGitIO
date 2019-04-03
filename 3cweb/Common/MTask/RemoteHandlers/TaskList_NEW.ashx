<%@ WebHandler Language="C#" Class="TaskList_NEW" %>

using System;
using System.Web;
using Api.Task.entity;
using System.Text;
using System.Data;

public class TaskList_NEW : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        try
        {
            string type = context.Request["type"];
            switch (type)
            {
                case "toDoTask":
                    GetTaskList(type);
                    break;
                case "doneTask":
                    GetTaskList(type);
                    break;
                case "allTask":
                    GetTaskList(type);
                    break;
            }
        }
        catch (Exception ex)
        {
            log4net.ILog log = log4net.LogManager.GetLogger("任务列表查询");
            log.Error("执行出错", ex);
        }
    }
    public void GetTaskList(string type)
    {
        string TASK_CODE = HttpContext.Current.Request["TASK_CODE"];//整改通知书号
        string SEVERITY_CODE = HttpContext.Current.Request["SEVERITY_CODE"];//等级
        string CATEGORY_CODE = HttpContext.Current.Request["CATEGORY_CODE"];//检测类型
        string START_RAISED_TIME = HttpContext.Current.Request["START_RAISED_TIME"];//开始检测时间
        string END_RAISED_TIME = HttpContext.Current.Request["END_RAISED_TIME"];//结束检测时间
        string CHECK_TICKET = HttpContext.Current.Request["CHECK_TICKET_1"] + "&" + HttpContext.Current.Request["CHECK_TICKET_2"];//复测工作票
        string START_CHECK_TIME = HttpContext.Current.Request["START_CHECK_TIME"];//开始复测时间
        string END_CHECK_TIME = HttpContext.Current.Request["END_CHECK_TIME"];//结束复测时间
        string CHECEKRNAME = HttpContext.Current.Request["CHECEKRNAME"];//复核人名称
        string CHECKER = HttpContext.Current.Request["CHECKER"];//复核人编码
        string DEAL_TICKET = HttpContext.Current.Request["DEAL_TICKET_1"] + "&" + HttpContext.Current.Request["DEAL_TICKET_2"];//处理工作票
        string START_DEAL_TIME = HttpContext.Current.Request["START_DEAL_TIME"];//开始处理时间
        string END_DEAL_TIME = HttpContext.Current.Request["END_DEAL_TIME"];//结束处理时间
        string DEALERNAME = HttpContext.Current.Request["DEALERNAME"];//处理人
        string DEALER = HttpContext.Current.Request["DEALER"];//处理人编码
        string RECV_DEPT = HttpContext.Current.Request["RECV_DEPT"];//接收机构编码
        string RECV_DEPTNAME = HttpContext.Current.Request["RECV_DEPTNAME"];//接收结构名称
        string RECEIVER = HttpContext.Current.Request["RECEIVER"];//接收者编码
        string RECEIVERNAME = HttpContext.Current.Request["RECEIVERNAME"];//接收者名称
        string STATUS = HttpContext.Current.Request["STATUS"];//任务状态
        string LINE_CODE = HttpContext.Current.Request["LINE_CODE"];//线路
        string DIRECTION = HttpContext.Current.Request["DIRECTION"];//行别
        string START_KM_MARK = HttpContext.Current.Request["START_KM_MARK"];//开始公里标
        string END_KM_MARK = HttpContext.Current.Request["END_KM_MARK"];//结束公里标
        string POSITION_CODE = HttpContext.Current.Request["POSITION_CODE"];//区站
        int PAGESIZE = string.IsNullOrEmpty(HttpContext.Current.Request["PAGESIZE"]) ? 30 : Convert.ToInt32(HttpContext.Current.Request["PAGESIZE"]);//当前页
        int PAGEINDEX = string.IsNullOrEmpty(HttpContext.Current.Request["PAGEINDEX"]) ? 1 : Convert.ToInt32(HttpContext.Current.Request["PAGEINDEX"]);//当前页

        System.Data.DataSet ds = new System.Data.DataSet();

        switch (type)
        {
            case "toDoTask":
                ds = ADO.Task_info.getTodoTaskList(TASK_CODE, SEVERITY_CODE, CATEGORY_CODE, START_RAISED_TIME, END_RAISED_TIME, LINE_CODE, DIRECTION, START_KM_MARK, END_KM_MARK, POSITION_CODE, PAGESIZE, PAGEINDEX,STATUS);
                break;
            case "doneTask":
                ds = ADO.Task_info.getDoneTaskList(TASK_CODE,CHECK_TICKET,START_CHECK_TIME,END_CHECK_TIME,CHECEKRNAME,START_RAISED_TIME,END_RAISED_TIME,CATEGORY_CODE,DEAL_TICKET,START_DEAL_TIME,END_DEAL_TIME,DEALERNAME,SEVERITY_CODE,LINE_CODE,DIRECTION,START_KM_MARK,END_KM_MARK,POSITION_CODE,PAGESIZE,PAGEINDEX,STATUS);
                break;
            case "allTask":
                ds = ADO.Task_info.GetAllTask(TASK_CODE,CHECK_TICKET,START_CHECK_TIME,END_CHECK_TIME,CHECEKRNAME,START_RAISED_TIME,END_RAISED_TIME,CATEGORY_CODE,DEAL_TICKET,START_DEAL_TIME,END_DEAL_TIME,DEALERNAME,SEVERITY_CODE,LINE_CODE,DIRECTION,START_KM_MARK,END_KM_MARK,POSITION_CODE,STATUS,PAGESIZE,PAGEINDEX,RECEIVERNAME,RECV_DEPT);
                break;
        }

        StringBuilder json = new StringBuilder();
        json.Append("{\"data\":[");

        if (ds != null && ds.Tables.Count > 0)
        {
            for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
            {
                DateTime RAISED_TIME = new DateTime();
                if (!string.IsNullOrEmpty(ds.Tables[0].Rows[i]["RAISED_TIME"].ToString()))
                {
                    RAISED_TIME = Convert.ToDateTime(ds.Tables[0].Rows[i]["RAISED_TIME"].ToString());
                }
                DateTime DEADLINE = new DateTime();
                if (!string.IsNullOrEmpty(ds.Tables[0].Rows[i]["DEADLINE"].ToString()))
                {
                    DEADLINE = Convert.ToDateTime(ds.Tables[0].Rows[i]["DEADLINE"].ToString());
                }
                DateTime CHECK_TIME = new DateTime();
                if (!string.IsNullOrEmpty(ds.Tables[0].Rows[i]["CHECK_TIME"].ToString()))
                {
                    CHECK_TIME = Convert.ToDateTime(ds.Tables[0].Rows[i]["CHECK_TIME"].ToString());
                }
                DateTime DEAL_TIME = new DateTime();
                if (!string.IsNullOrEmpty(ds.Tables[0].Rows[i]["DEAL_TIME"].ToString()))
                {
                    DEAL_TIME = Convert.ToDateTime(ds.Tables[0].Rows[i]["DEAL_TIME"].ToString());
                }
                int KM_MARK = my_const.MAX_KM;
                if (!string.IsNullOrEmpty(ds.Tables[0].Rows[i]["KM_MARK"].ToString()))
                {
                    KM_MARK = Convert.ToInt32(ds.Tables[0].Rows[i]["KM_MARK"]);
                }
                string WZ = PublicMethod.GetPosition_Alarm(ds.Tables[0].Rows[i]["LINE_NAME"].ToString(), ds.Tables[0].Rows[i]["POSITION_NAME"].ToString(), ds.Tables[0].Rows[i]["BRG_TUN_NAME"].ToString(), ds.Tables[0].Rows[i]["DIRECTION"].ToString(), KM_MARK, ds.Tables[0].Rows[i]["POLE_NUMBER"].ToString(), ds.Tables[0].Rows[i]["DEVICE_ID"].ToString(), ds.Tables[0].Rows[i]["ROUTING_NO"].ToString(), ds.Tables[0].Rows[i]["AREA_NO"].ToString(), ds.Tables[0].Rows[i]["STATION_NO"].ToString(), ds.Tables[0].Rows[i]["STATION_NAME"].ToString(), ds.Tables[0].Rows[i]["TAX_MONITOR_STATUS"].ToString());

                //手机端
                if (!string.IsNullOrEmpty(HttpContext.Current.Request["remove"])&&!string.IsNullOrEmpty(WZ))
                {
                    WZ = WZ.Replace("&nbsp;"," ");
                }

                json.Append("{");
                json.Append("\"TID\":\"" + ds.Tables[0].Rows[i]["TID"] + "\",");//任务主键
                json.Append("\"ALARM_ID\":\"" + ds.Tables[0].Rows[i]["FAULTID"] + "\",");//缺陷主键
                json.Append("\"TASK_CODE\":\"" + ds.Tables[0].Rows[i]["TASK_CODE"] + "\",");//整改通知书号
                json.Append("\"SEVERITY_CODE\":\"" + ds.Tables[0].Rows[i]["TSEVERITY"] + "\",");//任务等级
                json.Append("\"SEVERITY_NAME\":\"" + PublicMethod.getCode_Name(ds.Tables[0].Rows[i]["TSEVERITY"].ToString()) + "\",");
                json.Append("\"RAISED_TIME\":\"" + ((RAISED_TIME != null && RAISED_TIME == DateTime.MinValue) ? "" : RAISED_TIME.ToString("yyyy-MM-dd HH:mm:ss")) + "\",");//检测时间
                json.Append("\"WZ\":\"" + WZ + "\",");//位置信息
                json.Append("\"PROPOSAL\":\"" + myfiter.json_RemoveSpecialStr_item_double(ds.Tables[0].Rows[i]["TPROPOSAL"].ToString()) + "\",");//处理意见
                json.Append("\"CATEGORY_CODE\":\"" + ds.Tables[0].Rows[i]["CATEGORY_CODE"].ToString() + "\",");//检测类型
                json.Append("\"CATEGORY\":\"" + PublicMethod.getCode_Name(ds.Tables[0].Rows[i]["CATEGORY_CODE"].ToString()) + "\",");//检测类型
                json.Append("\"DEADLINE\":\"" + ((DEADLINE != null && DEADLINE == DateTime.MinValue) ? "" : DEADLINE.ToString("yyyy-MM-dd")) + "\",");//截止日期
                json.Append("\"TASK_DESCRIPT\":\"" + myfiter.json_RemoveSpecialStr_item_double(ds.Tables[0].Rows[i]["TASK_DESCRIPT"].ToString()) + "\",");//任务描述
                json.Append("\"TSTATUS\":\"" + ds.Tables[0].Rows[i]["TSTATUS"] + "\",");//任务状态
                json.Append("\"CODE\":\"" + ds.Tables[0].Rows[i]["CODE"] + "\",");//缺陷类型
                json.Append("\"CODE_NAME\":\"" + ds.Tables[0].Rows[i]["CODE_NAME"] + "\",");

                if (ds.Tables[0].Rows[i]["CATEGORY_CODE"].ToString() == "2C" && ds.Tables[0].Rows[i]["NVALUE7"].ToString() == "2")//判断NVLUE7是否等于2是因为NVALUE7标志着2C报警是否成功提取100W和500W图像
                {
                    json.Append("\"C2500Img\":\"" + PublicMethod.GetFullDir(ds.Tables[0].Rows[i]["DIR_PATH"].ToString()) + GetImgFileName("500W", ds.Tables[0].Rows[i]) + "\",");// + "500W_" + list[i].POLE_NUMBER + "_" + list[i].KM_MARK/1000 + "_" + list[i].NVALUE1 + ".jpg" + "',");//500w相机缺陷帧图片路径 
                    json.Append("\"C2100Img\":\"" + PublicMethod.GetFullDir(ds.Tables[0].Rows[i]["DIR_PATH"].ToString()) + GetImgFileName("100W", ds.Tables[0].Rows[i]) + "\",");//+ "100W_" + list[i].POLE_NUMBER + "_" + list[i].KM_MARK/1000 + "_" + list[i].NVALUE1 + ".jpg" + "',");//100W相机缺陷帧图片路径
                }
                else
                {
                    //未成功提取
                    json.Append("\"C2500Img\":\"\",");
                    json.Append("\"C2100Img\":\"\",");
                }

                if (ds.Tables[0].Rows[i]["CATEGORY_CODE"].ToString() == "3C")
                {
                    json.Append("\"C3IRV\":\"" + PublicMethod.GetFullDir(ds.Tables[0].Rows[i]["DIR_PATH"].ToString()) + ds.Tables[0].Rows[i]["SVALUE11"] + "\",");
                    json.Append("\"C3VI\":\"" + PublicMethod.GetFullDir(ds.Tables[0].Rows[i]["DIR_PATH"].ToString()) + ds.Tables[0].Rows[i]["SVALUE5"] + "\",");
                    json.Append("\"C3OA\":\"" + PublicMethod.GetFullDir(ds.Tables[0].Rows[i]["DIR_PATH"].ToString()) + ds.Tables[0].Rows[i]["SVALUE9"] + "\",");
                }
                else
                {
                    json.Append("\"C3IRV\":\"\",");
                    json.Append("\"C3VI\":\"\",");
                    json.Append("\"C3OA\":\"\",");
                }

                if (ds.Tables[0].Rows[i]["CATEGORY_CODE"].ToString() == "4C" && !String.IsNullOrEmpty(ds.Tables[0].Rows[i]["SVALUE4"].ToString()))//列表展示4C缺陷帧图片
                {
                    //jsonStr.Append("'C4Fault':'" + PublicMethod.FtpRoot + "/" + list[i].DIR_PATH + "/" +)

                    string pN = ds.Tables[0].Rows[i]["SVALUE4"].ToString().Replace("A_", "").Replace("B_", "");

                    if (Get4CType(ds.Tables[0].Rows[i]) == "小C4")//判断是否是自研设备
                    {
                        json.Append("\"C4FaultImg\":\"" + PublicMethod.GetFullDir(ds.Tables[0].Rows[i]["DIR_PATH"].ToString()) + "/" + GetImgFileName(pN, ds.Tables[0].Rows[i]) + "\",");
                        json.Append("\"C4AllImg\":\"" + PublicMethod.GetFullDir(ds.Tables[0].Rows[i]["DIR_PATH"].ToString()) + "/" + GetImgFileName("200W", ds.Tables[0].Rows[i]) + "\",");
                    }
                    else
                    {
                        //老4C 图片命名规则：支柱号_公里标_播放目录_标识缺陷的镜头编号_缺陷当前帧号.jpg
                        //    jsonStr.Append("'C4FaultImg':'" + PublicMethod.GetFullDir(list[i]) + "/" + list[i].POLE_NUMBER + "_" + list[i].KM_MARK + "_" + Conver(list[i].SVALUE1) + "_" + Conver(list[i].SVALUE4) + "_" + list[i].NVALUE4 + ".jpg" + "',");
                        json.Append("\"C4FaultImg\":\"" + PublicMethod.GetFullDir(ds.Tables[0].Rows[i]["DIR_PATH"].ToString()) + "/" + GetImgFileName(pN, ds.Tables[0].Rows[i]) + "\",");

                        if (ds.Tables[0].Rows[i]["SVALUE4"].ToString().IndexOf('A') > -1)
                        {
                            json.Append("\"C4AllImg\":\"" + PublicMethod.GetFullDir(ds.Tables[0].Rows[i]["DIR_PATH"].ToString()) + "/" + GetImgFileName(ds.Tables[0].Rows[i]["SVALUE2"].ToString(), ds.Tables[0].Rows[i]) + "\",");
                        }
                        else
                        {
                            json.Append("\"C4AllImg\":\"" + PublicMethod.GetFullDir(ds.Tables[0].Rows[i]["DIR_PATH"].ToString()) + "/" + GetImgFileName(ds.Tables[0].Rows[i]["SVALUE3"].ToString(), ds.Tables[0].Rows[i]) + "\",");
                        }
                    }
                    json.Append("\"C4Type\":\"" + ds.Tables[0].Rows[i]["DETECT_DEVICE_CODE"].ToString() + "\",");
                }
                else
                {
                    json.Append("\"C4FaultImg\":\"\",");
                    json.Append("\"C4AllImg\":\"\",");
                    json.Append("\"C4Type\":\"" + "" + "\",");
                }
                if (ds.Tables[0].Rows[i]["CATEGORY_CODE"].ToString() == "DailyWalk" && !string.IsNullOrEmpty(ds.Tables[0].Rows[i]["SVALUE5"].ToString()))
                {
                    string DailyWalkFaultImg = "";
                    string[] pic = ds.Tables[0].Rows[i]["SVALUE5"].ToString().Split(';');
                    for (int j = 0; j < pic.Length; j++)
                    {
                        if (!string.IsNullOrEmpty(pic[j]))
                        {
                            if (pic[j].IndexOf(".jpeg", StringComparison.OrdinalIgnoreCase) > -1 || pic[j].IndexOf(".bmp", StringComparison.OrdinalIgnoreCase) > -1 || pic[j].IndexOf(".png", StringComparison.OrdinalIgnoreCase) > -1 || pic[j].IndexOf(".gif", StringComparison.OrdinalIgnoreCase) > -1 || pic[j].IndexOf(".jpg", StringComparison.OrdinalIgnoreCase) > -1)
                            {
                                DailyWalkFaultImg = pic[j];
                                break;
                            }
                        }
                    }
                    json.Append("\"DailyWalkFaultImg\":\"" + "/" + DailyWalkFaultImg + "\",");
                }
                else
                {
                    json.Append("\"DailyWalkFaultImg\":\"\",");
                }
                json.Append("\"RECV_DEPT\":\"" + ds.Tables[0].Rows[i]["RECV_DEPT"] + "\",");//接收机构编码
                json.Append("\"RECV_DEPTNAME\":\"" + ds.Tables[0].Rows[i]["RECV_DEPTNAME"] + "\",");//接收结构名称
                json.Append("\"RECEIVER\":\"" + ds.Tables[0].Rows[i]["RECEIVER"] + "\",");//接收者编码
                json.Append("\"RECEIVERNAME\":\"" + ds.Tables[0].Rows[i]["RECEIVERNAME"] + "\",");//接收者名称
                json.Append("\"CHECK_TICKET\":\"" + (string.IsNullOrEmpty(ds.Tables[0].Rows[i]["CHECK_TICKET"].ToString())?"":ds.Tables[0].Rows[i]["CHECK_TICKET"].ToString().Replace("&","－")) + "\",");//复测工作票
                json.Append("\"CHECKER\":\"" + ds.Tables[0].Rows[i]["CHECKER"] + "\",");//复测人
                json.Append("\"CHECEKRNAME\":\"" + ds.Tables[0].Rows[i]["CHECEKRNAME"] + "\",");
                json.Append("\"CHECK_TIME\":\"" + ((CHECK_TIME != null && CHECK_TIME == DateTime.MinValue) ? "" : CHECK_TIME.ToString("yyyy-MM-dd HH:mm:ss")) + "\",");//复测时间
                json.Append("\"DEAL_TICKET\":\"" + (string.IsNullOrEmpty(ds.Tables[0].Rows[i]["DEAL_TICKET"].ToString())?"":ds.Tables[0].Rows[i]["DEAL_TICKET"].ToString().Replace("&","－")) + "\",");//处理工作票
                json.Append("\"DEALER\":\"" + ds.Tables[0].Rows[i]["DEALER"] + "\",");//处理人
                json.Append("\"DEALERNAME\":\"" + myfiter.json_RemoveSpecialStr_item_double(ds.Tables[0].Rows[i]["DEALERNAME"].ToString()) + "\",");
                json.Append("\"DEAL_TIME\":\"" + ((DEAL_TIME != null && DEAL_TIME == DateTime.MinValue) ? "" : DEAL_TIME.ToString("yyyy-MM-dd HH:mm:ss")) + "\"");//处理时间
                json.Append("}");

                if (i < ds.Tables[0].Rows.Count - 1)
                {
                    json.Append(",");
                }
            }
        }

        json.Append("]");

        PageHelper ph = new PageHelper();
        int total = 0;
        if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
        {
            total = Convert.ToInt32(ds.Tables[0].Rows[0]["TOTALCOUNT"]);
        }
        json.Append("," + ph.getPageJson(total, PAGEINDEX, PAGESIZE) + "}");

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json.Replace("\t","").Replace("\n",""));

    }
    private string GetImgFileName(string camera, DataRow dr)
    {
        string AB = null;
        if (!string.IsNullOrEmpty(camera))
        {
            string one = camera.Substring(0, 1);
            if (one == "A" || one == "B")
            {
                //camera 中已经包含AB，AB值不用再加
            }
            else
            {
                string temp1 = string.IsNullOrEmpty(dr["SVALUE4"].ToString()) ? "" : dr["SVALUE4"].ToString().Substring(0, 1).ToUpper();
                if (temp1 == "A" || temp1 == "B")
                {
                    AB = temp1;
                }
            }
        }


        string tempFIleName = dr["SVALUE5"].ToString() + "_" + AB + camera + "_" + dr["NVALUE4"] + ".jpg";

        return tempFIleName;
    }
    private string Get4CType(DataRow dr)
    {
        if (dr["DETECT_DEVICE_CODE"].ToString() == "小C4检测车")
        {
            return "小C4";
        }
        else if (dr["DETECT_DEVICE_CODE"].ToString() == "大C4检测车")
        {
            return "大C4";
        }
        else
        {
            return "其它";
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