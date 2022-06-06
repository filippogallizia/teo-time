const size = {
  phone: '768px',
  tablet: '1024px',
  laptop: '1280px',
  laptopL: '1366px',
  desktop: '1920px',
};

export const device = {
  phone: `(max-width: ${size.phone})`,
  tablet: `(max-width: ${size.tablet}) and (min-width: ${size.phone})`,
  laptop: `(max-width: ${size.laptop}) and (min-width: ${size.tablet})`,
  laptopL: `(max-width: ${size.laptopL}) and (min-width: ${size.laptop})`,
  desktop: `(min-width: ${size.desktop})`,
};
