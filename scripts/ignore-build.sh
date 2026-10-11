#!/usr/bin/env bash
# Netlify "ignore" check: exit 0 skips the build, any other exit builds.
# Every production deploy uses Netlify credits, so commits that only add or
# delete files in public/uploads (e.g. "Delete media" from the admin) are skipped.
# Those files are published with the next content change.

# Build hooks (the weekly publications refresh) and "Trigger deploy" always build.
if [ -n "$INCOMING_HOOK_TITLE" ] || [ -z "$CACHED_COMMIT_REF" ] || [ "$CACHED_COMMIT_REF" = "$COMMIT_REF" ]; then
  exit 1
fi
git diff --quiet "$CACHED_COMMIT_REF" "$COMMIT_REF" -- . ':(exclude)public/uploads'
