//IS_POWER_SECTION_USER = false;
var M_DC_ShowSpeed = true;
var version = "v_DPC_3C_5.2.0"; //JS版本号
IsVersion();
var json_user = getCurUser();

document.write('<link href="/Lib/scrollBar/scrollStyle.css?r=' + version + '" rel="stylesheet" type="text/css"/>');
document.write('<link href="/Common/img/favicon.ico" rel="shortcut icon" type="image/ico"/>');
// 车头上标签样式
var labelMark_style = {
    color: "#3436D9",
    fontSize: "14px",
    'border-radius': '5px',
    backgroundColor: "rgba(250,249,249,0.8)",
    padding: "3px",
    border: "0",
    fontWeight: "bold"
};

var Ico_Loca_DC = "/Common/MRTA/img/动车.png";
var Ico_Loca_JC = "/Common/MRTA/img/机车.png";
var Ico_Loca_Width = 29.6;
var Ico_Loca_Height = 32;

var Ico_alarm_width = 25;
var Ico_alarm_heigth = 25;
var Ico_alarm_left = 0;
var Ico_alarm_top = -15;

var defaultImg = '/Common/img/暂无图片.png'; //默认的无图图片(1052*540)
var _winW = $(window).width(); //网页窗口的宽
var _winH = $(window).height(); //网页窗口的高

//后台文件路径常量（后台文件的后缀：.ashx）（命名：_根文件夹名_子模块名_后台文件名）【此行号为29，与后面的行号标记有关，若新增内容则在$(function () {开始】
// ---------------------------------------------------- 6C ----------------------------------------------------
//6C - HardDisk
var _6C_HardDisk_6CHardDiskManage = '/6C/PC/HardDisk/RemoteHandlers/6CHardDiskManage.ashx';
var _6C_HardDisk_6Cxunshi = '/6C/PC/HardDisk/RemoteHandlers/6Cxunshi.ashx';
var _6C_HardDisk_DPCPatrolAndExaminePlay = '/6C/PC/HardDisk/RemoteHandlers/DPCPatrolAndExaminePlay.ashx';
var _6C_HardDisk_GetDeviceInfo = '/6C/PC/HardDisk/RemoteHandlers/GetDeviceInfo.ashx';
//6C - MAlarmMonitoring
var _6C_MAlarmMonitoring_downAlarmStatistics = '/6C/PC/MAlarmMonitoring/RemoteHandlers/DPC_new/downAlarmStatistics.ashx';
var _6C_MAlarmMonitoring_DPCAlarmStatistics = '/6C/PC/MAlarmMonitoring/RemoteHandlers/DPC_new/DPCAlarmStatistics.ashx';
var _6C_MAlarmMonitoring_GetDPCAlarmDetail = '/6C/PC/MAlarmMonitoring/RemoteHandlers/DPC_new/GetDPCAlarmDetail.ashx';
var _6C_MAlarmMonitoring_GetAlarmLJ = '/6C/PC/MAlarmMonitoring/RemoteHandlers/GetAlarmLJ.ashx';//(文件名有重复，L40，L102，L134)
var _6C_MAlarmMonitoring_GetAlarmTD = '/6C/PC/MAlarmMonitoring/RemoteHandlers/GetAlarmTD.ashx';//(文件名有重复，L41，L103，L135)
var _6C_MAlarmMonitoring_GetC1Json = '/6C/PC/MAlarmMonitoring/RemoteHandlers/GetC1Json.ashx';//(文件名有重复，L42，L95，L104，L345)
var _6C_MAlarmMonitoring_GetC6Alarm = '/6C/PC/MAlarmMonitoring/RemoteHandlers/GetC6Alarm.ashx';//(文件名有重复，L43，L212)
var _6C_MAlarmMonitoring_GetC6Json = '/6C/PC/MAlarmMonitoring/RemoteHandlers/GetC6Json.ashx';//(文件名有重复，L44，L213)
var _6C_MAlarmMonitoring_GetC6TempJson = '/6C/PC/MAlarmMonitoring/RemoteHandlers/GetC6TempJson.ashx';//(文件名有重复，L45，L214)
var _6C_MAlarmMonitoring_GetlocAlarmImgInfo = '/6C/PC/MAlarmMonitoring/RemoteHandlers/GetlocAlarmImgInfo.ashx';//(文件名有重复，L46，L85，L136，L189，L255)
var _6C_MAlarmMonitoring_GetlocAlarmImgWdJson = '/6C/PC/MAlarmMonitoring/RemoteHandlers/GetlocAlarmImgWdJson.ashx';//(文件名有重复，L47，L86，L137，L190，L256)
var _6C_MAlarmMonitoring_GetMonitorAlarmC1Form = '/6C/PC/MAlarmMonitoring/RemoteHandlers/GetMonitorAlarmC1Form.ashx';//(文件名有重复，L48，L105)
var _6C_MAlarmMonitoring_GetMonitorAlarmC2Form = '/6C/PC/MAlarmMonitoring/RemoteHandlers/GetMonitorAlarmC2Form.ashx';//(文件名有重复，L49，L124)
var _6C_MAlarmMonitoring_GetMonitorAlarmC3Form = '/6C/PC/MAlarmMonitoring/RemoteHandlers/GetMonitorAlarmC3Form.ashx';//(文件名有重复，L50，L138)
var _6C_MAlarmMonitoring_GetMonitorAlarmC4Form = '/6C/PC/MAlarmMonitoring/RemoteHandlers/GetMonitorAlarmC4Form.ashx';//(文件名有重复，L51，L207)
var _6C_MAlarmMonitoring_GetMonitorAlarmC6Form = '/6C/PC/MAlarmMonitoring/RemoteHandlers/GetMonitorAlarmC6Form.ashx';//(文件名有重复，L52，L215)
var _6C_MAlarmMonitoring_GetMonitorDeviceForm = '/6C/PC/MAlarmMonitoring/RemoteHandlers/GetMonitorDeviceForm.ashx';
var _6C_MAlarmMonitoring_GetMonitorDeviceList = '/6C/PC/MAlarmMonitoring/RemoteHandlers/GetMonitorDeviceList.ashx';
var _6C_MAlarmMonitoring_GetMonitorDeviceMoreInfo = '/6C/PC/MAlarmMonitoring/RemoteHandlers/GetMonitorDeviceMoreInfo.ashx';
var _6C_MAlarmMonitoring_GetMonitorLocoAlarmList = '/6C/PC/MAlarmMonitoring/RemoteHandlers/GetMonitorLocoAlarmList.ashx';//(文件名有重复，L56，L76，L139)
var _6C_MAlarmMonitoring_GetMonitorLocoAlarmListFX = '/6C/PC/MAlarmMonitoring/RemoteHandlers/GetMonitorLocoAlarmListFX.ashx';//(文件名有重复，L57，L140)
var _6C_MAlarmMonitoring_GetMonitorLocoAlarmListFXTJ = '/6C/PC/MAlarmMonitoring/RemoteHandlers/GetMonitorLocoAlarmListFXTJ.ashx';//(文件名有重复，L58，L141)
var _6C_MAlarmMonitoring_locPs3orPs4 = '/6C/PC/MAlarmMonitoring/RemoteHandlers/locPs3orPs4.ashx';//(文件名有重复，L59，L142)
var _6C_MAlarmMonitoring_MonitorAlarmSave = '/6C/PC/MAlarmMonitoring/RemoteHandlers/MonitorAlarmSave.ashx';//(文件名有重复，L60，L106，L125，L143，L208，L219)
var _6C_MAlarmMonitoring_NextAlarm = '/6C/PC/MAlarmMonitoring/RemoteHandlers/NextAlarm.ashx';//(文件名有重复，L61，L144)
var _6C_MAlarmMonitoring_SubstationMontoring = '/6C/PC/MAlarmMonitoring/RemoteHandlers/SubstationMontoring.ashx';//(文件名有重复，L62，L224)
//6C - MDataAnalysis
var _6C_MDataAnalysis_GetFaultList = '/6C/PC/MDataAnalysis/RemoteHandlers/GetFaultList.ashx';
var _6C_MDataAnalysis_OrgAlarmCount = '/6C/PC/MDataAnalysis/RemoteHandlers/OrgAlarmCount.ashx';
//6C - MDetectionOfTrace
var _6C_MDetectionOfTrace_GetIRVUrlByAlarmID = '/6C/PC/MDetectionOfTrace/RemoteHandlers/GetIRVUrlByAlarmID.ashx';//(文件名有重复，L67，L154)
var _6C_MDetectionOfTrace_GetLocGJList = '/6C/PC/MDetectionOfTrace/RemoteHandlers/GetLocGJList.ashx';//(文件名有重复，L68，L155)
var _6C_MDetectionOfTrace_GetLocoGJList = '/6C/PC/MDetectionOfTrace/RemoteHandlers/GetLocoGJList.ashx';//(文件名有重复，L69，L72，L158，L163，L239)
var _6C_MDetectionOfTrace_GetMonitorLocoStateList = '/6C/PC/MDetectionOfTrace/RemoteHandlers/GetMonitorLocoStateList.ashx';//(文件名有重复，L70，L160)
//6C - MDeviceStatus
var _6C_MDeviceStatus_GetLocoGJList = '/6C/PC/MDeviceStatus/RemoteHandlers/GetLocoGJList.ashx';//(文件名有重复，L69，L72，L158，L163，L239)
//6C - MFault
var _6C_MFault_GetLocoGJList = '/6C/PC/MFault/RemoteHandlers/GetFaultListFH.ashx';
var _6C_MFault_GetLocoGJList = '/6C/PC/MFault/RemoteHandlers/GetFHForm.ashx';
var _6C_MFault_GetLocoGJList = '/6C/PC/MFault/RemoteHandlers/GetMonitorLocoAlarmList.ashx';//(文件名有重复，L56，L76，L139)
var _6C_MFault_GetLocoGJList = '/6C/PC/MFault/RemoteHandlers/GetRepareInfo.ashx';
//6C - MLiveStreaming
var _6C_MLiveStreaming_VideoDeviceInfoHandler = '/6C/PC/MLiveStreaming/RemoteHandlers/VideoDeviceInfoHandler.ashx';//(文件名有重复，L79，L171)
//6C - MRTA
var _6C_MRTA_BMapC3DataPoint = '/6C/PC/MRTA/RemoteHandlers/BMapC3DataPoint.ashx';//(文件名有重复，L81，L178，L277)
var _6C_MRTA_Get3CMrta = '/6C/PC/MRTA/RemoteHandlers/Get3CMrta.ashx';//(文件名有重复，L82，L183)
var _6C_MRTA_GetAllLineTag = '/6C/PC/MRTA/RemoteHandlers/GetAllLineTag.ashx';//(文件名有重复，L83，L184)
var _6C_MRTA_GetC3barJson = '/6C/PC/MRTA/RemoteHandlers/GetC3barJson.ashx';//(文件名有重复，L84，L185)
var _6C_MRTA_GetlocAlarmImgInfo = '/6C/PC/MRTA/RemoteHandlers/GetlocAlarmImgInfo.ashx';//(文件名有重复，L46，L85，L136，L189，L255)
var _6C_MRTA_GetlocAlarmImgWdJson = '/6C/PC/MRTA/RemoteHandlers/GetlocAlarmImgWdJson.ashx';//(文件名有重复，L47，L86，L137，L190，L256)
//6C - Nalysis
var _6C_Nalysis_Contrast = '/6C/PC/Nalysis/RemoteHandlers/Contrast.ashx';
//6C
var _6C_Portal = '/6C/RemoteHandlers/Portal.ashx';//(文件名有重复，L90，L354)
// ---------------------------------------------------- C1 ---------------------------------------------------- 后面的未验证是否重复，标记的来自于从前面的验证
//C1 - Device
var _C1_Device_DeviceForm = '/C1/PC/Device/RemoteHandlers/DeviceForm.ashx';//(文件名有重复，L93，L115，L128，L196)
var _C1_Device_DeviceList = '/C1/PC/Device/RemoteHandlers/DeviceList.ashx';
var _C1_Device_GetC1Json = '/C1/PC/Device/RemoteHandlers/GetC1Json.ashx';//(文件名有重复，L42，L95，L104，L345)
var _C1_Device_GetQX = '/C1/PC/Device/RemoteHandlers/GetQX.ashx';
var _C1_Device_GetTD = '/C1/PC/Device/RemoteHandlers/GetTD.ashx';
//C1 - Event
var _C1_Event_Contrast = '/C1/PC/Event/RemoteHandlers/C1EventContral.ashx';
var _C1_Event_Contrast = '/C1/PC/Event/RemoteHandlers/C1EventContrast.ashx';
//C1 - MAlarmMonitoring
var _C1_MAlarmMonitoring_GetAlarmLJ = '/C1/PC/MAlarmMonitoring/RemoteHandlers/GetAlarmLJ.ashx';//(文件名有重复，L40，L102，L134)
var _C1_MAlarmMonitoring_GetAlarmTD = '/C1/PC/MAlarmMonitoring/RemoteHandlers/GetAlarmTD.ashx';//(文件名有重复，L41，L103，L135)
var _C1_MAlarmMonitoring_GetC1Json = '/C1/PC/MAlarmMonitoring/RemoteHandlers/GetC1Json.ashx';//(文件名有重复，L42，L95，L104，L345)
var _C1_MAlarmMonitoring_GetMonitorAlarmC1Form = '/C1/PC/MAlarmMonitoring/RemoteHandlers/GetMonitorAlarmC1Form.ashx';//(文件名有重复，L48，L105)
var _C1_MAlarmMonitoring_MonitorAlarmSave = '/C1/PC/MAlarmMonitoring/RemoteHandlers/MonitorAlarmSave.ashx';//(文件名有重复，L60，L106，L125，L143，L208，L219)
//C1 - RemoteHandlers
var _C1_RemoteHandlers_C1ChaoXian = '/C1/PC/RemoteHandlers/C1ChaoXian.ashx';
var _C1_RemoteHandlers_C1ChaoXian = '/C1/PC/RemoteHandlers/C1EchartHandler.ashx';
//C1
var _C1_C1ChaoXian = '/C1/RemoteHandlers/C1ChaoXian.ashx';
var _C1_C1EchartHandler = '/C1/RemoteHandlers/C1EchartHandler.ashx';
// ---------------------------------------------------- C2 ----------------------------------------------------
//C2 - Device
var _C2_Device_DeviceForm = '/C2/PC/Device/RemoteHandlers/DeviceForm.ashx';//(文件名有重复，L93，L115，L128，L196)
var _C2_Device_GetQX = '/C2/PC/Device/RemoteHandlers/GetQX.ashx';
var _C2_Device_GetTD = '/C2/PC/Device/RemoteHandlers/GetTD.ashx';
//C2 - Event
var _C2_Event_C2EventContrast = '/C2/PC/Event/RemoteHandlers/C2EventContrast.ashx';
var _C2_Event_C2EventControl = '/C2/PC/Event/RemoteHandlers/C2EventControl.ashx';
var _C2_Event_C2EventFromControl = '/C2/PC/Event/RemoteHandlers/C2EventFromControl.ashx';
var _C2_Event_GetContrastCount = '/C2/PC/Event/RemoteHandlers/GetContrastCount.ashx';
//C2 - Fault
var _C2_Fault_GetMonitorAlarmC2Form = '/C2/PC/Fault/RemoteHandlers/GetMonitorAlarmC2Form.ashx';//(文件名有重复，L49，L124)
var _C2_Fault_MonitorAlarmSave = '/C2/PC/Fault/RemoteHandlers/MonitorAlarmSave.ashx';//(文件名有重复，L60，L106，L125，L143，L208，L219)
// ---------------------------------------------------- C3 ----------------------------------------------------
//C3 - Device
var _C3_Device_DeviceForm = '/C3/PC/Device/RemoteHandlers/DeviceForm.ashx';//(文件名有重复，L93，L115，L128，L196)
//C3 - LineInspection
var _C3_LineInspection_GetComparativeAnalysisList = '/C3/PC/LineInspection/RemoteHandlers/GetComparativeAnalysisList.ashx';
var _C3_LineInspection_GetLineInspectionList = '/C3/PC/LineInspection/RemoteHandlers/GetLineInspectionList.ashx';
//C3 - MAlarmMonitoring
var _C3_MAlarmMonitoring_GetAFCodeTree = '/C3/PC/MAlarmMonitoring/RemoteHandlers/GetAFCodeTree.ashx';
var _C3_MAlarmMonitoring_GetAlarmLJ = '/C3/PC/MAlarmMonitoring/RemoteHandlers/GetAlarmLJ.ashx';//(文件名有重复，L40，L102，L134)
var _C3_MAlarmMonitoring_GetAlarmTD = '/C3/PC/MAlarmMonitoring/RemoteHandlers/GetAlarmTD.ashx';//(文件名有重复，L41，L103，L135)
var _C3_MAlarmMonitoring_GetlocAlarmImgInfo = '/C3/PC/MAlarmMonitoring/RemoteHandlers/GetlocAlarmImgInfo.ashx';//(文件名有重复，L46，L85，L136，L189，L255)
var _C3_MAlarmMonitoring_GetlocAlarmImgWdJson = '/C3/PC/MAlarmMonitoring/RemoteHandlers/GetlocAlarmImgWdJson.ashx';//(文件名有重复，L47，L86，L137，L190，L256)
var _C3_MAlarmMonitoring_GetMonitorAlarmC3Form = '/C3/PC/MAlarmMonitoring/RemoteHandlers/GetMonitorAlarmC3Form.ashx';//(文件名有重复，L50，L138)
var _C3_MAlarmMonitoring_GetMonitorLocoAlarmList = '/C3/PC/MAlarmMonitoring/RemoteHandlers/GetMonitorLocoAlarmList.ashx';//(文件名有重复，L56，L76，L139)
var _C3_MAlarmMonitoring_GetMonitorLocoAlarmListFX = '/C3/PC/MAlarmMonitoring/RemoteHandlers/GetMonitorLocoAlarmListFX.ashx';//(文件名有重复，L57，L140)
var _C3_MAlarmMonitoring_GetMonitorLocoAlarmListFXTJ = '/C3/PC/MAlarmMonitoring/RemoteHandlers/GetMonitorLocoAlarmListFXTJ.ashx';//(文件名有重复，L58，L141)
var _C3_MAlarmMonitoring_locPs3orPs4 = '/C3/PC/MAlarmMonitoring/RemoteHandlers/locPs3orPs4.ashx';//(文件名有重复，L59，L142)
var _C3_MAlarmMonitoring_MonitorAlarmSave = '/C3/PC/MAlarmMonitoring/RemoteHandlers/MonitorAlarmSave.ashx';//(文件名有重复，L60，L106，L125，L143，L208，L219)
var _C3_MAlarmMonitoring_NextAlarm = '/C3/PC/MAlarmMonitoring/RemoteHandlers/NextAlarm.ashx';//(文件名有重复，L61，L144)
var _C3_MAlarmMonitoring_PreviousAlarm = '/C3/PC/MAlarmMonitoring/RemoteHandlers/PreviousAlarm.ashx';
var _C3_MAlarmMonitoring_ShowImg = '/C3/PC/MAlarmMonitoring/RemoteHandlers/ShowImg.ashx';
var _C3_MAlarmMonitoring_downloadreport = '/C3/PC/MAlarmMonitoring/downloadreport.ashx';
var _C3_MAlarmMonitoring_downloadReportBureau = '/C3/PC/MAlarmMonitoring/downloadReportBureau.ashx';
var _C3_MAlarmMonitoring_downloadReportBureau_norepeat = '/C3/PC/MAlarmMonitoring/downloadReportBureau_norepeat.ashx';
var _C3_MAlarmMonitoring_downloadReportCombine = '/C3/PC/MAlarmMonitoring/downloadReportCombine.ashx';
var _C3_MAlarmMonitoring_downloadReportCombine_introp = '/C3/PC/MAlarmMonitoring/downloadReportCombine_introp.ashx';
var _C3_MAlarmMonitoring_STATUS = '/C3/PC/MAlarmMonitoring/STATUS.ashx';
//C3 - MDetectionOfTrace
var _C3_MDetectionOfTrace_GetIRVUrlByAlarmID = '/C3/PC/MDetectionOfTrace/RemoteHandlers/GetIRVUrlByAlarmID.ashx';//(文件名有重复，L67，L154)
var _C3_MDetectionOfTrace_GetLocGJList = '/C3/PC/MDetectionOfTrace/RemoteHandlers/GetLocGJList.ashx';//(文件名有重复，L68，L155)
var _C3_MDetectionOfTrace_GetLocGJList_New = '/C3/PC/MDetectionOfTrace/RemoteHandlers/GetLocGJList_New.ashx';
var _C3_MDetectionOfTrace_GetLocGJList_New_APP = '/C3/PC/MDetectionOfTrace/RemoteHandlers/GetLocGJList_New_APP.ashx';
var _C3_MDetectionOfTrace_GetLocoGJList = '/C3/PC/MDetectionOfTrace/RemoteHandlers/GetLocoGJList.ashx';//(文件名有重复，L69，L72，L158，L163，L239)
var _C3_MDetectionOfTrace_GetLocoStateC3AlarmList = '/C3/PC/MDetectionOfTrace/RemoteHandlers/GetLocoStateC3AlarmList.ashx';
var _C3_MDetectionOfTrace_GetMonitorLocoStateList = '/C3/PC/MDetectionOfTrace/RemoteHandlers/GetMonitorLocoStateList.ashx';//(文件名有重复，L70，L160)
//C3 - MDeviceStatus
var _C3_MDeviceStatus_GetExceptionList = '/C3/PC/MDeviceStatus/RemoteHandlers/GetExceptionList.ashx';
var _C3_MDeviceStatus_GetLocoGJList = '/C3/PC/MDeviceStatus/RemoteHandlers/GetLocoGJList.ashx';//(文件名有重复，L69，L72，L158，L163，L239)
var _C3_MDeviceStatus_GetLocoGJListFXTJ = '/C3/PC/MDeviceStatus/RemoteHandlers/GetLocoGJListFXTJ.ashx';
var _C3_MDeviceStatus_MonitorLocoStateListCombine = '/C3/PC/MDeviceStatus/RemoteHandlers/MonitorLocoStateListCombine.ashx';
var _C3_MDeviceStatus_MonitorLocoStateListNew = '/C3/PC/MDeviceStatus/RemoteHandlers/MonitorLocoStateListNew.ashx';
var _C3_MDeviceStatus_MonitorLocoStateListNewGDD = '/C3/PC/MDeviceStatus/RemoteHandlers/MonitorLocoStateListNewGDD.ashx';
//C3 - MLiveStreaming
var _C3_MLiveStreaming_OriginalFile = '/C3/PC/MLiveStreaming/RemoteHandlers/OriginalFile.ashx';
var _C3_MLiveStreaming_VedioRecorder = '/C3/PC/MLiveStreaming/RemoteHandlers/VedioRecorder.ashx';
var _C3_MLiveStreaming_VideoDeviceInfoHandler = '/C3/PC/MLiveStreaming/RemoteHandlers/VideoDeviceInfoHandler.ashx';//(文件名有重复，L79，L171)
var _C3_MLiveStreaming_VideoPlayInfor = '/C3/PC/MLiveStreaming/RemoteHandlers/VideoPlayInfor.ashx';
var _C3_MLiveStreaming_VideoPlayInfor_JC = '/C3/PC/MLiveStreaming/RemoteHandlers/VideoPlayInfor_JC.ashx';
var _C3_MLiveStreaming_Handler1 = '/C3/PC/MLiveStreaming/Handler1.ashx';
//C3 - MMileageCount
var _C3_MMileageCount_kmMarkCount = '/C3/PC/MMileageCount/kmMarkCount.ashx';
//C3 - MRTA
var _C3_MRTA_BMapC3DataPoint = '/C3/PC/MRTA/RemoteHandlers/BMapC3DataPoint.ashx';//(文件名有重复，L81，L178，L277)
var _C3_MRTA_BMapLinesDataPoints = '/C3/PC/MRTA/RemoteHandlers/BMapLinesDataPoints.ashx';
var _C3_MRTA_C3ProcessInfo = '/C3/PC/MRTA/RemoteHandlers/C3ProcessInfo.ashx';
var _C3_MRTA_Get3CAlarmJson = '/C3/PC/MRTA/RemoteHandlers/Get3CAlarmJson.ashx';
var _C3_MRTA_Get3CLocoJson = '/C3/PC/MRTA/RemoteHandlers/Get3CLocoJson.ashx';
var _C3_MRTA_Get3CMrta = '/C3/PC/MRTA/RemoteHandlers/Get3CMrta.ashx';//(文件名有重复，L82，L183)
var _C3_MRTA_GetAllLineTag = '/C3/PC/MRTA/RemoteHandlers/GetAllLineTag.ashx';//(文件名有重复，L83，L184)
var _C3_MRTA_GetC3barJson = '/C3/PC/MRTA/RemoteHandlers/GetC3barJson.ashx';//(文件名有重复，L84，L185)
var _C3_MRTA_GetC3barnewJson = '/C3/PC/MRTA/RemoteHandlers/GetC3barnewJson.ashx';
var _C3_MRTA_GetC3Position = '/C3/PC/MRTA/RemoteHandlers/GetC3Position.ashx';
var _C3_MRTA_GetFXGIS = '/C3/PC/MRTA/RemoteHandlers/GetFXGIS.ashx';
var _C3_MRTA_GetlocAlarmImgInfo = '/C3/PC/MRTA/RemoteHandlers/GetlocAlarmImgInfo.ashx';//(文件名有重复，L46，L85，L136，L189，L255)
var _C3_MRTA_GetlocAlarmImgWdJson = '/C3/PC/MRTA/RemoteHandlers/GetlocAlarmImgWdJson.ashx';//(文件名有重复，L47，L86，L137，L190，L256)
var _C3_MRTA_mrta_big_alarm = '/C3/PC/MRTA/RemoteHandlers/mrta_big_alarm.ashx';
var _C3_MRTA_OrganizationControl = '/C3/PC/MRTA/RemoteHandlers/OrganizationControl.ashx';
var _C3_MRTA_GetVideoImg = '/C3/PC/MRTA/GetVideoImg.ashx';
// ---------------------------------------------------- C4 ----------------------------------------------------
//C4 - Device
var _C4_Device_DeviceForm = '/C4/PC/Device/RemoteHandlers/DeviceForm.ashx';//(文件名有重复，L93，L115，L128，L196)
var _C4_Device_GetDeviceTree = '/C4/PC/Device/RemoteHandlers/GetDeviceTree.ashx';
var _C4_Device_GetQX = '/C4/PC/Device/RemoteHandlers/GetQX.ashx';
var _C4_Device_GetTD = '/C4/PC/Device/RemoteHandlers/GetTD.ashx';
//C4 - Event
var _C4_Event_C4EventContrast = '/C4/PC/Event/RemoteHandlers/C4EventContrast.ashx';
var _C4_Event_C4EventControl = '/C4/PC/Event/RemoteHandlers/C4EventControl.ashx';
var _C4_Event_C4EventFromControl = '/C4/PC/Event/RemoteHandlers/C4EventFromControl.ashx';
var _C4_Event_C4PatrolAndExamineDetail = '/C4/PC/Event/RemoteHandlers/C4PatrolAndExamineDetail.ashx';
var _C4_Event_GetContrastCount = '/C4/PC/Event/RemoteHandlers/GetContrastCount.ashx';
//C4 - Fault
var _C4_Fault_GetMonitorAlarmC4Form = '/C4/PC/Fault/RemoteHandlers/GetMonitorAlarmC4Form.ashx';//(文件名有重复，L51，L207)
var _C4_Fault_MonitorAlarmSave = '/C4/PC/Fault/RemoteHandlers/MonitorAlarmSave.ashx';//(文件名有重复，L60，L106，L125，L143，L208，L219)
// ---------------------------------------------------- C5 ----------------------------------------------------
//C5
var _C5_detect_GetC5DetectDataList = '/C5/ashx/GetC5DetectDataList.ashx'; //C5检测数据列表后台
var _C5_detect_GetMonitorAlarmOrDetectC5Form = '/C5/ashx/GetMonitorAlarmOrDetectC5Form.ashx'; //C5检测数据、缺陷库详情后台
var _C5_fault_GetC5FaultDataList = '/C5/ashx/GetC5FaultDataList.ashx'; //C5缺陷库列表
var _C5_camera_C5CameraManagement = '/C5/ashx/C5CameraManagement.ashx'; //C5相机管理列表
var _Report_C5FaultReport = '/Report/C5FaultReport.aspx'; //C5缺陷库报表
var _Report_C5DetectReport = '/Report/C5DetectReport.aspx'; //C5检测数据报表
var _Report_6CAlarmTable = '/Report/6CAlarmTable.aspx'; //6C缺陷数据报表
// ---------------------------------------------------- C6 ----------------------------------------------------
//C6 - MAlarmMonitoring
var _C6_MAlarmMonitoring_BMapSubstationDataPoints = '/C6/PC/MAlarmMonitoring/RemoteHandlers/BMapSubstationDataPoints.ashx';
var _C6_MAlarmMonitoring_GetC6Alarm = '/C6/PC/MAlarmMonitoring/RemoteHandlers/GetC6Alarm.ashx';//(文件名有重复，L43，L212)
var _C6_MAlarmMonitoring_GetC6Json = '/C6/PC/MAlarmMonitoring/RemoteHandlers/GetC6Json.ashx';//(文件名有重复，L44，L213)
var _C6_MAlarmMonitoring_GetC6TempJson = '/C6/PC/MAlarmMonitoring/RemoteHandlers/GetC6TempJson.ashx';//(文件名有重复，L45，L214)
var _C6_MAlarmMonitoring_GetMonitorAlarmC6Form = '/C6/PC/MAlarmMonitoring/RemoteHandlers/GetMonitorAlarmC6Form.ashx';//(文件名有重复，L52，L215)
var _C6_MAlarmMonitoring_GetMonitorAlarmC6XW = '/C6/PC/MAlarmMonitoring/RemoteHandlers/GetMonitorAlarmC6XW.ashx';
var _C6_MAlarmMonitoring_GetMonitorAlarmXZForm = '/C6/PC/MAlarmMonitoring/RemoteHandlers/GetMonitorAlarmXZForm.ashx';
var _C6_MAlarmMonitoring_GetsubstationAlarmList = '/C6/PC/MAlarmMonitoring/RemoteHandlers/GetsubstationAlarmList.ashx';
var _C6_MAlarmMonitoring_MonitorAlarmSave = '/C6/PC/MAlarmMonitoring/RemoteHandlers/MonitorAlarmSave.ashx';//(文件名有重复，L60，L106，L125，L143，L208，L219)
var _C6_MAlarmMonitoring_OneSubstationRealTimeMontoring = '/C6/PC/MAlarmMonitoring/RemoteHandlers/OneSubstationRealTimeMontoring.ashx';
var _C6_MAlarmMonitoring_ServerTime = '/C6/PC/MAlarmMonitoring/RemoteHandlers/ServerTime.ashx';
var _C6_MAlarmMonitoring_SubstationControl = '/C6/PC/MAlarmMonitoring/RemoteHandlers/SubstationControl.ashx';
var _C6_MAlarmMonitoring_SubstationMonitoringQuery = '/C6/PC/MAlarmMonitoring/RemoteHandlers/SubstationMonitoringQuery.ashx';
var _C6_MAlarmMonitoring_SubstationMontoring = '/C6/PC/MAlarmMonitoring/RemoteHandlers/SubstationMontoring.ashx';//(文件名有重复，L62，L224)
var _C6_MAlarmMonitoring_SubstationRealTimeMontoring = '/C6/PC/MAlarmMonitoring/RemoteHandlers/SubstationRealTimeMontoring.ashx';
//C6 - MFoundation
var _C6_MFoundation_C6_DeviceListControl = '/C6/PC/MFoundation/RemoteHandlers/C6_DeviceListControl.ashx';
// ---------------------------------------------------- Common ----------------------------------------------------
//Common - AlarmTelemechanic
var _Common_AlarmTelemechanic_downExcelAlarm = '/Common/AlarmTelemechanic/RemoteHandlers/downExcelAlarm.ashx';
var _Common_AlarmTelemechanic_GetAlarmTeleList = '/Common/AlarmTelemechanic/RemoteHandlers/GetAlarmTeleList.ashx';
//Common - DPCExcelAlarm
var _Common_DPCExcelAlarm_downExcelAlarm = '/Common/DPCExcelAlarm/RemoteHandlers/downExcelAlarm.ashx';
var _Common_DPCExcelAlarm_GetExcelAlarmList = '/Common/DPCExcelAlarm/RemoteHandlers/GetExcelAlarmList.ashx';
//Common - LineInspectionDataAnalysis
var _Common_LineInspectionDataAnalysis_HardDIskDataVedioPlay = '/Common/LineInspectionDataAnalysis/RemoteHandlers/HardDIskDataVedioPlay.ashx';
var _Common_LineInspectionDataAnalysis_HardDiskLineVedioPlay = '/Common/LineInspectionDataAnalysis/RemoteHandlers/HardDiskLineVedioPlay.ashx';
//Common - M3CDevice
var _Common_M3CDevice_GetLocoGJList = '/Common/M3CDevice/RemoteHandlers/GetLocoGJList.ashx';//(文件名有重复，L69，L72，L158，L163，L239)
//Common - Mail
var _Common_Mail_MailHandler = '/Common/Mail/RemoteHandlers/MailHandler.ashx';
//Common - MAlarmMonitoring
var _Common_MAlarmMonitoring_AlarmArcingAnalysis = '/Common/MAlarmMonitoring/RemoteHandlers/AlarmArcingAnalysis.ashx';
var _Common_MAlarmMonitoring_AlarmDelayDetails = '/Common/MAlarmMonitoring/RemoteHandlers/AlarmDelayDetails.ashx';
var _Common_MAlarmMonitoring_AlarmDelayHome = '/Common/MAlarmMonitoring/RemoteHandlers/AlarmDelayHome.ashx';
var _Common_MAlarmMonitoring_AlarmEdit = '/Common/MAlarmMonitoring/RemoteHandlers/AlarmEdit.ashx';
var _Common_MAlarmMonitoring_AlarmStatistical_PowerSupply = '/Common/MAlarmMonitoring/RemoteHandlers/AlarmStatistical_PowerSupply.ashx';
var _Common_MAlarmMonitoring_AlarmStatisticalTrend = '/Common/MAlarmMonitoring/RemoteHandlers/AlarmStatisticalTrend.ashx';
var _Common_MAlarmMonitoring_AlarmSure = '/Common/MAlarmMonitoring/RemoteHandlers/AlarmSure.ashx';
var _Common_MAlarmMonitoring_DaliyWalkAlarm = '/Common/MAlarmMonitoring/RemoteHandlers/DaliyWalkAlarm.ashx';
var _Common_MAlarmMonitoring_GetMonitorAlarmList = '/Common/MAlarmMonitoring/RemoteHandlers/GetMonitorAlarmList.ashx';
var _Common_MAlarmMonitoring_UploadFiles = '/Common/MAlarmMonitoring/RemoteHandlers/UploadFiles.ashx';
var _Common_MAlarmMonitoring_UploadPicture = '/Common/MAlarmMonitoring/RemoteHandlers/UploadPicture.ashx';
//Common - MDataAnalysis
var _Common_MDataAnalysis_GetlocAlarmImgInfo = '/Common/MDataAnalysis/RemoteHandlers/GetlocAlarmImgInfo.ashx';//(文件名有重复，L46，L85，L136，L189，L255)
var _Common_MDataAnalysis_GetlocAlarmImgWdJson = '/Common/MDataAnalysis/RemoteHandlers/GetlocAlarmImgWdJson.ashx';//(文件名有重复，L47，L86，L137，L190，L256)
var _Common_MDataAnalysis_RepeatAlarm = '/Common/MDataAnalysis/RemoteHandlers/RepeatAlarm.ashx';
//Common - MFoundation
var _Common_MFoundation_C6_DeviceListControl = '/Common/MFoundation/RemoteHandlers/C6_DeviceListControl.ashx';
var _Common_MFoundation_CrossControl = '/Common/MFoundation/RemoteHandlers/CrossControl.ashx';
var _Common_MFoundation_DictionaryControl = '/Common/MFoundation/RemoteHandlers/DictionaryControl.ashx';
var _Common_MFoundation_DriverControl = '/Common/MFoundation/RemoteHandlers/DriverControl.ashx';
var _Common_MFoundation_DutyRangeControl = '/Common/MFoundation/RemoteHandlers/DutyRangeControl.ashx';
var _Common_MFoundation_LineControl = '/Common/MFoundation/RemoteHandlers/LineControl.ashx';
var _Common_MFoundation_LocationInfoControl = '/Common/MFoundation/RemoteHandlers/LocationInfoControl.ashx';
var _Common_MFoundation_LocomotiveControl = '/Common/MFoundation/RemoteHandlers/LocomotiveControl.ashx';
var _Common_MFoundation_OrganizationControl = '/Common/MFoundation/RemoteHandlers/OrganizationControl.ashx';
var _Common_MFoundation_PoleControl = '/Common/MFoundation/RemoteHandlers/PoleControl.ashx';
var _Common_MFoundation_PolePictureUpload = '/Common/MFoundation/RemoteHandlers/PolePictureUpload.ashx';
var _Common_MFoundation_PositionControl = '/Common/MFoundation/RemoteHandlers/PositionControl.ashx';
var _Common_MFoundation_SubstationControl = '/Common/MFoundation/RemoteHandlers/SubstationControl.ashx';
var _Common_MFoundation_SysDictionaryControl = '/Common/MFoundation/RemoteHandlers/SysDictionaryControl.ashx';
var _Common_MFoundation_UserControl = '/Common/MFoundation/RemoteHandlers/UserControl.ashx';
var _Common_MFoundation_VideoControl = '/Common/MFoundation/RemoteHandlers/VideoControl.ashx';
//Common - MGIS
var _Common_MGIS_Cue = '/Common/MGIS/ASHX/Cue/Cue.ashx';
var _Common_MGIS_BMapC3DataPoint = '/Common/MGIS/ASHX/MisAlarm/BMapC3DataPoint.ashx';//(文件名有重复，L81，L178，L277)
var _Common_MGIS_DeviceInRectangular = '/Common/MGIS/ASHX/MisAlarm/DeviceInRectangular.ashx';
var _Common_MGIS_QxDataPoint = '/Common/MGIS/ASHX/MisAlarm/QxDataPoint.ashx';
var _Common_MGIS_TjQxDataPoint = '/Common/MGIS/ASHX/MisAlarm/TjQxDataPoint.ashx';
var _Common_MGIS_BMapBridgeTuneDataPoints = '/Common/MGIS/ASHX/MisBridgeTune/BMapBridgeTuneDataPoints.ashx';
var _Common_MGIS_BMapLinesDataPoints = '/Common/MGIS/ASHX/MisLine/BMapLinesDataPoints.ashx';
var _Common_MGIS_BMapPoleDataPoints = '/Common/MGIS/ASHX/MisPole/BMapPoleDataPoints.ashx';
var _Common_MGIS_GetPoleInfoByGPS = '/Common/MGIS/ASHX/MisPole/GetPoleInfoByGPS.ashx';
var _Common_MGIS_BMapSubstationDataPoints = '/Common/MGIS/ASHX/MisSubstation/BMapSubstationDataPoints.ashx';
var _Common_MGIS_C2BMapNormal = '/Common/MGIS/ASHX/Normal/C2BMapNormal.ashx';
var _Common_MGIS_C2PatrolAndExamineDetail = '/Common/MGIS/ASHX/Normal/C2PatrolAndExamineDetail.ashx';
var _Common_MGIS_BMapLineDataPoints = '/Common/MGIS/ASHX/Position/BMapLineDataPoints.ashx';
var _Common_MGIS_BMapOrgDataPoints = '/Common/MGIS/ASHX/Position/BMapOrgDataPoints.ashx';
var _Common_MGIS_Select = '/Common/MGIS/ASHX/Select/Select.ashx';
var _Common_MGIS_C1EventInfo = '/Common/MGIS/ASHX/Sms/C1EventInfo.ashx';
var _Common_MGIS_C3ProcessInfo = '/Common/MGIS/ASHX/Sms/C3ProcessInfo.ashx';
var _Common_MGIS_geoconv = '/Common/MGIS/ASHX/Sms/geoconv.ashx';
var _Common_MGIS_OperationVerify = '/Common/MGIS/ASHX/Sms/OperationVerify.ashx';
var _Common_MGIS_PVerify = '/Common/MGIS/ASHX/Sms/PVerify.ashx';
var _Common_MGIS_testGPS = '/Common/MGIS/ASHX/Sms/testGPS.ashx';
var _Common_MGIS_Verify = '/Common/MGIS/ASHX/Sms/Verify.ashx';
var _Common_MGIS_Vertify_ex = '/Common/MGIS/ASHX/Sms/Vertify_ex.ashx';
var _Common_MGIS_GisQuery = '/Common/MGIS/ASHX/GisQuery.ashx';
//Common - MHardDisk
var _Common_MHardDisk_HardDiskData = '/Common/MHardDisk/RemoteHandlers/HardDiskData.ashx';
var _Common_MHardDisk_HardDiskForm = '/Common/MHardDisk/RemoteHandlers/HardDiskForm.ashx';
var _Common_MHardDisk_HardDiskHandler = '/Common/MHardDisk/RemoteHandlers/HardDiskHandler.ashx';
var _Common_MHardDisk_HardDiskRecord = '/Common/MHardDisk/RemoteHandlers/HardDiskRecord.ashx';
var _Common_MHardDisk_HardDiskStandard = '/Common/MHardDisk/RemoteHandlers/HardDiskStandard.ashx';
//Common - MOnePlaceData
var _Common_MOnePlaceData_C6_DeviceListControl = '/Common/MOnePlaceData/RemoteHandlers/C6_DeviceListControl.ashx';
var _Common_MOnePlaceData_GetAlarmIdByCode = '/Common/MOnePlaceData/RemoteHandlers/GetAlarmIdByCode.ashx';
var _Common_MOnePlaceData_SUBST_APPRSControl = '/Common/MOnePlaceData/RemoteHandlers/SUBST_APPRSControl.ashx';
var _Common_MOnePlaceData_SUBST_NOTEControl = '/Common/MOnePlaceData/RemoteHandlers/SUBST_NOTEControl.ashx';
var _Common_MOnePlaceData_SUBST_RNDT_SPFDControl = '/Common/MOnePlaceData/RemoteHandlers/SUBST_RNDT_SPFDControl.ashx';
var _Common_MOnePlaceData_SubstationControl = '/Common/MOnePlaceData/RemoteHandlers/SubstationControl.ashx';
//Common - MOnePoleData
var _Common_MOnePoleData_DeviceList = '/Common/MOnePoleData/RemoteHandlers/DeviceList.ashx';
var _Common_MOnePoleData_HardDiskData = '/Common/MOnePoleData/RemoteHandlers/HardDiskData.ashx';
var _Common_MOnePoleData_MyDeviceList = '/Common/MOnePoleData/RemoteHandlers/MyDeviceList.ashx';
//Common - MParameter
var _Common_MParameter_ParameterHandler = '/Common/MParameter/RemoteHandlers/ParameterHandler.ashx';
//Common - MPlan
var _Common_MPlan_PlanManageForm = '/Common/MPlan/RemoteHandlers/PlanManageForm.ashx';
//Common - MSubstation
var _Common_MSubstation_SubstationAbnormal = '/Common/MSubstation/RemoteHandlers/SubstationAbnormal.ashx';
//Common - MSystem
var _Common_MSystem_DataPermissonControl = '/Common/MSystem/RemoteHandlers/DataPermissonControl.ashx';
var _Common_MSystem_FunMenuControl = '/Common/MSystem/RemoteHandlers/FunMenuControl.ashx';
var _Common_MSystem_LoginForm = '/Common/MSystem/RemoteHandlers/LoginForm.ashx';
var _Common_MSystem_Permission = '/Common/MSystem/RemoteHandlers/Permission.ashx';
var _Common_MSystem_Query = '/Common/MSystem/RemoteHandlers/Query.ashx';
var _Common_MSystem_Select = '/Common/MSystem/RemoteHandlers/Select.ashx';
var _Common_MSystem_SysLogControl = '/Common/MSystem/RemoteHandlers/SysLogControl.ashx';
var _Common_MSystem_XtButtonControl = '/Common/MSystem/RemoteHandlers/XtButtonControl.ashx';
//Common - MTask
var _Common_MTask_TaskForm = '/Common/MTask/RemoteHandlers/TaskForm.ashx';
var _Common_MTask_TaskList = '/Common/MTask/RemoteHandlers/TaskList.ashx';
var _Common_MTask_TaskList_NEW = '/Common/MTask/RemoteHandlers/TaskList_NEW.ashx';
//Common - MTopo
var _Common_MTopo_AlarmJson = '/Common/MTopo/MTopo/AlarmJson.ashx';
var _Common_MTopo_GetAlarm = '/Common/MTopo/MTopo/GetAlarm.ashx';
var _Common_MTopo_TwoAlarm = '/Common/MTopo/MTopo/TwoAlarm.ashx';
//Common - RemoteHandlers
var _Common_RemoteHandlers_C6 = '/Common/RemoteHandlers/C6.ashx';
var _Common_RemoteHandlers_Config = '/Common/RemoteHandlers/Config.ashx';
var _Common_RemoteHandlers_DataPermissonControl = '/Common/RemoteHandlers/DataPermissonControl.ashx';
var _Common_RemoteHandlers_GeFunEnable = '/Common/RemoteHandlers/GeFunEnable.ashx';
var _Common_RemoteHandlers_GetC1Json = '/Common/RemoteHandlers/GetC1Json.ashx';//(文件名有重复，L42，L95，L104，L345)
var _Common_RemoteHandlers_GetEvent = '/Common/RemoteHandlers/GetEvent.ashx';
var _Common_RemoteHandlers_GetLocomotive = '/Common/RemoteHandlers/GetLocomotive.ashx';
var _Common_RemoteHandlers_GetParamter = '/Common/RemoteHandlers/GetParamter.ashx';
var _Common_RemoteHandlers_GetSelects = '/Common/RemoteHandlers/GetSelects.ashx';
var _Common_RemoteHandlers_GetTrees = '/Common/RemoteHandlers/GetTrees.ashx';
var _Common_RemoteHandlers_GetTrees_M = '/Common/RemoteHandlers/GetTrees_M.ashx';
var _Common_RemoteHandlers_IndexHandler = '/Common/RemoteHandlers/IndexHandler.ashx';
var _Common_RemoteHandlers_PictureProcess = '/Common/RemoteHandlers/PictureProcess.ashx';
var _Common_RemoteHandlers_Portal = '/Common/RemoteHandlers/Portal.ashx';//(文件名有重复，L90，L354)
var _Common_RemoteHandlers_Power = '/Common/RemoteHandlers/Power.ashx';
var _Common_RemoteHandlers_Pubic = '/Common/RemoteHandlers/Pubic.ashx';
var _Common_RemoteHandlers_ServerTime = '/Common/RemoteHandlers/ServerTime.ashx';
var _Common_RemoteHandlers_SMS = '/Common/RemoteHandlers/SMS.ashx';
// ---------------------------------------------------- Report ----------------------------------------------------
//Report - RemoteHandlers
var _Report_RemoteHandlers_GetOrg = '/Report/RemoteHandlers/GetOrg.ashx';
var _Report_RemoteHandlers_ReportControl = '/Report/RemoteHandlers/ReportControl.ashx';
var _Report_RemoteHandlers_ReportControldayCount = '/Report/RemoteHandlers/ReportControldayCount.ashx';


$(function () {
    $('.btn-minimize').click(function (e) {
        e.preventDefault();
        var $target = $(this).parent().parent().next('.box-content');
        if ($target.is(':visible')) $('i', $(this)).removeClass('icon-chevron-up').addClass('icon-chevron-down');
        else $('i', $(this)).removeClass('icon-chevron-down').addClass('icon-chevron-up');
        $target.slideToggle();
    });
    urlControl_new();
});

//版本号判断
function IsVersion() {

    var p_v = GetQueryString("v");


    if (p_v == null) {

        if (location.href.indexOf('?') > -1) {
            window.location.href = location.href + '&v=' + version;
        }
        else {
            window.location.href = location.href + '?v=' + version;
        }

    }
    else if (p_v != version) {
        window.location.href = location.href.replace('v=' + GetQueryString("v"), 'v=' + version);
    }
    else {

    }

};


function showBox(_title, _src, _w, _h) {

    if ($('#MyShowBox').length == 0) {

        $("body").append('<div id="MyShowBox" style="display:none"  class="modal fade"  role="dialog" >        <div style="width:800px" class="modal-dialog ">            <div class="modal-header">                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>                <h4 class="modal-title" >' + _title + '</h4>            </div>            <div class="modal-content">                <iframe id="iframe_MyShowBox" src="' + _src + '" frameborder="0" height="180" width="100%"></iframe>            </div>        </div>    </div>');


        //<div class="modal-footer">\
        //    <button type="button" id="btn_closeMyShowBox" class="btn btn-default" data-dismiss="modal">关闭</button>\
        //</div>\

    }
    else {
        $('#iframe_MyShowBox').attr('src', _src);
    }


    if (_w != undefined)
        $('#MyShowBox>modal-dialog').width(_w);

    if (_h != undefined)
        $('#iframe_MyShowBox').height(_h);


    $('#MyShowBox').modal().css({
        width: 'auto',
        'margin-left': function () {
            return -($(this).width() / 2);
        },
        'margin-top': function () {
            return -($(this).height() / 2);
        }
    });

};


//打开图片
function showImg(str) {
    top.location = str;
    //window.open(str, 'imgnewwindow', 'height=200, width=380,top=200,left=200,toolbar=no,scrollbars=no,menubar=no,resizable=no,status=no,location=no')
};

//打开图片
function show1Img(str) {

    window.open(str, 'imgnewwindow', 'height=200, width=380,top=200,left=200,toolbar=no,scrollbars=no,menubar=no,resizable=no,status=no,location=no');
};
//打开全屏窗口
function ShowWinOpen(str) {
    window.open(str, "_blank");
    //var h = window.screen.height;
    //var w = window.screen.width;
    //window.open(str, 'newwindow', 'height=' + h + ', width=' + w + ',top=0,left=0,toolbar=no,scrollbars=yes,fullscreen=yes,menubar=no,resizable=no,status=no,location=no')
};
//打开全屏窗口
function ShowWinOpenNew(str, name) {
    var h = window.screen.height;
    var w = window.screen.width;
    window.open(str, name, 'height=' + h + ', width=' + w + ',top=0,left=0,toolbar=no,scrollbars=yes,fullscreen=yes,menubar=no,resizable=no,status=no,location=no');
};
//打开屏幕一半窗口
function ShowWinOpenhw1(str) {
    var w2 = window.screen.width / 1.5;
    var h = window.screen.height - 300;
    var w = window.screen.width;
    window.open(str, 'newwindows', 'height=' + h + ', width=' + w2 + ',top=0,left=' + w2 + ',toolbar=no,scrollbars=yes,menubar=no,resizable=no,status=no,location=no');
};

//打开屏幕一半窗口
function ShowWinOpenhw(str) {
    var w2 = window.screen.width / 2;
    var h = window.screen.height - 200;
    var w = window.screen.width;
    window.open(str, 'newwindows', 'height=' + h + ', width=' + w2 + ',top=0,left=' + w2 + ',toolbar=no,scrollbars=yes,menubar=no,resizable=no,status=no,location=no');
};

//全选
function selectAll(f, mode) {
    if (mode == true) {
        for (i = 0; i < f.length; i++) {
            if (f.elements[i].type == "checkbox") {
                f.elements[i].checked = true;
            }
        }
    }
    else {
        for (i = 0; i < f.length; i++) {
            if (f.elements[i].type == "checkbox") {
                f.elements[i].checked = false;
            }
        }
    }
};
//JS获取URL参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
};

//指定页面区域内容导出Word str 为控件ID
function AllAreaWord(str) {
    try {
        var oWD = new ActiveXObject("Word.Application"); //创建Word应用程序对象oWD
    } catch (e) {
        alert("无法调用Office对象，请确保您的机器已安装了Office并已将本系统的站点名加入到IE的信任站点列表中！");
        return;
    }
    var oDC = oWD.Documents.Add("", 0, 1);
    var oRange = oDC.Range(0, 1);
    var sel = document.body.createTextRange();
    sel.moveToElementText(str);
    sel.select();
    sel.execCommand("Copy");
    oRange.Paste();
    oWD.Application.Visible = true;
    oWD.ActiveWindow.ActivePane.View.Type = 3;
    oWD.Application.close;
};

//指定页面区域内容导出Excel str 为控件ID
function AllAreaExcel(str) {
    try {
        var oXL = new ActiveXObject("Excel.Application"); //创建Excel应用程序对象oXL
    } catch (e) {
        alert("无法调用Office对象，请确保您的机器已安装了Office并已将本系统的站点名加入到IE的信任站点列表中！");
        return;
    }
    var oWB = oXL.Documents.Add("", 0, 1);
    var oRange = oWB.Range(0, 1);
    var sel = document.body.createTextRange();
    sel.moveToElementText(str);
    sel.select();
    sel.execCommand("Copy");
    oRange.Paste();
    oXL.Application.Visible = true;
    oXL.ActiveWindow.ActivePane.View.Type = 3;
    oXL.Application.close;
};

//列表控件高
var flexTableh;
if (window.screen.height == 768) {
    flexTableh = window.screen.height - 390;
} else {
    flexTableh = window.screen.height - 410;
};
//
var flexTablebh = 380;
//列表控件宽12
var flexTablew = window.screen.width - 50;
//占页面10
var flextablespan10 = window.screen.width / 12 * 10 - 70;
//占页面一半
var flexTablebw = window.screen.width / 2 - 70;
//显示数据条数
var PageNum = 30;
//无菜单表高度
var flexTableballh = window.screen.height - 100;

var heightspan6 = window.screen.height / 2 - 50;
//获取当前页Url
function GetwindowUrl() {
    alert(window.location.href);
};
//设置DIV高度超出出现滚动条
function setDivheight(divid) {
    var div = document.getElementById(divid);
    div.style.height = heightspan6;
    div.style.overflow = "auto";
};

// ---------------------------------------------------- start:获取系统时间 ----------------------------------------------------

//获取当前系统日期
function dateNowStr() {
    var d = new Date();
    d.setDate(d.getDate());
    var ret = d.getFullYear() + "-";
    ret += ("00" + (d.getMonth() + 1)).slice(-2) + "-";
    ret += ("00" + d.getDate()).slice(-2) + " ";
    return ret;
};
//获取当前系统日期
function dateMonthNowStr() {
    var d = new Date();
    d.setDate(d.getDate());
    var ret = d.getFullYear() + "-";
    ret += ("00" + (d.getMonth() + 1)).slice(-2);
    return ret;
};

//获取一年前 日期
function dateyearbeforeStr() {
    var d = new Date();
    d.setDate(d.getDate());
    var ret = (d.getFullYear() - 1) + "-";
    ret += ("00" + (d.getMonth() + 1)).slice(-2) + "-";
    ret += ("00" + (d.getDate())).slice(-2);
    return ret;
};


//获取当前系统日期
function _dateMonthNowStr() {
    //    var d = new Date();
    //    d.setDate(d.getDate());
    //    var ret = d.getFullYear() + "-"
    //    ret += ("00" + (d.getMonth() - 5)).slice(-2)

    var d = DateAddORSub("m", "-", 5);

    var ret = d.getFullYear() + "-" + d.getMonth();

    return ret;
};


//获取当前系统日期前后几天  --2015-11-21 by lc
function getDateStr(date, day) {
    if (day == null)
        day = 0;
    var d = new Date(date);
    d.setDate(d.getDate() + day);
    var ret = d.getFullYear() + "-";
    ret += ("00" + (d.getMonth() + 1)).slice(-2) + "-";
    ret += ("00" + (d.getDate())).slice(-2);
    return ret;
};
//获取当前系统日期前后几天  --2015-11-21 by lc
function getDateStr_day(date, day) {
    if (day == null)
        day = 0;
    var d = new Date(date);
    d.setDate(d.getDate() + day);
    var ret = d.getFullYear() + "-";
    ret += ("00" + (d.getMonth() + 1)).slice(-2) + "-";
    ret += ("00" + d.getDate()).slice(-2) + " ";
    //ret += ("00" + d.getHours()).slice(-2) + ":";
    //ret += ("00" + d.getMinutes()).slice(-2) + ":";
    //ret += ("00" + d.getSeconds()).slice(-2) + " ";
    ret += '00:00:00';
    return ret;
};
//获取当前系统日期 传递任意后缀
function datehhmm00NowStr(str) {
    var d = new Date();
    d.setDate(d.getDate());
    var ret = d.getFullYear() + "-";
    ret += ("00" + (d.getMonth() + 1)).slice(-2) + "-";
    ret += ("00" + d.getDate()).slice(-2) + " ";
    ret += str;
    return ret;
};
//获取当前系统日期
function datehhssNowStr() {
    var d = new Date();
    d.setDate(d.getDate());
    var ret = d.getFullYear() + "-";
    ret += ("00" + (d.getMonth() + 1)).slice(-2) + "-";
    ret += ("00" + d.getDate()).slice(-2) + " ";
    ret += ("00" + d.getHours()).slice(-2) + ":";
    ret += ("00" + d.getMinutes()).slice(-2) + ":";
    ret += ("00" + d.getSeconds()).slice(-2) + " ";
    return ret;
};
//获取当前系统次日日期
function CdatehhssNowStr() {
    var d = new Date();
    d.setDate(d.getDate());
    var ret = d.getFullYear() + "-";
    ret += ("00" + (d.getMonth() + 1)).slice(-2) + "-";
    ret += ("00" + (d.getDate() + 1)).slice(-2) + " ";
    ret += ("00" + d.getHours()).slice(-2) + ":";
    ret += ("00" + d.getMinutes()).slice(-2) + ":";
    ret += ("00" + d.getSeconds()).slice(-2) + " ";
    return ret;
};
//获取一个月前日期
function dateLastMonthStr() {
    var beforeDate = new Date();
    beforeDate.setTime(beforeDate.getTime() - 1000 * 60 * 60 * 24 * 30);
    var strYear2 = beforeDate.getFullYear();
    var strMon2 = beforeDate.getMonth() + 1;
    var strDate2 = beforeDate.getDate();
    var ret = strYear2 + "-" + ("00" + strMon2).slice(-2) + "-" + ("00" + strDate2).slice(-2) + " ";
    return ret;
};

//获取一周前日期
function datelastMonthhhssNowStr() {
    var beforeDate = new Date();
    beforeDate.setTime(beforeDate.getTime() - 1000 * 60 * 60 * 24 * 7);
    var strYear2 = beforeDate.getFullYear();
    var strMon2 = beforeDate.getMonth() + 1;
    var strDate2 = beforeDate.getDate();
    var ret = strYear2 + "-" + ("00" + strMon2).slice(-2) + "-" + ("00" + strDate2).slice(-2) + " ";
    ret += ("00" + beforeDate.getHours()).slice(-2) + ":";
    ret += ("00" + beforeDate.getMinutes()).slice(-2) + ":";
    ret += ("00" + beforeDate.getSeconds()).slice(-2) + " ";
    return ret;
};

//获取一周前日期
function datelastWeekNowStr() {
    var beforeDate = new Date();
    beforeDate.setTime(beforeDate.getTime() - 1000 * 60 * 60 * 24 * 7);
    var strYear2 = beforeDate.getFullYear();
    var strMon2 = beforeDate.getMonth() + 1;
    var strDate2 = beforeDate.getDate();
    var ret = strYear2 + "-" + ("00" + strMon2).slice(-2) + "-" + ("00" + strDate2).slice(-2) + " ";
    return ret;
};

function DateAddORSub(interval, type, number) {
    /*
    * 功能:实现Script的Date加减功能.
    * 参数:interval,字符串表达式，表示要添加的时间间隔.
    * 参数:number,数值表达式，表示要添加的时间间隔的个数.
    * 参数:type,加减类型.
    * 返回:新的时间对象.
    * var newDate =DateAddORSub("d","+",5);
    */
    var date = new Date();
    switch (interval) {
        case "y":
            {
                if (type == "+") {
                    date.setFullYear(date.getFullYear() + number);
                } else {
                    date.setFullYear(date.getFullYear() - number);
                }
                return date;
                break;
            }
        case "q":
            {
                if (type == "+") {
                    date.setMonth(date.getMonth() + number * 3);
                } else {
                    date.setMonth(date.getMonth() - number * 3);
                }
                return date;
                break;
            }
        case "mou":
            {
                if (type == "+") {
                    date.setMonth(date.getMonth() + number);
                } else {
                    date.setMonth(date.getMonth() - number);
                }
                return date;
                break;
            }
        case "w":
            {
                if (type == "+") {
                    date.setDate(date.getDate() + number * 7);
                } else {
                    date.setDate(date.getDate() - number * 7);
                }
                return date;
                break;
            }
        case "d":
            {
                if (type == "+") {
                    date.setDate(date.getDate() + number);
                } else {
                    date.setDate(date.getDate() - number);
                }
                return date;
                break;
            }
        case "h":
            {
                if (type == "+") {
                    date.setHours(date.getHours() + number);
                } else {
                    date.setHours(date.getHours() - number);
                }
                return date;
                break;
            }
        case "min":
            {
                if (type == "+") {
                    date.setMinutes(date.getMinutes() + number);
                } else {
                    date.setMinutes(date.getMinutes() - number);
                }
                return date;
                break;
            }
        case "s":
            {
                if (type == "+") {
                    date.setSeconds(date.getSeconds() + number);
                } else {
                    date.setSeconds(date.getSeconds() - number);
                }
                return date;
                break;
            }
        default:
            {
                if (type == "+") {
                    date.setDate(d.getDate() + number);
                } else {
                    date.setDate(d.getDate() - number);
                }
                return date;
                break;
            }
    }
};

function formatDate(date) {
    ;
    var year = date.getFullYear();       //年
    var month = date.getMonth() + 1;     //月
    var day = date.getDate();            //日
    return year + "-" + month + "-" + day;
};

//获取一周前日期
function DateLastWeekTime() {
    var beforeDate = new Date();
    beforeDate.setTime(beforeDate.getTime() - 1000 * 60 * 60 * 24 * (parseInt(getConfig("AlarmListDefaultTime")) - 1));
    var strYear2 = beforeDate.getFullYear();
    var strMon2 = beforeDate.getMonth() + 1;
    var strDate2 = beforeDate.getDate();
    var ret = strYear2 + "-" + ("00" + strMon2).slice(-2) + "-" + ("00" + strDate2).slice(-2) + " ";
    return ret;
};

// ---------------------------------------------------- end:获取系统时间 ----------------------------------------------------

//加载下拉默认值
function LoadDropdSelected(dropdid, selectedStr) {
    var dropd = document.getElementById(dropdid);
    for (var i = 0; i < dropd.length; i++) {
        if (dropd[i].text == selectedStr) {
            dropd[i].selected = true;
        }
    }
};
//加载下拉默认值
function LoadDropdSelectedByValue(dropdid, selectedValue) {
    var dropd = document.getElementById(dropdid);
    for (var i = 0; i < dropd.length; i++) {
        if (dropd[i].value == selectedValue) {
            dropd[i].selected = true;
        }
    }
};

//////////////////////////设置DIV位置//////////////////////
var tips; var theTop = 10/*这是默认高度*/; var old = theTop;
function initFloatTips(divid) {
    tips = document.getElementById(divid);
    moveTips();
};
//改变DIV位置
function moveTips() {
    var tt = 10;
    if (window.innerHeight) {
        pos = window.pageYOffset;
    }
    else if (document.documentElement && document.documentElement.scrollTop) {
        pos = document.documentElement.scrollTop;
    }
    else if (document.body) {
        pos = document.body.scrollTop;
    }
    pos = pos - tips.offsetTop + theTop;
    pos = tips.offsetTop + pos / 10;
    if (pos < theTop) pos = theTop;
    if (pos != old) {
        tips.style.top = pos + "px";
        tt = 10;
    }
    old = pos;
    setTimeout(moveTips, tt);
};





//
//  下拉综合类
//

(function ($) {
    $.fn.mySelect = function (p) {
        p = $.extend({
            ////下拉实体类型(不区分大小写) 
            //tag:“ORGANIZATION”：组织机构    //   code:机构编码       //  type:机构类型
            //tag:“USER”:用户                 //   code:机构编码       //  type：true查询机构下（包含下属机构）所有用户，false查询当前机构下的用户
            //tag:"LOCOMOTIVE":机车             //   code:机构编码
            //tag:“STATIONSECTION”：区站      //   code:线路编码       //  type:区站类型 S（站） Q（区间） // name:下拉模糊查询名称

            //tag:“SUBSTATION”：变电所        //   code:线路编码
            //tag:“SUBSTATIONBYORG”：变电所   //   code:组织机构编码
            //tag:“LINE”：线路 （无参数）
            //tag:“BRIDGETUNE”：桥隧          //   code:区站编码
            //tag:"SYSDICTIONARY":字典          //   code:字典编码
            defaultValue: "0",          //默认选择项的值
            defaultText: "全部",        //默认选择项的名称
            tag: "ORGANIZATION",
            code: "",                   //代码
            type: "",                   //类型
            name: "",                   //名称（模态查询参数）
            flag: false,                //HINT标志
            url: "/Common/RemoteHandlers/GetSelects.ashx",
            async: true,
            callback: false,
            onError: false              //错误事件
        }, p);
        var t = this;
        var param = [{ name: 'tag', value: p.tag },
                    { name: 'code', value: p.code },
                    { name: 'type', value: p.type },
                    { name: 'name', value: p.name },
                    { name: 'defaultValue', value: p.defaultValue },
                    { name: 'defaultText', value: p.defaultText },
                    { name: 'flag', value: p.flag }];
        var temp_L = ',';
        var tempAshx = '';
        tempAshx = (p.url.split('.ashx')[0]).split('/');
        tempAshx = tempAshx[tempAshx.length - 1];
        var _param = 'S_mySelect_{' + tempAshx + temp_L + p.tag + temp_L + p.code + temp_L + p.type + temp_L + p.name + temp_L + p.defaultValue + temp_L + p.defaultText + temp_L + p.flag + '}'; //所有参数
        if ('' !== localStorage[_param] && undefined !== localStorage[_param] && localStorage['S_Cache_control_data'] === 'True') {
            t.html(localStorage[_param]);
            if (p.callback) {
                p.callback(localStorage[_param]);
            }
        } else {
            getData();
        }

        //获取后台数据
        function getData() {
            $.ajax({
                type: "POST",
                url: p.url,
                async: p.async,
                cache: true,
                data: param,
                success: function (result) {
                    if (result == "-1") {
                        ymPrompt.errorInfo('服务器发生错误，请与系统管理员联系！', null, null, '错误信息', null); return;
                    }
                    t.html(result);
                    localStorage[_param] = result; //保存在本地缓存中
                    if (p.callback) {
                        p.callback(result);
                    }
                }
            });
        }
        return t;
    };
})(jQuery);


//
//  下拉组织机构联动封装
//  jid:局下拉控件
//  did:段下拉控件
//  cid：车间下拉控件
//  gid：工区下拉控件
//  dtype:段类型
//  ctype:车间类型
//  可缺省参数 null
function loadOrgSelect(jid, did, cid, gid, dtype) {
    var null_option = "<option value='0'>全部</option>";
    $("#" + jid).mySelect({
        tag: "Organization", code: "TOPBOSS", type: "J"
    }).change(function () {
        if (!jid) return;
        var jcode = $(this).val();
        if (jcode == "0") {
            $("#" + did).html(null_option);
            $("#" + cid).html(null_option);
            $("#" + gid).html(null_option);
        }
        else {
            $("#" + did).mySelect({
                tag: "Organization",
                code: jcode,
                type: dtype || "GDD",
                callback: function (rs) {
                    $("#" + cid).html(null_option);
                    $("#" + gid).html(null_option);
                }
            }).change(function () {
                if (!cid) return;
                var dcode = $(this).val();
                if (dcode == "0") {
                    $("#" + cid).html(null_option);
                    $("#" + gid).html(null_option);
                }
                else {
                    $("#" + cid).mySelect({
                        tag: "Organization",
                        code: dcode,
                        callback: function (rs) {
                            $("#" + gid).html(null_option);
                        }
                    }).change(function () {
                        if (!gid) return;
                        var gcode = $(this).val();
                        if (gcode == "0") {
                            $("#" + gid).html(null_option);
                        }
                        else {
                            $("#" + gid).mySelect({
                                tag: "Organization",
                                code: gcode
                            });
                        }
                    });
                }
            });
        }
    });
};

//  下拉组织机构联动封装
//  jid:局下拉控件
//  did:段下拉控件
//  cid：线路下拉控件
//  可缺省参数 null
function loadOrgSelect1(jid, did, cid, dtype) {
    var null_option = "<option value='0'>全部</option>";
    $("#" + jid).mySelect({
        tag: "Organization", code: "TOPBOSS", type: "J"
    }).change(function () {
        if (!jid) return;
        var jcode = $(this).val();
        if (jcode == "0") {
            $("#" + did).html(null_option);
            $("#" + cid).html(null_option);
        }
        else {
            $("#" + did).mySelect({
                tag: "Organization",
                code: jcode,
                type: dtype || "GDD",
                callback: function (rs) {
                    $("#" + cid).html(null_option);
                }
            }).change(function () {
                if (!cid) return;
                var dcode = $(this).val();
                if (dcode == "0") {
                    $("#" + cid).html(null_option);
                }
                else {
                    $("#" + cid).mySelect({
                        tag: "Line6C",
                        code: dcode
                    });
                }
            });
        }
    });
};


function toUrl(url, name) {
    // alert(url);
    document.getElementById('url').src = url;
    if (url == "MGIS/GIS.htm" || url == "MTopo/MainTopo.html") {
        ShutdownTime();
    } else {
        OnlodAlarm();
    }
    if (name != undefined) {
        document.getElementById('Iname').innerText = name;
    } else { document.getElementById('Iname').innerText = ""; }
};

//获取范围内的随机数
function random(min, max) {

    return Math.floor(min + Math.random() * (max - min));

};

///全屏
function toFullScreen(type) {
    if (type == "1") {
        document.getElementById("divcontent").style.display = "none";
        document.getElementById("divFunMenu").style.display = "none";
        document.getElementById("url").style.height = (window.screen.height - 100).toString() + "px";

    } else {
        document.getElementById("divcontent").style.display = "block";
        document.getElementById("divFunMenu").style.display = "block";
        document.getElementById("url").style.height = (window.screen.height - 220).toString() + "px";
    }
};

function getParamter() {
    
    var json = [
  {
      "KEY": "FtpRootDir",
      "VALUE": "D://6C_IMAGE",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "ftp根目录物理地址"
  },
  {
      "KEY": "jwdcode",
      "VALUE": "",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "jwdcode"
  },
  {
      "KEY": "FtpAddress",
      "VALUE": "192.168.1.247",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "ftp服务器地址"
  },
  {
      "KEY": "FtpPort",
      "VALUE": "0",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "ftp端口"
  },
  {
      "KEY": "ImgPath",
      "VALUE": "../../../FtpRoot",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "图片虚拟目录地址"
  },
  {
      "KEY": "FtpRoot",
      "VALUE": "../../../FtpRoot",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "FTP虚拟目录地址"
  },
  {
      "KEY": "C3FtpRoot",
      "VALUE": "../../../C3FtpRoot",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "C3 FTP虚拟目录地址"
  },
  {
      "KEY": "6CEventRoot",
      "VALUE": "../../FtpRoot",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "DPC 巡检虚拟目录地址"
  },
  {
      "KEY": "DebugPrint",
      "VALUE": "0",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "DebugPrint"
  },
  {
      "KEY": "EnableTask",
      "VALUE": "1",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "EnableTask"
  },
  {
      "KEY": "ScanDistance",
      "VALUE": "65",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "ScanDistance"
  },
  {
      "KEY": "UseLogicTopo",
      "VALUE": "false",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "UseLogicTopo"
  },
  {
      "KEY": "AlarmTimePeriod",
      "VALUE": "-30",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "GIS中取告警的时间（当前时间减多少天）"
  },
  {
      "KEY": "FaultTimePeriod",
      "VALUE": "-30",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "GIS中取缺陷的时间（当前时间减多少天）"
  },
  {
      "KEY": "FaultCount",
      "VALUE": "100",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "GIS取缺陷的个数"
  },
  {
      "KEY": "mapLevel",
      "VALUE": "6",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "GIS初始层次"
  },
  {
      "KEY": "mapType",
      "VALUE": "1",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "GIS初始显示模式（1：卫星；0：地图）"
  },
  {
      "KEY": "userName",
      "VALUE": "",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "默认userName"
  },
  {
      "KEY": "userPwd",
      "VALUE": "",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "默认userPwd"
  },
  {
      "KEY": "DataPermission",
      "VALUE": "ALARM,MIS_POLE,C3_SMS",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "数据权限配置（如：..,..,..,..）..：查询实例名称前缀"
  },
  {
      "KEY": "GisQryResult2ExelFolder",
      "VALUE": "D:\\GisQryResult",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "GisQryResult2ExelFolder"
  },
  {
      "KEY": "GisQryResult2ExcelVFolder",
      "VALUE": "GisQryResult",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "GisQryResult2ExcelVFolder"
  },
  {
      "KEY": "C3Fileup",
      "VALUE": "D:\\6CFiles\\C3",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "设备全景视频IP获取服务器"
  },
  {
      "KEY": "VideoIPServer",
      "VALUE": "120.197.6.241:1111",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "设备全景视频IP获取服务器"
  },
  {
      "KEY": "C2PrevFrameNum",
      "VALUE": "3",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "获取C2缺陷帧前连续帧的数量"
  },
  {
      "KEY": "C2NextFrameNum",
      "VALUE": "3",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "获取C2缺陷帧后连续帧的数量"
  },
  {
      "KEY": "C4PrevFrameNum",
      "VALUE": "3",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "获取C4缺陷帧前连续帧的数量"
  },
  {
      "KEY": "C4NextFrameNum",
      "VALUE": "3",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "获取C4缺陷帧后连续帧的数量"
  },
  {
      "KEY": "DataInterfaceLogSwitch",
      "VALUE": "1",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "C2/C4数据接入日志开关, 打开(1), 关闭(0)"
  },
  {
      "KEY": "DTWebReference.WebService",
      "VALUE": "http://200.200.200.200:60000/WebService.asmx",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "天窗系统接口"
  },
  {
      "KEY": "vs:EnableBrowserLink",
      "VALUE": "false",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "禁用BrowserLink"
  },
  {
      "KEY": "RepeatCount",
      "VALUE": "2",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "重复报警默认重复次数阀值"
  },
  {
      "KEY": "RepeatRange",
      "VALUE": "50",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "重复报警默认间距"
  },
  {
      "KEY": "RepeatDays",
      "VALUE": "-3",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "重复报警时间分析范围 -3为三天前数据"
  },
  {
      "KEY": "RepeatStatus",
      "VALUE": "AFSTATUS01,AFSTATUS03,AFSTATUS04",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "重复报警默认报警状态,设置值为状态编码 (新上报,已取消,已确认,已计划,已关闭)     格式为：AFSTATUS01,AFSTATUS02,AFSTATUS03,AFSTATUS04,AFSTATUS05"
  },
  {
      "KEY": "RepeatCode",
      "VALUE": "",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "重复报警默认缺陷类型 格式同状态(默认值为空时代表 非干扰类型）"
  },
  {
      "KEY": "MapLayer",
      "VALUE": "8",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "缺陷导出报表中地图缩放图层"
  },
  {
      "KEY": "MaxPlayTime",
      "VALUE": "60",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "视频直播最长持续连接分钟数"
  },
  {
      "KEY": "SMS_Key",
      "VALUE": "43e44f7d827ec51cab87",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "短信密钥"
  },
  {
      "KEY": "SMS_User",
      "VALUE": "gtdq",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "短信用户名"
  },
  {
      "KEY": "AlarmTime",
      "VALUE": "1",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "实时监控报警时间（单位：小时）"
  },
  {
      "KEY": "TrackLength",
      "VALUE": "12",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "检测轨迹时长配置（单位：小时）"
  },
  {
      "KEY": "AlarmListDefaultTime",
      "VALUE": "2",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "报警列表默认加载时间段（单位：天数）"
  },
  {
      "KEY": "ExportLimit",
      "VALUE": "300",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "导出报表上限值（导出量不能超过该值，防止内存溢出）"
  },
  {
      "KEY": "startTemp_Max",
      "VALUE": "-1000",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "startTemp_Max"
  },
  {
      "KEY": "LimitNumber",
      "VALUE": "2",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "原始数据获取新建任务次数限制"
  },
  {
      "KEY": "LevelType",
      "VALUE": "123",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "报警列表页级别控制"
  },
  {
      "KEY": "HardDiskVIHelpURL",
      "VALUE": "192.168.1.101:10022",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "硬盘数据可见光图片提取"
  },
  {
      "KEY": "HardDiskOVHelpURL",
      "VALUE": "192.168.1.101:10023",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "硬盘数据全景图片提取"
  },
  {
      "KEY": "BaiduMapAK",
      "VALUE": "u0XT8b7KYhth8T36DcCP7ZnAGomnfz44,6G188kAN6mGApve3nM1lrLm3VSCuCEDa,hx8eMQQWNAvld3DDFSEHkXI58jZXKE97",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "百度GPS转换密钥(web端用)"
  },
  {
      "KEY": "DirctLink",
      "VALUE": "1",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "DirctLink"
  },
  {
      "KEY": "Definition",
      "VALUE": "超清",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "Definition"
  },
  {
      "KEY": "LDT",
      "VALUE": "CXd/1NG67jVT7KPffMCgaQ==",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "过期时间设置"
  },
  {
      "KEY": "adminPwd",
      "VALUE": "3/ERoCg5D4a7lC8nkfbAMA==",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "用户密码"
  },
  {
      "KEY": "marcar",
      "VALUE": "1",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "marcar 版本 1动车版/0机车版/"
  },
  {
      "KEY": "CenterX",
      "VALUE": "600",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "Jtopo中心点X"
  },
  {
      "KEY": "CenterY",
      "VALUE": "250",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "Jtopo中心点Y"
  },
  {
      "KEY": "XUnit",
      "VALUE": "5",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "Jtopo坐标X放大倍数(算法在MasterJs.js中getXbyLon方法)"
  },
  {
      "KEY": "YUnit",
      "VALUE": "-44",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "Jtopo坐标Y放大倍数(算法在MasterJs.js中getYbyLat方法)"
  },
  {
      "KEY": "CenterLat",
      "VALUE": "30.613159",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "GIS中心点纬度"
  },
  {
      "KEY": "CenterLon",
      "VALUE": "114.431167",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "GIS中心点经度"
  },
  {
      "KEY": "IsCar",
      "VALUE": "1",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "是否显示机车(0:不显示；1：显示)"
  },
  {
      "KEY": "IsLine",
      "VALUE": "1",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "是否显示线路站点(0:不显示；1：显示)"
  },
  {
      "KEY": "AutoExpose",
      "VALUE": "1",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "MODIFY:END"
  },
  {
      "KEY": "ReportServer",
      "VALUE": "192.168.1.247:10020",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "报表服务器地址"
  },
  {
      "KEY": "VedioReplayTime",
      "VALUE": "30",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "打弓异常视频回放后退时间（单位：秒）"
  },
  {
      "KEY": "IDENTIFY_INDATE",
      "VALUE": "3",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "手机验证码有效期"
  },
  {
      "KEY": "DPCAriseTime",
      "VALUE": "90",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "DPC报警监控列表页面默认开始时间（天）"
  },
  {
      "KEY": "DPCWebService",
      "VALUE": "宁瓦线,上行,单线;宁瓦线,下行,单线",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "DPC数据入库服务配置(格式采用<线路,需要配置的属性值,适配后的属性值>表示,并用<;>隔开,末尾不需要<;>)"
  },
  {
      "KEY": "WJSystem_inner",
      "VALUE": "0",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "乌局子系统标志"
  },
  {
      "KEY": "SUBST_EXP_Default_time_range",
      "VALUE": "SYSDATE-1",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "在线实时监测变电所异常数据列表默认时间范围"
  },
  {
      "KEY": "WJ_FaultCountAnalysis_days",
      "VALUE": "30",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "问题库统计日期后推多少天"
  },
  {
      "KEY": "OVERDUE_1C_REPORT_OTHERS",
      "VALUE": "48",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "1C报警分析时间_其余线路_界限"
  },
  {
      "KEY": "OVERDUE_2C_REPORT_OTHERS",
      "VALUE": "72",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "2C报警分析时间_其余线路_界限"
  },
  {
      "KEY": "OVERDUE_3C_REPORT_OTHERS",
      "VALUE": "24",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "3C报警分析时间_其余线路_界限"
  },
  {
      "KEY": "OVERDUE_4C_REPORT_OTHERS",
      "VALUE": "480",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "4C报警分析时间_其余线路_界限"
  },
  {
      "KEY": "OVERDUE_5C_REPORT_OTHERS",
      "VALUE": "24",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "5C报警分析时间_其余线路_界限"
  },
  {
      "KEY": "OVERDUE_6C_REPORT_OTHERS",
      "VALUE": "24",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "6C报警分析时间_其余线路_界限"
  },
  {
      "KEY": "OVERDUE_1C_PROCESS_OTHERS",
      "VALUE": "360",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "1C报警处理时间_其余线路_界限"
  },
  {
      "KEY": "OVERDUE_2C_PROCESS_OTHERS",
      "VALUE": "360",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "2C报警处理时间_其余线路_界限"
  },
  {
      "KEY": "OVERDUE_3C_PROCESS_OTHERS",
      "VALUE": "360",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "3C报警处理时间_其余线路_界限"
  },
  {
      "KEY": "OVERDUE_4C_PROCESS_OTHERS",
      "VALUE": "360",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "4C报警处理时间_其余线路_界限"
  },
  {
      "KEY": "OVERDUE_5C_PROCESS_OTHERS",
      "VALUE": "360",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "5C报警处理时间_其余线路_界限"
  },
  {
      "KEY": "OVERDUE_6C_PROCESS_OTHERS",
      "VALUE": "360",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "6C报警处理时间_其余线路_界限"
  },
  {
      "KEY": "OVERDUE_1C_PROCESS_LXKZ$90001",
      "VALUE": "168",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "1C报警处理时间_兰新客专_界限"
  },
  {
      "KEY": "OVERDUE_2C_PROCESS_LXKZ$90001",
      "VALUE": "168",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "2C报警处理时间_兰新客专_界限"
  },
  {
      "KEY": "OVERDUE_3C_PROCESS_LXKZ$90001",
      "VALUE": "168",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "3C报警处理时间_兰新客专_界限"
  },
  {
      "KEY": "OVERDUE_4C_PROCESS_LXKZ$90001",
      "VALUE": "168",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "4C报警处理时间_兰新客专_界限"
  },
  {
      "KEY": "OVERDUE_5C_PROCESS_LXKZ$90001",
      "VALUE": "168",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "5C报警处理时间_兰新客专_界限"
  },
  {
      "KEY": "OVERDUE_6C_PROCESS_LXKZ$90001",
      "VALUE": "168",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "6C报警处理时间_兰新客专_界限"
  },
  {
      "KEY": "Km_marks_xs",
      "VALUE": "1.8",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "车辆行驶时速最大限制倍数"
  },
  {
      "KEY": "HardDiskAUXHelpURL",
      "VALUE": "192.168.1.197:3001",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "硬盘数据辅助图片提取"
  },
  {
      "KEY": "HardDiskIRVHelpURL",
      "VALUE": "192.168.1.197:3002",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "硬盘数据红外图片提取"
  },
  {
      "KEY": "MisLockTime",
      "VALUE": "60",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "一条报警的锁定时间默认为60分钟"
  },
  {
      "KEY": "AlarmCount",
      "VALUE": "100",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "GIS取告警的个数"
  },
  {
      "KEY": "HttpPostWeb",
      "VALUE": "http://125.69.149.77:60012/Extern.aspx",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "现场原始数据请求地址"
  },
  {
      "KEY": "Proxy",
      "VALUE": "true",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "反向代理开关"
  },
  {
      "KEY": "ProxyHttp",
      "VALUE": "192.168.1.55:10000",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "反向代理开关IP"
  },
  {
      "KEY": "Is_Typical",
      "VALUE": "0",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "是否只显示典型缺陷"
  },
  {
      "KEY": "PoleTableName",
      "VALUE": "MIS_POLE",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "支柱接口模型"
  },
  {
      "KEY": "WordHttp",
      "VALUE": "",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "mfc3、GIF下载访问地址,如： http://localhost:10010"
  },
  {
      "KEY": "BUREAUVALUE",
      "VALUE": "公司",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "组织机构中局的展示名称"
  },
  {
      "KEY": "POWERSECTIONVALUE",
      "VALUE": "部门",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "组织机构中段的展示名称"
  },
  {
      "KEY": "WORKSHOPVALUE",
      "VALUE": "站区",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "组织机构中车间的展示名称"
  },
  {
      "KEY": "Severity_Third",
      "VALUE": "异常",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "三类转三级"
  },
  {
      "KEY": "DataMessageDefaultTime",
      "VALUE": "24",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "数据提示功能的初始化时间（单位：小时）"
  },
  {
      "KEY": "DataMessagePollingTime",
      "VALUE": "6000",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "数据提示功能的轮询时间间隔（单位：毫秒）"
  },
  {
      "KEY": "FileTaskVIHelpURL",
      "VALUE": "192.168.3.235:9733",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "原始数据可见光图片提取"
  },
  {
      "KEY": "FileTaskOVHelpURL",
      "VALUE": "192.168.3.235:9733",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "原始数据全景图片提取"
  },
  {
      "KEY": "FileTaskAUXHelpURL",
      "VALUE": "192.168.3.235:9733",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "原始数据辅助图片提取"
  },
  {
      "KEY": "FileTaskIRVHelpURL",
      "VALUE": "192.168.3.235:9733",
      "CONTEXT": "3C_DataCenter",
      "TITILE": "原始数据红外图片提取"
  },
  {
      "KEY": "For6C",
      "VALUE": "3C",
      "CONTEXT": "3C_DataCenter",
      "TITILE": ""
  },
  {
      "KEY": "debug",
      "VALUE": "1",
      "CONTEXT": "3C_DataCenter",
      "TITILE": ""
  }
    ]
    
    for (var i = 0; i < json.length; i++) {
        localStorage["Paramter_" + json[i].KEY] = json[i].VALUE;
    }
}

///获取配置参数
function getConfig(paramName) {

    switch (paramName) {
        case "debug":
            if (GetQueryString(paramName) != undefined) {
                return "1";
            }

            break;
    }

    var v = localStorage["Paramter_" + paramName];

    if (v != undefined) {
        return v;
    }
    var url = "/Common/RemoteHandlers/GetParamter.ashx?param=" + paramName;
    var json;
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: false,
        success: function (result) {
            json = eval('(' + result + ')');
        }
    });

    localStorage["Paramter_" + paramName] = "";

    for (var i = 0; i < json.length; i++) {
        localStorage["Paramter_" + json[i].KEY] = json[i].VALUE;
    }
    v = localStorage["Paramter_" + paramName];
    return v;
};

function getLocalStorage(code) {
    return window.localStorage[code];
}

//获取当前用户
function getCurUser() {
    var url = "/Common/RemoteHandlers/DataPermissonControl.ashx?type=curuser";
    var json;
    var _param = 'S_getCurUser_{DataPermissonControl,curuser}';
    if ('' !== localStorage[_param] && undefined !== localStorage[_param] && localStorage['S_Cache_control_data'] === 'True') {
        json = eval('(' + localStorage[_param] + ')');
    } else {
        $.ajax({
            type: "POST",
            url: url,
            async: false,
            cache: false,
            success: function (result) {
                localStorage[_param] = result; //保存在本地缓存中
                json = eval('(' + result + ')');
            }
        });
    }
    return json;
};
//获取当前用户
function _getCurUser() {
    var url = "/Common/RemoteHandlers/DataPermissonControl.ashx?type=curuser";
    var json;
    var _param = 'S_getCurUser_{DataPermissonControl,curuser}';
    if ('' !== localStorage[_param] && undefined !== localStorage[_param] && localStorage['S_Cache_control_data'] === 'True') {
        json = eval('(' + localStorage[_param] + ')');
    } else {
        $.ajax({
            type: "POST",
            url: url,
            async: false,
            cache: false,
            success: function (result) {
                localStorage[_param] = result; //保存在本地缓存中
                json = eval('(' + result + ')');
            }
        });
    }
    return json;
};

//判断是否是供电段用户。
function GetIsPowerOrg() {
    //由于本地存储会自动转为字符串所以比较  字符串 "true"
    if (getLocalStorage("IS_POWER_SECTION_USER") == "True") {
        return "1";
    }
    else {
        return "";
    }

};
//判断是否是几何参数缺陷。
function IsJHCS(dicName) {
    //    if ("AFJHCS,AFCODEDGZ,AFCODELCZ,AFCODEKNGC,AFCODELYLH".indexOf(dicName) > -1) {
    //        return true;
    //    }
    if ("几何参数缺陷,导高值超限,拉出值超限,跨内高差,压力和".indexOf(dicName) > -1) {
        return true;
    }
    return false;
}

function hideNoNeed() {
    if (getConfig('EnableTask') == '0') {
        document.getElementById("btnTask").style.display = "none";
        document.getElementById("mistask").style.display = "none";
    }

   // var json = getCurUser();
    if (json_user == undefined) { json_user = _getCurUser(); }
    if (json_user != undefined) {
        if (json_user.role == 'READ_ONLY') {
            document.getElementById("btnOk").style.display = "none";
            document.getElementById("btnCan").style.display = "none";
            document.getElementById("btnTask").style.display = "none";
        }
    }
};
function getXbyLon(lon, CenterLon, CenterX, XUnit) {
    if (CenterX == "" || CenterX == undefined || CenterX == "null") {
        CenterX = getConfig('CenterX');
    }
    CenterX = parseFloat(CenterX);
    if (CenterLon == "" || CenterLon == undefined || CenterLon == "null")
        CenterLon = parseFloat(getConfig('CenterLon'));
    if (XUnit == "" || XUnit == undefined || XUnit == "null")
        XUnit = parseFloat(getConfig('XUnit'));
    var float_lon = parseFloat(lon);
    return CenterX + (float_lon - CenterLon) * XUnit;
}

function getYbyLat(lat, CenterLat, CenterY, YUnit) {
    if (CenterY == "" || CenterY == undefined || CenterY == "null") {
        CenterY = getConfig('CenterY');
    }
    CenterY = parseFloat(CenterY);
    if (CenterLat == "" || CenterLat == undefined || CenterLat == "null")
        CenterLat = parseFloat(getConfig('CenterLat'));
    if (YUnit == "" || YUnit == undefined || YUnit == "null")
        YUnit = parseFloat(getConfig('YUnit'));
    var float_lat = parseFloat(lat);
    return CenterY + (float_lat - CenterLat) * YUnit;
};

function addCookie(name, value, days, path) {   /**添加设置cookie**/
    var name = escape(name);
    var value = escape(value);
    var expires = new Date();
    expires.setTime(expires.getTime() + days * 3600000 * 24);
    //path=/，表示cookie能在整个网站下使用，path=/temp，表示cookie只能在temp目录下使用  
    path = path == "" ? "" : ";path=" + path;
    //GMT(Greenwich Mean Time)是格林尼治平时，现在的标准时间，协调世界时是UTC  
    //参数days只能是数字型  
    var _expires = (typeof days) == "string" ? "" : ";expires=" + expires.toUTCString();
    document.cookie = name + "=" + value + _expires + path;
};

function getCookieValue(name) {  /**获取cookie的值，根据cookie的键获取值**/

    if (name == "SaveAlarms") {

        var _v = window.localStorage[name];

        if (_v == undefined) {
            _v = '';
        }

        return _v;
    }

    //用处理字符串的方式查找到key对应value  
    var name = escape(name);
    //读cookie属性，这将返回文档的所有cookie  
    var allcookies = document.cookie;
    //查找名为name的cookie的开始位置  
    name += "=";
    var pos = allcookies.indexOf(name);
    //如果找到了具有该名字的cookie，那么提取并使用它的值  
    if (pos != -1) {                                             //如果pos值为-1则说明搜索"version="失败  
        var start = pos + name.length;                  //cookie值开始的位置  
        var end = allcookies.indexOf(";", start);        //从cookie值开始的位置起搜索第一个";"的位置,即cookie值结尾的位置  
        if (end == -1) end = allcookies.length;        //如果end值为-1说明cookie列表里只有一个cookie  
        var value = allcookies.substring(start, end); //提取cookie的值  
        return (value);                           //对它解码        
    } else {  //搜索失败，返回空字符串  
        return "";
    }
};

function deleteCookie(name, path) {   /**根据cookie的键，删除cookie，其实就是设置其失效**/
    var name = escape(name);
    var expires = new Date(0);
    path = path == "" ? "" : ";path=" + path;
    document.cookie = name + "=" + ";expires=" + expires.toUTCString() + path;
};

var marcar = getConfig("marcar");    //  1; //是否为动车1/是0/否 未用 变量还需存在



function hideC3infobyID(divid) {
    if (marcar == 1) {
        document.getElementById(divid).style.display = "none";
    }
};
function MonitorindexJtopo() {
    window.location.href = "/Common/MTopo/LogicTopo.html?TPSmall=small&Category_Code=" + GetQueryString('Category_Code') + '&v=' + version;
    addCookie("TPSmall", "small", 1, "");
};
function MonitorindexGIS() {
    window.location.href = "/Common/MGIS/SmallGIS.htm?Category_Code=" + GetQueryString('Category_Code') + '&v=' + version;
};
function MonitorindexRepeatJtopo() {
    var alarmid = GetQueryString("alarmid");
    var linecode = GetQueryString("linecode");
    var xb = GetQueryString("xb");
    var startdate = GetQueryString("startdate");
    var enddate = GetQueryString("enddate");
    var distance = GetQueryString("distance");
    var count = GetQueryString("count");
    window.location.href = "../MTopo/RepeatJtopo.htm?linecode=" + linecode + "&xb=" + escape(xb) + "&startdate=" + startdate + "&enddate=" + enddate + "&distance=" + distance + "&count=" + count + '&v=' + version;
};
function MonitorindexRepeatGIS() {
    var alarmid = GetQueryString("alarmid");
    var linecode = GetQueryString("linecode");
    var xb = GetQueryString("xb");
    var startdate = GetQueryString("startdate");
    var enddate = GetQueryString("enddate");
    var distance = GetQueryString("distance");
    var count = GetQueryString("count");
    window.location.href = "/Common/MGIS/RepeatGIS.htm?Category_Code=DPC&linecode=" + linecode + "&xb=" + escape(xb) + "&startdate=" + startdate + "&enddate=" + enddate + "&distance=" + distance + "&count=" + count + '&v=' + version;
};
function MonitorindexOrbitJtopo(x, y) {
    var centerLon = x;
    var centerLat = y;
    var deviceid = GetQueryString("deviceid");
    var startdate = GetQueryString("startdate");
    var enddate = GetQueryString("enddate");
    window.location.href = "/Common/MTopo/OrbitTopo.htm?Category_Code=DPC&deviceid=" + deviceid + "&startdate=" + startdate + "&enddate=" + enddate + "&centerLon=" + centerLon + "&centerLat=" + centerLat + '&v=' + version;
};
function MonitorindexOrbitGIS() {
    var deviceid = GetQueryString("deviceid");
    var startdate = GetQueryString("startdate");
    var enddate = GetQueryString("enddate");
    window.location.href = "/Common/MGIS/OrbitGIS.htm?Category_Code=DPC&deviceid=" + deviceid + "&startdate=" + startdate + "&enddate=" + enddate + '&v=' + version;
};

///获取服务器时间
//type 加减时间类型Years,Months,Days,Hours,Minutes,Seconds
//number加减时间数 没有写0
function ServerTime(type, number) {
    var Time = XmlHttpHelper.transmit(false, "get", "text", "/Common/RemoteHandlers/ServerTime.ashx?type=" + type + "&number=" + number + '&temp=' + Math.random(), null, null);
    return Time;
};

function SetWinHeight(obj) {
    var win = obj;
    win.height = window.screen.height / 2 - 10;
};


function getCookie(cookie_name) {
    var allcookies = document.cookie;
    var cookie_pos = allcookies.indexOf(cookie_name);   //索引的长度  
    // 如果找到了索引，就代表cookie存在，  
    // 反之，就说明不存在。  
    if (cookie_pos != -1) {
        // 把cookie_pos放在值的开始，只要给值加1即可。  

        cookie_pos += cookie_name.length + 1;      //这里我自己试过，容易出问题，所以请大家参考的时候自己好好研究一下。。。  

        var cookie_end = allcookies.indexOf("&", cookie_pos);

        if (cookie_end == -1) {

            cookie_end = allcookies.length;

        }
        var value = unescape(allcookies.substring(cookie_pos, cookie_end));
    }
    return value;
};

//判断权限
function buttonControl() {
    //    var userjson = getCookieValue("cookloginName");
    //    if (userjson != "admin") {
    //        var inputArray = $("input[type=submit]");
    //        var powerList = getUrlControl("button", window.location.href);
    //        if (powerList.length == 0) { powerList = _getUrlControl("button", window.location.href); }
    //        for (var i = 0; i < inputArray.length; i++) {//循环整个input数组
    //            var input = inputArray[i]; //取到每一个input
    //            input.style.display = "none";
    //            if (powerList.length > 0) {
    //                if (powerList[0].SELECT == "1") {
    //                    //查看权限
    //                    if (input.id.indexOf("S_") == 0) {
    //                        input.style.display = "";
    //                    }
    //                }
    //                if (powerList[0].UPDATE == "1") {
    //                    //修改权限
    //                    if (input.id.indexOf("E_") == 0) {
    //                        input.style.display = "";
    //                    }
    //                }
    //                if (powerList[0].DELETE == "1") {
    //                    //删除权限
    //                    if (input.id.indexOf("D_") == 0) {
    //                        input.style.display = "";
    //                    }
    //                } 
    //                
    //                if (powerList[0].INSERT == "1") {
    //                    //新增权限
    //                    if (input.id.indexOf("A_") == 0) {
    //                        input.style.display = "";
    //                    }
    //                }
    //            }
    //        }
    //    }
};

function urlControl_new() {
    //var loginfile = "/Common/login.htm";
    var loginfile = "/Common/login_new.htm";


    var _localurl = window.location.toString();



    var n = _localurl.indexOf(loginfile);
    if (n > -1) {
        if (top.location !== self.location) { top.location = self.location; }
        return;
    }

    _localurl = _localurl.replace(/\&/g, "%26");
    var _param = 'S_urlControl_new_{Power,IsAllowVisited,' + _localurl + '}';
    if ('' !== localStorage[_param] && undefined !== localStorage[_param] && localStorage['S_Cache_control_data'] === 'True') {
        var powerList = eval("(" + localStorage[_param] + ")");
        for (var i = 0; i < powerList.json.length; i++) {
            if (powerList.json[i].BUT_AUTH_BUT_VISIBLE == "0") {
                if (exist(powerList.json[i].XT_BUTTON_OBJ_ID))
                    $("#" + powerList.json[i].XT_BUTTON_OBJ_ID).hide();
            }
        }
        switch (powerList.Visit) {
            case "0":
                window.location = "/Common/error.htm?display=no" + '&v=' + version; // loginfile;
                break;
            case "-1":
                window.location = '/Common/login.htm?v=' + version; // loginfile;
                break;
        }
    } else {
        //var urls = "/Common/RemoteHandlers/Power.ashx?type=IsAllowVisited&url=" + _localurl;
        //$.ajax({
        //    type: "POST",
        //    url: urls,
        //    async: false,
        //    cache: true,
        //    success: function (result) {

        //        localStorage[_param] = result;
        //        var powerList = eval("(" + result + ")");



        //        for (var i = 0; i < powerList.json.length; i++) {
        //            if (powerList.json[i].BUT_AUTH_BUT_VISIBLE == "0") {
        //                if (exist(powerList.json[i].XT_BUTTON_OBJ_ID))
        //                    $("#" + powerList.json[i].XT_BUTTON_OBJ_ID).hide();
        //            }
        //        }


        //        switch (powerList.Visit) {
        //            case "0":
        //                window.location = "/Common/error.htm?display=no" + '&v=' + version; // loginfile;
        //                break;
        //            case "-1":
        //                //window.location = '/Common/login.htm?v=' + version; // loginfile;
        //                window.location = '/Common/login_new.htm?v=' + version; // loginfile;
        //                break;


        //        }

        //    }
        //});

    };
};
    function exist(id) {
        var s = document.getElementById(id);
        if (s) { return true; }
        else { return false; }
    };

    //URL权限判断
    function urlControl() {
        //    var userjson = getCookieValue("cookloginName");
        //    if (userjson != "admin") {
        //        var AArray = $("a"); //获取页面所有超链接
        //        var urlList = getUrlControl("url", ""); //存在权限数组
        //        if (urlList.length == 0) { urlList = _getUrlControl("url", ""); }
        //        for (var i = 0; i < AArray.length; i++) {//循环整个A数组
        //            var aurl = AArray[i]; //取到每一个A
        //            var isurl = 0;
        //            for (var j = 0; j < urlList.length; j++) {
        //                if (aurl.href.indexOf(urlList[j].url) >= 0) {
        //                    isurl = 1;
        //                }
        //            }
        //            if (isurl == 0 && aurl.href.indexOf("C3index") < 0 && aurl.href.indexOf("login") < 0 && aurl.href.indexOf("#") < 0) {
        //                if (aurl.className == "") {
        //                    aurl.href = "/Common/error.htm?display=no";
        //                } else {
        //                    aurl.href = "/Common/error.htm?lightbox[iframe]=true&lightbox[width]=95p&lightbox[height]=95p&lightbox[modal]=true";
        //                }
        //            }
        //        }
        //    }
    };

    //取得权限数据的JSON
    function getUrlControl(type, url) {
        var urls = "/Common/RemoteHandlers/Power.ashx?type=" + type + "&url=" + url; //+ "&LoginName=" + getCookieValue("cookloginName");
        var json = "";
        $.ajax({
            type: "POST",
            url: urls,
            async: false,
            cache: true,
            success: function (result) {
                if (result != "") {
                    json = eval('(' + result + ')');
                }
            }
        });
        return json;
    };
    //取得权限数据的JSON
    function _getUrlControl(type, url) {
        var urls = "/Common/RemoteHandlers/Power.ashx?type=" + type + "&url=" + url; //+ "&LoginName=" + getCookieValue("cookloginName");
        var json = "";
        $.ajax({
            type: "POST",
            url: urls,
            async: false,
            cache: true,
            success: function (result) {
                if (result != "") {
                    json = eval('(' + result + ')');
                }
            }
        });
        return json;
    };


    function fullShow() {
        CommonPerson.Base.LoadingPic.FullScreenShow(); //开始加载 
    };

    function Showloging() {
        CommonPerson.Base.LoadingPic.FullScreenShow(); //开始加载
        setTimeout("fullHide()", 1000);
    };

    function fullHide() {
        CommonPerson.Base.LoadingPic.FullScreenHide();
    };
    //js里取公里标
    function strToKm(km) {
        var kmStr = km;
        if (kmStr.length == 0) {
            return "0";
        }
        else if (kmStr.length <= 3) {
            return "K0+" + kmStr;
        }
        else {
            return "K" + kmStr.substr(0, kmStr.length - 3) + "+" + kmStr.substr(kmStr.length - 3, 3);
        }
    };

    function GetDataType() {
        var url = window.location.href;
        if (url.indexOf('/C1/') >= 0) {
            return '1C';
        } else if (url.indexOf('/C2/') >= 0) {
            return '2C';
        } else if (url.indexOf('/C3/') >= 0) {
            return '3C';
        } else if (url.indexOf('/C4/') >= 0) {
            return '4C';
        } else if (url.indexOf('/C5/') >= 0) {
            return '5C';
        } else if (url.indexOf('/C6/') >= 0) {
            return '6C';
        } else { return '6C'; }
    };






    function iFrameHeight(obj) {
        var subWeb = document.frames ? document.frames[obj.id].document : obj.contentDocument;
        if (obj != null && subWeb != null) {
            obj.height = subWeb.body.scrollHeight;
        }
    };

    function GetSaveAlarms() {
        var SaveAlarms = getCookieValue("SaveAlarms").replace(/_/g, ",");
        return SaveAlarms;
    };

    function DelSaveAlarms(_ids) {
        var arr = _ids.split(',');

        var SaveAlarms = GetSaveAlarms();
        // alert(SaveAlarms);

        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == '') continue;

            SaveAlarms = SaveAlarms.replace("," + arr[i], "");
            SaveAlarms = SaveAlarms.replace(arr[i] + ",", "");
            SaveAlarms = SaveAlarms.replace(arr[i], "");
        }

        SaveAlarms = SaveAlarms.replace(/,/g, "_");

        //  alert(SaveAlarms);

        deleteCookie("SaveAlarms", "/");
        addCookie("SaveAlarms", SaveAlarms, 30, "/");


    };
    //
    function DelStorageSaveAlarms(_ids) {
        var arr = _ids.split(',');

        var SaveAlarms = window.localStorage["SaveAlarms"].replace(/_/g, ",");
        var CansAlarms = window.localStorage["CansAlarms"].replace(/_/g, ",");
        var MissionAlarms = window.localStorage["MissionAlarms"].replace(/_/g, ",");

        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == '') continue;

            SaveAlarms = SaveAlarms.replace("," + arr[i], "");
            SaveAlarms = SaveAlarms.replace(arr[i] + ",", "");
            SaveAlarms = SaveAlarms.replace(arr[i], "");
            CansAlarms = CansAlarms.replace("," + arr[i], "");
            CansAlarms = CansAlarms.replace(arr[i] + ",", "");
            CansAlarms = CansAlarms.replace(arr[i], "");
            MissionAlarms = MissionAlarms.replace("," + arr[i], "");
            MissionAlarms = MissionAlarms.replace(arr[i] + ",", "");
            MissionAlarms = MissionAlarms.replace(arr[i], "");
        }

        SaveAlarms = SaveAlarms.replace(/,/g, "_");
        window.localStorage.SaveAlarms = SaveAlarms;//更新Storage

        CansAlarms = CansAlarms.replace(/,/g, "_");
        window.localStorage.CansAlarms = CansAlarms;//更新Storage

        MissionAlarms = MissionAlarms.replace(/,/g, "_");
        window.localStorage.MissionAlarms = MissionAlarms;//更新Storage


    };
    //height:图例高度,width:图例宽度,isShowSuffix:是否显示后缀,checkStr:控制勾选缺陷类型 如123则勾选一类二类三类,对应的是级别编码CODE
    function GetSeverityLegend(height, width, isShowSuffix, checkStr) {
        var json = GetSeverityJson();
        var severityHtml = "";
        var suffix = "";
        var check;
        for (var i = 0; i < json.length; i++) {
            check = "";
            if (isShowSuffix) {
                suffix = '&nbsp;(<span id="number' + (i + 1) + '">0</span>)';
            }
            if (checkStr.indexOf(i + 1) > -1) {
                check = 'checked="checked"';
            }
            severityHtml = severityHtml + '<div id="div_type' + (i + 1) + '">\
                <input id="cb_type' + (i + 1) + '" code="' + json[i].code + '" type="checkbox" ' + check + ' style="vertical-align: middle;\
                    display: inline;" /><span style="vertical-align: middle; color: White; display: inline;">\
                        <label style="display: inline;" for="cb_type' + (i + 1) + '">\
                            <span id="sp_type' + (i + 1) + '">' + json[i].name + '</span>\
                            <img style="width: ' + width + 'px; height: ' + height + 'px; display: inline;" align="absmiddle" src="/Common/MGIS/img/ico' + (i + 1) + '.png" />\
                        </label>\
                    </span>' + suffix + '\
            </div>';
        }
        return severityHtml;
    }

    function GetSeverityJson() {
        var url = "/Common/RemoteHandlers/Pubic.ashx?type=getSeverity";
        var _param = 'S_GetSeverityJson_{Pubic,getSeverity}';
        localStorage[_param] = "[{ 'code': '一类', 'name': '一级' }, { 'code': '二类', 'name': '二类' }, { 'code': '三类', 'name': '三级' } ]"; //保存在本地缓存中
        var json = [{ 'code': '一类', 'name': '一级' }, { 'code': '二类', 'name': '二类' }, { 'code': '三类', 'name': '三级' }];
        return json;
    };
    function GetSeverityName(code) {
        var name = "";
        var json = GetSeverityJson();
        for (var i = 0; i < json.length; i++) {
            if (code == json[i].code) {
                name = json[i].name;
            }
        }
        return name;
    };
    function GetSeverityCode(name) {
        var code = "";
        var json = GetSeverityJson();
        for (var i = 0; i < json.length; i++) {
            if (name == json[i].name) {
                code = json[i].code;
            }
        }
        return code;
    };

    function GetSeverityCode2(name, json) {
        var code = "";
        for (var i = 0; i < json.length; i++) {
            if (name == json[i].name) {
                code = json[i].code;
            }
        }
        return code;
    };
    function GetSeverityName2(code, json) {
        var name = "";
        for (var i = 0; i < json.length; i++) {
            if (code == json[i].code) {
                name = json[i].name;
            }
        }
        return name;
    };


    //输入验证类

    function StringHelper() { };


    StringHelper.trim = function (s) {
        s += "";
        return s.replace(/^\s+|\s+$/g, '');
    };

    StringHelper.isInt = function (s) {
        return new RegExp(/^(0|[1-9][0-9]*)$/).test(this.trim(s));
    };

    StringHelper.isFloat = function (s) {
        return new RegExp(/^[0-9]+(\.[0-9]+){0,1}$/).test(this.trim(s));
    };


    StringHelper.isEmpty = function (s) {
        return this.trim(s).length == 0;
    };

    ///本地存储所有的自定义功能
    function ReLoadFunEnable() {
        var url = "/Common/RemoteHandlers/GeFunEnable.ashx?param=";
        var json;
        $.ajax({
            type: "POST",
            url: url,
            async: false,
            cache: false,
            success: function (result) {
                json = eval('(' + result + ')');
            }
        });
        for (var i = 0; i < json.length; i++) {
            localStorage["FunCustom_" + json[i].FunCode] = json[i].Enable;
        }
    };

    ///从本地存储中获取功能是否启用
    function FunEnable(funcode) {
        var v = localStorage["FunCustom_" + funcode];
        return v;
    };

    function GetLocomotive(loca) {
        var url = "/Common/RemoteHandlers/GetLocomotive.ashx?loca=" + loca;
        var json;
        $.ajax({
            type: "POST",
            url: url,
            async: false,
            cache: false,
            success: function (result) {
                json = eval('(' + result + ')');
            }
        });
        return json;
    };

 


    //加载控件
    function loadControl(name) {

        switch (name) {
            case "jqueryUI":
                loadCss("/Lib/jquery-ui-1.8.21.custom/jquery-ui-1.8.21.custom.css");
                loadJs("/Lib/jquery-ui-1.8.21.custom/jquery-ui-1.8.21.custom.min.js");
                break;
            case "jqueryUI_2":
                loadCss("/Lib/jquery-ui-1.8.16.custom/jquery-ui-1.8.16.custom.css");
                loadJs("/Lib/jquery-ui-1.8.21.custom/jquery-ui-1.8.21.custom.min.js");
                break;
            case "ztree": //树
                loadCss("/Lib/ztree/zTreeStyle.css");
                loadJs("/Lib/ztree/jquery.ztree.core-3.5.min.js");
                loadJs("/Lib/ztree/jquery.ztree.exhide.js");
                break;
            case "mytree": //树
                loadCss("/Lib/ztree/zTreeStyle.css");
                loadJs("/Lib/ztree/jquery.ztree.core-3.5.min.js");
                loadJs("/Lib/ztree/jquery.ztree.exhide.js");
                loadJs("/Common/js/6cweb/myTree.js?v=" + version);
                break;
            case "mySelectTree": //树
                loadCss("/Lib/ztree/zTreeStyle.css");
                loadJs("/Lib/ztree/jquery.ztree.core-3.5.min.js");
                loadJs("/Lib/ztree/jquery.ztree.excheck-3.5.js");
                loadJs("/Lib/ztree/jquery.ztree.exhide.js");
                loadJs("/Common/js/6cweb/myTree.js?v=" + version);
                loadJs("/Common/js/6cweb/mySelectTree.js?v=" + version);
                loadJs("/Common/js/6cweb/mySelectTree_Level2.js?v=" + version);
                break;
            case "flexigrid": //列表
                loadCss("/Lib/flexigrid/flexigrid.pack.css");
                loadJs("/Lib/flexigrid/flexigrid.pack.js");
                break;
            case "Echarts": //图表   
                loadJs("/Lib/Echarts-2.0/2.0/esl.js");
                loadJs("/Lib/Echarts-2.0/2.0/dark.js?v=" + version);
                break;
            case "uploadify": //上传
                loadCss("/Lib/jquery.uploadify-3.1/uploadify.css");
                loadJs("/Lib/jquery.uploadify-3.1/jquery.uploadify-3.1.min.js");
                break;
            case "editor": //编辑器
                loadCss("/Lib/jquery.cleditor/jquery.cleditor.css");
                loadJs("/Lib/jquery.cleditor/jquery.cleditor.min.js");
                loadCss("/Lib/jquery.elfinder/elfinder.min.css");
                loadCss("/Lib/jquery.elfinder/elfinder.theme.css");
                loadJs("/Lib/jquery.elfinder/jquery.elfinder.min.js");
                break;
            case "iphoneToggle": //jquery 手机版
                loadCss("/Lib/jquery.iphone.toggle/jquery.iphone.toggle.css");
                loadJs("/Lib/jquery.iphone.toggle/jquery.iphone.toggle.js");
                break;
            case "multiSelect": //多选下拉框 , 需要jqueryUI
                loadCss("/Lib/multiselect/jquery.multiselect.css");
                loadJs("/Lib/multiselect/jquery.multiselect.js");
                break;
            case "elevatezoom": //放大镜
                loadJs("/Lib/jquery.elevatezoom-2.5.5/jquery.elevatezoom.js");
                break;
            case "cloudzoom": //放大镜2
                loadCss("/Lib/cloudzoom/cloudzoom.css");
                loadJs("/Lib/cloudzoom/cloudzoom.js");
                break;
            case "hint": //自动完成控件。
                loadCss("/Lib/jquery.hint/jquery.hint.css");
                loadJs("/Lib/jquery.hint/jquery.hint.js");
                break;
            case "listSelect": //列表选择自动完成控件。
                loadCss("/Common/js/6cweb/listSelect/listSelect.css");
                loadJs("/Common/js/6cweb/listSelect/listSelect.js");
                break;
            case "Validation": //验证类
                loadCss("/Lib/validationEngine/jquery.validationEngine.css");
                loadJs("/Lib/validationEngine/jquery.validationEngine.js", "utf-8");
                loadJs("/Lib/validationEngine/jquery.validationEngine-zh_CN.js", "utf-8");
                break;
            case "kendo":
                loadCss("/Lib/kendo.dataviz/kendo.dataviz.min.css");
                loadJs("/Lib/kendo.dataviz/kendo.dataviz.min.js");
                break;
            case "form":
                loadJs("/Lib/jquery.form/jquery.form.js");
                break;
            case "layer":
                loadCss("/Lib/layer/skin/layer.css");
                loadJs("/Lib/layer/layer.js");
                break;
            case "trainselect": //自动完成控件和自主选择设备编号
                loadCss("/C3/PC/css/trainselect.css");
                loadCss("/Lib/jquery.hint/jquery.hint.css");
                loadCss("/Lib/bootstrap/css/bootstrap-glyphicon.css");
                loadJs("/C3/PC/MAlarmMonitoring/js/trainselect.js");
                loadJs("/C3/PC/MAlarmMonitoring/js/jquery.hintnew.js");
                break;
            case "mySelectSample": //场景样本选择
                loadCss("/Common/css/6cweb/mySelect_Sample.css");
                loadJs("/Common/js/6cweb/mySelect_Sample.js");
                break;
            case "progress": //加入进度条
                loadJs("/Common/js/progress/progress.js");
                break;
            case "paging": //加入分页
                loadCss("/Lib/paging/paging.css");
                loadJs("/Lib/paging/paging.js");
                break;
            case "webuploader": //加入上传图片
                loadCss("/Lib/webuploader-0.1.5/webuploader.css", 'utf-8');
                loadJs("/Lib/webuploader-0.1.5/webuploader.js", 'utf-8');
                break;
            case "myUploadImg": //上传图片
                loadCss("/Lib/myUploadImg/myUploadImg.css", 'utf-8');
                loadJs("/Lib/myUploadImg/myUploadImg.js", 'utf-8');
                break;
            case "myWebUpload": //上传图片
                loadCss('/Lib/myWebUpload/myWebUpload.css?v=' + version);
                loadJs('/Lib/myWebUpload/myWebUpload.js?v=' + version);
                break;
            case "saveMissonAndCancle": //批量取消 转任务
                loadJs("/Common/js/saveMissonAndCancle/saveMissonAndCancle.js");
                break;
        }

    };


    //获取url数据
    function GetRequest() {
        var url = location.search; //获取url中'?'符后的字串 
        var theRequest = new Object();
        if (url.indexOf('?') != -1) {
            var str = url.substr(1);
            strs = str.split('&');
            for (var i = 1; i < strs.length; i++) {
                theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
            }
        }
        return theRequest;
    }

    /*/*
     * @desc 初始化时间控件（参数：'#id'）
     * @param id：元素id
     * @param dateFmt：日期格式
     * @return 无
     */
    function initDateControl(id, dateFmt) {
        var temp_dateFmt = 'yyyy-MM-dd HH:mm:ss';
        if (undefined !== dateFmt && '' !== dateFmt) {
            temp_dateFmt = dateFmt;
        }
        if (!$(id).hasClass('Wdate')) {
            $(id).addClass('Wdate');
        }
        $(id).click(function () {
            WdatePicker({
                skin: 'default',
                dateFmt: temp_dateFmt,
                isShowToday: true
            });
        });
        $(id).focus(function () {
            WdatePicker({
                skin: 'default',
                dateFmt: temp_dateFmt,
                isShowToday: true,
                oncleared: function (dp) {
                    $(id).attr('value', '');
                }
            });
        });
    }

    /*/*
     * @desc 加载图片
     * @param 无
     * @return 无
     */
    function loadImg(obj, url) {
        var img = new Image();
        if ('' === url || null === url || 'undefined' === url || undefined === url) {
            url = '/6C/PC/MAlarmMonitoring/ImgTmp/暂无图片1.png';
        } else {
            img.src = url;
        }

        img.onload = function () {
            obj.attr('src', url);
        }
        img.onerror = function () {
            obj.attr('src', '/6C/PC/MAlarmMonitoring/ImgTmp/暂无图片1.png');
            //obj.attr('src', url);
        }
    }

    /*/*
     * @desc 点击空白处隐藏弹出框
     * @param 无
     * @return 无
     */
    function hideBox(target, boxId, btnClass) {
        if (target.closest(boxId).length == 0 && target.context.classList.value.indexOf(btnClass) < 0) {
            $(boxId).addClass('hide');
        }
    }

    /*/*
     * @desc 移除缺陷级别的三级
     * @param jbId：级别id名称；typeNum：检测类型的数字
     * @return 无
     */
    function removeLevelThree(jbId, typeNum) {
        var Category = typeNum + 'C';
        switch (Category) {
            case '3C':
                break;
            default:
                var input_jb = $('input[name=multiselect_' + jbId + ']');
                var sub = 0;
                for (var i = 0; i < input_jb.length; i++) {
                    if ('三类' === $(input_jb[i]).val()) {
                        sub += 30;
                        $(input_jb[i]).parent().parent().remove();
                    }
                }
                $($('input[name=multiselect_' + jbId + ']:eq(0)').parent().parent().parent())[0].style.height = 100 - sub;
                break;
        }
    }

    /**
     * @desc 跳转到报警详情
     * @param curCategory：当前设备类型，不能为空[如：1C、2C、3C、4C、5C、6C]
     * @param alarmid：报警id，不能为空
     */
    function toAlarmDetails(curCategory, alarmid) {
        var _url = '';
        if (getConfig('For6C') == 'DPC') {
            switch (curCategory) {
                case '6C':
                    _url = '/C6/PC/MAlarmMonitoring/MonitorAlarmC6Form.htm?alarmid=' + alarmid + '&v=' + version;
                    break;
                case '步巡':
                case 'DailyWalk':
                case 'STEP_PET':
                    _url = "/6C/PC/MAlarmMonitoring/MonitorAlarmDailyWalk.htm?alarmid=" + alarmid + '&cateGoryName=' + curCategory + '&v=' + version;
                    break;
                case '5C':
                    _url = '/C5/html/fault_detail.html?detectId=&alarmId=' + alarmid + '&cateGoryName=' + curCategory + '&v=' + version;
                    break;
                default:
                    _url = '/6C/PC/MAlarmMonitoring/MonitorAlarmDPC.htm?alarmid=' + alarmid + '&cateGoryName=' + curCategory + '&v=' + version;
                    break;
            }
        } else {
            switch (curCategory) {
                case '1C':
                    _url = '/C1/PC/MAlarmMonitoring/MonitorAlarmC1Form.htm?alarmid=' + alarmid + '&v=' + version;
                    break;
                case '2C':
                    _url = '/C2/PC/Fault/MonitorAlarmC2Form.htm?alarmid=' + alarmid + '&v=' + version;
                    break;
                case '3C':
                    _url = '/C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=' + alarmid + '&v=' + version;
                    break;
                case '4C':
                    _url = '/C4/PC/Fault/MonitorAlarmC4Form.htm?alarmid=' + alarmid + '&v=' + version;
                    break;
                case '5C':
                    _url = '/C5/html/fault_detail.html?detectId=&alarmId=' + alarmid + '&cateGoryName=' + curCategory + '&v=' + version;
                    break;
                case '6C':
                    _url = '/C6/PC/MAlarmMonitoring/MonitorAlarmC6Form.htm?alarmid=' + alarmid + '&v=' + version;
                    break;
            }
        }
        window.open(_url, '_blank');
    }

    /**
     * @desc 跳转到检修复核详情
     * @param curCategory：当前设备类型，不能为空[如：1C、2C、3C、4C、5C、6C]
     * @param alarmid：报警id，不能为空
     */
    function toMaintenanceReviewDetails(curCategory, alarmid) {
        var _url = "/6C/PC/MFault/maintenanceReview.html?alarmid=" + alarmid + "&cateGoryName=" + curCategory + '&v=' + version;
        window.open(_url, '_blank');
    }

    /**
     * @desc 跳转到一杆一档详情
     * @param deviceId：支柱id，不能为空  
     * @param after：路径后半截，可以为空  一些参数
     */
    function toPoleDetails(deviceId, after) {
        var _url = '';
        if (getConfig('For6C') == 'DPC') {
            _url = "/6C/PC/MPoleRecord/poleRecord.html?device_id=" + deviceId + "&v=" + version;
        } else {
            _url = "/Common/MOnePoleData/oneChockoneGAN.html?device_id=" + deviceId + (after ? after : '') + "&v=" + version;
        }
        window.open(_url, '_blank');
    }

    // Generate four random hex digits.  
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    // Generate a pseudo-GUID by concatenating random hexadecimal.   在上传控件的alarmid中可调用
    function guid() {
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    };

    // ---------------------------------------------------- start: layer提示框 ----------------------------------------------------

    /**
     * @desc  提示
     * @param string：文字提示
     * @param element：绑定的元素（如：('#test')）
     * @param time：超过多少时间后关闭提示框
     * @param direction：提示框弹出后在元素的某个方向（上、下、左、右），默认在元素上方
     * @param direction2：提示框弹出后在元素的右边时，设置提示框的样式
     */
    function tip(string, element, time, direction, direction2) {
        //小tips
        var number = 1;
        if ('top' === direction) {
            number = 1;
        }
        if ('right' === direction) {
            number = 2;
        }
        if ('bottom' === direction) {
            number = 3;
        }
        if ('left' === direction) {
            number = 4;
        }
        var tim = '';
        if ('' !== time) {
            tim = time;
        }
        var index = layer.tips(string, element, {
            tips: [number, '#488cb4'],
            time: tim
        });

        if (undefined !== direction2 && 'right' === direction2) {
            var clientWidth = document.body.clientWidth; //网页可见区域宽
            var left = $('#layui-layer' + index).css('left').split('p')[0];
            if (clientWidth <= 1920 && clientWidth > 1600) {
                $('#layui-layer' + index).css({
                    'left': (left - 110) + 'px'
                });
            }
            if (clientWidth <= 1600 && clientWidth > 1440) {
                $('#layui-layer' + index).css({
                    'left': (left - 70) + 'px'
                });
            }
            if (clientWidth <= 1440 && clientWidth > 1366) {
                $('#layui-layer' + index).css({
                    'left': (left - 70) + 'px'
                });
            }
            if (clientWidth <= 1366 && clientWidth > 1024) {
                $('#layui-layer' + index).css({
                    'left': (left - 70) + 'px'
                });
            }
            if (clientWidth <= 1024 && clientWidth > 0) {
                $('#layui-layer' + index).css({
                    'left': (left - 70) + 'px'
                });
            }
            $('#layui-layer' + index + ' i.layui-layer-TipsT').css({
                'left': 'auto',
                'right': '12px'
            });
        }
        return index;
    };

    // ---------------------------------------------------- end: layer提示框 ----------------------------------------------------

    // ---------------------------------------------------- start: layer弹出对话框 ----------------------------------------------------

    /*/*
     * @desc 弹出捕获元素的对话框
     * @param $targetElement：捕获的元素
     * @param width：弹出框的宽
     * @param height：弹出框的高
     * @param isCloseBtn：是否显示默认关闭按钮
     * @return 弹出框编号 
     */
    function showDialog($targetElement, width, height, isCloseBtn) {
        var closeBtn = 1;
        if ('TRUE' === isCloseBtn) {
            closeBtn = 1;
        }
        if ('FALSE' === isCloseBtn) {
            closeBtn = false;
        }
        var _index =
           layer.open({
               type: 1,
               skin: 'dialog_box',
               shade: [0.3, '#393D49'],
               title: false, //不显示标题
               fix: false,
               closeBtn: closeBtn,
               area: [width + 'px', height + 'px'], //宽高
               content: $targetElement.show(), //捕获的元素
               cancel: function (index) {
                   layer.close(index);
               }
           });
        return _index;
    }

    /**
     * @desc 在本页面弹出iframe层
     * @param $iframeUrl：iframe的url地址
     * @param width：弹出框的宽
     * @param height：弹出框的高
     * @param scroll：弹出框滚动条
     * @param isCloseBtn：是否显示默认关闭按钮
     * @return 弹出框编号 
     */
    function showDialogIframe($iframeUrl, width, height, scroll, isCloseBtn) {
        var closeBtn = 1;
        if ('TRUE' === isCloseBtn) {
            closeBtn = 1;
        }
        if ('FALSE' === isCloseBtn) {
            closeBtn = false;
        }
        var isScroll = 'yes';
        if ('' !== scroll && undefined !== scroll) {
            isScroll = scroll;
        }
        var index = layer.open({
            type: 2,
            title: false,
            skin: '', //加上边框、边距
            closeBtn: closeBtn, //0：不显示关闭按钮
            shade: [0.3, '#4c4c4c'],//遮罩层颜色
            area: [width + 'px', height + 'px'], //宽，高
            //offset: 'rb', //弹出框位置
            anim: 2,  //弹出时的动画
            scrollbar: true,
            content: [$iframeUrl, isScroll], //iframe的url，no代表不显示滚动条
            success: function (layero, index) {
                //var body = layer.getChildFrame('body', index);
                //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                //var iframeWin = window[layero.find('iframe')[0]['id']]; 
                //重新设置iframe的高度
                var iframe = layero.find('iframe')[0]['id'];
                $('#' + iframe).height(height);
            }
        });
        return index;
    }

    /*/*
     * @desc 弹出iframe窗
     * @param url：iframe路径
     * @param width：iframe窗的宽
     * @param height：iframe窗的高
     * @return 弹出框编号
     */
    function showIframe(url, width, height, scroll) {
        //iframe窗
        var index = layer.open({
            type: 2,
            title: false,
            closeBtn: 1, //不显示关闭按钮
            shade: [0.5],
            shadeClose: false,
            //shade: true,
            area: [width + 'px', height + 'px'],
            //maxmin: true, //开启最大化最小化按钮
            anim: 2,
            content: [url, scroll], //iframe的url，no代表不显示滚动条
        });
        return index;
    }

    /**
     * @desc 在本页面弹出iframe层
     * @param $iframeUrl：iframe的url地址
     * @param width：弹出框的宽
     * @param height：弹出框的高
     * @return 弹出框编号 
     */
    function showIframeToIndex($iframeUrl, width, height) {
        var index = layer.open({
            type: 2,
            title: false,
            skin: 'dialog_iframe_box', //加上边框、边距
            closeBtn: 1, //0：不显示关闭按钮
            shade: [0.3, '#4c4c4c'],//遮罩层颜色
            area: [width + 'px', height + 'px'], //宽，高
            //offset: '50px', //弹出框位置 70px
            anim: 2,
            scrollbar: true,
            content: [$iframeUrl, 'no'], //iframe的url，no代表不显示滚动条
            success: function (layero, index) {
                //重新设置iframe的高度
                var iframe = layero.find('iframe')[0]['id'];
                $('#' + iframe).height(height - 16);
            }
        });
        return index;
    }

    // ---------------------------------------------------- end: layer弹出对话框 ----------------------------------------------------

    // ---------------------------------------------------- start：C5检测数据收藏 ----------------------------------------------------
    //说明：C5检测数据收藏，收藏后的数据用途：①过滤检测数据列表、缺陷库列表已收藏的；②批量确认报警；③批量取消报警；
    //根据功能，目前创建了变量C5CollectDetects用于存储收藏的数据id

    /*/*
     * @desc 判断检测数据是否收藏（C5）
     * @param detectId：检测数据id
     * @return flag：true:已收藏; false:未收藏
     */
    function isDetectCollect_C5(detectId) {
        var C5CollectDetects = getCookieValue('C5CollectDetects');
        var flag = false;
        //判断当前detectId是否已被收藏
        if (C5CollectDetects !== '') {
            if (C5CollectDetects.indexOf(detectId) > -1) {
                flag = true;
            } else {
                flag = false;
            }
        } else {
            flag = false;
        }
        return flag;
    }

    /*/*
     * @desc 添加检测数据收藏（C5）
     * @param detectId：检测数据id
     * @param collectObj：绑定收藏事件的元素
     * @return 无
     */
    function addDetectCollect_C5(detectId, collectObj) {
        var C5CollectDetects = getCookieValue('C5CollectDetects');

        if (C5CollectDetects !== '') {
            if (isDetectCollect_C5(detectId)) {
                //delDetectCollect_C5(detectId);
            } else {
                C5CollectDetects += '_' + detectId;
            }
        } else {
            C5CollectDetects = detectId;
        }
        deleteCookie('C5CollectDetects', '/');
        addCookie('C5CollectDetects', C5CollectDetects, 30, '/'); //C5收藏：存入cookie时用下划线分隔多个id，传入后台时多个id用双引号和逗号（','）分隔
    }

    /*/*
     * @desc 删除检测数据收藏（C5）
     * @param _detectIds：检测数据id
     * @return 无
     */
    function delDetectCollect_C5(_detectIds) {
        var arr = _detectIds.split(',');

        var C5CollectDetects = getCookieValue('C5CollectDetects');
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === '') {
                continue;
            }
            C5CollectDetects = C5CollectDetects.replace('_' + arr[i], '');
            C5CollectDetects = C5CollectDetects.replace(arr[i] + '_', '');
            C5CollectDetects = C5CollectDetects.replace(arr[i], '');
        }
        deleteCookie('C5CollectDetects', '/');
        addCookie('C5CollectDetects', C5CollectDetects, 30, '/'); //C5收藏：存入cookie时用下划线分隔多个id，传入后台时多个id用双引号和逗号（','）分隔
    };

    // ---------------------------------------------------- end：C5检测数据收藏 ----------------------------------------------------

    /*/*
     * @desc 侧栏树显示或隐藏（如3C、5C检测数据列表页）
     * @param 无
     * @return 无
     */
    function treeShowOrHide() {
        $('.button_img_show').click(function () {
            var Width = $('.span2').outerWidth(true);
            $('.span2').animate({ left: -Width + 'px' }).css('position', 'absolute');
            $(this).hide();
            $('.span10').animate({ width: '96.5%' });
            $('.button_img_hide').show();
        });
        $('.button_img_hide').click(function () {
            $('.span2').animate({ left: 0 }).css('position', 'relative');
            $('.button_img_show').show();
            $(this).hide();
            $('.span10').animate({ width: '82.8%' });
        });
    }

    /*/*
     * @desc 去掉字符串中所有空格
     * @param str：字符串
     * @param is_global：是否去掉全部空格
     * @return 无
     */
    function Trim(str, is_global) {
        var result;
        result = str.replace(/(^\s+)|(\s+$)/g, '');
        if (is_global.toLowerCase() == 'g') {
            result = result.replace(/\s/g, '');
        }
        return result;
    }

    /*/*
     * @desc 加载带有放大镜的图片（有loading效果，使用放大镜加载，只需加载loadControl('cloudzoom')，在有图片路径的地方调用该函数）
     * @param ImgObj：绑定图片的对象
     * @param small_img：待显示的图片路径
     * @param big_img：待放大显示的图片路径
     * @param loadbgObj：加载图片对应的背景对象
     * @param _position：放大后的图片位置
     * @return 无
     */
    function createCloudZoom(ImgObj, small_img, big_img, loadbgObj, _position) {
        if (_position == undefined) {
            _position = 4; //0在图片上侧居中，4在图片右侧居中，8在图片下侧居中，12在图片左侧居中
        }
        var myInstance = ImgObj.data('CloudZoom');
        if (myInstance != undefined) {
            myInstance.destroy();
        }
        var options = {
            zoomImage: big_img, //缩放图片的路径，如果没有指定的缩放图片，将使用小图(在图像元素中被指定的图片)
            //zoomSizeMode: 'image', //定义了缩放窗口和镜头大小的规则。   
            animationTime: 0, //动画效果的持续时间,以毫秒为单位。
            easeTime: 0, //鼠标滑上时放大图像的时间。数字越大缓动越大，为0时没有缓动。
            easing: 0, //数字越大，移动的越平滑越慢
            tintOpacity: 0, //指定色彩的透明度，范围是0 - 1，0是完全透明，1是完全不透明。
            zoomPosition: _position, //缩放窗口的指定位置
            zoomOffsetX: 0, //允许您调整缩放窗口的水平位置。
            zoomOffsetY: 0, //允许您调整缩放窗口的垂直位置。
            zoomWidth: _winW / 2, //设置缩放窗口的宽度
            zoomHeight: _winH / 2, //设置缩放窗口的高度
            variableMagnification: false, //鼠标滚轮滚动缩放放大镜
            zoomFlyOut: false, //将'flying'动画打开或关闭
        };

        if (small_img !== defaultImg) {
            loadPic(ImgObj, small_img, loadbgObj);
            ImgObj.CloudZoom(options);
        } else {
            loadPic(ImgObj, small_img, loadbgObj);
        }
    }

    /*/*
     * @desc 加载图片（有loading效果）
     * @param obj：绑定图片的对象
     * @param url：待显示的图片路径
     * @param loadbgObj：加载图片对应的背景对象
     * @param defaultPic：自定义默认图片路径
     * @return 无
     */
    function loadPic(obj, url, loadbgObj, defaultPic) {
        if ('' === defaultPic || undefined === defaultPic) {
            defaultPic = defaultImg;
        }
        var img = new Image();
        img.src = url;

        img.onload = function () {
            if (undefined !== loadbgObj) {
                loadbgObj.hide();
            }
            obj.attr('src', url).show();
        }
        img.onerror = function () {
            if (undefined !== loadbgObj) {
                loadbgObj.hide();
            }
            obj.attr('src', defaultPic).show();
        }
    }

    /*/*
     * @desc 多选下拉框获取选中项
     * @param obj：多选下拉框对象
     * @return 选中项的value
     */
    function getSelectedItem(obj) {
        var val = '';
        var opts;
        if (obj != null && obj != undefined) {
            if (obj.options.length > 0) {
                opts = obj.options;
            } else {
                opts = obj.find('option');
            }
            for (var i = 0; i < opts.length; i++)
                if (opts[i].selected == true) {
                    val += opts[i].value;
                }
        }
        return val;
    };