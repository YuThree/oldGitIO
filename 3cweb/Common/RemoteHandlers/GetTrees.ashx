<%@ WebHandler Language="C#" Class="GetTrees" %>

using System;
using System.Web;
using Api.Foundation.entity.Foundation;
using System.Collections.Generic;
using Api.Foundation.service;
using System.Text;
using Api;
using Api.SysManagement.Security.entity;
using Api.Foundation.entity.Cond;
using System.Linq;
using System.Data;


public class GetTrees : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        string rs = "-1";
        string tag = context.Request["tag"].ToUpper();
        try
        {
            switch (tag)
            {
                case "LOCOMOTIVE":
                    string isVideo = context.Request["isVideo"];
                    string locoVersion = context.Request["locoVersion"];
                    rs = GetLocomoiveTree(isVideo, locoVersion);
                    break;
                case "LOCOMOTIVE_VERSION":
                    rs = GetLocomoiveTree();
                    break;
                case "ORGANIZATION":  //在线实时监控 左上角的树
                    rs = GetOrganizationTree();
                    break;
                case "ORGANIZATIONOTHER":
                    rs = GetOrganizationTreeOther();
                    break;
                case "ORGANIZATION_J": //局-树
                    rs = GetOrganizationJTree();
                    break;
                case "ORGANIZATION_JUNIORBUREAU":
                    rs = GetOrganizationTree_BureauJunior();//获取局的下一级组织机构
                    break;
                case "USER":
                    rs = GetUserTree();
                    break;
                case "KMSTATION":
                    rs = GetLineTree(tag);
                    break;
                case "LINE":
                case "STATIONSECTION":
                case "BRIDGETUNE":
                    rs = GetLineTree(tag);
                    break;
                case "SYSDICTIONARYTREE":
                    string codeType = context.Request["codeType"];
                    string cateGory = context.Request["cateGory"];
                    string p_code = context.Request["p_code"];
                    rs = GetSysDictionaryTree(codeType, cateGory, p_code);
                    break;
                case "GETDEFECTMARK":
                    rs = GetSysDictionaryTree_DefectMark(context);
                    break;
                case "GETSYSDICTIONARY_LEVEL2"://从字典里，取两级内容。
                    rs = GetSysDictionary_Level2();
                    break;
                case "FUNMENU":
                    string category = context.Request["category"];
                    rs = GetFunMenuTree(category);
                    break;
                case "SUBSTATION":
                case "SUBSTATIONMONITORAREA":
                    rs = GetSubStationTree(tag);
                    break;
                case "POWERLOCOMOTIVE":
                    string IsVideo = context.Request["isVideo"];
                    string LocoVersion = context.Request["locoVersion"];
                    rs = PowerGetLocomoiveTree(IsVideo, LocoVersion);
                    break;
                case "ALLPOWERLOCOMOTIVE":
                    rs = AllPowerGetLocomoiveTree();
                    break;
                case "LINE_FILTER":
                    string linecode = context.Request["codeType"];
                    string is_only_section = context.Request["is_only_section"];
                    rs = LineFilter(linecode, tag, is_only_section);
                    break;
                case "LINE_ONLY_BRIDGE":
                    string sectioncode = context.Request["codeType"];
                    rs = GetSysDictionaryTree_brifge(sectioncode, tag);
                    break;
                case "LINE_ONLY_POSITION":
                    string codetype = context.Request["codeType"];
                    rs = GetSysDictionaryTree_station(codetype, tag);
                    break;
                case "SYSDIC_AFTOPO"://取缺陷部位
                    rs = GetSysDic_AFTOPO();
                    break;
                case "SUBSTATIONBYORG":
                    string code = context.Request["code"];
                    rs = GetSubStationSelectByOrg(code);
                    break;
                case "POSITION_STAGE":
                    string line_code = context.Request["line_code"];
                    rs = GetPositionStageTree(tag, line_code);
                    break;
                case "POSITION_BYLINECODE":
                    rs = GetPositionTree(context);
                    break;
                case "BRIDGETUNE_BYLINECODE":
                    rs = GetBridgetunetree(context);
                    break;

                //行别
                case "GET_DRECTION":
                    rs = GetSysDictionaryTree_DRECTION(context);
                    break;
                //解析服务自动取消
                case "GET_ANALYTICAL_CANCELLED":
                    rs = GetSysDictionaryTree_ANALYTICAL(context);
                    break;
                //样本库
                case "GET_SAMPLE_LIBRARY":
                    rs = GetSysDictionaryTree_LIBRARY(context);
                    break;
                //报警判断依据
                case "CRITERION":
                    rs = GetCriterion(context);
                    break;

            }
        }
        catch (Exception ex)
        {
            log4net.ILog log2 = log4net.LogManager.GetLogger("GetTrees");
            log2.Error("GetTrees", ex);

            rs = "-1";
        }
        finally
        {

            rs = myfiter.json_RemoveSpecialStr(rs);

            context.Response.ContentType = "text/plain";
            HttpContext.Current.Response.Write(rs);

        }
    }




    /// <summary>
    /// 铁路总公司编码
    /// </summary>
    private string ORG_TYPE_TZ = "TOPBOSS";

    /// <summary>
    /// 局类型编码
    /// </summary>
    private string ORG_TYPE_JU = "J";

    /// <summary>
    /// 供电段类型编码
    /// </summary>
    private string ORG_TYPE_GDD = "GDD";


    /// <summary>
    /// 是否支持直播
    /// </summary>
    private string IS_VIDEO = "1";



    /// <summary>
    /// 不包含设备版本
    /// </summary>
    private string DEVICE_VERSION = "PS3";

    /// <summary>
    /// 机车型号字典父编码
    /// </summary>
    private string LOCOMOTIVE_VERSION = "C3VERSION";

    /// <summary>
    /// 获取设备Tree
    /// </summary>
    /// <param name="isVideo">是否支持直播</param>
    /// <param name="loco_version">版本号</param>
    /// <returns></returns>
    private string GetLocomoiveTree(string isVideo, string loco_version)
    {
        StringBuilder Json = new StringBuilder();
        Json.Append("[");

        List<string> Myorglist = Api.Util.Public.GetDatapermisson_orgCode();

        var btlist = from n in Api.Util.Common.organizationDic.Values
                     where n.ORG_TYPE == ORG_TYPE_JU
                     //     && ( Myorglist.Count==0 || Myorglist.Contains(n.ORG_CODE))
                     orderby n.ORG_ORDER
                     select n;



        IList<Organization> bureauList = btlist.ToList<Organization>();

        foreach (Organization bureau in bureauList)
        {
            if (!Api.Util.Public.IsHavePermisson_orgCode_BUREAU(bureau.ORG_CODE))
            {
                continue;
            }


            Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"0\",\"name\":\"{1}\",\"treeType\":\"BUREAU\"}},", bureau.ORG_CODE, bureau.ORG_NAME);
            var orgIE = from n in Api.Util.Common.organizationDic.Values
                        where n.SUP_ORG_CODE == bureau.ORG_CODE
                        //   && ( Myorglist.Count==0 || Myorglist.Contains(n.ORG_CODE))
                        //   && n.ORG_CODE.Contains()
                        orderby n.ORG_TYPE
                        select n;




            IList<Organization> orgList = orgIE.ToList<Organization>();



            foreach (Organization org in orgList)
            {
                if (!Api.Util.Public.IsAdmin())
                {

                    if (!Api.Util.Public.IsHavePermisson_orgCode(org.ORG_CODE) || Api.Util.Public.IsPowerSectionUser() && !Api.Util.Public.IsPowerSectionOrg(org.ORG_TYPE) || !Api.Util.Public.IsPowerSectionUser() && Api.Util.Public.IsPowerSectionOrg(org.ORG_TYPE))
                    {
                        //没有此权限  过滤掉    登录的是供电用户，此组织机构不是供电相关组织机构 也过滤。  登录的不是供电用户，此组织又是供电相关的 过滤掉
                        continue;
                    }
                }

                Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"treeType\":\"ORG\"}},", org.ORG_CODE, bureau.ORG_CODE, org.ORG_NAME);



                //增加对设备版本的判断，用于视频直播时筛选设备列表
                bool isFilter = !String.IsNullOrEmpty(loco_version) && loco_version != "undefined" & loco_version != "0";
                var locIE = from n in Api.Util.Common.locomotiveDic.Values
                            where (n.P_ORG_CODE == org.ORG_CODE || n.ORG_CODE == org.ORG_CODE)
                            && (isVideo == IS_VIDEO ? n.DEVICE_VERSION != DEVICE_VERSION : 1 == 1)
                            && ((!String.IsNullOrEmpty(loco_version) && loco_version != "undefined" && loco_version != "0") ? n.DEVICE_VERSION == loco_version : 1 == 1)
                            select n;


                IList<Locomotive> locomotiveList = locIE.ToList<Locomotive>();

                if (locomotiveList != null && locomotiveList.Count > 0)
                {

                    foreach (Locomotive l in locomotiveList)
                    {
                        Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"relations\":\"{3}\",\"treeType\":\"LOCOMOTIVE\"}},", l.LOCOMOTIVE_CODE, org.ORG_CODE, l.LOCOMOTIVE_CODE, l.DEVICE_BOW_RELATIONS);
                    }
                }
            }
        }
        string re = myfiter.json_RemoveSpecialStr(Json.ToString().TrimEnd(',') + "]");

        return re;
    }
    /// <summary>
    /// 获取过滤供电段设备Tree
    /// </summary>
    /// <param name="isVideo">是否支持直播</param>
    /// <param name="loco_version">版本号</param>
    /// <returns></returns>
    private string PowerGetLocomoiveTree(string IsVideo, string Loco_version)
    {
        StringBuilder Json = new StringBuilder();
        Json.Append("[");

        List<string> Myorglist = Api.Util.Public.GetDatapermisson_orgCode();

        //增加对设备版本的判断，用于视频直播时筛选设备列表
        bool isFilter = !String.IsNullOrEmpty(Loco_version) && Loco_version != "undefined" & Loco_version != "0";
        var locIE = from n in Api.Util.Common.locomotiveDic.Values
                    where (n.ORG_CODE.IndexOf(Api.Util.Public.GetDeptCode) != -1) && (IsVideo == IS_VIDEO ? n.DEVICE_VERSION != DEVICE_VERSION : 1 == 1)
                    && ((!String.IsNullOrEmpty(Loco_version) && Loco_version != "undefined" && Loco_version != "0") ? n.DEVICE_VERSION == Loco_version : 1 == 1)
                    select n;


        IList<Locomotive> locomotiveList = locIE.ToList<Locomotive>();

        //Api.Util.Public.GetDeptCode
        if (locomotiveList != null && locomotiveList.Count > 0)
        {

            foreach (Locomotive l in locomotiveList)
            {
                Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"relations\":\"{3}\",\"treeType\":\"LOCOMOTIVE\"}},", l.ORG_NAME, l.ORG_CODE, l.LOCOMOTIVE_CODE, l.DEVICE_BOW_RELATIONS);
            }
        }
        else
        {
            Json.AppendFormat("]");
        }
        return Json.ToString().TrimEnd(',') + "]";
    }
    /// <summary>
    /// 获取全部供电段设备Tree
    /// </summary>
    /// <param name="isVideo">是否支持直播</param>
    /// <param name="loco_version">版本号</param>
    /// <returns></returns>
    private string AllPowerGetLocomoiveTree()
    {
        StringBuilder Json = new StringBuilder();
        Json.Append("[");

        List<string> Myorglist = Api.Util.Public.GetDatapermisson_orgCode();
        var btlist = from n in Api.Util.Common.organizationDic.Values
                     where n.ORG_TYPE == ORG_TYPE_JU
                     //     && ( Myorglist.Count==0 || Myorglist.Contains(n.ORG_CODE))
                     orderby n.ORG_ORDER
                     select n;



        IList<Organization> bureauList = btlist.ToList<Organization>();

        foreach (Organization bureau in bureauList)
        {
            if (!Api.Util.Public.IsHavePermisson_orgCode_BUREAU(bureau.ORG_CODE))
            {
                continue;
            }


            Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"0\",\"name\":\"{1}\",\"treeType\":\"BUREAU\"}},", bureau.ORG_CODE, bureau.ORG_NAME);
            var orgIE = from n in Api.Util.Common.organizationDic.Values
                        where n.SUP_ORG_CODE == bureau.ORG_CODE
                        //   && ( Myorglist.Count==0 || Myorglist.Contains(n.ORG_CODE))
                        //   && n.ORG_CODE.Contains()
                        orderby n.ORG_ORDER
                        select n;




            IList<Organization> orgList = orgIE.ToList<Organization>();



            foreach (Organization org in orgList)
            {
                if (!Api.Util.Public.IsHavePermisson_orgCode_BUREAU(org.ORG_CODE) || !Api.Util.Public.IsPowerSectionOrg(org.ORG_TYPE))
                {
                    continue;
                }

                Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"treeType\":\"ORG\"}},", org.ORG_CODE, bureau.ORG_CODE, org.ORG_NAME);

                //增加对设备版本的判断，用于视频直播时筛选设备列表
                //bool isFilter = !String.IsNullOrEmpty(Loco_version) && Loco_version != "undefined" & Loco_version != "0";
                var locIE = from n in Api.Util.Common.locomotiveDic.Values
                            where n.ORG_CODE == org.ORG_CODE && (n.ORG_CODE.IndexOf(Api.Util.Public.GetDeptCode) != -1)
                            select n;

                IList<Locomotive> locomotiveList = locIE.ToList<Locomotive>();

                if (locomotiveList != null && locomotiveList.Count > 0)
                {

                    foreach (Locomotive l in locomotiveList)
                    {
                        Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"relations\":\"{3}\",\"treeType\":\"LOCOMOTIVE\"}},", l.LOCOMOTIVE_CODE, org.ORG_CODE, l.LOCOMOTIVE_CODE, l.DEVICE_BOW_RELATIONS);
                    }
                }
            }
        }
        return Json.ToString().TrimEnd(',') + "]";
    }
    /// <summary>
    /// 获取设备Tree(机车型号--机车)
    /// </summary>
    /// <returns></returns>
    private string GetLocomoiveTree()
    {
        StringBuilder Json = new StringBuilder();
        SysDictionaryCond cond = new SysDictionaryCond();
        cond.P_CODE = LOCOMOTIVE_VERSION;
        IList<SysDictionary> list = Api.ServiceAccessor.GetFoundationService().querySysDictionary(cond);
        Json.Append("[");
        foreach (SysDictionary m in list)
        {
            Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"treeType\":\"{3}\"}},", m.DIC_CODE, m.P_CODE, m.CODE_NAME, "DEVICE_VERSION");

            //  List<string> Myorglist = Api.Util.Public.GetDatapermisson_orgCode();

            var locIE = from n in Api.Util.Common.locomotiveDic.Values
                        where n.DEVICE_VERSION == m.DIC_CODE
                        select n;
            IList<Locomotive> locomotiveList = locIE.ToList<Locomotive>();
            foreach (Locomotive l in locomotiveList)
            {

                if (!Api.Util.Public.IsHavePermisson_orgCode(l.P_ORG_CODE))
                {
                    continue;
                }

                Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"treeType\":\"{3}\"}},", l.LOCOMOTIVE_CODE, m.DIC_CODE, l.LOCOMOTIVE_CODE, "LOCOMOTIVE");
            }
        }
        return Json.ToString().TrimEnd(',') + "]";
    }

    /// <summary>
    /// 获取组织机构Tree
    /// </summary>
    /// <returns></returns>
    private string GetOrganizationTree()
    {
        StringBuilder Json = new StringBuilder();
        Json.Append("[");
        var btlist = from n in Api.Util.Common.organizationDic.Values
                     orderby n.ORG_ORDER
                     select n;

        IList<Organization> orgList = btlist.ToList<Organization>();

        foreach (Organization org in orgList)
        {
            if (!Api.Util.Public.IsAdmin())
            {
                if (org.ORG_TYPE == "J")
                {
                    //局级只权限过滤。
                    if (!Api.Util.Public.IsHavePermisson_orgCode_BUREAU(org.ORG_CODE))
                    {
                        continue;
                    }

                }
                else
                {
                    if (!Api.Util.Public.IsHavePermisson_orgCode_BUREAU(org.ORG_CODE) || Api.Util.Public.IsPowerSectionUser() && (!Api.Util.Public.IsPowerSectionOrg(org.ORG_TYPE)) || !Api.Util.Public.IsPowerSectionUser() && Api.Util.Public.IsPowerSectionOrg(org.ORG_TYPE))
                    {
                        //没有此权限  过滤掉    登录的是供电用户，此组织机构不是供电相关组织机构 也过滤。  登录的不是供电用户，此组织又是供电相关的 过滤掉
                        continue;
                    }
                }
            }

            Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"treeType\":\"{3}\"}},", org.ORG_CODE, org.SUP_ORG_CODE, org.ORG_NAME, org.ORG_TYPE);
        }
        return Json.ToString().TrimEnd(',') + "]";

    }
    /// <summary>
    /// 获取组织机构Tree(不过滤数据)
    /// </summary>
    /// <returns></returns>
    private string GetOrganizationTreeOther()
    {
        StringBuilder Json = new StringBuilder();
        Json.Append("[");
        var btlist = from n in Api.Util.Common.organizationDic.Values
                     orderby n.ORG_ORDER
                     select n;

        IList<Organization> orgList = btlist.ToList<Organization>();

        foreach (Organization org in orgList)
        {
            Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"treeType\":\"{3}\"}},", org.ORG_CODE, org.SUP_ORG_CODE, org.ORG_NAME, org.ORG_TYPE);
        }
        return Json.ToString().TrimEnd(',') + "]";

    }
    /// <summary>
    /// 获取组织机构Tree
    /// </summary>
    /// <returns></returns>
    private string GetOrganizationJTree()
    {
        StringBuilder Json = new StringBuilder();
        Json.Append("[");
        var btlist = from n in Api.Util.Common.organizationDic.Values
                     where n.ORG_TYPE == ORG_TYPE_TZ || n.ORG_TYPE == ORG_TYPE_JU
                     orderby n.ORG_ORDER
                     select n;

        IList<Organization> orgList = btlist.ToList<Organization>();

        foreach (Organization org in orgList)
        {
            Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"treeType\":\"ORG\"}},", org.ORG_CODE, org.SUP_ORG_CODE, org.ORG_NAME);
        }
        return Json.ToString().TrimEnd(',') + "]";

    }
    /// <summary>
    /// 获取组织机构Tree（只取局的下一级）
    /// </summary>
    /// <returns></returns>
    private string GetOrganizationTree_BureauJunior()
    {
        string action = HttpContext.Current.Request["action"];//只保留一层供电段信息
        string bureau = HttpContext.Current.Request["codeType"];//上一级编码
        StringBuilder Json = new StringBuilder();
        Json.Append("[");
        var btlist = from n in Api.Util.Common.organizationDic.Values
                     where n.ORG_TYPE == "J"
                     orderby n.ORG_ORDER
                     select n;
        if (!string.IsNullOrEmpty(bureau))
        {
            btlist = from n in Api.Util.Common.organizationDic.Values
                     where n.ORG_CODE == bureau
                     orderby n.ORG_ORDER
                     select n;
        }
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
                Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"treeType\":\"{3}\"}},", _org.ORG_CODE, _org.SUP_ORG_CODE, _org.ORG_NAME, _org.ORG_TYPE);
            }
        }
        return Json.ToString().TrimEnd(',') + "]";
    }

    /// <summary>
    /// 获取用户Tree
    /// </summary>
    /// <returns></returns>
    private string GetUserTree()
    {
        StringBuilder Json = new StringBuilder();
        Json.Append("[");
        var btlist = from n in Api.Util.Common.organizationDic.Values
                     orderby n.ORG_ORDER
                     select n;

        IList<Organization> orglist = btlist.ToList<Organization>();

        foreach (Organization org in orglist)
        {
            Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"icon\":\"/Common/img/org.png\",\"treeType\":\"ORG\"}},", org.ORG_CODE, org.SUP_ORG_CODE, org.ORG_NAME);
            UserCond userCond = new UserCond();
            userCond.ORG_CODE = org.ORG_CODE;
            IList<User> userList = Api.ServiceAccessor.GetFoundationService().queryUserBy(userCond);
            foreach (User u in userList)
            {
                Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"icon\":\"/Common/img/person.png\",\"treeType\":\"USER\"}},", u.USER_CODE, u.ORG_CODE, u.PER_NAME);
            }
        }

        return Json.ToString().TrimEnd(',') + "]";
    }

    /// <summary>
    /// 获取线路Tree
    /// </summary>
    /// <param name="tag"></param>
    /// <returns></returns>
    //private string GetLineTree(string tag)
    //{
    //    System.Text.StringBuilder Json = new System.Text.StringBuilder();
    //    Json.Append("[");
    //    var linelist = from n in Api.Util.Common.lineDic.Values
    //                   where n.IS_SHOW == "1"
    //                   orderby n.LINE_NAME
    //                   select n;
    //    IList<Line> lineList = linelist.ToList<Line>();
    //    foreach (Line line in lineList)
    //    {
    //        var poslist = from n in Api.Util.Common.stationSectionDic.Values
    //                      where n.LINE_CODE == line.LINE_CODE
    //                      orderby n.POSITION_ORDER
    //                      select n;
    //        IList<StationSection> stationList = poslist.ToList<StationSection>();

    //        if (!Api.Util.Public.IsHavePermisson_orgCode_BUREAU(line.BUREAU_CODE))
    //        {
    //            continue;
    //        }



    //        Json.AppendFormat("{{id:\"{0}\",pId:\"0\",name:\"{1}\",treeType:'LINE'}},", line.LINE_CODE, line.LINE_NAME);

    //        if (tag == "BRIDGETUNE" || tag == "STATIONSECTION")
    //        {
    //            if (stationList != null && stationList.Count > 0)
    //            {
    //                foreach (StationSection station in stationList)
    //                {

    //                    if (!Api.Util.Public.IsHavePermisson_orgCode_BUREAU(station.POWER_SECTION_CODE))   //供电段条件筛选。
    //                    {
    //                        continue;
    //                    }
    //                    Json.AppendFormat("{{id:\"{0}\",pId:\"{1}\",name:\"{2}\",treeType:'POSITION'}},", station.POSITION_CODE, line.LINE_CODE, station.POSITION_NAME);

    //                    if (tag == "BRIDGETUNE")
    //                    {
    //                        var btlist = from n in Api.Util.Common.bridgeTuneDic.Values
    //                                     where n.POSITION_CODE == station.POSITION_CODE
    //                                     orderby n.BRG_TUN_ORDER
    //                                     select n;

    //                        IList<BridgeTune> bridgeTuneList = btlist.ToList<BridgeTune>();

    //                        foreach (BridgeTune bt in bridgeTuneList)
    //                        {
    //                            Json.AppendFormat("{{id:\"{0}\",pId:\"{1}\",name:\"{2}\",treeType:'BRIDGETUNE'}},", bt.BRG_TUN_CODE, bt.POSITION_CODE, bt.BRG_TUN_NAME);
    //                        }
    //                    }
    //                }
    //            }
    //        }
    //    }
    //    return myfiter.json_RemoveSpecialStr(Json.ToString().Substring(0, Json.Length - 1) + "]");
    //}


    ///// <summary>
    ///// 获取线路Tree
    ///// </summary>
    ///// <param name="tag"></param>
    ///// <returns></returns>
    //private string GetLineTree(string tag)
    //{
    //    System.Text.StringBuilder Json = new System.Text.StringBuilder();
    //    Json.Append("["); 
    //        var poslist = from n in Api.Util.Common.stationSectionDic.Values
    //                      where n.ORG_CODE!=null && n.ORG_CODE.Contains(Api.Util.Public.GetDeptCode) 
    //                      orderby n.POSITION_ORDER
    //                      select n;


    //        IList<StationSection> stationList = poslist.ToList<StationSection>();

    //        List<string> add_lines = new List<string>();

    //        foreach (StationSection line in poslist)
    //        {
    //            if (!Api.Util.Public.IsHavePermisson_orgCode_BUREAU(line.BUREAU_CODE))
    //            {
    //                continue;
    //            }

    //            if (!add_lines.Contains(line.LINE_CODE))
    //            {
    //                Json.AppendFormat("{{id:\"{0}\",pId:\"0\",name:\"{1}\",treeType:'LINE'}},", line.LINE_CODE, line.LINE_NAME);
    //                add_lines.Add(line.LINE_CODE);  

    //                if (tag == "BRIDGETUNE" || tag == "STATIONSECTION")
    //                {
    //                    if (stationList != null && stationList.Count > 0)
    //                    {
    //                        foreach (StationSection station in stationList)
    //                        {

    //                            if (!Api.Util.Public.IsHavePermisson_orgCode_BUREAU(station.POWER_SECTION_CODE))   //供电段条件筛选。
    //                            {
    //                                continue;
    //                            }
    //                            if (line.LINE_CODE == station.LINE_CODE) { 
    //                                Json.AppendFormat("{{id:\"{0}\",pId:\"{1}\",name:\"{2}\",treeType:'POSITION'}},", station.POSITION_CODE, line.LINE_CODE, station.POSITION_NAME);
    //                            }
    //                            if (tag == "BRIDGETUNE")
    //                            {
    //                                var btlist = from n in Api.Util.Common.bridgeTuneDic.Values
    //                                             where n.POSITION_CODE == station.POSITION_CODE
    //                                             orderby n.BRG_TUN_ORDER
    //                                             select n;

    //                                IList<BridgeTune> bridgeTuneList = btlist.ToList<BridgeTune>();

    //                                foreach (BridgeTune bt in bridgeTuneList)
    //                                {
    //                                    Json.AppendFormat("{{id:\"{0}\",pId:\"{1}\",name:\"{2}\",treeType:'BRIDGETUNE'}},", bt.BRG_TUN_CODE, bt.POSITION_CODE, bt.BRG_TUN_NAME);
    //                                }
    //                            }
    //                        }
    //                    }
    //                }
    //            }
    //        }
    //    return myfiter.json_RemoveSpecialStr(Json.ToString().Substring(0, Json.Length - 1) + "]");
    //}
    /// <summary>
    /// 获取线路Tree
    /// </summary>
    /// <param name="tag"></param>
    /// <returns></returns>
    private string GetPositionStageTree(string tag, string line_code)
    {
        StringBuilder Json = new StringBuilder();
        Json.Append("[");
        var btlist = from n in Api.Util.Common.stationSectionDic.Values
                     where n.POSITION_TYPE == "S"
                     select n;
        if (!string.IsNullOrEmpty(line_code))
        {
            btlist = from n in btlist
                     where n.LINE_CODE == line_code
                     select n;
        }

        IList<StationSection> orgList = btlist.ToList<StationSection>();

        foreach (StationSection org in orgList)
        {
            Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"treeType\":\"{3}\"}},", org.POSITION_CODE, "", org.POSITION_NAME, "");
        }
        return Json.ToString().TrimEnd(',') + "]";
    }

    private string GetPositionTree(HttpContext context)
    {
        string lineCode = "$";
        if (!string.IsNullOrEmpty(context.Request["lineCode"]))
            lineCode = context.Request["lineCode"];

        StringBuilder Json = new StringBuilder();
        Json.Append("[");
        var btlist = from n in Api.Util.Common.stationSectionDic.Values
                     where n.LINE_CODE == lineCode
                     select n;

        IList<StationSection> orgList = btlist.ToList<StationSection>();

        foreach (StationSection org in orgList)
        {
            Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"treeType\":\"{3}\"}},", org.POSITION_CODE, "", org.POSITION_NAME, "");
        }
        return Json.ToString().TrimEnd(',') + "]";
    }

    private string GetBridgetunetree(HttpContext context)
    {
        string positionCode = "$";
        if (!string.IsNullOrEmpty(context.Request["positionCode"]))
            positionCode = context.Request["positionCode"];


        StringBuilder Json = new StringBuilder();

        Json.Append("[");

        var lis = from n in Api.Util.Common.bridgeTuneDic.Values
                  where n.POSITION_CODE == positionCode
                  orderby n.BRG_TUN_ORDER
                  select n;

        IList<BridgeTune> bridgeTuneList = lis.ToList<BridgeTune>();
        if (bridgeTuneList.Count > 0)
        {
            foreach (BridgeTune bt in bridgeTuneList)
            {
                Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"treeType\":\"BRIDGETUNE\",\"nocheck\":true}},", bt.BRG_TUN_CODE, bt.POSITION_CODE, bt.BRG_TUN_NAME);
            }
        }
        else
            Json.Append("{},");

        return Json.ToString().TrimEnd(',') + "]";
    }


    /// <summary>
    /// 获取线路Tree
    /// </summary>
    /// <param name="tag"></param>
    /// <returns></returns>
    private string GetLineTree(string tag)
    {
        string action = HttpContext.Current.Request["action"];//乌局问题库开关,问题库车间用户取自己段的
        System.Text.StringBuilder Json = new System.Text.StringBuilder();
        string bureau = HttpContext.Current.Request["codeType"];//局编码

        Json.Append("[");

        IList<Line> linelist;


        if (Api.Util.Public.IsPowerSectionUser())
        {
            if (action == "Problem")
            {
                var poslinelist = from n in Api.Util.Common.lineDic.Values
                                  where n.ORG_CODE != null && Api.Util.Public.IsHavePer_WJorgCode(n.ORG_CODE)
                                  orderby n.LINE_NO
                                  select n;

                linelist = poslinelist.ToList<Line>();
            }
            else
            {
                var poslinelist = from n in Api.Util.Common.lineDic.Values
                                  where n.ORG_CODE != null && Api.Util.Public.IsHavePermisson_orgCode(n.ORG_CODE)
                                  orderby n.LINE_NO
                                  select n;

                linelist = poslinelist.ToList<Line>();
            }
        }
        else
        {
            //车辆用户，不筛选线路。

            var poslinelist = from n in Api.Util.Common.lineDic.Values
                                  //  where n.ORG_CODE != null && Api.Util.Public.IsHavePermisson_orgCode(n.ORG_CODE)
                              orderby n.LINE_NO
                              select n;

            linelist = poslinelist.ToList<Line>();

        }
        if (!string.IsNullOrEmpty(bureau))
        {
            var poslinelist = from n in Api.Util.Common.lineDic.Values
                              where n.BUREAU_CODE == bureau
                              orderby n.LINE_NO
                              select n;

            linelist = poslinelist.ToList<Line>();
        }


        if (linelist.Count > 0)
        {
            foreach (Line line in linelist)
            {
                if (string.IsNullOrEmpty(line.ORG_CODE))
                {
                    continue;
                }
                Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"0\",\"name\":\"{1}\",\"treeType\":\"LINE\",\"org\":\"{2}\"}},", line.LINE_CODE, line.LINE_NAME, line.ORG_CODE);
                IList<StationSection> stationList;
                if (Api.Util.Public.IsPowerSectionUser())
                {
                    var poslist = from n in Api.Util.Common.stationSectionDic.Values
                                  where n.ORG_CODE != null && Api.Util.Public.IsHavePermisson_orgCode(n.ORG_CODE) && n.LINE_CODE == line.LINE_CODE //&& string.IsNullOrEmpty(Api.Util.Public.GetUser_PermissionOrg) ? true : n.ORG_CODE.Contains(Api.Util.Public.GetUser_PermissionOrg)
                                  orderby n.POSITION_ORDER
                                  select n;
                    stationList = poslist.ToList<StationSection>();
                }
                else
                {
                    //车辆用户，不筛选区站。                  
                    var poslist = from n in Api.Util.Common.stationSectionDic.Values
                                  where n.LINE_CODE == line.LINE_CODE //&& string.IsNullOrEmpty(Api.Util.Public.GetUser_PermissionOrg) ? true : n.ORG_CODE.Contains(Api.Util.Public.GetUser_PermissionOrg)
                                  orderby n.POSITION_ORDER
                                  select n;
                    stationList = poslist.ToList<StationSection>();
                }

                foreach (StationSection station in stationList)
                {
                    if (tag == "BRIDGETUNE" || tag == "STATIONSECTION")
                    {
                        if (stationList != null && stationList.Count > 0)
                        {
                            if (Api.Util.Public.IsPowerSectionUser() && !Api.Util.Public.IsHavePermisson_orgCode_BUREAU(station.POWER_SECTION_CODE))   //供电段条件筛选。
                            {
                                continue;
                            }
                            Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"treeType\":\"POSITION\",\"nocheck\":true}},", station.POSITION_CODE, station.LINE_CODE, station.POSITION_NAME);
                            if (tag == "BRIDGETUNE")
                            {
                                var btlist = from n in Api.Util.Common.bridgeTuneDic.Values
                                             where n.POSITION_CODE == station.POSITION_CODE
                                             orderby n.BRG_TUN_ORDER
                                             select n;

                                IList<BridgeTune> bridgeTuneList = btlist.ToList<BridgeTune>();

                                foreach (BridgeTune bt in bridgeTuneList)
                                {
                                    Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"treeType\":\"BRIDGETUNE\",\"nocheck\":true}},", bt.BRG_TUN_CODE, bt.POSITION_CODE, bt.BRG_TUN_NAME);
                                }
                            }

                        }
                    }
                    else if (tag == "KMSTATION")//公里标计算中筛选站点，即不包括区站 jlx
                    {
                        var btlist = from n in Api.Util.Common.stationSectionDic.Values
                                     where n.POSITION_CODE == station.POSITION_CODE && (n.POSITION_TYPE == "S") && (!n.POSITION_NAME.Contains("－")) && (!n.POSITION_NAME.Contains("-"))
                                     orderby n.POSITION_ORDER
                                     select n;
                        IList<StationSection> statLi = btlist.ToList<StationSection>();

                        foreach (StationSection bt in statLi)
                        {
                            Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"treeType\":\"POSITION\"}},", station.POSITION_CODE, station.LINE_CODE, station.POSITION_NAME);
                        }
                    }

                }
            }
        }
        else
        {
            Json.Append("]");
        }
        return myfiter.json_RemoveSpecialStr(Json.ToString().TrimEnd(',') + "]");
    }


    /// <summary>
    /// 字典树
    /// </summary>
    /// <param name="codeType">缺陷分类</param>
    /// <param name="cateGory">字典类型</param>
    /// <returns></returns>
    public string GetSysDictionaryTree(String codeType, String cateGory, string p_code)
    {
        StringBuilder Json = new StringBuilder();
        SysDictionaryCond cond = new SysDictionaryCond();
        if (!String.IsNullOrEmpty(cateGory))
            cond.CATEGORY = cateGory;
        if (!String.IsNullOrEmpty(codeType) && "DPC" != codeType)
        {
            cond.CODE_TYPE = codeType;
        }
        //IList<SysDictionary> list = Api.ServiceAccessor.GetFoundationService().querySysDictionary(cond);
        SysDictionary[] sd = Api.Util.Common.sysDictionaryDic.Values.ToArray();
        IList<SysDictionary> list;
        if (String.IsNullOrEmpty(cateGory) || String.IsNullOrEmpty(codeType))
        {
            list = sd.ToArray();
        }
        else
        {
            //list = (from l in sd where l.CATEGORY == cateGory && l.CODE_TYPE.Contains(codeType) select l).ToArray();
            list = (from n in sd
                    where (n.CATEGORY != null && n.CATEGORY == cateGory)
                    && (n.CODE_TYPE != null && n.CODE_TYPE.Contains(codeType))
                    orderby n.SHOW_PRIORITY ascending
                    select n).ToArray();

            if (!string.IsNullOrEmpty(p_code))
            {
                list = (from n in sd
                        where n.P_CODE == p_code
                        orderby n.SHOW_PRIORITY ascending
                        select n).ToArray();
            }
        }
        Json.Append("[");
        foreach (SysDictionary m in list)
        {
            string pCode = m.P_CODE;
            if (String.IsNullOrEmpty(m.P_CODE)) { pCode = "0"; }
            Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\"}},", m.DIC_CODE, pCode, m.CODE_NAME);
        }
        return Json.ToString().TrimEnd(',') + "]";
    }


    public string GetSysDictionaryTree_DefectMark(HttpContext context)
    {
        string codeType = context.Request["codeType"];
        string cateGory = context.Request["cateGory"];
        StringBuilder Json = new StringBuilder();
        SysDictionaryCond cond = new SysDictionaryCond();
        if (!String.IsNullOrEmpty(cateGory))
            cond.P_CODE = cateGory;
        if (!String.IsNullOrEmpty(codeType) && "DPC" != codeType)
        {
            cond.CODE_TYPE = codeType;
        }
        IList<SysDictionary> list = Api.ServiceAccessor.GetFoundationService().querySysDictionary(cond);
        Json.Append("[");
        foreach (SysDictionary m in list)
        {
            string pCode = m.P_CODE;
            if (String.IsNullOrEmpty(m.P_CODE)) { pCode = "0"; }
            if (m.P_CODE == "AFLG")
            {
                Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"nocheck\":true}},", m.DIC_CODE, pCode, m.CODE_NAME);
            }
            else
            {
                Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\"}},", m.DIC_CODE, pCode, m.CODE_NAME);
            }
            SysDictionaryCond mark = new SysDictionaryCond();
            if (!String.IsNullOrEmpty(m.DIC_CODE))
                mark.P_CODE = m.DIC_CODE;
            if (!String.IsNullOrEmpty(codeType) && "DPC" != codeType)
            {
                mark.CODE_TYPE = codeType;
            }
            IList<SysDictionary> mark_list = Api.ServiceAccessor.GetFoundationService().querySysDictionary(mark);
            foreach (SysDictionary y in mark_list)
            {
                Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\"}},", y.DIC_CODE, m.DIC_CODE, y.CODE_NAME);
            }
        }
        return Json.ToString().TrimEnd(',') + "]";
    }

    public string GetSysDictionary_Level2()
    {
        StringBuilder html = new StringBuilder();

        string codeType = System.Web.HttpContext.Current.Request["codeType"];
        string cateGory = System.Web.HttpContext.Current.Request["cateGory"];


        //一级列表
        var btlist = from n in Api.Util.Common.sysDictionaryDic.Values
                     where n.P_CODE == cateGory
                     orderby n.SHOW_PRIORITY
                     select n;


        foreach (SysDictionary m1 in btlist)
        {
            if (!m1.CODE_TYPE.Contains(codeType) && "DPC" != codeType)
                continue;

            html.AppendFormat("<div class='typebg'><div class='type1'><a code='{1}' class='btn btn-mini btn-primary' href='javascript:void(0)'>{0}</a></div>", m1.CODE_NAME, m1.DIC_CODE);

            var btlist2 = from n in Api.Util.Common.sysDictionaryDic.Values
                          where n.P_CODE == m1.DIC_CODE
                          orderby n.SHOW_PRIORITY
                          select n;


            html.AppendFormat("<div class='type2'>");

            foreach (SysDictionary m2 in btlist2)
            {
                if (!m2.CODE_TYPE.Contains(codeType) && "DPC" != codeType)
                    continue;

                html.AppendFormat("<a code='{1}' href='javascript:void(0)'>{0}</a>", m2.CODE_NAME, m2.DIC_CODE);
            }

            html.AppendFormat("</div>");
            html.AppendFormat("<div class='cls'></div></div>");
        }


        return html.ToString();
    }

    /// <summary>
    /// 获取组织机构下的变电所设备监控树
    /// </summary>
    /// <returns></returns>
    public string GetSubStationTree(string tag, bool withPreset = true)
    {
        string mnt_sql = "select * from mis_subst_mnt";
        DataSet dsData = DbHelperOra.Query(mnt_sql);
        StringBuilder Json = new StringBuilder();
        Json.Append("[");
        var objOrgList = from n in Api.Util.Common.organizationDic.Values
                         where (n.ORG_TYPE == ORG_TYPE_JU || n.ORG_TYPE == ORG_TYPE_GDD)
                         select n;
        IList<Organization> orgList = objOrgList.ToList<Organization>();
        List<string> JU = new List<string>();
        if (!withPreset)
        {
            foreach (Organization organization in orgList)
            {

                if (ORG_TYPE_GDD == organization.ORG_TYPE)
                {
                    var objSubStationList0 = from n in Api.Util.Common.substationDic.Values
                                             where n.POWER_SECTION_CODE == organization.ORG_CODE
                                             && n.SUBSTATION_TYPE == "变电所"
                                             select n;
                    var subStationlist = objSubStationList0.Where(m => !string.IsNullOrEmpty(m.DEV_URL));
                    List<Substation> count = subStationlist.ToList<Substation>();
                    if (count.Count == 0)
                    {
                        continue;
                    }

                    JU.Add(organization.SUP_ORG_CODE);
                }
            }
        }
        foreach (Organization organization in orgList)
        {

            if (!withPreset)
            {
                if (ORG_TYPE_GDD == organization.ORG_TYPE)
                {
                    var objSubStationList0 = from n in Api.Util.Common.substationDic.Values
                                             where n.POWER_SECTION_CODE == organization.ORG_CODE
                                             && n.SUBSTATION_TYPE == "变电所"
                                             select n;
                    var subStationlist = objSubStationList0.Where(m => !string.IsNullOrEmpty(m.DEV_URL));
                    List<Substation> count = subStationlist.ToList<Substation>();
                    if (count.Count == 0)
                    {
                        continue;
                    }
                }

                if (ORG_TYPE_JU == organization.ORG_TYPE)
                {
                    if (!(JU.Contains(organization.ORG_CODE)))
                    {
                        continue;
                    }
                }
            }


            Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"type\":\"{3}\"}},", organization.ORG_CODE, organization.SUP_ORG_CODE, organization.ORG_NAME, organization.ORG_TYPE);//把局段上传
            if (ORG_TYPE_GDD == organization.ORG_TYPE)
            {
                var objSubStationTypeList = (from n in Api.Util.Common.substationDic.Values
                                             where n.POWER_SECTION_CODE == organization.ORG_CODE
                                             select n.SUBSTATION_TYPE).Distinct();
                foreach (var value in objSubStationTypeList)
                {
                    Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"type\":\"{3}\"}},", organization.ORG_CODE + "-" + value, organization.ORG_CODE, value, "SUBSTATIONTYPE");//变电所文件夹
                    var objSubStationList = from n in Api.Util.Common.substationDic.Values
                                            where n.POWER_SECTION_CODE == organization.ORG_CODE
                                            && n.SUBSTATION_TYPE == value
                                            select n;
                    var subStationlist = objSubStationList;//.ToList<Substation>();
                    if (!withPreset)
                    {
                        subStationlist = subStationlist.Where(m => !string.IsNullOrEmpty(m.DEV_URL));
                    }
                    foreach (Substation substation in subStationlist)
                    {
                        {
                            Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"type\":\"{3}\",\"Ju\":\"{4}\",\"Duan\":\"{5}\",\"Url\":\"{6}\"}},", substation.SUBSTATION_CODE, organization.ORG_CODE + "-" + value, substation.SUBSTATION_NAME, "SUBSTATION", substation.BUREAU_CODE, substation.POWER_SECTION_CODE, substation.DEV_URL);//供电段下所有变电所

                            if (tag == "SUBSTATIONMONITORAREA")
                            {
                                if (dsData.Tables.Count > 0 && dsData.Tables[0].Rows.Count > 0)
                                {

                                    DataRow[] drHolderArr = dsData.Tables[0].Select("substation_name = '" + substation.SUBSTATION_NAME + "'");

                                    List<DataRow> list = drHolderArr.ToList();
                                    var hld = (from n in list select n["hld_id"]).Distinct();
                                    foreach (var va in hld)
                                    {
                                        Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"type\":\"{3}\",\"Ju\":\"{4}\",\"Duan\":\"{5}\",\"Substation\":\"{6}\",\"Url\":\"{7}\"}},", substation.SUBSTATION_CODE + "_" + va, substation.SUBSTATION_CODE, "安装位置" + va, "WZ", substation.BUREAU_CODE, substation.POWER_SECTION_CODE, substation.SUBSTATION_CODE, substation.DEV_URL);
                                        var scene = (from n in list where n["hld_id"].Equals(va.ToString()) select n["scene_id"]).Distinct();
                                        foreach (var sa in scene)
                                        {
                                            Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"type\":\"{3}\",\"Ju\":\"{4}\",\"Duan\":\"{5}\",\"Substation\":\"{6}\",\"WZ\":\"{7}\",\"Url\":\"{8}\"}},", substation.SUBSTATION_CODE + "_" + va + "_" + sa, substation.SUBSTATION_CODE + "_" + va, "预置位" + sa, "YZW", substation.BUREAU_CODE, substation.POWER_SECTION_CODE, substation.SUBSTATION_CODE, va, substation.DEV_URL);
                                            var mnt = (from n in list where n["hld_id"].Equals(va.ToString()) && n["scene_id"].Equals(sa.ToString()) select n);
                                            foreach (var ma in mnt)
                                            {
                                                Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"type\":\"{3}\",\"Ju\":\"{4}\",\"Duan\":\"{5}\",\"Substation\":\"{6}\",\"WZ\":\"{7}\",\"YWZ\":\"{8}\",\"Url\":\"{9}\"}},", substation.SUBSTATION_CODE + "_" + va + "_" + sa + "-" + ma["area_id"], substation.SUBSTATION_CODE + "_" + va + "_" + sa, ma["area_name"], "KMP", substation.BUREAU_CODE, substation.POWER_SECTION_CODE, substation.SUBSTATION_CODE, va, sa, substation.DEV_URL);
                                            }
                                        }
                                    }
                                }
                                //SubstationMonitorAreaCond substationMonitorAreaCond = new SubstationMonitorAreaCond();
                                //substationMonitorAreaCond.SUBSTATION_CODE = PublicMethod.GetConversionCode(substation.SUBSTATION_CODE);
                                //if (!withPreset)
                                //{
                                //    substationMonitorAreaCond.DATA_TYPE = "WZ";
                                //}
                                //IList<SubstationMonitorArea> substationMonitorList = Api.ServiceAccessor.GetFoundationService().querySubstationMonitorArea(substationMonitorAreaCond);//
                                //IList<SubstationMonitorArea> list = substationMonitorList;
                                ////List<SubstationMonitorArea> gt = new List<SubstationMonitorArea>();
                                ////foreach (var item in substationMonitorList)
                                ////{
                                ////    if (gt.Exists(x => x.NAME == item.NAME))
                                ////    {
                                ////        item.NAME = null;
                                ////    }
                                ////    gt.Add(item);
                                ////}
                                //foreach (SubstationMonitorArea substationMonitorArea in list)
                                //{
                                //    //int a = substationMonitorArea.NAME.Length;
                                //    //if (substationMonitorArea.DEVICE_TYPE=="全景" && substationMonitorArea.NAME.IndexOf("全景")==-1 )
                                //    // substationMonitorArea.NAME=substationMonitorArea.NAME+substationMonitorArea.DEVICE_TYPE ;
                                //    Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"type\":\"{3}\",\"Ju\":\"{4}\",\"Duan\":\"{5}\",\"Substation\":\"{6}\",\"Url\":\"{7}\"}},", substationMonitorArea.CODE, substationMonitorArea.P_CODE, substationMonitorArea.NAME, substationMonitorArea.DATA_TYPE, substation.BUREAU_CODE, substation.POWER_SECTION_CODE, substation.SUBSTATION_CODE, substation.DEV_URL);
                                //}
                            }
                        }
                    }
                }
            }
        }
        return Json.ToString().TrimEnd(',') + "]";
    }

    /// <summary>
    /// 菜单树分类
    /// </summary>
    private string FunMenuCategory = "DPC";

    /// <summary>
    /// 菜单树
    /// </summary>
    /// <param name="category"></param>
    /// <returns></returns>
    private string GetFunMenuTree(string category)
    {
        StringBuilder Json = new StringBuilder();
        IEnumerable<FunMenu> list = list = from fun in Api.Util.Common.FunMenuCache
                                           where category == FunMenuCategory ? 1 == 1 : fun.PARENTCODE.Contains(category)
                                           select fun;


        Json.Append("[");
        foreach (FunMenu fm in list)
        {
            Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"file\":\"{3}\"}},",
                fm.CODE, fm.SUBCODE, fm.NAME, fm.IMG);

        }
        return Json.ToString().TrimEnd(',') + "]";
    }

    /// <summary>
    /// 线路过滤显示区站和桥隧
    /// </summary>
    /// <parm name="codeType"></parm>
    /// <returns></returns>
    public string LineFilter(String linecode, String tag, String is_only_section)
    {
        string bureau_code = HttpContext.Current.Request["bureau_code"];
        string org_code = HttpContext.Current.Request["org_code"];

        StringBuilder Json = new StringBuilder();
        Json.Append("[");

        IList<StationSection> stationList;

        var poslist = from m in Api.Util.Common.stationSectionDic.Values
                      where m.LINE_CODE == linecode
                      orderby m.POSITION_ORDER
                      select m;

        if (!string.IsNullOrEmpty(bureau_code))
        {
            poslist = from m in Api.Util.Common.stationSectionDic.Values
                      where m.LINE_CODE == linecode && m.BUREAU_CODE == bureau_code
                      orderby m.POSITION_ORDER
                      select m;
        }

        if (!string.IsNullOrEmpty(org_code))
        {
            poslist = from m in Api.Util.Common.stationSectionDic.Values
                      where m.LINE_CODE == linecode && m.POWER_SECTION_CODE == org_code
                      orderby m.POSITION_ORDER
                      select m;
        }

        stationList = poslist.ToList<StationSection>();
        foreach (StationSection station in stationList)
        {
            //if (tag == "BRIDGETUNE" || tag == "STATIONSECTION") {
            if (stationList != null && stationList.Count > 0)
            {
                Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"treeType\":\"POSITION\",\"nocheck\":true}},", station.POSITION_CODE, station.LINE_CODE, station.POSITION_NAME);
                // if (tag == "BRIDGETUNE")


                if (is_only_section != "true")
                {
                    var btlist = from n in Api.Util.Common.bridgeTuneDic.Values
                                 where n.POSITION_CODE == station.POSITION_CODE
                                 orderby n.BRG_TUN_ORDER
                                 select n;
                    IList<BridgeTune> bridgeTuneList = btlist.ToList<BridgeTune>();
                    foreach (BridgeTune bt in bridgeTuneList)
                    {
                        Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"treeType\":\"BRIDGETUNE\",\"nocheck\":true}},", bt.BRG_TUN_CODE, bt.POSITION_CODE, bt.BRG_TUN_NAME);
                    }
                }
            }
        }
        return Json.ToString().TrimEnd(',') + "]";
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
        sb.Append("[");
        foreach (Substation sub in sublist)
        {
            //sb.AppendFormat("<option value='{0}' title='{1}'>{1}</option>", sub.SUBSTATION_CODE, sub.SUBSTATION_NAME);
            sb.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"nocheck\":true}},", sub.SUBSTATION_CODE, sub.SUBSTATION_CODE, sub.SUBSTATION_NAME);
        }
        return sb.ToString().TrimEnd(',') + "]";
    }



    /// <summary>
    /// 只选择桥隧
    /// </summary>
    /// <param name="sectioncode"></param>
    /// <param name="tag"></param>
    /// <returns></returns>
    public string GetSysDictionaryTree_brifge(String sectioncode, String tag)
    {
        StringBuilder Json = new StringBuilder();
        Json.Append("[");

        IList<BridgeTune> bridgeTuneList;

        var btlist = from m in Api.Util.Common.bridgeTuneDic.Values
                     where m.POSITION_CODE == sectioncode
                     orderby m.BRG_TUN_ORDER
                     select m;

        bridgeTuneList = btlist.ToList<BridgeTune>();
        foreach (BridgeTune bt in bridgeTuneList)
        {

            if (bridgeTuneList != null && bridgeTuneList.Count > 0)
            {
                Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"treeType\":\"BRIDGETUNE\",\"nocheck\":true}},", bt.BRG_TUN_CODE, bt.POSITION_CODE, bt.BRG_TUN_NAME);
            }
        }
        return Json.ToString().TrimEnd(',') + "]";
    }
    /// <summary>
    /// 只选择区站
    /// </summary>
    /// <param name="sectioncode"></param>
    /// <param name="tag"></param>
    /// <returns></returns>
    public string GetSysDictionaryTree_station(string code, string tag)
    {
        StringBuilder Json = new StringBuilder();
        Json.Append("[");

        IList<StationSection> stationsetionList;

        var btlist = from m in Api.Util.Common.stationSectionDic.Values
                     where m.LINE_CODE == code
                     orderby m.POSITION_CODE
                     select m;

        stationsetionList = btlist.ToList<StationSection>();
        foreach (StationSection bt in stationsetionList)
        {
            if (stationsetionList != null && stationsetionList.Count > 0)
            {
                Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"treeType\":\"STATIONSECTION\",\"nocheck\":true}},", bt.POSITION_CODE, bt.LINE_CODE, bt.POSITION_NAME);
            }
        }
        return Json.ToString().TrimEnd(',') + "]";
    }
    /// <summary>
    /// 获取行别插件
    /// </summary>
    /// <param name="context"></param>
    /// <returns></returns>
    public string GetSysDictionaryTree_DRECTION(HttpContext context)
    {
        string[] IsShowMoreOption_name = string.IsNullOrEmpty(context.Request["IsShowMoreOption_name"]) ? null : context.Request["IsShowMoreOption_name"].Split(',');
        string[] IsShowMoreOption_code = string.IsNullOrEmpty(context.Request["IsShowMoreOption_code"]) ? null : context.Request["IsShowMoreOption_code"].Split(',');
        StringBuilder Json = new StringBuilder();
        //SysDictionaryCond cond = new SysDictionaryCond();
        string CATEGORY = "DRTFLG";
        //cond.businssAnd += " ORDER BY SYS_DIC.DIC_CODE DESC";
        //IList<SysDictionary> list = Api.ServiceAccessor.GetFoundationService().querySysDictionary(cond);
        SysDictionary[] sd = Api.Util.Common.sysDictionaryDic.Values.ToArray();
        IList<SysDictionary> list = (from l in sd where l.P_CODE == CATEGORY /*&& l.CODE_TYPE == codeType*/ select l).ToArray();
        Json.Append("[");
        foreach (SysDictionary m in list)
        {
            if (m.DIC_CODE != "DRTFLG")
            {
                Json.AppendFormat("{{\"id\":\"{1}\",\"pId\":\"{0}\",\"name\":\"{1}\"}},", m.DIC_CODE, m.CODE_NAME);
            }
        }
        if (IsShowMoreOption_name != null)
        {
            for (int i = 0; i < IsShowMoreOption_name.Length; i++)
            {

                Json.AppendFormat("{{\"id\":\"{1}\",\"pId\":\"{1}\",\"name\":\"{0}\"}},", IsShowMoreOption_name[i], IsShowMoreOption_code[i]);

            }
        }

        return Json.ToString().TrimEnd(',') + "]";
    }

    /// <summary>
    /// 查询自动取消标志
    /// </summary>
    /// <param name="context"></param>
    /// <returns></returns>
    public string GetSysDictionaryTree_ANALYTICAL(HttpContext context)
    {
        StringBuilder Json = new StringBuilder();
        //SysDictionaryCond cond = new SysDictionaryCond();
        string CATEGORY = "ACFLAG";
        //IList<SysDictionary> list = Api.ServiceAccessor.GetFoundationService().querySysDictionary(cond);
        SysDictionary[] sd = Api.Util.Common.sysDictionaryDic.Values.ToArray();
        IList<SysDictionary> list = (from l in sd where l.CATEGORY == CATEGORY select l).ToArray();
        Json.Append("[");
        foreach (SysDictionary m in list)
        {
            Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{2}\",\"name\":\"{1}\"}},", m.DIC_CODE, m.CODE_NAME, m.P_CODE);
        }
        return Json.ToString().TrimEnd(',') + "]";
    }

    /// <summary>
    /// </summary>
    /// <param name="context"></param>
    /// <returns></returns>
    public string GetSysDictionaryTree_LIBRARY(HttpContext context)
    {
        StringBuilder Json = new StringBuilder();
        SysDictionaryCond cond = new SysDictionaryCond();
        if (context.Request["cateGory"].IndexOf('|') > 0)
        {
            cond.CATEGORY = context.Request["cateGory"].Split('|')[0].ToString();
            cond.businssAnd += " p_code like '%" + context.Request["cateGory"].Split('|')[1].ToString() + "%'";
        }
        else
        {
            cond.CATEGORY = context.Request["cateGory"];
        }
        //cond.CATEGORY = "SMPLFLG";
        //cond.businssAnd += " ORDER BY SYS_DIC.DIC_CODE DESC";

        IList<SysDictionary> list = Api.ServiceAccessor.GetFoundationService().querySysDictionary(cond);
        Json.Append("[");
        foreach (SysDictionary m in list)
        {
            if (m.DIC_CODE != "SMPLFLG")
            {
                if (m.P_CODE != "DRTFLG_FUB" && m.P_CODE != "DRTFLG_FUB_LCZ" && m.DIC_CODE != "DRTFLG_FUB")
                {
                    if (m.DIC_CODE != "DRTFLG_FUB_LCZ" && m.DIC_CODE != "DRTFLG_ZHB" && m.DIC_CODE != "DRTFLG_FUB")
                    {
                        Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"nocheck\":false}},", m.DIC_CODE, m.P_CODE, m.CODE_NAME);
                    }
                    else
                    {
                        Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"nocheck\":true}},", m.DIC_CODE, m.P_CODE, m.CODE_NAME);
                    }
                }
            }
        }
        return Json.ToString().TrimEnd(',') + "]";
    }
    /// <summary>
    /// 取缺陷部位
    /// </summary>
    /// <returns></returns>
    public string GetSysDic_AFTOPO()
    {
        StringBuilder sb = new StringBuilder();

        string codeType = System.Web.HttpContext.Current.Request["codeType"];
        string p_code = System.Web.HttpContext.Current.Request["p_code"];

        var btlist = from n in Api.Util.Common.sysDictionaryDic.Values
                     where n.P_CODE == p_code
                     orderby n.SHOW_PRIORITY
                     select n;
        sb.Append("[");
        foreach (SysDictionary b in btlist)
        {
            if (!b.CODE_TYPE.Contains(codeType) && "DPC" != codeType)
                continue;

            string pCode = b.P_CODE;
            if (String.IsNullOrEmpty(b.P_CODE)) { pCode = "0"; }
            sb.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\"}},", b.DIC_CODE, pCode, b.CODE_NAME);

        }
        return sb.ToString().TrimEnd(',') + "]";
    }

    /// <summary>
    /// </summary>
    /// <param name="context"></param>
    /// <returns></returns>
    public string GetCriterion(HttpContext context)
    {
        StringBuilder Json = new StringBuilder();
        string p_code = "ALGCODE";

        var list = from n in Api.Util.Common.sysDictionaryDic.Values
                   where n.P_CODE == p_code
                   orderby n.DIC_CODE
                   select n;

        Json.Append("[");
        foreach (SysDictionary p in list)
        {
            Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"nocheck\":\"{3}\"}},", p.DIC_CODE, "0", p.CODE_NAME, "code");

            var alglist = from n in Api.Util.Common.sysDictionaryDic.Values
                       where n.P_CODE == p.DIC_CODE
                       orderby n.DIC_CODE
                       select n;
            foreach (SysDictionary m in alglist)
            {
                Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"nocheck\":\"{3}\"}},", m.DIC_CODE, m.P_CODE, m.CODE_NAME, "judge_code");
            }
        }
        return Json.ToString().TrimEnd(',') + "]";
    }




    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}
