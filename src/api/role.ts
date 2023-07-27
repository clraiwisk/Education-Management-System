import service from "@/utils/service"

export const getAll = () => service({ url: "/role/all" }) as Promise<Role[]>
export const addRole = (data: Role) => service({ url: "/role/add", method: "post", data }) as Promise<number>
export const remove = (id: number) => service({ url: '/role/remove/' + id, method: "post" }) as Promise<void>
export const updateRole = (data: Role) => service({ url: '/role/update', method: "post", data }) as Promise<Role>
export const getFuncIds = (role_id: number) => service({ url: '/role_function/list/' + role_id }) as Promise<any>
export const setFuncIds = (data: { role_id: number; role_func_ids: string }) => service({ url: '/role_function/config', method: "post", data }) as Promise<void>