import service from "@/utils/service"

export const allClassroom = () => service({ url: '/classroom/all' }) as Promise<roomModel[]>
export const addClassroom = (data: roomModel) => service({ method: "post", url: "/classroom/add", data }) as Promise<number>
export const updateClassroom = (data: roomModel) => service({ method: "post", url: "/classroom/update", data }) as Promise<any>
export const removeClassroom = (clsr_id: number) => service({ url: "/classroom/remove/" + clsr_id }) as Promise<any>