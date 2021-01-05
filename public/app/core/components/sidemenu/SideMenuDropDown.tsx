import React, { FC } from 'react';
import _ from 'lodash';
import DropDownChild from './DropDownChild';
import { NavModelItem } from '@grafana/data';
import { css } from 'emotion';

interface Props {
  link: NavModelItem;
  onHeaderClick?: () => void;
}

const SideMenuDropDown: FC<Props> = props => {
  const { link, onHeaderClick } = props;
  let childrenLinks: NavModelItem[] = [];
  if (link.children) {
    childrenLinks = _.filter(link.children, item => !item.hideFromMenu);
  }
  return (
    <ul className="dropdown-menu dropdown-menu--sidemenu psina" role="menu">
      <li className="side-menu-header">
        <a className="side-menu-header-link" href={link.url} onClick={onHeaderClick}>
          <span className="sidemenu-item-text">{link.text}</span>
        </a>
      </li>
      {childrenLinks.map((child, index) => {
        if (child.children) {
          console.log(child);
        }
        return (
          <>
            <DropDownChild child={child} key={`${child.url}-${index}`} />
          </>
        );
      })}
    </ul>
  );
};

export default SideMenuDropDown;
