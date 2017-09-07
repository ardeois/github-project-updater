#!/usr/bin/env node
let GitHubApi = require('github');
let _ = require('lodash');

if (!process.env.GITHUB_TOKEN) {
    console.log('Please provide environment variable `GITHUB_TOKEN`');
    process.exit(1);
}

let github = _getGithub();

let argv = require('yargs')
    .usage('$0 <cmd> [args]')
    .option('dry-run', {
        alias: 'd'
    })
    .boolean('d')
    .command('list-projects [--org]', 'list all projects for an organization', function (yargs) {
        return yargs
            .option('org', {
                describe: 'organization name'
            })
            .demandOption(['org'])
    }, getProjects)
    .command('list-columns', 'list all columns from one project', function (yargs) {
        return yargs
            .option('project-id', {
                alias: 'p',
                describe: 'GitHub Project Id'
            })
            .demandOption(['project-id'])
    }, listColumns)
    .command('move-cards [from] [to]', 'move all cards from one column to another', function (yargs) {
        return yargs
            .option('project-id', {
                alias: 'p',
                describe: 'GitHub Project Id'
            })
            .option('from', {
                alias: 'f',
                describe: 'Column Id where all cards will be moved from'
            })
            .option('to', {
                alias: 't',
                describe: 'Column Id where all cards will be moved to'
            })
            .demandOption(['from', 'to', 'project-id'])
    }, moveCards)
    .demandCommand(1, 'You need at least one command before moving on')
    .help()
    .argv;

function getProjects(argv) {
    github.projects.getOrgProjects({
        org: argv.org
    }).then(({data: projects}) => {
        _.each(projects, p => {
            console.log(`- ${p.name}
     id: ${p.id}`);
        });
    });
}

function listColumns(argv) {
    let projectId = argv.projectId;

    github.projects.getProjectColumns({
        project_id: projectId
    }).then(function({data: columns}) {
        _.each(columns, c => {
            console.log(`- ${c.name}
     id: ${c.id}`)
        });
    });
}

function moveCards(argv) {
    github.projects.getProjectCards({
        column_id: argv.from
    }).then((data) => {
        _handleMoveCardsResponse(data, argv);

    });
}

function _handleMoveCardsResponse(res, argv) {
    let promise = Promise.resolve();

    if (argv.dryRun) {
        console.log('dry run !')
    }

    _.each(res.data, card => {
        promise = promise.then(() => {
            if (!card.content_url) {
                console.log(`NO ACCESS FOR CARD ${card.id}`);
                return;
            }
            if (argv.dryRun) {
                console.log(`Will move card id ${card.id}`);
            } else {
                console.log(`Moving card id ${card.id}`);
                return github.projects.moveProjectCard({
                    id: card.id,
                    position: 'bottom',
                    column_id: argv.to
                });
            }


        });
    });

    promise.then(() => {
        if (github.hasNextPage(res)) {
            if (argv.dryRun) {
                github.getNextPage(res).then(res => _handleMoveCardsResponse(res, argv));
            } else {
                //We don't check next page as we updated the current column so we re-trigger the get cards
                moveCards(argv);
            }
        }
    });
}


function _getGithub() {
    let github = new GitHubApi();

    github.authenticate({
        type: 'token',
        token: process.env.GITHUB_TOKEN
    });

    return github;
}