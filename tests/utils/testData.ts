export const USERS = {
  standard_user: 'standard_user',
  locked_out_user: 'locked_out_user',
  problem_user: 'problem_user',
  performance_glitch_user: 'performance_glitch_user',
  error_user: 'error_user',
  visual_user: 'visual_user',
} as const;

export type Username = (typeof USERS)[keyof typeof USERS];

export const getPassword = (): string => {
  const pwd = process.env.TEST_PASSWORD;
  if (!pwd) throw new Error('TEST_PASSWORD is not set');
  return pwd;
};

export const CHECKOUT_DATA = {
  firstName: 'John',
  lastName: 'Doe',
  zipCode: '12345',
};

export const SORT_OPTIONS = {
  nameAsc: 'az',
  nameDesc: 'za',
  priceAsc: 'lohi',
} as const;

export type SortOption = (typeof SORT_OPTIONS)[keyof typeof SORT_OPTIONS];

export const canAccessShop = (user: Username): boolean => user !== USERS.locked_out_user;

export const ALL_USERS = Object.values(USERS) as Username[];
export const SHOP_USERS = ALL_USERS.filter(canAccessShop);

export const tagsFor = (users: Username[]): string[] => users.map((u) => `@${u}`);
