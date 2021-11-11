import type { CreateRulePurpose, CreateRuleLanguage } from '@markuplint/create-rule-helper';

import { createRuleHelper } from '@markuplint/create-rule-helper';
import c from 'cli-color';

import { input, select, confirm } from '../prompt';

export async function createRule() {
	const purpose = await select<CreateRulePurpose>({
		message: 'What purpose do you create the rule for?',
		choices: [
			{ name: 'Add the rule to this project', value: 'ADD_TO_PROJECT' },
			{ name: 'Create the rule and publish it as a package', value: 'PUBLISH_AS_PACKAGE' },
			{ name: 'Contribute the new rule to markuplint core rules', value: 'CONTRIBUTE_TO_CORE' },
		],
	});

	const name = await input('What is the name?', /^[a-z][a-z0-9]*(?:-[a-z][a-z0-9]*)*$/i);

	const lang = await select<CreateRuleLanguage>({
		message: 'Which language will you implement?',
		choices: [
			{ name: 'TypeScript', value: 'TYPESCRIPT' },
			{ name: 'JavaScript', value: 'JAVASCRIPT' },
		],
	});

	const needTest = await confirm('Do you need the test?', { initial: true });

	const result = await createRuleHelper({ purpose, name, lang, needTest });

	output(name, '📝', 'README.md', result.readme);
	output(name, '📜', 'index', result.main);
	if (result.test) {
		output(name, '🖍 ', 'index.spec', result.test);
	}
}

function output(name: string, icon: string, title: string, path: string) {
	const _marker = c.xterm(39)('✔') + ' ';
	const _title = (icon: string, title: string) => `${icon} ` + c.bold(`${name}/${title}`);
	const _file = (path: string) => ' ' + c.cyanBright(path);
	process.stdout.write(_marker + _title(icon, title) + _file(path) + '\n');
}
