<%@ WebHandler Language="C#" Class="PlanManageForm" %>

using System;
using System.Web;
using System.Web.SessionState;
using ADO;
using System.Data;
using System.Reflection;
using System.Linq;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;
using Api.Fault.entity.alarm;
using Api.Task.entity;
using Api.Util;
using Fault.Dao;
using Api.Foundation.entity.Foundation;


public class PlanManageForm : ReferenceClass, IHttpHandler, IRequiresSessionState
{

    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "text/plain";
        String type = context.Request["type"];
        string action = context.Request["action"];

        if (!String.IsNullOrEmpty(type))
        {
            switch (type)
            {
                ///获取检测计划列表
                case "QUERY":
                    getAllList(context);
                    break;
                ///删除检测计划
                case "DELETE":
                    deletePlan(context);
                    break;
                ///修改检测计划
                case "EDIT":
                    updatePlan(context);
                    break;
            }
        }
    }

    /// <summary>
    /// 获取检测计划列表
    /// </summary>
    /// <param name="context"></param>
    public void getAllList(HttpContext context)
    {
        string plan_id = context.Request["plan_id"];
        string start_date = context.Request["start_date"];
        string end_date = context.Request["end_date"];
        string passen_dept = context.Request["passen_dept"];
        string line_code = context.Request["line_code"];
        string direction = context.Request["direction"];
        string index = context.Request["page_index"];
        string number = context.Request["page_number"];
        int inde = int.Parse(string.IsNullOrEmpty(index) ? "0" : index);
        int num = int.Parse(string.IsNullOrEmpty(number) ? "0" : number);

        System.Data.DataSet ds = PlanDal.getPlanList(plan_id, start_date, end_date, passen_dept, line_code, direction);

        StringBuilder json = new StringBuilder();
        if (ds.Tables.Count > 0)
        {
            List<PLAN_TASK> lis = ModelConvertHelper<PLAN_TASK>.ConvertToModel(ds.Tables[0]);
            List<List<PLAN_TASK>> tasks = lis.GroupBy(x => x.PLAN_ID).Select(y => y.ToList()).ToList();
            int total = tasks.Count;
            if (inde != 0 && num != 0)
                tasks = tasks.Skip((inde - 1) * num).Take(inde * num).ToList();
            json = getJson(tasks, index, number, total);
        }
        context.Response.Write(json.ToString());
    }

    /// <summary>
    /// 删除检测计划
    /// </summary>
    /// <param name="context"></param>
    public void deletePlan(HttpContext context)
    {
        string plan_id = context.Request["plan_id"];

        if (PlanDal.deletePlan(plan_id))
        {
            context.Response.Write("删除成功！");
        }
        else
        {
            context.Response.Write("删除失败！");
        }
        context.Response.End();
    }

    /// <summary>
    /// 操作检测计划
    /// </summary>
    /// <param name="context"></param>
    public void updatePlan(HttpContext context)
    {
        string plan_id = context.Request["PLAN_ID"];
        string start_date = context.Request["START_DATE"];
        string end_date = context.Request["END_DATE"];
        string passen_dept = context.Request["PASSEN_DEPT"];
        string passenger = context.Request["PASSENGER"];
        string locomotive_code = context.Request["LOCOMOTIVE_CODE"];
        string locomotive_no = context.Request["LOCOMOTIVE_NO"];
        string category_code = context.Request["CATEGORY_CODE"];

        string LINE_ARRY = context.Request["LINE_ARRY"];
        string DIRECTION_ARRY = context.Request["DIRECTION_ARRY"];
        string SPOSTION_ARRY = context.Request["SPOSTION_ARRY"];
        string EPOSTION_ARRY = context.Request["EPOSTION_ARRY"];
        string STIME_ARRY = context.Request["STIME_ARRY"];
        string ETIME_ARRY = context.Request["ETIME_ARRY"];


        string json = "{\"sign\":\"false\" } ";

        //重新编辑检测计划
        if (!string.IsNullOrEmpty(plan_id))
        {
            try
            {
                if (PlanDal.deletePlanTask(plan_id))
                {
                    if (PlanDal.updatePlan(plan_id, category_code, start_date, end_date, passen_dept, passenger, locomotive_code, locomotive_no))
                    {
                        List<PLAN_TASK> task_lis = getPlanTask(LINE_ARRY, DIRECTION_ARRY, SPOSTION_ARRY, EPOSTION_ARRY, STIME_ARRY, ETIME_ARRY);
                        if (task_lis.Count > 0)
                        {
                            foreach (PLAN_TASK task in task_lis)
                            {
                                PlanDal.addPlanTask(task.ID, plan_id, task.LINE_CODE, task.DIRECTION, task.START_POSITION_CODE, task.END_POSITION_CODE, task.START_TASK_DATE, task.END_TASK_DATE);
                            }
                        }
                        json = "{\"sign\":\"true\" } ";
                    }
                }
            }
            catch (Exception ex)
            {
                log4net.ILog log = log4net.LogManager.GetLogger("修改检测计划");
                log.Error("执行出错", ex);
            }
        }
        else//添加新的检测计划
        {
            try
            {
                plan_id = Guid.NewGuid().ToString("N");
                if (PlanDal.addPlan(plan_id, category_code, start_date, end_date, passen_dept, passenger, locomotive_code, locomotive_no))
                {
                    List<PLAN_TASK> task_lis = getPlanTask(LINE_ARRY, DIRECTION_ARRY, SPOSTION_ARRY, EPOSTION_ARRY, STIME_ARRY, ETIME_ARRY);
                    if (task_lis.Count > 0)
                    {
                        foreach (PLAN_TASK task in task_lis)
                        {
                            PlanDal.addPlanTask(task.ID, plan_id, task.LINE_CODE, task.DIRECTION, task.START_POSITION_CODE, task.END_POSITION_CODE, task.START_TASK_DATE, task.END_TASK_DATE);
                        }
                    }
                    json = "{\"sign\":\"true\" } ";
                }
            }
            catch (Exception ex)
            {
                log4net.ILog log = log4net.LogManager.GetLogger("新建检测计划");
                log.Error("执行出错", ex);
            }
        }
        context.Response.Write(json);
        context.Response.End();
    }

    /// <summary>
    /// 获取JSON格式
    /// </summary>
    /// <param name="tasks"></param>
    /// <param name="index"></param>
    /// <param name="number"></param>
    /// <returns></returns>
    public StringBuilder getJson(List<List<PLAN_TASK>> tasks, string index, string number, int total)
    {
        StringBuilder json = new StringBuilder();
        json.Append("{\"rows\":[");
        foreach (List<PLAN_TASK> task in tasks)
        {
            json.Append("{");
            json.Append("\"PLAN_ID\":\"" + task[0].PLAN_ID + "\",");
            json.Append("\"CZ\":\"<span class= 'btn-edit' onclick=editPlan('" + task[0].PLAN_ID + "') ></span><span class='btn-delete' onclick=deletePlan('" + task[0].PLAN_ID + "') ></span>\",");
            json.Append("\"CATEGORY_CODE\":\"" + task[0].CATEGORY_CODE + "\",");
            json.Append("\"CATEGORY_NAME\":\"" + getCategoryName(task[0].CATEGORY_CODE) + "\",");
            json.Append("\"START_DATE\":\"" + task[0].START_DATE.ToString("yyyy-MM-dd") + "\",");
            json.Append("\"END_DATE\":\"" + task[0].END_DATE.ToString("yyyy-MM-dd") + "\",");
            json.Append("\"LOCOMOTIVE_CODE\":\"" + task[0].LOCOMOTIVE_CODE + "\",");
            json.Append("\"LOCOMOTIVE_NO\":\"" + task[0].LOCOMOTIVE_NO + "\",");
            json.Append("\"PASSEN_DEPT\":\"" + task[0].PASSEN_DEPT + "\",");
            json.Append("\"PASSENGER\":\"" + task[0].PASSENGER + "\",");
            json.Append("\"REPORT_DEPT\":\"" + task[0].REPORT_DEPT + "\",");
            json.Append("\"REPORTER\":\"" + task[0].REPORTER + "\",");
            json.Append("\"task\":[");
            if (task.Count > 0)
            {
                foreach (PLAN_TASK plan in task)
                {
                    if (!string.IsNullOrEmpty(plan.ID))
                    {
                        json.Append("{");
                        json.Append("\"ID\":\"" + plan.ID + "\",");
                        json.Append("\"LINE_CODE\":\"" + plan.LINE_CODE + "\",");
                        json.Append("\"LINE_NAME\":\"" + (!string.IsNullOrEmpty(plan.LINE_CODE) ? Api.ServiceAccessor.GetFoundationService().getLineByCode(plan.LINE_CODE).LINE_NAME : "") + "\",");
                        json.Append("\"DIRECTION\":\"" + plan.DIRECTION + "\",");
                        json.Append("\"DIRECTION_NAME\":\"" + (!string.IsNullOrEmpty(plan.DIRECTION) ? Api.Util.Common.getSysDictionaryInfo(plan.DIRECTION).CODE_NAME : "") + "\",");
                        json.Append("\"START_POSITION_CODE\":\"" + plan.START_POSITION_CODE + "\",");
                        json.Append("\"START_POSITION_NAME\":\"" + (!string.IsNullOrEmpty(plan.START_POSITION_CODE) ? Api.ServiceAccessor.GetFoundationService().getStationSectionByCode(plan.START_POSITION_CODE).POSITION_NAME : "") + "\",");
                        json.Append("\"END_POSITION_CODE\":\"" + plan.END_POSITION_CODE + "\",");
                        json.Append("\"END_POSITION_NAME\":\"" + (!string.IsNullOrEmpty(plan.END_POSITION_CODE) ? Api.ServiceAccessor.GetFoundationService().getStationSectionByCode(plan.END_POSITION_CODE).POSITION_NAME : "") + "\",");
                        json.Append("\"START_TASK_DATE\":\"" + (plan.START_TASK_DATE.ToString("yyyy-MM-dd HH:mm:ss") == "0001-01-01 00:00:00" ? "" : plan.START_TASK_DATE.ToString("yyyy/MM/dd HH:mm:ss")) + "\",");
                        json.Append("\"END_TASK_DATE\":\"" + (plan.END_TASK_DATE.ToString("yyyy-MM-dd HH:mm:ss") == "0001-01-01 00:00:00" ? "" : plan.END_TASK_DATE.ToString("yyyy/MM/dd HH:mm:ss")) + "\"");
                        json.Append("}");
                        if (task.IndexOf(plan) != task.Count() - 1)
                            json.Append(",");
                    }
                }
            }
            json.Append("]}");
            if (tasks.IndexOf(task) != tasks.Count() - 1)
                json.Append(",");

        }
        json.Append("],");
        json.Append("\"total\":\"" + total + "\",");
        json.Append("\"PAGE_INDEX\":\"" + index + "\",");
        json.Append("\"PAGE_NUMBER\":\"" + number + "\"}");
        return json;
    }



    /// <summary>
    /// 将DataTable 按一定构造类T 转换为List<T>
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public static class ModelConvertHelper<T> where T : new()
    {
        public static List<T> ConvertToModel(DataTable dt)
        {
            try
            {
                // 定义集合
                List<T> ts = new List<T>();

                // 获得此模型的类型
                Type type = typeof(T);

                string tempName = "";

                foreach (DataRow dr in dt.Rows)
                {
                    T t = new T();

                    // 获得此模型的公共属性
                    FieldInfo[] propertys = t.GetType().GetFields();

                    foreach (FieldInfo pi in propertys)
                    {
                        tempName = pi.Name;

                        // 检查DataTable是否包含此列
                        if (dt.Columns.Contains(tempName))
                        {
                            object value = dr[tempName];
                            if (value != DBNull.Value)
                                pi.SetValue(t, Convert.ChangeType(value, pi.FieldType));
                        }
                    }

                    ts.Add(t);
                }

                return ts;
            }
            catch (Exception ex)
            {
                log4net.ILog log = log4net.LogManager.GetLogger("DATATABLE转LIST失败");
                log.Error("Error", ex);
                return null;
            }
        }
    }

    public string getCategoryName(string code)
    {
        string name = "";
        if (!string.IsNullOrEmpty(code))
        {
            if (code.Contains(","))
            {
                string[] cates = code.Split(',');
                for (int i = 0; i <= cates.Length - 1; i++)
                {
                    name += Api.Util.Common.getSysDictionaryInfo(cates[i]).CODE_NAME;
                    if (i != cates.Length - 1)
                        name += ",";
                }


            }
            else
                name = Api.Util.Common.getSysDictionaryInfo(code).CODE_NAME;
        }
        return name;
    }

    public List<PLAN_TASK> getPlanTask(string LINE_ARRY, string DIRECTION_ARRY, string SPOSTION_ARRY, string EPOSTION_ARRY, string STIME_ARRY, string ETIME_ARRY)
    {
        string[] lines = LINE_ARRY.Split(',');
        string[] directions = DIRECTION_ARRY.Split(',');
        string[] spostions = SPOSTION_ARRY.Split(',');
        string[] epostions = EPOSTION_ARRY.Split(',');
        string[] stimes = STIME_ARRY.Split(',');
        string[] etimes = ETIME_ARRY.Split(',');

        DateTime time = new DateTime();
        List<PLAN_TASK> lis = new List<PLAN_TASK>();
        if (!string.IsNullOrEmpty(LINE_ARRY) && LINE_ARRY != "," && !string.IsNullOrEmpty(DIRECTION_ARRY) && DIRECTION_ARRY != ",")
        {
            if (lines.Length > 0)
            {
                for (int i = 0; i < lines.Length; i++)
                {
                    try
                    {
                        PLAN_TASK plan = new PLAN_TASK();
                        plan.ID = Guid.NewGuid().ToString("N");
                        plan.LINE_CODE = lines[i];
                        plan.DIRECTION = directions[i];
                        plan.START_POSITION_CODE = spostions[i];
                        plan.END_POSITION_CODE = epostions[i];
                        plan.START_TASK_DATE = !string.IsNullOrEmpty(stimes[i]) ? Convert.ToDateTime(stimes[i]) : time;
                        plan.END_TASK_DATE = !string.IsNullOrEmpty(etimes[i]) ? Convert.ToDateTime(etimes[i]) : time;
                        lis.Add(plan);
                    }
                    catch (Exception ex)
                    {
                        log4net.ILog log = log4net.LogManager.GetLogger("获取检测计划子表信息");
                        log.Error("执行出错", ex);
                    }
                }
            }
        }
        return lis;
    }



    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}

public class PLAN_MANAGE
{
    public string PLAN_ID;
    public string CATEGORY_CODE;
    public DateTime START_DATE;
    public DateTime END_DATE;
    public string LOCOMOTIVE_CODE;
    public string LOCOMOTIVE_NO;
    public string PASSEN_DEPT;
    public string PASSENGER;
    public string REPORT_DEPT;
    public string REPORTER;
}

public class PLAN_TASK : PLAN_MANAGE
{
    public string ID;
    public string LINE_CODE;
    public string DIRECTION;
    public string START_POSITION_CODE;
    public string END_POSITION_CODE;
    public DateTime START_TASK_DATE;
    public DateTime END_TASK_DATE;
}