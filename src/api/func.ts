import service from "@/utils/service"

export const addFunc = (data: Func) => service({ url: "/function/add", data, method: "post" }) as Promise<Func>
export const updateFunc = (data: Func) => service({ url: "/function/update", data, method: "post" }) as Promise<Func>
export const delFunc = (id: number) => service({ url: "/function/remove/" + id, method: "post" }) as Promise<number>
export const getModel = (id: number) => service({ url: "/function/getmodel/" + id, method: "get" }) as Promise<Func>
export const getAll = () => service({ url: "/function/all" }) as Promise<Func[]>