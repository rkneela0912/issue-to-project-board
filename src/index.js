const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    const token = core.getInput('github_token', { required: true });
    const projectNumber = parseInt(core.getInput('project_number', { required: true }));
    const labelMappingsInput = core.getInput('label_mappings');
    const defaultStatus = core.getInput('default_status');
    
    const context = github.context;
    const octokit = github.getOctokit(token);
    
    const issue = context.payload.issue || context.payload.pull_request;
    if (!issue) {
      core.info('Not an issue or PR event');
      return;
    }
    
    const { owner, repo } = context.repo;
    const itemNodeId = issue.node_id;
    
    // Get project ID
    const { data: { organization, repository } } = await octokit.graphql(`
      query($owner: String!, $repo: String!, $projectNumber: Int!) {
        repository(owner: $owner, name: $repo) {
          projectV2(number: $projectNumber) {
            id
          }
        }
      }
    `, { owner, repo, projectNumber });
    
    const projectId = repository?.projectV2?.id;
    
    if (!projectId) {
      core.setFailed(`Project #${projectNumber} not found`);
      return;
    }
    
    // Add item to project
    await octokit.graphql(`
      mutation($projectId: ID!, $contentId: ID!) {
        addProjectV2ItemById(input: {projectId: $projectId, contentId: $contentId}) {
          item {
            id
          }
        }
      }
    `, { projectId, contentId: itemNodeId });
    
    core.info(`✅ Added to project #${projectNumber}`);
    core.setOutput('added', 'true');
    
  } catch (error) {
    core.setFailed(`Action failed: ${error.message}`);
  }
}

run();

