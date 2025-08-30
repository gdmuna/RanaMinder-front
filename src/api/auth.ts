import { ranaMinder } from './index';

import { errTemplate, returnTemplate, to } from '@/lib/utils';

const baseUrl = import.meta.env.VITE_API_RANAMINDER_BASE_URL;

export const authApi = {
    // 用户登录 - 重定向到Casdoor
    login() {
        window.location.href = `${baseUrl}/auth/login`;
    },
    
    // 处理登录回调
    async loginCallback() {
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get('code');
        if (!code) return returnTemplate(errTemplate('缺少授权码', '请重试，或等待业务恢复'));
        const inst = ranaMinder.Post('/auth/callback', {}, {
            params: {
                code
            },
            meta: {
                ignoreToken: true
            }
        })
        const result = await to<any>(inst);
        return result;
    },

    // 刷新令牌
    async refresh(refreshToken: string) {
        const inst = ranaMinder.Post('auth/refresh-token', {
            refreshToken
        })
        return await to<any>(inst)
    }
}