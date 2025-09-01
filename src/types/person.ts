import type { BaseRes } from "./api";

// Casdoor 面部识别相关接口
export interface FaceId {
    ImageUrl: string;
    faceIdData: number[];
    name: string;
}

// Casdoor 管理账户接口
export interface ManagedAccount {
    application: string;
    username: string;
    password: string;
    signinUrl: string;
}

// Casdoor MFA账户接口
export interface MfaAccount {
    accountName: string;
    issuer: string;
    origin: string;
    secretKey: string;
}

// Casdoor MFA项目接口
export interface MfaItem {
    name: string;
    rule: string;
}

// Casdoor 多因素认证接口
export interface MultiFactorAuth {
    mfaType: string;
    secret: string;
    enabled: boolean;
    url: string;
    recoveryCodes: string[];
    mfaRememberInHours: number;
    isPreferred: boolean;
    countryCode: string;
}

// Casdoor 权限接口
export interface Permission {
    owner: string;
    name: string;
    displayName: string;
    description: string;
    users: string[];
    roles: string[];
    domains: string[];
    model: string;
    adapter: string;
    resourceType: string;
    resources: string[];
    actions: string[];
    effect: string;
    isEnabled: boolean;
    submitter: string;
    approver: string;
    approveTime: string;
    state: string;
    createdTime: string;
    groups: string[];
}

// Casdoor 角色接口
export interface Role {
    owner: string;
    name: string;
    displayName: string;
    description: string;
    users: string[];
    groups: string[];
    roles: string[];
    domains: string[];
    isEnabled: boolean;
    createdTime: string;
}

// 应用内使用的简化用户类型
export interface AppUser {
    id: string;
    studentId: string;  // 对应 Casdoor 中的 name（学号）
    displayName: string;
    email: string;
    phone: string;
    gender: string;
    avatar: string;
    nickname: string;
    groups: string[];
    roles: string[];
    isAdmin: boolean;
    properties: {[key: string]: string};
}

// Casdoor 用户完整接口
export interface CasdoorUser {
    id?: string;
    owner?: string;
    name: string;
    type?: string;
    password?: string;
    passwordType?: string;
    passwordSalt?: string;
    displayName?: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    permanentAvatar?: string;
    email?: string;
    emailVerified?: boolean;
    phone?: string;
    countryCode?: string;
    region?: string;
    location?: string;
    address?: string[];
    affiliation?: string;
    title?: string;
    idCardType?: string;
    idCard?: string;
    homepage?: string;
    bio?: string;
    tag?: string;
    language?: string;
    gender?: string;
    birthday?: string;
    education?: string;
    score?: number;
    karma?: number;
    ranking?: number;
    isDefaultAvatar?: boolean;
    isOnline?: boolean;
    isAdmin?: boolean;
    isForbidden?: boolean;
    isDeleted?: boolean;
    signupApplication?: string;
    hash?: string;
    preHash?: string;
    accessKey?: string;
    accessSecret?: string;
    createdTime?: string;
    updatedTime?: string;
    deletedTime?: string;
    
    // 登录相关
    createdIp?: string;
    lastSigninTime?: string;
    lastSigninIp?: string;
    signinWrongTimes?: number;
    lastSigninWrongTime?: string;
    lastChangePasswordTime?: string;
    needUpdatePassword?: boolean;
    
    // 多因素认证
    mfaPhoneEnabled?: boolean;
    mfaEmailEnabled?: boolean;
    totpSecret?: string;
    mfaRememberDeadline?: string;
    preferredMfaType?: string;
    recoveryCodes?: string[];
    mfaItems?: MfaItem[];
    mfaAccounts?: MfaAccount[];
    multiFactorAuths?: MultiFactorAuth[];
    
    // WebAuthn相关
    webauthnCredentials?: any[];
    
    // 第三方登录
    github?: string;
    google?: string;
    qq?: string;
    wechat?: string;
    facebook?: string;
    dingtalk?: string;
    weibo?: string;
    gitee?: string;
    linkedin?: string;
    wecom?: string;
    lark?: string;
    gitlab?: string;
    adfs?: string;
    baidu?: string;
    alipay?: string;
    casdoor?: string;
    infoflow?: string;
    apple?: string;
    azuread?: string;
    slack?: string;
    steam?: string;
    bilibili?: string;
    okta?: string;
    douyin?: string;
    line?: string;
    amazon?: string;
    auth0?: string;
    battlenet?: string;
    bitbucket?: string;
    box?: string;
    cloudfoundry?: string;
    dailymotion?: string;
    deezer?: string;
    digitalocean?: string;
    discord?: string;
    dropbox?: string;
    eveonline?: string;
    fitbit?: string;
    gitea?: string;
    heroku?: string;
    influxcloud?: string;
    instagram?: string;
    intercom?: string;
    kakao?: string;
    lastfm?: string;
    ldap?: string;
    meetup?: string;
    microsoftonline?: string;
    naver?: string;
    nextcloud?: string;
    onedrive?: string;
    oura?: string;
    patreon?: string;
    paypal?: string;
    salesforce?: string;
    shopify?: string;
    soundcloud?: string;
    spotify?: string;
    strava?: string;
    stripe?: string;
    tiktok?: string;
    tumblr?: string;
    twitch?: string;
    twitter?: string;
    typetalk?: string;
    uber?: string;
    vk?: string;
    wepay?: string;
    xero?: string;
    yahoo?: string;
    yammer?: string;
    yandex?: string;
    zoom?: string;
    metamask?: string;
    web3onboard?: string;
    kwai?: string;
    azureadb2c?: string;
    
    // 其他属性
    properties?: {[key: string]: string};
    
    // 组织与权限
    roles?: Role[];
    permissions?: Permission[];
    groups?: string[];
    
    // 其他字段
    faceIds?: FaceId[];
    managedAccounts?: ManagedAccount[];
    accessToken?: string;
    externalId?: string;
    invitationCode?: string;
    invitation?: string;
    balance?: number;
    avatarType?: string;
    ipWhitelist?: string;
    currency?: string;
    custom?: string;
}

export interface Users {
    message?: string;
    code?: string;
    users?: CasdoorUser[];
}

// 扩展类型，支持直接返回用户数组的情况
export type UsersResponse = Users | CasdoorUser[];

export type UsersRes = BaseRes<UsersResponse>;

// 用户类型转换工具函数
export const UserTypeUtils = {
    // 将 Casdoor 用户转换为应用用户
    casdoorToAppUser(casdoorUser: CasdoorUser): AppUser {
        // 进行一次深度拷贝，避免直接修改原始对象
        const appUser: AppUser = {
            id: casdoorUser.id || '',
            studentId: casdoorUser.name || '未填写',  // 学号
            displayName: casdoorUser.displayName || '未填写',
            email: casdoorUser.email || '未填写',
            phone: casdoorUser.phone || '未填写',
            gender: casdoorUser.gender || '未知',
            avatar: casdoorUser.avatar || '',
            nickname: casdoorUser.properties?.nickname || casdoorUser.displayName || casdoorUser.name || '未填写',
            groups: casdoorUser.groups || [],
            roles: (casdoorUser.roles || []).map(role => role.displayName || role.name),
            isAdmin: casdoorUser.isAdmin || false,
            properties: casdoorUser.properties || {}
        };
        
        // 调试每个关键字段的转换情况
        if (!appUser.displayName) {
            console.warn('警告: 用户缺少 displayName', casdoorUser.name);
        }
        
        return appUser;
    },
    
    // 批量转换用户列表
    casdoorToAppUsers(casdoorUsers: CasdoorUser[]): AppUser[] {
        console.log('开始转换 Casdoor 用户列表为应用用户格式...');
        console.log('输入的 Casdoor 用户数量:', casdoorUsers.length);
        
        const appUsers = casdoorUsers.map(user => this.casdoorToAppUser(user));
        
        console.log('转换完成，输出的应用用户数量:', appUsers.length);
        return appUsers;
    },
    
    // 检查用户是否在特定组中
    isInGroup(user: AppUser | CasdoorUser, groupName: string): boolean {
        const groups = 'groups' in user ? user.groups : [];
        if (!groups || !groups.length) return false;
        return groups.some(group => group.includes(groupName));
    },
    
    // 检查用户是否有特定角色
    hasRole(user: AppUser | CasdoorUser, roleName: string): boolean {
        if ('roles' in user && Array.isArray(user.roles)) {
            // 如果是 AppUser
            if (typeof user.roles[0] === 'string') {
                return (user.roles as string[]).some(role => role.includes(roleName));
            }
            // 如果是 CasdoorUser
            return (user.roles as Role[]).some(role => 
                (role.name && role.name.includes(roleName)) || 
                (role.displayName && role.displayName.includes(roleName))
            );
        }
        return false;
    }
};
