import { defineStore } from 'pinia'
import { classworkApi } from '@/api/classwork'

export const useClassworkStore = defineStore('classwork', {
    state: () => ({
        namesByTitles: [] as any[],
        lastTitles: [] as string[],
    }),
    actions: {
        async fetchNamesByTitles(titles: string[]) {
            const isSameArray = (a: string[], b: string[]) =>
                a.length === b.length && a.every((v, i) => v === b[i]);
            if (
                this.namesByTitles.length > 0 &&
                isSameArray(this.lastTitles, titles)
            ) {
                return [...this.namesByTitles];
            }
            try {
                const result = await classworkApi.getNamesByTitles(titles);
                this.namesByTitles = Array.isArray(result?.res?.data) ? result.res.data : [];
                this.lastTitles = [...titles];
                return [...this.namesByTitles];
            } catch (err) {
                this.namesByTitles = [];
                this.lastTitles = [];
                throw err;
            }
        },
    },
})