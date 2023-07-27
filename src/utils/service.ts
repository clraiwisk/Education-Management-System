import axios from 'axios';
import router from '@/router';

const ServiceLoading = {
    count: 0,
    instance : null as any,
    open: function() {
        // @ts-ignore
        if(this.count === 0) this.instance = ElLoading.service({body: true, text: 'Loading',background: 'rgba(0, 0, 0, 0.7)'});
        this.count++;
    },
    close: function() {
        if(this.count === 1) this.instance.close();
        if(this.count >= 1) this.count--;
    }
};

const service = axios.create({
    baseURL: "/api",
    timeout: 5000
})

// 添加一个请求拦截器
service.interceptors.request.use(
    async config => {    // 请求发出前一定会走这里
        ServiceLoading.open();       // 开启loading效果
        await new Promise(resolve => setTimeout(() => resolve(undefined) , 1000)); // 故意等一秒再发ajax让loading站住一秒
        // 所有的ajax都强制带上请求头且在Authorization上带token
        config.headers = Object.assign({}, {Authorization: sessionStorage.getItem("token")}, config.headers || {});
        return config;
    }, 
    error => {    // 请求无法正常发出
        ServiceLoading.close();      // 关闭loading效果
        // @ts-ignore
        ElMessageBox.alert(error.message, "警告", {type: "warning"});// 向用户提示错误信息 
        return Promise.reject(error);
    }
);
// 添加一个响应拦截器
service.interceptors.response.use(
    async ({data: {status, data, message}}) => {    // 客户端正常收到了服务器的响应
        ServiceLoading.close();      // 关闭loading效果
        switch(status) {
            case 200:
                return data;
            case 401:
                // 向用户提示错误信息 
                // @ts-ignore
                ElMessageBox.alert('未登录或登录超时，请重新登录！', "警告", {type: "warning"});// 向用户提示错误信息 
                router.push('/login');
                return Promise.reject(new Error("未登录或登录超时"));
            case 199:
            case 500:
            case 404:
                // @ts-ignore
                ElMessageBox.alert(message, "警告", {type: "warning"});// 向用户提示错误信息 
                return Promise.reject(new Error(message));
            default: 
                console.log('永远到不了这里');
        }
    },
    error => {    // 客户端无法收到服务器的响应(服务器没开，url写错到不了服务器)
        ServiceLoading.close();          // 关闭loading效果
        // @ts-ignore
        ElMessageBox.alert(error.message, "警告", {type: "warning"});// 向用户提示错误信息 
        return Promise.reject(error);
    }
);

export default service;
