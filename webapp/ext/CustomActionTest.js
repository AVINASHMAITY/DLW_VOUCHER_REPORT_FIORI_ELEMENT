sap.ui.define([
    "sap/m/MessageToast"
], function (MessageToast) {
    "use strict";

    return {

        onTest: async function (oBindingContext, aSelectedContexts) {

            const aKeys = aSelectedContexts.map(oContext => ({
                PaymentRunID: oContext.getObject().PaymentRunID,
                PaymentRunDate: oContext.getObject().PaymentRunDate
            }));


            const oAction = oModel.bindContext(
                "com.sap.gateway.srvd.zfi_sd_vreport.v0001.test(...)",
                oContext
            );

            oAction.setParameter("Keys", aKeys);
            await oAction.execute();
        }
    };
});