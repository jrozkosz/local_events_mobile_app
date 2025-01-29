interface Config {
    apiBaseUrl: string;
    timeout: number;
    environment: "development" | "production";
    google_api_key: string;
}

const config: Config = {
    apiBaseUrl: "http://192.168.50.33:5000",
    // apiBaseUrl: "http://192.168.0.253:5000",
    // apiBaseUrl: "http://192.168.188.123:5000",
    timeout: 5000,
    environment: "development",
    // google_api_key: 'AIzaSyBpKzSV9AW7SWk_2qUjbnlZEsc5oICD9DQ',
    google_api_key: 'AIzaSyBpKzSV9AW7SWk_2qUjbnlZEsc5oICD9DQ'
};

export default config;
