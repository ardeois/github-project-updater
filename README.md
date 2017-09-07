Simple script to update project cards

# Requirements:
You need node 7.0 or above in order to run this script.

# Basic usage

## Set gitHub token

```bash
$ export GITHUB_TOKEN=abcdef123456
```


## Help
```bash
$ ./index.js --help
ndex.js <cmd> [args]

Commands:
  list-projects [--org]   list all projects for an organization
  list-columns            list all columns from one project
  move-cards [from] [to]  move all cards from one column to another

Options:
  --help  Show help                                                    [boolean]
  
$ ./index.js --help move-cards
index.js move-cards [from] [to]

Options:
  --help            Show help                                          [boolean]
  --project-id, -p  GitHub Project Id                                 [required]
  --from, -f        Column Id where all cards will be moved from      [required]
  --to, -t          Column Id where all cards will be moved to        [required]  
```

## List projects

```bash
$ ./index.js list-projects --org MyOrganisation

- Team 1
     id: 123
- Team 2
     id: 456
- Team 3
     id: 789
```

## List Project columns

```bash
$ ./index.js list-columns -p ProjectID
- Opened for Feedback
     id: 111
- Awaiting Code Review
     id: 222
- QA Ready
     id: 333
- QA in Progress
     id: 444
- QA Passed
     id: 555
```

## Move Cards

```bash
$ ./index.js move-cards --dry-run -p projectID -f fromColumnID -t toColumnID
```