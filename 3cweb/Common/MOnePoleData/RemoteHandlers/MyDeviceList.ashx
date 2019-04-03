<%@ WebHandler Language="C#" Class="MyDeviceList" %>

using System;
using System.Web;
using Api.Foundation.entity.Foundation;
using Api.Foundation.entity.Cond;
using System.Collections.Generic;
using System.Text;
using System.Data;

public class MyDeviceList : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        try
        {
            string action = context.Request["action"];
            switch (action)
            {
                case "getList":
                    List();
                    break;
                case "getPole":
                    getPole();
                    break;
                case "getKM"://3C详情页反推公里标
                    getKM();
                    break;
                case "getPoloeID"://3C详情页获取杆号ID
                    getPoloeID();
                    break;
                case "LINE_INSPECT":
                    getLine_inspect_Info();
                    break;
                case "PoleList":
                    getPoleList();
                    break;
                case "NextPole":
                    getNextPole();
                    break;
                //case "getPoleAux":
                //    getPoleAux();
                //    break;
                default:
                    break;
            }
        }
        catch (Exception ex)
        {

            log4net.ILog log = log4net.LogManager.GetLogger("生成支柱列表和支柱基本信息json串");
            log.Error("执行出错", ex);
        }

    }
    public void List()
    {
        string lineCode = "";
        string positionCode = "";
        string brgTunCode = "";

        string LPB_type = HttpContext.Current.Request["LPB_Type"];
        string LPB_Code = HttpContext.Current.Request["LPB_Code"];
        switch (LPB_type)
        {
            case "LINE":
                lineCode = LPB_Code;
                break;
            case "POSITION":
                positionCode = LPB_Code;
                break;
            case "BRIDGETUNE":
                brgTunCode = LPB_Code;
                break;
            default:
                break;

        }
        //开始时间
        string startTime =HttpContext.Current.Request["start_time"];
        //结束时间
        string endTime = HttpContext.Current.Request["end_time"];
        //行别
        string direction = HttpContext.Current.Request["direction"];
        //报警状态
        string status = HttpContext.Current.Request["zt"];
        //报警级别
        string severity = HttpContext.Current.Request["jb"];
        //开始公里标
        int startKM = !string.IsNullOrEmpty(HttpContext.Current.Request["startKM"]) ? Convert.ToInt32(HttpContext.Current.Request["startKM"]) : -1;
        //结束公里标
        int endKM = !string.IsNullOrEmpty(HttpContext.Current.Request["endKM"]) ? Convert.ToInt32(HttpContext.Current.Request["endKM"]) : -1;
        //杆号
        string poleNO = HttpContext.Current.Request["poleNO"];
        //组织机构
        string org_code = HttpContext.Current.Request["org_code"];
        //缺陷数下限
        int startFault = !string.IsNullOrEmpty(HttpContext.Current.Request["startFault"]) ? Convert.ToInt32(HttpContext.Current.Request["startFault"]) : -1;
        //缺陷数上线
        int endFault = !string.IsNullOrEmpty(HttpContext.Current.Request["endFault"]) ? Convert.ToInt32(HttpContext.Current.Request["endFault"]) : -1;
        //前台页码
        int pageIndex = Convert.ToInt32(HttpContext.Current.Request["pageIndex"]);
        //前台条数
        int pageSize = Convert.ToInt32(HttpContext.Current.Request["pageSize"]);

        //   IList<Pole> list = Api.ServiceAccessor.GetFoundationService().queryPole_Event(cond);
        DataSet ds = PoleDataFile.STAT_POLE_ALARM(90, org_code, lineCode, positionCode, brgTunCode, direction, poleNO, severity,status,startTime,endTime,startKM, endKM, pageSize, pageIndex, startFault, endFault);

        DataTable dt = ds.Tables[0];
        StringBuilder jsonbuilder = new StringBuilder();
        jsonbuilder.Append("{'data':");
        String jsonStr = JsonUtil.ToJson(dt);

        jsonbuilder.Append(jsonStr);
        int TOTAL_ROWS = 0;

        if (dt.Rows.Count > 0)
        {
            TOTAL_ROWS = Convert.ToInt32(dt.Rows[0]["TOTAL_ROWS"]);
        }
        jsonbuilder.Append(",'TOTAL_ROWS':'" + TOTAL_ROWS + "','pageIndex':'" + pageIndex + "','pageSize':'" + pageSize + "',");

        PageHelper ph = new PageHelper();
        ph.getPageHelper(TOTAL_ROWS, pageIndex, pageSize);
        string pageOfTotal = ph.PageOfTotal;
        string pageRange = ph.PageRange;
        int totalPages = ph.Total_pages;

        jsonbuilder.Append("'pageOfTotal':'" + pageOfTotal + "','pageRange':'" + pageRange + "','totalPages':'" + totalPages + "'}");
        jsonbuilder = jsonbuilder.Replace("'", "\"");
        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(jsonbuilder);

    }


    /// <summary>
    /// 杆属性的结构体
    /// </summary>
    public class PoleStrct
    {
        public string POLE_CODE;
        public string POLE_STRCT_TYPE;
        public string POLE_STRCT_VALUE;
    }
    public void getPole()
    {
        //string ID = HttpContext.Current.Request["ID"];
        //Pole m = Api.ServiceAccessor.GetFoundationService().queryPole(ID);
        string polecode = HttpContext.Current.Request["polecode"];
        Pole m = Api.ServiceAccessor.GetFoundationService().queryPoleByPoleCode(polecode);
        StringBuilder jsonStr = new StringBuilder();
        string KMSTANDARD = PublicMethod.KmtoString(Convert.ToInt32(m.KMSTANDARD));
        //查询杆对应的属性和值
        System.Data.DataSet ds = ADO.AlarmDevDetectTarget.QueryPole(m.POLE_CODE);
        DataTable dt = ds.Tables[0];
        List<PoleStrct> PoleStrctList = HardDiskLineStandard.ModelConvertHelper<PoleStrct>.ConvertToModel(dt);
        jsonStr.Append("{'POLE_NO':'" + m.POLE_NO + "',");
        jsonStr.Append("'POLE_CODE':'" + m.POLE_CODE + "',");
        jsonStr.Append("'LINE_NAME':'" + m.LINE_NAME + "',");
        jsonStr.Append("'LINE_CODE':'" + m.LINE_CODE + "',");
        jsonStr.Append("'DIRECTION':'" + m.ORG_DIRECTION + "',");
        jsonStr.Append("'POSITION_NAME':'" + m.POSITION_NAME + "',");
        jsonStr.Append("'POSITION_CODE':'" + m.POSITION_CODE + "',");
        jsonStr.Append("'BRG_TUN_NAME':'" + m.BRG_TUN_NAME + "',");
        jsonStr.Append("'BRG_TUN_CODE':'" + m.BRG_TUN_CODE + "',");
        jsonStr.Append("'POLE_DIRECTION':'" + m.ORG_DIRECTION + "',");
        jsonStr.Append("'KMSTANDARD':'" + KMSTANDARD + "',");
        jsonStr.Append("'KMSTANDARD_n':'" + m.KMSTANDARD + "',");
        jsonStr.Append("'ORG_NAME':'" + m.ORG_NAME + "',");
        jsonStr.Append("'GIS_LON':'" + m.GIS_LON + "',");
        jsonStr.Append("'GIS_LAT':'" + m.GIS_LAT + "',");
        if (PoleStrctList.Count > 0)
        {
            jsonStr.Append("'POLESTRCT':[");
            for (int i = 0; i < PoleStrctList.Count; i++)
            {
                jsonStr.Append("{");
                jsonStr.AppendFormat("'POLE_CODE':'{0}',", PoleStrctList[i].POLE_CODE);
                jsonStr.AppendFormat("'POLE_STRCT_TYPE':'{0}',", PoleStrctList[i].POLE_STRCT_TYPE);
                jsonStr.AppendFormat("'POLE_STRCT_VALUE':'{0}'", PoleStrctList[i].POLE_STRCT_VALUE);

                if (i == PoleStrctList.Count - 1)
                {
                    jsonStr.Append("}");
                }
                else
                {
                    jsonStr.Append("},");
                }
            }
            jsonStr.Append("],");
        }
        jsonStr.Append("'BUREAU_NAME':'" + m.BUREAU_NAME + "'}");
        jsonStr = jsonStr.Replace("'", "\"");
        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(jsonStr);
    }

    /// <summary>
    /// 编辑位置反推公里标
    /// </summary>
    public void getKM()
    {
        //线路
        string lineCode = HttpContext.Current.Request["lineCode"];
        //区站
        string positionCode = HttpContext.Current.Request["position"];
        //桥隧
        string brgTunCode = HttpContext.Current.Request["bridgetune"];
        //行别
        string direction = HttpContext.Current.Request["direction"];
        //杆号
        string poleNO = HttpContext.Current.Request["poleNO"];

        PoleCond poleCond = new PoleCond();
        if (lineCode != "0" && !string.IsNullOrEmpty(lineCode))
        {
            poleCond.LINE_CODE = lineCode;
        }
        if (positionCode != "0" && !string.IsNullOrEmpty(positionCode))
        {
            poleCond.POSITION_CODE = positionCode;
        }
        if (brgTunCode != "0" && !string.IsNullOrEmpty(brgTunCode))
        {
            poleCond.BRG_TUN_CODE = brgTunCode;
        }
        if (direction != "0" && !string.IsNullOrEmpty(direction))
        {
            poleCond.POLE_DIRECTION = direction;
        }
        if (!string.IsNullOrEmpty(poleNO))
        {
            poleCond.POLE_NO = poleNO;
        }

        poleCond.businssAnd = "1=1";

        IList<Pole> listPole = Api.ServiceAccessor.GetFoundationService().queryPole(poleCond);
        //StringBuilder jsonAll = new StringBuilder();
        string jsonAll = "[";
        if (listPole.Count > 0)
        {
            for (int i = 0; i < listPole.Count; i++)
            {
                jsonAll += "{\"polekm" + i + "\":\"" + listPole[i].KMSTANDARD + "\"},";
            }
            jsonAll = jsonAll.Substring(0, jsonAll.Length - 1);
        }
        jsonAll += "]";
        HttpContext.Current.Response.Write(jsonAll);
    }




    /// <summary>
    /// 3C详情页获取杆号ID
    /// </summary>
    public void getPoloeID()
    {
        //线路
        string lineCode = HttpContext.Current.Request["lineCode"];
        //区站
        string positionCode = HttpContext.Current.Request["position"];
        //桥隧
        string brgTunCode = HttpContext.Current.Request["bridgetune"];
        //行别
        string direction = HttpContext.Current.Request["direction"];
        //杆号
        string poleNO = HttpContext.Current.Request["poleNO"];
        //公里标
        string KM = HttpContext.Current.Request["KM"];

        PoleCond poleCond = new PoleCond();
        if (lineCode != "0" && !string.IsNullOrEmpty(lineCode))
        {
            poleCond.LINE_NAME = lineCode;
        }
        if (positionCode != "0" && !string.IsNullOrEmpty(positionCode))
        {
            poleCond.POSITION_NAME = positionCode;
        }
        if (brgTunCode != "0" && !string.IsNullOrEmpty(brgTunCode))
        {
            poleCond.BRG_TUN_CODE = brgTunCode;
        }
        if (direction != "0" && !string.IsNullOrEmpty(direction))
        {
            poleCond.POLE_DIRECTION = direction;
        }
        if (!string.IsNullOrEmpty(poleNO))
        {
            poleCond.POLE_NO = poleNO;
        }
        //if(!string.IsNullOrEmpty(KM))
        //{
        //    poleCond.KMSTANDARD = (ulong)Convert.ToInt64( PublicMethod.KmToString(KM));
        //}
        if (!string.IsNullOrEmpty(KM) && KM != "-1")
        {
            poleCond.businssAnd = "1=1 and KMSTANDARD='" + PublicMethod.KmtoString(KM) + "'";
        }
        else
        {
            poleCond.businssAnd = "1=1";
        }



        IList<Pole> listPole = Api.ServiceAccessor.GetFoundationService().queryPole(poleCond);
        string jsonAll = "[";
        if (listPole.Count > 0)
        {
            for (int i = 0; i < listPole.Count; i++)
            {
                jsonAll += "{\"ID\":\"" + listPole[i].ID + "\"},";
            }
            jsonAll = jsonAll.Substring(0, jsonAll.Length - 1);
        }
        jsonAll += "]";
        HttpContext.Current.Response.Write(jsonAll);
    }
    /// <summary>
    /// 一杆一档详情页根据杆编码获取线路巡检相关信息
    /// </summary>
    public void getLine_inspect_Info()
    {
        string POLE_CODE = HttpContext.Current.Request["POLE_CODE"];
        System.Data.DataSet ds = ADO.LineInspectImpl.RepeatInspectDetail(null, POLE_CODE, null);
    }

    public void getPoleList()
    {
        //线路
        string lineCode = HttpContext.Current.Request["lineCode"];
        //行别
        string direction = HttpContext.Current.Request["direction"];
        //区站
        string positionCode = HttpContext.Current.Request["position"];
        //桥隧
        string brgTunCode = HttpContext.Current.Request["bridgetune"];
        //局编码
        string bureau_code = HttpContext.Current.Request["bureau_code"];
        //供电段
        string org_code = HttpContext.Current.Request["org_code"];
        //开始公里标
        int startKM = !string.IsNullOrEmpty(HttpContext.Current.Request["startKM"]) ? Convert.ToInt32(HttpContext.Current.Request["startKM"]) : -1;
        //结束公里标
        int endKM = !string.IsNullOrEmpty(HttpContext.Current.Request["endKM"]) ? Convert.ToInt32(HttpContext.Current.Request["endKM"]) : -1;
        //杆号
        string pole_no = HttpContext.Current.Request["pole_no"];
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
        if (!string.IsNullOrEmpty(brgTunCode))
        {
            polecond.BRG_TUN_CODE = brgTunCode;
        }
        if (!string.IsNullOrEmpty(bureau_code))
        {
            polecond.BUREAU_CODE = bureau_code;
        }
        if (!string.IsNullOrEmpty(org_code))
        {
            polecond.POWER_SECTION_CODE = org_code;
        }
        if (startKM != -1)
        {
            polecond.startKm = startKM;
        }
        if (endKM != -1)
        {
            polecond.endKm = endKM;
        }
        if (!string.IsNullOrEmpty(pole_no))
        {
            if (!string.IsNullOrEmpty(polecond.businssAnd))
            {
                polecond.businssAnd += " AND ";
            }

            polecond.businssAnd += string.Format(" POLE_NO LIKE '%{0}%'", pole_no);

        }
        polecond.pageSize = pageSize;
        polecond.pageNum = pageIndex;
        polecond.orderBy = "KMSTANDARD ASC";

        StringBuilder json = new StringBuilder();

        json.Append("{\"data\":[");

        IList<Pole> poleList = Api.ServiceAccessor.GetFoundationService().queryPolePage(polecond, true);

        for (int i = 0; i < poleList.Count; i++)
        {
            json.Append("{\"KM\":\"" + PublicMethod.KmtoString(poleList[i].KMSTANDARD.ToString()) + "\",");
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
    /// <summary>
    /// 支柱表获取上下一杆
    /// </summary>
    public void getNextPole()
    {
        string tag = HttpContext.Current.Request["tag"];
        string polecode = HttpContext.Current.Request["polecode"];
        string line_code = HttpContext.Current.Request["line_code"];
        string direction = HttpContext.Current.Request["direction"];

        if (!string.IsNullOrEmpty(polecode))
        {
            polecode.Replace("%23", "#");
        }

        string re = ADO.Pole.NextPole(polecode, tag, line_code, direction);

        StringBuilder json = new StringBuilder();
        json.Append("{\"re\":\"" + re + "\"}");

        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }
    public void getPoleAux()
    {
        string polecode = HttpContext.Current.Request["polecode"];//支柱编码

        StringBuilder json = new StringBuilder();
        json.Append("[");

        if (!string.IsNullOrEmpty(polecode))
        {
            System.Data.DataSet ds = ADO.Pole.getPole_AuxByPolecode(polecode);
            if (ds.Tables.Count > 0)
            {
                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    json.Append("{");
                    json.Append("\"POLE_STRCT_TYPE\":\"" + ds.Tables[0].Rows[i]["POLE_STRCT_TYPE"] + "\",");
                    json.Append("\"POLE_STRCT_TYPE_NAME\":\"" + ds.Tables[0].Rows[i]["CODE_NAME"] + "\"");
                    json.Append("}");
                    if (i < ds.Tables[0].Rows.Count - 1)
                    {
                        json.Append(",");
                    }
                }
            }
        }

        json.Append("]");
        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}