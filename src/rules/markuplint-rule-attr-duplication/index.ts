import { VerifyReturn } from '../../rule';
import CustomRule from '../../rule/custom-rule';
import messages from '../messages';

export default CustomRule.create({
	name: 'attr-duplication',
	defaultValue: null,
	defaultOptions: null,
	async verify (document, locale) {
		const reports: VerifyReturn[] = [];
		const message = await messages(locale, 'Duplicate {0}', 'attribute name');
		await document.walkOn('Element', async (node) => {
			if (!node.rule) {
				return;
			}
			const attrNameStack: string[] = [];
			for (const attr of node.attributes) {
				const attrName = attr.name.toLowerCase();
				if (attrNameStack.includes(attrName)) {
					reports.push({
						severity: node.rule.severity,
						message,
						line: attr.location.line,
						col: attr.location.col,
						raw: attr.raw,
					});
				} else {
					attrNameStack.push(attrName);
				}
			}
		});
		return reports;
	},
});
