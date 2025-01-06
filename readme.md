# Monorepo 架构

### 介绍

Monorepo是一种软件开发实践，其中所有的项目或库都托管在同一个Git仓库中。这种模式与传统的多个仓库（multirepo）模式相对。

1. 在Monorepo中，项目之间的依赖关系可以在一个仓库中更新，而不是在多个仓库中分别更新。
2. 所有的代码变更都在一个仓库中进行，这使得查看项目的整个变更历史变得更加容易。

### 参考

1. [你一定能学会Monorepo - 小野的web世界](https://www.bilibili.com/video/BV1TZz7YvEWZ/?spm_id_from=333.999.0.0&vd_source=1c6268f99220acd2592c93a3a87cbe31)

2. 和杜成讨论

### 搭建

>  包管理工具使用pnpm

1. 仓库初始化，配置工作区，在配置文件指定不同包的路径

   ```bash
   pnpm init # 或者 npm init -y
   echo. > pnpm-workspace.yaml # 或者手动创建该文件 => pnpm-workspace.yaml
   ```

   ```bash
   # 在配置文件 pnpm-workspace.yaml 指定不同包的路径
   packages:
    - "apps/*" # apps下一级目录为包路径
    - "packages/*"
    - "scripts/*"
    - "abc" # 指定abc为包路径
   ```

2. 根目录安装依赖，子包（每个子包都是一个单独的包，有单独的package.json）中可以直接使用根目录的第三方库

   ```bash
   # -------------ROOT----------------
   # 安装一个xxx作为根目录的开发依赖
   pnpm add xxx -w # -w => -workspace-root
   # 安装根目录的所有依赖
   pnpm i -w
   
   # -------------PACKAGE----------------
   # 可以在子包直接使用xxx第三方库
   ```

3. 子包引入项目中另一个子包作为依赖

   ```
   # package1 => 包名为 @test/xxx
   export function sum(param1, param2) {
   	return param1 + param2
   }
   
   # 在package2的terminal中
   pnpm add @test/xxx -workspace
   
   # package2
   import { sum } from "@test/xxx"
   ```