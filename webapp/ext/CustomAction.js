sap.ui.define([
    "sap/m/MessageToast",
    "sap/m/PDFViewer"
], function (MessageToast, PDFViewer) {
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

        onPreviewPDF: async function (oBindingContext, aSelectedContexts) {

            if (!aSelectedContexts || aSelectedContexts.length === 0) {
                MessageToast.show("Please select at least one row");
                return;
            }

            const oContext = aSelectedContexts[0];
            const oModel = oContext.getModel();

            const oAction = oModel.bindContext(
                "com.sap.gateway.srvd.zfi_sd_vreport.v0001.PdfPreview(...)",
                oContext
            );

            const aParameters = aSelectedContexts.map(function (oCtx) {

                const oData = oCtx.getObject();

                return {
                    // DummyKey: "1",
                    PaymentRunID: oData.PaymentRunID,
                    PaymentRunDate: oData.PaymentRunDate
                };
            });

            oAction.setParameter("_Parameters", aParameters);

            await oAction.execute();

            const oResult = oAction.getBoundContext().getObject();

            var byteArray = base64ToArrayBuffer(oResult.pdf_attachments);

            const blob = new Blob(
                [byteArray],
                { type: "application/pdf" }
            );

            const pdfUrl = URL.createObjectURL(blob);

            new PDFViewer({
                source: pdfUrl
            }).open();
        }
    };
});