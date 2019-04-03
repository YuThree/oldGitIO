<%@ WebHandler Language="C#" Class="DataPermissonControl" %>

using System;
using System.Web;
using Api;
using Api.Util;
using System.Collections.Generic;
using Api.SysManagement.Security.entity;
using System.Text;
using Api.Foundation.entity.Cond;
using Api.Foundation.entity.Foundation;

public class DataPermissonControl : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        string type = context.Request["type"];
        switch (type)
        {
            //查询所有数据权限
            case "all":
                GetAll();
                break;
            //添加数据权限
            case "add":
                Add();
                break;
            //修改数据权限
            case "update":
                Update();
                break;
            //删除数据权限
            case "delete":
                Delete();
                break;

            //获取登录用户名称
            case "curuser":
                GetCurUser();
                break;
            case "logout":
                ServiceAccessor.GetLogService().securityLog(Api.Util.Public.GetLoginID, Api.Util.Public.GetLoginIP, "用户退出", true);
                ClearCache();
                break;
            default:
                break;
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
        //条件
        Api.SysManagement.Security.entity.Cond.SecurityCond cond = new Api.SysManagement.Security.entity.Cond.SecurityCond();

        cond.pageNum = pageIndex;
        cond.pageSize = pageSize;

        IList<DataPermisson> list = ServiceAccessor.GetSecurityService().queryDataPermission(cond); ;

        //获取总条数
        int recordCount = ServiceAccessor.GetSecurityService().queryDataPermissionCount(cond);


        StringBuilder strBuilder = new StringBuilder();
        strBuilder.Append("{\"rows\":[");
        string js = "";
        if (list != null)
        {

            for (int i = 0; i < list.Count; i++)
            {
                string masterName = "";  //授权对象名称 人或者组织
                if (list[i].ROLE_TYPE == "USER")
                {
                    User user = ServiceAccessor.GetFoundationService().queryUserByCode(list[i].MASTERID);
                    if (user != null)
                        masterName = user.PER_NAME;
                }
                else
                {
                    Organization org = ServiceAccessor.GetFoundationService().queryOrganizationByCode(list[i].MASTERID);
                    if (org != null)
                        masterName = org.ORG_NAME;

                }
                string url = "<a  href=javascript:updatePermissonModal(data" + list[i].ID + ")>修改</a>&nbsp;<a href=javascript:deletePermisson(data" + list[i].ID + ")>删除</a>";
                strBuilder.AppendFormat("{{\"CODE\":\"{0}\",\"MASTERID\":\"{1}\",\"MASTER_NAME\":\"{2}\", \"ROLE_TYPE\":\"{3}\",\"ORG_NAME\":\"{4}\", \"ORG_CODE\":\"{5}\",\"EXTCUSTOM\":\"{6}\",\"cz\":\"{7}\",\"id\":\"{8}\"}},",
                           list[i].ID, list[i].MASTERID, masterName, list[i].ROLE_TYPE, list[i].ORG_NAME, list[i].ORG_CODE, "", url, "data" + list[i].ID);

            }
            js = strBuilder.ToString();
            if (js.LastIndexOf(',') > -1)
            {
                js = js.Substring(0, js.LastIndexOf(','));
            }
            js += String.Format("],\"page\":{0},\"rp\":{1},\"total\":{2}}}", pageIndex, pageSize, recordCount);

        }
        HttpContext.Current.Response.Write(js);

    }

    private static string GetOrgCode(string OrgName, string Name)
    {
        if (!string.IsNullOrEmpty(OrgName))
        {
            string[] OrgNames = OrgName.Split(',');
            for (int i = 0; i < OrgNames.Length; i++)
            {
                if (OrgNames[i] != "")
                {
                    Organization org = Api.Util.Common.getOrgInfo(OrgNames[i]);
                    if (org != null)
                        if (!string.IsNullOrEmpty(Name))
                        {
                            Name = Name + "," + org.ORG_NAME;
                        }
                        else
                        {
                            Name = org.ORG_NAME;
                        }
                }
            }


        }
        return Name;
    }


    /// <summary>
    /// 添加数据权限
    /// </summary>
    private void Add()
    {
        bool str = false;
        try
        {
            DataPermisson permisson = new DataPermisson();
            permisson.ID = Guid.NewGuid().ToString().Replace("-", "");

            permisson.MASTERID = HttpContext.Current.Request["MASTERID"];
            permisson.ROLE_TYPE = HttpContext.Current.Request["ROLETYPE"];

            permisson = NewOrgPerMisson(permisson);
            Api.SysManagement.Security.entity.Cond.SecurityCond cond = new Api.SysManagement.Security.entity.Cond.SecurityCond();

            cond.MASTERID = permisson.MASTERID;
            cond.ROLE_TYPE = permisson.ROLE_TYPE;
            IList<DataPermisson> list = ServiceAccessor.GetSecurityService().queryDataPermission(cond);
            if (list.Count > 0)
            {
                permisson = list[0];
                string OrgName = HttpContext.Current.Request["SENDDEPTNAMES"];
                string OrgCode = HttpContext.Current.Request["SENDDEPT"];
                if (!(permisson.ORG_NAME + ",").Contains(OrgName + ","))
                {
                    permisson.ORG_NAME = permisson.ORG_NAME + "," + OrgName;
                    permisson.ORG_CODE = permisson.ORG_CODE + "," + OrgCode;
                }
                str = ServiceAccessor.GetSecurityService().updatePermisson(permisson);
            }
            else
            {
                str = ServiceAccessor.GetSecurityService().addPermisson(permisson);
            }

            if (str)
            {
                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "数据权限", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "添加了新的数据权限" + HttpContext.Current.Request["MASTERID"], "", true);
            }
            else
            {
                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "数据权限", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "添加了新的数据权限" + HttpContext.Current.Request["MASTERID"], "", false);
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

    private static DataPermisson NewOrgPerMisson(DataPermisson permisson)
    {
        string OrgName = HttpContext.Current.Request["SENDDEPTNAMES"];
        string OrgCode = HttpContext.Current.Request["SENDDEPT"];

        permisson.ORG_NAME = OrgName;
        permisson.ORG_CODE = OrgCode;
        return permisson;
    }

    /// <summary>
    /// 修改数据权限
    /// </summary>
    private void Update()
    {
        bool str = false;
        try
        {
            DataPermisson permisson = new DataPermisson();
            permisson.ID = HttpContext.Current.Request["CODE"];
            permisson.MASTERID = HttpContext.Current.Request["MASTERID"];
            permisson.ROLE_TYPE = HttpContext.Current.Request["ROLETYPE"];

            permisson = NewOrgPerMisson(permisson);

            str = ServiceAccessor.GetSecurityService().updatePermisson(permisson);

            if (str)
            {
                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "数据权限", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "修改了数据权限" + HttpContext.Current.Request["MASTERID"], "", true);
            }
            else
            {
                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "数据权限", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "修改了数据权限" + HttpContext.Current.Request["MASTERID"], "", false);
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
    /// <summary>
    /// 删除数据权限
    /// </summary>
    private void Delete()
    {
        bool str = false;
        try
        {
            string id = HttpContext.Current.Request["ID"];
            str = ServiceAccessor.GetSecurityService().deletePermisson(id);

            if (str)
            {
                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "数据权限", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "删除了数据权限" + id, "", true);
            }
            else
            {
                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "数据权限", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "删除了数据权限" + id, "", false);
            }
            
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

    //获取当前用户
    private void GetCurUser()
    {
        string user = Api.Util.Public.GetPersonName;
     //   string userRole = Api.Util.Public.GetUserRoleId;
        string json = "{\"name\":\"" + user + "\", \"role\":\"" + "" + "\", \"code\":\"" + Api.Util.Public.GetUserCode + "\"}";
        HttpContext.Current.Response.Write(json);

    }
    //清除cookie缓存
    private void ClearCache()
    {
        HttpCookie aCookie = new HttpCookie("Bsfmis.UserVariableCookie");
        aCookie.Expires = DateTime.Now.AddDays(-1);
        HttpContext.Current.Response.Cookies.Add(aCookie);

    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}