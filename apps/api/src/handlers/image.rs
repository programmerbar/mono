use axum::{
    Json,
    body::Body,
    extract::{Multipart, Path, State},
    http::HeaderMap,
};
use chrono::Utc;

use crate::{dto, errors::ApiError, models::auth::AuthorizedMember, state::AppState};

pub async fn upload_image(
    State(state): State<AppState>,
    _auth: AuthorizedMember,
    mut multipart: Multipart,
) -> Result<Json<dto::ImageResponse>, ApiError> {
    let mut image = None;

    while let Some(field) = multipart
        .next_field()
        .await
        .map_err(|_| ApiError::InternalServerError)?
    {
        if field.name() == Some("image") {
            let content_type = field.content_type().map(|ct| ct.to_string());
            let bytes = field
                .bytes()
                .await
                .map_err(|_| ApiError::InternalServerError)?;
            image = Some((content_type, bytes));
        }
    }

    let (content_type, bytes) = image.ok_or(ApiError::BadRequest("No image provided".into()))?;

    // Validate content type
    let content_type = content_type.unwrap_or_default();
    if !content_type.starts_with("image/") {
        return Err(ApiError::BadRequest("File must be an image".into()));
    }

    // Generate unique filename
    let file_id = uuid::Uuid::new_v4().to_string();
    let extension = match content_type.as_str() {
        "image/jpeg" => "jpg",
        "image/png" => "png",
        "image/gif" => "gif",
        "image/webp" => "webp",
        _ => return Err(ApiError::BadRequest("Unsupported image format".into())),
    };
    let file_name = format!("{}.{}", file_id, extension);

    // Upload to S3
    let response = state
        .bucket
        .put_object(&file_name, &bytes)
        .await
        .map_err(|e| {
            tracing::error!("S3 upload failed: {}", e);
            ApiError::InternalServerError
        })?;

    if response.status_code() != 200 {
        tracing::error!("S3 upload failed with status: {}", response.status_code());
        return Err(ApiError::InternalServerError);
    }

    // Save to database
    let image_record = crate::models::image::Image {
        id: file_id.clone(),
        size: bytes.len() as i32,
        filename: file_name.clone(),
        r#type: content_type.clone(),
        created_at: Utc::now(),
        updated_at: Utc::now(),
    };

    state.image_repo.create(&image_record).await.map_err(|e| {
        tracing::error!("Database insert failed: {}", e);
        ApiError::InternalServerError
    })?;

    Ok(Json(dto::ImageResponse {
        id: file_id,
        file_name,
        content_type,
        size: bytes.len() as u64,
    }))
}

pub async fn get_image_by_id(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> Result<(HeaderMap, Body), ApiError> {
    let object = state.bucket.get_object(&id).await.map_err(|e| {
        tracing::error!("Failed to get image from S3: {}", e);
        ApiError::NotFound(format!("Image with id '{}' not found", id))
    })?;

    let image = state
        .image_repo
        .get_by_id(&id)
        .await
        .map_err(|_| ApiError::InternalServerError)?
        .ok_or_else(|| {
            tracing::error!("Image with id '{}' not found in database", id);
            ApiError::NotFound(format!("Image with id '{}' not found", id))
        })?;

    let body = Body::from(object.into_bytes());

    let mut headers = HeaderMap::new();
    headers.insert("Content-Type", image.r#type.parse().unwrap());
    headers.insert("Content-Length", image.size.to_string().parse().unwrap());
    headers.insert("Cache-Control", "public, max-age=3600".parse().unwrap());
    headers.insert(
        "Last-Modified",
        image.created_at.to_rfc2822().parse().unwrap(),
    );
    headers.insert("ETag", format!("\"{}\"", id).parse().unwrap());

    Ok((headers, body))
}
