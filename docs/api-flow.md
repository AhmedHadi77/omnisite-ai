# API Flow

## Connect site

1. User submits platform, domain, and API credentials.
2. API validates the credential shape and stores an encrypted connection record.
3. Platform service fetches lightweight metadata.
4. Dashboard receives normalized site status.

## Run AI audit

1. User clicks Analyze.
2. API collects site metadata, recent content, platform type, and selected page notes.
3. AI service returns structured recommendations.
4. Audit record and generated tasks are stored.
5. UI renders the audit summary, scores, and task queue.