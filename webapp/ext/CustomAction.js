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

            var oContext = aSelectedContexts?.[0];
            if (!oContext) {
                MessageToast.show("Please select a row");
                return;
            }

            var oModel = oContext.getModel();

            try {

                // ✅ CORRECT RAP ACTION CALL (FULLY QUALIFIED)
                var oAction = oModel.bindContext(
                    "com.sap.gateway.srvd.zfi_sd_vreport.v0001.PdfPreview(...)",
                    oContext
                );

                await oAction.execute();

                var oResult = oAction.getBoundContext().getObject();

                var sBase64 = oResult.pdf_attachments;

                if (!sBase64) {
                    MessageToast.show("No PDF returned");
                    return;
                }

                // Convert base64 → Blob
                //var byteCharacters = atob(sBase64);

                //var byteArray = Uint8Array.from(byteCharacters, c => c.charCodeAt(0));
                var byteArray = base64ToArrayBuffer(sBase64);

                var blob = new Blob([byteArray], { type: "application/pdf" });

                var pdfUrl = URL.createObjectURL(blob);

                new PDFViewer({
                    source: pdfUrl
                }).open();

            } catch (e) {
                console.error(e);
                MessageToast.show("PdfPreview failed - check RAP action binding");
            }
        }
    };
});