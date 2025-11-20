import 'react-router-dom' // 导入 react-router-dom 模块以进行模块增强

// 声明模块增强
declare module 'react-router-dom' {
  // 扩展 RouteObject 接口
  interface RouteObject {
    meta?: {
      title?: string
      isNotFound?: boolean
      // 您可以在这里添加任何其他自定义的元数据属性
      // 例如：requiresAuth?: boolean;
      //       roles?: string[];
    }
  }
}
