import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants/common';

const filterPageAndPageSize = (
  page: number = DEFAULT_PAGE,
  pageSize: number = DEFAULT_PAGE_SIZE,
): { skip?: number; take?: number } => {
  return { take: pageSize, skip: (page - 1) * pageSize };
};

const checkIsArrayDuplicated = (arrayToCheck: number[] | string[]): boolean => {
  const checkedObject: Record<string | number, true> = {};
  for (const item of arrayToCheck) {
    if (checkedObject[item]) return true;
    checkedObject[item] = true;
  }

  return false;
};

export { filterPageAndPageSize, checkIsArrayDuplicated };
