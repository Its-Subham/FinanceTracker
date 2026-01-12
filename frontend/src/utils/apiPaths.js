export const BASE_URL = import.meta.env.VITE_API_URL;

export const API_PATHS = {
    AUTH:{
        LOGIN: `${BASE_URL}/api/auth/login`,
        SIGNUP: `${BASE_URL}/api/auth/register`,
        GET_USER_INFO: `${BASE_URL}/api/auth/getUser`,
    },
    DASHBOARD:{
        GET_DATA: `${BASE_URL}/api/dashboard`,
    },
    INCOME:{
        ADD_INCOME: `${BASE_URL}/api/income/add`,
        GET_ALL_INCOME: `${BASE_URL}/api/income/get`,
        DELETE_INCOME: `${BASE_URL}/api/income/delete`,
        DOWNLOAD_INCOME: `${BASE_URL}/api/income/downloadexcel`,
    },
    EXPENSE:{
        ADD_EXPENSE: `${BASE_URL}/api/expense/add`,
        GET_ALL_EXPENSE: `${BASE_URL}/api/expense/get`,
        DELETE_EXPENSE: `${BASE_URL}/api/expense/delete`,
        DOWNLOAD_EXPENSE: `${BASE_URL}/api/expense/downloadexcel`,
    },
    Image:{
        UPLOAD_IMAGE: `${BASE_URL}/api/auth/upload-image`,
    }
}