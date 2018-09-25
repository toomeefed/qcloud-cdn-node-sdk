/**
 * 您的密钥
 * 可从 <https://console.cloud.tencent.com/capi> 获取 SecretId 及 SecretKey
 */
interface Secret {
  /** 密钥 id */
  secretId: string;
  /** 密钥 key */
  secretKey: string;
}

/** 返回结果 */
interface ReplyData<T> {
  /** 错误码 */
  code: number;
  /** 模块错误信息描述 */
  message: string;
  /** 英文错误信息 */
  codeDesc: string;
  /** 相关数据 */
  data?: T;
}

/** Action 对应的名字 */
type actionNames =
  | 'DescribleCdnHosts'
  | 'GetHostInfoByHost'
  | 'GetHostInfoById '
  | 'RefreshCdnUrl'
  | 'RefreshCdnDir'
  | 'UpdateCache '
  | 'UpdateCdnProject'
  | 'UpdateCdnHost'
  | 'UpdateCdnConfig'
  | 'OfflineHost'
  | 'AddCdnHost'
  | 'OnlineHost'
  | 'DeleteCdnHost'
  | 'GenerateLogList'
  | 'GetCdnRefreshLog'
  | 'GetCdnStatTop'
  | 'GetCdnStatusCode'
  | 'DescribeCdnHostDetailedInfo'
  | 'DescribeCdnHostInfo';

/** 刷新URL 参数 */
interface RefreshCdnUrlParams {
  'urls.0': string;
  'urls.1'?: string;
  'urls.2'?: string;
  'urls.3'?: string;
  'urls.4'?: string;
  'urls.5'?: string;
  'urls.6'?: string;
  'urls.7'?: string;
  'urls.9'?: string;
  [key: string]: string;
}

/** 刷新URL 响应数据 */
interface RefreshCdnUrlReplyData {
  /** 此次刷新提交的URL数目 */
  count: number;
  /** 此次刷新任务对应的ID */
  task_id: string;
}

/** 刷新URL 参数 */
interface RefreshCdnDirParams {
  'dirs.0': string;
  'dirs.1'?: string;
  'dirs.2'?: string;
  'dirs.3'?: string;
  'dirs.4'?: string;
  'dirs.5'?: string;
  'dirs.6'?: string;
  'dirs.7'?: string;
  'dirs.9'?: string;
  /**
   * 目录刷新类型 (默认为 1)
   * 1：刷新更新资源
   * 2：刷新全部资源
   */
  type: 1 | 2;
  [key: string]: string | number;
}

/** 刷新记录查询 参数 */
interface GetCdnRefreshLogParams {
  /** 查询开始时间，如 2017-11-29 00:00:00 */
  startDate?: string;
  /** 查询结束时间，如 2017-11-29 00:05:00 */
  endDate?: string;
  /** 根据提交刷新URL任务返回的 task_id 查询 */
  taskId?: string;
  /** 需要查询的域名 */
  host?: string;
  /** 需要查询的URL */
  url?: string;
}

/** 刷新记录查询 log */
interface RefreshLog {
  /** 编号 */
  id: number;
  /** 用户APP ID */
  app_id: number;
  /** 项目ID */
  project_id: number;
  /** 域名 */
  host: string;
  /**
   * 刷新类型
   * 0：代表URL刷新
   * 1：代表目录刷新
   */
  type: number;
  /**
   * 刷新结果
   * 1：表示刷新成功
   * 0：表示刷新中
   * 若为负数，表示刷新失败
   */
  status: number;
  /** 本次刷新时提交的URL列表 */
  url_list: string[];
  /** 提交时间 */
  datetime: string;
}

/** 刷新记录查询 响应数据 */
interface GetCdnRefreshLogReplyData {
  total: number;
  logs: RefreshLog[];
}

interface actionFn {
  /** 刷新目录 */
  (actionName: 'RefreshCdnDir', params: RefreshCdnDirParams): Promise<ReplyData<undefined>>;
  /** 刷新URL */
  (actionName: 'RefreshCdnUrl', params: RefreshCdnUrlParams): Promise<ReplyData<RefreshCdnUrlReplyData>>;
  /** 刷新记录查询 */
  (actionName: 'GetCdnRefreshLog', params: GetCdnRefreshLogParams): Promise<ReplyData<GetCdnRefreshLogReplyData>>;

  /**
   * 操作方法
   * @param actionName - 方法名
   * @param params - 参数
   */
  (actionName: actionNames, params: object): Promise<ReplyData<any>>;
}

/**
 * SDK 初始化方法
 * @param secret - 密钥
 */
declare function qcloudSDK(secret: Secret): actionFn;

export = qcloudSDK;
