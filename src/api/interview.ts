import { ranaMinder } from './index';

import { to } from "@/lib/utils";

import type { Campaigns, Campaign, stage, session, timeSlot } from "@/types/interview";

export const interviewApi = {
    async getCampaignList(params: { currentPage?: number; pageSize?: number }, force: boolean = false) {
        const inst = ranaMinder.Get<Campaigns>('/campaign/user', { params }).send(force)
        return await to<Campaigns>(inst)
    },

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

    async createSession(data: { stageId: number; title: string; startTime: Date; endTime: Date; location: string }) {
        const inst = ranaMinder.Post<{ message: string; code: string; session: session }>('/session', { data }).send()
        return await to<{ message: string; code: string; session: session }>(inst)
    },

    async createTimeSlot(data: { sessionId: number; startTime: Date; endTime: Date; maxSeats: number }) {
        const inst = ranaMinder.Post<{ message: string; code: string; timeSlot: timeSlot }>('/timeSlot', { data }).send()
        return await to<{ message: string; code: string; timeSlot: timeSlot }>(inst)
    }
}