export function extractCoordinates(address: string): {
  latitude: number;
  longitude: number;
} {
  const [latStr, lonStr] = address.split(",");
  const latitude = parseFloat(latStr.trim());
  const longitude = parseFloat(lonStr.trim());

  return { latitude, longitude };
}
