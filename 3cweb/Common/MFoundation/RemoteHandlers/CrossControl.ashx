<%@ WebHandler Language="C#" Class="CrossControl" %>

using System;
using System.Web;
using Api.Foundation.entity.Foundation;
using System.Collections.Generic;
using Api.Foundation.service;
using Api;
using Api.Util;
using Api.Foundation.entity.Cond;
using System.Text;
using System.Linq;

public class CrossControl : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        string type = context.Request["type"];
        switch (type)
        {
            //查询所有交路
            case "all":
                GetAll();
                break;
            //添加交路
            case "add":
                Add();
                break;
            //修改交路
            case "update":
                Update();
                break;
            //删除交路
            case "delete":
                Delete();
                break;
            //获取交路区站信息
            case "lkj":
                GetLKJ();
                break;
            //添加区站到交路区站
            case "InsertLKJ":
                InsertLKJ();
                break;
            case "UpdateLKJ":
                UpdateLKJ();
                break;
            //移除交路区站
            case "remove":
                RemoveLKJ();
                break;
            default:
                break;
        }
    }
    /// <summary>
    /// 删除
    /// </summary>
    private void Delete()
    {
        bool str = false;
        try
        {
            string id = HttpContext.Current.Request["id"].TrimStart('c');
            str = ServiceAccessor.GetFoundationService().routingDelete(id);

            if (str)
            {
                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "LKJ数据管理", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "LKJ数据管理页面删除了交路信息，交路ID:" + id, "", true);
            }
            else
            {
                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "LKJ数据管理", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "LKJ数据管理页面删除了交路信息，交路ID:" + id, "", false);
            }
        }
        catch
        {
            str = false;
        }
        finally
        {
            HttpContext.Current.Response.Write(str ? "1" : "-1");
            
        }
    }
    /// <summary>
    /// 修改
    /// </summary>
    private void Update()
    {
        string rs = "1";
        try
        {
            string id = HttpContext.Current.Request["id"].TrimStart('c');
            //string bc = HttpContext.Current.Request["BUREAU_CODE"];
            //string no = HttpContext.Current.Request["ROUTING_NO"];
            //string code = bc + "$" + no.PadLeft(2, '0');
            Routing routing = ServiceAccessor.GetFoundationService().queryRouting(id);
            //routing.ROUTING_CODE = HttpContext.Current.Request["ROUTING_CODE"];
            //routing.ROUTING_NO = HttpContext.Current.Request["ROUTING_NO"];
            routing.CUSTOMER_GOODS = HttpContext.Current.Request["CUSTOMER_GOODS"];
            routing.AREA_SECTION = HttpContext.Current.Request["AREA_SECTION"];
            //routing.BUREAU_CODE = HttpContext.Current.Request["BUREAU_CODE"];
            //routing.BUREAU_NAME = HttpContext.Current.Request["BUREAU_NAME"];
            //routing.ROUTING_CODE = routing.BUREAU_CODE + "$" + routing.ROUTING_NO.PadLeft(2, '0');
            rs = ServiceAccessor.GetFoundationService().routingUpdate(routing) ? "1" : "-1";

            if (rs =="1")
            {
                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "LKJ数据管理", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "LKJ数据管理页面修改了交路信息，交路号:" + HttpContext.Current.Request["ROUTING_NO"], "", true);
            }
            else
            {
                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "LKJ数据管理", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "LKJ数据管理页面修改了交路信息，交路号:" + HttpContext.Current.Request["ROUTING_NO"], "", false); 
            }
        }
        catch
        {
            rs = "-1";
        }
        finally
        {
            HttpContext.Current.Response.Write(rs);
            
        }
    }
    /// <summary>
    /// 增加
    /// </summary>
    private void Add()
    {
        string rs = "1";
        try
        {
            RoutingCond cond = new RoutingCond();
            cond.ROUTING_NO = HttpContext.Current.Request["ROUTING_NO"];
            cond.BUREAU_CODE = HttpContext.Current.Request["BUREAU_CODE"];

            string routingNo = HttpContext.Current.Request["ROUTING_NO"];
            string bureauCode = HttpContext.Current.Request["BUREAU_CODE"];

            string routingCode = bureauCode + "$" + routingNo.PadLeft(2, '0');

            IList<Routing> routList = ServiceAccessor.GetFoundationService().getRoutingByCode(routingCode);
            if (routList.Count == 0)
            {
                Routing routing = new Routing();
                routing.ROUTING_NO = routingNo;
                routing.CUSTOMER_GOODS = HttpContext.Current.Request["CUSTOMER_GOODS"];
                routing.AREA_SECTION = HttpContext.Current.Request["AREA_SECTION"];
                if (bureauCode != "0")
                {
                    routing.BUREAU_CODE = bureauCode;
                    routing.BUREAU_NAME = HttpContext.Current.Request["BUREAU_NAME"];
                }
                routing.ROUTING_CODE = routingCode;
                ServiceAccessor.GetFoundationService().routingAdd(routing);

                if (ServiceAccessor.GetFoundationService().routingAdd(routing))
                {
                    Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "LKJ数据管理", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "LKJ数据管理页面添加了新的交路信息，交路号:" + HttpContext.Current.Request["ROUTING_NO"], "", true);
                }else{
                   Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "LKJ数据管理", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "LKJ数据管理页面添加了新的交路信息，交路号:" + HttpContext.Current.Request["ROUTING_NO"], "", false); 
                }
            }
            else
            {
                rs = "-2";
            }
        }
        catch
        {
            rs = "-1";
        }
        finally
        {
            HttpContext.Current.Response.Write(rs);
            
        }
    }
    /// <summary>
    /// 获取所有交路信息
    /// </summary>
    private void GetAll()
    {
        //获取前台页码
        int pageIndex = Convert.ToInt32(HttpContext.Current.Request["page"]);
        //获取前台条数
        int pageSize = Convert.ToInt32(HttpContext.Current.Request["rp"]);
        //条件
        Api.Foundation.entity.Cond.RoutingCond cond = new Api.Foundation.entity.Cond.RoutingCond();
        cond.pageNum = pageIndex;
        cond.pageSize = pageSize;
        if (HttpContext.Current.Request["CROSSING_NUMBER"] != null && HttpContext.Current.Request["CROSSING_NUMBER"] != "")
        {
            cond.ROUTING_NO = HttpContext.Current.Request["CROSSING_NUMBER"];
        }
        if (HttpContext.Current.Request["BUREAU_CODE"] != null && HttpContext.Current.Request["BUREAU_CODE"] != "0")
        {
            cond.BUREAU_CODE = HttpContext.Current.Request["BUREAU_CODE"];
        }


        IList<Routing> list = ServiceAccessor.GetFoundationService().queryRouting(cond);

        //获取总条数
        int recordCount = ServiceAccessor.GetFoundationService().getRoutingCount(cond);
        StringBuilder sb = new StringBuilder();
        sb.Append("{\"rows\":[");
        foreach (Routing r in list)
        {
            string url = "";
            if (PublicMethod.buttonControl("CrossList.htm", "UPDATE"))
            {
                url += "<a href=javascript:updateCrossModal(c" + r.ID + ")>修改</a>&nbsp;<a href=javascript:mgrCrossModal(c" + r.ID + ")>管理</a>&nbsp;";
            }
            if (PublicMethod.buttonControl("CrossList.htm", "DELETE"))
            {
                url += "<a href=javascript:deleteCross(c" + r.ID + ")>删除</a>";
            }
            sb.AppendFormat("{{\"ROUTING_NO\":\"{0}\",\"ROUTING_CODE\":\"{1}\",\"AREA_SECTION\":\"{2}\",\"CUSTOMER_GOODS\":\"{3}\",\"BUREAU_CODE\":\"{4}\",\"BUREAU_NAME\":\"{5}\",\"cz\":\"{6}\",\"id\":\"c{7}\"}},",
                            r.ROUTING_NO, r.ROUTING_CODE, r.AREA_SECTION, r.CUSTOMER_GOODS, r.BUREAU_CODE, r.BUREAU_NAME, url, r.ID);
        }
        string js = sb.ToString();
        if (js.LastIndexOf(',') > -1)
        {
            js = js.Substring(0, js.LastIndexOf(','));
        }
        js += String.Format("],\"page\":{0},\"rp\":{1},\"total\":{2}}}", pageIndex, pageSize, recordCount);

        HttpContext.Current.Response.Write(js);
        
    }
    /// <summary>
    /// 得到交路区站列表
    /// </summary>
    private void GetLKJ()
    {
        //获取前台页码
        int pageIndex = Convert.ToInt32(HttpContext.Current.Request["page"]);
        //获取前台条数
        int pageSize = Convert.ToInt32(HttpContext.Current.Request["rp"]);
        string RoutCode = HttpContext.Current.Request["RoutCode"];

        string jsonStr = "";
        if (RoutCode != null && RoutCode != "")
        {
            string stationNo = HttpContext.Current.Request["stationNo"];
            string stationName = HttpContext.Current.Request["stationName"];
            string lineCode = HttpContext.Current.Request["lineCode"];

            StringBuilder sb = new StringBuilder();
            sb.Append("{\"rows\":[");

            LkjCond cond = new LkjCond();
            cond.pageNum = pageIndex;
            cond.pageSize = pageSize;
            cond.ROUTING_CODE = RoutCode;

            if (!String.IsNullOrEmpty(stationNo)) cond.STATION_NO = int.Parse(stationNo);
            if (!String.IsNullOrEmpty(stationName)) cond.STATION_NAME = stationName;
            if (!String.IsNullOrEmpty(lineCode) && lineCode != "0") cond.LINE_CODE = lineCode;


            IList<Lkj> list = ServiceAccessor.GetFoundationService().QueryLkj(cond);
            int recordCount = ServiceAccessor.GetFoundationService().QueryLkjCount(cond);

            foreach (Lkj l in list)
            {
                string url = "<a tag='edit' href=javascript:showUpdateLKJ(p" + l.ID + ")>编辑</a>&nbsp;<a href=javascript:reMove(p" + l.ID + ")>移除</a>";
                sb.AppendFormat("{{\"STATION_NAME\":\"{0}\",\"LINE_NAME\":\"{1}\",\"LINE_CODE\":\"{2}\",\"STATION_NO\":\"{3}\",\"cz\":\"{4}\",\"id\":\"p{5}\",\"LKJ_CODE\":\"{6}\",\"ROUTING_CODE\":\"{7}\"}},",
                   l.STATION_NAME, l.LINE_NAME, l.LINE_CODE, l.STATION_NO, url, l.ID, l.LKJ_CODE, l.ROUTING_CODE);
            }

            jsonStr = sb.ToString();
            if (jsonStr.LastIndexOf(',') > -1)
            {
                jsonStr = jsonStr.Substring(0, jsonStr.LastIndexOf(','));
            }
            jsonStr += String.Format("],\"page\":{0},\"rp\":{1},\"total\":{2}}}", pageIndex, pageSize, recordCount);
        }
        else
        {
            jsonStr = "{\"rows\":[],\"page\":1,\"rp\":0,\"total\":0}";
        }

        HttpContext.Current.Response.Write(jsonStr);
        
    }

    /// <summary>
    /// LKJ添加到交路关系表
    /// </summary>
    private void InsertLKJ()
    {
        string rs = "1";
        try
        {
            string STATION_NO = HttpContext.Current.Request["STATION_NO"];
            string STATION_NAME = HttpContext.Current.Request["STATION_NAME"];
            string AREA_NO = HttpContext.Current.Request["AREA_NO"];
            string LINE_NAME = HttpContext.Current.Request["LINE_NAME"];
            string LINE_CODE = HttpContext.Current.Request["LINE_CODE"];
            string ROUTING_CODE = HttpContext.Current.Request["ROUTING_CODE"];
            string ROUTEING_NO = HttpContext.Current.Request["ROUTEING_NO"];
            string BUREAU_CODE = HttpContext.Current.Request["BUREAU_CODE"];
            string BUREAU_NAME = HttpContext.Current.Request["BUREAU_NAME"];

            var linelist = from n in Api.Util.Common.lineDic.Values where n.LINE_CODE == LINE_CODE select n;
            Line line = linelist.FirstOrDefault<Line>();
            if (!String.IsNullOrEmpty(line.ID))
            {
                Lkj l = new Lkj();
                string direction_code = "3";
                if (line.DIRECTION == "上行") direction_code = "0";
                else if (line.DIRECTION == "下行") direction_code = "1";
                //局编码$交路号（2字符）$区段号（3字符）$站点号（五字符）$行别
                string LKJ_CODE = BUREAU_CODE + "$" + ROUTEING_NO.PadLeft(2, '0') + "$" + AREA_NO.PadLeft(3, '0') + "$" + STATION_NO.PadLeft(5, '0') + "$" + direction_code;
                Lkj sl = ServiceAccessor.GetFoundationService().QueryLkjByCode(LKJ_CODE);
                if (String.IsNullOrEmpty(sl.ID))
                {
                    l.LKJ_CODE = LKJ_CODE;
                    l.ROUTING_CODE = ROUTING_CODE;
                    l.ROUTING_NO = int.Parse(ROUTEING_NO);
                    if (!String.IsNullOrEmpty(AREA_NO))
                        l.AREA_NO = int.Parse(AREA_NO);
                    l.STATION_NO = int.Parse(STATION_NO);
                    l.STATION_NAME = STATION_NAME;
                    l.LINE_CODE = LINE_CODE;
                    l.LINE_NAME = LINE_NAME;
                    l.LINE_NO = Convert.ToInt32( line.LINE_NO);
                    l.DIRECTION = line.DIRECTION;
                    l.BUREAU_CODE = BUREAU_CODE;
                    l.BUREAU_NAME = BUREAU_NAME;
                    rs = ServiceAccessor.GetFoundationService().LkjAdd(l) ? "1" : "-1";
                }
                else
                {
                    rs = "-2";
                }
            }

        }
        catch (Exception)
        {
            rs = "-1";
        }
        finally
        {
            HttpContext.Current.Response.Write(rs);
            
        }
    }

    /// <summary>
    /// 更新LKJ
    /// </summary>
    private void UpdateLKJ()
    {
        bool str = false;
        try
        {
            string ID = HttpContext.Current.Request["id"].TrimStart('p');
            //string STATION_NO = HttpContext.Current.Request["STATION_NO"];
            string STATION_NAME = HttpContext.Current.Request["STATION_NAME"];
            //string AREA_NO = HttpContext.Current.Request["AREA_NO"];
            //string LINE_NAME = HttpContext.Current.Request["LINE_NAME"];
            //string LINE_CODE = HttpContext.Current.Request["LINE_CODE"];
            //string ROUTING_CODE = HttpContext.Current.Request["ROUTING_CODE"];
            //string ROUTEING_NO = HttpContext.Current.Request["ROUTEING_NO"];
            //string BUREAU_CODE = HttpContext.Current.Request["BUREAU_CODE"];
            //string BUREAU_NAME = HttpContext.Current.Request["BUREAU_NAME"];

            Lkj l = ServiceAccessor.GetFoundationService().QueryLkj(ID);
            //局编码$交路号（2字符）$区段号（3字符）$站点号（五字符）$行别
            //string LKJ_CODE = ROUTING_CODE + "$" + ROUTEING_NO.PadLeft(2, '0') + "$" + AREA_NO.PadLeft(3, '0') + "$" + STATION_NO.PadLeft(5, '0') + "$" + line.DIRECTION;
            //l.LKJ_CODE = LKJ_CODE;
            //l.ROUTING_CODE = ROUTING_CODE;
            //l.ROUTING_NO = int.Parse(ROUTEING_NO);
            //l.AREA_NO = int.Parse(AREA_NO);
            //l.STATION_NO = int.Parse(STATION_NO);
            l.STATION_NAME = STATION_NAME;
            // l.LINE_CODE = LINE_CODE;
            //l.LINE_NAME = LINE_NAME;

            //l.LINE_NO = line.LINE_NO;
            // l.DIRECTION = line.DIRECTION;
            //l.BUREAU_CODE = BUREAU_CODE;
            // l.BUREAU_NAME = BUREAU_NAME;
            str = ServiceAccessor.GetFoundationService().LkjUpdate(l);
        }
        catch (Exception)
        {
            str = false;
        }
        HttpContext.Current.Response.Write(str ? "1" : "-1");
        
    }

    /// <summary>
    /// 交路关系区站移除
    /// </summary>
    private void RemoveLKJ()
    {
        bool str = false;
        try
        {
            string id = HttpContext.Current.Request["id"].TrimStart('p');
            str = ServiceAccessor.GetFoundationService().LkjDelete(id);
        }
        catch
        {
            str = false;
        }
        finally
        {
            HttpContext.Current.Response.Write(str ? "1" : "-1");
            
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