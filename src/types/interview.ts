import type { BaseRes } from "./api";

export interface GenericReq<T> {
    message: string
    code: string
    data: T
}

export interface Campaign {
    id: number;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    deleteAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface Campaigns {
    message: string
    code: string
    pagination: {
        currentPage: number
        pageSize: number
        totalRecords: number
        totalPages: number
    }
    campaigns: Campaign[]
}

export type CampaignRes = BaseRes<Campaigns>

export interface stage {
    id: number;
    campaignId: number;
    title: string;
    description: string;
    sortOrder: number;
    isRequired: boolean;
    deleteAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface session {
    id: number;
    stageId: number;
    title: string;
    startTime: Date;
    endTime: Date;
    location: string;
    isRequired: boolean;
    deleteAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface timeSlot {
    id: number;
    sessionId: number;
    startTime: Date;
    endTime: Date;
    maxSeats: number;
    bookedSeats: number;
    isAvailabe: boolean;
    deleteAt: Date;
    createdAt: Date;
    updatedAt: Date;
}