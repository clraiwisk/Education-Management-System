import service from "@/utils/service"

export const getList = (data: StaffSearch) => service({ url: '/staff/list', data, method: 'post' }) as Promise<AllList>
export const reinstate = (id: number) => service({ url: '/staff/reinstate/' + id }) as Promise<null>
export const dimission = (id: number) => service({ url: '/staff/dimission/' + id }) as Promise<null>
export const add = (data: StaffModel) => service({ url: "/staff/add", method: "post", data }) as Promise<number>
export const update = (data: StaffModel) => service({ url: "/staff/update", method: "post", data }) as Promise<null>