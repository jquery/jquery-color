"use strict";

module.exports = {
	preReleaseBase: 1,
	hooks: {
		"before:init": "./build/release/pre-release.sh",
		"after:version:bump":
			"sed -i '' -e 's|main/AUTHORS.txt|${version}/AUTHORS.txt|' package.json",
		"after:bump": "cross-env VERSION=${version} npm run build",
		"before:git:release": "git add -f dist/",
		"after:release": "./build/release/post-release.sh ${version}"
	},
	git: {
		commitMessage: "Release: ${version}",
		getLatestTagFromAllRefs: true,
		pushRepo: "git@github.com:jquery/jquery-color.git",
		requireBranch: "main",
		requireCleanWorkingDir: true,
		commit: true,
		tag: true,
		tagName: "${version}",
		tagAnnotation: "Release: ${version}"
	},
	github: {
		pushRepo: "git@github.com:jquery/jquery-color.git",
		release: true,
		tokenRef: "JQUERY_GITHUB_TOKEN"
	},
	npm: {
		publish: true
	}
};
