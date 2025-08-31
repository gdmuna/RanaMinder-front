import type { BaseRes, BasePagination } from "./api";

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
