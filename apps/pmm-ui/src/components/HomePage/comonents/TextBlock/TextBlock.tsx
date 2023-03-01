import { FC } from 'react';

declare type Heading = 'h1' | 'h2';
export interface WelcomeBlockProps {
  header: string;
  headerType: Heading;
  text: string;
}

export const TextBlock: FC<WelcomeBlockProps> = ({ header, text, headerType }) => {
  return (
    <div>
      {headerType === 'h1' ? <h1>{header}</h1> : <h2>{header}</h2>}
      <span>{text}</span>
    </div>
  );
};
