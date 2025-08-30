import { defineStore } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import { ref, reactive, computed, toRaw } from 'vue';

import { useAuthStore } from '@/stores/auth';

import { userApi } from '@/api/user';

import { toast } from 'vue-sonner';

import type {
    UserInfo
} from '@/types/user';

import { decodeJWT } from '@/lib/utils';

export const useUserStore = defineStore('user', () => {
    async function getUserInfo(force: boolean = false) {
        const { err, res } = await userApi.getUserInfo(force)
        if (res) {
            const info = res.data.data
            handleUserInfo(info)
            return res
        } else {
            toast.error(err.data.message || '获取用户信息失败')
            throw err
        }
    }

    async function initUserInfo() {
        try {
            const authStore = useAuthStore()
            await new Promise((resolve, reject) => {
                getUserInfo(true).then(() => {
                    authStore.refresh().then(() => {
                        resolve(true)
                        toast.success('自动登录成功')
                    }).catch(() => {
                        toast.info('登录成功，但刷新access_token失败')
                        resolve(true)
                    })
                }).catch(() => {
                    authStore.refresh().then(() => {
                        new Promise((res, rej) => {
                            setTimeout(() => {
                                getUserInfo(true).then(() => {
                                    toast.success('自动登录成功')
                                    res(true)
                                }).catch(() => {
                                    toast.error('自动登录失败，请重新登录')
                                    rej(false)
                                    reject(false)
                                })
                            }, 1000)
                        })
                    })
                })
            })
            authStore.initUserPermission()
            return true
        } catch (e) {
            return false
        }
    }

    const userInfo = reactive<UserInfo>({
        owner: '',
        studentNumber: 0,
        username: '',
        nickname: '',
        bio: '',
        email: '',
        avatar: '',
        affiliation: '',
        createdAt: '',
        lastLogin: '',
        groups: [] as string[],
        links: [] as string[]
    })

    function handleUserInfo(info: any) {
        userInfo.owner = info.owner
        userInfo.studentNumber = info.name
        userInfo.username = info.displayName
        userInfo.nickname = info.properties.nickname
        userInfo.bio = info.bio
        userInfo.email = info.email
        userInfo.avatar = info.avatar
        userInfo.affiliation = info.affiliation
        userInfo.createdAt = info.createdTime
        userInfo.lastLogin = info.lastSigninTime
        userInfo.groups = info.groups
        userInfo.links = info.properties.links.split(',').filter(Boolean)
    }

    function cleanUserInfo() {
        userInfo.owner = ''
        userInfo.studentNumber = 0
        userInfo.username = ''
        userInfo.nickname = ''
        userInfo.bio = ''
        userInfo.email = ''
        userInfo.avatar = ''
        userInfo.affiliation = ''
        userInfo.createdAt = ''
        userInfo.lastLogin = ''
        userInfo.groups = []
        userInfo.links = []
    }

    async function updateUserInfo(info: any) {
        return new Promise(resolve => {
            setTimeout(() => {
                userInfo.nickname = info.nickname
                userInfo.bio = info.bio
                userInfo.email = info.email
                userInfo.links = info.links
                const random = Math.random()
                random < 0.5 ? resolve(true) : resolve(false)
            }, 1000);
        })
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
        if (!casdoorUserInfo.value) {
            toast.error("用户信息未初始化")
            return false
        }
        const payload = structuredClone(toRaw(casdoorUserInfo.value))
        Object.assign(payload, info)
        const { err, res } = await userApi.updateUserInfo(payload)
        console.log({ err, res });
        if (res) {
            const authStore = useAuthStore()
            await authStore.refresh()
            console.log('updateCasdoorUserInfo', res);

            return true
        } else {
            throw err
        }
    }

    async function setPassword(formData: FormData) {
        const { err, res } = await userApi.setPassword(formData)
        console.log('setPassword', { err, res });
        if (res) {
            toast.success('修改密码成功')
            return res
        } else {
            toast.error(err.data?.message || '修改密码失败')
            throw err
        }
    }

    async function uploadAvatar(avatar: File) {
        const { err, res } = await userApi.uploadAvatar(avatar)
        if (res) {
            const url = res.data.url
            await updateCasdoorUserInfo({ avatar: url })
            userInfo.avatar = url
            toast.success('上传头像成功')
            return res
        } else {
            toast.error(err.data?.message || '上传头像失败')
            throw err
        }
    }

    return {
        getUserInfo,
        initUserInfo,
        userInfo,
        handleUserInfo,
        cleanUserInfo,
        updateUserInfo,
        generateCasdoorUserInfo,
        uploadAvatar,
        setPassword,
        updateCasdoorUserInfo,
        casdoorUserInfo,
        persist: true
    }
}, {
    persist: true
})