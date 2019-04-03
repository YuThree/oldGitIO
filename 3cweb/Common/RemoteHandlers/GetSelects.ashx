<%@ WebHandler Language="C#" Class="GetSelects" %>

using System;
using System.Web;
using Api.Foundation.entity.Foundation;
using System.Collections.Generic;
using Api.Foundation.service;
using Api;
using System.Text;
using Api.Foundation.entity.Cond;
using System.Linq;

public class GetSelects : ReferenceClass, IHttpHandler
{

    private string defaultOption = "<option value='{0}' selected>{1}</option>";

    public void ProcessRequest(HttpContext context)
    {
        string tag = context.Request["tag"].ToUpper();
        string type = context.Request["type"];
        string code = context.Request["code"];
        string name = context.Request["name"];
        string flag = context.Request["flag"];

        string defaultValue = context.Request["defaultValue"];
        string defaultText = context.Request["defaultText"];
        if (!String.IsNullOrEmpty(defaultText) && !String.IsNullOrEmpty(defaultValue))
        {
            defaultOption = String.Format(defaultOption, defaultValue, defaultText);
        }
        else
        {
            defaultOption = "";
        }
        string rs = "-1";
        switch (tag)
        {
            case "ORGANIZATION":
                rs = GetOrganizationSelect(code, type);
                break;
            case "STATIONSECTION":
                rs = GetStationSectionSelect(code, type, name, flag == "true");
                break;
            case "SUBSTATION":
                rs = GetSubStationSelect(code);
                break;
            case "SUBSTATIONBYORG":
                rs = GetSubStationSelectByOrg(code);
                break;
            case "LOCOMOTIVE":
                rs = GetLocomotiveSelect(code, name, flag == "true");
                break;
            case "SYSDICTIONARY":
                rs = GetSysDictionarySelect(code);
                break;
            case "LINE":
                rs = GetLineSelect();
                break;
            case "LINE6C":
                rs = GetLineSelect6C();
                break;
            case "BRIDGETUNE":
                rs = GetBridgeTuneSelect(code);
                break;
            case "USER":
                rs = GetUserSelect(code, type == "true");
                break;
            case "KM":
                rs = GetKmMark(name);
                break;
            case "POWERLOCOMOTIVE":
                rs = GetPowerLocomotiveSelect(code, name, flag == "true");
                break;
        }
        context.Response.ContentType = "text/plain";
        context.Response.Write(rs);
        context.Response.End();

    }
    /// <summary>
    /// 根据区站名称获取起止公里标属性
    /// </summary>
    /// <param name="name">区站名称</param>
    /// <returns>起止公里标属性</returns>
    private string GetKmMark(string name)
    {
        var psIE = from n in Api.Util.Common.stationSectionDic.Values
                   where (String.IsNullOrEmpty(name) ? 0 == 1 : n.POSITION_NAME == name)
                   select n;

        IList<StationSection> psList = psIE.ToList<StationSection>();
        StringBuilder sb = new StringBuilder();
        if (psList.Count > 0)
        {
            sb.AppendFormat("{{'start_km':'{0}','end_km':'{1}'}}", psList[0].START_KM, psList[0].END_KM);
        }
        else
        {
            sb.Append("false");
        }
        return sb.ToString();
    }

    /// <summary>
    /// 获取组织机构下拉列表
    /// </summary>
    /// <param name="code"></param>
    /// <param name="type"></param>
    /// <returns></returns>
    private string GetOrganizationSelect(string code, string type)
    {

        var orgIE = from n in Api.Util.Common.organizationDic.Values
                    where (String.IsNullOrEmpty(code) ? 1 == 1 : n.SUP_ORG_CODE == code)
                    && (String.IsNullOrEmpty(type) ? 1 == 1 : type.Split(',').Contains(n.ORG_TYPE))
                    orderby n.ORG_ORDER
                    select n;

        IList<Organization> orgList = orgIE.ToList<Organization>();

        StringBuilder sb = new StringBuilder();
        sb.Append(defaultOption);
        foreach (Organization org in orgList)
        {
            if (!Api.Util.Public.IsHavePermisson_orgCode_BUREAU(org.ORG_CODE))
            {
                continue;
            }

            sb.AppendFormat("<option value='{0}' title='{1}'>{1}</option>", org.ORG_CODE, org.ORG_NAME);
        }
        return sb.ToString();

    }


    /// <summary>
    /// 获取区站下拉列表
    /// </summary>
    /// <param name="code">线路编码</param>
    /// <param name="type">类型S:站 Q区间</param>
    /// <param name="name">模糊查询名称</param>
    /// <param name="flag">数据类型 true：模态下拉</param>
    /// <returns></returns>
    private string GetStationSectionSelect(string code, string type, string name, bool flag)
    {
        var posIE = from n in Api.Util.Common.stationSectionDic.Values
                    where (String.IsNullOrEmpty(code) ? 1 == 1 : n.LINE_CODE == code)
                    && (String.IsNullOrEmpty(type) ? 1 == 1 : n.POSITION_TYPE == type)
                    && (String.IsNullOrEmpty(name) ? 1 == 1 : n.POSITION_NAME.Contains(name))
                    orderby n.POSITION_ORDER
                    select n;

        IList<StationSection> stationList = posIE.ToList<StationSection>();
        StringBuilder sb = new StringBuilder();
        if (flag)//针对下拉和模态下拉，
        {
            sb.Append("{'result': [");
            foreach (StationSection station in stationList)
            {
                if (Api.Util.Public.IsPowerSectionUser())
                {
                    if (!Api.Util.Public.IsHavePermisson_orgCode_BUREAU(station.BUREAU_CODE) || !Api.Util.Public.IsHavePermisson_orgCode(station.ORG_CODE)) // if (!Api.Util.Public.IsHavePermisson_orgCode(station.BUREAU_CODE))
                    //if (!Api.Util.Public.IsHavePermisson_orgCode_BUREAU(station.BUREAU_CODE)) // if (!Api.Util.Public.IsHavePermisson_orgCode(station.BUREAU_CODE))
                    {
                        continue;
                    }
                }

                sb.AppendFormat("{{name: \"{0}\",code:\"{1}\"}},", station.POSITION_NAME, station.POSITION_CODE);
            }
            sb.ToString().TrimEnd(',');
            sb.Append("]}");
        }
        else
        {
            sb.Append(defaultOption);
            foreach (StationSection station in stationList)
            {
                sb.AppendFormat("<option value='{0}' title='{1}'>{1}</option>", station.POSITION_CODE, station.POSITION_NAME);
            }
        }

        return myfiter.json_RemoveSpecialStr(sb.ToString());
    }


    /// <summary>
    /// 获取变电所下拉列表
    /// </summary>
    /// <param name="code">线路编码</param>
    /// <returns></returns>
    private string GetSubStationSelect(string code)
    {
        var posIE = from n in Api.Util.Common.substationDic.Values
                    where (String.IsNullOrEmpty(code) ? 1 == 1 : n.LINE_CODE == code)
                    select n;

        IList<Substation> sublist = posIE.ToList<Substation>();
        StringBuilder sb = new StringBuilder();
        sb.Append(defaultOption);
        foreach (Substation sub in sublist)
        {
            sb.AppendFormat("<option value='{0}' title='{1}'>{1}</option>", sub.SUBSTATION_CODE, sub.SUBSTATION_NAME);
        }
        return sb.ToString();
    }

    /// <summary>
    /// 获取变电所下拉列表
    /// </summary>
    /// <param name="code">编码</param>
    /// <returns></returns>
    private string GetSubStationSelectByOrg(string code)
    {
        var posIE = from n in Api.Util.Common.substationDic.Values
                    where (String.IsNullOrEmpty(code) ? 1 == 1 : n.POWER_SECTION_CODE == code)
                    select n;

        IList<Substation> sublist = posIE.ToList<Substation>();
        StringBuilder sb = new StringBuilder();
        sb.Append(defaultOption);
        foreach (Substation sub in sublist)
        {
            sb.AppendFormat("<option value='{0}' title='{1}'>{1}</option>", sub.SUBSTATION_CODE, sub.SUBSTATION_NAME);
        }
        return sb.ToString();
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="code">组织机构编码</param>
    /// <param name="name">机车号</param>
    /// <param name="flag">模态查询标志</param>
    /// <returns></returns>
    private string GetLocomotiveSelect(string code, string name, bool flag)
    {
        StringBuilder sb = new StringBuilder();

        var loclist = from n in Api.Util.Common.locomotiveDic.Values
                      where ((String.IsNullOrEmpty(code) || String.IsNullOrEmpty(n.P_ORG_CODE)) ? 1 == 1 : n.P_ORG_CODE.StartsWith(code))
                      && (String.IsNullOrEmpty(name) ? 1 == 1 : n.LOCOMOTIVE_CODE.Contains(name)) && (n.P_ORG_CODE != "")
                      select n;
        IList<Locomotive> list = loclist.ToList<Locomotive>();

        if (flag)//针对下拉和模态下拉，
        {
            sb.Append("{'result': [");
            foreach (Locomotive l in list)
            {
                //l.BUREAU_NAME;


                if (!Api.Util.Public.IsPowerSectionUser())
                {
                    //非供电用户才过滤数据。
                    bool p1 = Api.Util.Public.IsHavePermisson_orgCode_BUREAU(l.ORG_CODE);
                    bool p2 = Api.Util.Public.IsHavePermisson_orgCode_BUREAU(l.P_ORG_CODE);

                    if (!p1 && !p2)
                    {
                        continue;
                    }
                }

                sb.AppendFormat("{{name: \"{0}\",code:\"{0}\",duan:\"{1}\"}},", l.LOCOMOTIVE_CODE, l.P_ORG_NAME);




            }
            sb.ToString().TrimEnd(',');
            sb.Append("]}");
        }
        else
        {
            sb.Append(defaultOption);
            foreach (Locomotive l in list)
            {
                if (!Api.Util.Public.IsHavePermisson_orgCode_BUREAU(l.ORG_CODE))
                {
                    continue;
                }
                sb.AppendFormat("<option value='{0}' title='{0}'>{0}</option>", l.LOCOMOTIVE_CODE);
            }
        }
        return sb.ToString();
    }

    /// </summary>
    /// <param name="code">供电所编码</param>
    /// <returns></returns>
    private string GetPowerLocomotiveSelect(string code, string name, bool flag)
    {
        StringBuilder sb = new StringBuilder();

        var loclist = from n in Api.Util.Common.locomotiveDic.Values
                      where (String.IsNullOrEmpty(code) ? 1 == 1 : n.ORG_CODE.StartsWith(code))
                      && (String.IsNullOrEmpty(name) ? 1 == 1 : n.LOCOMOTIVE_CODE.Contains(name))
                      select n;
        IList<Locomotive> list = loclist.ToList<Locomotive>();

        if (flag)//针对下拉和模态下拉，
        {
            sb.Append("{'result': [");
            foreach (Locomotive l in list)
            {
                //l.BUREAU_NAME;


                if (!Api.Util.Public.IsHavePermisson_orgCode_BUREAU(l.ORG_CODE))
                {
                    continue;
                }
                sb.AppendFormat("{{name: \"{0}\",code:\"{0}\",duan:\"{1}\"}},", l.LOCOMOTIVE_CODE, l.ORG_NAME);




            }
            sb.ToString().TrimEnd(',');
            sb.Append("]}");
        }
        else
        {
            sb.Append(defaultOption);
            foreach (Locomotive l in list)
            {
                if (!Api.Util.Public.IsHavePermisson_orgCode_BUREAU(l.ORG_CODE))
                {
                    continue;
                }
                sb.AppendFormat("<option value='{0}' title='{0}'>{0}</option>", l.LOCOMOTIVE_CODE);
            }
        }
        return sb.ToString();
    }
    /// <summary>
    /// 获取字典下拉
    /// </summary>
    /// <param name="code"></param>
    /// <returns></returns>
    private string GetSysDictionarySelect(string code)
    {
        StringBuilder sb = new StringBuilder();
        SysDictionaryCond diccd = new SysDictionaryCond();
        diccd.P_CODE = code;
        IList<SysDictionary> dicList = ServiceAccessor.GetFoundationService().querySysDictionary(diccd);
        sb.Append(defaultOption);
        foreach (SysDictionary dic in dicList)
        {
            sb.AppendFormat("<option value='{0}'>{1}</option>", dic.DIC_CODE, dic.CODE_NAME);
        }
        return sb.ToString();
    }


    /// <summary>
    /// 获取线路下拉列表
    /// </summary>
    /// <returns></returns>
    private string GetLineSelect()
    {
        StringBuilder sb = new StringBuilder();

        IList<Line> lineList;
        if (Api.Util.Public.IsPowerSectionUser())
        {
            var linelist = from n in Api.Util.Common.lineDic.Values
                           where n.IS_SHOW == "1" && n.ORG_CODE != null && Api.Util.Public.IsHavePermisson_orgCode(n.ORG_CODE) // && Api.Util.Public.IsHavePermisson_orgCode_BUREAU( Api.Util.Public.GetBureau(n.ORG_CODE))
                           orderby n.LINE_NO
                           select n;
            lineList = linelist.ToList<Line>();
        }
        else
        {
            //车辆用户，不筛选线路。      
            var linelist = from n in Api.Util.Common.lineDic.Values
                           where n.IS_SHOW == "1" && n.ORG_CODE != null
                           orderby n.LINE_NO
                           select n;
            lineList = linelist.ToList<Line>();
        }


        sb.Append(defaultOption);
        foreach (Line line in lineList)
        {
            //不知道为什么有限制 取消掉了 BY TJY 2017.07.24
            //if (string.IsNullOrEmpty(line.ORG_CODE))
            //{
            //    continue;
            //}

            sb.AppendFormat("<option value='{0}' title='{1}'>{1}</option>", line.LINE_CODE, line.LINE_NAME);
        }
        return sb.ToString();
    }
    /// <summary>
    /// 获取线路下拉列表(6C)
    /// </summary>
    /// <returns></returns>
    private string GetLineSelect6C()
    {
        StringBuilder sb = new StringBuilder();

        IList<Line> lineList;
        if (Api.Util.Public.IsPowerSectionUser())
        {
            var linelist = from n in Api.Util.Common.lineDic.Values
                           where n.IS_SHOW == "1" && Api.Util.Public.IsHavePermisson_orgCode(n.ORG_CODE)
                           orderby n.LINE_NAME
                           select n;
            lineList = linelist.ToList<Line>();
        }
        else
        {
            //车辆用户，不筛选线路。      
            var linelist = from n in Api.Util.Common.lineDic.Values
                           where n.IS_SHOW == "1"
                           orderby n.LINE_NAME
                           select n;
            lineList = linelist.ToList<Line>();
        }


        sb.Append(defaultOption);
        foreach (Line line in lineList)
        {
            sb.AppendFormat("<option value='{0}' title='{1}'>{1}</option>", line.LINE_CODE, line.LINE_NAME);
        }
        return sb.ToString();
    }

    /// <summary>
    /// 获取桥隧下拉列表
    /// </summary>
    /// <param name="code"></param>
    /// <returns></returns>
    private string GetBridgeTuneSelect(string code)
    {
        string positionCode = myfiter.Filter_Script(code);
        StringBuilder sb = new StringBuilder();
        sb.Append(defaultOption);
        var posIE = from n in Api.Util.Common.bridgeTuneDic.Values
                    where String.IsNullOrEmpty(code) ? 1 == 1 : n.POSITION_CODE == code
                    orderby n.BRG_TUN_ORDER
                    select n;

        IList<BridgeTune> bridgeList = posIE.ToList<BridgeTune>();
        foreach (BridgeTune bt in bridgeList)
        {
            sb.AppendFormat("<option value='{0}' title='{1}'>{1}</option>", bt.BRG_TUN_CODE, bt.BRG_TUN_NAME);
        }


        return sb.ToString();
    }

    /// <summary>
    /// 获取用户下拉列表
    /// </summary>
    /// <param name="code">组织机构代码</param>
    /// <param name="type">是否查询机构下（包含下属机构）所有用户 </param>
    /// <returns></returns>
    private string GetUserSelect(string code, bool type)
    {
        StringBuilder sb = new StringBuilder();
        sb.Append(defaultOption);

        UserCond userCond = new UserCond();

        if (!String.IsNullOrEmpty(code))
        {
            if (type)
            {
                userCond.businssAnd = "ORG_CODE like '" + code + "%'";
            }
            else
            {
                userCond.ORG_CODE = code;
            }
        }

        IList<User> userList = Api.ServiceAccessor.GetFoundationService().queryUserBy(userCond);

        foreach (User u in userList)
        {
            sb.AppendFormat("<option value='{0}' title='{1}'>{1}</option>", u.USER_CODE, u.PER_NAME);
        }



        return sb.ToString();
    }





    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}