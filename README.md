Simple script to update project cards

# Basic usage

```bash
export GITHUB_TOKEN=abcdef123456
./index.js --help
./index.js --help list-projects
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