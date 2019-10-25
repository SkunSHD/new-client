import { types } from 'mobx-state-tree';
// Models
import GoogleAdsModel from '_core/models/googleServices/GoogleAds.model';
import GoogleAnalyticsModel from '_core/models/googleServices/GoogleAnalytics.model';

const GoogleServices = types.model({
    ads: GoogleAdsModel,
    analytics: GoogleAnalyticsModel,
});

const volatile = (self) => ({});

const actions = (self) => ({});

export default GoogleServices.volatile(volatile).actions(actions);
