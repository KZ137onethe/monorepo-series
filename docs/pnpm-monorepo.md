# Monorepo 架构

### 介绍

Monorepo是一种软件开发实践，其中所有的项目或库都托管在同一个Git仓库中，也就是**单体多模块仓库**。这种模式与传统的多个仓库（multirepo）模式相对。

1. 在Monorepo中，项目之间的依赖关系可以在一个仓库中更新，而不是在多个仓库中分别更新。
2. 所有的代码变更都在一个仓库中进行，这使得查看项目的整个变更历史变得更加容易。
3. 通过配置，可以减少工作空间中公用部分的依赖体积

### 参考

1. [你一定能学会Monorepo - 小野的web世界](https://www.bilibili.com/video/BV1TZz7YvEWZ/?spm_id_from=333.999.0.0&vd_source=1c6268f99220acd2592c93a3a87cbe31)

2. [pnpm - 工作空间](https://pnpm.io/zh/workspaces)

3. 和杜成讨论

4. 代码实践

### 使用pnpm搭建

1. 仓库初始化

   ```shell
   pnpm init # 或者 npm init -y
   ```

2. 配置工作区

   在仓库根目录创建一个`pnpm-workspace.yaml`文件作为工作区的配置文件，该文件按照yaml文件的语法编写，语法参考：

   下面是文件配置项：

   * `packages` 下来配置这个工作区范围包的相对路径，通常情况下，范围包会作为工作区的基本组成单元，**范围包**请参考：[scope](https://npm.nodejs.cn/cli/v11/using-npm/scope)，下面是一些示例：

     ```yaml
     packages:
       - a # 根目录下的文件夹 a 为一个范围包
       - "apps/*" # 根目录下的文件夹 apps 的下一级的所有目录都认为是一个范围包
       - packages/* # 根目录下的文件夹下 packages 的下一级所有目录都为一个范围包
       - "!**/test" # 排除根目录下所有的子目录（包含嵌套）test是一个范围包
       - "demo/**" # 根目录下的demo文件夹下所有的子目录都认为是一个范围包
       - server # 根目录下的文件夹server认为是一个范围包
     ```

   * `catalog`选项是用来定义一个默认目录来指定依赖的版本号（常量），目录中定义的常量可以在`package.json`中引用

     > catalog 来源于 **catalogs**，使用 (单数) catalog 字段创建名为 default 的目录
     >
     > 其 **catalogs** 是一个工作空间的功能，上面说的 catalog 是作为一个目录协议的

     在 pnpm-workspace.yaml 中定义目录

     ```yaml
     #.....
     
     # 定义目录和依赖版本号
     catalog:
       webpack: ^5.100.2
       webpack-cli: ^6.0.1
       postcss: ^8.5.6
       postcss-loader: ^8.1.1
       postcss-preset-env: ^10.1.5
       gasp: ^3.13.0
       sass: ^1.86.1
       sass-loader: ^16.0.5
     ```

     在该工作空间中的`package.json`可以使用`catalog:`协议来代替依赖版本

     ```json
     {
     	"name": "@test/example",
     	"dependencies": {
     		"webpack": "catalog:",
     		"webpack-cli": "catalog:"
     	}
     }
     ```

     也就等同于：

     ```json
     {
     	"name": "@test/example",
     	"dependencies": {
     		"webpack": "^5.100.2",
     		"webpack-cli": "^6.0.1"
     	}
     }
     ```

     你可以在 package.json 中的 dependencies，devDependencies，peerDependencies，optionalDependencies 中使用 catalog: 协议

     还可以在 pnpm-workspace.yaml 中的 overrides 中使用

   * `catalogs`选项是用来定义一个或者多个具名目录来指定依赖的版本号（常量），目录中定义的常量可以在`package.json`中引用

     > catalogs 选项也是 **catalogs** 功能的一部分，使用 (复数) catalogs 字段创建任意命名的目录。
     >
     > 这里的 catalogs 选项也是作为一个目录协议的

     与上面 catalog 类似，可以在 catalogs 选项下配置具有名称任意选择的多个 catalog。

     ```yaml
     catalogs:
       # 可以通过 "catalog:webpack5" 引用
       webpack5:
         webpack: ^5.100.2
         webpack-cli: ^6.0.1
         webpack-dev-server: ^5.2.2
       # # 可以通过 "catalog:utils" 引用
       utils:
       	es-toolkit: ^1.43.0
       	gsap: ^3.14.2
     ```

     catalog 选项可以与 catalogs 选项一起使用，这对正在更新依赖项版本的大型多包存储库可能会很有用。

     ```yaml
     catalog:
       typescript: ^5.9.3
     
     catalogs:
       # 可以通过 "catalog:webpack5" 引用
       webpack5:
         webpack: ^5.100.2
         webpack-cli: ^6.0.1
         webpack-dev-server: ^5.2.2
       # # 可以通过 "catalog:utils" 引用
       utils:
       	es-toolkit: ^1.43.0
       	gsap: ^3.14.2
     ```

   * `catalogMode`（pnpm>=10.12.1）安装依赖包时，按照约定模式来安装依赖

     三种模式：

     strict: 仅允许来自catalog目录协议的依赖版本。

     prefer: 优先使用pnpmcatalog目录协议的依赖版本，但如果未找到兼容版本，则会退回到package.json中的直接依赖项。

     manual: 不会自动将依赖项添加到pnpm-lock.yaml的catalog目录协议中，这个是默认的。

     一般来说使用 prefer 会更好管理：

     <video controls width="auto" autoplay loop muted playsinline>
       <source src="../.static/video/pnpm-catalogMode.mp4" type="video/mp4">
     </video>

3. 安装依赖

   * `pnpm i`

     会安装工作空间内所有的依赖

   * `pnpm i -w`

     全称`pnpm i --workspace-root`，仅安装根目录的 package.json 的依赖

   * `pnpm i @<package_name>/<scope> -worskpace`

     安装工作区下的一个范围包依赖

   * `pnpm add --save-catalog`

     安装依赖时，依赖记录在`pnpm-workspace.yaml `文件的默认的catalog目录中

   * `pnpm add --save-catalog-name <catalog_name>`

     安装依赖时，依赖记录在`pnpm-workspace.yaml `文件的具名的catalogs目录中（`<catalog_name>`就是目录名）

   * `pnpm up`

     全称`pnpm update`默认更新依赖版本。

     当 package.json 使用 catalog 目录协议时，pnpm-workspace.yaml 相关的 catalog 选项（单数和复数）会自动更新依赖版本号

     <video controls width="auto" autoplay loop muted playsinline>
       <source src="../.static/video/pnpm-update.mp4" type="video/mp4">
     </video>

     

4. 其他

   1. 过滤

      过滤允许你将命令限制于软件包的特定子集。

      pnpm 支持丰富的选择器语法，可以通过名称或关系选择包。

      可通过 `--filter` (或 `-F`) 标志指定选择器:

      ```shell
      pnpm --filter <package_selector> <command>
      ```

      详情请参考：[过滤](https://pnpm.io/zh/filtering)

### 并行运行项目

为了方便运行多个`scripts`，可以安装 [concurrently](https://github.com/open-cli-tools/concurrently?tab=readme-ov-file#usage)

```shell
pnpm add concurrently -D
```

在命令行使用`concurrently`时可以使用别名`conc`，这样更方便。

并行运行脚本：

```shell
conc 'command1 arg' 'command2 arg'
```

在package.json中:

```json
{
	"scripts": {
		"start": "conc 'command1 arg' 'command2 arg'"
	}
}
```
