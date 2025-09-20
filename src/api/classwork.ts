import { ranaMinder } from './index';
import { to, returnTemplate, errTemplate } from '@/lib/utils';

export const classworkApi = {
	async getNamesByTitles(titles: string[]): Promise<any> {
		try {
			const inst = ranaMinder.Post<any>(
				'/classwork/names',
				{ titles },
				{
					headers: { 'Content-Type': 'application/json' },
				}
			).send();
			return await to<any>(inst);
		} catch (err) {
			return returnTemplate(errTemplate('classwork名称获取失败', err instanceof Error ? err.message : String(err)), null);
		}
	}
};
