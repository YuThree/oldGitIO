<%@ WebHandler Language="C#" Class="GetAlarmTeleList" %>
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

public class GetAlarmTeleList : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        string type = HttpContext.Current.Request["type"];//获取类型
        switch (type)
        {
            case "all":
                GetYuanDongList();
                break;
            case "add":
                Add(context);
                break;
            case "update":
                Update(context);
                break;
            case "delete":
                Delete();
                break;
        }
    }
    /// <summary>
    /// 远动问题库列表查询
    /// </summary>
    private void GetYuanDongList()
    {
        int pageIndex = Convert.ToInt32(HttpContext.Current.Request["page"]);//页码
        int pageSize = Convert.ToInt32(HttpContext.Current.Request["rp"]);//条数

        StringBuilder strWhere = new StringBuilder("");//查询条件
        if (!String.IsNullOrEmpty(HttpContext.Current.Request["question_classify"]))//问题分类
        {
            string question_classify = HttpContext.Current.Request["question_classify"];
            strWhere.AppendFormat(" AND QUESTION_CLASSIFY = '{0}'", question_classify);
        }
        if (!String.IsNullOrEmpty(HttpContext.Current.Request["lv"]))//问题等级
        {
            string lv = HttpContext.Current.Request["lv"];
            strWhere.AppendFormat(" AND LV = '{0}'", lv);
        }
        if (!String.IsNullOrEmpty(HttpContext.Current.Request["major_classify"]))//专业分类
        {
            string major_classify = HttpContext.Current.Request["major_classify"];
            strWhere.AppendFormat(" AND MAJOR_CLASSIFY = '{0}'", major_classify);
        }
        if (!String.IsNullOrEmpty(HttpContext.Current.Request["location"]))//处所
        {
            string location = HttpContext.Current.Request["location"];
            strWhere.AppendFormat(" AND LOCATION LIKE '%{0}%'", location);
        }
        if (!String.IsNullOrEmpty(HttpContext.Current.Request["duty_units"]))//负责单位
        {
            string duty_units = HttpContext.Current.Request["duty_units"];
            strWhere.AppendFormat(" AND DUTY_UNITS LIKE '%{0}%'", duty_units);
        }
        if (!String.IsNullOrEmpty(HttpContext.Current.Request["process_status"]))//销号状态
        {
            string process_status = HttpContext.Current.Request["process_status"];
            strWhere.AppendFormat(" AND PROCESS_STATUS = '{0}'", process_status);
        }
        if (!string.IsNullOrEmpty(HttpContext.Current.Request["start_date"]) && HttpContext.Current.Request["start_date"] != "0001/1/1 0:00:00")//起始日期
        {
            DateTime start_date = DateTime.Parse(HttpContext.Current.Request["start_date"]);
            strWhere.AppendFormat(" AND HAPPEN_DATE >= TO_DATE('{0}','yyyy/mm/dd hh24:mi:ss')", start_date.ToString("yyyy/MM/dd HH:mm:ss"));
        }
        if (!string.IsNullOrEmpty(HttpContext.Current.Request["end_date"]) && HttpContext.Current.Request["end_date"] != "0001/1/1 0:00:00")//终止日期
        {
            DateTime end_date = DateTime.Parse(HttpContext.Current.Request["end_date"]);
            strWhere.AppendFormat(" AND HAPPEN_DATE <= TO_DATE('{0}','yyyy/mm/dd hh24:mi:ss')", end_date.ToString("yyyy/MM/dd HH:mm:ss"));
        }
        strWhere.Append(" AND PROCESS_STATUS IS NOT NULL ");

        string orgCode = Public.GetDataPermission_workshop();
        if (!string.IsNullOrEmpty(orgCode))
        {
            strWhere.AppendFormat(" AND INSTR(DUTY_UNITS_CODE,'{0}')>0", orgCode);//数据权限过滤
        }
        int startRowNum = 0, endRowNum = 0;
        if ((pageIndex != 0) && (pageSize != 0))// 计算翻页的起始与结束行号
        {
            startRowNum = (pageIndex - 1) * pageSize + 1;
            endRowNum = startRowNum + pageSize - 1;

            string selectsql = string.Format("SELECT * FROM ( SELECT ROWNUM RowNO, A.* FROM (SELECT T.*  from ALARM_TELEMECHANIC T WHERE 1=1 {0} ORDER BY HAPPEN_DATE DESC) A ) TT WHERE TT.RowNO between {1} and {2}", strWhere, startRowNum, endRowNum);

            List<Api.ADO.entity.AlarmTelemechanic> list = ADO.Alarm_Telemechanic.getAlarmTelemechanicList(selectsql);
            //获取总条数
            int recordCount = ADO.Alarm_Telemechanic.selectAlarmTeleCount(strWhere.ToString());

            StringBuilder sb = new StringBuilder();
            sb.Append("{\"rows\":[");

            foreach (Api.ADO.entity.AlarmTelemechanic a in list)
            {
                string happenDate = "", rectifyDate = "", rectifyDate_t = "";
                //if(!string.IsNullOrEmpty(a.HAPPEN_DATE.ToString()) && a.HAPPEN_DATE != new DateTime())
                //{
                //    happenDate = a.HAPPEN_DATE.ToString();
                //}
                if (!string.IsNullOrEmpty(a.HAPPEN_DATE.ToString()) && a.HAPPEN_DATE != new DateTime())//发生日期格式转换
                {
                    happenDate = a.HAPPEN_DATE.Year.ToString() + "年" + a.HAPPEN_DATE.Month.ToString() + "月" + a.HAPPEN_DATE.Day.ToString() + "日";
                }
                if (!string.IsNullOrEmpty(a.RECTIFY_DATE.ToString()) && a.RECTIFY_DATE != new DateTime())//整改日期格式转换
                {
                    rectifyDate = a.RECTIFY_DATE.Year.ToString() + "年" + a.RECTIFY_DATE.Month.ToString() + "月" + a.RECTIFY_DATE.Day.ToString() + "日";
                }
                if (!string.IsNullOrEmpty(a.RECTIFY_DATE.ToString()) && a.RECTIFY_DATE != new DateTime())//整改日期格式转换
                {
                    rectifyDate_t = a.RECTIFY_DATE.ToString("yyyy-MM-dd HH:mm:ss");
                }

                //string picallpath = "",fileallpath="";
                //string picName = "", fileName = "";
                //string dir_path = "";
                //string name = a.ACCESSORY.Replace("\\", "/");//附件名
                //string eName = name.Substring(name.LastIndexOf(".") + 1, (name.Length - name.LastIndexOf(".") - 1)).Replace(";", "");//附件后缀名
                //if (!string.IsNullOrEmpty(a.PATH) && !string.IsNullOrEmpty(a.ACCESSORY))
                //{
                //    dir_path = "/" + a.PATH.Replace("\\", "/");
                //}
                //string fj = PublicMethod.GetHttp()+ dir_path.Replace("\\", "/") + "/" + name;
                //if (eName.ToUpper() == "JPG" || eName.ToUpper() == "BMP" || eName.ToUpper() == "GIF" || eName.ToUpper() == "PNG")//附件为图片格式
                //{
                //    picallpath =  dir_path.Replace("\\", "/") + "/" + name;//附件路径
                //    picName = name;
                //}
                //else//该文件为非图片格式
                //{
                //    fileallpath =  dir_path.Replace("\\", "/") + "/" + name;//附件路径
                //    fileName = name;
                //}

                sb.AppendFormat("{{\"id\":\"{0}\",\"location\":\"{1}\",\"HAPPEN_DATE\":\"{2}\", \"QUESTION_CLASSIFY\":\"{3}\",\"MAJOR_CLASSIFY\":\"{4}\", \"CONTENT\":\"{5}\",\"CAUSE\":\"{6}\",\"LV\":\"{7}\",\"RECTIFY_DATE\":\"{8}\",\"DUTY_UNITS\":\"{9}\",\"HANDLER\":\"{10}\",\"DETAIL\":\"{11}\",\"process_status\":\"{12}\",\"before_repair_pic\":\"{13}\",\"after_repair_pic\":\"{14}\",\"HAPPEN_DATE_T\":\"{15}\",\"RECTIFY_DATE_T\":\"{16}\"}},", myfiter.json_RemoveSpecialStr(a.ID), myfiter.json_RemoveSpecialStr(JsonFilter(a.LOCATION)), myfiter.json_RemoveSpecialStr(happenDate), myfiter.json_RemoveSpecialStr(a.QUESTION_CLASSIFY), myfiter.json_RemoveSpecialStr(a.MAJOR_CLASSIFY), myfiter.json_RemoveSpecialStr(JsonFilter(a.CONTENT)), myfiter.json_RemoveSpecialStr(JsonFilter(a.CAUSE)), myfiter.json_RemoveSpecialStr(a.LV), myfiter.json_RemoveSpecialStr(rectifyDate), myfiter.json_RemoveSpecialStr(a.DUTY_UNITS), myfiter.json_RemoveSpecialStr(JsonFilter(a.HANDLER)), myfiter.json_RemoveSpecialStr(JsonFilter(a.ACCESSORY)), myfiter.json_RemoveSpecialStr(a.PROCESS_STATUS), myfiter.json_RemoveSpecialStr(a.BEFORE_REPAIR_PIC.Replace(";", "")), myfiter.json_RemoveSpecialStr(a.AFTER_REPAIR_PIC.Replace(";", "")), myfiter.json_RemoveSpecialStr(a.HAPPEN_DATE.ToString("yyyy-MM-dd HH:mm:ss")), myfiter.json_RemoveSpecialStr(rectifyDate_t));
            }
            string js = sb.ToString();
            if (js.LastIndexOf(',') > -1)
            {
                js = js.Substring(0, js.LastIndexOf(','));
            }
            js += String.Format("],\"page\":{0},\"rp\":{1},\"total\":{2}}}", pageIndex, pageSize, recordCount);
            HttpContext.Current.Response.Write(js);
        }
    }
    /// <summary>
    /// 添加远动问题数据
    /// </summary>
    /// <param name="context"></param>
    private void Add(HttpContext context)
    {
        int rs = 0;
        try
        {
            string question_classify = context.Request.Form["question_classify"].Trim();//问题分类
            DateTime happen_date = new DateTime();
            try
            {
                happen_date = Convert.ToDateTime(context.Request.Form["happen_date"]);//时间
            }
            catch (Exception ex) { }
            string lv = context.Request.Form["lv"];//问题等级
            string major_classify = context.Request.Form["major_classify"].Trim();//专业分类
            string location = HttpContext.Current.Request["location"];//处所
            string content = context.Request.Form["content"];//问题内容
            string duty_units = context.Request.Form["duty_units"].Replace("，", ",");//责任单位
            //if (duty_units.LastIndexOf(',') > -1)
            //{
            //    duty_units = duty_units.Substring(0, duty_units.LastIndexOf(','));
            //}
            string duty_units_code = getOrgCode(duty_units);//责任单位编码
            DateTime rectify_date = new DateTime();
            try
            {
                rectify_date = Convert.ToDateTime(context.Request.Form["rectify_date"]);//整改日期
            }
            catch (Exception ex) { }
            string handler = context.Request.Form["handler"];//处理人
            string cause = context.Request.Form["cause"];//问题原因
            string before_repair_pic = context.Request.Form["before_repair_pic"];//整改前图片
            string after_repair_pic = context.Request.Form["after_repair_pic"];//整改后图片

            if (!string.IsNullOrEmpty(before_repair_pic))
            {
                before_repair_pic = before_repair_pic.Replace("\\", "/").Replace(";", "");
            }
            if (!string.IsNullOrEmpty(after_repair_pic))
            {
                after_repair_pic = after_repair_pic.Replace("\\", "/").Replace(";", "");
            }
            string DETAIL = context.Request.Form["DETAIL"];//问题处理详情
            string PROCESS_STATUS = context.Request.Form["process_status"];//销号状态

            string insertsql = string.Format(@"INSERT INTO ALARM_TELEMECHANIC (ID,HAPPEN_DATE,LOCATION,QUESTION_CLASSIFY,MAJOR_CLASSIFY,CONTENT,LV,DUTY_UNITS,RECTIFY_DATE,HANDLER,CAUSE,ACCESSORY,PROCESS_STATUS，BEFORE_REPAIR_PIC,AFTER_REPAIR_PIC,DUTY_UNITS_CODE) VALUES ('{0}',to_date('{1}','yyyy/mm/dd hh24:mi:ss'),'{2}','{3}','{4}','{5}','{6}','{7}',to_date('{8}','yyyy/mm/dd hh24:mi:ss'),'{9}','{10}','{11}','{12}','{13}','{14}','{15}')", Guid.NewGuid().ToString().Replace("-", ""), happen_date, myfiter.Filter_Script(location), question_classify, major_classify, myfiter.Filter_Script(content), lv, duty_units, rectify_date, myfiter.Filter_Script(handler), myfiter.Filter_Script(cause), myfiter.Filter_Script(DETAIL), PROCESS_STATUS, before_repair_pic, after_repair_pic, duty_units_code);

            rs = DbHelperOra_ADO.ExecuteSql(insertsql);//int rs=0,添加失败；int rs=1,添加成功
            if (rs == 1)
            {
                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "远动问题库", "", Public.GetLoginIP, "远动库添加了新的问题" + context.Request.Form["question_classify"] + context.Request.Form["lv"], "", true);
            }
            else
            {
                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "远动问题库", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "远动库添加了新的问题" + context.Request.Form["question_classify"] + context.Request.Form["lv"], "", false);
            }
        }
        catch (Exception ex)
        {
            rs = 0;
        }
        HttpContext.Current.Response.Write(rs);
    }

    /// <summary>
    /// 修改远动问题数据
    /// </summary>
    /// <param name="context"></param>
    private void Update(HttpContext context)
    {
        int rs = 0;
        try
        {
            string id = context.Request["id"];
            string question_classify = context.Request.Form["question_classify"];//问题分类
            DateTime happen_date = new DateTime();
            try
            {
                happen_date = Convert.ToDateTime(context.Request.Form["happen_date"]);//时间
            }
            catch (Exception ex) { }
            string lv = context.Request.Form["lv"];//问题等级
            string major_classify = context.Request.Form["major_classify"];//专业分类
            string location = HttpContext.Current.Request["location"];//处所
            string content = context.Request.Form["content"];//问题内容
            string duty_units = context.Request.Form["duty_units"].Replace("，", ",");//责任单位
                                                                                     //if (duty_units.LastIndexOf(',') > -1)
                                                                                     //{
                                                                                     //    duty_units = duty_units.Substring(0, duty_units.LastIndexOf(','));
                                                                                     //}
            string duty_units_code = getOrgCode(duty_units);//责任单位编码
            DateTime rectify_date = new DateTime();
            try
            {
                rectify_date = Convert.ToDateTime(context.Request.Form["rectify_date"]);//整改日期
            }
            catch (Exception ex) { }
            string handler = context.Request.Form["handler"];//处理人
            string cause = context.Request.Form["cause"];//问题原因
            string before_repair_pic = context.Request.Form["before_repair_pic"];//整改前图片
            string after_repair_pic = context.Request.Form["after_repair_pic"];//整改后图片

            if (!string.IsNullOrEmpty(before_repair_pic))
            {
                before_repair_pic = before_repair_pic.Replace("\\", "/").Replace(";", "");
            }
            if (!string.IsNullOrEmpty(after_repair_pic))
            {
                after_repair_pic = after_repair_pic.Replace("\\", "/").Replace(";", "");
            }
            string DETAIL = context.Request.Form["DETAIL"];
            string PROCESS_STATUS = context.Request.Form["process_status"];//销号状态

            string updatesql = String.Format(@"UPDATE ALARM_TELEMECHANIC SET HAPPEN_DATE = TO_DATE('{0}','YYYY/MM/DD HH24:MI:SS'),LOCATION = '{1}',QUESTION_CLASSIFY='{2}',MAJOR_CLASSIFY='{3}',CONTENT='{4}',LV='{5}',DUTY_UNITS='{6}',RECTIFY_DATE = TO_DATE('{7}','YYYY/MM/DD HH24:MI:SS'),HANDLER='{8}',CAUSE='{9}',ACCESSORY='{10}',PROCESS_STATUS='{11}',BEFORE_REPAIR_PIC='{12}',AFTER_REPAIR_PIC='{13}',DUTY_UNITS_CODE='{14}' WHERE ID='{15}'", happen_date, myfiter.Filter_Script(location), question_classify, major_classify, myfiter.Filter_Script(content), lv, duty_units, rectify_date, myfiter.Filter_Script(handler), myfiter.Filter_Script(cause), myfiter.Filter_Script(DETAIL), PROCESS_STATUS, before_repair_pic, after_repair_pic, duty_units_code, id);

            rs = DbHelperOra_ADO.ExecuteSql(updatesql);//int rs=0,修改失败；int rs=1,修改成功
            if (rs == 1)
            {
                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "远动问题库", "", Public.GetLoginIP, "远动库修改了问题" + context.Request.Form["question_classify"] + context.Request.Form["lv"], "", true);
            }
            else
            {
                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "远动问题库", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "远动库修改了问题" + context.Request.Form["question_classify"] + context.Request.Form["lv"], "", false);
            }
        }
        catch (Exception ex)
        {
            rs = 0;
        }
        HttpContext.Current.Response.Write(rs);
    }
    /// <summary>
    /// 删除远动问题数据
    /// </summary>
    private void Delete()
    {
        int rs = 0;
        string id = HttpContext.Current.Request["id"];
        //Api.ServiceAccessor.GetAlarmService().InsertAlarmHis(id);//保存在alarm_hist里面

        String sql = "DELETE FROM ALARM_TELEMECHANIC WHERE ID = '" + id + "'";

        rs = DbHelperOra_ADO.ExecuteSql(sql);
        if (rs == 1)
        {
            Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "远动问题库", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "远动库删除了问题" + HttpContext.Current.Request["ID"], "", true);
        }
        else
        {
            Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "远动问题库", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "远动库删除了问题" + HttpContext.Current.Request["ID"], "", false);
        }
        HttpContext.Current.Response.Write(rs);
    }

    /// <summary>
    /// 过滤JSON特殊字符
    /// </summary>
    /// <param name="value"></param>
    /// <returns></returns>
    public static String JsonFilter(String value)
    {
        if (value == null) { return null; }

        value = value.Replace("&lt;", "<")
                     .Replace("&gt;", ">")
                     .Replace("&quot;", "\"")
                     .Replace("&#39;", "\'")
                     .Replace("&#37;", "%")
                     .Replace("&#59;", ";")
                     .Replace("&#40;", "(")
                     .Replace("&#41;", ")")
                     .Replace("&amp;", "&")
                     .Replace("&#43;", "+");
        return value.Replace("\"", "”").Replace("'", "‘").Replace("\\", "/");
    }
    /// <summary>
    /// 获取多个组织机构编码
    /// </summary>
    /// <param name="orgname"></param>
    /// <returns></returns>
    public static string getOrgCode(string orgname)
    {
        string orgcode = "";
        if (!string.IsNullOrEmpty(orgname))
        {
            if (orgname.IndexOf(',') > -1)
            {
                string[] name = orgname.Split(',');
                for (int i = 0; i < name.Count(); i++)
                {
                    if (!string.IsNullOrEmpty(name[i]))
                        orgcode += GetOrgByCodeName(name[i]).ORG_CODE + ",";
                }
                if (orgcode.LastIndexOf(',') > -1)
                {
                    orgcode = orgcode.Substring(0, orgcode.LastIndexOf(','));
                }
            }
            else
            {
                orgcode = GetOrgByCodeName(orgname).ORG_CODE;
            }
        }
        return orgcode;
    }

    /// <summary>
    /// 根据组织机构名获取编码
    /// </summary>
    /// <param name="orgname"></param>
    /// <returns></returns>
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
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }
}