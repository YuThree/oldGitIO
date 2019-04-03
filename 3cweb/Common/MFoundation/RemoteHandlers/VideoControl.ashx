<%@ WebHandler Language="C#" Class="VideoControl" %>

using System;
using System.Web;
using Api.Foundation.entity.Foundation;
using System.Collections.Generic;
using Api.Foundation.service;
using Api;
using Newtonsoft.Json;
using System.Text;
using Api.Foundation.entity.Cond;

public class VideoControl : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        string type = context.Request["type"];
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
            //获取下拉列表
            case "select":
                GetSelect();
                break;      
        }
    }
    
    /// <summary>
    /// 删除
    /// </summary>
    private void Delete()
    {
        bool str = false; try
        {
            string code = HttpContext.Current.Request["Code"];
            str = ServiceAccessor.GetFoundationService().locomotiveDelete(code);
        }
        catch (Exception ex)
        {
            str = false;
        }
        finally
        {
            HttpContext.Current.Response.Write(str);
            
            
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
            Locomotive locomotive = new Locomotive();
            locomotive.LOCOMOTIVE_CODE = HttpContext.Current.Request["LOCOMOTIVE_CODE"];
            locomotive.MODEL = HttpContext.Current.Request["MODEL"];
            locomotive.STATUS = HttpContext.Current.Request["STATUS"];
            locomotive.VENDOR = HttpContext.Current.Request["VENDOR"];
           // locomotive.RELEASE_DATE = Convert.ToDateTime(HttpContext.Current.Request["RELEASE_DATE"]);
           // locomotive.FIX_LINE_HEIGHT = HttpContext.Current.Request["FIX_LINE_HEIGHT"];
          //loc/motive.BUREAU_CODE = HttpContext.Current.Request["BUREAU_CODE"];
            locomotive.ORG_CODE = HttpContext.Current.Request["ORG_CODE"];
           // locomotive.USE_DEPT_CODE = HttpContext.Current.Request["USE_DEPT_CODE"];
           // locomotive.ISFIX = HttpContext.Current.Request["ISFIX"];
          //  locomotive.FIX_LINE_HEIGHT = "3700";
            locomotive.DEVICE_VERSION = HttpContext.Current.Request["Version"];
            str = ServiceAccessor.GetFoundationService().locomotiveUpdate(locomotive);
        }
        catch (Exception ex)
        {
            str = false;
        }
        finally
        {
            HttpContext.Current.Response.Write(str);
            
            
        }
    }
    /// <summary>
    /// 增加
    /// </summary>
    private void Add()
    {
        bool str = false;
        try
        {
            Locomotive locomotive = new Locomotive();
            locomotive.LOCOMOTIVE_CODE = HttpContext.Current.Request["LOCOMOTIVE_CODE"];
            locomotive.MODEL = HttpContext.Current.Request["MODEL"];
            locomotive.STATUS = HttpContext.Current.Request["STATUS"];
            locomotive.VENDOR = HttpContext.Current.Request["VENDOR"];
            //locomotive.RELEASE_DATE = DateTime.Now;//Convert.ToDateTime(HttpContext.Current.Request["RELEASE_DATE"]);
           // locomotive.FIX_LINE_HEIGHT = HttpContext.Current.Request["FIX_LINE_HEIGHT"];
            locomotive.BUREAU_CODE = HttpContext.Current.Request["BUREAU_CODE"];
            locomotive.ORG_CODE = HttpContext.Current.Request["ORG_CODE"];
           // locomotive.USE_DEPT_CODE = HttpContext.Current.Request["USE_DEPT_CODE"];
           // locomotive.ISFIX = HttpContext.Current.Request["ISFIX"];
          //  locomotive.FIX_LINE_HEIGHT = "3700";
            locomotive.DEVICE_VERSION = HttpContext.Current.Request["Version"];

            str = ServiceAccessor.GetFoundationService().locomotiveAdd(locomotive);
        }
        catch (Exception ex)
        {
            str = false;
        }
        finally
        {
            HttpContext.Current.Response.Write(str);
            
            
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


        VideoDeviceInfoCond cond = new VideoDeviceInfoCond();
        cond.pageNum = pageIndex;
        cond.pageSize = pageSize;
        if (HttpContext.Current.Request["LOCOMOTIVE_CODE"] != null && HttpContext.Current.Request["LOCOMOTIVE_CODE"] != "undefined" && HttpContext.Current.Request["LOCOMOTIVE_CODE"] != "" && HttpContext.Current.Request["LOCOMOTIVE_CODE"] != "0")
        {
            cond.LOCOMOTIVE_CODE = HttpContext.Current.Request["LOCOMOTIVE_CODE"];
        }





        IList<VideoDeviceInfo> list = ServiceAccessor.GetFoundationService().queryVideoDevices(cond);

        //获取总条数
        int recordCount = ServiceAccessor.GetFoundationService().VideoDeivceGetCount(cond);
        string jsonStr = "";
        if (list != null)
        {
            jsonStr = "{'rows':[";
            for (int i = 0; i < list.Count; i++)
            {               
                
                string url = "";

                //if (PublicMethod.buttonControl("LocomotiveList.htm", "UPDATE"))
                //{
                //    url += "<a  href=javascript:updateLocomotiveModal(loc" + list[i].ID + ")>修改</a>&nbsp;";
                //}
                //if (PublicMethod.buttonControl("LocomotiveList.htm", "DELETE"))
                //{
                //    url += "<a href=javascript:deleteLocomotive(loc" + list[i].ID + ")>删除</a>";
                //}

                url += "<a  href=javascript:updateLocomotiveModal(loc" + list[i].ID + ")>修改</a>&nbsp;";
                url += "<a href=javascript:deleteLocomotive(loc" + list[i].ID + ")>删除</a>";


                jsonStr += "{'LOCOMOTIVE_CODE':'" + list[i].LOCOMOTIVE_CODE 
                    + "','TERMINAL_SEQUENCE':'" + list[i].TERMINAL_SEQUENCE 
                    + "','VIDEO_VENDOR':'" + list[i].VIDEO_VENDOR 
                    + "','IP_ADDR':'" + list[i].IP_ADDR 
                    + "','PORT':'" + list[i].PORT 
                    + "','USER_NAME':'" + list[i].USER_NAME 
                    + "','PASSWORD':'" + list[i].PASSWORD 
                    + "','CHANNEL_NO':'" + list[i].CHANNEL_NO 
                    + "','STREAM_TYPE':'" + list[i].STREAM_TYPE 
                    + "','DEFAULT_WINDOW_NO':'" + list[i].DEFAULT_WINDOW_NO
                    + "','ID':'" + list[i].ID 
                    + "'},";
            }
            if (jsonStr.LastIndexOf(',') > 0)
            {
                jsonStr = jsonStr.Substring(0, jsonStr.LastIndexOf(',')) + "],'page':" + pageIndex + ",'rp':" + pageSize + ",'total':" + recordCount + "}";
            }
            else
            {
                jsonStr += "],'page':'1','rp':'20','total':'" + list.Count + "'}";

            }

            jsonStr = jsonStr.Replace("'", "\"");
        }
        HttpContext.Current.Response.Write(jsonStr);
        
        
    }
    /// <summary>
    /// 获取下拉列表
    /// </summary>
    private void GetSelect()
    {
        string selectList;
        selectList = "<select id='ddlBUREAU' style='width: 135px;'>";
        OrganizationCond orgCond = new OrganizationCond();
        orgCond.ORG_TYPE = "局";
        IList<Organization> orgList = ServiceAccessor.GetFoundationService().queryOrganization(orgCond);
        foreach (Organization org in orgList)
        {
            selectList += "<option value='" + org.ORG_CODE + "'>" + org.ORG_NAME + "</option>";
        }
        selectList += "</select>";
        orgCond = new OrganizationCond();
        orgCond.businssAnd = " ORG_TYPE like '%段%' ";
        //orgCond.ORG_TYPE = "机务段";
        orgList = ServiceAccessor.GetFoundationService().queryOrganization(orgCond);
        selectList += "$<select id='ddlDept' style='width: 135px;'>";
        foreach (Organization org in orgList)
        {
            selectList += "<option value='" + org.ORG_CODE + "'>" + org.ORG_NAME + "</option>";
        }
        selectList += "</select>";
        selectList += "$<select id='ddlUSE_DEPT' style='width: 135px;'>";
        foreach (Organization org in orgList)
        {
            selectList += "<option value='" + org.ORG_CODE + "'>" + org.ORG_NAME + "</option>";
        }
        selectList += "</select>";
        orgCond = new OrganizationCond();
        orgCond.ORG_TYPE = "局";
        orgList = ServiceAccessor.GetFoundationService().queryOrganization(orgCond);
        selectList += "$<select id='ddlBureau' style='width: 135px;' onchange='bureauChange(this.value)'>";
        selectList += "<option value='0'>--全部--</option>";
        foreach (Organization org in orgList)
        {
            selectList += "<option value='" + org.ORG_CODE + "'>" + org.ORG_NAME + "</option>";
        }
        selectList += "</select>";
        HttpContext.Current.Response.Write(selectList);
        
        
    }

   
    
    
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}