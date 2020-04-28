const DarkSky = require("dark-sky")

type LatLong = { lattitude: string, longitude: string }

function getWeather(api_key:string, location:LatLong) {
  
}

async function makeRequest(api_key:string, options:any) {
  const dark_sky = new DarkSky(api_key)

  const response = await dark_sky.options(options).get()

  console.log(response.daily.data)
}

// makeRequest("eb6ae741a31109073766ed072ecea6f8", {
//   latitude: "0",
//   longitude: "0"
// })