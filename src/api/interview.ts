import { ranaMinder } from './index';

import { to } from "@/lib/utils";

import type { Campaigns, Campaign, stage, session, timeSlot } from "@/types/interview";

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
        const inst = ranaMinder.Post<{ message: string; code: string; campaign: Campaign }>(
            '/campaign/create',
            formBody,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        ).send();
        return await to<{ message: string; code: string; campaign: Campaign }>(inst)
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

}