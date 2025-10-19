# Issue to Project Board 📋

[![GitHub release](https://img.shields.io/github/v/release/rkneela0912/issue-to-project-board)](https://github.com/rkneela0912/issue-to-project-board/releases) [![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Automatically add issues and PRs to GitHub Project boards

## Quick Start

```yaml
name: Add to Project
on:
  issues:
    types: [opened]
  pull_request:
    types: [opened]

jobs:
  add:
    runs-on: ubuntu-latest
    steps:
      - uses: rkneela0912/issue-to-project-board@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

## License

[MIT License](LICENSE)
