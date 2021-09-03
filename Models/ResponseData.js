export function ResponseData(statusCode, errorText = null, data = null) {
    this.statusCode = statusCode;
    this.error = errorText;
    this.data = data;
}

export function ResponseDataFromFetchReponse(fetchResult) {
    let result = new ResponseData(fetchResult.status);
    if (result.statusCode >= 400) {
        if (result.statusCode === 401 || result.statusCode === 403) {
            result.error = "Cont neautorizat pentru aceasta operațiune."
        } else if (result.statusCode === 404) {
            result.error = "Eroare de comunicare cu serverul."
        } else {
            result.error = fetchResult.statusText;
        }
    } else {
        try {
            result.data = fetchResult.data;
        } catch (error) {
            result.status = - 1;
            result.error = error;
        }
    }
    return result;
}

export function ResponseDataFromAuthFetchReponse(fetchResult) {
    if (fetchResult.status) {
        return ResponseDataFromFetchReponse(fetchResult);
    } 
    return new ResponseData(200, null, fetchResult.authToken);
}

export function isPositiveResponse(responseCode) {
    return 200 <= responseCode && responseCode < 400;
}