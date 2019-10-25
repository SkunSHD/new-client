import { types } from 'mobx-state-tree';

const AlertModel = {
    id: types.identifier,
    iconName: types.maybe(types.string),
    theme: types.enumeration(['success', 'error', 'warning', 'info']),
    place: types.enumeration(['header', 'content', 'footer']),
    body: types.maybe(types.frozen()), // Component || undefined
    closable: true,
    classMod: types.maybe(types.string),
    showOnPages: types.optional(types.array(types.string), ['all']), // ['all'] || ['PageName', 'PageName2]
    timer: types.optional(types.number, 5000),
    onClose: types.maybe(types.frozen()),
};

export default types.model('AlertModel', AlertModel);
