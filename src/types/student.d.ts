enum Sex {
  Male = 1,
  Female = 0
}

interface StudentModel {
  stu_address: string;
  stu_avatar: string | null;
  stu_born: string
  stu_cls_id: number | null;
  stu_id: number;
  stu_major: string;
  stu_name: string;
  stu_phone: string
  stu_phone2: string
  stu_qualification: number;
  stu_remark: string
  stu_school: string
  stu_sex: Sex
}

interface SdtSearch {
  stu_name: string; 
  stu_cls_id: number;
  stu_qualification: number;
  begin: number;
  pageSize: number;
  currentPage: number
}

interface StudentList {
  total: number;
  list: StudentModel[]
}

interface assignClass {
  readonly stu_id: number | null;
  stu_ids: number[];
  stu_cls_id: number;
}

interface avatarModel {
  readonly stu_id: number;
  stu_avatar_old: string; 
  stu_avatar_new: string;
}

