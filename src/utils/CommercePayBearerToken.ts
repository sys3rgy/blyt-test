import axios from "axios";

export async function getBearerToken() {
    const response = await axios.get(`/api/buyersAPIs/buyPointsAPI`)
    console.log(response.data.token)
    return response.data.token;
}