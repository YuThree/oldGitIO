<%@ page language="C#" enablesessionstate="true" autoeventwireup="true" inherits="PowerReport, App_Web_kp2n3dje" %>

<%@ Register Assembly="Microsoft.ReportViewer.WebForms, Version=10.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a"
    Namespace="Microsoft.Reporting.WebForms" TagPrefix="rsweb" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <base target="_blank"/>
    <link href="/C3/PC/css/scrollStyle.css" rel="stylesheet" />
</head>
    <body style="">
        <form id="form2" runat="server">
        <div>
            <asp:ScriptManager ID="ScriptManager2" runat="server">
            </asp:ScriptManager>
            <rsweb:ReportViewer ID="ReportViewer1" runat="server" Font-Names="Verdana" Font-Size="8pt"
                Height="800px" InteractiveDeviceInfos="(集合)" WaitMessageFont-Names="Verdana" ShowRefreshButton=false
                WaitMessageFont-Size="14pt" Width="100%" BackColor="White" PageCountMode="Actual"
                OnPreRender="ReportViewer1_PreRender">
                <LocalReport ReportPath="Common\LineCoverage\rdlc\PowerReport.rdlc">
                    <DataSources>
                        <rsweb:ReportDataSource DataSourceId="ObjectDataSource1" Name="DataSet" />
                    </DataSources>
                </LocalReport>
            </rsweb:ReportViewer>
        </div>
        </form>
    </body>
     
</html>
