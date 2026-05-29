sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"gabc/vreport/vreport/test/integration/pages/VREPORTList",
	"gabc/vreport/vreport/test/integration/pages/VREPORTObjectPage",
	"gabc/vreport/vreport/test/integration/pages/VREPORTHObjectPage"
], function (JourneyRunner, VREPORTList, VREPORTObjectPage, VREPORTHObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('gabc/vreport/vreport') + '/test/flp.html#app-preview',
        pages: {
			onTheVREPORTList: VREPORTList,
			onTheVREPORTObjectPage: VREPORTObjectPage,
			onTheVREPORTHObjectPage: VREPORTHObjectPage
        },
        async: true
    });

    return runner;
});

