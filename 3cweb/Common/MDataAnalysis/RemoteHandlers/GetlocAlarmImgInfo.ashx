<%@ WebHandler Language="C#" Class="GetlocAlarmImgInfo" %>

using System.Web;
using Api.Fault.entity.alarm;
using System.Text;
using SharedDefinition.Definitions;
using System.Web.Script.Serialization;

public class GetlocAlarmImgInfo : ReferenceClass, IHttpHandler
{


    public void ProcessRequest(HttpContext context)
    {
        //获取C3ID
        string alarmid = HttpContext.Current.Request["alarmid"];
        //返回值
        StringBuilder result = new StringBuilder();
        C3_Alarm c3Alarm = Api.ServiceAccessor.GetAlarmService().getC3Alarm(alarmid);
        JavaScriptSerializer jss = new JavaScriptSerializer();

        FrameInfo[] fbi = jss.Deserialize<FrameInfo[]>(c3Alarm.FRAME_INFO_LIST);
        MyFrameInfo[] mfb = new MyFrameInfo[fbi.Length];
        for (int i = 0; i < fbi.Length; i++)
        {
            mfb[i] = new MyFrameInfo();

            mfb[i].FRAME_NO = fbi[i].FRAME_NO;
            mfb[i].KM_MARK = (int)fbi[i].KM_MARK;
            mfb[i].LINE_HEIGHT = myfiter.GetLINE_HEIGHT(fbi[i].LINE_HEIGHT, "mm");
            mfb[i].PULLING_VALUE = myfiter.GetPULLING_VALUE(fbi[i].PULLING_VALUE, "mm");
            mfb[i].ROUTING_NO = fbi[i].ROUTING_NO;
            mfb[i].SPEED = myfiter.GetSpeed(fbi[i].SPEED, "km/h");
            mfb[i].TEMP_ENV = myfiter.GetTEMP(fbi[i].TEMP_ENV, "℃");
            mfb[i].TEMP_IRV = myfiter.GetTEMP(fbi[i].TEMP_IRV, "℃");
        }
        c3Alarm.FRAME_INFO_LIST = jss.Serialize(mfb);
        //c3Alarm.FRAME_INFO_LIST = jss.Serialize(fbi.FRAME_INFO);
        string locname;//标题描述
        string localarminfo;//报警描述
        locname = PublicMethod.GetPositionByAlarmid(c3Alarm);
        localarminfo = "最高温度:" + double.Parse(c3Alarm.MAX_TEMP.ToString()) / 100 + "℃&nbsp;" + "环境温度:" + double.Parse(c3Alarm.ENV_TEMP.ToString()) / 100 + "℃&nbsp;" + "导高值:" + c3Alarm.LINE_HEIGHT + "mm&nbsp;" + "拉出值:" + c3Alarm.PULLING_VALUE + "mm&nbsp;" + "速度:" + c3Alarm.SPEED + "km/h&nbsp;";

        result.Append("{\"IR_PICS\":" + c3Alarm.IR_PICS + ","); //红外图片
        result.Append("\"VI_PICS\":" + c3Alarm.VI_PICS + ",");//可见光
        result.Append("\"FRAME_INFO\":" + c3Alarm.FRAME_INFO + ",");//字幕
        result.Append("\"PLAY_IDX\":" + c3Alarm.PLAY_IDX + ",");//播放索引
        result.Append("\"FRAME_INFO_LIST\":" + c3Alarm.FRAME_INFO_LIST + ",");//红光温度，环境温度等。。
        result.Append("\"ch\":\"" + c3Alarm.DETECT_DEVICE_CODE + "\",");//车号  
        result.Append("\"ID\":\"" + c3Alarm.ID + "\",");//ID  
        result.Append("\"fssj\":\"" + c3Alarm.RAISED_TIME + "\",");//发生时间  
        result.Append("\"line\":\"" + c3Alarm.LINE_NAME + "\",");//线路  
        result.Append("\"position\":\"" + c3Alarm.POSITION_NAME + "\",");//站  
        result.Append("\"km\":\"" + PublicMethod.KmtoString(c3Alarm.KM_MARK) + "\",");//公里标  
        result.Append("\"POLE_NUMBER\":\"" + c3Alarm.POLE_NUMBER + "\",");//支柱  
        result.Append("\"BRG_TUN_NAME\":\"" + c3Alarm.BRG_TUN_NAME + "\",");//桥隧  
        result.Append("\"BOW_TYPE\":\"" + c3Alarm.BOW_TYPE + "\",");//弓位置  
        result.Append("\"xb\":\"" + c3Alarm.DIRECTION + "\",");//行别  
        result.Append("\"gis_x\":\"" + c3Alarm.GIS_X + "\",");//IRV  ToString("N2")
        result.Append("\"gis_y\":\"" + c3Alarm.GIS_Y + "\",");//IRV  
        result.Append("\"locname\":\"" + locname + "\",");//标题描述
        result.Append("\"KM_MARK\":\"" + PublicMethod.KmtoString(c3Alarm.KM_MARK) + "\",");//公里标
        result.Append("\"KM_MARK_NUMBER\":\"" + (c3Alarm.KM_MARK >= my_const.MAX_KM || c3Alarm.KM_MARK <= my_const.MIN_KM ? "" : c3Alarm.KM_MARK.ToString()) + "\",");//公里标
        result.Append("\"SPEED\":\"" + c3Alarm.SPEED + "\",");//速度
        result.Append("\"SEVERITY\":\"" + c3Alarm.SEVERITY + "\",");//报警级别
        result.Append("\"WD\":\"" + myfiter.GetTEMP_MAX(c3Alarm) + "\",");//报警温度
        result.Append("\"HJWD\":\"" + myfiter.GetTEMP_ENV(c3Alarm) + "\",");//环境温度
        result.Append("\"LC\":\"" + myfiter.GetPULLING_VALUE(c3Alarm) + "\",");//拉出值
        result.Append("\"DG\":\"" + myfiter.GetLINE_HEIGHT(c3Alarm) + "\",");//导高值
        result.Append("\"STATUS_NAME\":\"" + c3Alarm.STATUS_NAME + "\",");//缺陷状态名称
        result.Append("\"CODE_NAME\":\"" + c3Alarm.CODE_NAME + "\",");//缺陷类型名称
        result.Append("\"OA_PICS\":" + (c3Alarm.OA_PICS == null ? "\"\"" : c3Alarm.OA_PICS) + ",");//全景A
        result.Append("\"OB_PICS\":" + (c3Alarm.OB_PICS == null ? "\"\"" : c3Alarm.OB_PICS) + ",");//全景B  
        result.Append("\"GT\":\"" + (c3Alarm.DETECT_DEVICE_CODE.IndexOf("CRH") > -1 ? "true" : "false") + "\",");//是否动车 
        result.Append("\"localarminfo\":\"" + localarminfo + "\"}");//报警描述
        context.Response.Write(Newtonsoft.Json.JsonConvert.DeserializeObject(result.ToString()));
        context.Response.End();
    }
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}
public class MyFrameInfo
{
    public int FRAME_NO;
    public int KM_MARK;
    public string LINE_HEIGHT;
    public string PULLING_VALUE;
    public int ROUTING_NO;
    public string SPEED;
    public string TEMP_ENV;
    public string TEMP_IRV;
}