<%@ WebHandler Language="C#" Class="MileageDetail" %>

using System;
using System.Web;
using System.Data;
using Api.Fault.entity.alarm;
using Api.Foundation.entity.Foundation;
using System.Collections.Generic;
using System.Linq;
using ADO;

public class MileageDetail : ReferenceClass, IHttpHandler
{
    /// <summary>
    /// 全局list，对需要聚合的数据
    /// </summary>
    public MileageSubsidiary mileage = new MileageSubsidiary();
    public List<Posi_Mileage> posi_mileage_lis = GetPosi();
    public void ProcessRequest(HttpContext context)
    {
        try
        {
            string type = context.Request["TYPE"];
            string BUREAU_CODE = context.Request["BUREAU_CODE"];
            string ORG_CODE = context.Request["ORG_CODE"];
            string LocoCode = context.Request["LocoCode"];
            string StartTime = context.Request["StartTime"];
            string EndTime = context.Request["EndTime"];

            switch (type)
            {
                //获取轨迹所需的状态数据
                case "query":
                    GetTable(BUREAU_CODE, ORG_CODE, LocoCode, StartTime, EndTime);
                    break;
                case "status":
                    setStatus(context);
                    break;
            }
        }
        catch (Exception ex)
        {
            log4net.ILog log = log4net.LogManager.GetLogger("线路覆盖里程明细表后台");
            log.Error("执行出错", ex);
        }
    }

    /// <summary>
    /// 获取里程明细数据
    /// </summary>
    /// <param name="BUREAU_CODE"></param>
    /// <param name="ORG_NAME"></param>
    /// <param name="LocoCode"></param>
    /// <param name="StartTime"></param>
    /// <param name="EndTime"></param>
    public void GetTable(string BUREAU_CODE, string ORG_CODE, string LocoCode, string StartTime, string EndTime)
    {
        //获取前台页码
        int pageIndex = Convert.ToInt32(HttpContext.Current.Request["PageIndex"]);
        //获取前台一页条数
        int pageSize = Convert.ToInt32(HttpContext.Current.Request["PageSize"]);
        System.Text.StringBuilder jsonStr = new System.Text.StringBuilder();
        jsonStr.Append("{'rows':[");

        string strwhere = null;
        //限制用户查看权限
        string org_code = Api.Util.Public.GetUser_DataOrg;
        Api.Foundation.entity.Foundation.LoginUser m22 = Api.Util.Public.GetCurrentUser();
        //如果是admin权限，默认显示全部，选择了限制条件则跟条件查询
        if (m22.DeptType == "TOPBOSS" || m22.DeptType == "$")
        {
            if (!String.IsNullOrEmpty(BUREAU_CODE))
            {
                strwhere += " AND T1.BUREAU_CODE = '" + BUREAU_CODE + "'";
            }
            if (!String.IsNullOrEmpty(ORG_CODE))
            {
                strwhere += " AND T.ORG_CODE = '" + ORG_CODE + "'";
            }
        }
        //如果是特定用户登录，根据org_code去匹配供电段维度
        else
        {
            //如果用户在默认查询的中输入了条件，则按照条件查询
            if (!String.IsNullOrEmpty(ORG_CODE))
            {
                strwhere += " AND T.ORG_CODE = '" + ORG_CODE + "'";
            }
            else
            {
                strwhere += " AND T.ORG_CODE like '%" + ORG_CODE + "%'";
            }
        }

        if (!String.IsNullOrEmpty(LocoCode))
        {
            strwhere += " AND T.LOCO_CODE = '" + LocoCode + "'";
        }
        if (!String.IsNullOrEmpty(StartTime))
        {
            strwhere += " AND T.START_DATE >= to_date('" + StartTime + "', 'yyyy/mm/dd hh24:mi:ss')";
        }
        if (!String.IsNullOrEmpty(EndTime))
        {
            strwhere += " AND T.END_DATE <= to_date('" + EndTime + "', 'yyyy/mm/dd hh24:mi:ss')";
        }

        //按照设备每天跑的状态聚合数据，返回新的list
        List<MileageSubsidiary> StatLocoDif = PolymerizeMileage(strwhere);

        //用于分页查询
        PubPage pb = new PubPage();
        pb.PageIndex = pageIndex;
        pb.PageSize = pageSize;
        int recordCount = StatLocoDif.Count;

        StatLocoDif = StatLocoDif.Skip((pb.PageIndex - 1) * pb.PageSize).Take(pb.PageSize).ToList<MileageSubsidiary>();
        try
        {
            for (int i = 0; i < StatLocoDif.Count; i++)
            {
                jsonStr.Append("{");
                jsonStr.AppendFormat("'BUREAU_NAME':'{0}',", StatLocoDif[i].BUREAU_NAME);
                jsonStr.AppendFormat("'ORG_NAME':'{0}',", StatLocoDif[i].ORG_NAME);
                jsonStr.AppendFormat("'ORG_CODE':'{0}',", StatLocoDif[i].ORG_CODE);
                jsonStr.AppendFormat("'LINE_NAME':'{0}',", StatLocoDif[i].LINE_NAME);
                jsonStr.AppendFormat("'LINE_CODE':'{0}',", StatLocoDif[i].LINE_CODE);
                jsonStr.AppendFormat("'Direction':'{0}',", StatLocoDif[i].DIRECTION);
                jsonStr.AppendFormat("'LOCO_CODE':'{0}',", StatLocoDif[i].LOCO_CODE);
                jsonStr.AppendFormat("'RANGE':'{0}',", StatLocoDif[i].RANGE);
                jsonStr.AppendFormat("'START_DATE':'{0}',", StatLocoDif[i].START_DATE);
                jsonStr.AppendFormat("'END_DATE':'{0}',", StatLocoDif[i].END_DATE);
                jsonStr.AppendFormat("'Distance':'{0}',", StatLocoDif[i].DISTANCE);
                jsonStr.AppendFormat("'TOTALDISTANCE':'{0}',", StatLocoDif[i].TOTALDISTANCE);
                jsonStr.AppendFormat("'COVERRATES':'{0}',", StatLocoDif[i].COVERRATES);
                jsonStr.AppendFormat("'STATUS':'{0}'", StatLocoDif[i].STATUS);
                jsonStr.Append(" },");
            }
            jsonStr.Remove(jsonStr.Length - 1, 1);
        }
        catch (Exception ex)
        {
            log4net.ILog log2 = log4net.LogManager.GetLogger("遍历list数据出错" + ex);
        }
        //分页插件
        PageHelper page = new PageHelper();
        //拼接分页数据
        string pagejson = page.getPageJson(recordCount, pageIndex, pageSize);
        jsonStr.Append("]," + pagejson + "}");
        jsonStr = jsonStr.Replace("'", "\"");
        HttpContext.Current.Response.Write(jsonStr);
    }
    /// <summary>
    /// 获取某局、段、线的静态线路距离
    /// </summary>
    /// <param name="powerSectionName"></param>
    /// <param name="lineName"></param>
    /// <param name="direction"></param>
    /// <returns></returns>
    public int GetDistance(string powerSectionName, string lineName, string direction)
    {
        int distance = 1;
        try
        {
            DataSet ds = new DataSet();
            string sql = String.Format(@"select sum(DISTANCE) AS DISTANCE
          from MIS_POSITION_MILEAGE T
         where 1 = 1 AND T.LINE_NAME = '{0}' AND T.DIRECTION = '{1}' AND T.Power_Section_Name = '{2}'
", lineName, direction, powerSectionName);
            ds = DbHelperOra.Query(sql);
            if (ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow row in ds.Tables[0].Rows)
                {
                    distance = Convert.ToInt32(row["DISTANCE"]);
                }
            }
        }
        catch (Exception ex)
        {
            log4net.ILog log2 = log4net.LogManager.GetLogger("求和线路值出错" + ex);
        }
        return distance;
    }
    /// <summary>
    /// 算出覆盖率
    /// </summary>
    /// <returns></returns>
    public void GetCoverRate()
    {
        string Rate = "";
        int TotalDistance = 0;
        if (mileage.BUREAU_NAME != "" && mileage.LINE_NAME != "" && mileage.DIRECTION != "")
        {
            List<Posi_Mileage> posi_mileage = GetPosiFromMileageSubsidiary(mileage);
            //根据mileage的线路、供电段、铁路局等信息从MIS_POSITION_MILEAGE表中获取线路所有区站，如果该条聚合数据中的区站数量和posi_mileage的条数相等，则证明全部覆盖掉了。
            TotalDistance = GetDistance(mileage.ORG_NAME, mileage.LINE_NAME, mileage.DIRECTION);
            if (posi_mileage.Count == mileage.COUNT )
            {
                Rate = "100%";
            }
            else
            {
                //如果运行区站与里程明细的区站数相等，覆盖率直接为100%

                double percent = Convert.ToDouble(mileage.DISTANCE) / Convert.ToDouble(TotalDistance);
                if (percent >= 1.00)
                {
                    Rate = "100%";
                }
                else
                {
                    Rate = string.Format("{0:0.00%}", percent);//得到0.00%
                }
            }
        }
        else
        {
            TotalDistance = 0;
            Rate = "0.00%";
        }
        mileage.COVERRATES = Rate;
        mileage.TOTALDISTANCE = TotalDistance;
    }

    /// <summary>
    /// 静态区站里程，作为全局变量便于计算
    /// </summary>
    public class Posi_Mileage
    {
        public string POSITION_CODE;
        public string POSITION_NAME;
        public string LINE_CODE;
        public string LINE_NAME;
        public string DIRECTION;
        public string POWER_SECTION_CODE;
        public string POWER_SECTION_NAME;
        public int DISTANCE;
    }
    /// <summary>
    /// 获取该明细维度下的所有静态区站信息
    /// </summary>
    /// <param name="mile"></param>
    /// <returns></returns>
    public List<Posi_Mileage> GetPosiFromMileageSubsidiary(MileageSubsidiary mile)
    {
        List<Posi_Mileage> posi = posi_mileage_lis.Where(m =>
        {
            bool str = true;
            if (!string.IsNullOrEmpty(mile.ORG_NAME))
            {
                str = m.POWER_SECTION_NAME == mile.ORG_NAME;
            }
            if (!string.IsNullOrEmpty(mile.LINE_NAME))
            {
                str = str && m.LINE_NAME == mile.LINE_NAME;
            }
            if (!string.IsNullOrEmpty(mile.DIRECTION))
            {
                str = str && m.DIRECTION == mile.DIRECTION;
            }
            return str;
        }).Select(m =>
        {
            var x = new Posi_Mileage();
            x.POWER_SECTION_NAME = m.POWER_SECTION_NAME;
            x.POWER_SECTION_CODE = m.POWER_SECTION_CODE;
            x.LINE_NAME = m.LINE_NAME;
            x.DIRECTION = m.DIRECTION;
            x.LINE_CODE = m.LINE_CODE;
            x.POSITION_CODE = m.POSITION_CODE;
            //x.END_DATE = m.END_DATE;
            x.DISTANCE = m.DISTANCE;
            x.POSITION_NAME = m.POSITION_NAME;
            x.DIRECTION = m.DIRECTION;
            return x;
        }).ToList();
        return posi;
    }
    /// <summary>
    /// 计算静态区站里程，作为全局变量
    /// </summary>
    /// <returns></returns>
    public static List<Posi_Mileage> GetPosi()
    {
        DataSet ds = new DataSet();
        DataTable dt = new DataTable();
        try
        {
            string sql = String.Format(@"SELECT * FROM MIS_POSITION_MILEAGE");
            ds = DbHelperOra.Query(sql);
            if (ds.Tables[0].Rows.Count > 0)
            {
                dt = ds.Tables[0];
            }
        }
        catch (Exception ex)
        {
            log4net.ILog log2 = log4net.LogManager.GetLogger("求静态区站里程" + ex);
        }
        List<Posi_Mileage> posi_lis = HardDiskLineStandard.ModelConvertHelper<Posi_Mileage>.ConvertToModel(dt);
        return posi_lis;
    }
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

    public void setStatus(HttpContext context)
    {
        //屏蔽信息所接受的参数
        string ORG_CODE = context.Request["ORG_CODE"];
        string LINE_CODE = context.Request["LINE_CODE"];
        string LOCO_CODE = context.Request["LOCO_CODE"];
        string Direction = context.Request["Direction"];
        string STATUS = context.Request["STATUS"];
        string START_DATE = context.Request["START_DATE"];
        string END_DATE = context.Request["END_DATE"];
        string strwhere = GetStatusWhere(START_DATE, END_DATE, LINE_CODE, ORG_CODE, LOCO_CODE, Direction);
        try
        {
            string sql = string.Format(@"UPDATE STAT_LOCO_POSITION SET STATUS = '{0}' WHERE {1}", STATUS, strwhere);
            int result = DbHelperOra_ADO.ExecuteSql(sql);
            System.Text.StringBuilder jsonStr = new System.Text.StringBuilder();

            if (result > 0)
            {
                jsonStr.Append("{'STATUS':'TRUE'}");
            }
            else
            {
                jsonStr.Append("{'STATUS':'FALSE'}");
            }
            jsonStr = jsonStr.Replace("'", "\"");
            HttpContext.Current.Response.ContentType = "application/json";
            HttpContext.Current.Response.Write(jsonStr);
        }
        catch (Exception ex)
        {
            log4net.ILog log = log4net.LogManager.GetLogger("屏蔽脏数据失败");
            log.Error("执行出错", ex);
        }
    }
    /// <summary>
    /// 查询条件，针对聚合的单条数据进行查询
    /// </summary>
    /// <param name="start_date"></param>
    /// <param name="end_date"></param>
    /// <param name="locomotive_code"></param>
    /// <param name="status"></param>
    /// <returns></returns>
    public string GetStatusWhere(string START_DATE, string END_DATE, string LINE_CODE, string ORG_CODE, string LOCO_CODE, string Direction)
    {
        string str = "1=1 ";
        if (!string.IsNullOrEmpty(START_DATE))
        {
            str += string.Format(" AND START_DATE >= TO_DATE('{0}','yyyy/MM/dd HH24:mi:ss')", START_DATE);
        }
        if (!string.IsNullOrEmpty(END_DATE))
        {
            str += string.Format(" AND END_DATE <= TO_DATE('{0}','yyyy/MM/dd HH24:mi:ss')", END_DATE);
        }
        if (!string.IsNullOrEmpty(LOCO_CODE))
        {
            str += string.Format(" AND LOCO_CODE = '{0}'", LOCO_CODE);
        }
        if (ORG_CODE == "")
        {
            str += " AND POWER_SECTION_CODE IS NULL";
        }
        else
        {
            str += string.Format(" AND POWER_SECTION_CODE = '{0}'", ORG_CODE);
        }
        if (LINE_CODE == "")
        {
            str += " AND LINE_CODE IS NULL";
        }
        else
        {
            str += string.Format(" AND LINE_CODE = '{0}'", LINE_CODE);
        }
        if (Direction == "")
        {
            str += " AND Direction IS NULL";
        }
        else
        {
            str += string.Format(" AND Direction = '{0}'", Direction);
        }
        return str;
    }
    /// <summary>
    /// STAT_LOCO_POSITION的结构体
    /// </summary>
    public class StatLocoPositon
    {
        public string BUREAU_NAME;
        public string ORG_NAME;
        public string ORG_CODE;
        public string LINE_NAME;
        public string LINE_CODE;
        public string RANGE;
        public string DIRECTION;
        public string LOCO_CODE;
        public string POSITION_CODE;
        public string POSITION_NAME;
        public DateTime START_DATE;
        public DateTime END_DATE;
        public int DISTANCE;
        public string STATUS;
    }

    /// <summary>
    /// 里程明细的结构体
    /// </summary>
    public class MileageSubsidiary
    {
        public string BUREAU_NAME;
        public string ORG_NAME;
        public string ORG_CODE;
        public string LINE_NAME;
        public string LINE_CODE;
        public string RANGE;
        public string DIRECTION;
        public string LOCO_CODE;
        public string POSITION_LIST;
        public DateTime START_DATE;
        public DateTime END_DATE;
        public int DISTANCE;
        public int TOTALDISTANCE;
        public string COVERRATES;
        //记录区站的个数，用于对包含所有区站的情况设定覆盖率为100%
        public int COUNT;
        public string STATUS;
    }

    /// <summary>
    /// 查询里程明显表
    /// </summary>
    /// <param name="strwhere">查询语句</param>
    /// <returns></returns>
    public DataTable SelectMileage(string strwhere)
    {
        string sql = string.Format(@"SELECT T3.SUP_ORG_NAME AS BUREAU_NAME,
       T3.ORG_NAME,
       T3.ORG_CODE,
       T4.LINE_NAME,
       T4.LINE_CODE,
       T.LOCO_CODE,
       T.DIRECTION,
       T.POSITION_CODE,
       T2.RANGE,
       T.START_DATE,
       T.END_DATE,
       T.DISTANCE,
       T.STATUS
  from stat_loco_position T
  left join mis_position T1
    on T1.POSITION_CODE = T.POSITION_CODE
  left join duty_range T2
    on T2.ORG_CODE = T.POWER_SECTION_CODE
   AND T2.LINE_CODE = T.LINE_CODE
   AND T2.DIRECTION = T.DIRECTION
  left join tsys_org T3
    ON T3.ORG_CODE = T.POWER_SECTION_CODE
  left join MIS_LINE T4
    ON T4.LINE_CODE = T.LINE_CODE
 where 1 = 1 {0}
 order by LOCO_CODE, START_DATE", strwhere);
        try
        {
            DataTable dt = DbHelperOra.Query(sql).Tables[0];
            return dt;
        }
        catch (Exception ex)
        {
            log4net.ILog log2 = log4net.LogManager.GetLogger("获取里程明细表出错" + sql);
            log2.Error("执行出错", ex);
            return null;
        }
    }

    /// <summary>
    /// 公用方法，得出里程明细表，可以支持查询。
    /// </summary>
    /// <param name="dataTable">区站记录表数据的聚合，按照设备和时间</param>
    /// <returns></returns>
    public List<MileageSubsidiary> PolymerizeMileage(string strwhere)
    {
        try
        {
            //按照设备、时间等排序获取里程明细表数据
            DataTable dt = SelectMileage(strwhere);
            //将数据集转化为list对象
            List<StatLocoPositon> StatLoco = HardDiskLineStandard.ModelConvertHelper<StatLocoPositon>.ConvertToModel(dt);
            //new一个新的list对象将聚合的数据重新储存
            List<MileageSubsidiary> StatLocoNew = new List<MileageSubsidiary>();
            DateTime startstamp = new DateTime();
            DateTime endstamp = new DateTime();
            //聚合list数据
            try
            {
                if (StatLoco.Count > 1)
                {
                    for (int i = 0; i < StatLoco.Count; i++)
                    {
                        //如果第一个值为空就存起来，不为空记录starttime
                        if (i == 0)
                        {
                            startstamp = StatLoco[i].START_DATE;
                            endstamp = StatLoco[i].END_DATE;
                            DealMileage(StatLoco[i], startstamp, endstamp);
                        }
                        //如果是最后一个数据
                        else if (i == StatLoco.Count - 1)
                        {//最后一个数据为空
                         //if (StatLoco[i].LOCO_CODE == "" && StatLoco[i].BUREAU_NAME == "" && StatLoco[i].ORG_NAME == "" && StatLoco[i].DIRECTION == "")
                         //{
                         //    DealMileage(StatLoco[i], StatLoco[i].START_DATE, StatLoco[i].END_DATE);
                         //    StatLocoNew.Add(mileage);
                         //}
                         //else
                         //{
                            if (StatLoco[i - 1].STATUS == "close")
                                mileage.STATUS = "close";

                            if (StatLoco[i].LOCO_CODE == StatLoco[i - 1].LOCO_CODE && StatLoco[i].BUREAU_NAME == StatLoco[i - 1].BUREAU_NAME && StatLoco[i].ORG_NAME == StatLoco[i - 1].ORG_NAME && StatLoco[i].DIRECTION == StatLoco[i - 1].DIRECTION && StatLoco[i].LINE_NAME == StatLoco[i - 1].LINE_NAME)
                            {

                                endstamp = StatLoco[i].END_DATE;
                                DealMileage(StatLoco[i], startstamp, endstamp);
                                //算聚合数据的覆盖率
                                GetCoverRate();
                                MileageSubsidiary mil = getvalue();
                                StatLocoNew.Add(mil);
                            }
                            else
                            {
                                //算聚合数据的覆盖率
                                GetCoverRate();
                                endstamp = StatLoco[i - 1].END_DATE;
                                DealMileage(StatLoco[i - 1], startstamp, endstamp);
                                //一旦不相等，先加入MileageSubsidiary的list中然后置空全局对象。
                                MileageSubsidiary mil = getvalue();
                                StatLocoNew.Add(mil);

                                //再初始化
                                dispose(mileage);
                                startstamp = StatLoco[i].START_DATE;
                                endstamp = StatLoco[i].END_DATE;
                                DealMileage(StatLoco[i], startstamp, endstamp);
                                //算聚合数据的覆盖率
                                GetCoverRate();
                                StatLocoNew.Add(mileage);
                            }
                            // }
                        }
                        else
                        {
                            if (StatLoco[i - 1].STATUS == "close")
                                mileage.STATUS = "close";
                            //如果该条数据为空
                            //if (StatLoco[i].LOCO_CODE == "" || StatLoco[i].BUREAU_NAME == "" || StatLoco[i].ORG_NAME == "" || StatLoco[i].DIRECTION == "")
                            //{
                            //    DealMileage(StatLoco[i], StatLoco[i].START_DATE, StatLoco[i].END_DATE);
                            //    StatLocoNew.Add(mileage);
                            //}
                            //else
                            //{
                            //如果不为空判断是否与上一条数据对应字段相等（局、段、线、行别、设备）
                            if (StatLoco[i].LOCO_CODE == StatLoco[i - 1].LOCO_CODE && StatLoco[i].BUREAU_NAME == StatLoco[i - 1].BUREAU_NAME && StatLoco[i].ORG_NAME == StatLoco[i - 1].ORG_NAME && StatLoco[i].DIRECTION == StatLoco[i - 1].DIRECTION && StatLoco[i].LINE_NAME == StatLoco[i - 1].LINE_NAME)
                            {

                                //如果该条数据的开始时间和上一条数据的结束时间不在同一天内，则将之前的聚合数据加入对象中，然后重新开始
                                if (StatLoco[i].START_DATE.Date != StatLoco[i - 1].END_DATE.Date)
                                {
                                    //算聚合数据的覆盖率
                                    GetCoverRate();
                                    MileageSubsidiary mil = getvalue();
                                    StatLocoNew.Add(mil);
                                    //再初始化
                                    dispose(mileage);
                                    startstamp = StatLoco[i].START_DATE;
                                    endstamp = StatLoco[i].END_DATE;
                                    DealMileage(StatLoco[i], startstamp, endstamp);
                                }
                                //数据相等，直接将distance相加，存入全局list中，成为一条数据直到与下一条数据不相等
                                //将当前数据的结束时间传进去
                                endstamp = StatLoco[i].END_DATE;
                                DealMileage(StatLoco[i], startstamp, endstamp);

                            }
                            else
                            {

                                //算聚合数据的覆盖率
                                GetCoverRate();
                                //一旦不相等，先加入MileageSubsidiary的list中然后置空全局对象。
                                MileageSubsidiary mil = getvalue();
                                StatLocoNew.Add(mil);

                                //初始化
                                dispose(mileage);
                                //如果前后不同的只有一条数据，将这条数据加入对象中
                                startstamp = StatLoco[i].START_DATE;
                                endstamp = StatLoco[i].END_DATE;
                                DealMileage(StatLoco[i], startstamp, endstamp);
                                //如果不相等，将第一个时间开始时间赋值进去
                                startstamp = StatLoco[i].START_DATE;
                            }
                            //}
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                log4net.ILog log2 = log4net.LogManager.GetLogger("聚合list数据出错" + ex);
                return null;
            }
            return StatLocoNew;
        }
        catch (Exception ex)
        {
            log4net.ILog log2 = log4net.LogManager.GetLogger("数据集转化为list对象失败" + ex);
            return null;
        }
    }

    /// <summary>
    /// 聚合方法（起始时间赋值,distance相加），该条数据不为空
    /// </summary>
    /// <param name="list">当前元素</param>
    /// <param name="startstamp">上一个元素的开始时间</param>
    /// <param name="endstamp">下一个元素的时间戳</param>
    /// <returns></returns>
    public void DealMileage(StatLocoPositon list, DateTime startstamp, DateTime endstamp)
    {
        mileage.BUREAU_NAME = list.BUREAU_NAME;
        mileage.ORG_NAME = list.ORG_NAME;
        mileage.ORG_CODE = list.ORG_CODE;
        mileage.LINE_NAME = list.LINE_NAME;
        mileage.LINE_CODE = list.LINE_CODE;
        mileage.RANGE = list.RANGE;
        mileage.LOCO_CODE = list.LOCO_CODE;
        mileage.DIRECTION = list.DIRECTION;
        mileage.STATUS = list.STATUS;
        if (list.START_DATE > startstamp)
        {
            mileage.START_DATE = startstamp;
        }
        else
        {
            mileage.START_DATE = list.START_DATE;
        }
        if (list.POSITION_CODE != null)
        {
            mileage.POSITION_LIST += (list.POSITION_CODE + ";");
            mileage.COUNT += 1;
        }
        else
        {
            mileage.POSITION_LIST = "";
        }
        mileage.END_DATE = endstamp;
        mileage.DISTANCE += list.DISTANCE;
    }


    public MileageSubsidiary getvalue()
    {
        MileageSubsidiary mil = new MileageSubsidiary();
        mil.BUREAU_NAME = mileage.BUREAU_NAME;
        mil.ORG_NAME = mileage.ORG_NAME;
        mil.ORG_CODE = mileage.ORG_CODE;
        mil.LINE_NAME = mileage.LINE_NAME;
        mil.LINE_CODE = mileage.LINE_CODE;
        mil.LOCO_CODE = mileage.LOCO_CODE;
        mil.DIRECTION = mileage.DIRECTION;
        mil.RANGE = mileage.RANGE;
        mil.START_DATE = mileage.START_DATE;
        mil.END_DATE = mileage.END_DATE;
        mil.DISTANCE = mileage.DISTANCE;
        mil.TOTALDISTANCE = mileage.TOTALDISTANCE;
        mil.COVERRATES = mileage.COVERRATES;
        mil.POSITION_LIST = mileage.POSITION_LIST;
        mil.STATUS = mileage.STATUS;
        mil.COUNT = mileage.COUNT;
        return mil;
    }

    /// <summary>
    /// 将全局对象做赋空操作。
    /// </summary>
    /// <param name="mileage"></param>
    public void dispose(MileageSubsidiary mileage)
    {
        mileage.BUREAU_NAME = null;
        mileage.ORG_NAME = null;
        mileage.ORG_CODE = null;
        mileage.LINE_NAME = null;
        mileage.LINE_CODE = null;
        mileage.LOCO_CODE = null;
        mileage.STATUS = null;
        mileage.DIRECTION = null;
        mileage.COUNT = 0;
        mileage.POSITION_LIST = null;
        mileage.RANGE = null;
        mileage.DISTANCE = 0;
        mileage.START_DATE = new DateTime();
        mileage.END_DATE = new DateTime();
    }
}