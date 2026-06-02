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

            //------Looping Through Selected Contexts for getting PDFs------
            //==============================================================
            const aPdfs = [];
            for (const oContext of aSelectedContexts) {

                const oModel = oContext.getModel();

                const oAction = oModel.bindContext(
                    "com.sap.gateway.srvd.zfi_sd_vreport.v0001.PdfPreview(...)",
                    oContext
                );

                await oAction.execute();

                const oResult = oAction.getBoundContext().getObject();

                if (oResult?.pdf_attachments) {
                    aPdfs.push(oResult.pdf_attachments);
                }
            }
            console.log(aPdfs.length);
            //------Looping Through Selected Contexts for getting PDFs------


            //------Merging All PDFs----------------------------------------
            //==============================================================
            const mergedPdf = await PDFLib.PDFDocument.create();

            for (const sBase64 of aPdfs) {

                const pdfBytes = base64ToArrayBuffer(sBase64);

                const pdf = await PDFLib.PDFDocument.load(pdfBytes);

                const pages = await mergedPdf.copyPages(
                    pdf,
                    pdf.getPageIndices()
                );

                pages.forEach(page => mergedPdf.addPage(page));
            }

            const mergedBytes = await mergedPdf.save();
            //------Merging All PDFs----------------------------------------



            //------Showing Merged PDF in SAPUI5 PDFViewer control----------
            //==============================================================
            const blob = new Blob(
                [mergedBytes],
                { type: "application/pdf" }
            );

            const pdfUrl = URL.createObjectURL(blob);

            new PDFViewer({
                source: pdfUrl
            }).open();
        }
    };
});