import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import type {
    ErrTemplate,
    ReturnTemplate,
    err,
    res
} from '@/types/api'

import type { Method } from 'alova'

import dayjs from 'dayjs'

import { jwtDecode } from "jwt-decode";

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

export function decodeJWT(token: string) {
    try {
        const payload = jwtDecode<object>(token)
        return payload
    } catch (e) {
        return null
    }
}