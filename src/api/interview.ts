import { ranaMinder } from './index';

import { to } from "@/lib/utils";

import type { Campaigns } from "@/types/interview";

export const interviewApi = {
    async getCampaignList(params: { currentPage?: number; pageSize?: number }, force: boolean = false) {
        const inst = ranaMinder.Get<Campaigns>('/campaign/user', { params }).send(force)
        return await to<Campaigns>(inst)
    },
}