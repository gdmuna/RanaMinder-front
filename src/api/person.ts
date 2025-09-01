import { casdoor } from './index';
import { to } from '@/lib/utils';
import type { UsersResponse, CasdoorUser } from '@/types/person';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

// Casdoor 组织从环境变量获取
const CASDOOR_ORG = import.meta.env.VITE_CASDOOR_ORG || 'gdmu';
console.log('Casdoor Organization:', CASDOOR_ORG);
console.log('Casdoor Endpoint:', import.meta.env.VITE_API_CASDOOR_ENDPOINT);

export const personApi = {
    // 获取用户列表，支持搜索
    async getUsers(params: { 
        keyword?: string;
    }, force: boolean = false) {
        // 确保传递正确的API路径
        try {
            console.log('Calling Casdoor API with org:', CASDOOR_ORG);
            
            // 从AuthStore获取客户端ID和Secret
            const authStore = useAuthStore();
            const { accessToken } = storeToRefs(authStore);
            
            // 构建完整的请求参数
            const queryParams = { 
                owner: CASDOOR_ORG,
                ...params,
                // 确保认证参数正确传递
                ...(accessToken.value ? { access_token: accessToken.value } : {})
            };
            
            // 打印请求参数
            console.log('===== Casdoor getUsers 请求信息 =====');
            console.log('请求URL: /api/get-users');
            console.log('Query参数:', JSON.stringify(queryParams, null, 2));
            console.log('请求体: 无 (GET请求)');
            
            // 使用正确的API路径和参数
            const inst = casdoor.Get<UsersResponse>('/api/get-users', { 
                params: queryParams 
            }).send(force);
            
            const result = await to<UsersResponse>(inst);
            
            // 打印API响应
            console.log('=== Casdoor API 原始响应 ===');
            if (result && result.res) {
                // 检查返回数据结构
                if (Array.isArray(result.res)) {
                    // 直接返回了用户数组
                    console.log(`获取到 ${result.res.length} 个用户`);
                    if (result.res.length > 0) {
                        console.log('第一个用户示例:', JSON.stringify(result.res[0], null, 2));
                    }
                } else if (result.res.users && Array.isArray(result.res.users)) {
                    // 返回了包含users字段的对象
                    const users = result.res.users;
                    console.log(`获取到 ${users.length} 个用户`);
                    if (users.length > 0) {
                        console.log('第一个用户示例:', JSON.stringify(users[0], null, 2));
                    }
                } else {
                    console.log('无法识别的API响应格式:', result.res);
                }
            } else if (result && result.err) {
                console.log('API返回错误:', result.err);
            } else {
                console.log('API响应数据格式不符合预期:', result);
            }
            
            return result;
        } catch (error) {
            console.error('Failed to fetch users:', error);
            throw error;
        }
    },
    
        // 更新用户信息
    async updateUserInfo(data: object) {
        const inst = casdoor.Post('/api/update-user', data)
        return await to<any>(inst);
    },
    
};
