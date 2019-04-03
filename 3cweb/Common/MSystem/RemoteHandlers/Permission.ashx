<%@ WebHandler Language="C#" Class="Permission" %>

using System;
using System.Web;
using System.Text;
using Api.Foundation.entity.Cond;
using System.Collections.Generic;
using Api.Foundation.entity.Foundation;
using Api.SysManagement.Security.entity.Cond;
using Api.SysManagement.Security.entity;
using Api.Util;

public class Permission : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        string type = context.Request["type"];
        //string category = context.Request["category"];


        string category =Api.Util.Common.getParamterInfo("For6C").VALUE;// System.Configuration.ConfigurationManager.AppSettings["For6C"].ToString();
        switch (type)
        {
            //获取树
            case "tree":
                GetTree();
                break;
            //获取页面树,页面权限，右边的功能菜单树
            case "formtree":
                GetFormTree(category);
                break;
            //授权
            case "permission":
                Impower();
                break;
            //获取授权页面
            case "checked":
                GetChecked();
                break;
            default:
                break;
        }
    }
    public void GetTree()
    {
        StringBuilder Json = new StringBuilder();
        Json.Append("[");
        UserCond userCond = new UserCond();
        IList<User> userList = Api.ServiceAccessor.GetFoundationService().queryUserBy(userCond);
        Dictionary<string, Organization> orgList = Api.Util.Common.organizationDic;
        foreach (Organization org in orgList.Values)
        {
            if (!Api.Util.Public.IsHavePermisson_orgCode_BUREAU(org.ORG_CODE))
            {
                continue;
            }
            Json.Append("{");
            Json.Append("id:\"" + org.ORG_CODE + "\",");
            Json.Append("pId:\"" + org.SUP_ORG_CODE + "\",");
            Json.Append("name:\"" + org.ORG_NAME + "\",");
            Json.Append("icon:\"org.png\",");
            Json.Append("click:\"TreeClick('" + org.ORG_CODE + "','ORG')\"");
            Json.Append("},");
            if (userList.Count > 0)
            {
                foreach (User user in userList)
                {
                    if (user.ORG_CODE == org.ORG_CODE)
                    {
                        Json.Append("{");
                        Json.Append("id:\"" + user.USER_CODE + "\",");
                        Json.Append("pId:\"" + org.ORG_CODE + "\",");
                        Json.Append("name:\"" + user.PER_NAME + "\",");
                        Json.Append("icon:\"person.png\",");
                        Json.Append("click:\"TreeClick('" + user.USER_CODE + "','USER')\"");
                        Json.Append("},");
                    }
                }
            }
        }
        string json = Json.ToString().Substring(0, Json.Length - 1);
        json += "]";
        Json.Clear();
        Json.Append(json);
        HttpContext.Current.Response.Write(Json);


        //System.Text.StringBuilder Json = new System.Text.StringBuilder();
        //string json = Api.ServiceAccessor.GetFoundationService().getAllOrganizationJsonTree();
        //HttpContext.Current.Response.Write(json);
        //
        //
    }
    public void GetFormTree(string category)
    {
        //string code = HttpContext.Current.Request["uCode"];
        //FunSecurityCond cond = new FunSecurityCond();
        //cond.MASTERID = code;
        //Api.ServiceAccessor.GetSecurityService().queryFunPermission(cond);
        //if (category == "DPC") category = "";
        System.Text.StringBuilder Json = new System.Text.StringBuilder();
        string json = Api.ServiceAccessor.getFunMenuService().getFunMenuTreeJson(category);
        HttpContext.Current.Response.Write(json);


    }
    public void Impower()
    {
        bool str = false;
        try
        {
            string code = HttpContext.Current.Request["USER_CODE"];
            string _type = HttpContext.Current.Request["_type"];
            string p_str = HttpContext.Current.Request["PER_STR"];
            if (code != null && code != "")//页面权限授权时先清除一次
            {
                Api.ServiceAccessor.GetSecurityService().deleteFunPermisson(code);
            }
            foreach (string charList in p_str.Split('$'))
            {
                string[] list = charList.Split(';');
                if (charList.IndexOf(";") < 0)
                {
                    str = true;
                    break;
                }
                string insert = list[1], del = list[2], update = list[3], select = list[4], qt = list[5];
                FunMenuCond cond = new FunMenuCond();
                cond.businssAnd = " CODE='" + list[0] + "' ";
                string url = Api.ServiceAccessor.getFunMenuService().getFunMenu(cond)[0].URL;
                if (url == "#")
                    continue;

                XtButtonCond Xtcond = new XtButtonCond();
                Xtcond.businssAnd = " XT_MEM_CODE='" + list[0] + "' ";

                IList<XtButton> listButton = Api.ServiceAccessor.GetSecurityService().queryXtButton(Xtcond);
                for (int i = 0; i < listButton.Count; i++)
                {
                    string Visible = "0";
                    if (listButton[i].XT_BUTTON_TYPE == "新增")
                    {
                        Visible = insert;
                    }
                    else if (listButton[i].XT_BUTTON_TYPE == "删除")
                    {
                        Visible = del;
                    }
                    else if (listButton[i].XT_BUTTON_TYPE == "修改")
                    {
                        Visible = update;
                    }
                    else if (listButton[i].XT_BUTTON_TYPE == "查询")
                    {
                        Visible = select;
                    }
                    else if (listButton[i].XT_BUTTON_TYPE == "其他")
                    {
                        if (qt == "")
                        {
                            Visible = "0";
                        }
                        string[] Qtlist = qt.Split(',');
                        for (int k = 0; k < Qtlist.Length; k++)
                        {
                            if (listButton[i].XT_BUTTON_CODE == Qtlist[k].Split('@')[0])
                            {
                                Visible = Qtlist[k].Split('@')[1];
                            }
                        }
                    }
                    string id = Guid.NewGuid().ToString().Replace("-", "");
                    ButtonAuthority buttonAuthority = new ButtonAuthority();
                    buttonAuthority.BUT_AUTH_ID = id;
                    buttonAuthority.BUT_AUTH_FUN_CODE = listButton[i].XT_MEM_CODE;
                    buttonAuthority.BUT_AUTH_TYPE_VCODE = code;
                    buttonAuthority.BUT_AUTH_TYPE = _type;
                    buttonAuthority.BUT_AUTH_BUT_CODE = listButton[i].XT_BUTTON_CODE;
                    buttonAuthority.XT_BUTTON_OBJ_ID = listButton[i].XT_BUTTON_OBJ_ID;
                    buttonAuthority.XT_BUTTON_TYPE = listButton[i].XT_BUTTON_TYPE;

                    IList<ButtonAuthority> listBu = Api.ServiceAccessor.GetSecurityService().queryButtonAuthority(buttonAuthority);

                    buttonAuthority.BUT_AUTH_BUT_VISIBLE = Visible;
                    if (listBu.Count == 0)
                    {
                        if (Api.ServiceAccessor.GetSecurityService().addButtonAuthority(buttonAuthority))
                        {
                            str = true;
                        }
                    }
                    else if (listBu.Count > 0)
                    {
                        buttonAuthority.BUT_AUTH_ID = listBu[0].BUT_AUTH_ID;
                        if (Api.ServiceAccessor.GetSecurityService().updateButtonAuthority(buttonAuthority))
                        {
                            str = true;
                        }
                    }
                    str = true;
                }

                string Fid = Guid.NewGuid().ToString().Replace("-", "");
                FunPermisson funP = new FunPermisson();
                funP.ID = Fid;
                funP.MASTERID = code;
                funP.URL = url;
                funP.FUNCODE = list[0];
                FunSecurityCond funCond = new FunSecurityCond();
                funCond.FUNCODE = list[0];
                funCond.MASTERID = code;
                IList<FunPermisson> lists = Api.ServiceAccessor.GetSecurityService().queryFunPermission(funCond);
                if (lists.Count == 0)
                {
                    if (Api.ServiceAccessor.GetSecurityService().addFunPermisson(funP))
                    {
                        str = true;
                    }
                }
                else if (lists.Count > 0)
                {
                    if (Api.ServiceAccessor.GetSecurityService().updateFunPermisson(funP))
                    {
                        str = true;
                    }
                }
                str = true;
            }

            if (str)
            {
                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "页面权限", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "给页面权限" + code + "授权", "", true);
            }
            else
            {
                Api.ServiceAccessor.GetLogService().operationLog(Public.GetLoginID, "页面权限", Api.Util.Public.FunNames.用户管理.ToString(), Public.GetLoginIP, "给页面权限" + code + "授权", "", false);
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
    public void GetChecked()
    {
        string result = "";
        try
        {
            string masterId = HttpContext.Current.Request["MASTERID"];
            FunSecurityCond cond = new FunSecurityCond();
            cond.MASTERID = masterId;
            IList<FunPermisson> list = Api.ServiceAccessor.GetSecurityService().queryFunPermission(cond);
            foreach (FunPermisson item in list)
            {
                result += item.FUNCODE + ";";
                ButtonAuthority buttonAuthority = new ButtonAuthority();
                buttonAuthority.BUT_AUTH_TYPE_VCODE = masterId;
                buttonAuthority.BUT_AUTH_FUN_CODE = item.FUNCODE;
                IList<ButtonAuthority> Blist = Api.ServiceAccessor.GetSecurityService().queryButtonAuthority(buttonAuthority);
                int insert = 0, del = 0, update = 0, select = 0;
                string qt = "";
                foreach (ButtonAuthority itemButton in Blist)
                {
                    if (itemButton.XT_BUTTON_TYPE == "新增" && itemButton.BUT_AUTH_BUT_VISIBLE == "1")
                    {
                        insert = 1;
                    }
                    else if (itemButton.XT_BUTTON_TYPE == "删除" && itemButton.BUT_AUTH_BUT_VISIBLE == "1")
                    {
                        del = 1;
                    }
                    else if (itemButton.XT_BUTTON_TYPE == "修改" && itemButton.BUT_AUTH_BUT_VISIBLE == "1")
                    {
                        update = 1;
                    }
                    else if (itemButton.XT_BUTTON_TYPE == "查询" && itemButton.BUT_AUTH_BUT_VISIBLE == "1")
                    {
                        select = 1;
                    }
                    else if (itemButton.XT_BUTTON_TYPE == "其他")
                    {
                        if (qt == "")
                        {
                            qt = itemButton.BUT_AUTH_BUT_CODE + "@" + itemButton.BUT_AUTH_BUT_VISIBLE;
                        }
                        else
                        {
                            qt = qt + "," + itemButton.BUT_AUTH_BUT_CODE + "@" + itemButton.BUT_AUTH_BUT_VISIBLE;
                        }
                    }
                }
                result += insert + ";" + del + ";" + update + ";" + select + ";" + qt + ";" + "$";
            }
            result = result.Substring(0, result.Length - 1);
        }
        catch (Exception)
        {
            result = "";
        }
        HttpContext.Current.Response.Write(result);


    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}