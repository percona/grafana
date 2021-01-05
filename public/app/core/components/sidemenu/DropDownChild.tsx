import React, { FC } from 'react';
import { css } from 'emotion';
import { Icon, IconName, useTheme } from '@grafana/ui';

export interface Props {
  child: any;
}

const DropDownChild: FC<Props> = props => {
  const { child } = props;
  const listItemClassName = child.divider ? 'divider' : '';
  const theme = useTheme();
  const iconClassName = css`
    margin-right: ${theme.spacing.sm};
  `;

  const childrenMenu = child.children
    ? child.children.map((child, index) => {
        return (
          <>
            <DropDownChild child={child} key={`${child.url}-${index}`} />
          </>
        );
      })
    : null;

  const renderChildren = !!child.children;
  return (
    <li className={listItemClassName}>
      <a href={child.url}>
        {child.icon && <Icon name={child.icon as IconName} className={iconClassName} />}
        {child.text}
      </a>
      {renderChildren ? <ul className="sidemenu dropdown-menu--sidemenu submenu">{childrenMenu}</ul> : null}
    </li>
  );
};

export default DropDownChild;
