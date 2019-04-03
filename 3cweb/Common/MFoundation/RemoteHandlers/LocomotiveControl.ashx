<%@ WebHandler Language="C#" Class="LocomotiveControl" %>

using System;
using System.Web;
using Api.Foundation.entity.Foundation;
using System.Collections.Generic;
using Api.Foundation.service;
using Api;
using Api.Util;
using Newtonsoft.Json;
using System.Text;
using Api.Foundation.entity.Cond;

public class LocomotiveControl : ReferenceClass, IHttpHandler
{
    string IsVideo = "";

    public void ProcessRequest(HttpContext context)
    {
        string type = context.Request["type"];
        IsVideo = context.Request["IsVideo"] != null ? context.Request["IsVideo"].ToString() : "";
        switch (type)
        {
            //查询所有设备
            case "all":
                GetAll();
                break;
            //添加设备
            case "add":
                Add();
                break;
            //修改设备
            case "update":
                Update();
                break;
            //删除设备
            case "delete":
                Delete();
                break;
            ///刷新缓存
            case "Reload":
                Reload();
                break;
            default:
                break;
        }
    }

    private void Reload()
    {
        Api.Util.Common.ReloadLocmotive();
        HttpContext.Current.Response.Write("ok");
    }
    /// <summary>
    /// 删除
    /// </summary>
    private void Delete()
    {
        bool str = false;
        try
        {
            string id = HttpContext.Current.Request["id"];
            str = ServiceAccessor.GetFoundationService().locomotiveDelete(id);

            if (str)
            {
                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "设备管理", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "设备管理页面删除了" + id + "的设备信息", "", true);
            }
            else
            {
                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "设备管理", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "设备管理页面删除了" + id + "的设备信息", "", false);
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
        bool str = false;
        try
        {
            string id = HttpContext.Current.Request.Form["LOCOMOTIVE_ID"];
            Locomotive locomotive = ServiceAccessor.GetFoundationService().queryLocomotive(id);
            //locomotive.LOCOMOTIVE_CODE = HttpContext.Current.Request.Form["LOCOMOTIVE_CODE"];
            if (HttpContext.Current.Request.Form["P_ORG_CODE"] != "0")
            {
                locomotive.P_ORG_CODE = HttpContext.Current.Request.Form["P_ORG_CODE"];
                locomotive.P_ORG_NAME = HttpContext.Current.Request.Form["P_ORG_NAME"];
            }
            if (HttpContext.Current.Request.Form["ORG_CODE"] != "0")
            {
                locomotive.ORG_CODE = HttpContext.Current.Request.Form["ORG_CODE"];
                locomotive.ORG_NAME = HttpContext.Current.Request.Form["ORG_NAME"];
            }
            if (HttpContext.Current.Request.Form["BUREAU_CODE"] != "0")
            {
                locomotive.BUREAU_CODE = HttpContext.Current.Request.Form["BUREAU_CODE"];
                locomotive.BUREAU_NAME = HttpContext.Current.Request.Form["BUREAU_NAME"];
            }
            if (HttpContext.Current.Request.Form["ddlDATA_RECV_DEPT"] != "0")//DATA_RECV_DEPT
                locomotive.DATA_RECV_DEPT = HttpContext.Current.Request.Form["ddlDATA_RECV_DEPT"];//DATA_RECV_DEPT
            locomotive.STATUS = HttpContext.Current.Request.Form["STATUS"];
            locomotive.MODEL = HttpContext.Current.Request.Form["MODEL"];
            locomotive.VENDOR = HttpContext.Current.Request.Form["VENDOR"];
            string CREATE_DATE = HttpContext.Current.Request.Form["CREATE_DATE"];
            if (!String.IsNullOrEmpty(CREATE_DATE))
                locomotive.CREATE_DATE = DateTime.Parse(CREATE_DATE);

            locomotive.PHONE_NUMBER = HttpContext.Current.Request.Form["PHONE_NUMBER"];
            locomotive.FIX_LINE_HEIGHT = int.Parse(HttpContext.Current.Request.Form["FIX_LINE_HEIGHT"]);
            locomotive.FIX_PULLING_VALUE = int.Parse(HttpContext.Current.Request.Form["FIX_PULLING_VALUE"]);
            locomotive.IS_FIX_GEO_PARA = HttpContext.Current.Request.Form["IS_FIX_GEO_PARA"];
            string INSTALL_DATE = HttpContext.Current.Request.Form["INSTALL_DATE"];
            if (!String.IsNullOrEmpty(INSTALL_DATE))
                locomotive.INSTALL_DATE = DateTime.Parse(INSTALL_DATE);

            locomotive.DEVICE_VERSION = HttpContext.Current.Request.Form["DEVICE_VERSION"];
            locomotive.FLAG = HttpContext.Current.Request.Form["FLAG"];
            locomotive.DEVICE_BOW_RELATIONS = HttpContext.Current.Request.Form["DEVICE_BOW_RELATIONS"];
            str = ServiceAccessor.GetFoundationService().locomotiveUpdate(locomotive);

            if (str)
            {
                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "设备管理", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "设备管理页面修改了设备信息" + HttpContext.Current.Request.Form["LOCOMOTIVE_CODE"], "", true);
            }
            else
            {
                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "设备管理", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "设备管理页面修改了设备信息" + HttpContext.Current.Request.Form["LOCOMOTIVE_CODE"], "", false);
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
    /// 增加
    /// </summary>
    private void Add()
    {
        string rs = "-1";
        try
        {
            string code = HttpContext.Current.Request.Form["LOCOMOTIVE_CODE"];

            Locomotive l = ServiceAccessor.GetFoundationService().getLocomotiveByCode(code);
            if (String.IsNullOrEmpty(l.ID))
            {
                Locomotive locomotive = new Locomotive();
                locomotive.LOCOMOTIVE_CODE = HttpContext.Current.Request.Form["LOCOMOTIVE_CODE"];
                if (HttpContext.Current.Request.Form["P_ORG_CODE"] != "0")
                {
                    locomotive.P_ORG_CODE = HttpContext.Current.Request.Form["P_ORG_CODE"];
                    locomotive.P_ORG_NAME = HttpContext.Current.Request.Form["P_ORG_NAME"];
                }
                if (HttpContext.Current.Request.Form["ORG_CODE"] != "0")
                {
                    locomotive.ORG_CODE = HttpContext.Current.Request.Form["ORG_CODE"];
                    locomotive.ORG_NAME = HttpContext.Current.Request.Form["ORG_NAME"];
                }
                if (HttpContext.Current.Request.Form["BUREAU_CODE"] != "0")
                {
                    locomotive.BUREAU_CODE = HttpContext.Current.Request.Form["BUREAU_CODE"];
                    locomotive.BUREAU_NAME = HttpContext.Current.Request.Form["BUREAU_NAME"];
                }
                if (HttpContext.Current.Request.Form["ddlDATA_RECV_DEPT"] != "0")//DATA_RECV_DEPT
                    locomotive.DATA_RECV_DEPT = HttpContext.Current.Request.Form["ddlDATA_RECV_DEPT"];//DATA_RECV_DEPT
                locomotive.STATUS = HttpContext.Current.Request.Form["STATUS"];
                locomotive.MODEL = HttpContext.Current.Request.Form["MODEL"];
                locomotive.VENDOR = HttpContext.Current.Request.Form["VENDOR"];
                string CREATE_DATE = HttpContext.Current.Request.Form["CREATE_DATE"];
                if (!String.IsNullOrEmpty(CREATE_DATE))
                    locomotive.CREATE_DATE = DateTime.Parse(CREATE_DATE);
                locomotive.PHONE_NUMBER = HttpContext.Current.Request.Form["PHONE_NUMBER"];
                string FIX_LINE_HEIGHT = HttpContext.Current.Request.Form["FIX_LINE_HEIGHT"];
                if (!String.IsNullOrEmpty(FIX_LINE_HEIGHT))
                    locomotive.FIX_LINE_HEIGHT = int.Parse(FIX_LINE_HEIGHT);
                string FIX_PULLING_VALUE = HttpContext.Current.Request.Form["FIX_PULLING_VALUE"];
                if (!String.IsNullOrEmpty(FIX_PULLING_VALUE))
                    locomotive.FIX_PULLING_VALUE = int.Parse(FIX_PULLING_VALUE);

                locomotive.IS_FIX_GEO_PARA = HttpContext.Current.Request.Form["IS_FIX_GEO_PARA"];
                string INSTALL_DATE = HttpContext.Current.Request.Form["INSTALL_DATE"];
                if (!String.IsNullOrEmpty(INSTALL_DATE))
                    locomotive.INSTALL_DATE = DateTime.Parse(INSTALL_DATE);
                locomotive.DEVICE_VERSION = HttpContext.Current.Request.Form["DEVICE_VERSION"];
                locomotive.FLAG = HttpContext.Current.Request.Form["FLAG"];
                locomotive.DEVICE_BOW_RELATIONS = HttpContext.Current.Request.Form["DEVICE_BOW_RELATIONS"];
                locomotive.IS_MODIFY_ALLOWED = "1";

                rs = ServiceAccessor.GetFoundationService().locomotiveAdd(locomotive) ? "1" : "-1";

                if (rs == "1")
                {
                    Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "设备管理", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "设备管理页面添加了新的设备信息" + HttpContext.Current.Request.Form["LOCOMOTIVE_CODE"], "", true);
                }
                else
                {
                    Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "设备管理", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "设备管理页面添加了新的设备信息" + HttpContext.Current.Request.Form["LOCOMOTIVE_CODE"], "", false);
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
    /// 获取所有用户
    /// </summary>
    private void GetAll()
    {
        //获取前台页码
        int pageIndex = Convert.ToInt32(HttpContext.Current.Request["page"]);
        //获取前台条数
        int pageSize = Convert.ToInt32(HttpContext.Current.Request["rp"]);

        LocomotiveCond cond = new LocomotiveCond();
        cond.pageNum = pageIndex;
        cond.pageSize = pageSize;
        if (HttpContext.Current.Request["LOCOMOTIVE_CODE"] != null && HttpContext.Current.Request["LOCOMOTIVE_CODE"] != "undefined" && HttpContext.Current.Request["LOCOMOTIVE_CODE"] != "" && HttpContext.Current.Request["LOCOMOTIVE_CODE"] != "0")
        {
            cond.LOCOMOTIVE_CODE = HttpContext.Current.Request["LOCOMOTIVE_CODE"];
        }

        if (HttpContext.Current.Request["ORG_CODE"] != null && HttpContext.Current.Request["ORG_CODE"] != "undefined" && HttpContext.Current.Request["ORG_CODE"] != "" && HttpContext.Current.Request["ORG_CODE"] != "0")
        {
            cond.P_ORG_CODE = HttpContext.Current.Request["ORG_CODE"];
        }

        if (HttpContext.Current.Request["BUREAU_CODE"] != null && HttpContext.Current.Request["BUREAU_CODE"] != "undefined" && HttpContext.Current.Request["BUREAU_CODE"] != "" && HttpContext.Current.Request["BUREAU_CODE"] != "0")
        {
            cond.BUREAU_CODE = HttpContext.Current.Request["BUREAU_CODE"];
        }

        if (HttpContext.Current.Request["CODE"] != null && HttpContext.Current.Request["CODE"] != "undefined" && HttpContext.Current.Request["CODE"] != "")
        {
            if (HttpContext.Current.Request["TREETYPE"] == "LOCOMOTIVE")
                cond.LOCOMOTIVE_CODE = HttpContext.Current.Request["CODE"];
            else if (HttpContext.Current.Request["TREETYPE"] == "ORG")
            {
                cond.ORG_CODE = HttpContext.Current.Request["CODE"];
            }
            else if (HttpContext.Current.Request["TREETYPE"] == "BUREAU")
                cond.BUREAU_CODE = HttpContext.Current.Request["CODE"];
        }

        //string org_code;
        //Api.Util.Public.org



        //增加对设备版本的判断，用于视频直播时筛选设备列表
        if (HttpContext.Current.Request["LOCO_VERSION"] != null && HttpContext.Current.Request["LOCO_VERSION"] != "undefined" && HttpContext.Current.Request["LOCO_VERSION"] != "" && HttpContext.Current.Request["LOCO_VERSION"] != "0")
        {
            cond.DEVICE_VERSION = HttpContext.Current.Request["LOCO_VERSION"];
        }
        IList<Locomotive> list = ServiceAccessor.GetFoundationService().queryLocomotive(cond);

        //获取总条数
        int recordCount = ServiceAccessor.GetFoundationService().getLocomotiveCount(cond);



        StringBuilder sb = new StringBuilder();
        sb.Append("{\"rows\":[");


        foreach (Locomotive l in list)
        {
            string locaTypeName = "";
            string locaTypeDIC_CODE = "";
            SysDictionary sysDic = Api.Util.Common.getSysDictionaryInfo(l.DEVICE_VERSION);
            if (sysDic != null)
            {
                locaTypeName = sysDic.CODE_NAME;
                locaTypeDIC_CODE = sysDic.DIC_CODE;
            }
            string url = "";
            if (l.IS_MODIFY_ALLOWED == "1")
            {
                if (PublicMethod.buttonControl("LocomotiveList.htm", "UPDATE"))
                {
                    url += "<a  href=javascript:updateLocomotiveModal(" + l.ID + ")>修改</a>&nbsp;";
                }
                if (PublicMethod.buttonControl("LocomotiveList.htm", "DELETE"))
                {
                    url += "<a href=javascript:deleteLocomotive(" + l.ID + ")>删除</a>";
                }
            }
            sb.AppendFormat("{{\"LOCOMOTIVE_CODE\":\"{0}\",\"MODEL\":\"{1}\",\"DEVICE_VERSION_CODE\":\"{2}\",\"DEVICE_VERSION\":\"{3}\",\"STATUS\":\"{4}\",",
                            l.LOCOMOTIVE_CODE, l.MODEL, locaTypeDIC_CODE, locaTypeName, l.STATUS);
            sb.AppendFormat("\"VENDOR\":\"{0}\",\"CREATE_DATE\":\"{1}\",\"INSTALL_DATE\":\"{2}\",\"PHONE_NUMBER\":\"{3}\",\"BUREAU_CODE\":\"{4}\",\"BUREAU_NAME\":\"{5}\",",
                           l.VENDOR, l.CREATE_DATE.ToString("yyyy-MM-dd"), l.INSTALL_DATE.ToString("yyyy-MM-dd"), l.PHONE_NUMBER, l.BUREAU_CODE, l.BUREAU_NAME);
            sb.AppendFormat("\"ORG_CODE\":\"{0}\",\"ORG_NAME\":\"{1}\",\"P_ORG_CODE\":\"{2}\",\"P_ORG_NAME\":\"{3}\",\"IS_FIX_GEO_PARA\":\"{4}\",",
                            l.ORG_CODE, l.ORG_NAME, l.P_ORG_CODE, l.P_ORG_NAME, (l.IS_FIX_GEO_PARA == "0" ? "否" : "是"));
            sb.AppendFormat("\"FIX_LINE_HEIGHT\":\"{0}\",\"FIX_PULLING_VALUE\":\"{1}\",\"DATA_RECV_DEPT\":\"{2}\",\"FLAG\":\"{3}\",\"cz\":\"{4}\",\"id\":\"{5}\",\"DEVICE_BOW_RELATIONS\":\"{6}\"}},",
                l.FIX_LINE_HEIGHT, l.FIX_PULLING_VALUE, (Api.Util.Common.organizationDic.ContainsKey(l.DATA_RECV_DEPT == null ? "" : l.DATA_RECV_DEPT) ? Api.Util.Common.organizationDic[l.DATA_RECV_DEPT].ORG_NAME : l.DATA_RECV_DEPT), l.FLAG == "0" ? "否" : "是", url, l.ID, l.DEVICE_BOW_RELATIONS);
        }
        string js = sb.ToString();
        if (js.LastIndexOf(',') > -1)
        {
            js = js.Substring(0, js.LastIndexOf(','));
        }
        js += String.Format("],\"page\":{0},\"rp\":{1},\"total\":{2}}}", pageIndex, pageSize, recordCount);

        HttpContext.Current.Response.Write(js);

    }


    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}