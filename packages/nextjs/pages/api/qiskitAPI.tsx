import axios from "axios";

// Define an async function to fetch data from the API
export async function fetchQiskitDataFromApi(qasm: string): Promise<any> {
  // Define the API URL

  const data = JSON.stringify({
    qasm,
  });

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://quantum-api-2eds4tyidq-nw.a.run.app/draw",
    headers: {
      "Content-Type": "application/json",
      Accept: "image/png",
    },
    responseType: "blob",
    data: data,
  };

  fetch("https://quantum-api-2eds4tyidq-nw.a.run.app/draw", {
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/json",
      Accept: "image/png",
    },
  }).then(async res => {
    const blob = await res.blob();
    const objectURL = URL.createObjectURL(blob);
  });

  return axios
    .request(config as any)
    .then(response => {
      console.log(URL.createObjectURL(response.data));
      let blob = new Blob([response.data], { type: "image/png" });
      const data = URL.createObjectURL(blob);
      console.log(data);
    })
    .catch(error => {
      console.log(error);
    });
}
