import { debug, getInput, setFailed } from '@actions/core';
import { context, GitHub } from '@actions/github';
import { createWriteStream } from 'fs';
import { join } from 'path';

const { GITHUB_TOKEN, GITHUB_WORKSPACE } = process.env;

async function run() {
	const path = getInput('path', { required: true });

	const octokit = new GitHub(GITHUB_TOKEN!);
	debug(`Commit: ${context.sha}`);

	const { owner, repo } = context.repo;
	const release_id = context.payload.release.id;
	let assets;
	try {
		assets = (await octokit.repos.listAssetsForRelease({ owner, repo, release_id })).data;
	} catch (error) {
		return setFailed(error.message);
	}

	for (const asset of assets) {
		createWriteStream(join(GITHUB_WORKSPACE!, path, asset.name));
	}
}

void run();
