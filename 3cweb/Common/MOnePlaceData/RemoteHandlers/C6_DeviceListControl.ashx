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

            //获取树
            case "tree":
                getTree();
                break;
            //查询设备
            case "all":
                getSelect(context);
                break;
            case "Page":
                //getSelectPage(context);
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

    public void getTree()
    {
        string sql1 = "select code,name,p_code ,c6level ,notes,code,tree_path ,tree_path from C6_DEVICE where p_code='0'";
        DataSet ds1 = DbHelperOra.Query(sql1);
        StringBuilder Json = new StringBuilder();
        Json.Append("[");
        for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
        {
            Json.Append("{");
            Json.Append("id:\"" + ds1.Tables[0].Rows[i][0].ToString() + "\",");
            Json.Append("pId:\"" + "0" + "\",");
            Json.Append("name:\"" + ds1.Tables[0].Rows[i][1].ToString() + "\",");
            Json.Append("click:\"TreeClick('" + ds1.Tables[0].Rows[i][6].ToString() + "','" + ds1.Tables[0].Rows[i][1].ToString() + "@@" + ds1.Tables[0].Rows[i][0].ToString() + "@@" + ds1.Tables[0].Rows[i][6].ToString() + "','Ju')\"");
            Json.Append("},");
            string sql2 = "select code,name,p_code ,c6level ,notes,code,tree_path  from C6_DEVICE where p_code='" + ds1.Tables[0].Rows[i][0].ToString() + "'";
            DataSet ds2 = DbHelperOra.Query(sql2);
            for (int j = 0; j < ds2.Tables[0].Rows.Count; j++)
            {
                Json.Append("{");
                Json.Append("id:\"" + ds2.Tables[0].Rows[j][0].ToString() + "\",");
                Json.Append("pId:\"" + ds1.Tables[0].Rows[i][0].ToString() + "\",");
                Json.Append("name:\"" + ds2.Tables[0].Rows[j][1].ToString() + "\",");
                Json.Append("click:\"TreeClick('" + ds2.Tables[0].Rows[j][6].ToString() + "','" + ds2.Tables[0].Rows[i][1].ToString() + "@@" + ds2.Tables[0].Rows[j][0].ToString() + "@@" + ds2.Tables[0].Rows[j][6].ToString() + "','Duan')\"");
                Json.Append("},");
                string sql3 = "select code,name,p_code ,c6level ,notes,code,tree_path  from C6_DEVICE where p_code='" + ds2.Tables[0].Rows[j][0].ToString() + "'";
                DataSet ds3 = DbHelperOra.Query(sql3);
                for (int k = 0; k < ds3.Tables[0].Rows.Count; k++)
                {
                    Json.Append("{");
                    Json.Append("id:\"" + ds3.Tables[0].Rows[k][0].ToString() + "\",");
                    Json.Append("pId:\"" + ds2.Tables[0].Rows[j][0].ToString() + "\",");
                    Json.Append("name:\"" + ds3.Tables[0].Rows[k][1].ToString() + "\",");
                    Json.Append("click:\"TreeClick('" + ds3.Tables[0].Rows[k][6].ToString() + "','" + ds3.Tables[0].Rows[k][1].ToString() + "@@" + ds3.Tables[0].Rows[k][0].ToString() + "@@" + ds3.Tables[0].Rows[k][6].ToString() + "','WZ')\"");
                    Json.Append("},");
                    string sql4 = "select code,name,p_code ,c6level ,notes,code,tree_path  from C6_DEVICE where p_code='" + ds3.Tables[0].Rows[k][0].ToString() + "'";
                    DataSet ds4 = DbHelperOra.Query(sql4);
                    for (int n = 0; n < ds4.Tables[0].Rows.Count; n++)
                    {
                        Json.Append("{");
                        Json.Append("id:\"" + ds4.Tables[0].Rows[n][0].ToString() + "\",");
                        Json.Append("pId:\"" + ds3.Tables[0].Rows[k][0].ToString() + "\",");
                        Json.Append("name:\"" + ds4.Tables[0].Rows[n][1].ToString() + "\",");
                        Json.Append("click:\"TreeClick('" + ds4.Tables[0].Rows[n][6].ToString() + "','" + ds4.Tables[0].Rows[n][1].ToString() + "@@" + ds4.Tables[0].Rows[n][0].ToString() + "@@" + ds4.Tables[0].Rows[n][6].ToString() + "','SUB')\"");
                        Json.Append("},");
                        string sql5 = "select code,name,p_code ,c6level ,notes,code,tree_path  from C6_DEVICE where p_code='" + ds4.Tables[0].Rows[n][0].ToString() + "'";
                        DataSet ds5 = DbHelperOra.Query(sql5);
                        for (int m = 0; m < ds5.Tables[0].Rows.Count; m++)
                        {
                            Json.Append("{");
                            Json.Append("id:\"" + ds5.Tables[0].Rows[m][0].ToString() + "\",");
                            Json.Append("pId:\"" + ds4.Tables[0].Rows[n][0].ToString() + "\",");
                            Json.Append("name:\"" + ds5.Tables[0].Rows[m][1].ToString() + "\",");
                            Json.Append("click:\"TreeClick('" + ds5.Tables[0].Rows[m][6].ToString() + "','" + ds5.Tables[0].Rows[m][1].ToString() + "@@" + ds5.Tables[0].Rows[m][0].ToString() + "@@" + ds5.Tables[0].Rows[m][6].ToString() + "','W')\"");
                            Json.Append("},");
                            string sql6 = "select code,name,p_code ,c6level ,notes,code,tree_path  from C6_DEVICE where  p_code='" + ds5.Tables[0].Rows[m][0].ToString() + "'";
                            DataSet ds6 = DbHelperOra.Query(sql6);
                            for (int h = 0; h < ds6.Tables[0].Rows.Count; h++)
                            {
                                Json.Append("{");
                                Json.Append("id:\"" + ds6.Tables[0].Rows[h][0].ToString() + "\",");
                                Json.Append("pId:\"" + ds5.Tables[0].Rows[m][0].ToString() + "\",");
                                Json.Append("name:\"" + ds6.Tables[0].Rows[h][1].ToString() + "\",");
                                Json.Append("click:\"TreeClick('" + ds6.Tables[0].Rows[h][6].ToString() + "','" + ds6.Tables[0].Rows[h][1].ToString() + "@@" + ds6.Tables[0].Rows[h][0].ToString() + "@@" + ds6.Tables[0].Rows[h][6].ToString() + "','SB')\"");
                                Json.Append("},");

                            }

                        }
                    }
                }
            }
        }
        string json = Json.ToString().Substring(0, Json.Length - 1);
        json += "]";
        Json.Clear();
        Json.Append(json);
        HttpContext.Current.Response.Write(Json);
        
        
    }

    public void getSelect(HttpContext context)
    {  //获取前台页码
        int pageIndex = Convert.ToInt32(HttpContext.Current.Request["page"]);
        //获取前台条数
        int pageSize = Convert.ToInt32(HttpContext.Current.Request["rp"]);
        string name = HttpContext.Current.Request["Name"];
        string Tree_Path = HttpContext.Current.Request["Tree_Path"];
        C6_DeviceCond c6device = new C6_DeviceCond();
        if (name != "")
        {
            c6device.businssAnd = " NAME like '%" + name + "%'";
        }
        if (Tree_Path != "")
        {
            if (c6device.businssAnd != null)
            {
                c6device.businssAnd += " and ";
            }
            c6device.businssAnd += " tree_path like '%" + Tree_Path + "%'";
        }
        c6device.pageNum = pageIndex;
        c6device.pageSize = pageSize;
        c6device.DATA_TYPE = "KMP";

      //  c6device.RightFilter = Api.Util.UserPermissionc.GetDataPermission("");
        
        IList<C6_Device> list = Api.ServiceAccessor.GetFoundationService().queryC6_device(c6device);
        int recordCount = ServiceAccessor.GetFoundationService().getC6_deviceCount(c6device);
        string jsonStr = "";
        if (list != null)
        {
            jsonStr = "{'rows':[";
            for (int i = 0; i < list.Count; i++)
            {
                C6_Device c6device1 = Api.ServiceAccessor.GetFoundationService().getC6DeviceByCode(list[i].P_CODE);
                C6_Device c6device2 = Api.ServiceAccessor.GetFoundationService().getC6DeviceByCode(c6device1.P_CODE);
                jsonStr += "{'NAME':'" + list[i].NAME + "','SubstationName':'" + c6device2.NAME + "','SBWZ':'" + c6device1.NAME + "','C6LEVEL':'" + list[i].C6LEVEL + "','DATA_TYPE':'" + list[i].DATA_TYPE + "','DEVICE_TYPE':'" + list[i].DEVICE_TYPE + "','AREA_ANA':'" + list[i].AREA_ANA + "','IS_IMPORTANT':'" + list[i].IS_IMPORTANT + "','DURATION':'" + list[i].DURATION + "','CREAT_TIME':'" + list[i].CREAT_TIME + "','UPDATE_TIME':'" + list[i].UPDATE_TIME + "','UPDATOR':'" + list[i].UPDATOR + "','THRESHOLD_MAXTEMP':'" + list[i].THRESHOLD_MAXTEMP + "','THRESHOLD_MAXTEMPDIFF':'" + list[i].THRESHOLD_MAXTEMPDIFF + "','DISTRICT_CODE':'" + list[i].DISTRICT_CODE + "','MY_INT_1':'" + list[i].MY_INT_1 + "','code':'" + list[i].CODE + "','id':'X" + list[i].ID + "'},";
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
            C6_DeviceCond c6device = new C6_DeviceCond();
            c6device.CODE = Code;
            c6device.NAME = name;
            c6device.DEVICE_TYPE = DEVICE_TYPE;
            c6device.AREA_ANA = AREA_ANA;
            c6device.IS_IMPORTANT = IS_IMPORTANT;
            c6device.DURATION = DURATION;
            c6device.UPDATE_TIME = DateTime.Now;
            c6device.THRESHOLD_MAXTEMP = THRESHOLD_MAXTEMP;
            c6device.THRESHOLD_MAXTEMPDIFF = THRESHOLD_MAXTEMPDIFF;
            c6device.DISTRICT_CODE = DISTRICT_CODE;
            str = ServiceAccessor.GetFoundationService().c6deviceUpdate(c6device);
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
            str = ServiceAccessor.GetFoundationService().c6deviceDelete(code);
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
            if (SubType == "WZ")
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