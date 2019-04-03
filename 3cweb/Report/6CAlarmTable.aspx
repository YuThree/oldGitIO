<%@ page language="C#" enablesessionstate="true" autoeventwireup="true" inherits="Report_6CAlarmTable, App_Web_bayfktcg" %>

<%@ Register Assembly="Microsoft.ReportViewer.WebForms, Version=10.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a"
    Namespace="Microsoft.Reporting.WebForms" TagPrefix="rsweb" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <asp:ScriptManager ID="ScriptManager1" runat="server">
        </asp:ScriptManager>
        <rsweb:ReportViewer ID="reportViewer" runat="server" Font-Names="Verdana" Font-Size="8pt"
            InteractiveDeviceInfos="(集合)" WaitMessageFont-Names="Verdana" WaitMessageFont-Size="14pt"
            Width="100%" Height="430px" BackColor="White" PageCountMode="Actual" OnPreRender="reportViewer_PreRender"
            ShowRefreshButton="False">
            <LocalReport ReportPath="Report\rdlc\DPC\AlarmTableReport.rdlc">
            </LocalReport>
        </rsweb:ReportViewer>
    </div>
    </form>
</body>
</html>
