enum Invalid { Depart = 0, Job = 1 }
enum Category { Input = 0, Market = 7, Employ = 6,  AcademicAffairs = 5, Teaching = 4 }

interface StaffModel {
  readonly stf_id: number;
  stf_name: string;
  stf_remark: string;
  stf_category: Category | string;
  stf_invalid: Invalid;
}

interface StaffSearch {
  stf_name: string;
  stf_category: Category;
  begin: number;
  pageSize: number;
  currentPage: number;
}

interface AllList {
  list: StaffModel[];
  total: number;
}