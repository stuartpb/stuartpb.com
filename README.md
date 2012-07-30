## Usage
`node index.js build` builds the resume to a path (consisting of "resume-" + the version of the resume as described by Git + ".html") in the "build" directory.

`node index.js deploy` does that, then deploys that file to a server specified

## Deploying
`node index.js deploy` uses `sftp` to upload the file- you authenticate to the server however you authenticate through SSH. (I'm working with a server that I have authorized keys for, so that's pretty much the only supported method- I haven't come up with a way to support password prompting and there's no option passthrough.)

The path to the server is defined in `config/deploy.json`. This file is gitignored in the repository, but can be easily written yourself. An example is included as `config/deploy.json.example` - copy that and change the values to fit your server appropriately. ("host" is the URL of the server, and "path" is the path prefix to upload files to.)
