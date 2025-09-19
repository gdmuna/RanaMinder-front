// classwork.ts
// 参考interview.ts风格，封装classwork相关API
import { ranaMinder } from './index';
import { to, returnTemplate, errTemplate } from '@/lib/utils';

// 获取classwork名称列表
export const classworkApi = {
	/**
	 * 根据titles数组获取classwork名称
	 * @param titles string[]
	 * @returns Promise<ReturnTemplate<{ data: any[] }>>
	 */
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
