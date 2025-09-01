import { defineStore } from 'pinia';
import { ref, reactive, computed, watch, toRaw } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { interviewApi } from '@/api/interview';
import { toast } from 'vue-sonner';
import type { UserInfo } from '@/types/user';
import type { Campaign, Campaigns, CampaignRes, Application, Applications } from '@/types/interview';
import type { DataStatus } from '@/types/api';
import { useRoute } from 'vue-router';
import { 
    isAfterNow, 
    isBeforeOrBetweenNow, 
    decodeJWT, 
    handleApiRequest,
    formatDateTime
} from '@/lib/utils';

export const useInterviewStore = defineStore('interview', () => {

    const interviewDataStatus = ref<DataStatus>('idle')
    const campaigns = ref<Campaign[]>([]);
    const currentPage = ref(1);
    const pageSize = ref(10);
    const totalPages = ref(1);
    
    // 面试申请相关状态
    const applications = ref<Application[]>([]);
    const applicationCurrentPage = ref(1);
    const applicationPageSize = ref(10);
    const applicationTotalPages = ref(1);

    // 获取面试列表
    async function getCampaignList(page = 1, force: boolean = false) {
        interviewDataStatus.value = 'loading';
        try {
            const res = await handleApiRequest(
                () => interviewApi.getCampaignList({ currentPage: page, pageSize: pageSize.value }, force),
                '', // 不显示成功消息
                '获取面试列表失败',
                interviewDataStatus,
                false // 不显示成功提示
            );
            
            // 处理返回数据
            const newCampaigns = ((res as any).data.campaigns || []).map((item: any) => {
                // 时间加8小时
                const CHN = (dateStr: string) => {
                    const date = new Date(dateStr);
                    return new Date(date.getTime() + 8 * 60 * 60 * 1000);
                };
                return {
                    ...item,
                    startDate: CHN(item.start_date),
                    endDate: CHN(item.end_date)
                };
            });
            
            // 更新状态
            if (page === 1) {
                campaigns.value = newCampaigns;
            } else {
                campaigns.value = [...campaigns.value, ...newCampaigns];
            }
            currentPage.value = (res as any).data.pagination.currentPage || page;
            totalPages.value = (res as any).data.pagination.totalPages || 1;
            
            return res;
        } catch (error: any) {
            toast.error(error?.data?.message || '获取面试列表失败');
            throw error;
        }
    }

    // 创建面试活动
    async function createCampaign(data: { title: string; description: string; startDate: Date; endDate: Date; isActive: boolean }) {
        const payload = {
            title: data.title,
            description: data.description,
            start_date: formatDateTime(data.startDate),
            end_date: formatDateTime(data.endDate),
            is_active: data.isActive
        };
        
        return handleApiRequest(
            () => interviewApi.createCampaign(payload),
            '创建面试成功',
            '创建面试失败',
            interviewDataStatus
        );
    }

    // 创建面试环节
    async function createStage(data: { campaign_id: number; title: string; description: string; sort_order: number; is_required: boolean }) {
        return handleApiRequest(
            () => interviewApi.createStage(data),
            '创建环节成功',
            '创建环节失败',
            interviewDataStatus
        );
    }

    // 创建会话
    async function createSession(data: { stage_id: number; title: string; start_time: string; end_time: string; location: string }) {
        return handleApiRequest(
            () => interviewApi.createSession(data),
            '创建场次成功',
            '创建场次失败',
            interviewDataStatus
        );
    }

    // 创建时间段
    async function createTimeSlot(data: { session_id: number; start_time: string; end_time: string; max_seats: number }) {
        return handleApiRequest(
            () => interviewApi.createTimeSlot(data),
            '创建时间段成功',
            '创建时间段失败',
            interviewDataStatus
        );
    }

    // 删除面试活动
    async function deleteCampaign(id: number, force: boolean = false) {
        return handleApiRequest(
            () => interviewApi.deleteCampaign(id, force),
            '删除面试成功',
            '删除面试失败',
            interviewDataStatus
        );
    }

    // 查询环节
    async function getStage(id: number, force: boolean = false) {
        return handleApiRequest(
            () => interviewApi.getStage({ campaign_id: id }, force),
            '查询环节成功',
            '查询环节失败',
            interviewDataStatus
        );
    }

    // 查询场次
    async function getSession(id: number, force: boolean = false) {
        return handleApiRequest(
            () => interviewApi.getSession({ stage_id: id }, force),
            '查询场次成功',
            '查询场次失败',
            interviewDataStatus
        );
    }

    // 查询时间段
    // 查询时间段
    async function getTimeSlot(id: number, force: boolean = false) {
        try {
            console.log('开始查询时间段，session_id =', id);
            
            // 直接调用API，不使用handleApiRequest包装器，以便直接处理原始响应
            const apiResult = await interviewApi.getTimeSlot({ session_id: id }, force);
            
            console.log('时间段查询原始结果:', JSON.stringify(apiResult));
            
            // 构造一个标准的返回格式
            const standardResult = {
                data: {
                    timeSlots: [] as any[]
                },
                success: true
            };
            
            // 从不同的可能路径提取时间段数据
            let timeSlots: any[] = [];
            
            if (apiResult && apiResult.res) {
                const resData = apiResult.res as any;
                
                // 优先检查timeSlots字段
                if (resData.timeSlots && Array.isArray(resData.timeSlots)) {
                    timeSlots = resData.timeSlots;
                    console.log('从 res.timeSlots 获取到', timeSlots.length, '个时间段');
                } 
                // 然后检查data.time_slots字段
                else if (resData.data && Array.isArray(resData.data.time_slots)) {
                    timeSlots = resData.data.time_slots;
                    console.log('从 res.data.time_slots 获取到', timeSlots.length, '个时间段');
                }
                // 然后检查data.timeSlots字段 
                else if (resData.data && Array.isArray(resData.data.timeSlots)) {
                    timeSlots = resData.data.timeSlots;
                    console.log('从 res.data.timeSlots 获取到', timeSlots.length, '个时间段');
                }
                // 检查单个timeSlot
                else if (resData.timeSlot) {
                    timeSlots = [resData.timeSlot];
                    console.log('从 res.timeSlot 获取到1个时间段');
                }
                // 检查单个time_slot
                else if (resData.time_slots && Array.isArray(resData.time_slots)) {
                    timeSlots = resData.time_slots;
                    console.log('从 res.time_slots 获取到', timeSlots.length, '个时间段');
                }
                // 检查data.timeSlot
                else if (resData.data && resData.data.timeSlot) {
                    timeSlots = [resData.data.timeSlot];
                    console.log('从 res.data.timeSlot 获取到1个时间段');
                }
            }
            
            console.log(`找到 ${timeSlots.length} 个时间段`);
            
            // 处理时间段数据，确保字段一致性
            const processedTimeSlots = timeSlots.map((slot: any, index: number) => {
                // 记录原始数据
                console.log(`处理时间段 ${index + 1}:`, slot);
                
                // 获取时间字段
                const startTime = slot.startTime || slot.start_time;
                const endTime = slot.endTime || slot.end_time;
                
                console.log(`  时间段 ${index + 1} 原始时间:`, { 
                    startTime, 
                    endTime, 
                    startTimeType: typeof startTime, 
                    endTimeType: typeof endTime 
                });
                
                // 标准化时间段数据
                return {
                    ...slot,
                    id: slot.id,
                    sessionId: slot.sessionId || slot.session_id,
                    startTime: startTime,
                    endTime: endTime,
                    maxSeats: Number(slot.maxSeats || slot.max_seats || 10),
                    bookedSeats: Number(slot.bookedSeats || slot.booked_seats || 0)
                };
            });
            
            // 更新标准结果
            standardResult.data.timeSlots = processedTimeSlots;
            
            console.log('处理后的时间段数据:', standardResult);
            return standardResult;
        } catch (error) {
            console.error('时间段查询异常:', error);
            return { 
                data: { timeSlots: [] }, 
                success: false, 
                error 
            };
        }
    }

    // 更新面试活动
    async function updateCampaign(data: { id: number; title: string; description: string; startDate: Date; endDate: Date; isActive: boolean }) {
        const payload = {
            title: data.title,
            description: data.description,
            is_active: data.isActive,
            start_date: formatDateTime(data.startDate),
            end_date: formatDateTime(data.endDate),
        };
        
        return handleApiRequest(
            () => interviewApi.updateCampaign(data.id, payload),
            '更新面试成功',
            '更新面试失败',
            interviewDataStatus
        );
    }

    // 更新面试环节
    async function updateStage(data: { id: number; title: string; description: string; sort_order: number; is_required: boolean }) {
        const { id, title, description, sort_order, is_required } = data;
        const payload = { title, description, sort_order, is_required };
        
        return handleApiRequest(
            () => interviewApi.updateStage(id, payload),
            '更新环节成功',
            '更新环节失败',
            interviewDataStatus
        );
    }

    // 更新面试场次 
    async function updateSession(data: { id: number; title: string; start_time: string; end_time: string; location: string }) {
        const { id, title, start_time, end_time, location } = data;
        const payload = { title, start_time, end_time, location };
        
        return handleApiRequest(
            () => interviewApi.updateSession(id, payload),
            '更新场次成功',
            '更新场次失败',
            interviewDataStatus
        );
    }

    // 更新面试时间段
    async function updateTimeSlot(data: { id: number; start_time: string; end_time: string; max_seats: number }) {
        const { id, start_time, end_time, max_seats } = data;
        const payload = { start_time, end_time, max_seats };
        
        return handleApiRequest(
            () => interviewApi.updateTimeSlot(id, payload),
            '更新时间段成功',
            '更新时间段失败',
            interviewDataStatus
        );
    }
    
    // 获取面试表
    async function getApplications(params: { 
        campaign_id: number; // 必选参数
        id?: number;
        user_id?: number;
        stu_id?: string;
        infoKeyword?: string;
        currentPage?: number;
        pageSize?: number;
    }, force: boolean = false) {
        interviewDataStatus.value = 'loading';
        try {
            console.log('Store: 开始获取面试申请表, 参数 =', params);
            
            // 设置页码和每页条数
            const page = params.currentPage || applicationCurrentPage.value;
            const size = params.pageSize || applicationPageSize.value;
            
            // 构造请求参数
            const requestParams = {
                ...params,
                currentPage: page,
                pageSize: size
            };
            
            // 调用API获取面试申请表
            const result = await handleApiRequest<Applications>(
                () => interviewApi.getApplications(requestParams, force),
                '', // 不显示成功消息
                '获取面试申请表失败',
                interviewDataStatus,
                false // 不显示成功提示
            );
            
            // 处理返回的数据
            if (result && result.applications) {
                // 更新应用状态
                if (page === 1) {
                    applications.value = result.applications;
                } else {
                    applications.value = [...applications.value, ...result.applications];
                }
                
                // 更新分页信息
                if (result.pagination) {
                    applicationCurrentPage.value = result.pagination.currentPage || page;
                    applicationTotalPages.value = result.pagination.totalPages || 1;
                }
                
                console.log(`成功获取到 ${result.applications.length} 条面试申请记录`);
            } else {
                console.log('获取面试申请表成功，但没有返回数据');
                applications.value = [];
            }
            
            return result;
        } catch (error: any) {
            console.error('获取面试申请表异常:', error);
            toast.error(error?.data?.message || '获取面试申请表失败');
            applications.value = [];
            throw error;
        }
    }

    return {
        campaigns,
        interviewDataStatus,
        getCampaignList,
        currentPage,
        pageSize,
        totalPages,
        createCampaign,
        createStage,
        createSession,
        createTimeSlot,
        deleteCampaign,
        getStage,
        getSession,
        getTimeSlot,
        updateCampaign,
        updateStage,
        updateSession,
        updateTimeSlot,
        
        // 面试申请相关
        applications,
        applicationCurrentPage,
        applicationPageSize,
        applicationTotalPages,
        getApplications,
    }
})