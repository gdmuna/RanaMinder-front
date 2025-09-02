import { ranaMinder } from './index';

import { to } from "@/lib/utils";

import type { Campaigns, Campaign, stage, session, timeSlot, GenericReq, Applications, Application, result } from "@/types/interview";
import type { ReturnTemplate } from "@/types/api";

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
        try {
            console.log('API调用: 查询时间段, session_id =', params.session_id);
            
            // 发送请求
            const inst = ranaMinder.Get<any>(`/time_slot/${params.session_id}`).send(force);
            
            // 等待响应
            const result = await to<any>(inst);
            
            console.log('API时间段查询原始响应:', JSON.stringify(result, null, 2));
            
            // 如果有响应数据，标准化时间段数据格式
            if (result.res) {
                // 收集所有可能的时间段数据源
                let timeSlots: any[] = [];
                
                // 使用类型断言处理各种可能的数据结构
                const resData = result.res as any;
                
                // 检查直接在res中的字段
                if (Array.isArray(resData.timeSlots)) {
                    timeSlots = resData.timeSlots;
                    console.log('从 res.timeSlots 字段获取到', timeSlots.length, '个时间段');
                } else if (Array.isArray(resData.time_slots)) {
                    timeSlots = resData.time_slots;
                    console.log('从 res.time_slots 字段获取到', timeSlots.length, '个时间段');
                } else if (resData.timeSlot) {
                    timeSlots = [resData.timeSlot];
                    console.log('从 res.timeSlot 字段获取到1个时间段');
                } 
                // 检查 res.data 中的字段
                else if (resData.data) {
                    const dataField = resData.data as any;
                    
                    if (Array.isArray(dataField.timeSlots)) {
                        timeSlots = dataField.timeSlots;
                        console.log('从 res.data.timeSlots 字段获取到', timeSlots.length, '个时间段');
                    } else if (Array.isArray(dataField.time_slots)) {
                        timeSlots = dataField.time_slots;
                        console.log('从 res.data.time_slots 字段获取到', timeSlots.length, '个时间段');
                    } else if (dataField.timeSlot) {
                        timeSlots = [dataField.timeSlot];
                        console.log('从 res.data.timeSlot 字段获取到1个时间段');
                    } else {
                        console.log('res.data中没有找到时间段数据');
                    }
                } else {
                    console.log('API响应中没有找到时间段数据');
                }
                
                // 如果有时间段数据，打印第一个数据样本的详细信息
                if (timeSlots.length > 0) {
                    const sample = timeSlots[0];
                    console.log('时间段数据样本:', sample);
                    console.log('字段和类型:');
                    Object.entries(sample).forEach(([key, value]) => {
                        console.log(`  - ${key}: ${value} (${typeof value})`);
                    });
                }
                
                // 标准化时间段数据
                const standardizedTimeSlots = timeSlots.map((slot: any, index: number) => {
                    // 解析并标准化开始时间和结束时间
                    const originalStartTime = slot.startTime || slot.start_time;
                    const originalEndTime = slot.endTime || slot.end_time;
                    
                    console.log(`时间段 ${index + 1} 原始时间:`, {
                        start: originalStartTime,
                        end: originalEndTime,
                        startType: typeof originalStartTime,
                        endType: typeof originalEndTime
                    });
                    
                    // 创建标准化的时间段对象
                    return {
                        ...slot,
                        id: slot.id,
                        sessionId: slot.sessionId || slot.session_id,
                        startTime: originalStartTime,
                        endTime: originalEndTime,
                        maxSeats: Number(slot.maxSeats || slot.max_seats || 10),
                        bookedSeats: Number(slot.bookedSeats || slot.booked_seats || 0)
                    };
                });
                
                // 确保result.res上有一个标准化的timeSlots字段
                (result.res as any).timeSlots = standardizedTimeSlots;
            }
            
            return result;
        } catch (error) {
            console.error('获取时间段API异常:', error);
            // 返回一个标准格式的错误响应
            return {
                err: {
                    success: false,
                    data: {
                        message: '获取时间段失败',
                        detail: error instanceof Error ? error.message : String(error)
                    }
                },
                res: { 
                    message: '获取时间段失败',
                    code: 'ERROR',
                    timeSlots: [] 
                }
            };
        }
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

    // 获取面试表
    async getApplications(params: { 
        campaign_id: number; // 必选参数
        id?: number;
        user_id?: number;
        stu_id?: string;
        infoKeyword?: string;
        currentPage?: number;
        pageSize?: number;
    }, force: boolean = false) {
        console.log('API调用: 获取面试表, 参数 =', params);
        const inst = ranaMinder.Get<Applications>('/application/', { params }).send(force);
        return await to<Applications>(inst);
    },

    // 发送结果邮件
    async sendResultEmail(data: {
        resultId: string;
        subject: string;
        content: string;
    }) {
        const inst = ranaMinder.Post<{ message: string; code: string }>('/mail/send-result-email', data).send();
        return await to<{ message: string; code: string }>(inst);
    },

    // 获取所有面试时间段
    async getAllTimeSlotsByCampaignId(campaignId: number, force: boolean = false) {
        const inst = ranaMinder.Get<{ message: string; code: string; timeSlots: timeSlot[] }>(`/time_slot/campaign/${campaignId}`).send(force);
        return await to<{ message: string; code: string; timeSlots: timeSlot[] }>(inst);
    },

    // 分配面试时间段
    async assignTimeSlot(data: {
        user_id: number;
        time_slot_id: number;
    }) {
        const inst = ranaMinder.Post<{ message: string; code: string }>('/user_selection', data).send();
        return await to<{ message: string; code: string }>(inst);
    },

    // 更新面试状态
    async updateInterviewStatus(data: {
        resultId: string;
        status: string;
        association: string;
        department: string;
        notes?: string;
    }) {
        const inst = ranaMinder.Post<{ message: string; code: string }>('/interview/update-status', data).send();
        return await to<{ message: string; code: string }>(inst);
    },

    // 更新面试状态结果
    async updateInterviewResult(data: {
        result_id: string;
        status: string;
        association: string;
        department: string;
    }) {
        const inst = ranaMinder.Put<{ message: string; code: string }>('/result/', data).send();
        return await to<{ message: string; code: string }>(inst);
    },

    // 获取面试结果
    async getInterviewResult(user_id: string, campaign_id: number, force: boolean = false) {
    const params = { user_id, campaign_id };
    const inst = ranaMinder.Get<{ message: string; code: string; result: result }>('/result', { params }).send(force);
    return await to<{ message: string; code: string; result: result }>(inst);
    }
}