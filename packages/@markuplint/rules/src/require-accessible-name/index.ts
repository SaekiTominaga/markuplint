import type { ARIAVersion } from '@markuplint/ml-spec';

import { createRule, getRoleSpec, getComputedRole } from '@markuplint/ml-core';

import { accnameMayBeMutable } from '../helpers';

type Option = {
	ariaVersion: ARIAVersion;
};

export default createRule<boolean, Option>({
	defaultOptions: {
		ariaVersion: '1.2',
	},
	async verify({ document, report, t }) {
		await document.walkOn('Element', el => {
			if (accnameMayBeMutable(el, document)) {
				return;
			}

			const role = getComputedRole(document.specs, el, el.rule.option.ariaVersion);
			if (!role) {
				return;
			}
			const roleSpec = getRoleSpec(document.specs, role.name, el.namespaceURI, el.rule.option.ariaVersion);
			if (!roleSpec || !roleSpec.accessibleNameRequired) {
				return;
			}

			const hasAccessibleName = !!el.getAccessibleName().trim();

			if (!hasAccessibleName) {
				report({ scope: el, message: t('Require {0}', 'accessible name') });
			}
		});
	},
});
