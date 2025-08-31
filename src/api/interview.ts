import { ranaMinder } from './index';

import { to } from "@/lib/utils";

import type { Campaigns, Campaign, stage, session, timeSlot, GenericReq } from "@/types/interview";

export const interviewApi = {
    // 获取面试列表
    async getCampaignList(params: { currentPage?: number; pageSize?: number }, force: boolean = false) {
        const inst = ranaMinder.Get<Campaigns>('/campaign/user', { params }).send(force)
        return await to<Campaigns>(inst)
    },

    // 创建面试
    async createCampaign(data: { title: string; description: string; start_date: string; end_date: string; is_active: boolean }) {
        // x-www-form-urlencoded 序列化
        const formBody = Object.entries(data)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`)
            .join('&');
        const inst = ranaMinder.Post<GenericReq<Campaign>>(
            '/campaign/create',
            formBody,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        ).send();
        return await to<GenericReq<Campaign>>(inst);
    },

    // 创建环节
    async createStage(data: { campaign_id: number; title: string; description: string; sort_order: number; is_required: boolean }) {
        // x-www-form-urlencoded 序列化
        const formBody = Object.entries(data)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`)
            .join('&');
        const inst = ranaMinder.Post<{ message: string; code: string; stage: stage }>('/stage', formBody, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).send();
        return await to<{ message: string; code: string; stage: stage }>(inst)
    },

    // 创建会话
    async createSession(data: { stage_id: number; title: string; start_time: string; end_time: string; location: string }) {
        // x-www-form-urlencoded 序列化
        const formBody = Object.entries(data)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`)
            .join('&');
        const inst = ranaMinder.Post<{ message: string; code: string; session: session }>('/session', formBody, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).send();
        return await to<{ message: string; code: string; session: session }>(inst)
    },

    // 创建时间段
    async createTimeSlot(data: { session_id: number; start_time: string; end_time: string; max_seats: number }) {
        // x-www-form-urlencoded 序列化
        const formBody = Object.entries(data)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`)
            .join('&');
        const inst = ranaMinder.Post<{ message: string; code: string; timeSlot: timeSlot }>('/time_slot', formBody, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).send();
        return await to<{ message: string; code: string; timeSlot: timeSlot }>(inst)
    },

    // 删除面试活动
    async deleteCampaign(id: number, force: boolean = false) {
        const inst = ranaMinder.Delete<{ message: string; code: string }>(`/campaign/${id}`).send(force)
        return await to<{ message: string; code: string }>(inst)
    },

    // 查询环节
    async getStage(params: { campaign_id: number }, force: boolean = false) {
        const inst = ranaMinder.Get<{ message: string; code: string; stages: stage[] }>(`/stage/${params.campaign_id}`).send(force)
        return await to<{ message: string; code: string; stages: stage[] }>(inst)
    },

    // 查询场次
    async getSession(params: { stage_id: number }, force: boolean = false) {
        const inst = ranaMinder.Get<{ message: string; code: string; sessions: session[] }>(`/session/${params.stage_id}`).send(force)
        return await to<{ message: string; code: string; sessions: session[] }>(inst)
    },

    // 查询时间段
    async getTimeSlot(params: { session_id: number }, force: boolean = false) {
        const inst = ranaMinder.Get<{ message: string; code: string; timeSlots: timeSlot[] }>(`/time_slot/${params.session_id}`).send(force)
        return await to<{ message: string; code: string; timeSlots: timeSlot[] }>(inst)
    },

    // 更新面试活动
    async updateCampaign(id: number, data: { title: string; description: string;start_date: string; end_date: string; is_active: boolean }) {
        // x-www-form-urlencoded 序列化
        const formBody = Object.entries(data)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(typeof value === 'boolean' ? String(value) : value as string)}`)
            .join('&');
        
        console.log(`API请求: PUT /campaign/${id}, 请求体:`, data, '序列化后:', formBody);
        
        const inst = ranaMinder.Put<{ message: string; code: string; campaign: Campaign }>(`/campaign/${id}`, formBody, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).send();
        return await to<{ message: string; code: string; campaign: Campaign }>(inst)
    },

    // 更新面试环节
    async updateStage(id: number, data: { title: string; description: string; sort_order: number; is_required: boolean }) {
        // x-www-form-urlencoded 序列化
        const formBody = Object.entries(data)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`)
            .join('&');
        const inst = ranaMinder.Put<{ message: string; code: string; stage: stage }>(`/stage/${id}`, formBody, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).send();
        return await to<{ message: string; code: string; stage: stage }>(inst)
    },

    // 更新面试场次
    async updateSession(id: number, data: { title: string; start_time: string; end_time: string; location: string }) {
        // x-www-form-urlencoded 序列化
        const formBody = Object.entries(data)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`)
            .join('&');
        const inst = ranaMinder.Put<{ message: string; code: string; session: session }>(`/session/${id}`, formBody, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).send();
        return await to<{ message: string; code: string; session: session }>(inst)
    },

    // 更新面试时间段
    async updateTimeSlot(id: number, data: { start_time: string; end_time: string; max_seats: number }) {
        // x-www-form-urlencoded 序列化
        const formBody = Object.entries(data)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`)
            .join('&');
        const inst = ranaMinder.Put<{ message: string; code: string; timeSlot: timeSlot }>(`/time_slot/${id}`, formBody, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).send();
        return await to<{ message: string; code: string; timeSlot: timeSlot }>(inst)
    },
}