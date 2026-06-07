sap.ui.define([
    "sap/m/MessageToast"
], function (MessageToast) {
    "use strict";

    return {

        onTest: async function (oBindingContext, aSelectedContexts) {

            // const oContext = aSelectedContexts[0];
            // const oData = oContext.getObject();
            // const oModel = oContext.getModel();

            // const oAction = oModel.bindContext(
            //     // "/test(...)"
            //     "com.sap.gateway.srvd.zfi_sd_vreport.v0001.test(...)",
            //     oContext,
            // );

            // oAction.setParameter(
            //     "PaymentRunID",
            //     oData.PaymentRunID
            // );

            // oAction.setParameter(
            //     "PaymentRunDate",
            //     oData.PaymentRunDate
            // );

            // await oAction.execute();

            // const oResult = oAction.getBoundContext()?.getObject();

            // console.log(oResult);

            if (!aSelectedContexts?.length) {
                MessageToast.show("Select at least one row");
                return;
            }

            const oContext = aSelectedContexts[0];
            const oModel = oContext.getModel();

            const oAction = oModel.bindContext(
                "com.sap.gateway.srvd.zfi_sd_vreport.v0001.test(...)",
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

            console.log(aParameters);
            
            await oAction.execute();

            const oResult = oAction.getBoundContext()?.getObject();

            console.log(oResult);
        }
    };
});