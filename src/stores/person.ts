import { defineStore } from 'pinia';
import { ref, computed, toRaw } from 'vue';
import { personApi } from '@/api/person';
import type { CasdoorUser, AppUser } from '@/types/person';
import { UserTypeUtils } from '@/types/person';
import type { DataStatus } from '@/types/api';
import { handleApiRequest, decodeJWT } from '@/lib/utils';
import { toast } from 'vue-sonner';
import { useAuthStore } from '@/stores/auth';
import { userApi } from '@/api/user';

export const usePersonStore = defineStore('person', () => {
    // 状态
    const personDataStatus = ref<DataStatus>('idle');
    const users = ref<CasdoorUser[]>([]);
    const appUsers = ref<AppUser[]>([]);

    // 计算属性：用户自定义属性
    const userNicknames = computed(() => {
        const nicknames: Record<string, string> = {};
        users.value.forEach(user => {
            if (user.properties && user.properties.nickname) {
                nicknames[user.id || ''] = user.properties.nickname;
            } else if (user.displayName) {
                nicknames[user.id || ''] = user.displayName;
            } else {
                nicknames[user.id || ''] = user.name;
            }
        });
        return nicknames;
    });

    // 计算属性：用户所属组
    const userGroups = computed(() => {
        const groups: Record<string, string[]> = {};
        users.value.forEach(user => {
            if (user.groups && user.groups.length > 0) {
                groups[user.id || ''] = user.groups;
            }
        });
        return groups;
    });

    // 获取用户列表
    async function getUserList(keyword = '', force: boolean = false) {
        personDataStatus.value = 'loading';
        try {
            const res = await handleApiRequest(
                () => personApi.getUsers(
                    {
                        keyword: keyword
                    },
                    force
                ),
                '',
                '获取用户列表失败',
                personDataStatus,
                false
            );

            // 处理返回数据
            let userData = (res as any).data;
            let userArray: any[] = [];

            // 检查返回的数据结构
            console.log('API返回的原始数据格式:', typeof userData, Array.isArray(userData) ? '数组' : '对象');

            // 确定用户数据来源 - 可能是直接数组或包含users字段的对象
            if (Array.isArray(userData)) {
                // 直接返回了用户数组
                console.log('API直接返回用户数组，包含', userData.length, '条记录');
                userArray = userData;
            } else if (userData && userData.users && Array.isArray(userData.users)) {
                // 返回了包含users字段的对象
                console.log('API返回包含users字段的对象，包含', userData.users.length, '条记录');
                userArray = userData.users;
            } else {
                // 数据格式不符合预期
                console.warn('API返回的用户数据格式不正确:', userData);
                personDataStatus.value = 'error';
                users.value = [];
                appUsers.value = [];
                return res;
            }

            // 保留完整的Casdoor用户数据
            const newUsers = userArray.map((item: any) => {
                // 保存原始的Casdoor用户数据，确保有必要的字段
                const user: CasdoorUser = {
                    id: item.id || '',
                    owner: item.owner || '',
                    name: item.name || '',  // 学号
                    displayName: item.displayName || '',
                    email: item.email || '',
                    phone: item.phone || '',
                    gender: item.gender || '',
                    avatar: item.avatar || '',
                    isAdmin: item.isAdmin || false,
                    groups: item.groups || [],
                    roles: item.roles || [],
                    properties: item.properties || {},
                    // 其他可能需要的信息
                    affiliation: item.affiliation || '',
                    createdTime: item.createdTime || '',
                    updatedTime: item.updatedTime || ''
                };
                return user;
            });

            // 更新状态
            users.value = newUsers;

            // 同时更新应用用户列表
            appUsers.value = UserTypeUtils.casdoorToAppUsers(newUsers);

            // 在控制台打印转换后的用户数据
            console.log('转换后的AppUser列表 (' + appUsers.value.length + '条记录):', appUsers.value);

            // 打印第一个用户的详细信息作为示例
            if (appUsers.value.length > 0) {
                console.log('用户示例 (第一条记录):', JSON.stringify(appUsers.value[0], null, 2));
            }

            return res;
        } catch (error: any) {
            personDataStatus.value = 'error';
            console.error('获取用户列表失败:', error);
            throw error;
        }
    }

    const casdoorUserInfo = ref<any>(null)
    function generateCasdoorUserInfo(token: string) {
        const payload = decodeJWT(token)
        if (!payload) {
            toast.error("无效的JWT")
            return
        }
        console.log('payload', payload);
        casdoorUserInfo.value = payload
    }

    async function updateCasdoorUserInfo(info: object) {
        console.log('updateCasdoorUserInfo 函数开始执行...');
        
        // 检查并尝试初始化 casdoorUserInfo
        if (!casdoorUserInfo.value) {
            console.log('用户信息未初始化，尝试从 authStore 获取 token 并初始化');
            const authStore = useAuthStore();
            if (authStore.accessToken) {
                generateCasdoorUserInfo(authStore.accessToken);
            }
            
            // 再次检查是否初始化成功
            if (!casdoorUserInfo.value) {
                console.error('用户信息初始化失败，无法更新');
                toast.error("用户信息未初始化，请重新登录");
                return false;
            }
        }
        
        console.log('当前用户信息:', casdoorUserInfo.value);
        console.log('要更新的信息:', info);
        
        const payload = structuredClone(toRaw(casdoorUserInfo.value))
        Object.assign(payload, info)
        
        console.log('合并后的有效载荷:', payload);
        console.log('正在调用API...');
        
        const { err, res } = await userApi.updateUserInfo(payload)
        console.log('API响应详情:', { 
            err: err ? { message: err.message, name: err.name, stack: err.stack } : null, 
            res: res 
        });
        
        if (res) {
            console.log('API调用成功, 响应数据:', res);
            const authStore = useAuthStore()
            console.log('正在刷新认证信息...');
            await authStore.refresh()
            console.log('认证信息刷新完成');
            console.log('updateCasdoorUserInfo 完成，返回true');
            
            return true
        } else {
            console.error('API调用失败，错误信息:', err);
            throw err
        }
    }


    // 查找用户
    function findUserById(userId: string): CasdoorUser | undefined {
        return users.value.find(user => user.id === userId);
    }

    // 查找应用用户
    function findAppUserById(userId: string): AppUser | undefined {
        return appUsers.value.find(user => user.id === userId);
    }

    // 根据学号查找用户
    function findUserBystuId(stuId: string): CasdoorUser | undefined {
        return users.value.find(user => user.name === stuId);
    }

    // 根据学号查找应用用户
    function findAppUserBystuId(stuId: string): AppUser | undefined {
        return appUsers.value.find(user => user.stuId === stuId);
    }

    // 获取用户昵称
    function getUserNickname(userId: string): string {
        const user = findUserById(userId);
        if (!user) return '';

        // 优先使用自定义昵称
        if (user.properties && user.properties.nickname) {
            return user.properties.nickname;
        }

        // 其次使用显示名
        if (user.displayName) {
            return user.displayName;
        }

        // 最后使用用户名/学号
        return user.name;
    }

    // 获取用户角色
    function getUserRoles(userId: string): string[] {
        const user = findUserById(userId);
        if (!user || !user.roles) return [];

        return user.roles.map(role => role.displayName || role.name);
    }

    // 获取用户所属组
    function getUserGroups(userId: string): string[] {
        const user = findUserById(userId);
        if (!user || !user.groups) return [];

        return user.groups;
    }

    // 辅助方法：检查用户是否属于特定组
    function isUserInGroup(userId: string, groupName: string): boolean {
        const groups = getUserGroups(userId);
        if (!groups.length) return false;
        return groups.some(group => group.includes(groupName));
    }

    return {
        // 状态
        users,
        personDataStatus,
        appUsers,

        // 计算属性
        userNicknames,
        userGroups,

        // API方法
        getUserList,

        // 辅助方法
        findUserById,
        findAppUserById,
        findUserBystuId,
        findAppUserBystuId,
        getUserNickname,
        getUserRoles,
        getUserGroups,
        isUserInGroup,
        generateCasdoorUserInfo,
        updateCasdoorUserInfo,
        casdoorUserInfo,
    };
});
