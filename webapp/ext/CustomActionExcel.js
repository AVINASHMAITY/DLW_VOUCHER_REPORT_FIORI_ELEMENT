sap.ui.define([
    "sap/m/MessageToast"
], function (MessageToast) {
    "use strict";

    function base64ToArrayBuffer(base64) {

        base64 = base64.replace(/\s/g, "");
        base64 = base64.replace(/-/g, "+").replace(/_/g, "/");

        while (base64.length % 4 !== 0) {
            base64 += "=";
        }

        const binary = window.atob(base64);
        const bytes = new Uint8Array(binary.length);

        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }

        return bytes;
    }

    return {

        onPreviewExcel: async function (oBindingContext, aSelectedContexts) {

            if (!aSelectedContexts || aSelectedContexts.length === 0) {
                MessageToast.show("Please select at least one row");
                return;
            }

            if (aSelectedContexts.length > 1) {
                MessageToast.show("Please select only one row");
                return;
            }

            const oContext = aSelectedContexts[0];
            const oModel = oContext.getModel();

            const oAction = oModel.bindContext(
                "com.sap.gateway.srvd.zfi_sd_vreport.v0001.ExcelPreview(...)",
                oContext
            );

            await oAction.execute();

            const oResult = oAction.getBoundContext().getObject();

            if (!oResult?.excel_attachments) {
                MessageToast.show("No Excel data received");
                return;
            }

            const excelBytes = base64ToArrayBuffer(
                oResult.excel_attachments
            );

            const blob = new Blob(
                [excelBytes],
                {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                }
            );

            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = oResult.filename || "Report.xml";

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(url);
        }
    };
});