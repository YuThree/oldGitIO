<%@ WebHandler Language="C#" Class="Pubic" %>

using System;
using System.Web;
using Api.Foundation.entity.Cond;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using Api.Foundation.entity.Foundation;

public class Pubic : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        //没有缓存
        context.Response.Cache.SetCacheability(HttpCacheability.NoCache);
        String type = myfiter.Filter_Script(context.Request["type"]);
        string name = myfiter.Filter_Script(context.Request["Name"]);
        if (!String.IsNullOrEmpty(type))
        {
            switch (type)
            {
                //case "getTsysOrg":
                //    getTsysOrg(context);
                //    break;
                //case "getTsysUser":
                //    getTsysUser(context);
                //    break;
                //case "getSysdic":
                //    getSysdic(context);
                //    break;
                //case "getLinCode":
                //    getLinCode(context, name);
                //    break;
                //case "GetLineByDept":
                //    GetLineByDept(context);
                //    break;
                //case "GetStationByLine":
                //    GetStationByLine(context);
                //    break;
                //case "getLocomotive":
                //    GetLocomotive(context);
                //    break;
                case "IsPowerOrg":
                    IsPowerOrg(context);
                    break;
                case "getSeverity":
                    GetSeverity();
                    break;
                case "Organization_JuniorBureau":
                    GetOrganizationTree_BureauJunior();//获取局的下一级组织机构
                    break;
            }
        }
    }

    public void GetSeverity()
    {

        string remove = HttpContext.Current.Request["remove"];//手机端标识
        System.Text.StringBuilder json = new System.Text.StringBuilder();
        json.Append("[");
        SysDictionaryCond cond = new SysDictionaryCond();
        cond.P_CODE = "SEVERITY";
        IList<Api.Foundation.entity.Foundation.SysDictionary> list = Api.ServiceAccessor.GetFoundationService().querySysDictionary(cond);
        if (!string.IsNullOrEmpty(remove))
        {
            for (int i = 0; i < list.Count; i++)
            {
                json.AppendFormat("{{\"code\":\"{0}\",\"name\":\"{1}\"}}", list[i].DIC_CODE, list[i].CODE_NAME);
                if (i < list.Count - 1)
                {
                    json.Append(",");
                }
            }
        }
        else
        {
            foreach (Api.Foundation.entity.Foundation.SysDictionary dic in list)
            {
                json.AppendFormat("{{'code':'{0}','name':'{1}'}},", dic.DIC_CODE, dic.CODE_NAME);
            }
        }
        json.Append("]");
        HttpContext.Current.Response.Write(json);
        HttpContext.Current.Response.End();
    }

    public void IsPowerOrg(HttpContext context)
    {
        string IsPower = "0";
        string orgType = myfiter.GetOrg_Type(Api.Util.Public.GetDeptCode);

        if (orgType == Api.Foundation.entity.Foundation.LocoType.GDD)
        {
            IsPower = "1";
        }

        context.Response.Write(IsPower);

    }

    /// <summary>
    /// 根据组织机构筛选线路
    /// </summary>
    /// <param name="context"></param>
    public void GetLineByDept(HttpContext context)
    {
        LineCond lineCond = new LineCond();
        if (!String.IsNullOrEmpty(context.Request["objWhere"]))
        {
            lineCond.BUREAU_CODE = context.Request["objWhere"];
        }
        IList<Api.Foundation.entity.Foundation.Line> lineList = Api.ServiceAccessor.GetFoundationService().queryLine(lineCond);
        String selectList = "<option selected value='0'>-请选择-</option>";
        if (lineList.Count != 0)
        {
            foreach (Api.Foundation.entity.Foundation.Line line in lineList)
            {
                selectList += "<option  value='" + line.LINE_CODE + "'>" + line.LINE_NAME + "</option>";
            }
        }
        context.Response.Write(selectList);
        context.Response.End();
        context.Response.Clear();
    }
    /// <summary>
    /// 获取组织机构Tree（只取局的下一级）
    /// </summary>
    /// <returns></returns>
    public void GetOrganizationTree_BureauJunior()
    {
        string action = HttpContext.Current.Request["action"];//远动库开关
        StringBuilder Json = new StringBuilder();
        Json.Append("[");
        var btlist = from n in Api.Util.Common.organizationDic.Values
                     where n.ORG_TYPE == "J"
                     orderby n.ORG_ORDER
                     select n;
        IList<Organization> orgList = btlist.ToList<Organization>();
        foreach (Organization org in orgList)
        {
            btlist = from n in Api.Util.Common.organizationDic.Values
                     where n.SUP_ORG_CODE == org.ORG_CODE
                     orderby n.ORG_ORDER
                     select n;
            IList<Organization> _orgList = btlist.ToList<Organization>();
            foreach (Organization _org in _orgList)
            {
                if (!Api.Util.Public.IsAdmin() && string.IsNullOrEmpty(action))
                {
                    if (_org.ORG_TYPE == "J")
                    {
                        //局级只权限过滤。
                        if (!Api.Util.Public.IsHavePermisson_orgCode_BUREAU(_org.ORG_CODE))
                        {
                            continue;
                        }
                    }
                    else
                    {
                        if (!Api.Util.Public.IsHavePermisson_orgCode_BUREAU(_org.ORG_CODE) || Api.Util.Public.IsPowerSectionUser() && (!Api.Util.Public.IsPowerSectionOrg(_org.ORG_TYPE)) || !Api.Util.Public.IsPowerSectionUser() && Api.Util.Public.IsPowerSectionOrg(_org.ORG_TYPE))
                        {
                            //没有此权限  过滤掉    登录的是供电用户，此组织机构不是供电相关组织机构 也过滤。  登录的不是供电用户，此组织又是供电相关的 过滤掉
                            continue;
                        }
                    }
                }
                if (action == "YuanDong")//远动库负责单位
                {
                    if (!Api.Util.Public.IsAdmin())
                    {
                        if (_org.ORG_TYPE == "J")
                        {
                            //局级只权限过滤。
                            if (!Api.Util.Public.IsHavePermisson_orgCode_BUREAU(_org.ORG_CODE))
                            {
                                continue;
                            }
                        }
                        else
                        {
                            if (!Api.Util.Public.IsHavePermisson_orgCode_BUREAU(_org.ORG_CODE) || Api.Util.Public.IsPowerSectionUser() && (!Api.Util.Public.IsWJPowerSectionOrg(_org.ORG_TYPE)) || !Api.Util.Public.IsPowerSectionUser() && Api.Util.Public.IsWJPowerSectionOrg(_org.ORG_TYPE))
                            {
                                //没有此权限  过滤掉    登录的是供电用户，此组织机构不是供电相关组织机构 也过滤。  登录的不是供电用户，此组织又是供电相关的 过滤掉
                                continue;
                            }
                        }
                    }
                    if (_org.ORG_TYPE == "CLD")
                    {
                        continue;
                    }
                }
                Json.AppendFormat("{{\"code\":\"{0}\",\"name\":\"{1}\"}},", _org.ORG_CODE, _org.ORG_NAME);
            }
        }
        string result = Json.ToString().Substring(0, Json.Length - 1) + "]";
        HttpContext.Current.Response.Write(result);
        HttpContext.Current.Response.End();
    }
    /// <summary>
    /// 
    /// </summary>
    /// <param name="context"></param>
    public void GetStationByLine(HttpContext context)
    {
        StationSectionCond stationSectionCond = new StationSectionCond();
        if (!String.IsNullOrEmpty(context.Request["objWhere"]))
        {
            stationSectionCond.LINE_CODE = context.Request["objWhere"];
        }
        IList<Api.Foundation.entity.Foundation.StationSection> stationList = Api.ServiceAccessor.GetFoundationService().queryStationSection(stationSectionCond);
        String selectList = "<option selected value='0'>-请选择-</option>";
        if (stationList.Count != 0)
        {
            foreach (Api.Foundation.entity.Foundation.StationSection stationSection in stationList)
            {
                selectList += "<option  value='" + stationSection.POSITION_NAME + "'>" + stationSection.POSITION_NAME + "</option>";
            }
        }
        context.Response.Write(selectList);
        context.Response.End();
        context.Response.Clear();
    }


    /// <summary>
    /// 
    /// </summary>
    /// <param name="context"></param>
    public void getLinCode(HttpContext context, string name)
    {
        string returnstring = null;
        Api.Foundation.entity.Cond.LineCond con = new Api.Foundation.entity.Cond.LineCond();
        //到时候封装条件
        con.LINE_NAME = name;
        IList<Api.Foundation.entity.Foundation.Line> linlist = Api.ServiceAccessor.GetFoundationService().queryLine(con);
        if (linlist.Count > 0)
        {
            returnstring = linlist[0].LINE_CODE;
        }
        context.Response.Write(returnstring);
        context.Response.End();
        context.Response.Clear();

    }

    /// <summary>
    /// 获取组织机构
    /// </summary>
    /// <param name="context"></param>
    public void getTsysOrg(HttpContext context)
    {

        string obj = myfiter.Filter_Script(context.Request["obj"]);
        string objValue = myfiter.Filter_Script(context.Request["objValue"]);
        string valueObj = myfiter.Filter_Script(context.Request["valueObj"]);
        string textObj = myfiter.Filter_Script(context.Request["textObj"]);

        Api.Foundation.entity.Cond.OrganizationCond con = new Api.Foundation.entity.Cond.OrganizationCond();
        //到时候封装条件
        IList<Api.Foundation.entity.Foundation.Organization> orgList = Api.ServiceAccessor.GetFoundationService().queryOrganization(con);
        String Style = "";
        if ("1" == context.Request["objtype"])
        {
            Style = "data-rel=\"chosen\" onchange=\"onChange" + obj + "(this.options[this.options.selectedIndex].text,this.options[this.options.selectedIndex].value," + textObj + ")\"";
        }
        else
        {
            Style = "style=\"width: 230px\" multiple  data-rel=\"chosen\" onchange=\"onChangeObjs(this.options[this.options.selectedIndex].value,this.options[this.options.selectedIndex].text," + textObj + "," + valueObj + ")\"";
        }
        String selectList = "<select id='" + obj + "'  name='" + obj + "'  " + Style + ">";
        selectList += "<option selected value='0'>-请选择-</option>";
        if (orgList.Count != 0)
        {
            foreach (Api.Foundation.entity.Foundation.Organization org in orgList)
            {
                if (!String.IsNullOrEmpty(objValue) && objValue == org.ORG_CODE)
                {
                    selectList += "<option selected value='" + org.ORG_CODE + "'>" + org.ORG_NAME + "</option>";
                }
                else
                {
                    selectList += "<option value='" + org.ORG_CODE + "'>" + org.ORG_NAME + "</option>";
                }

            }
        }
        selectList += "</select>";
        context.Response.Write(selectList);
        context.Response.End();
        context.Response.Clear();
    }
    /// <summary>
    /// 获取人员
    /// </summary>
    /// <param name="context"></param>
    public void getTsysUser(HttpContext context)
    {

        string obj = myfiter.Filter_Script(context.Request["obj"]);
        string objValue = myfiter.Filter_Script(context.Request["objValue"]);
        string valueObj = myfiter.Filter_Script(context.Request["valueObj"]);
        string textObj = myfiter.Filter_Script(context.Request["textObj"]);

        Api.Foundation.entity.Cond.UserCond con = new Api.Foundation.entity.Cond.UserCond();
        if (!String.IsNullOrEmpty(context.Request["objWhere"]))
        {
            con.ORG_CODE = context.Request["objWhere"].ToString();
        }
        IList<Api.Foundation.entity.Foundation.User> userList = Api.ServiceAccessor.GetFoundationService().queryUser(con);
        String Style = "";
        if ("1" == context.Request["objtype"])
        {
            Style = "data-rel=\"chosen\" onchange=\"onChangeObj(this.options[this.options.selectedIndex].text," + textObj + ")\"";
        }
        else
        {
            Style = "style=\"width: 500px\" multiple  data-rel=\"chosen\" onchange=\"onChangeObjs(this.options[this.options.selectedIndex].value,this.options[this.options.selectedIndex].text," + textObj + "," + valueObj + ")\"";
        }
        String selectList = "<select id='" + obj + "' name='" + obj + "' " + Style + ">";
        selectList += "<option selected value='0'>-请选择-</option>";
        if (userList.Count != 0)
        {
            foreach (Api.Foundation.entity.Foundation.User user in userList)
            {
                if (!String.IsNullOrEmpty(objValue) && objValue == user.USER_CODE)
                {
                    selectList += "<option selected  value='" + user.USER_CODE + "'>" + user.PER_NAME + "</option>";
                }
                else
                {
                    selectList += "<option value='" + user.USER_CODE + "'>" + user.PER_NAME + "</option>";
                }
            }

        }
        selectList += "</select>";
        context.Response.Write(selectList);
        context.Response.End();
        context.Response.Clear();
    }
    public void getSysdic(HttpContext context)
    {

        string obj = myfiter.Filter_Script(context.Request["obj"]);
        string objValue = myfiter.Filter_Script(context.Request["objValue"]);
        string valueObj = myfiter.Filter_Script(context.Request["valueObj"]);
        string textObj = myfiter.Filter_Script(context.Request["textObj"]);

        string CATEGORY = myfiter.Filter_Script(context.Request["CATEGORY"]);



        Api.Foundation.entity.Cond.SysDictionaryCond con = new Api.Foundation.entity.Cond.SysDictionaryCond();

        if (!String.IsNullOrEmpty(CATEGORY))
        {
            con.CATEGORY = CATEGORY;
        }

        if (!String.IsNullOrEmpty(context.Request["objWhere"]))
        {
            con.businssAnd = context.Request["objWhere"].Replace("#", "'");
        }
        IList<Api.Foundation.entity.Foundation.SysDictionary> dicList = Api.ServiceAccessor.GetFoundationService().querySysDictionary(con);
        String Style = "";
        if ("1" == context.Request["objtype"])
        {
            Style = "data-rel=\"chosen\" onchange=\"onChangeObj(this.options[this.options.selectedIndex].text," + textObj + ")\"";
        }
        else
        {
            Style = "style=\"width: 500px\" multiple  data-rel=\"chosen\" onchange=\"onChangeObjs(this.options[this.options.selectedIndex].value,this.options[this.options.selectedIndex].text," + textObj + "," + valueObj + ")\"";
        }
        String selectList = "<select id='" + obj + "' name='" + obj + "' " + Style + ">";
        if (dicList.Count != 0)
        {
            foreach (Api.Foundation.entity.Foundation.SysDictionary dic in dicList)
            {
                if (!String.IsNullOrEmpty(objValue) && objValue == dic.DIC_CODE)
                {
                    selectList += "<option selected  value='" + dic.DIC_CODE + "'>" + dic.CODE_NAME + "</option>";
                }
                else
                {
                    selectList += "<option value='" + dic.DIC_CODE + "'>" + dic.CODE_NAME + "</option>";
                }
            }

        }
        selectList += "</select>";
        context.Response.Write(selectList);
        context.Response.End();
        context.Response.Clear();
    }
    /// <summary>
    /// 获取动车信息
    /// </summary>
    /// <param name="context"></param>
    private void GetLocomotive(HttpContext context)
    {
        LocomotiveCond cond = new LocomotiveCond();
        if (!String.IsNullOrEmpty(context.Request["LOCO_VERSION"]))
        {
            cond.DEVICE_VERSION = context.Request["LOCO_VERSION"];
        }
        IList<Api.Foundation.entity.Foundation.Locomotive> list = Api.ServiceAccessor.GetFoundationService().queryLocomotive(cond);
        String json = "[";
        if (list.Count > 0)
        {
            for (int i = 0; i < list.Count; i++)
            {
                if (i < list.Count - 1)
                {
                    json += "{LOCOMOTIVE_CODE:'" + list[i].LOCOMOTIVE_CODE + "'},";
                }
                else
                {
                    json += "{LOCOMOTIVE_CODE:'" + list[i].LOCOMOTIVE_CODE + "'}";
                }
            }
        }
        json += "]";
        object myObj = JsonConvert.DeserializeObject(json);
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