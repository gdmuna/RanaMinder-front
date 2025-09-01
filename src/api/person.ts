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
            
            // 使用正确的API路径和参数
            const inst = casdoor.Get<UsersResponse>('/api/get-users', { 
                params: { 
                    owner: CASDOOR_ORG,
                    ...params,
                    // 确保认证参数正确传递
                    ...(accessToken.value ? { access_token: accessToken.value } : {})
                } 
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
    
    // 获取单个用户详情
    async getUser(userId: string, force: boolean = false) {
        const inst = casdoor.Get<{ message: string; code: string; user: CasdoorUser }>(
            `/api/get-user/${userId}`,
            {
                params: { owner: CASDOOR_ORG }
            }
        ).send(force);
        return await to<{ message: string; code: string; user: CasdoorUser }>(inst);
    },
};
