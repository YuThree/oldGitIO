<%@ WebHandler Language="C#" Class="DriverControl" %>

using System;
using System.Web;
using Api.Foundation.entity.Foundation;
using System.Collections.Generic;
using Api.Foundation.service;
using Api;
using Api.Foundation.entity.Cond;

public class DriverControl : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        string type = context.Request["type"];
        switch (type)
        {
            //查询所有司机
            case "all":
                GetAll();
                break;
            //添加线路
            case "add":
                Add();
                break;
            //修改线路
            case "update":
                Update();
                break;
            //删除线路
            case "delete":
                Delete();
                break;
            //获取下拉列表
            case "select":
                GetSelect();
                break;
            case "deptSelect":
                GetDeptSelect();
                break;
            default:
                break;
        }
    }
    private void GetAll()
    {
        //获取前台页码
        int pageIndex = Convert.ToInt32(HttpContext.Current.Request["page"]);
        //获取前台条数
        int pageSize = Convert.ToInt32(HttpContext.Current.Request["rp"]);
        //条件
        Api.Foundation.entity.Cond.DriverCond cond = new Api.Foundation.entity.Cond.DriverCond();

        cond.pageNum = pageIndex;
        cond.pageSize = pageSize;
        if (HttpContext.Current.Request["CODE"] != null && HttpContext.Current.Request["CODE"] != "")
        {
            cond.CODE = HttpContext.Current.Request["CODE"];
        }
        if (HttpContext.Current.Request["NAME"] != null && HttpContext.Current.Request["NAME"] != "")
        {
            cond.NAME = HttpContext.Current.Request["NAME"];
        }
        if (HttpContext.Current.Request["DEPT_CODE"] != null && HttpContext.Current.Request["DEPT_CODE"] != "" && HttpContext.Current.Request["DEPT_CODE"] != "0")
        {
            cond.DEPT_CODE = HttpContext.Current.Request["DEPT_CODE"];
        }

        IList<Driver> list = ServiceAccessor.GetFoundationService().queryDriverBy(cond);

        //获取总条数
        int recordCount = ServiceAccessor.GetFoundationService().getDriverCount(cond);
        string jsonStr = "";
        if (list != null)
        {
            jsonStr = "{'rows':[";
            for (int i = 0; i < list.Count; i++)
            {
                string url = "<a  href=javascript:updateDriverModal(driver" + list[i].ID + ")>修改</a>&nbsp;<a href=javascript:deleteDriver(driver" + list[i].ID + ")>删除</a>";
                jsonStr += "{'CODE':'" + list[i].CODE + "','NAME':'" + list[i].NAME + "','DEPT_CODE':'" + list[i].DEPT_CODE + "','DEPT_NAME':'" + list[i].DEPT_NAME + "','cz':'" + url + "','id':'driver" + list[i].ID + "'},";
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
    private void Add()
    {
        bool str = false;
        try
        {
            DriverCond driver = new DriverCond();
            driver.CODE = HttpContext.Current.Request["CODE"];
            int count = ServiceAccessor.GetFoundationService().getDriverCount(driver);
            if (count == 0)
            {
                driver.NAME = HttpContext.Current.Request["NAME"];
                driver.DEPT_CODE = HttpContext.Current.Request["DEPT_CODE"];
                driver.DEPT_NAME = HttpContext.Current.Request["DEPT_NAME"];
                str = ServiceAccessor.GetFoundationService().addDriver(driver);
            }
        }
        catch (Exception ex)
        {
            str = false;
        }
        finally
        {
            HttpContext.Current.Response.Write(true);
            
            
        }
    }
    private void Update()
    {
        bool str = false;
        try
        {
            Driver driver = new Driver();
            driver.ID = HttpContext.Current.Request["ID"];
            driver.CODE = HttpContext.Current.Request["CODE"];
            driver.NAME = HttpContext.Current.Request["NAME"];
            driver.DEPT_CODE = HttpContext.Current.Request["DEPT_CODE"];
            driver.DEPT_NAME = HttpContext.Current.Request["DEPT_NAME"];
            str = ServiceAccessor.GetFoundationService().updateDriver(driver);
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
    private void Delete()
    {
        bool str = false;
        try
        {
            string id = HttpContext.Current.Request["ID"];
            str = ServiceAccessor.GetFoundationService().deleteDriver(id);
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
    private void GetSelect()
    {
        string selectList = "<select id='ddlDept' style='width: 135px;'>";
        selectList += "<option value=''></option>";
        OrganizationCond orgCond = new OrganizationCond();
        IList<Organization> orgList = ServiceAccessor.GetFoundationService().queryOrganization(orgCond);
        foreach (Organization org in orgList)
        {
            selectList += "<option value='" + org.ORG_CODE + "'>" + org.ORG_NAME + "</option>";
        }
        selectList += "</select>";
        HttpContext.Current.Response.Write(selectList);
        
        
    }
    private void GetDeptSelect()
    {
        string selectList = "<select id='ddlDepts' style='width: 135px;'>";
        selectList += "<option value='0'>--全部--</option>";
        OrganizationCond orgCond = new OrganizationCond();
        IList<Organization> orgList = ServiceAccessor.GetFoundationService().queryOrganization(orgCond);
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