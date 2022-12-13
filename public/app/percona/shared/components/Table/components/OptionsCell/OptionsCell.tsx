import React, { FC } from 'react';

import { Dropdown, IconButton } from '@grafana/ui';

import { styles } from './OptionsCell.styles';
import { OptionsCellProps } from './OptionsCell.types';

const OptionsCell: FC<OptionsCellProps> = ({ menu }) => (
  <div className={styles.Cell}>
    <Dropdown overlay={menu}>
      <IconButton name="ellipsis-v" />
    </Dropdown>
  </div>
);

export default OptionsCell;
