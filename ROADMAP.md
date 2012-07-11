## Content
### Information
- Make different resume for non-technical stuff (writing)
- Cooler portfolio page?
  - Maybe something like http://hakim.se/experiments

### Presentation
- Stylesheet!

## System structure
### Definite to-do
- Change deploy.js to be called something else (init.js?)
- Change script to take commands: build (makes the page), and deploy (builds, then deploys to server via sftp)

### Under consideration
- Make resume data more rich/complex than current Markdown document
- Generate Markdown from data alongside HTML generation
- Replacing the skeleton + DOM approach for generating resume.html with mustache/hogan templates
  - This would enable Markdown generation as described above

### Decided against
- Github user profile integration
  - Rather than add all the complexity of pushing my whole resume as my bio on Github, I can just make my Github bio say "see my resume".
