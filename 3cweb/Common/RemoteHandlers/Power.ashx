<%@ WebHandler Language="C#" Class="Power" %>

using System;
using System.Web;
using System.Xml;
using Api.Fault.entity.alarm;
using System.Collections.Generic;
using System.Data;
using Api;
using Api.SysManagement.Security.service;
using Api.SysManagement.Log.service;
using Api.SysManagement.Security.entity;
using System.Text;

public class Power : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {

        string type = context.Request["type"];
        string LoginName = Api.Util.Public.GetLoginID;//context.Request["LoginName"];
        string url = context.Request["url"];
        switch (type)
        {
            //查询所有设备
            case "url": GetAllUrl(context, LoginName);
                break;
            case "button": GetButton(url, context, LoginName);
                break;
            case "IsAllowVisited":
                IsAllowVisited(context);
                break;

        }



    }

    private void IsAllowVisited(HttpContext context)
    {
        string url = context.Request["url"];
        int IsPass = 0;

        Api.SysManagement.Security.entity.FunPermisson mypage_permisson = new Api.SysManagement.Security.entity.FunPermisson();

        StringBuilder BJson = new StringBuilder();
        string usercode = Api.Util.Public.GetUserCode;

        switch (usercode)
        {
            case null:
                //未登录用户
                IsPass = -1;
                mypage_permisson.NEW = 0;
                mypage_permisson.QUERY = 0;
                mypage_permisson.DEL = 0;
                mypage_permisson.MOD = 0;
                break;
            case "admin":
                //超级管理员，不做判断。
                IsPass = 1;

                mypage_permisson.NEW = 1;
                mypage_permisson.QUERY = 1;
                mypage_permisson.DEL = 1;
                mypage_permisson.MOD = 1;
                break;
            default:
                #region 普通用户
                List<Api.SysManagement.Security.entity.FunMenu> list_menu = Api.Util.Common.FunMenuCache;

                //是否需要做用户权认证。
                bool isCheckUserPermission = false;
                if (list_menu.Count > 0)
                {
                    foreach (Api.SysManagement.Security.entity.FunMenu m_menu in list_menu)
                    {
                        if (!string.IsNullOrEmpty(m_menu.URL) && m_menu.URL != "#" && url.Contains(m_menu.URL))
                        {
                            //当前页面地址，在菜单管理中存在。
                            isCheckUserPermission = true;
                            break;
                        }
                    }
                }


                if (isCheckUserPermission)
                {

                    if (string.IsNullOrEmpty(usercode))
                    {
                        //没有登陆。
                        // IsPass = false;
                    }
                    else
                    {
                        //登陆了，查询用户权限表。
                        IList<Api.SysManagement.Security.entity.FunPermisson> permissonList = Api.Util.UserPermissionc.GetCurrentFunPermisson();

                        foreach (Api.SysManagement.Security.entity.FunPermisson m_permisson in permissonList)
                        {
                            if (!string.IsNullOrEmpty(m_permisson.URL) && m_permisson.URL != "#" && url.Contains(m_permisson.URL))
                            {
                                ButtonAuthority buttonAuthority = new ButtonAuthority();
                                buttonAuthority.BUT_AUTH_TYPE_VCODE = m_permisson.MASTERID;
                                buttonAuthority.BUT_AUTH_FUN_CODE = m_permisson.FUNCODE;

                                IList<ButtonAuthority> Blist = Api.ServiceAccessor.GetSecurityService().queryButtonAuthority(buttonAuthority);

                                BJson.Append("[");
                                foreach (ButtonAuthority itemButton in Blist)
                                {
                                    BJson.Append("{");
                                    BJson.Append("\"BUT_AUTH_BUT_CODE\":\"" + itemButton.BUT_AUTH_BUT_CODE + "\",");
                                    BJson.Append("\"BUT_AUTH_BUT_VISIBLE\":\"" + itemButton.BUT_AUTH_BUT_VISIBLE + "\",");
                                    BJson.Append("\"BUT_AUTH_FUN_CODE\":\"" + itemButton.BUT_AUTH_FUN_CODE + "\",");
                                    BJson.Append("\"BUT_AUTH_MEMO\":\"" + itemButton.BUT_AUTH_MEMO + "\",");
                                    BJson.Append("\"BUT_AUTH_TYPE\":\"" + itemButton.BUT_AUTH_TYPE + "\",");
                                    BJson.Append("\"BUT_AUTH_TYPE_VCODE\":\"" + itemButton.BUT_AUTH_TYPE_VCODE + "\",");
                                    BJson.Append("\"XT_BUTTON_OBJ_ID\":\"" + itemButton.XT_BUTTON_OBJ_ID + "\",");
                                    BJson.Append("\"XT_BUTTON_TYPE\":\"" + itemButton.XT_BUTTON_TYPE + "\"");
                                    BJson.Append("},");
                                }
                                string json = "";
                                if (BJson.Length > 1)
                                {
                                    json = BJson.ToString().Substring(0, BJson.Length - 1);
                                }
                                else
                                {
                                    json = BJson.ToString();
                                }
                                json += "]";
                                BJson.Clear();
                                BJson.Append(json);
                                //当前页面地址，在用户权限中存在。
                                IsPass = 1;
                                mypage_permisson = m_permisson;
                                break;
                            }
                        }

                    }
                }
                else
                {
                    //菜单中不存在 ，不需要验证。
                    IsPass = 1;
                    mypage_permisson.NEW = 1;
                    mypage_permisson.QUERY = 1;
                    mypage_permisson.DEL = 1;
                    mypage_permisson.MOD = 1;
                }
                #endregion
                break;
        }




        System.Text.StringBuilder Json = new System.Text.StringBuilder();
        if (string.IsNullOrEmpty(BJson.ToString()))
        {
            BJson.Append("[]");
        }

        Json.Append("{");
        Json.Append("Visit:\"" + IsPass + "\",");
        Json.Append("INSERT:\"" + mypage_permisson.NEW + "\",");
        Json.Append("SELECT:\"" + mypage_permisson.QUERY + "\",");
        Json.Append("DELTE:\"" + mypage_permisson.DEL + "\",");
        Json.Append("json:" + BJson + ",");
        Json.Append("UPDATE:\"" + mypage_permisson.MOD + "\"");
        Json.Append("}");

        // mypage_permisson.
        context.Response.Write(Json.ToString());


    }

    /// <summary>
    /// 获得页面权限
    /// </summary>
    /// <param name="context"></param>
    public void GetAllUrl(HttpContext context, string LoginName)
    {
        string usercode = "";
        string sql = "select user_code from tsys_user where loginid='" + LoginName + "'";
        DataSet userDs = DbHelperOra.Query(sql);
        if (userDs.Tables[0].Rows.Count > 0) { usercode = userDs.Tables[0].Rows[0][0].ToString(); }
        if (Api.Util.Public.GetUserCode != "") { usercode = Api.Util.Public.GetUserCode; }
        System.Text.StringBuilder Json = new System.Text.StringBuilder();
        Json.Append("[");
        //System.Collections.Hashtable hashTable = ServiceAccessor.GetSecurityService().FunPermission(usercode, "");
        IList<Api.SysManagement.Security.entity.FunPermisson> hashTable = ServiceAccessor.GetSecurityService().FunPermission(usercode, "");
        foreach (Api.SysManagement.Security.entity.FunPermisson de in hashTable)
        {
            Json.Append("{");
            Json.Append("url:\"" + de.URL.ToString() + "\"");
            Json.Append("},");
        }
        Json.Append("]");
        context.Response.Cache.SetCacheability(HttpCacheability.NoCache);
        context.Response.ContentType = "text/plain";
        object myObj = Newtonsoft.Json.JsonConvert.DeserializeObject(Json.ToString());
        context.Response.Write(myObj);



    }
    /// <summary>
    /// 获得按钮权限
    /// </summary>
    /// <param name="url"></param>
    /// <param name="context"></param>
    public void GetButton(string url, HttpContext context, string LoginName)
    {
        string usercode = "";
        string sql = "select user_code from tsys_user where loginid='" + LoginName + "'";
        DataSet userDs = DbHelperOra.Query(sql);
        if (userDs.Tables[0].Rows.Count > 0) { usercode = userDs.Tables[0].Rows[0][0].ToString(); }
        if (Api.Util.Public.GetUserCode != "") { usercode = Api.Util.Public.GetUserCode; }

        System.Text.StringBuilder Json = new System.Text.StringBuilder();
        Json.Append("[");
        ////System.Collections.Hashtable hashTable = ServiceAccessor.GetSecurityService().FunPermission(usercode, url);
        IList<Api.SysManagement.Security.entity.FunPermisson> hashTable = ServiceAccessor.GetSecurityService().FunPermission(usercode, url);
        foreach (Api.SysManagement.Security.entity.FunPermisson de in hashTable)
        {
            Json.Append("{");
            Json.Append("INSERT:\"" + de.NEW + "\",");
            Json.Append("SELECT:\"" + de.QUERY + "\",");
            Json.Append("DELTE:\"" + de.DEL + "\",");
            Json.Append("UPDATE:\"" + de.MOD + "\",");
            Json.Append("},");
        }
        Json.Append("]");
        context.Response.Cache.SetCacheability(HttpCacheability.NoCache);
        context.Response.ContentType = "text/plain";
        object myObj = Newtonsoft.Json.JsonConvert.DeserializeObject(Json.ToString());
        context.Response.Write(myObj);

    }
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}