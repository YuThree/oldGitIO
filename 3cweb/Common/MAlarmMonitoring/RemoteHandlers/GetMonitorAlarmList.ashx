<%@ WebHandler Language="C#" Class="GetMonitorAlarmList" %>

using System;
using System.Web;
using System.IO;
using System.Data;
using System.Collections.Generic;
using Api.Fault.entity.alarm;
using Api.Foundation.entity.Cond;
using Api.Foundation.entity.Foundation;
using System.Configuration;
using System.Collections;
using System.Text;
public class GetMonitorAlarmList : ReferenceClass, IHttpHandler
{
    public void ProcessRequest(HttpContext context)
    {

        //获取前台页码
        int pageIndex = Convert.ToInt32(HttpContext.Current.Request["page"]);
        //获取前台条数
        int pageSize = Convert.ToInt32(HttpContext.Current.Request["rp"]);

        AlarmCond alarmCond = my_alarm.GetAlarmCond_byDPC();

        //读取web.config中的典型缺陷开关 用外部版演示时，配置为1，则只展示典型缺陷 BY TJY 2017.08.14
        string fileType =Api.Util.Common.ParamterDic["Is_Typical"].VALUE;

        if (fileType == "1")
        {
            alarmCond.IS_TYPICAL = "1";
        }

        string font1 = "";//行字体颜色开头
        string font2 = "";//行字体颜色结尾
        //获取报警list
        List<Alarm> list = Api.ServiceAccessor.GetAlarmService().getAlarm(alarmCond);
        //获取总条数
        int recordCount = Api.ServiceAccessor.GetAlarmService().getAlarmCount(alarmCond);
        StringBuilder jsonStr = new StringBuilder();
        jsonStr.Append("{'rows':[");
        for (int i = 0; i < list.Count; i++)
        {
            string spanL = "<span class=\\\"status\\\">";
            string spanR = "</span>";
            string status = Api.Util.Common.getSysDictionaryInfo(list[i].STATUS).CODE_NAME ;//状态
            string Summary = "";
            Summary = PublicMethod.GetSummaryByAlarm(list[i]);
            int yingdian = list[i].NVALUE12 >= list[i].NVALUE11 ? list[i].NVALUE12 : list[i].NVALUE11;
            //if (list[i].STATUS == "AFSTATUS01")
            //{
            //    status = "<font color=red>" + status + "</font>";
            //}

            if (status == "已确认" || status == "新缺陷")
            {
                font1 = "<font color=red>";
                font2 = "</font>";
            }
            else if (status == "已取消" || status == "已关闭")
            {
                font1 = "<font color=green>";
                font2 = "</font>";
            }
            else if (status == "已计划")
            {
                font1 = "<font color=#a88809>";
                font2 = "</font>";
            }
            else if (status == "检修中")
            {
                font1 = "<font color=#2e93e1>";
                font2 = "</font>";
            }
            else
            {
                font1 = "<font>";
                font2 = "</font>";
            }

            jsonStr.Append("{'G_DUAN_ORG':'" + font1 + list[i].POWER_SECTION_NAME + font2 + "',");//段
            jsonStr.Append("'G_CJ_ORG':'" + font1 + list[i].WORKSHOP_NAME + font2 + "',");//车间
            if (!string.IsNullOrEmpty(list[i].ORG_NAME) && list[i].ORG_NAME.Contains("工区"))
            {
                jsonStr.Append("'G_TSYS_ORG':'" + font1 + list[i].ORG_NAME + font2 + "',");//工区
            }
            else
            {
                jsonStr.Append("'G_TSYS_ORG':'" + font1 + "" + font2 + "',");//工区
            }
            jsonStr.Append("'LINE_CODE':'" + font1 + list[i].LINE_NAME + font2 + "',");//线路
            jsonStr.Append("'G_JU':'" + font1 + list[i].BUREAU_NAME + font2 + "',");//局

            jsonStr.Append("'STAGGER':'" + font1 + (list[i].NVALUE13.ToString() == "-1000" ? "" : list[i].NVALUE13.ToString()) + font2 + "',");//1C 拉出值 列表展示
            jsonStr.Append("'LINEHEIGHT':'" + font1 + (list[i].NVALUE15.ToString() == "-1000" ? "" : list[i].NVALUE15.ToString()) + font2 + "',");//1C 导高值 列表展示
            jsonStr.Append("'NETV':'" + font1 + (list[i].NVALUE20.ToString() == "-1000" ? "" : list[i].NVALUE20.ToString()) + font2 + "',");//1C 网压 列表展示
            jsonStr.Append("'HARDPOINT':'" + font1 + (yingdian == -1000 ? "" : yingdian.ToString()) + font2 + "',");//1C 硬点 列表展示

            jsonStr.Append("'checkbox':'<input type=checkbox class=cb_item value=" + list[i].ID + " />',");//报警分析

            if (list[i].CATEGORY_CODE == "6C")
            {
                jsonStr.Append("'POSITION_CODE':'" + font1 + list[i].SUBSTATION_NAME + font2 + "',");//变电所
            }
            else
            {
                jsonStr.Append("'POSITION_CODE':'" + font1 + list[i].POSITION_NAME + font2 + "',");//区站
            }
            jsonStr.Append("'CATEGORY_CODE':'" + font1 + list[i].CATEGORY_CODE + font2 + "',");//数据类型
            jsonStr.Append("'CATEGORY':'" + font1 + PublicMethod.getCode_Name(list[i].CATEGORY_CODE) + font2 + "',");//数据类型
            if (list[i].KM_MARK == 0)//当前逻辑为KM_MARK等于0即为公里标不存在，待修改
            {
                jsonStr.Append("'KM_MARK':'" + font1 + "无"  + font2 +"',");//公里标
            }
            else
            {
                jsonStr.Append("'KM_MARK':'" + font1 + PublicMethod.KmtoString(list[i].KM_MARK) + font2 + "',");//公里标
            }
            if (String.IsNullOrEmpty(list[i].POLE_NUMBER))
            {
                jsonStr.Append("'POLE_NUMBER':'" + font1 + "无" + font2 + "',");//杆号
            }
            else
            {
                jsonStr.Append("'POLE_NUMBER':'" + font1 + list[i].POLE_NUMBER + font2 + "',");//杆号                
            }
            jsonStr.Append("'WZ':'" + font1 + PublicMethod.GetWZbyAlarm(list[i],"1") + font2 + "',");//位置信息       ""
            jsonStr.Append("'SUMMARY':'" + font1 + RepClear(Summary) + font2 + "',");//list[i].SUMMARYDIC.CODE_NAME缺陷类型
            jsonStr.Append("'SEVERITY':'" + font1 + Api.Util.Common.getSysDictionaryInfo(list[i].SEVERITY).CODE_NAME + font2 + "',");//级别
            jsonStr.Append("'QXTYPE':'" + font1 + list[i].CODE_NAME + font2 + "',");//报警类型
            jsonStr.Append("'C4TYPE':'" + font1 + (list[i].DETECT_DEVICE_CODE == "小C4检测车"?1:0) + font2 + "',");//c4类型
            //if (list[i].CATEGORY_CODE == "3C")
            //{
            //    jsonStr.Append("'CREATED_TIME':'" + list[i].RAISED_TIME.ToString("yyyy-MM-dd HH:mm:ss") + "',");//发生时间 
            //}
            //else
            //{
            //    jsonStr.Append("'CREATED_TIME':'" + list[i].RAISED_TIME.ToString("yyyy-MM-dd HH:mm:ss") + "',");//发生时间
            //}

            jsonStr.Append("'CREATED_TIME':'" + font1 + list[i].RAISED_TIME.ToString("yyyy-MM-dd HH:mm:ss") + font2 + "',");//发生时间
            jsonStr.Append("'arguments_1C':' <span class=\\\"label arguments-1C\\\">  <i  class=\\\"icon icon-note icon-white\\\" ></i>   </span> ',");//1C参数
            jsonStr.Append("'IMG_2C':' <span class=\\\"label image-2C\\\">  <i  class=\\\"icon icon-image icon-white\\\" ></i>   </span> ',");//2C图片图标
            jsonStr.Append("'IMG_4C':' <span class=\\\"label image-4C\\\">  <i  class=\\\"icon icon-image icon-white\\\" ></i>   </span> ',");//4C图片图标
            jsonStr.Append("'IMG_COLLECT_DPC':' <span class=\\\"label cursor-pointer image-collect-DPC\\\">  <i  class=\\\"icon i_save icon-star-on icon-white\\\" ></i>   </span> ',");//DPC综合报警列表显示图片和收藏
            jsonStr.Append("'SELECT_DPC':' <select code=\\\""+list[i].ID+"\\\" class=\\\"table_select\\\"><option value=\\\"0\\\">无</option><option value=\\\"Mission\\\">转任务</option><option value=\\\"Canc\\\">取消</option></select ',");//DPC综合报警列表收藏类型选项

            if (list[i].CATEGORY_CODE == "2C" && list[i].NVALUE7 == 2)//判断NVLUE7是否等于2是因为NVALUE7标志着2C报警是否成功提取100W和500W图像
            {
                if (list[i].DETECT_DEVICE_CODE == "2C行车记录仪")
                {
                    jsonStr.Append("'C2500Img':'',");
                    jsonStr.Append("'C2100Img':'" + PublicMethod.GetFullDir(list[i]) + list[i].GetImgFileName_2C("350W") + "',");//+ "100W_" + list[i].POLE_NUMBER + "_" + list[i].KM_MARK/1000 + "_" + list[i].NVALUE1 + ".jpg" + "',");//100W相机缺陷帧图片路径
                }
                else
                {
                    jsonStr.Append("'C2500Img':'" + PublicMethod.GetFullDir(list[i]) + list[i].GetImgFileName_2C("500W") + "',");// + "500W_" + list[i].POLE_NUMBER + "_" + list[i].KM_MARK/1000 + "_" + list[i].NVALUE1 + ".jpg" + "',");//500w相机缺陷帧图片路径 
                    jsonStr.Append("'C2100Img':'" + PublicMethod.GetFullDir(list[i]) + list[i].GetImgFileName_2C("100W") + "',");//+ "100W_" + list[i].POLE_NUMBER + "_" + list[i].KM_MARK/1000 + "_" + list[i].NVALUE1 + ".jpg" + "',");//100W相机缺陷帧图片路径
                }
            }
            else
            {
                //未成功提取
                jsonStr.Append("'C2500Img':'',");
                jsonStr.Append("'C2100Img':'',");
            }

            if (list[i].CATEGORY_CODE == "3C")
            {
                jsonStr.Append("'C3IRV':'" + font1 + PublicMethod.GetFullDir(list[i]) + list[i].SVALUE11 + font2 + "',");
                jsonStr.Append("'C3VI':'" + font1 + PublicMethod.GetFullDir(list[i]) + list[i].SVALUE5 + font2 + "',");
                jsonStr.Append("'C3OA':'" + font1 + PublicMethod.GetFullDir(list[i]) + list[i].SVALUE9 + font2 + "',");
            }
            else
            {
                jsonStr.Append("'C3IRV':'',");
                jsonStr.Append("'C3VI':'',");
                jsonStr.Append("'C3OA':'',");
            }

            if (list[i].CATEGORY_CODE == "4C" && !String.IsNullOrEmpty(list[i].SVALUE4))//列表展示4C缺陷帧图片
            {
                //jsonStr.Append("'C4Fault':'" + PublicMethod.FtpRoot + "/" + list[i].DIR_PATH + "/" +)

                string pN = list[i].SVALUE4.Replace("A_","").Replace("B_","");

                if (list[i].Get4CType() == "小C4")//判断是否是自研设备
                {
                    jsonStr.Append("'C4FaultImg':'" + PublicMethod.GetFullDir(list[i]) + "/" + list[i].GetImgFileName(pN) + "',");
                    jsonStr.Append("'C4AllImg':'" + PublicMethod.GetFullDir(list[i]) + "/" + list[i].GetImgFileName("200W") + "',");
                }
                else
                {
                    //老4C 图片命名规则：支柱号_公里标_播放目录_标识缺陷的镜头编号_缺陷当前帧号.jpg
                    //    jsonStr.Append("'C4FaultImg':'" + PublicMethod.GetFullDir(list[i]) + "/" + list[i].POLE_NUMBER + "_" + list[i].KM_MARK + "_" + Conver(list[i].SVALUE1) + "_" + Conver(list[i].SVALUE4) + "_" + list[i].NVALUE4 + ".jpg" + "',");
                    jsonStr.Append("'C4FaultImg':'" + PublicMethod.GetFullDir(list[i]) + "/" + list[i].GetImgFileName(pN) + "',");

                    if (list[i].SVALUE4.IndexOf('A') > -1)
                    {
                        jsonStr.Append("'C4AllImg':'" + PublicMethod.GetFullDir(list[i]) + "/" +list[i].GetImgFileName(list[i].SVALUE2) + "',");
                    }
                    else
                    {
                        jsonStr.Append("'C4AllImg':'" + PublicMethod.GetFullDir(list[i]) + "/" +list[i].GetImgFileName(list[i].SVALUE3)+ "',");
                    }
                }
            }
            else
            {
                jsonStr.Append("'C4FaultImg':'',");
                jsonStr.Append("'C4AllImg':'',");
            }
            if (list[i].CATEGORY_CODE == "DailyWalk" && !string.IsNullOrEmpty(list[i].SVALUE5))
            {
                string DailyWalkFaultImg = "";
                string[] pic = list[i].SVALUE5.Split(';');
                for (int j = 0; j < pic.Length; j++)
                {
                    if (!string.IsNullOrEmpty(pic[j]))
                    {
                        if (pic[j].IndexOf(".jpeg", StringComparison.OrdinalIgnoreCase) > -1 || pic[j].IndexOf(".bmp", StringComparison.OrdinalIgnoreCase) > -1 || pic[j].IndexOf(".png", StringComparison.OrdinalIgnoreCase) > -1 || pic[j].IndexOf(".gif", StringComparison.OrdinalIgnoreCase) > -1 || pic[j].IndexOf(".jpg", StringComparison.OrdinalIgnoreCase) > -1)
                        {
                            DailyWalkFaultImg = pic[j];
                            break;
                        }
                    }
                }
                jsonStr.Append("'DailyWalkFaultImg':'" + "/" + DailyWalkFaultImg + "',");
            }
            else
            {
                jsonStr.Append("'DailyWalkFaultImg':'',");
            }

            jsonStr.Append("'STATUS':'"+font1 + spanL + status + spanR +font2+ "',");//状态
            jsonStr.Append("'ID':'C" + list[i].ID + "'");
            jsonStr.Append(i == list.Count - 1 ? "}" : "},");
        }

        jsonStr.Append("],'page':'" + pageIndex + "','rp':'" + pageSize + "','total':'" + recordCount + "'}");
        jsonStr = jsonStr.Replace("'", "\"");
        string re = jsonStr.ToString();
        if (!string.IsNullOrEmpty(HttpContext.Current.Request["remove"]))
        {
            re = myfiter.RemoveHTML(re, 0);
        }
        HttpContext.Current.Response.Write(re);


    }


    public string RepClear(string old)
    {
        if (!String.IsNullOrEmpty(old))
        {
            return old.Replace("\r\n", "").Replace("\n", "").Replace("\r", "");
        }
        else
        {
            return old;
        }

    }

    private string Conver(string str)
    {
        if (!string.IsNullOrEmpty(str))
            str = str.Replace("\\", "/");
        return str;
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}