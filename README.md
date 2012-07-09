`node deploy.js` to deploy to the sftp url in the `deploy_target` file.

`deploy_target` is gitignored, so you'll have to write it yourself. Include both the server part and a path after the slash.

`deploy.js` uses `sftp` to upload the file- you authenticate to the server however you authenticate through SSH. (I'm working with a server that I have authorized keys for, so that's pretty much the only supported method- I haven't come up with a way to support password prompting and there's no option passthrough.)
