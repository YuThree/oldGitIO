<%@ WebHandler Language="C#" Class="GetTrees_M" %>

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
using Newtonsoft.Json;
using System.Reflection;

public class GetTrees_M : ReferenceClass, IHttpHandler
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
                    rs = LineFilter(linecode,tag);
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
        string re = myfiter.json_RemoveSpecialStr( Json.ToString().TrimEnd(',') + "]");

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
        for (int i = 0; i < bureauList.Count; i++)
        {
            if (!Api.Util.Public.IsHavePermisson_orgCode_BUREAU(bureauList[i].ORG_CODE))
            {
                continue;
            }


            Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"0\",\"name\":\"{1}\",\"treeType\":\"BUREAU\"", bureauList[i].ORG_CODE, bureauList[i].ORG_NAME);
            var orgIE = from n in Api.Util.Common.organizationDic.Values
                        where n.SUP_ORG_CODE == bureauList[i].ORG_CODE
                        //   && ( Myorglist.Count==0 || Myorglist.Contains(n.ORG_CODE))
                        //   && n.ORG_CODE.Contains()
                        orderby n.ORG_ORDER
                        select n;




            IList<Organization> orgList = orgIE.ToList<Organization>();


            Json.Append(",\"content\":[");
            StringBuilder org = new StringBuilder();
            int ss = org.Length;
            for (int j = 0; j < orgList.Count; j++)
            {
                if (!Api.Util.Public.IsHavePermisson_orgCode_BUREAU(orgList[j].ORG_CODE) || !Api.Util.Public.IsPowerSectionOrg(orgList[j].ORG_TYPE))
                {
                    continue;
                }

                org.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"treeType\":\"ORG\"", orgList[j].ORG_CODE, bureauList[i].ORG_CODE, orgList[j].ORG_NAME);

                //增加对设备版本的判断，用于视频直播时筛选设备列表
                //bool isFilter = !String.IsNullOrEmpty(Loco_version) && Loco_version != "undefined" & Loco_version != "0";
                IList<Locomotive> locomotiveList = null;
                if (Api.Util.Public.GetDeptCode == "TOPBOSS")
                {
                    var locIE = from n in Api.Util.Common.locomotiveDic.Values
                                where n.ORG_CODE == orgList[j].ORG_CODE
                                select n;
                    locomotiveList = locIE.ToList<Locomotive>();

                }
                else
                {
                    var locIE = from n in Api.Util.Common.locomotiveDic.Values
                                where n.ORG_CODE == orgList[j].ORG_CODE && (n.ORG_CODE.IndexOf(Api.Util.Public.GetDeptCode) != -1)
                                select n;
                    locomotiveList = locIE.ToList<Locomotive>();
                }

                org.Append(",\"content\":[");
                if (locomotiveList != null && locomotiveList.Count > 0)
                {
                    for (int t = 0; t < locomotiveList.Count; t++)
                    {
                        org.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"relations\":\"{3}\",\"treeType\":\"LOCOMOTIVE\"", locomotiveList[t].LOCOMOTIVE_CODE, orgList[j].ORG_CODE, locomotiveList[t].LOCOMOTIVE_CODE, locomotiveList[t].DEVICE_BOW_RELATIONS);
                        org.Append("}");
                        if (t < locomotiveList.Count - 1)
                        {
                            org.Append(",");
                        }
                    }
                }
                org.Append("]");



                org.Append("},");
            }
            if (org.Length > 0)
            {
                Json.Append(org.ToString().Substring(0, org.Length - 1));
            }
            Json.Append("]");




            Json.Append("},");
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
        IList<Organization> myorgList = new List<Organization>();


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
            myorgList.Add(org);
            //Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"treeType\":\"{3}\"}},", org.ORG_CODE, org.SUP_ORG_CODE, org.ORG_NAME, org.ORG_TYPE);
        }
        List<FunctionInfoMapping> rootNode = new List<FunctionInfoMapping>();
        if (myorgList.Count > 0)
        {
            foreach (var plist in myorgList.Where(t => t.SUP_ORG_CODE == "TOPBOSS"))
            {
                FunctionInfoMapping node = new FunctionInfoMapping();
                node.ID = plist.ORG_CODE;
                node.PID = plist.SUP_ORG_CODE;
                node.NAME = plist.ORG_NAME;
                node.TREETYPE = plist.ORG_TYPE;
                node.Nodes = CreateChildTree(myorgList, node);
                rootNode.Add(node);
            }
        }
        //return Json.ToString().Substring(0, Json.Length - 1) + "]";
        return JsonConvert.SerializeObject(rootNode);

    }
    private List<FunctionInfoMapping> CreateChildTree(IList<Organization> TreeList, FunctionInfoMapping parentId)
    {
        string keyid = parentId.ID;//root id
        List<FunctionInfoMapping> nodeList = new List<FunctionInfoMapping>();
        var children = TreeList.Where(t => t.SUP_ORG_CODE == keyid);
        foreach (var chl in children)
        {
            FunctionInfoMapping node = new FunctionInfoMapping();
            node.ID = chl.ORG_CODE;
            node.ID = chl.ORG_CODE;
            node.PID = chl.SUP_ORG_CODE;
            node.NAME = chl.ORG_NAME;
            node.TREETYPE = chl.ORG_TYPE;
            node.Nodes = CreateChildTree(TreeList, node);
            nodeList.Add(node);
        }
        return nodeList;
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
    private string GetLineTree(string tag)
    {
        System.Text.StringBuilder Json = new System.Text.StringBuilder();
        Json.Append("[");

        IList<Line> linelist;


        if (Api.Util.Public.IsPowerSectionUser())
        {
            var poslinelist = from n in Api.Util.Common.lineDic.Values
                              where n.ORG_CODE != null && Api.Util.Public.IsHavePermisson_orgCode(n.ORG_CODE) && n.IS_SHOW == "1"
                              orderby n.LINE_NO
                              select n;

            linelist = poslinelist.ToList<Line>();
        }
        else
        {
            //车辆用户，不筛选线路。

            var poslinelist = from n in Api.Util.Common.lineDic.Values
                              where n.IS_SHOW == "1" && n.ORG_CODE != null
                                  //  where n.ORG_CODE != null && Api.Util.Public.IsHavePermisson_orgCode(n.ORG_CODE)
                              orderby n.LINE_NO
                              select n;

            linelist = poslinelist.ToList<Line>();

        }
        if (linelist.Count > 0)
        {
            for (int i = 0; i < linelist.Count; i++)
            {
                if (string.IsNullOrEmpty(linelist[i].ORG_CODE))
                {
                    continue;
                }
                Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"0\",\"name\":\"{1}\",\"treeType\":\"LINE\",\"org\":\"{2}\"", linelist[i].LINE_CODE, linelist[i].LINE_NAME, linelist[i].ORG_CODE);
                IList<StationSection> stationList;
                if (Api.Util.Public.IsPowerSectionUser())
                {
                    var poslist = from n in Api.Util.Common.stationSectionDic.Values
                                  where n.ORG_CODE != null && Api.Util.Public.IsHavePermisson_orgCode(n.ORG_CODE) && n.LINE_CODE == linelist[i].LINE_CODE //&& string.IsNullOrEmpty(Api.Util.Public.GetUser_PermissionOrg) ? true : n.ORG_CODE.Contains(Api.Util.Public.GetUser_PermissionOrg)
                                  orderby n.POSITION_ORDER
                                  select n;
                    stationList = poslist.ToList<StationSection>();
                }
                else
                {
                    //车辆用户，不筛选区站。                  
                    var poslist = from n in Api.Util.Common.stationSectionDic.Values
                                  where n.LINE_CODE == linelist[i].LINE_CODE //&& string.IsNullOrEmpty(Api.Util.Public.GetUser_PermissionOrg) ? true : n.ORG_CODE.Contains(Api.Util.Public.GetUser_PermissionOrg)
                                  orderby n.POSITION_ORDER
                                  select n;
                    stationList = poslist.ToList<StationSection>();
                }
                StringBuilder item = new StringBuilder();
                int sign = 0;
                for (int j = 0; j < stationList.Count; j++)
                {
                    if (tag == "BRIDGETUNE" || tag == "STATIONSECTION")
                    {
                        if (j == 0)
                        {
                            Json.Append(",\"content\":[");
                        }
                        if (stationList != null && stationList.Count > 0)
                        {
                            if (Api.Util.Public.IsPowerSectionUser() && !Api.Util.Public.IsHavePermisson_orgCode_BUREAU(stationList[j].POWER_SECTION_CODE))   //供电段条件筛选。
                            {
                                continue;
                            }
                            Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"treeType\":\"POSITION\",\"nocheck\":true", stationList[j].POSITION_CODE, stationList[j].LINE_CODE, stationList[j].POSITION_NAME);
                            if (tag == "BRIDGETUNE")
                            {
                                var btlist = from n in Api.Util.Common.bridgeTuneDic.Values
                                             where n.POSITION_CODE == stationList[j].POSITION_CODE
                                             orderby n.BRG_TUN_ORDER
                                             select n;

                                IList<BridgeTune> bridgeTuneList = btlist.ToList<BridgeTune>();

                                for (int r = 0; r < bridgeTuneList.Count; r++)
                                {
                                    if (r == 0)
                                    {
                                        Json.Append(",\"content\":[");
                                    }
                                    Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"treeType\":\"BRIDGETUNE\",\"nocheck\":true}}", bridgeTuneList[r].BRG_TUN_CODE, bridgeTuneList[r].POSITION_CODE, bridgeTuneList[r].BRG_TUN_NAME);
                                    if (r < bridgeTuneList.Count - 1)
                                    {
                                        Json.Append(",");
                                    }
                                    if (r == bridgeTuneList.Count - 1)
                                    {
                                        Json.Append("]");
                                    }
                                }
                            }
                            Json.Append("}");
                            if (j < stationList.Count - 1)
                            {
                                Json.Append(",");
                            }

                        }
                        if (j == stationList.Count - 1)
                        {
                            Json.Append("]");
                        }
                    }
                    else if (tag == "KMSTATION")//公里标计算中筛选站点，即不包括区站 jlx
                    {
                        if (j == 0)
                        {
                            Json.Append(",\"content\":[");
                        }
                        var btlist = from n in Api.Util.Common.stationSectionDic.Values
                                     where n.POSITION_CODE == stationList[j].POSITION_CODE && (n.POSITION_TYPE == "S") && (!n.POSITION_NAME.Contains("－")) && (!n.POSITION_NAME.Contains("-"))
                                     orderby n.POSITION_ORDER
                                     select n;
                        IList<StationSection> statLi = btlist.ToList<StationSection>();
                        for (int t = 0; t < statLi.Count; t++)
                        {
                            sign++;
                            item.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"treeType\":\"POSITION\"", statLi[t].POSITION_CODE, statLi[t].LINE_CODE, statLi[t].POSITION_NAME);
                            item.Append("},");
                        }
                        if (j == stationList.Count - 1)
                        {
                            if (sign > 0)
                            {
                                Json.Append(item.ToString().Substring(0, item.Length - 1));
                            }
                            Json.Append("]");
                        }
                    }
                }
                Json.Append("},");
                //if (i < linelist.Count - 1)
                //{
                //    Json.Append(",");
                //}
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
        //IList<SysDictionary> list = Api.ServiceAccessor.GetFoundationService().querySysDictionary(cond);
        SysDictionary[] sd = Api.Util.Common.sysDictionaryDic.Values.ToArray();
        IList<SysDictionary> list = (from l in sd where l.P_CODE == cateGory /*&& l.CODE_TYPE == codeType*/ select l).ToArray();
        Json.Append("[");
        foreach (SysDictionary m in list)
        {
            string pCode = m.P_CODE;
            if (String.IsNullOrEmpty(m.P_CODE)) { pCode = "0"; }
            if(m.P_CODE == "AFLG")
            {
                Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"nocheck\":true}},", m.DIC_CODE, pCode, m.CODE_NAME);
            }else
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
    public string GetSysDictionaryTree_DRECTION(HttpContext context)
    {
        string[] IsShowMoreOption_name = string.IsNullOrEmpty(context.Request["IsShowMoreOption_name"]) ? null : context.Request["IsShowMoreOption_name"].Split(',');
        string[] IsShowMoreOption_code = string.IsNullOrEmpty(context.Request["IsShowMoreOption_code"]) ? null : context.Request["IsShowMoreOption_code"].Split(',');
        StringBuilder Json = new StringBuilder();
        SysDictionaryCond cond = new SysDictionaryCond();
        cond.CATEGORY = "DRTFLG";
        //cond.businssAnd += " ORDER BY SYS_DIC.DIC_CODE DESC";
        IList<SysDictionary> list = Api.ServiceAccessor.GetFoundationService().querySysDictionary(cond);
        Json.Append("[");
        foreach (SysDictionary m in list)
        {
            if (m.DIC_CODE!="DRTFLG" ) {
                Json.AppendFormat("{{\"id\":\"{1}\",\"pId\":\"{0}\",\"name\":\"{1}\"}},", m.DIC_CODE, m.CODE_NAME);
            }
        }
        if (IsShowMoreOption_name != null) {
            for (int i = 0; i < IsShowMoreOption_name.Length; i++)
            {

                Json.AppendFormat("{{\"id\":\"{1}\",\"pId\":\"{1}\",\"name\":\"{0}\"}},", IsShowMoreOption_name[i], IsShowMoreOption_code[i]);

            }
        }

        return Json.ToString().TrimEnd(',') + "]";
    }
    public string GetSysDictionaryTree_ANALYTICAL(HttpContext context)
    {
        StringBuilder Json = new StringBuilder();
        SysDictionaryCond cond = new SysDictionaryCond();
        cond.CATEGORY = "ACFLAG";
        IList<SysDictionary> list = Api.ServiceAccessor.GetFoundationService().querySysDictionary(cond);
        Json.Append("[");
        foreach (SysDictionary m in list)
        {
            if (m.DIC_CODE!="ACFLAG" ) {
                Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{0}\",\"name\":\"{1}\"}},", m.DIC_CODE, m.CODE_NAME);
            }
        }
        return Json.ToString().TrimEnd(',') + "]";
    }
    public string GetSysDictionaryTree_LIBRARY(HttpContext context)
    {
        StringBuilder Json = new StringBuilder();
        SysDictionaryCond cond = new SysDictionaryCond();
        cond.CATEGORY = "SMPLFLG";
        //cond.businssAnd += " ORDER BY SYS_DIC.DIC_CODE DESC";
        IList<SysDictionary> list = Api.ServiceAccessor.GetFoundationService().querySysDictionary(cond);
        Json.Append("[");
        foreach (SysDictionary m in list)
        {
            if (m.DIC_CODE!="SMPLFLG" ) {
                Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{0}\",\"name\":\"{1}\"}},", m.DIC_CODE, m.CODE_NAME);
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
            if (!m1.CODE_TYPE.Contains(codeType))
                continue;

            html.AppendFormat("<div class='typebg'><div class='type1'><a code='{1}' class='btn btn-mini btn-primary' href='javascript:void(0)'>{0}</a></div>", m1.CODE_NAME, m1.DIC_CODE);

            var btlist2 = from n in Api.Util.Common.sysDictionaryDic.Values
                          where n.P_CODE == m1.DIC_CODE
                          orderby n.SHOW_PRIORITY
                          select n;


            html.AppendFormat("<div class='type2'>");

            foreach (SysDictionary m2 in btlist2)
            {
                if (!m2.CODE_TYPE.Contains(codeType))
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
    public string GetSubStationTree(string tag)
    {
        StringBuilder Json = new StringBuilder();
        Json.Append("[");
        var objOrgList = from n in Api.Util.Common.organizationDic.Values
                         where (n.ORG_TYPE == ORG_TYPE_JU || n.ORG_TYPE == ORG_TYPE_GDD)
                         select n;
        IList<Organization> orgList = objOrgList.ToList<Organization>();
        foreach (Organization organization in orgList)
        {
            Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"type\":\"{3}\"}},", organization.ORG_CODE, organization.SUP_ORG_CODE, organization.ORG_NAME, organization.ORG_TYPE);
            if (ORG_TYPE_GDD == organization.ORG_TYPE)
            {
                var objSubStationTypeList = (from n in Api.Util.Common.substationDic.Values
                                             where n.POWER_SECTION_CODE == organization.ORG_CODE
                                             select n.SUBSTATION_TYPE).Distinct();
                foreach (var value in objSubStationTypeList)
                {
                    Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"type\":\"{3}\"}},", organization.ORG_CODE + "-" + value, organization.ORG_CODE, value, "SUBSTATIONTYPE");
                    var objSubStationList = from n in Api.Util.Common.substationDic.Values
                                            where n.POWER_SECTION_CODE == organization.ORG_CODE
                                            && n.SUBSTATION_TYPE == value
                                            select n;
                    IList<Substation> subStationlist = objSubStationList.ToList<Substation>();
                    foreach (Substation substation in subStationlist)
                    {
                        Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"type\":\"{3}\",\"Ju\":\"{4}\",\"Duan\":\"{5}\"}},", substation.SUBSTATION_CODE, organization.ORG_CODE + "-" + value, substation.SUBSTATION_NAME, "SUBSTATION", substation.BUREAU_CODE, substation.POWER_SECTION_CODE);
                        if (tag == "SUBSTATIONMONITORAREA")
                        {
                            SubstationMonitorAreaCond substationMonitorAreaCond = new SubstationMonitorAreaCond();
                            substationMonitorAreaCond.SUBSTATION_CODE = PublicMethod.GetConversionCode(substation.SUBSTATION_CODE);
                            IList<SubstationMonitorArea> substationMonitorList = Api.ServiceAccessor.GetFoundationService().querySubstationMonitorArea(substationMonitorAreaCond);
                            foreach (SubstationMonitorArea substationMonitorArea in substationMonitorList)
                            {
                                Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"type\":\"{3}\",\"Ju\":\"{4}\",\"Duan\":\"{5}\",\"Substation\":\"{6}\"}},", substationMonitorArea.CODE, substationMonitorArea.P_CODE, substationMonitorArea.NAME, substationMonitorArea.DATA_TYPE, substation.BUREAU_CODE, substation.POWER_SECTION_CODE, substation.SUBSTATION_CODE);
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
    public string LineFilter(String linecode,String tag)
    {
        StringBuilder Json = new StringBuilder();
        Json.Append("[");

        IList<StationSection> stationList;

        var poslist = from m in Api.Util.Common.stationSectionDic.Values
                      where m.LINE_CODE == linecode
                      orderby m.POSITION_ORDER
                      select m;

        stationList = poslist.ToList<StationSection>();
        foreach (StationSection station in stationList)
        {
            //if (tag == "BRIDGETUNE" || tag == "STATIONSECTION") {
            if (stationList != null && stationList.Count > 0){
                Json.AppendFormat("{{\"id\":\"{0}\",\"pId\":\"{1}\",\"name\":\"{2}\",\"treeType\":\"POSITION\",\"nocheck\":true}},", station.POSITION_CODE, station.LINE_CODE, station.POSITION_NAME);
                // if (tag == "BRIDGETUNE")
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