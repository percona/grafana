import React, { useEffect, useMemo, useState } from 'react';
import { Stack } from '@grafana/experimental';
import { Button, Form, Select } from '@grafana/ui';
import { CloseButton } from 'app/core/components/CloseButton/CloseButton';
import { ServiceAccountPicker } from 'app/core/components/Select/ServiceAccountPicker';
import { TeamPicker } from 'app/core/components/Select/TeamPicker';
import { UserPicker } from 'app/core/components/Select/UserPicker';
import { Trans, t } from 'app/core/internationalization';
import { OrgRole } from 'app/types/acl';
import { PermissionTarget } from './types';
export const AddPermission = ({ title = t('access-control.add-permission.title', 'Add permission for'), permissions, assignments, onAdd, onCancel, }) => {
    const [target, setPermissionTarget] = useState(PermissionTarget.None);
    const [teamId, setTeamId] = useState(0);
    const [userId, setUserId] = useState(0);
    const [builtInRole, setBuiltinRole] = useState('');
    const [permission, setPermission] = useState('');
    const targetOptions = useMemo(() => {
        const options = [];
        if (assignments.users) {
            options.push({ value: PermissionTarget.User, label: t('access-control.add-permission.user-label', 'User') });
        }
        if (assignments.serviceAccounts) {
            options.push({
                value: PermissionTarget.ServiceAccount,
                label: t('access-control.add-permission.serviceaccount-label', 'Service Account'),
            });
        }
        if (assignments.teams) {
            options.push({ value: PermissionTarget.Team, label: t('access-control.add-permission.team-label', 'Team') });
        }
        if (assignments.builtInRoles) {
            options.push({
                value: PermissionTarget.BuiltInRole,
                label: t('access-control.add-permission.role-label', 'Role'),
            });
        }
        return options;
    }, [assignments]);
    useEffect(() => {
        if (permissions.length > 0) {
            setPermission(permissions[0]);
        }
    }, [permissions]);
    const isValid = () => (target === PermissionTarget.Team && teamId > 0) ||
        (target === PermissionTarget.User && userId > 0) ||
        (target === PermissionTarget.ServiceAccount && userId > 0) ||
        (PermissionTarget.BuiltInRole && OrgRole.hasOwnProperty(builtInRole));
    return (React.createElement("div", { className: "cta-form", "aria-label": "Permissions slider" },
        React.createElement(CloseButton, { onClick: onCancel }),
        React.createElement("h5", null, title),
        React.createElement(Form, { name: "addPermission", maxWidth: "none", onSubmit: () => onAdd({ userId, teamId, builtInRole, permission, target }) }, () => (React.createElement(Stack, { gap: 1, direction: "row" },
            React.createElement(Select, { "aria-label": "Role to add new permission to", value: target, options: targetOptions, onChange: (v) => setPermissionTarget(v.value), disabled: targetOptions.length === 0, width: "auto" }),
            target === PermissionTarget.User && React.createElement(UserPicker, { onSelected: (u) => setUserId((u === null || u === void 0 ? void 0 : u.value) || 0) }),
            target === PermissionTarget.ServiceAccount && (React.createElement(ServiceAccountPicker, { onSelected: (u) => setUserId((u === null || u === void 0 ? void 0 : u.value) || 0) })),
            target === PermissionTarget.Team && React.createElement(TeamPicker, { onSelected: (t) => { var _a; return setTeamId(((_a = t.value) === null || _a === void 0 ? void 0 : _a.id) || 0); } }),
            target === PermissionTarget.BuiltInRole && (React.createElement(Select, { "aria-label": 'Built-in role picker', options: Object.values(OrgRole)
                    .filter((r) => r !== OrgRole.None)
                    .map((r) => ({ value: r, label: r })), onChange: (r) => setBuiltinRole(r.value || ''), width: "auto" })),
            React.createElement(Select, { "aria-label": "Permission Level", width: "auto", value: permissions.find((p) => p === permission), options: permissions.map((p) => ({ label: p, value: p })), onChange: (v) => setPermission(v.value || '') }),
            React.createElement(Button, { type: "submit", disabled: !isValid() },
                React.createElement(Trans, { i18nKey: "access-control.add-permissions.save" }, "Save")))))));
};
//# sourceMappingURL=AddPermission.js.map