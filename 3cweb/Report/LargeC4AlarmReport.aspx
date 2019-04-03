<%@ page language="C#" enablesessionstate="true" autoeventwireup="true" inherits="Report_LargeC4AlarmReport, App_Web_bayfktcg" %>

<%@ Register assembly="Microsoft.ReportViewer.WebForms, Version=10.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a" namespace="Microsoft.Reporting.WebForms" tagprefix="rsweb" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
</head>
<center>
    <body style="background-color: #D0D0D0;">
        <form id="form1" runat="server">
        <div>
            <asp:ScriptManager ID="ScriptManager1" runat="server">
            </asp:ScriptManager>
            <rsweb:ReportViewer ID="ReportViewer1" runat="server" Font-Names="Verdana" Font-Size="8pt"
                Height="730px" InteractiveDeviceInfos="(集合)" WaitMessageFont-Names="Verdana" ShowRefreshButton=false
                WaitMessageFont-Size="14pt" Width="850px" BackColor="White" PageCountMode="Actual"
                OnPreRender="ReportViewer1_PreRender">
                <LocalReport ReportPath="Report\rdlc\C4\LargeC4AlarmReport.rdlc">
                    <DataSources>
                        <rsweb:ReportDataSource DataSourceId="ObjectDataSource1" Name="LargeC4DS" />
                    </DataSources>
                </LocalReport>
            </rsweb:ReportViewer>
        </div>
        </form>
    </body>
</center>
</html>
