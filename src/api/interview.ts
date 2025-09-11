import { ranaMinder } from './index';

import { to, returnTemplate, errTemplate } from "@/lib/utils";

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
        try {
            // 确保时间格式正确
            if (typeof data.start_time !== 'string') {
                data.start_time = String(data.start_time);
            }
            if (typeof data.end_time !== 'string') {
                data.end_time = String(data.end_time);
            }
            
            // 验证所有字段都存在
            if (!data.stage_id || !data.title || !data.start_time || !data.end_time || !data.location) {
                console.error('创建场次缺少必要字段:', data);
                return returnTemplate(errTemplate('缺少必要字段', '请确保填写了所有必要信息'), null);
            }
            
            console.log('创建场次，发送数据:', data);
            
            // x-www-form-urlencoded 序列化
            const formBody = Object.entries(data)
                .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`)
                .join('&');
            const inst = ranaMinder.Post<{ message: string; code: string; session: session }>('/session', formBody, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).send();
            return await to<{ message: string; code: string; session: session }>(inst);
        } catch (error) {
            console.error('创建场次API异常:', error);
            return returnTemplate(errTemplate('创建场次失败', error instanceof Error ? error.message : String(error)), null);
        }
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

    // 删除环节
    async deleteStage(id: number, force: boolean = false) {
        const inst = ranaMinder.Delete<{ message: string; code: string }>(`/stage/${id}`).send(force)
        return await to<{ message: string; code: string }>(inst)
    },

    // 删除场次
    async deleteSession(id: number, force: boolean = false) {
        const inst = ranaMinder.Delete<{ message: string; code: string }>(`/session/${id}`).send(force)
        return await to<{ message: string; code: string }>(inst)
    },

    // 删除时间段
    async deleteTimeSlot(id: number, force: boolean = false) {
        const inst = ranaMinder.Delete<{ message: string; code: string }>(`/time_slot/${id}`).send(force)
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
    async updateCampaign(id: number, data: { title: string; description: string; start_date: string; end_date: string; is_active?: boolean }) {
        // 确保所有必填字段都存在
        if (!data.title || !data.description || !data.start_date || !data.end_date) {
            console.error('缺少必要字段:', data);
            return {
                err: {
                    success: false,
                    data: {
                        message: "至少需要一个字段",
                        code: "MISSING_FIELDS"
                    }
                },
                res: null
            };
        }
        
        // 确保is_active是正确的布尔值字符串
        const dataWithStringBooleans: Record<string, string> = {
            title: data.title,
            description: data.description,
            start_date: data.start_date,
            end_date: data.end_date
        };
        
        // 只有当is_active字段存在时才进行转换
        if (data.is_active !== undefined) {
            dataWithStringBooleans.is_active = String(data.is_active); // 确保布尔值转为"true"或"false"字符串
        }
        
        console.log('API请求数据:', {
            id,
            ...dataWithStringBooleans,
            is_active_original: data.is_active,
            is_active_type: typeof data.is_active,
            is_active_converted: String(data.is_active)
        });
        
        // x-www-form-urlencoded 序列化
        const formBody = Object.entries(dataWithStringBooleans)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`)
            .join('&');
        
        console.log(`API请求: PUT /campaign/${id}, 请求体:`, dataWithStringBooleans, '序列化后:', formBody);
        
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
    async updateTimeSlot( data: { id: number, start_time: string; end_time: string; max_seats: number }) {
        console.log('更新时间段，数据:', data);
        console.log('日期格式检查 - 开始时间:', data.start_time, '类型:', typeof data.start_time);
        console.log('日期格式检查 - 结束时间:', data.end_time, '类型:', typeof data.end_time);
        
        const id = data.id;
        
        // 创建一个包含time_slot_id字段的对象，按照API文档格式
        const bodyData = {
            time_slot_id: data.id, // 使用正确的参数名time_slot_id
            start_time: data.start_time,
            end_time: data.end_time,
            max_seats: data.max_seats
        };
        
        const formBody = Object.entries(bodyData)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
            .join('&');
        
        // 根据API文档，使用正确的URL路径（保留尾部斜杠）
        console.log(`发送请求到: /time_slot/`);
        console.log('请求体:', formBody);
        
        const inst = ranaMinder.Put<{ message: string; code: string; timeSlot: timeSlot }>('/time_slot/', formBody, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).send();
        
        const result = await to<{ message: string; code: string; timeSlot: timeSlot }>(inst);
        console.log('时间段更新响应:', result);
        return result;
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
        resultId: string | string[];
        subject: string;
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