<%@ WebHandler Language="C#" Class="GetExcelAlarmList" %>
using System;
using System.Web;
using System.Data;
using System.Linq;
using Api.Fault.entity.alarm;
using Api;
using Api.Util;
using Api.Foundation.entity.Foundation;
using Api.Foundation.entity.Cond;
using System.Collections.Generic;
using System.Text;

public class GetExcelAlarmList : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        string type = HttpContext.Current.Request["type"];//获取类型
        switch (type)
        {
            //查询
            case "all":
                GetAlarmList();
                break;
            //添加
            case "add":
                Add(context);
                break;
            //修改
            case "update":
                Update(context);
                break;
            //删除
            case "delete":
                Delete(context);
                break;
            //根据线路行别公里标获取支柱列表
            case "PoleList":
                getPoleList();
                break;
        }
    }
    /// <summary>
    /// 查询
    /// </summary>
    private void GetAlarmList()
    {
        string CATEGORY_CODE = HttpContext.Current.Request["CATEGORY_CODE"];//检测类型
        string POWER_SECTION_NAME = HttpContext.Current.Request["POWER_SECTION_NAME"];//供电段名称
        string POWER_SECTION_CODE = HttpContext.Current.Request["POWER_SECTION_CODE"];//供电段编码
        string LINE_NAME = HttpContext.Current.Request["LINE_NAME"];//线路名称
        string LINE_CODE = HttpContext.Current.Request["LINE_CODE"];//线路编码
        string DIRECTION = HttpContext.Current.Request["DIRECTION"];//行别
        string PROCESS_STATUS = HttpContext.Current.Request["PROCESS_STATUS"];//处理状态

        double START_KM = -1, END_KM = -1;
        if (!string.IsNullOrEmpty(HttpContext.Current.Request["START_KM"]))
        {
            START_KM = Convert.ToDouble(HttpContext.Current.Request["START_KM"]);//起止公里标 
        }
        if (!string.IsNullOrEmpty(HttpContext.Current.Request["END_KM"]))
        {
            END_KM = Convert.ToDouble(HttpContext.Current.Request["END_KM"]);//终止公里标
        }
        string REPORT_PROCESS = HttpContext.Current.Request["REPORT_PROCESS"];//分析/处理过程

        int pageIndex = Convert.ToInt32(HttpContext.Current.Request["page"]);//页码
        int pageSize = Convert.ToInt32(HttpContext.Current.Request["rp"]);//条数
        string strwhere = null;
        if (!string.IsNullOrEmpty(CATEGORY_CODE))
        {
            strwhere += " AND T.CATEGORY_CODE = '" + CATEGORY_CODE + "'";
        }
        if (!string.IsNullOrEmpty(POWER_SECTION_NAME) && POWER_SECTION_NAME != "全部")
        {
            strwhere += "AND T.POWER_SECTION_NAME = '" + POWER_SECTION_NAME + "'";
        }
        if (!string.IsNullOrEmpty(POWER_SECTION_CODE))
        {
            strwhere += "AND T.POWER_SECTION_CODE = '" + POWER_SECTION_CODE + "'";
        }
        if (!string.IsNullOrEmpty(LINE_NAME) && LINE_NAME != "全部")
        {
            strwhere += " AND T.LINE_NAME = '" + LINE_NAME + "'";
        }
        if (!string.IsNullOrEmpty(LINE_CODE))
        {
            strwhere += " AND T.LINE_CODE = '" + LINE_CODE + "'";
        }
        if (!string.IsNullOrEmpty(DIRECTION))
        {
            strwhere += " AND T.DIRECTION = '" + DIRECTION + "'";
        }
        if (string.IsNullOrEmpty(PROCESS_STATUS))
        {
            strwhere += " AND PROCESS_STATUS in('已销号','未销号')";
        }
        else
        {
            if (PROCESS_STATUS == "已销号")
                strwhere += " AND T.PROCESS_STATUS  ='已销号'";
            else if (PROCESS_STATUS == "未销号")
                strwhere += " AND T.PROCESS_STATUS  ='未销号'";
        }
        DateTime data = new DateTime();
        if (!string.IsNullOrEmpty(HttpContext.Current.Request["START_DATE"]))//起始检测日期
        {
            DateTime START_DATE = DateTime.Parse(HttpContext.Current.Request["START_DATE"]);

            if (START_DATE != data)
            {
                strwhere += " AND T.RAISED_TIME >= to_date ('" + START_DATE.ToString("yyyy/MM/dd HH:mm:ss") + "','yyyy/mm/dd hh24:mi:ss')";
            }
        }
        //终止检测日期
        if (!string.IsNullOrEmpty(HttpContext.Current.Request["END_DATE"]))
        {
            DateTime END_DATE = DateTime.Parse(HttpContext.Current.Request["END_DATE"]);

            if (END_DATE != data)
            {
                strwhere += " AND T.RAISED_TIME <= to_date('" + END_DATE.ToString("yyyy/MM/dd HH:mm:ss") + "','yyyy/mm/dd hh24:mi:ss')";
            }
        }
        if (!string.IsNullOrEmpty(START_KM.ToString()) && START_KM != -1)
        {
            strwhere += " AND T.KM_MARK >=" + START_KM;
        }
        if (!string.IsNullOrEmpty(END_KM.ToString()) && END_KM != -1)
        {
            strwhere += " AND T.KM_MARK <=" + END_KM;
        }


        if (!string.IsNullOrEmpty(REPORT_PROCESS))
        {
            if (REPORT_PROCESS == "分析过期")
                strwhere += " AND T.REPORT_OVERDUE  ='分析过期'";
            if (REPORT_PROCESS == "处理过期")
                strwhere += " AND T.PROCESS_OVERDUE  ='处理过期'";
        }

        string SEVERITY = HttpContext.Current.Request["SEVERITY"];
        if (string.IsNullOrEmpty(SEVERITY))
        {
            strwhere += " AND INSTR('"+GetSeverityDic()+"',SEVERITY)>0";//缺陷等级取数据字典
        }
        else
        {
            string s = "";
            if (SEVERITY.Contains(","))
            {
                string[] sev = SEVERITY.Split(',');
                for (int i = 0; i < sev.Count(); i++)
                {
                    s += "'" + Common.sysDictionaryDic[sev[i]].DIC_CODE + "',";
                }
                if (s.LastIndexOf(',') > -1)
                {
                    s = s.Substring(0, s.LastIndexOf(','));
                }
            }
            else
            {
                s += "'" + Common.sysDictionaryDic[SEVERITY].DIC_CODE + "'";
            }
            strwhere += " AND T.SEVERITY IN (" + s + ")";
        }
        //if (!string.IsNullOrEmpty(Public.GetUser_PermissionOrg))//数据权限过滤
        //{
        //    strwhere += " AND T.PROCESS_DEPTNAME LIKE '%" + Public.GetDeptName + "%'";
        //}
        string orgCode = Public.GetDataPermission_workshop();

        if (!string.IsNullOrEmpty(orgCode))
        {
            if (orgCode.IndexOf("GQ") > -1)
            {
                strwhere += " AND ORG_CODE IN (" + Public.Parsing(orgCode) + ")";//数据权限过滤
            }
            else
            {
                strwhere += " AND POWER_SECTION_CODE IN (" + Public.Parsing(orgCode) + ")";//数据权限过滤
            }
        }


        System.Data.DataSet ds = new DataSet();
        int startRowNum = 0, endRowNum = 0;
        if ((pageIndex != 0) && (pageSize != 0))// 计算翻页的起始与结束行号
        {
            startRowNum = (pageIndex - 1) * pageSize + 1;
            endRowNum = startRowNum + pageSize - 1;
        }
        string sql = "SELECT * FROM(SELECT ROW_NUMBER() OVER (order by T.RAISED_TIME desc )AS RowNO, T.*  from ALARM T ";//先把RAISED_TIME列降序，再为降序以后的每条RAISED_TIME记录返回一个序号
        if (!string.IsNullOrEmpty(strwhere))
        {
            if (!string.IsNullOrEmpty(strwhere.Trim()))
            {
                sql += string.Format(" WHERE 1=1 {0} ORDER BY T.RAISED_TIME DESC,LINE_CODE,DIRECTION,KM_MARK ASC", strwhere);
            }
        }
        sql += string.Format(" ) TT WHERE TT.RowNO between {0} and {1}", startRowNum, endRowNum);
        string sqlCount = string.Format("SELECT COUNT(1) FROM ALARM T  WHERE 1=1 {0}", strwhere);
        string count;
        object obj = Convert.ToInt32(DbHelperOra_ADO.GetSingle(sqlCount));
        if (obj == null)
            count = "0";
        else
            count = Convert.ToString(obj);
        ds = DbHelperOra_ADO.Query(sql);
        DataTable dt = ds.Tables[0];

        string jsonStr = "{'rows':[";
        if (dt.Rows.Count > 0)
        {
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                jsonStr += "{'ID':'" + dt.Rows[i]["ID"] + "',";//
                jsonStr += "'CATEGORY_CODE':'" + dt.Rows[i]["CATEGORY_CODE"] + "',";//问题来源
                DateTime raised_time = new DateTime();
                if (dt.Rows[i]["RAISED_TIME"] != System.DBNull.Value)
                {
                    raised_time = Convert.ToDateTime(ds.Tables[0].Rows[i]["RAISED_TIME"].ToString());
                }
                jsonStr += "'RAISED_TIME':'" + ((raised_time != null && raised_time == DateTime.MinValue) ? "" : raised_time.ToString("yyyy-MM-dd HH:mm:ss")) + "',";//检测监测日期
                jsonStr += "'RAISED_TIME_D':'" + ((raised_time != null && raised_time == DateTime.MinValue) ? "" : raised_time.ToString("yyyy-MM-dd")) + "',";//检测监测日期，只到年月日
                jsonStr += "'LINE_NAME':'" + dt.Rows[i]["LINE_NAME"] + "',";//线路名称
                jsonStr += "'LINE_CODE':'" + dt.Rows[i]["LINE_CODE"] + "',";//线路编码
                jsonStr += "'POSITION_CODE':'" + dt.Rows[i]["POSITION_CODE"] + "',";//站、区间
                    jsonStr += "'POSITION_NAME':'" + dt.Rows[i]["POSITION_NAME"] + "',";//区间名
                jsonStr += "'DIRECTION':'" + dt.Rows[i]["DIRECTION"] + "',";//行别   
                string KMMARK1 = PublicMethod.kmtoString1(dt.Rows[i]["km_mark"].ToString());
                jsonStr += "'KM_MARK':'" + KMMARK1 + "',";//公里标              
                jsonStr += "'POLE_NUMBER':'" + dt.Rows[i]["POLE_NUMber"] + "',";//支柱号
                DateTime report_date = new DateTime();
                if (dt.Rows[i]["REPORT_DATE"] != System.DBNull.Value)
                {
                    report_date = Convert.ToDateTime(ds.Tables[0].Rows[i]["REPORT_DATE"].ToString());
                }
                jsonStr += "'REPORT_DATE':'" + ((report_date != null && report_date == DateTime.MinValue) ? "" : report_date.ToString("yyyy-MM-dd HH:mm:ss")) + "',";//分析日期
                jsonStr += "'REPORT_DATE_D':'" + ((report_date != null && report_date == DateTime.MinValue) ? "" : report_date.ToString("yyyy-MM-dd")) + "',";//分析日期，只到年月日
                jsonStr += "'REPORT_PERSON':'" + dt.Rows[i]["REPORT_Person"] + "',";//分析人员
                jsonStr += "'REPORT_DEPTNAME':'" + dt.Rows[i]["REPORT_DEPTNAME"] + "',";//分析部门
                jsonStr += "'DEV_NAME':'" + dt.Rows[i]["DEV_NAME"] + "',";//缺陷部位

                try
                {
                    if (!string.IsNullOrEmpty(dt.Rows[i]["severity"].ToString()))
                    {
                        string sv = dt.Rows[i]["severity"].ToString();
                        switch (dt.Rows[i]["severity"].ToString())
                        {
                            case "二级":
                                sv = "二类";
                                break;
                            case "三级":
                                sv = "三类";
                                break;
                            case "一级":
                                sv = "一类";
                                break;
                            default:
                                break;
                        }
                        if (Common.sysDictionaryDic.ContainsKey(sv))
                        {
                            jsonStr += "'SEVERITY_NAME':'" + Api.Util.Common.sysDictionaryDic[sv].CODE_NAME + "',";//缺陷等级名称
                        }
                    }
                }
                catch (Exception ex) { }
                jsonStr += "'CODE_NAME':'" + dt.Rows[i]["CODE_NAME"] + "',";//缺陷类型
                jsonStr += "'DETAIL':'" + dt.Rows[i]["ALARM_ANALYSIS"] + "',";//缺陷描述
                jsonStr += "'PROCESS_DEPTNAME':'" + dt.Rows[i]["PROCESS_DEPTNAME"] + "',";//责任单位
                jsonStr += "'PROCESS_DEPTCODE':'" + GetOrgByCodeName(dt.Rows[i]["PROCESS_DEPTNAME"].ToString()).ORG_CODE + "',";
                DateTime process_date = new DateTime();
                if (dt.Rows[i]["PROCESS_DATE"] != System.DBNull.Value)
                {
                    process_date = Convert.ToDateTime(ds.Tables[0].Rows[i]["PROCESS_DATE"].ToString());
                }
                jsonStr += "'PROCESS_DATE':'" + ((process_date != null && process_date == DateTime.MinValue) ? "" : process_date.ToString("yyyy-MM-dd HH:mm:ss")) + "',";//整改日期
                jsonStr += "'PROCESS_DATE_D':'" + ((process_date != null && process_date == DateTime.MinValue) ? "" : process_date.ToString("yyyy-MM-dd")) + "',";//整改日期，只到年月日
                jsonStr += "'PROCESS_PERSON':'" + dt.Rows[i]["process_person"] + "',";//处理人
                jsonStr += "'PROCESS_STATUS':'" + dt.Rows[i]["PROCESS_STATUS"] + "',";//处理状态
                jsonStr += "'REPORT_OVERDUE':'" + dt.Rows[i]["REPORT_OVERDUE"] + "',";//分析过期
                jsonStr += "'PROCESS_OVERDUE':'" + dt.Rows[i]["PROCESS_OVERDUE"] + "',";//处理过期
                jsonStr += "'GIS_X':'" + dt.Rows[i]["GIS_X"] + "',";//经度
                jsonStr += "'GIS_Y':'" + dt.Rows[i]["GIS_Y"] + "',";//纬度
                jsonStr += "'feedback_situation':'" + dt.Rows[i]["CHECK_DETAILS"] + "',";//5C反馈/1234C复测/6C现场查看情况
                jsonStr += "'analysis_causes':'" + dt.Rows[i]["ALARM_REASON"] + "',";//原因分析
                jsonStr += "'deal_situation':'" + dt.Rows[i]["PROCESS_DETAILS"] + "',";//2345C处理/16C整改情况
                jsonStr += "'CHECK_RESULT':'" + dt.Rows[i]["CHECK_RESULT"] + "',";//复测结果

                string picpath = "", filepath = "", picname = "", filename = "";
                string fj = "", fjname = "";
                string cate = dt.Rows[i]["CATEGORY_CODE"].ToString();
                if (!string.IsNullOrEmpty(dt.Rows[i]["ATTACHMENT"].ToString()))
                {
                    picpath = "/" + dt.Rows[i]["ATTACHMENT"].ToString().Replace("\\", "/");//缺陷图片路径（12456C缺陷图片，3C缺陷报告）
                    picname = picpath.Substring(picpath.LastIndexOf("/") + 1, picpath.Length - picpath.LastIndexOf("/") - 1);//缺陷图片名
                }
                if (!string.IsNullOrEmpty(dt.Rows[i]["SVALUE14"].ToString()) && cate == "1C")
                {
                    filepath = "/" + dt.Rows[i]["SVALUE14"].ToString().Replace("\\", "/");//1C测量单路径
                    filename = filepath.Substring(filepath.LastIndexOf("/") + 1, filepath.Length - filepath.LastIndexOf("/") - 1);//1C测量单名称
                    fj = filepath;
                    fjname = filename;
                }
                if (!string.IsNullOrEmpty(dt.Rows[i]["SVALUE6"].ToString()) && cate=="3C")
                {
                    filepath = "/" + dt.Rows[i]["SVALUE6"].ToString().Replace("\\", "/");//3C反馈报告路径
                    filename = filepath.Substring(filepath.LastIndexOf("/") + 1, filepath.Length - filepath.LastIndexOf("/") - 1);//3C反馈报告名称
                    fj = filepath;
                    fjname = filename;
                }
                jsonStr += "'fj_pic':'" + picpath + "',";
                jsonStr += "'fj_pic_name':'" + picname + "',";
                jsonStr += "'fj_file':'" + filepath + "',";
                jsonStr += "'fj_file_name':'" + filename + "',";

                string recPath = getRepairPicPath(dt.Rows[i]["ID"].ToString());
                if (!string.IsNullOrEmpty(recPath) && (cate == "2C" || cate == "4C"))
                {
                    if (recPath.Split(';').Length > 1)//有两张以上整改后图片，取最后一张
                    {
                        recPath = recPath.Substring(recPath.LastIndexOf(";") + 1, recPath.Length - recPath.LastIndexOf(";") - 1);
                    }
                    jsonStr += "'rectify_pic':'" + recPath + "',";//24C整改后图片
                    recPath = recPath.Replace("/", "\\");
                    jsonStr += "'rectify_pic_name':'" + recPath.Substring(recPath.LastIndexOf("\\") + 1, (recPath.Length - recPath.LastIndexOf("\\") - 1)) + "',";//24C整改后图片名

                    fj = recPath.Replace("\\", "/");
                    fjname = recPath.Substring(recPath.Replace("/", "\\").LastIndexOf("\\") + 1, (recPath.Length - recPath.Replace("/", "\\").LastIndexOf("\\") - 1));
                }
                jsonStr += "'fj':'" + fj + "',";//GIS附件
                jsonStr += "'fj_name':'" + fjname + "',";//GIS附件名
                
                string WZ = "";

                string line_code = dt.Rows[i]["LINE_CODE"].ToString();

                if (line_code != null)
                {
                    WZ = dt.Rows[i]["LINE_NAME"].ToString() + " " + dt.Rows[i]["DIRECTION"].ToString() + " " + dt.Rows[i]["POSITION_NAME"].ToString() + " " + dt.Rows[i]["KM_MARK"].ToString() + " " + (!string.IsNullOrEmpty(dt.Rows[i]["POLE_NUMBER"].ToString()) ? dt.Rows[i]["POLE_NUMBER"].ToString() + "支柱" : "");
                }
                jsonStr += "'WZ':'" + WZ + "'";
                jsonStr += "},";

            }
        }
        if (jsonStr.LastIndexOf(',') > 0)
        {
            jsonStr = jsonStr.Substring(0, jsonStr.LastIndexOf(',')) + "],'page':" + pageIndex + ",'rp':" + pageSize + ",'total':" + count + "}";
        }
        else
        {
            jsonStr += "],'page':'" + pageIndex + "','rp':'" + pageSize + "','total':'" + count+ "'}";
        }
        jsonStr = myfiter.json_RemoveSpecialStr_N(jsonStr);
        jsonStr = jsonStr.Replace("'", "\"");
        HttpContext.Current.Response.Write(jsonStr);
    }

    /// <summary>
    /// 添加
    /// </summary>
    /// <param name="context"></param>
    private void Add(HttpContext context)
    {
        int rs = 0;
        try
        {
            Alarm Alarm = new Alarm();
            Alarm.CATEGORY_CODE = context.Request.Form["CATEGORY_CODE"];
            try
            {
                Alarm.RAISED_TIME = Convert.ToDateTime(HttpContext.Current.Request.Form["RAISED_TIME"]).Date ;//只取日期
            }
            catch (Exception ex)
            {
                Alarm.RAISED_TIME = new DateTime();
            }
            Alarm.LINE_NAME = context.Request.Form["LINE_NAME"];
            Alarm.LINE_CODE = context.Request.Form["LINE_CODE"];
            //Alarm.POSITION_CODE = context.Request.Form["POSITION_CODE"];
            if (!string.IsNullOrEmpty(HttpContext.Current.Request["POSITION_CODE"]))
            {
                Alarm.POSITION_CODE = HttpContext.Current.Request["POSITION_CODE"];
            }
            if (!string.IsNullOrEmpty(HttpContext.Current.Request["POSITION_NAME"]))
            {
                Alarm.POSITION_NAME = HttpContext.Current.Request["POSITION_NAME"];
            }
            Alarm.DIRECTION = context.Request.Form["DIRECTION"];
            if (!string.IsNullOrEmpty(context.Request.Form["KM_MARK"]))
                //Alarm.KM_MARK = Convert.ToInt32(Double.Parse(HttpContext.Current.Request.Form["KM_MARK"]) * 1000);
                Alarm.KM_MARK = PublicMethod.KmTom(HttpContext.Current.Request.Form["KM_MARK"]);

            Alarm.POLE_NUMBER = context.Request.Form["POLE_NUMBER"];
            try
            {
                Alarm.REPORT_DATE = Convert.ToDateTime(HttpContext.Current.Request.Form["REPORT_DATE"]).Date;
            }
            catch (Exception ex)
            {
                Alarm.REPORT_DATE = new DateTime();
            }
            Alarm.REPORT_PERSON = context.Request.Form["REPORT_PERSON"];
            Alarm.REPORT_DEPTNAME = context.Request.Form["REPORT_DEPTNAME"];
            Alarm.DEV_NAME = context.Request.Form["DEV_NAME"];
            Alarm.SEVERITY = PublicMethod.getSeverityCodeByCodeName(context.Request.Form["SEVERITY"]);
            Alarm.ALARM_ANALYSIS = context.Request.Form["DETAIL"];
            Alarm.CODE_NAME = context.Request.Form["CODE_NAME"];
            Alarm.PROCESS_DEPTNAME = context.Request.Form["PROCESS_DEPTNAME"];

            Alarm.POWER_SECTION_NAME = Alarm.PROCESS_DEPTNAME;
            Alarm.POWER_SECTION_CODE = GetOrgByCodeName(Alarm.POWER_SECTION_NAME).ORG_CODE;
            try
            {
                Alarm.PROCESS_DATE = Convert.ToDateTime(HttpContext.Current.Request.Form["PROCESS_DATE"]).Date;
            }
            catch (Exception ex)
            {
                Alarm.PROCESS_DATE = new DateTime();
            }
            Alarm.PROCESS_PERSON = context.Request.Form["PROCESS_PERSON"];
            Alarm.PROCESS_STATUS = context.Request.Form["PROCESS_STATUS"];
            //Alarm.PROCESS_DETAILS = context.Request.Form["PROCESS_DETAILS"];
            Alarm.REPORT_OVERDUE = PublicMethod.judgeOverDue("REPORT", Alarm.CATEGORY_CODE, Alarm.LINE_CODE, Alarm.SEVERITY, Alarm.RAISED_TIME, Alarm.REPORT_DATE);
            Alarm.PROCESS_OVERDUE = PublicMethod.judgeOverDue("PROCESS", Alarm.CATEGORY_CODE, Alarm.LINE_CODE, Alarm.SEVERITY, Alarm.REPORT_DATE, Alarm.PROCESS_DATE);

            string feedback_situation = context.Request.Form["feedback_situation"];//5C反馈/1234C复测/6C现场查看情况
            string analysis_causes = context.Request.Form["analysis_causes"];//原因分析
            string deal_situation = context.Request.Form["deal_situation"];//2345C处理/16C整改情况
            Alarm.CHECK_RESULT = context.Request.Form["CHECK_RESULT"];//复测结果

            string Picture = context.Request.Form["resource"];//各C缺陷图片
            if (!string.IsNullOrEmpty(Picture) && Picture != "-1")
            {
                Picture = Picture.Replace(";", "");//去掉末尾分号
                if (Picture.Substring(0, 1) == "\\" || Picture.Substring(0, 1) == "/")
                {
                    Picture = Picture.Substring(1, Picture.Length - 1);//去掉开头的斜杠
                }
                Picture = Picture.Replace("\\", "/");
            }

            string resourceFile = context.Request.Form["resourceFile"];//1C测量单，3C反馈报告
            if (!string.IsNullOrEmpty(resourceFile))
            {
                resourceFile = resourceFile.Replace(";", "");//去掉末尾分号
                if (resourceFile.Substring(0, 1) == "\\" || resourceFile.Substring(0, 1) == "/")
                {
                    resourceFile = resourceFile.Substring(1, resourceFile.Length - 1);//去掉开头的斜杠
                }
                resourceFile = resourceFile.Replace("\\", "/");
            }
            string resourceFileC3 = "";
            if(Alarm.CATEGORY_CODE == "3C")
            {
                resourceFileC3 = resourceFile;
                resourceFile = "";
            }
            string rectify_pic = context.Request.Form["rectify_pic"];//24C整改后图片
            rectify_pic = rectify_pic.Replace(";", "");//去掉末尾分号

            Alarm.POWER_SECTION_CODE = GetPositionByPositionName(Alarm.POSITION_NAME).POWER_SECTION_CODE;
            Alarm.POWER_SECTION_NAME = GetPositionByPositionName(Alarm.POSITION_NAME).POWER_SECTION_NAME;
            Alarm.ORG_CODE = Alarm.POWER_SECTION_CODE;
            Alarm.ORG_NAME = Alarm.POWER_SECTION_NAME;
            Alarm.BUREAU_CODE = GetOrgByCodeName(Alarm.POWER_SECTION_NAME).SUP_ORG_CODE;
            Alarm.BUREAU_NAME = GetOrgByCodeName(Alarm.POWER_SECTION_NAME).SUP_ORG_NAME;

            //匹配支柱
            Pole pole = null;
            if (Alarm.CATEGORY_CODE != "1C")
                pole = GetPole(Alarm.LINE_CODE, Alarm.POWER_SECTION_CODE, Alarm.DIRECTION, Alarm.POLE_NUMBER, Alarm.POSITION_NAME);
            else
                pole = string.IsNullOrEmpty(Alarm.LINE_CODE) ? null : getPoleInfoByEvent(Alarm.LINE_CODE, Alarm.KM_MARK, Alarm.DIRECTION, "", 50);//如果是1C缺陷，根据线路、行别、公里标、杆号、间距查找杆，找不到线路时则不查找

            if (pole != null)
            {
                if (!string.IsNullOrEmpty(pole.POLE_CODE))
                {
                    //匹配成功后更新位置信息，以支柱信息为准
                    Alarm.GIS_X = pole.GIS_LON;
                    Alarm.GIS_Y = pole.GIS_LAT;
                    Alarm.POSITION_CODE = pole.POSITION_CODE;
                    Alarm.POSITION_NAME = pole.POSITION_NAME;
                    Alarm.POLE_NUMBER = pole.POLE_NO;
                    Alarm.LINE_CODE = pole.LINE_CODE;
                    Alarm.ORG_CODE = pole.ORG_CODE;
                    Alarm.ORG_NAME = pole.ORG_NAME;
                    Alarm.POWER_SECTION_NAME = pole.POWER_SECTION_NAME;
                    Alarm.POWER_SECTION_CODE = pole.POWER_SECTION_CODE;
                    Alarm.BUREAU_CODE = pole.BUREAU_CODE;
                    Alarm.BUREAU_NAME = pole.BUREAU_NAME;
                    Alarm.POLE_NUMBER = pole.POLE_NO;
                }
            }
            string ID = Guid.NewGuid().ToString().Replace("-", "");
            if (!ADO.AlarmQuery.SelectExist(Alarm))
            {
                string sql_1 = string.Format(@"INSERT INTO ALARM (ID,CATEGORY_CODE,RAISED_TIME,LINE_NAME,LINE_CODE,POSITION_CODE,POSITION_NAME,DIRECTION,KM_MARK,POLE_NUMBER,DEV_NAME,SEVERITY,CODE_NAME,ALARM_ANALYSIS,REPORT_DATE,REPORT_PERSON,REPORT_DEPTNAME,PROCESS_DEPTNAME,PROCESS_DATE,PROCESS_PERSON,PROCESS_STATUS,PROCESS_DETAILS，SVALUE14,ATTACHMENT,REPORT_OVERDUE,PROCESS_OVERDUE,GIS_X,GIS_Y,ORG_CODE,ORG_NAME,POWER_SECTION_CODE,POWER_SECTION_NAME,BUREAU_CODE,BUREAU_NAME,CHECK_DETAILS,ALARM_REASON,CHECK_RESULT,SVALUE6) VALUES ('{0}','{1}',to_date('{2}','yyyy/mm/dd hh24:mi:ss'),'{3}','{4}','{5}','{6}','{7}',{8},'{9}','{10}','{11}','{12}','{13}',to_date('{14}','yyyy/mm/dd hh24:mi:ss'),'{15}','{16}','{17}',to_date('{18}','yyyy/mm/dd hh24:mi:ss'),'{19}','{20}','{21}','{22}','{23}','{24}','{25}','{26}','{27}','{28}','{29}','{30}','{31}','{32}','{33}','{34}','{35}','{36}','{37}')",
                    ID,
             Alarm.CATEGORY_CODE,
             Alarm.RAISED_TIME,
             Alarm.LINE_NAME,
             Alarm.LINE_CODE,
             Alarm.POSITION_CODE,
             Alarm.POSITION_NAME,
             Alarm.DIRECTION,
             Alarm.KM_MARK,
             Alarm.POLE_NUMBER,
             Alarm.DEV_NAME,
             Alarm.SEVERITY,
             Alarm.CODE_NAME,
             Alarm.ALARM_ANALYSIS,
             Alarm.REPORT_DATE,
             Alarm.REPORT_PERSON,
             Alarm.REPORT_DEPTNAME,
             Alarm.PROCESS_DEPTNAME,
             Alarm.PROCESS_DATE,
             Alarm.PROCESS_PERSON,
             Alarm.PROCESS_STATUS,
             deal_situation,
             resourceFile,
            Picture,
             Alarm.REPORT_OVERDUE,
             Alarm.PROCESS_OVERDUE,
             Alarm.GIS_X,
             Alarm.GIS_Y,
             Alarm.ORG_CODE,
             Alarm.ORG_NAME,
             Alarm.POWER_SECTION_CODE,
             Alarm.POWER_SECTION_NAME,
             Alarm.BUREAU_CODE,
             Alarm.BUREAU_NAME,
             feedback_situation,
             analysis_causes,
             Alarm.CHECK_RESULT,resourceFileC3);
                rs = DbHelperOra_ADO.ExecuteSql(sql_1);
            }
            else
            {
                rs = 0;//存在重复报警数据，不允许入库，提示已存在
            }
            if (rs == 1)
            {
                if (!string.IsNullOrEmpty(rectify_pic) && Alarm.CATEGORY_CODE != "3C")//3C为word文档，存入alarm表中的SVALUE14
                {
                    ADO.AlarmQuery.InsertRepairPicture(ID, "", rectify_pic);//保存整改后图片
                }
                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "问题库查询", "", Public.GetLoginIP, "问题库查询添加了新的缺陷" + context.Request.Form["LINE_NAME"] + context.Request.Form["LINE_CODE"], "", true);
            }
            else
            {
                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "问题库查询", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "问题库查询添加了新的缺陷" + context.Request.Form["LINE_NAME"] + context.Request.Form["LINE_CODE"], "", false);
            }
        }
        catch (Exception ex)
        {
            rs = 0;
        }
        HttpContext.Current.Response.Write(rs);
    }
    /// <summary>
    /// 删除
    /// </summary>
    /// <param name="context"></param>
    private void Delete(HttpContext context)
    {
        int rs = 0;
        string alarmid = HttpContext.Current.Request["ID"];
        Api.ServiceAccessor.GetAlarmService().InsertAlarmHis(alarmid);//保存在alarm_hist里面
        string ID = "";
        if (!string.IsNullOrEmpty(HttpContext.Current.Request["ID"]))
        {
            ID = HttpContext.Current.Request["ID"];
        }
        string sql = "DELETE FROM ALARM WHERE ID = '" + ID + "'";
        rs = DbHelperOra_ADO.ExecuteSql(sql);

        string picSql = "DELETE FROM ALARM_REPAIR_PICTURE WHERE ALARM_ID = '" + ID + "'";
        if (rs == 1)
        {
            DbHelperOra_ADO.ExecuteSql(picSql);//删除整改后图片
        }
        else
        {

        }
        string result = "";
        result = rs == 1 ? "1" : "-1";
        HttpContext.Current.Response.Write(result);
    }

    /// <summary>
    /// 修改
    /// </summary>
    /// <param name="context"></param>
    private void Update(HttpContext context)
    {
        int rs = 0;
        try
        {
            Alarm Alarm = new Alarm();
            if (!string.IsNullOrEmpty(HttpContext.Current.Request["ID"]))// 获取日期
            {
                Alarm.ID = HttpContext.Current.Request["ID"];
            }
            Alarm.CATEGORY_CODE = context.Request.Form["CATEGORY_CODE"];
            try
            {
                Alarm.RAISED_TIME = Convert.ToDateTime(HttpContext.Current.Request.Form["RAISED_TIME"]).Date;//只取日期
            }
            catch (Exception ex)
            {
                Alarm.RAISED_TIME = new DateTime();
            }
            Alarm.LINE_NAME = context.Request.Form["LINE_NAME"];
            Alarm.LINE_CODE = context.Request.Form["LINE_CODE"];
            Alarm.POSITION_CODE = context.Request.Form["POSITION_CODE"];
            Alarm.POSITION_NAME = context.Request.Form["POSITION_NAME"];
            Alarm.DIRECTION = context.Request.Form["DIRECTION"];
            //if (!string.IsNullOrEmpty(context.Request.Form["KM_MARK_M"]))
            //{
            //    Alarm.KM_MARK = int.Parse(HttpContext.Current.Request.Form["KM_MARK_M"]);
            //} 
            if (!string.IsNullOrEmpty(context.Request.Form["KM_MARK"]))
                //Alarm.KM_MARK = Convert.ToInt32(Double.Parse(HttpContext.Current.Request.Form["KM_MARK"]) * 1000);
                Alarm.KM_MARK = PublicMethod.KmTom(HttpContext.Current.Request.Form["KM_MARK"]);
            Alarm.POLE_NUMBER = context.Request.Form["POLE_NUMBER"];
            try
            {
                Alarm.REPORT_DATE = Convert.ToDateTime(HttpContext.Current.Request.Form["REPORT_DATE"]).Date;
            }
            catch (Exception ex)
            {
                Alarm.REPORT_DATE = new DateTime();
            }
            Alarm.REPORT_PERSON = context.Request.Form["REPORT_PERSON"];
            Alarm.REPORT_DEPTNAME = context.Request.Form["REPORT_DEPTNAME"];
            Alarm.DEV_NAME = context.Request.Form["DEV_NAME"];
            Alarm.SEVERITY = PublicMethod.getSeverityCodeByCodeName(context.Request.Form["SEVERITY"]);
            Alarm.ALARM_ANALYSIS = context.Request.Form["DETAIL"];
            Alarm.CODE_NAME = context.Request.Form["CODE_NAME"];
            Alarm.PROCESS_DEPTNAME = context.Request.Form["PROCESS_DEPTNAME"];

            Alarm.POWER_SECTION_NAME = Alarm.PROCESS_DEPTNAME;
            Alarm.POWER_SECTION_CODE = GetOrgByCodeName(Alarm.POWER_SECTION_NAME).ORG_CODE;

            try
            {
                Alarm.PROCESS_DATE = Convert.ToDateTime(HttpContext.Current.Request.Form["PROCESS_DATE"]).Date;//整改日期
            }
            catch (Exception ex)
            {
                Alarm.PROCESS_DATE = new DateTime();
            }
            Alarm.PROCESS_PERSON = context.Request.Form["PROCESS_PERSON"];
            Alarm.PROCESS_STATUS = context.Request.Form["PROCESS_STATUS"];
            //Alarm.PROCESS_DETAILS = context.Request.Form["PROCESS_DETAILS"];

            Alarm.REPORT_OVERDUE = PublicMethod.judgeOverDue("REPORT", Alarm.CATEGORY_CODE, Alarm.LINE_CODE, Alarm.SEVERITY, Alarm.RAISED_TIME, Alarm.REPORT_DATE);
            Alarm.PROCESS_OVERDUE = PublicMethod.judgeOverDue("PROCESS", Alarm.CATEGORY_CODE, Alarm.LINE_CODE, Alarm.SEVERITY, Alarm.REPORT_DATE, Alarm.PROCESS_DATE);

            string feedback_situation = context.Request.Form["feedback_situation"];//5C反馈/1234C复测/6C现场查看情况
            string analysis_causes = context.Request.Form["analysis_causes"];//原因分析
            string deal_situation = context.Request.Form["deal_situation"];//2345C处理/16C整改情况
            Alarm.CHECK_RESULT = context.Request.Form["CHECK_RESULT"];//复测结果

            string Picture = context.Request.Form["resource"];//各C缺陷图片地址
            if (!string.IsNullOrEmpty(Picture) && Picture != "-1")
            {
                Picture = Picture.Replace(";", "");//去掉末尾分号
                if (Picture.Substring(0, 1) == "\\" || Picture.Substring(0, 1) == "/")
                {
                    Picture = Picture.Substring(1, Picture.Length - 1);//去掉开头的斜杠
                }
                Picture = Picture.Replace("\\", "/");
            }

            string resourceFile = context.Request.Form["resourceFile"];//1C测量单，3C反馈报告
            if (!string.IsNullOrEmpty(resourceFile))
            {
                resourceFile = resourceFile.Replace(";", "");//去掉末尾分号
                if (resourceFile.Substring(0, 1) == "\\" || resourceFile.Substring(0, 1) == "/")
                {
                    resourceFile = resourceFile.Substring(1, resourceFile.Length - 1);//去掉开头的斜杠
                }
                resourceFile = resourceFile.Replace("\\", "/");
            }
            string resourceFileC3 = "";
            if (Alarm.CATEGORY_CODE == "3C")
            {
                resourceFileC3 = resourceFile;
                resourceFile = "";
            }

            string rectify_pic = context.Request.Form["rectify_pic"];//24C整改后图片
            if (!string.IsNullOrEmpty(rectify_pic))
            {
                rectify_pic = rectify_pic.Replace(";", "");//去掉末尾分号
            }
            Alarm.POWER_SECTION_CODE = GetPositionByPositionName(Alarm.POSITION_NAME).POWER_SECTION_CODE;
            Alarm.POWER_SECTION_NAME = GetPositionByPositionName(Alarm.POSITION_NAME).POWER_SECTION_NAME;
            Alarm.ORG_CODE = Alarm.POWER_SECTION_CODE;
            Alarm.ORG_NAME = Alarm.POWER_SECTION_NAME;
            Alarm.BUREAU_CODE = GetOrgByCodeName(Alarm.POWER_SECTION_NAME).SUP_ORG_CODE;
            Alarm.BUREAU_NAME = GetOrgByCodeName(Alarm.POWER_SECTION_NAME).SUP_ORG_NAME;
            //匹配支柱
            Pole pole = null;
            if (Alarm.CATEGORY_CODE != "1C")
                pole = GetPole(Alarm.LINE_CODE, Alarm.POWER_SECTION_CODE, Alarm.DIRECTION, Alarm.POLE_NUMBER, Alarm.POSITION_NAME);
            else
                pole = string.IsNullOrEmpty(Alarm.LINE_CODE) ? null : getPoleInfoByEvent(Alarm.LINE_CODE, Alarm.KM_MARK, Alarm.DIRECTION, "", 50);//如果是1C缺陷，根据线路、行别、公里标、杆号、间距查找杆，找不到线路时则不查找

            if (pole != null)
            {
                if (!string.IsNullOrEmpty(pole.POLE_CODE))
                {
                    //匹配成功后更新位置信息，以支柱信息为准
                    Alarm.GIS_X = pole.GIS_LON;
                    Alarm.GIS_Y = pole.GIS_LAT;
                    Alarm.POSITION_CODE = pole.POSITION_CODE;
                    Alarm.POSITION_NAME = pole.POSITION_NAME;
                    Alarm.POLE_NUMBER = pole.POLE_NO;
                    Alarm.LINE_CODE = pole.LINE_CODE;
                    Alarm.ORG_CODE = pole.ORG_CODE;
                    Alarm.ORG_NAME = pole.ORG_NAME;
                    Alarm.POWER_SECTION_NAME = pole.POWER_SECTION_NAME;
                    Alarm.POWER_SECTION_CODE = pole.POWER_SECTION_CODE;
                    Alarm.BUREAU_CODE = pole.BUREAU_CODE;
                    Alarm.BUREAU_NAME = pole.BUREAU_NAME;
                    Alarm.POLE_NUMBER = pole.POLE_NO;
                }
            }

            string sql = string.Format(@"UPDATE ALARM SET Alarm.CATEGORY_CODE = '{0}',Alarm.RAISED_TIME = TO_DATE('{1}','YYYY/MM/DD HH24:MI:SS'),Alarm.LINE_NAME='{2}',Alarm.LINE_CODE='{3}',Alarm.POSITION_CODE='{4}',Alarm.POSITION_NAME='{5}',Alarm.DIRECTION='{6}',Alarm.KM_MARK='{7}',Alarm.POLE_NUMBER='{8}',Alarm.DEV_NAME='{9}',Alarm.SEVERITY='{10}',CODE_NAME='{11}',Alarm.ALARM_ANALYSIS='{12}',Alarm.REPORT_DATE=TO_DATE('{13}','YYYY/MM/DD HH24:MI:SS'),Alarm.REPORT_PERSON= '{14}',Alarm.REPORT_DEPTNAME= '{15}',Alarm.PROCESS_DEPTNAME= '{16}',Alarm.PROCESS_DATE=TO_DATE('{17}','YYYY/MM/DD HH24:MI:SS'),Alarm.PROCESS_PERSON= '{18}',Alarm.PROCESS_STATUS= '{19}',Alarm.PROCESS_DETAILS= '{20}',Alarm.REPORT_OVERDUE='{21}',Alarm.PROCESS_OVERDUE = '{22}',Alarm.SVALUE14 = '{23}',Alarm.ATTACHMENT = '{24}',CHECK_DETAILS = '{25}',ALARM_REASON = '{26}', Alarm.CHECK_RESULT ='{27}',Alarm.GIS_X='{28}',Alarm.GIS_Y='{29}',Alarm.ORG_CODE='{30}',Alarm.ORG_NAME='{31}',Alarm.POWER_SECTION_CODE='{32}',Alarm.POWER_SECTION_NAME='{33}',Alarm.BUREAU_CODE='{34}',Alarm.BUREAU_NAME='{35}',Alarm.SVALUE6='{36}' WHERE ALARM.ID='{37}'",
        Alarm.CATEGORY_CODE,
        Alarm.RAISED_TIME,
        Alarm.LINE_NAME,
        Alarm.LINE_CODE,
        Alarm.POSITION_CODE,
        Alarm.POSITION_NAME,
        Alarm.DIRECTION,
        Alarm.KM_MARK,
        Alarm.POLE_NUMBER,
        Alarm.DEV_NAME,
        Alarm.SEVERITY,
        Alarm.CODE_NAME,
        Alarm.ALARM_ANALYSIS,
        Alarm.REPORT_DATE,
        Alarm.REPORT_PERSON,
        Alarm.REPORT_DEPTNAME,
        Alarm.PROCESS_DEPTNAME,
        Alarm.PROCESS_DATE,
        Alarm.PROCESS_PERSON,
        Alarm.PROCESS_STATUS,
        deal_situation,
        Alarm.REPORT_OVERDUE,
        Alarm.PROCESS_OVERDUE,
        resourceFile,
        Picture,
        feedback_situation,
        analysis_causes,
        Alarm.CHECK_RESULT,
        Alarm.GIS_X,
             Alarm.GIS_Y,
             Alarm.ORG_CODE,
             Alarm.ORG_NAME,
             Alarm.POWER_SECTION_CODE,
             Alarm.POWER_SECTION_NAME,
             Alarm.BUREAU_CODE,
             Alarm.BUREAU_NAME,resourceFileC3,
        Alarm.ID);
            rs = DbHelperOra_ADO.ExecuteSql(sql);

            if (rs == 1)
            {
                DataTable dt = ADO.AlarmQuery.QueryRepairPicture(Alarm.ID);
                if (dt.Rows.Count > 0)
                {
                    ADO.AlarmQuery.UpdateRepairPic_new(Alarm.ID, "", rectify_pic);
                }
                else
                {
                    ADO.AlarmQuery.InsertRepairPicture(Alarm.ID, "", rectify_pic);
                }
                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "问题库查询", "", Public.GetLoginIP, "问题库查询修改了新的缺陷" + context.Request.Form["LINE_NAME"] + context.Request.Form["LINE_CODE"], "", true);
            }
            else
            {
                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "问题库查询", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "问题库查询修改了新的缺陷" + context.Request.Form["LINE_NAME"] + context.Request.Form["LINE_CODE"], "", false);
            }
        }
        catch (Exception ex)
        {
            rs = 0;
        }
        HttpContext.Current.Response.Write(rs);
    }
    /// <summary>
    /// 附件路径JSON
    /// </summary>
    /// <param name="path"></param>
    /// <returns></returns>
    public string getSourcToJson(string source, string id)
    {
        StringBuilder json = new StringBuilder();
        string js = "";
        if (!string.IsNullOrEmpty(source))
        {
            source = source.Replace("\\", "/");
            foreach (string ss in source.Split(';'))
            {
                string type = "", path = "", name = "";
                if (!string.IsNullOrEmpty(ss))
                {
                    string eName = ss.Substring(ss.LastIndexOf(".") + 1, (ss.Length - ss.LastIndexOf(".") - 1)).Replace(";", "");//附件后缀名
                    if (eName.ToUpper() == "JPG" || eName.ToUpper() == "BMP" || eName.ToUpper() == "GIF" || eName.ToUpper() == "PNG")//附件为图片格式
                    {
                        type = "picture";
                    }
                    else
                    {
                        type = "file";
                    }
                    name = ss.Substring(ss.LastIndexOf("/") + 1, ss.Length - ss.LastIndexOf("/") - 1);
                    json.AppendFormat("{{\"type\":\"{0}\",\"path\":\"{1}\",\"name\":\"{2}\"}},", type, "/" + ss, name);
                }
            }
            string recPath = getRepairPicPath(id);
            if (!string.IsNullOrEmpty(recPath))
            {
                if (recPath.Split(';').Length > 1)//有两张以上整改后图片，取最后一张
                {
                    recPath = recPath.Substring(recPath.LastIndexOf(";") + 1, recPath.Length - recPath.LastIndexOf(";") - 1);
                }
                recPath = recPath.Replace("\\", "/");
                string recName = recPath.Substring(recPath.LastIndexOf("/") + 1, (recPath.Length - recPath.LastIndexOf("/") - 1));
                json.AppendFormat("{{\"type\":\"{0}\",\"path\":\"{1}\",\"name\":\"{2}\"}},", "rec_picture", recPath, recName);
            }
            js = json.ToString();
            if (js.LastIndexOf(',') > 0)//去掉最后一个逗号
            {
                js = js.Substring(0, js.LastIndexOf(','));
            }
            js = myfiter.json_RemoveSpecialStr_N(js);
        }
        return js;
    }
    /// <summary>
    /// 获取修后图片路径
    /// </summary>
    /// <param name="alarmid"></param>
    /// <returns></returns>
    private string getRepairPicPath(string alarmid)
    {
        string path = "";
        string repairPicSql = string.Format("select * from alarm_repair_picture where alarm_id = '{0}'", alarmid);
        DataSet ds = DbHelperOra.Query(repairPicSql);
        if (ds.Tables.Count > 0)
        {
            if (ds.Tables[0].Rows.Count > 0)
            {
                path = ds.Tables[0].Rows[0]["done_repair_picture"].ToString().Replace("\\", "/");
                //if (path.Substring(0, 1) == "\\" || path.Substring(0, 1) == "/")//去掉开头的斜杠
                //    path = path.Substring(1, path.Length - 1);
            }
        }
        return path;
    }
    /// <summary>
    /// 获取位置方法
    /// </summary>
    /// <param name="alarm"></param>
    /// <returns></returns>
    private string getWZInfo(Alarm alarm)
    {
        string WZ = "";
        if (alarm.LINE_CODE != null)
        {
            WZ = alarm.LINE_NAME + " " + alarm.POSITION_NAME + " " + PublicMethod.KmtoString(alarm.KM_MARK) + " " + (!string.IsNullOrEmpty(alarm.POLE_NUMBER) ? alarm.POLE_NUMBER + "支柱" : "");
        }
        //else
        //{
        //    WZ = "GPS信息：" + alarm.GIS_X + "，" + alarm.GIS_Y;
        //}
        return WZ;
    }


    public static Pole GetPole(string line, string power, string direction, string no, string posi)
    {
        PoleCond cond = new PoleCond();
        if (!string.IsNullOrEmpty(line))
            cond.LINE_CODE = line;
        if (!string.IsNullOrEmpty(power))
            cond.POWER_SECTION_CODE = power;
        if (!string.IsNullOrEmpty(direction))
            cond.POLE_DIRECTION = direction;
        if (!string.IsNullOrEmpty(no))
            cond.POLE_NO = no;
        cond.businssAnd = "POSITION_NAME IN (" + GetPosi(posi) + ")";
        IList<Pole> pole_lis = Api.ServiceAccessor.GetFoundationService().queryPole(cond);
        if (pole_lis.Count > 0)
            return pole_lis[0];
        else
            return null;
    }
    public static string GetPosi(string posi)
    {
        string str = "";
        if (posi.Replace("－", "-").Contains("-"))
        {
            string[] posi_lis = posi.Replace("－", "-").Split('-');
            str = "'" + posi_lis[0] + "－" + posi_lis[1] + "','" + posi_lis[1] + "－" + posi_lis[0] + "'";
        }
        else
        {
            str = "'" + posi + "'";
        }
        return str;
    }

    public static Organization GetOrgByCodeName(string orgname)
    {
        Organization re = new Organization();
        if (!string.IsNullOrEmpty(orgname))
        {
            Organization[] sd = Api.Util.Common.organizationDic.Values.ToArray();
            IList<Organization> dicList = (from l in sd where l.ORG_NAME == orgname select l).ToArray();
            if (dicList.Count > 0)
            {
                re = dicList[0];
            }
        }
        return re;
    }

    public static StationSection GetPositionByPositionName(string posiname)
    {
        StationSection re = new StationSection();
        if (!string.IsNullOrEmpty(posiname))
        {
            StationSection[] sd = Api.Util.Common.stationSectionDic.Values.ToArray();
            IList<StationSection> dicList = (from l in sd where l.POSITION_NAME == posiname select l).ToArray();
            if (dicList.Count > 0)
            {
                re = dicList[0];
            }
        }
        return re;
    }

    /// <summary>
    /// 根据线路、行别、公里标、杆号、间距查找杆
    /// </summary>
    /// <param name="lineCode"></param>
    /// <param name="kmstandard"></param>
    /// <param name="direction"></param>
    /// <param name="poleNo"></param>
    /// <param name="deltaRange"></param>
    /// <returns></returns>
    public static Pole getPoleInfoByEvent(string lineCode, int kmstandard, string direction, string poleNo, int deltaRange)
    {
        int dotCnt = 0;
        int minIdx = 0;
        uint tryTime = 0;
        // 获取到的支柱列表
        IList<Pole> poles = null;
        // 支柱查询条件
        PoleCond cond = new PoleCond();
        if (!string.IsNullOrEmpty(lineCode))
        {
            cond.LINE_CODE = lineCode;
        }
        if (!string.IsNullOrEmpty(direction))
        {
            cond.ORG_DIRECTION = direction;
        }
        if (!string.IsNullOrEmpty(poleNo))
        {
            cond.POLE_NO = poleNo;
        }
        // 确定当前公里标附近的支柱
        cond.startKm = kmstandard - deltaRange;
        cond.endKm = kmstandard + deltaRange;
        poles = Api.ServiceAccessor.GetFoundationService().queryPole(cond, true);
        dotCnt = poles.Count;
        // 如果没有查到支柱,则返回一个空支柱对象
        if (poles.Count < 1)
        {
            return new Pole();
        }
        // 计算找到的位置与当前公里标之间的具体距离
        List<ulong> distList = new List<ulong>();
        foreach (Pole pole in poles)
        {
            distList.Add(Convert.ToUInt64(Math.Abs(Convert.ToInt64(pole.KMSTANDARD)
                    - Convert.ToInt64(kmstandard))));
        }
        // 找出最小距离处的索引
        minIdx = distList.IndexOf(distList.Min());
        // 找出对应的支柱信息并返回
        return poles[minIdx];
    }
    /// <summary>
    /// 获取支柱列表
    /// </summary>
    public void getPoleList()
    {
        //线路
        string lineCode = HttpContext.Current.Request["LINE_CODE"];
        //行别
        string direction = HttpContext.Current.Request["DIRECTION"];
        //区站
        string positionCode = HttpContext.Current.Request["POSITION_CODE"];
        //杆号
        string pole_no = HttpContext.Current.Request["pole_no"];
        //公里标
        string km_mark = HttpContext.Current.Request["Km_no"];
        //前台页码
        int pageIndex = !string.IsNullOrEmpty(HttpContext.Current.Request["pageIndex"]) ? Convert.ToInt32(HttpContext.Current.Request["pageIndex"]) : 1;
        //前台条数
        int pageSize = !string.IsNullOrEmpty(HttpContext.Current.Request["pageSize"]) ? Convert.ToInt32(HttpContext.Current.Request["pageSize"]) : 30;

        PoleCond polecond = new PoleCond();
        polecond.businssAnd += " 1=1 ";
        if (!string.IsNullOrEmpty(pole_no))
        {
            pole_no = pole_no.Replace("%23", "#");
        }
        if (!string.IsNullOrEmpty(lineCode))
        {
            polecond.LINE_CODE = lineCode;
        }
        if (!string.IsNullOrEmpty(direction))
        {
            polecond.ORG_DIRECTION = direction;
        }
        if (!string.IsNullOrEmpty(positionCode))
        {
            polecond.POSITION_CODE = positionCode;
        }
        if (!string.IsNullOrEmpty(pole_no))
        {
            if (!string.IsNullOrEmpty(polecond.businssAnd))
            {
                polecond.businssAnd += " AND ";
            }

            polecond.businssAnd += string.Format(" POLE_NO LIKE '%{0}%'", pole_no);//支柱号模糊匹配
        }
        if (!string.IsNullOrEmpty(km_mark))
        {
            if (km_mark.IndexOf(".") > -1)
            {
                km_mark = km_mark.Replace(".", "");
            }
            if (!string.IsNullOrEmpty(polecond.businssAnd))
            {
                polecond.businssAnd += " AND ";
            }

            polecond.businssAnd += string.Format(" KMSTANDARD LIKE '%{0}%'", km_mark);//公里标整数部分模糊匹配
        }
        polecond.pageSize = pageSize;
        polecond.pageNum = pageIndex;
        polecond.orderBy = "KMSTANDARD ASC";

        StringBuilder json = new StringBuilder();

        json.Append("{\"data\":[");

        IList<Pole> poleList = Api.ServiceAccessor.GetFoundationService().queryPolePage(polecond, true);

        for (int i = 0; i < poleList.Count; i++)
        {
            json.Append("{\"KM\":\"" + PublicMethod.kmtoString1(poleList[i].KMSTANDARD.ToString()) + "\",");
            json.Append("\"POLE_CODE\":\"" + poleList[i].POLE_CODE + "\",");
            json.Append("\"POLE_NO\":\"" + poleList[i].POLE_NO + "\"}");
            if (i < poleList.Count - 1)
            {
                json.Append(",");
            }
        }
        json.Append("]");

        PageHelper ph = new PageHelper();
        int total = 0;
        if (poleList.Count > 0)
        {
            total = Convert.ToInt32(poleList[0].MY_INT_1);
        }
        json.Append("," + ph.getPageJson(total, pageIndex, pageSize) + "}");

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }
    private static string GetSeverityDic()
    {
        string sql = "select * from sys_dic where p_code = 'SEVERITY'";
        System.Data.DataSet ds = DbHelperOra_ADO.Query(sql);
        string severity = "";
        if (ds.Tables.Count > 0)
        {
            if (ds.Tables[0].Rows.Count > 0)
            {
                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    DataRow dr = ds.Tables[0].Rows[i];
                    severity += dr["DIC_CODE"].ToString() + ",";
                }
                if (severity.LastIndexOf(',') > 0)//去掉最后一个逗号
                {
                    severity = severity.Substring(0, severity.LastIndexOf(','));
                }
            }
        }
        return severity;
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }
}