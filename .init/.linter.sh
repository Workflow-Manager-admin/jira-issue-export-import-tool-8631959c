#!/bin/bash
cd /home/kavia/workspace/code-generation/jira-issue-export-import-tool-8631959c/jira_syncer_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

