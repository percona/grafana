import { __awaiter } from "tslib";
import { css, cx } from '@emotion/css';
import React, { useEffect, useRef, useState } from 'react';
import { Button, CustomScrollbar, HorizontalGroup, TextLink, useStyles2, useTheme2 } from '@grafana/ui';
import { getSelectStyles } from '@grafana/ui/src/components/Select/getSelectStyles';
import { BuiltinRoleSelector } from './BuiltinRoleSelector';
import { RoleMenuGroupsSection } from './RoleMenuGroupsSection';
import { MENU_MAX_HEIGHT } from './constants';
import { getStyles } from './styles';
var GroupType;
(function (GroupType) {
    GroupType["fixed"] = "fixed";
    GroupType["custom"] = "custom";
    GroupType["plugin"] = "plugin";
})(GroupType || (GroupType = {}));
const fixedRoleGroupNames = {
    ldap: 'LDAP',
    current: 'Current org',
};
const tooltipMessage = (React.createElement(React.Fragment, null,
    "You can now select the \"No basic role\" option and add permissions to your custom needs. You can find more information in\u00A0",
    React.createElement(TextLink, { href: "https://grafana.com/docs/grafana/latest/administration/roles-and-permissions/#organization-roles", variant: "bodySmall", external: true }, "our documentation"),
    "."));
export const RolePickerMenu = ({ basicRole, options, appliedRoles, showGroups, basicRoleDisabled, disabledMessage, showBasicRole, onSelect, onBasicRoleSelect, onUpdate, updateDisabled, offset, apply, }) => {
    const [selectedOptions, setSelectedOptions] = useState(appliedRoles);
    const [selectedBuiltInRole, setSelectedBuiltInRole] = useState(basicRole);
    const [rolesCollection, setRolesCollection] = useState({});
    const subMenuNode = useRef(null);
    const theme = useTheme2();
    const styles = getSelectStyles(theme);
    const customStyles = useStyles2(getStyles);
    // Call onSelect() on every selectedOptions change
    useEffect(() => {
        onSelect(selectedOptions);
    }, [selectedOptions, onSelect]);
    useEffect(() => {
        if (onBasicRoleSelect && selectedBuiltInRole) {
            onBasicRoleSelect(selectedBuiltInRole);
        }
    }, [selectedBuiltInRole, onBasicRoleSelect]);
    // Evaluate rolesCollection only if options changed, otherwise
    // it triggers unnecessary re-rendering of <RoleMenuGroupsSection /> component
    useEffect(() => {
        const customRoles = options.filter(filterCustomRoles).sort(sortRolesByName);
        const fixedRoles = options.filter(filterFixedRoles).sort(sortRolesByName);
        const pluginRoles = options.filter(filterPluginsRoles).sort(sortRolesByName);
        const optionGroups = {
            fixed: convertRolesToGroupOptions(fixedRoles).sort((a, b) => a.name.localeCompare(b.name)),
            custom: convertRolesToGroupOptions(customRoles).sort((a, b) => a.name.localeCompare(b.name)),
            plugin: convertRolesToGroupOptions(pluginRoles).sort((a, b) => a.name.localeCompare(b.name)),
        };
        setRolesCollection({
            fixed: {
                groupType: GroupType.fixed,
                optionGroup: optionGroups.fixed,
                renderedName: `Fixed roles`,
                roles: fixedRoles,
            },
            custom: {
                groupType: GroupType.custom,
                optionGroup: optionGroups.custom,
                renderedName: `Custom roles`,
                roles: customRoles,
            },
            plugin: {
                groupType: GroupType.plugin,
                optionGroup: optionGroups.plugin,
                renderedName: `Plugin roles`,
                roles: pluginRoles,
            },
        });
    }, [options]);
    const getSelectedGroupOptions = (group) => {
        const selectedGroupOptions = [];
        for (const role of selectedOptions) {
            if (getRoleGroup(role) === group) {
                selectedGroupOptions.push(role);
            }
        }
        return selectedGroupOptions;
    };
    const groupSelected = (groupType, group) => {
        var _a;
        const selectedGroupOptions = getSelectedGroupOptions(group);
        const groupOptions = (_a = rolesCollection[groupType]) === null || _a === void 0 ? void 0 : _a.optionGroup.find((g) => g.value === group);
        return selectedGroupOptions.length > 0 && selectedGroupOptions.length >= groupOptions.options.length;
    };
    const groupPartiallySelected = (groupType, group) => {
        var _a;
        const selectedGroupOptions = getSelectedGroupOptions(group);
        const groupOptions = (_a = rolesCollection[groupType]) === null || _a === void 0 ? void 0 : _a.optionGroup.find((g) => g.value === group);
        return selectedGroupOptions.length > 0 && selectedGroupOptions.length < groupOptions.options.length;
    };
    const onChange = (option) => {
        if (selectedOptions.find((role) => role.uid === option.uid)) {
            setSelectedOptions(selectedOptions.filter((role) => role.uid !== option.uid));
        }
        else {
            setSelectedOptions([...selectedOptions, option]);
        }
    };
    const onGroupChange = (groupType, value) => {
        var _a;
        const group = (_a = rolesCollection[groupType]) === null || _a === void 0 ? void 0 : _a.optionGroup.find((g) => {
            return g.value === value;
        });
        if (!group) {
            return;
        }
        if (groupSelected(groupType, value) || groupPartiallySelected(groupType, value)) {
            setSelectedOptions(selectedOptions.filter((role) => !group.options.find((option) => role.uid === option.uid)));
        }
        else {
            const groupOptions = group.options.filter((role) => role.delegatable);
            const restOptions = selectedOptions.filter((role) => !group.options.find((option) => role.uid === option.uid));
            setSelectedOptions([...restOptions, ...groupOptions]);
        }
    };
    const onSelectedBuiltinRoleChange = (newRole) => {
        setSelectedBuiltInRole(newRole);
    };
    const onClearInternal = () => __awaiter(void 0, void 0, void 0, function* () {
        setSelectedOptions([]);
    });
    const onClearSubMenu = (group) => {
        const options = selectedOptions.filter((role) => {
            const roleGroup = getRoleGroup(role);
            return roleGroup !== group;
        });
        setSelectedOptions(options);
    };
    const onUpdateInternal = () => {
        onUpdate(selectedOptions, selectedBuiltInRole);
    };
    return (React.createElement("div", { className: cx(styles.menu, customStyles.menuWrapper, { [customStyles.menuLeft]: offset.horizontal > 0 }, css `
          bottom: ${offset.vertical > 0 ? `${offset.vertical}px` : 'unset'};
          top: ${offset.vertical < 0 ? `${Math.abs(offset.vertical)}px` : 'unset'};
        `) },
        React.createElement("div", { className: customStyles.menu, "aria-label": "Role picker menu" },
            React.createElement(CustomScrollbar, { autoHide: false, autoHeightMax: `${MENU_MAX_HEIGHT}px`, hideHorizontalTrack: true, hideVerticalTrack: true, 
                // NOTE: this is a way to force hiding of the scrollbar
                // the scrollbar makes the mouseEvents drop
                className: cx(customStyles.hideScrollBar) },
                showBasicRole && (React.createElement("div", { className: customStyles.menuSection },
                    React.createElement(BuiltinRoleSelector, { value: selectedBuiltInRole, onChange: onSelectedBuiltinRoleChange, disabled: basicRoleDisabled, disabledMesssage: disabledMessage, tooltipMessage: tooltipMessage }))),
                Object.entries(rolesCollection).map(([groupId, collection]) => (React.createElement(RoleMenuGroupsSection, { key: groupId, roles: collection.roles, renderedName: collection.renderedName, showGroups: showGroups, optionGroups: collection.optionGroup, groupSelected: (group) => groupSelected(collection.groupType, group), groupPartiallySelected: (group) => groupPartiallySelected(collection.groupType, group), onGroupChange: (group) => onGroupChange(collection.groupType, group), subMenuNode: subMenuNode === null || subMenuNode === void 0 ? void 0 : subMenuNode.current, selectedOptions: selectedOptions, onRoleChange: onChange, onClearSubMenu: onClearSubMenu, showOnLeftSubMenu: offset.horizontal > 0 })))),
            React.createElement("div", { className: customStyles.menuButtonRow },
                React.createElement(HorizontalGroup, { justify: "flex-end" },
                    React.createElement(Button, { size: "sm", fill: "text", onClick: onClearInternal, disabled: updateDisabled }, "Clear all"),
                    React.createElement(Button, { size: "sm", onClick: onUpdateInternal, disabled: updateDisabled }, apply ? `Apply` : `Update`)))),
        React.createElement("div", { ref: subMenuNode })));
};
const filterCustomRoles = (option) => { var _a; return !((_a = option.name) === null || _a === void 0 ? void 0 : _a.startsWith('fixed:')) && !option.name.startsWith('plugins:'); };
const filterFixedRoles = (option) => { var _a; return (_a = option.name) === null || _a === void 0 ? void 0 : _a.startsWith('fixed:'); };
const filterPluginsRoles = (option) => { var _a; return (_a = option.name) === null || _a === void 0 ? void 0 : _a.startsWith('plugins:'); };
const convertRolesToGroupOptions = (roles) => {
    const groupsMap = {};
    roles.forEach((role) => {
        const groupId = getRoleGroup(role);
        const groupName = getRoleGroupName(role);
        if (!groupsMap[groupId]) {
            groupsMap[groupId] = { name: groupName, roles: [] };
        }
        groupsMap[groupId].roles.push(role);
    });
    const groups = Object.entries(groupsMap).map(([groupId, groupEntry]) => {
        return {
            name: fixedRoleGroupNames[groupId] || capitalize(groupEntry.name),
            value: groupId,
            options: groupEntry.roles.sort(sortRolesByName),
        };
    });
    return groups;
};
const getRoleGroup = (role) => {
    const prefix = getRolePrefix(role);
    const name = getRoleGroupName(role);
    return `${prefix}:${name}`;
};
const getRoleGroupName = (role) => {
    return role.group || 'Other';
};
const getRolePrefix = (role) => {
    const prefixEnd = role.name.indexOf(':');
    if (prefixEnd < 0) {
        return 'unknown';
    }
    return role.name.substring(0, prefixEnd);
};
const sortRolesByName = (a, b) => a.name.localeCompare(b.name);
const capitalize = (s) => {
    return s.slice(0, 1).toUpperCase() + s.slice(1);
};
//# sourceMappingURL=RolePickerMenu.js.map