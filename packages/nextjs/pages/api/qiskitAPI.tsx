import axios from 'axios'


// Define an async function to fetch data from the API
export async function fetchQiskitDataFromApi(): Promise<any> {
  // Define the API URL

  const data = JSON.stringify({
    qasm: 'OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[3];\ncreg meas[3];\nh q[0];\ncx q[0],q[1];\ncx q[0],q[2];\nbarrier q[0],q[1],q[2];\nmeasure q[0] -> meas[0];\nmeasure q[1] -> meas[1];\nmeasure q[2] -> meas[2];',
  })

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://fastapi-production-b856.up.railway.app/draw',
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  }
  
  return axios
    .request(config)
    .then(response => {
      console.log(JSON.stringify(response))
    })
    .catch(error => {
      console.log(error)
    })
}
