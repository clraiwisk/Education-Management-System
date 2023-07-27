import service from "@/utils/service"
//login 函数是我发明的
// 希望login传的data满足 { name: string ; pwd: string }这样的结构要求
// 我作为函数的发明者 我知道返回的数据是什么  不应该回去都是any
export const login = (data: Login) => service({ url: '/user/login', data, method: 'post' }) as Promise<string>
export const getMenu = () => service({ url: '/user/getmenu', method: 'post' }) as Promise<Func[]>
export const dictionary = () => service({ url: '/dictionary/all' }) as Promise<Dictionary[]>

//  用户管理的api
export const list = (data: SysuserSearch) => service({ url: '/user/list', method: 'post', data }) as Promise<SysuserAllList>
export const add = (data: Sysuser) => service({ url: '/user/add', method: 'post', data }) as Promise<void>
export const del = (user_name: string) => service({ url: '/user/remove/' + user_name, method: 'post' }) as Promise<void>
export const divideRole = (data: SysuserDivide) => service({ url: '/user/config_role', method: 'post', data }) as Promise<void>
export const updatePwd = (data: Sysuser) => service({ url: '/user/change_pwd', method: 'post', data }) as Promise<void>
export const updateUserPwd = (data: Password) => service({ url: '/user/pwdchange', method: 'post', data }) as Promise<void>