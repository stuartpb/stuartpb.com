## Content
### Information
- Make different resume for non-technical stuff (writing)
- Cooler portfolio page?
  - Maybe something like http://hakim.se/experiments

## Data structure
### Planned
- Add more hResume data
  - This is what the resume was migrated from Markdown to YAML to allow

## Page construction
### Under consideration
- Replacing the skeleton + DOM approach for generating resume.html with template language
  - Mustache:
    - See http://goo.gl/RUzrT - There's no real advantage to using mustache templates, and a whole lot of disadvantage.
      - If I have a YAML "ordered mapping" (an array of objects with one key), there's no way I can use it in Mustache. Literally no way.
        I can't make a lambda to do it, because this would apparently subvert Mustache's "logic-less" approach to lambdas, where
        the lambda *can only operate on the template and not the data*. Apparently in Mustache's rush to say it doesn't have for loops
        or if statements, it forgot that it still has crude iteration and conditionals, and according to Mustache, that's all
        a template should ever need. Where it feels the responsibility for more complex synthesis lies is beyond my desire to integrate it.
      - My "templating" always ends up involving some synthesis from the data, and by doing it through DOM manipulation I don't have to place
        any arbitrary limits on what that synthesis can be.
    - My abortive attempt to make a Mustache template for my resume can be found at https://gist.github.com/3138696
  - Dust.js:
    - See http://goo.gl/e2K5P and http://akdubya.github.com/dustjs/
    - I don't want to use LinkedIn's fork to have a maintained library.
    - I still don't see that many advantages over Dust.
  - Jade:
    - See https://github.com/visionmedia/jade#readme
    - Under consideration.


## Build / deploy system
### Planned
- Change script to take commands: build (makes the page), and deploy (builds, then deploys to server via sftp)
- Generate Markdown (plaintext) from data alongside HTML generation

### Unforseeable
- Github user profile integration
  - Rather than add all the complexity of pushing my whole resume as my bio on Github, I can just make my Github bio say "see my resume".
- Timestamping build filenames
  - Nah. No reason to bloat the build directory by making duplicates of identical files.
  - if it's done with a dirty WD, it can be nice to have one file changing. Makes refreshing it easier.
