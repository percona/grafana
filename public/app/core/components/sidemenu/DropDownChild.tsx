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

  const data = child.children ? (
    child.children.map((child, index) => {
      return (
        <>
          <DropDownChild child={child} key={`${child.url}-${index}`} />
        </>
      );
    })
  ) : (
    <div>123</div>
  );

  const renderChildren = !!child.children;
  return (
    <li className={listItemClassName}>
      <a href={child.url}>
        {child.icon && <Icon name={child.icon as IconName} className={iconClassName} />}
        {child.text}
        {renderChildren ? <ul className={'submenu'}>{data}</ul> : 'net'}
      </a>
    </li>
  );
};

export default DropDownChild;
