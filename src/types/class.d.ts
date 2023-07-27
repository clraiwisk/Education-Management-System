enum Major {
  all = 0,
  Java = 8,
  Html = 9,
  UI = 10
}

enum Status {
  all = 0,
  start = 1,
  wait = 2,
  end = 3
}

interface ClassSearch {
  cls_name: string;
  cls_dic_id_major: major;
  cls_status: status;
  begin: number;
  pageSize: number;
  currentPage: number;
}

interface ClassModel{
  cls_begin: string | null;
  cls_clsr_id: number | null;
  cls_dic_id_major: Major;
  cls_end: string | null;
  readonly cls_id: number;
  cls_name: string;
  cls_remark: string;
  cls_stf_id_admin: number
  cls_stf_id_admin_name: string;
  cls_stf_id_job: number;
  cls_stf_id_job_name: string;
  cls_stf_id_teacher: number;
  cls_stf_id_teacher_name:string;
}

interface AllClass {
  list: ClassModel[];
  total: number;
}

enum Occupy {
  yes = 1,
  no = 0
}

interface Classroom {
  readonly clsr_id: number;
  clsr_name: string;
  clsr_occupy: Occupy
}

interface SchoolBegin {
  readonly cls_id: number;
  cls_clsr_id: number;
}