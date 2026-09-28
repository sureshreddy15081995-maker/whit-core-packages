export declare class LoginService {
    private static httpOptions;
    static onLogin(postdata: any, siteId?: string): Promise<{
        success: boolean;
        data: any;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        data?: undefined;
    }>;
    static onRegister(postdata: any, siteId?: string): Promise<{
        success: boolean;
        data: any;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        data?: undefined;
    }>;
    static onForgotPassword(postdata: any, siteId?: string): Promise<{
        success: boolean;
        data: any;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        data?: undefined;
    }>;
    static onLogOut(siteId?: string): Promise<{
        success: boolean;
    }>;
    static getNonce(address: string): Promise<any>;
    static webAuthVerify(postdata: any, siteId?: string): Promise<any>;
}
//# sourceMappingURL=loginService.d.ts.map