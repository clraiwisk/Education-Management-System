import service from "@/utils/service";

export const getList = (data: SdtSearch) => service({ method: "post", url: "/student/list", data }) as Promise<StudentList>
export const validPhone = (data: string) => service({ method: "post", url: "/student/valid_phone", data }) as Promise<any>
export const addStudent = (data: StudentModel) => service({ method: "post", url: "/student/add", data }) as Promise<number>
export const updateStudent = (data: StudentModel) => service({ method: "post", url: "/student/update", data }) as Promise<any>
export const assignClass = (data: assignClass) => service({ method: "post", url: "/student/assignclass", data }) as Promise<any>
export const avatarupdate = (data: avatarModel) => service({method: 'post', url:'/student/avatarupdate', data}) as Promise<string>
export const del = (id: number) => service({ url: '/student/remove/' + id, method: "post" }) as Promise<void>