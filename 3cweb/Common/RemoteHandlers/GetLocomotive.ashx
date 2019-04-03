<%@ WebHandler Language="C#" Class="GetLocomotive" %>

using System;
using System.Web;
using Api.Event.entity;
using System.Collections.Generic;
using System.Text;
using Api.SysManagement.Security.entity.Cond;
using Api.SysManagement.Security.entity;
using Api.Foundation.entity.Foundation;
using Api.Foundation.entity.Cond;
using System.Linq;

public class GetLocomotive : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        string type = context.Request["type"];
        switch (type)
        {
            case "IsAbnormity":
                GetCurerntLoco(context);
                break;
            default:
                GetModel(context);
                break;
        }
    }


    private void GetModel(HttpContext context)
    {
        string loca = context.Request["loca"];
        Locomotive loc = Api.Util.Common.getLocomotiveInfo(loca);

        Dictionary<String, FunCustom> FunCustomDic = Api.Util.Common.FunCustomDic;
        StringBuilder json = new StringBuilder();

        json.Append("{");
        json.Append("\"LOCOMOTIVE_CODE\":\"" + loc.LOCOMOTIVE_CODE + "\"");
        json.Append(",");
        json.Append("\"RELATIONS\":\"" + loc.DEVICE_BOW_RELATIONS + "\"");
        json.Append("},");
        json = json.Remove(json.ToString().LastIndexOf(','), 1);
        object Json = Newtonsoft.Json.JsonConvert.DeserializeObject(json.ToString());
        HttpContext.Current.Response.Write(Json.ToString());
    }

    private void GetCurerntLoco(HttpContext context)
    {
        string action = context.Request["action"];
        switch (action)
        {
            case "query":
                QueryLoco(context);
                break;
            case "add":
                AddLoco(context);
                break;
            case "delete":
                DeleteLoco(context);
                break;
        }
    }

    /// <summary>
    /// 查询所有正常和异常的车辆
    /// </summary>
    /// <param name="context"></param>
    private void QueryLoco(HttpContext context)
    {
        LocomotiveCond cond = new LocomotiveCond();
        IList<Locomotive> lis = new List<Locomotive>();
        try
        {
            lis = Api.ServiceAccessor.GetFoundationService().queryLocomotive(cond);
        }
        catch (Exception ex)
        {

        }

        List<Locomotive> normal_lis = new List<Locomotive>();
        List<Locomotive> abnormal_lis = new List<Locomotive>();

        normal_lis = lis.Where(m => string.IsNullOrEmpty(m.IS_ABNORMAL)).Select
                (m =>
                {
                    var x = new Locomotive();
                    x.ID = m.ID;
                    x.LOCOMOTIVE_CODE = m.LOCOMOTIVE_CODE;
                    x.IS_ABNORMAL = m.IS_ABNORMAL;
                    return x;
                }).ToList();

        abnormal_lis = lis.Where(m => !string.IsNullOrEmpty(m.IS_ABNORMAL)).Select
                (m =>
                {
                    var x = new Locomotive();
                    x.ID = m.ID;
                    x.LOCOMOTIVE_CODE = m.LOCOMOTIVE_CODE;
                    x.IS_ABNORMAL = m.IS_ABNORMAL;
                    return x;
                }).ToList();



        StringBuilder json = new StringBuilder();
        json.Append("{\"NORMAL_COUNT\":\"" + normal_lis.Count() + "\",");
        json.Append("\"NORMALS\":[");
        if (normal_lis.Count > 0)
        {
            foreach (Locomotive normal in normal_lis)
            {
                if (!string.IsNullOrEmpty(normal.LOCOMOTIVE_CODE))
                {
                    json.Append("{");
                    json.Append("\"CODE\":\"" + normal.LOCOMOTIVE_CODE + "\"");//车号
                    json.Append("},");
                }
            }
            json.Remove(json.Length - 1, 1);
        }
        json.Append("],");
        json.Append("\"ABNORMAL_COUNT\":\"" + abnormal_lis.Count() + "\",");
        json.Append("\"ABNORMALS\":[");
        if (abnormal_lis.Count > 0)
        {
            foreach (Locomotive abnormal in abnormal_lis)
            {
                if (!string.IsNullOrEmpty(abnormal.LOCOMOTIVE_CODE))
                {
                    json.Append("{");
                    json.Append("\"CODE\":\"" + abnormal.LOCOMOTIVE_CODE + "\"");//车号
                    json.Append("},");
                }
            }
            json.Remove(json.Length - 1, 1);
        }
        json.Append("]}");


        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }

    /// <summary>
    /// 添加异常车辆
    /// </summary>
    /// <param name="context"></param>
    private void AddLoco(HttpContext context)
    {
        int re = -1;
        string loco = context.Request["loco"];
        Locomotive locomotive = Api.ServiceAccessor.GetFoundationService().getLocomotiveByCode(loco);
        if (locomotive.IS_ABNORMAL == "1")
        {
            re = 1;
        }
        else
        {
            try
            {
                locomotive.IS_ABNORMAL = "1";
                Api.ServiceAccessor.GetFoundationService().locomotiveUpdate(locomotive);
                re = 0;
            }
            catch (Exception ex)
            {

            }
        }
        string json = "{\"result\":\"" + re + "\"}";
        HttpContext.Current.Response.ContentType = "application/json";
        HttpContext.Current.Response.Write(json);
    }

    /// <summary>
    /// 取消异常车辆
    /// </summary>
    /// <param name="context"></param>
    private void DeleteLoco(HttpContext context)
    {
        bool re = false;
        string loco = context.Request["loco"];
        Locomotive locomotive = Api.ServiceAccessor.GetFoundationService().getLocomotiveByCode(loco);
        locomotive.IS_ABNORMAL = "";
        try
        {
            re = Api.ServiceAccessor.GetFoundationService().locomotiveUpdate(locomotive);
        }
        catch (Exception ex)
        {

        }
        string json = "{\"result\":\"" + re + "\"}";
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