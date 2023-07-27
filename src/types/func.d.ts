interface Func {
  readonly func_id: number;
  func_name: string;
  func_fid: number;
  func_key: string;
}

interface FuncNode extends Func {
  children?: FuncNode[]
}

interface Login {
  user_name: string;
  user_pwd: string;
}

interface Dictionary {
  dic_id: number,
  dic_name: string,
  dic_group_key: string,
  dic_group_name: string
}