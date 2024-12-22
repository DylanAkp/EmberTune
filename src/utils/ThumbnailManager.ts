interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

export function getSizedThumbnail(thumbnails: Thumbnail[], size: number): string | undefined {
  if (!thumbnails || thumbnails.length === 0) {
    return undefined;
  }

  let closestThumbnail = thumbnails[0];
  let closestDifference = Math.abs(thumbnails[0].width - size);

  for (const thumbnail of thumbnails) {
    const difference = Math.abs(thumbnail.width - size);
    if (difference < closestDifference) {
      closestThumbnail = thumbnail;
      closestDifference = difference;
    }
  }

  return closestThumbnail.url;
}