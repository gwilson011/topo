export function getArea(currentLoc, inputMileage) {
  console.log(currentLoc);
  let degPerMileLat = 1 / 69;
  let degPerMileLng = 1 / 54.6;
  let square;

  return (square = {
    upperLat: currentLoc.lat + degPerMileLat * inputMileage,
    lowerLat: currentLoc.lat - degPerMileLat * inputMileage,
    upperLong: currentLoc.lng + degPerMileLng * inputMileage,
    lowerLong: currentLoc.lng - degPerMileLng * inputMileage,
  });
}

export function toMeters(miles) {
  //easy
  return miles / 0.000621371;
}

export function areaUnderCurve(points) {
  let area = 0;
  for (let i = 0; i < points.length - 1; i++) {
    //using the trapizodal method
    area = area + 0.5 * (points[i] + points[i + 1]);
  }
  return area;
}

export function commonElementsWithOrder(arr1, arr2) {
  // Create a Set from arr2 for efficient lookups
  const setArr2 = new Set(arr2);

  // Initialize an empty result array to store common elements
  const result = [];

  // Iterate through arr1, checking if each element exists in arr2
  for (const item of arr1) {
    if (setArr2.has(item)) {
      result.push(item);
    }
  }

  return result;
}
