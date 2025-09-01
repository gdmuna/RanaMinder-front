import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import type {
    ErrTemplate,
    ReturnTemplate,
    err,
    res,
    DataStatus
} from '@/types/api'

import type { Method } from 'alova'

import dayjs from 'dayjs'

import { jwtDecode } from "jwt-decode";
import { toast } from 'vue-sonner';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function errTemplate(err: string, detail?: string): ErrTemplate {
    return {
        success: false,
        data: {
            message: err,
            detail: detail || ''
        }
    };
}

export function returnTemplate(err?: err, res?: res): ReturnTemplate {
    return {
        err: err || null,
        res: res || null
    };
}

export async function to<T = any>(method: Method | Promise<T>): Promise<ReturnTemplate<T>> {
    try {
        const res = await method;
        return returnTemplate(null, res);
    } catch (e) {
        const err = e || errTemplate('未知错误', '请稍后再试')
        return returnTemplate(err, null);
    }
}

/**
 * 
 * @param time 
 * @returns boolean - 当前时间是否在给定时间之后
 */
export function isAfterNow(time: string): boolean {
    const now = dayjs()
    const end = dayjs(time)
    return now.isAfter(end)
}

/**
 * 
 * @param time 
 * @returns boolean - 当前时间是否在给定时间之前
 */
export function isBeforeNow(time: string): boolean {
    const now = dayjs()
    const start = dayjs(time)
    return now.isBefore(start)
}

/**
 * 
 * @param startTime 
 * @param endTime 
 * @returns boolean - 当前时间是否在给定时间区间内
 */
export function isBetweenNow(startTime: string, endTime: string): boolean {
    const now = dayjs()
    const start = dayjs(startTime)
    const end = dayjs(endTime)
    return now.isAfter(start) && now.isBefore(end)
}

export function isBeforeOrBetweenNow(startTime: string, endTime: string): boolean {
    const now = dayjs()
    const start = dayjs(startTime)
    const end = dayjs(endTime)
    return now.isBefore(start) || (now.isAfter(start) && now.isBefore(end))
}

export function formatDate(dateString: string) {
    return dayjs(dateString).format('YYYY年M月D日')
}

export function formatTime(dateString: string) {
    return dayjs(dateString).format('HH:mm')
}

/**
 * 格式化日期为YYYY-MM-DD HH:MM:SS格式的字符串
 * @param date 日期对象
 * @returns 格式化后的日期字符串
 */
export function formatDateTime(date: Date): string {
    const pad = (n: number) => n < 10 ? '0' + n : n;
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

/**
 * 通用API响应处理函数
 * @param apiCall API调用函数，返回Promise<{err: any, res: any}>
 * @param successMessage 成功时的提示消息
 * @param errorMessage 失败时的提示消息
 * @param showToast 是否显示提示
 * @param statusRef 状态引用
 * @returns Promise<T>
 */
export async function handleApiRequest<T>(
    apiCall: () => Promise<ReturnTemplate>, 
    successMessage: string, 
    errorMessage: string,
    statusRef?: { value: DataStatus },
    showToast: boolean = true
): Promise<T> {
    if (statusRef) statusRef.value = 'loading';
    try {
        const { err, res } = await apiCall();
        if (res) {
            if (showToast && successMessage) toast.success(successMessage);
            if (statusRef) statusRef.value = 'loaded';
            return res as T;
        } else {
            const errorMsg = err?.data?.message || errorMessage;
            if (showToast) toast.error(errorMsg);
            if (statusRef) statusRef.value = 'error';
            throw err;
        }
    } catch (e) {
        if (statusRef) statusRef.value = 'error';
        throw e;
    }
}

export function decodeJWT(token: string) {
    try {
        const payload = jwtDecode<object>(token)
        return payload
    } catch (e) {
        return null
    }
}