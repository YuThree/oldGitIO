<%@ WebHandler Language="C#" Class="GetCustomPosition" %>

using System;
using System.Web;
using Api.Fault.entity.sms;
using System.Collections.Generic;
using System.Text;
using Api.Foundation.entity.Foundation;
using Api.Foundation.entity.Cond;
using System.ComponentModel;
using System.Drawing;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Text.RegularExpressions;
using System.Threading;
using Api.Util;
using ADO;


public class GetCustomPosition : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        try
        {
            string type = context.Request["type"];
            switch (type)
            {
                //获取轨迹所需的状态数据
                case "GetSmsGps":
                    getSmsGps(context);
                    break;
                case "GetSmsGpsPage":
                    getSmsGpsPage(context);
                    break;
                case "setCustom":
                    setCustom(context);
                    break;
            }
        }
        catch (Exception ex)
        {
            log4net.ILog log = log4net.LogManager.GetLogger("线路覆盖轨迹界面后台");
            log.Error("执行出错", ex);
        }
    }

    /// <summary>
    /// 获取轨迹所需的状态数据
    /// </summary>
    /// <param name="context"></param>
    public void getSmsGps(HttpContext context)
    {
        string locomotive_code = context.Request["locomotive_code"];
        string start_date = context.Request["start_date"];
        string end_date = context.Request["end_date"];

        C3_SmsCond cond = new C3_SmsCond();
        if (!string.IsNullOrEmpty(locomotive_code))
            cond.LOCOMOTIVE_CODE = locomotive_code;
        if (!string.IsNullOrEmpty(start_date))
            cond.startTime = Convert.ToDateTime(start_date);
        if (!string.IsNullOrEmpty(end_date))
            cond.endTime = Convert.ToDateTime(end_date);
        if (!string.IsNullOrEmpty(cond.businssAnd))
        {
            cond.businssAnd += " and ";
        }
        cond.businssAnd += " GIS_LAT !='0' AND GIS_LON !='0'";
        cond.orderBy = "DETECT_TIME ASC";
        int order = 1;

        List<C3_Sms> sms_lis = Api.ServiceAccessor.GetSmsService().getC3SmsbyCondition(cond);
        sms_lis = FilterSms(sms_lis);
        StringBuilder json = new StringBuilder();
        json.Append("[[{");
        json.Append("\"GIS_X\":\"" + sms_lis[sms_lis.Count() - 1].GIS_LON_O + "\",");
        json.Append("\"GIS_Y\":\"" + sms_lis[sms_lis.Count() - 1].GIS_LAT_O + "\"");
        json.Append("},{\"JCINFO\":[{\"SmsJson\":[");
        foreach (C3_Sms sms in sms_lis)
        {
            if (sms.GIS_LAT != 0 || sms.GIS_LON != 0)
            {
                string wz = PublicMethod.GetPositionBySMSID(sms);
                json.Append("{");
                json.Append("\"ID\":\"" + sms.ID + "\",");//唯一标识
                json.Append("\"Dtime\":\"" + sms.DETECT_TIME.ToString("yyyy/MM/dd HH:mm") + "\",");//时间
                json.Append("\"LOCOMOTIVE_CODE\":\"" + sms.LOCOMOTIVE_CODE + "\",");//车号
                json.Append("\"DETECT_TIME\":\"" + sms.DETECT_TIME + "\",");//状态时间
                json.Append("\"GIS_X\":\"" + sms.GIS_LON + "\",");//百度经度
                json.Append("\"GIS_Y\":\"" + sms.GIS_LAT + "\",");//百度纬度
                json.Append("\"GIS_X_O\":\"" + sms.GIS_LON_O + "\",");//原始经度
                json.Append("\"GIS_Y_O\":\"" + sms.GIS_LAT_O + "\",");//原始纬度
                json.Append("\"BUREAU_CODE\":\"" + sms.BUREAU_CODE + "\",");//铁路局编码
                json.Append("\"BUREAU_NAME\":\"" + sms.BUREAU_NAME + "\",");//铁路局
                json.Append("\"ORG_CODE\":\"" + sms.ORG_CODE + "\",");//供电段编码
                json.Append("\"ORG_NAME\":\"" + sms.ORG_NAME + "\",");//供电段
                json.Append("\"LINE_CODE\":\"" + sms.LINE_CODE + "\",");//线路编码
                json.Append("\"LINE_NAME\":\"" + sms.LINE_NAME + "\",");//线路
                json.Append("\"POSITION_CODE\":\"" + sms.POSITION_CODE + "\",");//区站编码
                json.Append("\"POSITION_NAME\":\"" + sms.POSITION_NAME + "\",");//区站
                json.Append("\"DIRECTION\":\"" + sms.DIRECTION + "\",");//行别
                json.Append("\"KM_MARK\":\"" + sms.KM_MARK + "\",");//公里标
                json.Append("\"WZ\":\"" + (string.IsNullOrEmpty(wz) ? "-" : wz) + "\"");//位置信息
                json.Append("},");
            }
        }
        json.Remove(json.Length - 1, 1);
        json.Append("]}]},{\"Dtime\":[");
        foreach (C3_Sms sms in sms_lis)
        {
            if (sms.GIS_LAT != 0 || sms.GIS_LON != 0)
            {
                string wz = PublicMethod.GetPositionBySMSID(sms);
                json.Append("{");
                json.Append("\"Dtime\":\"" + sms.DETECT_TIME.ToString("yyyy/MM/dd HH:mm") + "\",");//时间
                json.Append("\"number\":\"" + order + "\"");//序号
                order++;
                json.Append("},");
            }
        }
        json.Remove(json.Length - 1, 1);
        json.Append("]}]]");
        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }

    /// <summary>
    /// 简单GPS误差判断 过滤部分不可存在的情况
    /// </summary>
    /// <param name="lis"></param>
    /// <returns></returns>
    public List<C3_Sms> FilterSms(List<C3_Sms> lis)
    {
        List<C3_Sms> newlis = new List<C3_Sms>();
        for (int i = 0; i < lis.Count; i++)
        {
            if (i == 0)
                newlis.Add(lis[0]);
            else if (i == lis.Count - 1)
                newlis.Add(lis[lis.Count - 1]);
            else
            {
                double three = my_gps.Distance(lis[i - 1].GIS_LON, lis[i - 1].GIS_LAT, lis[i + 1].GIS_LON, lis[i + 1].GIS_LAT);
                double one = my_gps.Distance(lis[i].GIS_LON, lis[i].GIS_LAT, lis[i - 1].GIS_LON, lis[i - 1].GIS_LAT);
                double two = my_gps.Distance(lis[i + 1].GIS_LON, lis[i + 1].GIS_LAT, lis[i].GIS_LON, lis[i].GIS_LAT);
                if (one > three || two > three)
                    continue;
                newlis.Add(lis[i]);
            }
        }
        return newlis;

    }

    /// <summary>
    /// 获取状态数据（带分页）
    /// </summary>
    /// <param name="context"></param>
    public void getSmsGpsPage(HttpContext context)
    {
        string locomotive_code = context.Request["locomotive_code"];
        string start_date = context.Request["start_date"];
        string end_date = context.Request["end_date"];
        string pageindex = context.Request["pageindex"];
        string pagesize = context.Request["pagesize"];

        C3_SmsCond cond = new C3_SmsCond();
        if (!string.IsNullOrEmpty(locomotive_code))
            cond.LOCOMOTIVE_CODE = locomotive_code;
        if (!string.IsNullOrEmpty(start_date))
            cond.startTime = Convert.ToDateTime(start_date);
        if (!string.IsNullOrEmpty(end_date))
            cond.endTime = Convert.ToDateTime(end_date);
        if (!string.IsNullOrEmpty(cond.businssAnd))
        {
            cond.businssAnd += " and ";
        }
        cond.businssAnd += " GIS_LAT !='0' AND GIS_LON !='0'";

        List<C3_Sms> lis_ = Api.ServiceAccessor.GetSmsService().getC3SmsbyCondition(cond);
        lis_ = FilterSms(lis_);
        cond.page = int.Parse(pageindex);
        cond.pageSize = int.Parse(pagesize);
        cond.orderBy = "DETECT_TIME ASC";

        List<C3_Sms> sms_lis = Api.ServiceAccessor.GetSmsService().getC3SmsbyCondition(cond);
        sms_lis = FilterSms(sms_lis);

        StringBuilder json = new StringBuilder();
        json.Append("{\"data\":[");
        foreach (C3_Sms sms in sms_lis)
        {
            if (sms.GIS_LAT != 0 || sms.GIS_LON != 0)
            {
                json.Append("{");
                json.Append("\"ID\":\"" + sms.ID + "\",");//唯一标识
                json.Append("\"LOCOMOTIVE_CODE\":\"" + sms.LOCOMOTIVE_CODE + "\",");//车号
                json.Append("\"DIRECTION\":\"" + sms.DIRECTION + "\",");//行别
                json.Append("\"LINE_CODE\":\"" + sms.LINE_CODE + "\",");//线路编码
                json.Append("\"LINE_NAME\":\"" + sms.LINE_NAME + "\",");//线路名
                json.Append("\"POSITION_CODE\":\"" + sms.POSITION_CODE + "\",");//区间编码
                json.Append("\"POSITION_NAME\":\"" + sms.POSITION_NAME + "\",");//区间名
                json.Append("\"DETECT_TIME\":\"" + sms.DETECT_TIME + "\"");//时间
                json.Append("},");
            }
        }
        json.Remove(json.Length - 1, 1);
        json.Append("],");
        json.Append("\"index\":\"" + pageindex + "\",\"size\":\"" + pagesize + "\",\"total\":\"" + lis_.Count() + "\"}");
        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }

    /// <summary>
    /// 建立重算任务
    /// </summary>
    /// <param name="context"></param>
    public void setCustom(HttpContext context)
    {
        string status = context.Request["status"];
        string data = context.Request["list"];
        List<C3_Sms> sms_lis = GetSmsByData(data).OrderBy(m => m.DETECT_TIME).ToList();
        var custom = sms_lis.GroupBy(x => x.MY_STR_1).Select(g => g.ToList()).ToList();

        List<COVERAGE_TASK> task_lis = new List<global::COVERAGE_TASK>();
        task_lis = getCoverageTaskBySms(custom, status);

        string re = "任务建立成功";
        bool sign = true;
        try
        {
            foreach (COVERAGE_TASK task in task_lis)
                InsertCoverageTask(task);
        }
        catch (Exception ex)
        {
            re = "任务建立失败";
            sign = false;
        }
        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write("{\"result\":\"" + status.Replace("ADD", "创建").Replace("UPDATE", "更新") + re + "\",\"sign\":\"" + sign + "\"}");
    }

    /// <summary>
    /// 获取辅助定位支柱数据，并入库
    /// </summary>
    /// <param name="context"></param>
    public void getCustomPosition(HttpContext context)
    {
        C3_SmsCond cond = new C3_SmsCond();
        cond.orderBy = "DETECT_TIME DESC";

        List<C3_Sms> sms_lis = Api.ServiceAccessor.GetSmsService().getC3SmsbyCondition(cond);
        List<C3_Sms> sms_lis_ = new List<C3_Sms>();
        // sms_lis_ = getPositionFromC3_Sms(sms_lis);
        int order = 1;
        foreach (C3_Sms sms in sms_lis_)
        {
            string logfilepath = PublicMethod.GetHttp() + sms.BACKUP_FILE_DIR + sms.LOG_FILENAME;
            LogGpsParser parser = new LogGpsParser();
            IList<LogGps> loggps_lis = parser.ParseData(logfilepath, sms.DETECT_TIME);
            foreach (LogGps loggps in loggps_lis)
            {
                CustomPole custom = new CustomPole();
                custom.ID = Guid.NewGuid().ToString("D");
                custom.POSITION_CODE = sms.POSITION_CODE;
                custom.POSITION_NAME = sms.POSITION_NAME;
                custom.GIS_LAT_O = loggps.Lat;
                custom.GIS_LON_O = loggps.Lon;
                custom.ORG_DIRECTION = sms.DIRECTION;
                custom.BUREAU_CODE = sms.BUREAU_CODE;
                custom.BUREAU_NAME = sms.BUREAU_NAME;
                custom.POWER_SECTION_CODE = sms.ORG_CODE;
                custom.POWER_SECTION_NAME = sms.ORG_NAME;
                custom.LINE_CODE = sms.LINE_CODE;
                custom.LINE_NAME = sms.LINE_NAME;
                custom.POLE_ORDER = order;
                order++;
                LineCoverage.InsertCustom(custom);
            }
        }
    }



    public List<T> IListToList<T>(IList<T> list)
    {
        T[] array = new T[list.Count];
        list.CopyTo(array, 0);
        return new List<T>(array);
    }

    /// <summary>
    /// 在指定的字符串列表CnStr中检索符合拼音索引字符串
    /// </summary>
    /// <param name="CnStr">汉字字符串</param>
    /// <returns>相对应的汉语拼音首字母串</returns>
    public string GetSpellCode(string CnStr)
    {
        string strTemp = "";
        int iLen = CnStr.Length;
        int i = 0;
        for (i = 0; i <= iLen - 1; i++)
        {
            string cr = CnStr.Substring(i, 1);
            //判断如果是汉字就转化成它的首个拼音字母
            if (Regex.IsMatch(cr, @"[\u4e00-\u9fa5]"))
                cr = GetCharSpellCode(cr);
            strTemp += cr;
        }
        return strTemp;
    }

    /// <summary>
    /// 得到一个汉字的拼音第一个字母，如果是一个英文字母则直接返回大写字母
    /// </summary>
    /// <param name="CnChar">单个汉字</param>
    /// <returns>单个大写字母</returns>
    private static string GetCharSpellCode(string CnChar)
    {
        long iCnChar;
        byte[] ZW = System.Text.Encoding.Default.GetBytes(CnChar);
        //如果是字母，则直接返回
        if (ZW.Length == 1)
        {
            return CnChar.ToUpper();
        }
        else
        {
            // get the array of byte from the single char
            int i1 = (short)(ZW[0]);
            int i2 = (short)(ZW[1]);
            iCnChar = i1 * 256 + i2;
        }
        // iCnChar match the constant
        if ((iCnChar >= 45217) && (iCnChar <= 45252))
        {
            return "A";
        }
        else if ((iCnChar >= 45253) && (iCnChar <= 45760))
        {
            return "B";
        }
        else if ((iCnChar >= 45761) && (iCnChar <= 46317))
        {
            return "C";
        }
        else if ((iCnChar >= 46318) && (iCnChar <= 46825))
        {
            return "D";
        }
        else if ((iCnChar >= 46826) && (iCnChar <= 47009))
        {
            return "E";
        }
        else if ((iCnChar >= 47010) && (iCnChar <= 47296))
        {
            return "F";
        }
        else if ((iCnChar >= 47297) && (iCnChar <= 47613))
        {
            return "G";
        }
        else if ((iCnChar >= 47614) && (iCnChar <= 48118))
        {
            return "H";
        }
        else if ((iCnChar >= 48119) && (iCnChar <= 49061))
        {
            return "J";
        }
        else if ((iCnChar >= 49062) && (iCnChar <= 49323))
        {
            return "K";
        }
        else if ((iCnChar >= 49324) && (iCnChar <= 49895))
        {
            return "L";
        }
        else if ((iCnChar >= 49896) && (iCnChar <= 50370))
        {
            return "M";
        }
        else if ((iCnChar >= 50371) && (iCnChar <= 50613))
        {
            return "N";
        }
        else if ((iCnChar >= 50614) && (iCnChar <= 50621))
        {
            return "O";
        }
        else if ((iCnChar >= 50622) && (iCnChar <= 50905))
        {
            return "P";
        }
        else if ((iCnChar >= 50906) && (iCnChar <= 51386))
        {
            return "Q";
        }
        else if ((iCnChar >= 51387) && (iCnChar <= 51445))
        {
            return "R";
        }
        else if ((iCnChar >= 51446) && (iCnChar <= 52217))
        {
            return "S";
        }
        else if ((iCnChar >= 52218) && (iCnChar <= 52697))
        {
            return "T";
        }
        else if ((iCnChar >= 52698) && (iCnChar <= 52979))
        {
            return "W";
        }
        else if ((iCnChar >= 52980) && (iCnChar <= 53640))
        {
            return "X";
        }
        else if ((iCnChar >= 53689) && (iCnChar <= 54480))
        {
            return "Y";
        }
        else if ((iCnChar >= 54481) && (iCnChar <= 55289))
        {
            return "Z";
        }
        else
            return ("?");
    }
    /// <summary>
    /// 由前端传递数据 转 状态数据List<C3_Sms>
    /// </summary>
    /// <param name="data"></param>
    /// <returns></returns>
    public List<C3_Sms> GetSmsByData(string data)
    {
        List<C3_Sms> sms_lis = new List<C3_Sms>();

        string[] datas = data.Split(';');
        if (datas.Length > 0)
        {
            for (int i = 0; i < datas.Length; i++)
            {
                if (!string.IsNullOrEmpty(datas[i]))
                {
                    //状态数据转换
                    string[] sms_ = datas[i].Split(',');
                    C3_Sms sms = new C3_Sms();
                    for (int j = 0; j < sms_.Length; j++)
                    {
                        if (sms_[j].Contains("time"))
                            sms.DETECT_TIME = Convert.ToDateTime(sms_[j].Substring(sms_[j].IndexOf(":") + 1, sms_[j].Length - sms_[j].IndexOf(":") - 1));
                        if (sms_[j].Contains("ID"))
                            sms.ID = sms_[j].Substring(sms_[j].IndexOf(":") + 1, sms_[j].Length - sms_[j].IndexOf(":") - 1);
                        if (sms_[j].Contains("LOCOMOTIVE_CODE"))
                            sms.LOCOMOTIVE_CODE = sms_[j].Substring(sms_[j].IndexOf(":") + 1, sms_[j].Length - sms_[j].IndexOf(":") - 1);
                        if (sms_[j].Contains("BUREAU_NAME"))
                            sms.BUREAU_NAME = sms_[j].Substring(sms_[j].IndexOf(":") + 1, sms_[j].Length - sms_[j].IndexOf(":") - 1);
                        if (sms_[j].Contains("ORG_NAME"))
                            sms.ORG_NAME = sms_[j].Substring(sms_[j].IndexOf(":") + 1, sms_[j].Length - sms_[j].IndexOf(":") - 1);
                        if (sms_[j].Contains("POSITION_NAME"))
                            sms.POSITION_NAME = sms_[j].Substring(sms_[j].IndexOf(":") + 1, sms_[j].Length - sms_[j].IndexOf(":") - 1);
                        if (sms_[j].Contains("LINE_NAME"))
                            sms.LINE_NAME = sms_[j].Substring(sms_[j].IndexOf(":") + 1, sms_[j].Length - sms_[j].IndexOf(":") - 1);
                        if (sms_[j].Contains("DIRECTION"))
                            sms.DIRECTION = sms_[j].Substring(sms_[j].IndexOf(":") + 1, sms_[j].Length - sms_[j].IndexOf(":") - 1);
                        if (sms_[j].Contains("sign"))
                            sms.MY_STR_1 = sms_[j].Substring(sms_[j].IndexOf(":") + 1, sms_[j].Length - sms_[j].IndexOf(":") - 1);
                    }
                    sms_lis.Add(sms);
                }
            }
        }
        return sms_lis;
    }

    /// <summary>
    /// 状态数据转重算任务
    /// </summary>
    /// <param name="customs"></param>
    public List<COVERAGE_TASK> getCoverageTaskBySms(List<List<C3_Sms>> customs, string status)
    {
        List<COVERAGE_TASK> task_lis = new List<global::COVERAGE_TASK>();

        foreach (List<C3_Sms> sms_lis in customs)
        {
            List<C3_Sms> lis = sms_lis.OrderBy(m => m.DETECT_TIME).ToList();
            //判断铁路局是否存在
            if (!string.IsNullOrEmpty(lis[0].BUREAU_NAME))
            {
                //根据铁路局NAME获取编码
                lis[0].BUREAU_CODE = PublicMethod.getOrgCodeByCodeName(lis[0].BUREAU_NAME);
                if (string.IsNullOrEmpty(lis[0].BUREAU_CODE))
                {
                    try
                    {
                        string str = GetSpellCode(lis[0].BUREAU_NAME.Substring(0, lis[0].BUREAU_NAME.IndexOf("铁路")));
                        //获取目前已有的铁路局总数
                        OrganizationCond cond = new OrganizationCond();
                        cond.ORG_TYPE = "J";
                        int number = Api.ServiceAccessor.GetFoundationService().getOrganizationCount(cond);
                        lis[0].BUREAU_CODE = str + "J$J" + (number + 1);
                        //添加新的铁路局
                        Organization org = new Organization();
                        org.ORG_CODE = lis[0].BUREAU_CODE;
                        org.ORG_NAME = lis[0].BUREAU_NAME;
                        org.SUP_ORG_CODE = "TOPBOSS";
                        org.SUP_ORG_NAME = "铁路总公司";
                        org.ORG_LAYER = 20;
                        org.ORG_TYPE = "J";
                        org.IS_MODIFY_ALLOWED = "1";
                        Api.ServiceAccessor.GetFoundationService().organizationAdd(org);
                    }
                    catch (Exception ex)
                    {

                    }
                }
            }

            //判断供电段是否存在
            if (!string.IsNullOrEmpty(lis[0].ORG_NAME))
            {
                //根据供电段NAME获取编码
                lis[0].ORG_CODE = PublicMethod.getOrgCodeByCodeName(lis[0].ORG_NAME);
                if (string.IsNullOrEmpty(lis[0].ORG_CODE))
                {
                    try
                    {
                        string str = GetSpellCode(lis[0].ORG_NAME.Substring(0, lis[0].ORG_NAME.IndexOf("段") - 2));
                        lis[0].ORG_CODE = lis[0].BUREAU_CODE + "$" + str + "$GDD";
                        //添加新的供电段
                        Organization org = new Organization();
                        org.ORG_CODE = lis[0].ORG_CODE;
                        org.ORG_NAME = lis[0].ORG_NAME;
                        org.SUP_ORG_CODE = lis[0].BUREAU_CODE;
                        org.SUP_ORG_NAME = lis[0].BUREAU_NAME;
                        org.ORG_LAYER = 30;
                        org.ORG_TYPE = "GDD";
                        org.IS_MODIFY_ALLOWED = "1";
                        Api.ServiceAccessor.GetFoundationService().organizationAdd(org);
                    }
                    catch (Exception ex)
                    {

                    }
                }
            }

            //判断线路是否存在
            if (!string.IsNullOrEmpty(lis[0].LINE_NAME))
            {
                //根据线路NAME获取编码
                lis[0].LINE_CODE = PublicMethod.getLineCodeByCodeName(lis[0].LINE_NAME);
                if (string.IsNullOrEmpty(lis[0].LINE_CODE))
                {
                    try
                    {
                        string str = GetSpellCode(lis[0].LINE_NAME);
                        //查询目前所有的线路
                        IList<Line> line_lis = Api.ServiceAccessor.GetFoundationService().getAllLine();
                        line_lis = line_lis.OrderByDescending(m => m.LINE_NO).ToList();
                        //获取线路编号最大的线路
                        double order = line_lis[0].LINE_NO;
                        lis[0].LINE_CODE = str + "$" + (order + 1);
                        //添加新的线路
                        Line line = new Line();
                        line.LINE_CODE = lis[0].LINE_CODE;
                        line.LINE_NAME = lis[0].LINE_NAME;
                        line.LINE_NO = order + 1;
                        line.BUREAU_CODE = lis[0].BUREAU_CODE;
                        line.BUREAU_NAME = lis[0].BUREAU_NAME;
                        Api.ServiceAccessor.GetFoundationService().lineAdd(line);
                    }
                    catch (Exception ex)
                    {

                    }
                }
            }

            //判断区站是否存在
            lis[0].POSITION_NAME = lis[0].POSITION_NAME.Replace("-", "－");
            if (!string.IsNullOrEmpty(lis[0].POSITION_NAME))
            {
                //根据线路NAME获取编码
                lis[0].POSITION_CODE = PublicMethod.getPosiCodeByCodeName(lis[0].POSITION_NAME);
                if (string.IsNullOrEmpty(lis[0].POSITION_CODE))
                {
                    try
                    {
                        StationSection posi = new StationSection();
                        if (lis[0].POSITION_NAME.Contains("－"))
                        {
                            string str = GetSpellCode(lis[0].POSITION_NAME);
                            lis[0].POSITION_CODE = lis[0].LINE_CODE + "$Q_" + str;
                            posi.POSITION_TYPE = "Q";
                        }
                        else
                        {
                            string str = GetSpellCode(lis[0].POSITION_NAME);
                            lis[0].POSITION_CODE = lis[0].LINE_CODE + "$S_" + str;
                            posi.POSITION_TYPE = "S";
                        }
                        //添加新的区站
                        posi.POSITION_CODE = lis[0].POSITION_CODE;
                        posi.POSITION_NAME = lis[0].POSITION_NAME;
                        posi.LINE_CODE = lis[0].LINE_CODE;
                        posi.LINE_NAME = lis[0].LINE_NAME;
                        posi.DIRECTION = lis[0].DIRECTION;
                        posi.POWER_SECTION_CODE = lis[0].ORG_CODE;
                        posi.POWER_SECTION_NAME = lis[0].ORG_NAME;
                        posi.BUREAU_CODE = lis[0].BUREAU_CODE;
                        posi.BUREAU_NAME = lis[0].BUREAU_NAME;
                        Api.ServiceAccessor.GetFoundationService().stationSectionAdd(posi);
                    }
                    catch (Exception ex)
                    {

                    }
                }
            }

            //建立重算任务
            COVERAGE_TASK task = new global::COVERAGE_TASK();
            task.TASK_ID = Guid.NewGuid().ToString("D");
            task.LOCOMOTIVE_CODE = lis[0].LOCOMOTIVE_CODE;
            task.BUREAU_CODE = lis[0].BUREAU_CODE;
            task.BUREAU_NAME = lis[0].BUREAU_NAME;
            task.LINE_CODE = lis[0].LINE_CODE;
            task.LINE_NAME = lis[0].LINE_NAME;
            task.POWER_SECTION_CODE = lis[0].ORG_CODE;
            task.POWER_SECTION_NAME = lis[0].ORG_NAME;
            task.POSITION_CODE = lis[0].POSITION_CODE;
            task.POSITION_NAME = lis[0].POSITION_NAME;
            task.DIRECTION = lis[0].DIRECTION;
            task.START_DATE = lis[0].DETECT_TIME;
            task.END_DATE = lis[lis.Count - 1].DETECT_TIME;
            task.STATUS = "WAIT";
            task.TYPE = status;
            task_lis.Add(task);
        }
        return task_lis;
    }


    /// <summary>
    /// 插入重算任务
    /// </summary>
    /// <param name="custom"></param>
    public void InsertCoverageTask(COVERAGE_TASK task)
    {
        int result = 0;
        try
        {
            string sql = string.Format(@"INSERT INTO COVERAGE_TASK
                                          (TASK_ID,
                                           LOCOMOTIVE_CODE,
                                           BUREAU_CODE,
                                           BUREAU_NAME,
                                           POWER_SECTION_CODE,
                                           POWER_SECTION_NAME,
                                           LINE_CODE,
                                           LINE_NAME,
                                           POSITION_CODE,
                                           POSITION_NAME,
                                           DIRECTION,
                                           START_DATE,
                                           END_DATE,
                                           STATUS,
                                           TYPE)
                                        VALUES
                                          ('{0}',
                                           '{1}',
                                           '{2}',
                                           '{3}',
                                           '{4}',
                                           '{5}',
                                           '{6}',
                                           '{7}',
                                           '{8}',
                                           '{9}',
                                           '{10}',
                                           TO_DATE('{11}', 'yyyy/MM/dd HH24:mi:ss'),
                                           TO_DATE('{12}', 'yyyy/MM/dd HH24:mi:ss'),
                                           '{13}',
                                           '{14}')", task.TASK_ID, task.LOCOMOTIVE_CODE, task.BUREAU_CODE, task.BUREAU_NAME, task.POWER_SECTION_CODE, task.POWER_SECTION_NAME, task.LINE_CODE, task.LINE_NAME, task.POSITION_CODE, task.POSITION_NAME, task.DIRECTION, task.START_DATE.ToString("yyyy/MM/dd HH:mm:ss"), task.END_DATE.ToString("yyyy/MM/dd HH:mm:ss"), task.STATUS, task.TYPE);
            result = DbHelperOra_ADO.ExecuteSql(sql);
        }
        catch (Exception ex)
        {
            log4net.ILog log2 = log4net.LogManager.GetLogger("插入重算任务数据出错");
            log2.Error("执行出错", ex);
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

public class COVERAGE_TASK
{
    /// <summary>
    /// 主键
    /// </summary>
    public string TASK_ID;
    /// <summary>
    /// 车号
    /// </summary>
    public string LOCOMOTIVE_CODE;
    /// <summary>
    /// 铁路局编码
    /// </summary>
    public string BUREAU_CODE;
    /// <summary>
    /// 铁路局
    /// </summary>
    public string BUREAU_NAME;
    /// <summary>
    /// 供电段编码
    /// </summary>
    public string POWER_SECTION_CODE;
    /// <summary>
    /// 供电段
    /// </summary>
    public string POWER_SECTION_NAME;
    /// <summary>
    /// 线路名编码
    /// </summary>
    public string LINE_CODE;
    /// <summary>
    /// 线路名
    /// </summary>
    public string LINE_NAME;
    /// <summary>
    /// 区站编码
    /// </summary>
    public string POSITION_CODE;
    /// <summary>
    /// 区站
    /// </summary>
    public string POSITION_NAME;
    /// <summary>
    /// 行别
    /// </summary>
    public string DIRECTION;
    /// <summary>
    /// 开始时间
    /// </summary>
    public DateTime START_DATE;
    /// <summary>
    /// 结束时间
    /// </summary>
    public DateTime END_DATE;
    /// <summary>
    /// 任务状态
    /// </summary>
    public string STATUS;
    /// <summary>
    /// 任务类型
    /// </summary>
    public string TYPE;
}

