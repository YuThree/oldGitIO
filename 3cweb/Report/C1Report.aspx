﻿<%@ page language="C#" enablesessionstate="true" autoeventwireup="true" inherits="Report_C1Report, App_Web_bayfktcg" %>

<%@ Register Assembly="Microsoft.ReportViewer.WebForms, Version=10.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a"
    Namespace="Microsoft.Reporting.WebForms" TagPrefix="rsweb" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <script src="/Common/js/6cweb/LoadPubFile_base.js" type="text/javascript"></script>
    <script type="text/javascript">
        loadControl("jqueryUI");
    </script>
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
        <rsweb:ReportViewer ID="reportViewer" runat="server" Height="640px" Width="100%"
            Font-Names="Verdana" Font-Size="8pt" InteractiveDeviceInfos="(集合)" WaitMessageFont-Names="Verdana"
            WaitMessageFont-Size="14pt" BackColor="White" PageCountMode="Actual" OnPreRender="ReportViewer1_PreRender" ShowRefreshButton="False">
            <LocalReport ReportPath="Report\rdlc\C1\C1Report.rdlc">
            </LocalReport>
        </rsweb:ReportViewer>
    </div>
    </form>
</body>
</html>