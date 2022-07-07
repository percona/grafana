export const stripPerconaApiId = (id: string, placeholder: string) => {
  const regex = new RegExp(`/${placeholder}/(.*)`);
  const match = regex.exec(id);

  if (match && match.length > 0) {
    return match[1] || '';
  }

  return '';
};

export const formatPerconaApiId = (id: string, placeholder: string) => `/${placeholder}/${id}`;
