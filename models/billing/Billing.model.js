import { types } from 'mobx-state-tree';
import _ from 'lodash';
// Utils
import TARIFF from '_core/utils/tariff.utils';
// Actions
import dataActions from '_core/models/billing/actions/dataBilling.actions';
import fetchActions from '_core/models/billing/actions/fetchBilling.actions';
import logicActions from '_core/models/billing/actions/logicBilling.actions';
// Models
import TariffsModel from '_core/models/tariffs/Tariffs.model';
import LicensesModel from '_core/models/licenses/Licenses.model';
import PaymentModel from '_core/models/payment/Payment.model';

const BillingModel = {
    currency: types.maybe(types.string),
    btc_rate: types.maybeNull(types.number),
    payment_card: types.maybeNull(types.string),
    payments: types.optional(types.array(PaymentModel), []),
    rebill_is_active: types.maybeNull(types.boolean),
    licenses: types.maybe(types.array(LicensesModel)),
    tariffs: types.maybe(types.array(TariffsModel)),
};

const views = (self) => {
    return {
        get filteredTariffs() {
            const tariffs = self.tariffs.filter((tariff) => {
                return tariff.product === TARIFF.FEX_PLUS && !tariff.is_trial;
            });

            return tariffs.filter((tariff) => {
                return tariff.period !== TARIFF.DAYS_IN_MONTH;
            });
        },

        get groupTariffsByNameAndValue() {
            const collectionGroupByName = _.groupBy(
                _.sortBy(self.filteredTariffs, ['period']),
                (tariff) => tariff.name
            );

            return Object.keys(collectionGroupByName).reduce(
                (acc, tariffName) => {
                    const item = _.groupBy(
                        collectionGroupByName[tariffName],
                        (e) => e.value
                    );
                    return { ...acc, [tariffName]: item };
                },
                {}
            );
        },

        get filterOneYearTariffs() {
            const filterOnlyOneYearTariff = (tariffs) => {
                return tariffs.filter((tariff) => {
                    return tariff.period === TARIFF.DAYS_IN_YEAR;
                });
            };

            return Object.keys(self.groupTariffsByNameAndValue).reduce(
                (acc, productName) => {
                    const itemProduct = Object.keys(
                        self.groupTariffsByNameAndValue[productName]
                    ).reduce((acc, tariffName) => {
                        const itemTariff = filterOnlyOneYearTariff(
                            self.groupTariffsByNameAndValue[productName][
                                tariffName
                            ]
                        );
                        return { ...acc, [tariffName]: itemTariff };
                    }, []);
                    return { ...acc, [productName]: itemProduct };
                },
                {}
            );
        },

        get groupTariffsByProductAndValue() {
            const collectionGroupByName = _.groupBy(
                _.sortBy(self.tariffs, ['period']),
                (tariff) => tariff.product
            );

            return Object.keys(collectionGroupByName).reduce(
                (acc, tariffName) => {
                    const item = _.groupBy(
                        collectionGroupByName[tariffName],
                        (e) => e.value
                    );
                    return { ...acc, [tariffName]: item };
                },
                {}
            );
        },

        get currentTariff() {
            return self.licenses.filter((tariff) => {
                return tariff.product === TARIFF.FEX_PLUS;
            });
        },
    };
};

// model mutations goes only in actions
const actions = (self) => {
    return {
        ...dataActions(self),
        ...fetchActions(self),
        ...logicActions(self),
    };
};

export default types
    .model('BillingModel', BillingModel)
    .views(views)
    .actions(actions);
