import { environment } from "./environments/environment";

export class Settings {
    static ApiUrl = environment.apiUrl;
    static Code = environment.code;
    static PageSizeOptions = environment.pageSizeOptions;
}