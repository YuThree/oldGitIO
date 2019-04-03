<%@ WebHandler Language="C#" Class="Select" %>

using System;
using System.Web;
using Api.Foundation.entity.Foundation;
using System.Collections.Generic;
using Api.Foundation.service;
using Api;
using System.Text;
using Api.Foundation.entity.Cond;

public class Select : ReferenceClass, IHttpHandler
{
    
    public void ProcessRequest (HttpContext context) {
        string selectList;
        IList<Line> lineList = ServiceAccessor.GetFoundationService().getAllLine();
        selectList = "<select id='lineselect' style='width: 130px;' >";
        selectList += "<option value='0'>--全部--</option>";
        foreach (Line line in lineList)
        {
            selectList += "<option value='" + line.LINE_CODE + "'>" + line.LINE_NAME + "</option>";
        }
        selectList += "</select>";
        selectList += "$<select id='ddlTxtLine' style='width: 135px;'>";
        selectList += "<option value='0'>--全部--</option>";
        foreach (Line line in lineList)
        {
            selectList += "<option value='" + line.LINE_CODE + "'>" + line.LINE_NAME + "</option>";
        }
        selectList += "</select>";
        HttpContext.Current.Response.Write(selectList);
        
        
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}