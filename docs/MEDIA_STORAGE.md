# Media storage

Rave Social must use an external object-storage provider for production media. Do not commit uploaded files or credentials to GitHub.

## Required production flow

1. Authenticated user requests an upload URL from the backend.
2. Backend validates ownership, file type, size and permissions.
3. Browser uploads directly to object storage using a short-lived signed URL.
4. Backend stores only the resulting media URL/key and metadata in PostgreSQL.
5. Media is served through the provider/CDN.

The current `/api/upload` route intentionally stops with HTTP 503 until a storage provider is configured. This prevents pretending that uploads are production-ready when there is no durable storage configured.
