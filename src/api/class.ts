// import { AllClass, ClassModel, ClassSearch, Classroom } from "@/types/class"
import service from "@/utils/service"

export const getList = (data: ClassSearch) => service({ url: '/class/list', data, method: "post" }) as Promise<AllClass>
export const getClsr = () => service({ url: '/class/all' }) as Promise<Classroom[]>
export const classAdd = (data: ClassModel) => service({ url: '/class/add', data, method: 'post' }) as Promise<number>
export const classUpdate = (data: ClassModel) => service({ url: '/class/update', data, method: 'post' }) as Promise<ClassModel>
export const classBegin = (data: SchoolBegin) => service({ url: "/class/begin", data, method: 'post' }) as Promise<string>
export const classEnd = (data: SchoolBegin) => service({ url: "/class/end", data, method: 'post' }) as Promise<string>
export const getClass = () => service({ url: "/class/all" }) as Promise<ClassModel[]>