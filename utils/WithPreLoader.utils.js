import React from 'react';
import ReactPropTypes from 'prop-types';
// Mobx
import { observer } from 'mobx-react';
// Store
import store from '_core/store';
// Components
import PreLoader from '_core/components/elements/PreLoader';

function WithPreLoader(props) {
    const isFulfilled = props.fetchModels.every((fetchKey) =>
        store.status.isFetched(fetchKey)
    );

    const isRejected = props.fetchModels.every((fetchKey) =>
        store.status.isRejected(fetchKey)
    );

    if (isRejected) return null;

    if (!isFulfilled) {
        return (
            <span className={props.classMod}>
                <PreLoader type="content" />
            </span>
        );
    }

    return props.children;
}

WithPreLoader.displayName = 'WithPreLoader';

WithPreLoader.propTypes = {
    fetchModels: ReactPropTypes.array.isRequired,
};

export default observer(WithPreLoader);
