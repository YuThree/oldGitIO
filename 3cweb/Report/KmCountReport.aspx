<%@ page language="C#" enablesessionstate="true" autoeventwireup="true" inherits="Report_KmStatReport, App_Web_jsayrgfw" %>

<%@ Register Assembly="Microsoft.ReportViewer.WebForms, Version=10.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a"
    Namespace="Microsoft.Reporting.WebForms" TagPrefix="rsweb" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>设备行驶里程统计</title>
    <script type="text/javascript">
        function showmeg() {
            ymPrompt.errorInfo('未查询到相关信息！', null, null, '提示信息', null);
        }
    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <asp:ScriptManager ID="ScriptManager1" runat="server">
        </asp:ScriptManager>
        <rsweb:ReportViewer ID="reportViewer" runat="server" Font-Names="Verdana" Font-Size="8pt"
            Height="730px" InteractiveDeviceInfos="(集合)" WaitMessageFont-Names="Verdana"
            ShowRefreshButton="false" WaitMessageFont-Size="14pt" Width="100%" BackColor="White"
            PageCountMode="Actual" OnPreRender="reportViewer_PreRender">
            <LocalReport ReportPath="Report\rdlc\KMCountReport.rdlc">
                <DataSources>
                    <rsweb:ReportDataSource DataSourceId="ObjectDataSource1" Name="ds" />
                </DataSources>
            </LocalReport>
        </rsweb:ReportViewer>
    </div>
    </form>
</body>
</html>
