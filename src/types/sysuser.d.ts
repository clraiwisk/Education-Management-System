interface Sysuser {
  role_id: number,
  user_name: string,
  user_pwd: string
}

interface SysuserDivide {
  role_id: number | null,
  user_name: string,
  user_pwd: string,
  visibleTooltip?: boolean
}

interface SysuserSearch {
  role_id: number | null,
  user_name: string,
  begin: number,
  pageSize: number,
  currentPage: number
}

interface SysuserAllList {
  list: Sysuser[];
  total: number;
}

