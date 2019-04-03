<%@ WebHandler Language="C#" Class="C6_DeviceListControl" %>

using System;
using System.Web;
using Api.Foundation.entity.Foundation;
using System.Collections.Generic;
using Api.Foundation.service;
using Api;
using System.Text;
using Api.Foundation.entity.Cond;
using System.Data;

public class C6_DeviceListControl : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        string type = context.Request["type"];
        switch (type)
        {
            //查询设备
            case "all":
                getSelect(context);
                break;
            case "Add":
                getAdd();
                break;
            case "Update":
                getUpdate();
                break;
            case "Delete":
                Delete();
                break;
            default:
                break;
        }
    }
    public void getSelect(HttpContext context)
    {  //获取前台页码
        int pageIndex = Convert.ToInt32(HttpContext.Current.Request["page"]);
        //获取前台条数
        int pageSize = Convert.ToInt32(HttpContext.Current.Request["rp"]);
        string name = HttpContext.Current.Request["Name"];
        string Tree_Path = HttpContext.Current.Request["Tree_Path"];
        SubstationCond substationCond = new SubstationCond();
        SubstationMonitorAreaCond substationMonitorArea = new SubstationMonitorAreaCond();
        if (HttpContext.Current.Request["Name"] != null && HttpContext.Current.Request["Name"].ToString() != "")
        {
            substationMonitorArea.NAME = HttpContext.Current.Request["Name"].ToString();
        }
        if (HttpContext.Current.Request["ju"] != null && HttpContext.Current.Request["ju"].ToString() != "" && HttpContext.Current.Request["ju"].ToString() != "0")
        {
            substationCond.BUREAU_CODE = HttpContext.Current.Request["ju"].ToString();
            substationMonitorArea.SUBSTATION_CODE = PublicMethod.GetConversionCode(Api.ServiceAccessor.GetFoundationService().getSubstationByType(substationCond));
            if (string.IsNullOrEmpty(substationMonitorArea.SUBSTATION_CODE))
            {
                substationMonitorArea.businssAnd = " 1=2 ";
            }
        }
        if (HttpContext.Current.Request["duan"] != null && HttpContext.Current.Request["duan"].ToString() != "" && HttpContext.Current.Request["duan"].ToString() != "0")
        {
            substationCond.POWER_SECTION_CODE = HttpContext.Current.Request["duan"].ToString();
            substationMonitorArea.SUBSTATION_CODE = PublicMethod.GetConversionCode(Api.ServiceAccessor.GetFoundationService().getSubstationByType(substationCond));
            if (string.IsNullOrEmpty(substationMonitorArea.SUBSTATION_CODE))
            {
                substationMonitorArea.businssAnd = " 1=2 ";
            }
        }
        if (HttpContext.Current.Request["substation"] != null && HttpContext.Current.Request["substation"].ToString() != "" && HttpContext.Current.Request["substation"].ToString() != "0")
        {
            substationMonitorArea.SUBSTATION_CODE = PublicMethod.GetConversionCode(HttpContext.Current.Request["substation"].ToString());
        }
        if (HttpContext.Current.Request["treeType"] != null && HttpContext.Current.Request["treeType"].ToString() != "")
        {
            string treeType = HttpContext.Current.Request["treeType"].ToString();
            string id = HttpContext.Current.Request["id"].ToString();
            string pId = HttpContext.Current.Request["pId"].ToString();
            substationMonitorArea = getSubstationCode(substationCond, substationMonitorArea, treeType, id, pId);
        }

        substationMonitorArea.pageNum = pageIndex;
        substationMonitorArea.pageSize = pageSize;
        substationMonitorArea.DATA_TYPE = "KMP";
        IList<SubstationMonitorArea> list = Api.ServiceAccessor.GetFoundationService().querySubstationMonitorArea(substationMonitorArea);
        int recordCount = ServiceAccessor.GetFoundationService().getSubstationMonitorAreaCount(substationMonitorArea);
        string jsonStr = "";
        if (list != null)
        {
            jsonStr = "{'rows':[";
            for (int i = 0; i < list.Count; i++)
            {
                string IS_IMPORTANT = "";
                if (list[i].IS_IMPORTANT == "0")
                {
                    IS_IMPORTANT = "否";
                }
                else if (list[i].IS_IMPORTANT == "1")
                {
                    IS_IMPORTANT = "是";
                }
                string url = "";// "<a  href=javascript:updateC6DeviclModal(X" + list[i].ID + ")>修改</a>&nbsp;<a href=javascript:deleteC6Devicl(X" + list[i].ID + ")>删除</a>";
                jsonStr += "{'NAME':'" + list[i].NAME + "','SubstationName':'" + list[i].SUBSTATION_NAME + "','SBWZ':'" + "" + "','C6LEVEL':'" + list[i].C6LEVEL + "','DATA_TYPE':'" + list[i].DATA_TYPE + "','DEVICE_TYPE':'" + list[i].DEVICE_TYPE + "','AREA_ANA':'" + list[i].AREA_ANA + "','IS_IMPORTANT':'" + IS_IMPORTANT + "','DURATION':'" + list[i].DURATION + "','CREAT_TIME':'" + list[i].CREAT_TIME + "','UPDATE_TIME':'" + list[i].UPDATE_TIME + "','UPDATOR':'" + list[i].UPDATOR + "','THRESHOLD_MAXTEMP':'" + list[i].THRESHOLD_MAXTEMP + "','THRESHOLD_MAXTEMPDIFF':'" + list[i].THRESHOLD_MAXTEMPDIFF + "','DISTRICT_CODE':'" + list[i].DISTRICT_CODE + "','CZ':'" + url + "','code':'" + list[i].CODE + "','id':'X" + list[i].ID + "'},";
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

    private static SubstationMonitorAreaCond getSubstationCode(SubstationCond substationCond, SubstationMonitorAreaCond substationMonitorArea, string treeType, string id, string pId)
    {
        string substationCode = "";
        switch (treeType)
        {
            case "J":
                substationCond.BUREAU_CODE = id;
                substationCode = Api.ServiceAccessor.GetFoundationService().getSubstationByType(substationCond);
                if (string.IsNullOrEmpty(substationCode))
                {
                    substationMonitorArea.businssAnd = " 1=2 ";
                }
                break;
            case "GDD":
                substationCond.POWER_SECTION_CODE = id;
                substationCode = Api.ServiceAccessor.GetFoundationService().getSubstationByType(substationCond);
                if (string.IsNullOrEmpty(substationCode))
                {
                    substationMonitorArea.businssAnd = " 1=2 ";
                }
                break;
            case "WZ":
                substationMonitorArea.P_CODE = id;
                break;
            case "KMP":
                substationMonitorArea.CODE = id;
                break;
            default:
                if ("SUBSTATIONTYPE" == treeType)
                {
                    substationCond.SUBSTATION_TYPE = id;
                    substationCond.POWER_SECTION_CODE = pId;
                    substationCode = Api.ServiceAccessor.GetFoundationService().getSubstationByType(substationCond);
                }
                else
                {
                    substationCode = id;
                }

                break;
        }
        if (!string.IsNullOrEmpty(substationCode))
        {
            substationMonitorArea.SUBSTATION_CODE = PublicMethod.GetConversionCode(substationCode);
        }

        return substationMonitorArea;
    }
    public void getUpdate()
    {
        bool str = false;
        try
        {
            string name = HttpContext.Current.Request["Name"];
            string DEVICE_TYPE = HttpContext.Current.Request["DEVICE_TYPE"];
            string AREA_ANA = HttpContext.Current.Request["AREA_ANA"];
            string IS_IMPORTANT = HttpContext.Current.Request["IS_IMPORTANT"];
            string DURATION = HttpContext.Current.Request["DURATION"];
            string Code = HttpContext.Current.Request["Code"];
            string THRESHOLD_MAXTEMP = HttpContext.Current.Request["THRESHOLD_MAXTEMP"];
            string THRESHOLD_MAXTEMPDIFF = HttpContext.Current.Request["THRESHOLD_MAXTEMPDIFF"];
            string DISTRICT_CODE = HttpContext.Current.Request["DISTRICT_CODE"];
            SubstationMonitorArea substationMonitorArea = Api.ServiceAccessor.GetFoundationService().getSubstationMonitorAreaByCode(Code);
            substationMonitorArea.CODE = Code;
            substationMonitorArea.NAME = name;
            substationMonitorArea.AREA_ANA = AREA_ANA;
            substationMonitorArea.IS_IMPORTANT = IS_IMPORTANT;
            substationMonitorArea.DURATION = DURATION;
            substationMonitorArea.UPDATE_TIME = DateTime.Now;
            substationMonitorArea.THRESHOLD_MAXTEMP = THRESHOLD_MAXTEMP;
            substationMonitorArea.THRESHOLD_MAXTEMPDIFF = THRESHOLD_MAXTEMPDIFF;
            substationMonitorArea.DISTRICT_CODE = DISTRICT_CODE;
            str = ServiceAccessor.GetFoundationService().substationMonitorAreaUpdate(substationMonitorArea);
        }
        catch (Exception)
        {

            throw;
        }
        finally
        {
            HttpContext.Current.Response.Write(str);


        }
    }
    /// <summary>
    /// 删除
    /// </summary>
    private void Delete()
    {
        bool str = false;
        try
        {
            string code = HttpContext.Current.Request["Code"];
            str = ServiceAccessor.GetFoundationService().substationMonitorAreaDelete(code);
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

    public void getAdd()
    {
        bool str = false;
        try
        {
            string pCode = HttpContext.Current.Request["pCode"];
            string treeCode = HttpContext.Current.Request["treeCode"];
            string REPORT_CODE = HttpContext.Current.Request["REPORT_CODE"];
            string NAME = HttpContext.Current.Request["NAME"];
            string DATA_TYPE = HttpContext.Current.Request["DATA_TYPE"];
            string DEVICE_TYPE = HttpContext.Current.Request["DEVICE_TYPE"];
            string AREA_ANA = HttpContext.Current.Request["AREA_ANA"];
            string IS_IMPORTANT = HttpContext.Current.Request["IS_IMPORTANT"];
            string DURATION = HttpContext.Current.Request["DURATION"];
            string DISTRICT_CODE = HttpContext.Current.Request["DISTRICT_CODE"];
            string THRESHOLD_MAXTEMP = HttpContext.Current.Request["THRESHOLD_MAXTEMP"];
            string THRESHOLD_MAXTEMPDIFF = HttpContext.Current.Request["THRESHOLD_MAXTEMPDIFF"];
            string SubType = HttpContext.Current.Request["SubType"];
            C6_Device c6device = new C6_Device();

            c6device.P_CODE = pCode;
            c6device.NAME = NAME;
            c6device.AREA_ANA = AREA_ANA;
            if (DATA_TYPE == "WZ")
            {

                c6device.CODE = REPORT_CODE;
            }
            else
            {
                c6device.CODE = pCode + REPORT_CODE;
            }
            c6device.DATA_TYPE = DATA_TYPE;
            c6device.DEVICE_TYPE = DEVICE_TYPE;
            c6device.IS_IMPORTANT = IS_IMPORTANT;
            c6device.DURATION = DURATION;
            c6device.REPORT_CODE = REPORT_CODE;
            if (SubType == "WZ")
            {

                c6device.TREE_PATH = treeCode + "," + REPORT_CODE;
            }
            else
            {
                c6device.TREE_PATH = treeCode + "," + pCode + REPORT_CODE;
            }

            c6device.DISTRICT_CODE = DISTRICT_CODE;
            c6device.THRESHOLD_MAXTEMP = THRESHOLD_MAXTEMP;
            c6device.THRESHOLD_MAXTEMPDIFF = THRESHOLD_MAXTEMPDIFF;
            c6device.CREAT_TIME = DateTime.Now;
            str = Api.ServiceAccessor.GetFoundationService().c6deviceAdd(c6device);
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
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}