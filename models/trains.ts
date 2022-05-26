import config from "../config/config.json";


const orders = {
    getdelays: async function getdelays() {
        try {
            const response = await fetch(`${config.base_url}/delayed`);
            const result = await response.json();

            return result.data;
        } catch (error) {
            console.log("error")
        }
    },
    getstations: async function getstations() {
        try {
            const response = await fetch(`${config.base_url}/stations`);
            const result = await response.json();

            return result.data;
        } catch (error) {
            console.log("error")
        }
    }
};

export default orders;